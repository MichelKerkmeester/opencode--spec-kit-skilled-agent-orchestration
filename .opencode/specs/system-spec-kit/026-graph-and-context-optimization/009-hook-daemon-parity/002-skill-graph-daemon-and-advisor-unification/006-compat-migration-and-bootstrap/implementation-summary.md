---
SPECKIT_TEMPLATE_SOURCE: "implementation-summary | v2.2"
title: "027/005 — Implementation Summary"
description: "Compat migration and bootstrap implementation summary for Phase 027/005."
trigger_phrases:
  - "027/005 implementation summary"
  - "compat migration summary"
  - "Gate 7 closure"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-compat-migration-and-bootstrap"
    last_updated_at: "2026-04-20T19:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Completed compat migration"
    next_safe_action: "Commit Phase 027/005; do not push."
    blockers: []
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/plugins/spec-kit-skill-advisor.js"
      - ".opencode/plugins/spec-kit-skill-advisor-bridge.mjs"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/daemon-probe.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/"
      - ".opencode/skill/system-spec-kit/install_guide/skill-advisor-native-bootstrap.md"
      - ".opencode/skill/skill-advisor/manual_testing_playbook/07--native-compat/001-native-shim-and-plugin.md"
    session_dedup:
      fingerprint: "sha256:027005-compat-migration-bootstrap-gate7-closed"
      session_id: "027-005-compat-migration-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Native advisor stays primary through MCP advisor tools; Python remains compat fallback."
      - "Gate 7 carry-over P0-CMD-002 and P0-CMD-003 closed in Python scorer."
---
# Implementation Summary — 027/005

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/implementation-summary.md | v2.2 -->

<!-- ANCHOR:status -->
## Status
Complete. Phase 027/005 compat migration and bootstrap landed locally. Phase 027 is ready for final commit; push is intentionally skipped per user instruction.
<!-- /ANCHOR:status -->

<!-- ANCHOR:completion-impact -->
## Completion Impact
Phase 027 now preserves the legacy advisor entry points while routing to the native advisor surface whenever the daemon-backed MCP path is available. The Python CLI, OpenCode plugin bridge, operator docs, and manual test playbook all share the same story: probe native status, delegate to `advisor_recommend`, and fall back to the local Python scorer or Python-backed brief producer when native routing is unavailable or explicitly disabled.

The 027/006 Gate 7 carry-over is closed: the Python scorer now routes `/spec_kit:plan` to `command-spec-kit` with `kind: command`, and `/memory:save this context` to `command-memory-save` with `kind: command`.
<!-- /ANCHOR:completion-impact -->

<!-- ANCHOR:shim-architecture -->
## Shim Architecture

```text
User prompt
  |
  +-- Hook / plugin / Python CLI
        |
        +-- SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 ? -> prompt-safe disabled / []
        |
        +-- daemon probe
              |
              +-- available -> advisor_recommend -> prompt-safe legacy/brief rendering
              |
              +-- unavailable or --force-local -> Python scorer fallback
```

The Python shim keeps batch mode, semantic/CocoIndex flags, `--stdin`, `--health`, and existing JSON-array output. New diagnostic controls:

| Control | Behavior |
| --- | --- |
| `--force-native` | Require native MCP advisor delegation; fail if unavailable |
| `--force-local` | Bypass native delegation and run Python scorer |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disable compat routing across shim/plugin paths |
<!-- /ANCHOR:shim-architecture -->

<!-- ANCHOR:daemon-probe-logic -->
## Daemon-Probe Logic

`mcp_server/skill-advisor/lib/compat/daemon-probe.ts` wraps `advisor_status` health with a compact prompt-safe contract:

| Signal | Result |
| --- | --- |
| `freshness: live` | available |
| `freshness: stale` | available but degraded |
| `freshness: absent` | unavailable |
| `freshness: unavailable` | unavailable |
| disabled flag | unavailable with `ADVISOR_DISABLED` reason |

The plugin bridge mirrors this in JavaScript by importing the built MCP advisor handlers and rendering only safe ids/status metadata.
<!-- /ANCHOR:daemon-probe-logic -->

