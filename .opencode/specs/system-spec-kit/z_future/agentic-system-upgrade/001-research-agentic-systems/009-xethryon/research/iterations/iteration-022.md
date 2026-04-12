# Iteration 022 — `/memory:*` Should Stay Separate, But It Should Stop Feeling Parallel To The Main Story

Date: 2026-04-10

## Research question
Is the `/memory:*` command family awkwardly parallel to `/spec_kit:*`, or is that separation actually justified?

## Hypothesis
The separation is mostly justified. The real problem is discoverability and cross-linking, not that memory operations exist as a distinct power-user surface.

## Method
I compared the local memory command family, especially how it frames session recovery and management, against Xethryon's memory interaction model where most memory behavior is ambient and only a small explicit memory surface remains visible.

## Evidence
- The local memory README positions `/memory:save`, `/memory:search`, `/memory:manage`, and `/memory:learn` as a separate command group, while explicitly telling users to use `/spec_kit:resume` for recovery. [SOURCE: .opencode/command/memory/README.txt:38-52] [SOURCE: .opencode/command/memory/README.txt:61-131]
- `/memory:search` itself is framed as an analysis and retrieval tool, not a lifecycle command. [SOURCE: .opencode/command/memory/search.md:55-102] [SOURCE: .opencode/command/memory/search.md:113-162]
- Xethryon's visible memory surface is much smaller. Its operator-facing command layer leans on `/remember` while most memory behavior is injected through the session system and post-turn hooks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:192-225]
- In Xethryon's runtime, memory prompt loading and relevant-memory retrieval are part of the system prompt assembly instead of a separate user-visible lifecycle. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/system.ts:80-115]

## Analysis
`system-spec-kit` is serving two different jobs here: feature-workflow control and memory-system administration. Merging those into one command family would simplify the menu at the cost of making the main lifecycle harder to understand. Xethryon hides most memory machinery because its memory system is ambient and lightweight; Spec Kit exposes more because its memory substrate is richer and more inspectable.

The right fix is not command collapse. It is better signposting: lifecycle commands should point to the exact memory command when the user is leaving the "main story" and entering retrieval or memory-admin work.

## UX / System Design Analysis

- **Current system-spec-kit surface:** `/spec_kit:*` owns lifecycle work while `/memory:*` owns retrieval, save, analysis, and administration.
- **External repo's equivalent surface:** memory is mostly ambient; the user sees a much smaller explicit memory surface.
- **Friction comparison:** Xethryon has lower menu complexity, but it also exposes less memory control. `system-spec-kit` has more commands because it is offering real operator leverage over a governed subsystem.
- **What system-spec-kit could DELETE to improve UX:** the feeling that `/memory:*` is an equal alternative lifecycle rather than a specialist side-surface.
- **What system-spec-kit should ADD for better UX:** tighter cross-links from `/spec_kit:*` to the exact memory verb needed, plus clearer "when to leave the main workflow" guidance.
- **Net recommendation:** KEEP

## Conclusion
confidence: high

finding: do not merge `/memory:*` into `/spec_kit:*`. Keep memory as a distinct specialist surface and improve the guidance that explains when users should cross over into it.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit, separately documented memory commands with strong recovery linkage to `/spec_kit:resume`.
- **External repo's approach:** much smaller explicit memory surface backed by hidden ambient memory behaviors.
- **Why the external approach might be better:** fewer visible commands for casual users.
- **Why system-spec-kit's approach might still be correct:** richer memory tooling needs a discoverable admin/search surface, especially for governed retrieval and debugging.
- **Verdict:** KEEP
- **If KEEP — concrete proposal:** add better cross-references and "use this when..." language rather than restructuring the command family.
- **Blast radius of the change:** low
- **Migration path:** documentation-only first; revisit structure only if usage data shows persistent confusion.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/memory/README.txt`
- **Change type:** modified existing
- **Blast radius:** low
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for signs that memory commands were duplicating the lifecycle story. The docs consistently frame them as search/manage utilities, not as alternative end-to-end workflows.

## Follow-up questions for next iteration
- If the command split is mostly justified, where is the real documentation friction inside spec folders and templates?
