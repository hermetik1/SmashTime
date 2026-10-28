import { Pool } from "pg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const state = globalThis as typeof globalThis & { smashTimeAssetPool?: Pool };
const db = state.smashTimeAssetPool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
state.smashTimeAssetPool = db;

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!/^[a-f0-9]{32}$/.test(id)) return new Response("Not found", { status: 404 });
    const result = await db.query("SELECT mime,content FROM st_assets WHERE id=$1", [id]);
    if (!result.rowCount) return new Response("Not found", { status: 404 });
    return new Response(result.rows[0].content, { headers: { "Content-Type": result.rows[0].mime, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("SmashTime asset API:", error);
    return new Response("Unavailable", { status: 503 });
  }
}
