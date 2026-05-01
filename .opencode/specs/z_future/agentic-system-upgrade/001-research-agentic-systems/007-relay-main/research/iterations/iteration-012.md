# Iteration 012 — Two-Lane State Architecture

Date: 2026-04-10

## Research question
Should `system-spec-kit` pivot its memory architecture away from one heavy capture pipeline toward a split between lightweight runtime continuity and curated durable semantic memory?

## Hypothesis
Relay's small continuity and replay mechanisms expose that Public currently asks one memory pipeline to solve two different problems.

## Method
Read Relay's replay buffer, continuity tests, transport event buffering, and workspace registry behavior; then compared them with Public's `generate-context` save pipeline, metadata enrichment, quality rules, and post-save review flow.

## Evidence
- Relay keeps reconnect continuity small and purpose-built: a ring buffer stores recent events with sequence numbers and replay-on-reconnect behavior. [SOURCE: external/src/replay_buffer.rs:1-14] [SOURCE: external/src/replay_buffer.rs:23-45] [SOURCE: external/src/replay_buffer.rs:47-95]
- The transport layer separately buffers broker events in memory, tracks `sinceSeq`, reconnects automatically, and exposes query helpers for recent events. [SOURCE: external/packages/sdk/src/transport.ts:5-9] [SOURCE: external/packages/sdk/src/transport.ts:31-35] [SOURCE: external/packages/sdk/src/transport.ts:43-56] [SOURCE: external/packages/sdk/src/transport.ts:97-159] [SOURCE: external/packages/sdk/src/transport.ts:187-215]
- Continuity persistence is intentionally lightweight: Relay writes per-agent JSON files containing prior task, summary, and recent messages, then injects a short continuity block on the next spawn. [SOURCE: external/tests/continuity.rs:40-81] [SOURCE: external/tests/continuity.rs:152-196] [SOURCE: external/tests/continuity.rs:241-257]
- Relay also keeps workspace identity in a small local registry file under `.relay/workspaces.json`, separate from rich runtime state or documentation. [SOURCE: external/packages/sdk/src/relay.ts:440-498] [SOURCE: external/packages/sdk/src/relay.ts:523-535]
- Public's `generate-context` pipeline is optimized for durable capture: structured session JSON, learning delta, spec routing, and indexable ANCHOR output. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-79] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:85-125]
- Public then layers memory classification/decay metadata, dedup context, and evidence shaping on top of the same save flow. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:76-127] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:129-176]
- The same durable path is guarded by 14 quality rules plus post-save drift review and telemetry, which is appropriate for semantic memory but expensive for routine loop continuity. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:23-45] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-172] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:904-1004] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:8-24] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:66-78]

## Analysis
Relay does not solve durable semantic retrieval the way Public does, so this is not an argument to delete Spec Kit Memory. The stronger signal is architectural separation. Relay uses tiny continuity artifacts for runtime recovery and transport continuity, while Public's memory stack is designed for high-trust, indexed knowledge capture. Those are both valid needs, but collapsing them into one conceptual subsystem makes simple loop recovery feel heavier than it should.

## Conclusion
confidence: high
finding: Public should pivot to a two-lane state model: lightweight continuity artifacts for resumability and loop recovery, plus the existing curated memory pipeline for durable semantic recall. The durable memory system stays; its scope gets narrower and clearer.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, memory save/index design, deep-loop state packets, handover/continuation surfaces
- **Change type:** architectural shift
- **Blast radius:** architectural
- **Prerequisites:** define which artifacts are ephemeral continuity, which are durable semantic memories, and when one graduates into the other
- **Priority:** must-have (prototype later)

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** One memory-heavy mental model spans session capture, context preservation, semantic indexing, quality gating, and sometimes de facto continuity.
- **External repo's approach:** Runtime continuity is intentionally cheap and localized: replay buffer, event buffering, per-agent continuity JSON, small workspace registry.
- **Why the external approach might be better:** It keeps fast recovery and resumability simple while reserving heavier validation/indexing machinery for information that truly deserves durable recall.
- **Why system-spec-kit's approach might still be correct:** Public's work is governance-heavy and audit-heavy, so a stronger durable memory path is justified for canonical summaries and cross-session recall.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce an explicit continuity lane for loop resumes, packet handoff state, and small session summaries; reserve `generate-context.js` plus V1-V14 plus post-save review for promoted, durable research/decision/implementation memories only.
- **Blast radius of the change:** architectural
- **Migration path:** Keep current memory saves intact, add a parallel continuity artifact contract first, migrate deep-loop resume/handover flows to continuity files, then narrow durable-memory usage to closeout or milestone saves.

## Counter-evidence sought
Looked for evidence that Relay's lightweight continuity also supports rich semantic recall or governance-heavy memory quality enforcement; it does not, which reinforces that the best move is separation rather than replacement.

## Follow-up questions for next iteration
- Which current Spec Kit flows are continuity problems masquerading as memory problems?
- Should continuity live inside phase folders, hidden runtime folders, or both?
- What promotion rules should move continuity artifacts into durable memory?
