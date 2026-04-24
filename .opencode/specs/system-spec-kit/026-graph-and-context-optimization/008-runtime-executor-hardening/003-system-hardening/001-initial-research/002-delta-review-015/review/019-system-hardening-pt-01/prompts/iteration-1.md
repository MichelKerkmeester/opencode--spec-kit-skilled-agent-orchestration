# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`. Write findings to files, not context.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Next focus: Read 015/review/review-report.md to index 243 findings by severity. Batch-audit the 1 P0 and 10-15 representative P1 findings from clusters most likely addressed by phase 016 primitives.

Research Topic: Delta-review of 015's 243 findings against current main (post-016/017/018 ship). Classify each as ADDRESSED (cite addressing commit hash), STILL_OPEN (cite current file:line evidence), SUPERSEDED (cite 016/017/018 replacement design), or UNVERIFIED (evidence gone, propose re-audit path). Explicitly verify 015 P0 (reconsolidation-bridge.ts:208-250 cross-scope merge).

Iteration: 1 of 10
Focus Area: Read 015/review/review-report.md to index all 243 findings by severity and cluster. Batch-audit the P0 + 10-15 representative P1 findings. Initial delta classifications.

Remaining Key Questions:
- Q1: Raw count of ADDRESSED/STILL_OPEN/SUPERSEDED/UNVERIFIED tally (must sum to 243)
- Q2: 015 P0 reconsolidation-bridge verification verdict (ADDRESSED with commit, or STILL_OPEN with current evidence)
- Q3: 114 P1 findings classification per phase 016/017/018 primitives (4-state TrustState, predecessor CAS, shared-provenance, readiness-contract, retry-budget, caller-context)
- Q4: 133 P2 findings classification
- Q5: Narrowed residual backlog for 015 Workstream 0+ restart

Last 3 Iterations Summary: (none - iteration 1)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/deep-review-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/deep-review-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/deep-review-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/findings-registry.json
- Source findings: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation/review/review-report.md
- Write findings to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/iterations/iteration-001.md

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 review actions. Max 12 tool calls total.
- Write ALL classifications to files. Do not hold in context.
- Use `git log --oneline -S <key-text>` to find addressing commits post-2026-04-16.
- For ADDRESSED: cite commit hash + message.
- For STILL_OPEN: read the current file:line in main and quote the reproduction.
- For SUPERSEDED: cite the 016/017/018 primitive that replaced the surface.
- For UNVERIFIED: note what evidence would be needed (file renamed, scope gone, etc).
- Review dimensions: correctness, security, contracts, documentation.

## OUTPUT CONTRACT

You MUST produce TWO artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/iterations/iteration-001.md`. Structure: Focus, Actions Taken, Findings Batch-Audited (with classifications), Tally Progress, Questions Answered, Questions Remaining, Next Focus.

2. **JSONL delta record** appended to the state log:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","findingsAudited":<n>,"tally":{"ADDRESSED":<n>,"STILL_OPEN":<n>,"SUPERSEDED":<n>,"UNVERIFIED":<n>},"graphEvents":[...]}
```

Both REQUIRED.
