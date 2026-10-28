import { createHmac, randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { recordSchema, validateRecord, type ContentRecord } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Session = { admin: number | null; csrf: string; exp: number };
const cookieName = "st_control";
const maxAge = 60 * 60;
const pool = globalThis as typeof globalThis & { smashTimePool?: Pool; smashTimeSchema?: Promise<void> };
const db = pool.smashTimePool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
pool.smashTimePool = db;

function secret() {
  const value = process.env.CMS_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("CMS_SESSION_SECRET fehlt.");
  return value;
}
function encode(value: string) { return Buffer.from(value).toString("base64url"); }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }
function makeSession(session: Session) { const payload = encode(JSON.stringify(session)); return `${payload}.${sign(payload)}`; }
function readSession(request: Request): Session | null {
  const raw = request.headers.get("cookie")?.split(";").map(x => x.trim()).find(x => x.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload)); const supplied = Buffer.from(signature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try { const value = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session; return value.exp > Date.now() ? value : null; } catch { return null; }
}
function json(data: unknown, status = 200, session?: Session | null) {
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  if (session !== undefined) headers.append("Set-Cookie", session ? `${cookieName}=${makeSession(session)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict` : `${cookieName}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`);
  return new Response(JSON.stringify(data), { status, headers });
}
function fail(message: string, status = 400) { return json({ error: message }, status); }
function newSession(admin: number | null = null): Session { return { admin, csrf: randomBytes(32).toString("hex"), exp: Date.now() + maxAge * 1000 }; }
async function schema() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL fehlt.");
  pool.smashTimeSchema ??= db.query(`
    CREATE TABLE IF NOT EXISTS st_admins (id BIGSERIAL PRIMARY KEY, email VARCHAR(190) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL);
    CREATE TABLE IF NOT EXISTS st_content (id VARCHAR(100) PRIMARY KEY, kind VARCHAR(30) NOT NULL, slug VARCHAR(190) NOT NULL, draft JSONB NOT NULL, published JSONB, revision VARCHAR(40) NOT NULL);
    CREATE UNIQUE INDEX IF NOT EXISTS st_content_slug ON st_content(kind, slug);
    CREATE TABLE IF NOT EXISTS st_audit (id BIGSERIAL PRIMARY KEY, admin_id BIGINT NOT NULL, action VARCHAR(30) NOT NULL, entity VARCHAR(100) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS st_login_attempts (fingerprint CHAR(64) PRIMARY KEY, attempts INT NOT NULL, last_attempt BIGINT NOT NULL);
    CREATE TABLE IF NOT EXISTS st_assets (id VARCHAR(32) PRIMARY KEY, mime VARCHAR(40) NOT NULL, content BYTEA NOT NULL);
  `).then(() => undefined).catch(error => { pool.smashTimeSchema = undefined; throw error; });
  await pool.smashTimeSchema;
}
async function body(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (Buffer.byteLength(text) > 7_500_000) throw new Error("Anfrage zu groß.");
  const value = JSON.parse(text || "{}");
  if (!value || Array.isArray(value) || typeof value !== "object") throw new Error("Ungültige Anfrage.");
  return value as Record<string, unknown>;
}
const timestamp = () => new Date().toISOString();
const idPattern = /^[a-zA-Z0-9-]{1,100}$/;

export async function GET(request: Request) {
  try {
    await schema();
    const action = new URL(request.url).searchParams.get("action") ?? "public";
    if (action === "public") {
      const result = await db.query("SELECT published FROM st_content WHERE published IS NOT NULL");
      return json({ published: result.rows.map(row => row.published) });
    }
    const session = readSession(request) ?? newSession();
    if (action === "session") return json({ authenticated: Boolean(session.admin), csrf: session.csrf }, 200, session);
    if (!session.admin) return json({ error: "Bitte anmelden." }, 401, session);
    if (action === "records") {
      const result = await db.query("SELECT draft,published FROM st_content");
      return json({ drafts: result.rows.map(row => row.draft), published: result.rows.flatMap(row => row.published ? [row.published] : []) }, 200, session);
    }
    if (action === "audit") {
      const result = await db.query("SELECT action,entity,created_at FROM st_audit ORDER BY id DESC LIMIT 100");
      return json({ items: result.rows }, 200, session);
    }
    return json({ error: "Unbekannte Aktion." }, 404, session);
  } catch (error) { console.error("SmashTime Vercel API:", error); return fail("Serverfehler. Bitte erneut versuchen.", 500); }
}

