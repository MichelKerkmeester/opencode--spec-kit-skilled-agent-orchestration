# Iteration 3 — Traceability

## Dimension

D3 Traceability. Scope: deferred-item status, v1.0.2 packet evidence, feature catalog and manual playbook impact audits, context-index mappings, resource-map coverage, ADR numbering, and cross-runtime path references.

## Files Reviewed

61 targeted files or live-entry surfaces were reviewed, including:

- `HANDOVER-deferred.md`, `context-index.md`, `resource-map.md`, `feature-catalog-impact-audit.md`, `testing-playbook-impact-audit.md`
- `010-stress-test-rerun-v1-0-2/findings.md`
- Child metadata/spec surfaces for `012` through `018`
- Implementation summaries for packets `003` through `009`, plus `002-mcp-runtime-improvement-research/research/research.md`
- Live catalog entries under `.opencode/skill/system-spec-kit/feature_catalog/`
- Live playbook entries under `.opencode/skill/system-spec-kit/manual_testing_playbook/`, `.opencode/skill/cli-copilot/manual_testing_playbook/`, `.opencode/skill/sk-deep-research/manual_testing_playbook/`, and `.opencode/skill/sk-deep-review/manual_testing_playbook/`
- Cross-runtime references to `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, and cli-* score evidence

## Findings — P0

None.

## Findings — P1

None.

## Findings — P2

### F-003 — `HANDOVER-deferred.md` still describes downstream remediation as deferred even though child packets 012-018 now own the work

`HANDOVER-deferred.md` says items 4-7 are only scaffolded into `011-post-stress-followup-research`, and that "per-follow-up remediation packets are downstream work the user authors after reviewing the synthesis." It then points the P0/P1/P2/opportunity follow-ups only at the research synthesis. [SOURCE: `HANDOVER-deferred.md:75`] [SOURCE: `HANDOVER-deferred.md:77`] [SOURCE: `HANDOVER-deferred.md:79`] [SOURCE: `HANDOVER-deferred.md:80`] [SOURCE: `HANDOVER-deferred.md:81`] [SOURCE: `HANDOVER-deferred.md:82`]

The child packet tree now contradicts that deferred-only state: packet `012` is the P0 cli-copilot target-authority helper and marks implementation complete/pending operator review, while its graph metadata is `complete`; packet `013` is complete for degraded graph fallbackDecision; packet `014` is implemented; packet `016` is implemented; packet `017` is implementation complete/pending operator review; packet `018` exists and is in progress. [SOURCE: `012-copilot-target-authority-helper/spec.md:53`] [SOURCE: `012-copilot-target-authority-helper/spec.md:54`] [SOURCE: `012-copilot-target-authority-helper/graph-metadata.json:60`] [SOURCE: `013-graph-degraded-stress-cell/spec.md:44`] [SOURCE: `013-graph-degraded-stress-cell/spec.md:45`] [SOURCE: `014-graph-status-readiness-snapshot/spec.md:48`] [SOURCE: `014-graph-status-readiness-snapshot/spec.md:49`] [SOURCE: `016-degraded-readiness-envelope-parity/spec.md:54`] [SOURCE: `016-degraded-readiness-envelope-parity/spec.md:55`] [SOURCE: `017-cli-copilot-dispatch-test-parity/spec.md:52`] [SOURCE: `017-cli-copilot-dispatch-test-parity/spec.md:53`] [SOURCE: `018-catalog-playbook-degraded-alignment/graph-metadata.json:47`]

Impact: resume flows that follow the handover can route already-owned remediation back into research instead of the live child packets. Severity stays P2 because the child packets and graph metadata are present; this is a navigation/status-truth drift, not a shipped-code contradiction.

### F-004 — Root catalog/playbook impact audits now contradict the live catalog and playbook state

The feature-catalog audit claims the feature catalog "has not been updated for any" phase-011 behavior changes and reports zero hits for the new field/helper tokens. [SOURCE: `feature-catalog-impact-audit.md:15`] [SOURCE: `feature-catalog-impact-audit.md:189`] [SOURCE: `feature-catalog-impact-audit.md:190`]

The live catalog now contains those updates: `memory_context` documents `preEnforcementTokens`, `returnedTokens`, `actualTokens`, `droppedAllResultsReason`, `classificationKind`, and `paraphraseGroup`; the CocoIndex bridge documents `rawScore`, `pathClass`, `rankingSignals`, `dedupedAliases`, and `uniqueResultCount`; the code-graph auto-trigger page documents per-handler `fallbackDecision`; the readiness contract page documents `readiness.action`. [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:23`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:29`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md:13`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md:24`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md:37`]

The testing-playbook audit similarly says 0 of 14 behavior surfaces are fully covered and that no outright contradictions were found, but the live playbook now has several of the recommended entries and updates: code-graph fast-fail `277`, daemon rebuild `278`, graph degraded isolation `279`, cli-copilot CP-002 caveat, and sk-deep-research DR-030 target-authority dispatch. [SOURCE: `testing-playbook-impact-audit.md:23`] [SOURCE: `testing-playbook-impact-audit.md:348`] [SOURCE: `testing-playbook-impact-audit.md:358`] [SOURCE: `testing-playbook-impact-audit.md:364`] [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/277-code-graph-fast-fail.md:21`] [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/278-mcp-daemon-rebuild-restart-live-probe.md:18`] [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/279-graph-degraded-stress-cell-isolation.md:3`] [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/01--cli-invocation/002-allow-all-tools-sandboxed-write.md:34`] [SOURCE: `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/030-cli-copilot-target-authority-dispatch.md:2`]

