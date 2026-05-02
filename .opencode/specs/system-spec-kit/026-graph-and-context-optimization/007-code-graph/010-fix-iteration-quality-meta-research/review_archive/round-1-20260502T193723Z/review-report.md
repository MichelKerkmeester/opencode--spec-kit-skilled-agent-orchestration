# Deep Review Report v1 — 010 R1-R8 Implementation

**Generated:** 2026-05-02T18:55:39Z
**SessionId:** 2026-05-02T18:41:40Z
**Iterations:** 5
**Executor:** cli-copilot gpt-5.5

## Iteration narratives

### Iteration 1

## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:252-267`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:473-488`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:771-786`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:80-90`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:223-233`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:438-448`
- `.opencode/skill/sk-code-review/SKILL.md:288-320`
- `.opencode/skill/sk-deep-review/references/convergence.md:43-53`
- `.opencode/skill/sk-deep-review/references/convergence.md:381-388`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-215`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-560`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:214-221`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`
- `.opencode/agent/deep-review.md:146-179`
- `.opencode/agent/deep-review.md:204-224`
- `.opencode/skill/sk-deep-review/references/state_format.md:176-204`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

1. **Planning Packet fields are report-only and do not flow into `/spec_kit:plan`.** The deep-review synthesis contract now requires a `Planning Packet` with `findingClasses`, `affectedSurfacesSeed`, and `fixCompletenessRequired`, but the plan command surfaces only add a generic "Generate Affected Surfaces table for fix_bug/remediation packets" activity and do not name or consume those fields. Same-class inventory: `rg -n 'Planning Packet|findingClasses|affectedSurfacesSeed|fixCompletenessRequired|affectedSurfaceHints|scopeProofNeeded|findingClass' .opencode --glob '*.{md,yaml,ts,js,cjs,mjs}'` found the new packet-field requirements in the deep-review synthesis workflow and no matching `/spec_kit:plan` consumer beyond generic affected-surfaces headings. This means a CONDITIONAL/FAIL review report can ask for fix-completeness data, but the follow-on plan flow has no explicit extraction path for the new seed fields. [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1055`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1077`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-560`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`]

