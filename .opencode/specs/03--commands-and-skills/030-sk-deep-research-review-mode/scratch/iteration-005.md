# Iteration 5: Q4 Cross-Reference Verification Redesign

## Focus
Define how the current 6 cross-reference protocols should become first-class, machine-verifiable traceability checks in the review loop: which belong in the core contract, how results should be stored, and which outcomes should gate convergence. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:29-32] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:113-115]

## Current Contract Gaps
1. Cross-reference handling is currently documented as prose plus a six-row appendix: the loop protocol says the agent applies 6 protocols and writes PASS/FAIL/PARTIAL results with evidence into the iteration file, and synthesis later aggregates those prose results into the review report. That is a reporting convention, not a typed state contract. [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:624-639]
2. The review YAML exposes `cross_reference_targets` during scope discovery and requires a Cross-Reference Results table in the final report shape, but it does not define a machine-readable per-iteration result schema or stop-rule interaction for those checks. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:162-169] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:534-536] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:674-682]
3. The `@deep-review` agent still treats cross-reference work as a dimension-specific or fallback activity and only mandates generic JSONL metadata like `status`, `focus`, `ruledOut`, and `newFindingsRatio`; there is no structured field for protocol-level results. [SOURCE: .opencode/agent/deep-review.md:83-93] [SOURCE: .opencode/agent/deep-review.md:106-115] [SOURCE: .opencode/agent/deep-review.md:233-247] [SOURCE: .opencode/agent/deep-review.md:417-422]
4. Q2 already decided that cross-reference protocols should live under `traceability`, not as a separate top-level taxonomy, so the right redesign is a typed traceability-check contract rather than another parallel scoring system. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:62] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:141]

## Recommended Contract
Adopt a three-layer model:

1. **Protocol registry** in the canonical review contract
   - Stable IDs, applicability rules, default gate class, and required evidence kinds
2. **Per-iteration result envelope** in JSONL
   - Machine-verifiable status, counts, unresolved contradictions, and evidence refs
3. **Derived presentation**
   - Strategy and dashboard summarize state; `review-report.md` renders the human-readable table

### Proposed protocol definition
```json
{
  "protocolId": "spec_code",
  "dimension": "traceability",
  "level": "core",
  "appliesTo": ["spec-folder", "track", "files"],
  "requires": ["spec_paths", "code_paths"],
  "gateClass": "hard",
  "requiredEvidence": ["source_ref", "target_ref"],
  "passCriteria": "all required source claims resolve to matching target evidence with zero contradictions",
  "partialCriteria": "no confirmed contradiction, but one or more required claims remain unresolved",
  "failCriteria": "any contradiction, missing required artifact, or checked claim without supporting target evidence"
}
```

### Proposed result envelope
```json
{
  "protocolId": "spec_code",
  "status": "pass",
  "gateClass": "hard",
  "applicable": true,
  "counts": {
    "sourceClaims": 8,
    "targetsChecked": 6,
    "verified": 8,
    "contradictions": 0,
    "unresolved": 0
  },
  "evidence": [
    {
      "sourceRef": "spec.md:14-22",
      "targetRef": "src/review.ts:88-133",
      "outcome": "match"
    }
  ],
  "findingRefs": ["P1-004"],
  "summary": "All claimed review outputs map to implemented behavior."
}
```

### Status semantics
- `pass`: applicable, all required claims verified, no contradictions
- `partial`: applicable, no contradiction yet, but unresolved claims remain
- `fail`: applicable, contradiction or missing required evidence found
- `not_applicable`: protocol is outside the active target's overlay set
- `blocked`: protocol should apply, but prerequisite artifacts were missing or unreadable

This format is machine-verifiable because `applicable`, `counts`, `status`, `gateClass`, and `evidence` can be linted for completeness and consistency rather than inferred from prose. [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:626-639] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:167-169] [SOURCE: .opencode/agent/deep-review.md:240-247]

## Core vs Overlay Mapping
### Core contract checks
1. `spec_code`
   - Universal whenever the review target includes normative spec or contract claims that can be compared against implementation or generated runtime artifacts. This is already implied by `spec-alignment`, scope discovery, and the first protocol in both loop docs and YAML. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:165-169] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:669] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:677]
2. `checklist_evidence`
   - Universal whenever completion claims exist, because review mode already treats checked items and cited evidence as a first-class truth surface. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:670] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:678] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:630-633]

### Target-specific overlays
1. `skill_agent`
   - Overlay for `skill` reviews and any spec-folder review whose implementation hinges on agent behavior generated from `SKILL.md`. [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:632-634] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:679]
2. `agent_cross_runtime`
   - Overlay for `agent` reviews and multi-runtime contract parity checks. This should become a required overlay when the review target type is `agent`; otherwise it is advisory. [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:633-635] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:680]
