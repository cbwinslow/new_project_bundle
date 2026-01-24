# MCP Server Setup Guide

Complete guide for setting up the New Project Bundle MCP server locally and remotely.

## Table of Contents

1. [Local Setup](#local-setup)
2. [Client Configuration](#client-configuration)
3. [Remote Setup](#remote-setup)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)

## Local Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git (for development)

### Installation Steps

#### 1. Clone or Download

```bash
# Clone the repository
git clone https://github.com/cbwinslow/new_project_bundle.git
cd new_project_bundle

# Or download a specific bundle
npx github:cbwinslow/new_project_bundle bundle-downloader download mcp-server
```

#### 2. Install Dependencies

```bash
npm ci
# or
npm install
```

#### 3. Build the Server

```bash
npm run build
```

This creates the compiled server in `dist/mcp-server/index.js`.

#### 4. Test the Server

```bash
# Development mode (with auto-reload)
npm run start:dev

# Production mode
npm start
```

The server should start and display: `new-project-bundle-mcp v1.0.0 started successfully`

Press Ctrl+C to stop when testing.

## Client Configuration

### Get Your Server Path

```bash
cd /path/to/new_project_bundle
pwd
# Output: /home/user/projects/new_project_bundle
```

Your server path will be: `/home/user/projects/new_project_bundle/dist/mcp-server/index.js`

### Claude Desktop

**Config Location:** `~/.config/claude/claude_desktop_config.json` (Linux/macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

**Configuration:**

```json
{
  "mcpServers": {
    "new-project-bundle": {
      "command": "node",
      "args": [
        "/absolute/path/to/new_project_bundle/dist/mcp-server/index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

**Setup:**

```bash
# Create config directory
mkdir -p ~/.config/claude

# Edit configuration
nano ~/.config/claude/claude_desktop_config.json

# Restart Claude Desktop
```

### Cursor IDE

**Config Location:** `~/.cursor/mcp.json`

**Configuration:**

```json
{
  "mcpServers": {
    "new-project-bundle": {
      "command": "node",
      "args": [
        "/absolute/path/to/new_project_bundle/dist/mcp-server/index.js"
      ]
    }
  }
}
```

**Setup:**

```bash
# Create config directory
mkdir -p ~/.cursor

# Edit configuration
nano ~/.cursor/mcp.json

# Restart Cursor
```

### Cline (VS Code Extension)

**Config Location:** `~/.cline/mcp_settings.json`

**Configuration:**

```json
{
  "mcpServers": {
    "new-project-bundle": {
      "command": "node",
      "args": [
        "/absolute/path/to/new_project_bundle/dist/mcp-server/index.js"
      ],
      "disabled": false
    }
  }
}
```

**Setup:**

```bash
# Create config directory
mkdir -p ~/.cline

# Edit configuration
nano ~/.cline/mcp_settings.json

# Reload VS Code window (Cmd/Ctrl+Shift+P → "Developer: Reload Window")
```

### Using MCP Config Tools

The MCP server includes built-in configuration tools:

```javascript
// Generate configuration
mcp_generate_config({
  client: "claude-desktop",
  serverPath: "/path/to/dist/mcp-server/index.js",
  serverName: "new-project-bundle"
})

// Install configuration automatically
mcp_install_config({
  client: "claude-desktop",
  serverPath: "/path/to/dist/mcp-server/index.js",
  merge: true
})

// Check existing configuration
mcp_check_config({ client: "claude-desktop" })
```

## Remote Setup

### SSH Tunnel Method

Run the MCP server on a remote machine and tunnel to your local client.

**On Remote Server:**

```bash
# Install and build
ssh user@remote-server
cd new_project_bundle
npm install
npm run build

# Run the server
npm start
```

**On Local Machine:**

```bash
# Create SSH tunnel (forward remote port to local)
ssh -L 3000:localhost:3000 user@remote-server

# Keep this terminal open
```

**Configure Client:**

Use `localhost:3000` or adjust your client config to connect through the tunnel.

### Docker Deployment

**Build Docker Image:**

```bash
docker build -t new-project-bundle-mcp .
```

**Run Container:**

```bash
# Foreground
docker run -p 3000:3000 new-project-bundle-mcp

# Background (detached)
docker run -d -p 3000:3000 --name mcp-server new-project-bundle-mcp

# With environment variables
docker run -d -p 3000:3000 \
  -e GITHUB_TOKEN=your_token \
  --name mcp-server \
  new-project-bundle-mcp
```

**Docker Compose:**

```yaml
version: '3.8'
services:
  mcp-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GITHUB_TOKEN=${GITHUB_TOKEN}
    restart: unless-stopped
```

### Cloud Deployment

#### AWS EC2

```bash
# Launch EC2 instance (Amazon Linux 2 or Ubuntu)
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone and setup
git clone https://github.com/cbwinslow/new_project_bundle.git
cd new_project_bundle
npm install
npm run build

# Run with PM2 (process manager)
sudo npm install -g pm2
pm2 start dist/mcp-server/index.js --name mcp-server
pm2 save
pm2 startup
```

#### Google Cloud Run

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT/mcp-server

# Deploy to Cloud Run
gcloud run deploy mcp-server \
  --image gcr.io/YOUR_PROJECT/mcp-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry myregistry --image mcp-server:latest .

# Deploy to ACI
az container create \
  --resource-group myResourceGroup \
  --name mcp-server \
  --image myregistry.azurecr.io/mcp-server:latest \
  --dns-name-label mcp-server \
  --ports 3000
```

### Security Considerations for Remote Setup

⚠️ **Important Security Notes:**

1. **Use HTTPS** - Always encrypt remote connections
2. **Authentication** - Implement API key or OAuth authentication
3. **Firewall Rules** - Restrict access to known IPs
4. **Environment Variables** - Never commit secrets
5. **Regular Updates** - Keep dependencies updated
6. **Monitoring** - Log and monitor access

## Verification

### 1. Check MCP Server is Running

```bash
# The server should output to stderr
# Look for: "new-project-bundle-mcp v1.0.0 started successfully"
```

### 2. Verify in AI Client

After restarting your AI client:

1. Open a new conversation
2. Ask: "What tools do you have available?"
3. You should see tools like:
   - `github_repo_info`
   - `github_user_repos`
   - `rules_list`
   - `mcp_setup_guide`
   - `memory_set`, `memory_get`
   - `git_status`, `git_log`
   - And many more...

### 3. Test a Simple Tool

Try using a basic tool:

```
"Can you get the current time using the get_current_time tool?"
"Show me system information with the system_info tool"
"List development rules with rules_list"
```

### 4. Test GitHub Tools

```
"Get information about the repository facebook/react"
"List my GitHub repositories" (requires GITHUB_TOKEN)
"Search for TypeScript MCP projects on GitHub"
```

## Troubleshooting

### Server Not Appearing

**Problem:** MCP server doesn't show up in client tools list

**Solutions:**
- Verify Node.js is installed: `node --version`
- Check server path is absolute, not relative
- Ensure JSON configuration is valid (use a JSON validator)
- Completely restart the AI client (not just reload)
- Check client logs for error messages

### Permission Denied

**Problem:** `EACCES: permission denied`

**Solutions:**
```bash
# Make sure the file is readable
chmod +r dist/mcp-server/index.js

# Verify Node.js can execute
node dist/mcp-server/index.js
```

### Module Not Found

**Problem:** `Cannot find module '@modelcontextprotocol/sdk'`

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### GitHub API Rate Limits

**Problem:** `API rate limit exceeded`

**Solutions:**
- Add a GitHub token to your configuration
- Tokens provide 5,000 requests/hour vs 60 without auth
- Get a token: GitHub Settings → Developer settings → Personal access tokens

### Tools Not Working

**Problem:** Tools execute but return errors

**Solutions:**
- Check server logs (stderr output)
- Verify environment variables are set correctly
- Test manually: `echo '{"tool":"system_info","params":{}}' | node dist/mcp-server/index.js`
- Ensure file permissions for file system operations

### Configuration File Issues

**Problem:** Config file not being read

**Solutions:**
```bash
# Verify config file exists
ls -la ~/.config/claude/claude_desktop_config.json

# Check JSON syntax
cat ~/.config/claude/claude_desktop_config.json | jq .

# Fix permissions
chmod 644 ~/.config/claude/claude_desktop_config.json
```

## Environment Variables

Set these in your MCP configuration or shell:

```bash
# GitHub token for API access
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Node environment
NODE_ENV=production

# Custom rules directory
RULES_DIR=/path/to/custom/rules

# Debug mode
DEBUG=mcp:*
```

**In MCP Config:**

```json
{
  "mcpServers": {
    "new-project-bundle": {
      "command": "node",
      "args": ["/path/to/dist/mcp-server/index.js"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx",
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Getting Help

- **Documentation:** Check `examples/mcp-tools/` for usage examples
- **GitHub Issues:** Report bugs at https://github.com/cbwinslow/new_project_bundle/issues
- **Test Tools:** Use `mcp_setup_guide` tool within the MCP server itself for help

## Next Steps

Once setup is complete:

1. Explore available tools with `system_info` or asking the AI
2. Try GitHub tools to fetch repository information
3. Use rules tools to manage development conventions
4. Explore memory tools for persistent storage
5. Check out `examples/mcp-tools/github-api-examples.md` for more examples
