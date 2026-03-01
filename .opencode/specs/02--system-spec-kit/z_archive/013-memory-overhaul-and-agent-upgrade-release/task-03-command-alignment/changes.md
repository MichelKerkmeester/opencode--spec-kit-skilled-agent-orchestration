# Changes — Task 03: Command Configs Audit

<!-- SPECKIT_LEVEL: 3 -->

---

## Wave 1 Implementation (Agent Dispatch)

**Execution Date**: 2026-02-16
**Method**: Agents A13, A14, A15
**Files Modified**: 9 command .md files across memory/ and spec_kit/ namespaces

---

## Agent A13: Memory Command Files (4 files)

### 1. `.opencode/command/memory/context.md`
**Priority**: P0
**Changes**:
- Updated to align with current memory_context behavior
- Added L1 budget guidance
- Corrected sessionId naming
- Added preferred single-call MCP flow with manual-search fallback

### 2. `.opencode/command/memory/learn.md`
**Priority**: P1
**Changes**:
- Removed stray non-doc text
- Added asyncEmbedding to memory_save signature examples

### 3. `.opencode/command/memory/manage.md`
**Priority**: P1
**Changes**:
- Updated health output examples from schema v9 to v13
- Corrected table naming to memory_index
- Fixed dashboard action label point -> checkpoint

### 4. `.opencode/command/memory/save.md`
**Priority**: P0
**Changes**:
- Documented asyncEmbedding parameter
- Corrected /memory:save no-argument behavior to folder prompt/active Gate 3 context instead of implicit auto-detect

**Verification**: Manual accuracy check against `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` for memory_context, memory_save, and memory_index_scan parameters

---

## Agent A14: Spec Kit Command Files Batch 1 (3 files)

### 5. `.opencode/command/spec_kit/complete.md`
**Priority**: P0
**Changes**:
- Aligned routing/process language with current system-spec-kit behavior
- Marked implementation-summary.md mandatory for Level 1+
- Moved review routing references to Step 12 completion verification
- Standardized fallback subagent_type to "general"

### 6. `.opencode/command/spec_kit/research.md`
**Priority**: P1
**Changes**:
- Standardized fallback routing to subagent_type: "general"
- Kept review/research language model-agnostic per spec 015

### 7. `.opencode/command/spec_kit/debug.md`
**Priority**: P1
**Changes**:
- Clarified that @review in Step 5 is advisory and model-agnostic

---

## Agent A15: Spec Kit Command Files Batch 2 (4 files)

### 8. `.opencode/command/spec_kit/handover.md`
**Priority**: P0
**Changes**:
- Clarified orchestration wording: main/orchestrating agent handles validation
- Updated @handover ownership via subagent_type: "handover"
- Updated related-agents text to reflect routing coordination by @orchestrate

### 9. `.opencode/command/spec_kit/implement.md`
**Priority**: P1
**Changes**:
- Normalized debug fallback to subagent_type: "general"

### 10. `.opencode/command/spec_kit/plan.md`
**Priority**: P1
**Changes**:
- Normalized exploration fallback references to "general"
- Removed "general-purpose" wording

### 11. `.opencode/command/spec_kit/resume.md`
**Priority**: P1
**Changes**:
- Reordered session detection priority: run memory_match_triggers() before memory_context()
- Added compaction continuation safety note (summarize state first, wait for confirmation)

---

## Verification

**Method**: 
- Manual accuracy check against tool-schemas.ts for parameter accuracy
- Consistency check for 5-source indexing, 7 intents, schema v13 references
**Result**: All files updated with concrete evidence, no placeholder text remaining
**Scope Compliance**: Documentation-only updates, no code or YAML asset changes in wave1
