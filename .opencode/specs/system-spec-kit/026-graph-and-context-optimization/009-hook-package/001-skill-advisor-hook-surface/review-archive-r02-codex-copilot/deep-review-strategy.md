# Deep Review Strategy: Skill-Advisor Phase Stack (020-024)

## Target

Skill-advisor phase stack shipped on main: Phase 020 (hook surface) + Phase 021/001 (advisor-hook efficacy research) + Phase 021/002 (SKILL.md smart-router research) + Phase 022 (skill-advisor docs + sk-code-opencode TS audit) + Phase 023 (6-area remediation + OpenCode plugin) + Phase 024 (deferred items + static corpus measurement + live-session wrapper + telemetry analyzer).

## Review Dimensions (7)

| ID | Dimension | Coverage |
|---|---|---|
| **D1** | Security + Privacy | Raw prompts never persisted; HMAC cache opacity; prompt-poisoning hardening; disable flag honored across all surfaces |
| **D2** | Correctness | Envelope contract; 4-runtime parity; fail-open behavior; freshness semantics; UNKNOWN-fallback |
| **D3** | Performance + Observability | Cache hit rate; p95 targets; metrics namespace; JSONL schema forbidden fields |
| **D4** | Maintainability + sk-code-opencode alignment | Audit leftovers; TS strictness; comment discipline; no dead code |
| **D5** | Integration + Cross-runtime | Hook surface parity; plugin/bridge correctness; corpus parity 200/200; Codex adapter edge cases |
| **D6** | Test coverage + test-code quality | 134+13 tests: gaps in fixtures/mocks/coverage |
| **D7** | Documentation accuracy | Reference doc DQI; README claims vs reality; feature catalog matches shipped code; playbook executable |

## Severity Levels (P0/P1/P2)

- **P0 (Blocker)**: release-stops; security/correctness/parity failures; MUST fix pre-release
- **P1 (Required)**: should fix; non-blocking but creates risk; fix or get user-approved deferral
- **P2 (Suggestion)**: optional; style/polish; defer freely

## Stop Conditions

- Rolling 3-iter newInfoRatio < 0.05 across all 7 dimensions
- 40 iterations completed
- Stuck threshold 3 (no new findings in 3 consecutive iters across ANY dimension)
- P0 override: new P0 findings block convergence regardless

## Known Context

**Current state of main branch** (HEAD: 008253d9c as of 2026-04-19):
- 020 parent + 8 children shipped + tested (118 Phase 020 tests PASS)
- 021/001 research converged (V1-V10 all answered)
- 021/002 research converged (V1-V10 all answered, V9 enforcement found = NONE)
- 022 shipped docs + 8 sk-code-opencode audit fixes
- 023 shipped 6 areas + OpenCode plugin (134 tests total at that point)
- 024 shipped 4 tracks; advisor accuracy measured at 56% vs corpus labels; 147 tests at that point
- Copilot SDK unblocked via npm install (`@github/copilot-sdk@0.2.2`)
- Track B docs sync landed: README + feature_catalog §6 + playbook §13-15

**Shipped artifacts to review**:
- Code: `mcp_server/lib/skill-advisor/*.ts` (11 files); `mcp_server/hooks/{claude,gemini,copilot,codex}/*.ts` (7 files); `mcp_server/lib/codex-hook-policy.ts`; `mcp_server/lib/context/shared-payload.ts` (advisor extensions)
- Plugin: `.opencode/plugins/spec-kit-skill-advisor.js` + `-bridge.mjs`
- Scripts: `scripts/spec/check-smart-router.sh`; `scripts/observability/smart-router-*.ts` (4 files)
- Tests: 18+ test files under `mcp_server/tests/` (advisor-*, copilot/codex/claude/gemini-*, plugin, telemetry, measurement, analyzer)
- Docs: `references/hooks/skill-advisor-hook.md` (DQI 97); `LIVE_SESSION_WRAPPER_SETUP.md`; skill-advisor README/feature_catalog/playbook
- Spec docs: 020 parent + 002-009 children; 021/001 + 021/002 research; 022/023/024 packets

**Prior relevant deferrals now closed**:
- 020/007 Copilot SDK → unblocked in T16 (SDK installed)
- 020/008 .codex config → applied manually in 024 Track 1
- 021/002 measurement baseline → 024 Track 2 measured 56% accuracy
- 021/001 V8/V9 plugin design → shipped in 023/F

**Still deferred (not expected to surface as blockers)**:
- V4 live-AI miss-rate / V5 compliance gap / V7 SKILL.md-skip behavior — blocked by live-AI telemetry (primitive shipped; user must opt in)
- 2 pre-existing non-020 test failures (transcript-planner-export, deep-loop/prompt-pack)

## Review Protocol

Each iteration:
1. Read prior `iterations/iteration-NNN.md` + `deep-review-state.jsonl`
2. Pick one or more dimensions to advance this iter (weighted by remaining uncertainty)
3. Read relevant code/docs/tests for chosen dimension
4. Write iteration-NNN.md with:
   - Iteration number (1-40)
   - Dimension(s) advanced
   - Findings (P0/P1/P2) with evidence citations (file:line or test name)
   - newInfoRatio (0.0-1.0)
   - Next iteration focus
5. Append delta to `deep-review-state.jsonl`: `{type:"iteration", iteration:N, newInfoRatio, findings:[...], dimensions:[...]}`
6. Check convergence; early stop if 3-iter rolling avg < 0.05 across all dimensions

After convergence or iter 40:
- Write `review-report.md` (9 sections): Executive Summary, Scope, Methodology, Evidence Classes, D1-D7 per-dimension findings, Verdict (PASS/CONDITIONAL/FAIL), Remediation plan, Cross-references
- Write `findings-registry.json`: indexed findings by severity + dimension

## Verdict Rules

- **PASS**: 0 P0 findings, <= 5 P1 findings (can defer), any P2
- **CONDITIONAL**: 0 P0 but > 5 P1 findings OR questionable P0 evidence
- **FAIL**: >= 1 validated P0 finding
- PASS `hasAdvisories=true` if ≥ 1 P2 finding

## Max Iterations

40

## Convergence Threshold

0.05

## Extension Run Notes (Iterations 10-40)

- User directive overrode the iteration-009 convergence stop. This packet was intentionally driven to the full 40-iteration cap.
- Dimension rotation completed to plan: D1 x5, D2 x5, D3 x5, D4 x4, D5 x4, D6 x4, D7 x4 across iterations 10-40.
- New findings added during the extension run:
  - `P1-012-01` (D5): plugin bridge timeout resolves before child exit and never escalates past SIGTERM
  - `P2-013-01` (D6): plugin negative-path coverage omits parser/nonzero-exit branches
  - `P1-016-01` (D7): published build/setup commands point at a repo-root workspace invocation the checkout cannot satisfy
- Final cumulative totals after iteration 040: P0=0, P1=5, P2=2
- Deferred items remain unchanged: live-AI telemetry gaps and the two pre-existing non-020 failures were not re-opened as blockers.
