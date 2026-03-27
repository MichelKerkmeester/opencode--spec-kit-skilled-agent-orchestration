---
title: "Inert scoring flags and compatibility shims"
description: "Documents retired scoring-flag behavior and shim layers that remain in the codebase for compatibility, observability, and legacy imports."
---

# Inert scoring flags and compatibility shims

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This entry documents scoring-era flag surfaces and shim modules that remain visible after remediation work simplified the live runtime.

The requested source files show two related cleanup patterns. `mcp_server/lib/scoring/composite-scoring.ts` keeps compatibility exports and legacy scoring entry points while explicitly disabling novelty boost as a live scoring control. `mcp_server/lib/search/graph-flags.ts` keeps older graph-flag imports working by forwarding them into newer rollout resolution logic instead of preserving a separate legacy implementation.

---

## 2. CURRENT REALITY

`mcp_server/lib/scoring/composite-scoring.ts` explicitly marks novelty boost as a compatibility-only surface. The `NOVELTY_BOOST_*` constants are retained as test-only exports, `calculateNoveltyBoost()` always returns `0`, and the file states that `SPECKIT_NOVELTY_BOOST` is inert. Post-processing telemetry reinforces that retirement posture by always logging `noveltyBoostApplied: false` and `noveltyBoostValue: 0`, so the production scoring path no longer has a novelty branch to re-enable through configuration.

The same scoring module also preserves older composite-scoring APIs for backward compatibility. `DEFAULT_WEIGHTS`, `calculateCompositeScore()`, `applyCompositeScoring()`, and `getScoreBreakdown()` still expose the `6-factor-legacy` model, while the newer five-factor path is available through the parallel APIs and the `use_five_factor_model` option. In practice, this file now carries both a current scoring model and a compatibility model, but only the novelty flag surface is explicitly retired as inert.

`mcp_server/lib/search/graph-flags.ts` is a shim layer rather than an independent feature-flag implementation. The file labels itself as a legacy compatibility shim retained for test/runtime imports. `getGraphWalkRolloutState()` forwards directly to `resolveGraphWalkRolloutState()`, and the trace/runtime helpers derive their answers from that forwarded state instead of consulting separate legacy flags. That leaves `isGraphUnifiedEnabled()` as the only direct graph flag gate in this module, while the graph-walk helpers mainly preserve older import paths and naming.

Taken together, these files show the post-remediation pattern for deprecated controls: keep names, exports, and forwarding helpers where compatibility still matters, but remove or centralize the behavior so legacy flags and wrapper modules no longer define an alternate live path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/scoring/composite-scoring.ts` | Scoring pipeline | Retains backward-compatible scoring exports and legacy six-factor entry points while making novelty boost permanently inert |
| `mcp_server/lib/search/graph-flags.ts` | Search rollout compatibility | Preserves legacy graph-flag imports by forwarding graph-walk state and helper checks into newer rollout logic |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/scoring-observability.vitest.ts` | MCP runtime test | Verifies novelty telemetry stays inert and `noveltyBoostApplied` remains false. |
| `mcp_server/tests/graph-flags.vitest.ts` | MCP runtime test | Verifies the compatibility shim still exports the unified graph gate. |
| `mcp_server/tests/pipeline-integration.vitest.ts` | MCP integration test | Verifies `graph-flags.ts` exports stay reachable from live pipeline wiring. |
| `mcp_server/tests/dead-code-regression.vitest.ts` | MCP regression test | Guards the retained shadow-scoring and compatibility-export surface from accidental removal or silent behavior change. |

---

## 4. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Source feature title: Inert scoring flags and compatibility shims
- Feature file path: `21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md`
- Current reality source: direct implementation audit of the listed scoring/search shim modules plus the listed observability and compatibility tests
