# Interim Synthesis — Phase 016 Foundational Runtime Deep Review

**As of: iteration 44** (Domain 3 complete at 10/10; Domain 4 in progress at 4/10; Domain 5 not yet started)
**Author:** synthesis agent (read-only analysis)
**Source snapshot:** `iteration-001.md` through `iteration-044.md`
**Prior snapshot:** `interim-synthesis-41-iterations.md` (iterations 1-41; Domain 3 complete, Domain 4 stub 1/10)
**Note:** Domain coverage:
- **Foundational (1-10):** session-lifecycle / hook-state / code-graph / post-insert / shared-payload / compact-cache seam exploration
- **Domain 1 (11-20):** Silent Fail-Open Patterns — complete
- **Domain 2 (21-30):** State Contract Honesty — complete
- **Domain 3 (31-40):** Concurrency and Write Coordination — **complete** (10/10)
- **Domain 4 (41-44+):** Stringly-Typed Governance — **in progress** (4/10, iterations 41-44)
- **Domain 5:** Test Coverage Gaps — not yet started as a dedicated domain (subsidiary evidence in nearly every iteration)

---

## Section 1 — Finding Inventory

### 1.1 Raw Counts

| Metric                                                    | Count (41-iter snapshot) | Count (44-iter snapshot) | Delta |
| --------------------------------------------------------- | ------------------------ | ------------------------ | ----- |
| Iterations read                                           | 41                       | 44                       | +3    |
| Total numbered findings emitted (raw, incl. cross-domain) | 93                       | 105                      | +12   |
| P0 findings (interaction-effect escalations)              | 0 (4 candidates)         | 0 (4 candidates)         | —     |
| P1 findings (raw)                                         | 54                       | 58                       | +4    |
| P2 findings (raw)                                         | 39                       | 47                       | +8    |
| Unique file surfaces flagged                              | 20                       | 27                       | +7    |
| Distinct anti-patterns (cross-cutting)                    | 9                        | 10                       | +1    |

After deduplication the full set compresses to approximately **51 distinct issues** across 27 files
(prior: ~44 distinct issues across 20 files).

---

