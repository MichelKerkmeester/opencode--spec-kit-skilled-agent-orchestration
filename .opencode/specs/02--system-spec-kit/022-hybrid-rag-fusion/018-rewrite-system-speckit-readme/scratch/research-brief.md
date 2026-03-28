# Research Brief: System Spec Kit README Rewrite (D3)

> Compiled from primary source investigation. All citations reference files in `.opencode/skill/system-spec-kit/` unless otherwise noted.

---

## 1. Skill Overview

**Name:** `system-spec-kit`
**Version:** 2.2.26.0
**Description:** Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications.

[SOURCE: SKILL.md:1-6]

### Purpose

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.

[SOURCE: SKILL.md:10-12]

### Key Capabilities (Post Spec 138)

| Capability | Description |
|---|---|
| Hybrid Search + Post-Fusion | Scatter-gather across vector, FTS5/BM25, graph and degree channels with co-activation/session/causal signals applied post-fusion |
| Adaptive RRF Fusion | Intent-weighted profiles replace fixed-weight RRF |
| Degree Channel + Co-Activation | 5th RRF channel with typed-weighted degree scoring |
| Embedding Cache | Persistent SQLite cache with LRU eviction |
| Query Complexity Routing | Routes simple/moderate/complex queries to optimal pipeline |
| Interference Scoring | Penalizes high-similarity near-duplicates |
| Classification Decay | Tier-based and context-type stability multipliers for FSRS |
| Confidence Truncation | 2x median gap detection for low-confidence tail removal |
| Dynamic Token Budget | Tier-aware budgets (1500/2500/4000) |
| Causal Lineage Insights | Decision lineage tracing for "why" queries |
| MMR Diversity Reranking | Lambda mapped to detected intent |
| Evidence Gap Detection | TRM with Z-score confidence |
| Multi-Query RAG Fusion | Query expansion with domain vocabulary |
| FSRS Spaced Repetition | Power-law decay validated on 100M+ users |
| Semantic Memory | Voyage AI 1024d embeddings in sqlite-vec |
| Spec Folder Documentation | Levels 1-3+ with CORE + ADDENDUM v2.2 |

[SOURCE: README.md:77-99]

### Activation Triggers

Mandatory for ALL file modifications: code files, documentation, configuration, templates, knowledge base, build/tooling files. Triggered by keywords: add, implement, fix, update, create, modify, rename, delete, configure, analyze.

[SOURCE: SKILL.md:29-55]

### Agent Exclusivity

`@speckit` is the ONLY agent permitted to create or write spec folder documentation (`*.md`). Exceptions: `memory/` (generate-context.js), `scratch/` (any agent), `handover.md` (@handover), `research/research.md` (@research), `debug-delegation.md` (@debug).

[SOURCE: SKILL.md:60-70]

### Cross-Skill Alignment

- All code created/updated must align with `sk-code--opencode`
- All documentation created/updated must align with `sk-doc`

[SOURCE: README.md:57-58]

### Requirements

| Requirement | Minimum |
|---|---|
| Node.js | 18+ |
| TypeScript | 5.0+ |
| OpenCode | 1.0.190+ |
| Bash | 4.0+ |

[SOURCE: README.md:117-123]

---

## 2. Component Inventory

### Top-Level Directory Structure

