# README Staleness Audit Report — Specs 136-139

> **Audit Date:** 2026-02-21
> **Scope:** 85 project-relevant READMEs + 3 agent definition files
> **Method:** 20 haiku explore agents across 4 waves + 3 verification agents
> **Spec Folder:** `specs/02--system-spec-kit/022-hybrid-rag-fusion/`

---

## Authoritative Resolutions (from source code)

### Tool Count — RESOLVED

| Claim | Source | Verdict |
|-------|--------|---------|
| "25 tools" | `mcp_server/README.md:94` | **CORRECT** (memory tools only) |
| "22 tools" | `handlers/README.md:39`, root `README.md` | **STALE** → should be 25 |
| "29 total (22+7)" | `.opencode/README.md:55` | **STALE** → should be 32 (25 memory + 7 code mode) |

**Source of truth:** `tool-schemas.ts` — 25 tool definitions in `TOOL_DEFINITIONS` array.

**All 25 memory tools:**
L1: memory_context | L2: memory_search, memory_match_triggers, memory_save | L3: memory_list, memory_stats, memory_health | L4: memory_delete, memory_update, memory_validate, memory_bulk_delete | L5: checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete | L6: task_preflight, task_postflight, memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink, memory_skill_graph_query, memory_skill_graph_invalidate | L7: memory_index_scan, memory_get_learning_history

**Code Mode tools (7):** register_manual, deregister_manual, search_tools, list_tools, get_required_keys_for_tool, tool_info, call_tool_chain

### Channel Count — RESOLVED

| Claim | Source | Verdict |
|-------|--------|---------|
| "6-channel" | `mcp_server/README.md:63,81` | **INACCURATE** — conflates channels with boosts |
| "4-channel" | Plan, `hybrid-search.ts` | **CORRECT** |
| "triple-hybrid" | `search/README.md:37` | **STALE** — pre-spec-138 |

**4 PRIMARY channels** (independent retrieval, `hybrid-search.ts:286-338`):
1. **Vector** — Semantic similarity via embeddings (sqlite-vec)
2. **FTS5** — Full-text search with BM25 column weighting
3. **BM25** — Lexical BM25 ranking from dedicated index
4. **Graph** — Causal edges + Skill Graph traversal

**Post-fusion enhancements** (NOT channels):
- RRF Fusion, Adaptive Weight Tuning, MMR Diversity Reranking, Co-activation Spreading, Recency Boost

**Correct description:** "4-channel hybrid search with adaptive RRF fusion, MMR diversity reranking, and co-activation enrichment"

### Feature Flag Count — RESOLVED

| Claim | Source | Verdict |
|-------|--------|---------|
| "16 feature flags" | `mcp_server/README.md:98` | **PARTIALLY CORRECT** — 16 primary documented flags |
| 13 listed | Config section (lines 650-665) | **INCOMPLETE** — missing 3 from own claim |
| 43 total | Full codebase grep | **ACTUAL** total including cognitive, validation, experimental |

**16 primary flags are defensible** but README should clarify "16 primary" vs ~43 total. The config section listing only 13 should be updated to list all 16 primary flags.

### Schema Version — RESOLVED

- **Current:** v15 (v16 columns exist for chunking, downgrade path v16→v15 confirmed)
- `.opencode/README.md:45` says "v13" → **STALE**

### Skill Count — RESOLVED

- **Current:** 10 skills (including `sk-doc-visual`)
- Multiple files say "9" → **STALE**

---

## Prioritized Fix List

### HIGH Severity — Wrong Information (must fix)

| # | File | Line(s) | Issue | Fix |
|---|------|---------|-------|-----|
| H1 | `.opencode/README.md` | 45 | Schema "v13" | → "v15" |
| H2 | `.opencode/README.md` | 55 | "29 total (22 memory + 7 code mode)" | → "32 total (25 memory + 7 code mode)" |
| H3 | `.opencode/README.md` | 57 | "Skills: 9" | → "Skills: 10" |
| H4 | `mcp_server/README.md` | 63,81 | "6-channel hybrid search" | → "4-channel hybrid search" + clarify post-fusion enhancements |
| H5 | `mcp_server/README.md` | 95 | "Handler Modules: 20" | → "Handler Modules: 19" (verified) |
| H6 | `mcp_server/README.md` | 98 | "16 flags" but config section lists 13 | List all 16 primary flags in config section |
| H7 | `handlers/README.md` | 39 | "22 tools" | → "25 tools" |
| H8 | `search/README.md` | 37 | "Triple-Hybrid Search" | → "4-Channel Hybrid Search" |
| H9 | `search/README.md` | 42,285,300-301 | Schema version stops at v14 | → Add v15 |
| H10 | `install_guides/README.md` | 17 | "9 native skills" | → "10 native skills" |
| H11 | `install_guides/README.md` | 366 | "NATIVE SKILLS: 9" | → "10" |
| H12 | `install_guides/README.md` | 810 | "Current Skills (9 total)" | → "(10 total)" |
| H13 | `install_guides/README.md` | 975 | "Skills directory exists with 9 skills" | → "10 skills" |
| H14 | `install_guides/README.md` | 1408 | "Skill definitions (9 skills)" | → "(10 skills)" |
| H15 | `install_guides/README.md` | 1419 | Skills table lists 9, missing sk-doc-visual | Add sk-doc-visual |
| H16 | `root README.md` | 219 | "22 MCP tools" | → "25 MCP tools" |
| H17 | `root README.md` | 146,504 | "9 skills" / "9 domain skills" | → "10" |
| H18 | `sk-doc/README.md` | 37 | HVR ref: "readme_template.md §9" | → "hvr_rules.md" |
| H19 | `sk-doc/README.md` | 204 | HVR ref: "readme_template.md §9" | → "hvr_rules.md" |
| H20 | `cognitive/README.md` | 94 | Tool count context unclear | Clarify "25 memory tools" vs total |
| H21 | `scripts/spec/README.md` | 42,45,62 | Only references "SPEC124/128/129", missing --phase, --recursive flags | Add spec 136-139 references, document --phase and --recursive |

