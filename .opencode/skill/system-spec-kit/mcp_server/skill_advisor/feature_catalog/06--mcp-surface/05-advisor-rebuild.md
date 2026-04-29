---
title: "advisor_rebuild MCP Tool"
description: "Explicit operator MCP tool that rebuilds the native advisor skill graph from checked-in skill metadata when advisor_status reports stale, absent, or unavailable state."
trigger_phrases:
  - "advisor_rebuild"
  - "advisor rebuild"
  - "rebuild advisor index"
  - "skill graph rebuild"
---

# advisor_rebuild MCP Tool

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. OVERVIEW

Give operators an explicit repair path for stale, absent, or unavailable advisor state without hiding rebuild side effects inside `advisor_status`.

---

## 2. CURRENT REALITY

`advisor_rebuild` is the explicit MCP repair tool that keeps rebuild behavior out of `advisor_status`. The handler reads the current status first. If status is `live` and `force` is not true, it skips the rebuild and returns a diagnostic telling the caller to pass `force:true` when a live rebuild is intentional.

When rebuild proceeds, it indexes `.opencode/skill`, publishes a fresh skill-graph generation with `reason: "advisor_rebuild"`, rereads status, and returns freshness before/after, generation before/after, skill count, indexing summary, and warnings. `advisor_status` remains diagnostic-only and never repairs stale state.

The tool descriptor and dispatcher register `advisor_rebuild` alongside `advisor_recommend`, `advisor_status`, and `advisor_validate`. The top-level MCP `TOOL_DEFINITIONS` list includes this tool in the server's 54-tool count.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:46-101` | Handler core | Reads status, skips live non-forced rebuilds, indexes skills, publishes generation, and returns before/after diagnostics |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:103-115` | MCP handler | Serializes the rebuild output and exports the snake_case compatibility alias |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:89-94` | Handler contract | Documents that status is diagnostic-only and points repair callers to `advisor_rebuild` |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts:8-17` | Tool descriptor | Declares the MCP tool and `force` option |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:56-72` | Dispatcher | Registers `advisor_rebuild` in the advisor MCP tool set |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:954-962` | Server registry | Includes `advisor_rebuild` in `TOOL_DEFINITIONS` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts` | Vitest | Covers skip, forced rebuild, stale rebuild, and output schema behavior |
| `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Vitest | Validates strict tool input schemas for registered MCP tools |

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`.

---

## 5. RELATED

- [02-advisor-status.md](./02-advisor-status.md).
- [`01--daemon-and-freshness/06-rebuild-from-source.md`](../01--daemon-and-freshness/06-rebuild-from-source.md).
- [`02--auto-indexing/04-sync.md`](../02--auto-indexing/04-sync.md).
