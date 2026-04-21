---
title: "Implementation Plan: Codex Integration + Hook Policy"
description: "New hooks/codex/ adapter + dynamic hook-policy detector + Bash-only PreToolUse deny + prompt-wrapper fallback + parity extension."
trigger_phrases:
  - "020 008 plan"
  - "codex integration plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/008-codex-integration-and-hook-policy"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 005 converges"
    blockers: []
    key_files: []

---
# Implementation Plan: Codex Integration + Hook Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Runtime** | Codex CLI |
| **Transports** | `UserPromptSubmit` → JSON `additionalContext`; `PreToolUse` → `decision: "deny"` for Bash; prompt-wrapper fallback for legacy |
| **New module** | `mcp_server/hooks/codex/` + `lib/codex-hook-policy.ts` |

### Overview

Build the Codex side of the advisor train. Narrow enforcement boundary: advice via UserPromptSubmit, Bash-only deny via PreToolUse, prompt-wrapper fallback for legacy. Dynamic hook-policy detector replaces hard-coded "unavailable" repo-wide.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 002 + 004 + 005 merged (005 hard gate lifted)
- [x] Codex runtime capability captured + committed as fixture

### Definition of Done
- [ ] Codex adapter shipped + registered — adapter shipped; `.codex/` registration blocked by sandbox EPERM
- [x] Dynamic detector replaces all hard-coded "unavailable"
- [x] Parity test passes for 4 runtimes
- [x] Manual smoke test in real Codex session deferred to T9 per execution plan
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Mirror claude/gemini/copilot adapter shapes. Add dynamic policy detector as a new lib module. Narrow PreToolUse scope to Bash-only.

### Key Components

```
mcp_server/
  hooks/codex/                         NEW
    user-prompt-submit.ts              Advisor adapter
    pre-tool-use.ts                    Bash-only deny
    prompt-wrapper.ts                  Legacy fallback
  lib/
    codex-hook-policy.ts               NEW — dynamic detector
  tests/
    codex-user-prompt-submit-hook.vitest.ts   NEW
    codex-hook-policy.vitest.ts               NEW
    advisor-runtime-parity.vitest.ts          MODIFIED (add Codex)

.codex/settings.json                   NEW / MODIFY — register hooks
```

### Data Flow (UserPromptSubmit)

```
Codex event
  ├─ stdin OR argv JSON parse (defensive)
  ├─ if env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED="1" → empty stdout
  ├─ buildSkillAdvisorBrief({ runtime: 'codex' })
  ├─ if brief → stdout JSON { hookSpecificOutput: { hookEventName, additionalContext } }
  └─ else → empty stdout
```

### Data Flow (PreToolUse — Bash only)

```
Codex PreToolUse event
  ├─ if tool !== 'bash' → emit no decision (allow)
  ├─ load Bash denylist from .codex/policy.json
  ├─ if command matches denylist entry (full-word, not substring) → emit { decision: "deny", reason }
  └─ else → emit no decision
```

### Dynamic Policy Detector

```
detectCodexHookPolicy(): 'live' | 'partial' | 'unavailable'
  ├─ spawn: codex --version (with 500ms timeout)
  ├─ if fails → 'unavailable'
  ├─ spawn: codex hooks list (if supported)
  ├─ parse hook support matrix
  └─ return 'live' / 'partial' / 'unavailable'
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dynamic policy detector
- [x] Create `lib/codex-hook-policy.ts`
- [x] Implement `detectCodexHookPolicy()` with version + hooks-list probes
- [x] Cache per session (1 probe)
- [x] Write `codex-hook-policy.vitest.ts`
- [x] Replace all hard-coded `hookPolicy: "unavailable"` references

### Phase 2: UserPromptSubmit adapter
- [x] Create `hooks/codex/user-prompt-submit.ts`
- [x] Defensive stdin/argv parse
- [x] Call producer + emit JSON additionalContext
- [x] Fail-open
- [x] Write `codex-user-prompt-submit-hook.vitest.ts`

### Phase 3: PreToolUse adapter (narrow)
- [x] Create `hooks/codex/pre-tool-use.ts`
- [x] Load Bash denylist from `.codex/policy.json`
- [x] Emit `decision: "deny"` only for Bash match
- [x] Write Bash-match tests

### Phase 4: Prompt-wrapper fallback
- [x] Create `hooks/codex/prompt-wrapper.ts`
- [x] Used only when policy detector returns `"unavailable"`
- [x] Document in implementation-summary.md

### Phase 5: Parity + registration
- [x] Extend `advisor-runtime-parity.vitest.ts` to add Codex
- [ ] Register hooks in `.codex/settings.json` — blocked by sandbox EPERM
- [x] Capture runtime-capability fixture

### Phase 6: Verification
- [x] All new tests green
- [x] Parity 4/4 runtimes
- [x] grep for hardcoded "unavailable" = 0 hits
- [x] Manual Codex smoke test deferred to T9 per execution plan
- [x] `tsc --noEmit` clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Policy detector (version probe, hooks list parse) | vitest (with mock spawn) |
| Unit | UserPromptSubmit adapter | vitest |
| Unit | PreToolUse Bash denylist | vitest |
| Integration | Parity extension (Codex added) | vitest |
| Smoke | Real Codex session | Manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 002 shared-payload | Predecessor | Pending |
| 004 producer | Predecessor | Pending |
| 005 renderer + comparator | Predecessor (HARD GATE) | Pending |
| Codex CLI | Runtime | Live (version-dependent) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: Codex hook blocks a turn OR parity regression.

**Procedure**: unregister Codex hooks from `.codex/settings.json`. Other runtimes (Claude, Gemini, Copilot) unaffected. Restore hard-coded `"unavailable"` temporarily if dynamic detector causes regressions.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Dynamic policy detector | Med | 2-3 hours |
| UserPromptSubmit adapter | Med | 2-3 hours |
| PreToolUse Bash deny | Med | 2-3 hours |
| Prompt-wrapper fallback | Low-Med | 1-2 hours |
| Parity + registration | Low | 1-2 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **10-18 hours (1.25-2.25 days)** |
<!-- /ANCHOR:effort -->
