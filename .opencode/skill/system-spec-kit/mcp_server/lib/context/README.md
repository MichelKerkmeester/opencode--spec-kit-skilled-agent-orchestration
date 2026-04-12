---
title: "Context Contracts"
description: "Shared payload, transport, and publication-gate helpers for startup and resume context."
trigger_phrases:
  - "shared payload"
  - "context contracts"
---

# Context Contracts

## 1. OVERVIEW

`lib/context/` defines the data contracts used by startup, resume, bootstrap, and publication-oriented surfaces.

- `shared-payload.ts` - canonical payload and provenance types.
- `opencode-transport.ts` - transport helpers for OpenCode-facing context delivery.
- `publication-gate.ts` - publishability checks for metric-bearing payload fields.

## 2. RELATED

- `../resume/README.md`
- `../../hooks/README.md`
