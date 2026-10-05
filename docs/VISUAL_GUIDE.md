# Visual Guide to Bundle Downloader

This guide provides visual representations of how the bundle system works.

## 🎬 Quick Demo

### Interactive Mode

```
$ npx github:cbwinslow/new_project_bundle bundle-downloader

✓ Loaded bundle manifest v1.0.0

📦 Available Bundles:

1. github-core
   Essential GitHub repository files
   Files: 6

2. github-issue-templates
   Complete issue template system
   Files: 4

3. github-workflows-ci
   CI/CD workflows
   Files: 3

... (showing 27 total bundles)

Enter bundle name or number (or "quit" to exit): 3

📦 Downloading bundle: CI/CD Workflows
   Continuous Integration and Deployment workflows

Downloading 3 files to ./downloaded-bundles...

  ✓ .github/workflows/ci.yml
  ✓ .github/workflows/cd.yml
  ✓ .github/workflows/release.yml

✓ Download complete: 3 succeeded, 0 failed
```

## 📊 Bundle Hierarchy

```
bundles.json
├── Individual Bundles (23)
│   ├── github-core ───────────────────► 6 files
│   ├── github-issue-templates ────────► 4 files
│   ├── github-workflows-ci ───────────► 3 files
│   ├── docker ────────────────────────► 3 files
│   ├── package-nodejs ────────────────► 3 files
│   └── ...
│
└── Meta Bundles (4)
    ├── all-github ──┬─► github-core
    │                ├─► github-issue-templates
    │                ├─► github-workflows-ci
    │                ├─► github-workflows-security
    │                ├─► github-workflows-automation
    │                ├─► github-workflows-quality
    │                └─► github-configs
    │
    ├── all-packages ─┬─► package-nodejs
    │                 ├─► package-python
    │                 ├─► package-ruby
    │                 ├─► package-go
    │                 ├─► package-rust
    │                 ├─► package-php
    │                 └─► renovate
    │
    ├── all-templates ┬─► templates-docs
    │                 ├─► templates-ai
    │                 └─► templates-git
    │
    └── complete ─────┬─► all-github
                      ├─► all-packages
                      ├─► all-templates
                      ├─► docker
                      ├─► dotfiles
                      ├─► pre-commit
                      ├─► root-docs
                      ├─► makefile
                      └─► mcp-server
```

## 🔄 Download Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ Runs: npx ... bundle-downloader download github-workflows-ci
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│             Bundle Downloader CLI                       │
│                                                         │
│  1. Fetch bundles.json from GitHub                     │
│     └─► https://raw.githubusercontent.com/.../main/... │
│                                                         │
│  2. Parse JSON & find "github-workflows-ci"            │
│     └─► Found: 3 files                                 │
│                                                         │
│  3. For each file in bundle:                           │
│     ├─► .github/workflows/ci.yml                       │
│     ├─► .github/workflows/cd.yml                       │
│     └─► .github/workflows/release.yml                  │
│                                                         │
│  4. Download each file:                                │
│     ├─► Create .github/workflows/ directory            │
│     ├─► GET https://raw.githubusercontent.com/.../ci.yml│
│     ├─► Write to ./downloaded-bundles/.github/...     │
│     └─► Repeat for each file                           │
│                                                         │
│  5. Report success                                      │
│     └─► "3 succeeded, 0 failed"                        │
└─────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Local File System                     │
│                                          │
│   ./downloaded-bundles/                  │
│   └── .github/                           │
│       └── workflows/                     │
│           ├── ci.yml                     │
│           ├── cd.yml                     │
│           └── release.yml                │
└─────────────────────────────────────────┘
```

## 🌳 File Tree After Downloads

### Example: Download github-workflows-ci

```
./downloaded-bundles/
└── .github/
    └── workflows/
        ├── ci.yml
        ├── cd.yml
        └── release.yml
