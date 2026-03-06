---
title: "System Spec Kit"
description: "Unified documentation and context preservation skill providing spec folder workflows, memory management and MCP-powered semantic search."
trigger_phrases:
  - "spec kit"
  - "spec folder"
  - "memory system"
  - "hybrid search"
  - "context preservation"
---

# System Spec Kit

> Your AI assistant forgets everything between sessions. Not anymore.

Unified documentation and context preservation skill providing spec folder workflows, memory management and MCP-powered semantic search with multi-channel hybrid retrieval (Vector, FTS5/BM25, Graph, Degree) and causal graph intelligence.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. COMPONENTS](#3--components)
- [4. DOCUMENTATION LEVELS](#4--documentation-levels)
- [5. MEMORY SYSTEM](#5--memory-system)
- [6. MCP TOOLS](#6--mcp-tools)
- [7. COMMANDS](#7--commands)
- [8. TEMPLATES](#8--templates)
- [9. SCRIPTS](#9--scripts)
- [10. TROUBLESHOOTING](#10--troubleshooting)
- [11. FAQ](#11--faq)
- [12. RELATED RESOURCES](#12--related-resources)

---

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### The Problem Nobody Talks About

AI coding assistants are powerful but stateless. Every session starts from zero:

- Monday: "Here's how our auth system works..."
- Wednesday: Blank slate. Explain it all again.
- Friday: That spec folder you created? Lost in chat history.
- Next sprint: Same conversation, different day.

### The Solution

Spec Kit adds the missing layers: persistent memory, enforced documentation and cross-session context. Documentation is not optional. Gate 3 blocks file changes without a spec folder. Memory persists across sessions, models, projects, tools and runtimes.

Cross-workflow alignment is mandatory:
- All code created or updated must fully align with `sk-code--opencode`.
- All documentation created or updated must fully align with `sk-doc`.

---

### What Makes This Different

| Capability | Basic Approach | Spec Kit |
| --- | --- | --- |
| **Decision Archaeology** | "Why did we build it this way?" | Causal graph traces decision lineage |
| **Token Usage** | Re-send same memories every query | Session deduplication saves ~50% on follow-ups |
| **Context** | Re-explain everything every session | Memory persists across sessions, models, projects, tools and runtimes |
| **Search** | Vector only | Hybrid search with adaptive RRF fusion |
| **Ranking** | Score order | MMR diversity reranking + evidence gap detection |
| **Documentation** | "I'll document later" (never happens) | Gate 3 enforces spec folders on every file change |
| **Quality Gates** | Trust the AI did it right | PREFLIGHT/POSTFLIGHT validation at operation boundaries |
| **Handoffs** | 2-hour "what did you do" meetings | `/spec_kit:handover` produces a 15-line summary |

---

### Key Capabilities (Post Spec 138)

| Capability | Description |
| --- | --- |
| **Hybrid Search + Post-Fusion** | Primary scatter-gather across vector, FTS5/BM25, graph and degree; co-activation/session/causal signals are applied post-fusion |
| **Adaptive RRF Fusion** | Intent-weighted profiles replace fixed-weight RRF when `SPECKIT_ADAPTIVE_FUSION=true` |
| **RSF Fusion (Eval Path)** | Reciprocal Similarity Fusion kept for offline/evaluation comparison, not live ranking |
| **Degree Channel + Co-Activation** | 5th RRF channel with typed-weighted degree scoring and fan-effect sqrt divisor |
| **Embedding Cache** | Persistent SQLite cache with LRU eviction for embedding reuse |
| **Query Complexity Routing** | Classifier routes simple/moderate/complex queries to optimal pipeline |
| **Interference Scoring** | TM-01 penalizes high-similarity near-duplicates in result sets |
| **Classification Decay** | TM-03 tier-based and context-type stability multipliers for FSRS |
| **Confidence Truncation** | Removes low-confidence tail results using 2x median gap detection |
| **Dynamic Token Budget** | Tier-aware budgets (1500/2500/4000) for result delivery |
| **Causal Lineage Insights** | Causal tools and boosts surface decision lineage for "why" and dependency questions |
| **MMR Diversity Reranking** | Lambda mapped to detected intent for relevance-diversity balance |
| **Evidence Gap Detection** | TRM with Z-score confidence flags missing context before retrieval |
| **Multi-Query RAG Fusion** | Query expansion with domain vocabulary before scatter-gather |
| **FSRS Spaced Repetition** | Power-law decay with tier-based modulation (validated on 100M+ users) |
| **Semantic Memory** | Voyage AI 1024d embeddings stored in sqlite-vec |
| **Spec Folder Documentation** | Levels 1-3+ with CORE + ADDENDUM v2.2 template architecture |
| **Frontmatter Normalization + Dashboard Titles** | Managed metadata keys and scoped title suffixes keep template/spec/memory entries disambiguated in the memory dashboard |

---

### By The Numbers

| Category | Count |
| --- | --- |
| **MCP Tools** | 25 (memory, checkpoint, causal, drift, learning, health) |
| **Templates** | 10 (specs, plans, research, decisions) |
| **Commands** | 13 (8 spec_kit + 5 memory) |
| **Importance Tiers** | 6 (constitutional to deprecated) |
| **Memory Types** | 9 (working, episodic, procedural, semantic, etc.) |
| **ANCHOR Coverage** | 533 anchors across 78 skill READMEs |
| **Test Coverage** | 5,797 tests across 196 files |
| **Last Verified** | 2026-02-27 |

### Requirements

| Requirement | Minimum |
| --- | --- |
| Node.js | 18+ |
| TypeScript | 5.0+ (compile with `npm run build`) |
| OpenCode | 1.0.190+ |
| Bash | 4.0+ |

---

<!-- /ANCHOR:overview -->

## 2. QUICK START
<!-- ANCHOR:quick-start -->

### Create a Spec Folder

```bash
# 1. Find the next spec folder number
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1

# 2. Create your spec folder
.opencode/skill/system-spec-kit/scripts/spec/create.sh "Add user authentication" --level 2

# 3. Verify creation
ls specs/###-user-authentication/
# Expected: spec.md  plan.md  tasks.md  checklist.md  memory/  scratch/
```

### Use Commands (Faster)

```bash
# Full workflow (plan + implement)
/spec_kit:complete add user authentication :auto

# Planning only
/spec_kit:plan refactor database layer :confirm

# Research first
/spec_kit:research evaluate GraphQL vs REST
```

### Level Selection

| LOC Estimate | Level | What You Get |
| --- | --- | --- |
| <100 | 1 | spec.md + plan.md + tasks.md + implementation-summary.md |
| 100-499 | 2 | Level 1 + checklist.md |
| >=500 | 3 | Level 2 + decision-record.md |
| Complex | 3+ | Level 3 + extended governance |

When in doubt, choose the higher level.

---

<!-- /ANCHOR:quick-start -->

## 3. COMPONENTS
<!-- ANCHOR:components -->

### Component Map

| Component | Path | Purpose |
| --- | --- | --- |
| **MCP Server** | `mcp_server/` | Hybrid search, graph intelligence, memory indexing |
| **Scripts** | `scripts/` | CLI tools for spec management and memory generation |
| **Templates** | `templates/` | Spec folder templates (Level 1-3+, CORE + ADDENDUM v2.2) |
| **References** | `references/` | Reference documentation (19 files) |
| **Assets** | `assets/` | Workflow assets, YAML configs, checklists |
| **Constitutional** | `constitutional/` | Always-surface project rules (never decay) |

### MCP Server (`mcp_server/`)

The cognitive memory engine. It provides 25 MCP tools over stdio for semantic search, memory management, causal graph operations, checkpoints and session learning.

**Key characteristics after spec 138:**
- Hybrid scatter-gather search pipeline
- Adaptive RRF fusion with 7 intent profiles
- Unified causal graph search for decision lineage
- MMR diversity reranking with intent-mapped lambda
- Evidence gap detection (TRM with Z-score confidence)
- Multi-query RAG fusion with domain vocabulary expansion
- All feature flags default to enabled via `isFeatureEnabled()`

See [mcp_server/README.md](./mcp_server/README.md) for full architecture, configuration and API reference.

### Scripts (`scripts/`)

CLI tools for day-to-day spec kit operations:

| Script | Purpose |
| --- | --- |
| `spec/create.sh` | Create feature branch and spec folder; `--phase` creates parent + child phase folders |
| `spec/validate.sh` | Validation orchestrator (13 rules); `--recursive` validates parent and all child phase folders |
| `spec/calculate-completeness.sh` | Calculate completeness percentage |
| `spec/check-placeholders.sh` | Verify zero placeholders after upgrade |
| `spec/recommend-level.sh` | Recommend documentation level with phased decomposition detection |
| `spec/archive.sh` | Archive completed spec folders |
| `memory/generate-context.ts` | Memory file generation (source) |
| `memory/backfill-frontmatter.ts` | Bulk frontmatter normalization for templates/spec docs/memory files with dry-run/apply/report modes |
| `memory/reindex-embeddings.ts` | Force embedding refresh after metadata migrations or parser/template updates |
| `templates/compose.sh` | Compose level templates |

**Memory generation is mandatory via script:**

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/<###-feature-name>/
```

Never create memory files with the Write tool. The script enforces format and indexing consistency.

**Frontmatter normalization workflow:**

```bash
# 1) Preview normalization across discovered specs roots (includes archive)
#    Strict mode is default: malformed frontmatter is reported and exits non-zero.
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --dry-run --include-archive --report /tmp/frontmatter-dry-run.json

# 2) Apply frontmatter updates
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --apply --include-archive --report /tmp/frontmatter-apply.json

# Optional compatibility mode (do not fail on malformed frontmatter)
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --dry-run --allow-malformed --report /tmp/frontmatter-relaxed.json

# 3) Recompose templates and verify single-frontmatter outputs
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify

# 4) Refresh embedding index with new metadata
node .opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js
```

Frontmatter contract for indexed markdown uses managed keys:
`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`.

Parser compatibility is non-breaking: both `contextType` and `context_type` are accepted.
Migration reports include a dedicated `malformed` summary counter for strict-mode diagnostics.

### Code Alignment Verifier Workflow

Run the OpenCode alignment verifier on changed code paths before completion claims:

```bash
python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py \
  --root .opencode/skill/system-spec-kit
```

### Templates (`templates/`)

Spec folder templates using CORE + ADDENDUM v2.2 architecture:

```
Level 1:  [CORE templates only]        -> 4 files, ~455 LOC
Level 2:  [CORE] + [L2-VERIFY]         -> 6 files, ~875 LOC
Level 3:  [CORE] + [L2] + [L3-ARCH]    -> 7 files, ~1090 LOC
Level 3+: [CORE] + [all addendums]     -> 7 files, ~1350 LOC
```

Update CORE once and all levels inherit changes without duplication.

---

<!-- /ANCHOR:components -->

## 4. DOCUMENTATION LEVELS
<!-- ANCHOR:documentation-levels -->

### Progressive Enhancement

Every file modification requires a spec folder. Level is determined by estimated LOC, risk and complexity:

| Level | LOC Estimate | Required Files | Use When |
| --- | --- | --- | --- |
| **1** | <100 | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum) |
| **2** | 100-499 | Level 1 + checklist.md | QA validation needed |
| **3** | >=500 | Level 2 + decision-record.md | Complex/architecture changes |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

> LOC is soft guidance. Risk and complexity can override. When in doubt, choose the higher level.

### When to Use Each Level

| Task | Level | Rationale |
| --- | --- | --- |
| Fix CSS alignment | 1 | Simple, low risk |
| Add form validation | 1-2 | Borderline, low complexity |
| Modal component | 2 | Multiple files, needs QA |
| Auth system refactor | 3 | Architecture change, high risk |
| Database migration | 3 | High risk overrides LOC estimate |

### Spec Folder Structure

```
specs/<###-feature-name>/
├── spec.md                    # Feature specification
├── plan.md                    # Implementation plan
├── tasks.md                   # Task breakdown
├── checklist.md               # QA validation (Level 2+)
├── decision-record.md         # ADRs (Level 3+)
├── implementation-summary.md  # Post-implementation summary
├── memory/                    # Context preservation (generated via script)
│   └── DD-MM-YY_HH-MM__topic.md
└── scratch/                   # Temporary files (git-ignored)
```

### @speckit Exclusivity

`@speckit` is the ONLY agent permitted to create or substantively write spec folder documentation (*.md files). Routing spec documentation to `@general`, `@write` or other agents is a hard violation.

Exceptions: `memory/` uses `generate-context.js`, `scratch/` allows any agent, `handover.md` uses `@handover`, `research.md` uses `@research` and `debug-delegation.md` uses `@debug`.

---

<!-- /ANCHOR:documentation-levels -->

## 5. MEMORY SYSTEM
<!-- ANCHOR:memory-system -->

### Architecture

The memory system implements biologically-inspired cognitive features:

| Basic Chat Logs | This Memory System |
| --- | --- |
| Search: Ctrl+F (text only) | Search: hybrid retrieval with adaptive RRF fusion |
| Prioritization: None | Prioritization: 6-tier importance (constitutional to deprecated) |
| Token Efficiency: Load everything | Token Efficiency: ANCHOR format (93% savings) + session dedup (~50%) |
| Recovery: Hope you backed up | Recovery: Checkpoints = undo button for your index |
| "Why" queries: Impossible | "Why" queries: Causal graph traces decision lineage |

### Search Pipeline

After spec 138 and Sprints 1-3, `memory_search` and `memory_context` use a scatter-gather architecture across multiple channels:

```
Vector (1.0x) + FTS5/BM25 (1.0x) + Graph (1.5x) + Degree (1.0x)
+ Co-Activation (+0.25) + Session Boost (capped) + Causal Edges (2-hop)
         |
         v
Adaptive RRF Fusion (intent-weighted profiles, k=60)
── RSF retained for evaluation-only comparisons (not live ranking) ──
          |
          v
Query Complexity Routing (simple → fast path, complex → full pipeline)
         |
         v
MMR Diversity Reranking (lambda mapped to intent)
         |
         v
Confidence Truncation (2x median gap, min 3 results)
         |
         v
Dynamic Token Budget (1500/2500/4000 by tier)
         |
         v
Evidence Gap Detection (TRM with Z-score confidence)
```

### The Six Importance Tiers

| Tier | Boost | Decay | Use Case |
| --- | --- | --- | --- |
| **constitutional** | 3.0x | Never | Project rules, always-surface |
| **critical** | 2.0x | Never | Architecture decisions, breaking changes |
| **important** | 1.5x | Never | Key implementations, major features |
| **normal** | 1.0x | 90-day | Standard development context (default) |
| **temporary** | 0.5x | 7-day | Debug sessions, experiments |
| **deprecated** | 0.0x | Excluded | Outdated information |

### 5-State Memory Model

| State | Score Range | Behavior | Max Items |
| --- | --- | --- | --- |
| **HOT** | 0.80-1.00 | Always retrieve | 5 |
| **WARM** | 0.25-0.80 | Retrieve on match | 10 |
| **COLD** | 0.05-0.25 | Retrieve if nothing else | N/A |
| **DORMANT** | 0.02-0.05 | Skip unless explicit | N/A |
| **ARCHIVED** | 0.00-0.02 | Exclude from search | N/A |

ARCHIVED memories are preserved but hidden from search. No deletion needed.

### FSRS Decay with Tier Modulation

Memory strength follows the Free Spaced Repetition Scheduler power-law formula. After spec 138, importance tier applies a stability multiplier so higher-tier memories decay slower regardless of access frequency.

### Causal Memory Graph

Answer "why" queries by tracing decision lineage:

```typescript
memory_drift_why({ memoryId: 'abc123', maxDepth: 3 })
// Returns: { memory: {...}, causedBy: [...], enabledBy: [...], supersedes: [...] }
```

**6 Relationship Types:** `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`

### Session Deduplication

| Without Dedup | With Dedup |
| --- | --- |
| Query 1: 5000 tokens | Query 1: 5000 tokens |
| Query 2: same 5000 tokens | Query 2: ~2000 tokens (skips seen memories) |
| Query 3: same 5000 tokens | Query 3: ~500 tokens (skips seen memories) |
| **Total: 15,000 tokens** | **Total: ~7,500 tokens (~50% savings)** |

### ANCHOR Format

```markdown
<!-- ANCHOR: decisions -->
## Authentication Decision
We chose JWT with refresh tokens because stateless auth scales better.
<!-- /ANCHOR: decisions -->
```

**Coverage:** ANCHOR retrieval is applied across the indexed memory corpus (spec docs, spec memories, constitutional docs).
**Token savings:** ~93% vs loading full documents.
**Common anchors:** `summary`, `decisions`, `metadata`, `state`, `context`, `artifacts`, `blockers`, `next-steps`

### 3-Source Indexing Pipeline

| # | Source | Location Pattern | Weight |
| --- | --- | --- | --- |
| 1 | Constitutional rules | `.opencode/skill/*/constitutional/*.md` | Per-file metadata |
| 2 | Spec documents | `.opencode/specs/**/*.md` | Per-type multiplier |
| 3 | Spec memories | `specs/*/memory/*.{md,txt}` | 0.5 |

README files and skill documentation trees (`sk-*`, including `references/` and `assets/`) are excluded from indexing.

---

<!-- /ANCHOR:memory-system -->

## 6. MCP TOOLS
<!-- ANCHOR:mcp-tools -->

### Tool Overview

All tools use the `spec_kit_memory_` prefix in MCP calls (e.g., `spec_kit_memory_memory_search`).

**Search and Retrieval**

| Tool | Purpose |
| --- | --- |
| `memory_search` | Hybrid search with adaptive RRF, MMR reranking and evidence gap detection |
| `memory_match_triggers` | Fast keyword matching (<50ms) for Gate 1 context surfacing |
| `memory_list` | Browse stored memories with pagination |
| `memory_stats` | System statistics and folder rankings |

**CRUD Operations**

| Tool | Purpose |
| --- | --- |
| `memory_save` | Index a memory file with PE gating |
| `memory_index_scan` | Bulk scan workspace (3-source pipeline, incremental) |
| `memory_update` | Update memory metadata and tier |
| `memory_delete` | Delete memories by ID or folder |
| `memory_validate` | Record validation feedback |

**Checkpoints**

| Tool | Purpose |
| --- | --- |
| `checkpoint_create` | Snapshot current state with embeddings |
| `checkpoint_list` | List available checkpoints |
| `checkpoint_restore` | Restore from checkpoint |
| `checkpoint_delete` | Remove checkpoint |

**Session Learning**

| Tool | Purpose |
| --- | --- |
| `task_preflight` | Capture epistemic baseline before task |
| `task_postflight` | Capture post-task state, calculate Learning Index |
| `memory_get_learning_history` | Get learning trends and summaries |

**Causal Tools**

| Tool | Purpose |
| --- | --- |
| `memory_drift_why` | Trace causal chain for decision lineage |
| `memory_causal_link` | Create causal relationships between memories |
| `memory_causal_stats` | Graph statistics and coverage metrics |
| `memory_causal_unlink` | Remove causal relationships |
| `memory_context` | L1 Orchestration unified entry point with multi-query RAG fusion |

**System**

| Tool | Purpose |
| --- | --- |
| `memory_health` | Check health status of the memory system |

### Causal Lineage Support

`memory_context` can surface decision lineage via causal relationships and related retrieval signals, improving "why" and dependency-focused queries.

---

<!-- /ANCHOR:mcp-tools -->

## 7. COMMANDS
<!-- ANCHOR:commands -->

### Spec Kit Commands

| Command | Steps | Purpose |
| --- | --- | --- |
| `/spec_kit:complete` | 14 | Full end-to-end workflow |
| `/spec_kit:plan` | 7 | Planning only (no implementation) |
| `/spec_kit:implement` | 11 | Execute pre-planned work with PREFLIGHT/POSTFLIGHT |
| `/spec_kit:research` | 9 | Technical investigation |
| `/spec_kit:resume` | 4 | Resume previous session |
| `/spec_kit:handover` | 4 | Create session handover document |
| `/spec_kit:debug` | 5 | Delegate debugging to sub-agent |
| `/spec_kit:phase` | N/A | Decompose complex features into parent and child phase folders |

### Memory Commands

| Command | Purpose |
| --- | --- |
| `/memory:save [folder]` | Save context via `generate-context.js` |
| `/memory:context <query>` | Unified entry with intent awareness |
| `/memory:manage` | Database management operations |
| `/memory:continue` | Session recovery from crash or compaction |
| `/memory:learn` | Constitutional memory manager (create, list, edit, remove, budget) |

### Mode Suffixes

| Suffix | Behavior | Applies To |
| --- | --- | --- |
| `:auto` | Execute without approval gates | Most commands |
| `:confirm` | Pause at each step for approval | Most commands |
| `:with-research` | Dispatch @research before verification | `/spec_kit:complete` only |
| `:auto-debug` | Auto-dispatch @debug on 3+ failures | `/spec_kit:complete` only |

### Workflow Decision Guide

```
START: New Task
     |
     v
Do you understand requirements clearly?
├── YES -> Need to plan for later?
│         ├── YES -> /spec_kit:plan
│         └── NO  -> /spec_kit:complete
└── NO  -> /spec_kit:research
              |
              v
         Then: /spec_kit:plan or /spec_kit:complete
```

---

<!-- /ANCHOR:commands -->

## 8. TEMPLATES
<!-- ANCHOR:templates -->

### Template Overview

| Template | Level | Description |
| --- | --- | --- |
| `spec.md` | 1+ | Feature specification with user stories |
| `plan.md` | 1+ | Implementation plan with architecture |
| `tasks.md` | 1+ | Task breakdown by user story |
| `implementation-summary.md` | 1+ | Post-implementation summary |
| `checklist.md` | 2+ | Validation and QA checklists (P0/P1/P2) |
| `decision-record.md` | 3+ | Architecture Decision Records |
| `research.md` | 3 | Comprehensive multi-domain research |
| `handover.md` | Any | Full session continuity |
| `debug-delegation.md` | Any | Sub-agent debugging delegation |
| `context_template.md` | Any | Memory context template |

### Copy Commands

```bash
# Level 1 (Baseline)
cp .opencode/skill/system-spec-kit/templates/level_1/*.md specs/###-name/

# Level 2 (Add verification)
cp .opencode/skill/system-spec-kit/templates/level_2/*.md specs/###-name/

# Level 3 (Full documentation)
cp .opencode/skill/system-spec-kit/templates/level_3/*.md specs/###-name/
```

### Priority System (checklist.md)

| Priority | Meaning | Deferral Rules |
| --- | --- | --- |
| **P0** | HARD BLOCKER | Must complete, cannot defer |
| **P1** | Required | Must complete OR user-approved deferral |
| **P2** | Optional | Can defer without approval |

---

<!-- /ANCHOR:templates -->

## 9. SCRIPTS
<!-- ANCHOR:scripts -->

### Validation Rules (13 Total)

| Rule | Severity | Description |
| --- | --- | --- |
| `FILE_EXISTS` | ERROR | Required files present for level |
| `PLACEHOLDER_FILLED` | ERROR | No unfilled `[YOUR_VALUE_HERE:]` patterns |
| `SECTIONS_PRESENT` | WARNING | Required markdown sections exist |
| `LEVEL_DECLARED` | INFO | Level explicitly stated |
| `PRIORITY_TAGS` | WARNING | P0/P1/P2 format validated |
| `EVIDENCE_CITED` | WARNING | Non-P2 items cite evidence |
| `ANCHORS_VALID` | ERROR | Memory file anchor pairs matched |
| `FOLDER_NAMING` | ERROR | Follows `###-short-name` convention |
| `FRONTMATTER_VALID` | WARNING | YAML frontmatter structured correctly |
| `COMPLEXITY_MATCH` | WARNING | Content metrics match declared level |
| `AI_PROTOCOL` | WARNING | Level 3/3+ has AI execution protocols |
| `LEVEL_MATCH` | ERROR | Level consistent across all files |
| `SECTION_COUNTS` | WARNING | Section counts within expected ranges |

**Exit Codes:** `0` = Pass | `1` = Warnings | `2` = Errors

### Feature Creation

```bash
# Create spec folder with level 2 templates
./scripts/spec/create.sh "Add OAuth2 with MFA" --level 2

# Skip git branch creation
./scripts/spec/create.sh "Add OAuth2" --level 1 --skip-branch
```

### Memory Generation

```bash
# Generate memory file (executes compiled JS from dist/)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/<###-feature-name>/

# Explicit CLI targets are authoritative and are not rerouted
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion

# Generate for nested phase folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/121-child-name
```

---

<!-- /ANCHOR:scripts -->

## 10. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Spec Folder Not Found

```bash
# Check current branch
git branch --show-current

# List existing spec folders
ls -d specs/[0-9]*/

# Create spec folder if missing
./scripts/spec/create.sh "feature name" --level 2
```

#### Template Placeholders Not Replaced

```bash
# Find all placeholders
grep -r "\[YOUR_VALUE_HERE\]" specs/<###-feature-name>/

# Replace with actual content (check-placeholders.sh helps)
.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh specs/<###-feature-name>/
```

#### Memory Loading Issues

```bash
# Verify memory folder exists
ls -la specs/###-folder/memory/

# Force re-index
memory_index_scan({ specFolder: "###-folder" })
```

#### MCP Server Issues

See [mcp_server/README.md](./mcp_server/README.md) for:
- Embedding model download failures
- Database corruption recovery
- Dimension mismatch after switching providers
- Empty search results diagnostics
- Feature flag rollback procedure

### Quick Fixes

| Problem | Quick Fix |
| --- | --- |
| Spec folder not found | `./scripts/spec/create.sh "name" --level 1` |
| Validation failing | `./scripts/spec/validate.sh <folder> --verbose` |
| Memory not indexing | `memory_index_scan({ specFolder: "..." })` |
| ANCHOR tag mismatch | Every `<!-- ANCHOR: name -->` needs matching `<!-- /ANCHOR: name -->` |
| Embedding API errors | Check API key or set `EMBEDDINGS_PROVIDER=hf-local` |
| Empty search results | `memory_index_scan({ force: true })` |

### Testing

```bash
# Run full MCP server test suite (from mcp_server directory)
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run
# Expected: 5,797 tests passing across 196 files
```

---

<!-- /ANCHOR:troubleshooting -->

## 11. FAQ
<!-- ANCHOR:faq -->

**Q: Do I need a spec folder for every file change?**

A: Yes for non-trivial file changes. Single typo fixes under five characters in one file and whitespace-only edits are exempt.

**Q: When should I choose Level 2 instead of Level 1?**

A: Use Level 2 when a change spans multiple files or needs verification evidence in `checklist.md`.

**Q: How do I recover context after a crash or compaction?**

A: Start with `/memory:continue`. If you need focused context, call `memory_context` with anchors such as `state` and `next-steps`.

**Q: Can I write memory files manually?**

A: No. Use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>` so format and indexing stay consistent.

**Q: Which tool should I call first for most retrieval tasks?**

A: Start with `memory_context`. It routes by intent, applies multi-query RAG fusion and picks the best retrieval path for the query.

**Q: Are all major feature flags enabled by default after spec 138?**

A: Yes. Major flags including `SPECKIT_ADAPTIVE_FUSION`, `SPECKIT_CAUSAL_BOOST` and `SPECKIT_SESSION_BOOST` default to enabled via `isFeatureEnabled()`. See [mcp_server/README.md](./mcp_server/README.md) for the full flag table.

---

<!-- /ANCHOR:faq -->

## 12. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
| --- | --- |
| [SKILL.md](./SKILL.md) | AI workflow instructions (routing, validation, command protocols) |
| [mcp_server/README.md](./mcp_server/README.md) | Memory MCP installation, architecture and API reference |
| [references/memory/memory_system.md](./references/memory/memory_system.md) | Memory system detailed reference |
| [references/validation/validation_rules.md](./references/validation/validation_rules.md) | All validation rules and fixes |
| [references/validation/five_checks.md](./references/validation/five_checks.md) | Five Checks evaluation framework |
| [references/workflows/rollback_runbook.md](./references/workflows/rollback_runbook.md) | Feature-flag rollback and smoke-test procedure |
| [../sk-code--opencode/SKILL.md](../sk-code--opencode/SKILL.md) | Mandatory standard for all code creation and updates |
| [../sk-doc/SKILL.md](../sk-doc/SKILL.md) | Mandatory standard for all documentation creation and updates |

### Directory Structure

```
.opencode/skill/system-spec-kit/
├── SKILL.md                   # AI workflow instructions
├── README.md                  # This file
├── templates/                 # Template system (CORE + ADDENDUM v2.2)
│   ├── core/                  # Foundation templates (4 files)
│   ├── addendum/              # Level-specific additions
│   ├── level_1/ - level_3+/   # Composed templates by level
│   └── *.md                   # Utility templates
├── scripts/                   # Automation scripts [TypeScript source]
│   ├── spec/                  # Spec folder management
│   ├── memory/                # Memory system scripts
│   ├── rules/                 # Validation rules (13)
│   └── dist/                  # Compiled JavaScript output
├── shared/                    # Shared workspace (@spec-kit/shared)
├── mcp_server/                # Spec Kit Memory MCP [TypeScript source]
│   ├── context-server.ts      # MCP server entry (25 tools)
│   ├── core/                  # Core initialization
│   ├── handlers/              # Tool handlers (9 functional + 2 infra)
│   ├── lib/                   # Library modules
│   │   ├── cognitive/         # FSRS, PE gating, 5-state model
│   │   ├── search/            # Vector, BM25, adaptive RRF, RSF, MMR, query classifier, confidence truncation, dynamic token budget, channel representation, folder discovery, causal boost
│   │   ├── cache/             # Persistent embedding cache (SQLite with LRU eviction)
│   │   ├── eval/              # Edge density measurement
│   │   ├── session/           # Deduplication, crash recovery
│   │   ├── storage/           # SQLite, causal edges, mutation ledger
│   │   ├── providers/         # Embedding providers (Voyage, OpenAI, HF local)
│   │   └── errors/            # Recovery hints (49 codes)
│   ├── dist/                  # Compiled JavaScript output
│   └── database/              # SQLite + vector search
├── references/                # Documentation (19 files)
├── assets/                    # Decision matrices, YAML configs
└── constitutional/            # Always-surface rules (never decay)
```

### Key Locations

| Resource | Location |
| --- | --- |
| **Templates** | `.opencode/skill/system-spec-kit/templates/` |
| **Scripts** | `.opencode/skill/system-spec-kit/scripts/` |
| **Memory MCP** | `.opencode/skill/system-spec-kit/mcp_server/` |
| **References** | `.opencode/skill/system-spec-kit/references/` |
| **Commands** | `.opencode/command/spec_kit/` and `.opencode/command/memory/` |
| **Root Build Manifests** | `.opencode/skill/system-spec-kit/package.json` and `.opencode/skill/system-spec-kit/tsconfig*.json` |

### External Dependencies

| Resource | Purpose |
| --- | --- |
| `AGENTS.md` | Project-level AI behavior framework, gate definitions and enforcement |
| `specs/` | Directory for all spec folders |
| Voyage AI | Recommended embedding provider (1024d, `VOYAGE_API_KEY`) |

<!-- /ANCHOR:related -->
