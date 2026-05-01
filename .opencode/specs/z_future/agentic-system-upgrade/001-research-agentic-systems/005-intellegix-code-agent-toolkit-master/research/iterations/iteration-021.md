# Iteration 021 — Merge Lifecycle Commands Into One Profile-Driven Entry Surface

Date: 2026-04-10

## Research question
Does the external repo's orchestration surface show that `system-spec-kit` should stop exposing separate `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete` commands as the primary lifecycle model?

## Hypothesis
Yes. The local lifecycle split is internally coherent, but it leaks too much workflow machinery into the operator experience. A single primary command with explicit profiles would better match the external repo's lower-friction entry surface.

## Method
I compared the local lifecycle command prompts and their setup blocks against the external repo's orchestration entry points. I focused on how many operator-visible modes, questions, and workflow concepts each system asks a human to carry.

## Evidence
- `[SOURCE: .opencode/command/spec_kit/plan.md:7-21]` The planning command starts by teaching a markdown-versus-YAML ownership split before any task work begins.
- `[SOURCE: .opencode/command/spec_kit/plan.md:31-138]` The planning flow exposes a large consolidated-question protocol with up to nine setup questions and multiple feature flags.
- `[SOURCE: .opencode/command/spec_kit/implement.md:7-18]` The implementation command repeats the YAML-first setup model as a separate entry surface.
- `[SOURCE: .opencode/command/spec_kit/implement.md:77-120]` The implementation command asks its own consolidated setup block even after planning has already happened.
- `[SOURCE: .opencode/command/spec_kit/complete.md:7-21]` The completion command repeats the same execution-protocol framing yet again.
- `[SOURCE: .opencode/command/spec_kit/complete.md:198-229]` The full lifecycle command then adds still more mode flags, including `:with-research`, `:with-phases`, and `:auto-debug`.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator.md:1-18]` The external repo presents one main single-loop execution entry point with a crisp role boundary and a smaller public concept count.
- `[SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/commands/orchestrator-new.md:1-16]` The external repo handles greenfield variation with a second specialized entry point rather than splitting the whole lifecycle into three public phases.

## Analysis
The local design is more explicit, but it is explicit in the wrong place. The user is being asked to think about plan versus implement versus complete, YAML ownership, execution mode, dispatch mode, research intent, and phase decomposition all at the command boundary. The external repo still has meaningful lifecycle differences, but it hides more of them behind a smaller set of entry points. That matters because most operator friction is created before any actual work starts.

The best import from the external repo is not "use exactly one command for everything." It is "make the operator choose the outcome, not the internal engine." `system-spec-kit` can keep separate internal workflows, but the public surface should be one primary lifecycle command with profiles like `new-work`, `continue-bound-work`, and `full-lifecycle`, rather than three sibling commands that each restate the machine room.

## Conclusion
confidence: high

finding: `system-spec-kit` should merge the public `plan` / `implement` / `complete` lifecycle into one profile-driven entry surface, while keeping the current internal workflow separation behind that surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/plan.md`, `.opencode/command/spec_kit/implement.md`, `.opencode/command/spec_kit/complete.md`
- **Change type:** should-have
- **Blast radius:** operator-surface
- **Prerequisites:** define profile vocabulary and a compatibility path for existing slash commands
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Users must pick among three lifecycle commands and absorb YAML/workflow ownership language before the system does useful work.
- **External repo's equivalent surface:** The external repo centers the operator on a small orchestration surface, then varies behavior behind the scenes with command-specific internals.
- **Friction comparison:** `system-spec-kit` has lower ambiguity but higher cognitive load. The external repo asks fewer lifecycle questions up front and keeps the public mental model narrower.
- **What system-spec-kit could DELETE to improve UX:** Delete the operator-facing requirement to choose `plan` versus `implement` versus `complete` as the first design decision for most tasks.
- **What system-spec-kit should ADD for better UX:** Add one primary lifecycle command with explicit operating profiles and contextual defaults.
- **Net recommendation:** MERGE

## Counter-evidence sought
I looked for evidence that the external repo needs three separate user-facing lifecycle commands to achieve its orchestration goals. I did not find an equivalent split.

## Follow-up questions for next iteration
- Should `/spec_kit:resume` become the default continuation profile of the merged lifecycle surface?
- Which existing lifecycle flags can stay internal-only once profiles exist?
- How much backward-compatibility aliasing is worth keeping for old slash commands?
