import { buildMcpHandler } from "./_agent/mcp.js";
import { APP, routes } from "./_agent/routes.js";

// Agent surface — MCP (Streamable HTTP, Vercel Function, Web handler signature).
// Bearer AGENT_API_KEY required for every method including initialize and tools/list.
const handler = buildMcpHandler(APP, routes);

export { handler as GET, handler as POST };
