---
title: "Implementation Plan: Perfect Session Capturing [template:level_3/plan.md]"
description: "Add and synchronize phases 018-020 so the parent pack tracks the shipped runtime follow-up and the still-open live-proof hardening work."
trigger_phrases:
  - "implementation plan"
  - "phase 018"
  - "phase 019"
  - "phase 020"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Perfect Session Capturing

This document records the current verified state for this follow-up. Use [spec.md](spec.md), the child phase folders, and [research.md](research.md) together.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, shell validation commands |
| **Framework** | system-spec-kit Level 3 parent spec workflow |
| **Storage** | Parent and child spec folders under `.opencode/specs/.../010-perfect-session-capturing` |
| **Testing** | Recursive spec validation plus existing focused automated proof lanes |

### Overview

This pass extends the post-audit roadmap into official child phases. The plan is simple: create clean docs for phases `018`, `019`, and `020`, correct the parent phase map, and keep the truth boundary conservative by documenting `018` and `019` as implemented runtime work while leaving `020` open for retained live proof.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent spec folder already exists and remains the chosen scope.
- [x] The follow-up roadmap is already defined by the completed audit and current runtime truth.
- [x] The new child phase names are fixed: `018`, `019`, `020`.

### Definition of Done
- [x] Child phase docs exist for `018`, `019`, and `020`.
- [x] The parent pack references only the intended roadmap phases.
- [x] Implemented/runtime claims remain conservative and evidence-backed.
- [ ] Recursive validation passes after the final markdown state settles.
<!-- /ANCHOR:quality-gates -->

---

## 3. ARCHITECTURE

### Pattern
Parent roadmap hub with phase-local follow-up documentation.

### Key Components
- **Parent pack**: owns the integrated truth and phase order.
- **Phase 018**: owns runtime-contract and indexability policy documentation.
- **Phase 019**: owns source-capability and structured-input preference documentation.
- **Phase 020**: owns the still-open live-proof and parity-hardening work.

### Data Flow
Completed audit -> runtime follow-up recommendations -> official phase folders `018`-`020` -> parent roadmap sync -> recursive validation.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Child-Phase Creation
- [x] Create the `018`, `019`, and `020` child folders under the parent pack.
- [x] Replace scaffold placeholders with truthful phase-specific markdown.

### Phase 2: Parent Sync
- [x] Rewrite the parent phase map and handoff chain to include only `018`-`020`.
- [x] Update the parent plan, tasks, checklist, decision record, and summary to reflect the new roadmap.

### Phase 3: Verification
- [ ] Run recursive validation on the full parent pack.
- [ ] Confirm the new child docs introduce no placeholder drift or numbering errors.

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Parent pack plus new child phases | `validate.sh --strict --recursive` |
| Parent completion verification | Parent checklist evidence | `check-completion.sh --strict` |
| Runtime proof reference | Implemented claims for phases `018` and `019` | Existing rerun-backed automated evidence already recorded outside this doc pass |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Completed audit and `research.md` | Internal | Green | The roadmap would lose its truth anchor |
| Shipped runtime work for phases `018` and `019` | Internal | Green | Implemented claims would become speculative |
| Future retained live artifacts for phase `020` | Internal | Yellow | Parent closeout remains intentionally incomplete |

---

## 7. ROLLBACK PLAN

- **Trigger**: Placeholder phase rows, wrong numbering, or over-claimed proof language remain after the doc pass.
- **Procedure**: Revert only the affected parent and new child markdown files, then reapply the minimum edits needed to restore the truthful roadmap.

---

## 8. L2: PHASE DEPENDENCIES

```
018 Runtime Contract -> 019 Source Capabilities -> 020 Live Proof
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 018 | 017 shipped baseline | 019 and parent sync |
| 019 | 018 runtime contract | 020 and parent sync |
| 020 | 019 shared contract baseline | Parent closeout claims |

---

## 9. L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Child-phase documentation | Medium | 1-2 hours |
| Parent roadmap synchronization | Medium | 1 hour |
| Validation | Low | <1 hour |
| **Total** | | **2-4 hours** |

---

## 10. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Child phase numbering fixed to `018`-`020`.
- [x] Parent roadmap no longer contains append-script placeholder rows.
- [ ] Recursive validation rerun after the final markdown state settles.

### Rollback Procedure
1. Revert only the parent docs and the new child phase markdown files.
2. Re-run recursive validation.
3. Reapply only the roadmap edits needed to restore truthful numbering and status.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Markdown-only rollback.

---

## 11. L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────────────┐
│ Phase 018    │────►│ Phase 019        │────►│ Phase 020             │
│ Contract     │     │ Source Capabs    │     │ Live Proof Hardening  │
└──────────────┘     └──────────────────┘     └───────────────────────┘
          \_____________________ Parent roadmap sync __________________/
```

---

## 12. L3: CRITICAL PATH

1. Create truthful child docs for `018`-`020`.
2. Correct the parent phase map and handoff chain.
3. Re-run recursive validation.

**Total Critical Path**: dominated by parent/child synchronization, not by runtime implementation.

---

## 13. L3: MILESTONES

- **M1**: Child phases `018`-`020` exist with real content.
- **M2**: Parent docs reference the correct roadmap and proof boundary.
- **M3**: Recursive validation confirms the tree is clean.
