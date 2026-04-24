# Interim Synthesis — Phase 016 Foundational Runtime Deep Review

**As of: iteration 47** (Domain 3 complete at 10/10; Domain 4 in progress at 7/10; Domain 5 not yet started)
**Author:** synthesis agent (read-only analysis)
**Source snapshot:** `iteration-001.md` through `iteration-047.md`
**Prior snapshot:** `interim-synthesis-44-iterations.md` (iterations 1-44; Domain 3 complete, Domain 4 4/10)
**Domain coverage:**
- **Foundational (1-10):** session-lifecycle / hook-state / code-graph / post-insert / shared-payload / compact-cache seam exploration
- **Domain 1 (11-20):** Silent Fail-Open Patterns — complete
- **Domain 2 (21-30):** State Contract Honesty — complete
- **Domain 3 (31-40):** Concurrency and Write Coordination — **complete** (10/10)
- **Domain 4 (41-47):** Stringly-Typed Governance — **in progress** (7/10, iterations 41-47)
- **Domain 5:** Test Coverage Gaps — not yet started as a dedicated domain (subsidiary evidence in nearly every iteration)

---

## Section 1 — Finding Inventory

### 1.1 Raw Counts

| Metric                                                    | Count (44-iter snapshot) | Count (47-iter snapshot) | Delta |
| --------------------------------------------------------- | ------------------------ | ------------------------ | ----- |
| Iterations read                                           | 44                       | 47                       | +3    |
| Total numbered findings emitted (raw, incl. cross-domain) | 105                      | 118                      | +13   |
| P0 findings (interaction-effect escalations)              | 0 (4 candidates)         | 0 (4 candidates)         | —     |
| P1 findings (raw)                                         | 58                       | 63                       | +5    |
| P2 findings (raw)                                         | 47                       | 55                       | +8    |
| Unique file surfaces flagged                              | 27                       | 35                       | +8    |
| Distinct anti-patterns (cross-cutting)                    | 10                       | 10                       | —     |

After deduplication the full set compresses to approximately **59 distinct issues** across 35 files
(prior: ~51 distinct issues across 27 files).

---

### 1.2 Findings Per Source File (deduped, cumulative through iteration 47)

| File (abbreviated path, all under `.opencode/` unless noted) | Raw hits | Distinct issues | Dominant domains |
| ------------------------------------------------------------- | -------- | --------------- | ---------------- |
| `skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | 22     | 10              | D1, D2, D3       |
| `skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | 18       | 8               | D2, D3           |
| `skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` | 16 | 8       | D1, D3           |
| `skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` | 14      | 6               | D1, D2           |
| `skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` | 11      | 6               | D1, D2           |
| `skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | 7  | 4               | D1, D2, D3       |
| `skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts` | 5     | 3               | D3               |
| `skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | 3      | 2               | D2               |
| `skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` | 3    | 1 (dedup)       | Foundational     |
| `skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts` | 2     | 2               | Foundational     |
| `skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` / `session-resume.ts` / `session-health.ts` | 4 | 3 | D2 |
| `skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts` | 2  | 2               | D2               |
| `skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | 1       | 1               | D2               |
| `skill/system-spec-kit/mcp_server/handlers/memory-save.ts` / `save/response-builder.ts` | 2 | 2 | D2 |
| `skill/system-spec-kit/mcp_server/hooks/claude/shared.ts` / `hooks/gemini/session-prime.ts` | 2 | 2 | Foundational |
| `skill/system-spec-kit/mcp_server/scripts/loaders/data-loader.ts` + command YAMLs | 4 | 2        | D3               |
| `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md`         | 4        | 2               | D3, D4           |
| `command/spec_kit/assets/spec_kit_plan_auto.yaml`             | 6        | 4               | D4               |
| `command/spec_kit/assets/spec_kit_plan_confirm.yaml`          | 4        | 3               | D4               |
| `skill/skill-advisor/scripts/skill_advisor.py`                | 7        | 5               | D4               |
| `skill/skill-advisor/scripts/skill_advisor_runtime.py`        | 4        | 3               | D4               |
| `skill/skill-advisor/scripts/skill_graph_compiler.py`         | 5        | 4               | D4               |
| `skill/skill-advisor/graph-metadata.json`                     | 2        | 2               | D4               |
| `skill/system-spec-kit/mcp_server/tests/manual-playbook-runner.ts` | 4   | 3               | D4               |
| `skill/skill-advisor/tests/test_skill_advisor.py`             | 4        | 3               | D4               |
| `skill/sk-deep-research/SKILL.md` / `skill/system-spec-kit/SKILL.md` | 3  | 2               | D4               |
| `skill/skill-advisor/feature_catalog/04--testing/02-health-check.md` | 1 | 1               | D4               |
| `skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md` [NEW since 44] | 2 | 1 | D4 |
| `skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md` [NEW since 44] | 1 | 1 | D4 |
| `skill/system-spec-kit/references/intake-contract.md` [NEW since 44] | 2 | 2 | D4 |
| `skill/system-spec-kit/SKILL.md` (routing + SKILL.md body) [NEW since 44] | 2 | 1 | D4 |
| `skill/system-spec-kit/README.md` [NEW since 44] | 1 | 1 | D4 |

---

### 1.3 Deduplication Map (cumulative through iteration 47)

Existing dedup clusters from the 44-iteration snapshot are unchanged. New clusters from iterations 45-47:

| Dedup cluster                                                         | Iterations touching it | Canonical finding |
| --------------------------------------------------------------------- | ---------------------- | ----------------- |
| Gate 3 `analyze`/`decompose`/`phase` false-positive for read-only research prompts | R45-001, R47-001 | R45-001 (primary) + R47-001 (concrete examples) |
| `skill_graph_compiler.py` topology warning state is non-durable (warning amnesia) | R45-003 | R45-003 |
| Manual playbook runner silently drops unparseable scenarios before coverage count | R45-004 | R45-004 |
| Skill routing `COMMAND_BRIDGES` prefix collapse: all `/spec_kit:*` subcommands → `command-spec-kit` | R46-001 | R46-001 |
| Unilateral `conflicts_with` silently promoted to bilateral runtime penalty | R46-002 | R46-002 |
| Playbook runner `Function(...)` eval with live runtime-sourced `lastJobId` injection | R46-003 | R46-003 (extends R41-004) |
| `folder_state` / `start_state` two-vocabulary split in `/spec_kit:plan`; top-level docs flatten back to one | R47-002 | R47-002 |

**All prior dedup clusters from the 44-iteration snapshot are preserved unchanged (see §1.3 of `interim-synthesis-44-iterations.md` for the full list).**

---

## Section 2 — Per-Domain Summary

### 2.1 Foundational Seams (iterations 1-10)

*Unchanged from 32-iteration snapshot.*

**Summary:** scope contract split between startup/resume; freshness/readiness asymmetry; trust-vocabulary collapse; compact-cache cross-runtime asymmetry.

---

### 2.2 Domain 1 — Silent Fail-Open Patterns (iterations 11-20, complete)

*Unchanged from 32-iteration snapshot.*

**Summary:** Success-shaped envelopes mask skip/defer/partial/failed outcomes across `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, and `reconsolidation-bridge.ts`. Core anti-pattern: absence reinterpreted as truth; status erasure at response boundary.

---

### 2.3 Domain 2 — State Contract Honesty (iterations 21-30, complete)

*Unchanged from 32-iteration snapshot.*

**Summary:** State laundering, state promotion, regression behavior canonizing degraded contracts, self-contradictory payloads. Core anti-pattern: collapsed producer state hardened into stronger contracts at consumer layers.

---

### 2.4 Domain 3 — Concurrency and Write Coordination (iterations 31-40, complete)

*Full narrative preserved in 41-iteration snapshot (§2.4). Summary only here.*

