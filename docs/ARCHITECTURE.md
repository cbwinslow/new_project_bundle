# Bundle System Architecture

This document explains how the bundle downloader system works internally.

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                        │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ bundles.json │  │ Source Files │  │ Scripts & CLI Tool │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ (HTTP GET)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Bundle Downloader CLI                       │
│                                                                   │
│  ┌─────────────────┐         ┌──────────────────────────┐      │
│  │ Load Manifest   │────────▶│ Parse Bundle Definitions │      │
│  └─────────────────┘         └──────────────────────────┘      │
│           │                              │                       │
│           │                              ▼                       │
│           │                   ┌──────────────────────┐          │
│           │                   │ Resolve Dependencies │          │
│           │                   │ (nested bundles)     │          │
│           │                   └──────────────────────┘          │
│           │                              │                       │
│           ▼                              ▼                       │
│  ┌─────────────────┐         ┌──────────────────────┐          │
│  │ Interactive UI  │         │ Download Files       │          │
│  │ (list/select)   │────────▶│ (parallel fetch)     │          │
│  └─────────────────┘         └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ (Write to disk)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Local File System                          │
│  ./downloaded-bundles/                                           │
│  ├── .github/                                                    │
│  │   ├── workflows/                                              │
│  │   └── CODEOWNERS                                              │
│  ├── templates/                                                  │
│  └── ...                                                         │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Components

### 1. Bundle Manifest (`bundles.json`)

**Purpose:** Central configuration defining all available bundles.

**Structure:**
```json
{
  "version": "1.0.0",
  "bundles": {
    "bundle-key": {
      "name": "Display Name",
      "description": "What this bundle contains",
      "files": ["path/to/file1", "path/to/file2"],
      "includes": ["other-bundle-1", "other-bundle-2"]
    }
  }
}
```

**Key Features:**
- Version tracking for compatibility
- Two types of bundles:
  - **File bundles**: Direct file lists
  - **Meta bundles**: Compositions of other bundles
- Hierarchical bundle resolution

### 2. TypeScript CLI Tool (`src/cli/bundle-downloader.ts`)

**Purpose:** Full-featured Node.js application for bundle management.

**Classes:**

#### `BundleDownloader`
Main class handling all bundle operations.

**Properties:**
- `manifest: BundleManifest` - Loaded bundle definitions
- `repo: string` - GitHub repository (default: cbwinslow/new_project_bundle)
- `branch: string` - Git branch (default: main)
- `outputDir: string` - Download destination

**Methods:**
- `loadManifest()` - Fetch and parse bundles.json from GitHub
- `listBundles()` - Display all available bundles
- `downloadBundle(key)` - Download a specific bundle
- `interactive()` - Launch interactive selection UI
- `resolveBundleFiles(key)` - Recursively resolve all files in a bundle
- `downloadFile(path)` - Download a single file from GitHub raw

**Command-line Interface:**
```typescript
Commands:
  interactive  - Launch interactive selector (default)
  list        - List all bundles
  download    - Download specific bundle
  wget        - Show wget examples
  help        - Show help

Options:
  --repo <owner/name>  - GitHub repository
  --branch <name>      - Git branch
  --output <dir>       - Output directory
```

### 3. Shell Script (`scripts/download-bundle.sh`)

**Purpose:** Lightweight alternative using only bash, wget/curl, and optionally jq.

**Features:**
- No Node.js dependency
- Works with wget or curl
- Optional jq for better JSON parsing
- Fallback parsing without jq
- Color-coded output
- Error handling

**Functions:**
- `download_file()` - Download single file (wget/curl)
- `parse_bundle_json()` - Extract files from bundle (jq or grep)
- `list_bundles()` - Show available bundles
- `main()` - Entry point and command routing

**Environment Variables:**
- `NPB_REPO` - Override default repository
- `NPB_BRANCH` - Override default branch

### 4. Install Script (`scripts/install.sh`)

**Purpose:** One-line installation to local system.

**Process:**
1. Download `download-bundle.sh` to `~/.local/bin/`
2. Make executable
3. Check if directory is in PATH
4. Provide instructions if not

**Usage:**
```bash
curl -sSL https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/scripts/install.sh | bash
```

## 🔄 Data Flow

### Bundle Resolution Algorithm

```
resolveBundleFiles(bundleKey, visited = Set()):
  1. Check if bundleKey in visited (prevent circular deps)
  2. Add bundleKey to visited
  3. Get bundle from manifest
  4. Initialize files = []
  5. If bundle.files exists:
     - Add all files to list
  6. If bundle.includes exists:
     - For each included bundle:
       - Recursively call resolveBundleFiles(included, visited)
       - Add returned files to list
  7. Return files
```

**Example:**
```json
{
  "bundle-a": {
    "files": ["file1.txt", "file2.txt"]
  },
  "bundle-b": {
    "files": ["file3.txt"]
  },
  "meta-bundle": {
    "includes": ["bundle-a", "bundle-b"]
  }
}
```

Resolving `meta-bundle`:
1. Check visited (empty) ✓
2. Add "meta-bundle" to visited
3. Get bundle definition
4. files = []
5. No direct files
6. Process includes:
   - Resolve "bundle-a" → ["file1.txt", "file2.txt"]
   - Resolve "bundle-b" → ["file3.txt"]
7. Return ["file1.txt", "file2.txt", "file3.txt"]

