---
title: Universal Debugging Checklist
description: Stack-agnostic 4-phase debugging workflow checklist. Stack-specific debugging tools (DevTools for web, dlv for Go, LLDB for Swift) are referenced from the stack debugging docs.
keywords: [debugging, checklist, root-cause, universal, stack-agnostic]
---

# Universal Debugging Checklist

Stack-agnostic 4-phase debugging workflow. Use as a structured progression for any non-trivial debugging session.

> **Web stack note**: For DevTools console capture, network panel walks, performance profiles, multi-viewport testing, and Webflow-specific debugging, see `references/web/debugging/debugging_workflows.md`.

---

## Phase 1: Root Cause Investigation

- [ ] **Reproduce reliably** — can you trigger the failure on demand? If not, log everything until you can.
- [ ] **Capture exact error output** — full stack trace + exit code + log lines (verbatim, no paraphrase)
- [ ] **Identify the failing surface** — UI / API / build / runtime / external service
- [ ] **Note last-known-good state** — last successful run, last green commit, last working environment
- [ ] **Diff what changed** — `git diff <last-good>..HEAD` (code) + dependency lockfile + env vars

## Phase 2: Pattern Analysis

- [ ] **Search the error string** — issue tracker, community forum, language docs (verbatim error string is search gold)
- [ ] **Identify symptom vs cause** — is the error message the actual problem or downstream of something earlier?
- [ ] **Trace backward from symptom** — symptom → immediate cause → source. Fix at source, not symptom.
- [ ] **Look for similar past issues** — git log grep for keywords; runbook entries; team Slack archive

## Phase 3: Hypothesis Testing

- [ ] **State your hypothesis** — write it down in one sentence
- [ ] **Predict the test outcome** — what evidence would confirm? What would refute?
- [ ] **Test ONE thing at a time** — never change multiple variables in one experiment
- [ ] **Document each test result** — pass/fail + observed evidence

**Three-strike rule**: if 3+ hypotheses fail, STOP and reconsider. Either:
- Your mental model of the system is wrong (re-investigate)
- The bug is in a layer you haven't considered (widen scope)
- You need a fresh pair of eyes (escalate)

## Phase 4: Implementation (the fix)

- [ ] **Fix at root, not at symptom** — symptom-fixes leave latent bugs
- [ ] **Add a regression test** — codify the bug so it can't recur silently
- [ ] **Document root cause in the commit message** — future grepping should find it
- [ ] **Verify the fix runs the original reproduction step** — close the loop

---

## Stack-Specific Debug Tooling

| Stack | Primary tool | Reference |
|---|---|---|
| WEB | Chrome DevTools (Console + Network + Performance) | `references/web/debugging/debugging_workflows.md` |
| GO | `dlv debug`, `go test -run X -v`, `gops` | `references/go/_placeholder.md` (canonical content retired) |
| NODEJS | `node --inspect`, `console.trace`, `debugger;` | `references/nodejs/_placeholder.md` (canonical content retired) |
| REACT | React DevTools, browser console, error boundaries | `references/react/_placeholder.md` (canonical content retired) |
| REACT_NATIVE | React DevTools + RN debugger; Flipper | `references/react-native/_placeholder.md` (canonical content retired) |
| SWIFT | Xcode debugger (LLDB), Instruments | `references/swift/_placeholder.md` (canonical content retired) |

---

## Universal Anti-Patterns

- [ ] **Avoid**: Changing multiple things at once
- [ ] **Avoid**: Skipping the reproduction step ("works on my machine" is not a fix)
- [ ] **Avoid**: Fixing the symptom without tracing to root
- [ ] **Avoid**: Deploying a fix without a regression test
- [ ] **Avoid**: 4th attempt without questioning your model of the system
- [ ] **Avoid**: Leaving debug instrumentation (console.log, fmt.Println, print) in the committed fix
