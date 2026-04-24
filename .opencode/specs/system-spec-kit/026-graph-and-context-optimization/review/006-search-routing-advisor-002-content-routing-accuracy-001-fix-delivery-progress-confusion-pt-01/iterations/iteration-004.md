# Iteration 004: Template and state hygiene

## Focus
Maintainability review of the packet docs as a Level 2 spec packet, emphasizing template alignment, anchors, and human-readable state consistency.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 5
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.22

## Findings
### P0 — Blocker
- None.

### P1 — Required
- **F005**: Core packet docs still miss current template and anchor surfaces — `spec.md:1` — `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` all use lightweight frontmatter only, omit template source headers, omit `_memory` blocks, and provide no machine-owned anchors, which keeps strict packet validation failing.

### P2 — Suggestion
- **F007**: `decision-record.md` still says `planned` after the packet completed — `decision-record.md:3` — the rest of the packet is complete, so the ADR status now adds avoidable state ambiguity for future maintenance.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| checklist_evidence | partial | hard | `checklist.md:1-16` | The checklist exists, but its structure does not meet the current template contract. |

## Assessment
- New findings ratio: 0.22
- Dimensions addressed: maintainability
- Novelty justification: This pass surfaced packet-operability issues that do not appear in the router code itself.

## Ruled Out
- Need for broader code review: the strongest drift is in the packet documents, not the runtime implementation.

## Dead Ends
- Comparing prose style alone did not explain the validator failures; the missing template machinery did.

## Recommended Next Focus
Return to correctness for a stabilization pass and verify that the open issues remain packet-local, not runtime defects.
