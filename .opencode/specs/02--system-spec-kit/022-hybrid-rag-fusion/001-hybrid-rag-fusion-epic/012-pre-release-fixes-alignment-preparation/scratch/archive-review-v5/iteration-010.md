OpenAI Codex v0.116.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d23da-f9a7-7b11-a007-870b22757f71
--------
user
You are a documentation alignment agent. Verify feature catalog categories 11-21 against live code.

CONTEXT: The feature catalog at .opencode/skill/system-spec-kit/feature_catalog/ has 21 categories. We need to verify categories 11-21 against actual code.

TASKS:
1. List all .md files in categories 11-scoring-and-calibration through 21-implement-and-remove
2. For each snippet file, read it and check:
   a. Does the described feature/function/tool actually exist in the codebase?
   b. Does the described behavior match the code?
   c. Are the file paths/function names referenced accurate?
3. Focus on categories with the most snippets first

SCOPE: .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/ through 21--implement-and-remove-deprecated-features/
Cross-reference with: .opencode/skill/system-spec-kit/mcp_server/, scripts/, shared/

OUTPUT FORMAT:
# Iteration 010: Feature Catalog Categories 11-21 Verification
## Agent: codex / gpt-5.4 / high
## Dimension: traceability
## Files Reviewed
(list files)
## Category Verification
### 11--scoring-and-calibration (N snippets)
- [snippet name]: [ALIGNED | DRIFTED | MISSING] — [notes]
...
(continue for categories 11-21)
## Findings
### [SEVERITY]-[NNN]: [Title]
...
## Summary
- Snippets checked: N
- ALIGNED: N, DRIFTED: N, MISSING: N
- Total findings: N (P0: N, P1: N, P2: N)
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: cocoindex_code starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a traceability review of the feature catalog against the live `system-spec-kit` code, starting with routing and scope discovery so we can verify the highest-density categories first.
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/feature_catalog -maxdepth 1 -type d | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog
.opencode/skill/system-spec-kit/feature_catalog/.github
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval
.opencode/skill/system-spec-kit/feature_catalog/02--mutation
.opencode/skill/system-spec-kit/feature_catalog/03--discovery
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle
.opencode/skill/system-spec-kit/feature_catalog/06--analysis
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts
.opencode/skill/system-spec-kit/feature_catalog/17--governance
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' .opencode/skill/system-spec-kit .opencode/skill/system-spec-kit/feature_catalog .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog categories 11-21 against live code in .opencode/skill/system-spec-kit, checking snippet traceability, behavior alignment, and referenced paths/functions" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.67s:
2026-03-25 08:17:51.939 xcodebuild[79491:13838330]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:52.084 xcodebuild[79491:13838318] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-hWa4lNuy' (errno=Operation not permitted)
2026-03-25 08:17:52.649 xcodebuild[80006:13839122]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:52.788 xcodebuild[80006:13839113] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, folder"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
codex
I’ve got the target category directories. The skill router hit a sandbox-related temp/cache issue, so I’m polling that once; if it stays blocked, I’ll continue with the clearly relevant review and spec-kit context skills rather than stall the verification.
codex
SKILL ROUTING: `system-spec-kit`, `sk-code--opencode`, and `sk-doc` all passed the threshold, so I’m using that stack in that order: spec-kit for the catalog workflow context, opencode for code-traceability standards, and sk-doc for documentation verification. I’m skipping `sk-code--web` because this pass is about catalog/code alignment rather than frontend behavior.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-doc
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts, install guides, feature catalogs, and manual testing playbooks."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.3.0.0
---

<!-- Keywords: sk-doc, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Component Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation and packaging, (3) ASCII flowchart creation for visualizing workflows, (4) Install guide creation for setup documentation and (5) Feature catalog and manual testing playbook creation for inventory and validation packages.

**Core Principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations.


## 1. WHEN TO USE

exec
/bin/zsh -lc 'for d in .opencode/skill/system-spec-kit/feature_catalog/1{1,2,3,4,5,6,7,8,9}* .opencode/skill/system-spec-kit/feature_catalog/20--* .opencode/skill/system-spec-kit/feature_catalog/21--*; do c=$(find "$d" -maxdepth 1 -type f -name '"'*.md' | wc -l | tr -d ' '); printf '%s\\t%s\\n' \""'$c" "$d"; done | sort -rn' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
24	.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing
22	.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture
22	.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration
19	.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks
18	.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts
11	.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence
9	.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements
8	.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference
4	.opencode/skill/system-spec-kit/feature_catalog/17--governance
1	.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features
1	.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation
codex
I’ve got the density order, so I’m starting with the heaviest categories first: `13`, `14`, then `11`, and I’ll work downward. Next I’m sampling the snippet structure so I can verify all 139 files consistently instead of doing a brittle one-off pass.
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration -maxdepth 1 -type f -name '*.md' | sort | sed -n '1,8p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture -maxdepth 1 -type f -name '*.md' | sort | sed -n '1,8p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing -maxdepth 1 -type f -name '*.md' | sort | sed -n '1,8p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/06-embedding-cache.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md
 succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/08-performance-improvements.md
 succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-doc/references/specific/feature_catalog_creation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: Feature Catalog Creation - Standards and Workflow
description: Standards and workflow guidance for creating feature catalogs with a rooted inventory, numbered category folders, stable per-feature files, and current-reality source references.
---

# Feature Catalog Creation - Standards and Workflow

Standards and workflow guidance for creating feature catalogs with a rooted inventory, numbered category folders, stable per-feature files, and current-reality source references.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Feature catalogs are the canonical inventory for what a system does today. They organize capabilities by category, summarize current behavior in a root catalog, and link to per-feature files that carry implementation anchors, tests, and metadata.

**Core Principle**: Use the root catalog for stable inventory and navigation, and use per-feature files for implementation truth and traceable source anchors.

**Primary Sources**:
- [feature_catalog_template.md](../../assets/documentation/feature_catalog/feature_catalog_template.md)
codex
The catalog guide confirms the right standard for this pass: treat each snippet as a current-state claim with traceable source anchors, not just prose quality. I’m pulling the snippet structure next so I can validate existence, behavior, and path accuracy in one sweep.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Verify-fix-verify memory quality loop"
description: "The verify-fix-verify loop evaluates memory quality at save time and auto-retries fixes before accepting or rejecting the save."
---

# Verify-fix-verify memory quality loop

## 1. OVERVIEW

The verify-fix-verify loop evaluates memory quality at save time and auto-retries fixes before accepting or rejecting the save.

Before saving a new memory, the system checks whether it meets quality standards. If it falls short, the system tries to fix the problems automatically and checks again. Think of it like a spell checker that runs before you hit send: it catches obvious issues and corrects them so you do not store sloppy notes that will be hard to find later.

---

## 2. CURRENT REALITY

The quality loop is still the save-time auto-fix stage for recoverable formatting issues, but it is no longer the final semantic authority on whether a memory is good enough to save.

When `SPECKIT_QUALITY_LOOP` is enabled, the runtime still runs an initial quality evaluation and then up to 2 immediate auto-fix retries by default (`maxRetries=2`). Auto-fixes can re-extract trigger phrases from headings/title, normalize unclosed anchors, and trim content to the shared token budget.
 succeeded in 0ms:
---
title: Feature Catalog Snippet Template
description: Template for per-feature reference files stored directly under feature_catalog category directories.
---

# Feature Catalog Snippet Template

Per-feature reference files for split feature catalogs. Use this template for the one-file-per-feature contract described in the main feature catalog template.

---

## 1. OVERVIEW

Each feature file is the canonical home for detailed current-reality reference material. The root `FEATURE_CATALOG.md` stays readable by summarizing the feature and linking here, while the per-feature file carries the fuller behavior description, structured source-file references, validation anchors, and concise metadata.

**Required uses**:
- One file per catalog feature
- Frontmatter that mirrors the larger root docs (`title` + `description`)
- Current-reality explanation that stays aligned with the root catalog summary
- Structured source-file and validation references
 succeeded in 0ms:
