---
title: "Im [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/006-claude-hook-findings-remediation/plan]"
description: "Level 2 implementation: (1) spike freshness.ts to locate sourceSignature write gap; (2) patch scanner to persist signature; (3) normalize .claude/settings.local.json to Claude-schema; (4) add multi-turn stream-json harness section to skill-advisor validation playbook. All verified via direct script smokes + one real claude -p parity check."
trigger_phrases:
  - "claude hook findings plan"
  - "freshness sourcesignature fix"
  - "settings.local.json normalization plan"
  - "multi-turn stream-json harness plan"
  - "026/009/006 plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-plan | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/006-claude-hook-findings-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented T004-T013; AS-003/AS-004 blocked"
    next_safe_action: "User review; dispatch T001 spike when approved"
    blockers: []
    completion_pct: 86
    open_questions:
      - "Confirm freshness.ts is the right module before spending spike time"
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-plan | v2.2 -->"
---
# Implementation Plan: Claude Hook Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-plan | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server), JSON (settings + state), Markdown (playbook) |
| **Framework** | Node 20+, Vitest for regression |
| **Storage** | Filesystem state: `.opencode/skill/.advisor-state/`, `$TMPDIR/speckit-claude-hooks/` |
| **Testing** | Vitest (`skill-advisor/tests`, `tests/advisor-*`) + direct `node dist/hooks/claude/*.js` smokes + one `claude -p` parity run |

### Overview
Three small, independent fixes bundled because they share the same test scaffolding. Sequential: (A) spike the skill-advisor state/freshness code to locate where `sourceSignature` is read and why it never writes; (B) make the scanner persist `sourceSignature` atomically so freshness probes can reconcile; (C) normalize `.claude/settings.local.json` to Claude-documented hook schema only; (D) document a multi-turn stream-json regression harness that reduces hook-testing cost by 5–10×. Verification layers: direct hook-script smoke → stream-json hook_started count → full advisor test suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2–3)
- [x] Success criteria measurable (spec.md §5, all four SCs verifiable via command output)
- [ ] Dependencies identified — pending T001 spike to locate exact fix site

### Definition of Done
- [ ] All four P0 requirements met with cited evidence
- [ ] `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` green
- [ ] Advisor test suite green (corpus parity + privacy + timing)
- [ ] One real `claude -p` parity run recorded in implementation-summary.md evidence block
- [ ] `.claude/settings.local.json.bak` removed (or documented if retained)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Filesystem-backed state machine with atomic tmp-rename writes (pattern already established in `hook-state.ts:246`).

### Key Components
- **`freshness.ts`** (or peer in `skill-advisor/lib/`): decides live/stale/absent/unavailable based on generation + sourceSignature comparison
- **Graph scanner** (`skill_graph_scan` entrypoint): walks sources, computes new signature, writes `skill-graph-generation.json`
- **`.claude/settings.local.json`**: hook registration for Claude Code runtime
- **Skill-advisor validation playbook**: operator-facing test scripture

### Data Flow
```
sources change → scan() computes newSig → writes skill-graph-generation.json{generation++, sourceSignature: newSig, state: "live"}
                                              ↓
advisor-probe() reads generation + sourceSignature + current-source-hash
                                              ↓
                          if sig matches → freshness=live, else freshness=stale
```

