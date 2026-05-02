---
title: "Hook Fixtures"
description: "Transcript fixtures used by hook replay tests."
trigger_phrases:
  - "hook fixtures"
  - "session stop replay"
---

# Hook Fixtures

## 1. PURPOSE

`tests/fixtures/hooks/` stores small transcript inputs for hook replay tests. These files are intentionally data-only so harness tests can verify hook behavior without depending on live runtime state.

## 2. KEY FILES

- `session-stop-replay.jsonl` - transcript fixture consumed by the stop-hook replay harness.

## 3. BOUNDARIES

- Keep fixtures deterministic, minimal, and free of machine-local paths.
- Do not put harness code here; use `tests/_support/hooks/` for replay helpers.
- Do not treat fixture contents as production hook documentation.

## 4. VALIDATION

Run focused hook replay tests from `mcp_server` after changing fixtures:

```bash
npx vitest run tests/hooks-runtime-detection.vitest.ts
```

## 5. RELATED

- `../../README.md`
- `../../_support/hooks/README.md`
