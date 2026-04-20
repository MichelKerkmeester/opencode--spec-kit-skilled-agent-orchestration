---
title: "Feature Specification: 027/005 — Compat Migration + Bootstrap"
description: "Preserve skill_advisor.py compat shim. Hook/plugin bridges route to native advisor_recommend after daemon availability check. Install guide + verification + rollback docs. Manual-testing playbook updates. Prompt-safe status surfaces for superseded/archived/future/rolled-back skills."
trigger_phrases:
  - "027/005"
  - "compat migration"
  - "skill_advisor.py shim"
  - "plugin bridge"
  - "install guide"
  - "redirect ux"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap"
    last_updated_at: "2026-04-20T14:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded 027/005 packet"
    next_safe_action: "Land 027/004 first, then dispatch /spec_kit:implement :auto 027/005"
    blockers: ["027/004 MCP surface must land first"]
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/plugins/spec-kit-skill-advisor.js"
      - ".opencode/plugins/spec-kit-skill-advisor-bridge.mjs"
      - ".opencode/skill/system-spec-kit/install_guide/"
      - ".opencode/skill/skill-advisor/manual_testing_playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-005-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 027/005 — Compat Migration + Bootstrap

<!-- SPECKIT_LEVEL: 2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent** | `../` |
| **Predecessor** | `../004-mcp-advisor-surface/` |
| **Research source** | `research.md` §7 Track D (D4, D7, D8) + §13.3 Track F; iterations 027, 030-031, 046, 048, 056 |

## 2. PROBLEM & PURPOSE

### Problem
Once native TypeScript advisor + MCP tools are live (027/003 + 027/004), the legacy surfaces still need to work:
- Gate 2 fallback in CLAUDE.md invokes `python3 skill_advisor.py`
- Scripted checks + CI + manual-testing playbook scenarios call the Python CLI
- `.opencode/plugins/spec-kit-skill-advisor.js` + bridge.mjs currently proxy to Python subprocess
- Install guide + operator docs reference the old paths

Cutting these over without a compat bridge would break existing users. And superseded / archived / rolled-back skills (from 027/002) need prompt-safe status surfaces at runtime so users see "v1 redirected to v2" notes instead of silent ambiguity.

### Purpose
Ship the compat + migration layer: `skill_advisor.py` stays as a thin shim, hook/plugin bridges route to `advisor_recommend` via MCP when available and fall back to local scoring when not. Install guide + playbook + setup docs updated for the new architecture. Prompt-safe redirect/status rendering for lifecycle states.

## 3. SCOPE

### In Scope
- `skill_advisor.py` compat shim rewrite:
  - Preserve `--stdin` mode (from Phase 025 fix)
  - Detect daemon availability (via socket / file-lease / MCP probe)
  - If available: route to `advisor_recommend` tool + return parsed result
  - If not: fall back to local scoring (existing Python path)
  - Explicit `--force-local` and `--force-native` flags for testing
  - Preserve disable flag `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`
- `.opencode/plugins/spec-kit-skill-advisor.js` + `-bridge.mjs` migration:
  - Bridge detects daemon; delegates to `advisor_recommend` when available
  - Retains SIGTERM→SIGKILL escalation (from Phase 026 fix)
  - Retains workspace-scoped cache key (from Phase 026 fix)
  - Shared disable flag (from Phase 026 fix)
- Install guide updates at `.opencode/skill/system-spec-kit/install_guide/`:
  - New daemon bootstrap steps
  - Native MCP tool registration verification
  - Rollback docs (how to force Python path)
- Manual-testing playbook updates at `.opencode/skill/skill-advisor/manual_testing_playbook/`:
  - Native path scenarios added
  - Python-shim path preserved during transition
  - Supersession / archive / rolled-back redirect scenarios
- Prompt-safe status surfaces:
  - Superseded skill: brief includes `redirect_from: "sk-X-v1"`, `redirect_to: "sk-X-v2"`
  - Archived (`z_archive/`): brief includes `status: "archived"`, excluded from default recommendations
  - Future (`z_future/`): brief includes `status: "future"`, excluded from default recommendations
  - Rolled-back: brief includes `schema_version: 1`, `note: "v1 restored"`

### Out of Scope
- Removing the Python CLI entirely — deferred post-027 until docs + scripted callers fully migrate.
- Shadow-cycle promotion (027/006).
- Plugin deprecation — plugin stays as adapter per research D8.

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. `skill_advisor.py` shim detects daemon + routes to native; falls back to local on absence.
2. Plugin bridge detects daemon + delegates to `advisor_recommend`.
3. All Phase 025/026 fixes preserved: `--stdin`, SIGKILL escalation, workspace cache key, shared disable flag.
4. Install guide has updated bootstrap + rollback sections.
5. Manual-testing playbook includes native-path scenarios.
6. Prompt-safe status: superseded skills render redirect metadata.

### 4.2 P1 (Required)
1. `--force-local` and `--force-native` CLI flags for testing.
2. Archived / future / rolled-back status surfaces render correctly.
3. Python-shim path preserved for scripted callers during transition.
4. Disable flag `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` honored across all compat paths.
5. Integration test: plugin path + shim path both exercise the same corpus, match native output.

### 4.3 P2 (Suggestion)
1. Deprecation notice in Python CLI output pointing at MCP tool.
2. Gate 2 fallback in CLAUDE.md updated to mention native MCP path first.

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** Run `skill_advisor.py "build a React component"` with daemon running → routed to `advisor_recommend` → same output shape as direct tool call.
2. **AC-2** Run same command with daemon absent → falls back to local Python scoring → still returns valid result.
3. **AC-3** Plugin bridge invoked with daemon available → uses native; verified by log + trace.
4. **AC-4** Disable flag set → all compat paths return `disabled` brief.
5. **AC-5** Install guide walkthrough on fresh checkout succeeds (manual test).
6. **AC-6** Supersession fixture: prompt naming old `sk-X-v1` returns redirect metadata.
7. **AC-7** Archived skill fixture: prompt matching archived skill returns with `status: "archived"`.
8. **AC-8** `--stdin` mode still works (Phase 025 regression).

## 6. FILES TO CHANGE

### Modified (existing surfaces)
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py` — shim rewrite
- `.opencode/plugins/spec-kit-skill-advisor.js` — bridge rewiring
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` — delegation logic
- `.opencode/skill/system-spec-kit/install_guide/**` — bootstrap + rollback
- `.opencode/skill/skill-advisor/manual_testing_playbook/**` — native + redirect scenarios
- `.opencode/skill/skill-advisor/README.md` — native path primary, shim secondary
- `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` — daemon boot + native registration

### New (under `mcp_server/skill-advisor/`)
- `lib/compat/daemon-probe.ts` — daemon availability detection
- `lib/compat/redirect-metadata.ts` — supersession/archive/future/rollback rendering
- `tests/compat/shim.vitest.ts` — Python shim route test (may require daemon fixture)
- `tests/compat/plugin-bridge.vitest.ts` — plugin bridge route test
- `tests/compat/redirect-metadata.vitest.ts` — lifecycle status rendering

### Kept read-only
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py` — Python scorer retained for fallback
- `CLAUDE.md` / `AGENTS.md` — Gate 2 ref update deferred unless directly required
