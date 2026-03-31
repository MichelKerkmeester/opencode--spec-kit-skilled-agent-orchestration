---
title: "Feature Specification: Ablation [02--system-spec-kit/022-hybrid-rag-fusion/023-ablation-benchmark-integrity/spec]"
description: "The ablation benchmark is currently mixing DB universes, stale or chunk-backed ground-truth IDs, and live search truncation behavior. That combination makes Recall@20 regressions unreadable and blocks any trustworthy verdict on the FTS5 weight retune."
trigger_phrases:
  - "ablation benchmark"
  - "benchmark integrity"
  - "fts5 retune"
  - "recall@20 collapse"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Ablation Benchmark Integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-28 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current ablation path can report invalid Recall@20 values because the benchmark still allows chunk-ID scoring on the CLI path, live token-budget and confidence truncation can cut results below `K=20`, and the active database may not match the parent-memory ID universe encoded in `ground-truth.json`. Those failures produced the misleading `0.0101` baseline collapse and made the FTS5 0.3 retune impossible to judge fairly.

### Purpose
Restore a benchmark path that either runs against an aligned parent-memory dataset without evaluation-time truncation, or fails fast with explicit integrity errors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add benchmark integrity checks that reject misaligned ground-truth and active DB combinations.
- Ensure ablation search adapters normalize parent-memory IDs consistently.
- Add an evaluation-only search mode that preserves the requested `Recall@K` candidate window.
- Make the ground-truth remapping tool capable of refreshing the canonical JSON dataset.
- Rerun full and focused ablations on the aligned repo DB and record the FTS5 verdict.

### Out of Scope
- General retrieval tuning outside the FTS5 weight verdict needed for this investigation.
- Broad documentation churn outside the spec packet and any code-adjacent notes required by the fix.
- Repointing Codex MCP runtime config to a different DB path as part of this code change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts` | Modify | Add ground-truth alignment auditing and fail-fast validation helpers. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts` | Modify | Validate DB provenance and use eval-safe search options for MCP ablation runs. |
| `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts` | Modify | Validate repo DB alignment, bypass eval-time truncation, and normalize parent IDs. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modify | Add evaluation-only mode that bypasses confidence and token-budget truncation. |
| `.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts` | Modify | Allow deterministic `ground-truth.json` refresh against the active repo DB. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json` | Modify | Refresh relevance IDs to the live parent-memory universe for the repo DB. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts` | Modify | Cover alignment auditing and fail-fast benchmark validation. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts` | Modify | Cover eval-mode search options and parent-ID normalization. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Modify | Cover evaluation-mode truncation bypass behavior. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ablation must reject mismatched DB/ground-truth universes before scoring. | Running ablation against a DB with chunk-backed or missing ground-truth IDs fails with a clear integrity error describing the mismatch. |
| REQ-002 | Eval paths must score against canonical parent memories. | CLI and MCP ablation adapters both emit `memoryId = parentMemoryId ?? row.id`, and tests cover the normalization. |
| REQ-003 | Eval paths must preserve the requested `Recall@K` window. | Ablation uses an evaluation-only search option that bypasses confidence truncation and token-budget truncation, and targeted tests prove the bypass. |
| REQ-004 | Ground truth must be refreshable against the repo DB parent-memory universe. | The remapping script can update `ground-truth.json`, and the refreshed dataset validates with zero chunk-backed or missing relevance IDs against the repo DB. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Benchmark reruns must be reproducible and explained. | One full ablation and one focused `fts5` ablation are rerun after fixes, with commands and key metrics captured in the final report. |
| REQ-006 | The FTS5 0.3 verdict must match benchmark integrity. | Final recommendation explicitly states validated, harmful, or unproven, and does not claim improvement unless the benchmark path is proven clean. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The ablation path either runs on a fully aligned parent-memory dataset or fails fast with an integrity error before computing metrics.
- **SC-002**: A clean rerun no longer reports the unexplained `baseline Recall@20 = 0.0101` collapse.
- **SC-003**: Full and focused post-fix reruns are reproducible from exact commands and DB paths.
- **SC-004**: The final FTS5 0.3 recommendation is backed by a benchmark path that is explicitly marked trustworthy.

### Acceptance Scenarios

**Given** the repo DB and refreshed `ground-truth.json` are aligned to the same parent-memory universe, **when** a full ablation runs, **then** it records Recall@20 against parent-memory IDs only and no longer collapses to the unexplained `0.0101` baseline.

**Given** the current Codex dist DB does not share the refreshed parent-memory universe, **when** ablation starts against that DB, **then** it fails immediately with a provenance error instead of storing misleading metrics.

**Given** evaluation mode is enabled for ablation search, **when** a query would previously have been clipped by confidence or token-budget heuristics, **then** the benchmark still reports `budgetTruncated=false` and scores the full candidate window produced by the retrieval stack.

**Given** the aligned repo DB benchmark is rerun with and without FTS5, **when** the full and focused reruns complete, **then** both runs show the same direction of impact for the FTS5 channel.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Repo DB at `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` | Benchmark cannot be trusted if reruns silently switch to another DB. | Validate alignment against the active DB before every ablation run and log the path used. |
| Dependency | `VOYAGE_API_KEY` embeddings availability | Full reruns need live embeddings for the production search path. | Verify env presence before reruns and stop if embedding generation fails. |
| Risk | Ground-truth mapping heuristics choose the wrong parent memory | Refreshed dataset could still be clean but semantically wrong. | Use the existing deterministic mapper, keep preview artifact, and validate parent-only alignment after writing. |
| Risk | Evaluation-only bypass diverges too far from live retrieval behavior | Benchmark could stop measuring the real ranking pipeline. | Scope the bypass narrowly to truncation layers only and keep the rest of the live fusion/reranking stack intact. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Integrity preflight should complete within a single local DB query pass over the distinct ground-truth memory IDs.
- **NFR-P02**: Evaluation-only mode must not change live search latency or defaults outside explicit ablation callers.

### Security
- **NFR-S01**: No secrets or DB paths outside already-configured local files may be introduced.
- **NFR-S02**: The mapper must only rewrite `ground-truth.json` when explicitly requested.

### Reliability
- **NFR-R01**: Misaligned DB provenance must fail closed before storing benchmark metrics.
- **NFR-R02**: Post-fix reruns must remain reproducible from the repo DB even when Codex MCP runtime points elsewhere.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Empty query subset: ablation returns no report and logs the empty selection.
- Chunk-backed relevance IDs: benchmark rejects the dataset instead of silently scoring chunk rows.
- Missing relevance IDs: benchmark rejects the active DB instead of averaging against nonexistent parents.

### Error Scenarios
- Dist DB selected through MCP config: handler fails fast with a provenance error until the dataset and DB universe match.
- Token-budget overflow in live search: evaluation mode bypasses truncation, while normal search behavior stays unchanged.
- Mapping preview without `--write`: script emits the review artifact only and leaves `ground-truth.json` untouched.

### State Transitions
- Post-refresh dataset: reruns must validate alignment before any metric is recorded.
- Mixed clean/investigation runs: any run below `recallK` because of live truncation stays investigation-only and is not used for the verdict.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | Crosses CLI, MCP handler, search pipeline, data file, and tests. |
| Risk | 18/25 | Bad fixes can produce false benchmark confidence or block evaluation entirely. |
| Research | 14/20 | Root cause spans DB provenance, chunk normalization, and truncation behavior. |
| **Total** | **53/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at spec time; verdict depends on post-fix reruns rather than unresolved product decisions.
<!-- /ANCHOR:questions -->
