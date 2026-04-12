# Iteration 022 - Pull Operator Memory UX Back Into Spec Kit

## Research question
Is the `/memory:*` command family too parallel to `/spec_kit:*` from an operator perspective, especially for common activities such as save, search, resume, and "what should I do next?"

## Hypothesis
The local memory system will remain necessary as infrastructure, but the external repo will make a strong case that routine operator-facing continuity should feel like part of the main workflow instead of a separate product surface.

## Method
Compared local memory command docs and Spec Kit resume surfaces to the external repo's simpler continuity and progress workflow.

## Evidence
- The local memory README presents its own command family with save, search, manage, and learn subcommands, including database-health, ingestion, and constitutional-memory concerns. [SOURCE: .opencode/command/memory/README.txt:36-52] [SOURCE: .opencode/command/memory/README.txt:90-132]
- Individual memory commands expose a large control surface. `search` includes multiple modes and retrieval intents, while `manage` spans stats, health, cleanup, checkpoints, and shared-memory operations. [SOURCE: .opencode/command/memory/search.md:7-49] [SOURCE: .opencode/command/memory/search.md:53-102] [SOURCE: .opencode/command/memory/manage.md:7-29] [SOURCE: .opencode/command/memory/manage.md:70-90]
- Local resume behavior already sits partly in Spec Kit rather than memory, especially through the dedicated resume workflow asset and session bootstrap path. [SOURCE: .opencode/command/spec_kit/README.txt:168-178] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:113-210]
- The external repo handles continuity through a much flatter surface: working docs, progress summaries, and a smaller command set rather than a separately branded memory subsystem. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:106-149]

## Analysis
This separation makes sense to implementers but not to everyday operators. The memory stack is an internal substrate plus an admin surface. Yet the current command taxonomy exposes it as a parallel top-level workflow that sits beside Spec Kit. That means users have to learn whether they are doing "Spec Kit work" or "memory work," even when their actual intent is simply "resume the task," "save context," or "see what the system knows." The external repo's flatter continuity model suggests that routine continuity should appear as workflow affordances, while the deeper memory administration tools stay available but secondary.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Treat memory as a first-class command family parallel to Spec Kit.
- **External repo's approach:** Bundle continuity into the main working surface through progress docs and lightweight status flows.
- **Why the external approach might be better:** Users think in terms of tasks and continuity, not in terms of storage subsystem boundaries.
- **Why system-spec-kit's approach might still be correct:** Administrators and power users still need direct access to memory health, cleanup, and search primitives.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Pull common continuity tasks such as save, resume, and contextual search into the primary Spec Kit surface, while demoting `/memory:*` to advanced and administrative use.
- **Blast radius of the change:** medium
- **Migration path:** Start by aliasing common memory tasks under Spec Kit wording, then narrow `/memory:*` docs around admin or power-user scenarios.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators choose between a workflow system (`/spec_kit:*`) and a memory system (`/memory:*`) even when their intent is a single continuity action.
- **External repo's equivalent surface:** Continuity is folded into ordinary work commands, progress, and document state rather than a separately branded subsystem.
- **Friction comparison:** The local split adds category confusion and command-discovery overhead. The external repo has fewer total capabilities, but users do not need to model the architecture to keep working.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that routine save/resume/search tasks must live on a separate top-level memory surface.
- **What system-spec-kit should ADD for better UX:** Add Spec Kit-native continuity verbs and reserve raw memory commands for diagnostics, admin, and advanced retrieval.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge routine continuity and memory interactions back into the main Spec Kit operator surface, keeping the current `/memory:*` family mainly for advanced administration.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/memory/README.txt`, `.opencode/command/spec_kit/README.txt`, resume/save/search command docs
- **Change type:** command consolidation
- **Blast radius:** medium
- **Prerequisites:** define which memory tasks are operator-facing versus administrative
- **Priority:** should-have

## Counter-evidence sought
I looked for places where the current memory surface is already tightly hidden behind Spec Kit, but the top-level docs still present it as a parallel family rather than an implementation detail. [SOURCE: .opencode/command/README.txt:90-100]

## Follow-up questions for next iteration
If continuity becomes more guided, should the spec-folder template system also hide more of its internal classification from first-run users?
