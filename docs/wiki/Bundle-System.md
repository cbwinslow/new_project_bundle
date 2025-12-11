# Bundle System

The New Project Bundle system allows you to download curated collections of files without cloning the entire repository.

## What Are Bundles?

Bundles are organized sets of related files:

- **Individual Bundles**: Focused sets (e.g., `github-workflows-ci`)
- **Meta Bundles**: Collections of bundles (e.g., `all-github`)
- **Complete Bundle**: Everything in the repository

## Available Bundles

### GitHub Configuration Bundles

| Bundle | Files | Description |
|--------|-------|-------------|
| `github-core` | 6 | CODEOWNERS, CONTRIBUTING, FUNDING, PR template, SECURITY, SUPPORT |
| `github-issue-templates` | 4 | Bug reports, feature requests, questions |
| `github-workflows-ci` | 3 | CI, CD, and release workflows |
| `github-workflows-security` | 3 | CodeQL, security scanning, dependency updates |
| `github-workflows-automation` | 6 | Issue triage, PR automation, stale management |
| `github-workflows-quality` | 5 | Docs, AI review, performance, metrics |
| `github-configs` | 7 | Dependabot, labels, Lighthouse, etc. |
| `all-github` | ~34 | Meta-bundle of all GitHub configs |

### Infrastructure Bundles

| Bundle | Files | Description |
|--------|-------|-------------|
| `docker` | 3 | Dockerfile, docker-compose, .dockerignore |
| `dotfiles` | 7 | .editorconfig, .gitignore, .env.example, etc. |
| `pre-commit` | 1 | Pre-commit hooks configuration |
| `makefile` | 1 | Development task automation |

### Package Manager Bundles

| Bundle | Files | Description |
|--------|-------|-------------|
| `package-nodejs` | 3 | package.json, package-lock.json, tsconfig.json |
| `package-python` | 1 | requirements.txt |
| `package-ruby` | 2 | Gemfile, Gemfile.lock |
| `package-go` | 2 | go.mod, go.sum |
| `package-rust` | 2 | Cargo.toml, Cargo.lock |
| `package-php` | 2 | composer.json, composer.lock |
| `renovate` | 1 | Renovate configuration |
| `all-packages` | ~13 | Meta-bundle of all package files |

### Documentation & Templates

| Bundle | Files | Description |
|--------|-------|-------------|
| `root-docs` | 4 | README, LICENSE, CHANGELOG, CODE_OF_CONDUCT |
| `templates-docs` | 5 | SRS, features, ADR, API, RUNBOOK templates |
| `templates-ai` | 4 | AI agent configuration and rules |
| `templates-git` | 2 | Git submodules and Go shell templates |
| `all-templates` | ~11 | Meta-bundle of all templates |

### Rules Bundles

| Bundle | Files | Description |
|--------|-------|-------------|
| `rules-code-quality` | 2 | Clean code and error handling |
| `rules-git-workflow` | 2 | Commit messages and branch naming |
| `rules-testing` | 1 | Test coverage requirements |
| `rules-documentation` | 1 | API documentation standards |
| `rules-security` | 1 | Secrets management |
| `rules-deployment` | 1 | Deployment checklist |
| `all-rules` | ~8 | Meta-bundle of all rules |

### MCP Server

| Bundle | Files | Description |
|--------|-------|-------------|
| `mcp-server` | 8 | Complete Model Context Protocol server |

### Scripts

| Bundle | Files | Description |
|--------|-------|-------------|
| `scripts` | 3 | Download scripts and shell functions |

## Downloading Bundles

### Using Shell Functions

**List available bundles:**
```bash
npb-list
```

**Download a bundle:**
```bash
# To current directory
npb-download github-workflows-ci

# To specific directory
npb-download docker ./my-project

# Download meta-bundle
npb-download all-github
```

### Using Shell Script

**Download and run:**
```bash
# List bundles
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh | bash -s -- list

# Download a bundle
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh | bash -s -- github-workflows-ci
```

