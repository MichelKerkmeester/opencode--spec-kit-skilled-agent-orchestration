---
title: "Implementation Summary: 005-claudest Research Phase"
description: "12-iteration deep-research audit of the Claudest external Claude Code plugin marketplace and the claude-memory plugin produced 67 source-confirmed findings, a 9-track adoption decision matrix, and two packet-ready implementation briefs (FTS capability cascade + normalized analytics tables) for Public's Spec Kit Memory and Code Graph stack."
trigger_phrases:
  - "005-claudest implementation summary"
  - "005-claudest outcome"
  - "claudest research complete"
importance_tier: critical
contextType: summary
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-claudest |
| **Completed** | 2026-04-06 |
| **Level** | 3 |
| **Status** | COMPLETE |
| **Iterations** | 12 of 12 |
| **Findings** | ~67 source-confirmed |
| **Questions answered** | 10 of 10 (Q1-Q10) |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

12-iteration deep-research session against `external/` (Claudest Claude Code plugin marketplace + claude-memory plugin + get-token-insights skill) produced **~67 source-confirmed findings** across two charters: the original 10-question charter (iters 1-7, ~28 findings) and a user-requested continuation charter (iters 8-12, ~39 findings) that converted Q10 into a usable handoff package. The synthesis lives in `research/research.md` (18 sections including continuation §18.1-§18.5) with a 9-track adoption matrix in §13 + §18.1 and two packet-ready briefs in §18.4.

**Stop reason:** `composite_converged` at iter 7 (composite 0.84), then user-requested continuation extended max iterations to 12; all five continuation iterations executed cleanly via cli-codex with `--full-auto --sandbox workspace-write`.

### Iteration Log

| # | Iteration | Engine | Findings | newInfoRatio | Questions |
|---|-----------|--------|----------|--------------|-----------|
| 1 | marketplace discovery + versioning | cli-codex gpt-5.4 high | 4 | 0.95 | Q1, Q9 |
| 2 | claude-memory SQLite schema + recall cascade | cli-codex gpt-5.4 high | 4 | 0.84 | Q2, Q4 |
| 3 | SessionStart context injection flow | cli-codex gpt-5.4 high | 4 | 0.82 | Q3 |
| 4 | extract-learnings + auditor vs discoverer | cli-codex gpt-5.4 high | 4 | 0.79 | Q5 |
| 5 | get-token-insights ingestion + dashboard contract | cli-codex gpt-5.4 high | 4 | 0.82 | Q7 |
| 6 | dashboard contract + borrowable sections | cli-codex gpt-5.4 high | 4 | 0.71 | Q8 |
| 7 | memory hierarchy comparison | cli-codex gpt-5.4 high | 4 | 0.68 | Q6 |
| 8 | Q10 synthesis matrix | cli-codex gpt-5.4 high | 9 | 0.38 | Q10 |
| 9 | Q10 sequencing + prerequisites | cli-codex gpt-5.4 high | 6 | 0.27 | (refines Q10) |
| 10 | smallest safe v1 per adopt-now lane | cli-codex gpt-5.4 high | 8 | 0.24 | (refines Q10) |
| 11 | packet-ready briefs (FTS cascade + normalized analytics) | cli-codex gpt-5.4 high | 9 | 0.31 | (refines Q10) |
| 12 | uncertainty closeout against Public source | cli-codex gpt-5.4 high | 7 | 0.36 | (refines Q10) |

**Note on engine:** All 12 iterations were dispatched cleanly via `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --full-auto --sandbox workspace-write`. Unlike phase 002-codesight which suffered codex stalls in S sleep state and required native fallback, this phase had no engine failures: the user-approved `--full-auto` and `--sandbox workspace-write` configuration allowed each iteration to write its iteration file directly without the stdout-extraction workaround.

### Top 10 Insights