2. **The deep-review iteration/state contract does not collect the fields that the final report is required to emit.** R7 requires each active finding in `review-report.md` to include `findingClass`, `scopeProofNeeded`, and `affectedSurfaceHints`, but the LEAF agent's finding template only captures title, file:line, description, and claim-adjudication JSON, and the JSONL schema's required/optional fields omit those fix-completeness fields. Cross-consumer impact: synthesis can only infer classes from prose or invent them, so the Planning Packet fields are not grounded in reducer-owned state. [SOURCE: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1052-1055`; `.opencode/agent/deep-review.md:146-179`; `.opencode/agent/deep-review.md:204-224`; `.opencode/skill/sk-deep-review/references/state_format.md:190-204`]

3. **The plan command inline scaffold renders only the FIX ADDENDUM heading, not the required body/table/inventories.** R1 correctly adds the full affected-surfaces body to all four manifest plan levels, including the producer/consumer/matrix/invariant inventory prompts; however, the `/spec_kit:plan` YAML inline scaffold used by the command contains only `<!-- ANCHOR:affected-surfaces --> ## FIX ADDENDUM: AFFECTED SURFACES`. Because the plan workflow explicitly says to embed `template_compliance.inline_scaffolds.plan_md`, the command path can produce a bare addendum heading unless the generic activity text is manually expanded. Matrix completeness for R1 passes at the manifest level (4/4 levels present), but cross-consumer rendering is incomplete in the command scaffold. [SOURCE: `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`; `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:252-267`; `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:473-488`; `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:771-786`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-215`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-560`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:214-221`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`]

### P2

None.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

CONDITIONAL — R1/R2/R4/R5/R6/R8 are locally present, but R3/R7 have cross-consumer gaps that can drop or force inference for the new fix-completeness fields in downstream planning and final report synthesis.

## Confidence — 0.0-1.0

0.86

---

### Iteration 2

## Dimension: traceability

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-005.md:7-63`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-005.md:64-117`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-005.md:118-170`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-005.md:171-211`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-005.md:308-431`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-005.md:560-567`
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36-85`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:252-267`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:473-488`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:771-786`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:81-89`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:224-232`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:439-447`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-215`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-568`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:212-221`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-617`
- `.opencode/skill/sk-code-review/SKILL.md:87-90`
- `.opencode/skill/sk-code-review/SKILL.md:120-126`
- `.opencode/skill/sk-code-review/SKILL.md:288-320`
- `.opencode/skill/sk-code-review/references/review_core.md:75-88`
- `.opencode/skill/sk-deep-review/references/convergence.md:31-53`
- `.opencode/skill/sk-deep-review/references/convergence.md:381-425`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:478-558`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1054`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:486-566`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1069-1076`
- `.opencode/agent/deep-review.md:146-179`
- `.opencode/agent/deep-review.md:204-224`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:55-57`
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js:12`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:82-92`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/data/shadow-deltas.jsonl:173-200`
- `.opencode/skill/system-spec-kit/.opencode/skill/.advisor-state/skill-graph-generation.json:1-7`
- `README.md:905-908`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

1. **R1-R8 implementation diff includes files outside the spec-declared implementation set.** The spec's implementation summary declares the R1-R8 file set as the two manifest templates, the two plan YAMLs, `sk-code-review/SKILL.md`, `sk-code-review/references/review_core.md`, the new checklist reference, `sk-deep-review/references/convergence.md`, and the two deep-review YAMLs. `git diff --name-status HEAD -- .opencode` and `git status --short` confirmed those expected files are present, but also showed modified or untracked files outside that list: validator/template-structure changes, a prior `009` packet checklist, advisor shadow-delta data, a nested `.opencode` advisor-state file, and `README.md`. Same-class producer inventory (`rg -n "findingClass|scopeProof|affectedSurfaceHints|fixCompletenessReplay|closedGateReplay|CHK-FIX|AFFECTED SURFACES|Fix Completeness" .opencode --glob '*.{md,yaml,ts,js,cjs,mjs,tmpl}'`) explains some related consumers, but the README/advisor artifacts are not R1-R8 consumers and the related validator/checklist expansions are not documented as part of the spec scope. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-005.md:560-567`; `.opencode/skill/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:55-57`; `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js:12`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:82-92`; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/data/shadow-deltas.jsonl:173-200`; `.opencode/skill/system-spec-kit/.opencode/skill/.advisor-state/skill-graph-generation.json:1-7`; `README.md:905-908`]

### P2

None.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

CONDITIONAL — All named R1-R8 targets landed, but the current diff contains out-of-scope files that should be reverted or explicitly documented before the implementation can be considered traceable.

## Confidence — 0.0-1.0

0.88

---

### Iteration 3

## Dimension: maintainability

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36-85`
- `.opencode/skill/sk-code-review/SKILL.md:286-320`
- `.opencode/skill/sk-code-review/references/review_core.md:75-88`
- `.opencode/skill/sk-deep-review/references/convergence.md:43-53`
- `.opencode/skill/sk-deep-review/references/convergence.md:88-104`
- `.opencode/skill/sk-deep-review/references/convergence.md:381-388`
- `.opencode/skill/sk-deep-review/references/convergence.md:417-420`
- `.opencode/skill/sk-deep-review/references/convergence.md:438-442`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:480-490`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:500-548`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1054`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:508-556`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1072-1076`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:548-560`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`
- `.opencode/agent/deep-review.md:146-179`
- `.opencode/agent/deep-review.md:204-224`
- `.opencode/skill/sk-deep-review/references/state_format.md:176-204`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

