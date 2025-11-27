# Go Shell - Interactive Command Line Tool 🐚

> A template for building an interactive shell/CLI application in Go

## Overview

This directory contains the Go shell submodule that provides an interactive command-line interface for your project. The shell is built in Go for cross-platform compatibility and performance.

## Adding as a Submodule

To add this Go shell to your project as a Git submodule:

```bash
# Add the submodule
git submodule add https://github.com/your-org/go-shell.git go-shell

# Initialize and update
git submodule update --init --recursive

# Clone with submodules (for new clones)
git clone --recurse-submodules https://github.com/your-org/your-project.git
```

## Project Structure

```
go-shell/
├── cmd/
│   └── shell/
│       └── main.go           # Entry point
├── internal/
│   ├── commands/
│   │   ├── commands.go       # Command registry
│   │   ├── help.go           # Help command
│   │   ├── version.go        # Version command
│   │   └── ...               # Other commands
│   ├── config/
│   │   └── config.go         # Configuration management
│   ├── prompt/
│   │   └── prompt.go         # Interactive prompt
│   └── shell/
│       └── shell.go          # Shell implementation
├── pkg/
│   ├── executor/
│   │   └── executor.go       # Command execution
│   └── parser/
│       └── parser.go         # Input parsing
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## Building

```bash
cd go-shell

# Build for current platform
go build -o shell ./cmd/shell

# Build for all platforms
make build-all

# Run tests
go test ./...

# Run with race detector
go test -race ./...
```

## Usage

### Interactive Mode

```bash
./shell
> help
> version
> exit
```

### Command Mode

```bash
./shell --command "your command here"
./shell -c "your command here"
```

## Creating New Commands

1. Create a new file in `internal/commands/`:

```go
// internal/commands/mycommand.go
package commands

import (
    "fmt"
)

func init() {
    Register("mycommand", &MyCommand{})
}

type MyCommand struct{}

func (c *MyCommand) Name() string {
    return "mycommand"
}

func (c *MyCommand) Description() string {
    return "Description of my command"
}

func (c *MyCommand) Usage() string {
    return "mycommand [options] <args>"
}

func (c *MyCommand) Execute(args []string) error {
    fmt.Println("Executing my command")
    return nil
}
```

2. Import the command in the registry:

```go
// internal/commands/commands.go
import (
    _ "your-module/internal/commands/mycommand"
)
```

## Configuration

Configuration is loaded from multiple sources (in order of precedence):

1. Command-line flags
2. Environment variables
3. Configuration file (`~/.go-shell/config.yaml`)
4. Default values

Example configuration file:

```yaml
# ~/.go-shell/config.yaml
prompt:
  format: "{{.user}}@{{.host}} {{.cwd}} > "
  color: true

history:
  file: ~/.go-shell/history
  size: 10000

aliases:
  ll: "ls -la"
  gs: "git status"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SHELL_CONFIG` | Config file path | `~/.go-shell/config.yaml` |
| `SHELL_HISTORY` | History file path | `~/.go-shell/history` |
| `SHELL_DEBUG` | Enable debug mode | `false` |

## Dependencies

The shell uses minimal dependencies:

```go
// go.mod
module github.com/your-org/go-shell

go 1.22

require (
    github.com/spf13/cobra v1.8.0         // CLI framework
    github.com/spf13/viper v1.18.2        // Configuration
    github.com/chzyer/readline v1.5.1     // Line editing
    github.com/fatih/color v1.16.0        // Colored output
)
```

## Features

- [x] Interactive prompt with line editing
- [x] Command history with persistence
- [x] Tab completion
- [x] Command aliases
- [x] Plugin system
- [x] Cross-platform support
- [x] Configuration file support
- [x] Environment variable interpolation
- [x] Built-in commands (help, version, exit, etc.)

## Testing

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Run benchmarks
go test -bench=. ./...
```

## Makefile Targets

```makefile
make build          # Build for current platform
make build-all      # Build for all platforms
make test           # Run tests
make test-coverage  # Run tests with coverage
make lint           # Run linter
make fmt            # Format code
make clean          # Clean build artifacts
make install        # Install to $GOPATH/bin
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - See LICENSE file for details

---

## Quick Start Template

To create a new Go shell from scratch:

```bash
# Create project structure
mkdir -p go-shell/{cmd/shell,internal/{commands,config,prompt,shell},pkg/{executor,parser}}

# Initialize Go module
cd go-shell
go mod init github.com/your-org/go-shell

# Create main.go
cat > cmd/shell/main.go << 'EOF'
package main

import (
    "fmt"
    "os"

    "github.com/your-org/go-shell/internal/shell"
)

func main() {
    s := shell.New()
    if err := s.Run(); err != nil {
        fmt.Fprintf(os.Stderr, "Error: %v\n", err)
        os.Exit(1)
    }
}
EOF

# Build and run
go build -o shell ./cmd/shell
./shell
```
