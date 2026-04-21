# Iteration 001 - correctness

## Dispatcher
Focus dimension: correctness. Rotation position 1 of 4. Prior state, registry, and earlier iteration summaries were considered before this pass.

## Files Reviewed
- .opencode/plugins/spec-kit-skill-advisor-bridge.mjs
- .opencode/plugins/spec-kit-skill-advisor.js
- .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts

## Findings - New
### P0 Findings
- None

### P1 Findings
- **F001**: Native-path advisor brief hardcodes the second score as 0.00 - `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:122` - The native bridge renderer emits confidence/0.00 instead of confidence/uncertainty, while the canonical renderer emits confidence/uncertainty. The plugin test fixture also bakes in the misleading 0.00 form, so the native path can inject inaccurate advisor context while tests still pass.

### P2 Findings
- **F002**: Status reports runtime ready before any bridge/probe validation - `.opencode/plugins/spec-kit-skill-advisor.js:369` - onSessionStart sets runtimeReady=true and lastBridgeStatus=ready without checking the bridge path, node binary, compiled advisor dist, or daemon/native availability. The status tool can therefore report a healthy runtime before the first bridge invocation proves it.

## Findings - Revisited
- None

## Traceability Checks
- Compared packet claims against concrete code/test evidence for this dimension.
- Checked whether new evidence changed prior severity calls.
- New severity-weighted findings ratio: 0.35.

## Confirmed-Clean Surfaces
- Bridge timeout/error paths fail open instead of throwing.
- Plugin cache keys include session, prompt, settings, source signature, and workspace root.

## Assessment
Dimensions addressed: correctness
New findings: P0=0, P1=1, P2=1.
Active totals after this pass: P0=0, P1=1, P2=1.
Convergence: continue; max iteration policy kept the loop running until iteration 010.

## Next Focus
security pass over prompt-safe status, telemetry persistence, and bridge boundaries.
