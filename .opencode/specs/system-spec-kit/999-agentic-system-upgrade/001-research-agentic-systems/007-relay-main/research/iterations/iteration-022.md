# Iteration 022 — Add a Unified Context Concierge

Date: 2026-04-10

## Research question
Are the `/memory:*` and `/spec_kit:*` surfaces too parallel, and does `system-spec-kit` need a simpler way to unify search, resume, and save from the operator's point of view?

## Hypothesis
Public's memory capabilities are powerful but spread across too many commands and subcommands, while Relay presents coordination and messaging as one continuous surface.

## Method
Compared Public's memory command taxonomy, tool coverage, and `resume` contract with Relay's plugin/MCP surface and its two-mode Python SDK packaging.

## Evidence
- Public exposes 4 top-level memory commands: `search`, `learn`, `manage`, and `save`. [SOURCE: .opencode/command/memory/README.txt:58-66]
- `/memory:manage` alone owns 11 subcommands, and the memory command set maps 33 MCP tools across layers L1-L7. [SOURCE: .opencode/command/memory/README.txt:225-299]
- Public explicitly documents `/memory:search` and `/spec_kit:resume` as different surfaces: `search` is knowledge lookup, while `resume` reconstructs interrupted-session state. [SOURCE: .opencode/command/memory/README.txt:306-320]
- The integrated `system-spec-kit` skill also describes 4 memory commands plus `/spec_kit:resume` as the session recovery owner. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:560-566]
- `resume` itself already mixes handover files, `session_bootstrap()`, `memory_context()`, `memory_search()`, and checklist/task fallbacks into one recovery chain. [SOURCE: .opencode/command/spec_kit/resume.md:250-294]
- Relay's plugin keeps the operator in one session surface where slash commands and plain English route to the same MCP-backed messaging tools. [SOURCE: external/docs/plugin-claude-code.md:55-87]
- Relay's Python SDK packages the user choice as only two modes: `Orchestrate` or `Communicate`. [SOURCE: external/packages/sdk-py/README.md:3-6] [SOURCE: external/packages/sdk-py/README.md:28-83]

## Analysis
Public's internal separation makes architectural sense: saving context, managing the database, and resuming work are not identical operations. The UX problem is that the operator has to learn that separation early. Relay shows a better front-door pattern: keep the primitives available, but let the user stay inside one conversational "workspace" mental model unless they explicitly need admin operations.

## Conclusion
confidence: high
finding: Public should add a unified context concierge surface that handles "find what matters, recover the right state, and save when useful" without forcing operators to choose between `/memory:*` and `/spec_kit:*` namespaces up front.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/resume.md`, `.opencode/command/memory/README.txt`, command help/onboarding surfaces
- **Change type:** new capability addition
- **Blast radius:** medium
- **Prerequisites:** define which operations stay advanced/admin-only and which become part of the unified front door
- **Priority:** should-have (prototype later)

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators choose between a `spec_kit` session-recovery path and a parallel `memory` command family with 33 mapped tools and many subcommands.
- **External repo's equivalent surface:** Relay keeps one active coordination surface per session and exposes tools beneath it, while its SDK frames the choice as just `Orchestrate` versus `Communicate`.
- **Friction comparison:** Public has lower ambiguity for internals but higher onboarding cost. Relay reduces the "which namespace owns this?" question by keeping the user's mental model centered on one active workspace.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that common "find / continue / remember" tasks require operators to know the difference between `/memory:search`, `/memory:save`, and `/spec_kit:resume`.
- **What system-spec-kit should ADD for better UX:** Add a unified context concierge, likely under the `spec_kit` family, that fronts common retrieval/recovery/save actions while keeping raw memory admin commands for experts.
- **Net recommendation:** ADD

## Counter-evidence sought
Looked for a single existing Public command already serving as a unified context concierge; `resume` comes closest, but it is still framed as recovery-only rather than a general workspace context surface.

## Follow-up questions for next iteration
- Should the unified surface live under `/spec_kit:*`, `/memory:*`, or both via aliases?
- Which advanced memory subcommands should remain intentionally expert-only?
- Can the command docs be reorganized so the operator sees intent-first tasks before tool ownership?
