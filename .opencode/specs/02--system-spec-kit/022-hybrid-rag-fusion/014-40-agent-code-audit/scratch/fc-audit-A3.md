OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cd69c-b933-7961-8362-0041a5fd3c4a
--------
user
You are a feature catalog auditor. Your job is to verify that feature documentation matches the actual source code of a TypeScript MCP server. You are auditing 42 feature files across 3 categories. Many of these are small files (~30 lines each).

TASK: For each feature file, perform three checks:
1. ERRORS: Compare the 'Current Reality' description against the actual source code. Flag any claims that are wrong, outdated, or misleading.
2. MISSING PATHS: Verify every file path in the 'Source Files' tables exists on disk.
3. MISSING FEATURES: Look at what the referenced source files actually do. Flag any significant capabilities NOT documented in the feature description.

PRIOR AUDIT CONTEXT (2026-03-08, 30-agent audit):
- Category 09-eval-measurement: 0 passes, 14 issues (1 rewrite: 14-cross-ai-validation-fixes, 8 desc+paths, 5 paths).
- Category 10-graph-signal: 0 passes, 11 issues (1 rewrite: 08-graph-cognitive-fixes, 4 desc+paths, 4 paths, 2 desc).
- Category 11-scoring-calibration: 0 passes, 17 issues (2 rewrites: 07-double-intent-weighting, 17-temporal-structural-coherence, 5 desc+paths, 8 paths, 2 desc).
- Known batch-fixable: retry.vitest.ts should be retry-manager.vitest.ts.

YOUR ASSIGNED DIRECTORIES (42 files total):
- .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/ (14 files)
- .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/ (11 files)
- .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/ (17 files)

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
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m auditing those 42 feature files directly against the TypeScript MCP server code and I’ll start by inventorying the feature docs plus the referenced source paths so we can compare the descriptions methodically.
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Audit 42 feature catalog markdown files against TypeScript MCP server source code, verify source file paths exist, and report documentation inaccuracies and undocumented capabilities" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 614ms:
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
SKILL ROUTING: `sk-code--review` was recommended with 0.95 confidence. User specified: “verify that feature documentation matches the actual source code,” so I’m loading the review guidance and the feature file inventory next.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration -g '*.md' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/05-quality-proxy-formula.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/06-synthetic-ground-truth-corpus.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/03-edge-density-measurement.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md
.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/06-causal-depth-signal.md
codex
I’ve got the full feature list and I’m pulling the OpenCode-specific review overlay so the audit criteria stay aligned with this repo’s conventions while I inspect each category sequentially.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
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

Plan update
Non-editing audit across 42 feature docs. I’ll inventory the markdown files, extract referenced paths, inspect the key implementation files for each feature, and then synthesize a structured findings block per feature.
  → Inventory all 42 feature markdown files and extract their referenced implementation/test paths
  • Inspect the cited source files category by category to validate descriptions and identify undocumented behavior
  • Assemble the final audit report with one structured block per feature
codex
I’ve confirmed the review overlay and I’m sampling the feature file structure first so I can extract the right fields consistently before I work through all 42 files.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Evaluation database and schema

## Current Reality

A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows; `memory_match_triggers` emits query/final-result rows.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |

### Tests

| File | Focus |
|------|-------|
 succeeded in 52ms:
# Score normalization

## Current Reality

The RRF fusion system and composite scoring system had a 15:1 magnitude mismatch. RRF scores fell in the 0-0.07 range while composite scores covered the full 0-1 range. Composite dominated purely because of scale, not because it was better.

Min-max normalization now maps both outputs to a 0-1 range, letting actual relevance determine ranking instead of which scoring system happens to produce larger numbers. Single-result queries and equal-score edge cases normalize to 1.0.

The normalization is batch-relative (the same memory can score differently across different queries), which is expected behavior for min-max. Runs behind the `SPECKIT_SCORE_NORMALIZATION` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
 succeeded in 52ms:
# Typed-weighted degree channel

## Current Reality

