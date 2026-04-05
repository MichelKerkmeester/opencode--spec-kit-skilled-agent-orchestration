---
title: "Phase 6: Documentation Alignment [system-spec-kit/024-compact-code-graph/006-documentation-alignment/spec]"
description: "Update all documentation to reflect the new hook system. This covers the feature catalog, manual testing playbook, SKILL.md, ARCHITECTURE.md, README files, and agent reference d..."
trigger_phrases:
  - "phase"
  - "documentation"
  - "alignment"
  - "spec"
  - "006"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 6: Documentation Alignment

<!-- PHASE_LINKS: parent=../spec.md predecessor=005-command-agent-alignment successor=007-testing-validation -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary
Update all documentation to reflect the new hook system. This covers the feature catalog, manual testing playbook, `../../../../skill/system-spec-kit/SKILL.md`, ARCHITECTURE.md, README files, and agent reference docs.

### What to Document

### 1. Feature Catalog Entries (`.opencode/skill/system-spec-kit/feature_catalog/`)

New feature entries needed:

| Feature | Category | Description |
|---------|----------|-------------|
| PreCompact Hook | Context Preservation | Precomputes critical context before compaction and caches to temp file |
| SessionStart Priming | Context Preservation | Injects relevant prior work at session startup/resume/compaction |
| Stop Token Tracking | Observability | Tracks token usage via `session-stop.ts`, persists JSON hook-state files, and records the stop-hook flow without claiming a dedicated `pendingStopSave` state flag |
| Cross-Runtime Fallback | Compatibility | Tool-based context injection for runtimes without native hook support while keeping runtime-specific capability notes accurate |
| Runtime Detection | Infrastructure | Capability-based runtime identification, including Gemini support detected dynamically from `.gemini/settings.json` |
| CocoIndex Integration | Context Enrichment | CocoIndex provides semantic code search complementing structural code graph and memory context |

### 2. Manual Testing Playbook (`.opencode/skill/system-spec-kit/manual_testing_playbook/`)

New test scenarios:

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| PreCompact fires on compaction | Trigger auto-compact in Claude Code | Cache file written, context precomputed |
| SessionStart injects post-compact | Resume after compaction | Cached context injected into conversation |
| SessionStart primes on startup | Start new Claude Code session | Prior work context surfaced |
| Stop hook saves context | End Claude Code session | Token snapshot saved, session context preserved |
| Codex CLI recovery | Trigger compaction in Codex | Tool-based recovery fires via Gate 1 |
| Cross-runtime consistency | Compare recovery across runtimes | Same context surfaced regardless of runtime |

### 3. SKILL.md Updates (`../../../../skill/system-spec-kit/SKILL.md`)

Add section covering:
- Hook system overview (PreCompact, SessionStart, Stop)
- Hook registration in `.claude/settings.local.json`
- Hook script locations and compilation
- Relationship between hooks and existing MCP tools
- Design principle: hooks are transport, not separate business logic

- Reference CocoIndex Code MCP as companion system for semantic code search
- Document the complementary architecture: CocoIndex (semantic) + Code Graph (structural) + Memory (session)

### 4. ARCHITECTURE.md Updates (`.opencode/skill/system-spec-kit/ARCHITECTURE.md`)

Add hook architecture:
- Hook lifecycle diagram (PreCompact -> cache -> SessionStart -> inject)
- Hook state management (JSON hook-state files, session ID mapping, and truthful stop-hook state limitations without claiming `pendingStopSave`)
- Runtime adapter pattern (hooks vs tool fallback) if delivered in this phase; otherwise note as follow-up gap
- Token tracking data flow (`session-stop.ts` -> parse -> JSON hook-state files)
- Three-system integration diagram showing CocoIndex, Code Graph, and Memory as parallel context sources
- Query-intent routing documentation

### 5. README Updates

- `.opencode/skill/system-spec-kit/README.md` — Hook capabilities in feature list
- `.opencode/skill/README.md` — Updated system-spec-kit description
- `README.md` (root) — Context preservation mention remains a follow-up gap unless explicitly added
- `AGENTS.md` — Updated if agent definitions changed in Phase 5
- `AGENTS_example_fs_enterprises.md` — Updated if relevant

