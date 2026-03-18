---
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
title: "Decision Record: sk-code--opencode Alignment Hardening [040-sk-code-opencode-alignment-hardening/decision-record]"
description: "This document preserves the existing technical decisions and adds validator-required readme structure."
trigger_phrases:
  - "decision"
  - "record"
  - "code"
  - "opencode"
  - "alignment"
  - "decision record"
  - "040"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: sk-code--opencode Alignment Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---
## 0. OVERVIEW
This document preserves the existing technical decisions and adds validator-required readme structure.

## DOCUMENT SECTIONS
Use the anchored sections below for complete details.


<!-- ANCHOR:adr-001 -->
## ADR-001: Introduce Path Policy and Rule Applicability Controls

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec Owner, Verifier Maintainer |

### Context
Baseline data (`853` scanned, `354` violations) shows major noise from non-production trees and rule overreach. `TS-MODULE-HEADER` at `193` findings indicates applicability drift, especially across tests and assets.

### Constraints
- Maintain existing CLI shape and pass/fail semantics.
- Avoid hidden false negatives in production paths.

### Decision
**We chose**: apply explicit path filtering plus rule applicability checks before rule evaluation.

**How it works**: A shared policy layer classifies paths and exposes helper predicates to each rule. TS header checks run only for production module paths, while tests/assets are excluded by policy.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Policy layer (chosen)** | Centralized, testable, deterministic | Requires fixture coverage upkeep | 9/10 |
| Per-rule ad hoc filters | Fast to patch initially | Hard to reason about, drifts quickly | 5/10 |

**Why this one**: It addresses the current noise root cause without fragmenting logic across multiple checks.

### Consequences

**What improves**:
- Lower false-positive rate for known noisy trees.
- Rule behavior becomes explainable and testable.

**What it costs**:
- Added policy maintenance burden. Mitigation: fixture-backed tests and README policy docs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-filtering production code | High | Maintain allowlist tests that assert production modules stay in scope |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Baseline noise and high TS over-trigger require architectural correction |
| 2 | **Beyond Local Maxima?** | PASS | Compared centralized policy vs per-rule patching |
| 3 | **Sufficient?** | PASS | Policy layer directly addresses root causes without major redesign |
| 4 | **Fits Goal?** | PASS | Primary goal is signal hardening |
| 5 | **Open Horizons?** | PASS | Extensible to future rule applicability changes |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Add policy predicates for excluded trees and TS applicability.
- Route TS module-header checks through policy gate.

**How to roll back**: Revert policy integration commit and restore prior direct rule invocation path.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Normalize and Deduplicate Roots and Files

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec Owner, Verifier Maintainer |

### Context
Repeated and overlapping `--root` inputs can scan the same file multiple times. This inflates violation counts and makes trend tracking unreliable.

### Constraints
- Keep `--root` repeatable behavior intact.
- Preserve deterministic scan ordering.

### Decision
**We chose**: normalize root paths and deduplicate discovered files by normalized absolute path.

**How it works**: Roots are canonicalized first. During walk, each candidate file is normalized and emitted only once via a visited-path set.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical root + file dedupe (chosen)** | Deterministic and explicit | Slight memory overhead for visited set | 9/10 |
| Root-only dedupe | Simple | Misses overlap duplicates at file level | 6/10 |

**Why this one**: File-level dedupe is required to fully eliminate overlap effects.

### Consequences

**What improves**:
- Stable scan counts across repeated invocations.
- Comparable baseline metrics over time.

**What it costs**:
- Extra bookkeeping state. Mitigation: maintain O(n) set operations and benchmark runtime.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Platform path normalization quirks | Medium | Add fixtures for relative, repeated, and overlapping roots |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Duplicate-scan defect explicitly identified |
| 2 | **Beyond Local Maxima?** | PASS | Compared root-only vs file-level dedupe |
| 3 | **Sufficient?** | PASS | Canonical set logic addresses duplicates fully |
| 4 | **Fits Goal?** | PASS | Determinism is a stated NFR |
| 5 | **Open Horizons?** | PASS | Compatible with future extensions |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Add root normalization helper.
- Add visited-file set in iterator.

**How to roll back**: Remove normalization and set-based dedupe while retaining tests for future retry.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Extend TypeScript Coverage to `.mts` and Narrow TS Header Scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec Owner, Verifier Maintainer |

### Context
Current extension routing excludes `.mts`, and TS header checks trigger on tests/assets where header policy is not required. Both issues reduce trust in results.

### Constraints
- Keep TS checks active for production modules.
- Avoid introducing broad suppression flags.

### Decision
**We chose**: add `.mts` support and gate `TS-MODULE-HEADER` by explicit production-module path policy.