1. **Discovery is registry-first, not autodiscovery** — `external/.claude-plugin/marketplace.json` declares the catalog; per-plugin manifests are intentionally thin package descriptors. The clean separation is borrowable; the `/plugin` runtime is not. (iter 1)
2. **Auto-update is `/plugin` runtime owned, not repo metadata** — neither the marketplace JSON nor any per-plugin `plugin.json` carries an update flag, channel, or policy; the README's "Marketplaces auto-update" toggle is runtime behavior. (iter 1)
3. **Branch-aware BM25 is the load-bearing recall pattern** — the v3 schema stores messages once and treats branches as a separate index with `aggregated_content` + `context_summary`. BM25 ranks whole branches, then hydration recovers exact message sequences. (iter 2)
4. **`detect_fts_support()` is probe-driven, not exception-driven** — `db.py:195-205` reads `PRAGMA compile_options` to choose `fts5` / `fts4` / `None`; the search function then branches explicitly. Public's exception-triggered degrade behavior is *new hardening*, not back-attributable to Claudest. (iter 2 + iter 11)
5. **SessionStart fast path is a Stop-time precomputed `context_summary`, not on-demand** — the cached-summary cascade in `summarizer.py` is what makes injection cheap; without the precomputed cache, the fallback path must rebuild the summary inline. (iter 3)
6. **`extract-learnings` consolidation explicitly splits verifier and discoverer** — `memory-auditor` only emits `STALE`/`CONTRADICT`/`MERGE`/`DATE_FIX` verdicts on existing memories; `signal-discoverer` mines new candidates and classifies them as `UPDATE`/`CONTRADICT`/`FILL_GAP`/`NOISE`. The split is structurally important. (iter 4)
7. **Cache cliffs are the most reusable observability metric** — `compute_session_analytics()` defines a cache cliff as `cache_read_ratio` drop > 0.5 after `user_gap_ms > 300_000`, then derives week-on-week `cliffs_per_session`. Borrowing the definition is high-leverage, low-cost. (iter 5)
8. **The dashboard's true value is the JSON contract, not the HTML chrome** — `dashboard.html` is a single-file embedded artifact (`deploy_dashboard()` injects `_INLINE_DATA`). The borrowable layer is `trends`, `skill_usage`, `agent_delegation`, `hook_performance`, `findings`, `recommendations`. The neon theme, Chart.js, and Google Fonts are not. (iter 6)
9. **Public already has a stronger memory retrieval stack than Claudest** — Spec Kit Memory MCP, importance tiers, intent-aware routing, and spec-folder-scoped `generate-context.js` outperform a parallel MEMORY file hierarchy. The borrowable layer from Claudest's hierarchy is the *placement rubric* (where should this learning live?), not the file structure. (iter 7)
10. **The first follow-on packet should be the FTS capability cascade, narrowed to `fts5_bm25 → like_scan`** — Brief A in §18.4 with iter 12 closeout: Public still creates only `memory_fts USING fts5`, so an `fts4_match` lane requires schema work; the safe v1 is FTS5 + LIKE plus a shared lexical-capability helper in `mcp_server/lib/search/sqlite-fts.ts`. (iter 11 + iter 12)

### Adoption Decision Matrix Summary

The full 9-track matrix lives in `research/research.md` §13 (synthesis answer) and §18.1-§18.5 (continuation refinement). High-level breakdown:

- **Adopt now**: branch-aware BM25/FTS5 cascade (probe-first, explicit query branches), cached-summary SessionStart fast path (Stop-time write + SessionStart read augmentation), auditor/discoverer split for consolidation, cache-cliff metric, per-tier pricing/cache cost normalization, dashboard JSON contracts (`trends`, `skill_usage`, `agent_delegation`, `hook_performance`, `findings`, `recommendations`).
- **Prototype later**: marketplace discovery + versioning (only after Public ships installable bundles), branch-ranked SQLite schema (only after Public has a durable session/branch graph), turn-level analytics tables (only after transcript identity persistence + cache-token carry-forward land in Stop hook).
- **Reject**: parallel MEMORY always-loaded file hierarchy, plugin-specific HTML/CSS/Chart.js dashboard chrome, `/plugin` runtime auto-update behavior as repo-owned metadata.

### Packet-Ready Briefs

