---
title: "Tasks: SpecKit Refinement - Implementation Breakdown [019-speckit-refinement/tasks]"
description: "Task list for Phase 1 MVP implementation of the Handover System based on ECP research."
trigger_phrases:
  - "tasks"
  - "speckit"
  - "refinement"
  - "implementation"
  - "breakdown"
  - "019"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: SpecKit Refinement - Implementation Breakdown

Task list for Phase 1 MVP implementation of the Handover System based on ECP research.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.1 -->
<!-- SPECKIT_STATUS: COMPLETE -->

---

<!-- ANCHOR:notation -->
## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: speckit, handover, gates, templates
- **Priority**: P0-critical (core infrastructure improvement)

### Input
Design documents from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/019-speckit-refinement`

### Prerequisites
- **Required**: `plan.md` (COMPLETE), `spec.md` (COMPLETE)

### Organization
Tasks grouped by component for Phase 1 MVP (~140 LOC total).

---

<!-- /ANCHOR:notation -->
## 2. CONVENTIONS

### Task Format
```text
- [ ] T### [P?] Description - file path
```

- **[P]**: Can run in parallel (no dependencies on other tasks)
- ID format: `T###`

### Path Conventions
- Templates: `.opencode/skill/system-spec-kit/templates/`
- Commands: `.opencode/command/`
- Config: `AGENTS.md`

---

## WORKING FILES LOCATION

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data | Temporary |
| `memory/` | Context preservation | Permanent |
| Root | Final documentation | Permanent |

---

## 3. TASK GROUPS BY COMPONENT

### Component A: Template (Foundation)

**Purpose**: Create minimal handoff template
**Goal**: Enable quick session branching with ~10 line handoff

- [ ] T001 [P] Create `quick-continue.md` template
  - **File:** `.opencode/skill/system-spec-kit/templates/quick-continue.md`
  - **Requirement:** plan.md Section 6.1
  - **Acceptance:** Template includes:
    - SPECKIT_TEMPLATE_SOURCE header comment
    - CONTINUATION - Attempt [N] header
    - Table with: Spec Folder, Last Completed, Next Action, Blockers
    - Resume command hint
  - **Verification:** Template is 10-20 lines, matches plan.md Section 6.1 spec exactly
  - **LOC:** ~30

**Checkpoint**: Template ready for /handover command and Gate 0

---

### Component B: Command

**Purpose**: Create /handover command
**Goal**: Single command creates quick-continue.md in active spec folder

- [ ] T002 Create `/handover` command
  - **File:** `.opencode/command/handover/handover.md` (folder auto-created with file)
  - **Requirement:** plan.md Section 6.2
  - **Acceptance:** Command with YAML frontmatter containing:
    - description, argument-hint, allowed-tools
    - 3-step workflow: VALIDATE → CREATE → DISPLAY
    - Auto-detect spec folder from recent memory files OR use argument
    - Reads plan.md/tasks.md to infer current state
    - Writes quick-continue.md to spec folder (using T001 template structure)
    - Displays formatted output box with handoff content
  - **Verification:** Manual test: `/handover .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/019-speckit-refinement` creates valid quick-continue.md
  - **Dependencies:** T001 (needs template structure to reference)
  - **LOC:** ~60

**Checkpoint**: /handover command functional

---

### Component C: Gate 0 Enhancement

**Purpose**: Auto-create handoff on context compaction
**Goal**: When compaction detected, display branch protocol instead of just blocking

- [ ] T003 [P] Enhance Gate 0 in AGENTS.md
  - **File:** `AGENTS.md` Section 2 (PRE-EXECUTION GATES)
  - **Requirement:** plan.md Section 6.3
  - **Current behavior:** `Action: STOP → "Context compaction detected" → Await user instruction`
  - **New behavior:** `Action: STOP → Display branch protocol with CONTINUATION format`
  - **Acceptance:** Gate 0 action box updated to show:
    - Warning: "CONTEXT COMPACTION DETECTED"
    - Instruction to run `/handover` or copy-paste CONTINUATION block
    - CONTINUATION format: Spec, Last, Next, Resume command
    - Note: Does NOT auto-create file (user must run /handover)
  - **Verification:** Gate 0 text matches plan.md Section 6.3 "MVP Enhancement" format
  - **LOC:** ~20

**Checkpoint**: Gate 0 provides actionable branch instructions

---

### Component D: Gate 7 MVP

**Purpose**: Add soft context health reminder
**Goal**: Heuristic-based suggestion to run /handover during long sessions

- [ ] T004 [P] Add Gate 7 MVP to AGENTS.md
  - **File:** `AGENTS.md` Section 2 (add after Gate 6, before "EXECUTE TASK")
  - **Requirement:** plan.md Section 6.4
  - **Acceptance:** New gate block with:
    - Title: `GATE 7: CONTEXT HEALTH MONITOR [SOFT - MVP]`
    - Trigger: Heuristic self-assessment before complex multi-step actions
    - Heuristics (any 2 = suggest): 20+ tool calls visible, 5+ files modified, user keywords ("long session", "been at this"), frustration keywords ("already said", "repeat")
    - Action: Single soft reminder (not blocking)
    - Message: "Long session detected. Consider running /handover to save your progress."
  - **Verification:** Gate 7 appears in gate flow diagram, matches plan.md Section 6.4
  - **LOC:** ~30

**Checkpoint**: Long session detection active (soft reminder only)

---

### Component E: Integration

**Purpose**: Ensure resume workflow reads quick-continue.md
**Goal**: End-to-end handover → resume workflow functional

