---
title: Universal Verification Checklist
description: Stack-agnostic verification gate. WEB-specific browser-matrix items are referenced from web verification docs.
keywords: [verification, checklist, gate, completion, universal, stack-agnostic]
---

# Universal Verification Checklist

Run this BEFORE making any "done", "works", "complete", or "passing" claim. Stack-specific commands and matrices live in the stack docs; this checklist captures the universal protocol.

> **Web stack note**: For browser matrix testing (Chrome desktop + mobile + console clean, Lighthouse 3× median, multi-viewport, cross-browser), see `references/web/verification/verification_workflows.md` and `references/web/verification/performance_checklist.md`.

---

## The Gate Function

Before claiming any status, walk this 8-step gate:

1. [ ] **IDENTIFY** — what command/action proves this claim?
2. [ ] **RUN** — execute the stack's verification commands (`STACK_VERIFICATION_COMMANDS`)
3. [ ] **TEST** — for WEB: open browser; for non-WEB: run unit + integration suites
4. [ ] **VERIFY** — does output match expected? Exit code 0? Test count green?
5. [ ] **VERIFY (WEB)** — multi-viewport (mobile + desktop) + DevTools console clean
6. [ ] **VERIFY (CRITICAL CHANGE)** — cross-browser / cross-platform check
7. [ ] **RECORD** — note what you saw / which command exited 0 / which test passed
8. [ ] **ONLY THEN** — make the claim

---

## Stack Verification Commands

Run all of these from the project root. ALL must exit 0 before claiming done.

| Stack | Test | Lint | Build |
|---|---|---|---|
| WEB | (see browser matrix below) | n/a (style enforced via checklist) | `node scripts/minify-webflow.mjs && node scripts/verify-minification.mjs && node scripts/test-minified-runtime.mjs` |
| GO | `go test ./...` | `golangci-lint run` | `go build ./...` |
| NODEJS | `npm test` | `npx eslint .` | `npm run build` |
| REACT | `npm test` | `npx eslint .` | `npm run build` |
| REACT_NATIVE | `npm test` | `npx eslint .` | `npx expo export` |
| SWIFT | `swift test` | `swiftlint` | `swift build` |

---

## Universal Pre-Claim Checklist

- [ ] All `STACK_VERIFICATION_COMMANDS[stack]` exit 0
- [ ] No new warnings introduced (compare to last-known-good)
- [ ] Code Quality Gate (Phase 1.5) checklist items marked `[x]` with evidence
- [ ] If a regression test was added (Phase 2), it passes
- [ ] Diff scope matches stated change (no accidental extras)
- [ ] No commented-out code, console.log, fmt.Println, print debug residue

---

## WEB Browser Matrix (delegated to stack-specific checklist)

Minimum (always required):
- [ ] Chrome Desktop (1920px) — manual test
- [ ] Mobile emulation (375px) — manual test
- [ ] DevTools Console — no errors

Standard (production work):
- [ ] Chrome Desktop (1920px) + Tablet (991px) + Mobile (375px)
- [ ] DevTools console clear at all viewports
- [ ] Lighthouse 3× run, median used

For full WEB matrix: `references/web/verification/verification_workflows.md` and `assets/web/checklists/performance_loading_checklist.md`.

---

## Anti-Patterns to Avoid

- [ ] **Avoid**: "Should work" / "probably works" claims — test it
- [ ] **Avoid**: Claiming done with skipped tests or mocked dependencies that aren't representative
- [ ] **Avoid**: WEB — claiming done without opening an actual browser
- [ ] **Avoid**: Single-viewport / single-OS tests passing as "verified"
- [ ] **Avoid**: Stale build artifacts (run `<tool> clean` before verification on suspect builds)
- [ ] **Avoid**: Verification only against happy path — at least one edge case + error path

---

## Recording Verification Evidence

When you claim done, attach evidence in your message:

```
Verified:
- npm test: PASS (47 passed, 0 failed)
- npx eslint .: clean
- npm run build: succeeded (build/index.js produced, 124 KB)
- WEB only: Chrome desktop + mobile, console: 0 errors

Diff: 3 files changed, +47 -12
```

Without evidence, "done" is a guess.
