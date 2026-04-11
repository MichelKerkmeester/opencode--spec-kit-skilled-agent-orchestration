---
title: "Phase 018 Autonomous Execution — Live Handover"
purpose: "Resume document for the orchestrator session running Gates A→F via cli-codex gpt-5.4 high fast. Updated after each gate close. Read this first if context was compacted."
last_updated: 2026-04-11T21:30:00Z
session_role: orchestrator (claude-opus-4-6 in Claude Code)
worker: cli-codex gpt-5.4 high fast (primary), cli-copilot gpt-5.4 high (fallback after 3 codex failures)
branch: system-speckit/026-graph-and-context-optimization
directives:
  - DELETE old memories, do not archive — phase 018 makes them irrelevant
  - NO observation windows (D0 2-week, canonical 7-day, F 180-day all dead)
  - Run all gates autonomously without confirmation
  - After all 6 gates code-complete: dispatch /spec_kit:deep-review × 7 iterations per gate, fix every finding
  - Mark every spec.md/plan.md/tasks.md/checklist.md/decision-record.md/implementation-summary.md across all 6 gate packets `status: complete` + verified at end
  - Commit + push to 026 after every gate close
---

# Phase 018 Live Handover

**If you are reading this after a context compaction**, this is your current state. Read sections 1–4 first, then act.

---

## 1. Current Pipeline State

| Gate | Status | Background ID | Commit | Notes |
|:-:|---|---|---|---|
| A — Pre-work | ✅ DONE | `bm7rb2730` | `d35fc6e9a` + `63e5a0635` | template anchor fixes, validator exclusion, backup, status flip follow-up |
| B — Foundation | ✅ DONE | `b8bwxd5tk` (v2) | `b69b44bec` | schema migration (causal_edges anchor cols + 2 indexes), archive flip 183→184, 199 tests passing. **Note: ranking ×0.3 + archived_hit_rate metric will be removed in B-cleanup.** |
| B-cleanup — Delete legacy memory rows + files | ⏳ queued | — | — | NEW STEP. DELETE the 183 archived rows + rm the .md files + remove ranking penalty + remove archived_hit_rate. Prompt at /tmp/execute-gate-b-cleanup.prompt |
| **C — Writer Ready** | 🟡 **IN FLIGHT** | `bnvwpmjwt` | — | 4 new modules + memory-save.ts XL rewrite + template _memory.continuity + 243-test catalog. **Skip the shadow_only activation step in post-processing — observation framework removed.** |
| D — Reader Ready | ⏳ ready | — | — | 6 reader handlers + 3-level resumeLadder (no archived fallback) + 13-feature regression + perf benchmarks. NO D0 observation. |
| E — Runtime Migration | ⏳ ready | — | — | Single canonical flip (no state machine, no observation gates) + 160+ doc/cmd/agent/skill updates |
| F — Cleanup Verification | ⏳ ready | — | — | REPURPOSED. Verify Gate B cleanup completeness, remove deprecated archived-tier code, no orphan edges. NO 180-day observation. NO retire/keep/investigate decision. |

**Pipeline order**: Gate A ✅ → Gate B ✅ → **Gate C 🟡** → Gate B-cleanup → Gate D → Gate E → Gate F → deep-review × 7 per gate × 6 gates = 42 iterations → fix findings → final completion marking

**Next action when Gate C notification fires**: read tail of `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/6a7d3112-89bf-442b-92c2-4d3557d832db/tasks/bnvwpmjwt.output`, verify (skip shadow_only step), commit Gate C scope, push, launch Gate B-cleanup, then Gate D.

---

## 2. Active Background Tasks + Cron Jobs

**Codex execution**:
- `bnvwpmjwt` — Gate C populate (running, ~120-240 min wall clock)

**Status check cron**:
- `2dc90c4c` — every 5 min, polls `bnvwpmjwt` output. Reports "still running" or extracts final status.
- Previous crons (deleted): `421e424b` (Gate B), pre-existing per-gate.
- Rotate cron when launching next gate: `CronDelete` old, `CronCreate` new pointing at next background ID.

---

## 3. Critical Context (Don't Forget)

### Codex sandbox limitation
The `cli-codex --full-auto --sandbox workspace-write` configuration **blocks `.git/index.lock` writes**. Codex agents cannot run `git commit` or `git push` from inside their sandbox. **Orchestrator (this session) handles all git ops.**

Pattern per gate:
1. Codex agent edits files in workspace + reports "commit-ready files" list in its final stdout
2. Orchestrator reads the file list, runs `git add` + `git commit` + `git push`
3. Orchestrator flips Gate's packet `status: planned/blocked → complete` + adds `closed_by_commit: <hash>` in frontmatter
4. Launch next Gate

