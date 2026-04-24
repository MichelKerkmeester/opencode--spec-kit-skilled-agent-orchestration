# Deep-Review Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target packet already established at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/002-delta-review-015/`. All writes this iteration are within the canonical review artifact directory `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/`. Proceed without asking.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 2 of 10
Last 2 ratios: N/A -> 0.55 | Stuck count: 0
Prior: iter 1 classified P0 (ADDRESSED by commit 104f534bd0 — phase 016 P0-B transactional reconsolidation + predecessor CAS) + 10 P1 reps. Tally so far: ADDRESSED=2, STILL_OPEN=0, SUPERSEDED=1, UNVERIFIED=8. Remaining unaudited: 231.

Research Topic: Delta-review of 015's 243 (actually 242 deduped) findings against current main. Classify each as ADDRESSED / STILL_OPEN / SUPERSEDED / UNVERIFIED with commit evidence. See iteration-001.md for baseline.

Iteration: 2 of 10
Focus Area: Batch-audit the next 30-40 P1 findings. Prioritize clusters most likely affected by phase 016/017/018 primitives:
- **Path-boundary cluster** (5 P1): `validateMergeLegality`, `validatePostSaveFingerprint`, `resolveDatabasePaths`, skill-graph scan dispatch, resume handlers, graph-metadata key-file extraction. Likely ADDRESSED by shared-provenance module + readiness-contract.
- **Code-graph sibling asymmetry cluster** (6 P1): `handlers/code-graph/{query,scan,status,context,ccc-status,ccc-reindex,ccc-feedback}.ts`. Likely ADDRESSED by phase 016 cluster D T-CGQ-09/10/11/12 + readiness-contract.
- **Canonical-save cluster**: CONTINUITY_FRESHNESS drift, description.json lastUpdated, graph-metadata derived.last_save_at. Likely SUPERSEDED by H-56-1 fix.
- **Reconsolidation cluster** (beyond P0): Other findings in `reconsolidation-bridge.ts` + `lib/storage/reconsolidation.ts`. Likely ADDRESSED by 104f534bd0.
- **NFKC sanitization cluster** (3 P1): `sanitizeRecoveredPayload`, trigger-phrase-sanitizer, Gate 3 classifier. Likely ADDRESSED by phase 016 T-SAN-01/02/03.

Remaining Key Questions:
- Q1 (partial): tally across 242 (need 231 more classifications)
- Q2 ✓ (iter 1): P0 ADDRESSED verdict recorded
- Q3 (active): classify 114 P1 findings per phase 016/017/018 primitives
- Q4 (blocked on Q3): classify 133 P2 findings
- Q5 (blocked on Q3+Q4): narrowed STILL_OPEN backlog

Last 3 Iterations Summary: run 1 P0 + 10 P1 batch (ratio 0.55)

## STATE FILES

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/deep-review-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/deep-review-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/deep-review-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/findings-registry.json
- Source: 015/review/review-report.md
- Prior iteration: iteration-001.md (read first)
- Write findings to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-002-delta-review-015/iterations/iteration-002.md

## CONSTRAINTS

- LEAF agent. Max 12 tool calls.
- For ADDRESSED: cite commit hash + line-level current evidence. Use `git log --oneline -S <search-term>` post-2026-04-16.
- For STILL_OPEN: quote current file:line reproduction.
- For SUPERSEDED: cite 016/017/018 primitive.
- For UNVERIFIED: note what evidence is needed.
- Focus on clusters with HIGH likelihood of ADDRESSED. Reduce the UNVERIFIED count from iter 1 by completing batches that depend on named commits.

## OUTPUT CONTRACT

1. `.../iterations/iteration-002.md` with Focus, Actions, Findings Batch-Audited, Tally Progress (cumulative), Questions Answered, Questions Remaining, Next Focus.
2. JSONL delta:
```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","findingsAudited":<n>,"tally":{"ADDRESSED":<cumulative>,"STILL_OPEN":<cumulative>,"SUPERSEDED":<cumulative>,"UNVERIFIED":<cumulative>},"graphEvents":[...]}
```
