# AI Agent Linting & Code Quality Rules 📋

> Comprehensive rules for linting, formatting, spacing, and code quality enforcement for AI coding agents

---

## Document Information

| Field | Value |
| ------- | ------- |
| **Version** | 1.0.0 |
| **Last Updated** | 2024-12-03 |
| **Category** | Code Quality & Linting |
| **Audience** | AI Coding Agents (Copilot, OpenHands, Claude, Gemini, etc.) |
| **Priority** | Critical - Must follow |

---

## Table of Contents

- [Overview](#overview)
- [Indentation & Spacing Rules](#indentation--spacing-rules)
- [Tabs vs Spaces](#tabs-vs-spaces)
- [Line Length & Wrapping](#line-length--wrapping)
- [Whitespace Rules](#whitespace-rules)
- [Character Duplication Rules](#character-duplication-rules)
- [Spelling & Typo Rules](#spelling--typo-rules)
- [Syntax Error Prevention](#syntax-error-prevention)
- [ESLint Rules](#eslint-rules)
- [Language-Specific Rules](#language-specific-rules)
- [Formatting Enforcement](#formatting-enforcement)
- [Pre-Commit Checks](#pre-commit-checks)

---

## Overview

This document establishes mandatory code quality rules that all AI agents MUST follow when writing, modifying, or reviewing code. These rules ensure consistent, clean, and maintainable code across the project.

### Rule Priority Levels

| Level | Meaning | Action |
| ------- | --------- | -------- |
| 🔴 **CRITICAL** | Must never violate | Block commit/merge |
| 🟠 **REQUIRED** | Should always follow | Request fix before merge |
| 🟡 **RECOMMENDED** | Best practice | Comment for improvement |
| 🟢 **OPTIONAL** | Nice to have | Suggestion only |

---

## Indentation & Spacing Rules

### Rule L-001: Consistent Indentation 🔴 CRITICAL

**Description**: All code must use consistent indentation within a file and follow project-defined standards.

**Requirements**:

```
✅ Follow .editorconfig settings for each file type
✅ Use 2 spaces for JavaScript/TypeScript/JSON/YAML/HTML/CSS
✅ Use 4 spaces for Python/Java/C#/Go
✅ Use tabs for Makefiles and Go (when specified)
✅ Never mix tabs and spaces in the same file
```

**Detection**:

```bash
# Check with EditorConfig
editorconfig-checker .

# ESLint rule
"indent": ["error", 2]
```

### Rule L-002: Consistent Spacing Around Operators 🟠 REQUIRED

**Description**: Use consistent spacing around operators for readability.

**Examples**:

```javascript
// ❌ Bad - inconsistent spacing
const x=1+2;
const y = 3+ 4;
const z=5 + 6;

// ✅ Good - consistent spacing
const x = 1 + 2;
const y = 3 + 4;
const z = 5 + 6;
```

**ESLint Rules**:

```json
{
  "space-infix-ops": "error",
  "space-before-blocks": "error",
  "keyword-spacing": ["error", { "before": true, "after": true }]
}
```

### Rule L-003: Function Argument Spacing 🟠 REQUIRED

**Description**: Use consistent spacing in function declarations and calls.

**Examples**:

```javascript
// ❌ Bad
function foo( a,b,c ){
  return a+b+c;
}

// ✅ Good
function foo(a, b, c) {
  return a + b + c;
}
```

---

## Tabs vs Spaces

### Rule L-010: Follow Project Configuration 🔴 CRITICAL

**Description**: Always respect the project's `.editorconfig` and linter settings for tabs/spaces.

**Default Settings by Language**:

| Language | Style | Size |
| ---------- | ------- | ------ |
| JavaScript/TypeScript | Spaces | 2 |
| Python | Spaces | 4 |
| Go | Tabs | 4 |
| Java/C# | Spaces | 4 |
| YAML/JSON | Spaces | 2 |
| Makefiles | Tabs | 4 |
| Shell Scripts | Spaces | 2 |
| Dockerfile | Spaces | 4 |

### Rule L-011: Never Mix Tabs and Spaces 🔴 CRITICAL

**Description**: Within a single file, never mix tabs and spaces for indentation.

**Detection**:

```bash
# Find files with mixed indentation
grep -rn $'^\t' --include='*.js' . && grep -rn '^  ' --include='*.js' .
```

---

## Line Length & Wrapping

### Rule L-020: Maximum Line Length 🟠 REQUIRED

**Description**: Lines should not exceed the configured maximum length.

**Defaults**:

| File Type | Max Length | Exception |
| ----------- | ------------ | ----------- |
| Code files | 100 chars | Long strings, URLs |
| Markdown | 120 chars | Tables, URLs |
| JSON | 120 chars | Complex nested structures |

**ESLint Rule**:

```json
{
  "max-len": ["error", {
    "code": 100,
    "tabWidth": 2,
    "ignoreUrls": true,
    "ignoreStrings": true,
    "ignoreTemplateLiterals": true,
    "ignoreRegExpLiterals": true
  }]
}
```

### Rule L-021: Line Wrapping Style 🟡 RECOMMENDED

**Description**: When wrapping lines, follow consistent patterns.

**Examples**:

```javascript
// ❌ Bad - inconsistent wrapping
const result = someLongFunctionName(arg1, arg2,
  arg3, arg4);

// ✅ Good - consistent wrapping
const result = someLongFunctionName(
  arg1,
  arg2,
  arg3,
  arg4
);
```

---

## Whitespace Rules

### Rule L-030: No Trailing Whitespace 🔴 CRITICAL

**Description**: Lines must not have trailing whitespace (spaces or tabs at end of line).

**Detection**:

```bash
# Find trailing whitespace
grep -rn ' $' --include='*.js' .
grep -rn '\t$' --include='*.js' .
```

**ESLint Rule**:

```json
{
  "no-trailing-spaces": "error"
}
```

### Rule L-031: Single Blank Line Between Sections 🟠 REQUIRED

**Description**: Use exactly one blank line between logical sections, functions, and classes.

**Examples**:

```javascript
// ❌ Bad - multiple blank lines
function foo() {}



function bar() {}

// ✅ Good - single blank line
function foo() {}

function bar() {}
```

**ESLint Rule**:

```json
{
  "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }]
}
```

### Rule L-032: Newline at End of File 🔴 CRITICAL

**Description**: All files must end with exactly one newline character.

**ESLint Rule**:

```json
{
  "eol-last": ["error", "always"]
}
```

### Rule L-033: No Whitespace Before Punctuation 🟠 REQUIRED

**Description**: No whitespace before commas, semicolons, or colons.

**Examples**:

```javascript
// ❌ Bad
const arr = [1 , 2 , 3] ;
const obj = { key : value } ;

// ✅ Good
const arr = [1, 2, 3];
const obj = { key: value };
```

---

## Character Duplication Rules

### Rule L-040: No Duplicate Semicolons 🔴 CRITICAL

**Description**: Never use multiple semicolons in a row.

**Examples**:

```javascript
// ❌ Bad
const x = 1;;
const y = 2;;;

// ✅ Good
const x = 1;
const y = 2;
```

**ESLint Rule**:

```json
{
  "no-extra-semi": "error"
}
```

### Rule L-041: No Duplicate Operators 🔴 CRITICAL

**Description**: Do not duplicate operators (except for valid operators like `++`, `--`, `===`).

**Examples**:

```javascript
// ❌ Bad - accidental duplication
const x = 1 ++ 2;  // Invalid
const y = a &&& b; // Invalid
const z = x ||| y; // Invalid

// ✅ Good - valid operators
const x = i++;
const y = a && b;
const z = x || y;
```

### Rule L-042: No Duplicate Brackets 🔴 CRITICAL

**Description**: Avoid unnecessary nested or duplicate brackets.

**Examples**:

```javascript
// ❌ Bad
const x = ((value));
const arr = [[1, 2, 3]]; // Only if not intentional
const obj = { { key: value } }; // Invalid

// ✅ Good
const x = value;
const arr = [1, 2, 3];
const obj = { key: value };
```

### Rule L-043: No Duplicate Quotes 🟠 REQUIRED

**Description**: Do not use duplicate or mismatched quotes.

**Examples**:

```javascript
// ❌ Bad
const str = ""hello"";
const str2 = ''world'';
const str3 = "hello';

// ✅ Good
const str = "hello";
const str2 = 'world';
```

---

## Spelling & Typo Rules

### Rule L-050: Spell Check Code Comments 🟠 REQUIRED

**Description**: All comments must be free of spelling errors.

**Tools**:

- cspell for spell checking
- Project dictionary in `.github/cspell.json`

**Configuration**:

```json
{
  "version": "0.2",
  "language": "en",
  "words": ["customword", "projectterm"],
  "ignorePaths": ["node_modules/**", "dist/**"]
}
```

### Rule L-051: Spell Check String Literals 🟡 RECOMMENDED

**Description**: User-facing strings should be spell-checked.

**Examples**:

```javascript
// ❌ Bad - typos
const msg = "Plese enter your pasword";
const err = "Invlaid input recieved";

// ✅ Good
const msg = "Please enter your password";
const err = "Invalid input received";
```

### Rule L-052: Consistent Naming Conventions 🔴 CRITICAL

**Description**: Use correct spelling in identifiers and follow naming conventions.

**Patterns**:

| Type | Convention | Example |
| ------ | ------------ | --------- |
| Variables | camelCase | `userName`, `isValid` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Functions | camelCase | `getUserById`, `validateInput` |
| Classes | PascalCase | `UserService`, `HttpClient` |
| Files (JS/TS) | kebab-case or camelCase | `user-service.ts` |
| Files (Components) | PascalCase | `UserProfile.tsx` |

### Rule L-053: Common Typo Detection 🟠 REQUIRED

**Description**: Detect and correct common programming typos.

**Common Typos to Watch**:

```
❌ lenght → ✅ length
❌ widht → ✅ width
❌ heigth → ✅ height
❌ retrun → ✅ return
❌ fucntion → ✅ function
❌ calback → ✅ callback
❌ promies → ✅ promise
❌ recieve → ✅ receive
❌ occured → ✅ occurred
❌ seperate → ✅ separate
❌ definately → ✅ definitely
❌ enviroment → ✅ environment
❌ referer → ✅ referrer (HTTP header is "Referer" - historical typo)
```

---

## Syntax Error Prevention

### Rule L-060: Balanced Brackets 🔴 CRITICAL

**Description**: All opening brackets must have matching closing brackets.

**Types**:

- Parentheses: `( )`
- Square brackets: `[ ]`
- Curly braces: `{ }`
- Angle brackets: `< >`

**Detection**:

```javascript
// ❌ Unbalanced
if (condition {
  doSomething();
}

// ✅ Balanced
if (condition) {
  doSomething();
}
```

### Rule L-061: Valid String Delimiters 🔴 CRITICAL

**Description**: Strings must have matching opening and closing quotes.

**Examples**:

```javascript
// ❌ Bad
const str = "hello';
const str2 = 'world;

// ✅ Good
const str = "hello";
const str2 = 'world';
```

### Rule L-062: Valid Template Literals 🔴 CRITICAL

**Description**: Template literals must use backticks and have valid expressions.

**Examples**:

```javascript
// ❌ Bad
const msg = "Hello ${name}";  // Wrong quotes for template
const greeting = `Hello $name`;  // Missing braces

// ✅ Good
const msg = `Hello ${name}`;
const greeting = `Hello ${name}`;
```

### Rule L-063: No Unreachable Code 🔴 CRITICAL

**Description**: Do not write code after return, throw, break, or continue statements.

**ESLint Rule**:

```json
{
  "no-unreachable": "error"
}
```

### Rule L-064: Valid Variable Declarations 🔴 CRITICAL

**Description**: Variables must be properly declared before use.

**ESLint Rules**:

```json
{
  "no-undef": "error",
  "no-use-before-define": "error",
  "no-redeclare": "error"
}
```

---

## ESLint Rules

### Rule L-070: ESLint Configuration 🔴 CRITICAL

**Description**: Follow the project's ESLint configuration.

**Recommended Base Configuration** (`.eslintrc.json`):

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "no-unused-vars": "error",
    "no-console": "warn",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "brace-style": ["error", "1tbs"],
    "comma-dangle": ["error", "always-multiline"],
    "no-trailing-spaces": "error",
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
    "space-infix-ops": "error",
    "keyword-spacing": "error",
    "arrow-spacing": "error",
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "comma-spacing": ["error", { "before": false, "after": true }]
  }
}
```

### Rule L-071: TypeScript ESLint Rules 🔴 CRITICAL

**Description**: For TypeScript projects, use additional TypeScript-specific rules.

**TypeScript Configuration**:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/consistent-type-imports": "error"
  }
}
```

### Rule L-072: Disable Rules Only With Justification 🟠 REQUIRED

**Description**: When disabling ESLint rules, always provide a justification.

**Examples**:

```javascript
// ❌ Bad - no explanation
// eslint-disable-next-line no-console
console.log(value);

// ✅ Good - with justification
// eslint-disable-next-line no-console -- Required for CLI output
console.log(value);
```

---

## Language-Specific Rules

### JavaScript/TypeScript Rules

| Rule ID | Description | Severity |
| --------- | ------------- | ---------- |
| L-080 | Use `const` over `let` when variable is not reassigned | 🟠 REQUIRED |
| L-081 | No `var` declarations | 🔴 CRITICAL |
| L-082 | Use strict equality (`===` and `!==`) | 🔴 CRITICAL |
| L-083 | Use arrow functions for callbacks | 🟡 RECOMMENDED |
| L-084 | Destructure objects and arrays when appropriate | 🟡 RECOMMENDED |
| L-085 | Use template literals for string interpolation | 🟠 REQUIRED |
| L-086 | No implicit type coercion | 🟠 REQUIRED |

### Python Rules

| Rule ID | Description | Severity |
| --------- | ------------- | ---------- |
| L-090 | Follow PEP 8 style guide | 🔴 CRITICAL |
| L-091 | Use 4 spaces for indentation | 🔴 CRITICAL |
| L-092 | Maximum line length of 88 (Black default) or 79 (PEP 8) | 🟠 REQUIRED |
| L-093 | Use type hints for function signatures | 🟡 RECOMMENDED |
| L-094 | Use f-strings for formatting | 🟡 RECOMMENDED |
| L-095 | Use docstrings for public functions/classes | 🟠 REQUIRED |

### Go Rules

| Rule ID | Description | Severity |
| --------- | ------------- | ---------- |
| L-100 | Run `go fmt` before committing | 🔴 CRITICAL |
| L-101 | Run `go vet` to catch common mistakes | 🔴 CRITICAL |
| L-102 | Use `golangci-lint` for comprehensive linting | 🟠 REQUIRED |
| L-103 | Export only necessary identifiers | 🟠 REQUIRED |
| L-104 | Handle all errors explicitly | 🔴 CRITICAL |

---

## Formatting Enforcement

### Rule L-110: Use Automatic Formatters 🔴 CRITICAL

**Description**: Use project-configured formatters before committing code.

**Language Formatters**:

| Language | Formatter | Command |
| ---------- | ----------- | --------- |
| JavaScript/TypeScript | Prettier | `npx prettier --write .` |
| Python | Black | `black .` |
| Go | gofmt | `go fmt ./...` |
| Rust | rustfmt | `cargo fmt` |
| Java | google-java-format | Via IDE or CLI |
| SQL | sqlformat | `sqlformat -r file.sql` |

### Rule L-111: Format on Save 🟡 RECOMMENDED

**Description**: Configure IDE/editor to format on save.

**VS Code Settings**:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  }
}
```

---

## Pre-Commit Checks

### Rule L-120: Run Pre-Commit Hooks 🔴 CRITICAL

**Description**: Ensure pre-commit hooks pass before committing.

**Setup**:

```bash
pip install pre-commit
pre-commit install
```

**Run Manually**:

```bash
pre-commit run --all-files
```

### Rule L-121: Pre-Commit Hook Requirements 🔴 CRITICAL

**Description**: The following checks must pass:

| Check | Purpose |
| ------- | --------- |
| trailing-whitespace | Remove trailing whitespace |
| end-of-file-fixer | Ensure newline at end of file |
| check-yaml | Validate YAML syntax |
| check-json | Validate JSON syntax |
| check-merge-conflict | Detect merge conflict markers |
| detect-private-key | Prevent committing private keys |
| mixed-line-ending | Enforce consistent line endings |
| markdownlint | Lint markdown files |
| shellcheck | Lint shell scripts |

---

## Verification Commands

### Quick Reference

```bash
# Full lint check
npm run lint

# Type check (TypeScript)
npm run typecheck

# Format check
npx prettier --check .

# Spell check
npx cspell "**/*.{js,ts,md}"

# Pre-commit all files
pre-commit run --all-files

# Build verification
npm run build
```

---

## Compliance Checklist

Before submitting any code changes, verify:

- [ ] Code passes all linting rules (`npm run lint`)
- [ ] No trailing whitespace
- [ ] Consistent indentation (tabs/spaces per project config)
- [ ] No duplicate characters (semicolons, operators, brackets)
- [ ] No spelling errors in comments and strings
- [ ] All brackets are balanced
- [ ] No syntax errors
- [ ] Files end with newline
- [ ] Pre-commit hooks pass
- [ ] Code is formatted with project formatter

---

**Version**: 1.0.0
**Last Updated**: 2024-12-03
**Maintained By**: Project Team
