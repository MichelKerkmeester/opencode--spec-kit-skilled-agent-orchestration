---
title: "Test Support"
description: "Vitest support files and shared test bootstrap helpers."
trigger_phrases:
  - "vitest setup"
  - "test support"
---

# Test Support

## 1. PURPOSE

`tests/_support/` contains shared Vitest setup and focused helpers used by MCP server tests. Keep this directory limited to reusable test infrastructure, not assertions or production behavior.

## 2. TREE AND KEY FILES

```text
_support/
+-- hooks/             # Hook replay harness helpers
+-- vitest-setup.ts    # Test environment normalization
`-- README.md
```

- `vitest-setup.ts` - normalizes temp-directory environment variables for test runs.
- `hooks/` - shared replay helpers for hook-focused tests.

## 3. BOUNDARIES

- Keep cross-suite helpers deterministic and free of persistent workspace writes.
- Do not place fixture payloads here; use `tests/fixtures/` for reusable data.
- Do not add production exports from test support modules.

## 4. VALIDATION

Run affected Vitest suites from `mcp_server`; use the full suite for shared setup changes:

```bash
npx vitest run tests/<suite>.vitest.ts
npx vitest run
```

## 5. RELATED

- `../README.md`
- `./hooks/README.md`