### 1.2 Findings Per Source File (deduped, cumulative through iteration 44)

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
| `AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `GEMINI.md`         | 2        | 1               | D3, D4           |
| `command/spec_kit/assets/spec_kit_plan_auto.yaml`             | 4        | 3               | D4               |
| `command/spec_kit/assets/spec_kit_plan_confirm.yaml` [NEW since 41] | 2  | 2               | D4               |
| `skill/skill-advisor/scripts/skill_advisor.py`                | 4        | 3               | D4               |
| `skill/skill-advisor/scripts/skill_advisor_runtime.py` [NEW since 41] | 4 | 3              | D4               |
| `skill/skill-advisor/scripts/skill_graph_compiler.py`         | 3        | 2               | D4               |
| `skill/skill-advisor/graph-metadata.json` [NEW since 41]      | 2        | 2               | D4               |
| `skill/system-spec-kit/mcp_server/tests/manual-playbook-runner.ts` | 2   | 2               | D4               |
| `skill/skill-advisor/tests/test_skill_advisor.py` [NEW since 41] | 2     | 2               | D4               |
| `skill/sk-deep-research/SKILL.md` / `skill/system-spec-kit/SKILL.md` [NEW since 41] | 2 | 1 | D4  |
| `skill/skill-advisor/feature_catalog/04--testing/02-health-check.md` [NEW since 41] | 1 | 1 | D4  |

---

### 1.3 Deduplication Map (cumulative through iteration 44)

Existing dedup clusters from the 41-iteration snapshot are unchanged. New clusters from iterations 42-44:

| Dedup cluster                                                         | Iterations touching it | Canonical finding |
| --------------------------------------------------------------------- | ---------------------- | ----------------- |
| `spec_kit_plan_auto.yaml` / `spec_kit_plan_confirm.yaml` uppercase boolean DSL | R42-001, R43-002, R44-003 | R42-001 (primary) + R43-002 + R44-003 |
| Skill routing authority split: discovery vs graph inventory health    | R42-002 | R42-002 |
| Playbook automation eligibility driven by filename substrings         | R42-003 | R42-003 |
| `intent_signals` loaded into graph but never consumed by scoring path | R43-001, R44-001 | R43-001 (primary) + R44-001 |
| SKILL.md keyword comments stripped by frontmatter parser; not used in routing | R44-002 | R44-002 |

**All prior dedup clusters from the 41-iteration snapshot are preserved unchanged (see §1.3 of `interim-synthesis-41-iterations.md` for the full list).**

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

### 2.5 Domain 4 — Stringly-Typed Governance (iterations 41-44, 4/10 complete)

**Central thesis (sharpened through iteration 44):** Governance — gate triggers, intake-state vocabularies, skill routing, validation outcomes, and workflow control flow — is expressed as manually synchronized string tables across docs, YAML assets, Python dictionaries, and markdown playbooks. Crucially, the failure mode is not absent machinery but **invisible discard**: the runtime already moves routing signals end-to-end through compile, load, and graph-store stages, only to silently drop them at the scoring step. The problem is not that governance is informal; it is that governance looks mechanically enforced while critical signals are inert.

**Key patterns discovered through iteration 44:**

1. **Intake-state vocabulary split** (R41-001 / P2). The autonomous plan workflow uses `populated` as the "skip intake" state; the canonical intake contract and operator-facing plan doc define the same state as `populated-folder`. Because branch conditions are prose string comparisons, runtimes or prompt revisions can reconcile these differently.

2. **Gate 3 trigger list as prose contract** (R41-002 / P2). `AGENTS.md` governs Gate 3 with a literal English trigger-word list. Different runtimes can independently decide whether a given request requires a Gate 3 interrupt, undermining the mandatory-gating claim.

3. **Skill-graph topology checks advisory-only** (R41-003 / P1). `skill_graph_compiler.py` marks symmetry, weight-band, weight-parity, and orphan-skill checks as soft validation; `--validate-only` returns success-shaped output even when routing invariants are violated.

4. **Markdown-to-code execution path in playbook runner** (R41-004 / P1). `manual-playbook-runner.ts` evaluates command/object-literal fragments extracted from prose using `Function(...)()` with no sandbox or schema validation.

5. **Unsigned boolean DSL in plan workflow assets** (R42-001, R43-002, R44-003 / P2) [NEW since 41]. Both `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` express the `--intake-only` stop/continue branch as raw string predicates (`intake_only == TRUE`, `intake_only == FALSE`) with no pinned interpreter contract. The `folder_state` comparisons immediately preceding them share the same pattern. No automated test exercises these predicates; adjacent test suites validate only outcome summaries and response shapes.

6. **Skill routing authority split** (R42-002 / P2) [NEW since 41]. `skill_advisor_runtime.py` discovers skills from `*/SKILL.md` files; the compiled skill graph adds a `graph-metadata.json` node for `skill-advisor` itself. `health_check()` reports `ok` whenever one real skill is discovered and the graph loads, never comparing discovered-skill count to graph-skill count. The package's own health-check feature doc normalizes the live mismatch (20 discovered vs 21 in graph) as current reality.

7. **Playbook automation eligibility string-governed** (R42-003 / P2) [NEW since 41]. `manual-playbook-runner.ts` decides playbook automation eligibility through hard-coded filename path fragments (`definition.filePath.includes('17--governance/123-')`) and prose-shaped command parsing. Renaming a markdown file or reformatting command prose changes automation status without modifying any typed governance field.

8. **`intent_signals` loaded but silently discarded at scoring** (R43-001, R44-001 / P1) [NEW since 41]. The live skill router does not consume per-skill `intent_signals` or `derived.trigger_phrases` from `graph-metadata.json`. Instead, it scores requests through hard-coded `INTENT_BOOSTERS`, `MULTI_SKILL_BOOSTERS`, and `PHRASE_INTENT_BOOSTERS` tables plus graph topology boosts. The compiler faithfully copies `intent_signals` into the compiled graph, and the runtime loader faithfully loads them into the in-memory `"signals"` map — but no scoring consumer reads the `"signals"` field. Live repro (2026-04-16): `python3 skill_advisor.py "natural language code retrieval" --threshold 0.8` returned `sk-code-opencode` with `_graph_boost_count: 0`, proving the metadata phrase is not a live signal.

9. **SKILL.md keyword comments stripped before routing** (R44-002 / P2) [NEW since 41]. `parse_frontmatter_fast()` in `skill_advisor_runtime.py` returns when it reaches the closing `---` and stores only `key: value` scalar lines. Keyword metadata in `<!-- Keywords: ... -->` comment blocks (`sk-deep-research`, `system-spec-kit`, and others) is stripped and never reaches `_build_skill_record()`. Skill maintainers editing keyword comments see no routing effect unless they also edit Python dictionaries.

**Summary of novel insight from iterations 42-44:** Domain 4's deepest pathology is not "docs say X, code says Y" — it is that the system now has **three separate routing vocabularies** (skill-graph `intent_signals`, SKILL-file keyword comments, and Python booster tables) while only the last one is guaranteed to influence runtime scoring. The routing toolchain looks mechanically wired end-to-end (compile → load → graph-store → score) while the discard happens silently at the boundary between `_load_skill_graph_sqlite()` and `analyze_request()`. For governance: command assets look typed (structured YAML, bound variables, `step_0.6_intake_only_gate` keys) while being controlled by opaque string expressions with no shared grammar or direct test coverage.

**Detailed technical notes on iterations 42-44 findings:**

**R42-001 / R43-002 / R44-003 — Boolean DSL in plan assets (three confirmations)**

The core issue is that `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` both contain `when:` predicates that use bare identifiers as variables and uppercase `TRUE`/`FALSE` string literals as boolean values. The `folder_state` comparisons (`folder_state != populated`, `folder_state == populated`) use a different token than the canonical contract (`populated-folder`). Neither YAML asset documents which interpreter is responsible for evaluating these expressions, what the token normalization rules are, or what happens on parse failure. The three iterations confirm the same pattern from different angles: R42-001 notes the DSL exists and is interpreter-dependent; R43-002 confirms that Step 0 as a whole shares this design; R44-003 verifies the confirm-variant asset has identical predicates. Because the expressions appear in two separate assets, any fix must be applied consistently or the two plan variants will diverge in behavior.

**R42-002 — Health check normalizes known inventory divergence**

The live workspace has exactly 20 skills discoverable from `*/SKILL.md` and 21 nodes in the compiled graph. The health-check feature doc (`02-health-check.md:18-20`) explicitly cites this as expected state, effectively canonizing a mismatch as a feature rather than a warning. This is structurally identical to the "test fixture canonizes degraded contract" anti-pattern from Domain 2 applied to operational tooling. The graph node for `skill-advisor` itself is the extra node — it is a self-referential entry that the discovery scanner cannot find via `*/SKILL.md` because it is the scanner. The fix is not to remove the self-referential node but to make `health_check()` aware of the expected delta and distinguish it from unexpected drift.

**R43-001 / R44-001 — Three-stage pipeline with silent terminal discard**

The routing pipeline has four distinct stages: (1) `skill_graph_compiler.py compile_graph()` copies `intent_signals` from each skill's `graph-metadata.json` into the compiled graph payload; (2) `_load_skill_graph_sqlite()` / `_load_skill_graph_json()` reads the compiled graph and populates a `"signals"` key in the in-memory graph dict; (3) `analyze_request()` calls `get_cached_skill_records()` to build the lexical match corpus; (4) scoring combines lexical matches against the corpus with graph topology boosts. Stages 1 and 2 correctly carry `intent_signals` through. Stage 3 builds the corpus exclusively from `SKILL.md` frontmatter `name` and `description` fields. Stage 4 applies graph boosts from `adjacency` and `families`, not from `signals`. The `"signals"` key in the in-memory graph dict is populated but has no consumer in stages 3 or 4. There is no log line indicating signals were evaluated or skipped, and `health_check()` does not verify routing-signal coverage. The result: every graph-metadata routing phrase that has been carefully curated by skill authors is permanently inert at Gate 2, but looks authoritative to anyone reading the metadata or the compiler output.

**R44-002 — Keyword comment parsing truncated at frontmatter boundary**

`parse_frontmatter_fast()` uses a character-by-character scan that exits immediately when it finds the second `---` delimiter. Since `<!-- Keywords: ... -->` blocks appear after the frontmatter fence in real SKILL.md files, they are never parsed. `_build_skill_record()` receives only a `{name, description}` dict and derives routing terms from that alone. This is architecturally distinct from R43-001: the graph-metadata signals problem is about data that was compiled and loaded but not used; the keyword-comment problem is about data that was never read from disk at all. Both problems reinforce each other: two separate signal sources that skill authors can edit are both silently ignored, while a third source (Python booster tables) is the only one with actual routing influence.

**Domain 4 surfaces not yet covered (remaining 6 passes):**
- `opencode.json` + `.utcp_config.json` MCP naming contracts (`{manual_name}.{manual_name}_{tool_name}`)
- `generate-context.js` trigger-word surface for memory category / triggers / scope
- Handover-state routing rules (`handover_state` enum with no runtime validator)
- Whether `folderState` / Gate 3 vocabularies leak into emitted events, reducers, or follow-up commands beyond `/spec_kit:plan`
- `recommendations.md` + `implementation-summary.md` operational promises without CI gates
- Cross-cutting mechanization survey: which prose contracts could gain low-effort JSON schema + CI gates?
- Command YAML DSL: audit other assets (`complete`, `implement`, `deep-research`) for unpinned uppercase booleans and token names
- Gate 3 semantic overbreadth: false positives for `analyze` / `phase` / `decompose` in research-only prompts

---

### 2.6 Domain 5 — Test Coverage Gaps (not yet started as a dedicated domain)

Test-coverage gaps appear as subsidiary evidence in nearly every iteration. Recurring patterns catalogued through iteration 44:

**Legacy gaps (identified by iteration 32, unchanged):**
- `startup-brief.vitest.ts:28-76` mocks `loadMostRecentState()` unconditionally, masking the scope-less contract break.
- `code-graph-query-handler.vitest.ts:12-18` hoists `ensureCodeGraphReady` to always return `'fresh'`.
- `post-insert-deferred.vitest.ts:11-48` asserts all-true booleans for deferred runs.
- `graph-metadata-schema.vitest.ts:223-245` asserts legacy acceptance as clean success.
- `hook-session-stop-replay.vitest.ts:14-56` runs with autosave disabled.
- `reconsolidation-bridge.vitest.ts:255-330` uses static mocked search results only.

**Gaps from iterations 33-41:**
- `hook-precompact.vitest.ts:23-48` and `hook-session-start.vitest.ts:27-107` — never invoke `clearCompactPrime()` or `readAndClearCompactPrime()` under overlap; compact prime identity race (R33-001) has no regression.
- `hook-stop-token-tracking.vitest.ts:23-109` — covers only sequential metric overwrites; no two-stop overlap exposing the `lastTranscriptOffset: 0` sentinel (R37-001).
- `hook-session-stop.vitest.ts:17-89` — no case where `currentSpecFolder` is itself stale; stale-preference detection (R37-002) is tested only in one direction.
- `hook-state.vitest.ts:4-224` — imports `cleanStaleStates` but contains no invocation; no TOCTOU stat-then-unlink regression (R40-001).
- `reconsolidation.vitest.ts:790-855` — single-writer; no two-conflict-save race proving forked lineage (R35-001).
- `reconsolidation-bridge.vitest.ts:255-330` — no governed-scope mutation between `vectorSearch()` and end of scope-filter loop; mixed-snapshot acceptance has no adversarial test (R39-002, R40-002).
- `transcript-planner-export.vitest.ts:146-217` — no `populated` vs `populated-folder` token divergence case for Step 0.5 branch (R41-001).
- `memory-save-planner-first.vitest.ts:12-214` — covers response shaping only; no Gate 3 trigger-classification verification (R41-002).
- `skill-graph-schema.vitest.ts:1-156` — dispatcher/input-validation test only; not a compiler-invariant gate for symmetry/weight-band/orphan-skill checks (R41-003).

**New gaps from iterations 42-44 [NEW since 41]:**
- `transcript-planner-export.vitest.ts` never exercises or validates `spec_kit_plan_auto.yaml` / `spec_kit_plan_confirm.yaml` `when:` predicate evaluation, `TRUE`/`FALSE` literal handling, or the `folder_state` comparisons in Step 0 (R42-001, R43-002, R44-003).
- `test_skill_advisor.py` (lines 141-165) covers only result shape and health key presence; it never asserts that `intent_signals` from `graph-metadata.json` affect routing scores, making the silent discard invisible at CI time (R43-001, R44-001).
- `test_skill_advisor.py` never asserts keyword extraction from `SKILL.md` `<!-- Keywords: ... -->` blocks; keyword comment edits pass all tests with zero routing effect (R44-002).
- `skill-advisor` health check tests assert only non-empty result and key presence; no test compares discovered-skill count against graph-skill count or flags the known inventory divergence as a test failure (R42-002).
- `manual-playbook-runner.ts` automation eligibility tests (if any) do not assert that filename-based `preclassifiedUnautomatableReason()` locks are the only factors; renaming-induced eligibility changes have no regression coverage (R42-003).

**Risk-prioritized harness inventory (as of iteration 44):**

| Priority | Test harness | Findings covered | Rationale |
| -------- | ------------ | ---------------- | --------- |
| P0-linked | Two-concurrent-conflict save against same predecessor | R35-001 | Directly covers P0-candidate-B; forked lineage is permanent |
| P0-linked | Mixed-snapshot scope filter under governed-scope mutation | R39-002, R40-002 | Directly covers P0-candidate-B extension |
| P0-linked | TOCTOU cleanup → all-or-nothing scan abort → cold-start | R40-001, R38-001 | Directly covers P0-candidate-D interaction |
| P1 | Two-stop overlap exposing transient `lastTranscriptOffset: 0` | R37-001, R33-002 | Three compounding transcript-offset corruption mechanisms |
| P1 | `intent_signals` routing boost assertion | R43-001, R44-001 | Locks in routing fix; prevents invisible regression |
| P1 | SKILL.md keyword comment routing assertion | R44-002 | Locks in keyword extraction fix |
| P1 | Health check inventory divergence = degraded | R42-002 | Prevents health normalization of known drift |
| P2 | Command-asset `when:` predicate evaluation with `TRUE`/`FALSE` literals | R42-001, R43-002, R44-003 | Workflow control-plane regression coverage |
| P2 | `populated` vs `populated-folder` token in Step 0.5 branch | R41-001 | Intake classification regression |
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
| **Invisible signal discard (signals loaded end-to-end but silently dropped at scoring boundary)** [NEW since 41] | `skill_advisor.py`, `skill_graph_compiler.py`, `skill_advisor_runtime.py`, `graph-metadata.json`, `sk-deep-research/SKILL.md`, `system-spec-kit/SKILL.md` | R43-001, R44-001, R44-002 |

---

### 3.2 Systemic Issues Not in the Original Copilot Deep-Dive

*The original seven systemic issues plus three from iterations 33-41 are unchanged. One new systemic issue emerges from iterations 42-44:*

**11. The routing toolchain is fully wired but the wire terminates before scoring.** `skill_graph_compiler.py` copies `intent_signals` into the compiled graph, `_load_skill_graph_sqlite()` loads them into the runtime's `"signals"` map, but `analyze_request()` never reads that map. The repository therefore presents a mechanically complete routing pipeline while silently discarding per-skill routing vocabulary at every request. Unlike earlier "advisory-only" findings where the gap was between docs and code, here the gap is inside the same code path — signals pass through compile, persist, and load stages only to vanish at the scoring boundary. This is a structurally distinct failure from R41-003's "advisory validation"; it makes the entire graph-level routing vocabulary permanently inert without any indication in logs, health checks, or tests.

The consequence for operators is particularly confusing: editing `graph-metadata.json` to add a new trigger phrase, recompiling, and running `--validate-only` all produce success-shaped output, yet Gate 2 behavior is unchanged. The only way to currently change routing is to edit Python source code in the booster dictionaries, which have no connection to the metadata files and are not validated against them. The three-vocabulary architecture (graph `intent_signals`, SKILL.md keyword comments, Python booster tables) means that any team member working on skill metadata is effectively working in a read-only layer for routing purposes. This issue is distinct from systemic issue #10 ("runtime error contracts can teach dangerous patterns") but shares the same root: a gap between the pedagogic layer (what the system shows operators) and the operational layer (what actually runs).

---

### 3.3 Findings That Reinforce Each Other

*Existing reinforcement chains from the 41-iteration snapshot are preserved. New chains from iterations 42-44:*

- **R44-001 (intent_signals discarded) + R44-002 (keyword comments stripped) + R42-002 (health reports ok despite inventory mismatch):** Together, three different mechanisms make the skill routing stack look healthy while operating exclusively from hand-maintained Python tables. `intent_signals` reach the in-memory graph but not the scorer; `SKILL.md` keyword comments reach the file parser but not the record builder; the health probe confirms "ok" even when discovered-skill count diverges from graph-skill count. All three failures are invisible at CI time. The combined effect is that any operator who follows the documented "edit graph-metadata to tune routing" workflow is operating on inert data; only operators who know to edit Python source in `INTENT_BOOSTERS` can actually change routing behavior.

- **R42-001 (plan asset boolean DSL) + R43-002 (Step 0 untyped predicates) + R44-003 (confirm asset same pattern) + R41-001 (intake vocab split):** Together, the `/spec_kit:plan` workflow control plane is fully string-governed at every branch point: `folder_state` comparisons use divergent vocabulary across assets and docs (`populated` vs `populated-folder`), and `intake_only` branches use uppercase boolean literals with no pinned grammar. A single interpreter change could simultaneously flip intake classification and halt/continue gating across all plan variants. Because both `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` share the same predicate strings, any runtime that normalizes booleans to lowercase or to Python-style `True`/`False` will misfire identically in both variants, and the operator will see inconsistent behavior across the full `/spec_kit:plan` surface without any schema error to diagnose.

- **R42-003 (filename-based automation eligibility) + R41-004 (markdown→Function() eval) + R41-003 (advisory topology checks):** Together, three quality-gate mechanisms in the toolchain can silently accept or exercise invalid inputs: the playbook runner decides coverage from filenames, evaluates arbitrary Node code from prose, and relies on a validation step that returns success for broken graphs. The combined effect is that CI can report full green while governance, playbook coverage, and skill routing are all partially inert. None of the three failures has an explicit error code or warning log that would alert a reviewer; all three appear as normal successful output.

- **R43-001 (intent_signals discarded) + R41-003 (topology checks advisory-only):** These two findings must be addressed in sequence. Promoting topology checks to hard errors (R41-003 fix) is only meaningful if the topology being validated actually influences routing. In the current state, fixing R41-003 alone would make validation stricter for a graph whose signals are never consumed. The correct order is: wire `intent_signals` into scoring first (A2), verify routing is influenced, then promote topology checks to hard errors (A4). Implementing in reverse order would add CI friction without routing benefit.

- **R44-002 (keyword comments stripped) + R41-002 (Gate 3 prose trigger list):** Both are source-of-truth fragmentation at the skill-file level. Skill authors write routing-relevant vocabulary directly into skill files — keyword comments in SKILL.md for Gate 2 routing, trigger words in AGENTS.md for Gate 3. Neither path mechanically reads those files as the authoritative signal. The fix patterns are similar: extend the relevant parser (frontmatter parser for Gate 2; classify shared module for Gate 3) to read the skill-local vocabulary as input. This parallelism suggests a potential unified "skill vocabulary extraction" pass that serves both routing layers simultaneously.

---

### 3.4 Three-Vocabulary Routing Architecture (Domain 4 structural view) [NEW since 41]

The following diagram describes how the three routing vocabularies currently relate to the live Gate 2 decision path. Understanding the diagram is important for prioritizing fixes, because all three signal layers have infrastructure support but only the third reaches the scorer.

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

The infrastructure for the first two signal layers is complete; the wiring gap is purely a missing consumer at the scoring boundary. This means the fix cost for A1 (keyword comments) and A2 (intent_signals) is genuinely small — the data is already available in the right format; it just needs to be read and applied.

---

## Section 4 — Severity Escalation Candidates

### 4.1 P0 Candidates (Unchanged)

**P0-candidate-A: Cross-runtime tempdir control-plane poisoning**
Constituent findings: R21-002 + R25-004 + R28-001 + R29-001 + R31-001 + R33-003.
Rationale unchanged. A single corrupt temp-state file spans Claude + Gemini, write-side + read-side, prompt-visible + on-disk, tempdir + continuity + analytics.

**P0-candidate-B: Reconsolidation conflict + complement duplicate/corruption window**
Constituent findings: R31-003 + R32-003 + R34-002 + R35-001 + R40-002.
R35-001 (conflict fork) and R40-002 (mixed-snapshot scope filter) confirmed. Conflict lane can produce permanent multi-successor lineage; scope filter can silently include/exclude candidates based on rows that changed between successive lookups.

**P0-candidate-C: Graph-metadata laundering + search boost**
Constituent findings: R11-002 + R13-002 + R20-002 + R21-003 + R22-002 + R23-002.
Rationale unchanged.

**P0-candidate-D: TOCTOU cleanup erasing fresh state under live session load**
Constituent findings: R40-001 + R38-001 + R33-002 + R37-001.
Rationale unchanged. Triggered by normal `--finalize` cleanup rather than abnormal concurrent write; failure signal is a normal `removed` count.

### 4.2 No New P0 Escalation from Iterations 42-44

The Domain 4 findings in iterations 42-44 add no new P0 candidates. The invisible-discard pattern (R43-001, R44-001) is structurally significant but its blast radius is bounded to routing accuracy rather than data corruption or session-state loss. The unsigned boolean DSL (R42-001, R43-002, R44-003) creates control-plane drift risk that could misdirect workflow execution but does not directly threaten persistent storage integrity.

**Watch candidate — Domain 4 interaction:** R43-001 + R44-001 + R42-002 + R41-003 form a coherent governance invisibility cluster: skill routing can be systematically wrong, health probes report ok, topology validation reports ok, and CI passes. If routing silently redirects agent behavior to wrong skill handlers, the downstream effect could touch persistent spec-folder actions. This cluster should be revisited as Domain 4 coverage expands to assess whether incorrect routing can chain into file-modifying outcomes.

Concretely: if Gate 2 misroutes a request that should invoke `system-spec-kit` but instead invokes a less restrictive skill (for example, `sk-code-web` or `sk-code-full-stack` which do not enforce spec-folder gating at the same threshold), the operator may not receive a Gate 3 prompt and could proceed to file modification without the mandatory documentation pre-check. This chain requires: (a) a routing gap caused by wrong or missing `intent_signals`; (b) the receiving skill not enforcing Gate 3 independently. Whether condition (b) holds is not established by current evidence; it is the open question that makes this a watch candidate rather than a confirmed P0.

### 4.3 Domain 4 Structural Comparison with Domain 1 [NEW since 41]

Domain 1 documented "success-shaped envelopes" at the data layer: functions return `{success: true}` while the underlying operation skipped, deferred, or failed. Domain 4 shows the same pattern at the governance layer:

| Domain 1 analog | Domain 4 equivalent |
| --------------- | ------------------- |
| `post-insert.ts` returns boolean `true` regardless of actual insert outcome | `skill_graph_compiler.py --validate-only` returns success even when graph topology violates its own invariants (R41-003) |
| `touchedPaths` appended unconditionally regardless of `saveState()` success | Health check reports `ok` regardless of discovered-vs-graph count mismatch (R42-002) |
| `producerMetadataWritten` flag set on attempted-write, not on durable postcondition | `intent_signals` pipeline "wired" through compile + load stages, but not wired through scoring — looks complete, isn't (R43-001, R44-001) |
| `runContextAutosave()` returns without surfacing whether autosave ran, failed, or was skipped | `parse_frontmatter_fast()` returns without surfacing that keyword comments were parsed but discarded (R44-002) |

In both domains, the failure mode is **absence of a negative signal rather than presence of an error**. No exception, no log line, no test failure. Fixing Domain 1 patterns required adding explicit outcome fields (`autosaveOutcome`, `persistResult`). Fixing Domain 4 patterns requires the same discipline: explicit failure modes for governance checks (non-zero exit on topology violation), explicit "signal coverage" fields in health output (discovered vs graph count), and explicit routing contribution tracking (did `intent_signals` boost this routing decision?).

This structural parallel means the fix patterns from Domain 1 can be directly applied to Domain 4 with minor adaptation, reducing the design effort for Chain A and Chain B remediations.

### 4.3 P1 Findings That Should Stay P1 with Strict Ordering

Unchanged from 41-iteration snapshot, with two additions from iterations 42-44:
- R43-001 / R44-001 (intent_signals silently discarded — routing vocabulary permanently inert) — unlocks trustworthy graph-level routing before promoting topology checks to hard errors
- R41-003 should be addressed before R43-001/R44-001: promoting topology checks to hard errors is only meaningful once the checked signals actually influence routing

### 4.4 P2 Interactions That Approach P1

Unchanged: R14-001 + R33-002 (duplicate token accounting from offset regression); R40-001 + R38-001 (TOCTOU cleanup → all-or-nothing abort → cold-start appearance).

New: R42-001 + R43-002 + R44-003 (plan workflow boolean DSL across two assets + operator doc). If a prompt engine change normalizes `TRUE`/`FALSE` differently, this triple silently inverts workflow control at two branch points simultaneously — the interaction effect is stronger than any single finding.

### 4.5 Severity-Ordered Finding Table (Domain 4, iterations 41-44) [NEW since 41]

| Finding | Severity | File(s) | One-liner | Fix chain |
| ------- | -------- | ------- | --------- | --------- |
| R41-003 | P1 | `skill_graph_compiler.py` | topology checks advisory-only; `--validate-only` returns success for broken graphs | A4 (after A2) |
| R41-004 | P1 | `manual-playbook-runner.ts` | `Function(...)()` eval; documentation drift → arbitrary Node execution | C3 |
| R43-001 | P1 | `skill_advisor_runtime.py`, `skill_advisor.py`, `graph-metadata.json` | `intent_signals` discarded at scoring boundary; graph-level routing vocabulary permanently inert | A2 |
| R44-001 | P1 | `skill_graph_compiler.py`, `skill_advisor.py`, `graph-metadata.json` | compile-load-discard pipeline confirmed; `"signals"` map populated but never read in `analyze_request()` | A2 (consolidates with R43-001) |
| R41-001 | P2 | `spec_kit_plan_auto.yaml`, `intake-contract.md`, `plan.md` | `populated` vs `populated-folder` vocabulary split; intake classification interpreter-dependent | B1 |
| R41-002 | P2 | `AGENTS.md`, `plan.md`, `complete.md` | Gate 3 trigger list as prose English word list; different runtimes classify same request differently | B4 |
| R42-001 | P2 | `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `plan.md` | unsigned boolean DSL in both plan assets; `TRUE`/`FALSE` literals with no pinned interpreter contract | B2 (after B1) |
| R42-002 | P2 | `skill_advisor_runtime.py`, `skill_advisor.py`, `graph-metadata.json` | routing health reports ok despite 20-vs-21 count mismatch between discovery and graph inventory | A5 (after A3) |
| R42-003 | P2 | `manual-playbook-runner.ts` | automation eligibility decided by filename substring; renaming changes coverage without governance field | C1 → C2 |
| R43-002 | P2 | `spec_kit_plan_auto.yaml`, `plan.md` | Step 0 `folder_state` and `intake_only` untyped predicates; no automated coverage of predicate evaluation | B2 (after B1) |
| R44-002 | P2 | `skill_advisor_runtime.py`, SKILL.md files | `parse_frontmatter_fast()` strips `<!-- Keywords -->` comment blocks; keyword routing surface is inert | A1 |
| R44-003 | P2 | `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml` | `intake_only == TRUE/FALSE` string condition in confirm variant; same interpreter risk as R42-001 | B2 (after B1) |