export async function POST(request: Request) {
  let session = readSession(request);
  try {
    await schema();
    const input = await body(request);
    const action = new URL(request.url).searchParams.get("action") ?? "";
    if (!session) session = newSession();
    const csrf = request.headers.get("x-csrf-token") ?? "";
    if (!csrf || csrf !== session.csrf) return json({ error: "Sitzung abgelaufen. Bitte Seite neu laden." }, 403, session);
    if (action === "login") {
      const email = String(input.email ?? "").trim().toLowerCase();
      const fingerprint = createHash("sha256").update(`${request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown"}:${email}`).digest("hex");
      const attempt = await db.query("SELECT attempts,last_attempt FROM st_login_attempts WHERE fingerprint=$1", [fingerprint]);
      const now = Math.floor(Date.now() / 1000);
      if (attempt.rowCount && attempt.rows[0].attempts >= 8 && now - Number(attempt.rows[0].last_attempt) < 900) return fail("Zu viele Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.", 429);
      const user = await db.query("SELECT id,password_hash FROM st_admins WHERE email=$1", [email]);
      if (!user.rowCount || !await bcrypt.compare(String(input.password ?? ""), user.rows[0].password_hash)) {
        const count = attempt.rowCount && now - Number(attempt.rows[0].last_attempt) < 900 ? Number(attempt.rows[0].attempts) + 1 : 1;
        await db.query("INSERT INTO st_login_attempts VALUES($1,$2,$3) ON CONFLICT(fingerprint) DO UPDATE SET attempts=EXCLUDED.attempts,last_attempt=EXCLUDED.last_attempt", [fingerprint, count, now]);
        return fail("E-Mail oder Passwort ist nicht korrekt.", 401);
      }
      await db.query("DELETE FROM st_login_attempts WHERE fingerprint=$1", [fingerprint]);
      const next = newSession(Number(user.rows[0].id));
      return json({ ok: true, csrf: next.csrf }, 200, next);
    }
    if (!session.admin) return json({ error: "Bitte anmelden." }, 401, session);
    if (action === "logout") return json({ ok: true }, 200, null);
    if (action === "save") {
      const publish = input.publish === true;
      const record = input.record as ContentRecord;
      if (record && publish) record.status = "published";
      try { recordSchema.parse(record); } catch { return fail("Ungültiger Inhalt oder fehlender Name."); }
      const client = await db.connect();
      try {
        await client.query("BEGIN");
        const existing = await client.query("SELECT kind,draft,published,revision FROM st_content WHERE id=$1 FOR UPDATE", [record.id]);
        const old = existing.rows[0];
        if ((old?.revision ?? null) !== (input.expected ?? null)) { await client.query("ROLLBACK"); return json({ error: "Der Eintrag wurde zwischenzeitlich geändert. Bitte neu laden." }, 409, session); }
        const allRows = await client.query("SELECT id,draft,published FROM st_content FOR UPDATE");
        const drafts = allRows.rows.map(row => row.draft as ContentRecord);
        const published = allRows.rows.flatMap(row => row.published ? [row.published as ContentRecord] : []);
        try { validateRecord(record, drafts, published); } catch (error) {
          await client.query("ROLLBACK");
          return json({ error: error instanceof Error ? error.message : "Ungültiger Inhalt." }, 400, session);
        }
        if (record.status === "archived") {
          const references = allRows.rows.filter(row => row.id !== record.id).flatMap(row => [row.draft, row.published].filter(Boolean));
          const keys = ["event", "featuredEvent", "fighterA", "fighterB", "fighterA2", "fighterB2", "discipline"];
          if (references.some(item => item.status !== "archived" && keys.some(key => item.data?.[key] === record.id))) { await client.query("ROLLBACK"); return json({ error: "Der Eintrag wird noch verwendet. Bitte zuerst die Verknüpfungen entfernen." }, 409, session); }
        }
        const duplicate = await client.query("SELECT id FROM st_content WHERE kind=$1 AND slug=$2 AND id<>$3 LIMIT 1", [record.kind, record.slug, record.id]);
        if (duplicate.rowCount) { await client.query("ROLLBACK"); return json({ error: "Diese URL-Kennung ist bereits vergeben." }, 409, session); }
        if (record.kind === "settings") {
          const settings = await client.query("SELECT id FROM st_content WHERE kind='settings' AND id<>$1 LIMIT 1", [record.id]);
          if (settings.rowCount) { await client.query("ROLLBACK"); return json({ error: "Die Website-Einstellungen existieren bereits. Bitte den vorhandenen Eintrag bearbeiten." }, 409, session); }
        }
        if (old && old.kind !== record.kind) { await client.query("ROLLBACK"); return json({ error: "Inhaltstyp darf nicht geändert werden." }, 409, session); }
        record.updated_at = timestamp();
        const publicRecord = record.status === "archived" ? null : publish ? record : old?.published ?? null;
        await client.query("INSERT INTO st_content(id,kind,slug,draft,published,revision) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO UPDATE SET slug=EXCLUDED.slug,draft=EXCLUDED.draft,published=EXCLUDED.published,revision=EXCLUDED.revision", [record.id, record.kind, record.slug, record, publicRecord, record.updated_at]);
        await client.query("INSERT INTO st_audit(admin_id,action,entity) VALUES($1,$2,$3)", [session.admin, publish ? "publish" : record.status, record.id]);
        await client.query("COMMIT");
        return json({ ok: true }, 200, session);
      } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
    }
    if (action === "delete") {
      const id = String(input.id ?? "");
      if (!idPattern.test(id)) return fail("Ungültiger Eintrag.");
      const client = await db.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query("SELECT draft,published,revision FROM st_content WHERE id=$1 FOR UPDATE", [id]);
        const row = result.rows[0];
        if (!row) { await client.query("ROLLBACK"); return json({ error: "Eintrag nicht gefunden." }, 404, session); }
        if (row.revision !== input.expected || row.draft.status !== "archived" || row.published) { await client.query("ROLLBACK"); return json({ error: "Bitte den Eintrag zuerst archivieren und neu laden." }, 409, session); }
        const refs = await client.query("SELECT draft,published FROM st_content WHERE id<>$1", [id]);
        const referenceKeys = ["event", "featuredEvent", "fighterA", "fighterB", "fighterA2", "fighterB2", "discipline"];
        if (refs.rows.some(item => [item.draft, item.published].filter(Boolean).some(record => referenceKeys.some(key => record.data?.[key] === id)))) { await client.query("ROLLBACK"); return json({ error: "Der Eintrag wird noch verwendet. Bitte zuerst die Verknüpfungen entfernen." }, 409, session); }
        await client.query("DELETE FROM st_content WHERE id=$1", [id]);
        await client.query("INSERT INTO st_audit(admin_id,action,entity) VALUES($1,'delete',$2)", [session.admin, id]);
        await client.query("COMMIT"); return json({ ok: true }, 200, session);
      } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
    }
    if (action === "password") {
      const user = await db.query("SELECT password_hash FROM st_admins WHERE id=$1", [session.admin]);
      if (!await bcrypt.compare(String(input.current ?? ""), user.rows[0]?.password_hash ?? "")) return fail("Aktuelles Passwort ist falsch.", 403);
      if (String(input.next ?? "").length < 10) return fail("Bitte mindestens 10 Zeichen verwenden.");
      const hash = await bcrypt.hash(String(input.next), 12);
      await db.query("UPDATE st_admins SET password_hash=$1 WHERE id=$2", [hash, session.admin]);
      return json({ ok: true }, 200, newSession(session.admin));
    }
    if (action === "reorder") {
      const event = String(input.event ?? "");
      const ids = input.ids;
      const expected = input.expected;
      const publish = input.publish === true;
      if (!event || !Array.isArray(ids) || !ids.length || ids.length > 200 || ids.some(id => typeof id !== "string" || !idPattern.test(id)) || new Set(ids).size !== ids.length || !expected || typeof expected !== "object" || Array.isArray(expected)) return fail("Ungültige Fightcard-Reihenfolge.");
      const client = await db.connect();
      try {
        await client.query("BEGIN");
        const rows = await client.query("SELECT id,kind,draft,published,revision FROM st_content ORDER BY id FOR UPDATE");
        const eventRow = rows.rows.find(row => row.id === event && row.kind === "events" && row.draft.status !== "archived");
        const fights = rows.rows.filter(row => row.kind === "fightcards" && row.draft.status !== "archived" && row.draft.data?.event === event);
        const fightIds = fights.map(row => row.id);
        if (!eventRow) { await client.query("ROLLBACK"); return json({ error: "Event nicht verfügbar." }, 404, session); }
        if (ids.length !== fights.length || ids.some(id => !fightIds.includes(id))) { await client.query("ROLLBACK"); return json({ error: "Die Fightcard wurde verändert. Bitte neu laden." }, 409, session); }
        const expectedRevisions = expected as Record<string, unknown>;
        if (fights.some(row => expectedRevisions[row.id] !== row.revision)) { await client.query("ROLLBACK"); return json({ error: "Ein Kampf wurde zwischenzeitlich bearbeitet. Bitte neu laden." }, 409, session); }
        for (let index = 0; index < ids.length; index++) {
          const row = fights.find(item => item.id === ids[index]);
          if (!row) continue;
          const updated = timestamp();
          const draft = { ...row.draft, data: { ...row.draft.data, order: index + 1 }, updated_at: updated };
          const publicRecord = row.published ? { ...row.published, data: { ...row.published.data, order: index + 1 }, updated_at: updated } : null;
          if (!publish && publicRecord) draft.status = "draft";
          await client.query("UPDATE st_content SET draft=$1,published=$2,revision=$3 WHERE id=$4", [draft, publicRecord, updated, row.id]);
          await client.query("INSERT INTO st_audit(admin_id,action,entity) VALUES($1,$2,$3)", [session.admin, publish ? "reorder-publish" : "reorder-draft", row.id]);
        }
        await client.query("COMMIT");
        return json({ ok: true }, 200, session);
      } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
    }
    if (action === "upload") {
      const data = String(input.content ?? "");
      const bytes = Buffer.from(data, "base64");
      if (!data || bytes.length > 5_000_000) return fail("Das Bild darf maximal 5 MB groß sein.");
      let converted: Buffer;
      try {
        const image = sharp(bytes, { limitInputPixels: 24_000_000, failOn: "error" });
        const metadata = await image.metadata();
        if (!metadata.width || !metadata.height || !["jpeg", "png", "webp"].includes(metadata.format ?? "") || metadata.width * metadata.height > 24_000_000) return fail("Bitte ein gültiges JPG, PNG oder WebP mit maximal 24 Megapixeln auswählen.");
        converted = await image.rotate().resize({ width: 2000, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
      } catch { return fail("Bitte ein gültiges JPG, PNG oder WebP mit maximal 24 Megapixeln auswählen."); }
      const id = randomBytes(16).toString("hex");
      await db.query("INSERT INTO st_assets(id,mime,content) VALUES($1,'image/webp',$2)", [id, converted]);
      return json({ url: `/api/assets/${id}` }, 200, session);
    }
    return json({ error: "Unbekannte Aktion." }, 404, session);
  } catch (error) {
    console.error("SmashTime Vercel API:", error);
    if (error instanceof SyntaxError) return fail("Ungültige Anfrage: Bitte gültiges JSON senden.");
    return fail("Serverfehler. Bitte erneut versuchen.", 500);
  }
}
