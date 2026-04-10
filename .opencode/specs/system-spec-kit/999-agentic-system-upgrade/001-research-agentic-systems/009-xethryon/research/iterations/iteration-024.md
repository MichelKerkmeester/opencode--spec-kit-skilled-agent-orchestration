# Iteration 024 — `context-prime` Is Better As Startup Behavior Than As A Named Surface

Date: 2026-04-10

## Research question
Is `system-spec-kit` carrying too much visible agent granularity, especially around `@context` versus `@context-prime`?

## Hypothesis
Yes. `@context-prime` is useful as an internal bootstrap behavior, but it does not need to remain a separately legible role for most operators.

## Method
I compared the local orchestrator/context stack with Xethryon's smaller visible role map and autonomy-driven role switching.

## Evidence
- `@orchestrate` explicitly delegates to `@context-prime` at workflow start, then relies on `@context` for exploration. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:49-60] [SOURCE: .opencode/agent/orchestrate.md:158-183]
- `@context` is a retrieval-first exploration role with broader search and evidence responsibilities. [SOURCE: .opencode/agent/context.md:25-31] [SOURCE: .opencode/agent/context.md:45-53] [SOURCE: .opencode/agent/context.md:133-168]
- `@context-prime` is narrowly about fast bootstrap, session health, and compact startup orientation. [SOURCE: .opencode/agent/context-prime.md:22-39] [SOURCE: .opencode/agent/context-prime.md:57-87]
- Xethryon exposes a smaller visible role set: build, plan, explore, coordinator, and verification. There is no separately named "priming" role in the operator-facing map. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:140-158]
- Xethryon's runtime handles prompt assembly and orientation through the session system instead of giving bootstrap its own visible agent identity. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/system.ts:66-115]

## Analysis
This is a classic case of implementation detail leaking into the mental model. `@context-prime` exists because bootstrap work is real, not because users benefit from reasoning about a second context agent. Xethryon's smaller role vocabulary feels lighter not because it does less work, but because more of the startup work is absorbed into runtime behavior.

`system-spec-kit` should keep explicit bootstrap outputs, but the role itself can retreat from the main operator surface. The visible role should be `@context`; the priming step should be what happens when context is first established.

## UX / System Design Analysis

- **Current system-spec-kit surface:** separate named agents for bootstrap context and exploration context.
- **External repo's equivalent surface:** startup orientation is hidden behind the session layer; users mainly see the smaller role vocabulary.
- **Friction comparison:** `system-spec-kit` asks operators to learn an extra distinction that mostly matters to the implementation, not to the user.
- **What system-spec-kit could DELETE to improve UX:** the need to think about `context-prime` as a first-class visible role in normal workflows.
- **What system-spec-kit should ADD for better UX:** clearer startup output from bootstrap/resume so the benefit of priming remains visible even if the role itself becomes implicit.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: merge `@context-prime` into startup/bootstrap behavior and keep `@context` as the visible exploration role. This reduces mental overhead without losing the fast-prime behavior.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** separates bootstrap and exploration as two named roles.
- **External repo's approach:** keeps startup orientation mostly inside the session machinery.
- **Why the external approach might be better:** fewer role names and less exposed orchestration detail.
- **Why system-spec-kit's approach might still be correct:** explicit bootstrap outputs are still valuable for governed recovery and session health.
- **Verdict:** MERGE
- **If MERGE — concrete proposal:** keep the priming logic and outputs, but present it as startup behavior within bootstrap/resume rather than a separately taught role.
- **Blast radius of the change:** medium
- **Migration path:** first change documentation and routing language, then consider whether the separate agent file still needs to exist at all.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define what information must still be preserved in the startup payload after the role is de-emphasized
- **Priority:** should-have

## Counter-evidence sought
I looked for places where the separate identity of `@context-prime` clearly improves operator decision-making. The evidence mostly points to engineering clarity, not user clarity.

## Follow-up questions for next iteration
- Does the same "hide implementation detail" lesson apply to deep-research and deep-review loops, or do those agents need to stay explicit?
