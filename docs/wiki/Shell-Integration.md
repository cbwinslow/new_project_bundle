# Shell Integration Guide

This guide covers integrating New Project Bundle functions into your bash or zsh shell.

## Installation

### Automatic Installation

The easiest way to install NPB functions:

```bash
# This will download and append to your shell config
npb-install
```

This command:
1. Detects your shell (bash or zsh)
2. Downloads the latest shell-functions.sh
3. Appends it to ~/.bashrc or ~/.zshrc
4. Provides instructions to reload your shell

### Manual Installation

#### For Bash
```bash
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.bashrc
source ~/.bashrc
```

#### For Zsh
```bash
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/shell-functions.sh >> ~/.zshrc
source ~/.zshrc
```

## Available Functions

### Bundle Management

#### npb-list
List all available bundles with descriptions.

```bash
npb-list
```

#### npb-download
Download a bundle to the current or specified directory.

```bash
# Download to current directory
npb-download github-workflows-ci

# Download to specific directory
npb-download docker ./my-project
```

### Rule Management

#### npb-list-rules
List all available development rules organized by category.

```bash
npb-list-rules
```

#### npb-download-rule
Download a specific rule file.

```bash
npb-download-rule code-quality/clean-code.md
```

#### npb-query
Search for rules by keyword.

```bash
npb-query commit
```

#### npb-browse
Interactive rule browser using fzf (fuzzy finder).

```bash
npb-browse
```

### Utility Functions

#### npb-update
Update the cached bundle manifest and reload functions.

```bash
npb-update
```

#### npb-help
Display help information for all available functions.

```bash
npb-help
```

## Aliases

Several convenient aliases are created automatically:

```bash
npb          # Same as npb-help
npb-ls       # Same as npb-list
npb-dl       # Same as npb-download
npb-rules    # Same as npb-list-rules
npb-search   # Same as npb-query
```

## Configuration

Customize NPB behavior with environment variables:

```bash
export NPB_REPO="myusername/my-fork"
export NPB_BRANCH="develop"
export NPB_CACHE_DIR="$HOME/.config/npb/cache"
```

## Examples

### Setting Up a New Project

```bash
# Download GitHub workflow files
npb-download github-workflows-ci ./my-project

# Download Docker configuration
npb-download docker ./my-project

# Download development rules
npb-download-rule code-quality/clean-code.md ./my-project/docs/
```

## Troubleshooting

### Functions Not Found

If commands like `npb-list` are not found:

1. Verify installation:
   ```bash
   grep "NPB_REPO" ~/.bashrc   # or ~/.zshrc
   ```

2. Reload your shell:
   ```bash
   source ~/.bashrc   # or source ~/.zshrc
   ```

### Cache Issues

If bundle data seems outdated:

```bash
rm -rf ~/.cache/npb
npb-update
```

## Getting Help

- Run `npb-help` for command reference
- Check the [GitHub repository](https://github.com/cbwinslow/new_project_bundle)
- Open an [issue](https://github.com/cbwinslow/new_project_bundle/issues)
