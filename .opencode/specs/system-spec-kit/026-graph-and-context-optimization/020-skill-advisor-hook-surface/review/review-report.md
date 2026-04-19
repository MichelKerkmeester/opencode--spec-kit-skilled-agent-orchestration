# Deep Review Report — Skill-Advisor Phase Stack (020 + 021/001 + 021/002 + 022 + 023 + 024)

## 1. Executive Summary
This deep review audited the shipped skill-advisor phase stack across nine iterations before converging, covering all seven configured dimensions with code, test, and documentation evidence. The review found **0 P0**, **3 P1**, and **1 P2** findings. Final verdict is **PASS** under the packet's explicit rule set (`0 P0` and `<=5 P1`), with advisories retained because the shipped stack still has several correctness-of-implementation gaps worth fixing before broadening adoption.

Top risks are: raw prompts remain exposed on the Python subprocess command line, the producer and runtime maintain two different advisor-brief authorities, and the OpenCode plugin uses a looser default confidence threshold than the main hook path. None of these invalidate the shipped phase stack outright, but together they reduce privacy confidence, measurement fidelity, and transport parity.

## 2. Scope
In scope:
- Phase 020 skill-advisor hook surface
- Phase 021/001 smart-router context efficacy
- Phase 021/002 follow-on smart-router validation surfaces
- Phase 022 docs/code alignment
- Phase 023 smart-router remediation and OpenCode plugin path
- Phase 024 deferred remediation and telemetry run assets

Reviewed artifacts included hook/runtime code, shared-payload and renderer code, observability scripts, the OpenCode plugin and bridge, automated tests, packet docs, and corpus/parity references used by the shipped stack.

Out of scope:
- Reopening the Phase 020 architecture
- New implementation work
- Previously acknowledged live-AI telemetry gaps and the two pre-existing non-020 test failures called out as deferred in strategy

## 3. Methodology
The review followed the deep-review packet protocol: read state and strategy first, review one primary dimension per iteration, externalize findings into `iterations/iteration-NNN.md`, append JSONL state, and stop only on convergence or cap. Severity followed the packet's P0/P1/P2 rules, with P0 reserved for validated blockers. Execution used the requested sequential single-worker mode (`cli-copilot gpt-5.4 high`, maxConcurrent=1 in spirit; no sub-agents were dispatched).

Although the packet allowed up to 40 iterations, the loop converged after **9** iterations because all seven dimensions were covered and the final rolling three-iteration `newInfoRatio` average was **0.03** (`0.04`, `0.03`, `0.02`), with `stuck_counter=3` and no new P0 in the final window.

## 4. Evidence Classes
Primary evidence classes:
- Source code under `.opencode/skill/system-spec-kit/mcp_server/lib/**`
- Runtime hook adapters under `.opencode/skill/system-spec-kit/mcp_server/hooks/**`
- OpenCode plugin code under `.opencode/plugins/**`
- Automated tests under `.opencode/skill/system-spec-kit/mcp_server/tests/**`
- Observability scripts under `.opencode/skill/system-spec-kit/scripts/observability/**`
- Packet docs and operator docs under `.opencode/skill/system-spec-kit/references/**` and `.opencode/skill/skill-advisor/**`

Secondary evidence classes:
- Phase packet specs and plans for 020/021/022/023/024
- The shipped labeled prompt corpus and parity fixtures used by the phase stack
- Prior deferral context recorded in the strategy packet

## 5. Per-Dimension Findings

### D1 Security + Privacy
The stack keeps prompts out of rendered briefs, cache keys, JSONL diagnostics, health output, and shared-payload metadata, and the disable flag behavior is consistent across runtimes. The remaining privacy gap is earlier in the pipeline: the Python advisor subprocess still receives the raw prompt on argv, which falls outside the persisted-surface protections.
- **P0 findings**: none
- **P1 findings**: `P1-001-01`
- **P2 findings**: none

