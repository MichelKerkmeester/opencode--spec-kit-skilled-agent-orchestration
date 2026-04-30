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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Keep malformed or malicious skill labels out of every surface that touches trust: SQLite rows, graph-metadata derived writes, response envelopes, and adapter diagnostics. A single sanitizer, applied at every boundary, is the routing surface's anti-injection line.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/derived/sanitizer.ts` normalizes skill labels to the slug shape `[a-z0-9][a-z0-9-]*` and rejects control characters, path separators, and prompt-shaped content. It runs at four write boundaries:

1. SQLite persistence writes from the daemon.
2. `graph-metadata.json.derived` writes from `lib/derived/sync.ts`.
3. Response envelopes emitted by `handlers/advisor-recommend.ts`.
4. Diagnostic records written by `hooks/*/user-prompt-submit.ts`.

Unsanitized labels never leak to readers.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sanitizer.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sync.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-privacy.vitest.ts` | Automated test | boundary sanitization |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts` | Automated test | envelope sanitization |
| `Playbook scenario [AI-002](../../manual_testing_playbook/06--auto-indexing/002-sanitizer-boundaries.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--auto-indexing/02-sanitizer.md`

Related references:

- [01-derived-extraction.md](./01-derived-extraction.md).
- [05-anti-stuffing.md](./05-anti-stuffing.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
<!-- /ANCHOR:source-metadata -->
