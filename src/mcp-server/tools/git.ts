/**
 * Git Tools for MCP Server
 *
 * Provides Git repository operations for AI agents
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Execute a git command and return the result
 */
async function executeGit(
  command: string,
  cwd?: string
): Promise<{ success: boolean; output: string }> {
  try {
    const { stdout, stderr } = await execAsync(`git ${command}`, {
      cwd: cwd ?? process.cwd(),
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });
    return { success: true, output: stdout.trim() || stderr.trim() };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, output: errorMessage };
  }
}

/**
 * Register Git tools with the MCP server
 */
export function registerGitTools(server: McpServer): void {
  // Git status tool
  server.tool(
    "git_status",
    "Get the current git status of the repository",
    {
      path: z
        .string()
        .optional()
        .describe("Path to the git repository (defaults to current directory)"),
    },
    async ({ path: repoPath }) => {
      const result = await executeGit("status --porcelain -b", repoPath);
      return {
        content: [
          {
            type: "text" as const,
            text: result.success
              ? result.output || "(No changes)"
              : `Error: ${result.output}`,
          },
        ],
      };
    }
  );

  // Git log tool
  server.tool(
    "git_log",
    "Get the git commit history",
    {
      path: z
        .string()
        .optional()
        .describe("Path to the git repository (defaults to current directory)"),
      limit: z
        .number()
        .optional()
        .default(10)
        .describe("Maximum number of commits to show"),
      format: z
        .enum(["oneline", "short", "medium", "full"])
        .optional()
        .default("oneline")
        .describe("Output format for the log"),
    },
    async ({ path: repoPath, limit, format }) => {
      const result = await executeGit(
        `log --${format} -n ${limit}`,
        repoPath
      );
      return {
        content: [
          {
            type: "text" as const,
            text: result.success
              ? result.output || "(No commits)"
              : `Error: ${result.output}`,
          },
        ],
      };
    }
  );

  // Git diff tool
  server.tool(
    "git_diff",
    "Show changes between commits, commit and working tree, etc",
    {
      path: z
        .string()
        .optional()
        .describe("Path to the git repository (defaults to current directory)"),
      staged: z
        .boolean()
        .optional()
        .default(false)
        .describe("Show staged changes only"),
      file: z.string().optional().describe("Specific file to diff"),
    },
    async ({ path: repoPath, staged, file }) => {
      let command = "diff";
      if (staged) command += " --staged";
      if (file) command += ` -- ${file}`;

      const result = await executeGit(command, repoPath);
      return {
        content: [
          {
            type: "text" as const,
            text: result.success
              ? result.output || "(No differences)"
              : `Error: ${result.output}`,
          },
        ],
      };
    }
  );

  // Git branch tool
  server.tool(
    "git_branch",
    "List, create, or delete branches",
    {
      path: z
        .string()
        .optional()
        .describe("Path to the git repository (defaults to current directory)"),
      action: z
        .enum(["list", "create", "delete"])
        .optional()
        .default("list")
        .describe("Action to perform"),
      branchName: z
        .string()
        .optional()
        .describe("Branch name (required for create/delete)"),
    },
    async ({ path: repoPath, action, branchName }) => {
      let command = "";
      switch (action) {
        case "list":
          command = "branch -a";
          break;
        case "create":
          if (!branchName) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: "Error: Branch name is required for create action",
                },
              ],
            };
          }
          command = `branch ${branchName}`;
          break;
        case "delete":
          if (!branchName) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: "Error: Branch name is required for delete action",
                },
              ],
            };
          }
          command = `branch -d ${branchName}`;
          break;
      }

      const result = await executeGit(command, repoPath);
      return {
        content: [
          {
            type: "text" as const,
            text: result.success
              ? result.output || "Operation completed successfully"
              : `Error: ${result.output}`,
          },
        ],
      };
    }
  );

  // Git show tool
  server.tool(
    "git_show",
    "Show various types of objects (commits, tags, etc)",
    {
      path: z
        .string()
        .optional()
        .describe("Path to the git repository (defaults to current directory)"),
      object: z
        .string()
        .optional()
        .default("HEAD")
        .describe("Object to show (commit hash, tag, etc)"),
      stat: z
        .boolean()
        .optional()
        .default(false)
        .describe("Show only stat information"),
    },
    async ({ path: repoPath, object, stat }) => {
      let command = `show ${object}`;
      if (stat) command += " --stat";

      const result = await executeGit(command, repoPath);
      return {
        content: [
          {
            type: "text" as const,
            text: result.success ? result.output : `Error: ${result.output}`,
          },
        ],
      };
    }
  );

  // Git remote tool
  server.tool(
    "git_remote",
    "Manage remote repositories",
    {
      path: z
        .string()
        .optional()
        .describe("Path to the git repository (defaults to current directory)"),
      verbose: z
        .boolean()
        .optional()
        .default(true)
        .describe("Show remote URLs"),
    },
    async ({ path: repoPath, verbose }) => {
      const command = verbose ? "remote -v" : "remote";
      const result = await executeGit(command, repoPath);
      return {
        content: [
          {
            type: "text" as const,
            text: result.success
              ? result.output || "(No remotes configured)"
              : `Error: ${result.output}`,
          },
        ],
      };
    }
  );

  // Git blame tool
  server.tool(
    "git_blame",
    "Show what revision and author last modified each line of a file",
    {
      path: z
        .string()
        .optional()
        .describe("Path to the git repository (defaults to current directory)"),
      file: z.string().describe("File to blame"),
      lines: z
        .string()
        .optional()
        .describe("Line range in format 'start,end' (e.g., '1,10')"),
    },
    async ({ path: repoPath, file, lines }) => {
      let command = `blame ${file}`;
      if (lines) command += ` -L ${lines}`;

      const result = await executeGit(command, repoPath);
      return {
        content: [
          {
            type: "text" as const,
            text: result.success ? result.output : `Error: ${result.output}`,
          },
        ],
      };
    }
  );
}
