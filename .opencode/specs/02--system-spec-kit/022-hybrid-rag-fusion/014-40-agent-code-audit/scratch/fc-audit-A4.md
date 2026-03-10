OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cd69c-ccc7-7781-9e2b-d4f05c20ed93
--------
user
You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 43 feature files across 3 categories. Category 14 (pipeline-architecture) is the heaviest with 21 files.

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 12-query-intelligence: 0 passes, 6 issues (1 rewrite: 02-relative-score-fusion, 4 desc+paths, 1 paths).
- Category 13-memory-quality: 0 passes, 16 issues (1 rewrite: 16-dry-run-preflight, 7 desc+paths, 7 paths, 1 desc). Also has 2 slug-utils.ts references to remove (PV-002).
- Category 14-pipeline-architecture: 0 passes, 21 issues (6 rewrites: 02-mpab, 08-performance, 10-legacy-v1, 16-backend-storage, 18-atomic-write, 21-atomic-pending-recovery, 3 desc+paths, 12 paths).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts. slug-utils.ts removed (PV-002).

YOUR ASSIGNED DIRECTORIES (43 files total):
- .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/ (6 files)
- .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/ (16 files)
- .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/ (21 files)

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
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only feature audit across the 43 catalog files you listed. First I’m going to run the required skill routing step, then I’ll inventory the feature files and start verifying their documented source paths and code claims against the actual TypeScript MCP server.
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Audit 43 feature catalog markdown files against TypeScript MCP server source code, verify documentation accuracy, file paths, and undocumented capabilities, then produce structured findings for each feature." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 635ms:
[
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !audit, !audit(multi), !findings, !intent:review, code(name)"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, !mcp(multi), !server(multi), code(name), mcp(name)"
  },
  {
    "skill": "mcp-chrome-devtools",
    "kind": "skill",
codex
SKILL ROUTING: `sk-code--review` was recommended at `0.95` confidence, so I’m using it as the primary audit workflow. I’m also checking the lightweight documentation guidance from `sk-doc` because the target artifacts are markdown feature specs, then I’ll enumerate the 43 feature files and begin the code-to-doc comparison pass.
Plan update
Audit all feature files sequentially, verifying paths and comparing documentation against implementation before producing the required structured findings.
  → Read the relevant skill guidance and inventory all assigned feature markdown files
  • Audit category 12 feature files against implementation and tests
  • Audit category 13 feature files against implementation and tests
  • Audit category 14 feature files against implementation and tests
  • Assemble the structured report for all 43 features with evidence and severity
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-doc/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture -g '*.md' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md
.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md
codex
I’ve confirmed the 43 target files. Before I go deeper into the audit pass, I’m checking whether there are any more specific `AGENTS.md` instructions inside the feature catalog or MCP server tree that would narrow the rules for these directories.
exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/sk-code--review/references/quick_reference.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files . -g 'AGENTS.md' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
---
title: Code Review Quick Reference
description: Fast execution reference for findings-first review workflow with severity handling and next-step confirmation.
---

# Code Review Quick Reference

Fast execution reference for findings-first review workflow with severity handling and next-step confirmation.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provide a compact review protocol that keeps outputs consistent, risk-focused, and actionable.

### Core Principle

 succeeded in 52ms:
./.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
./.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
./.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
./AGENTS.md
codex
The scope is clean: there aren’t deeper `AGENTS.md` files under the feature catalog or MCP server paths, so the root instructions remain the governing rules. I’m loading the OpenCode overlay now so the audit follows the repo-specific review conventions while I start extracting source tables and validating paths.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
---
name: sk-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

codex
I hit one sandbox quirk with shell here-docs, so I’m switching to direct `python -c` and plain `sed`/`rg` commands. I’m opening a couple of feature files now to lock onto the exact markdown structure before I automate the path extraction and move through the categories sequentially.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Query complexity router

## Current Reality

Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like "memory save rules" is wasted on graph traversal and BM25 scoring.

The complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers based on term count, character count, trigger phrase presence and stop-word ratio. Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.

When the `SPECKIT_COMPLEXITY_ROUTER` flag is disabled, the classifier returns "complex" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.

The router's classification tier (`routeResult.tier`) is propagated into `traceMetadata.queryComplexity` in hybrid search (CHK-038), making it available in response envelopes when `includeTrace: true`. The formatter reads this via a fallback path from `traceMetadata` when stage metadata is unavailable.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |
| `mcp_server/lib/search/query-router.ts` | Lib | Channel routing |
 succeeded in 53ms:
# Verify-fix-verify memory quality loop

## Current Reality

Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system auto-fixes by re-extracting triggers, normalizing anchors and trimming content to budget. Then it scores again.

If the second attempt still fails, a third try runs with stricter trimming. After two failed retries, the memory is rejected outright.

Rejection rates are logged per spec folder so you can spot folders that consistently produce low-quality saves. This loop catches problems at write time rather than letting bad data pollute search results.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop handler |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |

### Tests
 succeeded in 52ms:
# 4-stage pipeline refactor

## Current Reality

The retrieval pipeline was restructured into four bounded stages with clear responsibilities, a single authoritative scoring point and a strict score-immutability invariant in the final stage.

Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.

**Phase 017 update:** The query embedding is now cached at function scope for reuse in the constitutional injection path, saving one API call per search. The constitutional injection count is tracked and passed through the orchestrator to Stage 4 output metadata (previously hardcoded to 0).

Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.

**Phase 017 update:** Stage 2 now uses the shared `resolveEffectiveScore()` function from `pipeline/types.ts` (aliased as `resolveBaseScore`) for consistent score resolution. The five-factor composite weights auto-normalize to sum 1.0 after partial overrides. Cross-variant RRF fusion no longer double-counts convergence bonuses (per-variant bonus subtracted before cross-variant bonus). Adaptive fusion core weights (semantic + keyword + recency) normalize after doc-type adjustments.

Stage 3 (Rerank and Aggregate) handles optional cross-encoder reranking (gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly preserving document order.

Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.

**Phase 017 update:** The legacy `postSearchPipeline` path  was removed entirely. `isPipelineV2Enabled()` now always returns `true` regardless of the `SPECKIT_PIPELINE_V2` env var (deprecated). The V2 4-stage pipeline is the only code path. A shared `resolveEffectiveScore()` function in `pipeline/types.ts` replaced both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`, ensuring a consistent fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1]) across all stages.

exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; import re, json; cats=['12--query-intelligence','13--memory-quality-and-indexing','14--pipeline-architecture']; base=Path('.opencode/skill/system-spec-kit/feature_catalog'); out=[]
for cat in cats:
  for fp in sorted((base/cat).glob('*.md')):
    text=fp.read_text()
    cur=''
    m=re.search(r'## Current Reality\\n\\n(.*?)\\n\\n## Source Files', text, re.S)
    cur=m.group(1).strip() if m else ''
    section=re.search(r'### Implementation\\n\\n\\| File \\| Layer \\| Role \\|\\n\\|[-| ]+\\|\\n(.*?)(?:\\n\\n### Tests|\\n\\n## Source Metadata)', text, re.S)
    impl=[]
    if section:
      for line in section.group(1).strip().splitlines():
        if line.startswith('| "'`'"'):
          impl.append(line.split('"'`'"')[1])
    tsec=re.search(r'### Tests\\n\\n\\| File \\| Focus \\|\\n\\|[-| ]+\\|\\n(.*?)(?:\\n\\n## Source Metadata)', text, re.S)
    tests=[]
    if tsec:
      for line in tsec.group(1).strip().splitlines():
        if line.startswith('| "'`'"'):
          tests.append(line.split('"'`'"')[1])
    out.append({'category':cat,'feature':fp.name,'impl':impl,'tests':tests,'current':cur})
print(json.dumps(out, indent=2))\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 631ms:
  File "<string>", line 12
    if line.startswith('| ')[1])
                               ^
SyntaxError: unmatched ')'
codex
I’m switching the audit extraction to a small inline parser so I can validate tables consistently instead of hand-copying paths. Once that’s in place, I’ll move category by category and keep the evidence tied back to the exact implementation files.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re, json; cats=[\"12--query-intelligence\",\"13--memory-quality-and-indexing\",\"14--pipeline-architecture\"]; base=Path(\".opencode/skill/system-spec-kit/feature_catalog\"); out=[]
for cat in cats:
  for fp in sorted((base/cat).glob(\"*.md\")):
    text=fp.read_text()
    m=re.search(r\"## Current Reality\\n\\n(.*?)\\n\\n## Source Files\", text, re.S)
    cur=m.group(1).strip() if m else \"\"
    section=re.search(r\"### Implementation\\n\\n\\| File \\| Layer \\| Role \\|\\n\\|[-| ]+\\|\\n(.*?)(?:\\n\\n### Tests|\\n\\n## Source Metadata)\", text, re.S)
    impl=[]
    if section:
      for line in section.group(1).strip().splitlines():
        if line.startswith(\"| "'`"):
          impl.append(line.split("`")[1])
    tsec=re.search(r"### Tests'"\\n\\n\\| File \\| Focus \\|\\n\\|[-| ]+\\|\\n(.*?)(?:\\n\\n## Source Metadata)\", text, re.S)
    tests=[]
    if tsec:
      for line in tsec.group(1).strip().splitlines():
        if line.startswith(\"| "'`"):
          tests.append(line.split("`")[1])
    out.append({"category":cat,"feature":fp.name,"impl":impl,"tests":tests,"current":cur})
print(json.dumps(out, indent=2))'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 623ms:
[
  {
    "category": "12--query-intelligence",
    "feature": "01-query-complexity-router.md",
    "impl": [
      "mcp_server/lib/search/query-classifier.ts",
      "mcp_server/lib/search/query-router.ts"
    ],
    "tests": [
      "mcp_server/tests/query-classifier.vitest.ts",
      "mcp_server/tests/query-router-channel-interaction.vitest.ts",
      "mcp_server/tests/query-router.vitest.ts"
    ],
    "current": "Not all queries need the full 5-channel pipeline. A short trigger-phrase lookup like \"memory save rules\" is wasted on graph traversal and BM25 scoring.\n\nThe complexity router classifies incoming queries into simple (3 or fewer terms, or a trigger match), moderate (4-8 terms) and complex (more than 8 terms with no trigger) tiers based on term count, character count, trigger phrase presence and stop-word ratio. Simple queries run on two channels (vector and FTS), moderate on three (adding BM25) and complex on all five.\n\nWhen the `SPECKIT_COMPLEXITY_ROUTER` flag is disabled, the classifier returns \"complex\" as a safe fallback so every query still gets the full pipeline. The minimum 2-channel invariant is enforced at the router level.\n\nThe router's classification tier (`routeResult.tier`) is propagated into `traceMetadata.queryComplexity` in hybrid search (CHK-038), making it available in response envelopes when `includeTrace: true`. The formatter reads this via a fallback path from `traceMetadata` when stage metadata is unavailable."
  },
  {
    "category": "12--query-intelligence",
    "feature": "02-relative-score-fusion-in-shadow-mode.md",
    "impl": [
      "mcp_server/lib/search/rsf-fusion.ts",
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; cats=[\"12--query-intelligence\",\"13--memory-quality-and-indexing\",\"14--pipeline-architecture\"]; base=Path(\".opencode/skill/system-spec-kit/feature_catalog\"); root=Path(\".opencode/skill/system-spec-kit\");
for cat in cats:
  for fp in sorted((base/cat).glob(\"*.md\")):
    text=fp.read_text()
    paths=[]
    for m in re.finditer(r\"\\| "'`([''^`]+)` ", text):
      paths.append(m.group(1))
    bad=[p for p in paths if not (root/p).is_file()]
    if bad:
      print(fp.name)
      for p in bad:
        print("  MISSING", p)
'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 623ms:
06-query-expansion.md
  MISSING mcp_server/tests/retry.vitest.ts
02-signal-vocabulary-expansion.md
  MISSING mcp_server/tests/retry.vitest.ts
05-pre-storage-quality-gate.md
  MISSING mcp_server/tests/retry.vitest.ts
06-reconsolidation-on-save.md
  MISSING mcp_server/tests/retry.vitest.ts
11-content-aware-memory-filename-generation.md
  MISSING mcp_server/lib/parsing/slug-utils.ts
12-generation-time-duplicate-and-empty-content-prevention.md
  MISSING mcp_server/tests/retry.vitest.ts
14-quality-gate-timer-persistence.md
  MISSING mcp_server/tests/retry.vitest.ts
01-4-stage-pipeline-refactor.md
  MISSING mcp_server/tests/retry.vitest.ts
07-search-pipeline-safety.md
  MISSING mcp_server/tests/retry.vitest.ts
10-legacy-v1-pipeline-removal.md
  MISSING mcp_server/tests/retry.vitest.ts
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; cats=[\"12--query-intelligence\",\"13--memory-quality-and-indexing\",\"14--pipeline-architecture\"]; base=Path(\".opencode/skill/system-spec-kit/feature_catalog\");
for cat in cats:
  for fp in sorted((base/cat).glob(\"*.md\")):
    text=fp.read_text()
    if \"No dedicated source files\" in text:
      print(cat, fp.name)
'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 617ms:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-n2g8aRKk' (errno=Operation not permitted)
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-olWXLOil' (errno=Operation not permitted)
codex
I’ve finished the first mechanical pass of path validation. So far the invalid references line up with the prior audit hints: repeated `mcp_server/tests/retry.vitest.ts` references that should likely be `retry-manager.vitest.ts`, plus a stale `slug-utils` path. I’m now moving into the code-behavior comparison for category 12 so the findings are anchored in the actual implementation instead of just the broken tables.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Query Router
     3	// ---------------------------------------------------------------
     4	// Tier-to-channel-subset routing for query complexity (Sprint 3, T001b)
     5	// Maps classifier tiers to channel subsets for selective pipeline execution.
     6	
     7	import {
     8	  classifyQueryComplexity,
     9	  isComplexityRouterEnabled,
    10	  type QueryComplexityTier,
    11	  type ClassificationResult,
    12	} from './query-classifier';
    13	
    14	/* -----------------------------------------------------------
    15	   1. TYPES & CONSTANTS
    16	----------------------------------------------------------------*/
    17	
    18	/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
    19	type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
    20	
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Query Classifier
     3	// ---------------------------------------------------------------
     4	/* --- 1. TYPES & CONSTANTS --- */
     5	
     6	type QueryComplexityTier = 'simple' | 'moderate' | 'complex';
     7	
     8	interface ClassificationResult {
     9	  tier: QueryComplexityTier;
    10	  features: {
    11	    termCount: number;
    12	    charCount: number;
    13	    hasTriggerMatch: boolean;
    14	    stopWordRatio: number;
    15	  };
    16	  confidence: 'high' | 'medium' | 'low' | 'fallback';
    17	}
    18	
    19	/** Config-driven thresholds */
    20	const SIMPLE_TERM_THRESHOLD = 3;
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Query Expander
     3	// ---------------------------------------------------------------
     4	// Rule-based synonym expansion for mode="deep" multi-query RAG.
     5	// No LLM calls — purely rule-based template substitution.
     6	
     7	/* ---------------------------------------------------------------
     8	   1. CONSTANTS
     9	   --------------------------------------------------------------- */
    10	
    11	const MAX_VARIANTS = 3;
    12	
    13	/** Escape special regex characters in user input to prevent ReDoS (P1-6). */
    14	function escapeRegExp(str: string): string {
    15	  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    16	}
    17	
    18	/**
    19	 * Domain vocabulary map for server-side synonym expansion.
    20	 * No LLM calls — purely rule-based template substitution.
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Dynamic Token Budget
     3	// ---------------------------------------------------------------
     4	//
     5	// ADVISORY-ONLY: This module computes a token budget for a query
     6	// based on its complexity tier, but does NOT enforce that budget
     7	// downstream. The returned BudgetResult is handed to callers who
     8	// are solely responsible for respecting it (e.g. by trimming
     9	// result sets or truncating content before sending to the LLM).
    10	// ---------------------------------------------------------------
    11	import { type QueryComplexityTier } from './query-classifier';
    12	
    13	/* --- 1. TYPES & CONSTANTS --- */
    14	
    15	/** Budget (in tokens) allocated per complexity tier. */
    16	interface TokenBudgetConfig {
    17	  /** Simple query budget: 1500 tokens. */
    18	  simple: number;
    19	  /** Moderate query budget: 2500 tokens. */
    20	  moderate: number;
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Channel Representation
     3	// ---------------------------------------------------------------
     4	/* --- 1. CONSTANTS --- */
     5	
     6	/** Minimum similarity / relevance score for a result to qualify for promotion.
     7	 * AI-WHY: QUALITY_FLOOR changed from 0.2 to 0.005 (Sprint 10, D3). The original 0.2
     8	 * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
     9	 * threshold, causing channel-representation promotion to silently reject ALL RRF results.
    10	 * The 0.005 floor prevents promoting genuinely irrelevant results while remaining
    11	 * compatible with both raw RRF scores and normalized [0,1] scores. */
    12	export const QUALITY_FLOOR = 0.005;
    13	
    14	/** Env-var name for the feature flag. */
    15	const FEATURE_FLAG = 'SPECKIT_CHANNEL_MIN_REP';
    16	
    17	/* --- 2. INTERFACES --- */
    18	
    19	/** A single item that may appear in a top-k result set. */
    20	interface TopKItem {
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: RSF Fusion
     3	// ---------------------------------------------------------------
     4	import type { RrfItem, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
     5	
     6	/* --- 1. INTERFACES --- */
     7	
     8	/** Result of RSF fusion: an RrfItem augmented with normalized fused score and source tracking. */
     9	interface RsfResult extends RrfItem {
    10	  /** Relative Score Fusion score, clamped to [0, 1]. */
    11	  rsfScore: number;
    12	  /** Sources that contributed to this result. */
    13	  sources: string[];
    14	  /** Per-source normalized scores. */
    15	  sourceScores: Record<string, number>;
    16	}
    17	
    18	/* --- 2. HELPERS --- */
    19	
    20	/**
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Embedding Expansion
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Sprint 5 Phase B — semantic query expansion using embedding similarity.
     5	//
     6	// R12/R15 Mutual Exclusion:
     7	//   When the R15 query complexity classifier returns tier = "simple",
     8	// embedding expansion is suppressed entirely. This prevents unnecessary
     9	//   latency on short, well-defined queries that benefit from exact matches
    10	//   rather than semantic broadening.
    11	//
    12	// Feature Flag:
    13	//   Controlled by SPECKIT_EMBEDDING_EXPANSION (default: ON, graduated).
    14	//   Set to 'false' to disable. If disabled, expandQueryWithEmbeddings()
    15	//   returns immediately with an identity result (original query only,
    16	//   no expanded terms).
    17	// ---------------------------------------------------------------
    18	
    19	import { isEmbeddingExpansionEnabled } from './search-flags';
    20	import { classifyQueryComplexity } from './query-classifier';
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Confidence Truncation
     3	// ---------------------------------------------------------------
     4	/* --- 1. TYPES & CONSTANTS --- */
     5	
     6	/** Generic scored result for truncation — supports both numeric and string IDs. */
     7	interface ScoredResult {
     8	  id: number | string;
     9	  score: number;
    10	  [key: string]: unknown;
    11	}
    12	
    13	/** Result of a truncation operation with full audit metadata. */
    14	interface TruncationResult {
    15	  results: ScoredResult[];
    16	  truncated: boolean;
    17	  originalCount: number;
    18	  truncatedCount: number;
    19	  /** Inclusive index of the last kept result (0-based). */
    20	  cutoffIndex: number;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts | sed -n '260,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   260	    // FTS and embedding re-encoding without requiring a separator token.
   261	    const combinedQuery = `${query} ${expanded.join(' ')}`;
   262	
   263	    return {
   264	      original: query,
   265	      expanded,
   266	      combinedQuery,
   267	    };
   268	  } catch (err: unknown) {
   269	    const msg = err instanceof Error ? err.message : String(err);
   270	    console.warn(`[embedding-expansion] Expansion failed, using original query: ${msg}`);
   271	    return identityResult(query);
   272	  }
   273	}
   274	
   275	/* ---------------------------------------------------------------
   276	   6. UTILITY: Check whether expansion is active for a query
   277	   --------------------------------------------------------------- */
   278	
   279	/**
exec
/bin/zsh -lc 'rg -n "queryComplexity|routeResult|traceMetadata" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/response .opencode/skill/system-spec-kit/shared/contracts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "RSF|rsf|Relative Score Fusion|shadow" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared/algorithms' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "context headers|header overhead|12 tokens|floor 200|SPECKIT_CONTEXT_HEADERS" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/validation' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:542:    const routeResult = routeQuery(query, options.triggerPhrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:546:      : new Set<ChannelName>(routeResult.channels);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:560:        tier: routeResult.tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:561:        channels: routeResult.channels,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:569:    const budgetResult = getDynamicTokenBudget(routeResult.tier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:989:          traceMetadata: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:995:            // AI-TRACE: CHK-038: Wire queryComplexity from router classification into trace
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:996:            queryComplexity: routeResult.tier,
 succeeded in 52ms:
Total output lines: 429

.opencode/skill/system-spec-kit/mcp_server/README.md:63:- **Post-fusion enhancements**: RRF, RSF, Adaptive Fusion, MMR, Co-activation, Recency Boost, Interference Scoring, Confidence Truncation and Dynamic Token Budget are applied after retrieval, not separate search channels
.opencode/skill/system-spec-kit/mcp_server/README.md:79:| **Search**        | Vector only         | 5-channel (Vector, FTS5, BM25, Graph, Degree) with RRF + RSF fusion |
.opencode/skill/system-spec-kit/mcp_server/README.md:364:Specs 137-139 expanded the pipeline from 3 to 4 primary retrieval channels. Sprint 1 (spec 140) added a 5th degree channel with typed-weighted graph degree computation. Sprint 3 added RSF fusion, query complexity routing, confidence truncation, channel min-representation and dynamic token budgets. Post-fusion enhancements are applied after retrieval and are not counted as separate channels:
.opencode/skill/system-spec-kit/mcp_server/README.md:396:       |  RSF EVALUATION PATH        |
.opencode/skill/system-spec-kit/mcp_server/README.md:466:| RSF (offline eval)     | Reciprocal Similarity Fusion   | Evaluation-only           | Compare against RRF; not in live ranking path |
.opencode/skill/system-spec-kit/mcp_server/README.md:666:│   ├── search/             # Vector, BM25, RRF, RSF, adaptive fusion, MMR, graph search, budgets, folder discovery
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:123:  /** RSF shadow fusion result (SPECKIT_RSF_FUSION) — shadow-mode only, not used for ranking. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:124:  rsfShadow?: { resultCount: number; topRsfScore: number };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:953:      const s4shadowMeta = (reranked as unknown as Record<string, unknown>)['_s4shadow'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:967:      if (s4shadowMeta !== undefined && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:968:        Object.defineProperty(reranked, '_s4shadow', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:969:          value: s4shadowMeta,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:985:      // non-enumerable array shadow properties.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:986:      if ((s4shadowMeta !== undefined || s4attributionMeta !== undefined || degradationMeta !== undefined) && reranked.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:990:            stage4: s4shadowMeta ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:102:    expect(() => validateFilePathLocal('/home/user/../../../etc/shadow')).toThrow();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:32:The eval module provides measurement infrastructure for search quality evaluation. It includes baseline measurement (BM25 MRR@5), ceiling evaluation, ground truth datasets, edge density analysis, quality proxy scoring, K-value sensitivity analysis, channel attribution, ground truth expansion via feedback, shadow scoring for A/B comparison, ablation studies for channel contribution analysis, a reporting dashboard for metric aggregation and trend analysis, and an evaluation database for tracking metrics over time.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:38:| Modules | 15 + 1 data file | eval-db, eval-logger, eval-metrics, eval-quality-proxy, eval-ceiling, bm25-baseline, edge-density, ground-truth-data, ground-truth-generator, k-value-analysis, channel-attribution, ground-truth-feedback, reporting-dashboard, shadow-scoring, ablation-framework, data/ground-truth.json |
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:958:      // CHK-060: Reserve token overhead for contextual tree headers (~12 tokens per result)
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:184: * Default: TRUE. Set SPECKIT_CONTEXT_HEADERS=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:187:  return isFeatureEnabled('SPECKIT_CONTEXT_HEADERS');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '950,1015p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '530,580p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '120,145p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   950	      }
   951	
   952	      // Preserve non-enumerable Sprint 4 eval metadata across truncation reallocation.
   953	      const s4shadowMeta = (reranked as unknown as Record<string, unknown>)['_s4shadow'];
   954	      const s4attributionMeta = (reranked as unknown as Record<string, unknown>)['_s4attribution'];
   955	      const degradationMeta = (reranked as unknown as Record<string, unknown>)['_degradation'];
   956	
   957	      // Sprint 3/4: Apply token budget truncation before returning live results
   958	      // CHK-060: Reserve token overhead for contextual tree headers (~12 tokens per result)
   959	      const headerOverhead = isContextHeadersEnabled() ? reranked.length * 12 : 0;
   960	      const adjustedBudget = Math.max(budgetResult.budget - headerOverhead, 200);
   961	      const budgeted = truncateToBudget(reranked, adjustedBudget, {
   962	        includeContent: options.includeContent ?? false,
   963	        queryId: `hybrid-${Date.now()}`,
   964	      });
   965	      reranked = budgeted.results;
   966	
   967	      if (s4shadowMeta !== undefined && reranked.length > 0) {
   968	        Object.defineProperty(reranked, '_s4shadow', {
   969	          value: s4shadowMeta,
 succeeded in 53ms:
   530	    const lists: Array<{
   531	      source: string;
   532	      results: Array<{ id: number | string; [key: string]: unknown }>;
   533	      weight?: number;
   534	    }> = [];
   535	
   536	    // Sprint 3: Pipeline metadata collector (populated by flag-gated stages)
   537	    const s3meta: Sprint3PipelineMeta = {};
   538	
   539	    // AI-WHY: -- Sprint 3 Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
   540	    // When enabled, classifies query complexity and restricts channels to a
   541	    // subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
   542	    const routeResult = routeQuery(query, options.triggerPhrases);
   543	    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
   544	    const activeChannels = options.forceAllChannels
   545	      ? new Set<ChannelName>(allPossibleChannels)
   546	      : new Set<ChannelName>(routeResult.channels);
   547	
   548	    // AI-WHY: -- Ablation override: allow callers to force-disable channels (BUG-1 fix) --
   549	    // The ablation framework passes useVector/useBm25/useFts=false to disable
 succeeded in 50ms:
   120	interface Sprint3PipelineMeta {
   121	  /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
   122	  routing?: { tier: string; channels: string[]; skippedChannels: string[] };
   123	  /** RSF shadow fusion result (SPECKIT_RSF_FUSION) — shadow-mode only, not used for ranking. */
   124	  rsfShadow?: { resultCount: number; topRsfScore: number };
   125	  /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
   126	  enforcement?: { applied: boolean; promotedCount: number; underRepresentedChannels: string[] };
   127	  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
   128	  truncation?: { truncated: boolean; originalCount: number; truncatedCount: number };
   129	  /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
   130	  tokenBudget?: { tier: string; budget: number; applied: boolean };
   131	}
   132	
   133	/* --- 4. PI-A2: DEGRADATION TYPES --- */
   134	
   135	/** Fallback tier in the 3-tier degradation chain. */
   136	type FallbackTier = 1 | 2 | 3;
   137	
   138	/** Why degradation was triggered at a given tier. */
   139	interface DegradationTrigger {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts | sed -n '180,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_RSF_FUSION|rsfShadow|fuseResultsRsf|fuseResultsRsfMulti|cross-variant|kendall|tau" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts .opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   180	/**
   181	 * Fuse multiple ranked result lists using Relative Score Fusion (multi-list variant).
   182	 *
   183	 * Algorithm:
   184	 * 1. For each list, extract raw scores and compute per-source min/max
   185	 * 2. Normalize each item's score within its source via min-max
   186	 * 3. For each unique item, average its normalized scores across all sources it appears in
   187	 * 4. Items appearing in only 1 source get a penalty: avgScore * (1 / totalSources)
   188	 *    — penalised proportionally to how many sources they are missing from
   189	 * 5. Sort descending by rsfScore, clamp to [0, 1]
   190	 *
   191	 * @param lists - Array of RankedList sources to fuse.
   192	 * @returns Fused RsfResult array sorted descending by rsfScore.
   193	 */
   194	function fuseResultsRsfMulti(lists: RankedList[]): RsfResult[] {
   195	  if (lists.length === 0) return [];
   196	
   197	  // Filter out empty lists; only active channels should affect coverage penalties.
   198	  const nonEmptyLists = lists.filter(l => l.results.length > 0);
   199	  if (nonEmptyLists.length === 0) return [];
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:87:function fuseResultsRsf(listA: RankedList, listB: RankedList): RsfResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:194:function fuseResultsRsfMulti(lists: RankedList[]): RsfResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:283: * Fuse multiple query variants' result sets using Relative Score Fusion (cross-variant).
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:286: * 1. Fuse each variant's lists independently using fuseResultsRsfMulti
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:289: * 4. Apply cross-variant bonus: items in multiple variants get +0.10 per additional variant
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:293: * @returns Fused results with cross-variant convergence bonuses
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:295:function fuseResultsRsfCrossVariant(variantLists: RankedList[][]): RsfResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:298:  // AI-WHY: 0.10 cross-variant bonus rewards query interpretation convergence
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:303:    fuseResultsRsfMulti(lists)
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:368:  // Compute average rsfScore across variants and apply cross-variant bonus
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:374:    // --- Step 4: Apply cross-variant bonus (+0.10 per additional variant) ---
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:396:  fuseResultsRsf,
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:397:  fuseResultsRsfMulti,
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:398:  fuseResultsRsfCrossVariant,
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts:9:  fuseResultsRsf,
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts:54:      const results = fuseResultsRsf(listA, listB);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts:68:      const results = fuseResultsRsf(listA, listB);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts:81:      const results = fuseResultsRsf(listA, listB);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts:107:      const results = fuseResultsRsf(listA, listB);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion.vitest.ts:130:      const results = fuseResultsRsf(listA, listB);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts | sed -n '380,430p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   380	    // Clamp to [0, 1]
   381	    rsfScore = clamp01(rsfScore);
   382	
   383	    finalResults.push({
   384	      ...result,
   385	      rsfScore,
   386	    });
   387	  }
   388	
   389	  // --- Step 5: Sort descending by rsfScore ---
   390	  return finalResults.sort((a, b) => b.rsfScore - a.rsfScore);
   391	}
   392	
   393	/* --- 6. EXPORTS --- */
   394	
   395	export {
   396	  fuseResultsRsf,
   397	  fuseResultsRsfMulti,
   398	  fuseResultsRsfCrossVariant,
   399	  extractScore,
exec
/bin/zsh -lc "rg -n \"fuseResultsRsf|rsfShadow\\s*=|rsfShadow:\" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:

exec
/bin/zsh -lc 'rg -n "expandQueryWithEmbeddings|isExpansionActive|expanded-query|baseline-first|dedup|combinedQuery|query expansion" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:359: * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:505:  const deduped = new Map<string, HybridSearchResult>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:508:    const existing = deduped.get(canonicalId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:510:      deduped.set(canonicalId, r);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:514:  return Array.from(deduped.values())
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1152: * Normalize result IDs to a canonical key used for deduplication and source tracking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1364: * Merge two result arrays, deduplicating by id and keeping the higher score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1393: *   → Merge with Tier 1, dedup by id
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:43:import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:59:/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:119: * Duplicates are eliminated via `Set` deduplication before slicing.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217:  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:231:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:252:          // Merge variant results, deduplicate by id, preserve first-occurrence order
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:268:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:288:      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:295:      // Mutual exclusion: isExpansionActive() returns false when R15 classifies
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:300:      if (isEmbeddingExpansionEnabled() && isExpansionActive(query)) {
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
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '260,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   260	              }
   261	            }
   262	          }
   263	          candidates = merged;
   264	        } catch (expandErr: unknown) {
   265	          const expandMsg =
   266	            expandErr instanceof Error ? expandErr.message : String(expandErr);
   267	          console.warn(
   268	            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
   269	          );
   270	          // Fall through to single hybrid search below
   271	          channelCount = 1;
   272	          candidates = (await hybridSearch.searchWithFallback(
   273	            query,
   274	            effectiveEmbedding,
   275	            { limit, specFolder, includeArchived }
   276	          )) as PipelineRow[];
   277	        }
   278	      } else {
   279	        // expandQuery returned only the original; treat as standard hybrid
exec
/bin/zsh -lc 'rg -n "queryComplexity" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:102:  queryComplexity: string | null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:235:  let queryComplexity: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:261:    if (typeof meta.queryComplexity === 'string' && meta.queryComplexity.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:262:      queryComplexity = meta.queryComplexity;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:283:  // CHK-038: Fallback — read queryComplexity from traceMetadata if not found in stages
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:284:  if (!queryComplexity) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:286:    if (typeof tm?.queryComplexity === 'string' && (tm.queryComplexity as string).length > 0) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:287:      queryComplexity = tm.queryComplexity as string;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:295:    queryComplexity,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:995:            // AI-TRACE: CHK-038: Wire queryComplexity from router classification into trace
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:996:            queryComplexity: routeResult.tier,
codex
I’ve locked down category 12’s main code paths, and the early pattern is clear: a mix of accurate module-level docs, missing integration paths, and one major mismatch where RSF is documented like a live shadow feature even though the code only exposes the fusion library. I’m pulling the same structured summary for categories 13 and 14 now so I can keep the rest of the audit just as evidence-backed.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; cats=[\"13--memory-quality-and-indexing\",\"14--pipeline-architecture\"]; base=Path(\".opencode/skill/system-spec-kit/feature_catalog\");
for cat in cats:
  print(\"##\", cat)
  for fp in sorted((base/cat).glob(\"*.md\")):
    text=fp.read_text()
    title=text.splitlines()[0].lstrip(\"# \")
    impl=[]
    tests=[]
    in_impl=False; in_tests=False
    for line in text.splitlines():
      if line.startswith(\"### Implementation\"):
        in_impl=True; in_tests=False; continue
      if line.startswith(\"### Tests\"):
        in_impl=False; in_tests=True; continue
      if line.startswith(\"## Source Metadata\"):
        in_impl=False; in_tests=False
      if in_impl and line.startswith(\"| "'`"):
        impl.append(line.split("`")[1])
      if in_tests and line.startswith("| `"):
        tests.append(line.split("`")[1])
    print(fp.name)
    print("  title:", title)
    print("  impl:", ", ".join(impl[:5]) + (" ..." if len(impl)>5 else ""))
    print("  tests:", ", ".join(tests[:4]) + (" ..." if len(tests)>4 else ""))
'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 571ms:
## 13--memory-quality-and-indexing
01-verify-fix-verify-memory-quality-loop.md
  title: Verify-fix-verify memory quality loop
  impl: mcp_server/handlers/quality-loop.ts, mcp_server/lib/eval/eval-db.ts
  tests: mcp_server/tests/eval-db.vitest.ts, mcp_server/tests/quality-loop.vitest.ts
02-signal-vocabulary-expansion.md
  title: Signal vocabulary expansion
  impl: mcp_server/configs/cognitive.ts, mcp_server/core/config.ts, mcp_server/lib/cache/embedding-cache.ts, mcp_server/lib/interfaces/vector-store.ts, mcp_server/lib/parsing/content-normalizer.ts ...
  tests: mcp_server/tests/bm25-index.vitest.ts, mcp_server/tests/cognitive-gaps.vitest.ts, mcp_server/tests/config-cognitive.vitest.ts, mcp_server/tests/consumption-logger.vitest.ts ...
03-pre-flight-token-budget-validation.md
  title: Pre-flight token budget validation
  impl: mcp_server/lib/chunking/anchor-chunker.ts, mcp_server/lib/validation/preflight.ts
  tests: mcp_server/tests/preflight.vitest.ts
04-spec-folder-description-discovery.md
  title: Spec folder description discovery
  impl: mcp_server/lib/search/folder-discovery.ts, scripts/spec-folder/generate-description.ts, mcp_server/lib/parsing/content-normalizer.ts, scripts/utils/slug-utils.ts, scripts/core/workflow.ts ...
  tests: mcp_server/tests/folder-discovery.vitest.ts, mcp_server/tests/folder-discovery-integration.vitest.ts, mcp_server/tests/slug-uniqueness.vitest.ts, mcp_server/tests/workflow-memory-tracking.vitest.ts ...
05-pre-storage-quality-gate.md
  title: Pre-storage quality gate
  impl: mcp_server/configs/cognitive.ts, mcp_server/core/config.ts, mcp_server/lib/cache/embedding-cache.ts, mcp_server/lib/interfaces/vector-store.ts, mcp_server/lib/parsing/content-normalizer.ts ...
exec
/bin/zsh -lc 'rg -n "SPECKIT_RSF_FUSION|isRsfEnabled" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:123:  /** RSF shadow fusion result (SPECKIT_RSF_FUSION) — shadow-mode only, not used for ranking. */
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:31:    SPECKIT_RSF_FUSION: process.env.SPECKIT_RSF_FUSION,
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:56:    SPECKIT_RSF_FUSION: process.env.SPECKIT_RSF_FUSION,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:163:      setEnv('SPECKIT_RSF_FUSION', 'false');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:204:      setEnv('SPECKIT_RSF_FUSION', 'true');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:251:      clearEnv('SPECKIT_RSF_FUSION');
exec
/bin/zsh -lc 'rg -n "analyzeChannelRepresentation|isChannelMinRepEnabled|underRepresentedChannels|promotedCount" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:126:  enforcement?: { applied: boolean; promotedCount: number; underRepresentedChannels: string[] };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:799:            promotedCount: enforcementResult.enforcement.promotedCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:800:            underRepresentedChannels: enforcementResult.enforcement.underRepresentedChannels,
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:45: * Return value of `analyzeChannelRepresentation`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:49: * - `underRepresentedChannels` — channel names that had 0 results in topK but did return results
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:55:  underRepresentedChannels: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:67:export function isChannelMinRepEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:92:export function analyzeChannelRepresentation(
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:97:  if (!isChannelMinRepEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:101:      underRepresentedChannels: [],
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:111:      underRepresentedChannels: [],
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:130:  const underRepresentedChannels: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:134:      underRepresentedChannels.push(channelName);
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:139:  if (underRepresentedChannels.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:143:      underRepresentedChannels: [],
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:153:  for (const channelName of underRepresentedChannels) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:180:    underRepresentedChannels: [...underRepresentedChannels],
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '780,810p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   780	            id: r.id,
   781	            score: typeof (r as Record<string, unknown>).score === 'number'
   782	              ? (r as Record<string, unknown>).score as number
   783	              : typeof (r as Record<string, unknown>).similarity === 'number'
   784	                ? (r as Record<string, unknown>).similarity as number
   785	                : 0,
   786	          })));
   787	        }
   788	
   789	        const enforcementResult: EnforcementResult = enforceChannelRepresentation(
   790	          fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
   791	          channelResultSets,
   792	          limit,
   793	        );
   794	
   795	        if (enforcementResult.enforcement.applied) {
   796	          fusedHybridResults = enforcementResult.results as HybridSearchResult[];
   797	          s3meta.enforcement = {
   798	            applied: true,
   799	            promotedCount: enforcementResult.enforcement.promotedCount,
exec
/bin/zsh -lc 'rg -n "truncateByConfidence|truncation" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:6:/** Generic scored result for truncation — supports both numeric and string IDs. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:13:/** Result of a truncation operation with full audit metadata. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:25:/** Options for truncation behaviour. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:34:/** Gap multiplier: gap must exceed this multiple of the median gap to trigger truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:41: * Check whether confidence-based truncation is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:109: * @param options - Optional truncation options (minResults).
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:112:function truncateByConfidence(
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:224:  truncateByConfidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:32:import { truncateByConfidence } from './confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:52:import type { TruncationResult } from './confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:127:  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:128:  truncation?: { truncated: boolean; originalCount: number; truncatedCount: number };
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:567:    // Compute tier-aware budget early so it's available for downstream truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:812:        const truncationResult: TruncationResult = truncateByConfidence(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:816:        if (truncationResult.truncated) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:818:          fusedHybridResults = truncationResult.results.map(r => r as HybridSearchResult);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:819:          s3meta.truncation = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:821:            originalCount: truncationResult.originalCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:822:            truncatedCount: truncationResult.truncatedCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:826:        // AI-GUARD: Non-critical — truncation failure does not block pipeline
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Verify-fix-verify memory quality loop

## Current Reality

Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system auto-fixes by re-extracting triggers, normalizing anchors and trimming content to budget. Then it scores again.

If the second attempt still fails, a third try runs with stricter trimming. After two failed retries, the memory is rejected outright.

Rejection rates are logged per spec folder so you can spot folders that consistently produce low-quality saves. This loop catches problems at write time rather than letting bad data pollute search results.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop handler |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |

### Tests
 succeeded in 51ms:
# Pre-flight token budget validation

## Current Reality

Before assembling the final response, the system estimates total token count across all candidate results and truncates to the highest-scoring candidates when the total exceeds the configured budget. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the usable budget is first reduced by header overhead (~12 tokens per result, floor 200 tokens) to account for injected `[parent > child — desc]` headers (CHK-060). The truncation strategy is greedy: highest scores first, never round-robin.

For `includeContent=true` queries where a single result overshoots the budget, a summary (first 400 characters) replaces raw content rather than returning nothing.

Overflow events are logged with query ID, candidate count, total tokens, budget limit and the number of results after truncation. This prevents the response from blowing through the caller's context window.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/validation/preflight.ts` | Lib | Pre-flight validation |

### Tests
 succeeded in 51ms:
# Spec folder description discovery

## Current Reality

Each spec folder now has its own `description.json` containing identity metadata
(`specId`, `folderSlug`, `parentChain`) and memory tracking fields
(`memorySequence`, `memoryNameHistory`). These per-folder files are the primary
source of truth, auto-generated by `create.sh` on folder creation and updated
by the memory save workflow.

A one-time backfill using `generate-description.js` populated `description.json`
for all 281 existing spec folders, so per-folder descriptions are now present
repository-wide — not only for newly created folders.

A centralized `descriptions.json` aggregation layer remains for backward
compatibility. The `generateFolderDescriptions()` function prefers fresh
per-folder files and falls back to `spec.md` extraction when `description.json`
is missing or stale (spec.md modified after description.json).

The `memory_context` orchestration layer checks descriptions before issuing
 succeeded in 51ms:
# Signal vocabulary expansion

## Current Reality

The trigger matcher originally recognized six signal categories. Two new categories from the true-mem 8-category vocabulary were added: CORRECTION signals (words like "actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want").

Correction signals matter because they indicate the user is fixing a prior misunderstanding, which means different memories are relevant. Preference signals help the system detect intent behind requests like "I prefer the JSON format" where matching on preference-associated memories improves retrieval accuracy.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Trigger phrase matching |
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Preflight
     3	// ---------------------------------------------------------------
     4	
     5	import crypto from 'crypto';
     6	import { CHUNKING_THRESHOLD } from '../chunking/anchor-chunker';
     7	
     8	/* ---------------------------------------------------------------
     9	   1. TYPES
    10	   --------------------------------------------------------------- */
    11	
    12	/** Preflight error code identifiers */
    13	export interface PreflightErrorCodes {
    14	  ANCHOR_FORMAT_INVALID: string;
    15	  ANCHOR_UNCLOSED: string;
    16	  ANCHOR_ID_INVALID: string;
    17	  DUPLICATE_DETECTED: string;
    18	  DUPLICATE_EXACT: string;
    19	  DUPLICATE_SIMILAR: string;
    20	  TOKEN_BUDGET_EXCEEDED: string;
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Quality Loop (T008)
     3	// ---------------------------------------------------------------
     4	
     5	import { initEvalDb } from '../lib/eval/eval-db';
     6	
     7	interface QualityScoreBreakdown {
     8	  triggers: number;
     9	  anchors: number;
    10	  budget: number;
    11	  coherence: number;
    12	}
    13	
    14	interface QualityScore {
    15	  total: number;
    16	  breakdown: QualityScoreBreakdown;
    17	  issues: string[];
    18	}
    19	
    20	interface QualityLoopResult {
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
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Generate Description
     3	// ---------------------------------------------------------------
     4	// CLI: Generate Per-Folder description.json
     5	// Usage: node generate-description.js <folder-path> <base-path> [--description "text"]
     6	//
     7	// If --description is provided, uses it directly + keyword extraction.
     8	// Otherwise reads spec.md via generatePerFolderDescription().
     9	
    10	import * as path from 'node:path';
    11	import * as fs from 'node:fs';
    12	import {
    13	  generatePerFolderDescription,
    14	  savePerFolderDescription,
    15	  loadPerFolderDescription,
    16	  extractKeywords,
    17	  slugifyFolderName,
    18	} from '@spec-kit/mcp-server/lib/search/folder-discovery';
    19	import type { PerFolderDescription } from '@spec-kit/mcp-server/lib/search/folder-discovery';
    20	
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Workflow
     3	// ---------------------------------------------------------------
     4	// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
     5	// ---------------------------------------------------------------
     6	
     7	// Node stdlib
     8	import * as path from 'path';
     9	import * as fsSync from 'fs';
    10	
    11	// Internal modules
    12	import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
    13	import {
    14	  extractConversations,
    15	  extractDecisions,
    16	  extractDiagrams,
    17	  extractPhasesFromData,
    18	  enhanceFilesWithSemanticDescriptions,
    19	} from '../extractors';
    20	import { detectSpecFolder, setupContextDirectory } from '../spec-folder';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "attempts|0.6|0.75|fix|rejected|logQualityRejection|spec folder|rejection" .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "correction|preference|neutral|signals|boost" .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "truncateToBudget|summary|400|headerOverhead|12|floor 200|overflow" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "description.json|memorySequence|memoryNameHistory|ensureUniqueMemoryFilename|loadPerFolderDescription|savePerFolderDescription|generateFolderDescriptions|findRelevantFolders|realpathSync|fsyncSync|renameSync|randomBytes|stripYamlFrontmatter" .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts .opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/spec/create.sh' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:23:  attempts: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:24:  fixes: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:25:  rejected: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:26:  rejectionReason?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:27:  /** Content after auto-fix mutations (present only when fixes were applied) */
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:28:  fixedContent?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:286: * Attempt automatic fixes for quality issues.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:293: * Returns the (possibly modified) content, metadata, and list of applied fixes.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:299:): { content: string; metadata: Record<string, unknown>; fixed: string[] } {
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:300:  let fixedContent = content;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:301:  const fixedMetadata = { ...metadata };
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:302:  const fixed: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:307:    const existingTriggers = Array.isArray(fixedMetadata.triggerPhrases)
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:308:      ? (fixedMetadata.triggerPhrases as string[])
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:311:    const extracted = extractTriggersFromContent(fixedContent, fixedMetadata.title as string | undefined);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:313:      fixedMetadata.triggerPhrases = extracted;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:314:      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:321:    fixedContent = normalizeAnchors(fixedContent);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:322:    fixed.push('Normalized unclosed ANCHOR tags');
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:328:    if (fixedContent.length > DEFAULT_CHAR_BUDGET) {
 succeeded in 52ms:
   260	  const coherenceResult = scoreCoherence(content);
   261	
   262	  const total =
   263	    triggerResult.score * QUALITY_WEIGHTS.triggers +
   264	    anchorResult.score * QUALITY_WEIGHTS.anchors +
   265	    budgetResult.score * QUALITY_WEIGHTS.budget +
   266	    coherenceResult.score * QUALITY_WEIGHTS.coherence;
   267	
   268	  return {
   269	    total: Math.round(total * 1000) / 1000, // 3 decimal places
   270	    breakdown: {
   271	      triggers: triggerResult.score,
   272	      anchors: anchorResult.score,
   273	      budget: budgetResult.score,
   274	      coherence: coherenceResult.score,
   275	    },
   276	    issues: [
   277	      ...triggerResult.issues,
   278	      ...anchorResult.issues,
   279	      ...budgetResult.issues,
 succeeded in 52ms:
10:export type SignalCategory = 'correction' | 'preference' | 'neutral';
16:  boost: number;
54:  signals?: SignalDetection[];
317:/** Keywords for CORRECTION signals — user is correcting a prior statement */
322:  'correction',
328:/** Keywords for PREFERENCE signals — user is expressing a preference or intent */
339:// AI-WHY: Correction signals (0.2) weighted higher than preferences (0.1) — corrections indicate stronger search intent
341:const SIGNAL_BOOSTS: Record<Exclude<SignalCategory, 'neutral'>, number> = {
342:  correction: 0.2,
343:  preference: 0.1,
347: * Detect importance signals in a user prompt.
360:  const correctionHits: string[] = [];
363:      correctionHits.push(kw);
366:  if (correctionHits.length > 0) {
368:      category: 'correction',
369:      keywords: correctionHits,
370:      boost: SIGNAL_BOOSTS.correction,
375:  const preferenceHits: string[] = [];
378:      preferenceHits.push(kw);
381:  if (preferenceHits.length > 0) {
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:175:  DUPLICATE_SIMILAR: 'PF012',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:302:        suggestion: `Use format like "summary", "decisions-001", or "spec-folder/section"`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:568:    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:958:      // CHK-060: Reserve token overhead for contextual tree headers (~12 tokens per result)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:959:      const headerOverhead = isContextHeadersEnabled() ? reranked.length * 12 : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:960:      const adjustedBudget = Math.max(budgetResult.budget - headerOverhead, 200);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:961:      const budgeted = truncateToBudget(reranked, adjustedBudget, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1082:/* --- 12. STRUCTURAL SEARCH (PI-A2 Tier 3) --- */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1493:/** Maximum characters for a summary fallback when a single result overflows the budget. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1494:const SUMMARY_MAX_CHARS = 400;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1510:  overflow?: OverflowLogEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1558: * Create a summary fallback for a single result whose content exceeds the token budget.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1580: * @param options - Optional includeContent flag and queryId for overflow logging.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1581: * @returns Object with truncated results, truncation flag, and optional overflow log entry.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1583:function truncateToBudget(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1603:  // AI-WHY: Single-result overflow with includeContent: return summary fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1605:    const summary = createSummaryFallback(sorted[0]!, effectiveBudget);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1606:    const overflow: OverflowLogEntry = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1615:      `[hybrid-search] Token budget overflow (single-result summary fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1618:    return { results: [summary], truncated: true, overflow };
 succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/spec/create.sh:809:    # ── Generate description.json for parent ──
.opencode/skill/system-spec-kit/scripts/spec/create.sh:816:        CREATED_FILES+=("description.json")
.opencode/skill/system-spec-kit/scripts/spec/create.sh:818:        echo "  Warning: description.json generation skipped" >&2
.opencode/skill/system-spec-kit/scripts/spec/create.sh:843:        # Generate description.json for child phase
.opencode/skill/system-spec-kit/scripts/spec/create.sh:849:            _child_created_files+=("description.json")
.opencode/skill/system-spec-kit/scripts/spec/create.sh:851:            echo "  Warning: description.json generation skipped for phase ${_i}" >&2
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1038:# 6.5. GENERATE PER-FOLDER description.json
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1045:    CREATED_FILES+=("description.json")
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1047:    echo "  Warning: description.json generation skipped" >&2
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1115:    if [[ -f "$FEATURE_DIR/description.json" ]]; then
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1116:        description_json=",\"HAS_DESCRIPTION\":true"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1118:        description_json=",\"HAS_DESCRIPTION\":false"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1123:        "$(_json_escape "$BRANCH_NAME")" "$(_json_escape "$SPEC_FILE")" "$FEATURE_NUM" "$DOC_LEVEL" "$SHARDED" "$complexity_json" "$expansion_json" "$description_json" "$files_json"
.opencode/skill/system-spec-kit/scripts/spec/create.sh:1146:    echo "      ├── description.json   (per-folder identity)"
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:7:import { stripYamlFrontmatter } from '../parsing/content-normalizer';
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:33: * Per-folder description stored as `description.json` inside each spec folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:40:  memorySequence: number;       // Monotonic counter per save
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:41:  memoryNameHistory: string[];  // Last 20 slugs (ring buffer)
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:105:    return fs.realpathSync.native(targetPath);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:108:      return fs.realpathSync(targetPath);
exec
/bin/zsh -lc 'rg -n "runQualityLoop|quality-loop|logQualityMetrics" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:57:- `quality-loop.ts` — quality feedback loop handler
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:407:function runQualityLoop(
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:435:    logQualityMetrics(score, 1, true, false);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:456:      logQualityMetrics(score, attempt + 1, true, false);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:477:  logQualityMetrics(score, maxRetries + 1, false, true);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:495:function logQualityMetrics(
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:529:    console.warn('[quality-loop] logQualityMetrics failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:542:  runQualityLoop,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:543:  logQualityMetrics,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:33:  runQualityLoop,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:35:  logQualityMetrics,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:45:} from './quality-loop';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:50:} from './quality-loop';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:123:  // Feature behavior remains gated by SPECKIT_QUALITY_LOOP inside runQualityLoop().
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:124:  const qualityLoopResult = runQualityLoop(parsed.content, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:533:  runQualityLoop,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:535:  logQualityMetrics,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:571:const run_quality_loop = runQualityLoop;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:573:const log_quality_metrics = logQualityMetrics;
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:18:  runQualityLoop,
exec
/bin/zsh -lc 'rg -n "spec folder|spec_folder|rejection rate|rejection|quality_loop|eval_metric_snapshots|memory-save" .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:45:    spec_folder TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:91:  CREATE TABLE IF NOT EXISTS eval_metric_snapshots (
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:136:    console.error(`[memory-save] Quality loop applied ${qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:157:      message: qualityLoopResult.rejectionReason,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:167:    console.error(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:178:  // DEDUP: Check content hash across spec folder (T054)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:208:        console.error(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:224:        console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:228:      console.warn(`[memory-save] TM-04: Quality gate error (proceeding with save): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:246:    WHERE spec_folder = ?
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:309:        spec_folder: parsedForPreflight.specFolder,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:337:          spec_folder: parsedForPreflight.specFolder,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:571:const run_quality_loop = runQualityLoop;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:572:const is_quality_loop_enabled = isQualityLoopEnabled;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:590:  run_quality_loop,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:591:  is_quality_loop_enabled,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:26:  rejectionReason?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:405: * @returns QualityLoopResult with pass/fail, scores, fixes, rejection info
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:475:  const rejectionReason = `Quality score ${score.total.toFixed(3)} below threshold ${threshold} after ${maxRetries} auto-fix attempts. Issues: ${score.issues.join('; ')}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:485:    rejectionReason,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '110,170p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   110	  const parsed = parsedOverride || memoryParser.parseMemoryFile(filePath);
   111	
   112	  const validation = memoryParser.validateParsedMemory(parsed);
   113	  if (!validation.valid) {
   114	    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
   115	  }
   116	
   117	  if (validation.warnings && validation.warnings.length > 0) {
   118	    console.warn(`[memory] Warning for ${path.basename(filePath)}:`);
   119	    validation.warnings.forEach((w: string) => console.warn(`[memory]   - ${w}`));
   120	  }
   121	
   122	  // AI-TRACE:T008: Integrate verify-fix-verify quality loop into the save pipeline.
   123	  // Feature behavior remains gated by SPECKIT_QUALITY_LOOP inside runQualityLoop().
   124	  const qualityLoopResult = runQualityLoop(parsed.content, {
   125	    title: parsed.title ?? '',
   126	    triggerPhrases: parsed.triggerPhrases,
   127	    specFolder: parsed.specFolder,
   128	    contextType: parsed.contextType,
   129	    importanceTier: parsed.importanceTier,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts | sed -n '500,535p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   500	): void {
   501	  try {
   502	    // Use eval logger's feature flag check
   503	    if (process.env.SPECKIT_EVAL_LOGGING?.toLowerCase() !== 'true') return;
   504	
   505	    const db = initEvalDb();
   506	
   507	    const metadata = JSON.stringify({
   508	      breakdown: score.breakdown,
   509	      issues: score.issues,
   510	      attempts,
   511	      passed,
   512	      rejected,
   513	    });
   514	
   515	    db.prepare(`
   516	      INSERT INTO eval_metric_snapshots
   517	        (eval_run_id, metric_name, metric_value, channel, query_count, metadata)
   518	      VALUES (?, ?, ?, ?, ?, ?)
   519	    `).run(
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts | sed -n '300,410p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   300	
   301	/** Check if a phrase exists in text with word boundaries */
   302	export function matchPhraseWithBoundary(text: string, phrase: string, precompiledRegex: RegExp | null = null): boolean {
   303	  if (precompiledRegex) {
   304	    return precompiledRegex.test(text);
   305	  }
   306	  // AI-WHY: Fallback for direct calls without pre-compiled regex
   307	  const escaped = escapeRegex(phrase);
   308	  const regex = new RegExp(
   309	    `(?:^|[^a-zA-Z0-9\u00C0-\u00FF])${escaped}(?:[^a-zA-Z0-9\u00C0-\u00FF]|$)`,
   310	    'iu'
   311	  );
   312	  return regex.test(text);
   313	}
   314	
   315	/* --- 6. SIGNAL VOCABULARY DETECTION (SPECKIT_SIGNAL_VOCAB) --- */
   316	
   317	/** Keywords for CORRECTION signals — user is correcting a prior statement */
   318	export const CORRECTION_KEYWORDS: string[] = [
   319	  'actually',
exec
/bin/zsh -lc 'rg -n "checkTokenBudget|estimated_tokens|max_tokens_per_memory|unified preflight|dry_run|validateAnchorFormat|check duplicates|check size" .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
29:  max_tokens_per_memory: number;
70:  estimated_tokens: number;
102:/** Parameters for the unified preflight check */
112:/** Options for the unified preflight check */
114:  dry_run?: boolean;
134:  dry_run: boolean;
135:  dry_run_would_pass?: boolean;
188:  max_tokens_per_memory: parseInt(process.env.MCP_MAX_MEMORY_TOKENS || '8000', 10),
246: * Provides the validateAnchorFormat helper.
248:export function validateAnchorFormat(content: string, options: { strict?: boolean } = {}): AnchorValidationResult {
464: * Provides the checkTokenBudget helper.
466:export function checkTokenBudget(content: string, options: {
472:    maxTokens = PREFLIGHT_CONFIG.max_tokens_per_memory,
479:    estimated_tokens: 0,
500:  result.estimated_tokens = estimated;
604:    dry_run = false,
615:    dry_run,
652:    const anchorResult = validateAnchorFormat(content, { strict: strict_anchors });
671:    const tokenResult = checkTokenBudget(content);
722:  if (dry_run) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts | sed -n '460,735p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   460	  return Math.max(1, Math.ceil(text.length / PREFLIGHT_CONFIG.charsPerToken));
   461	}
   462	
   463	/**
   464	 * Provides the checkTokenBudget helper.
   465	 */
   466	export function checkTokenBudget(content: string, options: {
   467	  maxTokens?: number;
   468	  warning_threshold?: number;
   469	  include_embedding_overhead?: boolean;
   470	} = {}): TokenBudgetResult {
   471	  const {
   472	    maxTokens = PREFLIGHT_CONFIG.max_tokens_per_memory,
   473	    warning_threshold = PREFLIGHT_CONFIG.warning_threshold,
   474	    include_embedding_overhead = true,
   475	  } = options;
   476	
   477	  const result: TokenBudgetResult = {
   478	    within_budget: true,
   479	    estimated_tokens: 0,
exec
/bin/zsh -lc 'rg -n "findRelevantFolders|SPECKIT_FOLDER_DISCOVERY|skip full-corpus|description alone|memory_context|folder discovery" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * PI-B3: Automatic spec folder discovery via description cache.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:53: * Default: TRUE (graduated). Set SPECKIT_FOLDER_DISCOVERY=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:56:  return isFeatureEnabled('SPECKIT_FOLDER_DISCOVERY');
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:382:export function findRelevantFolders(
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:867: * Orchestrates: ensureCache → findRelevantFolders → threshold check.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:883:    const matches = findRelevantFolders(query, cache, 1);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:394:/** Handle memory_context tool - L1 orchestration layer that routes to optimal retrieval strategy */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:417:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:460:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:551:  // PI-B3: Automatic spec folder discovery when no folder is specified
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:562:      console.error('[memory-context] folder discovery failed (non-critical):',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:591:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:629:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:768:  handle_memory_context,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '540,570p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   540	      if (pressureOverrideApplied) {
   541	        pressureWarning = `Pressure policy override applied: ${pressurePolicy.level} pressure (${pressurePolicy.ratio}) forced mode ${pressureOverrideTargetMode} from ${prePressureMode}.`;
   542	      }
   543	    }
   544	  }
   545	
   546	  // Validate mode
   547	  if (!CONTEXT_MODES[effectiveMode]) {
   548	    effectiveMode = 'focused';
   549	  }
   550	
   551	  // PI-B3: Automatic spec folder discovery when no folder is specified
   552	  let discoveredFolder: string | null = null;
   553	  if (!spec_folder && isFolderDiscoveryEnabled()) {
   554	    try {
   555	      const basePaths = getSpecsBasePaths();
   556	      discoveredFolder = discoverSpecFolder(normalizedInput, basePaths);
   557	      if (discoveredFolder) {
   558	        options.specFolder = discoveredFolder;
   559	      }
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; root=Path(\".\"); specs=[p for p in root.rglob(\"description.json\") if \"/specs/\" in p.as_posix() or p.as_posix().startswith(\"specs/\")]; print(len(specs))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 877ms:
280
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "warn-only|14 days|gateActivationTs|semantic dedup|0.92|0.4|signal density|metadata quality|save quality gate|SPECKIT_SAVE_QUALITY_GATE" .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
# Pre-storage quality gate

## Current Reality

A three-layer quality gate on memory save validates content before it enters the index. Layer 1 checks structural validity (title exists, content at least 50 characters, valid spec folder path format). Layer 2 scores content quality across five dimensions (title quality, trigger quality, length quality, anchor quality, metadata quality) with a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity against existing memories in the same spec folder, rejecting near-duplicates above 0.92.

The gate starts in warn-only mode for 14 days after activation per the MR12 mitigation: it logs would-reject decisions without blocking saves while the thresholds are being validated. After the warn-only period, hard rejections apply. Runs behind the `SPECKIT_SAVE_QUALITY_GATE` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
 succeeded in 50ms:
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
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:10://            anchors, metadata, signal density)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:13:// Behind SPECKIT_SAVE_QUALITY_GATE flag (default OFF)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:15:// MR12 mitigation: warn-only mode for first 2 weeks after
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:16:// activation. When in warn-only mode, log quality scores and
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:100:const SIGNAL_DENSITY_THRESHOLD = 0.4;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:103:const SEMANTIC_DEDUP_THRESHOLD = 0.92;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:108:/** Warn-only period duration in milliseconds (14 days) */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:111:/** Layer 2 dimension weights for weighted average signal density */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:206: * Activation timestamp for warn-only mode tracking.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:217: * Default: TRUE (graduated Sprint 4). Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:219: * @returns true if SPECKIT_SAVE_QUALITY_GATE is not explicitly disabled
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:222:  return process.env.SPECKIT_SAVE_QUALITY_GATE?.toLowerCase() !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:226: * Check if the quality gate is in warn-only mode (MR12 mitigation).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:227: * For the first 14 days after activation, the gate logs scores but
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:233: * @returns true if in warn-only period
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:252: * Record the activation timestamp for warn-only mode tracking.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:366:    return 0.4;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:417: * Score metadata quality (0-1).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:458: * Threshold: >= 0.4 to pass.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:477:  // Compute weighted average signal density
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "reconsolidation|bridge|memory save|applyReconsolidationOnSave|consolidation" .opencode/skill/system-spec-kit/mcp_server/handlers/save .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
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
# Reconsolidation-on-save

## Current Reality

After embedding generation, the save pipeline checks the top-3 most similar memories in the same spec folder. Similarity at or above 0.88 triggers a merge where content is combined and the `importance_weight` is incremented via `Math.min(1.0, currentWeight + 0.1)`. Similarity between 0.75 and 0.88 triggers conflict resolution: the old memory is deprecated and a `supersedes` causal edge is created. Below 0.75, the memory stores as a new complement.

**Sprint 8 update:** The original merge logic referenced a non-existent `frequency_counter` column, which would have caused runtime crashes on reconsolidation. This was replaced with `importance_weight` merge logic that properly uses an existing column.

A checkpoint must exist for the spec folder before reconsolidation can run. When no checkpoint is found, the system logs a warning and skips reconsolidation rather than risking destructive merges without a safety net. Runs behind the `SPECKIT_RECONSOLIDATION` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/handler-utils.ts` | Handler | Handler utility helpers |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Reconsolidation
     3	// ---------------------------------------------------------------
     4	// ---------------------------------------------------------------
     5	// TM-06: Reconsolidation-on-Save
     6	//
     7	// After embedding generation, check top-3 most similar memories
     8	// in the spec folder:
     9	// - similarity >= 0.88: MERGE (duplicate - merge content,
    10	//   boost importance_weight)
    11	// - similarity 0.75-0.88: CONFLICT (supersede prior memory via causal
    12	//   'supersedes' edge)
    13	// - similarity < 0.75: COMPLEMENT (store new memory unchanged)
    14	//
    15	// Behind SPECKIT_RECONSOLIDATION flag (default OFF)
    16	// REQUIRES: checkpoint created before first enable
    17	// ---------------------------------------------------------------
    18	
    19	import { createHash } from 'crypto';
    20	import type Database from 'better-sqlite3';
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:64:import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:239:  // -- Sprint 4: TM-06 Reconsolidation-on-Save --
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:240:  const reconResult = await runReconsolidationIfEnabled(database, parsed, filePath, force, embedding);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:2:// MODULE: Reconsolidation
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:5:// TM-06: Reconsolidation-on-Save
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:28:export type ReconsolidationAction = 'merge' | 'conflict' | 'complement';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:84:/** Combined reconsolidation result */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:85:export type ReconsolidationResult = MergeResult | ConflictResult | ComplementResult;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:117: * Check if reconsolidation is enabled via feature flag.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:121:export function isReconsolidationEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:148:    console.warn('[reconsolidation] findSimilarMemories error:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:158: * Determine the reconsolidation action based on similarity score.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:163:export function determineAction(similarity: number): ReconsolidationAction {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:219:        console.warn('[reconsolidation] Failed to regenerate embedding for merge:', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:346:          `TM-06 reconsolidation conflict: similarity ${(existingMemory.similarity * 100).toFixed(1)}%`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:415:/** Options for the reconsolidation orchestrator */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:423: * Orchestrate the full reconsolidation flow for a new memory.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:435: * @returns ReconsolidationResult or null if feature is disabled
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:441:): Promise<ReconsolidationResult | null> {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:442:  if (!isReconsolidationEnabled()) {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "description only|file changes|importance tier|memory parser|quality_score|generate content|content generation|structured markdown|semantic summary" .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
# Smarter memory content generation

## Current Reality

Raw markdown including code fences, nested lists and YAML frontmatter was being embedded as-is, diluting embedding quality with formatting noise. A content normalizer now strips this noise before embedding generation and BM25 rebuild/index paths that call `normalizeContentForBM25()`.

Seven primitives run in sequence: strip YAML frontmatter, strip anchor markers, strip HTML comments, strip code fence markers (retaining the code body), normalize markdown tables, normalize markdown lists and normalize headings. Two composite entry points apply this: `normalizeContentForEmbedding()` and `normalizeContentForBM25()`. In the current runtime, the BM25 entry point delegates to the same normalization pipeline as embeddings.

The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and in BM25 rebuild/tokenization paths that call `normalizeContentForBM25()`.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser |
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:201: * Get the default importance tier for a given document type.
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:230:  // 2. Check importance tier mapping
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:528:/** Extract importance tier from content or metadata */
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:404:    if (/^quality_score\s*:/i.test(trimmed)) {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:417:    `quality_score: ${qualityScore.toFixed(2)}`,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:867:  log('Step 7.5: Generating semantic summary...');
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1088:        // frontmatter quality_score is 0.0-1.0 (v2 scorer). Different metrics.
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1089:        _note: 'qualityScore is 0-100 scale (legacy scorer); frontmatter quality_score is 0.0-1.0 (v2 scorer)',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Content Normalizer
     3	// ---------------------------------------------------------------
     4	// Sprint 7 / S1 — Smarter Memory Content Generation
     5	// ---------------------------------------------------------------
     6	//
     7	// Purpose: Normalize raw markdown content before it is passed to
     8	//   embedding generation or BM25 indexing.  Raw markdown contains
     9	//   structural noise (YAML frontmatter, HTML comment anchors, pipe
    10	//   table syntax, fence markers, checkbox notation) that degrades
    11	//   the quality of semantic embeddings and keyword retrieval.
    12	//
    13	// Integration points (do NOT modify those files here — reference only):
    14	//   - memory-parser.ts  ~line 159  : `content` is assigned from readFileWithEncoding()
    15	//       → wrap with normalizeContentForEmbedding() before passing to generateDocumentEmbedding()
    16	//   - memory-save.ts    ~line 1093 : before generateDocumentEmbedding(parsed.content)
    17	//       → normalizeContentForEmbedding(parsed.content)
    18	//   - bm25-index.ts     ~line 245  : where `content_text` is used for token building
    19	//       → normalizeContentForBM25(content_text)
    20	//
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "anchor|chunk thinning|thinning|summary|anchors" .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Anchor-aware chunk thinning

## Current Reality

When large files are split into chunks during indexing, not all chunks carry equal value. Anchor-aware chunk thinning scores each chunk using a composite of anchor presence (weight 0.6, binary 0 or 1) and content density (weight 0.4, 0-1 scale). Content density strips HTML comments, collapses whitespace, penalizes short chunks under 100 characters and adds a structure bonus (up to +0.2) for headings, code blocks and list items.

Chunks scoring below the 0.3 threshold are dropped from the index, reducing storage and search noise. The thinning guarantee: the function never returns an empty array regardless of scoring. Always active in the chunking path with no separate feature flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |

### Tests

| File | Focus |
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Chunk Thinning
     3	// ---------------------------------------------------------------
     4	// Scores chunks by anchor presence + content density, then
     5	// applies a thinning threshold to drop low-quality chunks.
     6	// Used BEFORE indexing to filter out low-value chunks.
     7	// ---------------------------------------------------------------
     8	
     9	import type { AnchorChunk } from './anchor-chunker';
    10	
    11	/* ---------------------------------------------------------------
    12	   1. TYPES
    13	--------------------------------------------------------------- */
    14	
    15	/**
    16	 * Describes the ChunkScore shape.
    17	 */
    18	export interface ChunkScore {
    19	  chunk: AnchorChunk;
    20	  score: number;        // 0-1 composite score
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:4:// Scores chunks by anchor presence + content density, then
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:5:// applies a thinning threshold to drop low-quality chunks.
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:9:import type { AnchorChunk } from './anchor-chunker';
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:21:  anchorScore: number;  // 0 or 1 based on anchor presence
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:58:  // Strip HTML comments, anchor markers, excessive whitespace
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:87: * Score a chunk based on anchor presence and content density.
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:90:  // Anchor score: 1.0 if chunk has anchors, 0.0 if not
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:91:  const anchorScore = chunk.anchorIds.length > 0 ? 1.0 : 0.0;
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:97:  const score = (ANCHOR_WEIGHT * anchorScore) + (DENSITY_WEIGHT * densityScore);
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:102:    anchorScore,
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:113: * Apply anchor-aware thinning to a set of chunks.
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:6:// splitting when anchors are absent.
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:20:  anchorIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:31:  /** Strategy used: 'anchor' or 'structure' */
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:32:  strategy: 'anchor' | 'structure';
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:58:/** Max characters for parent summary (BM25 fallback) */
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:65:const ANCHOR_OPEN_RE = /<!--\s*(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/g;
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:68: * Extract anchor sections from content.
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:77:    const anchorId = match[1].trim();
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:83:      `<!--\\s*/(?:ANCHOR|anchor):\\s*${escapeRegex(anchorId)}\\s*-->`,
exec
/bin/zsh -lc "rg -n \"thinChunks\\(|chunk-thinning|apply thinning\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:19:import { thinChunks } from '../lib/chunking/chunk-thinning';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:130:  const thinningResult = thinChunks(chunkResult.chunks);
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:118:export function thinChunks(
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:59:  chunk-thinning.ts    # Quality scoring and threshold-based chunk filtering
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:68:| `chunk-thinning.ts` | Scores chunks using a weighted composite of anchor presence and content density, then applies a configurable threshold (default 0.3) to filter low-quality chunks before indexing. Always retains at least one chunk. |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:79:| `ChunkScore` | chunk-thinning.ts | Interface | Per-chunk score breakdown (composite, anchor, density, retained flag) |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:80:| `ThinningResult` | chunk-thinning.ts | Interface | Original, retained and dropped chunk arrays with scores |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:81:| `scoreChunk` | chunk-thinning.ts | Function | Computes composite quality score for a single chunk |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:82:| `thinChunks` | chunk-thinning.ts | Function | Applies threshold filtering to a chunk array |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:83:| `DEFAULT_THINNING_THRESHOLD` | chunk-thinning.ts | Constant | 0.3 (exported for configuration) |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:84:| `ANCHOR_WEIGHT` | chunk-thinning.ts | Constant | 0.6 |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:85:| `DENSITY_WEIGHT` | chunk-thinning.ts | Constant | 0.4 |
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md:103:    -> thinChunks()
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:660:**R7: Chunk Thinning** (`chunk-thinning.ts`):
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"encoding_intent|classifyEncodingIntent|SPECKIT_ENCODING_INTENT|indexMemory\\(|memory-save\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Encoding-intent capture at index time

## Current Reality

An `encoding_intent` field classifies content type at index time as `document`, `code` or `structured_data` using heuristic scoring. The code path scores fenced code blocks, import/export/function keyword density and programming punctuation density. The structured data path scores YAML frontmatter, pipe tables and key-value patterns. The classification threshold is 0.4; anything below defaults to `document`.

The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. It has no retrieval-time scoring impact. The intent is to build a labeled dataset that future work can use for type-aware retrieval. Runs behind the `SPECKIT_ENCODING_INTENT` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |

### Tests

| File | Focus |
|------|-------|
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Encoding Intent
     3	// ---------------------------------------------------------------
     4	// Sprint 6a — classify content intent for metadata enrichment.
     5	//
     6	// Classifies each memory's content at index time into one of three
     7	// intent categories: 'document' (prose), 'code' (programming),
     8	// or 'structured_data' (tables/JSON/YAML). The classification is
     9	// stored in the `encoding_intent` column alongside the embedding
    10	// and serves as read-only metadata — it has NO retrieval-time
    11	// scoring impact.
    12	//
    13	// Feature Flag:
    14	//   Controlled by SPECKIT_ENCODING_INTENT=true (opt-in, default off).
    15	//   When the flag is off, classifyEncodingIntent() still returns a
    16	//   classification (default 'document') but callers should gate
    17	//   persistence on isEncodingIntentEnabled().
    18	// ---------------------------------------------------------------
    19	
    20	export type EncodingIntent = 'document' | 'code' | 'structured_data';
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:9:// stored in the `encoding_intent` column alongside the embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:14://   Controlled by SPECKIT_ENCODING_INTENT=true (opt-in, default off).
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:15://   When the flag is off, classifyEncodingIntent() still returns a
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:30:export function classifyEncodingIntent(content: string): EncodingIntent {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:136:    console.error(`[memory-save] Quality loop applied ${qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:167:    console.error(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:208:        console.error(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:224:        console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:228:      console.warn(`[memory-save] TM-04: Quality gate error (proceeding with save): ${message}`);
exec
/bin/zsh -lc 'rg -n "encodingIntent|encoding_intent|classifyEncodingIntent|isEncodingIntentEnabled" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:38:  encodingIntent?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:56:  encodingIntent?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:80:    encodingIntent,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:113:      encodingIntent,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:130:        embedding_generated_at, embedding_status, encoding_intent, document_type, spec_level,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:136:      encodingIntent ?? 'document', documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:175:    encodingIntent,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:200:          encoding_intent = COALESCE(?, encoding_intent),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:207:    `).run(title, triggers_json, importanceWeight, canonicalFilePath, failureReason, now, encodingIntent, documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags), existing.id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:216:      failure_reason, retry_count, encoding_intent, document_type, spec_level,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:221:    importanceWeight, now, now, failureReason, encodingIntent ?? 'document', documentType, specLevel, contentText, qualityScore, JSON.stringify(qualityFlags)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:247:    encodingIntent,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:283:    if (encodingIntent !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:284:      updates.push('encoding_intent = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:285:      values.push(encodingIntent);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:14:import { classifyEncodingIntent } from '../lib/search/encoding-intent';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:15:import { isEncodingIntentEnabled } from '../lib/search/search-flags';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:65:  encoding_intent?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:87:  'file_mtime_ms', 'embedding_status', 'encoding_intent', 'document_type',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:104:  // Use COALESCE for encoding_intent to preserve existing value when new value is null
exec
/bin/zsh -lc 'rg -n "isEncodingIntentEnabled|SPECKIT_ENCODING_INTENT" .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
128: * Default: TRUE (graduated). Set SPECKIT_ENCODING_INTENT=false to disable.
130:export function isEncodingIntentEnabled(): boolean {
131:  return isFeatureEnabled('SPECKIT_ENCODING_INTENT');
codex
Category 13 is showing a broader spread than category 12: some files are just stale source tables, but a few are documenting the wrong layer entirely. I’m in the back half of that category now, especially the save-flow features, because those are where the behavior and integration-path mismatches are clustering.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/14-quality-gate-timer-persistence.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Auto entity extraction

## Current Reality

Memory content contains implicit entities — technology names, architectural concepts, project identifiers — that are valuable for cross-document linking but were never explicitly captured. Manual entity tagging does not scale, and the system had zero entities in its catalog.

Auto entity extraction runs at save time using five pure-TypeScript regex rules with no external NLP dependencies. Rule 1 captures capitalized multi-word sequences (proper nouns like "Claude Code" or "Spec Kit Memory"). Rule 2 extracts technology names from code fence language annotations. Rule 3 identifies nouns following key phrases ("using", "with", "via", "implements"). Rule 4 pulls content from markdown headings. Rule 5 captures quoted strings.

Extracted entities pass through a denylist filter (`entity-denylist.ts`) containing 64 combined stop words across three categories: common nouns (29 words like "thing", "time", "example"), technology stop words (20 words like "api", "json", "npm") and generic modifiers (15 words like "new", "old", "simple"). Single-character entities and entities shorter than 2 characters are also filtered.

Deduplicated entities are stored in the `memory_entities` table with a UNIQUE constraint on `(memory_id, entity_text)`. The `entity_catalog` table maintains canonical names with Unicode-aware alias normalization (`/[^\p{L}\p{N}\s]/gu` — preserving letters and numbers from all scripts) and a `memory_count` field tracking how many memories reference each entity. An `edge_density` check (`totalEdges / totalMemories`) provides a diagnostic metric.

**Sprint 8 update:** Entity normalization was consolidated. Two divergent `normalizeEntityName` functions (ASCII-only in `entity-extractor.ts` vs Unicode-aware in `entity-linker.ts`) were unified into a single Unicode-aware version in `entity-linker.ts`. The `entity-extractor.ts` module now imports and re-exports this function. Similarly, a duplicate `computeEdgeDensity` function was consolidated into `entity-linker.ts`.

Entities are deliberately stored in a separate table rather than as causal edges. Mixing them into `causal_edges` would hit the `MAX_EDGES_PER_NODE=20` limit, distort N2 graph algorithms and pollute N3-lite consolidation. Runs behind the `SPECKIT_AUTO_ENTITIES` flag (default ON).

---

## Source Files

 succeeded in 51ms:
# Quality gate timer persistence

## Current Reality

The `qualityGateActivatedAt` timestamp in `save-quality-gate.ts` was stored purely in-memory. Every server restart reset the 14-day warn-only countdown, preventing the quality gate from graduating to enforcement mode. The fix adds SQLite persistence to the `config` table using the existing key-value store pattern. `isWarnOnlyMode()` lazy-loads from DB when the in-memory value is null. `setActivationTimestamp()` writes to both memory and DB. All DB operations are non-fatal with graceful fallback.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
 succeeded in 51ms:
# Content-aware memory filename generation

## Current Reality

Memory filenames were previously derived solely from the spec folder name, producing identical slugs like `hybrid-rag-fusion-refinement.md` for every save in the same folder. The workflow now builds a `preferredMemoryTask` and uses it for slug/title generation in `generateContentSlug()`, with candidate precedence `task -> specTitle -> sessionCandidates (QUICK_SUMMARY/TITLE/SUMMARY) -> folderBase`. In stateless mode, generic task strings can be enriched from the `spec.md` frontmatter title before candidate selection. In JSON/file-backed mode, that enrichment override remains disabled, but candidate precedence still prefers stronger session-derived names before folder fallback. Generic detection used by selection/enrichment includes `implementation-and-updates`, and slug fallback still uses the generic terms list (`development-session`, `session-summary`, `session-context`, `session`, `context`, `implementation`, `work-session`).

The slug is lowercased, non-alphanumeric characters replaced with hyphens, collapsed, and truncated at a word boundary (hyphen) to a maximum of 50 characters. A minimum length of 8 characters ensures slugs are meaningful. This produces filenames like `04-03-26_17-25__sprint-019-impl-3-phases-81-files.md` instead of `04-03-26_17-25__hybrid-rag-fusion-refinement.md`. Always active with no feature flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/slug-utils.ts` | Lib | Content-aware slug generation |

### Tests

| File | Focus |
|------|-------|
 succeeded in 51ms:
# Entity normalization consolidation

## Current Reality

Two cross-cutting normalization issues were resolved:

**A1 — Divergent normalizeEntityName:** `entity-extractor.ts` used ASCII-only normalization (`/[^\w\s-]/g`) while `entity-linker.ts` used Unicode-aware normalization (`/[^\p{L}\p{N}\s]/gu`). Consolidated to a single Unicode-aware version in `entity-linker.ts`, imported by `entity-extractor.ts`.

**A2 — Duplicate computeEdgeDensity:** Both `entity-extractor.ts` and `entity-linker.ts` had independent implementations. Consolidated to `entity-linker.ts` with import and re-export from `entity-extractor.ts`.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/extraction/entity-denylist.ts` | Lib | Entity denylist |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction |
| `mcp_server/lib/parsing/entity-scope.ts` | Lib | Entity scope parsing |

 succeeded in 51ms:
# Generation-time duplicate and empty content prevention

## Current Reality

Two pre-write quality gates in `scripts/core/file-writer.ts` prevent empty and duplicate memory files at generation time, complementing the existing index-time dedup in `memory-save.ts`. The empty content gate (`validateContentSubstance`) strips YAML frontmatter, HTML comments, anchor markers, empty headings, table rows and empty list items, then rejects files with fewer than 200 characters of remaining substance. The duplicate gate (`checkForDuplicateContent`) computes a SHA-256 hash of the file content and compares it against all existing `.md` files in the target memory directory, rejecting exact matches.

Both gates run inside `writeFilesAtomically()` before the atomic write operation, after the existing `validateNoLeakedPlaceholders` check. Failures throw descriptive errors that halt the save and report which validation failed. This catches the two most common quality problems — SGQS-template-only files and repeated saves of identical content — at the earliest possible point. Always active with no feature flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/handler-utils.ts` | Handler | Handler utility helpers |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |
 succeeded in 51ms:
# Deferred lexical-only indexing

## Current Reality

Async embedding fallback via `index_memory_deferred()`. When embedding generation fails (API timeout, rate limit), memories are inserted with `embedding_status='pending'` and are immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search requires `embedding_status='success'`. Deferred memories skip embedding dimension validation and `vec_memories` insertion. Background retry via the retry manager or CLI reindex increments `retry_count` and updates status. Failure reason is recorded for diagnostics.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations with deferred path |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema including embedding_status |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding generation pipeline with fallback |

### Tests

| File | Focus |
|------|-------|
 succeeded in 52ms:
# Dry-run preflight for memory_save

## Current Reality

The `memory_save` tool accepts a `dryRun` parameter that runs the full save pipeline — content normalization, quality gate evaluation, deduplication check, token budget estimation — without committing any changes to the database or writing files to disk. The response includes what would have happened: whether the save would pass quality gates, the computed quality score breakdown, any near-duplicate warnings, and the estimated token cost.

This allows agents to preview a save operation before committing, catching quality gate rejections or duplicate content early. The dry-run path shares the same validation code as the real save path, ensuring preview accuracy matches production behavior.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Save handler with dry-run path |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions including dryRun flag |
| `mcp_server/lib/validation/preflight.ts` | Lib | Pre-flight validation logic |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod schema with dryRun parameter |
| `mcp_server/tool-schemas.ts` | Core | Tool schema with dryRun option |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts | sed -n '1,300p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "validateContentSubstance|checkForDuplicateContent|writeFilesAtomically|validateNoLeakedPlaceholders|200 characters|SHA-256|duplicate content" .opencode/skill/system-spec-kit/scripts/core/file-writer.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "preferredMemoryTask|generateContentSlug|pickBestContentName|ensureUniqueMemoryFilename|implementation-and-updates|specTitle|folderBase|sessionCandidates" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "activation timestamp|qualityGateActivatedAt|config table|persistActivationTimestampToDb|loadActivationTimestampFromDb|clearActivationTimestampFromDb" .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "entity_catalog|memory_entities|normalizeEntityName|computeEdgeDensity|SPECKIT_AUTO_ENTITIES|denylist|quoted strings|code fence" .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-linker.ts .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "dryRun|dry_run|runPreflight|would pass|quality score breakdown|no commit|preview" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Entity Extractor
     3	// ---------------------------------------------------------------
     4	// Deferred feature — gated via SPECKIT_AUTO_ENTITIES
     5	// Pure-TS rule-based extraction, zero npm dependencies.
     6	// ---------------------------------------------------------------
     7	
     8	import { isEntityDenied } from './entity-denylist.js';
     9	import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker.js';
    10	
    11	import type Database from 'better-sqlite3';
    12	
    13	// AI-WHY: Re-export canonical versions from entity-linker for backward compatibility
    14	export { normalizeEntityName, computeEdgeDensity };
    15	
    16	// ---------------------------------------------------------------------------
    17	// 1. TYPES
    18	// ---------------------------------------------------------------------------
    19	
    20	/** A single entity extracted from memory content. */
 succeeded in 51ms:
10:import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';
46:function validateContentSubstance(content: string, filename: string): void {
65:async function checkForDuplicateContent(
94:export async function writeFilesAtomically(
102:    validateNoLeakedPlaceholders(content, filename);
103:    validateContentSubstance(content, filename);
105:    const duplicateOf = await checkForDuplicateContent(contextDir, content, filename);
 succeeded in 50ms:
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:6:import { isContaminatedMemoryName, isGenericContentTask, normalizeMemoryNameCandidate, pickBestContentName } from './slug-utils';
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:34:  specTitle: string,
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:35:  folderBase: string,
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:36:  sessionCandidates: readonly string[] = [],
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:40:    ? [task, specTitle, ...sessionCandidates, folderBase]
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:41:    : [task, ...sessionCandidates, folderBase];
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:43:  return pickBestContentName(candidates)
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:44:    || normalizeMemoryNameCandidate(folderBase);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:26:import { generateContentSlug, pickBestContentName, ensureUniqueMemoryFilename } from '../utils/slug-utils';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:312:  const preferredTitle = pickBestContentName([implementationTask]);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:940:  const folderBase: string = specFolderBasename.replace(/^\d+-/, '');
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:944:    const specTitle = extractSpecTitle(specFolder);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:952:      if (specTitle.length >= 8) {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:953:        enrichedTask = specTitle;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:958:  const preferredMemoryTask = pickPreferredMemoryTask(
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:960:    specTitle,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:961:    folderBase,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:969:  const contentSlug: string = generateContentSlug(preferredMemoryTask, folderBase);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:971:  const ctxFilename: string = ensureUniqueMemoryFilename(contextDir, rawCtxFilename);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:976:  const memoryTitle = buildMemoryTitle(preferredMemoryTask, specFolderName, sessionData.DATE);
 succeeded in 50ms:
141:/** SQLite config key for persisted activation timestamp */
148: * Ensure the config table exists for the active DB handle.
158: * Load the activation timestamp from SQLite config table.
161:function loadActivationTimestampFromDb(): number | null {
175: * Persist the activation timestamp to SQLite config table.
178:function persistActivationTimestampToDb(timestamp: number): void {
191: * Clear the activation timestamp from SQLite config table.
194:function clearActivationTimestampFromDb(): void {
210: * P1-015: Also persisted to SQLite config table. On access, lazy-loads
213:let qualityGateActivatedAt: number | null = null;
237:  if (qualityGateActivatedAt === null) {
238:    const persisted = loadActivationTimestampFromDb();
240:      qualityGateActivatedAt = persisted;
244:  if (qualityGateActivatedAt === null) {
247:  const elapsed = Date.now() - qualityGateActivatedAt;
252: * Record the activation timestamp for warn-only mode tracking.
255: * P1-015: Persists to SQLite config table for restart survival.
260:  qualityGateActivatedAt = timestamp ?? Date.now();
261:  persistActivationTimestampToDb(qualityGateActivatedAt);
265: * Reset the activation timestamp. Used in testing.
 exited 2 in 50ms:
rg: .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-linker.ts: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:48: * Complete denylist of common nouns, technology stop words, and generic
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:63: * Check if a term is on the entity denylist (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:73: * Get the total number of words in the entity denylist.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:75: * @returns The size of the entity denylist set
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:4:// Deferred feature — gated via SPECKIT_AUTO_ENTITIES
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:8:import { isEntityDenied } from './entity-denylist.js';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:9:import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker.js';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:14:export { normalizeEntityName, computeEdgeDensity };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:39: *   2. Technology names from code fence annotations → technology
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:59:  // Rule 2: Technology names from code fence annotations
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:95: * Filter entities through denylist + length checks.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:99: *   - Entities where ALL words are on the denylist
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:113:    // Remove entities where ALL words are on the denylist
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:126: * Store extracted entities in the memory_entities table.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:142:      INSERT OR REPLACE INTO memory_entities
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:169: * Upsert entities into entity_catalog with alias normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:172: *   1. normalizeEntityName(text) -> canonical_name
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:189:      'SELECT id, aliases, memory_count FROM entity_catalog WHERE canonical_name = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:192:      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Embedding Pipeline
     3	// ---------------------------------------------------------------
     4	
     5	import path from 'path';
     6	import type Database from 'better-sqlite3';
     7	
     8	import * as embeddings from '../../lib/providers/embeddings';
     9	import { lookupEmbedding, storeEmbedding } from '../../lib/cache/embedding-cache';
    10	import { normalizeContentForEmbedding } from '../../lib/parsing/content-normalizer';
    11	import type { ParsedMemory } from '../../lib/parsing/memory-parser';
    12	import { toErrorMessage } from '../../utils';
    13	
    14	export interface EmbeddingResult {
    15	  embedding: Float32Array | null;
    16	  status: 'success' | 'pending';
    17	  failureReason: string | null;
    18	}
    19	
    20	export async function generateOrCacheEmbedding(
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:173:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:287:  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false, asyncEmbedding = false } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:305:    const preflightResult = preflight.runPreflight(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:311:        find_similar: findSimilarMemories as Parameters<typeof preflight.runPreflight>[0]['find_similar'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:314:        dry_run: dryRun,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:324:    if (dryRun) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:326:      const dryRunSummary = preflightResult.dry_run_would_pass
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:332:        summary: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:334:          status: 'dry_run',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:335:          would_pass: preflightResult.dry_run_would_pass,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:344:          message: dryRunSummary,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:346:        hints: preflightResult.dry_run_would_pass
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:95:  dryRun?: boolean;
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:140:  dryRun: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:357:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding'],
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '280,350p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   280	
   281	/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
   282	async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
   283	  // A7-P2-1: Generate requestId for incident correlation in error responses
   284	  const requestId = randomUUID();
   285	  await checkDatabaseUpdated();
   286	
   287	  const { filePath: file_path, force = false, dryRun = false, skipPreflight = false, asyncEmbedding = false } = args;
   288	
   289	  if (!file_path || typeof file_path !== 'string') {
   290	    throw new Error('filePath is required and must be a string');
   291	  }
   292	
   293	  const validatedPath: string = validateFilePathLocal(file_path);
   294	
   295	  if (!memoryParser.isMemoryFile(validatedPath)) {
   296	    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
   297	  }
   298	
   299	  // PRE-FLIGHT VALIDATION
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/file-writer.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: File Writer
     3	// ---------------------------------------------------------------
     4	// Atomic file writing with validation and rollback on failure
     5	
     6	import * as fs from 'fs/promises';
     7	import * as fsSync from 'fs';
     8	import * as path from 'path';
     9	import * as crypto from 'crypto';
    10	import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';
    11	
    12	const MIN_SUBSTANCE_CHARS = 200;
    13	const FRONTMATTER_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;
    14	
    15	function verifyResolvedWriteTarget(
    16	  resolvedContextDir: string,
    17	  filePath: string,
    18	  filename: string
    19	): void {
    20	  const realContextDir = fsSync.realpathSync(resolvedContextDir);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Slug Utils
     3	// ---------------------------------------------------------------
     4	// Content-aware slug generation for memory filenames
     5	
     6	import { createHash } from 'node:crypto';
     7	import * as fs from 'node:fs';
     8	import * as path from 'node:path';
     9	
    10	const GENERIC_TASK_SLUGS = new Set([
    11	  'development-session',
    12	  'session-summary',
    13	  'session-context',
    14	  'session',
    15	  'context',
    16	  'implementation',
    17	  'work-session',
    18	  'implementation-and-updates',
    19	]);
    20	
exec
/bin/zsh -lc "ls .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
     1	// ---------------------------------------------------------------
     2	// MODULE: Entity Linker
     3	// ---------------------------------------------------------------
     4	// Gated via SPECKIT_ENTITY_LINKING
     5	// Creates causal edges between memories sharing entities across spec folders.
     6	// ---------------------------------------------------------------
     7	
     8	import type Database from 'better-sqlite3';
     9	import { isEntityLinkingEnabled } from './search-flags';
    10	
    11	// ---------------------------------------------------------------------------
    12	// 1. CONSTANTS
    13	// ---------------------------------------------------------------------------
    14	
    15	/** Maximum causal edges per node to prevent graph density explosion. */
    16	const MAX_EDGES_PER_NODE = 20;
    17	
    18	/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
    19	const DEFAULT_MAX_EDGE_DENSITY = 1.0;
exec
/bin/zsh -lc 'rg -n "isAutoEntitiesEnabled|SPECKIT_AUTO_ENTITIES" .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:162: * Default: TRUE (enabled). Set SPECKIT_AUTO_ENTITIES=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:164:export function isAutoEntitiesEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:165:  return isFeatureEnabled('SPECKIT_AUTO_ENTITIES');
exec
/bin/zsh -lc 'rg -n "extractEntities|storeEntities|updateEntityCatalog|isAutoEntitiesEnabled|memory_entities|entity_catalog" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:164:export function isAutoEntitiesEnabled(): boolean {
exec
/bin/zsh -lc "rg -n \"extractEntities\\(|storeEntities\\(|updateEntityCatalog\\(|isAutoEntitiesEnabled\\(\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:68:  if (isAutoEntitiesEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:70:      const rawEntities = extractEntities(parsed.content);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:73:        const entityResult = storeEntities(database, id, filtered);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:74:        updateEntityCatalog(database, filtered);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:103:  if (isEntityLinkingEnabled() && isAutoEntitiesEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:80:    const result = extractEntities('');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:85:    const result = extractEntities('   \n\t  ');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:92:    const result = extractEntities('The Spec Kit Memory system is robust.');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:99:    const result = extractEntities('Here is code:\n```typescript\nconst x = 1;\n```\nAnd more:\n```python\nprint("hi")\n```');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:112:    const result = extractEntities('Built using React and integrates via GraphQL. Implements Singleton pattern.');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:121:    const result = extractEntities('## Architecture Overview\nSome text.\n### Database Schema\nMore text.');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:132:    const result = extractEntities('The module is called "Entity Extractor" and outputs "valid" results.');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:146:    const result = extractEntities(content);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:156:    const result = extractEntities(content);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:171:    const result = extractEntities(content);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:188:    const result = extractEntities(content);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:194:    const result = extractEntities(content);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:203:    const tooShort = extractEntities('Value "a" end');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:206:    const justRight = extractEntities('Value "hello world" end');
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:211:    const tooLong = extractEntities('Value "' + 'A'.repeat(51) + '" end');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts | sed -n '56,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    56	        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
    57	      }
    58	      if (causalLinksResult.unresolved.length > 0) {
    59	        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
    60	      }
    61	    } catch (causal_err: unknown) {
    62	      const message = toErrorMessage(causal_err);
    63	      console.warn(`[memory-save] Causal links processing failed: ${message}`);
    64	    }
    65	  }
    66	
    67	  // -- AI-TRACE:R10: Auto Entity Extraction --
    68	  if (isAutoEntitiesEnabled()) {
    69	    try {
    70	      const rawEntities = extractEntities(parsed.content);
    71	      const filtered = filterEntities(rawEntities);
    72	      if (filtered.length > 0) {
    73	        const entityResult = storeEntities(database, id, filtered);
    74	        updateEntityCatalog(database, filtered);
    75	        console.error(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Entity Denylist
     3	// ---------------------------------------------------------------
     4	// Common nouns and stop words filtered from entity extraction.
     5	// ---------------------------------------------------------------
     6	
     7	// ---------------------------------------------------------------------------
     8	// 1. COMMON NOUNS
     9	// High-frequency English nouns that carry little entity signal.
    10	// ---------------------------------------------------------------------------
    11	
    12	const COMMON_NOUNS: readonly string[] = [
    13	  'thing', 'things', 'way', 'ways', 'time', 'times',
    14	  'year', 'years', 'people', 'system', 'part', 'case',
    15	  'point', 'group', 'problem', 'fact', 'place', 'world',
    16	  'example', 'end', 'head', 'side', 'area', 'line',
    17	  'work', 'day', 'number', 'use', 'change',
    18	] as const;
    19	
    20	// ---------------------------------------------------------------------------
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "index_memory_deferred|embedding_status|pending|retry_count|failure_reason|vec_memories|success|deferred" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Vector Index Mutations
     3	// ---------------------------------------------------------------
     4	// Split from vector-index-store.ts — contains ALL mutation functions:
     5	// index, update, delete, and status/confidence updates.
     6	
     7	import { getCanonicalPathKey } from '../utils/canonical-path';
     8	import { createLogger } from '../utils/logger';
     9	import * as embeddingsProvider from '../providers/embeddings';
    10	import {
    11	  to_embedding_buffer,
    12	  get_error_message,
    13	} from './vector-index-types';
    14	import {
    15	  initialize_db,
    16	  get_embedding_dim,
    17	  init_prepared_statements,
    18	  clear_constitutional_cache,
    19	  refresh_interference_scores_for_folder,
    20	  sqlite_vec_available as get_sqlite_vec_available,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:16:  status: 'success' | 'pending';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:27:  let embeddingStatus: 'success' | 'pending' = 'pending';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:41:        embeddingStatus = 'success';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:49:          embeddingStatus = 'success';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:25:  success: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:26:  pending: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:39:  embedding_status: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:40:  retry_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:65: * Count rows in memory_index grouped by embedding_status.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:72:    SELECT embedding_status, COUNT(*) as cnt
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:74:    GROUP BY embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:75:  `).all() as Array<{ embedding_status: string; cnt: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:79:    success: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:80:    pending: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:89:    switch (row.embedding_status) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:90:      case 'success': stats.success = count; break;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:91:      case 'pending': stats.pending = count; break;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:102: * True if any pending/retry/partial entries exist in memory_index.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:112:    WHERE embedding_status IN ('pending', 'retry', 'partial')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:119: * Returns rows where embedding_status is NOT 'success' and NOT 'failed'.
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Retry Manager
     3	// ---------------------------------------------------------------
     4	
     5	// Node stdlib
     6	import * as fsPromises from 'fs/promises';
     7	
     8	// Internal modules
     9	import * as vectorIndex from '../search/vector-index';
    10	import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache';
    11	import { normalizeContentForEmbedding } from '../parsing/content-normalizer';
    12	import { generateDocumentEmbedding, getModelName } from './embeddings';
    13	
    14	// Type imports
    15	import type { MemoryDbRow } from '@spec-kit/shared/types';
    16	
    17	/* ---------------------------------------------------------------
    18	   1. TYPES
    19	--------------------------------------------------------------- */
    20	
codex
I’ve isolated the category 13 rewrites and the stale-table cases. Next I’m tackling category 14 in two passes: first the known high-risk files from the prior audit context, then the remaining architecture docs to catch missing integration paths and undocumented behavior without losing the line-by-line evidence.
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/08-performance-improvements.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/21-atomic-pending-file-recovery.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# MPAB chunk-to-memory aggregation

## Current Reality

When a memory file splits into chunks, each chunk gets its own score. Multi-Parent Aggregated Bonus combines those chunk scores into a single memory-level score using the formula `sMax + 0.3 * sum(remaining) / sqrt(N)`. The top chunk score becomes the base, and the remaining chunks contribute a damped bonus.

Guards handle the edge cases: N=0 returns 0, N=1 returns the raw score and N>1 applies MPAB. The bonus coefficient (0.3) is exported as `MPAB_BONUS_COEFFICIENT` for tuning. The aggregation runs in Stage 3 of the 4-stage pipeline after RRF fusion and before state filtering. Runs behind the `SPECKIT_DOCSCORE_AGGREGATION` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/mpab-aggregation.ts` | Lib | MPAB chunk aggregation |

### Tests

| File | Focus |
|------|-------|
 succeeded in 52ms:
# Performance improvements

## Current Reality

Thirteen performance improvements were applied:

**Quick wins:** `Math.max(...spread)` replaced with `reduce`-based max in `tfidf-summarizer.ts` (prevents RangeError on large arrays). Unbounded query in `memory-summaries.ts` gained a `LIMIT` clause. O(n) full scan in `mutation-ledger.ts` replaced with SQL `COUNT(*)` query using `json_extract`.

**Entity linker:** `mergedEntities` array lookups converted to `Set` for O(1) `.has()` checks. N+1 `getEdgeCount` queries replaced with a single batch query that combines `source_id IN (...)` and `target_id IN (...)` branches via `UNION ALL` before aggregation.

**SQL-level:** Causal edge upsert reduced from 3 DB round-trips to 2 by eliminating the post-upsert SELECT via `lastInsertRowid`. Spec folder hierarchy tree cached with a 60-second WeakMap TTL keyed by database instance.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Tool Cache |
 succeeded in 51ms:
# Atomic write-then-index API

## Current Reality

The `memory_save` handler offers an atomic write-then-index mode where file writing and database indexing are coupled in a single transactional unit. The transaction manager writes the memory content to a `_pending` temporary file, inserts the database row (memory_index, vec_memories, BM25 tokens) inside a SQLite transaction, and only renames the pending file to its final path after the DB commit succeeds. If the DB transaction fails, the pending file is cleaned up and no partial state is left on disk.

This ensures that a memory file and its corresponding index entry either both exist or neither does. The `AtomicSaveResult` interface reports `dbCommitted` status so callers can distinguish between a full success and a partial commit (DB succeeded but rename failed, leaving a pending file for startup recovery).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Atomic write + DB transaction coupling |
| `mcp_server/handlers/memory-save.ts` | Handler | Save handler using atomic write path |
| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |

### Tests

 succeeded in 51ms:
# Backend storage adapter abstraction

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Vector/graph/document storage abstractions (`IVectorStore`, `IGraphStore`, `IDocumentStore`) are deferred to avoid premature abstraction while SQLite coupling handles current scale. Estimated effort: M-L (1-2 weeks).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Backend storage adapter abstraction
- Current reality source: feature_catalog.md
 succeeded in 51ms:
# Atomic pending-file recovery

## Current Reality

The transaction manager maintains an atomic write protocol where memory files are first written to a `_pending` path and only renamed to their final location after the database transaction commits. When a crash or error interrupts this sequence after DB commit but before rename, a `_pending` file is left on disk as a recoverable artifact.

The `findPendingFiles()` function scans the memory directories for files matching the `_pending` suffix. Each discovered pending file is checked against the database: if the corresponding DB row exists (committed), the file is renamed to its final path completing the interrupted operation. The `recoverPendingFile()` function handles individual file recovery and updates the `totalRecoveries` metric. This mechanism ensures zero data loss from interrupted save operations.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Pending file detection and recovery |
| `mcp_server/context-server.ts` | Core | Startup recovery invocation |

### Tests

| File | Focus |
 succeeded in 51ms:
# Legacy V1 pipeline removal

## Current Reality

The legacy V1 pipeline  was the root cause of 3 of 4 P0 bugs: an inverted `STATE_PRIORITY` map, divergent scoring order in `postSearchPipeline()`, and a mismatched `MAX_DEEP_QUERY_VARIANTS=6`. Since V2 was already the default, removing the dead code resolved all three at once. Deleted functions: `STATE_PRIORITY`, `MAX_DEEP_QUERY_VARIANTS`, `buildDeepQueryVariants()`, `strengthenOnAccess()`, `applyTestingEffect()`, `filterByMemoryState()`, `applyCrossEncoderReranking()`, `applyIntentWeightsToResults()`, `shouldApplyPostSearchIntentWeighting()`, `postSearchPipeline()`. The `isPipelineV2Enabled()` function now always returns `true` with a deprecation comment. Unused imports (`fsrsScheduler`, `tierClassifier`, `crossEncoder`) were removed.

Orphaned chunk detection was added to `verify_integrity()` as the fourth P0 fix: chunks whose parent has been deleted but the chunk record persists (e.g., if FK cascade didn't fire) are now detected and optionally auto-cleaned when `autoClean=true`.

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
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "MPAB|aggregate.*chunk|SPECKIT_DOCSCORE_AGGREGATION|mpab" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "postSearchPipeline|isPipelineV2Enabled|MAX_DEEP_QUERY_VARIANTS|STATE_PRIORITY|orphaned chunk|verify_integrity|autoClean" .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"Math.max\\(|reduce\\(|LIMIT|COUNT\\(\\*\\)|WeakMap|entity linker|UNION ALL|lastInsertRowid\" .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:62: * R1 MPAB: Document-level chunk-to-memory score aggregation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:63: * Default: TRUE (graduated). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:66:  return isFeatureEnabled('SPECKIT_DOCSCORE_AGGREGATION');
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:4:// Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:6:// Feature flag: SPECKIT_DOCSCORE_AGGREGATION (default OFF)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:11: * Result of MPAB aggregation for a single parent memory.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:12: * Contains the aggregated score and metadata about the chunks
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:18:  /** MPAB-aggregated score: sMax + 0.3 * sum(remaining) / sqrt(N). */
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:19:  mpabScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:43: * Collapsed result for a parent memory after MPAB aggregation.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:44: * Contains the aggregated score and chunks reassembled in
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:55: * Bonus coefficient for MPAB aggregation.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:58:export const MPAB_BONUS_COEFFICIENT = 0.3;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:63: * Check if MPAB chunk-to-memory aggregation is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:64: * Default: TRUE (graduated Sprint 4). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:66: * @returns True if MPAB aggregation is enabled (default: ON)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:69:  return process.env.SPECKIT_DOCSCORE_AGGREGATION?.toLowerCase() !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:75: * Compute the Multi-Parent Aggregated Bonus (MPAB) score from an array
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:94: * @returns MPAB aggregated score (may exceed 1.0 for multi-chunk documents)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:96:export function computeMPAB(scores: number[]): number {
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:101:export function isPipelineV2Enabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:791:  async verifyIntegrity(options: { autoClean?: boolean } = {}) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:793:    const { verify_integrity } = await import('./vector-index-queries');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:794:    return verify_integrity(options);
 succeeded in 51ms:
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
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:160:  const id = (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:196:  // AI-WHY: String interpolation in LIMIT/OFFSET is safe here because both values
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:198:  // Math.floor guarantees no decimal component, Math.max(1,…)/Math.max(0,…)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:200:  const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:201:  const offset = opts.offset ? `OFFSET ${Math.max(0, Math.floor(opts.offset))}` : '';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:210:  const row = db.prepare('SELECT COUNT(*) as count FROM mutation_ledger').get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:258:  return Math.max(1, Math.floor(maxRetries as number));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:286:  // Use COUNT(*) with json_extract to filter by path in SQL rather than scanning
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:289:    SELECT COUNT(*) AS cnt
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:305:  // AI-WHY: Use COUNT(*) with json_extract to avoid O(n) full-table scan in application code.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:307:    SELECT COUNT(*) AS cnt
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:323:  const safeAttempts = Math.max(0, Math.floor(attemptsSoFar));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:40:const MAX_EDGES_LIMIT = 100;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:168:    const clampedStrength = Math.max(0, Math.min(1, effectiveStrength));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:307:function getEdgesFrom(sourceId: string, limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:315:      LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:324:function getEdgesTo(targetId: string, limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:332:      LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:341:function getAllEdges(limit: number = MAX_EDGES_LIMIT): CausalEdge[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:348:      LIMIT ?
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts | sed -n '320,430p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   320	
   321	    // If original exists and is newer, delete pending
   322	    if (fs.existsSync(originalPath)) {
   323	      const pendingStats = fs.statSync(pendingPath);
   324	      const originalStats = fs.statSync(originalPath);
   325	
   326	      if (originalStats.mtimeMs > pendingStats.mtimeMs) {
   327	        fs.unlinkSync(pendingPath);
   328	        return { path: pendingPath, recovered: false, error: 'Original is newer' };
   329	      }
   330	    }
   331	
   332	    // Rename pending to original
   333	    fs.renameSync(pendingPath, originalPath);
   334	    metrics.totalRecoveries++;
   335	    metrics.lastOperationTime = new Date().toISOString();
   336	
   337	    return { path: pendingPath, recovered: true };
   338	  } catch (error: unknown) {
   339	    const msg = error instanceof Error ? error.message : String(error);
exec
/bin/zsh -lc 'rg -n "executeAtomicSave|recoverAllPendingFiles|findPendingFiles|dbCommitted" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:36:  dbCommitted?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:195:function executeAtomicSave(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:213:    // cannot be rolled back. The dbCommitted flag tracks this state so the error path
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:216:    let dbCommitted = false;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:221:      dbCommitted = true;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:234:    // The `dbCommitted` flag on the returned error result enables callers to detect
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:236:    // Mitigation: `recoverAllPendingFiles()` can be called on startup to find
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:242:      // Leave pending file for startup recovery and report failure with dbCommitted flag.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:246:      return { success: false, filePath, error: `Rename failed after DB commit: ${msg}`, dbCommitted };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:294:function findPendingFiles(dirPath: string): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:309:    console.warn(`[transaction-manager] findPendingFiles error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:348:function recoverAllPendingFiles(dirPath: string): RecoveryResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:349:  const pendingFiles = findPendingFiles(dirPath);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:374:  executeAtomicSave,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:377:  findPendingFiles,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:379:  recoverAllPendingFiles,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:445:    const rawResults = scanLocations.flatMap(loc => transactionManager.recoverAllPendingFiles(loc));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:397: * `executeAtomicSave` expects a synchronous `dbOperation` callback.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:412:  const result = transactionManager.executeAtomicSave(
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '388,450p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '430,460p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '820,900p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '96,110p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   430	      if (fs.existsSync(skillDir)) {
   431	        const entries = fs.readdirSync(skillDir, { withFileTypes: true });
   432	        for (const entry of entries) {
   433	          if (entry.isDirectory() && !entry.name.startsWith('.')) {
   434	            const constDir = path.join(skillDir, entry.name, 'constitutional');
   435	            if (fs.existsSync(constDir)) {
   436	              scanLocations.push(constDir);
   437	            }
   438	          }
   439	        }
   440	      }
   441	    } catch (_error: unknown) {
   442	      // Non-fatal: constitutional directory discovery failed
   443	    }
   444	
   445	    const rawResults = scanLocations.flatMap(loc => transactionManager.recoverAllPendingFiles(loc));
   446	
   447	    // Aggregate per-file results into a summary
   448	    const found = rawResults.length;
   449	    const recovered = rawResults.filter(r => r.recovered).length;
 succeeded in 52ms:
   388	
   389	/* --- 10. ATOMIC MEMORY SAVE --- */
   390	
   391	/**
   392	 * Save memory content to disk with best-effort indexing.
   393	 *
   394	 * **NOT truly atomic.** The file write uses atomic rename (write-to-temp +
   395	 * rename), but DB indexing runs asynchronously afterward because
   396	 * `indexMemoryFile` requires async embedding generation while
   397	 * `executeAtomicSave` expects a synchronous `dbOperation` callback.
   398	 *
   399	 * On embedding failure, the memory is saved to disk and indexed in the DB
   400	 * **without vector embeddings** — a partial-success state. The caller
   401	 * receives a `status: 'partial'` result with a hint to retry
   402	 * `memory_save({ filePath, force: true })` to rebuild the index entry.
   403	 *
   404	 * P4-01/P4-17 NOTE: True atomicity between file write and DB indexing is not
   405	 * achievable under this architecture.
   406	 */
   407	async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
 succeeded in 51ms:
   820	      avgSimilarity: Math.round((row.avg_similarity || 0) * 100) / 100,
   821	      conceptSimilarities: (row.concept_similarities as number[] | undefined) || [],
   822	      title,
   823	      specFolder: row.spec_folder,
   824	      filePath: row.file_path,
   825	      date,
   826	      tags,
   827	      snippet,
   828	      id: row.id,
   829	      importanceWeight: row.importance_weight ?? 0.5,
   830	      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
   831	    };
   832	  });
   833	
   834	  const elapsed = Date.now() - start_time;
   835	  if (elapsed > 500) {
   836	    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
   837	  }
   838	
   839	  return enriched_results;
 succeeded in 51ms:
    96	 * R6: 4-stage pipeline architecture (Stage 1-4 with Stage 4 invariant).
    97	 * @deprecated Always returns true. Legacy V1 pipeline was removed in
    98	 * 017-refinement-phase-6 Sprint 1. The SPECKIT_PIPELINE_V2 env var is
    99	 * still accepted but ignored — V2 is the only code path.
   100	 */
   101	export function isPipelineV2Enabled(): boolean {
   102	  return true;
   103	}
   104	
   105	/**
   106	 * R12: Query expansion for embedding-based retrieval.
   107	 * Suppressed when R15 classification = "simple" (mutual exclusion).
   108	 * Default: TRUE (graduated). Set SPECKIT_EMBEDDING_EXPANSION=false to disable.
   109	 */
   110	export function isEmbeddingExpansionEnabled(): boolean {
exec
/bin/zsh -lc 'rg -n "orphan|chunk.*parent|autoClean|verify_integrity" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
1260:// BUG-013 FIX: Added autoClean option for automatic orphan cleanup
1266:export function verify_integrity(options: { autoClean?: boolean } = {}): { totalMemories: number; totalVectors: number; orphanedVectors: number; missingVectors: number; orphanedFiles: Array<{ id: number; file_path: string; reason: string }>; orphanedChunks: number; isConsistent: boolean; cleaned?: { vectors: number; chunks: number } } {
1267:  const { autoClean = false } = options;
1271:  const find_orphaned_vector_ids = () => {
1279:      console.warn('[vector-index] Could not query orphaned vectors:', get_error_message(e));
1284:  const orphaned_vector_ids = find_orphaned_vector_ids();
1285:  const orphaned_vectors = orphaned_vector_ids.length;
1288:  if (autoClean && orphaned_vectors > 0 && sqlite_vec) {
1289:    logger.info(`Auto-cleaning ${orphaned_vectors} orphaned vectors...`);
1291:    for (const rowid of orphaned_vector_ids) {
1296:        console.warn(`[vector-index] Failed to clean orphaned vector ${rowid}: ${get_error_message(e)}`);
1299:    logger.info(`Cleaned ${cleaned_vectors} orphaned vectors`);
1311:  const check_orphaned_files = () => {
1313:    const orphaned: Array<{ id: number; file_path: string; reason: string }> = [];
1317:        orphaned.push({
1325:    return orphaned;
1328:  const orphaned_files = check_orphaned_files();
1330:  const find_orphaned_chunks = () => {
1343:      console.warn('[vector-index] Could not query orphaned chunks:', get_error_message(e));
1348:  const orphaned_chunks = find_orphaned_chunks();
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '1260,1378p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  1260	// BUG-013 FIX: Added autoClean option for automatic orphan cleanup
  1261	/**
  1262	 * Verifies vector-index consistency and optional cleanup results.
  1263	 * @param options - Integrity verification options.
  1264	 * @returns The integrity summary.
  1265	 */
  1266	export function verify_integrity(options: { autoClean?: boolean } = {}): { totalMemories: number; totalVectors: number; orphanedVectors: number; missingVectors: number; orphanedFiles: Array<{ id: number; file_path: string; reason: string }>; orphanedChunks: number; isConsistent: boolean; cleaned?: { vectors: number; chunks: number } } {
  1267	  const { autoClean = false } = options;
  1268	  const database = initialize_db();
  1269	  const sqlite_vec = get_sqlite_vec_available();
  1270	
  1271	  const find_orphaned_vector_ids = () => {
  1272	    if (!sqlite_vec) return [];
  1273	    try {
  1274	      return (database.prepare(`
  1275	        SELECT v.rowid FROM vec_memories v
  1276	        WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE m.id = v.rowid)
  1277	      `).all() as Array<{ rowid: number }>).map((r) => r.rowid);
  1278	    } catch (e: unknown) {
  1279	      console.warn('[vector-index] Could not query orphaned vectors:', get_error_message(e));
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '390,590p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   390	
   391	// -- Internal: MPAB Chunk Collapse + Parent Reassembly ---------
   392	
   393	/**
   394	 * Collapse chunk-level hits and reassemble parent memory documents.
   395	 *
   396	 * MPAB (Multi-Part Aggregation + Backfill) algorithm:
   397	 *   1. Separate rows into chunks (has `parent_id`) and non-chunks.
   398	 *   2. Group chunks by `parent_id`.
   399	 *   3. For each group, elect the best chunk (highest score).
   400	 *   4. Attempt to load the full parent content from the database.
   401	 *   5. If the DB query succeeds, emit a reassembled parent row.
   402	 *   6. If the DB query fails, fall back to the best-chunk content.
   403	 *   7. Merge non-chunks + reassembled parents, sort by score descending.
   404	 *
   405	 * Pipeline position constraint: this function MUST NOT be called before
   406	 * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
   407	 *
   408	 * @param results - Scored pipeline rows from (optionally reranked) Stage 3.
   409	 * @returns Object with aggregated rows and chunk reassembly statistics.
exec
/bin/zsh -lc 'rg -n "lastInsertRowid|INSERT INTO causal_edges|ON CONFLICT|upsert" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
174:      // to write a weight_history row after the upsert. The subsequent INSERT
175:      // uses last_insert_rowid() to avoid a second post-upsert SELECT.
182:        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
184:        ON CONFLICT(source_id, target_id, relation) DO UPDATE SET
196:        logWeightChange(rowId, existing.strength, clampedStrength, createdBy, 'insert-upsert');
exec
/bin/zsh -lc 'rg -n "MAX_DEEP_QUERY_VARIANTS|buildDeepQueryVariants|strengthenOnAccess|applyTestingEffect|filterByMemoryState|applyCrossEncoderReranking|applyIntentWeightsToResults|shouldApplyPostSearchIntentWeighting|postSearchPipeline|STATE_PRIORITY" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/cognitive' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:51:const MAX_DEEP_QUERY_VARIANTS = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:115: * The original query is always the first variant. Up to `MAX_DEEP_QUERY_VARIANTS - 1`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:122: * @returns Array of distinct query variants, original first, capped at MAX_DEEP_QUERY_VARIANTS.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:124:async function buildDeepQueryVariants(query: string): Promise<string[]> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:131:    return Array.from(variants).slice(0, MAX_DEEP_QUERY_VARIANTS);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:135:      `[stage1-candidate-gen] buildDeepQueryVariants failed, using original query: ${msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:233:      const queryVariants = await buildDeepQueryVariants(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:612:  buildDeepQueryVariants,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:23:// FILTER APPLICATION ORDER (within filterByMemoryState):
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:29://   2. Apply memory-state filtering (filterByMemoryState)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:51:const STATE_PRIORITY: Record<string, number> = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:72:const UNKNOWN_STATE_PRIORITY = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:79:  return normalizedState in STATE_PRIORITY ? normalizedState : null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:99: * Per-state tally produced by `filterByMemoryState`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:105: * Return value of the internal `filterByMemoryState` function.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:119:   3. INTERNAL: filterByMemoryState
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:135:export function filterByMemoryState(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:141:  const minPriority = STATE_PRIORITY[normalizedMinState ?? ''] ?? UNKNOWN_STATE_PRIORITY;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:154:    const priority = STATE_PRIORITY[state] ?? UNKNOWN_STATE_PRIORITY;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:250:  const filterResult = filterByMemoryState(
context compacted
codex
I’ve finished the path sweep and most of categories 12 and 13, and I’m using the rest of this pass to tighten the remaining `14--pipeline-architecture` audits against the actual pipeline code. Next I’m reading each unfinished feature file side by side with its first implementation files so the final report stays specific instead of generic.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "''^#|''^Current Reality|''^## Current Reality|''^### Current Reality|''^'"\\| Implementation|"'^'"\\| Test|Source Files|No dedicated source files\" .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/*.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/08-performance-improvements.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/18-atomic-write-then-index-api.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md
 succeeded in 52ms:
Total output lines: 125

.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:1:# Pipeline and mutation hardening
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:3:## Current Reality
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:18:## Source Files
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:20:### Implementation
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:27:### Tests
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:35:## Source Metadata
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:1:# DB_PATH extraction and import standardization
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:3:## Current Reality
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:7:## Source Files
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:9:### Implementation
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:21:### Tests
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:38:## Source Metadata
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:1:# Activation window persistence
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:3:## Current Reality
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:7:## Source Files
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:9:### Implementation
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:16:### Tests
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md:24:## Source Metadata
codex
The remaining work is mostly category 14 now. I’m extracting each feature’s `Current Reality` text and its declared source tables so I can check the description against the exact implementation entry points, not just grep for a keyword and call it done.
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; import re; base=Path('.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture');
for p in sorted(base.glob('*.md')):
 txt=p.read_text(); m=re.search(r'## Current Reality\\n\\n(.*?)(?:\\n## Source Files|\\Z)', txt, re.S); reality=(m.group(1).strip() if m else '').replace('\\n',' '); impl=[]; test=[]; section=None;
 for line in txt.splitlines():
  s=line.strip();
  section='impl' if s=='### Implementation' else ('test' if s=='### Tests' else section);
  section=None if (line.startswith('## ') and 'Source Files' not in line and s not in ('### Implementation','### Tests')) else section;
  
  if line.startswith('| "'`'"'):
   parts=[x.strip() for x in line.strip('|').split('|')]; path=parts[0].strip('"'` '"');
   impl.append(path) if section=='impl' else (test.append(path) if section=='test' else None)
 print('===', p.name); print('REALITY:', reality); print('IMPL:', impl[:8], '... total', len(impl)); print('TEST:', test[:8], '... total', len(test)); print()\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 750ms:
  File "<string>", line 9
    if line.startswith('|  ');
                             ^
SyntaxError: invalid syntax
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; base=Path(\".opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture\");
for p in sorted(base.glob(\"*.md\")):
 txt=p.read_text(); m=re.search(r\"## Current Reality\\n\\n(.*?)(?:\\n## Source Files|\\Z)\", txt, re.S); reality=(m.group(1).strip() if m else \"\").replace(\"\\n\",\" \"); impl=[]; test=[]; section=None
 for line in txt.splitlines():
  s=line.strip()
  if s==\"### Implementation\": section=\"impl\"; continue
  if s==\"### Tests\": section=\"test\"; continue
  if line.startswith(\"## \") and \"Source Files\" not in line: section=None
  if line.startswith(\"| "'`"):
   parts=[x.strip() for x in line.strip("|").split("|")]
   path=parts[0].strip("` ")
   if section=="impl": impl.append(path)
   elif section=="test": test.append(path)
 print("===", p.name); print("REALITY:", reality); print("IMPL:", impl[:8], "... total", len(impl)); print("TEST:", test[:8], "... total", len(test)); print()'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.06s:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-0a86CkDM' (errno=Operation not permitted)
=== 01-4-stage-pipeline-refactor.md
REALITY: The retrieval pipeline was restructured into four bounded stages with clear responsibilities, a single authoritative scoring point and a strict score-immutability invariant in the final stage.  Stage 1 (Candidate Generation) executes search channels based on query type: multi-concept, deep mode with query expansion, embedding expansion with R15 mutual exclusion, or standard hybrid search. The R8 memory summary channel runs in parallel when the scale gate is met (>5K memories), merging and deduplicating results by memory ID. Summary candidates now pass through the same `minQualityScore` filter as other candidates (Sprint 8 fix). Constitutional memory injection and quality/tier filtering run at the end of Stage 1.  **Phase 017 update:** The query embedding is now cached at function scope for reuse in the constitutional injection path, saving one API call per search. The constitutional injection count is tracked and passed through the orchestrator to Stage 4 output metadata (previously hardcoded to 0).  Stage 2 (Fusion and Signal Integration) applies scoring/enrichment in a fixed order: session boost, causal boost, co-activation spreading, community co-retrieval (N2c from precomputed `community_assignments`), graph signals (N2a+N2b — additive momentum/depth bonuses), FSRS testing effect (when `trackAccess=true`), intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals (learned trigger boosts and negative feedback demotions), artifact result limiting, anchor metadata annotation (S2) and validation metadata enrichment with a bounded multiplier clamped to 0.8-1.2 (S3). Community injection (N2c) runs before graph signals (N2a+N2b) so injected rows also receive momentum/depth adjustments. The G2 prevention is structural: an `isHybrid` boolean gates the intent weight step so the code path is absent for hybrid search.  **Phase 017 update:** Stage 2 now uses the shared `resolveEffectiveScore()` function from `pipeline/types.ts` (aliased as `resolveBaseScore`) for consistent score resolution. The five-factor composite weights auto-normalize to sum 1.0 after partial overrides. Cross-variant RRF fusion no longer double-counts convergence bonuses (per-variant bonus subtracted before cross-variant bonus). Adaptive fusion core weights (semantic + keyword + recency) normalize after doc-type adjustments.  Stage 3 (Rerank and Aggregate) handles optional cross-encoder reranking (gated by `SPECKIT_CROSS_ENCODER`) and MPAB chunk collapse with parent reassembly preserving document order.  Stage 4 (Filter and Annotate) enforces the "no score changes" invariant via dual enforcement: compile-time `Stage4ReadonlyRow` readonly fields plus runtime `verifyScoreInvariant()` assertion checking all six score fields. Within this invariant, it applies memory state filtering, TRM evidence gap detection and annotation metadata.  **Phase 017 update:** The legacy `postSearchPipeline` path  was removed entirely. `isPipelineV2Enabled()` now always returns `true` regardless of the `SPECKIT_PIPELINE_V2` env var (deprecated). The V2 4-stage pipeline is the only code path. A shared `resolveEffectiveScore()` function in `pipeline/types.ts` replaced both Stage 2's `resolveBaseScore()` and Stage 3's local `effectiveScore()`, ensuring a consistent fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1]) across all stages.
IMPL: ['mcp_server/configs/cognitive.ts', 'mcp_server/core/config.ts', 'mcp_server/lib/cache/embedding-cache.ts', 'mcp_server/lib/cognitive/co-activation.ts', 'mcp_server/lib/cognitive/fsrs-scheduler.ts', 'mcp_server/lib/cognitive/rollout-policy.ts', 'mcp_server/lib/errors/core.ts', 'mcp_server/lib/errors/recovery-hints.ts'] ... total 90
TEST: ['mcp_server/tests/adaptive-fusion.vitest.ts', 'mcp_server/tests/anchor-metadata.vitest.ts', 'mcp_server/tests/batch-processor.vitest.ts', 'mcp_server/tests/bm25-index.vitest.ts', 'mcp_server/tests/causal-boost.vitest.ts', 'mcp_server/tests/channel-enforcement.vitest.ts', 'mcp_server/tests/channel-representation.vitest.ts', 'mcp_server/tests/channel.vitest.ts'] ... total 85

=== 02-mpab-chunk-to-memory-aggregation.md
REALITY: When a memory file splits into chunks, each chunk gets its own score. Multi-Parent Aggregated Bonus combines those chunk scores into a single memory-level score using the formula `sMax + 0.3 * sum(remaining) / sqrt(N)`. The top chunk score becomes the base, and the remaining chunks contribute a damped bonus.  Guards handle the edge cases: N=0 returns 0, N=1 returns the raw score and N>1 applies MPAB. The bonus coefficient (0.3) is exported as `MPAB_BONUS_COEFFICIENT` for tuning. The aggregation runs in Stage 3 of the 4-stage pipeline after RRF fusion and before state filtering. Runs behind the `SPECKIT_DOCSCORE_AGGREGATION` flag (default ON).
IMPL: ['mcp_server/lib/scoring/mpab-aggregation.ts'] ... total 1
TEST: ['mcp_server/tests/mpab-aggregation.vitest.ts'] ... total 1

=== 03-chunk-ordering-preservation.md
REALITY: When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order. Full parent content is loaded from the database when possible. On DB failure, the best-scoring chunk is emitted as a fallback with `contentSource: 'file_read_fallback'` metadata.
IMPL: ['mcp_server/lib/cognitive/rollout-policy.ts', 'mcp_server/lib/search/evidence-gap-detector.ts', 'mcp_server/lib/search/pipeline/stage4-filter.ts', 'mcp_server/lib/search/pipeline/types.ts', 'mcp_server/lib/search/search-flags.ts', 'shared/contracts/retrieval-trace.ts'] ... total 6
TEST: ['mcp_server/tests/evidence-gap-detector.vitest.ts', 'mcp_server/tests/hybrid-search-flags.vitest.ts', 'mcp_server/tests/memory-types.vitest.ts', 'mcp_server/tests/retrieval-trace.vitest.ts', 'mcp_server/tests/rollout-policy.vitest.ts', 'mcp_server/tests/search-flags.vitest.ts', 'mcp_server/tests/unit-composite-scoring-types.vitest.ts', 'mcp_server/tests/unit-folder-scoring-types.vitest.ts'] ... total 10

=== 04-template-anchor-optimization.md
REALITY: Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.  This is a pure annotation step wired into Stage 2 as step 8. It never modifies any score fields. The enrichment makes Stage 3 (rerank) and Stage 4 (filter) anchor-aware without score side-effects. No feature flag; always active.
IMPL: ['mcp_server/lib/search/anchor-metadata.ts', 'mcp_server/lib/search/pipeline/types.ts', 'shared/contracts/retrieval-trace.ts'] ... total 3
codex
I’ve got the feature texts parsed now. The remaining gap is evidence gathering for the few category 14 files I hadn’t fully opened yet, so I’m pulling the relevant function definitions and call sites in batches.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
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
// ---------------------------------------------------------------
// MODULE: Anchor Metadata
// ---------------------------------------------------------------
// Sprint 5 Phase B — S2 template anchor optimization
//
// PURPOSE: Parse ANCHOR tags from memory content and attach the
// resulting metadata to search pipeline rows. This is a PURE
// ANNOTATION step — no scores are modified.
//
// ANCHOR FORMAT:
//   <!-- ANCHOR:id --> ... content ... <!-- /ANCHOR:id -->
//
// ANCHOR ID CONVENTION (for type extraction):
//   Structured IDs follow the pattern: TYPE-keywords-NNN
//   e.g.  DECISION-pipeline-003  → type = "DECISION"
//         state                  → type = "state"
//         summary                → type = "summary"
//
// Integration point: called at the end of Stage 2 fusion, after
// all scoring signals have been applied (signals 1-7). Adding
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Validation Metadata
// ---------------------------------------------------------------
// AI-GUARD: 
// PURPOSE: Extract validation signals from spec document metadata
// and surface them as retrieval metadata on PipelineRow results.
// This allows the scoring layer to incorporate spec quality information.
//
// SIGNAL SOURCES (in extraction order):
//   1. importance_tier  → qualitative quality signal (tier → numeric score)
//   2. quality_score    → direct numeric quality metric from DB column
//   3. content          → SPECKIT_LEVEL marker extraction
//   4. content          → validation completion markers
//
// AI-INVARIANT: This module is metadata-only. It NEVER modifies score
// fields (score, rrfScore, similarity, intentAdjustedScore). It only
// adds the `validationMetadata` key to enriched rows.

import type { PipelineRow } from './pipeline/types';

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Learned Feedback
// ---------------------------------------------------------------
//
//
// Learns from user memory selections to improve future search results.
// Writes to a SEPARATE `learned_triggers` column (NOT FTS5 index).
//
// 10 Safeguards:
// 1. Separate column -- `learned_triggers` TEXT column, NOT in FTS5 index
// 2. 30-day TTL -- learned terms expire after 30 days
// 3. 100+ stop words denylist -- prevent noise injection
// 4. Rate cap -- max 3 terms per selection, max 8 terms per memory
// 5. Top-3 exclusion -- only learn from selections NOT already in top 3
// 6. 1-week shadow period -- log but don't apply for first week
// 7. Exclude <72h memories -- too new to learn from
// 8. Sprint gate review -- manual review before enabling
// 9. Rollback mechanism -- can clear all learned triggers
// 10. Provenance/audit log -- track what was learned and why
//
exec
/bin/zsh -lc "sed -n '1,360p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/paths.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Save Quality Gate
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// TM-04: Pre-Storage Quality Gate
//
// 3-layer validation before storing memories:
// - Layer 1: Structural validation (existing checks, formalized)
// - Layer 2: Content quality scoring (title, triggers, length,
//            anchors, metadata, signal density)
// - Layer 3: Semantic dedup (cosine similarity against existing)
//
// Behind SPECKIT_SAVE_QUALITY_GATE flag (default OFF)
//
// MR12 mitigation: warn-only mode for first 2 weeks after
// activation. When in warn-only mode, log quality scores and
// would-reject decisions but do NOT block saves.
//
// P1-015: Activation timestamp is persisted to SQLite config
// table so the 14-day graduation countdown survives server
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Paths
// ---------------------------------------------------------------

import path from 'path';

import { getDbDir } from './config';

const DEFAULT_DB_PATH = path.join(__dirname, '../../mcp_server/database/context-index.sqlite');

/** Defines database path. */
export const DB_PATH: string = (() => {
  const dir = getDbDir();
  return dir ? path.resolve(process.cwd(), dir, 'context-index.sqlite') : DEFAULT_DB_PATH;
})();
 succeeded in 51ms:
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
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "cleanup-orphaned-vectors|getDbDir|@spec-kit/" .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Tool Input Schemas
// ---------------------------------------------------------------
// Centralized strict Zod validation schemas for MCP tool inputs.
// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
// ---------------------------------------------------------------

import { z, ZodError, type ZodType } from 'zod';

type ToolInput = Record<string, unknown>;
type ToolInputSchema = ZodType<ToolInput>;

export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
  const strict = process.env.SPECKIT_STRICT_SCHEMAS !== 'false';
  const base = z.object(shape);
  return strict ? base.strict() : base.passthrough();
};

// Sprint 9 fix: safeNumericPreprocess.pipe(z.number()) silently coerces "", null, false → 0.
// Use a safe preprocessor that only accepts actual numbers or numeric strings.
 succeeded in 51ms:
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
.opencode/skill/system-spec-kit/shared/config.ts:9:export function getDbDir(): string | undefined {
.opencode/skill/system-spec-kit/shared/config.ts:42:  const configuredDir = getDbDir();
.opencode/skill/system-spec-kit/shared/README.md:114:- **Import convention**: Consumers should import via `@spec-kit/shared/*` path alias
.opencode/skill/system-spec-kit/shared/README.md:128:import { generateEmbedding } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:129:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:132:import { generateEmbedding } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:133:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:152:import { generateDocumentEmbedding, getProviderMetadata } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:181:├── package.json                # @spec-kit/shared package manifest
.opencode/skill/system-spec-kit/shared/README.md:267:- `scripts/lib/embeddings.ts` → `export * from '@spec-kit/shared/embeddings'`
.opencode/skill/system-spec-kit/shared/README.md:268:- `mcp_server/lib/providers/embeddings.ts` → `export * from '@spec-kit/shared/embeddings'`
.opencode/skill/system-spec-kit/shared/README.md:361:import { generateDocumentEmbedding, getEmbeddingDimension } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:362:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:381:import { generateQueryEmbedding, preWarmModel } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:382:import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/README.md:399:import { getProviderMetadata, getEmbeddingProfile } from '@spec-kit/shared/embeddings';
.opencode/skill/system-spec-kit/shared/README.md:417:import { extractTriggerPhrasesWithStats } from '@spec-kit/shared/trigger-extractor';
.opencode/skill/system-spec-kit/shared/index.ts:160:export { getDbDir, DB_UPDATED_FILE } from './config';
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:99:- `Cannot find module '@spec-kit/shared/...'`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:172:- Workspace dependencies including `@spec-kit/shared`
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/cli.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"setInstructions|memory_stats|dynamic.*instruction|SPECKIT_DYNAMIC_INIT\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/core/index.ts .opencode/skill/system-spec-kit/mcp_server/handlers -g '"'!**/*.md'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "getTokenBudget|getRecommendedLayers|getLayerInfo|getLayerPrefix|enhanceDescription|LAYER_DEFINITIONS|TOOL_LAYER_MAP" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:218:  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:235:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:253:const serverWithInstructions = server as unknown as { setInstructions?: (instructions: string) => void };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:  if (process.env.SPECKIT_DYNAMIC_INIT !== 'false') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:989:        serverWithInstructions.setInstructions?.(dynamicInstructions);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:35:/** Arguments for the memory_stats handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:30:const handle_memory_stats = handleMemoryStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:39:  handle_memory_stats,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:26:/** Handle memory_stats tool -- returns memory system statistics and folder rankings. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:34:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:93:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:222:      tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:240:    tool: 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:69:  handle_memory_stats,
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:56:import { getTokenBudget } from './lib/architecture/layer-definitions';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:349:          const budget = getTokenBudget(name);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1548:function getTokenBudget(): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1588:  const effectiveBudget = (budget && budget > 0) ? budget : getTokenBudget();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1681:  getTokenBudget,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:460:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:598:        alternativeLayers: layerDefs.getRecommendedLayers('search')
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:41: * Defines the LAYER_DEFINITIONS constant.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:43:export const LAYER_DEFINITIONS: Record<LayerId, LayerDefinition> = {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:125: * Defines the TOOL_LAYER_MAP constant.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:127:export const TOOL_LAYER_MAP: Record<string, LayerId> = {} as Record<string, LayerId>;
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:128:for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:130:    (TOOL_LAYER_MAP as Record<string, string>)[tool] = layerId;
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:145:export function getLayerPrefix(toolName: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:146:  const layerId = TOOL_LAYER_MAP[toolName];
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:149:  const layer = LAYER_DEFINITIONS[layerId];
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:157:export function enhanceDescription(toolName: string, description: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:158:  const prefix = getLayerPrefix(toolName);
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:173:export function getTokenBudget(toolName: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:174:  const layerId = TOOL_LAYER_MAP[toolName];
exec
/bin/zsh -lc "sed -n '960,1005p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '200,280p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '330,360p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
      ? data.totalSpecFolders
      : topFolders.length;

    return {
      totalMemories: typeof data.totalMemories === 'number' ? data.totalMemories : 0,
      specFolderCount: totalSpecFolders,
      activeCount: success,
      staleCount: pending + failed + retry,
    };
  } catch (_error: unknown) {
    return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
  }
}

// AI-WHY(CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
// This is by design — instruction updates require MCP protocol re-negotiation which most clients
// don't support. If index changes significantly, restart the server to refresh instructions.
async function buildServerInstructions(): Promise<string> {
  if (process.env.SPECKIT_DYNAMIC_INIT === 'false') {
    return '';
 succeeded in 52ms:
          fileWatcher = startFileWatcher({
            paths: watchPaths,
            reindexFn: async (filePath: string) => {
              await indexMemoryFile(filePath, { asyncEmbedding: true });
            },
            removeFn: async (filePath: string) => {
              await removeIndexedMemoriesForFile(filePath);
            },
          });
          console.error(`[context-server] File watcher started for ${watchPaths.length} path(s)`);
        } else {
          console.warn('[context-server] File watcher enabled, but no spec directories were found');
        }
      } catch (watchErr: unknown) {
        const message = watchErr instanceof Error ? watchErr.message : String(watchErr);
        console.warn('[context-server] File watcher startup failed:', message);
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Vector Store
// ---------------------------------------------------------------
// INTERFACE: IVectorStore (abstract base class)
// ---------------------------------------------------------------
// Concrete base class providing the IVectorStore contract for JS consumers.
// TypeScript consumers use the interface in @spec-kit/shared/types.ts;
// this file exists for plain-JS files (e.g., vector-index-impl.js)
// that need a real class to extend at runtime.
// ---------------------------------------------------------------
/**
 * Abstract base class for vector store implementations.
 * All methods throw by default — subclasses must override them.
 */
class IVectorStore {
  async search(_embedding: unknown, _topK: number, _options?: unknown): Promise<unknown[]> {
    throw new Error('Method search() must be implemented by subclass');
  }

  async upsert(_id: string, _embedding: unknown, _metadata: Record<string, unknown>): Promise<number> {
 succeeded in 51ms:
      appendAutoSurfaceHints(result, autoSurfacedContext);
      result.autoSurfacedContext = autoSurfacedContext;
    }

    // Token Budget Hybrid: Inject tokenBudget into response metadata (CHK-072)
    // T205: Enforce per-layer token budgets with actual truncation
    if (result && result.content && result.content[0]?.text) {
      try {
        const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
        if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
          const metaValue = envelope.meta;
          const meta = (metaValue && typeof metaValue === 'object' && !Array.isArray(metaValue))
            ? metaValue as Record<string, unknown>
            : {};
          const dataValue = envelope.data;
          const data = (dataValue && typeof dataValue === 'object' && !Array.isArray(dataValue))
            ? dataValue as Record<string, unknown>
            : null;
          envelope.meta = meta;
          const budget = getTokenBudget(name);
exec
/bin/zsh -lc "sed -n '1,360p' .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,380p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Db State
// ---------------------------------------------------------------

import fs from 'fs/promises';
import { DB_UPDATED_FILE } from './config';
import type { DatabaseExtended } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Minimal vector index interface for database operations */
export interface VectorIndexLike {
  initializeDb(): void;
  getDb(): DatabaseLike | null;
  closeDb?(): void;
  vectorSearch?: unknown;
}

 succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Retry Manager
// ---------------------------------------------------------------

// Node stdlib
import * as fsPromises from 'fs/promises';

// Internal modules
import * as vectorIndex from '../search/vector-index';
import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache';
import { normalizeContentForEmbedding } from '../parsing/content-normalizer';
import { generateDocumentEmbedding, getModelName } from './embeddings';

// Type imports
import type { MemoryDbRow } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Index Refresh
// ---------------------------------------------------------------
// Manages embedding index freshness on the memory_index table
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

const RETRY_THRESHOLD = 3;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

/**
 succeeded in 51ms:

    return { success: false, filePath, error: msg };
  }
}

/* -------------------------------------------------------------
   7. RECOVERY
----------------------------------------------------------------*/

/**
 * Find pending files in a directory (crash recovery).
 */
function listFilesRecursive(dirPath: string): string[] {
  const files: string[] = [];
  const stack: string[] = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

exec
/bin/zsh -lc "sed -n '150,255p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[transaction-manager] atomicWriteFile error: ${msg}`);
    metrics.totalErrors++;

    // Clean up temp file
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch { /* ignore cleanup errors */ }

    return false;
  }
}

/**
 * Delete a file if it exists.
 */
function deleteFileIfExists(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "enrichResultsWithAnchorMetadata|extractValidationMetadata|enrichResultsWithValidationMetadata|resolveEffectiveScore|constitutionalInjectedCount|queryEmbedding|embeddingCache|minQualityScore|sanitizeQueryTokens|QUALITY_FLOOR" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:173:export function extractValidationMetadata(
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:252: * For each row, `extractValidationMetadata` is called. When a non-null
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:261:export function enrichResultsWithValidationMetadata(
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:267:    const metadata = extractValidationMetadata(row);
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:7: * AI-WHY: QUALITY_FLOOR changed from 0.2 to 0.005 (Sprint 10, D3). The original 0.2
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:12:export const QUALITY_FLOOR = 0.005;
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:82: *  - Promotion only occurs for results with score >= QUALITY_FLOOR (0.005).
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:159:      if (r.score < QUALITY_FLOOR) continue;
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:71: *  - Only results with score >= QUALITY_FLOOR (0.005) are eligible for
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:8:import { sanitizeQueryTokens } from './bm25-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:70:  const tokens = sanitizeQueryTokens(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:118:**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:280:| `channel-representation.ts`| -      | TypeScript | Ensures minimum channel representation in top-k results (QUALITY_FLOOR=0.005) (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:567:| `querySummaryEmbeddings` | `(db, queryEmbedding, limit?) => SummarySearchResult[]` | Search summaries by embedding similarity |
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:165:export function enrichResultsWithAnchorMetadata(results: PipelineRow[]): PipelineRow[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:311:function sanitizeQueryTokens(query: string): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:336: * Delegates to `sanitizeQueryTokens` for tokenization, then wraps
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:340:  return sanitizeQueryTokens(query)
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:357:  sanitizeQueryTokens,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:156: * @param queryEmbedding - Query vector to compare against stored summaries
 succeeded in 51ms:
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
exec
/bin/zsh -lc "sed -n '260,380p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
/bin/zsh -lc "sed -n '380,620p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
          console.warn(
            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
          );

          // AI-WHY: Fallback: pure vector search
          channelCount = 1;
          candidates = vectorIndex.vectorSearch(effectiveEmbedding, {
            limit,
            specFolder,
            tier,
            contextType,
            includeConstitutional: false, // Constitutional managed separately below
            includeArchived,
          }) as PipelineRow[];

          if (trace) {
            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
              reason: hybridMsg,
              channel: 'vector',
            });
exec
/bin/zsh -lc 'rg -n "isInShadowPeriod|queryLearnedTriggers|clearAllLearnedTriggers|LEARNED_TRIGGER_WEIGHT|SPECKIT_LEARN_FROM_SELECTION|72|top-3|shadow" .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
15:// 6. 1-week shadow period -- log but don't apply for first week
16:// 7. Exclude <72h memories -- too new to learn from
22:// Feature flag: SPECKIT_LEARN_FROM_SELECTION (default ON — graduated)
55:  shadowMode: boolean;
70:export const FEATURE_FLAG = 'SPECKIT_LEARN_FROM_SELECTION';
73:export const LEARNED_TRIGGER_WEIGHT = 0.7;
87:/** Minimum memory age in milliseconds: 72 hours (Safeguard #7) */
88:export const MIN_MEMORY_AGE_MS = 72 * 60 * 60 * 1000;
108:    shadow_mode INTEGER NOT NULL DEFAULT 0
128: * Avoids full-table scan in queryLearnedTriggers / expireLearnedTerms / clearAll.
161: * Default: TRUE (graduated). Set SPECKIT_LEARN_FROM_SELECTION=false to disable.
163: * @returns true if SPECKIT_LEARN_FROM_SELECTION is not explicitly disabled
171: * Memories younger than 72 hours are excluded because they haven't
175: * @returns true if the memory is old enough (>72h) to learn from
238: * 2. Checks if the result was NOT in the top-3 (Safeguard #5)
241: * 5. Applies or logs depending on shadow period (Safeguard #6)
264:    // AI-WHY: Safeguard #5: Only learn from selections NOT in top-3
304:    const shadowMode = isInShadowPeriod(db);
311:      'INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
312:    ).run(memoryId, 'add', JSON.stringify(terms), queryId, now, shadowMode ? 1 : 0);
exec
/bin/zsh -lc "sed -n '392,492p' .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

/** Shadow period duration: 7 days in milliseconds (Safeguard #6). */
const SHADOW_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if the system is still within the 1-week shadow period (Safeguard #6).
 * Computes the earliest audit timestamp; if the system is less than 7 days old,
 * learned feedback should be logged but not applied.
 *
 * @param db - SQLite database connection
 * @returns true if still in shadow period (boosts should NOT be applied)
 */
function isInShadowPeriod(db: Database): boolean {
  try {
    ensureAuditTable(db);
    const row = db.prepare(
      'SELECT MIN(timestamp) AS earliest FROM learned_feedback_audit'
    ).get() as { earliest: number | null } | undefined;

    if (!row?.earliest) {
exec
/bin/zsh -lc "sed -n '430,620p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: normalizedInput,
      intent: explicit_intent ?? null,
      specFolder: spec_folder ?? null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch { /* eval logging must never break context handler */ }

  const requestedSessionId = typeof session_id === 'string' && session_id.trim().length > 0
    ? session_id.trim()
    : null;
  const effectiveSessionId = requestedSessionId ?? randomUUID();
  const resumedSession = requestedSessionId ? workingMemory.sessionExists(requestedSessionId) : false;
  const eventCounterStart = resumedSession && requestedSessionId
    ? workingMemory.getSessionEventCounter(requestedSessionId)
    : 0;
exec
/bin/zsh -lc 'rg -n "function getMemoryStats|async function getMemoryStats|const getMemoryStats" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:179:async function getMemoryStats(): Promise<DynamicMemoryStats> {
exec
/bin/zsh -lc "sed -n '168,220p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

  queueMicrotask(() => {
    for (const callback of afterToolCallbacks) {
      void callback(tool, callId, result).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[context-server] afterTool callback failed for '${tool}' (${callId}): ${message}`);
      });
    }
  });
}

async function getMemoryStats(): Promise<DynamicMemoryStats> {
  try {
    const response = await handleMemoryStats({
      folderRanking: 'count',
      includeArchived: true,
      limit: 100,
    });
    const payload = response?.content?.[0]?.text;
    if (typeof payload !== 'string' || payload.length === 0) {
exec
/bin/zsh -lc "sed -n '260,420p' .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "export const .*Schema|validateToolInput|schemaMap|memory_context|checkpoint_|task_|eval_|memory_ingest_" .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
13:export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
322:export const TOOL_SCHEMAS: Record<string, ToolInputSchema> = {
323:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
334:  checkpoint_create: checkpointCreateSchema as unknown as ToolInputSchema,
335:  checkpoint_list: checkpointListSchema as unknown as ToolInputSchema,
336:  checkpoint_restore: checkpointRestoreSchema as unknown as ToolInputSchema,
337:  checkpoint_delete: checkpointDeleteSchema as unknown as ToolInputSchema,
338:  task_preflight: taskPreflightSchema as unknown as ToolInputSchema,
339:  task_postflight: taskPostflightSchema as unknown as ToolInputSchema,
344:  eval_run_ablation: evalRunAblationSchema as unknown as ToolInputSchema,
345:  eval_reporting_dashboard: evalReportingDashboardSchema as unknown as ToolInputSchema,
348:  memory_ingest_start: memoryIngestStartSchema as unknown as ToolInputSchema,
349:  memory_ingest_status: memoryIngestStatusSchema as unknown as ToolInputSchema,
350:  memory_ingest_cancel: memoryIngestCancelSchema as unknown as ToolInputSchema,
354:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors'],
365:  checkpoint_create: ['name', 'specFolder', 'metadata'],
366:  checkpoint_list: ['specFolder', 'limit'],
367:  checkpoint_restore: ['name', 'clearExisting'],
368:  checkpoint_delete: ['name', 'confirmName'],
369:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
 succeeded in 52ms:
  includeMemoryDetails: z.boolean().optional(),
});

const memoryCausalLinkSchema = getSchema({
  sourceId: z.union([positiveInt, z.string().min(1)]),
  targetId: z.union([positiveInt, z.string().min(1)]),
  relation: relationEnum,
  strength: boundedNumber(0, 1).optional(),
  evidence: z.string().optional(),
});

const memoryCausalStatsSchema = getSchema({});

const memoryCausalUnlinkSchema = getSchema({
  edgeId: positiveInt,
});

const evalRunAblationSchema = getSchema({
  channels: z.array(z.enum(['vector', 'bm25', 'fts5', 'graph', 'trigger'])).optional(),
  groundTruthQueryIds: z.array(positiveInt).optional(),
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Tool Schemas
// ---------------------------------------------------------------
// All MCP tool definitions (names, descriptions, input schemas).
// Extracted from context-server.ts for maintainability (T303).
// ---------------------------------------------------------------

export {
  ToolSchemaValidationError,
  formatZodError,
  getToolSchema,
  validateToolArgs,
  getSchema,
} from './schemas/tool-input-schemas';

// --- 1. TYPES ---

/** Defines an MCP tool schema entry. */
export interface ToolDefinition {
  name: string;
exec
/bin/zsh -lc 'rg -n "IGraphStore|IDocumentStore|IVectorStore|vector store|document store|graph store" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/shared/index.ts:38:  IVectorStore,
.opencode/skill/system-spec-kit/shared/types.ts:12:// Import normalization types for local use (Memory used in IVectorStore.get)
.opencode/skill/system-spec-kit/shared/types.ts:182:/** Search options for vector store queries */
.opencode/skill/system-spec-kit/shared/types.ts:242:/** Interface for vector store implementations */
.opencode/skill/system-spec-kit/shared/types.ts:243:export interface IVectorStore {
.opencode/skill/system-spec-kit/mcp_server/database/README.md:34:- Embedding-profile database: `context-index__voyage__voyage-4__1024.sqlite` (and `-wal`, `-shm` sidecars) — profile-specific vector store.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:7:  - "vector store interface"
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:32:The interfaces module documents contracts for embedding providers and vector stores. Most interfaces now live in `@spec-kit/shared`; this local module remains the compatibility layer and local vector-store stub.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:80:| `IVectorStore` | `vector-store.ts` | Abstract base class for JS runtime consumers; subclasses must implement search/upsert/delete/get/stats/availability/dimension/close |
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:100:import { IVectorStore } from './vector-store';
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:102:class InMemoryVectorStore extends IVectorStore {
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:117:import { IVectorStore } from './vector-store';
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:119:const base = new IVectorStore();
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:140:| [../search/vector-index-impl.ts](../search/vector-index-impl.ts) | Main in-repo `IVectorStore` implementation |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:58: * Measure the edge density of the causal graph stored in `database`.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:4:// INTERFACE: IVectorStore (abstract base class)
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:6:// Concrete base class providing the IVectorStore contract for JS consumers.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:12: * Abstract base class for vector store implementations.
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:15:class IVectorStore {
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:49:export { IVectorStore };
exec
/bin/zsh -lc "sed -n '630,700p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '230,290p' .opencode/skill/system-spec-kit/shared/types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
export function get_db(): Database.Database {
  return initialize_db();
}

// Check if vector search is available (sqlite-vec loaded)
/**
 * Reports whether sqlite-vec vector search is available.
 * @returns True when vector search is available.
 */
export function is_vector_search_available(): boolean {
  return sqlite_vec_available_flag;
}

/* -------------------------------------------------------------
   8. IVECTORSTORE IMPLEMENTATION
----------------------------------------------------------------*/

/** Implements the vector-store interface on top of SQLite. */
export class SQLiteVectorStore extends IVectorStore {
  dbPath: string | null;
 succeeded in 51ms:
  isConstitutional?: boolean;
  /** Additional metadata for extensibility */
  metadata?: Record<string, unknown>;
}

/** Vector store statistics */
export interface StoreStats {
  totalMemories: number;
  totalEmbeddings: number;
  dimensions: number;
}

/** Interface for vector store implementations */
export interface IVectorStore {
  search(embedding: number[], options?: SearchOptions): Promise<SearchResult[]>;
  upsert(id: number | string, embedding: number[], metadata: Record<string, unknown>): Promise<void>;
  delete(id: number | string): Promise<boolean>;
  get(id: number | string): Promise<Memory | null>;
  getStats(): Promise<StoreStats>;
  isAvailable(): boolean;
 succeeded in 51ms:
// ---------------------------------------------------------------
// TESTS: Protocol Abstractions (T084, T085, T086)
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import { IVectorStore } from '../lib/interfaces/vector-store';
// Note: SQLiteVectorStore import deferred to Phase 2 (DB-dependent tests)
// because vector-index-impl.js has deep dependency chain (format-helpers, etc.)

// -------------------------------------------------------------
// Mock implementations (these classes were planned but never
// implemented in the codebase — we implement them here as
// test-local utilities)
// -------------------------------------------------------------

/**
 * In-memory mock of IVectorStore for testing interface compliance.
 */
class MockVectorStore extends IVectorStore {
  private records: Map<number, { id: string; embedding: Float32Array; metadata: Record<string, unknown> }> = new Map();
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"Math.max\\(|LIMIT|json_extract|Set\\(|getEdgeCount|UNION ALL|lastInsertRowid|WeakMap|TTL|reduce\\(|60-second|60 second|cache\" .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '140,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '150,210p' .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:160:function getEdgeCount(db: Database.Database, nodeId: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:248: * Uses UNION ALL to count both directions per node in one round-trip.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:256:  //   UNION ALL
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:263:      UNION ALL
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:316:  // As we insert new edges we increment the cached value so subsequent
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:359:        // Respect MAX_EDGES_PER_NODE — use cached counts (O(1) map lookup)
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:372:            // Keep cache consistent so later pairs in this run see accurate counts
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:537:  getEdgeCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:168:    const fetchCap = Math.max(limit * 10, 1000);
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:173:      LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:118:    const unique = new Set(tokens);
.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:151:  const maxScore = scored.reduce((max, s) => s.score > max ? s.score : max, -Infinity);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:160:  const id = (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:196:  // AI-WHY: String interpolation in LIMIT/OFFSET is safe here because both values
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:198:  // Math.floor guarantees no decimal component, Math.max(1,…)/Math.max(0,…)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:200:  const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:201:  const offset = opts.offset ? `OFFSET ${Math.max(0, Math.floor(opts.offset))}` : '';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:258:  return Math.max(1, Math.floor(maxRetries as number));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:286:  // Use COUNT(*) with json_extract to filter by path in SQL rather than scanning
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:293:      AND json_extract(decision_meta, '$.normalizedPath') = ?
 succeeded in 50ms:
 *    WHERE summary_embedding IS NOT NULL
 * 2. Compute cosine similarity between query embedding and each summary embedding
 * 3. Return top `limit` results sorted by similarity descending
 * 4. Convert BLOB back to Float32Array for comparison
 *
 * @param db - SQLite database instance
 * @param queryEmbedding - Query vector to compare against stored summaries
 * @param limit - Maximum number of results to return
 * @returns Array of summary search results sorted by similarity descending
 */
export function querySummaryEmbeddings(
  db: Database.Database,
  queryEmbedding: Float32Array | number[],
  limit: number
): SummarySearchResult[] {
  try {
    // AI-WHY: Cap rows fetched to avoid full-table scans on large databases.
    // AI-WHY: Over-fetch by a factor so that after cosine ranking we can still return `limit` results.
    const fetchCap = Math.max(limit * 10, 1000);
    const rows = db.prepare(`
 succeeded in 50ms:
      const tf = count / tokens.length;
      const df = docFreq.get(term) ?? 1;
      const idf = Math.log(totalSentences / df);
      score += tf * idf;
    }

    return { text, score, index };
  });

  // AI-WHY: Normalize scores to [0, 1]
  // Use reduce-based max to avoid RangeError when scored is large (spread exceeds call-stack limit)
  const maxScore = scored.reduce((max, s) => s.score > max ? s.score : max, -Infinity);
  if (maxScore > 0) {
    for (const s of scored) {
      s.score = s.score / maxScore;
    }
  }

  return scored;
}
exec
/bin/zsh -lc "sed -n '280,320p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,290p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '150,190p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "lastInsertRowid|INSERT OR IGNORE|ON CONFLICT|upsert" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
function getDivergenceReconcileAttemptCount(db: Database.Database, normalizedPath: string): number {
  const targetPath = normalizePath(normalizedPath);
  if (targetPath.length === 0) {
    return 0;
  }

  // Use COUNT(*) with json_extract to filter by path in SQL rather than scanning
  // all decision_meta rows in application code (O(1) vs O(n) full-table scan).
  const row = db.prepare(`
    SELECT COUNT(*) AS cnt
    FROM mutation_ledger
    WHERE mutation_type = 'reindex'
      AND reason = ?
      AND json_extract(decision_meta, '$.normalizedPath') = ?
  `).get(DIVERGENCE_RECONCILE_REASON, targetPath) as { cnt: number } | undefined;

  return row?.cnt ?? 0;
}

function hasDivergenceEscalationEntry(db: Database.Database, normalizedPath: string): boolean {
 succeeded in 50ms:
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
 succeeded in 51ms:
174:      // to write a weight_history row after the upsert. The subsequent INSERT
175:      // uses last_insert_rowid() to avoid a second post-upsert SELECT.
184:        ON CONFLICT(source_id, target_id, relation) DO UPDATE SET
196:        logWeightChange(rowId, existing.strength, clampedStrength, createdBy, 'insert-upsert');
275:      INSERT OR IGNORE INTO causal_edges (${edgeColumns.join(', ')})
 succeeded in 51ms:
  // AI-WHY: Fix #24 (017-refinement-phase-6) — Prevent self-loops
  if (sourceId === targetId) {
    return null;
  }

  // Fix #26 (FK check) deferred — test environments use synthetic IDs not in memory_index.
  // Implementing FK validation would require seeding memory_index in 20+ causal edge tests.

  // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
  if (createdBy === 'auto') {
    const edgeCount = countEdgesForNode(sourceId);
    if (edgeCount >= MAX_EDGES_PER_NODE) {
      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
      return null;
    }
  }

  try {
    const clampedStrength = Math.max(0, Math.min(1, effectiveStrength));

exec
/bin/zsh -lc "sed -n '190,215p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
      `) as Database.Statement).get(sourceId, targetId, relation) as { id: number } | undefined;
      const rowId = row ? row.id : 0;

      // T001d: Log weight change on conflict update
      if (existing && rowId && existing.strength !== clampedStrength) {
        logWeightChange(rowId, existing.strength, clampedStrength, createdBy, 'insert-upsert');
      }

      return rowId;
    })();

    if (shouldInvalidateCache) {
      invalidateDegreeCache();
    }

    return rowId || null;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] insertEdge error: ${msg}`);
codex
I’m in the last dense cluster now: the “architecture/hardening” features where the docs often summarize several patches at once. I’m checking each bullet against the exact call sites so I can separate “good summary, wrong source table” from “summary itself is stale.”
exec
/bin/zsh -lc "sed -n '90,150p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"sessionDeduped|constitutionalInjected|queryEmbedding|simpleStem|title \\+ '\\\\n\\\\n' \\+ content_text|degree_snapshots|community_assignments|memory_summaries|memory_entities|causal_edges|bm25Index|getIndex\\(\\)\\.removeDocument|dbCommitted|preflightResult.errors\\[0\\]\\.code|ANCHOR_FORMAT_INVALID\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "trackAccess|includeArchived|mode" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/lib/search/stemming.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
        (text: string) => embeddings.generateQueryEmbedding(text)
      );
      if (summaryResult.stored) {
        console.error(`[memory-summaries] Generated summary for memory #${id}`);
      }
    } catch (summaryErr: unknown) {
      const message = toErrorMessage(summaryErr);
      console.warn(`[memory-save] R8 summary generation failed: ${message}`);
    }
  }

  // -- S5: Cross-Document Entity Linking --
  // Runs after R10 entity storage; links entities across spec folders.
  if (isEntityLinkingEnabled() && isAutoEntitiesEnabled()) {
    try {
      const linkResult = runEntityLinking(database);
      if (linkResult.linksCreated > 0) {
        console.error(`[entity-linking] Created ${linkResult.linksCreated} cross-doc links from ${linkResult.crossDocMatches} entity matches`);
      } else if (linkResult.skippedByDensityGuard) {
        const density = typeof linkResult.edgeDensity === 'number'
 exited 2 in 51ms:
rg: the literal "\n" is not allowed in a regex

Consider enabling multiline mode with the --multiline flag (or -U for short).
When multiline mode is enabled, new line characters can be matched.
 exited 1 in 50ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/search/stemming.ts: No such file or directory
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:31:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, limit: { type: 'number', description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Caller-supplied session identifier. If omitted, server generates an ephemeral UUID for this call only (not persisted across requests).' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:138:      trackAccess: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:143:      includeArchived: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:148:      mode: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:152:        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:185:  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:186:  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', description: 'Maximum number of folders to return', default: 10 } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:200:        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:209:        description: 'Optional spec folder filter for divergent alias triage mode.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:214:        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:230:      id: { type: 'number', minimum: 1, description: 'Memory ID to delete (single delete mode)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:231:      specFolder: { type: 'string', minLength: 1, description: 'Delete all memories in this spec folder (bulk delete mode, requires confirm: true)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:256:      searchMode: { type: 'string', description: 'Optional search mode context (search/context/trigger)' },
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:5:// Strict mode is controlled by SPECKIT_STRICT_SCHEMAS (default: true).
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:76:  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:113:  trackAccess: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:114:  includeArchived: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:115:  mode: z.enum(['auto', 'deep']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:203:  includeArchived: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:354:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors'],
exec
/bin/zsh -lc "sed -n '160,235p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1030,1135p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "function simpleStem|const simpleStem|export function simpleStem" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"sessionDeduped|constitutionalInjected|simpleStem|title \\+|content_text|degree_snapshots|community_assignments|memory_summaries|memory_entities|causal_edges|removeDocument\\(|dbCommitted|preflightResult.errors\\[0\\]\\.code|ANCHOR_FORMAT_INVALID\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
sed: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-delete.ts: No such file or directory
 succeeded in 50ms:

 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:72:function simpleStem(word: string): string {
 succeeded in 50ms:
Total output lines: 644

.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:117: * Parent record: embedding_status='partial', content_text=summary
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:360:        bm25Index.getIndex().removeDocument(String(parentId));
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:410:            content_text = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:91:      // AI-WHY: Fix #19 (017-refinement-phase-6) — Embed title + content_text, not title alone.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:93:      const contentText = existing.content_text || '';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:143:      // AI-WHY: T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:148:            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:149:          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:153:            if (row.content_text) textParts.push(row.content_text);
.opencode/skill/system-spec-kit/mcp_server/README.md:712:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
.opencode/skill/system-spec-kit/mcp_server/README.md:813:| `causal_edges`       | Causal relationships (6 types)                                     |
.opencode/skill/system-spec-kit/mcp_server/README.md:866:When chunked files are indexed, `includeContent: true` now reassembles child chunks into full content from indexed `content_text` values. Each result can include:
.opencode/skill/system-spec-kit/mcp_server/README.md:1083:sqlite3 dist/database/context-index.sqlite "SELECT relation, COUNT(*) FROM causal_edges GROUP BY relation;"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:358:      // first validation error instead of hardcoding ANCHOR_FORMAT_INVALID.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:362:        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:442:      SELECT parent_id, chunk_index, chunk_label, content_text
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:      content_text: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:456:      content_text: string | null;
exec
/bin/zsh -lc "sed -n '80,120p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"degree_snapshots|community_assignments|memory_summaries|memory_entities|causal_edges|removeDocument\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts .opencode/skill/system-spec-kit/mcp_server/handlers" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '60,105p' .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '330,370p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;

  let embeddingRegenerated = false;
  let embeddingMarkedForReindex = false;
  let embeddingStatusNeedsPendingWrite = false;

  if (title !== undefined && title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id} [requestId=${requestId}]`);
    let newEmbedding: Float32Array | null = null;

    try {
      // AI-WHY: Fix #19 (017-refinement-phase-6) — Embed title + content_text, not title alone.
      // This produces better semantic embeddings that capture the full memory context.
      const contentText = existing.content_text || '';
      const embeddingInput = contentText ? `${title}\n\n${contentText}` : title;
      newEmbedding = await embeddings.generateDocumentEmbedding(embeddingInput);
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      if (allowPartialUpdate) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index [requestId=${requestId}]: ${message}`);
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:360:        bm25Index.getIndex().removeDocument(String(parentId));
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:31:  id: number;               // T202: causal_edges.id for unlink workflow
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:578:      const linkedRows = (db.prepare('SELECT DISTINCT source_id FROM causal_edges UNION SELECT DISTINCT target_id FROM causal_edges') as import('better-sqlite3').Statement).all() as Array<{ source_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:583:      // causal_edges table may not exist yet — coverage is 0
 succeeded in 51ms:
      return createMCPSuccessResponse({
        tool: 'memory_save',
        summary: dryRunSummary,
        data: {
          status: 'dry_run',
          would_pass: preflightResult.dry_run_would_pass,
          file_path: validatedPath,
          spec_folder: parsedForPreflight.specFolder,
          title: parsedForPreflight.title,
          validation: {
            errors: preflightResult.errors,
            warnings: preflightResult.warnings,
            details: preflightResult.details,
          },
          message: dryRunSummary,
        },
        hints: preflightResult.dry_run_would_pass
          ? ['Dry-run complete - no changes made']
          : ['Fix validation errors before saving', 'Use skipPreflight: true to bypass validation'],
      });
 succeeded in 51ms:
/* ---------------------------------------------------------------
   2. HELPERS
   --------------------------------------------------------------- */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
  'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
  'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
  'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
]);

function simpleStem(word: string): string {
  let stem = word.toLowerCase();
  let suffixRemoved = false;
  // Simple suffix removal
  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
exec
/bin/zsh -lc "rg -n \"DELETE FROM degree_snapshots|DELETE FROM community_assignments|DELETE FROM memory_summaries|DELETE FROM memory_entities|DELETE FROM causal_edges|removeDocument\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:360:        bm25Index.getIndex().removeDocument(String(parentId));
exec
/bin/zsh -lc 'rg -n "degree_snapshots|community_assignments|memory_summaries|memory_entities|causal_edges" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/*delete*.ts .opencode/skill/system-spec-kit/mcp_server/handlers/*.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:31:  id: number;               // T202: causal_edges.id for unlink workflow
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:578:      const linkedRows = (db.prepare('SELECT DISTINCT source_id FROM causal_edges UNION SELECT DISTINCT target_id FROM causal_edges') as import('better-sqlite3').Statement).all() as Array<{ source_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:583:      // causal_edges table may not exist yet — coverage is 0
exec
/bin/zsh -lc "rg -n \"memory_summaries|memory_entities|community_assignments|degree_snapshots|DELETE FROM memory_index|DELETE FROM vec_memories|DELETE FROM memory_fts|removeDocument\\(String\\(memoryId\\)|removeDocument\\(String\\(id\\)|removeDocument\\(\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:167:        database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(existing.id);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:168:        database.prepare(`DELETE FROM memory_index WHERE id = ?`).run(existing.id);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:345:          database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(parentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:346:          database.prepare(`DELETE FROM memory_index WHERE id = ?`).run(parentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:349:          database.prepare(`DELETE FROM memory_index WHERE id IN (${placeholders})`).run(...childIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:360:        bm25Index.getIndex().removeDocument(String(parentId));
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:392:      database.prepare(`DELETE FROM memory_index WHERE parent_id = ?`).run(parentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:443:          database.prepare(`DELETE FROM memory_index WHERE id IN (${placeholders})`).run(...childIds);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:44:  db.prepare('DELETE FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?').run(likePattern, likePattern);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:41:    CREATE TABLE memory_entities (
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:350:  it('stores entities in memory_entities table', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:358:    const rows = db.prepare('SELECT * FROM memory_entities WHERE memory_id = 1').all() as Array<{
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:392:    const rows = db.prepare('SELECT * FROM memory_entities WHERE memory_id = 1 AND entity_text = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:404:    const rows = db.prepare('SELECT * FROM memory_entities WHERE memory_id = 1').all();
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:419:    const count = db.prepare('SELECT COUNT(*) AS cnt FROM memory_entities WHERE memory_id = 1')
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:154:    testDb.exec('DELETE FROM memory_index');
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:155:    testDb.exec('DELETE FROM vec_memories');
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:126: * Store extracted entities in the memory_entities table.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:142:      INSERT OR REPLACE INTO memory_entities
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:227:        activeDb.prepare("DELETE FROM memory_index WHERE spec_folder = 'test/spec'").run();
exec
/bin/zsh -lc "sed -n '360,395p' .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
      } catch (e: unknown) {
        console.warn(`[vector-index] Vector deletion failed for memory ${id}: ${get_error_message(e)}`);
      }
    }

    // AI-WHY: Fix #20 (017-refinement-phase-6) — Clean all ancillary records
    const ancillaryTables = [
      'DELETE FROM degree_snapshots WHERE memory_id = ?',
      'DELETE FROM community_assignments WHERE memory_id = ?',
      'DELETE FROM memory_summaries WHERE memory_id = ?',
      'DELETE FROM memory_entities WHERE memory_id = ?',
    ];
    for (const sql of ancillaryTables) {
      try { database.prepare(sql).run(id); } catch (_error: unknown) { /* table may not exist */ }
    }
    try {
      database.prepare('DELETE FROM causal_edges WHERE source_id = ? OR target_id = ?').run(id, id);
    } catch (_error: unknown) { /* table may not exist */ }

    const result = database.prepare('DELETE FROM memory_index WHERE id = ?').run(id);
exec
/bin/zsh -lc "sed -n '300,360p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
  // -- Step 5: Verify score invariant (defence-in-depth) --
  //
  // verifyScoreInvariant checks every row that survived filtering.
  // Rows removed by filterByMemoryState are absent from workingResults,
  // so the function correctly skips them (see types.ts implementation).
  // Throws [Stage4Invariant] Error if any score field was mutated.
  verifyScoreInvariant(scoresBefore, workingResults);

  const durationMs = Date.now() - stageStart;

  // AI-WHY: -- Trace entry --
  if (config.trace) {
    addTraceEntry(
      config.trace,
      'filter',
      results.length,
      workingResults.length,
      durationMs,
      {
        stateFiltered,
exec
/bin/zsh -lc 'rg -n "Stage4ReadonlyRow|verifyScoreInvariant|captureScoreSnapshot|resolveEffectiveScore" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
57:export function resolveEffectiveScore(row: PipelineRow): number {
74:export interface Stage4ReadonlyRow extends Readonly<Pick<PipelineRow,
262: * Compile-time enforcement: input type uses Stage4ReadonlyRow with readonly score fields.
266:  results: Stage4ReadonlyRow[];
276:  final: Stage4ReadonlyRow[];
296:  results: Stage4ReadonlyRow[];
354:export function captureScoreSnapshot(results: Stage4ReadonlyRow[]): ScoreSnapshot[] {
370:export function verifyScoreInvariant(
372:  after: Stage4ReadonlyRow[]
exec
/bin/zsh -lc "rg -n \"stage1-candidate-gen|stage2-fusion|stage3-rerank|stage4-filter|pipeline/types|pipeline/orchestrator|hybrid-search|retry-manager\\.vitest|retry\\.vitest\" .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "save-quality-gate|retry-manager|layer-definitions|context-server|vector-store|db-state|transaction-manager|memory-save|tool-input-schemas|shared/config|shared/paths|cleanup-orphaned-vectors" .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/*.md .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/*.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:35:| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:106:| `mcp_server/tests/hybrid-search-context-headers.vitest.ts` | Context header injection |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:107:| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:108:| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:124:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:125:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:7:**D1 — Summary quality bypass:** `stage1-candidate-gen.ts` allowed R8 summary hits to bypass the `minQualityScore` filter, letting low-quality summaries enter final results. Summary candidates now pass through the same quality filter.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:50:| `mcp_server/lib/search/hybrid-search.ts` | Lib | Multi-channel search orchestration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:55:| `mcp_server/lib/search/pipeline/orchestrator.ts` | Lib | Pipeline orchestration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:56:| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Stage 1 candidate generation |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:57:| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 fusion |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:58:| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Lib | Stage 3 reranking |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:59:| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4 filtering |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:60:| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:148:| `mcp_server/tests/hybrid-search-context-headers.vitest.ts` | Context header injection |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:149:| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:150:| `mcp_server/tests/hybrid-search.vitest.ts` | Hybrid search orchestration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:170:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:171:| `mcp_server/tests/retry.vitest.ts` | Retry utility tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:180:| `mcp_server/tests/stage2-fusion.vitest.ts` | Stage 2 fusion validation |
 succeeded in 51ms:
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:37:| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:92:| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:104:| `shared/config.ts` | Shared | Shared configuration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:182:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:22:| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:55:| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:67:| `shared/config.ts` | Shared | Shared configuration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/10-legacy-v1-pipeline-removal.md:124:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:29:| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:83:| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:95:| `shared/config.ts` | Shared | Shared configuration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md:170:| `mcp_server/tests/retry-manager.vitest.ts` | Retry manager tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:25:| `mcp_server/lib/storage/transaction-manager.ts` | Lib | Transaction management |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:32:| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Transaction extended tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:33:| `mcp_server/tests/transaction-manager.vitest.ts` | Transaction manager tests |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:5:`shared/config.ts` gained an exported `getDbDir()` function reading `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` env vars. `shared/paths.ts` exports `DB_PATH` using this config. Scripts that hardcoded database paths (`cleanup-orphaned-vectors.ts`) now import from shared. Fourteen relative cross-boundary imports across scripts were converted to `@spec-kit/` workspace aliases.
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:15:| `mcp_server/core/db-state.ts` | Core | Database state management |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:16:| `shared/config.ts` | Shared | Shared configuration |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:18:| `shared/paths.ts` | Shared | Shared path utilities |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:27:| `mcp_server/tests/db-state-graph-reinit.vitest.ts` | DB state graph reinit |
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"preWarmModel|waitForEmbeddingModel|setEmbeddingModelReady|background retry|setImmediate\\(|startupScan|file watcher|retryManager\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "StdioServerTransport|StreamableHTTP|HTTP|daemon|warmup|preWarm|warm server|stdio|transport" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/cli.ts .opencode/skill/system-spec-kit/mcp_server/core/index.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Context Server
// ---------------------------------------------------------------
// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
// logic in tools/*.ts. This file retains server init, startup,
// shutdown, and main orchestration only.
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

/* ---------------------------------------------------------------
   1. MODULE IMPORTS
--------------------------------------------------------------- */

// MCP SDK
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/cli.ts:12://   node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force] [--eager-warmup]
.opencode/skill/system-spec-kit/mcp_server/cli.ts:58:  reindex [--force] [--eager-warmup]
.opencode/skill/system-spec-kit/mcp_server/cli.ts:73:  spec-kit-cli reindex --eager-warmup
.opencode/skill/system-spec-kit/mcp_server/cli.ts:352:  const eagerWarmup = getFlag('eager-warmup');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:364:  // Optional legacy warmup path.
.opencode/skill/system-spec-kit/mcp_server/cli.ts:369:      await embeddings.generateEmbedding('warmup');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:18:import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:541:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:542:let transport: StdioServerTransport | null = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:591:    // P1-09 FIX: Close MCP transport on shutdown
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:592:    runCleanupStep('transport', () => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:593:      if (transport) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:594:        transport.close();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:595:        transport = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:738:  // Default: Skip warmup at startup for <500ms cold start
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:739:  // Set SPECKIT_EAGER_WARMUP=true for legacy eager warmup behavior
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:745:    let warmupCompleted = false;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:747:    const warmupEmbedding = async (): Promise<boolean> => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:751:        await embeddings.generateEmbedding('warmup test');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:752:        warmupCompleted = true;
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:24:  setEmbeddingModelReady, waitForEmbeddingModel,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:83:import * as retryManager from './lib/providers/retry-manager';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:408:let startupScanInProgress = false;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:474:async function startupScan(basePath: string): Promise<void> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:475:  if (startupScanInProgress) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:480:  startupScanInProgress = true;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:483:    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:532:    startupScanInProgress = false;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:575:  runCleanupStep('retryManager', () => retryManager.stopBackgroundJob());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:753:        setEmbeddingModelReady(true);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:        setEmbeddingModelReady(false);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:          setEmbeddingModelReady(true);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:781:    setEmbeddingModelReady(true);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:901:      const retryJobResult = retryManager.startBackgroundJob({
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1002:  setImmediate(() => startupScan(DEFAULT_BASE_PATH));
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:105:// AI-WHY: T3-15 circuit breaker — prevents the background retry job from
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:467:  console.error(`[retry-manager] Starting background retry job (interval: ${config.intervalMs}ms, batch: ${config.batchSize})`);
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:230:export function setEmbeddingModelReady(ready: boolean): void {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:235:export async function waitForEmbeddingModel(timeoutMs: number = 30000): Promise<boolean> {
exec
/bin/zsh -lc "rg -n \"from ['\\\"](\\.\\./)+((mcp_server)|(shared))/\" .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:5:// AI-WHY: ARCH-1 consumer scripts import from '../../mcp_server/api'
.opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts:28:} from '../../mcp_server/api';
.opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts:27:} from '../../mcp_server/api';
exec
/bin/zsh -lc "sed -n '1,60p' .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts && sed -n '1,60p' .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
#!/usr/bin/env npx tsx
// ---------------------------------------------------------------
// MODULE: Run BM25 Baseline
// ---------------------------------------------------------------
//
// Sprint 0 closure: Execute the BM25-only baseline against the
// live production context-index.sqlite and record results in the
// eval DB. Produces the contingency decision (PAUSE/RATIONALIZE/
// PROCEED) with bootstrap 95% CI for statistical significance.
//
// Usage:
//   npx tsx scripts/evals/run-bm25-baseline.ts [--skip-hard-negatives] [--verbose]
//
// Output:
//   - Prints metrics, contingency decision, and bootstrap CI
//   - Records results to speckit-eval.db (eval_metric_snapshots)
//   - Writes full result JSON to /tmp/bm25-baseline-result.json

import Database from 'better-sqlite3';
import * as path from 'path';
exec
/bin/zsh -lc "rg -n \"mark.*pending|embedding_status = 'pending'|asyncEmbedding|retryManager|startBackgroundJob|processBatch|getRetryStats|ensureIndexFresh|memory_index_scan|reindex-embeddings|pending'\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts .opencode/skill/system-spec-kit/scripts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:124:    const embedding_status = sqlite_vec ? 'success' : 'pending';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:197:          embedding_status = 'pending',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:218:    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, ?, ?, ?, ?, ?, ?)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:487:// Valid statuses: 'pending', 'success', 'failed', 'retry', 'partial'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:495:  const valid_statuses = ['pending', 'success', 'failed', 'retry', 'partial'];
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:154:    WHERE embedding_status IN ('pending', 'retry')
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:157:      CASE WHEN embedding_status = 'pending' THEN 0 ELSE 1 END,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:176:  if (row.embedding_status === 'pending') return true;
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:208:function getRetryStats(): RetryStats {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:217:      SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:454:function startBackgroundJob(options: Partial<BackgroundJobConfig> = {}): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:507:    const stats = getRetryStats();
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:561:  getRetryStats,
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:566:  startBackgroundJob,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:91:      case 'pending': stats.pending = count; break;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:112:    WHERE embedding_status IN ('pending', 'retry', 'partial')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:134:        WHEN 'pending' THEN 2
.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:196:export function ensureIndexFresh(): UnindexedDocument[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:235:  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
.opencode/skill/system-spec-kit/scripts/README.md:49:- `memory/` - 7 TypeScript CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`)
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/04-template-anchor-optimization.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/06-learned-relevance-feedback.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Chunk ordering preservation

## Current Reality

When multi-chunk results collapse back into a single memory during MPAB aggregation, chunks are now sorted by their original `chunk_index` so the consuming agent reads content in document order rather than score order. Full parent content is loaded from the database when possible. On DB failure, the best-scoring chunk is emitted as a fallback with `contentSource: 'file_read_fallback'` metadata.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/evidence-gap-detector.ts` | Lib | Evidence gap detection |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | Lib | Stage 4 filtering |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests
 succeeded in 51ms:
# Template anchor optimization

## Current Reality

Anchor markers in memory files (structured sections like `<!-- ANCHOR:state -->`) are parsed and attached as metadata to search pipeline rows. The module extracts anchor IDs and derives semantic types from structured IDs (for example, `DECISION-pipeline-003` yields type `DECISION`). Simple IDs like `summary` pass through as-is.

This is a pure annotation step wired into Stage 2 as step 8. It never modifies any score fields. The enrichment makes Stage 3 (rerank) and Stage 4 (filter) anchor-aware without score side-effects. No feature flag; always active.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata extraction |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

 succeeded in 52ms:
# Validation signals as retrieval metadata

## Current Reality

Spec document validation metadata integrates into the scoring layer as an additional ranking dimension in Stage 2. Four signal sources contribute: importance tier mapped to a numeric quality score (constitutional=1.0 through deprecated=0.1), the direct `quality_score` database column, `<!-- SPECKIT_LEVEL: N -->` content marker extraction and validation completion markers (`<!-- VALIDATED -->`, `<!-- VALIDATION: PASS -->`).

The combined multiplier is bounded to 0.8-1.2 via a clamping function, composed of quality factor (0.9-1.1), spec level bonus (0-0.06), completion bonus (0-0.04) and checklist bonus (0-0.01). Well-maintained documentation ranks slightly above neglected documentation when both are relevant. No feature flag; always active.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `mcp_server/lib/search/validation-metadata.ts` | Lib | Validation signal metadata |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

 succeeded in 52ms:
# Learned relevance feedback

## Current Reality

The system learns from user result selections. When a user marks a search result as useful via `memory_validate` with a `queryId`, query terms are extracted and stored in a separate `learned_triggers` column. This column is explicitly isolated from the FTS5 index to prevent contamination, which would be irreversible without a full re-index.

Ten safeguards protect against noise: a 100+ stop-word denylist, rate cap of 3 terms per selection and 8 per memory, 30-day TTL decay, FTS5 isolation verified by 5 critical tests, noise floor (top-3 exclusion), 1-week shadow period (log-but-don't-apply), rollback mechanism, provenance audit log, 72-hour minimum memory age and sprint gate review.

**Sprint 8 update:** The R11 shadow-period safeguard remains active in runtime. `isInShadowPeriod()` and its guards in `recordSelection()` / `queryLearnedTriggers()` were retained as Safeguard #6 (1-week shadow mode: log-but-don't-apply). Sprint 8 dead-code cleanup removed other retired flag helpers (`isShadowScoringEnabled`, `isRsfEnabled`), but not the R11 shadow-period guard.

Learned triggers boost future searches via a 0.7x weight applied during the feedback signals step in Stage 2. The boost applies alongside the query, not replacing it. Runs behind the `SPECKIT_LEARN_FROM_SELECTION` flag (default ON; set to `false` to disable).

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
exec
/bin/zsh -lc "rg -n \"recordSelection\\(|queryLearnedTriggers\\(\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:355:    const learnedMatches = queryLearnedTriggers(query, db as Parameters<typeof queryLearnedTriggers>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:393:      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
exec
/bin/zsh -lc "sed -n '360,420p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
      reason: promotionResult.reason,
    };
  }

  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
  if (!wasUseful) {
    recordNegativeFeedbackEvent(database, memoryId);
  }

  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
  let learnedFeedback: {
    attempted: boolean;
    applied: boolean;
    termsLearned: string[];
    reason?: string;
  } | null = null;
  let groundTruthSelectionId: number | null = null;

  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/13-strict-zod-schema-validation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,90p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,90p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# DB_PATH extraction and import standardization

## Current Reality

`shared/config.ts` gained an exported `getDbDir()` function reading `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` env vars. `shared/paths.ts` exports `DB_PATH` using this config. Scripts that hardcoded database paths (`cleanup-orphaned-vectors.ts`) now import from shared. Fourteen relative cross-boundary imports across scripts were converted to `@spec-kit/` workspace aliases.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `shared/config.ts` | Shared | Shared configuration |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/paths.ts` | Shared | Shared path utilities |
| `shared/types.ts` | Shared | Type definitions |

 succeeded in 53ms:
# Strict Zod schema validation

## Current Reality

**IMPLEMENTED (Sprint 019).** All 28 MCP tool inputs (L1-L7) have Zod runtime schemas defined in `mcp_server/schemas/tool-input-schemas.ts` (re-exported via `tool-schemas.ts`), controlled by `SPECKIT_STRICT_SCHEMAS` (`.strict()` vs `.passthrough()`). Hallucinated parameters from calling LLMs are rejected with clear Zod errors and logged to stderr for audit trail (CHK-029). Adds `zod` dependency.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/tool-input-schema.vitest.ts` | Tool input schema tests |

 succeeded in 51ms:
# Dynamic server instructions at MCP initialization

## Current Reality

**IMPLEMENTED (Sprint 019).** Startup in `context-server.ts` uses `server.setInstructions()` to inject a dynamic memory-system overview (total memories, spec folder count, channels, stale count) into the MCP instruction payload. Reuses existing `memory_stats` logic. Gated by `SPECKIT_DYNAMIC_INIT` (default `true`).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/context-server.ts` | Core | MCP server entry point |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
| `mcp_server/formatters/index.ts` | Formatter | Module barrel export |
| `mcp_server/formatters/search-results.ts` | Formatter | Search result formatting |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics display |
 succeeded in 51ms:
# Warm server / daemon mode

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** HTTP daemon transport for warm, persistent server execution is deferred while MCP SDK HTTP transport conventions continue evolving. Current transport remains stdio. Estimated effort: L (2-3 weeks).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/cli.ts` | Core | CLI entry point |
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/context-server.ts` | Core | MCP server entry point |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/core/db-state.ts` | Core | Database state management |
| `mcp_server/core/index.ts` | Core | Module barrel export |
| `mcp_server/formatters/index.ts` | Formatter | Module barrel export |
| `mcp_server/formatters/search-results.ts` | Formatter | Search result formatting |
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/09-activation-window-persistence.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Activation window persistence

## Current Reality

The `ensureActivationTimestampInitialized` path was added to `save-quality-gate.ts` to preserve the warn-only window activation timestamp across process restarts. Without this, the 14-day warm-up period restarted on every server reload. Regression test `WO7` verifies persistence.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search-flags.vitest.ts` | Hybrid search flag behavior |
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/17-cross-process-db-hot-rebinding.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Cross-process DB hot rebinding

## Current Reality

Process-lifetime DB connection manager via marker file (`DB_UPDATED_FILE`). When an external process mutates the database, it writes a timestamp to the marker file. On next `checkDatabaseUpdated()` call, if timestamp > lastDbCheck, triggers `reinitializeDatabase()`: closes the old DB handle, calls `vectorIndex.initializeDb()`, and rebinds 6 modules (vectorIndex, checkpoints, accessTracker, hybridSearch, sessionManager, incrementalIndex). Concurrency-safe via mutex with race-condition fix (P4-13). Also manages embedding model readiness (polling with timeout) and constitutional cache lifecycle.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/core/db-state.ts` | Core | Database state management and hot rebinding |
| `mcp_server/core/config.ts` | Core | Server configuration including DB_UPDATED_FILE |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/db-state-graph-reinit.vitest.ts` | DB state graph reinit |
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/mcp_server/core/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
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
exec
/bin/zsh -lc "sed -n '1,90p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# 7-layer tool architecture metadata

## Current Reality

The layer definitions module (`lib/architecture/layer-definitions.ts`) defines a 7-layer MCP architecture (L1 through L7) where each layer has a designated token budget, priority level, use case description, and list of assigned tools. Layer IDs map to task types (`search`, `browse`, `modify`, `checkpoint`, `analyze`, `maintenance`, `default`) so the system can recommend the appropriate layer for a given operation.

Each `LayerDefinition` includes: `id`, `name`, `description`, `tokenBudget`, `priority`, `useCase`, and `tools[]`. The architecture metadata is used by the context handler to enforce per-layer token budgets and by the query classifier to route requests to the correct tool subset. This provides structural governance over which tools are available at each abstraction level and how many tokens each layer can consume.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | 7-layer architecture definitions and routing |
| `mcp_server/handlers/memory-context.ts` | Handler | Context handler using layer metadata |

### Tests

| File | Focus |
exec
/bin/zsh -lc 'rg -n "sqlite-fts|bm25-index|channel-representation" .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/07-search-pipeline-safety.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
9:**D2 — FTS5 double-tokenization:** `sqlite-fts.ts` and `bm25-index.ts` had separate tokenization logic, causing query terms to be tokenized differently than indexed content. Refactored to a shared `sanitizeQueryTokens()` function returning a raw token array that both callers join with their appropriate syntax.
11:**D3 — Quality floor vs RRF range mismatch:** `channel-representation.ts` used `QUALITY_FLOOR=0.2` which filtered out virtually all RRF-sourced results (RRF scores are typically 0.01-0.03). Lowered to 0.005.
37:| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
40:| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |
68:| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 interface |
116:| `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
119:| `mcp_server/tests/channel-representation.vitest.ts` | Channel representation tests |
179:| `mcp_server/tests/sqlite-fts.vitest.ts` | SQLite FTS5 operations |
exec
/bin/zsh -lc "sed -n '510,575p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
 *   - `contentSource: 'reassembled_chunks'` to mark provenance
 *
 * On failure, returns the best-chunk row with
 *   `contentSource: 'file_read_fallback'`.
 *
 * @param group  - The chunk group (parentId + chunks + bestChunk).
 * @param stats  - Mutable stats object updated in place.
 * @returns A PipelineRow representing the parent document.
 */
async function reassembleParentRow(
  group: ChunkGroup,
  stats: ChunkReassemblyStats
): Promise<PipelineRow> {
  const { parentId, bestChunk } = group;

  try {
    const db = requireDb();

    // Query the parent memory row for content and metadata
    const parentRow = db
exec
/bin/zsh -lc "rg -n \"chunk_index|sort\\(|chunkIndices|document order|reassemble\" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
9://   3. MPAB chunk collapse        — dedup chunks, reassemble parents
21://     - contentSource is set to 'reassembled_chunks' or 'file_read_fallback'
77:  /** Number of parents whose content was successfully reassembled from DB. */
78:  reassembled: number;
224:        reassembled: chunkStats.reassembled,
394: * Collapse chunk-level hits and reassemble parent memory documents.
401: *   5. If the DB query succeeds, emit a reassembled parent row.
403: *   7. Merge non-chunks + reassembled parents, sort by score descending.
417:    reassembled: 0,
451:    // AI-WHY: Sort chunks by chunk_index (document order) for correct reassembly,
453:    chunks.sort((a, b) => {
454:      const aIdx = ((a.chunk_index ?? a.chunkIndex) as number | undefined) ?? 0;
455:      const bIdx = ((b.chunk_index ?? b.chunkIndex) as number | undefined) ?? 0;
464:  const reassembledRows = await Promise.all(
465:    chunkGroups.map((group) => reassembleParentRow(group, stats))
468:  // Merge non-chunks + reassembled parent rows, sort by effective score
469:  const merged = [...nonChunks, ...reassembledRows];
470:  merged.sort((a, b) => effectiveScore(b) - effectiveScore(a));
505: * Attempt to reassemble a full parent memory row from the database.
510: *   - `contentSource: 'reassembled_chunks'` to mark provenance
exec
/bin/zsh -lc "sed -n '660,695p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
  // overall pipeline limit. Apply it here so Stage 3 reranks a pre-trimmed set.
  results.sort((a, b) => resolveEffectiveScore(b) - resolveEffectiveScore(a));
  if (
    config.artifactRouting &&
    config.artifactRouting.confidence > 0 &&
    typeof config.artifactRouting.strategy?.maxResults === 'number' &&
    config.artifactRouting.strategy.maxResults > 0 &&
    results.length > config.artifactRouting.strategy.maxResults
  ) {
    results = results.slice(0, config.artifactRouting.strategy.maxResults);
  }

  // AI-GUARD: -- 8. Anchor metadata annotation --
  // Pure annotation: attach AnchorMetadata[] to rows that contain ANCHOR tags.
  // No scores are changed — this satisfies the Stage 4 score-immutability
  // invariant and does not conflict with the G2 double-weighting guard.
  try {
    results = enrichResultsWithAnchorMetadata(results);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
exec
/bin/zsh -lc "sed -n '330,385p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
 * @param results - Pipeline rows to adjust
 * @param query   - Original search query (used for learned trigger matching)
 * @returns New array with feedback-adjusted scores
 */
function applyFeedbackSignals(
  results: PipelineRow[],
  query: string
): PipelineRow[] {
  if (!Array.isArray(results) || results.length === 0) return results;

  let db: Database.Database | null = null;
  try {
    db = requireDb();
  } catch (error: unknown) {
    if (error instanceof Error) {
      // AI-WHY: DB not available — skip feedback signals gracefully
      return results;
    }
    // AI-WHY: DB not available — skip feedback signals gracefully
    return results;
exec
/bin/zsh -lc "sed -n '385,430p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
    if (learnedBoost > 0) {
      currentScore = Math.min(1.0, currentScore + learnedBoost);
    }

    // Apply negative feedback demotion (multiplicative confidence multiplier)
    if (isNegativeFeedbackEnabled()) {
      const negStats = negativeFeedbackStats.get(row.id);
      if (negStats && negStats.negativeCount > 0) {
        currentScore = applyNegativeFeedback(
          currentScore,
          negStats.negativeCount,
          negStats.lastNegativeAt
        );
      }
    }

    if (currentScore === resolveBaseScore(row)) return row;

    return {
      ...row,
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Pipeline and mutation hardening

## Current Reality

Ten fixes addressed schema completeness, pipeline metadata, embedding efficiency, stemmer quality, and data cleanup:

- **Schema params exposed (#13):** `memorySearch` tool schema now includes `trackAccess`, `includeArchived`, and `mode` parameters.
- **Dead dedup config removed (#14):** `sessionDeduped` removed from Stage 4 metadata (dedup is post-cache in the main handler).
- **Constitutional count passthrough (#15):** Stage 1's constitutional injection count flows through the orchestrator to Stage 4 output metadata.
- **Embedding caching (#16):** Stage 1 caches the query embedding at function scope for reuse in the constitutional injection path, saving one API call per search.
- **Stemmer double-consonant (#18):** `simpleStem()` now handles doubled consonants after suffix removal: "running"->"runn"->"run", "stopped"->"stopp"->"stop".
- **Full-content embedding on update (#19):** `memory_update` now embeds `title + "\n\n" + content_text` instead of title alone.
- **Ancillary record cleanup on delete (#20):** Memory deletion now cleans `degree_snapshots`, `community_assignments`, `memory_summaries`, `memory_entities`, and `causal_edges`.
- **BM25 index cleanup on delete (#21):** `bm25Index.getIndex().removeDocument(String(id))` called after successful delete when BM25 is enabled.
- **Atomic save error tracking (#22):** `atomicSaveMemory` now tracks rename-failure state with a `dbCommitted` flag for better error reporting.
- **Dynamic preflight error code (#23):** Preflight validation uses the actual error code from `preflightResult.errors[0].code` instead of hardcoding `ANCHOR_FORMAT_INVALID`.

## Source Files

### Implementation
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path; import re; txt=Path(\".opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts\").read_text(); m=re.search(r\"export const TOOL_SCHEMAS: Record<string, ToolInputSchema> = \\{(.*?)\\n\\};\", txt, re.S); body=m.group(1); n=sum(1 for line in body.splitlines() if \":\" in line and \"as unknown as ToolInputSchema\" in line); print(n)'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 948ms:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-0g7kz8PW' (errno=Operation not permitted)
28
exec
/bin/zsh -lc "rg -n \"formatZodError|validateToolArgs|ToolSchemaValidationError|console\\.error.*schema|stderr|Zod\" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:4:// Centralized strict Zod validation schemas for MCP tool inputs.
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:8:import { z, ZodError, type ZodType } from 'zod';
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:11:type ToolInputSchema = ZodType<ToolInput>;
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:13:export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:122:      code: z.ZodIssueCode.custom,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:384:export class ToolSchemaValidationError extends Error {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:391:    this.name = 'ToolSchemaValidationError';
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:export function formatZodError(toolName: string, error: ZodError): ToolSchemaValidationError {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:430:  return new ToolSchemaValidationError(
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:446:export function validateToolArgs(toolName: string, rawInput: Record<string, unknown>): ToolInput {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:449:    throw new ToolSchemaValidationError(toolName, `Unknown tool: "${toolName}". No schema registered.`, {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:460:    if (error instanceof ZodError) {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:461:      const formatted = formatZodError(toolName, error);
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:      // CHK-029: Log rejected params for audit trail (MCP uses stderr)
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:      console.error(`[schema-validation] ${toolName}: ${formatted.message}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:276:    // T304: Zod validation is applied per-tool inside each dispatch module
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:8:import { validateToolArgs } from '../schemas/tool-input-schemas';
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:17:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:12:import { validateToolArgs } from '../schemas/tool-input-schemas';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:30:/** Parse and validate tool arguments using Zod schema definitions. */
codex
I’ve got enough evidence to assemble the report now. I’m doing one last normalization pass across all 43 entries so the severity and action labels stay consistent across categories instead of drifting feature by feature.
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing | sed 's#.*/##' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence | sed 's#.*/##' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture | sed 's#.*/##' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
01-verify-fix-verify-memory-quality-loop.md
02-signal-vocabulary-expansion.md
03-pre-flight-token-budget-validation.md
04-spec-folder-description-discovery.md
05-pre-storage-quality-gate.md
06-reconsolidation-on-save.md
07-smarter-memory-content-generation.md
08-anchor-aware-chunk-thinning.md
09-encoding-intent-capture-at-index-time.md
10-auto-entity-extraction.md
11-content-aware-memory-filename-generation.md
12-generation-time-duplicate-and-empty-content-prevention.md
13-entity-normalization-consolidation.md
14-quality-gate-timer-persistence.md
15-deferred-lexical-only-indexing.md
16-dry-run-preflight-for-memory-save.md
 succeeded in 53ms:
01-query-complexity-router.md
02-relative-score-fusion-in-shadow-mode.md
03-channel-min-representation.md
04-confidence-based-result-truncation.md
05-dynamic-token-budget-allocation.md
06-query-expansion.md
 succeeded in 53ms:
01-4-stage-pipeline-refactor.md
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
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/16-backend-storage-adapter-abstraction.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Backend storage adapter abstraction

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Vector/graph/document storage abstractions (`IVectorStore`, `IGraphStore`, `IDocumentStore`) are deferred to avoid premature abstraction while SQLite coupling handles current scale. Estimated effort: M-L (1-2 weeks).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Backend storage adapter abstraction
- Current reality source: feature_catalog.md
exec
/bin/zsh -lc "sed -n '1,60p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,70p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,70p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/03-pre-flight-token-budget-validation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,70p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,70p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Confidence-based result truncation

## Current Reality

Search results often contain a long tail of irrelevant items. Rather than returning a fixed number, confidence truncation detects where relevant results end. It computes consecutive score gaps across the ranked list, finds the median gap, and looks for the first gap exceeding 2x the median. That point is the "relevance cliff." Everything below it is trimmed.

A minimum of three results is guaranteed regardless of gap analysis so the system never returns nothing. The truncation metadata (original count, truncated count, cutoff index, median gap and cutoff gap) is returned alongside results for evaluation.

Edge cases are handled: NaN and Infinity scores are filtered, and all-equal scores (median gap of zero) pass through unchanged. Runs behind the `SPECKIT_CONFIDENCE_TRUNCATION` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/confidence-truncation.ts` | Lib | Confidence-based truncation |

### Tests

 succeeded in 53ms:
# Generation-time duplicate and empty content prevention

## Current Reality

Two pre-write quality gates in `scripts/core/file-writer.ts` prevent empty and duplicate memory files at generation time, complementing the existing index-time dedup in `memory-save.ts`. The empty content gate (`validateContentSubstance`) strips YAML frontmatter, HTML comments, anchor markers, empty headings, table rows and empty list items, then rejects files with fewer than 200 characters of remaining substance. The duplicate gate (`checkForDuplicateContent`) computes a SHA-256 hash of the file content and compares it against all existing `.md` files in the target memory directory, rejecting exact matches.

Both gates run inside `writeFilesAtomically()` before the atomic write operation, after the existing `validateNoLeakedPlaceholders` check. Failures throw descriptive errors that halt the save and report which validation failed. This catches the two most common quality problems — SGQS-template-only files and repeated saves of identical content — at the earliest possible point. Always active with no feature flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/handlers/handler-utils.ts` | Handler | Handler utility helpers |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |
 succeeded in 51ms:
# Pre-flight token budget validation

## Current Reality

Before assembling the final response, the system estimates total token count across all candidate results and truncates to the highest-scoring candidates when the total exceeds the configured budget. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the usable budget is first reduced by header overhead (~12 tokens per result, floor 200 tokens) to account for injected `[parent > child — desc]` headers (CHK-060). The truncation strategy is greedy: highest scores first, never round-robin.

For `includeContent=true` queries where a single result overshoots the budget, a summary (first 400 characters) replaces raw content rather than returning nothing.

Overflow events are logged with query ID, candidate count, total tokens, budget limit and the number of results after truncation. This prevents the response from blowing through the caller's context window.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/validation/preflight.ts` | Lib | Pre-flight validation |

### Tests
 succeeded in 51ms:
# Auto entity extraction

## Current Reality

Memory content contains implicit entities — technology names, architectural concepts, project identifiers — that are valuable for cross-document linking but were never explicitly captured. Manual entity tagging does not scale, and the system had zero entities in its catalog.

Auto entity extraction runs at save time using five pure-TypeScript regex rules with no external NLP dependencies. Rule 1 captures capitalized multi-word sequences (proper nouns like "Claude Code" or "Spec Kit Memory"). Rule 2 extracts technology names from code fence language annotations. Rule 3 identifies nouns following key phrases ("using", "with", "via", "implements"). Rule 4 pulls content from markdown headings. Rule 5 captures quoted strings.

Extracted entities pass through a denylist filter (`entity-denylist.ts`) containing 64 combined stop words across three categories: common nouns (29 words like "thing", "time", "example"), technology stop words (20 words like "api", "json", "npm") and generic modifiers (15 words like "new", "old", "simple"). Single-character entities and entities shorter than 2 characters are also filtered.

Deduplicated entities are stored in the `memory_entities` table with a UNIQUE constraint on `(memory_id, entity_text)`. The `entity_catalog` table maintains canonical names with Unicode-aware alias normalization (`/[^\p{L}\p{N}\s]/gu` — preserving letters and numbers from all scripts) and a `memory_count` field tracking how many memories reference each entity. An `edge_density` check (`totalEdges / totalMemories`) provides a diagnostic metric.

**Sprint 8 update:** Entity normalization was consolidated. Two divergent `normalizeEntityName` functions (ASCII-only in `entity-extractor.ts` vs Unicode-aware in `entity-linker.ts`) were unified into a single Unicode-aware version in `entity-linker.ts`. The `entity-extractor.ts` module now imports and re-exports this function. Similarly, a duplicate `computeEdgeDensity` function was consolidated into `entity-linker.ts`.

Entities are deliberately stored in a separate table rather than as causal edges. Mixing them into `causal_edges` would hit the `MAX_EDGES_PER_NODE=20` limit, distort N2 graph algorithms and pollute N3-lite consolidation. Runs behind the `SPECKIT_AUTO_ENTITIES` flag (default ON).

---

## Source Files

 succeeded in 50ms:
# Dry-run preflight for memory_save

## Current Reality

The `memory_save` tool accepts a `dryRun` parameter that runs the full save pipeline — content normalization, quality gate evaluation, deduplication check, token budget estimation — without committing any changes to the database or writing files to disk. The response includes what would have happened: whether the save would pass quality gates, the computed quality score breakdown, any near-duplicate warnings, and the estimated token cost.

This allows agents to preview a save operation before committing, catching quality gate rejections or duplicate content early. The dry-run path shares the same validation code as the real save path, ensuring preview accuracy matches production behavior.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-save.ts` | Handler | Save handler with dry-run path |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions including dryRun flag |
| `mcp_server/lib/validation/preflight.ts` | Lib | Pre-flight validation logic |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod schema with dryRun parameter |
| `mcp_server/tool-schemas.ts` | Core | Tool schema with dryRun option |

exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/08-performance-improvements.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Performance improvements

## Current Reality

Thirteen performance improvements were applied:

**Quick wins:** `Math.max(...spread)` replaced with `reduce`-based max in `tfidf-summarizer.ts` (prevents RangeError on large arrays). Unbounded query in `memory-summaries.ts` gained a `LIMIT` clause. O(n) full scan in `mutation-ledger.ts` replaced with SQL `COUNT(*)` query using `json_extract`.

**Entity linker:** `mergedEntities` array lookups converted to `Set` for O(1) `.has()` checks. N+1 `getEdgeCount` queries replaced with a single batch query that combines `source_id IN (...)` and `target_id IN (...)` branches via `UNION ALL` before aggregation.

**SQL-level:** Causal edge upsert reduced from 3 DB round-trips to 2 by eliminating the post-upsert SELECT via `lastInsertRowid`. Spec folder hierarchy tree cached with a 60-second WeakMap TTL keyed by database instance.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cache/tool-cache.ts` | Lib | Tool Cache |
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Embedding retry orchestrator

## Current Reality

The retry manager (`lib/providers/retry-manager.ts`) orchestrates background retry of failed embedding operations. When the primary embedding provider is unavailable or returns errors during `memory_save` or `memory_index_scan`, the affected memories are marked with `embedding_status = 'pending'` and stored without vectors (lexical-only fallback). The retry manager runs as a background job with configurable interval and batch size, picking up pending memories and re-attempting embedding generation.

Each retry attempt uses the embedding cache to avoid redundant API calls for content that was previously embedded successfully. The retry stats (`pending`, `retry`, `failed` counts) are exposed for monitoring. Failed memories increment a `retry_count` for progressive backoff. The orchestrator coordinates with the index-refresh module to ensure retried embeddings are properly inserted into `vec_memories`.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/providers/retry-manager.ts` | Lib | Background retry job with batch processing |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding cache for retry dedup |
| `mcp_server/lib/storage/index-refresh.ts` | Lib | Index refresh for retried embeddings |

### Tests
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Relative score fusion in shadow mode

## Current Reality

RRF has been the fusion method since day one, but is it the best option? Relative Score Fusion runs alongside RRF in shadow mode to find out.

Three RSF variants are implemented: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). RSF results are logged for evaluation comparison but do not affect actual ranking.

Kendall tau correlation between RSF and RRF rankings is computed at sprint exit to measure how much the two methods diverge. If RSF consistently outperforms, a future sprint can switch the primary fusion method with measured evidence.

**Sprint 8 update:** The `isRsfEnabled()` feature flag function was removed as dead code. The dead RSF branch in `hybrid-search.ts` (which was gated behind this flag returning `false`) was also removed. The RSF fusion module (`rsf-fusion.ts`) retains its core fusion logic for potential future activation, but the flag guard function is gone.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/rsf-fusion.ts` | Lib | Relative score fusion |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |
exec
/bin/zsh -lc "sed -n '1,70p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Channel min-representation

## Current Reality

A strong vector channel can monopolize the top-k results, pushing out graph and lexical results entirely. Channel min-representation fixes that.

After fusion, the system checks that every channel which returned results has at least one representative in the top-k window. Results below a 0.005 quality floor are excluded from promotion because forcing a bad result into the top-k is worse than missing a channel. The floor was lowered from 0.2 to 0.005 during Sprint 8 remediation because RRF scores typically fall in the 0.01-0.03 range, and the original 0.2 threshold was filtering out virtually all RRF-sourced results.

Promoted items are appended to the result list and the entire set is re-sorted by score so ranking integrity is preserved. The net effect: you see results from diverse retrieval strategies rather than one dominant channel. Runs behind the `SPECKIT_CHANNEL_MIN_REP` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |

### Tests

exec
/bin/zsh -lc "sed -n '1,70p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Dynamic token budget allocation

## Current Reality

Returning 4,000 tokens for a simple trigger-phrase lookup wastes context window. Token budgets now scale with query complexity: simple queries receive 1,500 tokens, moderate queries 2,500 and complex queries 4,000.

The budget is computed early in the pipeline (before channel execution) so downstream stages can enforce it. When contextual tree headers are enabled (`SPECKIT_CONTEXT_HEADERS`), the effective budget is reduced by header overhead (~12 tokens per result, floor 200 tokens) before truncation (CHK-060). When the flag is disabled, all queries fall back to the 4,000-token default.

The savings add up. If 60% of your queries are simple, you recover roughly 40% of the token budget that was previously wasted on over-delivering.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/dynamic-token-budget.ts` | Lib | Token budget computation |
| `mcp_server/lib/search/query-classifier.ts` | Lib | Query complexity classification |

### Tests
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Query expansion

## Current Reality

Embedding-based query expansion broadens retrieval for complex queries by mining similar memories from the vector index and extracting related terms to append to the original query, producing an enriched combined query string. Stop-words are filtered out and tokens shorter than 3 characters are discarded.

When R15 classifies a query as "simple", expansion is suppressed because expanding a trigger-phrase lookup would add noise. If expansion produces no additional terms, the original query proceeds unchanged. In the 4-stage pipeline, Stage 1 runs the baseline and expanded-query searches in parallel with deduplication (baseline-first). Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag (default ON).

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
exec
/bin/zsh -lc "sed -n '1,70p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Deferred lexical-only indexing

## Current Reality

Async embedding fallback via `index_memory_deferred()`. When embedding generation fails (API timeout, rate limit), memories are inserted with `embedding_status='pending'` and are immediately searchable via BM25/FTS5 (title, trigger_phrases, content_text) and structural SQL (importance_tier, importance_weight). Vector search requires `embedding_status='success'`. Deferred memories skip embedding dimension validation and `vec_memories` insertion. Background retry via the retry manager or CLI reindex increments `retry_count` and updates status. Failure reason is recorded for diagnostics.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations with deferred path |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Vector index schema including embedding_status |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding generation pipeline with fallback |

### Tests

| File | Focus |
|------|-------|
exec
/bin/zsh -lc "rg -n \"index_memory_deferred|embedding_status='pending'|embedding_status = 'pending'|retry_count|failure reason|Failure reason\" .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:164:export function index_memory_deferred(params: IndexMemoryDeferredParams): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:197:          embedding_status = 'pending',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:216:      failure_reason, retry_count, encoding_intent, document_type, spec_level,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:545:export { index_memory_deferred as indexMemoryDeferred };
exec
/bin/zsh -lc "sed -n '1,70p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Content-aware memory filename generation

## Current Reality

Memory filenames were previously derived solely from the spec folder name, producing identical slugs like `hybrid-rag-fusion-refinement.md` for every save in the same folder. The workflow now builds a `preferredMemoryTask` and uses it for slug/title generation in `generateContentSlug()`, with candidate precedence `task -> specTitle -> sessionCandidates (QUICK_SUMMARY/TITLE/SUMMARY) -> folderBase`. In stateless mode, generic task strings can be enriched from the `spec.md` frontmatter title before candidate selection. In JSON/file-backed mode, that enrichment override remains disabled, but candidate precedence still prefers stronger session-derived names before folder fallback. Generic detection used by selection/enrichment includes `implementation-and-updates`, and slug fallback still uses the generic terms list (`development-session`, `session-summary`, `session-context`, `session`, `context`, `implementation`, `work-session`).

The slug is lowercased, non-alphanumeric characters replaced with hyphens, collapsed, and truncated at a word boundary (hyphen) to a maximum of 50 characters. A minimum length of 8 characters ensures slugs are meaningful. This produces filenames like `04-03-26_17-25__sprint-019-impl-3-phases-81-files.md` instead of `04-03-26_17-25__hybrid-rag-fusion-refinement.md`. Always active with no feature flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/slug-utils.ts` | Lib | Content-aware slug generation |

### Tests

| File | Focus |
|------|-------|
exec
/bin/zsh -lc "sed -n '1,60p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Entity normalization consolidation

## Current Reality

Two cross-cutting normalization issues were resolved:

**A1 — Divergent normalizeEntityName:** `entity-extractor.ts` used ASCII-only normalization (`/[^\w\s-]/g`) while `entity-linker.ts` used Unicode-aware normalization (`/[^\p{L}\p{N}\s]/gu`). Consolidated to a single Unicode-aware version in `entity-linker.ts`, imported by `entity-extractor.ts`.

**A2 — Duplicate computeEdgeDensity:** Both `entity-extractor.ts` and `entity-linker.ts` had independent implementations. Consolidated to `entity-linker.ts` with import and re-export from `entity-extractor.ts`.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/extraction/entity-denylist.ts` | Lib | Entity denylist |
| `mcp_server/lib/extraction/entity-extractor.ts` | Lib | Entity extraction |
| `mcp_server/lib/parsing/entity-scope.ts` | Lib | Entity scope parsing |

exec
/bin/zsh -lc "rg -n \"checkDatabaseUpdated\\(\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:64:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:168:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:197:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:40:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:168:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:285:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:47:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:207:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:267:    await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:470:    await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:553:    await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:666:    await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:37:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:26:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:103:export async function checkDatabaseUpdated(): Promise<boolean> {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:155:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:305:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:469:  await checkDatabaseUpdated();
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:96:  await checkDatabaseUpdated();
exec
/bin/zsh -lc "sed -n '1,60p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Pre-storage quality gate

## Current Reality

A three-layer quality gate on memory save validates content before it enters the index. Layer 1 checks structural validity (title exists, content at least 50 characters, valid spec folder path format). Layer 2 scores content quality across five dimensions (title quality, trigger quality, length quality, anchor quality, metadata quality) with a 0.4 signal density threshold. Layer 3 checks semantic deduplication via cosine similarity against existing memories in the same spec folder, rejecting near-duplicates above 0.92.

The gate starts in warn-only mode for 14 days after activation per the MR12 mitigation: it logs would-reject decisions without blocking saves while the thresholds are being validated. After the warn-only period, hard rejections apply. Runs behind the `SPECKIT_SAVE_QUALITY_GATE` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/providers/embeddings.ts` | Lib | Embedding provider dispatch |
exec
/bin/zsh -lc "sed -n '1,50p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Verify-fix-verify memory quality loop

## Current Reality

Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system auto-fixes by re-extracting triggers, normalizing anchors and trimming content to budget. Then it scores again.

If the second attempt still fails, a third try runs with stricter trimming. After two failed retries, the memory is rejected outright.

Rejection rates are logged per spec folder so you can spot folders that consistently produce low-quality saves. This loop catches problems at write time rather than letting bad data pollute search results.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop handler |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |

### Tests
exec
/bin/zsh -lc "sed -n '1,50p' .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Signal vocabulary expansion

## Current Reality

The trigger matcher originally recognized six signal categories. Two new categories from the true-mem 8-category vocabulary were added: CORRECTION signals (words like "actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want").

Correction signals matter because they indicate the user is fixing a prior misunderstanding, which means different memories are relevant. Preference signals help the system detect intent behind requests like "I prefer the JSON format" where matching on preference-associated memories improves retrieval accuracy.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Trigger phrase matching |
exec
/bin/zsh -lc "sed -n '1,40p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
exec
/bin/zsh -lc "sed -n '392,432p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
 * Save memory content to disk with best-effort indexing.
 *
 * **NOT truly atomic.** The file write uses atomic rename (write-to-temp +
 * rename), but DB indexing runs asynchronously afterward because
 * `indexMemoryFile` requires async embedding generation while
 * `executeAtomicSave` expects a synchronous `dbOperation` callback.
 *
 * On embedding failure, the memory is saved to disk and indexed in the DB
 * **without vector embeddings** — a partial-success state. The caller
 * receives a `status: 'partial'` result with a hint to retry
 * `memory_save({ filePath, force: true })` to rebuild the index entry.
 *
 * P4-01/P4-17 NOTE: True atomicity between file write and DB indexing is not
 * achievable under this architecture.
 */
async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
  const { file_path, content } = params;
  const { force = false } = options;

  // AI-WHY: Write file and run DB operation atomically
exec
/bin/zsh -lc "sed -n '440,460p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
      }
    } catch (_error: unknown) {
      // Non-fatal: constitutional directory discovery failed
    }

    const rawResults = scanLocations.flatMap(loc => transactionManager.recoverAllPendingFiles(loc));

    // Aggregate per-file results into a summary
    const found = rawResults.length;
    const recovered = rawResults.filter(r => r.recovered).length;
    const failed = found - recovered;

    const recoveryResult: PendingRecoveryResult = {
      found,
      processed: found,
      recovered,
      failed,
      results: rawResults,
    };

exec
/bin/zsh -lc "rg -n \"memory-save\\.ts|chunking-orchestrator\\.ts|vector-index-mutations\\.ts|entity-linker\\.ts|save-quality-gate\\.ts|stage2-fusion\\.ts|checkpoints\\.ts|response-builder\\.ts|tool-schemas\\.ts|context-server\\.ts|shared/config\\.ts|retry-manager\\.ts|index-refresh\\.ts\" .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/*.md .opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/*.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md:5:Two pre-write quality gates in `scripts/core/file-writer.ts` prevent empty and duplicate memory files at generation time, complementing the existing index-time dedup in `memory-save.ts`. The empty content gate (`validateContentSubstance`) strips YAML frontmatter, HTML comments, anchor markers, empty headings, table rows and empty list items, then rejects files with fewer than 200 characters of remaining substance. The duplicate gate (`checkForDuplicateContent`) computes a SHA-256 hash of the file content and compares it against all existing `.md` files in the target memory directory, rejecting exact matches.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md:43:| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md:55:| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md:63:| `shared/config.ts` | Shared | Shared configuration |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md:13:**Sprint 8 update:** Entity normalization was consolidated. Two divergent `normalizeEntityName` functions (ASCII-only in `entity-extractor.ts` vs Unicode-aware in `entity-linker.ts`) were unified into a single Unicode-aware version in `entity-linker.ts`. The `entity-extractor.ts` module now imports and re-exports this function. Similarly, a duplicate `computeEdgeDensity` function was consolidated into `entity-linker.ts`.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md:9:The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and in BM25 rebuild/tokenization paths that call `normalizeContentForBM25()`.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md:48:| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md:63:| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md:71:| `shared/config.ts` | Shared | Shared configuration |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md:24:| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md:34:| `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Pre-storage quality gate |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/05-pre-storage-quality-gate.md:36:| `shared/config.ts` | Shared | Shared configuration |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md:25:| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/02-signal-vocabulary-expansion.md:36:| `shared/config.ts` | Shared | Shared configuration |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:15:| `mcp_server/handlers/memory-save.ts` | Handler | Save handler with dry-run path |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/16-dry-run-preflight-for-memory-save.md:19:| `mcp_server/tool-schemas.ts` | Core | Tool schema with dryRun option |
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md:7:**A1 — Divergent normalizeEntityName:** `entity-extractor.ts` used ASCII-only normalization (`/[^\w\s-]/g`) while `entity-linker.ts` used Unicode-aware normalization (`/[^\p{L}\p{N}\s]/gu`). Consolidated to a single Unicode-aware version in `entity-linker.ts`, imported by `entity-extractor.ts`.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/13-entity-normalization-consolidation.md:9:**A2 — Duplicate computeEdgeDensity:** Both `entity-extractor.ts` and `entity-linker.ts` had independent implementations. Consolidated to `entity-linker.ts` with import and re-export from `entity-extractor.ts`.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:13:| `mcp_server/lib/search/vector-index-mutations.ts` | Lib | Vector index mutations with deferred path |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/01-4-stage-pipeline-refactor.md:66:| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 fusion |
exec
/bin/zsh -lc "rg -n \"embedding-pipeline|bm25-index|memory-save\\.ts\" .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
9:The normalizer has no feature flag because it is a non-destructive improvement. It is always active in the `memory-save.ts` embedding path and in BM25 rebuild/tokenization paths that call `normalizeContentForBM25()`.
exec
/bin/zsh -lc 'rg -n "chunking-orchestrator|vector-index-mutations|search-flags|encoding-intent" .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
15:| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |
21:| `mcp_server/tests/encoding-intent.vitest.ts` | Encoding intent tests |
exec
/bin/zsh -lc 'rg -n "chunk-thinning|chunking-orchestrator" .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
16:| `mcp_server/lib/chunking/chunk-thinning.ts` | Lib | Chunk thinning |
22:| `mcp_server/tests/chunk-thinning.vitest.ts` | Chunk thinning tests |
codex
---
FEATURE: 01-query-complexity-router.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts; mcp_server/formatters/search-results.ts
UNDOCUMENTED_CAPABILITIES: The classifier also returns confidence and raw extracted features (`termCount`, `charCount`, `hasTriggerMatch`, `stopWordRatio`).
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `query-classifier.ts` 97-122 and 141-198 compute features/tiering; `hybrid-search.ts` 542-575 and 989-997 propagate `queryComplexity`; `search-results.ts` 261-287 formats it.
---
FEATURE: 02-relative-score-fusion-in-shadow-mode.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The code implements RSF as a pure fusion library, but it does not run “alongside RRF in shadow mode,” does not log live RSF/RRF comparisons, and does not compute Kendall tau in runtime. The claimed removed `isRsfEnabled()`/`hybrid-search.ts` branch is not reflected as a live runtime path.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts; mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts; mcp_server/tests/rsf-multi.vitest.ts
UNDOCUMENTED_CAPABILITIES: The actual module exposes three pure helpers: `fuseResultsRsf`, `fuseResultsRsfMulti`, and `fuseResultsRsfCrossVariant`, including score clamping and missing-source penalties.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `rsf-fusion.ts` 87-390 defines the three pure fusion functions; `hybrid-search.ts` only references RSF in comments around 123-124 and has no RSF execution path.
---
FEATURE: 03-channel-min-representation.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The description says promoted items are appended and then “the entire set is re-sorted by score”; the implementation appends promoted items and returns the enhanced list without re-sorting.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: Rows with `sources[]` count toward multiple channels during representation analysis.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `channel-representation.ts` 143-175 appends promotions to `enhancedTopK`; `hybrid-search.ts` 789-802 applies the feature and records promotion metadata.
---
FEATURE: 04-confidence-based-result-truncation.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: “A minimum of three results is guaranteed so the system never returns nothing” is overstated; after filtering non-finite scores, fewer than three rows can still remain.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: The truncation helper defensively sorts results before gap analysis.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `confidence-truncation.ts` 116-123 filters/sorts inputs and 158-209 applies the cliff cutoff; `hybrid-search.ts` 807-826 integrates the truncation metadata.
---
FEATURE: 05-dynamic-token-budget-allocation.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: `dynamic-token-budget.ts` is advisory-only and returns `{ budget, applied, queryType }`; contextual-header overhead is applied later in `hybrid-search.ts`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `dynamic-token-budget.ts` 5-9 and 77-97 define the advisory allocator; `hybrid-search.ts` 566-575 stores budget metadata and 957-964 subtracts header overhead.
---
FEATURE: 06-query-expansion.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
UNDOCUMENTED_CAPABILITIES: Expansion mines terms from memory `content`, `title`, and `trigger_phrases`, and Stage 1 runs baseline and expanded searches in parallel with baseline-first dedup.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `embedding-expansion.ts` 223-235 mines fields and 293-297 gates activation; `stage1-candidate-gen.ts` 288-356 runs the parallel baseline/expanded merge.
---
FEATURE: 01-verify-fix-verify-memory-quality-loop.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The loop is implemented, but “Rejection rates are logged per spec folder” is unsupported; the eval snapshot logging does not persist per-spec-folder rejection metrics.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: The loop returns auto-fixed content for the caller to persist and degrades gracefully when disabled.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `quality-loop.ts` 304-333 auto-fixes content and 500-526 logs eval snapshots; `memory-save.ts` 122-158 invokes the loop during save.
---
FEATURE: 02-signal-vocabulary-expansion.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The description says the matcher moved from six categories to an eight-category vocabulary, but the code’s `SignalCategory` is only `correction | preference | neutral`.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Detected correction/preference signals actively boost trigger-match `importanceWeight` (+0.2 / +0.1).
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `trigger-matcher.ts` 8-17 defines the three-category type; 339-407 computes boosts and applies them to matches.
---
FEATURE: 03-pre-flight-token-budget-validation.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The description documents search-response truncation behavior, but the listed implementation is a `memory_save` preflight validator. `anchor-chunker.ts` is unrelated to the described response-budget logic.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: The referenced `preflight.ts` actually validates anchors, duplicates, and save-side token budgets for `memory_save`.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `preflight.ts` 593-727 runs save preflight; `hybrid-search.ts` 958-960 and 1583-1618 handle the described response-budget truncation/summarization.
---
FEATURE: 04-spec-folder-description-discovery.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The “all 281 existing spec folders” claim is stale and not represented in code; the current repo count is 280 and the implementation does not hardcode that number.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-context.ts; mcp_server/lib/search/search-flags.ts
UNDOCUMENTED_CAPABILITIES: Cache freshness checks include `description.json` mtimes and stale folder descriptions can be auto-repaired.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `folder-discovery.ts` 445-486 repairs per-folder descriptions and 635-691 validates/persists them; `memory-context.ts` 551-559 uses discovery before retrieval.
---
FEATURE: 05-pre-storage-quality-gate.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: The save handler distinguishes warn-only vs hard rejection and surfaces gate results in save responses.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `save-quality-gate.ts` 99-109 and 235-289 implement the layers and warn-only persistence; `memory-save.ts` 208-224 handles reject vs warn-only behavior.
---
FEATURE: 06-reconsolidation-on-save.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: Reconsolidation regenerates embedding/content-hash state on merge and the bridge can skip reconsolidation when checkpoint policy blocks it.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `reconsolidation.ts` 202-245 updates merged records and embedding metadata; `reconsolidation-bridge.ts` 44-52 and 53-183 gates execution; `memory-save.ts` 239-240 invokes the bridge.
---
FEATURE: 07-smarter-memory-content-generation.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/embedding-pipeline.ts; mcp_server/lib/search/bm25-index.ts
UNDOCUMENTED_CAPABILITIES: The normalizer also strips checkbox syntax and collapses whitespace before embedding/BM25 processing.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `content-normalizer.ts` 38-174 implements the transformations and 218-264 wires embedding/BM25 normalization; `embedding-pipeline.ts` 44-47 uses it before embedding generation.
---
FEATURE: 08-anchor-aware-chunk-thinning.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/chunking-orchestrator.ts
UNDOCUMENTED_CAPABILITIES: The thinning result includes retained/dropped chunk breakdown and scores, not just the final kept chunk list.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `chunk-thinning.ts` 118-153 returns detailed thinning stats; `chunking-orchestrator.ts` 130-139 integrates `thinChunks()`.
---
FEATURE: 09-encoding-intent-capture-at-index-time.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/chunking-orchestrator.ts; mcp_server/lib/search/vector-index-mutations.ts; mcp_server/lib/search/search-flags.ts
UNDOCUMENTED_CAPABILITIES: Both parent and child chunks are classified, and persistence stores `encoding_intent` with fallback metadata.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `encoding-intent.ts` 43-103 classifies content; `chunking-orchestrator.ts` 138-139 and 238-239 classifies parent/chunks; `vector-index-mutations.ts` 200-221 persists it.
---
FEATURE: 10-auto-entity-extraction.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts; mcp_server/lib/extraction/entity-denylist.ts; mcp_server/lib/search/entity-linker.ts; mcp_server/lib/search/search-flags.ts
UNDOCUMENTED_CAPABILITIES: The save-time pipeline can immediately run cross-document entity linking and density-guard diagnostics after extraction.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `entity-extractor.ts` 34-88 and 135-240 implement extraction/storage; `post-insert.ts` 67-80 and 101-119 runs extraction then linking; `entity-linker.ts` 214-242 computes edge density.
---
FEATURE: 11-content-aware-memory-filename-generation.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/lib/parsing/slug-utils.ts
MISSING_PATHS: scripts/utils/slug-utils.ts; scripts/utils/task-enrichment.ts; scripts/core/workflow.ts
UNDOCUMENTED_CAPABILITIES: After 100 collision attempts, slug generation falls back to a deterministic SHA1 suffix.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `scripts/utils/slug-utils.ts` 103-138 selects/truncates slugs and 148-188 handles collision fallback; `scripts/core/workflow.ts` 940-971 builds `preferredMemoryTask`.
---
FEATURE: 12-generation-time-duplicate-and-empty-content-prevention.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Exact duplicate handling is not always a thrown error; `writeFilesAtomically()` treats idempotent duplicates as skips instead of always throwing.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: scripts/core/file-writer.ts
UNDOCUMENTED_CAPABILITIES: The empty/duplicate gates run inside `writeFilesAtomically()` after `validateNoLeakedPlaceholders()`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `file-writer.ts` 46-60 validates substance, 65-91 checks duplicates, and 94-110 performs the gated atomic write/skip behavior.
---
FEATURE: 13-entity-normalization-consolidation.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/entity-linker.ts
UNDOCUMENTED_CAPABILITIES: `entity-extractor.ts` re-exports the consolidated normalization and edge-density helpers for downstream callers.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `entity-extractor.ts` 8-14 re-exports linker helpers; `entity-linker.ts` 66-71 and 214-242 holds the unified normalization and density logic.
---
FEATURE: 14-quality-gate-timer-persistence.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `save-quality-gate.ts` 141-188 persists the activation timestamp and 235-289 lazy-loads/resets it.
---
FEATURE: 15-deferred-lexical-only-indexing.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/providers/retry-manager.ts; mcp_server/lib/storage/index-refresh.ts
UNDOCUMENTED_CAPABILITIES: Retry processing prioritizes `pending` rows before `retry`, normalizes content before re-embedding, and uses a provider circuit breaker.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `vector-index-mutations.ts` 164-218 writes deferred rows; `retry-manager.ts` 105-121, 154-190, and 239-340 handles queueing/retry; `index-refresh.ts` 58-136 reports pending/retry state.
---
FEATURE: 16-dry-run-preflight-for-memory-save.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: `dryRun` does not run the full save pipeline or compute a quality-score breakdown; it runs `runPreflight()` only and returns preflight errors, warnings, and details.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: The dry-run response exits before save/index work and only returns `validation.errors`, `validation.warnings`, and `validation.details`.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `memory-save.ts` 287-349 branches on `dryRun`; `preflight.ts` 593-727 is the only executed validation path.
---
FEATURE: 01-4-stage-pipeline-refactor.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Stage 3 also runs MMR diversity pruning behind `SPECKIT_MMR` before chunk collapse.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative sample + core files checked. `stage3-rerank.ts` 11-14 and 137-193 shows cross-encoder + MMR + chunk collapse; `stage4-filter.ts` 321-334 enforces the final invariant/metadata.
---
FEATURE: 02-mpab-chunk-to-memory-aggregation.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Live Stage 3 does not use the documented MPAB formula. The current pipeline collapses chunk hits by parent, keeps the best chunk as the score carrier, and reassembles parent content from the DB.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts
UNDOCUMENTED_CAPABILITIES: Actual Stage 3 parent reassembly uses DB lookups and a best-chunk fallback with `contentSource` provenance.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `mpab-aggregation.ts` 58-121 defines the unused formula; `stage3-rerank.ts` 394-470 and 519-575 implements the live parent-reassembly path instead.
---
FEATURE: 03-chunk-ordering-preservation.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts
UNDOCUMENTED_CAPABILITIES: Reassembled parent rows clear chunk-specific fields and the merged result set is re-sorted by effective score after reassembly.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `stage3-rerank.ts` 451-470 sorts chunk groups by `chunk_index` and re-sorts merged parents; 546-564 clears chunk metadata on the parent row.
---
FEATURE: 04-template-anchor-optimization.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
UNDOCUMENTED_CAPABILITIES: Anchor parsing supports nested anchors and silently ignores malformed unmatched tags.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `anchor-metadata.ts` 88-144 implements nested-stack parsing and malformed-tag tolerance; `stage2-fusion.ts` 672-681 wires it into Stage 2.
---
FEATURE: 05-validation-signals-as-retrieval-metadata.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
UNDOCUMENTED_CAPABILITIES: Validation extraction prefers `precomputedContent` for reassembled parents and infers checklist presence from `file_path`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `validation-metadata.ts` 173-248 extracts the signals; `stage2-fusion.ts` 683-691 enriches rows and applies the bounded multiplier.
---
FEATURE: 06-learned-relevance-feedback.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Learning is not triggered by `queryId` alone; runtime also requires `queryTerms` and `resultRank`. “Sprint gate review” is not enforced in code as a runtime safeguard.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/checkpoints.ts; mcp_server/lib/search/pipeline/stage2-fusion.ts
UNDOCUMENTED_CAPABILITIES: Learned-trigger rows are protected by a partial index and are applied as additive boosts capped at 1.0 in Stage 2.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `checkpoints.ts` 374-394 only calls `recordSelection()` when `queryTerms` and `resultRank` are present; `learned-feedback.ts` 397-480 implements shadow-mode/query logic; `stage2-fusion.ts` 350-389 applies the boost.
---
FEATURE: 07-search-pipeline-safety.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample + core files checked. `stage1-candidate-gen.ts` 529-544 applies the summary quality filter; `bm25-index.ts` 311-357 and `sqlite-fts.ts` 8 and 70 share `sanitizeQueryTokens()`; `channel-representation.ts` 7-12 lowers `QUALITY_FLOOR` to 0.005.
---
FEATURE: 08-performance-improvements.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The source table points to cache modules that do not implement the documented changes. One listed optimization is also stale: causal-edge upsert still performs a post-upsert SELECT instead of replacing it with `last_insert_rowid()`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/tfidf-summarizer.ts; mcp_server/lib/search/memory-summaries.ts; mcp_server/lib/storage/mutation-ledger.ts; mcp_server/lib/search/entity-linker.ts; mcp_server/lib/storage/causal-edges.ts; mcp_server/lib/search/spec-folder-hierarchy.ts
UNDOCUMENTED_CAPABILITIES: The hierarchy cache is keyed by DB instance and supports explicit invalidation, not just blind TTL reuse.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `tfidf-summarizer.ts` 151 uses `reduce`; `memory-summaries.ts` 168-173 adds `LIMIT`; `mutation-ledger.ts` 286-311 uses `COUNT(*)`+`json_extract`; `causal-edges.ts` 177-190 still does a follow-up `SELECT id`; `spec-folder-hierarchy.ts` 20-29 and 69-111 implements the WeakMap cache.
---
FEATURE: 09-activation-window-persistence.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/validation/save-quality-gate.ts; mcp_server/tests/save-quality-gate.vitest.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `save-quality-gate.ts` 235-289 lazy-loads/persists the activation timestamp via `ensureActivationTimestampInitialized()`.
---
FEATURE: 10-legacy-v1-pipeline-removal.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Multiple supposedly deleted helpers still exist in the live pipeline modules: `MAX_DEEP_QUERY_VARIANTS`, `buildDeepQueryVariants()`, `STATE_PRIORITY`, `filterByMemoryState()`, `applyCrossEncoderReranking()`, `strengthenOnAccess()`, `applyTestingEffect()`, and `applyIntentWeightsToResults()`.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts; mcp_server/lib/search/pipeline/stage2-fusion.ts; mcp_server/lib/search/pipeline/stage3-rerank.ts; mcp_server/lib/search/pipeline/stage4-filter.ts; mcp_server/lib/search/vector-index-queries.ts
UNDOCUMENTED_CAPABILITIES: Orphaned-chunk detection and optional cleanup were added to `verify_integrity()`.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: Representative sample + core files checked. `search-flags.ts` 96-103 hardwires V2 on; `stage1-candidate-gen.ts` 45 and 114 still has `MAX_DEEP_QUERY_VARIANTS`/`buildDeepQueryVariants`; `stage4-filter.ts` 349-352 still exports `STATE_PRIORITY`; `vector-index-queries.ts` 1266-1378 adds orphan cleanup.
---
FEATURE: 11-pipeline-and-mutation-hardening.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tool-schemas.ts; mcp_server/schemas/tool-input-schemas.ts; mcp_server/lib/search/pipeline/stage1-candidate-gen.ts; mcp_server/lib/search/pipeline/stage4-filter.ts; mcp_server/lib/search/bm25-index.ts; mcp_server/handlers/memory-crud-update.ts; mcp_server/lib/search/vector-index-mutations.ts; mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `tool-schemas.ts` 138-152 exposes the schema params; `stage4-filter.ts` 332-334 removes `sessionDeduped` and passes `constitutionalInjected`; `memory-crud-update.ts` 91-96 embeds title+content; `vector-index-mutations.ts` 365-392 cleans ancillary tables/BM25; `memory-save.ts` 358-364 uses the real preflight error code.
---
FEATURE: 12-dbpath-extraction-and-import-standardization.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Import standardization is incomplete in the current tree; scripts still use relative cross-boundary imports such as `../../mcp_server/api`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: scripts/memory/cleanup-orphaned-vectors.ts; scripts/spec-folder/folder-detector.ts; scripts/core/memory-indexer.ts; scripts/tsconfig.json
UNDOCUMENTED_CAPABILITIES: Shared config also centralizes `DB_UPDATED_FILE` resolution, not just `DB_PATH`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `shared/config.ts` 9-42 adds `getDbDir()` and `DB_UPDATED_FILE`; `shared/paths.ts` 7-14 exports `DB_PATH`; `cleanup-orphaned-vectors.ts` 11 imports `@spec-kit/shared/paths`; `run-bm25-baseline.ts` 21-26 and `run-ablation.ts` 20-25 still use relative `../../mcp_server/api`.
---
FEATURE: 13-strict-zod-schema-validation.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tool-schemas.ts; mcp_server/tools/context-tools.ts; mcp_server/tools/memory-tools.ts; mcp_server/tools/lifecycle-tools.ts; mcp_server/tools/checkpoint-tools.ts; mcp_server/tools/causal-tools.ts
UNDOCUMENTED_CAPABILITIES: The schema layer also adds safe numeric preprocessing, path-traversal rejection, allowed-parameter whitelists, and stderr audit logging for rejected args.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `tool-input-schemas.ts` 13-39 defines strict/path-safe helpers; 322-381 registers 28 tool schemas; 446-463 validates and logs schema failures.
---
FEATURE: 14-dynamic-server-instructions-at-mcp-initialization.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Instructions are computed once at startup, include a stale-memory warning only when stale count exceeds 10, and are not refreshed until restart.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative sample + core files checked. `context-server.ts` 179-206 reuses `handleMemoryStats()`, 214-236 builds the instruction string, and 985-991 calls `server.setInstructions()`.
---
FEATURE: 15-warm-server-daemon-mode.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Even without HTTP daemon mode, the stdio server already supports eager/lazy embedding warmup, startup scans, and background retry jobs.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative sample + core files checked. `context-server.ts` 738-781 handles eager/lazy warmup, 901-903 starts the retry manager, and 997-1002 starts stdio transport; `cli.ts` 352-369 exposes `--eager-warmup`.
---
FEATURE: 16-backend-storage-adapter-abstraction.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Vector-store abstraction is not deferred: `IVectorStore` already exists in shared types and as a JS abstract base class, and `SQLiteVectorStore` already implements it. Only graph/document-store abstractions are absent.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: shared/types.ts; mcp_server/lib/search/vector-index-store.ts; mcp_server/tests/interfaces.vitest.ts
UNDOCUMENTED_CAPABILITIES: The current implementation supports both TypeScript interface use and JS runtime subclassing for vector-store backends.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `shared/types.ts` 242-250 defines `IVectorStore`; `vector-store.ts` 12-49 provides the JS abstract base; `vector-index-store.ts` 648-678 implements `SQLiteVectorStore`.
---
FEATURE: 17-cross-process-db-hot-rebinding.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: shared/config.ts
UNDOCUMENTED_CAPABILITIES: `db-state.ts` also persists `last_index_scan` in the config table and resets cached config-table state when DB handles change.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `db-state.ts` 103-153 performs rebind/mutex logic; 158-202 persists scan times; `shared/config.ts` 35-46 resolves `DB_UPDATED_FILE`.
---
FEATURE: 18-atomic-write-then-index-api.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The current API is not a single file+DB atomic unit. `executeAtomicSave()` only wraps file write/rename, and `atomicSaveMemory()` performs indexing asynchronously afterward. Rename failure after DB-side work is explicitly reported as partial state via `dbCommitted`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Startup recovery depends on leftover `_pending` files rather than true cross-resource transactions.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `transaction-manager.ts` 189-246 documents file-only atomicity and `dbCommitted`; `memory-save.ts` 392-432 explicitly says “NOT truly atomic” and indexes after the write succeeds.
---
FEATURE: 19-embedding-retry-orchestrator.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The retry manager does not coordinate with `index-refresh` in code; it inserts `vec_memories` directly. `index-refresh.ts` is a status/reporting helper and `ensureIndexFresh()` is still a stub.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-save.ts; mcp_server/handlers/memory-index.ts; mcp_server/handlers/save/response-builder.ts; mcp_server/lib/search/vector-index-mutations.ts
UNDOCUMENTED_CAPABILITIES: Retry work normalizes content before embedding, prioritizes `pending` before `retry`, and uses a provider circuit breaker.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `retry-manager.ts` 105-121 defines the circuit breaker, 154-190 queues pending/retry rows, and 239-340 writes `vec_memories`; `index-refresh.ts` 196-203 shows `ensureIndexFresh()` is a stub.
---
FEATURE: 20-7-layer-tool-architecture-metadata.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The layer metadata is not used by a query classifier to route tool subsets. Actual usage is `getRecommendedLayers()` in `memory_context` plus token-budget enforcement in `context-server`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/context-server.ts; mcp_server/tool-schemas.ts
UNDOCUMENTED_CAPABILITIES: The module also generates `[L#:Name]` tool-description prefixes and human-readable layer documentation.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `layer-definitions.ts` 145-158 builds prefixes and 201-219 returns recommendations; `memory-context.ts` 460-468 and 595-603 uses layer info; `context-server.ts` 349-358 enforces token budgets.
---
FEATURE: 21-atomic-pending-file-recovery.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Recovery does not check the database before renaming `_pending` files; it only compares file mtimes and then renames or deletes the pending file. “Ensures zero data loss” is therefore overstated.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: If the original file is newer than the pending file, recovery deletes the stale pending file instead of renaming it.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `transaction-manager.ts` 294-337 implements mtime-based pending-file recovery only; `context-server.ts` 445-458 runs that startup recovery pass.

tokens used
1,548,016
---
FEATURE: 01-query-complexity-router.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts; mcp_server/formatters/search-results.ts
UNDOCUMENTED_CAPABILITIES: The classifier also returns confidence and raw extracted features (`termCount`, `charCount`, `hasTriggerMatch`, `stopWordRatio`).
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `query-classifier.ts` 97-122 and 141-198 compute features/tiering; `hybrid-search.ts` 542-575 and 989-997 propagate `queryComplexity`; `search-results.ts` 261-287 formats it.
---
FEATURE: 02-relative-score-fusion-in-shadow-mode.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The code implements RSF as a pure fusion library, but it does not run “alongside RRF in shadow mode,” does not log live RSF/RRF comparisons, and does not compute Kendall tau in runtime. The claimed removed `isRsfEnabled()`/`hybrid-search.ts` branch is not reflected as a live runtime path.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts; mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts; mcp_server/tests/rsf-multi.vitest.ts
UNDOCUMENTED_CAPABILITIES: The actual module exposes three pure helpers: `fuseResultsRsf`, `fuseResultsRsfMulti`, and `fuseResultsRsfCrossVariant`, including score clamping and missing-source penalties.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `rsf-fusion.ts` 87-390 defines the three pure fusion functions; `hybrid-search.ts` only references RSF in comments around 123-124 and has no RSF execution path.
---
FEATURE: 03-channel-min-representation.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The description says promoted items are appended and then “the entire set is re-sorted by score”; the implementation appends promoted items and returns the enhanced list without re-sorting.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: Rows with `sources[]` count toward multiple channels during representation analysis.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `channel-representation.ts` 143-175 appends promotions to `enhancedTopK`; `hybrid-search.ts` 789-802 applies the feature and records promotion metadata.
---
FEATURE: 04-confidence-based-result-truncation.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: “A minimum of three results is guaranteed so the system never returns nothing” is overstated; after filtering non-finite scores, fewer than three rows can still remain.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: The truncation helper defensively sorts results before gap analysis.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `confidence-truncation.ts` 116-123 filters/sorts inputs and 158-209 applies the cliff cutoff; `hybrid-search.ts` 807-826 integrates the truncation metadata.
---
FEATURE: 05-dynamic-token-budget-allocation.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: `dynamic-token-budget.ts` is advisory-only and returns `{ budget, applied, queryType }`; contextual-header overhead is applied later in `hybrid-search.ts`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `dynamic-token-budget.ts` 5-9 and 77-97 define the advisory allocator; `hybrid-search.ts` 566-575 stores budget metadata and 957-964 subtracts header overhead.
---
FEATURE: 06-query-expansion.md
CATEGORY: 12--query-intelligence
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
UNDOCUMENTED_CAPABILITIES: Expansion mines terms from memory `content`, `title`, and `trigger_phrases`, and Stage 1 runs baseline and expanded searches in parallel with baseline-first dedup.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `embedding-expansion.ts` 223-235 mines fields and 293-297 gates activation; `stage1-candidate-gen.ts` 288-356 runs the parallel baseline/expanded merge.
---
FEATURE: 01-verify-fix-verify-memory-quality-loop.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The loop is implemented, but “Rejection rates are logged per spec folder” is unsupported; the eval snapshot logging does not persist per-spec-folder rejection metrics.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: The loop returns auto-fixed content for the caller to persist and degrades gracefully when disabled.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `quality-loop.ts` 304-333 auto-fixes content and 500-526 logs eval snapshots; `memory-save.ts` 122-158 invokes the loop during save.
---
FEATURE: 02-signal-vocabulary-expansion.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The description says the matcher moved from six categories to an eight-category vocabulary, but the code’s `SignalCategory` is only `correction | preference | neutral`.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Detected correction/preference signals actively boost trigger-match `importanceWeight` (+0.2 / +0.1).
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `trigger-matcher.ts` 8-17 defines the three-category type; 339-407 computes boosts and applies them to matches.
---
FEATURE: 03-pre-flight-token-budget-validation.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The description documents search-response truncation behavior, but the listed implementation is a `memory_save` preflight validator. `anchor-chunker.ts` is unrelated to the described response-budget logic.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/hybrid-search.ts
UNDOCUMENTED_CAPABILITIES: The referenced `preflight.ts` actually validates anchors, duplicates, and save-side token budgets for `memory_save`.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `preflight.ts` 593-727 runs save preflight; `hybrid-search.ts` 958-960 and 1583-1618 handle the described response-budget truncation/summarization.
---
FEATURE: 04-spec-folder-description-discovery.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The “all 281 existing spec folders” claim is stale and not represented in code; the current repo count is 280 and the implementation does not hardcode that number.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-context.ts; mcp_server/lib/search/search-flags.ts
UNDOCUMENTED_CAPABILITIES: Cache freshness checks include `description.json` mtimes and stale folder descriptions can be auto-repaired.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `folder-discovery.ts` 445-486 repairs per-folder descriptions and 635-691 validates/persists them; `memory-context.ts` 551-559 uses discovery before retrieval.
---
FEATURE: 05-pre-storage-quality-gate.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: The save handler distinguishes warn-only vs hard rejection and surfaces gate results in save responses.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `save-quality-gate.ts` 99-109 and 235-289 implement the layers and warn-only persistence; `memory-save.ts` 208-224 handles reject vs warn-only behavior.
---
FEATURE: 06-reconsolidation-on-save.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: Reconsolidation regenerates embedding/content-hash state on merge and the bridge can skip reconsolidation when checkpoint policy blocks it.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `reconsolidation.ts` 202-245 updates merged records and embedding metadata; `reconsolidation-bridge.ts` 44-52 and 53-183 gates execution; `memory-save.ts` 239-240 invokes the bridge.
---
FEATURE: 07-smarter-memory-content-generation.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/embedding-pipeline.ts; mcp_server/lib/search/bm25-index.ts
UNDOCUMENTED_CAPABILITIES: The normalizer also strips checkbox syntax and collapses whitespace before embedding/BM25 processing.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `content-normalizer.ts` 38-174 implements the transformations and 218-264 wires embedding/BM25 normalization; `embedding-pipeline.ts` 44-47 uses it before embedding generation.
---
FEATURE: 08-anchor-aware-chunk-thinning.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/chunking-orchestrator.ts
UNDOCUMENTED_CAPABILITIES: The thinning result includes retained/dropped chunk breakdown and scores, not just the final kept chunk list.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `chunk-thinning.ts` 118-153 returns detailed thinning stats; `chunking-orchestrator.ts` 130-139 integrates `thinChunks()`.
---
FEATURE: 09-encoding-intent-capture-at-index-time.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/chunking-orchestrator.ts; mcp_server/lib/search/vector-index-mutations.ts; mcp_server/lib/search/search-flags.ts
UNDOCUMENTED_CAPABILITIES: Both parent and child chunks are classified, and persistence stores `encoding_intent` with fallback metadata.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `encoding-intent.ts` 43-103 classifies content; `chunking-orchestrator.ts` 138-139 and 238-239 classifies parent/chunks; `vector-index-mutations.ts` 200-221 persists it.
---
FEATURE: 10-auto-entity-extraction.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/save/post-insert.ts; mcp_server/lib/extraction/entity-denylist.ts; mcp_server/lib/search/entity-linker.ts; mcp_server/lib/search/search-flags.ts
UNDOCUMENTED_CAPABILITIES: The save-time pipeline can immediately run cross-document entity linking and density-guard diagnostics after extraction.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `entity-extractor.ts` 34-88 and 135-240 implement extraction/storage; `post-insert.ts` 67-80 and 101-119 runs extraction then linking; `entity-linker.ts` 214-242 computes edge density.
---
FEATURE: 11-content-aware-memory-filename-generation.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/lib/parsing/slug-utils.ts
MISSING_PATHS: scripts/utils/slug-utils.ts; scripts/utils/task-enrichment.ts; scripts/core/workflow.ts
UNDOCUMENTED_CAPABILITIES: After 100 collision attempts, slug generation falls back to a deterministic SHA1 suffix.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `scripts/utils/slug-utils.ts` 103-138 selects/truncates slugs and 148-188 handles collision fallback; `scripts/core/workflow.ts` 940-971 builds `preferredMemoryTask`.
---
FEATURE: 12-generation-time-duplicate-and-empty-content-prevention.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Exact duplicate handling is not always a thrown error; `writeFilesAtomically()` treats idempotent duplicates as skips instead of always throwing.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: scripts/core/file-writer.ts
UNDOCUMENTED_CAPABILITIES: The empty/duplicate gates run inside `writeFilesAtomically()` after `validateNoLeakedPlaceholders()`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `file-writer.ts` 46-60 validates substance, 65-91 checks duplicates, and 94-110 performs the gated atomic write/skip behavior.
---
FEATURE: 13-entity-normalization-consolidation.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/entity-linker.ts
UNDOCUMENTED_CAPABILITIES: `entity-extractor.ts` re-exports the consolidated normalization and edge-density helpers for downstream callers.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `entity-extractor.ts` 8-14 re-exports linker helpers; `entity-linker.ts` 66-71 and 214-242 holds the unified normalization and density logic.
---
FEATURE: 14-quality-gate-timer-persistence.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `save-quality-gate.ts` 141-188 persists the activation timestamp and 235-289 lazy-loads/resets it.
---
FEATURE: 15-deferred-lexical-only-indexing.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/providers/retry-manager.ts; mcp_server/lib/storage/index-refresh.ts
UNDOCUMENTED_CAPABILITIES: Retry processing prioritizes `pending` rows before `retry`, normalizes content before re-embedding, and uses a provider circuit breaker.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `vector-index-mutations.ts` 164-218 writes deferred rows; `retry-manager.ts` 105-121, 154-190, and 239-340 handles queueing/retry; `index-refresh.ts` 58-136 reports pending/retry state.
---
FEATURE: 16-dry-run-preflight-for-memory-save.md
CATEGORY: 13--memory-quality-and-indexing
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: `dryRun` does not run the full save pipeline or compute a quality-score breakdown; it runs `runPreflight()` only and returns preflight errors, warnings, and details.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: The dry-run response exits before save/index work and only returns `validation.errors`, `validation.warnings`, and `validation.details`.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `memory-save.ts` 287-349 branches on `dryRun`; `preflight.ts` 593-727 is the only executed validation path.
---
FEATURE: 01-4-stage-pipeline-refactor.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Stage 3 also runs MMR diversity pruning behind `SPECKIT_MMR` before chunk collapse.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative sample + core files checked. `stage3-rerank.ts` 11-14 and 137-193 shows cross-encoder + MMR + chunk collapse; `stage4-filter.ts` 321-334 enforces the final invariant/metadata.
---
FEATURE: 02-mpab-chunk-to-memory-aggregation.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Live Stage 3 does not use the documented MPAB formula. The current pipeline collapses chunk hits by parent, keeps the best chunk as the score carrier, and reassembles parent content from the DB.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts
UNDOCUMENTED_CAPABILITIES: Actual Stage 3 parent reassembly uses DB lookups and a best-chunk fallback with `contentSource` provenance.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `mpab-aggregation.ts` 58-121 defines the unused formula; `stage3-rerank.ts` 394-470 and 519-575 implements the live parent-reassembly path instead.
---
FEATURE: 03-chunk-ordering-preservation.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage3-rerank.ts
UNDOCUMENTED_CAPABILITIES: Reassembled parent rows clear chunk-specific fields and the merged result set is re-sorted by effective score after reassembly.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `stage3-rerank.ts` 451-470 sorts chunk groups by `chunk_index` and re-sorts merged parents; 546-564 clears chunk metadata on the parent row.
---
FEATURE: 04-template-anchor-optimization.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
UNDOCUMENTED_CAPABILITIES: Anchor parsing supports nested anchors and silently ignores malformed unmatched tags.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `anchor-metadata.ts` 88-144 implements nested-stack parsing and malformed-tag tolerance; `stage2-fusion.ts` 672-681 wires it into Stage 2.
---
FEATURE: 05-validation-signals-as-retrieval-metadata.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/pipeline/stage2-fusion.ts
UNDOCUMENTED_CAPABILITIES: Validation extraction prefers `precomputedContent` for reassembled parents and infers checklist presence from `file_path`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `validation-metadata.ts` 173-248 extracts the signals; `stage2-fusion.ts` 683-691 enriches rows and applies the bounded multiplier.
---
FEATURE: 06-learned-relevance-feedback.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Learning is not triggered by `queryId` alone; runtime also requires `queryTerms` and `resultRank`. “Sprint gate review” is not enforced in code as a runtime safeguard.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/checkpoints.ts; mcp_server/lib/search/pipeline/stage2-fusion.ts
UNDOCUMENTED_CAPABILITIES: Learned-trigger rows are protected by a partial index and are applied as additive boosts capped at 1.0 in Stage 2.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `checkpoints.ts` 374-394 only calls `recordSelection()` when `queryTerms` and `resultRank` are present; `learned-feedback.ts` 397-480 implements shadow-mode/query logic; `stage2-fusion.ts` 350-389 applies the boost.
---
FEATURE: 07-search-pipeline-safety.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: Representative sample + core files checked. `stage1-candidate-gen.ts` 529-544 applies the summary quality filter; `bm25-index.ts` 311-357 and `sqlite-fts.ts` 8 and 70 share `sanitizeQueryTokens()`; `channel-representation.ts` 7-12 lowers `QUALITY_FLOOR` to 0.005.
---
FEATURE: 08-performance-improvements.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The source table points to cache modules that do not implement the documented changes. One listed optimization is also stale: causal-edge upsert still performs a post-upsert SELECT instead of replacing it with `last_insert_rowid()`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/search/tfidf-summarizer.ts; mcp_server/lib/search/memory-summaries.ts; mcp_server/lib/storage/mutation-ledger.ts; mcp_server/lib/search/entity-linker.ts; mcp_server/lib/storage/causal-edges.ts; mcp_server/lib/search/spec-folder-hierarchy.ts
UNDOCUMENTED_CAPABILITIES: The hierarchy cache is keyed by DB instance and supports explicit invalidation, not just blind TTL reuse.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `tfidf-summarizer.ts` 151 uses `reduce`; `memory-summaries.ts` 168-173 adds `LIMIT`; `mutation-ledger.ts` 286-311 uses `COUNT(*)`+`json_extract`; `causal-edges.ts` 177-190 still does a follow-up `SELECT id`; `spec-folder-hierarchy.ts` 20-29 and 69-111 implements the WeakMap cache.
---
FEATURE: 09-activation-window-persistence.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/lib/validation/save-quality-gate.ts; mcp_server/tests/save-quality-gate.vitest.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `save-quality-gate.ts` 235-289 lazy-loads/persists the activation timestamp via `ensureActivationTimestampInitialized()`.
---
FEATURE: 10-legacy-v1-pipeline-removal.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Multiple supposedly deleted helpers still exist in the live pipeline modules: `MAX_DEEP_QUERY_VARIANTS`, `buildDeepQueryVariants()`, `STATE_PRIORITY`, `filterByMemoryState()`, `applyCrossEncoderReranking()`, `strengthenOnAccess()`, `applyTestingEffect()`, and `applyIntentWeightsToResults()`.
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts; mcp_server/lib/search/pipeline/stage2-fusion.ts; mcp_server/lib/search/pipeline/stage3-rerank.ts; mcp_server/lib/search/pipeline/stage4-filter.ts; mcp_server/lib/search/vector-index-queries.ts
UNDOCUMENTED_CAPABILITIES: Orphaned-chunk detection and optional cleanup were added to `verify_integrity()`.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: Representative sample + core files checked. `search-flags.ts` 96-103 hardwires V2 on; `stage1-candidate-gen.ts` 45 and 114 still has `MAX_DEEP_QUERY_VARIANTS`/`buildDeepQueryVariants`; `stage4-filter.ts` 349-352 still exports `STATE_PRIORITY`; `vector-index-queries.ts` 1266-1378 adds orphan cleanup.
---
FEATURE: 11-pipeline-and-mutation-hardening.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tool-schemas.ts; mcp_server/schemas/tool-input-schemas.ts; mcp_server/lib/search/pipeline/stage1-candidate-gen.ts; mcp_server/lib/search/pipeline/stage4-filter.ts; mcp_server/lib/search/bm25-index.ts; mcp_server/handlers/memory-crud-update.ts; mcp_server/lib/search/vector-index-mutations.ts; mcp_server/handlers/memory-save.ts
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: `tool-schemas.ts` 138-152 exposes the schema params; `stage4-filter.ts` 332-334 removes `sessionDeduped` and passes `constitutionalInjected`; `memory-crud-update.ts` 91-96 embeds title+content; `vector-index-mutations.ts` 365-392 cleans ancillary tables/BM25; `memory-save.ts` 358-364 uses the real preflight error code.
---
FEATURE: 12-dbpath-extraction-and-import-standardization.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Import standardization is incomplete in the current tree; scripts still use relative cross-boundary imports such as `../../mcp_server/api`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: scripts/memory/cleanup-orphaned-vectors.ts; scripts/spec-folder/folder-detector.ts; scripts/core/memory-indexer.ts; scripts/tsconfig.json
UNDOCUMENTED_CAPABILITIES: Shared config also centralizes `DB_UPDATED_FILE` resolution, not just `DB_PATH`.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `shared/config.ts` 9-42 adds `getDbDir()` and `DB_UPDATED_FILE`; `shared/paths.ts` 7-14 exports `DB_PATH`; `cleanup-orphaned-vectors.ts` 11 imports `@spec-kit/shared/paths`; `run-bm25-baseline.ts` 21-26 and `run-ablation.ts` 20-25 still use relative `../../mcp_server/api`.
---
FEATURE: 13-strict-zod-schema-validation.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/tool-schemas.ts; mcp_server/tools/context-tools.ts; mcp_server/tools/memory-tools.ts; mcp_server/tools/lifecycle-tools.ts; mcp_server/tools/checkpoint-tools.ts; mcp_server/tools/causal-tools.ts
UNDOCUMENTED_CAPABILITIES: The schema layer also adds safe numeric preprocessing, path-traversal rejection, allowed-parameter whitelists, and stderr audit logging for rejected args.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `tool-input-schemas.ts` 13-39 defines strict/path-safe helpers; 322-381 registers 28 tool schemas; 446-463 validates and logs schema failures.
---
FEATURE: 14-dynamic-server-instructions-at-mcp-initialization.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Instructions are computed once at startup, include a stale-memory warning only when stale count exceeds 10, and are not refreshed until restart.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative sample + core files checked. `context-server.ts` 179-206 reuses `handleMemoryStats()`, 214-236 builds the instruction string, and 985-991 calls `server.setInstructions()`.
---
FEATURE: 15-warm-server-daemon-mode.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: NO
INVALID_PATHS: mcp_server/tests/retry.vitest.ts
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Even without HTTP daemon mode, the stdio server already supports eager/lazy embedding warmup, startup scans, and background retry jobs.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: Representative sample + core files checked. `context-server.ts` 738-781 handles eager/lazy warmup, 901-903 starts the retry manager, and 997-1002 starts stdio transport; `cli.ts` 352-369 exposes `--eager-warmup`.
---
FEATURE: 16-backend-storage-adapter-abstraction.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Vector-store abstraction is not deferred: `IVectorStore` already exists in shared types and as a JS abstract base class, and `SQLiteVectorStore` already implements it. Only graph/document-store abstractions are absent.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: shared/types.ts; mcp_server/lib/search/vector-index-store.ts; mcp_server/tests/interfaces.vitest.ts
UNDOCUMENTED_CAPABILITIES: The current implementation supports both TypeScript interface use and JS runtime subclassing for vector-store backends.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `shared/types.ts` 242-250 defines `IVectorStore`; `vector-store.ts` 12-49 provides the JS abstract base; `vector-index-store.ts` 648-678 implements `SQLiteVectorStore`.
---
FEATURE: 17-cross-process-db-hot-rebinding.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: shared/config.ts
UNDOCUMENTED_CAPABILITIES: `db-state.ts` also persists `last_index_scan` in the config table and resets cached config-table state when DB handles change.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `db-state.ts` 103-153 performs rebind/mutex logic; 158-202 persists scan times; `shared/config.ts` 35-46 resolves `DB_UPDATED_FILE`.
---
FEATURE: 18-atomic-write-then-index-api.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The current API is not a single file+DB atomic unit. `executeAtomicSave()` only wraps file write/rename, and `atomicSaveMemory()` performs indexing asynchronously afterward. Rename failure after DB-side work is explicitly reported as partial state via `dbCommitted`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Startup recovery depends on leftover `_pending` files rather than true cross-resource transactions.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `transaction-manager.ts` 189-246 documents file-only atomicity and `dbCommitted`; `memory-save.ts` 392-432 explicitly says “NOT truly atomic” and indexes after the write succeeds.
---
FEATURE: 19-embedding-retry-orchestrator.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The retry manager does not coordinate with `index-refresh` in code; it inserts `vec_memories` directly. `index-refresh.ts` is a status/reporting helper and `ensureIndexFresh()` is still a stub.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/handlers/memory-save.ts; mcp_server/handlers/memory-index.ts; mcp_server/handlers/save/response-builder.ts; mcp_server/lib/search/vector-index-mutations.ts
UNDOCUMENTED_CAPABILITIES: Retry work normalizes content before embedding, prioritizes `pending` before `retry`, and uses a provider circuit breaker.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `retry-manager.ts` 105-121 defines the circuit breaker, 154-190 queues pending/retry rows, and 239-340 writes `vec_memories`; `index-refresh.ts` 196-203 shows `ensureIndexFresh()` is a stub.
---
FEATURE: 20-7-layer-tool-architecture-metadata.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The layer metadata is not used by a query classifier to route tool subsets. Actual usage is `getRecommendedLayers()` in `memory_context` plus token-budget enforcement in `context-server`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: mcp_server/context-server.ts; mcp_server/tool-schemas.ts
UNDOCUMENTED_CAPABILITIES: The module also generates `[L#:Name]` tool-description prefixes and human-readable layer documentation.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: `layer-definitions.ts` 145-158 builds prefixes and 201-219 returns recommendations; `memory-context.ts` 460-468 and 595-603 uses layer info; `context-server.ts` 349-358 enforces token budgets.
---
FEATURE: 21-atomic-pending-file-recovery.md
CATEGORY: 14--pipeline-architecture
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: Recovery does not check the database before renaming `_pending` files; it only compares file mtimes and then renames or deletes the pending file. “Ensures zero data loss” is therefore overstated.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: If the original file is newer than the pending file, recovery deletes the stale pending file instead of renaming it.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: `transaction-manager.ts` 294-337 implements mtime-based pending-file recovery only; `context-server.ts` 445-458 runs that startup recovery pass.
