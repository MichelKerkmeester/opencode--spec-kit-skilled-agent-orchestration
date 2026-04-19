---
title: "Handover: 020 Skill-Advisor Hook Surface (post-wave-3, pre-implementation)"
description: "Pre-compact handover. Wave-3 validation converged. 1 P0 in child 005 blocks implementation. 9 P1 patches recommended. Folder rename complete. Next action: patch 005 P0 then dispatch /spec_kit:implement :auto 020/002."
trigger_phrases:
  - "020 handover"
  - "020 resume"
  - "020 post compact"
importance_tier: "critical"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface"
    last_updated_at: "2026-04-19T11:10:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Wave-3 converged, synthesis written, folder renamed to pt-03, committed"
    next_safe_action: "Read research-validation.md §3 P0 action list; patch child 005 spec/plan/tasks for impossible cache-hit gate; then proceed with /spec_kit:implement :auto 020/002"
    blockers: ["005 P0 cache-hit-rate gate is mathematically impossible"]

---
# Handover: Phase 020 Skill-Advisor Hook Surface

## Status Snapshot (2026-04-19T11:10:00Z)

**Phase 020 state:** Research complete across 3 waves. Implementation not started.

| Item | State |
|------|-------|
| Wave-1 research (cli-codex) | Converged |
| Wave-2 extended research (cli-copilot) | Converged |
| Wave-3 validation research (cli-copilot) | Converged at iter 13/20 |
| 8 child packets scaffolded (002-009) | Done, metadata generated, validated |
| Short-name folder convention (`{phaseSlug}-pt-NN`) | Live in resolver + docs + rename complete |
| Wave-3 folder renamed to pt-03 | Done, committed |
| 020 parent implementation-summary updated | Done |
| **005 P0 patch** | **NOT DONE — blocks implementation** |
| Other P1 patches (9 items across 003/004/005/007/008/009) | Not done — recommended pre-implementation |
| /spec_kit:implement :auto 020/002 | Not dispatched |

## What Happened This Session

1. **Scaffolded 8 implementation children** (002-009) under `020-skill-advisor-hook-surface/` based on wave-1 + wave-2 research convergence. Plan in `/Users/michelkerkmeester/.claude/plans/start-running-all-iterations-bright-seal.md`.
2. **Dispatched wave-3 validation research** via `/spec_kit:deep-research :auto` (cli-copilot gpt-5.4 high, 20-iter budget). Orchestrator script at `/tmp/wave3-orchestrator.sh`.
3. **Wave-3 converged early** at iter 13 (rolling avg 0.0367 < 0.05). All 10 validation angles (V1-V10) answered.
4. **Ran final synthesis** via one more cli-copilot call (orchestrator had synthesis on iter 20; convergence fired earlier). Produced `research-validation.md` (111 lines, 20KB).
5. **Two Sonnet sub-agents** ran in parallel to shorten verbose research/review folder names:
   - First agent chose `{phaseId}-pt-NN` (wrong — stripped phase name)
   - User corrected; second agent fixed to `{phaseSlug}-pt-NN` (right)
   - Final: 69 folders renamed, resolver + skill docs updated, 70 files with cross-reference updates
6. **Wave-3 artifact folder renamed** from the long canonical name to `020-skill-advisor-hook-surface-pt-03/`. 020 parent implementation-summary and wave-3 child implementation-summary updated.

## Critical Finding from Wave-3 (BLOCKER)

**P0: Child 005's cache-hit-rate replay gate is mathematically impossible.**

005's spec.md / plan.md / tasks.md require cache hit rate ≥ 60% on a synthetic 30-turn replay composed of "20 unique + 10 repeats". But that trace can only yield 10/30 = 33.3% hits, not ≥60%. The gate is unsatisfiable.

**Fix (from research-validation.md §3 P0 actions):**
1. Patch `005-advisor-renderer-and-regression-harness/spec.md` — replace `REQ-006` with a mathematically consistent rule, restate latency gate as cache-hit-only
2. Patch `005-advisor-renderer-and-regression-harness/plan.md` — fix Phase 4 Definition of Done + replay metric + wall-clock target
3. Patch `005-advisor-renderer-and-regression-harness/tasks.md` — fix T021, T028, completion criteria

Full findings: `026/research/020-skill-advisor-hook-surface-pt-03/research-validation.md`

## P1 Patches (Recommended Pre-Implementation)

