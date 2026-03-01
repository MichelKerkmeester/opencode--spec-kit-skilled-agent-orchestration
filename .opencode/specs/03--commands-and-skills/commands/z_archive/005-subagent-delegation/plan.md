---
title: "Implementation Plan: Sub-Agent Delegation - Technical Approach [005-subagent-delegation/plan]"
description: "Implementation plan for delegating /spec_kit:handover and /memory:save execution to sub-agents."
trigger_phrases:
  - "implementation"
  - "plan"
  - "sub"
  - "agent"
  - "delegation"
  - "005"
  - "subagent"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Implementation Plan: Sub-Agent Delegation - Technical Approach

Implementation plan for delegating `/spec_kit:handover` and `/memory:save` execution to sub-agents.

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: commands, sub-agent, task-delegation
- **Priority**: P1
- **Branch**: `005-subagent-delegation`
- **Date**: 2026-01-01
- **Spec**: ./spec.md

### Summary
Refactor two commands to delegate execution-heavy work to sub-agents via the Task tool. Main agent handles validation and user interaction; sub-agent handles file generation and script execution.

### Technical Context
- **Target Files**: handover.md, save.md (commands)
- **Task Tool**: Uses `general` subagent_type
- **Fallback**: Direct execution when Task unavailable
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## 2. IMPLEMENTATION PHASES

### Phase 1: Update handover.md

**Goal**: Add sub-agent delegation with fallback

**Changes**:
1. Add `Task` to allowed-tools (already present)
2. Add new Section 7: SUB-AGENT DELEGATION
3. Modify workflow to dispatch Steps 1-3 to sub-agent
4. Add fallback logic
5. Keep Step 4 (Display) in main agent

**Sub-Agent Prompt Template**:
```markdown
Execute handover workflow for spec folder: [spec_path]

INPUTS:
- spec_path: [validated path]
- detection_method: [recent/provided]

TASKS:
1. Load context from spec folder (spec.md, plan.md, tasks.md, checklist.md, memory/*.md)
2. Determine attempt number (check existing handover.md)
3. Generate handover.md content using template
4. Write file to [spec_path]/handover.md

RETURN (JSON format):
{
  "status": "OK" | "FAIL",
  "file_path": "[full path to handover.md]",
  "attempt_number": [N],
  "last_action": "[extracted from context]",
  "next_action": "[extracted from context]",
  "error": "[if FAIL, error message]"
}

Tools available: Read, Write, Bash, Glob
```

### Phase 2: Update save.md

**Goal**: Add sub-agent delegation with fallback

**Changes**:
1. Add `Task` to allowed-tools (add it)
2. Add new Section: SUB-AGENT DELEGATION
3. Move Steps 2-5 (Context Analysis through File Generation) to sub-agent
4. Keep Step 1 (Folder Detection) in main agent (already validated in phases)
5. Keep Step 6 (Report) in main agent
6. Add fallback logic

**Sub-Agent Prompt Template**:
```markdown
Execute memory save workflow for spec folder: [target_folder]

INPUTS:
- target_folder: [validated folder path]
- alignment_validated: [YES/WARNED_CONFIRMED]

TASKS:
1. Analyze current conversation context:
   - Extract session summary (2-4 sentences)
   - Extract key decisions with rationale
   - List files modified
   - Generate trigger phrases (5-10)
   - Capture technical context
2. Generate proper ANCHOR tags for sections
3. Build JSON data structure
4. Execute: node .opencode/skill/system-spec-kit/scripts/generate-context.js [json-file-path]
5. Report results

RETURN (JSON format):
{
  "status": "OK" | "FAIL",
  "file_path": "[full path to memory file]",
  "memory_id": [ID if indexed],
  "anchors_created": ["anchor1", "anchor2"],
  "trigger_phrases": ["phrase1", "phrase2"],
  "error": "[if FAIL, error message]"
}

Tools available: Read, Bash, Glob, Write (for temp JSON only)
```

### Phase 3: Test Both Commands

**Test Cases**:
1. `/spec_kit:handover` with valid spec folder → sub-agent creates handover.md
2. `/spec_kit:handover` with Task unavailable → fallback creates handover.md
3. `/memory:save 005-memory` → sub-agent executes workflow
4. `/memory:save` with Task unavailable → fallback executes workflow
<!-- /ANCHOR:phases -->

---

## 3. FILE CHANGES

| File | Change Type | Description |
|------|-------------|-------------|
| `.opencode/command/spec_kit/handover.md` | Modify | Add sub-agent delegation section, update workflow |
| `.opencode/command/memory/save.md` | Modify | Add Task to tools, add delegation section, update workflow |

---

<!-- ANCHOR:rollback -->
## 4. FALLBACK DESIGN

### Fallback Trigger Conditions
```
FALLBACK triggers if:
├── Task tool not in allowed-tools list (checked at command load)
├── Task tool call returns error
├── Task tool call times out
└── Sub-agent returns status: FAIL
```

### Fallback Behavior
```
WHEN fallback triggers:
├── Log: "Sub-agent delegation failed, executing directly"
├── Execute workflow steps directly (current behavior)
└── Continue to display step normally
```

### Implementation Pattern
```markdown
## Sub-Agent Delegation

**Primary Path (Task Available):**
```
dispatch_subagent:
  tool: Task
  subagent_type: general
  prompt: [constructed prompt with inputs]
  
  on_success:
    → Extract result JSON
    → Store: file_path, metadata
    → Proceed to Display step
  
  on_failure:
    → Log failure reason
    → GOTO: fallback_execution
```

**Fallback Path (Task Unavailable):**
```
fallback_execution:
  → Execute Steps 1-3 directly (handover) OR Steps 2-5 directly (save)
  → Proceed to Display step
```
```
<!-- /ANCHOR:rollback -->

---

## 5. SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Command functionality | 100% preserved | Manual test |
| Fallback works | YES | Test without Task |
| Sub-agent completes | YES | Test with Task |
| Output format unchanged | YES | Compare outputs |

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Checklist**: See `checklist.md`