```
.opencode/skill/system-spec-kit/
+-- SKILL.md                    # AI workflow instructions (788 lines)
+-- README.md                   # Human-oriented documentation (873 lines, this rewrite target)
+-- ARCHITECTURE.md             # Boundary contract between scripts/ and mcp_server/
+-- templates/                  # Template system (CORE + ADDENDUM v2.2)
|   +-- core/                   # Foundation templates (4 files: spec, plan, tasks, impl-summary)
|   +-- addendum/               # Level-specific additions (level2-verify, level3-arch, level3plus-govern, phase)
|   +-- level_1/ - level_3+/    # Composed templates by level (pre-merged)
|   +-- context_template.md     # Memory context template
|   +-- research/research.md             # Research template
|   +-- handover.md             # Handover template
|   +-- debug-delegation.md     # Debug delegation template
+-- scripts/                    # CLI tools (TypeScript source + Bash)
|   +-- spec/                   # Spec folder management (11 scripts)
|   +-- memory/                 # Memory system scripts (8 scripts)
|   +-- templates/              # Template composition (1 script)
|   +-- core/                   # Core library (config, file-writer, memory-indexer, quality-scorer, etc.)
|   +-- extractors/             # Session data extractors (18 extractors for different capture sources)
|   +-- utils/                  # Utility modules (14 utilities)
|   +-- loaders/                # Data loading (data-loader.ts)
|   +-- renderers/              # Output rendering (template-renderer.ts)
|   +-- rules/                  # Validation rules
|   +-- tests/                  # Script test suite
|   +-- dist/                   # Compiled JavaScript output
+-- mcp_server/                 # Spec Kit Memory MCP (TypeScript source)
|   +-- context-server.ts       # MCP server entry (~682 lines, 28 tools)
|   +-- core/                   # Core initialization
|   +-- handlers/               # Tool handlers (9 functional + 2 infra)
|   +-- lib/                    # Library modules
|   |   +-- cognitive/          # FSRS, PE gating, 5-state model
|   |   +-- search/             # Vector, BM25, adaptive RRF, RSF, MMR, query classifier
|   |   +-- cache/              # Persistent embedding cache (SQLite + LRU)
|   |   +-- eval/               # Edge density measurement
|   |   +-- session/            # Deduplication, crash recovery
|   |   +-- storage/            # SQLite, causal edges, mutation ledger
|   |   +-- providers/          # Embedding providers (Voyage, OpenAI, HF local)
|   |   +-- errors/             # Recovery hints (49 codes)
|   +-- tests/                  # MCP test suite (265 vitest files)
|   +-- dist/                   # Compiled JavaScript output
|   +-- database/               # SQLite + vector search
+-- shared/                     # Shared workspace (@spec-kit/shared)
+-- references/                 # Reference documentation (19 files)
+-- assets/                     # Decision matrices, YAML configs
+-- constitutional/             # Always-surface rules (never decay)
+-- feature_catalog/            # Feature documentation (19 categories, 187+ features)
```

[SOURCE: README.md:818-851, verified against filesystem]

---

## 3. Documentation Levels

### Level Definitions (CORE + ADDENDUM v2.2)

| Level | LOC Guidance | Required Files | What It Adds | Template LOC |
|---|---|---|---|---|
| **1** | <100 | spec.md, plan.md, tasks.md, implementation-summary.md | Essential what/why/how | ~455 |
| **2** | 100-499 | Level 1 + checklist.md | Quality gates, verification, NFRs | ~875 |
| **3** | >=500 | Level 2 + decision-record.md | Architecture decisions, ADRs | ~1090 |
| **3+** | Complexity 80+ | Level 3 + extended content | Governance, approval workflow, AI protocols | ~1350 |

[SOURCE: SKILL.md:349-363, README.md:270-278]

### Override Factors

LOC is soft guidance. These can push to a higher level:
- High complexity or architectural changes
- Risk (security, config cascades, authentication)
- Multiple systems affected (>5 files)
- Integration vs unit test requirements

Decision rule: when in doubt, choose higher level.

[SOURCE: SKILL.md:375-381]

### Spec Folder Structure

```
specs/<###-feature-name>/
+-- description.json             # Spec identity + memory tracking metadata
+-- spec.md                      # Feature specification
+-- plan.md                      # Implementation plan
+-- tasks.md                     # Task breakdown
+-- checklist.md                 # QA validation (Level 2+)
+-- decision-record.md           # ADRs (Level 3+)
+-- implementation-summary.md    # Post-implementation summary
+-- memory/                      # Context preservation (via generate-context.js)
|   +-- DD-MM-YY_HH-MM__topic.md
+-- scratch/                     # Temporary files (git-ignored)
```

[SOURCE: README.md:314-326]

### Priority System (checklist.md, Level 2+)

| Priority | Meaning | Deferral Rules |
|---|---|---|
| **P0** | HARD BLOCKER | Must complete, cannot defer |
| **P1** | Required | Must complete OR user-approved deferral |
| **P2** | Optional | Can defer without approval |