**How it works**: `.mts` is added to extension mapping and TS router. A path predicate determines whether module-header rule applies.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.mts` + path-gated TS header (chosen)** | Correct coverage + lower noise | Requires policy maintenance | 9/10 |
| Keep existing TS scope and ignore `.mts` | No implementation work | Known blind spot and continued false positives | 3/10 |

**Why this one**: It directly resolves two top-priority defects in one coherent rule-routing change.

### Consequences

**What improves**:
- `.mts` files become visible to drift checks.
- TS header signal becomes relevant to production modules.

**What it costs**:
- Added path-policy coupling. Mitigation: comprehensive TS fixture set.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Misclassification of module paths | Medium | Keep classification logic simple and fixture-backed |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `.mts` blind spot and over-trigger are explicit defects |
| 2 | **Beyond Local Maxima?** | PASS | Compared no-op, extension-only, and extension+scope options |
| 3 | **Sufficient?** | PASS | Single routing policy covers both issues |
| 4 | **Fits Goal?** | PASS | Reduces false positives while improving coverage |
| 5 | **Open Horizons?** | PASS | Supports future TS variant extensions |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Update extension map and TypeScript routing branch.
- Add TS applicability predicate for module-header rule.

**How to roll back**: Revert extension/predicate changes and keep fixture tests to guard reintroduction.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Preserve Line Numbers While Stripping JSONC Block Comments

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Spec Owner, Verifier Maintainer |

### Context
Current JSONC block-comment stripping removes newline structure, which shifts parse error line numbers and causes misleading diagnostics, including `tsconfig`-style comment scenarios.

### Constraints
- Keep parser dependency footprint unchanged (standard library only).
- Do not alter string literal content handling.

### Decision
**We chose**: replace character removal in block comments with line-preserving substitution.

**How it works**: During block-comment state, newline characters are preserved in output while non-newline comment content is replaced with whitespace placeholders.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Line-preserving strip (chosen)** | Accurate line diagnostics, low complexity | Slightly more logic in parser loop | 8/10 |
| Full JSONC parser dependency | Rich parsing behavior | Added dependency and complexity | 5/10 |

**Why this one**: It fixes line drift with minimal architectural change and no new dependencies.

### Consequences

**What improves**:
- Error line numbers remain aligned to source.
- JSONC diagnostics become actionable.

**What it costs**:
- More parser state handling. Mitigation: targeted parser fixtures and unit tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Edge-case regressions in escaped string/comment boundaries | Medium | Add string/comment interaction fixtures |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | JSONC line-shift defect is documented in baseline issues |
| 2 | **Beyond Local Maxima?** | PASS | Compared low-change parser fix vs dependency adoption |
| 3 | **Sufficient?** | PASS | Preserving newlines addresses direct defect |
| 4 | **Fits Goal?** | PASS | Goal includes diagnostic correctness |
| 5 | **Open Horizons?** | PASS | Leaves room for future parser replacement if needed |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Update `strip_jsonc_comments` block-comment handling to preserve line structure.
- Add assertions for expected `JSONDecodeError.lineno` in fixtures.

**How to roll back**: Restore previous stripping behavior and mark JSONC line mapping as known limitation.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:implementation-outcomes -->
## Implementation Outcomes (2026-02-22)

This section records delivered outcomes against planned ADRs.

| ADR | Planned Direction | Implementation Outcome | Status | Evidence |
|-----|-------------------|------------------------|--------|----------|
| ADR-001 | Path policy and rule applicability controls to reduce noise | Implemented path-classification helpers and contextual advisory severity downgrade instead of hard exclusions for contextual trees | Delivered (policy adapted) | `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py`: `CONTEXT_ADVISORY_SEGMENTS`, `is_context_advisory_path`, `classify_severity` |
| ADR-002 | Normalize and dedupe overlapping roots/files | Implemented realpath normalization and file-level dedupe via `seen_paths` | Delivered | `iter_code_files` in verifier script + `test_deduplicates_overlapping_roots` |
| ADR-003 | Add `.mts` support and narrow TS module-header scope | Implemented `.mts` coverage, TS test/pattern-asset skips, and reduced TS over-trigger from 193 to 32 | Delivered | `SUPPORTED_EXTENSIONS`, `should_skip_ts_module_header`, test coverage, post-run metrics |
| ADR-004 | Preserve JSONC line numbers during block-comment stripping | Implemented newline-preserving block-comment handling and `tsconfig` comment-aware fallback parse, reducing JSON parse noise from 2 to 1 | Delivered | `strip_jsonc_comments`, `check_json`, tests for JSONC line number and tsconfig comments |

### Outcome Summary

- All four ADRs were implemented and validated by command runs and regression tests.
- Default verifier behavior now passes warning-only scans (`exit 0`), while strict mode (`--fail-on-warn`) fails warning findings (`exit 1`), enabling CI-selectable enforcement.
<!-- /ANCHOR:implementation-outcomes -->
