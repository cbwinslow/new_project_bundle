/**
 * System Tools for MCP Server
 *
 * Provides system information and utility operations for AI agents
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import * as os from "os";

const execAsync = promisify(exec);

// List of allowed safe commands
const SAFE_COMMANDS = [
  "echo",
  "date",
  "whoami",
  "hostname",
  "pwd",
  "ls",
  "cat",
  "head",
  "tail",
  "wc",
  "grep",
  "find",
  "which",
  "env",
  "printenv",
  "uname",
  "uptime",
  "df",
  "du",
  "free",
];

/**
 * Check if a command is safe to execute
 */
function isCommandSafe(command: string): boolean {
  const baseCommand = command.split(/\s+/)[0]?.toLowerCase();
  if (!baseCommand) return false;

  // Reject commands with path components (path traversal attempts)
  if (baseCommand.includes("/") || baseCommand.includes("\\") || baseCommand.startsWith(".")) {
    return false;
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /[;&|`$(){}]/,
    /\bsudo\b/,
    /\brm\b/,
    /\bmv\b/,
    /\bcp\b.*(-[rf]|--recursive|--force)/i,
    /\bchmod\b/,
    /\bchown\b/,
    /\bkill\b/,
    /\bpkill\b/,
    /\bshutdown\b/,
    /\breboot\b/,
    /\bdd\b/,
    /\bmkfs\b/,
    />\s*\//,
  ];

  if (dangerousPatterns.some((pattern) => pattern.test(command))) {
    return false;
  }

  return SAFE_COMMANDS.includes(baseCommand);
}

/**
 * Register system tools with the MCP server
 */
export function registerSystemTools(server: McpServer): void {
  // Get system information
  server.tool(
    "system_info",
    "Get information about the system",
    {},
    async () => {
      const info = {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        hostname: os.hostname(),
        uptime: `${Math.floor(os.uptime() / 3600)} hours`,
        cpus: os.cpus().length,
        totalMemory: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
        freeMemory: `${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`,
        homeDir: os.homedir(),
        tmpDir: os.tmpdir(),
        nodeVersion: process.version,
        pid: process.pid,
        cwd: process.cwd(),
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(info, null, 2),
          },
        ],
      };
    }
  );

  // Get environment variable
  server.tool(
    "get_env",
    "Get the value of an environment variable",
    {
      name: z.string().describe("Name of the environment variable"),
    },
    async ({ name }) => {
      // Don't expose sensitive environment variables
      const sensitivePatterns = [
        /token/i,
        /secret/i,
        /password/i,
        /key/i,
        /auth/i,
        /credential/i,
        /private/i,
      ];

      if (sensitivePatterns.some((pattern) => pattern.test(name))) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Cannot access sensitive environment variable '${name}'`,
            },
          ],
        };
      }

      const value = process.env[name];
      return {
        content: [
          {
            type: "text" as const,
            text:
              value !== undefined
                ? `${name}=${value}`
                : `Environment variable '${name}' is not set`,
          },
        ],
      };
    }
  );

  // List environment variables (filtered)
  server.tool(
    "list_env",
    "List environment variables (sensitive values are filtered)",
    {
      prefix: z
        .string()
        .optional()
        .describe("Filter variables by prefix (e.g., 'NODE_', 'PATH')"),
    },
    async ({ prefix }) => {
      const sensitivePatterns = [
        /token/i,
        /secret/i,
        /password/i,
        /key/i,
        /auth/i,
        /credential/i,
        /private/i,
      ];

      const filtered = Object.entries(process.env)
        .filter(([key]) => !sensitivePatterns.some((p) => p.test(key)))
        .filter(([key]) => (prefix ? key.startsWith(prefix) : true))
        .sort(([a], [b]) => a.localeCompare(b));

      const list = filtered
        .map(([key, value]) => {
          const displayValue =
            value && value.length > 100
              ? value.substring(0, 100) + "..."
              : value;
          return `${key}=${displayValue}`;
        })
        .join("\n");

      return {
        content: [
          {
            type: "text" as const,
            text: list || "No matching environment variables found",
          },
        ],
      };
    }
  );

  // Execute a safe command
  server.tool(
    "run_command",
    "Execute a safe, read-only system command",
    {
      command: z
        .string()
        .describe(
          `Command to execute. Allowed commands: ${SAFE_COMMANDS.join(", ")}`
        ),
      timeout: z
        .number()
        .optional()
        .default(10000)
        .describe("Command timeout in milliseconds"),
    },
    async ({ command, timeout }) => {
      if (!isCommandSafe(command)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Command not allowed. Allowed commands: ${SAFE_COMMANDS.join(", ")}`,
            },
          ],
        };
      }

      try {
        const { stdout, stderr } = await execAsync(command, {
          timeout,
          maxBuffer: 1024 * 1024, // 1MB
        });

        const output = stdout.trim() || stderr.trim();
        return {
          content: [
            {
              type: "text" as const,
              text: output || "(no output)",
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
              text: `Error executing command: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // Calculate hash
  server.tool(
    "calculate_hash",
    "Calculate a hash of a string",
    {
      input: z.string().describe("String to hash"),
      algorithm: z
        .enum(["md5", "sha1", "sha256", "sha512"])
        .optional()
        .default("sha256")
        .describe("Hash algorithm to use"),
    },
    async ({ input, algorithm }) => {
      const crypto = await import("crypto");
      const hash = crypto.createHash(algorithm).update(input).digest("hex");

      return {
        content: [
          {
            type: "text" as const,
            text: `${algorithm.toUpperCase()}: ${hash}`,
          },
        ],
      };
    }
  );

  // Generate random values
  server.tool(
    "random_generate",
    "Generate random values",
    {
      type: z
        .enum(["uuid", "number", "string", "bytes"])
        .describe("Type of random value to generate"),
      length: z
        .number()
        .optional()
        .default(16)
        .describe("Length for string/bytes generation"),
      min: z
        .number()
        .optional()
        .default(0)
        .describe("Minimum value for number generation"),
      max: z
        .number()
        .optional()
        .default(100)
        .describe("Maximum value for number generation"),
    },
    async ({ type, length, min, max }) => {
      const crypto = await import("crypto");
      let result: string;

      switch (type) {
        case "uuid":
          result = crypto.randomUUID();
          break;
        case "number":
          result = (
            Math.floor(Math.random() * (max - min + 1)) + min
          ).toString();
          break;
        case "string":
          result = crypto
            .randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .slice(0, length);
          break;
        case "bytes":
          result = crypto.randomBytes(length).toString("base64");
          break;
        default:
          result = crypto.randomUUID();
      }

      return {
        content: [
          {
            type: "text" as const,
            text: result,
          },
        ],
      };
    }
  );

  // Base64 encode/decode
  server.tool(
    "base64",
    "Encode or decode Base64 strings",
    {
      action: z.enum(["encode", "decode"]).describe("Action to perform"),
      input: z.string().describe("String to encode or decode"),
    },
    async ({ action, input }) => {
      try {
        let result: string;
        if (action === "encode") {
          result = Buffer.from(input).toString("base64");
        } else {
          result = Buffer.from(input, "base64").toString("utf-8");
        }

        return {
          content: [
            {
              type: "text" as const,
              text: result,
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
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // JSON operations
  server.tool(
    "json_format",
    "Format or validate JSON",
    {
      input: z.string().describe("JSON string to format or validate"),
      action: z
        .enum(["format", "minify", "validate"])
        .optional()
        .default("format")
        .describe("Action to perform"),
    },
    async ({ input, action }) => {
      try {
        const parsed = JSON.parse(input);

        switch (action) {
          case "format":
            return {
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify(parsed, null, 2),
                },
              ],
            };
          case "minify":
            return {
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify(parsed),
                },
              ],
            };
          case "validate":
            return {
              content: [
                {
                  type: "text" as const,
                  text: "Valid JSON",
                },
              ],
            };
          default:
            return {
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify(parsed, null, 2),
                },
              ],
            };
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text:
                action === "validate"
                  ? `Invalid JSON: ${errorMessage}`
                  : `Error parsing JSON: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