[SOURCE: SKILL.md:383-398]

---

## 4. Command Suite

### Spec Kit Commands (8 commands)

| # | Command | Steps | Purpose | Source |
|---|---|---|---|---|
| 1 | `/spec_kit:complete` | 14 | Full end-to-end workflow (supports :auto, :confirm, :with-research, :auto-debug) | `.opencode/command/spec_kit/complete.md` |
| 2 | `/spec_kit:plan` | 7 | Planning only, no implementation (supports :auto, :confirm) | `.opencode/command/spec_kit/plan.md` |
| 3 | `/spec_kit:implement` | 9 | Execute pre-planned work with PREFLIGHT/POSTFLIGHT (requires existing plan.md) | `.opencode/command/spec_kit/implement.md` |
| 4 | `/spec_kit:research` | 9 | Technical investigation and documentation | `.opencode/command/spec_kit/research/research/research.md` |
| 5 | `/spec_kit:resume` | 4 | Resume previous session on existing spec folder | `.opencode/command/spec_kit/resume.md` |
| 6 | `/spec_kit:handover` | 4 | Create session handover document | `.opencode/command/spec_kit/handover.md` |
| 7 | `/spec_kit:debug` | 5 | Delegate debugging to specialized sub-agent | `.opencode/command/spec_kit/debug.md` |
| 8 | `/spec_kit:phase` | N/A | Create and manage phase decomposition for complex spec folders | `.opencode/command/spec_kit/phase.md` |

[SOURCE: README.md:543-553, command file frontmatter verified]

### Memory Commands (7 commands)

| # | Command | Purpose | Source |
|---|---|---|---|
| 1 | `/memory:save [folder]` | Save conversation context to spec folder memory/ with semantic indexing via generate-context.js | `.opencode/command/memory/save.md` |
| 2 | `/memory:context <query>` | Unified intent-aware context retrieval. Auto-detects task intent from 7 types and applies task-specific weights | `.opencode/command/memory/context.md` |
| 3 | `/memory:manage` | Database management: stats, scan, cleanup, bulk-delete, tier, triggers, validate, delete, health, checkpoint, ingest | `.opencode/command/memory/manage.md` |
| 4 | `/memory:continue` | Session recovery from crash, compaction, or timeout via resume-mode memory retrieval | `.opencode/command/memory/continue.md` |
| 5 | `/memory:learn` | Constitutional memory manager: create, list, edit, remove, budget. Manages always-surface rules with 3.0x boost | `.opencode/command/memory/learn.md` |
| 6 | `/memory:analyze` | Analysis and evaluation: preflight, postflight, causal graph, ablation, dashboard, learning history | `.opencode/command/memory/analyze.md` |
| 7 | `/memory:shared` | Shared-memory space lifecycle: create spaces, manage memberships, inspect rollout status | `.opencode/command/memory/shared.md` |

[SOURCE: command file frontmatter verified directly]

### Mode Suffixes (apply to spec_kit commands)

| Suffix | Behavior |
|---|---|
| `:auto` | Execute without approval gates |
| `:confirm` | Pause at each step for approval |
| `:with-research` | Dispatch @research before verification (`/spec_kit:complete` only) |
| `:auto-debug` | Auto-dispatch @debug on 3+ failures (`/spec_kit:complete` only) |

[SOURCE: README.md:566-572]

**NOTE:** The current README says "13 (8 spec_kit + 5 memory)" but the actual count is **15 total (8 spec_kit + 7 memory)** since `/memory:analyze` and `/memory:shared` exist as separate command files. The "By The Numbers" table should be updated.

---

## 5. Template Architecture

### CORE + ADDENDUM v2.2

The template system uses a composition architecture where each level inherits from lower levels:

```
Level 1:  [CORE templates only]        -> 4 files, ~455 LOC
Level 2:  [CORE] + [L2-VERIFY]         -> 6 files, ~875 LOC  (adds checklist.md, extended plan/spec)
Level 3:  [CORE] + [L2] + [L3-ARCH]    -> 7 files, ~1090 LOC (adds decision-record.md)
Level 3+: [CORE] + [all addendums]     -> 7 files, ~1350 LOC (adds governance extensions)
```