### Gate B logic-sync resolution (rebaselined from packet's 155 assumption)
The packet was based on earlier "~155 memory files" research. Live DB had **183 legacy memory rows + 1 pre-existing archived non-memory baseline row**, and the actual column is **`file_path`** (not `source_path`). Resolution:
- Use `file_path` LIKE `'%/memory/%.md'` everywhere
- Final archived count = 184 (183 new + 1 baseline)
- Bleed check: 1 non-memory archived row is the **baseline, not bleed**
- Don't touch the baseline row

Gate B v2 prompt at `/tmp/execute-gate-b-v2.prompt` carries the rebaselined invariants. If Gate C+ ever queries this state, use the rebaselined numbers.

### Gate A deferred warmup check
The `memory_context({mode: "resume"})` warmup check returned a cancellation envelope during Gate A. Deferred to post-Gate-B verification (the warmup exercises the same code path Gate B's schema migration touches). Not a blocker for Gate B/C/D entry. Re-verify after Gate D's reader retarget if it's still cancelling.

### memory.db backup
`memory-018-pre.db` (195MB) at `mcp_server/database/`. **NOT committed to git** (too large). Local-only safety net for Gate B rollback. Refreshed during Gate B v2 right before cutover. Keep this file until phase 018 closes.

### Parallel track noise
The 042 `sk-deep-research/sk-deep-review/sk-improve-agent` lane is actively committing on the same branch. Per the "worktree cleanliness is never a blocker" memory rule, **never flag dirty worktree as a concern**. When staging Gate work, filter to Gate-specific paths only — don't `git add -A`.

---

## 4. Resume Procedure (After Compaction)

1. **Read this file** (sections 1–4)
2. Check active background task: `ls -la /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/6a7d3112-89bf-442b-92c2-4d3557d832db/tasks/bnvwpmjwt.output` (replace with current Gate's ID from §1 table). If size > 0, the gate finished — read tail, commit, push, launch next gate.
3. Check cron jobs are still scheduled (they're session-only and die when this Claude session exits — may need to recreate if compaction restarted the session)
4. `git log -10 --oneline` to confirm latest commit matches §1 table
5. Verify branch: `git branch --show-current` should be `system-speckit/026-graph-and-context-optimization`
6. Resume from current Gate's notification queue

---

## 5. Gate Prompt Files

All Codex execution prompts live at (rewritten 2026-04-11T21:30Z to remove observation/archive complexity):

- `/tmp/execute-gate-a.prompt` — Pre-work (DONE)
- `/tmp/execute-gate-b.prompt` — Foundation v1 (halted, superseded)
- `/tmp/execute-gate-b-v2.prompt` — Foundation rebaselined (DONE)
- `/tmp/execute-gate-b-cleanup.prompt` — DELETE legacy memory rows + files (NEW, queued after Gate C)
- `/tmp/execute-gate-c.prompt` — Writer Ready (IN FLIGHT as `bnvwpmjwt`, may still produce shadow_only step which we skip in post-processing)
- `/tmp/execute-gate-d.prompt` — Reader Ready (REWRITTEN: 3-level resumeLadder, no D0)
- `/tmp/execute-gate-e.prompt` — Runtime Migration (REWRITTEN: single canonical flip, no state machine)
- `/tmp/execute-gate-f-cleanup.prompt` — Cleanup Verification (NEW, replaces the old execute-gate-f-setup.prompt)
- `/tmp/execute-gate-f-setup.prompt` — old observation kickoff (superseded, do not use)

If `/tmp` is wiped (system reboot), regenerate from `autonomous-execution-runbook.md` §3 / §4 templates plus:
- Per-gate scope from `001-gate-a-prework/` through `006-gate-f-archive-permanence/`
- Resource map at `resource-map.md`
- Iter detail at `research/iterations/iteration-NNN.md`

---

## 6. Per-Gate Codex Invocation (Canonical)

```bash
cat /tmp/execute-gate-X.prompt | codex exec \
  --model gpt-5.4 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  --full-auto \
  - 2>&1 | tail -30
```

Use `run_in_background: true` via Bash tool with `timeout: 600000` (10 min — but tasks will continue running past timeout in background mode).

---

## 7. What Each Gate Does (Quick Reference)

- **A — Pre-work** (~1 wk effort, ~30-60 min Codex): template anchor fixes, root packet backfill audit, sqlite backup, rollback drill, embedding warmup check
- **B — Foundation** (~2 wk, ~60-120 min): schema ALTER causal_edges + 2 indexes, archive flip (UPDATE memory_index SET is_archived=1), ranking ×0.3, archived_hit_rate metric
- **C — Writer Ready** (~2 wk, ~120-240 min, biggest): 4 new modules (contentRouter, anchorMergeOperation, atomicIndexMemory, thinContinuityRecord), memory-save.ts XL rewrite (1799 LOC), generate-context.ts refactor, _memory.continuity in 30 templates, S1 shadow_only flag, 243-test catalog
- **D — Reader Ready** (~2 wk, ~90-180 min): restructure memory-search/memory-context/session-resume/session-bootstrap/memory-index-discovery/memory-triggers, resumeLadder helper, 13-feature regression suite (merge-blocking), perf benchmarks, D0 observation kickoff
- **E — Runtime Migration** (~3 wk, ~60-120 min active + 7-day canonical stability): feature flag state machine transitions S1→canonical, 160+ doc/cmd/agent/skill updates including 8 CLI handback files in lockstep with generate-context.js
- **F — Permanence** (~10 min setup + 180-day observation): metric verification, retirement script stub, evidence package template; full retire/keep/investigate decision needs human review at Day 180

---

## 8. Per-Gate Verification Pattern

After each Codex completion notification:

```bash
# 1. Read tail
tail -50 /private/tmp/claude-501/.../tasks/<background-id>.output

# 2. Verify validator (Gate-specific packet)
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/00N-gate-X-name

# 3. Verify any test runs Codex reported
# (e.g., for Gate B: 199 tests across 7 vitest files)

# 4. Read commit-ready files list from output
# 5. git add <each file>
# 6. git commit -m "feat(026.018.00N-gate-X): ..."
# 7. git push origin system-speckit/026-graph-and-context-optimization

# 8. Flip Gate packet status
# Edit each of spec.md/plan.md/tasks.md/checklist.md/decision-record.md (where present)
# in the gate folder: status: planned/blocked → status: complete
# Add closed_by_commit: <hash> field

# 9. Launch next Gate
cat /tmp/execute-gate-(N+1).prompt | codex exec ... --full-auto - 2>&1 | tail -30 &

# 10. Rotate status cron
# CronDelete old job ID
# CronCreate new with new background ID
```

---

## 9. Hard Stops (Pause Pipeline + Surface)

- **Codex reports BLOCKED**: read the blocker, decide if it's environmental (sandbox/git) or content (real logic gap). Environmental → orchestrator handles + relaunches. Content → flip the packet to match reality + relaunch.
- **Gate B archive flip post-verify shows >184 archived OR <184**: ROLLBACK from `memory-018-pre.db` immediately, halt, surface to user.
- **2-hop BFS regression after Gate B**: rollback, halt, surface.
- **Gate C 243-test catalog has >5% failures**: halt Gate C, investigate.
- **Gate C shadow-compare <95% parity on golden set**: halt, investigate routing classifier.
- **Gate D 13-feature regression any failure**: halt, rollback Gate D commit, investigate.
- **Gate D resume p95 >500ms or search p95 >300ms**: halt, investigate.
- **Gate E auto-rollback fires**: demote to prior state, halt, surface to user.

---

## 10. What "Done" Looks Like

Phase 018 closes when:
- All 6 gate packets validate `--strict` 0/0
- All 6 gate packet files have `status: complete` + `closed_by_commit: <hash>`
- Parent packet `018-canonical-continuity-refactor/spec.md` flipped to `status: complete`
- Parent `implementation-summary.md` filled with full 6-gate evidence package
- 243-test catalog passing (Gate C closeout)
- 13-feature regression passing (Gate D closeout)
- Feature flag at `canonical` state, stable ≥7 days (Gate E closeout)
- archived_hit_rate observation has been collecting since Gate B (Gate F prerequisite, not closure)
- Final commit + push to 026 branch
- Memory saved via `generate-context.js`

**Gate F decision (retire/keep/investigate) is OUT OF SCOPE for the autonomous run** — it requires 180 days of observation data + human review.

---

## 11. Last Resort: Restart from Compacted State

If everything is lost (this file, /tmp prompts, cron jobs, background tasks):

1. `git log --oneline --all | head -20` to see last commit
2. `git status` to see worktree state
3. Read `autonomous-execution-runbook.md` v2 + `resource-map.md` v2 to reconstruct execution plan
4. Read `verify-phases-review.md` to know which gates were cleaned up in prior session
5. Check each child packet's `implementation-summary.md` to see which gates already shipped
6. Resume from the next-unshipped gate per §3 §4 §5 of `autonomous-execution-runbook.md`

The pipeline is recoverable from git history alone if everything else is wiped.
