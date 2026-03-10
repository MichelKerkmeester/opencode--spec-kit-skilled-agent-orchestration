OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cd69c-a594-7351-9068-03608e03ad04
--------
user
You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 29 feature files across 5 categories.

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 04-maintenance: 0 passes, 2 issues (1 paths, 1 desc).
- Category 05-lifecycle: 0 passes, 7 issues (2 desc+paths, 4 paths, 1 desc). Desc fix: 06-startup-pending-file-recovery.
- Category 06-analysis: 0 passes, 7 issues (2 desc+paths, 5 paths).
- Category 07-evaluation: 0 passes, 2 issues (1 desc+paths, 1 desc).
- Category 08-bug-fixes: 0 passes, 11 issues (1 rewrite: 08-mathmax-min, 1 desc+paths, 9 paths).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts (affects 52 files).

YOUR ASSIGNED DIRECTORIES (29 files total):
- .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/ (2 files)
- .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/ (7 files)
- .opencode/skill/system-spec-kit/feature_catalog/06--analysis/ (7 files)
- .opencode/skill/system-spec-kit/feature_catalog/07--evaluation/ (2 files)
- .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/ (11 files)

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
I’m treating this as a read-only audit: I’ll inventory the 29 feature docs, verify the referenced paths on disk, and compare each “Current Reality” section against the actual TypeScript MCP server code before I summarize findings in the exact block format you asked for.
Plan update
  → Inventory all assigned feature files and any governing instructions needed for the audit
  • Audit each feature doc against source files and verify referenced paths
  • Assemble the 29 structured audit blocks with severity and evidence
codex
I’m checking the local guidance and the feature inventory now so we can keep the audit grounded in the repo’s actual structure before I go file by file.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/04--maintenance .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle .opencode/skill/system-spec-kit/feature_catalog/06--analysis .opencode/skill/system-spec-kit/feature_catalog/07--evaluation .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md' .opencode/skill/system-spec-kit" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md
.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md
.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md
.opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md
 exited 1 in 51ms:

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Audit 29 feature catalog markdown files against TypeScript MCP server source, verify source paths exist, and report documentation inaccuracies and undocumented capabilities" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 620ms:
[
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !mcp, !mcp(multi), !server(multi), !typescript, check~"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.93,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, !mcp(multi), !server(multi), mcp(name), typescript"
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
codex
`sk-code--review` and `sk-doc` are the best fit for this pass, so I’m loading just enough of those skill instructions to keep the audit findings-first and evidence-based while avoiding unnecessary tool overhead.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
codex
I’ve got the file list and the review framework. Next I’m extracting each feature doc’s “Current Reality” and source tables so I can verify the paths first, then compare the narrative against the code without guessing.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/06-startup-pending-file-recovery.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Workspace scanning and indexing (memory_index_scan)

## Current Reality

This is the tool that keeps the memory database synchronized with the filesystem. Without it, new or modified memory files would be invisible to search.

The scanner discovers files from three sources: spec folder memory files (`specs/**/memory/*.md`), constitutional files (`.opencode/skill/*/constitutional/*.md`) and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `handover.md`). Canonical path deduplication prevents the same file from being indexed twice under different paths (the `specs/` vs `.opencode/specs/` symlink problem).

In incremental mode (the default), the scanner categorizes every discovered file into one of four buckets: to-index (new files), to-update (changed content hash), to-skip (unchanged mtime and hash) and to-delete (files that disappeared from disk). Batch processing with configurable `BATCH_SIZE` handles large workspaces. A rate limiter with `INDEX_SCAN_COOLDOWN` prevents rapid repeated scans from exhausting resources, returning an E429 error with a wait time if you scan too frequently.

Each file that passes through to indexing goes through the full `memory_save` pipeline, which means content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture all apply automatically. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.

After indexing, the tool does more than store data. It creates causal chain edges between spec documents within the same folder (spec leads to plan, plan leads to tasks, tasks lead to checklist, and so on). It detects alias conflicts. It runs divergence reconciliation hooks. It clears the trigger matcher cache if any changes occurred.

A safety invariant protects against silent failures: post-indexing mtime updates happen only for successfully indexed files. If embedding generation fails for a specific file, that file retains its old mtime so the next scan automatically retries it. You do not have to track which files failed. The system tracks it for you.

The result breakdown is detailed: indexed count, updated count, unchanged count, failed count, skipped-by-mtime count, skipped-by-hash count, constitutional stats, dedup stats and incremental stats. Debug mode (`SPECKIT_DEBUG_INDEX_SCAN=true`) exposes additional file count diagnostics.

---

 succeeded in 51ms:
# Startup pending-file recovery

## Current Reality

On server startup, the transaction manager scans for leftover `_pending` files created by interrupted atomic-write operations. If a previous `memory_save` wrote the pending file and committed the DB row but crashed before renaming, the pending file is the only surviving copy of the content. The recovery routine finds these orphans via `findPendingFiles()`, renames each to its final path, and increments `totalRecoveries` in the transaction metrics.

Recovery is automatic and requires no user intervention. If the pending file is stale (the DB row was never committed), it is logged and left for manual review rather than silently deleted.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Atomic write + pending-file recovery |
| `mcp_server/context-server.ts` | Core | Startup hook that triggers recovery |

### Tests