**Central thesis (confirmed):** The bug class is layered: byte-level races at write time (unlocked `.tmp` swap), snapshot-coherence races at read-then-decide time (stale pre-transaction snapshots driving conflict, merge, complement, assistive, cleanup, and spec-folder targeting decisions), and TOCTOU identity races at cleanup time. Atomic rename prevents torn bytes; it does not protect any decision that was made before the rename and reused afterward.

**Nine confirmed pattern groups:** unlocked RMW on deterministic temp paths; split-brain stop-hook state; reconsolidation pre-transaction snapshot exposure across conflict / complement / assistive paths; TOCTOU identity races (`clearCompactPrime`, `loadMostRecentState`, `cleanStaleStates`); directory-level all-or-nothing scans; success-shaped durability signals; stop-hook autosave outcome silent; stale `currentSpecFolder` preference; shared `/tmp/save-context-data.json` path in runtime error contracts.

---

### 2.5 Domain 4 — Stringly-Typed Governance (iterations 41-47, 7/10 complete)

**Central thesis (sharpened through iteration 47):** Governance is expressed as manually synchronized string tables across docs, YAML assets, Python dictionaries, and markdown playbooks. The failure modes now form three distinct layers:

1. **Invisible discard** — routing signals (graph `intent_signals`, SKILL.md keyword comments) are compiled, loaded, and stored through complete pipeline stages, then silently discarded before the scoring step. The system looks mechanically wired while operating exclusively from hand-maintained Python tables.

2. **String collapse at translation boundaries** — generic prefixes collapse command families (all `/spec_kit:*` → `command-spec-kit`), one-sided metadata collapses into bilateral runtime penalties (`conflicts_with`), and markdown strings collapse into executable JavaScript after runtime value substitution (`Function(...)` + `lastJobId`).

3. **Scope bleed in governance vocabulary** — the same English token (`phase`, `folder_state`) is reused across edit setup, lifecycle narration, and read-only validation prompts, so a prose classifier cannot cleanly separate them. The two-layer state machine in `/spec_kit:plan` (`folder_state` local classifier → `start_state` canonical classifier) is collapsed back to a single string in top-level docs, hiding the distinction from downstream consumers.

**Key patterns discovered through iteration 47:**

*(Patterns 1-9 from the 44-iteration snapshot are unchanged and reproduced for completeness.)*

1. **Intake-state vocabulary split** (R41-001 / P2). The autonomous plan workflow uses `populated` as the "skip intake" state; the canonical intake contract defines the same state as `populated-folder`.

2. **Gate 3 trigger list as prose contract** (R41-002 / P2). `AGENTS.md` governs Gate 3 with a literal English trigger-word list; different runtimes can independently decide whether a given request requires a Gate 3 interrupt.

3. **Skill-graph topology checks advisory-only** (R41-003 / P1). `skill_graph_compiler.py` marks symmetry, weight-band, weight-parity, and orphan-skill checks as soft validation; `--validate-only` returns success-shaped output even when routing invariants are violated.

4. **Markdown-to-code execution path in playbook runner** (R41-004 / P1). `manual-playbook-runner.ts` evaluates command/object-literal fragments extracted from prose using `Function(...)()` with no sandbox or schema validation.

5. **Unsigned boolean DSL in plan workflow assets** (R42-001, R43-002, R44-003 / P2). Both `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` express branch logic as raw string predicates (`intake_only == TRUE`, `intake_only == FALSE`) with no pinned interpreter contract.

6. **Skill routing authority split** (R42-002 / P2). `skill_advisor_runtime.py` discovers skills from `*/SKILL.md` files; the compiled skill graph adds a `graph-metadata.json` node for `skill-advisor` itself. `health_check()` reports `ok` whenever one real skill is discovered and the graph loads, never comparing discovered-skill count to graph-skill count.

7. **Playbook automation eligibility string-governed** (R42-003 / P2). `manual-playbook-runner.ts` decides automation eligibility through hard-coded filename path fragments and prose-shaped command parsing; renaming a markdown file changes automation status without modifying any typed governance field.

8. **`intent_signals` loaded but silently discarded at scoring** (R43-001, R44-001 / P1). The live skill router does not consume per-skill `intent_signals` or `derived.trigger_phrases` from `graph-metadata.json`. The `"signals"` map is populated at load time but has no consumer in `analyze_request()`.

9. **SKILL.md keyword comments stripped before routing** (R44-002 / P2). `parse_frontmatter_fast()` in `skill_advisor_runtime.py` returns when it reaches the closing `---` and stores only `key: value` scalar lines. `<!-- Keywords: ... -->` comment blocks are stripped and never reach `_build_skill_record()`.

10. **Loss-of-signal layers: warning amnesia and silent scenario drop** (R45-003, R45-004 / P1) [NEW since 44]. `skill_graph_compiler.py` emits topology warnings during compilation but drops them from the serialized graph; once loaded, operators see only `"status": "ok"` with no trace of the warnings. Separately, `manual-playbook-runner.ts` silently filters out unparseable scenario files before computing the coverage total; 10 of 291 active scenario files were confirmed unparseable on 2026-04-16, making coverage counts structurally dishonest.

11. **`/spec_kit:*` subcommand prefix collapse** (R46-001 / P1) [NEW since 44]. `COMMAND_BRIDGES` registers only the generic `/spec_kit` and `spec_kit:` markers; `detect_explicit_command_intent()` stops at the first string-containment match. All `/spec_kit:*` subcommands — including `/spec_kit:deep-research` and `/spec_kit:resume` — are collapsed to `command-spec-kit` at Gate 2, above their semantically correct skill routing targets.

12. **Unilateral `conflicts_with` silently promoted to bilateral penalty** (R46-002 / P1) [NEW since 44]. The skill-graph compiler normalizes any declared `conflicts_with` edge into a sorted two-skill pair without validating reciprocal declaration. The runtime then applies an uncertainty penalty to both skills in any co-appearing pair. A unilateral metadata edit in one skill file creates bilateral routing consequences with no validation gate.

13. **Playbook runner `Function(...)` eval now includes live runtime values** (R46-003 / P1) [NEW since 44]. The playbook runner substitutes `runtimeState.lastJobId` (captured from prior tool-return payloads) into markdown argument strings before `Function(...)()` execution. Tool output from live handlers is now part of the evaluated code string, widening the trust boundary beyond repository-owned markdown.

14. **Gate 3 concrete false positives confirmed** (R45-001, R47-001 / P2) [NEW since 44]. Two shipped manual-testing scenarios (`002-confirm-mode-checkpointed-review.md`, `026-ruled-out-directions-in-synthesis.md`) contain `phase transition` and `synthesis phase` in their prompts. Both are purely read-only validation tasks, yet they reuse the `phase` token that appears verbatim in `AGENTS.md`'s hard-trigger list. Combined with the `analyze` trigger (R45-001), read-only deep-review and deep-research prompts can be interrupted by unnecessary spec-folder setup depending on runtime implementation fidelity.

15. **Two-vocabulary state machine in `/spec_kit:plan` collapsed in top-level docs** (R47-002 / P2) [NEW since 44]. Plan YAML assets maintain a local `folder_state` classifier and map it to a canonical `start_state`; `intake_triggered` / `intake_completed` events emit both. But `SKILL.md` and `README.md` reference only the generic `folder_state` label, hiding the distinction. Downstream consumers that read top-level docs may treat `folder_state` as the canonical enum when `start_state` is the intended contract boundary.

**Summary of novel insights from iterations 45-47:**

Domain 4 has moved from documenting the three routing vocabularies (graph signals, keyword comments, Python tables) to documenting how the governance machinery manufactures false-positive signals of correctness across all layers. The deepest new pattern: **every loss-of-signal mechanism in Domain 4 produces success-shaped output**. Topology warnings are printed then forgotten (R45-003); 10 scenario files disappear silently before the coverage count (R45-004); subcommand routing collapses to a generic result with high confidence (R46-001); unilateral conflict metadata silently becomes bilateral (R46-002); `Function(...)` eval now runs with live tool-return data without any type error or parser warning (R46-003). In each case the system reports success while operating with reduced fidelity.

