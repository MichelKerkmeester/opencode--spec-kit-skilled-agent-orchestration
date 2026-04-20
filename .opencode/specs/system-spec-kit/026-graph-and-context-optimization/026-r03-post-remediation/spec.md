---
title: "Feature Specification: Phase 026 — R03 Post-Remediation Remediation"
description: "Close 8 P1 + 4 P2 findings surfaced by R03 deep-review (iters 1-38) of the skill-advisor phase stack. One cli-copilot agent per finding, sequential dispatch, fresh process per fix."
trigger_phrases:
  - "phase 026"
  - "r03 remediation"
  - "p1 007"
  - "post remediation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/026-r03-post-remediation"
    last_updated_at: "2026-04-20T04:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded Phase 026 for 12 R03 findings"
    next_safe_action: "Dispatch per-finding cli-copilot sequence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 026 — R03 Post-Remediation Remediation

<!-- SPECKIT_LEVEL: 2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent** | `../020-skill-advisor-hook-surface/` |
| **Source** | R03 iteration files at `../020-skill-advisor-hook-surface/review/iterations/iteration-{007,013,014,017-021,028,029}.md` |
| **Dispatch** | 12 sequential cli-copilot agents, 1 per finding |

## 2. PROBLEM & PURPOSE

### Problem
R03 post-remediation review (38/40 iters before user stop) surfaced 8 P1 + 4 P2 new findings on the post-Phase-025 state. 5 of 8 P1s sit in D7 (docs drift), 2 in telemetry reachability + D4 error handling, 1 in D5 cross-workspace cache bleed.

### Purpose
Close all 12 findings mechanically. No new architecture. One fresh cli-copilot invocation per finding, sequential (max 1 concurrent). Driver kills each agent on exit and spawns fresh for next finding.

## 3. SCOPE — 12 FINDINGS / 12 TASKS

### P1 — Required (8)

| Task | Finding | Dim | Evidence | Fix |
|---|---|---|---|---|
| **T01** | P1-007-01 | D7 | `review/iterations/iteration-007.md` | Update `references/hooks/skill-advisor-hook.md` Copilot + Codex snippets to match actual `.github/hooks/superset-notify.json` + `.codex/settings.json` + `.codex/policy.json` shapes, OR label them as illustrative examples with links to authoritative repo files |
| **T02** | P1-014-01 | D7 | `review/iterations/iteration-014.md` | Replace hardcoded inventory/health values in operator docs with live references OR clearly annotate them as snapshot values with the snapshot date |
| **T03** | P1-017-01 | D3 | `review/iterations/iteration-017.md` | Wire `finalizePrompt(promptId)` into the documented live-session wrapper workflow in `LIVE_SESSION_WRAPPER_SETUP.md` so operators actually invoke it per prompt |
| **T04** | P1-018-01 | D4 | `review/iterations/iteration-018.md` | Replace bare `catch {}` handlers in advisor producer stack with typed error classification that preserves root-cause in diagnostics |
| **T05** | P1-019-01 | D5 | `review/iterations/iteration-019.md` | Add workspace root to OpenCode plugin host cache key to prevent cross-repository cache bleed |
| **T06** | P1-020-01 | D6 | `review/iterations/iteration-020.md` | Add regression test in `spec-kit-skill-advisor-plugin.vitest.ts` exercising plugin cross-workspace cache boundary (verifies T05 fix) |
| **T07** | P1-021-01 | D7 | `review/iterations/iteration-021.md` | Reconcile manual-testing-playbook: either create promised split-doc package files OR update playbook to honestly reflect current inline-root-table structure |
| **T08** | P1-028-01 | D7 | `review/iterations/iteration-028.md` | Replace bare-path commands in playbook measurement + analyzer scenarios with checkout-valid `npm --prefix` or explicit `cd` commands |

### P2 — Suggestion (4)

| Task | Finding | Dim | Evidence | Fix |
|---|---|---|---|---|
| **T09** | P2-007-01 | D7 | `review/iterations/iteration-007.md` | Replace bare filename reference to `LIVE_SESSION_WRAPPER_SETUP.md` with repo-relative Markdown link in LT-001 scenario |
| **T10** | P2-013-01 | D6 | `review/iterations/iteration-013.md` | Add test covering default telemetry fallback path behavior |
| **T11** | P2-013-02 | D6 | `review/iterations/iteration-013.md` | Add test covering subprocess spawn-error classification branch |
| **T12** | P2-029-01 | D1 | `review/iterations/iteration-029.md` | Apply single-line sanitizer to `provenance.sourceRefs` (same sanitizer used for `metadata.skillLabel`) |

## 4. REQUIREMENTS

### 4.1 P0
None.

### 4.2 P1 (all 8 above MUST close)
Each T01-T08 closed with:
- Code/doc change implementing the fix
- `Closed` status in implementation-summary.md with `file:line` evidence
- If test added (T06), the test passes

### 4.3 P2 (T09-T12 SHOULD close; defer acceptable if time-boxed)

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** Hook reference Copilot + Codex config snippets byte-match (or link to) actual shipped files
2. **AC-2** No hardcoded health/inventory numbers in operator docs without explicit snapshot annotation
3. **AC-3** `LIVE_SESSION_WRAPPER_SETUP.md` documents `finalizePrompt()` invocation in the operator workflow
4. **AC-4** Advisor producer fail-open paths preserve root-cause error in diagnostics (verified by unit test)
5. **AC-5** Plugin cache key includes workspace root; identical prompt in repo A vs repo B returns distinct cached briefs
6. **AC-6** Plugin cross-workspace test exists and passes
7. **AC-7** Playbook §validation matches actual file structure (no fictional split-doc claims)
8. **AC-8** Playbook measurement + analyzer commands execute from repo root
9. **AC-9** LT-001 points at the actual setup guide path
10. **AC-10** Default telemetry fallback + subprocess spawn-error tests exist and pass
11. **AC-11** `provenance.sourceRefs` passes through same sanitizer as `skillLabel`
12. **AC-12** Focused test suite (Phase 025 baseline + new T06/T10/T11 tests) all pass

## 6. DISPATCH PROTOCOL

Sequential driver script `run-phase-026.sh`:
1. For each task T01..T12:
   - Build task-specific prompt with iteration file + fix instructions
   - Fresh `copilot -p "..." --model gpt-5.4 --allow-all-tools --no-ask-user` invocation (blocks until agent exits → "killed")
   - Verify completion marker `TASK_TNN_DONE`
   - Verify files touched match scope
   - Continue to next
2. Final: orchestrator runs focused test suite, commits, pushes

Max 1 concurrent. Each agent starts fresh with no prior session memory. Total 12 sequential invocations.
