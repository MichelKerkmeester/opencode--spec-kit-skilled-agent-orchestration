---
title: "Decision Record: Memory Index Deduplication and Tier Normalization [003-index-tier-anomalies/decision-record]"
description: "We need deterministic indexing even when specs/ and .opencode/specs/ reference the same file tree. Today those roots can both contribute identical files to one scan. That create..."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision"
  - "record"
  - "memory"
  - "index"
  - "deduplication"
  - "decision record"
  - "003"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Memory Index Deduplication and Tier Normalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical Path Dedup Before Indexing

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Maintainer, AI assistant |

---

### Context

We need deterministic indexing even when `specs/` and `.opencode/specs/` reference the same file tree. Today those roots can both contribute identical files to one scan. That creates duplicate indexing work and unstable scan metrics.

### Constraints

- The current API supports dual-root discovery and must remain backward compatible.
- Dedup logic must work on macOS and Linux path semantics.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: deduplicate scan candidates by canonical absolute path before incremental categorization and batch indexing.

**How it works**: scanner outputs are normalized and resolved to canonical paths. The merged candidate list is reduced to unique canonical entries. Counters and batch inputs are derived from this unique set.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical-path dedup (Chosen)** | Preserves dual-root compatibility; deterministic scan behavior | Adds normalization complexity | 9/10 |
| Single-root scanning only | Simple implementation | Breaks existing dual-root workflows | 5/10 |
| DB-level unique constraint only | Prevents duplicate inserts | Does not fix inflated scan metrics or wasted batch work | 6/10 |

**Why this one**: It fixes duplication at the earliest safe boundary and keeps compatibility with existing file discovery expectations.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Scan/index counters reflect unique logical files.
- Duplicate indexing work from alias roots is eliminated.
- `specFolder`-scoped indexing remains deterministic after canonicalization.

**What it costs**:
- Additional canonicalization step in scan pipeline. Mitigation: keep implementation small and covered by tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Canonicalization mismatch across platforms | M | Add cross-platform path normalization tests |
| Over-dedup of distinct files | H | Dedup by canonical absolute file path only |

**Implementation alignment (2026-02-22)**:
- Implemented in `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`.
- Verified by targeted + extended test runs (52 + 186 tests passing) and scoped ESLint pass.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Duplicate scan issue is in active bug scope |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives evaluated |
| 3 | **Sufficient?** | PASS | Fixes root cause before indexing |
| 4 | **Fits Goal?** | PASS | Directly targets index duplication and metric accuracy |
| 5 | **Open Horizons?** | PASS | Compatible with existing discovery model |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Normalize and dedup scanner outputs in `memory-index.ts`.
- Align path handling in `memory-parser.ts` and preserve specFolder filtering.
- Add regression tests in handler/parser/tier test suites.

**How to roll back**: revert the canonicalization/dedup commit, rerun baseline tests, and confirm legacy scan behavior returns.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Deterministic Tier Precedence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Maintainer, AI assistant |

### Context

Tier anomalies occur when metadata hints, inline markers, and default document-type mapping are interpreted inconsistently. We need one precedence rule so ranking behavior is predictable.

### Decision

Use one precedence chain: explicit YAML tier metadata first, inline tier markers second, document-type default last.

### Consequences

- Ranking behavior becomes explainable and testable.
- Existing content with invalid tier values falls back to safe defaults.
- Tier normalization is consistent across parser and scoring utility paths.

### Implementation Alignment

- Implemented in `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts` with parser integration updates in `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`.
- Verified by targeted test suite `tests/memory-parser.vitest.ts`, `tests/importance-tiers.vitest.ts`, plus extended parser/spec suite (`186` tests passing).

### Alternatives Rejected

- Inline markers over metadata, rejected because metadata should be explicit source of truth.
- Default-only mapping, rejected because it ignores intentional per-document overrides.