**P1 findings in Domain 4 fix order:** R43-001 / R44-001 (A2) should precede R41-003 (A4) because promoting topology validation to a hard error is only useful if the topology-validated signals actually influence routing. R41-004 (C3) is independent and can proceed in parallel with A2.

---

## Section 5 — Remediation Backlog (Updated)

### 5.1 New or Amended Items from Iterations 42-44

*For the complete backlog from iterations 33-41, see §5.1 in `interim-synthesis-41-iterations.md`. Only additions and amendments are listed here.*

#### `skill/skill-advisor/scripts/skill_advisor.py` + `skill_advisor_runtime.py` (new)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Wire `intent_signals` from the loaded `"signals"` map into `analyze_request()` scoring (additive boost alongside existing token tables) | **Medium** | R43-001, R44-001 |
| Extend `parse_frontmatter_fast()` to extract `<!-- Keywords: ... -->` comment blocks and include them in `_build_skill_record()` routing terms | **Small** | R44-002 |
| Upgrade `health_check()` to compare discovered-skill count against graph-skill count; report mismatch as `status: "degraded"` rather than `"ok"` | **Small** | R42-002 |

#### `command/spec_kit/assets/spec_kit_plan_auto.yaml` + `spec_kit_plan_confirm.yaml` + `plan.md` (new)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Replace prose `when:` string predicates with a schema-validated expression type; define a `BooleanExpr` schema with only `true`/`false` literals and enumerate valid `folder_state` tokens | **Medium** | R42-001, R43-002, R44-003, R41-001 |
| Add test coverage to `transcript-planner-export.vitest.ts` or a new asset-predicate suite that exercises Step 0 `folder_state` and `intake_only` branch predicates directly | **Medium** | R42-001, R43-002, R44-003 |

