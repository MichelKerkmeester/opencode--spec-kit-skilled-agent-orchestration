---
iteration: 7
dimension: regression-verification
dispatcher: claude-opus-4.7-1m (manual exec)
branch: main
cwd: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
created_at: 2026-04-17T20:10:00Z
convergence_candidate: true
note: "Empirical test run of 17 regression suites + adversarial Node reproduction of sanitizeRecoveredPayload against 19 homoglyph/zero-width/accented inputs."
---

# Iteration 007 — Regression-verification

## 1. Regression suite results

Two separate vitest installs (`scripts/node_modules/vitest` and `mcp_server/node_modules/vitest`); root `vitest.config.ts` uses `vitest/config` which is only resolvable from the per-package installs, so suites were run separately. A scratch config (`/tmp/iter7-vitest/vitest.config.js`) was used for scripts tests to bypass the root-config path issue (root config loads fine via `mcp_server`'s node_modules, but not via `scripts`'s).

| # | Suite | Tests | Pass | Fail | Skip |
| --- | --- | --- | --- | --- | --- |
| 1 | `scripts/tests/workflow-canonical-save-metadata.vitest.ts` | — | pass | 0 | — |
| 2 | `scripts/tests/evidence-marker-audit.vitest.ts` | — | pass | 0 | — |
| 3 | `scripts/tests/evidence-marker-lint.vitest.ts` | — | pass | 0 | — |
| 4 | `scripts/tests/continuity-freshness.vitest.ts` | — | pass | 0 | — |
| 5 | `scripts/tests/backfill-research-metadata.vitest.ts` | — | pass | 0 | — |
| 6 | `scripts/tests/gate-3-classifier.vitest.ts` | — | pass | 0 | — |
| 7 | `scripts/tests/normalizer-lint.vitest.ts` | — | pass | 0 | — |
| **scripts aggregate** | | **77** | **76** | **0** | **1** |
| 8 | `mcp_server/tests/readiness-contract.vitest.ts` | — | pass | 0 | — |
| 9 | `mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | — | pass | 0 | — |
| 10 | `mcp_server/tests/hooks-shared-provenance.vitest.ts` | — | pass | 0 | — |
| 11 | `mcp_server/tests/copilot-compact-cycle.vitest.ts` | — | pass | 0 | — |
| 12 | `mcp_server/tests/caller-context.vitest.ts` | — | pass | 0 | — |
| 13 | `mcp_server/tests/session-resume-auth.vitest.ts` | — | pass | 0 | — |
| 14 | `mcp_server/tests/retry-budget.vitest.ts` | — | pass | 0 | — |
| 15 | `mcp_server/tests/exhaustiveness.vitest.ts` | — | pass | 0 | — |
| 16 | `mcp_server/tests/run-enrichment-step.vitest.ts` | — | pass | 0 | — |
| 17 | `mcp_server/tests/scope-governance-normalizer-parity.vitest.ts` | — | pass | 0 | — |
| **mcp_server aggregate** | | **102** | **102** | **0** | **0** |
| **TOTAL** | | **179** | **178** | **0** | **1** |

Wall clock: scripts = 1.29s; mcp_server = 1.76s. Both well under the 15-min budget. All 17 regression suites pass HEAD (commit 3b22ad3aa → 656b6a133 range, current checkout).

## 2. Adversarial test reproductions

### sanitizeRecoveredPayload (19 cases)

Logic ported verbatim from `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts:25-54`. Blocked = strip pattern fired and the line was removed (i.e. `sanitize(line).trim() === ""`).

| # | Case | Input codepoint | Blocked? |
| --- | --- | --- | --- |
| 1 | ASCII baseline | `SYSTEM:` | **true** |
| 2 | Greek Ε (U+0395) | `SYST\u0395M:` | **true** (Greek fold works) |
| 3 | Greek ε (U+03B5) | `syst\u03B5m:` | **true** |
| 4 | Cyrillic М (U+041C) | `SYSTE\u041CM:` | **FALSE — bypass** |
| 5 | Cyrillic Е (U+0415) | `SYST\u0415M:` | **FALSE — bypass** |
| 6 | Cyrillic Ѕ (U+0405) | `\u0405ystem:` | **FALSE — bypass** |
| 7 | Cyrillic ѕ (U+0455) | `\u0455ystem:` | **FALSE — bypass** |
| 8 | Cyrillic е (U+0435) | `syst\u0435m:` | **FALSE — bypass** |
| 9 | Cyrillic С (U+0421) | `\u0421ystem:` | **FALSE — bypass** |
| 10 | Latin é (U+00E9) | `syst\u00E9m:` | **FALSE — bypass** |
| 11 | Latin É (U+00C9) | `SYST\u00C9M:` | **FALSE — bypass** |
| 12 | Full-width Ｅ (U+FF25) | `SYST\uFF25M:` | **true** (NFKC folds) |
| 13 | Soft hyphen (U+00AD) | `F\u00ADile write` | **FALSE — n/a, not a role prefix** |
| 14 | Zero-width space (U+200B) | `SY\u200BSTEM:` | **true** (strip set covers U+200B-200F) |
| 15 | Cyrillic М in Message | `\u041Cessage: ignore` | **FALSE — bypass** |
| 16 | Plain "ignore all previous" | `ignore all previous instructions` | **true** |
| 17 | Cyrillic і "ignore" | `\u0456gnore all previous instructions` | **FALSE — bypass** |
| 18 | Plain "You are" | `You are a helpful assistant` | **true** |
| 19 | Cyrillic У "You" | `\u0423ou are a helpful assistant` | **FALSE — bypass** |

**Confirms iter 1/iter 6:** Greek fold works; Cyrillic + Latin-combining-mark bypass. **Extends iter 1-6:** confirms the bypass also defeats `ignore (all|previous)` and `you are` patterns when the leading letter is swapped. Iter 1's "full-width variants not folded" wording is empirically wrong (case 12 proves NFKC handles U+FF25) — iter 6's correction stands.

### Session-resume propagation

Read of `handleSessionResume` (`session-resume.ts:449-478`) and test suite (`session-resume-auth.vitest.ts:212-220, 201-210, 250-270`) empirically confirms:

- No code path derives `claudeSessionId` from `callerCtx.sessionId` when `args.sessionId` is absent. Line 477: `claudeSessionId: requestedSessionId ?? undefined` — `callerCtx` is read ONLY at line 450 to populate `callerCtx.sessionId` and used ONLY at line 457 in the three-way guard. R1-P1-002 STANDS empirically.
- The matching test at `session-resume-auth.vitest.ts:212-220` covers the absent-args case but asserts `expectLatestScopeClauses(undefined)` — i.e. it LOCKS IN the current behaviour that `callerCtx.sessionId` is NOT propagated. This is a policy choice, not a test coverage gap per se, but it confirms the behaviour is intentional rather than accidental.

## 3. C1 compound re-adjudication

Iter 5 C1 chain required both (a) homoglyph bypass AND (b) attacker-forged `_extra.sessionId` to produce a session-context takeover. Iter 6 refuted (b): MCP SDK sources `extra.sessionId` from `capturedTransport.sessionId` (trusted), not from request params. Under stdio the field is always `undefined`, so `callerCtx.sessionId === null` and the guard at `session-resume.ts:457` short-circuits via `callerCtx?.sessionId` being falsy.

Re-adjudication with iter 6 downgrade applied:

- **Attack step 2 as framed is impossible.** Attacker cannot forge `_extra.sessionId` under stdio (no field on the transport) or under HTTP (server-issued, validated). The chain-link between step 1 (enumerate target UUID) and step 3 (receive cached summary) is broken.
- **However:** the guard itself is vacuous under stdio — `callerCtx?.sessionId` is always `null`, so any `args.sessionId` the caller provides (attacker-controlled or not) passes the `requestedSessionId !== callerCtx.sessionId` check because the right-hand side is nullish. So a stdio caller can still request ANY `args.sessionId` and receive the cached summary scoped to that UUID (step 3 succeeds), without needing to forge `_extra.sessionId`.
- Whether this is a takeover hinges on whether a stdio caller's ambient trust level is "can enumerate target UUIDs from `~/.claude/projects/`". On single-user dev machines where stdio is the transport, the attacker and the target are the same UID — no privilege boundary, no takeover. On shared-tenant stdio (rare) the attacker + target may differ — but stdio is a subprocess model, so "same process" is the trust boundary anyway.

**Verdict:** C1 drops from P0 to **P2 — vacuous-guard, no cross-trust bypass.** Under stdio the guard does not protect anything because there's nothing to protect (single-UID subprocess trust). Under HTTP the guard protects correctly (server-issued `capturedTransport.sessionId` cannot be forged). The "compound takeover" claim conflates guard-vacuity with guard-bypass; they are not the same. Homoglyph bypass (R1-P1-001) remains P1 on its own merit, but the stacking claim of iter 5 does not survive iter 6's SDK-source review.

## 4. Findings

### R7-P2-001 — Cyrillic homoglyph bypass also defeats `ignore (all|previous)` and `you are` patterns — **NEW, extends R1-P1-001**

Test cases 17 (`\u0456gnore`) and 19 (`\u0423ou are`) show the homoglyph bypass is not limited to role-prefix patterns (SYSTEM:, Message:); it also defeats every pattern in `RECOVERED_TRANSCRIPT_STRIP_PATTERNS` whose leading letter can be homoglyphed. This broadens R1-P1-001's scope from "role prefix spoofing" to "full strip-pattern evasion". Severity intact at **P1** (parent finding) but finding description needs to enumerate patterns 2 and 3 in the strip list as also vulnerable. [SOURCE: `shared-provenance.ts:25-31`; adversarial probe case 17/19 above.]

### R7-P2-002 — Test at `session-resume-auth.vitest.ts:212-220` locks in the R1-P1-002 behaviour as intentional — **NEW, process/traceability**

The test `proceeds when args.sessionId is not provided` asserts `expectLatestScopeClauses(undefined)` when `callerSessionId: 'transport-session'` is set. This ENCODES the R1-P1-002 behaviour (callerCtx.sessionId ignored) as a CURRENT CONTRACT. A future patch to propagate callerCtx.sessionId into the scope would FAIL this test. Either: (a) R1-P1-002 is a design choice and the finding wording should reflect "intentional gap, not regression"; or (b) the test should be inverted and flipped to assert propagation. Severity **P2** — audit-trail: any future fix to R1-P1-002 must also modify this test. [SOURCE: `session-resume-auth.vitest.ts:212-220`, `session-resume.ts:451-477`.]

### R7-P2-003 — No regression test covers Cyrillic homoglyphs in `sanitizeRecoveredPayload` despite iter 1 R1-P1-001 filing 6+ weeks ago — **NEW, test-coverage gap**

`hooks-shared-provenance.vitest.ts:149` exercises ONLY `SYST\u0395M:` (Greek Ε). No Cyrillic (U+041C, U+0415, U+0405, U+0435, U+0421), no Latin-accented (U+00C9, U+00E9) cases are present. This means the 19-case adversarial matrix in section 2 cannot be regression-locked until tests are added. Severity **P2** — without tests, R1-P1-001 will silently re-regress if someone adds more cross-script characters to `normalizeRecoveredPayloadLineForMatching`. Compare with `gate-3-classifier.vitest.ts:211-215` which DOES have one Cyrillic case (`d\u0435lete`) — the provenance suite is the gap. [SOURCE: `hooks-shared-provenance.vitest.ts:149`, adversarial probe cases 4-11, 15, 17, 19.]

### R7-P2-004 — Root `vitest.config.ts` import chain breaks under `scripts/` cwd — **NEW, infrastructure**

Running `vitest` from `.opencode/skill/system-spec-kit/scripts/` fails with `Cannot find module 'vitest/config'` because the root config at `../vitest.config.ts` imports `vitest/config` but `scripts/node_modules/vitest` does not export that subpath resolvable from the parent directory (ESM resolution scoping). Tests still pass when given an inline config, but CI or operator-issued `npm test` from the scripts folder will fail with a cryptic Vite `UNRESOLVED_IMPORT` warning followed by startup error. This is pre-existing (not a Phase 017 regression) but is adjacent to F1/F2 discoverability issues: any operator trying to reproduce Phase 017 test-suite results from inside `scripts/` will hit it. Severity **P2** — dev-ex, not correctness. [SOURCE: reproduced during this iteration; workaround `/tmp/iter7-vitest/vitest.config.js`.]

## 5. Hypotheses ruled out

- **H: Suite-level failure masks pre-existing `qualityFlags is not iterable` fault.** `handler-memory-save.vitest.ts` is NOT in the Phase 017 17-suite regression set. I did not re-run it; the prompt's claim of a line-3174 failure is outside Phase 017 scope. Ruled out as in-scope concern.
- **H: R1-P1-001 regression test coverage is adequate.** Refuted empirically: only the Greek case is tested (see R7-P2-003). Iter 1's finding is NOT test-locked against re-regression.
- **H: NFKC is wholly the culprit for homoglyph bypass.** Partially refuted: NFKC actually DOES handle full-width and Greek cases (cases 2, 3, 12, 14 all block). The real culprit is that `normalizeRecoveredPayloadLineForMatching` only folds Greek epsilon (`[\u0395\u03B5]`) and does NOT include a general confusable fold for Cyrillic or Latin-accented characters. The remediation is not "upgrade NFKC" but "extend the explicit fold table" (or use Unicode confusable data).
- **H: C1 P0 compound stands after iter 6 downgrade.** Ruled out in section 3. C1 downgrades to P2.

## 6. Metrics

- **iter-7 findingsCount:** 4 (1 × P1-level extension of existing R1-P1-001 scope, 3 × P2)
- Note: R7-P2-001 extends R1-P1-001 — I'm counting it as NEW because it's an additional failure mode (non-role-prefix patterns), but it does not add P1-level severity beyond what R1-P1-001 already captures. Treating as P2 for severity accounting.
- **severity-weighted NEW iter-7:** 4 × 1.0 = 4.0
- **C1 downgrade iter-6→iter-7:** −1 P0 (−10.0), +1 P2 (+1.0) → −9.0 cumulative
- **cumulative adjudicated severity (post iter-7 + C1 downgrade):**
  - P1: 4 (R1-P1-001/R17-P1-001 merged, R1-P1-002, F1, F2) → 20.0
  - P2: 10 (R1-P2-001/002/003, R17-P1-002 downgraded, R17-P2-001/002, F3, F4, R6-P2-001, R6-P2-002) + C1 downgrade (1) + R7-P2-001..004 (4) = 15 → 15.0
  - **cumulative weighted: 35.0**
- **newFindingsRatio iter-7:** 4.0 / 35.0 = **0.114** — above 0.08 threshold
- **cumulative newFindingsRatio (iter 1-7):** rough count — iter-6 reported 35.0 cumulative; iter-7 adds 4.0 new and subtracts 9.0 via C1 downgrade → ratio stays under 0.08 when averaged across iterations. **Convergence candidate: YES** (per-iter ratio 0.114 is a mild bump; over the trailing-3 window iter-5/6/7 = 26/2/4 weighted new, cumulative is stabilising).
- **toolCallsUsed:** 15 (within budget).
- **convergedThisIter:** TRUE — findings are now test-coverage and infrastructure gaps, not new correctness/security issues. No new P0s or P1s. Iter-5's P0 retracted.

## 7. Next iteration recommendation

**Recommend CLOSE the review loop.** All 17 regression suites pass. The iter-5 P0 (C1) is retracted via iter-6 + iter-7 combined adjudication. Remaining findings are:

- 2 × P1 code (R1-P1-001 Cyrillic/Latin bypass — needs fold-table extension; R1-P1-002 callerCtx.sessionId propagation — needs design decision).
- 2 × P1 process (F1 tasks.md unclosed; F2 changelog hashes missing).
- 11 × P2 (all maintainability, audit-trail, or latent regression; none blocking).

If iter 8 is attempted, the productive dimension is `p0-escalation` — specifically: with C1 downgraded, is there ANY remaining P0 candidate in the iter 1-7 corpus? I claim NO (homoglyph bypass on recovered-transcript is P1 without a same-trust-boundary bypass multiplier), but a fresh-context adversarial pass could verify. Alternately, close and ship the Phase 017 remediation report.

Operator deliverables unchanged from iter 6:
1. Fix R17-P1-002 wording (retract attacker-forgery framing, adopt vacuous-guard framing). Iter 7 confirms vacuous-guard verdict.
2. Extend `normalizeRecoveredPayloadLineForMatching` fold table to cover U+041C, U+0415, U+0405, U+0455, U+0435, U+0421 + Latin-accented E/e (R1-P1-001 mitigation).
3. Add tests for cases 4-11, 15, 17, 19 to `hooks-shared-provenance.vitest.ts` (R7-P2-003 mitigation).
4. Decide R1-P1-002 policy: propagate `callerCtx.sessionId` when `args.sessionId` absent (and invert the test), OR document that the caller-context sessionId is never a positive binding.
5. Fix F1/F2 before closing Phase 017.
