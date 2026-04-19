# Iteration 41 — Domain 4: Stringly Typed Governance (1/10)

## Investigation Thread
I audited governance surfaces where prose or string tokens decide runtime behavior without a mechanically shared validator: Gate 3 trigger delegation in `AGENTS.md`, `/spec_kit:plan` intake-state expressions, advisory-only skill-graph checks, and the manual playbook runner's markdown-to-code path. I also reviewed `skill_advisor.py`'s routing tables, but avoided repeating the already-recorded hyphen/phrase tokenization defects.

## Findings

### Finding R41-001
- **File:** `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`; `.opencode/command/spec_kit/plan.md`; `.opencode/skill/system-spec-kit/references/intake-contract.md`; `.opencode/skill/system-spec-kit/mcp_server/tests/transcript-planner-export.vitest.ts`
- **Lines:** `spec_kit_plan_auto.yaml:338-355,371-372`; `plan.md:93-99`; `intake-contract.md:66-77,217-222`; `transcript-planner-export.vitest.ts:146-217`
- **Severity:** P2
- **Description:** The autonomous plan workflow uses a private `folder_state` vocabulary (`... | populated`) that diverges from the canonical intake contract's healthy-state token (`populated-folder`). Because the branch conditions are prose strings rather than parsed enums, the "skip intake" path depends on the interpreter reconciling two different state languages.
- **Evidence:** `spec_kit_plan_auto.yaml` classifies `folder_state` as `no-spec | partial-folder | repair-mode | placeholder-upgrade | populated`, then gates `on_skip.when: "folder_state == populated"` while only mapping `start_state` to `populated-folder` (`spec_kit_plan_auto.yaml:338-355,371-372`). The operator-facing plan contract and canonical intake reference both define the healthy state as `populated-folder` and say that state should skip or no-op the intake block (`plan.md:93-99`; `intake-contract.md:66-77,217-222`). The nearby planner export suite only asserts downstream `planned`/`blocked` response summaries and never exercises these Step 0.5 string conditions (`transcript-planner-export.vitest.ts:146-217`).
- **Downstream Impact:** Already-healthy packets can be reclassified differently across runtimes or prompt revisions, causing avoidable intake prompts, inconsistent `folderState` event payloads, and drift between what `/spec_kit:plan` tells operators and what the autonomous YAML actually instructs.

### Finding R41-002
- **File:** `AGENTS.md`; `.opencode/command/spec_kit/plan.md`; `.opencode/command/spec_kit/complete.md`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts`
- **Lines:** `AGENTS.md:182-186`; `plan.md:86-89`; `complete.md:74-77`; `memory-save-planner-first.vitest.ts:12-214`
- **Severity:** P2
- **Description:** Gate 3 spec-folder detection is still governed by an English trigger-word list in `AGENTS.md`, and both `/spec_kit:plan` and `/spec_kit:complete` explicitly outsource the decision to that document instead of a shared parser or schema. The rule that decides whether setup must halt for a spec-folder question is therefore a prose contract, not executable governance.
- **Evidence:** `AGENTS.md` says Gate 3 fires on the literal trigger list `rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase` (`AGENTS.md:182-186`). Both planning and completion docs then state `Gate 1 trigger matching handled at agent level (AGENTS.md)` instead of defining a local or shared classifier (`plan.md:86-89`; `complete.md:74-77`). The nearby planner-first response suite covers response shaping only; it does not verify Gate 3 trigger classification at all (`memory-save-planner-first.vitest.ts:12-214`).
- **Downstream Impact:** Different runtimes, prompt packs, or instruction edits can decide differently on the same request about whether Gate 3 must interrupt execution. That undermines the repository's claim that spec-folder gating is mandatory and consistent across agents.

### Finding R41-003
- **File:** `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py`; `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`; `README.md`; `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts`
- **Lines:** `skill_graph_compiler.py:272-353,630-663`; `skill_advisor.py:203-239,255-265`; `manual_testing_playbook.md:215-221`; `README.md:614-619`; `skill-graph-schema.vitest.ts:1-12,40-156`
- **Severity:** P1
- **Description:** Skill-graph topology checks are intentionally advisory even though the resulting graph is later loaded as routing authority. Symmetry, weight-band, weight-parity, and orphan-skill problems print warnings, `--validate-only` still returns success, and the advisor then consumes the compiled graph for relationship-aware boosts.
- **Evidence:** The compiler labels symmetry and weight checks as `soft validation` and only increments `total_errors` for schema violations or two-node dependency cycles (`skill_graph_compiler.py:272-353,630-663`). `skill_advisor.py` auto-loads the compiled SQLite/JSON graph before applying graph boosts and family affinity (`skill_advisor.py:203-239,255-265`). The shipped manual playbook explicitly expects `CP-002` zero-edge warnings to appear "without failing validation," and the top-level README advertises `skill_graph_compiler.py --validate-only` as validation for schema, weight-band, and symmetry checks (`manual_testing_playbook.md:215-221`; `README.md:614-619`). The nearby automated `skill-graph-schema` suite is only a dispatcher/input-validation test for MCP tool routing, not a compiler-invariant gate (`skill-graph-schema.vitest.ts:1-12,40-156`).
- **Downstream Impact:** Graph metadata can violate the routing model's own recommended invariants and still produce a success-shaped validation result, letting asymmetric or weakly connected graph data silently bias skill recommendations and operator trust in `--validate-only`.

### Finding R41-004
- **File:** `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts`
- **Lines:** `manual-playbook-runner.ts:224-246,251-317,438-445`
- **Severity:** P1
- **Description:** The manual playbook runner converts repository markdown into executable JavaScript. It recursively ingests every scenario `.md` file under `manual_testing_playbook/`, extracts command/object-literal fragments from prose, substitutes placeholders, and executes the result with `Function(...)`.
- **Evidence:** `readScenarioFiles()` walks the playbook tree and collects every markdown scenario except the root index (`manual-playbook-runner.ts:224-243`). `parseScenarioDefinition()` reads raw markdown text and lifts command blocks or table cells into `commandSequence` strings (`manual-playbook-runner.ts:245-317`). When a step argument starts with `{`, `parsedStepArgs()` routes it to `evaluateObjectLiteral()`, which performs placeholder substitution and then executes `Function(\`return (${replaced});\`)()` with no parser sandbox or schema validation (`manual-playbook-runner.ts:191-194,438-445`).
- **Downstream Impact:** A malformed or unexpectedly edited playbook scenario can turn documentation drift into arbitrary Node-side execution during local or CI validation. Instead of failing as invalid test data, the runner treats markdown as code.

## Novel Insights
- The unclaimed Domain 4 problems are not just "docs drift"; they are **control-plane drift** where canonical state names, gate triggers, and validation outcomes are all expressed as strings that different layers interpret differently.
- The strongest new pattern is **success-shaped governance**: `/spec_kit:plan` setup, `skill_graph_compiler.py --validate-only`, and `manual-playbook-runner.ts` all accept or execute string-defined behavior without a typed contract proving that the strings still mean the same thing everywhere.
- `skill_advisor.py`'s previously documented tokenization defects now look like one instance of a broader issue: repository governance relies on manually synchronized vocabularies across docs, YAML assets, Python tables, and markdown playbooks.

## Next Investigation Angle
Stay in Domain 4, but move one layer deeper into the skill-routing and command assets: audit whether `skill_advisor.py`'s hand-maintained keyword/phrase tables have any generated sync against discovered `SKILL.md` metadata, and then trace whether the same `folderState` / Gate 3 vocabularies leak into emitted events, reducers, or follow-up commands beyond `/spec_kit:plan`.