[SOURCE: README.md:270-278]

### Core Templates (`templates/core/`)

| File | Purpose |
|---|---|
| `spec-core.md` | Foundation specification template |
| `plan-core.md` | Foundation implementation plan |
| `tasks-core.md` | Foundation task breakdown |
| `impl-summary-core.md` | Foundation implementation summary |

[SOURCE: filesystem verified]

### Addendum Layers (`templates/addendum/`)

| Addendum | Level | What It Adds |
|---|---|---|
| `level2-verify/` | 2+ | Quality gates, NFRs, edge cases, checklist sections |
| `level3-arch/` | 3+ | Architecture decisions, ADRs, risk matrix |
| `level3plus-govern/` | 3+ | Enterprise governance, AI protocols, sign-offs |
| `phase/` | Any | Phase decomposition for multi-session work |

[SOURCE: filesystem verified]

### Pre-Merged Level Templates

Each `templates/level_N/` directory contains fully composed templates ready for copy:

| Level | Files |
|---|---|
| `level_1/` | spec.md, plan.md, tasks.md, implementation-summary.md (4 files) |
| `level_2/` | Above + checklist.md (5 files + README) |
| `level_3/` | Above + decision-record.md (6 files + README) |
| `level_3+/` | Same as level_3 with extended content (6 files + README) |

[SOURCE: filesystem verified]

### Utility Templates

| Template | Purpose |
|---|---|
| `context_template.md` | Memory context template (~26K, detailed session capture) |
| `research/research.md` | Comprehensive multi-domain research template (~20K) |
| `handover.md` | Session continuity document template |
| `debug-delegation.md` | Sub-agent debugging delegation template |

[SOURCE: filesystem verified]

### Template Composition

`templates/compose.sh` merges CORE + ADDENDUM inputs into the pre-merged level folders. Run after editing core or addendum templates to regenerate level folders.

[SOURCE: README.md:247-248]

---

## 6. Script Inventory

### Spec Management Scripts (`scripts/spec/`)

| Script | Purpose |
|---|---|
| `create.sh` | Create feature branch and spec folder. `--phase` creates parent + child phase folders |
| `validate.sh` | Validation orchestrator (13 rules). `--recursive` validates parent and all child phase folders |
| `calculate-completeness.sh` | Calculate spec folder completeness percentage |
| `check-placeholders.sh` | Verify zero placeholders after level upgrade |
| `check-completion.sh` | Check spec folder completion status |
| `recommend-level.sh` | Recommend documentation level with phased decomposition detection |
| `archive.sh` | Archive completed spec folders |
| `upgrade-level.sh` | Upgrade spec folder to higher level (injects addendum templates) |
| `progressive-validate.sh` | Progressive validation for spec documents |
| `test-validation.sh` | Test validation rules |

[SOURCE: filesystem verified, SKILL.md:108-113]

### Memory Scripts (`scripts/memory/`)

| Script | Purpose |
|---|---|
| `generate-context.ts` | Memory file generation (primary save workflow) |
| `backfill-frontmatter.ts` | Bulk frontmatter normalization with dry-run/apply/report modes |
| `reindex-embeddings.ts` | Force embedding refresh after metadata migrations |
| `validate-memory-quality.ts` | Validate memory file quality |
| `ast-parser.ts` | AST-level section parsing for memory files |
| `rank-memories.ts` | Memory ranking utility |
| `rebuild-auto-entities.ts` | Rebuild auto-extracted entities |
| `cleanup-orphaned-vectors.ts` | Clean up orphaned vector entries |

[SOURCE: filesystem verified]

### Template Scripts (`scripts/templates/`)

| Script | Purpose |
|---|---|
| `compose.sh` | Compose level templates from CORE + ADDENDUM inputs |

[SOURCE: filesystem verified]

### Core Library (`scripts/core/`)

