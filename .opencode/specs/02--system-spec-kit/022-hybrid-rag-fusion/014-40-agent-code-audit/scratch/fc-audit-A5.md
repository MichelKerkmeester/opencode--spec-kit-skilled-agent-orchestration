OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cd69c-e06d-7571-98fb-65413d27f567
--------
user
You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 44 feature files across 6 categories. Categories 17, 19, 20 are lightweight (governance, decisions, flags); category 18 (ux-hooks) is the heaviest.

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 15-retrieval-enhancements: 1 pass (01), 8 issues (2 desc+paths, 6 paths).
- Category 16-tooling: 0 passes, 8 issues (6 desc+paths, 2 paths). Also has check-architecture-boundaries.ts reference to remove (PV-003).
- Category 17-governance: 0 passes, 2 issues (1 rewrite: 02-feature-flag-sunset-audit, 1 paths).
- Category 18-ux-hooks: 1 pass (01), 12 issues (12 paths-only).
- Category 19-decisions: 0 passes, 5 issues (4 paths, 1 desc).
- Category 20-feature-flags: 0 passes, 7 issues (2 rewrites: 01-search-pipeline, 05-embedding-api, 2 desc+paths, 3 paths).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts. check-architecture-boundaries.ts removed (PV-003).

YOUR ASSIGNED DIRECTORIES (44 files total):
- .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/ (9 files)
- .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/ (8 files)
- .opencode/skill/system-spec-kit/feature_catalog/17--governance/ (2 files)
- .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/ (13 files)
- .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/ (5 files)
- .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/ (7 files)

SOURCE CODE ROOT: .opencode/skill/system-spec-kit/mcp_server/
SHARED CODE ROOT: .opencode/skill/system-spec-kit/shared/
SCRIPTS ROOT: .opencode/skill/system-spec-kit/scripts/


STEP-BY-STEP METHOD:
1. List all feature .md files in your assigned directories
2. For each feature file:
   a. Read the full file content
   b. Extract all source file paths from the Implementation and Test tables
   c. Verify each path exists using: test -f .opencode/skill/system-spec-kit/[path]
   d. Read the key implementation files (at minimum the first 2-3 listed in the Implementation table)
   e. Compare the "Current Reality" text against the actual code behavior
   f. Note any significant code functionality not mentioned in the feature description
   g. Produce the structured output block below

For features with 100+ source file references, verify a representative sample (first 10 implementation + first 5 test files) and note the scope limitation.
For features marked "No dedicated source files", verify the claim is correct.

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
CATEGORY: [category directory name]
DESCRIPTION_ACCURACY: [ACCURATE/PARTIAL/INACCURATE]
DESCRIPTION_ISSUES: [specific claims that are wrong or outdated, or NONE]
PATHS_VALID: [YES/NO]
INVALID_PATHS: [list of paths that do not exist, or NONE]
MISSING_PATHS: [source files that implement this feature but are not listed, or NONE]
UNDOCUMENTED_CAPABILITIES: [significant code behaviors not mentioned in description, or NONE]
SEVERITY: [P0/P1/P2]
RECOMMENDED_ACTION: [NONE/UPDATE_PATHS/UPDATE_DESCRIPTION/BOTH/REWRITE]
EVIDENCE: [brief quote or line reference from source code supporting your findings]
---

IMPORTANT RULES:
- Do NOT skip any feature file. Audit every single one in your assigned directories.
- Be specific in DESCRIPTION_ISSUES — cite what the description says vs. what the code does.
- Use shell commands to verify file existence and read source code.
- Work through files sequentially and methodically.

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents or use the Task tool to create sub-tasks. Execute your work directly using your available tools. If you cannot complete the task alone, return what you have and escalate to the orchestrator.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m auditing the 44 feature files directly against the `system-spec-kit` source tree. First I’m listing the assigned catalog files and running the required skill routing check so we can work through the set methodically and keep the results grounded in the actual code.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts .opencode/skill/system-spec-kit/feature_catalog/17--governance .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals .opencode/skill/system-spec-kit/20--feature-flag-reference' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 52ms:
rg: .opencode/skill/system-spec-kit/20--feature-flag-reference: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md
.opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-safety.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/04-schema-and-type-contract-synchronization.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-append.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/05-dedicated-ux-hook-modules.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Audit 44 feature catalog markdown files against TypeScript MCP server source code, verify documented paths exist, compare Current Reality text to implementation, and flag undocumented capabilities" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 608ms:
[
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, !mcp(multi), !server(multi), code(name), mcp(name)"
  },
  {
    "skill": "sk-code--full-stack",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !intent:implementation, code(name), files, implementation"
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
codex
Skill routing came back strongest for `sk-code--review`, with `sk-doc` also relevant because we’re auditing markdown against source. I’m loading just those instructions now, then I’ll build a sequential audit pass that extracts source tables, checks the paths on disk, and compares each feature’s “Current Reality” to the implementation.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts .opencode/skill/system-spec-kit/feature_catalog/17--governance .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
---
name: sk-code--review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code--review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code--review` and paired with one `sk-code--*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
 succeeded in 53ms:
---
name: sk-doc
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts and install guides."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.2.0
---

<!-- Keywords: sk-doc, markdown-quality, skill-creation, document-validation, ascii-flowchart, llms-txt, content-optimization, extract-structure -->

# Documentation Creation Specialist - Unified Markdown & Component Management

Unified specialist providing: (1) Document quality pipeline with structure enforcement and content optimization, (2) OpenCode component creation (skills, agents, commands) with scaffolding, validation and packaging, (3) ASCII flowchart creation for visualizing workflows and (4) Install guide creation for setup documentation.

**Core Principle**: Structure first, then content, then quality.

**Architecture**: Scripts handle deterministic parsing/metrics. AI handles quality judgment and recommendations.


## 1. WHEN TO USE

 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md
.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md
.opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md
.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/07-7-ci-and-build-informational.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/03-implemented-auto-entity-extraction.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/01-int8-quantization-evaluation.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/05-implemented-cross-document-entity-linking.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/02-memory-health-autorepair-metadata.md
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/04-schema-and-type-contract-synchronization.md
codex
Plan in motion:

1. Inventory all 44 feature files and extract their `Current Reality` text plus `Source Files` tables.
2. Verify every documented path on disk and capture invalid references, including the known `retry.vitest.ts` / `check-architecture-boundaries.ts` cases if they still appear.
3. Read the leading implementation files for each feature and compare the description to real behavior.
4. Flag meaningful capabilities the docs omit, then assemble the per-feature audit blocks in the exact format you asked for.

I’m using `sk-code--review` for findings-first auditing and `sk-doc` to evaluate the markdown/source-table structure. I’m skipping `mcp-code-mode` because this audit doesn’t require external MCP integrations.
Plan update
Auditing 44 feature catalog files against source code with findings-first review and markdown/source-table verification.
  → Inventory assigned feature markdown files and extract source-path references
  • Verify documented source/test paths exist on disk
  • Inspect implementation files and compare Current Reality against code behavior
  • Compile structured audit results for all 44 features
codex
I’ve got the catalog inventory. Next I’m sampling the feature markdown structure so I can parse the source tables consistently before comparing descriptions to code.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Shared post-mutation hook wiring

## Current Reality

Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete, and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Tool Cache |
 succeeded in 52ms:
# Dual-scope memory auto-surface

## Current Reality

Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).

Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
 succeeded in 51ms:
Total output lines: 83

