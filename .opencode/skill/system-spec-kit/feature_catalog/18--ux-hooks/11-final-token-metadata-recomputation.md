# Final token metadata recomputation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Final token metadata recomputation.

## 2. CURRENT REALITY

Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. This keeps `meta.tokenCount` aligned with the exact serialized envelope returned to callers.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/response-hints.ts` | Hook | Recomputes `meta.tokenCount` from finalized serialized envelope |
| `mcp_server/context-server.ts` | Server | Runs hint append before budget enforcement in success path |
| `shared/utils/token-estimate.ts` | Shared | Token estimation utility used for final token sync |

### Tests

| Test File | Test Name | Coverage |
|-----------|-----------|----------|
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | `appendAutoSurfaceHints injects hints and sets tokenCount from the final serialized envelope JSON` | Verifies `appendAutoSurfaceHints` drives final token metadata recomputation by using `syncEnvelopeTokenCount` and `serializeEnvelopeWithTokenCount` on the final envelope payload. |
| `mcp_server/tests/context-server.vitest.ts` | `T000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection` | Verifies end-to-end server flow preserves final token-count correctness after hint and metadata mutations. |

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Final token metadata recomputation
- Current reality source: feature_catalog.md
