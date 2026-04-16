# Iteration 49 — Domain 4: Stringly Typed Governance (9/10)

## Investigation Thread
I targeted the remaining unclaimed governance seams after iterations 41-47: whether `AGENTS.md` still has false-negative setup paths for write operations, whether `spec_kit_plan_auto.yaml` mixes executable and narrative condition contracts under the same key, and whether `skill_graph_compiler.py`'s "hard" validation actually covers the full dependency language it claims to validate.

## Findings

### Finding R49-001
- **File:** `AGENTS.md`
- **Lines:** `AGENTS.md:142-144`; `AGENTS.md:182-186`; `AGENTS.md:201-204`
- **Severity:** P2
- **Description:** `AGENTS.md` now governs write intent through two unsynchronized string classifiers. Gate 3 says *any* file modification must be intercepted up front by the trigger-word list, but that list does not include `save`; the same document later introduces a separate hard-block `MEMORY SAVE RULE` keyed on `"save context"`, `"save memory"`, and `/memory:save`.
- **Evidence:** The Gate 3 trigger list is the literal prose set `rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase` (`AGENTS.md:182-186`). The same file separately documents `/memory:save` as a context-writing workflow (`AGENTS.md:142-144`) and then adds a second trigger surface - `Trigger: "save context", "save memory", /memory:save, continuity update` - under `MEMORY SAVE RULE` (`AGENTS.md:201-204`). Nearby automated coverage exercises memory-save handler behavior and planner/export payloads (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1-84`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts:12-214`; `.opencode/skill/system-spec-kit/mcp_server/tests/transcript-planner-export.vitest.ts:146-217`), but none of those suites reconcile Gate 3 classification with the later memory-save trigger surface.
- **Downstream Impact:** Equivalent write requests take different governance paths depending on wording. A prompt like "save context" bypasses the declared "priority gate" classifier and is only caught later by a separate rule, so spec-folder setup behavior depends on prose phrasing rather than one shared executable mutation classifier.

### Finding R49-002
- **File:** `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- **Lines:** `spec_kit_plan_auto.yaml:354`; `spec_kit_plan_auto.yaml:372`; `spec_kit_plan_auto.yaml:380`; `spec_kit_plan_auto.yaml:391`; `spec_kit_plan_auto.yaml:555`
- **Severity:** P2
- **Description:** `spec_kit_plan_auto.yaml` overloads the same `when:` field with two incompatible meanings: boolean-like control-flow expressions and free-form narrative timing prose. There is no local schema or nearby regression that mechanically distinguishes "evaluate this" from "read this as documentation."
- **Evidence:** Earlier control gates use `when:` as an expression DSL - `folder_state != populated`, `folder_state == populated`, `intake_only == TRUE`, and `intake_only == FALSE` (`spec_kit_plan_auto.yaml:354,372,380,391`). The same key later carries the prose sentence `Immediately after the canonical spec document is refreshed on disk` (`spec_kit_plan_auto.yaml:555`). Existing nearby tests validate memory-save planner/export behavior instead of command-asset interpretation (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-planner-first.vitest.ts:12-214`; `.opencode/skill/system-spec-kit/mcp_server/tests/transcript-planner-export.vitest.ts:146-217`), so there is no automated contract pinning what `when:` means in this asset.
- **Downstream Impact:** Any tool, interpreter, or future validator that treats `when` uniformly can mis-handle part of the workflow: either prose notes get mistaken for executable predicates, or real branch conditions get downgraded to comments. That makes post-save indexing/order-of-operations drift easy to ship without a syntax or schema failure.

### Finding R49-003
- **File:** `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`
- **Lines:** `skill_graph_compiler.py:437-472`; `skill_graph_compiler.py:623-663`
- **Severity:** P1
- **Description:** The compiler's only hard dependency-cycle check is a two-node reciprocal-edge detector. Longer `depends_on` loops remain valid according to `--validate-only`, even though they encode the same broken dependency contract in the graph that later drives routing and operator trust.
- **Evidence:** `validate_dependency_cycles()` is explicitly documented as `Detect simple two-node depends_on cycles (A -> B -> A)` and only errors when `skill_id` appears directly in `depends_on_lookup[target]` (`skill_graph_compiler.py:437-472`). `main()` treats that function's output as the entire dependency-cycle error surface before printing `VALIDATION PASSED` and returning success (`skill_graph_compiler.py:623-663`). A live repro on 2026-04-16 with a synthetic three-node graph returned `{"two_node": ["depends_on cycle detected: a -> b -> a"], "three_node": []}`, confirming that `a -> b -> c -> a` passes validation. Existing automated coverage still stops at MCP dispatcher routing and advisor shape/health checks (`.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:1-12,40-156`; `.opencode/skill/skill-advisor/tests/test_skill_advisor.py:61-186`); there is no compiler invariant test for non-trivial cycles.
- **Downstream Impact:** Maintainers can ship cyclic dependency metadata that passes the repository's advertised validation command and still feeds the compiled graph consumed by routing. That weakens the meaning of `depends_on` from a validated governance contract into a partially checked convention.

## Novel Insights
- The open Domain 4 seams are now less about missing docs and more about **split interpreters for the same field names**: `save` intent is governed by a second trigger surface, `when:` means both predicate and prose, and "dependency cycle validation" only covers one specific graph shape.
- The most important remaining pattern is **success-shaped partial validation**. These surfaces look mechanized - a hard block, a `when:` field, a cycle validator - but each still leaves materially different string cases outside the checked contract.

## Next Investigation Angle
Trace the actual consumers of these strings in the final Domain 4 pass: the runtime that evaluates command-asset `when:` clauses, any reducer/reporting surface that treats Gate 3 or memory-save setup as a single classifier, and any graph consumer that assumes `depends_on` is globally acyclic because `skill_graph_compiler.py --validate-only` succeeded.
