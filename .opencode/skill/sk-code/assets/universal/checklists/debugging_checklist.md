---
title: Universal Debugging Checklist
description: Stack-agnostic 4-phase debugging workflow checklist for any non-trivial debugging session.
---

# Universal Debugging Checklist - Stack-Agnostic 4-Phase Workflow

Stack-agnostic 4-phase debugging workflow. Use as a structured progression for any non-trivial debugging session across the WEBFLOW, NEXTJS, and GO stacks.

## 1. OVERVIEW

### Purpose

Captures the universal debugging protocol that applies regardless of stack: reproduce reliably, identify root cause, test one hypothesis at a time, fix at source. Stack-specific tooling (Chrome DevTools for WEBFLOW, React DevTools for NEXTJS, dlv for GO) is referenced from each stack's debugging docs — this checklist enforces the discipline that wraps those tools.

### Usage

Walk this checklist top-to-bottom on any debugging session that survives more than two trivial fixes. Mark items `[x]` as you complete them and reference the stack-specific debugging workflow doc when you reach Phase 1's tool-selection step. Stop at the three-strike rule (Section 2.3) when three hypotheses fail.

---

## 2. THE 4-PHASE WORKFLOW

### Phase 1: Root Cause Investigation

- [ ] **Reproduce reliably** — can you trigger the failure on demand? If not, log everything until you can.
- [ ] **Capture exact error output** — full stack trace + exit code + log lines (verbatim, no paraphrase).
- [ ] **Identify the failing surface** — UI / API / build / runtime / external service.
- [ ] **Note last-known-good state** — last successful run, last green commit, last working environment.
- [ ] **Diff what changed** — `git diff <last-good>..HEAD` (code) + dependency lockfile + env vars.

### Phase 2: Pattern Analysis

- [ ] **Search the error string** — issue tracker, community forum, language docs (verbatim error string is search gold).
- [ ] **Identify symptom vs cause** — is the error message the actual problem or downstream of something earlier?
- [ ] **Trace backward from symptom** — symptom → immediate cause → source. Fix at source, not symptom.
- [ ] **Look for similar past issues** — git log grep for keywords, runbook entries, team Slack archive.

### Phase 3: Hypothesis Testing

- [ ] **State your hypothesis** — write it down in one sentence.
- [ ] **Predict the test outcome** — what evidence would confirm? What would refute?
- [ ] **Test ONE thing at a time** — never change multiple variables in one experiment.
- [ ] **Document each test result** — pass/fail with observed evidence.

**Three-strike rule**: if 3+ hypotheses fail, STOP and reconsider. Either the mental model of the system is wrong (re-investigate), the bug is in a layer not yet considered (widen scope), or a fresh pair of eyes is needed (escalate).

### Phase 4: Implementation (the fix)

- [ ] **Fix at root, not at symptom** — symptom-fixes leave latent bugs.
- [ ] **Add a regression test** — codify the bug so it can't recur silently.
- [ ] **Document root cause in the commit message** — future grepping should find it.
- [ ] **Verify the fix runs the original reproduction step** — close the loop.

---

## 3. STACK-SPECIFIC DEBUG TOOLING

| Stack | Primary tool | Reference |
|---|---|---|
| WEBFLOW | Chrome DevTools (Console + Network + Performance) | `references/webflow/debugging/debugging_workflows.md` |
| NEXTJS | React DevTools, browser console, error boundaries (stub) | `references/nextjs/debugging/debugging_workflows.md` |
| GO | `dlv debug`, `go test -run X -v`, `slog`, `pprof` (stub) | `references/go/debugging/debugging_workflows.md` |
| UNKNOWN | Disambiguation prompt — sk-code does not own Node.js / React Native / Swift / other stacks | n/a |

---

## 4. UNIVERSAL ANTI-PATTERNS

- [ ] **Avoid**: Changing multiple things at once.
- [ ] **Avoid**: Skipping the reproduction step ("works on my machine" is not a fix).
- [ ] **Avoid**: Fixing the symptom without tracing to root.
- [ ] **Avoid**: Deploying a fix without a regression test.
- [ ] **Avoid**: 4th attempt without questioning your model of the system.
- [ ] **Avoid**: Leaving debug instrumentation (console.log, fmt.Println, print) in the committed fix.

---

## 5. RELATED RESOURCES

- `references/router/phase_lifecycle.md` — Phase 2 Debugging position in the sk-code lifecycle.
- `references/universal/error_recovery.md` — universal recover-in-place / rollback / escalate decision tree.
- `assets/universal/checklists/verification_checklist.md` — runs after debugging completes, before any "done" claim.
- `references/webflow/debugging/debugging_workflows.md` — WEBFLOW deep-dive (DevTools workflows, network capture, multi-viewport).
- `references/nextjs/debugging/debugging_workflows.md` — NEXTJS stub (Server vs Client Component bugs, hydration mismatches).
- `references/go/debugging/debugging_workflows.md` — GO stub (dlv, slog, race detector, pprof).
