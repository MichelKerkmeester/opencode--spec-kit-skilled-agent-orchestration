# Deep Review Report — Skill-Advisor Phase Stack (020 + 021/001 + 021/002 + 022 + 023 + 024)

## 1. Executive Summary
This deep review was extended to the full **40 iterations** by explicit user directive after the loop had already converged at iteration 009. Iterations 010-040 stayed intentionally deep rather than wide, re-reading narrower hook, plugin, telemetry, test, and documentation surfaces with fresh evidence every round.

Final totals are **0 P0**, **5 P1**, and **2 P2**. Verdict remains **PASS** under the packet rule set (`0 P0` and `<=5 P1`), but the extension run materially raised the risk picture: in addition to the original privacy/parity/authority issues, the deeper pass found a plugin bridge lifecycle defect and a repo-root build instruction bug that affects the published operator workflow.

## 2. Scope
In scope:
- Phase 020 skill-advisor hook surface
- Phase 021/001 smart-router context-efficacy artifacts
- Phase 021/002 smart-router validation follow-ons
- Phase 022 docs/code alignment outputs
- Phase 023 remediation + OpenCode plugin path
- Phase 024 deferred remediation, measurement, wrapper, and analyzer assets

Reviewed evidence included source under `.opencode/skill/system-spec-kit/mcp_server/**`, plugin files under `.opencode/plugins/**`, automated tests, observability scripts, operator docs, playbooks, and the local npm/workspace configuration that those docs rely on.

Out of scope:
- Reopening the Phase 020 architecture
- New implementation work
- The still-deferred live-AI telemetry gaps and the two pre-existing non-020 test failures already excluded by the strategy packet

## 3. Methodology
The review followed the packet protocol through the resumed state: read strategy/state first, advance one dimension per iteration, write one `iteration-NNN.md` file per round, and append one JSONL state record per round. The extension run intentionally **ignored convergence stop conditions** after iteration 009, but still reported honest `newInfoRatio` values and tracked the growing stuck counter as telemetry only.

Dimension coverage for iterations 010-040 matched the requested deeper-drill distribution:

| Dimension | Iterations |
|---|---|
| D1 | 010, 017, 024, 031, 038 |
| D2 | 011, 018, 025, 032, 039 |
| D3 | 014, 019, 026, 033, 040 |
| D4 | 015, 020, 027, 034 |
| D5 | 012, 021, 028, 035 |
| D6 | 013, 022, 029, 036 |
| D7 | 016, 023, 030, 037 |

## 4. Evidence Classes
Primary evidence classes:
- Source code under `.opencode/skill/system-spec-kit/mcp_server/lib/**`
- Runtime adapters under `.opencode/skill/system-spec-kit/mcp_server/hooks/**`
- OpenCode plugin and bridge code under `.opencode/plugins/**`
- Automated tests under `.opencode/skill/system-spec-kit/mcp_server/tests/**`
- Observability scripts under `.opencode/skill/system-spec-kit/scripts/observability/**`
- Operator docs under `.opencode/skill/system-spec-kit/references/**` and `.opencode/skill/skill-advisor/**`
- Repo-local npm/workspace config (`.npmrc`, root `package.json`, `system-spec-kit/package.json`)

Secondary evidence classes:
- Prior iteration artifacts (001-009)
- Phase packet summaries for 020-024
- Validator output for the hook reference document
- Direct command outcomes for the documented build path versus the actual package-local build path

## 5. Per-Dimension Findings

### D1 Security + Privacy
The late-pass D1 work confirmed that Unicode/instruction-shaped label defenses are solid and that caches/diagnostics/shared payloads remain prompt-safe. The original subprocess argv leak is still the only concrete privacy defect in this dimension.
- **P0 findings**: none
- **P1 findings**: `P1-001-01`
- **P2 findings**: none

### D2 Correctness
The deeper pass did not surface a correctness bug. Freshness state transitions, generation recovery, non-live mappings, UNKNOWN telemetry sentinels, and source-signature invalidation all stayed internally consistent in the reviewed paths.
- **P0 findings**: none
- **P1 findings**: none
- **P2 findings**: none

### D3 Performance + Observability
The observability layer remained intentionally narrow and mostly honest: static measurement caveats are explicit, metric labels are closed, token caps are enforced twice, and stdout/stderr separation is deliberate in the bridge/wrapper surfaces. No new D3 defect warranted elevation.
- **P0 findings**: none
- **P1 findings**: none
- **P2 findings**: none

