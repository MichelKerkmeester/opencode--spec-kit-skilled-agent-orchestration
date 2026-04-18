---
title: "Implementation Plan: Phase 017 Wave C — Rollout + Sweeps"
description: "Wave C execution plan: 5 tasks totalling 15h over 2 days. Staged T-CNS-03 sweep (1 smoke folder → 15 sequential), T-SRS-BND-01 permissive-mode canary, T-EVD-01 warn-then-strict activation. Per-folder rollback strategy for HIGH rollback-cost sweep."
trigger_phrases: ["phase 017 wave c plan", "017 rollout plan", "wave c staged rollout", "t-cns-03 sixteen-folder sweep plan", "t-srs-bnd-01 canary plan"]
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/004-rollout-sweeps"
    last_updated_at: "2026-04-17T14:41:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave C plan scaffolded from parent plan.md §4 + rollback §6 + risks §7"
    next_safe_action: "Await Wave A + B merge → execute per phase-1/phase-2/phase-3 ordering"
    blockers: ["Wave A merged", "Wave B merged"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Phase 017 Wave C — Rollout + Sweeps

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Wave C executes 5 tree-wide rollout tasks over 15h / 2 working days. The critical path is the T-CNS-03 16-folder canonical-save sweep — HIGH rollback cost, mitigated by a 1-folder smoke test and per-folder commits. T-SRS-BND-01 (session-resume auth) runs staged with a permissive-mode canary before full enable. T-EVD-01 activates the evidence-marker lint once T-EVD-01-prep (Wave A) is confirmed complete. T-CPN-01 + T-W1-MCX-01 are small, file-independent amends. Depends on Waves A + B merged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

After Wave C code-complete, the following gates MUST pass:

1. **`/spec_kit:deep-review :auto` ×7** on Wave C scope (16-folder sweep outcomes + evidence-marker lint + session-resume auth) emits ZERO new P0, ZERO new P1.
2. **`validate.sh --strict` on 017 folder** exits 0 with 0 warnings.
3. **Per-folder verification** — `jq '.lastUpdated' description.json` across all 16 folders returns timestamps within 10m of `derived.last_save_at`.
4. **Canary confirmation** — T-SRS-BND-01 permissive-mode canary logged at least one accept + one reject outcome before flag flips to reject-mode.
5. **Lint scope verification** — T-EVD-01 `--strict` mode flags ZERO `)` closers across 017 + 018 + parent 016 folders.
6. **Vitest suite** passes for `session-resume.ts` accept/reject cases and `evidence-marker-lint.vitest.ts`.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### 3.1 Wave C task graph

```
T-EVD-01 (lint activation)           [parallel track A]
T-CPN-01 (CP-002 amend)              [parallel track A]
T-W1-MCX-01 (memory-context rename)  [parallel track A]
    ↓ (independent of A)
T-SRS-BND-01 (session-resume auth, staged)
    ↓ (permissive canary → reject-mode)
T-CNS-03 (16-folder sweep)           [sequential per folder, gated on A+B merge]
    ↓ 1 smoke folder
    ↓ 15 remaining folders
Wave C gate (×7 deep-review)
```

### 3.2 Sweep architecture (T-CNS-03)

```
for folder in 026-graph-and-context-optimization/*/ (16 total):
    /memory:save --subfolder=<folder>
    jq '.lastUpdated' <folder>/description.json    # assert fresh
    jq '.derived.last_save_at' <folder>/graph-metadata.json  # assert fresh
    git add <folder>/description.json <folder>/graph-metadata.json
    git commit -m "chore(017): T-CNS-03 canonical save refresh on <folder-name>"
```

### 3.3 Session-resume auth (T-SRS-BND-01) phased rollout

```
phase-1 (code): bind args.sessionId to MCP transport identity
phase-2 (flag): permissive-mode ON, log accept + reject outcomes
phase-3 (canary): real session accept verified + forced-reject verified
phase-4 (enable): flip permissive-mode OFF → reject-mode
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. PHASES

### Phase 1 — Small amends + lint activation (parallelizable, ~6h)

Run in parallel (file-independent):
1. **T-EVD-01** (3h) — activate evidence-marker lint. Start in warn-mode; confirm T-EVD-01-prep (Wave A) gave zero `)` closers in 016 checklist.md; flip to `--strict`.
2. **T-CPN-01** (1h) — amend closing-pass-notes CP-002 section with `[STATUS: RESOLVED 2026-04-17]` + commit `e774eef07` citation.
3. **T-W1-MCX-01** (2h) — rename `readiness` → `advisoryPreset` in `StructuralRoutingNudgeMeta` at `handlers/memory-context.ts:200, 425` OR remove if always-literal.

Gate: vitest for `memory-context` and `evidence-marker-lint` pass; no new `)` closers flagged.

### Phase 2 — Session-resume auth staged rollout (~8h)

1. **T-SRS-BND-01** code change: bind `args.sessionId` to MCP transport identity at `session-resume.ts:443-456` + `tools/lifecycle-tools.ts:67`.
2. Add permissive-mode flag (default ON during canary).
3. Canary run: real cli-copilot session invokes `handleSessionResume`; verify accept outcome logged.
4. Forced-reject run: inject mismatched sessionId; verify reject outcome logged.
5. Flip permissive-mode OFF.
6. Vitest accept/reject cases pass.

Gate: canary log shows at least one accept + one reject outcome; permissive-mode OFF committed.

### Phase 3 — 16-folder canonical-save sweep (~8h, HIGH rollback cost)

1. Pre-sweep backup: `git stash push -m "pre-017-sweep" -- 026-graph-and-context-optimization/*/description.json`.
2. **Smoke test**: run sweep on 1 low-risk folder (e.g. `002-cache-warning-hooks/` or comparable). Verify fresh `lastUpdated` + `last_save_at`. Commit.
3. If smoke test passes: sweep remaining 15 folders sequentially.
4. Per-folder commit with message `chore(017): T-CNS-03 canonical save refresh on <folder-name>`.
5. Final verification: `for f in 026/*/; do jq '.lastUpdated' $f/description.json; jq '.derived.last_save_at' $f/graph-metadata.json; done`.

Gate: 16/16 folders have fresh metadata within 10m convergence.

### Phase 4 — Wave C ship gate (~1h)

1. Run `/spec_kit:deep-review :auto` ×7 on Wave C scope.
2. Run `validate.sh --strict` on 017 folder.
3. Update `implementation-summary.md` with Wave C completion narrative.
4. Mark all CHK-C-01..05 + CHK-C-GATE items complete with `[EVIDENCE: <commit-hash> <description>]` citations.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING

### 5.1 Unit tests (vitest)

- `evidence-marker-lint.vitest.ts` (NEW): 5+ cases covering `)` closer detection, `]` closer pass, EVIDENCE-in-prose false-positive avoidance.
- `session-resume.vitest.ts` accept + reject cases with matched/mismatched sessionId.
- `memory-context.vitest.ts`: confirm `advisoryPreset` field present (or absent if removed) without breaking downstream consumer contract.

### 5.2 Integration tests

- 16-folder sweep: full loop verified end-to-end on smoke folder before committing 15-folder batch.
- T-SRS-BND-01 canary: real cli-copilot session exercise both accept + forced-reject paths.
- `/spec_kit:deep-review :auto` ×7 on Wave C scope (post-implementation).

### 5.3 Manual verification

- Smoke-folder `jq` assertions documented pre-sweep and post-sweep.
- Canary session log retained for Phase 017 audit trail.
- Grep parity post T-W1-MCX-01: `grep -rn 'readiness' mcp_server/handlers/memory-context.ts` returns 0 (or documented residual consumer contract surface).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### 6.1 Phase dependencies

- **Depends on**: `../001-infrastructure-primitives/` (Wave A) MERGED — canonical-save writer fix is prerequisite for T-CNS-03 to produce fresh writes.
- **Depends on**: `../002-cluster-consumers/` (Wave B) MERGED — trust-state vocabulary and research-folder backfill must be complete before tree-wide sweep.
- **Blocks**: `../004-p2-maintainability/` (Wave D) ship gate.

### 6.2 External dependencies

None new. Existing tooling: `jq`, `git`, `npx tsc`, `vitest`, `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh`.

### 6.3 Runtime dependencies

- cli-codex gpt-5.4 xhigh fast (primary autonomous executor for T-CNS-03 loop)
- cli-copilot gpt-5.4 high (fallback, 3-concurrent max per `feedback_copilot_concurrency_override`)
- Manual orchestration (Opus 4.7) for T-SRS-BND-01 canary oversight.

### 6.4 Operator-constraint dependencies

- `feedback_phase_018_autonomous` (user memory) — DELETE-not-archive, `/spec_kit:deep-review :auto` ×7 per wave gate.
- `feedback_stop_over_confirming` (user memory) — skip A/B/C/D approval menus when rollout step is obvious.
- `feedback_worktree_cleanliness_not_a_blocker` (user memory) — parallel worktrees do not gate sweep; only pre-sweep stash of `description.json` is required.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

### 7.1 Per-task rollback

| Task | Rollback | Risk |
|------|----------|------|
| T-EVD-01 | `git revert` single commit; lint defaults to warn-mode | Low |
| T-CPN-01 | `git revert` single commit; 1-line status tag removal | Low |
| T-W1-MCX-01 | `git revert` single commit; readiness field restored | Low |
| T-SRS-BND-01 | Flip permissive-mode flag ON (runtime rollback); `git revert` for code rollback | Medium — staged rollout eliminates most risk |
| T-CNS-03 | Per-folder `git revert` (16 separate commits); restore `git stash pop` pre-sweep backup | HIGH — but per-folder granularity limits blast radius |

### 7.2 Wave-level rollback

If Wave C ship gate fails:
1. Identify failing task(s) from `/spec_kit:deep-review :auto` ×7 output.
2. Revert failing commits only; leave passing commits in place.
3. Re-run Wave C gate after fix.

### 7.3 Irreversible operations

- T-CNS-03 sweep WRITES to 16 existing `description.json` + `graph-metadata.json` files. Each per-folder commit is individually reversible, but a mass rollback is expensive (16 reverts sequentially) — prefer targeted revert of problematic folder only.
- T-EVD-01 `--strict` activation does not itself modify files, but failure in strict mode can block downstream CI. Warn-mode remains available as temporary rollback.

### 7.4 Pre-sweep safety net

- Before starting Phase 3: `git stash push -m "pre-017-sweep-safety-net" -- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/*/description.json .opencode/specs/system-spec-kit/026-graph-and-context-optimization/*/graph-metadata.json`.
- Stash is a read-only safety net — expected to be dropped after Wave C gate passes.
- If mid-sweep corruption detected: `git stash pop` restores pre-sweep state for un-committed folders; already-committed folders use `git revert` per folder.
<!-- /ANCHOR:rollback -->