# 1. Search Pipeline Features (SPECKIT_*)

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_ABLATION` | `false` | boolean | `lib/eval/eval-metrics.ts` | Activates the ablation study framework. Must be explicitly set to `'true'` to run controlled channel ablations via MCP; when `false`, the handler rejects `eval_run_ablation` calls with a disabled-flag error. |
| `SPECKIT_ARCHIVAL` | `true` | boolean | `lib/cognitive/archival-manager.ts` | Enables the archival manager which promotes DORMANT memories to the ARCHIVED state based on access patterns. Disable to keep all memories in active tiers. |
| `SPECKIT_AUTO_ENTITIES` | `true` | boolean | `lib/search/search-flags.ts` | Enables R10 automatic noun-phrase entity extraction at index time. Extracted entities feed the entity linking channel (S5). Requires `SPECKIT_ENTITY_LINKING` to create graph edges. |
| `SPECKIT_AUTO_RESUME` | `true` | boolean | `handlers/memory-context.ts` | In resume mode, automatically injects working-memory context items as `systemPromptContext` into the response. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | `lib/search/causal-boost.ts` | Enables causal-neighbor graph boosting. Top seed results (up to 25% of result set, capped at 5) walk the causal edge graph up to 2 hops, applying a per-hop boost capped at 0.05. Combined causal + session boost ceiling is 0.20. |
| `SPECKIT_CHANNEL_MIN_REP` | `true` | boolean | `lib/search/channel-representation.ts` | Sprint 3 Stage C: ensures every contributing search channel has at least one result in the top-k window. Results with a score below 0.005 are excluded from promotion regardless. |
| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Applies intent-classification-based decay scoring to composite scores. When disabled, classification signals do not reduce scores for mismatched intent types. |
| `SPECKIT_COACTIVATION` | `true` | boolean | `lib/cognitive/co-activation.ts` | Enables co-activation spreading in the hybrid search path and trigger-matcher cognitive pipeline. Top-5 results spread activation through the co-occurrence graph; related memories receive a boost scaled by `SPECKIT_COACTIVATION_STRENGTH`. |
| `SPECKIT_COACTIVATION_STRENGTH` | `0.25` | number | `lib/cognitive/co-activation.ts` | Configures the raw boost multiplier applied to co-activated memories in hot-path Stage 2 spreading. A separate fan-divisor helper exists in the co-activation module, but Stage 2 currently applies spread scores directly. |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | `'i'` | string | `configs/cognitive.ts` | Regex flags for the cognitive co-activation pattern matcher. Must match `/^[dgimsuvy]*$/`. Invalid flags cause a startup validation error. |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | `'\\b(memory\|context\|decision\|implementation\|bug)\\b'` | string | `configs/cognitive.ts` | Regex pattern used by the cognitive pipeline to detect co-activation-relevant content. Backreferences and nested quantifier groups are rejected for safety. Maximum length 256 characters. |
| `SPECKIT_COMMUNITY_DETECTION` | `true` | boolean | `lib/search/search-flags.ts` | Enables N2c BFS connected-component detection with Louvain escalation for large graphs. Injects community co-members alongside Stage 2 fusion results. |
codex
The markdown shape is consistent: most features have `Implementation` and `Tests` tables, while the feature-flag reference uses inline source-file columns instead. I’m switching to a scripted extraction pass now so we can verify all referenced paths cleanly and then spend the manual reading time on the actual behavior comparisons.
codex
The sandbox won’t allow here-doc temp files, so I’m reworking the extraction into a pure command-line script. Same audit path, just a different execution shape so we can keep going in read-only mode.
exec
/bin/zsh -lc "python3 -c 'import os,re,json; root=\".opencode/skill/system-spec-kit\"; base=f\"{root}/feature_catalog\"; cats=[\"15--retrieval-enhancements\",\"16--tooling-and-scripts\",\"17--governance\",\"18--ux-hooks\",\"19--decisions-and-deferrals\",\"20--feature-flag-reference\"];

def sec(text, header):
    i=text.find(header)
    if i<0:return \"\"
    rest=text[i+len(header):]
    m=re.search(r\"\\n## \",rest)
    return (rest[:m.start()] if m else rest).strip()

def between(text,start,pattern):
    i=text.find(start)
    if i<0:return \"\"
    rest=text[i+len(start):]
    m=re.search(pattern,rest)
    return (rest[:m.start()] if m else rest).strip()

def table_paths(s):
    return re.findall(r\""'^'"\\|\\s*"'`([''^`]+)`'"\\s*\\|\", s, re.M)

out=[]
for cat in cats:
    d=os.path.join(base,cat)
    for file in sorted(f for f in os.listdir(d) if f.endswith(\".md\")):
        full=os.path.join(d,file)
        text=open(full).read()
        current=' '.join([ln.strip() for ln in sec(text,'## Current Reality').splitlines() if ln.strip()])
        impl=table_paths(between(text,'### Implementation',r'\\n### Tests|\\n## Source Metadata'))
        tests=table_paths(between(text,'### Tests',r'\\n## Source Metadata'))
        inline=[]
        if not impl and not tests:
            inline=sorted(set(re.findall(r\"\\|\\s*"'`[''^`]+`'"\\s*\\|\\s*"'`[''^`]+`'"\\s*\\|\\s*["'^|]+'"\\|\\s*"'`([''^`]+)`'"\\s*\\|\", text)))
        allp=impl+tests+inline
        invalid=[p for p in allp if not os.path.isfile(os.path.join(root,p))]
        out.append({\"category\":cat,\"file\":file,\"currentReality\":current,\"implCount\":len(impl),\"testCount\":len(tests),\"inlineCount\":len(inline),\"invalid\":invalid,\"firstImpl\":impl[:3],\"firstInline\":inline[:10]})
print(json.dumps(out,indent=2))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 127 in 606ms:
  File "<string>", line 26
    current=
            ^
SyntaxError: invalid syntax
codex
I found a cleaner way around the shell restriction: zsh’s `$'...'` quoting lets me run multiline analysis scripts without temp files. I’m using that now to extract path references and invalid entries across the full batch.
exec
/bin/zsh -lc 'python3 -c $'"'import os\\nprint(\"ok\")'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 659ms:
ok
exec
/bin/zsh -lc 'python3 -c $'"'import os,re,json\\nroot=\".opencode/skill/system-spec-kit\"\\nbase=f\"{root}/feature_catalog\"\\ncats=[\"15--retrieval-enhancements\",\"16--tooling-and-scripts\",\"17--governance\",\"18--ux-hooks\",\"19--decisions-and-deferrals\",\"20--feature-flag-reference\"]\\n\\ndef sec(text, header):\\n    i=text.find(header)\\n    if i<0:return \"\"\\n    rest=text[i+len(header):]\\n    m=re.search(r\"\\\\n## \",rest)\\n    return (rest[:m.start()] if m else rest).strip()\\n\\ndef between(text,start,pattern):\\n    i=text.find(start)\\n    if i<0:return \"\"\\n    rest=text[i+len(start):]\\n    m=re.search(pattern,rest)\\n    return (rest[:m.start()] if m else rest).strip()\\n\\ndef table_paths(s):\\n    return re.findall(r\""'^'"\\\\|\\\\s*"'`([''^`]+)`'"\\\\s*\\\\|\", s, re.M)\\n\\nout=[]\\nfor cat in cats:\\n    d=os.path.join(base,cat)\\n    for file in sorted(f for f in os.listdir(d) if f.endswith(\".md\")):\\n        full=os.path.join(d,file)\\n        text=open(full).read()\\n        current=\" \".join([ln.strip() for ln in sec(text,\"## Current Reality\").splitlines() if ln.strip()])\\n        impl=table_paths(between(text,\"### Implementation\",r\"\\\\n### Tests|\\\\n## Source Metadata\"))\\n        tests=table_paths(between(text,\"### Tests\",r\"\\\\n## Source Metadata\"))\\n        inline=[]\\n        if not impl and not tests:\\n            inline=sorted(set(re.findall(r\"\\\\|\\\\s*"'`[''^`]+`'"\\\\s*\\\\|\\\\s*"'`[''^`]+`'"\\\\s*\\\\|\\\\s*["'^|]+'"\\\\|\\\\s*"'`([''^`]+)`'"\\\\s*\\\\|\", text)))\\n        allp=impl+tests+inline\\n        invalid=[p for p in allp if not os.path.isfile(os.path.join(root,p))]\\n        out.append({\"category\":cat,\"file\":file,\"implCount\":len(impl),\"testCount\":len(tests),\"inlineCount\":len(inline),\"invalid\":invalid,\"firstImpl\":impl[:3],\"firstTests\":tests[:3],\"firstInline\":inline[:10]})\\nprint(json.dumps(out,indent=2))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 617ms:
[
  {
    "category": "15--retrieval-enhancements",
    "file": "01-dual-scope-memory-auto-surface.md",
    "implCount": 34,
    "testCount": 25,
    "inlineCount": 0,
    "invalid": [
      "mcp_server/tests/retry.vitest.ts"
    ],
    "firstImpl": [
      "mcp_server/configs/cognitive.ts",
      "mcp_server/core/config.ts",
      "mcp_server/hooks/memory-surface.ts"
    ],
    "firstTests": [
      "mcp_server/tests/bm25-index.vitest.ts",
      "mcp_server/tests/cognitive-gaps.vitest.ts",
      "mcp_server/tests/config-cognitive.vitest.ts"
    ],
codex
The first full path pass is done. I’ve confirmed the recurring invalid references quickly: `mcp_server/tests/retry.vitest.ts` is still listed in several features, `check-architecture-boundaries.ts` is still listed in the architecture feature, and the category 20 flag docs are still using unprefixed paths like `lib/...` instead of `mcp_server/lib/...`. Now I’m comparing the descriptions themselves to the actual modules.
exec
/bin/zsh -lc 'python3 -c $'"'import os,re\\nroot=\".opencode/skill/system-spec-kit/feature_catalog\"\\ncats=[\"15--retrieval-enhancements\",\"16--tooling-and-scripts\",\"17--governance\",\"18--ux-hooks\",\"19--decisions-and-deferrals\",\"20--feature-flag-reference\"]\\n\\ndef sec(text, header):\\n    i=text.find(header)\\n    if i<0:return \"\"\\n    rest=text[i+len(header):]\\n    m=re.search(r\"\\\\n## \",rest)\\n    return (rest[:m.start()] if m else rest).strip()\\n\\nfor cat in cats:\\n    for file in sorted(f for f in os.listdir(os.path.join(root,cat)) if f.endswith(\".md\")):\\n        text=open(os.path.join(root,cat,file)).read()\\n        current=\" \".join([ln.strip() for ln in sec(text,\"## Current Reality\").splitlines() if ln.strip()])\\n        print(f\"{cat}\\t{file}\\t{current}\")'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 652ms:
15--retrieval-enhancements	01-dual-scope-memory-auto-surface.md	Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected). Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.
15--retrieval-enhancements	02-constitutional-memory-as-expert-knowledge-injection.md	Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality." Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.
15--retrieval-enhancements	03-spec-folder-hierarchy-as-retrieval-structure.md	Spec folder paths from memory metadata are parsed into an in-memory hierarchy tree. The `buildHierarchyTree()` function performs two-pass construction: the first pass creates nodes from all distinct `spec_folder` values including implicit intermediate parents, the second pass links children to parents via path splitting. The `queryHierarchyMemories()` function returns parent, sibling and ancestor memories with relevance scoring: self receives 1.0, parent 0.8, grandparent 0.6, sibling 0.5, with a floor of 0.3. The graph search function traverses this tree so that related folders surface as contextual results alongside direct matches, making spec folder organization a direct retrieval signal rather than metadata that only serves filtering. Always active with no feature flag. **Sprint 8 update:** A WeakMap TTL cache (60s, keyed by database instance) was added to `buildHierarchyTree()` to avoid full-scan reconstruction on every search request. An `invalidateHierarchyCache()` export allows explicit cache clearing when hierarchy data changes.
15--retrieval-enhancements	04-lightweight-consolidation.md	Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) plus heuristic fallback (word overlap). Both use a `hasNegationConflict()` keyword asymmetry check against approximately 20 negation terms (not, never, deprecated, replaced, and others). The system surfaces full contradiction clusters rather than isolated pairs via 1-hop causal edge neighbor expansion. Hebbian edge strengthening reinforces recently accessed edges at +0.05 per cycle with a 30-day decay of 0.1, respecting the auto-edge strength cap. Staleness detection flags edges unfetched for 90 or more days without deleting them. Edge bounds enforcement reports current edge counts versus the 20-edge-per-node maximum. All weight modifications are logged to the `weight_history` table. The cycle fires after every successful `memory_save` when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).
15--retrieval-enhancements	05-memory-summary-search-channel.md	Large memory files bury their key information in paragraphs of context. A 2,000-word implementation summary might contain three sentences that actually answer a retrieval query. Searching against the full content dilutes embedding similarity with irrelevant noise. R8 generates extractive summaries at save time using a pure-TypeScript TF-IDF implementation with zero dependencies. The `computeTfIdf()` function scores each sentence by term frequency times inverse document frequency across all sentences in the document, normalized to [0,1]. The `extractKeySentences()` function selects the top-3 scoring sentences and returns them in original document order rather than score order, preserving narrative coherence. Generated summaries are stored in the `memory_summaries` table alongside a summary-specific embedding vector computed by the same embedding function used for full content. The `querySummaryEmbeddings()` function performs cosine similarity search against these summary embeddings, returning results as `PipelineRow` objects compatible with the main pipeline. **Sprint 8 update:** A `LIMIT` clause was added to the unbounded summary query in `memory-summaries.ts` (capped at `Math.max(limit * 10, 1000)`) to prevent full-table scans on large corpora. Summary candidates in Stage 1 now also pass through the same `minQualityScore` filter applied to other candidates. The summary channel runs as a parallel search channel in Stage 1 of the 4-stage pipeline, alongside hybrid, vector and multi-concept channels. It follows the R12 embedding expansion pattern: execute in parallel, merge results and deduplicate by memory ID with baseline results taking priority. This is deliberately a parallel channel rather than a pre-filter to avoid recall loss. A runtime scale gate activates the channel only when the system exceeds 5,000 indexed memories with successful embeddings. Below that threshold, the summary channel adds overhead without measurable benefit because the base channels already cover the corpus effectively. The code exists regardless of scale; the gate simply skips execution. Runs behind the `SPECKIT_MEMORY_SUMMARIES` flag (default ON).
15--retrieval-enhancements	06-cross-document-entity-linking.md	Memories in different spec folders often discuss the same concepts without any explicit connection between them. A decision record in one folder mentions "embedding cache" and an implementation summary in another folder implements it, but the retrieval system has no way to connect them unless a causal edge exists. Cross-document entity linking bridges this gap using the entity catalog populated by R10. The `buildEntityCatalog()` function groups entities from the `memory_entities` table by canonical name. The `findCrossDocumentMatches()` function identifies entities appearing in two or more distinct spec folders, which represent genuine cross-document relationships. For each cross-document match, `createEntityLinks()` inserts causal edges with `relation='supports'`, `strength=0.7` and `created_by='entity_linker'`. The `supports` relation was chosen over adding a new relation type to avoid ALTER TABLE complexity on the SQLite `causal_edges` CHECK constraint. Entity-derived links are genuinely supportive relationships: if two documents reference the same entity, they support each other's context. An infrastructure gate checks that the `entity_catalog` has entries before running. Without R10 providing extracted entities, S5 has nothing to operate on. The `runEntityLinking()` orchestrator chains catalog build, match finding and edge creation with statistics reporting. **Sprint 8 update:** Two performance improvements were applied to `entity-linker.ts`: (1) a parallel `Set` was added for `catalogSets` providing O(1) `.has()` lookups instead of O(n) `.includes()` in inner loops, and (2) a `batchGetEdgeCounts()` function replaced N+1 individual `getEdgeCount` queries with a single batch query. A density guard prevents runaway edge creation: current global edge density is computed as `total_edges / total_memories` and checked before link generation begins. The linker also checks projected post-insert global density before creating links. If either check exceeds the configured threshold, new entity links are skipped to avoid overwhelming the graph. The threshold is controlled by `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`), and invalid or negative values fall back to `1.0`. Runs behind the `SPECKIT_ENTITY_LINKING` flag (default ON). Depends on a populated `entity_catalog` (typically produced by R10 auto-entities). ---
15--retrieval-enhancements	07-tier-2-fallback-channel-forcing.md	A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior. ---
15--retrieval-enhancements	08-provenance-rich-response-envelopes.md	**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState), and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).
15--retrieval-enhancements	09-contextual-tree-injection.md	**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.
16--tooling-and-scripts	01-tree-thinning-for-spec-folder-consolidation.md	A bottom-up merge strategy thins small files during spec folder context loading. Files under 200 tokens have their summary merged into the parent document. Files under 500 tokens use their content directly as the summary, skipping separate summary generation. Memory file thresholds differ: under 100 tokens for content-as-summary, 100-300 tokens for merged-into-parent, 300+ tokens kept as-is. The `applyTreeThinning()` function runs in `workflow.ts` at Step 7.6 before pipeline stages and is applied to the rendered context payload. Stats track total files, thinned count, merged count and tokens saved.
16--tooling-and-scripts	02-architecture-boundary-enforcement.md	Two architecture rules in `ARCHITECTURE.md` were previously documentation-only with no automated enforcement: (1) `shared/` must not import from `mcp_server/` or `scripts/`, and (2) `mcp_server/scripts/` must contain only thin compatibility wrappers delegating to canonical `scripts/dist/` implementations. `check-architecture-boundaries.ts` enforces both rules as part of `npm run check`. GAP A walks all `.ts` files in `shared/`, extracts module specifiers (skipping block and line comments), and flags any import matching relative paths to `mcp_server/` or `scripts/` at any depth, or package-form `@spec-kit/mcp-server/` or `@spec-kit/scripts/`. This is an absolute prohibition with no allowlist. GAP B scans top-level `.ts` files in `mcp_server/scripts/` (non-recursive) and verifies each passes three conditions: at most 50 substantive lines (non-blank, non-comment), contains a `child_process` import, and references `scripts/dist/` somewhere in its content. Failure on any condition flags the file as not a valid wrapper.
16--tooling-and-scripts	03-progressive-validation-for-spec-documents.md	The `progressive-validate.sh` script wraps `validate.sh` with four progressive levels. Level 1 (Detect) identifies all violations. Level 2 (Auto-fix) applies safe mechanical corrections like missing dates, heading levels and whitespace with before/after diff logging. Level 3 (Suggest) presents non-automatable issues with guided remediation options. Level 4 (Report) produces structured output in JSON or human-readable format. Flags include `--level N`, `--dry-run`, `--json`, `--strict`, `--quiet` and `--verbose`. Exit codes maintain compatibility with `validate.sh`: 0 for pass, 1 for warnings, 2 for errors. The dry-run mode previews all changes before applying them. ---
16--tooling-and-scripts	04-dead-code-removal.md	Approximately 360 lines of dead code were removed across four categories: **Hot-path dead branches:** Dead RSF branch and dead shadow-scoring branch removed from `hybrid-search.ts`. Both were guarded by feature flag functions that always returned `false`. **Dead feature flag functions:** `isShadowScoringEnabled()` removed from `shadow-scoring.ts` and `search-flags.ts`. `isRsfEnabled()` removed from `rsf-fusion.ts`. `isInShadowPeriod()` in `learned-feedback.ts` remains active as the R11 shadow-period safeguard and was not removed. **Dead module-level state:** `stmtCache` Map (archival-manager.ts — never populated), `lastComputedAt` (community-detection.ts — set but never read), `activeProvider` cache (cross-encoder.ts — never populated), `flushCount` (access-tracker.ts — never incremented), 3 dead config fields in working-memory.ts (`decayInterval`, `attentionDecayRate`, `minAttentionScore`). **Dead functions and exports:** `computeCausalDepth` single-node variant (graph-signals.ts — batch version is the only caller), `getSubgraphWeights` (graph-search-fn.ts — always returned 1.0, replaced with inline constant), `RECOVERY_HALF_LIFE_DAYS` (negative-feedback.ts — never imported), `'related'` weight entry (causal-edges.ts — invalid relation type), `logCoActivationEvent` and `CoActivationEvent` (co-activation.ts — never called). **Preserved (NOT dead):** `computeStructuralFreshness` and `computeGraphCentrality` in `fsrs.ts` were identified as planned architectural components (not concluded experiments) and retained.
16--tooling-and-scripts	05-code-standards-alignment.md	All modified files were reviewed against sk-code--opencode standards. 45 violations found and fixed: 26 AI-intent comment conversions (AI-WHY, AI-TRACE, AI-GUARD prefixes), 10 MODULE/COMPONENT headers added, import ordering corrections, and constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`). ---
16--tooling-and-scripts	06-real-time-filesystem-watching-with-chokidar.md	**IMPLEMENTED (Sprint 019).** Adds `chokidar`-based push indexing in `lib/ops/file-watcher.ts` with 2-second debounce, TM-02 SHA-256 content-hash deduplication, and exponential backoff retries for `SQLITE_BUSY` (1s/2s/4s, 3 attempts). Exports `getWatcherMetrics()` with `filesReindexed` and `avgReindexTimeMs` counters, plus per-reindex timing logs to stderr (CHK-087). Gated by `SPECKIT_FILE_WATCHER` (default `false`).
16--tooling-and-scripts	07-standalone-admin-cli.md	Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint; constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.
16--tooling-and-scripts	08-watcher-delete-rename-cleanup.md	The chokidar-based file watcher (`lib/ops/file-watcher.ts`) handles more than just add/change events. When a watched memory file is deleted or renamed, the watcher receives an `unlink` event and invokes the configured `removeFn` callback to purge the corresponding memory index entry, BM25 tokens, and vector embedding from the database. This prevents orphaned index entries from appearing in search results after a file is moved or removed on disk. Rename detection is handled as an unlink followed by an add, which means the memory gets a fresh index entry at the new path while the old entry is cleaned up. The 2-second debounce window collapses rapid rename sequences into a single reindex cycle.
17--governance	01-feature-flag-governance.md	The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled. A governance framework defines operational targets (small active flag surface, explicit sunset windows and periodic audits). These are process controls, not hard runtime-enforced caps in code. The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.
17--governance	02-feature-flag-sunset-audit.md	A comprehensive audit at Sprint 7 exit found 61 unique `SPECKIT_` flags across the codebase. Disposition: 27 flags are ready to graduate to permanent-ON defaults (removing the flag check), 9 flags are identified as dead code for removal and 3 flags remain as active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`). The current active flag-helper inventory in `search-flags.ts` is 23 exported `is*` functions (including the deprecated `isPipelineV2Enabled()` compatibility shim). Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON, and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool. **Phase 017 update:** `SPECKIT_PIPELINE_V2` is now deprecated. `isPipelineV2Enabled()` always returns `true` regardless of the env var. The legacy V1 pipeline code was removed, making the env var a no-op. **Sprint 8 update:** Flag graduation and dead code removal have been completed. The Sprint 8 comprehensive remediation removed a large dead-code slice including: dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`), and dead functions/exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8) for the full accounting. ---
18--ux-hooks	01-shared-post-mutation-hook-wiring.md	Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete, and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "autoSurfaceMemories|autoSurfaceAtCompaction|memory-aware|skip|token budget|4000|constitutional" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts .opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts .opencode/skill/system-spec-kit/mcp_server/core/config.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:47:  autoSurfaceMemories,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:49:  autoSurfaceAtCompaction,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:128:interface AutoSurfaceResult { constitutional: unknown[]; triggered: unknown[]; }
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:290:            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:292:            autoSurfacedContext = await autoSurfaceMemories(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:335:    // T205: Enforce per-layer token budgets with actual truncation
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:373:                envelope.hints.push(`Token budget enforced: truncated ${originalCount} → ${innerResults.length} results to fit ${budget} token budget`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:381:                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:388:        // Non-JSON response, skip token budget injection
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:427:    // Also scan constitutional directories (.opencode/skill/*/constitutional/)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:434:            const constDir = path.join(skillDir, entry.name, 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:442:      // Non-fatal: constitutional directory discovery failed
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:476:    console.error('[context-server] Startup scan already in progress, skipping');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:486:      console.error('[context-server] Startup scan skipped: embedding model not ready');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:734:    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:777:    // T016-T019: Lazy loading - skip warmup, model loads on first use
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:27:  constitutional: ConstitutionalMemory[];
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:52:const TOOL_DISPATCH_TOKEN_BUDGET = 4000;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:53:const COMPACTION_TOKEN_BUDGET = 4000;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:58:let constitutionalCache: ConstitutionalMemory[] | null = null;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Retrieval Directives
// ---------------------------------------------------------------
// PI-A4: Constitutional memory as retrieval directives (Sprint 5, deferred from Sprint 4 REC-07)
//
// Adds a `retrieval_directive` metadata field to constitutional-tier memories.
// Directives are formatted as explicit instruction prefixes ("Always surface when:",
// "Prioritize when:") so LLMs receive actionable retrieval guidance alongside the
// memory content.
//
// Design contract:
//   - Pure content transformation only — scoring logic is NOT touched.
//   - extractRetrievalDirective is deterministic and synchronous.
//   - enrichWithRetrievalDirectives is a map over results; it never filters or reorders.

import * as fs from 'fs';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "WeakMap|TTL|invalidateHierarchyCache|queryHierarchyMemories|score|ancestor|sibling|parent" .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts .opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Spec Folder Hierarchy
// ---------------------------------------------------------------
// Builds a spec folder hierarchy from stored spec_folder paths
// and enables hierarchy-aware retrieval (REQ-S6-006).
//
// Parses folder paths like "02--system-spec-kit/140-hybrid-rag/006-sprint-5"
// into a tree structure where each path segment is a node, allowing child
// folders to discover and retrieve memories from parent/sibling folders.

import type Database from 'better-sqlite3';

// --- 0. HIERARCHY TREE CACHE ---
//
// buildHierarchyTree does a full scan of spec_folder values on every call.
// The hierarchy changes only when new spec folders are created, so we cache
// the result with a TTL. A single cached value per database instance is
// sufficient — no full LRU library needed.

const HIERARCHY_CACHE_TTL_MS = 60_000; // 60 seconds
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:9:// folders to discover and retrieve memories from parent/sibling folders.
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:17:// the result with a TTL. A single cached value per database instance is
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:20:const HIERARCHY_CACHE_TTL_MS = 60_000; // 60 seconds
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:29:const hierarchyCache = new WeakMap<Database.Database, HierarchyCacheEntry>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:36:export function invalidateHierarchyCache(database: Database.Database): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:48:  parent: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:69:  // Return cached result if still within TTL
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:85:  // First pass: create all nodes (including implicit parent nodes)
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:91:  // Second pass: link parents and identify roots
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:93:    const parentPath = getParentPath(path);
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:94:    if (parentPath && nodeMap.has(parentPath)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:95:      node.parent = parentPath;
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:96:      const parentNode = nodeMap.get(parentPath);
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:97:      if (parentNode && !parentNode.children.some(c => c.path === path)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:98:        parentNode.children.push(node);
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:101:      // This is a root node (or orphan — parent not in DB)
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:110:  // Store in cache with TTL
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:111:  hierarchyCache.set(database, { tree, expiresAt: Date.now() + HIERARCHY_CACHE_TTL_MS });
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:132:    parent: null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:137:  // AI-GUARD: Ensure parent chain exists (with 0 memoryCount for implicit parents)
 succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: Channel Enforcement
// ---------------------------------------------------------------
// Pipeline-ready wrapper around the channel min-representation check.
// Provides a single enforceChannelRepresentation() entry point for
// use inside the hybrid-search pipeline after RRF/RSF fusion.
//
// Feature flag: SPECKIT_CHANNEL_MIN_REP (default: disabled)
// Delegates core logic to channel-representation.ts.
// ---------------------------------------------------------------

import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
} from './channel-representation';

/* ---------------------------------------------------------------
   1. INTERFACES
   --------------------------------------------------------------- */

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_CONSOLIDATION|consolidation|contradiction|Hebbian|stale|weight_history|after every successful memory_save|weekly|0.85|0.05|90|20" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/cognitive .opencode/skill/system-spec-kit/mcp_server/tests | head -n 240' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Vector Index Mutations
// ---------------------------------------------------------------
// Split from vector-index-store.ts — contains ALL mutation functions:
// index, update, delete, and status/confidence updates.

import { getCanonicalPathKey } from '../utils/canonical-path';
import { createLogger } from '../utils/logger';
import * as embeddingsProvider from '../providers/embeddings';
import {
  to_embedding_buffer,
  get_error_message,
} from './vector-index-types';
import {
  initialize_db,
  get_embedding_dim,
  init_prepared_statements,
  clear_constitutional_cache,
  refresh_interference_scores_for_folder,
  sqlite_vec_available as get_sqlite_vec_available,
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Memory Summaries
// ---------------------------------------------------------------
// Gated via SPECKIT_MEMORY_SUMMARIES

import type Database from 'better-sqlite3';
import { generateSummary } from './tfidf-summarizer';
import { isMemorySummariesEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------------

interface SummarySearchResult {
  id: number;
  memoryId: number;
  similarity: number;
}

// ---------------------------------------------------------------------------
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:6:// only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:10:// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:31:const EVENT_DECAY_FACTOR = 0.85;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:32:const MENTION_BOOST_FACTOR = 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:33:const DECAY_FLOOR = 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:265:  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:473: *   - decayFloor (0.05): scores are clamped here, never decay below this
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:157: * AI-WHY: Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:172:const DEFAULT_LIMIT = 20;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:960:      const adjustedBudget = Math.max(budgetResult.budget - headerOverhead, 200);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1137:      score: Math.max(0, 1.0 - index * 0.05),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1206:// M5 fix: Return stale cache immediately and refresh asynchronously to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1249:          // AI-GUARD: Non-fatal: stale cache remains usable
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1258:  // Cold start — synchronous build required (no stale data to return)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1491:const DEFAULT_TOKEN_BUDGET = 2000;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1545: * falling back to DEFAULT_TOKEN_BUDGET (2000).
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1579: * @param budget - Optional token budget override (defaults to SPECKIT_TOKEN_BUDGET env / 2000).
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:154:    const high = calculateCompositeScore({ ...base, similarity: 90 });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:232:      { id: 1, similarity: 20, updated_at: daysAgo(30), lastReview: daysAgo(30), stability: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:233:      { id: 2, similarity: 90, updated_at: now, lastReview: now, stability: 10.0 },
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "isConsolidationEnabled|SPECKIT_CONSOLIDATION|consolidat|Hebbian|stale edges|edge bounds|weight_history|negation conflict|hasNegationConflict|weekly batch|prediction-error-gate|reinforce|stale" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Prediction Error Gate
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const THRESHOLD = {
  DUPLICATE: 0.95,
  HIGH_MATCH: 0.85,
  MEDIUM_MATCH: 0.70,
  LOW_MATCH: 0.50,
} as const;

const ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
 succeeded in 51ms:
Total output lines: 523

.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:9:import * as predictionErrorGate from '../lib/cache/cognitive/prediction-error-gate.js';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:75:    it('T515: Just below threshold (0.94) does NOT reinforce', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:231:    it('reinforceExistingMemory function exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:17://   reinforceExistingMemory, markMemorySuperseded,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:111:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:411:     SUITE: reinforceExistingMemory
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:414:  describe('reinforceExistingMemory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:415:    const reinforceFn = typeof handler.reinforceExistingMemory === 'function'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:416:      ? handler.reinforceExistingMemory
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:419:    const canRun = reinforceFn && hasGetDb;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:443:      const result = reinforceFn!(99999, parsed);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:466:      const result = reinforceFn!(row.id, parsed);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:471:        expect(result.status).toBe('reinforced');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:478:    it.skipIf(!canRun || !hasModuleDb)('returns error when reinforcement update affects zero rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:485:      const triggerName = `skip_reinforce_${Date.now()}`;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:507:        const result = reinforceFn!(row.id, parsed);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:526:      const result = reinforceFn!(88888, parsed);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:13:type PredictionErrorGateModule = typeof import('../lib/cache/cognitive/prediction-error-gate');
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,560p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,340p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
// ---------------------------------------------------------------
// MODULE: N3-lite Consolidation Engine
// ---------------------------------------------------------------
// Lightweight graph maintenance: contradiction scan, Hebbian
// strengthening, staleness detection, edge bounds enforcement.
// Sprint 6a — behind SPECKIT_CONSOLIDATION flag.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isConsolidationEnabled } from '../search/search-flags';
import {
  updateEdge,
  getStaleEdges,
  countEdgesForNode,
  MAX_EDGES_PER_NODE,
  MAX_AUTO_STRENGTH,
  MAX_STRENGTH_INCREASE_PER_CYCLE,
  STALENESS_THRESHOLD_DAYS,
  DECAY_STRENGTH_AMOUNT,
  DECAY_PERIOD_DAYS,
 succeeded in 53ms:
----------------------------------------------------------------*/

/**
 * Surface all members of a contradiction cluster.
 * When a contradiction pair is detected, find ALL related memories
 * (via causal edges) to surface the full context for resolution.
 */
export function buildContradictionClusters(
  database: Database.Database,
  pairs: ContradictionPair[],
): ContradictionCluster[] {
  const clusters: ContradictionCluster[] = [];

  for (const pair of pairs) {
    const memberIds = new Set<number>([pair.memoryA.id, pair.memoryB.id]);

    // Expand cluster via causal edges (1-hop neighbors)
    for (const seedId of [pair.memoryA.id, pair.memoryB.id]) {
      try {
        const neighbors = (database.prepare(`
 succeeded in 50ms:
  const hints: string[] = [];
  if (result.pe_action === 'REINFORCE') {
    hints.push('Existing memory was reinforced instead of creating duplicate');
  }
  if (result.pe_action === 'SUPERSEDE') {
    hints.push(`Previous memory #${result.superseded_id} marked as deprecated`);
  }
  if (result.warnings && result.warnings.length > 0) {
    hints.push('Review anchor warnings for better searchability');
  }
  if (result.embeddingStatus === 'pending') {
    hints.push('Memory will be fully indexed when embedding provider becomes available');
    if (asyncEmbedding) {
      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
    }
  }
  if (result.embeddingStatus === 'partial') {
    hints.push('Large file indexed via chunking: parent record + individual chunk records with embeddings');
  }
  if (result.causalLinks) {
exec
/bin/zsh -lc "sed -n '700,900p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "querySummaryEmbeddings|checkScaleGate|memory summaries|summary channel|minQualityScore|generateAndStoreSummary|keySentences|top-3|parallel channel" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts .opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
      const sourceMap = new Map<string, Set<string>>();
      for (const list of lists) {
        for (const r of list.results) {
          const key = canonicalResultId(r.id);
          if (!sourceMap.has(key)) sourceMap.set(key, new Set());
          sourceMap.get(key)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
        }
      }
      for (const [, sources] of sourceMap) {
        if (sources.size > 1) graphMetrics.multiSourceResults++;
        if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
      }

      // C138: Use adaptive fusion to get intent-aware weights replacing hardcoded [1.0, 0.8, 0.6]
      const intent = options.intent || classifyIntent(query).intent;
      const adaptiveResult = hybridAdaptiveFuse(semanticResults, keywordResults, intent);
      const { semanticWeight, keywordWeight } = adaptiveResult.weights;

      // Apply adaptive weights to the fusion lists (update in place)
      const { graphWeight: adaptiveGraphWeight } = adaptiveResult.weights;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:97:export async function generateAndStoreSummary(
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:108:    const { summary, keySentences } = generateSummary(content);
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:116:    const keySentencesJson = JSON.stringify(keySentences);
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:130:      keySentencesJson,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:147: * Vector search on summary embeddings — parallel channel for stage1.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:160:export function querySummaryEmbeddings(
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:209:export function checkScaleGate(db: Database.Database): boolean {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:17:  generateAndStoreSummary,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:18:  querySummaryEmbeddings,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:19:  checkScaleGate,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:222:  it('returns top-3 sentences by default', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:259:    const normalSentence = 'This is a normal-length sentence about memory summaries and retrieval.';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:291:  it('returns summary and keySentences properties', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:301:    expect(result).toHaveProperty('keySentences');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:303:    expect(Array.isArray(result.keySentences)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:309:    expect(result.keySentences).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:323:    expect(result.keySentences.length).toBeLessThanOrEqual(3);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:324:    expect(result.keySentences.length).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:336:    if (result.keySentences.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:337:      const expectedSummary = result.keySentences.join(' ');
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Tfidf Summarizer
// ---------------------------------------------------------------
// Pure TypeScript, zero dependencies
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------------

interface ScoredSentence {
  text: string;
  score: number;
  index: number;
}

// ---------------------------------------------------------------------------
// 2. CONSTANTS
// ---------------------------------------------------------------------------

exec
/bin/zsh -lc 'rg -n "querySummaryEmbeddings|summary channel|summaryResults|checkScaleGate|SPECKIT_MEMORY_SUMMARIES|generateAndStoreSummary" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:16:import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:86:      const summaryResult = await generateAndStoreSummary(
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:154: * Default: TRUE (enabled). Set SPECKIT_MEMORY_SUMMARIES=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:157:  return isFeatureEnabled('SPECKIT_MEMORY_SUMMARIES');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:44:import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:509:  // When SPECKIT_MEMORY_SUMMARIES is enabled (default-ON) and scale gate is
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:      if (checkScaleGate(db)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:521:          const summaryResults = querySummaryEmbeddings(db, summaryEmbedding, limit);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:522:          if (summaryResults.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:526:            for (const sr of summaryResults) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:564:      console.warn(`[stage1-candidate-gen] R8 summary channel failed: ${r8Msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:4:// Gated via SPECKIT_MEMORY_SUMMARIES
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:97:export async function generateAndStoreSummary(
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:160:export function querySummaryEmbeddings(
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:209:export function checkScaleGate(db: Database.Database): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:378:| `SPECKIT_MEMORY_SUMMARIES`| `true`  | Enable memory summary generation and search channel (R8) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:534:**Purpose**: Generate TF-IDF extractive summaries of memory content and expose them as a search channel. Gated via `SPECKIT_MEMORY_SUMMARIES`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:558:| **Search Channel** | `querySummaryEmbeddings()` provides cosine similarity search over stored summaries |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:559:| **Scale Gate** | `checkScaleGate()` validates database is ready for summary operations |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:560:| **Pipeline** | `generateAndStoreSummary()` combines TF-IDF extraction with embedding and persistence |
exec
/bin/zsh -lc "sed -n '480,580p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
            limit: CONSTITUTIONAL_INJECT_LIMIT,
            specFolder,
            tier: 'constitutional',
            useDecay: false,
          }
        ) as PipelineRow[];

        // Only inject rows not already present
        const existingIds = new Set(candidates.map((r) => r.id));
        const uniqueConstitutional = constitutionalResults.filter(
          (r) => !existingIds.has(r.id)
        );

        candidates = [...candidates, ...uniqueConstitutional];
        constitutionalInjectedCount = uniqueConstitutional.length;
      }
    }
  } else if (!includeConstitutional) {
    // Explicitly exclude constitutional results if flag is off
    candidates = candidates.filter(
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Post Insert
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser';

import * as embeddings from '../../lib/providers/embeddings';
import { processCausalLinks } from '../causal-links-processor';
import {
  isAutoEntitiesEnabled,
  isMemorySummariesEnabled,
  isEntityLinkingEnabled,
} from '../../lib/search/search-flags';
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
import { runEntityLinking } from '../../lib/search/entity-linker';
import { toErrorMessage } from '../../utils';

interface CausalLinksResult {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Entity Linker
// ---------------------------------------------------------------
// Gated via SPECKIT_ENTITY_LINKING
// Creates causal edges between memories sharing entities across spec folders.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isEntityLinkingEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------------------------

/** Maximum causal edges per node to prevent graph density explosion. */
const MAX_EDGES_PER_NODE = 20;

/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
const DEFAULT_MAX_EDGE_DENSITY = 1.0;

exec
/bin/zsh -lc "sed -n '220,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
 * Returns 0 when there are no memories or when a DB error occurs.
 */
function getGlobalEdgeDensityStats(
  db: Database.Database,
): { totalEdges: number; totalMemories: number; density: number } {
  try {
    const edgeRow = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM causal_edges`,
    ) as Database.Statement).get() as { cnt: number };
    const totalEdges = edgeRow?.cnt ?? 0;

    const memoryRow = (db.prepare(
      `SELECT COUNT(*) AS cnt FROM memory_index`,
    ) as Database.Statement).get() as { cnt: number };
    const totalMemories = memoryRow?.cnt ?? 0;

    const density = totalMemories > 0 ? totalEdges / totalMemories : 0;
    return { totalEdges, totalMemories, density };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "forceAllChannels|tier-2|fallback|force all channels|all channels|quality fallback|legacy two-pass" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/tests/channel*.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Channel Representation
// ---------------------------------------------------------------
/* --- 1. CONSTANTS --- */

/** Minimum similarity / relevance score for a result to qualify for promotion.
 * AI-WHY: QUALITY_FLOOR changed from 0.2 to 0.005 (Sprint 10, D3). The original 0.2
 * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
 * threshold, causing channel-representation promotion to silently reject ALL RRF results.
 * The 0.005 floor prevents promoting genuinely irrelevant results while remaining
 * compatible with both raw RRF scores and normalized [0,1] scores. */
export const QUALITY_FLOOR = 0.005;

/** Env-var name for the feature flag. */
const FEATURE_FLAG = 'SPECKIT_CHANNEL_MIN_REP';

/* --- 2. INTERFACES --- */

/** A single item that may appear in a top-k result set. */
interface TopKItem {
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Test — Channel Enforcement
// ---------------------------------------------------------------
// Channel Enforcement + Precision Verification (T003b + T003c)
//
// Coverage:
//   T003b — Enforcement wrapper (enforceChannelRepresentation)
//     T1:  enforcement applies when flag enabled and a channel is missing
//     T2:  enforcement does not apply when flag is disabled
//     T3:  topK parameter limits the inspection window
//     T4:  promoted results are appended and metadata is correct
//     T5:  results remain sorted by score after enforcement
//
//   T003c — Precision verification (R2 guarantee)
//     T6:  all channels represented → top-3 unchanged (precision preserved)
//     T7:  one channel missing → top-3 still contains high-scoring items
//     T8:  promotions never displace items already in top-3 (appended)
//     T9:  quality floor prevents low-quality promotions
//     T10: multiple missing channels → each gets at most 1 promotion
//     T11: R15+R2 interaction — ≥2 channels from router preserves R2 guarantee
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:612:    // Disable complexity router so all channels (including graph) are active for short queries
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:675:  it('C138-P0-FB-T1: two-pass fallback tags results with fallbackRetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:676:    // Use a vector search that returns nothing to force fallback scenarios
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:688:  it('C138-P0-FB-T2: tier-2 fallback forces all channels for simple-routed queries', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:698:      return [{ id: 999, score: 0.6, content: 'graph fallback candidate' }];
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:713:      // force-enable all channels, including graph.
.opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts:73:  it('T1: all channels represented in topK — returns no promotions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:15://     T6:  all channels represented → top-3 unchanged (precision preserved)
.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:219:  it('T6: all channels represented — top-3 is identical before and after enforcement', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:234:    // No promotions expected — all channels already represented.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4:// AI-WHY: Combines vector, FTS, and BM25 search with fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:76:   * Internal fallback override: when true, bypass complexity routing and
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:79:  forceAllChannels?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:146:/** Record of a single degradation event during tiered fallback. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398: * Retained as internal fallback only.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:541:    // subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:544:    const activeChannels = options.forceAllChannels
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:692:    // Merge keyword results after all channels complete
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1026: * Search with automatic fallback chain.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1028: * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
exec
/bin/zsh -lc "sed -n '1380,1455p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    }
  }

  return Array.from(byId.values()).sort((a, b) => b.score - a.score);
}

/**
 * PI-A2: Quality-aware 3-tier search fallback chain.
 *
 * TIER 1: hybridSearchEnhanced at minSimilarity=0.3
 *   → Pass if quality signal is healthy AND count >= 3
 *
 * TIER 2: hybridSearchEnhanced at minSimilarity=0.1, all channels forced
 *   → Merge with Tier 1, dedup by id
 *   → Pass if quality signal is healthy AND count >= 3
 *
 * TIER 3: structuralSearch (pure SQL last-resort)
 *   → Merge with Tier 1+2 results after score calibration
 *   → Return capped set
 *
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
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
// ---------------------------------------------------------------
// MODULE: Envelope
// ---------------------------------------------------------------

import { estimateTokens } from '../../formatters/token-metrics';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

/**
 * Describes the ResponseMeta shape.
 */
export interface ResponseMeta {
  tool: string;
  tokenCount: number;
  tokenBudget?: number;
  latencyMs?: number;
  cacheHit: boolean;
  isError?: boolean;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Token Metrics Formatter
// FORMATTERS: TOKEN METRICS
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Tiered search result for token metric calculation */
export interface TieredResult {
  tier?: string;
  content?: string | null;
  [key: string]: unknown;
}

/** Token metrics breakdown */
export interface TokenMetrics {
  actualTokens: number;
  hotTokens: number;
exec
/bin/zsh -lc "sed -n '220,420p' .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '520,860p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "includeTrace|trace|channelsUsed|pipelineStages|fallbackTier|queryComplexity|expansionTerms|budgetTruncated|scoreResolution|createMCPSuccessResponse|envelope" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    data: {
      error: errorMessage,
      code,
      details
    },
    hints,
    startTime,
    extraMeta: {
      isError: true,
      severity: recovery?.severity || 'error'
    }
  });
}

// ---------------------------------------------------------------
// 4. MCP RESPONSE WRAPPER
// ---------------------------------------------------------------

/**
 * Provides the wrapForMCP helper.
 succeeded in 50ms:
      },
    };
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn('[memory-search] Failed to reassemble chunked results, falling back to file reads:', message);
    return {
      results: collapsed,
      stats: {
        collapsedChunkHits,
        chunkParents: parentIds.size,
        reassembled: 0,
        fallback: parentIds.size,
      },
    };
  }
}

/* ---------------------------------------------------------------
   3. CONFIGURATION
--------------------------------------------------------------- */
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:48:// Helper: Check if a response follows the MCP envelope format
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:148:        const envelope = validateMCPEnvelope(alt.result);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:149:        expect(envelope.hasContent).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:154:        // Non-DB error — envelope testing deferred
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:159:      const envelope = validateMCPEnvelope(result);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:160:      expect(envelope.hasContent).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:167:      const envelope = validateMCPEnvelope(result);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:168:      expect(envelope.hasTypeText).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:175:      const envelope = validateMCPEnvelope(result);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:176:      expect(envelope.hasTextString).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:183:      const envelope = validateMCPEnvelope(result);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:184:      expect(envelope.isValidJSON).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:191:      const envelope = validateMCPEnvelope(result);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:192:      if (envelope.parsedData) {
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:193:        const keys = Object.keys(envelope.parsedData);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:248:        const envelope = validateMCPEnvelope(result);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:250:        if (envelope.valid) {
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:251:          expect(envelope.valid).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:254:          const envelope2 = validateMCPEnvelope(result);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:255:          expect(envelope2.hasContent).toBe(true);
exec
/bin/zsh -lc "sed -n '860,980p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
        }

        _evalChannelPayloads = buildEvalChannelPayloads(
          pipelineResult.results as unknown as Array<Record<string, unknown>>
        );

        const appliedBoosts = {
          session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
          causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
        };
        extraData.appliedBoosts = appliedBoosts;
        extraData.applied_boosts = appliedBoosts;

        const formatted = await formatSearchResults(
          pipelineResult.results as unknown as RawSearchResult[],
          pipelineConfig.searchType,
          includeContent,
          anchors,
          null,
          null,
exec
/bin/zsh -lc "rg -n \"scores|source:|trace:|includeTrace|fallbackTier|queryComplexity|budgetTruncated|scoreResolution|pipelineStages|channelsUsed|expansionTerms\" .opencode/skill/system-spec-kit/mcp_server/formatters -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:99:  channelsUsed: string[];
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:100:  pipelineStages: string[];
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:101:  fallbackTier: number | null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:102:  queryComplexity: string | null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:103:  expansionTerms: string[];
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:104:  budgetTruncated: boolean;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:105:  scoreResolution: 'intentAdjusted' | 'fusion' | 'score' | 'semantic' | 'none';
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:109:  scores?: MemoryResultScores;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:172:function resolveScoreResolution(rawResult: RawSearchResult): MemoryResultTrace['scoreResolution'] {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:193:function addChannel(channelsUsed: Set<string>, candidate: unknown): void {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:197:  channelsUsed.add(normalized);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:228:  const pipelineStages = stages
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:232:  const channelsUsed = new Set<string>();
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:233:  const expansionTerms = new Set<string>();
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:234:  let fallbackTier: number | null = null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:235:  let queryComplexity: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:236:  let budgetTruncated = false;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:241:    if (channel) channelsUsed.add(channel);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:245:        if (typeof item === 'string') channelsUsed.add(item);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:251:        if (typeof term === 'string') expansionTerms.add(term);
exec
/bin/zsh -lc "sed -n '240,460p' .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Search Results Formatter
// ---------------------------------------------------------------

// Node stdlib
import fs from 'fs';

// Internal modules
import { estimateTokens } from './token-metrics';

// Import path security utilities (migrated from shared/utils.js)
import { validateFilePath } from '../lib/utils/path-security';

// Import memory parser for anchor extraction (SK-005)
import * as memoryParser from '../lib/parsing/memory-parser';

// REQ-019: Standardized Response Structure
import {
  createMCPSuccessResponse,
  createMCPEmptyResponse,
 succeeded in 51ms:
    const channel = typeof meta.channel === 'string' ? meta.channel : null;
    if (channel) channelsUsed.add(channel);

    if (Array.isArray(meta.channels)) {
      for (const item of meta.channels) {
        if (typeof item === 'string') channelsUsed.add(item);
      }
    }

    if (Array.isArray(meta.expandedTerms)) {
      for (const term of meta.expandedTerms) {
        if (typeof term === 'string') expansionTerms.add(term);
      }
    }

    if (typeof meta.tier === 'number' && Number.isFinite(meta.tier)) {
      fallbackTier = meta.tier;
    }
    if (typeof meta.fallbackTier === 'number' && Number.isFinite(meta.fallbackTier)) {
      fallbackTier = meta.fallbackTier;
exec
/bin/zsh -lc "sed -n '900,990p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_CONTEXT_HEADERS|injectContextualTree|headerOverhead|description cache|folder description|100 chars|after Stage 4|before truncation|truncation" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts .opencode/skill/system-spec-kit/mcp_server/tests/*context* .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '990,1070p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:758:    // Each "result" item is ~100 chars = ~25 tokens
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:776:    // Use a small budget to force truncation
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:822:  it('T206: Budget of 0 forces truncation on any non-empty result', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:8:type InjectContextualTreeInput = Parameters<typeof __testables.injectContextualTree>[0];
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:9:type InjectContextualTreeResult = ReturnType<typeof __testables.injectContextualTree>;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:33:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:56:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:8:type InjectContextualTreeInput = Parameters<typeof __testables.injectContextualTree>[0];
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:9:type InjectContextualTreeResult = ReturnType<typeof __testables.injectContextualTree>;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:33:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:56:    const injected = __testables.injectContextualTree(row, cache);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:33: * Per-folder description stored as `description.json` inside each spec folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:227:        // detects per-folder description edits (CHK-024 / REQ-008).
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:458:      // Prefer per-folder description.json if fresh
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:701: * Check whether a per-folder description.json is stale.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:794: * Check whether a description cache is stale by comparing its
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:823: * Ensure a fresh description cache exists. Loads existing cache from
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:32:import { truncateByConfidence } from './confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:52:import type { TruncationResult } from './confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:127:  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
 succeeded in 51ms:
            stage4: s4shadowMeta ?? null,
            attribution: s4attributionMeta ?? null,
            degradation: degradationMeta ?? null,
            budgetTruncated: budgeted.truncated,
            budgetLimit: budgetResult.budget,
            // AI-TRACE: CHK-038: Wire queryComplexity from router classification into trace
            queryComplexity: routeResult.tier,
          },
        }));
      }

      if (isContextHeadersEnabled() && reranked.length > 0) {
        const descriptionCache = buildDescriptionTailMap();
        if (descriptionCache.size > 0) {
          reranked = reranked.map((row) => injectContextualTree(row, descriptionCache));
        }
      }

      // AI-WHY: Sprint 3: Attach pipeline metadata to results for eval/debugging
      // Metadata is attached as non-enumerable _s3meta property to avoid
exec
/bin/zsh -lc "sed -n '1240,1315p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  // Stale cache — return it and schedule async refresh (fail open)
  if (descMapCache) {
    if (!descMapRefreshing) {
      descMapRefreshing = true;
      setTimeout(() => {
        try {
          const freshMap = rebuildDescriptionTailMap();
          descMapCache = { map: freshMap, timestamp: Date.now() };
        } catch (_error: unknown) {
          // AI-GUARD: Non-fatal: stale cache remains usable
        } finally {
          descMapRefreshing = false;
        }
      }, 0);
    }
    return descMapCache.map;
  }

  // Cold start — synchronous build required (no stale data to return)
  const freshMap = rebuildDescriptionTailMap();
codex
I’ve finished the retrieval cluster and most of the shared modules it depends on. The big pattern so far is that many descriptions are close on behavior, while the path tables lag behind the codebase renames and the feature-flag docs in category 20 are mostly missing the `mcp_server/` prefix. Now I’m working through the lighter governance/tooling documents and the UX-hook cluster, which share a lot of implementation modules.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "applyTreeThinning|200|500|100|300|tokens saved|merged into parent|summary" .opencode/skill/system-spec-kit/mcp_server/lib/chunking .opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Chunk Thinning
// ---------------------------------------------------------------
// Scores chunks by anchor presence + content density, then
// applies a thinning threshold to drop low-quality chunks.
// Used BEFORE indexing to filter out low-value chunks.
// ---------------------------------------------------------------

import type { AnchorChunk } from './anchor-chunker';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/**
 * Describes the ChunkScore shape.
 */
export interface ChunkScore {
  chunk: AnchorChunk;
  score: number;        // 0-1 composite score
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Anchor Chunker
// ---------------------------------------------------------------
// Splits large memory files into chunks using ANCHOR tags as
// natural boundaries. Falls back to structure-aware markdown
// splitting when anchors are absent.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/**
 * Describes the AnchorChunk shape.
 */
export interface AnchorChunk {
  /** The text content of this chunk */
  content: string;
  /** Anchor IDs covered by this chunk (empty for fallback chunks) */
  anchorIds: string[];
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:44:    charCount: overrides.charCount ?? (overrides.content?.length ?? 300),
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:142:  it('should penalize very short chunks (< 100 chars stripped)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:69:  // Penalize very short chunks (< 100 chars after stripping)
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:70:  const lengthFactor = stripped.length < 100 ? stripped.length / 100 : 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:35:  /** Summary text for the parent record (first ~500 chars) */
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:49:/** Target chunk size in characters (~1000 tokens at 4 chars/token) */
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:53:const MAX_CHUNK_CHARS = 12000;
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:56:export const CHUNKING_THRESHOLD = 50000;
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:58:/** Max characters for parent summary (BM25 fallback) */
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:59:const PARENT_SUMMARY_LENGTH = 500;
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:75:| `ChunkingResult` | anchor-chunker.ts | Interface | Strategy used, chunk array and parent summary |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:116:| `PARENT_SUMMARY_LENGTH` | 500 chars | BM25 fallback summary extracted from file start |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:123:| Content density | 0.4 | 0 to 1 | Ratio of meaningful chars to total chars, with length penalty for very short chunks (<100 chars) and structure bonus for headings, code blocks and list items |
exec
/bin/zsh -lc 'ls -1 .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"progressive-validate|validate.sh|level 1|level 2|auto-fix|dry-run|strict|verbose|quiet\" .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit -g '*.sh'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
README.md
check-api-boundary.sh
check-links.sh
common.sh
core
dist
evals
extractors
kpi
lib
loaders
memory
node_modules
ops
package.json
registry-loader.sh
renderers
rules
scratch
scripts-registry.json
 succeeded in 51ms:
# Progressive validation for spec documents

## Current Reality

The `progressive-validate.sh` script wraps `validate.sh` with four progressive levels. Level 1 (Detect) identifies all violations. Level 2 (Auto-fix) applies safe mechanical corrections like missing dates, heading levels and whitespace with before/after diff logging. Level 3 (Suggest) presents non-automatable issues with guided remediation options. Level 4 (Report) produces structured output in JSON or human-readable format.

Flags include `--level N`, `--dry-run`, `--json`, `--strict`, `--quiet` and `--verbose`. Exit codes maintain compatibility with `validate.sh`: 0 for pass, 1 for warnings, 2 for errors. The dry-run mode previews all changes before applying them.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/progressive-validate.sh` | Script | Progressive validation wrapper around validate.sh |

## Source Metadata

 succeeded in 52ms:
Total output lines: 466

.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh:98:        "node dist/memory/cleanup-orphaned-vectors.js --check-ledger --strict" || exit 1
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:17:#   --dry-run, -n        Preview changes without writing files
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:18:#   --verbose, -v        Show detailed output during composition
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:28:#   compose.sh --dry-run          # Preview all changes
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:29:#   compose.sh --verbose 2        # Verbose composition of Level 2
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:113:  --dry-run, -n        Preview changes without writing files
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:114:  --verbose, -v        Show detailed output during composition
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:124:  compose.sh --dry-run          # Preview all changes
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:125:  compose.sh --verbose 2        # Verbose composition of Level 2
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:154:# verbose()
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:155:# Print only if verbose mode is enabled (to stderr to avoid polluting stdout)
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:156:verbose() {
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:169:            verbose "Created directory: $dir"
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:361:    verbose "Composing spec.md for Level $level"
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:527:    verbose "Composing plan.md for Level $level"
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:621:    verbose "Composing tasks.md for Level $level"
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:636:    verbose "Composing implementation-summary.md for Level $level"
.opencode/skill/system-spec-kit/scripts/templates/compose.sh:651:    verbose "Composing checklist.md for Level $level"
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: PROGRESSIVE VALIDATE
# ───────────────────────────────────────────────────────────────
# Progressive validation pipeline for spec documents.
# Wraps validate.sh with a 4-level pipeline:
#   Level 1 - Detect  : Identify all violations (same as validate.sh)
#   Level 2 - Auto-fix: Apply safe mechanical corrections with diff log
#   Level 3 - Suggest : Present non-automatable issues with guidance
#   Level 4 - Report  : Produce structured output with before/after diffs
#
# USAGE:
#   ./progressive-validate.sh <folder-path> [OPTIONS]
#
# OPTIONS:
#   --level N     Run pipeline up to level N (1-4, default: 4)
#   --dry-run     Show what would be changed without applying fixes
#   --json        Structured JSON output
#   --strict      Treat warnings as errors
#   --quiet, -q   Minimal output
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,520p' .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: File Watcher
// ---------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

/**
 * Describes the WatcherConfig shape.
 */
export interface WatcherConfig {
  paths: string[];
  reindexFn: (filePath: string) => Promise<unknown>;
  removeFn?: (filePath: string) => Promise<unknown>;
  debounceMs?: number;
}

/**
 * Describes the FSWatcher shape.
 succeeded in 51ms:
          const reindexElapsed = Date.now() - reindexStart;
          filesReindexed++;
          totalReindexTimeMs += reindexElapsed;
          console.error(`[file-watcher] Reindexed ${path.basename(filePath)} in ${reindexElapsed}ms (total: ${filesReindexed} files, avg: ${Math.round(totalReindexTimeMs / filesReindexed)}ms)`);

          contentHashes.set(filePath, nextHash);
        } finally {
          releaseReindexSlot();
        }
      } finally {
        activeAbortControllers.delete(filePath);
      }
    });
  };

  const scheduleRemove = (targetPath: unknown): void => {
    const filePath = typeof targetPath === 'string' ? targetPath : null;

    scheduleTask(targetPath, async () => {
      if (!filePath) {
 succeeded in 52ms:
// ---------------------------------------------------------------
// TEST: File watcher reliability and path filtering
// ---------------------------------------------------------------

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { __testables, startFileWatcher } from '../lib/ops/file-watcher';

function createDeferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}
exec
/bin/zsh -lc "rg -n \"startFileWatcher\\(|removeFn:|unlink\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:960:          fileWatcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:965:            removeFn: async (filePath: string) => {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:340:  name: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:343:  memory_causal_unlink: memoryCausalUnlinkSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:374:  memory_causal_unlink: ['edgeId'],
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:5:// causal_link, causal_stats, causal_unlink (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:26:  'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:35:    case 'memory_causal_unlink': return handleMemoryCausalUnlink(parseArgs<CausalUnlinkArgs>(validateToolArgs('memory_causal_unlink', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:31:  id: number;               // T202: causal_edges.id for unlink workflow
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:642:/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:649:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:672:        tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:676:        recovery: getRecoveryHint('memory_causal_unlink', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:694:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:702:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:706:      recovery: getRecoveryHint('memory_causal_unlink', 'E022'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:727:const handle_memory_causal_unlink = handleMemoryCausalUnlink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:733:  handle_memory_causal_unlink,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:131:  handle_memory_causal_unlink,
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:64:      if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
exec
/bin/zsh -lc "sed -n '940,990p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    // P0-3: Async ingestion job queue initialization + crash recovery reset.
    try {
      const ingestInit = initIngestJobQueue({
        processFile: async (filePath: string) => {
          await indexMemoryFile(filePath, { asyncEmbedding: true });
        },
      });
      if (ingestInit.resetCount > 0) {
        console.error(`[context-server] Ingest crash recovery reset ${ingestInit.resetCount} incomplete job(s) to queued`);
      }
    } catch (ingestInitErr: unknown) {
      const message = ingestInitErr instanceof Error ? ingestInitErr.message : String(ingestInitErr);
      console.warn('[context-server] Ingest queue init failed:', message);
    }

    // P1-7: Optional real-time markdown watcher for automatic re-indexing.
    if (isFileWatcherEnabled()) {
      try {
        const watchPaths = getSpecsBasePaths(DEFAULT_BASE_PATH);
        if (watchPaths.length > 0) {
exec
/bin/zsh -lc "rg -n \"removeIndexedMemoriesForFile\\(|function removeIndexedMemoriesForFile|const removeIndexedMemoriesForFile\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 97ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:619:async function removeIndexedMemoriesForFile(filePath: string): Promise<void> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:966:              await removeIndexedMemoriesForFile(filePath);
exec
/bin/zsh -lc "sed -n '600,665p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  const timedOut = await Promise.race([
    cleanup.then(() => false),
    new Promise<boolean>((resolve) => {
      deadlineTimer = setTimeout(() => resolve(true), SHUTDOWN_DEADLINE_MS);
    }),
  ]);

  if (deadlineTimer) {
    clearTimeout(deadlineTimer);
  }

  if (timedOut) {
    console.error(`[context-server] Shutdown deadline exceeded after ${SHUTDOWN_DEADLINE_MS}ms`);
  }

  process.exit(exitCode);
}

/** Remove indexed rows for watcher delete and rename events. */
async function removeIndexedMemoriesForFile(filePath: string): Promise<void> {
exec
/bin/zsh -lc "rg -n \"deleteMemory\\(|export .*deleteMemory|function deleteMemory|delete_memory\" .opencode/skill/system-spec-kit/mcp_server/lib/search -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:350:export function delete_memory(id: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:354:  const delete_memory_tx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:388:  const deleted = delete_memory_tx();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:406:export function delete_memory_by_path(spec_folder: string, file_path: string, anchor_id: string | null = null): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:420:    return delete_memory(row.id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:547:export { delete_memory as deleteMemory };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:548:export { delete_memory_by_path as deleteMemoryByPath };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:730:    const { delete_memory } = await import('./vector-index-mutations');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:731:    return delete_memory(id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:763:    const { delete_memory_by_path } = await import('./vector-index-mutations');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:764:    return delete_memory_by_path(specFolder, filePath, anchorId);
exec
/bin/zsh -lc "sed -n '340,405p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  });

  return update_memory_tx();
}

/**
 * Deletes a memory and its related index records.
 * @param id - The memory identifier.
 * @returns True when a memory was deleted.
 */
export function delete_memory(id: number): boolean {
  const database = initialize_db();
  const sqlite_vec = get_sqlite_vec_available();

  const delete_memory_tx = database.transaction(() => {
    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);

    if (sqlite_vec) {
      try {
        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "stats|bulk-delete|reindex|schema-downgrade|dry-run|skip-checkpoint|skipCheckpoint|older-than|olderThan|tier distribution|top folders|schema version" .opencode/skill/system-spec-kit/mcp_server/cli.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '280,520p' .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Cli
// ---------------------------------------------------------------
// Standalone CLI for bulk database operations, runnable from any
// directory. Resolves its own modules via __dirname so
// better-sqlite3 and sqlite-vec load correctly regardless of cwd.
//
// Usage:
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js bulk-delete --tier deprecated
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force] [--eager-warmup]
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js schema-downgrade --to 15 --confirm
// ---------------------------------------------------------------

// Core modules (resolved relative to this file's location)
import * as vectorIndex from './lib/search/vector-index';
import * as checkpointsLib from './lib/storage/checkpoints';
import * as accessTracker from './lib/storage/access-tracker';
import * as causalEdges from './lib/storage/causal-edges';
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:253:  const checkpointName = options.checkpointName || `pre-schema-downgrade-v16-to-v15-${nowTimestampForName()}`;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:10://   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats
.opencode/skill/system-spec-kit/mcp_server/cli.ts:11://   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js bulk-delete --tier deprecated
.opencode/skill/system-spec-kit/mcp_server/cli.ts:12://   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force] [--eager-warmup]
.opencode/skill/system-spec-kit/mcp_server/cli.ts:13://   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js schema-downgrade --to 15 --confirm
.opencode/skill/system-spec-kit/mcp_server/cli.ts:23:import { downgradeSchemaV16ToV15 } from './lib/storage/schema-downgrade';
.opencode/skill/system-spec-kit/mcp_server/cli.ts:52:  stats                          Show memory database statistics
.opencode/skill/system-spec-kit/mcp_server/cli.ts:53:  bulk-delete --tier <tier>      Delete memories by importance tier
.opencode/skill/system-spec-kit/mcp_server/cli.ts:55:    [--older-than <days>]          Optional: only delete older than N days
.opencode/skill/system-spec-kit/mcp_server/cli.ts:56:    [--dry-run]                    Preview without deleting
.opencode/skill/system-spec-kit/mcp_server/cli.ts:57:    [--skip-checkpoint]            Optional: skip pre-delete checkpoint (blocked for constitutional/critical)
.opencode/skill/system-spec-kit/mcp_server/cli.ts:58:  reindex [--force] [--eager-warmup]
.opencode/skill/system-spec-kit/mcp_server/cli.ts:60:  schema-downgrade --to 15 --confirm
.opencode/skill/system-spec-kit/mcp_server/cli.ts:67:  spec-kit-cli stats
.opencode/skill/system-spec-kit/mcp_server/cli.ts:68:  spec-kit-cli bulk-delete --tier deprecated
.opencode/skill/system-spec-kit/mcp_server/cli.ts:69:  spec-kit-cli bulk-delete --tier temporary --older-than 30
.opencode/skill/system-spec-kit/mcp_server/cli.ts:70:  spec-kit-cli bulk-delete --tier deprecated --folder 02--system-spec-kit --dry-run
.opencode/skill/system-spec-kit/mcp_server/cli.ts:71:  spec-kit-cli reindex
.opencode/skill/system-spec-kit/mcp_server/cli.ts:72:  spec-kit-cli reindex --force
.opencode/skill/system-spec-kit/mcp_server/cli.ts:73:  spec-kit-cli reindex --eager-warmup
 succeeded in 50ms:
  } else {
    console.log(`\n  Checkpoint:  skipped`);
  }

  // Fetch IDs for deletion
  let selectSql = 'SELECT id FROM memory_index WHERE importance_tier = ?';
  const selectParams: unknown[] = [tier];
  if (specFolder) { selectSql += ' AND spec_folder = ?'; selectParams.push(specFolder); }
  if (olderThanDays) { selectSql += ` AND created_at < datetime('now', '-' || ? || ' days')`; selectParams.push(parseInt(olderThanDays, 10)); }

  const toDelete = db.prepare(selectSql).all(...selectParams) as Array<{ id: number }>;

  // Initialize causal edges for cleanup
  causalEdges.init(db);

  // Delete in transaction
  let deletedCount = 0;
  const deletedIds: number[] = [];

  const bulkDeleteTx = db.transaction(() => {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_|is[A-Z].*Enabled|isPipelineV2Enabled|isConsolidationEnabled|isEntityLinkingEnabled|isMemorySummariesEnabled|isAutoEntitiesEnabled|isGraphSignalsEnabled|isCommunityDetectionEnabled|isAblationEnabled" .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Feature flag governance

## Current Reality

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework defines operational targets (small active flag surface, explicit sunset windows and periodic audits). These are process controls, not hard runtime-enforced caps in code.

The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.

## Source Files

No dedicated source files — this describes governance process controls.

## Source Metadata

- Group: Governance
- Source feature title: Feature flag governance
- Current reality source: feature_catalog.md
 succeeded in 51ms:
# Feature flag sunset audit

## Current Reality

A comprehensive audit at Sprint 7 exit found 61 unique `SPECKIT_` flags across the codebase. Disposition: 27 flags are ready to graduate to permanent-ON defaults (removing the flag check), 9 flags are identified as dead code for removal and 3 flags remain as active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`).

The current active flag-helper inventory in `search-flags.ts` is 23 exported `is*` functions (including the deprecated `isPipelineV2Enabled()` compatibility shim). Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON, and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.

**Phase 017 update:** `SPECKIT_PIPELINE_V2` is now deprecated. `isPipelineV2Enabled()` always returns `true` regardless of the env var. The legacy V1 pipeline code was removed, making the env var a no-op.

**Sprint 8 update:** Flag graduation and dead code removal have been completed. The Sprint 8 comprehensive remediation removed a large dead-code slice including: dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`), and dead functions/exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8) for the full accounting.

---

## Source Files

No dedicated source files — this describes governance process controls.

## Source Metadata

 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:7:// Set SPECKIT_<FLAG>=false to disable any graduated feature.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:9:import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:13: * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:15:export function isMMREnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:16:  return isFeatureEnabled('SPECKIT_MMR');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:21: * Default: TRUE (enabled). Set SPECKIT_TRM=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:23:export function isTRMEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:24:  return isFeatureEnabled('SPECKIT_TRM');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:29: * Default: TRUE (enabled). Set SPECKIT_MULTI_QUERY=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:31:export function isMultiQueryEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:32:  return isFeatureEnabled('SPECKIT_MULTI_QUERY');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:37: * Default: TRUE (enabled). Set SPECKIT_CROSS_ENCODER=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:39:export function isCrossEncoderEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:40:  return isFeatureEnabled('SPECKIT_CROSS_ENCODER');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:45: * Default: TRUE (graduated). Set SPECKIT_SEARCH_FALLBACK=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:47:export function isSearchFallbackEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:48:  return isFeatureEnabled('SPECKIT_SEARCH_FALLBACK');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:53: * Default: TRUE (graduated). Set SPECKIT_FOLDER_DISCOVERY=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:55:export function isFolderDiscoveryEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:56:  return isFeatureEnabled('SPECKIT_FOLDER_DISCOVERY');
exec
/bin/zsh -lc 'python3 -c $'"'import re, pathlib\\ntext=pathlib.Path(\".opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts\").read_text()\\nfuncs=re.findall(r\"export function (is[A-Za-z0-9_]+)\\\\(\", text)\\nprint(len(funcs))\\nprint(\"\\\\n\".join(funcs))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 588ms:
23
isMMREnabled
isTRMEnabled
isMultiQueryEnabled
isCrossEncoderEnabled
isSearchFallbackEnabled
isFolderDiscoveryEnabled
isDocscoreAggregationEnabled
isSaveQualityGateEnabled
isReconsolidationEnabled
isNegativeFeedbackEnabled
isPipelineV2Enabled
isEmbeddingExpansionEnabled
isConsolidationEnabled
isEncodingIntentEnabled
isGraphSignalsEnabled
isCommunityDetectionEnabled
isMemorySummariesEnabled
isAutoEntitiesEnabled
isEntityLinkingEnabled
exec
/bin/zsh -lc "rg -n \"ADAPTIVE_FUSION|COACTIVATION_STRENGTH|PRESSURE_POLICY|SPECKIT_ABLATION\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:59:      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:60:      { flag: 'SPECKIT_ABLATION' }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:476:  const pressurePolicyEnabled = process.env.SPECKIT_PRESSURE_POLICY !== 'false' && rolloutEnabled;
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:76:const FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION';
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:347:  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:17:  'SPECKIT_PRESSURE_POLICY',
.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:21:  'SPECKIT_ADAPTIVE_FUSION',
.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:77:      'SPECKIT_PRESSURE_POLICY',
.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:82:      'SPECKIT_ADAPTIVE_FUSION',
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:41:    it('boostFactor is 0.25 (configurable via SPECKIT_COACTIVATION_STRENGTH)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:161:    savedAblationEnv = process.env.SPECKIT_ABLATION;
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:167:      process.env.SPECKIT_ABLATION = savedAblationEnv;
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:169:      delete process.env.SPECKIT_ABLATION;
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:178:    it('returns false when SPECKIT_ABLATION is not set', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:179:      delete process.env.SPECKIT_ABLATION;
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:183:    it('returns true when SPECKIT_ABLATION=true', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:184:      process.env.SPECKIT_ABLATION = 'true';
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:188:    it('returns true when SPECKIT_ABLATION=TRUE (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:189:      process.env.SPECKIT_ABLATION = 'TRUE';
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:193:    it('returns true when SPECKIT_ABLATION=True (mixed case)', () => {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/01-int8-quantization-evaluation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/03-implemented-auto-entity-extraction.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/04-implemented-memory-summary-generation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/05-implemented-cross-document-entity-linking.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# INT8 quantization evaluation

## Current Reality

Decision: **NO-GO**. All three activation criteria were unmet.

Active memories with embeddings: 2,412 measured versus the 10,000 threshold (24.1%). P95 search latency: approximately 15ms measured versus the 50ms threshold (approximately 30%). Embedding dimensions: 1,024 measured versus the 1,536 threshold (66.7%).

The estimated 7.1 MB storage savings (3.9% of 180 MB total DB) did not justify 5.32% estimated recall risk, custom quantized BLOB complexity, or KL-divergence calibration overhead. Re-evaluate when the corpus grows approximately 4x (above 10K memories), sustained p95 exceeds 50ms, or the embedding provider changes to dimensions above 1,536.

## Source Files

No dedicated source files — this is a decision record.

## Source Metadata

- Group: Decisions and deferrals
- Source feature title: INT8 quantization evaluation
- Current reality source: feature_catalog.md
 succeeded in 51ms:
# Implemented: graph centrality and community detection

## Current Reality

Originally deferred at Sprint 6b pending a feasibility spike. Three graph capabilities were planned: graph momentum (N2a), causal depth signal (N2b) and community detection (N2c).

**Now implemented.** N2a and N2b share a single flag (`SPECKIT_GRAPH_SIGNALS`, default ON) providing additive score adjustments up to +0.05 each in Stage 2. N2c runs behind `SPECKIT_COMMUNITY_DETECTION` (default ON) with BFS connected components escalating to a pure-TypeScript Louvain implementation when the largest component exceeds 50% of nodes. Schema migrations v19 added `degree_snapshots` and `community_assignments` tables. See [Graph momentum scoring](#graph-momentum-scoring), [Causal depth signal](#causal-depth-signal) and [Community detection](#community-detection) for full descriptions.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/community-detection.ts` | Lib | Community detection algorithm |
| `mcp_server/lib/manage/pagerank.ts` | Lib | PageRank computation |

### Tests

| File | Focus |
 succeeded in 50ms:
# Implemented: auto entity extraction

## Current Reality

Originally deferred at Sprint 6b pending a feasibility spike alongside N2. Rule-based heuristics would extract entities from memory content, gated on edge density.

**Now implemented.** Five regex extraction rules with a 64-word denylist, stored in a dedicated `memory_entities` table (not causal_edges) with an `entity_catalog` for canonical name resolution. Runs at save time behind `SPECKIT_AUTO_ENTITIES` (default ON). Schema migration v20 added `memory_entities` and `entity_catalog` tables. Zero external NLP dependencies. See [Auto entity extraction](#auto-entity-extraction) for the full description. Unblocks S5 (cross-document entity linking).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory integration |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Lib | Extraction adapter |
| `mcp_server/lib/extraction/redaction-gate.ts` | Lib | Redaction gate |

 succeeded in 51ms:
# Implemented: cross-document entity linking

## Current Reality

Originally skipped at Sprint 7 because zero entities existed in the system. R10 had not been built, so there was no entity catalog to link against.

**Now implemented.** With R10 providing extracted entities, S5 scans the `entity_catalog` for entities appearing in two or more spec folders and creates `supports` causal edges with `strength=0.7` and `created_by='entity_linker'`. A density guard prevents runaway edge creation by running both a current-global-density precheck (`total_edges / total_memories`) and a projected post-insert global density check against `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`, invalid or negative values fall back to `1.0`). Runs behind `SPECKIT_ENTITY_LINKING` (default ON) and depends on a populated `entity_catalog` (typically produced by R10 auto-entities). See [Cross-document entity linking](#cross-document-entity-linking) for the full description.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Cross-document entity linking |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |

### Tests

 succeeded in 51ms:
# Implemented: memory summary generation

## Current Reality

Originally skipped at Sprint 7 because the scale gate measured 2,411 active memories, below the 5,000 threshold.

**Now implemented.** Pure-TypeScript TF-IDF extractive summarizer generates top-3 key sentences at save time, stored with summary-specific embeddings in the `memory_summaries` table. Operates as a parallel search channel in Stage 1 (not a pre-filter, avoiding recall loss). The runtime scale gate remains: the channel skips execution below 5,000 indexed memories. Runs behind `SPECKIT_MEMORY_SUMMARIES` (default ON). Schema migration v20 added the `memory_summaries` table. See [Memory summary search channel](#memory-summary-search-channel) for the full description.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/memory-summaries.ts` | Lib | Memory summary generation |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/tfidf-summarizer.ts` | Lib | TF-IDF extractive summarizer |

### Tests
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "0.05|largest component exceeds 50|Louvain|community_assignments|degree_snapshots|SPECKIT_GRAPH_SIGNALS|SPECKIT_COMMUNITY_DETECTION|PageRank|degree snapshot" .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts .opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Community Detection
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import type Database from "better-sqlite3";

// ---------------------------------------------------------------------------
// 2. TYPES
// ---------------------------------------------------------------------------

/** Adjacency list: node ID (string) -> set of neighbor node IDs */
type AdjacencyList = Map<string, Set<string>>;

// ---------------------------------------------------------------------------
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Pagerank
// ---------------------------------------------------------------
// Iterative PageRank algorithm for memory graph authority scoring.
// Computes convergence-based rank scores for weighted node retrieval.
// Reference: C138-P4 — graph-based importance scoring for memory nodes.
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------------------

/** Adjacency list node: each node has a unique numeric id and out-edges. */
export interface GraphNode {
  id: number;
  outLinks: number[];
}

/** Result returned by computePageRank. */
export interface PageRankResult {
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:138: * Default: TRUE (enabled). Set SPECKIT_GRAPH_SIGNALS=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:141:  return isFeatureEnabled('SPECKIT_GRAPH_SIGNALS');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:145: * N2c: Community detection (BFS connected components + Louvain escalation).
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:146: * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_DETECTION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:149:  return isFeatureEnabled('SPECKIT_COMMUNITY_DETECTION');
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:4:// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:53: * in at least one causal edge. Writes into the `degree_snapshots` table
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:77:      INSERT OR REPLACE INTO degree_snapshots (memory_id, degree_count, snapshot_date)
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:127: * degree_snapshots table.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:133:      FROM degree_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:356: * - Momentum bonus: clamp(momentum * 0.01, 0, 0.05) — rewards nodes gaining connections
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:357: * - Depth bonus: normalizedDepth * 0.05 — rewards structurally deep nodes
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:381:      // Momentum bonus: up to +0.05
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:382:      const momentumBonus = clamp(momentum * 0.01, 0, 0.05);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:383:      // Depth bonus: up to +0.05
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:384:      const depthBonus = depth * 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts:4:// Iterative PageRank algorithm for memory graph authority scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts:19:/** Result returned by computePageRank. */
.opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts:20:export interface PageRankResult {
.opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts:33:/** Standard PageRank damping factor — probability of following an outbound link. */
exec
/bin/zsh -lc "rg -n \"computePageRank\\(|pagerank\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/manage/pagerank.ts:61:export function computePageRank(
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:8:import { computePageRank } from '../lib/manage/pagerank';
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:9:import type { GraphNode, PageRankResult } from '../lib/manage/pagerank';
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:27:    const result = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:47:    const result = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:60:    const result = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:76:    const result = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:94:    const result = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:106:    const result = computePageRank([]);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:116:    const result = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:136:    const result = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:152:    const lowDamping = computePageRank(nodes, 20, 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:153:    const highDamping = computePageRank(nodes, 20, 0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:170:    const result = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:185:    const run1 = computePageRank(nodes);
.opencode/skill/system-spec-kit/mcp_server/tests/pagerank.vitest.ts:186:    const run2 = computePageRank(nodes);
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "RULES|denylist|64|memory_entities|entity_catalog|SPECKIT_AUTO_ENTITIES|storeEntities|updateEntityCatalog|redaction" .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts .opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Extraction Adapter
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import * as workingMemory from '../cache/cognitive/working-memory';
import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
import { applyRedactionGate } from './redaction-gate';

type SummarizerId = 'firstLast500' | 'matchCountSummary' | 'stdoutSummary';

interface ExtractionRule {
  id: string;
  toolPattern: RegExp;
  contentPattern: RegExp;
  attention: number;
  summarizer: SummarizerId;
}

interface RuleMatch {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Entity Extractor
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_AUTO_ENTITIES
// Pure-TS rule-based extraction, zero npm dependencies.
// ---------------------------------------------------------------

import { isEntityDenied } from './entity-denylist.js';
import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker.js';

import type Database from 'better-sqlite3';

// AI-WHY: Re-export canonical versions from entity-linker for backward compatibility
export { normalizeEntityName, computeEdgeDensity };

// ---------------------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------------------

/** A single entity extracted from memory content. */
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:12:  redactionApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:68:    return { redactedText: '', redactionApplied: false, matches: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:79:    redactionApplied: matches.length > 0,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:8:import { applyRedactionGate } from './redaction-gate';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:38:const RULES: ExtractionRule[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:142:  for (const rule of RULES) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:209:function redactionRatio(original: string, redacted: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:229:  const redactionResult = applyRedactionGate(summary);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:230:  if (redactionResult.redactionApplied) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:234:  if (redactionRatio(summary, redactionResult.redactedText) > REDACTION_SKIP_THRESHOLD) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:236:    console.error(`[extraction-adapter] Skipped insert for ${matched.rule.id}: redaction ratio above threshold`);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:255:    redactionApplied: redactionResult.redactionApplied,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:268:  validateExtractionRules(codex
I’ve finished the first audit pass and I’m moving through the remaining categories now. Next I’m checking the `ux-hooks`, `decisions`, and `feature-flag-reference` docs against the actual server files so the final report is complete file-by-file.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md
.opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/04-implemented-memory-summary-generation.md
.opencode/skill/system-spec-kit/feature_catexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"appendAutoSurfaceHints|response-hints|postMutationHooks|safetyConfirmationUsed|confirmName|latencyMs|cacheCleared|cacheInvalidated|partial indexing|no-op|duplicate content|memory_health|autoRepair|repair metadata\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/mcp_server/tests -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Mutation Hooks
// ---------------------------------------------------------------

import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { clearConstitutionalCache } from '../hooks/memory-surface';
import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';

import type { MutationHookResult } from './memory-crud-types';

export type { MutationHookResult };

function runPostMutationHooks(
  operation: string,
  context: Record<string, unknown> = {}
): MutationHookResult {
  const startTime = Date.now();

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Mutation Feedback
// ---------------------------------------------------------------

import type { MutationHookResult } from '../handlers/memory-crud-types';

function buildMutationHookFeedback(operation: string, hookResult: MutationHookResult): {
  data: {
    operation: string;
    latencyMs: number;
    triggerCacheCleared: boolean;
    constitutionalCacheCleared: boolean;
    graphSignalsCacheCleared: boolean;
    coactivationCacheCleared: boolean;
    toolCacheInvalidated: number;
  };
  hints: string[];
} {
  const hints: string[] = [];

 succeeded in 51ms:
Total output lines: 434

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:50:  appendAutoSurfaceHints,
.opencode/skill/system-spec-kit/mcp_seexec
/bin/zsh -lc "python3 -c \"from pathlib import Path; import re; base=Path('.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks');
for path in sorted(base.glob('*.md')):
 text=path.read_text(); m=re.search(r'## Current Reality\\n(.*?)(?:\\n## |\\Z)', text, re.S); current=(m.group(1).strip().replace('\\n',' ')[:500] if m else 'NO CURRENT REALITY'); print('FILE:', path.name); print('CURRENT:', current); print('---')\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 597ms:
FILE: 01-shared-post-mutation-hook-wiring.md
CURRENT: Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete, and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.
---
FILE: 02-memory-health-autorepair-metadata.md
CURRENT: `memory_health` now accepts optional `autoRepair` execution and returns structured repair metadata. Callers can trigger repair work intentionally and inspect what changed from handler output.
---
FILE: 03-checkpoint-delete-confirmname-safety.md
CURRENT: Checkpoint deletion now requires a matching `confirmName` safety parameter before destructive action proceeds. The finalized follow-up pass enforced that requirement across handler, schema, tool-schema, and tool-type layers so callers cannot bypass it through a looser boundary. Successful deletion responses also report the confirmation outcome through `safetyConfirmationUsed=true` plus deletion metadata.
---
FILE: 04-schema-and-type-contract-synchronization.md
CURRENT: Phase 014 aligned runtime validation and TypeScript contracts for the new mutation-safety behavior. Tool schemas and types were updated together so added parameters and output metadata remain consistent across handler logic, schema validation, and tool typing. The finalized follow-up closures specifically synced required `confirmName` enforcement and the updated mutation response metadata contract across all layers.
---
FILE: 05-dedicated-ux-hook-modules.md
CURRENT: Phase 014 introduced dedicated UX hook modules for mutation feedback and response hints. This separated UX hook logic fromexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1200,1365p' .opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Crud Types
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------exec
/bin/zsh -lc 'rg -n "runPostMutationHooks|postMutationHooks|latencyMs|cachesCleared|appendAutoSurfaceHints|autoSurfacedContext|confirmName|safetyConfirmationUsed|autoRepair|partial indexing|partialIndex|Hooks README|mutation-feedback|response-hints" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:38:import { runPostMutationHooks } from './handlers/mutation-hooks';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:50:  appendAutoSurfaceHints,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:280:    let autoSurfacedContext: AutoSurfaceResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:290:            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:292:            autoSurfacedContext = await autoSurfaceMemories(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:301:        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:329:    if (autoSurfacedContext && result && !result.isError) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:330:      appendAutoSurfaceHints(result, autoSurfacedContext);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:331:      result.autoSurfacedContext = autoSurfacedContext;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:655:      runPostMutationHooks('delete', { filePath, deletedCount });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:49:  autoRepair?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:85:  latencyMs: number;
.openexec
/bin/zsh -lc "rg -n \"handleMemoryHealth|autoRepair|repair|divergent_aliases|aliasConflicts|checkpoint_delete|confirmName|safetyConfirmationUsed|partial indexing|postMutationHooks|duplicate content\" .opencode/skill/system-spec-kit/mcp_server/handlers -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:46:  reportMode?: 'full' | 'divergent_aliases';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:49:  autoRepair?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:211:    let postMutationHooks: import('./mutation-hooks').MutationHookResult;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:213:      postMutationHooks = runPostMutationHooks('bulk-delete', { specFolder, tier, deletedCount });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:215:      postMutationHooks = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:221:    postMutationFeedback = buildMutationHookFeedback('bulk-delete', postMutationHooks);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:249:    data.postMutationHooks = postMutationFeedback.data;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:9:import { handleMemoryHealth } from './memory-crud-health';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:21:  handleMemoryHealth,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:31:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:104:  aliasConflicts: AliasConflictSummary;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:304:    aliasConflicts: { ...EMPTY_ALIAS_CONFLICT_SUMMARY },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:492:  results.aliasConflicts = detectAliasCocodex
I’ve got the core hook implementation in view now. Most `ux-hooks` entries really do map to the same shared mutation-hook and response-hint code paths, so I’m checking where each doc is just missing a renamed test path versus where the description itself drifted.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; root=Path(\".opencode/skill/system-spec-kit\"); base=Path(\".opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks\");
for path in sorted(base.glob(\"*.md\")):
 text=path.read_text(); print(\"FILE\", path.name);
 in_table=False
 for line in text.splitlines():
  if line.startswith(\"## Source Files\") or line.startswith(\"### Source Files\"): in_table=True; continue
  if in_table and line.startswith(\"## \"): break
  if in_table and line.startswith(\"| "'`"):
   cells=[c.strip() for c in line.strip().strip("|").split("|")]
   p=cells[0].strip("`")
   ok=(root/p).is_file()
   print(("OK   " if ok else "MISS ")+p)
 print("---")'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 594ms:
FILE 01-shared-post-mutation-hook-wiring.md
OK   mcp_server/configs/cognitive.ts
OK   mcp_server/core/config.ts
OK   mcp_server/handlers/memory-crud-types.ts
OK   mcp_server/handlers/mutation-hooks.ts
OK   mcp_server/hooks/memory-surface.ts
OK   mcp_server/hooks/mutation-feedback.ts
OK   mcp_server/lib/cache/embedding-cache.ts
OK   mcp_server/lib/cache/tool-cache.ts
OK   mcp_server/lib/cognitive/co-activation.ts
OK   mcp_server/lib/graph/graph-signals.ts
OK   mcp_server/lib/interfaces/vector-store.ts
OK   mcp_server/lib/parsing/content-normalizer.ts
OK   mcp_server/lib/parsing/trigger-matcher.ts
OK   mcp_server/lib/providers/embeddings.ts
OK   mcp_server/lib/scoring/interference-scoring.ts
OK   mcp_server/lib/search/bm25-index.ts
OK   mcp_server/lib/search/retrieval-directives.ts
OK   mcp_server/lib/search/vector-index-aliases.ts
OK   mcp_server/lib/search/vector-index-mutations.ts
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | sed -n '270,310p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '300,430p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '320,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Mutation Hooks
     3	// ---------------------------------------------------------------
     4	
     5	import * as triggerMatcher from '../lib/parsing/trigger-matcher';
     6	import * as toolCache from '../lib/cache/tool-cache';
     7	import { clearConstitutionalCache } from '../hooks/memory-surface';
     8	import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
     9	import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';
    10	
    11	import type { MutationHookResult } from './memory-crud-types';
    12	
    13	export type { MutationHookResult };
    14	
    15	function runPostMutationHooks(
    16	  operation: string,
    17	  context: Record<string, unknown> = {}
    18	): MutationHookResult {
    19	  const startTime = Date.now();
    20	
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Response Hints
     3	// ---------------------------------------------------------------
     4	
     5	import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
     6	
     7	interface HookResult {
     8	  content?: Array<{ type?: string; text?: string }>;
     9	  [key: string]: unknown;
    10	}
    11	
    12	interface AutoSurfacedContext {
    13	  constitutional?: unknown[];
    14	  triggered?: unknown[];
    15	  surfaced_at?: string;
    16	  latencyMs?: number;
    17	}
    18	
    19	type EnvelopeRecord = Record<string, unknown>;
    20	
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Mutation Feedback
     3	// ---------------------------------------------------------------
     4	
     5	import type { MutationHookResult } from '../handlers/memory-crud-types';
     6	
     7	function buildMutationHookFeedback(operation: string, hookResult: MutationHookResult): {
     8	  data: {
     9	    operation: string;
    10	    latencyMs: number;
    11	    triggerCacheCleared: boolean;
    12	    constitutionalCacheCleared: boolean;
    13	    graphSignalsCacheCleared: boolean;
    14	    coactivationCacheCleared: boolean;
    15	    toolCacheInvalidated: number;
    16	  };
    17	  hints: string[];
    18	} {
    19	  const hints: string[] = [];
    20	
 succeeded in 51ms:
   270	   6. CHECKPOINT DELETE HANDLER
   271	--------------------------------------------------------------- */
   272	
   273	/** Handle checkpoint_delete tool - permanently removes a named checkpoint */
   274	async function handleCheckpointDelete(args: CheckpointDeleteArgs): Promise<MCPResponse> {
   275	  const startTime = Date.now();
   276	  await checkDatabaseUpdated();
   277	  const { name, confirmName } = args;
   278	
   279	  if (!name || typeof name !== 'string') {
   280	    throw new Error('name is required and must be a string');
   281	  }
   282	  if (!confirmName || typeof confirmName !== 'string') {
   283	    throw new Error('confirmName is required and must be a string');
   284	  }
   285	  if (confirmName !== name) {
   286	    throw new Error('confirmName must exactly match name to delete checkpoint');
   287	  }
   288	
   289	  const success: boolean = checkpoints.deleteCheckpoint(name);
 succeeded in 51ms:
   320	    const result = await dispatchTool(name, args) as ToolCallResponse | null;
   321	    if (!result) {
   322	      throw new Error(`Unknown tool: ${name}`);
   323	    }
   324	
   325	    runAfterToolCallbacks(name, callId, result);
   326	
   327	    // SK-004: Inject exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/hooks/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

export * from './memory-surface';
export * from './mutation-feedback';
export * from './response-hints';
 succeeded in 51ms:
---
title: "Hooks"
description: "Hook helper modules for memory surfacing, mutation UX feedback, and response hint injection."
trigger_phrases:
  - "hooks"
  - "memory surfacing"
  - "context injection"
---


# Hooks

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. RELATED](#4--related)

 succeeded in 51ms:
# Hooks README and export alignment

## Current Reality

The hooks barrel and hooks README were brought back into sync with the implemented UX-hook modules. `mutation-feedback` and `response-hints` are now both exported and documented as the canonical shared hook surface, removing the rollout-era README/export drift.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/hooks/index.ts` | Hook | Module barrel export |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/hooks/response-hints.ts` | Hook | Response hint hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Constitutional memory as expert knowledge injection

## Current Reality

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |

### Tests

| File | Focus |
|------|-------|
exec
/bin/zsh -lc "rg -n \"queryHierarchyMemories|buildHierarchyTree|getRelatedFolders|spec-folder-hierarchy\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:11:  buildHierarchyTree,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:12:  getRelatedFolders,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:15:  queryHierarchyMemories,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:16:} from '../lib/search/spec-folder-hierarchy';
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:118:// --- 3. buildHierarchyTree ---
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:120:describe('buildHierarchyTree', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:132:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:155:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:170:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:180:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:187:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:198:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:217:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:243:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:254:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:261:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:268:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:289:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:301:    const tree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:308:    const tree = buildHierarchyTree(db);
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Provenance-rich response envelopes

## Current Reality

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState), and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"isShadowScoringEnabled|isRsfEnabled|RECOVERY_HALF_LIFE_DAYS|logCoActivationEvent|getSubgraphWeights|computeCausalDepth\\(|computeStructuralFreshness|computeGraphCentrality\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Code standards alignment

## Current Reality

All modified files were reviewed against sk-code--opencode standards. 45 violations found and fixed: 26 AI-intent comment conversions (AI-WHY, AI-TRACE, AI-GUARD prefixes), 10 MODULE/COMPONENT headers added, import ordering corrections, and constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`).

---

## Source Files

No dedicated source files — this is a cross-cutting meta-improvement applied across multiple modules.

## Source Metadata

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Code standards alignment
- Current reality source: feature_catalog.md
 succeeded in 52ms:
# Dead code removal

## Current Reality

Approximately 360 lines of dead code were removed across four categories:

**Hot-path dead branches:** Dead RSF branch and dead shadow-scoring branch removed from `hybrid-search.ts`. Both were guarded by feature flag functions that always returned `false`.

**Dead feature flag functions:** `isShadowScoringEnabled()` removed from `shadow-scoring.ts` and `search-flags.ts`. `isRsfEnabled()` removed from `rsf-fusion.ts`. `isInShadowPeriod()` in `learned-feedback.ts` remains active as the R11 shadow-period safeguard and was not removed.

**Dead module-level state:** `stmtCache` Map (archival-manager.ts — never populated), `lastComputedAt` (community-detection.ts — set but never read), `activeProvider` cache (cross-encoder.ts — never populated), `flushCount` (access-tracker.ts — never incremented), 3 dead config fields in working-memory.ts (`decayInterval`, `attentionDecayRate`, `minAttentionScore`).

**Dead functions and exports:** `computeCausalDepth` single-node variant (graph-signals.ts — batch version is the only caller), `getSubgraphWeights` (graph-search-fn.ts — always returned 1.0, replaced with inline constant), `RECOVERY_HALF_LIFE_DAYS` (negative-feedback.ts — never imported), `'related'` weight entry (causal-edges.ts — invalid relation type), `logCoActivationEvent` and `CoActivationEvent` (co-activation.ts — never called).

**Preserved (NOT dead):** `computeStructuralFreshness` and `computeGraphCentrality` in `fsrs.ts` were identified as planned architectural components (not concluded experiments) and retained.

## Source Files

No dedicated source files — this is a cross-cutting meta-improvement applied across multiple modules.

 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:2:// Previously tested getSubgraphWeights, which was removed as dead code.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:3:// getSubgraphWeights always returned { causalWeight: 1.0 } regardless of intent.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:9:  it('getSubgraphWeights was removed — causal weight is inlined as 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:503:      // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:510:      // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:567:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:577:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:587:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:596:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:608:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:660:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:152:  it('fsrs exports: computeStructuralFreshness, computeGraphCentrality', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:154:    expect(typeof mod.computeStructuralFreshness).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:155:    expect(typeof mod.computeGraphCentrality).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:10: * Minimal graph interface required by `computeGraphCentrality`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:39:export function computeStructuralFreshness(
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:62:export function computeGraphCentrality(
context compacted
codex
I’m working through the catalog sequentially and tightening the evidence so the final audit is complete, not just path-based. I’m pulling each feature’s `Current Reality` and source tables side by side with the referenced TypeScript files so we can classify accuracy feature-by-feature.
codex
The sandbox won’t allow here-doc temp files, so I’m switching to inline `python3 -c`/`rg` reads. I’ve already got the invalid-path inventory; now I’m filling in the remaining description-level mismatches and undocumented behaviors before I format the final blocks.
exec
/bin/zsh -lc 'python3 -c $'"'from pathlib import Path\\nimport re\\nbase=Path(\".opencode/skill/system-spec-kit/feature_catalog\")\\ncats=[\"15--retrieval-enhancements\",\"16--tooling-and-scripts\",\"17--governance\",\"18--ux-hooks\",\"19--decisions-and-deferrals\",\"20--feature-flag-reference\"]\\nfor cat in cats:\\n    print(f\"## {cat}\")\\n    for p in sorted((base/cat).glob(\"*.md\")):\\n        text=p.read_text()\\n        m=re.search(r\"## Current Reality\\\\n(.*?)(?:\\\\n## |\\\\Z)\", text, re.S)\\n        current=\" \".join(m.group(1).strip().split())[:260] if m else \"NO CURRENT REALITY\"\\n        paths=re.findall(r\""'`([''^`]+'"\\\\.(?:ts|md|sh|json|jsonc|yaml|yml))"'`", text)'"\\n        print(f\"- {p.name}\\\\n  Current: {current}\\\\n  Paths({len(paths)}): {paths[:12]}{\\\" ...\\\" if len(paths)>12 else \\\"\\\"}\")\\n    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'python3 -c $'"'from pathlib import Path\\nimport re\\nroot=Path(\".opencode/skill/system-spec-kit\")\\nbase=root/\"feature_catalog\"\\ncats=[\"15--retrieval-enhancements\",\"16--tooling-and-scripts\",\"17--governance\",\"18--ux-hooks\",\"19--decisions-and-deferrals\",\"20--feature-flag-reference\"]\\nfor cat in cats:\\n    print(f\"## {cat}\")\\n    for p in sorted((base/cat).glob(\"*.md\")):\\n        text=p.read_text()\\n        paths=[]\\n        for x in re.findall(r\""'`([''^`]+'"\\\\.(?:ts|sh|md|json|jsonc|yaml|yml))"'`", text):'"\\n            if x not in paths: paths.append(x)\\n        bad=[rel for rel in paths if not (root/rel).is_file()]\\n        print(f\"- {p.name}: INVALID={bad if bad else \\\"NONE\\\"}\")\\n    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 679ms:
  File "<string>", line 12
    print(f"- {p.name}\n  Current: {current}\n  Paths({len(paths)}): {paths[:12]}{" ..." if len(paths)>12 else ""}")
                                                                                    ^
SyntaxError: f-string: expecting '}'
 exited 1 in 679ms:
  File "<string>", line 14
    print(f"- {p.name}: INVALID={bad if bad else "NONE"}")
                                                  ^
SyntaxError: f-string: expecting '}'
codex
I’ve got the core code evidence; I’m using `node -e` instead of heredocs now because the sandbox’s temp-file restrictions are blocking the usual inline scripting path. Next pass is mostly about normalizing the remaining feature metadata so each block has concrete evidence and not just a path diff.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const path=require('path'); const base='.opencode/skill/system-spec-kit/feature_catalog'; const cats=['15--retrieval-enhancements','16--tooling-and-scripts','17--governance','18--ux-hooks','19--decisions-and-deferrals','20--feature-flag-reference']; for (const cat of cats){ console.log('## '+cat); for (const name of fs.readdirSync(path.join(base,cat)).filter(f=>f.endsWith('.md')).sort()){ const text=fs.readFileSync(path.join(base,cat,name),'utf8'); const m=text.match(/## Current Reality\\n([\\s\\S]*?)(?:\\n## |"'$)/); const current=m?m[1].trim().replace(/'"\\s+/g,' ').slice(0,260):'NO CURRENT REALITY'; const paths=[...text.matchAll(/"'`([''^`]+'"\\.(?:ts|md|sh|json|jsonc|yaml|yml))"'`/g)].map(m=>m[1]); console.log('"'- '+name); console.log('  Current: '+current); console.log('  Paths('+paths.length+'): '+JSON.stringify(paths.slice(0,12))+(paths.length>12?' ...':'')); } console.log(); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const fs=require('fs'); const path=require('path'); const root='.opencode/skill/system-spec-kit'; const base=path.join(root,'feature_catalog'); const cats=['15--retrieval-enhancements','16--tooling-and-scripts','17--governance','18--ux-hooks','19--decisions-and-deferrals','20--feature-flag-reference']; for (const cat of cats){ console.log('## '+cat); for (const name of fs.readdirSync(path.join(base,cat)).filter(f=>f.endsWith('.md')).sort()){ const text=fs.readFileSync(path.join(base,cat,name),'utf8'); const paths=[]; for (const m of text.matchAll(/"'`([''^`]+'"\\.(?:ts|md|sh|json|jsonc|yaml|yml))"'`/g)){ if (!paths.includes(m[1])) paths.push(m[1]); } const bad=paths.filter(rel=>!fs.existsSync(path.join(root,rel)) || !fs.statSync(path.join(root,rel)).isFile()); console.log('"'- '+name+': INVALID='+(bad.length?JSON.stringify(bad):'NONE')); } console.log(); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
zsh:1: unmatched "
 exited 1 in 52ms:
zsh:1: unmatched "
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const root=\".opencode/skill/system-spec-kit\"; const base=path.join(root,\"feature_catalog\"); const cats=[\"15--retrieval-enhancements\",\"16--tooling-and-scripts\",\"17--governance\",\"18--ux-hooks\",\"19--decisions-and-deferrals\",\"20--feature-flag-reference\"]; for (const cat of cats){ console.log(\"## \"+cat); for (const name of fs.readdirSync(path.join(base,cat)).filter(f=>f.endsWith(\".md\")).sort()){ const text=fs.readFileSync(path.join(base,cat,name),\"utf8\"); const paths=[]; for (const m of text.matchAll(/"'`([''^`]+'"\\.(?:ts|md|sh|json|jsonc|yaml|yml))"'`/g)){ if (!paths.includes(m[1])) paths.push(m[1]); } const bad=paths.filter(rel=>!fs.existsSync(path.join(root,rel)) || !fs.statSync(path.join(root,rel)).isFile()); console.log("- "+name+": INVALID="+(bad.length?JSON.stringify(bad):"NONE")); } console.log(); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const base=\".opencode/skill/system-spec-kit/feature_catalog\"; const cats=[\"15--retrieval-enhancements\",\"16--tooling-and-scripts\",\"17--governance\",\"18--ux-hooks\",\"19--decisions-and-deferrals\",\"20--feature-flag-reference\"]; for (const cat of cats){ console.log(\"## \"+cat); for (const name of fs.readdirSync(path.join(base,cat)).filter(f=>f.endsWith(\".md\")).sort()){ const text=fs.readFileSync(path.join(base,cat,name),\"utf8\"); const m=text.match(/## Current Reality\\n([\\s\\S]*?)(?:\\n## |"'$)/); const current=m?m[1].trim().replace(/'"\\s+/g,\" \").slice(0,260):\"NO CURRENT REALITY\"; const paths=[...text.matchAll(/"'`([''^`]+'"\\.(?:ts|md|sh|json|jsonc|yaml|yml))"'`/g)].map(m=>m[1]); console.log("- "+name); console.log("  Current: "+current); console.log("  Paths("+paths.length+"): "+JSON.stringify(paths.slice(0,12))+(paths.length>12?" ...":"")); } console.log(); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
## 15--retrieval-enhancements
- 01-dual-scope-memory-auto-surface.md: INVALID=["mcp_server/tests/retry.vitest.ts"]
- 02-constitutional-memory-as-expert-knowledge-injection.md: INVALID=["hooks/memory-surface.ts"]
- 03-spec-folder-hierarchy-as-retrieval-structure.md: INVALID=NONE
- 04-lightweight-consolidation.md: INVALID=NONE
- 05-memory-summary-search-channel.md: INVALID=["memory-summaries.ts"]
- 06-cross-document-entity-linking.md: INVALID=["entity-linker.ts"]
- 07-tier-2-fallback-channel-forcing.md: INVALID=NONE
- 08-provenance-rich-response-envelopes.md: INVALID=NONE
- 09-contextual-tree-injection.md: INVALID=["mcp_server/tests/retry.vitest.ts"]

## 16--tooling-and-scripts
- 01-tree-thinning-for-spec-folder-consolidation.md: INVALID=["workflow.ts"]
- 02-architecture-boundary-enforcement.md: INVALID=["check-architecture-boundaries.ts","mcp_server/lib/architecture/check-architecture-boundaries.ts"]
- 03-progressive-validation-for-spec-documents.md: INVALID=["progressive-validate.sh","validate.sh","scripts/progressive-validate.sh"]
- 04-dead-code-removal.md: INVALID=["hybrid-search.ts","shadow-scoring.ts","search-flags.ts","rsf-fusion.ts","learned-feedback.ts","fsrs.ts"]
- 05-code-standards-alignment.md: INVALID=NONE
- 06-real-time-filesystem-watching-with-chokidar.md: INVALID=["lib/ops/file-watcher.ts"]
- 07-standalone-admin-cli.md: INVALID=["cli.ts"]
- 08-watcher-delete-rename-cleanup.md: INVALID=["lib/ops/file-watcher.ts"]
 succeeded in 52ms:
## 15--retrieval-enhancements
- 01-dual-scope-memory-auto-surface.md
  Current: Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected). Each hook point has
  Paths(59): ["mcp_server/configs/cognitive.ts","mcp_server/core/config.ts","mcp_server/hooks/memory-surface.ts","mcp_server/lib/cache/embedding-cache.ts","mcp_server/lib/interfaces/vector-store.ts","mcp_server/lib/parsing/content-normalizer.ts","mcp_server/lib/parsing/trigger-matcher.ts","mcp_server/lib/providers/embeddings.ts","mcp_server/lib/scoring/interference-scoring.ts","mcp_server/lib/search/bm25-index.ts","mcp_server/lib/search/retrieval-directives.ts","mcp_server/lib/search/vector-index-aliases.ts"] ...
- 02-constitutional-memory-as-expert-knowledge-injection.md
  Current: Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality." Rule 
  Paths(3): ["hooks/memory-surface.ts","mcp_server/lib/search/retrieval-directives.ts","mcp_server/tests/retrieval-directives.vitest.ts"]
- 03-spec-folder-hierarchy-as-retrieval-structure.md
  Current: Spec folder paths from memory metadata are parsed into an in-memory hierarchy tree. The `buildHierarchyTree()` function performs two-pass construction: the first pass creates nodes from all distinct `spec_folder` values including implicit intermediate parents,
  Paths(2): ["mcp_server/lib/search/spec-folder-hierarchy.ts","mcp_server/tests/spec-folder-hierarchy.vitest.ts"]
- 04-lightweight-consolidation.md
  Current: Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) pl
  Paths(20): ["mcp_server/lib/cognitive/rollout-policy.ts","mcp_server/lib/parsing/content-normalizer.ts","mcp_server/lib/search/bm25-index.ts","mcp_server/lib/search/graph-search-fn.ts","mcp_server/lib/search/search-flags.ts","mcp_server/lib/search/search-types.ts","mcp_server/lib/search/spec-folder-hierarchy.ts","mcp_server/lib/storage/causal-edges.ts","mcp_server/lib/storage/consolidation.ts","mcp_server/tests/bm25-index.vitest.ts","mcp_server/tests/causal-edges-unit.vitest.ts","mcp_server/tests/causal-edges.vitest.ts"] ...
- 05-memory-summary-search-channel.md
  Current: Large memory files bury their key information in paragraphs of context. A 2,000-word implementation summary might contain three sentences that actually answer a retrieval query. Searching against the full content dilutes embedding similarity with irrelevant no
  Paths(9): ["memory-summaries.ts","mcp_server/lib/cognitive/rollout-policy.ts","mcp_server/lib/search/memory-summaries.ts","mcp_server/lib/search/search-flags.ts","mcp_server/lib/search/tfidf-summarizer.ts","mcp_server/tests/hybrid-search-flags.vitest.ts","mcp_server/tests/memory-summaries.vitest.ts","mcp_server/tests/rollout-policy.vitest.ts","mcp_server/tests/search-flags.vitest.ts"]
- 06-cross-document-entity-linking.md
  Current: Memories in different spec folders often discuss the same concepts without any explicit connection between them. A decision record in one folder mentions "embedding cache" and an implementation summary in another folder implements it, but the retrieval system 
  Paths(8): ["entity-linker.ts","mcp_server/lib/cognitive/rollout-policy.ts","mcp_server/lib/search/entity-linker.ts","mcp_server/lib/search/search-flags.ts","mcp_server/tests/entity-linker.vitest.ts","mcp_server/tests/hybrid-search-flags.vitest.ts","mcp_server/tests/rollout-policy.vitest.ts","mcp_server/tests/search-flags.vitest.ts"]
- 07-tier-2-fallback-channel-forcing.md
codex
I’ve reached the flag-reference batch now. Those files are more table-heavy than behavior-heavy, so I’m cross-checking whether the documented env vars are actually defined where the catalog says they are, and whether the defaults still match the code.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/04-4-memory-and-storage.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# 1. Search Pipeline Features (SPECKIT_*)

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `SPECKIT_ABLATION` | `false` | boolean | `lib/eval/eval-metrics.ts` | Activates the ablation study framework. Must be explicitly set to `'true'` to run controlled channel ablations via MCP; when `false`, the handler rejects `eval_run_ablation` calls with a disabled-flag error. |
| `SPECKIT_ARCHIVAL` | `true` | boolean | `lib/cognitive/archival-manager.ts` | Enables the archival manager which promotes DORMANT memories to the ARCHIVED state based on access patterns. Disable to keep all memories in active tiers. |
| `SPECKIT_AUTO_ENTITIES` | `true` | boolean | `lib/search/search-flags.ts` | Enables R10 automatic noun-phrase entity extraction at index time. Extracted entities feed the entity linking channel (S5). Requires `SPECKIT_ENTITY_LINKING` to create graph edges. |
| `SPECKIT_AUTO_RESUME` | `true` | boolean | `handlers/memory-context.ts` | In resume mode, automatically injects working-memory context items as `systemPromptContext` into the response. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | `lib/search/causal-boost.ts` | Enables causal-neighbor graph boosting. Top seed results (up to 25% of result set, capped at 5) walk the causal edge graph up to 2 hops, applying a per-hop boost capped at 0.05. Combined causal + session boost ceiling is 0.20. |
| `SPECKIT_CHANNEL_MIN_REP` | `true` | boolean | `lib/search/channel-representation.ts` | Sprint 3 Stage C: ensures every contributing search channel has at least one result in the top-k window. Results with a score below 0.005 are excluded from promotion regardless. |
| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | `lib/scoring/composite-scoring.ts` | Applies intent-classification-based decay scoring to composite scores. When disabled, classification signals do not reduce scores for mismatched intent types. |
| `SPECKIT_COACTIVATION` | `true` | boolean | `lib/cognitive/co-activation.ts` | Enables co-activation spreading in the hybrid search path and trigger-matcher cognitive pipeline. Top-5 results spread activation through the co-occurrence graph; related memories receive a boost scaled by `SPECKIT_COACTIVATION_STRENGTH`. |
| `SPECKIT_COACTIVATION_STRENGTH` | `0.25` | number | `lib/cognitive/co-activation.ts` | Configures the raw boost multiplier applied to co-activated memories in hot-path Stage 2 spreading. A separate fan-divisor helper exists in the co-activation module, but Stage 2 currently applies spread scores directly. |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | `'i'` | string | `configs/cognitive.ts` | Regex flags for the cognitive co-activation pattern matcher. Must match `/^[dgimsuvy]*$/`. Invalid flags cause a startup validation error. |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | `'\\b(memory\|context\|decision\|implementation\|bug)\\b'` | string | `configs/cognitive.ts` | Regex pattern used by the cognitive pipeline to detect co-activation-relevant content. Backreferences and nested quantifier groups are rejected for safety. Maximum length 256 characters. |
| `SPECKIT_COMMUNITY_DETECTION` | `true` | boolean | `lib/search/search-flags.ts` | Enables N2c BFS connected-component detection with Louvain escalation for large graphs. Injects community co-members alongside Stage 2 fusion results. |
| `SPECKIT_COMPLEXITY_ROUTER` | `true` | boolean | `lib/search/query-classifier.ts` | Sprint 3 Stage A: routes queries to channel subsets based on complexity tier. Simple queries use vector + FTS only; moderate adds BM25; complex uses all five channels. When disabled, all channels run for every query. |
| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | `lib/search/confidence-truncation.ts` | Sprint 3 Stage D: trims the low-confidence tail from fused results. A consecutive score gap exceeding 2× the median gap triggers truncation. Always returns at least 3 results. |
 succeeded in 52ms:
# 4. Memory and Storage

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MEMORY_ALLOWED_PATHS` | _(cwd)_ | string | `tests/regression-010-index-large-files.vitest.ts` | Colon-separated list of filesystem paths that are allowlisted for memory file access. Used in path security validation to restrict which directories `memory_save` can read from. Defaults to `cwd` if not set. |
| `MEMORY_BASE_PATH` | _(cwd)_ | string | `core/config.ts` | Base path prepended to relative file paths when resolving memory file locations. Defaults to `process.cwd()` when not set. Determines the root of the allowed path tree. |
| `MEMORY_DB_DIR` | _(legacy fallback)_ | string | `lib/search/vector-index-impl.ts` | Legacy fallback for the database directory. Superseded by `SPEC_KIT_DB_DIR`. Precedence order: `SPEC_KIT_DB_DIR` > `MEMORY_DB_DIR` > default `database/` directory adjacent to the server root. |
| `MEMORY_DB_PATH` | _(derived)_ | string | `lib/search/vector-index-impl.ts` | Full path to the SQLite database file. When set, overrides the derived path from `SPEC_KIT_DB_DIR` or `MEMORY_DB_DIR`. Use for pointing at a provider-specific or non-default database location. |
| `SPECKIT_DB_DIR` | _(fallback)_ | string | `shared/config.ts` | Fallback env var for the database directory, checked after `SPEC_KIT_DB_DIR`. Added in Phase 018 (CR-P1-8) to support the underscore-less naming convention. Precedence: `SPEC_KIT_DB_DIR` > `SPECKIT_DB_DIR` > default path. |
| `SPEC_KIT_BATCH_DELAY_MS` | `100` | number | `core/config.ts` | Delay in milliseconds between processing batches during `memory_index_scan`. Prevents exhausting I/O resources on large workspaces by introducing a small pause between embedding generation batches. |
| `SPEC_KIT_BATCH_SIZE` | `5` | number | `core/config.ts` | Number of files processed per batch during `memory_index_scan`. Lower values reduce peak memory usage and API concurrency at the cost of longer scan times. |
| `SPEC_KIT_DB_DIR` | _(server root)_ | string | `core/config.ts` | Directory where the SQLite database file is stored. Takes precedence over `MEMORY_DB_DIR`. Resolved relative to `process.cwd()` when set. Defaults to a `database/` directory adjacent to the server root. |

## Source Files

Source file references are included in the flag table above.

## Source Metadata
 succeeded in 52ms:
# 5. Embedding and API

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `COHERE_API_KEY` | _(none)_ | string | `tests/search-limits-scoring.vitest.ts` | API key for the Cohere reranker provider. When present, the cross-encoder reranker uses Cohere's rerank API. Falls back to local or Voyage reranker when absent. |
| `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-impl.ts` | Override for the embedding vector dimension. When set, bypasses the provider's reported dimension. Use when loading a custom model with a non-standard dimension. |
| `EMBEDDINGS_PROVIDER` | `'auto'` | string | `lib/providers/embeddings.ts` | Selects the embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, and `'voyage'`. In `'auto'` mode, the system selects based on available API keys (Voyage preferred over OpenAI, local fallback). |
| `OPENAI_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the OpenAI embeddings provider. Required when `EMBEDDINGS_PROVIDER` is `'openai'` or when `'auto'` mode selects OpenAI as the available provider. |
| `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTED (Sprint 019).** When set to `'true'` (strict string equality, not truthy), enables the local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient free memory (4GB default, 512MB with custom `SPECKIT_RERANKER_MODEL`). Sequential per-candidate inference; expect 200-400ms for top-20 on Apple Silicon (CHK-113). Falls back silently to algorithmic RRF scoring on any precondition failure. |
| `VOYAGE_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the Voyage AI embeddings and reranker provider. In `'auto'` mode, Voyage is preferred over OpenAI when this key is present. |

## Source Files

Source file references are included in the flag table above.

## Source Metadata

- Group: Feature Flag Reference
exec
/bin/zsh -lc "rg -n \"SPECKIT_ABLATION|SPECKIT_ARCHIVAL|SPECKIT_AUTO_ENTITIES|SPECKIT_AUTO_RESUME|SPECKIT_CAUSAL_BOOST|SPECKIT_CHANNEL_MIN_REP|SPECKIT_CLASSIFICATION_DECAY|SPECKIT_COACTIVATION|SPECKIT_COACTIVATION_STRENGTH|SPECKIT_COGNITIVE_COACTIVATION_FLAGS|SPECKIT_COGNITIVE_COACTIVATION_PATTERN|SPECKIT_COMMUNITY_DETECTION|SPECKIT_COMPLEXITY_ROUTER|SPECKIT_CONFIDENCE_TRUNCATION|SPECKIT_CONSOLIDATION|SPECKIT_CONSUMPTION_LOG|SPECKIT_CONTEXT_HEADERS|SPECKIT_CROSS_ENCODER|SPECKIT_DASHBOARD_LIMIT|SPECKIT_DEBUG_INDEX_SCAN|SPECKIT_DEGREE_BOOST|SPECKIT_DOCSCORE_AGGREGATION|SPECKIT_DYNAMIC_INIT|SPECKIT_DYNAMIC_TOKEN_BUDGET|SPECKIT_EAGER_WARMUP|SPECKIT_EMBEDDING_EXPANSION|SPECKIT_ENCODING_INTENT|SPECKIT_ENTITY_LINKING|SPECKIT_ENTITY_LINKING_MAX_DENSITY|SPECKIT_EVAL_LOGGING|SPECKIT_EVENT_DECAY|SPECKIT_EXTENDED_TELEMETRY|SPECKIT_EXTRACTION|SPECKIT_FILE_WATCHER|SPECKIT_FOLDER_DISCOVERY|SPECKIT_FOLDER_SCORING|SPECKIT_FOLDER_TOP_K|SPECKIT_GRAPH_SIGNALS|SPECKIT_GRAPH_UNIFIED|SPECKIT_INDEX_SPEC_DOCS|SPECKIT_INTERFERENCE_SCORE|SPECKIT_LAZY_LOADING|SPECKIT_LEARN_FROM_SELECTION|SPECKIT_MEMORY_SUMMARIES|SPECKIT_MMR|SPECKIT_MULTI_QUERY|SPECKIT_NEGATIVE_FEEDBACK|SPECKIT_NOVELTY_BOOST|SPECKIT_PIPELINE_V2|SPECKIT_PRESSURE_POLICY|SPECKIT_QUALITY_LOOP|SPECKIT_RECONSOLIDATION|SPECKIT_RELATIONS|SPECKIT_RESPONSE_TRACE|SPECKIT_ROLLOUT_PERCENT|SPECKIT_RRF|SPECKIT_RSF_FUSION|SPECKIT_SAVE_QUALITY_GATE|SPECKIT_SCORE_NORMALIZATION|SPECKIT_SEARCH_FALLBACK|SPECKIT_SESSION_BOOST|SPECKIT_SHADOW_SCORING|SPECKIT_SIGNAL_VOCAB|SPECKIT_SKIP_API_VALIDATION|SPECKIT_STRICT_SCHEMAS|SPECKIT_TRM|SPECKIT_WORKING_MEMORY\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"DISABLE_SESSION_DEDUP|BM25_ON_DEMAND|BM25_REBUILD_ON_BOOT|BM25_SEMANTIC_FALLBACK|TOOL_CACHE_TTL_MS|TOOL_CACHE_MAX_ENTRIES|TOOL_CACHE_DEBUG|MCP_ANCHOR_STRICT|MCP_ABORT_ON_PREFLIGHT|MCP_PREFLIGHT_WARN_ONLY|MCP_PREFLIGHT_JSON|MCP_PREFLIGHT_VERBOSE|MCP_PREFLIGHT_INCLUDE_EXAMPLES|MCP_PREFLIGHT_SUPPRESS_BANNER|MEMORY_ALLOWED_PATHS|MEMORY_BASE_PATH|MEMORY_DB_DIR|MEMORY_DB_PATH|SPECKIT_DB_DIR|SPEC_KIT_BATCH_DELAY_MS|SPEC_KIT_BATCH_SIZE|SPEC_KIT_DB_DIR|COHERE_API_KEY|EMBEDDING_DIM|EMBEDDINGS_PROVIDER|OPENAI_API_KEY|RERANKER_LOCAL|VOYAGE_API_KEY|DEBUG_TRIGGER_MATCHER|LOG_LEVEL|SPECKIT_EVAL_LOGGING|SPECKIT_DEBUG_INDEX_SCAN|SPECKIT_EXTENDED_TELEMETRY|SPECKIT_CONSUMPTION_LOG|BRANCH_NAME|COMMIT_SHA|COMMIT_DATE|CI\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:218:  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:700:  // Skip validation if SPECKIT_SKIP_API_VALIDATION=true (for testing/CI)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:701:  if (process.env.SPECKIT_SKIP_API_VALIDATION !== 'true') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:719:        console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:734:    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:739:  // Set SPECKIT_EAGER_WARMUP=true for legacy eager warmup behavior
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:779:    console.error('[context-server] Set SPECKIT_EAGER_WARMUP=true to restore eager warmup');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
.opencode/skill/system-spec-kit/mcp_server/README.md:710:| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0`                      | S5 density guard threshold for cross-document entity linking |
.opencode/skill/system-spec-kit/mcp_server/README.md:712:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
.opencode/skill/system-spec-kit/mcp_server/README.md:732:| `SPECKIT_RRF`                | `true`  | Enable RRF search fusion                                                              |
.opencode/skill/system-spec-kit/mcp_server/README.md:733:| `SPECKIT_MMR`                | `true`  | Enable MMR diversity reranking                                                        |
.opencode/skill/system-spec-kit/mcp_server/README.md:734:| `SPECKIT_TRM`                | `true`  | Enable Transparent Reasoning Module (evidence-gap detection)                          |
.opencode/skill/system-spec-kit/mcp_server/README.md:735:| `SPECKIT_MULTI_QUERY`        | `true`  | Enable multi-query expansion for deep-mode retrieval                                  |
.opencode/skill/system-spec-kit/mcp_server/README.md:736:| `SPECKIT_CROSS_ENCODER`      | `true`  | Enable cross-encoder reranking when a provider is configured (set `false` to disable) |
.opencode/skill/system-spec-kit/mcp_server/README.md:737:| `SPECKIT_RELATIONS`          | `true`  | Enable causal memory graph                                                            |
.opencode/skill/system-spec-kit/mcp_server/README.md:738:| `SPECKIT_INDEX_SPEC_DOCS`    | `true`  | Enable spec folder document indexing                                                  |
.opencode/skill/system-spec-kit/mcp_server/README.md:739:| `SPECKIT_EXTENDED_TELEMETRY` | `true`  | Enable 4-dimension retrieval telemetry                                                |
.opencode/skill/system-spec-kit/mcp_server/README.md:740:| `SPECKIT_CAUSAL_BOOST`       | `true`  | Enable 2-hop causal-neighbor score boost                                              |
.opencode/skill/system-spec-kit/mcp_server/README.md:741:| `SPECKIT_SESSION_BOOST`      | `true`  | Enable session-attention score boost                                                  |
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:700:  // Skip validation if SPECKIT_SKIP_API_VALIDATION=true (for testing/CI)
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md:32:**Path resolution:** `shared/config.ts` resolves this directory by walking up from `__dirname` to find `mcp_server/database/`. The path can be overridden with the `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR` environment variable.
.opencode/skill/system-spec-kit/shared/types.ts:386:    DECISION_TERM: number;
.opencode/skill/system-spec-kit/shared/config.ts:10:  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
.opencode/skill/system-spec-kit/shared/index.ts:110:  EMBEDDING_DIM,
.opencode/skill/system-spec-kit/shared/README.md:325:| `VOYAGE_API_KEY`          | No       | -                                | Voyage AI API key (recommended) |
.opencode/skill/system-spec-kit/shared/README.md:326:| `OPENAI_API_KEY`          | No       | -                                | OpenAI API key                  |
.opencode/skill/system-spec-kit/shared/README.md:327:| `EMBEDDINGS_PROVIDER`     | No       | `auto`                           | Force specific provider         |
.opencode/skill/system-spec-kit/shared/README.md:333:1. Explicit `EMBEDDINGS_PROVIDER` (if not `auto`)
.opencode/skill/system-spec-kit/shared/README.md:334:2. Auto-detection: Voyage if `VOYAGE_API_KEY` exists (recommended)
.opencode/skill/system-spec-kit/shared/README.md:335:3. Auto-detection: OpenAI if `OPENAI_API_KEY` exists
.opencode/skill/system-spec-kit/shared/README.md:502:| Provider not detected | Check `echo $VOYAGE_API_KEY` or `echo $OPENAI_API_KEY` |
.opencode/skill/system-spec-kit/shared/README.md:503:| Wrong provider        | Set `EMBEDDINGS_PROVIDER` explicitly                   |
.opencode/skill/system-spec-kit/shared/README.md:511:echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
.opencode/skill/system-spec-kit/shared/README.md:512:echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
.opencode/skill/system-spec-kit/shared/README.md:513:echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"
.opencode/skill/system-spec-kit/shared/embeddings.ts:377:// 4. TASK-SPECIFIC FUNCTIONS
.opencode/skill/system-spec-kit/shared/embeddings.ts:468:  const provider = process.env.EMBEDDINGS_PROVIDER?.toLowerCase();
.opencode/skill/system-spec-kit/shared/embeddings.ts:472:  if (process.env.VOYAGE_API_KEY && !process.env.OPENAI_API_KEY) return 1024;
.opencode/skill/system-spec-kit/shared/embeddings.ts:473:  if (process.env.OPENAI_API_KEY && !process.env.VOYAGE_API_KEY) return 1536;
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Consumption Logger (T004 — Agent UX Instrumentation)
// ---------------------------------------------------------------
// Logs agent consumption events to a SQLite table for G-NEW-2
// requirement analysis: what agents query, what results they get,
// and (via hooks) which results they actually use.
//
// Table: consumption_log
// Feature flag: SPECKIT_CONSUMPTION_LOG (default true)
// ---------------------------------------------------------------

import Database from 'better-sqlite3';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/**
 * Defines the ConsumptionEventType type.
 */
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Retrieval Telemetry (C136-12)
// ---------------------------------------------------------------
// AI-WHY: Captures latency, mode selection, fallback, and quality-proxy
// dimensions for governance review and Wave 2 gate decisions.
// Feature flag: SPECKIT_EXTENDED_TELEMETRY (default false / disabled)
// ---------------------------------------------------------------

import {
  sanitizeRetrievalTracePayload,
} from './trace-schema';
import type {
  TelemetryTracePayload,
} from './trace-schema';

/* ---------------------------------------------------------------
   1. FEATURE FLAG
--------------------------------------------------------------- */

/**
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
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/embeddings/factory.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/mcp_server/core/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Factory
// ---------------------------------------------------------------

import { HfLocalProvider } from './providers/hf-local';
import { OpenAIProvider } from './providers/openai';
import { VoyageProvider } from './providers/voyage';
import type {
  IEmbeddingProvider,
  ProviderResolution,
  ProviderInfo,
  CreateProviderOptions,
  ApiKeyValidationResult,
} from '../types';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isAbortError(error: unknown): boolean {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Local Reranker
// ---------------------------------------------------------------
// AI-WHY: Optional local reranker for Stage 3. This module is fully gated by
// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
// precondition or runtime failure.
//
// TODO(CHK-069): Document eval comparison — local GGUF MRR@5 vs remote Cohere/Voyage MRR@5.
// Deferred: requires eval infrastructure with ground truth queries and remote API access.

import os from 'os';
import path from 'path';
import { access } from 'fs/promises';
import { toErrorMessage } from '../../utils';

interface NodeLlamaCppModule {
  getLlama: () => Promise<unknown>;
}

type LocalRerankRow = Record<string, unknown> & {
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

import path from 'path';
import os from 'os';
import { COGNITIVE_CONFIG as LOADED_COGNITIVE_CONFIG } from '../configs/cognitive';
import { DB_UPDATED_FILE as SHARED_DB_UPDATED_FILE } from '@spec-kit/shared/config';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Input validation limits configuration */
export interface InputLimitsConfig {
  query: number;
  title: number;
  specFolder: number;
  contextType: number;
  name: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Preflight
// ---------------------------------------------------------------

import crypto from 'crypto';
import { CHUNKING_THRESHOLD } from '../chunking/anchor-chunker';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Preflight error code identifiers */
export interface PreflightErrorCodes {
  ANCHOR_FORMAT_INVALID: string;
  ANCHOR_UNCLOSED: string;
  ANCHOR_ID_INVALID: string;
  DUPLICATE_DETECTED: string;
  DUPLICATE_EXACT: string;
  DUPLICATE_SIMILAR: string;
  TOKEN_BUDGET_EXCEEDED: string;
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/shared/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

/** Get db dir. */
export function getDbDir(): string | undefined {
  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
}

function findUp(filename: string, startDir: string): string | undefined {
  let dir = startDir;
  while (true) {
    if (fs.existsSync(path.join(dir, filename))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Session Manager
// ---------------------------------------------------------------

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
// AI-TRACE T302: Import working-memory for immediate cleanup on session end (GAP 2).
import * as workingMemory from '../cache/cognitive/working-memory';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface SessionConfig {
  sessionTtlMinutes: number;
  maxEntriesPerSession: number;
  enabled: boolean;
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Checkpoints
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LIB MODULE IMPORTS
--------------------------------------------------------------- */

import * as checkpoints from '../lib/storage/checkpoints';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import { executeAutoPromotion } from '../lib/search/auto-promotion';
import { recordSelection } from '../lib/search/learned-feedback';
import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
import { checkDatabaseUpdated } from '../core';
import { requireDb, toErrorMessage } from '../utils';

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Tool Cache
// ---------------------------------------------------------------

import crypto from 'crypto';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface ToolCacheConfig {
  enabled: boolean;
  defaultTtlMs: number;
  maxEntries: number;
  cleanupIntervalMs: number;
}

interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number;
exec
/bin/zsh -lc 'rg -n "confirmName|safetyConfirmationUsed|confirm_name" .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts .opencode/skill/system-spec-kit/mcp_server/handlers/types.ts .opencode/skill/system-spec-kit/shared/types.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"postMutationHooks|caches were left unchanged|appendAutoSurfaceHints|tokenCount|autoSurfacedContext|autoRepair|repair|hooks/README|hooks/index|toolCacheInvalidated\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/hooks .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/formatters .opencode/skill/system-spec-kit/shared | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:232:  confirmName: z.string().min(1),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:368:  checkpoint_delete: ['name', 'confirmName'],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:49:  confirmName?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:135:      `Delete with: checkpoint_delete({ name: "${name}", confirmName: "${name}" })`
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277:  const { name, confirmName } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:282:  if (!confirmName || typeof confirmName !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:283:    throw new Error('confirmName is required and must be a string');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:285:  if (confirmName !== name) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:286:    throw new Error('confirmName must exactly match name to delete checkpoint');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:300:      safetyConfirmationUsed: true,
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:50:  appendAutoSurfaceHints,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:280:    let autoSurfacedContext: AutoSurfaceResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:290:            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:292:            autoSurfacedContext = await autoSurfaceMemories(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:301:        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:329:    if (autoSurfacedContext && result && !result.isError) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:330:      appendAutoSurfaceHints(result, autoSurfacedContext);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:331:      result.autoSurfacedContext = autoSurfacedContext;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:353:          if (typeof meta.tokenCount === 'number' && meta.tokenCount > budget) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:354:            console.error(`[token-budget] ${name} response (${meta.tokenCount} tokens) exceeds budget (${budget})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:367:                if (typeof meta.tokenCount === 'number' && meta.tokenCount <= budget) break;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:381:                envelope.hints.push(`Response exceeds token budget (${meta.tokenCount}/${budget})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:49:  autoRepair?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:88:  toolCacheInvalidated: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:33:  const currentTokenCount = meta.tokenCount;
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:42:    meta.tokenCount = nextTokenCount;
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:49:  return typeof meta.tokenCount === 'number' ? meta.tokenCount : 0;
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:60:function appendAutoSurfaceHints(result: HookResult, autoSurfacedContext: AutoSurfacedContext): void {
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:79:    const constitutionalCount = Array.isArray(autoSurfacedContext?.constitutional)
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:80:      ? autoSurfacedContext.constitutional.length
codex
I’ve verified the UX-hook cluster: the code now clearly exposes the richer mutation metadata, exact checkpoint-delete confirmation, auto-repair reporting, and the final-token recompute path. I’m doing one more evidence sweep through the decisions/deferrals and flag-reference docs so the remaining `PARTIAL` vs `INACCURATE` calls are grounded in actual module behavior.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Graph Signals
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import type Database from 'better-sqlite3';

// ---------------------------------------------------------------------------
// 2. SESSION CACHE
// ---------------------------------------------------------------------------

/** Maximum number of entries allowed in each session-scoped cache. */
const CACHE_MAX_SIZE = 10000;

/** Session-scoped cache for momentum scores (memoryId -> momentum). */
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Entity Linker
// ---------------------------------------------------------------
// Gated via SPECKIT_ENTITY_LINKING
// Creates causal edges between memories sharing entities across spec folders.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isEntityLinkingEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------------------------

/** Maximum causal edges per node to prevent graph density explosion. */
const MAX_EDGES_PER_NODE = 20;

/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
const DEFAULT_MAX_EDGE_DENSITY = 1.0;

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Summaries
// ---------------------------------------------------------------
// Gated via SPECKIT_MEMORY_SUMMARIES

import type Database from 'better-sqlite3';
import { generateSummary } from './tfidf-summarizer';
import { isMemorySummariesEnabled } from './search-flags';

// ---------------------------------------------------------------------------
// 1. INTERFACES
// ---------------------------------------------------------------------------

interface SummarySearchResult {
  id: number;
  memoryId: number;
  similarity: number;
}

// ---------------------------------------------------------------------------
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Community Detection
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import type Database from "better-sqlite3";

// ---------------------------------------------------------------------------
// 2. TYPES
// ---------------------------------------------------------------------------

/** Adjacency list: node ID (string) -> set of neighbor node IDs */
type AdjacencyList = Map<string, Set<string>>;

// ---------------------------------------------------------------------------
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Entity Extractor
// ---------------------------------------------------------------
// Deferred feature — gated via SPECKIT_AUTO_ENTITIES
// Pure-TS rule-based extraction, zero npm dependencies.
// ---------------------------------------------------------------

import { isEntityDenied } from './entity-denylist.js';
import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker.js';

import type Database from 'better-sqlite3';

// AI-WHY: Re-export canonical versions from entity-linker for backward compatibility
export { normalizeEntityName, computeEdgeDensity };

// ---------------------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------------------

/** A single entity extracted from memory content. */
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "generateAndStoreSummary|createEntityLinks|extractEntities|updateEntityCatalog|storeEntities|querySummaryEmbeddings|checkScaleGate" .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Post Insert
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser';

import * as embeddings from '../../lib/providers/embeddings';
import { processCausalLinks } from '../causal-links-processor';
import {
  isAutoEntitiesEnabled,
  isMemorySummariesEnabled,
  isEntityLinkingEnabled,
} from '../../lib/search/search-flags';
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
import { runEntityLinking } from '../../lib/search/entity-linker';
import { toErrorMessage } from '../../utils';

interface CausalLinksResult {
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:44:import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:      if (checkScaleGate(db)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:521:          const summaryResults = querySummaryEmbeddings(db, summaryEmbedding, limit);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:15:import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:16:import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:70:      const rawEntities = extractEntities(parsed.content);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:73:        const entityResult = storeEntities(database, id, filtered);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:74:        updateEntityCatalog(database, filtered);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:86:      const summaryResult = await generateAndStoreSummary(
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"architecture|layer-definitions|compatibility wrapper|wrapper\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: File Watcher
// ---------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

/**
 * Describes the WatcherConfig shape.
 */
export interface WatcherConfig {
  paths: string[];
  reindexFn: (filePath: string) => Promise<unknown>;
  removeFn?: (filePath: string) => Promise<unknown>;
  debounceMs?: number;
}

/**
 * Describes the FSWatcher shape.
 succeeded in 51ms:
#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Cli
// ---------------------------------------------------------------
// Standalone CLI for bulk database operations, runnable from any
// directory. Resolves its own modules via __dirname so
// better-sqlite3 and sqlite-vec load correctly regardless of cwd.
//
// Usage:
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js stats
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js bulk-delete --tier deprecated
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force] [--eager-warmup]
//   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js schema-downgrade --to 15 --confirm
// ---------------------------------------------------------------

// Core modules (resolved relative to this file's location)
import * as vectorIndex from './lib/search/vector-index';
import * as checkpointsLib from './lib/storage/checkpoints';
import * as accessTracker from './lib/storage/access-tracker';
import * as causalEdges from './lib/storage/causal-edges';
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:56:import { getTokenBudget } from './lib/architecture/layer-definitions';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:405: * achievable under this architecture.
.opencode/skill/system-spec-kit/mcp_server/README.md:24:- [3. ARCHITECTURE](#3--architecture)
.opencode/skill/system-spec-kit/mcp_server/README.md:48:Your AI assistant has amnesia. Every conversation starts fresh. You explain your architecture Monday, by Wednesday it is a blank slate. Context disappears. Decisions vanish. That auth system you documented? Gone.
.opencode/skill/system-spec-kit/mcp_server/README.md:174:<!-- ANCHOR:architecture -->
.opencode/skill/system-spec-kit/mcp_server/README.md:224:| `tools/`      | Tool registration wrappers per category                                |
.opencode/skill/system-spec-kit/mcp_server/README.md:231:<!-- /ANCHOR:architecture -->
.opencode/skill/system-spec-kit/mcp_server/README.md:502:The search subsystem uses a 4-stage pipeline (candidate generation, fusion + signal enrichment, reranking + aggregation, filtering + annotation). Each stage has bounded score mutation rules and an immutability invariant on upstream scores. See `lib/search/README.md` for detailed architecture and per-stage module mapping.
.opencode/skill/system-spec-kit/mcp_server/README.md:650:│   ├── architecture/       # Layer definitions and tool-to-layer mapping
.opencode/skill/system-spec-kit/mcp_server/README.md:673:├── tools/                  # Tool registration wrappers
.opencode/skill/system-spec-kit/mcp_server/README.md:1198:| `lib/architecture/layer-definitions.ts`  | 7-layer tool architecture and token budgets      |
.opencode/skill/system-spec-kit/scripts/README.md:63:- `templates/` - wrapper/composition helpers for template packaging workflows
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:165:  const criticalPaths = ['/architecture/', '/core/', '/schema/', '/security/', '/config/'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:15:// Sprint 5 (R6): 4-stage pipeline architecture
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:762:  // AI-TRACE:T012-T015: Use cache wrapper for search execution
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:8:import * as layerDefs from '../lib/architecture/layer-definitions';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:66:    // AI-WHY: T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:130:  // AI-WHY: T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:30:      "calledBy": ["Developer", "Maintenance", "Compatibility wrapper"],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:258:  triggerPhrases: ['architecture', 'sqlite'],
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/scripts | rg 'progressive-validate|validate\\.sh"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Anchor Chunker
// ---------------------------------------------------------------
// Splits large memory files into chunks using ANCHOR tags as
// natural boundaries. Falls back to structure-aware markdown
// splitting when anchors are absent.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/**
 * Describes the AnchorChunk shape.
 */
export interface AnchorChunk {
  /** The text content of this chunk */
  content: string;
  /** Anchor IDs covered by this chunk (empty for fallback chunks) */
  anchorIds: string[];
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Chunk Thinning
// ---------------------------------------------------------------
// Scores chunks by anchor presence + content density, then
// applies a thinning threshold to drop low-quality chunks.
// Used BEFORE indexing to filter out low-value chunks.
// ---------------------------------------------------------------

import type { AnchorChunk } from './anchor-chunker';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/**
 * Describes the ChunkScore shape.
 */
export interface ChunkScore {
  chunk: AnchorChunk;
  score: number;        // 0-1 composite score
 succeeded in 51ms:
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: PROGRESSIVE VALIDATE
# ───────────────────────────────────────────────────────────────
# Progressive validation pipeline for spec documents.
# Wraps validate.sh with a 4-level pipeline:
#   Level 1 - Detect  : Identify all violations (same as validate.sh)
#   Level 2 - Auto-fix: Apply safe mechanical corrections with diff log
#   Level 3 - Suggest : Present non-automatable issues with guidance
#   Level 4 - Report  : Produce structured output with before/after diffs
#
# USAGE:
#   ./progressive-validate.sh <folder-path> [OPTIONS]
#
# OPTIONS:
#   --level N     Run pipeline up to level N (1-4, default: 4)
#   --dry-run     Show what would be changed without applying fixes
#   --json        Structured JSON output
#   --strict      Treat warnings as errors
#   --quiet, -q   Minimal output
 succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh
.opencode/skill/system-spec-kit/scripts/spec/validate.sh
exec
/bin/zsh -lc "sed -n '120,190p' .opencode/skill/system-spec-kit/shared/embeddings.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"isPipelineV2Enabled|isFileWatcherEnabled|isLocalRerankerEnabled|SPECKIT_EXTENDED_TELEMETRY|SPECKIT_CONSUMPTION_LOG|SPECKIT_LAZY_LOADING|SPECKIT_DYNAMIC_INIT|SPECKIT_EAGER_WARMUP|SPECKIT_SKIP_API_VALIDATION\" .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/mcp_server | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------

/**
 * LAZY SINGLETON PATTERN (REQ-003, T016-T019)
 *
 * The embedding provider is initialized lazily on first use to reduce
 * MCP startup time from 2-3s to <500ms.
 *
 * Initialization Flow:
 * 1. On first embedding request, get_provider() creates the instance
 * 2. Provider is created without warmup (warmup: false)
 * 3. First actual embedding call triggers model loading
 *
 * Environment Variables:
 * - SPECKIT_EAGER_WARMUP=true: Force eager loading at startup (legacy behavior)
 * - SPECKIT_LAZY_LOADING=false: Alias for SPECKIT_EAGER_WARMUP=true
 */

let providerInstance: IEmbeddingProvider | null = null;
let providerInitPromise: Promise<IEmbeddingProvider> | null = null;
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:74:import { isDegreeBoostEnabled, isFileWatcherEnabled } from './lib/search/search-flags';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:218:  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:700:  // Skip validation if SPECKIT_SKIP_API_VALIDATION=true (for testing/CI)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:701:  if (process.env.SPECKIT_SKIP_API_VALIDATION !== 'true') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:719:        console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:734:    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:739:  // Set SPECKIT_EAGER_WARMUP=true for legacy eager warmup behavior
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:779:    console.error('[context-server] Set SPECKIT_EAGER_WARMUP=true to restore eager warmup');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:956:    if (isFileWatcherEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:323:| `SPECKIT_EXTENDED_TELEMETRY` | `true` | Controls 4-dimension per-retrieval telemetry. Set to `false` to disable metrics collection. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:340:        "SPECKIT_EXTENDED_TELEMETRY": "true"
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:556:**Flag:** `SPECKIT_EXTENDED_TELEMETRY` (default: on)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:564:Disable by setting `SPECKIT_EXTENDED_TELEMETRY: "false"`.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:898:  SPECKIT_EXTENDED_TELEMETRY default: true (false = disable metrics)
.opencode/skill/system-spec-kit/mcp_server/README.md:739:| `SPECKIT_EXTENDED_TELEMETRY` | `true`  | Enable 4-dimension retrieval telemetry                                                |
.opencode/skill/system-spec-kit/mcp_server/README.md:763:| `SPECKIT_DYNAMIC_INIT`          | `true`  | Inject dynamic startup instructions with live memory/index counts |
.opencode/skill/system-spec-kit/shared/embeddings.ts:134: * - SPECKIT_EAGER_WARMUP=true: Force eager loading at startup (legacy behavior)
.opencode/skill/system-spec-kit/shared/embeddings.ts:135: * - SPECKIT_LAZY_LOADING=false: Alias for SPECKIT_EAGER_WARMUP=true
.opencode/skill/system-spec-kit/shared/embeddings.ts:147: * SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING env vars are inert.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"EMBEDDING_DIM|COHERE_API_KEY|RERANKER_LOCAL|VOYAGE_API_KEY|OPENAI_API_KEY|EMBEDDINGS_PROVIDER\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
// Central export surface for all shared modules.
// Re-exports types, utilities, embeddings, scoring, and chunking.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. TYPE DEFINITIONS
// ---------------------------------------------------------------
export type {
  // DB normalization types (Phase 6A)
  MemoryDbRow,
  Memory,
  // Database interface types (canonical)
  PreparedStatement,
  Database,
  DatabaseExtended,
  // Embedding types
  EmbeddingProfileData,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/embeddings.ts:468:  const provider = process.env.EMBEDDINGS_PROVIDER?.toLowerCase();
.opencode/skill/system-spec-kit/shared/embeddings.ts:472:  if (process.env.VOYAGE_API_KEY && !process.env.OPENAI_API_KEY) return 1024;
.opencode/skill/system-spec-kit/shared/embeddings.ts:473:  if (process.env.OPENAI_API_KEY && !process.env.VOYAGE_API_KEY) return 1536;
.opencode/skill/system-spec-kit/shared/embeddings.ts:570:const EMBEDDING_DIM: number = 768;
.opencode/skill/system-spec-kit/shared/embeddings.ts:622:  EMBEDDING_DIM,
.opencode/skill/system-spec-kit/shared/index.ts:110:  EMBEDDING_DIM,
.opencode/skill/system-spec-kit/shared/README.md:325:| `VOYAGE_API_KEY`          | No       | -                                | Voyage AI API key (recommended) |
.opencode/skill/system-spec-kit/shared/README.md:326:| `OPENAI_API_KEY`          | No       | -                                | OpenAI API key                  |
.opencode/skill/system-spec-kit/shared/README.md:327:| `EMBEDDINGS_PROVIDER`     | No       | `auto`                           | Force specific provider         |
.opencode/skill/system-spec-kit/shared/README.md:333:1. Explicit `EMBEDDINGS_PROVIDER` (if not `auto`)
.opencode/skill/system-spec-kit/shared/README.md:334:2. Auto-detection: Voyage if `VOYAGE_API_KEY` exists (recommended)
.opencode/skill/system-spec-kit/shared/README.md:335:3. Auto-detection: OpenAI if `OPENAI_API_KEY` exists
.opencode/skill/system-spec-kit/shared/README.md:502:| Provider not detected | Check `echo $VOYAGE_API_KEY` or `echo $OPENAI_API_KEY` |
.opencode/skill/system-spec-kit/shared/README.md:503:| Wrong provider        | Set `EMBEDDINGS_PROVIDER` explicitly                   |
.opencode/skill/system-spec-kit/shared/README.md:511:echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
.opencode/skill/system-spec-kit/shared/README.md:512:echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
.opencode/skill/system-spec-kit/shared/README.md:513:echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:16:  'EMBEDDINGS_PROVIDER',
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:17:  'VOYAGE_API_KEY',
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:18:  'OPENAI_API_KEY',
exec
/bin/zsh -lc "rg -n \"COHERE_API_KEY|RERANKER_LOCAL|VOYAGE_API_KEY|OPENAI_API_KEY\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/shared | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"process\\.env\\.EMBEDDING_DIM|EMBEDDING_DIM\\s*=\\s*parse|EMBEDDING_DIM\\s*\\|\\|\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:834:      // P1-5: Optional local GGUF reranking path (RERANKER_LOCAL=true).
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:135:    if (process.env.VOYAGE_API_KEY || process.env.EMBEDDINGS_PROVIDER === 'voyage') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:138:    if (process.env.OPENAI_API_KEY || process.env.EMBEDDINGS_PROVIDER === 'openai') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:508:// 1. VOYAGE_API_KEY -> Voyage rerank-2
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:509:// 2. COHERE_API_KEY -> Cohere v3.5
.opencode/skill/system-spec-kit/shared/embeddings.ts:472:  if (process.env.VOYAGE_API_KEY && !process.env.OPENAI_API_KEY) return 1024;
.opencode/skill/system-spec-kit/shared/embeddings.ts:473:  if (process.env.OPENAI_API_KEY && !process.env.VOYAGE_API_KEY) return 1536;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:41:    apiKeyEnv: 'VOYAGE_API_KEY',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:49:    apiKeyEnv: 'COHERE_API_KEY',
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:182:  if (process.env.VOYAGE_API_KEY) return 'voyage';
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:183:  if (process.env.COHERE_API_KEY) return 'cohere';
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:184:  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() === 'true') return 'local';
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:238:  if (!apiKey) throw new Error('VOYAGE_API_KEY not set');
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:280:  if (!apiKey) throw new Error('COHERE_API_KEY not set');
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:5:// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:181:  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() !== 'true') {
.opencode/skill/system-spec-kit/shared/README.md:325:| `VOYAGE_API_KEY`          | No       | -                                | Voyage AI API key (recommended) |
.opencode/skill/system-spec-kit/shared/README.md:326:| `OPENAI_API_KEY`          | No       | -                                | OpenAI API key                  |
.opencode/skill/system-spec-kit/shared/README.md:334:2. Auto-detection: Voyage if `VOYAGE_API_KEY` exists (recommended)
.opencode/skill/system-spec-kit/shared/README.md:335:3. Auto-detection: OpenAI if `OPENAI_API_KEY` exists
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:156:    if (dim !== 768 || process.env.EMBEDDING_DIM === '768') {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '120,190p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
/**
 * Gets the active embedding dimension for the current provider.
 * @returns The embedding dimension.
 */
export function get_embedding_dim(): number {
  try {
    const embeddings = embeddingsProvider;

    if (embeddings.isProviderInitialized && embeddings.isProviderInitialized()) {
      const profile = embeddings.getEmbeddingProfile();
      if (profile && profile.dim) {
        return profile.dim;
      }
    }

    if (process.env.VOYAGE_API_KEY || process.env.EMBEDDINGS_PROVIDER === 'voyage') {
      return 1024;
    }
    if (process.env.OPENAI_API_KEY || process.env.EMBEDDINGS_PROVIDER === 'openai') {
      return 1536;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Cross Encoder
// ---------------------------------------------------------------
//
// Neural reranking via external APIs (Voyage rerank-2, Cohere
// rerank-english-v3.0) or a local cross-encoder model
// (ms-marco-MiniLM-L-6-v2). When no provider is configured the
// module returns a positional fallback (scored 0–0.5) and marks
// results with scoringMethod:'fallback' so callers can distinguish
// real model scores from synthetic ones.
//
// T204 / OQ-02 DECISION (2026-02-10):
//   The filename "cross-encoder.ts" is ACCURATE.  All three
//   providers invoke real ML-based reranking — either cloud APIs
//   that run neural rerankers server-side (Voyage, Cohere) or a
//   local cross-encoder model.  The positional fallback is NOT a
//   cross-encoder, but is already clearly separated via the
//   scoringMethod discriminator.  No rename required.
// ---------------------------------------------------------------

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/02-2-session-and-cache.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/06-6-debug-and-telemetry.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/07-7-ci-and-build-informational.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/03-3-mcp-configuration.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# 2. Session and Cache

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DISABLE_SESSION_DEDUP` | `false` | boolean | `lib/session/session-manager.ts` | When `'true'`, disables cross-turn session deduplication entirely. All memories are returned on every call regardless of whether they were already sent in this session. |
| `ENABLE_BM25` | `true` | boolean | `lib/search/bm25-index.ts` | Controls the in-memory BM25 search channel. When disabled (set to `'false'`), the BM25 channel is excluded from multi-channel retrieval. The FTS5 SQLite channel is unaffected. |
| `ENABLE_TOOL_CACHE` | `true` | boolean | `lib/cache/tool-cache.ts` | Master switch for the tool result cache. When disabled (set to `'false'`), all cache reads return `null` and writes are no-ops. Cache is always bypassed when this is off. |
| `SESSION_DEDUP_DB_UNAVAILABLE_MODE` | `'block'` | string | `lib/session/session-manager.ts` | Behavior when the session database is unavailable. `'allow'` permits all memories through (no dedup). `'block'` (default) rejects dedup attempts, returning an error rather than silently allowing duplicates. |
| `SESSION_MAX_ENTRIES` | `100` | number | `lib/session/session-manager.ts` | Maximum number of memory entries tracked per session for deduplication purposes. Entries beyond this cap are not tracked (but also not re-sent unless they fall outside the cap). |
| `SESSION_TTL_MINUTES` | `30` | number | `lib/session/session-manager.ts` | How long session deduplication records are retained after last use, in minutes. Sessions older than this are cleaned up on the next periodic maintenance pass. |
| `STALE_CLEANUP_INTERVAL_MS` | `3600000` | number | `lib/session/session-manager.ts` | Interval in milliseconds between stale session cleanup sweeps. Default is 1 hour (3,600,000 ms). Stale sessions are those whose last activity exceeds `STALE_SESSION_THRESHOLD_MS`. |
| `STALE_SESSION_THRESHOLD_MS` | `86400000` | number | `lib/session/session-manager.ts` | Age in milliseconds at which a session is considered stale and eligible for cleanup. Default is 24 hours (86,400,000 ms). |
| `TOOL_CACHE_CLEANUP_INTERVAL_MS` | `30000` | number | `lib/cache/tool-cache.ts` | Interval in milliseconds between expired-entry eviction sweeps of the tool cache. Default is 30 seconds (30,000 ms). The interval timer is unrefed so it does not prevent process exit. |
| `TOOL_CACHE_MAX_ENTRIES` | `1000` | number | `lib/cache/tool-cache.ts` | Maximum number of entries the tool cache holds before evicting the oldest entry on insert. Eviction is O(1) using insertion-order iteration over the underlying Map. |
| `TOOL_CACHE_TTL_MS` | `60000` | number | `lib/cache/tool-cache.ts` | Default time-to-live in milliseconds for tool cache entries. After this duration, entries are treated as expired and evicted on next access or cleanup sweep. Default is 60 seconds (60,000 ms). |

## Source Files

 succeeded in 52ms:
# 6. Debug and Telemetry

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DEBUG_TRIGGER_MATCHER` | _(unset)_ | string | `lib/parsing/trigger-matcher.ts` | When set to any non-empty value, emits debug-level output for trigger phrase matching operations. Useful for diagnosing why a particular memory is or is not matching a given prompt. |
| `LOG_LEVEL` | `'info'` | string | `lib/utils/logger.ts` | Minimum log severity level. Messages below this level are suppressed. Valid values: `'debug'`, `'info'`, `'warn'`, `'error'`. All log output goes to stderr (stdout is reserved for JSON-RPC). |
| `SPECKIT_EVAL_LOGGING` | `false` | boolean | `lib/eval/eval-logger.ts` | (Also listed under Search Pipeline.) Enables writes to the eval database during retrieval operations. Must be explicitly `'true'`. See category 1 for full description. |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | `handlers/memory-index.ts` | (Also listed under Search Pipeline.) Enables verbose file-count diagnostics during index scans. Must be explicitly `'true'`. See category 1 for full description. |
| `SPECKIT_EXTENDED_TELEMETRY` | inert | boolean | `lib/telemetry/retrieval-telemetry.ts` | (Also listed under Search Pipeline.) Deprecated and inert. See category 1 for full description. |
| `SPECKIT_CONSUMPTION_LOG` | inert | boolean | `lib/telemetry/consumption-logger.ts` | (Also listed under Search Pipeline.) Deprecated and inert. See category 1 for full description. |

## Source Files

Source file references are included in the flag table above.

## Source Metadata

- Group: Feature Flag Reference
 succeeded in 50ms:
# 7. CI and Build (informational)

## Current Reality

These variables are read at runtime to annotate checkpoint and evaluation records with source-control context. They are not feature flags and have no effect on search or storage behavior.

| Name | Source | Description |
|---|---|---|
| `BRANCH_NAME` | `lib/storage/checkpoints.ts` | Git branch name as set by some CI environments (e.g. Jenkins). Used as a fallback when `GIT_BRANCH` is absent. |
| `CI_COMMIT_REF_NAME` | `lib/storage/checkpoints.ts` | Git branch or tag name as set by GitLab CI. Third fallback in the branch-detection chain. |
| `GIT_BRANCH` | `lib/storage/checkpoints.ts` | Git branch name. Primary source used to annotate checkpoint records with the active branch at creation time. |
| `VERCEL_GIT_COMMIT_REF` | `lib/storage/checkpoints.ts` | Git branch name as set by Vercel deployments. Last fallback in the branch-detection chain. |

## Source Files

Source file references are included in the flag table above.

## Source Metadata

- Group: Feature Flag Reference
 succeeded in 51ms:
# 3. MCP Configuration

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MCP_ANCHOR_STRICT` | `false` | boolean | `lib/validation/preflight.ts` | When `'true'`, enforces strict anchor format validation during pre-flight checks. Invalid anchor IDs cause the save to be rejected. Default is lenient mode which logs warnings but does not block. |
| `MCP_CHARS_PER_TOKEN` | `3.5` | number | `lib/validation/preflight.ts` | Characters-per-token ratio used for token budget estimation during pre-flight validation. Affects whether a memory file is flagged as too large before embedding generation begins. |
| `MCP_DUPLICATE_THRESHOLD` | `0.95` | number | `lib/validation/preflight.ts` | Cosine similarity threshold above which a new memory is considered a near-duplicate of an existing one during pre-flight validation. Duplicates above this threshold are rejected by the quality gate Layer 3. |
| `MCP_MAX_CONTENT_LENGTH` | `250000` | number | `lib/validation/preflight.ts` | Maximum allowed content length in characters for a memory file. Files exceeding this limit are rejected at pre-flight validation before any embedding generation or database writes. |
| `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight validation warns when a memory exceeds this limit. |
| `MCP_MIN_CONTENT_LENGTH` | `10` | number | `lib/validation/preflight.ts` | Minimum content length in characters for a valid memory file. Files shorter than this are rejected at pre-flight. The quality gate Layer 1 requires at least 50 characters, so this lower floor catches truly empty files. |
| `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` | Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8, a warning fires when estimated tokens exceed 80% of the max. |

## Source Files

Source file references are included in the flag table above.

## Source Metadata

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "BRANCH_NAME|CI_COMMIT_REF_NAME|GIT_BRANCH|VERCEL_GIT_COMMIT_REF|COMMIT_SHA|COMMIT_DATE|GITHUB_SHA|GIT_COMMIT|VERCEL_GIT_COMMIT_SHA|CI_COMMIT_SHA|BUILD_SOURCEVERSION" .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "ENABLE_BM25|TOOL_CACHE_CLEANUP_INTERVAL_MS|TOOL_CACHE_MAX_ENTRIES|TOOL_CACHE_TTL_MS|SESSION_DEDUP_DB_UNAVAILABLE_MODE|SESSION_MAX_ENTRIES|SESSION_TTL_MINUTES|STALE_CLEANUP_INTERVAL_MS|STALE_SESSION_THRESHOLD_MS" .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
import { bulkInsertEdges, deleteEdgesForMemory, type RelationType } from './causal-edges';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:101:    process.env.GIT_BRANCH,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:102:    process.env.BRANCH_NAME,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:103:    process.env.CI_COMMIT_REF_NAME,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:104:    process.env.VERCEL_GIT_COMMIT_REF,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:51:  defaultTtlMs: parseInt(process.env.TOOL_CACHE_TTL_MS || '60000', 10) || 60000,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:52:  maxEntries: parseInt(process.env.TOOL_CACHE_MAX_ENTRIES || '1000', 10) || 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:53:  cleanupIntervalMs: parseInt(process.env.TOOL_CACHE_CLEANUP_INTERVAL_MS || '30000', 10) || 30000,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:57:  return process.env.ENABLE_BM25 !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:161:  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:162:  maxEntriesPerSession: parseInt(process.env.SESSION_MAX_ENTRIES as string, 10) || 100,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:164:  dbUnavailableMode: process.env.SESSION_DEDUP_DB_UNAVAILABLE_MODE === 'allow' ? 'allow' : 'block',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:178:const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:179:const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:231:  }, STALE_CLEANUP_INTERVAL_MS);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:532: * @param thresholdMs - Inactivity threshold in milliseconds (default: STALE_SESSION_THRESHOLD_MS / 24h)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:534:function cleanupStaleSessions(thresholdMs: number = STALE_SESSION_THRESHOLD_MS): StaleCleanupResult {
exec
/bin/zsh -lc 'rg -n "DEBUG_TRIGGER_MATCHER" .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "LOG_LEVEL" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
129:  } else if (process.env.DEBUG_TRIGGER_MATCHER) {
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:29: *  Set via LOG_LEVEL env var (default: 'info'). */
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:31:  const env = process.env.LOG_LEVEL?.toLowerCase();
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/shared/utils/path-security.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"MEMORY_ALLOWED_PATHS|MEMORY_BASE_PATH|MEMORY_DB_DIR|MEMORY_DB_PATH|SPEC_KIT_DB_DIR|SPECKIT_DB_DIR\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Path Security
// ---------------------------------------------------------------
// Canonical location (moved from mcp_server/lib/utils/path-security.js)

import path from 'path';
import fs from 'fs';

// ---------------------------------------------------------------
// 1. PATH VALIDATION
// ---------------------------------------------------------------

/**
 * Validate file path is within allowed directories (CWE-22: Path Traversal mitigation)
 * Uses path.relative() containment check instead of startsWith() to prevent path confusion attacks.
 */
export function validateFilePath(filePath: string, allowedBasePaths: string[]): string | null {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }
 succeeded in 52ms:
.opencode/skill/system-spec-kit/shared/config.ts:10:  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md:32:**Path resolution:** `shared/config.ts` resolves this directory by walking up from `__dirname` to find `mcp_server/database/`. The path can be overridden with the `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR` environment variable.
.opencode/skill/system-spec-kit/shared/embeddings/README.md:324:**Solution**: Should no longer occur with per-profile DBs. If you see this error, verify you're not using forced `MEMORY_DB_PATH`.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:90:  const configuredMemoryRoot = process.env.MEMORY_BASE_PATH;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:33:export const DATABASE_DIR: string = process.env.SPEC_KIT_DB_DIR
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:34:  ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:72:export const DEFAULT_BASE_PATH: string = process.env.MEMORY_BASE_PATH || process.cwd();
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:26:  delete process.env.SPEC_KIT_DB_DIR;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:27:  delete process.env.MEMORY_BASE_PATH;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:28:  delete process.env.MEMORY_ALLOWED_PATHS;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:105:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:106:    process.env.MEMORY_ALLOWED_PATHS = process.cwd();
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:126:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:127:    process.env.MEMORY_ALLOWED_PATHS = process.cwd();
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:168:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:169:    process.env.MEMORY_ALLOWED_PATHS = process.cwd();
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:211:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:212:    process.env.MEMORY_ALLOWED_PATHS = process.cwd();
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:259:    process.env.SPEC_KIT_DB_DIR = tempDir;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:260:    process.env.MEMORY_ALLOWED_PATHS = process.cwd();
exec
/bin/zsh -lc "rg -n \"TOKEN_BUDGET_EXCEEDED|TOKEN_BUDGET_WARNING|max_tokens_per_memory|warning_threshold|within_budget\" .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"MCP_ANCHOR_STRICT|strict_anchors|validateAnchorFormat|anchor_validation_strict\" .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
35:  anchor_validation_strict: boolean;
120:  strict_anchors?: boolean;
200:  anchor_validation_strict: process.env.MCP_ANCHOR_STRICT === 'true',
246: * Provides the validateAnchorFormat helper.
248:export function validateAnchorFormat(content: string, options: { strict?: boolean } = {}): AnchorValidationResult {
249:  const { strict = PREFLIGHT_CONFIG.anchor_validation_strict } = options;
610:    strict_anchors = false,
652:    const anchorResult = validateAnchorFormat(content, { strict: strict_anchors });
657:      if (strict_anchors) {
 succeeded in 52ms:
20:  TOKEN_BUDGET_EXCEEDED: string;
21:  TOKEN_BUDGET_WARNING: string;
29:  max_tokens_per_memory: number;
30:  warning_threshold: number;
69:  within_budget: boolean;
176:  TOKEN_BUDGET_EXCEEDED: 'PF020',
177:  TOKEN_BUDGET_WARNING: 'PF021',
188:  max_tokens_per_memory: parseInt(process.env.MCP_MAX_MEMORY_TOKENS || '8000', 10),
189:  warning_threshold: parseFloat(process.env.MCP_TOKEN_WARNING_THRESHOLD || '0.8'),
468:  warning_threshold?: number;
472:    maxTokens = PREFLIGHT_CONFIG.max_tokens_per_memory,
473:    warning_threshold = PREFLIGHT_CONFIG.warning_threshold,
478:    within_budget: true,
505:    result.within_budget = false;
507:      code: PreflightErrorCodes.TOKEN_BUDGET_EXCEEDED,
513:  else if (result.percentage_used >= warning_threshold) {
515:      code: PreflightErrorCodes.TOKEN_BUDGET_WARNING,
674:    if (!tokenResult.within_budget) {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Feature flag governance

## Current Reality

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework defines operational targets (small active flag surface, explicit sunset windows and periodic audits). These are process controls, not hard runtime-enforced caps in code.

The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.

## Source Files

No dedicated source files — this describes governance process controls.

## Source Metadata

- Group: Governance
- Source feature title: Feature flag governance
- Current reality source: feature_catalog.md
 succeeded in 51ms:
# Feature flag sunset audit

## Current Reality

A comprehensive audit at Sprint 7 exit found 61 unique `SPECKIT_` flags across the codebase. Disposition: 27 flags are ready to graduate to permanent-ON defaults (removing the flag check), 9 flags are identified as dead code for removal and 3 flags remain as active operational knobs (`ADAPTIVE_FUSION`, `COACTIVATION_STRENGTH`, `PRESSURE_POLICY`).

The current active flag-helper inventory in `search-flags.ts` is 23 exported `is*` functions (including the deprecated `isPipelineV2Enabled()` compatibility shim). Sprint 0 core flags remain default ON, sprint-graduated flags from Sprints 3-6 remain default ON, and deferred-feature flags (including GRAPH_SIGNALS, COMMUNITY_DETECTION, MEMORY_SUMMARIES, AUTO_ENTITIES and ENTITY_LINKING) are now default ON. `SPECKIT_ABLATION` remains default OFF as an opt-in evaluation tool.

**Phase 017 update:** `SPECKIT_PIPELINE_V2` is now deprecated. `isPipelineV2Enabled()` always returns `true` regardless of the env var. The legacy V1 pipeline code was removed, making the env var a no-op.

**Sprint 8 update:** Flag graduation and dead code removal have been completed. The Sprint 8 comprehensive remediation removed a large dead-code slice including: dead feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in `working-memory.ts`), and dead functions/exports (`computeCausalDepth` single-node variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`). `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8) for the full accounting.

---

## Source Files

No dedicated source files — this describes governance process controls.

## Source Metadata

exec
/bin/zsh -lc 'rg -n "''^export function is[A-Z]" .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_FILE_WATCHER|SPECKIT_RESPONSE_TRACE|SPECKIT_STRICT_SCHEMAS|SPECKIT_DYNAMIC_INIT|SPECKIT_SKIP_API_VALIDATION|SPECKIT_EXTENDED_TELEMETRY" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
15:export function isMMREnabled(): boolean {
23:export function isTRMEnabled(): boolean {
31:export function isMultiQueryEnabled(): boolean {
39:export function isCrossEncoderEnabled(): boolean {
47:export function isSearchFallbackEnabled(): boolean {
55:export function isFolderDiscoveryEnabled(): boolean {
65:export function isDocscoreAggregationEnabled(): boolean {
73:export function isSaveQualityGateEnabled(): boolean {
81:export function isReconsolidationEnabled(): boolean {
89:export function isNegativeFeedbackEnabled(): boolean {
101:export function isPipelineV2Enabled(): boolean {
110:export function isEmbeddingExpansionEnabled(): boolean {
121:export function isConsolidationEnabled(): boolean {
130:export function isEncodingIntentEnabled(): boolean {
140:export function isGraphSignalsEnabled(): boolean {
148:export function isCommunityDetectionEnabled(): boolean {
156:export function isMemorySummariesEnabled(): boolean {
164:export function isAutoEntitiesEnabled(): boolean {
173:export function isEntityLinkingEnabled(): boolean {
178:export function isDegreeBoostEnabled(): boolean {
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:6:// Feature flag: SPECKIT_EXTENDED_TELEMETRY (default false / disabled)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:22: * Set SPECKIT_EXTENDED_TELEMETRY=true to enable detailed retrieval metrics collection.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:25:  return process.env.SPECKIT_EXTENDED_TELEMETRY === 'true';
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:5:// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:14:  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:192: * Default: FALSE. Set SPECKIT_FILE_WATCHER=true to enable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:196:  if (process.env.SPECKIT_FILE_WATCHER?.toLowerCase().trim() !== 'true') return false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:197:  return isFeatureEnabled('SPECKIT_FILE_WATCHER');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:619:  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:218:  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:700:  // Skip validation if SPECKIT_SKIP_API_VALIDATION=true (for testing/CI)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:701:  if (process.env.SPECKIT_SKIP_API_VALIDATION !== 'true') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:719:        console.error('[context-server] Set SPECKIT_SKIP_API_VALIDATION=true to bypass (not recommended)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:734:    console.warn('[context-server] API key validation skipped (SPECKIT_SKIP_API_VALIDATION=true)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/03-implemented-auto-entity-extraction.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/04-implemented-memory-summary-generation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/05-implemented-cross-document-entity-linking.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Implemented: graph centrality and community detection

## Current Reality

Originally deferred at Sprint 6b pending a feasibility spike. Three graph capabilities were planned: graph momentum (N2a), causal depth signal (N2b) and community detection (N2c).

**Now implemented.** N2a and N2b share a single flag (`SPECKIT_GRAPH_SIGNALS`, default ON) providing additive score adjustments up to +0.05 each in Stage 2. N2c runs behind `SPECKIT_COMMUNITY_DETECTION` (default ON) with BFS connected components escalating to a pure-TypeScript Louvain implementation when the largest component exceeds 50% of nodes. Schema migrations v19 added `degree_snapshots` and `community_assignments` tables. See [Graph momentum scoring](#graph-momentum-scoring), [Causal depth signal](#causal-depth-signal) and [Community detection](#community-detection) for full descriptions.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/graph/community-detection.ts` | Lib | Community detection algorithm |
| `mcp_server/lib/manage/pagerank.ts` | Lib | PageRank computation |

### Tests

| File | Focus |
 succeeded in 52ms:
# Implemented: auto entity extraction

## Current Reality

Originally deferred at Sprint 6b pending a feasibility spike alongside N2. Rule-based heuristics would extract entities from memory content, gated on edge density.

**Now implemented.** Five regex extraction rules with a 64-word denylist, stored in a dedicated `memory_entities` table (not causal_edges) with an `entity_catalog` for canonical name resolution. Runs at save time behind `SPECKIT_AUTO_ENTITIES` (default ON). Schema migration v20 added `memory_entities` and `entity_catalog` tables. Zero external NLP dependencies. See [Auto entity extraction](#auto-entity-extraction) for the full description. Unblocks S5 (cross-document entity linking).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory integration |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction |
| `mcp_server/lib/extraction/extraction-adapter.ts` | Lib | Extraction adapter |
| `mcp_server/lib/extraction/redaction-gate.ts` | Lib | Redaction gate |

 succeeded in 50ms:
# Implemented: cross-document entity linking

## Current Reality

Originally skipped at Sprint 7 because zero entities existed in the system. R10 had not been built, so there was no entity catalog to link against.

**Now implemented.** With R10 providing extracted entities, S5 scans the `entity_catalog` for entities appearing in two or more spec folders and creates `supports` causal edges with `strength=0.7` and `created_by='entity_linker'`. A density guard prevents runaway edge creation by running both a current-global-density precheck (`total_edges / total_memories`) and a projected post-insert global density check against `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`, invalid or negative values fall back to `1.0`). Runs behind `SPECKIT_ENTITY_LINKING` (default ON) and depends on a populated `entity_catalog` (typically produced by R10 auto-entities). See [Cross-document entity linking](#cross-document-entity-linking) for the full description.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/entity-linker.ts` | Lib | Cross-document entity linking |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |

### Tests

 succeeded in 50ms:
# Implemented: memory summary generation

## Current Reality

Originally skipped at Sprint 7 because the scale gate measured 2,411 active memories, below the 5,000 threshold.

**Now implemented.** Pure-TypeScript TF-IDF extractive summarizer generates top-3 key sentences at save time, stored with summary-specific embeddings in the `memory_summaries` table. Operates as a parallel search channel in Stage 1 (not a pre-filter, avoiding recall loss). The runtime scale gate remains: the channel skips execution below 5,000 indexed memories. Runs behind `SPECKIT_MEMORY_SUMMARIES` (default ON). Schema migration v20 added the `memory_summaries` table. See [Memory summary search channel](#memory-summary-search-channel) for the full description.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/memory-summaries.ts` | Lib | Memory summary generation |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `mcp_server/lib/search/tfidf-summarizer.ts` | Lib | TF-IDF extractive summarizer |

### Tests
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/19--decisions-and-deferrals/01-int8-quantization-evaluation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Code standards alignment

## Current Reality

All modified files were reviewed against sk-code--opencode standards. 45 violations found and fixed: 26 AI-intent comment conversions (AI-WHY, AI-TRACE, AI-GUARD prefixes), 10 MODULE/COMPONENT headers added, import ordering corrections, and constant naming (`specFolderLocks` → `SPEC_FOLDER_LOCKS`).

---

## Source Files

No dedicated source files — this is a cross-cutting meta-improvement applied across multiple modules.

## Source Metadata

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Code standards alignment
- Current reality source: feature_catalog.md
 succeeded in 52ms:
# INT8 quantization evaluation

## Current Reality

Decision: **NO-GO**. All three activation criteria were unmet.

Active memories with embeddings: 2,412 measured versus the 10,000 threshold (24.1%). P95 search latency: approximately 15ms measured versus the 50ms threshold (approximately 30%). Embedding dimensions: 1,024 measured versus the 1,536 threshold (66.7%).

The estimated 7.1 MB storage savings (3.9% of 180 MB total DB) did not justify 5.32% estimated recall risk, custom quantized BLOB complexity, or KL-divergence calibration overhead. Re-evaluate when the corpus grows approximately 4x (above 10K memories), sustained p95 exceeds 50ms, or the embedding provider changes to dimensions above 1,536.

## Source Files

No dedicated source files — this is a decision record.

## Source Metadata

- Group: Decisions and deferrals
- Source feature title: INT8 quantization evaluation
- Current reality source: feature_catalog.md
 succeeded in 52ms:
# Dead code removal

## Current Reality

Approximately 360 lines of dead code were removed across four categories:

**Hot-path dead branches:** Dead RSF branch and dead shadow-scoring branch removed from `hybrid-search.ts`. Both were guarded by feature flag functions that always returned `false`.

**Dead feature flag functions:** `isShadowScoringEnabled()` removed from `shadow-scoring.ts` and `search-flags.ts`. `isRsfEnabled()` removed from `rsf-fusion.ts`. `isInShadowPeriod()` in `learned-feedback.ts` remains active as the R11 shadow-period safeguard and was not removed.

**Dead module-level state:** `stmtCache` Map (archival-manager.ts — never populated), `lastComputedAt` (community-detection.ts — set but never read), `activeProvider` cache (cross-encoder.ts — never populated), `flushCount` (access-tracker.ts — never incremented), 3 dead config fields in working-memory.ts (`decayInterval`, `attentionDecayRate`, `minAttentionScore`).

**Dead functions and exports:** `computeCausalDepth` single-node variant (graph-signals.ts — batch version is the only caller), `getSubgraphWeights` (graph-search-fn.ts — always returned 1.0, replaced with inline constant), `RECOVERY_HALF_LIFE_DAYS` (negative-feedback.ts — never imported), `'related'` weight entry (causal-edges.ts — invalid relation type), `logCoActivationEvent` and `CoActivationEvent` (co-activation.ts — never called).

**Preserved (NOT dead):** `computeStructuralFreshness` and `computeGraphCentrality` in `fsrs.ts` were identified as planned architectural components (not concluded experiments) and retained.

## Source Files

No dedicated source files — this is a cross-cutting meta-improvement applied across multiple modules.

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Memory summary search channel

## Current Reality

Large memory files bury their key information in paragraphs of context. A 2,000-word implementation summary might contain three sentences that actually answer a retrieval query. Searching against the full content dilutes embedding similarity with irrelevant noise.

R8 generates extractive summaries at save time using a pure-TypeScript TF-IDF implementation with zero dependencies. The `computeTfIdf()` function scores each sentence by term frequency times inverse document frequency across all sentences in the document, normalized to [0,1]. The `extractKeySentences()` function selects the top-3 scoring sentences and returns them in original document order rather than score order, preserving narrative coherence.

Generated summaries are stored in the `memory_summaries` table alongside a summary-specific embedding vector computed by the same embedding function used for full content. The `querySummaryEmbeddings()` function performs cosine similarity search against these summary embeddings, returning results as `PipelineRow` objects compatible with the main pipeline.

**Sprint 8 update:** A `LIMIT` clause was added to the unbounded summary query in `memory-summaries.ts` (capped at `Math.max(limit * 10, 1000)`) to prevent full-table scans on large corpora. Summary candidates in Stage 1 now also pass through the same `minQualityScore` filter applied to other candidates.

The summary channel runs as a parallel search channel in Stage 1 of the 4-stage pipeline, alongside hybrid, vector and multi-concept channels. It follows the R12 embedding expansion pattern: execute in parallel, merge results and deduplicate by memory ID with baseline results taking priority. This is deliberately a parallel channel rather than a pre-filter to avoid recall loss.

A runtime scale gate activates the channel only when the system exceeds 5,000 indexed memories with successful embeddings. Below that threshold, the summary channel adds overhead without measurable benefit because the base channels already cover the corpus effectively. The code exists regardless of scale; the gate simply skips execution. Runs behind the `SPECKIT_MEMORY_SUMMARIES` flag (default ON).

## Source Files

### Implementation

 succeeded in 52ms:
# Lightweight consolidation

## Current Reality

Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) plus heuristic fallback (word overlap). Both use a `hasNegationConflict()` keyword asymmetry check against approximately 20 negation terms (not, never, deprecated, replaced, and others). The system surfaces full contradiction clusters rather than isolated pairs via 1-hop causal edge neighbor expansion.

Hebbian edge strengthening reinforces recently accessed edges at +0.05 per cycle with a 30-day decay of 0.1, respecting the auto-edge strength cap. Staleness detection flags edges unfetched for 90 or more days without deleting them. Edge bounds enforcement reports current edge counts versus the 20-edge-per-node maximum.

All weight modifications are logged to the `weight_history` table. The cycle fires after every successful `memory_save` when enabled. Runs behind the `SPECKIT_CONSOLIDATION` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
 succeeded in 52ms:
# Cross-document entity linking

## Current Reality

Memories in different spec folders often discuss the same concepts without any explicit connection between them. A decision record in one folder mentions "embedding cache" and an implementation summary in another folder implements it, but the retrieval system has no way to connect them unless a causal edge exists.

Cross-document entity linking bridges this gap using the entity catalog populated by R10. The `buildEntityCatalog()` function groups entities from the `memory_entities` table by canonical name. The `findCrossDocumentMatches()` function identifies entities appearing in two or more distinct spec folders, which represent genuine cross-document relationships.

For each cross-document match, `createEntityLinks()` inserts causal edges with `relation='supports'`, `strength=0.7` and `created_by='entity_linker'`. The `supports` relation was chosen over adding a new relation type to avoid ALTER TABLE complexity on the SQLite `causal_edges` CHECK constraint. Entity-derived links are genuinely supportive relationships: if two documents reference the same entity, they support each other's context.

An infrastructure gate checks that the `entity_catalog` has entries before running. Without R10 providing extracted entities, S5 has nothing to operate on. The `runEntityLinking()` orchestrator chains catalog build, match finding and edge creation with statistics reporting.

**Sprint 8 update:** Two performance improvements were applied to `entity-linker.ts`: (1) a parallel `Set` was added for `catalogSets` providing O(1) `.has()` lookups instead of O(n) `.includes()` in inner loops, and (2) a `batchGetEdgeCounts()` function replaced N+1 individual `getEdgeCount` queries with a single batch query.

A density guard prevents runaway edge creation: current global edge density is computed as `total_edges / total_memories` and checked before link generation begins. The linker also checks projected post-insert global density before creating links. If either check exceeds the configured threshold, new entity links are skipped to avoid overwhelming the graph. The threshold is controlled by `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`), and invalid or negative values fall back to `1.0`. Runs behind the `SPECKIT_ENTITY_LINKING` flag (default ON). Depends on a populated `entity_catalog` (typically produced by R10 auto-entities).

---

## Source Files

 succeeded in 52ms:
# Contextual tree injection

## Current Reality

**IMPLEMENTED (Sprint 019).** Returned chunks are prefixed with hierarchical context headers in the format `[parent > child — description]` (max 100 chars), using existing PI-B3 cached spec folder descriptions. Gated by `SPECKIT_CONTEXT_HEADERS` (default `true`) and injected after Stage 4 token-budget truncation.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Tier-2 fallback channel forcing

## Current Reality

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel enforcement |
| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |

### Tests

| File | Focus |
 succeeded in 51ms:
# Provenance-rich response envelopes

## Current Reality

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState), and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

 succeeded in 51ms:
# Constitutional memory as expert knowledge injection

## Current Reality

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |

### Tests

| File | Focus |
|------|-------|
 succeeded in 51ms:
# Dual-scope memory auto-surface

## Current Reality

Memory auto-surface hooks fire at two lifecycle points beyond explicit search: tool dispatch for non-memory-aware tools (using extracted context hints), and session compaction (when context is compressed, critical memories are re-injected).

Each hook point has a per-point token budget of 4,000 tokens maximum. The tool dispatch hook checks incoming tool arguments for context hints (input, query, prompt, specFolder, filePath or concepts) and surfaces constitutional-tier and trigger-matched memories, but skips memory-aware tools to avoid recursive surfacing loops. Memory-aware tools are handled in-band by the context-server pre-dispatch branch (`autoSurfaceMemories` / `autoSurfaceAtCompaction`). Constitutional memories are cached for 1 minute via an in-memory cache.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
exec
/bin/zsh -lc 'rg -n "batchGetEdgeCounts|createEntityLinks|runEntityLinking|catalogSets" .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"SummarySearchResult|PipelineRow|querySummaryEmbeddings\\(|memoryId\" .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 58ms:
91:  const catalogSets = new Map<string, { memoryIdSet: Set<number>; specFolderSet: Set<string> }>();
109:      let sets = catalogSets.get(canonical);
114:        catalogSets.set(canonical, sets);
250:function batchGetEdgeCounts(db: Database.Database, nodeIds: string[]): Map<string, number> {
278:    console.warn(`[entity-linker] batchGetEdgeCounts failed: ${message}`);
284:export function createEntityLinks(
318:  const edgeCountCache = batchGetEdgeCounts(db, Array.from(allNodeIds));
483:export function runEntityLinking(db: Database.Database): EntityLinkResult {
512:    return createEntityLinks(db, matches, { maxEdgeDensity });
 succeeded in 57ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:14:interface SummarySearchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:16:  memoryId: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:92: * @param memoryId - ID of the memory to summarize
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:99:  memoryId: number,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:127:      memoryId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:131:      memoryId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:139:      `[memory-summaries] Failed to generate/store summary for memory ${memoryId}:`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:160:export function querySummaryEmbeddings(
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:164:): SummarySearchResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:176:    const results: SummarySearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:184:        memoryId: row.memory_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:26://   Output: Stage1Output { candidates: PipelineRow[], metadata }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:37:import type { Stage1Input, Stage1Output, PipelineRow } from './types';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:76:  results: PipelineRow[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:78:): PipelineRow[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:102:function resolveRowContextType(row: PipelineRow): string | undefined {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:179:  let candidates: PipelineRow[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:214:    }) as PipelineRow[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:237:          const variantResultSets: PipelineRow[][] = await Promise.all(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:238:            queryVariants.map(async (variant): Promise<PipelineRow[]> => {
exec
/bin/zsh -lc 'rg -n "weight_history|hasNegationConflict|runHebbianCycle|detectStaleEdges|checkEdgeBounds|runConsolidationCycleIfEnabled|consolidation_state|1-hop|cluster" .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
44:  /** All cluster members (IDs of related memories) */
168:        if (hasNegationConflict(contentA, contentB)) {
222:      if (overlap >= CONTRADICTION_SIMILARITY_THRESHOLD && hasNegationConflict(contentA, contentB)) {
239:export function hasNegationConflict(textA: string, textB: string): boolean {
283: * Surface all members of a contradiction cluster.
291:  const clusters: ContradictionCluster[] = [];
296:    // Expand cluster via causal edges (1-hop neighbors)
312:        console.warn('[consolidation] cluster expansion error:', message);
316:    clusters.push({
322:  return clusters;
334: * All weight changes are logged to weight_history via updateEdge().
336:export function runHebbianCycle(database: Database.Database): { strengthened: number; decayed: number } {
384:    console.warn(`[consolidation] runHebbianCycle error: ${msg}`);
398:export function detectStaleEdges(_database: Database.Database): CausalEdge[] {
413:export function checkEdgeBounds(
438:  // T002a + T002e: Contradiction scan + cluster surfacing
443:  const hebbian = runHebbianCycle(database);
446:  const staleEdges = detectStaleEdges(database);
460:      const bounds = checkEdgeBounds(node_id);
479:export function runConsolidationCycleIfEnabled(
 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: N3-lite Consolidation Engine
// ---------------------------------------------------------------
// Lightweight graph maintenance: contradiction scan, Hebbian
// strengthening, staleness detection, edge bounds enforcement.
// Sprint 6a — behind SPECKIT_CONSOLIDATION flag.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import { isConsolidationEnabled } from '../search/search-flags';
import {
  updateEdge,
  getStaleEdges,
  countEdgesForNode,
  MAX_EDGES_PER_NODE,
  MAX_AUTO_STRENGTH,
  MAX_STRENGTH_INCREASE_PER_CYCLE,
  STALENESS_THRESHOLD_DAYS,
  DECAY_STRENGTH_AMOUNT,
  DECAY_PERIOD_DAYS,
exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/12-hooks-readme-and-export-alignment.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Final token metadata recomputation

## Current Reality

Phase 014 now recomputes final token metadata after `appendAutoSurfaceHints(...)` adds the last response-envelope content and before token-budget enforcement evaluates the payload. This keeps `meta.tokenCount` aligned with the finalized envelope that callers actually receive.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

## Source Metadata

- Group: UX hooks automation (Phase 014)
- Source feature title: Final token metadata recomputation
- Current reality source: feature_catalog.md
 succeeded in 51ms:
# Hooks README and export alignment

## Current Reality

The hooks barrel and hooks README were brought back into sync with the implemented UX-hook modules. `mutation-feedback` and `response-hints` are now both exported and documented as the canonical shared hook surface, removing the rollout-era README/export drift.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/hooks/index.ts` | Hook | Module barrel export |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/hooks/response-hints.ts` | Hook | Response hint hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
 succeeded in 50ms:
# End-to-end success-envelope verification

## Current Reality

Phase 014 verification now includes an end-to-end appended-envelope assertion in `tests/context-server.vitest.ts`. That coverage verifies the finalized success-path hint append flow, preserved `autoSurfacedContext`, and final token metadata behavior together so future response-envelope regressions fail fast.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility |

### Tests

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Standalone admin CLI

## Current Reality

Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint; constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/cli.ts` | Core | CLI entry point and command dispatch |
| `mcp_server/lib/storage/schema-downgrade.ts` | Lib | Schema downgrade logic |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint storage for pre-delete snapshots |

### Tests

| File | Focus |
|------|-------|
 succeeded in 51ms:
# Real-time filesystem watching with chokidar

## Current Reality

**IMPLEMENTED (Sprint 019).** Adds `chokidar`-based push indexing in `lib/ops/file-watcher.ts` with 2-second debounce, TM-02 SHA-256 content-hash deduplication, and exponential backoff retries for `SQLITE_BUSY` (1s/2s/4s, 3 attempts). Exports `getWatcherMetrics()` with `filesReindexed` and `avgReindexTimeMs` counters, plus per-reindex timing logs to stderr (CHK-087). Gated by `SPECKIT_FILE_WATCHER` (default `false`).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/ops/file-watcher.ts` | Lib | Filesystem watcher |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/file-watcher.vitest.ts` | File watcher tests |

 succeeded in 52ms:
# Watcher delete/rename cleanup

## Current Reality

The chokidar-based file watcher (`lib/ops/file-watcher.ts`) handles more than just add/change events. When a watched memory file is deleted or renamed, the watcher receives an `unlink` event and invokes the configured `removeFn` callback to purge the corresponding memory index entry, BM25 tokens, and vector embedding from the database. This prevents orphaned index entries from appearing in search results after a file is moved or removed on disk.

Rename detection is handled as an unlink followed by an add, which means the memory gets a fresh index entry at the new path while the old entry is cleaned up. The 2-second debounce window collapses rapid rename sequences into a single reindex cycle.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/ops/file-watcher.ts` | Lib | Filesystem watcher with delete/rename handling |

### Tests

| File | Focus |
|------|-------|
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Progressive validation for spec documents

## Current Reality

The `progressive-validate.sh` script wraps `validate.sh` with four progressive levels. Level 1 (Detect) identifies all violations. Level 2 (Auto-fix) applies safe mechanical corrections like missing dates, heading levels and whitespace with before/after diff logging. Level 3 (Suggest) presents non-automatable issues with guided remediation options. Level 4 (Report) produces structured output in JSON or human-readable format.

Flags include `--level N`, `--dry-run`, `--json`, `--strict`, `--quiet` and `--verbose`. Exit codes maintain compatibility with `validate.sh`: 0 for pass, 1 for warnings, 2 for errors. The dry-run mode previews all changes before applying them.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/progressive-validate.sh` | Script | Progressive validation wrapper around validate.sh |

## Source Metadata

 succeeded in 50ms:
# Tree thinning for spec folder consolidation

## Current Reality

A bottom-up merge strategy thins small files during spec folder context loading. Files under 200 tokens have their summary merged into the parent document. Files under 500 tokens use their content directly as the summary, skipping separate summary generation.

Memory file thresholds differ: under 100 tokens for content-as-summary, 100-300 tokens for merged-into-parent, 300+ tokens kept as-is. The `applyTreeThinning()` function runs in `workflow.ts` at Step 7.6 before pipeline stages and is applied to the rendered context payload. Stats track total files, thinned count, merged count and tokens saved.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |

### Tests

| File | Focus |
 succeeded in 52ms:
# Architecture boundary enforcement

## Current Reality

Two architecture rules in `ARCHITECTURE.md` were previously documentation-only with no automated enforcement: (1) `shared/` must not import from `mcp_server/` or `scripts/`, and (2) `mcp_server/scripts/` must contain only thin compatibility wrappers delegating to canonical `scripts/dist/` implementations.

`check-architecture-boundaries.ts` enforces both rules as part of `npm run check`. GAP A walks all `.ts` files in `shared/`, extracts module specifiers (skipping block and line comments), and flags any import matching relative paths to `mcp_server/` or `scripts/` at any depth, or package-form `@spec-kit/mcp-server/` or `@spec-kit/scripts/`. This is an absolute prohibition with no allowlist.

GAP B scans top-level `.ts` files in `mcp_server/scripts/` (non-recursive) and verifies each passes three conditions: at most 50 substantive lines (non-blank, non-comment), contains a `child_process` import, and references `scripts/dist/` somewhere in its content. Failure on any condition flags the file as not a valid wrapper.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/architecture/check-architecture-boundaries.ts` | Lib | Architecture boundary enforcement |

### Tests

exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/package.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
{
  "name": "system-spec-kit",
  "version": "1.7.2",
  "private": true,
  "description": "Unified workspace for Semantic Memory MCP server and CLI tools",
  "workspaces": [
    "shared",
    "mcp_server",
    "scripts"
  ],
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "npm run start --workspace=mcp_server",
    "build": "tsc --build",
    "typecheck": "tsc -p shared/tsconfig.json && tsc --noEmit --composite false -p mcp_server/tsconfig.json && tsc --noEmit --composite false -p scripts/tsconfig.json",
    "build:watch": "tsc --build --watch",
    "test": "npm run test:cli && npm run test:embeddings && npm run test:mcp",
    "test:mcp": "npm run test --workspace=mcp_server",
exec
/bin/zsh -lc "rg -n \"check-architecture-boundaries|npm run check|\\\"check\\\"\" .opencode/skill/system-spec-kit/package.json .opencode/skill/system-spec-kit/**/package.json .opencode/skill/system-spec-kit/scripts/**/*.json .opencode/skill/system-spec-kit/mcp_server/package.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 242ms:
.opencode/skill/system-spec-kit/mcp_server/node_modules/@modelcontextprotocol/sdk/package.json:81:        "check": "npm run typecheck && npm run lint",
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/@eslint/plugin-kit/node_modules/levn/node_modules/type-check/package.json:9:    "check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/chalk/node_modules/supports-color/node_modules/has-flag/package.json:24:		"check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/file-entry-cache/node_modules/flat-cache/package.json:31:    "check": "npm run eslint",
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/is-glob/node_modules/is-extglob/package.json:29:    "check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/@huggingface/jinja/package.json:52:    "check": "tsc"
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/is-glob/package.json:37:    "check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/eslint/node_modules/optionator/node_modules/type-check/package.json:9:    "check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/env-var/package.json:12:    "test": "npm run unit && npm run coverage && npm run check-coverage && npm run lint && npm run ts-verify",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/ipull/node_modules/slice-ansi/node_modules/is-fullwidth-code-point/package.json:42:		"check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/slice-ansi/node_modules/is-fullwidth-code-point/package.json:42:		"check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/is-unicode-supported/package.json:39:		"check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/yargs/node_modules/string-width/node_modules/is-fullwidth-code-point/package.json:35:		"check"
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/yargs/node_modules/yargs-parser/package.json:21:    "check": "standardx '**/*.ts' && standardx '**/*.js' && standardx '**/*.cjs'",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/yargs/node_modules/cliui/package.json:18:    "check": "standardx '**/*.ts' && standardx '**/*.js' && standardx '**/*.cjs'",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/yargs/node_modules/cliui/package.json:23:    "postest": "check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/yargs/package.json:91:    "posttest": "npm run check",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/yargs/package.json:101:    "check": "gts lint && npm run check:js",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/yargs/node_modules/y18n/package.json:30:    "check": "standardx **/*.ts **/*.cjs **/*.mjs",
.opencode/skill/system-spec-kit/mcp_server/node_modules/node-llama-cpp/node_modules/yargs/node_modules/y18n/package.json:35:    "posttest": "npm run check",
exec
/bin/zsh -lc 'rg -n "computeStructuralFreshness|computeGraphCentrality" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"isShadowScoringEnabled|isRsfEnabled|isInShadowPeriod|computeStructuralFreshness|computeGraphCentrality|logCoActivationEvent|getSubgraphWeights|RECOVERY_HALF_LIFE_DAYS|stmtCache|lastComputedAt|activeProvider|flushCount\" .opencode/skill/system-spec-kit/mcp_server | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 52ms:
rg: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs.ts: IO error for operation on .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs.ts: No such file or directory (os error 2)
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:2:// Previously tested getSubgraphWeights, which was removed as dead code.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:3:// getSubgraphWeights always returned { causalWeight: 1.0 } regardless of intent.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:9:  it('getSubgraphWeights was removed — causal weight is inlined as 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:304:    const shadowMode = isInShadowPeriod(db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:404:function isInShadowPeriod(db: Database): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:445:    if (isInShadowPeriod(db)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:507:  // AI-GUARD: no-op: activeProvider cache removed (was never populated)
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:152:  it('fsrs exports: computeStructuralFreshness, computeGraphCentrality', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:154:    expect(typeof mod.computeStructuralFreshness).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:155:    expect(typeof mod.computeGraphCentrality).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:10: * Minimal graph interface required by `computeGraphCentrality`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:39:export function computeStructuralFreshness(
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:62:export function computeGraphCentrality(
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:503:      // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:510:      // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:567:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:577:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:587:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:596:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:608:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
exec
/bin/zsh -lc "sed -n '480,540p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '640,668p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    maxTokens,
    percentage_used: 0,
    warnings: [],
    errors: [],
  };

  if (!content) {
    result.warnings.push('No content provided for token budget check');
    return result;
  }

  // Estimate tokens for content
  let estimated = estimateTokens(content);

  // Add overhead for embedding API call (context + response)
  if (include_embedding_overhead) {
    const embeddingOverhead = 150;
    estimated += embeddingOverhead;
  }

 succeeded in 51ms:

    if (!sizeResult.valid) {
      result.pass = false;
      result.errors.push(...sizeResult.errors);
    }
    if (sizeResult.warnings.length > 0) {
      result.warnings.push(...sizeResult.warnings);
    }
  }

  // 2. Anchor format validation
  if (check_anchors && content) {
    const anchorResult = validateAnchorFormat(content, { strict: strict_anchors });
    addCheck('anchor_format', anchorResult);

    if (!anchorResult.valid) {
      // Anchor errors are warnings by default unless strict mode
      if (strict_anchors) {
        result.pass = false;
        result.errors.push(...anchorResult.errors);
exec
/bin/zsh -lc "sed -n '80,115p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '210,255p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    console.warn(
      `[memory-ingest] Dropped ${paths.length - withinLength.length} path(s) longer than ${MAX_PATH_LENGTH} characters`,
    );
  }
  paths = withinLength;

  if (paths.length === 0) {
    throw new Error('paths must be a non-empty array of file paths');
  }

  const configuredMemoryRoot = process.env.MEMORY_BASE_PATH;
  const derivedAllowedBasePath = configuredMemoryRoot && configuredMemoryRoot.trim().length > 0
    ? path.resolve(process.cwd(), configuredMemoryRoot)
    : path.resolve(path.dirname(DATABASE_PATH));
  const allowedBasePaths = Array.from(
    new Set([derivedAllowedBasePath, ...ALLOWED_BASE_PATHS].map((basePath) => path.resolve(basePath))),
  );

  const normalizedPaths: string[] = [];
  const invalidPaths: Array<{ input: string; reason: string }> = [];
 succeeded in 52ms:
   2. DATABASE PATH AND SECURITY
----------------------------------------------------------------*/

// P1-05 FIX: Unified env var precedence
const DEFAULT_DB_DIR = process.env.SPEC_KIT_DB_DIR ||
  process.env.MEMORY_DB_DIR ||
  path.resolve(__dirname, '../../database');
/** Default path for the vector-index database file. */
export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH ||
  path.join(DEFAULT_DB_DIR, 'context-index.sqlite');
const DB_PERMISSIONS = 0o600;

function resolve_database_path() {
  if (process.env.MEMORY_DB_PATH) {
    return process.env.MEMORY_DB_PATH;
  }

  const embeddings = embeddingsProvider;
  const profile = embeddings.getEmbeddingProfile();

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"computeMomentumScores|computeCausalDepthScores|community|graph signals|GRAPH_SIGNALS|COMMUNITY_DETECTION|0\\.05\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/graph | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Stage2 Fusion
// ---------------------------------------------------------------
// AI-GUARD: Sprint 5 (R6): 4-Stage Retrieval Pipeline
//
// I/O CONTRACT:
//   Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
//   Output: Stage2Output { scored: PipelineRow[], metadata }
//   Key invariants:
//     - Every score modification in the pipeline happens exactly once here
//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
//     - scored is sorted descending by effective composite score on exit
//   Side effects:
//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
//     - Learned trigger and negative-feedback reads from DB
//
// PURPOSE: Single point for ALL scoring signals. Intent weights are
// applied ONCE here only — this is the architectural guard against
// the G2 double-weighting recurrence bug.
//
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:4:// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:166:export function computeMomentumScores(db: Database.Database, memoryIds: number[]): Map<number, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:242:export function computeCausalDepthScores(db: Database.Database, memoryIds: number[]): Map<number, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:330:    console.warn(`[graph-signals] computeCausalDepthScores failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:356: * - Momentum bonus: clamp(momentum * 0.01, 0, 0.05) — rewards nodes gaining connections
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:357: * - Depth bonus: normalizedDepth * 0.05 — rewards structurally deep nodes
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:373:    const momentumScores = computeMomentumScores(db, ids);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:374:    const depthScores = computeCausalDepthScores(db, ids);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:381:      // Momentum bonus: up to +0.05
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:382:      const momentumBonus = clamp(momentum * 0.01, 0, 0.05);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:383:      // Depth exec
/bin/zsh -lc 'rg -n "runShadowScoring|isRsfEnabled|isShadowScoringEnabled|isInShadowPeriod" .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:304:    const shadowMode = isInShadowPeriod(db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:404:function isInShadowPeriod(db: Database): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:445:    if (isInShadowPeriod(db)) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:17:// (runShadowScoring, logShadowComparison) was permanently disabled in Sprint 7.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:249:export async function runShadowScoring(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:128:Runs a parallel scoring path alongside production results without affecting production output. Logs both production and shadow scores for A/B comparison with channel attribution per result. The shadow write path (`runShadowScoring`, `logShadowComparison`) was permanently disabled in Sprint 7; read-only analysis functions remain available. Added in Sprint 4.
exec
/bin/zsh -lc "rg -n \"AI-WHY|AI-TRACE|AI-GUARD|MODULE:|SPEC_FOLDER_LOCKS\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts | sed -n '1,40p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2:// MODULE: Context Server
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:// AI-WHY(CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
.opencode/skill/system-spec-kit/mcp_server/cli.ts:3:// MODULE: Cli
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:2:// MODULE: Memory Crud Types
.opencode/skill/system-spec-kit/scripts/loaders/index.ts:2:// MODULE: Index
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:2:// MODULE: Session Manager
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:10:// AI-TRACE T302: Import working-memory for immediate cleanup on session end (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:172:// AI-TRACE P4-18: Track periodic cleanup interval for expired sessions
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:176:// AI-TRACE T302: Track stale session cleanup interval (runs hourly)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:195:  // AI-WHY: Set up periodic cleanup instead of only running once at init (P4-18).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:196:  // AI-GUARD: Clear any existing interval first (in case of reinitializeDatabase).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:208:  // AI-GUARD: Ensure interval doesn't prevent process exit (unref allows GC on idle)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:213:  // AI-TRACE T302: Run stale session cleanup on startup and set up hourly interval
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:294:    // AI-WHY: Support both anchor_id (snake_case) and anchorId (camelCase) — callers may pass either form (P4-16).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:      // AI-WHY: Prefer anchor_id (canonical), fall back to anchorId for legacy callers (P4-16)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:305:  // AI-WHY: Fix #37 (017-refinement-phase-6) — Use 128-bit (32 hex chars) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:377:      // AI-GUARD: Preserve first-occurrence decision for the same memory ID — prevents double-counting.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-managerexec
/bin/zsh -lc "rg -n \"retry\\.vitest|retry-manager\\.vitest\" .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
72:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
73:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
 succeeded in 51ms:
# Shared post-mutation hook wiring

## Current Reality

Phase 014 introduced a shared post-mutation hook path across mutation handlers. The same hook automation now runs after save, update, delete, and bulk-delete flows, including atomic save paths, so cache invalidation and follow-up behavior no longer drift by handler.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/mutation-hooks.ts` | Handler | Post-mutation hook dispatch |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Tool Cache |
codex
Representative sampling was used, per your instructions, for the 100+ reference files in `15/09`, `18/02`, `18/03`, `18/08`, `18/09`, and `18/10`.

---
FEATURE: 01-dual-scope-memory-auto-surface
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/context-server.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/hooks/memory-surface.ts defines TOOL_DISPATCH_TOKEN_BUDGET = 4000 and COMPACTION_TOKEN_BUDGET = 4000, skips memory-aware tools, and mcp_server/context-server.ts calls autoSurfaceMemories/autoSurfaceAtCompaction/autoSurfaceAtToolDispatch.

---
FEATURE: 02-constitutional-memory-as-expert-knowledge-injection
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/hooks/memory-surface.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/search/retrieval-directives.ts extracts directive text; mcp_server/hooks/memory-surface.ts applies enrichWithRetrievalDirectives() before returning surfaced constitutional memories.

---
FEATURE: 03-spec-folder-hierarchy-as-retrieval-structure
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: mcp_server/lib/search/spec-folder-hierarchy.ts builds the tree in two passes, caches results with HIERARCHY_CACHE_TTL_MS = 60000, and applies self/ancestor/sibling relevance weights.

---
FEATURE: 04-lightweight-consolidation
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/response-builder.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/storage/consolidation.ts implements contradiction scan, Hebbian updates, stale-edge detection, and weekly gating via consolidation_state; mcp_server/handlers/save/response-builder.ts invokes runConsolidationCycleIfEnabled() after successful save.

---
FEATURE: 05-memory-summary-search-channel
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The doc says querySummaryEmbeddings() returns PipelineRow-compatible results, but mcp_server/lib/search/memory-summaries.ts returns SummarySearchResult[]; conversion to PipelineRow happens later in stage1-candidate-gen.ts.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/memory-summaries.ts defines interface SummarySearchResult and querySummaryEmbeddings(); mcp_server/lib/search/pipeline/stage1-candidate-gen.ts maps sr.memoryId rows into PipelineRow objects.

---
FEATURE: 06-cross-document-entity-linking
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts
UNDOCUMENTED_CAPABILITIES: The linker also enforces MAX_EDGES_PER_NODE = 20 before inserting support edges.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/entity-linker.ts inserts relation='supports', strength=0.7, created_by='entity_linker' and checks density plus per-node edge counts; mcp_server/handlers/save/post-insert.ts runs runEntityLinking() after entity extraction.

---
FEATURE: 07-tier-2-fallback-channel-forcing
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/search/hybrid-search.ts sets forceAllChannels: true in the tier-2 fallback branch; the listed channel-enforcement files are supporting pieces, not the primary switch point.

---
FEATURE: 08-provenance-rich-response-envelopes
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-search.ts, mcp_server/handlers/memory-context.ts, mcp_server/formatters/search-results.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/response/envelope.ts defines scores/source/trace envelope fields; mcp_server/handlers/memory-search.ts and mcp_server/handlers/memory-context.ts forward includeTrace behavior into live tool responses.

---
FEATURE: 09-contextual-tree-injection
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Headers reserve overhead before truncation and trim folder descriptions to a shorter inline tail before the 100-char header cap.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative sample checked. mcp_server/lib/search/hybrid-search.ts injects contextual headers after truncation but reserves header overhead first; mcp_server/tests/hybrid-search-context-headers.vitest.ts covers the behavior.

---
FEATURE: 01-tree-thinning-for-spec-folder-consolidation
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The described bottom-up spec-folder merge pipeline does not exist. There is no applyTreeThinning() and no workflow.ts integration. Actual code scores chunks by anchor presence plus content density, drops chunks below a threshold, and always retains at least one chunk before indexing.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Actual feature is pre-index chunk thinning with DEFAULT_THINNING_THRESHOLD = 0.3 and anchor-weighted scoring.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: mcp_server/lib/chunking/chunk-thinning.ts exports scoreChunk()/thinChunks(); mcp_server/lib/chunking/anchor-chunker.ts chunking thresholds are char-based and unrelated to the documented 200/500/100/300 token rules.

---
FEATURE: 02-architecture-boundary-enforcement
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Automated enforcement exists, but the implementation lives in scripts/evals/check-architecture-boundaries.ts and is wired through scripts/package.json, not in mcp_server/lib/architecture/check-architecture-boundaries.ts.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/lib/architecture/check-architecture-boundaries.ts
MISSING_PATHS: scripts/evals/check-architecture-boundaries.ts, scripts/package.json
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: scripts/package.json runs `npx tsx evals/check-architecture-boundaries.ts` under its check script; scripts/evals/check-architecture-boundaries.ts enforces both shared neutrality and wrapper-only rules.

---
FEATURE: 03-progressive-validation-for-spec-documents
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: scripts/progressive-validate.sh
MISSING_PATHS: scripts/spec/progressive-validate.sh, scripts/spec/validate.sh
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: scripts/spec/progressive-validate.sh documents the 4-level wrapper and sources scripts/spec/validate.sh from the same directory.

---
FEATURE: 04-dead-code-removal
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The current tree confirms some end-state claims, but the exact historical accounting (“approximately 360 lines” and the full removal tally) is not directly recoverable from current source alone.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: Current code still contains learned-feedback.ts:isInShadowPeriod and search/fsrs.ts:computeStructuralFreshness/computeGraphCentrality, while removed items like getSubgraphWeights and isShadowScoringEnabled are referenced only in tests/comments.

---
FEATURE: 05-code-standards-alignment
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The present codebase shows the aligned style, but the exact retrospective counts (“45 violations”, “26 conversions”, “10 headers”) are not verifiable from source state alone.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: This file has no dedicated source files; the claim is a historical remediation summary rather than a behavior encoded in a specific runtime module.

---
FEATURE: 06-real-time-filesystem-watching-with-chokidar
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/context-server.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/ops/file-watcher.ts implements debounce/hash/retry behavior; mcp_server/context-server.ts starts the watcher only when isFileWatcherEnabled() passes.

---
FEATURE: 07-standalone-admin-cli
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/startup-checks.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/cli.ts imports detectNodeVersionMismatch from startup-checks.ts and includes the documented stats/bulk-delete/reindex/schema-downgrade commands.

---
FEATURE: 08-watcher-delete-rename-cleanup
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/context-server.ts, mcp_server/lib/search/vector-index-mutations.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/ops/file-watcher.ts emits unlink -> removeFn; mcp_server/context-server.ts wires removeIndexedMemoriesForFile(); deletion cleanup fans into vector-index-mutations.ts.

---
FEATURE: 01-feature-flag-governance
CATEGORY: 17--governance
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: No runtime module enforces a signal-ceiling guard; mcp_server/lib/search/search-flags.ts only exposes flag helpers, which matches the doc’s “process controls, not hard runtime-enforced caps” claim.

---
FEATURE: 02-feature-flag-sunset-audit
CATEGORY: 17--governance
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The “3 active operational knobs” claim is outdated. The current tree still has additional live env-controlled flags such as SPECKIT_FILE_WATCHER, SPECKIT_RESPONSE_TRACE, SPECKIT_STRICT_SCHEMAS, SPECKIT_DYNAMIC_INIT, SPECKIT_SKIP_API_VALIDATION, and SPECKIT_EXTENDED_TELEMETRY. The 23 exported is* helpers and the always-true SPECKIT_PIPELINE_V2 note are still correct.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Current operational flag surface is broader than the audit describes.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: mcp_server/lib/search/search-flags.ts exports 23 is* helpers; mcp_server/handlers/memory-search.ts reads SPECKIT_RESPONSE_TRACE; mcp_server/schemas/tool-input-schemas.ts reads SPECKIT_STRICT_SCHEMAS; mcp_server/context-server.ts reads SPECKIT_DYNAMIC_INIT and SPECKIT_SKIP_API_VALIDATION.

---
FEATURE: 01-shared-post-mutation-hook-wiring
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/handlers/mutation-hooks.ts centralizes hook execution; the listed broken test path should be retry-manager.vitest.ts or removed.

---
FEATURE: 02-memory-health-autorepair-metadata
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/handlers/memory-crud-health.ts accepts autoRepair and returns repair metadata; the broken source-list path is the stale retry.vitest.ts entry.

---
FEATURE: 03-checkpoint-delete-confirmname-safety
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/handlers/checkpoints.ts requires confirmName to exactly match name; the invalid table entry is again mcp_server/tests/retry.vitest.ts.

---
FEATURE: 04-schema-and-type-contract-synchronization
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/checkpoints.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: schemas/tool-input-schemas.ts makes confirmName required for checkpoint_delete, but the runtime handler in handlers/checkpoints.ts is the concrete behavior layer and is not listed.

---
FEATURE: 05-dedicated-ux-hook-modules
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/hooks/index.ts exports the dedicated hook modules; the only audited mismatch here is the stale retry.vitest.ts path.

---
FEATURE: 06-mutation-hook-result-contract-expansion
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/handlers/mutation-hooks.ts returns latencyMs and cache-clear fields; the path issue is the stale retry.vitest.ts test reference.

---
FEATURE: 07-mutation-response-ux-payload-exposure
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/memory-save.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: These handler files are where postMutationHooks data is actually attached to success responses; the current source list only covers envelope/types support files.

---
FEATURE: 08-context-server-success-hint-append
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/context-server.ts calls appendAutoSurfaceHints() on successful responses; the broken source-list entry is mcp_server/tests/retry.vitest.ts.

---
FEATURE: 09-duplicate-save-no-op-feedback-hardening
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/handlers/memory-save.ts and handlers/save/response-builder.ts suppress false postMutationHooks on duplicate/no-op saves; the listed retry.vitest.ts path is stale.

---
FEATURE: 10-atomic-save-parity-and-partial-indexing-hints
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/handlers/memory-save.ts returns the same postMutationHooks shape in atomicSaveMemory(); the bad table path is mcp_server/tests/retry.vitest.ts.

---
FEATURE: 11-final-token-metadata-recomputation
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/hooks/response-hints.ts, mcp_server/context-server.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: The recomputation path lives in hooks/response-hints.ts and is enforced in context-server.ts before budget checks; token-metrics.ts alone is not the implementation.

---
FEATURE: 12-hooks-readme-and-export-alignment
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/hooks/README.md
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/hooks/index.ts exports the modules, and mcp_server/hooks/README.md documents them; the README is the core artifact missing from the source list.

---
FEATURE: 13-end-to-end-success-envelope-verification
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tests/context-server.vitest.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: The Current Reality text explicitly cites tests/context-server.vitest.ts, and the actual file is mcp_server/tests/context-server.vitest.ts.

---
FEATURE: 01-int8-quantization-evaluation
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: This is a decision record with no dedicated implementation files; the feature correctly documents that status.

---
FEATURE: 02-implemented-graph-centrality-and-community-detection
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/graph/graph-signals.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/search-flags.ts, mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: Community assignments are persisted and community co-members are injected back into Stage 2 results.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/graph/graph-signals.ts applies the N2a/N2b bonuses; mcp_server/lib/graph/community-detection.ts persists community_assignments and mcp_server/lib/search/pipeline/stage2-fusion.ts calls applyCommunityBoost().

---
FEATURE: 03-implemented-auto-entity-extraction
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/extraction/entity-denylist.ts, mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: Entity storage records created_by='auto', and entity_catalog updates append aliases while incrementing memory_count.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/extraction/entity-extractor.ts implements the five regex rules, denylist filtering, memory_entities writes, and entity_catalog upserts; handlers/save/post-insert.ts runs it at save time.

---
FEATURE: 04-implemented-memory-summary-generation
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: Stage 1 over-fetches summary rows with Math.max(limit * 10, 1000) and quality-filters summary hits before merge.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/memory-summaries.ts generates/stores summaries and enforces the >5000 scale gate; mcp_server/lib/search/pipeline/stage1-candidate-gen.ts activates the summary channel at retrieval time.

---
FEATURE: 05-implemented-cross-document-entity-linking
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: The linker also enforces a 20-edge-per-node cap and reports density-guard blocking statistics.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/entity-linker.ts creates supports edges with strength 0.7, checks global density, and limits node fan-out; handlers/save/post-insert.ts runs it after entity extraction.

---
FEATURE: 01-1-search-pipeline-features-speckit
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: SPECKIT_EXTENDED_TELEMETRY is not inert; retrieval-telemetry.ts enables it when the env var is 'true'. SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are documented as active switches, but shared/embeddings.ts hardcodes shouldEagerWarmup() to false and marks both env vars inert. The table also mixes source-file rows with spec-doc names that are not source files.
PATHS_VALID: NO
INVALID_PATHS: All unprefixed Source File entries under lib/..., handlers/..., configs/..., schemas/..., plus context-server.ts and spec-doc names such as spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research.md, handover.md
MISSING_PATHS: Actual implementations live under mcp_server/... for the listed runtime files, including mcp_server/lib/search/search-flags.ts, mcp_server/context-server.ts, mcp_server/handlers/memory-context.ts, mcp_server/lib/search/hybrid-search.ts, mcp_server/schemas/tool-input-schemas.ts, and shared/embeddings.ts
UNDOCUMENTED_CAPABILITIES: SPECKIT_RESPONSE_TRACE can enable envelopes by env flag, and isFileWatcherEnabled()/isLocalRerankerEnabled() require explicit 'true' before rollout gating.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: mcp_server/lib/search/search-flags.ts:isPipelineV2Enabled() always returns true and wraps file-watcher/local-reranker gates; mcp_server/lib/telemetry/retrieval-telemetry.ts checks SPECKIT_EXTENDED_TELEMETRY === 'true'; shared/embeddings.ts marks eager/lazy warmup env vars inert.

---
FEATURE: 02-2-session-and-cache
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: lib/session/session-manager.ts, lib/search/bm25-index.ts, lib/cache/tool-cache.ts
MISSING_PATHS: mcp_server/lib/session/session-manager.ts, mcp_server/lib/search/bm25-index.ts, mcp_server/lib/cache/tool-cache.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: The documented env vars are present in those three modules, but every Source File entry omits the required mcp_server/ prefix.

---
FEATURE: 03-3-mcp-configuration
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: MCP_MAX_MEMORY_TOKENS is documented as warning-only, but preflight.ts marks over-budget content as within_budget = false and emits PF020 errors; warnings only start at MCP_TOKEN_WARNING_THRESHOLD below the hard cap.
PATHS_VALID: NO
INVALID_PATHS: lib/validation/preflight.ts
MISSING_PATHS: mcp_server/lib/validation/preflight.ts
UNDOCUMENTED_CAPABILITIES: Anchor-format failures become warnings unless MCP_ANCHOR_STRICT=true.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/validation/preflight.ts sets result.within_budget = false and pushes TOKEN_BUDGET_EXCEEDED when estimated > maxTokens; strict_anchors=false routes anchor issues to warnings.

---
FEATURE: 04-4-memory-and-storage
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: tests/regression-010-index-large-files.vitest.ts, core/config.ts, lib/search/vector-index-impl.ts
MISSING_PATHS: mcp_server/core/config.ts, mcp_server/lib/search/vector-index-store.ts, mcp_server/handlers/memory-ingest.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: The documented env vars are real, but MEMORY_ALLOWED_PATHS is implemented in runtime path-security/storage code, and vector-index-impl.ts no longer exists.

---
FEATURE: 05-5-embedding-and-api
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: EMBEDDING_DIM is not the general provider-dimension override described; current code only references process.env.EMBEDDING_DIM as a narrow confirmation escape hatch in vector-index-store.ts. API-key rows point to test files instead of the actual provider/reranker modules. Provider selection lives in shared/embeddings/factory.ts, while reranker provider routing lives in mcp_server/lib/search/cross-encoder.ts.
PATHS_VALID: NO
INVALID_PATHS: tests/search-limits-scoring.vitest.ts, lib/search/vector-index-impl.ts, lib/providers/embeddings.ts, tests/embeddings.vitest.ts, lib/search/local-reranker.ts
MISSING_PATHS: mcp_server/lib/search/cross-encoder.ts, mcp_server/lib/search/local-reranker.ts, mcp_server/lib/search/vector-index-store.ts, shared/embeddings/factory.ts, shared/embeddings/providers/openai.ts, shared/embeddings/providers/voyage.ts
UNDOCUMENTED_CAPABILITIES: Cross-encoder has a circuit breaker and provider priority VOYAGE_API_KEY > COHERE_API_KEY > RERANKER_LOCAL; local reranker enforces model-path and memory thresholds before use.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: shared/embeddings/factory.ts resolves EMBEDDINGS_PROVIDER and API-key precedence; mcp_server/lib/search/cross-encoder.ts resolves Voyage/Cohere/local rerank providers; mcp_server/lib/search/vector-index-store.ts only special-cases process.env.EMBEDDING_DIM during dimension confirmation.

---
FEATURE: 06-6-debug-and-telemetry
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: SPECKIT_EXTENDED_TELEMETRY is documented as inert, but retrieval-telemetry.ts enables it when set to 'true'; it is default OFF, not dead.
PATHS_VALID: NO
INVALID_PATHS: lib/parsing/trigger-matcher.ts, lib/utils/logger.ts, lib/eval/eval-logger.ts, handlers/memory-index.ts, lib/telemetry/retrieval-telemetry.ts, lib/telemetry/consumption-logger.ts
MISSING_PATHS: mcp_server/lib/parsing/trigger-matcher.ts, mcp_server/lib/utils/logger.ts, mcp_server/lib/eval/eval-logger.ts, mcp_server/handlers/memory-index.ts, mcp_server/lib/telemetry/retrieval-telemetry.ts, mcp_server/lib/telemetry/consumption-logger.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/telemetry/retrieval-telemetry.ts defines isExtendedTelemetryEnabled() as process.env.SPECKIT_EXTENDED_TELEMETRY === 'true'; consumption-logger.ts is the actually inert one.

---
FEATURE: 07-7-ci-and-build-informational
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: lib/storage/checkpoints.ts
MISSING_PATHS: mcp_server/lib/storage/checkpoints.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/storage/checkpoints.ts reads GIT_BRANCH, BRANCH_NAME, CI_COMMIT_REF_NAME, and VERCEL_GIT_COMMIT_REF exactly as described.
tokens used
981,679
Representative sampling was used, per your instructions, for the 100+ reference files in `15/09`, `18/02`, `18/03`, `18/08`, `18/09`, and `18/10`.

---
FEATURE: 01-dual-scope-memory-auto-surface
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/context-server.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/hooks/memory-surface.ts defines TOOL_DISPATCH_TOKEN_BUDGET = 4000 and COMPACTION_TOKEN_BUDGET = 4000, skips memory-aware tools, and mcp_server/context-server.ts calls autoSurfaceMemories/autoSurfaceAtCompaction/autoSurfaceAtToolDispatch.

---
FEATURE: 02-constitutional-memory-as-expert-knowledge-injection
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/hooks/memory-surface.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/search/retrieval-directives.ts extracts directive text; mcp_server/hooks/memory-surface.ts applies enrichWithRetrievalDirectives() before returning surfaced constitutional memories.

---
FEATURE: 03-spec-folder-hierarchy-as-retrieval-structure
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: mcp_server/lib/search/spec-folder-hierarchy.ts builds the tree in two passes, caches results with HIERARCHY_CACHE_TTL_MS = 60000, and applies self/ancestor/sibling relevance weights.

---
FEATURE: 04-lightweight-consolidation
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/response-builder.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/storage/consolidation.ts implements contradiction scan, Hebbian updates, stale-edge detection, and weekly gating via consolidation_state; mcp_server/handlers/save/response-builder.ts invokes runConsolidationCycleIfEnabled() after successful save.

---
FEATURE: 05-memory-summary-search-channel
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The doc says querySummaryEmbeddings() returns PipelineRow-compatible results, but mcp_server/lib/search/memory-summaries.ts returns SummarySearchResult[]; conversion to PipelineRow happens later in stage1-candidate-gen.ts.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/memory-summaries.ts defines interface SummarySearchResult and querySummaryEmbeddings(); mcp_server/lib/search/pipeline/stage1-candidate-gen.ts maps sr.memoryId rows into PipelineRow objects.

---
FEATURE: 06-cross-document-entity-linking
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts
UNDOCUMENTED_CAPABILITIES: The linker also enforces MAX_EDGES_PER_NODE = 20 before inserting support edges.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/entity-linker.ts inserts relation='supports', strength=0.7, created_by='entity_linker' and checks density plus per-node edge counts; mcp_server/handlers/save/post-insert.ts runs runEntityLinking() after entity extraction.

---
FEATURE: 07-tier-2-fallback-channel-forcing
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/search/hybrid-search.ts sets forceAllChannels: true in the tier-2 fallback branch; the listed channel-enforcement files are supporting pieces, not the primary switch point.

---
FEATURE: 08-provenance-rich-response-envelopes
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-search.ts, mcp_server/handlers/memory-context.ts, mcp_server/formatters/search-results.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/response/envelope.ts defines scores/source/trace envelope fields; mcp_server/handlers/memory-search.ts and mcp_server/handlers/memory-context.ts forward includeTrace behavior into live tool responses.

---
FEATURE: 09-contextual-tree-injection
CATEGORY: 15--retrieval-enhancements
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Headers reserve overhead before truncation and trim folder descriptions to a shorter inline tail before the 100-char header cap.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative sample checked. mcp_server/lib/search/hybrid-search.ts injects contextual headers after truncation but reserves header overhead first; mcp_server/tests/hybrid-search-context-headers.vitest.ts covers the behavior.

---
FEATURE: 01-tree-thinning-for-spec-folder-consolidation
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The described bottom-up spec-folder merge pipeline does not exist. There is no applyTreeThinning() and no workflow.ts integration. Actual code scores chunks by anchor presence plus content density, drops chunks below a threshold, and always retains at least one chunk before indexing.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Actual feature is pre-index chunk thinning with DEFAULT_THINNING_THRESHOLD = 0.3 and anchor-weighted scoring.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: mcp_server/lib/chunking/chunk-thinning.ts exports scoreChunk()/thinChunks(); mcp_server/lib/chunking/anchor-chunker.ts chunking thresholds are char-based and unrelated to the documented 200/500/100/300 token rules.

---
FEATURE: 02-architecture-boundary-enforcement
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Automated enforcement exists, but the implementation lives in scripts/evals/check-architecture-boundaries.ts and is wired through scripts/package.json, not in mcp_server/lib/architecture/check-architecture-boundaries.ts.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/lib/architecture/check-architecture-boundaries.ts
MISSING_PATHS: scripts/evals/check-architecture-boundaries.ts, scripts/package.json
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: scripts/package.json runs `npx tsx evals/check-architecture-boundaries.ts` under its check script; scripts/evals/check-architecture-boundaries.ts enforces both shared neutrality and wrapper-only rules.

---
FEATURE: 03-progressive-validation-for-spec-documents
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: scripts/progressive-validate.sh
MISSING_PATHS: scripts/spec/progressive-validate.sh, scripts/spec/validate.sh
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: scripts/spec/progressive-validate.sh documents the 4-level wrapper and sources scripts/spec/validate.sh from the same directory.

---
FEATURE: 04-dead-code-removal
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The current tree confirms some end-state claims, but the exact historical accounting (“approximately 360 lines” and the full removal tally) is not directly recoverable from current source alone.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: Current code still contains learned-feedback.ts:isInShadowPeriod and search/fsrs.ts:computeStructuralFreshness/computeGraphCentrality, while removed items like getSubgraphWeights and isShadowScoringEnabled are referenced only in tests/comments.

---
FEATURE: 05-code-standards-alignment
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The present codebase shows the aligned style, but the exact retrospective counts (“45 violations”, “26 conversions”, “10 headers”) are not verifiable from source state alone.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: This file has no dedicated source files; the claim is a historical remediation summary rather than a behavior encoded in a specific runtime module.

---
FEATURE: 06-real-time-filesystem-watching-with-chokidar
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/context-server.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/ops/file-watcher.ts implements debounce/hash/retry behavior; mcp_server/context-server.ts starts the watcher only when isFileWatcherEnabled() passes.

---
FEATURE: 07-standalone-admin-cli
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/startup-checks.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/cli.ts imports detectNodeVersionMismatch from startup-checks.ts and includes the documented stats/bulk-delete/reindex/schema-downgrade commands.

---
FEATURE: 08-watcher-delete-rename-cleanup
CATEGORY: 16--tooling-and-scripts
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/context-server.ts, mcp_server/lib/search/vector-index-mutations.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/ops/file-watcher.ts emits unlink -> removeFn; mcp_server/context-server.ts wires removeIndexedMemoriesForFile(); deletion cleanup fans into vector-index-mutations.ts.

---
FEATURE: 01-feature-flag-governance
CATEGORY: 17--governance
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: No runtime module enforces a signal-ceiling guard; mcp_server/lib/search/search-flags.ts only exposes flag helpers, which matches the doc’s “process controls, not hard runtime-enforced caps” claim.

---
FEATURE: 02-feature-flag-sunset-audit
CATEGORY: 17--governance
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The “3 active operational knobs” claim is outdated. The current tree still has additional live env-controlled flags such as SPECKIT_FILE_WATCHER, SPECKIT_RESPONSE_TRACE, SPECKIT_STRICT_SCHEMAS, SPECKIT_DYNAMIC_INIT, SPECKIT_SKIP_API_VALIDATION, and SPECKIT_EXTENDED_TELEMETRY. The 23 exported is* helpers and the always-true SPECKIT_PIPELINE_V2 note are still correct.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Current operational flag surface is broader than the audit describes.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: mcp_server/lib/search/search-flags.ts exports 23 is* helpers; mcp_server/handlers/memory-search.ts reads SPECKIT_RESPONSE_TRACE; mcp_server/schemas/tool-input-schemas.ts reads SPECKIT_STRICT_SCHEMAS; mcp_server/context-server.ts reads SPECKIT_DYNAMIC_INIT and SPECKIT_SKIP_API_VALIDATION.

---
FEATURE: 01-shared-post-mutation-hook-wiring
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/handlers/mutation-hooks.ts centralizes hook execution; the listed broken test path should be retry-manager.vitest.ts or removed.

---
FEATURE: 02-memory-health-autorepair-metadata
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/handlers/memory-crud-health.ts accepts autoRepair and returns repair metadata; the broken source-list path is the stale retry.vitest.ts entry.

---
FEATURE: 03-checkpoint-delete-confirmname-safety
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/handlers/checkpoints.ts requires confirmName to exactly match name; the invalid table entry is again mcp_server/tests/retry.vitest.ts.

---
FEATURE: 04-schema-and-type-contract-synchronization
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/checkpoints.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: schemas/tool-input-schemas.ts makes confirmName required for checkpoint_delete, but the runtime handler in handlers/checkpoints.ts is the concrete behavior layer and is not listed.

---
FEATURE: 05-dedicated-ux-hook-modules
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/hooks/index.ts exports the dedicated hook modules; the only audited mismatch here is the stale retry.vitest.ts path.

---
FEATURE: 06-mutation-hook-result-contract-expansion
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/handlers/mutation-hooks.ts returns latencyMs and cache-clear fields; the path issue is the stale retry.vitest.ts test reference.

---
FEATURE: 07-mutation-response-ux-payload-exposure
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/response-builder.ts, mcp_server/handlers/memory-save.ts, mcp_server/handlers/memory-crud-update.ts, mcp_server/handlers/memory-crud-delete.ts, mcp_server/handlers/memory-bulk-delete.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: These handler files are where postMutationHooks data is actually attached to success responses; the current source list only covers envelope/types support files.

---
FEATURE: 08-context-server-success-hint-append
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/context-server.ts calls appendAutoSurfaceHints() on successful responses; the broken source-list entry is mcp_server/tests/retry.vitest.ts.

---
FEATURE: 09-duplicate-save-no-op-feedback-hardening
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/handlers/memory-save.ts and handlers/save/response-builder.ts suppress false postMutationHooks on duplicate/no-op saves; the listed retry.vitest.ts path is stale.

---
FEATURE: 10-atomic-save-parity-and-partial-indexing-hints
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample checked. mcp_server/handlers/memory-save.ts returns the same postMutationHooks shape in atomicSaveMemory(); the bad table path is mcp_server/tests/retry.vitest.ts.

---
FEATURE: 11-final-token-metadata-recomputation
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/hooks/response-hints.ts, mcp_server/context-server.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: The recomputation path lives in hooks/response-hints.ts and is enforced in context-server.ts before budget checks; token-metrics.ts alone is not the implementation.

---
FEATURE: 12-hooks-readme-and-export-alignment
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/hooks/README.md
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/hooks/index.ts exports the modules, and mcp_server/hooks/README.md documents them; the README is the core artifact missing from the source list.

---
FEATURE: 13-end-to-end-success-envelope-verification
CATEGORY: 18--ux-hooks
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tests/context-server.vitest.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: The Current Reality text explicitly cites tests/context-server.vitest.ts, and the actual file is mcp_server/tests/context-server.vitest.ts.

---
FEATURE: 01-int8-quantization-evaluation
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: This is a decision record with no dedicated implementation files; the feature correctly documents that status.

---
FEATURE: 02-implemented-graph-centrality-and-community-detection
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/graph/graph-signals.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/search-flags.ts, mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: Community assignments are persisted and community co-members are injected back into Stage 2 results.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/graph/graph-signals.ts applies the N2a/N2b bonuses; mcp_server/lib/graph/community-detection.ts persists community_assignments and mcp_server/lib/search/pipeline/stage2-fusion.ts calls applyCommunityBoost().

---
FEATURE: 03-implemented-auto-entity-extraction
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/extraction/entity-denylist.ts, mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: Entity storage records created_by='auto', and entity_catalog updates append aliases while incrementing memory_count.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/extraction/entity-extractor.ts implements the five regex rules, denylist filtering, memory_entities writes, and entity_catalog upserts; handlers/save/post-insert.ts runs it at save time.

---
FEATURE: 04-implemented-memory-summary-generation
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: Stage 1 over-fetches summary rows with Math.max(limit * 10, 1000) and quality-filters summary hits before merge.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/memory-summaries.ts generates/stores summaries and enforces the >5000 scale gate; mcp_server/lib/search/pipeline/stage1-candidate-gen.ts activates the summary channel at retrieval time.

---
FEATURE: 05-implemented-cross-document-entity-linking
CATEGORY: 19--decisions-and-deferrals
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts, mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: The linker also enforces a 20-edge-per-node cap and reports density-guard blocking statistics.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/entity-linker.ts creates supports edges with strength 0.7, checks global density, and limits node fan-out; handlers/save/post-insert.ts runs it after entity extraction.

---
FEATURE: 01-1-search-pipeline-features-speckit
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: SPECKIT_EXTENDED_TELEMETRY is not inert; retrieval-telemetry.ts enables it when the env var is 'true'. SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are documented as active switches, but shared/embeddings.ts hardcodes shouldEagerWarmup() to false and marks both env vars inert. The table also mixes source-file rows with spec-doc names that are not source files.
PATHS_VALID: NO
INVALID_PATHS: All unprefixed Source File entries under lib/..., handlers/..., configs/..., schemas/..., plus context-server.ts and spec-doc names such as spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research.md, handover.md
MISSING_PATHS: Actual implementations live under mcp_server/... for the listed runtime files, including mcp_server/lib/search/search-flags.ts, mcp_server/context-server.ts, mcp_server/handlers/memory-context.ts, mcp_server/lib/search/hybrid-search.ts, mcp_server/schemas/tool-input-schemas.ts, and shared/embeddings.ts
UNDOCUMENTED_CAPABILITIES: SPECKIT_RESPONSE_TRACE can enable envelopes by env flag, and isFileWatcherEnabled()/isLocalRerankerEnabled() require explicit 'true' before rollout gating.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: mcp_server/lib/search/search-flags.ts:isPipelineV2Enabled() always returns true and wraps file-watcher/local-reranker gates; mcp_server/lib/telemetry/retrieval-telemetry.ts checks SPECKIT_EXTENDED_TELEMETRY === 'true'; shared/embeddings.ts marks eager/lazy warmup env vars inert.

---
FEATURE: 02-2-session-and-cache
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: lib/session/session-manager.ts, lib/search/bm25-index.ts, lib/cache/tool-cache.ts
MISSING_PATHS: mcp_server/lib/session/session-manager.ts, mcp_server/lib/search/bm25-index.ts, mcp_server/lib/cache/tool-cache.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: The documented env vars are present in those three modules, but every Source File entry omits the required mcp_server/ prefix.

---
FEATURE: 03-3-mcp-configuration
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: MCP_MAX_MEMORY_TOKENS is documented as warning-only, but preflight.ts marks over-budget content as within_budget = false and emits PF020 errors; warnings only start at MCP_TOKEN_WARNING_THRESHOLD below the hard cap.
PATHS_VALID: NO
INVALID_PATHS: lib/validation/preflight.ts
MISSING_PATHS: mcp_server/lib/validation/preflight.ts
UNDOCUMENTED_CAPABILITIES: Anchor-format failures become warnings unless MCP_ANCHOR_STRICT=true.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/validation/preflight.ts sets result.within_budget = false and pushes TOKEN_BUDGET_EXCEEDED when estimated > maxTokens; strict_anchors=false routes anchor issues to warnings.

---
FEATURE: 04-4-memory-and-storage
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: tests/regression-010-index-large-files.vitest.ts, core/config.ts, lib/search/vector-index-impl.ts
MISSING_PATHS: mcp_server/core/config.ts, mcp_server/lib/search/vector-index-store.ts, mcp_server/handlers/memory-ingest.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: The documented env vars are real, but MEMORY_ALLOWED_PATHS is implemented in runtime path-security/storage code, and vector-index-impl.ts no longer exists.

---
FEATURE: 05-5-embedding-and-api
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: EMBEDDING_DIM is not the general provider-dimension override described; current code only references process.env.EMBEDDING_DIM as a narrow confirmation escape hatch in vector-index-store.ts. API-key rows point to test files instead of the actual provider/reranker modules. Provider selection lives in shared/embeddings/factory.ts, while reranker provider routing lives in mcp_server/lib/search/cross-encoder.ts.
PATHS_VALID: NO
INVALID_PATHS: tests/search-limits-scoring.vitest.ts, lib/search/vector-index-impl.ts, lib/providers/embeddings.ts, tests/embeddings.vitest.ts, lib/search/local-reranker.ts
MISSING_PATHS: mcp_server/lib/search/cross-encoder.ts, mcp_server/lib/search/local-reranker.ts, mcp_server/lib/search/vector-index-store.ts, shared/embeddings/factory.ts, shared/embeddings/providers/openai.ts, shared/embeddings/providers/voyage.ts
UNDOCUMENTED_CAPABILITIES: Cross-encoder has a circuit breaker and provider priority VOYAGE_API_KEY > COHERE_API_KEY > RERANKER_LOCAL; local reranker enforces model-path and memory thresholds before use.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: shared/embeddings/factory.ts resolves EMBEDDINGS_PROVIDER and API-key precedence; mcp_server/lib/search/cross-encoder.ts resolves Voyage/Cohere/local rerank providers; mcp_server/lib/search/vector-index-store.ts only special-cases process.env.EMBEDDING_DIM during dimension confirmation.

---
FEATURE: 06-6-debug-and-telemetry
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: SPECKIT_EXTENDED_TELEMETRY is documented as inert, but retrieval-telemetry.ts enables it when set to 'true'; it is default OFF, not dead.
PATHS_VALID: NO
INVALID_PATHS: lib/parsing/trigger-matcher.ts, lib/utils/logger.ts, lib/eval/eval-logger.ts, handlers/memory-index.ts, lib/telemetry/retrieval-telemetry.ts, lib/telemetry/consumption-logger.ts
MISSING_PATHS: mcp_server/lib/parsing/trigger-matcher.ts, mcp_server/lib/utils/logger.ts, mcp_server/lib/eval/eval-logger.ts, mcp_server/handlers/memory-index.ts, mcp_server/lib/telemetry/retrieval-telemetry.ts, mcp_server/lib/telemetry/consumption-logger.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/telemetry/retrieval-telemetry.ts defines isExtendedTelemetryEnabled() as process.env.SPECKIT_EXTENDED_TELEMETRY === 'true'; consumption-logger.ts is the actually inert one.

---
FEATURE: 07-7-ci-and-build-informational
CATEGORY: 20--feature-flag-reference
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: lib/storage/checkpoints.ts
MISSING_PATHS: mcp_server/lib/storage/checkpoints.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/lib/storage/checkpoints.ts reads GIT_BRANCH, BRANCH_NAME, CI_COMMIT_REF_NAME, and VERCEL_GIT_COMMIT_REF exactly as described.
_MEMORY_TOKENS`, `MCP_TOKEN_WARNING_THRESHOLD`, `MCP_MIN_CONTENT_LENGTH`, `MCP_MAX_CONTENT_LENGTH`, `MCP_DUPLICATE_THRESHOLD`, and `MCP_ANCHOR_STRICT`.

---
FEATURE: `04-4-memory-and-storage.md`
CATEGORY: `20--feature-flag-reference`
DESCRIPTION_ACCURACY: `PARTIAL`
DESCRIPTION_ISSUES: `SPECKIT_DB_DIR` is described as a general DB-directory fallback, but the main vector DB code uses `SPEC_KIT_DB_DIR` or legacy `MEMORY_DB_DIR`; `SPECKIT_DB_DIR` is only read in shared config for shared DB-updated-file resolution. The `MEMORY_ALLOWED_PATHS` source file is also wrong.
PATHS_VALID: `NO`
INVALID_PATHS: All listed unprefixed `core/...`, `lib/...`, and `tests/...` rows are invalid as written; `shared/config.ts` is the only valid listed path. Examples: `tests/regression-010-index-large-files.vitest.ts`, `core/config.ts`, `lib/search/vector-index-impl.ts`.
MISSING_PATHS: `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/handlers/memory-ingest.ts`, `mcp_server/lib/eval/eval-db.ts`, `mcp_server/tests/vector-index-impl.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Vector DB paths can become provider-specific profile paths, and allowed roots always include `specs/`, `.opencode/`, `~/.claude`, and `cwd` in addition to `MEMORY_ALLOWED_PATHS`.
SEVERITY: `P1`
RECOMMENDED_ACTION: `BOTH`
EVIDENCE: `vector-index-store.ts` uses `SPEC_KIT_DB_DIR || MEMORY_DB_DIR || default`, honors `MEMORY_DB_PATH`, and appends env-provided `MEMORY_ALLOWED_PATHS` to a built-in allowlist.

---
FEATURE: `05-5-embedding-and-api.md`
CATEGORY: `20--feature-flag-reference`
DESCRIPTION_ACCURACY: `INACCURATE`
DESCRIPTION_ISSUES: Multiple rows are stale or wrong. `EMBEDDING_DIM` is not a general provider-dimension override, `RERANKER_LOCAL` memory-threshold details are outdated, and `COHERE_API_KEY` routing is described too loosely. The page also omits live knobs `SPECKIT_RERANKER_MODEL` and `SPECKIT_RERANKER_TIMEOUT_MS`.
PATHS_VALID: `NO`
INVALID_PATHS: All listed paths are invalid as written because the `mcp_server/` prefix is missing. Examples: `lib/providers/embeddings.ts`, `lib/search/local-reranker.ts`, `tests/embeddings.vitest.ts`, `tests/search-limits-scoring.vitest.ts`, `lib/search/vector-index-impl.ts`.
MISSING_PATHS: `shared/embeddings/factory.ts`, `mcp_server/lib/search/cross-encoder.ts`, `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/tests/cross-encoder-extended.vitest.ts`, `mcp_server/tests/local-reranker.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Local reranker supports custom model and timeout env vars (`SPECKIT_RERANKER_MODEL`, `SPECKIT_RERANKER_TIMEOUT_MS`), and provider auto-detection skips placeholder API keys.
SEVERITY: `P1`
RECOMMENDED_ACTION: `REWRITE`
EVIDENCE: `local-reranker.ts` reads `SPECKIT_RERANKER_MODEL` and `SPECKIT_RERANKER_TIMEOUT_MS`; `cross-encoder.ts` resolves providers in order `VOYAGE_API_KEY`, `COHERE_API_KEY`, `RERANKER_LOCAL`; `vector-index-store.ts` derives dimensions from the active provider/profile.

---
FEATURE: `06-6-debug-and-telemetry.md`
CATEGORY: `20--feature-flag-reference`
DESCRIPTION_ACCURACY: `PARTIAL`
DESCRIPTION_ISSUES: `SPECKIT_EXTENDED_TELEMETRY` is not inert or deprecated in the current code; it is a live flag with default OFF that enables detailed retrieval telemetry. The other rows are broadly accurate.
PATHS_VALID: `NO`
INVALID_PATHS: All listed paths are invalid as written because the `mcp_server/` prefix is missing. Examples: `lib/parsing/trigger-matcher.ts`, `lib/utils/logger.ts`, `lib/eval/eval-logger.ts`, `handlers/memory-index.ts`, `lib/telemetry/retrieval-telemetry.ts`, `lib/telemetry/consumption-logger.ts`.
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`, `mcp_server/handlers/memory-context.ts`, `mcp_server/handlers/memory-triggers.ts`
UNDOCUMENTED_CAPABILITIES: Eval logging is fail-safe/no-op unless explicitly `true`; retrieval telemetry tracks latency, mode, fallback, quality, and optional sanitized trace payloads.
SEVERITY: `P1`
RECOMMENDED_ACTION: `BOTH`
EVIDENCE: `retrieval-telemetry.ts` states `Feature flag: SPECKIT_EXTENDED_TELEMETRY (default false / disabled)` and only enables the detailed path when `process.env.SPECKIT_EXTENDED_TELEMETRY === 'true'`.

---
FEATURE: `07-7-ci-and-build-informational.md`
CATEGORY: `20--feature-flag-reference`
DESCRIPTION_ACCURACY: `PARTIAL`
DESCRIPTION_ISSUES: The intro says these vars annotate checkpoint and evaluation records, but current runtime usage is in checkpoints only; no matching `lib/eval/*` usage was found.
PATHS_VALID: `NO`
INVALID_PATHS: All listed `lib/storage/checkpoints.ts` references are invalid as written because the `mcp_server/` prefix is missing.
MISSING_PATHS: `NONE`
UNDOCUMENTED_CAPABILITIES: `NONE`
SEVERITY: `P2`
RECOMMENDED_ACTION: `BOTH`
EVIDENCE: `checkpoints.ts` reads `GIT_BRANCH`, `BRANCH_NAME`, `CI_COMMIT_REF_NAME`, and `VERCEL_GIT_COMMIT_REF`; no corresponding runtime eval usage appears under `lib/eval/*`.
