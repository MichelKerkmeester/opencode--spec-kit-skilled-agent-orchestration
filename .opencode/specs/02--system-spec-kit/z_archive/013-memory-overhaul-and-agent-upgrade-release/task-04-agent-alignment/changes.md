# Changes — Task 04: Agent Configs Audit

<!-- SPECKIT_LEVEL: 3 -->

---

## Wave 1 Implementation (Agent Dispatch)

**Execution Date**: 2026-02-16
**Method**: Agents A16, A17, A18, A20
**Files Modified**: 24 agent definition files across OpenCode, Claude, and Codex platforms + AGENTS.md

---

## Agent A16: OpenCode Agent Files (8 files)

### 1-8. OpenCode Agent Definitions
**Priority**: P0
**Files**:
- `.opencode/agent/context.md`
- `.opencode/agent/debug.md`
- `.opencode/agent/handover.md`
- `.opencode/agent/orchestrate.md`
- `.opencode/agent/research.md`
- `.opencode/agent/review.md`
- `.opencode/agent/speckit.md`
- `.opencode/agent/write.md`

**Changes**:
- Added explicit cross-platform body-sync convention (OpenCode/Claude/Codex parity)
- Frontmatter remains platform-specific
- Aligned review.md and orchestrate.md references from legacy workflows-code to current workflows-code--web-dev and sk-code--full-stack
- Added explicit spec-015 note in review.md that frontmatter stays model-agnostic for parent-model inheritance
- Removed stale WebSearch tool mention from research.md

---

## Agent A17: Claude Agent Files (8 files)

### 9-16. Claude Agent Definitions
**Priority**: P0
**Files**:
- `.claude/agents/context.md`
- `.claude/agents/debug.md`
- `.claude/agents/handover.md`
- `.claude/agents/orchestrate.md`
- `.claude/agents/research.md`
- `.claude/agents/review.md`
- `.claude/agents/speckit.md`
- `.claude/agents/write.md`

**Changes**:
- Updated all eight agent frontmatter descriptions to align with current specialization language
- Switched `.claude/agents/handover.md` model from "sonnet" to "haiku" to match fast-tier routing model map
- Kept edits metadata-focused (frontmatter wording/model)
- No body-level workflow rewrites

---

## Agent A18: Codex Agent Files (8 files)

### 17-24. Codex Agent Definitions
**Priority**: P0
**Files**:
- `.codex/agents/context.md`
- `.codex/agents/debug.md`
- `.codex/agents/handover.md`
- `.codex/agents/orchestrate.md`
- `.codex/agents/research.md`
- `.codex/agents/review.md`
- `.codex/agents/speckit.md`
- `.codex/agents/write.md`

**Changes**:
- Updated all eight files to align with current orchestration guidance while preserving Codex frontmatter
- Added explicit cross-platform parity notes in each file
- Updated Codex-facing agent path references (.codex/agents/...)
- Extended orchestrate.md with cross-platform agent-path and tier-mapping tables
- Kept command/skill path references unchanged where resources are shared under .opencode/

---

## Agent A20: AGENTS.md Framework (1 file)

### 25. `AGENTS.md`
**Priority**: P0
**Changes**:
- Updated for post-spec126 alignment
- Added 5-source indexing, 7-intent routing documentation
- Added schema v13 metadata fields (document_type, spec_level) coverage
- Added hardening behavior references
- Added cross-platform agent file mapping table (OpenCode/Claude/Codex paths)
- Added model-tier mapping details:
  - Fast tier: context, handover (haiku/fast profile)
  - Balanced tier: speckit, write (sonnet/balanced profile)
  - Powerful tier: debug, research, orchestrate (opus/powerful profile)
  - Read-only tier: review (opus/readonly profile)
- Added Codex profile mapping and subfolder save-path support notes

---

## Cross-Platform Consistency Verification

**Body Content**: All 8 agent bodies synchronized across OpenCode, Claude, and Codex platforms
**Frontmatter**: Platform-specific formatting preserved (OpenCode YAML, Claude YAML, Codex TOML-compatible)
**Model Routing**: Verified consistency across platforms per spec 016:
- handover = haiku/fast on all platforms
- review = model-agnostic/readonly on all platforms

---

## Verification

**Method**: 
- Manual cross-platform consistency check for all 24 agent files
- Model assignment verification against spec 016
- Cross-reference verification for workflows-code references
**Result**: All files updated with concrete evidence, no placeholder text remaining
**Scope Compliance**: Documentation-only updates, no code changes
