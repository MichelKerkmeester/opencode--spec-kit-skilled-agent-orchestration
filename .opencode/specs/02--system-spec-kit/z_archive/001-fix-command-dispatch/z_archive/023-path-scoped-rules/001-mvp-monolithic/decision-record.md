---
title: "Decision Record: Path-Scoped Validation Rules [001-mvp-monolithic/decision-record]"
description: "We need to implement a validation script for spec folders. The validation logic needs to"
trigger_phrases:
  - "decision"
  - "record"
  - "path"
  - "scoped"
  - "validation"
  - "decision record"
  - "001"
  - "mvp"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Path-Scoped Validation Rules
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record.md | v1.0 -->

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-path-scoped-rules |
| **Status** | Proposed |
| **Created** | 2024-12-24 |
| **Deciders** | Developer, AI Assistant |

---

## ADR-001: Validation Implementation Language

### Context

We need to implement a validation script for spec folders. The validation logic needs to:
- Parse markdown files
- Match glob patterns
- Parse YAML configuration
- Generate text and JSON output

### Options Considered

| Criteria | Bash | Node.js | Python |
|----------|------|---------|--------|
| Consistency with existing scripts | 10/10 | 5/10 | 3/10 |
| No additional dependencies | 10/10 | 7/10 | 5/10 |
| String/regex handling | 6/10 | 9/10 | 9/10 |
| JSON generation | 5/10 | 10/10 | 9/10 |
| Maintainability | 5/10 | 8/10 | 8/10 |
| **Total** | **36/50** | **39/50** | **34/50** |

### Decision

**Bash for MVP, with migration path to Node.js if complexity grows.**

### Rationale

1. **Consistency**: All existing spec-kit scripts are Bash (create-spec-folder.sh, check-prerequisites.sh, etc.)
2. **Zero dependencies**: Works out of the box on macOS/Linux
3. **Sufficient for MVP**: Core checks are simple string/regex operations
4. **Migration path**: If complexity grows, Node.js is already used in the project (generate-context.js)

### Consequences

#### Positive
- Immediate compatibility with existing scripts
- No new toolchain to learn/maintain
- Fast startup time

#### Negative
- Complex logic harder to implement in Bash
- Limited testing frameworks
- JSON generation requires careful escaping

#### Technical Debt
- May need to migrate to Node.js if rules become complex
- Consider extracting common validation logic to shared library

---

## ADR-002: Level Detection Method

### Context

We need to determine the documentation level (1/2/3) of a spec folder to apply appropriate validation rules. This determines which files are required and how strict validation should be.

### Options Considered

| Criteria | Explicit Metadata | File Inference | Config File |
|----------|-------------------|----------------|-------------|
| Clarity | 10/10 | 6/10 | 8/10 |
| Backward compatibility | 7/10 | 10/10 | 5/10 |
| Maintenance | 9/10 | 8/10 | 6/10 |
| Error-prone | 8/10 | 6/10 | 7/10 |
| **Total** | **34/40** | **30/40** | **26/40** |

### Decision

**Explicit metadata (primary) with file inference (fallback).**

### Rationale

1. **Explicit is clearer**: `Level: 2` in spec.md leaves no ambiguity
2. **Inference for compatibility**: Existing spec folders without Level field still work
3. **Low overhead**: One line in metadata section

### Implementation

```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
```

Fallback inference:
- Has decision-record.md → Level 3
- Has checklist.md (no decision-record) → Level 2
- Otherwise → Level 1

### Consequences

#### Positive
- Clear, intentional level declaration
- Backward compatible with existing specs
- Simple to implement

#### Negative
- Requires updating spec.md template
- Inference might mismatch author intent

---

## ADR-003: Configuration Approach

### Context

Validation behavior needs to be configurable for different projects, CI environments, and developer preferences.

### Options Considered

| Criteria | Hardcoded | Global Config | Per-Folder | Env Vars Only |
|----------|-----------|---------------|------------|---------------|
| Flexibility | 2/10 | 8/10 | 10/10 | 6/10 |
| Simplicity | 10/10 | 7/10 | 4/10 | 8/10 |
| CI/CD friendly | 3/10 | 7/10 | 5/10 | 10/10 |
| Maintenance | 8/10 | 6/10 | 4/10 | 7/10 |
| **Total** | **23/40** | **28/40** | **23/40** | **31/40** |

