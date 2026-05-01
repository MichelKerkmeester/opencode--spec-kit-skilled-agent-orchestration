# Iteration 030 - Add Dynamic Help, Progress, And Session Status

## Research question
Does `system-spec-kit` need better dynamic help, progress, and session-status affordances so operators can understand the system without reading multiple static README-style documents?

## Hypothesis
The external repo will show that lightweight dynamic help and progress surfaces are one of its most transferable UX wins, even though `system-spec-kit` already has richer internal state.

## Method
Compared local command documentation and status-oriented surfaces to the external repo's help and progress commands plus user guide framing.

## Evidence
- The local command ecosystem is documented through several static READMEs and command documents, which are informative but require manual navigation. [SOURCE: .opencode/command/README.txt:36-60] [SOURCE: .opencode/command/spec_kit/README.txt:41-45] [SOURCE: .opencode/command/memory/README.txt:36-52]
- Some local status or health capabilities exist, but they are specialized and split across memory management, resume, dashboards, and validator outputs. [SOURCE: .opencode/command/memory/manage.md:33-61] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:113-210]
- The external repo exposes dynamic help and progress as first-class commands that explain available workflows and current state in plain language. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:31-107] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]
- The external user guide works because those dynamic surfaces complement the static docs instead of forcing users to rely on documentation alone. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/USER_GUIDE.md:26-62]

## Analysis
This is a quality-of-life finding, but it is real. `system-spec-kit` already has enough state to answer common operator questions such as "what commands matter right now?", "what phase am I in?", and "what is blocked?" The problem is packaging and discoverability. The external repo gives users live orientation surfaces, which keeps them from spelunking through docs during active work. `system-spec-kit` should do the same with generated or state-aware help and status views.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Rely heavily on static docs plus specialized subsystem outputs.
- **External repo's approach:** Offer live help and progress commands that summarize the system in context.
- **Why the external approach might be better:** It keeps the operator oriented without requiring deep prior knowledge of the command taxonomy.
- **Why system-spec-kit's approach might still be correct:** Static docs are still needed as durable references and implementation detail repositories.
- **Verdict:** ADD
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** Add generated help, progress, and session-status surfaces derived from the existing command and packet state.
- **Blast radius of the change:** medium
- **Migration path:** Start with a dynamic help command and a packet/session status report, then connect them to lifecycle routing later.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators often consult several static docs or specialized tools to understand what is available and what is happening.
- **External repo's equivalent surface:** Operators can ask for help or progress and get a current, narrative answer.
- **Friction comparison:** The local repo has richer machinery but poorer discoverability. The external repo is easier to operate day-to-day because orientation is a command, not a scavenger hunt.
- **What system-spec-kit could DELETE to improve UX:** Delete the assumption that static README taxonomy is enough for command discovery and in-flight orientation.
- **What system-spec-kit should ADD for better UX:** Add dynamic help, progress, and session-status surfaces backed by existing command metadata and packet state.
- **Net recommendation:** ADD

## Conclusion
confidence: medium

finding: `system-spec-kit` should add dynamic help, progress, and session-status surfaces so operators can discover commands and understand current state without stitching together multiple static docs.

## Adoption recommendation for system-spec-kit
- **Target file or module:** command/help/status surfaces, command metadata, packet reporting
- **Change type:** new UX capability
- **Blast radius:** medium
- **Prerequisites:** identify canonical sources of truth for command inventory and packet/session state
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for evidence that the current static docs already provide the same just-in-time guidance, but the existing materials are reference-oriented rather than state-aware. [SOURCE: .opencode/command/README.txt:142-168]

## Follow-up questions for next iteration
No further iterations remain in Phase 3. The next step is synthesis across all 30 iterations.