#### `skill/system-spec-kit/mcp_server/tests/manual-playbook-runner.ts` (amendment)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Add an explicit `automatable: boolean` field to scenario metadata; remove filename-substring `preclassifiedUnautomatableReason()` logic; make coverage status a property of the scenario, not its file path | **Medium** | R42-003 |

#### `skill/skill-advisor/scripts/skill_graph_compiler.py` + `tests/test_skill_advisor.py` (new)

| Change | Effort | Findings addressed |
| ------ | ------ | ------------------ |
| Add a `test_intent_signals_affect_routing()` test that loads a skill with known `intent_signals` and asserts nonzero boost for matching queries | **Small** | R43-001, R44-001 |
| Add a `test_keyword_comments_affect_routing()` test that loads a `SKILL.md` with `<!-- Keywords: ... -->` and asserts keyword terms appear in the routing record | **Small** | R44-002 |
| Add a `test_health_check_inventory_divergence()` test that injects a graph with more nodes than discovered skills and asserts `status: "degraded"` | **Small** | R42-002 |

---

### 5.2 Quick Wins vs Structural Refactors (Updated)

**Quick wins added since 41-iteration snapshot [NEW since 41]:**

21. Extend `parse_frontmatter_fast()` to extract keyword comments from `SKILL.md` files (R44-002)
22. Upgrade `health_check()` to compare discovered-skill count against graph-skill count (R42-002)
23. Add `test_intent_signals_affect_routing()` to `test_skill_advisor.py` (R43-001, R44-001)
24. Add `test_keyword_comments_affect_routing()` to `test_skill_advisor.py` (R44-002)
25. Add `test_health_check_inventory_divergence()` to `test_skill_advisor.py` (R42-002)
26. Add explicit `automatable: boolean` field to playbook scenario metadata; remove filename substring logic (R42-003)

