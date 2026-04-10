# Iteration 021 — Single CLI Front Door Versus Slash-Command Pack

Date: 2026-04-10

## Research question
Should `system-spec-kit` replace its slash-command surface with a single `agl`-style binary or singular front door?

## Hypothesis
Probably not. Agent Lightning's smaller front door comes from tighter docs, examples, and runtime focus, not just from having one CLI name. Public likely needs fewer primary starts, but not a totally different invocation model.

## Method
I compared Agent Lightning's packaged CLI and docs/exploration model with Public's `spec_kit` and `memory` command families.

## Evidence
- Agent Lightning exposes one packaged script entrypoint, `agl`, from `pyproject.toml`. [SOURCE: external/pyproject.toml:50-51]
- That CLI stays narrow at the top level: `agl` exposes `vllm`, `store`, `prometheus`, and `agentops`, rather than a large menu of workflow verbs. [SOURCE: external/docs/reference/cli.md:1-26]
- The external docs then carry the discovery burden through audience-oriented reading paths: installation, how-to recipes, algorithm zoo, deep dive, and API references. [SOURCE: external/docs/index.md:14-19]
- The examples catalog is a first-class navigation layer, with concrete examples like `claude_code`, `tinker`, `spider`, and `apo`. [SOURCE: external/examples/README.md:1-18]
- Public currently exposes separate slash-command entrypoints for `plan`, `implement`, `complete`, `deep-research`, and `resume`, each with its own prompt protocol and setup contract. [SOURCE: .opencode/command/spec_kit/plan.md:2-4] [SOURCE: .opencode/command/spec_kit/implement.md:2-4] [SOURCE: .opencode/command/spec_kit/complete.md:2-4] [SOURCE: .opencode/command/spec_kit/deep-research.md:2-4] [SOURCE: .opencode/command/spec_kit/resume.md:2-4]
- Public also exposes a parallel `memory` family for `save`, `search`, `manage`, and `learn`. [SOURCE: .opencode/command/memory/save.md:2-4] [SOURCE: .opencode/command/memory/search.md:2-4] [SOURCE: .opencode/command/memory/manage.md:2-4] [SOURCE: .opencode/command/memory/learn.md:2-4]

## Analysis
Agent Lightning feels smaller because operators usually discover it through tutorial and example paths, then touch only a thin CLI. Public's problem is different: in a chat runtime, slash commands are already the thin invocation surface. Replacing them with a single binary name would not remove the real friction, which is deciding which workflow to start and how the command families relate.

So the comparison does not support a binary-style collapse. It supports better discovery and a clearer "recommended starting points" model layered on top of the existing slash-command grammar.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject an `agl`-style single-binary pivot. The right fix is better discovery and fewer primary starting choices, not changing the command transport.

## Adoption recommendation for system-spec-kit
- **Target file or module:** operator entrypoint strategy
- **Change type:** non-adoption guardrail
- **Blast radius:** medium
- **Prerequisites:** define a small set of recommended starts (`resume`, `complete`, `deep-research`) and document when the rest matter
- **Priority:** rejected

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators face a split surface across `spec_kit` workflow commands and parallel `memory` commands, each with its own markdown contract.
- **External repo's equivalent surface:** Operators see one small CLI plus audience-based docs and an examples catalog that does most of the onboarding work.
- **Friction comparison:** Agent Lightning has lower discovery friction because examples and doc categories narrow choices early. Public's transport is already simple, but command selection is harder because more workflow states are surfaced as separate entrypoints.
- **What system-spec-kit could DELETE to improve UX:** Delete duplicated "which command should I use?" explanation scattered across multiple command files.
- **What system-spec-kit should ADD for better UX:** Add a single quickstart matrix that recommends the best first command for common intents before users read individual command specs.
- **Net recommendation:** KEEP

## Counter-evidence sought
I looked for evidence that the external repo's smaller feel comes primarily from `agl` itself rather than from docs and examples, but the docs index and examples catalog carry too much of that weight to justify a CLI-model imitation.

## Follow-up questions for next iteration
- If slash commands remain, which ones should be considered primary versus advanced?
- Can Public shrink perceived command count without deleting admin-only capabilities?
- Should quickstart guidance live in one root page, `/spec_kit:complete`, or `/spec_kit:resume`?
