# Iteration 6: Q5 Review Report Quality for Downstream `/spec_kit:plan`

## Focus
Determine how `review-report.md` should change so a `CONDITIONAL` or `FAIL` review becomes a direct remediation handoff for `/spec_kit:plan`, rather than a mostly human-readable audit summary. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md:30-32] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md:119-120]

## Current Actionability Gaps
1. The current synthesis contract is still optimized around audit presentation: 11 sections led by executive summary, score breakdown, findings buckets, coverage, convergence, and release-readiness narrative. Only one section is explicitly remediation-oriented, and it is described as ordered action items grouped by effort/impact rather than as planning inputs. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:510-559]
2. The real report shape follows that contract closely. The example report spends most of its top half on verdict, score math, findings prose, and coverage reporting, while the actual planning guidance is postponed to `## 10. Remediation Priority` and still lacks explicit dependencies, acceptance criteria, or spec/plan-ready problem framing. [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/review-report.md:5-34] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/review-report.md:193-208]
3. `/spec_kit:plan` does not consume a vague "fix these findings" summary. It expects a concrete feature/problem description, then produces `spec.md` and `plan.md` with specific fields: problem statement, purpose, scope, files to change, requirements, success criteria, technical context, phases, testing, dependencies, and rollback. [SOURCE: .opencode/command/spec_kit/plan.md:149-189] [SOURCE: .opencode/skill/system-spec-kit/templates/core/spec-core.md:35-42] [SOURCE: .opencode/skill/system-spec-kit/templates/core/spec-core.md:47-63] [SOURCE: .opencode/skill/system-spec-kit/templates/core/spec-core.md:67-89] [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/plan.md:20-49] [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/plan.md:54-118]
4. Q4 already established that traceability results should become typed `traceabilityChecks` state in JSONL. If the final report stays narrative-only, the loop will gain machine-verifiable state internally but still force the planner to reverse-engineer that state from prose. [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md:62-64] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md:156-160]

## Design Principle
Treat `review-report.md` as a two-layer artifact:

1. **Decision layer**: concise verdict, active blockers, and why the loop stopped.
2. **Planning layer**: a normalized remediation packet that can seed `/spec_kit:plan` with minimal reinterpretation.

The audit appendix should remain available, but it should no longer be the only place where the actionable structure lives. [INFERENCE: This is the smallest change that preserves release-review value while making remediation planning first-class.]

## Recommended Structural Changes
### 1. Replace top-heavy score-first ordering with handoff-first ordering
Recommended section order:

1. `Executive Summary`
2. `Planning Trigger`
3. `Active Finding Registry`
4. `Remediation Workstreams`
5. `Spec Seed`
6. `Plan Seed`
7. `Traceability and Evidence Status`
8. `Deferred / No-Action Items`
9. `Audit Appendix`

Rationale:
- `Score Breakdown`, `Coverage Map`, `Positive Observations`, and `Convergence Report` are useful, but they are downstream support for planning, not the planning packet itself.
- `Release Readiness Verdict` should collapse into `Executive Summary` instead of remaining a separate near-duplicate conclusion section. The current example repeats the same verdict twice. [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/review-report.md:5-20] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/review-report.md:212-223]

### 2. Add a `Planning Trigger` section with planner-facing framing
This section should answer the exact questions `/spec_kit:plan` needs before it can generate `spec.md`:

| Field | Why it matters |
|------|----------------|
| `recommendedCommand` | Makes the next action explicit (`/spec_kit:plan` vs defer vs changelog) |
| `planningIntent` | Maps review outcome to `fix_bug`, `refactor`, or `understand` |
| `problemStatement` | Feeds spec template `## 2. PROBLEM & PURPOSE` |
| `purpose` | Gives the one-sentence outcome for the spec |
| `priority` | Maps active highest severity to spec priority |
| `suggestedSpecScope` | Prevents the planner from having to infer whether this is one remediation spec or multiple |

[SOURCE: .opencode/command/spec_kit/plan.md:69-102] [SOURCE: .opencode/skill/system-spec-kit/templates/core/spec-core.md:35-42]

### 3. Convert findings lists into a normalized `Active Finding Registry`
Current P0/P1/P2 sections are readable, but not planner-friendly because they mix severity, evidence, and suggestion prose without a stable planning shape. Replace or supplement them with one registry table:

