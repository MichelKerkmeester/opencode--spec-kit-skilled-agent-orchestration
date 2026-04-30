---
title: "advisor_status MCP Tool"
description: "Diagnostic-only native MCP tool that reports advisor freshness, generation, trust state, skillCount, lastScanAt, and canonical lane weights without rebuilding stale state."
trigger_phrases:
  - "advisor_status"
  - "mcp status tool"
  - "advisor freshness status"
  - "trust state status"
---

# advisor_status MCP Tool

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Give operators and runtimes a single diagnostic read that summarizes whether advisor state is healthy enough to trust for routing.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`handlers/advisor-status.ts` returns `freshness`, `generation`, `trustState` (with `state` and optional `reason`), `skillCount`, `lastScanAt`, and `laneWeights` (the canonical 5-lane configuration). Freshness vocabulary is `live / stale / absent / unavailable`. The call is fail-open: even when the daemon is absent, status returns a well-formed envelope describing the shortfall.

`readAdvisorStatus()` is strictly diagnostic. It reports stale, absent, or unavailable advisor state and does not repair it. Operators should call `advisor_rebuild` when status reports stale state or when a forced rebuild is needed.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:89-197` | Handler | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:46-51` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts` | Automated test | Validation reference |
| `Playbook scenario [NC-002](../../manual_testing_playbook/01--native-mcp-tools/002-native-status-transitions.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-surface/02-advisor-status.md`

Related references:

- [01-advisor-recommend.md](./01-advisor-recommend.md).
- [05-advisor-rebuild.md](./05-advisor-rebuild.md).
- [`01--daemon-and-freshness/05-trust-state.md`](../01--daemon-and-freshness/05-trust-state.md).
- [`04--scorer-fusion/06-weights-config.md`](../04--scorer-fusion/06-weights-config.md).
<!-- /ANCHOR:source-metadata -->
