# Iteration 020 — Visible Mode Hints Are Worth Borrowing From Xethryon's Status Bar

Date: 2026-04-10

## Research question
What is the smallest UX improvement `system-spec-kit` should borrow from Xethryon after rejecting the bigger architectural pivots?

## Hypothesis
The most portable improvement is visible mode guidance: a compact indication of the current role/constraint/next action at startup or resume time. This borrows Xethryon's clarity without adopting its hidden autonomy model.

## Method
I revisited Xethryon's visible mode/status surfaces and compared them with Spec Kit's startup/recovery and workflow docs.

## Evidence
- Xethryon's fork explicitly customized the prompt status bar and session footer to show build, agent codename, and model in a compact, always-visible surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_MODS.md:47-68]
- The README also turns agent modes into a simple, user-facing table with clear purposes. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:70-82]
- Spec Kit already has startup/recovery surfaces (`session_bootstrap()` and `session_resume()`) and presents next-step continuation behavior in its docs, but that guidance is more descriptive than compact. [SOURCE: .opencode/skill/system-spec-kit/README.md:93-99] [SOURCE: .opencode/skill/system-spec-kit/README.md:170-179] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:103-105]
- The current gate system is rich, but its operator-facing explanation lives mostly in long-form docs rather than a concise runtime hint surface. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-106]

## Analysis
By the end of Phase 2, the pattern is consistent: Xethryon's architecture is usually not the right thing to import directly, but its visible UX compression often is. A compact runtime hint surface would help Spec Kit feel less ceremonious without giving up any of its explicit governance. The content should stay simple: current spec folder, current workflow phase or mode, strongest active constraint, and the next best action.

## Conclusion
confidence: medium

finding: the best small UX import from Xethryon is a concise "status strip" for startup and resume surfaces. This would make Spec Kit easier to operate without weakening its current architecture.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** rich startup/recovery information, but mostly expressed in prose and structured payloads rather than a compact visible strip.
- **External repo's approach:** compact always-visible status language for current mode and model.
- **Why the external approach might be better:** users can orient themselves immediately without reading long docs or scanning large payloads.
- **Why system-spec-kit's approach might still be correct:** richer payloads are still necessary for detail and recovery. The gap is presentation, not architecture.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a compact status summary to `session_bootstrap()` and `session_resume()` responses with `specFolder`, `taskState`, `activeConstraint`, and `recommendedNextAction`.
- **Blast radius of the change:** medium
- **Migration path:** additive only; preserve full payloads and place the status strip near the top of the response.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a stable summary schema that does not duplicate conflicting fields from the full payload
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for a smaller UX import from Xethryon with similar leverage. Most other candidates either duplicated existing Spec Kit behavior or required importing hidden runtime complexity.

## Follow-up questions for next iteration
- none; this concludes the Phase 2 research pass for `009-xethryon`