1. **Fix-completeness proof field names drift between `scopeProof` and `scopeProofNeeded`.** R5 classification: `cross-consumer`. The sk-code-review finding schema defines the proof field as `scopeProof`, and the public output contract renders the same concept as "Scope proof"; the deep-review Planning Packet active-finding contract instead requires `scopeProofNeeded`. Same-class producer inventory: `rg -n 'scopeProof|scopeProofNeeded|affectedSurfaceHints|findingClass|findingClasses|requiredFixCompletenessGate|fixCompletenessRequired|fixCompletenessReplay|fix_completeness_replay_gate_pass' .opencode/skill/sk-code-review .opencode/skill/sk-deep-review .opencode/command/spec_kit .opencode/agent` found `scopeProof` only in sk-code-review and `scopeProofNeeded` only in the deep-review synthesis contract. Cross-consumer check: the LEAF agent finding template and JSONL state schema still do not collect either field, and `/spec_kit:plan` only names generic affected-surfaces generation, so a downstream consumer cannot reliably map R4's `scopeProof` evidence to R7's `scopeProofNeeded` field without convention-specific inference. Matrix completeness: the `findingClass` enum values are consistent where explicitly listed (`instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, `test-isolation`), but the paired proof field is not spelled consistently across the three surfaces. [SOURCE: `.opencode/skill/sk-code-review/SKILL.md:319-320`; `.opencode/skill/sk-code-review/references/review_core.md:86-87`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1050-1054`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1072-1076`; `.opencode/agent/deep-review.md:146-179`; `.opencode/skill/sk-deep-review/references/state_format.md:176-204`; `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-560`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-609`]

### P2

