OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cd69c-91e7-7620-b4bd-543b64703504
--------
user
You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 22 feature files across 3 categories.

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 01-retrieval: 1 pass, 8 issues (5 desc+paths, 3 paths-only). Feature 01 passed.
- Category 02-mutation: 0 passes, 10 issues (2 rewrites, 4 desc+paths, 3 paths, 1 desc). Rewrites: 07-namespace-management, 10-per-memory-history-log.
- Category 03-discovery: 0 passes, 3 issues (all desc+paths).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts (affects 52 files).

YOUR ASSIGNED DIRECTORIES (22 files total):
- .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/ (9 files)
- .opencode/skill/system-spec-kit/feature_catalog/02--mutation/ (10 files)
- .opencode/skill/system-spec-kit/feature_catalog/03--discovery/ (3 files)

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
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m auditing the 22 feature files against the actual MCP server source, and I’ll start by listing the assigned feature docs, checking the applicable local instructions, and then verifying paths and behavior category by category.
exec
/bin/zsh -lc 'pwd && rg --files .opencode/skill/system-spec-kit/feature_catalog/01--retrieval .opencode/skill/system-spec-kit/feature_catalog/02--mutation .opencode/skill/system-spec-kit/feature_catalog/03--discovery' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md' -g '.opencode/**/AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md
.opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md
 succeeded in 53ms:
AGENTS.md
.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Audit feature catalog docs against TypeScript MCP server source code, verify file paths, and identify undocumented capabilities" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 612ms:
[
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !audit, !audit(multi), !intent:review, code(name), review(name)"
  },
  {
    "skill": "mcp-clickup",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, code, docs, feature~, mcp(name)"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
codex
The local routing check pointed strongly to `sk-code--review`, so I’m loading that guidance plus the root `AGENTS.md`, then I’ll inspect the feature docs and source files in batches so the audit stays consistent.
exec
/bin/zsh -lc "sed -n '1,220p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

 succeeded in 51ms:
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

Plan update
SKILL ROUTING: `sk-code--review` (confidence 0.95, uncertainty 0.23). This is a read-only audit, so I’m proceeding with a findings-first review flow: inventory docs, verify referenced paths, inspect code behavior, then synthesize one structured block per feature.
  → Inventory the 22 assigned feature docs and capture their source-file tables
  • Verify listed implementation/test paths exist on disk
  • Read key referenced source files and compare behavior to each Current Reality section
  • Produce structured audit results for all 22 features with evidence
codex
I’ve got the file inventory and the review skill loaded. Next I’m parsing the feature docs themselves so I can verify the exact source-file lists and compare each “Current Reality” section directly to the code they cite.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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

 succeeded in 50ms:
# Memory indexing (memory_save)

## Current Reality

`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.

Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. BM25 has a separate normalization entry point (`normalizeContentForBM25`) that currently delegates to the embedding normalizer, and it is used on rebuild-from-database paths. In live save paths, raw content is passed to BM25 tokenization (`addDocument`) before tokenizer normalization.

The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.

A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves.

Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet; it builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.

 succeeded in 52ms:
# Memory browser (memory_list)

## Current Reality

Paginated browsing of everything the memory system knows. You can sort by creation date, update date or importance weight. Filter by spec folder. Optionally include child chunk rows alongside parent memories (off by default for cleaner browsing).

Each entry shows its numeric ID, spec folder, title, creation and update timestamps, importance weight, trigger phrase count and file path. The response includes a total count and pagination hints (like "More results available: use offset: 40") for navigating forward. Default page size is 20, maximum is 100.

This is the starting point for any manual memory management workflow. Need to delete a specific memory? Browse to find its ID. Want to audit what is indexed under a spec folder? Filter by folder and scan the results. Wondering why a memory is not surfacing in search? Look up its importance weight and tier here.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
codex
The sandbox won’t let me use heredocs, so I’m switching to inline commands to extract the path tables and counts. After that I’ll start checking the source behavior against the feature descriptions in order.
exec
/bin/zsh -lc 'python3 -c $'"'from pathlib import Path\\nimport re\\nroot=Path(\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public\")\\nfeature_dirs=[root/\".opencode/skill/system-spec-kit/feature_catalog/01--retrieval\",root/\".opencode/skill/system-spec-kit/feature_catalog/02--mutation\",root/\".opencode/skill/system-spec-kit/feature_catalog/03--discovery\"]\\nfor d in feature_dirs:\\n    print(f\"## {d.name}\")\\n    for p in sorted(d.glob(\"*.md\")):\\n        text=p.read_text()\\n        impl=re.search(r\"### Implementation\\\\n\\\\n((?:\\\\|.*\\\\n)+)\", text)\\n        tests=re.search(r\"### Tests\\\\n\\\\n((?:\\\\|.*\\\\n)+)\", text)\\n        def paths(block):\\n            out=[]\\n            if not block: return out\\n            for line in block.group(1).splitlines():\\n                if not line.startswith(\"| "'`"): continue'"\\n                m=re.match(r\"\\\\| "'`([''^`]+)` '"\\\\|\", line)\\n                if m: out.append(m.group(1))\\n            return out\\n        impl_paths=paths(impl)\\n        test_paths=paths(tests)\\n        total=len(impl_paths)+len(test_paths)\\n        print(f\"{p.name}\\\\timpl={len(impl_paths)}\\\\ttest={len(test_paths)}\\\\ttotal={total}\")\\n    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 642ms:
## 01--retrieval
01-unified-context-retrieval-memorycontext.md	impl=123	test=118	total=241
02-semantic-and-lexical-search-memorysearch.md	impl=111	test=102	total=213
03-trigger-phrase-matching-memorymatchtriggers.md	impl=70	test=59	total=129
04-hybrid-search-pipeline.md	impl=63	test=65	total=128
05-4-stage-pipeline-architecture.md	impl=89	test=86	total=175
06-bm25-trigger-phrase-re-index-gate.md	impl=3	test=3	total=6
07-ast-level-section-retrieval-tool.md	impl=0	test=0	total=0
08-quality-aware-3-tier-search-fallback.md	impl=2	test=3	total=5
09-tool-result-extraction-to-working-memory.md	impl=2	test=3	total=5

## 02--mutation
01-memory-indexing-memorysave.md	impl=102	test=77	total=179
02-memory-metadata-update-memoryupdate.md	impl=62	test=46	total=108
03-single-and-folder-delete-memorydelete.md	impl=132	test=106	total=238
04-tier-based-bulk-deletion-memorybulkdelete.md	impl=64	test=51	total=115
05-validation-feedback-memoryvalidate.md	impl=132	test=106	total=238
06-transaction-wrappers-on-mutation-handlers.md	impl=40	test=31	total=71
07-namespace-management-crud-tools.md	impl=189	test=156	total=345
08-prediction-error-save-arbitration.md	impl=4	test=4	total=8
exec
/bin/zsh -lc 'python3 -c $'"'from pathlib import Path\\nimport re\\nroot=Path(\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public\")\\nbase=root/\".opencode/skill/system-spec-kit\"\\nfeature_dirs=[base/\"feature_catalog/01--retrieval\",base/\"feature_catalog/02--mutation\",base/\"feature_catalog/03--discovery\"]\\nfor d in feature_dirs:\\n    print(f\"## {d.name}\")\\n    for p in sorted(d.glob(\"*.md\")):\\n        text=p.read_text()\\n        impl=re.search(r\"### Implementation\\\\n\\\\n((?:\\\\|.*\\\\n)+)\", text)\\n        tests=re.search(r\"### Tests\\\\n\\\\n((?:\\\\|.*\\\\n)+)\", text)\\n        def paths(block):\\n            out=[]\\n            if not block: return out\\n            for line in block.group(1).splitlines():\\n                if not line.startswith(\"| "'`"): continue'"\\n                m=re.match(r\"\\\\| "'`([''^`]+)` '"\\\\|\", line)\\n                if m: out.append(m.group(1))\\n            return out\\n        impl_paths=paths(impl)\\n        test_paths=paths(tests)\\n        total=len(impl_paths)+len(test_paths)\\n        if total>=100:\\n            checked=impl_paths[:10]+test_paths[:5]\\n            scope=\"sample\"\\n        else:\\n            checked=impl_paths+test_paths\\n            scope=\"full\"\\n        missing=[q for q in checked if not (base/q).is_file()]\\n        print(f\"{p.name}: scope={scope} checked={len(checked)} missing={len(missing)}\")\\n        for m in missing:\\n            print('  MISSING',m)\\n    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 574ms:
  File "<string>", line 32
    print(
          ^
SyntaxError: unexpected EOF while parsing
codex
I’ve confirmed these docs are large enough that several fall under the “sample path verification” rule. I’m now generating a per-feature path check summary so I can separate genuine path problems from description mismatches.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const path=require('path'); const root='/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public'; const base=path.join(root,'.opencode/skill/system-spec-kit'); const dirs=['feature_catalog/01--retrieval','feature_catalog/02--mutation','feature_catalog/03--discovery']; const rxBlock=label=>new RegExp('### '+label+'\\\\n\\\\n((?:\\\\|.*\\\\n)+)'); const rxPath=/"'^'"\\| "'`([''^`]+)` '"\\|/; for (const dir of dirs){ console.log('## '+path.basename(dir)); for (const name of fs.readdirSync(path.join(base,dir)).filter(f=>f.endsWith('.md')).sort()){ const text=fs.readFileSync(path.join(base,dir,name),'utf8'); const getPaths=(label)=>{ const m=text.match(rxBlock(label)); if("'!m) return []; return m[1].split(/'"\\n/).filter(line=>line.startsWith('| "'`'"')).map(line=>(line.match(rxPath)||[])[1]).filter(Boolean); }; const impl=getPaths('Implementation'); const tests=getPaths('Tests'); const total=impl.length+tests.length; const checked=total>=100 ? [...impl.slice(0,10), ...tests.slice(0,5)] : [...impl, ...tests]; const missing=checked.filter(rel=>"'!fs.existsSync(path.join(base,rel))); console.log(name+'"': scope='+(total>=100?'sample':'full')+' checked='+checked.length+' missing=' + missing.length); for (const rel of missing) console.log('  MISSING '+rel); } console.log(''); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:
zsh:1: parse error near `[^'
zsh:1: parse error in command substitution
exec
/bin/zsh -lc 'node -e $'"'const fs=require(\"fs\");\\nconst path=require(\"path\");\\nconst root=\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public\";\\nconst base=path.join(root,\".opencode/skill/system-spec-kit\");\\nconst dirs=[\"feature_catalog/01--retrieval\",\"feature_catalog/02--mutation\",\"feature_catalog/03--discovery\"];\\nconst rxBlock=(label)=>new RegExp(\"### \"+label+\"\\\\n\\\\n((?:\\\\\\\\|.*\\\\n)+)\");\\nconst rxPath=/"'^'"\\\\| "'`([''^`]+)` '"\\\\|/;\\nfor (const dir of dirs){\\n  console.log(\"## \"+path.basename(dir));\\n  for (const name of fs.readdirSync(path.join(base,dir)).filter(f=>f.endsWith(\".md\")).sort()){\\n    const text=fs.readFileSync(path.join(base,dir,name),\"utf8\");\\n    const getPaths=(label)=>{\\n      const m=text.match(rxBlock(label));\\n      if("'!m) return [];'"\\n      return m[1].split(/\\\\n/).filter(line=>line.startsWith(\"| "'`")).map(line=>((line.match(rxPath)||[])[1])).filter(Boolean);'"\\n    };\\n    const impl=getPaths(\"Implementation\");\\n    const tests=getPaths(\"Tests\");\\n    const total=impl.length+tests.length;\\n    const checked=total>=100 ? [...impl.slice(0,10), ...tests.slice(0,5)] : [...impl, ...tests];\\n    const missing=checked.filter(rel=>"'!fs.existsSync(path.join(base,rel)));'"\\n    console.log(name+\": scope=\"+(total>=100?\"sample\":\"full\")+\" checked=\"+checked.length+\" missing=\"+missing.length);\\n    for (const rel of missing) console.log(\"  MISSING \"+rel);\\n  }\\n  console.log(\"\");\\n}'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
## 01--retrieval
01-unified-context-retrieval-memorycontext.md: scope=sample checked=15 missing=0
02-semantic-and-lexical-search-memorysearch.md: scope=sample checked=15 missing=0
03-trigger-phrase-matching-memorymatchtriggers.md: scope=sample checked=15 missing=0
04-hybrid-search-pipeline.md: scope=sample checked=15 missing=0
05-4-stage-pipeline-architecture.md: scope=sample checked=15 missing=0
06-bm25-trigger-phrase-re-index-gate.md: scope=full checked=6 missing=0
07-ast-level-section-retrieval-tool.md: scope=full checked=0 missing=0
08-quality-aware-3-tier-search-fallback.md: scope=full checked=5 missing=0
09-tool-result-extraction-to-working-memory.md: scope=full checked=5 missing=0

## 02--mutation
01-memory-indexing-memorysave.md: scope=sample checked=15 missing=0
02-memory-metadata-update-memoryupdate.md: scope=sample checked=15 missing=0
03-single-and-folder-delete-memorydelete.md: scope=sample checked=15 missing=0
04-tier-based-bulk-deletion-memorybulkdelete.md: scope=sample checked=15 missing=0
05-validation-feedback-memoryvalidate.md: scope=sample checked=15 missing=0
06-transaction-wrappers-on-mutation-handlers.md: scope=full checked=71 missing=1
  MISSING mcp_server/tests/retry.vitest.ts
07-namespace-management-crud-tools.md: scope=sample checked=15 missing=0
exec
/bin/zsh -lc 'node -e $'"'const fs=require(\"fs\");\\nconst path=require(\"path\");\\nconst root=\"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public\";\\nconst base=path.join(root,\".opencode/skill/system-spec-kit\");\\nconst dirs=[\"feature_catalog/01--retrieval\",\"feature_catalog/02--mutation\",\"feature_catalog/03--discovery\"];\\nconst rxBlock=(label)=>new RegExp(\"### \"+label+\"\\\\n\\\\n((?:\\\\\\\\|.*\\\\n)+)\");\\nconst rxPath=/"'^'"\\\\| "'`([''^`]+)` '"\\\\|/;\\nfor (const dir of dirs){\\n  console.log(\"## \"+path.basename(dir));\\n  for (const name of fs.readdirSync(path.join(base,dir)).filter(f=>f.endsWith(\".md\")).sort()){\\n    const text=fs.readFileSync(path.join(base,dir,name),\"utf8\");\\n    const getPaths=(label)=>{\\n      const m=text.match(rxBlock(label));\\n      if("'!m) return [];'"\\n      return m[1].split(/\\\\n/).filter(line=>line.startsWith(\"| "'`")).map(line=>((line.match(rxPath)||[])[1])).filter(Boolean);'"\\n    };\\n    const paths=[...getPaths(\"Implementation\"), ...getPaths(\"Tests\")];\\n    const missing=paths.filter(rel=>"'!fs.existsSync(path.join(base,rel)));'"\\n    if(missing.length){\\n      console.log(name+\": missing=\"+missing.length);\\n      for (const rel of missing) console.log(\"  \"+rel);\\n    }\\n  }\\n  console.log(\"\");\\n}'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
## 01--retrieval
01-unified-context-retrieval-memorycontext.md: missing=1
  mcp_server/tests/retry.vitest.ts
02-semantic-and-lexical-search-memorysearch.md: missing=1
  mcp_server/tests/retry.vitest.ts
03-trigger-phrase-matching-memorymatchtriggers.md: missing=1
  mcp_server/tests/retry.vitest.ts
04-hybrid-search-pipeline.md: missing=1
  mcp_server/tests/retry.vitest.ts
05-4-stage-pipeline-architecture.md: missing=1
  mcp_server/tests/retry.vitest.ts

## 02--mutation
01-memory-indexing-memorysave.md: missing=1
  mcp_server/tests/retry.vitest.ts
02-memory-metadata-update-memoryupdate.md: missing=1
  mcp_server/tests/retry.vitest.ts
03-single-and-folder-delete-memorydelete.md: missing=1
  mcp_server/tests/retry.vitest.ts
04-tier-based-bulk-deletion-memorybulkdelete.md: missing=1
codex
I’ve now confirmed the known missing test path is real: `mcp_server/tests/retry.vitest.ts` is absent wherever it’s listed. I’m moving from path validation into behavior validation, starting with the retrieval handlers and their tests.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Context
     3	// ---------------------------------------------------------------
     4	
     5	import { randomUUID } from 'crypto';
     6	
     7	// Layer definitions
     8	import * as layerDefs from '../lib/architecture/layer-definitions';
     9	import { checkDatabaseUpdated } from '../core';
    10	import { toErrorMessage } from '../utils';
    11	
    12	// Intent classifier
    13	import * as intentClassifier from '../lib/search/intent-classifier';
    14	
    15	// Core handlers for routing
    16	import { handleMemorySearch } from './memory-search';
    17	import { handleMemoryMatchTriggers } from './memory-triggers';
    18	
    19	// Response envelope
    20	import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope';
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Search Flags
     3	// ---------------------------------------------------------------
     4	// Default-on runtime gates for search pipeline controls
     5	//
     6	// Production-ready flags graduated to default-ON.
     7	// Set SPECKIT_<FLAG>=false to disable any graduated feature.
     8	
     9	import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
    10	
    11	/**
    12	 * Graph-guided MMR diversity reranking.
    13	 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
    14	 */
    15	export function isMMREnabled(): boolean {
    16	  return isFeatureEnabled('SPECKIT_MMR');
    17	}
    18	
    19	/**
    20	 * Transparent Reasoning Module (evidence-gap detection).
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Intent Classifier
     3	// ---------------------------------------------------------------
     4	/* --- 1. TYPES & CONSTANTS --- */
     5	
     6	type IntentType = 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';
     7	
     8	interface IntentResult {
     9	  intent: IntentType;
    10	  confidence: number;
    11	  scores: Record<IntentType, number>;
    12	  keywords: string[];
    13	}
    14	
    15	interface IntentWeights {
    16	  recency: number;
    17	  importance: number;
    18	  similarity: number;
    19	  contextType: string | null;
    20	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '240,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '620,1080p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   620	        filePath: item.filePath,
   621	        attentionScore: item.attentionScore,
   622	      }));
   623	      (budgetedResult as Record<string, unknown>).systemPromptContextInjected = true;
   624	    }
   625	  }
   626	
   627	  // Build response with layer metadata
   628	  const _contextResponse = createMCPResponse({
   629	    tool: 'memory_context',
   630	    summary: enforcement.truncated
   631	      ? `Context retrieved via ${effectiveMode} mode (${budgetedResult.strategy} strategy) [truncated: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results to fit ${effectiveBudget} token budget]`
   632	      : `Context retrieved via ${effectiveMode} mode (${budgetedResult.strategy} strategy)`,
   633	    data: budgetedResult,
   634	    hints: [
   635	      `Mode: ${CONTEXT_MODES[effectiveMode].description}`,
   636	      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
   637	      `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,
   638	      ...(pressureWarning ? [pressureWarning] : [])
   639	    ],
 succeeded in 53ms:
   240	/* ---------------------------------------------------------------
   241	   3. CONTEXT MODE DEFINITIONS
   242	--------------------------------------------------------------- */
   243	
   244	const CONTEXT_MODES: Record<string, ContextMode> = {
   245	  // Auto-detect: Let the system determine the best approach
   246	  auto: {
   247	    name: 'Auto',
   248	    description: 'Automatically detect intent and route to optimal strategy',
   249	    strategy: 'adaptive'
   250	  },
   251	
   252	  // Quick: Fast trigger-based matching for reactive context
   253	  quick: {
   254	    name: 'Quick',
   255	    description: 'Fast trigger matching for real-time context (low latency)',
   256	    strategy: 'triggers',
   257	    tokenBudget: 800
   258	  },
   259	
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Folder Discovery
     3	// ---------------------------------------------------------------
     4	import * as fs from 'node:fs';
     5	import * as path from 'node:path';
     6	import * as crypto from 'node:crypto';
     7	import { stripYamlFrontmatter } from '../parsing/content-normalizer';
     8	
     9	/* --- 1. TYPES --- */
    10	
    11	/**
    12	 * Describes a single spec folder with its cached description
    13	 * and extracted keywords for lightweight matching.
    14	 */
    15	export interface FolderDescription {
    16	  specFolder: string;
    17	  description: string;
    18	  keywords: string[];
    19	  lastUpdated: string;
    20	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Search
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   1. DEPENDENCIES
     7	--------------------------------------------------------------- */
     8	
     9	import * as toolCache from '../lib/cache/tool-cache';
    10	import * as sessionManager from '../lib/session/session-manager';
    11	import * as intentClassifier from '../lib/search/intent-classifier';
    12	// AI-WHY: tierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
    13	import { isEnabled as isSessionBoostEnabled } from '../lib/search/session-boost';
    14	import { isEnabled as isCausalBoostEnabled } from '../lib/search/causal-boost';
    15	// Sprint 5 (R6): 4-stage pipeline architecture
    16	import { executePipeline } from '../lib/search/pipeline';
    17	import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline';
    18	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
    19	// AI-TRACE:C136-09: Artifact-class routing (spec/plan/tasks/checklist/memory)
    20	import { applyRoutingWeights, getStrategyForQuery } from '../lib/search/artifact-routing';
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Hybrid Search
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Combines vector, FTS, and BM25 search with fallback
     5	
     6	/* --- 1. IMPORTS --- */
     7	
     8	// Local
     9	import { getIndex } from './bm25-index';
    10	import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
    11	import { hybridAdaptiveFuse } from '@spec-kit/shared/algorithms/adaptive-fusion';
    12	import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cache/cognitive/co-activation';
    13	import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
    14	import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier';
    15	import { fts5Bm25Search } from './sqlite-fts';
    16	import {
    17	  isMMREnabled,
    18	  isCrossEncoderEnabled,
    19	  isLocalRerankerEnabled,
    20	  isSearchFallbackEnabled,
 succeeded in 53ms:
     1	# Semantic and lexical search (memory_search)
     2	
     3	## Current Reality
     4	
     5	This is the primary search tool, and it does a lot. You give it a natural language query (or a multi-concept array of 2-5 strings where all concepts must match), and it runs the full hybrid retrieval pipeline.
     6	
     7	The search path is the 4-stage pipeline architecture (V2 is the sole runtime path; `SPECKIT_PIPELINE_V2` is deprecated/inert). The pipeline starts with Stage 1 candidate generation, which selects search channels based on query type: multi-concept queries run per-concept embeddings, deep mode expands into up to 3 query variants, and when embedding expansion is active a baseline plus expanded-query search run in parallel. Constitutional memories are injected if none appear in the initial candidate set. Stage 2 applies all scoring signals in a single pass: session boost, causal boost, co-activation spreading, community co-retrieval from precomputed `community_assignments`, graph signals (N2a+N2b), FSRS testing effect, intent weights (for non-hybrid only, preventing G2 double-weighting), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation and validation metadata enrichment. Stage 3 handles cross-encoder reranking and MPAB chunk-to-memory aggregation with document-order reassembly. Stage 4 filters by memory state, runs TRM evidence gap detection and enforces a score immutability invariant that prevents any score modifications after reranking.
     8	
     9	A deep mode expands the query into up to 3 variants using `expandQuery()`, runs hybrid search for each variant in parallel and merges results with deduplication. Results are cached per parameter combination via `toolCache.withCache()`, and session deduplication runs after cache so that cache hits still respect session state.
    10	
    11	The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
    12	
    13	## Source Files
    14	
    15	### Implementation
    16	
    17	| File | Layer | Role |
    18	|------|-------|------|
    19	| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
    20	| `mcp_server/core/config.ts` | Core | Server configuration |
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "Constitutional|includeConstitutional|constitutional" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts -S' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"concepts|minState|includeArchived|toolCache|autoDetectIntent|enableSessionBoost|enableCausalBoost|trackAccess|includeTrace|bypassCache|mode === 'deep'|expandQuery|session dedup|dedup\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline -S" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:117:  includeConstitutional?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:273:  includeConstitutional: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:300:  includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:    includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:598:    includeConstitutional: includeConstitutional = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:747:    includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:789:          includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:20://   - Constitutional memory injection (if not already present)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:29://     - Constitutional rows are always present when includeConstitutional=true and no tier filter
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:56:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:147: * and `config.mode`, then applies constitutional injection, quality filtering,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:159:  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:161:  let constitutionalInjectedCount = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:174:    includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:221:    // Fix #16 — Cache this embedding for reuse in constitutional injection path
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:391:            includeConstitutional: false, // Constitutional managed separately below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:422:      includeConstitutional: false, // Constitutional managed separately below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:437:  // Applied after candidate collection but before constitutional injection so
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:438:  // injected constitutional rows are evaluated by the same filters.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:454:  // -- Constitutional Memory Injection ----------------------------------------
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Stage1 Candidate Gen
     3	// ---------------------------------------------------------------
     4	// Sprint 5 (R6): 4-Stage Retrieval Pipeline Architecture
     5	// ---------------------------------------------------------------
     6	//
     7	// Responsibility: Execute search channels and collect raw candidate results.
     8	// This stage performs NO scoring modifications — it only retrieves candidates
     9	// from the appropriate search channel based on search type.
    10	//
    11	// Search channels handled:
    12	//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
    13	//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
    14	//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
    15	//                         Suppressed when R15 classifies query as "simple" (mutual exclusion)
    16	//   - hybrid: searchWithFallback → falls back to vector on failure
    17	//   - vector: Direct vectorSearch
    18	//
    19	// Post-channel operations:
    20	//   - Constitutional memory injection (if not already present)
 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:9:import * as toolCache from '../lib/cache/tool-cache';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:87:  dedupStats: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:110:  concepts?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:120:  bypassCache?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:124:  autoDetectIntent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:125:  minState?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:129:  trackAccess?: boolean; // AI-TRACE:P3-09: opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:130:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:131:  enableSessionBoost?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:132:  enableCausalBoost?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:136:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:262:  concepts?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:269:  includeArchived: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:277:  minState: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:281:  enableSessionBoost: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:282:  enableCausalBoost: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:283:  includeTrace?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:289:  concepts,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:296:  includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:304:  minState,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '590,1020p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"function multiConceptSearch|multiConceptSearch\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server -S" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Vector Index
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Backward-compatible export surface across split modules.
     5	
     6	export * from './vector-index-types';
     7	export * from './vector-index-schema';
     8	export * from './vector-index-mutations';
     9	export * from './vector-index-queries';
    10	export * from './vector-index-aliases';
    11	
    12	// Re-export store items that aren't re-exported by other modules
    13	export {
    14	  initializeDb,
    15	  initialize_db,
    16	  closeDb,
    17	  close_db,
    18	  getDb,
    19	  get_db,
    20	  getDbPath,
 succeeded in 52ms:
   590	    query,
   591	    concepts,
   592	    specFolder,
   593	    limit: rawLimit = 10,
   594	    tier,
   595	    contextType,
   596	    useDecay: useDecay = true,
   597	    includeContiguity: includeContiguity = false,
   598	    includeConstitutional: includeConstitutional = true,
   599	    includeContent: includeContent = false,
   600	    anchors,
   601	    bypassCache: bypassCache = false,
   602	    sessionId,
   603	    enableDedup: enableDedup = true,
   604	    intent: explicitIntent,
   605	    autoDetectIntent: autoDetectIntent = true,
   606	    minState: minState = 'WARM',
   607	    applyStateLimits: applyStateLimits = false,
   608	    rerank = true, // AI-TRACE:C138-P2: Enable reranking by default for better result quality
   609	    applyLengthPenalty: applyLengthPenalty = true,
 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:209:    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:293:    // multiConceptSearch(embeddings, options) — options is index 1
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1138:      const mcResults = mod.multiConceptSearch([emb1, emb2], { limit: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1145:        mod.multiConceptSearch([makeEmbedding(1)], { limit: 5 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:209:    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Triggers
     3	// ---------------------------------------------------------------
     4	
     5	// Shared packages
     6	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
     7	
     8	/* ---------------------------------------------------------------
     9	   1. DEPENDENCIES
    10	--------------------------------------------------------------- */
    11	
    12	// Core utilities
    13	import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
    14	import { toErrorMessage } from '../utils';
    15	import { createFilePathValidator } from '../utils/validators';
    16	
    17	// Formatters
    18	import { calculateTokenMetrics, type TokenMetrics } from '../formatters';
    19	
    20	// Lib modules
 succeeded in 52ms:
     1	# Trigger phrase matching (memory_match_triggers)
     2	
     3	## Current Reality
     4	
     5	When you need speed over depth, trigger matching delivers. Rather than generating embeddings and running multi-channel search, it performs direct string matching of your prompt against stored trigger phrases. The performance target is under 100ms. Think of it as the "fast path" that sacrifices recall for latency.
     6	
     7	Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.
     8	
     9	Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.
    10	
    11	The cognitive path fetches 2x the requested limit from the trigger matcher to give the cognitive pipeline headroom for filtering. If you request 3 results, 6 candidates enter the cognitive pipeline and the top 3 survivors are returned.
    12	
    13	## Source Files
    14	
    15	### Implementation
    16	
    17	| File | Layer | Role |
    18	|------|-------|------|
    19	| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
    20	| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Trigger Matcher
     3	// ---------------------------------------------------------------
     4	import * as vectorIndex from '../search/vector-index';
     5	import { escapeRegex } from '../utils/path-security';
     6	
     7	/* --- 1. TYPES --- */
     8	
     9	/** Signal category detected in user prompt */
    10	export type SignalCategory = 'correction' | 'preference' | 'neutral';
    11	
    12	/** Result of signal detection for a prompt */
    13	export interface SignalDetection {
    14	  category: SignalCategory;
    15	  keywords: string[];
    16	  boost: number;
    17	}
    18	
    19	/** Trigger cache entry for a single phrase-to-memory mapping */
    20	export interface TriggerCacheEntry {
exec
/bin/zsh -lc 'rg -n "matchTriggerPhrasesWithStats|signals|boost|performance|under 100ms|DEFAULT_LIMIT|include_cognitive" .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts -S' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:102:  include_cognitive?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:175:    include_cognitive: includeCognitive = true
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:244:  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:246:  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:247:    ? triggerMatchResult.stats.signals
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:283:        // T209: Persist max attention boost for matched memories.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:297:          const boosted: CoActivatedMemory[] | null = coActivation.spreadActivation([memoryId])
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:299:          if (boosted && Array.isArray(boosted)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:300:            coActivatedMemories.push(...boosted);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:414:    hints.push('Enable cognitive features with include_cognitive: true');
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:16:  boost: number;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:54:  signals?: SignalDetection[];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:87:  DEFAULT_LIMIT: number;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:102:  DEFAULT_LIMIT: 3,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:317:/** Keywords for CORRECTION signals — user is correcting a prior statement */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:328:/** Keywords for PREFERENCE signals — user is expressing a preference or intent */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:339:// AI-WHY: Correction signals (0.2) weighted higher than preferences (0.1) — corrections indicate stronger search intent
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:347: * Detect importance signals in a user prompt.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:370:      boost: SIGNAL_BOOSTS.correction,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:385:      boost: SIGNAL_BOOSTS.preference,
 succeeded in 51ms:
   320	  'wait',
   321	  'i was wrong',
   322	  'correction',
   323	  'not quite',
   324	  'let me rephrase',
   325	  "that's not right",
   326	];
   327	
   328	/** Keywords for PREFERENCE signals — user is expressing a preference or intent */
   329	export const PREFERENCE_KEYWORDS: string[] = [
   330	  'prefer',
   331	  'like',
   332	  'want',
   333	  'always use',
   334	  'never use',
   335	  'i want',
   336	  'please use',
   337	];
   338	
   339	// AI-WHY: Correction signals (0.2) weighted higher than preferences (0.1) — corrections indicate stronger search intent
 succeeded in 52ms:
   320	      const fullRecord = fullRecords.get(match.memoryId);
   321	      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);
   322	
   323	      let attentionScore: number;
   324	      let tier: string;
   325	
   326	      if (fullRecord) {
   327	        const classification = tierClassifier.classifyTier(fullRecord);
   328	        let effectiveRetrievability = classification.retrievability;
   329	
   330	        effectiveRetrievability *= turnDecayFactor;
   331	
   332	        if (wmEntry) {
   333	          // AI-WHY: Fix #30 (017-refinement-phase-6) — WM already applies its own decay.
   334	          // Multiplying by turnDecayFactor again causes double-decay.
   335	          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
   336	        }
   337	
   338	        attentionScore = effectiveRetrievability;
   339	        tier = tierClassifier.classifyState(effectiveRetrievability);
exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md; do echo "=== $f ==="; nl -ba "$f" | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '340,980p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts; do echo "=== $f ==="; nl -ba "$f" | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
=== .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md ===
     1	# Hybrid search pipeline
     2	
     3	## Current Reality
     4	
     5	The engine under the hood. `hybrid-search.ts` orchestrates multi-channel retrieval with five search channels, adaptive fusion, diversity reranking and a multi-tier fallback chain. This pipeline provides the candidate generation and fusion components used by Stage 1 of the 4-stage pipeline (the sole runtime path since the legacy V1 path was removed in Phase 017).
     6	
     7	Five channels feed the pipeline. Vector search (cosine similarity via sqlite-vec, base weight 1.0) is the primary semantic signal. FTS5 (SQLite full-text search with weighted BM25, base weight 0.8) captures keyword matches the embedding might miss. In-memory BM25 (base weight 0.6, gated by `ENABLE_BM25`, default ON) provides broader coverage with a different tokenization approach. Graph search (causal edge traversal, base weight 0.5) finds structurally related memories through the causal graph. Degree search (connectivity scoring, base weight 0.4, gated by `SPECKIT_DEGREE_BOOST`, default ON) re-ranks by hub score via `computeDegreeScores()` with logarithmic normalization and a hard cap of 50.
     8	
     9	Adaptive fusion replaces hardcoded channel weights with intent-aware profiles. The `hybridAdaptiveFuse()` function selects weights based on the detected query intent, so a "fix_bug" query weights channels differently than a "find_spec" query. Results from all channels merge through `fuseResultsMulti()` using Reciprocal Rank Fusion.
    10	
    11	Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
    12	
    13	After these stages, Maximal Marginal Relevance reranking promotes result diversity using intent-specific lambda values (from `INTENT_LAMBDA_MAP`, default 0.7). Co-activation spreading takes the top 5 results, traverses the co-activation graph and applies a 0.25x boost to returned activation scores. A fan-effect divisor helper exists in `co-activation.ts`, but the Stage 2 hot path currently applies the spread score directly.
    14	
    15	The fallback chain (`searchWithFallback()`) provides resilience. When `SPECKIT_SEARCH_FALLBACK` is enabled, the default path is a three-tier degradation flow: Tier 1 primary retrieval (default minimum similarity 0.3), Tier 2 widened retrieval at 0.1 with all channels forced on, and Tier 3 structural SQL search as last resort. When `SPECKIT_SEARCH_FALLBACK` is disabled, the legacy two-pass path is used (0.3 then 0.17). The system is designed to avoid empty returns except on hard failures.
    16	
    17	## Source Files
    18	
    19	### Implementation
 succeeded in 52ms:
   340	    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
   341	    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
   342	
   343	    return bm25Results.map(row => ({
   344	      ...row,
   345	      id: row.id as number,
   346	      score: row.fts_score || 0,
   347	      source: 'fts',
   348	    }));
   349	  } catch (error: unknown) {
   350	    const msg = error instanceof Error ? error.message : String(error);
   351	    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
   352	    return [];
   353	  }
   354	}
   355	
   356	/* --- 10. COMBINED LEXICAL SEARCH --- */
   357	
   358	/**
   359	 * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
 succeeded in 51ms:
=== .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts ===
     1	// ---------------------------------------------------------------
     2	// MODULE: Orchestrator
     3	// ---------------------------------------------------------------
     4	// Sprint 5 (R6): 4-stage pipeline execution behind SPECKIT_PIPELINE_V2
     5	//
     6	// I/O CONTRACT:
     7	//   Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
     8	//   Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
     9	//   Key invariants:
    10	//     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
    11	//     - Score fields are frozen after Stage 3; Stage 4 output scores == Stage 3 output scores
    12	//     - Stage metadata for all four stages is included for observability
    13	//   Side effects:
    14	//     - Delegates to each stage; see individual stage modules for their side effects
    15	
    16	import type {
    17	  PipelineConfig,
    18	  PipelineResult,
    19	  Stage4ReadonlyRow,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "triggerPhrases|bm25|re-index|reindex|updateParams|memoryupdate|memory-crud-update|updateMemory" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server -S' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Checkpoints
     3	// ---------------------------------------------------------------
     4	// Gzip-compressed database checkpoints with embedding preservation
     5	// ---------------------------------------------------------------
     6	
     7	// Node stdlib
     8	import * as zlib from 'zlib';
     9	
    10	// External packages
    11	import type Database from 'better-sqlite3';
    12	
    13	// Internal utils
    14	import { toErrorMessage } from '../../utils/db-helpers';
    15	import { bulkInsertEdges, deleteEdgesForMemory, type RelationType } from './causal-edges';
    16	
    17	/* -------------------------------------------------------------
    18	   1. CONSTANTS
    19	----------------------------------------------------------------*/
    20	
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Working Memory
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Session-based attention management
     5	// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
     6	// only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
     7	// the working_memory table, NOT memory_index. This is intentionally
     8	// independent of FSRS long-term decay — different time scale, different
     9	// domain (ephemeral session attention vs persistent memory scoring).
    10	// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
    11	// ensures stable resting state and explicit low-score eviction.
    12	// ---------------------------------------------------------------
    13	
    14	import type Database from 'better-sqlite3';
    15	import { isFeatureEnabled } from './rollout-policy';
    16	
    17	/* --- 1. CONFIGURATION --- */
    18	
    19	interface WorkingMemoryConfigType {
    20	  enabled: boolean;
 succeeded in 52ms:
Total output lines: 1076

.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:274:      console.warn(`[bm25-index] Failed to rebuild from database: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:71:import * as bm25Index from './lib/search/bm25-index';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:224:  if (bm25Index.isBm25Enabled()) channels.push('bm25');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:852:    if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:854:        const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:855:        const count = bm25.rebuildFromDatabase(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:857:      } catch (bm25Err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:858:        const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:955:    // P1-7: Optional real-time markdown watcher for automatic re-indexing.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:962:            reindexFn: async (filePath: string) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:20:  triggerPhrases?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:69:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:20:  triggerPhrases?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:69:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:235:  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:235:  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:145:  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:364:        triggerPhrases: r.matchedPhrases
exec
/bin/zsh -lc 'rg -n "upsertExtractedEntry|extract|source_tool|source_call_id|extraction_rule_id|getSessionPromptContext|batchUpdateScores|DELETE_THRESHOLD|DECAY_FLOOR|working memory" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts -S' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '340,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "workingMemory|working_memory|working memory" .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts -S' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:418:      // Snapshot working memory if exists
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:656:            source_tool TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:657:            source_call_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:658:            extraction_rule_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:673:        if (!wmColumns.includes('source_tool')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:674:          database.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:676:        if (!wmColumns.includes('source_call_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:677:          database.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:679:        if (!wmColumns.includes('extraction_rule_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:680:          database.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:810:      // AI-GUARD: T213: Restore working memory state from checkpoint snapshot.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:827:                source_tool, source_call_id, extraction_rule_id, redaction_applied
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:839:              wmEntry.source_tool ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:840:              wmEntry.source_call_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:841:              wmEntry.extraction_rule_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:929:    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:33:const DECAY_FLOOR = 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:34:const DELETE_THRESHOLD = 0.01;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:54:    source_tool TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:55:    source_call_id TEXT,
 succeeded in 50ms:
   340	  } catch (error: unknown) {
   341	    const msg = error instanceof Error ? error.message : String(error);
   342	    console.warn(`[working-memory] setAttentionScore error: ${msg}`);
   343	    return false;
   344	  }
   345	}
   346	
   347	function upsertExtractedEntry(input: ExtractedEntryInput): boolean {
   348	  if (!db) return false;
   349	  ensureSchema();
   350	
   351	  const {
   352	    sessionId,
   353	    memoryId,
   354	    attentionScore,
   355	    sourceTool,
   356	    sourceCallId,
   357	    extractionRuleId,
   358	    redactionApplied,
   359	  } = input;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:60:  workingMemoryRestored: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:70:  workingMemory: Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:418:      // Snapshot working memory if exists
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:419:      let workingMemorySnapshot: Array<Record<string, unknown>> = [];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:421:        const workingMemoryColumns = getTableColumns(database, 'working_memory');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:422:        if (specFolder && workingMemoryColumns.includes('memory_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:425:            workingMemorySnapshot = database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:426:              `SELECT * FROM working_memory WHERE memory_id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:430:          workingMemorySnapshot = database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:431:            'SELECT * FROM working_memory'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:454:        workingMemory: workingMemorySnapshot,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:566:  const result: RestoreResult = { restored: 0, skipped: 0, errors: [], workingMemoryRestored: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:621:    // merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:639:    // AI-TRACE: T213: Ensure working_memory table schema is ready BEFORE the transaction.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:642:    if (Array.isArray(snapshot.workingMemory) && snapshot.workingMemory.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:644:        // AI: Fix F4 — prevent CASCADE delete chain on working_memory.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:646:          CREATE TABLE IF NOT EXISTS working_memory (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:665:        const wmColumns = (database.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:668:          database.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:671:          database.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
exec
/bin/zsh -lc "rg -n \"upsertExtractedEntry\\(|sourceCallId|extractionRuleId|source_tool|workingMemory\\.upsertExtractedEntry|getOrCreateSession\\(\" .opencode/skill/system-spec-kit/mcp_server -S" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:248:  const inserted = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:253:    sourceCallId: callId,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:254:    extractionRuleId: matched.rule.id,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:656:            source_tool TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:673:        if (!wmColumns.includes('source_tool')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:674:          database.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:827:                source_tool, source_call_id, extraction_rule_id, redaction_applied
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:839:              wmEntry.source_tool ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:134:    it('getOrCreateSession(null) generates session ID', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:135:      const session = workingMemory.getOrCreateSession(null);
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:140:    it('getOrCreateSession("my-session") returns same ID', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:141:      expect(workingMemory.getOrCreateSession('my-session')).toBe('my-session');
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:91:      SELECT session_id, memory_id, attention_score, source_tool, source_call_id, extraction_rule_id, redaction_applied
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:98:    expect(row.source_tool).toBe('Read');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:54:    source_tool TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:81:  source_tool?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:92:  sourceCallId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:93:  extractionRuleId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:148:    if (!wmColumns.includes('source_tool')) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:149:      db.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts | sed -n '120,190p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   120	      } else {
   121	        throw new MemoryError(
   122	          ErrorCodes.EMBEDDING_FAILED,
   123	          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
   124	          { memoryId: id }
   125	        );
   126	      }
   127	    }
   128	  }
   129	
   130	  // AI-WHY: T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
   131	  // AI-WHY: cache invalidation, BM25 re-index, ledger append) in a single transaction for atomicity.
   132	  // AI-WHY: Embedding generation (async) runs before this block; its result feeds into updateParams.
   133	  const fields = Object.keys(updateParams).filter((key) => key !== 'id' && key !== 'embedding');
   134	
   135	  if (database) {
   136	    runInTransaction(database, () => {
   137	      if (embeddingStatusNeedsPendingWrite) {
   138	        vectorIndex.updateEmbeddingStatus(id, 'pending');
   139	      }
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// TEST: EXTRACTION ADAPTER (T029-T037)
     3	// ---------------------------------------------------------------
     4	
     5	import { afterEach, beforeEach, describe, expect, it } from 'vitest';
     6	import Database from 'better-sqlite3';
     7	import * as workingMemory from '../lib/cache/cognitive/working-memory';
     8	import {
     9	  RULES,
    10	  applySummarizer,
    11	  getExtractionMetrics,
    12	  initExtractionAdapter,
    13	  matchRule,
    14	  resetExtractionMetrics,
    15	} from '../lib/extraction/extraction-adapter';
    16	
    17	function createDb() {
    18	  const db = new Database(':memory:');
    19	  db.exec(`
    20	    CREATE TABLE memory_index (
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Extraction Adapter
     3	// ---------------------------------------------------------------
     4	
     5	import type Database from 'better-sqlite3';
     6	import * as workingMemory from '../cache/cognitive/working-memory';
     7	import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
     8	import { applyRedactionGate } from './redaction-gate';
     9	
    10	type SummarizerId = 'firstLast500' | 'matchCountSummary' | 'stdoutSummary';
    11	
    12	interface ExtractionRule {
    13	  id: string;
    14	  toolPattern: RegExp;
    15	  contentPattern: RegExp;
    16	  attention: number;
    17	  summarizer: SummarizerId;
    18	}
    19	
    20	interface RuleMatch {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | sed -n '800,850p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | sed -n '400,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "read_spec_section|remark|AST-level|section retrieval|anchor-aware thinning" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts -S' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   800	            }
   801	            deleteVectorById.run(vectorRow.rowid);
   802	            insertVector.run(vectorRow.rowid, embeddingBuffer);
   803	          } catch (e: unknown) {
   804	            const msg = toErrorMessage(e);
   805	            txErrors.push(`Vector ${vectorRow.rowid}: ${msg}`);
   806	          }
   807	        }
   808	      }
   809	
   810	      // AI-GUARD: T213: Restore working memory state from checkpoint snapshot.
   811	      // The working_memory table holds session-based attention data that must
   812	      // survive checkpoint save/restore cycles.
   813	      // DDL (CREATE TABLE, ALTER TABLE) is executed BEFORE the transaction above.
   814	      if (Array.isArray(snapshot.workingMemory) && snapshot.workingMemory.length > 0) {
   815	        for (const wmEntry of snapshot.workingMemory) {
   816	          // AI: Fix F19 — validate required fields before INSERT.
   817	          if (!wmEntry || typeof wmEntry.session_id !== 'string') {
   818	            console.warn('[checkpoints] Skipping working_memory entry with missing session_id');
   819	            continue;
 succeeded in 51ms:
   400	      let vectors: SnapshotVectorRow[] = [];
   401	      if (_includeEmbeddings && tableExists(database, 'vec_memories')) {
   402	        try {
   403	          const vectorSql = specFolder
   404	            ? `
   405	                SELECT v.rowid as rowid, v.embedding as embedding
   406	                FROM vec_memories v
   407	                JOIN memory_index m ON m.id = v.rowid
   408	                WHERE m.spec_folder = ?
   409	              `
   410	            : 'SELECT rowid, embedding FROM vec_memories';
   411	          const vectorParams = specFolder ? [specFolder] : [];
   412	          vectors = database.prepare(vectorSql).all(...vectorParams) as SnapshotVectorRow[];
   413	        } catch (_error: unknown) {
   414	          vectors = [];
   415	        }
   416	      }
   417	
   418	      // Snapshot working memory if exists
   419	      let workingMemorySnapshot: Array<Record<string, unknown>> = [];
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:78:| **Context**       | Full documents      | ANCHOR-based section retrieval (93% token savings)       |
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:245:| Anchor-only | `extractAnchors(content)` | Targeted section retrieval |
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts:3:// AST-based markdown chunking using remark-gfm that keeps
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:113: * Apply anchor-aware thinning to a set of chunks.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib/chunking .opencode/skill/system-spec-kit/mcp_server/tests | rg 'structure-aware-chunker|remark|chunker'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Anchor Chunker
     3	// ---------------------------------------------------------------
     4	// Splits large memory files into chunks using ANCHOR tags as
     5	// natural boundaries. Falls back to structure-aware markdown
     6	// splitting when anchors are absent.
     7	// ---------------------------------------------------------------
     8	
     9	/* ---------------------------------------------------------------
    10	   1. TYPES
    11	--------------------------------------------------------------- */
    12	
    13	/**
    14	 * Describes the AnchorChunk shape.
    15	 */
    16	export interface AnchorChunk {
    17	  /** The text content of this chunk */
    18	  content: string;
    19	  /** Anchor IDs covered by this chunk (empty for fallback chunks) */
    20	  anchorIds: string[];
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// TEST: Structure-Aware Chunker (C138-P4)
     3	// AST-based markdown chunking using remark-gfm that keeps
     4	// code blocks and tables atomic (never split mid-element).
     5	// ---------------------------------------------------------------
     6	
     7	import { describe, it, expect } from 'vitest';
     8	import { chunkMarkdown, splitIntoBlocks } from '@spec-kit/shared/lib/structure-aware-chunker';
     9	import type { Chunk } from '@spec-kit/shared/lib/structure-aware-chunker';
    10	
    11	/* ---------------------------------------------------------------
    12	   TESTS
    13	   --------------------------------------------------------------- */
    14	
    15	describe('C138-P4 Structure-Aware Chunker', () => {
    16	
    17	  // ---- T1: Code blocks are never split ----
    18	  it('T1: fenced code block remains atomic in single chunk', () => {
    19	    const md = `Some text before.
    20	
exec
/bin/zsh -lc 'rg -n "searchWithFallbackTiered|checkDegradation|Tier 3|_degradation|minSimilarity|forceAllChannels|legacy two-pass|0.17|0.1|0.3" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts -S' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1380,1520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1080,1380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
64:  minSimilarity?: number;
79:  forceAllChannels?: boolean;
85:   * Normalized relevance score (0-1). Semantics depend on `source`:
86:   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
91:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
408:    minSimilarity = 0,
424:        minSimilarity,
544:    const activeChannels = options.forceAllChannels
592:          minSimilarity: options.minSimilarity || 0,
733:      // documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
955:      const degradationMeta = (reranked as unknown as Record<string, unknown>)['_degradation'];
1028: * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
1029: * fallback — primary at minSimilarity=0.3, retry at 0.17.
1043:    return searchWithFallbackTiered(query, embedding, options);
1046:  // AI-WHY: Primary 0.3 filters noise; fallback 0.17 widens recall for sparse corpora
1048:  const PRIMARY_THRESHOLD = 0.3;
1049:  const FALLBACK_THRESHOLD = 0.17;
1053:  const primaryOptions = { ...options, minSimilarity: options.minSimilarity ?? PRIMARY_THRESHOLD };
1057:  if (results.length === 0 && (primaryOptions.minSimilarity ?? PRIMARY_THRESHOLD) >= FALLBACK_THRESHOLD) {
1058:    const fallbackOptions = { ...options, minSimilarity: FALLBACK_THRESHOLD };
 succeeded in 51ms:
  1380	    }
  1381	  }
  1382	
  1383	  return Array.from(byId.values()).sort((a, b) => b.score - a.score);
  1384	}
  1385	
  1386	/**
  1387	 * PI-A2: Quality-aware 3-tier search fallback chain.
  1388	 *
  1389	 * TIER 1: hybridSearchEnhanced at minSimilarity=0.3
  1390	 *   → Pass if quality signal is healthy AND count >= 3
  1391	 *
  1392	 * TIER 2: hybridSearchEnhanced at minSimilarity=0.1, all channels forced
  1393	 *   → Merge with Tier 1, dedup by id
  1394	 *   → Pass if quality signal is healthy AND count >= 3
  1395	 *
  1396	 * TIER 3: structuralSearch (pure SQL last-resort)
  1397	 *   → Merge with Tier 1+2 results after score calibration
  1398	 *   → Return capped set
  1399	 *
 succeeded in 51ms:
  1080	}
  1081	
  1082	/* --- 12. STRUCTURAL SEARCH (PI-A2 Tier 3) --- */
  1083	
  1084	/**
  1085	 * PI-A2: Last-resort structural search against the memory_index table.
  1086	 * Retrieves memories ordered by importance tier and weight, without
  1087	 * requiring embeddings or text similarity. Pure SQL fallback.
  1088	 *
  1089	 * @param options - Search options (specFolder for filtering, limit for cap).
  1090	 * @returns Array of HybridSearchResult with source='structural'.
  1091	 */
  1092	function structuralSearch(
  1093	  options: Pick<HybridSearchOptions, 'specFolder' | 'limit'> = {}
  1094	): HybridSearchResult[] {
  1095	  if (!db) return [];
  1096	
  1097	  const limit = options.limit ?? DEFAULT_LIMIT;
  1098	
  1099	  try {
codex
The retrieval pass is surfacing a pattern: some docs are very close on behavior, but a few smaller “gap-scan” docs are clearly missing their real handler files or describing older behavior. I’m switching to mutation and discovery now so I can cross-check the overlapping CRUD/health handlers in one sweep.
exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/feature_catalog/03--discovery/*.md; do echo "=== $f ==="; nl -ba "$f" | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/feature_catalog/02--mutation/*.md; do echo "=== $f ==="; nl -ba "$f" | sed -n '"'1,220p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-validate.ts; do echo "=== $f ==="; nl -ba "$f" | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
=== .opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md ===
     1	# Memory browser (memory_list)
     2	
     3	## Current Reality
     4	
     5	Paginated browsing of everything the memory system knows. You can sort by creation date, update date or importance weight. Filter by spec folder. Optionally include child chunk rows alongside parent memories (off by default for cleaner browsing).
     6	
     7	Each entry shows its numeric ID, spec folder, title, creation and update timestamps, importance weight, trigger phrase count and file path. The response includes a total count and pagination hints (like "More results available: use offset: 40") for navigating forward. Default page size is 20, maximum is 100.
     8	
     9	This is the starting point for any manual memory management workflow. Need to delete a specific memory? Browse to find its ID. Want to audit what is indexed under a spec folder? Filter by folder and scan the results. Wondering why a memory is not surfacing in search? Look up its importance weight and tier here.
    10	
    11	## Source Files
    12	
    13	### Implementation
    14	
    15	| File | Layer | Role |
    16	|------|-------|------|
    17	| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
    18	| `mcp_server/core/config.ts` | Core | Server configuration |
    19	| `mcp_server/core/db-state.ts` | Core | Database state management |
 succeeded in 53ms:
=== .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md ===
     1	# Memory indexing (memory_save)
     2	
     3	## Current Reality
     4	
     5	`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.
     6	
     7	Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. BM25 has a separate normalization entry point (`normalizeContentForBM25`) that currently delegates to the embedding normalizer, and it is used on rebuild-from-database paths. In live save paths, raw content is passed to BM25 tokenization (`addDocument`) before tokenizer normalization.
     8	
     9	The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.
    10	
    11	A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves.
    12	
    13	Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.
    14	
    15	For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array.
    16	
    17	When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet; it builds a labeled dataset for future type-aware retrieval.
    18	
    19	After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.
 succeeded in 52ms:
=== .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts ===
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory CRUD Update Handler
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   IMPORTS
     7	--------------------------------------------------------------- */
     8	
     9	import { randomUUID } from 'node:crypto';
    10	import { checkDatabaseUpdated } from '../core';
    11	import * as vectorIndex from '../lib/search/vector-index';
    12	import type { UpdateMemoryParams } from '../lib/search/vector-index';
    13	import * as embeddings from '../lib/providers/embeddings';
    14	import * as bm25Index from '../lib/search/bm25-index';
    15	import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
    16	import { MemoryError, ErrorCodes } from '../lib/errors';
    17	import * as mutationLedger from '../lib/storage/mutation-ledger';
    18	import { runInTransaction } from '../lib/storage/transaction-manager';
    19	import { createMCPSuccessResponse } from '../lib/response/envelope';
exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md .opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md .opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md .opencode/skill/system-spec-kit/feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md; do echo "=== $f ==="; nl -ba "$f" | sed -n '"'1,140p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts; do echo "=== $f ==="; nl -ba "$f" | sed -n '"'1,320p'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
=== .opencode/skill/system-spec-kit/feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md ===
     1	# Single and folder delete (memory_delete)
     2	
     3	## Current Reality
     4	
     5	Two deletion modes in one tool. Pass a numeric `id` for single delete or a `specFolder` string (with `confirm: true`) for bulk folder delete.
     6	
     7	Single deletes run inside a database transaction: remove the memory record via `vectorIndex.deleteMemory(id)`, clean up associated causal graph edges via `causalEdges.deleteEdgesForMemory(id)` and record a mutation ledger entry. If any step fails, the entire transaction rolls back. This atomicity guarantee was added in Phase 018 (CR-P1-1) to prevent partial deletes from leaving orphaned data.
     8	
     9	Bulk deletes by spec folder are more involved. The system first creates an auto-checkpoint with a timestamped name (like `pre-cleanup-2026-02-28T12-00-00`) so you can roll back if the deletion was a mistake. Then it deletes all matching memories inside a database transaction with per-memory causal edge cleanup and per-memory mutation ledger entries. The entire operation is atomic: either all memories in the folder are deleted or none are. The response includes the checkpoint name and a restore command hint.
    10	
    11	## Source Files
    12	
    13	### Implementation
    14	
    15	| File | Layer | Role |
    16	|------|-------|------|
    17	| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
    18	| `mcp_server/core/config.ts` | Core | Server configuration |
    19	| `mcp_server/core/db-state.ts` | Core | Database state management |
exec
/bin/zsh -lc 'rg -n "memory_validate|validate memory|validation feedback|runQualityLoop|quality loop|handleMemoryValidate|undo|memory_history|namespace|tenant|memorybulkdelete|bulk_delete" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts -S' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
=== .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts ===
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Bulk Delete
     3	// ---------------------------------------------------------------
     4	// Tier-based bulk deletion of memories with safety gates.
     5	// Eliminates the need for direct DB scripts when cleaning up
     6	// deprecated/temporary memories at scale.
     7	// ---------------------------------------------------------------
     8	
     9	import { checkDatabaseUpdated } from '../core';
    10	import * as vectorIndex from '../lib/search/vector-index';
    11	import * as checkpoints from '../lib/storage/checkpoints';
    12	import * as mutationLedger from '../lib/storage/mutation-ledger';
    13	import * as causalEdges from '../lib/storage/causal-edges';
    14	import { createMCPSuccessResponse } from '../lib/response/envelope';
    15	import { toErrorMessage } from '../utils';
    16	
    17	import { appendMutationLedgerSafe } from './memory-crud-utils';
    18	import { runPostMutationHooks } from './mutation-hooks';
    19	import { buildMutationHookFeedback } from '../hooks/mutation-feedback';
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:95:      tool: 'memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:192:    reason: `memory_bulk_delete: deleted ${deletedCount} memories with tier="${tier}"`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:197:      tool: 'memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:205:    actor: 'mcp:memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:253:    tool: 'memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:3:description: "MCP tool handlers for context, search, CRUD, indexing, ingest, checkpoints, learning, causal graph, PE gating, eval reporting, and quality loop operations."
.opencode/skill/system-spec-kit/mcp_server/README.md:272:| `memory_bulk_delete` | Bulk delete by tier with checkpoint safety gates. Supports `skipCheckpoint` for non-critical tiers | <100ms + checkpoint |
.opencode/skill/system-spec-kit/mcp_server/README.md:273:| `memory_validate`    | Record validation feedback                                                                         | <50ms               |
.opencode/skill/system-spec-kit/mcp_server/README.md:350:| L4    | Mutation      | 500          | `memory_delete`, `memory_bulk_delete`, `memory_update`, `memory_validate` |
.opencode/skill/system-spec-kit/mcp_server/README.md:638:│   ├── memory-bulk-delete.ts # memory_bulk_delete + skipCheckpoint
.opencode/skill/system-spec-kit/mcp_server/README.md:640:│   ├── checkpoints.ts      # checkpoint_create/list/restore/delete + memory_validate
.opencode/skill/system-spec-kit/mcp_server/README.md:809:| `memory_history`     | Access and modification history                                    |
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:96:  handleMemoryValidate,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:101:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:332:  memory_validate: memoryValidateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:333:  memory_bulk_delete: memoryBulkDeleteSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:363:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:364:  memory_bulk_delete: ['tier', 'specFolder', 'confirm', 'olderThanDays', 'skipCheckpoint'],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:313:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:314:async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
context compacted
codex
I’ve finished the first pass over the catalog structure and path validation, and I’m in the final source-vs-doc comparison pass now. Next I’m reading the remaining mutation/discovery handlers that still need code confirmation so the output blocks are evidence-backed rather than inferred.
codex
The sandbox won’t allow here-doc temp files, so I’m switching to direct `node -e`/`sed` reads. I already have the path audit complete; this pass is just filling in the last evidence gaps for the handlers that needed closer inspection.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path'); const base='.opencode/skill/system-spec-kit/feature_catalog'; for (const cat of ['01--retrieval','02--mutation','03--discovery']) { const dir=path.join(base,cat); for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.md')).sort()) { const text=fs.readFileSync(path.join(dir,f),'utf8'); const m=text.match(/## Current Reality\\n([\\s\\S]*?)(?:\\n## |"'$)/); const impl=text.match(/### Implementation Files'"\\n([\\s\\S]*?)(?:\\n### |\\n## |"'$)/); const tests=text.match(/### Test Files'"\\n([\\s\\S]*?)(?:\\n### |\\n## |"'$)/); const count=((impl&&impl[1].match(/`[''^`]+`/g))||[]).length+((tests&&tests[1].match(/`[''^`]+`/g))||[]).length; console.log('"'FILE: '+cat+'/'+f); console.log('COUNT: '+count); console.log((m&&m[1].trim())||''); console.log('---'); } }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '300,470p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts && printf '\\nFILE_END\\n' && sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts && printf '\\nFILE_END\\n' && sed -n '1,340p' .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts && printf '\\nFILE_END\\n' && sed -n '1,340p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts && printf '\\nFILE_END\\n' && sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts && printf '\\nFILE_END\\n' && sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts && printf '\\nFILE_END\\n' && sed -n '300,500p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts && printf '\\nFILE_END\\n' && sed -n '1,520p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
zsh:1: bad pattern: [^
zsh:1: parse error near `)'
zsh:1: parse error in command substitution
 succeeded in 52ms:
      safetyConfirmationUsed: true,
    },
    hints: success
      ? []
      : ['Use checkpoint_list() to see available checkpoints'],
    startTime: startTime
  });
}

/* ---------------------------------------------------------------
   7. MEMORY VALIDATE HANDLER
--------------------------------------------------------------- */

/** Handle memory_validate tool - records user validation feedback to adjust confidence */
async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();
  const {
    id,
    wasUseful,
codex
I’ve got the runtime code evidence for `memory_validate`, health, history, and most mutation handlers now. I’m pulling the corresponding feature docs side-by-side for the handful of entries where the exact wording matters, especially the ones that looked like prior rewrite candidates.
exec
/bin/zsh -lc "for f in \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md'; do printf 'FILE: %s\\n' \""'$f"; sed -n '"'1,260p' \""'$f"; printf '"'\\nFILE_END\\n'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | sed -n '313,420p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '70,260p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts | sed -n '1,260p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts | sed -n '1,260p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts | sed -n '1,260p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   313	/** Handle memory_validate tool - records user validation feedback to adjust confidence */
   314	async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
   315	  const startTime = Date.now();
   316	  await checkDatabaseUpdated();
   317	  const {
   318	    id,
   319	    wasUseful,
   320	    queryId,
   321	    queryTerms,
   322	    resultRank,
   323	    totalResultsShown,
   324	    searchMode,
   325	    intent,
   326	    sessionId,
   327	    notes,
   328	  } = args;
   329	
   330	  if (id === undefined || id === null) {
   331	    throw new Error('id is required');
   332	  }
 succeeded in 52ms:
FILE: .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md
# Memory indexing (memory_save)

## Current Reality

`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.

Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. BM25 has a separate normalization entry point (`normalizeContentForBM25`) that currently delegates to the embedding normalizer, and it is used on rebuild-from-database paths. In live save paths, raw content is passed to BM25 tokenization (`addDocument`) before tokenizer normalization.

The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.

A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves.

Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet; it builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.
codex
The long source tables are noisy, but the important part is clearer now: some docs are pointing at the wrong implementation module entirely, and a couple of “current reality” sections overstate what the code guarantees. I’m doing one more narrow pass on the prediction-error, corrections, and history features so the final blocks can call out exact mismatches instead of general suspicion.
exec
/bin/zsh -lc "rg -n \"THRESHOLD|ACTION\\.|recordHistory\\(|getHistory\\(|getHistoryStats\\(|undo|correction|memory_history|recordNegativeFeedbackEvent|executeAutoPromotion|confidenceTracker|learned_triggers|recordSelection|recordUserSelection|half-life|promotion\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-tracker.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-selection.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "for f in \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md' \\
'.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md'; do printf 'FILE: %s\\n' \""'$f"; sed -n '"'/"'^## Current Reality$/,/''^---$/p'"' \""'$f"; printf '"'\\nTABLE_MARKERS\\n'; rg -n \""'^### Implementation|''^### Tests|''^### Test|''^## Source Files|''^## Source Metadata" "$f"; printf '"'\\nFILE_END\\n'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 52ms:
rg: .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-tracker.ts: No such file or directory (os error 2)
rg: .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-selection.ts: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:55:    CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:107:export function recordHistory(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:118:    INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:128:export function getHistory(memoryId: number, limit?: number): HistoryEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:132:    ? 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC LIMIT ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:133:    : 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:143:export function getHistoryStats(specFolder?: string): HistoryStats {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:153:      FROM memory_history h
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:172:    FROM memory_history
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:13:import * as confidenceTracker from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:14:import { executeAutoPromotion } from '../lib/search/auto-promotion';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:15:import { recordSelection } from '../lib/search/learned-feedback';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:16:import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:17:import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:69:  promotionEligible: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:342:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:344:  // T002a: Auto-promotion wiring on positive feedback.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:354:    const promotionResult = executeAutoPromotion(database, memoryId);
 succeeded in 51ms:
FILE: .opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md
## Current Reality

5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason, and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25). Always active unless `force: true` is passed.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating entry point |
| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | PE orchestration flow |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Lib | Prediction error computation |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |

### Tests

| File | Focus |
|------|-------|
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts | sed -n '1,220p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts | sed -n '1,220p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts | sed -n '1,280p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts | sed -n '240,420p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '1068,1132p' && printf '\\nFILE_END\\n' && rg -n \"recordHistory\\(|getHistory\\(|getHistoryStats\\(|memory_history|history\\.\" .opencode/skill/system-spec-kit/mcp_server -g'*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Confidence Tracker
     3	// ---------------------------------------------------------------
     4	
     5	import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
     6	
     7	// ---------------------------------------------------------------
     8	// 1. TYPES
     9	// ---------------------------------------------------------------
    10	
    11	export type { Database };
    12	
    13	export interface ValidationResult {
    14	  confidence: number;
    15	  validationCount: number;
    16	  positiveValidationCount: number;
    17	  promotionEligible: boolean;
    18	  wasPromoted: boolean;
    19	}
    20	
 succeeded in 51ms:
  1068	/**
  1069	 * Ensure companion tables exist alongside memory_index.
  1070	 */
  1071	export function ensureCompanionTables(database: Database.Database): void {
  1072	  database.exec(`
  1073	    CREATE TABLE IF NOT EXISTS memory_history (
  1074	      id TEXT PRIMARY KEY,
  1075	      memory_id INTEGER NOT NULL,
  1076	      prev_value TEXT,
  1077	      new_value TEXT,
  1078	      event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
  1079	      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  1080	      is_deleted INTEGER DEFAULT 0,
  1081	      actor TEXT DEFAULT 'system',
  1082	      FOREIGN KEY (memory_id) REFERENCES memory_index(id)
  1083	    )
  1084	  `);
  1085	
  1086	  database.exec(`
  1087	    CREATE TABLE IF NOT EXISTS checkpoints (
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts | sed -n '1,240p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts | sed -n '1,260p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | sed -n '1,280p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | sed -n '1,300p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts | sed -n '1,220p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Reconsolidation Bridge
     3	// ---------------------------------------------------------------
     4	
     5	import path from 'path';
     6	import type BetterSqlite3 from 'better-sqlite3';
     7	
     8	import * as vectorIndex from '../../lib/search/vector-index';
     9	import * as embeddings from '../../lib/providers/embeddings';
    10	import * as bm25Index from '../../lib/search/bm25-index';
    11	import * as fsrsScheduler from '../../lib/cache/cognitive/fsrs-scheduler';
    12	import * as incrementalIndex from '../../lib/storage/incremental-index';
    13	import { reconsolidate, isReconsolidationEnabled } from '../../lib/storage/reconsolidation';
    14	import type { ReconsolidationResult } from '../../lib/storage/reconsolidation';
    15	import { classifyEncodingIntent } from '../../lib/search/encoding-intent';
    16	import {
    17	  isEncodingIntentEnabled,
    18	  isReconsolidationEnabled as isReconsolidationFlagEnabled,
    19	} from '../../lib/search/search-flags';
    20	import type * as memoryParser from '../../lib/parsing/memory-parser';
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Save Quality Gate
     3	// ---------------------------------------------------------------
     4	// ---------------------------------------------------------------
     5	// TM-04: Pre-Storage Quality Gate
     6	//
     7	// 3-layer validation before storing memories:
     8	// - Layer 1: Structural validation (existing checks, formalized)
     9	// - Layer 2: Content quality scoring (title, triggers, length,
    10	//            anchors, metadata, signal density)
    11	// - Layer 3: Semantic dedup (cosine similarity against existing)
    12	//
    13	// Behind SPECKIT_SAVE_QUALITY_GATE flag (default OFF)
    14	//
    15	// MR12 mitigation: warn-only mode for first 2 weeks after
    16	// activation. When in warn-only mode, log quality scores and
    17	// would-reject decisions but do NOT block saves.
    18	//
    19	// P1-015: Activation timestamp is persisted to SQLite config
    20	// table so the 14-day graduation countdown survives server
codex
I have enough code-level evidence now; the last useful thing is to align my notes with each doc’s exact wording so I don’t overstate any mismatch. I’m extracting just the “Current Reality” sections across the catalog and then I’ll assemble the per-feature audit blocks.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'), path=require('path'); const dirs=['.opencode/skill/system-spec-kit/feature_catalog/01--retrieval','.opencode/skill/system-spec-kit/feature_catalog/02--mutation','.opencode/skill/system-spec-kit/feature_catalog/03--discovery']; for (const dir of dirs) { for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.md')).sort()) { const t=fs.readFileSync(path.join(dir,f),'utf8'); const impl=(t.split('### Implementation')[1]||'').split('### Test')[0]; const tests=(t.split('### Test')[1]||'').split('## Source Metadata')[0]; const impls=[...impl.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]); const testFiles=[...tests.matchAll(/`([''^`]+)`/g)].map(m=>m[1]); console.log(path.basename(dir)+'"'/'+f+' impl='+impls.length+' tests='+testFiles.length); } }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'for f in $(rg --files .opencode/skill/system-spec-kit/feature_catalog/01--retrieval .opencode/skill/system-spec-kit/feature_catalog/02--mutation .opencode/skill/system-spec-kit/feature_catalog/03--discovery | sort); do printf '"'FILE: %s\\n' \""'$f"; sed -n '"'/"'^## Current Reality$/,/''^## Source Files$/p'"' \""'$f"; printf '"'\\nFILE_END\\n'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
zsh:1: parse error near `[^'
zsh:1: parse error in command substitution
 succeeded in 52ms:
FILE: .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md
## Current Reality

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).

Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.

When no `specFolder` is provided, automatic spec folder discovery attempts to identify the most relevant folder from the query text using a cached one-sentence description per spec folder. If the target folder can be identified from the description alone, the system avoids full-corpus search entirely. Discovery failure is non-fatal and falls through to the standard retrieval path. This feature runs behind the `SPECKIT_FOLDER_DISCOVERY` flag.

Session management is built in. You can pass a `sessionId` for cross-turn deduplication (the system tracks which memories were already sent in this session and skips them) and working memory integration (attention-scored memories from previous turns carry over). In resume mode with `autoResumeEnabled`, the handler pulls working memory context items and injects them as `systemPromptContext` into the response. If you do not pass a session ID, an ephemeral UUID is generated for that single call.

Retrieval telemetry records mode selection and pressure-override fallbacks for observability when extended telemetry is enabled.

## Source Files

FILE_END
FILE: .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md
## Current Reality
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '180,260p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '430,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "all concepts|concepts must|multi.?concept|intersection|dedup|merged" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   180	  let channelCount = 0;
   181	
   182	  // -- Channel: Multi-Concept --------------------------------------------------
   183	
   184	  if (searchType === 'multi-concept' && Array.isArray(concepts) && concepts.length >= 2) {
   185	    // Validate concept list: 2-5 non-empty strings
   186	    if (concepts.length > 5) {
   187	      throw new Error('[stage1-candidate-gen] Maximum 5 concepts allowed for multi-concept search');
   188	    }
   189	
   190	    for (const concept of concepts) {
   191	      if (typeof concept !== 'string' || concept.trim().length === 0) {
   192	        throw new Error('[stage1-candidate-gen] Each concept must be a non-empty string');
   193	      }
   194	    }
   195	
   196	    // Generate one embedding per concept
   197	    const conceptEmbeddings: Float32Array[] = [];
   198	    for (const concept of concepts) {
   199	      const emb = await embeddings.generateQueryEmbedding(concept);
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:12://   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:53:/** Minimum cosine similarity for multi-concept search. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:119: * Duplicates are eliminated via `Set` deduplication before slicing.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:184:  if (searchType === 'multi-concept' && Array.isArray(concepts) && concepts.length >= 2) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:187:      throw new Error('[stage1-candidate-gen] Maximum 5 concepts allowed for multi-concept search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:231:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:252:          // Merge variant results, deduplicate by id, preserve first-occurrence order
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:254:          const merged: PipelineRow[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:259:                merged.push(row);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:263:          candidates = merged;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:293:      // hybrid search channel whose results are merged with the baseline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:338:            // Merge both result sets, deduplicate by id, baseline-first ordering
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:341:            const merged: PipelineRow[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:345:                merged.push(row);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:348:            candidates = merged;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:431:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:512:  // + deduplicate by ID.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:87:  dedupStats: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:555:      dedupStats: { enabled: false, sessionId: null }
exec
/bin/zsh -lc "rg -n \"multiConceptSearch\\(|all concepts|must match|intersection|concept embeddings\" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index*.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '1080,1180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:316: * Searches indexed memories with multiple concept embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:317: * @param concept_embeddings - The concept embeddings to search with.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:316: * Searches indexed memories with multiple concept embeddings.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:317: * @param concept_embeddings - The concept embeddings to search with.
 succeeded in 51ms:
  1080	  const sort_order = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  1081	
  1082	  const database = initialize_db();
  1083	
  1084	  const rows = database.prepare(`
  1085	    SELECT id, title, spec_folder, file_path, access_count,
  1086	           last_accessed, confidence, created_at
  1087	    FROM memory_index
  1088	    WHERE access_count > 0
  1089	    ORDER BY ${sort_field} ${sort_order}
  1090	    LIMIT ?
  1091	  `).all(limit) as Array<{
  1092	    id: number;
  1093	    title: string | null;
  1094	    spec_folder: string;
  1095	    file_path: string;
  1096	    access_count: number;
  1097	    last_accessed: number | null;
  1098	    confidence: number | null;
  1099	    created_at: string;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '300,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   300	): MemoryRow[] {
   301	  const database = initialize_db();
   302	  const { specFolder = null, maxTokens = 2000, includeArchived = false } = options;
   303	
   304	  let results = get_constitutional_memories(database, specFolder, includeArchived);
   305	
   306	  const TOKENS_PER_MEMORY = 100;
   307	  const max_count = Math.floor(maxTokens / TOKENS_PER_MEMORY);
   308	  if (results.length > max_count) {
   309	    results = results.slice(0, max_count);
   310	  }
   311	
   312	  return results;
   313	}
   314	
   315	/**
   316	 * Searches indexed memories with multiple concept embeddings.
   317	 * @param concept_embeddings - The concept embeddings to search with.
   318	 * @param options - Search options.
   319	 * @returns The matching memory rows.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '380,450p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   380	        ${archival_filter}
   381	        AND ${distance_filters}
   382	    ) sub
   383	    ORDER BY avg_distance ASC
   384	    LIMIT ?
   385	  `;
   386	
   387	  const params = [
   388	    ...concept_buffers,
   389	    ...(specFolder ? [specFolder] : []),
   390	    ...concept_buffers.flatMap(b => [b, max_distance]),
   391	    limit
   392	  ];
   393	
   394	  const rows = database.prepare(sql).all(...params);
   395	
   396	  return (rows as MemoryRow[]).map((row: MemoryRow) => {
   397	    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
   398	    row.concept_similarities = concept_buffers.map((_, i) => Number(row[`similarity_${i}`] ?? 0));
   399	    row.avg_similarity = (row.concept_similarities as number[]).reduce((a, b) => a + b, 0) / concepts.length;
exec
/bin/zsh -lc "rg -n \"checkpoints\\.ts|memory-validate\\.ts|retry\\.vitest|confidence-tracker|auto-promotion|learned-feedback|ground-truth-feedback|negative-feedback\" .opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
119:| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint storage |
241:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md | sed -n '90,130p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    90	| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel enforcement |
    91	| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |
    92	| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |
    93	| `mcp_server/lib/search/dynamic-token-budget.ts` | Lib | Token budget computation |
    94	| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |
    95	| `mcp_server/lib/search/entity-linker.ts` | Lib | Cross-document entity linking |
    96	| `mcp_server/lib/search/folder-discovery.ts` | Lib | Spec folder auto-discovery |
    97	| `mcp_server/lib/search/folder-relevance.ts` | Lib | Folder relevance scoring |
    98	| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
    99	| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration |
   100	| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection |
   101	| `mcp_server/lib/search/local-reranker.ts` | Lib | Local GGUF reranker |
   102	| `mcp_server/lib/search/memory-summaries.ts` | Lib | Memory summary generation |
   103	| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |
   104	| `mcp_server/lib/search/query-router.ts` | Lib | Channel routing |
   105	| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |
   106	| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
   107	| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
   108	| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |
   109	| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |
exec
/bin/zsh -lc "rg -n \"handlers/checkpoints\\.ts|handlers/memory-validate\\.ts|scoring/confidence-tracker|search/auto-promotion|search/learned-feedback|eval/ground-truth-feedback|scoring/negative-feedback\" .opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts | sed -n '350,430p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts | sed -n '535,625p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   350	   5. CORE CORRECTION FUNCTIONS
   351	---------------------------------------------------------------- */
   352	
   353	/**
   354	 * Provides the record_correction helper.
   355	 */
   356	export function record_correction(params: RecordCorrectionParams): CorrectionResult {
   357	  if (!db) {
   358	    throw new Error('[corrections] Database not initialized. Call init() first.');
   359	  }
   360	
   361	  if (!ENABLE_RELATIONS) {
   362	    return {
   363	      success: false,
   364	      skipped: true,
   365	      reason: 'SPECKIT_RELATIONS disabled (CHK-069)'
   366	    };
   367	  }
   368	
   369	  const {
exec
/bin/zsh -lc 'rg -n "namespace|multi-tenant|tenant|switch_namespace|create_namespace|delete_namespace|list_namespaces" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | head -n 120' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/README.md:3:description: "Barrel re-export of composite scoring functions from the canonical lib/scoring module into the cache namespace."
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/README.md:24:`lib/cache/scoring/` re-exports the composite scoring module from `lib/scoring/composite-scoring.ts` into the cache layer namespace. It does not contain original logic. All scoring functions, types, constants and weight configurations originate in the canonical `lib/scoring/` directory.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:64:├── scoring/            # Barrel re-export of composite scoring into cache namespace
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts | sed -n '1,180p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts | sed -n '1,280p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Crud List
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   IMPORTS
     7	--------------------------------------------------------------- */
     8	
     9	import { checkDatabaseUpdated } from '../core';
    10	import * as vectorIndex from '../lib/search/vector-index';
    11	import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
    12	import { toErrorMessage } from '../utils';
    13	
    14	import { safeJsonParseTyped } from '../utils/json-helpers';
    15	
    16	import type { MCPResponse } from './types';
    17	import type { ListArgs } from './memory-crud-types';
    18	
    19	/* ---------------------------------------------------------------
    20	   CORE LOGIC
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Crud Delete
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   IMPORTS
     7	--------------------------------------------------------------- */
     8	
     9	import { checkDatabaseUpdated } from '../core';
    10	import * as vectorIndex from '../lib/search/vector-index';
    11	import * as checkpoints from '../lib/storage/checkpoints';
    12	import * as mutationLedger from '../lib/storage/mutation-ledger';
    13	import * as causalEdges from '../lib/storage/causal-edges';
    14	import { createMCPSuccessResponse } from '../lib/response/envelope';
    15	import { toErrorMessage } from '../utils';
    16	
    17	import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils';
    18	import { runPostMutationHooks } from './mutation-hooks';
    19	import { buildMutationHookFeedback } from '../hooks/mutation-feedback';
    20	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '590,980p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory CRUD Update Handler
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   IMPORTS
     7	--------------------------------------------------------------- */
     8	
     9	import { randomUUID } from 'node:crypto';
    10	import { checkDatabaseUpdated } from '../core';
    11	import * as vectorIndex from '../lib/search/vector-index';
    12	import type { UpdateMemoryParams } from '../lib/search/vector-index';
    13	import * as embeddings from '../lib/providers/embeddings';
    14	import * as bm25Index from '../lib/search/bm25-index';
    15	import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers';
    16	import { MemoryError, ErrorCodes } from '../lib/errors';
    17	import * as mutationLedger from '../lib/storage/mutation-ledger';
    18	import { runInTransaction } from '../lib/storage/transaction-manager';
    19	import { createMCPSuccessResponse } from '../lib/response/envelope';
    20	import { toErrorMessage } from '../utils';
 succeeded in 52ms:
   590	    query,
   591	    concepts,
   592	    specFolder,
   593	    limit: rawLimit = 10,
   594	    tier,
   595	    contextType,
   596	    useDecay: useDecay = true,
   597	    includeContiguity: includeContiguity = false,
   598	    includeConstitutional: includeConstitutional = true,
   599	    includeContent: includeContent = false,
   600	    anchors,
   601	    bypassCache: bypassCache = false,
   602	    sessionId,
   603	    enableDedup: enableDedup = true,
   604	    intent: explicitIntent,
   605	    autoDetectIntent: autoDetectIntent = true,
   606	    minState: minState = 'WARM',
   607	    applyStateLimits: applyStateLimits = false,
   608	    rerank = true, // AI-TRACE:C138-P2: Enable reranking by default for better result quality
   609	    applyLengthPenalty: applyLengthPenalty = true,
exec
/bin/zsh -lc "rg -n \"ENABLE_BM25|isBm25Enabled\\(|SPECKIT_DEGREE_BOOST|searchWithFallback\\(|searchWithFallbackTiered|calibrateTier3Scores|hybridAdaptiveFuse|fuseResultsMulti\" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:56:function isBm25Enabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:57:  return process.env.ENABLE_BM25 !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:177:/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:179:  return isFeatureEnabled('SPECKIT_DEGREE_BOOST');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:11:import { hybridAdaptiveFuse } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:396: * @deprecated Use hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:650:    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:715:      const adaptiveResult = hybridAdaptiveFuse(semanticResults, keywordResults, intent);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:726:      const fused = fuseResultsMulti(lists);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1028: * fallback (searchWithFallbackTiered). Otherwise: C138-P0 two-pass adaptive
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1036:async function searchWithFallback(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1043:    return searchWithFallbackTiered(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1302:function calibrateTier3Scores(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1405:async function searchWithFallbackTiered(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1468:  const calibratedTier3 = calibrateTier3Scores(results, tier3Results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1660:  calibrateTier3Scores,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1298,1495p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  1298	/**
  1299	 * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
  1300	 * Prevents structural placeholders from outranking stronger semantic/lexical hits.
  1301	 */
  1302	function calibrateTier3Scores(
  1303	  existing: HybridSearchResult[],
  1304	  tier3: HybridSearchResult[]
  1305	): HybridSearchResult[] {
  1306	  const topExisting = existing.reduce((max, row) => {
  1307	    if (typeof row.score !== 'number' || !Number.isFinite(row.score)) {
  1308	      return max;
  1309	    }
  1310	    return Math.max(max, row.score);
  1311	  }, 0);
  1312	
  1313	  if (topExisting <= 0) {
  1314	    return tier3;
  1315	  }
  1316	
  1317	  const topCap = topExisting * 0.9;
exec
/bin/zsh -lc "rg -n \"search-fallback-tiered|hybrid-search\\.ts|stage4-filter\\.ts\" .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
13:| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration with tiered fallback |
14:| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4 filtering and quality check |
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | rg 'fallback|tiered'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fallback.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Extraction Adapter
     3	// ---------------------------------------------------------------
     4	
     5	import type Database from 'better-sqlite3';
     6	import * as workingMemory from '../cache/cognitive/working-memory';
     7	import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
     8	import { applyRedactionGate } from './redaction-gate';
     9	
    10	type SummarizerId = 'firstLast500' | 'matchCountSummary' | 'stdoutSummary';
    11	
    12	interface ExtractionRule {
    13	  id: string;
    14	  toolPattern: RegExp;
    15	  contentPattern: RegExp;
    16	  attention: number;
    17	  summarizer: SummarizerId;
    18	}
    19	
    20	interface RuleMatch {
exec
/bin/zsh -lc "rg -n \"0\\.85|0\\.05|0\\.01|checkpoint|upsertExtractedEntry|event-distance|decay\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:4:// Gzip-compressed database checkpoints with embedding preservation
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:91:  if (!db) throw new Error('Database not initialized. The checkpoints module requires the MCP server to be running. Restart the MCP server and retry.');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:295:    'decay_half_life_days',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:334:   loss from corrupt/malformed checkpoint snapshots.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:338: * Validates a single memory row from a checkpoint snapshot.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:344: * backwards compatibility with older checkpoint formats.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:380:    name = `checkpoint-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:388:    const checkpointInfo = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:467:        INSERT INTO checkpoints (name, created_at, spec_folder, git_branch, memory_snapshot, metadata)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:483:      // Enforce max checkpoints
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:484:      const checkpointCount = (database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:485:        'SELECT COUNT(*) as count FROM checkpoints'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:488:      if (checkpointCount.count > MAX_CHECKPOINTS) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:490:          DELETE FROM checkpoints WHERE id IN (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:491:            SELECT id FROM checkpoints ORDER BY created_at ASC LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:493:        `).run(checkpointCount.count - MAX_CHECKPOINTS);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:507:    console.error(`[checkpoints] Created checkpoint "${name}" (${checkpointInfo.snapshotSize} bytes compressed)`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:509:    return checkpointInfo;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:512:    console.warn(`[checkpoints] createCheckpoint error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:527:      FROM checkpoints ${folderFilter}
exec
/bin/zsh -lc 'rg -n "asyncEmbedding|async_embedding|Deferred: async_embedding requested|pending re-indexing|job queue|background" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib | head -n 200' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1077:// AI-TRACE T302: Clear all background intervals on shutdown (GAP 1).
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:375:// WARM (0.25 <= R < 0.80) - Accessible background, summary only
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Embedding will be retried by background job',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:52:  asyncEmbedding: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:60:  asyncEmbedding: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:74:  asyncEmbedding,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:147:  if (asyncEmbedding && embeddingStatus === 'pending') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:173:export function buildSaveResponse({ result, filePath, asyncEmbedding, requestId }: BuildSaveResponseParams): MCPResponse {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:272:    if (asyncEmbedding) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:273:      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:236:    hints.push(`${statusCounts.pending} memories pending re-indexing`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:68:  backgroundJobIntervalMs: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:79:  backgroundJobIntervalMs: 7200000, // 2 hours
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:111:let backgroundJob: ReturnType<typeof setInterval> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:532:function startBackgroundJob(intervalMs: number = ARCHIVAL_CONFIG.backgroundJobIntervalMs): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:533:  if (backgroundJob) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:534:    clearInterval(backgroundJob);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:537:  backgroundJob = setInterval(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:546:  if (backgroundJob.unref) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:547:    backgroundJob.unref();
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '360,455p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts | sed -n '130,290p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   360	      const errorCode = (typeof firstError === 'object' && firstError?.code)
   361	        ? firstError.code
   362	        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
   363	      throw new preflight.PreflightError(
   364	        errorCode,
   365	        `Pre-flight validation failed: ${errorMessages}`,
   366	        {
   367	          errors: preflightResult.errors,
   368	          warnings: preflightResult.warnings,
   369	          recoverable: true,
   370	          suggestion: 'Fix the validation errors and retry, or use skipPreflight=true to bypass',
   371	        }
   372	      );
   373	    }
   374	
   375	    if (preflightResult.warnings.length > 0) {
   376	      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
   377	      preflightResult.warnings.forEach((w: string | { message: string }) => {
   378	        const msg = typeof w === 'string' ? w : w.message;
   379	        console.warn(`[preflight]   - ${msg}`);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts | sed -n '90,135p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    90	
    91	function getOriginalPath(pendingPath: string): string {
    92	  const dir = path.dirname(pendingPath);
    93	  const ext = path.extname(pendingPath);
    94	  const base = path.basename(pendingPath, ext);
    95	  const originalBase = base.replace(new RegExp(`${PENDING_SUFFIX}$`), '');
    96	  return path.join(dir, `${originalBase}${ext}`);
    97	}
    98	
    99	function runInTransaction<T>(database: Database.Database, callback: () => T): T {
   100	  const runCallback = (): T => {
   101	    const depth = activeTransactions.get(database) ?? 0;
   102	    activeTransactions.set(database, depth + 1);
   103	    try {
   104	      return callback();
   105	    } finally {
   106	      const nextDepth = (activeTransactions.get(database) ?? 1) - 1;
   107	      if (nextDepth > 0) {
   108	        activeTransactions.set(database, nextDepth);
   109	      } else {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts | sed -n '1,40p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Prediction Error Gate
     3	// ---------------------------------------------------------------
     4	
     5	import type Database from 'better-sqlite3';
     6	
     7	/* -------------------------------------------------------------
     8	   1. CONSTANTS
     9	----------------------------------------------------------------*/
    10	
    11	const THRESHOLD = {
    12	  DUPLICATE: 0.95,
    13	  HIGH_MATCH: 0.85,
    14	  MEDIUM_MATCH: 0.70,
    15	  LOW_MATCH: 0.50,
    16	} as const;
    17	
    18	const ACTION = {
    19	  CREATE: 'CREATE',
    20	  UPDATE: 'UPDATE',
exec
/bin/zsh -lc 'rg -n "memory_conflicts|recordConflict|INSERT INTO memory_conflicts|logPeDecision|evaluateAndApplyPeDecision" .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:339:      INSERT INTO memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:375:      `SELECT COUNT(*) as count FROM memory_conflicts ${folderFilter}`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:379:      `SELECT action, COUNT(*) as count FROM memory_conflicts ${folderFilter} GROUP BY action`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:383:      `SELECT COUNT(*) as count FROM memory_conflicts WHERE contradiction_detected = 1 ${specFolder ? 'AND spec_folder = ?' : ''}`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:387:      `SELECT AVG(similarity) as avg_sim FROM memory_conflicts ${folderFilter}`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:416:      SELECT * FROM memory_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:26:// v12: Unified memory_conflicts DDL (KL-1 Schema Unification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:97:      // Create memory_conflicts table for prediction error gating audit
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:100:          CREATE TABLE IF NOT EXISTS memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:112:        logger.info('Migration v4: Created memory_conflicts table');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:115:          console.warn('[VectorIndex] Migration v4 warning (memory_conflicts):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:300:      // v11 -> v12: Unify memory_conflicts DDL (KL-1 Schema Unification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:303:          DROP TABLE IF EXISTS memory_conflicts;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:304:          CREATE TABLE IF NOT EXISTS memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:322:        logger.info('Migration v12: Unified memory_conflicts table (KL-1)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:324:        console.warn('[VectorIndex] Migration v12 warning (memory_conflicts):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:328:        database.exec('CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:329:        database.exec('CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:330:        logger.info('Migration v12: Created memory_conflicts indexes');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1100:    CREATE TABLE IF NOT EXISTS memory_conflicts (
exec
/bin/zsh -lc 'rg -n "description cache|context header|tree header|buildContextHeader|header" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
958:      // CHK-060: Reserve token overhead for contextual tree headers (~12 tokens per result)
959:      const headerOverhead = isContextHeadersEnabled() ? reranked.length * 12 : 0;
960:      const adjustedBudget = Math.max(budgetResult.budget - headerOverhead, 200);
1282:  const header = truncateChars(withDesc, 100);
1286:    content: `${header}\n${content}`,
exec
/bin/zsh -lc 'rg -n "triggerSignals|signal vocabulary|correction|preference|SPECKIT_SIGNAL_VOCAB|signal boost" .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:10:export type SignalCategory = 'correction' | 'preference' | 'neutral';
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:315:/* --- 6. SIGNAL VOCABULARY DETECTION (SPECKIT_SIGNAL_VOCAB) --- */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:322:  'correction',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:328:/** Keywords for PREFERENCE signals — user is expressing a preference or intent */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:339:// AI-WHY: Correction signals (0.2) weighted higher than preferences (0.1) — corrections indicate stronger search intent
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:342:  correction: 0.2,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:343:  preference: 0.1,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:349: * Only active when the SPECKIT_SIGNAL_VOCAB env var is set.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:360:  const correctionHits: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:363:      correctionHits.push(kw);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:366:  if (correctionHits.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:368:      category: 'correction',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:369:      keywords: correctionHits,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:370:      boost: SIGNAL_BOOSTS.correction,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:375:  const preferenceHits: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:378:      preferenceHits.push(kw);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:381:  if (preferenceHits.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:383:      category: 'preference',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:384:      keywords: preferenceHits,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:385:      boost: SIGNAL_BOOSTS.preference,
exec
/bin/zsh -lc 'rg -n "includeTrace|sessionLifecycle|folderDiscovery|retrievalTelemetry|systemPromptContext|effectiveSessionId|pressure" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
27:} from '../lib/cache/cognitive/pressure-monitor';
32:import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';
63:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
70:  effectiveSessionId: string;
94:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
325:    includeTrace: options.includeTrace || false, // CHK-040
347:    includeTrace: options.includeTrace || false, // CHK-040
374:    includeTrace: options.includeTrace || false, // CHK-040
445:  const effectiveSessionId = requestedSessionId ?? randomUUID();
450:  const sessionLifecycle: SessionLifecycleMetadata = {
453:    effectiveSessionId,
472:  // Resolve token pressure (caller -> estimator -> unavailable)
474:    ? isIdentityInRollout(effectiveSessionId)
476:  const pressurePolicyEnabled = process.env.SPECKIT_PRESSURE_POLICY !== 'false' && rolloutEnabled;
479:  const pressurePolicy = pressurePolicyEnabled
487:  if (pressurePolicy.warning) {
488:    console.warn(pressurePolicy.warning);
495:    sessionId: effectiveSessionId,
498:    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
507:  let pressureOverrideTargetMode: 'quick' | 'focused' | null = null;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '24,40p' && printf '\\nFILE_END\\n' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '347,418p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    24	
    25	const WORKING_MEMORY_CONFIG: WorkingMemoryConfigType = {
    26	  enabled: process.env.SPECKIT_WORKING_MEMORY !== 'false',
    27	  maxCapacity: 7, // Miller's Law: 7 +/- 2
    28	  sessionTimeoutMs: 1800000, // 30 minutes
    29	};
    30	
    31	const EVENT_DECAY_FACTOR = 0.85;
    32	const MENTION_BOOST_FACTOR = 0.05;
    33	const DECAY_FLOOR = 0.05;
    34	const DELETE_THRESHOLD = 0.01;
    35	const EVENT_COUNTER_MODULUS = 2 ** 31;
    36	// AI-WHY: Cap mention_count to prevent unbounded integer growth in long-lived
    37	// sessions. The mention boost formula (mention_count * MENTION_BOOST_FACTOR)
    38	// would produce unreasonably large scores without a ceiling.
    39	const MAX_MENTION_COUNT = 100;
    40	

FILE_END
   347	function upsertExtractedEntry(input: ExtractedEntryInput): boolean {
exec
/bin/zsh -lc 'rg -n "memory_history|orphaned history|cleanup" .opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
40:cleanup-orphaned-vectors — Remove orphaned vector embeddings and history entries
42:Usage: node cleanup-orphaned-vectors.js [options]
49:  node cleanup-orphaned-vectors.js                # Run cleanup
50:  node cleanup-orphaned-vectors.js --dry-run      # Preview only
78:    console.log('\n[Step 1] Finding orphaned memory_history entries...');
84:        FROM memory_history h
90:        console.log(`Found ${orphanedHistory.length} orphaned history entries`);
92:        console.log('No orphaned history entries found');
99:        console.warn('memory_history discovery warning:', errMsg);
115:    // AI-WHY: ISS-B04-002 fix — wrapping history + vector cleanup in one
120:        console.log(`[DRY-RUN] Would delete ${orphanedHistory.length} orphaned history entries`);
133:        // Delete orphaned history entries
135:          const deleteHistoryStmt = database.prepare('DELETE FROM memory_history WHERE memory_id = ?');
139:          console.log(`Deleted ${orphanedHistory.length} orphaned history entries`);
154:      console.log(`Atomic cleanup committed: ${totalCleaned} total entries removed`);
166:      historyCount = database.prepare('SELECT COUNT(*) as count FROM memory_history').get() as CountResult;
184:    console.error('[cleanup-orphaned-vectors] Error:', errMsg);
exec
/bin/zsh -lc 'rg -n "extraction-adapter|working-memory|checkpoints|extraction-adapter.vitest|working-memory-event-decay|checkpoint-working-memory" .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
5:The working memory module (`lib/cognitive/working-memory.ts`) captures salient results from tool invocations and stores them as session-scoped attention items. When a retrieval tool returns results, the system extracts key findings and inserts them into the `working_memory` table with an attention score. These extracted items persist across turns within the same session, enabling cross-turn context continuity.
7:The checkpoint module (`lib/storage/checkpoints.ts`) also participates by preserving working memory state during checkpoint creation so that restored sessions retain their accumulated tool-result context. Attention scores decay with an event-distance model (0.85 per event elapsed) with a floor of 0.05 and explicit eviction at 0.01, ensuring that recent tool results remain prominent while older ones gracefully fade.
15:| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory with tool-result extraction |
16:| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint preservation of working memory |
22:| `mcp_server/tests/working-memory.vitest.ts` | Working memory tests |
23:| `mcp_server/tests/working-memory-event-decay.vitest.ts` | Working memory decay tests |
24:| `mcp_server/tests/checkpoint-working-memory.vitest.ts` | Checkpoint working memory tests |
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# AST-level section retrieval tool

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** `read_spec_section(filePath, heading)` via Markdown AST parsing (`remark`) is deferred until spec docs routinely exceed ~1000 lines. Existing R7 anchor-aware thinning remains the current approach. Estimated effort: M (5-7 days).

---

## Source Files

No source files yet — this feature is planned but not yet implemented.

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: AST-level section retrieval tool
- Current reality source: feature_catalog.md
exec
/bin/zsh -lc 'rg -n "memory_validate|handleMemoryValidate|Positive validation recorded|groundTruthSelectionId|autoPromotion" .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:43:      'handleMemoryValidate',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:58:        'handle_memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:332:  // SUITE: handleMemoryValidate Validation
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:334:  describe('handleMemoryValidate Validation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:337:        handler.handleMemoryValidate(
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:338:          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ wasUseful: true }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:345:        handler.handleMemoryValidate(
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:346:          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({ id: 1 }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:353:        handler.handleMemoryValidate(
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:354:          invalidArgs<Parameters<typeof handler.handleMemoryValidate>[0]>({
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:363:      await expect(handler.handleMemoryValidate({ id: '7abc', wasUseful: true })).rejects.toThrow(/id.*integer|id.*number/i);
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:186:    'handleMemoryValidate',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:13:type MemoryValidateArgs = Parameters<typeof checkpointHandler.handleMemoryValidate>[0];
.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts:73:      await expect(checkpointHandler.handleMemoryValidate({} as MemoryValidateArgs)).rejects.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:30:        memory_validate: 500,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:261:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1494:      'memory_validate': '[L4:Mutation]',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:92:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:93:    handler: 'handleMemoryValidate',
codex
---
FEATURE: 01-unified-context-retrieval-memorycontext.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `includeTrace` passthrough; response metadata includes `sessionLifecycle`, `folderDiscovery`, and extended retrieval telemetry
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-context.ts:63,325-374,445-454,617-623,663-681
---
FEATURE: 02-semantic-and-lexical-search-memorysearch.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `includeTrace`/`retrievalTrace`; `artifactRouting` and `evidenceGapWarning` metadata; `includeArchived` and `applyStateLimits`
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-search.ts:617-620,775-810,822-860,905-977; mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:184-214
---
FEATURE: 03-trigger-phrase-matching-memorymatchtriggers.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: signal-vocabulary detection/boosting for correction and preference language; `triggerSignals` in response metadata
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-triggers.ts:229-245,437; mcp_server/lib/parsing/trigger-matcher.ts:315-395,488-490
---
FEATURE: 04-hybrid-search-pipeline.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: contextual tree/header injection is budgeted and prepended to returned content when enabled
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/hybrid-search.ts:713-726,958-960,1028-1058,1282-1286
---
FEATURE: 05-4-stage-pipeline-architecture.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Stage 1 can add a summary-embedding channel at scale when memory summaries are enabled
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508-520; mcp_server/handlers/memory-search.ts:775-810
---
FEATURE: 06-bm25-trigger-phrase-re-index-gate.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-crud-update.ts
UNDOCUMENTED_CAPABILITIES: the reindexed BM25 text includes title, `content_text`, `trigger_phrases`, and `file_path`, not just the changed field
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-update.ts:143-159
---
FEATURE: 07-ast-level-section-retrieval-tool.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: No `read_spec_section` implementation exists under mcp_server; the feature file correctly says “No source files yet”
---
FEATURE: 08-quality-aware-3-tier-search-fallback.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Says Tier 3 scores are capped at 50% of the top existing score; code caps them at 90% of the top score with an 8%-per-rank decay
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tests/search-fallback-tiered.vitest.ts
UNDOCUMENTED_CAPABILITIES: Tier 2/3 results are merged by ID using higher-score retention before final limiting
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/hybrid-search.ts:1302-1325,1335-1361,1405-1485
---
FEATURE: 09-tool-result-extraction-to-working-memory.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Extraction is not implemented inside `working-memory.ts` and is not generic for every retrieval result; it is rule-based in `lib/extraction/extraction-adapter.ts` and can skip inserts when no rule, no memory ID, or too much redaction applies
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/extraction/extraction-adapter.ts; mcp_server/tests/extraction-adapter.vitest.ts
UNDOCUMENTED_CAPABILITIES: rule-based extraction (`read-spec`, `grep-error`, `bash-git-commit`); redaction gating; provenance fields (`source_tool`, `source_call_id`, `extraction_rule_id`)
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/extraction/extraction-adapter.ts:38-60,215-256; mcp_server/lib/cognitive/working-memory.ts:31-34,347-412
---
FEATURE: 01-memory-indexing-memorysave.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: quality-loop auto-fixes can mutate content before storage; spec-folder content-hash dedup; async mode triggers an immediate retry-manager attempt in addition to pending status
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative code review due 100+ refs; primary modules checked: mcp_server/handlers/memory-save.ts:122-241, mcp_server/lib/validation/save-quality-gate.ts:99-109,221-248, mcp_server/lib/storage/reconsolidation.ts:103-170, mcp_server/handlers/save/response-builder.ts:147-155,270-274
---
FEATURE: 02-memory-metadata-update-memoryupdate.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: BM25 reindex runs when title or trigger phrases change; the update uses `runInTransaction()`; the response includes post-mutation hook feedback
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-update.ts:86-126,135-214
---
FEATURE: 03-single-and-folder-delete-memorydelete.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: “The entire operation is atomic” is overstated for folder deletes; when no DB handle is available the bulk path falls back to a non-transactional delete loop
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: bulk delete can proceed without a checkpoint on checkpoint-creation failure; response includes `restoreCommand` and post-mutation hook feedback
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-delete.ts:159-199,222-239
---
FEATURE: 04-tier-based-bulk-deletion-memorybulkdelete.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/handlers/memory-bulk-delete.ts:58-69,102-139,170-206,235
---
FEATURE: 05-validation-feedback-memoryvalidate.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Learned feedback is not guaranteed whenever `queryId` is present; `recordSelection()` only applies on positive feedback with query terms and rank, and then still respects top-3 exclusion, memory-age, feature-flag, and shadow-period safeguards
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/checkpoints.ts; mcp_server/lib/scoring/confidence-tracker.ts; mcp_server/lib/search/auto-promotion.ts; mcp_server/lib/scoring/negative-feedback.ts; mcp_server/lib/search/learned-feedback.ts; mcp_server/lib/eval/ground-truth-feedback.ts
UNDOCUMENTED_CAPABILITIES: promotion-eligibility and repeated-negative hints; ground-truth logging stores searchMode, intent, rank, total-results, sessionId, and notes
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative code review due 100+ refs; mcp_server/handlers/checkpoints.ts:313-420, mcp_server/lib/scoring/confidence-tracker.ts:100-154, mcp_server/lib/search/learned-feedback.ts:264-316
---
FEATURE: 06-transaction-wrappers-on-mutation-handlers.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The update handler did not gain a raw `database.transaction(() => {...})()` wrapper; it uses `runInTransaction(database, ...)`, which is nested-transaction aware
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/memory-crud-update.ts; mcp_server/handlers/memory-crud-delete.ts
UNDOCUMENTED_CAPABILITIES: `runInTransaction()` skips double-wrapping when already inside a transaction
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-update.ts:135-187; mcp_server/handlers/memory-crud-delete.ts:68-92; mcp_server/lib/storage/transaction-manager.ts:99-120
---
FEATURE: 07-namespace-management-crud-tools.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: Representative sample only due 100+ refs; `rg` for `create_namespace|switch_namespace|delete_namespace|list_namespaces` under mcp_server returned no hits, while current scoping is still plain `specFolder` filtering in mcp_server/handlers/memory-crud-list.ts:70-73
---
FEATURE: 08-prediction-error-save-arbitration.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: conflict audit rows also store previews, `new_memory_id`, and contradiction type metadata
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/cognitive/prediction-error-gate.ts:11-16,248-260,339-345; mcp_server/lib/search/vector-index-schema.ts:1100-1125
---
FEATURE: 09-correction-tracking-with-undo.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The Current Reality section omits the implemented undo path entirely, despite `undo_correction()` plus `is_undone`/`undone_at` support
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: `undo_correction()` restores stability and removes causal edges; query APIs exist for correction history, correction chains, and stats
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/learning/corrections.ts:233-260,356-420,537-586,634-751
---
FEATURE: 10-per-memory-history-log.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The schema only supports `ADD|UPDATE|DELETE`, not created/updated/merged/archived/restored; and no production save/update/session-learning/archival flow calls `recordHistory()`, so the described lifecycle logging is not wired up
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/storage/history.ts; mcp_server/tests/history.vitest.ts
UNDOCUMENTED_CAPABILITIES: the helper module can read per-memory history and folder-scoped history stats, but production mutation flows do not currently populate it
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: mcp_server/lib/storage/history.ts:55-66,107-180; `recordHistory(` appears only in history.ts and tests; mcp_server/lib/search/vector-index-mutations.ts:355,445 only deletes history rows
---
FEATURE: 01-memory-browser-memorylist.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The doc says you can inspect a memory’s tier here, but the response does not return `importance_tier`
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: invalid `sortBy` silently falls back to `created_at`; `specFolder` filtering is exact-match, not hierarchical
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-list.ts:58-60,81-103
---
FEATURE: 02-system-statistics-memorystats.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: “Tier distribution across all six tiers” is stronger than the code; `tierBreakdown` is whatever `importance_tier` values currently exist in `memory_index`
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `excludePatterns` regex filtering and `includeArchived` controls affect folder ranking
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-stats.ts:41-47,78-83,111-159,191-204
---
FEATURE: 03-health-diagnostics-memoryhealth.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Health status is not downgraded by alias conflicts or FTS mismatch; status is computed from embedding-model readiness and DB connectivity only, while FTS mismatch/alias issues are returned as hints. The returned DB path is also redacted, not raw
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: full-mode `autoRepair` can rebuild FTS, refresh trigger cache, and clean orphaned causal edges; divergent-alias output redacts absolute paths
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative code review due 100+ refs; mcp_server/handlers/memory-crud-health.ts:231-355 shows `status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded'` and wires `autoRepair` for FTS rebuild plus orphan-edge cleanup
tokens used
611,070
---
FEATURE: 01-unified-context-retrieval-memorycontext.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `includeTrace` passthrough; response metadata includes `sessionLifecycle`, `folderDiscovery`, and extended retrieval telemetry
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-context.ts:63,325-374,445-454,617-623,663-681
---
FEATURE: 02-semantic-and-lexical-search-memorysearch.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `includeTrace`/`retrievalTrace`; `artifactRouting` and `evidenceGapWarning` metadata; `includeArchived` and `applyStateLimits`
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-search.ts:617-620,775-810,822-860,905-977; mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:184-214
---
FEATURE: 03-trigger-phrase-matching-memorymatchtriggers.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: signal-vocabulary detection/boosting for correction and preference language; `triggerSignals` in response metadata
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-triggers.ts:229-245,437; mcp_server/lib/parsing/trigger-matcher.ts:315-395,488-490
---
FEATURE: 04-hybrid-search-pipeline.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: contextual tree/header injection is budgeted and prepended to returned content when enabled
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/hybrid-search.ts:713-726,958-960,1028-1058,1282-1286
---
FEATURE: 05-4-stage-pipeline-architecture.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Stage 1 can add a summary-embedding channel at scale when memory summaries are enabled
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508-520; mcp_server/handlers/memory-search.ts:775-810
---
FEATURE: 06-bm25-trigger-phrase-re-index-gate.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-crud-update.ts
UNDOCUMENTED_CAPABILITIES: the reindexed BM25 text includes title, `content_text`, `trigger_phrases`, and `file_path`, not just the changed field
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-update.ts:143-159
---
FEATURE: 07-ast-level-section-retrieval-tool.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: No `read_spec_section` implementation exists under mcp_server; the feature file correctly says “No source files yet”
---
FEATURE: 08-quality-aware-3-tier-search-fallback.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Says Tier 3 scores are capped at 50% of the top existing score; code caps them at 90% of the top score with an 8%-per-rank decay
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tests/search-fallback-tiered.vitest.ts
UNDOCUMENTED_CAPABILITIES: Tier 2/3 results are merged by ID using higher-score retention before final limiting
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/search/hybrid-search.ts:1302-1325,1335-1361,1405-1485
---
FEATURE: 09-tool-result-extraction-to-working-memory.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Extraction is not implemented inside `working-memory.ts` and is not generic for every retrieval result; it is rule-based in `lib/extraction/extraction-adapter.ts` and can skip inserts when no rule, no memory ID, or too much redaction applies
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/extraction/extraction-adapter.ts; mcp_server/tests/extraction-adapter.vitest.ts
UNDOCUMENTED_CAPABILITIES: rule-based extraction (`read-spec`, `grep-error`, `bash-git-commit`); redaction gating; provenance fields (`source_tool`, `source_call_id`, `extraction_rule_id`)
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/extraction/extraction-adapter.ts:38-60,215-256; mcp_server/lib/cognitive/working-memory.ts:31-34,347-412
---
FEATURE: 01-memory-indexing-memorysave.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: quality-loop auto-fixes can mutate content before storage; spec-folder content-hash dedup; async mode triggers an immediate retry-manager attempt in addition to pending status
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative code review due 100+ refs; primary modules checked: mcp_server/handlers/memory-save.ts:122-241, mcp_server/lib/validation/save-quality-gate.ts:99-109,221-248, mcp_server/lib/storage/reconsolidation.ts:103-170, mcp_server/handlers/save/response-builder.ts:147-155,270-274
---
FEATURE: 02-memory-metadata-update-memoryupdate.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: BM25 reindex runs when title or trigger phrases change; the update uses `runInTransaction()`; the response includes post-mutation hook feedback
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-update.ts:86-126,135-214
---
FEATURE: 03-single-and-folder-delete-memorydelete.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: “The entire operation is atomic” is overstated for folder deletes; when no DB handle is available the bulk path falls back to a non-transactional delete loop
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: bulk delete can proceed without a checkpoint on checkpoint-creation failure; response includes `restoreCommand` and post-mutation hook feedback
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-delete.ts:159-199,222-239
---
FEATURE: 04-tier-based-bulk-deletion-memorybulkdelete.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: mcp_server/handlers/memory-bulk-delete.ts:58-69,102-139,170-206,235
---
FEATURE: 05-validation-feedback-memoryvalidate.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Learned feedback is not guaranteed whenever `queryId` is present; `recordSelection()` only applies on positive feedback with query terms and rank, and then still respects top-3 exclusion, memory-age, feature-flag, and shadow-period safeguards
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/checkpoints.ts; mcp_server/lib/scoring/confidence-tracker.ts; mcp_server/lib/search/auto-promotion.ts; mcp_server/lib/scoring/negative-feedback.ts; mcp_server/lib/search/learned-feedback.ts; mcp_server/lib/eval/ground-truth-feedback.ts
UNDOCUMENTED_CAPABILITIES: promotion-eligibility and repeated-negative hints; ground-truth logging stores searchMode, intent, rank, total-results, sessionId, and notes
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative code review due 100+ refs; mcp_server/handlers/checkpoints.ts:313-420, mcp_server/lib/scoring/confidence-tracker.ts:100-154, mcp_server/lib/search/learned-feedback.ts:264-316
---
FEATURE: 06-transaction-wrappers-on-mutation-handlers.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The update handler did not gain a raw `database.transaction(() => {...})()` wrapper; it uses `runInTransaction(database, ...)`, which is nested-transaction aware
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/memory-crud-update.ts; mcp_server/handlers/memory-crud-delete.ts
UNDOCUMENTED_CAPABILITIES: `runInTransaction()` skips double-wrapping when already inside a transaction
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-update.ts:135-187; mcp_server/handlers/memory-crud-delete.ts:68-92; mcp_server/lib/storage/transaction-manager.ts:99-120
---
FEATURE: 07-namespace-management-crud-tools.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: Representative sample only due 100+ refs; `rg` for `create_namespace|switch_namespace|delete_namespace|list_namespaces` under mcp_server returned no hits, while current scoping is still plain `specFolder` filtering in mcp_server/handlers/memory-crud-list.ts:70-73
---
FEATURE: 08-prediction-error-save-arbitration.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: conflict audit rows also store previews, `new_memory_id`, and contradiction type metadata
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/cognitive/prediction-error-gate.ts:11-16,248-260,339-345; mcp_server/lib/search/vector-index-schema.ts:1100-1125
---
FEATURE: 09-correction-tracking-with-undo.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The Current Reality section omits the implemented undo path entirely, despite `undo_correction()` plus `is_undone`/`undone_at` support
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/vector-index-schema.ts
UNDOCUMENTED_CAPABILITIES: `undo_correction()` restores stability and removes causal edges; query APIs exist for correction history, correction chains, and stats
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/lib/learning/corrections.ts:233-260,356-420,537-586,634-751
---
FEATURE: 10-per-memory-history-log.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The schema only supports `ADD|UPDATE|DELETE`, not created/updated/merged/archived/restored; and no production save/update/session-learning/archival flow calls `recordHistory()`, so the described lifecycle logging is not wired up
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/storage/history.ts; mcp_server/tests/history.vitest.ts
UNDOCUMENTED_CAPABILITIES: the helper module can read per-memory history and folder-scoped history stats, but production mutation flows do not currently populate it
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: mcp_server/lib/storage/history.ts:55-66,107-180; `recordHistory(` appears only in history.ts and tests; mcp_server/lib/search/vector-index-mutations.ts:355,445 only deletes history rows
---
FEATURE: 01-memory-browser-memorylist.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The doc says you can inspect a memory’s tier here, but the response does not return `importance_tier`
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: invalid `sortBy` silently falls back to `created_at`; `specFolder` filtering is exact-match, not hierarchical
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-list.ts:58-60,81-103
---
FEATURE: 02-system-statistics-memorystats.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: “Tier distribution across all six tiers” is stronger than the code; `tierBreakdown` is whatever `importance_tier` values currently exist in `memory_index`
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `excludePatterns` regex filtering and `includeArchived` controls affect folder ranking
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: mcp_server/handlers/memory-crud-stats.ts:41-47,78-83,111-159,191-204
---
FEATURE: 03-health-diagnostics-memoryhealth.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Health status is not downgraded by alias conflicts or FTS mismatch; status is computed from embedding-model readiness and DB connectivity only, while FTS mismatch/alias issues are returned as hints. The returned DB path is also redacted, not raw
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: full-mode `autoRepair` can rebuild FTS, refresh trigger cache, and clean orphaned causal edges; divergent-alias output redacts absolute paths
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative code review due 100+ refs; mcp_server/handlers/memory-crud-health.ts:231-355 shows `status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded'` and wires `autoRepair` for FTS rebuild plus orphan-edge cleanup
6:            action TEXT CHECK(action IN ('CREATE', 'CREATE_LINKED', 'UPDATE', 'SUPERSEDE', 'REINFORCE')),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:109:            FOREIGN KEY (existing_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:133:          ALTER TABLE memory_index ADD COLUMN memory_type TEXT DEFAULT 'declarative'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:147:        database.exec('ALTER TABLE memory_index ADD COLUMN half_life_days REAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:157:          ALTER TABLE memory_index ADD COLUMN type_inference_source TEXT DEFAULT 'default'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:182:        database.exec('ALTER TABLE memory_index ADD COLUMN file_mtime_ms INTEGER');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:235:            created_by TEXT DEFAULT 'manual',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:266:              'superseded', 'deprecated', 'refined', 'merged'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:274:            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:277:            FOREIGN KEY (original_memory_id) REFERENCES memory_index(id) ON DELETE CASCADE,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:278:            FOREIGN KEY (correction_memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:292:        database.exec('CREATE INDEX IF NOT EXISTS idx_corrections_created ON memory_corrections(created_at DESC)');
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# BM25 trigger phrase re-index gate

## Current Reality

The BM25 re-index condition in `memory-crud-update.ts` was expanded from title-only to title OR trigger phrases: `if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled())`. The BM25 corpus includes trigger phrases, so changes to either field must trigger re-indexing.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |

### Tests

| File | Focus |
|------|-------|
codex
I found one more pattern beyond the known bad retry path: a couple of “thin” feature files describe behavior correctly but omit the actual handler that implements it. I’m folding those into `MISSING_PATHS` instead of overcalling them as description problems.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/08-prediction-error-save-arbitration.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "title !== undefined|triggerPhrases !== undefined|bm25Index.isBm25Enabled" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "force = false|force: true|always active|REINFORCE|CREATE_LINKED|SUPERSEDE|memory_conflicts|document-type-aware|spec_folder" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Prediction-error save arbitration

## Current Reality

5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason, and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25). Always active unless `force: true` is passed.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating entry point |
| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | PE orchestration flow |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Lib | Prediction error computation |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |

### Tests

| File | Focus |
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:77:  if (title !== undefined) updateParams.title = title;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:78:  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:86:  if (title !== undefined && title !== existing.title) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:145:      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:57:      (peDecision.action === predictionErrorGate.ACTION.REINFORCE ||
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:58:        peDecision.action === predictionErrorGate.ACTION.SUPERSEDE ||
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:67:      case predictionErrorGate.ACTION.REINFORCE: {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:70:        console.error(`[PE-Gate] REINFORCE: Duplicate detected (${peDecision.similarity.toFixed(1)}%)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:72:        reinforced.pe_action = 'REINFORCE';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:86:              action: predictionErrorGate.ACTION.REINFORCE,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:98:      case predictionErrorGate.ACTION.SUPERSEDE: {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:100:        console.error(`[PE-Gate] SUPERSEDE: Contradiction detected with memory ${existingId}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:144:      case predictionErrorGate.ACTION.CREATE_LINKED: {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:145:        console.error(`[PE-Gate] CREATE_LINKED: Related content (${peDecision.similarity.toFixed(1)}%)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:108:async function indexMemoryFile(filePath: string, { force = false, parsedOverride = null as ReturnType<typeof memoryParser.parseMemoryFile> | null, asyncEmbedding = false } = {}): Promise<IndexResult> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:246:    WHERE spec_folder = ?
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:287:  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false, asyncEmbedding = false } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:309:        spec_folder: parsedForPreflight.specFolder,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:337:          spec_folder: parsedForPreflight.specFolder,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:402: * `memory_save({ filePath, force: true })` to rebuild the index entry.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:409:  const { force = false } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:443:      hints: ['Retry memory_save({ filePath, force: true }) to rebuild the memory index entry'],
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:62: * Spec 126: Applies document-type-aware weighting.
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:160:    // Spec 126: Keep document-type-aware weighting on reinforcement
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Tool-result extraction to working memory

## Current Reality

The working memory module (`lib/cognitive/working-memory.ts`) captures salient results from tool invocations and stores them as session-scoped attention items. When a retrieval tool returns results, the system extracts key findings and inserts them into the `working_memory` table with an attention score. These extracted items persist across turns within the same session, enabling cross-turn context continuity.

The checkpoint module (`lib/storage/checkpoints.ts`) also participates by preserving working memory state during checkpoint creation so that restored sessions retain their accumulated tool-result context. Attention scores decay with an event-distance model (0.85 per event elapsed) with a floor of 0.05 and explicit eviction at 0.01, ensuring that recent tool results remain prominent while older ones gracefully fade.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory with tool-result extraction |
| `mcp_server/lib/storage/checkpoints.ts` | Lib | Checkpoint preservation of working memory |

### Tests

| File | Focus |
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Namespace management CRUD tools

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Namespace CRUD (`list/create/switch/delete`) remains deferred pending demonstrated multi-tenant demand. Current scoping relies on logical `specFolder` filtering. Estimated effort: S-M (3-5 days).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
| `mcp_server/formatters/index.ts` | Formatter | Module barrel export |
| `mcp_server/formatters/search-results.ts` | Formatter | Search result formatting |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/handlers/causal-graph.ts` | Handler | Causal graph handler |
codex
I’ve got the audit decisions settled. I’m doing one final spot-check on the “planned/deferred” features so the report clearly distinguishes “not implemented” from “implemented but underdocumented.”
exec
/bin/zsh -lc 'rg -n "namespace|multi-tenant|tenant|switch namespace|create namespace|delete namespace" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"recordHistory\\(|getHistoryForMemory\\(|undoCorrection\\(|recordCorrection\\(|getCorrectionsForMemory\\(\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "read_spec_section|remark|AST-level section" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/feature_catalog/01--retrieval' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:

 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:73:      const id = mod.recordHistory(1, 'ADD', null, JSON.stringify({ title: 'Test Memory 1' }), 'system');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:85:      mod.recordHistory(1, 'UPDATE', JSON.stringify({ title: 'Old Title' }), JSON.stringify({ title: 'New Title' }), 'user');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:86:      mod.recordHistory(1, 'UPDATE', JSON.stringify({ title: 'New Title' }), JSON.stringify({ title: 'Final Title' }), 'system');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:136:      mod.recordHistory(2, 'DELETE', JSON.stringify({ title: 'Test Memory 2' }), null, 'user');
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:158:      const result: CorrectionResult = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:237:      const undoResult = corrections.undoCorrection(correctionToUndo.id);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:291:        corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:300:        corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:310:        corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:422:      const result: CorrectionResult = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:447:      const result: CorrectionResult = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:500:      const result: CorrectionResult = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:524:      const result: CorrectionResult = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:562:      results.superseded = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:569:      results.deprecated = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:575:      results.refined = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:582:      results.merged = corrections.recordCorrection({
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:609:        const correctionsList: CorrectionRecord[] = corrections.getCorrectionsForMemory(testIds[type].original);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:107:export function recordHistory(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:193:| `recordHistory(memoryId, event, prevValue, newValue, actor)` | Record a change event |
 succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md:1:# AST-level section retrieval tool
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md:5:**PLANNED (Sprint 019) — DEFERRED.** `read_spec_section(filePath, heading)` via Markdown AST parsing (`remark`) is deferred until spec docs routinely exceed ~1000 lines. Existing R7 anchor-aware thinning remains the current approach. Estimated effort: M (5-7 days).
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md:16:- Source feature title: AST-level section retrieval tool
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts:3:// AST-based markdown chunking using remark-gfm that keeps
exec
/bin/zsh -lc 'test -f .opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts && echo yes || echo no' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'test -f .opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts && echo yes || echo no; test -f .opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts && echo yes || echo no' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
yes
 succeeded in 51ms:
yes
yes
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# AST-level section retrieval tool

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** `read_spec_section(filePath, heading)` via Markdown AST parsing (`remark`) is deferred until spec docs routinely exceed ~1000 lines. Existing R7 anchor-aware thinning remains the current approach. Estimated effort: M (5-7 days).

---

## Source Files

No source files yet — this feature is planned but not yet implemented.

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: AST-level section retrieval tool
- Current reality source: feature_catalog.md
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Memory indexing (memory_save)

## Current Reality

`memory_save` is the entry point for getting content into the memory system. You give it a file path. It reads the file, parses metadata from the frontmatter (title, trigger phrases, spec folder, importance tier, context type, causal links), generates a vector embedding and indexes everything into the SQLite database.

Before embedding generation, content normalization strips structural markdown noise. Seven primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) run in sequence to produce cleaner text for the embedding model. BM25 has a separate normalization entry point (`normalizeContentForBM25`) that currently delegates to the embedding normalizer, and it is used on rebuild-from-database paths. In live save paths, raw content is passed to BM25 tokenization (`addDocument`) before tokenizer normalization.

The interesting part is what happens before the record is created. A Prediction Error (PE) gating system compares the new content against existing memories via cosine similarity and decides one of five actions. CREATE stores a new record when no similar memory exists. REINFORCE boosts the FSRS stability of an existing duplicate without creating a new entry (the system already knows this, so it strengthens the memory). UPDATE overwrites an existing high-similarity memory in-place when the new version supersedes the old. SUPERSEDE marks the old memory as deprecated, creates a new record and links them with a causal edge. CREATE_LINKED stores a new memory with a relationship edge to a similar but distinct existing memory.

A three-layer quality gate runs before storage when `SPECKIT_SAVE_QUALITY_GATE` is enabled (default ON). Layer 1 validates structure (title exists, content at least 50 characters, valid spec folder path). Layer 2 scores content quality across five dimensions (title, triggers, length, anchors, metadata) against a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity, rejecting near-duplicates above 0.92. A warn-only mode runs for the first 14 days after activation, logging would-reject decisions without blocking saves.

Reconsolidation-on-save runs after embedding generation when `SPECKIT_RECONSOLIDATION` is enabled (default ON). The system checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and `importance_weight` is boosted (capped at 1.0). Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores unchanged. A checkpoint must exist for the spec folder before reconsolidation can run.

For large files exceeding the chunking threshold, the system splits into a parent record (metadata only) plus child chunk records, each with its own embedding. Before indexing, anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary) and content density (weight 0.4, 0-1). Chunks scoring below 0.3 are dropped to reduce storage and search noise. The thinning never returns an empty array.

When `SPECKIT_ENCODING_INTENT` is enabled (default ON), the content type is classified at index time as `document`, `code` or `structured_data` using heuristic scoring against a 0.4 threshold. The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. This metadata has no retrieval-time scoring impact yet; it builds a labeled dataset for future type-aware retrieval.

After every successful save, a consolidation cycle hook fires when `SPECKIT_CONSOLIDATION` is enabled (default ON). The N3-lite consolidation engine scans for contradictions (memory pairs above 0.85 cosine similarity with negation keyword conflicts), runs Hebbian strengthening on recently accessed edges (+0.05 per cycle with a 30-day decay), detects stale edges (unfetched for 90+ days) and enforces edge bounds (maximum 20 per node). The cycle runs on a weekly cadence.

exec
/bin/zsh -lc 'rg -n "checkpoint|reconsolidation" .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:16:// REQUIRES: checkpoint created before first enable
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:84:/** Combined reconsolidation result */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:117: * Check if reconsolidation is enabled via feature flag.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:148:    console.warn('[reconsolidation] findSimilarMemories error:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:158: * Determine the reconsolidation action based on similarity score.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:219:        console.warn('[reconsolidation] Failed to regenerate embedding for merge:', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:346:          `TM-06 reconsolidation conflict: similarity ${(existingMemory.similarity * 100).toFixed(1)}%`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:415:/** Options for the reconsolidation orchestrator */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:423: * Orchestrate the full reconsolidation flow for a new memory.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:494:            console.warn('[reconsolidation] conflict pre-store failed, falling back to in-place conflict:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:509:            console.warn('[reconsolidation] cleaned up orphan memory', conflictMemory.id, 'after executeConflict failure');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:13:import { reconsolidate, isReconsolidationEnabled } from '../../lib/storage/reconsolidation';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:14:import type { ReconsolidationResult } from '../../lib/storage/reconsolidation';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:41:  // BUG-2 fix: Track reconsolidation warnings for structured MCP response (not just console.warn)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:48:        const reconMsg = 'TM-06: reconsolidation skipped — create checkpoint "pre-reconsolidation" first';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:51:        // Continue normal create path without reconsolidation.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:157:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:165:              action: `reconsolidation_${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:179:              reconsolidation: reconResult,
exec
/bin/zsh -lc 'rg -n "weekly|30-day|Hebbian|contradictions|maximum 20 per node|consolidation cycle" .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:4:// Lightweight graph maintenance: contradiction scan, Hebbian
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:52:  contradictions: ContradictionCluster[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:65:/** Consolidation cadence for runtime hook (weekly batch semantics) */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:80: * Find potential contradictions by:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:149:  // machine is slow, keeping the consolidation cycle non-blocking.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:330: * Hebbian strengthening: increase edge strength for recently co-accessed edges.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:332: * 30-day decay: edges not accessed in 30 days lose 0.1 strength.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:336:export function runHebbianCycle(database: Database.Database): { strengthened: number; decayed: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:377:          updateEdge(edge.id, { strength: newStrength }, 'hebbian', 'decay-30-day');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:384:    console.warn(`[consolidation] runHebbianCycle error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:429: * Run a full N3-lite consolidation cycle:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:431: * 2. Hebbian strengthening + decay
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:435: * Designed to run as a weekly batch job.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:440:  const contradictions = buildContradictionClusters(database, contradictionPairs);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:442:  // T002b: Hebbian strengthening + decay
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:443:  const hebbian = runHebbianCycle(database);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:468:    contradictions,
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Quality-aware 3-tier search fallback

## Current Reality

Adaptive search degradation chain in `searchWithFallbackTiered()`. Tier 1: enhanced hybrid search (minSimilarity=0.3, standard channels). Quality check via `checkDegradation()`: fails if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3. On fail, Tier 2: widened search (minSimilarity=0.1, all channels forced). Same quality check. On fail, Tier 3: structural SQL fallback (ORDER BY importance_tier, importance_weight). Tier 3 scores are calibrated to max 50% of existing top score to prevent outranking semantic hits. Degradation events are attached as non-enumerable `_degradation` property on the result set. Gated by `SPECKIT_SEARCH_FALLBACK` (default: true, graduated).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration with tiered fallback |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4 filtering and quality check |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
exec
/bin/zsh -lc 'test -f .opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts && echo exists || echo missing' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
exists
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | rg 'update|memory-crud-update|handler-memory-update|bm25'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts
exec
/bin/zsh -lc 'rg -n "postInsert|linkEntitiesToMemory|generateMemorySummaries|dryRun|skipPreflight|atomicSaveMemory" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:287:  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false, asyncEmbedding = false } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:301:  if (!skipPreflight) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:314:        dry_run: dryRun,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:324:    if (dryRun) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:326:      const dryRunSummary = preflightResult.dry_run_would_pass
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:332:        summary: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:344:          message: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:348:          : ['Fix validation errors before saving', 'Use skipPreflight: true to bypass validation'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:370:          suggestion: 'Fix the validation errors and retry, or use skipPreflight=true to bypass',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:407:async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:513:  atomicSaveMemory,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:559:const atomic_save_memory = atomicSaveMemory;
exec
/bin/zsh -lc 'rg -n "generateMemorySummary|generateMemorySummaries|entity|causal|post-insert|link" .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
9:import { processCausalLinks } from '../causal-links-processor';
15:import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
17:import { runEntityLinking } from '../../lib/search/entity-linker';
29:  causalLinksResult: CausalLinksResult | null;
33: * Run post-insert enrichment pipeline for a newly saved memory.
35: * Sequentially executes: causal links processing, entity extraction (R10),
36: * summary generation (R8), and cross-document entity linking (S5).
43: * @returns PostInsertEnrichmentResult with causal links outcome.
51:  let causalLinksResult: CausalLinksResult | null = null;
52:  if (parsed.hasCausalLinks && parsed.causalLinks) {
54:      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
55:      if (causalLinksResult.inserted > 0) {
56:        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
58:      if (causalLinksResult.unresolved.length > 0) {
59:        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
61:    } catch (causal_err: unknown) {
62:      const message = toErrorMessage(causal_err);
63:      console.warn(`[memory-save] Causal links processing failed: ${message}`);
73:        const entityResult = storeEntities(database, id, filtered);
75:        console.error(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Correction tracking with undo

## Current Reality

The corrections module (`lib/learning/corrections.ts`) tracks inter-memory relationship signals during the learning pipeline. When a memory supersedes, deprecates, refines, or merges with another, the correction is recorded with before/after stability scores and applied penalty/boost values. Four correction types are supported: `superseded`, `deprecated`, `refined`, and `merged`.

Each correction adjusts the stability scores of both the original and correcting memories: the original receives a penalty while the correction receives a boost. Stability changes are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are skipped and no stability adjustments are applied.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/learning/corrections.ts` | Lib | Correction tracking and stability adjustment |

### Tests

| File | Focus |
|------|-------|
exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/feature_catalog/02--mutation/10-per-memory-history-log.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Per-memory history log

## Current Reality

The `memory_history` table records a per-memory audit trail of state changes. Each row captures the memory ID, the type of event (created, updated, merged, archived, restored), a timestamp, and optional metadata about the change. This provides a complete lifecycle history for any individual memory, enabling operations like "show me everything that happened to memory #42."

The history log is populated by the save handler on creation, the update handler on modification, the session-learning handler on learning events, and the archival manager on tier transitions. The vector index schema module creates the `memory_history` table during database initialization. The cleanup-orphaned-vectors script uses the history table to find and remove orphaned entries when their parent memory no longer exists.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Schema creation for memory_history table |
| `mcp_server/handlers/session-learning.ts` | Handler | Session learning history events |
| `mcp_server/lib/storage/causal-edges.ts` | Lib | Causal edge history tracking |
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Index mutations writing history |
| `scripts/memory/cleanup-orphaned-vectors.ts` | Script | Orphaned history cleanup |

exec
/bin/zsh -lc 'rg -n "memory_history|DELETE FROM memory_history|recordHistory|history" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:355:    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:445:        database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:467:/** Handle memory_get_learning_history tool - retrieves learning records with optional summary stats */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:627:      ? `Learning history: ${learningHistory.length} records (${completedCount} complete)`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:628:      : `Learning history: ${learningHistory.length} preflight records`;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:639:      tool: 'memory_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:651:    console.error('[session-learning] Failed to get learning history:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:652:    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to retrieve learning history', { originalError: message });
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:670:const handle_get_learning_history = handleGetLearningHistory;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:676:  handle_get_learning_history,
exec
/bin/zsh -lc 'rg -n "existing.content_text|generateEmbedding|title changed|triggerPhrases" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
42:    triggerPhrases,
78:  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
93:      const contentText = existing.content_text || '';
145:      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
173:          triggerPhrases: updateParams.triggerPhrases ?? null,
codex
---
FEATURE: 01-unified-context-retrieval-memorycontext.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Resume mode injects `systemPromptContext`; the handler also reports caller-vs-ephemeral session lifecycle metadata and can auto-discover `specFolder` before full retrieval.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-context.ts:244](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts) defines `CONTEXT_MODES`; [memory-context.ts:617](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts) injects `systemPromptContext`; `mcp_server/tests/retry.vitest.ts` is absent on disk.

---
FEATURE: 02-semantic-and-lexical-search-memorysearch.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Supports `includeTrace`, `includeArchived`, `minState`, `applyStateLimits`, and returns `retrievalTrace`, `pipelineMetadata`, `artifactRouting`, `feedbackSignals`, `chunkReassembly`, and post-cache `dedupStats`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-search.ts:603](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts) shows the extra search flags; [memory-search.ts:819](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts) and [memory-search.ts:953](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts) attach pipeline metadata, traces, and dedup stats.

---
FEATURE: 03-trigger-phrase-matching-memorymatchtriggers.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Trigger matching also detects signal vocabulary matches and returns `triggerSignals`/hints about applied signal categories.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-triggers.ts:244](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts) fetches `limit * 2` candidates; [memory-triggers.ts:246](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts) and [memory-triggers.ts:437](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts) expose detected signals.

---
FEATURE: 04-hybrid-search-pipeline.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [hybrid-search.ts:1043](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) routes through `searchWithFallbackTiered()`; [hybrid-search.ts:544](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) shows channel routing/activation logic.

---
FEATURE: 05-4-stage-pipeline-architecture.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [orchestrator.ts:22](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts) wires Stages 1-4 in order; [stage4-filter.ts:247](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts) captures scores and [stage4-filter.ts:306](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts) verifies the score invariant.

---
FEATURE: 06-bm25-trigger-phrase-re-index-gate.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-crud-update.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [memory-crud-update.ts:145](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts) is the actual gate: `if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled())`.

---
FEATURE: 07-ast-level-section-retrieval-tool.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `rg -n "read_spec_section|remark"` across `mcp_server/`, `shared/`, and `scripts/` found no implementation; the feature file itself correctly says "No source files yet."

---
FEATURE: 08-quality-aware-3-tier-search-fallback.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The doc says Tier 3 scores are capped at 50% of the top existing score; code caps them at 90% (`topExisting * 0.9`).
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tests/search-fallback-tiered.vitest.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [hybrid-search.ts:1302](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) defines `calibrateTier3Scores()`; [hybrid-search.ts:1317](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) sets `const topCap = topExisting * 0.9`.

---
FEATURE: 09-tool-result-extraction-to-working-memory.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Extraction is not performed generically inside `working-memory.ts` alone. It is registered from `context-server.ts`, handled in `lib/extraction/extraction-adapter.ts`, then persisted via `workingMemory.upsertExtractedEntry()`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/context-server.ts, mcp_server/lib/extraction/extraction-adapter.ts, mcp_server/tests/extraction-adapter.vitest.ts
UNDOCUMENTED_CAPABILITIES: Rule-based after-tool extraction, redaction gating with skip thresholds, session/memory ID resolution, and persisted metadata columns (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`).
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [context-server.ts:94](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts) imports `initExtractionAdapter`; [context-server.ts:876](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts) registers it; [extraction-adapter.ts:215](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts) runs `handleAfterTool()`.

---
FEATURE: 01-memory-indexing-memorysave.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `dryRun`, `skipPreflight`, `atomicSaveMemory()`, and post-insert enrichment stages for causal links, entity extraction, summaries, and entity linking are not called out.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-save.ts:287](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts) exposes `dryRun`/`skipPreflight`; [memory-save.ts:407](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts) defines `atomicSaveMemory()`; [post-insert.ts:35](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts) runs enrichment.

---
FEATURE: 02-memory-metadata-update-memoryupdate.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: BM25 re-indexing also runs when trigger phrases change, not just when the title changes.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-update.ts:93](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts) rebuilds embedding from `existing.content_text`; [memory-crud-update.ts:145](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts) reindexes BM25 on title or trigger-phrase updates.

---
FEATURE: 03-single-and-folder-delete-memorydelete.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The folder-delete description overstates checkpoint guarantees. Code attempts an auto-checkpoint first, but if checkpoint creation returns null or throws, deletion still proceeds after warning when the user has confirmed.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Single-delete explicitly aborts when the database is unavailable to avoid orphaned causal-edge cleanup failures.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-delete.ts:133](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) attempts checkpoint creation; [memory-crud-delete.ts:146](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) and [memory-crud-delete.ts:153](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) proceed without rollback; [memory-crud-delete.ts:103](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) aborts on missing DB.

---
FEATURE: 04-tier-based-bulk-deletion-memorybulkdelete.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [memory-bulk-delete.ts:58](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts) refuses unscoped constitutional/critical deletion; [memory-bulk-delete.ts:102](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts) handles checkpoint creation and [memory-bulk-delete.ts:170](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts) deletes in a transaction.

---
FEATURE: 05-validation-feedback-memoryvalidate.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: The handler also accepts `queryId`, `queryTerms`, `resultRank`, `totalResultsShown`, `searchMode`, `intent`, `sessionId`, and `notes`, then records ground-truth selections and learned-feedback signals.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [checkpoints.ts:55](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts) declares the extra fields; [checkpoints.ts:378](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts) and [checkpoints.ts:392](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts) feed selection logging/learning.

---
FEATURE: 06-transaction-wrappers-on-mutation-handlers.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [memory-crud-update.ts:131](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts) wraps update-side mutations in a transaction; [memory-crud-delete.ts:66](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) and [memory-crud-delete.ts:161](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) do the same for delete paths.

---
FEATURE: 07-namespace-management-crud-tools.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The Current Reality text correctly says the feature is deferred, but the same file’s massive Source Files section implies an implemented feature surface, which is misleading.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [07-namespace-management-crud-tools.md:5](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md) marks the feature as deferred; `rg -n "namespace|switch namespace|create namespace|delete namespace"` across tool schemas/handlers returned no implementation hits.

---
FEATURE: 08-prediction-error-save-arbitration.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [pe-orchestration.ts:57](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts) dispatches REINFORCE/SUPERSEDE/CREATE_LINKED handling; [memory-save.ts:108](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts) is the save-path entry point that invokes it.

---
FEATURE: 09-correction-tracking-with-undo.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The module exists, but it is not wired into a production “learning pipeline.” Search hits for `recordCorrection()`/`undoCorrection()` are in the library and tests, not mutation handlers/tools.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Explicit undo support and correction-history retrieval (`undoCorrection()`, `getCorrectionsForMemory()`), which the description does not mention despite the feature title.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [corrections.ts:894](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts) exports `recordCorrection`, `undoCorrection`, and `getCorrectionsForMemory`; [corrections.vitest.ts:158](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts) exercises them, while handler/tool searches found no production callers.

---
FEATURE: 10-per-memory-history-log.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The schema only allows `ADD`, `UPDATE`, and `DELETE` events, not created/updated/merged/archived/restored. I also found no production `recordHistory()` calls from save/update/session-learning flows; production code only deletes history rows during memory deletion cleanup.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/storage/history.ts, mcp_server/tests/history.vitest.ts
UNDOCUMENTED_CAPABILITIES: The standalone history helper also exposes per-memory retrieval and aggregate stats, but it is not wired into the lifecycle described here.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [vector-index-schema.ts:1073](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts) creates `memory_history` with `CHECK(event IN ('ADD', 'UPDATE', 'DELETE'))`; [history.ts:107](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts) defines `recordHistory()`; [vector-index-mutations.ts:355](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts) deletes history rows rather than recording lifecycle events.

---
FEATURE: 01-memory-browser-memorylist.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The description says you can inspect a memory’s importance “weight and tier” here, but the handler does not return `importance_tier`.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-list.ts:81](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts) selects `importance_weight` but not `importance_tier`; [memory-crud-list.ts:109](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts) emits pagination hints.

---
FEATURE: 02-system-statistics-memorystats.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The doc says “Pass `includeScores: true` to see the score breakdown,” but the code includes score breakdowns whenever `folderRanking === 'composite'`, even if `includeScores` is false.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Supports `excludePatterns` and `includeArchived` filters on folder ranking output.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-stats.ts:42](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts) accepts `excludePatterns`/`includeArchived`; [memory-crud-stats.ts:191](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts) uses `if (includeScores || folderRanking === 'composite')`.

---
FEATURE: 03-health-diagnostics-memoryhealth.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The doc says FTS mismatches and alias conflicts make the overall status “degraded,” but status is computed only from embedding-model readiness and database availability. FTS mismatch and alias issues surface as hints/repair data, not as status degraders.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `autoRepair` in full mode can rebuild FTS5 and clean orphaned causal edges.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-health.ts:296](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) and [memory-crud-health.ts:312](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) compute status from `isEmbeddingModelReady() && database`; [memory-crud-health.ts:360](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) and [memory-crud-health.ts:397](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) show auto-repair behavior.
tokens used
597,996
---
FEATURE: 01-unified-context-retrieval-memorycontext.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Resume mode injects `systemPromptContext`; the handler also reports caller-vs-ephemeral session lifecycle metadata and can auto-discover `specFolder` before full retrieval.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-context.ts:244](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts) defines `CONTEXT_MODES`; [memory-context.ts:617](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts) injects `systemPromptContext`; `mcp_server/tests/retry.vitest.ts` is absent on disk.

---
FEATURE: 02-semantic-and-lexical-search-memorysearch.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Supports `includeTrace`, `includeArchived`, `minState`, `applyStateLimits`, and returns `retrievalTrace`, `pipelineMetadata`, `artifactRouting`, `feedbackSignals`, `chunkReassembly`, and post-cache `dedupStats`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-search.ts:603](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts) shows the extra search flags; [memory-search.ts:819](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts) and [memory-search.ts:953](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts) attach pipeline metadata, traces, and dedup stats.

---
FEATURE: 03-trigger-phrase-matching-memorymatchtriggers.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Trigger matching also detects signal vocabulary matches and returns `triggerSignals`/hints about applied signal categories.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-triggers.ts:244](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts) fetches `limit * 2` candidates; [memory-triggers.ts:246](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts) and [memory-triggers.ts:437](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts) expose detected signals.

---
FEATURE: 04-hybrid-search-pipeline.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [hybrid-search.ts:1043](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) routes through `searchWithFallbackTiered()`; [hybrid-search.ts:544](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) shows channel routing/activation logic.

---
FEATURE: 05-4-stage-pipeline-architecture.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [orchestrator.ts:22](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts) wires Stages 1-4 in order; [stage4-filter.ts:247](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts) captures scores and [stage4-filter.ts:306](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts) verifies the score invariant.

---
FEATURE: 06-bm25-trigger-phrase-re-index-gate.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-crud-update.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [memory-crud-update.ts:145](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts) is the actual gate: `if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled())`.

---
FEATURE: 07-ast-level-section-retrieval-tool.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `rg -n "read_spec_section|remark"` across `mcp_server/`, `shared/`, and `scripts/` found no implementation; the feature file itself correctly says "No source files yet."

---
FEATURE: 08-quality-aware-3-tier-search-fallback.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The doc says Tier 3 scores are capped at 50% of the top existing score; code caps them at 90% (`topExisting * 0.9`).
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tests/search-fallback-tiered.vitest.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [hybrid-search.ts:1302](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) defines `calibrateTier3Scores()`; [hybrid-search.ts:1317](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts) sets `const topCap = topExisting * 0.9`.

---
FEATURE: 09-tool-result-extraction-to-working-memory.md
CATEGORY: 01--retrieval
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Extraction is not performed generically inside `working-memory.ts` alone. It is registered from `context-server.ts`, handled in `lib/extraction/extraction-adapter.ts`, then persisted via `workingMemory.upsertExtractedEntry()`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/context-server.ts, mcp_server/lib/extraction/extraction-adapter.ts, mcp_server/tests/extraction-adapter.vitest.ts
UNDOCUMENTED_CAPABILITIES: Rule-based after-tool extraction, redaction gating with skip thresholds, session/memory ID resolution, and persisted metadata columns (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`).
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [context-server.ts:94](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts) imports `initExtractionAdapter`; [context-server.ts:876](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts) registers it; [extraction-adapter.ts:215](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts) runs `handleAfterTool()`.

---
FEATURE: 01-memory-indexing-memorysave.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `dryRun`, `skipPreflight`, `atomicSaveMemory()`, and post-insert enrichment stages for causal links, entity extraction, summaries, and entity linking are not called out.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-save.ts:287](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts) exposes `dryRun`/`skipPreflight`; [memory-save.ts:407](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts) defines `atomicSaveMemory()`; [post-insert.ts:35](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts) runs enrichment.

---
FEATURE: 02-memory-metadata-update-memoryupdate.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: BM25 re-indexing also runs when trigger phrases change, not just when the title changes.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-update.ts:93](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts) rebuilds embedding from `existing.content_text`; [memory-crud-update.ts:145](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts) reindexes BM25 on title or trigger-phrase updates.

---
FEATURE: 03-single-and-folder-delete-memorydelete.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The folder-delete description overstates checkpoint guarantees. Code attempts an auto-checkpoint first, but if checkpoint creation returns null or throws, deletion still proceeds after warning when the user has confirmed.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Single-delete explicitly aborts when the database is unavailable to avoid orphaned causal-edge cleanup failures.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-delete.ts:133](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) attempts checkpoint creation; [memory-crud-delete.ts:146](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) and [memory-crud-delete.ts:153](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) proceed without rollback; [memory-crud-delete.ts:103](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) aborts on missing DB.

---
FEATURE: 04-tier-based-bulk-deletion-memorybulkdelete.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [memory-bulk-delete.ts:58](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts) refuses unscoped constitutional/critical deletion; [memory-bulk-delete.ts:102](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts) handles checkpoint creation and [memory-bulk-delete.ts:170](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts) deletes in a transaction.

---
FEATURE: 05-validation-feedback-memoryvalidate.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: The handler also accepts `queryId`, `queryTerms`, `resultRank`, `totalResultsShown`, `searchMode`, `intent`, `sessionId`, and `notes`, then records ground-truth selections and learned-feedback signals.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [checkpoints.ts:55](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts) declares the extra fields; [checkpoints.ts:378](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts) and [checkpoints.ts:392](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts) feed selection logging/learning.

---
FEATURE: 06-transaction-wrappers-on-mutation-handlers.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [memory-crud-update.ts:131](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts) wraps update-side mutations in a transaction; [memory-crud-delete.ts:66](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) and [memory-crud-delete.ts:161](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts) do the same for delete paths.

---
FEATURE: 07-namespace-management-crud-tools.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The Current Reality text correctly says the feature is deferred, but the same file’s massive Source Files section implies an implemented feature surface, which is misleading.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [07-namespace-management-crud-tools.md:5](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md) marks the feature as deferred; `rg -n "namespace|switch namespace|create namespace|delete namespace"` across tool schemas/handlers returned no implementation hits.

---
FEATURE: 08-prediction-error-save-arbitration.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [pe-orchestration.ts:57](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts) dispatches REINFORCE/SUPERSEDE/CREATE_LINKED handling; [memory-save.ts:108](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts) is the save-path entry point that invokes it.

---
FEATURE: 09-correction-tracking-with-undo.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The module exists, but it is not wired into a production “learning pipeline.” Search hits for `recordCorrection()`/`undoCorrection()` are in the library and tests, not mutation handlers/tools.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Explicit undo support and correction-history retrieval (`undoCorrection()`, `getCorrectionsForMemory()`), which the description does not mention despite the feature title.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [corrections.ts:894](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts) exports `recordCorrection`, `undoCorrection`, and `getCorrectionsForMemory`; [corrections.vitest.ts:158](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts) exercises them, while handler/tool searches found no production callers.

---
FEATURE: 10-per-memory-history-log.md
CATEGORY: 02--mutation
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The schema only allows `ADD`, `UPDATE`, and `DELETE` events, not created/updated/merged/archived/restored. I also found no production `recordHistory()` calls from save/update/session-learning flows; production code only deletes history rows during memory deletion cleanup.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/storage/history.ts, mcp_server/tests/history.vitest.ts
UNDOCUMENTED_CAPABILITIES: The standalone history helper also exposes per-memory retrieval and aggregate stats, but it is not wired into the lifecycle described here.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [vector-index-schema.ts:1073](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts) creates `memory_history` with `CHECK(event IN ('ADD', 'UPDATE', 'DELETE'))`; [history.ts:107](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts) defines `recordHistory()`; [vector-index-mutations.ts:355](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts) deletes history rows rather than recording lifecycle events.

---
FEATURE: 01-memory-browser-memorylist.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The description says you can inspect a memory’s importance “weight and tier” here, but the handler does not return `importance_tier`.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-list.ts:81](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts) selects `importance_weight` but not `importance_tier`; [memory-crud-list.ts:109](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts) emits pagination hints.

---
FEATURE: 02-system-statistics-memorystats.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The doc says “Pass `includeScores: true` to see the score breakdown,” but the code includes score breakdowns whenever `folderRanking === 'composite'`, even if `includeScores` is false.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Supports `excludePatterns` and `includeArchived` filters on folder ranking output.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-stats.ts:42](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts) accepts `excludePatterns`/`includeArchived`; [memory-crud-stats.ts:191](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts) uses `if (includeScores || folderRanking === 'composite')`.

---
FEATURE: 03-health-diagnostics-memoryhealth.md
CATEGORY: 03--discovery
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The doc says FTS mismatches and alias conflicts make the overall status “degraded,” but status is computed only from embedding-model readiness and database availability. FTS mismatch and alias issues surface as hints/repair data, not as status degraders.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: `autoRepair` in full mode can rebuild FTS5 and clean orphaned causal edges.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [memory-crud-health.ts:296](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) and [memory-crud-health.ts:312](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) compute status from `isEmbeddingModelReady() && database`; [memory-crud-health.ts:360](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) and [memory-crud-health.ts:397](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) show auto-repair behavior.
