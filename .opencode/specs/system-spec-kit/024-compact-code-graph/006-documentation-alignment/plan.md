---
title: "Plan: Phase 6 — Documentation Alignment [system-spec-kit/024-compact-code-graph/006-documentation-alignment/plan]"
description: "1. Create feature catalog entries"
trigger_phrases:
  - "plan"
  - "phase"
  - "documentation"
  - "alignment"
  - "006"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 6 — Documentation Alignment


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
Template compliance shim anchor for dependencies.
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Steps

1. **Create feature catalog entries:**
    - Create entries for: PreCompact hook, SessionStart priming, Stop token tracking, cross-runtime fallback, runtime detection
    - Follow existing feature catalog format and conventions
    - Include usage examples, configuration, and integration points
    - Use current implementation names: `session-stop.ts`, JSON hook-state files, and Gemini capability detection from `.gemini/settings.json` while avoiding stale `pendingStopSave` claims
2. **Create manual testing playbook scenarios:**
   - Write test scenarios for each hook (PreCompact, SessionStart, Stop)
   - Write cross-runtime fallback test scenarios
   - Include expected results, prerequisites, and verification steps
3. **Update SKILL.md with hook system section:**
   - Add "Hook System" section describing lifecycle integration
   - Document hook registration process (`.claude/settings.local.json`)
   - Document hook script locations and build process
   - Explain design principle: hooks = transport, not business logic
4. **Update ARCHITECTURE.md with hook architecture:**
    - Add hook lifecycle diagram (ASCII flowchart)
    - Document hook state management (JSON hook-state files and session mapping) without claiming a shipped `pendingStopSave` field
    - Document runtime adapter pattern if delivered; otherwise record it as a follow-up documentation gap
    - Document token tracking data flow from `session-stop.ts`
5. **Update README files:**
    - Root `README.md` — mention new context preservation capabilities if updated in this phase; otherwise document the omission as a follow-up gap
    - `.opencode/skill/system-spec-kit/README.md` — list hook features
    - `.opencode/skill/README.md` — update system-spec-kit description
6. **Update AGENTS.md if needed:**
   - Check if Phase 5 agent changes require AGENTS.md updates
   - Update agent capability descriptions
7. **Verify documentation quality:**
    - Run sk-doc quality checks on all updated files
    - Ensure consistent terminology (hooks, context injection, runtime detection)
    - Verify no stale references to pre-hook compaction approach
    - Remove or clearly mark any absent follow-up reference or prompt-template documents as not created when they are missing
    - Record undelivered items as future gaps: dedicated cross-runtime consistency playbook, ARCHITECTURE.md runtime adapter docs, root README context preservation mention

<!-- ANCHOR:dependencies -->
### Dependencies
- Phase 1-4 (all hook implementations must be designed for accurate documentation)
- Phase 5 (agent definition changes affect AGENTS.md)
- Can begin drafts in parallel with Phases 1-5, finalize after implementation
<!-- /ANCHOR:dependencies -->

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

---

**V2 Addendum: Code Graph Documentation Alignment Plan (2026-04-02)**

### Evidence Base
- Direct file inspection of all 6 target locations
- Cross-reference with `lib/architecture/layer-definitions.ts` (source of truth for tool layers)
- Copilot CLI GPT-5.4 review agents (3 parallel, `--model gpt-5.4`, high reasoning) confirmed gaps
- Spec 024 implementation-summary.md and phase spec folders 008-025

### Phase 1: MCP Documentation Surfaces

#### Step 1: Fix `../../../../skill/system-spec-kit/mcp_server/README.md` — P0 (largest gap)

1a. **Update layer summary table** (line ~1091-1099):
   - L1: 1 → 3 tools (add session_resume, session_bootstrap)
   - L3: 3 → 4 tools (add session_health)
   - L6: 8 → 10 tools (add code_graph_query, code_graph_context)
   - L7: 5 → 10 tools (add code_graph_scan, code_graph_status, ccc_status, ccc_reindex, ccc_feedback)
   - Total: 33 → 43

1b. **Add concept section** — new `3.1.13 CODE GRAPH` subsection after 3.1.12:
   - Architecture: tree-sitter WASM indexer → SQLite → MCP tools
   - Complementary design: CocoIndex (semantic) + Code Graph (structural) + Memory (session)
   - Edge types: CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, DECORATES, OVERRIDES, TYPE_OF
   - Auto-trigger: `ensureCodeGraphReady()` on branch switch, session start, stale detection
   - Query routing: structural → code_graph, semantic → CocoIndex, session → Memory
   - Budget allocator: 3-source merge under 4000-token ceiling

1c. **Add tool reference entries** in L1, L3, L6, L7 sections:
   - L1: `session_resume`, `session_bootstrap` with parameter tables
   - L3: `session_health` with parameter table
   - L6: `code_graph_query`, `code_graph_context` with parameter tables
   - L7: `code_graph_scan`, `code_graph_status`, `ccc_status`, `ccc_reindex`, `ccc_feedback` with parameter tables

	   Source for parameter tables: `mcp_server/schemas/tool-input-schemas.ts` + `mcp_server/tool-schemas.ts`

#### Step 2: Fix `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — P0

2a. **Update validation checklist** (line ~429-435):
   - Add `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`
   - Add `session_health`, `session_bootstrap`, `session_resume`

2b. **Add tree-sitter dependency** to prerequisites section:
   - `web-tree-sitter` (WASM-based, no native compilation needed)
   - Grammar packages: `tree-sitter-javascript`, `tree-sitter-typescript`, `tree-sitter-python`, `tree-sitter-bash`

2c. **Document `code-graph.sqlite`**:
   - Location: `${DB_DIR}/code-graph.sqlite` (same directory as `context-index.sqlite`)
   - Auto-created on first `code_graph_scan`
   - Tables: `code_files`, `code_nodes`, `code_edges`

### Phase 2: Skill And README Alignment

#### Step 3: Fix `../../../../skill/system-spec-kit/SKILL.md` — P1

3a. **Fix incorrect parser description** (line 758):
   - "regex-based indexing" → "tree-sitter WASM (default) with regex fallback"

3b. **Expand Code Graph section** to include:
   - Edge types (9 types)
   - `ensureCodeGraphReady()` auto-trigger
   - Query routing decision tree
   - CCC tools (ccc_feedback, ccc_reindex, ccc_status)
   - Session tools (session_health, session_bootstrap, session_resume)
   - CocoIndex seed resolution flow

#### Step 4: Expand `README.md` — P2

4a. **Expand code graph feature table entry** (line 92) into a subsection with:
   - Tool list (4 code graph + 3 CCC + 3 session)
   - Tree-sitter + SQLite architecture one-liner
   - Pointer to `../../../../skill/system-spec-kit/mcp_server/README.md` for full reference

### Dependencies
- Source of truth: `mcp_server/lib/architecture/layer-definitions.ts`
- Parameter schemas: `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tool-schemas.ts`
- Handler implementations: `mcp_server/handlers/code-graph/`, `mcp_server/handlers/session-*.ts`
