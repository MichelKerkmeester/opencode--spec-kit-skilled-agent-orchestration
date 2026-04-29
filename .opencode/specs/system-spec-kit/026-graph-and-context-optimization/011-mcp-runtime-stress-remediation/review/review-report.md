# Review Report: 011 MCP Runtime Stress Remediation

## 1. Executive Summary

Verdict: **CONDITIONAL**. `hasAdvisories=true`.

The runtime changes in today's batch look directionally sound: the final committed `memory_search` handler now snapshots graph readiness, maps it into telemetry, and passes it into the decision envelope at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1163`; TC-3 now asserts `degradedReadiness` at `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:302`. The flat-first review/research resolver contract is also covered by focused tests at `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts:87`.

The condition is documentation and release-readiness honesty, not a P0 runtime blocker. Active findings: P0=0, P1=4, P2=2. The top P1s are stale packet continuity in 023/025/028 and broad-suite readiness still not green. Convergence was reached at iteration 10 with ratios `1.00, 0.09, 0.00, 0.00, 0.00, 0.31, 0.24, 0.05, 0.00, 0.00`.

## 2. Review Questions Answered

**RQ-1: Did 025 honestly close degradedReadiness wiring from handler to envelope?** Yes for final code. The handler calls `getGraphReadinessSnapshot(process.cwd())`, maps it, and passes `degradedReadiness` into `buildSearchDecisionEnvelope` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1163`. The live handler test now asserts the field at `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:302`.

**RQ-2: Did PP-1 TC-3 flip honestly?** Yes in code, but stale in 023 documentation. The old expected-failure text remains at `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam/implementation-summary.md:64` and `:113`, while 025 says TC-3 is met at `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/implementation-summary.md:122`.

**RQ-3: Did 026 remove readiness scaffolding without runtime regressions?** Mostly yes. 026 reports zero non-dist readiness references and TypeScript green at `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup/implementation-summary.md:56` and `:57`. The caveat is broad-suite readiness: full Vitest is explicitly not met at `:58` and `:133`.

**RQ-4: Did 028 preserve legacy pt-NN behavior while adding flat-first first-run behavior?** Yes. The resolver contract is documented in code at `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:169`, with tests for child flat first run at `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts:87`, reuse at `:109`, legacy pt-NN reuse at `:124`, and conflict allocation at `:142` and `:161`.

**RQ-5: Did security-sensitive JSONL/env/harness handling introduce a new risk?** No concrete security finding. The review sampled the live audit env path, harness export mode, mapper JSON handling, and research artifacts. No credential leak or path traversal finding was supported by file evidence.

**RQ-6: Is the track ready for v1.0.4 stress cycle?** Conditional. Targeted runtime checks are green, but stale continuity and broad-suite caveats should be remediated before using this batch as a clean release baseline. Strict spec validation also remains blocked by pre-existing recursive phase-link warnings on child specs; the parent/review artifacts themselves passed the content checks after compacting continuity fields.

## 3. Top Workstreams

Workstreams with findings:

- 023 live handler seam: stale expected-failure narrative after 025 closed TC-3.
- 025 degradedReadiness wiring: stale blocked task/typecheck state after final batch cleanup.
- 026 readiness cleanup: broad suite remains not green; core README has one stale readiness ownership sentence.
- 028 deep-review contract fixes: implementation is covered, but spec continuity remains pre-implementation; folder structure example still shows pt-01 first.

Workstreams reviewed without active findings:

- 022 stress-test results deep research: no security or sample-size blocker found in sampled research artifacts.
- 024 harness telemetry export mode: no sandbox/env/PII blocker found in sampled harness path.
- 027 memory_context structural channel research: research evidence was sampled without an active finding.
- 005/009 and 005/010 cross-track context: used as traceability context only, per strategy out-of-scope limits.

## 4. Cross-System Insights

The main integration risk is stale truth in the spec ladder. Runtime state advanced faster than packet continuity: 023 still describes a legitimate earlier gap, 025 still records a transient typecheck race, and 028 still advertises implementation as pending. That matters because the resume system treats continuity as operational state.

The 025/026 race was handled correctly in final code. The strategy warned not to review transient snapshots as final state at `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review/deep-review-strategy.md:49`; final targeted TypeScript and Vitest checks passed.

The 028 flat-first contract closes a real auditability gap. It reduces misplaced iteration trails, but one docs example still teaches the old first-run shape before the post-028 rule.

## 5. Active Findings Registry

| ID | Severity | Dimension | Status | Summary | Evidence |
|----|----------|-----------|--------|---------|----------|
| F-001 | P1 | traceability | open | 023 still presents degradedReadiness as an active expected-failure after 025 closed TC-3. | `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam/implementation-summary.md:64` |
| F-002 | P1 | traceability | open | 025 remains marked typecheck-blocked and incomplete although final batch state typechecks cleanly. | `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/tasks.md:83` |
| F-003 | P2 | maintainability | open | `core/README.md` still documents embedding-readiness ownership after 026 removed the scaffold. | `.opencode/skill/system-spec-kit/mcp_server/core/README.md:40` |
| F-004 | P1 | traceability | open | 028 spec continuity still describes pre-implementation work despite implementation summary completion. | `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes/spec.md:17` |
| F-005 | P1 | traceability | open | Full Vitest cannot be claimed green; broad suite failures/hang remain documented and reproduced. | `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup/implementation-summary.md:58` |
| F-006 | P2 | maintainability | open | `folder_structure.md` still shows a pt-01 child layout before the post-028 flat-first rule. | `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:196` |

## 6. Planning Packet

1. **Continuity cleanup packet - high leverage, high feasibility.** Owner: 011 follow-up. Update 023, 025, and 028 continuity/status fields so resume/search surfaces match final state. Dependencies: none. Recommended phase: immediate patch before v1.0.4.
2. **Release-readiness gate decision - high leverage, medium feasibility.** Owner: 026 or a new verification packet. Decide whether full Vitest failures are accepted as unrelated with a documented allowlist, or fix enough stale suites to make the broad command green. Dependencies: inspect current broad-suite failures. Recommended phase: before release readiness claim.
3. **Readiness docs cleanup - medium leverage, high feasibility.** Owner: 026 follow-up. Remove the stale `embedding-readiness state` sentence from `core/README.md`. Dependencies: none.
4. **Flat-first docs example cleanup - medium leverage, high feasibility.** Owner: 028 follow-up. Update the folder tree example so the first illustrated child run is flat, with `pt-NN` shown only as conflict/continuation branch. Dependencies: none.
5. **Optional sample-size language audit - low/medium leverage, medium feasibility.** Owner: next stress-cycle research. Keep percentile/rate claims directional unless backed by sufficient sample counts. Dependencies: next stress run outputs.

## 7. Convergence Audit

New finding ratios by iteration:

| Iter | Dimension | Ratio | New P0 | New P1 | New P2 | Signal |
|------|-----------|-------|--------|--------|--------|--------|
| 1 | correctness | 1.00 | 0 | 2 | 0 | continue |
| 2 | correctness | 0.09 | 0 | 0 | 1 | continue |
| 3 | correctness | 0.00 | 0 | 0 | 0 | continue |
| 4 | security | 0.00 | 0 | 0 | 0 | continue |
| 5 | security | 0.00 | 0 | 0 | 0 | continue |
| 6 | traceability | 0.31 | 0 | 1 | 0 | continue |
| 7 | traceability | 0.24 | 0 | 1 | 0 | continue |
| 8 | maintainability | 0.05 | 0 | 0 | 1 | approaching-convergence |
| 9 | maintainability | 0.00 | 0 | 0 | 0 | approaching-convergence |
| 10 | synthesis-prep | 0.00 | 0 | 0 | 0 | converged |

Dimension coverage: 1.0 across correctness, security, traceability, and maintainability. Stop reason: maxIterationsReached, with convergence evidence from the final two iterations. Quality gates passed: every concrete finding has file:line evidence, scope stayed within strategy, and each planned dimension was covered. No P0 findings required mandatory adversarial dialogue; P1 adversarial checks were recorded in `review/iterations/iteration-010.md:21`.

Validation note: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation --strict` failed after recursive validation with `Errors: 0 Warnings: 1`. The remaining blocker is a pre-existing parent-level `PHASE_LINKS` warning spanning child packet specs `019-028`; this review did not modify those prior packet docs because target authority was limited to the flat `review/` artifact directory plus parent continuity.

## 8. Sources

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review/deep-review-config.json:1-30`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review/deep-review-strategy.md:1-79`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review/deep-review-state.jsonl:1`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review/deep-review-findings-registry.json:1-57`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/research.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam/implementation-summary.md:55-115`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/024-harness-telemetry-export-mode/implementation-summary.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/tasks.md:80-102`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/implementation-summary.md:110-125`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup/implementation-summary.md:50-145`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/027-memory-context-structural-channel-research/research/research.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes/spec.md:1-40`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes/implementation-summary.md:1-110`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1160-1188`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts:1-88`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:280-310`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts`
- `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:1-180`
- `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts:1-177`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/skill/system-spec-kit/mcp_server/core/README.md:34-45`
- `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:190-222`

## 9. Open Questions

- Should broad Vitest become a hard v1.0.4 precondition, or should the track carry an explicit unrelated-failure allowlist?
- Should historical implementation summaries be amended when a later packet closes their "known limitation", or should continuity fields alone carry the active truth?
- Should flat-first docs include a minimal migration note for existing `pt-NN` packets, or is the resolver compatibility enough?
- Should the parent phase-link warning be remediated as a dedicated packet before the next strict recursive validator gate?
