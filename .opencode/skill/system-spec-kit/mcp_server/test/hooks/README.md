---
title: "Hook Test Support"
description: "Replay harnesses for exercising hook flows in sandboxed tests."
trigger_phrases:
  - "hook replay harness"
  - "stop hook sandbox"
---

# Hook Test Support

## 1. OVERVIEW

`test/hooks/` contains harness code used by hook-focused tests.

- `replay-harness.ts` - builds a sandbox, replays stop-hook fixtures, and asserts writes stay inside the sandbox.

## 2. RELATED

- `../../hooks/README.md`
- `../../tests/fixtures/hooks/README.md`
