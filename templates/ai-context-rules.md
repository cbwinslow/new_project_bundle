# AI Agent Context & Behavior Rules 📚

> Guidelines for AI agents to read documentation, use existing tools, ask questions, and apply critical reasoning

---

## Document Information

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Last Updated** | 2024-12-03 |
| **Category** | AI Agent Behavior & Context |
| **Audience** | AI Coding Agents (Copilot, OpenHands, Claude, Gemini, etc.) |
| **Priority** | Critical - Must follow |

---

## Configuration

### Task Logging Repository

```yaml
# CONFIGURABLE: Set your repository for saving task logs
TASK_LOG_REPOSITORY: "your-username/your-project-tasks"
TASK_LOG_BRANCH: "main"
TASK_LOG_PATH: "tasks/"
```

> **Note**: Update the above configuration with your actual repository details for task logging.

---

## Table of Contents

- [Documentation First Rules](#documentation-first-rules)
- [Non-Destructive Action Rules](#non-destructive-action-rules)
- [Use Existing Tools Rules](#use-existing-tools-rules)
- [Question Asking Rules](#question-asking-rules)
- [Critical Reasoning Rules](#critical-reasoning-rules)
- [Task Breakdown System](#task-breakdown-system)
- [Task Logging Requirements](#task-logging-requirements)
- [Problem Solving Framework](#problem-solving-framework)
- [Context Window Management](#context-window-management)

---

## Documentation First Rules

### Rule C-001: Read Documentation Before Acting 🔴 CRITICAL

**Description**: Before making ANY changes or writing ANY code, the AI agent MUST read and understand the project documentation.

**Required Reading Order**:
1. `README.md` - Project overview and setup
2. `CONTRIBUTING.md` - Contribution guidelines
3. `.github/copilot-instructions.md` - AI-specific instructions
4. `templates/rules.md` - Development rules
5. `templates/agents.md` - Agent configuration
6. `templates/ai-linting-rules.md` - Code quality rules
7. Any domain-specific documentation in `docs/` or `templates/`

**Rationale**: Loading documentation into context ensures the AI agent understands:
- Project architecture and patterns
- Coding conventions and standards
- Existing utilities and functions
- Testing requirements
- Security considerations

### Rule C-002: Search for Existing Documentation 🔴 CRITICAL

**Description**: Before implementing ANY feature, search for existing documentation that might inform your approach.

**Search Locations**:
```
./README.md
./docs/
./templates/
./.github/
./CHANGELOG.md
./API.md
./ARCHITECTURE.md
./RUNBOOK.md
```

**Actions**:
1. Search for keywords related to your task
2. Read any relevant documentation found
3. Note any constraints or requirements discovered
4. Reference documentation in your implementation

### Rule C-003: Check for Similar Implementations 🟠 REQUIRED

**Description**: Before writing new code, search the codebase for similar implementations.

**Search Strategy**:
```bash
# Search for similar function names
grep -r "functionName" --include="*.ts" --include="*.js"

# Search for similar patterns
grep -r "pattern" --include="*.ts" --include="*.js"

# Search for similar imports
grep -r "import.*ModuleName" --include="*.ts" --include="*.js"
```

---

## Non-Destructive Action Rules

### Rule C-010: Never Delete Without Permission 🔴 CRITICAL

**Description**: AI agents must NEVER delete files, directories, data, or significant code without explicit user permission.

**Prohibited Actions** (without permission):
```
❌ rm -rf / rm -r / rmdir commands
❌ DELETE queries on databases
❌ Removing functions/classes/modules
❌ Clearing caches/storage
❌ Dropping tables/collections
❌ Overwriting configuration files completely
❌ Force pushing to branches
❌ Hard resetting git history
```

**Required Before Destructive Actions**:
1. Explain what will be deleted
2. Explain why deletion is necessary
3. Propose alternatives if possible
4. Ask for explicit confirmation
5. Create backup if applicable

### Rule C-011: Preserve Working Code 🔴 CRITICAL

**Description**: Never remove or significantly modify working code unless absolutely necessary and user-approved.

**Guidelines**:
```
✅ Add new code alongside existing code
✅ Deprecate before removing
✅ Comment out instead of delete (temporarily)
✅ Create backup branches
✅ Use feature flags for new implementations
```

### Rule C-012: No Cutting Corners 🔴 CRITICAL

**Description**: AI agents must not take shortcuts that compromise code quality, security, or functionality.

**Prohibited Shortcuts**:
```
❌ Disabling security checks
❌ Skipping input validation
❌ Removing error handling
❌ Hardcoding values that should be configurable
❌ Ignoring edge cases
❌ Using unsafe defaults
❌ Skipping tests to "save time"
❌ Using deprecated APIs without migration plan
```

### Rule C-013: Reversible Changes First 🟠 REQUIRED

**Description**: When possible, make changes that are easily reversible.

**Strategies**:
```
✅ Use version control effectively
✅ Create feature branches
✅ Implement with feature flags
✅ Add new code before removing old code
✅ Document rollback procedures
```

---

## Use Existing Tools Rules

### Rule C-020: Discover Before Creating 🔴 CRITICAL

**Description**: Before creating ANY new function, utility, or tool, search extensively for existing implementations.

**Search Strategy**:
```bash
# 1. Search project codebase
grep -r "functionName" --include="*.ts" --include="*.js" .

# 2. Check utility files
ls src/utils/ src/helpers/ src/lib/ src/common/

# 3. Check package.json for existing dependencies
cat package.json | jq '.dependencies, .devDependencies'

# 4. Search for similar patterns
grep -r "similar pattern" .
```

### Rule C-021: Use Project Utilities 🔴 CRITICAL

**Description**: Always use existing project utilities instead of creating duplicates.

**Common Utility Locations**:
```
src/utils/
src/helpers/
src/lib/
src/common/
src/shared/
src/core/
```

**Before Creating New Utility**:
1. List all files in utility directories
2. Read relevant utility files
3. Check if existing utility can be extended
4. If creating new, follow existing patterns

### Rule C-022: Leverage Existing Dependencies 🔴 CRITICAL

**Description**: Use libraries already in the project before adding new ones.

**Checklist**:
1. Review `package.json` (npm), `requirements.txt` (pip), `Cargo.toml` (Rust), etc.
2. Check if existing dependency provides needed functionality
3. Read existing dependency documentation
4. Only add new dependency if absolutely necessary

**Example**:
```javascript
// ❌ Bad - adding lodash when native array methods exist
import _ from 'lodash';
const filtered = _.filter(arr, fn);

// ✅ Good - using native JavaScript
const filtered = arr.filter(fn);
```

### Rule C-023: Don't Reinvent the Wheel 🔴 CRITICAL

**Description**: Never reimplement functionality that already exists in the project or standard libraries.

**Common Reinventions to Avoid**:
| Need | Don't Reinvent | Use Instead |
|------|----------------|-------------|
| UUID generation | Custom function | `crypto.randomUUID()` or existing lib |
| Date formatting | Custom parser | Existing date lib in project |
| Validation | Custom validators | Project's validation utils |
| HTTP requests | Custom fetch wrapper | Existing HTTP client |
| Logging | Custom logger | Project's logger |
| Configuration | Custom config reader | Existing config system |

### Rule C-024: Extend, Don't Duplicate 🟠 REQUIRED

**Description**: When existing code is close but not exact, extend it rather than duplicate.

**Strategies**:
```javascript
// ❌ Bad - duplicating entire function
function formatDateUS(date) {
  // Duplicated logic from formatDate
}

// ✅ Good - extending existing function
function formatDate(date, locale = 'default') {
  // Original logic with locale support
}
const formatDateUS = (date) => formatDate(date, 'en-US');
```

---

## Question Asking Rules

### Rule C-030: Ask When Unsure 🔴 CRITICAL

**Description**: When uncertain about ANY aspect of implementation, ASK the user before proceeding.

**Situations to Ask**:
```
? Unclear requirements
? Multiple valid approaches
? Potential breaking changes
? Security implications
? Performance trade-offs
? Architecture decisions
? Technology choices
? Naming conventions
? Test coverage expectations
```

**How to Ask**:
```markdown
I need clarification before proceeding:

1. **Question**: [Specific question]
   **Context**: [Why this matters]
   **Options**: [If applicable]

2. **Question**: [Another question]
   ...
```

### Rule C-031: Clarify Ambiguous Requirements 🔴 CRITICAL

**Description**: Never assume meaning when requirements are ambiguous.

**Ambiguity Examples**:
```
Ambiguous: "Make it faster"
Ask: "What is the current performance? What is the target? 
      Which operations should be optimized?"

Ambiguous: "Add user authentication"
Ask: "What auth methods? OAuth? JWT? Sessions? 
      Which providers? What roles/permissions?"

Ambiguous: "Fix the bug"
Ask: "Which bug specifically? Can you provide steps to reproduce?
      What is expected vs actual behavior?"
```

### Rule C-032: Confirm Before Major Changes 🔴 CRITICAL

**Description**: Always confirm with user before making significant architectural or design changes.

**Major Changes Include**:
- Database schema changes
- API contract changes
- Authentication/authorization changes
- Core algorithm changes
- Dependency additions/removals
- Infrastructure changes
- Breaking interface changes

### Rule C-033: Document Assumptions 🟠 REQUIRED

**Description**: When making assumptions (after reasonable effort to clarify), document them clearly.

**Format**:
```javascript
/**
 * ASSUMPTION: User IDs are always UUIDs
 * Reason: Based on existing user model pattern
 * Impact: Will fail if non-UUID IDs are used
 * TODO: Confirm with team
 */
```

---

## Critical Reasoning Rules

### Rule C-040: Analyze Before Acting 🔴 CRITICAL

**Description**: Apply critical thinking to every task before implementation.

**Analysis Framework**:
```markdown
1. **Understand**: What is the actual problem?
2. **Context**: What constraints exist?
3. **Impact**: Who/what is affected?
4. **Alternatives**: What are the options?
5. **Trade-offs**: What are pros/cons of each?
6. **Risk**: What could go wrong?
7. **Decision**: What approach and why?
```

### Rule C-041: Question the Prompt 🟠 REQUIRED

**Description**: Don't blindly execute prompts - analyze if they make sense.

**Questions to Ask**:
```
- Does this request align with project goals?
- Is this the best approach to solve the underlying problem?
- Are there better alternatives the user might not know about?
- Does this introduce technical debt?
- Are there security implications?
- Will this work with existing architecture?
```

### Rule C-042: Consider Edge Cases 🔴 CRITICAL

**Description**: Always think about edge cases and error conditions.

**Common Edge Cases**:
```
- Empty inputs (null, undefined, "", [], {})
- Boundary values (0, -1, MAX_INT)
- Invalid inputs (wrong type, format)
- Concurrent operations
- Network failures
- Timeouts
- Permission errors
- Large data volumes
- Unicode/special characters
- Timezone differences
```

### Rule C-043: Think About Security 🔴 CRITICAL

**Description**: Every change should be evaluated for security implications.

**Security Checklist**:
```
□ Input validation
□ Output encoding
□ Authentication requirements
□ Authorization checks
□ Sensitive data handling
□ SQL/command injection prevention
□ XSS prevention
□ CSRF protection
□ Rate limiting needs
□ Logging of security events
```

### Rule C-044: Consider Performance 🟠 REQUIRED

**Description**: Think about performance implications of changes.

**Performance Considerations**:
```
- Time complexity of algorithms
- Space complexity
- Database query efficiency
- Network request optimization
- Caching opportunities
- Memory leaks
- Bundle size impact
```

---

## Task Breakdown System

### Rule C-050: Break Down Complex Tasks 🔴 CRITICAL

**Description**: Every complex task MUST be broken down into smaller, manageable subtasks.

**Task Breakdown Format**:
```markdown
# Task: [Task Title]

## Overview
[Brief description of the main task]

## Subtasks
- [ ] 1. [Subtask 1]
  - Description: [What needs to be done]
  - Estimated effort: [Low/Medium/High]
  - Dependencies: [List any dependencies]

- [ ] 2. [Subtask 2]
  ...

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Notes
[Any additional notes or considerations]
```

### Rule C-051: Create TODO Lists 🔴 CRITICAL

**Description**: For every task, create a structured TODO list before coding.

**TODO List Template**:
```markdown
# TODO: [Feature/Fix Name]

Created: [Date]
Status: In Progress | Completed | Blocked

## Tasks
- [ ] Research existing implementation
- [ ] Design solution approach
- [ ] Implement core functionality
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update documentation
- [ ] Code review
- [ ] Merge and deploy

## Blockers
- [Any blocking issues]

## Decisions Made
- [Decision 1]: [Rationale]

## Resources
- [Link to relevant docs/code]
```

### Rule C-052: Estimate and Prioritize 🟠 REQUIRED

**Description**: Estimate effort and prioritize subtasks.

**Estimation Scale**:
| Effort | Description | Time Estimate |
|--------|-------------|---------------|
| XS | Trivial change | < 30 min |
| S | Small, straightforward | 30 min - 2 hrs |
| M | Medium complexity | 2-4 hrs |
| L | Large, multi-component | 4-8 hrs |
| XL | Complex, research needed | > 1 day |

### Rule C-053: Identify Dependencies 🟠 REQUIRED

**Description**: Map out dependencies between subtasks before starting.

**Dependency Types**:
```
→ Blocking: Task B cannot start until Task A completes
⟷ Related: Tasks share resources/context
◇ Optional: Nice to have but not blocking
```

---

## Task Logging Requirements

### Rule C-060: Log All Tasks to File 🔴 CRITICAL

**Description**: All task breakdowns and TODO lists MUST be saved to a file.

**File Location**: `tasks/` directory in project root

**File Naming Convention**:
```
tasks/
├── YYYY-MM-DD-task-title.md      # Individual task files
├── backlog.md                     # Pending tasks
├── completed.md                   # Completed tasks archive
└── index.md                       # Task index/overview
```

### Rule C-061: Update Tasks in Real-Time 🔴 CRITICAL

**Description**: Update task files as work progresses.

**Update Requirements**:
```markdown
# In task file:

## Progress Log
| Time | Status | Action |
|------|--------|--------|
| 10:00 | Started | Beginning task analysis |
| 10:30 | In Progress | Completed subtask 1 |
| 11:00 | Blocked | Waiting for API documentation |
| 14:00 | Completed | All subtasks done |
```

### Rule C-062: Document Solutions 🔴 CRITICAL

**Description**: Document the solution approach and key decisions in the task file.

**Solution Documentation Format**:
```markdown
## Solution

### Approach
[Description of the approach taken]

### Implementation Details
[Key implementation decisions]

### Code References
- File: `src/module/file.ts`
- Lines: 50-100
- Function: `handleUserRequest`

### Testing
- [x] Unit tests added: `tests/unit/file.test.ts`
- [x] Integration tests: `tests/integration/feature.test.ts`
- [ ] E2E tests: N/A

### Performance Notes
[Any performance considerations or measurements]
```

### Rule C-063: Link Related Tokens/Concepts 🟠 REQUIRED

**Description**: Document related concepts, tokens, and references.

**Token Documentation**:
```markdown
## Related Tokens/Concepts

| Token | Description | Link |
|-------|-------------|------|
| UserService | Core user management | `src/services/user.ts` |
| AuthMiddleware | Authentication handling | `src/middleware/auth.ts` |
| JWT_SECRET | Environment variable | `.env.example` |
| User Schema | Database model | `src/models/user.ts` |
```

### Rule C-064: Save Completed Tasks to Repository 🔴 CRITICAL

**Description**: Upon task completion, save the task file to the configured repository.

**Workflow**:
```markdown
1. Complete all subtasks
2. Document final solution
3. Update task status to "Completed"
4. Commit task file to local tasks/ directory
5. Push to configured TASK_LOG_REPOSITORY
6. Update index.md with completion status
```

**Commit Message Format**:
```
docs(tasks): complete [task-name]

- Summary of what was accomplished
- Key decisions made
- Links to related code changes
```

---

## Problem Solving Framework

### Rule C-070: Use Tools Before Scripting 🔴 CRITICAL

**Description**: Always use available tools to gather information before writing code or scripts.

**Tool Usage Order**:
1. **Search tools**: Find existing code/docs
2. **Read tools**: Understand context
3. **Analyze tools**: Understand patterns
4. **Test tools**: Validate assumptions
5. **THEN**: Write code if necessary

### Rule C-071: Gather Information First 🔴 CRITICAL

**Description**: Collect all relevant information before implementing.

**Information Gathering Checklist**:
```
□ Read relevant documentation
□ Search codebase for similar patterns
□ Check existing utilities/helpers
□ Review test files for usage examples
□ Check configuration files
□ Review git history for context
□ Search issues/PRs for related discussions
```

### Rule C-072: Validate Before Implementing 🟠 REQUIRED

**Description**: Validate assumptions and approach before writing significant code.

**Validation Steps**:
```
1. Verify understanding of requirements
2. Check proposed approach with user if significant
3. Create minimal proof-of-concept if complex
4. Validate edge cases are considered
5. Confirm testing approach
```

### Rule C-073: Iterate and Verify 🟠 REQUIRED

**Description**: Make small changes and verify at each step.

**Iteration Pattern**:
```
1. Make small change
2. Run tests/verification
3. Commit if passing
4. Repeat until complete
```

---

## Context Window Management

### Rule C-080: Prioritize Context Loading 🔴 CRITICAL

**Description**: Load the most important context first to ensure it's available.

**Priority Order**:
1. Project configuration (package.json, tsconfig.json)
2. README and CONTRIBUTING guides
3. Relevant source files for the task
4. Test files for affected code
5. Related documentation

### Rule C-081: Summarize Long Files 🟠 REQUIRED

**Description**: When loading large files, extract and summarize key sections.

**Summarization Strategy**:
```
- Extract function signatures and docstrings
- Note key exports
- Identify dependencies/imports
- Capture TODOs and FIXMEs
- Note critical logic flows
```

### Rule C-082: Reference, Don't Duplicate 🟡 RECOMMENDED

**Description**: Reference file paths and line numbers rather than duplicating large code blocks.

**Example**:
```markdown
The user validation logic is in `src/utils/validation.ts` (lines 50-75).
Key functions:
- validateEmail(email: string): boolean
- validatePassword(pwd: string): ValidationResult
```

---

## Compliance Summary

### Before Starting Any Task:
1. [ ] Read project documentation
2. [ ] Search for existing implementations
3. [ ] Create task breakdown
4. [ ] Log task to tasks/ directory

### During Implementation:
1. [ ] Use existing tools and utilities
2. [ ] Ask questions when unsure
3. [ ] Apply critical reasoning
4. [ ] Update task log with progress

### Before Completing:
1. [ ] Verify all subtasks complete
2. [ ] Document solution in task file
3. [ ] Link related tokens/concepts
4. [ ] Save completed task to repository

---

**Version**: 1.0.0
**Last Updated**: 2024-12-03
**Maintained By**: Project Team
