# Iteration 030 — The YAML Asset Layer Is Useful, But It Is Too Wide

Date: 2026-04-10

## Research question
Is the current YAML workflow-asset pattern the right abstraction for autonomous execution, or has it become too broad and repetitive at the command surface?

## Hypothesis
The abstraction is still useful, but the asset surface is too wide. Shared workflow skeletons should be factored so command assets describe differences, not repeat the same orchestration shape.

## Method
I revisited how local commands explain their YAML execution model and compared that with Xethryon's smaller command/template registration surface.

## Evidence
- `/spec_kit:plan` explicitly says the markdown command is turned into a YAML asset execution flow. [SOURCE: .opencode/command/spec_kit/plan.md:13-21]
- `/spec_kit:implement` and `/spec_kit:complete` each restate substantial workflow structure rather than feeling like thin wrappers over a small shared execution core. [SOURCE: .opencode/command/spec_kit/implement.md:171-201] [SOURCE: .opencode/command/spec_kit/complete.md:198-217]
- The current repo layout contains a large asset surface under `.opencode/command/spec_kit/assets/`, which increases drift risk across similar workflows. This phase review counted fifteen YAML assets in that folder.
- Xethryon's command system keeps commands, templates, and bundled skills in one registry layer rather than exposing a comparably wide asset family for operators to reason about. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/command/index.ts:96-237]

## Analysis
The YAML pattern is not the problem by itself. It gives Spec Kit a reducer-visible, machine-readable workflow contract. The problem is width: too many near-peer assets mean more documentation to maintain, more places for drift, and more ways for command families to feel fragmented.

Xethryon suggests a better UX principle here: keep the composition layer close to the runtime registry and make each command feel like a thin specialization. Spec Kit should preserve explicit workflow assets, but make them smaller and more composable.

## UX / System Design Analysis

- **Current system-spec-kit surface:** multiple command assets encode related workflow shapes across plan, implement, complete, and deep-loop commands.
- **External repo's equivalent surface:** a tighter registry where commands and bundled skills are closer to one shared command layer.
- **Friction comparison:** `system-spec-kit` offers more explicit workflow control, but its asset breadth increases maintenance and makes the operator surface feel more fragmented than it needs to be.
- **What system-spec-kit could DELETE to improve UX:** repeated workflow boilerplate spread across many near-duplicate YAML assets.
- **What system-spec-kit should ADD for better UX:** shared execution skeletons or generated assets so each command asset only declares the delta from the common workflow core.
- **Net recommendation:** SIMPLIFY

## Conclusion
confidence: medium

finding: keep the YAML workflow-asset model, but shrink its abstraction boundary by factoring shared orchestration structure into a common engine or generator layer.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit machine-readable workflow assets with noticeable breadth.
- **External repo's approach:** a tighter command/skill registry surface.
- **Why the external approach might be better:** less drift and less surface-area overhead.
- **Why system-spec-kit's approach might still be correct:** explicit assets are still the better governance contract for reproducible autonomous workflows.
- **Verdict:** SIMPLIFY
- **If SIMPLIFY — concrete proposal:** centralize shared workflow skeletons and generate or compose command assets from that smaller core.
- **Blast radius of the change:** medium
- **Migration path:** start with the plan/implement/complete family, then expand the shared skeleton model only if it reduces duplication in practice.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** identify common workflow segments that can be safely shared without hiding command-specific requirements
- **Priority:** should-have

## Counter-evidence sought
I looked for proof that the current asset width is harmless because the command family is stable. The repeated command explanations suggest drift pressure is already present even before implementation changes land.

## Follow-up questions for next iteration
- none; this concludes the Phase 3 research pass for `009-xethryon`
