---
title: "Decision Record: JSON Mode Hybrid Enrichment (Phase 1B)"
description: "Captures the accepted architecture for restoring file-backed JSON metadata without reopening contamination."
trigger_phrases:
  - "decision"
  - "record"
  - "json mode"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: JSON Mode Hybrid Enrichment (Phase 1B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Restore Metadata Through Safe Hybrid Enrichment

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-20 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-001-context -->
### Context

File-backed JSON saves were safe but incomplete because the workflow returned before any enrichment ran. Session status, git provenance, changed-file counts, and higher-quality descriptions could all degrade even when the caller or local repo state had enough information to fill them in.

### Constraints

- The fix could not reintroduce observation or `FILES` leakage into V8-sensitive output.
- The solution had to stay backward compatible with existing JSON payloads.
- The final output needed to honor caller-supplied metadata when it was more authoritative than heuristics.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Restore metadata through a safe file-source enrichment path plus explicit JSON-first priority rules.

**How it works**: `enrichFileSourceData()` now merges safe provenance, trigger, and description data for file-backed inputs while explicitly skipping observations and `FILES`. The pipeline treats explicit `session` and `git` fields as authoritative, preserves those values through final template assembly, and resolves `git_changed_file_count` through an explicit > enrichment > provenance priority chain.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Safe hybrid enrichment with JSON-first priority** | Restores useful metadata, preserves contamination safety, stays backward compatible | Requires a documented priority chain and one file-source branch | 9/10 |
| Full enrichment for file-backed JSON mode | Simplest control flow | Reopens observation leakage and contamination risk | 3/10 |
| Keep the old early return and accept degraded metadata | No implementation complexity | Leaves JSON mode materially incomplete and untrustworthy | 2/10 |

**Why this one**: It solved the real correctness gap without sacrificing the safety guarantee that made JSON mode necessary in the first place.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- File-backed JSON saves regain session status, git provenance, better descriptions, and more realistic counts.
- Explicit caller metadata survives to the final output instead of being overwritten by weaker heuristics.
- Wave 2 hardening gives the path stable behavior for confidence values, truncated outcomes, and changed-file counts.

**What it costs**:

- The workflow now carries a file-source-specific enrichment branch. Mitigation: keep it narrow and metadata-only.
- Count handling and precedence are more correctness-sensitive. Mitigation: document the priority chain in the spec set and verify it through targeted examples.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future refactor removes the contamination boundary | H | Keep the explicit skip of observations and `FILES` documented and verified |
| A later spread overwrites explicit session counts again | M | Preserve the RC-9-style reassertion step in final template assembly |
| Callers send malformed nested metadata | M | Reject invalid `session`, `git`, and changed-file-count input during normalization |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | JSON mode was losing metadata needed for trustworthy saved context |
| 2 | **Beyond Local Maxima?** | PASS | Compared against full enrichment and no-change options |
| 3 | **Sufficient?** | PASS | A narrow metadata-only branch solved the gap without reopening contamination |
| 4 | **Fits Goal?** | PASS | The phase goal was accurate JSON-mode metadata with preserved safety |
| 5 | **Open Horizons?** | PASS | The pattern can support future safe enrichments without changing the contract shape |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `session-types.ts` adds optional `SessionMetadata`, `GitMetadata`, and changed-file-count support.
- `workflow.ts` routes file-backed inputs into `enrichFileSourceData()` and preserves explicit counts during template assembly.
- `collect-session-data.ts` applies explicit-first session and git priority rules.
- `input-normalizer.ts` validates the nested JSON blocks and explicit confidence values.
- `generate-context.ts` documents the expanded JSON contract.

**How to roll back**: Remove the file-source enrichment helper, revert the explicit-first priority chain, and restore the previous file-source early return and legacy count logic.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
