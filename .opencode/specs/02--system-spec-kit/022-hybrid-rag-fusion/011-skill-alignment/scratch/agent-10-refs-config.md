# Agent 10: References/Config & Cross-Cutting Gap Analysis

**Source:** `system-spec-kit/references/config/environment_variables.md` and `system-spec-kit/SKILL.md`
**Verification date:** 2026-03-14
**Analyst:** Leaf agent (Depth 1)

---

## environment_variables.md Gaps

### 1. Missing runtime flag: `SPECKIT_GRAPH_UNIFIED` (P1)

`SPECKIT_GRAPH_UNIFIED` is a live runtime flag used in `mcp_server/core/db-state.ts` and `mcp_server/lib/search/graph-flags.ts` with `!== 'false'` semantics (default ON). The env vars doc notes the Hydra variant `SPECKIT_HYDRA_GRAPH_UNIFIED` (OFF, metadata only) and explicitly calls out that it is "distinct from runtime `SPECKIT_GRAPH_UNIFIED`" — but the runtime flag itself has no entry in the reference doc. Omitting an active default-ON flag from the env var reference is a documentation gap that will cause operator confusion.

- **Missing entry to add:** `SPECKIT_GRAPH_UNIFIED` | ON | Gates unified graph search channel in hybrid pipeline (set `false` to disable)

### 2. `MCP_CHARS_PER_TOKEN` description inconsistency with SKILL.md (P2)

The env var doc correctly documents `MCP_CHARS_PER_TOKEN` with default `4`. However, SKILL.md states token budgets are "enforced via `chars/3.5` approximation" — a stale value that contradicts both `environment_variables.md` and the source code (`lib/validation/preflight.ts:189` defaults to `parseFloat(process.env.MCP_CHARS_PER_TOKEN || '4')`). No fix needed in `environment_variables.md` — it is correct. The fix belongs in SKILL.md (see SKILL.md stale data section below).

### 3. Section 8.1 `SPEC_KIT_ENABLE_CAUSAL` flag inconsistency with runtime (P2)

`SPEC_KIT_ENABLE_CAUSAL` is listed with default `false` (experimental). The causal graph is now fully operational with 4 handler files and 4 registered MCP tools (`memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`). The `false` default may be intentional as an opt-in control, but the description "experimental — maps decision dependencies" no longer reflects the current shipped state. Recommend updating the description to clarify this is a manual opt-in, not an unfinished feature.

### 4. Section 8.2 completeness: All Wave 1 P0 flags are present (PASS)

The four flags called out in the Wave 1 findings are all confirmed present in `environment_variables.md` §8.2:
- `SPECKIT_QUALITY_LOOP` — present (OFF, S7, Observability & Evaluation section)
- `SPECKIT_DOCSCORE_AGGREGATION` — present (ON, S3, Scoring & Feedback section)
- `SPECKIT_CONSOLIDATION` — present (ON, S4, Cognitive & Graph section)
- `SPECKIT_ABLATION` — present (OFF, S7, Observability & Evaluation section)

Wave 1 findings for missing flags in `environment_variables.md` are **not reproduced here**; all four flags are documented correctly. The original P0 finding likely referenced SKILL.md's abbreviated 10-flag table, not the full env vars doc.

### 5. Section 8.2 Hydra flags complete (PASS)

All 6 `SPECKIT_HYDRA_*` flags are documented correctly with OFF defaults and Sprint S7 attribution.

---

## SKILL.md Stale Data Inventory

| # | Claim | Location (line) | Current (SKILL.md) | Actual / Expected | Priority |
|---|-------|-----------------|-------------------|------------------|---------|
| 1 | Server LOC | Line 512: "~682 lines" | ~682 | 1073 (confirmed via `wc -l`) | P0 |
| 2 | Handler files count | Line 512: "12 handler files" | 12 | 30 `.ts` files at depth 1 in `handlers/`; 40 total including `save/` subdirectory | P0 |
| 3 | Lib subdirectories | Line 512: "20 lib subdirectories" | 20 | 26 directories under `mcp_server/lib/` (confirmed via `find -maxdepth 1 -type d`) | P0 |
| 4 | MCP tool count | Line 512 & 514: "25 MCP tools" and "8 most-used of 25 total" | 25 | 31 (confirmed via `tool-schemas.ts`: 31 `name:` entries) | P0 |
| 5 | Schema version | Line ~556 (Key Concepts, no explicit mention) | v13 implied by surrounding text | SCHEMA_VERSION = 22 (confirmed in `vector-index-schema.ts:141`) | P0 |
| 6 | Token approximation ratio | Line 588: "enforced via `chars/3.5` approximation" | chars/3.5 | chars/4 (MCP_CHARS_PER_TOKEN default = 4 per `environment_variables.md` §4 and `preflight.ts:189`) | P1 |
| 7 | Document type list | Line 554: lists "research (1.1x)" | research included | `research` is NOT in `DOCUMENT_TYPE_MULTIPLIERS`; `scratch (0.6x)` IS in source but NOT listed in SKILL.md | P1 |
| 8 | Feature flag table count | Lines 572–585: 10 flags shown | 10 flags | 10-flag table is accurate as a curated subset, but the inline note says "10 feature flags" as if exhaustive; `environment_variables.md` documents 86 total flag entries | P2 (framing issue) |
| 9 | Shared-space tools absent from layer map | Layer-definition tool tables (L1–L7) | Not listed | `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status` are registered tools (tool-schemas.ts) but not assigned to any layer in `LAYER_DEFINITIONS` in `layer-definitions.ts` nor mentioned in SKILL.md layer tool table | P1 |
| 10 | Template LOC: Level 1 | Line 349: "~455 LOC" | ~455 | 533 lines (actual `templates/level_1/` total) | P2 |
| 11 | Template LOC: Level 2 | Line 350: "~875 LOC" | ~875 | 769 lines (actual `templates/level_2/` total) | P2 |
| 12 | Template LOC: Level 3 | Line 352: "~1090 LOC" | ~1090 | 1093 lines (actual; close, within margin) | P2 (borderline) |
| 13 | Template LOC: Level 3+ | Line 354: "~1075 LOC" | ~1075 | 1193 lines (actual `templates/level_3+/` total) | P2 |
| 14 | Token budgets per layer | Line 588 | L1:2000, L2:1500, L3:800, L4:500, L5:600, L6:1200, L7:1000 | Confirmed correct vs `layer-definitions.ts` | PASS |
| 15 | Server version | Line 512 (implicit via "v1.7.2") | v1.7.2 | v1.7.2 (confirmed in `context-server.ts:255`) | PASS |
| 16 | Artifact routing classes | Line 563: "9 artifact classes" | 9 | 9 (confirmed: spec, plan, tasks, checklist, decision-record, implementation-summary, memory, research, unknown) | PASS |
| 17 | memory_context mode token budgets | Lines 532–536: quick:800, deep:2000, focused:1500, resume:1200 | Matches source | Confirmed correct vs `memory-context.ts:406-430` | PASS |
| 18 | 7-layer architecture | Line 512 | 7 layers | Confirmed: L1–L7 in `layer-definitions.ts` | PASS |
| 19 | External Dependencies table: "MCP (~682 lines)" | Line 781 | ~682 | 1073 (same root claim as item 1; duplicated in External Dependencies table) | P0 |

