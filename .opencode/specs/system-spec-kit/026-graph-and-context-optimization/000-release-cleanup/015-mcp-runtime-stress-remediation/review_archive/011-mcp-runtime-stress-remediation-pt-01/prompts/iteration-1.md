# Deep-Review Iteration Prompt Pack — 011 Iteration 1

You are dispatched as a LEAF deep-review agent (`@deep-review`). This is iteration 1 of a 4-dimension review on `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/`. The packet orchestrates the v1.0.1 → v1.0.2 stress-test cycle: 30-cell corpus, 10-iteration post-stress deep-research, and 4 patch proposals (P0 cli-copilot Gate 3 bypass, P1 graph testability, P2 file-watcher debounce, OPP CocoIndex telemetry).

## STATE SUMMARY

```
Iteration: 1 of 7
Mode: review
Dimension: correctness (priority 1; iteration 1 also performs an inventory pass)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation
Review Target Type: spec-folder
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: 0 / 4
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING
Resource Map Coverage: resource-map.md present at 015-mcp-runtime-stress-remediation/resource-map.md — coverage gate IS active. Cross-check resource-map paths against any applied/T-*.md reports if present.
```

## PACKET CONTEXT

This is a phase parent with 18 children. Critical artifacts:
- `spec.md` — root packet identity, sub-phase manifest
- `HANDOVER-deferred.md` — what's still open after the cycle
- `context-index.md` — bridge across the cycle's children
- `feature-catalog-impact-audit.md` (29 KB) — feature catalog audit results
- `testing-playbook-impact-audit.md` (33 KB) — playbook audit results
- `resource-map.md` — path catalog for the parent
- `description.json`, `graph-metadata.json`

Critical child phases (read selectively):
- `001-search-intelligence-stress-test/` — v1.0.1 baseline (frozen)
- `002-mcp-runtime-improvement-research/` — 10-iter convergent root-cause deep-research
- `003-memory-context-truncation-contract/` through `009-memory-search-response-policy/` — 7 remediation packets (mostly COMPLETE, some with deferred follow-ups)
- `010-stress-test-rerun-v1-0-2/` — v1.0.2 verdict source: `findings.md` claims 83.8% overall, 6/7 PROVEN, 0 REGRESSION
- `011-post-stress-followup-research/` — 10-iter convergent loop on what's still broken; produced 4 patch proposals
- `012`–`018/` — planned remediation packets downstream of 011 research

## ITERATION 1 FOCUS

Iteration 1 has TWO purposes:

### 1. Inventory pass
- Confirm parent + 18 children all have `description.json` + `graph-metadata.json`.
- Confirm `010/findings.md` exists and contains the 6/7 PROVEN verdict.
- Confirm `011/research/` has converged iteration files (10 iterations).
- Confirm `HANDOVER-deferred.md` enumerates the 4 still-open items.
- Note any inventory drift as P2.

### 2. Correctness pass — V1.0.2 VERDICT VALIDATION (highest leverage)

Open `010-stress-test-rerun-v1-0-2/findings.md` and validate:

- **The 6/7 PROVEN claim**: Does the rubric application (4 dimensions, 0–2 scale) actually justify "PROVEN" classification per packet? Spot-check 2–3 PROVEN packets by looking at their per-cell scores. Are there any borderline cases where a packet is classified PROVEN but has cells scoring partial-credit (1/2 instead of 2/2)?
- **The 0 REGRESSION claim**: Re-check by scanning each cell's score against the v1.0.1 baseline. Did any packet score LOWER on any cell in v1.0.2 than v1.0.1?
- **The 83.8% overall**: Is this a weighted aggregate or simple mean? If weighted, are the weights documented and defensible?
- **The 1 NOT-PROVEN packet**: Which one is it, and is the rationale documented?
- **Pre-flight daemon attestation**: Is the gate documented? Is it a hard gate or advisory?

### 3. Correctness pass — POST-STRESS RESEARCH CONVERGENCE

Open `011-post-stress-followup-research/research/` (look for iteration JSONL or markdown files):
- Does the 10-iter newInfoRatio decay (0.74 → 0.22 per the plan I authored) actually appear in the data? Or did it converge differently?
- Are the 4 patch proposals (P0 cli-copilot Gate 3, P1 graph testability, P2 file-watcher, OPP CocoIndex telemetry) backed by concrete file:line evidence in the research synthesis?
- Specifically for the **P0 cli-copilot Gate 3 bypass fix**: is the proposed insertion point in `executor-config.ts` correct? Off-by-one in authority-token binding would reintroduce the vulnerability. Cross-reference against `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` and any `buildCopilotPromptArg` implementation.

### 4. Cross-cutting correctness

- Look at the 7 remediation packets (003 through 009): each claims `Live probe PASSED 2026-04-27`. Verify by spot-checking one or two that the live-probe evidence is actually in the packet docs (not just narrated).
- Resource-map coverage gate: scan `resource-map.md` and check that all 7+ remediation child paths appear. Flag any child packet absent from the map (gap finding).

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with concrete `file:line` evidence + claim-adjudication packet.
- Do NOT re-investigate the v1.0.1 baseline; it's frozen evidence.

## OUTPUT CONTRACT (THREE REQUIRED ARTIFACTS)

### 1. Iteration narrative markdown

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/iterations/iteration-001.md`

Required headings:
- `# Iteration 1 — Correctness + Inventory + V1.0.2 Verdict Validation`
- `## Dimension`
- `## Files Reviewed`
- `## Findings — P0 (Blockers)`
- `## Findings — P1 (Required)`
- `## Findings — P2 (Suggestions)`
- `## Traceability Checks`
- `## Resource Map Coverage` (since resource-map present)
- `## Claim Adjudication Packets`
- `## Verdict`
- `## Next Dimension`

### 2. Canonical JSONL iteration record (APPEND)

Append to: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/deep-review-state.jsonl`

```json
{"type":"iteration","iteration":1,"mode":"review","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":{"P0":<n>,"P1":<n>,"P2":<n>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T14:30:00.000Z","generation":1}
```

### 3. Per-iteration delta file

Write to: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/deltas/iter-001.jsonl`

After completing, write the strategy file at `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/deep-review-strategy.md` (use the deep_review_strategy.md template at `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` and populate Topic, Review Dimensions, Known Context with what you learned this iteration, and Next Focus pointing iter-2 at security with focus on the P0 cli-copilot Gate 3 fix proposal).

GO.
