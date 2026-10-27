import type { Config } from "@netlify/functions";
import { and, eq, gte } from "drizzle-orm";
import { db } from "../../db/index.js";
import { habitChecks } from "../../db/schema.js";

const HABITS = new Set(["ibadah", "olahraga", "belajar", "baca", "hobi"]);
const DEVICE_RE = /^[a-zA-Z0-9-]{8,64}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async (req: Request) => {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const device = url.searchParams.get("device") ?? "";
    const from = url.searchParams.get("from") ?? "1970-01-01";
    if (!DEVICE_RE.test(device) || !DAY_RE.test(from)) {
      return Response.json({ error: "Invalid params" }, { status: 400 });
    }
    const rows = await db
      .select({ habit: habitChecks.habit, day: habitChecks.day })
      .from(habitChecks)
      .where(and(eq(habitChecks.deviceId, device), gte(habitChecks.day, from)));
    return Response.json(rows);
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null);
    const { device, habit, day, done } = body ?? {};
    if (!DEVICE_RE.test(device ?? "") || !HABITS.has(habit) || !DAY_RE.test(day ?? "")) {
      return Response.json({ error: "Invalid body" }, { status: 400 });
    }
    if (done) {
      await db.insert(habitChecks).values({ deviceId: device, habit, day }).onConflictDoNothing();
    } else {
      await db
        .delete(habitChecks)
        .where(and(eq(habitChecks.deviceId, device), eq(habitChecks.habit, habit), eq(habitChecks.day, day)));
    }
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/habits" };
