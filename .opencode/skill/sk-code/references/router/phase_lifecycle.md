---
title: Router Reference — Phase Lifecycle
description: 5-phase development lifecycle (Research → Implementation → Code Quality Gate → Debugging → Verification) used by the sk-code smart router across WEBFLOW, NEXTJS, and GO.
---

# Router Reference — Phase Lifecycle

Phase 0-3 lifecycle with mandatory gates at Phase 1.5 (Code Quality) and Phase 3 (Verification), per-phase resource loading, and the three iron laws.

---

## 1. OVERVIEW

### Purpose

Captures the 5-phase development lifecycle the smart router operates over. Phase 0 is optional; Phase 1.5 (Code Quality Gate) is mandatory before claiming Phase 1 done; Phase 3 (Verification) is mandatory before any "done" claim. Operators consult this file when they need to know what loads at each phase or where they are in the gate sequence.

### Core Principle

NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE FROM THE ACTUAL STACK. The lifecycle exists to make that rule operationally enforceable.

### When to Use

- Locating the current phase in a long-running implementation session.
- Deciding whether Phase 0 (Research) is warranted for a given task.
- Looking up which resources should load for a given phase plus stack combination.
- Auditing whether a "done" claim is backed by Phase 3 evidence.

### Key Sources

- Authoritative narrative: `SKILL.md` §3 HOW IT WORKS.
- Per-phase ALWAYS / NEVER / ESCALATE rules: `SKILL.md` §4 RULES.
- Universal severity contract: `references/universal/code_quality_standards.md`.

---

## 2. PHASE MAP

```
Phase 0 (Research, optional)
    ↓
Phase 1 (Implementation)
    ↓
Phase 1.5 (Code Quality Gate) ← MANDATORY: must pass before claiming Phase 1 done
    ↓
Phase 2 (Debugging) ← only if Phase 1.5 surfaces issues OR Phase 3 flags failures
    ↓
Phase 3 (Verification) ← MANDATORY: must run STACK_VERIFICATION_COMMANDS + (WEBFLOW) browser matrix
    ↓
done
```

Transitions:

- 0 → 1: research complete, plan ready.
- 1 → 1.5: code written, builds locally.
- 1.5 → 2: P0 violations found.
- 2 → 1.5: fix applied; re-run quality gate.
- 1.5 → 3: all P0 items pass.
- 3 → 1 / 2: verification flags issues.
- 3 → done: all `STACK_VERIFICATION_COMMANDS` exit 0; for WEBFLOW, multi-viewport browser clean.

---

## 3. IRON LAWS

1. **NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE** — Phase 3 is mandatory; `STACK_VERIFICATION_COMMANDS` must all exit 0.
2. **NO PHASE 1 DONE WITHOUT CODE QUALITY GATE** — Phase 1.5 P0 items must pass. P1 deferrals require explicit user approval.
3. **NO SKIPPING DEBUGGING ON SYMPTOMS** — fix at root cause, not symptom.

---

## 4. PER-PHASE RESOURCE LOADING

| Phase                | Universal core                                                                                | WEBFLOW (live)                                                                          | NEXTJS / GO (stub)                                                                |
| -------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 0 (Research)         | `references/universal/multi_agent_research.md`                                                | Performance audit overlay (Lighthouse + waterfall)                                      | mirror universal core; populate when project lands                                |
| 1 (Implementation)   | `references/universal/code_style_guide.md`                                                    | `references/webflow/implementation/*.md`                                                | `references/{nextjs,go}/implementation/*.md` (stubs)                              |
| 1.5 (Code Quality)   | `references/universal/code_quality_standards.md` (severity contract)                          | `assets/webflow/checklists/code_quality_checklist.md`                                   | `assets/{nextjs,go}/checklists/code_quality_checklist.md` (stubs)                 |
| 2 (Debugging)        | `references/universal/error_recovery.md`, `assets/universal/checklists/debugging_checklist.md` | `references/webflow/debugging/*.md`                                                     | `references/{nextjs,go}/debugging/*.md` (stubs)                                   |
| 3 (Verification)     | `assets/universal/checklists/verification_checklist.md`                                       | `references/webflow/verification/*.md` + `assets/webflow/checklists/performance_loading_checklist.md` | `STACK_VERIFICATION_COMMANDS[stack]` (`npm run …` for NEXTJS, `go test …` for GO) |