```

### Example: Download all-github

```
./downloaded-bundles/
└── .github/
    ├── CODEOWNERS
    ├── CONTRIBUTING.md
    ├── FUNDING.yml
    ├── PULL_REQUEST_TEMPLATE.md
    ├── SECURITY.md
    ├── SUPPORT.md
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.yml
    │   ├── feature_request.yml
    │   ├── question.yml
    │   └── config.yml
    ├── workflows/
    │   ├── ci.yml
    │   ├── cd.yml
    │   ├── release.yml
    │   ├── codeql.yml
    │   ├── security.yml
    │   ├── dependency-updates.yml
    │   ├── issue-triage.yml
    │   ├── pull-request.yml
    │   ├── project-automation.yml
    │   ├── stale.yml
    │   ├── greetings.yml
    │   ├── discussions.yml
    │   ├── docs.yml
    │   ├── ai-review.yml
    │   ├── performance.yml
    │   ├── metrics.yml
    │   └── maintenance.yml
    ├── dependabot.yml
    ├── labels.yml
    ├── labeler.yml
    ├── lighthouserc.json
    ├── markdown-link-check-config.json
    ├── cspell.json
    └── copilot-instructions.md
```

### Example: Download complete (everything)

```
./downloaded-bundles/
├── .github/
│   ├── [all GitHub files...]
├── templates/
│   ├── SRS.md
│   ├── features.md
│   ├── ADR.md
│   ├── API.md
│   ├── RUNBOOK.md
│   ├── agents.md
│   ├── rules.md
│   ├── ai-linting-rules.md
│   ├── ai-context-rules.md
│   ├── .gitmodules.example
│   └── go-shell/
│       └── README.md
├── src/
│   └── mcp-server/
│       ├── index.ts
│       └── tools/
│           ├── filesystem.ts
│           ├── git.ts
│           ├── time.ts
│           ├── fetch.ts
│           ├── memory.ts
│           └── system.ts
├── scripts/
│   ├── download-bundle.sh
│   └── install.sh
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .nvmrc
├── .tool-versions
├── .env.example
├── .sops.yaml
├── .dockerignore
├── .pre-commit-config.yaml
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── mcp-config.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── requirements.txt
├── Gemfile
├── Gemfile.lock
├── go.mod
├── go.sum
├── Cargo.toml
├── Cargo.lock
├── composer.json
├── composer.lock
└── renovate.json
```

## 🎯 Common Workflows Visualized

### Workflow 1: New Node.js Project Setup

```
Start
  │
  ▼
Download package-nodejs ───► package.json
  │                          package-lock.json
  │                          tsconfig.json
  ▼
Download github-workflows-ci ──► .github/workflows/ci.yml
  │                               .github/workflows/cd.yml
  │                               .github/workflows/release.yml
  ▼
Download dotfiles ─────────────► .gitignore
  │                               .editorconfig
  │                               .nvmrc
  │                               etc...
  ▼
Ready to Code! 🎉
```

### Workflow 2: Adding Security to Existing Project

```
Existing Project
  │
  ▼
Download github-workflows-security ──► CodeQL scanning
  │                                     Dependency updates
  │                                     Security workflows
  ▼
Download pre-commit ──────────────────► Pre-commit hooks
  │
  ▼
Security Enhanced! 🔒
```

## 📈 Bundle Size Comparison

```
Bundle Name              Files    Category
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
github-core               6       ████░░░░░░  Small
github-issue-templates    4       ███░░░░░░░  Small
github-workflows-ci       3       ███░░░░░░░  Small
docker                    3       ███░░░░░░░  Small
package-nodejs            3       ███░░░░░░░  Small

github-workflows-automation 6     ██████░░░░  Medium
github-configs            7       ███████░░░  Medium
dotfiles                  7       ███████░░░  Medium
mcp-server                8       ████████░░  Medium

templates-docs            5       █████░░░░░  Medium
templates-ai              4       ████░░░░░░  Medium

