import { handleRest } from "./_agent/rest.js";
import { APP, routes } from "./_agent/routes.js";

// Agent surface — REST (Vercel Function, Web handler signature).
// Every operation comes from api/_agent/routes.ts; the same table generates
// /api/openapi.json and the MCP tools at /api/mcp.
function handler(req: Request): Promise<Response> {
  // vercel.json rewrites /api/v1/:path* → /api/v1?path=:path* (a [...path] function only
  // matched one segment on Vercel). Take the sub path from that param, drop it before
  // validation, and fall back to the pathname for direct hits.
  const url = new URL(req.url);
  const seg = url.searchParams.get("path") ?? url.searchParams.get("...path");
  url.searchParams.delete("path");
  url.searchParams.delete("...path");
  const sub = seg ? "/" + seg : url.pathname.replace(/^\/api\/v1/, "");
  return handleRest(new Request(url, req), APP, routes, sub);
}

export { handler as GET, handler as POST };