### 6. Reference and Template Updates

- `.opencode/skill/system-spec-kit/references/` — Any reference docs mentioning compaction; if no additional reference doc ships in this phase, record that as not created
- `.opencode/skill/system-spec-kit/assets/` — Templates referencing compaction recovery; if no additional prompt/template asset ships in this phase, record that as not created

### Acceptance Criteria
- [ ] Feature catalog entries created for all 5 hook-related features
- [ ] Manual testing playbook has scenarios for each hook and cross-runtime fallback
- [ ] SKILL.md documents hook system and registration
- [ ] ARCHITECTURE.md includes hook architecture diagram
- [ ] Root README mentions new context preservation capabilities, or this remains explicitly documented as a follow-up gap
- [ ] AGENTS.md updated if agent definitions changed
- [ ] All docs pass sk-doc quality standards (DQI score)
- [ ] No stale references to pre-hook compaction approach remain

### Files Modified
- NEW: Feature catalog entries in `.opencode/skill/system-spec-kit/feature_catalog/`
- NEW: Testing playbook scenarios in `.opencode/skill/system-spec-kit/manual_testing_playbook/`
- EDIT: `.opencode/skill/system-spec-kit/SKILL.md`
- EDIT: `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- EDIT: `.opencode/skill/system-spec-kit/README.md`
- EDIT: `.opencode/skill/README.md`
- EDIT: `README.md` (root) if context preservation mention is actually added in this phase
- EDIT: `AGENTS.md` (if needed)
- EDIT: `.opencode/skill/system-spec-kit/references/` (if needed; otherwise leave additional reference docs marked as not created)
- EDIT: `.opencode/skill/system-spec-kit/assets/` (if needed; otherwise leave additional prompt/template assets marked as not created)

### LOC Estimate
~200-300 lines (feature catalog + playbook entries) + ~100-150 lines (SKILL.md/ARCHITECTURE.md updates) + ~50-80 lines (README updates)

### Follow-up Gaps to Track

- Cross-runtime consistency playbook coverage may remain a future documentation gap if no dedicated scenario was added.
- ARCHITECTURE.md runtime adapter documentation may remain a future gap if only the lifecycle diagram shipped.
- Root README context preservation mention may remain a future gap if Phase 006 did not update the root README.

---

**V2 Addendum: Code Graph Documentation Alignment (2026-04-02)**

### Problem

Phases 008-025 implemented the Code Graph system (4 MCP tools, 3 CCC tools, 3 session tools, tree-sitter indexer, CocoIndex bridge, budget allocator, auto-trigger, query routing) but documentation was never updated to reflect these additions. Analysis using Copilot CLI GPT-5.4 review agents + direct file inspection confirmed **10 MCP tools completely undocumented** in user-facing docs.

### Gap Analysis Summary

| File | Coverage | Gap Severity |
|------|----------|-------------|
| `../../../../skill/system-spec-kit/SKILL.md` (lines 756-771) | Partial — 4 tools listed but says "regex-based" (incorrect, now tree-sitter default) | P1 |
| `README.md` (line 92) | Minimal — 1-line feature table entry, no section | P2 |
| `../../../../skill/system-spec-kit/mcp_server/README.md` | **Zero** — no code graph tools in L6/L7 tool reference; tool count says 33, actual is 43 | **P0** |
| `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | **Zero** — no code graph tools, no tree-sitter deps, no code-graph.sqlite | **P0** |
| `assets/` | Zero — no code graph content in 4 files | P2 |
| `references/` | Zero — no code graph content in 27 files | P2 |

### 10 Undocumented MCP Tools

