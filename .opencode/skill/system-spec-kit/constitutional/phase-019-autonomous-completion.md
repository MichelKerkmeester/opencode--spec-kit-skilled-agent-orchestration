---
title: "PHASE 019 AUTONOMOUS COMPLETION - RESEARCH TO REMEDIATION"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - phase 019
  - 019-system-hardening
  - 019/001
  - system hardening
  - initial-research
  - iterations complete
  - iteration converged
  - all iterations done
  - wave 3 complete
  - sub-packet converged
  - research converged
  - review converged
  - canonical-save-invariants
  - delta-review-015
  - q4-nfkc-robustness
  - description-regen-strategy
  - routing-accuracy
  - template-validator-audit
  - synthesize findings
  - consolidate registry
  - create remediation
  - implement recommendations
---

# PHASE 019 AUTONOMOUS COMPLETION

> When all six sub-packet iterations under the Phase 019 initial-research umbrella converge, drive straight through synthesis to remediation sub-phase creation to implementation in one continuous autonomous run. No confirmation gates.

This rule is a HARD BLOCK. Do NOT stop at "iterations converged" — that is the start of the next phase, not the end.

---

## RULE DETAILS

### Rule 1: Completion Trigger Recognition

TRIGGER: The last outstanding sub-packet under the Phase 019 initial-research umbrella reports convergence (research or review state machine writes final record with status converged).

Six sub-packets identified by the last 3-digit prefix:
1. canonical-save-invariants — deep-research
2. delta-review-015 — deep-review
3. q4-nfkc-robustness — deep-research
4. description-regen-strategy — deep-research
5. routing-accuracy — deep-research
6. template-validator-audit — deep-review

ACTION (all in one continuous run — no user prompts):

1. Synthesize findings across all six sub-packets into the 019/001 implementation-summary findings-registry section
2. Gather recommendations — rank P0/P1 by severity and cross-packet impact, dedup clusters
3. Create remediation sub-phases under the 019-system-hardening umbrella — one Level 2 child per recommendation cluster
4. Implement each child via spec_kit:implement :auto dispatching cli-codex gpt-5.4 high fast
5. Commit and push after each child with conventional-commit format
6. Mark all spec docs complete + verified post-convergence

RATIONALE: User explicit directive 2026-04-18 — single autonomous drive from research-converged to production-remediated.

---

### Rule 2: Executor Configuration (Fixed)

Every implementation dispatch uses:

- executor cli-codex
- model gpt-5.4
- reasoning-effort high
- service-tier fast
- executor-timeout 1800

Fallback only on cli-codex unavailability: cli-copilot with max 3 concurrent dispatches (API throttle cap).

---

### Rule 3: No Confirmation Gates

FORBIDDEN during the autonomous completion run:
- A/B/C/D menus between synthesis, scaffolding, and implementation steps
- "Should I proceed?" prompts
- Observation windows between children
- Re-asking Gate 3 (answer carries across the whole run)
- Reporting "phase complete" and stopping without kicking off the next child

PERMITTED interruptions:
- Hard safety halts (syntax failure, test failure after 3 self-correction attempts)
- User explicitly typing a new instruction that supersedes

---

### Rule 4: Artifact Handling

- DELETE (not archive) stale intermediate artifacts per prior autonomous-execution feedback
- Per-iteration delta files at deltas/iter-NNN.jsonl are REQUIRED — validator enforces via post-dispatch-validate canonical-type and delta-file asserts
- Commit and push after each discrete unit (each child completion, not between iterations within a child)

---

### Rule 5: Scope of "Allowed to go on for hours"

This rule grants explicit authorization for extended autonomous execution:
- Multiple hours wall-clock permitted
- Multiple sub-phases permitted in sequence
- Multiple commits and pushes permitted
- Multiple executor dispatches permitted (respecting copilot cap if fallback used)

Baseline state is NEVER a blocker:
- Dirty worktree, parallel M files, untracked files
- User runs parallel tracks — do not flag these during the autonomous run

---

## QUICK REFERENCE

| Signal | Action | Type |
|--------|--------|------|
| Sub-packet 006 converges | Begin synthesis (Rule 1) | HARD |
| "Should I start synthesis?" | SKIP — just start | HARD BAN |
| cli-codex unreachable | Fall back to cli-copilot (max 3 concurrent) | SOFT |
| Child implementation complete | Commit and push, begin next child | HARD |
| All children complete | Mark 019/001 + 019 umbrella + parent roots complete and verified | HARD |
| Test/syntax failure | Self-correct up to 3x, then HALT and report | HARD |

---

## SELF-CHECK

```
[ ] Did I verify all 6 sub-packets reached converged state before starting synthesis?
[ ] Am I using cli-codex gpt-5.4 high fast for every implementation dispatch?
[ ] Did I commit and push after each child completion?
[ ] Did I skip A/B/C/D menus between steps?
[ ] Did I mark 019/001, 019 umbrella, and parent roots complete and verified at the end?
```

---

Constitutional Memory: Always surfaces at top of search results.
Location: .opencode/skill/system-spec-kit/constitutional/
Created 2026-04-18 per explicit user directive during Wave 2 follow-up.
