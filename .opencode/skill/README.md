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

`.opencode/skill/` holds 20 skill folders plus one shared `scripts/` directory. Skills are not passive references. Each skill contains executable guidance that an AI agent loads on demand through Gate 2 routing or explicit invocation. Skills carry their own references, assets, and scripts so all domain knowledge stays close to the code that uses it.

Skills divide into five categories: CLI orchestrators that delegate work to external AI binaries, MCP integrations that wrap third-party tools, code quality overlays that cover different stack contexts, documentation and improvement-loop utilities, and the system-spec-kit foundation that governs every file modification. The routing engine at `scripts/skill_advisor.py` scores each incoming request against all skill descriptions and returns confidence-ranked recommendations.

Adding a skill is intentional. Every new skill goes through `sk-doc`'s scaffolding workflow, gets a SKILL.md with proper frontmatter, and is immediately discoverable by `skill_advisor.py` without any manual registration.

### Key Statistics

| Metric | Value | Notes |
| --- | --- | --- |
| Total skill folders | 20 | Each has a SKILL.md entry point |
| CLI orchestrator skills | 4 | cli-claude-code, cli-codex, cli-copilot, cli-gemini |
| MCP integration skills | 5 | mcp-chrome-devtools, mcp-clickup, mcp-coco-index, mcp-code-mode, mcp-figma |
| Code quality overlays | 4 | sk-code--full-stack, sk-code--opencode, sk-code--review, sk-code--web |
| Documentation, research, review, and improvement skills | 5 | sk-agent-improver, sk-deep-research, sk-deep-review, sk-doc, sk-prompt-improver |
| Git and system skills | 2 | sk-git, system-spec-kit |
| Skills with local scripts/ | 6 | mcp-code-mode, sk-agent-improver, sk-code--, sk-doc, system-spec-kit |
| Shared routing scripts | 4 | skill_advisor.py plus bench, regression, runtime helpers |

### Key Features

| Feature | Description |
| --- | --- |
| Gate 2 routing | `skill_advisor.py` scores requests and returns ranked skill recommendations with confidence |
| On-demand loading | Skills load only when needed so context stays focused |
| Self-contained skills | References, assets, and scripts live inside each skill folder |
| Auto-discovery | New skills are found immediately by the advisor after adding a SKILL.md |
| Dual-threshold filtering | Confidence and uncertainty both gate routing to reduce false positives |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

Three ways to use this library:

**1. Route with Gate 2**

Run the advisor before any non-trivial task. Pass the user's request and a confidence threshold.

