/**
 * File System Tools for MCP Server
 *
 * Provides secure file system operations for AI agents
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Define allowed base paths for security
const ALLOWED_PATHS = [process.cwd()];

/**
 * Validate that a path is within allowed directories
 */
function isPathAllowed(filePath: string): boolean {
  const absolutePath = path.resolve(filePath);
  return ALLOWED_PATHS.some((allowedPath) =>
    absolutePath.startsWith(path.resolve(allowedPath))
  );
}

/**
 * Register file system tools with the MCP server
 */
export function registerFileSystemTools(server: McpServer): void {
  // Read file tool
  server.tool(
    "read_file",
    "Read the contents of a file from the filesystem",
    {
      path: z.string().describe("Path to the file to read"),
      encoding: z
        .enum(["utf-8", "base64"])
        .optional()
        .default("utf-8")
        .describe("Encoding to use when reading the file"),
    },
    async ({ path: filePath, encoding }) => {
      if (!isPathAllowed(filePath)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Access denied. Path '${filePath}' is outside allowed directories.`,
            },
          ],
        };
      }

      try {
        const absolutePath = path.resolve(filePath);
        const content = await fs.readFile(
          absolutePath,
          encoding as BufferEncoding
        );
        return {
          content: [
            {
              type: "text" as const,
              text: content.toString(),
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error reading file: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // Write file tool
  server.tool(
    "write_file",
    "Write content to a file on the filesystem",
    {
      path: z.string().describe("Path to the file to write"),
      content: z.string().describe("Content to write to the file"),
      createDirectories: z
        .boolean()
        .optional()
        .default(false)
        .describe("Create parent directories if they don't exist"),
    },
    async ({ path: filePath, content, createDirectories }) => {
      if (!isPathAllowed(filePath)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Access denied. Path '${filePath}' is outside allowed directories.`,
            },
          ],
        };
      }

      try {
        const absolutePath = path.resolve(filePath);

        if (createDirectories) {
          await fs.mkdir(path.dirname(absolutePath), { recursive: true });
        }

        await fs.writeFile(absolutePath, content, "utf-8");
        return {
          content: [
            {
              type: "text" as const,
              text: `Successfully wrote ${content.length} bytes to ${absolutePath}`,
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error writing file: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // List directory tool
  server.tool(
    "list_directory",
    "List contents of a directory",
    {
      path: z.string().describe("Path to the directory to list"),
      recursive: z
        .boolean()
        .optional()
        .default(false)
        .describe("Recursively list contents"),
      maxDepth: z
        .number()
        .optional()
        .default(3)
        .describe("Maximum depth for recursive listing"),
    },
    async ({ path: dirPath, recursive, maxDepth }) => {
      if (!isPathAllowed(dirPath)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Access denied. Path '${dirPath}' is outside allowed directories.`,
            },
          ],
        };
      }

      try {
        const absolutePath = path.resolve(dirPath);

        async function listDir(
          currentPath: string,
          depth: number
        ): Promise<string[]> {
          const entries = await fs.readdir(currentPath, { withFileTypes: true });
          const results: string[] = [];

          for (const entry of entries) {
            const entryPath = path.join(currentPath, entry.name);
            const relativePath = path.relative(absolutePath, entryPath);
            const prefix = entry.isDirectory() ? "[DIR] " : "[FILE]";
            results.push(`${prefix} ${relativePath || entry.name}`);

            if (recursive && entry.isDirectory() && depth < maxDepth) {
              const subEntries = await listDir(entryPath, depth + 1);
              results.push(...subEntries.map((e) => `  ${e}`));
            }
          }

          return results;
        }

        const listing = await listDir(absolutePath, 0);
        return {
          content: [
            {
              type: "text" as const,
              text: listing.length > 0 ? listing.join("\n") : "(empty directory)",
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error listing directory: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // File info tool
  server.tool(
    "file_info",
    "Get information about a file or directory",
    {
      path: z.string().describe("Path to the file or directory"),
    },
    async ({ path: filePath }) => {
      if (!isPathAllowed(filePath)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Access denied. Path '${filePath}' is outside allowed directories.`,
            },
          ],
        };
      }

      try {
        const absolutePath = path.resolve(filePath);
        const stats = await fs.stat(absolutePath);

        const info = {
          path: absolutePath,
          type: stats.isDirectory() ? "directory" : "file",
          size: stats.size,
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString(),
          accessed: stats.atime.toISOString(),
          mode: stats.mode.toString(8),
        };

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error getting file info: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // Search files tool
  server.tool(
    "search_files",
    "Search for files matching a pattern",
    {
      directory: z.string().describe("Directory to search in"),
      pattern: z
        .string()
        .describe("Glob pattern or substring to search for in file names"),
      maxResults: z
        .number()
        .optional()
        .default(100)
        .describe("Maximum number of results to return"),
    },
    async ({ directory, pattern, maxResults }) => {
      if (!isPathAllowed(directory)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Access denied. Path '${directory}' is outside allowed directories.`,
            },
          ],
        };
      }

      try {
        const absolutePath = path.resolve(directory);
        const results: string[] = [];

        async function searchDir(currentPath: string): Promise<void> {
          if (results.length >= maxResults) return;

          const entries = await fs.readdir(currentPath, { withFileTypes: true });

          for (const entry of entries) {
            if (results.length >= maxResults) break;

            const entryPath = path.join(currentPath, entry.name);

            if (entry.name.toLowerCase().includes(pattern.toLowerCase())) {
              results.push(path.relative(absolutePath, entryPath));
            }

            if (entry.isDirectory()) {
              await searchDir(entryPath);
            }
          }
        }

        await searchDir(absolutePath);

        return {
          content: [
            {
              type: "text" as const,
              text:
                results.length > 0
                  ? `Found ${results.length} matches:\n${results.join("\n")}`
                  : "No files found matching the pattern",
            },
          ],
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error searching files: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
