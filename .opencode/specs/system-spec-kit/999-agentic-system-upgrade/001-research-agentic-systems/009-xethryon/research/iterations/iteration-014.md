# Iteration 014 — Deferred Reconsolidation Only Helps If Pending State Survives Process Boundaries

Date: 2026-04-10

## Research question
If `system-spec-kit` adopts more of Xethryon's deferred consolidation cadence, what must change architecturally so the feature is safe and trustworthy?

## Hypothesis
The cadence idea is good, but Xethryon's implementation is only safe enough for a lightweight fork because key state is module-local. Spec Kit should only adopt deferred reconsolidation if pending state, scan state, and replay state become durable and inspectable.

## Method
I reviewed Xethryon's AutoDream and lock implementation, then compared it to Spec Kit's reconsolidation bridge and save-time transaction model.

## Evidence
- Xethryon gates AutoDream by elapsed hours and recent memory-file changes, then either executes consolidation immediately or sets `_dreamPending = true` when no `llmCall` is available. `_lastSessionScanAt`, `_config`, and `_dreamPending` all live in module state. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:25-42] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:85-186]
- The lock file stores holder PID and last-consolidated time, but it does not persist the semantic "pending dream" state beyond the process that set it. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/consolidationLock.ts:35-115]
- Xethryon's post-turn hook fires extraction and AutoDream in the background after the main turn completes, which means the operator does not get an explicit durable pending artifact when consolidation is deferred. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryHook.ts:155-171]
- Spec Kit's reconsolidation bridge already operates on indexed memories, checkpoint guards, structured warnings, and transaction-wrapped writes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:161-187] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:188-312]

## Analysis
Phase 1 correctly identified deferred reconsolidation cadence as one of the best import candidates from Xethryon. Phase 2 shows the missing architectural constraint: deferred work is only trustworthy if the system can survive process restarts and still explain what is pending. Xethryon's module-local pending flag is acceptable for a fast, UX-oriented fork, but it would be too opaque for Spec Kit's operator-facing memory system. In Spec Kit, deferred reconsolidation should look like a durable queue or ledger-backed state machine, not a hidden in-memory toggle.

## Conclusion
confidence: high

finding: adopt the cadence, not the state model. Deferred reconsolidation is worth pursuing only if pending work, last scan, and replay eligibility are stored durably and surfaced to the operator.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** reconsolidation happens on explicit save-time pathways with checkpoints, transactions, and structured warnings.
- **External repo's approach:** time-and-activity-gated consolidation runs from a background post-turn hook, with key gating and pending state kept in module memory.
- **Why the external approach might be better:** it automatically batches noisy memory growth and removes manual consolidation pressure from the operator.
- **Why system-spec-kit's approach might still be correct:** save-time pathways are auditable and easier to reason about. Hidden deferred state would be dangerous unless made durable.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a durable reconsolidation scheduler state to the memory database or mutation ledger, including `pending`, `last_scanned_at`, `eligibility_reason`, and `last_attempt_result`, and expose it through maintenance/reporting tools.
- **Blast radius of the change:** large
- **Migration path:** keep current save-time reconsolidation as the baseline, then add a shadow-only scheduler that records eligibility decisions before any automatic reconsolidation is allowed to execute.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Change type:** modified existing
- **Blast radius:** large
- **Prerequisites:** durable scheduler state model, maintenance visibility, and checkpoint-safe replay semantics
- **Priority:** should-have

## Counter-evidence sought
I looked for a persisted Xethryon state file that would let a new process understand whether a deferred dream was waiting. I found lock metadata, but not a durable pending-work record.

## Follow-up questions for next iteration
- Does Xethryon's swarm runtime reveal a better orchestration architecture for Spec Kit, or is it mostly a second subagent layer over mechanisms OpenCode already had?