```bash
python3 .opencode/skill/scripts/skill_advisor.py "rewrite README for skill library" --threshold 0.8
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
Request -> skill_advisor.py -> top match + confidence -> load SKILL.md -> follow instructions
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The skill system covers four distinct workflow domains.

**CLI Delegation.** The four CLI skills (cli-claude-code, cli-codex, cli-copilot, cli-gemini) let any AI assistant hand off work to an external AI binary. Each skill specifies the right binary flags, model selection, prompt formatting, and output parsing. This enables parallel execution and cross-AI validation without the calling AI needing to know binary internals.

**MCP Tool Wrapping.** The five MCP skills route tool calls through Code Mode for token-efficient execution. mcp-code-mode is the hub: it handles ClickUp, Figma, Webflow, Notion, and Chrome DevTools through a single TypeScript execution layer. mcp-coco-index adds semantic code search via vector embeddings for finding relevant implementations by concept rather than exact keyword.

**Code Quality Overlays.** The four sk-code-- skills form a layered review contract. sk-code--review provides a findings-first baseline. The three implementation overlays (opencode, web, full-stack) add stack-specific standards on top. They share terminology so switching overlays during a task requires no mental context switch.

**System Foundation.** system-spec-kit governs all file modifications through spec folder workflows (Levels 1-3+), template validation, and Spec Kit Memory for context preservation across sessions. It includes a hook system for automated context preservation at Claude Code lifecycle boundaries (PreCompact, SessionStart, Stop), a structural code graph with 4 MCP tools (code_graph_scan/query/status/context), and a CocoIndex bridge for semantic-to-structural expansion. It is the only skill that is mandatory for every task involving file changes.

### 3.2 FEATURE REFERENCE

**CLI Orchestrator Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `cli-claude-code` | 1.1.1 | Invokes Claude Code CLI for deep reasoning, code editing, structured output, and agent delegation |
| `cli-codex` | 1.3.1 | Invokes OpenAI Codex CLI for code generation, review, web research, and parallel task processing |
| `cli-copilot` | 1.3.1 | Invokes GitHub Copilot CLI for collaborative planning, cloud delegation, and autonomous execution |
| `cli-gemini` | 1.2.1 | Invokes Google Gemini CLI for code generation, Google Search grounding, and architecture analysis |

**MCP Integration Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `mcp-chrome-devtools` | 1.0.7.0 | Browser debugging via CLI (bdg) with MCP fallback for multi-tool integration |
| `mcp-clickup` | 1.0.0 | ClickUp project management via CLI (cu, 30+ commands) and MCP for enterprise features |
| `mcp-coco-index` | 1.0.0 | Semantic code search via vector embeddings using natural-language queries |
| `mcp-code-mode` | 1.0.7.0 | TypeScript-based MCP orchestration hub for all external tool calls |
| `mcp-figma` | 1.0.7.0 | Figma design file access: file retrieval, image export, component and style extraction |

**Code Quality Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `sk-code--full-stack` | 1.1.0.0 | Stack-agnostic orchestrator with automatic stack detection via marker files |
| `sk-code--opencode` | 1.2.0.0 | Multi-language standards for OpenCode system code (JS, TS, Python, Shell, JSON) |
| `sk-code--review` | 1.2.0.0 | Findings-first code review baseline with security and correctness minimums |
| `sk-code--web` | 1.1.0.0 | Web implementation, debugging, and verification across specialized quality skills |

**Documentation, Research, Prompt, and Improvement Skills**

| Skill | Version | Description |
| --- | --- | --- |
| `sk-agent-improver` | 1.0.0.0 | Evaluator-first agent improvement with 5-dimension integration-aware scoring, dynamic profiling, deterministic benchmarks, and guarded promotion |
| `sk-deep-research` | 1.2.0 | Autonomous research loop with iterative investigation, externalized state, and convergence detection |
| `sk-deep-review` | 1.0.0 | Autonomous iterative code review with severity-weighted findings, dimension coverage, convergence detection, and release readiness verdicts |
| `sk-doc` | 1.3.0.0 | Markdown quality enforcement, component templates, validation scripts, and DQI scoring |
| `sk-prompt-improver` | 1.2.0.0 | Prompt engineering using 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT) |

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
├── mcp-chrome-devtools/    # Browser debugging via MCP
├── mcp-clickup/            # ClickUp project management via MCP
├── mcp-coco-index/         # Semantic code search via vector embeddings
├── mcp-code-mode/          # MCP orchestration hub (TypeScript)
├── mcp-figma/              # Figma design file access via MCP
├── scripts/                # Shared skill routing scripts
├── sk-agent-improver/ # Evaluator-first agent improvement loop
├── sk-code--full-stack/    # Stack-agnostic implementation orchestrator
├── sk-code--opencode/      # OpenCode system code standards
├── sk-code--review/        # Findings-first code review baseline
├── sk-code--web/           # Web implementation and verification
├── sk-deep-research/       # Autonomous deep research loop
├── sk-deep-review/         # Autonomous iterative code review
├── sk-doc/                 # Documentation quality and templates
├── sk-git/                 # Git workflow orchestrator
├── sk-prompt-improver/     # Prompt engineering specialist
├── system-spec-kit/        # Spec folder and memory foundation
└── README.md               # This file
```

### Recommended Skill Layout

Each skill folder follows this internal structure:

| Path | Purpose |
| --- | --- |
| `SKILL.md` | Required entry point with YAML frontmatter, routing logic, and instructions |
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
| `mcp-chrome-devtools` | Yes | No | No |
| `mcp-clickup` | Yes | Yes | No |
| `mcp-coco-index` | Yes | No | No |
| `mcp-code-mode` | Yes | Yes | Yes |
| `mcp-figma` | Yes | Yes | No |
| `sk-code--full-stack` | Varies | Varies | Varies |
| `sk-code--opencode` | Varies | Varies | Varies |
| `sk-code--review` | Varies | Varies | Varies |
| `sk-code--web` | Varies | Varies | Varies |
| `sk-deep-research` | Yes | No | Yes |
| `sk-deep-review` | Yes | No | Yes |
| `sk-doc` | Yes | Yes | Yes |
| `sk-git` | Yes | Yes | No |
| `sk-prompt-improver` | Yes | Yes | No |
| `system-spec-kit` | Yes | Yes | Yes |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Skill Routing Policy

