#!/usr/bin/env node

/**
 * Bundle Downloader CLI
 * 
 * Interactive CLI tool to download file bundles from the new_project_bundle repository
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface Bundle {
  name: string;
  description: string;
  files?: string[];
  includes?: string[];
}

interface BundleManifest {
  version: string;
  bundles: Record<string, Bundle>;
}

const DEFAULT_REPO = 'cbwinslow/new_project_bundle';
const DEFAULT_BRANCH = 'main';
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com';

class BundleDownloader {
  private manifest: BundleManifest | null = null;
  private repo: string;
  private branch: string;
  private outputDir: string;

  constructor(repo: string = DEFAULT_REPO, branch: string = DEFAULT_BRANCH, outputDir: string = './downloaded-bundles') {
    this.repo = repo;
    this.branch = branch;
    this.outputDir = outputDir;
  }

  /**
   * Load the bundle manifest from GitHub
   */
  async loadManifest(): Promise<void> {
    const manifestUrl = `${GITHUB_RAW_URL}/${this.repo}/${this.branch}/bundles.json`;
    
    try {
      const response = await fetch(manifestUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.statusText}`);
      }
      this.manifest = await response.json();
      console.log(`✓ Loaded bundle manifest v${this.manifest?.version}`);
    } catch (error) {
      console.error(`✗ Failed to load manifest from ${manifestUrl}`);
      throw error;
    }
  }

  /**
   * List all available bundles
   */
  listBundles(): void {
    if (!this.manifest) {
      console.error('Manifest not loaded');
      return;
    }

    console.log('\n📦 Available Bundles:\n');
    
    const bundles = Object.entries(this.manifest.bundles);
    bundles.forEach(([key, bundle], index) => {
      const fileCount = this.getBundleFileCount(key);
      console.log(`${index + 1}. ${key}`);
      console.log(`   ${bundle.name}`);
      console.log(`   ${bundle.description}`);
      console.log(`   Files: ${fileCount}`);
      console.log('');
    });
  }

  /**
   * Get the total file count for a bundle (including nested bundles)
   */
  private getBundleFileCount(bundleKey: string): number {
    if (!this.manifest) return 0;
    
    const bundle = this.manifest.bundles[bundleKey];
    if (!bundle) return 0;

    let count = bundle.files?.length || 0;
    
    if (bundle.includes) {
      for (const includedKey of bundle.includes) {
        count += this.getBundleFileCount(includedKey);
      }
    }

    return count;
  }

  /**
   * Resolve all files for a bundle (including nested bundles)
   */
  private resolveBundleFiles(bundleKey: string, visited = new Set<string>()): string[] {
    if (!this.manifest) return [];
    if (visited.has(bundleKey)) return []; // Prevent circular dependencies
    
    visited.add(bundleKey);
    const bundle = this.manifest.bundles[bundleKey];
    if (!bundle) return [];

    let files: string[] = [];

    // Add direct files
    if (bundle.files) {
      files.push(...bundle.files);
    }

    // Add files from included bundles
    if (bundle.includes) {
      for (const includedKey of bundle.includes) {
        files.push(...this.resolveBundleFiles(includedKey, visited));
      }
    }

    return files;
  }

  /**
   * Download a single file from GitHub
   */
  private async downloadFile(filePath: string): Promise<boolean> {
    const fileUrl = `${GITHUB_RAW_URL}/${this.repo}/${this.branch}/${filePath}`;
    const outputPath = join(this.outputDir, filePath);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        console.error(`  ✗ Failed to download ${filePath}: ${response.statusText}`);
        return false;
      }

      const content = await response.text();
      
      // Create directory if it doesn't exist
      await mkdir(dirname(outputPath), { recursive: true });
      
      // Write file
      await writeFile(outputPath, content, 'utf-8');
      
      console.log(`  ✓ ${filePath}`);
      return true;
    } catch (error) {
      console.error(`  ✗ Failed to download ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Download a bundle
   */
  async downloadBundle(bundleKey: string): Promise<void> {
    if (!this.manifest) {
      throw new Error('Manifest not loaded');
    }

    const bundle = this.manifest.bundles[bundleKey];
    if (!bundle) {
      throw new Error(`Bundle '${bundleKey}' not found`);
    }

    console.log(`\n📦 Downloading bundle: ${bundle.name}`);
    console.log(`   ${bundle.description}\n`);

    const files = this.resolveBundleFiles(bundleKey);
    const uniqueFiles = [...new Set(files)]; // Remove duplicates

    console.log(`Downloading ${uniqueFiles.length} files to ${this.outputDir}...\n`);

    let successCount = 0;
    let failCount = 0;

    for (const file of uniqueFiles) {
      const success = await this.downloadFile(file);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log(`\n✓ Download complete: ${successCount} succeeded, ${failCount} failed`);
  }

  /**
   * Interactive mode - let user select bundles
   */
  async interactive(): Promise<void> {
    await this.loadManifest();
    
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };

    let running = true;

    while (running) {
      this.listBundles();
      
      const answer = await question(
        'Enter bundle name or number (or "quit" to exit): '
      );

      if (answer.toLowerCase() === 'quit' || answer.toLowerCase() === 'q') {
        running = false;
        break;
      }

      // Check if it's a number
      const bundleKeys = Object.keys(this.manifest!.bundles);
      let bundleKey: string | undefined;

      const num = parseInt(answer);
      if (!isNaN(num) && num > 0 && num <= bundleKeys.length) {
        bundleKey = bundleKeys[num - 1];
      } else {
        bundleKey = bundleKeys.find(k => k === answer);
      }

      if (!bundleKey) {
        console.log(`\n✗ Invalid selection: ${answer}\n`);
        continue;
      }

      try {
        await this.downloadBundle(bundleKey);
        console.log('');
      } catch (error) {
        console.error(`\n✗ Error downloading bundle:`, error);
      }
    }

    rl.close();
    console.log('\nGoodbye! 👋');
  }
}

/**
 * Generate wget-style download commands
 */
function generateWgetCommands(): void {
  console.log('📥 Wget-style download examples:\n');
  console.log('# Download bundles.json manifest');
  console.log(`wget https://raw.githubusercontent.com/${DEFAULT_REPO}/${DEFAULT_BRANCH}/bundles.json\n`);
  
  console.log('# Download a specific file');
  console.log(`wget https://raw.githubusercontent.com/${DEFAULT_REPO}/${DEFAULT_BRANCH}/.github/workflows/ci.yml\n`);
  
  console.log('# Download multiple files (create a script)');
  console.log('cat > download.sh << \'EOF\'');
  console.log('#!/bin/bash');
  console.log('BASE_URL="https://raw.githubusercontent.com/cbwinslow/new_project_bundle/main"');
  console.log('mkdir -p .github/workflows');
  console.log('wget -P .github/workflows "$BASE_URL/.github/workflows/ci.yml"');
  console.log('wget -P .github/workflows "$BASE_URL/.github/workflows/cd.yml"');
  console.log('EOF');
  console.log('chmod +x download.sh');
  console.log('./download.sh\n');
}

/**
 * Print usage information
 */
function printUsage(): void {
  console.log(`
Bundle Downloader CLI - Download file bundles from GitHub

USAGE:
  bundle-downloader [command] [options]

COMMANDS:
  interactive         Launch interactive bundle selector (default)
  list                List all available bundles
  download <bundle>   Download a specific bundle
  wget                Show wget-style download examples
  help                Show this help message

OPTIONS:
  --repo <owner/name> GitHub repository (default: ${DEFAULT_REPO})
  --branch <name>     Git branch (default: ${DEFAULT_BRANCH})
  --output <dir>      Output directory (default: ./downloaded-bundles)

EXAMPLES:
  # Interactive mode
  bundle-downloader

  # List all bundles
  bundle-downloader list

  # Download a specific bundle
  bundle-downloader download github-workflows-ci

  # Download from a different repo
  bundle-downloader download docker --repo myuser/myrepo

  # Download to a specific directory
  bundle-downloader download all-templates --output ./my-project
`);
}

/**
 * Main CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let command = 'interactive';
  let bundleName = '';
  let repo = DEFAULT_REPO;
  let branch = DEFAULT_BRANCH;
  let outputDir = './downloaded-bundles';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--repo' && i + 1 < args.length) {
      repo = args[++i];
    } else if (arg === '--branch' && i + 1 < args.length) {
      branch = args[++i];
    } else if (arg === '--output' && i + 1 < args.length) {
      outputDir = args[++i];
    } else if (!arg.startsWith('--')) {
      if (!command || command === 'interactive') {
        command = arg;
      } else {
        bundleName = arg;
      }
    }
  }

  const downloader = new BundleDownloader(repo, branch, outputDir);

  try {
    switch (command) {
      case 'interactive':
      case 'i':
        await downloader.interactive();
        break;

      case 'list':
      case 'ls':
        await downloader.loadManifest();
        downloader.listBundles();
        break;

      case 'download':
      case 'dl':
        if (!bundleName) {
          console.error('✗ Please specify a bundle name');
          process.exit(1);
        }
        await downloader.loadManifest();
        await downloader.downloadBundle(bundleName);
        break;

      case 'wget':
        generateWgetCommands();
        break;

      case 'help':
      case '--help':
      case '-h':
        printUsage();
        break;

      default:
        console.error(`✗ Unknown command: ${command}`);
        printUsage();
        process.exit(1);
    }
  } catch (error) {
    console.error('✗ Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
import { pathToFileURL } from 'url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

export { BundleDownloader, generateWgetCommands };
