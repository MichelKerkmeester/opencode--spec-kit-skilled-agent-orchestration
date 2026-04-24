# Deep Review Strategy: Skill-Advisor Phase Stack — R03 (POST-REMEDIATION)

## Target

Skill-advisor phase stack on main at HEAD=9e982f366 (post-Phase 025 remediation):
- Phase 020 (parent + 8 children) — hook surface, shared payload, freshness, producer, renderer, 4 runtime hooks, Codex integration, docs
- Phase 021/001 — advisor hook efficacy research (converged)
- Phase 021/002 — SKILL.md smart-router research (converged)
- Phase 022 — docs + TS audit
- Phase 023 — 6-area remediation + OpenCode plugin
- Phase 024 — deferred items + telemetry measurement
- **Phase 025 — deep-review remediation (NEW, 5 P1 + 2 P2 closed)**

## Review Dimensions (7)

Same D1-D7 framework as r01/r02:

| ID | Dimension | Coverage |
|---|---|---|
| **D1** | Security + Privacy | Prompt stdin plumbing (025 fix), HMAC opacity, label sanitization at envelope (025 fix), disable flag |
| **D2** | Correctness | Envelope contract, 4-runtime parity, tokenCap from metrics (025 fix), cache maxTokens key (025 fix), provenance restamping (025 fix), UNKNOWN-fallback |
| **D3** | Performance + Observability | Cache hit rate, p95, static vs live telemetry separation (025 fix), finalizePrompt API (025 fix), promptId aggregation (025 fix), baseline SKILL.md handling |
| **D4** | Maintainability + sk-code-opencode alignment | JSDoc coverage (025 fix), cache bounds (025 fix), normalizer alias (025 fix), TS strictness, dead code |
| **D5** | Integration + Cross-runtime | Plugin disable flag (025 fix), SIGKILL escalation (025 fix), source-signature cache (025 fix), 5-runtime parity harness (025 fix), corpus 200/200, Codex adapter |
| **D6** | Test coverage + quality | Plugin negative-paths (025 fix), subprocess error-codes (025 fix), telemetry path-precedence (025 fix), end-to-end parity (025 fix), fixture staleness |
| **D7** | Documentation accuracy | Workspace build command (025 fix), Codex status (025 fix), playbook denominator (025 fix), artifact names (025 fix), Copilot callback model (025 fix) |

## R03 Focus: POST-REMEDIATION

This review is *after* Phase 025 closed all 7 prior findings. The review's job is to:

1. **Verify prior fixes** — confirm each DR-P1-00X and DR-P2-00X is correctly implemented, not superficial
2. **Surface new findings** — issues introduced by the remediation itself (new code has new surface area)
3. **Find residual gaps** — prior reviews may have missed issues adjacent to the fixes

## Severity Levels (P0/P1/P2)

- **P0 (Blocker)**: release-stops; security/correctness/parity failures
- **P1 (Required)**: should fix; non-blocking but creates risk
- **P2 (Suggestion)**: optional; style/polish

## Stop Conditions

- 40 iterations cap (user directive: run all 40)
- Convergence protocol documented but iteration cap takes precedence per user
- P0 override: new P0 findings block any cap-based convergence

## Executor

- cli-copilot gpt-5.4 high, maxConcurrent=1
- **All 40 iters + synthesis with copilot** (user directive, differs from r02 mixed approach)
- True per-iter dispatch: fresh copilot invocation per iter (proven approach from r02)

## Known Context

**HEAD**: 9e982f366 (Phase 025 shipped)

**Recent implementation commits (r03 scope)**:
- `9e982f366` — feat(025): implement deep-review remediation (36 files, +1104/-194)
- `ef574e200` — chore(025): scaffold packet
- `c6d3fcc2c` — review(020): r02 deep-review complete (PASS 5/2)
- `dd89ec89e` — chore: r02 progress + r01 archive
- Earlier: 020-024 phases shipped across prior commits

**Test baseline**: 8 focused files / 65 tests PASS (Phase 025 suite). Full suite has pre-existing legacy failures (transcript-planner-export, deep-loop/prompt-pack, context-server-error-envelope) — DO NOT re-flag as regressions.

**Prior findings closed in 025**:
- DR-P1-001..005 and DR-P2-001..002 all Closed with file:line evidence in `.../003-deep-review-remediation/implementation-summary.md`

**Still deferred (not expected to surface as blockers)**:
- Live-AI miss-rate / compliance gap / SKILL.md-skip behavior — blocked by live-AI telemetry (primitive shipped; user must opt in)
- 2-3 pre-existing non-020 test failures (transcript-planner-export, deep-loop/prompt-pack)

## Review Protocol (Per-Iter)

Each iteration (fresh copilot invocation):
1. Read `review/deep-review-strategy.md`, `review/deep-review-config.json`, `review/deep-review-state.jsonl`
2. Read prior `iterations/iteration-{N-1}.md` if N > 1
3. Pick ONE dimension via rotation `((N-1) mod 7) + 1 → D(n+1)` (override if justified)
4. Read NEW source evidence — do NOT just re-read prior iters
5. For 025-touched surfaces: verify the documented fix matches the code. For non-025 surfaces: look for residual gaps.
6. Write `iterations/iteration-NNN.md` (3-digit padded) with: Scope / Evidence read / Findings (P0/P1/P2 with id PX-NNN-MM, dimension, headline, file:line evidence, impact, remediation) / Re-verified (prior findings confirmed closed) / Metrics (honest newInfoRatio) / Next focus
7. Append one JSON line to `deep-review-state.jsonl`
8. Exit with `ITER_N_DONE`

## Synthesis (After Iter 40)

Same synthesis step as r02:
1. Read all 40 iteration files
2. Deduplicate findings by evidence-family
3. Write `review/review-report.md` (9 sections)
4. Write `review/findings-registry.json`
5. Append `{"type":"event","event":"completed","iteration":40,...}` to state.jsonl
6. Print `DEEP_REVIEW_SYNTHESIS_DONE verdict=<PASS|CONDITIONAL|FAIL> p0=<N> p1=<N> p2=<N>`

Executor for synthesis: cli-copilot (per user directive: all copilot).

## Verdict Rules

- **PASS**: 0 P0 findings, <= 5 P1 findings
- **CONDITIONAL**: 0 P0 but > 5 P1 findings OR questionable P0 evidence
- **FAIL**: >= 1 validated P0 finding
- PASS `hasAdvisories=true` if ≥ 1 P2 finding

## Max Iterations

40 (user directive: run all 40, cap takes precedence over convergence)

## Convergence Threshold

0.05 (documented but iteration cap rules — run to 40)