---

### 2.6 Domain 5 — Test Coverage Gaps (not yet started as a dedicated domain)

Test-coverage gaps appear as subsidiary evidence in nearly every iteration. Recurring patterns catalogued through iteration 47:

**Legacy gaps (identified by iteration 32, unchanged):**
- `startup-brief.vitest.ts:28-76` mocks `loadMostRecentState()` unconditionally, masking the scope-less contract break.
- `code-graph-query-handler.vitest.ts:12-18` hoists `ensureCodeGraphReady` to always return `'fresh'`.
- `post-insert-deferred.vitest.ts:11-48` asserts all-true booleans for deferred runs.
- `graph-metadata-schema.vitest.ts:223-245` asserts legacy acceptance as clean success.
- `hook-session-stop-replay.vitest.ts:14-56` runs with autosave disabled.
- `reconsolidation-bridge.vitest.ts:255-330` uses static mocked search results only.

**Gaps from iterations 33-44 (preserved from 44-iteration snapshot):**
- `hook-precompact.vitest.ts:23-48` / `hook-session-start.vitest.ts:27-107` — compact prime identity race (R33-001) has no regression.
- `hook-stop-token-tracking.vitest.ts:23-109` — no two-stop overlap exposing `lastTranscriptOffset: 0` sentinel (R37-001).
- `hook-session-stop.vitest.ts:17-89` — no case where `currentSpecFolder` is itself stale (R37-002).
- `hook-state.vitest.ts:4-224` — imports `cleanStaleStates` but contains no invocation; no TOCTOU regression (R40-001).
- `reconsolidation.vitest.ts:790-855` — single-writer only; no two-conflict-save race (R35-001).
- `reconsolidation-bridge.vitest.ts:255-330` — no governed-scope mutation test (R39-002, R40-002).
- `transcript-planner-export.vitest.ts:146-217` — no `populated` vs `populated-folder` token divergence case (R41-001).
- `memory-save-planner-first.vitest.ts:12-214` — covers response shaping only; no Gate 3 trigger-classification verification (R41-002).
- `skill-graph-schema.vitest.ts:1-156` — dispatcher/input-validation test only; not a compiler-invariant gate for topology checks (R41-003).
- `transcript-planner-export.vitest.ts` — never exercises YAML `when:` predicate evaluation (R42-001, R43-002, R44-003).
- `test_skill_advisor.py:141-165` — never asserts `intent_signals` routing effect (R43-001, R44-001).
- `test_skill_advisor.py` — never asserts keyword comment routing effect (R44-002).
- `skill-advisor` health tests — never compare discovered-skill count against graph-skill count (R42-002).

**New gaps from iterations 45-47 [NEW since 44]:**
- `test_skill_advisor.py` — no test pins ranking stability margins between `sk-deep-research` and `sk-code-review` / `sk-deep-review` under prompts containing audit/review vocabulary; wording-sensitivity of deep-research routing (R45-002) is invisible at CI time.
- `test_skill_advisor.py` — no test asserts `health_check()` returns `status: "degraded"` or propagates topology warning state when `skill_graph_compiler.py --validate-only` emits `ZERO-EDGE WARNINGS`; warning amnesia (R45-003) has no regression (confirmed live: warning emitted, health returns `"ok"`).
- `manual-playbook-runner.ts` test suite — no assertion that scenario count before and after `.filter(value => value !== null)` are equal; silent parse-drop of 10/291 scenario files (R45-004) produces no test failure.
- `test_skill_advisor.py` — no test asserts that `/spec_kit:deep-research` or `/spec_kit:resume` route to their respective specific skills rather than `command-spec-kit`; the prefix-collapse (R46-001) is invisible at CI time.
- `test_skill_advisor.py` — no test asserts that a unilateral `conflicts_with` declaration in one skill file does or does not create a routing penalty for the non-declaring skill; bilateral promotion (R46-002) has no test coverage.
- `manual-playbook-runner.ts` test suite — no test injects a `lastJobId` containing JavaScript injection syntax to verify `Function(...)()` behavior; the expanded trust boundary (R46-003) has no adversarial test.
- Across test suites — no test asserts that `folderState` and `startState` in `intake_triggered` / `intake_completed` events are distinct fields with distinct valid vocabularies; the vocabulary collapse (R47-002) has no regression coverage.

**Risk-prioritized harness inventory (as of iteration 47):**

| Priority | Test harness | Findings covered | Rationale |
| -------- | ------------ | ---------------- | --------- |
| P0-linked | Two-concurrent-conflict save against same predecessor | R35-001 | Directly covers P0-candidate-B; forked lineage is permanent |
| P0-linked | Mixed-snapshot scope filter under governed-scope mutation | R39-002, R40-002 | Directly covers P0-candidate-B extension |
| P0-linked | TOCTOU cleanup → all-or-nothing scan abort → cold-start | R40-001, R38-001 | Directly covers P0-candidate-D interaction |
| P1 | Two-stop overlap exposing transient `lastTranscriptOffset: 0` | R37-001, R33-002 | Three compounding transcript-offset corruption mechanisms |
| P1 | `/spec_kit:*` subcommand specificity assertion | R46-001 | Pins routing fix; prevents prefix-collapse regression |
| P1 | Unilateral `conflicts_with` bilateral-penalty assertion | R46-002 | Detects silent routing-authority changes from metadata edits |
| P1 | `Function(...)()` with injected `lastJobId` adversarial input | R46-003 | Code-injection surface in playbook validation path |
| P1 | Scenario count before vs after null-filter equals | R45-004 | Makes silent parse-drop visible at CI time |
| P1 | `health_check()` returns `degraded` when topology warnings exist | R45-003 | Prevents warning amnesia from hiding routing degradation |
| P1 | `intent_signals` routing boost assertion | R43-001, R44-001 | Locks in routing fix; prevents invisible regression |
| P1 | SKILL.md keyword comment routing assertion | R44-002 | Locks in keyword extraction fix |
| P1 | Health check inventory divergence = degraded | R42-002 | Prevents health normalization of known drift |
| P2 | Ranking stability margins for deep-research vs review prompts | R45-002 | Prevents wording-sensitivity regression in Gate 2 routing |
| P2 | Command-asset `when:` predicate evaluation with `TRUE`/`FALSE` literals | R42-001, R43-002, R44-003 | Workflow control-plane regression coverage |
| P2 | `folderState` / `startState` two-vocabulary event assertion | R47-002 | Prevents vocabulary collapse in downstream event consumers |
| P2 | `populated` vs `populated-folder` token in Step 0.5 branch | R41-001 | Intake classification regression |
| P2 | Gate 3 read-only prompt classification | R45-001, R47-001 | Pins false-positive boundary for `phase`/`analyze` triggers |
| P2 | Compact prime identity race (`clearCompactPrime` overlap) | R33-001 | Medium-frequency scenario; covered by a small test |
| P2 | Playbook scenario with explicit `automatable` field survives rename | R42-003 | Governance regression; low effort |

---

## Section 3 — Cross-Cutting Themes

### 3.1 Anti-Patterns Appearing in 3+ Files

