---
title: Code Quality Checklist
description: Correctness, performance, and boundary-condition checklist for identifying production-impacting quality defects.
---

# Code Quality Checklist

Correctness, performance, and boundary-condition checklist for identifying production-impacting quality defects.

---

## 1. OVERVIEW

### Purpose

Provide a systematic pass for non-security defects that still cause outages, regressions, or high maintenance cost.

### Core Principle

Prioritize silent-failure and data-corruption risks above stylistic concerns.

---

## 2. ERROR HANDLING

Flag:
- Swallowed exceptions (`catch {}` or log-only catches).
- Overly broad exception handling hiding root causes.
- Missing async error propagation.
- User-facing leakage of internal stack traces.
- Missing fallback behavior for recoverable failures.

Review prompts:
- "Will callers know this failed?"
- "Is there enough context to debug without exposing internals?"

---

## 3. PERFORMANCE AND SCALING

Flag:
- N+1 query patterns.
- Per-item network/database calls that should be batched.
- Expensive work in hot loops without memoization/cache.
- Synchronous blocking work in request paths.
- Unbounded collections and memory growth risks.

Review prompts:
- "How does this behave with 10x data volume?"
- "Can this call path be batched or cached safely?"

---

## 4. BOUNDARY CONDITIONS

Check:
- Null/undefined handling and optional chaining misuse.
- Empty collection behavior for first/last/indexed access.
- Numeric boundaries (division by zero, overflow, negative values).
- String boundaries (empty, whitespace-only, very long input, unicode).
- Off-by-one errors in loops, pagination, and slicing.

Common risky patterns:

```javascript
const first = items[0]              // no empty check
const avg = total / count           // count may be zero
if (value) { /* skips valid 0 */ }  // truthy trap
```

---

## 5. DATA FLOW AND CONTRACT SAFETY

Flag:
- Function or method signature changes that break existing callers (added required parameters, removed parameters, changed return types).
- New null or undefined return paths introduced where callers expect a value.
- Data transformation functions that silently drop fields, truncate values, or lose type precision.
- Default parameter value changes that alter behavior for existing callers without updating call sites.
- Implicit behavioral contract changes (sort order, iteration order, timing guarantees) not documented in the diff.
- Public API response shape changes without versioning or migration path.

Review prompts:
- "If an existing caller is not updated, will it still work correctly after this change?"
- "Does any data transformation lose information that downstream consumers need?"
- "Are implicit behavioral guarantees (ordering, timing, idempotency) preserved?"

Severity guidance:
- P0 for breaking changes to public APIs or shared interfaces with no migration path.
- P1 for new null returns or type changes that existing callers do not handle.
- P2 for implicit contract changes with low blast radius.

---

## 6. MAINTAINABILITY SIGNALS

Watch for:
- Repeated logic with inconsistent behavior.
- Magic literals where domain constants are expected.
- Overly nested control flow reducing readability.
- Hidden coupling through global/shared mutable state.
- Tests missing for newly introduced edge cases.
- Functions exceeding 20 lines or 4+ nesting levels without structural justification.
- Deep method chaining across more than two object boundaries (Law of Demeter: a.b().c().d()).
- Functions that produce side effects not implied by their name or signature (Principle of Least Astonishment).
- Error messages that lack actionable context for debugging (missing what failed and what to try).
- TODO, FIXME, or HACK comments in production code paths without an associated tracking reference (issue link or ticket number).
- Hardcoded environment-specific values (URLs, ports, timeout thresholds) that should be externalized for deployment flexibility.

Decision cue: if reviewers cannot explain intent quickly, maintenance risk is likely at least P2.

---

## 7. KISS / DRY ENFORCEMENT

### KISS Checks

Flag:
- New abstraction layers without a current behavior need.
- Generic helpers used in only one place.
- Workflow complexity introduced "for future flexibility" without evidence.
- Features, parameters, or configuration options added for speculative future use without a current requirement (YAGNI).

### DRY Checks

Flag:
- Duplicated constants/rules across modules.
- Copy-paste branches with minor name changes.
- Repeated validation/parsing blocks that can share one source.
- Abstractions extracted from only two instances without evidence of a shared concept. Apply the Rule of Three before consolidating to avoid premature generalization (AHA).

Severity guidance:
- P2 default for stylistic duplication/complexity.
- Escalate to P1 if duplication or complexity introduces behavior/regression risk.

---

## 8. RELATED RESOURCES

- [quick_reference.md](./quick_reference.md) - Baseline review flow and severity output contract.
- [security_checklist.md](./security_checklist.md) - Security, authz, abuse, and privacy risk checks.
- [solid_checklist.md](./solid_checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture risk prompts.
- [removal_plan.md](./removal_plan.md) - Removal candidate classification and migration planning.
- [test_quality_checklist.md](./test_quality_checklist.md) - Test quality, coverage, and anti-pattern checks.

Overlay portability: pair this baseline with stack-specific quality guidance from `sk-code-opencode` or `sk-code`.
