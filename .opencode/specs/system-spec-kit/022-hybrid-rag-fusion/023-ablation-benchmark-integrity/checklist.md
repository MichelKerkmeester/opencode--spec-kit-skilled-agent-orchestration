---
title: "Verification Checklist [system-spec-kit/022-hybrid-rag-fusion/023-ablation-benchmark-integrity/checklist]"
description: "Verification Date: 2026-03-28"
trigger_phrases:
  - "verification checklist"
  - "ablation benchmark"
  - "benchmark integrity"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: Ablation Benchmark Integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [Evidence: `spec.md` captures the benchmark-integrity scope, blockers, and success criteria.]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [Evidence: `plan.md` defines the alignment preflight, evaluation-mode bypass, dataset refresh, and rerun phases.]
- [x] CHK-003 [P1] Dependencies identified and available [Evidence: repo DB, `VOYAGE_API_KEY`, and mapping-tool dependencies are documented in `plan.md` and were available during verification.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Ablation preflight rejects misaligned DB/ground-truth combinations [Evidence: `assertGroundTruthAlignment()` added in `ablation-framework.ts`; dist DB smoke check now fails closed with `missing relevances=294 across 126 IDs`.]
- [x] CHK-011 [P0] Eval search path preserves `Recall@K` by bypassing truncation only in evaluation mode [Evidence: `evaluationMode` added to `hybrid-search.ts`; `hybrid-search.vitest.ts` covers the bypass; the 10-query runtime probe reported `budgetTruncated=false` for every sampled query.]
- [x] CHK-012 [P1] CLI and MCP ablation adapters normalize `parentMemoryId ?? row.id` [Evidence: `run-ablation.ts` and `eval-reporting.ts` now map `parentMemoryId ?? row.id`; handler test asserts parent normalization to `memoryId=99`.]
- [x] CHK-013 [P1] Ground-truth refresh tool rewrites the dataset only when explicitly requested [Evidence: `map-ground-truth-ids.ts` now requires `--write` for JSON mutation; preview output still lands in `/tmp/ground-truth-id-mapping.json`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Targeted Vitest coverage passes for integrity guards and eval-mode search [Evidence: `npm exec --workspace=@spec-kit/mcp-server vitest run tests/ablation-framework.vitest.ts tests/handler-eval-reporting.vitest.ts tests/hybrid-search.vitest.ts` passed with 151 tests after the data refresh and eval DB override changes.]
- [x] CHK-021 [P0] Refreshed `ground-truth.json` validates with zero chunk-backed or missing IDs against the repo DB [Evidence: SQLite audit after refresh reported `unique_ids=126`, `parent_rows=126`, `chunk_rows=0`, `missing=0`.]
- [x] CHK-022 [P1] One full ablation rerun completes on the aligned repo DB [Evidence: `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts` produced run `ablation-1774694183830-651d` with baseline `0.32323232323232315`.]
- [x] CHK-023 [P1] One focused `fts5` ablation rerun completes on the aligned repo DB [Evidence: `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels fts5` produced run `ablation-1774694221880-ef57`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or new external endpoints were introduced [Evidence: changes are limited to local SQLite path validation, search options, and test coverage; existing `VOYAGE_API_KEY` usage is unchanged.]
- [x] CHK-031 [P0] Eval-only behavior is opt-in and does not change live default search behavior [Evidence: truncation bypass is gated behind `evaluationMode: true` and is only wired from ablation callers.]
- [x] CHK-032 [P1] Active DB provenance is stated in rerun evidence [Evidence: reruns log `Production DB: .../mcp_server/database/context-index.sqlite`; dist DB smoke check separately demonstrates fail-closed behavior. All 7 MCP configs now point `MEMORY_DB_PATH` at the repo DB.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with actual implementation [Evidence: `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` all reflect the completed benchmark repair and rerun evidence.]
- [x] CHK-041 [P1] Final report explains the clean and investigation-only runs separately [Evidence: the implementation summary and final response distinguish the old invalid runs from the repaired repo DB reruns.]
- [x] CHK-042 [P2] Additional documentation changes only if required by the code fix [Evidence: only the new spec packet and refreshed benchmark dataset were updated; no broader doc sweep was needed.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary analysis artifacts kept outside tracked source paths [Evidence: runtime probes and rewrite helpers stayed under `/tmp`.]
- [x] CHK-051 [P1] No unrelated dirty-tree files were modified [Evidence: scope-limited status review shows only the benchmark packet, target runtime files, tests, and refreshed ground-truth dataset changed in this task slice.]
- [ ] CHK-052 [P2] Findings saved to memory/ [Evidence: not requested in this turn.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-03-28
<!-- /ANCHOR:summary -->