| Anti-pattern | Files affected | Representative findings |
| ------------ | -------------- | ----------------------- |
| Success-shaped envelope masking skip / defer / partial / failed state | `post-insert.ts`, `session-stop.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `response-builder.ts` | R8-001, R12-001, R13-004, R17-002, R21-001 |
| Unvalidated `JSON.parse` feeding both write-target and prompt-visible text | `hook-state.ts`, `shared-payload.ts`, `graph-metadata-parser.ts` | R21-002, R9-002, R11-002 |
| Collapsed state vocabulary (missing vs empty vs stale vs degraded) | `shared-payload.ts`, `code-graph/query.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `opencode-transport.ts` | R9-001, R22-001, R23-001, R26-001, R30-001, R30-002 |
| Pre-transaction read-then-mutate (snapshot before lock, no re-read at commit) | `hook-state.ts` + `session-stop.ts`, `reconsolidation-bridge.ts` + `reconsolidation.ts`, `graph-metadata-parser.ts` | R31-001, R31-002, R31-003, R31-004, R34-002, R35-001 |
| Deterministic / shared temp path under concurrency | `hook-state.ts` (`.tmp`), `graph-metadata-parser.ts` (pid+Date.now ms precision), command YAMLs + runtime root docs + `data-loader.ts` error message | R31-001, R31-004, R31-005, R35-003, R36-003 |
| Test fixture canonizes degraded contract | `post-insert-deferred.vitest.ts`, `code-graph-query-handler.vitest.ts`, `structural-contract.vitest.ts`, `graph-metadata-schema.vitest.ts` | R25-001 through R25-004, R26-001 |
| Flag-based success without helper-result inspection | `post-insert.ts`, `session-stop.ts` | R8-001, R34-001, R35-002 |
| TOCTOU identity race (stat vs act on same pathname) | `hook-state.ts` (`loadMostRecentState` stat-then-read, `cleanStaleStates` stat-then-unlink, `clearCompactPrime` read-then-clear) | R33-001, R36-001, R40-001 |
| Success-shaped governance (string-defined contracts that accept violations) | `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `AGENTS.md`, `skill_graph_compiler.py`, `manual-playbook-runner.ts`, `skill_advisor_runtime.py` | R41-001, R41-002, R41-003, R41-004, R42-001, R42-002, R42-003 |
| Invisible signal discard (signals loaded end-to-end but silently dropped at scoring boundary) | `skill_advisor.py`, `skill_graph_compiler.py`, `skill_advisor_runtime.py`, `graph-metadata.json`, `sk-deep-research/SKILL.md`, `system-spec-kit/SKILL.md` | R43-001, R44-001, R44-002 |

---

### 3.2 Systemic Issues Not in the Original Copilot Deep-Dive

*The original seven systemic issues plus three from iterations 33-41 are unchanged. Two prior new issues from iterations 42-44 are preserved. No new systemic issues emerge from iterations 45-47; however, the existing issues deepen in two directions:*

**11. The routing toolchain is fully wired but the wire terminates before scoring.** (Unchanged from 44-iteration snapshot; see §3.2 there for full narrative.)

The additions from iterations 45-47 confirm that this is not just a wiring gap but a systemic governance-signal-amnesia pattern: (a) compile-time topology warnings are also discarded after printing (R45-003); (b) subcommand routing vocabulary is discarded by prefix-matching before it can influence skill selection (R46-001); and (c) the `conflicts_with` metadata contract is promoted beyond its declared scope without a validator catching it (R46-002). The three mechanisms share the same root: a governance artifact is consumed at one layer (metadata, warning message, YAML key) and then silently ignored or transformed at the next layer.

**12. `Function(...)` eval trust boundary has expanded beyond repository-owned content.** (R46-003, new confirmation from iteration 46.) The original finding (R41-004) documented that the playbook runner evaluates markdown fragments. Iteration 46 extends this: `substitutePlaceholders()` now injects `runtimeState.lastJobId`, which is extracted from prior tool handler payloads. The code string that `Function(...)()` evaluates is therefore a composition of repository-authored markdown plus live API return values. This changes the attack surface from "a developer must craft a malicious markdown file" to "any handler whose payload is copied to `lastJobId` can influence the code that gets evaluated." The threat model is not hypothetical; it is a boundary condition of the current implementation.

---

### 3.3 Findings That Reinforce Each Other

*Existing reinforcement chains from the 44-iteration snapshot are preserved. New chains from iterations 45-47:*

- **R45-003 (topology warning amnesia) + R43-001/R44-001 (intent_signals discarded) + R42-002 (health reports ok despite mismatch):** All three are instances of the same root pattern applied to different governance artifacts — compile, route, and health all produce success-shaped output while operating with structural deficiencies. Together they ensure that no currently available tool (health probe, CI gate, log line) can detect that the routing stack is partially inert. A post-fix monitoring strategy must add success-state assertions at all three layers simultaneously.

- **R46-001 (`/spec_kit:*` prefix collapse) + R44-001 (intent_signals discarded) + R41-003 (topology checks advisory-only):** These three form a complete routing-confidence failure chain at Gate 2. Subcommands are collapsed to a generic bridge before specific skill signals are consulted; the specific skill signals that should distinguish subcommands are permanently inert; and the topology validation that could detect the routing signal gaps exits with success. An operator who runs `skill_advisor.py "/spec_kit:deep-research" --threshold 0.8` sees `command-spec-kit` at 0.95 confidence — not because the routing is correct but because three separate failure layers all report ok.

- **R46-002 (unilateral `conflicts_with` → bilateral penalty) + R41-003 (topology checks advisory-only) + R42-002 (health check normalizes mismatch):** Together these mean that a single metadata file edit can create bilateral routing consequences that are: (a) not caught by the `validate_edge_symmetry()` function (R41-003); (b) not visible in the `health_check()` payload (R42-002); and (c) not logged when the penalty is applied at request scoring time (R46-002). The operator's only signal is observing changed routing behavior in live use.

- **R46-003 (`Function(...)` eval + `lastJobId`) + R45-004 (silent scenario parse drop) + R41-004 (`Function(...)` eval on markdown):** The three playbook runner findings now form a compounding trust-boundary collapse. R41-004 established that markdown fragments are executed; R45-004 shows that parse failures silently remove scenarios before the coverage count; R46-003 adds that live tool-return data is now part of the evaluated string. Taken together: the runner can silently exclude scenarios from coverage, execute repository-authored + runtime-composed code, and report successful coverage with fewer scenarios than the active tree contains — all without any test, schema error, or warning log.

- **R47-002 (`folder_state`/`start_state` vocabulary split) + R41-001 (`populated` vs `populated-folder` token split) + R42-001/R43-002/R44-003 (unsigned boolean DSL):** The `/spec_kit:plan` workflow control plane is now documented to have three independent vocabulary fragmentation points: (a) the local classifier token `populated` vs the canonical contract token `populated-folder`; (b) the `folder_state` event field vs the `start_state` contract surface; and (c) the uppercase boolean literal predicates with no pinned grammar. Any one of these can misfire independently; all three can misfire simultaneously on the same prompt with no shared schema to catch the contradiction.

- **R45-001 + R47-001 (Gate 3 false positives) + R45-002 (deep-research vs review routing brittleness) + R41-002 (Gate 3 prose trigger list):** Together these form an intake governance brittleness cluster: Gate 3 can fire on read-only research prompts because trigger words are prose, and Gate 2 can route deep-research to review when prompts contain audit/review vocabulary because the scoring tables have no disambiguation tier. A single prompt sent to the system can simultaneously trigger an unwanted Gate 3 interrupt and an incorrect Gate 2 routing. Because both gates are controlled by prose, fixing one does not fix the other; both require typed, testable contracts.

---

### 3.4 Three-Vocabulary Routing Architecture (Domain 4 structural view)

*Unchanged from 44-iteration snapshot. Reproduced here with additions from iterations 45-47.*

```
Routing Signal Source          Infrastructure Path         Reaches analyze_request()?
-----------------------        ---------------------------  ---------------------------
SKILL.md <!-- Keywords -->     parse_frontmatter_fast()    NO — stripped at --- boundary
                               returns before keyword
                               block                   ---------> DISCARDED

graph-metadata.json            skill_graph_compiler.py     NO — compile/load pipeline
intent_signals /               compile_graph()             works correctly, but no
derived.trigger_phrases        -> SQLite/JSON persist       consumer reads "signals"
                               -> _load_skill_graph_        field in scoring path
                               sqlite() loads into     ---------> DISCARDED
                               "signals" dict in RAM

