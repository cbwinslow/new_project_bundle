# Error Handling Rules

**Category:** Code Quality  
**Tags:** #error-handling #robustness #reliability

## Description

Best practices for handling errors gracefully and providing useful feedback.

## Rules

### Never Silently Swallow Errors
- Always log or handle errors
- Use appropriate error types/classes
- Include context in error messages
- Re-throw if you can't handle

### Error Messages
- Provide user-friendly messages
- Include actionable information
- Don't expose sensitive data
- Use proper error codes

### Try-Catch Usage
- Catch specific exceptions when possible
- Clean up resources in finally blocks
- Don't use exceptions for control flow
- Document what exceptions functions throw

### Logging
- Log errors with full context
- Include timestamps and request IDs
- Use appropriate log levels
- Don't log sensitive information

## Examples

### Good Example
```python
def load_user_data(user_id):
    try:
        # Use parameterized query to prevent SQL injection
        data = database.execute(
            "SELECT * FROM users WHERE id = ?",
            (user_id,)
        ).fetchone()
        return parse_user(data)
    except DatabaseError as e:
        logger.error(f"Failed to load user {user_id}: {e}")
        raise UserLoadError(f"Unable to load user data") from e
    except ParseError as e:
        logger.error(f"Failed to parse user {user_id}: {e}")
        raise DataCorruptionError(f"User data is corrupted") from e
```

### Bad Example
```python
def load_user_data(user_id):
    try:
        # UNSAFE: SQL injection vulnerability!
        data = database.query(f"SELECT * FROM users WHERE id = {user_id}")
        return parse_user(data)
    except:
        pass  # Silent failure!
```

## Benefits
- Better debugging experience
- Easier to track down issues
- Users get helpful feedback
- More robust applications