Impact: the audits are now stale-by-contradiction. They still help as historical gap reports, but as current-state guidance they overstate missing work and can cause duplicate or misprioritized remediation. Severity stays P2 because live catalog/playbook entries exist and no P0/P1 behavior is contradicted; the root audit documents need a refresh label or replacement.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| T1 `HANDOVER-deferred.md` ↔ child packet status | Partial | New F-003. Handover still says downstream packets are future work while packets 012-017 are complete/implemented and 018 is in progress. |
| T2 v1.0.2 findings ↔ remediation packet evidence | Pass | `010/findings.md` correctly reports 6/7 PROVEN and packet 005 NEUTRAL. Packets 003, 004, 006, 007, 008, and 009 all have shipped source/test/build or live-probe evidence; packet 005's NOT-PROVEN state traces to the known weak-state/fallbackDecision root cause. |
| T3 `feature-catalog-impact-audit.md` ↔ feature catalog | Partial | New F-004. The audit is contradicted by current catalog entries that now include the fields it reported absent. |
| T4 `testing-playbook-impact-audit.md` ↔ manual playbook | Partial | New F-004. The audit is contradicted by current playbook entries that now cover several recommended scenarios; some gaps remain, including the missing sk-deep-review cli-copilot target-authority playbook entry. |
| T5 `context-index.md` ↔ child packets | Pass | The old-to-new path map covers 001-009 and all mapped folders exist. It intentionally records migration history rather than the full 010-018 live manifest. No orphaned mapped path found. |
| T6 resource-map coverage gate | Partial | Prior F-001 remains active and is quantified below: 7/18 child folders are absent from the parent map, and 011 is listed as pending/scaffold-stage despite later downstream work. |
| T7 ADR / decision references across packets | Pass | No conflicting packet-local ADR numbering found. Packet 016 owns ADR-001 and ADR-002 in its own `decision-record.md`; stress-score references to ADR-002 point at the separate memory-save decision record by path. |
| T8 cross-runtime references | Pass | Core cli-copilot/codex/opencode references resolve to live files after the reorg. Missing playbook entries are covered under T4, not broken implementation-path references. |

## Resource Map Coverage

Resource-map gate remains active. This expands prior F-001 with quantification instead of re-flagging it.

| Child | Map status | Classification | Notes |
|-------|------------|----------------|-------|
| 001-search-intelligence-stress-test | Present | expected-by-scope | Listed in `resource-map.md:54`. |
| 002-mcp-runtime-improvement-research | Present | expected-by-scope | Listed in `resource-map.md:55`. |
| 003-memory-context-truncation-contract | Present | expected-by-scope | Listed in `resource-map.md:56`. |
| 004-cocoindex-overfetch-dedup | Present | expected-by-scope | Listed in `resource-map.md:57`. |
| 005-code-graph-fast-fail | Present | expected-by-scope | Listed in `resource-map.md:58`. |
| 006-causal-graph-window-metrics | Present | expected-by-scope | Listed in `resource-map.md:59`. |
| 007-intent-classifier-stability | Present | expected-by-scope | Listed in `resource-map.md:60`. |
| 008-mcp-daemon-rebuild-protocol | Present | expected-by-scope | Listed in `resource-map.md:61`. |
| 009-memory-search-response-policy | Present | expected-by-scope | Listed in `resource-map.md:62`. |
| 010-stress-test-rerun-v1-0-2 | Present | expected-by-scope | Listed complete in `resource-map.md:63`. |
| 011-post-stress-followup-research | Present but stale | gap | Listed as scaffold-stage/pending in `resource-map.md:64`, while downstream packets 012-018 now exist. |
| 012-copilot-target-authority-helper | Missing | absent-from-map | Implementation packet exists; no map row or exclusion. |
| 013-graph-degraded-stress-cell | Missing | absent-from-map | Implementation packet exists; no map row or exclusion. |
| 014-graph-status-readiness-snapshot | Missing | absent-from-map | Implementation packet exists; no map row or exclusion. |
| 015-cocoindex-seed-telemetry-passthrough | Missing | absent-from-map | Implementation packet exists; no map row or exclusion. |
| 016-degraded-readiness-envelope-parity | Missing | absent-from-map | Implementation packet exists; no map row or exclusion. |
| 017-cli-copilot-dispatch-test-parity | Missing | absent-from-map | Implementation packet exists; no map row or exclusion. |
| 018-catalog-playbook-degraded-alignment | Missing | absent-from-map | Implementation packet exists and is in progress; no map row or exclusion. |

Quantification: 11/18 children are listed, 1/18 listed-but-stale (`011`), 7/18 absent from the map, 0 `applied/T-*.md` reports found under the 011 tree, so 0 children classify as `touched` by applied-report evidence.

## Claim Adjudication Packets

- F-003 adjudication: confirmed. Handover deferred status is contradicted by child packet statuses. Severity P2 because current child packets are discoverable through the live tree and metadata.
- F-004 adjudication: confirmed. Root impact audits are contradicted by live catalog/playbook entries. Severity P2 because this is current-state documentation drift, not a missing runtime fix.
- No P0/P1 claim packets required; no P0/P1 findings were opened.

## Verdict

PASS with advisories. No new P0/P1 findings. Active P2 count increases from 2 to 4.

## Next Dimension

Iteration 4 should cover maintainability: packet topology clarity after 012-018, status vocabulary consistency (`Complete`, `Implemented`, `Implementation Complete`, `in_progress`), audit-doc lifecycle labeling, and whether parent-level ledgers should be regenerated or explicitly marked historical.