<!-- ANCHOR:redirect-metadata -->
## Redirect Metadata

`mcp_server/skill-advisor/lib/compat/redirect-metadata.ts` renders prompt-safe lifecycle metadata:

| Input state | Rendered surface |
| --- | --- |
| superseded/deprecated | `status`, `redirect_from`, `redirect_to` |
| archived | `status: archived`, `default_routable: false` |
| future | `status: future`, `default_routable: false` |
| rolled-back | `status: rolled-back`, `schema_version: 1`, `note: v1 restored` |

Instruction-shaped redirect labels are sanitized out before rendering.
<!-- /ANCHOR:redirect-metadata -->

<!-- ANCHOR:files-changed -->
## Files Changed
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py` — native probe/delegation, force flags, disable handling, Gate 7 command bridge fixes
- `.opencode/plugins/spec-kit-skill-advisor.js` — cache invalidation source list includes native advisor handler/compat outputs while retaining SIGKILL escalation and workspace cache key
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` — native delegation, Python fallback, prompt-safe disabled brief
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/daemon-probe.ts` — shared daemon/freshness probe contract
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts` — prompt-safe redirect/status renderer
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/` — shim, plugin bridge, daemon probe, redirect metadata tests
- `.opencode/skill/system-spec-kit/install_guide/skill-advisor-native-bootstrap.md` — daemon bootstrap, native MCP registration, rollback, H5 checks
- `.opencode/skill/skill-advisor/manual_testing_playbook/` — native compat scenarios, redirect checks, H5 operator alerting
- `.opencode/skill/skill-advisor/README` and `SET-UP_GUIDE` — native-first architecture and compat controls
- 005 tasks and checklist — marked complete with evidence
<!-- /ANCHOR:files-changed -->

<!-- ANCHOR:verification -->
## Verification
- Baseline before implementation: advisor vitest 83/83 passed; Python regression 50/52 failed on P0-CMD-002 and P0-CMD-003.
- TypeScript typecheck: `npm run typecheck` passed.
- TypeScript build: `npm run build` passed.
- Compat vitest: `vitest run mcp_server/skill-advisor/tests/compat/` -> 4 files / 13 tests passed.
- Combined advisor vitest: `vitest run mcp_server/skill-advisor/tests/ mcp_server/tests/advisor-freshness.vitest.ts` -> 13 files / 96 tests passed.
- Python regression: `skill_advisor_regression.py --dataset .../skill_advisor_regression_cases.jsonl` -> 52/52 passed, `overall_pass: true`.
- CLI smoke:
  - default native path: `skill_advisor.py "test prompt"` returned native `source: "native"`.
  - force local: `skill_advisor.py --force-local "test prompt"` returned Python scorer output.
  - force native: `skill_advisor.py --force-native "test prompt"` returned native output.
  - stdin: `printf ... | skill_advisor.py --stdin` returned native output.
  - disable flag: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 skill_advisor.py "test prompt"` returned `[]`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:playbook-scenarios -->
## Playbook Scenarios

- NC-001 native CLI path
- NC-002 Python fallback path
- NC-003 `--stdin` regression
- NC-004 plugin bridge delegation
- NC-005 redirect/lifecycle status
- H5 operator alerting for degraded, quarantined, and unavailable daemon states
<!-- /ANCHOR:playbook-scenarios -->

<!-- ANCHOR:gate-7-closure-evidence -->
## Gate 7 Closure Evidence

Regression suite result:

```json
{
  "total_cases": 52,
  "passed_cases": 52,
  "failed_cases": 0,
  "p0_total": 12,
  "p0_passed": 12,
  "overall_pass": true
}
```

Closed cases:

| Case | Expected | Result |
| --- | --- | --- |
| P0-CMD-002 | `command-spec-kit`, `kind: command` | passed |
| P0-CMD-003 | `command-memory-save`, `kind: command` | passed |
<!-- /ANCHOR:gate-7-closure-evidence -->
