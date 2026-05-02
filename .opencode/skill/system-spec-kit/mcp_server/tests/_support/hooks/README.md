---
title: "Hook Test Support"
description: "Replay harnesses for exercising hook flows in sandboxed tests."
trigger_phrases:
  - "hook replay harness"
  - "stop hook sandbox"
---

# Hook Test Support

## 1. PURPOSE

`tests/_support/hooks/` contains small harness utilities for hook-focused tests. The helpers make replay tests deterministic by sandboxing filesystem writes and consuming checked-in hook fixtures.

## 2. KEY FILES

- `replay-harness.ts` - builds a sandbox, replays stop-hook fixtures, and asserts writes stay inside the sandbox.

## 3. BOUNDARIES

- Keep shared helpers test-only; production hook code belongs under `mcp_server/hooks/`.
- Keep fixture data in `tests/fixtures/hooks/` rather than embedding large transcripts here.
- Preserve sandbox cleanup so replay tests do not write outside temporary directories.

## 4. VALIDATION

Run focused hook tests from `mcp_server` after changing support helpers:

```bash
npx vitest run tests/hooks-runtime-detection.vitest.ts
```

## 5. RELATED

- `../../../hooks/README.md`
- `../../fixtures/hooks/README.md`
