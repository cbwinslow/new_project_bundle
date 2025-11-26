# New Project Bundle 🚀

> A comprehensive bundle of DevOps project files and GitHub configurations for AI-assisted development

[![CI](https://github.com/cbwinslow/new_project_bundle/actions/workflows/ci.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/ci.yml)
[![Security](https://github.com/cbwinslow/new_project_bundle/actions/workflows/security.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/security.yml)
[![CodeQL](https://github.com/cbwinslow/new_project_bundle/actions/workflows/codeql.yml/badge.svg)](https://github.com/cbwinslow/new_project_bundle/actions/workflows/codeql.yml)

## 📋 Overview

This repository contains a complete set of GitHub configuration files, workflow scripts, and DevOps automation tools designed to jumpstart new projects with AI agent integration. It includes configurations for:

- **Issue & PR Templates** - Structured templates for bug reports, features, and questions
- **GitHub Actions Workflows** - Comprehensive CI/CD, security scanning, and automation
- **AI Code Review** - Integration points for Copilot, OpenHands, Gemini, and more
- **Project Management** - Automated triage, labeling, and project board management

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
│   └── performance.yml         # Performance testing
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
├── .editorconfig               # Editor configuration
├── CODE_OF_CONDUCT.md          # Code of Conduct
└── README.md                   # This file
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
1. Install from [GitHub Marketplace](https://github.com/marketplace)
2. Configure repository permissions
3. AI agent will automatically review PRs

#### Google Gemini Code Assist
1. Set up via Google Cloud Console
2. Install the GitHub App
3. Configure in repository settings

#### CodeRabbit
1. Install from [GitHub Marketplace](https://github.com/marketplace/coderabbit-ai-code-reviews)
2. Add to repository
3. Automatic PR reviews begin immediately

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

### Quality Workflows

| Workflow | Description | Trigger |
|----------|-------------|---------|
| `docs.yml` | Build and deploy documentation | Push, PR |
| `performance.yml` | Lighthouse and bundle analysis | Push, PR |
| `ai-review.yml` | AI-assisted code review | PR |

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