### Download Process

```
downloadBundle(bundleKey):
  1. Load manifest from GitHub
  2. Resolve all files for bundle (with dependencies)
  3. Remove duplicates
  4. For each file:
     a. Construct GitHub raw URL
     b. Fetch file content
     c. Create output directory if needed
     d. Write file to disk
     e. Log success/failure
  5. Report summary (success/failed count)
```

**Parallel Downloads:**
Files are downloaded sequentially in the current implementation to avoid overwhelming the GitHub API. Future enhancement could add parallel downloads with rate limiting.

## 🔌 Integration Points

### 1. GitHub Raw Content API

**URL Pattern:**
```
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
```

**Example:**
```
https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main/.github/workflows/ci.yml
```

**Notes:**
- Public repositories: No authentication needed
- Private repositories: Requires authentication token
- Rate limits: GitHub has rate limits on raw content

### 2. npm/npx Integration

**Package Configuration:**
```json
{
  "bin": {
    "bundle-downloader": "./dist/cli/bundle-downloader.js"
  }
}
```

**Usage:**
```bash
# Direct from GitHub (no installation)
npx github:cbwinslow/new_project_bundle bundle-downloader

# After npm install
npx bundle-downloader
```

### 3. Shell Environment

**Installation to PATH:**
```bash
~/.local/bin/bundle-downloader
```

**Aliases (examples/shell-aliases.sh):**
```bash
alias npb='npx github:cbwinslow/new_project_bundle bundle-downloader'
alias npb-dl='npx ... bundle-downloader download'
```

## 📊 Bundle Statistics

Current bundle manifest statistics:
- **27 total bundles**
- **23 file bundles** (direct file lists)
- **4 meta bundles** (bundle compositions)
- Covering:
  - 34+ GitHub configuration files
  - 18 workflow files
  - 13 package manager files
  - 11 template files
  - 8 MCP server files
  - 11 miscellaneous files

## 🔐 Security Considerations

### 1. Content Trust
- Files downloaded from GitHub's official raw content service
- HTTPS only (enforced)
- No code execution during download (except shell script itself)

### 2. Input Validation
- Bundle names validated against manifest
- File paths sanitized before writing
- Directory traversal prevented

### 3. Rate Limiting
- Sequential downloads to respect GitHub API
- Error handling for 429 (Too Many Requests)
- Retry logic could be added

### 4. Dependency Resolution
- Circular dependency detection
- Maximum recursion depth (implicit via visited set)

## 🚀 Performance Characteristics

### CLI Tool (TypeScript)
- **Cold start:** ~2-3 seconds (Node.js startup)
- **Manifest load:** ~0.5-1 seconds (network)
- **File download:** ~0.5-2 seconds per file (network)
- **Memory usage:** ~30-50 MB (Node.js runtime)

### Shell Script
- **Cold start:** ~0.1 seconds (bash)
- **Manifest load:** ~0.5-1 seconds (network)
- **File download:** ~0.5-2 seconds per file (network)
- **Memory usage:** ~5-10 MB (minimal)

**Optimization Opportunities:**
1. Parallel file downloads (with rate limiting)
2. Caching manifest locally
3. Compression during transfer
4. Progress bar for large downloads

## 🔮 Future Enhancements

### Planned Features
1. **Bundle versioning** - Pin to specific bundle versions
2. **Diff tool** - Show changes before updating
3. **Update command** - Update previously downloaded bundles
4. **Search** - Search files across bundles
5. **Validate** - Check bundle integrity
6. **Create** - Generate bundle from existing files
7. **Compression** - Download bundles as tar.gz
8. **Templates** - Variable substitution in downloaded files

### Technical Improvements
1. **Progress bars** - Visual download progress
2. **Parallel downloads** - With rate limiting
3. **Resume capability** - Continue interrupted downloads
4. **Local cache** - Cache manifest and files
5. **Authentication** - Support private repositories
6. **Offline mode** - Work with cached data

## 📝 Developer Notes

### Adding a New Bundle

1. **Edit `bundles.json`:**
```json
{
  "my-new-bundle": {
    "name": "My New Bundle",
    "description": "Description of what it contains",
    "files": [
      "path/to/file1",
      "path/to/file2"
    ]
  }
}
```

2. **Test locally:**
```bash
npm run bundle-downloader list
npm run bundle-downloader download my-new-bundle
```

3. **Commit and push:**
```bash
git add bundles.json
git commit -m "feat: add my-new-bundle"
git push
```

### Modifying the CLI

The CLI tool is in `src/cli/bundle-downloader.ts`. Key extension points:

**Adding a new command:**
```typescript
switch (command) {
  case 'my-command':
    await downloader.myCommand();
    break;
}
```

**Adding a new option:**
```typescript
if (arg === '--my-option' && i + 1 < args.length) {
  myOption = args[++i];
}
```

### Testing

```bash
# Build
npm run build

# Type check
npm run typecheck

# Test CLI locally (before pushing to GitHub)
npm run bundle-downloader list
npm run bundle-downloader download test-bundle --output /tmp/test
```

## 🔗 Related Documentation

- [Bundle User Guide](../BUNDLES.md)
- [Quick Start](../examples/QUICK_START.md)
- [Use Cases](../examples/USE_CASES.md)
- [Examples](../examples/README.md)

---

**Questions or suggestions?** Open an issue or submit a PR!
