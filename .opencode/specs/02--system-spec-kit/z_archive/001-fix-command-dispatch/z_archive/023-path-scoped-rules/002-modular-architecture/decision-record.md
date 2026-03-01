---
title: "Decision Record: Modular Validation Architecture [002-modular-architecture/decision-record]"
description: "The MVP validation script (validate-spec.sh) is ~600 lines. Adding all planned features would grow it to ~1400 lines, making maintenance difficult."
trigger_phrases:
  - "decision"
  - "record"
  - "modular"
  - "validation"
  - "architecture"
  - "decision record"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Modular Validation Architecture

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-path-scoped-rules/002-modular-architecture |
| **Created** | 2024-12-24 |
| **Status** | Active |

---

## ADR-001: Modular vs Monolithic Architecture

### Context

The MVP validation script (`validate-spec.sh`) is ~600 lines. Adding all planned features would grow it to ~1400 lines, making maintenance difficult.

### Decision

**Split into modular architecture:**
- Orchestrator (`validate-spec.sh`) - ≤200 lines
- Libraries (`lib/*.sh`) - Shared utilities
- Rules (`rules/check-*.sh`) - Individual validation checks

### Consequences

| Positive | Negative |
|----------|----------|
| Smaller, focused files | More files to manage |
| Easier testing | Potential source path issues |
| Plugin-like extensibility | Slightly more complex debugging |
| Better separation of concerns | Need to maintain interfaces |

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Single large file | Hard to maintain at 1400+ lines |
| Multiple standalone scripts | Duplicated code, no shared utilities |
| External language (Python) | Adds dependency, breaks consistency |

---

## ADR-002: Rule Interface Design

### Context

Each rule needs a consistent interface for the orchestrator to call.

### Decision

**Each rule implements `run_check()` function:**

```bash
run_check() {
    local folder="$1"
    local level="$2"
    
    # Sets these globals:
    RULE_STATUS="pass|warn|fail"
    RULE_MESSAGE="Human-readable message"
    RULE_DETAILS=("detail1" "detail2")
    RULE_REMEDIATION="How to fix"
}
```

### Consequences

| Positive | Negative |
|----------|----------|
| Consistent interface | Must follow convention |
| Easy to add new rules | Global variables for results |
| Simple for bash | No return values |

---

## ADR-003: Configuration Loading Priority

### Context

Multiple sources can configure validation behavior: defaults, .speckit.yaml, environment variables, CLI flags.

### Decision

**Priority (highest to lowest):**
1. CLI flags (`--strict`, `--quiet`)
2. Environment variables (`SPECKIT_STRICT`)
3. Config file (`.speckit.yaml`)
4. Hardcoded defaults

### Consequences

| Positive | Negative |
|----------|----------|
| Predictable override behavior | Complex config resolution |
| Flexible for different contexts | Need to document priority |
| CI-friendly (env vars) | Testing all combinations |

---

## ADR-004: YAML Parser Fallback

### Context

`.speckit.yaml` parsing requires a YAML parser. `yq` is ideal but may not be installed.

### Decision

**Dual parser approach:**
1. Use `yq` if available (full YAML support)
2. Fall back to `grep/awk` for basic parsing (limited features)

### Consequences

| Positive | Negative |
|----------|----------|
| Works without yq installed | Fallback has limited features |
| Full features with yq | Two code paths to maintain |
| Graceful degradation | Potential inconsistencies |

### Fallback Limitations

| Feature | yq | Fallback |
|---------|-----|----------|
| Boolean values | Yes | Yes |
| Simple strings | Yes | Yes |
| Arrays | Yes | Basic |
| Nested objects | Yes | No |
| Comments | Yes | Yes |

---

## ADR-005: Rule Severity Levels

### Context

Different rules have different importance. Need to distinguish errors vs warnings.

### Decision

**Three severity levels:**
- `error` - Fails validation (exit 2)
- `warn` - Passes with warnings (exit 1)
- `info` - Informational only (exit 0)

**Default severities:**
| Rule | Default Severity |
|------|------------------|
| FILE_EXISTS | error |
| PLACEHOLDER_FILLED | error |
| SECTIONS_PRESENT | warn |
| PRIORITY_TAGS | warn |
| EVIDENCE_CITED | warn |
| ANCHORS_VALID | error |
| LEVEL_DECLARED | info |

### Consequences

| Positive | Negative |
|----------|----------|
| Clear failure semantics | Need to configure per-rule |
| Configurable via .speckit.yaml | More complex result aggregation |
| Matches CI expectations | Exit code mapping logic |

---

## ADR-006: Glob Pattern Implementation

### Context

Need pattern matching for path skipping (e.g., `**/scratch/**`).

### Decision

**Pure bash implementation:**
- Convert glob to regex using `glob_to_regex()`
- Use bash `=~` operator for matching
- No external dependencies

### Consequences

| Positive | Negative |
|----------|----------|
| No dependencies | Limited to basic patterns |
| Fast execution | Regex edge cases |
| Portable | Complex escaping |

### Supported Patterns

| Pattern | Meaning |
|---------|---------|
| `**` | Match any path segments |
| `*` | Match single segment |
| `?` | Match single character |

---

## ADR-007: Test Fixture Organization

### Context

Need test fixtures for all validation rules.

### Decision

**Two fixtures per rule:**
- `valid-{rule}/` - Should pass
- `invalid-{rule}/` - Should warn or error

**Naming convention:**
- `valid-*` expects exit 0
- `invalid-*` or `missing-*` expects exit 1 or 2

### Consequences

| Positive | Negative |
|----------|----------|
| Clear expectations | Many directories |
| Easy to add new tests | Maintenance burden |
| Isolated test cases | Disk space |

---

## ADR-008: Backward Compatibility Strategy

### Context

Existing scripts and CI may depend on current validate-spec.sh behavior.

### Decision

**Full backward compatibility:**
- Same command-line interface
- Same exit codes
- Same output format (unless --json)
- New features are opt-in

### Consequences

| Positive | Negative |
|----------|----------|
| No breaking changes | Can't improve defaults |
| Safe upgrade path | Legacy constraints |
| Trust in stability | Technical debt |

---

## Decision Log

| ID | Date | Decision | Status |
|----|------|----------|--------|
| ADR-001 | 2024-12-24 | Modular architecture | Active |
| ADR-002 | 2024-12-24 | run_check() interface | Active |
| ADR-003 | 2024-12-24 | Config priority order | Active |
| ADR-004 | 2024-12-24 | YAML parser fallback | Active |
| ADR-005 | 2024-12-24 | Three severity levels | Active |
| ADR-006 | 2024-12-24 | Pure bash glob matching | Active |
| ADR-007 | 2024-12-24 | Two fixtures per rule | Active |
| ADR-008 | 2024-12-24 | Full backward compat | Active |
