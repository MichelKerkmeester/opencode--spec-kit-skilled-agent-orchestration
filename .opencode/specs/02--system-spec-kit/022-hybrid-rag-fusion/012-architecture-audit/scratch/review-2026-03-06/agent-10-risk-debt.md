# Risk & Technical Debt Assessment

**Spec Folder:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/`
**Assessor:** Agent 10 (Claude Opus 4.6)
**Date:** 2026-03-06
**Scope:** Open risks, accepted debt, follow-up gaps, regression risk

---

## 1. VERDICT

**PASS WITH CONCERNS**

- 11 findings total (2 HIGH, 5 MEDIUM, 4 LOW)
- The allowlist expiry checker exists but is NOT wired into CI or `npm run check`, meaning expired exceptions will silently persist.

---

## 2. OPEN RISKS

### 2.1 [HIGH] Allowlist Expiry Checker Not Wired Into Pipeline

**Finding:** `check-allowlist-expiry.ts` exists at `scripts/evals/check-allowlist-expiry.ts` with full implementation (warns at 30 days, fails on expired entries). However, it is **not** invoked in any of:

- `scripts/package.json` `"check"` script (runs: `lint` + `check-no-mcp-lib-imports.ts` + `check-api-boundary.sh` + `check-architecture-boundaries.ts`)
- `scripts/package.json` `"check:ast"` script (runs: `check-no-mcp-lib-imports-ast.ts` + `check-handler-cycles-ast.ts`)
- `.github/workflows/system-spec-kit-boundary-enforcement.yml` CI workflow
- `.git/hooks/pre-commit` local hook

**Impact:** The two current allowlist entries expire on `2026-06-04`. When that date passes, there is **no automated enforcement** that will detect the expiry. The entries will silently remain valid in the policy checker, defeating the governance intent documented in ADR-004 and ARCHITECTURE_BOUNDARIES.md Section 4.

**Recommendation:** Wire `npx tsx evals/check-allowlist-expiry.ts` into the `"check"` script in `scripts/package.json`. This automatically propagates to CI and pre-commit since both invoke `npm run check --workspace=scripts`.

**Severity:** HIGH -- the entire allowlist governance lifecycle depends on this tool actually running.

### 2.2 [HIGH] ADR-006 Regex Evasion Risk -- Bounds Assessment

**Finding:** ADR-006 explicitly accepts residual regex-evasion risk with "time-bounded AST hardening" as the mitigation path. However:

1. **The AST checker already exists** (`check-no-mcp-lib-imports-ast.ts`) and runs in CI via `check:ast`. This is a significant fact that is not fully reflected in the ADR narrative. ADR-006 still reads as though AST enforcement is a future aspiration, when in reality it is already deployed as a parallel check.

2. **The AST checker covers the key evasion vectors:** It handles dynamic `import()` expressions (line 217), `require()` calls (line 216), and uses TypeScript's own parser so multi-line imports, block comments, and template literals in string positions are structurally handled. Deep transitive re-export traversal is implemented (lines 262-301).

3. **Remaining gap:** The AST checker cannot catch computed/dynamic string module specifiers (e.g., `import(variable)`) -- this is inherent and documented. Template literal imports with interpolation (`import(\`...\${x}\``) are also uncatchable at static analysis time.

4. **Bounding assessment:** The risk IS properly bounded because:
   - Both regex AND AST checkers run in CI (defense in depth)
   - The only uncatchable vectors require dynamic string construction, which is unusual for import paths and would be caught in code review
   - The allowlist has only 2 entries remaining, both eval-only scripts
   - The boundary is well-documented in ARCHITECTURE_BOUNDARIES.md

**Verdict on ADR-006:** The risk acceptance is reasonable and well-bounded. The ADR narrative should be updated to acknowledge that AST enforcement is already active (not just "reserved"), which would make the risk posture clearer. Currently the ADR undersells the actual state of enforcement.

### 2.3 [MEDIUM] Open Questions in spec.md Section 12 Are Unanswered

**Finding:** Two open questions from spec.md Section 12 remain without formal resolution:

1. "Should compatibility wrappers in `mcp_server/scripts/` be renamed now or only retitled during transition?"
2. "Should API-first migration be strict immediately, or staged with an allowlist expiry window?"

The second question was effectively answered by implementation (staged with allowlist), but is not marked as resolved in the spec. The first question remains genuinely open.

**Impact:** MEDIUM -- these are documented as open questions but not formally closed, which could confuse future maintainers.

### 2.4 [MEDIUM] No Automated Enforcement for Allowlist Review Cadence