---

## Cross-Reference Validity

All markdown cross-references in SKILL.md were checked. All resolve to existing files:

| Reference | Status |
|-----------|--------|
| `references/workflows/quick_reference.md` | OK |
| `references/templates/level_specifications.md` | OK |
| `references/templates/template_guide.md` | OK |
| `scripts/README.md` | OK |
| `references/memory/save_workflow.md` | OK |
| `references/memory/memory_system.md` | OK |
| `references/memory/epistemic_vectors.md` | OK |
| `references/structure/sub_folder_versioning.md` | OK |
| `references/validation/validation_rules.md` | OK |
| `references/structure/phase_definitions.md` | OK |
| `references/validation/phase_checklists.md` | OK |
| `references/debugging/troubleshooting.md` | OK |
| `mcp_server/lib/search/README.md` | OK |
| `templates/level_1/` through `level_3+/` | OK |
| `constitutional/` | OK |
| `.opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py` | OK |

**One path notation inconsistency (P2):**
The External Dependencies table (line 780) lists "Memory gen: `scripts/memory/generate-context.ts → scripts/dist/`". The source file `scripts/memory/generate-context.ts` exists, but the arrow notation implies it compiles to `scripts/dist/` — which is correct. The notation is accurate but could be clearer: the runtime invocation uses `scripts/dist/memory/generate-context.js` (as stated in SKILL.md §3 Context Preservation section). No broken link; notation only.

---

## Recommendations

### P0 Fixes (must correct before release)

1. **SKILL.md line 512 server shape:** Update the server description sentence to: `context-server.ts (~1073 lines) with 40 handler files (depth-2 including save/), 26 lib subdirectories, and 31 MCP tools across 7 layers.`

2. **SKILL.md line 514:** Change `"8 most-used of 25 total"` to `"8 most-used of 31 total"`.

3. **SKILL.md line 781 External Dependencies:** Change `"Spec Kit Memory MCP (~682 lines)"` to `"Spec Kit Memory MCP (~1073 lines)"`.

4. **Schema version:** Add or update any reference to "schema v13" in SKILL.md Key Concepts to note that the current schema version is v22 (v13 introduced `document_type` and `spec_level`; migrations have continued to v22).

### P1 Fixes

5. **SKILL.md line 588 chars/token:** Change `"enforced via \`chars/3.5\` approximation"` to `"enforced via \`chars/4\` approximation (MCP_CHARS_PER_TOKEN default)"`.

6. **SKILL.md line 554 document type list:** Remove `research (1.1x)` (not in `DOCUMENT_TYPE_MULTIPLIERS`) and add `scratch (0.6x)` (is in source). Updated list: spec (1.4x), plan (1.3x), constitutional (2.0x), decision_record (1.4x), tasks (1.1x), implementation_summary (1.1x), checklist (1.0x), handover (1.0x), memory (1.0x), scratch (0.6x).

7. **SKILL.md layer tool table:** The three shared-space tools (`shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`) exist in `tool-schemas.ts` but are not assigned to any layer in `layer-definitions.ts` nor listed in the SKILL.md layer table. Either assign them to L5 or L7 in both places, or add a note that they are ungated utility tools outside the 7-layer progression.

8. **environment_variables.md:** Add `SPECKIT_GRAPH_UNIFIED` entry to §8.2 Search & Ranking table: `ON | — | Gates unified graph search channel in hybrid pipeline (set false to disable)`.

### P2 Fixes

9. **Template LOC estimates:** Update the progressive-enhancement diagram in SKILL.md to reflect actual template sizes: Level 1 ~533 LOC, Level 2 ~769 LOC, Level 3 ~1093 LOC, Level 3+ ~1193 LOC. Same update needed in `references/templates/level_specifications.md` which mirrors these numbers.

10. **SKILL.md Feature Flag framing:** The 10-flag table is a curated subset. Add a note: "See [environment_variables.md](./references/config/environment_variables.md) §8 for the full graduated feature flag set (86 entries)."

11. **environment_variables.md `SPEC_KIT_ENABLE_CAUSAL` description:** Update from "experimental - maps decision dependencies" to clarify it is opt-in but the causal graph subsystem is fully shipped (4 MCP tools registered).