3. `feature_catalog_code`
   - Overlay only when catalog artifacts exist in scope; otherwise it should cleanly emit `not_applicable` instead of forcing empty noise into every run. [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:634-636] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:681]
4. `playbook_capability`
   - Overlay only when operator playbooks or scenario docs are in scope and executable capability claims can actually be checked. [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:635-637] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:682]

[INFERENCE: Keeping `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability` out of the universal minimum avoids turning absent artifacts into false failures, while still allowing them to become required overlays for the target types that depend on them.]

## Storage Model
### JSONL
Store protocol results inside each iteration record under a dedicated object:

```json
{
  "traceabilityChecks": {
    "summary": {
      "required": 3,
      "executed": 3,
      "pass": 1,
      "partial": 1,
      "fail": 1,
      "blocked": 0,
      "notApplicable": 2,
      "gatingFailures": ["spec_code"]
    },
    "results": []
  }
}
```

Why JSONL: iteration records are already the append-only truth surface for loop decisions, and the agent contract already expects structured per-iteration metadata there. Cross-reference state needs to live alongside `status`, `focus`, and `newFindingsRatio`, not only in markdown prose. [SOURCE: .opencode/agent/deep-review.md:233-247] [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:640-647]

### Strategy
Add one cumulative section:

`Cross-Reference State`

Columns:
- `protocolId`
- `level`
- `requiredThisRun`
- `lastStatus`
- `lastRun`
- `openContradictions`
- `gateClass`

Strategy should store only the latest durable state and open risks, not every evidence item. It is the planning surface, not the event log. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md:113-115] [SOURCE: .opencode/agent/deep-review.md:83-87]

### Dashboard
Keep dashboard derived-only:
- required checks pass/fail/partial counts
- open gating failures
- last changed protocol statuses
- unresolved contradiction trend by run

That keeps the dashboard small and operator-friendly while preserving JSONL as the machine-readable source of truth. [SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:648-657]

## Convergence Interaction
1. Required protocols should participate in STOP decisions only after their prerequisite artifacts exist in scope.
2. `fail` or `blocked` on any required protocol should veto convergence immediately.
3. `partial` on a required protocol should not mark the run as failed, but it should keep the loop in `CONTINUE` until the unresolved claim count reaches zero or the unknowns are explicitly accepted as bounded gaps.
4. Optional overlay protocols should never block convergence by default; they enrich the final report unless the active target type promotes them to required overlays.
5. For `agent` targets, `agent_cross_runtime` should be promoted from advisory overlay to convergence gate because runtime inconsistency is a contract contradiction, not a documentation nicety.
6. For `skill` targets, `skill_agent` should gate only when the skill explicitly declares agent-facing behavior that the runtime agent must honor.

[INFERENCE: This gate policy keeps convergence tied to truth-surface integrity, not to every possible auxiliary artifact. It matches Q2's traceability framing and Q3's lesson that gates should be narrow, explicit, and structurally encoded rather than left as prose.]

## Recommended Changes
1. Move the six protocols out of appendix prose into the canonical review-mode contract manifest with stable IDs, applicability metadata, and gate classes.
2. Replace the current markdown-only Cross-Reference Results convention with a structured `traceabilityChecks` JSONL object and strategy/dashboard derivatives.
3. Make `spec_code` and `checklist_evidence` the default required protocols; treat the other four as overlays that can become required for matching target types.
4. Treat `partial` as a convergence veto for required protocols, not as a cosmetic report label.
5. Keep `review-report.md` as the human summary of protocol results, not the source of truth for loop decisions.

## Ruled Out
- Making all 6 protocols universal hard gates for every review target.
- Keeping cross-reference verification as markdown-only prose with no typed JSONL state.
- Creating a separate top-level "cross-reference score" outside the Q2 `traceability` dimension.

## Sources Consulted
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/scratch/deep-research-strategy.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- `.opencode/agent/deep-review.md`

## Assessment
- `newInfoRatio`: `0.49`
- Addressed: `Q4`
- Answered this iteration: `Q4`. This iteration turned a prose appendix into a concrete contract design: stable protocol IDs, applicability-aware core/overlay mapping, typed JSONL storage, and explicit convergence behavior.

## Reflection
- Worked: separating protocol registry, result envelope, and gate policy made it much easier to decide what belongs in the canonical contract versus overlays.
- Worked: reading the loop reference, workflow YAML, and agent instructions together exposed the real gap: reporting format exists, but machine-verifiable state does not.
- Failed: CocoIndex remained low-yield for this markdown-heavy question, so targeted file reads were more effective.
- Caution: the next implementation step should validate that the proposed `partial` and `blocked` semantics integrate cleanly with the existing STOP/CONTINUE guard path before hard-coding them.

## Recommended Next Focus
Q5: redesign `review-report.md` so the richer machine-verifiable traceability state turns into a more actionable remediation packet for downstream `/spec_kit:plan` work rather than just a final narrative.