From research-validation.md §3 P1 actions (9 items):

1. **003** — explicit malformed `.advisor-state/generation.json` recovery path
2. **004** — remove unsupported `semanticModeEnabled` / 60-token-floor scope; pin non-live freshness behavior for all branches
3. **005** — add skip-policy + X5 prompt-poisoning fixtures
4. **005** — tighten observability contract (JSONL shape, label catalog, alert thresholds)
5. **007** — Copilot SDK proof as merge gate + Gemini schema-version fixture matrix
6. **007** — `brief: null` on success = no model-visible output; wrapper fallback privacy rules
7. **008** — add missing `PostToolUse` audit/repair slice; define stdin-vs-argv precedence
8. **008** — stronger runtime-policy/fixture surface
9. **009** — add validation/manual-playbook deliverables; privacy wording for hook-state + Copilot wrapper

## Post-Compact Resume Plan

**Step 1:** Read `research-validation.md` (via the file path in Key Files below). Absorb §1 Executive Summary + §3 Severity Action List.

**Step 2:** Decide scope:
- Option A (recommended): Patch only 005 P0, then start `/spec_kit:implement :auto 020/002`. Handle P1 patches as the train progresses.
- Option B (conservative): Patch 005 P0 + all 9 P1 items, then start implementation. Higher up-front cost, less rework later.
- Option C (aggressive): Skip all patches, start implementation, discover issues during 005 harness build. Not recommended — wave-3 explicitly flagged these as blockers/concerns.

**Step 3:** Execute. Recommended sequence:
1. Patch 005 spec/plan/tasks (P0, ~30 min of edits)
2. If Option B: patch the 9 P1 items (~2-3 hours of edits)
3. Validate: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <each child> --strict --no-recursive`
4. Commit patches
5. `/spec_kit:implement :auto` on 020/002 (shared-payload advisor contract — the first child in the critical path)

## Key Files

### Research artifacts (pt-NN short names live now)
- `026/research/020-skill-advisor-hook-surface-pt-01/research.md` — wave-1 synthesis (cli-codex)
- `026/research/020-skill-advisor-hook-surface-pt-02/research-extended.md` — wave-2 synthesis (cli-copilot)
- `026/research/020-skill-advisor-hook-surface-pt-03/research-validation.md` — wave-3 synthesis (cli-copilot, the critical doc for next steps)
- `026/research/020-skill-advisor-hook-surface-pt-03/iterations/iteration-001.md` through `iteration-013.md` — per-iter narratives
- `026/research/020-skill-advisor-hook-surface-pt-03/findings-registry.json` — structured findings
- `026/research/020-skill-advisor-hook-surface-pt-03/deep-research-state.jsonl` — session state stream

### 020 phase spec tree
- `020-skill-advisor-hook-surface/spec.md` — umbrella spec (Level 3)
- `020-skill-advisor-hook-surface/plan.md` — 8-child critical path
- `020-skill-advisor-hook-surface/tasks.md` — umbrella tasks
- `020-skill-advisor-hook-surface/checklist.md` — verification checklist
- `020-skill-advisor-hook-surface/decision-record.md` — ADR-001-004
- `020-skill-advisor-hook-surface/implementation-summary.md` — Dispatch Log + Children Convergence Log + Release Prep (just updated with wave-3)
- `020-skill-advisor-hook-surface/handover.md` — **THIS FILE** (post-compact resume point)

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
- `.opencode/skill/sk-deep-research/SKILL.md` + `sk-deep-review/SKILL.md` — format documented
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
3. **Do not skip the 005 P0 patch** — it's a mathematically impossible gate; if you try to implement 005 as-written, the harness will never pass.
4. **The wave-3 orchestrator script at `/tmp/wave3-orchestrator.sh`** is ephemeral; don't rely on it post-compact.
5. **Plan file at `/Users/michelkerkmeester/.claude/plans/start-running-all-iterations-bright-seal.md`** is from an earlier planning pass — treat as historical reference, not current state.

## Recommended First Message Post-Compact

"Resume 020. Read `026/020-skill-advisor-hook-surface/handover.md` then read `026/research/020-skill-advisor-hook-surface-pt-03/research-validation.md` §3 P0 actions. Patch child 005 spec/plan/tasks for the impossible cache-hit-rate gate, then we'll decide whether to also patch the 9 P1 items before dispatching `/spec_kit:implement :auto 020/002`."
