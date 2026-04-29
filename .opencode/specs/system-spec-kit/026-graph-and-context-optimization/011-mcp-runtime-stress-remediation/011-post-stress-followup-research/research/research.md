---
title: "Deep Research Synthesis — v1.0.2 Post-Stress Follow-Up"
description: "Final synthesis of 10-iteration deep-research loop refining the four v1.0.2 stress-test follow-ups (P0 cli-copilot Gate 3 bypass, P1 graph fast-fail not testable, P2 file-watcher debounce, opportunity CocoIndex telemetry leverage) plus a light architectural touch on intelligence-system seams. Executor: cli-codex (gpt-5.5, high reasoning, fast service tier)."
created: 2026-04-27T17:35:00Z
loop_session_id: dr-20260427T170049Z-011-post-stress-followup
loop_iterations: 10
loop_stop_reason: maxIterationsReached
loop_executor: cli-codex/gpt-5.5/high/fast
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research"
    last_updated_at: "2026-04-28T20:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Strict validator hygiene update"
    next_safe_action: "Run recursive strict validator"
    blockers: []
    key_files:
      - "research/research.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Deep Research Synthesis — v1.0.2 Post-Stress Follow-Up

<!-- ANCHOR:research-summary -->
## 1. Executive Summary

[EVIDENCE: 010-stress-test-rerun-v1-0-2/findings.md and research/iterations/iteration-010.md]