| File | Focus |
codex
The feature docs have a consistent enough structure that I can extract the path tables in one pass, which will save time for the deeper code comparisons. After that I’ll inspect the key implementation files for each feature and classify the description accuracy.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const path=require('path'); const base='.opencode/skill/system-spec-kit/feature_catalog'; const cats=['04--maintenance','05--lifecycle','06--analysis','07--evaluation','08--bug-fixes-and-data-integrity']; const files=[]; for (const cat of cats){ for (const f of fs.readdirSync(path.join(base,cat)).filter(f=>f.endsWith('.md')).sort()){ files.push(path.join(base,cat,f)); } } const rows=[]; for (const file of files){ const text=fs.readFileSync(file,'utf8'); const current=(text.match(/## Current Reality\\n\\n([\\s\\S]*?)\\n\\n## Source Files/)||[])[1]||''; const implSec=(text.match(/### Implementation\\n\\n([\\s\\S]*?)\\n\\n### Tests/)||[])[1]||''; const testSec=(text.match(/### Tests\\n\\n([\\s\\S]*?)\\n\\n## Source Metadata/)||[])[1]||''; const parse=(sec)=>sec.split(/\\n/).filter(l=>/"'^'"\\| "'`/.test(l)).map(l=>l.split('"'"'`'"')[1]); rows.push({file, category:path.basename(path.dirname(file)), feature:path.basename(file,'.md'), impl:parse(implSec), tests:parse(testSec), current}); } console.log(JSON.stringify(rows,null,2));\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
zsh:1: parse error near `)'
zsh:1: parse error in command substitution
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const base=\".opencode/skill/system-spec-kit/feature_catalog\"; const cats=[\"04--maintenance\",\"05--lifecycle\",\"06--analysis\",\"07--evaluation\",\"08--bug-fixes-and-data-integrity\"]; const files=[]; for (const cat of cats){ for (const f of fs.readdirSync(path.join(base,cat)).filter(f=>f.endsWith(\".md\")).sort()){ files.push(path.join(base,cat,f)); } } const rows=[]; for (const file of files){ const text=fs.readFileSync(file,\"utf8\"); const current=(text.match(/## Current Reality\\n\\n([\\s\\S]*?)\\n\\n## Source Files/)||[])[1]||\"\"; const implSec=(text.match(/### Implementation\\n\\n([\\s\\S]*?)\\n\\n### Tests/)||[])[1]||\"\"; const testSec=(text.match(/### Tests\\n\\n([\\s\\S]*?)\\n\\n## Source Metadata/)||[])[1]||\"\"; const parse=(sec)=>sec.split(/\\n/).filter(l=>/"'^'"\\| "'`/.test(l)).map(l=>l.split("`")[1]); rows.push({file, category:path.basename(path.dirname(file)), feature:path.basename(file,".md"), impl:parse(implSec), tests:parse(testSec), current}); } console.log(JSON.stringify(rows,null,2));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
Total output lines: 2119

[
  {
    "file": ".opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md",
    "category": "04--maintenance",
    "feature": "01-workspace-scanning-and-indexing-memoryindexscan",
    "impl": [
      "mcp_server/configs/cognitive.ts",
      "mcp_server/core/config.ts",
      "mcp_server/core/db-state.ts",
      "mcp_server/core/index.ts",
      "mcp_server/formatters/token-metrics.ts",
      "mcp_server/handlers/causal-links-processor.ts",
      "mcp_server/handlers/chunking-orchestrator.ts",
      "mcp_server/handlers/handler-utils.ts",
      "mcp_server/handlers/memory-crud-types.ts",
      "mcp_server/handlers/memory-crud-utils.ts",
      "mcp_server/handlers/memory-index-alias.ts",
      "mcp_server/handlers/memory-index-discovery.ts",
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const root=\".opencode/skill/system-spec-kit\"; const base=root+\"/feature_catalog\"; const cats=[\"04--maintenance\",\"05--lifecycle\",\"06--analysis\",\"07--evaluation\",\"08--bug-fixes-and-data-integrity\"]; for (const cat of cats){ for (const f of fs.readdirSync(path.join(base,cat)).filter(f=>f.endsWith(\".md\")).sort()){ const file=path.join(base,cat,f); const text=fs.readFileSync(file,\"utf8\"); const implSec=(text.match(/### Implementation\\n\\n([\\s\\S]*?)\\n\\n### Tests/)||[])[1]||\"\"; const testSec=(text.match(/### Tests\\n\\n([\\s\\S]*?)\\n\\n## Source Metadata/)||[])[1]||\"\"; const parse=(sec)=>sec.split(/\\n/).filter(l=>/"'^'"\\| "'`/.test(l)).map(l=>l.split("`")[1]); const paths=[...parse(implSec),...parse(testSec)]; const bad=paths.filter(p=>!fs.existsSync(path.join(root,p))); if (bad.length) console.log(f+"'"\\n  \"+bad.join(\"\\n  \")); } }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
01-workspace-scanning-and-indexing-memoryindexscan.md
  mcp_server/tests/retry.vitest.ts
01-checkpoint-creation-checkpointcreate.md
  mcp_server/tests/retry.vitest.ts
02-checkpoint-listing-checkpointlist.md
  mcp_server/tests/retry.vitest.ts
03-checkpoint-restore-checkpointrestore.md
  mcp_server/tests/retry.vitest.ts
04-checkpoint-deletion-checkpointdelete.md
  mcp_server/tests/retry.vitest.ts
05-async-ingestion-job-lifecycle.md
  mcp_server/tests/retry.vitest.ts
01-causal-edge-creation-memorycausallink.md
  mcp_server/tests/retry.vitest.ts
02-causal-graph-statistics-memorycausalstats.md
  mcp_server/tests/retry.vitest.ts
03-causal-edge-deletion-memorycausalunlink.md
  mcp_server/tests/retry.vitest.ts
04-causal-chain-tracing-memorydriftwhy.md
  mcp_server/tests/retry.vitest.ts
exec
/bin/zsh -lc 'rg -n "memory_index_scan|INDEX_SCAN_COOLDOWN|BATCH_SIZE|toDelete|to-delete|trigger matcher|causal chain|alias conflict|dedup" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"node-version-marker|process\\.versions\\.modules|non-blocking|warning|startup\" .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:61:import { checkExistingRow, checkContentHashDedup } from './save/dedup';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:138:    // so downstream dedup and change-detection use the post-fix content.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:100:/** Build alias conflict buckets from index rows. */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:47:  toDelete: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:221:    toDelete: [],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:236:        result.toDelete.push(filePath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:246:  // Without this pass, removed files never enter toDelete during normal scans
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:250:    const seenDeleteKeys = new Set<string>(result.toDelete.map((filePath) => getCanonicalPathKey(filePath)));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:254:        result.toDelete.push(stalePath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:12:import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:99:  dedup: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:112:  toDelete: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:138:/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:152:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:156:    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:164:  if (now - lastScanTime < INDEX_SCAN_COOLDOWN) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:165:    const waitTime = Math.ceil((INDEX_SCAN_COOLDOWN - (now - lastScanTime)) / 1000);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:167:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:210:  const dedupDuplicatesSkipped = mergedFiles.length - files.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:211:  if (dedupDuplicatesSkipped > 0) {
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/cli.ts:25:import { detectNodeVersionMismatch } from './startup-checks';
.opencode/skill/system-spec-kit/mcp_server/cli.ts:357:  console.log(`  Warmup: ${eagerWarmup ? 'eager (startup)' : 'lazy (on demand)'}`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:459:  // Non-blocking startup hint for native-module ABI mismatches.
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:4:// Non-critical startup checks extracted from context-server.ts (T303).
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:22:/** Logs a warning when the active Node.js version differs from the project marker. */
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:25:    const markerPath = path.resolve(__dirname, '../.node-version-marker');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:31:      if (marker.moduleVersion !== process.versions.modules) {
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:36:        console.error(`[context-server] \u2551  Running:   Node ${process.version} (MODULE_VERSION ${process.versions.modules})`.padEnd(59) + '\u2551');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:42:        console.error(`[context-server] Node version check: OK (${process.version}, MODULE_VERSION ${process.versions.modules})`);
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:48:        moduleVersion: process.versions.modules,
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:54:      console.error('[context-server] Created .node-version-marker for future version checks');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:5:// logic in tools/*.ts. This file retains server init, startup,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:32:// Handler modules (only indexSingleFile needed directly for startup scan)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:59:import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:90:// T107: Transaction manager for pending file recovery on startup (REQ-033)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:124:  warning?: string;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:147:/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:150:/** Timeout (ms) for API key validation during startup. */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:// AI-WHY(CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:379:              // No truncatable results array — add warning hint only
codex
I’ve confirmed the shared broken reference isn’t a one-off: multiple docs still point at `mcp_server/tests/retry.vitest.ts`, while the repo now has `retry-manager.vitest.ts` and a separate shared retry utility test. I’m keeping that path issue separate from the description drift so the recommendations stay precise.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const root=\".opencode/skill/system-spec-kit\"; const base=root+\"/feature_catalog\"; const cats=[\"04--maintenance\",\"05--lifecycle\",\"06--analysis\",\"07--evaluation\",\"08--bug-fixes-and-data-integrity\"]; for (const cat of cats){ for (const f of fs.readdirSync(path.join(base,cat)).filter(f=>f.endsWith(\".md\")).sort()){ const file=path.join(base,cat,f); const text=fs.readFileSync(file,\"utf8\"); const implSec=(text.match(/### Implementation\\n\\n([\\s\\S]*?)\\n\\n### Tests/)||[])[1]||\"\"; const testSec=(text.match(/### Tests\\n\\n([\\s\\S]*?)\\n\\n## Source Metadata/)||[])[1]||\"\"; const parse=(sec)=>sec.split(/\\n/).filter(l=>/"'^'"\\| "'`/.test(l)).map(l=>l.split("`")[1]); for (const p of [...parse(implSec),...parse(testSec)]) console.log(f+"'"\\t\"+p); } }' | while IFS="'$'"'\\t' read -r feature rel; do test -f \".opencode/skill/system-spec-kit/"'$rel" || printf "%s'"\\t%s\\n\" \""'$feature" "$rel"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
01-workspace-scanning-and-indexing-memoryindexscan.md	mcp_server/tests/retry.vitest.ts
01-checkpoint-creation-checkpointcreate.md	mcp_server/tests/retry.vitest.ts
02-checkpoint-listing-checkpointlist.md	mcp_server/tests/retry.vitest.ts
03-checkpoint-restore-checkpointrestore.md	mcp_server/tests/retry.vitest.ts
04-checkpoint-deletion-checkpointdelete.md	mcp_server/tests/retry.vitest.ts
05-async-ingestion-job-lifecycle.md	mcp_server/tests/retry.vitest.ts
01-causal-edge-creation-memorycausallink.md	mcp_server/tests/retry.vitest.ts
02-causal-graph-statistics-memorycausalstats.md	mcp_server/tests/retry.vitest.ts
03-causal-edge-deletion-memorycausalunlink.md	mcp_server/tests/retry.vitest.ts
04-causal-chain-tracing-memorydriftwhy.md	mcp_server/tests/retry.vitest.ts
05-epistemic-baseline-capture-taskpreflight.md	mcp_server/tests/retry.vitest.ts
06-post-task-learning-measurement-taskpostflight.md	mcp_server/tests/retry.vitest.ts
07-learning-history-memorygetlearninghistory.md	mcp_server/tests/retry.vitest.ts
01-ablation-studies-evalrunablation.md	mcp_server/tests/retry.vitest.ts
02-reporting-dashboard-evalreportingdashboard.md	mcp_server/tests/retry.vitest.ts
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts | sed -n '138,575p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Index Discovery Helpers
     3	// ---------------------------------------------------------------
     4	
     5	/* ------- 1. DEPENDENCIES ------- */
     6	
     7	import fs from 'fs';
     8	import path from 'path';
     9	
    10	import { toErrorMessage } from '../utils';
    11	import { getCanonicalPathKey } from '../lib/utils/canonical-path';
    12	
    13	/* ------- 2. CONSTANTS ------- */
    14	
    15	/** Well-known spec folder document filenames. */
    16	const SPEC_DOCUMENT_FILENAMES = new Set([
    17	  'spec.md',
    18	  'plan.md',
    19	  'tasks.md',
    20	  'checklist.md',
 succeeded in 53ms:
   138	/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
   139	async function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse> {
   140	  const {
   141	    specFolder: spec_folder = null,
   142	    force = false,
   143	    includeConstitutional: include_constitutional = true,
   144	    includeSpecDocs: include_spec_docs = true,
   145	    incremental = true
   146	  } = args;
   147	
   148	  // Pre-flight dimension check
   149	  try {
   150	    const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
   151	    if (profile) {
   152	      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
   153	    }
   154	  } catch (dimCheckError: unknown) {
   155	    const message = toErrorMessage(dimCheckError);
   156	    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
   157	  }
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Incremental Index
     3	// ---------------------------------------------------------------
     4	// Mtime-based incremental indexing for fast re-indexing
     5	// ---------------------------------------------------------------
     6	
     7	// Node stdlib
     8	import * as fs from 'fs';
     9	
    10	// External packages
    11	import type Database from 'better-sqlite3';
    12	
    13	// Internal modules
    14	import { getCanonicalPathKey } from '../utils/canonical-path';
    15	
    16	/* -------------------------------------------------------------
    17	   1. CONSTANTS
    18	----------------------------------------------------------------*/
    19	
    20	const MTIME_FAST_PATH_MS = 1000; // Skip if mtime within 1 second
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '680,735p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/cli.ts | sed -n '450,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Startup Checks
     3	// ---------------------------------------------------------------
     4	// Non-critical startup checks extracted from context-server.ts (T303).
     5	// ---------------------------------------------------------------
     6	
     7	import path from 'path';
     8	import fs from 'fs';
     9	
    10	/* ---------------------------------------------------------------
    11	   1. NODE VERSION MISMATCH DETECTION
    12	--------------------------------------------------------------- */
    13	
    14	interface NodeVersionMarker {
    15	  nodeVersion: string;
    16	  moduleVersion: string;
    17	  platform: string;
    18	  arch: string;
    19	  createdAt: string;
    20	}
 succeeded in 51ms:
   680	/* ---------------------------------------------------------------
   681	   8. MAIN
   682	--------------------------------------------------------------- */
   683	
   684	async function main(): Promise<void> {
   685	  // Node version mismatch detection (non-blocking)
   686	  detectNodeVersionMismatch();
   687	
   688	  console.error('[context-server] Initializing database...');
   689	  vectorIndex.initializeDb();
   690	  dbInitialized = true;
   691	  console.error('[context-server] Database initialized');
   692	
   693	  // Initialize db-state module with dependencies
   694	  // P4-12/P4-19 FIX: Pass sessionManager and incrementalIndex so db-state can
   695	  // refresh their DB handles during reinitializeDatabase(), preventing stale refs.
   696	  initDbState({ vectorIndex, checkpoints: checkpointsLib, accessTracker, hybridSearch, sessionManager, incrementalIndex });
   697	
   698	  // T087-T090: Pre-Flight API Key Validation (REQ-029)
   699	  // Validates API key at startup to fail fast with actionable error messages
 succeeded in 51ms:
   450	   7. MAIN DISPATCH
   451	--------------------------------------------------------------- */
   452	
   453	async function main(): Promise<void> {
   454	  if (!command || command === '--help' || command === '-h') {
   455	    printUsage();
   456	    process.exit(0);
   457	  }
   458	
   459	  // Non-blocking startup hint for native-module ABI mismatches.
   460	  detectNodeVersionMismatch();
   461	
   462	  switch (command) {
   463	    case 'stats':
   464	      runStats();
   465	      break;
   466	    case 'bulk-delete':
   467	      runBulkDelete();
   468	      break;
   469	    case 'reindex':
🌐 Searching the web...
🌐 Searched the web
exec
/bin/zsh -lc "rg -n \"checkSqliteVersion\\(\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:827:    checkSqliteVersion(database);
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:70:export function checkSqliteVersion(db: { prepare: (sql: string) => { get: () => unknown } }): void {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '816,835p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   816	      try {
   817	        const migrated = migrateLearnedTriggers(database);
   818	        const isolated = verifyFts5Isolation(database);
   819	        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
   820	      } catch (learnedErr: unknown) {
   821	        const message = learnedErr instanceof Error ? learnedErr.message : String(learnedErr);
   822	        throw new Error(`[context-server] Learned feedback migration/isolation failed: ${message}`);
   823	      }
   824	    }
   825	
   826	    // Check SQLite version meets minimum requirement (3.35.0+)
   827	    checkSqliteVersion(database);
   828	
   829	    // T076: Verify WAL mode is active for operational concurrency guarantees.
   830	    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
   831	    const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
   832	    if (journalMode !== 'wal') {
   833	      database.pragma('journal_mode = WAL');
   834	      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
   835	    }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "checkpoint|gzip|specFolder|max 10|oldest|vec_memories|git branch|metadata|retained|restore|delete" .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Checkpoints
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   1. LIB MODULE IMPORTS
     7	--------------------------------------------------------------- */
     8	
     9	import * as checkpoints from '../lib/storage/checkpoints';
    10	import * as vectorIndex from '../lib/search/vector-index';
    11	import * as bm25Index from '../lib/search/bm25-index';
    12	import * as triggerMatcher from '../lib/parsing/trigger-matcher';
    13	import * as confidenceTracker from '../lib/scoring/confidence-tracker';
    14	import { executeAutoPromotion } from '../lib/search/auto-promotion';
    15	import { recordSelection } from '../lib/search/learned-feedback';
    16	import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
    17	import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
    18	import { checkDatabaseUpdated } from '../core';
    19	import { requireDb, toErrorMessage } from '../utils';
    20	
 succeeded in 52ms:
Total output lines: 441

.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:7:import * as mod from '../lib/storage/checkpoints';
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:8:import type { CheckpointInfo } from '../lib/storage/checkpoints';
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:39:  tmpDbPath = path.join(os.tmpdir(), `checkpoints-test-${Date.now()}.db`);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:65:    CREATE TABLE IF NOT EXISTS checkpoints (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:73:      metadata TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:148:    it('T503-01: Create checkpoint stores data', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:149:      const checkpoint = mod.createCheckpoint({
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:150:        name: 'test-checkpoint-1',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:151:        metadata: { testKey: 'testValue' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:153:      const createdCheckpoint = requireValue(checkpoint);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:155:      expect(createdCheckpoint.name).toBe('test-checkpoint-1');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:162:    it('T503-02: List checkpoints returns all', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:177:    it('T503-03: Restore checkpoint retrieves data', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:178:      const result = mod.restoreCheckpoint('test-checkpoint-1');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:187:    it('T503-04: Delete checkpoint removes data', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:188:      mod.createCheckpoint({ name: 'to-delete' });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:190:      const deleted = mod.deleteCheckpoint('to-delete');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:191:      expect(deleted).toBe(true);
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const dir=\".opencode/skill/system-spec-kit/feature_catalog/05--lifecycle\"; for (const f of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){ const text=fs.readFileSync(path.join(dir,f),\"utf8\"); const current=(text.match(/## Current Reality\\n\\n([\\s\\S]*?)\\n\\n## Source Files/)||[])[1]||\"\"; console.log(\"FILE: \"+f+\"\\n\"+current.trim()+\"\\n---\\n\"); }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: 01-checkpoint-creation-checkpointcreate.md
Named snapshots capture the current memory state by serializing the `memory_index` table, `working_memory` table and vector embeddings from `vec_memories` into a gzip-compressed JSON blob stored in the `checkpoints` table. You can scope a snapshot to a specific spec folder if you only care about preserving one area of the system.

A maximum of 10 checkpoints are retained. When you create the 11th, the oldest is automatically purged. Each checkpoint records arbitrary metadata you provide, plus the current git branch from environment variables. The gzip compression keeps storage manageable even with large memory databases.

Checkpoints are the safety net for destructive operations. `memory_bulk_delete` creates one by default before bulk deletion, unless explicitly skipped for lower-risk tiers. `checkpoint_restore` brings it all back. The cycle works because checkpoints include vector embeddings alongside metadata, so restored memories are immediately searchable without re-running embedding generation.
---

FILE: 02-checkpoint-listing-checkpointlist.md
Returns a paginated list of available checkpoints with metadata: name, creation date, spec folder scope, git branch and compressed snapshot size. The actual snapshot data is not included. Results are ordered by creation date, most recent first. Default limit is 50, maximum 100. You can filter by spec folder to see only checkpoints that cover a specific area.
---

FILE: 03-checkpoint-restore-checkpointrestore.md
Restoring from a named checkpoint decompresses the gzip snapshot, validates every row against the database schema (a T107 fix that catches corrupted snapshots before they damage the database) and either merges with existing data or clears existing data first.

The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a database transaction. If the restore encounters an error halfway through, the transaction rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is critical because clearing existing data and then failing to restore would leave you with an empty database and no way back.

When merging (the default), the system checks for duplicates using a logical key of `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are skipped rather than duplicated.

After restore, vectors are restored from the checkpoint snapshot when vector payloads are present. The restore handler then clears in-memory search/constitutional caches, rebuilds BM25 from live DB content when BM25 is enabled, and refreshes the trigger cache. This keeps restored memories immediately discoverable without forcing a full re-embedding pass.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "job-queue|memory_ingest_start|memory_ingest_status|memory_ingest_cancel|archival-manager|archive|is_archived|auto-archiv|last_access_at" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Automatic archival subsystem

## Current Reality

The archival manager (`lib/cognitive/archival-manager.ts`) is a background job that identifies dormant memories and transitions them to archived status. It queries `memory_index` for memories that have not been accessed within a configurable threshold period, demotes their tier classification, and optionally removes their BM25 index entries and vector embeddings to reclaim storage. Archived memories remain in the database for SQL-based recovery but are excluded from default search result sets.

The archival sweep runs periodically and respects tier-based protection: constitutional and critical-tier memories are never auto-archived. Access tracker data (`access_count`, `last_access_at`) drives the dormancy decision. The archival manager lazy-loads the tier classifier to avoid circular dependencies at import time.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/archival-manager.ts` | Lib | Background archival job logic |
| `mcp_server/lib/storage/access-tracker.ts` | Lib | Access pattern tracking for dormancy detection |
| `mcp_server/lib/search/vector-index-queries.ts` | Lib | Vector index query methods |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |

### Tests
 succeeded in 52ms:
# Async ingestion job lifecycle

## Current Reality

**IMPLEMENTED (Sprint 019).** Ingestion moves to a SQLite-persisted job queue (`lib/ops/job-queue.ts`) with lifecycle states `queued → parsing → embedding → indexing → complete/failed/cancelled`, a single sequential worker (one job processing at a time, rest queued), and three new tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`. Coexists with the existing `asyncEmbedding` path in `memory_save` as an alternative for batch operations.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
| `mcp_server/handlers/memory-ingest.ts` | Handler | Ingestion handler |
| `mcp_server/handlers/types.ts` | Handler | Type definitions |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:81:import * as archivalManager from './lib/cache/cognitive/archival-manager';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:97:import { initIngestJobQueue } from './lib/ops/job-queue';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:69:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:17:} from '../lib/ops/job-queue';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:126:      tool: 'memory_ingest_start',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:153:    tool: 'memory_ingest_start',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:161:      'Use memory_ingest_status with jobId to poll progress',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:162:      'Use memory_ingest_cancel with jobId to stop processing',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:177:      tool: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:183:        actions: ['Call memory_ingest_start to create a new ingest job'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:190:    tool: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:206:      tool: 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:212:        actions: ['Call memory_ingest_status with a known jobId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:220:      tool: 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:229:    tool: 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:235:const handle_memory_ingest_start = handleMemoryIngestStart;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:236:const handle_memory_ingest_status = handleMemoryIngestStatus;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:237:const handle_memory_ingest_cancel = handleMemoryIngestCancel;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:243:  handle_memory_ingest_start,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:244:  handle_memory_ingest_status,
exec
/bin/zsh -lc "ls -R .opencode/skill/system-spec-kit/mcp_server/lib | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
README.md
architecture
cache
chunking
cognitive
config
contracts
errors
errors.ts
eval
extraction
graph
interfaces
learning
manage
ops
parsing
providers
response
scoring
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts | sed -n '1,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '1,640p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Ingest Handlers
     3	// ---------------------------------------------------------------
     4	
     5	import { randomBytes } from 'node:crypto';
     6	import path from 'node:path';
     7	
     8	import { ALLOWED_BASE_PATHS, DATABASE_PATH, checkDatabaseUpdated } from '../core';
     9	import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
    10	import {
    11	  createIngestJob,
    12	  enqueueIngestJob,
    13	  getIngestJob,
    14	  cancelIngestJob,
    15	  getIngestProgressPercent,
    16	  type IngestJob,
    17	} from '../lib/ops/job-queue';
    18	
    19	import type { MCPResponse } from './types';
    20	
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Job Queue
     3	// ---------------------------------------------------------------
     4	// Sprint 9 fixes: true sequential worker, meaningful state transitions,
     5	// continue-on-error for bulk ingestion, SQLITE_BUSY async retry on DB writes,
     6	// crash recovery with re-enqueue, and original-path progress tracking.
     7	
     8	import { requireDb, toErrorMessage } from '../../utils';
     9	
    10	/**
    11	 * Defines the IngestJobState type.
    12	 */
    13	export type IngestJobState =
    14	  | 'queued'
    15	  | 'parsing'
    16	  | 'embedding'
    17	  | 'indexing'
    18	  | 'complete'
    19	  | 'failed'
    20	  | 'cancelled';
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Archival Manager
     3	// ---------------------------------------------------------------
     4	// Background archival job for dormant/archived memories
     5	// ---------------------------------------------------------------
     6	
     7	import type Database from 'better-sqlite3';
     8	
     9	/* -------------------------------------------------------------
    10	   1. DEPENDENCIES (lazy-loaded)
    11	----------------------------------------------------------------*/
    12	
    13	// AI-WHY: Lazy-load tier-classifier to avoid circular dependencies
    14	let tierClassifierModule: Record<string, unknown> | null = null;
    15	
    16	function getTierClassifier(): Record<string, unknown> | null {
    17	  if (tierClassifierModule !== null) return tierClassifierModule;
    18	  try {
    19	    // eslint-disable-next-line @typescript-eslint/no-require-imports
    20	    tierClassifierModule = require('./tier-classifier');
exec
/bin/zsh -lc 'ls -l .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
lrwxr-xr-x@ 1 michelkerkmeester  staff  12 Feb 16 19:41 .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive -> ../cognitive
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "findPendingFiles|recoverPendingFiles|_pending|totalRecoveries|manual review|stale|rename" .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '408,470p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Transaction Manager
     3	// ---------------------------------------------------------------
     4	// AI-GUARD: Atomic file + index operations with pending file recovery
     5	// ---------------------------------------------------------------
     6	
     7	import type Database from 'better-sqlite3';
     8	import * as fs from 'fs';
     9	import * as path from 'path';
    10	
    11	/* -------------------------------------------------------------
    12	   1. CONSTANTS
    13	----------------------------------------------------------------*/
    14	
    15	const PENDING_SUFFIX = '_pending';
    16	const TEMP_SUFFIX = '.tmp';
    17	
    18	/* -------------------------------------------------------------
    19	   2. INTERFACES
    20	----------------------------------------------------------------*/
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:15:const PENDING_SUFFIX = '_pending';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:25:  totalRecoveries: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:35:  /** Fix #22: Set when DB committed but rename failed, indicating partial state */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:52:  totalRecoveries: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:70:  metrics.totalRecoveries = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:127: * Write a file atomically using write-to-temp-then-rename pattern.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:143:    // AI-GUARD: Atomic rename
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:144:    fs.renameSync(tempPath, filePath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:189: * AI-WHY: This function provides file-system-level atomicity (write-to-pending + rename),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:191: * dbOperation() must wrap it in their own db.transaction() call. The rename step
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:193: * is not rolled back if the rename fails (extremely rare on local filesystems).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:212:    // succeeds but the rename (Step 3) fails, the DB change is already committed and
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:231:    // P1-020 KNOWN LIMITATION: If renameSync fails after dbOperation() committed,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:237:    // orphaned pending files and rename them to their final paths.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:239:      fs.renameSync(pendingPath, filePath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:240:    } catch (renameError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:241:      // Rename failed after DB committed — DB has new state but file wasn't renamed.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:243:      const msg = renameError instanceof Error ? renameError.message : String(renameError);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:244:      console.warn(`[transaction-manager] rename failed after DB commit; pending file kept for recovery: ${pendingPath} (${msg})`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:294:function findPendingFiles(dirPath: string): string[] {
 succeeded in 51ms:
   408	let startupScanInProgress = false;
   409	
   410	/**
   411	 * T107: Recover pending memory files on MCP startup.
   412	 * CHK-188: Pending files processed by recovery job on next startup.
   413	 *
   414	 * Scans for files with _pending suffix (created when index failed after file write)
   415	 * and attempts to index them.
   416	 */
   417	async function recoverPendingFiles(basePath: string): Promise<PendingRecoveryResult> {
   418	  console.error('[context-server] Checking for pending memory files...');
   419	
   420	  try {
   421	    // BUG-028 FIX: Restrict scan to known memory file locations to prevent OOM when scanning large workspaces
   422	    const scanLocations = [
   423	      path.join(basePath, 'specs'),
   424	      path.join(basePath, '.opencode', 'specs')
   425	    ];
   426	
   427	    // Also scan constitutional directories (.opencode/skill/*/constitutional/)
exec
/bin/zsh -lc 'rg -n "pending|recoverAllPendingFiles|recoverPendingFiles|_pending|totalRecoveries|Original is newer" .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager-extended.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:18:  recoverAllPendingFiles,
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:58:    const pending = getPendingPath(original);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:60:    expect(pending).toBe('/path/to/memory/file_pending.md');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:62:    const recovered = getOriginalPath(pending);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:65:    expect(isPendingFile(pending)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:122:  it('Execute atomic save with pending file cleanup on failure', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:123:    setup('save-pending');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:124:    const filePath = path.join(TEST_DIR!, 'memory', 'pending.md');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:125:    const content = '# Test Memory\n\nContent for pending test.';
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:134:    const pendingPath = getPendingPath(filePath);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:135:    expect(fs.existsSync(pendingPath)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:138:  it('Find pending files', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:139:    setup('find-pending');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:144:    fs.writeFileSync(path.join(memoryDir, 'file1_pending.md'), 'Pending file 1');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:145:    fs.writeFileSync(path.join(memoryDir, 'file2_pending.md'), 'Pending file 2');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:147:    const pendingFiles = findPendingFiles(TEST_DIR!);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:149:    expect(pendingFiles.length).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:150:    expect(pendingFiles.every((f: string) => f.includes('_pending'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:153:  it('Recover pending file', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:154:    setup('recover-pending');
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const dir=\".opencode/skill/system-spec-kit/feature_catalog/06--analysis\"; for (const f of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){ const text=fs.readFileSync(path.join(dir,f),\"utf8\"); const current=(text.match(/## Current Reality\\n\\n([\\s\\S]*?)\\n\\n## Source Files/)||[])[1]||\"\"; console.log(\"FILE: \"+f+\"\\n\"+current.trim()+\"\\n---\\n\"); }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: 01-causal-edge-creation-memorycausallink.md
Creates a directed relationship edge between two memories in the causal graph. Six relationship types are supported: caused (this memory led to that one), enabled (this memory made that one possible), supersedes (this memory replaces that one), contradicts (these memories disagree), derived_from (this memory was produced from that one) and supports (this memory backs up that one).

Edge strength is a 0-1 float, clamped at both ends. Evidence text is optional but recommended because it explains why the relationship exists. If an edge with the same source, target and relation already exists, the system updates strength and evidence via `INSERT ... ON CONFLICT DO UPDATE` rather than creating a duplicate. That upsert behavior means you can call `memory_causal_link` repeatedly with updated evidence without worrying about edge proliferation.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). Every strength modification is logged to a `weight_history` table recording old strength, new strength, who changed it, when and why. The `created_by` and `last_accessed` fields on each edge track provenance and usage patterns.

A batch insert variant (`insertEdgesBatch()`) handles bulk edge creation during spec document indexing. The `createSpecDocumentChain()` function auto-links spec folder documents in a standard chain: spec causes plan, plan causes tasks, tasks cause implementation-summary. Checklist, decision-record and research documents get support relationships to the primary chain.
---

FILE: 02-causal-graph-statistics-memorycausalstats.md
Returns the health metrics of the causal graph in a single call. Total edge count, breakdown by relationship type (how many caused edges, how many supports edges and so on), average edge strength across all edges, unique source and target memory counts and the link coverage percentage.

Link coverage is the most important metric: what percentage of memories participate in at least one causal relationship? The target is 60% (CHK-065). Below that, the graph is too sparse for the graph search channel to contribute meaningfully. The tool reports pass or fail against that target.

Orphaned edges (edges referencing source or target memories that no longer exist in `memory_index`) are detected and counted. When orphans exist, the health status changes from "healthy" to "has_orphans." You can use `memory_drift_why` to find the edge IDs and `memory_causal_unlink` to clean them up.
---

FILE: 03-causal-edge-deletion-memorycausalunlink.md
Removes a single causal relationship edge by its numeric edge ID. You get edge IDs from `memory_drift_why` traversal results (a T202 enhancement that added edge IDs to the response specifically to enable this workflow).
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Causal Links Processor
     3	// ---------------------------------------------------------------
     4	
     5	import type BetterSqlite3 from 'better-sqlite3';
     6	
     7	import type { CausalLinks } from '../lib/parsing/memory-parser';
     8	import * as causalEdges from '../lib/storage/causal-edges';
     9	import { toErrorMessage } from '../utils';
    10	import { escapeLikePattern } from './handler-utils';
    11	
    12	interface CausalLinkMapping {
    13	  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
    14	  reverse: boolean;
    15	}
    16	
    17	interface CausalLinksResult {
    18	  processed: number;
    19	  inserted: number;
    20	  resolved: number;
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Causal Edges
     3	// ---------------------------------------------------------------
     4	// Causal relationship graph for memory lineage
     5	// ---------------------------------------------------------------
     6	
     7	import type Database from 'better-sqlite3';
     8	import { clearDegreeCache } from '../search/graph-search-fn';
     9	import { runInTransaction } from './transaction-manager';
    10	
    11	/* -------------------------------------------------------------
    12	   1. CONSTANTS
    13	----------------------------------------------------------------*/
    14	
    15	const RELATION_TYPES = Object.freeze({
    16	  CAUSED: 'caused',
    17	  ENABLED: 'enabled',
    18	  SUPERSEDES: 'supersedes',
    19	  CONTRADICTS: 'contradicts',
    20	  DERIVED_FROM: 'derived_from',
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Eval DB
     3	// ---------------------------------------------------------------
     4	// T004: Separate evaluation database with 5 tables for tracking
     5	// retrieval quality metrics, ground truth, and eval results.
     6	// ---------------------------------------------------------------
     7	
     8	// Node stdlib
     9	import * as path from 'path';
    10	import * as fs from 'fs';
    11	
    12	// External packages
    13	import Database from 'better-sqlite3';
    14	
    15	/* ---------------------------------------------------------------
    16	   1. CONFIGURATION
    17	--------------------------------------------------------------- */
    18	
    19	// Follow same env-var precedence as main DB (vector-index-impl.ts)
    20	// P1-05: SPEC_KIT_DB_DIR (canonical) > MEMORY_DB_DIR (legacy) > default
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '360,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "function getGraphStats|link coverage|orphan|deleteEdge|deleteEdgesForMemory|traverseCausalChain|relations|createSpecDocumentChain|weight_history|created_by|last_accessed" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '760,980p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
4:// Causal relationship graph for memory lineage
62:  created_by: string;
63:  last_accessed: string | null;
172:      // AI-WHY: Check if edge exists (for weight_history logging on conflict update).
174:      // to write a weight_history row after the upsert. The subsequent INSERT
182:        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
446:      // T001d: Capture old strength for weight_history logging
463:      // T001d: Log weight change to weight_history
486:function deleteEdge(edgeId: number): boolean {
499:    console.warn(`[causal-edges] deleteEdge error: ${msg}`);
504:function deleteEdgesForMemory(memoryId: string): number {
518:    console.warn(`[causal-edges] deleteEdgesForMemory error: ${msg}`);
527:function getGraphStats(): GraphStats {
574:// AI-WHY: Fix #28 (017-refinement-phase-6) — Automated orphan edge cleanup
578:    const orphaned = findOrphanedEdges();
581:      for (const edge of orphaned) {
582:        if (deleteEdge(edge.id)) count++;
599: * Create causal relationship chain between spec folder documents.
605:function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
629:  // Support relationships
 succeeded in 53ms:
   360	
   361	function getCausalChain(
   362	  rootId: string,
   363	  maxDepth: number = DEFAULT_MAX_DEPTH,
   364	  direction: 'forward' | 'backward' = 'forward'
   365	): CausalChainNode {
   366	  const root: CausalChainNode = {
   367	    id: rootId,
   368	    depth: 0,
   369	    relation: RELATION_TYPES.CAUSED,
   370	    strength: 1.0,
   371	    children: [],
   372	  };
   373	
   374	  if (!db) return root;
   375	
   376	  const visited = new Set<string>();
   377	  visited.add(rootId);
   378	
   379	  function traverse(node: CausalChainNode, depth: number): void {
 succeeded in 52ms:
   760	    // best-effort
   761	  }
   762	}
   763	
   764	function getStaleEdges(thresholdDays: number = STALENESS_THRESHOLD_DAYS): CausalEdge[] {
   765	  if (!db) return [];
   766	  try {
   767	    return (db.prepare(`
   768	      SELECT * FROM causal_edges
   769	      WHERE (last_accessed IS NULL AND extracted_at < datetime('now', '-' || ? || ' days'))
   770	         OR (last_accessed IS NOT NULL AND last_accessed < datetime('now', '-' || ? || ' days'))
   771	      ORDER BY COALESCE(last_accessed, extracted_at) ASC
   772	    `) as Database.Statement).all(thresholdDays, thresholdDays) as CausalEdge[];
   773	  } catch (error: unknown) {
   774	    const msg = error instanceof Error ? error.message : String(error);
   775	    console.warn(`[causal-edges] getStaleEdges error: ${msg}`);
   776	    return [];
   777	  }
   778	}
   779	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/task-learning.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts | sed -n '360,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "session_learning|task_preflight|task_postflight|memory_get_learning_history|learning index|onlyComplete|preflight|postflight" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
nl: .opencode/skill/system-spec-kit/mcp_server/handlers/task-learning.ts: No such file or directory
 succeeded in 53ms:

 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:18:import * as preflight from '../lib/validation/preflight';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:305:    const preflightResult = preflight.runPreflight(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:311:        find_similar: findSimilarMemories as Parameters<typeof preflight.runPreflight>[0]['find_similar'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:326:      const dryRunSummary = preflightResult.dry_run_would_pass
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:328:        : `Pre-flight validation failed: ${preflightResult.errors.length} error(s)`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:335:          would_pass: preflightResult.dry_run_would_pass,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:340:            errors: preflightResult.errors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:341:            warnings: preflightResult.warnings,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:342:            details: preflightResult.details,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:346:        hints: preflightResult.dry_run_would_pass
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:352:    if (!preflightResult.pass) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:353:      const errorMessages = preflightResult.errors.map((e: string | { message: string }) =>
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:359:      const firstError = preflightResult.errors[0];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:362:        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:363:      throw new preflight.PreflightError(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:367:          errors: preflightResult.errors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:368:          warnings: preflightResult.warnings,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:375:    if (preflightResult.warnings.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:376:      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:377:      preflightResult.warnings.forEach((w: string | { message: string }) => {
codex
One pattern is emerging: several feature docs are path-valid but still incomplete because the real behavior spans handler wiring and startup/dispatch files the tables don’t mention. I’m folding those into `MISSING_PATHS` instead of mixing them with outright broken paths.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts | sed -n '1,720p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Epistemic baseline capture (task_preflight)

## Current Reality

Before starting implementation work, this tool records how much the agent knows, how uncertain it is and how complete the context is. All three scores are on a 0-100 scale. You can optionally list identified knowledge gaps as an array of strings.

Records are stored in the `session_learning` table with a `UNIQUE` constraint on `(spec_folder, task_id)`. If a preflight record already exists for the same combination and is still in the "preflight" phase, calling preflight again updates the existing record rather than creating a duplicate. Completed records (where postflight has already run) cannot be overwritten. That guard prevents accidental resets of finished learning cycles.

The purpose of preflight is establishing a baseline for learning measurement. Without knowing where you started, you cannot measure how much you learned. The postflight tool completes the measurement.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
 succeeded in 50ms:
# Post-task learning measurement (task_postflight)

## Current Reality

After completing implementation work, this tool captures the post-task epistemic state and computes a Learning Index by comparing against the preflight baseline. The formula weights three deltas: `LI = (KnowledgeDelta * 0.4) + (UncertaintyReduction * 0.35) + (ContextImprovement * 0.25)`.

The uncertainty delta is inverted (pre minus post) so that reduced uncertainty counts as a positive learning signal. If you started at 70% uncertainty and finished at 20%, that is a +50 uncertainty reduction contributing +17.5 to the Learning Index.

Interpretation bands give the score meaning. 40 or above signals significant learning (you understood something that changed your approach). 15-39 is moderate learning. 5-14 is incremental. 0-4 is an execution-focused session where you applied existing knowledge without gaining new understanding. Below zero indicates knowledge regression, which usually means the task revealed that prior assumptions were wrong.

You can track gaps closed during the task and new gaps discovered. Both are stored as JSON arrays alongside the scores. The phase updates from "preflight" to "complete" after postflight runs. Calling postflight without a matching preflight record throws an error.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Session Learning
     3	// ---------------------------------------------------------------
     4	
     5	import * as vectorIndex from '../lib/search/vector-index';
     6	import { checkDatabaseUpdated } from '../core';
     7	import { MemoryError, ErrorCodes } from '../lib/errors';
     8	import { toErrorMessage } from '../utils';
     9	
    10	// REQ-019: Standardized Response Structure
    11	import { createMCPSuccessResponse } from '../lib/response/envelope';
    12	
    13	// Shared handler types
    14	import type { MCPResponse, DatabaseExtended as Database } from './types';
    15	
    16	/* ---------------------------------------------------------------
    17	   1. TYPES
    18	--------------------------------------------------------------- */
    19	
    20	interface PreflightArgs {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Learning history (memory_get_learning_history)

## Current Reality

Retrieves learning records for a spec folder with optional filtering by session ID and completion status. Each record shows the preflight scores, postflight scores, computed deltas and Learning Index.

The summary statistics are where this tool earns its keep. Across all completed tasks in a spec folder, you see the average Learning Index, maximum and minimum LI, average knowledge gain, average uncertainty reduction and average context improvement. Trend interpretation maps the average LI to a human-readable assessment: above 15 is a strong learning trend, 7-15 is positive, 0-7 is slight, zero is neutral and below zero is regression.

Pass `onlyComplete: true` to restrict results to tasks where both preflight and postflight were recorded. This gives you clean data for trend analysis without incomplete records skewing the averages. Records are ordered by `updated_at` descending so the most recent learning cycles appear first.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 53ms:
# Causal edge creation (memory_causal_link)

## Current Reality

Creates a directed relationship edge between two memories in the causal graph. Six relationship types are supported: caused (this memory led to that one), enabled (this memory made that one possible), supersedes (this memory replaces that one), contradicts (these memories disagree), derived_from (this memory was produced from that one) and supports (this memory backs up that one).

Edge strength is a 0-1 float, clamped at both ends. Evidence text is optional but recommended because it explains why the relationship exists. If an edge with the same source, target and relation already exists, the system updates strength and evidence via `INSERT ... ON CONFLICT DO UPDATE` rather than creating a duplicate. That upsert behavior means you can call `memory_causal_link` repeatedly with updated evidence without worrying about edge proliferation.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). Every strength modification is logged to a `weight_history` table recording old strength, new strength, who changed it, when and why. The `created_by` and `last_accessed` fields on each edge track provenance and usage patterns.

A batch insert variant (`insertEdgesBatch()`) handles bulk edge creation during spec document indexing. The `createSpecDocumentChain()` function auto-links spec folder documents in a standard chain: spec causes plan, plan causes tasks, tasks cause implementation-summary. Checklist, decision-record and research documents get support relationships to the primary chain.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
 succeeded in 50ms:
# Causal chain tracing (memory_drift_why)

## Current Reality

"Why was this decision made?" This tool answers that question by tracing the causal relationship chain for a given memory through depth-limited graph traversal.

You choose the traversal direction: outgoing (what did this memory cause or enable?), incoming (what caused or enabled this memory?) or both. Maximum depth is configurable from 1 to 10, defaulting to 3. Cycle detection via a visited set prevents infinite traversal through circular relationships.

Results are grouped by relationship type: causedBy, enabledBy, supersedes, contradicts, derivedFrom and supports. Each edge carries a relation-weighted strength value. Supersedes edges receive a 1.5x weight boost (because replacement is a strong signal). Caused edges receive 1.3x. Enabled edges receive 1.1x. Supports and derived_from edges pass through at 1.0x. Contradicts edges receive 0.8x dampening because contradictions weaken rather than strengthen the chain.

You can filter to specific relationship types after traversal. Pass `relations: ["caused", "supersedes"]` to see only the replacement and causation chains. The response includes a `maxDepthReached` flag that warns when the depth limit may have truncated results. If you see that flag, consider increasing `maxDepth` for a more complete picture.

When contradictions are found, the response includes warning hints. Two memories that contradict each other in the same causal chain is a signal that something needs resolution.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Causal Graph
     3	// ---------------------------------------------------------------
     4	
     5	/* ---------------------------------------------------------------
     6	   0. DEPENDENCIES
     7	--------------------------------------------------------------- */
     8	
     9	// Lib modules
    10	import * as vectorIndex from '../lib/search/vector-index';
    11	import * as causalEdges from '../lib/storage/causal-edges';
    12	import type { CausalChainNode, CausalEdge } from '../lib/storage/causal-edges';
    13	
    14	// Core utilities
    15	import { checkDatabaseUpdated } from '../core';
    16	import { toErrorMessage } from '../utils';
    17	import { getRecoveryHint } from '../lib/errors';
    18	
    19	// REQ-019: Standardized Response Structure
    20	import { createMCPSuccessResponse, createMCPErrorResponse, createMCPEmptyResponse } from '../lib/response/envelope';
 succeeded in 52ms:
# Causal edge deletion (memory_causal_unlink)

## Current Reality

Removes a single causal relationship edge by its numeric edge ID. You get edge IDs from `memory_drift_why` traversal results (a T202 enhancement that added edge IDs to the response specifically to enable this workflow).

A library-level variant, `deleteEdgesForMemory()`, removes all edges referencing a given memory ID. This variant is called automatically during memory deletion (`memory_delete`) to maintain graph integrity. You do not need to manually clean up edges when deleting a memory. The system handles it.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/causal-links-processor.ts` | Handler | Causal link mutation handler |
| `mcp_server/handlers/handler-utils.ts` | Handler | Handler utility helpers |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
 succeeded in 52ms:
# Causal graph statistics (memory_causal_stats)

## Current Reality

Returns the health metrics of the causal graph in a single call. Total edge count, breakdown by relationship type (how many caused edges, how many supports edges and so on), average edge strength across all edges, unique source and target memory counts and the link coverage percentage.

Link coverage is the most important metric: what percentage of memories participate in at least one causal relationship? The target is 60% (CHK-065). Below that, the graph is too sparse for the graph search channel to contribute meaningfully. The tool reports pass or fail against that target.

Orphaned edges (edges referencing source or target memories that no longer exist in `memory_index`) are detected and counted. When orphans exist, the health status changes from "healthy" to "has_orphans." You can use `memory_drift_why` to find the edge IDs and `memory_causal_unlink` to clean them up.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '340,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   340	        memoryIds.add(edge.from);
   341	        memoryIds.add(edge.to);
   342	      }
   343	
   344	      if (memoryIds.size > 0) {
   345	        const idsArray = Array.from(memoryIds);
   346	        for (const id of idsArray) {
   347	          const memory = db.prepare(`
   348	            SELECT id, title, spec_folder, importance_tier, created_at
   349	            FROM memory_index
   350	            WHERE id = ? OR CAST(id AS TEXT) = ?
   351	          `).get(id, String(id)) as Record<string, unknown> | undefined;
   352	          if (memory) {
   353	            relatedMemories[id] = memory;
   354	          }
   355	        }
   356	      }
   357	    }
   358	
   359	    if (chain.total_edges === 0) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '560,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   560	        error: 'Database not initialized. Server may still be starting up.',
   561	        code: 'E020',
   562	        details: {},
   563	        recovery: getRecoveryHint('memory_causal_stats', 'E020'),
   564	        startTime: startTime
   565	      });
   566	    }
   567	    causalEdges.init(db);
   568	
   569	    const stats = causalEdges.getGraphStats();
   570	    const orphanedEdges: CausalEdge[] = causalEdges.findOrphanedEdges();
   571	
   572	    // Compute link coverage: unique memories linked / total memories
   573	    const totalMemories = (db.prepare('SELECT COUNT(*) as count FROM memory_index') as import('better-sqlite3').Statement).get() as { count: number };
   574	    const uniqueLinked = new Set<string>();
   575	
   576	    // Count unique memory IDs that appear as source or target
   577	    try {
   578	      const linkedRows = (db.prepare('SELECT DISTINCT source_id FROM causal_edges UNION SELECT DISTINCT target_id FROM causal_edges') as import('better-sqlite3').Statement).all() as Array<{ source_id: string }>;
   579	      for (const row of linkedRows) {
exec
/bin/zsh -lc "rg -n \"deleteEdgesForMemory\\(|memory_causal_unlink|handleMemoryCausalUnlink\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:301:| `memory_causal_unlink` | Remove causal relationships                  | <50ms   |
.opencode/skill/system-spec-kit/mcp_server/README.md:352:| L6    | Analysis      | 1200         | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard` |
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:343:  memory_causal_unlink: memoryCausalUnlinkSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:374:  memory_causal_unlink: ['edgeId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:178:          causalEdges.deleteEdgesForMemory(String(memory.id));
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:642:/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:643:async function handleMemoryCausalUnlink(args: CausalUnlinkArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:649:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:672:        tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:676:        recovery: getRecoveryHint('memory_causal_unlink', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:694:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:702:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:706:      recovery: getRecoveryHint('memory_causal_unlink', 'E022'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:720:  handleMemoryCausalUnlink,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:727:const handle_memory_causal_unlink = handleMemoryCausalUnlink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:733:  handle_memory_causal_unlink,
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:340:  name: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:12:  handleMemoryCausalUnlink,
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:26:  'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:35:    case 'memory_causal_unlink': return handleMemoryCausalUnlink(parseArgs<CausalUnlinkArgs>(validateToolArgs('memory_causal_unlink', args)));
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const dir=\".opencode/skill/system-spec-kit/feature_catalog/07--evaluation\"; for (const f of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){ const text=fs.readFileSync(path.join(dir,f),\"utf8\"); const current=(text.match(/## Current Reality\\n\\n([\\s\\S]*?)\\n\\n## Source Files/)||[])[1]||\"\"; console.log(\"FILE: \"+f+\"\\n\"+current.trim()+\"\\n---\\n\"); }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: 01-ablation-studies-evalrunablation.md
This tool runs controlled ablation studies across the retrieval pipeline's search channels. You disable one channel at a time (vector, BM25, FTS5, graph or trigger) and measure the Recall@20 delta against a full-pipeline baseline. The answer to "what happens if we turn off the graph channel?" becomes a measured number rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Each channel ablation wraps in a try-catch so a failure in one channel's ablation produces partial results rather than a total failure. Statistical significance is assessed via a sign test (exact binomial distribution) because it is reliable with small query sets where a t-test would be unreliable. Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results).

Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation runs. The tool requires `SPECKIT_ABLATION=true` to activate. When the flag is off, the MCP handler returns an explicit disabled-flag error and does not execute an ablation run.
---

FILE: 02-reporting-dashboard-evalreportingdashboard.md
Generates a sprint-level and channel-level metric dashboard from stored evaluation runs. You can filter by sprint, channel and metric, and choose between text (markdown-formatted) or JSON output.

The dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the `eval_metric_snapshots`, `eval_channel_results` and `eval_final_results` tables. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON or `eval_run_id` grouping. A `isHigherBetter()` helper correctly interprets trend direction for different metric types (recall and precision are higher-better; latency is lower-better).

This is a read-only module. It queries the eval database and produces reports. No writes, no side effects, no feature flag gate.

---
---

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/eval-ablation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Ablation Framework (R13-S3)
     3	// ---------------------------------------------------------------
     4	//
     5	// Controlled ablation studies for search channel contribution analysis.
     6	// Selectively disables one search channel at a time, measures Recall@20
     7	// delta against a full-pipeline baseline, and attributes per-channel
     8	// contribution to retrieval quality.
     9	//
    10	// Features:
    11	// - Channel toggle mechanism (vector, bm25, fts5, graph, trigger)
    12	// - Ablation runner with ground truth evaluation
    13	// - Delta calculation (baseline vs ablated Recall@20)
    14	// - Paired sign-test for statistical significance
    15	// - Results storage in eval_metric_snapshots table
    16	// - Human-readable ablation report formatting
    17	//
    18	// CRITICAL: Ablation studies are experimental and gated behind
    19	// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
    20	// and is a no-op when the flag is not set.
 succeeded in 51ms:
nl: .opencode/skill/system-spec-kit/mcp_server/handlers/eval-ablation.ts: No such file or directory
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Reporting Dashboard (R13-S3)
     3	// ---------------------------------------------------------------
     4	// Sprint 7: Full reporting dashboard for eval infrastructure.
     5	// Aggregates metrics per sprint/eval-run, per-channel views,
     6	// trend analysis, and formatted report output.
     7	//
     8	// Uses: eval-db.ts singleton, eval_metric_snapshots table,
     9	//       eval_channel_results table, eval_final_results table.
    10	//
    11	// Design:
    12	//   - Read-only queries against eval DB (no writes).
    13	//   - Sprint labels inferred from metadata JSON or eval_run_id grouping.
    14	//   - Pure aggregation logic; DB access isolated to query functions.
    15	// ---------------------------------------------------------------
    16	
    17	// External packages
    18	import type Database from 'better-sqlite3';
    19	
    20	// Internal modules
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | sed -n '420,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   420	
   421	      const previous = prevSummary.latest;
   422	      const current = currSummary.latest;
   423	      const delta = Math.round((current - previous) * 10000) / 10000;
   424	      const percentChange = previous !== 0
   425	        ? Math.round(((current - previous) / Math.abs(previous)) * 10000) / 100
   426	        : current > 0 ? 100 : (current < 0 ? -100 : 0);
   427	
   428	      const higherBetter = isHigherBetter(metric);
   429	      let direction: 'improved' | 'regressed' | 'unchanged';
   430	      if (Math.abs(delta) < 0.0001) {
   431	        direction = 'unchanged';
   432	      } else if (higherBetter) {
   433	        direction = delta > 0 ? 'improved' : 'regressed';
   434	      } else {
   435	        direction = delta < 0 ? 'improved' : 'regressed';
   436	      }
   437	
   438	      trends.push({
   439	        metric,
exec
/bin/zsh -lc 'rg -n "handle.*Ablation|eval_run_ablation|eval_reporting_dashboard|generateDashboardReport|formatReportText" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/tools' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:116:  handleEvalRunAblation,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:118:  handle_eval_run_ablation,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:119:  handle_eval_reporting_dashboard,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:22:  generateDashboardReport,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:24:  formatReportText,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:53:async function handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:121:    tool: 'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:139:  const report = await generateDashboardReport({
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:147:  const formatted = format === 'json' ? formatReportJSON(report) : formatReportText(report);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:150:    tool: 'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:161:  handleEvalRunAblation,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:165:const handle_eval_run_ablation = handleEvalRunAblation;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:166:const handle_eval_reporting_dashboard = handleEvalReportingDashboard;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:169:  handle_eval_run_ablation,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:170:  handle_eval_reporting_dashboard,
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:16:  handleEvalRunAblation,
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:37:  'eval_run_ablation',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:38:  'eval_reporting_dashboard',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:51:    case 'eval_run_ablation':          return handleEvalRunAblation(parseArgs<EvalRunAblationArgs>(validateToolArgs('eval_run_ablation', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:52:    case 'eval_reporting_dashboard':   return handleEvalReportingDashboard(parseArgs<EvalReportingDashboardArgs>(validateToolArgs('eval_reporting_dashboard', args)));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Eval Reporting
     3	// ---------------------------------------------------------------
     4	
     5	import { checkDatabaseUpdated } from '../core';
     6	import * as vectorIndex from '../lib/search/vector-index';
     7	import { init as initHybridSearch, hybridSearchEnhanced } from '../lib/search/hybrid-search';
     8	import { generateQueryEmbedding } from '../lib/providers/embeddings';
     9	import { MemoryError, ErrorCodes } from '../lib/errors';
    10	import { createMCPSuccessResponse } from '../lib/response/envelope';
    11	import {
    12	  ALL_CHANNELS,
    13	  isAblationEnabled,
    14	  runAblation,
    15	  storeAblationResults,
    16	  formatAblationReport,
    17	  toHybridSearchFlags,
    18	  type AblationChannel,
    19	  type AblationSearchFn,
    20	} from '../lib/eval/ablation-framework';
exec
/bin/zsh -lc "rg -n \"storeAblationResults|formatAblationReport|toHybridSearchFlags|negative timestamp|Date\\.now|INSERT INTO eval_metric_snapshots|baselineRunId|verdict|CRITICAL|HARMFUL\" .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
18:// CRITICAL: Ablation studies are experimental and gated behind
70:  baselineRunId?: string;
182:  const ts = Date.now();
364:  const startTime = Date.now();
490:      durationMs: Date.now() - startTime,
517:export function storeAblationResults(report: AblationReport): boolean {
523:    // AI-WHY: Use a synthetic eval_run_id: negative timestamp to avoid collision
528:      INSERT INTO eval_metric_snapshots
597:    console.warn('[ablation] storeAblationResults failed (non-fatal):', msg);
611:export function formatAblationReport(report: AblationReport): string {
635:    const verdict = getVerdict(r);
646:      `| ${verdict} |`,
711: * Generate a human-readable verdict for a channel ablation result.
723:    if (isSignificant && absDelta >= 0.05) return 'CRITICAL';
728:    if (isSignificant && absDelta >= 0.05) return 'HARMFUL';
745:export function toHybridSearchFlags(
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | sed -n '420,780p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   420	        // -- Step 3: Compute deltas --
   421	        let queriesChannelHelped = 0;   // ablated < baseline (removing channel decreased quality — channel was helpful)
   422	        let queriesChannelHurt = 0;    // ablated > baseline (removing channel increased quality — channel was harmful)
   423	        let queriesUnchanged = 0;
   424	        const queryDeltas: number[] = [];
   425	
   426	        for (const [queryId, baselineR] of baselineRecalls) {
   427	          const ablatedR = ablatedRecalls.get(queryId);
   428	          if (ablatedR === undefined) continue;
   429	
   430	          const delta = ablatedR - baselineR;
   431	          queryDeltas.push(delta);
   432	
   433	          // Use small epsilon for floating-point comparison
   434	          if (delta < -1e-9) queriesChannelHelped++;
   435	          else if (delta > 1e-9) queriesChannelHurt++;
   436	          else queriesUnchanged++;
   437	        }
   438	
   439	        const meanAblatedRecall = meanRecall([...ablatedRecalls.values()]);
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Ablation studies (eval_run_ablation)

## Current Reality

This tool runs controlled ablation studies across the retrieval pipeline's search channels. You disable one channel at a time (vector, BM25, FTS5, graph or trigger) and measure the Recall@20 delta against a full-pipeline baseline. The answer to "what happens if we turn off the graph channel?" becomes a measured number rather than speculation.

The framework uses dependency injection for the search function, making it testable without the full pipeline. Each channel ablation wraps in a try-catch so a failure in one channel's ablation produces partial results rather than a total failure. Statistical significance is assessed via a sign test (exact binomial distribution) because it is reliable with small query sets where a t-test would be unreliable. Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results).

Results are stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation runs. The tool requires `SPECKIT_ABLATION=true` to activate. When the flag is off, the MCP handler returns an explicit disabled-flag error and does not execute an ablation run.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
 succeeded in 51ms:
# Reporting dashboard (eval_reporting_dashboard)

## Current Reality

Generates a sprint-level and channel-level metric dashboard from stored evaluation runs. You can filter by sprint, channel and metric, and choose between text (markdown-formatted) or JSON output.

The dashboard aggregates per-sprint metric summaries (mean, min, max, latest, count) and per-channel performance views (hit count, average latency, query count) from the `eval_metric_snapshots`, `eval_channel_results` and `eval_final_results` tables. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON or `eval_run_id` grouping. A `isHigherBetter()` helper correctly interprets trend direction for different metric types (recall and precision are higher-better; latency is lower-better).

This is a read-only module. It queries the eval database and produces reports. No writes, no side effects, no feature flag gate.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const dir=\".opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity\"; for (const f of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){ const text=fs.readFileSync(path.join(dir,f),\"utf8\"); const current=(text.match(/## Current Reality\\n\\n([\\s\\S]*?)\\n\\n## Source Files/)||[])[1]||\"\"; console.log(\"FILE: \"+f+\"\\n\"+current.trim()+\"\\n---\\n\"); }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
FILE: 01-graph-channel-id-fix.md
The graph search channel had a 0% hit rate in production. Zero. The system was designed as a multi-channel retrieval engine, but the graph channel contributed nothing because `graph-search-fn.ts` compared string-formatted IDs (`mem:${edgeId}`) against numeric memory IDs at two separate locations.

Both comparison points now extract numeric IDs, and the graph channel returns results for queries where causal edge relationships exist. This was the single highest-impact bug in the system because it meant an entire retrieval signal was dead on arrival.
---

FILE: 02-chunk-collapse-deduplication.md
Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed so dedup now runs on every search request regardless of content settings. A small fix, but one that affected every standard query.
---

FILE: 03-co-activation-fan-effect-divisor.md
Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

A fan-effect divisor helper (`1 / sqrt(neighbor_count)`) exists in `co-activation.ts`, but Stage 2 hot-path boosting currently applies spread-activation scores directly via the configured co-activation strength multiplier. The guard logic remains in the helper path with bounded division behavior.
---

FILE: 04-sha-256-content-hash-deduplication.md
Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "mem:|numeric|extractMemoryId|toCanonicalMemoryId|graph.*id|candidateIds|connectedMemoryIds" .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts .opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Graph Search Fn
     3	// ---------------------------------------------------------------
     4	// Causal graph search channel — uses FTS5 for node matching
     5	
     6	import { sanitizeFTS5Query } from './bm25-index';
     7	import { queryHierarchyMemories } from './spec-folder-hierarchy';
     8	
     9	import type Database from 'better-sqlite3';
    10	import type { GraphSearchFn } from './search-types';
    11	
    12	// --- 1. TYPES ---
    13	
    14	interface CausalEdgeRow {
    15	  id: string;
    16	  source_id: string;
    17	  target_id: string;
    18	  relation: string;
    19	  strength: number;
    20	}
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// TEST: UNIFIED GRAPH SEARCH FUNCTION
     3	// Causal edge channel only
     4	// ---------------------------------------------------------------
     5	
     6	import { describe, it, expect, vi, beforeEach } from 'vitest';
     7	import { createUnifiedGraphSearchFn } from '../lib/search/graph-search-fn';
     8	
     9	const mockAll = vi.fn();
    10	const mockGet = vi.fn();
    11	const mockStatement = { all: mockAll, get: mockGet };
    12	const mockPrepare = vi.fn().mockReturnValue(mockStatement);
    13	const mockDb = {
    14	  prepare: mockPrepare,
    15	} as unknown as import('better-sqlite3').Database;
    16	
    17	function makeCausalRow(
    18	  overrides: Partial<{
    19	    id: string;
    20	    source_id: string;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:148:  // numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:215:  // numeric IDs matching memory_index.id (INTEGER column).
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:45:  // G1 FIX: numeric ID correctness
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:48:  it('G1: returns numeric IDs (source_id) — not string-prefixed mem:edgeId', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:54:    // Must have at least one result with numeric source_id
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:60:  it('G1: returns numeric target_id as a separate candidate', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:71:  it('G1: never returns a string-prefixed id like mem:edge-001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:79:      expect(String(r['id'])).not.toMatch(/^mem:/);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:83:  it('G1: skips candidates where source_id or target_id is non-numeric', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:85:      makeCausalRow({ source_id: 'non-numeric-alpha', target_id: 'also-not-a-number', id: 'edge-bad' }),
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:91:    // Neither source nor target is numeric — no results expected
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:95:  it('G1: deduplicates when source_id equals target_id (same numeric value)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:110:  it('G1: both source and target IDs from multiple rows are all numeric', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:177:  it('S4: augments graph retrieval with hierarchy memories when specFolder is provided', () => {
exec
/bin/zsh -lc 'rg -n "includeContent|dedup|chunk" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts .opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:3:// Scores chunks by anchor presence + content density, applies thinning threshold.
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:10:import { scoreChunk, thinChunks, DEFAULT_THINNING_THRESHOLD, ANCHOR_WEIGHT, DENSITY_WEIGHT } from '../lib/chunking/chunk-thinning';
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:11:import { chunkLargeFile } from '../lib/chunking/anchor-chunker';
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:12:import type { AnchorChunk } from '../lib/chunking/anchor-chunker';
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:43:    label: overrides.label ?? 'test-chunk',
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:88:  it('should give anchorScore 1.0 for chunks with anchors', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:93:  it('should give anchorScore 0.0 for chunks without anchors', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:94:    const chunk = makeChunk({ anchorIds: [] });
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:95:    const result = scoreChunk(chunk);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:99:  it('should give anchorScore 1.0 for chunks with multiple anchors', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:100:    const chunk = makeChunk({
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:102:      content: '## Multi-anchor chunk\n\nThis chunk covers multiple anchors with substantial content for testing purposes.',
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:104:    const result = scoreChunk(chunk);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:108:  it('should produce higher composite score for anchored chunks than non-anchored', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:136:  it('should give higher densityScore for content-rich chunks', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:142:  it('should penalize very short chunks (< 100 chars stripped)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:167:    const chunk = makeAnchoredChunk();
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:168:    const result = scoreChunk(chunk);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:174:    const chunks = [
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:181:    for (const chunk of chunks) {
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Mpab Aggregation
     3	// ---------------------------------------------------------------
     4	// Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation.
     5	// Pipeline position: after RRF fusion, before state filtering.
     6	// Feature flag: SPECKIT_DOCSCORE_AGGREGATION (default OFF)
     7	
     8	/* --- 1. TYPES --- */
     9	
    10	/**
    11	 * Result of MPAB aggregation for a single parent memory.
    12	 * Contains the aggregated score and metadata about the chunks
    13	 * that contributed to it.
    14	 */
    15	export interface MpabResult {
    16	  /** Unique identifier of the parent memory document. */
    17	  parentMemoryId: number | string;
    18	  /** MPAB-aggregated score: sMax + 0.3 * sum(remaining) / sqrt(N). */
    19	  mpabScore: number;
    20	  /** Number of chunk hits that contributed to this score. */
exec
/bin/zsh -lc "rg -n \"collapseAndReassembleChunkResults|includeContent|chunks?\\]|_chunkHits|MPAB|content\" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline -g '"'!*.md'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:43:import { collapseAndReassembleChunkResults } from '../scoring/mpab-aggregation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:70:  includeContent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:339:    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:731:      // AI-WHY: -- Sprint 4 Stage: R1 MPAB chunk-to-memory aggregation (after fusion, before state filter) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:733:      // documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:745:            const collapsed = collapseAndReassembleChunkResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:759:                _chunkHits: c._chunkHits,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:765:          // AI-GUARD: Non-critical — MPAB failure does not block pipeline
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:767:          console.error('[hybrid-search] MPAB error (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:962:        includeContent: options.includeContent ?? false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1266:  const content = rowData.content;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1269:  if (typeof content !== 'string' || content.length === 0 || !filePath) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1286:    content: `${header}\n${content}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1558: * Create a summary fallback for a single result whose content exceeds the token budget.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1561:  const content = typeof result['content'] === 'string' ? result['content'] as string : '';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1565:  const truncatedContent = content.length > maxSummaryChars
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1566:    ? content.slice(0, maxSummaryChars) + '...'
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1567:    : content;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1571:    content: `[Summary] ${title}: ${truncatedContent}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1580: * @param options - Optional includeContent flag and queryId for overflow logging.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '720,780p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   720	      for (const list of lists) {
   721	        if (list.source === 'vector') list.weight = semanticWeight;
   722	        else if (list.source === 'fts' || list.source === 'bm25') list.weight = keywordWeight;
   723	        else if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') list.weight = adaptiveGraphWeight;
   724	      }
   725	
   726	      const fused = fuseResultsMulti(lists);
   727	
   728	      let fusedHybridResults: HybridSearchResult[] = fused.map(toHybridResult);
   729	      const limit = options.limit || DEFAULT_LIMIT;
   730	
   731	      // AI-WHY: -- Sprint 4 Stage: R1 MPAB chunk-to-memory aggregation (after fusion, before state filter) --
   732	      // When enabled, collapses chunk-level results back to their parent memory
   733	      // documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
   734	      // multiple chunks from the same document dominating the result list.
   735	      // MINOR-1 fix: isMpabEnabled() and isDocscoreAggregationEnabled() check the same env var
   736	      if (isDocscoreAggregationEnabled()) {
   737	        try {
   738	          const chunkResults = fusedHybridResults.filter(
   739	            r => (r as Record<string, unknown>).parentMemoryId != null && (r as Record<string, unknown>).chunkIndex != null
exec
/bin/zsh -lc 'rg -n "sqrt|fan|neighbor|spread activation|co-activation strength|applyActivationBoost|divisor" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts .opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:14: * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:94:  // AI-WHY: Pure fan-effect scaling — each additional neighbor contributes less (sublinear)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:95:  const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:96:  const boost = Math.max(0, perNeighborBoost / fanDivisor);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:251:        END AS neighbor_id,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:259:      neighbor_id: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:266:      if (row.neighbor_id == null || row.neighbor_id === memoryId) continue;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:270:        ) as Database.Statement).get(row.neighbor_id) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:279:      } catch (_err: unknown) { // AI-GUARD: Causal neighbor lookup failure — skip
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:340:    // Merge neighbors from both similarity and causal graphs
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:345:    const neighborMap = new Map<number, RelatedMemory>();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:347:      neighborMap.set(rel.id, rel);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:350:      const existing = neighborMap.get(rel.id);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:352:        neighborMap.set(rel.id, rel);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:356:    for (const rel of neighborMap.values()) {
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:72:    // R17 fan-effect divisor formula:
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:74:    //   fan_divisor = sqrt(max(1, relatedCount))
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:75:    //   boost       = max(0, raw_boost / fan_divisor)
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:84:      // fanDivisor = sqrt(3) ≈ 1.732
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:89:      const expectedBoost = perNeighborBoost / Math.sqrt(3);
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Co Activation
     3	// ---------------------------------------------------------------
     4	// Spreading activation for related memory retrieval
     5	
     6	import type Database from 'better-sqlite3';
     7	
     8	/* --- 1. CONFIGURATION --- */
     9	
    10	/**
    11	 * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
    12	 *
    13	 * Intentional deviation from Sprint 1 spec (which listed 0.2): empirical tuning raised
    14	 * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
    15	 * keeps hub-node inflation in check, so a higher raw factor remains safe. Tests are
    16	 * written against 0.25 and serve as the authoritative contract going forward.
    17	 */
    18	const DEFAULT_COACTIVATION_STRENGTH = 0.25;
    19	
    20	const CO_ACTIVATION_CONFIG = {
exec
/bin/zsh -lc "rg -n \"spreadActivation|activationScore|coactivation|co-activation|boostScore\\(|boostFactor|SPECKIT_COACTIVATION_STRENGTH\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:11: * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:22:  boostFactor: parseFloat(process.env.SPECKIT_COACTIVATION_STRENGTH || String(DEFAULT_COACTIVATION_STRENGTH)),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:42:  activationScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:82: * Boost a search result's score based on co-activation with related memories.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:84:function boostScore(
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:93:  const perNeighborBoost = CO_ACTIVATION_CONFIG.boostFactor * (avgSimilarity / 100);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:105: * repeated DB round-trips when spreadActivation() traverses multiple hops.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:112:    console.warn('[co-activation] Database not initialized. Server may still be starting up.');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:176:    console.warn(`[co-activation] getRelatedMemories error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:206:      console.warn(`[co-activation] Invalid embedding size (${uint8.byteLength} bytes) for memory ${memoryId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:229:    console.warn(`[co-activation] populateRelatedMemories error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:287:    console.warn(`[co-activation] getCausalNeighbors error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:298:function spreadActivation(
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:332:        activationScore: Math.round(current.score * 1000) / 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:374:  return results.sort((a, b) => b.activationScore - a.activationScore);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:388:  spreadActivation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:12:import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:47:import type { SpreadResult } from '../cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:180:/** Number of top results used as seeds for co-activation spreading. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:907:          const spreadResults: SpreadResult[] = spreadActivation(topIds);
context compacted
codex
I’ve finished the first pass through maintenance, lifecycle, analysis, and evaluation, and I’m now closing the gap on the remaining bug-fix features so the final audit covers all 29 files without any holes.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/01-graph-channel-id-fix.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md
.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const p='.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity'; for (const f of fs.readdirSync(p).filter(x=>x.endsWith('.md')).sort()) { const s=fs.readFileSync(p+'/'+f,'utf8'); const m=s.match(/## Current Reality\\n([\\s\\S]*?)(\\n## |"'$)/); console.log('"'FILE:',f); console.log((m?m[1].trim():'<no current reality>').split('\\n').slice(0,8).join('\\n')); console.log('---'); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: 01-graph-channel-id-fix.md
The graph search channel had a 0% hit rate in production. Zero. The system was designed as a multi-channel retrieval engine, but the graph channel contributed nothing because `graph-search-fn.ts` compared string-formatted IDs (`mem:${edgeId}`) against numeric memory IDs at two separate locations.

Both comparison points now extract numeric IDs, and the graph channel returns results for queries where causal edge relationships exist. This was the single highest-impact bug in the system because it meant an entire retrieval signal was dead on arrival.
---
FILE: 02-chunk-collapse-deduplication.md
Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed so dedup now runs on every search request regardless of content settings. A small fix, but one that affected every standard query.
---
FILE: 03-co-activation-fan-effect-divisor.md
Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

A fan-effect divisor helper (`1 / sqrt(neighbor_count)`) exists in `co-activation.ts`, but Stage 2 hot-path boosting currently applies spread-activation scores directly via the configured co-activation strength multiplier. The guard logic remains in the helper path with bounded division behavior.
---
FILE: 04-sha-256-content-hash-deduplication.md
Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.

---
---
codex
I’ve got the remaining bug-fix inventory and I’m now matching each doc’s claimed implementation files against the real code paths, because several of these look like “right idea, stale file list” rather than behavior regressions.
exec
/bin/zsh -lc "node -e \"const fs=require('fs'); const p='.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity'; for (const f of fs.readdirSync(p).filter(x=>x.endsWith('.md')).sort()) { const s=fs.readFileSync(p+'/'+f,'utf8'); console.log('FILE:',f); const sections=[...s.matchAll(/### (Implementation|Test) Files\\n([\\s\\S]*?)(?=\\n### |\\n## |"'$)/g)]; for (const sec of sections){ const paths=[...sec[2].matchAll(/`([''^`]+)`/g)].map(m=>m[1]); console.log(sec[1]+'"':', paths.join(' | ')||'<none>'); } console.log('---'); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 50ms:
zsh:1: unmatched "
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const p=\".opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity\"; for (const f of fs.readdirSync(p).filter(x=>x.endsWith(\".md\")).sort()) { const s=fs.readFileSync(path.join(p,f),\"utf8\"); console.log(\"FILE:\",f); const re=/### (Implementation|Test) Files\\n([\\s\\S]*?)(?=\\n### |\\n## |"'$)/g; let m; while ((m=re.exec(s))) { const paths=[...m[2].matchAll(/`([''^`]+)`/g)].map(x=>x[1]); console.log(m[1]+":", paths.length?paths.join(" | "):"<none>"); } console.log("---"); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: 01-graph-channel-id-fix.md
---
FILE: 02-chunk-collapse-deduplication.md
---
FILE: 03-co-activation-fan-effect-divisor.md
---
FILE: 04-sha-256-content-hash-deduplication.md
---
FILE: 05-database-and-schema-safety.md
---
FILE: 06-guards-and-edge-cases.md
---
FILE: 07-canonical-id-dedup-hardening.md
---
FILE: 08-mathmax-min-stack-overflow-elimination.md
---
FILE: 09-session-manager-transaction-gap-fixes.md
---
FILE: 10-chunking-orchestrator-safe-swap.md
---
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# SHA-256 content-hash deduplication

## Current Reality

Before this change, re-saving identical content triggered a full embedding API call every time. That costs money and adds latency for zero value.

An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/save/dedup.ts` | Handler | Deduplication logic |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
 succeeded in 52ms:
# Math.max/min stack overflow elimination

## Current Reality

`Math.max(...array)` and `Math.min(...array)` push all elements onto the call stack, causing `RangeError` on arrays exceeding ~100K elements. Seven production files were converted from spread patterns to `reduce()`:

- `rsf-fusion.ts` — 6 instances (4 + 2)
- `causal-boost.ts` — 1 instance
- `evidence-gap-detector.ts` — 1 instance
- `prediction-error-gate.ts` — 2 instances
- `retrieval-telemetry.ts` — 1 instance
- `reporting-dashboard.ts` — 2 instances

Each replacement uses `scores.reduce((a, b) => Math.max(a, b), -Infinity)` with an `AI-WHY` comment explaining the safety rationale.

## Source Files

### Implementation

| File | Layer | Role |
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const p=\".opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity\"; for (const f of fs.readdirSync(p).filter(x=>x.endsWith(\".md\")).sort()) { const s=fs.readFileSync(path.join(p,f),\"utf8\"); console.log(\"FILE:\",f); const re=/### (Implementation|Tests?)\\n([\\s\\S]*?)(?=\\n### |\\n## |"'$)/g; let m; while ((m=re.exec(s))) { const paths=[...m[2].matchAll(/`([''^`]+)`/g)].map(x=>x[1]); console.log(m[1]+":", paths.length?paths.join(" | "):"<none>"); } console.log("---"); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
FILE: 01-graph-channel-id-fix.md
Implementation: mcp_server/lib/cognitive/rollout-policy.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/graph-flags.ts | mcp_server/lib/search/graph-search-fn.ts | mcp_server/lib/search/search-types.ts | mcp_server/lib/search/spec-folder-hierarchy.ts
Tests: mcp_server/tests/bm25-index.vitest.ts | mcp_server/tests/content-normalizer.vitest.ts | mcp_server/tests/graph-flags.vitest.ts | mcp_server/tests/graph-search-fn.vitest.ts | mcp_server/tests/rollout-policy.vitest.ts | mcp_server/tests/spec-folder-hierarchy.vitest.ts
---
FILE: 02-chunk-collapse-deduplication.md
Implementation: mcp_server/lib/chunking/anchor-chunker.ts | mcp_server/lib/chunking/chunk-thinning.ts | mcp_server/lib/scoring/mpab-aggregation.ts
Tests: mcp_server/tests/chunk-thinning.vitest.ts | mcp_server/tests/mpab-aggregation.vitest.ts
---
FILE: 03-co-activation-fan-effect-divisor.md
Implementation: mcp_server/lib/cognitive/co-activation.ts
Tests: mcp_server/tests/co-activation.vitest.ts
---
FILE: 04-sha-256-content-hash-deduplication.md
Implementation: mcp_server/handlers/memory-crud-types.ts | mcp_server/handlers/save/dedup.ts | mcp_server/handlers/save/types.ts | mcp_server/hooks/mutation-feedback.ts | mcp_server/lib/config/memory-types.ts | mcp_server/lib/config/type-inference.ts | mcp_server/lib/parsing/memory-parser.ts | mcp_server/lib/scoring/importance-tiers.ts | mcp_server/lib/storage/incremental-index.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/path-security.ts | shared/parsing/quality-extractors.ts | shared/utils/path-security.ts
Tests: mcp_server/tests/content-hash-dedup.vitest.ts | mcp_server/tests/importance-tiers.vitest.ts | mcp_server/tests/incremental-index-v2.vitest.ts | mcp_server/tests/incremental-index.vitest.ts | mcp_server/tests/integration-session-dedup.vitest.ts | mcp_server/tests/memory-parser-extended.vitest.ts | mcp_server/tests/memory-parser.vitest.ts | mcp_server/tests/memory-types.vitest.ts | mcp_server/tests/unit-composite-scoring-types.vitest.ts | mcp_server/tests/unit-folder-scoring-types.vitest.ts | mcp_server/tests/unit-path-security.vitest.ts | mcp_server/tests/unit-tier-classifier-types.vitest.ts | mcp_server/tests/unit-transaction-metrics-types.vitest.ts | shared/parsing/quality-extractors.test.ts
---
FILE: 05-database-and-schema-safety.md
Implementation: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/storage/transaction-manager.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/logger.ts | shared/config.ts | shared/normalization.ts | shared/types.ts
Tests: mcp_server/tests/cognitive-gaps.vitest.ts | mcp_server/tests/config-cognitive.vitest.ts | mcp_server/tests/consumption-logger.vitest.ts | mcp_server/tests/db-state-graph-reinit.vitest.ts | mcp_server/tests/embedding-cache.vitest.ts | mcp_server/tests/eval-logger.vitest.ts | mcp_server/tests/memory-types.vitest.ts | mcp_server/tests/score-normalization.vitest.ts | mcp_server/tests/transaction-manager-extended.vitest.ts | mcp_server/tests/transaction-manager.vitest.ts | mcp_server/tests/trigger-config-extended.vitest.ts | mcp_server/tests/unit-composite-scoring-types.vitest.ts | mcp_server/tests/unit-folder-scoring-types.vitest.ts | mcp_server/tests/unit-normalization-roundtrip.vitest.ts | mcp_server/tests/unit-normalization.vitest.ts | mcp_server/tests/unit-tier-classifier-types.vitest.ts | mcp_server/tests/unit-transaction-metrics-types.vitest.ts
---
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const roots=[\"04--maintenance\",\"05--lifecycle\",\"06--analysis\",\"07--evaluation\",\"08--bug-fixes-and-data-integrity\"]; const base=\".opencode/skill/system-spec-kit/feature_catalog\"; const prefix=\".opencode/skill/system-spec-kit/\"; for (const r of roots){ for (const f of fs.readdirSync(path.join(base,r)).filter(x=>x.endsWith(\".md\")).sort()){ const s=fs.readFileSync(path.join(base,r,f),\"utf8\"); const rels=[...s.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]).filter(p=>/''^(mcp_server|shared|scripts)'"\\//.test(p)); const bad=rels.filter(p=>"'!fs.existsSync(prefix+p)); if (bad.length) console.log(r+"/"+f+": "+[...new Set(bad)].join(" | ")); } }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md: mcp_server/tests/retry.vitest.ts
05--lifecycle/01-checkpoint-creation-checkpointcreate.md: mcp_server/tests/retry.vitest.ts
05--lifecycle/02-checkpoint-listing-checkpointlist.md: mcp_server/tests/retry.vitest.ts
05--lifecycle/03-checkpoint-restore-checkpointrestore.md: mcp_server/tests/retry.vitest.ts
05--lifecycle/04-checkpoint-deletion-checkpointdelete.md: mcp_server/tests/retry.vitest.ts
05--lifecycle/05-async-ingestion-job-lifecycle.md: mcp_server/tests/retry.vitest.ts
06--analysis/01-causal-edge-creation-memorycausallink.md: mcp_server/tests/retry.vitest.ts
06--analysis/02-causal-graph-statistics-memorycausalstats.md: mcp_server/tests/retry.vitest.ts
06--analysis/03-causal-edge-deletion-memorycausalunlink.md: mcp_server/tests/retry.vitest.ts
06--analysis/04-causal-chain-tracing-memorydriftwhy.md: mcp_server/tests/retry.vitest.ts
06--analysis/05-epistemic-baseline-capture-taskpreflight.md: mcp_server/tests/retry.vitest.ts
06--analysis/06-post-task-learning-measurement-taskpostflight.md: mcp_server/tests/retry.vitest.ts
06--analysis/07-learning-history-memorygetlearninghistory.md: mcp_server/tests/retry.vitest.ts
07--evaluation/01-ablation-studies-evalrunablation.md: mcp_server/tests/retry.vitest.ts
07--evaluation/02-reporting-dashboard-evalreportingdashboard.md: mcp_server/tests/retry.vitest.ts
codex
I’m in the last deep pass now: reading the actual handlers/libs behind the remaining bug-fix docs and checking whether the markdown is describing the behavior that really ships, or just the original remediation note.
exec
/bin/zsh -lc 'rg -n "sha256|content hash|hash" .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts .opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"frequency_counter|importance_weight|CREATE TABLE IF NOT EXISTS|ALTER TABLE ADD COLUMN|AND \\(.*OR|WHERE .* AND .* OR .*|operator precedence|DDL\" .opencode/skill/system-spec-kit/mcp_server/lib -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"j = i \\+ 1|most-recent|most recent|return null|resolve.*failure|fallback\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:37:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:119:          SELECT file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:126:          SELECT file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:19:    SELECT id, content_hash FROM memory_index
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:25:  `).get(parsed.specFolder, canonicalFilePath, filePath) as { id: number; content_hash: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:27:  if (existing && existing.content_hash === parsed.contentHash && !force) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:53:        AND content_hash = ?
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:61:      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:6:// same content_hash) and proceeds to embed for changed content.
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:19:function sha256(content: string): string {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:20:  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:25: * needed for the content-hash dedup check.
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:43:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:47:    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:64:      AND content_hash = ?
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:81:  const hash = sha256(content);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:83:    INSERT INTO memory_index (spec_folder, file_path, title, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:85:  `).run(specFolder, filePath, title ?? null, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:110:      const hash = sha256('some content');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:111:      const result = checkContentHashDedup(db, 'specs/test-folder', hash);
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:248:  CREATE TABLE IF NOT EXISTS session_sent_memories (
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:721:  CREATE TABLE IF NOT EXISTS session_state (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:44:  CREATE TABLE IF NOT EXISTS working_memory (
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:167:    CREATE TABLE IF NOT EXISTS ingest_jobs (
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:38:  CREATE TABLE IF NOT EXISTS negative_feedback_events (
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:144:/** Track which DB handle has had config-table DDL ensured */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:149: * Re-runs DDL when the DB handle changes (for example, after reinitialization).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:153:  db.exec('CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)');
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:233:  CREATE TABLE IF NOT EXISTS memory_corrections (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:245:    memory.importance_weight as number | undefined
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:306:        AND (importance_tier IS NULL OR importance_tier NOT IN ('deprecated'))
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:307:      ORDER BY last_accessed DESC, importance_weight DESC
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:46:  'importance_weight',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:122:      importance_weight REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:170:    CREATE INDEX IF NOT EXISTS idx_importance ON memory_index(importance_weight DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:175:    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1114:      SELECT id, title, file_path, importance_tier, importance_weight, spec_folder
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1126:        importance_weight DESC,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:160:      CREATE TABLE IF NOT EXISTS archival_stats (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:419:        AND (is_archived IS NULL OR is_archived = 0)
 succeeded in 51ms:
Total output lines: 314

.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:144:    // AI-WHY: Heuristic fallback: check sibling files.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:155:      return null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:158:    return null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:127:              return null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:233:    hints.push('Vector search unavailable - using BM25 fallback');
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:19:  /** Anchor IDs covered by this chunk (empty for fallback chunks) */
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:58:/** Max characters for parent summary (BM25 fallback) */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:164:    if (!db) return null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:170:    return null;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:311:    return null;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:322:    return null;
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:72: * for camelCase fallback fields (e.g. retryCount, triggerPhrases).
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:550:    return null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:328:      // rather than the legacy sync fallback defaults.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:347:    hints.push('Vector search unavailable - fallback to BM25');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:4:// AI-WHY: Captures latency, mode selection, fallback, and quality-proxy
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:62:  fallbackTriggered: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:63:  fallbackReason?: string;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Dedup
     3	// ---------------------------------------------------------------
     4	
     5	import type Database from 'better-sqlite3';
     6	
     7	import type { ParsedMemory } from '../../lib/parsing/memory-parser';
     8	import type { IndexResult } from './types';
     9	
    10	export function checkExistingRow(
    11	  database: Database.Database,
    12	  parsed: ParsedMemory,
    13	  canonicalFilePath: string,
    14	  filePath: string,
    15	  force: boolean,
    16	  warnings: string[] | undefined,
    17	): IndexResult | null {
    18	  const existing = database.prepare(`
    19	    SELECT id, content_hash FROM memory_index
    20	    WHERE spec_folder = ?
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Test — SHA256 Content-Hash Dedup (TM-02)
     3	// ---------------------------------------------------------------
     4	// Verifies that the fast-path dedup check in indexMemoryFile()
     5	// returns 'duplicate' for identical content (same spec_folder,
     6	// same content_hash) and proceeds to embed for changed content.
     7	
     8	import { describe, it, expect, beforeAll, afterAll } from 'vitest';
     9	import Database from 'better-sqlite3';
    10	import * as path from 'path';
    11	import * as os from 'os';
    12	import * as fs from 'fs';
    13	import * as crypto from 'crypto';
    14	
    15	/* -------------------------------------------------------------
    16	   HELPERS
    17	---------------------------------------------------------------- */
    18	
    19	function sha256(content: string): string {
    20	  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
exec
/bin/zsh -lc "rg -n \"checkContentHashDedup|checkExistingRow\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:61:import { checkExistingRow, checkContentHashDedup } from './save/dedup';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:175:  const existingResult = checkExistingRow(database, parsed, canonicalFilePath, filePath, force, validation.warnings);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:179:  const dupResult = checkContentHashDedup(database, parsed, force, validation.warnings);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:10:export function checkExistingRow(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:43:export function checkContentHashDedup(
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:56:function checkContentHashDedup(
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:111:      const result = checkContentHashDedup(db, 'specs/test-folder', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:120:      const result = checkContentHashDedup(db, 'specs/test-folder', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:138:      const result = checkContentHashDedup(db, 'specs/dedup-test', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:164:      const result = checkContentHashDedup(db, 'specs/changed-content', modifiedHash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:178:      const result = checkContentHashDedup(db, 'specs/pending-test', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:190:      const result = checkContentHashDedup(db, folder, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:247:      const result = checkContentHashDedup(db, folder, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:265:      const result = checkContentHashDedup(db, folder, hash);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '150,210p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   150	      title: parsed.title ?? '',
   151	      triggerPhrases: parsed.triggerPhrases,
   152	      contextType: parsed.contextType,
   153	      importanceTier: parsed.importanceTier,
   154	      qualityScore: parsed.qualityScore,
   155	      qualityFlags: parsed.qualityFlags,
   156	      warnings: validation.warnings,
   157	      message: qualityLoopResult.rejectionReason,
   158	    };
   159	  }
   160	
   161	  // AI-GUARD: Per-spec-folder lock to prevent TOCTOU race conditions on concurrent saves
   162	  return withSpecFolderLock(parsed.specFolder, async () => {
   163	
   164	  // AI-WHY: CHUNKING BRANCH: Large files get split into parent + child records
   165	  // Must be inside withSpecFolderLock to serialize chunked saves too
   166	  if (needsChunking(parsed.content)) {
   167	    console.error(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
   168	    return indexChunkedMemoryFile(filePath, parsed, { force, applyPostInsertMetadata });
   169	  }
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Database and schema safety

## Current Reality

Four database-layer bugs were fixed:

**B1 — Reconsolidation column reference:** `reconsolidation.ts` referenced a non-existent `frequency_counter` column that would crash at runtime during merge operations. Replaced with `importance_weight` using `Math.min(1.0, currentWeight + 0.1)` merge logic.

**B2 — DDL inside transaction:** `checkpoints.ts` placed DDL statements (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ADD COLUMN`) inside a `database.transaction()` block. SQLite silently auto-commits on DDL, which corrupted the transaction boundary during checkpoint restore. DDL now runs before `BEGIN`; only DML is wrapped in the transaction.

**B3 — SQL operator precedence:** `causal-edges.ts` had `WHERE a AND b OR c` without parentheses, matching wrong rows on edge deletion. Fixed to `WHERE a AND (b OR c)`.

**B4 — Missing changes guard:** `memory-save.ts` UPDATE statements reported success even when zero rows were updated. Added `.changes > 0` guards so callers can distinguish actual updates from no-ops.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
exec
/bin/zsh -lc "rg -n \"frequency_counter|currentWeight \\+ 0\\.1|importance_weight = \\?\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"DDL .*outside|ALTER TABLE ADD COLUMN|CREATE TABLE IF NOT EXISTS working_memory|database\\.transaction|Run DDL outside the transaction boundary\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"\\.changes > 0|changes > 0|result\\.changes|updated = result\\.changes\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"AND \\(source_memory_id = \\? OR target_memory_id = \\?\\)|DELETE FROM causal_edges|operator precedence\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
388:    const checkpointInfo = database.transaction(() => {
641:    // corrupt a surrounding transaction. Run DDL outside the transaction boundary.
646:          CREATE TABLE IF NOT EXISTS working_memory (
695:    const restoreTx = database.transaction(() => {
 succeeded in 51ms:
204:  const boostedWeight = Math.min(1.0, currentWeight + 0.1);
229:            importance_weight = ?,
 succeeded in 51ms:
491:      'DELETE FROM causal_edges WHERE id = ?'
509:      DELETE FROM causal_edges
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:384:    return result.changes > 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:456:        if (result.changes > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:509:    return result.changes > 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:536:    return result.changes > 0;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | sed -n '360,550p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   360	      } catch (e: unknown) {
   361	        console.warn(`[vector-index] Vector deletion failed for memory ${id}: ${get_error_message(e)}`);
   362	      }
   363	    }
   364	
   365	    // AI-WHY: Fix #20 (017-refinement-phase-6) — Clean all ancillary records
   366	    const ancillaryTables = [
   367	      'DELETE FROM degree_snapshots WHERE memory_id = ?',
   368	      'DELETE FROM community_assignments WHERE memory_id = ?',
   369	      'DELETE FROM memory_summaries WHERE memory_id = ?',
   370	      'DELETE FROM memory_entities WHERE memory_id = ?',
   371	    ];
   372	    for (const sql of ancillaryTables) {
   373	      try { database.prepare(sql).run(id); } catch (_error: unknown) { /* table may not exist */ }
   374	    }
   375	    try {
   376	      database.prepare('DELETE FROM causal_edges WHERE source_id = ? OR target_id = ?').run(id, id);
   377	    } catch (_error: unknown) { /* table may not exist */ }
   378	
   379	    const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '480,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   480	    const msg = error instanceof Error ? error.message : String(error);
   481	    console.warn(`[causal-edges] updateEdge error: ${msg}`);
   482	    return false;
   483	  }
   484	}
   485	
   486	function deleteEdge(edgeId: number): boolean {
   487	  if (!db) return false;
   488	
   489	  try {
   490	    const result = (db.prepare(
   491	      'DELETE FROM causal_edges WHERE id = ?'
   492	    ) as Database.Statement).run(edgeId);
   493	    if ((result as { changes: number }).changes > 0) {
   494	      invalidateDegreeCache();
   495	    }
   496	    return (result as { changes: number }).changes > 0;
   497	  } catch (error: unknown) {
   498	    const msg = error instanceof Error ? error.message : String(error);
   499	    console.warn(`[causal-edges] deleteEdge error: ${msg}`);
exec
/bin/zsh -lc "rg -n \"source_memory_id|target_memory_id|WHERE .*AND.*OR.*\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:389:    get_by_folder_and_path: database.prepare('SELECT id FROM memory_index WHERE spec_folder = ? AND (canonical_file_path = ? OR file_path = ?) AND (anchor_id = ? OR (anchor_id IS NULL AND ? IS NULL)) ORDER BY id DESC LIMIT 1'),
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server | rg 'temporal-contiguity|extraction-adapter|consolidation|entity-linker'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Guards and edge cases

## Current Reality

Two guard/edge-case issues were fixed:

**E1 — Temporal contiguity double-counting:** `temporal-contiguity.ts` had an O(N^2) nested loop that processed both (A,B) and (B,A) pairs, double-counting boosts. Fixed inner loop to `j = i + 1`.

**E2 — Wrong-memory fallback:** `extraction-adapter.ts` fell back to resolving the most-recent memory ID on entity resolution failure, silently linking to the wrong memory. The fallback was removed; the function returns `null` on resolution failure.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/index.ts` | Lib | Module barrel export |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |

 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Temporal Contiguity
     3	// ---------------------------------------------------------------
     4	// Boost search results when memories are temporally adjacent,
     5	// query temporal neighbors, and build spec-folder timelines.
     6	// ---------------------------------------------------------------
     7	
     8	import type Database from 'better-sqlite3';
     9	
    10	/* -------------------------------------------------------------
    11	   1. CONSTANTS
    12	----------------------------------------------------------------*/
    13	
    14	export const DEFAULT_WINDOW = 3600;   // 1 hour in seconds
    15	export const MAX_WINDOW = 86400;      // 24 hours in seconds
    16	
    17	const BOOST_FACTOR = 0.15;
    18	// AI-WHY: Cap the cumulative contiguity boost per result so that a cluster of
    19	// many temporally-close memories cannot inflate a score unboundedly.
    20	const MAX_TOTAL_BOOST = 0.5;
 succeeded in 51ms:
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
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"mem:|canonical|normalize.*id|combinedLexicalSearch|dedup\" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/tests -g '*dedup*' -g 'hybrid-search*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Canonical ID dedup hardening

## Current Reality

Mixed ID formats (`42`, `"42"`, `mem:42`) caused deduplication failures in hybrid search. Normalization was applied in `combinedLexicalSearch()` for the new pipeline and in legacy `hybridSearch()` for the dedup map. Regression tests `T031-LEX-05` and `T031-BASIC-04` verify the fix.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/save/dedup.ts` | Handler | Deduplication logic |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:695:  // Keep intent-adjusted and canonical scores aligned after all score mutations.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:119: * Duplicates are eliminated via `Set` deduplication before slicing.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:231:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:252:          // Merge variant results, deduplicate by id, preserve first-occurrence order
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:338:            // Merge both result sets, deduplicate by id, baseline-first ordering
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:512:  // + deduplicate by ID.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:359: * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:364:function combinedLexicalSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:371:  // AI-WHY: Merge by canonical ID, prefer FTS scores.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:372:  // canonicalResultId() prevents duplicate rows when one channel emits
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:373:  // numeric IDs (42) and another emits string IDs ("42" or "mem:42").
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:377:    merged.set(canonicalResultId(r.id), r);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:381:    const canonicalId = canonicalResultId(r.id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:382:    if (!merged.has(canonicalId)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:383:      merged.set(canonicalId, r);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:481:  const normalized: HybridSearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:505:  const deduped = new Map<string, HybridSearchResult>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:507:    const canonicalId = canonicalResultId(r.id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:508:    const existing = deduped.get(canonicalId);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '364,390p;505,515p;1152,1168p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   364	function combinedLexicalSearch(
   365	  query: string,
   366	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   367	): HybridSearchResult[] {
   368	  const ftsResults = ftsSearch(query, options);
   369	  const bm25Results = bm25Search(query, options);
   370	
   371	  // AI-WHY: Merge by canonical ID, prefer FTS scores.
   372	  // canonicalResultId() prevents duplicate rows when one channel emits
   373	  // numeric IDs (42) and another emits string IDs ("42" or "mem:42").
   374	  const merged = new Map<string, HybridSearchResult>();
   375	
   376	  for (const r of ftsResults) {
   377	    merged.set(canonicalResultId(r.id), r);
   378	  }
   379	
   380	  for (const r of bm25Results) {
   381	    const canonicalId = canonicalResultId(r.id);
   382	    if (!merged.has(canonicalId)) {
   383	      merged.set(canonicalId, r);
exec
/bin/zsh -lc "rg -n \"Math\\.(max|min)\\(\\.\\.\\.|reduce\\(\\(a, b\\) => Math\\.(max|min)\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"AI-WHY.*stack|AI-WHY.*Math\\.(max|min)|RangeError|spread patterns|reduce\\(\\(a, b\\) => Math\\.(max|min)\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:200:  const recencyScore = Math.max(...folderMemories.map(m =>
.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:267:  return new Date(Math.max(...timestamps)).toISOString();
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:438:  // AI-WHY: Avoid Math.max(...scores) / Math.min(...scores) — spread on large
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:202:      const maxWeight = Math.max(...Object.values(weights) as number[]);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:272:    const maxScore = Math.max(...result.scores.map(s => s.score));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:164:    const maxScore = Math.max(...result.map(r => r.score));
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:156:  const maxBaseId = Math.max(...baseIds);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:441:      const min = Math.min(...taus);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:442:      const max = Math.max(...taus);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:299:    const minBudget: number = Math.min(...budgets);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:352:    const maxBudget: number = Math.max(...budgets);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:485:    min: similarities.reduce((a, b) => Math.min(a, b), Infinity),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:486:    max: similarities.reduce((a, b) => Math.max(a, b), -Infinity),
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:73:    const highestScore = Math.max(...results.map(r => r.rrfScore));
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:144:    expect(Math.max(...normalized)).toBeCloseTo(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:145:    expect(Math.min(...normalized)).toBeCloseTo(0.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:309:    expect(Math.max(...normalized)).toBeCloseTo(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:382:    expect(Math.max(...scores)).toBeCloseTo(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:383:    expect(Math.min(...scores)).toBeCloseTo(0.0, 5);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:309:    min: Math.round(values.reduce((a, b) => Math.min(a, b), Infinity) * 10000) / 10000,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:438:  // AI-WHY: Avoid Math.max(...scores) / Math.min(...scores) — spread on large
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:483:  // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:485:    min: similarities.reduce((a, b) => Math.min(a, b), Infinity),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:486:    max: similarities.reduce((a, b) => Math.max(a, b), -Infinity),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:306:  // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:309:    min: Math.round(values.reduce((a, b) => Math.min(a, b), Infinity) * 10000) / 10000,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:310:    max: Math.round(values.reduce((a, b) => Math.max(a, b), -Infinity) * 10000) / 10000,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:184:    // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:185:    t.quality.topResultScore = scores.reduce((a, b) => Math.max(a, b), -Infinity);
.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:150:  // Use reduce-based max to avoid RangeError when scored is large (spread exceeds call-stack limit)
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:228:  // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:229:  const lowestScore = Math.max(0.0001, results.map((item) => resolveBaseScore(item)).reduce((a, b) => Math.min(a, b), Infinity));
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:101:  // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:102:  const minA = scoresA.length > 0 ? scoresA.reduce((a, b) => Math.min(a, b), Infinity) : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:103:  const maxA = scoresA.length > 0 ? scoresA.reduce((a, b) => Math.max(a, b), -Infinity) : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:104:  const minB = scoresB.length > 0 ? scoresB.reduce((a, b) => Math.min(a, b), Infinity) : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:105:  const maxB = scoresB.length > 0 ? scoresB.reduce((a, b) => Math.max(a, b), -Infinity) : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:212:    // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:213:    const minScore = rawScores.reduce((a, b) => Math.min(a, b), Infinity);
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:214:    const maxScore = rawScores.reduce((a, b) => Math.max(a, b), -Infinity);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | sed -n '302,312p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts | sed -n '96,106p;208,216p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts | sed -n '194,206p;262,270p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    96	  // --- Step 1: Extract raw scores ---
    97	  const scoresA = itemsA.map((item, i) => extractScore(item, i, itemsA.length));
    98	  const scoresB = itemsB.map((item, i) => extractScore(item, i, itemsB.length));
    99	
   100	  // --- Step 2: Compute min/max per source ---
   101	  // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
   102	  const minA = scoresA.length > 0 ? scoresA.reduce((a, b) => Math.min(a, b), Infinity) : 0;
   103	  const maxA = scoresA.length > 0 ? scoresA.reduce((a, b) => Math.max(a, b), -Infinity) : 0;
   104	  const minB = scoresB.length > 0 ? scoresB.reduce((a, b) => Math.min(a, b), Infinity) : 0;
   105	  const maxB = scoresB.length > 0 ? scoresB.reduce((a, b) => Math.max(a, b), -Infinity) : 0;
   106	
   208	
   209	  for (const list of nonEmptyLists) {
   210	    const items = list.results;
   211	    const rawScores = items.map((item, i) => extractScore(item, i, items.length));
   212	    // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
   213	    const minScore = rawScores.reduce((a, b) => Math.min(a, b), Infinity);
   214	    const maxScore = rawScores.reduce((a, b) => Math.max(a, b), -Infinity);
   215	
   216	    const normalizedMap = new Map<number | string, { item: RrfItem; normalizedScore: number }>();
 succeeded in 52ms:
   302	  if (values.length === 0) {
   303	    return { mean: 0, min: 0, max: 0, latest: 0, count: 0 };
   304	  }
   305	  const sum = values.reduce((a, b) => a + b, 0);
   306	  // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
   307	  return {
   308	    mean: Math.round((sum / values.length) * 10000) / 10000,
   309	    min: Math.round(values.reduce((a, b) => Math.min(a, b), Infinity) * 10000) / 10000,
   310	    max: Math.round(values.reduce((a, b) => Math.max(a, b), -Infinity) * 10000) / 10000,
   311	    latest: Math.round(latest * 10000) / 10000,
   312	    count: values.length,
 succeeded in 52ms:
   194	      activityScore: 0,
   195	      validationScore: DEFAULT_VALIDATION_SCORE,
   196	    };
   197	  }
   198	
   199	  // Recency: best score from any memory in folder
   200	  const recencyScore = Math.max(...folderMemories.map(m =>
   201	    computeRecencyScore(
   202	      (m.updatedAt || m.updated_at as string | undefined || m.createdAt || m.created_at as string | undefined || '') as string,
   203	      (m.importanceTier || m.importance_tier as string | undefined || 'normal') as string
   204	    )
   205	  ));
   206	
   262	
   263	  if (timestamps.length === 0) {
   264	    return new Date().toISOString();
   265	  }
   266	
   267	  return new Date(Math.max(...timestamps)).toISOString();
   268	}
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"enforceEntryLimit|transaction\\(|INSERT INTO session_entries|session-manager\" .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts .opencode/skill/system-spec-kit/mcp_server/tests/session-manager*.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Session-manager transaction gap fixes

## Current Reality

Two instances of `enforceEntryLimit()` called outside `db.transaction()` blocks in `session-manager.ts` were moved inside. Concurrent MCP requests could both pass the limit check then both insert, exceeding the entry limit when check and insert were not atomic. Both paths now run check-and-insert atomically inside the transaction.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory integration |
| `mcp_server/lib/session/session-manager.ts` | Lib | Session lifecycle management |
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction management |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |

### Tests
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:10:import * as sm from '../lib/session/session-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:611:  // ── 16. enforceEntryLimit ─────────────────────────────────
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:613:  describe('16. enforceEntryLimit', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:        // enforceEntryLimit is called inside markMemorySent
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:8:import * as sessionManager from '../lib/session/session-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:183:    console.error('[session-manager] WARNING: init() called with null database');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:205:      console.warn(`[session-manager] Periodic cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:218:    console.warn(`[session-manager] Initial stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:229:      console.warn(`[session-manager] Periodic stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:275:    console.error(`[session-manager] Schema creation failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:318:    console.warn(`[session-manager] Database not initialized. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} memory.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:336:    console.warn(`[session-manager] shouldSendMemory check failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:355:    console.warn(`[session-manager] Database not initialized for batch dedup. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} batch.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:386:    console.warn(`[session-manager] shouldSendMemoriesBatch failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:415:    db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:417:      // AI-WHY: enforceEntryLimit inside tx — atomic with insert to prevent row count races.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:418:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:424:    console.error(`[session-manager] markMemorySent failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:445:    const runBatch = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:453:      // AI-WHY: enforceEntryLimit inside tx — atomic with inserts to prevent row count races.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '408,456p;471,492p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   408	
   409	    const stmt = db.prepare(`
   410	      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
   411	      VALUES (?, ?, ?, ?)
   412	    `);
   413	
   414	    // AI-WHY: transaction ensures atomic insert + limit enforcement, preventing concurrent race past entry limit.
   415	    db.transaction(() => {
   416	      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
   417	      // AI-WHY: enforceEntryLimit inside tx — atomic with insert to prevent row count races.
   418	      enforceEntryLimit(sessionId);
   419	    })();
   420	
   421	    return { success: true, hash };
   422	  } catch (error: unknown) {
   423	    const message = error instanceof Error ? error.message : String(error);
   424	    console.error(`[session-manager] markMemorySent failed: ${message}`);
   425	    return { success: false, error: message };
   426	  }
   427	}
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/10-chunking-orchestrator-safe-swap.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"staged swap|safe swap|attach.*parent|delete old children|parent_id|indexing failed completely|unattached|transaction\" .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts .opencode/skill/system-spec-kit/mcp_server/tests -g 'chunking*' -g '*orchestrator*'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Chunking Orchestrator Safe Swap

## Current Reality

During re-chunking of parent memories, the orchestrator previously deleted existing child chunks before indexing new replacements. If new chunk indexing failed (all embeddings fail, disk full), both old and new data were lost. The fix introduces a staged swap pattern: new child chunks are indexed first without a parent_id link, then a single database transaction atomically deletes old children, attaches new children to the parent, and updates parent metadata. If new chunk indexing fails completely, old children remain intact and the handler returns an error status.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/chunking-orchestrator.ts` | Handler | Re-chunk swap logic with staged indexing |

### Tests

| File | Focus |
|------|-------|
| (no dedicated test file yet) | — |

 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:70:  parent_id?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:88:  'spec_level', 'quality_score', 'quality_flags', 'parent_id',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:118: * Child records: embedding_status='success'|'pending', parent_id=parent.id
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:146:  // AI-GUARD: Wrap parent setup in transaction to prevent check-then-delete race condition
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:147:  const setupParent = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:151:        AND parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:162:      // replacement chunks are fully indexed and finalized in a transaction.
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:167:        database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(existing.id);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:298:      // Re-chunk updates stage children without parent_id; parent swap is finalized
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:301:        ...(useSafeSwap ? {} : { parent_id: parentId }),
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:343:      const rollbackTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:345:          database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(parentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:384:    const finalizeSwapTx = database.transaction((newChildIds: number[]) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:392:      database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(parentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:397:        SET parent_id = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:461:        message: `Chunked indexing aborted: failed to finalize safe swap (${message})`,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts | sed -n '146,176p;292,312p;334,406p;448,468p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   146	  // AI-GUARD: Wrap parent setup in transaction to prevent check-then-delete race condition
   147	  const setupParent = database.transaction(() => {
   148	    const existing = database.prepare(`
   149	      SELECT id FROM memory_index
   150	      WHERE spec_folder = ?
   151	        AND parent_id IS NULL
   152	        AND (canonical_file_path = ? OR file_path = ?)
   153	      ORDER BY id DESC
   154	      LIMIT 1
   155	    `).get(parsed.specFolder, canonicalFilePath, filePath) as { id: number } | undefined;
   156	
   157	    let pid: number;
   158	
   159	    if (existing && !force) {
   160	      pid = existing.id;
   161	      // Safe-swap mode for re-chunking: keep existing children intact until
   162	      // replacement chunks are fully indexed and finalized in a transaction.
   163	      return { parentId: pid, isUpdate: true };
   164	    } else {
   165	      // Delete old parent+children if force re-indexing
exec
/bin/zsh -lc 'rg -n "successCount|failedChunks|partial" .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
117: * Parent record: embedding_status='partial', content_text=summary
204:        embedding_status: 'partial',
230:  let successCount = 0;
327:      successCount++;
335:  if (successCount === 0) {
408:            embedding_status = 'partial',
479:      successCount,
500:    embeddingStatus: 'partial',
501:    message: `Chunked: ${successCount}/${retainedChunks.length} chunks indexed (${chunkResult.strategy} strategy)` +
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"cleanupOldSessions|last_focused|CURRENT_TIMESTAMP|datetime\\(last_focused\\)|toISOString\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts .opencode/skill/system-spec-kit/mcp_server/tests -g 'working-memory*.ts' -g 'checkpoint-working-memory*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Working Memory Session Cleanup Timestamp Fix

## Current Reality

The `cleanupOldSessions()` method in the working memory manager compared `last_focused` timestamps (stored via SQLite `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS`) against JavaScript `toISOString()` output (`YYYY-MM-DDTHH:MM:SS.sssZ`). The lexicographic comparison failed because space (ASCII 32) sorts before `T` (ASCII 84), causing active sessions to be incorrectly deleted. The fix replaces the JavaScript Date comparison with SQLite-native `datetime()` math: `DELETE FROM working_memory_sessions WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, keeping the comparison entirely within SQLite's datetime system.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Session lifecycle and cleanup logic |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/cognitive-gaps.vitest.ts` | Cognitive layer gap coverage |

 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:49:    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:50:    last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:77:  last_focused: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:196:function cleanupOldSessions(): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:202:    const nowIso = new Date(Date.now()).toISOString();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:204:      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:209:    console.warn(`[working-memory] cleanupOldSessions error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:239:      SELECT m.*, wm.attention_score, wm.focus_count, wm.last_focused
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:279:      ORDER BY wm.attention_score DESC, wm.last_focused DESC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:323:            last_focused = CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:395:        last_focused = CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:436: * LRU is defined as the least-recently focused entries first (`last_focused ASC`).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:455:        ORDER BY last_focused ASC, id ASC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:561:    ORDER BY last_focused DESC, id DESC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:641:  cleanupOldSessions,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:84:        added_at TEXT DEFAULT CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:85:        last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:92:    const now = new Date().toISOString();
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:120:      const now = new Date().toISOString();
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:123:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '192,206p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   192	    return 0;
   193	  }
   194	}
   195	
   196	function cleanupOldSessions(): number {
   197	  if (!db) return 0;
   198	  ensureSchema();
   199	
   200	  try {
   201	    const timeoutSeconds = Math.floor(WORKING_MEMORY_CONFIG.sessionTimeoutMs / 1000);
   202	    const nowIso = new Date(Date.now()).toISOString();
   203	    const result = (db.prepare(
   204	      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
   205	    ) as Database.Statement).run(nowIso, timeoutSeconds);
   206	    return (result as { changes: number }).changes;
exec
/bin/zsh -lc "rg -n \"cleanupOldSessions|datetime\\(last_focused\\)\" .opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:182:      'cleanupOldSessions',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts | sed -n '170,190p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   170	     Module Exports
   171	  ---------------------------------------------------------------- */
   172	
   173	  describe('Module Exports', () => {
   174	    const expectedExports = [
   175	      'WORKING_MEMORY_CONFIG',
   176	      'SCHEMA_SQL',
   177	      'INDEX_SQL',
   178	      'init',
   179	      'ensureSchema',
   180	      'getOrCreateSession',
   181	      'clearSession',
   182	      'cleanupOldSessions',
   183	      'getWorkingMemory',
   184	      'getSessionMemories',
   185	      'calculateTier',
   186	      'setAttentionScore',
   187	      'enforceMemoryLimit',
   188	      'batchUpdateScores',
   189	      'isEnabled',
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '731,769p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '612,700p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   612	  applyCrossEncoderReranking,
   613	  collapseAndReassembleChunkResults,
   614	  electBestChunk,
   615	  effectiveScore,
   616	  resolveDisplayText,
   617	  reassembleParentRow,
   618	  markFallback,
   619	};
 succeeded in 52ms:
   731	      // AI-WHY: -- Sprint 4 Stage: R1 MPAB chunk-to-memory aggregation (after fusion, before state filter) --
   732	      // When enabled, collapses chunk-level results back to their parent memory
   733	      // documents using MPAB scoring (sMax + 0.3 * sum(remaining) / sqrt(N)). This prevents
   734	      // multiple chunks from the same document dominating the result list.
   735	      // MINOR-1 fix: isMpabEnabled() and isDocscoreAggregationEnabled() check the same env var
   736	      if (isDocscoreAggregationEnabled()) {
   737	        try {
   738	          const chunkResults = fusedHybridResults.filter(
   739	            r => (r as Record<string, unknown>).parentMemoryId != null && (r as Record<string, unknown>).chunkIndex != null
   740	          );
   741	          if (chunkResults.length > 0) {
   742	            const nonChunkResults = fusedHybridResults.filter(
   743	              r => (r as Record<string, unknown>).parentMemoryId == null || (r as Record<string, unknown>).chunkIndex == null
   744	            );
   745	            const collapsed = collapseAndReassembleChunkResults(
   746	              chunkResults.map(r => ({
   747	                id: r.id,
   748	                parentMemoryId: (r as Record<string, unknown>).parentMemoryId as number | string,
   749	                chunkIndex: (r as Record<string, unknown>).chunkIndex as number,
   750	                score: r.score,
 succeeded in 52ms:
# Chunk collapse deduplication

## Current Reality

Duplicate chunk rows appeared in default search mode because the deduplication logic only ran when `includeContent=true`. Most queries use the default `includeContent=false` path, which means most users saw duplicates. The conditional gate was removed so dedup now runs on every search request regardless of content settings. A small fix, but one that affected every standard query.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |

### Tests

| File | Focus |
|------|-------|
exec
/bin/zsh -lc 'rg -n "includeContent|collapseAndReassembleChunkResults|reassembled_chunks|contentSource" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:81:  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:118:  includeContent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:274:  includeContent: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:301:  includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:326:    includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:376:function collapseAndReassembleChunkResults(results: MemorySearchRow[]): ChunkReassemblyResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:410:        contentSource: 'file_read_fallback',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:477:        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:490:        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:509:        contentSource: 'reassembled_chunks' as const,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:599:    includeContent: includeContent = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:748:    includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:790:          includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:876:          includeContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1063:  collapseAndReassembleChunkResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:21://     - contentSource is set to 'reassembled_chunks' or 'file_read_fallback'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:210:    await collapseAndReassembleChunkResults(results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:411:async function collapseAndReassembleChunkResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:510: *   - `contentSource: 'reassembled_chunks'` to mark provenance
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '200,214p;411,430p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   200	  }
   201	
   202	  // AI-GUARD: -- Step 3: MPAB chunk collapse + parent reassembly -----------
   203	  //
   204	  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
   205	  // here in Stage 3 — never move it upstream.
   206	  const mpabStart = Date.now();
   207	  const beforeMpab = results.length;
   208	
   209	  const { results: aggregated, stats: chunkStats } =
   210	    await collapseAndReassembleChunkResults(results);
   211	
   212	  results = aggregated;
   213	
   214	  if (config.trace) {
   411	async function collapseAndReassembleChunkResults(
   412	  results: PipelineRow[]
   413	): Promise<{ results: PipelineRow[]; stats: ChunkReassemblyStats }> {
   414	  const stats: ChunkReassemblyStats = {
   415	    collapsedChunkHits: 0,
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '80,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '904,915p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '541,550p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    80	
    81	/**
    82	 * Boost a search result's score based on co-activation with related memories.
    83	 */
    84	function boostScore(
    85	  baseScore: number,
    86	  relatedCount: number,
    87	  avgSimilarity: number
    88	): number {
    89	  if (!CO_ACTIVATION_CONFIG.enabled || relatedCount === 0) {
    90	    return baseScore;
    91	  }
    92	
    93	  const perNeighborBoost = CO_ACTIVATION_CONFIG.boostFactor * (avgSimilarity / 100);
    94	  // AI-WHY: Pure fan-effect scaling — each additional neighbor contributes less (sublinear)
    95	  const fanDivisor = Math.sqrt(Math.max(1, relatedCount));
    96	  const boost = Math.max(0, perNeighborBoost / fanDivisor);
    97	  return baseScore + boost;
    98	}
    99	
 succeeded in 51ms:
# Co-activation fan-effect divisor

## Current Reality

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

A fan-effect divisor helper (`1 / sqrt(neighbor_count)`) exists in `co-activation.ts`, but Stage 2 hot-path boosting currently applies spread-activation scores directly via the configured co-activation strength multiplier. The guard logic remains in the helper path with bounded division behavior.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |

### Tests

| File | Focus |
|------|-------|
 succeeded in 52ms:
   904	        .filter((id): id is number => typeof id === 'number');
   905	      if (topIds.length > 0) {
   906	        try {
   907	          const spreadResults: SpreadResult[] = spreadActivation(topIds);
   908	          // Boost scores of results that appear in co-activation graph
   909	          if (spreadResults.length > 0) {
   910	            const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
   911	            for (const result of reranked) {
   912	              const boost = spreadMap.get(result.id as number);
   913	              if (boost !== undefined) {
   914	                (result as Record<string, unknown>).score =
   915	                  ((result.score as number) ?? 0) + boost * CO_ACTIVATION_CONFIG.boostFactor;
   541	        const spreadResults: SpreadResult[] = spreadActivation(topIds);
   542	        if (spreadResults.length > 0) {
   543	          const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
   544	          results = results.map((row) => {
   545	            const boost = spreadMap.get(row.id);
   546	            if (boost !== undefined) {
   547	              const baseScore = resolveBaseScore(row);
   548	              return {
exec
/bin/zsh -lc 'for d in .opencode/skill/system-spec-kit/feature_catalog/04--maintenance .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle .opencode/skill/system-spec-kit/feature_catalog/06--analysis .opencode/skill/system-spec-kit/feature_catalog/07--evaluation .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity; do echo "DIR ${d##*/}"; ls "$d" | sort; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
DIR 04--maintenance
01-workspace-scanning-and-indexing-memoryindexscan.md
02-startup-runtime-compatibility-guards.md
DIR 05--lifecycle
01-checkpoint-creation-checkpointcreate.md
02-checkpoint-listing-checkpointlist.md
03-checkpoint-restore-checkpointrestore.md
04-checkpoint-deletion-checkpointdelete.md
05-async-ingestion-job-lifecycle.md
06-startup-pending-file-recovery.md
07-automatic-archival-subsystem.md
DIR 06--analysis
01-causal-edge-creation-memorycausallink.md
02-causal-graph-statistics-memorycausalstats.md
03-causal-edge-deletion-memorycausalunlink.md
04-causal-chain-tracing-memorydriftwhy.md
05-epistemic-baseline-capture-taskpreflight.md
06-post-task-learning-measurement-taskpostflight.md
07-learning-history-memorygetlearninghistory.md
DIR 07--evaluation
codex
I’ve got enough code evidence for the tricky bug-fix docs now, and I’m doing one consistency sweep across the earlier categories so the final report calls out missing source-file entries wherever the markdown points at the wrong layer.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const roots=[\"04--maintenance\",\"05--lifecycle\",\"06--analysis\",\"07--evaluation\"]; const base=\".opencode/skill/system-spec-kit/feature_catalog\"; for (const r of roots){ for (const f of fs.readdirSync(path.join(base,r)).filter(x=>x.endsWith(\".md\")).sort()){ const s=fs.readFileSync(path.join(base,r,f),\"utf8\"); const m=s.match(/### Implementation\\n([\\s\\S]*?)(?=\\n### |\\n## |"'$)/); const paths=m?[...m[1].matchAll(/`([''^`]+)`/g)].map(x=>x[1]):[]; console.log(r+"/"+f+": "+paths.join(" | ")); } }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/causal-links-processor.ts | mcp_server/handlers/chunking-orchestrator.ts | mcp_server/handlers/handler-utils.ts | mcp_server/handlers/memory-crud-types.ts | mcp_server/handlers/memory-crud-utils.ts | mcp_server/handlers/memory-index-alias.ts | mcp_server/handlers/memory-index-discovery.ts | mcp_server/handlers/memory-index.ts | mcp_server/handlers/memory-save.ts | mcp_server/handlers/mutation-hooks.ts | mcp_server/handlers/pe-gating.ts | mcp_server/handlers/quality-loop.ts | mcp_server/handlers/save/create-record.ts | mcp_server/handlers/save/db-helpers.ts | mcp_server/handlers/save/dedup.ts | mcp_server/handlers/save/embedding-pipeline.ts | mcp_server/handlers/save/index.ts | mcp_server/handlers/save/pe-orchestration.ts | mcp_server/handlers/save/post-insert.ts | mcp_server/handlers/save/reconsolidation-bridge.ts | mcp_server/handlers/save/response-builder.ts | mcp_server/handlers/save/types.ts | mcp_server/handlers/types.ts | mcp_server/hooks/memory-surface.ts | mcp_server/hooks/mutation-feedback.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/cache/tool-cache.ts | mcp_server/lib/chunking/anchor-chunker.ts | mcp_server/lib/chunking/chunk-thinning.ts | mcp_server/lib/cognitive/co-activation.ts | mcp_server/lib/cognitive/fsrs-scheduler.ts | mcp_server/lib/cognitive/prediction-error-gate.ts | mcp_server/lib/cognitive/rollout-policy.ts | mcp_server/lib/config/memory-types.ts | mcp_server/lib/config/type-inference.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/eval/eval-db.ts | mcp_server/lib/extraction/entity-extractor.ts | mcp_server/lib/graph/graph-signals.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/parsing/memory-parser.ts | mcp_server/lib/parsing/trigger-matcher.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/providers/retry-manager.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/importance-tiers.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/encoding-intent.ts | mcp_server/lib/search/entity-linker.ts | mcp_server/lib/search/graph-search-fn.ts | mcp_server/lib/search/memory-summaries.ts | mcp_server/lib/search/retrieval-directives.ts | mcp_server/lib/search/search-flags.ts | mcp_server/lib/search/search-types.ts | mcp_server/lib/search/spec-folder-hierarchy.ts | mcp_server/lib/search/tfidf-summarizer.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/causal-edges.ts | mcp_server/lib/storage/consolidation.ts | mcp_server/lib/storage/incremental-index.ts | mcp_server/lib/storage/mutation-ledger.ts | mcp_server/lib/storage/reconsolidation.ts | mcp_server/lib/storage/transaction-manager.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/lib/validation/preflight.ts | mcp_server/lib/validation/save-quality-gate.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/parsing/quality-extractors.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
04--maintenance/02-startup-runtime-compatibility-guards.md: mcp_server/startup-checks.ts | mcp_server/context-server.ts | mcp_server/cli.ts
05--lifecycle/01-checkpoint-creation-checkpointcreate.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/checkpoints.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/eval/eval-db.ts | mcp_server/lib/eval/ground-truth-feedback.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/parsing/trigger-matcher.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/confidence-tracker.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/scoring/negative-feedback.ts | mcp_server/lib/search/auto-promotion.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/feedback-denylist.ts | mcp_server/lib/search/learned-feedback.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/checkpoints.ts | mcp_server/lib/storage/learned-triggers-schema.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
05--lifecycle/02-checkpoint-listing-checkpointlist.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/checkpoints.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/eval/eval-db.ts | mcp_server/lib/eval/ground-truth-feedback.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/parsing/trigger-matcher.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/confidence-tracker.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/scoring/negative-feedback.ts | mcp_server/lib/search/auto-promotion.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/feedback-denylist.ts | mcp_server/lib/search/learned-feedback.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/checkpoints.ts | mcp_server/lib/storage/learned-triggers-schema.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
05--lifecycle/03-checkpoint-restore-checkpointrestore.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/checkpoints.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/eval/eval-db.ts | mcp_server/lib/eval/ground-truth-feedback.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/parsing/trigger-matcher.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/confidence-tracker.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/scoring/negative-feedback.ts | mcp_server/lib/search/auto-promotion.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/feedback-denylist.ts | mcp_server/lib/search/learned-feedback.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/checkpoints.ts | mcp_server/lib/storage/learned-triggers-schema.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
05--lifecycle/04-checkpoint-deletion-checkpointdelete.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/checkpoints.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/eval/eval-db.ts | mcp_server/lib/eval/ground-truth-feedback.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/parsing/trigger-matcher.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/confidence-tracker.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/scoring/negative-feedback.ts | mcp_server/lib/search/auto-promotion.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/feedback-denylist.ts | mcp_server/lib/search/learned-feedback.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/checkpoints.ts | mcp_server/lib/storage/learned-triggers-schema.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
05--lifecycle/05-async-ingestion-job-lifecycle.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/memory-ingest.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/ops/job-queue.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
05--lifecycle/06-startup-pending-file-recovery.md: mcp_server/lib/storage/transaction-manager.ts | mcp_server/context-server.ts
05--lifecycle/07-automatic-archival-subsystem.md: mcp_server/lib/cognitive/archival-manager.ts | mcp_server/lib/storage/access-tracker.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/sqlite-fts.ts
06--analysis/01-causal-edge-creation-memorycausallink.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/handlers/causal-links-processor.ts | mcp_server/handlers/handler-utils.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/config/memory-types.ts | mcp_server/lib/config/type-inference.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/parsing/memory-parser.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/scoring/importance-tiers.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/graph-search-fn.ts | mcp_server/lib/search/search-types.ts | mcp_server/lib/search/spec-folder-hierarchy.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/causal-edges.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/parsing/quality-extractors.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts
06--analysis/02-causal-graph-statistics-memorycausalstats.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/causal-graph.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/index.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/graph-search-fn.ts | mcp_server/lib/search/search-types.ts | mcp_server/lib/search/spec-folder-hierarchy.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/causal-edges.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
06--analysis/03-causal-edge-deletion-memorycausalunlink.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/handlers/causal-links-processor.ts | mcp_server/handlers/handler-utils.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/config/memory-types.ts | mcp_server/lib/config/type-inference.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/parsing/memory-parser.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/scoring/importance-tiers.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/graph-search-fn.ts | mcp_server/lib/search/search-types.ts | mcp_server/lib/search/spec-folder-hierarchy.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/causal-edges.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/parsing/quality-extractors.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts
06--analysis/04-causal-chain-tracing-memorydriftwhy.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/causal-graph.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/index.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/graph-search-fn.ts | mcp_server/lib/search/search-types.ts | mcp_server/lib/search/spec-folder-hierarchy.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/storage/causal-edges.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
06--analysis/05-epistemic-baseline-capture-taskpreflight.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/session-learning.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/index.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/learning/corrections.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
06--analysis/06-post-task-learning-measurement-taskpostflight.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/session-learning.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/index.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/learning/corrections.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
06--analysis/07-learning-history-memorygetlearninghistory.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/session-learning.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/errors.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/index.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/learning/corrections.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
07--evaluation/01-ablation-studies-evalrunablation.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/eval-reporting.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/cognitive/co-activation.ts | mcp_server/lib/cognitive/rollout-policy.ts | mcp_server/lib/errors.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/index.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/eval/ablation-framework.ts | mcp_server/lib/eval/eval-db.ts | mcp_server/lib/eval/eval-metrics.ts | mcp_server/lib/eval/ground-truth-data.ts | mcp_server/lib/eval/reporting-dashboard.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/scoring/mpab-aggregation.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/channel-enforcement.ts | mcp_server/lib/search/channel-representation.ts | mcp_server/lib/search/confidence-truncation.ts | mcp_server/lib/search/dynamic-token-budget.ts | mcp_server/lib/search/folder-discovery.ts | mcp_server/lib/search/folder-relevance.ts | mcp_server/lib/search/graph-search-fn.ts | mcp_server/lib/search/hybrid-search.ts | mcp_server/lib/search/intent-classifier.ts | mcp_server/lib/search/local-reranker.ts | mcp_server/lib/search/query-classifier.ts | mcp_server/lib/search/query-router.ts | mcp_server/lib/search/search-flags.ts | mcp_server/lib/search/search-types.ts | mcp_server/lib/search/spec-folder-hierarchy.ts | mcp_server/lib/search/sqlite-fts.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/algorithms/adaptive-fusion.ts | shared/algorithms/mmr-reranker.ts | shared/algorithms/rrf-fusion.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
07--evaluation/02-reporting-dashboard-evalreportingdashboard.md: mcp_server/configs/cognitive.ts | mcp_server/core/config.ts | mcp_server/core/db-state.ts | mcp_server/core/index.ts | mcp_server/formatters/token-metrics.ts | mcp_server/handlers/eval-reporting.ts | mcp_server/handlers/types.ts | mcp_server/lib/cache/embedding-cache.ts | mcp_server/lib/cognitive/co-activation.ts | mcp_server/lib/cognitive/rollout-policy.ts | mcp_server/lib/errors.ts | mcp_server/lib/errors/core.ts | mcp_server/lib/errors/index.ts | mcp_server/lib/errors/recovery-hints.ts | mcp_server/lib/eval/ablation-framework.ts | mcp_server/lib/eval/eval-db.ts | mcp_server/lib/eval/eval-metrics.ts | mcp_server/lib/eval/ground-truth-data.ts | mcp_server/lib/eval/reporting-dashboard.ts | mcp_server/lib/interfaces/vector-store.ts | mcp_server/lib/parsing/content-normalizer.ts | mcp_server/lib/providers/embeddings.ts | mcp_server/lib/response/envelope.ts | mcp_server/lib/scoring/interference-scoring.ts | mcp_server/lib/scoring/mpab-aggregation.ts | mcp_server/lib/search/bm25-index.ts | mcp_server/lib/search/channel-enforcement.ts | mcp_server/lib/search/channel-representation.ts | mcp_server/lib/search/confidence-truncation.ts | mcp_server/lib/search/dynamic-token-budget.ts | mcp_server/lib/search/folder-discovery.ts | mcp_server/lib/search/folder-relevance.ts | mcp_server/lib/search/graph-search-fn.ts | mcp_server/lib/search/hybrid-search.ts | mcp_server/lib/search/intent-classifier.ts | mcp_server/lib/search/local-reranker.ts | mcp_server/lib/search/query-classifier.ts | mcp_server/lib/search/query-router.ts | mcp_server/lib/search/search-flags.ts | mcp_server/lib/search/search-types.ts | mcp_server/lib/search/spec-folder-hierarchy.ts | mcp_server/lib/search/sqlite-fts.ts | mcp_server/lib/search/vector-index-aliases.ts | mcp_server/lib/search/vector-index-mutations.ts | mcp_server/lib/search/vector-index-queries.ts | mcp_server/lib/search/vector-index-schema.ts | mcp_server/lib/search/vector-index-store.ts | mcp_server/lib/search/vector-index-types.ts | mcp_server/lib/search/vector-index.ts | mcp_server/lib/utils/canonical-path.ts | mcp_server/lib/utils/format-helpers.ts | mcp_server/lib/utils/logger.ts | mcp_server/lib/utils/path-security.ts | mcp_server/schemas/tool-input-schemas.ts | mcp_server/tool-schemas.ts | mcp_server/utils/batch-processor.ts | mcp_server/utils/db-helpers.ts | mcp_server/utils/index.ts | mcp_server/utils/json-helpers.ts | mcp_server/utils/tool-input-schema.ts | mcp_server/utils/validators.ts | shared/algorithms/adaptive-fusion.ts | shared/algorithms/mmr-reranker.ts | shared/algorithms/rrf-fusion.ts | shared/chunking.ts | shared/config.ts | shared/embeddings.ts | shared/embeddings/factory.ts | shared/embeddings/profile.ts | shared/embeddings/providers/hf-local.ts | shared/embeddings/providers/openai.ts | shared/embeddings/providers/voyage.ts | shared/normalization.ts | shared/types.ts | shared/utils/path-security.ts | shared/utils/retry.ts | shared/utils/token-estimate.ts
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const roots=[\"05--lifecycle\",\"06--analysis\",\"07--evaluation\"]; const base=\".opencode/skill/system-spec-kit/feature_catalog\"; for (const r of roots){ for (const f of fs.readdirSync(path.join(base,r)).filter(x=>x.endsWith(\".md\")).sort()){ const s=fs.readFileSync(path.join(base,r,f),\"utf8\"); const m=s.match(/## Current Reality\\n([\\s\\S]*?)(?=\\n---\\n\\n## Source Files|\\n## Source Files)/); console.log(\"FILE:\",r+\"/\"+f); console.log((m?m[1].trim():\"<none>\").split(\"\\n\").slice(0,12).join(\"\\n\")); console.log(\"---\"); } }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: 05--lifecycle/01-checkpoint-creation-checkpointcreate.md
Named snapshots capture the current memory state by serializing the `memory_index` table, `working_memory` table and vector embeddings from `vec_memories` into a gzip-compressed JSON blob stored in the `checkpoints` table. You can scope a snapshot to a specific spec folder if you only care about preserving one area of the system.

A maximum of 10 checkpoints are retained. When you create the 11th, the oldest is automatically purged. Each checkpoint records arbitrary metadata you provide, plus the current git branch from environment variables. The gzip compression keeps storage manageable even with large memory databases.

Checkpoints are the safety net for destructive operations. `memory_bulk_delete` creates one by default before bulk deletion, unless explicitly skipped for lower-risk tiers. `checkpoint_restore` brings it all back. The cycle works because checkpoints include vector embeddings alongside metadata, so restored memories are immediately searchable without re-running embedding generation.
---
FILE: 05--lifecycle/02-checkpoint-listing-checkpointlist.md
Returns a paginated list of available checkpoints with metadata: name, creation date, spec folder scope, git branch and compressed snapshot size. The actual snapshot data is not included. Results are ordered by creation date, most recent first. Default limit is 50, maximum 100. You can filter by spec folder to see only checkpoints that cover a specific area.
---
FILE: 05--lifecycle/03-checkpoint-restore-checkpointrestore.md
Restoring from a named checkpoint decompresses the gzip snapshot, validates every row against the database schema (a T107 fix that catches corrupted snapshots before they damage the database) and either merges with existing data or clears existing data first.

The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a database transaction. If the restore encounters an error halfway through, the transaction rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is critical because clearing existing data and then failing to restore would leave you with an empty database and no way back.

When merging (the default), the system checks for duplicates using a logical key of `spec_folder + file_path + anchor_id`. Existing memories that match the logical key are skipped rather than duplicated.

After restore, vectors are restored from the checkpoint snapshot when vector payloads are present. The restore handler then clears in-memory search/constitutional caches, rebuilds BM25 from live DB content when BM25 is enabled, and refreshes the trigger cache. This keeps restored memories immediately discoverable without forcing a full re-embedding pass.
---
FILE: 05--lifecycle/04-checkpoint-deletion-checkpointdelete.md
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"), path=require(\"path\"); const roots=[\"04--maintenance\",\"08--bug-fixes-and-data-integrity\"]; const base=\".opencode/skill/system-spec-kit/feature_catalog\"; for (const r of roots){ for (const f of fs.readdirSync(path.join(base,r)).filter(x=>x.endsWith(\".md\")).sort()){ const s=fs.readFileSync(path.join(base,r,f),\"utf8\"); const m=s.match(/## Current Reality\\n([\\s\\S]*?)(?=\\n---\\n\\n## Source Files|\\n## Source Files)/); console.log(\"FILE:\",r+\"/\"+f); console.log((m?m[1].trim():\"<none>\").split(\"\\n\").slice(0,16).join(\"\\n\")); console.log(\"---\"); } }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: 04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md
This is the tool that keeps the memory database synchronized with the filesystem. Without it, new or modified memory files would be invisible to search.

The scanner discovers files from three sources: spec folder memory files (`specs/**/memory/*.md`), constitutional files (`.opencode/skill/*/constitutional/*.md`) and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `handover.md`). Canonical path deduplication prevents the same file from being indexed twice under different paths (the `specs/` vs `.opencode/specs/` symlink problem).

In incremental mode (the default), the scanner categorizes every discovered file into one of four buckets: to-index (new files), to-update (changed content hash), to-skip (unchanged mtime and hash) and to-delete (files that disappeared from disk). Batch processing with configurable `BATCH_SIZE` handles large workspaces. A rate limiter with `INDEX_SCAN_COOLDOWN` prevents rapid repeated scans from exhausting resources, returning an E429 error with a wait time if you scan too frequently.

Each file that passes through to indexing goes through the full `memory_save` pipeline, which means content normalization, quality gating, reconsolidation, chunk thinning and encoding-intent capture all apply automatically. Large files are split into chunks, and anchor-aware chunk thinning drops low-scoring chunks before they enter the index.

After indexing, the tool does more than store data. It creates causal chain edges between spec documents within the same folder (spec leads to plan, plan leads to tasks, tasks lead to checklist, and so on). It detects alias conflicts. It runs divergence reconciliation hooks. It clears the trigger matcher cache if any changes occurred.

A safety invariant protects against silent failures: post-indexing mtime updates happen only for successfully indexed files. If embedding generation fails for a specific file, that file retains its old mtime so the next scan automatically retries it. You do not have to track which files failed. The system tracks it for you.

The result breakdown is detailed: indexed count, updated count, unchanged count, failed count, skipped-by-mtime count, skipped-by-hash count, constitutional stats, dedup stats and incremental stats. Debug mode (`SPECKIT_DEBUG_INDEX_SCAN=true`) exposes additional file count diagnostics.
---
FILE: 04--maintenance/02-startup-runtime-compatibility-guards.md
The startup checks module (`startup-checks.ts`) runs non-critical compatibility validation when the MCP server initializes. The primary guard is Node.js version mismatch detection: the server writes a `.node-version-marker` file containing the Node version, module ABI version, platform, and architecture at build time. On startup, it compares the current runtime's `process.versions.modules` against the marker. A mismatch indicates that native modules (like `better-sqlite3` or `sqlite-vec`) were compiled for a different Node version and may crash at runtime, prompting a clear warning before the crash occurs.

These guards are extracted from the main `context-server.ts` (T303) to keep the startup path modular. Additional startup checks can be added to this module without cluttering the server initialization logic. All checks are non-blocking — they emit warnings but do not prevent server startup.
---
exec
/bin/zsh -lc "rg -n \"MAX_CHECKPOINTS|createCheckpoint\\(|listCheckpoints\\(|restoreCheckpoint\\(|deleteCheckpoint\\(|limit > 100|safetyConfirmationUsed|clearSearchCache|clearConstitutionalCache|refreshTriggerCache\" .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "archival_stats|is_archived|removeDocument|unarchive|last_accessed|access_count|shouldArchive|startBackgroundArchivalJob|stopBackgroundArchivalJob|vector" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "findPendingFiles|recoverPendingFile|original exists and is newer|deleted pending|totalRecoveries|pendingSuffix|recursive readdir" .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:21:const MAX_CHECKPOINTS = 10;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:376:function createCheckpoint(options: CreateCheckpointOptions = {}): CheckpointInfo | null {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:488:      if (checkpointCount.count > MAX_CHECKPOINTS) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:493:        `).run(checkpointCount.count - MAX_CHECKPOINTS);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:517:function listCheckpoints(specFolder: string | null = null, limit: number = 50): CheckpointInfo[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:564:function restoreCheckpoint(nameOrId: string | number, clearExisting: boolean = false): RestoreResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:939:function deleteCheckpoint(nameOrId: string | number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:960:  MAX_CHECKPOINTS,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:107:  const result = checkpoints.createCheckpoint({ name, specFolder: spec_folder, metadata });
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:159:  const results = checkpoints.listCheckpoints(spec_folder ?? null, limit);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:193:  const result = checkpoints.restoreCheckpoint(name, clear_existing);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:202:      vectorIndex.clearConstitutionalCache(null);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:203:      vectorIndex.clearSearchCache(null);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:210:      triggerMatcher.refreshTriggerCache();
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:289:  const success: boolean = checkpoints.deleteCheckpoint(name);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:300:      safetyConfirmationUsed: true,
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:5:// TypeScript port of the vector index implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:23:import { IVectorStore } from '../interfaces/vector-store';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:30:} from './vector-index-types';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:34:} from './vector-index-schema';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:52:  console.warn(`[vector-index] Failed to read search-weights.json: ${error instanceof Error ? error.message : String(error)}. Using defaults.`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:55:/** Loaded search weight configuration for vector-index ranking. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:68:  access_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:69:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:117:/** Default embedding dimension used by the vector index. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:142:    console.warn('[vector-index] Could not get embedding dimension from profile:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:161:  console.warn('[vector-index] Using default dimension 768 after timeout');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:166: * Validates that stored vector dimensions match the provider.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:195:      const warning = `DIMENSION MISMATCH: Database has ${stored_dim}-dim vectors, but provider expects ${current_dim}. ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:198:      console.error(`[vector-index] WARNING: ${warning}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:204:    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:217:/** Default path for the vector-index database file. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:275:      console.warn(`[vector-index] Could not read file ${valid_path}: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:308:        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:315:    console.warn(`[vector-index] JSON parse error: ${get_error_message(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:355:    console.warn('[vector-index] Cache validation error:', get_error_message(e));
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:417:async function recoverPendingFiles(basePath: string): Promise<PendingRecoveryResult> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:492:    await recoverPendingFiles(basePath);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:525:    if (metrics.totalRecoveries > 0 || metrics.totalErrors > 0) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:526:      console.error(`[context-server] Atomicity metrics: ${metrics.totalAtomicWrites} successful, ${metrics.totalErrors} failed, ${metrics.totalRecoveries} recovered`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:25:  totalRecoveries: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:52:  totalRecoveries: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:70:  metrics.totalRecoveries = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:294:function findPendingFiles(dirPath: string): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:302:      // AI-WHY: Node 18 compatibility fallback when recursive readdir is unavailable.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:309:    console.warn(`[transaction-manager] findPendingFiles error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:317:function recoverPendingFile(pendingPath: string): RecoveryResult {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:321:    // If original exists and is newer, delete pending
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:334:    metrics.totalRecoveries++;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:349:  const pendingFiles = findPendingFiles(dirPath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:350:  return pendingFiles.map(recoverPendingFile);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:377:  findPendingFiles,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:378:  recoverPendingFile,
exec
/bin/zsh -lc "rg -n \"UNIQUE \\(spec_folder, task_id\\)|preflight|complete|Learning Index|onlyComplete|includeSummary|limit > 100|limit < 1\" .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "groundTruthQueryIds|recallK|storeResults|includeFormattedReport|negative.*eval_run_id|sign test|eval_metric_snapshots|delta|SPECKIT_ABLATION" .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "eval_metric_snapshots|eval_channel_results|eval_final_results|formatReportText|SPECKIT_DASHBOARD_LIMIT|markdown|plain text|summary paragraph|trend" .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
44:  onlyComplete?: boolean;
45:  includeSummary?: boolean;
70:    phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
92:    completed_at TEXT,
153:/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
192:    if (existing.phase === 'complete') {
195:        `Learning record already exists and is complete for spec_folder="${spec_folder}", task_id="${taskId}" (id=${existing.id}). Completed records cannot be overwritten.`,
199:    // Phase is 'preflight' — allow re-recording baseline (UPDATE, not replace)
220:        tool: 'task_preflight',
228:            phase: 'preflight',
237:          note: 'Existing preflight record was updated (not replaced)'
242:      throw new MemoryError(ErrorCodes.DATABASE_ERROR, `Failed to update preflight record: ${message}`, {});
249:    VALUES (?, ?, 'preflight', ?, ?, ?, ?, ?, ?, ?)
269:      tool: 'task_preflight',
277:          phase: 'preflight',
294:    console.error('[session-learning] Failed to insert preflight record:', message);
295:    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to store preflight record', { originalError: message });
336:  // both 'preflight' (first postflight) and 'complete' (re-posted postflight) records.
337:  const preflightRecord = database.prepare(`
339:    WHERE spec_folder = ? AND task_id = ? AND phase IN ('preflight', 'complete')
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:31:  groundTruthQueryIds?: number[];
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:32:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:33:  storeResults?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:34:  includeFormattedReport?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:59:      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:60:      { flag: 'SPECKIT_ABLATION' }
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:76:  const recallK = typeof args.recallK === 'number' && Number.isFinite(args.recallK)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:77:    ? Math.max(1, Math.floor(args.recallK))
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:85:      // AI-WHY: Fix #33 (017-refinement-phase-6) — Use recallK, not hardcoded 20
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:86:      limit: recallK,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:104:    groundTruthQueryIds: args.groundTruthQueryIds,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:105:    recallK,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:116:  const shouldStore = args.storeResults !== false;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:118:  const formatted = args.includeFormattedReport === false ? null : formatAblationReport(report);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:130:        ? (stored ? 'Ablation metrics stored to eval_metric_snapshots' : 'Ablation metrics storage failed')
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:131:        : 'Ablation metrics were not persisted (storeResults=false)',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:7:// delta against a full-pipeline baseline, and attributes per-channel
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:15:// - Results storage in eval_metric_snapshots table
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:19:// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:42: * Returns true only when SPECKIT_ABLATION=true (case-insensitive).
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:24:  formatReportText,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:130:        ? (stored ? 'Ablation metrics stored to eval_metric_snapshots' : 'Ablation metrics storage failed')
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:147:  const formatted = format === 'json' ? formatReportJSON(report) : formatReportText(report);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:6:// trend analysis, and formatted report output.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:8:// Uses: eval-db.ts singleton, eval_metric_snapshots table,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:9://       eval_channel_results table, eval_final_results table.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:24:const DASHBOARD_ROW_LIMIT = Math.max(1, parseInt(process.env.SPECKIT_DASHBOARD_LIMIT ?? '10000', 10) || 10000);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:76:/** A single trend data point comparing consecutive runs. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:107:  trends: TrendEntry[];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:108:  /** Human-readable summary paragraph. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:124:/** Row shape from eval_metric_snapshots. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:136:/** Row shape from eval_channel_results. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:167: * Used for trend direction interpretation.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:186:             FROM eval_metric_snapshots
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:227:             FROM eval_channel_results
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:248:    `SELECT COUNT(DISTINCT eval_run_id) as cnt FROM eval_metric_snapshots`
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:258:    `SELECT COUNT(*) as cnt FROM eval_metric_snapshots`
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:398: * Compute trend entries by comparing metrics across consecutive sprint reports.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:404:  const trends: TrendEntry[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:438:      trends.push({
exec
/bin/zsh -lc 'rg -n "INDEX_SCAN_COOLDOWN|E429|specDocsEnabled|includeConstitutional|includeSpecDocs|toUpdate|mtime|pending status|deleteStaleIndexRows|createSpecDocumentChain|refreshTriggerCache|SPECKIT_DEBUG_INDEX_SCAN" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts | sed -n '22,85p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '684,686p;826,827p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/cli.ts | sed -n '456,460p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:20:const MTIME_FAST_PATH_MS = 1000; // Skip if mtime within 1 second
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:28:  mtime: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:36:  file_mtime_ms: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:45:  toUpdate: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:97:      mtime: stats.mtimeMs,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:104:      mtime: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:119:          SELECT file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:126:          SELECT file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:160:  // Path 3: No stored mtime (legacy entry, needs re-indexing)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:161:  if (stored.file_mtime_ms === null) return 'reindex';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:164:  if (Math.abs(fileInfo.mtime - stored.file_mtime_ms) < MTIME_FAST_PATH_MS) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:180:function updateFileMtime(filePath: string, mtimeMs: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:189:          SET file_mtime_ms = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:191:        `) as Database.Statement).run(mtimeMs, canonicalPath, filePath)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:194:          SET file_mtime_ms = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:196:        `) as Database.Statement).run(mtimeMs, filePath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:209:  return updateFileMtime(filePath, fileInfo.mtime);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:219:    toUpdate: [],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:233:        result.toUpdate.push(filePath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:12:import { INDEX_SCAN_COOLDOWN, DEFAULT_BASE_PATH, BATCH_SIZE } from '../core/config';
 succeeded in 52ms:
    22	/** Logs a warning when the active Node.js version differs from the project marker. */
    23	export function detectNodeVersionMismatch(): void {
    24	  try {
    25	    const markerPath = path.resolve(__dirname, '../.node-version-marker');
    26	
    27	    if (fs.existsSync(markerPath)) {
    28	      const raw = fs.readFileSync(markerPath, 'utf8');
    29	      const marker: NodeVersionMarker = JSON.parse(raw);
    30	
    31	      if (marker.moduleVersion !== process.versions.modules) {
    32	        console.error('[context-server] \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
    33	        console.error('[context-server] \u2551  WARNING: Node.js version changed since last install    \u2551');
    34	        console.error('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
    35	        console.error(`[context-server] \u2551  Installed: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`.padEnd(59) + '\u2551');
    36	        console.error(`[context-server] \u2551  Running:   Node ${process.version} (MODULE_VERSION ${process.versions.modules})`.padEnd(59) + '\u2551');
    37	        console.error('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
    38	        console.error('[context-server] \u2551  Native modules may crash. Run:                         \u2551');
    39	        console.error('[context-server] \u2551  bash scripts/setup/rebuild-native-modules.sh           \u2551');
    40	        console.error('[context-server] \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d');
    41	      } else {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | sed -n '147,183p;214,247p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts | sed -n '48,84p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   147	  // Return one candidate entry per memory node (source_id and target_id) with
   148	  // numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
   149	  // pipeline (MMR reranking filters with typeof id === 'number').
   150	  const candidates: Array<Record<string, unknown>> = [];
   151	  for (const row of rows) {
   152	    const score = typeof row.strength === 'number'
   153	      ? Math.min(1, Math.max(0, row.strength))
   154	      : 0;
   155	    const title = `${row.source_id} -> ${row.target_id}`;
   156	
   157	    const sourceNum = Number(row.source_id);
   158	    if (!Number.isNaN(sourceNum)) {
   159	      candidates.push({
   160	        id: sourceNum,
   161	        score,
   162	        source: 'graph' as const,
   163	        title,
   164	        relation: row.relation,
   165	        sourceId: row.source_id,
   166	        targetId: row.target_id,
 succeeded in 51ms:
    48	  it('G1: returns numeric IDs (source_id) — not string-prefixed mem:edgeId', () => {
    49	    mockAll.mockReturnValue([makeCausalRow({ source_id: '42', target_id: '99', id: 'edge-001' })]);
    50	
    51	    const searchFn = createUnifiedGraphSearchFn(mockDb);
    52	    const results = searchFn('memory', { limit: 5 });
    53	
    54	    // Must have at least one result with numeric source_id
    55	    const sourceResult = results.find(r => r['id'] === 42);
    56	    expect(sourceResult).toBeDefined();
    57	    expect(typeof sourceResult!['id']).toBe('number');
    58	  });
    59	
    60	  it('G1: returns numeric target_id as a separate candidate', () => {
    61	    mockAll.mockReturnValue([makeCausalRow({ source_id: '42', target_id: '99', id: 'edge-001' })]);
    62	
    63	    const searchFn = createUnifiedGraphSearchFn(mockDb);
    64	    const results = searchFn('memory', { limit: 5 });
    65	
    66	    const targetResult = results.find(r => r['id'] === 99);
    67	    expect(targetResult).toBeDefined();
exec
/bin/zsh -lc "rg -n \"memory_ingest_start|memory_ingest_status|memory_ingest_cancel|initIngestJobQueue\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:97:import { initIngestJobQueue } from './lib/ops/job-queue';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:942:      const ingestInit = initIngestJobQueue({
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:401:  name: 'memory_ingest_start',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:424:  name: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:437:  name: 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:126:      tool: 'memory_ingest_start',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:153:    tool: 'memory_ingest_start',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:161:      'Use memory_ingest_status with jobId to poll progress',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:162:      'Use memory_ingest_cancel with jobId to stop processing',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:177:      tool: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:183:        actions: ['Call memory_ingest_start to create a new ingest job'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:190:    tool: 'memory_ingest_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:206:      tool: 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:212:        actions: ['Call memory_ingest_status with a known jobId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:220:      tool: 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:229:    tool: 'memory_ingest_cancel',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:235:const handle_memory_ingest_start = handleMemoryIngestStart;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:236:const handle_memory_ingest_status = handleMemoryIngestStatus;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:237:const handle_memory_ingest_cancel = handleMemoryIngestCancel;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:243:  handle_memory_ingest_start,
exec
/bin/zsh -lc 'rg -n "findPendingFiles|recoverPendingFile|pending" .opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager*.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:635:    it('T000d: response stays non-blocking while callback is pending', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1543:    // T63: recoverPendingFiles function exists
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1544:    it('T63: recoverPendingFiles() defined', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1545:      expect(sourceCode).toMatch(/async\s+function\s+recoverPendingFiles/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1549:    it('T64: recoverPendingFiles called in startupScan', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1550:      expect(sourceCode).toMatch(/await\s+recoverPendingFiles\(basePath\)/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1561:      const recoveryCatch = /recoverPendingFiles[\s\S]*?catch\s*\(error/
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:16:  findPendingFiles,
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:17:  recoverPendingFile,
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:58:    const pending = getPendingPath(original);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:60:    expect(pending).toBe('/path/to/memory/file_pending.md');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:62:    const recovered = getOriginalPath(pending);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:65:    expect(isPendingFile(pending)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:122:  it('Execute atomic save with pending file cleanup on failure', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:123:    setup('save-pending');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:124:    const filePath = path.join(TEST_DIR!, 'memory', 'pending.md');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:125:    const content = '# Test Memory\n\nContent for pending test.';
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:134:    const pendingPath = getPendingPath(filePath);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:135:    expect(fs.existsSync(pendingPath)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:138:  it('Find pending files', () => {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts | sed -n '398,456p;470,503p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   398	      // Snapshot vectors from vec_memories when enabled/available.
   399	      // This preserves semantic search state across clearExisting restores.
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
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '248,309p;367,407p;486,506p;532,607p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
   248	    const protectedList = ARCHIVAL_CONFIG.protectedTiers.map(() => '?').join(',');
   249	
   250	    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
   251	    const rows = (db.prepare(`
   252	      SELECT *
   253	      FROM memory_index
   254	      WHERE (is_archived IS NULL OR is_archived = 0)
   255	        AND importance_tier NOT IN (${protectedList})
   256	        AND is_pinned = 0
   257	      ORDER BY last_accessed ASC NULLS FIRST, access_count ASC
   258	      LIMIT ?
   259	    `) as Database.Statement).all(
   260	      ...ARCHIVAL_CONFIG.protectedTiers,
   261	      limit * 3  // Fetch extra since FSRS will filter further
   262	    ) as Array<Record<string, unknown>>;
   263	
   264	    // Use FSRS-based tier classifier as authoritative archival decision
   265	    const classifier = getTierClassifier();
   266	    const cutoffDate = new Date();
   267	    cutoffDate.setDate(cutoffDate.getDate() - ARCHIVAL_CONFIG.maxAgeDays);
exec
/bin/zsh -lc 'test -f .opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts && echo exists' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
exists
exec
/bin/zsh -lc 'rg -n "createSpecDocumentChain|checklist|decision-record|implementation-summary|support" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
21:  SUPPORTS: 'supports',
34:  supports:     1.0,  // Neutral / default
601: * Also: checklist SUPPORTS spec, decision-record SUPPORTS plan, research SUPPORTS spec
605:function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
630:  if (ids.checklist && ids.spec) {
631:    edges.push({ sourceId: String(ids.checklist), targetId: String(ids.spec), relation: RELATION_TYPES.SUPPORTS, strength: 0.7, evidence: 'Spec 126: checklist supports spec' });
634:    edges.push({ sourceId: String(ids.decision_record), targetId: String(ids.plan), relation: RELATION_TYPES.SUPPORTS, strength: 0.8, evidence: 'Spec 126: decision-record supports plan' });
637:    edges.push({ sourceId: String(ids.research), targetId: String(ids.spec), relation: RELATION_TYPES.SUPPORTS, strength: 0.7, evidence: 'Spec 126: research supports spec' });
810:  createSpecDocumentChain,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '605,638p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   605	function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
   606	  if (!db) return { inserted: 0, failed: 0 };
   607	
   608	  const edges: Array<{
   609	    sourceId: string;
   610	    targetId: string;
   611	    relation: RelationType;
   612	    strength?: number;
   613	    evidence?: string | null;
   614	  }> = [];
   615	
   616	  const ids = documentIds;
   617	
   618	  // Primary chain: spec -> plan -> tasks -> implementation_summary
   619	  if (ids.spec && ids.plan) {
   620	    edges.push({ sourceId: String(ids.spec), targetId: String(ids.plan), relation: RELATION_TYPES.CAUSED, strength: 0.9, evidence: 'Spec 126: spec -> plan chain' });
   621	  }
   622	  if (ids.plan && ids.tasks) {
   623	    edges.push({ sourceId: String(ids.plan), targetId: String(ids.tasks), relation: RELATION_TYPES.CAUSED, strength: 0.9, evidence: 'Spec 126: plan -> tasks chain' });
   624	  }
exec
/bin/zsh -lc 'rg -n "last_accessed|created_by|MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH|weight_history|ON CONFLICT DO UPDATE" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
43:const MAX_EDGES_PER_NODE = 20;
44:const MAX_AUTO_STRENGTH = 0.5;
62:  created_by: string;
63:  last_accessed: string | null;
145:  // NFR-R01: Auto edges capped at MAX_AUTO_STRENGTH
147:    ? Math.min(strength, MAX_AUTO_STRENGTH)
158:  // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
161:    if (edgeCount >= MAX_EDGES_PER_NODE) {
162:      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
172:      // AI-WHY: Check if edge exists (for weight_history logging on conflict update).
174:      // to write a weight_history row after the upsert. The subsequent INSERT
182:        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
446:      // T001d: Capture old strength for weight_history logging
463:      // T001d: Log weight change to weight_history
659:      INSERT INTO weight_history (edge_id, old_strength, new_strength, changed_by, reason)
672:      SELECT * FROM weight_history WHERE edge_id = ? ORDER BY changed_at DESC LIMIT ?
696:        SELECT old_strength FROM weight_history
704:          SELECT old_strength FROM weight_history
757:      "UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?"
769:      WHERE (last_accessed IS NULL AND extracted_at < datetime('now', '-' || ? || ' days'))
exec
/bin/zsh -lc "rg -n \"checkpoint_create|createCheckpoint\\(|before bulk deletion|skipCheckpoint|memory_bulk_delete|checkpoint\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts .opencode/skill/system-spec-kit/mcp_server -g 'memory-bulk-delete.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:11:import * as checkpoints from '../lib/storage/checkpoints';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:32:  skipCheckpoint?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:42:  const { tier, specFolder, confirm, olderThanDays, skipCheckpoint = false } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:63:  if ((tier === 'constitutional' || tier === 'critical') && skipCheckpoint) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:64:    throw new Error(`skipCheckpoint is not allowed for "${tier}" tier. Checkpoint is mandatory for high-safety tiers.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:95:      tool: 'memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:102:  // Create auto-checkpoint before bulk deletion (unless explicitly skipped)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:103:  let checkpointName: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:104:  if (!skipCheckpoint) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:109:      const checkpoint = checkpoints.createCheckpoint({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:113:          reason: `auto-checkpoint before bulk delete of ${affectedCount} "${tier}" memories`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:120:      if (!checkpoint) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:121:        const checkpointError = `Checkpoint creation failed before deleting ${tier} memories`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:123:          throw new Error(`${checkpointError}. Aborting high-safety bulk delete.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:125:        console.warn(`[memory-bulk-delete] ${checkpointError}. Proceeding without rollback.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:127:        checkpointName = checkpoint.name;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:128:        console.error(`[memory-bulk-delete] Created checkpoint: ${checkpointName}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:132:      console.error(`[memory-bulk-delete] Failed to create checkpoint: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:133:      // High-safety tiers require a valid checkpoint.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:135:        throw new Error(`Failed to create mandatory checkpoint for "${tier}" tier: ${message}`);
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\");const s=fs.readFileSync(\".opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md\",\"utf8\");const rels=[...s.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]).filter(p=>/''^(mcp_server|shared|scripts)'"\\//.test(p));console.log(rels.length)'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
181
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const roots=[\"04--maintenance\",\"05--lifecycle\",\"06--analysis\",\"07--evaluation\",\"08--bug-fixes-and-data-integrity\"];const base=\".opencode/skill/system-spec-kit/feature_catalog\";for(const r of roots){for(const f of fs.readdirSync(path.join(base,r)).filter(x=>x.endsWith(\".md\")).sort()){const s=fs.readFileSync(path.join(base,r,f),\"utf8\");const n=[...s.matchAll(/"'`([''^`]+)`/g)].map(m=>m[1]).filter(p=>/''^(mcp_server|shared|scripts)'"\\//.test(p)).length;if(n>=100)console.log(r+\"/\"+f+\" => \"+n);}}'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md => 181
05--lifecycle/01-checkpoint-creation-checkpointcreate.md => 106
05--lifecycle/02-checkpoint-listing-checkpointlist.md => 105
05--lifecycle/03-checkpoint-restore-checkpointrestore.md => 105
05--lifecycle/04-checkpoint-deletion-checkpointdelete.md => 105
07--evaluation/01-ablation-studies-evalrunablation.md => 149
07--evaluation/02-reporting-dashboard-evalreportingdashboard.md => 149
exec
/bin/zsh -lc 'rg -n "includeArchived|is_archived" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:130:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:269:  includeArchived: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:296:  includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:321:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:611:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:743:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:788:          includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:69:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:325: * @param options - Optional limit, specFolder filter, and includeArchived flag.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:330:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:334:  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:340:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:341:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:361: * @param options - Optional limit, specFolder filter, and includeArchived flag.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:366:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:413:    includeArchived = false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:426:        includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:444:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:594:          includeArchived: options.includeArchived || false,
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | rg 'causal'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | rg 'ablation|dashboard|eval-reporting|reporting-dashboard'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | rg 'checkpoint'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | rg 'archiv'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | rg 'hybrid-search|stage3|mpab|chunk'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts
exec
/bin/zsh -lc 'rg -n "handleMemoryCausalLink|handleMemoryCausalStats|handleMemoryCausalUnlink|handleMemoryDriftWhy" .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
242:async function handleMemoryDriftWhy(args: DriftWhyArgs): Promise<MCPResponse> {
431:async function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse> {
549:async function handleMemoryCausalStats(_args: CausalStatsArgs): Promise<MCPResponse> {
643:async function handleMemoryCausalUnlink(args: CausalUnlinkArgs): Promise<MCPResponse> {
717:  handleMemoryDriftWhy,
718:  handleMemoryCausalLink,
719:  handleMemoryCausalStats,
720:  handleMemoryCausalUnlink,
724:const handle_memory_drift_why = handleMemoryDriftWhy;
725:const handle_memory_causal_link = handleMemoryCausalLink;
726:const handle_memory_causal_stats = handleMemoryCausalStats;
727:const handle_memory_causal_unlink = handleMemoryCausalUnlink;
exec
/bin/zsh -lc "rg -n \"insertEdge\\(|getGraphStats\\(|deleteEdge\\(|traceCausalChain\\(|insertEdgesBatch\\(|createSpecDocumentChain\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
130:function insertEdge(
214:function insertEdgesBatch(
231:      const id = insertEdge(
486:function deleteEdge(edgeId: number): boolean {
527:function getGraphStats(): GraphStats {
582:        if (deleteEdge(edge.id)) count++;
605:function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
642:  return insertEdgesBatch(edges);
exec
/bin/zsh -lc "rg -n \"traceCausalChain\\(|includeMemoryDetails|maxDepthReached|relatedMemories|allEdges\" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:57:  includeMemoryDetails?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:248:    includeMemoryDetails = true
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:324:    const relatedMemories: Record<string, Record<string, unknown>> = {};
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:326:    if (includeMemoryDetails) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:353:            relatedMemories[id] = memory;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:405:        allEdges: chain.all,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:407:        maxDepthReached: chain.max_depth_reached,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:408:        relatedMemories: Object.keys(relatedMemories).length > 0 ? relatedMemories : null,
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/tests | rg 'session-learning|learning-history|preflight|postflight'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts
codex
Scope note: I validated every listed path on disk. For the 7 docs with 100+ refs (`04/01`, `05/01-04`, `07/01-02`), I behavior-checked the primary implementation files plus the most relevant feature tests as a representative sample, per your instruction.

---
FEATURE: 01-workspace-scanning-and-indexing-memoryindexscan.md
CATEGORY: 04--maintenance
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: `toUpdate` is mtime/legacy-entry driven, not purely “changed content hash”; spec-doc auto-linking is `spec -> plan -> tasks -> implementation-summary`, while `checklist`, `decision-record`, and `research` are `supports` edges, not the same primary chain.
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Supports `specFolder`, `includeConstitutional`, `includeSpecDocs`, and `force`; can prune stale index rows and expose extra diagnostics with `SPECKIT_DEBUG_INDEX_SCAN=true`.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `incremental-index.ts:160-164,233`; `memory-index.ts:143-169,446-472`; `causal-edges.ts:618-637`.

---
FEATURE: 02-startup-runtime-compatibility-guards.md
CATEGORY: 04--maintenance
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Omits the SQLite minimum-version guard; the module also auto-creates `.node-version-marker` when it does not exist.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Marker auto-creation for future ABI checks.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: `startup-checks.ts:44-55,66-85`; `context-server.ts:826-827`; `cli.ts:459-460`.

---
FEATURE: 01-checkpoint-creation-checkpointcreate.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/handlers/memory-bulk-delete.ts`, `mcp_server/tests/handler-checkpoints.vitest.ts`, `mcp_server/tests/checkpoints-storage.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Scoped checkpoints also snapshot `causal_edges` and `working_memory`, not just `memory_index` and vectors.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `checkpoints.ts:398-456,488-503`; `memory-bulk-delete.ts:102-109`.

---
FEATURE: 02-checkpoint-listing-checkpointlist.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-checkpoints.vitest.ts`, `mcp_server/tests/checkpoint-limit.vitest.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/checkpoints.ts:159`; `checkpoints.ts:517`.

---
FEATURE: 03-checkpoint-restore-checkpointrestore.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-checkpoints.vitest.ts`, `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/checkpoints.ts:193-210`; `checkpoints.ts:564`.

---
FEATURE: 04-checkpoint-deletion-checkpointdelete.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-checkpoints.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Response includes `safetyConfirmationUsed: true`.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/checkpoints.ts:289-300`; `checkpoints.ts:939`.

---
FEATURE: 05-async-ingestion-job-lifecycle.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/context-server.ts`, `mcp_server/tools/lifecycle-tools.ts`, `mcp_server/tests/job-queue.vitest.ts`, `mcp_server/tests/handler-memory-ingest.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Strict path/root validation, startup crash-recovery requeue, and capped per-job error capture.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `job-queue.ts:13-20,181-207,505-516`; `memory-ingest.ts:90-139,235-245`; `context-server.ts:942`.

---
FEATURE: 06-startup-pending-file-recovery.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Recovery does not inspect DB commit state or leave stale pending files for manual review; it renames pending files back, or deletes the pending copy only when the original exists and is newer.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/tests/transaction-manager.vitest.ts`, `mcp_server/tests/context-server.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Startup scan is restricted to spec/constitutional roots and has a Node 18 recursive-read fallback.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `transaction-manager.ts:317-341`; `context-server.ts:417-445`; `transaction-manager.vitest.ts:138-199`.

---
FEATURE: 07-automatic-archival-subsystem.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Code only syncs BM25 removal/re-addition, not vector embedding deletion; dormancy uses `memory_index.last_accessed`/`access_count` plus `classifier.shouldArchive()`, not `access-tracker.ts` or `last_access_at`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/tests/archival-manager.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Supports unarchive, persistent `archival_stats`, and background job start/stop/stats APIs.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `archival-manager.ts:250-299,367-403,486-503,532-607`; `memory-search.ts:611`; `hybrid-search.ts:334-341`; `vector-index-store.ts:451`.

---
FEATURE: 01-causal-edge-creation-memorycausallink.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/handlers/causal-graph.ts`, `mcp_server/tests/handler-causal-graph.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Validates relation/IDs at handler level, rejects self-loops in storage, and returns follow-up hints.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `causal-graph.ts:431-531`; `causal-edges.ts:130-206,214-231,605-642`.

---
FEATURE: 02-causal-graph-statistics-memorycausalstats.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-causal-graph.vitest.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `causal-graph.ts:549-625`; `causal-edges.ts:527-591`.

---
FEATURE: 03-causal-edge-deletion-memorycausalunlink.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/handlers/causal-graph.ts`, `mcp_server/tests/handler-causal-graph.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Automatic edge cleanup during memory deletion is implemented in `vector-index-mutations.ts`, not just the causal-edges helper.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `causal-graph.ts:643-709`; `causal-edges.ts:486-520`; `vector-index-mutations.ts:375-384`.

---
FEATURE: 04-causal-chain-tracing-memorydriftwhy.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-causal-graph.vitest.ts`
UNDOCUMENTED_CAPABILITIES: `includeMemoryDetails` defaults to true and the response includes `allEdges`, `relatedMemories`, and `maxDepthReached`.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `causal-graph.ts:242-413`; `causal-graph.ts:248,324-408`.

---
FEATURE: 05-epistemic-baseline-capture-taskpreflight.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-session-learning.vitest.ts`, `mcp_server/tests/preflight.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Validates all three scores as `0..100` before storing the record.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `session-learning.ts:70,153-237`; `session-learning.ts:128-147`.

---
FEATURE: 06-post-task-learning-measurement-taskpostflight.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-session-learning.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Can correct an already-complete learning record by updating the existing row.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `session-learning.ts:336-354,378-403`.

---
FEATURE: 07-learning-history-memorygetlearninghistory.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-session-learning.vitest.ts`, `mcp_server/tests/integration-learning-history.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Supports `includeSummary` and clamps result limits.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `session-learning.ts:474-482,563-632`.

---
FEATURE: 01-ablation-studies-evalrunablation.md
CATEGORY: 07--evaluation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/ablation-framework.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Supports `groundTruthQueryIds`, configurable `recallK`, optional persistence, optional formatted report output, and stores multi-metric deltas beyond Recall@K.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `eval-reporting.ts:31-34,59-60,104-118`; `ablation-framework.ts:366,502-589`.

---
FEATURE: 02-reporting-dashboard-evalreportingdashboard.md
CATEGORY: 07--evaluation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The dashboard queries `eval_metric_snapshots` and `eval_channel_results`, not `eval_final_results`; `formatReportText()` emits plain text, not markdown-formatted output.
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/reporting-dashboard.vitest.ts`
UNDOCUMENTED_CAPABILITIES: `SPECKIT_DASHBOARD_LIMIT` row cap and generated summary paragraph.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `reporting-dashboard.ts:186-227,552-574`; `handlers/eval-reporting.ts:147`.

---
FEATURE: 01-graph-channel-id-fix.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Graph search also applies hierarchy-aware spec-folder augmentation.
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `graph-search-fn.ts:147-183,214-247`; `graph-search-fn.vitest.ts:48-79`.

---
FEATURE: 02-chunk-collapse-deduplication.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/pipeline/stage3-rerank.ts`, `mcp_server/tests/hybrid-search.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Stage 3 also reassembles parent content and marks `contentSource` fallback provenance.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `hybrid-search.ts:731-769`; `stage3-rerank.ts:202-210,411-430`; `memory-search.ts:376-509`.

---
FEATURE: 03-co-activation-fan-effect-divisor.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/search/pipeline/stage2-fusion.ts`
UNDOCUMENTED_CAPABILITIES: Related-memory lookups are cached for 30 seconds to bound repeated traversal cost.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `co-activation.ts:84-97,103-119`; `hybrid-search.ts:907-915`; `stage2-fusion.ts:541-550`.

---
FEATURE: 04-sha-256-content-hash-deduplication.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/memory-save.ts`
UNDOCUMENTED_CAPABILITIES: Dedup also catches identical content saved under a different file path in the same spec folder; pending rows are excluded and `force` bypasses dedup.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `dedup.ts:18-27,50-72`; `memory-save.ts:174-180`; `content-hash-dedup.vitest.ts:124-180`.

---
FEATURE: 05-database-and-schema-safety.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The source-file list does not point at the actual fix locations; B3 references a parenthesized delete predicate that is not present in current `causal-edges.ts`; B4’s `.changes > 0` guards are in `vector-index-mutations.ts`, not `memory-save.ts`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/storage/reconsolidation.ts`, `mcp_server/lib/storage/checkpoints.ts`, `mcp_server/lib/storage/causal-edges.ts`, `mcp_server/lib/search/vector-index-mutations.ts`, `mcp_server/tests/reconsolidation.vitest.ts`, `mcp_server/tests/checkpoints-storage.vitest.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P0
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `reconsolidation.ts:202-204`; `checkpoints.ts:640-646`; `causal-edges.ts:508-511`; `vector-index-mutations.ts:503-536`.

---
FEATURE: 06-guards-and-edge-cases.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/cognitive/temporal-contiguity.ts`, `mcp_server/lib/extraction/extraction-adapter.ts`, `mcp_server/tests/temporal-contiguity.vitest.ts`, `mcp_server/tests/extraction-adapter.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Extraction adapter also rejects unsafe regexes and applies redaction gating before writing extracted summaries.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `temporal-contiguity.ts:69-70`; `extraction-adapter.ts:183-206`.

---
FEATURE: 07-canonical-id-dedup-hardening.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/tests/hybrid-search.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Canonical ID normalization is reused in multiple hybrid-search merge/dedup paths, not just one call site.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `hybrid-search.ts:371-383,505-510,1155-1167`; `hybrid-search.vitest.ts:246-256,440-456`.

---
FEATURE: 08-mathmax-min-stack-overflow-elimination.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The listed implementation files do not match the current fix locations; current reduce-based replacements live in search/eval/telemetry files, and production spread-based `Math.max(...)/Math.min(...)` still remains in `shared/scoring/folder-scoring.ts`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/rsf-fusion.ts`, `mcp_server/lib/search/causal-boost.ts`, `mcp_server/lib/search/evidence-gap-detector.ts`, `mcp_server/lib/cognitive/prediction-error-gate.ts`, `mcp_server/lib/telemetry/retrieval-telemetry.ts`, `mcp_server/lib/eval/reporting-dashboard.ts`, `shared/algorithms/rrf-fusion.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P0
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `rsf-fusion.ts:101-105,212-214`; `reporting-dashboard.ts:306-310`; unresolved spread use at `shared/scoring/folder-scoring.ts:200-205,267`.

---
FEATURE: 09-session-manager-transaction-gap-fixes.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `session-manager.ts:414-418,445-454`.

---
FEATURE: 10-chunking-orchestrator-safe-swap.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Partial chunk success still finalizes the swap and returns `embeddingStatus: 'partial'`; total failure rolls back staged children.
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `chunking-orchestrator.ts:159-163,298-301,343-350,384-405,500-501`.

---
FEATURE: 11-working-memory-timestamp-fix.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The SQL now deletes from `working_memory`, not `working_memory_sessions`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: `working-memory.ts:44-50,196-205`.
tokens used
470,818
Scope note: I validated every listed path on disk. For the 7 docs with 100+ refs (`04/01`, `05/01-04`, `07/01-02`), I behavior-checked the primary implementation files plus the most relevant feature tests as a representative sample, per your instruction.

---
FEATURE: 01-workspace-scanning-and-indexing-memoryindexscan.md
CATEGORY: 04--maintenance
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: `toUpdate` is mtime/legacy-entry driven, not purely “changed content hash”; spec-doc auto-linking is `spec -> plan -> tasks -> implementation-summary`, while `checklist`, `decision-record`, and `research` are `supports` edges, not the same primary chain.
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Supports `specFolder`, `includeConstitutional`, `includeSpecDocs`, and `force`; can prune stale index rows and expose extra diagnostics with `SPECKIT_DEBUG_INDEX_SCAN=true`.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `incremental-index.ts:160-164,233`; `memory-index.ts:143-169,446-472`; `causal-edges.ts:618-637`.

---
FEATURE: 02-startup-runtime-compatibility-guards.md
CATEGORY: 04--maintenance
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Omits the SQLite minimum-version guard; the module also auto-creates `.node-version-marker` when it does not exist.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Marker auto-creation for future ABI checks.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: `startup-checks.ts:44-55,66-85`; `context-server.ts:826-827`; `cli.ts:459-460`.

---
FEATURE: 01-checkpoint-creation-checkpointcreate.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/handlers/memory-bulk-delete.ts`, `mcp_server/tests/handler-checkpoints.vitest.ts`, `mcp_server/tests/checkpoints-storage.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Scoped checkpoints also snapshot `causal_edges` and `working_memory`, not just `memory_index` and vectors.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `checkpoints.ts:398-456,488-503`; `memory-bulk-delete.ts:102-109`.

---
FEATURE: 02-checkpoint-listing-checkpointlist.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-checkpoints.vitest.ts`, `mcp_server/tests/checkpoint-limit.vitest.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/checkpoints.ts:159`; `checkpoints.ts:517`.

---
FEATURE: 03-checkpoint-restore-checkpointrestore.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-checkpoints.vitest.ts`, `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/checkpoints.ts:193-210`; `checkpoints.ts:564`.

---
FEATURE: 04-checkpoint-deletion-checkpointdelete.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-checkpoints.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Response includes `safetyConfirmationUsed: true`.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/checkpoints.ts:289-300`; `checkpoints.ts:939`.

---
FEATURE: 05-async-ingestion-job-lifecycle.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/context-server.ts`, `mcp_server/tools/lifecycle-tools.ts`, `mcp_server/tests/job-queue.vitest.ts`, `mcp_server/tests/handler-memory-ingest.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Strict path/root validation, startup crash-recovery requeue, and capped per-job error capture.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `job-queue.ts:13-20,181-207,505-516`; `memory-ingest.ts:90-139,235-245`; `context-server.ts:942`.

---
FEATURE: 06-startup-pending-file-recovery.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Recovery does not inspect DB commit state or leave stale pending files for manual review; it renames pending files back, or deletes the pending copy only when the original exists and is newer.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/tests/transaction-manager.vitest.ts`, `mcp_server/tests/context-server.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Startup scan is restricted to spec/constitutional roots and has a Node 18 recursive-read fallback.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `transaction-manager.ts:317-341`; `context-server.ts:417-445`; `transaction-manager.vitest.ts:138-199`.

---
FEATURE: 07-automatic-archival-subsystem.md
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Code only syncs BM25 removal/re-addition, not vector embedding deletion; dormancy uses `memory_index.last_accessed`/`access_count` plus `classifier.shouldArchive()`, not `access-tracker.ts` or `last_access_at`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/tests/archival-manager.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Supports unarchive, persistent `archival_stats`, and background job start/stop/stats APIs.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `archival-manager.ts:250-299,367-403,486-503,532-607`; `memory-search.ts:611`; `hybrid-search.ts:334-341`; `vector-index-store.ts:451`.

---
FEATURE: 01-causal-edge-creation-memorycausallink.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/handlers/causal-graph.ts`, `mcp_server/tests/handler-causal-graph.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Validates relation/IDs at handler level, rejects self-loops in storage, and returns follow-up hints.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `causal-graph.ts:431-531`; `causal-edges.ts:130-206,214-231,605-642`.

---
FEATURE: 02-causal-graph-statistics-memorycausalstats.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-causal-graph.vitest.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `causal-graph.ts:549-625`; `causal-edges.ts:527-591`.

---
FEATURE: 03-causal-edge-deletion-memorycausalunlink.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/handlers/causal-graph.ts`, `mcp_server/tests/handler-causal-graph.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Automatic edge cleanup during memory deletion is implemented in `vector-index-mutations.ts`, not just the causal-edges helper.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `causal-graph.ts:643-709`; `causal-edges.ts:486-520`; `vector-index-mutations.ts:375-384`.

---
FEATURE: 04-causal-chain-tracing-memorydriftwhy.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-causal-graph.vitest.ts`
UNDOCUMENTED_CAPABILITIES: `includeMemoryDetails` defaults to true and the response includes `allEdges`, `relatedMemories`, and `maxDepthReached`.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `causal-graph.ts:242-413`; `causal-graph.ts:248,324-408`.

---
FEATURE: 05-epistemic-baseline-capture-taskpreflight.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-session-learning.vitest.ts`, `mcp_server/tests/preflight.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Validates all three scores as `0..100` before storing the record.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `session-learning.ts:70,153-237`; `session-learning.ts:128-147`.

---
FEATURE: 06-post-task-learning-measurement-taskpostflight.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-session-learning.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Can correct an already-complete learning record by updating the existing row.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `session-learning.ts:336-354,378-403`.

---
FEATURE: 07-learning-history-memorygetlearninghistory.md
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/handler-session-learning.vitest.ts`, `mcp_server/tests/integration-learning-history.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Supports `includeSummary` and clamps result limits.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `session-learning.ts:474-482,563-632`.

---
FEATURE: 01-ablation-studies-evalrunablation.md
CATEGORY: 07--evaluation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/ablation-framework.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Supports `groundTruthQueryIds`, configurable `recallK`, optional persistence, optional formatted report output, and stores multi-metric deltas beyond Recall@K.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `eval-reporting.ts:31-34,59-60,104-118`; `ablation-framework.ts:366,502-589`.

---
FEATURE: 02-reporting-dashboard-evalreportingdashboard.md
CATEGORY: 07--evaluation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The dashboard queries `eval_metric_snapshots` and `eval_channel_results`, not `eval_final_results`; `formatReportText()` emits plain text, not markdown-formatted output.
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/tests/reporting-dashboard.vitest.ts`
UNDOCUMENTED_CAPABILITIES: `SPECKIT_DASHBOARD_LIMIT` row cap and generated summary paragraph.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `reporting-dashboard.ts:186-227,552-574`; `handlers/eval-reporting.ts:147`.

---
FEATURE: 01-graph-channel-id-fix.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Graph search also applies hierarchy-aware spec-folder augmentation.
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `graph-search-fn.ts:147-183,214-247`; `graph-search-fn.vitest.ts:48-79`.

---
FEATURE: 02-chunk-collapse-deduplication.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/pipeline/stage3-rerank.ts`, `mcp_server/tests/hybrid-search.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Stage 3 also reassembles parent content and marks `contentSource` fallback provenance.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `hybrid-search.ts:731-769`; `stage3-rerank.ts:202-210,411-430`; `memory-search.ts:376-509`.

---
FEATURE: 03-co-activation-fan-effect-divisor.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/search/pipeline/stage2-fusion.ts`
UNDOCUMENTED_CAPABILITIES: Related-memory lookups are cached for 30 seconds to bound repeated traversal cost.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `co-activation.ts:84-97,103-119`; `hybrid-search.ts:907-915`; `stage2-fusion.ts:541-550`.

---
FEATURE: 04-sha-256-content-hash-deduplication.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/memory-save.ts`
UNDOCUMENTED_CAPABILITIES: Dedup also catches identical content saved under a different file path in the same spec folder; pending rows are excluded and `force` bypasses dedup.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `dedup.ts:18-27,50-72`; `memory-save.ts:174-180`; `content-hash-dedup.vitest.ts:124-180`.

---
FEATURE: 05-database-and-schema-safety.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The source-file list does not point at the actual fix locations; B3 references a parenthesized delete predicate that is not present in current `causal-edges.ts`; B4’s `.changes > 0` guards are in `vector-index-mutations.ts`, not `memory-save.ts`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/storage/reconsolidation.ts`, `mcp_server/lib/storage/checkpoints.ts`, `mcp_server/lib/storage/causal-edges.ts`, `mcp_server/lib/search/vector-index-mutations.ts`, `mcp_server/tests/reconsolidation.vitest.ts`, `mcp_server/tests/checkpoints-storage.vitest.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P0
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `reconsolidation.ts:202-204`; `checkpoints.ts:640-646`; `causal-edges.ts:508-511`; `vector-index-mutations.ts:503-536`.

---
FEATURE: 06-guards-and-edge-cases.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/cognitive/temporal-contiguity.ts`, `mcp_server/lib/extraction/extraction-adapter.ts`, `mcp_server/tests/temporal-contiguity.vitest.ts`, `mcp_server/tests/extraction-adapter.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Extraction adapter also rejects unsafe regexes and applies redaction gating before writing extracted summaries.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `temporal-contiguity.ts:69-70`; `extraction-adapter.ts:183-206`.

---
FEATURE: 07-canonical-id-dedup-hardening.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/tests/hybrid-search.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Canonical ID normalization is reused in multiple hybrid-search merge/dedup paths, not just one call site.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `hybrid-search.ts:371-383,505-510,1155-1167`; `hybrid-search.vitest.ts:246-256,440-456`.

---
FEATURE: 08-mathmax-min-stack-overflow-elimination.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The listed implementation files do not match the current fix locations; current reduce-based replacements live in search/eval/telemetry files, and production spread-based `Math.max(...)/Math.min(...)` still remains in `shared/scoring/folder-scoring.ts`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/rsf-fusion.ts`, `mcp_server/lib/search/causal-boost.ts`, `mcp_server/lib/search/evidence-gap-detector.ts`, `mcp_server/lib/cognitive/prediction-error-gate.ts`, `mcp_server/lib/telemetry/retrieval-telemetry.ts`, `mcp_server/lib/eval/reporting-dashboard.ts`, `shared/algorithms/rrf-fusion.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P0
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `rsf-fusion.ts:101-105,212-214`; `reporting-dashboard.ts:306-310`; unresolved spread use at `shared/scoring/folder-scoring.ts:200-205,267`.

---
FEATURE: 09-session-manager-transaction-gap-fixes.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `session-manager.ts:414-418,445-454`.

---
FEATURE: 10-chunking-orchestrator-safe-swap.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Partial chunk success still finalizes the swap and returns `embeddingStatus: 'partial'`; total failure rolls back staged children.
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `chunking-orchestrator.ts:159-163,298-301,343-350,384-405,500-501`.

---
FEATURE: 11-working-memory-timestamp-fix.md
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The SQL now deletes from `working_memory`, not `working_memory_sessions`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: `working-memory.ts:44-50,196-205`.
atches `handlers/memory-index.ts:139-173` (cooldown), `:245-249` (stale delete/cache clear), `:418-489` (spec-doc causal chains + trigger cache refresh).
---
FEATURE: 02-startup-runtime-compatibility-guards
CATEGORY: 04--maintenance
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Says `.node-version-marker` is written "at build time", but the code auto-creates it at runtime when missing. The description also omits the SQLite version guard and the CLI invocation path.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: SQLite 3.35+ compatibility warning and CLI-side startup check invocation.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: `startup-checks.ts:44-54` auto-creates the marker; `startup-checks.ts:70-82` checks SQLite version; `cli.ts:460` and `context-server.ts:827` invoke the checks.
---
FEATURE: 01-checkpoint-creation-checkpointcreate
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Snapshot also includes `causal_edges`, and stored metadata includes `vectorCount` and `includeEmbeddings`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: 100+ listed refs; only missing listed path was `mcp_server/tests/retry.vitest.ts`. `lib/storage/checkpoints.ts:452-456` includes `causalEdges`; `:476-479` stores `vectorCount`/`includeEmbeddings`; `:488-493` enforces max checkpoint retention.
---
FEATURE: 02-checkpoint-listing-checkpointlist
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: "Paginated list" is misleading. The implementation supports a `limit`, but there is no offset, cursor, or page token.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: 100+ listed refs; only missing listed path was `mcp_server/tests/retry.vitest.ts`. `lib/storage/checkpoints.ts:517-530` defines `listCheckpoints(specFolder, limit)` and returns `ORDER BY created_at DESC LIMIT ?`.
---
FEATURE: 03-checkpoint-restore-checkpointrestore
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Restore also reapplies `working_memory` and `causal_edges`, not just memories and vectors.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: 100+ listed refs; only missing listed path was `mcp_server/tests/retry.vitest.ts`. `lib/storage/checkpoints.ts:722-750` skips duplicate logical keys; `:811-866` restores `working_memory` and `causal_edges`; `handlers/checkpoints.ts:206-210` rebuilds BM25 and trigger cache after restore.
---
FEATURE: 04-checkpoint-deletion-checkpointdelete
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: 100+ listed refs; only missing listed path was `mcp_server/tests/retry.vitest.ts`. `handlers/checkpoints.ts:282-289` enforces exact `confirmName` matching before deletion; `lib/storage/checkpoints.ts:939` deletes by name/id and returns boolean success.
---
FEATURE: 05-async-ingestion-job-lifecycle
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Start validation caps path count/length, the queue resets unfinished jobs to `queued` on startup, retries `SQLITE_BUSY`, continues after per-file errors, and truncates stored error logs.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `handlers/memory-ingest.ts:34-81` enforces `MAX_INGEST_PATHS` and `MAX_PATH_LENGTH`; `lib/ops/job-queue.ts:198-202` resets incomplete jobs to `queued`; `:421-450` continues after file errors; `:332-341` truncates stored errors.
---
FEATURE: 06-startup-pending-file-recovery
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The code does not check whether a DB row was committed or leave "stale" pending files for manual review. It either deletes the pending file if the original is newer or renames `_pending` to the original path.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Startup recovery scans only `specs/`, `.opencode/specs/`, and constitutional directories.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: `lib/storage/transaction-manager.ts:321-333` compares mtimes and either deletes pending or renames it; `context-server.ts:421-445` restricts scanning to known spec/constitutional locations.
---
FEATURE: 07-automatic-archival-subsystem
CATEGORY: 05--lifecycle
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The code does not demote tier classification, does not remove vector embeddings, and uses `last_accessed`/`access_count` from `memory_index` rather than `last_access_at`. `access-tracker.ts` is not the main implementation path for archival decisions.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/bm25-index.ts
UNDOCUMENTED_CAPABILITIES: Persists archival stats in `archival_stats`, auto-adds the `is_archived` column/index, and supports `unarchiveMemory()`.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `lib/cognitive/archival-manager.ts:250-283` orders candidates by `last_accessed`/`access_count` and uses `classifier.shouldArchive`; `:368-403` only syncs BM25; `:486-494` implements unarchive; `:137-160` adds `is_archived`/`archival_stats`.
---
FEATURE: 01-causal-edge-creation-memorycausallink
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/causal-graph.ts
UNDOCUMENTED_CAPABILITIES: The handler validates relation names up front, and storage rejects self-loops before upsert.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `handlers/causal-graph.ts:431-502` is the actual MCP handler for `memory_causal_link`; `lib/storage/causal-edges.ts:150-184` prevents self-loops and uses `ON CONFLICT ... DO UPDATE`; missing listed test path is `mcp_server/tests/retry.vitest.ts`.
---
FEATURE: 02-causal-graph-statistics-memorycausalstats
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: "Use `memory_drift_why` to find the edge IDs" is misleading. `memory_causal_stats` only returns an orphan count, and `memory_drift_why` traces from an existing memory rather than enumerating orphan IDs directly.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `handlers/causal-graph.ts:570-621` computes `orphanedEdges.length` and returns the count, not IDs; missing listed test path is `mcp_server/tests/retry.vitest.ts`.
---
FEATURE: 03-causal-edge-deletion-memorycausalunlink
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/memory-crud-delete.ts
UNDOCUMENTED_CAPABILITIES: Bulk deletion also cleans causal edges through `memory-bulk-delete.ts`.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `handlers/causal-graph.ts:643-682` deletes by numeric `edgeId`; `handlers/memory-crud-delete.ts:74,166` call `deleteEdgesForMemory()`; `handlers/memory-bulk-delete.ts:178` does too; missing listed test path is `mcp_server/tests/retry.vitest.ts`.
---
FEATURE: 04-causal-chain-tracing-memorydriftwhy
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Response also includes `allEdges`, optional `relatedMemories`, and an `includeMemoryDetails` toggle.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `handlers/causal-graph.ts:247-248` accepts `relations` and `includeMemoryDetails`; `:320-321` filters after traversal; `:399-408` returns `allEdges`, `relatedMemories`, and `maxDepthReached`; missing listed test path is `mcp_server/tests/retry.vitest.ts`.
---
FEATURE: 05-epistemic-baseline-capture-taskpreflight
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/session-learning.ts:186-239` updates an existing preflight record but blocks overwrite of completed records; missing listed test path is `mcp_server/tests/retry.vitest.ts`.
---
FEATURE: 06-post-task-learning-measurement-taskpostflight
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Postflight can be re-run against an already-complete record instead of only `preflight` rows.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `handlers/session-learning.ts:335-342` explicitly accepts both `phase IN ('preflight', 'complete')`; `:352-369` computes the LI and interpretation; missing listed test path is `mcp_server/tests/retry.vitest.ts`.
---
FEATURE: 07-learning-history-memorygetlearninghistory
CATEGORY: 06--analysis
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/session-learning.ts:472-610` implements `sessionId`, `onlyComplete`, ordering by `updated_at`, and summary stats/interpretation; missing listed test path is `mcp_server/tests/retry.vitest.ts`.
---
FEATURE: 01-ablation-studies-evalrunablation
CATEGORY: 07--evaluation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Supports configurable `recallK`, query-subset ablations via `groundTruthQueryIds`, partial failure reporting via `channelFailures`, and optional persistence/formatting controls.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: 100+ listed refs; only missing listed path was `mcp_server/tests/retry.vitest.ts`. `handlers/eval-reporting.ts:59-60,76-118` gates on `SPECKIT_ABLATION` and accepts `recallK`/`groundTruthQueryIds`; `lib/eval/ablation-framework.ts:397-488` captures `channelFailures`; `:523-556` stores metrics with a synthetic negative `eval_run_id`.
---
FEATURE: 02-reporting-dashboard-evalreportingdashboard
CATEGORY: 07--evaluation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Exposes `totalEvalRuns` and `totalSnapshots`, and enforces a configurable row cap via `SPECKIT_DASHBOARD_LIMIT`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: 100+ listed refs; only missing listed path was `mcp_server/tests/retry.vitest.ts`. `handlers/eval-reporting.ts:140-147` applies sprint/channel/metric filters and format selection; `lib/eval/reporting-dashboard.ts:24` defines `SPECKIT_DASHBOARD_LIMIT`; `:525-561` computes `totalEvalRuns`/`totalSnapshots`.
---
FEATURE: 01-graph-channel-id-fix
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `lib/search/graph-search-fn.ts:157,170,221,234` normalizes `source_id`/`target_id` with `Number(...)`, matching numeric memory IDs instead of `mem:*` strings.
---
FEATURE: 02-chunk-collapse-deduplication
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts, mcp_server/handlers/memory-search.ts
UNDOCUMENTED_CAPABILITIES: The same code path also reassembles parent documents and reports `contentSource`/fallback provenance.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `lib/search/pipeline/stage3-rerank.ts:202-234,394-409` performs chunk collapse and parent reassembly independent of `includeContent`; `handlers/memory-search.ts:599,748,876` treats `includeContent` separately.
---
FEATURE: 03-co-activation-fan-effect-divisor
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `lib/cognitive/co-activation.ts:93-95` computes the fan-effect divisor with `Math.sqrt(Math.max(1, relatedCount))`; `lib/search/pipeline/stage2-fusion.ts:550` still applies spread activation directly on the hot path.
---
FEATURE: 04-sha-256-content-hash-deduplication
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: There is also a same-file unchanged-content fast path before the cross-file hash lookup.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: `handlers/save/dedup.ts:19-27` short-circuits identical same-file saves; `:53-61` skips embedding on same-spec-folder hash duplicates when the prior embedding is not `pending`.
---
FEATURE: 05-database-and-schema-safety
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: B4 points to `memory-save.ts`, but the visible `.changes > 0` guards are in `lib/search/vector-index-mutations.ts`. The source table omits the actual implementation files for B1-B4.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/storage/reconsolidation.ts, mcp_server/lib/storage/checkpoints.ts, mcp_server/lib/storage/causal-edges.ts, mcp_server/lib/search/vector-index-mutations.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: `lib/storage/reconsolidation.ts:202-204` uses `importance_weight` with `Math.min(1.0, currentWeight + 0.1)`; `lib/storage/checkpoints.ts:646-683` runs DDL before restore transaction work; `lib/search/vector-index-mutations.ts:384,509,536` use `.changes > 0`.
---
FEATURE: 06-guards-and-edge-cases
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/cognitive/temporal-contiguity.ts, mcp_server/lib/extraction/extraction-adapter.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `lib/cognitive/temporal-contiguity.ts:70` uses `for (let j = i + 1; ...)`; `lib/extraction/extraction-adapter.ts:183-206` documents and implements the `null` return on resolution failure.
---
FEATURE: 07-canonical-id-dedup-hardening
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `lib/search/hybrid-search.ts:372-381,1153-1161` normalizes `42`, `\"42\"`, and `mem:42` through `canonicalResultId()` in the actual dedup path.
---
FEATURE: 08-mathmax-min-stack-overflow-elimination
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The documented affected-file list no longer matches the code. The current spread-to-safe-min/max fixes are in other modules, and one listed file (`shared/scoring/folder-scoring.ts`) still contains spread `Math.max(...)`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/rsf-fusion.ts, mcp_server/lib/search/causal-boost.ts, mcp_server/lib/search/evidence-gap-detector.ts, mcp_server/lib/cognitive/prediction-error-gate.ts, mcp_server/lib/telemetry/retrieval-telemetry.ts, mcp_server/lib/eval/reporting-dashboard.ts
UNDOCUMENTED_CAPABILITIES: `mcp_server/lib/scoring/composite-scoring.ts` fixed the issue with loop-based min/max rather than `reduce()`.
SEVERITY: P0
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `lib/search/rsf-fusion.ts:101-105,212-214`, `lib/search/causal-boost.ts:228-229`, `lib/search/evidence-gap-detector.ts:163-164`, `lib/cognitive/prediction-error-gate.ts:483-486`, `lib/telemetry/retrieval-telemetry.ts:184-185`, and `lib/eval/reporting-dashboard.ts:305-310` contain the actual fixes; `shared/scoring/folder-scoring.ts:200,267` still uses spread `Math.max(...)`.
---
FEATURE: 09-session-manager-transaction-gap-fixes
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `lib/session/session-manager.ts:397-418` and `:429-454` place `enforceEntryLimit(sessionId)` inside the transaction in both write paths.
---
FEATURE: 10-chunking-orchestrator-safe-swap
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: (no dedicated test file yet)
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `handlers/chunking-orchestrator.ts:298-301` stages new chunks without `parent_id`; `:343-368` rolls back on failure; `:392-397` atomically deletes old children and attaches new ones. The test table entry is a placeholder, not a real path.
---
FEATURE: 11-working-memory-timestamp-fix
CATEGORY: 08--bug-fixes-and-data-integrity
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: NONE
EVIDENCE: `lib/cognitive/working-memory.ts:196-204` uses SQLite `datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, matching the documented fix.
---
