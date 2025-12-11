# Test Coverage Rules

**Category:** Testing  
**Tags:** #testing #coverage #quality-assurance

## Description

Guidelines for maintaining adequate test coverage and writing effective tests.

## Rules

### Coverage Requirements
- Minimum 80% code coverage for critical paths
- 100% coverage for security-related code
- 100% coverage for data validation logic
- Track coverage trends over time

### What to Test
- All public APIs
- Edge cases and boundary conditions
- Error handling paths
- Integration points
- Critical business logic

### What Not to Over-Test
- Simple getters/setters
- Third-party library internals
- Generated code
- Configuration files

### Test Organization
- Mirror production code structure
- Group related tests
- Use descriptive test names
- One assertion per test (when possible)

## Examples

### Good Test Example
```python
def test_user_registration_with_valid_email():
    """Test that user can register with valid email"""
    user = register_user("test@example.com", "ValidPass123!")
    assert user.email == "test@example.com"
    assert user.is_verified == False
    assert user.created_at is not None

def test_user_registration_with_invalid_email():
    """Test that registration fails with invalid email"""
    with pytest.raises(ValidationError):
        register_user("invalid-email", "ValidPass123!")

def test_user_registration_with_weak_password():
    """Test that registration fails with weak password"""
    with pytest.raises(WeakPasswordError):
        register_user("test@example.com", "weak")
```

### Bad Test Example
```python
def test_user():
    # Too broad, tests everything at once
    user = register_user("test@example.com", "pass")
    assert user
    assert login(user.email, "pass")
    assert update_profile(user, "New Name")
    # Hard to identify what failed if assertion fails
```

## Coverage Tools
- Python: `pytest-cov`, `coverage.py`
- JavaScript: `jest`, `nyc`, `istanbul`
- Go: built-in `go test -cover`
- Java: `JaCoCo`, `Cobertura`

## Reporting
- Generate HTML coverage reports
- Track coverage in CI/CD
- Fail builds if coverage drops
- Review uncovered lines in PRs

## Benefits
- Catch bugs early
- Safe refactoring
- Living documentation
- Confidence in deployments
