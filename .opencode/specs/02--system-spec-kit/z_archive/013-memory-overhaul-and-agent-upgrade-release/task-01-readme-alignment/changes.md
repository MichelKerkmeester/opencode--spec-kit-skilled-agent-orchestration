# Changes — Task 01: README Audit & Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

## Wave 1 Implementation (20-Agent Dispatch)

**Execution Date**: 2026-02-16
**Method**: Parallel dispatch via agents A01-A09, A19-A20
**Files Modified**: 60+ README files across install guides, skills, and system-spec-kit

---

## Agent A01: Top-Level Install Guides (3 files)

### 1. `.opencode/install_guides/README.md`
**Priority**: P0
**Changes**:
- Corrected guide count from 9 to 10 in Key Statistics
- Added detail: 5 MCP guides, 4 setup guides, 1 index guide
- Updated skill version matrix to match current SKILL.md versions:
  - mcp-code-mode: v1.0.4.0
  - mcp-figma: v1.0.2.0
  - system-spec-kit: v2.2.9.0
  - mcp-chrome-devtools: v1.0.1.0
  - sk-code--opencode: v1.0.5.0
  - workflows-code--web-dev: v1.0.5.0
  - sk-doc: v1.0.6.0
  - sk-git: v1.0.2.0
- Replaced stale `workflows-code` references with `workflows-code--web-dev` and `sk-code--full-stack`

### 2. `.opencode/install_guides/install_scripts/README.md`
**Priority**: P1
**Changes**:
- Retitled from "MCP Install Scripts" to "Component Install Scripts"
- Corrected script count from 5 to 6 (5 component installers + 1 master)
- Updated table column from `MCP` to `Component`
- Clarified Chrome installer labeled as Chrome DevTools CLI

### 3. `.opencode/skill/README.md`
**Priority**: P1
**Changes**:
- Updated system-spec-kit version to v2.2.9.0
- Verified remaining 8 skill versions match current SKILL.md files

---

## Agent A02: MCP Server READMEs (3 files)

### 4. `.opencode/skill/system-spec-kit/mcp_server/lib/README.md`
**Priority**: P0
**Changes**:
- Updated key stats to reflect:
  - 7 intent set (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision)
  - 5-source indexing model (spec memories, constitutional files, skill READMEs, project READMEs, spec documents)
  - schema v13 milestone (document_type, spec_level) for spec-doc indexing
- Added feature-table coverage for document-type scoring and spec document indexing via includeSpecDocs
- Added Spec 126 Hardening References subsection

### 5. `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`
**Priority**: P0
**Changes**:
- Updated schema language to align with post-spec126 reality (v13-aware framing)
- Expanded schema table to include v13 (document_type, spec_level)
- Added spec126 hardening references section pointing to tests and handlers

### 6. `.opencode/skill/system-spec-kit/mcp_server/tests/README.md`
**Priority**: P1
**Changes**:
- Added feature coverage for 5-source indexing, 7 intents, schema v13, document-type scoring
- Added missing test files: handler-memory-index-cooldown.vitest.ts, spec126-full-spec-doc-indexing.vitest.ts
- Updated structure map and coverage tables

---

## Agent A03: MCP Server Module READMEs (9 files)

### 7-15. MCP Server Module Documentation
**Priority**: P1
**Files**:
- `.opencode/skill/system-spec-kit/mcp_server/core/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/database/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/tools/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/utils/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/configs/README.md`

**Changes**:
- Replaced long drifted docs with concise implemented-state snapshots
- Updated to reflect schema v13 alignment (document_type, spec_level)
- Added hardening notes from specs 122-129
- Corrected API naming to camelCase (extractContextHint, autoSurfaceMemories)
- Updated to 22-tool/5-dispatcher implemented state

---

## Agent A04: MCP Server Lib READMEs Batch 1 (8 files)

