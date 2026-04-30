---
title: "Skills Library"
description: "Canonical index of all skills in .opencode/skill/ with routing guidance, structure reference, and skill creation workflow."
trigger_phrases:
  - "skills library"
  - "available skills"
  - "skill overview"
  - "what skills exist"
  - "skill routing"
  - "skill advisor"
  - "available scripts"
  - "skill catalog"
  - "which skill should I use"
---

# Skills Library

> The complete inventory of on-demand AI capabilities available in this framework.

Across this skill tree, `/spec_kit:resume` is the canonical recovery surface for Spec Kit packet work. Continuity still rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts remain supporting only.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. FEATURES](#3--features)
- [4. STRUCTURE](#4--structure)
- [5. CONFIGURATION](#5--configuration)
- [6. USAGE EXAMPLES](#6--usage-examples)
- [7. TROUBLESHOOTING](#7--troubleshooting)
- [8. FAQ](#8--faq)
- [9. RELATED DOCUMENTS](#9--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`.opencode/skill/` holds 21 skill folders. Skills are not passive references. Each skill contains executable guidance that an AI agent loads on demand through Gate 2 routing or explicit invocation. Skills carry their own references, assets, scripts, and graph metadata so domain knowledge stays close to the code that uses it.

Skills divide into five categories: CLI orchestrators that delegate work to external AI binaries, MCP integrations that wrap third-party tools, code quality overlays that cover different stack contexts, documentation and improvement-loop utilities, and the system-spec-kit foundation that governs every file modification. The primary routing engine is now the native TypeScript Skill Advisor package at `system-spec-kit/mcp_server/skill_advisor/`, exposed through `advisor_recommend`, `advisor_status`, and `advisor_validate`. The Python `system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` entrypoint remains as a compatibility shim with native-first delegation and local fallback.

Adding a skill is intentional. Every new skill goes through `sk-doc`'s scaffolding workflow, gets a SKILL.md with proper frontmatter, and is discovered by the native advisor through graph metadata indexing. The Python shim can still discover it directly when fallback mode is active.

### Key Statistics

| Metric | Value | Notes |
| --- | --- | --- |
| Total skill folders | 18 | Top-level skills under `.opencode/skill/` |
| Folders with graph metadata | 18 | Every top-level skill folder under `.opencode/skill/` currently ships with `graph-metadata.json` |
| Graph families | 6 | `cli`, `mcp`, `sk-code`, `sk-deep`, `sk-util`, `system` |
| CLI orchestrator skills | 5 | cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode |
| MCP integration skills | 4 | mcp-chrome-devtools, mcp-coco-index, mcp-code-mode, mcp-figma |
| Code quality overlays | 3 | sk-code, sk-code-opencode, sk-code-review |
| Documentation, research, review, and improvement skills | 5 | sk-improve-agent, sk-deep-research, sk-deep-review, sk-doc, sk-improve-prompt |
| Git and system skills | 2 | sk-git, system-spec-kit |
| Skills with local scripts/ | 12 | See Section 4 for the current script-bearing folders |
| Native advisor tools | 3 | `advisor_recommend`, `advisor_status`, `advisor_validate` |
| Shared compatibility scripts | 5 | `skill_advisor.py`, runtime, bench, regression, and graph compiler |

### Key Features

| Feature | Description |
| --- | --- |
| Gate 2 routing | Native `advisor_recommend` scores requests with 5-lane fusion and returns prompt-safe recommendations |
| Advisor health and validation | `advisor_status` reports freshness, `skillCount`, `lastScanAt`, and lane weights; `advisor_validate` returns measured corpus, holdout, parity, safety, and latency slices |
| Graph metadata system | Per-folder `graph-metadata.json` feeds the SQLite skill graph, with `system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` kept for export and fallback workflows |
| On-demand loading | Skills load only when needed so context stays focused |
| Self-contained skills | References, assets, and scripts live inside each skill folder |
| Auto-discovery | New skills are found through graph metadata and SKILL.md discovery |
| Dual-threshold filtering | Confidence and uncertainty both gate routing to reduce false positives |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

Three ways to use this library:

**1. Route with Gate 2**

Use the native advisor before any non-trivial task when MCP is available. Use the Python shim when a runtime needs the legacy JSON-array contract.

```text
advisor_recommend({"prompt":"rewrite README for skill library","options":{"topK":1}})
```

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "rewrite README for skill library" --threshold 0.8
```

**2. Open a skill directly**

Read the SKILL.md for any skill to load its instructions into context.

```bash
# Read the first 120 lines (covers overview and routing sections)
sed -n '1,120p' .opencode/skill/sk-doc/SKILL.md
```

**3. Run skill-local scripts**

Many skills ship their own scripts. Reference them by the skill's path.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py README.md
python3 .opencode/skill/sk-doc/scripts/extract_structure.py README.md --json
```

Loading sequence:

```text
Request -> advisor_recommend -> top match + confidence -> load SKILL.md -> follow instructions
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The skill system covers four distinct workflow domains.

**CLI Delegation.** The five CLI skills (cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode) let any AI assistant hand off work to an external AI binary. Each skill specifies the right binary flags, model selection, prompt formatting, and output parsing. This enables parallel execution and cross-AI validation without the calling AI needing to know binary internals.

**MCP Tool Wrapping.** The five MCP skills route tool calls through Code Mode for token-efficient execution. mcp-code-mode is the hub: it handles ClickUp, Figma, Webflow, Notion, and Chrome DevTools through a single TypeScript execution layer. mcp-coco-index adds semantic code search via vector embeddings for finding relevant implementations by concept rather than exact keyword.

**Code Quality Overlays.** The four sk-code- skills form a layered review contract. sk-code-review provides a findings-first baseline. The three implementation overlays (opencode, web, full-stack) add stack-specific standards on top. They share terminology so switching overlays during a task requires no mental context switch.

**System Foundation.** system-spec-kit governs all file modifications through spec folder workflows (Levels 1-3+), template validation, and Spec Kit Memory for context preservation across sessions. It includes a hook system for automated context preservation at Claude Code lifecycle boundaries (PreCompact, SessionStart, Stop), a structural code graph with 4 MCP tools (code_graph_scan/query/status/context), and a CocoIndex bridge for semantic-to-structural expansion. It is the only skill that is mandatory for every task involving file changes.

### 3.2 FEATURE REFERENCE

**CLI Orchestrator Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `cli-claude-code` | 1.1.1 | Invokes Claude Code CLI for deep reasoning, code editing, structured output, and agent delegation |
| `cli-codex` | 1.3.1 | Invokes OpenAI Codex CLI for code generation, review, web research, and parallel task processing |
| `cli-copilot` | 1.3.1 | Invokes GitHub Copilot CLI for collaborative planning, cloud delegation, and autonomous execution |
| `cli-gemini` | 1.2.1 | Invokes Google Gemini CLI for code generation, Google Search grounding, and architecture analysis |
| `cli-opencode` | 1.0.0 | Invokes OpenCode CLI for full plugin/skill/MCP runtime dispatch, parallel detached sessions, and cross-AI orchestration |

**MCP Integration Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `mcp-chrome-devtools` | 1.0.7.0 | Browser debugging via CLI (bdg) with MCP fallback for multi-tool integration |
| `mcp-coco-index` | 1.0.0 | Semantic code search via vector embeddings using natural-language queries |
| `mcp-code-mode` | 1.0.7.0 | TypeScript-based MCP orchestration hub for all external tool calls |
| `mcp-figma` | 1.0.7.0 | Figma design file access: file retrieval, image export, component and style extraction |

**Code Quality Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `sk-code` | 1.0.1.0 | Smart-routing umbrella for application code (Webflow + React/Next/Node/Go/Swift/RN); Webflow runs full live content, non-Webflow stacks are placeholder stubs |
| `sk-code-opencode` | 1.2.0.0 | Multi-language standards for OpenCode system code (JS, TS, Python, Shell, JSON) |
| `sk-code-review` | 1.2.0.0 | Findings-first code review baseline with security and correctness minimums |

**Documentation, Research, Prompt, and Improvement Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `sk-improve-agent` | 1.0.0.0 | Evaluator-first agent improvement with 5-dimension integration-aware scoring, dynamic profiling, deterministic benchmarks, and guarded promotion |
| `sk-deep-research` | 1.2.0 | Autonomous research loop with iterative investigation, externalized state, and convergence detection |
| `sk-deep-review` | 1.0.0 | Autonomous iterative code review with severity-weighted findings, dimension coverage, convergence detection, and release readiness verdicts |
| `sk-doc` | 1.3.0.0 | Markdown quality enforcement, component templates, validation scripts, and DQI scoring |
| `sk-improve-prompt` | 1.2.0.0 | Prompt engineering using 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) |

**Git and System Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `sk-git` | 1.1.0.0 | Git workflow orchestrator for workspace setup, clean commits, and work completion |
| `system-spec-kit` | 2.2.27.0 | Spec folder workflow, template architecture, validation, and Spec Kit Memory |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
.opencode/skill/
├── cli-claude-code/        # Claude Code CLI orchestrator
├── cli-codex/              # OpenAI Codex CLI orchestrator
├── cli-copilot/            # GitHub Copilot CLI orchestrator
├── cli-gemini/             # Google Gemini CLI orchestrator
├── cli-opencode/           # OpenCode CLI orchestrator
├── mcp-chrome-devtools/    # Browser debugging via MCP
├── mcp-coco-index/         # Semantic code search via vector embeddings
├── mcp-code-mode/          # MCP orchestration hub (TypeScript)
├── mcp-figma/              # Figma design file access via MCP
├── skill-advisor/          # Shared routing package
│   ├── README.md
│   ├── SET-UP_GUIDE.md
│   ├── graph-metadata.json
│   ├── feature_catalog/
│   ├── manual_testing_playbook/
│   └── scripts/            # Python compat shim, graph export compiler, regression, fixtures, out
├── sk-improve-agent/       # Evaluator-first agent improvement loop
├── sk-code/                # Smart-routing umbrella for application code (Webflow live; non-Webflow placeholders)
├── sk-code-opencode/       # OpenCode system code standards
├── sk-code-review/         # Findings-first code review baseline
├── sk-deep-research/       # Autonomous deep research loop
├── sk-deep-review/         # Autonomous iterative code review
├── sk-doc/                 # Documentation quality and templates
├── sk-git/                 # Git workflow orchestrator
├── sk-improve-prompt/      # Prompt engineering specialist
├── system-spec-kit/        # Spec folder and memory foundation
└── README.md               # This file
```

### Recommended Skill Layout

Each skill folder follows this internal structure:

| Path | Purpose |
| --- | --- |
| `SKILL.md` | Required entry point with YAML frontmatter, routing logic, and instructions |
| `graph-metadata.json` | Relationship metadata indexed by the native advisor graph and export compiler |
| `references/` | Focused domain guidance loaded as needed |
| `assets/` | Templates and static support files |
| `scripts/` | Optional automation for checks and generation |

### Skill-Local Script Entry Points

| Skill | Key Scripts |
| --- | --- |
| `mcp-code-mode` | `scripts/update-code-mode.sh`, `scripts/validate_config.py` |
| `sk-doc` | `scripts/init_skill.py`, `scripts/package_skill.py`, `scripts/validate_document.py`, `scripts/extract_structure.py`, `scripts/validate_flowchart.sh` |
| `system-spec-kit` | `scripts/spec/create.sh`, `scripts/spec/validate.sh`, `scripts/memory/generate-context.js`, `scripts/setup/check-prerequisites.sh` |

For the full system-spec-kit script inventory, see `system-spec-kit/scripts/scripts-registry.json`.

### Skill Folder Signals

| Skill | `references/` | `assets/` | `scripts/` |
| --- | --- | --- | --- |
| `cli-claude-code` | Yes | Yes | No |
| `cli-codex` | Yes | Yes | No |
| `cli-copilot` | Yes | Yes | No |
| `cli-gemini` | Yes | Yes | No |
| `cli-opencode` | Yes | Yes | No |
| `mcp-chrome-devtools` | Yes | No | No |
| `mcp-coco-index` | Yes | No | No |
| `mcp-code-mode` | Yes | Yes | Yes |
| `mcp-figma` | Yes | Yes | No |
| `sk-code` | Varies | Varies | Varies |
| `sk-code-opencode` | Varies | Varies | Varies |
| `sk-code-review` | Varies | Varies | Varies |
| `sk-deep-research` | Yes | No | Yes |
| `sk-deep-review` | Yes | No | Yes |
| `sk-doc` | Yes | Yes | Yes |
| `sk-git` | Yes | Yes | No |
| `sk-improve-prompt` | Yes | Yes | No |
| `system-spec-kit` | Yes | Yes | Yes |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Skill Routing Policy

Gate 2 routing runs before any non-trivial task. The native advisor scores the request against discovered skills and returns ranked prompt-safe recommendations.

| Condition | Action |
| --- | --- |
| Confidence `>= 0.8` AND uncertainty `<= 0.35` | Skill invocation is required |
| Confidence `< 0.8` OR uncertainty `> 0.35` | General approach is allowed |

### SKILL.md Frontmatter Format

Every SKILL.md must include a frontmatter block for the advisor to discover and score it:

```yaml
---
name: sk-git
version: 1.1.0.0
description: Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion
trigger_phrases:
  - "commit changes"
  - "git workflow"
  - "create pull request"
---
```

The `name` and `description` fields are required. `trigger_phrases` strengthen routing accuracy.

### Graph metadata indexing

Every folder under `.opencode/skill/` contributes a `graph-metadata.json` file to the shared routing graph. The native runtime reads the SQLite skill graph first. The JSON snapshot remains useful for export and fallback workflows:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py --validate-only
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py
# Writes .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json
```

Native health and validation:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
advisor_validate({"skillSlug":null})
```

### Threshold Defaults

| Flag | Default | Purpose |
| --- | --- | --- |
| `--threshold` | `0.8` | Minimum confidence to pass Gate 2 |
| `--uncertainty` | `0.35` | Maximum uncertainty allowed by default |
| `--confidence-only` | Off | Bypasses uncertainty check when set |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Route a request through Gate 2

```bash
# Documentation task: sk-doc is recommended at high confidence through the shim
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "create a flowchart for the auth flow" --threshold 0.8
```

Native equivalent:

```text
advisor_recommend({"prompt":"create a flowchart for the auth flow","options":{"topK":1}})
```

### Load a skill directly

```bash
# Load the full sk-doc skill into context
cat .opencode/skill/sk-doc/SKILL.md
```

### Validate a document with sk-doc scripts

```bash
# Run format validation on a README (exit 0 = valid)
python3 .opencode/skill/sk-doc/scripts/validate_document.py /path/to/README.md

# Score the document and get a DQI report
python3 .opencode/skill/sk-doc/scripts/extract_structure.py /path/to/README.md --json
```

### Create a new skill

```bash
# Scaffold the folder structure
python3 .opencode/skill/sk-doc/scripts/init_skill.py my-skill --path .opencode/skill

# After filling in SKILL.md and references, package and validate
python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/my-skill/
```

### Save context with system-spec-kit

```bash
# Generate canonical packet continuity from structured JSON (never use Write tool directly)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"specs/019-readme","sessionSummary":"Updated skill README"}' \
  specs/019-readme
```

### Run regression and benchmarks for the advisor

```bash
# Regression quality check
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --out .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/out/regression-report.json

# Latency benchmark
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_bench.py \
  --dataset .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 7 \
  --out .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/out/benchmark-report.json
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### Skill advisor returns empty array

**Symptom.** `python3 skill_advisor.py "commit changes"` returns `[]`.

**Cause.** The SKILLS_DIR path resolves incorrectly, no SKILL.md files are found, or the request terms have no match above the threshold.

**Fix.**

```bash
# Verify SKILL.md files are present
ls .opencode/skill/*/SKILL.md

# Check frontmatter is valid
head -10 .opencode/skill/sk-git/SKILL.md

# Lower the threshold temporarily to inspect low-confidence matches
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "commit changes" --threshold 0.5
```

### Wrong skill is recommended

**Symptom.** The advisor returns a skill that does not match the request.

**Cause.** Overly broad description terms in a skill's SKILL.md, or a synonym mapping that pulls unrelated skills into the result set.

**Fix.** Tighten the description in the recommended skill's SKILL.md frontmatter. Add specific `trigger_phrases` and graph metadata intent signals. If the issue appears only in fallback mode, compare native `advisor_recommend` with `skill_advisor.py --force-local`.

### New skill is not discovered

**Symptom.** A newly created skill folder does not appear in advisor output.

**Cause.** Missing or malformed SKILL.md frontmatter. The advisor requires at minimum a `name` and `description` field.

**Fix.**

```bash
# Validate the new skill's frontmatter
head -15 .opencode/skill/my-new-skill/SKILL.md

# Force a discovery refresh (clears the mtime cache)
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "test" --health
```

### Skill scripts fail with import errors

**Symptom.** Running a skill-local script (such as `validate_document.py`) raises `ModuleNotFoundError`.

**Cause.** The script depends on a Python package that is not installed, or it is being run from the wrong directory.

**Fix.**

```bash
# Always run scripts from the project root using the full path
python3 .opencode/skill/sk-doc/scripts/validate_document.py README.md

# Check if required packages are installed
python3 -c "import yaml; print('ok')"
```

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Do I need to register a new skill anywhere after creating it?**

No. Add a valid SKILL.md and graph metadata. The native advisor picks it up through the skill graph watcher or the next scan; the Python shim can also discover it directly in fallback mode.

**Q: Can I use multiple skills in the same task?**

Yes. The advisor returns a ranked list. A task may load a primary skill (for example sk-code-review) and a secondary overlay (for example sk-code-opencode) at the same time. The calling agent manages which sections of each SKILL.md apply to the current step.

**Q: What is the difference between skill-local scripts and the shared scripts/ folder?**

The native routing package lives in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/`. The compatibility scripts live in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/` and handle legacy routing, graph export, benchmarking, and regression testing. Skill-local scripts in a skill's own `scripts/` folder handle domain-specific automation.

**Q: Why does the advisor cap confidence at 0.95?**

The cap preserves a margin of uncertainty so the calling AI retains judgment on edge cases. A 0.95 score means the advisor is highly confident, not certain. Absolute certainty from a heuristic scorer would be misleading.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [Main Framework README](../../README.md) | Root project overview and framework entry point |
| [Skill Advisor README](system-spec-kit/mcp_server/skill_advisor/README.md) | Native advisor overview, MCP quick start, compatibility shim, runtime hooks, and playbook index |
| [Skill Advisor Setup Guide](system-spec-kit/mcp_server/skill_advisor/SET-UP_GUIDE.md) | Native bootstrap pointer, validation commands, rollback controls, and operator states |
| [system-spec-kit SKILL.md](system-spec-kit/SKILL.md) | Spec folder workflow and memory foundation |
| [sk-doc SKILL.md](sk-doc/SKILL.md) | Documentation quality standards and templates |
| [sk-git SKILL.md](sk-git/SKILL.md) | Git workflow orchestration |
| [sk-code-review SKILL.md](sk-code-review/SKILL.md) | Code review baseline |
| [sk-code-opencode SKILL.md](sk-code-opencode/SKILL.md) | OpenCode system code standards |
| [cli-opencode SKILL.md](cli-opencode/SKILL.md) | OpenCode CLI orchestrator for full runtime dispatch and parallel detached sessions |

<!-- /ANCHOR:related-documents -->