**Estimated LOC for HIGH fixes:** ~60-80 lines (mostly search-and-replace number changes)

### MEDIUM Severity — Missing New Features (should fix)

| # | File | Missing Feature | Spec |
|---|------|----------------|------|
| M1 | `templates/README.md` | Phase system completely absent | 139 |
| M2 | `templates/addendum/README.md` | Phase addendum undocumented (files exist) | 139 |
| M3 | `templates/level_1-3+/README.md` (4 files) | No phase guidance, no Gate 3 Option E | 139 |
| M4 | `.opencode/README.md` | Phase system not mentioned anywhere | 139 |
| M5 | `search/README.md` | No SGQS, no Skill Graph channel, no MMR, no Evidence Gap Detection | 138 |
| M6 | `scoring/README.md` | Missing event-based decay, HVR integration, phase scoring | 136-139 |
| M7 | `session/README.md` | No phase awareness documented | 139 |
| M8 | `cognitive/README.md` | Missing event-based decay model (replaced time-based) | 136 |
| M9 | `cognitive/README.md` | Missing 4 feature flags: SESSION_BOOST, PRESSURE_POLICY, EXTRACTION, REDACTION_GATE | 136 |
| M10 | `cognitive/README.md` | Missing session-attention boost, pressure-aware mode, PII redaction, extraction pipeline | 136 |
| M11 | `storage/README.md` | Missing schema v15, skill graph storage docs | 138 |
| M12 | `extraction/README.md` | Missing SPECKIT_EXTRACTION, SPECKIT_REDACTION_GATE flags | 136 |
| M13 | `validation/README.md` | Missing recursive phase validation | 139 |
| M14 | `tools/README.md` | SGQS tool dispatch not documented | 138 |
| M15 | `mcp_server/README.md` | Missing specs 137, 139, 140 references | 137-140 |
| M16 | `scripts/README.md` | Spec references stop at 129, missing SGQS, phase | 138-139 |
| M17 | `scripts/memory/README.md` | Missing graph-enrichment.ts purpose, subfolder/phase context | 136,139 |
| M18 | `scripts/lib/README.md` | Missing session-boost.ts, pressure-monitor.ts, causal-boost.ts | 136-138 |
| M19 | `scripts/core/README.md` | Incomplete module inventory | 136-139 |
| M20 | `scripts/extractors/README.md` | Missing extraction-adapter.ts, redaction pipeline | 136 |
| M21 | `scripts/loaders/README.md` | Missing skill-graph-aware data loading | 138 |
| M22 | `scripts/renderers/README.md` | Missing HVR template integration, SGQS rendering | 137-138 |
| M23 | `scripts/rules/README.md` | PHASE_LINKS rule listed but not explained | 139 |
| M24 | `config/README.md` | Subsystem list outdated, missing spec 138-139 features | 138-139 |
| M25 | `env_variables.md` | Feature flags incomplete (13/16 primary, 27+ undocumented) | 136-138 |
| M26 | `shared/README.md` | Missing adaptive fusion, 7 intent profiles | 138 |
| M27 | `.claude/agents/context.md` | Describes "semantic vector search" only | 138 |
| M28 | `.claude/agents/speckit.md` | Missing phase workflow, --phase mode | 139 |
| M29 | `.claude/agents/research.md` | No SGQS skill graph traversal capability | 138 |
| M30 | `sk-doc/README.md` | Missing hvr_rules.md as asset in Structure section | 137 |
| M31 | `memory/README.md` (templates) | Missing subfolder syntax for phase structures | 138-139 |

**Estimated LOC for MEDIUM fixes:** ~200-400 lines (new sections + feature descriptions needed)

### LOW Severity — Cosmetic / Informational

