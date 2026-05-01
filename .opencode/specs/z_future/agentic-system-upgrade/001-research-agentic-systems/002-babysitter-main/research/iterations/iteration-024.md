# Iteration 024 — Merge `@context-prime` Into The Continuity Stack

Date: 2026-04-10

## Research question
Are `@context-prime` and the broader context/recovery stack distinct enough to justify separate agent surfaces?

## Hypothesis
The bootstrap behavior is useful, but a standalone primer agent is likely exposing an internal implementation detail that Babysitter keeps inside its runtime and generated instruction layer.

## Method
I compared Spec Kit's orchestrator/context/context-prime routing with Babysitter's generated instruction context and hook-aware bootstrap handling.

## Evidence
- The orchestrator explicitly delegates first-turn bootstrap to `@context-prime` before normal work proceeds. [SOURCE: .opencode/agent/orchestrate.md:18-21] [SOURCE: .opencode/agent/orchestrate.md:95-99]
- `@context-prime` exists solely to run `session_bootstrap()`, optionally `session_health()`, and return a compact Prime Package in under 15 seconds. [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context-prime.md:57-65]
- `@context` already owns memory-first exploration, code-graph health, retrieval layering, and structured context-package delivery. [SOURCE: .opencode/agent/context.md:25-32] [SOURCE: .opencode/agent/context.md:43-53] [SOURCE: .opencode/agent/context.md:121-123]
- Babysitter resolves prompt context centrally, then composes harness-specific instructions from shared prompt parts; hook availability is detected in the SDK rather than via a separate primer persona. [SOURCE: external/packages/sdk/src/cli/commands/instructions.ts:4-20] [SOURCE: external/packages/sdk/src/cli/commands/instructions.ts:52-88] [SOURCE: external/packages/sdk/src/cli/commands/instructions.ts:206-223]
- Babysitter's critical rules even switch behavior based on whether hooks are active, but that decision is rendered into generated instructions rather than exposed as a separate operator-facing role. [SOURCE: external/packages/sdk/src/prompts/templates/critical-rules.md:27-45]
- Its human-facing wrapper surface stays small: create/run, resume, observe, doctor. [SOURCE: external/README.md:218-234]

## Analysis
`@context-prime` is not wrong. It captures a real need: fast, bounded startup recovery. But it is probably too granular as a named agent surface. The functionality overlaps heavily with `/spec_kit:resume`, `@context`, and session bootstrap itself, so the dedicated persona feels more like an internal optimization artifact than a concept users need to understand. [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context.md:25-32]

Babysitter handles the same class of problem lower in the stack. Prompt composition, hook detection, and harness context are runtime-managed, so the user does not meet a separate "primer" abstraction. That makes the surface easier to learn because there are fewer continuity concepts floating around. [SOURCE: external/packages/sdk/src/cli/commands/instructions.ts:206-223] [SOURCE: external/packages/sdk/src/prompts/templates/critical-rules.md:32-45]

The lesson is to keep bootstrap behavior, but merge it into the broader continuity stack rather than preserving a separate agent identity for it.

## UX / System Design Analysis

- **Current system-spec-kit surface:** First-turn recovery involves a dedicated `@context-prime` agent, a separate `@context` agent, and a separate `/spec_kit:resume` command, each covering part of continuity. [SOURCE: .opencode/agent/orchestrate.md:18-21] [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context.md:25-32]
- **External repo's equivalent surface:** Babysitter centralizes context generation and hook-aware behavior in the runtime/instruction layer, not in a separate bootstrap persona. [SOURCE: external/packages/sdk/src/cli/commands/instructions.ts:52-88] [SOURCE: external/packages/sdk/src/cli/commands/instructions.ts:206-223]
- **Friction comparison:** Spec Kit currently asks framework contributors and advanced operators to reason about three continuity mechanisms; Babysitter mostly presents one runtime surface that adapts itself.
- **What system-spec-kit could DELETE to improve UX:** Delete `@context-prime` as a separate named agent.
- **What system-spec-kit should ADD for better UX:** Add a bootstrap mode inside `/spec_kit:resume` or `@context`, so fast-start recovery remains available without a separate user-facing role.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge `@context-prime` into the broader continuity stack. Fast bootstrap is worth keeping, but a dedicated primer agent is an unnecessary extra abstraction on the operator surface.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Distinct bootstrap and full-context agents, plus a resume command. [SOURCE: .opencode/agent/orchestrate.md:18-21] [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context.md:43-53]
- **External repo's approach:** Runtime-owned prompt context and hook-aware instruction generation. [SOURCE: external/packages/sdk/src/cli/commands/instructions.ts:206-223] [SOURCE: external/packages/sdk/src/prompts/templates/critical-rules.md:32-45]
- **Why the external approach might be better:** It hides framework machinery and reduces the number of continuity concepts the user has to learn.
- **Why system-spec-kit's approach might still be correct:** A dedicated primer keeps first-turn work bounded and easy to audit.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Move `@context-prime` logic into `/spec_kit:resume` and let `@context` expose a `bootstrap` mode for orchestrator use.
- **Blast radius of the change:** medium
- **Migration path:** keep the agent as an internal alias first, switch orchestrator routing to the merged surface, then remove the separate public role after parity tests pass.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`, `.opencode/agent/context-prime.md`, `.opencode/agent/context.md`, `.opencode/command/spec_kit/resume.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define the merged bootstrap contract and output format
- **Priority:** should-have

## Counter-evidence sought
I looked for responsibilities unique to `@context-prime` beyond fast bootstrap, but its own contract is intentionally minimal and already overlaps with runtime bootstrap tools rather than with a separate domain capability. [SOURCE: .opencode/agent/context-prime.md:32-45]

## Follow-up questions for next iteration
- Should the LEAF iteration pattern itself be simplified away, or is it still a good operator-visible artifact?
- Does `@handover` earn its own role, or is it another continuity concern that should fold into resume/save?
- Which skills are valuable as separate surfaces versus better treated as internal routing details?