| Finding ID | Severity | Title | Problem Type | Affected Files | Recommended Change Type | Blocks | Acceptance Signal | Evidence Refs |
|------------|----------|-------|--------------|----------------|-------------------------|--------|-------------------|---------------|

Required additions per finding:
- `problemType`: `bug | spec-mismatch | documentation-drift | safety-gap | maintainability-debt`
- `changeType`: `edit-existing | create-artifact | remove-stale | investigate-first`
- `blocks`: downstream finding IDs or workstreams
- `acceptanceSignal`: the minimum verification that clears the item
- `specAnchor`: optional `REQ-*` or `SC-*` candidate when the issue obviously maps to a requirement

[INFERENCE: A planner can translate this registry into spec requirements and plan phases much more reliably than from prose bullets.]

### 4. Replace `Remediation Priority` prose with `Remediation Workstreams`
The existing remediation section is useful triage, but it is not yet a plan skeleton. Each workstream should group findings into an implementation unit with:

- `workstreamId`
- `goal`
- `findings`
- `filesToChange`
- `dependencies`
- `phaseHint` (`setup | core | verify | docs`)
- `riskLevel`
- `verification`

This maps directly to `plan.md` implementation phases, testing strategy, dependency tables, and rollback thinking. [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/plan.md:38-49] [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/plan.md:70-118] [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/plan.md:125-140]

### 5. Add a `Spec Seed` section that mirrors `spec.md` fields
Instead of forcing `/spec_kit:plan` to synthesize these from scratch, the review report should offer a draft packet:

- `Problem Statement`
- `Purpose`
- `In Scope`
- `Out of Scope`
- `Files to Change`
- `Candidate Requirements`
- `Candidate Success Criteria`
- `Open Questions`

This is a direct fit for the spec template structure. [SOURCE: .opencode/skill/system-spec-kit/templates/core/spec-core.md:35-89]

### 6. Add a `Plan Seed` section that mirrors `plan.md` fields
The report should also draft the implementation plan shell:

- `Technical Context`
- `Architecture Notes`
- `Implementation Phases`
- `Testing Strategy`
- `Dependencies`
- `Rollback Notes`

This reduces planner hallucination risk when the review already uncovered exact files, dependencies, and verification commands. [SOURCE: .opencode/skill/system-spec-kit/templates/level_2/plan.md:20-118]

### 7. Promote traceability status into a planning gate section
Q4's structured `traceabilityChecks` should surface in a section that the planner can interpret:

- which checks failed or remain partial
- which workstreams they block
- whether the remediation can be planned safely without more investigation

This is more actionable than the current generic cross-reference table because it connects evidence integrity to planning readiness. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:534-536] [SOURCE: .opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md:156-160]

### 8. Add an explicit `Deferred / No-Action Items` section
The current report mixes intentional no-action items into the same remediation flow. Those should be separated so `/spec_kit:plan` can ignore non-work cleanly. The example report already contains "No action recommended" items, but they are buried under Priority 3 prose. [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/review-report.md:203-208]

## Machine-Readable Planner Packet
Keep the human-readable report, but embed one stable fenced JSON block near the top:

```json
{
  "schemaVersion": "review-report/v2",
  "recommendedCommand": "/spec_kit:plan",
  "planningIntent": "fix_bug",
  "priority": "P1",
  "problemStatement": "Documentation artifacts disagree about validator completion state, so the release package cannot be trusted as a single truth surface.",
  "purpose": "Align the spec artifacts so completion claims, evidence, and implementation summary describe the same validated state.",
  "scope": {
    "inScope": ["repair contradictory completion claims", "update stale counts and references"],
    "outOfScope": ["new runtime behavior", "unrelated polish items"],
    "filesToChange": [
      {"path": "implementation-summary.md", "changeType": "modify"},
      {"path": "spec.md", "changeType": "modify"}
    ]
  },
  "activeFindings": [
    {
      "id": "P1-002",
      "severity": "P1",
      "problemType": "documentation-drift",
      "title": "Contradictory T04 completion claims",
      "files": ["checklist.md", "implementation-summary.md"],
      "changeType": "edit-existing",
      "acceptanceSignal": "documents agree and cite current validator result",
      "evidence": ["checklist.md:24-25", "implementation-summary.md:125"]
    }
  ],
  "workstreams": [
    {
      "id": "WS1",
      "goal": "Repair contradictory completion claims",
      "findings": ["P1-002"],
      "phaseHint": "docs",
      "dependencies": [],
      "verification": ["validate.sh exits 0 or 1", "artifact claims are mutually consistent"]
    }
  ],
  "traceabilityGate": {
    "readyForPlanning": true,
    "blockingChecks": [],
    "partialChecks": ["checklist_evidence"]
  },
  "openQuestions": []
}
```