| Module | Purpose |
|---|---|
| `config.ts` | Configuration management |
| `file-writer.ts` | File writing utilities |
| `memory-indexer.ts` | Memory indexing logic |
| `quality-scorer.ts` | Quality scoring for memory content |
| `subfolder-utils.ts` | Subfolder resolution and navigation |
| `topic-extractor.ts` | Topic extraction from conversation content |
| `tree-thinning.ts` | Spec folder tree thinning for consolidation |
| `workflow.ts` | Workflow orchestration |

[SOURCE: filesystem verified]

### Extractor Modules (`scripts/extractors/`)

18 extractors covering multiple CLI and session sources:

| Extractor | Purpose |
|---|---|
| `claude-code-capture.ts` | Extract from Claude Code CLI sessions |
| `codex-cli-capture.ts` | Extract from Codex CLI sessions |
| `copilot-cli-capture.ts` | Extract from Copilot CLI sessions |
| `gemini-cli-capture.ts` | Extract from Gemini CLI sessions |
| `opencode-capture.ts` | Extract from OpenCode sessions |
| `conversation-extractor.ts` | General conversation extraction |
| `decision-extractor.ts` | Decision extraction |
| `file-extractor.ts` | File modification extraction |
| `git-context-extractor.ts` | Git context extraction |
| `session-extractor.ts` | Session data extraction |
| `spec-folder-extractor.ts` | Spec folder data extraction |
| `quality-scorer.ts` | Quality scoring during extraction |
| `contamination-filter.ts` | Filter contaminated/low-quality data |
| `diagram-extractor.ts` | Diagram extraction |
| `implementation-guide-extractor.ts` | Implementation guide extraction |
| `collect-session-data.ts` | Collect session data aggregator |

[SOURCE: filesystem verified]

### Utility Modules (`scripts/utils/`)

14 utilities: data-validator, file-helpers, input-normalizer, logger, message-utils, path-utils, prompt-utils, slug-utils, spec-affinity, task-enrichment, tool-detection, validation-utils, workspace-identity.

[SOURCE: filesystem verified]

### Top-Level Scripts

| Script | Purpose |
|---|---|
| `check-api-boundary.sh` | Check API boundary enforcement between scripts/ and mcp_server/ |
| `check-links.sh` | Verify link integrity |
| `common.sh` | Shared bash utilities |
| `registry-loader.sh` | Registry loading |
| `wrap-all-templates.sh` / `.ts` | Template wrapping utility |

[SOURCE: filesystem verified]

### Additional Subdirectories

`evals/`, `kpi/`, `lib/`, `ops/`, `setup/`, `spec-folder/` (generate-description.ts), `types/`, `test-fixtures/`.

---

## 7. Feature Catalog Summary

The feature catalog documents all implemented features of the Spec Kit Memory MCP server organized into 19 content categories (plus 3 meta sections).

**Source file:** `feature_catalog/FEATURE_CATALOG.md` (344+ KB)

### Categories and Feature Counts

