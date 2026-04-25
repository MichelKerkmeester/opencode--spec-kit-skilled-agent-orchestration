---
title: "Hand [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/handover]"
description: "Post-patch handover. Wave-3 P0 (005 impossible cache-hit gate) + all 9 P1 patches applied across 003/004/005/007/008/009. All 6 children pass validate.sh strict. Ready for /spec_kit:implement :auto 020/002 dispatch."
trigger_phrases:
  - "020 handover"
  - "020 resume"
  - "020 post compact"
  - "020 implementation ready"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface"
    last_updated_at: "2026-04-19T11:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Wave-3 patches landed; battle plan authored"
    next_safe_action: "Execute T1 per battle-plan"
    blockers: []
    dispatch_policy: "cli-codex gpt-5.4 high fast primary; cli-copilot fallback"
---
# Handover: Phase 020 Skill-Advisor Hook Surface

## Status Snapshot (2026-04-19T11:45:00Z)

**Phase 020 state:** All research waves converged, all wave-3 P0 + P1 patches applied, implementation-ready.

| Item | State |
|------|-------|
| Wave-1 research (cli-codex) | Converged |
| Wave-2 extended research (cli-copilot) | Converged |
| Wave-3 validation research (cli-copilot) | Converged at iter 13/20 |
| 8 child packets scaffolded (002-009) | Done, metadata generated, validated |
| Short-name folder convention (`{phaseSlug}-pt-NN`) | Live in resolver + docs + rename complete |
| Wave-3 folder renamed to pt-03 | Done, committed |
| 020 parent implementation-summary updated | Done |
| **005 P0 patch** (impossible cache-hit gate) | **DONE** — trace corrected to 10 unique + 20 repeats = 66.7% nominal; 50 ms gate restated as cache-hit-lane-only |
| 9 P1 patches across 003/004/005/007/008/009 | **DONE** — all applied, all children pass validate.sh --strict (0 errors) |
| **Implementation dispatch executor policy** | **cli-codex gpt-5.4 high fast primary, cli-copilot gpt-5.4 high fallback** (user directive 2026-04-19) |
| /spec_kit:implement :auto 020/002 | Ready to dispatch — first in the critical path |

## What Happened This Session

1. **Scaffolded 8 implementation children** (002-009) under `001-skill-advisor-hook-surface/` based on wave-1 + wave-2 research convergence. Plan in `/Users/michelkerkmeester/.claude/plans/start-running-all-iterations-bright-seal.md`.
2. **Dispatched wave-3 validation research** via `/spec_kit:deep-research :auto` (cli-copilot gpt-5.4 high, 20-iter budget). Orchestrator script at `/tmp/wave3-orchestrator.sh`.
3. **Wave-3 converged early** at iter 13 (rolling avg 0.0367 < 0.05). All 10 validation angles (V1-V10) answered.
4. **Ran final synthesis** via one more cli-copilot call (orchestrator had synthesis on iter 20; convergence fired earlier). Produced the research-validation.md synthesis (111 lines, 20KB) in the wave-3 artifact folder.
5. **Two Sonnet sub-agents** ran in parallel to shorten verbose research/review folder names:
   - First agent chose `{phaseId}-pt-NN` (wrong — stripped phase name)
   - User corrected; second agent fixed to `{phaseSlug}-pt-NN` (right)
   - Final: 69 folders renamed, resolver + skill docs updated, 70 files with cross-reference updates
6. **Wave-3 artifact folder renamed** from the long canonical name to `020-skill-advisor-hook-surface-pt-03/`. 020 parent implementation-summary and wave-3 child implementation-summary updated.

## Wave-3 Patches Applied (P0 + 9 P1 items)

**All wave-3 blockers cleared.** Summary of what landed:

### P0 in 005 — resolved
- **spec.md**: REQ-005 + REQ-006 rewritten; §3.5 Pass/fail thresholds restructured; AS9/AS10 updated
- **plan.md**: DoD explicitly cache-hit-lane-only; Phase 4 replay metric corrected; wall-clock target ≤ 15 min
- **tasks.md**: T020 cache-hit-lane-only; T021 uses corrected trace; T027/T028 aligned; completion criteria expanded
- **Math fix**: replay trace is now "10 unique prompts + 20 repeats = 20/30 = 66.7% hits nominal" (≥ 60% gate with single-flake tolerance to ≥ 19/30 = 63.3%)

### P1 across 003/004/005/007/008/009 — all 9 resolved

