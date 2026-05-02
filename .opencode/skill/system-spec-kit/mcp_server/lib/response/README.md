---
title: "Response Module"
description: "Envelope helpers, MCP wrappers, and response profile formatting for memory tool responses."
trigger_phrases:
  - "response envelope"
  - "response profiles"
  - "token count sync"
---

# Response Module

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DATA FLOW](#2--data-flow)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/response/` gives MCP handlers one response shape. It builds a typed envelope, syncs token counts against the serialized payload, wraps the result for MCP transport, and can reduce large responses into named profiles.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:data-flow -->
## 2. DATA FLOW

```text
handler data
  -> createResponse() or createErrorResponse()
  -> MCPEnvelope { summary, data, hints, meta }
  -> syncEnvelopeTokenCount()
  -> optional applyResponseProfile()
  -> wrapForMCP()
  -> MCP content envelope
```

Profiles keep the envelope contract while changing the returned `data` shape for `quick`, `research`, `resume`, or `debug` callers.

<!-- /ANCHOR:data-flow -->
<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Purpose |
|---|---|
| `envelope.ts` | Builds success, empty, and error envelopes, syncs token counts, and wraps payloads for MCP transport |
| `profile-formatters.ts` | Converts result-heavy envelopes into profile-specific response data |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

This module owns response shape and transport wrapping only. It does not fetch memory records, rank search results, mutate storage, or decide which profile a handler should request.

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:entrypoints -->
## 5. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `createSuccessResponse()` | Return a populated envelope |
| `createEmptyResponse()` | Return a standard no-results envelope with default hints |
| `createErrorResponse()` | Return a structured error with optional recovery data |
| `createMCPResponse()` | Create and wrap an envelope in one call |
| `wrapForMCP()` | Convert an existing envelope to MCP `content` format |
| `applyResponseProfile()` | Reduce raw response data to a named profile |
| `applyProfileToEnvelope()` | Apply a profile while preserving envelope metadata |

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation -->
## 6. VALIDATION

- Token counts are calculated from the serialized envelope via `syncEnvelopeTokenCount()`.
- `serializeEnvelopeWithTokenCount()` is the safe path when callers need JSON output.
- Profile formatting is gated by `isResponseProfileEnabled()`.
- Error envelopes set `meta.isError` and include recovery hints when supplied.

<!-- /ANCHOR:validation -->
<!-- ANCHOR:related -->
## 7. RELATED

- `../formatters/README.md`
- `../search/README.md`
- `../../context-server.ts`
- `../../tests/README.md`

<!-- /ANCHOR:related -->
