OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce97-be3c-7e41-a789-1a810465d07d
--------
user
You are a feature catalog verification agent. Read each feature snippet file in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/ (9 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
INVALID_PATHS: [list any paths that do not exist, or NONE]
MISSING_CODE_PATHS: [list source files that implement this but are not listed, or NONE]
SEVERITY: [HIGH/MEDIUM/LOW - how important are any issues found]
RECOMMENDED_ACTION: [NONE/UPDATE_DESCRIPTION/UPDATE_PATHS/BOTH/REWRITE]
NOTES: [brief explanation of any issues]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only verification pass: I’ll inspect the 9 feature snippets, trace each `## Source Files` section into the `mcp_server` code, and then compare the documented “Current Reality” against what the code actually does.
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify 9 feature catalog snippet files under .opencode/skill/system-spec-kit/feature_catalog/01--retrieval by checking Current Reality against source code, validating listed source file paths under mcp_server, and identifying missing important source files. Read-only review; no edits." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 639ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !spec, !system-spec-kit(explicit), document~, file"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !opencode, check~, code(name), opencode(name)"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
codex
SKILL ROUTING: `system-spec-kit` and `sk-code-review` both clear the threshold, and this request is a documentation-to-code verification pass inside `system-spec-kit`, so I’m using those review-oriented workflows without opening any write path. User specified: “Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing.”
Plan update
Read-only verification across 9 feature catalog files and their referenced mcp_server sources.
  → Inspect feature catalog files and extract each Current Reality plus listed Source Files
  • Read referenced mcp_server code, validate file existence, and search for missing important implementation files
  • Produce per-feature verification blocks in the requested format
codex
I’m pulling the feature list and a small slice of the two relevant skill docs now so the verification stays aligned with the repo’s own review rules before I trace code paths.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/01--retrieval' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:

 succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md
 succeeded in 51ms:
---
name: sk-code-review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code-opencode, sk-code-web, and sk-code-full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code-review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code-review` and paired with one `sk-code-*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
codex
I have the feature set and the review rules. Next I’m extracting each snippet’s `Current Reality` and `Source Files`, then I’ll cross-check those claims against the actual `mcp_server` implementation and search for unlisted implementation files.
exec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/*.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server -maxdepth 2 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     274 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md
     242 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md
     158 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md
     161 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md
     210 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md
      29 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md
      17 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md
      29 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md
      30 .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md
    1150 total
 succeeded in 51ms:
Total output lines: 362

.opencode/skill/system-spec-kit/mcp_server/.node-version-marker
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
.opencode/skill/system-spec-kit/mcp_server/LICENSE
.opencode/skill/system-spec-kit/mcp_server/README.md
.opencode/skill/system-spec-kit/mcp_server/_pending
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
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/*.md; do printf 'FILE: %s\\n' \""'${f##*/}"; awk '"'BEGIN{section=\"\"} /"'^## /{section=$0} section=="## Current Reality" || section=="## Source Files" {print} '"' \""'$f"; printf '"'\\n'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
Total output lines: 1104

FILE: 01-unified-context-retrieval-memorycontext.md
## Current Reality

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).

Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.

When no `specFolder` is provided, automatic spec folder discovery attempts to identify the most relevant folder from the query text using a cached one-sentence description per spec folder. If the target folder can be identified from the description alone, the system avoids full-corpus search entirely. Discovery failure is non-fatal and falls through to the standard retrieval path. This feature runs behind the `SPECKIT_FOLDER_DISCOVERY` flag.

Session management is built in. You can pass a `sessionId` for cross-turn deduplication (the system tracks which memories were already sent in this session and skips them) and working memory integration (attention-scored memories from previous turns carry over). In resume mode with `autoResumeEnabled`, the handler pulls working memory context items and injects them as `systemPromptContext` into the response. If you do not pass a session ID, an ephemeral UUID is generated for that single call.

Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.

## Source Files