| # | Category | Features | Description |
|---|---|---|---|
| 1 | Overview | -- | Meta section |
| 2 | Contents | -- | Table of contents |
| 3 | Retrieval | 9 | memory_context, memory_search, memory_match_triggers, hybrid pipeline, 4-stage architecture, BM25 re-index gate, AST section retrieval, 3-tier search fallback, tool-result extraction |
| 4 | Mutation | 10 | memory_save, memory_update, memory_delete, memory_bulk_delete, memory_validate, transaction wrappers, namespace CRUD, PE save arbitration, correction tracking, per-memory history |
| 5 | Discovery | 3 | memory_list, memory_stats, memory_health |
| 6 | Maintenance | 2 | memory_index_scan, startup runtime compatibility |
| 7 | Lifecycle | 7 | checkpoint_create/list/restore/delete, async ingestion, startup pending-file recovery, automatic archival |
| 8 | Analysis | 7 | causal_link, causal_stats, causal_unlink, drift_why, task_preflight, task_postflight, learning_history |
| 9 | Evaluation | 2 | eval_run_ablation, eval_reporting_dashboard |
| 10 | Bug Fixes and Data Integrity | 11 | Graph channel ID fix, chunk collapse dedup, fan-effect divisor, SHA-256 dedup, DB/schema safety, guards, canonical ID hardening, Math overflow elimination, session-manager fixes, chunking safe swap, cleanup timestamp fix |
| 11 | Evaluation and Measurement | 16 | Eval DB, core metrics, observer effect, ceiling eval, quality proxy, synthetic corpus, BM25 baseline, agent instrumentation, scoring observability, reporting framework, shadow scoring, test quality, housekeeping, cross-AI validation, roadmap snapshot, INT8 quantization |
| 12 | Graph Signal Activation | 12 | Typed-weighted degree, co-activation boost, edge density, weight history, graph momentum, causal depth, community detection, graph/cognitive fixes, ANCHOR graph nodes, causal neighbor boost, temporal contiguity, unified graph retrieval |
| 13 | Memory Quality and Indexing | 18 | Verify-fix-verify loop, signal vocabulary expansion, pre-flight token budget, folder description discovery, pre-storage quality gate, reconsolidation, smarter content generation, anchor-aware thinning, encoding-intent capture, auto entity extraction, content-aware filename, duplicate prevention, entity normalization, quality gate persistence, deferred lexical indexing, dry-run preflight, outsourced agent capture, stateless enrichment |
| 14 | Pipeline Architecture | 22 | 4-stage refactor, MPAB aggregation, chunk ordering, template anchor optimization, validation signals, learned feedback, safety, performance, activation persistence, V1 removal, mutation hardening, DB_PATH standardization, Zod validation, dynamic server instructions, warm server mode, storage adapter, cross-process rebinding, atomic write-index, embedding retry, 7-layer metadata, pending-file recovery, lineage projection |
| 15 | Retrieval Enhancements | 9 | Dual-scope auto-surface, constitutional expert injection, folder hierarchy retrieval, lightweight consolidation, summary search channel, entity linking, tier-2 fallback, provenance envelopes, contextual tree injection |
| 16 | Tooling and Scripts | 13 | Tree thinning, boundary enforcement, progressive validation, dead code removal, code standards, chokidar watching, admin CLI, constitutional manager, migration checkpoints, schema validation, watcher cleanup, catalog references, session capturing quality |
| 17 | Governance | 4 | Feature flag governance, flag sunset audit, hierarchical scope governance, shared-memory rollout |
| 18 | UX Hooks | 13 | Post-mutation hooks, health autoRepair, checkpoint confirmName, schema sync, dedicated UX modules, mutation result expansion, response payload, success-path hints, duplicate-save hardening, atomic-save parity, token recomputation, hooks README, success-envelope verification |
| 19 | Phase System | 4 | Phase detection/scoring, phase folder creation, recursive validation, phase link validation |
| 20 | Feature Flag Reference | 7 | Search Pipeline, Session/Cache, MCP Config, Memory/Storage, Embedding/API, Debug/Telemetry, CI/Build |

**Total feature entries across all categories: ~187**

[SOURCE: feature_catalog/FEATURE_CATALOG.md TOC and directory counts verified]

---

## 8. MCP Tool Summary

**28 MCP tools** organized across 7 functional groups. All tools use the `spec_kit_memory_` prefix in MCP calls.

| Group | Tools | Count |
|---|---|---|
| Search and Retrieval | memory_search, memory_match_triggers, memory_list, memory_stats, memory_context | 5 |
| CRUD Operations | memory_save, memory_index_scan, memory_bulk_delete, memory_update, memory_delete, memory_validate | 6 |
| Checkpoints | checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete | 4 |
| Session Learning | task_preflight, task_postflight, memory_get_learning_history | 3 |
| Causal Tools | memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink | 4 |
| Evaluation | eval_run_ablation, eval_reporting_dashboard | 2 |
| Async Ingest | memory_ingest_start, memory_ingest_status, memory_ingest_cancel | 3 |
| System | memory_health | 1 |

**Total: 28** (matches current README claim)

For full API reference, tool signatures, parameters, and configuration, see `mcp_server/README.md`.

[SOURCE: README.md:458-529, mcp_server/README.md header verified]

### Shared Memory Tools (rollout-dependent, not counted in 28)

Shared-memory tools (`shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable`) are referenced in `/memory:shared` command but are rollout-dependent governance extensions.

