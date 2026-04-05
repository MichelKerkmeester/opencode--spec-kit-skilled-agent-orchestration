OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-9286-7410-b899-dfbdc0d5e8af
--------
user
You are a feature catalog verification agent. Read each feature snippet file in: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/ (8 files), /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/ (2 files). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

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
I’m going to inspect the 10 feature snippet files and the referenced `mcp_server` code, then compare each snippet’s “Current Reality” and source-file list against what’s actually implemented. I’ll start by checking the available guidance in this repo and listing the target files so we can verify each one cleanly and consistently.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts .opencode/skill/system-spec-kit/feature_catalog/17--governance' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server | sed 's#"'^#/#'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md
.opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md
 succeeded in 51ms:
Total output lines: 505

/.opencode/skill/system-spec-kit/mcp_server/context-server.ts
/.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs
/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
/.opencode/skill/system-spec-kit/mcp_server/README.md
/.opencode/skill/system-spec-kit/mcp_server/tsconfig.json
/.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
/.opencode/skill/system-spec-kit/mcp_server/LICENSE
/.opencode/skill/system-spec-kit/mcp_server/_pending
/.opencode/skill/system-spec-kit/mcp_server/cli.ts
/.opencode/skill/system-spec-kit/mcp_server/configs/README.md
/.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
/.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
/.opencode/skill/system-spec-kit/mcp_server/scripts/reindex-embeddings.ts
exec
/bin/zsh -lc "pwd && printf '\\n' && python3 .opencode/skill/scripts/skill_advisor.py \"Verify feature catalog snippets in system-spec-kit feature_catalog 16--tooling-and-scripts and 17--governance against mcp_server code\" --threshold 0.8" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 616ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !spec, !system-spec-kit(explicit), document~, folder, kit(name)"
  },
  {
    "skill": "sk-code-full-stack",
    "kind": "skill",
    "confidence": 0.93,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !intent:implementation, code(name), specification~, spec~"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
codex
SKILL ROUTING: `system-spec-kit` (confidence `0.95`). User specified: “Read each feature snippet file … Verify … Current Reality … source file paths … no important source files are missing.” I’m loading just the relevant parts of that skill now, then I’ll extract each snippet’s source-file list and compare it to the actual `mcp_server` implementation.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "''^#|''^##|feature catalog|Current Reality|Source Files|verification|review" .opencode/skill/system-spec-kit/SKILL.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
10:# Spec Kit - Mandatory Conversation Documentation
15:## 1. WHEN TO USE
17:### What is a Spec Folder?
27:### Activation Triggers
47:### When NOT to Use
58:### Agent Exclusivity
72:### Utility Template Triggers
85:## 2. SMART ROUTING
87:### Resource Domains
93:- `references/validation/` for checklist policy, verification rules, and decision formats.
99:### Template and Script Sources of Truth
115:### Resource Loading Levels
123:### Smart Router Pseudocode
294:## 3. HOW IT WORKS
296:### Gate 3 Integration
315:### Complexity Detection (Option B Flow)
337:# Create spec folder with level 2 templates
340:# Create spec folder with level 3+ (extended) templates
344:### 3-Level Progressive Enhancement (CORE + ADDENDUM v2.2)
361:| **2**  | 100-499      | Level 1 + checklist.md                                | Quality gates, verification, NFRs           |
codex
I’ve confirmed the task is squarely in `system-spec-kit`, and this is a read-only verification pass, so no spec-folder workflow is needed. Next I’m extracting each snippet’s “Current Reality” and “Source Files” sections so I can validate them one by one against the `mcp_server` tree rather than guessing from filenames.
exec
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/*.md .opencode/skill/system-spec-kit/feature_catalog/17--governance/*.md; do printf 'FILE: %s
' \""'$f"; awk '"'BEGIN{p=0} /"'^## Current Reality/{p=1; print; next} /''^## Source Files/{p=2; print; next} /''^## /{if(p){exit}} p{print}'"' \""'$f"; printf '"'
'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE: .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md
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
|------|-------|
codex
The feature snippets are already showing a mix of concrete code claims and “meta-improvement” writeups, so I’m checking both angles: whether the exact files/functions still exist and whether the behavior has moved elsewhere. That’s usually where stale catalog entries hide.
exec
/bin/zsh -lc 'for p in mcp_server/lib/chunking/anchor-chunker.ts mcp_server/lib/chunking/chunk-thinning.ts mcp_server/lib/architecture/check-architecture-boundaries.ts scripts/progressive-validate.sh mcp_server/lib/ops/file-watcher.ts mcp_server/cli.ts mcp_server/lib/storage/schema-downgrade.ts mcp_server/lib/storage/checkpoints.ts mcp_server/tests/chunk-thinning.vitest.ts mcp_server/tests/layer-definitions.vitest.ts mcp_server/tests/file-watcher.vitest.ts mcp_server/tests/checkpoints-storage.vitest.ts mcp_server/tests/checkpoints-extended.vitest.ts mcp_server/tests/mutation-ledger.vitest.ts; do if [ -e ".opencode/skill/system-spec-kit/$p" ]; then printf '"'EXISTS %s
' \""'$p"; else printf '"'MISSING %s
' \""'$p"; fi; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"applyTreeThinning|chunk thinning|chunk-thinning|tree thinning|thinned|merged count|tokens saved|workflow\\.ts|Step 7\\.6|content-as-summary\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "check-architecture-boundaries|architecture boundary|shared/|scripts/dist|child_process|substantive lines|wrapper" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
EXISTS mcp_server/lib/chunking/anchor-chunker.ts
EXISTS mcp_server/lib/chunking/chunk-thinning.ts
MISSING mcp_server/lib/architecture/check-architecture-boundaries.ts
MISSING scripts/progressive-validate.sh
EXISTS mcp_server/lib/ops/file-watcher.ts
EXISTS mcp_server/cli.ts
EXISTS mcp_server/lib/storage/schema-downgrade.ts
EXISTS mcp_server/lib/storage/checkpoints.ts
EXISTS mcp_server/tests/chunk-thinning.vitest.ts
EXISTS mcp_server/tests/layer-definitions.vitest.ts
EXISTS mcp_server/tests/file-watcher.vitest.ts
EXISTS mcp_server/tests/checkpoints-storage.vitest.ts
EXISTS mcp_server/tests/checkpoints-extended.vitest.ts
EXISTS mcp_server/tests/mutation-ledger.vitest.ts
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:77:| **Sessions**      | None                | Deduplication with ~50% tokens saved on follow-up        |
.opencode/skill/system-spec-kit/mcp_server/README.md:1104:| `scripts/core/workflow.ts` | Tree thinning for spec folder consolidation (token-budget-aware merge of low-value nodes) |
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:19:import { thinChunks } from '../lib/chunking/chunk-thinning';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:970:        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:10:import { scoreChunk, thinChunks, DEFAULT_THINNING_THRESHOLD, ANCHOR_WEIGHT, DENSITY_WEIGHT } from '../lib/chunking/chunk-thinning';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:645:**R7: Chunk Thinning** (`chunk-thinning.ts`):
 succeeded in 51ms:
Total output lines: 302

.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:52:/** Partial embedding provider metadata — see shared/types.ts ProviderMetadata for the full shape. */
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:5:import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
.opencode/skill/system-spec-kit/mcp_server/README.md:216:| `tools/`      | Tool registration wrappers per category                                |
.opencode/skill/system-spec-kit/mcp_server/README.md:667:├── tools/                  # Tool registration wrappers
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:11:import { validateFilePath } from '@spec-kit/shared/utils/path-security';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:10:import type { Database } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:11:      "@spec-kit/shared/*": ["../shared/*"]
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:6:import { validateFilePath } from '@spec-kit/shared/utils/path-security';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:9:import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:99:- `Cannot find module '@spec-kit/shared/...'`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:716:| `Cannot find module '@spec-kit/shared/...'` | Workspace dependency state is incomplete or stale | Run `npm install && npm run build` from the skill root |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:727:**"Cannot find module '@spec-kit/shared/...'"**
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:742:rm -rf .opencode/skill/system-spec-kit/shared/node_modules
.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts:4:// Re-exports canonical types from shared/ for handler convenience.
.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts:16:} from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:66:    // AI-WHY: T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
.opencode/skill/system-spec-kit/scripts/loaders/README.md:64:node -e "const l=require('./.opencode/skill/system-spec-kit/scripts/dist/loaders'); console.log(Object.keys(l))"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:129:  // AI-WHY: T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/shared | rg "flag|fusion|shadow|rsf|learned-feedback|fsrs|co-activation|causal|negative-feedback|working-memory|graph-signals|graph-search-fn|archival-manager|community-detection|cross-encoder|access-tracker"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg "chunk|thin|watcher|flag|schema-downgrade|checkpoint|architecture|storage|workflow|tree-thinning|progressive|validate"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/scripts | rg "progressive|validate|architecture|tree-thinning|workflow|check|flag"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md
 succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/check-api-boundary.sh
