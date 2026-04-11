---
title: Blocked Stop Fixture
description: End-to-end fixture for the sk-deep-review blocked_stop reducer path.
---

# Blocked Stop Fixture

This fixture demonstrates the full `blocked_stop -> registry -> dashboard` reducer path for a review packet.

It includes:
- A complete `blocked_stop` bundle with all required `gateResults`
- A severity upgrade where `F002` moves from `P2` in iteration 1 to `P1` in iteration 3
- A persistent active `P0` (`F001`) introduced in iteration 2 and still open in iteration 3
- Three iteration files that let the reducer populate `blockedStopHistory`, `persistentSameSeverity`, and `severityChanged`

This fixture is intended to exercise:
- `REQ-014` blocked-stop surfacing through the reducer and dashboard
- `REQ-021` reducer handling for blocked-stop history plus severity-transition tracking

Reducer entrypoint:

```bash
node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs \
  .opencode/skill/sk-deep-review/scripts/tests/fixtures/blocked-stop-session
```
