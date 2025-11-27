#!/usr/bin/env node
/**
 * MCP Server - Model Context Protocol Server
 *
 * A comprehensive MCP server that provides useful tools and services
 * for AI agents to interact with the local environment.
 *
 * Usage:
 *   npx tsx src/mcp-server/index.ts
 *   or
 *   node dist/mcp-server/index.js
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerFileSystemTools } from "./tools/filesystem.js";
import { registerGitTools } from "./tools/git.js";
import { registerTimeTools } from "./tools/time.js";
import { registerFetchTools } from "./tools/fetch.js";
import { registerMemoryTools } from "./tools/memory.js";
import { registerSystemTools } from "./tools/system.js";

// Server configuration
const SERVER_NAME = "new-project-bundle-mcp";
const SERVER_VERSION = "1.0.0";

/**
 * Initialize and start the MCP server with all registered tools
 */
async function main(): Promise<void> {
  // Create the MCP server instance
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Register all tool modules
  registerFileSystemTools(server);
  registerGitTools(server);
  registerTimeTools(server);
  registerFetchTools(server);
  registerMemoryTools(server);
  registerSystemTools(server);

  // Create transport for stdio communication
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  await server.connect(transport);

  // Log server start to stderr (to avoid interfering with JSON-RPC on stdout)
  console.error(`${SERVER_NAME} v${SERVER_VERSION} started successfully`);
}

// Start the server
main().catch((error: unknown) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