---
title: "4-stage pipeline refactor"
description: "The 4-stage pipeline structures retrieval into candidate generation, fusion, reranking and filtering with a strict score-immutability invariant in the final stage."
---

# 4-stage pipeline refactor

## 1. OVERVIEW

The 4-stage pipeline structures retrieval into candidate generation, fusion, reranking and filtering with a strict score-immutability invariant in the final stage.

When you ask the system a question, your search goes through four clear steps: gather candidates, combine and score them, rerank the best ones and finally filter the results. This is like an assembly line where each station has one job and passes its work to the next. The old system tried to do everything in one messy step, which made it hard to find and fix problems. The new structure makes each step predictable and testable.

---

## 2. CURRENT REALITY

The retrieval pipeline was restructured into four bounded stages with clear responsibilities, a single authoritative scoring point and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Score normalization"
description: "Covers how raw retrieval scores from RRF and composite scoring are min-max normalized to a common [0,1] range before fusion, so relevance signals compete on comparable scale."
---

# Score normalization

## 1. OVERVIEW

Covers how raw retrieval scores from RRF and composite scoring are min-max normalized to a common [0,1] range before fusion, so relevance signals compete on comparable scale.

Different search methods produce scores on different scales, like comparing grades from different schools. This feature puts all scores on the same 0-to-1 scale so they can be compared fairly before picking the best results. Without it, one method might always win just because its numbers happen to be bigger, not because its results are actually better.

---

## 2. CURRENT REALITY

Before normalization, RRF and composite scoring used different raw scales. In `shared/algorithms/rrf-fusion.ts`, RRF uses `1 / (k + rank)` with `DEFAULT_K = 60`, so a top-ranked per-source contribution starts near `1/61 ~= 0.016` and decays by rank (with convergence bonuses potentially pushing combined raw scores above `0.1`). Composite scoring already operates in a `0-1` band.

Min-max normalization now maps both outputs to `0-1`, letting relevance signals compete on comparable scale instead of whichever subsystem emits larger raw magnitudes. Single-result queries and equal-score edge cases normalize to `1.0`.
Plan update
Running a documentation traceability pass over feature catalog categories 11-21, prioritizing the largest categories first and using code/path verification to surface drift before manual confirmation.
  ✓ Inventory snippet files and category counts for categories 11-21
  → Read snippet structure and extract referenced files/functions/flags for all snippets
  • Cross-check referenced code paths and key behaviors against mcp_server, scripts, and shared
  • Assemble category-by-category alignment report with findings summary
