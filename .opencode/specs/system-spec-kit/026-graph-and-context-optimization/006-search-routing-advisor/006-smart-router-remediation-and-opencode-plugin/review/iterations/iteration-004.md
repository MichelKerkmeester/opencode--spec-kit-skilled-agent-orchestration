# Iteration 004 - maintainability

## Dispatcher
Focus dimension: maintainability. Rotation position 4 of 4. Prior state, registry, and earlier iteration summaries were considered before this pass.

## Files Reviewed
- .opencode/plugins/spec-kit-skill-advisor-bridge.mjs
- .opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh
- .opencode/plugins/spec-kit-compact-code-graph.js

## Findings - New
### P0 Findings
- None

### P1 Findings
- None

### P2 Findings
- **F009**: Bridge duplicates advisor rendering/sanitization logic for the native path - `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:99` - The bridge imports renderAdvisorBrief from compat but buildNativeBrief uses local sanitizeLabel/renderNativeBrief logic instead. This duplicates the canonical renderer and already diverges in the score formatting called out by F001.
- **F010**: Static router checker has no fixture-level regression coverage for parser variants - `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh:55` - The checker embeds a sizeable Python parser in a shell script and the packet records successful command runs, but the reviewed tests do not include fixtures proving stale-path detection, dynamic resource expansion, and bloat warning behavior. Parser drift is one of the spec risks.

## Findings - Revisited
- F001: still active; no severity escalation in this pass.
- F002: still active; no severity escalation in this pass.
- F003: still active; no severity escalation in this pass.
- F004: still active; no severity escalation in this pass.
- F005: still active; no severity escalation in this pass.
- F006: still active; no severity escalation in this pass.
- F008: still active; no severity escalation in this pass.

## Traceability Checks
- Compared packet claims against concrete code/test evidence for this dimension.
- Checked whether new evidence changed prior severity calls.
- New severity-weighted findings ratio: 0.17.

## Confirmed-Clean Surfaces
- Bridge-backed architecture follows the compact-code-graph boundary and avoids importing native MCP modules into the host.
- The checker is standalone and does not require a TypeScript build.

## Assessment
Dimensions addressed: maintainability
New findings: P0=0, P1=0, P2=2.
Active totals after this pass: P0=0, P1=3, P2=6.
Convergence: continue; max iteration policy kept the loop running until iteration 010.

## Next Focus
second correctness pass to adjudicate native renderer severity and status semantics.
