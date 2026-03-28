---
title: "Implementation Summary: Ablation Benchmark Integrity"
description: "The ablation benchmark now fails closed on DB provenance mismatches, scores parent memories consistently, and bypasses evaluation-only truncation so Recall@20 reflects retrieval quality instead of token clipping."
trigger_phrases:
  - "implementation summary"
  - "ablation benchmark"
  - "benchmark integrity"
importance_tier: "high"
contextType: "general"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-ablation-benchmark-integrity |
| **Completed** | 2026-03-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The ablation path is trustworthy again on the repo DB. You now get a fail-fast provenance guard instead of silent cross-DB scoring, a benchmark-only search mode that preserves the requested top-K window, and a refreshed parent-memory ground-truth dataset that no longer mixes chunk IDs or stale IDs into Recall@20.

### Benchmark Integrity Guards

You can now stop an invalid benchmark before it stores misleading metrics. `assertGroundTruthAlignment()` audits every relevance ID against the active DB and aborts ablation when the DB does not share the same parent-memory universe as `ground-truth.json`. That guard caught the current Codex dist DB immediately with `missing relevances=294 across 126 IDs`, which means the old mixed-universe runs would now fail closed instead of pretending to be clean evidence.

### Evaluation-Only Search Mode

You can now measure retrieval quality without letting live response-budget heuristics corrupt `Recall@20`. `hybridSearchEnhanced()` accepts `evaluationMode: true`, which bypasses confidence truncation and token-budget truncation while leaving the rest of the fusion stack intact. The CLI and MCP ablation adapters both use that mode and both normalize `parentMemoryId ?? row.id`, so benchmark scoring matches the canonical parent-memory IDs that the refreshed dataset now encodes.

### Refreshed Ground Truth and Reproducible Reruns

You can now refresh the canonical relevance file intentionally. `map-ground-truth-ids.ts` gained an explicit `--write` path, and the source dataset was refreshed to `294` parent-backed relevances across `126` unique memory IDs. The two post-fix reruns on the repo DB both agreed: baseline `Recall@20` is `0.32323232323232315`, and removing FTS5 collapses recall to `0.0`, which reverses the earlier false “FTS5 is harmful” signal.

### MCP Eval DB Override and Config Unification

The MCP ablation handler now supports `SPECKIT_EVAL_DB_PATH` as an eval-only DB override via a `withAblationDb()` helper in `eval-reporting.ts`. The helper temporarily swaps the vector-index singleton to the eval DB, runs alignment and search there, then restores the original connection in a `finally` block.

However, the root cause was simpler: all 7 MCP runtime configs pointed `MEMORY_DB_PATH` at an external 44-record Codex DB (`~/.codex/memories/`) instead of the repo DB. All configs were repointed to `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` (the repo DB with 2,417 records), and a symlink was placed at the old Codex path for backward compatibility. With `MEMORY_DB_PATH` and the repo DB aligned, `SPECKIT_EVAL_DB_PATH` is no longer needed and was removed from all configs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts` | Modified | Added ground-truth alignment audit and fail-fast benchmark validation. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Modified | Added `evaluationMode` to bypass confidence and token-budget truncation only for benchmark callers. |
| `.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts` | Modified | Validates repo DB provenance, enables eval mode, normalizes parent IDs, and now resolves paths in both source and dist layouts. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts` | Modified | Adds provenance guard, eval-mode search path, and `withAblationDb()` override support to MCP ablation runs. |
| `.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts` | Modified | Adds explicit `--write` support and resolves paths correctly in both source and dist layouts. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json` | Modified | Refreshed canonical parent-memory relevance dataset for the repo DB. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts` | Modified | Covers alignment-pass and alignment-fail cases. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts` | Modified | Covers eval-mode search options, parent normalization, and `SPECKIT_EVAL_DB_PATH` override behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts` | Modified | Covers evaluation-mode truncation bypass. |
| `opencode.json` · `.claude/mcp.json` · `.mcp.json` · `.vscode/mcp.json` · `.codex/config.toml` · `.agents/settings.json` · `.gemini/settings.json` | Modified | Repointed `MEMORY_DB_PATH` from external `~/.codex/memories/` to repo DB path. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work started with a root-cause pass across the repo and dist eval DBs, the live search pipeline, and the canonical ground-truth file. That investigation isolated three benchmark blockers: CLI-side chunk-ID scoring, evaluation-time truncation leaking into Recall@20, and a stale/misaligned parent-memory universe in `ground-truth.json`.

After the runtime patches landed, the benchmark dataset was refreshed against the repo DB and revalidated with zero chunk-backed or missing IDs. Confidence came from three layers: targeted Vitest coverage, a post-refresh alignment audit, and two ablation reruns on the same repo DB path that produced matching baseline and FTS5 deltas.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Added `evaluationMode` instead of raising token budgets | The failure mode was structural, not just a budget value problem. A benchmark should bypass truncation deterministically rather than guess a bigger cap. |
| Failed closed on DB/ground-truth mismatches | Cross-DB runs produced the earlier misleading baselines, so silent fallback would keep the benchmark untrustworthy. |
| Refreshed the canonical dataset to parent-memory IDs | Parent normalization in the scorer is not enough if the dataset itself still points at chunks or stale IDs. |
| Kept the rest of the live fusion stack intact during evaluation | The goal was to isolate truncation as the invalidating layer without turning ablation into a separate search algorithm. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm exec --workspace=@spec-kit/mcp-server vitest run tests/ablation-framework.vitest.ts tests/handler-eval-reporting.vitest.ts tests/hybrid-search.vitest.ts` | PASS, `151` tests passed after runtime, dataset, and eval DB override changes |
| `npm run build` | PASS, workspace build succeeded after runtime and script path fixes |
| Repo DB alignment audit | PASS, `294` relevances across `126` unique IDs with `chunk_rows=0` and `missing=0` |
| Dist DB smoke check (pre-config-fix) | PASS, benchmark correctly failed closed with `missing relevances=294 across 126 IDs` when configs pointed at the external Codex DB |
| MCP config unification | PASS, all 7 runtime configs repointed `MEMORY_DB_PATH` to the repo DB; symlink at `~/.codex/memories/` for backward compatibility |
| `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts` | PASS, run `ablation-1774694183830-651d`, baseline `0.32323232323232315`, FTS5 ablated `0.0` |
| `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels fts5` | PASS, run `ablation-1774694221880-ef57`, same baseline and same FTS5 collapse |
| 10-query evaluation-mode runtime probe | PASS, every sampled query reported `budgetTruncated=false` and `evaluationMode=true`; shorter result lists were genuine sparse retrieval, not token clipping |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

None. The original limitation (Codex MCP runtime pointing at an external DB) was resolved by repointing all 7 MCP configs to the repo DB and placing a symlink at the old Codex path.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