**Structural refactors (updated):**

1. Replace `enrichmentStatus` boolean record with enum-valued status map — **Large.** (unchanged)
2. Transactional reconsolidation (scope filter + complement inside writer lock; predecessor CAS in conflict) — **Large.** (unchanged; covers R35-001, R40-002)
3. HookState schema versioning + runtime validation + unique temp paths — **Medium.** (unchanged)
4. Trust-state vocabulary expansion (`absent`/`unavailable` distinct from `stale`) — **Medium-to-Large.** (unchanged)
5. Graph-metadata `migrated` flag propagation — **Medium.** (unchanged)
6. Gate 3 shared classifier — extract trigger classification from prose into a shared module callable from `AGENTS.md`, `plan.md`, and `complete.md` — **Medium.** (unchanged)
7. Playbook runner schema validation — replace `Function(...)()` eval with typed step parser — **Medium.** (unchanged)
8. **Wire `intent_signals` into `analyze_request()` scoring** — eliminate the compile-load-discard dead-end by consuming the `"signals"` map at request-scoring time — **Medium.** [NEW since 41]
9. **Schema-validated YAML expression language for command assets** — replace prose `when:` predicates in plan/complete/implement/deep-research assets with a typed `BooleanExpr` schema; define valid `folder_state` and boolean token enumerations — **Medium.** [NEW since 41]