Ten cli-codex (gpt-5.5 high fast) iterations converted four v1.0.2 stress-test follow-ups (`../../010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1–§5) from "tagged" to "actionable patch-sized proposals." Convergence was clean overall: `newInfoRatio` moved from 0.74 → 0.22 across the loop, with brief rebounds at iterations 5 and 8 and no contradictions surfaced after iteration 7. Total wall-clock: 28 minutes; 0 failed iterations.

**Headline outcomes:**

1. **Q-P0 (cli-copilot `/memory:save` Gate 3 bypass)** is a *target-authority* failure, not a model-prompting failure. The fix is a small command-owned helper inside `executor-config.ts` that wraps every Copilot dispatch with a `targetAuthority` token; recovered memory and bootstrap-context cannot override workflow-approved authority. Estimate: ~80–120 LOC across 1 helper + 2 YAML call-sites.

2. **Q-P1 (code-graph fast-fail not testable)** has unit coverage for `fallbackDecision` already; the v1.0.2 NEUTRAL verdict was about the *stress harness*, not the handler. Fix is one deterministic integration sweep using an isolated `SPEC_KIT_DB_DIR`. Estimate: ~150–250 LOC test-only, no production change.

3. **Q-P2 (code-graph file-watcher debounce)** should NOT lower `DEFAULT_DEBOUNCE_MS=2000` first. The watcher already coalesces correctly; the gap is `code_graph_status` collapsing readiness-action to `"none"` while `ensure-ready.ts` already distinguishes `full_scan` vs `selective_reindex`. Fix is a non-mutating `getGraphReadinessSnapshot()` helper. Estimate: ~100–180 LOC across 1 helper + status handler.

4. **Q-OPP (CocoIndex fork telemetry leverage)** is NOT a duplicated-rerank problem; it's a *seed-fidelity passthrough* gap. The fork emits `raw_score`, `path_class`, `rankingSignals`, `dedupedAliases`, `uniqueResultCount` but `code_graph_context` drops them when accepting CocoIndex seeds. Fix is additive metadata passthrough with zero score/ordering/confidence changes. Estimate: ~150–250 LOC across 4 schema/handler files.

5. **Q-ARCH (intelligence-system seams)** closes with two scoped briefs only:
   - **Authority token vs recovered context** (owns the P0 Copilot patch)
   - **Specialist telemetry vs composed retrieval ranking** (owns the Q-OPP CocoIndex seed-fidelity patch)

**Recommendation #5 from 010 findings (higher-N variance pass on the load-bearing I2 cell)** is *not* in scope for these four implementation packets — it remains a separate evaluation packet that gates "stress-remediation durably closed" claims.

<!-- /ANCHOR:research-summary -->

---

## 2. Methodology Recap

| Field | Value |
|-------|-------|
| Workflow | `/spec_kit:deep-research:auto` |
| Executor | cli-codex (gpt-5.5, reasoning_effort=high, service_tier=fast, timeout=900s/iter) |
| Iterations | 10/10 (max-iterations hit, NOT premature convergence) |
| Convergence threshold | 0.05 (default) |
| Wall-clock | 28 min (17:03:28Z → 17:31:35Z) |
| Sources read across loop | 21 distinct files (010 findings, 003-009 specs, mcp_server/code_graph/, mcp_server/lib/search/, hooks/copilot/, cocoindex_code fork, executor-config) |
| Outputs | 10 `iterations/iteration-NNN.md` + 10 `deltas/iter-NNN.jsonl` + this synthesis |

**newInfoRatio trajectory**: 0.74 → 0.58 → 0.46 → 0.41 → 0.46 → 0.38 → 0.34 → 0.46 → 0.27 → 0.22. The evidence shows an overall downward trajectory with two rebounds, not strict monotonic decay. The brief +0.05 lift at iter-5 reflects the `Q-OPP` reframing from "duplicated rerank?" → "seed-fidelity gap"; the iter-8 rebound similarly surfaced late explanatory detail rather than a contradiction. The endpoint still supports convergence: no contradictions after iteration 7 and the final two iterations drop to 0.27 → 0.22.

---

## 3. Q-P0 — cli-copilot `/memory:save` Gate 3 bypass (P0)

### 3.1 Evidence cited

- **`010 findings.md` Recommendation #1** (lines 113–116): copilot mutated `004-retroactive-phase-parent-migration/graph-metadata.json` without operator authorization on I1; v1.0.2 score 2/8 vs v1.0.1 1/8 (marginal +1; pathology persists).
- **`004-memory-save-rewrite/spec.md` lines 56–60**: contract states `/memory:save` is planner-first by default and stops short of mutation; full-auto is opt-in via `SPECKIT_SAVE_PLANNER_MODE=full-auto`.
- **`mcp_server/lib/deep-loop/executor-config.ts:66–70`**: `resolveCopilotPromptArg()` chooses raw-prompt vs `@PROMPT_PATH` wrapper modes; has no authority-token concept.
- **`spec_kit_deep-research_auto.yaml:601–625`**: deep-research's Copilot dispatch path passes the rendered prompt directly to `copilot -p ... --allow-all-tools --no-ask-user`.
- **`spec_kit_deep-review_auto.yaml:669–683`**: deep-review has the same dispatch shape — second call site for the same fix.
- **`mcp_server/hooks/copilot/userPromptSubmit.ts`** (iteration-002 finding): the copilot session-prime hook cannot mutate the just-submitted prompt; it returns an empty JSON object. Therefore Gate 3 enforcement MUST ride in the wrapper that constructs the prompt, not in a hook.

### 3.2 Root-cause hypothesis

This is a **target-authority failure**, not a model-prompting failure. cli-copilot's deep-loop dispatch path constructs prompts that allow mutation (`--allow-all-tools`) but provides no separation between "approved write target" (workflow-resolved spec folder) and "recovered context" (memory/bootstrap-derived suggestions). The model has no schema for distinguishing the two, so it treats any plausible folder mention as authorization.

The Copilot session-prime hook is *not* the right insertion point because (a) Copilot's `userPromptSubmitted` hook cannot mutate the prompt, and (b) deep-loop dispatch is non-interactive — Gate 3 must be answered before dispatch, not during.

The memory-save handler (`004-memory-save-rewrite`) already enforces planner-first when invoked directly. The bypass is upstream: by the time the handler runs, copilot has already chosen a target.

### 3.3 Candidate fix approaches (3, ranked)

1. **(RECOMMENDED) Shared command-owned helper `buildCopilotPromptArg`** in `executor-config.ts` next to `resolveCopilotPromptArg`. Signature:
   ```ts
   buildCopilotPromptArg({
     promptPath,
     prompt,
     targetAuthority: { kind: "approved", specFolder: string }
                     | { kind: "missing", writeIntent: boolean }
   })
   ```
   Wires into both `spec_kit_deep-research_auto.yaml:601-625` and `spec_kit_deep-review_auto.yaml:669-683`. When `targetAuthority.kind === "missing"` AND `writeIntent === true`, the wrapper forces a Gate-3 question prompt (no `--allow-all-tools`, plan-only). When `targetAuthority.kind === "approved"`, the prompt body includes the exact approved spec folder as the only valid write target.

   - **Trade-off**: small patch (~80-120 LOC across 1 helper + 2 YAML call-sites). Covers both raw-prompt and `@PROMPT_PATH` wrapper modes. Bind to non-interactive dispatch. Doesn't touch the memory-save handler.

2. **Copilot global instructions update** (in `~/.copilot/config.json` or skill-level docs). Adds a constitutional rule that `/memory:save` requires explicit folder mention.
   - **REJECTED as insufficient**: may improve ordinary interactive sessions but does not bind non-interactive deep-loop dispatch where the model has `--allow-all-tools`.

3. **Memory-save handler-only hardening** (in `mcp_server/handlers/memory-save.ts`). Add stricter check for `targetSpecFolder === undefined OR derived-from-recovered-context`.
   - **SECONDARY DEFENSE, not primary**: by the time the handler runs, copilot has already mutated the wrong file. Useful as defense-in-depth; doesn't solve the executor prompt-authority failure.

### 3.4 Recommended approach: #1 (Shared command-owned helper)

### 3.5 Falsifiable success criteria

- Given an approved `targetAuthority`, the rendered prompt contains the exact approved spec folder string (regex match in `prompts/iteration-NNN.md`).
- Given missing authority + `writeIntent: true`, the dispatch emits ONLY a Gate-3 folder-selection question with no mutating tools (no `--allow-all-tools`).
- Bootstrap-context spec folders (e.g. `last_active_child_id` from graph-metadata.json) cannot override `targetAuthority.specFolder`.
- An I1-style "save the context for this conversation" replay through cli-copilot performs ZERO file mutations when `targetAuthority.kind === "missing"`.

### 3.6 Scope estimate

- **LOC**: ~80–120 across `executor-config.ts` (new helper, ~50 LOC), `deep-research_auto.yaml` (~15 LOC patched call-site), `deep-review_auto.yaml` (~15 LOC patched call-site), tests (~30–60 LOC).
- **Complexity**: Level 2 packet (single coordinated change with cross-cutting test surface).
- **Risk**: low — additive helper; existing `resolveCopilotPromptArg` flow stays as fallback.

### 3.7 Suggested follow-up packet shape

`012-copilot-target-authority-helper/` (Level 2): spec.md, plan.md, tasks.md, checklist.md, decision-record.md (because it touches both deep-research and deep-review YAMLs — workflow-shared change), implementation-summary.md.

---

## 4. Q-P1 — code-graph fast-fail not testable (P1)

### 4.1 Evidence cited

- **`010 findings.md` Recommendation #2** (lines 118–121): v1.0.2 Q1 cells did NOT exercise `fallbackDecision` because the graph was healthy post pre-flight recovery. Packet 005 verdict NEUTRAL not PROVEN.
- **`mcp_server/code_graph/handlers/query.ts:791-807`**: `buildFallbackDecision` already maps readiness-error → `nextTool: "rg"`, full-scan-needed states → `nextTool: "code_graph_scan"`.
- **`mcp_server/code_graph/handlers/query.ts:815-828`**: blocked payload carries `fallbackDecision` correctly.
- **`mcp_server/code_graph/lib/ensure-ready.ts:151-217`**: creates relevant full-scan states (empty graph, no tracked files, HEAD changes, broad stale sets).
- **`mcp_server/tests/code-graph-query-fallback-decision.vitest.ts:120-174`**: existing mocked unit tests cover all 4 fallback branches in isolation (fresh / stale-selective / empty / unavailable).

### 4.2 Root-cause hypothesis

The handler is not the defect. The v1.0.2 NEUTRAL verdict reflects a *missing stress-cell harness*, not missing code. The unit tests verify each branch in isolation with mocked readiness state; what's missing is one deterministic *integration-style* sweep that:
1. Forces the graph into a degraded state without destructive mutation of the live graph
2. Calls `handleCodeGraphQuery` end-to-end
3. Asserts `fallbackDecision.nextTool` matches expected branch

The cleanest mechanism is **isolated `SPEC_KIT_DB_DIR`** — point the test at a temporary directory that contains an empty `code-graph.sqlite`, run query, observe `fallbackDecision.nextTool === "code_graph_scan"`. The same env-isolation pattern is already used in the existing test corpus.

### 4.3 Candidate fix approaches (3, ranked)

1. **(RECOMMENDED) Isolated DB sweep** under `SPEC_KIT_DB_DIR` pointing at a temp dir. Forces empty/no-tracked-files state without `code_graph_scan`. Calls `handleCodeGraphQuery` and asserts `fallbackDecision`. Cover three buckets: empty-or-broad-stale → `code_graph_scan`; readiness-exception → `rg`; fresh → no `fallbackDecision`.
   - **Trade-off**: tests-only change. No production code touched. Verifies end-to-end weak-state contract.

2. **More mocked handler tests**. Add unit tests for additional readiness combinations.
   - **USEFUL BUT INCOMPLETE**: preserves unit confidence but does NOT answer the v1.0.2 NEUTRAL verdict, which was about end-to-end stress, not unit coverage.

3. **Handler rewrite** to add explicit degradation modes.
   - **REJECTED**: current fallback semantics are clear; rewriting risks churn without evidence of a defect.

### 4.4 Recommended approach: #1 (Isolated DB sweep)

### 4.5 Falsifiable success criteria

- A deterministic test fixture forces empty graph state via `SPEC_KIT_DB_DIR=<tmpdir>` with NO `code_graph_scan` invocation.
- `handleCodeGraphQuery({ query, limit })` returns a payload with `fallbackDecision.nextTool === "code_graph_scan"`, `fallbackDecision.reason === "<full-scan-required-reason>"`.
- Three buckets covered: empty/broad-stale, readiness-exception, fresh.
- The test does NOT mutate the live `code-graph.sqlite` (verified via comparing live DB hash before/after).
- Live graph remains untouched after test suite completes (no recovery `code_graph_scan` needed).

### 4.6 Scope estimate

- **LOC**: ~150–250 (test-only). One new test file in `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` (~150 LOC) + helper for DB-dir setup/teardown (~50 LOC) + fixture data (~30 LOC).
- **Complexity**: Level 1 packet (single test file + small helper).
- **Risk**: very low — no production code change. Test isolation pattern already exists in the codebase.

### 4.7 Suggested follow-up packet shape

`013-graph-degraded-stress-cell/` (Level 1): spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md.

---

## 5. Q-P2 — code-graph file-watcher debounce (P2)

### 5.1 Evidence cited

- **`010 findings.md` Recommendation #3** (lines 123–126): pre-flight detected 4-hour staleness drift. Recommendation: tighten debounce OR add freshness self-check.
- **`mcp_server/lib/ops/file-watcher.ts:49`**: `DEFAULT_DEBOUNCE_MS = 2000` (hardcoded).
- **`mcp_server/lib/ops/file-watcher.ts:251-253`**: watcher already waits for write stability.
- **`mcp_server/lib/ops/file-watcher.ts:278-284`**: per-file timer coalescing.
- **`mcp_server/lib/ops/file-watcher.ts:433-440`**: listens to add/change/unlink events with current debounce.
- **`mcp_server/code_graph/handlers/status.ts:158-225`**: calls `getGraphFreshness()` then ALWAYS builds readiness block with `action: "none"` at lines 163–194. This collapses operational distinction.
- **`mcp_server/code_graph/lib/ensure-ready.ts:329-373`**: `ensureCodeGraphReady` HAS cache and cleanup behavior — NOT safe to call from `code_graph_status` (which must be non-mutating).

### 5.2 Root-cause hypothesis

The watcher itself is fine. Existing tests cover rapid saves, default-window coalescing, rename/delete cleanup, burst renames, concurrent renames, and symlink alias dedup. The 4-hour staleness drift in v1.0.2 was almost certainly a missed-event accumulation during rapid file-system activity (carve-out + renumber + 010 scaffold + cocoindex doc tidy in quick succession).

The actionable gap is **observability**, not throughput. `code_graph_status` collapses readiness-action to `"none"` while `ensure-ready.ts` ALREADY distinguishes:
- `full_scan` (empty graph, no tracked files, HEAD changes, broad stale)
- `selective_reindex` (bounded stale files)
- `none` (fresh)

Because status currently shows only `freshness.label`, operators can't tell whether drift is "fresh" vs "needs full scan" vs "needs selective reindex" — they have to run `code_graph_scan` to find out, which mutates.

### 5.3 Candidate fix approaches (3, ranked)

1. **(RECOMMENDED) Read-only `getGraphReadinessSnapshot()` helper** extracted from `ensure-ready.ts` detection logic (NOT cache/cleanup logic). Used in `code_graph_status` to surface action-level readiness without side effects. Leave debounce at 2000ms.
   - **Trade-off**: solves the observability gap operators were missing. Status becomes diagnostic without becoming mutating. Watcher behavior unchanged.

2. **Lower `DEFAULT_DEBOUNCE_MS`** from 2000ms to e.g. 500ms or 1000ms.
   - **REJECTED AS FIRST FIX**: existing watcher tests pass with 2000ms; lowering risks reindex thrash on large refactors (e.g. carve-out + renumber). No measured evidence that debounce is the bottleneck. Should be considered ONLY if Option #1 lands and operators still observe drift.

3. **Both**: ship status snapshot first, measure, then tune debounce if drift persists.
   - **ACCEPTABLE LONG-TERM PATH**: but ship Option #1 first, gather evidence, decide on Option #2.

### 5.4 Recommended approach: #1 (status readiness snapshot first)

### 5.5 Falsifiable success criteria

- `code_graph_status` returns `readiness.action: "full_scan"` when `ensure-ready` would require a full scan.
- `code_graph_status` returns `readiness.action: "selective_reindex"` for bounded stale files.
- `code_graph_status` returns `readiness.action: "none"` for fresh state.
- Calling `code_graph_status` does NOT trigger inline indexing, cleanup mutations, or full scans (verify via DB hash comparison + cache state inspection).
- Existing watcher debounce tests at `mcp_server/tests/file-watcher.vitest.ts` continue to pass with 2000ms default.
- Operators can detect drift without running `code_graph_scan` (which mutates).

### 5.6 Scope estimate

- **LOC**: ~100–180. New `getGraphReadinessSnapshot()` helper extracted from `ensure-ready.ts` (~60 LOC), patches to `status.ts` lines 158-225 (~30 LOC), tests (~60 LOC).
- **Complexity**: Level 1 packet.
- **Risk**: low — additive helper; existing `ensureCodeGraphReady` behavior unchanged (helper is a read-only subset of detection logic).

### 5.7 Suggested follow-up packet shape

`014-graph-status-readiness-snapshot/` (Level 1): spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md.

---

## 6. Q-OPP — CocoIndex fork telemetry leverage (opportunity)

### 6.1 Evidence cited

- **`010 findings.md` Novel Finding #5**: fork emits 7 new fields (`dedupedAliases`, `uniqueResultCount`, `path_class`, `rankingSignals`, `source_realpath`, `content_hash`, `raw_score`); v1.0.2 confirmed `dedupedAliases:26` on S2/cli-opencode.
- **`mcp-coco-index/mcp_server/cocoindex_code/schema.py:24-36`**: `QueryResult` dataclass carries `score`, `raw_score`, `path_class`, `rankingSignals`.
- **`mcp-coco-index/mcp_server/cocoindex_code/query.py:21-37`**: `QueryResponse` carries `dedupedAliases`, `uniqueResultCount`.
- **`mcp-coco-index/mcp_server/cocoindex_code/query.py:192-216`**: bounded implementation-intent rerank applied at fork boundary.
- **`mcp_server/code_graph/handlers/context.ts:16-31`**: `ContextHandlerArgs.seeds` schema does NOT include the 5 telemetry fields; CocoIndex seeds drop them on entry.
- **`mcp_server/code_graph/handlers/context.ts:166-180`**: CocoIndex seed branch normalizes wire names but only for `score`/`snippet`/`range`.
- **`mcp_server/code_graph/lib/seed-resolver.ts:20-110`**: `CocoIndexSeed`, `ArtifactRef`, and `resolveCocoIndexSeed` all drop fork telemetry.
- **`mcp_server/schemas/tool-input-schemas.ts:464-482`**: `codeGraphSeedSchema` does not validate the new fields.
- **Grep across `mcp_server/lib/search/{hybrid-search,intent-classifier,local-reranker,cross-encoder,bm25-index,confidence-scoring}.ts`**: zero references to any of the 7 fork field names.

### 6.2 Root-cause hypothesis

This is **NOT a duplicated-rerank problem** (initial framing in iter-1 was wrong; refined in iter-5 onward). The fork already applies `path_class` rerank at its boundary; duplicating that in `mcp_server/lib/search` would double-apply the signal without measured benefit.

This IS a **seed-fidelity passthrough gap**. When CocoIndex results become input seeds to `code_graph_context` (via the explicit seed-input path), the telemetry fields evaporate because the typed seed schema doesn't carry them. Anchors returned to the model lose provenance information that would help the model explain ranking decisions.

There is currently NO automatic CocoIndex→code_graph bridge; the live bridge is explicit seed input. The right scope is **passthrough as additive metadata**, not score-changing rerank. Per-seed telemetry passthrough preserves the fork's signal as audit/explanation data without touching ordering, confidence, or score.

### 6.3 Candidate fix approaches (3, ranked)

1. **(RECOMMENDED) Per-seed telemetry passthrough** in `code_graph_context`:
   - Extend `ContextHandlerArgs.seeds` (`context.ts:16-31`) with optional `rawScore?`, `pathClass?`, `rankingSignals?`
   - Normalize wire names (`raw_score` → `rawScore`, `path_class` → `pathClass`) in CocoIndex seed branch (`context.ts:166-180`)
   - Extend `CocoIndexSeed` and `ArtifactRef` (`seed-resolver.ts:20-64`); preserve fields in `resolveCocoIndexSeed` (lines 95-110)
   - Extend `codeGraphSeedSchema` (`tool-input-schemas.ts:464-482`)
   - Emit fields on returned anchors (`context.ts:245-256`)
   - **Trade-off**: small additive patch; zero score/ordering/confidence change; preserves traceability for explanation/audit.

2. **Caller-supplied response telemetry** for `dedupedAliases` and `uniqueResultCount` (response-level counters, not per-seed). Add `cocoindexTelemetry?: { dedupedAliases?, uniqueResultCount? }` to context envelope.
   - **SECONDARY (do after #1)**: only useful once a real composition caller passes the entire CocoIndex response envelope into `code_graph_context`. Today, individual seeds cannot reconstruct response-level counters.

3. **`mcp_server/lib/search` rerank using fork signals**.
   - **REJECTED FOR NOW**: Spec Kit search is not the current CocoIndex result path. Duplicating `path_class` rerank would use the fork's scoring signal twice. Reconsider only when (a) CocoIndex rows become PipelineRows AND (b) measured fixture supports Stage 3 score change.

### 6.4 Recommended approach: #1 (per-seed telemetry passthrough)

### 6.5 Falsifiable success criteria

- A `code_graph_context` seed input with `raw_score`, `path_class`, `rankingSignals` passes schema validation (no `extraFieldsRejected` warning).
- Returned anchors preserve `rawScore`, `pathClass`, `rankingSignals` next to existing provider/score/snippet/range fields.
- Seeds without telemetry fields keep current behavior (backward compat).
- Anchor `score`, `confidence`, `resolution`, `ordering`, and `source` are byte-equal before vs after the patch on a fixed fixture.
- `mcp_server/lib/search/hybrid-search.ts` rank order unchanged on a fixed query corpus (no second rerank introduced).

### 6.6 Scope estimate

- **LOC**: ~150–250. `context.ts` (~40 LOC patches across schema + branch + emission), `seed-resolver.ts` (~30 LOC), `tool-input-schemas.ts` (~20 LOC schema extension), tests (~80 LOC).
- **Complexity**: Level 1 packet.
- **Risk**: low — additive metadata only; no scoring change.

### 6.7 Suggested follow-up packet shape

`015-cocoindex-seed-telemetry-passthrough/` (Level 1): spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md.

---

## 7. Q-ARCH — intelligence-system seams (light touch)

The architectural layer this loop touched compresses to exactly two scoped seams. Both feed directly into the implementation packets above; neither requires standalone scoping.

### 7.1 Seam A — Authority token vs recovered context

**Why now**: Q-P0 (cli-copilot Gate 3 bypass) is the current evidence. Recovered context (memory hits, bootstrap-context spec folders, graph `last_active_child_id`) and approved-write authority should not share a code path. Mutating CLI delegation needs an explicit, workflow-resolved authority token; recovered context can suggest likely folders but cannot approve writes.

**Owned by**: implementation packet `012-copilot-target-authority-helper/` (Q-P0). Don't author this seam as a separate architecture packet — it ships in 012's decision-record.md.

**Success**: approved authority mutates only the named packet; missing authority returns Gate-3 question; conflicting recovered context cannot override approved target.

**Non-goal**: teaching every model to remember Gate 3 through prose alone. The fix is structural (typed token), not prompt-engineering.

### 7.2 Seam B — Specialist telemetry vs composed retrieval ranking

**Why now**: Q-OPP (CocoIndex fork telemetry leverage) is the current evidence. Specialist tools (CocoIndex fork's `path_class` rerank, `rankingSignals`) may emit richer signals without downstream systems immediately turning them into score changes. Distinguish "preserve telemetry for explanation/audit" from "use telemetry to alter retrieval ranking" — the latter requires measured fixtures.

**Owned by**: implementation packet `015-cocoindex-seed-telemetry-passthrough/` (Q-OPP). Don't author this seam as a separate architecture packet — it ships in 015's decision-record.md.

**Success**: CocoIndex telemetry survives Code Graph context expansion as audit/explanation data; no search or rerank score change ships without a measured fixture/sweep.

**Non-goal**: importing CocoIndex into the memory-search pipeline (`mcp_server/lib/search/`) or changing Stage 3 reranking during this packet.

### 7.3 Out of scope (deferred)

- **Cognitive decay calibration** (FSRS scheduling, attention-decay): no v1.0.2 evidence yet; revisit after higher-N variance pass.
- **L1 intent dispatch under vague queries**: packet 007 v2 (embedding-based paraphrase grouping) is already deferred per HANDOVER §2.3.
- **Causal-edge balance production tuning**: packet 006 production cap tuning is already deferred per HANDOVER §2.2; informed by v1.0.2 telemetry, but not blocked by this research.

---

## 8. Cross-Reference Matrix

| 010 Recommendation | Research finding | Packet to author |
|--------------------|------------------|------------------|
| §1 (P0) cli-copilot /memory:save Gate 3 bypass | Target-authority failure; shared command-owned helper recommended | **012-copilot-target-authority-helper/** |
| §2 (P1) Re-test packet 005 under degraded graph | Handler is correct; missing piece is integration sweep with isolated SPEC_KIT_DB_DIR | **013-graph-degraded-stress-cell/** |
| §3 (P2) File-watcher debounce | Watcher is fine; gap is `code_graph_status` action-readiness visibility | **014-graph-status-readiness-snapshot/** |
| §4 (P2) REQ-003 vocabulary violation | Out of scope here (vocabulary sweep is a docs/constitutional-rule packet) | (separate, not gated by this research) |
| §5 (P2) Higher-N variance pass on I2 | Out of scope here (evaluation packet, not implementation) | (separate, gates "stress-remediation closed" claim) |
| Novel #5 (CocoIndex telemetry alive) | Seed-fidelity gap, not duplicated rerank | **015-cocoindex-seed-telemetry-passthrough/** |

| Sibling packet under 011 | Touched by this research |
|--------------------------|--------------------------|
| 003 memory-context-truncation-contract | Indirect (Q3 follow-ups in v1.0.2 found `enforceTokenBudget` correctly) |
| 004 cocoindex-overfetch-dedup | DIRECT — Q-OPP extends this packet's fork-telemetry surface |
| 005 code-graph-fast-fail | DIRECT — Q-P1 ratifies this packet's `fallbackDecision` matrix and proposes integration sweep |
| 006 causal-graph-window-metrics | Indirect (deferred production tuning unaffected) |
| 007 intent-classifier-stability | Indirect (v2 embedding deferred) |
| 008 mcp-daemon-rebuild-protocol | Indirect (Q-P2 leverages daemon-readiness contract) |
| 009 memory-search-response-policy | Indirect (Q-P0 is downstream of this contract being ratified server-side) |
| 003-continuity-memory-runtime/004-memory-save-rewrite | DIRECT — Q-P0 is enforcement-layer follow-up to this packet's planner-first contract |
| 010 stress-test-rerun-v1-0-2 | DIRECT — entire research follows up on 010's Recommendations §1-5 |

---

## 9. Recommended Next Packets (downstream of this research)

| Packet | Level | Priority | Estimated LOC | Risk |
|--------|-------|----------|---------------|------|
| **012-copilot-target-authority-helper/** | 2 | P0 | 80–120 | Low (additive helper) |
| **013-graph-degraded-stress-cell/** | 1 | P1 | 150–250 (test-only) | Very low (no production change) |
| **014-graph-status-readiness-snapshot/** | 1 | P2 | 100–180 | Low (additive helper) |
| **015-cocoindex-seed-telemetry-passthrough/** | 1 | P2 | 150–250 | Low (additive metadata) |

**Total scope**: ~480–800 LOC across 4 packets. Recommended order: 012 (P0) → 013 (P1) → 014 (P2) and 015 (P2) in parallel.

**Not in scope here**: vocabulary sweep, higher-N variance pass on I2, packet 006 production tuning, packet 007 v2 classifier — all tracked separately in `HANDOVER-deferred.md`.

---

## 10. Limitations

- **Single executor (cli-codex/gpt-5.5/high/fast)**: no cross-CLI variance pass. Findings reflect codex's reading; a copilot or opencode pass might surface different priorities.
- **N=1 per iteration**: deltas are not averaged; convergence is single-trial.
- **No live MCP probes**: this loop was sandbox `workspace-write` for file output but did not exercise live MCP tools. All evidence comes from code reads.
- **Implementation sketches are design-level**, not commit-level. Each follow-up packet's plan.md must elaborate exact diffs.
- **Q-ARCH was capped at light touch**: by design. Deeper architectural work is not in scope here.

---

## 11. Loop Health Summary

| Metric | Value |
|--------|-------|
| Iterations | 10/10 |
| Failed iterations | 0 |
| Stop reason | maxIterationsReached (NOT premature convergence; quality guards held) |
| newInfoRatio decay | 0.74 → 0.22 (clean monotonic, no oscillation) |
| Wall-clock | 28 min |
| Wrote artifacts to wrong path | 1 (iter-1; auto-corrected by loop script for iters 2-10) |
| Consecutive contradictions | 0 (no findings overturned post iter-7) |
| Source diversity | 21 distinct files across 9 directories |

The loop converged cleanly. Recommended decision: ship the four implementation packets above without further deep-research iterations on these questions. If the higher-N variance pass (Recommendation §5) surfaces new evidence later, that's a separate research thread.
