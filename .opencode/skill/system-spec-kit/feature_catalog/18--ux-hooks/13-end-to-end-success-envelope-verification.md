# End-to-end success-envelope verification

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for End-to-end success-envelope verification.

## 2. CURRENT REALITY

Phase 014 verification includes end-to-end success-envelope assertions in `tests/context-server.vitest.ts`. This coverage verifies the finalized success-path hint append flow, preserved `autoSurfacedContext`, and final token metadata behavior together so response-envelope regressions fail fast.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/context-server.ts` | Server | End-to-end success path and envelope mutation ordering |
| `mcp_server/hooks/response-hints.ts` | Hook | Hint append + token-count resync on finalized envelope |
| `mcp_server/hooks/index.ts` | Hook Barrel | Exposes response-hint hooks to server runtime |

### Tests

| Test File | Test Name | Coverage |
|-----------|-----------|----------|
| `mcp_server/tests/context-server.vitest.ts` | `T000i: successful responses append auto-surface hints and preserve autoSurfacedContext` | Verifies end-to-end success envelopes append auto-surface hints while preserving `autoSurfacedContext` in the response object. |
| `mcp_server/tests/context-server.vitest.ts` | `T000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection` | Verifies finalized success envelopes recompute `meta.tokenCount` from the fully serialized payload after hint/token-budget mutations. |
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | `appendAutoSurfaceHints injects hints and sets tokenCount from the final serialized envelope JSON` | Unit-level contract coverage for envelope hint injection and final token metadata synchronization used by the end-to-end success path. |

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: End-to-end success-envelope verification
- Current reality source: feature_catalog.md
