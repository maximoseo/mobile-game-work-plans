import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Fleet SSO (owner directive 2026-10-04): the dashboards panel mints a
 * domain-wide `fleet_session` cookie on .maximo-seo.ai ({email, exp} + HMAC).
 * This app's own auth is a client-side Supabase session, so a valid fleet
 * cookie is how a panel-authenticated operator is recognised. 200 = signed in.
 */

function fleetValid(req: Request): boolean {
  const secret = (process.env.PANEL_AUTH_SECRET || "").trim();
  if (!secret) return false;
  const m = /(?:^|;\s*)fleet_session=([^;]+)/.exec(req.headers.get("cookie") || "");
  const token = m?.[1];
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const expected = createHmac("sha256", secret).update(body).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      email?: string;
      exp?: number;
    };
    return Boolean(data.email && typeof data.exp === "number" && data.exp > Date.now());
  } catch {
    return false;
  }
}

function handler(req: Request): Response {
  const ok = fleetValid(req);
  return new Response(JSON.stringify({ ok }), {
    status: ok ? 200 : 401,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export { handler as GET };
