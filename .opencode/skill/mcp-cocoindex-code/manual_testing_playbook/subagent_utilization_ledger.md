---
title: Sub-Agent Utilization Ledger
description: Coordinator/worker wave planning and capacity guidance for executing the CocoIndex Code 20-scenario manual testing playbook.
---

# Sub-Agent Utilization Ledger

Coordinator/worker utilization guidance for executing the CocoIndex Code manual testing playbook across parallel waves.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Records wave planning and capacity guidance for the 20-scenario CocoIndex Code playbook. This is not a runtime support matrix -- it is pre-execution planning for agent orchestration.

### Scope

- **Playbook size**: 20 scenarios across 6 categories (CCC, MCP, CFG, DMN, ADV, ERR)
- **Surface area**: Small (compared to the 189+ scenario system-spec-kit playbook)
- **Recommendation**: Single-wave execution with one destructive isolation wave

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:wave-planning -->
## 2. WAVE PLANNING

| Wave | Scenarios | Worker Count | Notes |
|------|-----------|--------------|-------|
| Wave 1 (non-destructive) | CCC-001..CCC-004, MCP-001..MCP-007, CFG-001..CFG-003, DMN-001..DMN-002, ADV-001..ADV-002, ERR-001 | 1-5 | All non-destructive scenarios; safe to parallelize |
| Wave 2 (destructive) | CCC-005 | 1 | **Must run in isolation** -- resets the index; no other scenario may depend on index during this wave |

### Capacity Notes

- **Small playbook**: 20 scenarios fit comfortably in 1-2 waves regardless of runtime capacity
- **Destructive isolation**: CCC-005 (index reset) MUST run after all non-destructive scenarios complete, in a dedicated wave
- **Daemon dependency**: DMN-001 stops and restarts the daemon; schedule it last within Wave 1 or verify daemon is running before subsequent scenarios
- **MCP vs CLI parallelism**: MCP scenarios (MCP-001..MCP-007) and CLI scenarios (CCC-001..CCC-004) can run concurrently since they use independent interfaces to the same daemon

<!-- /ANCHOR:wave-planning -->

---

<!-- ANCHOR:operational-rules -->
## 3. OPERATIONAL RULES

1. Probe runtime capacity at start
2. Reserve one coordinator
3. Saturate remaining worker slots
4. Pre-assign explicit scenario IDs and ranges to each wave before execution
5. Run destructive scenario (`CCC-005`) in a dedicated sandbox-only wave
6. After each wave, save context and evidence, then begin the next wave
7. Record utilization table and evidence paths in final report

<!-- /ANCHOR:operational-rules -->
