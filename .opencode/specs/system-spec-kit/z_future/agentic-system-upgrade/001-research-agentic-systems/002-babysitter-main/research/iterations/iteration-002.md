# Iteration 002 — Journal-Head Resume Fidelity

Date: 2026-04-09

## Research question
Would journal-head-based replay caches make `session_resume` more deterministic than the current freshness-only cached-summary flow?

## Hypothesis
Babysitter's replay cache is stronger because it is tied to the journal head, while `session_resume` currently validates freshness and transcript identity but not a stepwise execution ledger.

## Method
I traced Babysitter's replay-engine initialization and state-cache rebuild logic, then compared it with `system-spec-kit`'s cached-summary evaluation and `session_bootstrap` recovery hints.

## Evidence
- `createReplayEngine` loads the journal, builds the effect index, resolves a state-cache snapshot, and reconstructs recorded log sequences before creating the live process context. [SOURCE: external/packages/sdk/src/runtime/replay/createReplayEngine.ts:34-92]
- If the cache is missing, corrupt, or its journal head no longer matches the journal, Babysitter rebuilds the cache immediately and records the rebuild reason. [SOURCE: external/packages/sdk/src/runtime/replay/createReplayEngine.ts:95-129] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:70-79] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:140-160]
- The current `session_resume` cached-summary path validates schema version, transcript fingerprint, producer metadata, and freshness window, but it does not anchor continuity to a step ledger or journal head. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:41-84] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-299]
- `session_bootstrap` currently nudges callers toward `code_graph_scan`, `session_resume`, and `memory_context`, which confirms recovery is payload-driven and heuristic rather than replay-driven. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-126] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194-205]

## Analysis
`system-spec-kit` already has a better-than-average continuity model because it verifies transcript identity and freshness before reusing cached summaries. That is a real strength and should not be replaced. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-299]

Babysitter adds a different guarantee: replay state is only trusted when the derived cache still matches the latest journal head. That closes a class of problems where freshness is fine but the execution story is incomplete or partially drifted. For long-running packet workflows, especially research and review, journal-head continuity would be more deterministic than freshness-only continuity. [SOURCE: external/packages/sdk/src/runtime/replay/createReplayEngine.ts:95-129] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:70-79] [SOURCE: external/packages/sdk/src/runtime/replay/stateCache.ts:140-160]

## Conclusion
confidence: high

finding: Babysitter's replay model should influence `system-spec-kit` resume design, but as an additive layer, not a replacement for the current transcript-fingerprint checks. The current cached-summary flow verifies "same transcript, still fresh"; Babysitter verifies "same execution history, same replay boundary." Combining both would materially improve deterministic resume for multi-step packet workflows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` plus a new journal-head snapshot helper under `.opencode/skill/system-spec-kit/mcp_server/lib/session/`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define which workflows emit resume-worthy execution events and how journal heads map onto existing session snapshots
- **Priority:** should-have

## Counter-evidence sought
I looked for a current `system-spec-kit` mechanism that ties cached continuity to a monotonic execution ledger and found transcript-identity validation but no journal-head equivalent. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-299]

## Follow-up questions for next iteration
- Are current gates in `system-spec-kit` enforced strongly enough to justify replay-backed continuity?
- Which packet workflows need replay-backed continuity most urgently?
- Would replay-backed state reduce ambiguity around auto mode versus confirm mode approvals?