- [ ] T005 Update /spec_kit:resume to prioritize quick-continue.md
  - **Files:** 
    - `.opencode/command/spec_kit/resume.md` (main command)
    - `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` (auto mode workflow)
    - `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` (confirm mode workflow)
  - **Requirement:** plan.md Section 9.3 (Integration with Existing Workflows)
  - **Changes needed:**
    1. In resume.md Phase 2 (ARTIFACT VALIDATION): Add quick-continue.md to artifact check list
    2. In YAML assets: Add step to check for quick-continue.md FIRST before other context sources
    3. Priority order: quick-continue.md → STATE.md (Phase 2) → handover.md → memory/*.md
  - **Acceptance:** When quick-continue.md exists in spec folder, resume loads it as primary context source
  - **Verification:** `/spec_kit:resume` with existing quick-continue.md shows its content first
  - **Dependencies:** T001 (template must exist to know what to look for)
  - **LOC:** ~15 (small additions to 3 files)

- [ ] T006 [P] Add quick-continue.md to SKILL.md template list
  - **File:** `.opencode/skill/system-spec-kit/SKILL.md`
  - **Requirement:** Template discoverability
  - **Changes needed:** Add quick-continue.md to templates section with:
    - Template name
    - Purpose: "Minimal handoff for session branching"
    - When to use: "Created by /handover command or manually for quick context transfer"
  - **Acceptance:** Template listed alongside other templates (spec.md, plan.md, etc.)
  - **Verification:** `quick-continue.md` appears in SKILL.md template documentation
  - **LOC:** ~5

- [ ] T007 [P] Add /handover to SKILL.md command routing
  - **File:** `.opencode/skill/system-spec-kit/SKILL.md` Section 2 (SMART ROUTING)
  - **Requirement:** Command discoverability in skill documentation
  - **Changes needed:** Add row to SpecKit Commands table:
    - Command: `/handover`
    - Steps: 3
    - Description: "Create quick handoff for session continuation"
  - **Acceptance:** /handover appears in command routing table
  - **Verification:** Users can find /handover in SKILL.md command list
  - **LOC:** ~3

**Checkpoint**: Phase 1 MVP complete and documented

---

## 4. TASK DEPENDENCIES

```
PARALLEL GROUP A (no dependencies - start immediately):
┌─────────────────────────────────────────────────────────┐
│  T001 quick-continue.md template                        │
│  T003 Gate 0 enhancement                                │
│  T004 Gate 7 MVP                                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
SEQUENTIAL (depends on T001):
┌─────────────────────────────────────────────────────────┐
│  T002 /handover command (references T001 template)      │
│  T005 /spec_kit:resume update (knows what to look for)  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
PARALLEL GROUP B (documentation - can start after T001):
┌─────────────────────────────────────────────────────────┐
│  T006 SKILL.md template list                            │
│  T007 SKILL.md command routing                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
                    ✅ PHASE 1 MVP COMPLETE
```

**Execution Strategy:**
1. **Batch 1 (Parallel):** T001, T003, T004 - Foundation work
2. **Batch 2 (Sequential):** T002, T005 - Depend on T001 template
3. **Batch 3 (Parallel):** T006, T007 - Documentation updates

---

## 5. LOC ESTIMATES

| Task | Component | File(s) | LOC |
|------|-----------|---------|-----|
| T001 | Template | quick-continue.md | 30 |
| T002 | Command | handover/handover.md | 60 |
| T003 | Gate 0 | AGENTS.md | 20 |
| T004 | Gate 7 | AGENTS.md | 30 |
| T005 | Integration | resume.md + 2 YAML files | 15 |
| T006 | Docs | SKILL.md | 5 |
| T007 | Docs | SKILL.md | 3 |
| **Total** | | | **~163 LOC** |

---

## 6. VALIDATION CRITERIA

### Code Quality
- [ ] quick-continue.md template follows SpecKit template conventions (SPECKIT_TEMPLATE_SOURCE header)
- [ ] /handover command follows OpenCode command format (YAML frontmatter)
- [ ] AGENTS.md gate changes maintain consistent structure with Gates 0-6
- [ ] No breaking changes to existing workflows

### Functional Verification
- [ ] `/handover [path]` creates quick-continue.md in spec folder
- [ ] `/handover` (no args) auto-detects spec folder from recent memory files
- [ ] Gate 0 displays CONTINUATION format on compaction trigger
- [ ] Gate 7 soft reminder appears during heuristic-detected long sessions
- [ ] `/spec_kit:resume` prioritizes quick-continue.md when present

### Documentation
- [ ] quick-continue.md listed in SKILL.md templates
- [ ] /handover listed in SKILL.md command routing table
- [ ] Gate 7 appears in AGENTS.md gate flow

---

## 7. CROSS-REFERENCES

| Document | Purpose |
|----------|---------|
| `spec.md` | Research findings, gap analysis, full design |
| `plan.md` | Detailed specifications for each component |
| `checklist.md` | Verification criteria (create after implementation) |
| `AGENTS.md` | Gate system to modify (Gates 0, 7) |
| `SKILL.md` | SpecKit skill documentation to update |

---

## 8. IMPLEMENTATION NOTES

### Gate 0 Clarification
The MVP Gate 0 enhancement does NOT auto-create quick-continue.md. It only:
1. Displays the branch protocol format
2. Instructs user to run `/handover` or copy the CONTINUATION block

This is intentional - auto-creation would require file access during a blocked state, which may not be available during true context compaction.

### Resume Priority Order
The plan.md Section 9.3 specifies this priority for resume:
1. quick-continue.md (if exists) - Phase 1 MVP
2. STATE.md (if exists) - Phase 2
3. handover.md (if exists, <24h old) - existing
4. Recent memory/*.md files - existing

T005 only implements Priority 1 for Phase 1.

---