Python source tables           INTENT_BOOSTERS,            YES — directly consumed
INTENT_BOOSTERS,               MULTI_SKILL_BOOSTERS,       in score_skill_matches()
PHRASE_INTENT_BOOSTERS         PHRASE_INTENT_BOOSTERS      and analyze_request()
                               in skill_advisor.py    ---------> ACTIVE
                               + graph adjacency/
                               families topology
                               boosts
```

**New observations from iterations 45-47:**

A fourth vocabulary layer now reveals itself at Gate 2: `COMMAND_BRIDGES` slash-command prefix matching. This layer is consulted first (before `analyze_request()`) and can preempt all three vocabulary layers above. Specifically, `/spec_kit:deep-research` triggers the `command-spec-kit` bridge at `kind_priority = 2` before the `intent_signals`/booster-table routing can run. This means the invisible-discard problem for `intent_signals` is compounded: even if A2 (wire `intent_signals`) is implemented, subcommand prompts will still be collapsed by the bridge layer unless R46-001 (bridge disambiguation) is also addressed. The fix sequencing must add R46-001 to Chain A before A2 is considered complete for the `/spec_kit:*` command surface.

---

### 3.5 Domain 4 Signal Amnesia Pattern (new structural view) [NEW since 44]

Iterations 45-47 surface a unifying structural pattern across Domain 4 findings: **governance artifacts are consumed at one layer and then silently forgotten at the next**. This "signal amnesia" pattern differs from the "invisible discard" of iterations 43-44 (which described a specific compile-load-score pipeline gap) in that it applies across all governance layers:

| Layer | Artifact consumed | Next layer | Signal fate |
| ----- | ----------------- | ---------- | ----------- |
| Compile | Topology warnings | Serialized graph | Dropped; not included in emitted JSON |
| Load | In-memory `"signals"` map | `analyze_request()` | Dropped; no consumer at scoring boundary |
| Parse | `<!-- Keywords -->` blocks | `_build_skill_record()` | Dropped; frontmatter parser exits before comment block |
| Runtime | `conflicts_with` declared unilaterally | Bilateral penalty application | Promoted beyond declared scope with no validator |
| Runner | `lastJobId` from tool payload | `Function(...)()` string | Injected without escaping or schema validation |
| Coverage | Null scenario parse results | Coverage total | Filtered out before count; no error emitted |
| Routing | `/spec_kit:subcommand` specificity | Bridge matching | Collapsed to generic bridge before specific routing runs |
| Docs | Two-layer state machine (`folder_state` → `start_state`) | Top-level consumer docs | Flattened back to one string, hiding the vocabulary split |

In every row, the artifact is non-trivially present in the input layer, but the transition to the next layer silently reduces its expressiveness or discards it entirely. The unified fix pattern: each transition must either (a) assert that the artifact was faithfully forwarded and consumed, or (b) explicitly log that it was intentionally dropped. Neither currently applies to any row in the table.

---

## Section 4 — Severity Escalation Candidates

### 4.1 P0 Candidates (Unchanged)

**P0-candidate-A: Cross-runtime tempdir control-plane poisoning**
Constituent findings: R21-002 + R25-004 + R28-001 + R29-001 + R31-001 + R33-003.
Rationale unchanged.

**P0-candidate-B: Reconsolidation conflict + complement duplicate/corruption window**
Constituent findings: R31-003 + R32-003 + R34-002 + R35-001 + R40-002.
Rationale unchanged.

**P0-candidate-C: Graph-metadata laundering + search boost**
Constituent findings: R11-002 + R13-002 + R20-002 + R21-003 + R22-002 + R23-002.
Rationale unchanged.

**P0-candidate-D: TOCTOU cleanup erasing fresh state under live session load**
Constituent findings: R40-001 + R38-001 + R33-002 + R37-001.
Rationale unchanged.

### 4.2 P0 Escalation Assessment: Iterations 45-47

The new P1 findings from iterations 45-47 do not individually meet the P0 threshold. However, two watch items merit updated assessment:

**Watch candidate — Domain 4 routing misdirection chain (updated):** R46-001 strengthens this watch candidate in a concrete direction. The original watch candidate (R43-001 + R44-001 + R42-002 + R41-003) asked whether incorrect routing could chain into file-modifying outcomes. R46-001 now identifies a specific mechanism: an explicit `/spec_kit:deep-research` invocation routes to `command-spec-kit` at 0.95 confidence rather than `sk-deep-research` at 0.70 confidence. `command-spec-kit` is a planner bridge that can invoke file-modifying spec-folder workflows. If an operator's intent is autonomous research (no file modification), but the routed skill is the spec-folder planner, Gate 3 may be invoked and spec folder creation may proceed. Whether this chain is currently completable depends on whether `command-spec-kit` enforces Gate 3 independently of skill routing; that question remains open. The chain is now more concrete and the mechanism is identified; recommend upgrade to watch-priority-1 (one confirmed step away from P0).

**`Function(...)` eval trust boundary (R46-003):** This finding does not meet P0 because the playbook runner operates in development/CI contexts rather than production. However, the expanded trust boundary (tool-return → eval) represents an uncontrolled code-injection surface in an automated test environment. If the playbook runner is ever invoked in a shared CI context where handler payloads are externally influenced, the severity escalates. Recommend flagging for security review before any CI environment expansion.

### 4.3 P1 Findings That Should Stay P1 with Strict Ordering

From the 44-iteration snapshot (unchanged):
- R43-001 / R44-001 (intent_signals silently discarded) — unlocks trustworthy graph-level routing before promoting topology checks
- R41-003 should be addressed after R43-001/R44-001

New from iterations 45-47:
- **R46-001** (subcommand prefix collapse) should be addressed in tandem with or before R43-001/R44-001 (A2), because wiring `intent_signals` into scoring is only useful for subcommand disambiguation if the bridge layer does not preempt the scoring path. The fix sequencing addition: A2-bridge-disambiguation (R46-001 fix) must precede or accompany A2 proper.
- **R46-002** (unilateral `conflicts_with` bilateral promotion) should be addressed as part of A4 (topology validation promotion), since `validate_edge_symmetry()` is the natural home for a `conflicts_with` reciprocity check.
- **R45-003** (topology warning amnesia) feeds directly into A4; the fix is to serialize warning state into the graph payload and surface it in `health_check()`. This is a prerequisite for A4 being meaningful.
- **R45-004** (silent scenario parse drop) should be addressed as part of C1 (explicit `automatable` field), since the root cause is the same: governance metadata is inferred from parse success rather than declared explicitly.
- **R46-003** (expanded `Function(...)` trust boundary) should be addressed as part of C3 (replace eval with schema-validated step parser), now elevated in urgency given the live-data injection.

### 4.4 Severity-Ordered Finding Table (Domain 4, iterations 45-47) [NEW since 44]

| Finding | Severity | File(s) | One-liner | Fix chain |
| ------- | -------- | ------- | --------- | --------- |
| R45-003 | P1 | `skill_graph_compiler.py`, `skill_advisor.py` | topology warnings printed then discarded; `health_check()` returns ok even after ZERO-EDGE WARNING emission | A4 prereq |
| R45-004 | P1 | `manual-playbook-runner.ts` | 10/291 scenarios silently filtered before coverage count; coverage reports understate active scenario tree | C1 prereq |
| R46-001 | P1 | `skill_advisor.py` | all `/spec_kit:*` subcommands collapse to `command-spec-kit` via prefix bridge; explicit `/spec_kit:deep-research` routes to planner not researcher | A2-bridge |
| R46-002 | P1 | `skill_graph_compiler.py`, `skill_advisor.py` | unilateral `conflicts_with` silently promoted to bilateral runtime penalty; no validator checks reciprocity | A4 extension |
| R46-003 | P1 | `manual-playbook-runner.ts` | `Function(...)()` eval now runs with live `lastJobId` from tool-return payloads; trust boundary wider than repository-owned markdown | C3 urgent |
| R45-001 | P2 | `AGENTS.md`, `002-confirm-mode-checkpointed-review.md`, `memory-save-planner-first.vitest.ts` | Gate 3 overbroad trigger list misclassifies read-only deep-review prompts as file-modifying; `analyze`/`phase` overlap with research vocabulary | B4 |
| R45-002 | P2 | `skill_advisor.py`, `test_skill_advisor.py` | deep-research prompts containing audit/review vocabulary rank within 0.02 of review skills; no disambiguation layer; no ranking-stability test | A3 extension |
| R47-001 | P2 | `AGENTS.md`, `002-confirm-mode-checkpointed-review.md`, `026-ruled-out-directions-in-synthesis.md` | concrete shipped prompts with `phase transition` / `synthesis phase` reuse Gate 3 trigger token `phase`; confirms R45-001 false-positive with repo evidence | B4 (consolidates R45-001) |
| R47-002 | P2 | `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `intake-contract.md`, `SKILL.md`, `README.md` | `/spec_kit:plan` maintains `folder_state` / `start_state` two-vocabulary state machine; top-level docs collapse to one string; downstream consumers may treat wrong enum as canonical | B1 extension |

