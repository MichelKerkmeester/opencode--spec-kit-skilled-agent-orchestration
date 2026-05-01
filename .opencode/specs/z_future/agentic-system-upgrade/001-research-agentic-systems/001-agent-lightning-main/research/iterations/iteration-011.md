# Iteration 011 — Operator Surface Minimalism Versus Command Sprawl

Date: 2026-04-10

## Research question
Does Agent Lightning's compact CLI and audience-based documentation suggest that `system-spec-kit` is exposing too much command and tool surface to operators?

## Hypothesis
The external repo likely keeps a smaller public front door than `system-spec-kit`. If so, the strongest lesson will be UX simplification rather than backend deletion: keep internal richness, but stop making operators navigate it directly.

## Method
I read Agent Lightning's packaging, CLI entrypoint, contributor guidance, and docs navigation. I compared those surfaces against `system-spec-kit`'s gate-heavy operator workflow, command docs, and memory tool inventory to evaluate whether Public is overexposing implementation detail.

## Evidence
- Agent Lightning exposes a single installed CLI entrypoint, `agl`, rather than a large family of user-facing command names. [SOURCE: external/pyproject.toml:50-53]
- The `agl` CLI is a thin dispatcher with four subcommands: `vllm`, `store`, `prometheus`, and `agentops`. [SOURCE: external/agentlightning/cli/__init__.py:12-31]
- The external docs are organized by audience and task shape: Quickstart, How-To Recipes, Learning More, Deep Dive, and API References. [SOURCE: external/mkdocs.yml:98-138] [SOURCE: external/docs/index.md:14-23]
- The external contributor guide keeps the verification surface short and standard: `uv sync`, `pytest`, `pyright`, `pre-commit`, and strict MkDocs build. [SOURCE: external/AGENTS.md:11-16]
- `system-spec-kit` exposes many top-level workflow families in its operator guidance: `spec_kit:*`, `memory:*`, analysis commands, shared-memory commands, deep research/review, and multiple recovery flows. [SOURCE: AGENTS.md:132-155]
- The memory system alone documents 43 MCP tools under one server surface. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:95-140]
- `/spec_kit:deep-research` adds mode suffixes, flags, setup-state rules, and YAML indirection before the actual research loop starts. [SOURCE: .opencode/command/spec_kit/deep-research.md:7-21] [SOURCE: .opencode/command/spec_kit/deep-research.md:39-63]

## Analysis
Agent Lightning's public surface is not small because the system itself is simple. It is small because the repo draws a clear line between what maintainers need internally and what operators need at the front door. The user-facing surface is compressed into one CLI plus audience-based docs, while internal modules and optional capability groups stay behind that abstraction.

`system-spec-kit` currently leaks much more of its internal architecture into operator UX. The command map, gates, tool families, and memory sub-surfaces are all logically motivated, but together they create a control-plane feel that users must learn before they can just "do the work." That is useful for power users, yet it is too much as a default operator surface.

## Conclusion
confidence: high

finding: `system-spec-kit` should simplify its operator-facing surface. The right lesson from Agent Lightning is not "remove internal capabilities"; it is "hide internal topology behind a smaller front door." Keep the command and tool richness internally, but compress the public entrypoint set and organize docs by user task rather than by subsystem.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/` and operator-facing docs
- **Change type:** UX simplification
- **Blast radius:** medium
- **Prerequisites:** inventory canonical operator journeys, identify compatibility aliases to preserve, and separate public entrypoints from expert-only surfaces
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** A wide command and tool surface is visible to operators, including multiple command families, gates, recovery flows, and 43 memory MCP tools.
- **External repo's approach:** One `agl` CLI fronts a smaller task-oriented command set, while docs route users by audience and goal.
- **Why the external approach might be better:** It lowers cognitive load, reduces "which surface do I use?" friction, and keeps subsystem complexity behind a stable front door.
- **Why system-spec-kit's approach might still be correct:** `system-spec-kit` serves a more agentic and governance-heavy workflow than Agent Lightning, so some extra surface area is genuinely required.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Define a canonical operator surface of a few stable entrypoints and treat the rest as advanced or internal compatibility layers.
- **Blast radius of the change:** medium
- **Migration path:** Keep existing commands as aliases, update docs to privilege the new front door, then progressively demote low-level surfaces from primary guidance.

## Counter-evidence sought
I looked for signs that Agent Lightning hides complexity only by offloading it into undocumented behavior, but its contributor guide and docs navigation still keep the public surface compact. I also checked whether Public's breadth is already hidden behind a small front door, and the current operator guidance still exposes many flows directly.

## Follow-up questions for next iteration
- Is `system-spec-kit`'s validation pipeline also overexposed, or is that complexity appropriately hidden behind `validate.sh`?
- Should Public split its docs into "authoring internals" and "operator-facing workflows" the way Agent Lightning separates docs categories?
- Which surfaces are truly expert-only and can be de-emphasized without breaking compatibility?
