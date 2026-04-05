# Deep Research Strategy

## Topic

Refine CocoIndex Phase 2 hardening for maximum automation and cross-CLI AI utilization without adding new runtime agent-routing rules.

## Key Questions

1. What remaining high-value automation can be added inside the skill without changing upstream CocoIndex or introducing new runtime routing rules?
2. What cross-CLI utilization gaps still exist after Phase 2 in docs, helper scripts, config ergonomics, or advisor behavior?
3. Which next-step improvements are low-risk and locally implementable now versus upstream-, product-, or policy-dependent?

## Known Context

- Phase 2 already added `doctor.sh`, `ensure_ready.sh`, `cross_cli_playbook.md`, and repo-local `ccc` preference in `skill_advisor.py`.
- Touched docs were aligned with the installed runtime contract: MCP `search` only, CLI-owned `status/index/reset/daemon`, daemon `status|restart|stop`, and no `ccc index --refresh`.
- Cross-CLI testing showed direct MCP discovery works in Claude, Gemini, and Copilot; the major known runtime issue is concurrent `refresh_index=true` behavior.

## What Worked

- Live `ccc --help` validation was more reliable than historical docs.
- Repo-local helper scripts created deterministic health/setup entrypoints.
- Cross-CLI guidance around `refresh_index=false` on follow-up queries materially reduced known failure modes.
- Comparing the primary repo's helper/playbook layer against a sibling repo exposed real portability gaps faster than further theoretical routing analysis.
- Reading helper contracts together with config templates produced a clean responsibility split between read-only inspection and mutable setup.

## What Failed Or Is Deferred

- Planned runtime agent-routing changes were not worth the maintenance cost.
- Watch-based continuous reindexing is not locally verified.
- Upstream daemon concurrency behavior is outside this repo's direct control.
- Porting advisor logic alone does not activate CocoIndex in downstream repos when the local skill/config wiring is absent.
- Advisor behavior without the config-template layer was too narrow to define a full downstream adoption bundle.

## Answered Questions

- [x] What remaining high-value automation can be added inside the skill without changing upstream CocoIndex or introducing new runtime routing rules?
  - The highest-value local automation is a sibling-repo adoption bundle plus strict readiness semantics, not more runtime routing logic.
- [x] What cross-CLI utilization gaps still exist after Phase 2 in docs, helper scripts, config ergonomics, or advisor behavior?
  - The biggest remaining gap is downstream repo adoption: helper scripts and advisor logic are useful only where the skill/config wiring is actually present.
- [x] Which next-step improvements are low-risk and locally implementable now versus upstream-, product-, or policy-dependent?
  - Low-risk local work is strict readiness validation plus a sibling-repo adoption bundle; upstream daemon concurrency remains external.
- [x] How should a sibling-repo CocoIndex adoption bundle be packaged: shared skill subtree, install command, config sync helper, or documented checklist?
  - Start with a shared local skill payload plus repo-specific config wiring and checklist semantics; avoid hidden config-writing behavior in readiness scripts.
- [x] Should `doctor.sh` grow strict exit codes and `ensure_ready.sh` grow optional config validation, or should those be separate commands?
  - Yes: `doctor.sh` should own strict read-only inspection, while `ensure_ready.sh` should keep ownership of repairable install/init/index state and optionally fail on missing config requirements.

## New Questions

- What is the best concrete interface for the downstream rollout artifact: checklist-only, helper script, or both?
- What strict failure-code schema should `doctor.sh` expose so agents and CI can act on it consistently?

## Next Focus

Translate the adoption-bundle design into an implementation-ready Phase 3 proposal: define strict `doctor.sh` failure codes, optional `ensure_ready.sh --require-config` semantics, and a minimal downstream rollout checklist or helper for repos like Barter.