Gate 2 routing runs before any non-trivial task. The advisor script scores the request against all discovered skills and returns ranked recommendations.

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
# Documentation task: sk-doc is recommended at high confidence
python3 .opencode/skill/scripts/skill_advisor.py "create a flowchart for the auth flow" --threshold 0.8
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
# Generate a memory file from structured JSON (never use Write tool directly)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"specs/019-readme","sessionSummary":"Updated skill README"}' \
  specs/019-readme
```

### Run regression and benchmarks for the advisor

```bash
# Regression quality check
python3 .opencode/skill/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --out .opencode/skill/scripts/out/regression-report.json

# Latency benchmark
python3 .opencode/skill/scripts/skill_advisor_bench.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 7 \
  --out .opencode/skill/scripts/out/benchmark-report.json
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
python3 .opencode/skill/scripts/skill_advisor.py "commit changes" --threshold 0.5
```

### Wrong skill is recommended

**Symptom.** The advisor returns a skill that does not match the request.

**Cause.** Overly broad description terms in a skill's SKILL.md, or a synonym mapping that pulls unrelated skills into the result set.

**Fix.** Tighten the description in the recommended skill's SKILL.md frontmatter. Add a specific `trigger_phrases` list. Adjust boost values in `skill_advisor.py` INTENT_BOOSTERS if the false match comes from a keyword collision.

### New skill is not discovered

**Symptom.** A newly created skill folder does not appear in advisor output.

**Cause.** Missing or malformed SKILL.md frontmatter. The advisor requires at minimum a `name` and `description` field.

**Fix.**

```bash
# Validate the new skill's frontmatter
head -15 .opencode/skill/my-new-skill/SKILL.md

# Force a discovery refresh (clears the mtime cache)
python3 .opencode/skill/scripts/skill_advisor.py "test" --health
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

No. `skill_advisor.py` discovers skills by scanning for SKILL.md files in `.opencode/skill/`. Adding a folder with a valid SKILL.md is enough. The advisor picks it up on the next run.

**Q: Can I use multiple skills in the same task?**

Yes. The advisor returns a ranked list. A task may load a primary skill (for example sk-code--review) and a secondary overlay (for example sk-code--opencode) at the same time. The calling agent manages which sections of each SKILL.md apply to the current step.

**Q: What is the difference between skill-local scripts and the shared scripts/ folder?**

Shared scripts in `.opencode/skill/scripts/` handle cross-skill concerns: routing, benchmarking, and regression testing. Skill-local scripts in a skill's own `scripts/` folder handle domain-specific automation (document validation, spec creation, memory generation) that only that skill uses.

**Q: Why does the advisor cap confidence at 0.95?**

The cap preserves a margin of uncertainty so the calling AI retains judgment on edge cases. A 0.95 score means the advisor is highly confident, not certain. Absolute certainty from a heuristic scorer would be misleading.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [Main Framework README](../../README.md) | Root project overview and framework entry point |
| [Shared Scripts README](scripts/README.md) | skill_advisor.py usage, architecture, and configuration |
| [Skill Advisor Setup Guide](scripts/SET-UP_GUIDE.md) | Step-by-step customization for new projects |
| [system-spec-kit SKILL.md](system-spec-kit/SKILL.md) | Spec folder workflow and memory foundation |
| [sk-doc SKILL.md](sk-doc/SKILL.md) | Documentation quality standards and templates |
| [sk-git SKILL.md](sk-git/SKILL.md) | Git workflow orchestration |
| [sk-code--review SKILL.md](sk-code--review/SKILL.md) | Code review baseline |
| [sk-code--opencode SKILL.md](sk-code--opencode/SKILL.md) | OpenCode system code standards |

<!-- /ANCHOR:related-documents -->
