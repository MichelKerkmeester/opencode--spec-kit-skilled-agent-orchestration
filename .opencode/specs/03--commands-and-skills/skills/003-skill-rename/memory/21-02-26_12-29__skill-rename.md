---
title: "To promote a memory to constitutional tier (always surfaced) [002-skill-rename/21-02-26_12-29__skill-rename]"
importance_tier: "critical"
contextType: "general"
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
<!-- Constitutional Tier Promotion:
  To promote a memory to constitutional tier (always surfaced):
  
  1. Via MCP tool after indexing:
     memory_update({ id: <memory_id>, importanceTier: 'constitutional' })
  
  2. Criteria for constitutional:
     - Applies to ALL future conversations (not project-specific)
     - Core constraints/rules that should NEVER be forgotten
     - ~2000 token budget total for constitutional tier
     
  3. Add trigger phrases for proactive surfacing:
     memory_update({ 
       id: <memory_id>, 
       importanceTier: 'constitutional',
       triggerPhrases: ['fix', 'implement', 'create', 'modify', ...]
     })
     
  4. Examples of constitutional content:
     - "Always ask Gate 3 spec folder question before file modifications"
     - "Never modify production data directly"
     - "Memory files MUST use generate-context.js script"
-->

---

# SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-02-21 |
| Session ID | session-1771673396066-rngu9wlsj |
| Spec Folder | 03--commands-and-skills/002-skill-rename |
| Channel | main |
| Importance Tier | critical |
| Context Type | general |
| Total Messages | 4 |
| Tool Executions | 0 |
| Decisions Made | 0 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-21 |
| Created At (Epoch) | 1771673396 |
| Last Accessed (Epoch) | 1771673396 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | /100 |  |
| Uncertainty Score | /100 |  |
| Context Score | /100 |  |
| Timestamp |  | Session start |

**Initial Gaps Identified:**

- No significant gaps identified at session start

