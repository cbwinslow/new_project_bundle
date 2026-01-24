/**
 * MCP Configuration Tools for MCP Server
 *
 * Provides tools for setting up and managing MCP server configurations
 * for various AI clients (Claude Desktop, Cursor, etc.)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFile, writeFile, mkdir } from "fs/promises";
import { homedir } from "os";
import { join, dirname } from "path";

/**
 * Get configuration templates for different MCP clients
 */
function getConfigTemplate(
  client: string,
  serverPath: string,
  serverName: string = "new-project-bundle"
): string {
  const configs: Record<string, string> = {
    "claude-desktop": JSON.stringify(
      {
        mcpServers: {
          [serverName]: {
            command: "node",
            args: [serverPath],
            env: {},
          },
        },
      },
      null,
      2
    ),
    cursor: JSON.stringify(
      {
        mcpServers: {
          [serverName]: {
            command: "node",
            args: [serverPath],
          },
        },
      },
      null,
      2
    ),
    cline: JSON.stringify(
      {
        mcpServers: {
          [serverName]: {
            command: "node",
            args: [serverPath],
            disabled: false,
          },
        },
      },
      null,
      2
    ),
    generic: JSON.stringify(
      {
        name: serverName,
        version: "1.0.0",
        description: "New Project Bundle MCP Server",
        server: {
          command: "node",
          args: [serverPath],
          env: {
            NODE_ENV: "production",
          },
        },
        capabilities: {
          tools: true,
          resources: false,
          prompts: false,
        },
      },
      null,
      2
    ),
  };

  return configs[client] || configs.generic;
}

/**
 * Get the default config path for a client
 */
function getDefaultConfigPath(client: string): string {
  const home = homedir();
  const paths: Record<string, string> = {
    "claude-desktop": join(home, ".config", "claude", "claude_desktop_config.json"),
    cursor: join(home, ".cursor", "mcp.json"),
    cline: join(home, ".cline", "mcp_settings.json"),
  };
  return paths[client] || join(home, ".mcp", "config.json");
}

/**
 * Register MCP configuration tools with the MCP server
 */