tool cocoindex_code.search({"query":"quality loop save-time auto-fix retries insufficient context abort template contract","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":"typescript","limit":5,"refresh_index":true})
cocoindex_code.search({"query":"quality loop save-time auto-fix retries insufficient context abort template contract","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":"typescript","limit":5,"refresh_index":true}) failed in 3ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"4 stage retrieval pipeline candidate generation fusion rerank filter score invariant","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":"typescript","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"4 stage retrieval pipeline candidate generation fusion rerank filter score invariant","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":"typescript","limit":5,"refresh_index":false}) failed in 0ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"score normalization min-max RRF composite scoring feature flag","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":"typescript","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"score normalization min-max RRF composite scoring feature flag","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":"typescript","limit":5,"refresh_index":false}) failed in 1ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
codex
The semantic search MCP is available, and I hit a quick schema mismatch on the first call. I’m retrying with the correct argument shape so the architectural checks are grounded in actual code rather than filename guesses.
tool cocoindex_code.search({"query":"quality loop save-time auto-fix retries insufficient context abort template contract","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":["typescript"],"limit":5,"refresh_index":true})
cocoindex_code.search({"query":"quality loop save-time auto-fix retries insufficient context abort template contract","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":["typescript"],"limit":5,"refresh_index":true}) success in 5.08s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
tool cocoindex_code.search({"query":"4 stage retrieval pipeline candidate generation fusion rerank filter score invariant","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":["typescript"],"limit":5,"refresh_index":false})
cocoindex_code.search({"query":"4 stage retrieval pipeline candidate generation fusion rerank filter score invariant","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":["typescript"],"limit":5,"refresh_index":false}) success in 237ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
tool cocoindex_code.search({"query":"score normalization min-max RRF composite scoring feature flag","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":["typescript"],"limit":5,"refresh_index":false})
cocoindex_code.search({"query":"score normalization min-max RRF composite scoring feature flag","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**"],"languages":["typescript"],"limit":5,"refresh_index":false}) success in 230ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
codex
I hit a sandbox quirk around here-doc temp files, so I’m switching to inline `python -c` for the inventory checks. Same verification, just in a form the read-only sandbox accepts.
exec
/bin/zsh -lc 'python3 -c $'"'import re, json\\nfrom pathlib import Path\\nroot = Path(\".opencode/skill/system-spec-kit/feature_catalog\")\\ncat_dirs = [p for p in sorted(root.iterdir()) if p.is_dir() and re.match(r\""'^(1[1-9]|20|21)--", p.name)]'"\\nrows=[]\\nfor cat in cat_dirs:\\n    for md in sorted(cat.glob(\"*.md\")):\\n        text = md.read_text()\\n        m = re.search(r\""'^title:'"\\\\s*\\\\\\\"?(.*?)\\\\\\\"?\\\\s*"'$", text, re.M)'"\\n        title = m.group(1) if m else md.stem\\n        refs = re.findall(r\""'`([''^`]+(?:'"\\\\.(?:ts|js|mjs|cjs|json|sh|md)))"'`", text)'"\\n        unique=[]\\n        for r in refs:\\n            if r not in unique:\\n                unique.append(r)\\n        missing=[]\\n        for r in unique:\\n            if not (Path(\".opencode/skill/system-spec-kit\")/r).exists():\\n                missing.append(r)\\n        rows.append({\"category\": cat.name, \"file\": str(md), \"title\": title, \"refs\": unique, \"missing\": missing})\\nprint(json.dumps({\"total\": len(rows), \"missing_total\": sum(len(r[\"missing\"]) for r in rows), \"with_missing\": [r for r in rows if r[\"missing\"]]}, indent=2))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 3.29s:
2026-03-25 08:20:31.503 xcodebuild[70306:14150921]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:20:31.803 xcodebuild[70306:14150888] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-07Mg8LJb' (errno=Operation not permitted)
2026-03-25 08:20:32.696 xcodebuild[72295:14154370]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:20:32.995 xcodebuild[72295:14154313] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
{
  "total": 139,
  "missing_total": 298,
  "with_missing": [
    {
      "category": "11--scoring-and-calibration",
      "file": ".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md",
      "title": "Cold-start novelty boost",
      "refs": [
        "composite-scoring.ts",
        "mcp_server/lib/scoring/composite-scoring.ts",
        "mcp_server/lib/scoring/folder-scoring.ts",
        "mcp_server/lib/scoring/importance-tiers.ts",
        "mcp_server/lib/scoring/interference-scoring.ts",
exec
/bin/zsh -lc 'python3 -c $'"'import re, json\\nfrom pathlib import Path\\nbase = Path(\".opencode/skill/system-spec-kit\")\\nroot = base / \"feature_catalog\"\\ncat_dirs = [p for p in sorted(root.iterdir()) if p.is_dir() and re.match(r\""'^(1[1-9]|20|21)--", p.name)]'"\\nrows=[]\\nfor cat in cat_dirs:\\n    for md in sorted(cat.glob(\"*.md\")):\\n        text = md.read_text()\\n        refs = []\\n        for r in re.findall(r\""'`([''^`]+(?:'"\\\\.(?:ts|js|mjs|cjs|json|sh|md)))"'`", text):'"\\n            if \"/\" in r and r not in refs:\\n                refs.append(r)\\n        missing=[r for r in refs if not (base/r).exists()]\\n        if missing:\\n            rows.append({\"category\":cat.name,\"file\":md.name,\"missing\":missing})\\nprint(json.dumps({\"files_with_missing_full_paths\": len(rows), \"details\": rows}, indent=2))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.98s:
2026-03-25 08:20:58.294 xcodebuild[46097:14271679]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:20:58.472 xcodebuild[46097:14271646] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-G1PxDrQd' (errno=Operation not permitted)
2026-03-25 08:20:58.973 xcodebuild[48328:14275162]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:20:59.162 xcodebuild[48328:14275121] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
{
  "files_with_missing_full_paths": 32,
  "details": [
    {
      "category": "11--scoring-and-calibration",
      "file": "13-scoring-and-fusion-corrections.md",
      "missing": [
        "pipeline/types.ts",
        "mcp_server/lib/search/rsf-fusion.ts",
        "mcp_server/tests/rsf-fusion-edge-cases.vitest.ts",
        "mcp_server/tests/rsf-fusion.vitest.ts"
      ]
    },
    {
codex
The first automated pass is useful: it separates superficial shorthand references from likely real drift. I’m now reading the suspicious files and checking the codebase for removed or renamed implementations so we don’t over-report path-style issues as missing features.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Scoring and fusion corrections"
description: "Covers nine scoring fixes including intent weight recency, five-factor weight normalization, stack overflow prevention, BM25 specFolder filter, shared `resolveEffectiveScore` consolidation, and RSF ID canonicalization."
---

# Scoring and fusion corrections

## 1. OVERVIEW

Covers nine scoring fixes including intent weight recency, five-factor weight normalization, stack overflow prevention, BM25 specFolder filter, shared `resolveEffectiveScore` consolidation, and RSF ID canonicalization.

These nine fixes address problems in how scores are calculated and combined. Issues ranged from weights that did not add up to 100% to a method that crashed when processing large batches and a filter that compared apples to oranges. Each fix makes the scoring math more accurate and stable, ensuring the final ranking truly reflects which results are most relevant to your question.

---

## 2. CURRENT REALITY

Nine scoring issues were fixed:

- **Intent weight recency (#5):** `applyIntentWeights` now includes timestamp-based recency scoring. Uses loop-based min/max to find timestamp range (no spread operator stack overflow).
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Search Pipeline Features (SPECKIT_*)"
description: "Feature flag reference for the Spec Kit Memory search pipeline controls, rollout gates, and retrieval-shaping toggles."
---

# Search Pipeline Features (SPECKIT_*)

This document captures the implemented behavior, source references, and validation scope for the search-pipeline flag surface that is still read by code or intentionally retained as a live compatibility shim. These flags are the main control panel for how search works, letting operators tune fallback logic, reranking, telemetry, and rollout gates without changing code.

---

## TABLE OF CONTENTS

- [OVERVIEW](#1--overview)
- [CURRENT REALITY](#2--current-reality)
- [SOURCE FILES](#3--source-files)
- [SOURCE METADATA](#4--source-metadata)

---

exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts | rg 'rsf-fusion|local-reranker|tool-cache|access-tracker|quality-loop|session-manager|checkpoints|reporting-dashboard|working-memory|retrieval-telemetry|shadow-scoring|retention|layer-definitions|tools/index|session-state|confidence-scoring|recovery-payload|query-surrogates|hyde|llm-reformulation|retry-manager|file-watcher|profile-formatters|preflight|memory-parser|vector-index-store|vector-index-schema|cross-encoder|bm25-index|trigger-matcher|eval-db|query-decomposer|learned-feedback|capability-flags|memory-index-discovery|memory-context|memory-search|memory-index|causal-boost|channel-representation|composite-scoring|co-activation|query-classifier|confidence-truncation|folder-relevance|graph-calibration|graph-lifecycle|graph-flags|fsrs-scheduler|feedback-ledger|result-explainability|session-boost'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Hierarchical scope governance, governed ingest, retention, and audit"
description: "Hierarchical scope governance enforces multi-scope controls across ingest and retrieval with provenance requirements, retention policies and an audit trail."
---

# Hierarchical scope governance, governed ingest, retention, and audit

## 1. OVERVIEW

Hierarchical scope governance enforces multi-scope controls across ingest and retrieval with provenance requirements, retention policies and an audit trail.

This feature controls who can save and read memories and keeps a record of every decision it makes. When someone tries to save information, the system checks their identity and requires proof of where the information came from. It is like a secure document room where you must show your badge, sign in and explain what you are filing before you are allowed to add or retrieve anything.

---

## 2. CURRENT REALITY

Phase 5 added governed multi-scope controls across ingest and retrieval. Scope is modeled hierarchically (`tenant`, `user` or `agent` and `session`) so reads and writes are evaluated against explicit actor boundaries.

Governed ingest now requires provenance metadata (`provenanceSource`, `provenanceActor`) when scoped identity fields are provided. Ingest attempts that carry scope identifiers without required provenance are rejected instead of being accepted as ambiguous writes.
exec
/bin/zsh -lc 'rg -n "withSyncedScoreAliases|syncScoreAliasesInPlace|resolveEffectiveScore|fuseResultsCrossVariant|canonicalRrfId|SPECKIT_RSF_FUSION|fuseResultsRsfMulti|fuseResultsRsfCrossVariant" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "validateGovernedIngest|provenanceSource|provenanceActor|retentionPolicy|deleteAfter|audit" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/shared/algorithms/README.md:81:| `fuseResultsCrossVariant`    | Function   | Cross-variant RRF for multi-query RAG pipelines                |
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:113:function canonicalRrfId(id: number | string): string {
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:209:    const key = canonicalRrfId(item.id);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:230:    const key = canonicalRrfId(item.id);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:301:      const key = canonicalRrfId(item.id);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:480:function fuseResultsCrossVariant(
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:497:      const key = canonicalRrfId(result.id);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:512:      const key = canonicalRrfId(result.id);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:624:  canonicalRrfId,
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:628:  fuseResultsCrossVariant,
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:108: * Mirrors the resolveEffectiveScore fallback chain in pipeline/types.ts.
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:5:import { fuseResults, fuseResultsMulti, fuseResultsCrossVariant, SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:226:describe('C138-P3: fuseResultsCrossVariant', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:228:    const fused = fuseResultsCrossVariant([]);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:238:    const crossVariant = fuseResultsCrossVariant([variant0]);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:253:    const fused = fuseResultsCrossVariant([variant0, variant1]);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:267:    const fused = fuseResultsCrossVariant([
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:289:    const fused = fuseResultsCrossVariant([variant0, variant1, variant2]);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:308:    const fused = fuseResultsCrossVariant([variant0, variant1]);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:332:  it('C138-CV9: fuseResultsCrossVariant honors explicit k=0', () => {
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:41:// History (audit trail for file-watcher deletes)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:413:        console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:51:  validateGovernedIngest,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:677:    provenanceSource,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:678:    provenanceActor,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:680:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:681:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:702:  const governanceDecision = validateGovernedIngest({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:708:    provenanceSource,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:709:    provenanceActor,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:711:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:712:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:953:        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:            actor: provenanceActor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:135:  provenanceSource?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:136:  provenanceActor?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:138:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:71:- **Mutation Ledger** -- Every create/update action appends to the mutation ledger for audit trail.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:100:        // Placed after deleteMemory to avoid false audit rows for non-existent IDs.
exec
/bin/zsh -lc "rg -n \"SPECKIT_STRICT_SCHEMAS|strict\\(|passthrough\\(|setInstructions|buildServerInstructions|SPECKIT_DYNAMIC_INIT|includeTrace|sessionState|goalRefinement|SPECKIT_RESPONSE_TRACE\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:233:async function buildServerInstructions(): Promise<string> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:269:const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1118:      const dynamicInstructions = await buildServerInstructions();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1120:        serverWithInstructions.setInstructions?.(dynamicInstructions);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:178:  includeTrace: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:580:    includeTrace: options.includeTrace || false, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:607:    includeTrace: options.includeTrace || false, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:639:    includeTrace: options.includeTrace || false, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:833:    includeTrace,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:854:            includeTrace === true ? sessionTransition : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1033:    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1070:  options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1112:  const tracedResult0: ContextResult = effectiveMode === 'quick' && options.includeTrace === true
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1168:      includeTrace: options.includeTrace === true,
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:180:      includeTrace: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:183:        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:201:  includeTrace?: boolean;
codex
I’ve confirmed a big pattern: several “missing” hits are just shorthand paths, but category `19` looks different because it mixes shorthand with genuinely removed modules and flags. I’m checking that flag table directly against live `search-flags` and module references now so we can separate path drift from feature drift.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Search Flags
// ───────────────────────────────────────────────────────────────
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { isFeatureEnabled } from '../cognitive/rollout-policy';

// Feature catalog: Quality-aware 3-tier search fallback
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Negative feedback confidence signal

/* ───────────────────────────────────────────────────────────────
   2. CORE FLAGS
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Template Compliance Contract Enforcement"
description: "3-layer defense-in-depth system ensuring all spec folder documents generated by AI agents pass structural validation on first write. Layer 1 injects compact anchor-to-H2 contracts into @speckit agent definitions. Layer 2 adds post-write validation protocol with fix loops. Layer 3 enforces content minimum rules."
---

# Template Compliance Contract Enforcement

## 1. OVERVIEW

Template Compliance Contract Enforcement is a 3-layer defense-in-depth system that ensures all spec folder documents generated by AI agents pass structural validation on first write.

The problem: AI agents writing spec folder markdown files frequently produce documents that fail structural validation — wrong heading levels, missing anchors, skipped required sections. Fixing these after the fact wastes cycles and clutters commit history.

The solution uses three complementary layers:

1. **Layer 1 — Agent Knowledge (Prevention):** A compact structural contract is embedded directly in all five CLI `@speckit` agent definitions. Before an agent writes any spec folder document, it already knows the exact heading structure, required anchors, and content minimums for each documentation level. The canonical source of truth is a shared reference file; each agent definition includes a 49-line compact version.

2. **Layer 2 — Post-Write Validation (Detection + Repair):** Immediately after writing any spec folder `.md` file, the agent runs `validate.sh --strict` against the spec folder. Exit codes are parsed (0 = pass, 1 = warnings, 2 = errors). On failure, the agent enters a fix loop of up to 3 attempts before escalating.

3. **Layer 3 — Content Minimum Rules (Depth Safeguard):** Section-count and minimum-content rules enforce that documents are not only structurally valid, but also substantive enough to pass the level-specific quality bar. These checks backstop the agent contract and the validator so thin placeholder content cannot slip through.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Post-save quality review"
description: "After a memory file is written, a post-save quality review compares saved frontmatter against the original JSON payload and emits machine-readable severity-graded findings before indexing begins."
---

# Post-save quality review

## 1. OVERVIEW

The post-save quality review runs after the memory file is written (Step 10.5 in the save workflow) and before indexing starts (Step 11). It compares the saved frontmatter and MEMORY METADATA block against the original JSON payload to detect propagation failures and field-level quality issues.

This is a verification step that catches cases where the rendering pipeline silently dropped or degraded caller-supplied fields — generic titles, path-fragment trigger phrases, missing decisions, wrong contextType — before those problems become permanent in the index. Think of it as a proof-reader who checks the printed form against the original application to make sure nothing was lost in transcription.

---

## 2. CURRENT REALITY

The post-save quality review runs as Step 10.5 in the save workflow, between file write and indexing. It is always active.

Current detection checks:
exec
/bin/zsh -lc 'rg -n "SPECKIT_ARCHIVAL|SPECKIT_BATCH_LEARNED_FEEDBACK|SPECKIT_DYNAMIC_INIT|SPECKIT_RESPONSE_TRACE|SPECKIT_PROGRESSIVE_DISCLOSURE_V1|SPECKIT_SESSION_RETRIEVAL_STATE_V1|SPECKIT_RESULT_CONFIDENCE_V1|SPECKIT_RESULT_EXPLAIN_V1|SPECKIT_RSF_FUSION|SPECKIT_SHADOW_SCORING|SPECKIT_QUERY_SURROGATES|SPECKIT_QUERY_DECOMPOSITION|SPECKIT_CONTEXT_HEADERS|SPECKIT_STRICT_SCHEMAS|SPECKIT_PRE_SAVE_DEDUP|SPECKIT_ASSISTIVE_RECONSOLIDATION|SPECKIT_AUTO_RESUME|SPECKIT_WORKING_MEMORY|SPECKIT_CONSUMPTION_LOG" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1018:    // Feature-flag gated by SPECKIT_BATCH_LEARNED_FEEDBACK (default ON, graduated).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:45: * and auto-merged.  Requires SPECKIT_ASSISTIVE_RECONSOLIDATION=true.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:58: * Default: ON (graduated). Set SPECKIT_ASSISTIVE_RECONSOLIDATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:129:  /** Populated when SPECKIT_ASSISTIVE_RECONSOLIDATION is enabled and a
.opencode/skill/system-spec-kit/mcp_server/README.md.bak:808:| `SPECKIT_STRICT_SCHEMAS`        | `true`  | Enforce strict Zod input validation for all MCP tools (`false` allows passthrough unknown keys) |
.opencode/skill/system-spec-kit/mcp_server/README.md.bak:809:| `SPECKIT_RESPONSE_TRACE`        | `false` | Include provenance-rich `scores` / `source` / `trace` response envelopes by default |
.opencode/skill/system-spec-kit/mcp_server/README.md.bak:811:| `SPECKIT_DYNAMIC_INIT`          | `true`  | Inject dynamic startup instructions with live memory/index counts |
.opencode/skill/system-spec-kit/mcp_server/README.md.bak:812:| `SPECKIT_CONTEXT_HEADERS`       | `true`  | Prepend contextual tree headers to markdown content chunks in search results |
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:183:        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
.opencode/skill/system-spec-kit/mcp_server/README.md:904:| `SPECKIT_RESPONSE_TRACE` | `false` | Include retrieval trace in responses |
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:5:// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:27:  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:438:  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:29:Strict mode is on by default (`SPECKIT_STRICT_SCHEMAS !== 'false'`). When enabled, unknown parameters cause validation to fail instead of passing through silently.
.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:47:**Schema factory (`getSchema`)** -- Wraps `z.object()` with strict/passthrough toggling based on the `SPECKIT_STRICT_SCHEMAS` env var. All tool schemas use this factory.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:10:// Feature flag: SPECKIT_BATCH_LEARNED_FEEDBACK (default ON, graduated)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:20:/** Shadow-only batch learning pipeline. Callable on-demand via runBatchLearning(db, opts). No live ranking mutations — writes to batch_learning_log for observability. Feature-flag gated by SPECKIT_BATCH_LEARNED_FEEDBACK (default ON). */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:128: * Default: ON (graduated). Set SPECKIT_BATCH_LEARNED_FEEDBACK=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:80:      "expectedResultDescription": "Should surface memories about SPECKIT_WORKING_MEMORY, SPECKIT_EVENT_DECAY, working-memory.ts, and archival-manager.ts. The relationship is that event decay reduces attention scores over time.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:15:// SPECKIT_SHADOW_SCORING is retained for tests/docs, but the write path remains disabled.
codex
The post-save review snippet looks substantively aligned; its only obvious issue is a bad cross-link to category `16`. I’m sanity-checking the repo-root agent references next because some of the “missing” entries may actually be valid from workspace root, not from the skill package root.
exec
/bin/zsh -lc 'test -f .opencode/skill/system-spec-kit/references/template-compliance-contract.md && echo present || echo missing; test -f .opencode/skill/system-spec-kit/scripts/utils/template-structure.js && echo present || echo missing' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
present
present
exec
/bin/zsh -lc "rg --files .opencode/agent .claude/agents .codex/agents .gemini/agents 2>/dev/null | rg 'speckit'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.codex/agents/speckit.toml
.claude/agents/speckit.md
.gemini/agents/speckit.md
.opencode/agent/speckit.md
.opencode/agent/chatgpt/speckit.md
exec
/bin/zsh -lc "rg --files .opencode/command 2>/dev/null | rg 'memory/(learn|save)\\.md|spec_kit/(debug|complete)\\.md|README\\.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/command/spec_kit/complete.md
.opencode/command/spec_kit/debug.md
.opencode/command/memory/save.md
.opencode/command/memory/learn.md
exec
/bin/zsh -lc "ls .opencode/skill/system-spec-kit/scripts/core | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
README.md
alignment-validator.ts
config.ts
content-cleaner.ts
file-writer.ts
frontmatter-editor.ts
index.ts
memory-indexer.ts
memory-metadata.ts
post-save-review.ts
quality-gates.ts
quality-scorer.ts
subfolder-utils.ts
title-builder.ts
topic-extractor.ts
tree-thinning.ts
workflow-accessors.ts
workflow-path-utils.ts
workflow.ts
exec
/bin/zsh -lc 'python3 -c $'"'import re, json\\nfrom pathlib import Path\\nworkspace = Path(\".\")\\nskill = Path(\".opencode/skill/system-spec-kit\")\\nroot = skill / \"feature_catalog\"\\ncat_dirs = [p for p in sorted(root.iterdir()) if p.is_dir() and re.match(r\""'^(1[1-9]|20|21)--", p.name)]'"\\nrows=[]\\nfor cat in cat_dirs:\\n    for md in sorted(cat.glob(\"*.md\")):\\n        text = md.read_text()\\n        refs = []\\n        for r in re.findall(r\""'`([''^`]+(?:'"\\\\.(?:ts|js|mjs|cjs|json|sh|md|toml)))"'`", text):'"\\n            if \"/\" in r and r not in refs:\\n                refs.append(r)\\n        missing=[]\\n        for r in refs:\\n            if not ((skill / r).exists() or (workspace / r).exists()):\\n                missing.append(r)\\n        if missing:\\n            rows.append({\"category\":cat.name,\"file\":md.name,\"missing\":missing})\\nprint(json.dumps({\"files_with_missing_refs\": len(rows), \"details\": rows}, indent=2))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.74s:
2026-03-25 08:22:37.915 xcodebuild[92817:14669244]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:22:38.084 xcodebuild[92817:14669199] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-CjBsH42q' (errno=Operation not permitted)
2026-03-25 08:22:38.520 xcodebuild[94059:14671229]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:22:38.692 xcodebuild[94059:14671213] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
{
  "files_with_missing_refs": 30,
  "details": [
    {
      "category": "11--scoring-and-calibration",
      "file": "13-scoring-and-fusion-corrections.md",
      "missing": [
        "pipeline/types.ts",
        "mcp_server/lib/search/rsf-fusion.ts",
        "mcp_server/tests/rsf-fusion-edge-cases.vitest.ts",
        "mcp_server/tests/rsf-fusion.vitest.ts"
      ]
    },
    {
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts | rg 'ablation-framework|dynamic-token-budget|extraction-adapter|corrections|rollout-policy|eval-logger|logger.ts|entity-linker|hybrid-search|save-quality-gate|session-boost|context-server|config.ts"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/shared/config.ts
.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts
.opencode/skill/system-spec-kit/scripts/utils/logger.ts
.opencode/skill/system-spec-kit/scripts/core/config.ts
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/dynamic-token-budget.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts
exec
/bin/zsh -lc 'rg -n "SPECKIT_ABLATION|eval_run_ablation|ablation-framework|SPECKIT_DYNAMIC_TOKEN_BUDGET|dynamic-token-budget|SPECKIT_PRE_SAVE_DEDUP|SPECKIT_EAGER_WARMUP|SPECKIT_ARCHIVAL|SPECKIT_CONSUMPTION_LOG|isConsumptionLogEnabled|SPECKIT_RESPONSE_PROFILE_V1|SPECKIT_RESULT_EXPLAIN_V1|SPECKIT_PROGRESSIVE_DISCLOSURE_V1" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:826:  // Set SPECKIT_EAGER_WARMUP=true for legacy eager warmup behavior
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:866:    console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
.opencode/skill/system-spec-kit/shared/embeddings.ts:297: * - SPECKIT_EAGER_WARMUP=true: Force eager loading at startup (legacy behavior)
.opencode/skill/system-spec-kit/shared/embeddings.ts:298: * - SPECKIT_LAZY_LOADING=false: Alias for SPECKIT_EAGER_WARMUP=true
.opencode/skill/system-spec-kit/shared/embeddings.ts:310: * SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING env vars are inert.
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1464:  // Phase 004 T035-T036: Pre-save overlap check (advisory, enabled by default — set SPECKIT_PRE_SAVE_DEDUP=false to disable)
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1465:  if (process.env.SPECKIT_PRE_SAVE_DEDUP !== 'false' && process.env.SPECKIT_PRE_SAVE_DEDUP !== '0') {
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:133:  handle_eval_run_ablation,
.opencode/skill/system-spec-kit/mcp_server/api/eval.ts:19:} from '../lib/eval/ablation-framework';
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:40:  'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:    case 'eval_run_ablation':          return handleEvalRunAblation(parseArgs<EvalRunAblationArgs>(validateToolArgs('eval_run_ablation', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:25:} from '../lib/eval/ablation-framework';
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:45:// Feature catalog: Ablation studies (eval_run_ablation)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:162:/** Handle eval_run_ablation tool — runs ablation analysis or K-sensitivity sweep.
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:179:      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:180:      { flag: 'SPECKIT_ABLATION' }
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:242:    tool: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:305:    tool: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:346:const handle_eval_run_ablation = handleEvalRunAblation;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:351:  handle_eval_run_ablation,
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/02-2-session-and-cache.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuration.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "2. Session and Cache"
description: "This document captures the implemented behavior, source references, and validation scope for 2. Session and Cache."
---

# 2. Session and Cache

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 2. Session and Cache.

These settings control short-term memory and caching behavior. They decide how long the system remembers what it already returned, how cache entries expire, and whether duplicate results are filtered across a session.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DISABLE_SESSION_DEDUP` | `false` | boolean | `lib/session/session-manager.ts` | When `'true'`, disables cross-turn session deduplication entirely. All memories are returned on every call regardless of whether they were already sent in this session. |
 succeeded in 0ms:
---
title: "3. MCP Configuration"
description: "This document captures the implemented behavior, source references, and validation scope for 3. MCP Configuration."
---

# 3. MCP Configuration

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 3. MCP Configuration.

These are guardrail settings for save-time validation. They define size limits, token estimates, duplicate thresholds, and anchor strictness so problematic files can be caught before indexing.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MCP_ANCHOR_STRICT` | `false` | boolean | `lib/validation/preflight.ts` | When `'true'`, enforces strict anchor format validation during pre-flight checks. Invalid anchor IDs cause the save to be rejected. Default is lenient mode which logs warnings but does not block. |
exec
/bin/zsh -lc 'rg -n "DISABLE_SESSION_DEDUP|SESSION_DEDUP_DB_UNAVAILABLE_MODE|SESSION_MAX_ENTRIES|SESSION_TTL_MINUTES|STALE_CLEANUP_INTERVAL_MS|STALE_SESSION_THRESHOLD_MS|ENABLE_TOOL_CACHE|TOOL_CACHE_CLEANUP_INTERVAL_MS|TOOL_CACHE_MAX_ENTRIES|TOOL_CACHE_TTL_MS|ENABLE_BM25" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:170:  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:171:  maxEntriesPerSession: parseInt(process.env.SESSION_MAX_ENTRIES as string, 10) || 100,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:172:  enabled: process.env.DISABLE_SESSION_DEDUP !== 'true',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:173:  dbUnavailableMode: process.env.SESSION_DEDUP_DB_UNAVAILABLE_MODE === 'allow' ? 'allow' : 'block',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:187:const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:188:const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:240:  }, STALE_CLEANUP_INTERVAL_MS);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:671: * @param thresholdMs - Inactivity threshold in milliseconds (default: STALE_SESSION_THRESHOLD_MS / 24h)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:673:function cleanupStaleSessions(thresholdMs: number = STALE_SESSION_THRESHOLD_MS): StaleCleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:41:| Session TTL | 30 min | Configurable via `SESSION_TTL_MINUTES` |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:254:| Session dedup disabled | Check `DISABLE_SESSION_DEDUP` env var |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:255:| TTL too short/long | Set `SESSION_TTL_MINUTES` env var |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:278:| `SESSION_TTL_MINUTES` | 30 | Session timeout in minutes |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:279:| `SESSION_MAX_ENTRIES` | 100 | Maximum entries per session |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:280:| `DISABLE_SESSION_DEDUP` | false | Set 'true' to disable deduplication |
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:31:  delete process.env.ENABLE_BM25;
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:37:  for (const key of ['VOYAGE_API_KEY', 'COHERE_API_KEY', 'RERANKER_LOCAL', 'ENABLE_BM25']) {
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:112:  it('BM01: returns true when ENABLE_BM25 not set', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:113:    delete process.env.ENABLE_BM25;
.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:118:  it('BM02: returns false when ENABLE_BM25=false', () => {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-implement-and-remove-deprecated-features.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-hydra-baseline-revalidation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-hydra-baseline-revalidation.md: No such file or directory
 exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-implement-and-remove-deprecated-features.md: No such file or directory
exec
/bin/zsh -lc 'rg -n "MCP_ANCHOR_STRICT|MCP_CHARS_PER_TOKEN|MCP_DUPLICATE_THRESHOLD|MCP_MAX_CONTENT_LENGTH|MCP_MAX_MEMORY_TOKENS|MCP_MIN_CONTENT_LENGTH|MCP_TOKEN_WARNING_THRESHOLD" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:74:/** Rough token-to-char ratio: 1 token ~ 4 chars (env-configurable via MCP_CHARS_PER_TOKEN) */
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:76:const _parsedCPT = parseFloat(process.env.MCP_CHARS_PER_TOKEN || '4');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:102:| Chars per token | 4 | `MCP_CHARS_PER_TOKEN` |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:103:| Max tokens | 8000 | `MCP_MAX_MEMORY_TOKENS` |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:104:| Warning threshold | 80% | `MCP_TOKEN_WARNING_THRESHOLD` |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:112:| `< MCP_MIN_CONTENT_LENGTH` | Hard fail (`PF031`) |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:113:| `>= CHUNKING_THRESHOLD` and `<= MCP_MAX_CONTENT_LENGTH` | Warning (`PF030`) with chunking guidance |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:114:| `> MCP_MAX_CONTENT_LENGTH` | Hard fail (`PF030`) |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:116:Default cap is `MCP_MAX_CONTENT_LENGTH=250000` (250KB), configurable via environment.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:301:MCP_CHARS_PER_TOKEN=4
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:302:MCP_MAX_MEMORY_TOKENS=8000
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:303:MCP_TOKEN_WARNING_THRESHOLD=0.8
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:306:MCP_MIN_CONTENT_LENGTH=10
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:307:MCP_MAX_CONTENT_LENGTH=250000
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:310:MCP_DUPLICATE_THRESHOLD=0.95
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:313:MCP_ANCHOR_STRICT=true
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:189:  charsPerToken: parseFloat(process.env.MCP_CHARS_PER_TOKEN || '4'),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:190:  max_tokens_per_memory: parseInt(process.env.MCP_MAX_MEMORY_TOKENS || '8000', 10),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:191:  warning_threshold: parseFloat(process.env.MCP_TOKEN_WARNING_THRESHOLD || '0.8'),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:194:  min_content_length: parseInt(process.env.MCP_MIN_CONTENT_LENGTH || '10', 10),
codex
I hit a simple filename mismatch in categories `20` and `21`, so I’m listing those actual files and folding them into the last pass. The configuration snippets themselves look consistent so far, with category `19` standing out as the main drift cluster.
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation -maxdepth 1 -type f -name '*.md' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "End-to-end success-envelope verification"
description: "End-to-end success-envelope verification asserts that the finalized response envelope preserves hint append, auto-surface context and token metadata correctness."
---

# End-to-end success-envelope verification

## 1. OVERVIEW

End-to-end success-envelope verification asserts that the finalized response envelope preserves hint append, auto-surface context and token metadata correctness.

This is a set of automated tests that checks the entire response from start to finish: hints are included, previously surfaced context is preserved and the size count is correct. It acts as a final quality check before a response leaves the system, like a shipping inspector who opens the box, verifies everything is inside and confirms the label is accurate before it goes out the door.

---

## 2. CURRENT REALITY

Phase 014 verification includes end-to-end success-envelope assertions in `tests/context-server.vitest.ts`. This coverage verifies the finalized success-path hint append flow, preserved `autoSurfacedContext` and final token metadata behavior together so response-envelope regressions fail fast.

---
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features -maxdepth 1 -type f -name '*.md' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Mode-aware response profiles"
description: "Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the SPECKIT_RESPONSE_PROFILE_V1 flag. `memory_search` applies them today, while `memory_context` still carries a dead `profile` declaration."
---

# Mode-aware response profiles

## 1. OVERVIEW

Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the `SPECKIT_RESPONSE_PROFILE_V1` flag. Live runtime wiring is still partial: `memory_search` applies them while `memory_context` still carries a dead `profile` declaration.

Different situations call for different response shapes. A quick question needs just the top result and a one-line explanation. A research session needs the full list with an evidence digest and follow-up suggestions. Resuming prior work needs state, next steps, and blockers. The formatter layer supports those shapes, but the live integration is incomplete: `memory_search` can apply response profiles, while `memory_context` only declares `profile?: string` and never consumes it. When the flag is off, the original full response is returned unchanged.

---

## 2. CURRENT REALITY

Four profiles are implemented in the formatter layer:
- **quick**: `topResult + oneLineWhy + omittedCount + tokenReduction` — minimal response for fast decision-making. Computes token savings percentage between original and returned payload.
- **research**: `results[] + evidenceDigest + followUps[]` — full result list with synthesis (context types, average score, importance tiers) and up to 3 suggested next queries.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Remediation and revalidation (audit category stub)"
description: "Minimal catalog coverage stub for audit phase 021-remediation-revalidation."
---

# Remediation and revalidation (audit category stub)

This category exists to cover audit phase `021-remediation-revalidation`.

Current status: documentation stub only; no standalone feature entries have been split out yet.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Implement and remove deprecated features (audit category stub)"
description: "Minimal catalog coverage stub for audit phase 022-implement-and-remove-deprecated-features."
---

# Implement and remove deprecated features (audit category stub)

This category exists to cover audit phase `022-implement-and-remove-deprecated-features`.

Current status: documentation stub only; no standalone feature entries have been split out yet.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Feature flag governance"
description: "Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits."
---

# Feature flag governance

## 1. OVERVIEW

Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits.

Feature flags let you turn new features on or off without changing the code itself, like light switches for functionality. This governance process tracks which switches exist, who controls them and when old ones should be retired so the collection does not grow out of control.

---

## 2. CURRENT REALITY

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework defines operational targets (small active flag surface, explicit sunset windows and periodic audits). These are process controls, not hard runtime-enforced caps in code.
 succeeded in 0ms:
---
title: "Dead code removal"
description: "Completed remediation record for removed dead branches, feature flags, module-level state and function exports."
---

# Dead code removal

## 1. OVERVIEW

This entry records the completed dead-code cleanup rather than a live runtime feature. Approximately 360 lines of dead code across four categories have been verified absent from the source tree.

---

## 2. CURRENT REALITY

The codebase is clean across four dead-code categories:

**Hot-path branches:** `hybrid-search.ts` contains no RSF or shadow-scoring branches. Those code paths do not exist.

**Feature flag functions:** `isShadowScoringEnabled()` and `isRsfEnabled()` do not exist in the codebase. `isInShadowPeriod()` in `learned-feedback.ts` is active as the R11 shadow-period safeguard.
codex
The pattern is settling down: most snippets are behaviorally sound, and the remaining risk is mostly documentation drift from path notation, stale cross-links, or references to removed files. I’m doing one last spot check on the source-dist and category-stub entries before I synthesize the per-snippet matrix.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Source-dist alignment enforcement"
description: "Source-dist alignment enforcement validates that every .js file in mcp_server/dist/lib/ has a corresponding .ts source file, detecting orphaned build artifacts."
---

# Source-dist alignment enforcement

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Source-dist alignment enforcement validates that every `.js` file in `mcp_server/dist/lib/` has a corresponding `.ts` source file in `mcp_server/lib/`, detecting orphaned build artifacts that persist after source files are deleted or refactored.

Source files can be silently lost (deleted, renamed, or merged into other modules) while their compiled `dist/` output persists indefinitely. This creates phantom modules that appear functional at runtime but have no maintainable source. The alignment script catches this drift automatically.

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Dry-run preflight for memory_save"
description: "The `dryRun` parameter on `memory_save` runs preflight validation without indexing, database mutation or file writes."
---

# Dry-run preflight for memory_save

## 1. OVERVIEW

The `dryRun` parameter on `memory_save` runs preflight validation without indexing, database mutation or file writes.

Before committing a memory to storage, you can do a practice run to see if it would pass all the checks. Nothing gets saved or changed. It is like using the "print preview" button before printing: you catch problems before they become permanent, without wasting paper.

---

## 2. CURRENT REALITY

The `memory_save` tool accepts a `dryRun` parameter that still performs preflight validation without indexing, database mutation, or file writes, but dry-run no longer stops at preflight-only reporting.

Current dry-run behavior now surfaces the same early semantic decision points that a real save would encounter:
 succeeded in 0ms:
---
title: "7-layer tool architecture metadata"
description: "The 7-layer tool architecture defines token budgets, priorities and use-case guidance for each MCP tool layer (L1-L7) as governance metadata."
---

# 7-layer tool architecture metadata

## 1. OVERVIEW

The 7-layer tool architecture defines token budgets, priorities and use-case guidance for each MCP tool layer (L1-L7) as governance metadata.

The system has many different tools, and each one needs to know how much response space it is allowed to use and what kind of task it is best suited for. This feature organizes all tools into seven layers with budgets and guidance, like assigning departments in a company. It does not control how tools are called at runtime but helps recommend the right tool for the job.

---

## 2. CURRENT REALITY

The layer definitions module (`lib/architecture/layer-definitions.ts`) defines a 7-layer MCP architecture (L1 through L7) where each layer has token budgets, priorities, use-case guidance and tool membership. Layer IDs still map to task types (`search`, `browse`, `modify`, `checkpoint`, `analyze`, `maintenance`, `default`) for recommendation/hinting.

Runtime dispatch in `context-server.ts` has a single name-based dispatch hop (`dispatchTool(name, args)`), and that hop fans into 5 dispatcher modules in `tools/index.ts` (`context`, `memory`, `causal`, `checkpoint`, `lifecycle`). The 7-layer model is therefore metadata/governance (token budgets and advisory recommendations), not a 7-layer runtime classifier/router.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Constitutional memory as expert knowledge injection"
description: "Constitutional-tier memories receive retrieval directive metadata that instructs the LLM when to surface them."
---

# Constitutional memory as expert knowledge injection

## 1. OVERVIEW

Constitutional-tier memories receive retrieval directive metadata that instructs the LLM when to surface them.

Some memories are fundamental rules that should always come up when relevant, like "never delete production data." This feature tags those high-priority memories with instructions about when to surface them. It works like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X."

---

## 2. CURRENT REALITY

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/07-7-ci-and-build-informational.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "7. CI and Build (informational)"
description: "This document captures the implemented behavior, source references, and validation scope for 7. CI and Build (informational)."
---

# 7. CI and Build (informational)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 7. CI and Build (informational).

These are informational CI metadata variables, not feature toggles. They annotate records with branch context for traceability but do not change retrieval, scoring, or storage behavior.

---

## 2. CURRENT REALITY

These variables are read at runtime to annotate checkpoint and evaluation records with source-control context. They are not feature flags and have no effect on search or storage behavior.

| Name | Source | Description |
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"enrichWithRetrievalDirectives|retrieval_directive|shouldApplyScopeFiltering|hasGovernanceScope|context headers|injectContextualTree|profile\\?: string|applyResponseProfile|quality review|computeReviewScorePenalty|dryRun|would_pass|rejectionCode\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Local GGUF reranker via node-llama-cpp"
description: "Describes the `RERANKER_LOCAL` flag-gated local GGUF reranker using `node-llama-cpp` with `bge-reranker-v2-m3.Q4_K_M.gguf` in Stage 3, with strict activation criteria including model path readability and host memory thresholds."
---

# Local GGUF reranker via node-llama-cpp

## 1. OVERVIEW

Describes the `RERANKER_LOCAL` flag-gated local GGUF reranker using `node-llama-cpp` with `bge-reranker-v2-m3.Q4_K_M.gguf` in Stage 3, with strict activation criteria including model path readability and host memory thresholds.

After the initial search finds candidate results, this feature uses a small AI model running on your own computer to re-sort them for better accuracy. It works entirely offline with no network calls, so it is both private and free to use. If the model file is missing or the computer does not have enough memory, the system quietly skips this step and keeps the original order.

---

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** Implements the `RERANKER_LOCAL` flag with `node-llama-cpp` in Stage 3 using `bge-reranker-v2-m3.Q4_K_M.gguf` (~350MB). Activation is strict: `RERANKER_LOCAL` must equal `'true'`, rollout gating must permit the feature, the configured model path must be readable and the host must meet the total-memory threshold (8GB by default, 2GB when `SPECKIT_RERANKER_MODEL` is set). The guard intentionally checks total system RAM rather than free-memory readings. Sequential per-candidate inference remains intentional. If local execution is unavailable or runtime scoring fails, the local path returns the incoming order unchanged. New file: `lib/search/local-reranker.ts`.

The shared cross-encoder path now keys its reranker cache by provider, document order, and option bits such as `applyLengthPenalty`, and both cache lookup and cache store use that stronger key. That prevents false cache hits across providers or option combinations. The reranker status p95 latency calculation also now uses the bounded ceil-based percentile index, which removes the old off-by-one upward bias on small sample sets.
 succeeded in 0ms:
---
title: "Code standards alignment"
description: "Code standards alignment fixed 45 violations across AI-intent comments, MODULE/COMPONENT headers, import ordering and constant naming to match sk-code--opencode standards."
---

# Code standards alignment

## 1. OVERVIEW

Code standards alignment fixed 45 violations across AI-intent comments, MODULE/COMPONENT headers, import ordering and constant naming to match sk-code--opencode standards.

This was a cleanup pass that made the code follow a consistent style across the project. It fixed 45 places where comments, file headers, naming patterns or import ordering did not match the agreed-upon rules. Think of it like an editor going through a document to make sure every chapter uses the same formatting and citation style.

---

## 2. CURRENT REALITY

All modified files were reviewed against sk-code--opencode standards. 45 violations found and fixed: 26 AI-intent comment conversions (AI-WHY, AI-TRACE, AI-GUARD prefixes), 10 MODULE/COMPONENT headers added, import ordering corrections and constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`) in the extracted save mutex module.

---
 succeeded in 0ms:
.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:109:  rejectionCode: typeof MEMORY_SUFFICIENCY_REJECTION_CODE;
.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:391:    rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:204:  profile?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:279:    const isInsufficientContext = result.rejectionCode === MEMORY_SUFFICIENCY_REJECTION_CODE;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:290:        ...(result.rejectionCode ? { rejectionCode: result.rejectionCode } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:302:            'Use dryRun: true to inspect insufficiency reasons and evidence counts without writing',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:48:    rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:81:  rejectionCode?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:127:  dryRun?: boolean;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:74:import { reviewPostSaveQuality, printPostSaveReview, computeReviewScorePenalty } from './post-save-review';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1594:  // Step 10.5: Post-save quality review (JSON mode only)
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1614:      const scorePenalty = computeReviewScorePenalty(reviewResult.issues);
.opencode/skill/system-spec-kit/scripts/core/README.md:41:- `post-save-review.ts` - Post-save quality review — compares saved frontmatter against JSON payload, emits machine-readable severity-graded findings (Step 10.5)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:171:          rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:669:    dryRun = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:754:  if (dryRun && skipPreflight) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:758:    const dryRunSummary = buildDryRunSummary(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:766:      summary: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:769:        would_pass: preparedDryRun.validation.valid
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:791:        rejectionCode: preparedDryRun.sufficiencyResult.pass ? undefined : MEMORY_SUFFICIENCY_REJECTION_CODE,
exec
/bin/zsh -lc 'for d in .opencode/skill/system-spec-kit/feature_catalog/{11--scoring-and-calibration,12--query-intelligence,13--memory-quality-and-indexing,14--pipeline-architecture,15--retrieval-enhancements,16--tooling-and-scripts,17--governance,18--ux-hooks,19--feature-flag-reference,20--remediation-revalidation,21--implement-and-remove-deprecated-features}; do echo "== ${d##*/} =="; find "$d" -maxdepth 1 -type f -name '"'*.md' | sort | xargs -n1 basename; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 192ms:
02-mpab-chunk-to-memory-aggregation.md
03-chunk-ordering-preservation.md
04-template-anchor-optimization.md
05-validation-signals-as-retrieval-metadata.md
06-learned-relevance-feedback.md
07-search-pipeline-safety.md
08-performance-improvements.md
09-activation-window-persistence.md
10-legacy-v1-pipeline-removal.md
11-pipeline-and-mutation-hardening.md
12-dbpath-extraction-and-import-standardization.md
13-strict-zod-schema-validation.md
14-dynamic-server-instructions-at-mcp-initialization.md
15-warm-server-daemon-mode.md
16-backend-storage-adapter-abstraction.md
17-cross-process-db-hot-rebinding.md
18-atomic-write-then-index-api.md
19-embedding-retry-orchestrator.md
20-7-layer-tool-architecture-metadata.md
21-atomic-pending-file-recovery.md
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Audit phase mapping note (020 feature-flag-reference)"
description: "Records the slug-based mapping between audit phase 020 and the existing feature-flag-reference catalog category."
---

# Audit phase mapping note (020 feature-flag-reference)

Audit phase `020-feature-flag-reference` maps to this category by slug (`feature-flag-reference`).

The numeric prefixes are not the contract; matching is slug-based.
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/feature_catalog/{11--scoring-and-calibration,12--query-intelligence,13--memory-quality-and-indexing,14--pipeline-architecture,15--retrieval-enhancements,16--tooling-and-scripts,17--governance,18--ux-hooks,19--feature-flag-reference,20--remediation-revalidation,21--implement-and-remove-deprecated-features} -maxdepth 1 -type f -name '*.md' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/03-interference-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/06-embedding-cache.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/16-access-driven-popularity-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/19-learned-stage2-weight-combiner.md
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md
exec
/bin/zsh -lc 'rg -n "profile" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
120:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
121:  profile?: string;
codex
I’m checking the remaining ambiguous cases for “historical but still documented” features, especially anything tied to retired RSF or shadow paths. That’s the main place a snippet could cross from simple drift into truly missing behavior.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Relative score fusion in shadow mode"
description: "Relative score fusion (RSF) was fully removed — module, tests, and shadow metadata deleted. RRF is the sole fusion method."
---

# Relative score fusion in shadow mode

## 1. OVERVIEW

Removed from live ranking in Sprint 8. RSF implementation code, dedicated test files, and the `rsfShadow` metadata field were fully deleted during the v3 remediation sweep (updated 2026-03-25 per deep review).

When multiple search methods return ranked lists, RSF was one alternative way to merge them. RRF won the evaluation and RSF was deprecated. The module was retained temporarily for offline comparison but was never reactivated — it was removed as dead code.

---

## 2. CURRENT REALITY

RRF remains the sole live fusion method. RSF has been fully removed from the codebase.

The standalone RSF implementation and dedicated RSF test files have been deleted. RSF references in mixed test files (`cross-feature-integration-eval`, `feature-eval-query-intelligence`, `dead-code-regression`) have been surgically removed. The `rsfShadow` metadata field in `Sprint3PipelineMeta` has been removed from `hybrid-search.ts`.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Adaptive shadow ranking, bounded proposals, and rollback"
description: "Describes the Phase 4 adaptive ranking module that computes bounded proposal deltas from access and validation signals in shadow mode, preserving live ordering as the production source of truth."
---

# Adaptive shadow ranking, bounded proposals, and rollback

## 1. OVERVIEW

Describes the Phase 4 adaptive ranking module that computes bounded proposal deltas from access and validation signals in shadow mode, preserving live ordering as the production source of truth.

This feature lets the system experiment with new ranking ideas without changing what you actually see. It runs alternative rankings in the background and records what would have changed, like a flight simulator for search results. The experiments have strict limits on how big a change they can propose, and a single switch turns the whole thing off if anything looks wrong. Only after a deliberate decision would any of these proposals go live.

---

## 2. CURRENT REALITY

Phase 4 introduced adaptive ranking in shadow mode. The adaptive module computes proposal deltas from access and validation signals while preserving live ordering as the production source of truth.

Proposal magnitudes are explicitly bounded so adaptive exploration cannot produce unbounded score swings. Shadow payloads expose what would change, while the runtime result order remains unchanged unless an explicit graduation decision is made.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Shadow scoring with holdout evaluation"
description: "Shadow scoring compares would-have-changed rankings against live rankings on a deterministic holdout slice of queries, tracking weekly improvement cycles and gating promotion of learned signals to production via the SPECKIT_SHADOW_FEEDBACK flag."
---

# Shadow scoring with holdout evaluation

## 1. OVERVIEW

Shadow scoring compares would-have-changed rankings against live rankings on a deterministic holdout slice of queries, tracking weekly improvement cycles and gating promotion of learned signals to production via the `SPECKIT_SHADOW_FEEDBACK` flag.

Before switching to new ranking logic in production, you want proof that it actually improves results. This feature runs the new ranking in parallel on a random 20% of queries, compares what would have changed, and keeps a weekly scorecard. Only after two consecutive weeks of measurable improvement does it recommend promotion. Nothing changes for users until an explicit decision is made — it is purely observational.

---

## 2. CURRENT REALITY

The shadow scoring module computes per-result rank deltas between live and shadow rankings, producing Kendall tau correlation, NDCG delta, and MRR delta metrics. Holdout queries are deterministically selected via a seed (default 20% holdout). Results are logged to the `shadow_scoring_log` table for auditability, with per-query comparison results and cycle-level aggregation stored in `shadow_cycle_results`.

Promotion requires 2+ consecutive weeks of stable improvement (`PROMOTION_THRESHOLD_WEEKS = 2`). The evaluation window is 7 days (`EVALUATION_WINDOW_MS`). The promotion gate returns one of three recommendations: `promote`, `wait`, or `rollback`.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "4. Memory and Storage"
description: "This document captures the implemented behavior, source references, and validation scope for 4. Memory and Storage."
---

# 4. Memory and Storage

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 4. Memory and Storage.

These variables define where memory files and databases live and how indexing batches are processed. In practice, they control storage location, path safety boundaries, and scan throughput.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MEMORY_ALLOWED_PATHS` | _(appends to built-in allowlist)_ | string | `lib/search/vector-index-store.ts`, `lib/search/vector-index-schema.ts` | Colon-delimited extra filesystem roots allowed for memory reads and migration-time file validation. The runtime already allowlists `process.cwd()/specs`, `process.cwd()/.opencode`, `~/.claude`, and `process.cwd()` before appending env-provided paths. |