### D4 Maintainability + sk-code-opencode Alignment
The producer/runtime brief-authority split remains the main maintainability defect. The later passes did not uncover a second D4 blocker, but they strengthened the original case that byte accounting and runtime-injected text are still tracking different authorities.
- **P0 findings**: none
- **P1 findings**: `P1-004-01`
- **P2 findings**: none

### D5 Integration + Cross-runtime
This dimension gained the most new signal in the extension run. The pre-existing plugin threshold mismatch remains live, and the deeper bridge-lifecycle inspection found a second required fix: the timeout path resolves before child exit and never escalates past SIGTERM.
- **P0 findings**: none
- **P1 findings**: `P1-005-01`, `P1-012-01`
- **P2 findings**: none

### D6 Test Coverage + Test-code Quality
The original coverage advisory remains valid, and the deeper pass found an additional narrower gap in plugin negative-path testing: the bridge parser and nonzero-exit branches are implemented but not exercised by the shipped suite.
- **P0 findings**: none
- **P1 findings**: none
- **P2 findings**: `P2-006-01`, `P2-013-01`

### D7 Documentation Accuracy
Most docs remain structurally sound and the hook reference validates cleanly, but the extension run found one required D7 issue: multiple operator docs instruct users to run a repo-root workspace build command that the checkout cannot satisfy because the repo root disables workspaces and is not the `system-spec-kit` workspace root.
- **P0 findings**: none
- **P1 findings**: `P1-016-01`
- **P2 findings**: none

## 6. Verdict
Verdict: **PASS**  
hasAdvisories: **true**

Rationale: the packet’s rule is PASS when `P0 = 0` and `P1 <= 5`. The final cumulative state is `P0=0`, `P1=5`, `P2=2`, so the stack still clears the gate. If either of the new extension-run P1 findings had produced a blocker-class security or correctness failure, the verdict would have changed; they did not.

This is nevertheless a narrow PASS. The remaining issues affect real operator/runtime behavior: subprocess prompt privacy, brief-authority drift, plugin parity, plugin timeout cleanup, and published build instructions.

## 7. Remediation

| ID | Dimension | Headline | Owner suggestion | Effort | Target |
|---|---|---|---|---|---|
| P1-001-01 | D1 | Remove raw prompt from subprocess argv | skill-advisor runtime owner | M | pre-release |
| P1-004-01 | D4 | Collapse producer/runtime brief rendering to one authority | hook + observability owner | M | next sprint |
| P1-005-01 | D5 | Centralize plugin and hook default thresholds | plugin/hook integration owner | S | next sprint |
| P1-012-01 | D5 | Reap/terminate timed-out plugin bridge children deterministically | plugin runtime owner | M | next sprint |
| P1-016-01 | D7 | Fix repo-root build/setup instructions | docs + release owner | S | immediate |
| P2-006-01 | D6 | Add subprocess privacy and plugin parity tests | test owner | S | backlog |
| P2-013-01 | D6 | Add plugin parser/nonzero-exit negative-path tests | test owner | S | backlog |

## 8. Cross-references
- Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/spec.md`
- Plan: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/plan.md`
- Strategy/state: `review/deep-review-strategy.md`, `review/deep-review-state.jsonl`
- Iterations: `review/iterations/iteration-001.md` through `review/iterations/iteration-040.md`
- D1 evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts`
- D5 evidence: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`, `mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`
- D6 evidence: `mcp_server/tests/advisor-privacy.vitest.ts`, `advisor-runtime-parity.vitest.ts`, `spec-kit-skill-advisor-plugin.vitest.ts`
- D7 evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`, `skill-advisor-hook-validation.md`, `.opencode/skill/skill-advisor/README.md`, `.npmrc`, `package.json`, `.opencode/skill/system-spec-kit/package.json`
- Related phase packets: `021-smart-router-context-efficacy/`, `022-skill-advisor-docs-and-code-alignment/`, `023-smart-router-remediation-and-opencode-plugin/`, `024-deferred-remediation-and-telemetry-run/`

## 9. Artifacts
- `iterations/iteration-001.md` .. `iterations/iteration-040.md`
- `deep-review-state.jsonl`
- `deep-review-strategy.md`
- `findings-registry.json`
- `review-report.md`