**Finding:** The allowlist governance schema includes `lastReviewedAt` fields. Both current entries show `2026-03-05`. There is no process, reminder, or automation to ensure periodic re-review of allowlist entries before their expiry date. The `check-allowlist-expiry.ts` tool only fires at the 30-day warning window.

**Impact:** If someone forgets to review entries, the first signal will be 30 days before expiry (assuming the checker gets wired in per Finding 2.1). There is no quarterly review cadence or ticket system integration.

### 2.5 [MEDIUM] CI Workflow Only Triggers on spec-kit Path Changes

**Finding:** The CI workflow at `.github/workflows/system-spec-kit-boundary-enforcement.yml` only triggers on changes to `.opencode/skill/system-spec-kit/**`. This means:

- If someone modifies files outside this path that somehow affect the boundary (unlikely but possible with symlinks or tooling changes), the checks won't run.
- The workflow does not run on a schedule (e.g., weekly cron), so allowlist expiry (once wired in) would only be caught when code changes happen to touch the spec-kit path.

**Impact:** MEDIUM -- in practice, code changes are frequent enough that this is low-risk, but a scheduled run would provide defense against stale allowlist entries sitting undetected during quiet periods.

### 2.6 [MEDIUM] Team Alignment Dependency Still Yellow

**Finding:** In `plan.md` Section 6 (Dependencies), "Team agreement on API-first policy" is still listed as "Yellow" status. This is a governance dependency that could allow policy drift if the team does not fully adopt the API-first boundary contract.

**Impact:** MEDIUM -- the enforcement tooling is in place regardless, but without team buy-in, new exceptions could proliferate.

### 2.7 [MEDIUM] Existing Tests Around Parser/Index Paths Still Yellow

**Finding:** Also in `plan.md` Section 6, "Existing tests around parser/index paths" dependency remains "Yellow", meaning the refactor risk for those paths is still elevated.

**Impact:** MEDIUM -- future refactoring in parser/index areas may introduce regressions without adequate test coverage.

---

## 3. P2 ITEM PRIORITY ASSESSMENT

All P2 checklist items (14 total) have been completed. None were left deferred. This is a positive finding.

**Should any have been P1?** Assessment of each completed P2:

| P2 Item | Should It Have Been P1? | Rationale |
|---------|------------------------|-----------|
| CHK-023 (lint overhead) | No | Performance budget, not functional |
| CHK-042 (deprecation criteria) | No | Process documentation |
| CHK-103 (doc sync) | No | Already covered by other enforcement |
| CHK-112 (recursive validation) | No | Tooling convenience |
| CHK-220 (block comments) | No | Defense in depth with AST checker |
| CHK-221 (quality-extractor tests) | Borderline | Tests for production code quality; but AST checker mitigates |
| CHK-222 (bidirectional cross-links) | No | Documentation quality |
| CHK-223 (handler-utils growth policy) | Borderline | Without it, utility module could become a catch-all |
| CHK-224 (AST evaluation) | No | Already done |
| CHK-225 (transitive re-exports) | No | Already implemented |
| CHK-436 (ADR-003 Five Checks) | No | Documentation completeness |
| CHK-420 (stale snippets) | No | Documentation accuracy |
| CHK-520 (pre-commit hook) | No | Local convenience; CI covers it |
| CHK-521 (boundary runtime budget) | No | Performance budget |
| CHK-522 (API encapsulation rationale) | No | Decision documentation |
| CHK-580 (negative-control naming) | No | Extra regression coverage |
| CHK-660 (indexed quality example) | No | Closure evidence |

**Verdict:** No P2 items should have been P1. CHK-221 and CHK-223 are borderline but were completed anyway, so the risk is moot.

---

## 4. ACCEPTED TECHNICAL DEBT

### 4.1 Documented Accepted Debt

| Debt Item | Where Documented | Mitigation | Time-Bounded? | Status |
|-----------|-----------------|------------|---------------|--------|
| Regex evasion vectors in line-based checker | ADR-006 | AST checker deployed in parallel; defense in depth | "Time-bounded" per ADR, but no specific deadline | **Partially mitigated** -- AST checker is active but ADR doesn't reflect this |
| Allowlist wildcard exceptions (`lib/*`) | ADR-004, allowlist JSON | `expiresAt: 2026-06-04` on both entries | Yes | **Active** -- 2 entries remain, eval-only |
| Compatibility wrappers in `mcp_server/scripts/` | ADR-002 | Transitional status with removal criteria | No specific deadline | **Open** -- no removal timeline set |
| `handler-utils.ts` catch-all risk | ADR-005, T033 | Growth policy documented in module header | Ongoing governance | **Mitigated** |
| Parser/indexer test coverage gaps | plan.md dependencies | Listed as Yellow dependency | No timeline | **Open** |