all-packages             13       █████████░  Large
all-templates            11       ████████░░  Large

all-github               34       ████████████████  X-Large
complete                 80+      ██████████████████████  Full
```

## 🚀 Performance Metrics

```
Operation                Time        Notes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Load manifest           ~0.5s       Network fetch
Parse JSON              ~0.1s       Local processing
Resolve bundle          ~0.1s       Recursive resolution
Download single file    ~0.5s       Network transfer
Download 3-file bundle  ~2s         Sequential downloads
Download all-github     ~20s        34 files
Download complete       ~60s        80+ files

CLI cold start          ~2s         Node.js startup
Shell script start      ~0.1s       Bash only
```

## 🎨 Command Comparison

### Three Ways to Download

```
┌────────────────────────────────────────────────────────────┐
│ Method 1: Full CLI (Recommended)                           │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ $ npx github:cbwinslow/new_project_bundle \            │ │
│ │       bundle-downloader download github-workflows-ci   │ │
│ │                                                         │ │
│ │ Pros: Full features, interactive mode, type-safe       │ │
│ │ Cons: Requires Node.js, slower cold start              │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Method 2: Shell Script (Minimal)                           │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ $ curl -sSL https://raw.githubusercontent.com/.../ \   │ │
│ │   download-bundle.sh | bash -s -- github-workflows-ci  │ │
│ │                                                         │ │
│ │ Pros: No Node.js, fast, minimal deps                   │ │
│ │ Cons: Limited features, requires jq for full parsing   │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Method 3: Installed (Fastest for repeated use)             │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ $ bundle-downloader download github-workflows-ci       │ │
│ │                                                         │ │
│ │ Pros: Fastest, convenient, easy to use                 │ │
│ │ Cons: Requires one-time installation                   │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## 🎓 Learning Path

```
Level 1: Beginner
├─► Read QUICK_START.md
├─► Try: npx ... bundle-downloader
└─► Download your first bundle

Level 2: Regular User
├─► Read BUNDLES.md
├─► Set up shell aliases
├─► Download multiple bundles
└─► Customize output directories

Level 3: Power User
├─► Read USE_CASES.md
├─► Create custom setup scripts
├─► Fork and customize bundles
└─► Share with team

Level 4: Contributor
├─► Read ARCHITECTURE.md
├─► Study source code
├─► Add new bundles
└─► Submit improvements
```

## 📱 Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║             BUNDLE DOWNLOADER CHEAT SHEET                 ║
╠═══════════════════════════════════════════════════════════╣
║ LIST BUNDLES                                              ║
║   npx ... bundle-downloader list                          ║
║                                                           ║
║ INTERACTIVE MODE                                          ║
║   npx ... bundle-downloader                               ║
║                                                           ║
║ DOWNLOAD BUNDLE                                           ║
║   npx ... bundle-downloader download <name>               ║
║                                                           ║
║ CUSTOM OUTPUT                                             ║
║   ... --output ./my-project                               ║
║                                                           ║
║ DIFFERENT REPO                                            ║
║   ... --repo myuser/myrepo                                ║
║                                                           ║
║ SHELL SCRIPT                                              ║
║   ./download-bundle.sh <bundle-name>                      ║
║                                                           ║
║ POPULAR BUNDLES                                           ║
║   github-workflows-ci      CI/CD pipelines                ║
║   docker                   Containerization               ║
║   all-github              Complete GitHub setup           ║
║   complete                Everything                      ║
╚═══════════════════════════════════════════════════════════╝
```

## 🔗 Navigation

- [← Back to Main Docs](../BUNDLES.md)
- [Quick Start →](../examples/QUICK_START.md)
- [Use Cases →](../examples/USE_CASES.md)
- [Architecture →](ARCHITECTURE.md)

---

**Tip:** Copy and paste the ASCII art diagrams into your team documentation! 📋
