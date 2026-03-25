OpenAI Codex v0.116.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d23da-f468-7533-8229-155eec63554b
--------
user
You are a documentation alignment agent. Verify feature catalog categories 01-10 against live code.

CONTEXT: The feature catalog at .opencode/skill/system-spec-kit/feature_catalog/ has 21 categories. Each category has individual snippet .md files describing features. We need to verify categories 01-10 against actual code.

TASKS:
1. List all .md files in categories 01-retrieval through 10-graph-signal-activation
2. For each snippet file, read it and check:
   a. Does the described feature/function/tool actually exist in the codebase?
   b. Does the described behavior match the code?
   c. Are the file paths/function names referenced accurate?
3. Focus on categories with the most snippets first

SCOPE: .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/ through 10--graph-signal-activation/
Cross-reference with: .opencode/skill/system-spec-kit/mcp_server/, scripts/, shared/

OUTPUT FORMAT:
# Iteration 009: Feature Catalog Categories 01-10 Verification
## Agent: codex / gpt-5.4 / high
## Dimension: traceability
## Files Reviewed
(list snippet files and code files checked)
## Category Verification
### 01--retrieval (N snippets)
- 01-unified-context-retrieval: [ALIGNED | DRIFTED | MISSING] — [notes]
- 02-semantic-and-lexical-search: [ALIGNED | DRIFTED | MISSING] — [notes]
...
### 02--mutation (N snippets)
...
(continue for categories 01-10)
## Findings
### [SEVERITY]-[NNN]: [Title]
...
## Summary
- Snippets checked: N
- ALIGNED: N, DRIFTED: N, MISSING: N
- Total findings: N (P0: N, P1: N, P2: N)
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: cocoindex_code starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a traceability review across feature catalog snippets and the live `system-spec-kit` code. I’ll first route the task through the local skill advisor, inventory categories `01` through `10`, and then verify each snippet against the referenced implementation paths and behaviors.
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog categories 01-10 against live code in .opencode/skill/system-spec-kit/feature_catalog and cross-reference with mcp_server, scripts, shared" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.64s:
2026-03-25 08:17:51.493 xcodebuild[79251:13837933]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:51.645 xcodebuild[79251:13837919] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-BjCbw1Q2' (errno=Operation not permitted)
2026-03-25 08:17:52.084 xcodebuild[79607:13838510]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:17:52.205 xcodebuild[79607:13838498] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
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
The repo only has the top-level `AGENTS.md` in scope for this audit. The skill advisor hit sandbox temp-file issues on first pass, so I’m re-running it with local cache env vars and then I’ll start the snippet inventory.
exec
/bin/zsh -lc 'mkdir -p .tmp && TMPDIR="$PWD/.tmp" XDG_CACHE_HOME="$PWD/.tmp" python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog categories 01-10 against live code in .opencode/skill/system-spec-kit/feature_catalog and cross-reference with mcp_server, scripts, shared" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.44s:
2026-03-25 08:18:00.020 xcodebuild[84270:13846303]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:18:00.146 xcodebuild[84270:13846277] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-6r2MiRSf' (errno=Operation not permitted)
2026-03-25 08:18:00.525 xcodebuild[84695:13846956]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-03-25 08:18:00.649 xcodebuild[84695:13846954] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
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
`SKILL ROUTING:` `system-spec-kit`, `sk-code--opencode`, and `sk-doc` all scored above threshold, so I’m using that minimal set in that order: spec-kit for catalog conventions, opencode standards for the `.opencode` code paths, and doc guidance for the snippet-to-code traceability check.

Plan:
1. Inventory snippet files in categories `01` through `10` and count them so we can prioritize the densest categories first.
2. Read the relevant skill guidance and a sample of the catalog structure to understand expected snippet format and references.
3. For each snippet, verify existence, behavior, and path/name accuracy against `mcp_server/`, `scripts/`, and `shared/`, using semantic search first where the implementation is not obvious.
4. Synthesize the results in the exact iteration report format, including drift/missing findings with severity tags.
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
/bin/zsh -lc "find .opencode/skill/system-spec-kit/feature_catalog -maxdepth 2 -type f -name '*.md' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
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

 succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-memory-continue.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md