---

### 5.3 Test Suite Changes Required (Updated)

*Legacy list from 32-iteration snapshot and additions from 33-41 are preserved in `interim-synthesis-41-iterations.md` §5.3. New additions:*

- `tests/test_skill_advisor.py` — add: (a) `test_intent_signals_affect_routing()` with known `intent_signals` asserting nonzero routing boost; (b) `test_keyword_comments_affect_routing()` loading SKILL.md with `<!-- Keywords: ... -->` and asserting term presence in routing record; (c) `test_health_check_inventory_divergence()` injecting node-count mismatch and asserting `status: "degraded"`.
- `tests/transcript-planner-export.vitest.ts` (or new `spec_kit_plan_asset.vitest.ts`) — add: branch-predicate evaluation tests for `folder_state == populated` / `folder_state == populated-folder` divergence and `intake_only == TRUE` / `intake_only == FALSE` literal handling in both `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml`.
- `tests/manual-playbook-runner.test.ts` — add: scenario with `automatable: false` explicit field to verify eligibility does not flip with file rename; scenario with `automatable: true` to verify it is exercised regardless of path.

### 5.4 Remediation Sequencing and Dependencies (Domain 4, iterations 41-44)

The Domain 4 findings form two independent fix chains that can be worked in parallel, plus one that must follow another.

**Chain A — Skill routing accuracy (parallelizable internal order)**

| Step | Change | Findings | Effort | Can start after |
| ---- | ------ | -------- | ------ | --------------- |
| A1 | Extend `parse_frontmatter_fast()` to extract `<!-- Keywords: ... -->` comment blocks; pass them to `_build_skill_record()` | R44-002 | Small | Independent |
| A2 | Wire `intent_signals` from the `"signals"` map into `analyze_request()` scoring as additive phrase-match boost | R43-001, R44-001 | Medium | Independent; A1 can run in parallel |
| A3 | Add three new tests to `test_skill_advisor.py` (intent_signals affect routing; keyword comments affect routing; health mismatch = degraded) | R43-001, R44-001, R44-002, R42-002 | Small | After A1 and A2 |
| A4 | Promote `skill_graph_compiler.py` topology checks to hard errors (non-zero exit); annotate `--validate-only` output | R41-003 | Small | A2 should precede A4 to avoid promoting validation before the signals it validates are live |
| A5 | Upgrade `health_check()` to compare discovered-skill count against graph-skill count; return `status: "degraded"` on mismatch | R42-002 | Small | After A3 to avoid test failures on the current known delta |

**Chain B — Command-asset and governance vocabulary (parallelizable internal order)**

| Step | Change | Findings | Effort | Can start after |
| ---- | ------ | -------- | ------ | --------------- |
| B1 | Align `spec_kit_plan_auto.yaml` + `spec_kit_plan_confirm.yaml` `folder_state` token with canonical `populated-folder` from `intake-contract.md` | R41-001, R42-001, R43-002 | Small | Independent |
| B2 | Define a `BooleanExpr` schema for YAML `when:` predicates; replace string literals with typed boolean conditions across both plan assets | R42-001, R43-002, R44-003 | Medium | B1 (fixes vocabulary before fixing grammar) |
| B3 | Add asset-predicate test suite covering Step 0 branch inputs (`folder_state`, `intake_only`) in both plan variants | R42-001, R43-002, R44-003 | Medium | B2 |
| B4 | Extract Gate 3 trigger classification into a shared classifier module or JSON schema; replace prose list in `AGENTS.md` | R41-002 | Medium | Independent; parallels B1 |

**Chain C — Playbook runner (sequential)**

| Step | Change | Findings | Effort | Can start after |
| ---- | ------ | -------- | ------ | --------------- |
| C1 | Add explicit `automatable: boolean` field to playbook scenario metadata schema | R42-003 | Small | Independent |
| C2 | Migrate existing scenarios to use the new field; remove filename-substring `preclassifiedUnautomatableReason()` logic | R42-003 | Medium | C1 |
| C3 | Replace `Function(...)()` eval with a schema-validated step parser; reject unrecognized shapes as malformed | R41-004 | Medium | C1 (can run in parallel with C2 after C1) |

**Priority ordering across chains:** A1 and B1 are the lowest-effort, highest-signal starting points. Neither has dependencies and both eliminate the "looks wired but is inert/wrong" surface that causes operator confusion. A2 is the most structurally significant change (wires graph-level routing vocabulary into the scorer for the first time). C3 is the highest-security-impact change and should be scheduled early on any CI environment that runs playbook validation in a shared context — `Function(...)()` eval on markdown-sourced text is a code-injection surface regardless of how unlikely the triggering scenario appears in a controlled workflow. A4 should be deferred until after A2 is deployed and verified, to avoid creating a stricter topology validation gate for signals that are still not influencing routing.

---

## Section 6 — Gaps for Remaining Iterations (45-50)

### 6.1 Domain 4 Completion (iterations 45-50, 6 more passes)

Angles not yet covered, in priority order with investigation rationale:

1. **Gate 3 semantic overbreadth** (iteration 45 candidate). The trigger word list in `AGENTS.md` includes `analyze`, `decompose`, and `phase`. These words appear in research-only prompts (`/spec_kit:deep-research`, `/spec_kit:plan --with-research`). If a runtime fires Gate 3 on a research-only request, the operator sees a spec-folder prompt for a task that should not require one, adding friction without safety benefit. Conversely, if a runtime does not fire Gate 3 on `add` or `implement`, a modifying task proceeds without spec-folder gating. The pass should construct 10-15 concrete prompt examples and classify them against the prose list, looking for both false positives and false negatives.

2. **`folderState` / Gate 3 vocabulary propagation** (iteration 46 candidate). R41-001 confirmed that `spec_kit_plan_auto.yaml` uses `populated` while `intake-contract.md` uses `populated-folder`. The open question is whether this token appears in emitted events, reducer-driven state updates, or downstream commands after `/spec_kit:plan` completes. If the token is emitted into events and consumed downstream, fixing only the YAML asset without fixing the event schema would leave the mismatch alive in a different layer.

