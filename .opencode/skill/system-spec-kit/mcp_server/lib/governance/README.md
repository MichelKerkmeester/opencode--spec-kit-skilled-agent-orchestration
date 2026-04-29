---
title: "Governance"
description: "Scope enforcement and governed-ingest validation helpers."
trigger_phrases:
  - "scope governance"
  - "governed ingest"
---

# Governance

## 1. OVERVIEW

`lib/governance/` contains scope enforcement plus retention lifecycle helpers.

`scope-governance.ts` normalizes tenant, user, agent, and session scope, validates governed-ingest metadata, and persists governance audit records used by the handler layer.

`memory-retention-sweep.ts` enforces governed retention for rows whose `delete_after` timestamp has expired. It powers the `memory_retention_sweep` MCP tool, the startup sweep, and the hourly background interval when retention sweeping is enabled.

## 2. RELATED

- `../storage/README.md`
- `../../handlers/README.md`