---

## 5. PHASE 0 — RESEARCH (OPTIONAL)

Use when:

- Performance audit needed (WEBFLOW: PageSpeed + Lighthouse + waterfall capture).
- Unfamiliar codebase exploration.
- Architectural decision needs evidence.
- Multi-system feature spanning 3+ subsystems.

Skip when:

- Simple, isolated fix.
- Clear requirement with known solution.
- Time-critical hotfix.

---

## 6. PHASE 1 — IMPLEMENTATION

Universal principles (applied per stack):

1. Condition-based waiting (no arbitrary timeouts).
2. Defense-in-depth validation (entry → processing → output → safe access).
3. Stack-specific bootstrap:
   - **WEBFLOW**: CDN-safe init, IntersectionObserver gates, snake_case naming, file headers.
   - **NEXTJS**: App Router (Server vs Client Components), vanilla-extract recipes, motion v12 transitions, react-hook-form + zod, react-aria.
   - **GO**: cmd/ + internal/ + pkg/ layout, gin handler + service + repository layers, sqlc-generated repositories, validator registration, golang-jwt issuance / verification.

---

## 7. PHASE 1.5 — CODE QUALITY GATE (MANDATORY)

1. Identify the file type and stack.
2. Load the matching stack checklist (WEBFLOW: `assets/webflow/checklists/code_quality_checklist.md`; NEXTJS / GO: `assets/{nextjs,go}/checklists/code_quality_checklist.md`).
3. Validate all P0 items — fix any failures.
4. Validate all P1 items — fix or get deferral approval.
5. Document P2 deferrals.
6. Mark each item `[x]` with evidence.

**Gate rule**: any P0 fail → BLOCKED until fixed.

---

## 8. PHASE 2 — DEBUGGING

4-phase systematic framework:

1. **Root Cause Investigation** (reproduce, capture, identify failing surface, last-known-good).
2. **Pattern Analysis** (search error string, trace symptom → cause).
3. **Hypothesis Testing** (state hypothesis, predict outcome, test ONE thing, document).
4. **Implementation** (fix at root, add regression test, document in commit).

**Three-strike rule**: 3+ failed hypotheses → STOP and reconsider mental model.

---

## 9. PHASE 3 — VERIFICATION (MANDATORY)

8-step Gate Function:

1. IDENTIFY the proving command/action.
2. RUN `STACK_VERIFICATION_COMMANDS[stack]`.
3. TEST (WEBFLOW: browser; NEXTJS / GO: unit + integration suites).
4. VERIFY output matches; exit code 0.
5. VERIFY (WEBFLOW) multi-viewport (mobile + desktop).
6. VERIFY (CRITICAL) cross-browser / cross-platform.
7. RECORD what you saw / which command exited 0.
8. ONLY THEN make the claim.

Without evidence in your message, "done" is a guess.

---

---

## 10. RELATED RESOURCES

- `references/router/stack_detection.md` - gates which stack-specific resources load at each phase.
- `references/router/intent_classification.md` - gates which intent-specific resources load.
- `references/router/resource_loading.md` - load-level and path-resolution logic.
- `references/router/cross_stack_pairing.md` - canonical Next.js ↔ Go contract surfaced at Phase 1 API intents.
- `references/universal/code_quality_standards.md` - severity contract enforced at Phase 1.5.
- `references/universal/error_recovery.md` - recovery decision tree at Phase 2.
- `assets/universal/checklists/debugging_checklist.md` and `verification_checklist.md` - universal Phase 2 / Phase 3 checklists.
- `SKILL.md` §3 HOW IT WORKS — full per-phase narratives.
- `SKILL.md` §4 RULES — per-phase ALWAYS / NEVER / ESCALATE rules.