---

## Section 5 — Remediation Backlog (Updated)

### 5.1 New or Amended Items from Iterations 45-47

*For the complete backlog from iterations 33-41, see §5.1 in `interim-synthesis-41-iterations.md`. For additions from iterations 42-44, see §5.1 in `interim-synthesis-44-iterations.md`. Only new additions and amendments from iterations 45-47 are listed here.*

#### `skill/skill-advisor/scripts/skill_advisor.py` (amendments)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Extend `COMMAND_BRIDGES` to include per-subcommand entries for `/spec_kit:deep-research`, `/spec_kit:resume`, `/spec_kit:plan`, `/spec_kit:complete`, `/spec_kit:implement`, `/spec_kit:deep-review`; update `detect_explicit_command_intent()` to return the most-specific match | **Small** | R46-001 |
| Add a disambiguation tier to `analyze_request()` that checks whether high-confidence review and deep-research scores are within a threshold of each other; apply intent context (presence of `research loop`, `autonomous`, `iterative`) to break ties | **Medium** | R45-002 |

#### `skill/skill-advisor/scripts/skill_graph_compiler.py` (amendments)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Serialize topology warning payloads (zero-edge, symmetry, weight-band violations) into the compiled graph alongside success counts; expose `topology_warnings` array in `health_check()` response | **Small** | R45-003 |
| Add `conflicts_with` edge reciprocity check to `validate_edge_symmetry()`; report asymmetric conflict declarations as warnings (or errors after A4 promotion) | **Small** | R46-002 |

#### `skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` (amendments)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Assert `parsedCount == filteredCount` after the null-filter step; emit a parse-failure warning with filename and reason for each dropped scenario before the coverage count | **Small** | R45-004 |
| Restrict `substitutePlaceholders()` to fixture-declared placeholders only; move `lastJobId` injection to a typed `runtimeContext` parameter passed to step execution; validate `lastJobId` is a UUID before injecting | **Medium** | R46-003 |

#### `command/spec_kit/assets/spec_kit_plan_auto.yaml` + `spec_kit_plan_confirm.yaml` (amendments)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Define `start_state` as the canonical emitted event field in `intake_triggered` / `intake_completed` payloads; retain `folder_state` as an internal local variable with explicit comments marking the vocabulary boundary | **Small** | R47-002 |
| Update `SKILL.md` (lines 563, 931) and `README.md` (line 624-626) to reference `start_state` as the contract boundary rather than the generic `folder_state` | **Small** | R47-002 |

#### `AGENTS.md` (new item)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Add a qualifier to the Gate 3 trigger-word list: `phase` triggers Gate 3 only when no preceding read-only intent signal is present (e.g., `validate`, `confirm`, `inspect`, `verify`); extract the classification logic into a shared module (Chain B4) | **Medium** | R45-001, R47-001 |

---

### 5.2 Quick Wins vs Structural Refactors (Updated)

**Quick wins added since 44-iteration snapshot [NEW since 44]:**

27. Extend `COMMAND_BRIDGES` with per-subcommand entries for all `/spec_kit:*` subcommands (R46-001)
28. Serialize topology warning payloads into compiled graph; expose in `health_check()` (R45-003)
29. Add `conflicts_with` reciprocity check to `validate_edge_symmetry()` (R46-002)
30. Assert `parsedCount == filteredCount` in playbook runner before coverage computation (R45-004)
31. Mark `start_state` vs `folder_state` vocabulary boundary in YAML assets with explicit comments (R47-002)
32. Restrict `substitutePlaceholders()` to fixture-declared placeholders; type `lastJobId` as UUID (R46-003 partial)

**Structural refactors (updated; all prior entries unchanged):**

