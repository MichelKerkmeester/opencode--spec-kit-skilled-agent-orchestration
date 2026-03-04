# Session-manager transaction gap fixes

## Current Reality

Two instances of `enforceEntryLimit()` called outside `db.transaction()` blocks in `session-manager.ts` were moved inside. Concurrent MCP requests could both pass the limit check then both insert, exceeding the entry limit when check and insert were not atomic. Both paths now run check-and-insert atomically inside the transaction.

## Source Metadata

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Session-manager transaction gap fixes
- Summary match found: Yes
- Summary source feature title: Session-manager transaction gap fixes
- Current reality source: feature_catalog.md
