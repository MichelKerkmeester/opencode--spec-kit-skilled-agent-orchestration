---
title: "...zation/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-compat-migration-and-bootstrap/plan]"
description: "Phased plan for compat shim + plugin bridge + install/doc migration."
trigger_phrases:
  - "027/005 plan"
  - "compat migration plan"
  - "native advisor bootstrap"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: level_2/plan.md | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-compat-migration-and-bootstrap"
    last_updated_at: "2026-04-20T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "Updated plan metadata"
    next_safe_action: "Commit without pushing"
    blockers: []
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/plugins/spec-kit-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:027005plan0000000000000000000000000000000000000000000000000000"
      session_id: "027-005-compat-migration-r01"
      parent_session_id: "027-005-scaffold-r01"
    completion_pct: 100
    open_questions: []
    answered_questions: []
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
---
# Plan: 027/005

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/plan.md | v2.2 -->

<!-- ANCHOR:technical-context -->
## Technical Context

- Native advisor tools are live through the system-spec-kit MCP server.
- Python scorer remains the fallback for existing scripts and Gate 2 compatibility.
- Plugin bridge must keep subprocess isolation, timeout, SIGKILL escalation, workspace-scoped cache keys, and prompt-safe output.
<!-- /ANCHOR:technical-context -->

<!-- ANCHOR:architecture -->
## Architecture

```text
compat caller -> daemon probe -> advisor_recommend when available
              -> Python scorer fallback when unavailable or forced local
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:implementation -->
## Implementation

## Phases

## Phase 1 — Compat Surfaces

1. **Contract** — read research §7 D4/D7/D8 + §13.3 F2/F4/F5. Inventory all callers of `skill_advisor.py` + plugin bridge.
2. **Daemon probe** — `lib/compat/daemon-probe.ts`. Unit tests.
3. **Python shim rewrite** — `skill_advisor.py`: probe → route-native-or-fallback. Preserve Phase 025/026 fixes.
4. **Plugin bridge rewire** — `.opencode/plugins/*` delegate to `advisor_recommend` when daemon present.
5. **Redirect metadata** — `lib/compat/redirect-metadata.ts` rendering for supersession/archive/future/rollback states from 027/002.

## Phase 2 — Bootstrap, Playbook, And Verification

6. **Install guide updates** — daemon bootstrap, native registration, rollback docs.
7. **Playbook updates** — native scenarios + Python-shim scenarios preserved + redirect fixtures.
8. **Integration tests** — shim + plugin both hit corpus; match native.
9. **Verify** — CLAUDE / AGENTS pointers reviewed (no edits unless required); full suite green.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:dispatch -->
## Dispatch

Single `/spec_kit:implement :auto` after 027/004 lands.
<!-- /ANCHOR:dispatch -->

<!-- ANCHOR:verification -->
## Verification

- Python shim tests (daemon-on + daemon-off)
- Plugin bridge tests (daemon-on + daemon-off)
- Redirect metadata tests (4 lifecycle states)
- Install guide walkthrough on fresh checkout
- Full vitest suite + TS build green
- Regression: Phase 025/026 test baselines preserved
<!-- /ANCHOR:verification -->

<!-- ANCHOR:risk-mitigations -->
## Risk mitigations

- **R6** Python CLI stays until parity + docs fully migrate (post-027)
- **R8** plugin bridge adapter preserves disable flag + privacy contracts
<!-- /ANCHOR:risk-mitigations -->
