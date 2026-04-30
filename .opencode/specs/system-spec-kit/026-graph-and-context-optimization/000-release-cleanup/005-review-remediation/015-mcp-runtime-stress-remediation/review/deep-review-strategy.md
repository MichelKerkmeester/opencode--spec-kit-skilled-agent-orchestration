# Deep Review Strategy: 015-mcp-runtime-stress-remediation (today's batch)

## Target
`specs/system-spec-kit/026-graph-and-context-optimization/015-mcp-runtime-stress-remediation` (track-mode, all children but with focus on today's 022-028 + cross-reference to sibling 005/009 + 005/010).

## Executor
- cli-codex `gpt-5.5` reasoning=`high` service-tier=`fast`
- maxIterations=10, convergenceThreshold=0.10, stuckThreshold=2

## Today's commit set (9 total)

| Commit | Packet | Type |
|---|---|---|
| `b1489f1b2` | `005-review-remediation/009-stress-test-pattern-documentation` | docs (sk-doc 14--stress-testing) |
| `e91d2c7c2` | `005-review-remediation/010-vestigial-embedding-readiness-gate-removal` | fix (gate delete) |
| `746afa266` | `011/022-stress-test-results-deep-research` | research (5-iter on v1.0.3) |
| `af22aa045` | `011/023-live-handler-envelope-capture-seam` | test (PP-1 behavioral) |
| `c4f738b1d` | `011/024-harness-telemetry-export-mode` | test (PP-2 harness types) |
| `bd0de4b6b` | `011/025-memory-search-degraded-readiness-wiring` | feat (degradedReadiness Option C) |
| `733ce07c3` | `011/026-readiness-scaffolding-cleanup` | chore (8 prod + 18 test files) |
| `cb19d4cb3` | `011/027-memory-context-structural-channel-research` | research (5-iter fusion) |
| `649b46576` | `011/028-deep-review-skill-contract-fixes` | fix (resolver + YAMLs + docs) |

## Iteration Focus Map (Pre-Plan; iterations may refine)

| Iter | Dimension | Focus |
|------|-----------|-------|
| 1 | correctness | 025 degradedReadiness wiring: handler→snapshot→mapper→envelope path; PP-1 TC-3 flip honest; W10 refactor preserves richer-payload path |
| 2 | correctness | 026 scaffolding cleanup: all references removed; production runtime unchanged; no orphan exports |
| 3 | correctness | 028 resolver: flat-first edge cases; existing pt-NN consumers don't regress; reuse semantics; prior-target-mismatch branching |
| 4 | security | 023 PP-1 + 024 PP-2 + 025 mapper: sandbox/env-var handling, JSONL path traversal, mock-vs-real layer disclosure honesty, telemetry payload PII surfaces |
| 5 | security | 022 + 027 research deltas: external-source citations, no leaked credentials/tokens, sample-size guards activated |
| 6 | traceability | Cross-cycle references: 023 → 025 (TC-3 flip), 010 → 026 (gate→scaffolding), 022 → 023/024/025 (Planning Packet realized), 027 Planning Packet (deferred but well-formed) |
| 7 | traceability | Spec ↔ Code: REQ acceptance criteria match commits; checklist evidence cited; HANDOVER carry-forward |
| 8 | maintainability | Skill contract fixes (028) impact: how much future drift was prevented; doc/code alignment; backwards compat for legacy pt-01 packets |
| 9 | maintainability | Naming consistency, dead-code disposal, error-message clarity, test-mock noise level (now that 026 dropped 18 files of mocks) |
| 10 | (synthesis-prep) | All 4 dimensions cross-check + adversarial self-check on any P0/P1 surfaced; convergence rationale |

## Known Context

### Today's anomaly arc
v1.0.3 stress test (Phase H) produced CONDITIONAL verdict with 3 caveats:
1. Live handler probe blocked by 30s timeout — root cause = vestigial readiness gate at memory-search.ts:927-932 from pre-T016-T019 era
2. Telemetry samples were composed via packet-local wrapper, not native harness output
3. degradedReadiness envelope field always undefined

Today closed all 3 caveats: 010 deleted the gate; 023+024 add the test seam + harness export; 025 wires degradedReadiness via Option C (handler-side getGraphReadinessSnapshot snapshot, since the search pipeline never invokes handleCodeGraphQuery as Option A had assumed).

### Race condition at commit time (025/026)
025 finished first and reported `npx tsc --noEmit fails on missing core/index exports outside the 025 target authority`. Diagnosis: 026 was concurrently editing `core/index.ts` to delete readiness exports while 025 was running its tsc check. Final state after 026 completed is clean (TypeScript compiles, all targeted vitests pass). Reviewer should verify no transient artifacts persist.

### Skill contract fixes (028)
- `resolveArtifactRoot`: flat-first for child-phase first runs (no pt-01 wrapper)
- 4 YAMLs: synthesis end auto-stages `git add {artifact_dir}` so future operator commits don't drop the iteration trail (the bug observed in commit 6a8095907)
- Docs updated across SKILL.md, state_format.md, folder_structure.md

### Resource Map
Required: yes. The review must produce `review/resource-map.md` enumerating files reviewed and remediation candidates.

## Constraints
- READ ONLY for code under review.
- Per-iter file:line citations MANDATORY for any concrete finding.
- Speculation findings get severity ≤ P2 with explicit `speculation: true` flag.
- Convergence honest; stop when severity-weighted newFindingsRatio < 0.10 for 2 consecutive iters OR max=10 reached.
- Adversarial self-check on every P0; encouraged on P1 if evidence is thin.
- 18 test files were modified by 026; reviewer should sample 3-5 for non-superficial regressions, not all 18.

## Synthesis Targets
- `review/review-report.md` — 9-section structure (Executive Summary, RQs Answered, Top Workstreams, Cross-System Insights, Active Findings Registry, Planning Packet, Convergence Audit, Sources, Open Questions)
- `review/resource-map.md` — files reviewed + remediation paths
- Per-RQ verdicts with file:line evidence
- Open questions for downstream phases
- Final verdict: PASS / CONDITIONAL / FAIL with hasAdvisories flag

## Out of Scope
- Older 011 children (001-021) NOT in today's batch — touch only as cross-references, don't audit.
- Sibling 005-review-remediation/009 + 010 — referenced as context only; full audit on those is a separate run if needed.
- Modifying any reviewed code.
- Re-running stress tests v1.0.3 or earlier.