### Decision

**Global `.speckit.yaml` config with environment variable overrides.**

### Rationale

1. **Global covers most cases**: One config for entire project
2. **Env vars for CI**: Easy to override in pipelines
3. **Per-folder deferred**: Adds complexity, defer until needed
4. **File + env**: Best of both worlds

### Implementation

```yaml
# .speckit.yaml
validation:
  enabled: true
  default_ruleset: STANDARD
```

```bash
# Environment overrides
SPECKIT_VALIDATION=false  # Disable
SPECKIT_STRICT=true       # Warnings → errors
```

### Consequences

#### Positive
- Simple configuration model
- CI/CD friendly
- Easy to disable for specific runs

#### Negative
- No per-folder overrides initially
- Config file adds one more file to project root

---

## ADR-004: Validation Strictness Default

### Context

Should validation be strict (block on errors) or lenient (warnings only) by default? This affects developer experience and adoption.

### Options Considered

| Criteria | Strict | Lenient | Progressive |
|----------|--------|---------|-------------|
| Catches issues | 10/10 | 3/10 | 8/10 |
| Developer experience | 4/10 | 9/10 | 8/10 |
| Adoption friction | 3/10 | 9/10 | 7/10 |
| CI enforcement | 10/10 | 3/10 | 9/10 |
| **Total** | **27/40** | **24/40** | **32/40** |

### Decision

**Progressive: Warnings locally, errors in CI.**

### Rationale

1. **Don't frustrate developers**: False positives are adoption killers
2. **CI can be strict**: Environment variable enables enforcement
3. **Gradual adoption**: Start lenient, tighten over time
4. **Clear path to strictness**: `SPECKIT_STRICT=true` when ready

### Implementation

```
Default: SPECKIT_STRICT=false (warnings don't block)
CI/CD:   SPECKIT_STRICT=true (warnings become errors)
```

### Consequences

#### Positive
- Low adoption friction
- Developers see issues without being blocked
- CI can enforce when ready

#### Negative
- Developers might ignore warnings
- Need discipline to address warnings before CI

---

## ADR-005: Path Pattern Syntax

### Context

Need a pattern syntax for matching file paths to rule sets. Should be familiar to developers and sufficient for use cases.

### Options Considered

| Criteria | Glob | Regex | Simple Prefix |
|----------|------|-------|---------------|
| Familiarity | 9/10 | 7/10 | 10/10 |
| Expressiveness | 8/10 | 10/10 | 4/10 |
| Implementation ease | 7/10 | 5/10 | 10/10 |
| Error-prone | 7/10 | 5/10 | 9/10 |
| **Total** | **31/40** | **27/40** | **33/40** |

### Decision

**Glob patterns (`*`, `**`, `?`).**

### Rationale

1. **Familiar**: Same as .gitignore, shell expansion
2. **Sufficient**: `**/scratch/**` covers all use cases
3. **Bash support**: Native extglob support
4. **Balance**: More expressive than prefix, simpler than regex

### Implementation

```yaml
patterns:
  - path: "**/scratch/**"    # Any scratch folder
    ruleset: NONE
  - path: "specs/*/spec.md"  # Only spec.md in specs
    ruleset: STANDARD
```

### Consequences

#### Positive
- Developers already know glob syntax
- Covers all identified use cases
- Easy to document

#### Negative
- Some edge cases need multiple patterns
- Performance overhead vs simple prefix

---

## 6. Implementation Notes

### Parallel Work

> **Parallel Work:** Use `[P]` prefix for tasks that can be done in parallel:
> - [P] Implement FILE_EXISTS check
> - [P] Implement PLACEHOLDER_FILLED check
> - [P] Implement SECTIONS_PRESENT check
> - Test fixtures creation (depends on checks)

---

## 7. Amendment History

| Date | Amendment | Approved By |
|------|-----------|-------------|
| 2024-12-24 | Initial draft | - |
| 2024-12-24 | Fixed unfilled placeholders in ADR option tables | AI Assistant |

---

## 8. Related Documents

- [spec.md](./spec.md) - Requirements
- [plan.md](./plan.md) - Technical plan
- [tasks.md](./tasks.md) - Task breakdown
- [checklist.md](./checklist.md) - Verification checklist
