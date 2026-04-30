---
title: "Verification Checklist: cli-copilot Dispatch Test Parity"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
description: "P0/P1/P2 quality gates for the cli-matrix.vitest.ts cli-copilot section refresh. P0 must pass before merge; P1 should pass; P2 are nice-to-haves."
trigger_phrases:
  - "017 checklist"
  - "cli-copilot dispatch test parity checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity"
    last_updated_at: "2026-04-27T18:30:00Z"
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

# Verification Checklist: cli-copilot Dispatch Test Parity

> Each item cites the spec REQ or success criterion that drives it. Mark complete only with verifiable evidence (file path, command output, or test name).

---

<!-- ANCHOR:p0-gates -->
## P0 — Blockers (MUST pass before merge)

### Test surface

- [x] **REQ-001 — Legacy cli-copilot assertions removed**: `grep -n "resolveCopilotPromptArg\|\\-p \"\\$(cat" mcp_server/tests/deep-loop/cli-matrix.vitest.ts` returns 0 hits inside test bodies. The legacy `-p "$(cat ...)"` and `Read the instructions in @path` assertions are gone. [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-002 — `buildCopilotPromptArg` exercised directly**: `grep -n "buildCopilotPromptArg" mcp_server/tests/deep-loop/cli-matrix.vitest.ts` returns ≥4 hits (1 import + 4+ calls inside the new describe block + smoke test). [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-003 — `kind:"approved"` + small prompt asserted**: vitest case "kind:\"approved\" + small prompt: argv carries preamble inline, no promptFileBody" passes; asserts `argv[1]` contains `## TARGET AUTHORITY` + `Approved spec folder: <APPROVED_FOLDER>` + the original prompt; `built.promptFileBody === undefined`; `built.enforcedPlanOnly === false`. [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-004 — `kind:"approved"` + large prompt asserted**: vitest case "kind:\"approved\" + large prompt: argv carries bare @PROMPT_PATH, promptFileBody set with preamble" passes; asserts `argv[1] === \`@${promptPath}\``, `argv[1]` does NOT contain the legacy `Read the instructions in` wrapper, `promptFileBody` defined and ordered preamble → divider → body. [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-005 — `kind:"missing"+writeIntent:false` asserted**: vitest case "kind:\"missing\" + writeIntent:false" passes; asserts `argv[1] === prompt`, no preamble, `--allow-all-tools` retained, `promptFileBody === undefined`, argv length unchanged. [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-006 — `kind:"missing"+writeIntent:true` asserted**: vitest case "kind:\"missing\" + writeIntent:true" passes; asserts argv prompt slot is the Gate-3 question, `--allow-all-tools` stripped, `enforcedPlanOnly === true`, argv length shrinks by 1, original write-intent prompt absent from rendered body. [EVIDENCE: see retained verification text in this checklist item.]

### YAML ordering invariant

- [x] **REQ-007 — Both `_auto.yaml` files write `built.promptFileBody` BEFORE invoking copilot**: vitest case "YAML auto-loop sites write built.promptFileBody to disk before invoking copilot" passes; for both `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml`: the file contains `if (built.promptFileBody !== undefined)` AND `writeFileSync(promptPath, built.promptFileBody` AND a copilot dispatch (`spawnSync('copilot'` or `command: 'copilot'`); the dispatch byte-offset is greater than the writeFileSync byte-offset. [EVIDENCE: see retained verification text in this checklist item.]

### Test runs

- [x] **REQ-008 — All 13 cli-matrix tests pass**: `npx vitest run tests/deep-loop/cli-matrix.vitest.ts` returns `Tests 13 passed (13)` and exit 0. [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-009 — Full deep-loop suite green**: `npx vitest run tests/deep-loop/` returns `Tests 73 passed (73)` and exit 0; 6 test files pass. [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-010 — 012 helper test suite green (no regression)**: `npx vitest run tests/executor-config-copilot-target-authority.vitest.ts` returns `Tests 29 passed (29)` and exit 0. [EVIDENCE: see retained verification text in this checklist item.]
<!-- /ANCHOR:p0-gates -->

---

<!-- ANCHOR:p1-gates -->
## P1 — Required (complete OR user-approved deferral)

- [x] **REQ-011 — Smoke test models the approved-authority happy path**: vitest "exercises the large-prompt approved-authority dispatch with a real subprocess and artifact writes" passes; subprocess reads `promptPath` and confirms it opens with `## TARGET AUTHORITY` followed by `Approved spec folder: <APPROVED_FOLDER>` followed by the original prompt body; the outer test asserts the on-disk file contents match. [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-012 — `buildDispatchCommand` cli-copilot branch fails loud**: source review confirms the case throws `new Error('buildDispatchCommand does not model cli-copilot. Use buildCopilotPromptArg + the dedicated describe block in this file.')`. No test exercises this directly — it's anti-regression dead code. [EVIDENCE: see retained verification text in this checklist item.]
- [x] **REQ-013 — Production code byte-stable**: `git diff --stat` shows ONLY `cli-matrix.vitest.ts` and packet docs; `executor-config.ts`, `spec_kit_deep-research_auto.yaml`, and `spec_kit_deep-review_auto.yaml` are NOT in the diff. [EVIDENCE: see retained verification text in this checklist item.]
- [ ] **Operator review of packet docs and test rewrite**: pending. Tracked as T301 in tasks.md.
<!-- /ANCHOR:p1-gates -->

---

<!-- ANCHOR:p2-gates -->
## P2 — Refinements (nice-to-have)

- [ ] **Live cli-copilot dispatch verification**: next deep-research or deep-review run that exercises cli-copilot confirms the `## TARGET AUTHORITY` preamble appears in the rendered iteration prompt (under the workflow's `state_paths.prompt_dir`, file name `iteration-NNN`) and ZERO unauthorized folder mutations occur. (Same verification as 012's deferred P2; this packet hardens the test layer but doesn't change the live contract.)
- [ ] **Sibling packet 016 (Degraded-readiness envelope parity, P1) ships**: required for the 011 deep-review CONDITIONAL → PASS conversion. Independent of this packet but tracked as a follow-up at the 011 phase-parent level.
- [ ] **Sibling packet 018 (Catalog/playbook degraded alignment, P2) ships**: required for the catalog/playbook drift findings (F-005, F-007). Independent of this packet but tracked at the 011 phase-parent level.
<!-- /ANCHOR:p2-gates -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 4 | 3/4 (operator review pending) |
| P2 Items | 3 | 0/3 (deferred — sibling packets / live dispatch) |

**Verification Date**: 2026-04-27
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Implementer | claude-opus-4-7 (1M context) | 2026-04-27 | All P0 verified; awaiting operator review on P1 sign-off. P2 items are sibling-packet or live-run deferrals. |
| Operator | | | Pending. |
<!-- /ANCHOR:sign-off -->