10. **Subcommand-specific command bridge table** — replace prefix string matching in `COMMAND_BRIDGES` with a typed per-subcommand routing table keyed by exact command path — **Small-to-Medium.** [NEW since 44]
11. **Playbook runner trust boundary isolation** — fully replace `Function(...)()` eval and live-value substitution with a typed step executor that parses scenario arguments through a JSON schema — **Medium.** [NEW since 44; upgrades prior structural refactor #7]
12. **Gate 3 intent classifier** — replace prose trigger-word list with a typed intent classifier that applies read-only intent signals as disqualifiers for Gate 3 triggering — **Medium.** [NEW since 44; formalizes Chain B4]

---

### 5.3 Test Suite Changes Required (Updated)

*Legacy list from 32-iteration snapshot and additions from 33-44 are preserved in prior synthesis files. New additions from iterations 45-47:*

- `tests/test_skill_advisor.py` — add: (a) `/spec_kit:deep-research` routes to `sk-deep-research`, not `command-spec-kit` (R46-001); (b) `/spec_kit:resume` routes to `system-spec-kit`, not `command-spec-kit` (R46-001); (c) ranking-stability assertion that `sk-deep-research` score margin over `sk-code-review` is ≥ 0.10 for deep-research prompts containing audit vocabulary (R45-002); (d) `health_check()` returns `topology_warnings` array and non-empty `status: "degraded"` when compiler emits ZERO-EDGE warnings (R45-003); (e) unilateral `conflicts_with` declaration in one skill file does not change the non-declaring skill's raw score without a bilateral declaration (R46-002).
- `tests/manual-playbook-runner.test.ts` (or equivalent) — add: (a) scenario parse failure emits a named warning before coverage count (R45-004); (b) `lastJobId` containing `); process.exit(1)//` does not execute on substitution (R46-003 adversarial).
- New `tests/gate3-classifier.test.ts` (or equivalent) — add: (a) `phase transition` in a prompt preceded by `confirm` does not trigger Gate 3 (R45-001, R47-001); (b) `synthesis phase` in a prompt preceded by `verify` does not trigger Gate 3 (R47-001); (c) `implement` and `rename` in a prompt trigger Gate 3 regardless of preceding tokens (regression for false negatives).
- `tests/transcript-planner-export.vitest.ts` or equivalent — add: (a) `intake_triggered` event payload contains both `folderState` and `startState` fields with distinct values for `no-spec` / `empty-folder` states (R47-002); (b) `startState` uses `populated-folder` token, not `populated`, for the "skip intake" branch (R41-001, R47-002 combined).

### 5.4 Remediation Sequencing and Dependencies (Domain 4, iterations 41-47)

*Chains A, B, and C from the 44-iteration snapshot are preserved. New steps added:*

**Chain A — Skill routing accuracy (amended)**

| Step | Change | Findings | Effort | Can start after |
| ---- | ------ | -------- | ------ | --------------- |
| A0 | Add per-subcommand entries to `COMMAND_BRIDGES` for all `/spec_kit:*` subcommands | R46-001 | Small | Independent; must precede A2 for subcommand surface |
| A1 | Extend `parse_frontmatter_fast()` to extract `<!-- Keywords: ... -->` comment blocks | R44-002 | Small | Independent |
| A2 | Wire `intent_signals` from the `"signals"` map into `analyze_request()` scoring | R43-001, R44-001 | Medium | Independent; A0 and A1 can run in parallel |
| A2b | Add disambiguation tier for deep-research vs review prompts containing audit vocabulary | R45-002 | Medium | A2 |
| A3 | Add three new tests to `test_skill_advisor.py` (intent_signals routing; keyword comments; health mismatch = degraded) + two new tests (subcommand specificity; conflict unilateral) | R43-001, R44-001, R44-002, R42-002, R46-001, R46-002 | Small | After A0, A1, A2 |
| A4 | Promote topology checks to hard errors; add `conflicts_with` reciprocity check; serialize warnings into compiled graph payload | R41-003, R45-003, R46-002 | Small | A2 should precede A4 |
| A5 | Upgrade `health_check()` to compare discovered-skill count against graph-skill count; expose `topology_warnings` | R42-002, R45-003 | Small | After A3 |

**Chain B — Command-asset and governance vocabulary (amended)**

| Step | Change | Findings | Effort | Can start after |
| ---- | ------ | -------- | ------ | --------------- |
| B1 | Align `folder_state` tokens with canonical `populated-folder`; define `start_state` as emitted field | R41-001, R47-002 | Small | Independent |
| B2 | Define a `BooleanExpr` schema for YAML `when:` predicates; replace string literals with typed boolean conditions | R42-001, R43-002, R44-003 | Medium | B1 |
| B3 | Add asset-predicate test suite covering Step 0 branch inputs; add `folderState`/`startState` event assertion | R42-001, R43-002, R44-003, R47-002 | Medium | B2 |
| B4 | Extract Gate 3 trigger classification into a shared module or JSON schema; add read-only disqualifier tokens | R41-002, R45-001, R47-001 | Medium | Independent; parallels B1 |

**Chain C — Playbook runner (amended)**

| Step | Change | Findings | Effort | Can start after |
| ---- | ------ | -------- | ------ | --------------- |
| C1 | Add explicit `automatable: boolean` field to playbook scenario metadata schema; assert `parsedCount == filteredCount` | R42-003, R45-004 | Small | Independent |
| C2 | Migrate existing scenarios to use the new field; remove filename-substring `preclassifiedUnautomatableReason()` | R42-003 | Medium | C1 |
| C3 | Replace `Function(...)()` eval with a typed step executor; restrict `lastJobId` injection to typed UUID parameter | R41-004, R46-003 | Medium | C1 (can run in parallel with C2 after C1) |

**Priority ordering across chains:** A0 is now the lowest-effort, highest-urgency starting point because it blocks accurate Gate 2 routing for the entire `/spec_kit:*` command surface regardless of any other fix. A0 + A1 + B1 can all start immediately and in parallel. C3 remains the highest-security-impact change and should be scheduled early given the expanded trust boundary confirmed in R46-003.

---

## Section 6 — Gaps for Remaining Iterations (48-50)

### 6.1 Domain 4 Completion (iterations 48-50, 3 more passes)

Angles not yet covered, in priority order:

1. **Other command assets — `complete`, `implement`, `deep-research` YAML** (iteration 48 candidate). The open question from the 44-iteration snapshot: do these assets use the same unsigned boolean DSL and `folder_state` vocabulary? R47-002 deepens the urgency: if `intake_triggered`/`intake_completed` event shapes differ across command assets, the vocabulary split may propagate to different event fields in each asset's emission path. A systematic audit is needed before Chain B2 can be scoped correctly.

2. **`generate-context.js` trigger-word surface** (iteration 48 candidate, combinable with #1). The memory save script uses string-based category, trigger-phrase, and scope fields that feed into semantic search indexing. If those fields are manually authored prose without schema validation, they share the same "looks mechanically enforced" property as the skill routing metadata.

3. **Handover-state routing rules** (iteration 49 candidate). `handover_state` routing uses a prose-defined enum in `handover.md`. Whether any runtime validator checks the written value against a valid enum, or whether runtimes silently fall back on unrecognized values, is not established.

4. **`folderState`/`startState` downstream consumers** (iteration 48 candidate, from R47-002 next investigation angle). Trace `intake_triggered`/`intake_completed` to determine whether any reducer, dashboard, or reporting surface consumes `folderState` as if it were the normalized `start_state` enum. This is the concrete harm path for R47-002 beyond documentation confusion.

5. **Cross-cutting mechanization survey** (iteration 50 candidate). After individual surfaces are documented, the final Domain 4 pass should produce a prioritized mechanization table: which prose contracts could be replaced by JSON schema + CI gate with less than two days of effort? Scope: `AGENTS.md` Gate 3 triggers, `intake-contract.md` state tokens, `skill_graph_compiler.py` validation checks, command-asset expression languages, `conflicts_with` edge contracts.

### 6.2 Domain 5 — Test Coverage Gaps (dedicated pass, iterations 47+)

Proposed angles updated from the 44-iteration snapshot (all prior items carry forward):

1-12. (All prior Domain 5 harness targets from 44-iteration snapshot §6.2 are unchanged.)

13. **Subcommand routing specificity regression suite** — assert that all `/spec_kit:*` subcommands route to their intended specific skills at a configurable confidence threshold after A0 is deployed.
14. **Conflict-edge bilateral assertion suite** — for each skill with `conflicts_with`, assert that the referenced skill also declares the reverse; fails on any asymmetric pair.
15. **Playbook parse-completeness assertion** — assert that all files matched by the scenario discovery glob produce non-null parse results; fail loudly on any null with filename.
16. **Gate 3 prompt-classification regression suite** — parameterized tests exercising 20+ prompt examples against a gate-3 classifier; covers both false positives (research prompts with `phase`/`analyze`) and false negatives (modifying prompts without trigger words).

### 6.3 Files with Unanswered Questions (as of iteration 47)

*All open questions from the 44-iteration snapshot are preserved. New items:*

| File | Open question |
| ---- | ------------- |
| `command/spec_kit/assets/spec_kit_complete.yaml` / `spec_kit_implement.yaml` / `spec_kit_deep-research.yaml` | Do these assets use the same unsigned boolean DSL (`intake_only == TRUE`, `folder_state == populated`) as the plan assets? If so, how many additional branch points share the vulnerability? [NEW since 44] |
| `skill/skill-advisor/scripts/skill_advisor.py` — `COMMAND_BRIDGES` | Which `/spec_kit:*` subcommands are missing from the bridge table? Are there other command families with similar prefix-collapse gaps? [NEW since 44] |
| `skill/skill-advisor/scripts/skill_graph_compiler.py` — `validate_edge_symmetry()` | How many `conflicts_with` edges in the current live graph are asymmetric? What is the full set of skills bilaterally affected by unilateral declarations? [NEW since 44] |
| `skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts` — `substitutePlaceholders()` | What are all the `runtimeState` fields that can be injected via placeholder substitution? Are any of them sourced from network responses or external APIs? [NEW since 44] |
| `command/spec_kit/assets/` — event payload schemas | Is there a shared event schema that governs `intake_triggered` and `intake_completed` payloads across all command assets? Or does each asset emit independently? [NEW since 44] |
| `skill/system-spec-kit/references/intake-contract.md:39-49,56-76` | Does `intake-contract.md` define `folderState` as a valid synonym for `startState`, or is the usage in `SKILL.md:563` and `README.md:624-626` undocumented drift? [NEW since 44] |

*(All prior open questions from §6.3 of `interim-synthesis-44-iterations.md` are preserved unchanged.)*

---

## Appendix A — Finding Catalog: Iterations 45-47 [NEW since 44]

*Format: `RN-NNN` | File:lines | Severity | Short description*
*For R1-001 through R44-003, see Appendix A in `interim-synthesis-44-iterations.md`.*

```
R45-001 | AGENTS.md:182-186; 002-confirm-mode-checkpointed-review.md:26-32; plan.md:86-89;
          memory-save-planner-first.vitest.ts:12-214 | P2
          Gate 3 trigger list includes 'analyze', 'decompose', 'phase'; read-only deep-review and
          deep-research prompts reuse these tokens, triggering unnecessary spec-folder setup

R45-002 | skill_advisor.py:568-577,771-813,1669-1694; test_skill_advisor.py:73-186 | P2
          deep-research prompts containing 'audit'/'review' tokens score within 0.02 of sk-code-review;
          live repro: 'Audit runtime seams with autonomous deep investigation' tied sk-deep-research
          and sk-deep-review at 0.95; no ranking-stability test

R45-003 | skill_graph_compiler.py:559-568,630-663; skill_advisor.py:1841-1888;
          test_skill_advisor.py:141-165 | P1
          topology warning state is non-durable: ZERO-EDGE WARNINGS emitted then dropped from
          serialized graph; health_check() returns 'status: ok' with 'skill_graph_loaded: true'
          after warnings; confirmed live repro 2026-04-16

R45-004 | manual-playbook-runner.ts:245-271,1203-1217; manual_testing_playbook.md:196-230;
          spec.md:131-134 | P1
          parseScenarioDefinition() returns null on parse failure; main() filters nulls before
          coverage count; 10 of 291 active scenario files were unparseable on 2026-04-16 including
          001-context-recovery-and-continuation.md, 005-outsourced-agent-memory-capture-round-trip.md,
          184-gemini-runtime-path-resolution.md; coverage reports understate active scenario tree

R46-001 | skill_advisor.py:980-1021,1404-1410,1647,1741-1768; test_skill_advisor.py:73-186 | P1
          COMMAND_BRIDGES registers only '/spec_kit' and 'spec_kit:' prefix markers;
          detect_explicit_command_intent() stops at first containment match; all /spec_kit:*
          subcommands collapse to command-spec-kit at kind_priority=2; live: /spec_kit:deep-research
          → command-spec-kit 0.95, sk-deep-research 0.70

R46-002 | skill_graph_compiler.py:272-319,501-568,630-663; skill_advisor.py:141-187,321-339;
          test_skill_advisor.py:73-186 | P1
          validate_edge_symmetry() never inspects conflicts_with edges; compiler normalizes any
          declared conflict to sorted tuple and stores in shared conflicts list; runtime applies
          bilateral uncertainty penalty; unilateral metadata edit creates bilateral routing
          consequence with no validation gate

R46-003 | manual-playbook-runner.ts:181-194,427-445,930-943,1112-1117 | P1
          parsedStepArgs() routes brace-prefixed text to evaluateObjectLiteral(); substitutePlaceholders()
          injects runtimeState.lastJobId extracted from prior handler payloads; Function(`return (${replaced});`)()
          executes with no parser or escaping layer; trust boundary wider than repository-owned markdown

R47-001 | AGENTS.md:182-185; 002-confirm-mode-checkpointed-review.md:26-32,44-45;
          026-ruled-out-directions-in-synthesis.md:26-32,44-45 | P2
          concrete shipped deep-review confirm-mode scenario uses 'phase transition' and deep-research
          synthesis scenario uses 'synthesis phase' — both read-only validation prompts reuse Gate 3
          trigger token 'phase' verbatim; confirms R45-001 false-positive with repo evidence

R47-002 | spec_kit_plan_auto.yaml:337-373; spec_kit_plan_confirm.yaml:360-398;
          intake-contract.md:39-49,56-76; SKILL.md:563-563,931-931; README.md:624-626 | P2
          /spec_kit:plan maintains two-vocabulary state machine: local folder_state classifier
          ('no-spec'|...|'populated') maps to canonical start_state ('empty-folder'|...|'populated-folder');
          events emit both folderState and startState; but SKILL.md and README.md use generic
          'folder_state' label, collapsing the vocabulary distinction for downstream consumers
```

---

## Appendix B — Domain 4 Finding Severity and Fix-Chain Cross-Reference (cumulative)

All findings R41-001 through R47-002 mapped against fix chains:

| Finding | Severity | Fix chain | Status |
| ------- | -------- | --------- | ------ |
| R41-001 | P2 | B1 | Vocabulary fix; extended by R47-002 |
| R41-002 | P2 | B4 | Extended by R45-001, R47-001 |
| R41-003 | P1 | A4 | Depends on A2; extended by R45-003, R46-002 |
| R41-004 | P1 | C3 | Depends on C1; extended by R46-003 |
| R42-001 | P2 | B2 | Depends on B1 |
| R42-002 | P2 | A5 | Depends on A3; extended by R45-003 |
| R42-003 | P2 | C1 → C2 | C1 extended by R45-004 |
| R43-001 | P1 | A2 | Independent; highest-value Domain 4 fix; A0 must precede for /spec_kit:* surface |
| R43-002 | P2 | B2 | Depends on B1 |
| R44-001 | P1 | A2 (consolidates R43-001) | Same scoring-path fix |
| R44-002 | P2 | A1 | Independent; lowest-effort high-signal |
| R44-003 | P2 | B2 | Depends on B1 |
| R45-001 | P2 | B4 | Consolidated with R47-001 |
| R45-002 | P2 | A2b | After A2 |
| R45-003 | P1 | A4 prereq | Serialize warnings before promoting to hard errors |
| R45-004 | P1 | C1 prereq | Assert parse completeness before automatable field migration |
| R46-001 | P1 | A0 | Independent; must precede A2 for /spec_kit:* surface |
| R46-002 | P1 | A4 extension | Add to validate_edge_symmetry() alongside topology promotion |
| R46-003 | P1 | C3 urgent | Depends on C1; elevate urgency due to expanded trust boundary |
| R47-001 | P2 | B4 (consolidates R45-001) | Same Gate 3 classifier fix |
| R47-002 | P2 | B1 extension | Extend vocabulary alignment to cover event payload fields |

**Fastest path to closing all P1s in Domain 4 (updated):**
A0 (subcommand bridges) → A1 + A2 in parallel (keyword comments + intent_signals) → A2b (disambiguation tier) → A3 (tests) → A4 (topology promotion + conflict reciprocity) + A5 (health check) in parallel → C1 (scenario metadata field + parse assertion) → C3 (eval replacement) in parallel with C2 (scenario migration). B4 (Gate 3 classifier) is independent of all chains and can proceed immediately.

---

**End of interim synthesis.**

- **Total distinct findings through iteration 47:** ~59
- **Files flagged:** 35
- **P1 volume (raw/distinct):** 63 raw / ~33 distinct
- **P2 volume (raw/distinct):** 55 raw / ~26 distinct
- **Domain 3:** complete (10/10)
- **Domain 4:** in progress (7/10; 21 findings across iterations 41-47, 9 P1 and 12 P2)
- **Domain 5:** not yet started as a dedicated domain
- **Most significant new finding class (iterations 45-47):** R46-001 (P1) — all `/spec_kit:*` subcommands collapse to generic `command-spec-kit` via prefix bridge; confirmed live at 0.95 confidence. This compounds the pre-existing routing-inertness cluster (R43-001/R44-001) because the bridge preempts scoring entirely for explicit subcommand invocations.
- **Most structurally revealing new theme:** Domain 4 signal-amnesia pattern (§3.5) — every governance artifact transition from one layer to the next silently reduces signal fidelity without any log, test failure, or error code. The unified fix is to assert forwarding at every boundary rather than assuming it.
- **New P0 escalation:** none from iterations 45-47; P0-candidate watch for Domain 4 routing misdirection is upgraded to watch-priority-1 following R46-001 (concrete mechanism identified: `/spec_kit:deep-research` → planner bridge at 0.95).
- **Remediation sequencing update:** A0 is the new first step in Chain A; it is independent, small-effort, and blocks accurate routing for the entire `/spec_kit:*` surface regardless of other A-chain progress. C3 urgency elevated to match R46-003's expanded trust boundary.