**Brief A: FTS capability cascade** (`research/research.md` §18.4) — narrowed v1 to `fts5_bm25 → like_scan` with explicit backend metadata; central capability helper in `mcp_server/lib/search/sqlite-fts.ts`; consumers in `mcp_server/lib/search/hybrid-search.ts` and `mcp_server/lib/search/graph-search-fn.ts`; forced-degrade verification matrix; rollback plan via narrow feature flag.

**Brief B: Normalized analytics tables** (`research/research.md` §18.4) — additive `sessions`/`turns`/`model_pricing_versioned`/`cache_tier_normalized` tables; producer (`024/003`) untouched; new reader-owned analytics replay job; verification via idempotent dual-replay; rollback via dropping reader-owned tables. Entry conditions: persist `transcriptPath` + replay fingerprint into `HookState`, expand metrics with cache-read/cache-write tokens.

---

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Engine Strategy

- **All 12 iterations** dispatched via `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --full-auto --sandbox workspace-write`. Each call returned in ~3-5 minutes with clean output and direct iteration-file writes (no stdout-extraction workaround needed).
- **Iters 1-7**: original-charter; convergence at iter 7 (composite 0.84, 9 of 10 questions answered, `synthesis_complete` event).
- **Iters 8-12**: continuation charter; user-approved `--full-auto` allowed sequential synthesis-class iterations. Each continuation iteration deepens the prior synthesis output (matrix → sequencing → slicing → briefs → closeout) so parallelism would have wasted the dependency chain.

### State Files

- `research/deep-research-config.json` — `status=complete`, `maxIterations=12`, delegation=`cli-codex gpt-5.4 high workspace-write fast-mode`, status updated by reducer
- `research/deep-research-state.jsonl` — 17 lines: 12 iteration records + session_start + `delegation_override` + `synthesis_complete` (iter 7) + `continuation_requested` (after iter 7) + `continuation_complete` (after iter 12)
- `research/deep-research-strategy.md` — Q1-Q10 marked as answered, NEXT FOCUS = "SESSION COMPLETE"; reducer-managed sections 7-11 reflect all 12 iterations
- `research/deep-research-dashboard.md` — reducer-refreshed
- `research/findings-registry.json` — reducer-refreshed

### Memory Artifact

- `memory/06-04-26_19-56__completed-a-12-iteration-deep-research-audit-of.md` — saved via `generate-context.js` with rich JSON (10 keyDecisions, 17 filesModified, 12 toolCalls, 4 exchanges, preflight + postflight scores), `importance_tier=critical`, 34 clean semantic trigger phrases, indexed as memory #1845. Prior thin saves (06-04-26_17-13 and 06-04-26_19-41) archived under `memory/.archive-pre-quality-rebuild/`.
- `memory/metadata.json` — Voyage 768-dim embedding