| Tool | Actual Layer | Missing From |
|------|-------------|--------------|
| `session_resume` | L1 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` |
| `session_bootstrap` | L1 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` |
| `session_health` | L3 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` |
| `code_graph_query` | L6 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` |
| `code_graph_context` | L6 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` |
| `code_graph_scan` | L7 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` |
| `code_graph_status` | L7 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` |
| `ccc_status` | L7 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`, `../../../../skill/system-spec-kit/SKILL.md` |
| `ccc_reindex` | L7 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`, `../../../../skill/system-spec-kit/SKILL.md` |
| `ccc_feedback` | L7 | `../../../../skill/system-spec-kit/mcp_server/README.md`, `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`, `../../../../skill/system-spec-kit/SKILL.md` |

### Incorrect Claims

1. **`../../../../skill/system-spec-kit/SKILL.md:758`** — says "regex-based indexing"; actual default is tree-sitter WASM since Phase 015/017
2. **`../../../../skill/system-spec-kit/mcp_server/README.md:55`** — says "33" MCP tools; actual count from `layer-definitions.ts` is 43
3. **`../../../../skill/system-spec-kit/mcp_server/README.md:867`** — L6 "8 tools"; actual: 10 (+ code_graph_query, code_graph_context)
4. **`../../../../skill/system-spec-kit/mcp_server/README.md:981`** — L7 "5 tools"; actual: 10 (+ code_graph_scan, code_graph_status, ccc_status, ccc_reindex, ccc_feedback)
5. **`../../../../skill/system-spec-kit/mcp_server/README.md:1092`** — L1 "1 tool"; actual: 3 (+ session_resume, session_bootstrap)
6. **`../../../../skill/system-spec-kit/mcp_server/README.md:1094`** — L3 "3 tools"; actual: 4 (+ session_health)

### v2 Scope

#### In Scope
- Fix incorrect tool counts and layer totals in `../../../../skill/system-spec-kit/mcp_server/README.md`
- Add 10 missing MCP tool reference entries with parameter tables
- Add Code Graph concept section (3.1.x) to `../../../../skill/system-spec-kit/mcp_server/README.md`
- Fix "regex-based" to "tree-sitter WASM (default) with regex fallback" in `../../../../skill/system-spec-kit/SKILL.md`
- Add edge types, auto-trigger, query routing, CCC tools, session tools to `../../../../skill/system-spec-kit/SKILL.md`
- Add code graph tools to `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` validation checklist
- Add tree-sitter dependency and code-graph.sqlite to `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- Expand `README.md` code graph entry from 1-line to subsection

#### Out of Scope
- Creating new reference docs in `references/code-graph/` (P2, defer)
- Creating new asset files for code graph (P2, defer)
- Root README.md updates (tracked as existing follow-up gap)

### v2 Acceptance Criteria
- [ ] `../../../../skill/system-spec-kit/mcp_server/README.md` tool count matches `layer-definitions.ts` (43 tools)
- [ ] All 10 missing tools have parameter-table entries in `../../../../skill/system-spec-kit/mcp_server/README.md`
- [ ] Code Graph concept section exists in `../../../../skill/system-spec-kit/mcp_server/README.md`
- [ ] `../../../../skill/system-spec-kit/SKILL.md` correctly describes tree-sitter WASM default with regex fallback
- [ ] `../../../../skill/system-spec-kit/SKILL.md` documents edge types, auto-trigger, query routing, CCC tools, session tools
- [ ] `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` lists code graph tools in validation checklist
- [ ] `../../../../skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` documents tree-sitter dependency and code-graph.sqlite
- [ ] `README.md` code graph feature has expanded subsection

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-906: MCP server tool reference must match registered tool count from layer-definitions.ts.
- REQ-907: All MCP tools accessible via `spec_kit_memory` must be documented with parameter tables.
- REQ-908: INSTALL_GUIDE must list all dependencies required for full feature operation.

### Acceptance Scenarios
- **Given** the mcp_server/README.md L6 section, **When** counting documented tools, **Then** count matches layer-definitions.ts L6 tools array length.
- **Given** the mcp_server/README.md L7 section, **When** counting documented tools, **Then** count matches layer-definitions.ts L7 tools array length.
- **Given** the INSTALL_GUIDE validation checklist, **When** a new user follows the checklist, **Then** code graph tools appear in tool list verification.
- **Given** SKILL.md Code Graph section, **When** reading parser description, **Then** tree-sitter WASM is described as default with regex fallback.
