---
title: "027/005 — Plan"
description: "Phased plan for compat shim + plugin bridge + install/doc migration."
importance_tier: "high"
contextType: "implementation"
---
# Plan: 027/005

## Phases

1. **Contract** — read research.md §7 D4/D7/D8 + §13.3 F2/F4/F5. Inventory all callers of `skill_advisor.py` + plugin bridge.
2. **Daemon probe** — `lib/compat/daemon-probe.ts`. Unit tests.
3. **Python shim rewrite** — `skill_advisor.py`: probe → route-native-or-fallback. Preserve Phase 025/026 fixes.
4. **Plugin bridge rewire** — `.opencode/plugins/*` delegate to `advisor_recommend` when daemon present.
5. **Redirect metadata** — `lib/compat/redirect-metadata.ts` rendering for supersession/archive/future/rollback states from 027/002.
6. **Install guide updates** — daemon bootstrap, native registration, rollback docs.
7. **Playbook updates** — native scenarios + Python-shim scenarios preserved + redirect fixtures.
8. **Integration tests** — shim + plugin both hit corpus; match native.
9. **Verify** — CLAUDE.md / AGENTS.md pointers reviewed (no edits unless required); full suite green.

## Dispatch

Single `/spec_kit:implement :auto` after 027/004 lands.

## Verification

- Python shim tests (daemon-on + daemon-off)
- Plugin bridge tests (daemon-on + daemon-off)
- Redirect metadata tests (4 lifecycle states)
- Install guide walkthrough on fresh checkout
- Full vitest suite + TS build green
- Regression: Phase 025/026 test baselines preserved

## Risk mitigations

- **R6** Python CLI stays until parity + docs fully migrate (post-027)
- **R8** plugin bridge adapter preserves disable flag + privacy contracts
