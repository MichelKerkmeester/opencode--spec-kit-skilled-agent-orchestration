# Deep-Review Iteration Prompt Pack — 008/008 Iteration 1

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification`. The loop manager has authorized this folder for the entire deep-review session. DO NOT re-ask Gate 3. Proceed directly to review work.

You are dispatched as a LEAF deep-review agent. This is iteration 1 of a 4-dimension deep review on the **skill-graph-daemon-and-advisor-unification** packet. This is the unified advisor runtime CORE — daemon freshness, native TypeScript scorer, MCP surface, Python/TS/plugin compat shims. Per the prior assessment: ~95% complete with 7 sub-packets shipped; strict-validation follow-up sweep pending.

## STATE SUMMARY

```
Iteration: 1 of 7
Mode: review
Dimension: correctness (priority 1; iteration 1 also performs an inventory pass)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification
Review Target Type: spec-folder
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: 0 / 4
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
```

## PACKET CONTEXT

The packet's purpose: unify what was previously a fragmented advisor runtime (Python advisor + TypeScript validator + ad-hoc daemon + MCP surface) into a single coherent runtime where:
- `skill_graph_scan` and `skill_graph_query` are MCP tools.
- A daemon manages graph freshness with explicit invalidation triggers.
- A native TypeScript scorer replaces the Python advisor for primary path; Python remains as a fallback for compatibility.
- Compatibility shims preserve old call shapes for plugin / agent consumers.

Per the parent 008 packet, this child shipped 7 sub-packets (validator ESM, daemon freshness, derived metadata, native scorer, MCP, compat shims). Implementation summary will list them.

## ITERATION 1 FOCUS

### 1. Inventory pass
- Confirm parent packet has `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`.
- Verify the 7 sub-packets (or sub-tracks) are enumerated in implementation-summary or tasks.
- Note any inventory drift as P2.

### 2. Correctness pass — D1

Audit the highest-leverage logic surfaces:

- **Daemon freshness**: When does the daemon recompute the skill graph? On every advisor query, or on file-change triggers? Are debounce windows sane? What happens if the daemon is stopped mid-recompute?
- **Native scorer correctness**: Does the TypeScript scorer produce the same scores as the Python advisor for the same inputs? Are there off-by-one issues in token boost / phrase boost calculations?
- **Compat shim semantics**: Plugin consumers (and agents) call into the runtime. If they use the old shape, does the shim correctly translate? Are there any error paths where the shim swallows errors and returns a default that masks a real failure?
- **MCP surface error handling**: When the daemon is unavailable / corrupted / mid-rebuild, what does `skill_graph_query` return? Does it block? Time out? Return stale results with a warning?
- **Cache corruption recovery**: If the on-disk graph cache is corrupted, does the runtime detect it and rebuild, or does it crash?
- **SIGKILL / timeout paths**: If the scoring subprocess is killed mid-execution, does the parent recover? Are there orphaned processes?

### 3. Cross-reference checks

- `spec_code`: REQ-* in spec.md → file:line in runtime code.
- `checklist_evidence`: each [x] CHK-* should cite file:line.

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line evidence + claim-adjudication packet.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown
Write to: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md`

Headings: `# Iteration 1 — Correctness + Inventory`, `## Dimension`, `## Files Reviewed`, `## Findings — P0`, `## Findings — P1`, `## Findings — P2`, `## Traceability Checks`, `## Claim Adjudication Packets`, `## Verdict`, `## Next Dimension`.

### 2. JSONL state log APPEND
```json
{"type":"iteration","iteration":1,"mode":"review","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":{"P0":<n>,"P1":<n>,"P2":<n>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T15:00:00.000Z","generation":1}
```

### 3. Per-iteration delta
Write to: `.../deltas/iter-001.jsonl`

After completing, write strategy file at `.../deep-review-strategy.md` (use template at `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`) and point Next Focus at security with focus on cache corruption recovery, SIGKILL paths, and MCP error handling.

GO.
