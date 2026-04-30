---
title: "advisor_recommend MCP Tool"
description: "Native MCP tool that returns prompt-safe skill recommendations with lane attribution, lifecycle metadata, and fail-open freshness semantics."
trigger_phrases:
  - "advisor_recommend"
  - "mcp recommend tool"
  - "native recommend"
  - "skill recommendation tool"
---

# advisor_recommend MCP Tool

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Expose the native scoring pipeline as an MCP tool that any runtime can call, with prompt-safe attribution and lifecycle-aware redirects.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`handlers/advisor-recommend.ts` implements the tool. Input is validated by `schemas/advisor-tool-schemas.ts` (Zod strict). The public response always includes the resolved `workspaceRoot` plus `effectiveThresholds`, where `effectiveThresholds` publishes the active `confidenceThreshold`, `uncertaintyThreshold`, and `confidenceOnly` mode after request overrides are merged with defaults. Output also carries prompt-safe `recommendations[]`, optional `laneBreakdown[]` when `includeAttribution: true`, lifecycle redirect metadata (`redirectFrom`, `redirectTo`, `status`), `freshness`, `trustState`, `generatedAt`, `cache`, optional `warnings`, and optional `abstainReasons`. Fail-open states such as disabled or absent freshness still preserve `workspaceRoot` and `effectiveThresholds` in the envelope so callers can inspect the resolved repository scope and active routing thresholds even when no recommendations are returned. The handler enforces sanitization at the envelope boundary (see `lib/derived/sanitizer.ts`) and never echoes prompt text into response metadata. Cache behavior is tied to generation (see [`01--daemon-and-freshness/07-cache-invalidation.md`](../01--daemon-and-freshness/07-cache-invalidation.md)).

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Handler | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/` | Tool surface | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts` | Automated test | Validation reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-privacy.vitest.ts` | Automated test | Validation reference |
| `Playbook scenarios [NC-001](../../manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md), [NC-004](../../manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md), [NC-005](../../manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-surface/01-advisor-recommend.md`

Related references:

- [02-advisor-status.md](./02-advisor-status.md).
- [03-advisor-validate.md](./03-advisor-validate.md).
- [04-compat-entrypoint.md](./04-compat-entrypoint.md).
<!-- /ANCHOR:source-metadata -->