[SOURCE: `.opencode/command/memory/shared.md` frontmatter]

---

## 9. Current README Gaps

### What Is Accurate

- Section 1 (Overview): Key capabilities table is current (post spec 138)
- Section 2 (Quick Start): Commands and examples work
- Section 3 (Components): Component map and MCP server description are current
- Section 4 (Documentation Levels): Level definitions are correct
- Section 5 (Memory System): Search pipeline, importance tiers, 5-state model, FSRS, causal graph, session dedup, ANCHOR format, 3-source indexing are all current
- Section 6 (MCP Tools): Tool lists match actual implementations
- Section 8 (Templates): Template overview is accurate
- Section 9 (Scripts): Validation rules table is accurate
- Section 10 (Troubleshooting): Still relevant
- Section 11 (FAQ): Answers are current
- Section 12 (Related Resources): Links are mostly valid

### What Is Stale or Needs Correction

1. **"By The Numbers" table (line 106-113):**
   - MCP Tools says "28" -- verify against live count (README section 6 lists 28, mcp_server README header also says 28)
   - Commands says "13 (8 spec_kit + 5 memory)" -- **STALE**: actual count is **15 (8 spec_kit + 7 memory)** since `/memory:analyze` and `/memory:shared` are now separate commands
   - Templates says "10" -- matches template overview list (section 8)
   - Test Coverage says "265 `.vitest.ts` files" -- needs verification against current file count
   - Last Verified says "2026-03-13" -- will need update

2. **Section 7 (Commands):**
   - Memory Commands table lists only 5 commands. Missing `/memory:analyze` and `/memory:shared`.

3. **Section 9 (Scripts):**
   - Scripts section only shows validation rules, feature creation, memory generation, and description generator. Missing inventory of many scripts in `scripts/spec/`, `scripts/memory/`, `scripts/core/`, `scripts/extractors/`, `scripts/utils/`.

4. **Frontmatter normalization workflow (Section 3):**
   - Present and accurate. No changes needed.

5. **Feature Catalog:**
   - Not referenced in the current README except in the Components section pointing to `FEATURE_CATALOG.md`. Could benefit from a summary or count.

6. **Section headings:**
   - Current README uses 12 numbered sections. The sk-doc template prescribes 9 sections (OVERVIEW, QUICK START, STRUCTURE, FEATURES, CONFIGURATION, USAGE EXAMPLES, TROUBLESHOOTING, FAQ, RELATED DOCUMENTS). Alignment decision needed.

### What Is Missing

1. **No Configuration section** -- Feature flags (10 documented flags), environment variables, and embedding provider config are scattered. A dedicated configuration reference section would add value.
2. **No Usage Examples section** -- While Quick Start has basic examples and Commands has a decision guide, there are no dedicated real-world usage patterns.
3. **Feature catalog summary** -- The 187+ features across 19 categories deserve at least a summary table linking to the full catalog.
4. **Script inventory is incomplete** -- Only a handful of scripts are listed. The full inventory (spec management, memory, extractors, utilities) is missing.

---

## 10. Target Section Structure

Based on the `sk-doc` README template (`readme_template.md`), the target structure uses a 9-section format:

| # | Section | Purpose | Key Content |
|---|---|---|---|
| 1 | **OVERVIEW** | Establish context | What is this, statistics, features, requirements |
| 2 | **QUICK START** | Enable fast success | 30-second setup, verification, first use |
| 3 | **STRUCTURE** | Aid navigation | Directory tree, key files table |
| 4 | **FEATURES** | Document capabilities | Feature groups, options, comparisons |
| 5 | **CONFIGURATION** | Reference settings | Config files, options, env vars |
| 6 | **USAGE EXAMPLES** | Show patterns | 3+ examples, common patterns table |
| 7 | **TROUBLESHOOTING** | Enable self-service | Common issues, quick fixes, diagnostics |
| 8 | **FAQ** | Answer common questions | Q&A format, general + technical |
| 9 | **RELATED DOCUMENTS** | Guide to more info | Internal docs, external resources |

[SOURCE: `.opencode/skill/sk-doc/assets/documentation/readme_template.md`:113-128]

