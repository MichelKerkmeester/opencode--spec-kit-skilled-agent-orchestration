# Review Iteration 4: D4 Maintainability — Phase 5 closeout + parent plan/tasks

## Focus

Maintainability audit of Phase 5 (operations-tail-prs) closeout artifacts and parent plan/tasks drift. Special attention to operator-facing docs (telemetry catalog, alert YAML, release notes, defer rationale).

## Scope

- Review target: Phase 5 (9 artifacts) + parent plan + parent tasks + code verification
- Dimension: maintainability

## Reviewer Backend

- **cli-codex** `/opt/homebrew/bin/codex exec`
- Model: `gpt-5.4`, reasoning=`high`, service_tier=`fast`, sandbox=`read-only`
- Elapsed: 299 s (largest so far — 20 files read including parent + all phase plans + 3 code files)

## Scorecard

| File | Maint |
|------|-------|
| 005/spec.md | **FAIL** |
| 005/plan.md | partial |
| 005/implementation-summary.md | **FAIL** |
| 005/telemetry-catalog.md | **FAIL** |
| 005/memory-save-quality-alerts.yml | **FAIL** |
| 005/pr11-defer-rationale.md | pass |
| 005/release-notes-draft.md | pass |
| parent/plan.md | **FAIL** |
| parent/tasks.md | **FAIL** |

## Findings

### P1-005: Telemetry catalog and alert YAML no longer describe the same operational contract

- **Dimension**: maintainability
- **Severity**: P1
- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/telemetry-catalog.md:19`
- **Evidence**: `telemetry-catalog.md:19-27` defines M1/M5/M9 as bucket-share, ambiguity-ratio, and p95 thresholds, but `memory-save-quality-alerts.yml:36-58` implements bare `> 0` or `> 0.50` expressions instead.
- **Impact**: Operators will tune and trust alerts using semantics the YAML does not actually enforce, which makes future maintenance and incident response misleading.
- **Hunter**: Cross-checked every catalog threshold against its pointed rule.
- **Skeptic**: The YAML is labeled a draft.
- **Referee**: The catalog explicitly treats this file as the rule pointer, so draft status does not excuse contract drift.
- **Recommendation**: Either simplify the catalog to the exact current rule semantics or update the YAML to encode the documented ratio/p95/bucket logic before treating this as the maintained operator surface.
- **Final severity**: P1
- **Confidence**: 0.95

```json
{"type":"claim-adjudication","claim":"telemetry-catalog.md documents M1/M5/M9 with bucket-share, ambiguity-ratio, and p95 thresholds, but memory-save-quality-alerts.yml implements them as bare > 0 / > 0.50 expressions, creating a silent contract drift for the operator alert surface.","evidenceRefs":["005-operations-tail-prs/telemetry-catalog.md:19","005-operations-tail-prs/memory-save-quality-alerts.yml:36-58"],"counterevidenceSought":"Checked whether the YAML is labeled draft/experimental or unused. It is labeled draft, but the catalog points operators to this file as the live rule source.","alternativeExplanation":"The YAML is a draft that will be tightened later. Rejected because the catalog treats this file as the canonical pointer, and there is no marker telling operators to ignore the YAML.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Either catalog updated to describe the actual bare-threshold semantics, OR the YAML updated to implement the documented bucket-share/ratio/p95 logic, OR both files marked explicitly as preview/not-for-operations."}
```

### P1-006: Phase 5 is marked closed even though its own handoff gate is still recorded as failing

- **Dimension**: maintainability
- **Severity**: P1
- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/spec.md:40`
- **Evidence**: The spec requires the parent packet to pass `/spec_kit:complete`, but `implementation-summary.md:33-34` says Phase 5 "finished the packet operationally" while `implementation-summary.md:88-99` records parent strict validation still failing with packet-level blockers.
- **Impact**: Maintainers cannot trust the closeout state, because the phase summary reports completion even though the documented parent-closeout criterion remains unmet.
- **Hunter**: Compared handoff criteria to recorded verification outcomes.
- **Skeptic**: Child-scope completion may have been considered sufficient.
- **Referee**: Both the Phase 5 spec and plan define parent closeout as part of done, so the summary should not present full packet closure until that gate is green or formally waived.
- **Recommendation**: Reword Phase 5 as "phase-local closeout complete, parent closeout blocked" or clear the parent blockers before calling the packet operationally finished.
- **Final severity**: P1
- **Confidence**: 0.92

```json
{"type":"claim-adjudication","claim":"Phase 5 implementation-summary asserts the packet is operationally finished while the same file (lines 88-99) records parent strict validation still failing with packet-level blockers — Phase 5's own spec/plan define parent closeout as part of done.","evidenceRefs":["005-operations-tail-prs/spec.md:40","005-operations-tail-prs/implementation-summary.md:33","005-operations-tail-prs/implementation-summary.md:88"],"counterevidenceSought":"Checked whether Phase 5 was formally waived from the parent-closeout gate. No waiver is recorded.","alternativeExplanation":"Child-scope completion is enough. Rejected because the spec explicitly names parent closeout as part of the Phase 5 done criterion.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Either parent strict validation passes, OR Phase 5 spec formally waives the parent-closeout gate with rationale, OR implementation-summary is reworded to 'phase-local complete, parent blocked'."}
```