| # | File | Issue |
|---|------|-------|
| L1 | `cognitive/README.md` | Version shows 1.8.0 — verify against package.json |
| L2 | `learning/README.md` | Only 224 lines vs cognitive's 1054 — underdocumented |
| L3 | `cache/README.md` | No search-channel integration mentioned |
| L4 | `scripts/utils/README.md` | Last updated 2026-02-07 (pre-specs 136-139) |
| L5 | `scripts/evals/` | Directory exists, no README |
| L6 | `scripts/kpi/` | Directory exists, not documented |
| L7 | `spec-folder/README.md` | No phase-aware spec folder detection |
| L8 | `constitutional/README.md` | No spec 136/139 enhancement references |
| L9 | `sk-git/README.md` | No mention of skill decomposition (spec 138) |
| L10 | `scripts/README.md` | No explicit skill count statement |
| L11 | Template examples | No phase-decomposed spec folder example |
| L12 | `mcp_server/README.md` | Architecture diagram oversimplified (9 of 19 handlers shown) |

**Estimated LOC for LOW fixes:** ~50-100 lines

---

## Files Confirmed Current (No Action Needed)

| File | Status | Notes |
|------|--------|-------|
| `.opencode/skill/system-spec-kit/README.md` | CURRENT | References spec 138 correctly |
| `mcp_server/lib/cognitive/README.md` | MOSTLY CURRENT | Minor gaps (M8-M10) |
| `mcp-chrome-devtools/README.md` | CURRENT | No memory refs |
| `mcp-chrome-devtools/examples/README.md` | CURRENT | No memory refs |
| `mcp-code-mode/README.md` | CURRENT | Correctly isolates from spec-kit |
| `mcp-figma/README.md` | CURRENT | No memory refs |
| `sk-code--full-stack/README.md` | CURRENT | No stale cross-refs |
| `sk-code--opencode/README.md` | CURRENT | No stale refs |
| `sk-code--web/README.md` | CURRENT | No stale refs |
| `templates/scratch/README.md` | CURRENT | Accurate |
| `install_guides/install_scripts/README.md` | CURRENT | No stale refs |

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Total files audited** | ~88 (85 READMEs + 3 agent defs) |
| **Files with issues** | ~40 |
| **Files current / no issues** | ~48 |
| **HIGH severity issues** | 21 |
| **MEDIUM severity issues** | 31 |
| **LOW severity issues** | 12 |
| **Total issues** | 64 |
| **Estimated total fix LOC** | 310-580 lines |

---

## Recommended Fix Strategy

### Batch 1: Quick Number Fixes (30 min, ~40 LOC)
All HIGH issues that are simple search-and-replace:
- "9 skills" → "10 skills" (8 occurrences across 3 files)
- "22 tools" → "25 tools" (3 occurrences across 2 files)
- "29 total" → "32 total" (1 occurrence)
- "v13" → "v15" (1 occurrence)
- "Triple-Hybrid" → "4-Channel Hybrid" (1 occurrence)
- "6-channel" → "4-channel" (2 occurrences)
- "Handler Modules: 20" → "19" (1 occurrence)
- HVR ref fixes in sk-doc (2 occurrences)

### Batch 2: Feature Flag & Config Updates (1 hr, ~80 LOC)
- Update mcp_server/README.md config section to list all 16 primary flags
- Update environment_variables.md to match
- Add missing flags to documentation

### Batch 3: Phase System Documentation (2 hr, ~150 LOC)
- Add phase system sections to templates/README.md
- Add phase row to addendum/README.md composition model
- Add Gate 3 Option E guidance to level READMEs
- Update scripts/spec/README.md with --phase, --recursive flags
- Update agent definition files

### Batch 4: Architecture Updates (2 hr, ~200 LOC)
- Rewrite search/README.md architecture section (4-channel + SGQS + MMR)
- Add SGQS to handlers/tools docs
- Update cognitive/README.md with event-based decay model
- Add extraction pipeline to extraction/README.md
- Update .claude/agents/context.md with hybrid search description

### Batch 5: Low Priority (1 hr, ~100 LOC)
- All LOW severity items
- Cross-reference improvements
- Missing README files for evals/ and kpi/

---

## Cross-Reference: Issues by Spec

### Spec 136 (MCP Working Memory + Hybrid RAG)
- Event-based decay model undocumented in cognitive/README.md
- 4 new env vars (SESSION_BOOST, PRESSURE_POLICY, EXTRACTION, REDACTION_GATE) missing from multiple READMEs
- Extraction pipeline undocumented
- PII redaction gate undocumented

### Spec 137 (Human Voice Rules)
- sk-doc/README.md has stale HVR reference (HIGH)
- Template label changes not reflected in template READMEs
- hvr_rules.md asset not documented in Structure sections

### Spec 138 (Hybrid RAG Fusion + Skill Graph)
- "6-channel" → "4-channel" (HIGH)
- Tool count 22 → 25 (HIGH)
- SGQS missing from search/handlers/tools docs
- Skill Graph as retrieval channel undocumented
- Evidence Gap Detection missing
- MMR diversity missing from search docs

### Spec 139 (Phase System)
- Phase system completely absent from templates docs (HIGH area)
- Gate 3 Option E not in any README
- create.sh --phase undocumented
- validate.sh --recursive undocumented
- Agent definitions lack phase awareness