Today: `sourceSignature: null` always → probe can never match → always `stale`. Fix: ensure scan() writes the signature.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spike + Investigation
- [ ] Read `skill-advisor/lib/freshness.*` and scanner entrypoint; locate sourceSignature write call (or confirm it's missing)
- [ ] Check git log for `.advisor-state/` and `skill-graph-generation.json` changes in last 30 days
- [ ] Write temporary spike findings and carry final evidence into `implementation-summary.md` (fix site, one-line diff estimate, any blockers)

### Phase 2: Core Implementation
- [ ] Patch scanner to compute and persist `sourceSignature` atomically
- [ ] Normalize `.claude/settings.local.json` — remove outer `bash`/`timeoutSec` from all 4 event blocks (UserPromptSubmit, SessionStart, PreCompact, Stop)
- [ ] Add §9 "Multi-turn regression harness" to `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md`
- [ ] Add cross-reference in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`

### Phase 3: Verification
- [ ] Run `skill_graph_scan` → verify `sourceSignature` non-null → verify direct advisor smoke returns `freshness: live`
- [ ] Run stream-json parity: `claude -p "ping" --output-format stream-json --include-hook-events --max-budget-usd 0.30` → count `hook_started` events (expect 2 per event type)
- [ ] Run full advisor suite: `npm --prefix .opencode/skill/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests`
- [ ] Write implementation-summary.md with evidence block
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `freshness.ts` signature reconciliation | Vitest (add one test case if not present) |
| Integration | Direct hook-script JSONL output | `node dist/hooks/claude/user-prompt-submit.js` + bash parser |
| Manual | One `claude -p` parity run + hook_started count | `claude -p --include-hook-events` + `jq` |
| Regression | Advisor corpus parity (200/200), timing (p95 ≤ 50ms), privacy audit | Vitest (`tests/advisor-*.vitest.ts`) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `skill_graph_scan` MCP tool | Internal | Green | Can't verify SC-001 without it; fallback: direct `node scripts/scan.js` if exposed |
| Claude Code CLI `--include-hook-events` | External | Green (verified 2.1.118 on 2026-04-23) | Can't verify REQ-004 hook count; fallback: instrument dist/hooks/claude/* with counter |
| Vitest advisor suites | Internal | Green (per spec.md validation evidence) | Fix could regress parity; surface early via `npm run test` before merging |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of — freshness probe starts returning `unavailable` after fix; advisor corpus parity drops below 200/200; hook_started count exceeds 2 per event; build or typecheck fails.
- **Procedure**:
  1. `git revert <commit-sha>` for the Phase 2 commit(s).
  2. `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` to rebuild dist/.
  3. Smoke: `printf '%s' '{"prompt":"help me commit","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` — expect pre-fix `freshness: stale` behavior.
  4. Restore `.claude/settings.local.json.bak` if a backup was kept.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Spike) ──► Phase 2 (Patch + Normalize + Document) ──► Phase 3 (Verify)
```

Normalize and Document are parallelizable within Phase 2 since they touch disjoint files. Patch must land before Verify runs SC-001.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Spike | None | Patch |
| Patch (freshness) | Spike | Verify SC-001 |
| Normalize (settings) | None (can run parallel with Patch) | Verify SC-002, SC-003 |
| Document (playbook) | None (parallel) | Verify SC-004 |
| Verify | Patch + Normalize + Document | Done |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Spike | Low | 30–45 min |
| Patch (freshness sig) | Med | 1–2 h (incl. vitest adjustment) |
| Normalize settings | Low | 15 min |
| Document playbook | Low | 30 min |
| Verification | Low | 30 min + ~$0.30 for one `claude -p` parity run |
| **Total** | | **2.5–4 h + ~$0.30 test spend** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `cp .claude/settings.local.json .claude/settings.local.json.bak` before normalization edit
- [ ] Record current `hook_started` counts per event from a baseline `claude -p` run (for before/after delta)
- [ ] `npm run build` green before edits to confirm clean baseline

### Rollback Procedure
1. Revert the feature commit: `git revert <sha>`
2. If `dist/` diverged, rebuild: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`
3. Smoke direct hook script to confirm pre-fix behavior returns
4. If settings.local.json rolled back, restore from `.bak` and confirm via `jq` diff

### Data Reversal
- **Has data migrations?** No — only state file schema is `skill-graph-generation.json` which is self-describing (`schemaVersion` implicit). A rolled-back scanner will simply rewrite the file without `sourceSignature`, which matches current production state.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
