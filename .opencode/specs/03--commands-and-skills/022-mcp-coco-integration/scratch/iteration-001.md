# Iteration 001: Next-Wave CocoIndex Hardening Refinements

## Focus

Investigate the highest-value refinements that remain after Phase 2 hardening for maximizing CocoIndex automation and cross-CLI AI utilization without adding new runtime routing rules. This iteration also incorporates the newly observed portability gap in the Barter repo, where advisor-side CocoIndex logic now exists but the local `mcp-coco-index` skill/config wiring does not.

## Findings

1. The current helper layer is strong at repo-local readiness checks, but it stops short of downstream adoption automation. `doctor.sh` detects binary readiness, index readiness, daemon status, and config presence, then recommends a next step based on that state; `ensure_ready.sh` bootstraps install/init/index and returns machine-readable JSON. The playbook reinforces this repo-local sequence but does not yet define a reusable sibling-repo adoption path. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:69] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:91] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:62] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/references/cross_cli_playbook.md:22]

2. The highest-value local refinement is an explicit "CocoIndex adoption bundle" for sibling repos. The existing playbook already says no new routing rules are needed, and the implementation summary says direct MCP discovery is sufficient when the tool is present. That shifts the remaining problem from routing to rollout: install the skill, wire configs, and expose health/setup commands in each downstream repo that wants semantic routing. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/references/cross_cli_playbook.md:102] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/022-mcp-coco-integration/implementation-summary.md:170] [INFERENCE: because the direct-discovery case is already validated, the highest remaining leverage is consistent availability across repos rather than more routing logic]

3. Barter exposes the new portability gap clearly: the patched advisor now has repo-local `ccc` resolution and auto semantic-intent boosting logic, but the repo does not actually contain `.opencode/skill/mcp-coco-index/SKILL.md`, and advisor health shows no discovered `mcp-coco-index` skill. That means advisor-side CocoIndex logic alone is insufficient; without local skill/config availability, the advisor cannot recommend CocoIndex there. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:36] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:289] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:926] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:1317] [INFERENCE: based on `python3 .opencode/skill/scripts/skill_advisor.py --health` returning 14 skills without `mcp-coco-index`, plus `test -f .opencode/skill/mcp-coco-index/SKILL.md -> missing`]

4. The next automation increment should include stricter machine-readable readiness states, not just guidance strings. `doctor.sh` currently reports a recommended next step in JSON, but it does not offer strict failure modes for automation like "binary missing", "skill missing", or "config missing". `ensure_ready.sh` similarly ensures install/init/index, but it does not validate downstream config wiring. A `--strict` / `--require-config` mode would make the helpers more useful to agents and CI. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:103] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:76] [INFERENCE: machine-readable status without actionable exit semantics is helpful for humans but still leaves agent/CI orchestration logic duplicated elsewhere]

## Sources Consulted

- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:69
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/doctor.sh:91
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/scripts/ensure_ready.sh:62
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/references/cross_cli_playbook.md:22
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/references/cross_cli_playbook.md:102
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/022-mcp-coco-integration/implementation-summary.md:170
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:36
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:289
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:926
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/scripts/skill_advisor.py:1317

## Assessment

- New information ratio: 0.75
- Questions addressed:
  - What remaining high-value automation can be added inside the skill without changing upstream CocoIndex or introducing new runtime routing rules?
  - What cross-CLI utilization gaps still exist after Phase 2 in docs, helper scripts, config ergonomics, or advisor behavior?
  - Which next-step improvements are low-risk and locally implementable now versus upstream-, product-, or policy-dependent?
- Questions answered:
  - The highest-value local automation is downstream adoption packaging plus stricter readiness states.
  - A real remaining utilization gap is cross-repo portability, not additional routing logic.

## Reflection

- What worked and why: Comparing the new helper scripts and cross-CLI playbook against the Barter advisor state surfaced a concrete rollout gap instead of speculative ideas. This worked because it tested the "best utilized across every CLI" goal against a real sibling repo, not just the primary repo.
- What did not work and why: Advisor-only verification in Barter did not prove end-to-end CocoIndex readiness, because the repo lacks the underlying skill/config assets. That approach failed because it measured heuristics without measuring actual availability.
- What I would do differently: Run the next iteration as a packaging/design pass that enumerates the exact artifacts needed for sibling-repo adoption and strict readiness enforcement, including which checks belong in `doctor.sh`, which belong in `ensure_ready.sh`, and which belong in advisor health.

## Recommended Next Focus

Design a concrete Phase 3 "CocoIndex adoption bundle" for sibling repos: strict readiness flags for `doctor.sh`, optional config validation in `ensure_ready.sh`, and a minimal downstream rollout checklist or command that installs the skill/config wiring so advisor-side semantic logic can actually activate.
