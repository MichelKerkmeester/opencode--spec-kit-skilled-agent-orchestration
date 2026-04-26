---
title: "A7 Sanitizer at Every Write Boundary"
description: "Skill-label sanitizer applied at every public write boundary (SQLite, graph-metadata derived, envelope, diagnostics) to prevent unsafe labels from crossing trust surfaces."
trigger_phrases:
  - "a7 sanitizer"
  - "sanitizeSkillLabel"
  - "write boundary sanitizer"
  - "skill label hygiene"
---

# A7 Sanitizer at Every Write Boundary

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Keep malformed or malicious skill labels out of every surface that touches trust: SQLite rows, graph-metadata derived writes, response envelopes, and adapter diagnostics. A single sanitizer, applied at every boundary, is the routing surface's anti-injection line.

---

## 2. CURRENT REALITY

`lib/derived/sanitizer.ts` normalizes skill labels to the slug shape `[a-z0-9][a-z0-9-]*` and rejects control characters, path separators, and prompt-shaped content. It runs at four write boundaries:

1. SQLite persistence writes from the daemon.
2. `graph-metadata.json.derived` writes from `lib/derived/sync.ts`.
3. Response envelopes emitted by `handlers/advisor-recommend.ts`.
4. Diagnostic records written by `hooks/*/user-prompt-submit.ts`.

Unsanitized labels never leak to readers.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sanitizer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sync.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-privacy.vitest.ts` — boundary sanitization.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts` — envelope sanitization.
- Playbook scenario [AI-002](../../manual_testing_playbook/06--auto-indexing/002-sanitizer-boundaries.md).

---

## 5. RELATED

- [01-derived-extraction.md](./01-derived-extraction.md).
- [05-anti-stuffing.md](./05-anti-stuffing.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
