---
title: "Verification Checklist: Copilot CLI Hook Parity Remediation"
description: "P0/P1/P2 verification items mapped to REQs. Evidence-driven. Marks complete only when cited from the artifact itself."
trigger_phrases:
  - "026/009/004 checklist"
  - "copilot hook parity checklist"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/004-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Copilot file workaround and updated operator docs"
    next_safe_action: "Run memory save"
    completion_pct: 100
---
# Verification Checklist: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->

**Legend:** **P0** = blocker, **P1** = required, **P2** = recommended.

---

## P0 — Blockers

- [x] **P0-01** — `research.md` exists in this folder with >=3 primary-source citations (REQ-001). *Evidence*: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-01/research.md` has 30+ primary-source URLs across GitHub docs, GitHub issues, and GitHub changelog sources. Rechecked 2026-04-22 against GitHub docs for hook output and custom instructions.
- [x] **P0-02** — Phase 1 outcome is classified as A, B, or C with rationale (REQ-003). *Evidence*: `decision-record.md` ADR-003 Status=Accepted, outcome **B (file-based workaround)**.
- [x] **P0-03** — `decision-record.md` contains a decision matrix with columns: mechanism, feasibility, cost, risk, recommended (REQ-002). *Evidence*: ADR-003 7-row matrix.
- [x] **P0-04** — Claude hook regression test passes (REQ-004). *Evidence*: `npx vitest run ... tests/claude-user-prompt-submit-hook.vitest.ts` passed in the 4-file focused run, 28 tests total.
- [x] **P0-05** — Parent summary updated with phase outcome (REQ-007). *Evidence*: `../implementation-summary.md` lists outcome B and active limitations.

## P1 — Required

- [x] **P1-01** — If outcome A: `hooks/copilot/user-prompt-submit.ts` exists. *Evidence*: N/A for outcome A; the file exists but implements outcome B custom-instructions writing rather than hook prompt mutation.
- [x] **P1-02** — If outcome A: `tests/copilot-user-prompt-submit-hook.vitest.ts` exists and passes. *Evidence*: N/A for outcome A; the test exists and passes for outcome B file-based behavior.
- [x] **P1-03** — If outcome A: hook registration wires Copilot path alongside Claude. *Evidence*: N/A for outcome A; `.github/hooks/superset-notify.json` wires `userPromptSubmitted` through `.github/hooks/scripts/user-prompt-submitted.sh`.
- [x] **P1-04** — If outcome A or B: SC-002 passes — empirical test in fresh Copilot CLI session returns non-empty startup + advisor output. *Evidence*: 2026-04-22 smoke after hook refresh: `copilot -p "From your custom instructions, quote the Active Advisor Brief line..." --model gpt-5.4` returned `Advisor: stale; use sk-code-opencode 0.92/0.00 pass.`
- [x] **P1-05** — `cli-copilot/SKILL.md` documents the current parity state (REQ-006). *Evidence*: `SKILL.md` contains "Spec Kit Context Parity" and states startup context/advisor brief use the custom-instructions file.
- [x] **P1-06** — `cli-copilot/README.md` mirrors SKILL.md's parity statement. *Evidence*: README feature reference, configuration, FAQ, and structure tree mention the managed custom-instructions block.
- [x] **P1-07** — `implementation-summary.md` carries the final outcome label (A/B/C) and file list. *Evidence*: metadata table shows outcome B; "What Was Built" lists hook, wrapper, docs, and tests.
- [x] **P1-08** — `validate.sh --strict` exit code recorded in implementation-summary. Evidence: implementation summary verification section records parent and target validation failures, including target 5 errors / 5 warnings.

## P2 — Recommended

- [x] **P2-01** — If outcome B or C: workaround shell wrapper shipped with usage docs (REQ-008). *Evidence*: `.opencode/skill/cli-copilot/assets/shell_wrapper.md`.
- [x] **P2-02** — `research.md` captures enough detail that a future Gemini-parity effort can reuse the methodology (REQ-009). *Evidence*: research synthesis section 9 "Methodology notes".
- [ ] **P2-03** — `generate-context.js` emits no POST-SAVE QUALITY REVIEW HIGH issues. Evidence: not satisfied; `generate-context.js` exited 0 and refreshed graph metadata, but canonical spec-doc indexing failed 8/8 and post-save review returned `REVIEWER_ERROR`.

---

## VERIFICATION LOG

- 2026-04-22 11:04 | P0-04/P1-02 | Focused Vitest passed: 4 files / 27 tests before hook wiring, then 4 files / 28 tests after wrapper wiring.
- 2026-04-22 11:06 | P1-04 | Real Copilot smoke returned the managed advisor line from custom instructions.
- 2026-04-22 11:06 | P1-05/P1-06/P2-01 | cli-copilot skill docs, README, and shell wrapper updated.
- 2026-04-22 11:07 | P0-05 | Parent summary updated.
- 2026-04-22 11:10 | P1-08 | Final validation failures recorded in implementation summary.
- 2026-04-22 11:14 | P2-03 | Context generation invoked; graph metadata refreshed, but indexing/reviewer errors keep P2-03 open.
- 2026-04-22 11:58 | P1-05/P1-06/T-18 | Hook reference, validation guide, runtime hook matrix, README, architecture doc, feature catalog, and manual testing playbook updated for Copilot custom-instructions transport; temp-file smoke and `git diff --check` passed.

---

## COMPLETION STATEMENT

Outcome B is implemented and functionally verified. All P0 items are complete and all applicable P1 implementation items are complete, but strict spec validation and clean post-save indexing remain open documentation-system follow-ups. Full package lint remains blocked by unused-variable findings outside this packet's write scope; scoped lint and all functional verification for this packet passed.