### P1-007: Parent plan/tasks still advertise a superseded "fresh /spec_kit:plan" workflow after the packet was decomposed into child phases

- **Dimension**: maintainability
- **Severity**: P1
- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/plan.md:36`
- **Evidence**: `plan.md:36-39,187-188` still says implementation is deferred to a fresh `/spec_kit:plan`, while `tasks.md:64-112` keeps T101-T502 as `NEXT-PLAN` placeholders even though child phases now own execution and closeout.
- **Impact**: Future operators inherit two contradictory systems of record: a completed phase train and a parent packet that still claims implementation has not been converted into executable work.
- **Hunter**: Compared parent planning surfaces against current phase-closeout docs.
- **Skeptic**: The placeholders may be preserved for historical context.
- **Referee**: History is fine, but once phased execution exists, the parent should clearly mark those sections as superseded rather than active next steps.
- **Recommendation**: Mark the parent plan/tasks as superseded by Phases 1-5 and point operators to the phase folders as the maintained execution record.
- **Final severity**: P1
- **Confidence**: 0.88

```json
{"type":"claim-adjudication","claim":"Parent plan.md (lines 36-39, 187-188) and tasks.md (lines 64-112) still present a 'deferred to fresh /spec_kit:plan' workflow with NEXT-PLAN placeholders, even though Phases 1-5 have already shipped the decomposed execution train.","evidenceRefs":["003-memory-quality-issues/plan.md:36","003-memory-quality-issues/plan.md:187","003-memory-quality-issues/tasks.md:64","003-memory-quality-issues/tasks.md:112"],"counterevidenceSought":"Checked whether an explicit 'SUPERSEDED' banner exists in plan.md or tasks.md. None found.","alternativeExplanation":"Preserving the original planning doc as history. Rejected because no 'superseded by Phases 1-5' marker is present; the doc still reads as the active next-step source.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"Parent plan.md and tasks.md annotated as 'superseded by Phases 1-5' with a pointer to the phase folders as the execution record."}
```

### P2-006: Alert artifact path is inconsistent across the Phase 5 docs

- **Dimension**: maintainability
- **Severity**: P2
- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/spec.md:163`
- **Evidence**: `spec.md:163` and `plan.md:106` point to `monitoring/memory-save-quality-alerts.yml`, but `implementation-summary.md:49` records the shipped artifact as phase-local `memory-save-quality-alerts.yml`.
- **Impact**: Maintainers can search, edit, or review the wrong alert file, especially risky for operational config.
- **Recommendation**: Normalize every doc to the actual shipped path or move the file to the documented `monitoring/` location.
- **Final severity**: P2

## Cross-Reference Results

### Core Protocols

- **spec_code** — partial: metric names and structured review events exist in `memory-telemetry.ts`, `post-save-review.ts`, and `workflow.ts`, but the alert formulas do not match the catalog's documented semantics.
- **checklist_evidence** — **fail**: closeout docs present Phase 5 as operationally finished while the recorded parent validation/evidence still says packet-level blockers remain.

## Ruled Out

- **pr11-defer-rationale.md is misleading** — it is clear that PR-11 is deferred, not shipped, and provides concrete reopen triggers.
- **Phase 5 plan layout divergence** — the extra L2 sections are not a maintainability defect on their own; overall structure matches sibling phases.
- **Fabricated metric names** — M1-M9 and the structured log events are real code surfaces, not invented documentation labels.

## Sources Reviewed

- Phase 5: spec.md, plan.md, tasks.md, implementation-summary.md, pr11-defer-rationale.md, release-notes-draft.md, telemetry-catalog.md, memory-save-quality-alerts.yml
- Parent: plan.md, tasks.md
- Phase plans: 001, 002, 003, 004, 006, 007 (sampled for pattern consistency)
- Code: memory-telemetry.ts, post-save-review.ts, workflow.ts
- Skill reference: sk-code-review/SKILL.md

## Assessment

- Confirmed findings: 4
- New findings ratio: 0.31
- noveltyJustification: Found new maintainability-specific contract drift in alert semantics, parent closeout state, and superseded planning surfaces that were not covered by the prior correctness/security/traceability iterations. Some overlap with iter-3's parent-overstates-completion theme.
- Dimensions addressed: maintainability
- Verdict this iteration: **FAIL** (3 P1s with reinforcing evidence; telemetry contract drift is particularly severe for operator trust)
- Cumulative: P0=0 P1=7 P2=6

## Reflection

- **What worked**: Reading all 5 phase plans + 3 code files within budget enabled the cross-validation that telemetry metric names are real but alert semantics drifted.
- **What failed**: Nothing this iteration, though it used the full 12-call budget.
- **Next adjustment**: Iteration 5 (D5 Performance) should focus on Phase 4 heuristics/predecessor-discovery + reviewer overhead claims in Phase 5 telemetry docs. Expected smaller finding surface.
