# Iteration 2: Traceability of natural Tier3 prompt labeling and tests

## Focus
Followed the natural-routing save path and the two focused handler tests that exercise Tier3 transport and fail-open fallback. The write path reaches fetch, but the prompt metadata still mislabels natural classification mode and the tests never look inside the request body.

## Findings

### P0

### P1
- **F002**: Natural Tier3 saves are sent with SAVE_MODE route-as — `mcp_server/handlers/memory-save.ts:1166` — The natural routing path sets `save_mode: `route-as`` even when `routeAs` is absent, so `buildTier3Prompt()` advertises `SAVE_MODE` as an override-style mode at `mcp_server/lib/routing/content-router.ts:1223-1224`; the natural Tier3 handler test at `mcp_server/tests/handler-memory-save.vitest.ts:1246-1257` proves this branch runs without ever supplying an explicit override.

{"type":"claim-adjudication","findingId":"F002","claim":"Natural Tier3 save classification is sent to the model as SAVE_MODE=route-as even when no operator override exists.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166",".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1246",".opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1223"],"counterevidenceSought":"I re-read the natural-routing tests and the handler path to see whether another field corrected the prompt, but the natural Tier3 test only proves fetch was called and the write succeeded.","alternativeExplanation":"The model may still infer natural routing from the rest of the prompt, but the explicit save_mode field is still false and can bias ambiguous classifications.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if SAVE_MODE=route-as is documented as a generic canonical-routing label rather than an explicit override signal."}

### P2
- **F003**: Focused Tier3 handler tests never inspect the prompt body — `mcp_server/tests/handler-memory-save.vitest.ts:1246` — The natural-routing and fail-open tests prove that `fetch()` is called and the routed write succeeds, but they never decode the request JSON to assert `PACKET_KIND` or `SAVE_MODE`, which is why the prompt-metadata regressions above can pass green.

## Ruled Out
- The passing Tier3 transport tests fully validate prompt integrity: ruled out by the absence of any request-body assertions in `tests/handler-memory-save.vitest.ts:1246-1257` and `:1282-1293`.

## Dead Ends
- None.

## Recommended Next Focus
Rule out security and transport-layer issues in the Tier3 HTTP path so the remaining review can focus on stabilization.

## Assessment
- New findings ratio: 0.67
- Dimensions addressed: traceability, maintainability
- Novelty justification: The second pass found one additional prompt-contract defect and one non-blocking coverage gap in the Tier3 save-handler tests.
