---
title: "SpecKit Refinement: Implementation Plan [019-speckit-refinement/plan]"
description: "After deep analysis using Sequential Thinking, the full design risks over-engineering. A phased approach"
trigger_phrases:
  - "speckit"
  - "refinement"
  - "implementation"
  - "plan"
  - "019"
importance_tier: "important"
contextType: "decision"
---
# SpecKit Refinement: Implementation Plan
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->
<!-- SPECKIT_STATUS: COMPLETE -->
<!-- SPECKIT_LAST_MODIFIED: 2024-12-23T14:00:00Z -->

## 1. Overview

| Field | Value |
|-------|-------|
| **Feature** | SpecKit Refinement Based on ECP Research + Handover System v2.0 |
| **Estimated LOC** | ~140 (MVP) to ~490 (Full) |
| **Documentation Level** | Level 2 |
| **Risk Level** | Low (additive changes, no breaking changes) |
| **Approach** | Phased - validate before extending |

---

## 2. Phased Implementation Strategy

### Why Phased?

After deep analysis using Sequential Thinking, the full design risks over-engineering. A phased approach:
1. **Validates before building:** Test if users actually use /handover
2. **Reduces risk:** Smaller changes are easier to test and rollback
3. **Enables user feedback:** Phase 2/3 scope informed by Phase 1 usage
4. **Faster delivery:** Phase 1 can ship in 1-2 sessions

### Phase Summary

| Phase | Name | LOC | Cumulative | When |
|-------|------|-----|------------|------|
| **1** | MVP Handover | 140 | 140 | **Now** |
| **2** | State Tracking | 130 | 270 | After MVP validated |
| **3** | Full System | 220 | 490 | If users request |

---

## 3. Phase 1: Minimum Viable Handover (MVP)

**Goal:** Solve 80% of the handover problem with 20% of the effort

### Tasks

| Task | Files | LOC | Priority |
|------|-------|-----|----------|
| Create quick-continue.md template | `.opencode/skill/system-spec-kit/templates/quick-continue.md` | 30 | P0 |
| Create /handover command (simple) | `.opencode/command/handover/handover.md` | 60 | P0 |
| Add branch protocol to Gate 0 | `AGENTS.md` Section 2 | 20 | P0 |
| Add Gate 7 (soft reminder only) | `AGENTS.md` Section 2 | 30 | P0 |

**Phase 1 Total:** ~140 LOC

### Key Simplifications (vs Full Design)

| Full Design | MVP Simplification |
|-------------|-------------------|
| STATE.md template | Deferred to Phase 2 |
| Sonnet agent for full handover | Deferred to Phase 3 |
| Progressive enforcement (15/25/35) | Single soft reminder |
| Exchange counting | Heuristic-based assessment |
| /handover variants (:quick, :full, :auto) | Single /handover command |

### Gate 7 MVP Design

```
GATE 7: CONTEXT HEALTH MONITOR [SOFT - MVP]

Trigger: Heuristic assessment before complex actions

Heuristics (any 2 = suggest handover):
- Tool calls: 20+ visible in context
- Files modified: 5+ unique files  
- User keywords: "long session", "been at this", "context"
- Frustration keywords: "already said", "repeat", "told you"

Action: Single soft reminder
"📋 Long session detected. Consider running /handover to save your progress."

No hard enforcement in MVP - trust users.
```

---

## 4. Phase 2: Enhanced State Tracking

