# Review Iteration 3: D3 Traceability — Parent rollup vs phase-local evidence

## Focus

Cross-reference audit of parent packet (`spec.md`, `checklist.md`, `implementation-summary.md`) against all 7 phase-local checklists and implementation-summaries. Primary protocol: `checklist_evidence`. Secondary: `spec_code`.

## Scope

- Review target: 5 parent artifacts + 5 phase-local checklists + 5 phase-local implementation-summaries
- Dimension: traceability

## Reviewer Backend

- **cli-codex** `/opt/homebrew/bin/codex exec` (direct homebrew binary)
- Model: `gpt-5.4`, reasoning_effort=`high`, service_tier=`fast`, sandbox=`read-only`
- Elapsed: 177 s

## Scorecard

| File | Trace |
|------|-------|
| parent/spec.md | **FAIL** |
| parent/checklist.md | partial |
| parent/implementation-summary.md | partial |
| 001/checklist.md | pass |
| 002/checklist.md | partial (open P1 items) |
| 003/checklist.md | partial (open items) |
| 004/checklist.md | partial |
| 005/checklist.md | **FAIL** (9/13 P1 items still open) |

## Findings

### P1-004: Parent phase map overstates child completion state

- **Dimension**: traceability
- **Severity**: P1
- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:83`
- **Evidence**: Parent `spec.md` marks Phases 2-5 `Complete`, but sampled child checklists still show open required work: `002-single-owner-metadata/checklist.md:112-114`, `003-sanitization-precedence/checklist.md:121-133`, `004-heuristics-refactor-guardrails/checklist.md:70`, `005-operations-tail-prs/checklist.md:114-123`.
- **Impact**: The packet-level source of truth cannot be trusted for release/readiness or handoff decisions because the parent roll-up says "complete" before the child folders' own completion signals are actually satisfied.
- **Hunter**: Comparing the parent phase map against the sampled child verification summaries and handoff sections.
- **Skeptic**: Some unchecked child items could be interpreted as non-blocking bookkeeping or optional follow-through rather than true phase blockers.
- **Referee**: Phase 5's own success definition requires a D9 reproduction path and the parent packet to be actually closed, yet `005-operations-tail-prs/checklist.md:114-123` still shows `P1 Items | 9/13` and keeps that definition open — this is a real roll-up inconsistency, not cosmetic checklist drift.
- **Recommendation**: Downgrade the affected parent phase rows from `Complete` to a qualified status, or finish/explicitly defer the open child P1 items and handoff gates before keeping the roll-up green.
- **Final severity**: P1
- **Confidence**: 0.94

```json
{"type":"claim-adjudication","claim":"Parent spec.md phase map declares Phases 2-5 Complete while multiple phase-local checklists still carry open required (P1) items and unresolved handoff state, making the parent rollup an unreliable release-readiness source.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:83",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/002-single-owner-metadata/checklist.md:112-114",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/003-sanitization-precedence/checklist.md:121-133",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/checklist.md:70",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/checklist.md:114-123"],"counterevidenceSought":"Checked whether the open child checklist items are marked optional/deferred in the phase spec. They are not — Phase 5 explicitly lists them as P1 gate items.","alternativeExplanation":"The open child items could be cosmetic bookkeeping the parent intentionally ignores. Rejected because the items include gate acceptance checks and Phase 5's own success definition.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Phase-local checklists updated to close or explicitly defer the 9/13 Phase 5 P1 items, OR parent spec.md phase map relabeled to a qualified status that matches child evidence."}
```

### P2-004: Parent D6 row cites a non-owning phase check

- **Dimension**: traceability
- **Severity**: P2
- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/checklist.md:65`
- **Evidence**: Parent `CHK-028` cites `004-heuristics-refactor-guardrails/checklist.md CHK-030`, but that child row is only the full PR-train replay check at `004-heuristics-refactor-guardrails/checklist.md:69`, not D6 historical-classification evidence.
- **Impact**: Makes the D6 roll-up look more strongly evidenced than it is and blurs the distinction between "historical-only classification" and "landed product-path fix."
- **Recommendation**: Replace the Phase 4 citation with a D6-specific child citation, or rely only on the Phase 5 dry-run classification evidence and explicitly label D6 as historical-only.
- **Final severity**: P2

### P2-005: Several checked parent rows are not phase-traceable

- **Dimension**: traceability
- **Severity**: P2
- **File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/checklist.md:35`
- **Evidence**: Checked parent rows such as `CHK-003`, `CHK-010`, `CHK-050`, and `CHK-051` use folder presence or parent-doc references instead of child CHK IDs (`checklist.md:35-47`, `84-86`).
- **Impact**: The parent checklist only partially satisfies its own "phase-local evidence" traceability story, so an auditor still has to infer child proof instead of following explicit packet-to-phase links.
- **Recommendation**: Add child CHK references for those rows, or relabel them as parent-only assertions so they do not appear to be phase-backed evidence.
- **Final severity**: P2

## Cross-Reference Results

### Core Protocols

- **spec_code** — partial: D1/D2/D3/D4/D5/D7/D8 and PR-1..PR-11 ownership mostly matches the sampled phase summaries, but the parent status/handoff story outruns child completion evidence.
- **checklist_evidence** — partial: Section B mostly points to phase CHKs, but some checked parent rows are backed only by parent prose/folder presence, and the D6 row includes one mismatched citation.

### Overlay Protocols

- Not evaluated (packet-level review).

## Ruled Out

- **PR ownership misattribution** (PR-1/2, PR-3/4, PR-5/6, PR-7/8/9, PR-10/11) — sampled phase implementation-summaries align with the parent attribution.
- **Scenario C tail honesty** — parent spec and Phase 5 both consistently record PR-10 as dry-run-only and PR-11 as deferred.

## Sources Reviewed

- Parent: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
- Phase 1-5 checklists + implementation-summaries (10 files)

## Assessment

- Confirmed findings: 3
- New findings ratio: 0.50
- noveltyJustification: This pass surfaced a packet-level roll-up defect; half the severity weight represents novel parent-level drift, the other half is overlap with lower-level traceability concerns already implied by iterations 1-2 (stale citations).
- Dimensions addressed: traceability
- Verdict this iteration: CONDITIONAL (1 P1, 2 P2, no P0)
- Cumulative: P0=0 P1=4 P2=5

## Reflection

- **What worked**: Sampling 5 phases instead of reading all 7 checklists in full — the codex run found the Phase 5 9/13 open P1 items within budget.
- **What failed**: Nothing this iteration.
- **Next adjustment**: Iteration 4 (D4 Maintainability) should focus on Phase 5 closeout docs (release-notes-draft.md, telemetry-catalog.md, pr11-defer-rationale.md) and parent spec/plan clarity. Expected overlap with the parent drift already found.