codex
I’ve got the inventory, and categories `09`, `10`, `01`, `08`, and `02` are the heaviest, so I’m starting there. Next I’m reading the catalog guidance and the `system-spec-kit` code layout, then I’ll verify the snippets against real handlers, services, and scripts instead of relying on names alone.
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
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/.github/hooks/superset-notify.json
.opencode/skill/system-spec-kit/mcp_server/.node-version-marker
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md.bak
.opencode/skill/system-spec-kit/mcp_server/LICENSE
.opencode/skill/system-spec-kit/mcp_server/README.md
.opencode/skill/system-spec-kit/mcp_server/README.md.bak
.opencode/skill/system-spec-kit/mcp_server/api/README.md
.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
.opencode/skill/system-spec-kit/mcp_server/api/index.ts
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
.opencode/skill/system-spec-kit/mcp_server/api/search.ts
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
.opencode/skill/system-spec-kit/mcp_server/cli.ts
.opencode/skill/system-spec-kit/mcp_server/configs/README.md
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/core/README.md
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/shared -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/shared/README.md
.opencode/skill/system-spec-kit/shared/algorithms/README.md
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
.opencode/skill/system-spec-kit/shared/algorithms/index.ts
.opencode/skill/system-spec-kit/shared/algorithms/mmr-reranker.ts
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
.opencode/skill/system-spec-kit/shared/chunking.ts
.opencode/skill/system-spec-kit/shared/config.ts
.opencode/skill/system-spec-kit/shared/contracts/README.md
.opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.d.ts.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.js.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.d.ts.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/fusion-lab.js.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/index.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/index.d.ts.map
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/scripts -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/.github/hooks/superset-notify.json
.opencode/skill/system-spec-kit/scripts/.gitignore
.opencode/skill/system-spec-kit/scripts/README.md
.opencode/skill/system-spec-kit/scripts/check-api-boundary.sh
.opencode/skill/system-spec-kit/scripts/check-links.sh
.opencode/skill/system-spec-kit/scripts/common.sh
.opencode/skill/system-spec-kit/scripts/config/index.ts
.opencode/skill/system-spec-kit/scripts/core/README.md
.opencode/skill/system-spec-kit/scripts/core/alignment-validator.ts
.opencode/skill/system-spec-kit/scripts/core/config.ts
.opencode/skill/system-spec-kit/scripts/core/content-cleaner.ts
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts
.opencode/skill/system-spec-kit/scripts/core/index.ts
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts
.opencode/skill/system-spec-kit/scripts/core/quality-gates.ts
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts
exec
/bin/zsh -lc "for d in .opencode/skill/system-spec-kit/feature_catalog/0{1..9}* .opencode/skill/system-spec-kit/feature_catalog/10--*; do printf '%s\\t' \""'$(basename "$d")"; find "$d" -maxdepth 1 -type f -name '"'*.md' | wc -l; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
01--retrieval	      11
02--mutation	      10
03--discovery	       3
04--maintenance	       2
05--lifecycle	       7
06--analysis	       7
07--evaluation	       2
08--bug-fixes-and-data-integrity	      11
09--evaluation-and-measurement	      14
10--graph-signal-activation	      16
codex
I’ve mapped the category sizes, and the high-volume sets are exactly where drift is most likely: `09`, `10`, `01`, `08`, then `02`. I’m now using semantic code search to locate the actual retrieval, evaluation, and graph subsystems so the per-snippet checks stay grounded in the implementation rather than just filename matches.
tool cocoindex_code.search({"query":"hybrid retrieval pipeline stages memory context search triggers working memory fallback reranking","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**",".opencode/skill/system-spec-kit/scripts/**"],"limit":8,"refresh_index":true})
cocoindex_code.search({"query":"hybrid retrieval pipeline stages memory context search triggers working memory fallback reranking","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**",".opencode/skill/system-spec-kit/scripts/**"],"limit":8,"refresh_index":true}) success in 7.06s:
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
tool cocoindex_code.search({"query":"evaluation ablation reporting dashboard bm25 baseline synthetic corpus quality metrics observer effect instrumentation","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**",".opencode/skill/system-spec-kit/scripts/**"],"limit":8,"refresh_index":false})
cocoindex_code.search({"query":"evaluation ablation reporting dashboard bm25 baseline synthetic corpus quality metrics observer effect instrumentation","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**",".opencode/skill/system-spec-kit/scripts/**"],"limit":8,"refresh_index":false}) success in 418ms:
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
tool cocoindex_code.search({"query":"causal graph co-activation graph momentum typed traversal temporal contiguity degree channel calibration profiles","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**",".opencode/skill/system-spec-kit/scripts/**"],"limit":8,"refresh_index":false})
cocoindex_code.search({"query":"causal graph co-activation graph momentum typed traversal temporal contiguity degree channel calibration profiles","paths":[".opencode/skill/system-spec-kit/mcp_server/**",".opencode/skill/system-spec-kit/shared/**",".opencode/skill/system-spec-kit/scripts/**"],"limit":8,"refresh_index":false}) success in 412ms:
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
The semantic index didn’t return scoped hits with the first path filters, so I’m broadening the queries and then I’ll confirm each hit against the source files directly. After that I’ll switch into per-snippet verification with exact file and symbol checks.
tool cocoindex_code.search({"query":"memory context retrieval hybrid search reranking trigger matching working memory","languages":"typescript","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"memory context retrieval hybrid search reranking trigger matching working memory","languages":"typescript","limit":5,"refresh_index":false}) failed in 0ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"checkpoint restore pending file recovery archival ingestion job lifecycle","languages":"typescript","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"checkpoint restore pending file recovery archival ingestion job lifecycle","languages":"typescript","limit":5,"refresh_index":false}) failed in 1ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"causal graph typed traversal temporal contiguity co-activation graph calibration","languages":"typescript","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"causal graph typed traversal temporal contiguity co-activation graph calibration","languages":"typescript","limit":5,"refresh_index":false}) failed in 0ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"memory context retrieval hybrid search reranking trigger matching working memory","languages":["typescript"],"limit":5,"refresh_index":false})
cocoindex_code.search({"query":"memory context retrieval hybrid search reranking trigger matching working memory","languages":["typescript"],"limit":5,"refresh_index":false}) success in 54ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tool-schemas.ts\",\n      \"language\": \"typescript\",\n      \"content\": \": { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., [\\\"state\\\", \\\"next-steps\\\"] for resume mode)' } }, required: ['input'] },\\n};\\n\\n// L2: Core - Primary operations (Token Budget: 1500)\\nconst memorySearch: ToolDefinition = {\\n  name: 'memory_search',\\n  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. Token Budget: 1500.',\\n  inputSchema: {\\n    type: 'object',\\n    additionalProperties: false,\\n    'x-requiredAnyOf': [['query'], ['concepts']],\\n    properties: {\\n      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },\",\n      \"start_line\": 43,\n      \"end_line\": 55,\n      \"score\": 0.5869169481003507\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/**\\n * FTS5-backed causal edge query. Finds memory IDs via the memory_fts\\n * virtual table, then retrieves causal edges connected to those memories.\\n * Scores incorporate both edge strength and FTS5 BM25 relevance.\\n */\\nfunction queryCausalEdgesFTS5(\\n  database: Database.Database,\\n  query: string,\\n  limit: number\\n): Array<Record<string, unknown>> {\\n  const sanitized = sanitizeFTS5Query(query);\\n  if (!sanitized) return [];\\n\\n  // BM25-inspired weights: title(10) highest signal, content(5), triggers(2), folder(1)\\n  // Find memory IDs matching the query via FTS5, then join to causal_edges\",\n      \"start_line\": 128,\n      \"end_line\": 142,\n      \"score\": 0.5512143295062213\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tool-schemas.ts\",\n      \"language\": \"typescript\",\n      \"content\": \",\\n        default: false,\\n        description: 'Include archived memories in search results. Default: false (archived excluded).'\\n      },\\n      mode: {\\n        type: 'string',\\n        enum: ['auto', 'deep'],\\n        default: 'auto',\\n        description: 'Search mode. \\\"auto\\\" uses standard retrieval. \\\"deep\\\" enables multi-query expansion for broader recall.'\\n      },\\n      includeTrace: {\\n        type: 'boolean',\\n        default: false,\\n        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'\\n      }\\n    }\\n  },\\n};\\n\\nconst memoryMatchTriggers: ToolDefinition = {\\n  name: 'memory_match_triggers',\\n  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 1500.',\",\n      \"start_line\": 160,\n      \"end_line\": 181,\n      \"score\": 0.5434080323400323\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/shared/types.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"{\\n  /** DB primary key (always number) */\\n  id: number;\\n  /**\\n   * Normalized relevance score (0-1). Semantics depend on `scoringMethod`:\\n   * - `'vector'` — cosine similarity between query and memory embeddings\\n   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized to 0-1)\\n   * - `'hybrid'` — weighted combination of vector + lexical scores\\n   * - `'rrf'` — Reciprocal Rank Fusion across multiple retrieval methods\\n   * - `'cross-encoder'` — reranker model relevance\\n   * - `'fallback'` — best-effort score from degraded search path\\n   */\\n  score: number;\\n  /**\\n   * Disambiguates `.score` semantics. Indicates which scoring algorithm\\n   * produced the `score` value. One of: `'vector'`, `'bm25'`, `'hybrid'`,\\n   * `'rrf'`, `'cross-encoder'`, `'fallback'`.\\n   */\\n  scoringMethod?: 'vector' | 'bm25' | 'hybrid' | 'rrf' | 'cross-encoder' | 'fallback';\\n  /** Memory content (when include_content is true) */\\n  content?: string;\\n  /** Memory title */\\n  title?: string | null;\",\n      \"start_line\": 198,\n      \"end_line\": 220,\n      \"score\": 0.5170555294327368\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/shared/types.d.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"{\\n    /** DB primary key (always number) */\\n    id: number;\\n    /**\\n     * Normalized relevance score (0-1). Semantics depend on `scoringMethod`:\\n     * - `'vector'` — cosine similarity between query and memory embeddings\\n     * - `'bm25'` — BM25 term-frequency relevance (min-max normalized to 0-1)\\n     * - `'hybrid'` — weighted combination of vector + lexical scores\\n     * - `'rrf'` — Reciprocal Rank Fusion across multiple retrieval methods\\n     * - `'cross-encoder'` — reranker model relevance\\n     * - `'fallback'` — best-effort score from degraded search path\\n     */\\n    score: number;\\n    /**\\n     * Disambiguates `.score` semantics. Indicates which scoring algorithm\\n     * produced the `score` value. One of: `'vector'`, `'bm25'`, `'hybrid'`,\\n     * `'rrf'`, `'cross-encoder'`, `'fallback'`.\\n     */\\n    scoringMethod?: 'vector' | 'bm25' | 'hybrid' | 'rrf' | 'cross-encoder' | 'fallback';\",\n      \"start_line\": 163,\n      \"end_line\": 181,\n      \"score\": 0.5170555294327368\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tool-schemas.ts",
        "language": "typescript",
        "content": ": { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., [\"state\", \"next-steps\"] for resume mode)' } }, required: ['input'] },\n};\n\n// L2: Core - Primary operations (Token Budget: 1500)\nconst memorySearch: ToolDefinition = {\n  name: 'memory_search',\n  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires either query (string) OR concepts (array of 2-5 strings) for multi-concept AND search. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. Token Budget: 1500.',\n  inputSchema: {\n    type: 'object',\n    additionalProperties: false,\n    'x-requiredAnyOf': [['query'], ['concepts']],\n    properties: {\n      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },",
        "start_line": 43,
        "end_line": 55,
        "score": 0.5869169481003507
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts",
tool cocoindex_code.search({"query":"checkpoint restore pending file recovery archival ingestion job lifecycle","languages":["typescript"],"limit":5,"refresh_index":false})
cocoindex_code.search({"query":"checkpoint restore pending file recovery archival ingestion job lifecycle","languages":["typescript"],"limit":5,"refresh_index":false}) success in 12ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/storage/checkpoints.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/* ───────────────────────────────────────────────────────────────\\n   6. T107 FIX: CHECKPOINT SCHEMA VALIDATION\\n   Validate each memory row before restore to prevent silent data\\n   loss from corrupt/malformed checkpoint snapshots.\\n----------------------------------------------------------------*/\\n\\n/**\\n * Validates a single memory row from a checkpoint snapshot.\\n * Throws on invalid data — caller should reject the entire restore.\\n *\\n * Strict on identity fields (id, file_path, spec_folder).\\n * Required-but-lenient on INSERT-needed fields (must be present, type flexible).\\n * Optional fields (anchor_id, embedding_*, etc.) may be null/undefined for\\n * backwards compatibility with older checkpoint formats.\\n */\\nfunction validateMemoryRow(row: unknown, index: number): void\",\n      \"start_line\": 332,\n      \"end_line\": 347,\n      \"score\": 0.5799338670197738\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/handlers/checkpoints.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"  const result = checkpoints.createCheckpoint({ name, specFolder: spec_folder, metadata });\\n\\n  if (!result) {\\n    return createMCPErrorResponse({\\n      tool: 'checkpoint_create',\\n      error: 'Checkpoint creation failed',\\n      code: 'CHECKPOINT_CREATE_FAILED',\\n      details: {\\n        name,\\n        specFolder: spec_folder ?? null,\\n      },\\n      recovery: {\\n        hint: 'Verify database availability and retry checkpoint_create.',\\n        actions: ['Run checkpoint_list() to confirm checkpoint state before destructive operations'],\\n      },\\n      startTime,\\n    });\\n  }\\n\\n  return createMCPSuccessResponse({\\n    tool: 'checkpoint_create',\\n    summary: `Checkpoint \\\"${name}\\\" created successfully`,\\n    data: {\\n      success: true,\\n      checkpoint: result\\n    },\\n    hints: [\\n      `Restore with: checkpoint_restore({ name: \\\"${name}\\\" })`,\\n      `Delete with: checkpoint_delete({ name: \\\"${name}\\\", confirmName: \\\"${name}\\\" })`\\n    ],\\n    startTime: startTime\\n  });\\n}\",\n      \"start_line\": 115,\n      \"end_line\": 147,\n      \"score\": 0.5413838778847264\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tools/checkpoint-tools.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// ───────────────────────────────────────────────────────────────\\n// MODULE: Checkpoint Tools\\n// ───────────────────────────────────────────────────────────────\\n// Dispatch for L5 checkpoint tools: create, list, restore,\\n// Delete (T303).\\nimport {\\n  handleCheckpointCreate,\\n  handleCheckpointList,\\n  handleCheckpointRestore,\\n  handleCheckpointDelete,\\n} from '../handlers';\\nimport { validateToolArgs } from '../schemas/tool-input-schemas';\\n\\nimport {\\n  MCPResponse, parseArgs,\\n  CheckpointCreateArgs, CheckpointListArgs,\\n  CheckpointRestoreArgs, CheckpointDeleteArgs,\\n} from './types';\\n\\n/** Tool names handled by this module */\",\n      \"start_line\": 1,\n      \"end_line\": 20,\n      \"score\": 0.5403629783579547\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"function verifySqliteFile(dbPath: string): void {\\n  const db = new Database(dbPath, { fileMustExist: true });\\n  try {\\n    db.prepare('SELECT COUNT(*) AS total FROM sqlite_master').get();\\n  } finally {\\n    db.close();\\n  }\\n}\\n\\n/**\\n * Execute the checkpoint restore workflow: backup existing DB then copy checkpoint in place.\\n *\\n * @param args - Parsed CLI arguments specifying checkpoint source and target.\\n * @returns Result containing the restored path and optional backup location.\\n */\\nfunction runRestoreCheckpoint(args: CliArgs): RestoreCheckpointResult {\\n  if (!fs.existsSync(args.checkpointPath)) {\\n    throw new Error(`Checkpoint file not found: ${args.checkpointPath}`);\\n  }\\n\\n  const targetExists = fs.existsSync(args.dbPath);\\n  if (targetExists && !args.force) {\\n    throw new Error('Target DB already exists. Re-run with --force to allow replacement.');\\n  }\\n\\n  fs.mkdirSync(path.dirname(args.dbPath), { recursive: true });\\n  fs.mkdirSync(args.backupDir, { recursive: true });\",\n      \"start_line\": 136,\n      \"end_line\": 162,\n      \"score\": 0.5390400755431344\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"  it('EXT-BD7: Null checkpoint response omits restore metadata', async (ctx) => {\\n    // Optional module — test skipped at runtime when checkpointsMod unavailable\\n    if (!checkpointsMod) { ctx.skip(); return; }\\n    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }\\n    const calls = installBulkDeleteMocks({ memories: [{ id: 60 }], checkpointReturnsNull: true });\\n    const result = await handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: true });\\n    const parsed = parseResponse(result);\\n    expect(parsed?.data?.deleted).toBe(1);\\n    expect(parsed?.data?.checkpoint).toBeUndefined();\\n    expect(parsed?.data?.restoreCommand).toBeUndefined();\\n    expect(calls.createCheckpoint.length).toBe(1);\\n  });\",\n      \"start_line\": 673,\n      \"end_line\": 684,\n      \"score\": 0.5331009847397308\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/storage/checkpoints.ts",
        "language": "typescript",
        "content": "/* ───────────────────────────────────────────────────────────────\n   6. T107 FIX: CHECKPOINT SCHEMA VALIDATION\n   Validate each memory row before restore to prevent silent data\n   loss from corrupt/malformed checkpoint snapshots.\n----------------------------------------------------------------*/\n\n/**\n * Validates a single memory row from a checkpoint snapshot.\n * Throws on invalid data — caller should reject the entire restore.\n *\n * Strict on identity fields (id, file_path, spec_folder).\n * Required-but-lenient on INSERT-needed fields (must be present, type flexible).\n * Optional fields (anchor_id, embedding_*, etc.) may be null/undefined for\n * backwards compatibility with older checkpoint formats.\n */\nfunction validateMemoryRow(row: unknown, index: number): void",
        "start_line": 332,
        "end_line": 347,
        "score": 0.5799338670197738
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/handlers/checkpoints.ts",
tool cocoindex_code.search({"query":"causal graph typed traversal temporal contiguity co-activation graph calibration","languages":["typescript"],"limit":5,"refresh_index":false})
cocoindex_code.search({"query":"causal graph typed traversal temporal contiguity co-activation graph calibration","languages":["typescript"],"limit":5,"refresh_index":false}) success in 11ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/search/causal-boost.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// ───────────────────────────────────────────────────────────────\\n// MODULE: Causal Boost\\n// ───────────────────────────────────────────────────────────────\\n// Feature catalog: Causal neighbor boost and injection\\n// Graph-traversal score boosting via causal edge relationships.\\n// Walks the causal_edges graph up to MAX_HOPS, amplifying scores\\n// For results related to top seed results via weighted CTE.\\nimport { isFeatureEnabled } from '../cache/cognitive/rollout-policy';\\n\\nimport type Database from 'better-sqlite3';\\n\\n/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */\\nconst MAX_HOPS = 2;\\n/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */\",\n      \"start_line\": 1,\n      \"end_line\": 14,\n      \"score\": 0.547162681338774\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/handlers/causal-graph.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"interface CausalStatsArgs {\\n  _?: never;\\n}\\n\\ninterface CausalUnlinkArgs {\\n  edgeId: number;\\n}\\n\\n/* ───────────────────────────────────────────────────────────────\\n   2. TREE-TO-FLAT CONVERTER\\n──────────────────────────────────────────────────────────────── */\\n\\n/**\\n * Flatten a CausalChainNode tree into flat edge lists grouped by relation.\\n * The tree from getCausalChain() encodes parent→child relationships;\\n * for 'forward' direction: parent=source, child=target.\\n * For 'backward' direction: parent=target, child=source.\\n */\",\n      \"start_line\": 72,\n      \"end_line\": 89,\n      \"score\": 0.5392523186137463\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/storage/causal-edges.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"interface WeightHistoryEntry {\\n  id: number;\\n  edge_id: number;\\n  old_strength: number;\\n  new_strength: number;\\n  changed_by: string;\\n  changed_at: string;\\n  reason: string | null;\\n}\\n\\ninterface GraphStats {\\n  totalEdges: number;\\n  byRelation: Record<string, number>;\\n  avgStrength: number;\\n  uniqueSources: number;\\n  uniqueTargets: number;\\n}\\n\\ninterface CausalChainNode {\\n  id: string;\\n  edgeId?: number;          // T202: causal_edges.id for unlink workflow\\n  depth: number;\\n  relation: RelationType;\\n  strength: number;\\n  children: CausalChainNode[];\\n}\\n\\n/* ───────────────────────────────────────────────────────────────\\n   3. MODULE STATE\\n----------------------------------------------------------------*/\\n\\nlet db: Database.Database | null = null;\",\n      \"start_line\": 75,\n      \"end_line\": 106,\n      \"score\": 0.5219309551641729\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"interface CausalEdgeRow {\\n  id: string;\\n  source_id: string;\\n  target_id: string;\\n  relation: string;\\n  strength: number;\\n}\\n\\n// ───────────────────────────────────────────────────────────────\\n// 2. TYPED-DEGREE CONSTANTS\\n\\n// ───────────────────────────────────────────────────────────────\\n/** Edge type weights for typed-degree computation (R4 5th RRF channel) */\\nconst EDGE_TYPE_WEIGHTS: Record<string, number> = {\\n  caused: 1.0,\\n  derived_from: 0.9,\\n  enabled: 0.8,\\n  contradicts: 0.7,\\n  supersedes: 0.6,\\n  supports: 0.5,\\n};\\n\\n/** Fallback maximum typed degree when no edges exist in the database */\\nconst DEFAULT_MAX_TYPED_DEGREE = 15;\\n\\n/** Hard cap on raw typed degree before normalization */\",\n      \"start_line\": 17,\n      \"end_line\": 42,\n      \"score\": 0.5210438878036836\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/handlers/causal-graph.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// ────────────────────────────────────────────────────────────────\\n// MODULE: Causal Graph\\n// ────────────────────────────────────────────────────────────────\\n\\n/* ───────────────────────────────────────────────────────────────\\n   0. DEPENDENCIES\\n──────────────────────────────────────────────────────────────── */\\n\\n// Lib modules\\nimport * as vectorIndex from '../lib/search/vector-index';\",\n      \"start_line\": 1,\n      \"end_line\": 10,\n      \"score\": 0.5204184877792386\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/search/causal-boost.ts",
        "language": "typescript",
        "content": "// ───────────────────────────────────────────────────────────────\n// MODULE: Causal Boost\n// ───────────────────────────────────────────────────────────────\n// Feature catalog: Causal neighbor boost and injection\n// Graph-traversal score boosting via causal edge relationships.\n// Walks the causal_edges graph up to MAX_HOPS, amplifying scores\n// For results related to top seed results via weighted CTE.\nimport { isFeatureEnabled } from '../cache/cognitive/rollout-policy';\n\nimport type Database from 'better-sqlite3';\n\n/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */\nconst MAX_HOPS = 2;\n/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */",
        "start_line": 1,
        "end_line": 14,
        "score": 0.547162681338774
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/handlers/causal-graph.ts",
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Unified context retrieval (memory_context)"
description: "Describes the L1 orchestration layer that auto-detects task intent and routes to the best retrieval strategy."
---

# Unified context retrieval (memory_context)

## 1. OVERVIEW

Describes the L1 orchestration layer that auto-detects task intent and routes to the best retrieval strategy.

When you ask the system a question, it figures out what kind of help you need and automatically picks the best way to find the answer. Think of it like a smart librarian who reads your request, decides whether you need a quick lookup or a deep research session and then fetches the right materials for you. Without this, you would have to manually tell the system how to search every time.

---

## 2. CURRENT REALITY

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Evaluation database and schema"
description: "Describes the dedicated SQLite evaluation database, its five-table schema and the fail-safe logging hooks that capture retrieval quality data without affecting production query flow."
---

# Evaluation database and schema

## 1. OVERVIEW

Describes the dedicated SQLite evaluation database, its five-table schema and the fail-safe logging hooks that capture retrieval quality data without affecting production query flow.

When you want to know how well your search results are performing, you need a safe place to store that measurement data. This feature keeps all quality-tracking records in a separate storage area so they never mix with or interfere with the actual search results you rely on. If the measurement process ever hits a problem, your searches keep working normally as if nothing happened.

---

## 2. CURRENT REALITY

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Typed-weighted degree channel"
description: "Describes the fifth RRF channel that scores memories by graph connectivity using typed edge weights, logarithmic normalization and hub caps to prevent connection-count dominance."
---

# Typed-weighted degree channel

## 1. OVERVIEW

Describes the fifth RRF channel that scores memories by graph connectivity using typed edge weights, logarithmic normalization and hub caps to prevent connection-count dominance.

This gives a search bonus to memories that are well-connected to other memories, like how a person who knows many people in a community is often a good source of information. Different types of connections count for different amounts, and there is a cap to prevent any single well-connected memory from dominating all search results just because it links to everything.

---

## 2. CURRENT REALITY

A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone.

Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. That cache is now scoped per database instance via `WeakMap<Database.Database, Map<string, number>>`, with `getDegreeCacheForDb(database)` for lookup and `clearDegreeCacheForDb(database)` for explicit invalidation, so scores from one DB can no longer leak into another. When a memory has zero edges, the channel returns 0 rather than failing.
codex
I’ve sampled a retrieval snippet and a couple of the heavier graph/eval entries. The next pass is mechanical but high-signal: I’m extracting every referenced implementation and test path from the snippet tables so we can separate simple path drift from actual behavior drift before I read the deeper handlers.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\"); const base=\".opencode/skill/system-spec-kit/feature_catalog\"; const dirs=fs.readdirSync(base).filter(d=>/"'^(0[1-9]|10)--/.test(d)).sort(); for(const dir of dirs){ const files=fs.readdirSync(path.join(base,dir)).filter(f=>f.endsWith(".md")).sort(); for(const file of files){ const rel=path.join(base,dir,file); const text=fs.readFileSync(rel,"utf8"); const refs=[...text.matchAll(/`((?:mcp_server|scripts|shared)'"\\/["'^`]+)`/g)].map(m=>m[1]); const unique=[...new Set(refs)]; const missing=unique.filter(r=>!fs.existsSync(path.join(".opencode/skill/system-spec-kit",r))); if(missing.length){ console.log(rel); for(const m of missing) console.log("  MISSING'"\\t\"+m); } } }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md
  MISSING	mcp_server/tests/ceiling-quality.vitest.ts
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\"); const base=\".opencode/skill/system-spec-kit/feature_catalog\"; const dirs=fs.readdirSync(base).filter(d=>/"'^(0[1-9]|10)--/.test(d)).sort(); for(const dir of dirs){ console.log("## "+dir); const files=fs.readdirSync(path.join(base,dir)).filter(f=>f.endsWith(".md")).sort(); for(const file of files){ const rel=path.join(base,dir,file); const text=fs.readFileSync(rel,"utf8"); const title=(text.match(/''^title:'"\\s*\"(["'^"]+)"/m)||[])[1]||file; const m=text.match(/## 2'"\\. CURRENT REALITY\\n\\n([\\s\\S]*?)\\n---\\n\\n## 3\\./); const reality=(m?m[1]:\"\").replace(/\\s+/g,\" \").slice(0,320); console.log("'`${file}'"\\t"'${title}'"\\t"'${reality}`); } }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
## 01--retrieval
01-unified-context-retrieval-memorycontext.md	Unified context retrieval (memory_context)	You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one. Intent detection classifies your input into one of seven types (add_feat
02-semantic-and-lexical-search-memorysearch.md	Semantic and lexical search (memory_search)	This is the primary search tool, and it does a lot. You give it a natural language query (or a multi-concept array of 2-5 strings where all concepts must match), and it runs the full hybrid retrieval pipeline. The search path is the 4-stage pipeline architecture, which is the sole runtime path. The pipeline starts with
03-trigger-phrase-matching-memorymatchtriggers.md	Trigger phrase matching (memory_match_triggers)	When you need speed over depth, trigger matching delivers. Rather than generating embeddings and running multi-channel search, it performs direct string matching of your prompt against stored trigger phrases. The performance target is under 100ms. Think of it as the "fast path" that sacrifices recall for latency. A gov
04-hybrid-search-pipeline.md	Hybrid search pipeline	The engine under the hood. `handlers/memory-search.ts` is the runtime entry point, and Stage 1 delegates candidate generation into `lib/search/hybrid-search.ts` plus the supporting pipeline stages. `hybrid-search.ts` still owns the multi-channel retrieval, adaptive fusion inputs, diversity reranking, and fallback chain
05-4-stage-pipeline-architecture.md	4-stage pipeline architecture	The pipeline refactor (R6) restructures the retrieval flow into four bounded stages with clear responsibilities and a strict score-immutability invariant in the final stage. Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode e
06-bm25-trigger-phrase-re-index-gate.md	BM25 trigger phrase re-index gate	The BM25 re-index condition in `memory-crud-update.ts` was expanded from title-only to title OR trigger phrases: `if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled())`. The BM25 corpus includes trigger phrases, so changes to either field must trigger re-index
07-ast-level-section-retrieval-tool.md	AST-level section retrieval tool	**PLANNED (Sprint 019): DEFERRED.** `read_spec_section(filePath, heading)` via Markdown AST parsing (`remark`) is deferred until spec docs routinely exceed ~1000 lines. Existing R7 anchor-aware thinning remains the current approach. Estimated effort: M (5-7 days). 
08-quality-aware-3-tier-search-fallback.md	Quality-aware 3-tier search fallback	Adaptive search degradation chain in `searchWithFallbackTiered()`. Tier 1: enhanced hybrid search (minSimilarity=0.3, standard channels). Quality check via `checkDegradation()`: fails if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3. On fail, Tier 2: widened search (minSimilarity=0.1, all channels forced). 
09-tool-result-extraction-to-working-memory.md	Tool-result extraction to working memory	The working memory module (`lib/cognitive/working-memory.ts`) captures salient results from tool invocations and stores them as session-scoped attention items. When a retrieval tool returns results, the system extracts key findings and inserts them into the `working_memory` table with an attention score. These extracte
10-fast-delegated-search-memory-quick-search.md	Fast delegated search (memory_quick_search)	The `memory_quick_search` tool is defined in `tool-schemas.ts` as an E3 (ergonomics) entry point. It accepts 3 primary parameters — `query` (required, 2-1000 chars), `limit` (optional, 1-100, default 10), and `specFolder` (optional) — plus governance boundary fields (`tenantId`, `userId`, `agentId`, `sharedSpaceId`). I
11-session-recovery-memory-continue.md	Session recovery via /memory:continue	**SHIPPED.** `/memory:continue` is live and uses 4 shared MCP tools: - **`memory_context`** (from `/memory:analyze`) -- Called in `resume` mode as the primary recovery path. Uses anchors `["state", "next-steps", "summary", "blockers"]` with a 1200-token budget, `minState=WARM`, `includeContent=true`, dedup and decay bo
## 02--mutation
01-memory-indexing-memorysave.md	Memory indexing (memory_save)	`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database. 
02-memory-metadata-update-memoryupdate.md	Memory metadata update (memory_update)	You can change the title, trigger phrases, importance weight or importance tier on any existing memory by its numeric ID. The system verifies the memory exists, validates your parameters (importance weight between 0 and 1, tier from the valid enum) and applies the changes. When the title changes, the system regenerates
03-single-and-folder-delete-memorydelete.md	Single and folder delete (memory_delete)	Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete. Single deletes run inside a database transaction: remove the memory record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdges
04-tier-based-bulk-deletion-memorybulkdelete.md	Tier-based bulk deletion (memory_bulk_delete)	For large-scale cleanup operations. Instead of targeting a folder, you target an importance tier: delete all deprecated memories, or all temporary memories older than 30 days. The tool counts affected memories first (so the response tells you exactly how many were deleted), creates a safety checkpoint, then deletes wit
05-validation-feedback-memoryvalidate.md	Validation feedback (memory_validate)	Every search result is either helpful or not. This tool lets you record that judgment and triggers several downstream systems based on the feedback. Positive feedback adds 0.1 to the memory's confidence score (capped at 1.0). Negative feedback subtracts 0.05 (floored at 0.0). The base confidence for any memory starts a
06-transaction-wrappers-on-mutation-handlers.md	Transaction wrappers on mutation handlers	`memory-crud-update.ts` wraps its mutation steps in a transaction (`runInTransaction`) so the DB update, embedding status write, BM25 re-index and mutation ledger append either commit together or roll back together. `memory-crud-delete.ts` wraps both the single-delete and bulk-folder delete paths in database transactio
07-namespace-management-crud-tools.md	Namespace management CRUD tools (shared-memory lifecycle)	**SHIPPED.** All 4 tools are live at L5 under `/memory:shared`: - **`shared_space_upsert`** -- Creates or updates a shared-memory space. Requires `spaceId`, `tenantId`, `name`, and exactly one actor identity (`actorUserId` or `actorAgentId`). Supports optional rollout parameters (`rolloutEnabled`, `rolloutCohort`, `kil
exec
/bin/zsh -lc "rg -n \"name:\\s*'memory_(context|search|match_triggers|quick_search|save|update|delete|bulk_delete|validate|list|stats|health|index_scan|get_learning_history)|name:\\s*'checkpoint_(create|list|restore|delete)|name:\\s*'memory_(causal_link|causal_stats|causal_unlink|drift_why)|name:\\s*'task_(preflight|postflight)|name:\\s*'eval_(run_ablation|reporting_dashboard)|name:\\s*'memory_ingest_(start|status|cancel)\" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/tools" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:48:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:191:  name: 'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:210:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:217:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:224:  name: 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:230:  name: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:274:  name: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289:  name: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:295:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:317:  name: 'memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:324:  name: 'checkpoint_create',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:330:  name: 'checkpoint_list',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:336:  name: 'checkpoint_restore',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:342:  name: 'checkpoint_delete',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:427:  name: 'task_preflight',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:433:  name: 'task_postflight',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:440:  name: 'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:446:  name: 'memory_causal_link',
exec
/bin/zsh -lc 'rg -n "function handleMemoryContext|function handleMemorySearch|function handleMemoryMatchTriggers|function handleMemoryQuickSearch|function handleMemorySave|function handleMemoryUpdate|function handleMemoryDelete|function handleMemoryBulkDelete|function handleMemoryValidate|function handleMemoryList|function handleMemoryStats|function handleMemoryHealth|function handleMemoryIndexScan|function handleCheckpointCreate|function handleCheckpointList|function handleCheckpointRestore|function handleCheckpointDelete|function handleMemoryCausalLink|function handleMemoryCausalStats|function handleMemoryCausalUnlink|function handleMemoryDriftWhy|function handleTaskPreflight|function handleTaskPostflight|function handleEvalRunAblation|function handleEvalReportingDashboard|function handleMemoryIngest(Start|Status|Cancel)" .opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:132:async function handleMemoryIngestStart(args: MemoryIngestStartArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:250:async function handleMemoryIngestStatus(args: MemoryIngestStatusArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:279:async function handleMemoryIngestCancel(args: MemoryIngestCancelArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:43:async function handleMemoryBulkDelete(args: BulkDeleteArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:185:async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:41:async function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:31:async function handleMemoryStats(args: StatsArgs | null): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:218:async function handleTaskPreflight(args: PreflightArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:370:async function handleTaskPostflight(args: PostflightArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:662:async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:68:async function handleMemoryDelete(args: DeleteArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:166:async function handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:316:async function handleEvalReportingDashboard(args: ReportingDashboardArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:147:async function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:904:async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:396:async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:105:async function handleCheckpointCreate(args: CheckpointCreateArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:157:async function handleCheckpointList(args: CheckpointListArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:195:async function handleCheckpointRestore(args: CheckpointRestoreArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:285:async function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse> {
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server/handlers -maxdepth 1 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Context
// ────────────────────────────────────────────────────────────────

import { randomUUID } from 'crypto';

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions';
import { checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier';

// Core handlers for routing
import { handleMemorySearch } from './memory-search';
import { handleMemoryMatchTriggers } from './memory-triggers';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope';
exec
/bin/zsh -lc 'rg -n "INTENT|add_feature|fix_bug|refactor|security_audit|understand|find_spec|find_decision|quick: 800|focused: 1500|deep: 2000|resume: 1200|SPECKIT_PRESSURE_POLICY|SPECKIT_ROLLOUT_PERCENT|systemPromptContext|sessionTransition|spec folder discovery|SPECKIT_FOLDER_DISCOVERY|enforceTokenBudget|tokenUsage" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/cognitive .opencode/skill/system-spec-kit/mcp_server/core/config.ts .opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:83:  sessionTransition?: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  tokenUsage?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:179:  sessionTransition: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:227:function enforceTokenBudget(result: ContextResult, budgetTokens: number): { result: ContextResult; enforcement: TokenBudgetEnforcement } {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:532:   4. INTENT-TO-MODE ROUTING
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:535:const INTENT_TO_MODE: Record<string, string> = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:536:  add_feature: 'deep',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:537:  fix_bug: 'focused',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:538:  refactor: 'deep',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:539:  security_audit: 'deep',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:540:  understand: 'focused',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:541:  find_spec: 'deep',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:542:  find_decision: 'focused'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:583:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:610:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:642:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:729:    effectiveMode = INTENT_TO_MODE[detectedIntent!] || 'focused';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:834:    sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:854:            includeTrace === true ? sessionTransition : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:870:    tokenUsageSource: pressurePolicy.source,
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    const contentClone = fallbackContent.map((entry) => ({ ...entry }));
    const candidateInnerStates: Array<Record<string, unknown>> = [
      {
        summary: 'Context truncated to fit token budget',
        data: {
          count: 0,
          results: [],
        },
        meta: {
          tool: 'memory_search',
          truncated: true,
          parseFailed: Boolean(parseFailedInnerText),
        },
      },
      {
        data: {
          count: 0,
          results: [],
        },
        meta: {
exec
/bin/zsh -lc "sed -n '520,760p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  },

  // Resume: Session recovery mode
  resume: {
    name: 'Resume',
    description: 'Resume previous work with state and next-steps anchors',
    strategy: 'resume',
    tokenBudget: 1200
  }
};

/* ───────────────────────────────────────────────────────────────
   4. INTENT-TO-MODE ROUTING
──────────────────────────────────────────────────────────────── */

const INTENT_TO_MODE: Record<string, string> = {
  add_feature: 'deep',
  fix_bug: 'focused',
  refactor: 'deep',
  security_audit: 'deep',
exec
/bin/zsh -lc "sed -n '760,1185p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

  return {
    effectiveMode,
    pressureOverrideApplied,
    pressureOverrideTargetMode,
    pressureWarning,
    intentClassification: {
      detectedIntent,
      intentConfidence,
      resumeHeuristicApplied,
      source: explicitIntent ? 'explicit' : 'auto-detected',
    },
  };
}

function maybeDiscoverSpecFolder(options: ContextOptions, args: ContextArgs): string | undefined {
  if (args.specFolder || !isFolderDiscoveryEnabled()) {
    return undefined;
  }

codex
I’ve confirmed the core MCP surfaces and handlers are present for the retrieval, mutation, lifecycle, analysis, evaluation, and ingest tools. I’m moving into the higher-risk drift zones now: evaluation metrics/reporting and graph scoring, where the snippets make more detailed behavioral claims than simple tool existence.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Eval Reporting
// ────────────────────────────────────────────────────────────────

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import {
  init as initHybridSearch,
  hybridSearchEnhanced,
  bm25Search,
  ftsSearch,
} from '../lib/search/hybrid-search';
import { generateQueryEmbedding } from '../lib/providers/embeddings';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import {
  ALL_CHANNELS,
  isAblationEnabled,
  runAblation,
  storeAblationResults,
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Eval Db
// ───────────────────────────────────────────────────────────────
// Feature catalog: Evaluation database and schema
// Separate evaluation database with 5 tables for tracking
// Retrieval quality metrics, ground truth, and eval results.
// Node stdlib
import * as path from 'path';
import * as fs from 'fs';

// External packages
import Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Follow same env-var precedence as main DB (vector-index-impl.ts)
// P1-05: SPEC_KIT_DB_DIR (canonical) > MEMORY_DB_DIR (legacy) > default
const DEFAULT_DB_DIR: string =
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Graph Search Fn
// ───────────────────────────────────────────────────────────────
// Feature catalog: Unified graph retrieval, deterministic ranking, explainability, and rollback
// Causal graph search channel — uses FTS5 for node matching

import { sanitizeFTS5Query } from './bm25-index';
import { queryHierarchyMemories } from './spec-folder-hierarchy';

import type Database from 'better-sqlite3';
import type { GraphSearchFn } from './search-types';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
interface CausalEdgeRow {
  id: string;
  source_id: string;
  target_id: string;
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Causal Boost
// ───────────────────────────────────────────────────────────────
// Feature catalog: Causal neighbor boost and injection
// Graph-traversal score boosting via causal edge relationships.
// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
// For results related to top seed results via weighted CTE.
//
// D3 Phase A — Sparse-First + Intent-Aware Traversal:
// - REQ-D3-001: Sparse-first policy — density < 0.5 disables community
//   detection and constrains traversal to typed 1-hop expansion only.
// - REQ-D3-002: Intent-aware edge traversal — maps classified query intents
//   to edge-type priority orderings; computes traversal score as:
//   score = seedScore * edgePrior * hopDecay * freshness
// Both requirements are gated behind SPECKIT_TYPED_TRAVERSAL (default ON, graduated).
import { isFeatureEnabled } from '../cognitive/rollout-policy';
import { isTypedTraversalEnabled as _isTypedTraversalEnabled } from './search-flags';

import type Database from 'better-sqlite3';

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Causal Edges
// ───────────────────────────────────────────────────────────────
// Feature catalog: Causal edge creation (memory_causal_link)
// Causal relationship graph for memory lineage
import type Database from 'better-sqlite3';
import { clearDegreeCacheForDb } from '../search/graph-search-fn';
import { clearGraphSignalsCache } from '../graph/graph-signals';
import { runInTransaction } from './transaction-manager';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',
  ENABLED: 'enabled',
  SUPERSEDES: 'supersedes',
  CONTRADICTS: 'contradicts',
  DERIVED_FROM: 'derived_from',
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Community Detection
// ───────────────────────────────────────────────────────────────
// Active runtime feature — default ON via SPECKIT_COMMUNITY_DETECTION (set false to disable)
// ───────────────────────────────────────────────────────────────
// 1. IMPORTS

// ───────────────────────────────────────────────────────────────
import type Database from "better-sqlite3";

// Feature catalog: Community detection


// ───────────────────────────────────────────────────────────────
// 2. TYPES

// ───────────────────────────────────────────────────────────────
/** Adjacency list: node ID (string) -> set of neighbor node IDs */
type AdjacencyList = Map<string, Set<string>>;

 succeeded in 0ms:
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
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Graph Signals
// ───────────────────────────────────────────────────────────────
// Feature catalog: Typed-weighted degree channel
// Active runtime feature — default ON via SPECKIT_GRAPH_SIGNALS (set false to disable)
// ───────────────────────────────────────────────────────────────
// 1. IMPORTS

// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';
import {
  STAGE2_GRAPH_BONUS_CAP,
  clampStage2GraphBonus,
} from '../search/pipeline/ranking-contract';

// ───────────────────────────────────────────────────────────────
// 2. SESSION CACHE

// ───────────────────────────────────────────────────────────────
/** Maximum number of entries allowed in each session-scoped cache. */
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Reporting Dashboard (R13-S3)
// ───────────────────────────────────────────────────────────────
// the rollout: Full reporting dashboard for eval infrastructure.
// Aggregates metrics per sprint/eval-run, per-channel views,
// Trend analysis, and formatted report output.
//
// Uses: eval-db.ts singleton, eval_metric_snapshots table,
// Eval_channel_results table.
//
// Design:
//   - Read-only queries against eval DB (no writes).
//   - Sprint labels inferred from metadata JSON or eval_run_id grouping.
//   - Pure aggregation logic; DB access isolated to query functions.
// External packages
import type Database from 'better-sqlite3';

// Internal modules
import { getEvalDb, initEvalDb } from './eval-db';

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Scoring Observability (T010)
// ───────────────────────────────────────────────────────────────
// Lightweight observability logging for N4 cold-start boost and
// TM-01 interference scoring values at query time.
// Sampled at 5% of queries to avoid performance overhead.
// All logging is best-effort (fail-safe, never throws).
// Feature flags:
// SPECKIT_NOVELTY_BOOST     — N4 cold-start boost
// SPECKIT_INTERFERENCE_SCORE — TM-01 interference penalty
import type Database from 'better-sqlite3';

// Feature catalog: Scoring observability


// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** 5% sampling rate — logs ~1 in 20 scoring calls */
exec
/bin/zsh -lc 'rg -n "MRR@5|NDCG@10|Recall@20|Hit Rate@1|inversion|score separation|countSaturation|latencyPenalty|quality proxy|scoring_observations|SAMPLING_RATE|runShadowScoring|logShadowComparison|captureMemoryStateBaselineSnapshot|INT8|quantization|110 query|ground truth|cross-ai|ceiling-quality" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:19:// 5 representative eval queries with ground truth relevance judgments
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:71:// - Cohere Rerank v3:   NDCG@10 ~0.60, MRR@5 ~0.55-0.65
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:72:// - Voyage Rerank-2:    NDCG@10 ~0.58, MRR@5 ~0.52-0.62
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:73:// - Local GGUF (small): NDCG@10 ~0.40-0.50, MRR@5 ~0.38-0.48
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:77:// 2. Compute MRR@5 for each reranker
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:78:// 3. Compare: local should be within 0.15 of remote on MRR@5
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:109:      metrics: ['MRR@5', 'NDCG@5', 'latency_p50'],
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:115:    expect(protocol.metrics).toContain('MRR@5');
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:126:    'Voyage reranker produces valid MRR@5 scores',
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:131:      // 3. Compute MRR@5
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:132:      // 4. Assert MRR@5 is within MTEB reference range
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:138:    'Cohere reranker produces valid MRR@5 scores',
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:143:      // 3. Compute MRR@5
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:144:      // 4. Assert MRR@5 is within MTEB reference range
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:4:// Eval-the-Eval Validation (Hand-Calculate MRR@5 & NDCG@10)
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:82:   MRR@5 — 5 HAND-CALCULATED SCENARIOS
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:85:describe('T013: MRR@5 — Hand-Calculated Validation (eval-the-eval)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:100:  // MRR@5 = 1.000
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:119:    logAndAssert('T013-MRR-1', 'MRR@5', expected, computed);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:138:  // MRR@5 ≈ 0.333
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Eval Quality Proxy (T006G)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Quality proxy formula
// Automated quality proxy metric that correlates with manual
// Quality assessment. Pure function, no DB access, no side effects.
//
// Formula:
// QualityProxy = avgRelevance * 0.40 + topResult * 0.25
// + countSaturation * 0.20 + latencyPenalty * 0.15
//
// All components normalised to [0, 1]. Output range: [0, 1].
/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Default latency target in milliseconds. */
const DEFAULT_LATENCY_TARGET_MS = 500;

/** Weights for each component — must sum to 1.0. */
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Ground Truth Generator
// ───────────────────────────────────────────────────────────────
// Feature catalog: Synthetic ground truth corpus
// Functions for generating, loading, and validating the
// Synthetic ground truth dataset for retrieval evaluation.
//
// Exports:
// GenerateGroundTruth()          — produce the full dataset
// LoadGroundTruth(evalDb)        — populate eval DB tables
// ValidateGroundTruthDiversity() — check all diversity gates
import type Database from 'better-sqlite3';

import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
  QUERY_DISTRIBUTION,
  type GroundTruthQuery,
  type GroundTruthRelevance,
  type IntentType,
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Bm25-Only Baseline Runner (T008)
// ───────────────────────────────────────────────────────────────
// Feature catalog: BM25-only baseline
//
// Runs the ground truth query set through the BM25/FTS5-only
// Search path (disabling vector, graph, and trigger channels)
// And computes baseline metrics. Records results in eval DB.
//
// The baseline measurement establishes the "floor" — what simple
// Keyword search achieves without any semantic, graph, or trigger
// Augmentation.
//
// Design notes:
//   - The search function is injected as a dependency so tests
// Can use mocks without a live DB.
//   - The contingency decision matrix turns the measured MRR@5
// Into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
//   - recordBaselineMetrics() is a pure DB write — no network I/O.
import type Database from 'better-sqlite3';
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory State Baseline Metrics
// ───────────────────────────────────────────────────────────────
// Feature catalog: Memory roadmap baseline snapshot
// Captures baseline retrieval/isolation metrics before phased rollout.
// Can optionally persist snapshots into eval_metric_snapshots.
import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';
import { getMemoryRoadmapDefaults } from '../config/capability-flags';
import { DEFAULT_DB_DIR, initEvalDb, getEvalDbPath } from './eval-db';

const CONTEXT_DB_FILENAME = 'context-index.sqlite';

interface MemoryStateBaselineSnapshot {
  capturedAt: string;
  evalRunId: number;
  specFolder: string | null;
  metrics: Record<string, number>;
  metadata: Record<string, unknown>;
exec
/bin/zsh -lc "sed -n '230,420p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
}

/* --- 5. PUBLIC API --- */

/**
 * Run an alternative scoring algorithm in shadow mode alongside production results.
 *
 * Shadow scoring runtime is retired. The SPECKIT_SHADOW_SCORING flag is retained
 * for compatibility only, so this returns null without running the shadow function.
 *
 * CRITICAL: Shadow scoring must NEVER affect production search results.
 *
 * @param query - The search query.
 * @param productionResults - The production scoring results (will NOT be modified).
 * @param shadowConfig - Configuration including the shadow scoring function.
 * @returns ShadowComparison when enabled and successful, null when disabled or on error.
 * @deprecated Shadow scoring runtime is retired; this always returns null.
 */
export async function runShadowScoring(
  query: string,
exec
/bin/zsh -lc 'rg -n "runShadowScoring|logShadowComparison|return null|return false|disabled" .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts .opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:15:// SPECKIT_SHADOW_SCORING is retained for tests/docs, but the write path remains disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:245: * @returns ShadowComparison when enabled and successful, null when disabled or on error.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:248:export async function runShadowScoring(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:256:  return null;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:373: * @returns true if persisted, false if disabled or on error.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:376:export function logShadowComparison(comparison: ShadowComparison): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:378:  return false;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:467:    return null;
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:2:// R13-S2: Shadow scoring infrastructure and disabled compatibility paths.
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:9:  runShadowScoring,
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:11:  logShadowComparison,
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:170:  describe('runShadowScoring', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:181:    it('returns null when shadow scoring is disabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:189:      const result = await runShadowScoring('test query', makeResults([1, 2, 3]), config);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:193:    it('returns null when env var is "true" (REMOVED flag — always disabled)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:207:      const result = await runShadowScoring('test query', makeResults([1, 2, 3]), config);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:227:      const result = await runShadowScoring('test query', production, config);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:246:      const result = await runShadowScoring('test query', makeResults([1, 2]), config);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:260:      const result = await runShadowScoring('test query', makeResults([1, 2]), config);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:265:  describe('DB Persistence (logShadowComparison + getShadowStats)', () => {
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Search
// ───────────────────────────────────────────────────────────────
/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

import * as toolCache from '../lib/cache/tool-cache';
import * as sessionManager from '../lib/session/session-manager';
import * as intentClassifier from '../lib/search/intent-classifier';
// TierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
import { isEnabled as isSessionBoostEnabled } from '../lib/search/session-boost';
import { isEnabled as isCausalBoostEnabled } from '../lib/search/causal-boost';
// 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline';
import type { IntentWeightsConfig } from '../lib/search/pipeline/types';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';
// Artifact-class routing (spec/plan/tasks/checklist/memory)
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Shared Memory Handler
// ───────────────────────────────────────────────────────────────
// MCP handler layer for shared-space CRUD, membership assignment,
// and rollout status reporting with deny-by-default access.
import { requireDb } from '../utils';
import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope';
import type { MCPResponse } from './types';
import type { SharedSpaceUpsertArgs, SharedSpaceMembershipArgs, SharedMemoryStatusArgs } from '../tools/types';
import {
  assertSharedSpaceAccess,
  enableSharedMemory,
  ensureSharedCollabRuntime,
  getAllowedSharedSpaceIds,
  isSharedMemoryEnabled,
  upsertSharedMembership,
  upsertSharedSpace,
} from '../lib/collab/shared-spaces';
import { recordGovernanceAudit } from '../lib/governance/scope-governance';

exec
/bin/zsh -lc 'rg -n "memory_history|prediction error|REINFORCE|SUPERSEDE|CREATE_LINKED|corrections|undo|shared_space_upsert|shared_space_delete|shared_space_membership_upsert|shared_space_membership_delete|runInTransaction|checkpoint_restore|clearExisting|job queue|queued|parsing|embedding|indexing|cancelled|archival-manager|cleanupPendingFiles|weight_history|edgeId|maxDepth|session_learning|Learning Index|working_memory|last_focused|cleanupOldSessions|spec_folder" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:41:  tool: 'shared_space_upsert' | 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:133:  tool: 'shared_space_upsert' | 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:168:  tool: 'shared_space_upsert' | 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:179:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:186:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:216:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:    const actorResult = resolveAdminActor('shared_space_upsert', args.actorUserId, args.actorAgentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:265:            msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:335:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:339:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:354:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:59:/** Partial embedding provider metadata — see shared/types.ts ProviderMetadata for the full shape. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:71:  spec_folder?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:663: *   - working_memory: entries with last_focused older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:668: *   - session_learning records (permanent, never cleaned)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:684:  // 1. Clean stale working_memory entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:686:    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:693:      errors.push(`working_memory cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:726:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Learning
// ───────────────────────────────────────────────────────────────
import * as vectorIndex from '../lib/search/vector-index';
import { checkDatabaseUpdated } from '../core';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { toErrorMessage } from '../utils';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse } from '../lib/response/envelope';

// Shared handler types
import type { MCPResponse, DatabaseExtended as Database } from './types';

// Feature catalog: Post-task learning measurement (task_postflight)
// Feature catalog: Learning history (memory_get_learning_history)


/* ───────────────────────────────────────────────────────────────
   1. TYPES
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Ingest Handlers
// ───────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { ALLOWED_BASE_PATHS, DATABASE_PATH, checkDatabaseUpdated } from '../core';
import { MAX_INGEST_PATHS } from '../schemas/tool-input-schemas';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import {
  createIngestJob,
  enqueueIngestJob,
  getIngestJob,
  cancelIngestJob,
exec
/bin/zsh -lc "rg -n \"learning_index|0\\.4|0\\.35|0\\.25|delta_knowledge|delta_uncertainty|delta_context|avgLearningIndex|averageUncertaintyReduction\" .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
97:  averageUncertaintyReduction: number | null;
143:    delta_knowledge REAL,
144:    delta_uncertainty REAL,
145:    delta_context REAL,
146:    learning_index REAL,
424:  const learningIndex = (deltaKnowledge * 0.4) + (deltaUncertainty * 0.35) + (deltaContext * 0.25);
450:        delta_knowledge = ?,
451:        delta_uncertainty = ?,
452:        delta_context = ?,
453:        learning_index = ?,
509:          formula: 'LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25)',
617:            knowledge: (row.delta_knowledge as number | null) ?? null,
618:            uncertainty: (row.delta_uncertainty as number | null) ?? null,
619:            context: (row.delta_context as number | null) ?? null,
621:          learningIndex: (row.learning_index as number | null) ?? null,
641:          AVG(CASE WHEN phase = 'complete' THEN learning_index END) as avg_learning_index,
642:          MAX(CASE WHEN phase = 'complete' THEN learning_index END) as max_learning_index,
643:          MIN(CASE WHEN phase = 'complete' THEN learning_index END) as min_learning_index,
644:          AVG(CASE WHEN phase = 'complete' THEN delta_knowledge END) as avg_knowledge_gain,
645:          AVG(CASE WHEN phase = 'complete' THEN delta_uncertainty END) as avg_uncertainty_reduction,
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Stats
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import * as fs from 'fs';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as folderScoring from '../lib/scoring/folder-scoring';
import type { FolderMemoryInput } from '../lib/scoring/folder-scoring';
import { getGraphMetrics } from '../lib/search/hybrid-search';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import type { MCPResponse } from './types';
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud List
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { safeJsonParseTyped } from '../utils/json-helpers';

import type { MCPResponse } from './types';
import type { ListArgs } from './memory-crud-types';

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,300p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Index
// ───────────────────────────────────────────────────────────────
import path from 'path';

/* ───────────────────────────────────────────────────────────────
   1. CORE AND UTILS IMPORTS
──────────────────────────────────────────────────────────────── */

import { getLastScanTime, setLastScanTime, checkDatabaseUpdated } from '../core';
import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config';
import { processBatches, requireDb, toErrorMessage, type RetryErrorResult } from '../utils';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';

/* ───────────────────────────────────────────────────────────────
   2. LIB MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

import { recordHistory } from '../lib/storage/history';
import * as memoryParser from '../lib/parsing/memory-parser';
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Health
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { isEmbeddingModelReady } from '../core';
codex
The core discovery and maintenance handlers line up with the documented surfaces: `memory_list`, `memory_stats`, `memory_health`, and `memory_index_scan` are all live with the expected paging, diagnostics, and scan behavior. I’m in the mutation/lifecycle pass now, because that’s where I’m seeing the first likely catalog drift candidates around shared-memory tool names and a few overly broad source-file tables.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Update Handler
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { UpdateMemoryParams } from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
import { MemoryError, ErrorCodes } from '../lib/errors';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import { runInTransaction } from '../lib/storage/transaction-manager';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Delete
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { recordHistory } from '../lib/storage/history';
import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Bulk Delete
// ────────────────────────────────────────────────────────────────
// Tier-based bulk deletion of memories with safety gates.
// Eliminates the need for direct DB scripts when cleaning up
// Deprecated/temporary memories at scale.
import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as checkpoints from '../lib/storage/checkpoints';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import * as causalEdges from '../lib/storage/causal-edges';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { recordHistory } from '../lib/storage/history';
import { MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS } from '../schemas/tool-input-schemas';
import { appendMutationLedgerSafe } from './memory-crud-utils';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '620,980p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Checkpoints
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   1. LIB MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

import * as checkpoints from '../lib/storage/checkpoints';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import { executeAutoPromotion } from '../lib/search/auto-promotion';
import { recordSelection } from '../lib/search/learned-feedback';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
import { recordAdaptiveSignal } from '../lib/cognitive/adaptive-ranking';
import { checkDatabaseUpdated } from '../core';
import { requireDb, toErrorMessage } from '../utils';
 succeeded in 0ms:
      causalLinksResult,
      enrichmentStatus,
      filePath,
    });
  });
}

/* --- 8. INDEX MEMORY FILE --- */

/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
async function indexMemoryFile(
  filePath: string,
  {
    force = false,
    parsedOverride = null as ReturnType<typeof memoryParser.parseMemoryFile> | null,
    asyncEmbedding = false,
    scope = {} as MemoryScopeMatch,
  } = {},
): Promise<IndexResult> {
  // Reuse parsed content when provided by caller to avoid a second parse.
exec
/bin/zsh -lc 'rg -n "memory_quick_search|QuickSearch|quick_search" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:const memoryQuickSearch: ToolDefinition = {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:191:  name: 'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:589:  memoryQuickSearch,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:45:  'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/README.md:346:#### `memory_quick_search`
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:167:const memoryQuickSearchSchema = getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:394:  memory_quick_search: memoryQuickSearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:487:  memory_quick_search: ['query', 'limit', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:31:  'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:47:    case 'memory_quick_search': {
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:49:      const validated = validateToolArgs('memory_quick_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:333:  it('public and runtime schemas accept governed scope fields for memory_quick_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:343:      validateToolInputSchema('memory_quick_search', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:345:    expect(validateToolArgs('memory_quick_search', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:161:      'memory_quick_search',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:41:  it('forwards governed scope fields through memory_quick_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:42:    await handleTool('memory_quick_search', {
exec
/bin/zsh -lc "sed -n '160,230p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
        default: true,
        description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.'
      },
      // Fix #13 : Expose previously hidden handler parameters
      trackAccess: {
        type: 'boolean',
        default: false,
        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
      },
      includeArchived: {
        type: 'boolean',
        default: false,
        description: 'Include archived memories in search results. Default: false (archived excluded).'
      },
      mode: {
        type: 'string',
        enum: ['auto', 'deep'],
        default: 'auto',
        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
      },
exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L2-L4 memory tools: search, triggers, save,
// List, stats, health, delete, update, validate (T303).
import {
  handleMemorySearch,
  handleMemoryMatchTriggers,
  handleMemorySave,
  handleMemoryList,
  handleMemoryStats,
  handleMemoryHealth,
  handleMemoryDelete,
  handleMemoryUpdate,
  handleMemoryValidate,
  handleMemoryBulkDelete,
} from '../handlers';
import { validateToolArgs } from '../schemas/tool-input-schemas';

import {
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Namespace management CRUD tools (shared-memory lifecycle)"
description: "Tracks the shared-memory lifecycle tools that provide workspace-level scoping beyond `specFolder` with deny-by-default membership."
---

# Namespace management CRUD tools (shared-memory lifecycle)

## 1. OVERVIEW

Four shipped tools provide workspace-level scoping beyond per-spec-folder filtering. They live under the `/memory:shared` command and implement a deny-by-default membership model for multi-tenant shared-memory spaces. The subsystem is opt-in: disabled by default and activated via `shared_memory_enable`.

---

## 2. CURRENT REALITY

**SHIPPED.** All 4 tools are live at L5 under `/memory:shared`:

- **`shared_space_upsert`** -- Creates or updates a shared-memory space. Requires `spaceId`, `tenantId`, `name`, and exactly one actor identity (`actorUserId` or `actorAgentId`). Supports optional rollout parameters (`rolloutEnabled`, `rolloutCohort`, `killSwitch`). The first successful create for a new space auto-grants `owner` access to the acting caller. Later updates require the acting caller to already hold `owner` access.

- **`shared_space_membership_set`** -- Controls user/agent access with a deny-by-default model. Requires `spaceId`, `tenantId`, `subjectType` (`user` or `agent`), `subjectId`, `role` (`owner`, `editor`, or `viewer`), and exactly one actor identity (`actorUserId` or `actorAgentId`). The actor must already own the target space. This tool manages individual-level membership, not spec-folder participation.
exec
/bin/zsh -lc "sed -n '260,460p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts && rg -n \"0\\.1|0\\.05|confidence|promotionEligible|recordNegativeFeedbackEvent|executeAutoPromotion|recordSelection|recordUserSelection\" .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
        'Avoid immediate retry with clearExisting=true unless you intend to replace current state',
      ],
      startTime,
    });
  }

  return createMCPSuccessResponse({
    tool: 'checkpoint_restore',
    summary: `Checkpoint "${name}" restored successfully`,
    data: {
      success: true,
      restored: result
    },
    hints: clear_existing
      ? ['Previous data was cleared before restore', 'Search indexes rebuilt']
      : ['Restore merged with existing data - duplicates may exist', 'Search indexes rebuilt'],
    startTime: startTime
  });
}

exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\"); const base=\".opencode/skill/system-spec-kit/feature_catalog\"; const dirs=fs.readdirSync(base).filter(d=>/"'^(0[1-9]|10)--/.test(d)).sort(); for(const dir of dirs){ for(const file of fs.readdirSync(path.join(base,dir)).filter(f=>f.endsWith(".md")).sort()){ const rel=path.join(base,dir,file); const text=fs.readFileSync(rel,"utf8"); const refs=[...text.matchAll(/`([''^`]+'"\\.(?:ts|js|md|sh|json))"'`/g)].map(m=>m[1]); const unique=[...new Set(refs)].filter(r=>!r.startsWith('"'http')); const missing=unique.filter(r=>"'!fs.existsSync(r) && !fs.existsSync(path.join('"'.opencode/skill/system-spec-kit',r))); if(missing.length){ console.log(rel); for(const m of missing) console.log('  MISSING\\t'+m); } } }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
[eval]:1
const fs=require("fs"),path=require("path"); const base=".opencode/skill/system-spec-kit/feature_catalog"; const dirs=fs.readdirSync(base).filter(d=>/^(0[1-9]|10)--/.test(d)).sort(); for(const dir of dirs){ for(const file of fs.readdirSync(path.join(base,dir)).filter(f=>f.endsWith(".md")).sort()){ const rel=path.join(base,dir,file); const text=fs.readFileSync(rel,"utf8"); const refs=[...text.matchAll(/`([^`]+\.(?:ts|js|md|sh|json))`/g)].map(m=>m[1]); const unique=[...new Set(refs)].filter(r=>!r.startsWith(http)); const missing=unique.filter(r=>!fs.existsSync(r) && !fs.existsSync(path.join(.opencode/skill/system-spec-kit,r))); if(missing.length){ console.log(rel); for(const m of missing) console.log(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ^
Expected ',', got '.'

SyntaxError: Unexpected token '.'
    at makeContextifyScript (node:internal/vm:194:14)
    at compileScript (node:internal/process/execution:388:10)
    at evalTypeScript (node:internal/process/execution:260:22)
    at node:internal/main/eval_string:71:3

Node.js v25.6.1
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/refresh-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/graph/refresh-manager.ts: No such file or directory
exec
/bin/zsh -lc 'rg -n "snapshotDegrees|computeMomentum|computeMomentumScores|computeCausalDepth|community|Louvain|last_accessed|weight_history|created_by|graph refresh|SPECKIT_GRAPH_REFRESH_MODE|SPECKIT_GRAPH_LOCAL_THRESHOLD|LLM graph backfill|SPECKIT_LLM_GRAPH_BACKFILL|graph calibration|GRAPH_WEIGHT_CAP|n2aCap|n2bCap|louvainMinDensity|louvainMinSize|typed traversal|SPECKIT_TYPED_TRAVERSAL|SPARSE_DENSITY_THRESHOLD|causal neighbor boost|MAX_HOPS|SEED_FRACTION|temporal contiguity|vectorSearchWithContiguity|ANCHOR tags|graph nodes" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:177:        (memory_id, entity_text, entity_type, frequency, created_by)
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:207:        AND created_by = 'auto'
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:211:        (memory_id, entity_text, entity_type, frequency, created_by)
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:397: * deleting only `created_by='auto'` entries in scope, re-extracting from the
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:425:    WHERE me.created_by = 'auto'
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:452:    WHERE created_by = 'auto'
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:46:      created_by  TEXT NOT NULL DEFAULT 'entity_extractor',
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:67:      created_by TEXT DEFAULT 'manual'
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:364:      created_by: string;
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:370:    expect(rows[0].created_by).toBe('auto');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:536:      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:540:      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:582:      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:605:      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:609:      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:613:      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:625:      SELECT entity_text, created_by
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:629:    `).all() as Array<{ entity_text: string; created_by: string }>;
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:630:    expect(scopedRows.some((row) => row.entity_text === 'Curated Alias' && row.created_by === 'manual')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:632:    expect(scopedRows.some((row) => row.entity_text === 'Node.js' && row.created_by === 'auto')).toBe(true);
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Temporal Contiguity
// ───────────────────────────────────────────────────────────────
// Boost search results when memories are temporally adjacent,
// Query temporal neighbors, and build spec-folder timelines.

import type Database from 'better-sqlite3';

// Feature catalog: Temporal contiguity layer


/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

export const DEFAULT_WINDOW = 3600;   // 1 hour in seconds
export const MAX_WINDOW = 86400;      // 24 hours in seconds

const BOOST_FACTOR = 0.15;
// Cap the cumulative contiguity boost per result so that a cluster of
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/llm-backfill.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/graph/llm-backfill.ts: No such file or directory
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Graph Calibration
// ---------------------------------------------------------------
// Feature catalog: Graph calibration profiles and community thresholds
//
// D3 Phase C --- Graph Calibration & Communities:
// - REQ-D3-005: Graph weight calibration --- ablation harness, weight
//   cap enforcement, and calibration profile presets.
// - REQ-D3-006: Community detection thresholds --- Louvain activation
//   gates (density + size), community score capping (secondary-only).
//
// All features gated behind SPECKIT_GRAPH_CALIBRATION_PROFILE (default ON, graduated; set false to disable).

/* ---------------------------------------------------------------
   1. IMPORTS
---------------------------------------------------------------- */

// Feature catalog: Graph calibration profiles and community thresholds

/* ---------------------------------------------------------------
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      SELECT target_id AS node_id, COUNT(*) AS in_degree
      FROM causal_edges
      WHERE target_id IN (${placeholders})
      GROUP BY target_id
    `) as Database.Statement).all(...nodeIds) as Array<{
      node_id: string;
      in_degree: number;
    }>;

    if (degreeRows.length === 0) return 0;

    const maxDegree = Math.max(...degreeRows.map((r) => r.in_degree));
    if (maxDegree === 0) return 0;

    const updateStmt = db.prepare(`
      UPDATE causal_edges
      SET strength = MIN(1.0, strength + ?)
      WHERE target_id = ?
    `) as Database.Statement;

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Graph Lifecycle
// ───────────────────────────────────────────────────────────────
// Feature catalog: Graph-augmented retrieval — graph lifecycle
// REQ-D3-003: Graph Refresh on Write
// REQ-D3-004: Deterministic Save-Time Enrichment (wiring side)
//
// Gated via SPECKIT_GRAPH_REFRESH_MODE (off | write_local | scheduled)
// and SPECKIT_LLM_GRAPH_BACKFILL for async LLM enrichment.
//
// Design principles:
//   - All features graduated to default-ON via feature flags
//   - No breaking changes to existing save pipeline
//   - Deterministic extraction: no LLM calls for default path
//   - TypeScript strict mode; zero external runtime deps beyond better-sqlite3

import type Database from 'better-sqlite3';
import { createLogger } from '../utils/logger';
import { extractHeadings, extractAliases, extractRelationPhrases, extractCodeFenceTechnologies,
  createTypedEdges as _createTypedEdgesWithCallback, EXPLICIT_ONLY_EVIDENCE } from './deterministic-extractor';
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-fallback-tiered.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-fallback-tiered.ts: No such file or directory
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Working Memory
// ───────────────────────────────────────────────────────────────
// Session-based attention management
// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
// Only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
// The working_memory table, NOT memory_index. This is intentionally
// Independent of FSRS long-term decay — different time scale, different
// Domain (ephemeral session attention vs persistent memory scoring).
// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
// Ensures stable resting state and explicit low-score eviction.
import type Database from 'better-sqlite3';
import { isFeatureEnabled } from './rollout-policy';

// Feature catalog: Tool-result extraction to working memory
// Feature catalog: Working Memory Session Cleanup Timestamp Fix


/* --- 1. CONFIGURATION --- */

exec
/bin/zsh -lc "rg -n \"searchWithFallbackTiered|checkDegradation|Tier 1|Tier 2|Tier 3|minSimilarity=0\\.3|minSimilarity=0\\.1|resultCount < 3|relativeGap < 0\\.2|topScore < 0\\.02|memory_context|memory_match_triggers|memory_search|tool result extraction|working_memory|extract.*result|memory_quick_search|/memory:continue|resume\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/.opencode .opencode/command" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 0ms:
rg: .opencode/skill/system-spec-kit/.opencode: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:663: *   - working_memory: entries with last_focused older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:684:  // 1. Clean stale working_memory entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:686:    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:693:      errors.push(`working_memory cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:726:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1101:  const resumeCommand = specFolder
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1102:    ? `/spec_kit:resume ${specFolder}`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1104:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1105:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1145:${resumeCommand}
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:214:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:216:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:221:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:280:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:321:      console.warn('[memory_match_triggers] Scope filtering failed, returning unscoped results:', toErrorMessage(scopeErr));
exec
/bin/zsh -lc "rg -n \"memory:continue|resume\" .opencode/command .opencode/skill/system-spec-kit -g '*.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/README.md:326:| `/spec_kit:resume` | 4 | Resume a previous session on an existing spec folder |
.opencode/skill/system-spec-kit/README.md:347:| `/memory:continue` | Session recovery from crash, compaction or timeout via resume-mode memory retrieval |
.opencode/skill/system-spec-kit/README.md:442:After implementing the first phase of a feature, save context so the next session can resume:
.opencode/skill/system-spec-kit/README.md:462:/memory:continue
.opencode/skill/system-spec-kit/README.md:497:| Recover after crash | `/memory:continue` | Session interrupted unexpectedly |
.opencode/skill/system-spec-kit/README.md:587:| Session context lost after crash | Use `/memory:continue` to recover from last checkpoint |
.opencode/skill/system-spec-kit/mcp_server/README.md:61:| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
.opencode/skill/system-spec-kit/mcp_server/README.md:279:| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1148:| Resume a session | `memory_context` with `mode: "resume"` | Starting a new conversation on existing work |
.opencode/command/spec_kit/handover.md:210:> **Crash Recovery:** For emergency scenarios, same format can be saved as `CONTINUE_SESSION.md` in project root. Checked by `/spec_kit:resume` and `/memory:continue`.
.opencode/command/spec_kit/handover.md:220: /spec_kit:resume specs/014-auth-feature/
.opencode/command/spec_kit/handover.md:255:| `/spec_kit:resume`   | Loads handover document to continue work                         |
.opencode/command/spec_kit/handover.md:258:| `/memory:continue`   | Crash recovery - loads CONTINUE_SESSION.md or handover context   |
.opencode/command/spec_kit/handover.md:293:Run /spec_kit:handover, then /spec_kit:resume [spec-path] in new session
.opencode/command/spec_kit/handover.md:305:[Any workflow] -> /spec_kit:handover -> [/spec_kit:resume]
.opencode/command/spec_kit/handover.md:308:Next step: `/spec_kit:resume [spec-folder-path]` (in new session)
.opencode/command/spec_kit/handover.md:317:| Ready to continue now     | `/spec_kit:resume [spec-folder-path]`      | Load context and continue |
.opencode/command/memory/save.md:473:- `/memory:continue`: Session recovery
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:125:- Quick resume command
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:200:| Recover state | `recoverState(sessionId)` | On session resume |
