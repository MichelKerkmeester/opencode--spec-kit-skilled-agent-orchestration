# Iteration 027 — Consolidate The Public Skill Surface

Date: 2026-04-10

## Research question
Is the current `system-spec-kit` skill roster too fragmented for operators, especially across the `sk-code-*`, `sk-doc`, and loop skills?

## Hypothesis
Babysitter will show that runtime capability packaging can stay rich while the public skill surface stays small, because most specialization can live behind one primary orchestration skill and discovery layer rather than as many peer entry points.

## Method
I compared the main Spec Kit skills and their public boundaries with Babysitter's single-primary-skill model plus runtime discovery of skills, agents, and processes.

## Evidence
- `system-spec-kit` is already a large umbrella skill covering spec folders, templates, validation, and memory. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-13] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:32-59]
- `sk-code-opencode`, `sk-code-web`, and `sk-code-full-stack` are separate public skills with overlapping implementation, debugging, and verification concerns, each adding its own routing layer. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:10-15] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-48] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:10-15] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:21-59] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:10-15] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-60]
- `sk-doc` is also broad: it owns document quality, component creation, flowcharts, install guides, and testing playbooks. [SOURCE: .opencode/skill/sk-doc/SKILL.md:10-16] [SOURCE: .opencode/skill/sk-doc/SKILL.md:47-76] [SOURCE: .opencode/skill/sk-doc/SKILL.md:92-119]
- `sk-deep-research` and `sk-deep-review` are separate loop products with nearly parallel structure and runtime-path resolution. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:12-20] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:24-54] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:13-20] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:25-57]
- Babysitter's repo guidance tells the harness to always use the `babysit` skill for user requests. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-4]
- The Codex and OpenCode `babysit` skills are intentionally tiny: they establish dependencies, then ask the runtime to generate the real orchestration instructions. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-codex/skills/babysit/SKILL.md:11-47] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/skills/babysit/SKILL.md:8-35]
- Babysitter also has a runtime discovery layer for skills, agents, and processes instead of relying on a mandatory up-front advisor for every turn. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/skill.ts:1-3] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/skill.ts:118-147] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/skill.ts:153-189] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/skill.ts:217-239]

## Analysis
Spec Kit's skill library is information-rich, but from an operator perspective it exposes a lot of internal taxonomy: which `sk-code-*` to pick, when `sk-doc` versus `system-spec-kit` owns a markdown change, when loop behavior lives in a command versus a skill, and when a specialized improver skill is worth invoking. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:61-73] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:21-45] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-39]

Babysitter suggests a better split between public UX and internal packaging. Publicly, there is one main orchestration skill. Internally, there can still be processes, plugin-local skills, and discovery tooling. That keeps the operator mental model compact without flattening the system's implementation richness. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-4] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-codex/skills/babysit/SKILL.md:33-47] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/skill.ts:217-239]

The lesson is not to delete specialization. It is to hide more of it behind a smaller public surface.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators see many top-level skills with overlapping lifecycle language, routing logic, and boundary rules.
- **External repo's equivalent surface:** Babysitter presents one primary orchestration skill and discovers additional capabilities at runtime as needed.
- **Friction comparison:** Spec Kit exposes more internal taxonomy up front, while Babysitter keeps specialization mostly behind the main orchestration skill.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that operators should distinguish multiple peer `sk-code-*` entry skills before work begins.
- **What system-spec-kit should ADD for better UX:** Add a smaller public skill family such as `sk-code`, `sk-doc`, and `sk-loop`, with the current specialized guidance retained as internal overlays or runtime-selected references.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should consolidate its public skill surface. Keep specialized knowledge internally, but present fewer first-class entry skills to operators.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Many peer skills each expose their own routing and lifecycle contract. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-13] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-48] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:47-69] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:41-60]
- **External repo's approach:** One primary orchestration skill plus runtime discovery of additional skills, agents, and processes. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-4] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/skill.ts:153-189] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/skill.ts:217-239]
- **Why the external approach might be better:** It reduces choice overload and makes runtime capability discovery a system concern instead of an operator burden.
- **Why system-spec-kit's approach might still be correct:** Fine-grained skills are useful authoring units and can remain valuable as internal packaging.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep the existing skill files as implementation units, but expose a smaller canonical public set and let routing choose overlays internally.
- **Blast radius of the change:** large
- **Migration path:** first define the smaller public family, route old skill names as aliases, then collapse command and gate wording onto the new public surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/`, `AGENTS.md`, `.opencode/command/spec_kit/`, `.opencode/skill/scripts/skill_advisor.py`
- **Change type:** modified existing
- **Blast radius:** large
- **Prerequisites:** define which skills remain public entry points versus internal routing overlays
- **Priority:** must-have

## Counter-evidence sought
I looked for proof that Babysitter needs a broad peer set of first-class skills for ordinary operation, but the repo guidance and harness skills keep pointing back to one main orchestration surface instead. Discovery exists, but it is runtime support, not an operator tax on every turn. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md:3-4] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-opencode/skills/babysit/SKILL.md:21-35] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/packages/sdk/src/cli/commands/skill.ts:217-239]

## Follow-up questions for next iteration
- Should `skill_advisor.py` become a fallback router instead of a mandatory gate?
- Could AGENTS and constitutional policy shrink if operator-facing routing were simpler?
- What should the lightweight "default execution profile" look like once the public skill set is smaller?
