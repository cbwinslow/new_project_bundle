# Architecture Decision Records (ADR) Template 📐

> Template for documenting significant architectural decisions

## Document Information

| Field | Value |
|-------|-------|
| **ADR Number** | ADR-XXX |
| **Title** | [Short descriptive title] |
| **Status** | Proposed | Accepted | Deprecated | Superseded |
| **Date** | YYYY-MM-DD |
| **Authors** | [Name(s)] |
| **Supersedes** | [ADR-XXX (if applicable)] |
| **Superseded by** | [ADR-XXX (if applicable)] |

---

## Context

<!--
Describe the context and background for this decision.
What is the issue that we're seeing that is motivating this decision?
What are the forces at play (technological, business, team, etc.)?
-->

> [Describe the situation that requires a decision]

### Current State

- [Describe current architecture/approach]
- [Pain points or limitations]
- [Business drivers]

### Forces

- [ ] [Force 1: e.g., Need to scale to 10x current load]
- [ ] [Force 2: e.g., Team expertise in technology X]
- [ ] [Force 3: e.g., Budget constraints]
- [ ] [Force 4: e.g., Timeline requirements]

---

## Decision

<!--
Clearly state the architectural decision that was made.
Be specific and unambiguous.
-->

> **We will [decision statement]**

### Details

[Provide more details about the decision, including specific technologies, patterns, or approaches chosen]

---

## Options Considered

### Option 1: [Name]

**Description:** [Brief description]

**Pros:**

- [Pro 1]
- [Pro 2]

**Cons:**

- [Con 1]
- [Con 2]

**Effort:** Low | Medium | High

**Risk:** Low | Medium | High

### Option 2: [Name]

**Description:** [Brief description]

**Pros:**

- [Pro 1]
- [Pro 2]

**Cons:**

- [Con 1]
- [Con 2]

**Effort:** Low | Medium | High

**Risk:** Low | Medium | High

### Option 3: [Name] (Chosen)

**Description:** [Brief description]

**Pros:**

- [Pro 1]
- [Pro 2]

**Cons:**

- [Con 1]
- [Con 2]

**Effort:** Low | Medium | High

**Risk:** Low | Medium | High

---

## Comparison Matrix

| Criterion | Weight | Option 1 | Option 2 | Option 3 |
|-----------|--------|----------|----------|----------|
| Performance | 20% | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Scalability | 20% | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Maintainability | 15% | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Team Expertise | 15% | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| Cost | 15% | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Time to Implement | 15% | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Total Score** | 100% | **X.X** | **X.X** | **X.X** |

---

## Consequences

### Positive

- [ ] [Positive consequence 1]
- [ ] [Positive consequence 2]
- [ ] [Positive consequence 3]

### Negative

- [ ] [Negative consequence 1]
- [ ] [Negative consequence 2]

### Neutral

- [Neutral consequence or tradeoff]

---

## Implementation

### Migration Path

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Timeline

| Phase | Description | Duration | Start | End |
|-------|-------------|----------|-------|-----|
| Phase 1 | [Description] | X weeks | YYYY-MM-DD | YYYY-MM-DD |
| Phase 2 | [Description] | X weeks | YYYY-MM-DD | YYYY-MM-DD |

### Dependencies

- [Dependency 1]
- [Dependency 2]

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | Low/Med/High | Low/Med/High | [Mitigation strategy] |
| [Risk 2] | Low/Med/High | Low/Med/High | [Mitigation strategy] |

---

## Related

### Related ADRs

- ADR-XXX: [Title] - [Relationship]

### Related Documents

- [Document name/link]

### References

- [External reference/link]

---

## Status History

| Date | Status | Notes |
|------|--------|-------|
| YYYY-MM-DD | Proposed | Initial proposal |
| YYYY-MM-DD | Accepted | Approved by [person/team] |

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Technical Lead | | |
| Architect | | |
| Product Owner | | |

---

<!--
TEMPLATE USAGE NOTES:

1. Create a new ADR file: `docs/adr/ADR-XXX-title.md`
2. Fill in all sections relevant to your decision
3. Have team review and discuss
4. Update status as decision progresses
5. Keep ADRs immutable after acceptance (create new ADR to change)

Naming Convention: ADR-XXX-short-title.md
Examples:
- ADR-001-use-postgresql-for-main-database.md
- ADR-002-adopt-microservices-architecture.md
- ADR-003-implement-event-sourcing.md
-->