---

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Used cli-codex with gpt-5.4 + reasoning_effort=high + sandbox=workspace-write per user directive**, dispatched all 12 iterations sequentially via `codex exec`. The continuation iterations (8-12) were NOT parallelized because each one builds on the prior synthesis (matrix → sequencing → slicing → briefs → closeout).
2. **Original charter converged at iter 7** with composite_converged 0.84 and 9 of 10 questions answered. The `synthesis_complete` event was emitted, then user requested 5 more iterations to deepen Q10 specifically. The continuation pivoted from "find new evidence" to "convert evidence into actionable handoff."
3. **Continuation charter decomposed Q10 into five distinct synthesis passes**: matrix (iter 8), sequencing against Public packets (iter 9), smallest-safe-v1 slicing (iter 10), packet-ready briefs (iter 11), and uncertainty closeout against actual Public source (iter 12). Each pass reduced ambiguity for the next.
4. **First follow-on packet is the FTS capability cascade, narrowed**: iter 12 specifically read `mcp_server/lib/search/sqlite-fts.ts` and `mcp_server/lib/search/vector-index-schema.ts:2382-2412` to confirm Public still creates only `memory_fts USING fts5`. That ruled out the older brief's `fts4_match` lane as a default first-packet promise — narrowing v1 to `fts5_bm25 → like_scan` with a shared capability helper.
5. **Brief B (normalized analytics) has explicit entry conditions** that preserve `024/003` as the unchanged producer: persist `transcriptPath` + replay fingerprint into `HookState`, expand metrics with cache-read/cache-write token fields, and define turn-level uniqueness off persisted offsets rather than the existing session-level `lastTranscriptOffset` alone. iter 12 confirmed via `mcp_server/hooks/claude/session-stop.ts:191-257` that `transcript_path` is not persisted today.
6. **Memory hierarchy decision is "borrow placement rubric, reject the file layer"**: Claudest's MEMORY file plus topic-file structure is partly always loaded, but Public's Spec Kit Memory + `generate-context.js` already provides stronger retrieval, scoping, and importance tiers. The borrowable piece is the placement rubric ("where should this learning live?"), not the parallel file hierarchy. iter 7 documented this with explicit complementary-vs-redundant labeling.

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- [x] All 10 questions answered (Q1-Q10 from original charter; Q10 deepened across continuation iters 8-12)
- [x] ~67 source-confirmed findings with exact `external/plugins/...` line citations
- [x] 9-track adoption decision matrix in `research/research.md` §13 + §18.1
- [x] Two packet-ready briefs (Brief A FTS cascade + Brief B normalized analytics) in `research/research.md` §18.4
- [x] Cross-phase boundary with sibling phase `001-claude-optimization-settings` explicitly bounded
- [x] Memory artifact saved with `critical` tier, indexed via Voyage 768-dim embedding
- [x] All trigger phrases are semantic (no path fragments)
- [x] `validate.sh --strict` returns RESULT: PASSED
- [x] Spec docs (spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md, decision-record.md) present and consistent
- [x] No edits made under `external/`
- [x] Reducer maintained findings-registry.json, dashboard, and machine-owned strategy sections in sync

---

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- **Reducer and analyst sections collide**: The reducer treats sections 7-11 of strategy.md as machine-owned, but it sometimes also wipes the analyst-owned sections 3 (KEY QUESTIONS) and 6 (ANSWERED QUESTIONS) when JSONL records use abbreviated question texts. Workaround: re-add Q1-Q10 summaries after each reducer run.
- **Continuation iterations cannot be parallelized**: Unlike phase 002-codesight where the 5 continuation iterations covered independent modules and were dispatched in parallel, this phase's continuation iterations (8-12) form a synthesis dependency chain (matrix → sequencing → slicing → briefs → closeout) and must run sequentially. Parallelism would have wasted the inter-iteration synthesis dependencies.
- **`fts4_match` lane is gated on schema work**: The Brief A v1 was narrowed to `fts5_bm25 → like_scan` because Public still provisions only `memory_fts USING fts5` (`mcp_server/lib/search/vector-index-schema.ts:2382-2412`). Restoring an `fts4_match` lane requires alternate FTS4 schema creation in the same packet.
- **Brief B entry conditions are not yet met**: `024/003` does not persist `transcript_path` into `HookState`, leaves `speckitSessionId` empty, drops parsed cache token fields, and emits only session-level `lastTranscriptOffset` (not turn-level offsets). The normalized analytics packet must add a bounded producer metadata patch first.
- **Memory file rebuilt after thin saves archived**: Two prior memory saves (06-04-26_17-13 and 06-04-26_19-41) were created with thin input data and were auto-classified as IN_PROGRESS / 25-95% / Phase PLANNING because the script's session-status logic interpreted unprefixed nextSteps as pending work. Both files were moved to `memory/.archive-pre-quality-rebuild/` and a new memory was saved via `generate-context.js` with rich JSON (10 keyDecisions, 17 filesModified, 12 toolCalls, 4 exchanges, preflight + postflight scores). The new file `memory/06-04-26_19-56__completed-a-12-iteration-deep-research-audit-of.md` captures the complete 12-iteration session with COMPLETED status / 100% completion and is indexed as memory #1845. Manual patches were applied to the title, trigger_phrases (removed auto-extracted path fragments), Session Status, and OVERVIEW section per post-save quality review HIGH-severity guidance.


<!-- /ANCHOR:limitations -->