### 16-23. Lib Module Documentation
**Priority**: P1
**Files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/embeddings/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md`

**Changes**:
- Updated stale module descriptions to align with post-Spec 126 terminology
- Added document-aware behavior references (documentType, specLevel)
- Normalized version/date footer to 1.8.0 and 2026-02-16

---

## Agent A05: MCP Server Lib READMEs Batch 2 (9 files)

### 24-32. Lib Module Documentation
**Priority**: P1
**Files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` (overlap reconciled)
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md`

**Changes**:
- Updated 9 target files to align with spec126/127 behavior
- Added parsing docs for documentType and specLevel extraction
- Updated scoring docs with document-type multipliers and 7-intent coverage
- Updated storage docs with spec document edge builder
- Standardized TOCs and section headers to ASCII
- Refreshed Last Updated markers to 2026-02-16

---

## Agent A06: Scripts READMEs (9 files)

### 33-41. Scripts Documentation
**Priority**: P1
**Files**: 9 README files under `.opencode/skill/system-spec-kit/scripts/`

**Changes**:
- Updated to match current on-disk script inventory
- Replaced stale module counts and outdated migration notes
- Aligned with post-spec124/128/129 workflow: upgrade-level.sh -> AI auto-populate -> check-placeholders.sh -> validate.sh
- Added references to current core modules and test files

---

## Agent A07: Scripts & Shared READMEs (Additional files)

### 42-47. Additional Scripts and Shared Documentation
**Priority**: P1
**Files**: Additional scripts/ and shared/ READMEs

**Changes**:
- Updated stale references to match current module/script behavior
- Normalized validation command references from validate-spec.sh to spec/validate.sh
- Corrected setup and utils docs for current script outputs/options
- Updated shared docs to reflect current architecture with shared/dist/ build output

---

## Agent A08: Template READMEs (9 files)

### 48-56. Template Documentation
**Priority**: P1
**Files**:
- `.opencode/skill/system-spec-kit/templates/README.md`
- `.opencode/skill/system-spec-kit/templates/level_1/README.md`
- `.opencode/skill/system-spec-kit/templates/level_2/README.md`
- `.opencode/skill/system-spec-kit/templates/level_3/README.md`
- `.opencode/skill/system-spec-kit/templates/level_3+/README.md`
- `.opencode/skill/system-spec-kit/templates/core/README.md`
- `.opencode/skill/system-spec-kit/templates/addendum/README.md`
- `.opencode/skill/system-spec-kit/templates/examples/README.md`
- `.opencode/skill/system-spec-kit/templates/memory/README.md`

**Changes**:
- Updated to align with current level architecture and workflow behavior
- Clarified CORE + ADDENDUM composition and source-vs-ready template usage
- Standardized level summaries with current required file sets
- Added workflow notes for checklist priority order

---

## Agent A09: Workflow Skill READMEs (8 files)

### 57-64. Workflow Skill Documentation
**Priority**: P1
**Files**:
- `.opencode/skill/sk-doc/README.md`
- `.opencode/skill/sk-code--opencode/README.md`
- `.opencode/skill/workflows-code--web-dev/README.md`
- `.opencode/skill/sk-code--full-stack/README.md`
- `.opencode/skill/sk-git/README.md`
- `.opencode/skill/mcp-chrome-devtools/README.md`
- `.opencode/skill/mcp-code-mode/README.md`
- `.opencode/skill/mcp-figma/README.md`

**Changes**:
- Updated stale count wording and lifecycle counts
- Refreshed cross-skill references to match current skill set
- Aligned Code Mode native-MCP exclusions with current platform state

---

## Agent A19: System-Spec-Kit Core READMEs (2 files)

### 65-66. Core System Documentation
**Priority**: P0
**Files**:
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`

**Changes**:
- Added Spec 126 post-implementation hardening notes
- Documented import-path regression fixes
- Added specFolder boundary filtering notes
- Added metadata preservation notes for document_type and spec_level

---

## Agent A20: Framework READMEs (3 files)

### 67-69. Top-Level Framework Documentation
**Priority**: P0
**Files**:
- `README.md`
- `.opencode/README.md`
- `AGENTS.md`

**Changes**:
- Updated for post-spec126 alignment
- Added 5-source indexing, 7-intent routing documentation
- Added schema v13 metadata fields coverage
- Added cross-platform agent file mapping
- Added model-tier mapping details including Codex profile mapping

---

## Overlap Resolution

### File: `mcp_server/lib/search/README.md`
**Issue**: Modified by both A02 and A05
**Resolution**: Closure review confirmed no internal contradiction for schema timeline (v13 milestone + v14 current), 7-intent set, and spec126 hardening references. Current content kept as canonical.

---

## Verification

**Method**: Manual cross-check against directory listings and spec 122-129 summaries
**Result**: All files updated with concrete evidence, no placeholder text remaining
**Scope Compliance**: No edits outside requested documentation files