| # | Child | Patch |
|---|-------|-------|
| 1 | 003 | REQ-013/014 + AS9/AS10 + edge case: malformed `generation.json` recovery (writable → atomic regen; read-only → `unavailable`); never maps to `"live"` |
| 2 | 004 | Removed `semanticModeEnabled` option + 60-token-floor; added non-live freshness posture table (stale/absent/unavailable/deleted-skill/SIGNAL_KILLED/JSON-fallback); REQ-021/024 |
| 3 | 005 | 3 new fixtures (`skipPolicyEmptyPrompt`, `skipPolicyCommandOnly`, `promptPoisoningAdversarial`) — total 10 fixtures; REQ-022 updated |
| 4 | 005 | Observability contract tightened: exact metric table, closed-enum label values, AdvisorHookDiagnosticRecord TypeScript schema, alert thresholds (warn/page); REQ-023/024 |
| 5 | 007 | Copilot SDK proof = MERGE GATE with version floor; Gemini schema-version fixture matrix (≥ v1 + v2); §3.2a/§3.2b; REQ-009/010 |
| 6 | 007 | `brief: null` no-emit rule per runtime (§3.2c); wrapper-fallback privacy (§3.2d); REQ-011/012 |
| 7 | 008 | §3.5 PostToolUse audit/repair slice (non-enforcement); §3.6 stdin-vs-argv precedence (stdin wins); REQ-009/010 |
| 8 | 008 | Files-to-change table expanded with `post-tool-use.ts` + `codex-post-tool-use-hook.vitest.ts` |
| 9 | 009 | §3.5 validation playbook (8 manual steps) + troubleshooting table (top-5 symptoms); §3.6 prompt-artifact privacy (hook-state + Copilot wrapper + observability); REQ-009/010/011 |

All 6 patched children pass `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <child> --strict --no-recursive` with 0 errors (pre-existing warnings only — RELATED DOCUMENTS custom header + implementation-summary.md baseline — same as pre-patch state).

Full findings: research-validation.md in the wave-3 artifact folder (research/020-skill-advisor-hook-surface-pt-03/)

## Post-Compact Resume Plan

All patches are landed. The critical path is now:

**Step 1:** Dispatch `/spec_kit:implement :auto` on `020/002-shared-payload-advisor-contract` (first in the 8-child critical path). Executor config: `--executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast`. If cli-codex exhausts its budget for any child, re-dispatch with `--executor=cli-copilot --model=gpt-5.4 --reasoning-effort=high` (cli-copilot does not support service-tier via CLI flag — runtime default applies).

**Step 2:** After 020/002 converges, dispatch 020/003, 020/004, 020/005 in sequence (serial — each depends on its predecessor). 020/005 is the **HARD GATE**: no runtime adapter (006/007/008) may merge before 005 converges.

**Step 3:** After 020/005 converges and hard gate lifts, dispatch 020/006 (Claude) → then 020/007 + 020/008 can run in parallel (both depend on 006) → then 020/009 (documentation + release contract) as final closer.

**Step 4:** Release prep checklist in 020/implementation-summary.md §Release Prep — verify each item before final merge.

### Dispatch commands (copy-paste ready)

```
# Child 002 (first, must land before any other)
/spec_kit:implement :auto "Implement 020/002-shared-payload-advisor-contract per spec.md/plan.md/tasks.md" --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/002-shared-payload-advisor-contract

# Fallback if cli-codex fails mid-run
/spec_kit:implement :auto "Resume 020/002 implementation" --executor=cli-copilot --model=gpt-5.4 --reasoning-effort=high --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/002-shared-payload-advisor-contract
```

Repeat pattern for 003-009; each command targets its own child spec folder.

## Key Files

### Research artifacts (pt-NN short names live now)

The three research waves live at `../research/` relative to this packet (i.e. under 026-graph-and-context-optimization/research/):
- 020-skill-advisor-hook-surface-pt-01/research.md — wave-1 synthesis (cli-codex)
- 020-skill-advisor-hook-surface-pt-02/research-extended.md — wave-2 synthesis (cli-copilot)
- 020-skill-advisor-hook-surface-pt-03/research-validation.md — wave-3 synthesis (cli-copilot, the critical doc for next steps)
- 020-skill-advisor-hook-surface-pt-03/iterations/iteration-001.md through iteration-013.md — per-iter narratives
- 020-skill-advisor-hook-surface-pt-03/findings-registry.json — structured findings
- 020-skill-advisor-hook-surface-pt-03/deep-research-state.jsonl — session state stream

### 020 phase spec tree (this packet)

Parent-level docs in this same folder:
- spec.md — umbrella spec (Level 3)
- plan.md — 8-child critical path
- tasks.md — umbrella tasks
- checklist.md — verification checklist
- decision-record.md — ADR-001-004
- implementation-summary.md — Dispatch Log + Children Convergence Log + Release Prep
- handover.md — THIS FILE (post-compact resume point)
- battle-plan.md — full delegation sequence (T1-T10) for all 8 children

