---
title: "Governance"
description: "Scope enforcement and governed-ingest validation helpers."
trigger_phrases:
  - "scope governance"
  - "governed ingest"
---

# Governance

## 1. OVERVIEW

`lib/governance/` currently centers on `scope-governance.ts`.

The module normalizes tenant, user, agent, and session scope, validates governed-ingest metadata, and persists governance audit records used by the handler layer.

## 2. RELATED

- `../storage/README.md`
- `../../handlers/README.md`
