import { NextResponse } from "next/server";
import { redis } from "../../../lib/redis";

const VIEWS_KEY = "site:views";

export const dynamic = "force-dynamic";

function isRedisConfigured() {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
      (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  );
}

export async function GET() {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { views: null, configured: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const views = (await redis.get(VIEWS_KEY)) ?? 0;
    return NextResponse.json(
      { views: Number(views), configured: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("Failed to read views from Upstash Redis:", err);
    return NextResponse.json(
      { views: null, configured: true, error: "Failed to fetch views" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST() {
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { views: null, configured: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const views = await redis.incr(VIEWS_KEY);
    return NextResponse.json(
      { views: Number(views), configured: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("Failed to increment views in Upstash Redis:", err);
    return NextResponse.json(
      { views: null, configured: true, error: "Failed to update views" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