### 8 implementation children (scaffolded, not yet implemented)
- `020/002-shared-payload-advisor-contract/` — first in the chain
- `020/003-advisor-freshness-and-source-cache/` — P1 patches pending
- `020/004-advisor-brief-producer-cache-policy/` — P1 patches pending
- `020/005-advisor-renderer-and-regression-harness/` — **P0 patches required**
- `020/006-claude-hook-wiring/`
- `020/007-gemini-copilot-hook-wiring/` — P1 patches pending
- `020/008-codex-integration-and-hook-policy/` — P1 patches pending
- `020/009-documentation-and-release-contract/` — P1 patches pending

### 020/001 research charter (for traceability)
- `020/001-initial-research/` — wave-1 charter (converged)
- `020/001-initial-research/002-extended-wave-copilot/` — wave-2 charter (converged)
- `020/001-initial-research/003-implementation-plan-validation-copilot/` — wave-3 charter (converged)

### Short-name convention (newly-defined backend logic)
- `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` — `resolveArtifactRoot()` + `allocateShortSubfolder()` now produce `{phaseSlug}-pt-NN`
- Skill docs at .opencode/skill/sk-deep-research/SKILL.md and .opencode/skill/sk-deep-review/SKILL.md — format documented
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` + `_confirm.yaml` — format documented
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` + `_confirm.yaml` — format documented

## Git State

Recent commits (chronological, newest at top):
```
<recent> feat(020/001/003): wave-3 validation converged + synthesis written
184ec13bc fix(026): update cross-references from NNN-pt-MM to full phaseSlug-pt-MM
20a215e76 fix(026): re-rename research/review artifact folders to full phaseSlug format
bd81002eb fix(026): restore full phaseSlug in artifact subfolder naming convention
26440f71a fix(026): update cross-references to renamed research/review folders
46c0e6e09 refactor(026): rename verbose research/review folders to {phaseId}-pt-{NN} convention
f09bae2ac docs(paths): update skill and command docs for {phaseId}-pt-{NN} naming
84f03d056 refactor(026): use allocateShortSubfolder() in resolveArtifactRoot()
1b09a2550 chore(020): wire parent packet to 8-child layout + add ADR-004
9d8c5b326 chore(020): scaffold 009-documentation-and-release-contract
9b84047fb chore(020): scaffold 008-codex-integration-and-hook-policy
764120b0f chore(020): scaffold 007-gemini-copilot-hook-wiring
e2ef0b5dd chore(020): scaffold 006-claude-hook-wiring
8423a21dd chore(020): scaffold 005-advisor-renderer-and-regression-harness
93fcd4c12 chore(020): scaffold 004-advisor-brief-producer-cache-policy
dce9740cf chore(020): scaffold 003-advisor-freshness-and-source-cache
6d5a5183b chore(020): scaffold 002-shared-payload-advisor-contract
1adb864c0 feat(020/001/002): cli-copilot extended wave converged (10 iterations)
0715ac5d0 feat(020/001): cli-codex wave 1 converged (10 iterations)
```

Working tree: clean (only untracked `.claude/scheduled_tasks.lock` which is local harness state, not project).

## Background Tasks Status (all completed)

- `bd569ior1` — wave-3 orchestrator (20-iter budget, converged at 13) — **COMPLETED**
- `b6gsz2yql` — wave-3 synthesis dispatch — **COMPLETED**
- `afb74927a162b88e0` — first rename agent (wrong format) — **COMPLETED**
- `abe77f712c11eb222` — corrective rename agent (right format) — **COMPLETED**

No active background tasks.

## Safety Notes for Post-Compact Resume

1. **Do not re-dispatch any research wave** — 3 waves converged, architecture is settled.
2. **Do not scaffold new children** — 8 children (002-009) are the finalized decomposition.
3. **Patches are landed** — wave-3 P0 (005 impossible gate) + all 9 P1 items are applied and validated. No additional spec edits needed before implementation.
4. **Executor policy** — cli-codex gpt-5.4 high fast primary; cli-copilot gpt-5.4 high fallback. Do not mix other executors into the 020 train without updating the continuity frontmatter.
5. **Plan file at `/Users/michelkerkmeester/.claude/plans/start-running-all-iterations-bright-seal.md`** is from an earlier planning pass — treat as historical reference, not current state.

## Recommended First Message Post-Compact

"Resume 020. Patches are landed. Follow `battle-plan.md` starting at T1 (dispatch `/spec_kit:implement :auto` on 020/002). Fall back to cli-copilot if cli-codex fails mid-run."

## Battle Plan

See `./battle-plan.md` for the full delegation sequence covering all 8 children: 10 campaigns (T1-T10), per-child implement + deep-review + integration gates, hard-gate enforcement at 005, parallel-track coordination for 007+008, rollback playbook, and explicit "100% perfection" release criteria. Every dispatch command is copy-paste ready.