### 4.2 Undocumented / Implicit Debt

| Debt Item | Evidence | Impact |
|-----------|----------|--------|
| `check-allowlist-expiry.ts` not in pipeline | package.json, CI workflow -- tool exists but unused | Governance lifecycle broken |
| ADR-006 narrative doesn't reflect actual AST deployment | ADR text still reads as future work | Misleading risk posture documentation |
| No scheduled CI run for boundary checks | Workflow only triggers on code changes | Stale allowlist entries during quiet periods |

---

## 5. FOLLOW-UP WORK IMPLIED BUT UNTRACKED

### 5.1 Explicitly Implied Follow-Up (No Spec Folder)

| Work Item | Source | Priority | Tracked? |
|-----------|--------|----------|----------|
| Wire `check-allowlist-expiry.ts` into pipeline | Existence of file + gap analysis | P0 | **NOT TRACKED** |
| Update ADR-006 to reflect AST checker deployment | ADR-006 narrative vs actual state | P1 | **NOT TRACKED** |
| Resolve spec.md Section 12 open questions formally | spec.md | P2 | **NOT TRACKED** |
| Migrate remaining 2 allowlist entries to API surface before 2026-06-04 | allowlist JSON `expiresAt` fields | P1 | **NOT TRACKED** in a spec folder; only in allowlist metadata |
| Define compatibility wrapper removal timeline | ADR-002 removal criteria exist but no timeline | P2 | **NOT TRACKED** |
| Add scheduled (cron) CI run for boundary checks | Gap in CI coverage | P2 | **NOT TRACKED** |
| Update plan.md dependency statuses (team alignment, test coverage) | plan.md Section 6 | P2 | **NOT TRACKED** |

### 5.2 Code Quality Findings from Agent 4 Review (spec.md Section 13)

Several MAJOR code quality findings from the Agent 4 review were documented but their remediation status is unclear:

| Finding | File | Remediation Tracked? |
|---------|------|---------------------|
| `escapeLikePattern` backslash escaping | handler-utils.ts | Yes (T039, marked done) |
| Quality extractors not frontmatter-scoped | quality-extractors.ts | Yes (T040, marked done) |
| Causal reference ambiguous LIKE | causal-links-processor.ts | Yes (T041, marked done) |
| Chunking SQL column allowlist guard | chunking-orchestrator.ts | Yes (T042, marked done) |
| Empty retained chunks guard | chunking-orchestrator.ts | Yes (T043, marked done) |
| NaN propagation in pe-gating | pe-gating.ts | Yes (T044, marked done) |
| Relative require paths | enforcement | Yes (T045, marked done) |

**Verdict:** All Agent 4 findings were tracked and marked as completed. No gap here.

---

## 6. REGRESSION RISK ASSESSMENT (Phases 9-13)

### 6.1 Pattern Analysis

Phases 9-13 followed a characteristic pattern of naming regressions discovered sequentially:

- **Phase 9:** Root-save generic naming regression in candidate selection precedence
- **Phase 10:** Direct-save collector-path candidate-loss seam (discovered after Phase 9 closed)
- **Phase 11:** Explicit CLI target routing bug (adjacent to Phase 10)
- **Phase 12:** Phase-folder rejection rule (adjacent to Phase 11)
- **Phase 13:** Indexed direct-save render/quality blocker (discovered after Phase 10)

This sequence shows a **cascading discovery pattern** where fixing one naming issue exposed the next adjacent seam.

### 6.2 Could Naming Regressions Recur?

**Assessment: LOW-MEDIUM risk of recurrence.**

**Mitigating factors:**
- Regression test coverage now exists at multiple levels: helper-level (`pickBestContentName`), collector-path level (`collectSessionData`), CLI routing level (`generate-context-cli-authority`), and render/quality level (`memory-render-fixture`)
- The test count grew from 27/27 (Phase 9) to 31/31 (Phase 13), showing progressive coverage expansion
- Each phase explicitly preserved prior guardrails while adding new fixes
- The `pickBestContentName()` centralizes naming logic, reducing the surface area for new bugs

**Risk factors:**
- The cascading pattern (5 sequential phases of naming fixes) suggests the naming/save flow has high accidental complexity
- New save modes or workflows could introduce paths not covered by existing regression tests
- The collector path, workflow path, and CLI path are separate code paths that must all coordinate naming correctly
- No integration test exercises the full end-to-end save-index-retrieve cycle in a single test

