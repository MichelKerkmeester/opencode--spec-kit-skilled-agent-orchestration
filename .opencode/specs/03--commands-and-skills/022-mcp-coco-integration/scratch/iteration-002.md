# Iteration 002: Sibling-Repo Adoption Bundle And Strict Readiness Model

## Focus

Design a concrete sibling-repo CocoIndex adoption bundle and strict readiness model: determine which checks belong in `doctor.sh`, which belong in `ensure_ready.sh`, and what minimal downstream assets/config wiring a sibling repo like Barter must have for advisor-side semantic routing to matter.

## Findings

1. `doctor.sh` should own the strict, read-only readiness contract. Its current implementation already inspects project root resolution, binary readiness, installed version, index stats, daemon state, and config detection without mutating the repo, and it emits a recommended next step. The right next increment is to make those checks explicit and strict: binary present at the repo-local path, skill subtree present, helper scripts present, index ready, daemon status known, and per-config-file `cocoindex_code` presence over the supported config matrix from `common.sh`. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:5] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:69] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:91] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/common.sh:15] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/common.sh:126]

2. `ensure_ready.sh` should stay the mutating bootstrap boundary and repair only what it can safely make true locally: install the repo-local binary, initialize the project, and build or refresh the index. Its present behavior already maps cleanly to that boundary. The strict-model extension should therefore be additive and optional: `--require-config` and/or `--strict` can fail when downstream config wiring is absent, but config authoring itself should remain outside `ensure_ready.sh` so the script stays idempotent and non-surprising. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:5] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:62] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:71] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:80] [INFERENCE: because the current script only mutates install/init/index state, keeping config creation out of it preserves its existing contract]

3. The minimal sibling-repo adoption bundle has three layers. Layer 1 is the local skill payload itself: `.opencode/skill/mcp-coco-index/` with at least `SKILL.md`, `scripts/`, `references/`, `assets/`, and the repo-local venv target at `mcp_server/.venv/bin/ccc`; without `SKILL.md`, the advisor cannot discover `mcp-coco-index`. Layer 2 is repo config wiring for the CLIs that repo actually uses, using the template contract of `cocoindex_code`, the repo-local `ccc` path, `mcp`, and `COCOINDEX_CODE_ROOT_PATH="."`. Layer 3 is local repo hygiene, especially `.cocoindex_code/` being gitignored. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:20] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:43] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:69] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:91] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:135] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:154] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:37]

4. Barter shows what the concrete downstream minimum looks like in practice. It already has `opencode.json`, `.agents/settings.json`, `.claude/mcp.json`, and `.codex/config.toml`, but all four currently wire only `sequential_thinking`, `spec_kit_memory`, and `code_mode`, with no `cocoindex_code` server entries. Combined with the missing local `mcp-coco-index` skill subtree, that means Barter needs both the skill payload and config wiring before advisor-side semantic routing can matter. `.mcp.json` and `.gemini/settings.json` are not blockers unless Barter wants those clients too; the minimal bundle should target the config files the repo already uses first. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/opencode.json:69] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.agents/settings.json:22] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.claude/mcp.json:2] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.codex/config.toml:1] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:289] [INFERENCE: because those are the existing MCP-bearing config files in Barter, they form the minimum config surface for first adoption]

## Sources Consulted

- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:5
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:69
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:91
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/common.sh:15
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/common.sh:126
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:5
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:62
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:71
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:80
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:20
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:43
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:69
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:91
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:135
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/assets/config_templates.md:154
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/opencode.json:69
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.agents/settings.json:22
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.claude/mcp.json:2
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.codex/config.toml:1
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:37
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:289

## Assessment

- New information ratio: 0.8
- Questions addressed:
  - How should a sibling-repo CocoIndex adoption bundle be packaged: shared skill subtree, install command, config sync helper, or documented checklist?
  - Should `doctor.sh` grow strict exit codes and `ensure_ready.sh` grow optional config validation, or should those be separate commands?
  - What remaining high-value automation can be added inside the skill without changing upstream CocoIndex or introducing new runtime routing rules?
- Questions answered:
  - The adoption bundle should be a shared local skill payload plus repo-specific config wiring, not advisor logic alone.
  - `doctor.sh` should own strict read-only inspection; `ensure_ready.sh` should own local repairable setup and optional post-check failures, not config authoring.

## Reflection

- What worked and why: Reading the helper contracts and config templates together made the responsibility split obvious, because the scripts already separate inspection from mutation and the templates already define the downstream config surface.
- What did not work and why: Looking only at Barter advisor behavior would still have obscured the minimum bundle shape. The missing piece was the config template layer, which explains exactly what downstream repos need to carry.
- What I would do differently: The next iteration should turn this design into an implementation-ready proposal: a rollout checklist or script contract, plus a strict readiness schema with named failure codes.

## Recommended Next Focus

Translate the adoption-bundle design into an implementation-ready Phase 3 proposal: define strict `doctor.sh` failure codes, optional `ensure_ready.sh --require-config` semantics, and a minimal downstream rollout checklist or helper for repos like Barter.