**Save script first:**
```bash
curl -O https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/download-bundle.sh
chmod +x download-bundle.sh

./download-bundle.sh list
./download-bundle.sh github-workflows-ci ./output-dir
```

### Using Node.js CLI

**Interactive mode:**
```bash
npx github:cbwinslow/new_project_bundle bundle-downloader
```

**Direct download:**
```bash
npx github:cbwinslow/new_project_bundle bundle-downloader download github-workflows-ci
```

**With options:**
```bash
npx github:cbwinslow/new_project_bundle bundle-downloader download docker \
  --output ./my-project \
  --repo myuser/my-fork \
  --branch develop
```

## Bundle Manifest

All bundles are defined in `bundles.json`:

```json
{
  "version": "1.0.0",
  "bundles": {
    "bundle-name": {
      "name": "Display Name",
      "description": "What this bundle includes",
      "files": ["path/to/file1", "path/to/file2"],
      "includes": ["other-bundle"]
    }
  }
}
```

**View the manifest:**
```bash
curl https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/bundles.json | jq
```

## Meta-Bundles

Meta-bundles include other bundles:

```json
{
  "all-github": {
    "name": "Complete GitHub Configuration",
    "includes": [
      "github-core",
      "github-issue-templates",
      "github-workflows-ci",
      "github-workflows-security",
      "github-workflows-automation",
      "github-workflows-quality",
      "github-configs"
    ]
  }
}
```

When you download a meta-bundle, all included bundles are downloaded automatically.

## Custom Bundles

Create your own bundle manifest:

1. **Fork the repository**
2. **Edit bundles.json**:
   ```json
   {
     "my-custom-bundle": {
       "name": "My Custom Setup",
       "description": "Files I always need",
       "files": [
         ".github/workflows/ci.yml",
         "Dockerfile",
         "package.json"
       ]
     }
   }
   ```
3. **Use your fork**:
   ```bash
   NPB_REPO=myuser/my-fork npb-download my-custom-bundle
   ```

## Common Workflows

### New Node.js Project

```bash
npb-download package-nodejs
npb-download github-workflows-ci
npb-download dotfiles
npb-download docker
```

### Add Security Scanning

```bash
npb-download github-workflows-security
npb-download pre-commit
```

### Documentation Project

```bash
npb-download all-templates ./docs
npb-download root-docs
```

### Complete Setup

```bash
npb-download complete ./my-project
```

## Finding Files

Not sure which bundle contains a file?

```bash
# Search manifest
curl -s https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/bundles.json | \
  jq -r '.bundles | to_entries[] | select(.value.files[]? | contains("ci.yml")) | .key'
```

## Advanced Usage

### Batch Downloads

```bash
# Download multiple bundles
for bundle in github-core docker dotfiles; do
  npb-download "$bundle" ./my-project
done
```

### Custom Repository/Branch

```bash
# Environment variables
export NPB_REPO="myorg/my-bundle"
export NPB_BRANCH="develop"
npb-download github-workflows-ci

# Or inline
NPB_REPO=myorg/my-bundle npb-download docker
```

### Programmatic Usage

```typescript
import { BundleDownloader } from 'new-project-bundle/dist/cli/bundle-downloader.js';

const downloader = new BundleDownloader(
  'cbwinslow/new_project_bundle',
  'main',
  './output'
);

await downloader.loadManifest();
await downloader.downloadBundle('github-workflows-ci');
```

## Troubleshooting

### Bundle Not Found

```bash
# Check available bundles
npb-list

# Bundle names are case-sensitive and use kebab-case
npb-download github-workflows-ci  # ✓ Correct
npb-download GitHub-Workflows-CI  # ✗ Wrong
```

### Failed Downloads

```bash
# Update cache
npb-update

# Try again
npb-download github-workflows-ci

# Check network
ping github.com
```

### Partial Downloads

If some files fail to download:
- Check file paths in bundles.json
- Verify files exist in the repository
- Check network connectivity
- Try downloading individual files

## Related Documentation

- [Getting Started](Getting-Started.md) - Initial setup
- [Rules System](Rules-System.md) - Development rules
- [Shell Integration](Shell-Integration.md) - Shell functions
