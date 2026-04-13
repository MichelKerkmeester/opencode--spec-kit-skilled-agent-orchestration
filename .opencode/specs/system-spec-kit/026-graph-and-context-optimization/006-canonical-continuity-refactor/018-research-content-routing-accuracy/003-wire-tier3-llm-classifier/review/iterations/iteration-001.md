# Iteration 1: Correctness on Tier3 integration context fields

## Focus
Reviewed the newly added Tier3 injection path in `memory-save.ts` and compared the handler-provided session metadata with the prompt fields consumed by `buildTier3Prompt()`. The Tier3 transport is wired, but one of the context fields is systematically wrong before the model ever sees the chunk.

## Findings

### P0

### P1
- **F001**: Tier3 prompt hardcodes phase context for non-phase packets — `mcp_server/handlers/memory-save.ts:1165` — The handler derives `packet_kind` from `parsed.specFolder.includes('/')`, so root research/remediation packets lose their real kind before `buildTier3Prompt()` forwards `PACKET_KIND` at `mcp_server/lib/routing/content-router.ts:1222-1224`; the 018 parent packet is explicitly `type: research` in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:5`.

{"type":"claim-adjudication","findingId":"F001","claim":"The Tier3 save-handler wiring mislabels non-phase packets as phase before sending PACKET_KIND to the model.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1165",".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1222",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md:5"],"counterevidenceSought":"I checked the router implementation itself for any local use of packet_kind and found it is only forwarded into the Tier3 prompt, so the defect is limited to LLM-routed paths rather than Tier1 or Tier2.","alternativeExplanation":"If the model completely ignores PACKET_KIND, the practical impact would be smaller, but the prompt still supplies a systematically wrong context field for research and remediation packets.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if packet_kind is intentionally phase-only metadata for canonical save prompts and the prompt contract is updated to say so."}

### P2

## Ruled Out
- Tier3 is still unreachable from the save path: ruled out by `memory-save.ts:1144-1172` plus the passing natural-routing handler tests at `tests/handler-memory-save.vitest.ts:1207-1257`.
- Root research packets are forwarded to Tier3 with an accurate packet_kind: ruled out by `memory-save.ts:1165`, which reduces any slash-containing specFolder to `phase`, while the 018 root packet is explicitly `type: research` in `018.../spec.md:5`.

## Dead Ends
- None.

## Recommended Next Focus
Check whether natural Tier3 calls also misreport save_mode and whether the focused tests assert prompt payload integrity.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, traceability
- Novelty justification: The first handler-level read found one new correctness defect in the Tier3 context payload that is not exercised by Tier1 or Tier2.