.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh
.opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh
.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh
.opencode/skill/system-spec-kit/scripts/spec/validate.sh
.opencode/skill/system-spec-kit/scripts/core/workflow.ts
.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts
.opencode/skill/system-spec-kit/scripts/test-fixtures/042-priority-lowercase/checklist.md
.opencode/skill/system-spec-kit/scripts/tests/test-phase-command-workflows.js
.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts
.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh
.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh
.opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh
.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh
.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh
.opencode/skill/system-spec-kit/scripts/rules/check-folder-naming.sh
.opencode/skill/system-spec-kit/scripts/rules/check-level.sh
.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh
.opencode/skill/system-spec-kit/scripts/rules/check-complexity.sh
.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh
exec
/bin/zsh -lc 'rg -n "computeStructuralFreshness|computeGraphCentrality|computeCausalDepth|getSubgraphWeights|RECOVERY_HALF_LIFE_DAYS|logCoActivationEvent|CoActivationEvent|stmtCache|lastComputedAt|activeProvider|flushCount|decayInterval|attentionDecayRate|minAttentionScore" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "isShadowScoringEnabled|isRsfEnabled|isInShadowPeriod|SPECKIT_ABLATION|isPipelineV2Enabled|SPECKIT_PIPELINE_V2|ADAPTIVE_FUSION|COACTIVATION_STRENGTH|PRESSURE_POLICY|GRAPH_SIGNALS|COMMUNITY_DETECTION|MEMORY_SUMMARIES|AUTO_ENTITIES|ENTITY_LINKING" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "AI-WHY|AI-TRACE|AI-GUARD|MODULE|COMPONENT|specFolderLocks|SPEC_FOLDER_LOCKS" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:2:// Previously tested getSubgraphWeights, which was removed as dead code.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:3:// getSubgraphWeights always returned { causalWeight: 1.0 } regardless of intent.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:9:  it('getSubgraphWeights was removed — causal weight is inlined as 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:138:  it('fsrs exports: computeStructuralFreshness, computeGraphCentrality', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:140:    expect(typeof mod.computeStructuralFreshness).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:141:    expect(typeof mod.computeGraphCentrality).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:507:  // AI-GUARD: no-op: activeProvider cache removed (was never populated)
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:4://         computeCausalDepthScores, applyGraphSignals, clearGraphSignalsCache
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:13:  computeCausalDepthScores,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:274:  // 5. computeCausalDepthScores
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:276:  describe('computeCausalDepthScores', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:282:      const scores = computeCausalDepthScores(db, [1, 2, 3]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:293:      const scores1 = computeCausalDepthScores(db, [1, 2, 3]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:296:      const scores2 = computeCausalDepthScores(db, [1, 2, 3]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:305:      const scores = computeCausalDepthScores(db, []);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:454:      computeCausalDepthScores(db, [1, 2, 3]);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:542:      expect(() => computeCausalDepthScores(db, [1, 50, 100, 150, 200])).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:546:      const scores = computeCausalDepthScores(db, [200]);
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:10: * Minimal graph interface required by `computeGraphCentrality`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:39:export function computeStructuralFreshness(
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:469:When `SPECKIT_ADAPTIVE_FUSION=true` (default enabled), standard fixed-weight RRF is replaced with intent-aware weighted RRF. Fusion weights shift dynamically based on detected query intent:
.opencode/skill/system-spec-kit/mcp_server/README.md:704:| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0`                      | S5 density guard threshold for cross-document entity linking |
.opencode/skill/system-spec-kit/mcp_server/README.md:706:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
.opencode/skill/system-spec-kit/mcp_server/README.md:736:| `SPECKIT_ADAPTIVE_FUSION`    | `true`  | Enable intent-aware weighted RRF fusion                                               |
.opencode/skill/system-spec-kit/mcp_server/README.md:737:| `SPECKIT_PRESSURE_POLICY`    | `true`  | Enable token-pressure mode override in `memory_context` (set `false` to disable)      |
.opencode/skill/system-spec-kit/mcp_server/README.md:763:| `SPECKIT_ABLATION`              | `false` | Ablation tool execution |
.opencode/skill/system-spec-kit/mcp_server/README.md:792:| `SPECKIT_AUTO_ENTITIES`        | `true`  | Extracts entities at save time for cross-document linking (R10) |
.opencode/skill/system-spec-kit/mcp_server/README.md:793:| `SPECKIT_ENTITY_LINKING`       | `true`  | Links memories sharing extracted entities (S5) |
.opencode/skill/system-spec-kit/mcp_server/README.md:1054:SPECKIT_PRESSURE_POLICY=false
.opencode/skill/system-spec-kit/mcp_server/README.md:1056:SPECKIT_ADAPTIVE_FUSION=false
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:476:  const pressurePolicyEnabled = process.env.SPECKIT_PRESSURE_POLICY !== 'false' && rolloutEnabled;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:59:      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:60:      { flag: 'SPECKIT_ABLATION' }
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:76:const FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION';
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:347:  description: '[L6:Analysis] Run a controlled channel ablation study (R13-S3) and optionally persist Recall@20 deltas to eval_metric_snapshots. Requires SPECKIT_ABLATION=true. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:322:| `SPECKIT_ADAPTIVE_FUSION` | `true` | Controls adaptive intent-based fusion weights. Set to `false` to disable (7 task types). |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:339:        "SPECKIT_ADAPTIVE_FUSION": "true",
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:542:**Flag:** `SPECKIT_ADAPTIVE_FUSION` (default: on)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:664:  "SPECKIT_ADAPTIVE_FUSION": "true"
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:897:  SPECKIT_ADAPTIVE_FUSION   default: true  (false = disable intent-based fusion)
 succeeded in 51ms:
Total output lines: 864

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:2:// MODULE: Context Server
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:13:   1. MODULE IMPORTS
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:217:// AI-WHY(CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:680:  // AI-WHY: Short delay allows pending stderr writes to flush before exit
.opencode/skill/system-spec-kit/mcp_server/cli.ts:3:// MODULE: Cli
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:2:// MODULE: Startup Checks
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:35:        console.error(`[context-server] \u2551  Installed: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`.padEnd(59) + '\u2551');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:36:        console.error(`[context-server] \u2551  Running:   Node ${process.version} (MODULE_VERSION ${process.versions.modules})`.padEnd(59) + '\u2551');
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:42:        console.error(`[context-server] Node version check: OK (${process.version}, MODULE_VERSION ${process.versions.modules})`);
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:2:// MODULE: Tool Input Schemas
.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts:2:// MODULE: Db Helpers
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:2:// MODULE: Search Results Formatter
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:516:  // AI-WHY: Spread extraData first, then re-assert canonical keys to prevent overwrites.
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:2:// MODULE: Index
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:5:// AI-WHY: ARCH-1 consumer scripts import from '../../mcp_server/api'
.opencode/skill/system-spec-kit/mcp_server/api/search.ts:2:// MODULE: Search
.opencode/skill/system-spec-kit/mcp_server/api/search.ts:5:// AI-WHY: ARCH-1 stable re-export surface for search functionality.
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:2:// MODULE: Context Tools
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"tree thinning|applyTreeThinning|thinChunks|chunk thinning|Step 7\\.6|7\\.6|stats|threshold|100 tokens|200 tokens|500 tokens|300\\+|merged|rendered context payload\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts .opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Tree Thinning
// ---------------------------------------------------------------
// Bottom-up merging of small files during spec folder context
// loading to reduce token overhead before the retrieval pipeline starts.
//
// This operates PRE-PIPELINE (context loading step) and does NOT affect
// pipeline stages or scoring.

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

/** Represents thinning config. */
export interface ThinningConfig {
  /** Files under this token count are merged into parent document */
  mergeThreshold: number;
  /** Files under this token count use content directly as summary */
  contentAsTextThreshold: number;
  /** Memory-specific thinning trigger threshold */
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:3:// Scores chunks by anchor presence + content density, applies thinning threshold.
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:10:import { scoreChunk, thinChunks, DEFAULT_THINNING_THRESHOLD, ANCHOR_WEIGHT, DENSITY_WEIGHT } from '../lib/chunking/chunk-thinning';
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:190:   4. thinChunks — basic filtering
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:193:describe('thinChunks — basic filtering', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:204:    const result = thinChunks(chunks);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:213:    const result = thinChunks(chunks);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:220:    const result = thinChunks(chunks);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:232:   5. thinChunks — safety: never returns empty
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:235:describe('thinChunks — safety', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:243:    const result = thinChunks(chunks);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:249:    const result = thinChunks(chunks);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:256:    const result = thinChunks([]);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:262:  it('should keep the highest-scoring chunk when all are below threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:268:    // Use an extremely high threshold so all fail
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:269:    const result = thinChunks(chunks, 0.99);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:280:   6. thinChunks — threshold customization
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:283:describe('thinChunks — threshold customization', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:284:  it('should retain more chunks with lower threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:293:    const strict = thinChunks(chunks, 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:294:    const lenient = thinChunks(chunks, 0.1);
exec
/bin/zsh -lc "sed -n '560,660p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    }
    return {
      prompt: filtered.cleanedText,
      content: filtered.cleanedText,
      timestamp: m.timestamp
    };
  });

  // Run content through filter pipeline for quality scoring
  const filterPipeline = createFilterPipeline();
  filterPipeline.filter(allMessages);
  const filterStats: FilterStats = filterPipeline.getStats();

  log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
  if (filterPipeline.isLowQuality()) {
    warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
  }

  const implSummary = generateImplementationSummary(
    allMessages,
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Chunking Orchestrator
// ---------------------------------------------------------------

import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as bm25Index from '../lib/search/bm25-index';
import * as fsrsScheduler from '../lib/cache/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../lib/storage/incremental-index';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { classifyEncodingIntent } from '../lib/search/encoding-intent';
import { isEncodingIntentEnabled } from '../lib/search/search-flags';
import { lookupEmbedding, storeEmbedding, computeContentHash as cacheContentHash } from '../lib/cache/embedding-cache';
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer';
import { needsChunking, chunkLargeFile } from '../lib/chunking/anchor-chunker';
import { thinChunks } from '../lib/chunking/chunk-thinning';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Layer Definitions
// ---------------------------------------------------------------
// LIB: LAYER DEFINITIONS
// T060: 7-Layer MCP Architecture with Token Budgets
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. LAYER TYPES
   --------------------------------------------------------------- */

/** Individual layer definition in the 7-layer architecture */
export interface LayerDefinition {
  id: string;
  name: string;
  description: string;
  tokenBudget: number;
  priority: number;
  useCase: string;
  tools: string[];
 succeeded in 51ms:
// @ts-nocheck
// ---------------------------------------------------------------
// TEST: LAYER DEFINITIONS
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import * as mod from '../lib/architecture/layer-definitions';

/* -------------------------------------------------------------
   TEST SUITES
---------------------------------------------------------------- */

describe('Layer Definitions Tests', () => {

  // 4.1 LAYER_DEFINITIONS CONSTANT

  describe('LAYER_DEFINITIONS Constant', () => {

    const LD = mod.LAYER_DEFINITIONS;

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Check Architecture Boundaries
// ---------------------------------------------------------------
// Enforces two rules from ARCHITECTURE.md that were
// previously documentation-only:
//   GAP A — shared/ must not import from mcp_server/ or scripts/
//   GAP B — mcp_server/scripts/ files must be thin wrappers only

// 1. IMPORTS

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// 2. TYPE DEFINITIONS
// ---------------------------------------------------------------------------

interface GapAViolation {
  file: string;
  line: number;
exec
/bin/zsh -lc "rg -n 'check-architecture-boundaries|npm run check|\"check\"' .opencode/skill/system-spec-kit/package.json .opencode/skill/system-spec-kit/mcp_server/package.json .opencode/skill/system-spec-kit/shared/package.json .opencode/skill/system-spec-kit" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/package.json:17:    "check": "npm run lint && npx tsc --noEmit",
.opencode/skill/system-spec-kit/mcp_server/package.json:18:    "check:full": "npm run check && npm run test",
.opencode/skill/system-spec-kit/ARCHITECTURE.md:119:| `scripts/evals/check-architecture-boundaries.ts` | Shared neutrality and wrapper verification |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:215:| Architecture boundary check | `scripts/evals/check-architecture-boundaries.ts` | `shared/` neutrality + wrapper-only verification |
.opencode/skill/system-spec-kit/ARCHITECTURE.md:353:npx tsx scripts/evals/check-architecture-boundaries.ts
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md:7:`check-architecture-boundaries.ts` enforces both rules as part of `npm run check`. GAP A walks all `.ts` files in `shared/`, extracts module specifiers (skipping block and line comments), and flags any import matching relative paths to `mcp_server/` or `scripts/` at any depth, or package-form `@spec-kit/mcp-server/` or `@spec-kit/scripts/`. This is an absolute prohibition with no allowlist.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md:17:| `mcp_server/lib/architecture/check-architecture-boundaries.ts` | Lib | Architecture boundary enforcement |
.opencode/skill/system-spec-kit/scripts/evals/README.md:45:| `check-architecture-boundaries.ts` | Enforce shared/ neutrality and mcp_server/scripts/ wrapper-only rules |
.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:1957:`check-architecture-boundaries.ts` enforces both rules as part of `npm run check`. GAP A walks all `.ts` files in `shared/`, extracts module specifiers (skipping block and line comments), and flags any import matching relative paths to `mcp_server/` or `scripts/` at any depth, or package-form `@spec-kit/mcp-server/` or `@spec-kit/scripts/`. This is an absolute prohibition with no allowlist.
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/package.json && printf '\\n' && sed -n '1,120p' .opencode/skill/system-spec-kit/package.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
{
  "name": "@spec-kit/mcp-server",
  "version": "1.7.2",
  "description": "Semantic Memory MCP Server - provides 28 tools for semantic search, memory management, validation, checkpoints, causal graphs, session learning, and auto-indexing",
  "main": "dist/context-server.js",
  "exports": {
    ".": "./dist/context-server.js",
    "./*.js": "./dist/*.js",
    "./*": "./dist/*.js"
  },
  "bin": {
    "context-server": "./dist/context-server.js",
    "spec-kit-cli": "./dist/cli.js"
  },
  "scripts": {
    "start": "node dist/context-server.js",
    "check": "npm run lint && npx tsc --noEmit",
    "check:full": "npm run check && npm run test",
    "lint": "eslint . --ext .ts",
    "test": "vitest run",
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "--level|--dry-run|--json|--strict|--quiet|--verbose|Detect|Auto-fix|Suggest|Report|before/after diff|exit code|validate.sh|level 1|level 2|level 3|level 4" .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
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
 exited 2 in 50ms:
rg: unrecognized flag --level|--dry-run|--json|--strict|--quiet|--verbose|Detect|Auto-fix|Suggest|Report|before/after diff|exit code|validate.sh|level 1|level 2|level 3|level 4
 succeeded in 50ms:
// -----------------------------------------------------------------------------
// TEST: Progressive Validation Pipeline
// -----------------------------------------------------------------------------
// Tests for progressive-validate.sh — the 4-level progressive validation
// wrapper around validate.sh.
//
// Covers:
//   T-PB2-01  Level 1 detect — same behaviour as validate.sh
//   T-PB2-02  Auto-fix: missing dates corrected
//   T-PB2-03  Auto-fix: heading levels normalized
//   T-PB2-04  Auto-fix: whitespace normalized
//   T-PB2-05  ALL auto-fixes logged with before/after diff
//   T-PB2-06  Suggest level presents issues with guided options
//   T-PB2-07  Report level produces structured output
//   T-PB2-08  --dry-run: shows changes without applying
//   T-PB2-09  Exit code compatibility (0 / 1 / 2)
//   T-PB2-10  --json produces parseable structured output
//   T-PB2-11  --level 1 stops after detect
//   T-PB2-12  --level 2 runs detect + auto-fix only
//   T-PB2-13  --level 3 runs detect + auto-fix + suggest
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "chokidar|debounce|SHA-256|hash|content-hash|SQLITE_BUSY|backoff|filesReindexed|avgReindexTimeMs|stderr|SPECKIT_FILE_WATCHER|unlink|removeFn|rename|2-second|2 second|metrics" .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts .opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:106:      debounceMs: 50,
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:116:    await fs.unlink(filePath);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:135:      debounceMs: 30,
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:163:  it('silently ignores ENOENT when file is removed before debounce execution', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:172:      debounceMs: 80,
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:180:    await fs.unlink(filePath);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:187:  it('calls removeFn when a markdown file is deleted', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:191:    const removeFn = vi.fn(async () => undefined);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:196:      removeFn,
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:197:      debounceMs: 50,
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:203:    await fs.unlink(filePath);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:204:    await waitFor(() => removeFn.mock.calls.length >= 1, { timeoutMs: 4000 });
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:206:    expect(removeFn).toHaveBeenCalledWith(filePath);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:209:  it('retries SQLITE_BUSY with exponential backoff before succeeding', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:213:    const sqliteBusyError = Object.assign(new Error('busy'), { code: 'SQLITE_BUSY' });
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:222:      debounceMs: 30,
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:250:      debounceMs: 100,
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:267:  it('CHK-078: rapid consecutive saves debounced to exactly 1 re-index', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:269:    const filePath = path.join(tempDir, 'debounce-test.md');
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:276:      debounceMs: 200,
exec
/bin/zsh -lc "sed -n '320,400p' .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  });
  watcher.on('unlink', (targetPath: unknown) => {
    scheduleRemove(targetPath);
  });
  watcher.on('error', (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[file-watcher] Watcher error: ${message}`);
  });

  const originalClose = watcher.close.bind(watcher);
  watcher.close = async () => {
    isClosing = true;
    for (const timeout of debounceTimers.values()) {
      clearTimeout(timeout);
    }
    debounceTimers.clear();

    while (inFlightReindex.size > 0) {
      await Promise.allSettled(Array.from(inFlightReindex));
    }
exec
/bin/zsh -lc "rg -n \"SPECKIT_FILE_WATCHER|startFileWatcher\\(|getWatcherMetrics\\(|file-watcher\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:98:import { startFileWatcher, type FSWatcher } from './lib/ops/file-watcher';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:649:      // Non-throwing by design: file-watcher path must not crash the server.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:          fileWatcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/README.md:759:| `SPECKIT_FILE_WATCHER`          | `false` | Enable chokidar-based real-time markdown re-indexing |
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:12:import { __testables, startFileWatcher } from '../lib/ops/file-watcher';
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:57:describe('file-watcher path filters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:79:describe('file-watcher runtime behavior', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:103:    const watcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:132:    const watcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:169:    const watcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:193:    const watcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:219:    const watcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:247:    const watcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:273:    const watcher = startFileWatcher({
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:75:// Sprint 9 fix: SQLITE_BUSY retry delays (matches file-watcher pattern).
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:36:function getWatcherMetrics(): { filesReindexed: number; avgReindexTimeMs: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:111:export function startFileWatcher(config: WatcherConfig): FSWatcher {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:188:        console.warn(`[file-watcher] Watch task failed for ${path.basename(filePath)}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:245:          console.warn(`[file-watcher] Skipping reindex outside watch roots: ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:283:          console.error(`[file-watcher] Reindexed ${path.basename(filePath)} in ${reindexElapsed}ms (total: ${filesReindexed} files, avg: ${Math.round(totalReindexTimeMs / filesReindexed)}ms)`);
exec
/bin/zsh -lc "sed -n '180,215p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '940,990p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
}

/**
 * P1-4: Contextual tree headers for Stage 4 result enrichment.
 * Default: TRUE. Set SPECKIT_CONTEXT_HEADERS=false to disable.
 */
export function isContextHeadersEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONTEXT_HEADERS');
}

/**
 * P1-7: Real-time file watcher for markdown reindexing.
 * Default: FALSE. Set SPECKIT_FILE_WATCHER=true to enable.
 * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
 */
export function isFileWatcherEnabled(): boolean {
  if (process.env.SPECKIT_FILE_WATCHER?.toLowerCase().trim() !== 'true') return false;
  return isFeatureEnabled('SPECKIT_FILE_WATCHER');
}

 succeeded in 51ms:
      const message = sessionErr instanceof Error ? sessionErr.message : String(sessionErr);
      console.warn('[context-server] Session manager failed:', message);
    }

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
exec
/bin/zsh -lc 'rg -n "removeIndexedMemoriesForFile|function removeIndexedMemoriesForFile|const removeIndexedMemoriesForFile" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:611:async function removeIndexedMemoriesForFile(filePath: string): Promise<void> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:970:              await removeIndexedMemoriesForFile(filePath);
exec
/bin/zsh -lc "sed -n '600,640p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    runCleanupStep('transport', () => {
      if (transport) {
        transport.close();
      }
    });
    clearTimeout(forceExitTimer);
    process.exit(0);
  })();
}

