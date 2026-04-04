# Spec: Self-Test Fixes and Reducer Improvements

| Field | Value |
| --- | --- |
| Status | Complete |
| Priority | P1 |
| Level | 2 |
| Parent | 041-sk-agent-improver-loop |
| Phase | 010 |
| Estimated LOC | 80-120 |

## Problem

Phase 009 (self-test) found 5 issues:

1. **Real bug**: The canonical `agent-improver.md` has a stale command path (`/improve:agent-improver` pointing to `.opencode/command/spec_kit/agent-improver.md`). The correct slug is `/improve:agent` pointing to `.opencode/command/improve/agent.md`. This also affects all 3 runtime mirrors.

2. **Reducer family hardcoding**: `inferFamily()` at line 66 of `reduce-state.cjs` defaults every profile except `context-prime` to `session-handover`. The agent-improver profile shows up as `family: "session-handover"` in the dashboard, which is wrong.

3. **Plateau window too rigid**: The plateau detector (line 305-308 of `reduce-state.cjs`) hardcodes a window of 3 identical scores. For short runs (3 iterations), a dimension that improves mid-run can never trigger plateau because it needs 3 identical values after the improvement. A configurable window would fix this.

4. **Accepted vs acceptable confusion**: The reducer counts `accepted` only when `record.type === 'accepted'` (line 207). Normal scored records get `recommendation: "candidate-acceptable"` but are never marked `type: 'accepted'`. The dashboard always shows "Accepted candidates: 0" even when candidates score well.

5. **Candidate-001 improvements not promoted**: The self-test produced 3 candidates with useful improvements (halt condition, merged checklists, fixed command path, precision fixes) that should be reviewed and selectively applied to the canonical `agent-improver.md`.

## Solution

Fix all 5 issues:

1. Fix the stale command path in `agent-improver.md` + sync all mirrors
2. Make `inferFamily()` derive family from the profile data instead of hardcoding
3. Make the plateau window configurable via `stopRules.plateauWindow` (default 3 for backward compat)
4. Count `candidate-acceptable` and `candidate-better` recommendations as accepted in the dashboard
5. Promote the best candidate improvements to the canonical agent file

## Scope

### In Scope

- Fix command path in `.opencode/agent/agent-improver.md` line 156
- Sync fix to `.claude/agents/agent-improver.md`, `.agents/agents/agent-improver.md`, `.codex/agents/agent-improver.toml`
- Refactor `inferFamily()` in `reduce-state.cjs` to derive family from profile or record metadata
- Add `stopRules.plateauWindow` config support in `reduce-state.cjs`
- Fix accepted/acceptable counting logic in `reduce-state.cjs`
- Promote candidate improvements: halt condition, merged checklists, checkbox self-validation, 4th anti-pattern, scan report provenance, summary box label
- Update `improvement_config.json` asset with new `plateauWindow` field
- Update `improvement_config_reference.md` with new field documentation

### Out of Scope

- New scripts or new dimensions
- Changes to scorer, benchmark, or scanner logic
- New test fixtures for agent-improver

## Requirements

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| REQ-001 | Stale command path fixed in canonical + all mirrors | `score-candidate.cjs --dynamic` on agent-improver scores systemFitness=100 |
| REQ-002 | Reducer family derived from profile | Dashboard shows correct family for agent-improver (not session-handover) |
| REQ-003 | Plateau window configurable | Config `stopRules.plateauWindow: 2` triggers plateau after 2 identical scores |
| REQ-004 | Accepted counting fixed | Dashboard shows non-zero accepted count when candidates score well |
| REQ-005 | Candidate improvements promoted | Canonical agent-improver.md includes halt condition, merged checklists, 4th anti-pattern |
| REQ-006 | All mirrors in sync after changes | `scan-integration.cjs --agent=agent-improver` shows all mirrors aligned |

## Success Criteria

- SC-001: `score-candidate.cjs --candidate=.opencode/agent/agent-improver.md --dynamic` scores 100 across all 5 dimensions
- SC-002: Re-running Phase 009 loop would show correct family, configurable plateau, and proper accepted counts
- SC-003: All 8 scripts parse OK
- SC-004: `scan-integration.cjs --agent=agent-improver` shows all mirrors aligned