### D2 Correctness
Core correctness checks were solid. Shared-payload envelope creation, freshness semantics, fail-open behavior, and four-runtime hook adapters were internally consistent in the reviewed paths.
- **P0 findings**: none
- **P1 findings**: none
- **P2 findings**: none

### D3 Performance + Observability
The observability stack is intentionally limited and mostly honest about that limitation. Static measurement, compliance JSONL, and the live-session wrapper are caveated as predicted/observe-only surfaces rather than live causal proof, and no new defect rose above advisory level here.
- **P0 findings**: none
- **P1 findings**: none
- **P2 findings**: none

### D4 Maintainability + sk-code-opencode Alignment
The largest maintainability problem is internal authority drift: `buildSkillAdvisorBrief()` manufactures one brief string while the runtime renderer emits another. That split now affects downstream measurement and makes it harder to reason about what the system actually injects versus what it stores or sizes.
- **P0 findings**: none
- **P1 findings**: `P1-004-01`
- **P2 findings**: none

### D5 Integration + Cross-runtime
The four core runtime hooks maintain visible brief parity, but the OpenCode plugin sits outside that guarantee because it carries a different default threshold. The bridge reuses the core producer/renderer path, yet the policy default itself diverges, so identical prompts can yield different recommendation behavior depending on transport.
- **P0 findings**: none
- **P1 findings**: `P1-005-01`
- **P2 findings**: none

### D6 Test Coverage + Test-code Quality
The suite is broad and generally well targeted, but it misses the exact two drift vectors this review found most valuable: subprocess-level prompt exposure and plugin-vs-hook parity/default-threshold drift. That leaves the current tests less diagnostic than their overall footprint suggests.
- **P0 findings**: none
- **P1 findings**: none
- **P2 findings**: `P2-006-01`

### D7 Documentation Accuracy
The operator docs, README, feature catalog, playbook, and live-wrapper setup remained directionally aligned with the shipped product. No standalone doc defect warranted elevation beyond the already logged code/test issues.
- **P0 findings**: none
- **P1 findings**: none
- **P2 findings**: none

## 6. Verdict

Verdict: **PASS**  
hasAdvisories: **true**

Rationale: The explicit packet rule says PASS when there are zero validated P0 findings and five or fewer P1 findings. This review finished with `P0=0`, `P1=3`, and `P2=1`, so it clears that gate.

That said, this is a qualified PASS rather than a clean bill of health. The remaining issues are not theoretical: one weakens privacy at the subprocess boundary, one corrupts the single-source-of-truth story for advisor brief text and byte accounting, and one breaks transport parity between the main hook path and the plugin. Those should be remediated before using the current stack as a stronger privacy or parity reference implementation.

## 7. Remediation Plan

| ID | Dimension | Headline | Owner suggestion | Effort | Target |
|---|---|---|---|---|---|
| P1-001-01 | D1 | Remove raw prompt from subprocess argv | skill-advisor runtime owner | M | pre-release |
| P1-004-01 | D4 | Collapse producer/runtime brief rendering to one authority | hook + observability owner | M | next-sprint |
| P1-005-01 | D5 | Centralize plugin and hook default thresholds | plugin/hook integration owner | S | next-sprint |
| P2-006-01 | D6 | Add subprocess privacy and plugin parity tests | test owner | S | backlog |

## 8. Cross-references
- Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/spec.md`
- Plan: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/plan.md`
- Iterations: `review/iterations/iteration-001.md` through `review/iterations/iteration-009.md`
- D1 evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts`
- D4 evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts`
- D5 evidence: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- D6 evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts`
- Related phase packets: `021-smart-router-context-efficacy/`, `022-skill-advisor-docs-and-code-alignment/`, `023-smart-router-remediation-and-opencode-plugin/`, `024-deferred-remediation-and-telemetry-run/`

## 9. Artifacts
- `iterations/iteration-001.md` .. `iterations/iteration-009.md` (9 iterations)
- `deep-review-state.jsonl` (full state log)
- `deep-review-strategy.md` (strategy doc)
- `findings-registry.json` (indexed findings)
