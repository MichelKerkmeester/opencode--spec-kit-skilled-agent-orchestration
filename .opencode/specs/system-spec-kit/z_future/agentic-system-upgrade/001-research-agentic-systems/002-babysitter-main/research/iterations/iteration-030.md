# Iteration 030 — Add Execution Profiles To Lower Workflow Friction

Date: 2026-04-10

## Research question
Across the full feature-delivery workflow, does `system-spec-kit` ask too many up-front questions and create too many mandatory artifacts compared to Babysitter's equivalent operator path?

## Hypothesis
Babysitter will show that first-run setup plus explicit execution modes can reduce repeat friction more effectively than re-running the full gate-and-artifact ceremony on every substantial task.

## Method
I compared a typical Spec Kit feature workflow with Babysitter's user/project install plus mode-based orchestration surface.

## Evidence
- Spec Kit's flow begins with Gate 1, Gate 2, and Gate 3 before ordinary execution, then ties file modifications to a mandatory spec-folder workflow and documentation level selection. [SOURCE: AGENTS.md:159-186] [SOURCE: AGENTS.md:233-252] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-13] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:32-59]
- The command quick reference in AGENTS describes separate plan, implement, complete, resume, handover, memory, deep-research, and deep-review flows as distinct user journeys. [SOURCE: AGENTS.md:138-155]
- Babysitter explicitly separates one-time setup from daily execution: `/babysitter:user-install` creates a personal profile, and `/babysitter:project-install` creates a project profile so future runs can ask fewer questions and make better default decisions. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:160-201]
- Daily execution then mostly reduces to choosing a mode such as `call`, `yolo`, `forever`, or `plan`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:13-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:41-62] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:66-88] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:127-150]

## Analysis
Phase 3's earlier findings already imply that Spec Kit's friction is cumulative: repeated gate checks, repeated routing, repeated lifecycle selection, repeated continuity concepts, and repeated artifact expectations. The end-to-end problem is not one individual prompt. It is the stack effect. [SOURCE: AGENTS.md:159-229] [SOURCE: AGENTS.md:233-252]

Babysitter provides a useful complement to those simplification findings. It has more capability than its first-run experience suggests, but some of that complexity is paid once at user-install and project-install time. After that, the daily operator path becomes mode selection plus run continuation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:160-201] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:13-31]

For Spec Kit, that suggests a concrete additive UX move: execution profiles. Let projects and users choose a default friction budget once, then route the workflow accordingly.

## UX / System Design Analysis

- **Current system-spec-kit surface:** The operator repeatedly pays the full gate/routing/documentation setup cost, even when the project and user preferences are already known.
- **External repo's equivalent surface:** Babysitter front-loads more setup into `user-install` and `project-install`, then lets daily use be mostly a mode choice plus orchestration.
- **Friction comparison:** Babysitter amortizes setup better. Spec Kit asks for more repeated confirmations and creates more repeated workflow overhead per task.
- **What system-spec-kit could DELETE to improve UX:** Delete repeated re-asking of stable preferences once a project or user profile exists.
- **What system-spec-kit should ADD for better UX:** Add execution profiles such as `guided`, `standard`, and `autonomous`, backed by stored project/user defaults that control gate strictness, memory behavior, and artifact expectations.
- **Net recommendation:** ADD

## Conclusion
confidence: medium

finding: `system-spec-kit` should add execution profiles and stored defaults so recurring work does not repeatedly pay the same up-front workflow cost. This is a useful UX layer, but it should land after the more foundational routing and policy simplifications.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Repeated gate-and-artifact ceremony on substantial tasks. [SOURCE: AGENTS.md:159-229] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:32-59]
- **External repo's approach:** One-time user/project install plus mode-based daily orchestration. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:160-201] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:13-31]
- **Why the external approach might be better:** It amortizes complexity across many tasks instead of charging it every time.
- **Why system-spec-kit's approach might still be correct:** High-governance workflows may still need explicit confirmations when risk is high.
- **Verdict:** ADD
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A. This is an additive UX improvement layered on top of the simplification work.
- **Blast radius of the change:** medium
- **Migration path:** start with opt-in execution profiles for recurring users/projects, then expand once the routing and policy layers are simpler.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `.opencode/command/spec_kit/`, `.opencode/skill/system-spec-kit/`, profile/config helpers
- **Change type:** new module + modified existing
- **Blast radius:** medium
- **Prerequisites:** first simplify lifecycle, continuity, routing, and operator-policy surfaces
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for evidence that Babysitter still re-interviews users from scratch on every ordinary run, but its documented user-install and project-install flows suggest the opposite: repeated work is supposed to benefit from stored preferences and project context. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/docs/user-guide/reference/slash-commands.md:160-201]

## Follow-up questions for next iteration
- Which Phase 3 recommendations are foundational enough to schedule before any additive UX work?
- How should the final synthesis separate "delete friction now" work from "add convenience later" work?
- What is the cleanest combined verdict across all 30 iterations?
