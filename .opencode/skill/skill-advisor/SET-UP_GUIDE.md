---
title: "Skill Advisor Setup Guide"
description: "Setup, graph metadata, validation, and maintenance guide for the skill-advisor routing package."
---

# Skill Advisor Setup Guide

Complete setup and validation guide for the Skill Advisor workflow in `.opencode/skill/skill-advisor/`.

This guide reflects the current runtime:
- prompt-time hook invocation as the primary Gate 2 path
- default dual-threshold routing (`confidence >= 0.8` and `uncertainty <= 0.35`)
- explicit confidence-only override (`--confidence-only`)
- command-bridge separation (`kind: command`)
- cached skill discovery with mtime invalidation
- SQLite-first skill graph loading with JSON fallback
- compiled graph metadata in `scripts/skill-graph.json`
- permanent regression and benchmark tooling

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PREREQUISITES](#2--prerequisites)
- [3. INSTALLATION VALIDATION](#3--installation-validation)
- [4. HOOK INVOCATION AND CLI FALLBACK](#4--hook-invocation-and-cli-fallback)
- [5. GRAPH METADATA SYSTEM](#5--graph-metadata-system)
- [6. QUALITY VERIFICATION](#6--quality-verification)
- [7. FEATURE CATALOG AND MANUAL TESTING PLAYBOOK](#7--feature-catalog-and-manual-testing-playbook)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. OPERATIONAL CHECKLIST](#9--operational-checklist)
- [10. REFERENCE COMMANDS](#10--reference-commands)

---

## 1. OVERVIEW

### What You Are Setting Up

The Skill Advisor package now includes the routing scripts, the per-skill graph metadata surface, the compiled graph artifact, the feature catalog, and the manual testing playbook.

```text
.opencode/skill/skill-advisor/
├── README.md
├── SET-UP_GUIDE.md
├── graph-metadata.json
├── feature_catalog/
│   ├── feature_catalog.md
│   ├── 01--routing-pipeline/
│   ├── 02--graph-system/
│   ├── 03--semantic-search/
│   └── 04--testing/
├── manual_testing_playbook/
│   ├── manual_testing_playbook.md
│   ├── 01--routing-accuracy/
│   ├── 02--graph-boosts/
│   ├── 03--compiler/
│   ├── 04--regression-safety/
│   ├── 05--sqlite-graph/
│   └── 06--hook-routing/
└── scripts/
    ├── check-prompt-quality-card-sync.sh
    ├── skill_advisor.py
    ├── skill_advisor_runtime.py
    ├── skill_advisor_regression.py
    ├── skill_advisor_bench.py
    ├── skill_graph_compiler.py
    ├── skill-graph.json
    ├── fixtures/
    │   └── skill_advisor_regression_cases.jsonl
    └── out/
        ├── regression-report.json
        └── benchmark-report.json
```

### Core Routing Model

- `default mode`: dual-threshold filter (`--threshold` + `--uncertainty`)
- `override mode`: confidence-only filter (`--confidence-only`)
- `skill kinds`: `kind: "skill"` and `kind: "command"`
- `graph overlay`: compiled edge data can reinforce related skills without inventing brand-new winners
- `command bridge behavior`: command bridges are deprioritized unless explicit slash intent is present

### Gate 2 Integration

Primary invocation is hook-based. Register the active runtime using the Phase 020 hook contract, then let the runtime call the compiled `UserPromptSubmit` adapter at prompt time:

```bash
npm run --workspace=@spec-kit/mcp-server build
```

Use [Skill Advisor Hook Reference](../system-spec-kit/references/hooks/skill-advisor-hook.md) for Claude, Gemini, Copilot, and Codex setup snippets.

Direct CLI invocation remains the fallback for diagnostics and scripted checks:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "$USER_REQUEST" --threshold 0.8
```

Interpretation:
- skill returned in default mode -> passed both confidence and uncertainty gates
- empty list in default mode but non-empty list with `--confidence-only` -> high confidence with elevated uncertainty

---

## 2. PREREQUISITES

### Required Software

- Python `3.6+`
- Workspace with `.opencode/skill/*/SKILL.md` entries
- Skill folders with valid `graph-metadata.json` files when graph boosts are expected

### Quick Checks

```bash
python3 --version
ls -la .opencode/skill/skill-advisor/scripts/skill_advisor.py
ls -la .opencode/skill/skill-advisor/graph-metadata.json
```

Optional executable bit:

```bash
chmod +x .opencode/skill/skill-advisor/scripts/skill_advisor.py
```

---

## 3. INSTALLATION VALIDATION

### Step 1: Health Check

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health
```

Expected characteristics:
- valid JSON
- `status: "ok"`
- `skills_found` > 0
- `command_bridges_found` present
- `skill_graph_loaded: true`
- `cache` field present

### Step 2: Smoke Routing

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "create a pull request on github"
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "save this conversation context to memory"
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "/memory:save this context"
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth" --semantic
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "auto review release readiness"
```

Expected behavior:
- natural language prompts prefer `kind: "skill"`
- explicit slash prompts may return `kind: "command"`
- discovery prompts with `--semantic` or `--cocoindex` should favor `mcp-coco-index`
- explicit autonomous review wording should favor `sk-deep-review`

---

## 4. HOOK INVOCATION AND CLI FALLBACK

### Hook Mode

Runtime hooks are the preferred path for ordinary Gate 2 routing. They call `buildSkillAdvisorBrief()` before the turn proceeds, inject a compact `Advisor: ...` brief when a recommendation passes threshold, and fail open with `{}` when the prompt is skipped, disabled, or degraded.

Rollback for prompt-time advice:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
```

Unset the variable to restore hook advice:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
```

### One-Shot Default Mode

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "your prompt"
```

Uses dual-threshold filtering:
- `--threshold` default: `0.8`
- `--uncertainty` default: `0.35`

### CocoIndex Alias Flags

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth" --semantic
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth" --cocoindex
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth" --semantic-hits '[{"path":".opencode/skill/mcp-coco-index/SKILL.md","score":0.9}]'
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth" --cocoindex-hits '[{"path":".opencode/skill/mcp-coco-index/SKILL.md","score":0.9}]'
```

Both flag pairs are aliases. Use either spelling consistently in local workflows.

### Confidence-Only Override

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only
```

Use this only when high-confidence suggestions are needed even when uncertainty stays above the default ceiling.

### Batch Mode

File mode:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --batch-file prompts.txt
```

Stdin mode:

```bash
cat prompts.txt | python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --batch-stdin
```

Batch mode reduces repeated process startup for multi-prompt evaluations.

### Optional Debug And Control Flags

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "prompt" --show-rejections
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-refresh --health
```

---

## 5. GRAPH METADATA SYSTEM

### What The Graph Metadata Does

`graph-metadata.json` is the per-skill source of truth for relationship-aware routing. Each skill folder can declare its own routing identity and typed edges. The compiler scans those files across `.opencode/skill/`, validates the metadata contract, and writes the compact runtime artifact used by the advisor.

### Runtime Flow

```text
.opencode/skill/*/graph-metadata.json
        |
        v
python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py
        |
        v
.opencode/skill/skill-advisor/scripts/skill-graph.json
        |
        v
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health
```

### Key Files

- `.opencode/skill/skill-advisor/graph-metadata.json` defines the advisor skill's own graph edges and derived topics.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` validates every discovered metadata file and builds the compiled graph.
- `.opencode/skill/skill-advisor/scripts/skill-graph.json` is the generated runtime snapshot loaded by the advisor.
- `.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite` is the SQLite graph that the MCP server keeps current.

### Skill Graph Setup

After cloning the repo, the skill graph initializes automatically when the MCP server starts. For manual setup:

```bash
bash .opencode/skill/skill-advisor/scripts/init-skill-graph.sh
```

Use the manual setup when the JSON fallback is missing, when the health check reports `skill_graph_loaded: false`, or when the MCP server is not running yet.

### Adding a New Skill

1. Create `graph-metadata.json` in the new skill folder by copying an existing skill as the starting point.
2. Set `skill_id` so it matches the `name` field in the target `SKILL.md`.
3. Define the graph edges that matter for routing, starting with `depends_on`, `enhances`, and `siblings`.
4. The skill graph watcher auto-indexes the new file within 3 seconds when the MCP server is running.
5. Verify the new skill is visible:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health
```

6. Re-run validation if the watcher is not active or if edge warnings need review:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only
```

### What To Expect From The Compiler

- hard failures for schema or target problems
- soft warnings for symmetry gaps and zero-edge skills
- a refreshed `scripts/skill-graph.json` snapshot when validation passes

---

## 6. QUALITY VERIFICATION

### Verification

- `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health`  
  Expected: `skill_graph_loaded: true`, `skill_graph_source: sqlite`, `skill_graph_skill_count: 21`
- `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only`  
  Expected: `VALIDATION PASSED`

### Compiler Validation

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only
```

Expected result:
- all metadata files discovered
- validation passes with exit code `0`

### Regression Suite

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --out .opencode/skill/skill-advisor/scripts/out/regression-report.json
```

Validates:
- top-1 routing quality gates
- P0 gate pass rate
- command-bridge false-positive rate on non-slash prompts
- full dataset pass rate

### Benchmark Suite

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_bench.py \
  --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 7 \
  --out .opencode/skill/skill-advisor/scripts/out/benchmark-report.json
```

Reports:
- one-shot subprocess latency
- in-process warm latency
- batch throughput multiplier

### Script-Level Alignment

```bash
python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/skill-advisor/scripts
```

Expected: zero `ERROR` findings before claiming completion.

---

## 7. FEATURE CATALOG AND MANUAL TESTING PLAYBOOK

### Feature Catalog

`feature_catalog/feature_catalog.md` is the current-state inventory for the package. It summarizes the routing pipeline, graph system, semantic search, and testing surfaces, then points to the per-feature files in:

- `feature_catalog/01--routing-pipeline/`
- `feature_catalog/02--graph-system/`
- `feature_catalog/03--semantic-search/`
- `feature_catalog/04--testing/`

Use the feature catalog when a new routing surface, graph rule, or validation capability needs to be documented as part of the live package behavior.

### Manual Testing Playbook

`manual_testing_playbook/manual_testing_playbook.md` is the operator-facing validation directory for the package. It owns the scenario matrix, review rules, and release-readiness expectations, with execution details grouped under:

- `manual_testing_playbook/01--routing-accuracy/`
- `manual_testing_playbook/02--graph-boosts/`
- `manual_testing_playbook/03--compiler/`
- `manual_testing_playbook/04--regression-safety/`

Use the playbook when a change affects routing outcomes, graph boosts, compiler behavior, or regression-safety expectations.

### Keeping The Catalog And Playbook In Sync

When a new capability is added:
1. update the relevant feature catalog entry
2. add or update the matching manual testing scenario
3. keep the commands and paths aligned with `.opencode/skill/skill-advisor/scripts/`

---

## 8. TROUBLESHOOTING

### Troubleshooting

- `skill_graph_loaded: false` -> Run `bash .opencode/skill/skill-advisor/scripts/init-skill-graph.sh` or restart the MCP server.
- `skill_graph_source: json` -> SQLite is unavailable, so the MCP server may not be running yet.
- Stale graph -> Modify any `graph-metadata.json` file to trigger the watcher re-index, or run `skill_graph_scan`.

### No Results Returned

Possible causes:
- prompt does not cross the confidence threshold
- prompt crosses confidence but fails the uncertainty gate
- graph metadata was changed but `scripts/skill-graph.json` was not rebuilt

Check:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "your prompt" --show-rejections
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "your prompt" --threshold 0.8 --confidence-only
python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only
```

### Batch Mode Input Errors

Invalid batch combinations are rejected with JSON error payloads and exit code `2`:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --batch-file /tmp/missing.txt
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --batch-file prompts.txt --batch-stdin
```

### Skills Or Graph Data Not Refreshing

Force refresh cached discovery, then rebuild the graph if needed:

```bash
bash .opencode/skill/skill-advisor/scripts/init-skill-graph.sh
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-refresh --health
python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only
```

---

## 9. OPERATIONAL CHECKLIST

- [ ] `--health` returns valid JSON and non-zero `skills_found`
- [ ] `skill_graph_loaded` is `true`
- [ ] default one-shot mode returns expected `kind: "skill"` for natural-language prompts
- [ ] explicit slash prompts can route to `kind: "command"`
- [ ] compiler validation passes
- [ ] regression suite passes
- [ ] benchmark suite passes
- [ ] alignment verifier reports no errors for `.opencode/skill/skill-advisor/scripts`
- [ ] feature catalog and manual testing playbook paths still match the live folder layout

---

## 10. REFERENCE COMMANDS

```bash
# Manual skill graph setup
bash .opencode/skill/skill-advisor/scripts/init-skill-graph.sh

# Health
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health

# One-shot default mode
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "create a pull request on github"

# CocoIndex alias flags
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth" --semantic
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "find code that handles auth" --cocoindex

# Confidence-only override
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only

# Batch file mode
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --batch-file prompts.txt

# Graph validation
python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only

# Graph compile
python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py

# Regression report
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --out .opencode/skill/skill-advisor/scripts/out/regression-report.json

# Benchmark report
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_bench.py \
  --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 7 \
  --out .opencode/skill/skill-advisor/scripts/out/benchmark-report.json

# Alignment verification
python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/skill-advisor/scripts
```
