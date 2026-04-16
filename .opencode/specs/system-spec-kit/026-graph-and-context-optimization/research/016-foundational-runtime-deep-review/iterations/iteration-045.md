# Iteration 45 — Domain 4: Stringly Typed Governance (5/10)

## Investigation Thread
I re-audited the remaining Domain 4 seams that were still unclaimed after iterations 41-44: concrete Gate 3 false positives from `AGENTS.md` trigger words, live routing brittleness from `skill_advisor.py` keyword dictionaries, whether `skill_graph_compiler.py` soft-validation state survives into runtime health, and whether the manual playbook runner can silently lose scenario coverage when markdown drifts. I also re-checked the previously reported `/spec_kit:plan` `TRUE`/`FALSE` expression DSL and the raw `Function(...)` object-literal execution path, but those remained duplicates of earlier findings rather than new ones.

## Findings

### Finding R45-001
- **File:** `AGENTS.md`; `.claude/skills/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md`; `.opencode/command/spec_kit/plan.md`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts`
- **Lines:** `AGENTS.md:182-186`; `002-confirm-mode-checkpointed-review.md:26-32`; `plan.md:86-89`; `memory-save-planner-first.vitest.ts:12-214`
- **Severity:** P2
- **Description:** Gate 3's trigger list is overbroad enough to classify read-only review/research prompts as file-modifying work. The list treats `analyze`, `decompose`, and `phase` as hard-block triggers for the spec-folder question, so prompts that merely discuss lifecycle phases or validation can trip setup even when they request no file mutation.
- **Evidence:** `AGENTS.md` says Gate 3 fires on the literal trigger list `... configure, analyze, decompose, phase ...` before any analysis or tool calls. A shipped manual-testing scenario for `/spec_kit:deep-review:confirm` is purely read-only, yet its prompt asks the agent to confirm that approval gates exist at each `phase transition` and return a pass/fail verdict. `/spec_kit:plan` explicitly delegates trigger matching to `AGENTS.md`, while the nearby Vitest file exercises planner-response payload serialization only and never tests Gate 3 prompt classification.
- **Downstream Impact:** Manual-testing, deep-review, and deep-research prompts can be interrupted by an unnecessary spec-folder question purely because they mention phases or analysis. That makes prompt wording, not actual mutation intent, decide whether autonomous/read-only workflows are allowed to proceed.

### Finding R45-002
- **File:** `.opencode/skill/skill-advisor/scripts/skill_advisor.py`; `.opencode/skill/skill-advisor/tests/test_skill_advisor.py`
- **Lines:** `skill_advisor.py:568-577`; `skill_advisor.py:771-813`; `skill_advisor.py:1669-1694`; `test_skill_advisor.py:73-186`
- **Severity:** P2
- **Description:** The advisor's hand-maintained keyword dictionaries create high-confidence review false positives for legitimate deep-research prompts. `deep research` is boosted through phrase tables, but generic `audit`/`review` tokens independently add large review boosts with no disambiguation layer or ranking-stability test to prove research prompts stay safely above review prompts.
- **Evidence:** `INTENT_BOOSTERS` and `PHRASE_INTENT_BOOSTERS` separately reward `audit`, `review`, `deep research`, `research loop`, and related phrases, and `analyze_prompt()` simply accumulates all matching boosts. A live probe on 2026-04-16 with `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "Deep research review of stringly typed governance runtime seams" --threshold 0.0` returned `sk-deep-research` at `0.95`, `sk-code-review` at `0.93`, and `sk-deep-review` at `0.70`; a second probe with `Audit runtime seams with autonomous deep investigation and iterative research` tied `sk-deep-research` and `sk-deep-review` at `0.95`. The current test file only checks generic prompt handling, result shape, and health keys; it does not pin ranking margins or domain disambiguation for deep-research prompts that contain audit/review vocabulary.
- **Downstream Impact:** Gate 2 auto-routing is wording-sensitive. Small prompt edits that add audit/review language to a research task can fan out irrelevant review skills or flip the winner on future scoring changes, even though the user intent remains "continue deep research."

### Finding R45-003
- **File:** `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py`; `.opencode/skill/skill-advisor/tests/test_skill_advisor.py`
- **Lines:** `skill_graph_compiler.py:559-568`; `skill_graph_compiler.py:630-663`; `skill_advisor.py:1841-1888`; `test_skill_advisor.py:141-165`
- **Severity:** P1
- **Description:** Soft-validation state from the skill-graph compiler is non-durable: warnings are printed during compilation, but they are neither serialized into the compiled graph nor surfaced by runtime health. Once the graph is loaded, operators can only see "loaded" versus "not loaded," not "loaded with topology warnings."
- **Evidence:** `compile_graph()` emits only `schema_version`, counts, families, adjacency, signals, conflicts, and hub skills; it drops symmetry/weight/zero-edge warning data entirely. The CLI prints warning sections such as `ZERO-EDGE WARNINGS` and still returns success in `--validate-only` mode. `health_check()` then reports only loadability/count metadata. Live repro on 2026-04-16 showed `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` emitting `ZERO-EDGE WARNINGS` for `sk-deep-research` and `sk-git`, while a same-session `health_check()` payload still returned `"status": "ok"` and `"skill_graph_loaded": true`. The automated test file asserts only that health returns expected keys and that `get_skills()` is populated.
- **Downstream Impact:** A graph with known topology degradations can look fully healthy to operators and automation as soon as it loads. That hides routing-authority degradation behind a success-shaped health probe and makes warning triage ephemeral instead of inspectable at runtime.

### Finding R45-004
- **File:** `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts`; `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation/002-full-playbook-execution/spec.md`
- **Lines:** `manual-playbook-runner.ts:245-271`; `manual-playbook-runner.ts:1203-1217`; `manual_testing_playbook.md:196-230`; `spec.md:131-134`
- **Severity:** P1
- **Description:** The manual playbook runner silently drops active scenario files when their markdown no longer matches the parser's expected prompt/expected-signals shapes. Parse failure returns `null`, `main()` filters those entries out before coverage totals, and the runner logs only the reduced definition count as the "active scenario" set.
- **Evidence:** `parseScenarioDefinition()` returns `null` when prompt/expected blocks are absent, and `main()` immediately removes those nulls with `.filter((value): value is ScenarioDefinition => value !== null)` before logging `discovered ${definitions.length} active scenario files`. The manual playbook contract says release readiness requires `COVERED_SCENARIOS == TOTAL_SCENARIOS`, and the 009 remediation spec explicitly requires that no active scenario files are silently dropped. A live probe on 2026-04-16 against the current tree counted `291` active scenario files and found `10` unparseable under the runner's own parser, including `01--retrieval/001-context-recovery-and-continuation.md`, `13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md`, and `16--tooling-and-scripts/184-gemini-runtime-path-resolution.md`.
- **Downstream Impact:** Coverage reports can undercount the live playbook without emitting a failure. Scenario drift in markdown formatting can quietly remove regression checks from the runner, so release-readiness and "all active scenarios covered" claims stop reflecting the actual active tree.

## Novel Insights
- The most consequential unclaimed Domain 4 failures were not the already-documented string interpreters themselves, but the **loss-of-signal layers around them**: false-positive gate activation, ranking brittleness, warning amnesia, and silent scenario disappearance.
- `spec_kit_plan_auto.yaml` and the manual playbook runner show the same deeper pattern from different sides: once governance lives in prose-shaped strings, the system has no reliable way to distinguish "not applicable," "invalid," and "quietly skipped."
- The skill-routing stack now has two separate success-shaped blind spots: hand-maintained keyword boosts that overfit wording, and graph-health surfaces that forget compile-time warning context as soon as the graph loads.

## Next Investigation Angle
Stay in Domain 4, but move from static vocabularies to the interpreters that consume them: trace the actual command/YAML `when:` evaluator used by `/spec_kit:*` assets, then audit whether any other runner/reducer surfaces silently coerce invalid string states into "skip" or "ok" outcomes instead of preserving typed failure information.
