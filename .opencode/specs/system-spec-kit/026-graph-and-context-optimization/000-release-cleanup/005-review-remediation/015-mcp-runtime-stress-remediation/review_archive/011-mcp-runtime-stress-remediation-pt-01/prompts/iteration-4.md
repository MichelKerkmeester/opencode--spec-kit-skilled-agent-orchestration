# Deep-Review Iteration Prompt Pack — 011 Iteration 4

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/015-mcp-runtime-stress-remediation`. The loop manager has authorized this folder for the entire deep-review session. DO NOT re-ask Gate 3. Proceed directly to review work.

You are dispatched as a LEAF deep-review agent. Iter-1 (correctness, 2 P2), iter-2 (security, clean — 0 new), iter-3 (traceability, 2 new P2) complete. This is the maintainability pass — the LAST dimension. After this iteration, dimension coverage hits 4/4 and the loop manager evaluates STOP gates.

## STATE SUMMARY

```
Iteration: 4 of 7
Mode: review
Dimension: maintainability (priority 4 — final)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation
Prior Findings (cumulative): P0=0 P1=0 P2=4
Dimension Coverage: 3 / 4 (correctness, security, traceability covered)
Coverage Age: 1
Last 3 ratios: 1.0 -> 0.0 -> ~0.05
Stuck count: 1
Provisional Verdict: PASS (hasAdvisories=true)
Resource Map Coverage: resource-map.md present; coverage gate active.
Last claim_adjudication_passed: true
```

## PRIOR FINDINGS (do not re-flag)

- **F-001** (correctness): Parent resource-map stale.
- **F-002** (correctness): Post-stress research convergence wording overclaim.
- **F-003** (traceability): HANDOVER-deferred describes work as deferred when child packets now own it.
- **F-004** (traceability): Root catalog/playbook impact audits contradict live state.

## ITERATION 4 FOCUS — D4 MAINTAINABILITY

### M1. 18-child phase parent navigability
- 18 children is a lot. Is the `context-index.md` clear enough that a new maintainer can navigate them in <1 minute?
- Are children grouped logically (cycle phase: baseline / research / remediation / rerun / followup / planned-fixes)?
- Is the numbering gap policy documented?

### M2. v1.0.2 verdict reproducibility
- `010-stress-test-rerun-v1-0-2/findings.md` — if a future maintainer wanted to rerun the rubric application, are all inputs (cell scores, dimension weights, baseline) preserved in machine-readable form, or are they trapped in markdown narrative?
- Same for `002-mcp-runtime-improvement-research/` Q1-Q8 diagnoses.

### M3. Patch proposal handoff quality (012-015)
- Open the planned remediation packets (012-018) — these are downstream of the post-stress research synthesis.
- Each should have at minimum: `spec.md` with REQ statements, target files, LOC estimate, dependencies on prior packets.
- Are the LOC estimates from the research synthesis (80-250 LOC per fix) reflected in the planned packets?
- Spot-check `012-copilot-target-authority-helper/spec.md` since iter-2 validated the underlying fix already.

### M4. Cleanup CLI / daemon-rebuild operator surface
- Does the operator README explain the daemon-rebuild contract clearly? File watcher debounce deferral?
- Live probe template (canonical 2026-04-27 restart): is it copy-pasteable, or buried in narrative?

### M5. Cross-packet shared-test infrastructure
- The 7 remediation packets (003-009) likely each have their own vitest files. Do they share fixtures, or duplicate setup?
- Is there a single "live probe" runner shared across packets, or 7 ad-hoc invocations?

### M6. Implementation summary completeness
- Does the parent `spec.md` reflect the complete cycle (baseline → research → 7 remediations → rerun → post-stress → 4 patch proposals)?
- Are linkages between phases (which packet depends on which) explicit?

### M7. Phase-DAG runner alignment
- The 010 phase-runner uplift (from 026/006/002) is supposed to make phase orchestration first-class. Is 011 actually using it, or operating independently?

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line evidence + claim-adjudication packet.
- Do NOT re-flag F-001..F-004.
- 18 children — focus on parent docs + 010/findings.md + 011/research synthesis + 012/spec.md (sample) + operator README. Don't read every child.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown
Write to: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/iterations/iteration-004.md`

Headings: `# Iteration 4 — Maintainability`, `## Dimension`, `## Files Reviewed`, `## Findings — P0`, `## Findings — P1`, `## Findings — P2`, `## Traceability Checks`, `## Resource Map Coverage`, `## Claim Adjudication Packets`, `## Verdict`, `## Next Dimension` (state "STOP candidate — all 4 dimensions covered" if no new P0/P1).

### 2. JSONL state log APPEND
```json
{"type":"iteration","iteration":4,"mode":"review","status":"complete","focus":"maintainability","dimensions":["maintainability"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<cumulative>,"P1":<cumulative>,"P2":<cumulative>},"findingsNew":{"P0":<new>,"P1":<new>,"P2":<new>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T14:30:00.000Z","generation":1}
```

### 3. Per-iteration delta
Write to: `.../deltas/iter-004.jsonl`

After completing, update strategy `<!-- ANCHOR:next-focus -->` to indicate STOP candidate.

GO.
