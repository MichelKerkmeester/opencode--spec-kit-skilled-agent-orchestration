# Iteration 4 — Maintainability

## Dimension

D4 Maintainability. This pass checked whether the 18-child phase parent remains easy to navigate, whether v1.0.2 verdicts and Q1-Q8 diagnoses are reproducible, whether packets 012-018 preserve the post-stress research handoff, whether the daemon-rebuild operator surface is usable, whether remediation tests share durable fixtures, and whether phase-DAG orchestration assumptions apply to this folder.

## Files Reviewed

- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/context-index.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/resource-map.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/plan.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/tasks.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/spec.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/implementation-summary.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/references/mcp-rebuild-restart-protocol.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/references/live-probe-template.md`
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph-degraded-sweep.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts`
- Review state files: `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`

## Findings — P0

None.

## Findings — P1

None.

## Findings — P2

### F-005 — Phase-parent navigation is flat after the tree expanded to 18 children

The parent now lists children 001-018 in one long table, but the navigation surfaces do not group them by lifecycle phase or extend handoff criteria past 009. The parent map includes the added rerun, post-stress research, and planned-fix packets at `spec.md:111-119`, while the phase handoff table still stops at `009-memory-search-response-policy` and the post-cycle close-the-loop handoff at `spec.md:129-137`. The context index is still a migration bridge for the 006-014 -> 001-009 carve-out: it maps only the original nine children at `context-index.md:19-33` and its "Where to read more" table points to broad documents rather than a cycle-phase navigator at `context-index.md:60-68`.

Impact: a new maintainer can eventually reconstruct the topology, but not in the <1 minute path the maintainability prompt asks for. They must infer the lifecycle groupings from a flat 18-row table and know that the 010-018 dependency chain is newer than the handoff table.

Fix: add a compact "Cycle Navigator" to `context-index.md` or parent `spec.md` grouping children as baseline (`001`), research (`002`), remediations (`003-009`), rerun (`010`), post-stress research (`011`), and planned/follow-up fixes (`012-018`). Extend phase handoff criteria for `010 -> 011 -> 012-018`, and document why numbering continues from 010 rather than being renumbered into a second parent.

### F-006 — Verdict and diagnosis inputs are not fully replayable from machine-readable artifacts

The v1.0.2 rerun preserves dispatch metadata as `meta.json`, but the scoring inputs and verdict math live primarily in markdown. `findings.md` states that v1.0.2 columns are sourced from per-cell `runs/{cell}/{cli-N}/score.md` files at `010-stress-test-rerun-v1-0-2/findings.md:37-40`, defines delta and per-packet verdict rules in prose at `010-stress-test-rerun-v1-0-2/findings.md:24-33`, and then publishes aggregate tables at `010-stress-test-rerun-v1-0-2/findings.md:55-77`. The packet plan likewise says the findings synthesizer is authored at synthesis time rather than generated from a durable machine table (`010-stress-test-rerun-v1-0-2/plan.md:113-116`).

The older Q1-Q8 research packet has the same maintainability shape. Its synthesis says Q1-Q7 have markdown plus delta evidence, but Q8's detailed narrative was overwritten and should be treated as lower-evidence at `002-mcp-runtime-improvement-research/research/research.md:57` and `002-mcp-runtime-improvement-research/research/research.md:81`. It also rates delta JSONL as high-credibility but the findings registry as low for final status at `002-mcp-runtime-improvement-research/research/research.md:149-156`.

Impact: a future maintainer can audit the result manually, but cannot rerun the rubric or recompute packet verdicts without parsing markdown tables and narrative. That makes v1.0.3 calibration, second-reviewer scoring, or disagreement analysis brittle.

Fix: add a small `scores.jsonl` or `verdict-inputs.json` artifact for packet 010 with one row per cell: scenario, CLI, baseline score, dimension scores, total, delta, classification, packet attribution, fork-telemetry assertions, and source artifact paths. For packet 002, add a `diagnoses.jsonl` extract for Q1-Q8 that names the source iteration(s), evidence status, root cause, recommended packet, confidence/evidence caveat, and whether narrative evidence is complete.

## Traceability Checks

| ID | Check | Status | Notes |
|----|-------|--------|-------|
| M1 | 18-child phase-parent navigability | partial | Flat table exists and context-index explains old renumbering, but no lifecycle grouping or 010-018 handoff map. New F-005. |
| M2 | v1.0.2 verdict reproducibility | partial | Raw run artifacts and markdown scores exist; no machine-readable score/verdict table. New F-006. |
| M2b | Q1-Q8 diagnosis reproducibility | partial | Delta JSONL exists; Q8 narrative is explicitly lower-evidence/overwritten. New F-006. |
| M3 | Patch proposal handoff quality 012-018 | pass | Sampled packets include REQs, target files, source/predecessor/dependency fields, and LOC estimates consistent with the 011 synthesis. `012` is especially strong after iter-2's security validation. |
| M4 | Cleanup CLI / daemon-rebuild operator surface | pass | Packet 008 reference docs state the restart contract, per-client restart procedures, anti-patterns, and copy-paste probe templates. No new finding. |
| M5 | Cross-packet shared-test infrastructure | pass-with-advisory | Tests are packet-specific and duplicate some mock setup, but packet 016 adds a cross-handler parity suite and the duplication keeps fixtures local to their contract. No blocking maintainability issue. |
| M6 | Implementation summary / parent-cycle completeness | partial | Parent spec reflects 001-018, but the dependency/handoff criteria stop before the rerun/follow-up/planned-fix chain. Covered by F-005. |
| M7 | Phase-DAG runner alignment | notApplicable | The phase-DAG runner is a code-graph indexing orchestration primitive, not a spec-folder phase-parent executor. 011 operates through spec-folder phase docs and graph metadata, which is appropriate. |

## Resource Map Coverage

Resource-map gate remains active. I did not re-flag prior F-001. Maintainability evidence still treats `resource-map.md` as stale for 012-018 per earlier iterations, but this pass focused on parent navigation and reproducibility rather than repeating the coverage finding.

## Claim Adjudication Packets

- No new P0/P1 claim-adjudication packets required.
- P2 adjudication for F-005: parent navigation and handoff completeness checked against `context-index.md` and parent `spec.md`; finding is documentation maintainability only.
- P2 adjudication for F-006: score/diagnosis reproducibility checked against packet 010 findings/plan and packet 002 research synthesis; finding is artifact-shape maintainability only.

## Verdict

PASS with advisories. No new P0/P1 findings. New findings are two P2 maintainability improvements: lifecycle navigation and machine-readable reproducibility artifacts.

## Next Dimension

STOP candidate — all 4 dimensions covered.