### Style Requirements (from template)

- H2 headings: numbered, ALL CAPS (`## 1. OVERVIEW`)
- TOC link format: `#n--section-name` (double-dash after number)
- ANCHOR tags around each section
- YAML frontmatter (title, description, trigger_phrases)
- Human Voice Rules: no em dashes, no semicolons, no Oxford commas, no banned words (leverage, robust, seamless, etc.), active voice, direct address

[SOURCE: `readme_template.md`:361-468]

### Mapping Current Sections to Target

| Current (12 sections) | Target (9 sections) | Action |
|---|---|---|
| 1. Overview | 1. OVERVIEW | Merge, update counts |
| 2. Quick Start | 2. QUICK START | Keep, minimal changes |
| 3. Components | 3. STRUCTURE | Rename, expand directory tree |
| 4. Documentation Levels | 4. FEATURES (part) | Fold into Features |
| 5. Memory System | 4. FEATURES (part) | Fold into Features |
| 6. MCP Tools | 4. FEATURES (part) | Summary + link to mcp_server/README.md |
| 7. Commands | 4. FEATURES (part) or 6. USAGE EXAMPLES | Fold into Features or Usage |
| 8. Templates | 4. FEATURES (part) | Fold into Features |
| 9. Scripts | 4. FEATURES (part) | Fold into Features |
| 10. Troubleshooting | 7. TROUBLESHOOTING | Keep |
| 11. FAQ | 8. FAQ | Keep |
| 12. Related Resources | 9. RELATED DOCUMENTS | Keep, update |
| (new) | 5. CONFIGURATION | New: feature flags, env vars |
| (new) | 6. USAGE EXAMPLES | New: workflow patterns |

---

## 11. Cross-Reference Notes

### Internal Documents to Link

| Document | Relative Path | Purpose |
|---|---|---|
| SKILL.md | `./SKILL.md` | AI workflow instructions, routing, validation |
| MCP Server README | `./mcp_server/README.md` | Full MCP architecture, API reference, configuration |
| Memory System Reference | `./references/memory/memory_system.md` | Detailed memory system reference |
| Validation Rules | `./references/validation/validation_rules.md` | All 13 validation rules and fixes |
| Five Checks | `./references/validation/five_checks.md` | Five Checks evaluation framework |
| Rollback Runbook | `./references/workflows/rollback_runbook.md` | Feature-flag rollback and smoke-test |
| Feature Catalog | `./feature_catalog/FEATURE_CATALOG.md` | Complete feature inventory (187+ features) |
| ARCHITECTURE.md | `./ARCHITECTURE.md` | Boundary contract between scripts/ and mcp_server/ |
| sk-code--opencode | `../sk-code--opencode/SKILL.md` | Mandatory code alignment standard |
| sk-doc | `../sk-doc/SKILL.md` | Mandatory documentation alignment standard |

### External References

| Resource | Purpose |
|---|---|
| `AGENTS.md` (project root) | Gate definitions, AI behavior framework |
| `specs/` directory | All spec folders |
| Voyage AI | Recommended embedding provider (1024d) |

### Root README Integration

The root `README.md` references System Spec Kit as one of 16 skills. The rewritten README should maintain consistency with how the root README describes the skill's purpose and capabilities.

### MCP Server README Boundary

The MCP server has its own comprehensive README at `mcp_server/README.md` covering installation, architecture, tool API, search system, cognitive memory, configuration, troubleshooting and FAQ. The skill-level README should provide a summary and link rather than duplicate MCP details.

---

## 12. Writing Constraints

From the sk-doc README template checklist:

- All `[PLACEHOLDER]` markers must be replaced
- Overview explains what AND why
- Quick Start achievable in <2 minutes
- All commands tested and working
- At least 3 usage examples (simple to advanced)
- At least 3 troubleshooting entries
- All code blocks specify language
- All internal and external links verified
- H2 headings use numbered ALL CAPS format
- Human Voice Rules enforced (no em dashes, no semicolons, no banned words, active voice)
- Max 1 ellipsis per file
- "However" used max 2 times per file

[SOURCE: `readme_template.md`:416-468]