**Goal:** Add real-time state visibility (ECP's 80/20 win)
**Trigger:** After Phase 1 validated AND users request "where am I" visibility

### Tasks

| Task | Files | LOC | Priority |
|------|-------|-----|----------|
| Create STATE.md template | `.opencode/skill/system-spec-kit/templates/state.md` | 60 | P1 |
| Update generate-context.js | `.opencode/skill/system-memory/scripts/generate-context.js` | 40 | P1 |
| Enhance /spec_kit:resume | `.opencode/command/spec_kit/resume.md` | 30 | P1 |

**Phase 2 Total:** ~130 LOC

### STATE.md Template

```markdown
# Project State: [FEATURE_NAME]
<!-- Auto-updated by generate-context.js -->

## Current Position
| Field | Value |
|-------|-------|
| **Phase** | [RESEARCH / PLANNING / IMPLEMENTATION / REVIEW] |
| **Active File** | [FILE:LINE or N/A] |
| **Last Action** | [TIMESTAMP] |
| **Next Action** | [WHAT TO DO NEXT] |

## File Progress
| File | Status | Notes |
|------|--------|-------|
| spec.md | COMPLETE | Requirements finalized |
| plan.md | IN_PROGRESS | Phase 2 active |

## Blockers
| Blocker | Status | Resolution |
|---------|--------|------------|
| None | - | - |
```

---

## 5. Phase 3: Full Handover System

**Goal:** Complete the vision with parallel execution and progressive enforcement
**Trigger:** After Phase 2 validated AND users request automatic enforcement

### Tasks

| Task | Files | LOC | Priority |
|------|-------|-----|----------|
| Add /handover:full variant | `.opencode/command/handover/handover.md` | 40 | P2 |
| Create Sonnet agent prompt | `.opencode/command/handover/assets/handover_agent.yaml` | 60 | P2 |
| Gate 7 progressive (15/25/35) | `AGENTS.md` Section 2 | 50 | P2 |
| Gate 0.5 continuation validation | `AGENTS.md` Section 2 | 40 | P2 |
| Keyword detection triggers | `AGENTS.md` Section 2 | 30 | P2 |

**Phase 3 Total:** ~220 LOC

---

## 6. Phase 1 Detailed Specifications

### 6.1 quick-continue.md Template

**Purpose:** Minimal handoff for quick session branches (~10 lines)

```markdown
# Quick Continue: [SPEC_FOLDER]
<!-- SPECKIT_TEMPLATE_SOURCE: quick-continue | v1.0 -->

**CONTINUATION - Attempt [N]**

| Field | Value |
|-------|-------|
| **Spec Folder** | [path] |
| **Last Completed** | [task or action] |
| **Next Action** | [single sentence] |
| **Blockers** | [None or brief] |

**Resume with:** `/spec_kit:resume [path]`
```

### 6.2 /handover Command (MVP)

```yaml
---
description: Create quick handoff for session continuation
argument-hint: "[spec-folder-path]"
allowed-tools: Read, Write, Glob
---

# /handover

## 1. Purpose
Create minimal handoff document for session continuation.

## 2. Workflow

STEP 1: VALIDATE
├─ Check: Active spec folder?
│   └─ If argument provided: Use it
│   └─ If no argument: Auto-detect from recent memory files
│   └─ If neither: "No spec folder found. Specify: /handover specs/XXX/"
└─ Proceed if valid

STEP 2: CREATE quick-continue.md
├─ Read: plan.md for current phase
├─ Infer: Last completed action from context
├─ Infer: Next action from context
├─ Note: Any blockers mentioned in conversation
└─ Write: quick-continue.md to spec folder

STEP 3: DISPLAY
├─ Show quick-continue.md content
├─ "Quick handoff saved to: [path]"
└─ "Resume in new session: /spec_kit:resume [path]"

## 3. Output Example

╭─────────────────────────────────────────────────────────────╮
│ ✅ QUICK HANDOFF CREATED                                    │
├─────────────────────────────────────────────────────────────┤
│ CONTINUATION - Attempt 1                                    │
│                                                             │
│ Spec Folder: .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/019-speckit-refinement/ │
│ Last Completed: Updated plan.md with Phase 1 tasks          │
│ Next Action: Create quick-continue.md template              │
│ Blockers: None                                              │
│                                                             │
│ Resume: /spec_kit:resume .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/019-speckit-refinement/ │
╰─────────────────────────────────────────────────────────────╯
```

### 6.3 Gate 0 Enhancement

**Current:**
```
Action: STOP → "Context compaction detected" → Await user instruction
```

**MVP Enhancement:**
```
Action: STOP → Auto-create quick-continue.md → Display branch protocol:

"⚠️ CONTEXT COMPACTION DETECTED

Quick handoff saved. Start new session with:

CONTINUATION - Attempt [N]
Spec: [SPEC_PATH]
Last: [LAST_ACTION]
Next: [NEXT_ACTION]

Resume: /spec_kit:resume [path]"
```

### 6.4 Gate 7 MVP

```
GATE 7: CONTEXT HEALTH [SOFT - MVP]
Trigger: Self-assessment before complex multi-step actions
Heuristics: 20+ tool calls OR 5+ files modified OR user keywords
Action: Single soft reminder, user can ignore
"📋 Long session detected. Consider /handover to save progress."
```

---

## 7. Task Dependencies (Phase 1 Only)

```
Phase 1 (MVP)
├─ quick-continue.md template (independent) ─────────┐
├─ /handover command (depends on: quick-continue) ───┤
├─ Gate 0 enhancement (depends on: quick-continue) ──┤
└─ Gate 7 soft (independent) ────────────────────────┘
                                                     │
                                                     ▼
                                              Phase 1 Complete
```

**Parallel Opportunities:**
- quick-continue.md and Gate 7 can be created in parallel
- /handover and Gate 0 depend on quick-continue template

---

---

## 8. Appendix: Full System Specifications (Phase 2-3)

The following specifications are for Phase 2 and Phase 3 implementation. They are documented here for completeness but should NOT be implemented until Phase 1 is validated.

### 8.1 STATE.md Template (Phase 2)

```markdown
# Project State: [FEATURE_NAME]
<!-- Auto-updated by generate-context.js -->

## Current Position
| Field | Value |
|-------|-------|
| **Phase** | [RESEARCH / PLANNING / IMPLEMENTATION / REVIEW] |
| **Active File** | [FILE:LINE or N/A] |
| **Last Action** | [TIMESTAMP] |
| **Next Action** | [WHAT TO DO NEXT] |

## File Progress
| File | Status | Notes |
|------|--------|-------|
| spec.md | COMPLETE | Requirements finalized |
| plan.md | IN_PROGRESS | Phase 2 active |

## Blockers
| Blocker | Status | Resolution |
|---------|--------|------------|
| None | - | - |
```

### 8.2 Gate 7 Progressive (Phase 3)

```
SOFT TRIGGER (15 exchanges):
  "⚠️ 15+ exchanges. Consider /handover soon."

FIRM TRIGGER (25 exchanges):
  "📋 25 exchanges. Recommend /handover now."
  Options: A) Create now, B) Continue, C) Disable

HARD TRIGGER (35 exchanges):
  "🛑 35 exchanges. Handover required."
  Options: A) Create handover, B) Decline with reason
```

### 8.3 Sonnet Agent Prompt (Phase 3)

```yaml
role: Session Handover Specialist
instructions: |
  READ from {spec_folder}: spec.md, plan.md, tasks.md, STATE.md, 
  quick-continue.md, checklist.md, memory/*.md (last 2-3)
  
  CREATE handover.md with:
  1. Executive Summary (3-5 sentences)
  2. Current State (phase, progress, last/next action)
  3. Key Decisions Made
  4. Blockers & Challenges
  5. Files Modified
  6. Context for Next Session
  7. Incomplete Verification Items
  
  Target: 100-150 lines
```

### 8.4 Gate 0.5 Continuation Validation (Phase 3)

```
Trigger: User provides CONTINUATION handoff message
Action:
  1. Parse handoff → Extract spec_path, last_task, next_task
  2. Read STATE.md → Verify phase matches claim
  3. IF mismatch: Report and ask for resolution
  4. ELSE: Proceed with validated context
```

---

## 9. Validation Approach

### 9.1 Phase 1 Validation
- [ ] /handover creates quick-continue.md in <5 seconds
- [ ] Gate 0 displays branch protocol on compaction
- [ ] Gate 7 soft reminder appears during long sessions
- [ ] /spec_kit:resume reads quick-continue.md
- [ ] User reports "handover is now useful" (qualitative)

### 9.2 Full System Validation (Phase 2-3)
- [ ] STATE.md auto-updates on /memory:save
- [ ] Gate 7 progressive triggers work at thresholds
- [ ] Sonnet agent creates valid handover.md
- [ ] Session resumption time < 30 seconds

---

## 10. Rollback Strategy

**Phase 1 (Low Risk):**
- quick-continue.md and /handover are additive - remove command if issues
- Gate 0/7 changes revert by editing AGENTS.md

**Phase 2-3 (Low Risk):**
- STATE.md is optional utility template
- Sonnet agent is background; failure doesn't block quick handoff

---

## 11. Related Documents

- [spec.md](./spec.md) - Research findings and gap analysis
- [AGENTS.md](/AGENTS.md) - Gate system documentation
- [SKILL.md](/.opencode/skill/system-spec-kit/SKILL.md) - SpecKit skill definition
