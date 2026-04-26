---
title: "advisor_status MCP Tool"
description: "Native MCP tool that reports advisor freshness, generation, trust state, skillCount, lastScanAt, and canonical lane weights."
trigger_phrases:
  - "advisor_status"
  - "mcp status tool"
  - "advisor freshness status"
  - "trust state status"
---

# advisor_status MCP Tool

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Give operators and runtimes a single read that summarizes whether advisor state is healthy enough to trust for routing.

---

## 2. CURRENT REALITY

`handlers/advisor-status.ts` returns `freshness`, `generation`, `trustState` (with `state` and optional `reason`), `skillCount`, `lastScanAt`, and `laneWeights` (the canonical 5-lane configuration). Freshness vocabulary is `live / stale / absent / unavailable`. The call is fail-open — even when the daemon is absent, status returns a well-formed envelope describing the shortfall.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/trust-state.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts`.
- Playbook scenario [NC-002](../../manual_testing_playbook/01--native-mcp-tools/002-native-status-transitions.md).

---

## 5. RELATED

- [01-advisor-recommend.md](./01-advisor-recommend.md).
- [`01--daemon-and-freshness/05-trust-state.md`](../01--daemon-and-freshness/05-trust-state.md).
- [`04--scorer-fusion/06-weights-config.md`](../04--scorer-fusion/06-weights-config.md).
