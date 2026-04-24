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

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Expose the native scoring pipeline as an MCP tool that any runtime can call, with prompt-safe attribution and lifecycle-aware redirects.

---

## 2. CURRENT REALITY

`handlers/advisor-recommend.ts` implements the tool. Input is validated by `schemas/advisor-tool-schemas.ts` (Zod strict). The public response always includes the resolved `workspaceRoot` plus `effectiveThresholds`, where `effectiveThresholds` publishes the active `confidenceThreshold`, `uncertaintyThreshold`, and `confidenceOnly` mode after request overrides are merged with defaults. Output also carries prompt-safe `recommendations[]`, optional `laneBreakdown[]` when `includeAttribution: true`, lifecycle redirect metadata (`redirectFrom`, `redirectTo`, `status`), `freshness`, `trustState`, `generatedAt`, `cache`, optional `warnings`, and optional `abstainReasons`. Fail-open states such as disabled or absent freshness still preserve `workspaceRoot` and `effectiveThresholds` in the envelope so callers can inspect the resolved repository scope and active routing thresholds even when no recommendations are returned. The handler enforces sanitization at the envelope boundary (see `lib/derived/sanitizer.ts`) and never echoes prompt text into response metadata. Cache behavior is tied to generation (see [`01--daemon-and-freshness/07-cache-invalidation.md`](../01--daemon-and-freshness/07-cache-invalidation.md)).

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-privacy.vitest.ts`.
- Playbook scenarios [NC-001](../../manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md), [NC-004](../../manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md), [NC-005](../../manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md).

---

## 5. RELATED

- [02-advisor-status.md](./02-advisor-status.md).
- [03-advisor-validate.md](./03-advisor-validate.md).
- [04-compat-entrypoint.md](./04-compat-entrypoint.md).