**Recommendation:** Add an integration-level smoke test that exercises the full save workflow end-to-end (save -> index -> retrieve -> verify quality) for at least the two primary paths (file-backed and direct save). This would catch cross-seam regressions that unit tests at individual levels might miss.

---

## 7. CI ENFORCEMENT ASSESSMENT

### 7.1 Is the CI Workflow Tested?

**Finding:** The CI workflow is configured and documented as passing in implementation-summary.md verification evidence. Specific evidence:

- Clean-checkout CI simulation passed on 2026-03-06: `npm ci && npx tsc -b shared/tsconfig.json mcp_server/tsconfig.json && npm run check --workspace=scripts && npm run check:ast --workspace=scripts`
- A TS6305 failure mode on clean checkouts was discovered and fixed (prebuilding shared/mcp_server declarations)
- The workflow correctly triggers on both PRs and pushes to main that touch spec-kit paths

**Gap:** There is no evidence of the workflow actually running in GitHub Actions (no link to a passing workflow run). The evidence is from local simulation of the workflow steps.

### 7.2 Is the CI Workflow Running?

**Assessment:** The workflow YAML is syntactically correct and follows standard GitHub Actions patterns. It should be running on any PR that touches spec-kit files. However, since all changes in the git status are uncommitted/unpushed modified files, the workflow may not have been triggered recently for these specific changes.

### 7.3 Coverage Gaps

| Check | In `npm run check`? | In `npm run check:ast`? | In CI? | In pre-commit? |
|-------|---------------------|------------------------|--------|----------------|
| TypeScript lint (`tsc --noEmit`) | Yes | No | Via `check` | Via `check` |
| Import policy (regex) | Yes | No | Via `check` | Via `check` |
| API boundary (shell) | Yes | No | Via `check` | Via `check` |
| Architecture boundaries | Yes | No | Via `check` | Via `check` |
| Import policy (AST) | No | Yes | Via `check:ast` | Via `check:ast` |
| Handler cycles (AST) | No | Yes | Via `check:ast` | Via `check:ast` |
| **Allowlist expiry** | **NO** | **NO** | **NO** | **NO** |

---

## 8. SUMMARY TABLE

| # | Finding | Severity | Category | Action Needed |
|---|---------|----------|----------|---------------|
| F-01 | `check-allowlist-expiry.ts` not in pipeline | HIGH | Gap | Wire into `npm run check` |
| F-02 | ADR-006 undersells actual AST enforcement deployment | HIGH | Documentation | Update ADR-006 narrative |
| F-03 | Open questions in spec.md Section 12 unresolved | MEDIUM | Documentation | Formally close or defer |
| F-04 | No automated allowlist review cadence | MEDIUM | Governance | Consider quarterly review reminders |
| F-05 | CI only triggers on path changes, no scheduled run | MEDIUM | CI Coverage | Consider adding cron schedule |
| F-06 | Team alignment dependency still Yellow | MEDIUM | Governance | Resolve or document acceptance |
| F-07 | Parser/indexer test coverage still Yellow | MEDIUM | Test Coverage | Track in a follow-up spec |
| F-08 | Remaining 2 allowlist entries need migration by 2026-06-04 | LOW | Tracked Debt | Entries have `expiresAt`; needs pipeline enforcement (F-01) |
| F-09 | Compatibility wrapper removal has no timeline | LOW | Tracked Debt | Set target or document indefinite acceptance |
| F-10 | No integration-level end-to-end save smoke test | LOW | Test Coverage | Add integration test for save-index-retrieve |
| F-11 | No evidence of actual GitHub Actions workflow run | LOW | Verification | Verify by pushing a PR |

---

## 9. FINAL ASSESSMENT

**PASS WITH CONCERNS**

The architecture audit spec folder is comprehensive, well-structured, and demonstrates thorough execution across 13 phases. All P0 and P1 checklist items are complete. All P2 items are also complete. The enforcement tooling is solid with dual regex+AST checking in CI and local pre-commit hooks.

The most significant concern is **Finding F-01**: the allowlist expiry checker exists as a fully implemented tool but is completely disconnected from the enforcement pipeline. This undermines the governance lifecycle that ADR-004 and ARCHITECTURE_BOUNDARIES.md prescribe. The fix is straightforward (one line in package.json) but until it lands, the allowlist governance contract has a silent gap.

The regex evasion risk (ADR-006) is well-bounded in practice because the AST checker already provides structural enforcement. The ADR narrative should be updated to reflect this reality.

No follow-up spec folders exist for the implied work items (allowlist migration before 2026-06-04, wrapper removal, parser test coverage). These should be tracked to prevent them from becoming forgotten obligations.
