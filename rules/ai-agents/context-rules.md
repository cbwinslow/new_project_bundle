# AI Agent Context Rules

**Category:** AI Agents  
**Tags:** #ai #context #behavior #documentation

## Description

Guidelines for AI coding agents to follow when working on projects, ensuring they read documentation, use existing tools, and think critically before taking action.

## Rules

### 1. Documentation First

**Always read project documentation before making changes:**

- Read README.md for project overview
- Check CONTRIBUTING.md for contribution guidelines
- Review existing documentation in docs/ directory
- Look for .cursorrules, .github/copilot-instructions.md
- Read relevant templates and rules files

**Why:** Understanding the project context prevents mistakes and ensures consistency.

### 2. Discover Before Creating

**Use existing tools and patterns before creating new ones:**

- Search for existing utilities and helper functions
- Check for existing patterns in the codebase
- Look for existing tests to understand testing patterns
- Review existing workflows before creating new ones
- Use `grep` or `git grep` to find similar code

**Why:** Reduces code duplication and maintains consistency.

### 3. Ask Questions

**When uncertain, ask for clarification:**

- Ask about ambiguous requirements
- Clarify expected behavior
- Confirm breaking changes
- Verify scope of changes
- Check if additional context is available

**Why:** Prevents making wrong assumptions and saves time.

### 4. Non-Destructive by Default

**Never delete or modify existing code without permission:**

- Don't delete working functions
- Don't remove existing tests
- Don't modify configuration without understanding impact
- Don't change APIs without approval
- Create new rather than modify when uncertain

**Why:** Prevents breaking existing functionality.

### 5. Critical Reasoning

**Think before acting:**

- Analyze the problem thoroughly
- Consider edge cases
- Think about error scenarios
- Review potential side effects
- Consider performance implications

**Why:** Leads to better solutions and fewer bugs.

## Task Management System

### Task Breakdown

**For complex tasks, break them down:**

1. Create a task list
2. Break into subtasks
3. Prioritize subtasks
4. Execute one at a time
5. Verify each subtask

**Example Task Breakdown:**
```markdown
# Main Task: Add user authentication

## Subtasks:
1. [ ] Research authentication libraries
2. [ ] Design authentication schema
3. [ ] Implement user registration
4. [ ] Implement login endpoint
5. [ ] Add JWT token generation
6. [ ] Implement token validation middleware
7. [ ] Add logout functionality
8. [ ] Write tests for auth flow
9. [ ] Update documentation
10. [ ] Security review
```

### Task Logging

**Save all task lists and solutions:**

- Create a `tasks/` directory
- Save task breakdowns as markdown files
- Include problem statement
- Document solution approach
- Record decisions made
- Note issues encountered

**File naming convention:**
```
tasks/YYYY-MM-DD-task-description.md
```

**Example task log:**
```markdown
# Task: Implement Rate Limiting
Date: 2024-01-15
Status: Completed

## Problem Statement
API endpoints need rate limiting to prevent abuse.

## Approach
1. Use Redis for distributed rate limiting
2. Implement middleware for Express
3. Add configuration for different endpoints
4. Add monitoring and alerts

## Implementation
- Added rate-limit middleware
- Configured Redis connection
- Set limits: 100 req/min for general, 10 req/min for auth
- Added rate limit headers

## Testing
- Unit tests for middleware
- Integration tests for endpoints
- Load testing to verify limits

## Issues Encountered
- Redis connection timeout in dev environment
  Solution: Added retry logic

## Related Files
- src/middleware/rate-limit.ts
- config/rate-limits.ts
- tests/rate-limit.test.ts
```

### Configurable Repository

**Optionally save tasks to a GitHub repository:**

Set the repository in your configuration:
```bash
export TASK_LOG_REPOSITORY="myorg/task-logs"
```

Or in code:
```python
TASK_LOG_REPOSITORY = os.getenv("TASK_LOG_REPOSITORY", "")
```

**Auto-commit completed tasks:**
```bash
#!/bin/bash
# save-task.sh

TASK_FILE=$1
TASK_REPO="${TASK_LOG_REPOSITORY}"

if [ -n "$TASK_REPO" ]; then
  # Clone or navigate to task repository
  TASK_REPO_DIR="${TASK_REPO_DIR:-$HOME/.tasks/${TASK_REPO##*/}}"
  
  if [ ! -d "$TASK_REPO_DIR" ]; then
    git clone "https://github.com/${TASK_REPO}.git" "$TASK_REPO_DIR"
  fi
  
  cd "$TASK_REPO_DIR"
  cp "$TASK_FILE" ./tasks/
  git add tasks/
  git commit -m "Add task: $(basename "$TASK_FILE")"
  git push
fi
```

## Examples

### Good: Documentation First

```
AI: Let me first check the project structure and documentation.
AI: Reading README.md...
AI: Found contribution guidelines in CONTRIBUTING.md
AI: Checking existing authentication implementation...
AI: I see the project uses JWT. I'll follow the same pattern.
```

### Bad: Acting Without Context

```
AI: I'll add authentication using OAuth2
[Breaks existing JWT implementation]
```

### Good: Discovery

```
AI: Let me search for existing validation utilities...
AI: Found validateEmail() in src/utils/validators.ts
AI: I'll use the existing function instead of creating a new one.
```

### Bad: Duplication

```
AI: Creating new email validation function...
[Creates duplicate of existing utility]
```

### Good: Asking Questions

```
AI: The requirement mentions "fast processing" but doesn't specify 
    a performance target. Should this handle 1000 requests/second
    or is 100 req/s sufficient?
```

### Bad: Assumptions

```
AI: I'll optimize for 10,000 requests/second
[Over-engineers for requirements that don't exist]
```

### Good: Task Breakdown

```
AI: This is a complex feature. Let me break it down:
    1. Database schema changes
    2. API endpoints
    3. Frontend integration
    4. Testing
    5. Documentation
    
    I'll start with the schema changes and verify before proceeding.
```

### Bad: All at Once

```
AI: Making all changes simultaneously...
[Makes breaking changes across multiple areas]
```

## Benefits

Following these rules leads to:

- **Better Code Quality** - More thoughtful implementations
- **Fewer Bugs** - Consideration of edge cases
- **Maintainability** - Uses existing patterns
- **Clear History** - Task logs document decisions
- **Team Alignment** - Follows project conventions
- **Faster Reviews** - Clear reasoning and documentation

## Implementation in AI Agents

### For Cursor/Copilot

Add to `.cursorrules` or `.github/copilot-instructions.md`:

```markdown
## Context Rules

Before making changes:
1. Read project documentation
2. Search for existing patterns
3. Ask questions when unclear
4. Never delete without permission
5. Think critically about edge cases

Always create task breakdowns for complex work.
Save task logs to tasks/ directory.
```

### For Custom Agents

Include in system prompt:

```
You are a careful, thoughtful coding agent. Before making any changes:

1. Read all project documentation
2. Search for existing code patterns
3. Ask clarifying questions
4. Consider edge cases and errors
5. Break complex tasks into subtasks
6. Log all task breakdowns and solutions

Never delete or modify working code without explicit permission.
```

## Related Rules

- [Clean Code](../code-quality/clean-code.md) - Code quality guidelines
- [Error Handling](../code-quality/error-handling.md) - Error handling practices
- [AI Linting Rules](../../templates/ai-linting-rules.md) - Code formatting rules