export function registerMcpConfigTools(server: McpServer): void {
  // Generate MCP configuration for a client
  server.tool(
    "mcp_generate_config",
    "Generate MCP server configuration for various AI clients",
    {
      client: z
        .enum(["claude-desktop", "cursor", "cline", "generic"])
        .describe("Target AI client"),
      serverPath: z
        .string()
        .describe("Absolute path to the MCP server entry point (e.g., /path/to/dist/mcp-server/index.js)"),
      serverName: z
        .string()
        .optional()
        .describe("Name for the MCP server (defaults to 'new-project-bundle')"),
    },
    async ({ client, serverPath, serverName }) => {
      const config = getConfigTemplate(client, serverPath, serverName);
      const configPath = getDefaultConfigPath(client);

      return {
        content: [
          {
            type: "text",
            text: `# MCP Configuration for ${client}\n\n## Configuration File\n\`\`\`json\n${config}\n\`\`\`\n\n## Installation Path\n\`${configPath}\`\n\n## Setup Instructions\n\n1. Create the configuration directory if it doesn't exist:\n   \`\`\`bash\n   mkdir -p ${dirname(configPath)}\n   \`\`\`\n\n2. Save the configuration to the file:\n   \`\`\`bash\n   cat > ${configPath} << 'EOF'\n${config}\nEOF\n   \`\`\`\n\n3. Restart ${client} to load the new configuration\n\n4. Verify the MCP server appears in the available tools`,
          },
        ],
      };
    }
  );

  // Install MCP configuration (actually write to file)
  server.tool(
    "mcp_install_config",
    "Install MCP server configuration to the appropriate location for a client",
    {
      client: z
        .enum(["claude-desktop", "cursor", "cline", "generic"])
        .describe("Target AI client"),
      serverPath: z
        .string()
        .describe("Absolute path to the MCP server entry point"),
      serverName: z
        .string()
        .optional()
        .describe("Name for the MCP server (defaults to 'new-project-bundle')"),
      merge: z
        .boolean()
        .optional()
        .describe("Merge with existing config if it exists (default: false)"),
    },
    async ({ client, serverPath, serverName = "new-project-bundle", merge = false }) => {
      const configPath = getDefaultConfigPath(client);
      const newConfig = JSON.parse(
        getConfigTemplate(client, serverPath, serverName)
      );

      try {
        // Create directory if it doesn't exist
        await mkdir(dirname(configPath), { recursive: true });

        let finalConfig = newConfig;

        // Try to read existing config if merge is requested
        if (merge) {
          try {
            const existingContent = await readFile(configPath, "utf-8");
            const existingConfig = JSON.parse(existingContent);

            // Merge mcpServers objects
            if (existingConfig.mcpServers && newConfig.mcpServers) {
              finalConfig = {
                ...existingConfig,
                mcpServers: {
                  ...existingConfig.mcpServers,
                  ...newConfig.mcpServers,
                },
              };
            }
          } catch {
            // File doesn't exist or invalid JSON, use new config
          }
        }

        // Write the configuration
        await writeFile(configPath, JSON.stringify(finalConfig, null, 2), "utf-8");

        return {
          content: [
            {
              type: "text",
              text: `✅ MCP configuration installed successfully!\n\n**Client:** ${client}\n**Config Path:** ${configPath}\n**Server Name:** ${serverName}\n**Action:** ${merge ? "Merged" : "Created"}\n\n**Next Steps:**\n1. Restart ${client}\n2. Verify the MCP server appears in available tools\n3. Test the connection`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `❌ Error installing MCP configuration: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );

  // List MCP server configuration locations
  server.tool(
    "mcp_list_config_paths",
    "List configuration file locations for various MCP clients",
    {},
    async () => {
      const clients = ["claude-desktop", "cursor", "cline", "generic"];
      const paths = clients.map((client) => ({
        client,
        path: getDefaultConfigPath(client),
      }));

      const pathsList = paths
        .map(({ client, path }) => `- **${client}**: \`${path}\``)
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `# MCP Configuration Paths\n\n${pathsList}\n\n## Notes\n- Claude Desktop: macOS/Linux configuration\n- Cursor: IDE-specific MCP configuration\n- Cline: VS Code extension configuration\n- Generic: Fallback for other MCP clients`,
          },
        ],
      };
    }
  );

  // Check current MCP configuration
  server.tool(
    "mcp_check_config",
    "Check if MCP configuration exists for a client and show its contents",
    {
      client: z
        .enum(["claude-desktop", "cursor", "cline", "generic"])
        .describe("Target AI client"),
    },
    async ({ client }) => {
      const configPath = getDefaultConfigPath(client);

      try {
        const content = await readFile(configPath, "utf-8");
        const config = JSON.parse(content);

        return {
          content: [
            {
              type: "text",
              text: `# Current MCP Configuration for ${client}\n\n**Path:** \`${configPath}\`\n**Status:** ✅ Exists\n\n## Configuration\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\`\n\n## Registered MCP Servers\n${
                config.mcpServers
                  ? Object.keys(config.mcpServers)
                      .map((name) => `- ${name}`)
                      .join("\n")
                  : "None"
              }`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `# MCP Configuration for ${client}\n\n**Path:** \`${configPath}\`\n**Status:** ❌ Not found\n\nUse \`mcp_generate_config\` or \`mcp_install_config\` to create a configuration.`,
            },
          ],
        };
      }
    }
  );

  // Get setup instructions
  server.tool(
    "mcp_setup_guide",
    "Get comprehensive setup instructions for MCP servers",
    {
      includeRemote: z
        .boolean()
        .optional()
        .describe("Include remote/cloud setup instructions (default: false)"),
    },
    async ({ includeRemote = false }) => {
      let guide = `# MCP Server Setup Guide

## Local Setup

### Prerequisites
- Node.js 18+ installed
- Built MCP server (\`npm run build\`)

### Step 1: Build the MCP Server
\`\`\`bash
cd /path/to/new_project_bundle
npm install
npm run build
\`\`\`

### Step 2: Get the Server Path
\`\`\`bash
# Get absolute path to the built server
pwd  # Should output: /path/to/new_project_bundle
# Server entry point: /path/to/new_project_bundle/dist/mcp-server/index.js
\`\`\`

### Step 3: Configure Your AI Client

#### Claude Desktop
1. Open \`~/.config/claude/claude_desktop_config.json\`
2. Add the MCP server configuration
3. Restart Claude Desktop

#### Cursor IDE
1. Open \`~/.cursor/mcp.json\`
2. Add the MCP server configuration
3. Restart Cursor

#### Cline (VS Code Extension)
1. Open \`~/.cline/mcp_settings.json\`
2. Add the MCP server configuration
3. Reload VS Code window

### Step 4: Verify Installation
1. Restart your AI client
2. Check available tools - you should see MCP server tools
3. Test a simple tool like \`system_info\` or \`get_current_time\`

## Using MCP Tools

Once configured, you can use tools like:
- \`github_repo_info\` - Get repository information
- \`github_user_repos\` - List user repositories
- \`rules_list\` - List development rules
- \`memory_set\` / \`memory_get\` - Store/retrieve data
- \`git_status\`, \`git_log\` - Git operations
- And many more!

## Troubleshooting

### MCP Server Not Appearing
- Verify Node.js is in PATH
- Check server path is absolute and correct
- Ensure configuration JSON is valid
- Restart the AI client completely

### Permission Errors
- Ensure the server file is readable
- Check Node.js can execute the file
- Verify config directory exists

### Tools Not Working
- Check server logs (stderr output)
- Verify environment variables are set
- Test server manually: \`node /path/to/dist/mcp-server/index.js\`
`;

      if (includeRemote) {
        guide += `
## Remote/Cloud Setup

### SSH Tunneling
If your MCP server is on a remote machine:

\`\`\`bash
# On local machine, create SSH tunnel
ssh -L 3000:localhost:3000 user@remote-server

# On remote server, start MCP server
node dist/mcp-server/index.js
\`\`\`

Then configure your client to connect to \`localhost:3000\`.

### Docker Deployment
Run MCP server in a container:

\`\`\`bash
# Build image
docker build -t new-project-bundle-mcp .

# Run container
docker run -d -p 3000:3000 new-project-bundle-mcp
\`\`\`

### Cloud Deployment (AWS/GCP/Azure)
1. Deploy the MCP server to your cloud provider
2. Expose via HTTPS endpoint
3. Configure authentication (API key, OAuth)
4. Update client config with remote URL

**Security Notes:**
- Always use HTTPS for remote connections
- Implement authentication/authorization
- Limit network access with firewalls
- Rotate credentials regularly
`;
      }

      return {
        content: [{ type: "text", text: guide }],
      };
    }
  );
}