1. **`fixCompletenessRequired` has no explicit vocabulary bridge to the convergence gate names.** R5 classification: `cross-consumer`. The Planning Packet requires a camelCase boolean named `fixCompletenessRequired`, while convergence documentation and workflow state use `requiredFixCompletenessGate`, `fixCompletenessReplay`, `fixCompletenessReplayGate`, and snake_case metrics such as `fix_completeness_replay_gate_pass`. Same-class producer inventory: the same `rg` command above found no canonical row that states `fixCompletenessRequired` is the planning-facing projection of `requiredFixCompletenessGate` or `fixCompletenessReplayGate`. Cross-consumer check: convergence correctly blocks STOP for security-sensitive reruns, but the report-to-plan contract has to infer whether the planning boolean means "run full R5 checklist", "closed-gate replay required", or "security-sensitive replay gate failed". This is lower severity because it is documentation/contract maintainability drift rather than an immediate local contradiction. [SOURCE: `.opencode/skill/sk-deep-review/references/convergence.md:43-53`; `.opencode/skill/sk-deep-review/references/convergence.md:88-104`; `.opencode/skill/sk-deep-review/references/convergence.md:381-388`; `.opencode/skill/sk-deep-review/references/convergence.md:417-420`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:480-490`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:500-548`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1047-1050`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:508-556`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1072-1076`]

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

CONDITIONAL — The `findingClass` enum itself is consistent, but adjacent fix-completeness proof and planning/gate field names drift enough to require inference across sk-code-review, sk-deep-review convergence, and Planning Packet consumers.

## Confidence — 0.0-1.0

0.87

---

### Iteration 4

## Dimension: security

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36-85`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:252-267`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:473-488`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:771-786`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:80-90`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:223-233`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:438-448`
- `.opencode/skill/sk-code-review/SKILL.md:315-320`
- `.opencode/skill/sk-code-review/references/review_core.md:75-88`
- `.opencode/skill/sk-deep-review/references/convergence.md:43-53`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-215`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:514-548`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:554-568`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:562-598`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:603-617`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1038-1055`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1060-1077`
- `.opencode/command/spec_kit/plan.md:320-351`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

None.

### P2

None.

R5 dogfood notes: the suspected path-disclosure/injection concern was classified as `cross-consumer` plus `algorithmic` because it would require a report field or findings artifact to flow into `/spec_kit:plan` and then be rendered into `plan.md`. Same-class producer inventory with `rg -n 'Affected Surfaces|affectedSurfacesSeed|findingClasses|fixCompletenessRequired|findingClass|scopeProof|FIX ADDENDUM' .opencode/command/spec_kit/assets .opencode/skill/sk-code-review .opencode/skill/sk-deep-review .opencode/skill/system-spec-kit/templates/manifest --glob '*.{md,tmpl,yaml,yml}'` found `affectedSurfacesSeed` only in the deep-review synthesis packet contract, while `/spec_kit:plan` adds the static affected-surfaces scaffold, activity label, and confidence scoring but does not name or consume that packet field. Cross-consumer check found no planner parser/import path for a malicious findings file; the plan flow's file-path enumeration comes from context-agent discovery and required `rg` inventories, not from blindly replaying `affectedSurfacesSeed`. Matrix completeness is adequate for this security pass: the addendum asks for same-class producers, consumers, matrix axes, and path/redaction/parser/security invariants, and security-sensitive convergence requires fix-completeness gates before STOP.

Security caveat: context-agent prompts still ask for "Full file paths"; this can expose local absolute paths if an agent chooses absolute rather than repo-relative paths, but that wording was not introduced by the affected-surfaces seed path and is not an exploitable malicious-findings-file echo in the R1-R8 change set reviewed here.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

PASS — No R3 security issue found: affected-surface data is scaffolded and inventoried, but malicious findings-file paths are not consumed by `/spec_kit:plan` or automatically echoed into planner output.

## Confidence — 0.0-1.0

0.86

---

### Iteration 5

## Dimension: correctness

## Files Reviewed (path:line list)

- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:12-35`
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md:36-85`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:87-102`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:252-267`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:473-488`
- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl:771-786`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:80-90`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:223-233`
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl:438-448`
- `.opencode/skill/sk-code-review/SKILL.md:288-320`
- `.opencode/skill/sk-code-review/references/review_core.md:76-99`
- `.opencode/skill/sk-deep-review/references/convergence.md:80-104`
- `.opencode/skill/sk-deep-review/references/convergence.md:380-425`
- `.opencode/command/spec_kit/plan.md:13-21`
- `.opencode/command/spec_kit/plan.md:120-151`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:520-568`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:570-617`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1036-1082`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1058-1085`
- `.opencode/agent/deep-review.md:145-184`
- `.opencode/skill/sk-deep-review/references/state_format.md:170-204`

## Findings by Severity (P0/P1/P2 — say "None." if empty)

### P0

None.

### P1

1. **Planning Packet fix-completeness fields remain report-only before `/spec_kit:plan`.** R5 classification: `cross-consumer`. A sample R4 finding can now carry `findingClass` and `scopeProof` in the code-review schema (`sk-code-review/SKILL.md:288-320`; `review_core.md:76-99`). R7's synthesis contract requires a Planning Packet containing `findingClasses`, `affectedSurfacesSeed`, and `fixCompletenessRequired`, and its active registry asks for `findingClass`, `scopeProofNeeded`, and `affectedSurfaceHints` (`spec_kit_deep-review_auto.yaml:1047-1055`; `spec_kit_deep-review_confirm.yaml:1069-1077`). R3's planner, however, only says to "Generate Affected Surfaces table for fix_bug/remediation packets" and score affected-surface coverage (`spec_kit_plan_auto.yaml:554-568`; `spec_kit_plan_confirm.yaml:603-617`); it does not name or consume `affectedSurfacesSeed`, `findingClasses`, `fixCompletenessRequired`, `scopeProof`, or `scopeProofNeeded`. End-to-end result: the review report can emit the new fields, but the follow-on planner has no explicit import/mapping step that guarantees those fields populate the FIX ADDENDUM table.

   Scope proof: same-class producer inventory with `rg -n 'affectedSurfacesSeed' .opencode` found only the deep-review synthesis contract and prior review/research artifacts, not a planner consumer; `rg -n 'findingClasses' .opencode` and `rg -n 'fixCompletenessRequired' .opencode` showed the same pattern. Cross-consumer inventory with `rg -n 'scopeProofNeeded|scopeProof|findingClass|affectedSurfaceHints' .opencode/command/spec_kit` found the deep-review synthesis contract but no `/spec_kit:plan` consumer. Matrix check: R1's FIX ADDENDUM is present in all four plan template levels and R2's CHK-FIX gates are present in L2/L3/L3+, so the gap is not missing template rows; it is the R7-to-R3 handoff.

### P2

None.

R5 dogfood notes: this is not eligible for the instance-only opt-out because it is a cross-consumer contract path spanning review output, deep-review synthesis, planner YAML, and plan templates. The same-class producer and consumer inventories above were required. R6's security-sensitive STOP gate is stricter (`fixCompletenessReplay` requires producer/consumer/matrix coverage), but it does not repair the report-to-plan mapping gap.

## Verdict — PASS / CONDITIONAL / FAIL with one-line reason

FAIL — The central R4 -> R7 -> R3 correctness link is still broken: Planning Packet fields are emitted by deep-review synthesis but are not explicitly consumed by `/spec_kit:plan` when generating Affected Surfaces.

## Confidence — 0.0-1.0

0.90

---

