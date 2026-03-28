---
title: "Response Module"
description: "Envelope helpers, MCP wrappers, and response-profile formatting for memory tool responses."
trigger_phrases:
  - "response envelope"
  - "response profiles"
  - "token count sync"
---

# Response Module

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. IMPLEMENTED STATE](#3--implemented-state)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/response/` standardizes how MCP tool handlers build envelopes, wrap them for MCP transport, and optionally compress them into profile-shaped outputs for specific consumers.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
|---|---|
| `envelope.ts` | Envelope factories, MCP wrappers, default hints, and serialized token-count synchronization |
| `profile-formatters.ts` | Profile reducers for `quick`, `research`, `resume`, and `debug` response shapes |

<!-- /ANCHOR:structure -->
<!-- ANCHOR:implemented-state -->
## 3. IMPLEMENTED STATE

- `envelope.ts` exports `createResponse()`, `createSuccessResponse()`, `createEmptyResponse()`, `createErrorResponse()`, `wrapForMCP()`, `createMCPResponse()`, `createMCPSuccessResponse()`, `createMCPEmptyResponse()`, and `createMCPErrorResponse()`.
- Token counts are synchronized against the fully serialized JSON envelope, not a partial approximation, via `syncEnvelopeTokenCount()` and `serializeEnvelopeWithTokenCount()`.
- `profile-formatters.ts` exports `applyResponseProfile()` and `applyProfileToEnvelope()` plus the public profile types for `quick`, `research`, `resume`, and `debug`.
- Response profiles are gated through `isResponseProfileEnabled()` and preserve backward compatibility by returning `null` when profile formatting is disabled or not requested.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:related -->
## 4. RELATED

- `../../hooks/README.md`
- `../../formatters/README.md`
- `../../tests/README.md`

<!-- /ANCHOR:related -->
