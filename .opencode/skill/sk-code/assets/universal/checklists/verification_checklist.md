---
title: Universal Verification Checklist
description: Stack-agnostic verification gate to walk before any "done", "works", "complete", or "passing" claim.
---

# Universal Verification Checklist - The Pre-Claim Gate

Stack-agnostic verification gate. Walk this checklist BEFORE making any "done", "works", "complete", or "passing" claim across WEBFLOW, NEXTJS, or GO.

## 1. OVERVIEW

### Purpose

Codifies the universal protocol that gates every completion claim in sk-code. Stack-specific commands (npm scripts for NEXTJS, go test/golangci-lint for GO, the Webflow minification scripts plus a browser matrix for WEBFLOW) are listed in Section 3 below and detailed in each stack's verification doc — this checklist enforces the discipline that wraps those commands.

### Usage

Run the 8-step Gate Function in Section 2 in order. All `STACK_VERIFICATION_COMMANDS` for the detected stack must exit 0 (Section 3). For WEBFLOW, also walk the browser matrix in Section 4. Without evidence (Section 6), "done" is a guess — attach the evidence block to the completion claim.

---

## 2. THE GATE FUNCTION (8 steps)

Walk these in order before claiming any status:

1. [ ] **IDENTIFY** — what command/action proves this claim?
2. [ ] **RUN** — execute the stack's verification commands (`STACK_VERIFICATION_COMMANDS`).
3. [ ] **TEST** — for WEBFLOW: open browser; for NEXTJS / GO: run unit + integration suites.
4. [ ] **VERIFY** — does output match expected? Exit code 0? Test count green?
5. [ ] **VERIFY (WEBFLOW)** — multi-viewport (mobile + desktop) + DevTools console clean.
6. [ ] **VERIFY (CRITICAL CHANGE)** — cross-browser / cross-platform check where applicable.
7. [ ] **RECORD** — note what you saw / which command exited 0 / which test passed.
8. [ ] **ONLY THEN** — make the claim.

---

## 3. STACK VERIFICATION COMMANDS

Run all of these from the project root. ALL must exit 0 before claiming done.

| Stack | Test | Lint | Build |
|---|---|---|---|
| WEBFLOW | (see browser matrix in Section 4) | n/a (style enforced via checklist) | `node scripts/minify-webflow.mjs && node scripts/verify-minification.mjs && node scripts/test-minified-runtime.mjs` |
| NEXTJS | `npm test` (when test suite exists) | `npm run lint` | `npm run type-check && npm run build` |
| GO | `go test ./...` (use `-race` for race detector) | `golangci-lint run` | `go build ./...` |
| UNKNOWN | sk-code does not own this stack — surface a disambiguation prompt instead | n/a | n/a |

---

## 4. WEBFLOW BROWSER MATRIX

**Minimum** (always required):

- [ ] Chrome Desktop (1920px) — manual test.
- [ ] Mobile emulation (375px) — manual test.
- [ ] DevTools Console — no errors.

**Standard** (production work):

- [ ] Chrome Desktop (1920px) + Tablet (991px) + Mobile (375px).
- [ ] DevTools console clear at all viewports.
- [ ] Lighthouse 3× run with median used.

For the full WEBFLOW matrix and Lighthouse details: `references/webflow/verification/verification_workflows.md` and `references/webflow/performance/cwv_remediation.md`.

---

## 5. UNIVERSAL PRE-CLAIM CHECKLIST

- [ ] All `STACK_VERIFICATION_COMMANDS[stack]` exit 0.
- [ ] No new warnings introduced (compare to last-known-good).
- [ ] Code Quality Gate (Phase 1.5) checklist items marked `[x]` with evidence.
- [ ] If a regression test was added (Phase 2), it passes.
- [ ] Diff scope matches stated change (no accidental extras).
- [ ] No commented-out code, console.log, fmt.Println, print debug residue.

---

## 6. ANTI-PATTERNS TO AVOID

- [ ] **Avoid**: "Should work" / "probably works" claims — test it.
- [ ] **Avoid**: Claiming done with skipped tests or mocked dependencies that aren't representative.
- [ ] **Avoid**: WEBFLOW — claiming done without opening an actual browser.
- [ ] **Avoid**: Single-viewport / single-OS tests passing as "verified".
- [ ] **Avoid**: Stale build artifacts (run `<tool> clean` before verification on suspect builds).
- [ ] **Avoid**: Verification only against happy path — include at least one edge case + error path.

---

## 7. RECORDING VERIFICATION EVIDENCE

When claiming done, attach an evidence block to the message:

```
Verified:
- npm test: PASS (47 passed, 0 failed)
- npm run lint: clean
- npm run build: succeeded (.next/ produced, 124 KB)
- WEBFLOW only: Chrome desktop + mobile, console: 0 errors
- Lighthouse: median scores (LCP / TBT / CLS) within targets

Diff: 3 files changed, +47 -12
```

Without evidence, "done" is a guess.

---

## 8. RELATED RESOURCES

- `references/router/phase_lifecycle.md` — Phase 3 Verification position in the sk-code lifecycle.
- `assets/universal/checklists/debugging_checklist.md` — runs before this checklist when bugs surface.
- `references/webflow/verification/verification_workflows.md` — WEBFLOW deep-dive (browser matrix, Lighthouse, multi-viewport).
- `references/nextjs/verification/verification_workflows.md` — NEXTJS stub (type-check + lint + build sequence).
- `references/go/verification/verification_workflows.md` — GO stub (`go test ./...` + `golangci-lint run` + race detector).
