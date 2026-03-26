---
title: "190 -- Session recovery via /memory:continue"
description: "This scenario validates session recovery via /memory:continue for `190`. It focuses on Verify resume-mode recovery uses the documented fallback chain and produces an actionable continuation summary."
---

# 190 -- Session recovery via /memory:continue

## 1. OVERVIEW

This scenario validates session recovery via /memory:continue for `190`. It focuses on Verify resume-mode recovery uses the documented fallback chain and produces an actionable continuation summary.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `190` and confirm the expected signals without contradicting evidence.

- Objective: Verify `/memory:continue` uses `memory_context` in `resume` mode as the primary recovery path, falls back through `CONTINUE_SESSION.md`, anchored `memory_search()`, and `memory_list()` when needed, supports auto and manual recovery modes, and routes the user to the correct next step after recovery
- Prompt: `Validate session recovery via /memory:continue. Capture the evidence needed to prove resume-mode memory_context is the primary recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and manual recovery modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `memory_context(mode: "resume")` is the first recovery path; fallback behavior uses the documented resume anchors and recent-candidate discovery; auto mode resolves a strong candidate with minimal prompting; manual mode shows 2-3 alternatives when ambiguity remains; the final response includes state and next-step guidance
- Pass/fail: PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips resume mode, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 190 | Session recovery via /memory:continue | Verify `/memory:continue` recovery chain, ambiguity handling, and post-recovery routing | `Validate session recovery via /memory:continue. Capture the evidence needed to prove resume-mode memory_context is the primary recovery path; the documented fallback chain activates when recovery is thin or ambiguous; auto and manual recovery modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/memory:continue specs/<target-spec>` or the equivalent recovery workflow for a real interrupted session and verify the command first calls `memory_context` in `resume` mode 2) Confirm resume recovery uses the documented anchors `["state", "next-steps", "summary", "blockers"]`, include-content behavior, and bounded token-budget response 3) If auto-resume is enabled for a reusable working-memory session, verify injected `systemPromptContext` is applied before token-budget enforcement 4) If the primary summary is thin, verify fallback to `memory_search()` using the same resume anchors 5) If no clear candidate exists, verify recent-candidate discovery through `memory_list()` and, when applicable, `CONTINUE_SESSION.md` crash breadcrumbs 6) Invoke manual recovery mode or force an ambiguous case and confirm the workflow presents the detected session plus 2-3 alternatives 7) Verify the final recovery response includes actionable state and next steps, then routes appropriately to a quick summary, `/spec_kit:resume <spec-folder>`, or `/memory:analyze history <spec-folder>` depending on user need | `memory_context(mode: "resume")` is primary; fallback chain activates correctly; manual mode shows alternatives when needed; final response contains actionable continuation state and next-step routing | Command transcript; tool invocation logs for resume, search, and list paths; evidence of crash breadcrumb use if present; final recovery summary showing state, next steps, and routing recommendation | PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips resume mode, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable | Verify `/memory:continue` command routing against `.opencode/command/memory/continue.md`; inspect `memory-context.ts` resume-mode wiring; confirm fallback search anchors and candidate-discovery list behavior; check session-manager breadcrumbs and reusable-session auto-resume settings |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/11-session-recovery-memory-continue.md](../../feature_catalog/01--retrieval/11-session-recovery-memory-continue.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 190
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/190-session-recovery-memory-continue.md`