/** Remove indexed rows for watcher delete and rename events. */
async function removeIndexedMemoriesForFile(filePath: string): Promise<void> {
  const database = vectorIndex.getDb();
  if (!database) {
    return;
  }

  const canonicalPath = getCanonicalPathKey(filePath);
  let rows: Array<{ id: number }> = [];

exec
/bin/zsh -lc "sed -n '640,690p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
        deletedCount += 1;
      }
    }
  }

  if (deletedCount > 0) {
    try {
      runPostMutationHooks('delete', { filePath, deletedCount });
    } catch (_error: unknown) {
      // Non-throwing by design: file-watcher path must not crash the server.
    }
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err: Error) => {
  console.error('[context-server] Uncaught exception:', err);
  runCleanupStep('sessionManager', () => sessionManager.shutdown());
exec
/bin/zsh -lc "rg -n \"export function deleteMemory|function deleteMemory|deleteMemory\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:

exec
/bin/zsh -lc "rg -n \"deleteMemory\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:639:      if (vectorIndex.deleteMemory(row.id)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:172:      if (vectorIndex.deleteMemory(memory.id)) {
.opencode/skill/system-spec-kit/mcp_server/cli.ts:301:      if (vectorIndex.deleteMemory(memory.id)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:226:        if (vectorIndex.deleteMemory(staleRecordId)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:70:        deletedCount = vectorIndex.deleteMemory(numericId) ? 1 : 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:163:          if (vectorIndex.deleteMemory(memory.id)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:194:        if (vectorIndex.deleteMemory(memory.id)) {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:796:      const result = mod.deleteMemory(sacrificialId);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:804:      const result = mod.deleteMemory(999999);
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg 'vector-index' && sed -n '760,860p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts
exec
/bin/zsh -lc 'rg -n "deleteMemory" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:547:export { delete_memory as deleteMemory };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:548:export { delete_memory_by_path as deleteMemoryByPath };
exec
/bin/zsh -lc "sed -n '500,570p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

  try {
    const database = initialize_db();
    const result = database.prepare(`
      UPDATE memory_index
      SET embedding_status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(status, id);

    return result.changes > 0;
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${get_error_message(error)}`);
    return false;
  }
}

/**
 * Updates the confidence value for a memory.
 * @param memory_id - The memory identifier.
 * @param confidence - The confidence value to store.
exec
/bin/zsh -lc "rg -n \"function delete_memory|export function delete_memory|const delete_memory\" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts && sed -n '190,280p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
350:export function delete_memory(id: number): boolean {
354:  const delete_memory_tx = database.transaction(() => {
406:export function delete_memory_by_path(spec_folder: string, file_path: string, anchor_id: string | null = null): boolean {
  if (existing) {
    database.prepare(`
      UPDATE memory_index
      SET title = ?,
          trigger_phrases = ?,
          importance_weight = ?,
          canonical_file_path = ?,
          embedding_status = 'pending',
          failure_reason = ?,
          updated_at = ?,
          encoding_intent = COALESCE(?, encoding_intent),
          document_type = ?,
          spec_level = ?,
          content_text = ?,
          quality_score = ?,
          quality_flags = ?
      WHERE id = ?
exec
/bin/zsh -lc "sed -n '350,430p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
export function delete_memory(id: number): boolean {
  const database = initialize_db();
  const sqlite_vec = get_sqlite_vec_available();

  const delete_memory_tx = database.transaction(() => {
    database.prepare('DELETE FROM memory_history WHERE memory_id = ?').run(id);

    if (sqlite_vec) {
      try {
        database.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(id));
      } catch (e: unknown) {
        console.warn(`[vector-index] Vector deletion failed for memory ${id}: ${get_error_message(e)}`);
      }
    }

    // AI-WHY: Fix #20 (017-refinement-phase-6) — Clean all ancillary records
    const ancillaryTables = [
      'DELETE FROM degree_snapshots WHERE memory_id = ?',
      'DELETE FROM community_assignments WHERE memory_id = ?',
      'DELETE FROM memory_summaries WHERE memory_id = ?',
codex
I’ve confirmed a few stale patterns already: some snippets point at files that moved into `scripts/`, and at least one feature description mixes two different implementations with similar names. I’m now checking the admin CLI and governance entries, since those tend to drift when flags and maintenance flows evolve.
exec
/bin/zsh -lc "sed -n '1,380p' .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
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
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Schema Downgrade (v16 -> v15)
// ---------------------------------------------------------------
// AI-WHY: Targeted downgrade utility for removing chunking columns added in v16:
//   - parent_id
//   - chunk_index
//   - chunk_label
// This intentionally supports ONLY v16 -> v15.
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';
import * as checkpoints from './checkpoints';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

interface SchemaDowngradeOptions {
  specFolder?: string;
  checkpointName?: string;
exec
/bin/zsh -lc "sed -n '380,520p' .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
    includeConstitutional: true,
    includeSpecDocs: true,
  });

  // Extract summary from MCP response
  try {
    const text = result?.content?.[0]?.text;
    if (text) {
      const envelope = JSON.parse(text);
      if (envelope.data) {
        const d = envelope.data;
        console.log(`\n  Results:`);
        console.log(`    Indexed:   ${d.indexed ?? 0}`);
        console.log(`    Updated:   ${d.updated ?? 0}`);
        console.log(`    Skipped:   ${d.skipped ?? 0}`);
        console.log(`    Errors:    ${d.errors ?? 0}`);
      } else {
        console.log(`\n  ${envelope.summary || 'Scan complete'}`);
      }
    }
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"export function is[A-Z].*\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | wc -l" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | wc -l' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
      23
 succeeded in 52ms:
    1253
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -o "SPECKIT_[A-Z0-9_]+" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sort -u | wc -l' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -o "SPECKIT_[A-Z0-9_]+" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sort -u' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Feature Flag Ceiling Test (A10-P2-2)
// ---------------------------------------------------------------
// TEST: Validates system stability when 6+ SPECKIT_* flags are
//       activated simultaneously. Tests for flag interaction issues,
//       initialization crashes, and mutual-exclusion conflicts.
// ---------------------------------------------------------------

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  isMMREnabled,
  isTRMEnabled,
  isMultiQueryEnabled,
  isCrossEncoderEnabled,
  isSearchFallbackEnabled,
  isFolderDiscoveryEnabled,
  isDocscoreAggregationEnabled,
  isSaveQualityGateEnabled,
  isReconsolidationEnabled,
  isNegativeFeedbackEnabled,
 succeeded in 50ms:
     354
 succeeded in 52ms:
Total output lines: 354

.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:SPECKIT_ADAPTIVE_FUSION
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:SPECKIT_EXTENDED_TELEMETRY
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_ABLATION
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_ADAPTIVE_FUSION
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_AUTO_ENTITIES
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_CAUSAL_BOOST
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_CHANNEL_MIN_REP
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_CLASSIFICATION_DECAY
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_COMPLEXITY_ROUTER
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_CONFIDENCE_TRUNCATION
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_CONTEXT_HEADERS
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_CROSS_ENCODER
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_DEGREE_BOOST
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_DYNAMIC_INIT
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_DYNAMIC_TOKEN_BUDGET
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_EMBEDDING_EXPANSION
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_ENTITY_LINKING
.opencode/skill/system-spec-kit/mcp_server/README.md:SPECKIT_ENTITY_LINKING_MAX_DENSITY
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -o --no-filename "SPECKIT_[A-Z0-9_]+" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sort -u' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -o --no-filename "SPECKIT_[A-Z0-9_]+" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sort -u | wc -l' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Search Feature Flags Tests
// ---------------------------------------------------------------
// TEST: Search Feature Flags

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as crossEncoder from '../lib/search/cross-encoder';
import {
  isCrossEncoderEnabled,
  isContextHeadersEnabled,
  isMMREnabled,
  isMultiQueryEnabled,
  isTRMEnabled,
} from '../lib/search/search-flags';

const FLAG_NAMES = [
  'SPECKIT_MMR',
  'SPECKIT_TRM',
  'SPECKIT_MULTI_QUERY',
  'SPECKIT_CROSS_ENCODER',
 succeeded in 53ms:
      79
 succeeded in 53ms:
SPECKIT_ABLATION
SPECKIT_ADAPTIVE_FUSION
SPECKIT_ARCHIVAL
SPECKIT_AUTO_ENTITIES
SPECKIT_AUTO_RESUME
SPECKIT_BM25
SPECKIT_CAUSAL_BOOST
SPECKIT_CHANNEL_MIN_REP
SPECKIT_CLASSIFICATION_DECAY
SPECKIT_COACTIVATION
SPECKIT_COACTIVATION_STRENGTH
SPECKIT_COGNITIVE_COACTIVATION_FLAGS
SPECKIT_COGNITIVE_COACTIVATION_PATTERN
SPECKIT_COMMUNITY_DETECTION
SPECKIT_COMPLEXITY_ROUTER
SPECKIT_CONFIDENCE_TRUNCATION
SPECKIT_CONSOLIDATION
SPECKIT_CONSUMPTION_LOG
SPECKIT_CONTEXT_HEADERS
SPECKIT_CROSS_ENCODER
exec
/bin/zsh -lc 'rg -n "SPECKIT_ADAPTIVE_FUSION|SPECKIT_COACTIVATION_STRENGTH|SPECKIT_PRESSURE_POLICY|SPECKIT_PIPELINE_V2|SPECKIT_ABLATION|SPECKIT_FILE_WATCHER" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -o --no-filename --glob '"'!**/tests/**'"' --glob '"'!**/*.md'"' 'SPECKIT_[A-Z0-9_]+' .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sort -u" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -o --no-filename --glob '"'!**/tests/**'"' --glob '"'!**/*.md'"' 'SPECKIT_[A-Z0-9_]+' .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sort -u | wc -l" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:98: * 017-refinement-phase-6 Sprint 1. The SPECKIT_PIPELINE_V2 env var is
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:192: * Default: FALSE. Set SPECKIT_FILE_WATCHER=true to enable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:196:  if (process.env.SPECKIT_FILE_WATCHER?.toLowerCase().trim() !== 'true') return false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:197:  return isFeatureEnabled('SPECKIT_FILE_WATCHER');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:130:Controlled ablation studies for search channel contribution analysis. Selectively disables one search channel at a time (vector, bm25, fts5, graph, trigger), measures Recall@20 delta against a full-pipeline baseline, and uses a paired sign-test for statistical significance. Results are stored in `eval_metric_snapshots` with negative timestamp IDs. Gated behind `SPECKIT_ABLATION=true`. Added in Sprint 7.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:45:      "query": "SPECKIT_ADAPTIVE_FUSION flag is not working when set to false",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:90:      "expectedResultDescription": "Should surface memory-context.ts SPECKIT_PRESSURE_POLICY handling, the getPressureLevel function, and any spec/memory about pressure policy design decisions.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:695:      "query": "SPECKIT_PRESSURE_POLICY token budget downgrade",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:701:      "notes": "Derived from SPECKIT_PRESSURE_POLICY env var trigger phrase — overlaps with seed query 9 but phrased differently."
.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:76:const FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:4:// Sprint 5 (R6): 4-stage pipeline execution behind SPECKIT_PIPELINE_V2
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:19:// SPECKIT_ABLATION=true. Every public function is wrapped in try-catch
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:42: * Returns true only when SPECKIT_ABLATION=true (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:46:  return process.env.SPECKIT_ABLATION?.toLowerCase() === 'true';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:79:The search pipeline (R6, `SPECKIT_PIPELINE_V2`) decomposes retrieval into four bounded stages with strict responsibilities. Each stage has clear input/output contracts defined in `pipeline/types.ts`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:139:- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:268:| `adaptive-fusion.ts`       | -      | TypeScript | Intent-aware weighted RRF with dark-run mode, feature flag SPECKIT_ADAPTIVE_FUSION |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:371:| `SPECKIT_PIPELINE_V2`     | `true`  | Enable 4-stage retrieval pipeline (R6) |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:98:| **Pressure-Aware Mode**      | `SPECKIT_PRESSURE_POLICY` enables token pressure monitoring for context window management | Prevents context overflow          |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1054:| `SPECKIT_PRESSURE_POLICY` | false   | Enable pressure-aware mode for token budget monitoring and context window management |
 succeeded in 51ms:
SPECKIT_ABLATION
SPECKIT_ADAPTIVE_FUSION
SPECKIT_ARCHIVAL
SPECKIT_AUTO_ENTITIES
SPECKIT_AUTO_RESUME
SPECKIT_BM25
SPECKIT_CAUSAL_BOOST
SPECKIT_CHANNEL_MIN_REP
SPECKIT_CLASSIFICATION_DECAY
SPECKIT_COACTIVATION
SPECKIT_COACTIVATION_STRENGTH
SPECKIT_COGNITIVE_COACTIVATION_FLAGS
SPECKIT_COGNITIVE_COACTIVATION_PATTERN
SPECKIT_COMMUNITY_DETECTION
SPECKIT_COMPLEXITY_ROUTER
SPECKIT_CONFIDENCE_TRUNCATION
SPECKIT_CONSOLIDATION
SPECKIT_CONSUMPTION_LOG
SPECKIT_CONTEXT_HEADERS
SPECKIT_CROSS_ENCODER
 succeeded in 51ms:
      75
exec
/bin/zsh -lc 'rg -n "SPECKIT_SHADOW_SCORING|SPECKIT_RSF_FUSION|shadow scoring|rsf" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "computeStructuralFreshness|computeGraphCentrality|isInShadowPeriod" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"isShadowScoringEnabled|isRsfEnabled|stmtCache|lastComputedAt|activeProvider|flushCount|decayInterval|attentionDecayRate|minAttentionScore|computeCausalDepth\\(|getSubgraphWeights|RECOVERY_HALF_LIFE_DAYS|logCoActivationEvent|export type CoActivationEvent|interface CoActivationEvent|type CoActivationEvent\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 257

.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:11:  rsfScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:80: * 5. Sort descending by rsfScore
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:85: * @returns Fused RsfResult array sorted descending by rsfScore.
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:133:    let rsfScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:142:      rsfScore = (entryA.normalizedScore + entryB.normalizedScore) / 2;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:149:      rsfScore = entryA.normalizedScore * 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:156:      rsfScore = entryB.normalizedScore * 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:163:    rsfScore = clamp01(rsfScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:167:      rsfScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:173:  // --- Step 5: Sort descending by rsfScore ---
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:175:    .sort((a, b) => b.rsfScore - a.rsfScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:189: * 5. Sort descending by rsfScore, clamp to [0, 1]
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:192: * @returns Fused RsfResult array sorted descending by rsfScore.
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:257:    let rsfScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:260:      rsfScore = avgScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:263:      rsfScore = avgScore * (countPresent / totalSources);
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:266:    rsfScore = clamp01(rsfScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:270:      rsfScore,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:138:  it('fsrs exports: computeStructuralFreshness, computeGraphCentrality', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:140:    expect(typeof mod.computeStructuralFreshness).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:141:    expect(typeof mod.computeGraphCentrality).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:304:    const shadowMode = isInShadowPeriod(db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:404:function isInShadowPeriod(db: Database): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:445:    if (isInShadowPeriod(db)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:10: * Minimal graph interface required by `computeGraphCentrality`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:39:export function computeStructuralFreshness(
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:62:export function computeGraphCentrality(
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:2:// Previously tested getSubgraphWeights, which was removed as dead code.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:3:// getSubgraphWeights always returned { causalWeight: 1.0 } regardless of intent.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:9:  it('getSubgraphWeights was removed — causal weight is inlined as 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:501:      // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:508:      // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:565:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:575:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:585:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:594:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:606:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:658:    // isShadowScoringEnabled removed — shadow scoring permanently disabled
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:507:  // AI-GUARD: no-op: activeProvider cache removed (was never populated)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:609:// Multiplies scores by attentionDecayRate (0.95), removes below threshold
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:625:attentionDecayRate: 0.95      // 95% retention per decay cycle
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:626:minAttentionScore: 0.1        // Below this = evicted
exec
/bin/zsh -lc 'rg -n "specFolderLocks|SPEC_FOLDER_LOCKS" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88:const SPEC_FOLDER_LOCKS = new Map<string, Promise<unknown>>();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:92:  const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:95:  SPEC_FOLDER_LOCKS.set(normalizedFolder, chain);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:99:    if (SPEC_FOLDER_LOCKS.get(normalizedFolder) === chain) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:100:      SPEC_FOLDER_LOCKS.delete(normalizedFolder);
exec
/bin/zsh -lc 'rg -n "check-architecture-boundaries|shared neutrality|wrapper-only|mcp_server/scripts" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/scripts/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

codex
I’ve got enough context to score each feature now. The main pattern is clear: several descriptions still match the code, but a number of “Source Files” sections are stale because implementations moved from `mcp_server/` into `scripts/`, or because the feature is actually spread across multiple files that aren’t listed.
codex
---
FEATURE: 01-tree-thinning-for-spec-folder-consolidation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: scripts/core/tree-thinning.ts, scripts/core/workflow.ts, scripts/tests/tree-thinning.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The described thresholds and `applyTreeThinning()` flow match the current script-based implementation, but the listed `mcp_server/lib/chunking/*` files implement chunk thinning before indexing, which is a different feature.
---
FEATURE: 02-architecture-boundary-enforcement.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/lib/architecture/check-architecture-boundaries.ts
MISSING_CODE_PATHS: scripts/evals/check-architecture-boundaries.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The enforcement logic exists and matches the described GAP A/GAP B checks, but it lives in `scripts/evals/`, not `mcp_server/lib/architecture/`, and it is not wired into current `npm run check`. The listed `mcp_server/tests/layer-definitions.vitest.ts` file exists but does not test this feature.
---
FEATURE: 03-progressive-validation-for-spec-documents.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: scripts/progressive-validate.sh
MISSING_CODE_PATHS: scripts/spec/progressive-validate.sh, scripts/spec/validate.sh, scripts/tests/progressive-validation.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The 4-level wrapper, flags, dry-run behavior, and exit-code compatibility are implemented, but the script moved under `scripts/spec/`.
---
FEATURE: 04-dead-code-removal.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/learned-feedback.ts, mcp_server/lib/search/fsrs.ts, mcp_server/lib/search/cross-encoder.ts, mcp_server/lib/cognitive/co-activation.ts
SEVERITY: LOW
RECOMMENDED_ACTION: BOTH
NOTES: The named removals and preserved items are consistent with current code, but the exact “approximately 360 lines” claim is historical and not directly derivable from current source alone. No affected modules are listed.
---
FEATURE: 05-code-standards-alignment.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/cli.ts, mcp_server/handlers/memory-save.ts
SEVERITY: LOW
RECOMMENDED_ACTION: BOTH
NOTES: Current code clearly reflects the standards work (`MODULE` headers, `AI-WHY`/`AI-TRACE`/`AI-GUARD` comments, `SPEC_FOLDER_LOCKS`), but the exact “45 violations found and fixed” breakdown is historical and not directly verifiable from present code. No source files are listed.
---
FEATURE: 06-real-time-filesystem-watching-with-chokidar.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The chokidar watcher, 2s debounce, SHA-256 dedup, busy retries, stderr timing logs, and default-off gating are present. However, `getWatcherMetrics()` exists but is not exported, and the enablement/wiring live outside `file-watcher.ts`.
---
FEATURE: 07-standalone-admin-cli.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-index.ts, mcp_server/lib/storage/mutation-ledger.ts, mcp_server/core/index.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The 4 commands and most behaviors match current code, including transaction-wrapped bulk delete, checkpointing, and mutation-ledger recording. The entrypoint is effectively the bin/compiled `dist/cli.js` path rather than a generic `node cli.js` source invocation, and key implementation files are omitted.
---
FEATURE: 08-watcher-delete-rename-cleanup.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/lib/search/vector-index-mutations.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `unlink` handling and cleanup are real, but the actual purge logic is in `context-server.ts` plus `vector-index` deletion code, not in `file-watcher.ts` alone. Rename is effectively `unlink` + `add`, but the debounce is per path, so it does not collapse the whole rename into one single cycle.
---
FEATURE: 01-feature-flag-governance.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tests/flag-ceiling.vitest.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: I found no hard runtime-enforced “12 active scoring signals” cap, so the core governance framing is still correct. The closest implementation artifact is automated ceiling-test coverage rather than runtime enforcement.
---
FEATURE: 02-feature-flag-sunset-audit.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/search-flags.ts, shared/algorithms/adaptive-fusion.ts, mcp_server/lib/cognitive/co-activation.ts, mcp_server/handlers/memory-context.ts, mcp_server/lib/eval/ablation-framework.ts, mcp_server/tests/flag-ceiling.vitest.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Some details still match, including 23 exported `is*` helpers in `search-flags.ts`, `isPipelineV2Enabled()` always returning true, and `SPECKIT_ABLATION` remaining opt-in. But the audit numerics are stale: current non-test/non-Markdown TypeScript under `mcp_server` + `shared` contains about 75 distinct `SPECKIT_*` tokens, and there are clearly more live operational knobs than the three named here.
---
tokens used
128,425
---
FEATURE: 01-tree-thinning-for-spec-folder-consolidation.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: scripts/core/tree-thinning.ts, scripts/core/workflow.ts, scripts/tests/tree-thinning.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The described thresholds and `applyTreeThinning()` flow match the current script-based implementation, but the listed `mcp_server/lib/chunking/*` files implement chunk thinning before indexing, which is a different feature.
---
FEATURE: 02-architecture-boundary-enforcement.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: NO
INVALID_PATHS: mcp_server/lib/architecture/check-architecture-boundaries.ts
MISSING_CODE_PATHS: scripts/evals/check-architecture-boundaries.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The enforcement logic exists and matches the described GAP A/GAP B checks, but it lives in `scripts/evals/`, not `mcp_server/lib/architecture/`, and it is not wired into current `npm run check`. The listed `mcp_server/tests/layer-definitions.vitest.ts` file exists but does not test this feature.
---
FEATURE: 03-progressive-validation-for-spec-documents.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: NO
INVALID_PATHS: scripts/progressive-validate.sh
MISSING_CODE_PATHS: scripts/spec/progressive-validate.sh, scripts/spec/validate.sh, scripts/tests/progressive-validation.vitest.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The 4-level wrapper, flags, dry-run behavior, and exit-code compatibility are implemented, but the script moved under `scripts/spec/`.
---
FEATURE: 04-dead-code-removal.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/learned-feedback.ts, mcp_server/lib/search/fsrs.ts, mcp_server/lib/search/cross-encoder.ts, mcp_server/lib/cognitive/co-activation.ts
SEVERITY: LOW
RECOMMENDED_ACTION: BOTH
NOTES: The named removals and preserved items are consistent with current code, but the exact “approximately 360 lines” claim is historical and not directly derivable from current source alone. No affected modules are listed.
---
FEATURE: 05-code-standards-alignment.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/cli.ts, mcp_server/handlers/memory-save.ts
SEVERITY: LOW
RECOMMENDED_ACTION: BOTH
NOTES: Current code clearly reflects the standards work (`MODULE` headers, `AI-WHY`/`AI-TRACE`/`AI-GUARD` comments, `SPEC_FOLDER_LOCKS`), but the exact “45 violations found and fixed” breakdown is historical and not directly verifiable from present code. No source files are listed.
---
FEATURE: 06-real-time-filesystem-watching-with-chokidar.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The chokidar watcher, 2s debounce, SHA-256 dedup, busy retries, stderr timing logs, and default-off gating are present. However, `getWatcherMetrics()` exists but is not exported, and the enablement/wiring live outside `file-watcher.ts`.
---
FEATURE: 07-standalone-admin-cli.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/memory-index.ts, mcp_server/lib/storage/mutation-ledger.ts, mcp_server/core/index.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The 4 commands and most behaviors match current code, including transaction-wrapped bulk delete, checkpointing, and mutation-ledger recording. The entrypoint is effectively the bin/compiled `dist/cli.js` path rather than a generic `node cli.js` source invocation, and key implementation files are omitted.
---
FEATURE: 08-watcher-delete-rename-cleanup.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/context-server.ts, mcp_server/lib/search/vector-index-mutations.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: `unlink` handling and cleanup are real, but the actual purge logic is in `context-server.ts` plus `vector-index` deletion code, not in `file-watcher.ts` alone. Rename is effectively `unlink` + `add`, but the debounce is per path, so it does not collapse the whole rename into one single cycle.
---
FEATURE: 01-feature-flag-governance.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/tests/flag-ceiling.vitest.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: LOW
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: I found no hard runtime-enforced “12 active scoring signals” cap, so the core governance framing is still correct. The closest implementation artifact is automated ceiling-test coverage rather than runtime enforcement.
---
FEATURE: 02-feature-flag-sunset-audit.md
DESCRIPTION_ACCURATE: NO
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/search-flags.ts, shared/algorithms/adaptive-fusion.ts, mcp_server/lib/cognitive/co-activation.ts, mcp_server/handlers/memory-context.ts, mcp_server/lib/eval/ablation-framework.ts, mcp_server/tests/flag-ceiling.vitest.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: Some details still match, including 23 exported `is*` helpers in `search-flags.ts`, `isPipelineV2Enabled()` always returning true, and `SPECKIT_ABLATION` remaining opt-in. But the audit numerics are stale: current non-test/non-Markdown TypeScript under `mcp_server` + `shared` contains about 75 distinct `SPECKIT_*` tokens, and there are clearly more live operational knobs than the three named here.
---