3. **Other command assets** (iteration 47 candidate). The `complete`, `implement`, and `deep-research` YAML assets are adjacent to the `plan` assets and likely share the same `when:` DSL infrastructure. If they also use uppercase boolean literals and bare `folder_state` identifiers, the blast radius for R42-001/R44-003 is wider than the current plan-only scope. A systematic audit is needed before the BooleanExpr schema fix (Chain B2) can be scoped correctly.

4. **`generate-context.js` trigger-word surface** (iteration 48 candidate). The memory save script uses string-based category, trigger-phrase, and scope fields that feed into semantic search indexing. If those fields are manually authored prose without schema validation, they share the same "looks mechanically enforced" property as the skill routing metadata. The pass should audit whether the field values are validated against any schema at write time.

5. **Handover-state routing rules** (iteration 48 candidate, combinable with #4). The `handover_state` routing in `handover.md` uses a prose-defined enum of states (`in_progress`, `complete`, etc.). Whether any runtime validator checks that the value written to `handover.md` is a valid enum member — or whether runtimes that read it silently fall back on any unrecognized value — is not established.

6. **Cross-cutting mechanization survey** (iteration 50 candidate). After individual surfaces are documented, the final Domain 4 pass should produce a prioritized mechanization table: which prose contracts could be replaced by JSON schema + CI gate with less than two days of effort? The survey scope should include `AGENTS.md` Gate 3 triggers, `intake-contract.md` state tokens, `skill-graph-compiler.py` validation checks, and command-asset expression languages.

### 6.2 Domain 5 — Test Coverage Gaps (dedicated pass, iterations 45+)

Proposed angles carry forward from the 41-iteration snapshot. Below is the full list with governance harnesses added from iterations 42-44.

1. **Concurrent-writer harness inventory** — identify all write paths that share temp filenames or no-lock RMW and build parameterized race harnesses. Priority targets: `hook-state.ts` `updateState()`, `reconsolidation-bridge.ts` conflict lane.
2. **TOCTOU identity race harnesses** — replace stat-then-act filesystem operations with harnesses that inject file swaps between the two syscalls. Targets: `loadMostRecentState()` stat-then-read, `cleanStaleStates()` stat-then-unlink, `clearCompactPrime()` read-then-clear.
3. **Malformed-state harness inventory** — inject truncated JSON, schema-drifted state, and missing-field states into all JSON-parsing paths. Targets: `hook-state.ts`, `graph-metadata-parser.ts`, `shared-payload.ts`.
4. **Fail-open fallback branch harness** — for each swallowed exception identified in Domain 1, create a test that injects the exception and asserts explicit downstream behavior rather than silent fallback.
5. **Regression-suite dishonesty audit** — enumerate tests that assert collapsed or degraded state as success. Each identified test should be converted to a negative test asserting the failure mode.
6. **End-to-end save-path integration tests** — currently mostly helper-level. Add at least one end-to-end path covering: `memory-save.ts` → `reconsolidation-bridge.ts` → SQLite write → `session-stop.ts` autosave read-back.
7. **End-to-end hook-based session lifecycle** — currently mostly unit-level. Add a session lifecycle test that exercises start → compact-inject → stop hook in sequence, verifying token accounting and state continuity.
8. **Cross-runtime (Claude ↔ Gemini) parity tests** — verify that `hook-state.ts` and `compact-cache` behavior is equivalent across runtime paths. Targets: `session-prime.ts` vs `compact-inject.ts` for compact payload handling.
9. **Governance string-contract harnesses** (from Domain 4): ensure `intake-contract.md` token vocabulary matches YAML asset branch strings; ensure Gate 3 trigger words produce consistent results across runtime configurations.
10. **Routing metadata harnesses** — tests asserting that `intent_signals`, `SKILL.md` keyword comments, and compiler output all influence live routing scores (unlocked by A1 and A2 fixes).
11. **Command-asset predicate harnesses** — tests exercising `when:` YAML predicates across all plan/complete/implement/deep-research assets with known `TRUE`/`FALSE` and token-vocabulary inputs (unlocked by B2 fix).
12. **Concurrency in reconsolidation** — conflict fork (R35-001), complement duplicate (R34-002), assistive stale-recommendation (R36-002, R37-003) — all require multi-goroutine/multi-process harnesses that are not present in any current test file.

### 6.3 Files with Unanswered Questions (as of iteration 44)

| File | Open question |
| ---- | ------------- |
| `mcp_server/lib/code-graph/ensure-ready.ts` | Does `setLastGitHead()` on partial-persistence success block later stale detection for the unpersisted files? (Iteration 5, still unconfirmed) |
| `mcp_server/handlers/code-graph/context.ts` | Does this inherit the readiness-fail-open from `code_graph_query`? (Iteration 5 hint, not fully audited) |
| `mcp_server/lib/search/graph-lifecycle.ts` | Does `onIndex()` `skipped: true` under three different conditions have the same semantics as `post-insert.ts`'s boolean collapses? |
| `mcp_server/lib/storage/reconsolidation.ts` | Does `executeMerge()` CAS also check governance scope, or only `updated_at` + `content_hash`? |
| `mcp_server/lib/search/entity-linker.ts` | Is the stale-entity blast radius per-memory or cross-memory? (R7-002 did not fully investigate) |
| `mcp_server/handlers/memory-save.ts` | What is the real timeline between reconsolidation planning and `writeTransaction` acquisition under load? |
| `mcp_server/hooks/claude/shared.ts:109-123` | Can a crafted `producer` string containing `]` or newline break the `[PROVENANCE:]` marker? (R10-002 identifies risk, not confirmed) |
| `mcp_server/hooks/claude/compact-inject.ts` | Does it use the same unlocked `updateState()` pattern, or serialize on a different path? |
| `skill/skill-advisor/scripts/skill_advisor.py` | **Are the `INTENT_BOOSTERS` / `PHRASE_INTENT_BOOSTERS` tables generated from `SKILL.md` metadata at any point, or fully manual? If manual, what is the synchronization discipline?** [NEW since 41] |
| `command/spec_kit/assets/` (YAML assets other than plan) | Do `complete`, `implement`, `deep-research` assets use the same unsigned boolean DSL (`intake_only == TRUE`, `folder_state == populated`) as the plan assets? [NEW since 41] |
| `.opencode/skill/skill-advisor/feature_catalog/04--testing/02-health-check.md` | Is the documented 20-vs-21 skill count divergence intentional design or a tracking artifact? Should the delta be a health-warning threshold? [NEW since 41] |
| `skill/skill-advisor/scripts/skill_advisor.py` — `INTENT_BOOSTERS` / `PHRASE_INTENT_BOOSTERS` tables | Are these tables generated from `SKILL.md` metadata at any point, or fully manual? If manual, what is the synchronization discipline and how many entries are stale or duplicated relative to live skill descriptions? [NEW since 41] |
| `command/spec_kit/assets/` — `complete`, `implement`, `deep-research` YAML assets | Do these assets use the same unsigned boolean DSL (`intake_only == TRUE`, `folder_state == populated`) as the plan assets? If so, how many branch points share the vulnerability? [NEW since 41] |
| `skill/skill-advisor/scripts/skill_advisor_runtime.py` — synthetic command-bridge entries in `get_skills()` | Does the command-bridge discovery step produce routing records with the same field structure as SKILL.md-discovered skills? Are any routing fields missing for command bridges that could cause silent null-score gaps? [NEW since 41] |
| `skill/system-spec-kit/mcp_server/scripts/tests/manual-playbook-runner.ts` — `preclassifiedUnautomatableReason()` | How many scenarios are currently gated via filename substring checks vs scenarios with explicit metadata? Is there an authoritative count? If the count is large, the migration cost for Chain C2 is higher than estimated. [NEW since 41] |

---

## Appendix A — Finding Catalog: Iterations 42-44 [NEW since 41]

*Format: `RN-NNN` | File:lines | Severity | Short description*
*For R1-001 through R41-004, see Appendix A in `interim-synthesis-41-iterations.md`.*

```
R42-001 | spec_kit_plan_auto.yaml:375-392; spec_kit_plan_confirm.yaml:400-416; plan.md:96-98; transcript-planner-export.vitest.ts:146-217 | P2 | intake_only == TRUE/FALSE is an unsigned string DSL with no pinned interpreter contract; no test exercises the predicate
R42-002 | skill_advisor_runtime.py:93-97,165-203; skill_advisor.py:1185-1200,1841-1888; graph-metadata.json:1-37; 02-health-check.md:18-20; test_skill_advisor.py:141-165 | P2 | routing authority split: runtime discovery vs graph inventory; health_check returns ok despite live 20-vs-21 count mismatch
R42-003 | manual-playbook-runner.ts:319-375,983-1016 | P2 | automation eligibility decided by filename path substrings and prose-shaped command parsing; renaming a file can change coverage status without any governance field change
R43-001 | skill_advisor_runtime.py:111-141,165-203; skill_advisor.py:105-116,140-152,180-187,1669-1694; graph-metadata.json:31-50; 008-semantic-search-routing.md:59-73; skill-graph-schema.vitest.ts:1-12,40-156 | P1 | live skill router does not consume intent_signals or derived.trigger_phrases; scoring is exclusively from hard-coded booster tables; graph-metadata phrase "natural language code retrieval" confirmed inert in live repro (2026-04-16)
R43-002 | spec_kit_plan_auto.yaml:343-372,375-392; plan.md:93-99; transcript-planner-export.vitest.ts:146-217; memory-save-planner-first.vitest.ts:12-214 | P2 | /spec_kit:plan Step 0 folder_state and intake_only branches are untyped string predicates with no automated coverage of the predicate evaluation itself
R44-001 | skill_graph_compiler.py:501-568; graph-metadata.json:37-42; skill_advisor.py:105-189,250-339,1185-1200,1629-1694; test_skill_advisor.py:61-186 | P1 | intent_signals compiled into graph, loaded into in-memory signals map, but no scoring consumer reads the signals field; discard is silent at analyze_request() boundary
R44-002 | sk-deep-research/SKILL.md:1-10; system-spec-kit/SKILL.md:1-8; skill_advisor_runtime.py:38-64,111-141,165-203; test_skill_advisor.py:61-186 | P2 | parse_frontmatter_fast() exits at closing --- and discards <!-- Keywords: ... --> comment blocks; skill-file keyword vocabularies never reach routing records
R44-003 | spec_kit_plan_auto.yaml:375-392; spec_kit_plan_confirm.yaml:400-417; transcript-planner-export.vitest.ts:146-217 | P2 | both plan workflow assets use "intake_only == TRUE"/"intake_only == FALSE" as string conditions; no shared boolean grammar definition; no test validates predicate semantics
```

---

---

## Appendix B — Domain 4 Finding Severity and Fix-Chain Cross-Reference

All findings R41-001 through R44-003 mapped against fix chains defined in §5.4:

| Finding | Severity | Fix chain | Status |
| ------- | -------- | --------- | ------ |
| R41-001 | P2 | B1 | Vocabulary fix, prerequisite for B2 |
| R41-002 | P2 | B4 | Independent; Gate 3 classifier extraction |
| R41-003 | P1 | A4 | Depends on A2 first |
| R41-004 | P1 | C3 | Depends on C1 first |
| R42-001 | P2 | B2 | Depends on B1 |
| R42-002 | P2 | A5 | Depends on A3 |
| R42-003 | P2 | C1 → C2 | C1 independent; C2 after C1 |
| R43-001 | P1 | A2 | Independent; highest-value Domain 4 fix |
| R43-002 | P2 | B2 | Depends on B1 |
| R44-001 | P1 | A2 (consolidates R43-001) | Same scoring-path fix |
| R44-002 | P2 | A1 | Independent; lowest-effort, high-signal |
| R44-003 | P2 | B2 | Depends on B1 |

**Fastest path to closing all P1s in Domain 4:** A2 (wire `intent_signals`) → A4 (promote topology checks to hard errors) + C1 → C3 (playbook schema). Three distinct work items; A4 and C1 can run in parallel after A2 and C1 respectively.

**Cross-domain dependency note:** Domain 4 P1 fixes (A2, C3) are independent of Domain 3 P1 fixes. Domain 3 fixes all involve TypeScript runtime changes to `session-stop.ts`, `hook-state.ts`, and `reconsolidation.ts`. Domain 4 fixes involve Python (`skill_advisor.py`, `skill_graph_compiler.py`) and TypeScript in a separate test-and-governance stack. A team can parallelize Domain 3 and Domain 4 work without conflict, with the exception of B3 (test suite additions to `transcript-planner-export.vitest.ts`) which shares the same test file as a Domain 3 test target (R41-001 regression). B3 should be coordinated to avoid merge conflicts in that file.

---

**End of interim synthesis.**

- **Total distinct findings through iteration 44:** ~51
- **Files flagged:** 27
- **P1 volume (raw/distinct):** 58 raw / ~30 distinct
- **P2 volume (raw/distinct):** 47 raw / ~21 distinct
- **Domain 3:** complete (10/10)
- **Domain 4:** in progress (4/10; 13 findings across iterations 41-44, 4 P1 and 9 P2)
- **Domain 5:** not yet started as a dedicated domain
- **Most significant new finding class:** R43-001 / R44-001 (P1) — `intent_signals` compiled, loaded, and discarded; graph-level routing vocabulary permanently inert while appearing mechanically wired. Confirmed by live repro on 2026-04-16.
- **Most structurally revealing new theme:** three-vocabulary routing architecture (§3.4) — infrastructure complete through compile/load/store but signal discard is silent and has no health, log, or test visibility.
- **New P0 escalation:** none from iterations 42-44; P0-candidate-D (Domain 4 interaction watch cluster) remains at watch status pending evidence that routing misdirection chains into file-modifying outcomes.
- **Next useful increment:** continue Domain 4 at iteration 45 (Gate 3 semantic overbreadth pass with concrete prompt examples), implement Chain A quick wins (A1, A2 in parallel) as the highest-return Domain 4 code changes, then dedicate iteration 50 to a full Domain 5 harness inventory. At the current rate (3.25 findings/iteration), iterations 45-50 are projected to yield 15-20 additional findings, most likely distributed across Domain 4 surfaces and Domain 5 test-coverage audit. Total finding count through iteration 50 is projected at 66-71 raw, ~58-63 distinct.
