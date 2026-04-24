---
title: "Imple [system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/005-claudest/implementation-summary]"
description: "20-iteration deep-research audit of the Claudest external Claude Code plugin marketplace and the claude-memory plugin produced a completed continuation packet with 162 reducer-tracked findings, a 9-track adoption decision matrix, two packet-ready implementation briefs, and a six-packet implementation roadmap for Public's Spec Kit Memory and Code Graph stack."
trigger_phrases:
  - "005-claudest implementation summary"
  - "005-claudest outcome"
  - "claudest research complete"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["implementation-summary.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
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
| **Completed** | 2026-04-08 |
| **Level** | 3 |
| **Status** | COMPLETE |
| **Iterations** | 20 of 20 |
| **Findings** | 162 reducer-tracked key findings |
| **Questions answered** | 18 of 18 (Q1-Q18) |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

20-iteration deep-research session against `external/` (Claudest Claude Code plugin marketplace + claude-memory plugin + get-token-insights skill) now spans two generations and three distinct handoff layers: the original 10-question charter (iters 1-7), the first continuation that converted Q10 into a usable handoff package (iters 8-12), and the execution-ready continuation that turned those conclusions into implementation contracts and packet ordering (iters 13-20). The synthesis lives in `research/research.md`, now with a new Section 19 for the execution-ready continuation.

**Stop reason:** generation 1 converged at iter 7 (composite 0.84), then the packet continued through iteration 20 so every remaining ambiguity ended as a packet boundary, test gate, or explicit defer.

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
| 13 | FTS capability helper contract + caller migration plan | codex gpt-5.4 high | 6 | 0.44 | Q11 |
| 14 | forced-degrade FTS test matrix | codex gpt-5.4 high | 5 | 0.39 | Q12 |
| 15 | Stop-hook metadata patch for transcript identity + cache tokens | codex gpt-5.4 high | 6 | 0.35 | Q13 |
| 16 | normalized analytics replay schema + idempotent join keys | codex gpt-5.4 high | 6 | 0.33 | Q14 |
| 17 | SessionStart cached-summary fast path placement | codex gpt-5.4 high | 5 | 0.28 | Q15 |
| 18 | verifier/discoverer split mapped to Public seams | codex gpt-5.4 high | 6 | 0.26 | Q16 |
| 19 | portable token-insight JSON contracts | codex gpt-5.4 high | 5 | 0.23 | Q17 |
| 20 | dependency-ordered implementation roadmap + acceptance gates | codex gpt-5.4 high | 8 | 0.18 | Q18 |

**Note on engine:** generation 1 ran through `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --full-auto --sandbox workspace-write`; generation 2 was continued in the active Codex workspace session with the same model target. Across both generations there were no engine failures or packet-corrupting restarts.

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

The full 9-track matrix lives in `research/research.md` §13, §18.1-§18.5, and the execution-ready continuation in §19. High-level breakdown:

- **Adopt now**: branch-aware BM25/FTS5 cascade (probe-first, explicit query branches), cached-summary SessionStart fast path (Stop-time write + SessionStart read augmentation), auditor/discoverer split for consolidation, cache-cliff metric, per-tier pricing/cache cost normalization, dashboard JSON contracts (`trends`, `skill_usage`, `agent_delegation`, `hook_performance`, `findings`, `recommendations`).
- **Prototype later**: marketplace discovery + versioning (only after Public ships installable bundles), branch-ranked SQLite schema (only after Public has a durable session/branch graph), turn-level analytics tables (only after transcript identity persistence + cache-token carry-forward land in Stop hook).
- **Reject**: parallel MEMORY always-loaded file hierarchy, plugin-specific HTML/CSS/Chart.js dashboard chrome, `/plugin` runtime auto-update behavior as repo-owned metadata.

### Packet-Ready Briefs

**Brief A: FTS capability cascade** (`research/research.md` §18.4) — narrowed v1 to `fts5_bm25 → like_scan` with explicit backend metadata; central capability helper in `mcp_server/lib/search/sqlite-fts.ts`; consumers in `mcp_server/lib/search/hybrid-search.ts` and `mcp_server/lib/search/graph-search-fn.ts`; forced-degrade verification matrix; rollback plan via narrow feature flag.

**Brief B: Normalized analytics tables** (`research/research.md` §18.4) — additive `sessions`/`turns`/`model_pricing_versioned`/`cache_tier_normalized` tables; producer (`024/003`) untouched; new reader-owned analytics replay job; verification via idempotent dual-replay; rollback via dropping reader-owned tables. Entry conditions: persist `transcriptPath` + replay fingerprint into `HookState`, expand metrics with cache-read/cache-write tokens.

**Execution-ready roadmap** (`research/research.md` §19) — explicit packet order: FTS helper and degrade tests, Stop-hook metadata patch, analytics reader, SessionStart fast path, verifier/discoverer workflow split, then token-insight contracts.

---

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Engine Strategy

- **Iterations 1-12** dispatched via `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --full-auto --sandbox workspace-write`. Each call returned in ~3-5 minutes with clean output and direct iteration-file writes.
- **Iters 1-7**: original-charter; convergence at iter 7 (composite 0.84, 9 of 10 questions answered, `synthesis_complete` event).
- **Iters 8-12**: first continuation charter; sequential synthesis-class iterations converted Q10 into packet-ready briefs.
- **Iters 13-20**: execution-ready continuation; the live packet was reopened in `completed-continue` mode and extended to 20 total iterations to lock packet boundaries, verification matrices, and implementation order.

### State Files

- `research/deep-research-config.json` — `status=complete`, `maxIterations=20`, `lineageMode=completed-continue`, `generation=2`
- `research/deep-research-state.jsonl` — 28 lines: 20 iteration records plus generation-1 synthesis events and the generation-2 reopen/convergence events
- `research/deep-research-strategy.md` — Q1-Q18 marked as answered, generation-2 charter documented, reducer-managed sections 7-11 reflect all 20 iterations
- `research/deep-research-dashboard.md` — reducer-refreshed
- `research/findings-registry.json` — reducer-refreshed
- `research/archive/research-v1-iter012-snapshot.md` — immutable snapshot of the pre-generation-2 synthesis

### Memory Artifact

- `research/research.md` — generation-1 findings and the later roadmap are preserved in the canonical synthesis without requiring the archived memory artifact
- `implementation-summary.md` — generation-2 continuation closeout and its quality caveats are preserved in the canonical packet docs rather than in the historical write-only artifact.
- `memory/metadata.json` — current memory save metadata confirms file counts are consistent, but indexing is intentionally skipped for the latest continuation save under the active write-only policy.

---

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Kept the original cli-codex lineage intact, then reopened the packet in completed-continue mode** so the packet could reach 20 total iterations without losing the generation-1 synthesis.
2. **Original charter converged at iter 7** with composite_converged 0.84 and 9 of 10 questions answered. The `synthesis_complete` event was emitted, then user requested 5 more iterations to deepen Q10 specifically. The continuation pivoted from "find new evidence" to "convert evidence into actionable handoff."
3. **First continuation decomposed Q10 into five synthesis passes**: matrix (iter 8), sequencing against Public packets (iter 9), smallest-safe-v1 slicing (iter 10), packet-ready briefs (iter 11), and uncertainty closeout against actual Public source (iter 12).
4. **Generation 2 converted those briefs into packet contracts**: FTS helper scope (iter 13), forced-degrade tests (iter 14), Stop-hook metadata patch (iter 15), normalized analytics reader (iter 16), SessionStart fast path placement (iter 17), verifier/discoverer workflow split (iter 18), portable token contracts (iter 19), and final packet ordering (iter 20).
5. **First follow-on packet remains the FTS capability cascade, narrowed**: generation 2 confirmed the first packet should still be `fts5_bm25 → like_scan` plus typed degrade metadata and tests, with no default `fts4_match` promise.
6. **The analytics path is now fully ordered**: metadata patch before reader, reader before contracts, contracts before presentation.

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- [x] All 18 questions answered (Q1-Q18 across both generations)
- [x] 162 reducer-tracked key findings and 20 iteration artifacts
- [x] 9-track adoption decision matrix in `research/research.md` §13 + §18.1
- [x] Two packet-ready briefs (Brief A FTS cascade + Brief B normalized analytics) in `research/research.md` §18.4
- [x] Execution-ready implementation roadmap in `research/research.md` §19
- [x] Cross-phase boundary with sibling phase `001-claude-optimization-settings` explicitly bounded
- [x] Memory state reviewed honestly: the indexed generation-1 artifact remains available, and the generation-2 continuation artifact is preserved with its current write-only indexing constraint documented
- [x] All trigger phrases are semantic (no path fragments)
- [x] `validate.sh --strict` rerun after continuation sync
- [x] Spec docs (spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md, decision-record.md) present and consistent
- [x] No edits made under `external/`
- [x] Reducer maintained findings-registry.json, dashboard, and machine-owned strategy sections in sync

---

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- **Reducer and analyst sections collide**: The reducer treats sections 7-11 of strategy.md as machine-owned, but it sometimes also wipes the analyst-owned sections 3 (KEY QUESTIONS) and 6 (ANSWERED QUESTIONS) when JSONL records use abbreviated question texts. Workaround: re-add Q1-Q18 summaries after each reducer run.
- **Continuation iterations were intentionally sequential**: both continuations were dependency chains rather than independent module sweeps, so parallelism would mostly have created merge work or duplicate synthesis.
- **`fts4_match` lane is gated on schema work**: The Brief A v1 was narrowed to `fts5_bm25 → like_scan` because Public still provisions only `memory_fts USING fts5` (`mcp_server/lib/search/vector-index-schema.ts:2382-2412`). Restoring an `fts4_match` lane requires alternate FTS4 schema creation in the same packet.
- **Brief B entry conditions are not yet met**: `024/003` does not persist `transcript_path` into `HookState`, leaves `speckitSessionId` empty, drops parsed cache token fields, and emits only session-level `lastTranscriptOffset` (not turn-level offsets). The normalized analytics packet must add a bounded producer metadata patch first.
- **Memory file rebuilt after thin saves archived**: Two prior memory saves (06-04-26_17-13 and 06-04-26_19-41) were created with thin input data and were auto-classified as IN_PROGRESS / 25-95% / Phase PLANNING because the script's session-status logic interpreted unprefixed nextSteps as pending work. Both files were moved to `memory/.archive-pre-quality-rebuild/` and a new memory was saved via `generate-context.js` with rich JSON (10 keyDecisions, 17 filesModified, 12 toolCalls, 4 exchanges, preflight + postflight scores). The canonical research and implementation-summary docs now capture the complete 12-iteration session, its quality-review fixes, and the later 20-iteration extension without requiring the legacy memory artifact path.
- **Latest continuation capture remains advisory only**: the 20-iteration extension is documented in `research/research.md` and this implementation summary, while the historical write-only artifact is no longer required for packet integrity.


<!-- /ANCHOR:limitations -->