### Implementation
codex
The catalog docs look much broader than the current runtime surface, so I’m checking the real source tree depth now before I judge accuracy. That should separate “outdated path inventory” issues from true behavior mismatches.
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server/lib -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/shared -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server/handlers -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
 succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/README.md
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
.opencode/skill/system-spec-kit/shared/algorithms/index.ts
.opencode/skill/system-spec-kit/shared/algorithms/mmr-reranker.ts
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
.opencode/skill/system-spec-kit/shared/chunking.ts
.opencode/skill/system-spec-kit/shared/config.ts
.opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.d.ts.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/adaptive-fusion.js.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/index.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/index.d.ts.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/index.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/index.js.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/mmr-reranker.d.ts
.opencode/skill/system-spec-kit/shared/dist/algorithms/mmr-reranker.d.ts.map
.opencode/skill/system-spec-kit/shared/dist/algorithms/mmr-reranker.js
.opencode/skill/system-spec-kit/shared/dist/algorithms/mmr-reranker.js.map
 succeeded in 51ms:
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
codex
The sandbox won’t let me use heredocs, so I’m switching to inline `node -e`/`rg` calls. Same inspection, just a more sandbox-friendly path.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const root=path.resolve(\".opencode/skill/system-spec-kit\"); const dir=path.join(root,\"feature_catalog/01--retrieval\"); for (const name of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()) { const text=fs.readFileSync(path.join(dir,name),\"utf8\"); const lines=text.split(/\\r?\\n/); let inSource=false; const paths=[]; for (const line of lines) { if (line.startsWith(\"## Source Files\")) { inSource=true; continue; } if (inSource && line.startsWith(\"## \") && "'!line.startsWith("## Source Files")) break; if (!inSource) continue; const m=line.match(/`([''^`]+)`/g); if (m) for (const token of m) paths.push(token.slice(1,-1)); } const uniq=[...new Set(paths)]; const invalid=uniq.filter(p=>!fs.existsSync(path.join(root,p))); console.log("FILE",name); console.log("PATH_COUNT",uniq.length); console.log("INVALID",invalid.length?invalid.join(" | "):"NONE"); console.log("---"); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE 01-unified-context-retrieval-memorycontext.md
PATH_COUNT 241
INVALID mcp_server/tests/retry.vitest.ts
---
FILE 02-semantic-and-lexical-search-memorysearch.md
PATH_COUNT 213
INVALID mcp_server/tests/retry.vitest.ts
---
FILE 03-trigger-phrase-matching-memorymatchtriggers.md
PATH_COUNT 129
INVALID mcp_server/tests/retry.vitest.ts
---
FILE 04-hybrid-search-pipeline.md
PATH_COUNT 128
INVALID mcp_server/tests/retry.vitest.ts
---
FILE 05-4-stage-pipeline-architecture.md
PATH_COUNT 175
INVALID mcp_server/tests/retry.vitest.ts
---
codex
I’ve confirmed the path inventory is mostly real, with one repeated invalid test path already showing up. Now I’m reading the handler and pipeline code itself so I can separate “path list issue” from “description issue” feature by feature.
exec
/bin/zsh -lc 'rg -n "memory_context|detectIntent|quick|focused|deep|resume|enforceTokenBudget|tokenUsage|SPECKIT_PRESSURE_POLICY|SPECKIT_FOLDER_DISCOVERY|autoResumeEnabled|systemPromptContext|retrieval telemetry|sessionId" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/cognitive .opencode/skill/system-spec-kit/mcp_server/lib/telemetry .opencode/skill/system-spec-kit/mcp_server/lib/session .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/schemas .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "4-stage|stage 1|stage 2|stage 3|stage 4|Stage4ReadonlyRow|captureScoreSnapshot|verifyScoreInvariant|isPipelineV2Enabled|postSearchPipeline|expandQuery|SPECKIT_PIPELINE_V2|searchWithFallbackTiered|checkDegradation|_degradation|minSimilarity|structural SQL fallback|ORDER BY importance_tier|quality threshold|RRF|MPAB|cross-encoder|minState|trackAccess" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "trigger phrase|memory_match_triggers|matchedTriggers|triggerPhrases|bm25|re-index|reindex|read_spec_section|remark|AST|working memory|working_memory|tool-result|checkpoint|event-distance|0.85|0.05|0.01|extract.*result|salient" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:29:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:30:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 2000.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:31:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Caller-supplied session identifier. If omitted, server generates an ephemeral UUID for this call only (not persisted across requests).' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:53:      sessionId: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:60:        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:114:        description: 'Apply length-based penalty during reranking. Penalizes very long memories to favor concise, focused results. Only effective when rerank is true.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:150:        enum: ['auto', 'deep'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:152:        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:258:      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:311:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:397:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:71:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:73:  resumedContextCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:91:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:95:  tokenUsage?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:154:function enforceTokenBudget(result: ContextResult, budgetTokens: number): { result: ContextResult; enforcement: TokenBudgetEnforcement } {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:253:  quick: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:261:  deep: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:269:  focused: {
 succeeded in 51ms:
Total output lines: 563

.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:15:// Sprint 5 (R6): 4-stage pipeline architecture
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:125:  minState?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:129:  trackAccess?: boolean; // AI-TRACE:P3-09: opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:277:  minState: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:304:  minState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:329:    minState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:544:// The V2 4-stage pipeline handles state filtering (Stage 4), testing effect, and
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:575:// shouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:577:// path. The V2 4-stage pipeline handles all equivalent functionality.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:606:    minState: minState = 'WARM',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:610:    trackAccess: trackAccess = false, // AI-TRACE:P3-09: opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:    minState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:793:          minState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:802:          trackAccess,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:64:  minSimilarity?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:100:/** Normalize a fused RRF result to the HybridSearchResult contract. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:157: * AI-WHY: Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:397: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
 succeeded in 52ms:
Total output lines: 2263

.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:10:import * as checkpointTools from './checkpoint-tools';
.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:13:export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools };
.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:22:  checkpointTools,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:524: *   - working_memory: entries with last_focused older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:545:  // 1. Clean stale working_memory entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:547:    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:554:      errors.push(`working_memory cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:587:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:615:    // AI-TRACE T302: Immediately clear working memory for cleared session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:815:    // AI-TRACE T302: Immediately clear working memory for completed session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1019:*This file is auto-generated on session checkpoint. It provides a human-readable recovery mechanism alongside SQLite persistence.*
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1055:function checkpointSession(
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1131:  checkpointSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:20:  triggerPhrases?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:69:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:153:      triggerPhrases: '["hello","world"]',
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:166:  it('C4: triggerPhrases parsed from JSON string', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:172:      triggerPhrases: '["phrase1","phrase2"]'
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '520,820p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Context
// ---------------------------------------------------------------

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
 succeeded in 51ms:

    if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
      effectiveMode = 'focused';
    }

    if (/\b(resume|continue|pick up|where was i|what's next)\b/i.test(normalizedInput)) {
      effectiveMode = 'resume';
    }

    const prePressureMode = effectiveMode;
    if (pressurePolicy.level === 'quick') {
      pressureOverrideTargetMode = 'quick';
    } else if (pressurePolicy.level === 'focused') {
      pressureOverrideTargetMode = 'focused';
    }

    if (pressureOverrideTargetMode) {
      effectiveMode = pressureOverrideTargetMode;
      pressureOverrideApplied = prePressureMode !== pressureOverrideTargetMode;

 succeeded in 51ms:
  // Deep: Comprehensive semantic search with full context
  deep: {
    name: 'Deep',
    description: 'Semantic search with full context retrieval',
    strategy: 'search',
    tokenBudget: 2000
  },

  // Focused: Intent-specific search with optimized weights
  focused: {
    name: 'Focused',
    description: 'Intent-aware search with task-specific optimization',
    strategy: 'intent-search',
    tokenBudget: 1500
  },

  // Resume: Session recovery mode
  resume: {
    name: 'Resume',
    description: 'Resume previous work with state and next-steps anchors',
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,620p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '620,980p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Search
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

import * as toolCache from '../lib/cache/tool-cache';
import * as sessionManager from '../lib/session/session-manager';
import * as intentClassifier from '../lib/search/intent-classifier';
// AI-WHY: tierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
import { isEnabled as isSessionBoostEnabled } from '../lib/search/session-boost';
import { isEnabled as isCausalBoostEnabled } from '../lib/search/causal-boost';
// Sprint 5 (R6): 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
// AI-TRACE:C136-09: Artifact-class routing (spec/plan/tasks/checklist/memory)
import { applyRoutingWeights, getStrategyForQuery } from '../lib/search/artifact-routing';
 succeeded in 51ms:
  normalizedQuery: string | null;
  hasValidConcepts: boolean;
  concepts?: string[];
  specFolder?: string;
  limit: number;
  mode?: string;
  tier?: string;
  contextType?: string;
  useDecay: boolean;
  includeArchived: boolean;
  qualityThreshold?: number;
  applyStateLimits: boolean | undefined;
  includeContiguity: boolean;
  includeConstitutional: boolean;
  includeContent: boolean;
  anchors?: string[] | string;
  detectedIntent: string | null;
  minState: string;
  rerank: boolean;
  applyLengthPenalty: boolean;
 succeeded in 52ms:
  const includeTrace = includeTraceByFlag || includeTraceArg === true;

  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);

  // AI-TRACE:T120: Validate numeric limit parameter
  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 100)
    : 10;

  // BUG-007: Validate query first with proper error handling
  let normalizedQuery: string | null = null;
  if (query !== undefined) {
    try {
      normalizedQuery = validateQuery(query);
    } catch (validationError: unknown) {
      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
        const message = toErrorMessage(validationError);
        return createMCPErrorResponse({
          tool: 'memory_search',
          error: message,
codex
I’ve got the main orchestration paths open now. The important pattern so far is that several docs describe the right general behavior, but the real implementation also depends on tool registration and session/flag modules that some snippets don’t list.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Triggers
// ---------------------------------------------------------------

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

/* ---------------------------------------------------------------
   1. DEPENDENCIES
--------------------------------------------------------------- */

// Core utilities
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';
import { createFilePathValidator } from '../utils/validators';

// Formatters
import { calculateTokenMetrics, type TokenMetrics } from '../formatters';

// Lib modules
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory CRUD Update Handler
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { UpdateMemoryParams } from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
import { MemoryError, ErrorCodes } from '../lib/errors';
import * as mutationLedger from '../lib/storage/mutation-ledger';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------
// Gzip-compressed database checkpoints with embedding preservation
// ---------------------------------------------------------------

// Node stdlib
import * as zlib from 'zlib';

// External packages
import type Database from 'better-sqlite3';

// Internal utils
import { toErrorMessage } from '../../utils/db-helpers';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const MAX_CHECKPOINTS = 10;
exec
/bin/zsh -lc 'rg -n "workingMemory|working_memory|checkpoint|restore|snapshot|includeEmbeddings" .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
4:// Gzip-compressed database checkpoints with embedding preservation
32:  memory_snapshot: Buffer | null;
33:  file_snapshot: Buffer | null;
43:  snapshotSize: number;
51:  includeEmbeddings?: boolean;
56:  restored: number;
59:  workingMemoryRestored: number;
69:  workingMemory: Array<Record<string, unknown>>;
90:  if (!db) throw new Error('Database not initialized. The checkpoints module requires the MCP server to be running. Restart the MCP server and retry.');
196:function snapshotCausalEdgesForMemoryIds(
273:  const snapshotColumns = new Set<string>();
277:        snapshotColumns.add(key);
328:  const ordered = preferredOrder.filter((column) => snapshotColumns.has(column));
329:  const extras = Array.from(snapshotColumns)
338:   Validate each memory row before restore to prevent silent data
339:   loss from corrupt/malformed checkpoint snapshots.
343: * Validates a single memory row from a checkpoint snapshot.
344: * Throws on invalid data — caller should reject the entire restore.
349: * backwards compatibility with older checkpoint formats.
385:    name = `checkpoint-${Date.now()}`,
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '520,760p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Working Memory
// ---------------------------------------------------------------
// AI-WHY: Session-based attention management
// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
// only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
// the working_memory table, NOT memory_index. This is intentionally
// independent of FSRS long-term decay — different time scale, different
// domain (ephemeral session attention vs persistent memory scoring).
// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
// ensures stable resting state and explicit low-score eviction.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isFeatureEnabled } from './rollout-policy';

/* --- 1. CONFIGURATION --- */

interface WorkingMemoryConfigType {
  enabled: boolean;
 succeeded in 51ms:

function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
  if (!db) return [];
  ensureSchema();

  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
  const safeFloor = Math.max(0, Math.min(1, floor));

  try {
    return (db.prepare(`
      SELECT
        wm.memory_id AS memoryId,
        COALESCE(m.title, '') AS title,
        COALESCE(m.file_path, '') AS filePath,
        wm.attention_score AS attentionScore
      FROM working_memory wm
      LEFT JOIN memory_index m ON wm.memory_id = m.id
      WHERE wm.session_id = ?
        AND wm.attention_score > ?
      ORDER BY wm.attention_score DESC, wm.last_focused DESC
 succeeded in 52ms:
        const mentionBoost = Math.min(entry.mention_count, MAX_MENTION_COUNT) * MENTION_BOOST_FACTOR;
        const rawScore = decayBase + mentionBoost;

        if (rawScore < DELETE_THRESHOLD) {
          const deleteResult = deleteStmt.run(entry.id) as { changes: number };
          changedRows += deleteResult.changes;
          continue;
        }

        // AI-WHY: Fix #29 (017-refinement-phase-6) — Clamp to [DECAY_FLOOR, 1.0].
        // Mention boost can push rawScore above 1.0 which breaks [0,1] score semantics.
        const nextScore = Math.max(DECAY_FLOOR, Math.min(1.0, rawScore));
        const updateResult = updateStmt.run(nextScore, entry.id) as { changes: number };
        changedRows += updateResult.changes;
      }
    })();

    return changedRows;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
exec
/bin/zsh -lc "rg -n \"upsertExtractedEntry|getSessionPromptContext\\(|systemPromptContext|sourceCallId|extractionRuleId|memory-surface|working memory\" .opencode/skill/system-spec-kit/mcp_server -g '"'!dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:7:import { clearConstitutionalCache } from '../hooks/memory-surface';
.opencode/skill/system-spec-kit/mcp_server/README.md:551:| **HOT**      | R >= 0.80        | Full content     | 5         | Active working memory, top priority        |
.opencode/skill/system-spec-kit/mcp_server/README.md:641:│   └── memory-surface.ts   # Memory surfacing hook
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:614:    const resumeContextItems = workingMemory.getSessionPromptContext(requestedSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:617:      (budgetedResult as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:623:      (budgetedResult as Record<string, unknown>).systemPromptContextInjected = true;
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:55:        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:5:export * from './memory-surface';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:615:    // AI-TRACE T302: Immediately clear working memory for cleared session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:815:    // AI-TRACE T302: Immediately clear working memory for completed session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:75:      "query": "what is the relationship between the working memory system and event decay",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:585:      "query": "SPECKIT_SESSION_BOOST working memory attention",
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:248:  const inserted = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:253:    sourceCallId: callId,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:254:    extractionRuleId: matched.rule.id,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:234:| `hooks/memory-surface.ts` | Triggers extraction pipeline post-tool |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:92:  sourceCallId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:93:  extractionRuleId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:261:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:300: * Set or update the attention score for a memory in working memory.
exec
/bin/zsh -lc "sed -n '200,320p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
      .get(`%${pathMatch[0]}`) as { id: number } | undefined;
    if (row?.id) {
      return row.id;
    }
  }

  return null;
}

function redactionRatio(original: string, redacted: string): number {
  if (original.length === 0) return 0;
  const delta = Math.max(0, original.length - redacted.length);
  return delta / original.length;
}

async function handleAfterTool(toolName: string, callId: string, result: unknown): Promise<void> {
  if (!isEnabled(callId) || !db) {
    return;
  }

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Surface
// ---------------------------------------------------------------

// Lib modules
import * as vectorIndex from '../lib/search/vector-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import { enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives';

import type { Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface ConstitutionalMemory {
  id: number;
  specFolder: string;
  filePath: string;
  title: string;
 succeeded in 51ms:
}

/* ---------------------------------------------------------------
   8. EXPORTS
--------------------------------------------------------------- */

export {
  // Constants
  MEMORY_AWARE_TOOLS,
  CONSTITUTIONAL_CACHE_TTL,
  TOOL_DISPATCH_TOKEN_BUDGET,
  COMPACTION_TOKEN_BUDGET,

  // Functions
  extractContextHint,
  getConstitutionalMemories,
  clearConstitutionalCache,
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
exec
/bin/zsh -lc 'rg -n "read_spec_section|remark|markdown AST|AST parsing|section retrieval|structure-aware-chunker" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/shared/README.md:197:│   └── structure-aware-chunker.ts # Markdown-aware chunking helpers
.opencode/skill/system-spec-kit/mcp_server/README.md:78:| **Context**       | Full documents      | ANCHOR-based section retrieval (93% token savings)       |
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts:3:// AST-based markdown chunking using remark-gfm that keeps
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts:8:import { chunkMarkdown, splitIntoBlocks } from '@spec-kit/shared/lib/structure-aware-chunker';
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts:9:import type { Chunk } from '@spec-kit/shared/lib/structure-aware-chunker';
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:163:├── structure-aware-chunker.vitest.ts      # Structure-aware document chunking
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:218:| Anchor-only | `extractAnchors(content)` | Targeted section retrieval |
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Orchestrator
// ---------------------------------------------------------------
// Sprint 5 (R6): 4-stage pipeline execution behind SPECKIT_PIPELINE_V2
//
// I/O CONTRACT:
//   Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
//   Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
//   Key invariants:
//     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
//     - Score fields are frozen after Stage 3; Stage 4 output scores == Stage 3 output scores
//     - Stage metadata for all four stages is included for observability
//   Side effects:
//     - Delegates to each stage; see individual stage modules for their side effects

import type {
  PipelineConfig,
  PipelineResult,
  Stage4ReadonlyRow,
} from './types';
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Stage1 Candidate Gen
// ---------------------------------------------------------------
// Sprint 5 (R6): 4-Stage Retrieval Pipeline Architecture
// ---------------------------------------------------------------
//
// Responsibility: Execute search channels and collect raw candidate results.
// This stage performs NO scoring modifications — it only retrieves candidates
// from the appropriate search channel based on search type.
//
// Search channels handled:
//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
//                         Suppressed when R15 classifies query as "simple" (mutual exclusion)
//   - hybrid: searchWithFallback → falls back to vector on failure
//   - vector: Direct vectorSearch
//
// Post-channel operations:
//   - Constitutional memory injection (if not already present)
 succeeded in 52ms:
              }
            }
          }
          candidates = merged;
        } catch (expandErr: unknown) {
          const expandMsg =
            expandErr instanceof Error ? expandErr.message : String(expandErr);
          console.warn(
            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
          );
          // Fall through to single hybrid search below
          channelCount = 1;
          candidates = (await hybridSearch.searchWithFallback(
            query,
            effectiveEmbedding,
            { limit, specFolder, includeArchived }
          )) as PipelineRow[];
        }
      } else {
        // expandQuery returned only the original; treat as standard hybrid
exec
/bin/zsh -lc "sed -n '520,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
        if (summaryEmbedding) {
          const summaryResults = querySummaryEmbeddings(db, summaryEmbedding, limit);
          if (summaryResults.length > 0) {
            const existingIds = new Set(candidates.map((r) => r.id));
            const newSummaryHits: PipelineRow[] = [];

            for (const sr of summaryResults) {
              if (!existingIds.has(sr.memoryId)) {
                // Fetch full memory row for the summary match
                const memRow = db.prepare(
                  'SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at FROM memory_index WHERE id = ?'
                ).get(sr.memoryId) as PipelineRow | undefined;

                if (memRow) {
                  newSummaryHits.push({
                    ...memRow,
                    similarity: sr.similarity * 100,
                    score: sr.similarity,
                  });
                  existingIds.add(sr.memoryId);
exec
/bin/zsh -lc "sed -n '430,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,360p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Stage3 Rerank
// ---------------------------------------------------------------
// AI-GUARD: 4-Stage Retrieval Pipeline: Stage 3 of 4
//
// Responsibilities (in execution order):
//   1. Cross-encoder reranking   — re-scores results via neural model
//   2. MMR diversity pruning     — maximal marginal relevance (SPECKIT_MMR flag)
//   3. MPAB chunk collapse        — dedup chunks, reassemble parents
//
// Pipeline position constraint (Sprint 4):
// MPAB MUST remain AFTER RRF fusion (Stage 2).
//   Stage 3 is the only stage that may change scores after Stage 2.
//
// I/O CONTRACT:
//   Input:  Stage3Input { scored: PipelineRow[], config }
//   Output: Stage3Output { reranked: PipelineRow[], metadata }
//   Key invariants:
//     - reranked is sorted descending by effective score after all steps
//     - Chunk rows (parent_id != null) are collapsed; only parent rows exit
 succeeded in 51ms:
  if (!db || !Array.isArray(results) || results.length === 0) return;

  for (const row of results) {
    try {
      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
      if (!lastReview) continue;

      const stability = typeof row.stability === 'number' && Number.isFinite(row.stability)
        ? row.stability
        : fsrsScheduler.DEFAULT_INITIAL_STABILITY;

      const elapsedDays = fsrsScheduler.calculateElapsedDays(lastReview);
      const currentR = fsrsScheduler.calculateRetrievability(
        stability,
        Math.max(0, elapsedDays)
      );

      strengthenOnAccess(db, row.id, currentR);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Stage4 Filter
// ---------------------------------------------------------------
// AI-WHY: Sprint 5 (R6): Final stage of the 4-stage retrieval pipeline.
//
// ARCHITECTURAL INVARIANT: Stage 4 MUST NOT modify scores.
// Any ordering change after Stage 3 is a bug. Score fields on
// Stage4ReadonlyRow are compile-time readonly; the runtime assertion
// via captureScoreSnapshot / verifyScoreInvariant provides a second
// defence-in-depth layer.
//
// I/O CONTRACT:
//   Input:  Stage4Input { results: Stage4ReadonlyRow[], config }
//   Output: Stage4Output { final: Stage4ReadonlyRow[], metadata, annotations }
//   Key invariants:
//     - No score field (similarity, score, rrfScore, intentAdjustedScore,
//       attentionScore, importance_weight) may change between input and output
//     - Ordering from Stage 3 is preserved for all surviving rows
//     - final contains only rows at or above config.minState priority
//   Side effects:
exec
/bin/zsh -lc "sed -n '1000,1075p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1320,1505p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

      if (isContextHeadersEnabled() && reranked.length > 0) {
        const descriptionCache = buildDescriptionTailMap();
        if (descriptionCache.size > 0) {
          reranked = reranked.map((row) => injectContextualTree(row, descriptionCache));
        }
      }

      // AI-WHY: Sprint 3: Attach pipeline metadata to results for eval/debugging
      // Metadata is attached as non-enumerable _s3meta property to avoid
      // polluting result serialization while remaining accessible for debugging.
      if (Object.keys(s3meta).length > 0 && reranked.length > 0) {
        Object.defineProperty(reranked, '_s3meta', { value: s3meta, enumerable: false, configurable: true });
      }

      return reranked;
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
 succeeded in 51ms:
  return tier3.map((row, index) => {
    const calibrated = Math.max(0, topCap - (index * decayPerRank));
    return {
      ...row,
      score: Math.min(row.score, calibrated),
    };
  });
}

/* --- 13. TIERED FALLBACK (PI-A2) --- */

/**
 * Evaluate whether results meet quality thresholds.
 * Returns null if thresholds are met, or a DegradationTrigger if not.
 */
function checkDegradation(results: HybridSearchResult[]): DegradationTrigger | null {
  const scores = results
    .map(r => r.score)
    .filter((score): score is number => typeof score === 'number' && Number.isFinite(score))
    .sort((a, b) => b - a);
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Search Flags
// ---------------------------------------------------------------
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Graph-guided MMR diversity reranking.
 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
 */
export function isMMREnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MMR');
}

/**
 * Transparent Reasoning Module (evidence-gap detection).
exec
/bin/zsh -lc 'rg -n "DEGRADATION_QUALITY_THRESHOLD|DEGRADATION_MIN_RELATIVE_GAP|DEGRADATION_MIN_RESULTS|structuralSearch|calibrateTier3Scores|importance_tier, importance_weight" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
161:const DEGRADATION_QUALITY_THRESHOLD = 0.02;
164:const DEGRADATION_MIN_RELATIVE_GAP = 0.2;
167:const DEGRADATION_MIN_RESULTS = 3;
1092:function structuralSearch(
1114:      SELECT id, title, file_path, importance_tier, importance_weight, spec_folder
1302:function calibrateTier3Scores(
1347:    topScore < DEGRADATION_QUALITY_THRESHOLD
1348:    && relativeGap < DEGRADATION_MIN_RELATIVE_GAP;
1349:  const insufficientResults = count < DEGRADATION_MIN_RESULTS;
1396: * TIER 3: structuralSearch (pure SQL last-resort)
1467:  const tier3Results = structuralSearch({ specFolder: options.specFolder, limit: options.limit });
1468:  const calibratedTier3 = calibrateTier3Scores(results, tier3Results);
1660:  calibrateTier3Scores,
1689:  structuralSearch,
1690:  DEGRADATION_QUALITY_THRESHOLD,
1691:  DEGRADATION_MIN_RESULTS,
exec
/bin/zsh -lc "sed -n '1088,1322p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
 *
 * @param options - Search options (specFolder for filtering, limit for cap).
 * @returns Array of HybridSearchResult with source='structural'.
 */
function structuralSearch(
  options: Pick<HybridSearchOptions, 'specFolder' | 'limit'> = {}
): HybridSearchResult[] {
  if (!db) return [];

  const limit = options.limit ?? DEFAULT_LIMIT;

  try {
    // Build SQL with optional specFolder filter
    const conditions = [
      `(importance_tier IS NULL OR importance_tier NOT IN ('deprecated', 'archived'))`
    ];
    const params: unknown[] = [];

    if (options.specFolder) {
      conditions.push(`spec_folder = ?`);
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Trigger Matcher
// ---------------------------------------------------------------
import * as vectorIndex from '../search/vector-index';
import { escapeRegex } from '../utils/path-security';

/* --- 1. TYPES --- */

/** Signal category detected in user prompt */
export type SignalCategory = 'correction' | 'preference' | 'neutral';

/** Result of signal detection for a prompt */
export interface SignalDetection {
  category: SignalCategory;
  keywords: string[];
  boost: number;
}

/** Trigger cache entry for a single phrase-to-memory mapping */
export interface TriggerCacheEntry {
 succeeded in 52ms:
export function clearCache(): void {
  triggerCache = null;
  cacheTimestamp = 0;
  regexLruCache.clear();
}

/** Get cache statistics */
export function getCacheStats(): CacheStats {
  return {
    size: triggerCache ? triggerCache.length : 0,
    timestamp: cacheTimestamp,
    ageMs: cacheTimestamp ? Date.now() - cacheTimestamp : null,
    regexCacheSize: regexLruCache.size,
    maxRegexCacheSize: CONFIG.MAX_REGEX_CACHE_SIZE,
  };
}

/* --- 5. STRING MATCHING --- */

/** Normalize string for Unicode-safe comparison */
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Memory Tools
// ---------------------------------------------------------------
// Dispatch for L2-L4 memory tools: search, triggers, save,
// list, stats, health, delete, update, validate (T303).
// ---------------------------------------------------------------

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
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Trigger phrase matching (memory_match_triggers)

## Current Reality

When you need speed over depth, trigger matching delivers. Rather than generating embeddings and running multi-channel search, it performs direct string matching of your prompt against stored trigger phrases. The performance target is under 100ms. Think of it as the "fast path" that sacrifices recall for latency.

Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.

Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.

The cognitive path fetches 2x the requested limit from the trigger matcher to give the cognitive pipeline headroom for filtering. If you request 3 results, 6 candidates enter the cognitive pipeline and the top 3 survivors are returned.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
          decayApplied: decayStats ? decayStats.decayedCount : 0
        } : null
      },
      hints: [
        'Ensure memories have trigger phrases defined',
        'Try a different prompt or check memory content'
      ],
      startTime: startTime
    });

    logFinalTriggerEval([], Date.now() - startTime);
    return noMatchResponse;
  }

  let formattedResults: FormattedResult[];
  let cognitiveStats: CognitiveStats | null = null;

  if (useCognitive) {
    // Step 3: ACTIVATE (T209)
    const activatedMemories: number[] = [];
exec
/bin/zsh -lc 'find .opencode/skill/system-spec-kit/mcp_server/lib/cache -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/composite-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Pressure Monitor
// ---------------------------------------------------------------

export interface RuntimeContextStats {
  tokenCount?: number;
  tokenBudget?: number;
}

type PressureSource = 'caller' | 'estimator' | 'unavailable';
type PressureLevel = 'none' | 'focused' | 'quick';

interface PressureMonitorResult {
  level: PressureLevel;
  ratio: number | null;
  source: PressureSource;
  warning: string | null;
}

const FOCUSED_THRESHOLD = 0.6;
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Folder Discovery
// ---------------------------------------------------------------
import * as fs from 'node:fs';
import * as path from 'node:path';

/* --- 1. TYPES --- */

/**
 * Describes a single spec folder with its cached description
 * and extracted keywords for lightweight matching.
 */
export interface FolderDescription {
  specFolder: string;
  description: string;
  keywords: string[];
  lastUpdated: string;
}

/**
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Semantic and lexical search (memory_search)

## Current Reality

This is the primary search tool, and it does a lot. You give it a natural language query (or a multi-concept array of 2-5 strings where all concepts must match), and it runs the full hybrid retrieval pipeline.

The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.

A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.

The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 51ms:
# Hybrid search pipeline

## Current Reality

The engine under the hood. `hybrid-search.ts` orchestrates multi-channel retrieval with five search channels, adaptive fusion, diversity reranking and a multi-tier fallback chain. This pipeline provides the candidate generation and fusion components used by Stage 1 of the 4-stage pipeline (the sole runtime path since the legacy V1 path was removed in Phase 017).

Five channels feed the pipeline. Vector search (cosine similarity via sqlite-vec, base weight 1.0) is the primary semantic signal. FTS5 (SQLite full-text search with weighted BM25, base weight 0.8) captures keyword matches the embedding might miss. In-memory BM25 (base weight 0.6, gated by `ENABLE_BM25`, default ON) provides broader coverage with a different tokenization approach. Graph search (causal edge traversal, base weight 0.5) finds structurally related memories through the causal graph. Degree search (connectivity scoring, base weight 0.4, gated by `SPECKIT_DEGREE_BOOST`, default ON) re-ranks by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50.

Adaptive fusion replaces hardcoded channel weights with intent-aware profiles. The `hybridAdaptiveFuse()` function selects weights based on the detected query intent, so a "fix_bug" query weights channels differently than a "find_spec" query. Results from all channels merge through `fuseResultsMulti()` using Reciprocal Rank Fusion.

Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).

After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, traverses the co-activation graph and applies a 0.25x boost to returned activation scores. A fan-effect divisor helper exists in `co-activation.ts`, but the Stage 2 hot path currently applies the spread score directly.

The fallback chain (`searchWithFallback()`) provides resilience. When `SPECKIT_SEARCH_FALLBACK` is enabled, the default path is a three-tier degradation flow: Tier 1 primary retrieval (default minimum similarity 0.3), Tier 2 widened retrieval at 0.1 with all channels forced on, and Tier 3 structural SQL search as last resort. When `SPECKIT_SEARCH_FALLBACK` is disabled, the legacy two-pass path is used (0.3 then 0.17). The system is designed to avoid empty returns except on hard failures.

## Source Files

### Implementation

 succeeded in 52ms:
# 4-stage pipeline architecture

## Current Reality

The pipeline refactor (R6) restructures the retrieval flow into four bounded stages with clear responsibilities and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as "simple", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.

Stage 2 (Fusion and Signal Integration) is the single authoritative scoring point. The current runtime order is: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a momentum + N2b depth), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, preventing G2 double-weighting), artifact routing weight boosts, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). The G2 prevention is structural: an `isHybrid` boolean computed once at the top of Stage 2 gates the intent weight step, so the code path for intent weights is absent when hybrid search already applied them during RRF fusion.

Stage 3 (Rerank and Aggregate) handles cross-encoder reranking (optional, gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly. Chunks are grouped by parent ID, the best chunk per group is elected by score, and full parent content is loaded from the database. On DB failure, the best-chunk row is emitted as a fallback. Non-chunks and reassembled parents merge and sort descending by effective score.

Stage 4 (Filter and Annotate) enforces a "no score changes" invariant through dual enforcement. At compile time, `Stage4ReadonlyRow` declares all six score fields as `Readonly`, making assignment a TypeScript error. At runtime, `captureScoreSnapshot()` records all scores before operations and `verifyScoreInvariant()` checks them afterward, throwing a `[Stage4Invariant]` error on any mismatch. Within this invariant, Stage 4 applies memory state filtering (removing rows below `config.minState` with optional per-tier hard limits), evidence gap detection via TRM Z-score analysis and annotation metadata for feature flags and state statistics. Session deduplication is explicitly excluded from Stage 4 and runs post-cache in the handler to avoid double-counting.

The pipeline is the sole runtime path. `SPECKIT_PIPELINE_V2` is deprecated — `isPipelineV2Enabled()` is hardcoded to `true` and the legacy `postSearchPipeline` was removed in Phase 017.

---

## Source Files

exec
/bin/zsh -lc "rg -n \"hybridAdaptiveFuse|fuseResultsMulti|adaptive fusion|query-router|SPECKIT_COMPLEXITY_ROUTER|SPECKIT_RSF_FUSION|SPECKIT_CHANNEL_MIN_REP|SPECKIT_CONFIDENCE_TRUNCATION|SPECKIT_DYNAMIC_TOKEN_BUDGET|INTENT_LAMBDA_MAP|computeDegreeScores|0.005|50\\b|ENABLE_BM25|forceAllChannels|vector search|ftsSearch|bm25Search|graphSearch|degree\" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:177:/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:19:type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:36:const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:57:  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:109: * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:14:  DEGREE: 'degree',
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:20:// discrimination vs. stability for our typical 10-50 candidate lists.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:175:function fuseResultsMulti(
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:310:  return fuseResultsMulti(lists, options);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:339:    fuseResultsMulti(lists, options)
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:473:  fuseResultsMulti,
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:5:import { fuseResultsMulti } from './rrf-fusion';
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:14:  /** Weight for semantic/vector search results (0-1) */
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:38:/** Represents adaptive fusion result. */
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:63:  find_decision:   { semanticWeight: 0.3, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.50, graphCausalBias: 0.15 },
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:111: * Check whether adaptive fusion is enabled via the feature flag and rollout policy.
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:114: * @returns True if adaptive fusion is enabled
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:123: * Compute adaptive fusion weights based on intent and optional document type.
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:178: * passing to `fuseResultsMulti`. The semanticWeight/keywordWeight map
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:215:  const fused = fuseResultsMulti(lists);
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '520,900p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Query Router
// ---------------------------------------------------------------
// Tier-to-channel-subset routing for query complexity (Sprint 3, T001b)
// Maps classifier tiers to channel subsets for selective pipeline execution.

import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  type QueryComplexityTier,
  type ClassificationResult,
} from './query-classifier';

/* -----------------------------------------------------------
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Adaptive Fusion
// ---------------------------------------------------------------
// Local
import { fuseResultsMulti } from './rrf-fusion';

// Type-only
import type { RrfItem, FusionResult, RankedList } from './rrf-fusion';

/* --- 1. INTERFACES --- */

/** Represents fusion weights. */
export interface FusionWeights {
  /** Weight for semantic/vector search results (0-1) */
  semanticWeight: number;
  /** Weight for keyword/lexical search results (0-1) */
  keywordWeight: number;
  /** Weight for recency-based scoring (0-1) */
  recencyWeight: number;
  /** Weight for graph channel results (0-1). Only used when graph channel active. */
 succeeded in 52ms:
 * Enhanced hybrid search with RRF fusion.
 * All search channels use synchronous better-sqlite3; sequential execution
 * is correct — Promise.all would add overhead without achieving parallelism.
 */
async function hybridSearchEnhanced(
  query: string,
  embedding: Float32Array | number[] | null,
  options: HybridSearchOptions = {}
): Promise<HybridSearchResult[]> {
  try {
    const lists: Array<{
      source: string;
      results: Array<{ id: number | string; [key: string]: unknown }>;
      weight?: number;
    }> = [];

    // Sprint 3: Pipeline metadata collector (populated by flag-gated stages)
    const s3meta: Sprint3PipelineMeta = {};

    // AI-WHY: -- Sprint 3 Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
exec
/bin/zsh -lc 'rg -n "ENABLE_BM25|SPECKIT_COMPLEXITY_ROUTER|SPECKIT_RSF_FUSION|SPECKIT_CHANNEL_MIN_REP|SPECKIT_CONFIDENCE_TRUNCATION|SPECKIT_DYNAMIC_TOKEN_BUDGET|isBm25Enabled|hard cap of 50|logarithmic normalization|0.005" .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:42: * Default: TRUE (graduated). Set SPECKIT_CONFIDENCE_TRUNCATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:44: * @returns True when SPECKIT_CONFIDENCE_TRUNCATION is not explicitly disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:47:  const raw = process.env.SPECKIT_CONFIDENCE_TRUNCATION?.toLowerCase()?.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:103: * When SPECKIT_CONFIDENCE_TRUNCATION is disabled, passes results through unchanged.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:39: * Default: TRUE (graduated Sprint 4). Set SPECKIT_COMPLEXITY_ROUTER=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:41: * @returns True when SPECKIT_COMPLEXITY_ROUTER is not explicitly disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:44:  const raw = process.env.SPECKIT_COMPLEXITY_ROUTER?.toLowerCase()?.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:132: * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled (default),
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:7: * AI-WHY: QUALITY_FLOOR changed from 0.2 to 0.005 (Sprint 10, D3). The original 0.2
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:10: * The 0.005 floor prevents promoting genuinely irrelevant results while remaining
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:12:export const QUALITY_FLOOR = 0.005;
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:15:const FEATURE_FLAG = 'SPECKIT_CHANNEL_MIN_REP';
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:63: * Default: TRUE (graduated). Set SPECKIT_CHANNEL_MIN_REP=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:65: * @returns True when SPECKIT_CHANNEL_MIN_REP is not explicitly disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:82: *  - Promotion only occurs for results with score >= QUALITY_FLOOR (0.005).
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:51: * Default: TRUE (graduated). Set SPECKIT_DYNAMIC_TOKEN_BUDGET=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:53: * @returns True when SPECKIT_DYNAMIC_TOKEN_BUDGET is not explicitly disabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:56:  const raw = process.env.SPECKIT_DYNAMIC_TOKEN_BUDGET?.toLowerCase()?.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:65: * When SPECKIT_DYNAMIC_TOKEN_BUDGET is disabled (default), returns the DEFAULT_BUDGET
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:56:function isBm25Enabled(): boolean {
exec
/bin/zsh -lc "rg -n \"computeDegreeScores|Math\\.log|50|cap\" .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
37:/** Hard cap on raw typed degree before normalization */
38:const MAX_TOTAL_DEGREE = 50;
194:  const escaped = query.replace(/[%_]/g, '\\$&');
195:  const likeParam = `%${escaped}%`;
266: *     computeDegreeScores() as each memory ID is encountered during a search.
304:  // Apply hard cap before normalization
312: * Then caps at DEGREE_BOOST_CAP (0.15).
323:  const normalized = Math.log(1 + rawDegree) / Math.log(1 + maxDegree);
369:function computeDegreeScores(
472:  computeDegreeScores,
exec
/bin/zsh -lc "sed -n '280,360p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
 * weighting each edge by its relation type weight * edge strength.
 *
 * Formula: typed_degree(node) = SUM(weight_t * strength) for all connected edges
 */
function computeTypedDegree(
  database: Database.Database,
  memoryId: string | number
): number {
  const id = String(memoryId);

  // Single SQL: UNION ALL of source and target participation
  const rows = (database.prepare(`
    SELECT relation, strength FROM causal_edges WHERE source_id = ?
    UNION ALL
    SELECT relation, strength FROM causal_edges WHERE target_id = ?
  `) as Database.Statement).all(id, id) as Array<{ relation: string; strength: number }>;

  let total = 0;
  for (const row of rows) {
    const weight = EDGE_TYPE_WEIGHTS[row.relation] ?? 0;
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Dynamic Token Budget
// ---------------------------------------------------------------
//
// ADVISORY-ONLY: This module computes a token budget for a query
// based on its complexity tier, but does NOT enforce that budget
// downstream. The returned BudgetResult is handed to callers who
// are solely responsible for respecting it (e.g. by trimming
// result sets or truncating content before sending to the LLM).
// ---------------------------------------------------------------
import { type QueryComplexityTier } from './query-classifier';

/* --- 1. TYPES & CONSTANTS --- */

/** Budget (in tokens) allocated per complexity tier. */
interface TokenBudgetConfig {
  /** Simple query budget: 1500 tokens. */
  simple: number;
  /** Moderate query budget: 2500 tokens. */
  moderate: number;
exec
/bin/zsh -lc "sed -n '900,1010p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
      // C138: Co-activation spreading — enrich with temporal neighbors
      const topIds = reranked
        .slice(0, SPREAD_ACTIVATION_TOP_N)
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');
      if (topIds.length > 0) {
        try {
          const spreadResults: SpreadResult[] = spreadActivation(topIds);
          // Boost scores of results that appear in co-activation graph
          if (spreadResults.length > 0) {
            const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
            for (const result of reranked) {
              const boost = spreadMap.get(result.id as number);
              if (boost !== undefined) {
                (result as Record<string, unknown>).score =
                  ((result.score as number) ?? 0) + boost * CO_ACTIVATION_CONFIG.boostFactor;
              }
            }
          }
          // AI-TRACE: P1-2 FIX: Re-sort after co-activation boost to ensure boosted results
exec
/bin/zsh -lc 'rg -n "truncateToBudget|context-budget|getDynamicTokenBudget|RSF|shadow" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:2:// MODULE: RSF Fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:8:/** Result of RSF fusion: an RrfItem augmented with normalized fused score and source tracking. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts:30: * A single search result eligible for context-budget selection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:33:import { getDynamicTokenBudget, isDynamicTokenBudgetEnabled } from './dynamic-token-budget';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:123:  /** RSF shadow fusion result (SPECKIT_RSF_FUSION) — shadow-mode only, not used for ranking. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:568:    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:569:    const budgetResult = getDynamicTokenBudget(routeResult.tier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:953:      const s4shadowMeta = (reranked as unknown as Record<string, unknown>)['_s4shadow'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:961:      const budgeted = truncateToBudget(reranked, adjustedBudget, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:967:      if (s4shadowMeta !== undefined && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:968:        Object.defineProperty(reranked, '_s4shadow', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:969:          value: s4shadowMeta,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:985:      // non-enumerable array shadow properties.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:986:      if ((s4shadowMeta !== undefined || s4attributionMeta !== undefined || degradationMeta !== undefined) && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:990:            stage4: s4shadowMeta ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1583:function truncateToBudget(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680:  truncateToBudget,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1686:  getDynamicTokenBudget,
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Query Classifier
// ---------------------------------------------------------------
/* --- 1. TYPES & CONSTANTS --- */

type QueryComplexityTier = 'simple' | 'moderate' | 'complex';

interface ClassificationResult {
  tier: QueryComplexityTier;
  features: {
    termCount: number;
    charCount: number;
    hasTriggerMatch: boolean;
    stopWordRatio: number;
  };
  confidence: 'high' | 'medium' | 'low' | 'fallback';
}

/** Config-driven thresholds */
const SIMPLE_TERM_THRESHOLD = 3;
exec
/bin/zsh -lc 'rg -n "collapseAndReassembleChunkResults|bestChunk|parentId|mpabScore|reassembled_chunks|file_read_fallback" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
21://     - contentSource is set to 'reassembled_chunks' or 'file_read_fallback'
88:  parentId: number;
91:  bestChunk: PipelineRow;
210:    await collapseAndReassembleChunkResults(results);
411:async function collapseAndReassembleChunkResults(
426:    const parentId = row.parent_id ?? row.parentId;
427:    if (parentId != null && typeof parentId === 'number') {
429:      const group = chunksByParent.get(parentId);
433:        chunksByParent.set(parentId, [row]);
449:  for (const [parentId, chunks] of chunksByParent) {
450:    const bestChunk = electBestChunk(chunks);
458:    chunkGroups.push({ parentId, chunks, bestChunk });
510: *   - `contentSource: 'reassembled_chunks'` to mark provenance
513: *   `contentSource: 'file_read_fallback'`.
515: * @param group  - The chunk group (parentId + chunks + bestChunk).
523:  const { parentId, bestChunk } = group;
537:      .get(parentId) as Record<string, unknown> | undefined;
542:      return markFallback(bestChunk);
547:      ...bestChunk,
549:      id: parentId,
exec
/bin/zsh -lc "sed -n '360,620p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    return { rows: rerankedRows, applied: true };
  } catch (err: unknown) {
    // AI-WHY: Graceful degradation — return original results on any reranker failure
    console.warn(
      `[stage3-rerank] Cross-encoder reranking failed: ${toErrorMessage(err)} — returning original results`
    );
    return { rows: results, applied: false };
  }
}

/**
 * Resolve the content string used for cross-encoder scoring for a given row.
 * Prefers `content` over `file_path`; falls back to an empty string if
 * neither is available (rare edge case for index-only entries).
 *
 * This value is placed into the `content` field of the RerankDocument sent
 * to the cross-encoder module.
 *
 * @param row - A pipeline result row.
 * @returns Content string for the cross-encoder.
exec
/bin/zsh -lc "rg -n \"0\\.8|1\\.2|validation\" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:5:// PURPOSE: Extract validation signals from spec document metadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:13://   4. content          → validation completion markers
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:17:// adds the `validationMetadata` key to enriched rows.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:45: * Markers that indicate a completed validation pass in the content.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:73:  /** ISO date string of the most recent validation, if present in content. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:74:  validationDate?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:116: * Scan content for validation completion markers.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:118: * 'partial' when validation-related content exists but no completion marker,
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:129:  // Partial signal: content mentions validation-related keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:144: * Attempt to extract a validation date from a content string.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:157: * Extract validation signals from a single memory pipeline row.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:164: *   4. `content` → completion markers (completionStatus, validationDate).
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:167: * Returns null when the row carries no extractable validation signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:222:      const validationDate = extractValidationDate(effectiveContent);
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:223:      if (validationDate !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:224:        result.validationDate = validationDate;
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:250: * Enrich a batch of pipeline rows with validation metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:253: * result is returned, it is attached to the row under the `validationMetadata`
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:259: * @returns New array with `validationMetadata` added where signals exist.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:272:      validationMetadata: metadata,
exec
/bin/zsh -lc 'rg -n "initExtractionAdapter|registerAfterTool|after tool|memory-surface|autoSurfaceAtToolDispatch" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/lib/extraction .opencode/skill/system-spec-kit/mcp_server/hooks .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:48:  autoSurfaceAtToolDispatch,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:94:import { initExtractionAdapter } from './lib/extraction/extraction-adapter';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:244:export function registerAfterToolCallback(fn: AfterToolCallback): void {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:304:        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:880:      initExtractionAdapter(database, registerAfterToolCallback);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:266:function initExtractionAdapter(database: Database.Database, registerCallback: RegisterAfterToolCallback): void {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:285:  initExtractionAdapter,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:234:| `hooks/memory-surface.ts` | Triggers extraction pipeline post-tool |
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:178: * autoSurfaceAtToolDispatch
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:196:async function autoSurfaceAtToolDispatch(
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:278:  autoSurfaceAtToolDispatch,
.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:5:export * from './memory-surface';
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:42:- `autoSurfaceAtToolDispatch(toolName, toolArgs, options)`
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:7:import { clearConstitutionalCache } from '../hooks/memory-surface';
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
# Unified context retrieval (memory_context)

## Current Reality

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).

Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.

When no `specFolder` is provided, automatic spec folder discovery attempts to identify the most relevant folder from the query text using a cached one-sentence description per spec folder. If the target folder can be identified from the description alone, the system avoids full-corpus search entirely. Discovery failure is non-fatal and falls through to the standard retrieval path. This feature runs behind the `SPECKIT_FOLDER_DISCOVERY` flag.

Session management is built in. You can pass a `sessionId` for cross-turn deduplication (the system tracks which memories were already sent in this session and skips them) and working memory integration (attention-scored memories from previous turns carry over). In resume mode with `autoResumeEnabled`, the handler pulls working memory context items and injects them as `systemPromptContext` into the response. If you do not pass a session ID, an ephemeral UUID is generated for that single call.

Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.

## Source Files

### Implementation

codex
I’ve finished the code tracing. I’m consolidating the per-feature verdicts now, with the main pattern being: one stale repeated test path, a few missing tool/handler entrypoints, and two feature descriptions that no longer match the live implementation details closely enough.
Plan update
  ✓ Inspect feature catalog files and extract each Current Reality plus listed Source Files
  ✓ Read referenced mcp_server code, validate file existence, and search for missing important implementation files
  → Produce per-feature verification blocks in the requested format
codex
---
FEATURE: 01-unified-context-retrieval-memorycontext.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/context-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The `memory_context` behavior in `handlers/memory-context.ts` matches the writeup closely. The source inventory is slightly stale: it includes one nonexistent test file and omits the tool dispatcher that exposes `memory_context`.
---
FEATURE: 02-semantic-and-lexical-search-memorysearch.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `memory_search` does route through `executePipeline()`, but the description overstates Stage 2 as the only place ranking work happens. Stage 1 delegates hybrid queries to `lib/search/hybrid-search.ts`, which already performs fusion/reranking-style work before Stage 2. The tool dispatcher is also missing from the path list.
---
FEATURE: 03-trigger-phrase-matching-memorymatchtriggers.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Direct trigger matching, 2x candidate headroom, tiered content injection, and the 100ms target all match. The cognitive-decay description is off: runtime uses working-memory event decay at `0.85^eventsElapsed`, while the handler separately applies a `0.98^(turn-1)` turn factor during tiering. The tool dispatcher is omitted.
---
FEATURE: 04-hybrid-search-pipeline.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/lib/search/rsf-fusion.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The hybrid-search description lines up well with `lib/search/hybrid-search.ts`, including five channels, adaptive fusion, routing, enforcement, truncation, MMR, co-activation, and fallback. The path list misses the RSF shadow-fusion module it explicitly discusses, and still references one nonexistent test file.
---
FEATURE: 05-4-stage-pipeline-architecture.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-search.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The 4-stage modules exist, but the description no longer fully matches runtime reality. It says Stage 2 is the single authoritative scoring point, yet Stage 1 calls `lib/search/hybrid-search.ts`, which already performs fusion/MMR/co-activation/token-budget logic before Stage 2. The runtime entry handler is also missing from the listed sources.
---
FEATURE: 06-bm25-trigger-phrase-re-index-gate.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-crud-update.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The quoted condition matches `handlers/memory-crud-update.ts` exactly. The current source list names supporting BM25 files but omits the handler where the title/trigger-phrase reindex gate actually lives.
---
FEATURE: 07-ast-level-section-retrieval-tool.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: There is no implemented `read_spec_section(...)` tool or `remark`-based section retrieval in `mcp_server`. There is adjacent AST-aware chunking infrastructure in shared/test code, but not this feature.
---
FEATURE: 08-quality-aware-3-tier-search-fallback.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/search-flags.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The fallback chain does live in `lib/search/hybrid-search.ts`, but the description is wrong on a key detail: Tier 3 structural scores are capped below about 90% of the current top score, not 50%. The listed `stage4-filter.ts` path does not implement this fallback behavior, and the gating file is omitted.
---
FEATURE: 09-tool-result-extraction-to-working-memory.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/extraction/extraction-adapter.ts, mcp_server/context-server.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: Working-memory storage and checkpoint save/restore are real, and the decay constants in `working-memory.ts` match. But tool-result extraction is not implemented by `working-memory.ts` alone; it is driven by `lib/extraction/extraction-adapter.ts`, which is registered from `context-server.ts` via after-tool callbacks.
---
tokens used
209,098
---
FEATURE: 01-unified-context-retrieval-memorycontext.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/context-tools.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The `memory_context` behavior in `handlers/memory-context.ts` matches the writeup closely. The source inventory is slightly stale: it includes one nonexistent test file and omits the tool dispatcher that exposes `memory_context`.
---
FEATURE: 02-semantic-and-lexical-search-memorysearch.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `memory_search` does route through `executePipeline()`, but the description overstates Stage 2 as the only place ranking work happens. Stage 1 delegates hybrid queries to `lib/search/hybrid-search.ts`, which already performs fusion/reranking-style work before Stage 2. The tool dispatcher is also missing from the path list.
---
FEATURE: 03-trigger-phrase-matching-memorymatchtriggers.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/tools/memory-tools.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: Direct trigger matching, 2x candidate headroom, tiered content injection, and the 100ms target all match. The cognitive-decay description is off: runtime uses working-memory event decay at `0.85^eventsElapsed`, while the handler separately applies a `0.98^(turn-1)` turn factor during tiering. The tool dispatcher is omitted.
---
FEATURE: 04-hybrid-search-pipeline.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/lib/search/rsf-fusion.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The hybrid-search description lines up well with `lib/search/hybrid-search.ts`, including five channels, adaptive fusion, routing, enforcement, truncation, MMR, co-activation, and fallback. The path list misses the RSF shadow-fusion module it explicitly discusses, and still references one nonexistent test file.
---
FEATURE: 05-4-stage-pipeline-architecture.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_CODE_PATHS: mcp_server/handlers/memory-search.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The 4-stage modules exist, but the description no longer fully matches runtime reality. It says Stage 2 is the single authoritative scoring point, yet Stage 1 calls `lib/search/hybrid-search.ts`, which already performs fusion/MMR/co-activation/token-budget logic before Stage 2. The runtime entry handler is also missing from the listed sources.
---
FEATURE: 06-bm25-trigger-phrase-re-index-gate.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-crud-update.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The quoted condition matches `handlers/memory-crud-update.ts` exactly. The current source list names supporting BM25 files but omits the handler where the title/trigger-phrase reindex gate actually lives.
---
FEATURE: 07-ast-level-section-retrieval-tool.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: LOW
RECOMMENDED_ACTION: NONE
NOTES: There is no implemented `read_spec_section(...)` tool or `remark`-based section retrieval in `mcp_server`. There is adjacent AST-aware chunking infrastructure in shared/test code, but not this feature.
---
FEATURE: 08-quality-aware-3-tier-search-fallback.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/search-flags.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: The fallback chain does live in `lib/search/hybrid-search.ts`, but the description is wrong on a key detail: Tier 3 structural scores are capped below about 90% of the current top score, not 50%. The listed `stage4-filter.ts` path does not implement this fallback behavior, and the gating file is omitted.
---
FEATURE: 09-tool-result-extraction-to-working-memory.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/extraction/extraction-adapter.ts, mcp_server/context-server.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: BOTH
NOTES: Working-memory storage and checkpoint save/restore are real, and the decay constants in `working-memory.ts` match. But tool-result extraction is not implemented by `working-memory.ts` alone; it is driven by `lib/extraction/extraction-adapter.ts`, which is registered from `context-server.ts` via after-tool callbacks.
---
