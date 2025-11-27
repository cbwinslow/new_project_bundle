# New Project Bundle 🚀

> A comprehensive bundle of DevOps project files, GitHub configurations, and an MCP server for AI-assisted development

[![CI](https://github.com/cbwinslow/new_project_bundle/actions/workflows/ci.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/ci.yml)
[![Security](https://github.com/cbwinslow/new_project_bundle/actions/workflows/security.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/security.yml)
[![CodeQL](https://github.com/cbwinslow/new_project_bundle/actions/workflows/codeql.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Overview

This repository contains a complete set of GitHub configuration files, workflow scripts, DevOps automation tools, and an **MCP (Model Context Protocol) server** designed to jumpstart new projects with AI agent integration. It includes configurations for:

- **🤖 MCP Server** - Built-in Model Context Protocol server with useful tools for AI agents
- **Issue & PR Templates** - Structured templates for bug reports, features, and questions
- **GitHub Actions Workflows** - Comprehensive CI/CD, security scanning, and automation (18 workflows)
- **AI Code Review** - Integration points for Copilot, OpenHands, Gemini, CodeRabbit, and more
- **Project Management** - Automated triage, labeling, and project board management
- **Docker & Container Support** - Production-ready Dockerfile and docker-compose configuration
- **Pre-commit Hooks** - Code quality enforcement with pre-commit
- **Multiple Package Managers** - Lock files for npm, pip, Ruby, Go, Rust, and PHP

## 📁 Repository Structure

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.yml          # Bug report template
│   ├── feature_request.yml     # Feature request template
│   ├── question.yml            # Question template
│   └── config.yml              # Template configuration
├── workflows/
│   ├── ci.yml                  # Continuous Integration
│   ├── cd.yml                  # Continuous Deployment
│   ├── codeql.yml              # CodeQL security analysis
│   ├── security.yml            # Comprehensive security scanning
│   ├── issue-triage.yml        # Automatic issue triage
│   ├── pull-request.yml        # PR automation
│   ├── project-automation.yml  # Project board automation
│   ├── stale.yml               # Stale issue/PR management
│   ├── label-sync.yml          # Label synchronization
│   ├── release.yml             # Release automation
│   ├── greetings.yml           # Welcome first-time contributors
│   ├── docs.yml                # Documentation build & deploy
│   ├── ai-review.yml           # AI code review integration
│   ├── dependency-updates.yml  # Dependency management
│   ├── performance.yml         # Performance testing
│   ├── maintenance.yml         # Scheduled maintenance tasks
│   ├── discussions.yml         # Discussion automation
│   └── metrics.yml             # Repository metrics
├── CODEOWNERS                  # Code ownership definitions
├── CONTRIBUTING.md             # Contribution guidelines
├── FUNDING.yml                 # Sponsorship configuration
├── PULL_REQUEST_TEMPLATE.md    # PR template
├── SECURITY.md                 # Security policy
├── SUPPORT.md                  # Support information
├── dependabot.yml              # Dependabot configuration
├── labels.yml                  # Repository labels
├── labeler.yml                 # Auto-labeler configuration
├── lighthouserc.json           # Lighthouse CI config
├── markdown-link-check-config.json
└── cspell.json                 # Spell check configuration
│
# MCP Server (Model Context Protocol)
src/mcp-server/
├── index.ts                    # MCP server entry point
└── tools/
    ├── filesystem.ts           # File system operations
    ├── git.ts                  # Git repository tools
    ├── time.ts                 # Time and timezone tools
    ├── fetch.ts                # HTTP fetch tools
    ├── memory.ts               # In-memory storage tools
    └── system.ts               # System information tools
│
# Root Files
├── .editorconfig               # Editor configuration
├── .gitattributes              # Git attributes
├── .gitignore                  # Git ignore rules
├── .pre-commit-config.yaml     # Pre-commit hooks
├── CHANGELOG.md                # Changelog
├── CODE_OF_CONDUCT.md          # Code of Conduct
├── Dockerfile                  # Docker container
├── docker-compose.yml          # Docker Compose
├── LICENSE                     # MIT License
├── Makefile                    # Make targets
├── README.md                   # This file
├── mcp-config.json             # MCP server configuration template
├── tsconfig.json               # TypeScript configuration
├── renovate.json               # Renovate config (alt to Dependabot)
│
# Package Manager Files (with lock files)
├── package.json                # Node.js/npm manifest
├── package-lock.json           # npm lock file
├── requirements.txt            # Python dependencies
├── Gemfile                     # Ruby dependencies
├── Gemfile.lock                # Ruby lock file
├── go.mod                      # Go module file
├── go.sum                      # Go checksums
├── Cargo.toml                  # Rust manifest
├── Cargo.lock                  # Rust lock file
├── composer.json               # PHP/Composer manifest
└── composer.lock               # PHP/Composer lock file
```

## 🚀 Getting Started

### Using this Bundle

1. **Fork or Clone** this repository
2. **Customize** the files for your project:
   - Update `CODEOWNERS` with your team members
   - Modify `dependabot.yml` to match your tech stack
   - Adjust workflow configurations as needed
3. **Enable GitHub Features**:
   - GitHub Actions (Settings → Actions)
   - Dependabot alerts (Settings → Security)
   - CodeQL analysis (Settings → Security → Code security and analysis)
4. **Set up Secrets** (Settings → Secrets and variables → Actions):
   - `CODECOV_TOKEN` - For code coverage
   - `SNYK_TOKEN` - For Snyk security scanning
   - Other service-specific tokens as needed

### AI Code Review Setup

This bundle is configured to work with multiple AI code review services:

#### GitHub Copilot
- Built-in to GitHub Enterprise
- Automatically provides code suggestions and review comments

#### OpenHands (formerly OpenDevin)
1. Visit [OpenHands GitHub Repository](https://github.com/All-Hands-AI/OpenHands)
2. Follow the installation instructions for self-hosted deployment
3. Configure repository access for AI-assisted development

#### Google Gemini Code Assist
1. Set up via Google Cloud Console
2. Install the GitHub App
3. Configure in repository settings

#### CodeRabbit
1. Install from [GitHub Marketplace](https://github.com/marketplace/coderabbit-ai-code-reviews)
2. Add to repository
3. Automatic PR reviews begin immediately

## 🤖 MCP Server

This bundle includes a built-in **Model Context Protocol (MCP) server** that provides AI agents with useful tools and services.

### What is MCP?

MCP (Model Context Protocol) is a standardized protocol that allows AI models to securely interact with external tools, data sources, and services. Our MCP server provides a collection of useful tools that AI agents can use.

### Available Tools

The MCP server includes the following tool categories:

#### 📁 File System Tools
- `read_file` - Read file contents
- `write_file` - Write content to files
- `list_directory` - List directory contents
- `file_info` - Get file/directory information
- `search_files` - Search for files by pattern

#### 🔧 Git Tools
- `git_status` - Get repository status
- `git_log` - View commit history
- `git_diff` - Show changes
- `git_branch` - Manage branches
- `git_show` - Show commit details
- `git_remote` - Manage remotes
- `git_blame` - Show line-by-line blame

#### ⏰ Time Tools
- `get_current_time` - Get current time in any timezone
- `convert_timezone` - Convert between timezones
- `time_difference` - Calculate time differences
- `format_time` - Format timestamps
- `list_timezones` - List available timezones

#### 🌐 Fetch Tools
- `http_get` - Fetch content via HTTP GET
- `http_post` - Send data via HTTP POST
- `check_url` - Check URL availability
- `fetch_webpage` - Extract text from webpages

#### 🧠 Memory Tools
- `memory_set` - Store values with tags
- `memory_get` - Retrieve stored values
- `memory_delete` - Delete values
- `memory_list` - List all stored keys
- `memory_search` - Search stored content
- `memory_clear` - Clear all memory
- `memory_append` - Append to existing entries
- `memory_stats` - Get memory statistics

#### 💻 System Tools
- `system_info` - Get system information
- `get_env` - Get environment variables
- `list_env` - List environment variables
- `run_command` - Execute safe read-only commands
- `calculate_hash` - Calculate string hashes
- `random_generate` - Generate random values
- `base64` - Encode/decode base64
- `json_format` - Format/validate JSON

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the server:**
   ```bash
   npm run build
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

   Or for development:
   ```bash
   npm run start:dev
   ```

### Configuration for AI Clients

#### Claude Desktop

Add to your Claude Desktop config (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "new-project-bundle": {
      "command": "node",
      "args": ["/path/to/new_project_bundle/dist/mcp-server/index.js"],
      "env": {}
    }
  }
}
```

#### Cursor IDE

Add to your Cursor settings (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "new-project-bundle": {
      "command": "node",
      "args": ["/path/to/new_project_bundle/dist/mcp-server/index.js"]
    }
  }
}
```

#### Generic MCP Client

Use the provided `mcp-config.json` as a template for your MCP client configuration.

## 📦 Included Workflows

### CI/CD Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| `ci.yml` | Lint, build, and test | Push, PR |
| `cd.yml` | Deploy to staging/production | Push to main, tags |
| `release.yml` | Create releases with changelog | Git tags |

### Security Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| `codeql.yml` | CodeQL security analysis | Push, PR, scheduled |
| `security.yml` | Comprehensive security scans | Push, PR, scheduled |
| `dependency-updates.yml` | Dependency vulnerability checks | PR |

### Automation Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| `issue-triage.yml` | Auto-label and triage issues | Issue opened |
| `pull-request.yml` | PR labeling and automation | PR events |
| `project-automation.yml` | Project board sync | Issue/PR events |
| `stale.yml` | Mark/close stale items | Scheduled |
| `greetings.yml` | Welcome new contributors | First issue/PR |
| `discussions.yml` | Discussion automation | Discussion events |

### Quality Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| `docs.yml` | Build and deploy documentation | Push, PR |
| `performance.yml` | Lighthouse and bundle analysis | Push, PR |
| `ai-review.yml` | AI-assisted code review | PR |
| `metrics.yml` | Repository metrics and insights | Monthly, manual |
| `maintenance.yml` | Cache, artifact, branch cleanup | Weekly, manual |

## 🐳 Docker Support

The bundle includes production-ready Docker configuration:

- **Dockerfile** - Multi-stage build for optimized images
- **docker-compose.yml** - Local development with PostgreSQL and Redis

### Quick Start with Docker

```bash
# Build and start all services
docker-compose up -d

# Start development mode
docker-compose --profile dev up -d

# View logs
docker-compose logs -f
```

## 🛠️ Makefile Commands

The included Makefile provides common development tasks:

```bash
make help           # Show all available commands
make install        # Install dependencies
make dev            # Start development server
make build          # Build for production
make test           # Run all tests
make lint           # Run linter
make format         # Format code
make docker-build   # Build Docker image
make docker-up      # Start Docker containers
make release-patch  # Create patch release
```

## 🔗 Pre-commit Hooks

Pre-commit hooks ensure code quality before commits:

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run on all files
pre-commit run --all-files
```

Included hooks:
- Trailing whitespace removal
- End of file fixer
- YAML/JSON validation
- Large file detection
- Secret detection
- Markdown linting
- Shell script linting (shellcheck)
- Dockerfile linting (hadolint)
- Conventional commit validation

## 🏷️ Label System

The repository uses a comprehensive labeling system:

- **Type**: `bug`, `enhancement`, `question`, `documentation`
- **Status**: `needs-triage`, `in-progress`, `in-review`, `blocked`, `done`
- **Priority**: `priority: critical/high/medium/low`
- **Size**: `size/XS/S/M/L/XL`
- **Component**: `component: api/ui/database/auth/ci-cd`
- **Special**: `good-first-issue`, `help-wanted`, `breaking-change`

## 🔧 Customization

### Modifying Workflows

Each workflow includes comments explaining configuration options. Common customizations:

```yaml
# ci.yml - Change Node.js versions
strategy:
  matrix:
    node-version: [18, 20, 22]

# dependabot.yml - Change update schedule
schedule:
  interval: "weekly"
  day: "monday"

# stale.yml - Adjust stale thresholds
days-before-issue-stale: 60
days-before-issue-close: 14
```

### Adding New Workflows

1. Create a new `.yml` file in `.github/workflows/`
2. Define triggers, permissions, and jobs
3. Reference existing workflows for patterns

## 🛡️ Security

- **Dependabot** - Automated dependency updates
- **CodeQL** - Semantic code analysis
- **Secret Scanning** - Detect committed secrets
- **SAST** - Static Application Security Testing
- **License Compliance** - Dependency license checks

Report security vulnerabilities via [GitHub Security Advisories](../../security/advisories).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](.github/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📜 License

This project is available for use in any project. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub Actions ecosystem
- AI coding assistants (Copilot, OpenHands, Gemini, CodeRabbit)
- Open source community

---

Made with ❤️ for the DevOps and AI development community
