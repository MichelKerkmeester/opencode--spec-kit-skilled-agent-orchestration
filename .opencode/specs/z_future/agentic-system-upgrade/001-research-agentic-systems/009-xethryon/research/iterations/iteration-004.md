# Iteration 004 — AutoDream Versus Reconsolidation-on-Save

Date: 2026-04-09

## Research question
Should `system-spec-kit` adopt Xethryon's time-and-activity-gated AutoDream model on top of its existing reconsolidation-on-save path?

## Hypothesis
Spec Kit already has better safety rails than Xethryon, but it lacks an explicit "wait, then consolidate accumulated memory activity" cadence that could reduce fragmentation across long research runs.

## Method
I traced Xethryon's `autoDream.ts` and `consolidationLock.ts`, then compared those gates with Spec Kit's reconsolidation bridge and current opt-in safety rules.

## Evidence
- Xethryon's AutoDream fires only after a five-part gate: feature enabled, 24-hour elapsed time, scan throttle, enough recent memory changes, and an inter-process lock. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:25-35] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:76-125]
- If an LLM callback is available, AutoDream performs consolidation immediately; otherwise it marks the run as pending for a later `/dream` command. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/autoDream.ts:132-167]
- The consolidation lock encodes both holder PID and last-consolidated timestamp, with stale-holder detection and rollback behavior. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/consolidationLock.ts:1-18] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/consolidationLock.ts:44-115]
- Spec Kit already has reconsolidation-on-save and assistive similarity thresholds, but it runs in the `memory_save` path and is gated by feature flags plus a required `pre-reconsolidation` checkpoint. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:35-62] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:161-186]
- When reconsolidation does run, Spec Kit searches similar memories, applies scope governance filters, and performs transactional writes, which is materially safer than Xethryon's file-level consolidation flow. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:188-260]

## Analysis
Xethryon's AutoDream is weaker on governance than Spec Kit, but stronger on cadence. It recognizes that memory quality degrades not only at save time, but also after enough time and enough accumulated activity have passed. Spec Kit's current reconsolidation bridge is safer and more structured, yet it is tied to a save event. For long-running research and review packets, that means there is no first-class "deferred cleanup" moment unless a caller triggers another save or writes manual maintenance logic. The best adoption is therefore not Xethryon's implementation, but its gate shape: time + activity + lock + explicit pending state.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep its current checkpointed, transactional reconsolidation engine, but add an AutoDream-style scheduler that decides when accumulated memory activity should be reconsidered. Xethryon's cadence logic is worth porting; its file-level consolidation execution is not.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define where deferred reconsolidation state is persisted and how operators can observe or force it
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing time-based or session-activity-based reconsolidation trigger in Spec Kit. I found save-time reconsolidation and assistive review thresholds, but not a deferred cadence comparable to AutoDream.

## Follow-up questions for next iteration
- How should a Spec Kit equivalent expose deferred consolidation without hiding work from operators?
- Can a reflection-like pre-publication gate improve deep-research quality the same way AutoDream improves memory hygiene?
- Would a repo-level orientation memory be safer if it only updated on deferred reconsolidation windows?
