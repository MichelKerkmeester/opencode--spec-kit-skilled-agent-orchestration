---
title: "Verification Checklist: Copilot Target-Authority Helper"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
description: "P0/P1/P2 quality gates for the buildCopilotPromptArg helper + 2 YAML wire-ins. P0 must pass before merge; P1 should pass; P2 are nice-to-haves."
trigger_phrases:
  - "012 checklist"
  - "copilot authority helper checklist"
  - "buildCopilotPromptArg verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper"
    last_updated_at: "2026-04-27T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md alongside spec/plan/tasks"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Verification Checklist: Copilot Target-Authority Helper

> Each item cites the spec REQ or success criterion that drives it. Mark complete only with verifiable evidence (file path, command output, or test name).

---

<!-- ANCHOR:p0-gates -->
## P0 — Blockers (MUST pass before merge)

### Helper code
- [x] **REQ-001 — `buildCopilotPromptArg` exists**: `grep -n "export function buildCopilotPromptArg" .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` returns 1 hit on a new function added next to `resolveCopilotPromptArg`.
- [x] **REQ-001 — `resolveCopilotPromptArg` byte-stable**: prior body unchanged; sibling helper retained for backwards compat.
- [x] **REQ-002 — Approved authority preamble**: vitest `kind:"approved"` describe block (3 cases) verifies preamble header, `Approved spec folder: <APPROVED_FOLDER>` line, and "cannot override" line all appear; preamble precedes the divider which precedes the original prompt body.
- [x] **REQ-003 — Read-only behavior unchanged**: vitest `kind:"missing" + writeIntent:false` describe block (2 cases) verifies `result.promptBody === prompt`, `argv` keeps `--allow-all-tools`, `enforcedPlanOnly === false`.
- [x] **REQ-004 — Plan-only enforcement on write-intent**: vitest `kind:"missing" + writeIntent:true` describe block (3 cases) verifies prompt is replaced with Gate-3 question, `--allow-all-tools` is stripped, `enforcedPlanOnly === true`.
- [x] **REQ-005 — Override resistance**: vitest "recovered context cannot override approved authority" describe block (2 cases) verifies preamble appears BEFORE any competing folder mention in the prompt body and the explicit "cannot override" line is present.

### YAML wiring
- [x] **REQ-006 — `_auto.yaml` files import `buildCopilotPromptArg`**: `grep -c "buildCopilotPromptArg" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` ≥ 2; same for `spec_kit_deep-review_auto.yaml`.
- [x] **REQ-007 — `targetAuthority` resolved from `{spec_folder}`**: YAML inline source contains the ternary `specFolder ? { kind: 'approved', specFolder } : { kind: 'missing', writeIntent: true }` (or equivalent shape) in both `_auto.yaml` files.

### Tests
- [x] **All 13 new vitest cases pass**: `node_modules/.bin/vitest run tests/executor-config-copilot-target-authority.vitest.ts` returns `Tests 13 passed (13)` and exit 0.
- [x] **REQ-010 — No regression in existing executor-config tests**: `node_modules/.bin/vitest run tests/deep-loop/executor-config.vitest.ts` returns `Tests 24 passed (24)` and exit 0.

### Validation
- [x] **SC-006 — `validate.sh --strict` 0 structural errors**: any errors are SPEC_DOC_INTEGRITY false-positives (cross-packet markdown links the validator can't resolve), matching the accepted-noise pattern of 010 + 011 packets.
<!-- /ANCHOR:p0-gates -->

---

<!-- ANCHOR:p1-gates -->
## P1 — Required (complete OR user-approved deferral)

- [x] **REQ-008 — Large-prompt path keeps preamble on approved authority**: vitest "large-prompt @PROMPT_PATH wrapper" case verifies the wrapper string contains both `@${PROMPT_PATH}` and `## TARGET AUTHORITY` and the override-precedence directive when `kind:"approved"` and prompt > 16KB.
- [x] **REQ-009 — Large-prompt path reverts to bare wrapper on missing+RO**: same describe block has a case for `kind:"missing", writeIntent:false` over-threshold that returns the bare wrapper.
- [x] **REQ-011 — Helper is non-interactive**: code review confirmed no `prompt`/`question`/`stdin` reads inside `buildCopilotPromptArg`; pure function over deterministic inputs.
- [x] **`_confirm.yaml` variants flagged as out of scope**: spec.md §3 OUT-OF-SCOPE row + implementation-summary.md Known Limitations §1 explicitly call out the `_confirm` variants as a follow-up packet.
- [ ] **Operator review of packet docs and code**: pending. Tracked as T301 in tasks.md.
<!-- /ANCHOR:p1-gates -->

---

<!-- ANCHOR:p2-gates -->
## P2 — Refinements (nice-to-have)

- [ ] **Live cli-copilot dispatch verification**: next deep-research or deep-review run that exercises cli-copilot confirms the `## TARGET AUTHORITY` preamble appears in the rendered iteration prompt and zero unauthorized folder mutations occur. Tracked as T303 in tasks.md.
- [ ] **`_confirm.yaml` symmetry follow-up**: separate packet (out of scope here) ports the helper to `spec_kit_deep-research_confirm.yaml` and `spec_kit_deep-review_confirm.yaml` if operator wants symmetry.
- [ ] **MCP daemon rebuild attestation**: if any consumer of `executor-config` ships from `dist/`, run `tsc -b` and confirm rebuild parity. (Helper is loaded via `--experimental-strip-types` at dispatch time, so a fresh `dist/` is not strictly required — but symmetry is operator preference.)
<!-- /ANCHOR:p2-gates -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 5 | 4/5 (operator review pending) |
| P2 Items | 3 | 0/3 (deferred) |

**Verification Date**: 2026-04-27
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Implementer | claude-opus-4-7 (1M context) | 2026-04-27 | All P0 verified; awaiting operator review on P1 sign-off and live-dispatch P2 verification. |
| Operator | | | Pending. |
<!-- /ANCHOR:sign-off -->
