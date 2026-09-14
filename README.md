# New Project Bundle 🚀

> A comprehensive bundle of DevOps project files, GitHub configurations, and an MCP server for AI-assisted development

[![CI](https://github.com/cbwinslow/new_project_bundle/actions/workflows/ci.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/ci.yml)
[![Security](https://github.com/cbwinslow/new_project_bundle/actions/workflows/security.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/security.yml)
[![CodeQL](https://github.com/cbwinslow/new_project_bundle/actions/workflows/codeql.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Overview

This repository contains a complete set of GitHub configuration files, workflow scripts, DevOps automation tools, and an **MCP (Model Context Protocol) server** designed to jumpstart new projects with AI agent integration. It includes configurations for:

- **🚀 Shell Functions** - Interactive bash/zsh functions for browsing and downloading bundles
- **📦 Bundle Downloader** - Download curated file bundles without cloning the whole repo

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

# Project Templates
templates/
├── agents.md                   # AI coding agent configuration
├── rules.md                    # Project development rules
├── ai-linting-rules.md         # AI agent linting & code quality rules
├── ai-context-rules.md         # AI agent context & behavior rules
├── SRS.md                      # Software Requirements Specification template
├── features.md                 # Feature documentation template
├── ADR.md                      # Architecture Decision Record template
├── API.md                      # API documentation template
├── RUNBOOK.md                  # Operations runbook template
├── .gitmodules.example         # Git submodules configuration example
└── go-shell/                   # Go shell submodule template
    └── README.md               # Go shell documentation

# Additional Dotfiles
├── .nvmrc                      # Node.js version (nvm/fnm)
├── .tool-versions              # asdf version manager config
├── .dockerignore               # Docker build context exclusions
├── .env.example                # Environment variables template
└── .sops.yaml                  # SOPS encryption configuration
```

## 🚀 Getting Started

**Don't want to clone the whole repo?** Use our bundle downloader to get only what you need!

```bash
# Interactive bundle selector
npx github:cbwinslow/new_project_bundle bundle-downloader

# Download specific bundles
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci

# Or use shell functions (after setup above)
npb-download github-workflows-ci
```

👉 **[See full bundle documentation](BUNDLES.md)** for all available bundles and download options.
👉 **[See rules documentation](docs/wiki/Rules-System.md)** for development rules and guidelines.

### Using this Bundle (Traditional Method)

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

## 📋 Development Rules System

The repository includes a comprehensive, modular rules system for development best practices.

### What Are Rules?

Rules are individual markdown files organized by category:

- **Code Quality** - Clean code, error handling
- **Git Workflow** - Commit messages, branch naming
- **Testing** - Test coverage requirements
- **Documentation** - API documentation standards
- **Security** - Secrets management
- **Deployment** - Deployment checklists
- **AI Agents** - Guidelines for AI coding agents

### Using Rules

**List all rules:**

```bash
npb-list-rules
```

**Search for rules:**

```bash
npb-query commit      # Find commit-related rules
npb-query security    # Find security rules
npb-query test        # Find testing rules
```

**Download specific rules:**

```bash
npb-download-rule code-quality/clean-code.md
npb-download-rule git-workflow/commit-messages.md
```

**Download all rules in a category:**

```bash
npb-download rules-code-quality
npb-download rules-security
npb-download all-rules    # Download all rules
```

**Interactive browsing (requires fzf):**

```bash
npb-browse
```

### Available Rule Bundles

| Bundle | Description | Files |
| -------- | ------------- | ------- |
| `rules-code-quality` | Clean code and error handling | 2 |
| `rules-git-workflow` | Git commit and branch conventions | 2 |
| `rules-testing` | Test coverage standards | 1 |
| `rules-documentation` | API documentation standards | 1 |
| `rules-security` | Security best practices | 1 |
| `rules-deployment` | Deployment checklists | 1 |
| `rules-ai-agents` | AI agent guidelines | 1 |
| `all-rules` | All development rules | 9 |

### Integration with AI Agents

Rules are designed for AI agent consumption:

```markdown
# Reference in your AI agent config
Please follow these rules:
- code-quality/clean-code.md
- git-workflow/commit-messages.md
- security/secrets-management.md
```

See [Rules System Documentation](docs/wiki/Rules-System.md) for more details.

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

## 🚀 Shell Functions & Interactive Tools

NPB provides powerful shell functions that make it easy to browse, search, and download bundles and rules directly from your terminal.

### Quick Setup

```bash
# One-command installation
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/setup-shell.sh | bash

# Reload your shell
source ~/.bashrc  # or ~/.zshrc
```

### Available Commands

**Bundle Management:**

- `npb_list_bundles` - List all available bundles
- `npb_search_bundles <keyword>` - Search for bundles
- `npb_browse_bundles` - Interactive TUI browser
- `npb_download_bundle <name> [dir]` - Download a bundle
- `npb_get <name>` - Quick download to current directory

**Rule Management:**

- `npb_list_rules [category]` - List development rules
- `npb_search_rules <keyword>` - Search for rules
- `npb_browse_rules [category]` - Interactive rule browser
- `npb_download_rule <id> [dir]` - Download a specific rule
- `npb_install_rule <id>` - Install rule to NPB directory

**Utilities:**

- `npb_version` - Show version and status
- `npb_refresh` - Refresh bundle cache
- `npb_help` - Show help message

### Convenient Aliases

After installation, these aliases are available:

```bash
npb              # List bundles
npb-browse       # Interactive browser
npb-get docker   # Quick download
npb-rules        # List rules
npb-rules-browse # Browse rules
```

### Examples

```bash
# Browse and download bundles interactively
npb-browse

# Quick download common bundles
npb-get github-workflows-ci
npb-get docker
npb-get all-templates

# Search for specific functionality
npb_search_bundles security
npb_search_rules eslint

# Download rules for your project
npb_download_rule gh-ci-basic ./.github/workflows/
npb_download_rule docker-multistage ./
```

👉 **[Full Shell Functions Documentation](SHELL_FUNCTIONS.md)**

## 📋 Rules System

NPB includes a comprehensive rules system with curated development rules and best practices.

### Rule Categories

- **GitHub** - Workflow and configuration rules
- **Docker** - Container and deployment rules
- **CI/CD** - Pipeline and automation rules
- **Security** - Security scanning and compliance
- **Linting** - Code quality and formatting rules

### Browse Rules

```bash
# List all rules
npb_list_rules

# Browse by category
npb_browse_rules github
npb_browse_rules security

# Search for specific rules
npb_search_rules codeql
npb_search_rules eslint
```

### Rule Examples

Available rules include:

- `gh-ci-basic` - Basic CI workflow with testing
- `gh-security-scan` - Comprehensive security scanning
- `docker-multistage` - Optimized multi-stage builds
- `sec-secrets-scan` - Secret detection and prevention
- `lint-eslint-strict` - Strict ESLint configuration

Rules are metadata-tagged and fully searchable through the interactive browser or search functions.

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

#### 🐙 GitHub API Tools

- `github_repo_info` - Get detailed repository information
- `github_list_issues` - List issues with filtering
- `github_list_prs` - List pull requests
- `github_user_info` - Get user/organization information
- `github_user_repos` - List user's repositories
- `github_get_file` - Get file contents from repositories
- `github_search_repos` - Search repositories with query syntax

#### 📋 Rules Management Tools

- `rules_list` - List all development rules
- `rules_get` - Get specific rule content
- `rules_search` - Search rules by keyword
- `rules_by_category` - Get rules in a category
- `rules_categories` - List all rule categories

#### ⚙️ MCP Configuration Tools

- `mcp_generate_config` - Generate client configurations
- `mcp_install_config` - Install MCP server configs
- `mcp_check_config` - Check existing configurations
- `mcp_list_config_paths` - List config file locations
- `mcp_setup_guide` - Get comprehensive setup instructions

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

4. **Explore the tools:**
   - See [Setup Guide](examples/mcp-tools/setup-guide.md) for detailed configuration
   - Check [GitHub API Examples](examples/mcp-tools/github-api-examples.md) for GitHub integration
   - Read [Rules Examples](examples/mcp-tools/rules-examples.md) for rules management

### Key Features

#### Pull Information from GitHub

Use the GitHub API tools to access your repositories and account:

```javascript
// Get repository information
github_repo_info({ owner: "username", repo: "project" })

// List your repositories
github_user_repos({ username: "your-github-username" })

// Search for projects
github_search_repos({ query: "language:typescript topic:mcp" })
```

#### Manage Development Rules

Access and organize development rules, conventions, and best practices:

```javascript
// List all rules
rules_list({})

// Get specific rule
rules_get({ ruleId: "code-quality/clean-code" })

// Search rules
rules_search({ query: "commit messages" })
```

#### Setup MCP Servers

Tools to configure MCP servers locally and remotely:

```javascript
// Generate configuration for Claude Desktop
mcp_generate_config({
  client: "claude-desktop",
  serverPath: "/path/to/dist/mcp-server/index.js"
})

// Install configuration
mcp_install_config({
  client: "claude-desktop",
  serverPath: "/path/to/dist/mcp-server/index.js",
  merge: true
})

// Get setup guide
mcp_setup_guide({ includeRemote: true })
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
      "env": {
        "GITHUB_TOKEN": "your_github_personal_access_token_here"
      }
    }
  }
}
```

**Note:** Add a GitHub personal access token to the `env` section for higher API rate limits (5,000 requests/hour vs 60). Get a token from GitHub Settings → Developer settings → Personal access tokens.

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
| ---------- | ------------- | --------- |
| `codeql.yml` | CodeQL security analysis | Push, PR, scheduled |
| `security.yml` | Comprehensive security scans | Push, PR, scheduled |
| `dependency-updates.yml` | Dependency vulnerability checks | PR |

### Automation Workflows

| Workflow | Description | Trigger |
| ---------- | ------------- | --------- |
| `issue-triage.yml` | Auto-label and triage issues | Issue opened |
| `pull-request.yml` | PR labeling and automation | PR events |
| `project-automation.yml` | Project board sync | Issue/PR events |
| `stale.yml` | Mark/close stale items | Scheduled |
| `greetings.yml` | Welcome new contributors | First issue/PR |
| `discussions.yml` | Discussion automation | Discussion events |

### Quality Workflows

| Workflow | Description | Trigger |
| ---------- | ------------- | --------- |
| `docs.yml` | Build and deploy documentation | Push, PR |
| `performance.yml` | Lighthouse and bundle analysis | Push, PR |
| `ai-review.yml` | AI-assisted code review | PR |
| `metrics.yml` | Repository metrics and insights | Monthly, manual |
| `maintenance.yml` | Cache, artifact, branch cleanup | Weekly, manual |

## 📄 Project Templates

The bundle includes comprehensive templates for project documentation:

### Documentation Templates

| Template | Purpose |
| ---------- | --------- |
| `templates/agents.md` | AI coding agent configuration and guidelines |
| `templates/rules.md` | Project development rules and standards |
| `templates/ai-linting-rules.md` | **NEW** Comprehensive linting, formatting, spacing, and code quality rules for AI agents |
| `templates/ai-context-rules.md` | **NEW** Rules for AI agents: documentation reading, existing tool usage, task breakdown, and logging |
| `templates/SRS.md` | Interactive Software Requirements Specification |
| `templates/features.md` | Feature documentation and tracking |
| `templates/ADR.md` | Architecture Decision Records |
| `templates/API.md` | API documentation template |
| `templates/RUNBOOK.md` | Operations runbook for incident response |

### Using Templates

1. Copy desired templates to your project root or `docs/` folder
2. Customize placeholders marked with `[brackets]` or `YYYY-MM-DD`
3. Fill in checkboxes as you complete sections
4. Update version numbers with major changes

### AI Agent Rules System

This bundle includes a comprehensive AI agent rules system designed to ensure consistent, high-quality code and thoughtful development practices:

#### Linting & Code Quality Rules (`ai-linting-rules.md`)

Covers all aspects of code formatting and quality:

- **Indentation & Spacing**: Tabs vs spaces, consistent indentation
- **Line Length & Wrapping**: Maximum line lengths, wrapping styles
- **Whitespace Rules**: Trailing whitespace, blank lines
- **Character Duplication**: Duplicate semicolons, operators, brackets
- **Spelling & Typos**: Spell checking, common typo detection
- **Syntax Errors**: Balanced brackets, valid strings
- **ESLint Rules**: Complete ESLint configuration
- **Pre-commit Checks**: Required pre-commit hooks

#### Context & Behavior Rules (`ai-context-rules.md`)

Guides AI agent behavior for better outcomes:

- **Documentation First**: Always read project docs before coding
- **Non-Destructive Actions**: Never delete without permission
- **Use Existing Tools**: Discover before creating new utilities
- **Question Asking**: Ask when unsure, clarify ambiguity
- **Critical Reasoning**: Analyze before acting, consider edge cases
- **Task Breakdown System**: Break complex tasks into subtasks
- **Task Logging**: Save all task lists and solutions to files
- **Configurable Repository**: Save completed tasks to a GitHub repo

#### Quick Setup

1. Copy both rules files to your project's `templates/` or `docs/` directory
2. Configure the `TASK_LOG_REPOSITORY` variable in `ai-context-rules.md`
3. Reference these rules in your AI agent prompts or configurations
4. Create a `tasks/` directory for task logging

### Go Shell Submodule

The `templates/go-shell/` directory contains documentation for setting up an interactive Go shell as a submodule:

```bash
# Add Go shell as a submodule
git submodule add https://github.com/your-org/go-shell.git go-shell

# Initialize submodules
git submodule update --init --recursive
```

See `templates/.gitmodules.example` for configuration reference.

### Environment & Secrets

The bundle includes secure environment configuration:

- `.env.example` - Comprehensive environment variables template
- `.sops.yaml` - Mozilla SOPS configuration for secrets encryption

```bash
# Encrypt secrets with SOPS
sops --encrypt .env > .env.enc

# Decrypt secrets
sops --decrypt .env.enc > .env
```

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
