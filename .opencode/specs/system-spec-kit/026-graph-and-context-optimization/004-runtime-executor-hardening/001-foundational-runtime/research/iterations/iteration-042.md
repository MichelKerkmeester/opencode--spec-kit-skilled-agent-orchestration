# Iteration 42 — Domain 4: Stringly Typed Governance (2/10)

## Investigation Thread
I followed the string contracts one layer deeper than iteration 41: the boolean DSL in `/spec_kit:plan`, the split authority between `SKILL.md` discovery and skill-graph metadata in `skill_advisor.py`, and the manual playbook runner's filename-based automation gating.

## Findings

### Finding R42-001
- **File:** `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`; `.opencode/command/spec_kit/plan.md`; `.opencode/skill/system-spec-kit/mcp_server/tests/transcript-planner-export.vitest.ts`
- **Lines:** `spec_kit_plan_auto.yaml:375-392`; `spec_kit_plan_confirm.yaml:400-416`; `plan.md:96-98`; `transcript-planner-export.vitest.ts:146-217`
- **Severity:** P2
- **Description:** The `/spec_kit:plan` intake-only gate is still an interpreter-dependent string DSL. Both workflow assets bind `intake_only` and branch on the literal expressions `intake_only == TRUE` and `intake_only == FALSE`, but there is no mechanically shared enum/boolean contract proving that the command runner normalizes CLI flags to those uppercase tokens.
- **Evidence:** `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml` both treat the halt/continue decision as quoted string expressions rather than typed booleans. The operator-facing `plan.md` mirrors the same contract in prose (`folder_state == populated-folder` plus `intake_only == TRUE/FALSE`). The nearby regression coverage in `transcript-planner-export.vitest.ts` exercises `atomicSaveMemory()` planner exports, not the command-asset `when:` interpreter that would actually decide whether `--intake-only` halts before planning.
- **Downstream Impact:** A runner or prompt-engine change that emits `true/false`, `True/False`, or any non-`TRUE/FALSE` representation can silently invert the intake-only branch: operators will see the documented gate, but `/spec_kit:plan --intake-only` can either continue into planning or halt unexpectedly depending on string normalization outside the asset.

### Finding R42-002
- **File:** `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py`; `.opencode/skill/skill-advisor/graph-metadata.json`; `.opencode/skill/skill-advisor/feature_catalog/04--testing/02-health-check.md`; `.opencode/skill/skill-advisor/tests/test_skill_advisor.py`
- **Lines:** `skill_advisor_runtime.py:93-97,165-203`; `skill_advisor.py:1185-1200,1841-1888`; `graph-metadata.json:1-37`; `02-health-check.md:18-20`; `test_skill_advisor.py:141-165`
- **Severity:** P2
- **Description:** The skill-routing authority is split across two unsynchronized inventories: runtime discovery only scans top-level `*/SKILL.md` files, while the compiled skill graph includes `graph-metadata.json` nodes such as `skill-advisor`. Health stays green even when those inventories disagree.
- **Evidence:** `skill_advisor_runtime.py` discovers skills exclusively from `*/SKILL.md`, and `get_skills()` builds the runtime catalog from that result plus synthetic command bridges. Separately, `skill-advisor/graph-metadata.json` declares `skill_id: "skill-advisor"` with its own intent signals and graph edges. `health_check()` reports `status: "ok"` whenever at least one real skill is discovered and the graph loads; it never compares discovered-skill count to graph-skill count. The package's own health-check feature doc explicitly normalizes the mismatch as current reality (`20 discovered skills` vs `skill_graph_skill_count` `21`), and `test_skill_advisor.py` only asserts that health returns a few keys and that `get_skills()` is non-empty.
- **Downstream Impact:** Gate 2 can report a healthy routing stack while the direct recommendation catalog and the graph overlay disagree about the skill universe. That makes missing direct routes, stale graph-only nodes, and inventory drift hard to distinguish from intentional design, especially for operators relying on `--health` as the readiness signal.

### Finding R42-003
- **File:** `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts`
- **Lines:** `manual-playbook-runner.ts:319-375,983-1016`
- **Severity:** P2
- **Description:** Manual playbook automation eligibility is governed by filename substrings and prose-shaped command parsing, not declared scenario metadata. The runner hard-codes path fragments that force scenarios to `UNAUTOMATABLE`, then applies a second early-exit rule when parsed commands look like shell or narrative text.
- **Evidence:** `preclassifiedUnautomatableReason()` uses literal path checks such as `definition.filePath.includes('17--governance/123-')` and `definition.filePath.includes('22--context-preservation-and-code-graph/261-')` to decide eligibility. `executeScenario()` turns any such match into an immediate `UNAUTOMATABLE` result before tool execution, and also exits early when every parsed step is `shell` or `narrative`. In other words, renaming a markdown file or reformatting the command prose can change automation status without touching any typed flag in the scenario itself.
- **Downstream Impact:** Playbook coverage can drift silently as directories are reorganized or scenario prose changes. A scenario may stop being exercised by automation because of its filename or formatting rather than an explicit governance field, which makes CI/playbook results depend on naming conventions instead of declared capability boundaries.

## Novel Insights
- The string-governance problem is no longer just "docs say X, code says Y"; readiness probes and test runners are also normalizing mismatches instead of asserting them.
- Two different control planes are using separate, socially synchronized vocabularies: command assets depend on untyped `when:` expressions, while Gate 2 depends on `SKILL.md` discovery and a separate graph inventory that already disagree in the live workspace.
- The manual playbook system has its own hidden governance layer: filename conventions and prose formatting decide whether a scenario is automatable, so testing coverage itself is partly string-driven.

## Next Investigation Angle
Trace the actual interpreters for these string contracts: inspect the command runner that evaluates YAML `when:` expressions and the playbook tooling that consumes `UNAUTOMATABLE` results, then audit whether any existing validator compares `SKILL.md` discovery, command-bridge slash markers, and graph-metadata inventories for consistency.
