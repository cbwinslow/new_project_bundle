# Copilot Instructions

This repository is a comprehensive bundle of DevOps project files, GitHub configurations, and an MCP (Model Context Protocol) server for AI-assisted development.

## Repository Overview

- **Primary Language**: TypeScript (Node.js)
- **Package Manager**: npm
- **Node.js Version**: 18+ (see `.nvmrc`)
- **Build Tool**: TypeScript compiler (`tsc`)

## Build, Test, and Lint Commands

```bash
# Install dependencies
npm ci

# Build the project
npm run build

# Run type checking
npm run typecheck

# Run linting (currently placeholder)
npm run lint

# Run tests (currently placeholder)
npm run test

# Start MCP server (production)
npm start

# Start MCP server (development)
npm run start:dev

# Clean build artifacts
npm run clean
```

You can also use the Makefile:

```bash
make install    # Install dependencies
make build      # Build for production
make lint       # Run linter
make test       # Run tests
make typecheck  # Run type checking
make clean      # Clean build artifacts
```

## Project Structure

```
src/mcp-server/           # MCP server implementation
├── index.ts              # Server entry point
└── tools/                # Tool modules
    ├── filesystem.ts     # File system operations
    ├── git.ts            # Git repository tools
    ├── time.ts           # Time and timezone tools
    ├── fetch.ts          # HTTP fetch tools
    ├── memory.ts         # In-memory storage tools
    └── system.ts         # System information tools

.github/                  # GitHub configurations
├── workflows/            # GitHub Actions workflows
├── ISSUE_TEMPLATE/       # Issue templates
└── ...                   # Other GitHub config files

templates/                # Project documentation templates
```

## Coding Conventions

### TypeScript Guidelines

1. Use ES modules (`import`/`export`) - the project uses `"type": "module"`
2. Use strict TypeScript types - avoid `any` when possible
3. Follow existing patterns in `src/mcp-server/tools/` for new tool implementations
4. Use meaningful, descriptive names for functions and variables
5. Handle errors properly - never silently swallow errors
6. Log errors with context to stderr (to avoid interfering with JSON-RPC on stdout)

### MCP Server Development

When adding new MCP tools:

1. Create a new file in `src/mcp-server/tools/`
2. Export a `register*Tools(server: McpServer)` function
3. Import and call the registration function in `src/mcp-server/index.ts`
4. Use Zod for input validation (already a dependency)
5. Follow the existing tool patterns for consistency

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
```

Examples:
- `feat(mcp): add new memory search tool`
- `fix(git): handle empty repository case`
- `docs: update README with new tools`

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for server implementation
- `zod` - Runtime type validation
- `typescript` - Type checking and compilation (dev)
- `tsx` - TypeScript execution for development (dev)

## Security Considerations

1. Never commit secrets or credentials
2. Use environment variables for configuration
3. Validate all inputs using Zod schemas
4. Be cautious with file system operations - validate paths
5. The `run_command` tool in system.ts only allows safe read-only commands

## Testing

When adding new functionality:

1. Ensure the code compiles without errors (`npm run build`)
2. Run type checking (`npm run typecheck`)
3. Test manually with the MCP server (`npm run start:dev`)

## Documentation

- Update `README.md` when adding new tools or features
- Document new MCP tools with their purpose and usage
- Keep inline comments minimal but helpful for complex logic
