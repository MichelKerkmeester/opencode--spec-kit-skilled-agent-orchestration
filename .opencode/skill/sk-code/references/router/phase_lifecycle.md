---
title: Router Reference — Phase Lifecycle
description: 5-phase development lifecycle (Research → Implementation → Code Quality Gate → Debugging → Verification) used by the sk-code smart router.
keywords: [phases, lifecycle, implementation, debugging, verification, code-quality, sk-code]
---

# Router Reference — Phase Lifecycle

The sk-code smart router operates over a 5-phase lifecycle inherited from the prior web-stack skill. Phase 0 is optional; Phase 1.5 (Code Quality Gate) is mandatory; Phase 3 (Verification) is mandatory before any "done" claim.

> Authoritative source: `SKILL.md §3 — HOW IT WORKS`. This doc is a deep-reference extract.

---

## Phase Map

```
Phase 0 (Research, optional)
    ↓
Phase 1 (Implementation)
    ↓
Phase 1.5 (Code Quality Gate) ← MANDATORY: must pass before claiming Phase 1 done
    ↓
Phase 2 (Debugging) ← only if Phase 1.5 surfaces issues OR Phase 3 flags failures
    ↓
Phase 3 (Verification) ← MANDATORY: must run STACK_VERIFICATION_COMMANDS + (WEB) browser matrix
    ↓
done
```

Transitions:
- 0 → 1: research complete, plan ready
- 1 → 1.5: code written, builds locally
- 1.5 → 2: P0 violations found
- 2 → 1.5: fix applied; re-run quality gate
- 1.5 → 3: all P0 items pass
- 3 → 1 / 2: verification flags issues
- 3 → done: all `STACK_VERIFICATION_COMMANDS` exit 0; (WEB) multi-viewport clean

## Iron Laws

1. **NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE** — Phase 3 is mandatory; STACK_VERIFICATION_COMMANDS must all exit 0.
2. **NO PHASE 1 DONE WITHOUT CODE QUALITY GATE** — Phase 1.5 P0 items must pass. P1 deferrals require explicit user approval.
3. **NO SKIPPING DEBUGGING ON SYMPTOMS** — fix at root cause, not symptom.

## Per-Phase Resource Loading

| Phase | Universal | Web | Other stacks |
|---|---|---|---|
| 0 (Research) | `references/universal/multi_agent_research.md` | (Performance audit overlay) | (delegate to placeholder) |
| 1 (Implementation) | `references/universal/code_style_guide.md` | `references/webflow/implementation/*.md` | `references/<stack>/_placeholder.md` |
| 1.5 (Code Quality) | `references/universal/code_quality_standards.md` (severity contract) | `assets/webflow/checklists/code_quality_checklist.md` | `assets/<stack>/_placeholder.md` |
| 2 (Debugging) | `references/universal/error_recovery.md`, `assets/universal/checklists/debugging_checklist.md` | `references/webflow/debugging/*.md` | `references/<stack>/_placeholder.md` |
| 3 (Verification) | `assets/universal/checklists/verification_checklist.md` | `references/webflow/verification/*.md` + `assets/webflow/checklists/performance_loading_checklist.md` | `STACK_VERIFICATION_COMMANDS[stack]` |

## Phase 0 — Research (optional)

Use when:
- Performance audit needed (WEB: PageSpeed + Lighthouse + waterfall capture)
- Unfamiliar codebase exploration
- Architectural decision needs evidence
- Multi-system feature spanning 3+ subsystems

Skip when:
- Simple, isolated fix
- Clear requirement with known solution
- Time-critical hotfix

## Phase 1 — Implementation

Universal principles (applied per stack):
1. Condition-based waiting (no arbitrary timeouts)
2. Defense-in-depth validation (entry → processing → output → safe access)
3. Stack-specific bootstrap (WEB: CDN-safe init + IntersectionObserver; GO: DI + microservice bootstrap; REACT: component architecture; etc.)

## Phase 1.5 — Code Quality Gate (MANDATORY)

1. Identify file type and stack
2. Load matching stack checklist (WEB: `assets/webflow/checklists/code_quality_checklist.md`; others: `assets/<stack>/_placeholder.md`)
3. Validate all P0 items — fix any failures
4. Validate all P1 items — fix or get deferral approval
5. Document P2 deferrals
6. Mark each item `[x]` with evidence

Gate Rule: any P0 fail → BLOCKED until fixed.

## Phase 2 — Debugging

4-phase systematic framework:
1. Root Cause Investigation (reproduce, capture, identify failing surface, last-known-good)
2. Pattern Analysis (search error string, trace symptom → cause)
3. Hypothesis Testing (state hypothesis, predict outcome, test ONE thing, document)
4. Implementation (fix at root, add regression test, document in commit)

3-strike rule: 3+ failed hypotheses → STOP and reconsider mental model.

## Phase 3 — Verification (MANDATORY)

8-step Gate Function:
1. IDENTIFY proving command/action
2. RUN `STACK_VERIFICATION_COMMANDS[stack]`
3. TEST (WEB: browser; non-WEB: unit + integration suites)
4. VERIFY output matches; exit code 0
5. VERIFY (WEB) multi-viewport (mobile + desktop)
6. VERIFY (CRITICAL) cross-browser / cross-platform
7. RECORD what you saw / which command exited 0
8. ONLY THEN make the claim

Without evidence in your message, "done" is a guess.

## See Also

- `references/router/stack_detection.md` — gates which stack-specific resources load
- `references/router/intent_classification.md` — gates which intent-specific resources load
- `references/router/resource_loading.md` — load level + path resolution
- `SKILL.md §3 — HOW IT WORKS` — full per-phase narratives
- `SKILL.md §4 — RULES` — per-phase ALWAYS / NEVER / ESCALATE rules