Recommended parsing rule:
- Stable heading: `## Planning Packet`
- First fenced block under that heading is canonical machine-readable data
- Everything else in the report remains advisory/human-friendly

[INFERENCE: A single canonical JSON block is simpler and less drift-prone than trying to scrape multiple prose sections or tables.]

## Direct Mapping to `/spec_kit:plan`
| Review-report field | Consumed by |
|---------------------|-------------|
| `problemStatement`, `purpose` | `spec.md` Problem & Purpose |
| `scope.inScope`, `scope.outOfScope`, `scope.filesToChange` | `spec.md` Scope |
| `activeFindings[].acceptanceSignal` | candidate `REQ-*` / `SC-*` |
| `workstreams[]` | `plan.md` implementation phases |
| `verification[]` | `plan.md` testing strategy / Definition of Done |
| `dependencies[]` | `plan.md` dependencies |
| `traceabilityGate` | whether planner should start immediately or first create an investigation spec |

This is the core answer to Q5: the report should stop being only a release artifact and become a planner-ready remediation packet with one canonical machine-readable block plus aligned human sections.

## Recommended Changes
1. Reorder `review-report.md` so planning handoff sections come before audit appendix material.
2. Collapse duplicate verdict handling by merging `Release Readiness Verdict` into `Executive Summary`.
3. Replace severity-bucket prose as the primary structure with a normalized finding registry and grouped remediation workstreams.
4. Add `Spec Seed` and `Plan Seed` sections that mirror the existing system-spec-kit templates.
5. Embed one canonical `Planning Packet` JSON block with schema versioning and stable keys for parser use.
6. Separate deferred/no-action items from actionable remediation so `/spec_kit:plan` does not ingest noise.
7. Surface Q4 `traceabilityChecks` as a planning-readiness gate, not only as an audit appendix table.

## Ruled Out
- Keeping `review-report.md` as a scorecard plus prose-only remediation list.
- Making `/spec_kit:plan` scrape freeform narrative across multiple sections instead of consuming a single canonical packet.
- Treating `PASS WITH NOTES` as a planner input category after Q2 already reduced verdicts to `FAIL | CONDITIONAL | PASS` plus advisory metadata.

## Sources Consulted
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-strategy.md`
- `.opencode/specs/03--commands-and-skills/030-sk-deep-research-review-mode/research/deep-research-state.jsonl`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
- `.opencode/command/spec_kit/plan.md`
- `.opencode/skill/system-spec-kit/templates/core/spec-core.md`
- `.opencode/skill/system-spec-kit/templates/level_2/plan.md`
- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/review-report.md`
- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/plan.md`

## Assessment
- `newInfoRatio`: `0.44`
- Addressed: `Q5`
- Answered this iteration: `Q5`. This iteration added a concrete planner-facing report design, direct field mappings into the spec/plan templates, and a single machine-readable packet format that was not present in prior iterations.

## Reflection
- Worked: comparing the review synthesis contract against the spec/plan templates made the actual handoff gap obvious very quickly.
- Worked: reading a real review report plus the resulting plan showed that the missing unit is not "more remediation prose" but a normalized planning packet.
- Failed: semantic search was again low-yield because the relevant contract is still spread across markdown/YAML workflow definitions, so exact file reads were faster.
- Caution: the next implementation step should decide whether the JSON planning packet is generated directly from `finding_registry` plus `traceabilityChecks`, or whether synthesis maintains a small translation layer to keep the report schema decoupled from raw iteration state.

## Recommended Next Focus
Q6: architectural changes to `@deep-review` itself, especially how much synthesis-oriented structuring should happen during iteration writes versus only in the workflow-owned final synthesis step.
