# Iteration 022 — Fold Memory UX Into The Lifecycle

Date: 2026-04-10

## Research question
Is the `/memory:*` command surface well integrated with `/spec_kit:*`, or has it become an awkward parallel control plane for ordinary work?

## Hypothesis
Babysitter will show that operational continuity can be mostly invisible to the user, with explicit tools reserved for diagnostics and recovery rather than for the normal happy path.

## Method
I compared Spec Kit's explicit memory commands and resume behavior with Babysitter's session-state, resume, and health surfaces.

## Evidence
- `/memory:save` is a substantial workflow of folder detection, duplicate checks, token-budget checks, anchor validation, naming conflict handling, alignment checks, and manual AI-composed context extraction. [SOURCE: .opencode/command/memory/save.md:7-47] [SOURCE: .opencode/command/memory/save.md:57-76] [SOURCE: .opencode/command/memory/save.md:89-173] [SOURCE: .opencode/command/memory/save.md:182-191]
- `/memory:search` is a second large public surface that mixes ordinary context lookup with preflight/postflight, causal graph, ablation, and dashboards. [SOURCE: .opencode/command/memory/search.md:2-4] [SOURCE: .opencode/command/memory/search.md:53-92] [SOURCE: .opencode/command/memory/search.md:113-139]
- `/spec_kit:resume` already overlaps that terrain by auto-detecting sessions, choosing resume context, and loading just enough state to continue. [SOURCE: .opencode/command/spec_kit/resume.md:29-45] [SOURCE: .opencode/command/spec_kit/resume.md:85-141] [SOURCE: .opencode/command/spec_kit/resume.md:200-202]
- The resume YAML pushes even harder toward automatic continuity: it prioritizes handover, `session_bootstrap()`, `memory_context()`, and sufficiency-based gap filling, with the explicit rule to stop loading once the next safe action is known. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:69-93] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:127-155] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:195-210]
- Babysitter keeps session state intentionally small and operational: a short YAML-frontmatter file stores `iteration`, `max_iterations`, `run_id`, timestamps, and recent iteration timing, written atomically. [SOURCE: external/packages/sdk/src/session/write.ts:12-25] [SOURCE: external/packages/sdk/src/session/write.ts:31-58] [SOURCE: external/packages/sdk/src/session/write.ts:152-189]
- Babysitter's main user-facing continuity tools are resume and diagnostics rather than a separate general-purpose memory surface. [SOURCE: external/README.md:170-200] [SOURCE: external/README.md:218-234] [SOURCE: external/plugins/babysitter-opencode/commands/resume.md:1-8] [SOURCE: external/plugins/babysitter-opencode/commands/doctor.md:1-19]

## Analysis
Spec Kit has already discovered the right internal pattern: resume should recover the minimum useful continuity packet, not reload everything. But the public surface still exposes memory as a first-class parallel product, so the operator has to reason about both "work lifecycle" and "memory lifecycle" even when they are simply trying to continue or finish a task. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:73-93] [SOURCE: .opencode/command/memory/save.md:57-76]

Babysitter's approach is cleaner at the operator boundary. Continuity exists, but most of it is runtime-owned state and explicit resume tooling, not a separate everyday command family. That keeps powerful recovery tools available while shrinking the number of concepts the user has to keep in working memory. [SOURCE: external/packages/sdk/src/session/write.ts:31-58] [SOURCE: external/plugins/babysitter-opencode/commands/resume.md:1-8]

This suggests the right move for Spec Kit is not to delete memory capabilities, but to demote most of them from ordinary workflow concerns into advanced search, admin, and analysis surfaces.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators can use `/memory:save`, `/memory:search`, `/memory:manage`, and `/memory:learn` in parallel with `/spec_kit:*`, while `/spec_kit:resume` separately implements continuity recovery. [SOURCE: .opencode/command/memory/save.md:51-85] [SOURCE: .opencode/command/memory/search.md:53-92] [SOURCE: .opencode/command/spec_kit/resume.md:200-202]
- **External repo's equivalent surface:** Babysitter mainly exposes resume, diagnostics, and lightweight session-state plumbing; the runtime owns operational continuity under the hood. [SOURCE: external/packages/sdk/src/session/write.ts:31-58] [SOURCE: external/plugins/babysitter-opencode/commands/resume.md:1-8] [SOURCE: external/plugins/babysitter-opencode/commands/doctor.md:1-19]
- **Friction comparison:** Spec Kit's normal path can force the user to decide whether they are "doing work" or "managing memory," while Babysitter makes continuity mostly implicit until recovery or diagnosis is needed.
- **What system-spec-kit could DELETE to improve UX:** Delete explicit `/memory:save` from the normal operator happy path by making save-on-completion and save-on-handover default behavior.
- **What system-spec-kit should ADD for better UX:** Add one advanced memory/admin surface for search, repair, analytics, and learning, while ordinary `/spec_kit:*` commands own routine save/load behavior automatically.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge routine memory behavior into the normal Spec Kit lifecycle and reserve the explicit `/memory:*` surface for advanced retrieval, analytics, and admin work. The current parallel public surface adds cognitive overhead to ordinary task execution.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Expose memory as a separate public command family while also embedding continuity behavior into `/spec_kit:resume` and completion flows. [SOURCE: .opencode/command/memory/save.md:51-76] [SOURCE: .opencode/command/memory/search.md:53-92] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:69-93]
- **External repo's approach:** Keep operational continuity lightweight and runtime-owned, surfacing explicit resume and doctor tools when needed. [SOURCE: external/packages/sdk/src/session/write.ts:31-58] [SOURCE: external/plugins/babysitter-opencode/commands/resume.md:1-8] [SOURCE: external/plugins/babysitter-opencode/commands/doctor.md:1-19]
- **Why the external approach might be better:** It reduces the number of separate surfaces an operator needs to understand for ordinary work.
- **Why system-spec-kit's approach might still be correct:** Power users do benefit from explicit search and analysis commands.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep `/memory:search` and `/memory:manage` for advanced use, but make save/load decisions default lifecycle behavior inside `/spec_kit:*` and hide `/memory:save` from standard workflow docs.
- **Blast radius of the change:** medium
- **Migration path:** first update docs and wrappers so routine save/load is described as automatic, then demote `/memory:save` to advanced documentation and finally consider alias-only status.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/memory/save.md`, `.opencode/command/memory/search.md`, `.opencode/command/spec_kit/resume.md`, `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** clarify which `/memory:*` capabilities remain public power tools versus lifecycle-internal behavior
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that routine manual memory operations are central to the happy path, but the strongest current Spec Kit UX already points the other way: "load just enough state" and "stop once the next safe action is known." [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:73-93]

## Follow-up questions for next iteration
- If level selection remains, should checklist and decision-record creation also become lazy rather than front-loaded?
- Which continuity artifacts still deserve their own public workflow?
- What does the current template and validation UX feel like compared with Babysitter's onboarding/process model?
