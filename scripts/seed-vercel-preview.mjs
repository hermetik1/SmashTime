import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

function parseEnv(text) {
  return Object.fromEntries(text.split(/\r?\n/).flatMap(line => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) return [];
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    return [[match[1], value]];
  }));
}

if (!process.env.DATABASE_URL) throw new Error("Preview-Datenbankzugang fehlt.");
const local = parseEnv(await readFile(".env.local", "utf8"));
const email = local.NEXT_PUBLIC_LOCAL_ADMIN_EMAIL?.trim().toLowerCase();
const password = local.NEXT_PUBLIC_LOCAL_ADMIN_PASSWORD;
if (!email || !password) throw new Error("Lokale Admin-Zugangsdaten fehlen in .env.local.");

const seed = JSON.parse(await readFile("backend/seed.json", "utf8"));
const reference = JSON.parse(await readFile("backend/reference-content.json", "utf8"));
const records = new Map(seed.map(record => [record.id, record]));
for (const record of reference.records) records.set(record.id, record);
if (records.has("website")) records.get("website").data = { ...records.get("website").data, ...reference.settings };

const db = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
try {
  await db.query(`
    CREATE TABLE IF NOT EXISTS st_admins (id BIGSERIAL PRIMARY KEY, email VARCHAR(190) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL);
    CREATE TABLE IF NOT EXISTS st_content (id VARCHAR(100) PRIMARY KEY, kind VARCHAR(30) NOT NULL, slug VARCHAR(190) NOT NULL, draft JSONB NOT NULL, published JSONB, revision VARCHAR(40) NOT NULL);
    CREATE UNIQUE INDEX IF NOT EXISTS st_content_slug ON st_content(kind, slug);
    CREATE TABLE IF NOT EXISTS st_audit (id BIGSERIAL PRIMARY KEY, admin_id BIGINT NOT NULL, action VARCHAR(30) NOT NULL, entity VARCHAR(100) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
    CREATE TABLE IF NOT EXISTS st_login_attempts (fingerprint CHAR(64) PRIMARY KEY, attempts INT NOT NULL, last_attempt BIGINT NOT NULL);
    CREATE TABLE IF NOT EXISTS st_assets (id VARCHAR(32) PRIMARY KEY, mime VARCHAR(40) NOT NULL, content BYTEA NOT NULL);
  `);
  await db.query("INSERT INTO st_admins(email,password_hash) VALUES($1,$2) ON CONFLICT(email) DO NOTHING", [email, await bcrypt.hash(password, 12)]);
  let added = 0;
  for (const record of records.values()) {
    record.updated_at ||= new Date().toISOString();
    const published = record.status === "published" ? record : null;
    const result = await db.query("INSERT INTO st_content(id,kind,slug,draft,published,revision) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO NOTHING", [record.id, record.kind, record.slug, record, published, record.updated_at]);
    added += result.rowCount ?? 0;
  }
  console.log(`Vercel Preview-Datenbank bereit; ${added} Inhaltsdatensätze ergänzt. Admin-Konto wurde angelegt, falls es noch nicht existierte.`);
} finally {
  await db.end();
}
