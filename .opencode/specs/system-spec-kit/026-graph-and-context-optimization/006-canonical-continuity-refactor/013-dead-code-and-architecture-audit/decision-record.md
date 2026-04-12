---
title: "Decision Record — Phase 013"
status: "planned"
level: 3
parent: "006-canonical-continuity-refactor"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 013

---

## ADR-001: Audit scope is mcp_server + scripts only

### Context
The Phase 006 refactor touched files across the entire repo (178+ doc fanout, 538 feature catalog files, etc.). Auditing everything would take weeks.

### Decision
Limit the dead code + architecture audit to `mcp_server/` and `scripts/` — the runtime TypeScript code. Doc-only surfaces (commands, agents, READMEs, feature catalog) were already reviewed in phases 007-009 and Gate H/I.

### Consequences
- Faster audit focused on correctness
- Doc surfaces may still have minor drift (acceptable — they were reviewed recently)

## ADR-002: Use resource-map.md as the file inventory

### Context
We need a canonical list of files Phase 006 owns/modifies to verify completeness.

### Decision
Use the existing `resource-map.md` as the base inventory and refresh it with the current state.

### Consequences
- Single source of truth for "what files does Phase 006 own"
- Refresh adds maintenance cost but keeps the map useful for future phases
