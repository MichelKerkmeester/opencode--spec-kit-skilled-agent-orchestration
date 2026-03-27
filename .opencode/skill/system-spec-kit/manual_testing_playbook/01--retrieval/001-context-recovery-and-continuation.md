---
title: "M-001 -- Context Recovery and Continuation"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-001`."
---

# M-001 -- Context Recovery and Continuation

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-001`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `/spec_kit:resume specs/<target-spec>. Capture the evidence needed to prove the resume-ready state summary and next steps. Return a concise user-facing pass/fail verdict with the main reason.`
- Commands:
  1. `memory_context({ input: "resume previous work continue session", mode: "resume", specFolder: "specs/<target-spec>", includeContent: true })` — primary recovery path
  2. If resume-mode returns a clear session match, verify the recovery summary includes: last action, next steps, likely files
  3. If results are empty or low-confidence, fall back to `memory_list({ limit: 5, sortBy: "updated_at" })` to discover recent candidates
  4. Optionally enrich with `CONTINUE_SESSION.md` crash breadcrumbs if present in the spec folder
  5. If summary is still thin, run anchored fallback: `memory_search({ query: "session state next steps summary blockers", specFolder: "specs/<target-spec>", anchors: ["state","next-steps","summary","blockers"], includeContent: true, limit: 5 })`
- Expected: Resume-ready state summary and next steps via `memory_context(mode:"resume")` as primary path.
- Evidence: returned context + extracted next actions + recovery source identification (memory_context / continue_session / memory_search / user).
- Pass: `memory_context(mode:"resume")` is used as the primary recovery path; continuation context is actionable and specific.
- Fail triage: verify `memory_context` resume mode routes correctly; broaden anchors on fallback search; verify spec folder path; check `CONTINUE_SESSION.md` presence.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/01-unified-context-retrieval-memorycontext.md](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: M-001
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/001-context-recovery-and-continuation.md`