A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone.

Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. When a memory has zero edges, the channel returns 0 rather than failing.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/graph-flags.ts` | Lib | Graph feature flags |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path
print(\"ok\")
print(len(list(Path(\".opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement\").glob(\"*.md\"))))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 617ms:
ok
14
codex
I’ve verified the feature files use a consistent schema. Next I’m extracting every documented implementation/test path and checking which ones exist so the source-validation pass has a clean baseline.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path
import re
bases=[Path(\".opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement\"),Path(\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation\"),Path(\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration\")]
for base in bases:
    print(f\"## {base.name}\")
    for path in sorted(base.glob(\"*.md\")):
        text=path.read_text()
        title=re.search(r\""'^# (.+)$", text, re.M).group(1)
        current=re.search(r"## Current Reality'"\\n\\n(.*?)\\n\\n## Source Files\", text, re.S).group(1).strip().replace(\"\\n\", \" \")
        rows=re.findall(r\"\\| "'`([''^`]+)` '"\\|\", text)
        impl=[]; tests=[]; section=None
        for line in text.splitlines():
            if line.strip()==\"### Implementation\": section=\"impl\"; continue
            if line.strip()==\"### Tests\": section=\"test\"; continue
            m=re.match(r\"\\| "'`([''^`]+)` '"\\|\", line)
            if m:
                (impl if section==\"impl\" else tests).append(m.group(1))
        print(path.name)
        print(f\"  title: {title}\")
        print(f\"  impl_count: {len(impl)} test_count: {len(tests)}\")
        print(f\"  first_impl: {impl[:3]}\")
        print(f\"  first_tests: {tests[:3]}\")
        invalid=[p for p in impl+tests if not Path(\".opencode/skill/system-spec-kit\").joinpath(p).is_file()]
        print(f\"  invalid: {invalid if invalid else '[]'}\")
    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
zsh:1: no matches found: from pathlib import Path\nimport re\nbases=[Path(".opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement"),Path(".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation"),Path(".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration")]\nfor base in bases:\n    print(f"## {base.name}")\n    for path in sorted(base.glob("*.md")):\n        text=path.read_text()\n        title=re.search(r"^# (.+)$", text, re.M).group(1)\n        current=re.search(r"## Current Reality\n\n(.*?)\n\n## Source Files", text, re.S).group(1).strip().replace("\n", " ")\n        rows=re.findall(r"\| `([^`]+)` \|", text)\n        impl=[]; tests=[]; section=None\n        for line in text.splitlines():\n            if line.strip()=="### Implementation": section="impl"; continue\n            if line.strip()=="### Tests": section="test"; continue\n            m=re.match(r"\| `([^`]+)` \|", line)\n            if m:\n                (impl if section=="impl" else tests).append(m.group(1))\n        print(path.name)\n        print(f"  title: {title}")\n        print(f"  impl_count: {len(impl)} test_count: {len(tests)}")\n        print(f"  first_impl: {impl[:3]}")\n        print(f"  first_tests: {tests[:3]}")\n        invalid=[p for p in impl+tests if not Path(".opencode/skill/system-spec-kit").joinpath(p).is_file()]\n        print(f"  invalid: {invalid if invalid else []}")\n    print()
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path
import re
bases=[Path('.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement'),Path('.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation'),Path('.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration')]
for base in bases:
    print(f'## {base.name}')
    for path in sorted(base.glob('*.md')):
        text=path.read_text()
        title=re.search(r'"'^# (.+)$'"', text, re.M).group(1)
        impl=[]; tests=[]; section=None
        for line in text.splitlines():
            if line.strip()=='### Implementation':
                section='impl'; continue
            if line.strip()=='### Tests':
                section='test'; continue
            m=re.match(r'\\| "'`([''^`]+)` '"\\|', line)
            if m:
                (impl if section=='impl' else tests).append(m.group(1))
        invalid=[p for p in impl+tests if not Path('.opencode/skill/system-spec-kit').joinpath(p).is_file()]
        print(path.name)
        print(f'  title: {title}')
        print(f'  impl_count: {len(impl)} test_count: {len(tests)}')
        print(f'  first_impl: {impl[:3]}')
        print(f'  first_tests: {tests[:3]}')
        print(f'  invalid: {invalid if invalid else []}')
    print()\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 53ms:
zsh:25: unmatched "
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path
import re
bases=[Path(\".opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement\"),Path(\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation\"),Path(\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration\")]
for base in bases:
    print(f\"## {base.name}\")
    for path in sorted(base.glob(\"*.md\")):
        text=path.read_text()
        title=re.search(r\""'^# (.+)$", text, re.M).group(1)
        impl=[]; tests=[]; section=None
        for line in text.splitlines():
            if line.strip()=="### Implementation":
                section="impl"; continue
            if line.strip()=="### Tests":
                section="test"; continue
            m=re.match(r"'"\\| "'`([''^`]+)` '"\\|\", line)
            if m:
                (impl if section==\"impl\" else tests).append(m.group(1))
        invalid=[p for p in impl+tests if not Path(\".opencode/skill/system-spec-kit\").joinpath(p).is_file()]
        print(path.name)
        print(f\"  title: {title}\")
        print(f\"  impl_count: {len(impl)} test_count: {len(tests)}\")
        print(f\"  first_impl: {impl[:3]}\")
        print(f\"  first_tests: {tests[:3]}\")
        print(f\"  invalid: {invalid if invalid else []}\")
    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 624ms:
## 09--evaluation-and-measurement
01-evaluation-database-and-schema.md
  title: Evaluation database and schema
  impl_count: 1 test_count: 1
  first_impl: ['mcp_server/lib/eval/eval-db.ts']
  first_tests: ['mcp_server/tests/eval-db.vitest.ts']
  invalid: []
02-core-metric-computation.md
  title: Core metric computation
  impl_count: 1 test_count: 1
  first_impl: ['mcp_server/lib/eval/eval-metrics.ts']
  first_tests: ['mcp_server/tests/eval-metrics.vitest.ts']
  invalid: []
03-observer-effect-mitigation.md
  title: Observer effect mitigation
  impl_count: 2 test_count: 3
  first_impl: ['mcp_server/lib/eval/eval-db.ts', 'mcp_server/lib/eval/shadow-scoring.ts']
  first_tests: ['mcp_server/tests/eval-db.vitest.ts', 'mcp_server/tests/scoring.vitest.ts', 'mcp_server/tests/shadow-scoring.vitest.ts']
  invalid: []
04-full-context-ceiling-evaluation.md
codex
I’ve finished the path baseline. I’m moving into the code-comparison pass now, starting with category 09 so I can validate each “Current Reality” statement against the actual eval modules before I synthesize the findings.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path
import re
base=Path(\".opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement\")
for path in sorted(base.glob(\"*.md\")):
    text=path.read_text()
    current=re.search(r\"## Current Reality\\n\\n(.*?)\\n\\n## Source Files\", text, re.S).group(1).strip()
    print(f\"=== {path.name} ===\")
    print(current)
    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 620ms:
=== 01-evaluation-database-and-schema.md ===
A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.

Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows; `memory_match_triggers` emits query/final-result rows.

=== 02-core-metric-computation.md ===
Eleven metrics run against logged retrieval data. The four primary ones are MRR@5 (how high does the right answer rank?), NDCG@10 (are results ordered well?), Recall@20 (do we find everything relevant?) and Hit Rate@1 (is the top result correct?).

Seven diagnostic metrics add depth: inversion rate counts pairwise ranking mistakes, constitutional surfacing rate tracks whether high-priority memories appear in top results, importance-weighted recall favors recall of critical content, cold-start detection rate measures whether fresh memories surface when relevant, precision@K and F1@K expose precision/recall balance, and intent-weighted NDCG adjusts ranking quality by query type.

This battery of metrics means you can diagnose where the pipeline fails, not just whether it fails.

=== 03-observer-effect-mitigation.md ===
Measurement infrastructure should not degrade the system it measures. A health check compares search p95 latency with eval logging enabled versus disabled and fires an alert when overhead exceeds 10%. In practice, measured overhead stays within the 5ms p95 budget. If the eval database becomes unavailable (disk full, file lock, corruption), search continues normally with logging silently disabled. The system never blocks a user query to record an evaluation metric.

=== 04-full-context-ceiling-evaluation.md ===
How good could retrieval be if the system had perfect recall? To answer that, an LLM receives all memory titles and summaries and ranks them for each ground truth query. The resulting MRR@5 score is the theoretical upper bound. The gap between this ceiling and actual hybrid performance tells you how much room for improvement exists. A 2x2 matrix alongside the BM25 baseline puts both numbers in context: the BM25 floor shows the minimum, the LLM ceiling shows the maximum, and the hybrid pipeline sits somewhere between.

=== 05-quality-proxy-formula.md ===
Manual evaluation does not scale. You cannot hand-review every query across every sprint.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Eval Metrics
     3	// ---------------------------------------------------------------
     4	// T006a-e: Pure computation functions for 11 evaluation metrics
     5	// (6 core + 5 diagnostic). No DB access, no side effects.
     6	// ---------------------------------------------------------------
     7	
     8	/* ---------------------------------------------------------------
     9	   1. TYPES
    10	--------------------------------------------------------------- */
    11	
    12	/** A single retrieved result from a search query. */
    13	export interface EvalResult {
    14	  /** Unique memory identifier. */
    15	  memoryId: number;
    16	  /** Retrieval score assigned by the search system. */
    17	  score: number;
    18	  /** 1-based rank position in the result list. */
    19	  rank: number;
    20	}
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Shadow Scoring
     3	// ---------------------------------------------------------------
     4	// AI-GUARD: 
     5	// Runs a parallel scoring path alongside production results WITHOUT affecting
     6	// production output. Logs both production and shadow scores for A/B comparison.
     7	//
     8	// Features:
     9	// - Run alternative scoring algorithms in shadow mode
    10	// - Compare shadow vs production results
    11	// - Log comparison data to eval database
    12	// - Channel attribution per result
    13	// - Exclusive Contribution Rate metric
    14	//
    15	// CRITICAL: Shadow scoring must NEVER affect production search results.
    16	// Every public function is wrapped in try-catch. The shadow write path
    17	// (runShadowScoring, logShadowComparison) was permanently disabled in Sprint 7.
    18	// ---------------------------------------------------------------
    19	
    20	import { initEvalDb, getEvalDb } from './eval-db';
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   260	 *
   261	 * @deprecated Shadow scoring was permanently disabled in Sprint 7. This
   262	 * comparison function still works but has no production callers. Retained
   263	 * for interface compatibility. Use channel-attribution.ts instead.
   264	 *
   265	 * @param query - The original search query.
   266	 * @param production - Production scored results.
   267	 * @param shadow - Shadow scored results.
   268	 * @param algorithmName - Name of the shadow algorithm.
   269	 * @param metadata - Optional metadata.
   270	 * @returns ShadowComparison with deltas and summary statistics.
   271	 */
   272	export function compareShadowResults(
   273	  query: string,
   274	  production: ScoredResult[],
   275	  shadow: ScoredResult[],
   276	  algorithmName: string,
   277	  metadata?: Record<string, unknown>,
   278	): ShadowComparison {
   279	  const prodMap = buildResultMap(production);
 succeeded in 51ms:
   260	  k: number = 20,
   261	): number {
   262	  if (results.length === 0 || groundTruth.length === 0) return 0;
   263	
   264	  const relevantIds = new Set(
   265	    groundTruth.filter(e => e.relevance > 0).map(e => e.memoryId),
   266	  );
   267	  if (relevantIds.size === 0) return 0;
   268	
   269	  const topResults = topK(results, k);
   270	  let hits = 0;
   271	  let sumPrecision = 0;
   272	
   273	  for (let i = 0; i < topResults.length; i++) {
   274	    if (relevantIds.has(topResults[i].memoryId)) {
   275	      hits++;
   276	      sumPrecision += hits / (i + 1); // Precision@(i+1)
   277	    }
   278	  }
   279	
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Eval Ceiling (T006f)
     3	// ---------------------------------------------------------------
     4	// Full-Context Ceiling Evaluation — computes the theoretical
     5	// maximum MRR@5 assuming access to ALL memory content and
     6	// perfect ranking ability. Pure functions, no DB writes,
     7	// no side effects (except optional async scorer).
     8	// ---------------------------------------------------------------
     9	
    10	import { GroundTruthEntry } from './eval-metrics';
    11	
    12	/* ---------------------------------------------------------------
    13	   1. TYPES
    14	--------------------------------------------------------------- */
    15	
    16	/** A memory record used for ceiling evaluation. */
    17	export interface CeilingMemory {
    18	  /** Unique memory identifier. */
    19	  id: number;
    20	  /** Display title used by the scorer. */
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-ceiling.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   260	 */
   261	export async function computeCeilingWithScorer(
   262	  options: CeilingEvalOptions,
   263	): Promise<CeilingResult> {
   264	  if (!options.scorer) {
   265	    return computeCeilingFromGroundTruth(options);
   266	  }
   267	
   268	  const { queries, memories, groundTruth, scorer, k = 5 } = options;
   269	
   270	  if (queries.length === 0 || groundTruth.length === 0) {
   271	    return {
   272	      ceilingMRR: 0,
   273	      systemMRR: options.systemMRR,
   274	      gap: options.systemMRR !== undefined ? 0 - options.systemMRR : 0,
   275	      perQueryCeiling: [],
   276	      interpretation: 'No data: queries or ground truth is empty.',
   277	    };
   278	  }
   279	
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Eval Quality Proxy (T006g)
     3	// ---------------------------------------------------------------
     4	// Automated quality proxy metric that correlates with manual
     5	// quality assessment. Pure function, no DB access, no side effects.
     6	//
     7	// Formula:
     8	//   qualityProxy = avgRelevance * 0.40 + topResult * 0.25
     9	//                + countSaturation * 0.20 + latencyPenalty * 0.15
    10	//
    11	// All components normalised to [0, 1]. Output range: [0, 1].
    12	// ---------------------------------------------------------------
    13	
    14	/* ---------------------------------------------------------------
    15	   1. CONSTANTS
    16	--------------------------------------------------------------- */
    17	
    18	/** Default latency target in milliseconds. */
    19	const DEFAULT_LATENCY_TARGET_MS = 500;
    20	
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Ground Truth Data Loader
     3	// ---------------------------------------------------------------
     4	
     5	import groundTruthData from './data/ground-truth.json';
     6	
     7	export type IntentType =
     8	  | 'add_feature'
     9	  | 'fix_bug'
    10	  | 'refactor'
    11	  | 'security_audit'
    12	  | 'understand'
    13	  | 'find_spec'
    14	  | 'find_decision';
    15	
    16	export type ComplexityTier = 'simple' | 'moderate' | 'complex';
    17	
    18	export type QueryCategory =
    19	  | 'factual'
    20	  | 'temporal'
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts | sed -n '1,300p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Consumption Logger (T004 — Agent UX Instrumentation)
     3	// ---------------------------------------------------------------
     4	// Logs agent consumption events to a SQLite table for G-NEW-2
     5	// requirement analysis: what agents query, what results they get,
     6	// and (via hooks) which results they actually use.
     7	//
     8	// Table: consumption_log
     9	// Feature flag: SPECKIT_CONSUMPTION_LOG (default true)
    10	// ---------------------------------------------------------------
    11	
    12	import Database from 'better-sqlite3';
    13	
    14	/* ---------------------------------------------------------------
    15	   1. TYPES
    16	--------------------------------------------------------------- */
    17	
    18	/**
    19	 * Defines the ConsumptionEventType type.
    20	 */
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Ground Truth Generator
     3	// ---------------------------------------------------------------
     4	// T007: Functions for generating, loading, and validating the
     5	// synthetic ground truth dataset for retrieval evaluation.
     6	//
     7	// Exports:
     8	//   generateGroundTruth()          — produce the full dataset
     9	//   loadGroundTruth(evalDb)        — populate eval DB tables
    10	//   validateGroundTruthDiversity() — check all diversity gates
    11	// ---------------------------------------------------------------
    12	
    13	import type Database from 'better-sqlite3';
    14	
    15	import {
    16	  GROUND_TRUTH_QUERIES,
    17	  GROUND_TRUTH_RELEVANCES,
    18	  QUERY_DISTRIBUTION,
    19	  type GroundTruthQuery,
    20	  type GroundTruthRelevance,
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: BM25-Only Baseline Runner (T008)
     3	// ---------------------------------------------------------------
     4	//
     5	// Runs the ground truth query set through the BM25/FTS5-only
     6	// search path (disabling vector, graph, and trigger channels)
     7	// and computes baseline metrics. Records results in eval DB.
     8	//
     9	// The baseline measurement establishes the "floor" — what simple
    10	// keyword search achieves without any semantic, graph, or trigger
    11	// augmentation.
    12	//
    13	// Design notes:
    14	//   - The search function is injected as a dependency so tests
    15	//     can use mocks without a live DB.
    16	//   - The contingency decision matrix turns the measured MRR@5
    17	//     into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
    18	//   - recordBaselineMetrics() is a pure DB write — no network I/O.
    19	// ---------------------------------------------------------------
    20	
codex
I’m through the first half of the eval modules. A pattern is already emerging: a few feature docs describe broader runtime integration than the code actually shows, while some modules expose extra helpers and analytics that the docs don’t mention.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
     1	// ---------------------------------------------------------------
     2	// MODULE: Scoring Observability (T010)
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Lightweight observability logging for N4 cold-start boost and
     5	// TM-01 interference scoring values at query time.
     6	// Sampled at 5% of queries to avoid performance overhead.
     7	// All logging is best-effort (fail-safe, never throws).
     8	// Feature flags:
     9	//   SPECKIT_NOVELTY_BOOST     — N4 cold-start boost
    10	//   SPECKIT_INTERFERENCE_SCORE — TM-01 interference penalty
    11	// ---------------------------------------------------------------
    12	
    13	import type Database from 'better-sqlite3';
    14	
    15	// ---------------------------------------------------------------
    16	// 1. CONSTANTS
    17	// ---------------------------------------------------------------
    18	
    19	/** 5% sampling rate — logs ~1 in 20 scoring calls */
    20	export const SAMPLING_RATE = 0.05;
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Channel Attribution
     3	// ---------------------------------------------------------------
     4	//
     5	// Tags each search result with its source channel(s) for evaluation analysis.
     6	// Computes Exclusive Contribution Rate: how often each channel is the SOLE
     7	// source for a result in top-K.
     8	//
     9	// Channels: vector, fts, bm25, graph, trigger (extensible).
    10	//
    11	// Design notes:
    12	//   - Pure functions — no DB access, no side effects.
    13	//   - Channel names are lowercase strings matching existing conventions
    14	//     (see rrf-fusion.ts SOURCE_TYPES and eval-logger.ts channel parameter).
    15	// ---------------------------------------------------------------
    16	
    17	/* --- 1. TYPES --- */
    18	
    19	/** Known retrieval channels (extensible — any lowercase string accepted). */
    20	export type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'trigger' | string;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts | sed -n '360,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Eval Logger
     3	// ---------------------------------------------------------------
     4	// AI-TRACE: T005: Non-blocking, fail-safe logging hooks for search, context,
     5	// and trigger handlers. All writes go to the eval DB (speckit-eval.db).
     6	//
     7	// CRITICAL: Logging must NEVER break production search.
     8	// Every public function is wrapped in try-catch and is a no-op
     9	// when SPECKIT_EVAL_LOGGING is not set to "true".
    10	// ---------------------------------------------------------------
    11	
    12	import { initEvalDb } from './eval-db';
    13	
    14	/* ---------------------------------------------------------------
    15	   1. FEATURE FLAG
    16	--------------------------------------------------------------- */
    17	
    18	/**
    19	 * Returns true only when SPECKIT_EVAL_LOGGING=true (case-insensitive).
    20	 * Anything else (undefined, "false", "1", …) disables logging.
 succeeded in 50ms:
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
 succeeded in 51ms:
   360	  config: AblationConfig = { channels: ALL_CHANNELS },
   361	): Promise<AblationReport | null> {
   362	  if (!isAblationEnabled()) return null;
   363	
   364	  const startTime = Date.now();
   365	  const runId = generateRunId();
   366	  const recallK = config.recallK ?? 20;
   367	  const queries = getQueriesToEvaluate(config);
   368	
   369	  if (queries.length === 0) {
   370	    console.warn('[ablation] No queries to evaluate.');
   371	    return null;
   372	  }
   373	
   374	  try {
   375	    // -- Step 1: Compute baseline (all channels enabled) --
   376	    const baselineRecalls: Map<number, number> = new Map();
   377	    const baselineMetricsPerQuery: Map<number, { metrics: ReturnType<typeof computeQueryMetrics>; latencyMs: number }> = new Map();
   378	    const noDisabled = new Set<AblationChannel>();
   379	
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts | sed -n '360,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "memory_search|memory_context|memory_match_triggers|logSearchQuery|logChannelResult|logFinalResult|consumption" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"eval_run_ablation|eval_reporting_dashboard|evalRunId|parseArgs|dedup|SPECKIT_DASHBOARD_LIMIT|Number\\.isFinite|parent_id IS NULL|cache lookup|partial-update|SPEC_KIT_DB_DIR|SPECKIT_DB_DIR\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   360	    if (!channelGroups.has(row.channel)) {
   361	      channelGroups.set(row.channel, []);
   362	    }
   363	    // AI-SAFETY: channelGroups.set(...) above ensures this channel bucket exists before push
   364	    channelGroups.get(row.channel)!.push(row);
   365	  }
   366	
   367	  for (const [ch, rows] of channelGroups) {
   368	    const totalHits = rows.reduce((sum, r) => sum + (r.hit_count ?? 0), 0);
   369	    const latencies = rows.filter(r => r.latency_ms != null).map(r => r.latency_ms!);
   370	    const avgLatency = latencies.length > 0
   371	      ? Math.round((latencies.reduce((a, b) => a + b, 0) / latencies.length) * 100) / 100
   372	      : 0;
   373	
   374	    channels[ch] = {
   375	      hitCount: totalHits,
   376	      avgLatencyMs: avgLatency,
   377	      queryCount: rows.length,
   378	    };
   379	  }
 succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:964:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:965:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:31:import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:34:import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:137:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:166:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:187:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:203:    const evalEntry = logSearchQuery({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:215:        logFinalResult({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:240:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:252:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:288:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:304:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:405:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:425:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:474:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:477:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:238:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:239:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:240:    'memory_context',
 succeeded in 53ms:
Total output lines: 611

.opencode/skill/system-spec-kit/mcp_server/context-server.ts:85:// T001-T004: Session deduplication
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:915:    // T001-T004: Session deduplication module
.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md:32:**Path resolution:** `shared/config.ts` resolves this directory by walking up from `__dirname` to find `mcp_server/database/`. The path can be overridden with the `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR` environment variable.
.opencode/skill/system-spec-kit/shared/config.ts:10:  return process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:61:import { checkExistingRow, checkContentHashDedup } from './save/dedup';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:138:    // so downstream dedup and change-detection use the post-fix content.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:247:      AND parent_id IS NULL
.opencode/skill/system-spec-kit/shared/embeddings.ts:68: * Generate SHA256 hash key for cache lookup.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:155:  const limit = (typeof raw_limit === 'number' && Number.isFinite(raw_limit) && raw_limit > 0)
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:392:    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:178:  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:181:  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:201:  let _evalRunId = 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:209:    _evalRunId = evalEntry.evalRunId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:214:      if (_evalRunId && _evalQueryId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:216:          evalRunId: _evalRunId,
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:466:export function deduplicateSubstrings(candidates: ScoredNgram[]): ScoredNgram[] {
.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:595:  const deduplicated = deduplicateSubstrings(allCandidates);
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/12-test-quality-improvements.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
# Cross-AI validation fixes

## Current Reality

Independent reviews by Gemini 3.1 Pro and Codex gpt-5.3-codex identified 14 issues missed by the original audit. Key fixes:

- **CR-P0-1:** Test suite false-pass patterns — 21 silent-return guards converted to `it.skipIf()`, fail-fast imports with throw on required handler/vectorIndex missing.
- **CR-P1-1:** Deletion exception propagation — causal edge cleanup errors in single-delete now propagate (previously swallowed).
- **CR-P1-2:** Re-sort after feedback mutations before top-K slice in Stage 2 fusion.
- **CR-P1-3:** Dedup queries gained `AND parent_id IS NULL` to exclude chunk rows.
- **CR-P1-4:** Session dedup `id != null` guards against undefined collapse.
- **CR-P1-5:** Cache lookup moved before embedding readiness gate in search handler.
- **CR-P1-6:** Partial-update DB mutations wrapped inside transaction.
- **CR-P1-8:** Config env var fallback chain (`SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`).
- **CR-P2-3:** Dashboard row limit configurable via `SPECKIT_DASHBOARD_LIMIT` (default 10000) with NaN guard.
- **CR-P2-5:** `Number.isFinite` guards on evidence gap detector scores.

All 14 items verified through 3-stage review: Codex implemented, Gemini reviewed, Claude final-reviewed.

## Source Files
 succeeded in 53ms:
# Test quality improvements

## Current Reality

Four test quality issues were addressed:

**P2a:** `memory-save-extended.vitest.ts` timeout increased from 5000ms to 15000ms (eliminated flaky timeout failures).

**P2b:** `entity-linker.vitest.ts` gained `db.close()` in `afterEach` (prevented file handle leaks).

**P2c:** Four tautological flag tests in `integration-search-pipeline.vitest.ts` were rewritten to test actual behavioral differences instead of testing what they set up.

**P2d:** A duplicate T007 test block was identified as pre-resolved (not present in current file).

**Additional fixes:** `memory-parser.ts` gained a `/z_archive/` exclusion in `isMemoryFile()` spec doc detection. 18+ test files were updated to match changed source behavior (reconsolidation, five-factor-scoring, working-memory, session-cleanup, channel tests, entity tests, extraction-adapter, intent-routing and others). Test count adjusted from 7,027 to 7,003 (24 tests for removed dead-code features were deleted).

---

## Source Files

exec
/bin/zsh -lc "rg -n \"15000|5000|db\\.close\\(|z_archive|duplicate T007|tautological|it\\.skipIf|silent-return|parent_id IS NULL|id "'!= null|embedding readiness|transaction|SPECKIT_DASHBOARD_LIMIT|Number'"\\.isFinite\" .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/core/config.ts .opencode/skill/system-spec-kit/shared/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"stage2.*slice|sort\\(|feedback|transaction|parent_id IS NULL|id "'!= null|skipIf|required handler|vectorIndex" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/storage' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:112:    db.close();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:151:  if (typeof score === 'number' && Number.isFinite(score)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:156:  if (typeof similarity === 'number' && Number.isFinite(similarity)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:161:  if (typeof rrfScore === 'number' && Number.isFinite(rrfScore)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:235:  if (typeof minQualityScore !== 'number' || !Number.isFinite(minQualityScore)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:242:    const score = typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:248:  if (typeof minQualityScore === 'number' && Number.isFinite(minQualityScore)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:252:  if (typeof minQualityScoreSnake === 'number' && Number.isFinite(minQualityScoreSnake)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:364:  if (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:369:    if (Number.isFinite(parsed) && Number.isInteger(parsed)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:72:          5000,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:100:          5000,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:125:          5000,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:147:          5000,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:177:          5000,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:195:          5000,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:216:          5000,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:237:          5000,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:24:const DASHBOARD_ROW_LIMIT = Math.max(1, parseInt(process.env.SPECKIT_DASHBOARD_LIMIT ?? '10000', 10) || 10000);
 succeeded in 53ms:
Total output lines: 570

.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:15://     - Learned trigger and negative-feedback reads from DB
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:57:import { queryLearnedTriggers } from '../learned-feedback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:58:import { applyNegativeFeedback, getNegativeFeedbackStats } from '../../scoring/negative-feedback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:141:  return adjusted.sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:266:  return scored.sort((a, b) => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:301:    return [...results].sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:314:  return boosted.sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:318: * Apply feedback signals — learned trigger boosts and negative feedback demotions.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:325: * Negative feedback: memories with wasUseful=false validations receive a
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:332: * @returns New array with feedback-adjusted scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:345:      // AI-WHY: DB not available — skip feedback signals gracefully
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:348:    // AI-WHY: DB not available — skip feedback signals gracefully
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:367:  // -- Negative feedback stats (batch load) --
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:375:      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:389:    // Apply negative feedback demotion (multiplicative confidence multiplier)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:473: *   6.  Feedback signals   (all types — learned triggers + negative feedback)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:490:    feedbackSignalsApplied: false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:557:          results.sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
exec
/bin/zsh -lc 'rg -n "computeAllMetrics|map:|intentWeightedNdcg|constitutionalSurfacingRate|coldStartDetectionRate" .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
42:/** All computed metrics returned by computeAllMetrics(). */
49:  constitutionalSurfacingRate: number;
51:  coldStartDetectionRate: number;
54:  map: number;
55:  intentWeightedNdcg: number;
561:export function computeAllMetrics(params: {
582:    map: computeMAP(results, groundTruth),
585:    constitutionalSurfacingRate: computeConstitutionalSurfacingRate(results, constitutionalIds),
587:    coldStartDetectionRate: computeColdStartDetectionRate(results, groundTruth, memoryTimestamps),
588:    intentWeightedNdcg: computeIntentWeightedNDCG(results, groundTruth, intentType),
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts | sed -n '540,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   540	    ...e,
   541	    relevance: Math.min(multipliers[e.relevance] ?? e.relevance, MAX_WEIGHTED_GRADE),
   542	  }));
   543	
   544	  return computeNDCG(results, weightedGT, k);
   545	}
   546	
   547	/* ---------------------------------------------------------------
   548	   5. CONVENIENCE: COMPUTE ALL METRICS
   549	--------------------------------------------------------------- */
   550	
   551	/**
   552	 * Compute all 11 metrics (6 core + 5 diagnostic) in one call.
   553	 *
   554	 * @param params.results             Retrieved results for the query.
   555	 * @param params.groundTruth         Ground truth relevance judgments.
   556	 * @param params.constitutionalIds   Memory IDs that are constitutional tier.
   557	 * @param params.memoryTimestamps    Map from memoryId → creation Date.
   558	 * @param params.intentType          Intent type for intent-weighted NDCG.
   559	 * @returns Record mapping metric name to computed value in [0, 1].
exec
/bin/zsh -lc 'rg -n "p95|overhead|health check|10%|5ms|observer|non-fatal|silently disabled|logging silently disabled|best-effort" .opencode/skill/system-spec-kit/mcp_server/lib/eval .opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:257:    console.warn('[ground-truth-feedback] recordUserSelection failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:317:    console.warn('[ground-truth-feedback] getSelectionHistory failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:428:    console.warn('[ground-truth-feedback] saveLlmJudgeLabels failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:545:    console.warn('[ground-truth-feedback] getGroundTruthCorpusSize failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:162:        'search is worth the operational overhead.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:128:  'latency_p95': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:330:    'latency_p95': {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:496:    console.warn('[ablation] runAblation failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:597:    console.warn('[ablation] storeAblationResults failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:670:    lines.push(`| Channel | MRR@5 | P@5 | R@5 | NDCG@5 | MAP | Hit Rate | Lat p50 | Lat p95 | Tokens |`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:685:        `| ${m['latency_p95'].delta >= 0 ? '+' : ''}${m['latency_p95'].delta.toFixed(1)}ms ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:162:    console.warn('[eval-logger] logSearchQuery failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:193:    console.warn('[eval-logger] logChannelResult failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:222:    console.warn('[eval-logger] logFinalResult failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:441:    console.warn('[shadow-scoring] getShadowStats failed (non-fatal):', msg);
exec
/bin/zsh -lc 'rg -n "p95|overhead|budget|alert" .opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:100:      "expectedResultDescription": "Should surface system-spec-kit spec documents and memories about the L1/L2/L3/L4/L5/L6/L7 layer design, token budgets per layer, and original design rationale.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:265:      "query": "what rationale drove the token budget assignments per MCP layer",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:270:      "expectedResultDescription": "Should surface system-spec-kit SKILL.md section on L1-L7 token budgets (2000, 1500, 800, 500, 600, 1200, 1000) and any decision record explaining their sizing.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:695:      "query": "SPECKIT_PRESSURE_POLICY token budget downgrade",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:162:        'search is worth the operational overhead.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:128:  'latency_p95': AblationMetricEntry;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:330:    'latency_p95': {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:670:    lines.push(`| Channel | MRR@5 | P@5 | R@5 | NDCG@5 | MAP | Hit Rate | Lat p50 | Lat p95 | Tokens |`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:685:        `| ${m['latency_p95'].delta >= 0 ? '+' : ''}${m['latency_p95'].delta.toFixed(1)}ms ` +
exec
/bin/zsh -lc 'rg -n "correlation|quality proxy|computeQualityProxy|excellent|acceptable|poor|latencyTargetMs" .opencode/skill/system-spec-kit/mcp_server/lib/eval .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:32:The eval module provides measurement infrastructure for search quality evaluation. It includes baseline measurement (BM25 MRR@5), ceiling evaluation, ground truth datasets, edge density analysis, quality proxy scoring, K-value sensitivity analysis, channel attribution, ground truth expansion via feedback, shadow scoring for A/B comparison, ablation studies for channel contribution analysis, a reporting dashboard for metric aggregation and trend analysis, and an evaluation database for tracking metrics over time.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:19:  /** Kendall tau rank correlation with the baseline (K=60) ranking. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:38: * Compute Kendall tau rank correlation coefficient between two rankings.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:43: *   0.0  = no correlation
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:139: * 3. Computes Kendall tau correlation with the K=60 baseline
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:171:        // DB errors are acceptable (means validation passed)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:190:        // Either validation error or DB error is acceptable
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:223:        // DB errors are acceptable (means validation passed)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:244:        // DB errors are acceptable
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:93:  /** Kendall tau-like rank correlation (1 = same order, -1 = reversed). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:107:  /** Average rank correlation across all comparisons. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:130:    rank_correlation REAL NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:188: * Compute Kendall tau-like rank correlation between two ranked lists.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:191: *   0  = no correlation
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:393:        AVG(rank_correlation) as avg_rank_corr,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:4:// Automated quality proxy metric that correlates with manual
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:33:/** Input parameters for the quality proxy computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:66:  latencyTargetMs?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:81:/** Result of the quality proxy computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:87:  /** Human-readable quality tier: 'excellent' | 'good' | 'acceptable' | 'poor'. */
exec
/bin/zsh -lc "python3 -c 'import json
from pathlib import Path
p=Path(\".opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json\")
data=json.loads(p.read_text())
queries=data[\"queries\"]
relevances=data[\"relevances\"]
from collections import Counter
print(\"queries\", len(queries))
print(\"relevances\", len(relevances))
print(\"manual\", sum(1 for q in queries if q[\"source\"]==\"manual\"))
print(\"hard_negative\", sum(1 for q in queries if q[\"category\"]==\"hard_negative\"))
print(\"by_intent\", Counter(q[\"intentType\"] for q in queries))
print(\"by_complexity\", Counter(q[\"complexityTier\"] for q in queries))
print(\"by_source\", Counter(q[\"source\"] for q in queries))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 625ms:
queries 110
relevances 297
manual 40
hard_negative 11
by_intent Counter({'understand': 39, 'find_spec': 19, 'add_feature': 13, 'find_decision': 12, 'fix_bug': 12, 'security_audit': 8, 'refactor': 7})
by_complexity Counter({'moderate': 53, 'simple': 37, 'complex': 20})
by_source Counter({'manual': 40, 'pattern_derived': 35, 'seed': 21, 'trigger_derived': 14})
exec
/bin/zsh -lc 'rg -n "G-NEW-2|pattern analysis|Pattern 3|agent consumption|consumption analysis|trigger_derived|manual" .opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json .opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:204: *   5. ≥30 manually curated queries (source='manual')
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:259:  const manualCount = queries.filter(q => q.source === 'manual').length;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:261:    dimension: 'Manual queries (source=manual)',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:263:    actual: manualCount,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:264:    passed: manualCount >= GATES.MIN_MANUAL_QUERIES,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:569:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:579:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:589:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:599:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:609:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:619:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:629:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:639:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:649:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:659:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:669:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:679:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:689:      "source": "trigger_derived",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:699:      "source": "trigger_derived",
exec
/bin/zsh -lc "rg -n \"0\\.2083|ENABLE_BM25|FTS5 alone|bm25-only|PROCEED|RATIONALIZE|PAUSE|bootstrap\" .opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:17://     into an actionable gate: PAUSE / RATIONALIZE / PROCEED.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:65:  /** Per-query MRR@5 values for bootstrap CI computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:68:  bootstrapCI?: BootstrapCIResult;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:77:  /** Gate action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED'. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:78:  action: 'PAUSE' | 'RATIONALIZE' | 'PROCEED';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:134: *   MRR@5 >= 0.80 → PAUSE
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:139: *   MRR@5 0.50–0.79 → RATIONALIZE
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:144: *   MRR@5 < 0.50 → PROCEED
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:157:      action: 'PAUSE',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:171:      action: 'RATIONALIZE',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:183:    action: 'PROCEED',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:194:   Spec: "BM25 >= 80% of hybrid MRR@5" → PAUSE.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:203: *   ratio >= 0.80 → PAUSE
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:206: *   ratio 0.50–0.79 → RATIONALIZE
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:209: *   ratio < 0.50 → PROCEED
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:227:      action: 'PROCEED',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:230:        'Defaulting to PROCEED until hybrid baseline is established.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:243:      action: 'PAUSE',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:248:        'PAUSE Sprints 3-7 and evaluate whether the complexity is warranted.',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:259:      action: 'RATIONALIZE',
exec
/bin/zsh -lc "rg -n \"noveltyBoostApplied|noveltyBoostValue|calculateNoveltyBoost|SPECKIT_NOVELTY_BOOST|shouldSample\\(|logScoringObservation\\(|noveltyBoost.*0|interferencePenalty\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:6:  calculateNoveltyBoost,
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:33:// N4: calculateNoveltyBoost
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:36:describe('calculateNoveltyBoost — flag disabled (default)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:41:  it('returns 0 when SPECKIT_NOVELTY_BOOST is not set', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:42:    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:46:  it('returns 0 when SPECKIT_NOVELTY_BOOST is "false"', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:47:    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'false');
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:48:    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:53:describe('calculateNoveltyBoost — feature removed (always returns 0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:55:    vi.stubEnv('SPECKIT_NOVELTY_BOOST', 'true');
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:64:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:70:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:76:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:82:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:87:    expect(calculateNoveltyBoost(undefined)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:88:    expect(calculateNoveltyBoost(null as unknown as string)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:92:    expect(calculateNoveltyBoost('not-a-date')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:93:    expect(calculateNoveltyBoost('')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:98:    expect(calculateNoveltyBoost(futurestamp)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:103:    expect(calculateNoveltyBoost(oldStamp)).toBe(0);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '450,540p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
   450	  return computeRecencyScore(timestamp || '', tier, DECAY_RATE);
   451	}
   452	
   453	// --- 3a. NOVELTY BOOST ---
   454	
   455	/**
   456	 * N4: Cold-start boost constants (exported for observability tests).
   457	 * @deprecated Novelty boost disabled (Sprint 7 audit). Retained for test compatibility.
   458	 */
   459	export const NOVELTY_BOOST_MAX = 0.15;
   460	/** @deprecated Novelty boost disabled (Sprint 7 audit). Retained for test compatibility. */
   461	export const NOVELTY_BOOST_HALF_LIFE_HOURS = 12;
   462	/** @deprecated Novelty boost disabled (Sprint 7 audit). Retained for test compatibility. */
   463	export const NOVELTY_BOOST_SCORE_CAP = 0.95;
   464	
   465	/**
   466	 * N4: Calculate cold-start novelty boost with exponential decay.
   467	 * @deprecated Eval complete (Sprint 7 audit). Marginal value confirmed.
   468	 * SPECKIT_NOVELTY_BOOST env var is inert. Always returns 0.
   469	 *
exec
/bin/zsh -lc 'rg -n "isShadowScoringEnabled|isInShadowPeriod|ground truth expansion|recordUserSelection|saveLlmJudgeLabels|selection history|llm judge|shadow scoring" .opencode/skill/system-spec-kit/mcp_server/lib/eval .opencode/skill/system-spec-kit/mcp_server/lib/scoring .opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:9://   is recorded as implicit relevance signal for ground truth expansion.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:11:// Phase C: LLM-judge relevance labeling for ground truth expansion.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:227:export function recordUserSelection(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:257:    console.warn('[ground-truth-feedback] recordUserSelection failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:263: * Retrieve user selection history.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:399:export function saveLlmJudgeLabels(labels: LlmJudgeLabel[]): number {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:428:    console.warn('[ground-truth-feedback] saveLlmJudgeLabels failed (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:16:import { recordUserSelection } from '../lib/eval/ground-truth-feedback';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:379:    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:32:The eval module provides measurement infrastructure for search quality evaluation. It includes baseline measurement (BM25 MRR@5), ceiling evaluation, ground truth datasets, edge density analysis, quality proxy scoring, K-value sensitivity analysis, channel attribution, ground truth expansion via feedback, shadow scoring for A/B comparison, ablation studies for channel contribution analysis, a reporting dashboard for metric aggregation and trend analysis, and an evaluation database for tracking metrics over time.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:35: * Configuration for shadow scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:65:/** Comparison metrics between production and shadow scoring. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:101:/** Aggregated shadow scoring statistics over a time range. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:246: * @param shadowConfig - Configuration including the shadow scoring function.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:247: * @returns Always null (shadow scoring disabled).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:355: * Retrieve aggregated shadow scoring statistics over an optional time range.
exec
/bin/zsh -lc 'rg -n "isInShadowPeriod" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:304:    const shadowMode = isInShadowPeriod(db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:404:function isInShadowPeriod(db: Database): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:445:    if (isInShadowPeriod(db)) {
exec
/bin/zsh -lc "rg -n \"z_archive|isMemoryFile\\(|spec doc detection|archive\" .opencode/skill/system-spec-kit/mcp_server/lib/parsing .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:661:export function isMemoryFile(filePath: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:677:    !normalizedPath.includes('/z_archive/') &&
exec
/bin/zsh -lc "rg -n \"recallK|_evalRunCounterInitialized|MAX\\(eval_run_id\\)|phase IN \\('preflight', 'complete'\\)|parseArgs<|return \\{\\} as T|slice\\(0, 32\\)|removeListener\\(|_exitFlushHandler|beforeExit|SIGTERM|SIGINT\" .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts .opencode/skill/system-spec-kit/mcp_server/tools/types.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/task-postflight.ts .opencode/skill/system-spec-kit/mcp_server/handlers/task_preflight.ts .opencode/skill/system-spec-kit/mcp_server/handlers/task-postflight.ts .opencode/skill/system-spec-kit/mcp_server/handlers/task-preflight.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 52ms:
rg: .opencode/skill/system-spec-kit/mcp_server/handlers/task-postflight.ts: No such file or directory (os error 2)
rg: .opencode/skill/system-spec-kit/mcp_server/handlers/task_preflight.ts: No such file or directory (os error 2)
rg: .opencode/skill/system-spec-kit/mcp_server/handlers/task-postflight.ts: No such file or directory (os error 2)
rg: .opencode/skill/system-spec-kit/mcp_server/handlers/task-preflight.ts: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:662:process.on('SIGTERM', () => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:663:  void fatalShutdown('Received SIGTERM, shutting down...', 0);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:665:process.on('SIGINT', () => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:666:  void fatalShutdown('Received SIGINT, shutting down...', 0);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:36:let _evalRunCounterInitialized = false;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:49:  if (!_evalRunCounterInitialized) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:50:    _evalRunCounterInitialized = true;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:54:        const row = db.prepare('SELECT MAX(eval_run_id) as maxId FROM eval_channel_results').get() as { maxId: number | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:72:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:366:  const recallK = config.recallK ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:388:      const recall = computeRecall(results, gt, recallK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:415:          const recall = computeRecall(results, gt, recallK);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:533:    const recallK = report.config.recallK ?? 20;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:539:        `ablation_baseline_recall@${recallK}`,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:556:          `ablation_recall@${recallK}_delta`,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:618:  const recallK = report.config.recallK ?? 20;
exec
/bin/zsh -lc "rg -n \"phase IN \\('preflight', 'complete'\\)|_exitFlushHandler|removeListener\\(|slice\\(0, 32\\)|parent_id IS NULL|id "'!= null|cache lookup moved before embedding readiness|SPEC_KIT_DB_DIR '"\\|\\| SPECKIT_DB_DIR|Number\\.isFinite\\(.*score\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:188:      WHERE parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:208:    WHERE parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:70:    phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:339:    WHERE spec_folder = ? AND task_id = ? AND phase IN ('preflight', 'complete')
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:21:      AND parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:54:        AND parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:151:  if (typeof score === 'number' && Number.isFinite(score)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:67:      whereParts.push('parent_id IS NULL');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:242:        'parent_id IS NULL',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:151:        AND parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:  return crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 32);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:346:      if (m.id != null) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:357:      if (m.id != null) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:378:      if (memory.id != null && !result.has(memory.id)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:389:      if (m.id != null) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:672:    if (r.id != null && shouldSendMap.get(r.id) === false) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:247:      AND parent_id IS NULL
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:415:    expect(out.results.every(r => Number.isFinite(r.score))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:424:    expect(out.results.every(r => Number.isFinite(r.score))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:433:    expect(out.results.every(r => Number.isFinite(r.score))).toBe(true);
codex
Category 09 is mapped well enough to start classifying. I’m switching to category 10 now, using the same pass: read the feature text, inspect the first implementation files, and then check whether the docs are overstating, understating, or pointing at the wrong places.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path
import re
base=Path(\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation\")
for path in sorted(base.glob(\"*.md\")):
    text=path.read_text()
    current=re.search(r\"## Current Reality\\n\\n(.*?)\\n\\n## Source Files\", text, re.S).group(1).strip()
    print(f\"=== {path.name} ===\")
    print(current)
    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 597ms:
=== 01-typed-weighted-degree-channel.md ===
A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone.

Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. When a memory has zero edges, the channel returns 0 rather than failing.

=== 02-co-activation-boost-strength-increase.md ===
The co-activation boost multiplier jumped from 0.1x to 0.25-0.3x. At 0.1x, the graph signal investment was barely visible in retrieval results, roughly 5% effective contribution at hop 2.

The new multiplier targets 15% or higher contribution, which is enough to matter without overwhelming the vector and lexical channels. You can tune the exact value through the `SPECKIT_COACTIVATION_STRENGTH` environment variable. A dark-run measurement sequence isolates A7 contribution by comparing R4-only results against R4+A7 results.

=== 03-edge-density-measurement.md ===
The current density metric used by runtime guards is global edge density: `total_edges / total_memories` from the graph tables. If density is too low, graph-derived gains are naturally limited; if density is too high, entity-linking creation is gated by the configured density threshold. Earlier "edges-per-node" phrasing is still useful intuition, but runtime checks now use the global-density denominator for consistency.

=== 04-weight-history-audit-tracking.md ===
Every causal edge now carries `created_by` and `last_accessed` metadata fields tracking who created the edge and when it was last used. All strength modifications are logged to a `weight_history` table recording old strength, new strength, the actor (`changed_by`), timestamp and reason.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). A `rollbackWeights()` function restores edges from weight history with a fallback to the oldest entry if timestamp matching fails due to same-millisecond updates.

This audit infrastructure supports the N3-lite consolidation engine: Hebbian strengthening, staleness detection and edge bounds enforcement all rely on accurate weight history and provenance tracking.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"MAX_TYPED_DEGREE|MAX_TOTAL_DEGREE|DEGREE_BOOST_CAP|SPECKIT_DEGREE_BOOST|constitutional|degree cache|clear.*cache|typed degree|supports|caused|logarithmic|0\\.15\" .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:26:  caused: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:31:  supports: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:34:/** Fallback maximum typed degree when no edges exist in the database */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:35:const DEFAULT_MAX_TYPED_DEGREE = 15;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:37:/** Hard cap on raw typed degree before normalization */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:38:const MAX_TOTAL_DEGREE = 50;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:41:const DEGREE_BOOST_CAP = 0.15;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:253: * In-memory degree cache. Keys are stringified memory IDs.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:305:  return Math.min(total, MAX_TOTAL_DEGREE);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:309: * Normalize a raw typed degree into a bounded boost score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:311: * Uses logarithmic scaling: log(1 + raw) / log(1 + max)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:312: * Then caps at DEGREE_BOOST_CAP (0.15).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:315: * @param maxDegree - The maximum observed typed degree (for normalization base)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:316: * @returns A score in [0, DEGREE_BOOST_CAP]
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:324:  return Math.min(normalized * DEGREE_BOOST_CAP, DEGREE_BOOST_CAP);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:328: * Compute the global maximum typed degree across all memories in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:331: * Falls back to DEFAULT_MAX_TYPED_DEGREE if no edges exist.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:344:    if (rows.length === 0) return DEFAULT_MAX_TYPED_DEGREE;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:352:    return maxDegree > 0 ? maxDegree : DEFAULT_MAX_TYPED_DEGREE;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:354:    return DEFAULT_MAX_TYPED_DEGREE;
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Graph Flags
     3	// ---------------------------------------------------------------
     4	// AI-WHY: Legacy compatibility shim retained for test/runtime imports.
     5	
     6	import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
     7	
     8	/**
     9	 * Unified graph channel gate (default-on, explicit opt-out with `'false'`).
    10	 */
    11	export function isGraphUnifiedEnabled(): boolean {
    12	  return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
    13	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "clearDegreeCache|insertEdge|update.*edge|delete.*edge|constitutional|SPECKIT_DEGREE_BOOST" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Rollout Policy
     3	// ---------------------------------------------------------------
     4	
     5	const DEFAULT_ROLLOUT_PERCENT = 100;
     6	
     7	function getRolloutPercent(): number {
     8	  const raw = process.env.SPECKIT_ROLLOUT_PERCENT;
     9	  if (typeof raw !== 'string' || raw.trim().length === 0) {
    10	    return DEFAULT_ROLLOUT_PERCENT;
    11	  }
    12	
    13	  const parsed = Number.parseInt(raw, 10);
    14	  if (!Number.isFinite(parsed)) {
    15	    return DEFAULT_ROLLOUT_PERCENT;
    16	  }
    17	
    18	  return Math.max(0, Math.min(100, parsed));
    19	}
    20	
 succeeded in 52ms:
   260	 * separate debounce (lastEdgeCount + computedThisSession) to skip
   261	 * re-computation when the graph is unchanged.  No additional optimization
   262	 * is needed at this time.
   263	 *
   264	 * Cache warmup strategy:
   265	 *   - The cache is populated lazily: entries are written on first access via
   266	 *     computeDegreeScores() as each memory ID is encountered during a search.
   267	 *   - Cold-start (empty cache): every ID in a batch triggers a DB query
   268	 *     (computeTypedDegree SQL). The global max degree is recomputed per-batch
   269	 *     since it is not cached separately.
   270	 *   - Subsequent requests: hits are served from the Map without touching the DB.
   271	 *   - Invalidation: clearDegreeCache() wipes all entries on causal edge
   272	 *     insert/update/delete so the next batch recomputes from current DB state.
   273	 */
   274	const degreeCache = new Map<string, number>();
   275	
   276	/**
   277	 * Compute the raw typed-weighted degree for a single memory node.
   278	 *
   279	 * Counts edges where the memory appears as source OR target,
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:254: * Invalidated via clearDegreeCache() on causal edge mutations.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:258: * mutations (insert/update/delete) through clearDegreeCache() called from
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:271: *   - Invalidation: clearDegreeCache() wipes all entries on causal edge
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:361: * - Excludes constitutional memories (returns 0 to prevent artificial inflation)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:376:  // Identify constitutional memories (excluded from degree boosting)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:377:  const constitutionalIds = new Set<string>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:380:    const constitutionalRows = (database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:381:      `SELECT id FROM memory_index WHERE id IN (${placeholders}) AND importance_tier = 'constitutional'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:383:    for (const row of constitutionalRows) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:384:      constitutionalIds.add(String(row.id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:397:    if (constitutionalIds.has(key)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:423:function clearDegreeCache(): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:473:  clearDegreeCache,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:8:import { clearDegreeCache } from '../search/graph-search-fn';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:101:    clearDegreeCache();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:130:function insertEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:209:    console.warn(`[causal-edges] insertEdge error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:214:function insertEdgesBatch(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:231:      const id = insertEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:252:    console.warn(`[causal-edges] insertEdgesBatch error: ${msg}`);
exec
/bin/zsh -lc 'rg -n "SPECKIT_DEGREE_BOOST|computeDegreeScores|degree boost|typed-degree|DEGREE_BOOST_CAP" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:753:| `SPECKIT_DEGREE_BOOST`          | `true`  | Typed-weighted degree channel |
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:26:import { computeDegreeScores } from './graph-search-fn';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:650:    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:664:          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:177:/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:179:  return isFeatureEnabled('SPECKIT_DEGREE_BOOST');
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:24:/** Edge type weights for typed-degree computation (R4 5th RRF channel) */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:41:const DEGREE_BOOST_CAP = 0.15;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:266: *     computeDegreeScores() as each memory ID is encountered during a search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:312: * Then caps at DEGREE_BOOST_CAP (0.15).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:316: * @returns A score in [0, DEGREE_BOOST_CAP]
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:324:  return Math.min(normalized * DEGREE_BOOST_CAP, DEGREE_BOOST_CAP);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:359: * Batch compute degree boost scores for multiple memory IDs.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:369:function computeDegreeScores(
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:376:  // Identify constitutional memories (excluded from degree boosting)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:468:  DEGREE_BOOST_CAP,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:472:  computeDegreeScores,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:613:Hub caps prevent high-degree nodes from dominating: `MAX_TYPED_DEGREE=15` (default max before normalization), `MAX_TOTAL_DEGREE=50` (hard cap on raw degree). Normalized boost capped at `DEGREE_BOOST_CAP=0.15`.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:180: *   - Impact on R4 (typed-degree) effectiveness
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:204:    '  R4 typed-degree signals depend on well-connected nodes to surface',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '160,220p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '630,690p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   160	/**
   161	 * R10: Auto entity extraction (rule-based noun-phrase extraction at save time).
   162	 * Default: TRUE (enabled). Set SPECKIT_AUTO_ENTITIES=false to disable.
   163	 */
   164	export function isAutoEntitiesEnabled(): boolean {
   165	  return isFeatureEnabled('SPECKIT_AUTO_ENTITIES');
   166	}
   167	
   168	/**
   169	 * S5: Cross-document entity linking (entity-based cross-doc edges).
   170	 * Requires R10 (auto entities) to also be enabled.
   171	 * Default: TRUE (enabled). Set SPECKIT_ENTITY_LINKING=false to disable.
   172	 */
   173	export function isEntityLinkingEnabled(): boolean {
   174	  return isFeatureEnabled('SPECKIT_ENTITY_LINKING');
   175	}
   176	
   177	/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
   178	export function isDegreeBoostEnabled(): boolean {
   179	  return isFeatureEnabled('SPECKIT_DEGREE_BOOST');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"0\\.25|0\\.3|SPECKIT_COACTIVATION_STRENGTH|dark-run|co-activation|hop 2|0\\.1\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts .opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:11: * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:14: * this to 0.25 for better discovery recall. The R17 fan-effect divisor (sqrt scaling)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:16: * written against 0.25 and serve as the authoritative contract going forward.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:18:const DEFAULT_COACTIVATION_STRENGTH = 0.25;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:22:  boostFactor: parseFloat(process.env.SPECKIT_COACTIVATION_STRENGTH || String(DEFAULT_COACTIVATION_STRENGTH)),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:82: * Boost a search result's score based on co-activation with related memories.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:112:    console.warn('[co-activation] Database not initialized. Server may still be starting up.');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:176:    console.warn(`[co-activation] getRelatedMemories error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:206:      console.warn(`[co-activation] Invalid embedding size (${uint8.byteLength} bytes) for memory ${memoryId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:229:    console.warn(`[co-activation] populateRelatedMemories error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:287:    console.warn(`[co-activation] getCausalNeighbors error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:3:// Converted from: co-activation.test.ts (custom runner)
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:4:// Aligned with production co-activation.ts named exports
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:8:import * as coActivation from '../lib/cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:41:    it('boostFactor is 0.25 (configurable via SPECKIT_COACTIVATION_STRENGTH)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:42:      expect(coActivation.CO_ACTIVATION_CONFIG.boostFactor).toBe(0.25);
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:83:      // perNeighborBoost = 0.25 * (80/100) = 0.2
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:85:      // boost = 0.2 / 1.732 ≈ 0.11547
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:86:      // result = 0.5 + 0.11547 ≈ 0.61547
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:88:      const perNeighborBoost = 0.25 * (80 / 100);
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib -g 'co-activation.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
exec
/bin/zsh -lc "sed -n '1,40p' .opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// TEST: CO-ACTIVATION (vitest)
// Converted from: co-activation.test.ts (custom runner)
// Aligned with production co-activation.ts named exports
// ---------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import * as coActivation from '../lib/cache/cognitive/co-activation';

type CoActivationDb = Parameters<typeof coActivation.init>[0];
const coActivationExports = coActivation as unknown as Record<string, unknown>;

describe('Co-Activation Module', () => {
  /* -------------------------------------------------------------
     Module Exports
  ---------------------------------------------------------------- */

  describe('Module Exports', () => {
    // Production exports: CO_ACTIVATION_CONFIG (not CONFIG), init, isEnabled,
    // boostScore, getRelatedMemories, populateRelatedMemories, spreadActivation
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit/mcp_server/lib/cache -g 'co-activation.*'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "total_edges / total_memories|density threshold|edges-per-node|global edge density|entity-linking|SPECKIT_EDGE_DENSITY_THRESHOLD|gate" .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/search' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Edge Density (Sprint 1 T003)
     3	// ---------------------------------------------------------------
     4	// AI-WHY: 
     5	// Measures the edge density of the causal graph:
     6	//   density = edge_count / total_memories
     7	//
     8	// This denominator makes sparse non-empty graphs measurable.
     9	// Fallback for legacy/partial datasets: if total_memories is 0,
    10	// use unique participating nodes as denominator.
    11	//
    12	// Density classifications:
    13	//   >= 1.0  → "dense"    — graph is highly connected
    14	//   0.5–1.0 → "moderate" — sufficient for graph signals
    15	//   < 0.5   → "sparse"   — R10 escalation recommended
    16	//
    17	// When density < 0.5 an R10 escalation recommendation is generated
    18	// and included in the result.
    19	
    20	import type Database from 'better-sqlite3';
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:4:// Default-on runtime gates for search pipeline controls
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:36: * Cross-encoder reranking gate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:70: * TM-04: Pre-storage quality gate for memory saves.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:201: * P1-5: Local GGUF reranker gate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:337:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:536:    // Sprint 3: Pipeline metadata collector (populated by flag-gated stages)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:586:    // Vector channel — gated by Sprint 3 routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:607:    // FTS channel (internal error handling in ftsSearch) — gated by Sprint 3 routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:617:    // BM25 channel (internal error handling in bm25Search) — gated by Sprint 3 routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:627:    // Graph channel (T008: metrics collection) — gated by Sprint 3 routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:651:    // Degree channel (T002: 5th RRF channel) — also gated by Sprint 3 routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:835:      // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1027: * When SPECKIT_SEARCH_FALLBACK=true: delegates to the 3-tier quality-aware
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1041:  // AI-WHY: PI-A2: Delegate to tiered fallback when flag is enabled
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:186: * Parse and validate the maximum edge density threshold for S5 linking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:198: * Resolve S5 density threshold from env var with safe fallback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:219: * Compute global graph density as total_edges / total_memories.
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:455: * Entity infrastructure gate: check entity_catalog has >0 entries.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:34:- `memory-save.ts` — save orchestrator (delegates to `save/` pipeline)
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:56:- `pe-gating.ts` — prediction-error gate actions (findSimilarMemories, reinforce, etc.)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts | sed -n '180,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   180	  } catch (_error: unknown) {
   181	    return null;
   182	  }
   183	}
   184	
   185	/**
   186	 * Parse and validate the maximum edge density threshold for S5 linking.
   187	 * Accepts finite non-negative values; invalid inputs fall back to default.
   188	 */
   189	function sanitizeDensityThreshold(value: unknown): number {
   190	  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
   191	  if (!Number.isFinite(parsed) || parsed < 0) {
   192	    return DEFAULT_MAX_EDGE_DENSITY;
   193	  }
   194	  return parsed;
   195	}
   196	
   197	/**
   198	 * Resolve S5 density threshold from env var with safe fallback.
   199	 */
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "weight_history|created_by|last_accessed|MAX_EDGES_PER_NODE|MAX_AUTO_STRENGTH|rollbackWeights|changed_by|same-millisecond|oldest entry|logWeightChange|staleness" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts | sed -n '420,780p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
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
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:42:    // Create causal_edges table matching production schema (+created_by, +last_accessed)
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:54:        created_by TEXT DEFAULT 'manual',
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:55:        last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:60:    // T001d: weight_history for audit tracking
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:62:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:67:        changed_by TEXT DEFAULT 'manual',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:43:const MAX_EDGES_PER_NODE = 20;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:44:const MAX_AUTO_STRENGTH = 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:62:  created_by: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:63:  last_accessed: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:71:  changed_by: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:145:  // NFR-R01: Auto edges capped at MAX_AUTO_STRENGTH
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:147:    ? Math.min(strength, MAX_AUTO_STRENGTH)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:158:  // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:161:    if (edgeCount >= MAX_EDGES_PER_NODE) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:162:      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:170:    // AI-WHY: Wrap SELECT + UPSERT + logWeightChange in a transaction for atomicity
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:172:      // AI-WHY: Check if edge exists (for weight_history logging on conflict update).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:174:      // to write a weight_history row after the upsert. The subsequent INSERT
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:182:        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
 succeeded in 52ms:
   420	  updates: { strength?: number; evidence?: string },
   421	  changedBy: string = 'manual',
   422	  reason: string | null = null,
   423	): boolean {
   424	  if (!db) return false;
   425	  const database = db;
   426	
   427	  try {
   428	    const parts: string[] = [];
   429	    const params: unknown[] = [];
   430	
   431	    if (updates.strength !== undefined) {
   432	      parts.push('strength = ?');
   433	      params.push(Math.max(0, Math.min(1, updates.strength)));
   434	    }
   435	    if (updates.evidence !== undefined) {
   436	      parts.push('evidence = ?');
   437	      params.push(updates.evidence);
   438	    }
   439	
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/04-weight-history-audit-tracking.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Weight history audit tracking

## Current Reality

Every causal edge now carries `created_by` and `last_accessed` metadata fields tracking who created the edge and when it was last used. All strength modifications are logged to a `weight_history` table recording old strength, new strength, the actor (`changed_by`), timestamp and reason.

Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). A `rollbackWeights()` function restores edges from weight history with a fallback to the oldest entry if timestamp matching fails due to same-millisecond updates.

This audit infrastructure supports the N3-lite consolidation engine: Hebbian strengthening, staleness detection and edge bounds enforcement all rely on accurate weight history and provenance tracking.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"degree_snapshots|snapshotDegrees|computeMomentum|computeMomentumScores|SPECKIT_GRAPH_SIGNALS|0\\.05|7 days|clearGraphSignalsCache|cache\" .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Graph Signals
     3	// ---------------------------------------------------------------
     4	// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
     5	// ---------------------------------------------------------------
     6	
     7	// ---------------------------------------------------------------------------
     8	// 1. IMPORTS
     9	// ---------------------------------------------------------------------------
    10	
    11	import type Database from 'better-sqlite3';
    12	
    13	// ---------------------------------------------------------------------------
    14	// 2. SESSION CACHE
    15	// ---------------------------------------------------------------------------
    16	
    17	/** Maximum number of entries allowed in each session-scoped cache. */
    18	const CACHE_MAX_SIZE = 10000;
    19	
    20	/** Session-scoped cache for momentum scores (memoryId -> momentum). */
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:54:import { isEnabled as isCoActivationEnabled, spreadActivation, CO_ACTIVATION_CONFIG } from '../../cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:55:import type { SpreadResult } from '../../cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:56:import * as fsrsScheduler from '../../cache/cognitive/fsrs-scheduler';
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:4:// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:17:/** Maximum number of entries allowed in each session-scoped cache. */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:20:/** Session-scoped cache for momentum scores (memoryId -> momentum). */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:23:/** Session-scoped cache for causal depth scores (memoryId -> normalized depth). */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:27: * Evict entries from a cache when it exceeds the size bound.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:28: * Clears the entire cache when the limit is exceeded, since Map
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:32:function enforceCacheBound(cache: Map<number, number>): void {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:33:  if (cache.size > CACHE_MAX_SIZE) {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:34:    cache.clear();
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:39: * Clear both session-scoped caches. Call at session boundaries or when
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:42:export function clearGraphSignalsCache(): void {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:53: * in at least one causal edge. Writes into the `degree_snapshots` table
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:58:export function snapshotDegrees(db: Database.Database): { snapshotted: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:77:      INSERT OR REPLACE INTO degree_snapshots (memory_id, degree_count, snapshot_date)
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:96:    console.warn(`[graph-signals] snapshotDegrees failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:126: * Get the degree of a memory node from 7 days ago, as recorded in the
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:127: * degree_snapshots table.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts | sed -n '340,430p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   340	
   341	// ---------------------------------------------------------------------------
   342	// 6. COMBINED APPLICATION
   343	// ---------------------------------------------------------------------------
   344	
   345	/**
   346	 * Clamp a value to [min, max].
   347	 */
   348	function clamp(value: number, min: number, max: number): number {
   349	  return Math.min(max, Math.max(min, value));
   350	}
   351	
   352	/**
   353	 * Apply graph signal adjustments to scored search result rows.
   354	 *
   355	 * For each row:
   356	 * - Momentum bonus: clamp(momentum * 0.01, 0, 0.05) — rewards nodes gaining connections
   357	 * - Depth bonus: normalizedDepth * 0.05 — rewards structurally deep nodes
   358	 *
   359	 * Both bonuses are additive to the existing score.
exec
/bin/zsh -lc "rg -n \"SPECKIT_GRAPH_SIGNALS|applyGraphSignals\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:590:      const signaled = applyGraphSignals(results, db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:138: * Default: TRUE (enabled). Set SPECKIT_GRAPH_SIGNALS=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:141:  return isFeatureEnabled('SPECKIT_GRAPH_SIGNALS');
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '560,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   560	      }
   561	    } catch (err: unknown) {
   562	      // AI-GUARD: Non-critical enrichment — co-activation failure does not affect core ranking
   563	      const message = err instanceof Error ? err.message : String(err);
   564	      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
   565	    }
   566	  }
   567	
   568	  // -- 2b. Community co-retrieval (N2c) --
   569	  // Inject community co-members into result set before graph signals
   570	  // so injected rows also receive momentum/depth adjustments.
   571	  if (isCommunityDetectionEnabled()) {
   572	    try {
   573	      const db = requireDb();
   574	      const boosted = applyCommunityBoost(results, db);
   575	      if (boosted.length > results.length) {
   576	        results = boosted as PipelineRow[];
   577	        (metadata as Record<string, unknown>).communityBoostApplied = true;
   578	      }
   579	    } catch (err: unknown) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"largest connected component|50%|Louvain|community_assignments|storeCommunityAssignments|debounce|applyCommunityBoost|0\\.3x|3 community|SPECKIT_COMMUNITY_DETECTION\" .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Community Detection
     3	// ---------------------------------------------------------------
     4	// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
     5	// ---------------------------------------------------------------
     6	
     7	// ---------------------------------------------------------------------------
     8	// 1. IMPORTS
     9	// ---------------------------------------------------------------------------
    10	
    11	import type Database from "better-sqlite3";
    12	
    13	// ---------------------------------------------------------------------------
    14	// 2. TYPES
    15	// ---------------------------------------------------------------------------
    16	
    17	/** Adjacency list: node ID (string) -> set of neighbor node IDs */
    18	type AdjacencyList = Map<string, Set<string>>;
    19	
    20	// ---------------------------------------------------------------------------
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:65:import { applyCommunityBoost } from '../../graph/community-detection';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:574:      const boosted = applyCommunityBoost(results, db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:145: * N2c: Community detection (BFS connected components + Louvain escalation).
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:146: * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_DETECTION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:149:  return isFeatureEnabled('SPECKIT_COMMUNITY_DETECTION');
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:4:// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:43: * Reset module-level debounce state. Exported for testing only.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:140: * Check whether the largest connected component contains >50% of all nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:141: * If true, the graph is poorly partitioned and Louvain should be attempted.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:143:export function shouldEscalateToLouvain(
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:166: * Pure-TypeScript single-level Louvain modularity optimisation.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:184: *   simplified to the standard Louvain ΔQ formula.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:186:export function detectCommunitiesLouvain(
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:319: * 2. If the largest component holds >50 % of nodes, escalate to Louvain
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:326:    // AI-WHY: Fix #27 (017-refinement-phase-6) — Replace edge-count-only debounce
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:348:    // Build adjacency list once and reuse for both BFS and potential Louvain
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:355:    if (shouldEscalateToLouvain(bfsResult)) {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:357:      finalResult = detectCommunitiesLouvain(adj);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:362:    // --- Update debounce state -----------------------------------------------
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:377: * escalation to Louvain is needed.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts | sed -n '420,570p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   420	
   421	/**
   422	 * Load previously stored community assignments from the database.
   423	 */
   424	function loadStoredAssignments(db: Database.Database): Map<string, number> {
   425	  const result = new Map<string, number>();
   426	  try {
   427	    const rows = db
   428	      .prepare("SELECT memory_id, community_id FROM community_assignments")
   429	      .all() as Array<{ memory_id: number; community_id: number }>;
   430	
   431	    for (const row of rows) {
   432	      result.set(String(row.memory_id), row.community_id);
   433	    }
   434	  } catch (error: unknown) {
   435	    const message = error instanceof Error ? error.message : String(error);
   436	    console.warn(`[community-detection] Failed to load stored assignments: ${message}`);
   437	  }
   438	  return result;
   439	}
exec
/bin/zsh -lc 'rg -n "Fix #24|Fix #25|Fix #27|Fix #28|Fix #29|Fix #30|Fix #32|maxDepth|clearRelatedCache|self-loops|self-loop|DECAY_FLOOR|turnDecayFactor|cleanupOrphanedEdges|computedThisSession|count:maxId|edgeChecksum" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:9:import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:54:    clearRelatedCache();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:614:    const resumeContextItems = workingMemory.getSessionPromptContext(requestedSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:315:    const turnDecayFactor = turnNumber > 1
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:330:        effectiveRetrievability *= turnDecayFactor;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:333:          // AI-WHY: Fix #30 (017-refinement-phase-6) — WM already applies its own decay.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:334:          // Multiplying by turnDecayFactor again causes double-decay.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:342:        attentionScore = baseScore * turnDecayFactor;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:394:  // AI-WHY: Fix #28 (017-refinement-phase-6) — cleanupOrphanedEdges was exported but
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:401:      const orphanResult = causalEdges.cleanupOrphanedEdges();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:54:  maxDepth?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:88:  maxDepth: number,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:122:      // Check if we hit max depth (any child at maxDepth-1 with children means we capped)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:123:      if (child.depth >= maxDepth - 1 && child.children.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:126:        if (child.depth >= maxDepth - 1) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:245:    maxDepth: rawMaxDepth = 3,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:250:  // AI-WHY: Fix #25 (017-refinement-phase-6) — Clamp maxDepth to [1, 10] server-side
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:251:  const maxDepth = Math.min(Math.max(1, Math.floor(rawMaxDepth)), 10);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:306:      const forwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:307:      const backwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
exec
/bin/zsh -lc 'rg -n "clearRelatedCache" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:9:import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:54:    clearRelatedCache();
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts | sed -n '1,300p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"25%|capped at 5|2 hops|0\\.05|0\\.20|SPECKIT_CAUSAL_BOOST|recursive CTE|relation-type|supersedes|leads_to|relates_to|session boost\" .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Causal Boost
     3	// ---------------------------------------------------------------
     4	// Graph-traversal score boosting via causal edge relationships.
     5	// Walks the causal_edges graph up to MAX_HOPS, amplifying scores
     6	// for results related to top seed results via weighted CTE.
     7	// ---------------------------------------------------------------
     8	
     9	import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';
    10	
    11	import type Database from 'better-sqlite3';
    12	
    13	/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */
    14	const MAX_HOPS = 2;
    15	/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
    16	const MAX_BOOST_PER_HOP = 0.05;
    17	/** Combined causal + session boost ceiling to prevent runaway amplification. */
    18	const MAX_COMBINED_BOOST = 0.20;
    19	/** Top fraction of result set used as graph walk seed nodes. */
    20	const SEED_FRACTION = 0.25;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:511:      console.warn(`[stage2-fusion] session boost failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:517:  // top results after session boost has re-ordered them.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13:/** Maximum graph traversal depth. Beyond 2 hops, signal degrades and queries become expensive. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:15:/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:16:const MAX_BOOST_PER_HOP = 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:17:/** Combined causal + session boost ceiling to prevent runaway amplification. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:18:const MAX_COMBINED_BOOST = 0.20;
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:26: * Applied during CTE accumulation so stronger relation types (supersedes)
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:30:  supersedes: 1.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:59:  return isFeatureEnabled('SPECKIT_CAUSAL_BOOST');
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:118:  // 'supersedes' edges get 1.5x, 'contradicts' 0.8x, others 1.0x.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:122:             (CASE WHEN ce.relation = 'supersedes' THEN 1.5
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:131:             (CASE WHEN ce.relation = 'supersedes' THEN 1.5
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:145:             (cw.walk_score * CASE WHEN ce.relation = 'supersedes' THEN 1.5
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"1 hour|24 hours|0\\.15|0\\.50|buildSpecFolderTimeline|queryTemporalNeighbors|temporal contiguity|window|boost\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts .opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:63:    it('T502-01: Adjacent memories get contiguity boost', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:71:      const boosted = mod.vectorSearchWithContiguity(results_arr, 3600); // 1-hour window
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:72:      const mem2 = boosted!.find((r: { id: number }) => r.id === 2);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:78:    it('T502-02: Time window filtering excludes distant memories', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:85:      // Use a 30-minute window - memory 2 is outside
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:86:      const boosted = mod.vectorSearchWithContiguity(results_arr, 1800);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:87:      const mem2 = boosted!.find((r: { id: number }) => r.id === 2);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:90:      // Memory 2 should NOT get a significant boost (outside window)
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:91:      // It may stay at 50 or get a small boost depending on implementation
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:95:    it('T502-03: Non-adjacent memories excluded from boost', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:102:      const boosted = mod.vectorSearchWithContiguity(results_arr, 3600); // 1 hour window
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:103:      const mem2 = boosted!.find((r: { id: number }) => r.id === 2);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:106:      // 2 days away from anchor, should not get boosted beyond original
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:137:    it('T502-05: Get temporal neighbors within window', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:140:      const neighbors = mod.getTemporalNeighbors(1, 3600); // 1-hour window
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:150:      const neighbors = mod.getTemporalNeighbors(1, 86400); // 24-hour window
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:14:export const DEFAULT_WINDOW = 3600;   // 1 hour in seconds
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:15:export const MAX_WINDOW = 86400;      // 24 hours in seconds
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:17:const BOOST_FACTOR = 0.15;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:18:// AI-WHY: Cap the cumulative contiguity boost per result so that a cluster of
codex
I’m seeing the same pattern in category 10: a number of descriptions are directionally right, but several source tables are pointing at compatibility shims or unrelated helpers instead of the modules that actually wire the feature into ranking. Next I’m validating the scoring/calibration set, where there are more high-reference files and a couple of known path issues.
exec
/bin/zsh -lc "python3 -c 'from pathlib import Path
import re
base=Path(\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration\")
for path in sorted(base.glob(\"*.md\")):
    text=path.read_text()
    current=re.search(r\"## Current Reality\\n\\n(.*?)\\n\\n## Source Files\", text, re.S).group(1).strip()
    print(f\"=== {path.name} ===\")
    print(current)
    print()'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 596ms:
=== 01-score-normalization.md ===
The RRF fusion system and composite scoring system had a 15:1 magnitude mismatch. RRF scores fell in the 0-0.07 range while composite scores covered the full 0-1 range. Composite dominated purely because of scale, not because it was better.

Min-max normalization now maps both outputs to a 0-1 range, letting actual relevance determine ranking instead of which scoring system happens to produce larger numbers. Single-result queries and equal-score edge cases normalize to 1.0.

The normalization is batch-relative (the same memory can score differently across different queries), which is expected behavior for min-max. Runs behind the `SPECKIT_SCORE_NORMALIZATION` flag.

=== 02-cold-start-novelty-boost.md ===
FSRS temporal decay biases against recent items. A memory indexed 2 hours ago has barely any retrievability score, even when it is exactly what you need.

The novelty boost applies an exponential decay (`0.15 * exp(-elapsed_hours / 12)`) to memories under 48 hours old, counteracting that bias. At indexing time, the boost is 0.15. After 12 hours, it drops to about 0.055. By 48 hours, it is effectively zero.

The boost applies before FSRS decay and caps the composite score at 0.95 to prevent runaway inflation. One side effect: memories with high base scores (above 0.80) see diminished effective boost because the cap clips them. That is intentional. High-scoring memories do not need extra help.

**Sprint 8 update:** The `calculateNoveltyBoost()` call was removed from the hot scoring path in `composite-scoring.ts` because evaluation showed it always returned 0. The function definition remains but is no longer invoked during search. Telemetry fields are hardcoded to `noveltyBoostApplied: false, noveltyBoostValue: 0` for log schema compatibility.

=== 03-interference-scoring.md ===
Memories in dense similarity clusters tend to crowd out unique results. If you have five near-identical memories about the same topic, all five can occupy the top results and push out a different memory that might be more relevant.

Interference scoring penalizes cluster density: for each memory, the system counts how many neighbors exceed a 0.75 text similarity threshold (Jaccard over word tokens from title and trigger phrases) within the same spec folder, then applies a `-0.08 * interference_score` penalty in composite scoring. (Novelty boost remains disabled in the hot path.)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "SPECKIT_SCORE_NORMALIZATION|normalizeCompositeScores|min-max|single-result|equal-score|score normalization|15:1|normalize" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts .opencode/skill/system-spec-kit/shared/normalization.ts .opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Composite Scoring
     3	// ---------------------------------------------------------------
     4	import { getTierConfig } from './importance-tiers';
     5	import { calculatePopularityScore } from '../storage/access-tracker';
     6	// HIGH-003 FIX: Import unified recency scoring from folder-scoring
     7	import { computeRecencyScore, DECAY_RATE } from './folder-scoring';
     8	// TM-01: Interference scoring penalty (Sprint 2, T005)
     9	import { applyInterferencePenalty, INTERFERENCE_PENALTY_COEFFICIENT } from './interference-scoring';
    10	// T010: Scoring observability (N4 + TM-01 logging, 5% sampled)
    11	import { shouldSample, logScoringObservation } from '../telemetry/scoring-observability';
    12	
    13	import type { MemoryDbRow } from '@spec-kit/shared/types';
    14	
    15	/**
    16	 * Loose input type for scoring functions.
    17	 * Accepts any partial DB row plus arbitrary extra fields (camelCase
    18	 * fallbacks, search-enriched properties like similarity, etc.).
    19	 */
    20	export type ScoringInput = Partial<MemoryDbRow> & Record<string, unknown>;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:29:  normalizeRrfScores,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:33:  normalizeCompositeScores,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:57:/** Build a FusionResult stub for normalizeRrfScores tests. */
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:73:  const originalEnv = process.env.SPECKIT_SCORE_NORMALIZATION;
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:77:      delete process.env.SPECKIT_SCORE_NORMALIZATION;
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:79:      process.env.SPECKIT_SCORE_NORMALIZATION = originalEnv;
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:83:  describe('normalizeRrfScores (direct)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:84:    it('normalizes scores to [0,1] range', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:91:      normalizeRrfScores(results);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:105:    it('single result normalizes to 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:107:      normalizeRrfScores(results);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:111:    it('equal scores normalize to 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:118:      normalizeRrfScores(results);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:127:      normalizecontext compacted
codex
I’ve finished most of categories 09 and 10, and I’m moving through the remaining graph/temporal and scoring files now. Next I’m reading the last untouched feature docs and their referenced implementation modules so the final audit stays evidence-based rather than inferred.
exec
/bin/zsh -lc 'rg -n "''^export function|''^export async function|const [A-Z_]+ =|SPECKIT_|ENABLE_|CURRENT_REALITY|momentum|temporal|rerank|score|calibr|fallback|llama|gguf|route|composite|novelty|deterministic|recency|wm|fusion" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/shared --glob '"'"'!**/*.map'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 3664

.opencode/skill/system-spec-kit/shared/mcp_server/database/README.md:32:**Path resolution:** `shared/config.ts` resolves this directory by walking up from `__dirname` to find `mcp_server/database/`. The path can be overridden with the `SPEC_KIT_DB_DIR` or `SPECKIT_DB_DIR` environment variable.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:34:const MAX_INGEST_PATHS = 100;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:35:const MAX_PATH_LENGTH = 500;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:38:const NANOID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:174:const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:178:const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:179:const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:247:const SCHEMA_SQL = `
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:547:    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:548:    const wmResult = wmStmt.run(cutoffIso);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:549:    workingMemoryDeleted = wmResult.changes;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:618:    } catch (wmErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:619:      const wmMsg = wmErr instanceof Error ? wmErr.message : String(wmErr);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:620:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:720:const SESSION_STATE_SCHEMA_SQL = `
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:818:    } catch (wmErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:819:      const wmMsg = wmErr instanceof Error ? wmErr.message : String(wmErr);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:820:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
codex
I’ve isolated the remaining untouched docs, and I’m pulling their `Current Reality` sections plus the first implementation files now. The path check is clean except for the known `retry.vitest.ts` typo, so the remaining work is mostly description-vs-code validation and missing-capability detection.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\"); const dirs=[\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation\",\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration\"]; for(const dir of dirs){ console.log(\"DIR \"+dir); for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){ const p=path.join(dir,f); const text=fs.readFileSync(p,\"utf8\"); const m=text.match(/## Current Reality\\n([\\s\\S]*?)(?:\\n## |"'$)/); const current=(m?m[1].trim().replace(/'"\\n+/g,\" | \"):\"NO CURRENT REALITY\"); console.log(\"FILE \"+f); console.log(current); } }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
DIR .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation
FILE 01-typed-weighted-degree-channel.md
A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone. | Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. When a memory has zero edges, the channel returns 0 rather than failing.
FILE 02-co-activation-boost-strength-increase.md
The co-activation boost multiplier jumped from 0.1x to 0.25-0.3x. At 0.1x, the graph signal investment was barely visible in retrieval results, roughly 5% effective contribution at hop 2. | The new multiplier targets 15% or higher contribution, which is enough to matter without overwhelming the vector and lexical channels. You can tune the exact value through the `SPECKIT_COACTIVATION_STRENGTH` environment variable. A dark-run measurement sequence isolates A7 contribution by comparing R4-only results against R4+A7 results.
FILE 03-edge-density-measurement.md
The current density metric used by runtime guards is global edge density: `total_edges / total_memories` from the graph tables. If density is too low, graph-derived gains are naturally limited; if density is too high, entity-linking creation is gated by the configured density threshold. Earlier "edges-per-node" phrasing is still useful intuition, but runtime checks now use the global-density denominator for consistency.
FILE 04-weight-history-audit-tracking.md
Every causal edge now carries `created_by` and `last_accessed` metadata fields tracking who created the edge and when it was last used. All strength modifications are logged to a `weight_history` table recording old strength, new strength, the actor (`changed_by`), timestamp and reason. | Edge bounds are enforced at insert time. Auto-generated edges (those with `created_by='auto'`) are rejected when a node already has 20 edges (`MAX_EDGES_PER_NODE`) and clamped to a maximum strength of 0.5 (`MAX_AUTO_STRENGTH`). A `rollbackWeights()` function restores edges from weight history with a fallback to the oldest entry if timestamp matching fails due to same-millisecond updates. | This audit infrastructure supports the N3-lite consolidation engine: Hebbian strengthening, staleness detection and edge bounds enforcement all rely on accurate weight history and provenance tracking.
FILE 05-graph-momentum-scoring.md
Graph connectivity changes over time, and that trajectory carries signal. A memory gaining three new edges this week is more actively relevant than one whose connections have been static for months. | Graph momentum computes a temporal degree delta: `current_degree - degree_7d_ago`. The `degree_snapshots` table records per-node degree counts at daily granularity with a UNIQUE constraint on `(memory_id, snapshot_date)`. The `snapshotDegrees()` function captures the current state, and `computeMomentum()` looks back 7 days to calculate the delta. | The momentum signal applies as an additicontext compacted
codex
I’ve finished the broad pass on categories 09 and 10 and confirmed the known bad `retry.vitest.ts` references. I’m closing the remaining gaps in category 11 now, plus the anchor-node feature in category 10, so the final audit can be complete and file-by-file.
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/parsing/anchor-chunker.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' '.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' '.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Embedding Cache
// ---------------------------------------------------------------
import { createHash } from 'crypto';
import type Database from 'better-sqlite3';

/* --- 1. INTERFACES --- */

interface EmbeddingCacheEntry {
  contentHash: string;
  modelId: string;
  embedding: Buffer;
  dimensions: number;
  createdAt: string;
  lastUsedAt: string;
}

interface EmbeddingCacheStats {
  totalEntries: number;
  totalSizeBytes: number;
exec
/bin/zsh -lc "sed -n '1,340p' '.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/mcp_server/lib/parsing/anchor-metadata.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/anchor-chunker.ts: No such file or directory
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Intent Classifier
// ---------------------------------------------------------------
/* --- 1. TYPES & CONSTANTS --- */

type IntentType = 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';

interface IntentResult {
  intent: IntentType;
  confidence: number;
  scores: Record<IntentType, number>;
  keywords: string[];
}

interface IntentWeights {
  recency: number;
  importance: number;
  similarity: number;
  contextType: string | null;
}
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Auto Promotion
// ---------------------------------------------------------------
//
// Promotes memory importance tier based on positive validation count:
// - >=5 positive validations: normal -> important
// - >=10 positive validations: important -> critical
// - Below threshold: no change (no-op)
//
// Does NOT demote -- only promotes upward.
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

export type { Database };

 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Folder Relevance
// ---------------------------------------------------------------
// Computes folder-level relevance scores from individual memory
// scores using damped aggregation: FolderScore = (1/sqrt(M+1)) * SUM(score(m))
//
// Gated behind SPECKIT_FOLDER_SCORING env var (default: disabled).
// Pure scoring addition — NO schema changes, NO new tables.
//
// References:
//   - PI-A1: Folder-level relevance scoring via DocScore aggregation
//   - R-006: Weight rebalancing surface
//   - R-007: Post-reranker stage in scoring pipeline
// ---------------------------------------------------------------

// Type-only
import type Database from 'better-sqlite3';

/* -----------------------------------------------------------
   1. FEATURE FLAG
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Mpab Aggregation
// ---------------------------------------------------------------
// Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation.
// Pipeline position: after RRF fusion, before state filtering.
// Feature flag: SPECKIT_DOCSCORE_AGGREGATION (default OFF)

/* --- 1. TYPES --- */

/**
 * Result of MPAB aggregation for a single parent memory.
 * Contains the aggregated score and metadata about the chunks
 * that contributed to it.
 */
export interface MpabResult {
  /** Unique identifier of the parent memory document. */
  parentMemoryId: number | string;
  /** MPAB-aggregated score: sMax + 0.3 * sum(remaining) / sqrt(N). */
  mpabScore: number;
  /** Number of chunk hits that contributed to this score. */
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: K-Value Sensitivity Analysis (T004a)
// ---------------------------------------------------------------
// Measures the impact of different RRF K-values on ranking stability.
// This is a measurement/analysis tool, not production code.
// ---------------------------------------------------------------

import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Result metrics for a single K-value configuration. */
interface KValueMetrics {
  /** Mean Reciprocal Rank at cutoff 5, estimated against baseline ranking. */
  mrr5: number;
  /** Kendall tau rank correlation with the baseline (K=60) ranking. */
  kendallTau: number;
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------
// Sprint 5 (R6): Stage interfaces with Stage 4 immutability invariant
// ---------------------------------------------------------------

import type { RetrievalTrace } from '@spec-kit/shared/contracts/retrieval-trace';

/**
 * Memory search row — the canonical internal result type flowing through the pipeline.
 * Extends Record<string, unknown> for backward compatibility with existing code.
 */
export interface PipelineRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  score?: number;
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  attentionScore?: number;
 succeeded in 50ms:
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
// MODULE: RSF Fusion
// ---------------------------------------------------------------
import type { RrfItem, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';

/* --- 1. INTERFACES --- */

/** Result of RSF fusion: an RrfItem augmented with normalized fused score and source tracking. */
interface RsfResult extends RrfItem {
  /** Relative Score Fusion score, clamped to [0, 1]. */
  rsfScore: number;
  /** Sources that contributed to this result. */
  sources: string[];
  /** Per-source normalized scores. */
  sourceScores: Record<string, number>;
}

/* --- 2. HELPERS --- */

/**
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Fsrs Scheduler
// ---------------------------------------------------------------
// AI-GUARD: CANONICAL FSRS CONSTANTS & ALGORITHM
// Free Spaced Repetition Scheduler v4 algorithm implementation
//
// T301: TWO-DOMAIN DECAY MODEL (Single Source of Truth)
// -----------------------------------------------------
// Long-term memory (this file):
//   FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
//   Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
// All long-term decay consumers MUST import constants from this file.
//
// Working memory (working-memory.ts — separate system, intentionally decoupled):
//   Linear multiplicative: score * 0.95 per tick
//   Timescale: minutes. Operates on session-scoped attention scores only.
//
// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
// algorithm. All temporal decay for persistent memories should route
// through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
 succeeded in 51ms:
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
 succeeded in 50ms:
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
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: RRF Fusion
// ---------------------------------------------------------------
// Reciprocal Rank Fusion for combining search results
// P3-11: TypeScript source (previously orphaned .js only)

/* --- 1. CONSTANTS --- */

const SOURCE_TYPES = {
  VECTOR: 'vector',
  FTS: 'fts',
  BM25: 'bm25',
  GRAPH: 'graph',
  DEGREE: 'degree',
  KEYWORD: 'keyword',
} as const;

// AI-WHY: K=60 is the standard RRF constant from Cormack et al. (2009); higher K
// flattens rank differences, reducing the dominance of top-1 results. 60 balances
// discrimination vs. stability for our typical 10-50 candidate lists.
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Quality Loop (T008)
// ---------------------------------------------------------------

import { initEvalDb } from '../lib/eval/eval-db';

interface QualityScoreBreakdown {
  triggers: number;
  anchors: number;
  budget: number;
  coherence: number;
}

interface QualityScore {
  total: number;
  breakdown: QualityScoreBreakdown;
  issues: string[];
}

interface QualityLoopResult {
 exited 1 in 51ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/anchor-metadata.ts: No such file or directory
codex
I hit two path misses while checking the anchor-node feature, so I’m tracing where the anchor parsing code actually lives before I mark that file. In parallel I’m filling in the last scoring features that still need direct code evidence.
exec
/bin/zsh -lc "sed -n '260,420p' '.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared' | rg 'anchor|Anchor'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '260,520p' '.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    );

    return check;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[auto-promotion] executeAutoPromotion failed for memory ${memoryId}: ${msg}`);
    return {
      promoted: false,
      previousTier: 'unknown',
      newTier: 'unknown',
      validationCount: 0,
      reason: 'error',
    };
  }
}

/**
 * Batch check all memories for auto-promotion eligibility.
 * Returns a list of memories that qualify for promotion.
 * Does NOT modify the database -- read-only scan.
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
exec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
  const coherenceResult = scoreCoherence(content);

  const total =
    triggerResult.score * QUALITY_WEIGHTS.triggers +
    anchorResult.score * QUALITY_WEIGHTS.anchors +
    budgetResult.score * QUALITY_WEIGHTS.budget +
    coherenceResult.score * QUALITY_WEIGHTS.coherence;

  return {
    total: Math.round(total * 1000) / 1000, // 3 decimal places
    breakdown: {
      triggers: triggerResult.score,
      anchors: anchorResult.score,
      budget: budgetResult.score,
      coherence: coherenceResult.score,
    },
    issues: [
      ...triggerResult.issues,
      ...anchorResult.issues,
      ...budgetResult.issues,
exec
/bin/zsh -lc "rg -n \"embedding cache|embedding_cache|lookupEmbedding|storeEmbedding|evictOldEntries|getCacheStats|computeContentHash\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"tool cache|ENABLE_TOOL_CACHE|TOOL_CACHE_TTL_MS|invalidateOnWrite|withCache|startCleanupTimer|stopCleanupTimer|getStats\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"classification decay|getClassificationDecayMultiplier|SPECKIT_CLASSIFICATION_DECAY|IMPORTANCE_TIER_STABILITY_MULTIPLIER|CONTEXT_TYPE_STABILITY_MULTIPLIER\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"auto-promotion|executeAutoPromotion|checkAutoPromotion|scanForPromotions|memory_promotion_audit|PROMOTE_TO_IMPORTANT_THRESHOLD|PROMOTE_TO_CRITICAL_THRESHOLD\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"folder scoring|twoPhaseRetrieval|computeFolderRelevanceScores|isFolderScoringEnabled|SPECKIT_FOLDER_SCORING|lookupFolders|enrichResultsWithFolderScores\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"resolveEffectiveScore|stage2Score|Stage4ReadonlyRow|read-only|immutability invariant\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"fuseResultsRsf|rsfScore|fuseResultsRsfMulti|minMaxNormalize|single-source penalty\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"local reranker|RERANKER_LOCAL|SPECKIT_RERANKER_MODEL|SPECKIT_RERANKER_TIMEOUT_MS|canUseLocalReranker|rerankLocal|disposeLocalReranker\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"K_VALUE|K_VALUES|BASELINE_K|analyzeKValueSensitivity|kendallTau|mrr5\" '.opencode/skill/system-spec-kit/mcp_server' '.opencode/skill/system-spec-kit/shared'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Temporal-structural coherence scoring

## Current Reality

The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in its quality score breakdown. The coherence score measures how well a memory's content structure aligns with its temporal context — whether the claimed relationships (references to other memories, spec folder associations, causal links) are consistent with the chronological ordering of events. Incoherent memories that reference future events or claim relationships with non-existent predecessors receive a lower coherence score, which reduces their overall quality assessment.

The coherence signal feeds into the composite quality score alongside trigger coverage, anchor density, and token budget efficiency. A low coherence score can trigger a quality loop rejection, preventing temporally inconsistent content from entering the index.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop with coherence scoring |

### Tests

| File | Focus |
|------|-------|
 succeeded in 50ms:
# Auto-promotion on validation

## Current Reality

Positive validations now trigger automatic tier promotion. When a normal-tier memory accumulates 5 positive validations, it is promoted to important. When an important-tier memory reaches 10, it is promoted to critical. A throttle safeguard limits promotions to 3 per 8-hour rolling window to prevent runaway promotion during bulk validation sessions.

Constitutional, critical, temporary and deprecated tiers are non-promotable. Each promotion is logged to a `memory_promotion_audit` table for traceability. The `memory_validate` response includes `autoPromotion` metadata showing whether promotion was attempted, the previous and new tier, validation count and the reason.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/auto-promotion.ts` | Lib | Auto-promotion on validation |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/types.ts` | Shared | Type definitions |

 succeeded in 52ms:
Total output lines: 162

.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:8:  lookupEmbedding,
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:9:  storeEmbedding,
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:10:  evictOldEntries,
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:11:  getCacheStats,
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:13:  computeContentHash,
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:43:      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='embedding_cache'")
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:53:      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='embedding_cache'")
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:59:  // T015-02: storeEmbedding + lookupEmbedding round-trip works
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:62:    const hash = computeContentHash('hello world');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:67:    storeEmbedding(db, hash, model, embedding, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:68:    const result = lookupEmbedding(db, hash, model);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:81:    const result = lookupEmbedding(db, 'nonexistent_hash', 'any-model');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:89:    const hash = computeContentHash('same content');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:93:    storeEmbedding(db, hash, 'model-A', embedding, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:96:    const result = lookupEmbedding(db, hash, 'model-B');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:100:    const hit = lookupEmbedding(db, hash, 'model-A');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:105:  // T015-05: lookupEmbedding updates last_used_at on hit
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:107:  it('T015-05: lookupEmbedding updates last_used_at on hit', () => {
 succeeded in 51ms:
# Double intent weighting investigation

## Current Reality

A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.

System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.

A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The 4-stage pipeline (R6) resolved this structurally: Stage 2 applies intent weights only for non-hybrid search types via an `isHybrid` boolean gate, so the code path for double-weighting is absent by design.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection |

### Tests

 succeeded in 50ms:
# ANCHOR tags as graph nodes

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Promoting parsed ANCHOR markers into typed graph nodes (most creative insight from cross-AI research, Gemini-2) is deferred behind a dedicated 2-day feasibility spike. Estimated effort: S-M (3-5 days).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata extraction |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

| File | Focus |
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:14:import { executeAutoPromotion } from '../lib/search/auto-promotion';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:354:    const promotionResult = executeAutoPromotion(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:21:/** Result of an auto-promotion check. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:40:export const PROMOTE_TO_IMPORTANT_THRESHOLD = 5;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:43:export const PROMOTE_TO_CRITICAL_THRESHOLD = 10;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:47:  normal: { target: 'important', threshold: PROMOTE_TO_IMPORTANT_THRESHOLD },
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:48:  important: { target: 'critical', threshold: PROMOTE_TO_CRITICAL_THRESHOLD },
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:93:  CREATE TABLE IF NOT EXISTS memory_promotion_audit (
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:110:    'SELECT COUNT(*) AS count FROM memory_promotion_audit WHERE promoted_at >= ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:120: * Check if a memory qualifies for auto-promotion based on its positive validation count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:127:export function checkAutoPromotion(db: Database, memoryId: number): AutoPromotionResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:195:    console.error(`[auto-promotion] checkAutoPromotion failed for memory ${memoryId}: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:207: * Execute auto-promotion for a memory if it qualifies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:218:export function executeAutoPromotion(db: Database, memoryId: number): AutoPromotionResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:220:    const check = checkAutoPromotion(db, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:246:      INSERT INTO memory_promotion_audit
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:258:      `[auto-promotion] Memory ${memoryId} promoted: ${check.previousTier} -> ${check.newTier} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:265:    console.error(`[auto-promotion] executeAutoPromotion failed for memory ${memoryId}: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:277: * Batch check all memories for auto-promotion eligibility.
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:284:export function scanForPromotions(db: Database): AutoPromotionResult[] {
 succeeded in 50ms:
.opencode/skill/system-spec-kit/shared/types.ts:299:/** Archive pattern with multiplier for folder scoring */
.opencode/skill/system-spec-kit/shared/README.md:230:| `scoring/folder-scoring.ts` | Composite folder scoring and ranking |
.opencode/skill/system-spec-kit/mcp_server/README.md:665:│   ├── scoring/            # Composite scoring, tiers, folder scoring, interference scoring
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:737:    SPECKIT_FOLDER_SCORING: process.env.SPECKIT_FOLDER_SCORING,
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:770:  it('S1-FIX-02: folder scoring integrates into hybrid runtime behind feature flag', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:771:    process.env.SPECKIT_FOLDER_SCORING = 'true';
.opencode/skill/system-spec-kit/shared/scoring/README.md:5:  - "folder scoring"
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:149:    it('T-FS-11: archive folder scoring works', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:11:  isFolderScoringEnabled,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:12:  computeFolderRelevanceScores,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:13:  lookupFolders,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:14:  enrichResultsWithFolderScores,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:15:  twoPhaseRetrieval,
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:59:      const scores = computeFolderRelevanceScores(results, folderMap);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:73:      const scores = computeFolderRelevanceScores(results, folderMap);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:99:      const scores = computeFolderRelevanceScores(results, folderMap);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:141:      const scores = computeFolderRelevanceScores(results, folderMap);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:164:      const scores = computeFolderRelevanceScores(results, folderMap);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:179:      const scores = computeFolderRelevanceScores([], new Map());
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:187:      const scores = computeFolderRelevanceScores(results, folderMap);
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:755:| `SPECKIT_CLASSIFICATION_DECAY`  | `true`  | TM-03 FSRS tier/context decay |
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:193:    it('T418c: classification decay path applies when enabled (no double decay)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:194:      const previousFlag = process.env.SPECKIT_CLASSIFICATION_DECAY
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:195:      process.env.SPECKIT_CLASSIFICATION_DECAY = 'true'
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:208:        // Expected path with classification decay:
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:215:          delete process.env.SPECKIT_CLASSIFICATION_DECAY
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:217:          process.env.SPECKIT_CLASSIFICATION_DECAY = previousFlag
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:4:// Tests for CONTEXT_TYPE_STABILITY_MULTIPLIER,
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:5:// IMPORTANCE_TIER_STABILITY_MULTIPLIER, getClassificationDecayMultiplier,
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:6:// applyClassificationDecay, and the SPECKIT_CLASSIFICATION_DECAY feature flag.
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:10:  CONTEXT_TYPE_STABILITY_MULTIPLIER,
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:11:  IMPORTANCE_TIER_STABILITY_MULTIPLIER,
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:12:  getClassificationDecayMultiplier,
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:22:  const original = process.env.SPECKIT_CLASSIFICATION_DECAY;
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:24:    delete process.env.SPECKIT_CLASSIFICATION_DECAY;
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:26:    process.env.SPECKIT_CLASSIFICATION_DECAY = value;
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:32:      delete process.env.SPECKIT_CLASSIFICATION_DECAY;
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:34:      process.env.SPECKIT_CLASSIFICATION_DECAY = original;
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:44:    expect(IMPORTANCE_TIER_STABILITY_MULTIPLIER['constitutional']).toBe(Infinity);
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:48:    expect(IMPORTANCE_TIER_STABILITY_MULTIPLIER['critical']).toBe(Infinity);
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:368:    toolCache.invalidateOnWrite('chunked-save-rollback', { filePath });
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:451:      toolCache.invalidateOnWrite('chunked-save-rollback', { filePath });
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:490:  toolCache.invalidateOnWrite('chunked-save', { filePath });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:763:  const cachedResult = await toolCache.withCache(
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:30:- `mutation-feedback.ts`: post-mutation feedback payloads and hint strings for cache clear results and tool cache invalidation.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:104:        description: 'Skip the tool cache and force a fresh search. Useful when underlying data has changed since last cached result.'
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:31:    toolCacheInvalidated = toolCache.invalidateOnWrite(operation, context);
.opencode/skill/system-spec-kit/shared/types.ts:248:  getStats(): Promise<StoreStats>;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:59:  async getStats(): Promise<{ total: number; pending: number; success: number; failed: number; retry: number }> {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:265:      expect(typeof mock.getStats).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:329:    it('MockVectorStore.getStats() returns correct counts', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:336:      const stats = await mock.getStats();
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:107:  async getStats() { return { total: 0, pending: 0, success: 0, failed: 0, retry: 0 }; }
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:32:  async getStats(): Promise<Record<string, number>> {
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:33:    throw new Error('Method getStats() must be implemented by subclass');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:31:    getStats: vi.fn(() => ({ documentCount: 0 })),
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:473:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:494:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:512:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:518:      const stats = archivalManager.getStats();
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:502:The search subsystem uses a 4-stage pipeline (candidate generation, fusion + signal enrichment, reranking + aggregation, filtering + annotation). Each stage has bounded score mutation rules and an immutability invariant on upstream scores. See `lib/search/README.md` for detailed architecture and per-stage module mapping.
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:15://   T21-T22 : score immutability invariant
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:334:   T21-T22: Score immutability invariant
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:491:  // ── 3.4 Score immutability invariant ──────────────────────
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:121: * Does NOT modify the database -- read-only check.
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:279: * Does NOT modify the database -- read-only scan.
.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:10:// and serves as read-only metadata — it has NO retrieval-time
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:118:**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:128:Runs a parallel scoring path alongside production results without affecting production output. Logs both production and shadow scores for A/B comparison with channel attribution per result. The shadow write path (`runShadowScoring`, `logShadowComparison`) was permanently disabled in Sprint 7; read-only analysis functions remain available. Added in Sprint 4.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:44:   * Receives the raw query and a copy of production results (read-only).
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:17:  Stage4ReadonlyRow,
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:55:  describe('Stage4ReadonlyRow', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:56:    it('R6-T2: Stage4ReadonlyRow has readonly score fields at type level', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:58:      const row: Stage4ReadonlyRow = {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:70:    it('R6-T3: Stage4ReadonlyRow allows annotation field writes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:71:      const row: Stage4ReadonlyRow = {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:86:  const testResults: Stage4ReadonlyRow[] = [
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:171:    const testRows: Stage4ReadonlyRow[] = [
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:213:      const rowsWithMissing: Stage4ReadonlyRow[] = [
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:225:      const rowsWithInvalidState: Stage4ReadonlyRow[] = [
 succeeded in 51ms:
Total output lines: 306

.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:3:// Tests edge-case behavior for fuseResultsRsfCrossVariant()
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:10:  fuseResultsRsfCrossVariant,
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:11:  fuseResultsRsfMulti,
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:15:type CrossVariantResult = ReturnType<typeof fuseResultsRsfCrossVariant>[number];
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:27:    const results = fuseResultsRsfCrossVariant([]);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:32:    const results = fuseResultsRsfCrossVariant([
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:42:    const results = fuseResultsRsfCrossVariant([
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:52:    // The rsfScore comes from fuseResultsRsfMulti only
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:53:    const multiResult = fuseResultsRsfMulti([
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:57:    expect(results[0].rsfScore).toBeCloseTo(multiResult[0].rsfScore, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:60:  it('single variant with single source applies single-source penalty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:61:    const results = fuseResultsRsfCrossVariant([
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:68:    expect(results[0].rsfScore).toBeLessThanOrEqual(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:69:    expect(results[0].rsfScore).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:75:    const results = fuseResultsRsfCrossVariant([
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:81:    expect(results[0].rsfScore).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:82:    expect(results[0].rsfScore).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-fusion-edge-cases.vitest.ts:86:    const results = fuseResultsRsfCrossVariant([
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:75:import { disposeLocalReranker } from './lib/search/local-reranker';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:588:      await disposeLocalReranker();
.opencode/skill/system-spec-kit/mcp_server/README.md:766:| `RERANKER_LOCAL`                | `false` | Use local GGUF reranker path (`node-llama-cpp`) instead of remote Cohere/Voyage in Stage 3 |
.opencode/skill/system-spec-kit/mcp_server/README.md:767:| `SPECKIT_RERANKER_MODEL`        | `models/bge-reranker-v2-m3.Q4_K_M.gguf` | Optional custom model path override for local reranker |
.opencode/skill/system-spec-kit/mcp_server/README.md:774:When `RERANKER_LOCAL=true`, Stage 3 reranking uses `node-llama-cpp` with a local GGUF model.
.opencode/skill/system-spec-kit/mcp_server/README.md:785:   - `RERANKER_LOCAL=true`
.opencode/skill/system-spec-kit/mcp_server/README.md:786:   - `SPECKIT_RERANKER_MODEL=models/bge-reranker-v2-m3.Q4_K_M.gguf`
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:25:import { rerankLocal } from './local-reranker';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:834:      // P1-5: Optional local GGUF reranking path (RERANKER_LOCAL=true).
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:837:        const localReranked = await rerankLocal(query, reranked, limit);
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:202: * Default: FALSE. Set RERANKER_LOCAL=true to enable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:206:  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() !== 'true') return false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:207:  return isFeatureEnabled('RERANKER_LOCAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:4:// AI-WHY: Optional local reranker for Stage 3. This module is fully gated by
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:5:// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:35:const RERANKER_TIMEOUT_MS = Number(process.env.SPECKIT_RERANKER_TIMEOUT_MS) || 30_000;
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:46:  const configured = process.env.SPECKIT_RERANKER_MODEL?.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:180:export async function canUseLocalReranker(): Promise<boolean> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:181:  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() !== 'true') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:187:  const hasCustomModel = Boolean(process.env.SPECKIT_RERANKER_MODEL?.trim());
 succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:113:      localTarget: { mrr5: 0.40, ndcg5: 0.42 },
.exec
/bin/zsh -lc 'rg -n "calculateNoveltyBoost|noveltyBoostApplied|noveltyBoostValue" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:6:  calculateNoveltyBoost,
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:33:// N4: calculateNoveltyBoost
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:36:describe('calculateNoveltyBoost — flag disabled (default)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:42:    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:48:    const boost = calculateNoveltyBoost(new Date(hoursAgo(0)).toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:53:describe('calculateNoveltyBoost — feature removed (always returns 0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:64:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:70:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:76:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:82:    const boost = calculateNoveltyBoost(createdAt);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:87:    expect(calculateNoveltyBoost(undefined)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:88:    expect(calculateNoveltyBoost(null as unknown as string)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:92:    expect(calculateNoveltyBoost('not-a-date')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:93:    expect(calculateNoveltyBoost('')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:98:    expect(calculateNoveltyBoost(futurestamp)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:103:    expect(calculateNoveltyBoost(oldStamp)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:473:export function calculateNoveltyBoost(_createdAt: string | undefined): codex
I’ve got the code side pinned down for the remaining scoring modules. I’m reading the last few feature descriptions directly now so I can call out exactly where the documentation overstates, understates, or points at the wrong files.
exec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/feature_catalog/11--scoriexec
/bin/zsh -lc 'rg -n "analyzeKValueSensitivity|K_VALUE|BASELINE_K|kendallTau|mrr5" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:37:  analyzeKValueSensitivity,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:38:  kendallTau,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:39:  mrr5,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:40:  K_VALUES,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:41:  BASELINE_K,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:287:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:290:    for (const k of K_VALUES) {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:292:      expect(analysis.results[k].mrr5).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:293:      expect(analysis.results[k].kendallTau).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:299:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:303:  it('K=60 has kendallTau = 1.0 (correlation with itself)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:304:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:305:    expect(analysis.results[60].kendallTau).toBeCloseTo(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:308:  it('K=60 has highest mrr5 (self-retrieval)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:309:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:312:    const selfMrr = analysis.results[60].mrr5;
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:315:    for (const k of K_VALUES) {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:316:      expect(selfMrr).toBeGreaterThanOrEqual(analysis.results[k].mrr5 - 0.001);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:321:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:323:    for (const k of K_VALUES) {
exec
/bin/zsh -lc 'rg -n "recordNegativeFeedbackEvent|SPECKIT_NEGATIVE_FEEDBACK|negative_feedback_events|computeConfidenceMultiplier|applyNegativeFeedback" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:796:| `SPECKIT_NEGATIVE_FEEDBACK`    | `true`  | `wasUseful=false` applies score demotion with 30-day recovery (A4) |
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:17:import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:366:    recordNegativeFeedbackEvent(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:17:import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:65:    recordNegativeFeedbackEvent(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:66:    recordNegativeFeedbackEvent(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:86:    recordNegativeFeedbackEvent(db, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:96:    recordNegativeFeedbackEvent(db, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:97:    recordNegativeFeedbackEvent(db, 3);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:105:    recordNegativeFeedbackEvent(db, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:106:    recordNegativeFeedbackEvent(db, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:123:    recordNegativeFeedbackEvent(db, 11);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:124:    recordNegativeFeedbackEvent(db, 11);
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:72:      FROM negative_feedback_events
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:27:    process.env = { ...originalEnv, SPECKIT_NEGATIVE_FEEDBACK: 'false' };
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:47:  'SPECKIT_NEGATIVE_FEEDBACK',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:71:  { flag: 'SPECKIT_NEGATIVE_FEEDBACK', checker: isNegativeFeedbackEnabled },
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:68:  computeConfidenceMultiplier,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:69:  applyNegativeFeedback,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:868:    const multiplier = computeConfidenceMultiplier(0);
exec
/bin/zsh -lc 'rg -n "autoPromotion|executeAutoPromotion|memory_promotion_audit|validationCount|previousTier|newTier" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:26:  previousTier: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:28:  newTier: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:30:  validationCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:93:  CREATE TABLE IF NOT EXISTS memory_promotion_audit (
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:110:    'SELECT COUNT(*) AS count FROM memory_promotion_audit WHERE promoted_at >= ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:140:        previousTier: 'unknown',
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:141:        newTier: 'unknown',
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:142:        validationCount: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:150:    const validationCount = resolvePositiveValidationCount(totalValidationCount, negativeValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:156:        previousTier: tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:157:        newTier: tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:158:        validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:168:        previousTier: tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:169:        newTier: tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:170:        validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:176:    if (validationCount < path.threshold) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:179:        previousTier: tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:180:        newTier: tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:181:        validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:182:        reason: `below_threshold: positive_validation_count=${validationCount}/${path.threshold}`,
exec
/bin/zsh -lc "rg -n \"Math\\.max\\(0, Math\\.min\\(1, composite\\)\\)|lastCited|last_cited|UNION ALL|logBinomial|binomial\" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:216: * Uses the exact binomial distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:223: * for large n (the naive iterative binomial coefficient exceeds
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:233:  // AI-WHY: Log-space binomial coefficient to avoid overflow for large n
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:234:  function logBinomial(nVal: number, kVal: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:244:  // Compute cumulative binomial probability P(X <= k) for Binomial(n, 0.5)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:249:    cumProb += Math.exp(logBinomial(n, i) + logP);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:338:  // AI-GUARD: C2 FIX: Only use actual citation data (lastCited / last_cited).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:341:  const lastCited = (row.lastCited as string | undefined)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:342:    || (row.last_cited as string | undefined);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:344:  if (!lastCited) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:348:  const timestamp = new Date(lastCited).getTime();
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:517:  const finalScore = Math.max(0, Math.min(1, composite));
exec
/bin/zsh -lc "sed -n '100,180p' .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
}

/**
 * Walk causal edges up to MAX_HOPS from the given seed memory IDs,
 * returning a map of neighbor ID to boost score.
 */
function getNeighborBoosts(memoryIds: number[]): Map<number, number> {
  const neighborBoosts = new Map<number, number>();
  if (!db) return neighborBoosts;

  const ids = normalizeIds(memoryIds);
  if (ids.length === 0) return neighborBoosts;

  const originIds = ids.map((value) => String(value));
  const placeholders = originIds.map(() => '?').join(', ');

  // C138-P2: Relation-weighted CTE — accumulates score with multiplier
  // based on edge relation type and edge strength column.
  // 'supersedes' edges get 1.5x, 'contradicts' 0.8x, others 1.0x.
  const query = `
exec
/bin/zsh -lc "rg -n \"P1-015|effectiveScore\\(|stage2Score|resolveEffectiveScore|intentAdjustedScore -> rrfScore -> score -> similarity\" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/lib/search" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:28:import { resolveEffectiveScore } from './types';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:173:              // AI-TRACE: P1-015: Use effectiveScore() for consistent fallback chain
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:174:              score: effectiveScore(r),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:303:          stage2Score: original?.score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:320:  // P1-015: Use effectiveScore() for consistent fallback chain
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:324:    score: effectiveScore(row),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:352:        // P1-015: Preserve Stage 2 composite score for auditability
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:353:        stage2Score: original.score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:470:  merged.sort((a, b) => effectiveScore(b) - effectiveScore(a));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:484:    effectiveScore(current) > effectiveScore(best) ? current : best
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:493: * P1-015: Fallback chain expanded to include intentAdjustedScore
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:501:// shared resolveEffectiveScore() from types.ts for consistency with Stage 2.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:502:const effectiveScore = resolveEffectiveScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:49:import { resolveEffectiveScore } from './types';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:147: * AI-WHY: Fix #11 (017-refinement-phase-6) — Replaced with shared resolveEffectiveScore()
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:152:const resolveBaseScore = resolveEffectiveScore;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:661:  results.sort((a, b) => resolveEffectiveScore(b) - resolveEffectiveScore(a));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:50:| `types.ts` | All pipeline data contracts: `PipelineRow`, `Stage4ReadonlyRow`, `PipelineConfig`, stage I/O interfaces (`Stage1Input`/`Output` through `Stage4Input`/`Output`), `PipelineResult`, `ScoreSnapshot` and the `resolveEffectiveScore()` shared score resolution function. Also provides `captureScoreSnapshot()` and `verifyScoreInvariant()` for Stage 4 defence-in-depth. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:93:- Preserves Stage 2 scores as `stage2Score` for auditability.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:108:4. **Score Resolution Consistency.** All stages use the shared `resolveEffectiveScore()` function from `types.ts` with fallback chain: `intentAdjustedScore` > `rrfScore` > `score` > `similarity/100`, clamped to [0, 1].
exec
/bin/zsh -lc "rg -n \"applyIntentWeights|normalizeCompositeScores|spec_folder.*lookup|convergenceBonus|crossVariantBonus|normalize to sum 1.0|threshold: number = INTERFERENCE_SIMILARITY_THRESHOLD|Math\\.max\\(result.intentAdjustedScore, result.score\\)|SPECKIT_SCORE_NORMALIZATION\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/lib/scoring .opencode/skill/system-spec-kit/shared/algorithms" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:49:  convergenceBonus: number;
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:62:  convergenceBonus?: number;
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:134:        convergenceBonus: 0,
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:150:      if (existing.convergenceBonus === 0) {
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:151:        existing.convergenceBonus = CONVERGENCE_BONUS;
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:160:        convergenceBonus: 0,
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:182:  const rawConvergenceBonus = options.convergenceBonus;
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:183:  const convergenceBonus = typeof rawConvergenceBonus === 'number' && Number.isFinite(rawConvergenceBonus) && rawConvergenceBonus >= 0
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:214:          convergenceBonus: 0,
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:226:      const bonus = convergenceBonus * (uniqueSourceCount - 1);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:227:      result.convergenceBonus = bonus;
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:337:  const convergenceBonusPerVariant = options.convergenceBonus ?? CONVERGENCE_BONUS;
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:363:  // AI: Fix F1 — do not subtract raw convergenceBonus from normalized scores.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:380:        mergedMap.set(key, { ...result, rrfScore: result.rrfScore, convergenceBonus: 0 });
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:389:      const crossVariantBonus = convergenceBonusPerVariant * (variantCount - 1);
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:390:      result.convergenceBonus = crossVariantBonus;
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:391:      result.rrfScore += crossVariantBonus;
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:419: * @returns True unless SPECKIT_SCORE_NORMALIZATION is explicitly 'false'.
.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:422:  return process.env.SPECKIT_SCORE_NORMALIZATION !== 'false';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:777: * Default: TRUE (graduated Sprint 4). Set SPECKIT_SCORE_NORMALIZATION=false to disable.
exec
/bin/zsh -lc 'rg -n "specFolder|document IDs as stringified numbers|stringified|resolve spec_folder|bm25" .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/tests/*bm25* .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
Total output lines: 171

.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:14:} from '../lib/search/bm25-index';
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:371:            { id: 2, title: 'Index Management', content_text: 'BM25 indexing pipeline', trigger_phrases: 'index,bm25', file_path: 'specs/002/spec.md' },
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:8:import * as bm25Index from '../lib/search/bm25-index';
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:42:  const specFolderOption = typeof options.specFolder === 'string'
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:43:    ? options.specFolder
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:46:  if (specFolderOption) {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:47:    results = results.filter(d => d.spec_folder === specFolderOption);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:146:      bm25Index.resetIndex();
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:149:    it('T031-BM25-01: is_bm25_available() returns false when empty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:154:    it('T031-BM25-02: is_bm25_available() returns true when populated', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:155:      const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:157:        bm25.addDocument(String(doc.id), doc.content);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:163:    it('T031-BM25-03: bm25_search() returns results', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:164:      const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:166:        bm25.addDocument(String(doc.id), doc.content);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:168:      const results = hybridSearch.bm25Search('authentication', { limit: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:173:    it('T031-BM25-04: bm25_search() results have score', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:174:      const bm25 = bm25Index.getIndex();
exec
/bin/zsh -lc "rg -n \"tool-cache|withCache\\(|invalidateOnWrite|memory_search|memory_save|memory_delete|memory_bulk_delete\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:93:import * as toolCache from './lib/cache/tool-cache';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:235:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:9:/** Arguments for the memory_delete handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:60:    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:95:      tool: 'memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:192:    reason: `memory_bulk_delete: deleted ${deletedCount} memories with tier="${tier}"`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:197:      tool: 'memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:205:    actor: 'mcp:memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:253:    tool: 'memory_bulk_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:27:const handle_memory_delete = handleMemoryDelete;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:  handle_memory_delete,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, prediction-error gating, record creation, post-insert enrichment, reconsolidation and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:157:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:164:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:170:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:94:      ? 'memory_save: updated indexed memory entry'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:95:      : 'memory_save: created new indexed memory entry',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:100:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:110:    actor: 'mcp:memory_save',
exec
/bin/zsh -lc "rg -n \"calculatePopularityScore\\(|access_count|last_accessed|archival manager|getAccessStats|usage_factor\" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/archival-manager.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:41:  access_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:42:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:77:  access_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:972:    const usage_factor = Math.min(1.0, (r.access_count || 0) / 10);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:975:    r.smartScore = (similarity_factor * relevance_weight) + (recency_factor * recency_weight) + (usage_factor * access_weight);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1071:export function get_usage_stats(options: UsageStatsOptions = {}): Array<{ id: number; title: string | null; spec_folder: string; file_path: string; access_count: number; last_accessed: number | null; confidence: number | null; created_at: string }> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1073:    sortBy = 'access_count',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1078:  const valid_sort_fields = ['access_count', 'last_accessed', 'confidence'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1079:  const sort_field = valid_sort_fields.includes(sortBy) ? sortBy : 'access_count';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1085:    SELECT id, title, spec_folder, file_path, access_count,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1086:           last_accessed, confidence, created_at
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1088:    WHERE access_count > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1096:    access_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1097:    last_accessed: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1135:      last_accessed,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1136:      access_count,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1142:      OR access_count <= ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1144:      OR (last_accessed IS NULL AND created_at < ?)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1146:      last_accessed ASC NULLS FIRST,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1147:      access_count ASC,
exec
/bin/zsh -lc 'rg -n "getAccessStats" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:

exec
/bin/zsh -lc "rg -n \"withCache\\(\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:763:  const cachedResult = await toolCache.withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:299:      const result1 = await withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:305:      const result2 = await withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:317:      const result1 = await withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:322:      const result2 = await withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:333:      await withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:339:      const result1 = await withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:346:      const result2 = await withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:614:        withCache(
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:625:        await withCache(
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:115:await withCache(toolName, args, asyncFn, options);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:192:const result = await withCache(
exec
/bin/zsh -lc 'rg -n "quality-loop|coherence|reject|SPECKIT_QUALITY_LOOP|computeMemoryQualityScore|attemptAutoFix" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts .opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:31:  computeMemoryQualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:32:  attemptAutoFix,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:45:} from './quality-loop';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:50:} from './quality-loop';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:123:  // Feature behavior remains gated by SPECKIT_QUALITY_LOOP inside runQualityLoop().
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:145:  if (!qualityLoopResult.passed && qualityLoopResult.rejected) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:147:      status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:157:      message: qualityLoopResult.rejectionReason,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:210:          status: 'rejected',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:214:          message: `Quality gate rejected: ${qualityGateResult.reasons.join('; ')}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:531:  computeMemoryQualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:532:  attemptAutoFix,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:569:const compute_memory_quality_score = computeMemoryQualityScore;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:570:const attempt_auto_fix = attemptAutoFix;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:11:  coherence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:25:  rejected: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:26:  rejectionReason?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:35:  coherence: 0.25,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:44:  return process.env.SPECKIT_QUALITY_LOOP?.toLowerCase() === 'true';
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:179: * Compute coherence quality sub-score.
exec
/bin/zsh -lc 'for p in mcp_server/tests/memory-save-extended.vitest.ts mcp_server/tests/entity-linker.vitest.ts mcp_server/tests/integration-search-pipeline.vitest.ts mcp_server/lib/memory-parser.ts; do if test -f .opencode/skill/system-spec-kit/$p; then echo EXISTS:$p; else echo MISSING:$p; fi; done; rg -n "15000|db'"\\.close\\(|behavioral differences|tautological|z_archive|duplicate T007|skipIf\" .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts .opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 51ms:
EXISTS:mcp_server/tests/memory-save-extended.vitest.ts
EXISTS:mcp_server/tests/entity-linker.vitest.ts
EXISTS:mcp_server/tests/integration-search-pipeline.vitest.ts
MISSING:mcp_server/lib/memory-parser.ts
rg: .opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.ts: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:112:    db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:22:// Initialize a test DB at module scope so skipIf conditions can evaluate correctly.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:23:// The DB must be available before it() registrations (skipIf evaluates at registration time).
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:147:    it.skipIf(!resolveFn)('resolves numeric ID', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:152:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:155:    it.skipIf(!resolveFn)('null for non-existent ID', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:160:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:163:    it.skipIf(!resolveFn)('resolves session reference', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:168:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:171:    it.skipIf(!resolveFn)('resolves date-prefixed reference', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:176:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:179:    it.skipIf(!resolveFn)('resolves path reference', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:184:      db.close();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:187:    it.skipIf(!resolveFn)('resolves exact title', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:192:      db.close();
exec
/bin/zsh -lc "rg -n \"isMemoryFile|z_archive|spec doc detection|memory file\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared --glob '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:411: * T107: Recover pending memory files on MCP startup.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:418:  console.error('[context-server] Checking for pending memory files...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:421:    // BUG-028 FIX: Restrict scan to known memory file locations to prevent OOM when scanning large workspaces
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:463:      console.error('[context-server] No pending memory files found');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:494:    console.error('[context-server] Starting background scan for new memory files...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:497:      console.error('[context-server] No memory files found in workspace');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:501:    console.error(`[context-server] Found ${files.length} memory files, checking for changes...`);
.opencode/skill/system-spec-kit/shared/scoring/README.md:70:| `z_archive/`  | 0.1        |
.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:31:  /z_archive\//i,
.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:89:  { pattern: /z_archive\//i, multiplier: 0.1, type: 'archive' },
.opencode/skill/system-spec-kit/shared/parsing/README.md:3:description: "Shared parsing functions for extracting quality metadata from YAML frontmatter in memory files."
.opencode/skill/system-spec-kit/shared/parsing/README.md:12:> Shared parsing functions for extracting quality metadata from YAML frontmatter in memory files.
.opencode/skill/system-spec-kit/mcp_server/cli.ts:59:                                 Re-index memory files (lazy model load by default)
.opencode/skill/system-spec-kit/mcp_server/README.md:269:| `memory_save`        | Index a single memory file                                                                         | ~1s                 |
.opencode/skill/system-spec-kit/mcp_server/README.md:708:| `MEMORY_BASE_PATH`      | CWD                                    | Workspace root for memory files |
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:57: * @param metadata - Raw metadata record extracted from the memory file. Expected
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:92: * @param content - Full text content of the memory file to inspect.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:156: * @param content    - Full text content of the memory file.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:193: * @param content - Full text content of the memory file.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:230: * Compute composite quality score for a memory file.
exec
/bin/zsh -lc "rg -n \"it\\.skipIf\\(|throw new Error\\(|parent_id IS NULL|id "'!= null|SPEC_KIT_DB_DIR '"\\|\\| SPECKIT_DB_DIR|SPECKIT_DASHBOARD_LIMIT|Number\\.isFinite|transaction\\(|BEGIN|COMMIT|ROLLBACK|feedback mutations\" .opencode/skill/system-spec-kit/mcp_server/tests .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/mcp_server/handlers" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
Total output lines: 571

.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:71:    throw new Error('paths must be a non-empty array of file paths');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:75:    throw new Error(`paths exceeds maximum of ${MAX_INGEST_PATHS}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:87:    throw new Error('paths must be a non-empty array of file paths');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:171:    throw new Error('jobId is required and must be a string');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:200:    throw new Error('jobId is required and must be a string');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:286:    throw new Error('Memory object is required for hash generation');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:346:      if (m.id != null) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:357:      if (m.id != null) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:378:      if (memory.id != null && !result.has(memory.id)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:389:      if (m.id != null) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:415:    db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:445:    const runBatch = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:672:    if (r.id != null && shouldSendMap.get(r.id) === false) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:46:    throw new Error('tier is required and must be a string');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:51:    throw new Error(`Invalid tier: "${tier}". Must be one of: ${validTiers.join(', ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:55:    throw new Error('Bulk delete requires confirm: true as a safety gate');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:60:    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:64:    throw new Error(`skipCheckpoint is not allowed for "${tier}" tier. Checkpoint is mandatory for high-safety tiers.`);
exec
/bin/zsh -lc "rg -n \"parseArgs<|parseArgs\\(|{} as T|phase IN \\('preflight', 'complete'\\)|MAX\\(eval_run_id\\)|slice\\(0, 32\\)|removeListener\\('beforeExit'|recallK\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 52ms:
rg: regex parse error:
    (?:parseArgs<|parseArgs\(|{} as T|phase IN \('preflight', 'complete'\)|MAX\(eval_run_id\)|slice\(0, 32\)|removeListener\('beforeExit'|recallK)
                              ^
error: repetition operator missing expression
exec
/bin/zsh -lc "rg -n \"parseArgs<|parseArgs\\(|phase IN \\('preflight', 'complete'\\)|MAX\\(eval_run_id\\)|slice\\(0, 32\\)|removeListener\\('beforeExit'|recallK\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"return \\{\\} as T|SPEC_KIT_DB_DIR \\|\\| SPECKIT_DB_DIR\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:25:    return {} as T;
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:32:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:76:  const recallK = typeof args.recallK === 'number' && Number.isFinite(args.recallK)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:77:    ? Math.max(1, Math.floor(args.recallK))
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:85:      // AI-WHY: Fix #33 (017-refinement-phase-6) — Use recallK, not hardcoded 20
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:86:      limit: recallK,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:105:    recallK,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:70:    phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:339:    WHERE spec_folder = ? AND task_id = ? AND phase IN ('preflight', 'complete')
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:17:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:21:export function parseArgs<T>(args: Record<string, unknown>): T {
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:33:    return parseArgs<T>(validateToolArgs(toolName, {}));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:35:  return parseArgs<T>(validateToolArgs(toolName, args));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:270:  recallK?: number;
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:280:  recallK: positiveIntMax(100).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:375:  eval_run_ablation: ['channels', 'groundTruthQueryIds', 'recallK', 'storeResults', 'includeFormattedReport'],
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:47:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:48:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:49:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:50:    case 'memory_list':           return handleMemoryList(parseArgs<ListArgs>(validateToolArgs('memory_list', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:51:    case 'memory_stats':          return handleMemoryStats(parseArgs<StatsArgs>(validateToolArgs('memory_stats', args)));
exec
/bin/zsh -lc 'rg -n "community_assignments|CREATE TABLE IF NOT EXISTS community_assignments|SPECKIT_COMMUNITY_DETECTION" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:146: * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_DETECTION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:149:  return isFeatureEnabled('SPECKIT_COMMUNITY_DETECTION');
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:388:| `SPECKIT_COMMUNITY_DETECTION`| `true`| Enable N2c BFS/Louvain community detection |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:599:Graph-based scoring signals applied during Stage 2 fusion. Gated via `SPECKIT_GRAPH_SIGNALS` (N2a + N2b) and `SPECKIT_COMMUNITY_DETECTION` (N2c).
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:625:BFS connected-component labelling assigns community IDs. When the largest component contains >50% of all nodes, escalates to Louvain modularity optimization for finer-grained communities. Community co-members are injected into Stage 2 results before graph signal scoring. Gated via `SPECKIT_COMMUNITY_DETECTION`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:33:// v19: degree_snapshots + community_assignments (N2 graph centrality)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:609:          CREATE TABLE IF NOT EXISTS community_assignments (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:617:        database.exec('CREATE INDEX IF NOT EXISTS idx_community_assignments_community ON community_assignments(community_id)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:618:        logger.info('Migration v19: Created community_assignments table (N2c)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:621:          console.warn('[VectorIndex] Migration v19 warning (community_assignments):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:368:      'DELETE FROM community_assignments WHERE memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:53:  'SPECKIT_COMMUNITY_DETECTION',
.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:77:  { flag: 'SPECKIT_COMMUNITY_DETECTION', checker: isCommunityDetectionEnabled },
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:87:    CREATE TABLE community_assignments (
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:183:      delete process.env.SPECKIT_COMMUNITY_DETECTION;
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:191:      delete process.env.SPECKIT_COMMUNITY_DETECTION;
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:207:      process.env.SPECKIT_COMMUNITY_DETECTION = 'false';
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:384:      const assignments = db.prepare('SELECT * FROM community_assignments').all();
.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts:44:    CREATE TABLE community_assignments (
.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts:406:    const rows = db.prepare('SELECT memory_id, community_id FROM community_assignments ORDER BY memory_id').all() as Array<{ memory_id: number; community_id: number }>;
exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-graph-nodes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# ANCHOR tags as graph nodes

## Current Reality

**PLANNED (Sprint 019) — DEFERRED.** Promoting parsed ANCHOR markers into typed graph nodes (most creative insight from cross-AI research, Gemini-2) is deferred behind a dedicated 2-day feasibility spike. Estimated effort: S-M (3-5 days).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/chunking/anchor-chunker.ts` | Lib | Anchor-aware chunking |
| `mcp_server/lib/search/anchor-metadata.ts` | Lib | Anchor metadata extraction |
| `mcp_server/lib/search/pipeline/types.ts` | Lib | Type definitions |
| `shared/contracts/retrieval-trace.ts` | Shared | Retrieval trace contract |

### Tests

| File | Focus |
exec
/bin/zsh -lc "rg -n \"attributeChannels\\(|getChannelAttribution\\(|compareShadowResults\\(|runShadowScoring\\(|logShadowComparison\\(|isInShadowPeriod\\(\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:304:    const shadowMode = isInShadowPeriod(db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:404:function isInShadowPeriod(db: Database): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:445:    if (isInShadowPeriod(db)) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:249:export async function runShadowScoring(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:272:export function compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:349:export function logShadowComparison(_comparison: ShadowComparison): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts:99:export function attributeChannels(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts:208:export function getChannelAttribution(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/channel-attribution.ts:213:  const attributed = attributeChannels(results, channelSources);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:528:    const report = getChannelAttribution(results, channelSources, 4);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:707:    const report = getChannelAttribution(results, sources, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:55:      const comparison = compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:77:      const comparison = compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:94:      const comparison = compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:112:      const comparison = compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:123:      const comparison = compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:136:      const comparison = compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:158:      const comparison = compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:170:      const comparison = compareShadowResults(
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:201:      const result = await runShadowScoring('test query', makeResults([1, 2, 3]), config);
exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Temporal contiguity layer

## Current Reality

The temporal contiguity module (`lib/cognitive/temporal-contiguity.ts`) boosts search result scores when memories were created close together in time. Given a set of search results, it queries for temporally adjacent memories within a configurable window (default 1 hour, max 24 hours) and applies a boost factor of 0.15 per temporally proximate neighbor, capped at a cumulative maximum of 0.50 per result.

The module also provides `queryTemporalNeighbors()` for direct temporal neighborhood lookups and `buildSpecFolderTimeline()` for constructing chronological timelines within a spec folder. This captures the cognitive principle that memories formed close together in time are often contextually related — the temporal contiguity effect from memory psychology.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Lib | Temporal proximity boost and timeline queries |

### Tests

| File | Focus |
|------|-------|
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Stage 3 effectiveScore fallback chain

## Current Reality

`effectiveScore()` in `stage3-rerank.ts` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment. The fix updated the fallback chain to: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1] with `isFinite()` guards. Cross-encoder document mapping and MMR candidate scoring now use `effectiveScore()` instead of inline fallbacks. A `stage2Score` field was added to `PipelineRow` in `types.ts` for auditability when Stage 3 overwrites scores.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Local GGUF reranker via node-llama-cpp

## Current Reality

**IMPLEMENTED (Sprint 019).** Implements the `RERANKER_LOCAL` flag with `node-llama-cpp` in Stage 3 using `bge-reranker-v2-m3.Q4_K_M.gguf` (~350MB). Default 4GB free memory requirement (lower 512MB threshold when custom `SPECKIT_RERANKER_MODEL` is set). Sequential per-candidate inference; on Apple Silicon with small GGUF (~100MB) expect 200-400ms for top-20 (CHK-113). Falls back to existing RRF scoring when local execution is unavailable. New file: `lib/search/local-reranker.ts`.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/configs/cognitive.ts` | Core | Cognitive configuration |
| `mcp_server/core/config.ts` | Core | Server configuration |
| `mcp_server/lib/cache/embedding-cache.ts` | Lib | Embedding Cache |
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/errors/core.ts` | Lib | Error type definitions |
| `mcp_server/lib/errors/recovery-hints.ts` | Lib | Error recovery hints |
| `mcp_server/lib/interfaces/vector-store.ts` | Lib | Vector store interface |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/01-score-normalization.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
# Score normalization

## Current Reality

The RRF fusion system and composite scoring system had a 15:1 magnitude mismatch. RRF scores fell in the 0-0.07 range while composite scores covered the full 0-1 range. Composite dominated purely because of scale, not because it was better.

Min-max normalization now maps both outputs to a 0-1 range, letting actual relevance determine ranking instead of which scoring system happens to produce larger numbers. Single-result queries and equal-score edge cases normalize to 1.0.

The normalization is batch-relative (the same memory can score differently across different queries), which is expected behavior for min-max. Runs behind the `SPECKIT_SCORE_NORMALIZATION` flag.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite score computation |
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/scoring/interference-scoring.ts` | Lib | Interference penalty scoring |
exec
/bin/zsh -lc 'test -f .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts && echo yes || echo no; test -f .opencode/skill/system-spec-kit/mcp_server/tests/importance-tiers.vitest.ts && echo yes || echo no' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
yes
yes
codex
I found the earlier table-parsing issue: these feature docs nest their tables under `## Source Files` with `### Implementation`/`### Tests`, so I rechecked them with the correct structure. That changes the audit in a useful way: most category 11 files do list source paths, but several tables are still missing the key implementation files or include unrelated ones.
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\"); const dir=\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration\"; for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(\".md\")).sort()){ const lines=fs.readFileSync(path.join(dir,f),\"utf8\").split(/\\r?\\n/); let section=null; let impl=[],test=[]; for(const line of lines){ if(/"'^### Implementation$/.test(line)) section="impl"; else if(/''^### Tests$/.test(line)) section="test"; else if(/''^## /.test(line) || /''^### /.test(line) && !/''^### (Implementation|Tests)$/.test(line)) section=section; if(section && /''^'"\\|/.test(line) && "'!/''^'"\\|\\s*File\\s*\\|/i.test(line) && "'!/''^'"\\|[-\\s|]+\\|?"'$/.test(line)){ const cells=line.split("|").map(s=>s.trim()).filter(Boolean); if(cells[0]) (section==="impl"?impl:test).push(cells[0]); } } console.log("FILE "+f); console.log("IMPL "+impl.join('"'; ')); console.log(\"TEST \"+test.join('; ')); }'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 127 in 51ms:
[eval]:1
const fs=require("fs"),path=require("path"); const dir=".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration"; for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(".md")).sort()){ const lines=fs.readFileSync(path.join(dir,f),"utf8").split(/\r?\n/); let section=null; let impl=[],test=[]; for(const line of lines){ if(/^### Implementation$/.test(line)) section="impl"; else if(/^### Tests$/.test(line)) section="test"; else if(/^## /.test(line) || /^### /.test(line) && !/^### (Implementation|Tests)$/.test(line)) section=section; if(section && /^\|/.test(line) && !/^\|\s*File\s*\|/i.test(line) && !/^\|[-\s|]+\|?$/.test(line)){ const cells=line.split("|").map(s=>s.trim()).filter(Boolean); if(cells[0]) (section==="impl"?impl:test).push(cells[0]); } } console.log("FILE "+f); console.log("IMPL "+impl.join(
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
Expression expected

SyntaxError: Unexpected end of input
    at makeContextifyScript (node:internal/vm:194:14)
    at compileScript (node:internal/process/execution:388:10)
    at evalTypeScript (node:internal/process/execution:260:22)
    at node:internal/main/eval_string:71:3

Node.js v25.6.1
zsh:1: command not found: )); console.log("TEST "+test.join(
zsh:1: command not found: )); }
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path'); const dir='.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration'; for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md')).sort()){ const lines=fs.readFileSync(path.join(dir,f),'utf8').split(/\\r?\\n/); let section=null; const impl=[], test=[]; for(const line of lines){ if(/"'^### Implementation$/.test(line)) section='"'impl'; else if(/"'^### Tests$/.test(line)) section='"'test'; else if(/"'^## /.test(line)) section=null; if(section && /''^'"\\|/.test(line) && "'!/''^'"\\|\\s*File\\s*\\|/i.test(line) && "'!/''^'"\\|[-\\s|]+\\|?"'$/.test(line)){ const cells=line.split('"'|').map(s=>s.trim()).filter(Boolean); if(cells[0]) (section==='impl'?impl:test).push(cells[0]); } } console.log('FILE '+f); console.log('IMPL '+(impl.join('; ')||'NONE')); console.log('TEST '+(test.join('; ')||'NONE')); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
FILE 01-score-normalization.md
IMPL `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/lib/scoring/folder-scoring.ts`; `mcp_server/lib/scoring/importance-tiers.ts`; `mcp_server/lib/scoring/interference-scoring.ts`; `mcp_server/lib/storage/access-tracker.ts`; `mcp_server/lib/telemetry/scoring-observability.ts`; `shared/normalization.ts`; `shared/scoring/folder-scoring.ts`; `shared/types.ts`
TEST `mcp_server/tests/access-tracker-extended.vitest.ts`; `mcp_server/tests/access-tracker.vitest.ts`; `mcp_server/tests/composite-scoring.vitest.ts`; `mcp_server/tests/folder-scoring.vitest.ts`; `mcp_server/tests/importance-tiers.vitest.ts`; `mcp_server/tests/interference.vitest.ts`; `mcp_server/tests/memory-types.vitest.ts`; `mcp_server/tests/score-normalization.vitest.ts`; `mcp_server/tests/scoring-observability.vitest.ts`; `mcp_server/tests/scoring.vitest.ts`; `mcp_server/tests/unit-composite-scoring-types.vitest.ts`; `mcp_server/tests/unit-folder-scoring-types.vitest.ts`; `mcp_server/tests/unit-normalization-roundtrip.vitest.ts`; `mcp_server/tests/unit-normalization.vitest.ts`; `mcp_server/tests/unit-tier-classifier-types.vitest.ts`; `mcp_server/tests/unit-transaction-metrics-types.vitest.ts`
FILE 02-cold-start-novelty-boost.md
IMPL `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/lib/scoring/folder-scoring.ts`; `mcp_server/lib/scoring/importance-tiers.ts`; `mcp_server/lib/scoring/interference-scoring.ts`; `mcp_server/lib/storage/access-tracker.ts`; `mcp_server/lib/telemetry/scoring-observability.ts`; `shared/normalization.ts`; `shared/scoring/folder-scoring.ts`; `shared/types.ts`
TEST `mcp_server/tests/access-tracker-extended.vitest.ts`; `mcp_server/tests/access-tracker.vitest.ts`; `mcp_server/tests/composite-scoring.vitest.ts`; `mcp_server/tests/folder-scoring.vitest.ts`; `mcp_server/tests/importance-tiers.vitest.ts`; `mcp_server/tests/interference.vitest.ts`; `mcp_server/tests/memory-types.vitest.ts`; `mcp_server/tests/score-normalization.vitest.ts`; `mcp_server/tests/scoring-observability.vitest.ts`; `mcp_server/tests/scoring.vitest.ts`; `mcp_server/tests/unit-composite-scoring-types.vitest.ts`; `mcp_server/tests/unit-folder-scoring-types.vitest.ts`; `mcp_server/tests/unit-normalization-roundtrip.vitest.ts`; `mcp_server/tests/unit-normalization.vitest.ts`; `mcp_server/tests/unit-tier-classifier-types.vitest.ts`; `mcp_server/tests/unit-transaction-metrics-types.vitest.ts`
FILE 03-interference-scoring.md
IMPL `mcp_server/lib/scoring/interference-scoring.ts`
TEST `mcp_server/tests/interference.vitest.ts`; `mcp_server/tests/scoring.vitest.ts`
FILE 04-classification-based-decay.md
IMPL `mcp_server/lib/cognitive/attention-decay.ts`; `mcp_server/lib/cognitive/fsrs-scheduler.ts`; `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/lib/scoring/folder-scoring.ts`; `mcp_server/lib/scoring/importance-tiers.ts`; `mcp_server/lib/scoring/interference-scoring.ts`; `mcp_server/lib/storage/access-tracker.ts`; `mcp_server/lib/telemetry/scoring-observability.ts`; `shared/normalization.ts`; `shared/scoring/folder-scoring.ts`; `shared/types.ts`
TEST `mcp_server/tests/access-tracker-extended.vitest.ts`; `mcp_server/tests/access-tracker.vitest.ts`; `mcp_server/tests/attention-decay.vitest.ts`; `mcp_server/tests/composite-scoring.vitest.ts`; `mcp_server/tests/decay.vitest.ts`; `mcp_server/tests/folder-scoring.vitest.ts`; `mcp_server/tests/fsrs-scheduler.vitest.ts`; `mcp_server/tests/importance-tiers.vitest.ts`; `mcp_server/tests/interference.vitest.ts`; `mcp_server/tests/memory-types.vitest.ts`; `mcp_server/tests/score-normalization.vitest.ts`; `mcp_server/tests/scoring-observability.vitest.ts`; `mcp_server/tests/scoring.vitest.ts`; `mcp_server/tests/unit-composite-scoring-types.vitest.ts`; `mcp_server/tests/unit-folder-scoring-types.vitest.ts`; `mcp_server/tests/unit-normalization-roundtrip.vitest.ts`; `mcp_server/tests/unit-normalization.vitest.ts`; `mcp_server/tests/unit-tier-classifier-types.vitest.ts`; `mcp_server/tests/unit-transaction-metrics-types.vitest.ts`
FILE 05-folder-level-relevance-scoring.md
IMPL `mcp_server/lib/scoring/folder-scoring.ts`; `mcp_server/lib/search/folder-relevance.ts`; `shared/normalization.ts`; `shared/scoring/folder-scoring.ts`; `shared/types.ts`
TEST `mcp_server/tests/folder-relevance.vitest.ts`; `mcp_server/tests/folder-scoring.vitest.ts`; `mcp_server/tests/memory-types.vitest.ts`; `mcp_server/tests/score-normalization.vitest.ts`; `mcp_server/tests/scoring.vitest.ts`; `mcp_server/tests/unit-composite-scoring-types.vitest.ts`; `mcp_server/tests/unit-folder-scoring-types.vitest.ts`; `mcp_server/tests/unit-normalization-roundtrip.vitest.ts`; `mcp_server/tests/unit-normalization.vitest.ts`; `mcp_server/tests/unit-tier-classifier-types.vitest.ts`; `mcp_server/tests/unit-transaction-metrics-types.vitest.ts`
FILE 06-embedding-cache.md
IMPL `mcp_server/lib/cache/embedding-cache.ts`
TEST `mcp_server/tests/embedding-cache.vitest.ts`
FILE 07-double-intent-weighting-investigation.md
IMPL `mcp_server/lib/search/intent-classifier.ts`
exec
/bin/zsh -lc 'test -f .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts && echo yes || echo no; test -f .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/archival-manager.ts && echo cacheyes || echo cacheno' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
yes
cacheyes
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path'); const dirs=['.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement','.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation','.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration']; const root='.opencode/skill/system-spec-kit'; const invalid=[]; for(const dir of dirs){ for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md')).sort()){ const lines=fs.readFileSync(path.join(dir,f),'utf8').split(/\\r?\\n/); let section=null; for(const line of lines){ if(/"'^### Implementation$/.test(line)) section='"'impl'; else if(/"'^### Tests$/.test(line)) section='"'test'; else if(/"'^## /.test(line)) section=null; if(section && /''^'"\\|/.test(line) && "'!/''^'"\\|\\s*File\\s*\\|/i.test(line) && "'!/''^'"\\|[-\\s|]+\\|?"'$/.test(line)){ const cells=line.split('"'|').map(s=>s.trim()).filter(Boolean); const p=cells[0]?.replace(/"'^`|`$/g,'"''); if(p && p"'!=='"'No dedicated source files' && "'!fs.existsSync(path.join(root,p))) invalid.push([path.basename(f),p]); } } } } console.log(JSON.stringify(invalid,null,2));"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
zsh:1: parse error near `|'
zsh:1: parse error in command substitution
exec
/bin/zsh -lc "python3 -c 'import os, re, json; dirs=[\".opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement\",\".opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation\",\".opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration\"]; root=\".opencode/skill/system-spec-kit\"; invalid=[]
for d in dirs:
  for f in sorted(x for x in os.listdir(d) if x.endswith(\".md\")):
    section=None
    for line in open(os.path.join(d,f), encoding=\"utf-8\"):
      line=line.rstrip(\"\\n\")
      if re.match(r\""'^### Implementation$", line): section="impl"
      elif re.match(r"''^### Tests$", line): section="test"
      elif re.match(r"''^## ", line): section=None
      elif section and line.startswith("|") and not re.match(r"''^'"\\|\\s*File\\s*\\|\", line, re.I) and not re.match(r\""'^'"\\|[-\\s|]+\\|?"'$", line):
        cells=[c.strip() for c in line.split("|") if c.strip()]
        if cells:
          p=cells[0].strip("`")
          if p != "No dedicated source files" and not os.path.exists(os.path.join(root,p)):
            invalid.append([f,p])
print(json.dumps(invalid, indent=2))'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 784ms:
[
  [
    "12-stage-3-effectivescore-fallback-chain.md",
    "mcp_server/tests/retry.vitest.ts"
  ],
  [
    "14-local-gguf-reranker-via-node-llama-cpp.md",
    "mcp_server/tests/retry.vitest.ts"
  ]
]
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Double intent weighting investigation

## Current Reality

A full pipeline trace through `hybrid-search.ts`, `intent-classifier.ts` and `adaptive-fusion.ts` investigated whether intent weights applied at two separate points was a bug. The answer: intentional design.

System A (`INTENT_WEIGHT_PROFILES` in adaptive fusion) controls how much each channel contributes during RRF fusion. System B (`INTENT_WEIGHT_ADJUSTMENTS` in the intent classifier) controls how result attributes (similarity, importance, recency) are weighted after fusion. These operate on different dimensions at different pipeline stages and serve complementary purposes.

A minor inefficiency exists (recency boost from System A is discarded when System B re-scores), but it is harmless. No code change needed. The 4-stage pipeline (R6) resolved this structurally: Stage 2 applies intent weights only for non-hybrid search types via an `isHybrid` boolean gate, so the code path for double-weighting is absent by design.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection |

### Tests

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# Graph and cognitive memory fixes

## Current Reality

Seven fixes (of 9 planned; 2 deferred) addressed graph integrity and cognitive scoring:

- **Self-loop prevention (#24):** `insertEdge()` rejects `sourceId === targetId`.
- **maxDepth clamping (#25):** `handleMemoryDriftWhy` clamps `maxDepth` to [1, 10] server-side.
- **Community debounce (#27):** Replaced edge-count-only debounce with `count:maxId` hash. Edge count alone can't detect deletions followed by insertions that maintain the same count.
- **Orphaned edge cleanup (#28):** New `cleanupOrphanedEdges()` function exported from `causal-edges.ts`.
- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
- **Double-decay removal (#30):** Trigger handler no longer applies `* turnDecayFactor` to `wmEntry.attentionScore` (WM already applies its own decay).
- **Co-activation cache (#32):** `clearRelatedCache()` called from `memory-bulk-delete.ts` after bulk operations.

**Deferred:** #26 (FK existence check on causal edges, test fixtures use synthetic IDs not in memory_index) and #31 (session entry limit off-by-one, code already correct).

## Source Files

### Implementation

exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path'); const dir='.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation'; for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md')).sort()){ const lines=fs.readFileSync(path.join(dir,f),'utf8').split(/\\r?\\n/); let section=null; const impl=[], test=[]; for(const line of lines){ if(/"'^### Implementation$/.test(line)) section='"'impl'; else if(/"'^### Tests$/.test(line)) section='"'test'; else if(/"'^## /.test(line)) section=null; if(section && /''^'"\\|/.test(line) && "'!/''^'"\\|\\s*File\\s*\\|/i.test(line) && "'!/''^'"\\|[-\\s|]+\\|?"'$/.test(line)){ const cells=line.split('"'|').map(s=>s.trim()).filter(Boolean); if(cells[0]) (section==='impl'?impl:test).push(cells[0]); } } console.log('FILE '+f); console.log('IMPL '+(impl.join('; ')||'NONE')); console.log('TEST '+(test.join('; ')||'NONE')); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
FILE 01-typed-weighted-degree-channel.md
IMPL `mcp_server/lib/cognitive/rollout-policy.ts`; `mcp_server/lib/parsing/content-normalizer.ts`; `mcp_server/lib/search/bm25-index.ts`; `mcp_server/lib/search/graph-flags.ts`; `mcp_server/lib/search/graph-search-fn.ts`; `mcp_server/lib/search/search-types.ts`; `mcp_server/lib/search/spec-folder-hierarchy.ts`
TEST `mcp_server/tests/bm25-index.vitest.ts`; `mcp_server/tests/content-normalizer.vitest.ts`; `mcp_server/tests/degree-computation.vitest.ts`; `mcp_server/tests/graph-flags.vitest.ts`; `mcp_server/tests/graph-scoring-integration.vitest.ts`; `mcp_server/tests/graph-search-fn.vitest.ts`; `mcp_server/tests/rollout-policy.vitest.ts`; `mcp_server/tests/rrf-degree-channel.vitest.ts`; `mcp_server/tests/spec-folder-hierarchy.vitest.ts`
FILE 02-co-activation-boost-strength-increase.md
IMPL `mcp_server/lib/cognitive/co-activation.ts`
TEST `mcp_server/tests/co-activation.vitest.ts`
FILE 03-edge-density-measurement.md
IMPL `mcp_server/lib/eval/edge-density.ts`
TEST `mcp_server/tests/edge-density.vitest.ts`
FILE 04-weight-history-audit-tracking.md
IMPL `mcp_server/lib/parsing/content-normalizer.ts`; `mcp_server/lib/search/bm25-index.ts`; `mcp_server/lib/search/graph-search-fn.ts`; `mcp_server/lib/search/search-types.ts`; `mcp_server/lib/search/spec-folder-hierarchy.ts`; `mcp_server/lib/storage/causal-edges.ts`
TEST `mcp_server/tests/bm25-index.vitest.ts`; `mcp_server/tests/causal-edges-unit.vitest.ts`; `mcp_server/tests/causal-edges.vitest.ts`; `mcp_server/tests/content-normalizer.vitest.ts`; `mcp_server/tests/graph-search-fn.vitest.ts`; `mcp_server/tests/spec-folder-hierarchy.vitest.ts`
FILE 05-graph-momentum-scoring.md
IMPL `mcp_server/lib/graph/graph-signals.ts`
TEST `mcp_server/tests/feature-eval-graph-signals.vitest.ts`; `mcp_server/tests/graph-signals.vitest.ts`
FILE 06-causal-depth-signal.md
IMPL `mcp_server/lib/cognitive/rollout-policy.ts`; `mcp_server/lib/graph/graph-signals.ts`; `mcp_server/lib/search/causal-boost.ts`
TEST `mcp_server/tests/causal-boost.vitest.ts`; `mcp_server/tests/feature-eval-graph-signals.vitest.ts`; `mcp_server/tests/graph-signals.vitest.ts`; `mcp_server/tests/rollout-policy.vitest.ts`
FILE 07-community-detection.md
IMPL `mcp_server/lib/graph/community-detection.ts`
exec
/bin/zsh -lc "node -e \"const fs=require('fs'),path=require('path'); const dir='.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement'; for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md')).sort()){ const lines=fs.readFileSync(path.join(dir,f),'utf8').split(/\\r?\\n/); let section=null; const impl=[], test=[]; for(const line of lines){ if(/"'^### Implementation$/.test(line)) section='"'impl'; else if(/"'^### Tests$/.test(line)) section='"'test'; else if(/"'^## /.test(line)) section=null; if(section && /''^'"\\|/.test(line) && "'!/''^'"\\|\\s*File\\s*\\|/i.test(line) && "'!/''^'"\\|[-\\s|]+\\|?"'$/.test(line)){ const cells=line.split('"'|').map(s=>s.trim()).filter(Boolean); if(cells[0]) (section==='impl'?impl:test).push(cells[0]); } } console.log('FILE '+f); console.log('IMPL '+(impl.join('; ')||'NONE')); console.log('TEST '+(test.join('; ')||'NONE')); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
FILE 01-evaluation-database-and-schema.md
IMPL `mcp_server/lib/eval/eval-db.ts`
TEST `mcp_server/tests/eval-db.vitest.ts`
FILE 02-core-metric-computation.md
IMPL `mcp_server/lib/eval/eval-metrics.ts`
TEST `mcp_server/tests/eval-metrics.vitest.ts`
FILE 03-observer-effect-mitigation.md
IMPL `mcp_server/lib/eval/eval-db.ts`; `mcp_server/lib/eval/shadow-scoring.ts`
TEST `mcp_server/tests/eval-db.vitest.ts`; `mcp_server/tests/scoring.vitest.ts`; `mcp_server/tests/shadow-scoring.vitest.ts`
FILE 04-full-context-ceiling-evaluation.md
IMPL `mcp_server/lib/eval/eval-ceiling.ts`; `mcp_server/lib/eval/eval-metrics.ts`
TEST `mcp_server/tests/eval-metrics.vitest.ts`
FILE 05-quality-proxy-formula.md
IMPL `mcp_server/lib/eval/eval-quality-proxy.ts`
TEST NONE
FILE 06-synthetic-ground-truth-corpus.md
IMPL `mcp_server/lib/eval/ground-truth-data.ts`; `mcp_server/lib/eval/ground-truth-generator.ts`
TEST `mcp_server/tests/ground-truth.vitest.ts`
FILE 07-bm25-only-baseline.md
IMPL `mcp_server/lib/eval/bm25-baseline.ts`; `mcp_server/lib/eval/eval-metrics.ts`; `mcp_server/lib/eval/ground-truth-data.ts`
codex
**09--evaluation-and-measurement**
---
FEATURE: 01-evaluation-database-and-schema.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/eval/eval-logger.ts`; `mcp_server/handlers/memory-search.ts`; `mcp_server/handlers/memory-context.ts`; `mcp_server/handlers/memory-triggers.ts`  
UNDOCUMENTED_CAPABILITIES: Eval logging is env-gated and fail-safe; handlers log query, per-channel, and final fused results.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `eval-db.ts` creates `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth`, `eval_metric_snapshots`; the three memory handlers import and call the eval logger.

---
FEATURE: 02-core-metric-computation.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The doc says 11 metrics, but `computeAllMetrics()` returns 12; `MAP` is implemented but not documented.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: `computeAllMetrics()` also emits configurable cutoff-based aggregates, including `map`.  
SEVERITY: P1 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `mcp_server/lib/eval/eval-metrics.ts` `computeAllMetrics()` includes `map`, `constitutionalSurfacingRate`, `coldStartDetectionRate`, and `intentWeightedNdcg`.

---
FEATURE: 03-observer-effect-mitigation.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The doc describes a p95 latency health check, 10% alerting, and a 5ms observer budget, but none of that exists in code. It also overstates failures as “silent”; the code warns/logs on failure.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/eval/eval-logger.ts`; `mcp_server/handlers/memory-search.ts`; `mcp_server/handlers/memory-context.ts`; `mcp_server/handlers/memory-triggers.ts`  
UNDOCUMENTED_CAPABILITIES: The real mitigation is fail-safe local logging plus a permanently disabled shadow-write path.  
SEVERITY: P1 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: `mcp_server/lib/eval/shadow-scoring.ts` `runShadowScoring()` returns `null`; `logShadowComparison()` returns `false`; no health-check/latency-budget code is present.

---
FEATURE: 04-full-context-ceiling-evaluation.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The doc frames this as an LLM/all-context ceiling, but the code also supports a pure ground-truth-only ceiling without any scorer.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/ceiling-quality.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: `interpretCeilingVsBaseline()` classifies the gap; `computeCeilingFromGroundTruth()` works without model/scorer dependencies.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/eval/eval-ceiling.ts` exports both `computeCeilingFromGroundTruth()` and `computeCeilingWithScorer()`.

---
FEATURE: 05-quality-proxy-formula.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The weighted formula is correct, but the doc’s “correlation confirmed” language is not supported by code, and runtime usage is elsewhere.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/telemetry/retrieval-telemetry.ts`; `mcp_server/tests/ceiling-quality.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The module returns per-component breakdowns and an interpretation label (`excellent/good/acceptable/poor`).  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/eval/eval-quality-proxy.ts` defines weights `0.40/0.25/0.20/0.15` and returns `components` plus `interpretation`.

---
FEATURE: 06-synthetic-ground-truth-corpus.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: Corpus counts match, but the claim that it incorporates “G-NEW-2 agent consumption analysis” is not evidenced in the data or generator code.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/eval/data/ground-truth.json`; `scripts/evals/map-ground-truth-ids.ts`  
UNDOCUMENTED_CAPABILITIES: The generator loads the corpus into the eval DB and validates diversity gates before use.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `ground-truth-data.ts` loads 110 queries from `ground-truth.json`; `ground-truth-generator.ts` exports `validateGroundTruthDiversity()`.

---
FEATURE: 07-bm25-only-baseline.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The fixed MRR value reads like live code behavior, but the module computes metrics from the dataset at runtime. The runtime `ENABLE_BM25`/channel behavior belongs to the search stack, not this baseline evaluator.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/search-flags.ts`; `mcp_server/lib/search/hybrid-search.ts`  
UNDOCUMENTED_CAPABILITIES: The baseline module computes bootstrap confidence intervals, contingency decisions, and persists snapshots into `eval_metric_snapshots`.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/eval/bm25-baseline.ts` computes metrics per run and writes contingency/snapshot rows; no constant “0.2083” is hardcoded.

---
FEATURE: 08-agent-consumption-instrumentation.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`; `mcp_server/handlers/memory-context.ts`; `mcp_server/handlers/memory-triggers.ts`  
UNDOCUMENTED_CAPABILITIES: The logger also exposes aggregate stats/pattern analysis over the `consumption_log` table.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/telemetry/consumption-logger.ts` hardcodes `isConsumptionLogEnabled()` to `false` but still exports `logConsumptionEvent()`, `getConsumptionStats()`, and `getConsumptionPatterns()`.

---
FEATURE: 09-scoring-observability.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The doc says failures are swallowed silently, but the module logs errors/warnings. It also omits the real scoring integration points.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/context-server.ts`  
UNDOCUMENTED_CAPABILITIES: There are explicit init/reset/stats helpers around the sampled scoring log.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `scoring-observability.ts` sets `SAMPLING_RATE = 0.05`; `composite-scoring.ts` logs `noveltyBoostApplied: false`; `context-server.ts` initializes scoring observability.

---
FEATURE: 10-full-reporting-and-ablation-study-framework.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/eval-reporting.ts`  
UNDOCUMENTED_CAPABILITIES: The dashboard row limit is env-configurable, ablation continues past per-channel failures, and results are stored with negative timestamp IDs.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `reporting-dashboard.ts` defines `DASHBOARD_ROW_LIMIT`; `ablation-framework.ts` stores results via negative timestamp `eval_run_id`s and uses a sign test.

---
FEATURE: 11-shadow-scoring-and-channel-attribution.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The shadow-write removal is correct, but “channel attribution remains active in the 4-stage pipeline” is overstated; current code shows helper/test coverage, not clear live pipeline wiring.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/learned-feedback.ts`  
UNDOCUMENTED_CAPABILITIES: Read-only comparison/reporting helpers remain usable even though production shadow writes are disabled.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `shadow-scoring.ts` disables `runShadowScoring()`/`logShadowComparison()`; `channel-attribution.ts` still exports `attributeChannels()` and `getChannelAttribution()`.

---
FEATURE: 12-test-quality-improvements.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: “No dedicated source files” is false. The parser path in the prose is stale: the code lives at `mcp_server/lib/parsing/memory-parser.ts`, not `mcp_server/lib/memory-parser.ts`. The test-count delta is not verifiable from source.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/memory-save-extended.vitest.ts`; `mcp_server/tests/entity-linker.vitest.ts`; `mcp_server/tests/integration-search-pipeline.vitest.ts`; `mcp_server/lib/parsing/memory-parser.ts`; `mcp_server/tests/full-spec-doc-indexing.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The parser now rejects `/z_archive/` spec docs, and multiple tests were converted to `it.skipIf(...)` fail-fast patterns.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `memory-save-extended.vitest.ts` uses `15000` timeout and `it.skipIf(...)`; `entity-linker.vitest.ts` calls `db.close()`; `memory-parser.ts` rejects `/z_archive/`.

---
FEATURE: 13-evaluation-and-housekeeping-fixes.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/eval-reporting.ts`; `mcp_server/handlers/session-learning.ts`; `mcp_server/tools/types.ts`; `mcp_server/lib/session/session-manager.ts`; `mcp_server/lib/storage/access-tracker.ts`; `shared/config.ts`  
UNDOCUMENTED_CAPABILITIES: The fixes span eval, lifecycle, tool-boundary, dedup, env resolution, and shutdown cleanup layers, not just eval libs.  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: `eval-reporting.ts` uses `recallK`; `session-learning.ts` queries `phase IN ('preflight', 'complete')`; `tools/types.ts` returns `{}` for non-object args; `session-manager.ts` uses `.slice(0, 32)`; `access-tracker.ts` removes listeners.

---
FEATURE: 14-cross-ai-validation-fixes.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: “No dedicated source files” is false. The external-review provenance claims are not verifiable from source, and the file collapses many unrelated code changes into one meta-summary without mapping them to the real modules.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/memory-save-extended.vitest.ts`; `mcp_server/handlers/memory-crud-delete.ts`; `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/handlers/save/dedup.ts`; `mcp_server/lib/session/session-manager.ts`; `shared/config.ts`; `mcp_server/lib/eval/reporting-dashboard.ts`; `mcp_server/lib/search/evidence-gap-detector.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P1 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: The listed fixes map to concrete code like `it.skipIf(...)`, `parent_id IS NULL`, `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`, `SPECKIT_DASHBOARD_LIMIT`, and `Number.isFinite(...)`, but no source table is provided.

**10--graph-signal-activation**
---
FEATURE: 01-typed-weighted-degree-channel.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/search-flags.ts`; `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/lib/storage/causal-edges.ts`  
UNDOCUMENTED_CAPABILITIES: The degree cache is explicitly invalidated on graph mutations, and constitutional memories are excluded before scoring.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `graph-search-fn.ts` defines `DEFAULT_MAX_TYPED_DEGREE = 15`, `MAX_TOTAL_DEGREE = 50`, `DEGREE_BOOST_CAP = 0.15`; `causal-edges.ts` clears the degree cache on mutations.

---
FEATURE: 02-co-activation-boost-strength-increase.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The code sets a default multiplier of `0.25`, not “0.25-0.3x”. The “dark-run measurement sequence” is not implemented in source.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: The module also maintains related-memory caching and spreading-activation helpers beyond just the boost constant.  
SEVERITY: P1 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `mcp_server/lib/cognitive/co-activation.ts` exports `DEFAULT_COACTIVATION_STRENGTH = 0.25` and reads `SPECKIT_COACTIVATION_STRENGTH`.

---
FEATURE: 03-edge-density-measurement.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/entity-linker.ts`  
UNDOCUMENTED_CAPABILITIES: The module also formats a density report with escalation guidance rather than only returning a raw number.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `edge-density.ts` computes global density as `total_edges / total_memories`; `entity-linker.ts` uses density gates before creating graph structure.

---
FEATURE: 04-weight-history-audit-tracking.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/vector-index-schema.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: `causal-edges.ts` adds `created_by`, `last_accessed`, `rollbackWeights()`; `vector-index-schema.ts` creates `weight_history`.

---
FEATURE: 05-graph-momentum-scoring.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The fallback behavior is wrong: when no 7-day snapshot exists, momentum does not default to zero; it behaves like `current_degree - 0`.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/lib/search/search-flags.ts`; `mcp_server/handlers/mutation-hooks.ts`; `mcp_server/lib/search/vector-index-schema.ts`  
UNDOCUMENTED_CAPABILITIES: Snapshot capture and cache invalidation are wired into graph mutations.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `graph-signals.ts` computes `currentDegree - historicalDegree`; tests expect current degree when no historical snapshot exists.

---
FEATURE: 06-causal-depth-signal.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/lib/search/search-flags.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: `graph-signals.ts` computes normalized causal depth and `applyGraphSignals()` adds it during Stage 2.

---
FEATURE: 07-community-detection.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/lib/search/search-flags.ts`; `mcp_server/lib/search/vector-index-schema.ts`  
UNDOCUMENTED_CAPABILITIES: Stored community assignments can be reloaded without recomputing communities.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `community-detection.ts` escalates when the largest component exceeds 50%; `vector-index-schema.ts` creates `community_assignments`; `stage2-fusion.ts` calls `applyCommunityBoost()`.

---
FEATURE: 08-graph-and-cognitive-memory-fixes.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/storage/causal-edges.ts`; `mcp_server/handlers/causal-graph.ts`; `mcp_server/handlers/memory-triggers.ts`; `mcp_server/handlers/memory-bulk-delete.ts`; `mcp_server/handlers/memory-crud-health.ts`; `mcp_server/handlers/mutation-hooks.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P1 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: The actual fixes live in graph/cognitive handlers and `causal-edges.ts`, but the table mostly points at scoring modules unrelated to the listed fixes.

---
FEATURE: 09-anchor-tags-as-graph-nodes.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: The listed source files already implement anchor-aware chunking, anchor metadata enrichment, and retrieval-trace typing, but not graph-node promotion itself.  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `anchor-chunker.ts` chunks by anchors and `anchor-metadata.ts` enriches results; no graph-node creation logic exists.

---
FEATURE: 10-causal-neighbor-boost-and-injection.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The relation-type prose is wrong: the code knows `supersedes`, `contradicts`, `caused`, `enabled`, `derived_from`, and `supports`; there is no `leads_to` or `relates_to`.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: Prompted seed selection is capped by both `SEED_FRACTION = 0.25` and `MAX_SEED_RESULTS = 5`, and causal boost is clipped against existing session boost.  
SEVERITY: P1 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `causal-boost.ts` defines relation multipliers with `supersedes: 1.5`, `contradicts: 0.8`, others `1.0`, plus `MAX_HOPS = 2` and `MAX_COMBINED_BOOST = 0.20`.

---
FEATURE: 11-temporal-contiguity-layer.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The exported API names are wrong: the module exposes `getTemporalNeighbors()` and `buildTimeline()`, not `queryTemporalNeighbors()` and `buildSpecFolderTimeline()`. The boost operates on provided vector results; it does not query DB as part of the boost step.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: The module requires explicit `init(database)` before DB-backed helpers work.  
SEVERITY: P1 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `temporal-contiguity.ts` exports `vectorSearchWithContiguity()`, `getTemporalNeighbors()`, and `buildTimeline()` with `DEFAULT_WINDOW = 3600` and `MAX_WINDOW = 86400`.

**11--scoring-and-calibration**
---
FEATURE: 01-score-normalization.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `shared/algorithms/rrf-fusion.ts`; `mcp_server/tests/graph-scoring-integration.vitest.ts`; `mcp_server/tests/feature-eval-scoring-calibration.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: Both normalization paths guard non-finite scores; all-equal and single-result cases normalize to `1.0`.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `composite-scoring.ts` exports `normalizeCompositeScores()`; `rrf-fusion.ts` exports `normalizeRrfScores()` and both use `SPECKIT_SCORE_NORMALIZATION`.

---
FEATURE: 02-cold-start-novelty-boost.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The first two paragraphs describe an active boost formula, but current code has the feature removed from search: `calculateNoveltyBoost()` always returns `0`.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/cold-start.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The constants remain only for compatibility/testing; scoring telemetry is hardcoded to `noveltyBoostApplied: false`.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/scoring/composite-scoring.ts` marks novelty boost deprecated and implements `calculateNoveltyBoost(...) { return 0; }`.

---
FEATURE: 03-interference-scoring.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/lib/search/vector-index-store.ts`  
UNDOCUMENTED_CAPABILITIES: Chunk rows are excluded via `parent_id IS NULL`, and batch scoring takes an optional threshold override.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `interference-scoring.ts` uses `INTERFERENCE_SIMILARITY_THRESHOLD = 0.75`, `INTERFERENCE_PENALTY_COEFFICIENT = -0.08`, and filters `parent_id IS NULL`.

---
FEATURE: 04-classification-based-decay.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: When the flag is disabled, composite scoring falls back to the older elapsed-time tier multiplier path instead of the classification-stability path.  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `fsrs-scheduler.ts` defines `CONTEXT_TYPE_STABILITY_MULTIPLIER` and `IMPORTANCE_TIER_STABILITY_MULTIPLIER`; `composite-scoring.ts` switches behavior on `SPECKIT_CLASSIFICATION_DECAY !== 'false'`.

---
FEATURE: 05-folder-level-relevance-scoring.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The 4-factor formula is real, but the validation component is still a fixed placeholder (`0.5`), not live folder-specific feedback. The doc also blends this with the separate DocScore two-phase runtime pipeline.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/handlers/memory-crud-stats.ts`  
UNDOCUMENTED_CAPABILITIES: Runtime search results are enriched with `folderScore`, `folderRank`, and `specFolder` metadata.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `shared/scoring/folder-scoring.ts` sets `DEFAULT_VALIDATION_SCORE = 0.5`; `folder-relevance.ts` implements `twoPhaseRetrieval()` and enrichment helpers; `hybrid-search.ts` wires them into runtime.

---
FEATURE: 06-embedding-cache.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/save/embedding-pipeline.ts`; `mcp_server/handlers/chunking-orchestrator.ts`; `mcp_server/lib/search/vector-index-schema.ts`  
UNDOCUMENTED_CAPABILITIES: The module also exposes stats, full cache clear, content hashing, and age-based eviction helpers.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `embedding-cache.ts` uses SHA-256 content hashes, `INSERT OR REPLACE`, `last_used_at` LRU trimming, and exports `getCacheStats()`/`clearCache()`.

---
FEATURE: 07-double-intent-weighting-investigation.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The architecture summary is directionally right, but “No code change needed” is misleading for current reality because the present fix is structural: Stage 2 now explicitly gates intent weighting to non-hybrid flows.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `shared/algorithms/adaptive-fusion.ts`; `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/lib/search/pipeline/stage2-fusion.ts`  
UNDOCUMENTED_CAPABILITIES: Stage 2 also synchronizes `intentAdjustedScore` back from later score mutations so downstream ranking sees post-signal changes.  
SEVERITY: P1 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: `stage2-fusion.ts` applies intent weights only under `if (!isHybrid && config.intentWeights)`; `adaptive-fusion.ts` still owns `INTENT_WEIGHT_PROFILES`.

---
FEATURE: 08-rrf-k-value-sensitivity-analysis.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The code does run the K-grid analysis, but it does not itself identify or document an “optimal K”; it reports metrics against the `K=60` baseline ranking.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/score-normalization.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The analysis is pure and DB-free; it also reports `avgScore` and `totalItems` across tested K values.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `k-value-analysis.ts` fixes `K_VALUES = [20,40,60,80,100]`, `BASELINE_K = 60`, and computes `kendallTau`, `mrr5`, and `avgScore`.

---
FEATURE: 09-negative-feedback-confidence-signal.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/checkpoints.ts`; `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/lib/search/search-flags.ts`; `mcp_server/tests/learned-feedback.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: Batch stat loading and persistence helpers (`recordNegativeFeedbackEvent`, `getNegativeFeedbackStats`) are central to the feature.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `negative-feedback.ts` defines `RECOVERY_HALF_LIFE_MS`, writes `negative_feedback_events`, and `stage2-fusion.ts` applies `applyNegativeFeedback(...)` when the flag is enabled.

---
FEATURE: 10-auto-promotion-on-validation.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: Thresholds and audit logging are correct, but the effective promotion count is positive validations, not raw `validation_count`; negative feedback events are subtracted first.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/checkpoints.ts`; `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts`; `mcp_server/lib/scoring/negative-feedback.ts`  
UNDOCUMENTED_CAPABILITIES: The module supports read-only eligibility scans via `scanForPromotions()`.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `auto-promotion.ts` computes `positiveValidationCount = totalValidationCount - negativeValidationCount`; `checkpoints.ts` returns `autoPromotion` metadata in `memory_validate`.

---
FEATURE: 11-scoring-and-ranking-corrections.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/causal-boost.ts`; `mcp_server/lib/eval/ablation-framework.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: `composite-scoring.ts` clamps final scores and removes citation fallback; `causal-boost.ts` uses `UNION`; `ablation-framework.ts` uses `logBinomial(...)`.

---
FEATURE: 12-stage-3-effectivescore-fallback-chain.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: The narrative is right, but the source table is badly scoped and misses the paired Stage 2 implementation that now shares the fallback logic.  
PATHS_VALID: NO | INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/tests/stage2-fusion.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The canonical fallback is now centralized in `resolveEffectiveScore()` and reused across stages.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `pipeline/types.ts` defines `resolveEffectiveScore()` as `intentAdjustedScore -> rrfScore -> score -> similarity/100`; `stage3-rerank.ts` aliases `const effectiveScore = resolveEffectiveScore`.

---
FEATURE: 13-scoring-and-fusion-corrections.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/intent-classifier.ts`; `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/lib/scoring/interference-scoring.ts`; `mcp_server/lib/search/pipeline/types.ts`; `mcp_server/lib/search/pipeline/stage2-fusion.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: The listed fixes span intent weighting, composite normalization, BM25 spec-folder filtering, shared score resolution, and post-signal score sync, but the table only cites `mpab-aggregation.ts`, `rsf-fusion.ts`, and `rrf-fusion.ts`.

---
FEATURE: 14-local-gguf-reranker-via-node-llama-cpp.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The memory thresholds are wrong: code requires `8GB total` by default and `2GB total` with a custom model, not “4GB free / 512MB”. Fallback is original ordering, not specifically “RRF scoring”.  
PATHS_VALID: NO | INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage3-rerank.ts`; `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/tests/reranker-eval-comparison.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: Timeout control, prompt-byte truncation, dynamic score-method resolution, and a hard cap of 50 rerank candidates.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `local-reranker.ts` sets `MIN_TOTAL_MEMORY_BYTES = 8 * 1024 * 1024 * 1024`, `MIN_TOTAL_MEMORY_CUSTOM_BYTES = 2 * 1024 * 1024 * 1024`, `MAX_RERANK_CANDIDATES = 50`.

---
FEATURE: 15-tool-level-ttl-cache.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The cache implementation is correct, but the doc overstates read-path integration: only `memory_search` actually uses `withCache`; save/delete flows mostly invalidate cached search results through mutation hooks.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`; `mcp_server/context-server.ts`; `mcp_server/handlers/chunking-orchestrator.ts`  
UNDOCUMENTED_CAPABILITIES: The cache supports `bypassCache`, regex invalidation, explicit startup/shutdown, and deterministic arg canonicalization that drops `undefined` keys.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `tool-cache.ts` defines TTL/max-entry cleanup and SHA-256 keys; `memory-search.ts` calls `toolCache.withCache(...)`; mutation hooks call `invalidateOnWrite(...)`.

---
FEATURE: 16-access-driven-popularity-scoring.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The batching model is correct, but `getAccessStats()` does not exist in the access tracker implementation.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/vector-index-queries.ts`  
UNDOCUMENTED_CAPABILITIES: The tracker also computes `calculateUsageBoost()`, flushes on shutdown, and the broader system exposes usage stats via `get_usage_stats()` in query code.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `access-tracker.ts` exports `trackAccess`, `trackMultipleAccesses`, `calculatePopularityScore`, `calculateUsageBoost`, and shutdown flush helpers; there is no `getAccessStats()` export.

---
FEATURE: 17-temporal-structural-coherence-scoring.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The code does not do temporal/relational coherence analysis. `scoreCoherence()` only checks non-empty content, length thresholds, Markdown headings, and “substantial content”; there is no future-event/reference consistency logic.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/memory-save.ts`  
UNDOCUMENTED_CAPABILITIES: The quality loop auto-fixes trigger phrases, closes broken anchors, trims oversized content, retries scoring, and can reject saves after max retries.  
SEVERITY: P0 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: `quality-loop.ts` awards coherence via four simple structural checks and never inspects chronology, causal links, or predecessor existence.
tokens used
949,218
**09--evaluation-and-measurement**
---
FEATURE: 01-evaluation-database-and-schema.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/eval/eval-logger.ts`; `mcp_server/handlers/memory-search.ts`; `mcp_server/handlers/memory-context.ts`; `mcp_server/handlers/memory-triggers.ts`  
UNDOCUMENTED_CAPABILITIES: Eval logging is env-gated and fail-safe; handlers log query, per-channel, and final fused results.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `eval-db.ts` creates `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth`, `eval_metric_snapshots`; the three memory handlers import and call the eval logger.

---
FEATURE: 02-core-metric-computation.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The doc says 11 metrics, but `computeAllMetrics()` returns 12; `MAP` is implemented but not documented.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: `computeAllMetrics()` also emits configurable cutoff-based aggregates, including `map`.  
SEVERITY: P1 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `mcp_server/lib/eval/eval-metrics.ts` `computeAllMetrics()` includes `map`, `constitutionalSurfacingRate`, `coldStartDetectionRate`, and `intentWeightedNdcg`.

---
FEATURE: 03-observer-effect-mitigation.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The doc describes a p95 latency health check, 10% alerting, and a 5ms observer budget, but none of that exists in code. It also overstates failures as “silent”; the code warns/logs on failure.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/eval/eval-logger.ts`; `mcp_server/handlers/memory-search.ts`; `mcp_server/handlers/memory-context.ts`; `mcp_server/handlers/memory-triggers.ts`  
UNDOCUMENTED_CAPABILITIES: The real mitigation is fail-safe local logging plus a permanently disabled shadow-write path.  
SEVERITY: P1 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: `mcp_server/lib/eval/shadow-scoring.ts` `runShadowScoring()` returns `null`; `logShadowComparison()` returns `false`; no health-check/latency-budget code is present.

---
FEATURE: 04-full-context-ceiling-evaluation.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The doc frames this as an LLM/all-context ceiling, but the code also supports a pure ground-truth-only ceiling without any scorer.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/ceiling-quality.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: `interpretCeilingVsBaseline()` classifies the gap; `computeCeilingFromGroundTruth()` works without model/scorer dependencies.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/eval/eval-ceiling.ts` exports both `computeCeilingFromGroundTruth()` and `computeCeilingWithScorer()`.

---
FEATURE: 05-quality-proxy-formula.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The weighted formula is correct, but the doc’s “correlation confirmed” language is not supported by code, and runtime usage is elsewhere.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/telemetry/retrieval-telemetry.ts`; `mcp_server/tests/ceiling-quality.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The module returns per-component breakdowns and an interpretation label (`excellent/good/acceptable/poor`).  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/eval/eval-quality-proxy.ts` defines weights `0.40/0.25/0.20/0.15` and returns `components` plus `interpretation`.

---
FEATURE: 06-synthetic-ground-truth-corpus.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: Corpus counts match, but the claim that it incorporates “G-NEW-2 agent consumption analysis” is not evidenced in the data or generator code.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/eval/data/ground-truth.json`; `scripts/evals/map-ground-truth-ids.ts`  
UNDOCUMENTED_CAPABILITIES: The generator loads the corpus into the eval DB and validates diversity gates before use.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `ground-truth-data.ts` loads 110 queries from `ground-truth.json`; `ground-truth-generator.ts` exports `validateGroundTruthDiversity()`.

---
FEATURE: 07-bm25-only-baseline.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The fixed MRR value reads like live code behavior, but the module computes metrics from the dataset at runtime. The runtime `ENABLE_BM25`/channel behavior belongs to the search stack, not this baseline evaluator.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/search-flags.ts`; `mcp_server/lib/search/hybrid-search.ts`  
UNDOCUMENTED_CAPABILITIES: The baseline module computes bootstrap confidence intervals, contingency decisions, and persists snapshots into `eval_metric_snapshots`.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/eval/bm25-baseline.ts` computes metrics per run and writes contingency/snapshot rows; no constant “0.2083” is hardcoded.

---
FEATURE: 08-agent-consumption-instrumentation.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`; `mcp_server/handlers/memory-context.ts`; `mcp_server/handlers/memory-triggers.ts`  
UNDOCUMENTED_CAPABILITIES: The logger also exposes aggregate stats/pattern analysis over the `consumption_log` table.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/telemetry/consumption-logger.ts` hardcodes `isConsumptionLogEnabled()` to `false` but still exports `logConsumptionEvent()`, `getConsumptionStats()`, and `getConsumptionPatterns()`.

---
FEATURE: 09-scoring-observability.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The doc says failures are swallowed silently, but the module logs errors/warnings. It also omits the real scoring integration points.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/context-server.ts`  
UNDOCUMENTED_CAPABILITIES: There are explicit init/reset/stats helpers around the sampled scoring log.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `scoring-observability.ts` sets `SAMPLING_RATE = 0.05`; `composite-scoring.ts` logs `noveltyBoostApplied: false`; `context-server.ts` initializes scoring observability.

---
FEATURE: 10-full-reporting-and-ablation-study-framework.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/eval-reporting.ts`  
UNDOCUMENTED_CAPABILITIES: The dashboard row limit is env-configurable, ablation continues past per-channel failures, and results are stored with negative timestamp IDs.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `reporting-dashboard.ts` defines `DASHBOARD_ROW_LIMIT`; `ablation-framework.ts` stores results via negative timestamp `eval_run_id`s and uses a sign test.

---
FEATURE: 11-shadow-scoring-and-channel-attribution.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The shadow-write removal is correct, but “channel attribution remains active in the 4-stage pipeline” is overstated; current code shows helper/test coverage, not clear live pipeline wiring.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/learned-feedback.ts`  
UNDOCUMENTED_CAPABILITIES: Read-only comparison/reporting helpers remain usable even though production shadow writes are disabled.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `shadow-scoring.ts` disables `runShadowScoring()`/`logShadowComparison()`; `channel-attribution.ts` still exports `attributeChannels()` and `getChannelAttribution()`.

---
FEATURE: 12-test-quality-improvements.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: “No dedicated source files” is false. The parser path in the prose is stale: the code lives at `mcp_server/lib/parsing/memory-parser.ts`, not `mcp_server/lib/memory-parser.ts`. The test-count delta is not verifiable from source.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/memory-save-extended.vitest.ts`; `mcp_server/tests/entity-linker.vitest.ts`; `mcp_server/tests/integration-search-pipeline.vitest.ts`; `mcp_server/lib/parsing/memory-parser.ts`; `mcp_server/tests/full-spec-doc-indexing.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The parser now rejects `/z_archive/` spec docs, and multiple tests were converted to `it.skipIf(...)` fail-fast patterns.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `memory-save-extended.vitest.ts` uses `15000` timeout and `it.skipIf(...)`; `entity-linker.vitest.ts` calls `db.close()`; `memory-parser.ts` rejects `/z_archive/`.

---
FEATURE: 13-evaluation-and-housekeeping-fixes.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/eval-reporting.ts`; `mcp_server/handlers/session-learning.ts`; `mcp_server/tools/types.ts`; `mcp_server/lib/session/session-manager.ts`; `mcp_server/lib/storage/access-tracker.ts`; `shared/config.ts`  
UNDOCUMENTED_CAPABILITIES: The fixes span eval, lifecycle, tool-boundary, dedup, env resolution, and shutdown cleanup layers, not just eval libs.  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: `eval-reporting.ts` uses `recallK`; `session-learning.ts` queries `phase IN ('preflight', 'complete')`; `tools/types.ts` returns `{}` for non-object args; `session-manager.ts` uses `.slice(0, 32)`; `access-tracker.ts` removes listeners.

---
FEATURE: 14-cross-ai-validation-fixes.md  
CATEGORY: 09--evaluation-and-measurement  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: “No dedicated source files” is false. The external-review provenance claims are not verifiable from source, and the file collapses many unrelated code changes into one meta-summary without mapping them to the real modules.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/memory-save-extended.vitest.ts`; `mcp_server/handlers/memory-crud-delete.ts`; `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/handlers/save/dedup.ts`; `mcp_server/lib/session/session-manager.ts`; `shared/config.ts`; `mcp_server/lib/eval/reporting-dashboard.ts`; `mcp_server/lib/search/evidence-gap-detector.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P1 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: The listed fixes map to concrete code like `it.skipIf(...)`, `parent_id IS NULL`, `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR`, `SPECKIT_DASHBOARD_LIMIT`, and `Number.isFinite(...)`, but no source table is provided.

**10--graph-signal-activation**
---
FEATURE: 01-typed-weighted-degree-channel.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/search-flags.ts`; `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/lib/storage/causal-edges.ts`  
UNDOCUMENTED_CAPABILITIES: The degree cache is explicitly invalidated on graph mutations, and constitutional memories are excluded before scoring.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `graph-search-fn.ts` defines `DEFAULT_MAX_TYPED_DEGREE = 15`, `MAX_TOTAL_DEGREE = 50`, `DEGREE_BOOST_CAP = 0.15`; `causal-edges.ts` clears the degree cache on mutations.

---
FEATURE: 02-co-activation-boost-strength-increase.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The code sets a default multiplier of `0.25`, not “0.25-0.3x”. The “dark-run measurement sequence” is not implemented in source.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: The module also maintains related-memory caching and spreading-activation helpers beyond just the boost constant.  
SEVERITY: P1 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `mcp_server/lib/cognitive/co-activation.ts` exports `DEFAULT_COACTIVATION_STRENGTH = 0.25` and reads `SPECKIT_COACTIVATION_STRENGTH`.

---
FEATURE: 03-edge-density-measurement.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/entity-linker.ts`  
UNDOCUMENTED_CAPABILITIES: The module also formats a density report with escalation guidance rather than only returning a raw number.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `edge-density.ts` computes global density as `total_edges / total_memories`; `entity-linker.ts` uses density gates before creating graph structure.

---
FEATURE: 04-weight-history-audit-tracking.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/vector-index-schema.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: `causal-edges.ts` adds `created_by`, `last_accessed`, `rollbackWeights()`; `vector-index-schema.ts` creates `weight_history`.

---
FEATURE: 05-graph-momentum-scoring.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The fallback behavior is wrong: when no 7-day snapshot exists, momentum does not default to zero; it behaves like `current_degree - 0`.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/lib/search/search-flags.ts`; `mcp_server/handlers/mutation-hooks.ts`; `mcp_server/lib/search/vector-index-schema.ts`  
UNDOCUMENTED_CAPABILITIES: Snapshot capture and cache invalidation are wired into graph mutations.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `graph-signals.ts` computes `currentDegree - historicalDegree`; tests expect current degree when no historical snapshot exists.

---
FEATURE: 06-causal-depth-signal.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/lib/search/search-flags.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: `graph-signals.ts` computes normalized causal depth and `applyGraphSignals()` adds it during Stage 2.

---
FEATURE: 07-community-detection.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/lib/search/search-flags.ts`; `mcp_server/lib/search/vector-index-schema.ts`  
UNDOCUMENTED_CAPABILITIES: Stored community assignments can be reloaded without recomputing communities.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `community-detection.ts` escalates when the largest component exceeds 50%; `vector-index-schema.ts` creates `community_assignments`; `stage2-fusion.ts` calls `applyCommunityBoost()`.

---
FEATURE: 08-graph-and-cognitive-memory-fixes.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/storage/causal-edges.ts`; `mcp_server/handlers/causal-graph.ts`; `mcp_server/handlers/memory-triggers.ts`; `mcp_server/handlers/memory-bulk-delete.ts`; `mcp_server/handlers/memory-crud-health.ts`; `mcp_server/handlers/mutation-hooks.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P1 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: The actual fixes live in graph/cognitive handlers and `causal-edges.ts`, but the table mostly points at scoring modules unrelated to the listed fixes.

---
FEATURE: 09-anchor-tags-as-graph-nodes.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: The listed source files already implement anchor-aware chunking, anchor metadata enrichment, and retrieval-trace typing, but not graph-node promotion itself.  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `anchor-chunker.ts` chunks by anchors and `anchor-metadata.ts` enriches results; no graph-node creation logic exists.

---
FEATURE: 10-causal-neighbor-boost-and-injection.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The relation-type prose is wrong: the code knows `supersedes`, `contradicts`, `caused`, `enabled`, `derived_from`, and `supports`; there is no `leads_to` or `relates_to`.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: Prompted seed selection is capped by both `SEED_FRACTION = 0.25` and `MAX_SEED_RESULTS = 5`, and causal boost is clipped against existing session boost.  
SEVERITY: P1 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `causal-boost.ts` defines relation multipliers with `supersedes: 1.5`, `contradicts: 0.8`, others `1.0`, plus `MAX_HOPS = 2` and `MAX_COMBINED_BOOST = 0.20`.

---
FEATURE: 11-temporal-contiguity-layer.md  
CATEGORY: 10--graph-signal-activation  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The exported API names are wrong: the module exposes `getTemporalNeighbors()` and `buildTimeline()`, not `queryTemporalNeighbors()` and `buildSpecFolderTimeline()`. The boost operates on provided vector results; it does not query DB as part of the boost step.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: The module requires explicit `init(database)` before DB-backed helpers work.  
SEVERITY: P1 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `temporal-contiguity.ts` exports `vectorSearchWithContiguity()`, `getTemporalNeighbors()`, and `buildTimeline()` with `DEFAULT_WINDOW = 3600` and `MAX_WINDOW = 86400`.

**11--scoring-and-calibration**
---
FEATURE: 01-score-normalization.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `shared/algorithms/rrf-fusion.ts`; `mcp_server/tests/graph-scoring-integration.vitest.ts`; `mcp_server/tests/feature-eval-scoring-calibration.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: Both normalization paths guard non-finite scores; all-equal and single-result cases normalize to `1.0`.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `composite-scoring.ts` exports `normalizeCompositeScores()`; `rrf-fusion.ts` exports `normalizeRrfScores()` and both use `SPECKIT_SCORE_NORMALIZATION`.

---
FEATURE: 02-cold-start-novelty-boost.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The first two paragraphs describe an active boost formula, but current code has the feature removed from search: `calculateNoveltyBoost()` always returns `0`.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/cold-start.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The constants remain only for compatibility/testing; scoring telemetry is hardcoded to `noveltyBoostApplied: false`.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `mcp_server/lib/scoring/composite-scoring.ts` marks novelty boost deprecated and implements `calculateNoveltyBoost(...) { return 0; }`.

---
FEATURE: 03-interference-scoring.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/lib/search/vector-index-store.ts`  
UNDOCUMENTED_CAPABILITIES: Chunk rows are excluded via `parent_id IS NULL`, and batch scoring takes an optional threshold override.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `interference-scoring.ts` uses `INTERFERENCE_SIMILARITY_THRESHOLD = 0.75`, `INTERFERENCE_PENALTY_COEFFICIENT = -0.08`, and filters `parent_id IS NULL`.

---
FEATURE: 04-classification-based-decay.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: NONE  
UNDOCUMENTED_CAPABILITIES: When the flag is disabled, composite scoring falls back to the older elapsed-time tier multiplier path instead of the classification-stability path.  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_DESCRIPTION  
EVIDENCE: `fsrs-scheduler.ts` defines `CONTEXT_TYPE_STABILITY_MULTIPLIER` and `IMPORTANCE_TIER_STABILITY_MULTIPLIER`; `composite-scoring.ts` switches behavior on `SPECKIT_CLASSIFICATION_DECAY !== 'false'`.

---
FEATURE: 05-folder-level-relevance-scoring.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The 4-factor formula is real, but the validation component is still a fixed placeholder (`0.5`), not live folder-specific feedback. The doc also blends this with the separate DocScore two-phase runtime pipeline.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/handlers/memory-crud-stats.ts`  
UNDOCUMENTED_CAPABILITIES: Runtime search results are enriched with `folderScore`, `folderRank`, and `specFolder` metadata.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `shared/scoring/folder-scoring.ts` sets `DEFAULT_VALIDATION_SCORE = 0.5`; `folder-relevance.ts` implements `twoPhaseRetrieval()` and enrichment helpers; `hybrid-search.ts` wires them into runtime.

---
FEATURE: 06-embedding-cache.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/save/embedding-pipeline.ts`; `mcp_server/handlers/chunking-orchestrator.ts`; `mcp_server/lib/search/vector-index-schema.ts`  
UNDOCUMENTED_CAPABILITIES: The module also exposes stats, full cache clear, content hashing, and age-based eviction helpers.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `embedding-cache.ts` uses SHA-256 content hashes, `INSERT OR REPLACE`, `last_used_at` LRU trimming, and exports `getCacheStats()`/`clearCache()`.

---
FEATURE: 07-double-intent-weighting-investigation.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The architecture summary is directionally right, but “No code change needed” is misleading for current reality because the present fix is structural: Stage 2 now explicitly gates intent weighting to non-hybrid flows.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `shared/algorithms/adaptive-fusion.ts`; `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/lib/search/pipeline/stage2-fusion.ts`  
UNDOCUMENTED_CAPABILITIES: Stage 2 also synchronizes `intentAdjustedScore` back from later score mutations so downstream ranking sees post-signal changes.  
SEVERITY: P1 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: `stage2-fusion.ts` applies intent weights only under `if (!isHybrid && config.intentWeights)`; `adaptive-fusion.ts` still owns `INTENT_WEIGHT_PROFILES`.

---
FEATURE: 08-rrf-k-value-sensitivity-analysis.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The code does run the K-grid analysis, but it does not itself identify or document an “optimal K”; it reports metrics against the `K=60` baseline ranking.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/tests/score-normalization.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The analysis is pure and DB-free; it also reports `avgScore` and `totalItems` across tested K values.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `k-value-analysis.ts` fixes `K_VALUES = [20,40,60,80,100]`, `BASELINE_K = 60`, and computes `kendallTau`, `mrr5`, and `avgScore`.

---
FEATURE: 09-negative-feedback-confidence-signal.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/checkpoints.ts`; `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/lib/search/search-flags.ts`; `mcp_server/tests/learned-feedback.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: Batch stat loading and persistence helpers (`recordNegativeFeedbackEvent`, `getNegativeFeedbackStats`) are central to the feature.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `negative-feedback.ts` defines `RECOVERY_HALF_LIFE_MS`, writes `negative_feedback_events`, and `stage2-fusion.ts` applies `applyNegativeFeedback(...)` when the flag is enabled.

---
FEATURE: 10-auto-promotion-on-validation.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: Thresholds and audit logging are correct, but the effective promotion count is positive validations, not raw `validation_count`; negative feedback events are subtracted first.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/checkpoints.ts`; `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts`; `mcp_server/lib/scoring/negative-feedback.ts`  
UNDOCUMENTED_CAPABILITIES: The module supports read-only eligibility scans via `scanForPromotions()`.  
SEVERITY: P2 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `auto-promotion.ts` computes `positiveValidationCount = totalValidationCount - negativeValidationCount`; `checkpoints.ts` returns `autoPromotion` metadata in `memory_validate`.

---
FEATURE: 11-scoring-and-ranking-corrections.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/causal-boost.ts`; `mcp_server/lib/eval/ablation-framework.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: `composite-scoring.ts` clamps final scores and removes citation fallback; `causal-boost.ts` uses `UNION`; `ablation-framework.ts` uses `logBinomial(...)`.

---
FEATURE: 12-stage-3-effectivescore-fallback-chain.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: The narrative is right, but the source table is badly scoped and misses the paired Stage 2 implementation that now shares the fallback logic.  
PATHS_VALID: NO | INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`; `mcp_server/tests/stage2-fusion.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: The canonical fallback is now centralized in `resolveEffectiveScore()` and reused across stages.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `pipeline/types.ts` defines `resolveEffectiveScore()` as `intentAdjustedScore -> rrfScore -> score -> similarity/100`; `stage3-rerank.ts` aliases `const effectiveScore = resolveEffectiveScore`.

---
FEATURE: 13-scoring-and-fusion-corrections.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: ACCURATE  
DESCRIPTION_ISSUES: NONE  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/intent-classifier.ts`; `mcp_server/lib/scoring/composite-scoring.ts`; `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/lib/scoring/interference-scoring.ts`; `mcp_server/lib/search/pipeline/types.ts`; `mcp_server/lib/search/pipeline/stage2-fusion.ts`  
UNDOCUMENTED_CAPABILITIES: NONE  
SEVERITY: P2 | RECOMMENDED_ACTION: UPDATE_PATHS  
EVIDENCE: The listed fixes span intent weighting, composite normalization, BM25 spec-folder filtering, shared score resolution, and post-signal score sync, but the table only cites `mpab-aggregation.ts`, `rsf-fusion.ts`, and `rrf-fusion.ts`.

---
FEATURE: 14-local-gguf-reranker-via-node-llama-cpp.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The memory thresholds are wrong: code requires `8GB total` by default and `2GB total` with a custom model, not “4GB free / 512MB”. Fallback is original ordering, not specifically “RRF scoring”.  
PATHS_VALID: NO | INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`  
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage3-rerank.ts`; `mcp_server/lib/search/hybrid-search.ts`; `mcp_server/tests/reranker-eval-comparison.vitest.ts`  
UNDOCUMENTED_CAPABILITIES: Timeout control, prompt-byte truncation, dynamic score-method resolution, and a hard cap of 50 rerank candidates.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `local-reranker.ts` sets `MIN_TOTAL_MEMORY_BYTES = 8 * 1024 * 1024 * 1024`, `MIN_TOTAL_MEMORY_CUSTOM_BYTES = 2 * 1024 * 1024 * 1024`, `MAX_RERANK_CANDIDATES = 50`.

---
FEATURE: 15-tool-level-ttl-cache.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The cache implementation is correct, but the doc overstates read-path integration: only `memory_search` actually uses `withCache`; save/delete flows mostly invalidate cached search results through mutation hooks.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`; `mcp_server/context-server.ts`; `mcp_server/handlers/chunking-orchestrator.ts`  
UNDOCUMENTED_CAPABILITIES: The cache supports `bypassCache`, regex invalidation, explicit startup/shutdown, and deterministic arg canonicalization that drops `undefined` keys.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `tool-cache.ts` defines TTL/max-entry cleanup and SHA-256 keys; `memory-search.ts` calls `toolCache.withCache(...)`; mutation hooks call `invalidateOnWrite(...)`.

---
FEATURE: 16-access-driven-popularity-scoring.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: PARTIAL  
DESCRIPTION_ISSUES: The batching model is correct, but `getAccessStats()` does not exist in the access tracker implementation.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/lib/search/vector-index-queries.ts`  
UNDOCUMENTED_CAPABILITIES: The tracker also computes `calculateUsageBoost()`, flushes on shutdown, and the broader system exposes usage stats via `get_usage_stats()` in query code.  
SEVERITY: P1 | RECOMMENDED_ACTION: BOTH  
EVIDENCE: `access-tracker.ts` exports `trackAccess`, `trackMultipleAccesses`, `calculatePopularityScore`, `calculateUsageBoost`, and shutdown flush helpers; there is no `getAccessStats()` export.

---
FEATURE: 17-temporal-structural-coherence-scoring.md  
CATEGORY: 11--scoring-and-calibration  
DESCRIPTION_ACCURACY: INACCURATE  
DESCRIPTION_ISSUES: The code does not do temporal/relational coherence analysis. `scoreCoherence()` only checks non-empty content, length thresholds, Markdown headings, and “substantial content”; there is no future-event/reference consistency logic.  
PATHS_VALID: YES | INVALID_PATHS: NONE  
MISSING_PATHS: `mcp_server/handlers/memory-save.ts`  
UNDOCUMENTED_CAPABILITIES: The quality loop auto-fixes trigger phrases, closes broken anchors, trims oversized content, retries scoring, and can reject saves after max retries.  
SEVERITY: P0 | RECOMMENDED_ACTION: REWRITE  
EVIDENCE: `quality-loop.ts` awards coherence via four simple structural checks and never inspects chronology, causal links, or predecessor existence.
b/eval/data/ground-truth.json`
UNDOCUMENTED_CAPABILITIES: The loader supports transactional replace behavior, annotator metadata, and duplicate/uniqueness guards during generation/import.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [ground-truth-generator.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts) generates and loads the corpus; [ground-truth-data.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts) defines 110 queries.

---
FEATURE: 07-bm25-only-baseline
CATEGORY: 09--evaluation-and-measurement
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The fixed benchmark claim (`MRR@5 = 0.2083`) is not encoded in source; the code implements the evaluation framework, not that exact frozen result.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/bm25-index.ts`
UNDOCUMENTED_CAPABILITIES: The baseline module also computes contingency decisions, relative contingency vs. hybrid, bootstrap confidence intervals, and eval DB metric snapshots.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [bm25-baseline.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts) includes contingency and bootstrap logic; the `ENABLE_BM25` runtime flag lives in `bm25-index.ts`, not the feature file.

---
FEATURE: 08-agent-consumption-instrumentation
CATEGORY: 09--evaluation-and-measurement
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`, `mcp_server/handlers/memory-context.ts`, `mcp_server/handlers/memory-triggers.ts`
UNDOCUMENTED_CAPABILITIES: Even though runtime logging is disabled, the module still exposes table-init, stats, and pattern-analysis helpers.
SEVERITY: P2
RECOMMENDED_ACTION: BOTH
EVIDENCE: [consumption-logger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts) hard-disables runtime logging via `isConsumptionLogEnabled()` while keeping storage/stat helpers.

---
FEATURE: 09-scoring-observability
CATEGORY: 09--evaluation-and-measurement
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: Novelty removal is not implemented in the observability module itself; the hardcoded novelty telemetry values come from composite scoring. Failures are logged with `console.error`, not silently swallowed.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/scoring/composite-scoring.ts`
UNDOCUMENTED_CAPABILITIES: The module includes DB init, aggregate stats, and reset helpers in addition to sampled inserts.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [scoring-observability.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts) handles sampling/storage, while [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts) hardcodes `noveltyBoostApplied: false`.

---
FEATURE: 10-full-reporting-and-ablation-study-framework
CATEGORY: 09--evaluation-and-measurement
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/eval-reporting.ts`, `mcp_server/tool-schemas.ts`, `mcp_server/schemas/tool-input-schemas.ts`
UNDOCUMENTED_CAPABILITIES: Reporting supports both text and JSON outputs, per-channel failure tolerance, and dashboard row limits via `SPECKIT_DASHBOARD_LIMIT`.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [reporting-dashboard.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts) formats dashboard output, and [ablation-framework.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts) runs the ablation/sign-test workflow.

---
FEATURE: 11-shadow-scoring-and-channel-attribution
CATEGORY: 09--evaluation-and-measurement
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The doc references `isShadowScoringEnabled()` and hot-path removal details that do not exist in current source. Shadow writes are simply disabled, and related feedback/LLM-label plumbing lives in separate modules not listed here.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/eval/ground-truth-feedback.ts`, `mcp_server/lib/search/learned-feedback.ts`
UNDOCUMENTED_CAPABILITIES: Channel attribution also reports coverage, unattributed counts, and single-vs-multi-channel distributions; shadow comparison helpers still compute comparison stats even though writes are off.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [shadow-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts) returns `null` from `runShadowScoring()` and `false` from `logShadowComparison()`; feedback capture lives in `ground-truth-feedback.ts`.

---
FEATURE: 12-test-quality-improvements
CATEGORY: 09--evaluation-and-measurement
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: “No dedicated source files” is false. The fixes called out in the description are implemented in concrete test and parser files.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/tests/memory-save-extended.vitest.ts`, `mcp_server/tests/entity-linker.vitest.ts`, `mcp_server/tests/integration-search-pipeline.vitest.ts`, `mcp_server/lib/parsing/memory-parser.ts`
UNDOCUMENTED_CAPABILITIES: The changes include timeout increases, environment-gated skips, DB cleanup hardening, and archive-folder parsing guards.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [memory-save-extended.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts) contains the timeout/skip changes directly, so this is not a “no source files” feature.

---
FEATURE: 13-evaluation-and-housekeeping-fixes
CATEGORY: 09--evaluation-and-measurement
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/tools/types.ts`, `mcp_server/handlers/session-learning.ts`, `mcp_server/lib/session/session-manager.ts`, `mcp_server/lib/storage/access-tracker.ts`
UNDOCUMENTED_CAPABILITIES: The bundle also includes listener cleanup and postflight phase handling beyond the eval-specific fixes.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [tools/types.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts) contains the `parseArgs<T>()` hardening, and [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts) contains the 128-bit dedup hash logic.

---
FEATURE: 14-cross-ai-validation-fixes
CATEGORY: 09--evaluation-and-measurement
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: “No dedicated source files” is false. The fixes are real, but they land in many concrete handler/lib/test files.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/tests/memory-save-extended.vitest.ts`, `mcp_server/handlers/memory-crud-delete.ts`, `mcp_server/handlers/save/dedup.ts`, `mcp_server/lib/session/session-manager.ts`, `mcp_server/lib/eval/reporting-dashboard.ts`, `shared/config.ts`
UNDOCUMENTED_CAPABILITIES: The remediation set also includes env-var fallback compatibility, transaction hardening, delete propagation, and stage-2 numeric guards.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [shared/config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/config.ts) already contains the `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR` fallback, showing this feature has dedicated implementation files.

---
FEATURE: 01-typed-weighted-degree-channel
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/search-flags.ts`, `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/storage/causal-edges.ts`
UNDOCUMENTED_CAPABILITIES: The channel caches weighted-degree scores and clears related caches when causal-edge mutations occur.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [graph-search-fn.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts) implements the weighted degree logic; enablement/integration live in `search-flags.ts` and `hybrid-search.ts`.

---
FEATURE: 02-co-activation-boost-strength-increase
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The code sets a default strength of `0.25` with env override support; it does not document a measured `0.25-0.3x` operating range or any dark-run experiment in source.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: The module also has a TTL cache, `maxRelated`/`maxHops` controls, and causal-neighbor expansion behavior.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [co-activation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts) defines `strength: 0.25` and related cache/traversal settings.

---
FEATURE: 03-edge-density-measurement
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/entity-linker.ts`
UNDOCUMENTED_CAPABILITIES: The implementation also classifies density bands (`dense`, `moderate`, `sparse`) and returns a formatted density report with escalation guidance.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [edge-density.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts) computes density/reporting, while `entity-linker.ts` consumes density at runtime.

---
FEATURE: 04-weight-history-audit-tracking
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: The same module also exposes rollback support, orphan cleanup, edge-access timestamps, stale-edge queries, and graph stats helpers.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts) handles weight-history metadata plus rollback/staleness helpers.

---
FEATURE: 05-graph-momentum-scoring
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`, `mcp_server/lib/search/search-flags.ts`
UNDOCUMENTED_CAPABILITIES: The cache is bounded to 10,000 entries and `clearGraphSignalsCache()` clears both momentum and depth caches together.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts) implements momentum scoring and cache management; Stage 2 wiring is elsewhere.

---
FEATURE: 06-causal-depth-signal
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`, `mcp_server/lib/search/search-flags.ts`
UNDOCUMENTED_CAPABILITIES: Depth is computed with a multi-source BFS, a large traversal ceiling, and batched cache fills for uncached IDs.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [graph-signals.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts) contains the depth traversal/caching logic; Stage 2 integration is outside the listed files.

---
FEATURE: 07-community-detection
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`, `mcp_server/lib/search/search-flags.ts`
UNDOCUMENTED_CAPABILITIES: The implementation cleans stale assignments, marks injected rows with `_communityBoosted`, and exposes debounce-reset behavior.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [community-detection.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts) stores/injects community results; Stage 2 wiring is not listed.

---
FEATURE: 08-graph-and-cognitive-memory-fixes
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The cache-clear fix is attributed to the wrong place: the live hook is `handlers/mutation-hooks.ts`, not `memory-bulk-delete.ts`. Several other implementing files are also omitted.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/mutation-hooks.ts`, `mcp_server/handlers/causal-graph.ts`, `mcp_server/lib/cognitive/working-memory.ts`
UNDOCUMENTED_CAPABILITIES: The fix set spans graph self-loop prevention, max-depth clamping, orphan cleanup, working-memory bounds, and trigger decay guards across multiple modules.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [mutation-hooks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts) performs the cache invalidation the doc currently attributes elsewhere.

---
FEATURE: 09-anchor-tags-as-graph-nodes
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The “graph nodes” part is deferred, but the description omits that the listed source files already ship anchor-aware chunking and anchor metadata enrichment today.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Large-file chunking can split on ANCHOR boundaries, and Stage 2 can annotate rows with `anchorMetadata` without changing scores.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [anchor-chunker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts) already chunks by ANCHOR tags; [anchor-metadata.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts) enriches pipeline rows.

---
FEATURE: 10-causal-neighbor-boost-and-injection
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The relation examples are wrong. Current code weights `supersedes`, `contradicts`, `caused`, `enabled`, `derived_from`, and `supports`, not `leads_to` or `relates_to`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/search-flags.ts`
UNDOCUMENTED_CAPABILITIES: Missing neighbors are injected with a base score derived from the current lowest score, and metadata reports boosted count, injected count, max boost, and traversal depth.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [causal-boost.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts) defines the relation-weight multipliers and neighbor injection metadata.

---
FEATURE: 11-temporal-contiguity-layer
CATEGORY: 10--graph-signal-activation
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The exported APIs are `getTemporalNeighbors` and `buildTimeline`, not `queryTemporalNeighbors` or `buildSpecFolderTimeline`. The boost entry point is `vectorSearchWithContiguity()`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: The code caps cumulative boost per result at `0.5` and can build either a global timeline or a spec-folder-filtered one.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [temporal-contiguity.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts) exports `vectorSearchWithContiguity`, `getTemporalNeighbors`, and `buildTimeline`.

---
FEATURE: 01-score-normalization
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The narrative is broadly right, but the feature file misses the primary RRF normalization implementation and does not mention default-on behavior or non-finite-score guarding.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `shared/algorithms/rrf-fusion.ts`
UNDOCUMENTED_CAPABILITIES: RRF normalization mutates fused scores in place, maps equal-score batches to `1.0`, and converts invalid RRF scores to `0`.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [rrf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts) implements `isScoreNormalizationEnabled()` and `normalizeRrfScores()`; it is the missing primary source path.

---
FEATURE: 02-cold-start-novelty-boost
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The first two paragraphs describe an active exponential boost, but current code permanently disables novelty boosting. `calculateNoveltyBoost()` always returns `0`; only compatibility constants remain.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Scoring telemetry is hardcoded to `noveltyBoostApplied: false` and `noveltyBoostValue: 0` for schema compatibility.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts) marks novelty constants deprecated and returns `0` from `calculateNoveltyBoost()`.

---
FEATURE: 03-interference-scoring
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The core scoring description is right, but the source table omits the persistence and refresh paths that make this a live feature instead of a standalone helper.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/scoring/composite-scoring.ts`, `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/lib/search/vector-index-mutations.ts`, `mcp_server/lib/search/vector-index-schema.ts`
UNDOCUMENTED_CAPABILITIES: Interference scores are stored in `memory_index.interference_score`, refreshed on mutations, and batch computation now accepts an optional threshold override.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [interference-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts) defines the heuristic, while `vector-index-store.ts` and `vector-index-mutations.ts` persist and refresh it.

---
FEATURE: 04-classification-based-decay
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The doc says it “runs behind” `SPECKIT_CLASSIFICATION_DECAY`, but the implementation is graduated-on by default and only disables when the env var is explicitly `false` or `0`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: Unknown context/tier values fall back to `1.0`, and the module keeps a separate elapsed-time `TIER_MULTIPLIER` system distinct from classification decay.
SEVERITY: P2
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts) shows `applyClassificationDecay()` defaulting on unless the flag is explicitly disabled.

---
FEATURE: 05-folder-level-relevance-scoring
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: `mcp_server/lib/scoring/folder-scoring.ts` is only a barrel re-export, not the implementation. The runtime two-phase retrieval behavior described in the text is actually wired in `hybrid-search.ts`.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`
UNDOCUMENTED_CAPABILITIES: Search results can be enriched with `folderScore`, `folderRank`, and `specFolder` metadata after folder ranking is applied.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [folder-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts) is only `export *`; [folder-relevance.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts) and `hybrid-search.ts` carry the real behavior.

---
FEATURE: 06-embedding-cache
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The qualitative performance claims (“microseconds”, “most expensive operation”) are not evidenced in source. The implementation defines cache behavior, not measured latency/cost results.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/save/embedding-pipeline.ts`, `mcp_server/handlers/chunking-orchestrator.ts`, `mcp_server/lib/search/vector-index-schema.ts`, `mcp_server/lib/providers/retry-manager.ts`
UNDOCUMENTED_CAPABILITIES: The cache also supports age-based eviction, stats/clear operations, chunk-embedding reuse, and retry-manager reuse.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [embedding-cache.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts) defines the table and LRU behavior; actual use sites are in save/chunk/retry paths not listed here.

---
FEATURE: 07-double-intent-weighting-investigation
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The doc says “No code change needed,” but current code contains explicit structural guards in the 4-stage pipeline and an additional sync pass so later score mutations are not lost. It also omits the actual adaptive-fusion source path.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `shared/algorithms/adaptive-fusion.ts`, `mcp_server/lib/search/hybrid-search.ts`, `mcp_server/lib/search/pipeline/stage2-fusion.ts`
UNDOCUMENTED_CAPABILITIES: After post-fusion signals run, `intentAdjustedScore` is synchronized with `score` via `Math.max(...)` so final ranking reflects later boosts/demotions.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts) applies intent weights only when `!isHybrid` and then syncs `intentAdjustedScore` after later score mutations.

---
FEATURE: 08-rrf-k-value-sensitivity-analysis
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The code analyzes supplied ranked lists but does not “identify and document the optimal K.” It reports metrics; choosing an optimum is left to callers. `_queryCount` is also unused.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/tests/score-normalization.vitest.ts`
UNDOCUMENTED_CAPABILITIES: The analysis also returns `avgScore` and `totalItems` for the run, not just `MRR@5` and Kendall tau.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [k-value-analysis.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts) returns a metrics object keyed by tested K values; it does not select a winner.

---
FEATURE: 09-negative-feedback-confidence-signal
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`, `mcp_server/handlers/checkpoints.ts`
UNDOCUMENTED_CAPABILITIES: Negative feedback stats are batch-loaded for Stage 2, and the same table is reused when computing promotion eligibility/positive-validation counts.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [negative-feedback.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts) defines the multiplier/persistence; Stage 2 application and `memory_validate` writes happen in other files.

---
FEATURE: 10-auto-promotion-on-validation
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/checkpoints.ts`, `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts`, `mcp_server/tests/learned-feedback.vitest.ts`
UNDOCUMENTED_CAPABILITIES: Eligibility uses positive validations after subtracting negatives, and the module also exposes `scanForPromotions()` for read-only discovery.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [auto-promotion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts) defines thresholds/audit logging; [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts) adds `autoPromotion` to `memory_validate`.

---
FEATURE: 11-scoring-and-ranking-corrections
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: ACCURATE
DESCRIPTION_ISSUES: NONE
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/causal-boost.ts`, `mcp_server/lib/eval/ablation-framework.ts`
UNDOCUMENTED_CAPABILITIES: NONE
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_PATHS
EVIDENCE: [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts) contains C1/C2, while C3/C4 live in `causal-boost.ts` and `ablation-framework.ts`, which are not listed.

---
FEATURE: 12-stage-3-effectivescore-fallback-chain
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The current code no longer has a local `effectiveScore()` in Stage 3; the shared helper is `resolveEffectiveScore()` in `pipeline/types.ts`. The doc is partly historical.
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage2-fusion.ts`
UNDOCUMENTED_CAPABILITIES: `types.ts` also defines Stage 4 read-only score contracts and score-snapshot helpers, and Stage 3 preserves `stage2Score` before overwriting `score`.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [types.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts) exports `resolveEffectiveScore()` and `stage2Score`; [stage3-rerank.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts) aliases that shared helper.

---
FEATURE: 13-scoring-and-fusion-corrections
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The doc says adaptive-fusion normalization is only applied when doc-type adjustments shift the balance, but current code normalizes core weights whenever they do not sum to 1.0. The BM25 spec-folder fix also lives in `hybrid-search.ts`, which is not listed.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/lib/search/hybrid-search.ts`, `shared/algorithms/adaptive-fusion.ts`, `mcp_server/lib/search/pipeline/stage2-fusion.ts`, `mcp_server/lib/scoring/interference-scoring.ts`, `mcp_server/lib/search/pipeline/types.ts`
UNDOCUMENTED_CAPABILITIES: The final fix set includes a post-signal `intentAdjustedScore` synchronization pass so later routing/feedback changes are reflected in ranking.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [adaptive-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts) normalizes core weights unconditionally when needed; [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts) contains the sync pass.

---
FEATURE: 14-local-gguf-reranker-via-node-llama-cpp
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The memory thresholds are wrong: current code requires 8GB total RAM by default and 2GB with a custom model, not 4GB free / 512MB. The module also caps rerank candidates at 50 and uses a 30s timeout by default.
PATHS_VALID: NO
INVALID_PATHS: `mcp_server/tests/retry.vitest.ts`
MISSING_PATHS: `mcp_server/lib/search/pipeline/stage3-rerank.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/search/hybrid-search.ts`
UNDOCUMENTED_CAPABILITIES: The implementation caches the loaded model/promise, truncates prompts to 10KB on UTF-8 boundaries, and disposes the model on shutdown.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [local-reranker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts) defines `MIN_TOTAL_MEMORY_BYTES = 8GB`, `MIN_TOTAL_MEMORY_CUSTOM_BYTES = 2GB`, and `MAX_RERANK_CANDIDATES = 50`.

---
FEATURE: 15-tool-level-ttl-cache
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: PARTIAL
DESCRIPTION_ISSUES: The cache is not used for embedding generation. Runtime cache reads are in `memory_search`; mutation flows mainly invalidate cache entries after writes.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/memory-search.ts`, `mcp_server/handlers/chunking-orchestrator.ts`, `mcp_server/context-server.ts`
UNDOCUMENTED_CAPABILITIES: The module supports `bypassCache`, regex/pattern invalidation, auto-started cleanup, and explicit shutdown that clears cache/state.
SEVERITY: P1
RECOMMENDED_ACTION: BOTH
EVIDENCE: [tool-cache.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts) implements `withCache`, `bypassCache`, `invalidateByPattern`, and cleanup/shutdown; `memory-search.ts` is the live read path.

---
FEATURE: 16-access-driven-popularity-scoring
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: The DB column is `last_accessed`, not `last_access_at`, and the module does not expose `getAccessStats()`. The rest of the batching/popularity description is broadly correct.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: NONE
UNDOCUMENTED_CAPABILITIES: The tracker also exposes `calculateUsageBoost()`, periodic flush/reset behavior, and shutdown-safe flush/handler cleanup.
SEVERITY: P1
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
EVIDENCE: [access-tracker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts) updates `last_accessed` and exports `calculatePopularityScore`/`calculateUsageBoost`, but no `getAccessStats()`.

---
FEATURE: 17-temporal-structural-coherence-scoring
CATEGORY: 11--scoring-and-calibration
DESCRIPTION_ACCURACY: INACCURATE
DESCRIPTION_ISSUES: `scoreCoherence()` does not evaluate chronology, future references, predecessor validity, spec-folder linkage, or causal consistency. It only checks non-empty content, minimum length, presence of headings, and content substance. The anchor component is format-pairing, not anchor density.
PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_PATHS: `mcp_server/handlers/memory-save.ts`
UNDOCUMENTED_CAPABILITIES: The real quality loop also supports auto-fix passes, threshold/retry configuration, and eval-metric logging.
SEVERITY: P1
RECOMMENDED_ACTION: REWRITE
EVIDENCE: [quality-loop.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts) defines `scoreCoherence()` as a structural heuristic only; [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts) is the actual save-path integration.