**Dual-Threshold Status at Start:**
- Confidence: %
- Uncertainty: 
- Readiness: 
<!-- /ANCHOR:preflight -->

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
- [IMPLEMENTATION GUIDE](#implementation-guide)
- [OVERVIEW](#overview)
- [DETAILED CHANGES](#detailed-changes)
- [DECISIONS](#decisions)
- [CONVERSATION](#conversation)
- [RECOVERY HINTS](#recovery-hints)
- [MEMORY METADATA](#memory-metadata)

---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | BLOCKED |
| Completion % | 10% |
| Last Activity | 2026-02-20T11:27:19.723Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Tool: edit, Tool: bash, Tool: bash

**Summary:** Based on an analysis of the `036-skill-graphs` implementation and its associated scripts, the Skill Graph system and its memory integration consist of an elegant, entirely in-memory graph database (SG...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 03--commands-and-skills/002-skill-rename
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 03--commands-and-skills/002-skill-rename
Last: Tool: bash
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/.../handlers/sgqs-query.ts, .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts, .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts

- Last: Here is a review of the work completed according to the `implementation-summary.

<!-- /ANCHOR:continue-session -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts |
| Last Action | Tool: bash |
| Next Action | Continue implementation |
| Blockers | opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate. |

**Key Topics:** `skill` | `memory` | `skill graph` | `commands and skills/038 skill rename` | `graph` | `commands` | `skills/038` | `rename` | `sgqs` | `analysis` | `its` | `scripts` | 

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Here is a review of the work completed according to the `implementation-summary.** - Here is a review of the work completed according to the `implementation-summary.

- **Based on an analysis of the `036-skill-graphs` implementation and its associated** - Based on an analysis of the 036-skill-graphs implementation and its associated scripts, the Skill Graph system and its memory integration consist of an elegant, entirely in-memory graph database (SGQS) that enriches the existing semantic memory pipeline without requiring external infrastructure like Neo4j.

- **Tool: write** - .opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts

- **Tool: edit** - .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts

- **Tool: read** - .opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts

**Key Files and Their Roles**:

- `.opencode/.../handlers/sgqs-query.ts` - .opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-...

- `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts` - Entry point / exports

- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` - .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts

- `.opencode/.../tools/causal-tools.ts` - .opencode/skill/system-spec-kit/mcp_server/tools/causal-t...

- `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts` - Type definitions

- `.opencode/.../tests/prediction-error-gate.vitest.ts` - .opencode/skill/system-spec-kit/mcp_server/tests/predicti...

- `.opencode/.../architecture/layer-definitions.ts` - Edited via edit tool

- `.opencode/.../tests/layer-definitions.vitest.ts` - Edited via edit tool

**How to Extend**:

- Add new modules following the existing file structure patterns

- Create corresponding test files for new implementations

- Maintain consistent error handling approach

**Common Patterns**:

- **Filter Pipeline**: Chain filters for data transformation

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Based on an analysis of the `036-skill-graphs` implementation and its associated scripts, the Skill Graph system and its memory integration consist of an elegant, entirely in-memory graph database (SGQS) that enriches the existing semantic memory pipeline without requiring external infrastructure like Neo4j.

Here is an analysis of how the scripts and the Memory MCP integration work:

### 1. The Skill Graph Query System (SGQS)
The core of the skill graph relies on an in-memory engine (SGQS - Ski

**Key Outcomes**:
- Here is a review of the work completed according to the `implementation-summary.
- Based on an analysis of the `036-skill-graphs` implementation and its associated
- Tool: grep
- Tool: glob
- Tool: read
- Tool: read
- Tool: read
- Tool: read
- Tool: read
- Tool: write

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/.../handlers/sgqs-query.ts` | Updated sgqs query |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts` | .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Updated tool schemas |
| `.opencode/.../tools/causal-tools.ts` | Updated causal tools |
| `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts` | Edited via edit tool |
| `.opencode/.../tests/prediction-error-gate.vitest.ts` | Updated prediction error gate.vitest |
| `.opencode/.../architecture/layer-definitions.ts` | Updated layer definitions |
| `.opencode/.../tests/layer-definitions.vitest.ts` | Updated layer definitions.vitest |
| `.opencode/.../tests/context-server.vitest.ts` | Updated context server.vitest |
| `.opencode/.../tests/mcp-tool-dispatch.vitest.ts` | Updated mcp tool dispatch.vitest |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:graph-context -->
## Skill Graph Context

Nodes: 435 | Edges: 655 | Skills: 10

**Skill breakdown:**
- mcp-chrome-devtools: 19 nodes
- mcp-code-mode: 19 nodes
- mcp-figma: 16 nodes
- sk-code--full-stack: 62 nodes
- sk-code--opencode: 35 nodes
- sk-code--web: 44 nodes
- sk-doc: 36 nodes
- sk-git: 21 nodes
- sk-doc-visual: 18 nodes
- system-spec-kit: 165 nodes

**Node types:** :Asset(51), :Document(136), :Entrypoint(10), :Index(10), :Node(83), :Reference(135), :Skill(10)

<!-- /ANCHOR:graph-context -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-here-review-work-completed-85dabecc -->
### FEATURE: Here is a review of the work completed according to the `implementation-summary.

Here is a review of the work completed according to the `implementation-summary.md` for the `036-skill-graphs` spec:

### Overview
The `036-skill-graphs` migration is **100% complete** (9/9 tasks done). The project successfully migrated all 9 skills to a new composable graph architecture while establishing the SGQS (Skill Graph Query System) specifications and parser/executor implementations.

### 1. Skill Graph Migration (9/9 Skills Complete)
A total of **72 nodes** were created across all 9 sk

<!-- /ANCHOR:implementation-here-review-work-completed-85dabecc -->

<!-- ANCHOR:implementation-based-analysis-036skillgraphs-implementation-c1cc9794 -->
### FEATURE: Based on an analysis of the `036-skill-graphs` implementation and its associated

Based on an analysis of the `036-skill-graphs` implementation and its associated scripts, the Skill Graph system and its memory integration consist of an elegant, entirely in-memory graph database (SGQS) that enriches the existing semantic memory pipeline without requiring external infrastructure like Neo4j.

Here is an analysis of how the scripts and the Memory MCP integration work:

### 1. The Skill Graph Query System (SGQS)
The core of the skill graph relies on an in-memory engine (SGQS - Ski

<!-- /ANCHOR:implementation-based-analysis-036skillgraphs-implementation-c1cc9794 -->

<!-- ANCHOR:implementation-tool-grep-fd61a7d8 -->
### OBSERVATION: Tool: grep

SPECKIT_

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts
**Details:** Tool: grep | Status: completed
<!-- /ANCHOR:implementation-tool-grep-fd61a7d8 -->

<!-- ANCHOR:implementation-tool-glob-33b0b4d4 -->
### OBSERVATION: Tool: glob

.opencode/skill/system-spec-kit/mcp_server

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server
**Details:** Tool: glob | Status: completed
<!-- /ANCHOR:implementation-tool-glob-33b0b4d4 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/context-server.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-2 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts (repeated 2 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-2 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-3 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/tools/index.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-3 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-4 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts (repeated 3 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-4 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-5 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/scripts/sgqs/index.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/sgqs/index.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-5 -->

<!-- ANCHOR:implementation-tool-write-1b98a179 -->
### IMPLEMENTATION: Tool: write

.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts
**Details:** Tool: write | Status: completed
<!-- /ANCHOR:implementation-tool-write-1b98a179 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-6 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-6 -->

<!-- ANCHOR:implementation-tool-edit-1bede965 -->
### IMPLEMENTATION: Tool: edit

.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts (repeated 3 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
**Details:** Tool: edit | Status: completed
<!-- /ANCHOR:implementation-tool-edit-1bede965 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-2 -->
### IMPLEMENTATION: Tool: edit

.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts (repeated 2 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
**Details:** Tool: edit | Status: completed
<!-- /ANCHOR:implementation-tool-edit-1bede965-2 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-3 -->
### IMPLEMENTATION: Tool: edit

.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts (repeated 4 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts
**Details:** Tool: edit | Status: completed
<!-- /ANCHOR:implementation-tool-edit-1bede965-3 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-4 -->
### IMPLEMENTATION: Tool: edit

Executed edit (repeated 2 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts
**Details:** Tool: edit | Status: error | Status: completed
<!-- /ANCHOR:implementation-tool-edit-1bede965-4 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-7 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/tools/types.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-7 -->

<!-- ANCHOR:implementation-tool-bash-4f64ae8b -->
### OBSERVATION: Tool: bash

Build the mcp server to test compilation (repeated 9 times)

**Details:** Tool: bash | Status: completed
<!-- /ANCHOR:implementation-tool-bash-4f64ae8b -->

<!-- ANCHOR:integration-tool-read-dd69daf5 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/package.json

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/package.json
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:integration-tool-read-dd69daf5 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-8 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-8 -->

<!-- ANCHOR:implementation-tool-grep-fd61a7d8-2 -->
### OBSERVATION: Tool: grep

from '\.\./\.\./scripts (repeated 2 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server
**Details:** Tool: grep | Status: completed
<!-- /ANCHOR:implementation-tool-grep-fd61a7d8-2 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-9 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/core/index.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/index.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-9 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-5 -->
### IMPLEMENTATION: Tool: edit

.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts (repeated 3 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts
**Details:** Tool: edit | Status: completed
<!-- /ANCHOR:implementation-tool-edit-1bede965-5 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-10 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/shared/types.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/types.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-10 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-11 -->
### BUGFIX: Tool: read

.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-11 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-6 -->
### IMPLEMENTATION: Tool: edit

.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts
**Details:** Tool: edit | Status: completed
<!-- /ANCHOR:implementation-tool-edit-1bede965-6 -->

<!-- ANCHOR:implementation-tool-grep-fd61a7d8-3 -->
### OBSERVATION: Tool: grep

memory_causal_unlink

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
**Details:** Tool: grep | Status: completed
<!-- /ANCHOR:implementation-tool-grep-fd61a7d8-3 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-7 -->
### IMPLEMENTATION: Tool: edit

Executed edit (repeated 2 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
**Details:** Tool: edit | Status: error | Status: completed
<!-- /ANCHOR:implementation-tool-edit-1bede965-7 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-12 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-12 -->

<!-- ANCHOR:implementation-tool-grep-fd61a7d8-4 -->
### OBSERVATION: Tool: grep

memory_causal_unlink (repeated 2 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests
**Details:** Tool: grep | Status: completed
<!-- /ANCHOR:implementation-tool-grep-fd61a7d8-4 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-8 -->
### IMPLEMENTATION: Tool: edit

Executed edit

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts
**Details:** Tool: edit | Status: error
<!-- /ANCHOR:implementation-tool-edit-1bede965-8 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-9 -->
### IMPLEMENTATION: Tool: edit

Executed edit (repeated 6 times)

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
**Details:** Tool: edit | Status: error | Status: completed
<!-- /ANCHOR:implementation-tool-edit-1bede965-9 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-10 -->
### IMPLEMENTATION: Tool: edit

Executed edit

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts
**Details:** Tool: edit | Status: error
<!-- /ANCHOR:implementation-tool-edit-1bede965-10 -->

<!-- ANCHOR:implementation-tool-edit-1bede965-11 -->
### IMPLEMENTATION: Tool: edit

Executed edit

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts
**Details:** Tool: edit | Status: error
<!-- /ANCHOR:implementation-tool-edit-1bede965-11 -->

<!-- ANCHOR:implementation-tool-read-dd69daf5-13 -->
### OBSERVATION: Tool: read

.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts

**Files:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
**Details:** Tool: read | Status: completed
<!-- /ANCHOR:implementation-tool-read-dd69daf5-13 -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number depends on which optional sections are present:
  - Base: 2 (after Overview)
  - +1 if HAS_IMPLEMENTATION_GUIDE (adds section 1)
  - +1 if HAS_OBSERVATIONS (adds Detailed Changes)
  - +1 if HAS_WORKFLOW_DIAGRAM (adds Workflow Visualization)
  
  Result matrix:
  | IMPL_GUIDE | OBSERVATIONS | WORKFLOW | This Section # |
  |------------|--------------|----------|----------------|
  | No         | No           | No       | 2              |
  | No         | No           | Yes      | 3              |
  | No         | Yes          | No       | 3              |
  | No         | Yes          | Yes      | 4              |
  | Yes        | No           | No       | 3              |
  | Yes        | No           | Yes      | 4              |
  | Yes        | Yes          | No       | 4              |
  | Yes        | Yes          | Yes      | 5              |
-->
## 4. DECISIONS

decision_count: 0

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number = DECISIONS section + 1
  See DECISIONS section comment for the full matrix.
  Range: 3-6 depending on optional sections present.
-->
## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** distinct phases.

##### Conversation Phases
- **Discussion** - 2 actions
- **Research** - 24 actions
- **Implementation** - 36 actions

---

### Message Timeline

> **User** | 2026-02-20 @ 12:26:36

User initiated conversation

---

> **Assistant** | 2026-02-20 @ 12:26:36

User initiated conversation → Here is a review of the work completed according to the `implementation-summary. md` for the `036-skill-graphs` spec:

### Overview
The `036-skill-graphs` migration is **100% complete** (9/9 tasks done).

---

> **Assistant** | 2026-02-20 @ 12:26:36

User initiated conversation → Here is a review of the work completed according to the `implementation-summary. md` for the `036-skill-graphs` spec:

### Overview
The `036-skill-graphs` migration is **100% complete** (9/9 tasks done).

---

> **User** | 2026-02-20 @ 12:27:19

User initiated conversation

---

<!-- /ANCHOR:session-history -->

---

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 03--commands-and-skills/002-skill-rename` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "03--commands-and-skills/002-skill-rename" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "03--commands-and-skills/002-skill-rename", limit: 10 })

# Verify memory file integrity
ls -la 03--commands-and-skills/002-skill-rename/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 03--commands-and-skills/002-skill-rename --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

### Session Integrity Checks

| Check | Status | Details |
|-------|--------|---------|
| Memory File Exists |  |  |
| Index Entry Valid |  | Last indexed:  |
| Checksums Match |  |  |
| No Dedup Conflicts |  |  |
<!-- /ANCHOR:recovery-hints -->

---

<!-- ANCHOR:postflight -->
<a id="postflight-learning-delta"></a>

## POSTFLIGHT LEARNING DELTA

**Epistemic state comparison showing knowledge gained during session.**

<!-- Delta Calculation Formulas:
  DELTA_KNOW_SCORE = POSTFLIGHT_KNOW_SCORE - PREFLIGHT_KNOW_SCORE (positive = improvement)
  DELTA_UNCERTAINTY_SCORE = PREFLIGHT_UNCERTAINTY_SCORE - POSTFLIGHT_UNCERTAINTY_SCORE (positive = reduction, which is good)
  DELTA_CONTEXT_SCORE = POSTFLIGHT_CONTEXT_SCORE - PREFLIGHT_CONTEXT_SCORE (positive = improvement)
  DELTA_*_TREND = "↑" if delta > 0, "↓" if delta < 0, "→" if delta == 0
-->

| Metric | Before | After | Delta | Trend |
|--------|--------|-------|-------|-------|
| Knowledge |  |  |  | → |
| Uncertainty |  |  |  | → |
| Context |  |  |  | → |

**Learning Index:** /100

> Learning Index = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
> Higher is better. Target: ≥25 for productive sessions.

**Gaps Closed:**

- No gaps explicitly closed during session

**New Gaps Discovered:**

- No new gaps discovered

**Session Learning Summary:**
Learning metrics will be calculated when both preflight and postflight data are provided.
<!-- /ANCHOR:postflight -->

---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1771673396066-rngu9wlsj"
spec_folder: "03--commands-and-skills/002-skill-rename"
channel: "main"

# Classification
importance_tier: "critical"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "general"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: ""         # episodic|procedural|semantic|constitutional
  half_life_days:      # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate:            # 0.0-1.0, daily decay multiplier
    access_boost_factor:    # boost per access (default 0.1)
    recency_weight:              # weight for recent accesses (default 0.5)
    importance_multiplier:  # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced:    # count of memories shown this session
  dedup_savings_tokens:    # tokens saved via deduplication
  fingerprint_hash: ""         # content hash for dedup detection
  similar_memories:

    []

# Causal Links (v2.2)
causal_links:
  caused_by:

    []

  supersedes:

    []

  derived_from:

    []

  blocks:

    []

  related_to:

    []

# Timestamps (for decay calculations)
created_at: "2026-02-21"
created_at_epoch: 1771673396
last_accessed_epoch: 1771673396
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 4
decision_count: 0
tool_count: 0
file_count: 10
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "skill"
  - "memory"
  - "skill graph"
  - "commands and skills/038 skill rename"
  - "graph"
  - "commands"
  - "skills/038"
  - "rename"
  - "sgqs"
  - "analysis"
  - "its"
  - "scripts"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "commands and skills/038 skill rename"
  - "skill graphs"
  - "in memory"
  - "system spec kit"
  - "context server"
  - "based analysis implementation associated"
  - "analysis implementation associated scripts"
  - "implementation associated scripts skill"
  - "associated scripts skill graph"
  - "scripts skill graph system"
  - "skill graph system memory"
  - "graph system memory integration"
  - "system memory integration consist"
  - "memory integration consist elegant"
  - "integration consist elegant entirely"
  - "consist elegant entirely in-memory"
  - "elegant entirely in-memory graph"
  - "entirely in-memory graph database"
  - "in-memory graph database sgqs"
  - "graph database sgqs enriches"
  - "database sgqs enriches existing"
  - "sgqs enriches existing semantic"
  - "enriches existing semantic memory"
  - "existing semantic memory pipeline"
  - "semantic memory pipeline without"
  - "memory pipeline without requiring"
  - "commands"
  - "and"
  - "skills/038"
  - "skill"
  - "rename"
  - "mcp-chrome-devtools"
  - "mcp"
  - "chrome"
  - "devtools"
  - "install_guide"
  - "chrome devtools installation guide"
  - "document"
  - "readme"
  - "chrome devtools orchestrator with intelligent routing between cli (bdg) and mcp (code mode) approaches."
  - "chrome devtools orchestrator - cli + mcp integration"
  - "chrome devtools orchestrator providing intelligent routing between cli (bdg) and mcp (code mode) approaches. cli prioritized for speed and token efficiency; mcp fallback for multi-tool integration scenarios."
  - "entrypoint"
  - "cli chrome devtools - example scripts"
  - "production-ready bash scripts for browser debugging, testing and automation using browser-debugger-cli (bdg)"
  - "chrome devtools orchestrator"
  - "index"
  - "cli-approach"
  - "cli approach"
  - "cli (bdg) approach for browser debugging: installation, discovery, network inspection, har export, session management, and commands"
  - "node"
  - "how-it-works"
  - "how it works"
  - "core architecture overview comparing cli, mcp, and framework approaches for chrome devtools"
  - "integration-points"
  - "integration points"
  - "framework integration, related skills, tool usage guidelines, and external tool dependencies"
  - "mcp-approach"
  - "mcp approach"
  - "mcp (code mode) approach for chrome devtools: configuration, isolated instances, tool invocation, and session cleanup"
  - "quick-reference"
  - "quick reference"
  - "cheat sheet of essential cli commands, network inspection, mcp tool patterns, and error handling templates"
  - "routing-decision"
  - "routing decision"
  - "decision logic for selecting between cli (bdg) and mcp (code mode) approaches"
  - "rules"
  - "mandatory always, never, and escalate rules for chrome devtools operations"
  - "smart-routing"
  - "smart routing"
  - "smart routing logic for resource loading: intent scoring, loading levels, and routing pseudocode"
  - "success-criteria"
  - "success criteria"
  - "completion checklist and quality targets for chrome devtools workflows"
  - "when-to-use"
  - "when to use"
  - "activation triggers, use cases including performance audit, and exclusion criteria for the chrome devtools orchestrator skill"
  - "cdp_patterns"
  - "cdp patterns & command examples"
  - "chrome devtools protocol patterns, workflows, and unix composability examples for bdg."
  - "reference"
  - "session_management"
  - "advanced session management"
  - "patterns for browser session lifecycle, concurrency, resumption, and state persistence with bdg."
  - "troubleshooting"
  - "troubleshooting guide"
  - "error resolution guide for common bdg issues with diagnostic steps and solutions."
  - "mcp-code-mode"
  - "code"
  - "mode"
  - "mcp code mode installation guide"
  - "code mode mcp - typescript tool execution"
  - "mcp orchestration via typescript execution for efficient multi-tool workflows with 98.7% context reduction and 60% faster execution."
  - "mcp code mode"
  - "mcp orchestration via typescript execution for efficient multi-tool workflows. use code mode for all mcp tool calls (clickup, notion, figma, webflow, chrome devtools, etc.). provides 98.7% context reduction, 60% faster execution, and type-safe invocation. mandatory for external tool integration."
  - "config_template"
  - "configuration template"
  - "complete .utcp_config.json template for code mode utcp setup with multiple mcp servers."
  - "asset"
  - "env_template"
  - "environment variables template"
  - "complete .env file template with placeholders for all mcp server credentials and api tokens."
  - "mcp code mode orchestrator"
  - "the architecture of the utcp typescript execution environment including tool chain routing and handler dispatch."
  - "project-configuration"
  - "project configuration"
  - "how to configure .utcp_config.json for external mcp tools."
  - "code snippets, tool chain patterns, and templates for code mode invocations."
  - "code mode rules"
  - "mandatory rules (always, never) for writing code mode scripts."
  - "definition of done for a successful code mode invocation."
  - "when to use code mode"
  - "when to trigger code mode for external api access and when to use native mcp instead."
  - "architecture"
  - "system architecture - code mode utcp"
  - "architecture, data flow, and execution environment for code mode utcp."
  - "configuration"
  - "configuration guide - .utcp_config.json and environment setup"
  - "configure mcp servers, environment variables, and credentials for code mode utcp."
  - "naming_convention"
  - "tool naming convention - complete guide"
  - "critical naming pattern for mcp tool calls with troubleshooting guide."
  - "tool_catalog"
  - "tool catalog - complete list of available mcp tools"
  - "reference catalog of 170+ tools across 7 mcp servers."
  - "workflows"
  - "workflow examples - complex multi-tool patterns"
  - "five workflow patterns for multi-tool orchestration, error handling, and state persistence."
  - "mcp-figma"
  - "figma"
  - "figma mcp installation guide"
  - "figma mcp"
  - "programmatic access to figma design files through 18 specialized tools via code mode for token-efficient workflows."
  - "figma mcp - design file access"
  - "figma design file access via mcp providing 18 tools for file retrieval, image export, component/style extraction, team management, and collaborative commenting. accessed via code mode for token-efficient workflows."
  - "tool_categories"
  - "tool categories - priority classification"
  - "categorization of all 18 figma mcp tools with priority levels for efficient usage."
  - "core workflow for invoking figma tools via code mode, including naming conventions and examples."
  - "prerequisites, code mode dependency, configuration, design export workflows, and cross-tool workflow patterns."
  - "essential commands, common patterns, and troubleshooting for figma mcp tools."
  - "related-resources"
  - "related resources"
  - "reference documents, assets, external links, and related skills for figma mcp."
  - "mandatory always, never, and escalate rules for using figma mcp tools."
  - "intent-based resource routing logic for loading figma skill references on demand."
  - "completion gates and validation checkpoints for figma mcp operations."
  - "activation triggers, use cases, and when not to use the figma mcp skill."
  - "quick_start"
  - "quick start - figma mcp"
  - "get started with figma mcp in 5 minutes covering prerequisites, verification, and first commands."
  - "tool_reference"
  - "figma tool reference - complete guide"
  - "complete documentation for all 18 figma mcp tools, organized by category with priority levels and usage guidance."
  - "sk-code--full-stack"
  - "full"
  - "stack"
  - "changelog"
  - "stack-agnostic development orchestrator guiding developers through implementation, debugging, and verification phases with automatic stack detection via marker files"
  - "code workflows - stack-agnostic development orchestrator"
  - "stack-agnostic development orchestrator guiding developers through implementation, testing, and verification phases with automatic stack detection via marker files and bundled stack-specific knowledge."
  - "code_quality_checklist"
  - "code quality checklist"
  - "universal validation checklist for code quality and style compliance across all stacks."
  - "debugging_checklist"
  - "systematic debugging checklist"
  - "universal step-by-step checklist for investigating technical issues across all stacks."
  - "verification_checklist"
  - "verification checklist"
  - "universal checklist for verifying work before claiming completion across all stacks."
  - "core development lifecycle: implementation, testing/debugging, and verification phases"
  - "knowledge base structure, naming conventions, tool usage, external resources, and related skills"
  - "always/never/escalate rules for implementation, testing/debugging, and verification phases"
  - "stack detection via marker files, intent classification, resource routing, and load-level selection"
  - "completion gates, quality checks, and quick reference for all three development phases"
  - "activation triggers, use cases, phase overview, and when not to use this skill"
  - "api_design"
  - "api design guidelines - http controllers and endpoint patterns"
  - "standards for designing http controllers and endpoints in backend systems, covering fiber/gofiber implementation patterns, request/response handling, authentication, and authorization."
  - "database_patterns"
  - "database patterns - gorm repository and transaction patterns"
  - "guidelines for working with databases in backend systems, covering the generic repository pattern, transaction management, entity definitions, and query patterns using gorm."
  - "database_patterns_gorm_type_mappings"
  - "gorm type mappings & database types"
  - "critical reference for go-to-postgresql type mappings in gorm entities, database migrations, and type safety for postgresql."
  - "deployment"
  - "deployment guide - ci/cd workflows and deployment patterns"
  - "ci/cd workflows, versioning strategy, and deployment patterns for backend systems using github actions, ecr/s3 artifacts, and gitops deployment."
  - "di_configuration"
  - "dependency injection configuration - di system patterns and debugging"
  - "di configuration structure, json nesting rules, token-to-key mapping, and debugging configuration errors in backend systems."
  - "domain_layers"
  - "domain layers architecture - generic service pattern and transaction management"
  - "understanding the layered architecture pattern used across all domains in backend systems, focusing on the generic service pattern, transaction management, and entity-to-model boundaries."
  - "go_standards"
  - "go code standards - backend system coding conventions"
  - "mandatory go coding conventions for backend projects defining project structure, naming conventions, layered architecture patterns, and code organization standards."
  - "infrastructure_events"
  - "infrastructure events - event system architecture"
  - "event system architecture, sqs producers/consumers, message packs, and event routing for asynchronous communication between microservices via aws sqs."
  - "microservice_bootstrap_architecture"
  - "microservice bootstrap architecture - di-driven bootstrap and registry system"
  - "modern microservice bootstrap pattern, registry hierarchy, configuration-di mapping, and old-to-new migration patterns for backend systems."
  - "models_vs_entities_and_adapters"
  - "models vs entities - adapter boundary architecture"
  - "defines the architectural boundary between database entities and business models, establishing where adapter patterns must be used to convert internal data structures to external api contracts."
  - "testing_strategy"
  - "testing strategy - go testing patterns for backend systems"
  - "go testing patterns, test types, mocking, and best practices for backend systems including unit tests, integration tests, table-driven tests, and e2e infrastructure."
  - "validator_registration"
  - "validator registration - enum and custom validation patterns"
  - "how to register validators for enum types and custom validation rules across microservices and lambdas in backend systems."
  - "async_patterns"
  - "async patterns - promise and async/await best practices"
  - "mandatory async/await patterns for node.js backend projects defining promise handling, error management, concurrent operations, streams, and event emitter patterns."
  - "express_patterns"
  - "express patterns - route organization and middleware design"
  - "mandatory express.js patterns for backend projects defining route organization, middleware design, request validation, response formatting, error handling, and authentication patterns."
  - "nodejs_standards"
  - "node.js code standards - backend system coding conventions"
  - "mandatory node.js/typescript coding conventions for backend projects defining project structure, configuration, logging, error handling, and code organization standards."
  - "testing strategy - jest configuration and test patterns"
  - "mandatory testing patterns for node.js backend projects defining jest configuration, unit testing, integration testing with supertest, mocking strategies, database testing, and ci/cd integration."
  - "api_patterns"
  - "api patterns"
  - "next.js route handlers, trpc integration, api design patterns, error responses, authentication patterns, and api middleware."
  - "component_architecture"
  - "component architecture"
  - "server components vs client components, composition patterns, props handling, compound components, render props, and component organization patterns for react 19 and next.js 14+."
  - "data_fetching"
  - "data fetching"
  - "react query / tanstack query patterns, swr patterns, next.js server actions, error handling, loading states, optimistic updates, and cache invalidation strategies."
  - "forms_validation"
  - "forms & validation"
  - "react hook form setup, zod schema validation, form state management, error display patterns, multi-step forms, and file upload handling."
  - "react_nextjs_standards"
  - "react/next.js standards"
  - "next.js 14+ app router conventions, typescript configuration, file naming patterns, directory organization, and environment configuration for production applications."
  - "state_management"
  - "state management"
  - "react context patterns, zustand setup, jotai atomic state, redux toolkit integration, server vs client state separation, and form state management patterns."
  - "testing strategy"
  - "react testing library patterns, jest configuration, playwright e2e tests, msw for api mocking, component testing patterns, and integration test strategies."
  - "expo-patterns"
  - "expo patterns"
  - "a practical guide to working with expo in a react native codebase, explaining what patterns exist, why they exist, and how to use them day-to-day."
  - "mobile_testing"
  - "mobile testing"
  - "testing recommendations, framework setup, and patterns for react native/expo projects."
  - "native-modules"
  - "native modules"
  - "a practical guide to the native integrations in a react native/expo app, explaining how to use each integration, common setup issues, and troubleshooting."
  - "navigation-patterns"
  - "navigation patterns"
  - "a practical guide to navigation in a react native/expo app, explaining how to add screens, navigate between them, and avoid common pitfalls."
  - "performance-optimization"
  - "performance optimization"
  - "a practical guide to keeping a react native/expo app fast and responsive, explaining when to optimize, how to profile issues, and what patterns actually matter."
  - "react-hooks-patterns"
  - "react hooks patterns"
  - "a practical guide to creating and using custom hooks in a react native/expo codebase, explaining when to use each pattern, common mistakes to avoid, and how to create your first hook."
  - "react-native-standards"
  - "react native standards"
  - "a practical guide to building components in a react native/expo codebase, explaining how to create components, why we use certain patterns, and what mistakes to avoid."
  - "async patterns"
  - "a comprehensive guide to swift concurrency including async/await, task and taskgroup, actor isolation, structured concurrency, asyncsequence, error handling, and combine integration for modern ios development."
  - "mvvm_architecture"
  - "mvvm architecture"
  - "a comprehensive guide to implementing mvvm architecture with swiftui, including @observable patterns, viewmodel design, dependency injection, protocol-oriented design, and combine integration for ios 17+ applications."
  - "persistence_patterns"
  - "persistence patterns"
  - "a comprehensive guide to data persistence in ios including swiftdata for ios 17+, core data patterns for legacy code, userdefaults, keychain access, file system operations, and cloudkit integration basics."
  - "swift_standards"
  - "swift standards"
  - "a comprehensive guide to swift 5.9+ project structure, xcode organization, swift package manager, naming conventions, code organization patterns, and api design guidelines for ios development."
  - "swiftui_patterns"
  - "swiftui patterns"
  - "a comprehensive guide to swiftui view composition, state management, navigation patterns, custom modifiers, and modern ios 17+ swiftui features for building production-ready ios applications."
  - "a comprehensive guide to testing swift and swiftui applications including xctest fundamentals, unit testing viewmodels, ui testing with xcuitest, mocking and stubbing patterns, test doubles, and snapshot testing."
  - "sk-code--opencode"
  - "opencode"
  - "multi-language code standards for opencode system code (javascript, typescript, python, shell, json/jsonc) with language detection routing, universal patterns and quality checklists"
  - "code standards - opencode system code"
  - "multi-language code standards for opencode system code (javascript, typescript, python, shell, json/jsonc) with language detection routing, universal patterns, and quality checklists."
  - "config_checklist"
  - "config file quality checklist"
  - "quality validation checklist for json and jsonc configuration files in the opencode development environment."
  - "javascript_checklist"
  - "javascript code quality checklist"
  - "quality validation checklist for javascript code in the opencode development environment."
  - "python_checklist"
  - "python code quality checklist"
  - "quality validation checklist for python code in the opencode development environment."
  - "shell_checklist"
  - "shell code quality checklist"
  - "quality validation checklist for bash scripts in the opencode development environment."
  - "typescript_checklist"
  - "typescript code quality checklist"
  - "quality validation checklist for typescript code in the opencode development environment."
  - "universal_checklist"
  - "universal code quality checklist"
  - "language-agnostic quality checks that apply to all code files in the opencode development environment."
  - "core workflow steps, key pattern categories, and evidence-based pattern sources for opencode code standards"
  - "framework integration, skill differentiation table, and related resources for opencode code standards"
  - "language-detection"
  - "language detection"
  - "quick language identification table mapping file extensions and keywords to resource loading paths"
  - "file header templates, naming matrix, error handling patterns, and comment patterns for all supported languages"
  - "always/never/escalate rules for opencode system code across all supported languages"
  - "language detection router with weighted intent scoring, resource domains, and loading levels"
  - "quality gates, priority levels, and completion checklist for opencode code standards"
  - "activation triggers, keyword matching, and scope boundaries for the opencode code standards skill"
  - "quick_reference"
  - "config quick reference"
  - "fast lookup for json/jsonc configuration patterns and common structures in opencode."
  - "style_guide"
  - "config style guide"
  - "formatting standards and conventions for json and jsonc configuration files in the opencode development environment."
  - "quality_standards"
  - "javascript quality standards"
  - "module organization, error handling, documentation, and security patterns for javascript files."
  - "javascript quick reference"
  - "copy-paste templates, naming cheat sheet, and common patterns for javascript development."
  - "javascript style guide"
  - "formatting standards and naming conventions for javascript files in the opencode development environment."
  - "python quality standards"
  - "code quality requirements, validation rules, and best practices for python scripts in the opencode development environment."
  - "python quick reference"
  - "fast lookup for python coding patterns, naming conventions, and common structures in opencode."
  - "python style guide"
  - "coding conventions and formatting standards for python scripts in the opencode development environment."
  - "alignment_verification_automation"
  - "alignment verification automation"
  - "code_organization"
  - "code organization - file structure and module principles"
  - "file structure principles, module organization concepts, and import ordering standards for opencode system code."
  - "universal_patterns"
  - "universal patterns - cross-language code standards"
  - "patterns applicable to all languages in opencode system code including naming principles, commenting philosophy, and reference comment patterns."
  - "shell quality standards"
  - "code quality requirements, validation rules, and best practices for bash scripts in the opencode development environment."
  - "shell quick reference"
  - "fast lookup for bash scripting patterns, syntax, and common structures in opencode."
  - "shell style guide"
  - "coding conventions and formatting standards for bash scripts in the opencode development environment."
  - "typescript quality standards"
  - "type system patterns, error handling, documentation, async patterns, and tsconfig baseline for typescript files in the opencode development environment."
  - "typescript quick reference"
  - "copy-paste templates, naming cheat sheet, and common patterns for typescript development in opencode."
  - "typescript style guide"
  - "formatting standards and naming conventions for typescript files in the opencode development environment."
  - "sk-code--web"
  - "web"
  - "code workflows - web development orchestrator"
  - "orchestrator guiding developers through implementation, debugging, and verification phases for web development projects (webflow, vanilla js)"
  - "code workflows - development orchestrator"
  - "orchestrator guiding developers through implementation, debugging, and verification phases across specialized code quality skills (project)"
  - "validation checklist for javascript and css code quality and style compliance."
  - "step-by-step checklist for investigating frontend technical issues"
  - "browser verification checklist"
  - "checklist for verifying work in browser before claiming completion"
  - "debugging-workflow"
  - "debugging workflow"
  - "phase 2 systematic debugging framework with root cause tracing and error recovery"
  - "development lifecycle overview, phase transitions, and phase 0 research methodology"
  - "implementation-workflow"
  - "implementation workflow"
  - "phase 1 implementation patterns for css, layout, accessibility (aria), and event handler development with phase 1.5 code quality gate for frontend development"
  - "common commands, cdn version workflow, deployment steps, external documentation links, and related skills"
  - "always/never/escalate rules for all development phases: implementation, code quality, debugging, and verification"
  - "intent scoring, resource discovery, and smart loading logic for routing requests to the right resources"
  - "phase completion checklists, performance targets, and quality gates for all development phases"
  - "verification-workflow"
  - "verification workflow"
  - "phase 3 mandatory browser verification including layout inspection, accessibility audit, testing matrix, and completion gate"
  - "activation triggers, use cases including api integration, phase overview, and when not to use this skill"
  - "debugging_workflows"
  - "debugging workflows - phase 2"
  - "systematic debugging with four-phase investigation, root cause tracing, and performance profiling."
  - "error_recovery"
  - "error recovery workflows"
  - "recovery procedures for common deployment and build failures"
  - "cdn_deployment"
  - "cdn deployment guide"
  - "complete workflow for deploying minified javascript to cloudflare r2 cdn."
  - "minification_guide"
  - "javascript minification guide"
  - "safe minification workflow for webflow projects with verification to prevent breaking functionality."
  - "animation_workflows"
  - "animation workflows - phase 1 implementation"
  - "css-first animation guide with motion.dev integration for complex sequences and scroll-triggered effects."
  - "browser scheduling apis and patterns for non-blocking code execution."
  - "css_patterns"
  - "css patterns - webflow implementation reference"
  - "comprehensive css patterns for webflow development including state machines, validation architecture, accessibility, and design token systems."
  - "focus_management"
  - "focus management - accessibility patterns"
  - "focus trap implementation, focus restoration, and touch detection patterns for accessible modal dialogs."
  - "form_upload_workflows"
  - "form upload workflows"
  - "complete architecture reference for the filepond-to-r2 file upload pipeline, including cloudflare worker proxy, state management, and webflow integration."
  - "implementation_workflows"
  - "implementation workflows - phase 1"
  - "three specialized workflows for writing robust frontend code with proper timing, validation, and cache management."
  - "observer_patterns"
  - "observer patterns reference"
  - "browser observer apis for reactive dom watching, visibility detection, and scroll-triggered behaviors."
  - "performance_patterns"
  - "performance optimization patterns - phase 1 integration"
  - "performance optimization checklist covering animations, assets, requests, and core web vitals budgets."
  - "security_patterns"
  - "security patterns - owasp top 10 integration"
  - "security hardening patterns covering xss prevention, csrf protection, and input validation."
  - "swiper_patterns"
  - "swiper.js integration patterns"
  - "production-tested swiper.js configurations for carousels and marquees with intersectionobserver autoplay control, accessibility, and webflow integration."
  - "third_party_integrations"
  - "third-party library integrations"
  - "reference guide for integrating external javascript libraries in webflow projects, with production-tested patterns."
  - "webflow_patterns"
  - "webflow platform patterns - development guide"
  - "complete platform constraints and collection list patterns for webflow development."
  - "cwv_remediation"
  - "core web vitals remediation guide"
  - "actionable remediation patterns for lcp, fcp, tbt, and cls issues in webflow sites with custom javascript."
  - "resource_loading"
  - "resource loading patterns"
  - "resource hints and loading strategies for optimal performance in webflow sites."
  - "third_party"
  - "third-party performance optimization"
  - "deferral patterns for analytics, tag managers, and consent scripts to reduce main thread blocking."
  - "webflow_constraints"
  - "webflow performance constraints"
  - "platform-imposed limitations on performance optimization and available workarounds."
  - "multi_agent_patterns"
  - "multi-agent research patterns"
  - "10-agent specialization model for comprehensive codebase analysis and performance audits."
  - "code_quality_standards"
  - "code quality standards"
  - "quality patterns for initialization, error handling, validation, async operations, and performance"
  - "code_style_enforcement"
  - "code style enforcement"
  - "enforcement rules, validation prompts, and remediation instructions for code quality standards (javascript + css)"
  - "code_style_guide"
  - "code style guide"
  - "naming conventions, formatting, comments, and visual organization standards for frontend development"
  - "code workflows quick reference"
  - "quick-access cheat sheet with decision trees, code snippets, css patterns, and verification checklists."
  - "shared_patterns"
  - "shared patterns - cross-workflow standards"
  - "common patterns for devtools usage, logging, testing, error handling, and browser compatibility."
  - "performance_checklist"
  - "performance verification checklist"
  - "before/after verification protocol for performance optimization work using pagespeed insights."
  - "verification_workflows"
  - "verification workflows - phase 3 (mandatory)"
  - "browser verification requirements for all completion claims - no exceptions."
  - "sk-doc"
  - "documentation"
  - "workflows documentation"
  - "unified markdown and opencode component specialist providing document quality enforcement, content optimization, component creation workflows, ascii flowcharts and install guides"
  - "documentation creation specialist - unified markdown & component management"
  - "unified markdown and opencode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ascii flowcharts and install guides."
  - "frontmatter_templates"
  - "yaml frontmatter templates"
  - "templates and validation rules for yaml frontmatter across all document types in the opencode ecosystem."
  - "install_guide_template"
  - "install guide creation - templates and standards"
  - "templates for creating consistent, ai-friendly installation guides for mcp servers, plugins, cli tools, and development dependencies."
  - "llmstxt_templates"
  - "llms.txt templates"
  - "templates and patterns for creating effective llms.txt files that help ai assistants understand projects."
  - "readme_template"
  - "readme creation - templates and standards"
  - "templates for creating comprehensive, ai-optimized readme files with consistent structure and progressive disclosure."
  - "approval_workflow_loops"
  - "approval workflow with loops - multiple reviewers and revision cycles"
  - "decision_tree_flow"
  - "decision tree flow example - complex branching and conditional logic"
  - "parallel_execution"
  - "parallel execution example - simultaneous tasks with synchronization"
  - "simple_workflow"
  - "simple workflow example - linear sequential process"
  - "system_architecture_swimlane"
  - "system architecture flow (swimlane) - multi-tier system interaction"
  - "user_onboarding"
  - "user onboarding flow example - complete multi-step journey"
  - "agent_template"
  - "agent template - specialist agent structure"
  - "command_template"
  - "command template - opencode slash commands"
  - "templates and best practices for creating production-quality slash commands in opencode with proper frontmatter and structure."
  - "skill_asset_template"
  - "skill asset file templates"
  - "templates and guidelines for creating asset files in ai agent skills."
  - "skill_graph_index_template"
  - "skill graph index template"
  - "base template for writing the index.md entry point of a skill graph."
  - "skill_graph_node_template"
  - "skill graph node template"
  - "base template for writing one node in a skill graph."
  - "skill_md_template"
  - "skill.md file templates - creation guide"
  - "templates and guidelines for creating effective skill.md files for ai agent skills with complete scaffolds and section guidance."
  - "skill_reference_template"
  - "skill reference file templates"
  - "comprehensive templates for creating effective reference files for ai agent skills with workflows, decision logic, and validation checkpoints."
  - "documentation creation specialist"
  - "mode-component-creation"
  - "component creation mode"
  - "workflows for creating skills, agents, and commands in opencode."
  - "mode-document-quality"
  - "document quality mode"
  - "how the document quality index (dqi) pipeline uses extract_structure.py to evaluate readmes, specs, and knowledge docs."
  - "mode-flowchart-creation"
  - "flowchart creation mode"
  - "patterns and syntax for generating ascii flowcharts for workflows and decision trees."
  - "workflows documentation rules"
  - "mandatory rules (always, never, escalate) separated by modes (quality, skills, flowcharts, etc.)."
  - "intent scoring and resource loading logic for the documentation workflows."
  - "definition of document quality index (dqi), and checklists for completing documentation tasks."
  - "when to use workflows documentation"
  - "triggers for document validation, readme creation, component scaffolding, and flowchart generation."
  - "core_standards"
  - "core standards - structure and validation rules"
  - "filename conventions, document type detection, and structural validation rules for markdown documentation."
  - "hvr_rules"
  - "human voice rules (hvr) - writing standards reference"
  - "linguistic standards that eliminate detectable ai patterns and enforce natural human writing across all documentation."
  - "install_guide_standards"
  - "install guide standards - phase-based installation documentation"
  - "standards for clear, reliable install guides with phase-based validation checkpoints."
  - "optimization"
  - "optimization - transformation patterns for ai-friendly docs"
  - "16 proven patterns for converting documentation into ai-friendly question-answering format."
  - "markdown optimizer - quick reference"
  - "one-page cheat sheet for commands, quality gates, and transformation patterns."
  - "skill_creation"
  - "skill creation workflow"
  - "complete guide for creating, validating, and distributing ai agent skills with bundled resources."
  - "validation"
  - "validation - quality assessment and gates"
  - "quality gates, dqi scoring, and improvement recommendations for markdown documentation."
  - "document quality workflows - mode 1 reference"
  - "execution modes, validation patterns, and phase interactions for mode 1 document quality workflows."
  - "sk-git"
  - "git"
  - "git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills"
  - "git workflows - git development orchestrator"
  - "commit_message_template"
  - "commit message template"
  - "templates and examples for writing professional commit messages following conventional commits specification."
  - "pr_template"
  - "pull request template"
  - "templates and examples for creating professional pull requests with clear summaries and test plans."
  - "worktree_checklist"
  - "worktree creation checklist"
  - "step-by-step checklist for creating git worktrees safely and reliably."
  - "git workflows - skill graph"
  - "commit-workflow"
  - "commit workflow"
  - "commit creation process: staging, artifact filtering, and conventional commits formatting"
  - "github-integration"
  - "github integration"
  - "github mcp integration for remote operations: prs, issues, conflict resolution, ci/cd, and repository management"
  - "core git development lifecycle: workspace setup, commit, and integration phases"
  - "always/never/escalate rules governing git workflow behavior"
  - "intent routing logic with weighted scoring, resource loading levels, and disambiguation"
  - "completion gates and quality checks for workspace setup, commits, and integration"
  - "activation triggers, use cases, and when not to use the sk-git skill"
  - "work-completion"
  - "work completion"
  - "pr creation, conflict resolution, branch cleanup, merge strategies, deployment, and finish workflow"
  - "workspace-setup"
  - "workspace setup"
  - "git worktree setup, workspace choice enforcement, and branch management"
  - "commit_workflows"
  - "git commit - detailed workflow reference"
  - "complete workflow documentation for professional commit practices with conventional commits."
  - "finish_workflows"
  - "git finish - detailed workflow reference"
  - "complete workflow documentation for completing development work with structured integration options."
  - "git workflows - quick reference"
  - "one-page cheat sheet for git-worktrees, git-commit, and git-finish workflows."
  - "shared patterns - cross-workflow reference"
  - "common patterns, commands, and conventions used across all git workflows."
  - "worktree_workflows"
  - "git worktrees - detailed workflow reference"
  - "complete workflow documentation for creating isolated git workspaces with minimal branching."
  - "sk-doc-visual"
  - "visual"
  - "explainer"
  - "sk-doc-visual — styled html diagram generator"
  - "converts complex terminal output and technical concepts into styled, self-contained html pages with diagrams, tables, and visualizations through a 4-phase think-structure-style-deliver workflow."
  - "doc visual — styled html diagram generator"
  - "converts complex terminal output and technical concepts into styled, self-contained html pages with diagrams, tables, and visualizations."
  - "aesthetics"
  - "9 aesthetic profiles with css variable values, font pairings, background atmosphere, and a compatibility matrix with diagram types"
  - "full contracts for all 5 sk-doc-visual slash commands including argument parsing, data gathering, section architecture, and output specs"
  - "diagram-types"
  - "diagram types"
  - "all 11 diagram types with rendering approach, best-fit scenarios, constraints, and a decision tree for selection"
  - "4-phase think > structure > style > deliver workflow with sub-steps and decision points"
  - "cdn libraries, cross-skill integration, output conventions, and google fonts pairings for sk-doc-visual"
  - "index of all reference files, asset files, template files, and related skills for the sk-doc-visual skill"
  - "always/never/escalate if behavioral rules for sk-doc-visual outputs"
  - "intent scoring pseudocode and resource loading strategy for routing user requests to the correct command and resources"
  - "9 pre-delivery quality checks for sk-doc-visual html output"
  - "activation triggers, 5 command overview, and decision matrix for when to use sk-doc-visual"
  - "doc visual — css patterns"
  - "comprehensive css pattern library covering all 9 aesthetic profiles with custom properties, depth tiers, backgrounds, and animations"
  - "library_guide"
  - "doc visual — library guide"
  - "deep-dive reference for mermaid.js v11, chart.js v4, and anime.js v3.2.2 initialization, configuration, and integration patterns"
  - "navigation_patterns"
  - "doc visual — navigation patterns"
  - "in-page navigation patterns including sticky sidebar toc, mobile horizontal nav, and scroll-spy via intersectionobserver"
  - "quality_checklist"
  - "doc visual — quality checklist"
  - "detailed pass/fail verification procedure for all 9 pre-delivery quality checks with step-by-step instructions"
  - "doc visual — quick reference"
  - "command cheat sheet, cdn snippets, and font pairings for quick access during sk-doc-visual generation"
  - "system-spec-kit"
  - "system"
  - "spec"
  - "kit"
  - "unified documentation and context preservation skill providing spec folder workflows, memory management and mcp-powered semantic search."
  - "spec kit - mandatory conversation documentation"
  - "unified documentation and context preservation: spec folder workflow (levels 1-3+), core + addendum template architecture (v2.2), validation, and spec kit memory for context preservation. mandatory for all file modifications."
  - "complexity_decision_matrix"
  - "complexity decision matrix"
  - "quick reference for complexity-based level selection and feature enabling."
  - "level_decision_matrix"
  - "level decision matrix"
  - "quick reference for selecting the appropriate documentation level using progressive enhancement."
  - "parallel_dispatch_config"
  - "parallel dispatch configuration"
  - "complexity scoring and agent dispatch configuration for parallel task execution."
  - "template_mapping"
  - "template mapping"
  - "complete mapping of documentation levels to templates with copy commands."
  - "config"
  - "configuration files for spec kit's memory system, complexity detection, search and content filtering"
  - "constitutional memory system"
  - "always-surface rules and critical context that must be visible to ai agents on every interaction."
  - "gate-enforcement"
  - "gate enforcement - edge cases & cross-reference"
  - "speckit-exclusivity"
  - "spec documentation agent exclusivity - @speckit only"
  - "spec kit memory mcp server: installation guide"
  - "spec kit memory — mcp server"
  - "model context protocol server providing semantic memory, hybrid search and graph intelligence for ai-assisted development."
  - "mcp server configuration files"
  - "search-weight reference config and documented active/legacy sections for memory scoring behavior."
  - "mcp server core modules"
  - "configuration, database-state coordination, and shared runtime guards for the spec kit memory mcp server."
  - "mcp server database storage"
  - "runtime sqlite storage for memory index data, vectors, fts, and coordination files."
  - "mcp server formatters"
  - "response formatting for search results, anchor filtering metrics, and safe content shaping."
  - "handlers"
  - "mcp tool handlers for context, search, crud, indexing, checkpoints, learning, and causal graph operations."
  - "hooks"
  - "memory-surface helper functions for context hint extraction and optional auto-surfacing."
  - "mcp server library"
  - "core library modules for search, scoring, cognitive memory and storage."
  - "architecture module"
  - "7-layer mcp architecture with token budgets and document-aware routing after spec 126."
  - "cache module"
  - "tool output caching with ttl, lru eviction, and spec-document-aware invalidation paths."
  - "cognitive subsystem"
  - "research-backed memory decay, retrieval, classification and lifecycle engine with document-aware scoring inputs."
  - "memory and document type configuration"
  - "memory-type decay configuration plus spec 126 document-type inference and defaults."
  - "contracts"
  - "typed contracts for the retrieval pipeline. defines envelopes, traces, and degraded-mode handling for structured, observable retrieval."
  - "errors"
  - "error handling subsystem with custom error classes, recovery hints, and document-aware operation context."
  - "extraction"
  - "post-tool extraction pipeline for automated memory creation. resolves memory ids, orchestrates extraction, and gates pii/secret content before insert."
  - "interfaces"
  - "protocol abstractions for embedding/vector backends, with shared-package migration notes."
  - "learning"
  - "correction tracking that updates stability signals across memory and spec-document entries."
  - "memory management library"
  - "graph-based authority scoring and batch management utilities for the memory system, including iterative pagerank computation."
  - "parsing modules"
  - "memory file parsing and trigger matching for the spec kit memory system."
  - "providers modules"
  - "embedding provider abstraction and retry management for the spec kit memory system."
  - "response module"
  - "standardized response envelope for mcp tools: summary, data, hints, meta."
  - "scoring algorithms"
  - "multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
  - "search subsystem"
  - "multi-modal hybrid search architecture combining vector, lexical (bm25/fts5) and graph-based retrieval with reciprocal rank fusion (rrf)."
  - "session layer"
  - "session management for the spec kit memory mcp server. handles session deduplication, crash recovery and context persistence."
  - "storage layer"
  - "persistence layer for the spec kit memory mcp server. handles memory indexing, checkpoints, causal graphs and atomic file operations."
  - "telemetry"
  - "retrieval telemetry for observability and governance. records latency, mode selection, fallback triggers, and composite quality scores for retrieval pipeline runs."
  - "utils"
  - "utility functions for output formatting and path security."
  - "pre-flight quality gates for memory operations: anchor validation, duplicate detection and token budget verification."
  - "mcp server test suite"
  - "vitest-based test suite for cognitive memory and mcp handlers."
  - "tools: dispatch layer"
  - "dispatcher modules that route mcp tool names to typed handler calls."
  - "mcp server utilities"
  - "shared validators, json helpers, batch processing helpers, and db utility functions."
  - "checklist-verification"
  - "checklist verification"
  - "how the checklist acts as an active verification tool for level 2+ specs."
  - "context-preservation"
  - "context preservation"
  - "how generate-context.js preserves conversation state into memory/ folders."
  - "folder-naming-versioning"
  - "folder naming and versioning"
  - "rules for naming and versioning spec folders."
  - "gate-3-integration"
  - "gate 3 integration"
  - "how gate 3 asks the user for spec folder routing before any file changes."
  - "memory-system"
  - "spec kit memory system"
  - "details on the integrated spec kit memory mcp server (vector search, tiers, chunking) including audit tools and handler architecture."
  - "phase-system"
  - "phase system"
  - "phase decomposition for complex multi-session specifications, splitting large work into parallel child spec folders."
  - "progressive-enhancement"
  - "progressive enhancement levels"
  - "how the 3-level documentation system (core + addendum) scales based on code complexity."
  - "system-spec-kit rules"
  - "mandatory rules (always, never, escalate) for using the system-spec-kit workflow."
  - "validation-workflow"
  - "validation workflow"
  - "how validate.sh automates the audit and validation of spec folder contents."
  - "when to use spec kit"
  - "triggers and conditions for when to use the spec kit workflow, including folder requirements and agent exclusivity."
  - "environment_variables"
  - "environment variables reference"
  - "configuration options via environment variables for the spec kit system"
  - "troubleshooting reference"
  - "systematic diagnosis and resolution for semantic memory issues, context retrieval failures, and mcp tool problems."
  - "universal_debugging_methodology"
  - "universal debugging methodology"
  - "stack-agnostic 4-phase debugging approach applicable to any technology."
  - "embedding_resilience"
  - "embedding resilience"
  - "provider fallback chains, graceful degradation, and offline mode for reliable semantic search"
  - "epistemic-vectors"
  - "epistemic vectors reference"
  - "uncertainty tracking framework for measuring knowledge gaps separate from confidence scoring"
  - "memory_system"
  - "memory system reference"
  - "detailed documentation for spec kit memory mcp tools, behavior notes, and configuration"
  - "readme_indexing"
  - "readme indexing pipeline"
  - "how readme files are discovered, weighted, and indexed within the 5-source indexing pipeline alongside memory files, constitutional rules, project readmes, and spec documents."
  - "save_workflow"
  - "memory save workflow"
  - "complete guide to saving conversation context including execution methods, output format, and retrieval."
  - "trigger_config"
  - "trigger configuration"
  - "complete configuration guide for memory trigger phrases and the fast trigger matching system."
  - "folder_routing"
  - "folder routing & alignment"
  - "stateless spec folder routing with alignment scoring for context preservation."
  - "folder_structure"
  - "folder structure reference"
  - "spec folder naming conventions, level requirements, and organization patterns"
  - "phase_definitions"
  - "phase definitions"
  - "phase decomposition system for complex multi-session specifications, providing parallel work stream organization as a behavioral overlay on existing documentation levels."
  - "sub_folder_versioning"
  - "sub-folder versioning"
  - "workflow-assisted pattern for organizing iterative work within existing spec folders using versioned sub-folders and isolated memory context."
  - "level_selection_guide"
  - "level selection guide"
  - "guide to selecting appropriate documentation levels based on task complexity."
  - "level_specifications"
  - "level specifications"
  - "complete specifications for all documentation levels using core + addendum architecture (v2.2)."
  - "template_guide"
  - "template guide"
  - "comprehensive guide to template selection, copying, adaptation, and quality standards using the progressive enhancement model."
  - "template_style_guide"
  - "template style guide"
  - "conventions and standards for system-spec-kit templates ensuring documentation consistency across all spec folders."
  - "decision-format"
  - "structured gate decision format"
  - "standardized format for documenting gate decisions to ensure auditability and traceability"
  - "five-checks"
  - "five checks framework"
  - "evaluation framework for validating significant decisions before implementation"
  - "path_scoped_rules"
  - "path-scoped validation rules"
  - "path-scoped validation system for differentiated validation based on file location, level, and type"
  - "phase_checklists"
  - "phase checklists"
  - "priority-based checklists for each phase of the speckit workflow."
  - "validation_rules"
  - "validation rules reference"
  - "complete reference for all validation rules used by the speckit validation system."
  - "execution_methods"
  - "execution methods reference"
  - "how to execute spec folder operations - validation, completion checking, context saving, and template composition"
  - "fast lookup for commands, checklists, and troubleshooting using the progressive enhancement model."
  - "rollback-runbook"
  - "rollback runbook: working memory automation"
  - "worked_examples"
  - "worked examples reference"
  - "practical scenarios demonstrating speckit workflows for different documentation levels."
  - "shared library modules"
  - "consolidated typescript modules shared between cli scripts and mcp server for embedding generation and trigger extraction."
  - "embeddings factory"
  - "flexible embeddings system supporting multiple backends with strong fallback and per-profile databases."
  - "folder scoring"
  - "computes composite relevance scores for spec folders based on their memories, used for ranking and resume-recent-work workflows."
  - "shared utilities"
  - "low-level utility functions providing security-hardened path validation and resilient retry logic shared across system-spec-kit."
  - "templates"
  - "system spec kit template architecture and level routing."
  - "addendum templates"
  - "level extension blocks used to compose final level templates."
  - "checklist"
  - "verification checklist: [name]"
  - "plan-level2"
  - "spec-level2"
  - "decision-record"
  - "decision record: [name]"
  - "plan-level3"
  - "spec-level3-guidance"
  - "spec-level3-prefix"
  - "spec-level3-suffix"
  - "spec-level3"
  - "checklist-extended"
  - "plan-level3plus"
  - "spec-level3plus-guidance"
  - "spec-level3plus-suffix"
  - "spec-level3plus"
  - "phase-child-header"
  - "phase-parent-section"
  - "context_template"
  - "session summary"
  - "core templates"
  - "shared base templates used by all documentation levels."
  - "impl-summary-core"
  - "implementation summary"
  - "plan-core"
  - "implementation plan: [name]"
  - "spec-core"
  - "feature specification: [name]"
  - "tasks-core"
  - "tasks: [name]"
  - "debug-delegation"
  - "debug delegation report"
  - "template examples"
  - "reference examples showing expected documentation depth by level."
  - "implementation-summary"
  - "plan"
  - "implementation plan: add user authentication"
  - "feature specification: add user authentication"
  - "tasks"
  - "tasks: add user authentication"
  - "verification checklist: add user authentication"
  - "decision record: add user authentication"
  - "handover"
  - "session handover document"
  - "level 1 templates"
  - "baseline documentation templates for low-risk, small-scope changes."
  - "level 2 templates"
  - "verification-focused templates for medium complexity changes."
  - "level 3 templates"
  - "architecture-oriented templates for large or high-risk implementation work."
  - "level 3+ templates"
  - "governance-heavy templates for high-complexity or regulated work."
  - "memory"
  - "memory workflow rules for generated context files in spec folders."
  - "research"
  - "feature research: [your_value_here: feature-name] - comprehensive technical investigation"
  - "scratch directory template"
  - "template and guidelines for the scratch/ subdirectory used for temporary and disposable files during spec folder work."
  - "01-overview"
  - "overview"
  - "02-requirements"
  - "requirements"
  - "03-architecture"
  - "04-testing"
  - "spec-index"
  - "[feature name] - specification index"
  - "code mode install_guide.md"
  - "session_management.md"
  - "troubleshooting.md"
  - "cdp_patterns.md"
  - "skill.md"
  - "env_template.md"
  - "config_template.md"
  - "full architecture details"
  - "operational workflows"
  - "configuration.md"
  - "naming_convention.md"
  - "tool_catalog.md"
  - "workflows.md"
  - "architecture.md"
  - "mcp - code mode"
  - "references/tool_reference.md"
  - "references/quick_start.md"
  - "assets/tool_categories.md"
  - "install guide"
  - "tool_reference.md"
  - "quick_start.md"
  - "debugging_checklist.md"
  - "verification_checklist.md"
  - "code_quality_checklist.md"
  - "go_standards.md"
  - "domain_layers.md"
  - "models_vs_entities_and_adapters.md"
  - "database_patterns_gorm_type_mappings.md"
  - "database_patterns.md"
  - "microservice_bootstrap_architecture.md"
  - "di_configuration.md"
  - "api_design.md"
  - "testing_strategy.md"
  - "nodejs_standards.md"
  - "express_patterns.md"
  - "async_patterns.md"
  - "react-native-standards.md"
  - "react-hooks-patterns.md"
  - "navigation-patterns.md"
  - "performance-optimization.md"
  - "swift_standards.md"
  - "swiftui_patterns.md"
  - "mvvm_architecture.md"
  - "persistence_patterns.md"
  - "universal_checklist.md"
  - "javascript_checklist.md"
  - "typescript_checklist.md"
  - "python_checklist.md"
  - "shell_checklist.md"
  - "config_checklist.md"
  - "style_guide.md"
  - "quick_reference.md"
  - "quality_standards.md"
  - "observer_patterns.md"
  - "implementation_workflows.md"
  - "code_style_enforcement.md"
  - "debugging_workflows.md"
  - "verification_workflows.md"
  - "error_recovery.md"
  - "minification_guide.md"
  - "cdn_deployment.md"
  - "performance_patterns.md"
  - "animation_workflows.md"
  - "webflow_patterns.md"
  - "security_patterns.md"
  - "form_upload_workflows.md"
  - "resource_loading.md"
  - "third_party.md"
  - "webflow_constraints.md"
  - "cwv_remediation.md"
  - "code_style_guide.md"
  - "code_quality_standards.md"
  - "shared_patterns.md"
  - "skill_creation.md"
  - "skill_graph_index_template.md"
  - "skill_graph_node_template.md"
  - "agent_template.md"
  - "command_template.md"
  - "install_guide_standards.md"
  - "hvr_rules.md"
  - "frontmatter_templates.md"
  - "install_guide_template.md"
  - "skill_md_template.md"
  - "skill_reference_template.md"
  - "skill_asset_template.md"
  - "mode 1: document quality"
  - "mode 2: component creation"
  - "mode 3: flowchart creation"
  - "optimization.md"
  - "validation.md"
  - "core_standards.md"
  - "worktree_workflows.md"
  - "commit_workflows.md"
  - "finish_workflows.md"
  - "commit_message_template.md"
  - "pr_template.md"
  - "mcp_server/readme.md"
  - "references/memory/memory_system.md"
  - "references/memory/readme_indexing.md"
  - "references/validation/validation_rules.md"
  - "references/validation/five-checks.md"
  - "references/workflows/rollback-runbook.md"
  - "../sk-code--opencode/skill.md"
  - "../sk-doc/skill.md"
  - "level_specifications.md"
  - "template_guide.md"
  - "save_workflow.md"
  - "sub_folder_versioning.md"
  - "memory_system.md"
  - "epistemic-vectors.md"
  - "validation_rules.md"
  - "level_decision_matrix.md"
  - "template_mapping.md"
  - "parallel_dispatch_config.md"
  - "complexity_decision_matrix.md"
  - "progressive enhancement"
  - "folder naming & versioning"
  - "readme_indexing.md"
  - "embedding_resilience.md"
  - "level_selection_guide.md"
  - "embeddings/readme.md"

key_files:
  - ".opencode/.../handlers/sgqs-query.ts"
  - ".opencode/skill/system-spec-kit/mcp_server/handlers/index.ts"
  - ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts"
  - ".opencode/.../tools/causal-tools.ts"
  - ".opencode/skill/system-spec-kit/mcp_server/tools/types.ts"
  - ".opencode/.../tests/prediction-error-gate.vitest.ts"
  - ".opencode/.../architecture/layer-definitions.ts"
  - ".opencode/.../tests/layer-definitions.vitest.ts"
  - ".opencode/.../tests/context-server.vitest.ts"
  - ".opencode/.../tests/mcp-tool-dispatch.vitest.ts"

# Relationships
related_sessions:

  []

parent_spec: "03--commands-and-skills/002-skill-rename"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1

# Quality Signals
quality_score: 1.00
quality_flags:
  []
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*

