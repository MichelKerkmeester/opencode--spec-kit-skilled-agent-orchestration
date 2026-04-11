---
title: "190 -- Session recovery via /spec_kit:resume"
description: "This scenario validates interrupted-session recovery via /spec_kit:resume for `190`."
audited_post_018: true
phase_018_change: Removed CONTINUE_SESSION from the active ladder and aligned the recovery order to `handover.md -> _memory.continuity -> spec docs`.
---

# 190 -- Session recovery via /spec_kit:resume

## 1. OVERVIEW

This scenario validates interrupted-session recovery via `/spec_kit:resume` for `190`. It focuses on verifying that resume-mode recovery uses the documented fallback chain and produces an actionable continuation summary.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `190` and confirm the expected signals without contradicting evidence.

- Objective: Verify `/spec_kit:resume` uses `handover.md` first, then `_memory.continuity`, then supporting spec docs, with `memory_context(mode: "resume")` and `memory_search()` only filling gaps when the packet is thin; `memory_list()` still handles candidate discovery when needed
- Prompt: `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove handover.md is the first recovery source when present; _memory.continuity and supporting spec docs are consulted next; helper resume-mode memory_context and anchored memory_search only fill gaps when the packet is thin; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `handover.md` is preferred when fresh; `_memory.continuity` supplies supporting state when needed; `memory_context(mode: "resume")` is the helper recovery path when the packet is thin; fallback behavior uses the documented resume anchors and recent-candidate discovery; auto mode resolves a strong candidate with minimal prompting; confirm mode shows alternatives when ambiguity remains; the final response includes state and next-step guidance
- Pass/fail: PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips the canonical packet ladder, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 190 | Session recovery via /spec_kit:resume | Verify `/spec_kit:resume` recovery chain, ambiguity handling, and post-recovery routing | `Validate session recovery via /spec_kit:resume. Capture the evidence needed to prove handover.md is the first recovery source when present; _memory.continuity and supporting spec docs are consulted next; helper resume-mode memory_context and anchored memory_search only fill gaps when the packet is thin; auto and confirm resume modes behave correctly; the returned recovery summary includes actionable next steps and appropriate post-recovery routing. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/spec_kit:resume specs/<target-spec> :auto` or the equivalent recovery workflow for a real interrupted session and verify the command first reads `handover.md` when fresh handover data is present 2) Confirm the workflow then consults `_memory.continuity` in `implementation-summary.md` and the supporting spec docs before it reaches helper fallback paths 3) If the packet is thin, verify `memory_context` in `resume` mode is used as the helper recovery path with anchors `["state", "next-steps", "summary", "blockers"]`, include-content behavior, and bounded token-budget response 4) If still thin, verify anchored `memory_search()` using the same resume anchors 5) If no clear candidate exists, verify recent-candidate discovery through `memory_list()` 6) Invoke confirm mode or force an ambiguous case and confirm the workflow presents the detected session plus 2-3 alternatives 7) Verify the final recovery response includes actionable state and next steps, then routes appropriately to continued `/spec_kit:resume` work or `/memory:search history <spec-folder>` depending on user need | `handover.md` is primary after fresh handover handling; `_memory.continuity` and supporting spec docs follow; helper fallback paths activate correctly; confirm mode shows alternatives when needed; final response contains actionable continuation state and next-step routing | Command transcript; tool invocation logs for resume, search, and list paths; evidence of handover use if present; final recovery summary showing state, next steps, and routing recommendation | PASS: Recovery follows the documented chain and produces an actionable continuation summary; FAIL: primary recovery skips the canonical packet ladder, fallback routing is missing, ambiguity is mishandled, or the recovered state is not actionable | Verify `/spec_kit:resume` command routing against `.opencode/command/spec_kit/resume.md`; inspect `memory-context.ts` resume-mode wiring; confirm fallback search anchors and candidate-discovery list behavior; check session-manager breadcrumbs and reusable-session auto-resume settings |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/11-session-recovery-spec-kit-resume.md](../../feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 190
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/190-session-recovery-spec-kit-resume.md`
