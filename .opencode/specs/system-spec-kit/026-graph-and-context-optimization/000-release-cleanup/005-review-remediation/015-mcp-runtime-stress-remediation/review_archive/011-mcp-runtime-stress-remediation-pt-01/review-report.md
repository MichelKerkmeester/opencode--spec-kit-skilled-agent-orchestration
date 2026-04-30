# Deep Review Report — 015-mcp-runtime-stress-remediation

## 1. Executive Summary

Overall verdict: **PASS** (`hasAdvisories=true`).

Active findings: P0=0, P1=0, P2=6.

The v1.0.2 stress-test cycle holds up under deep review. The 6/7 PROVEN claim, 0 REGRESSION claim, 83.8% overall score, and pre-flight daemon attestation contract all pass independent verification. The proposed P0 cli-copilot Gate 3 fix in `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` plus `buildCopilotPromptArg` is correctly implemented across all five security sub-checks: authority insertion, plan-only safe-fail, target-authority preamble, recovered-context resistance, and helper test coverage.

The six active P2 advisories are documentation drift, wording precision, navigation, observability, and replayability issues. None blocks release.

Release readiness: **PASS**, conditional on closing the six P2 advisories, completing the four patch-proposal child packets 012-015, and clearing remaining HANDOVER-deferred wording drift surfaced by F-003.

## 2. Planning Trigger

`/spec_kit:plan` is optional. No P0/P1 findings remain. The six P2 advisories can be closed in one light cleanup batch or deferred as tracked advisory work.

Planning Packet:

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": {"P0": 0, "P1": 0, "P2": 6},
  "remediationWorkstreams": [
    "parent-resource-map-refresh",
    "post-stress-research-wording-correction",
    "handover-deferred-stale-wording-update",
    "audit-vs-live-state-reconciliation",
    "phase-parent-navigation-grouping",
    "verdict-replayability-machine-readable"
  ],
  "specSeed": "Annotate root spec.md with explicit pointer to the 4 patch-proposal packets (012-015) and document the resource-map refresh policy.",
  "planSeed": "Phase 1: P2 cleanup batch. Phase 2: monitor 012-015 implementation for completeness."
}
```

## 3. Active Finding Registry

### F-001 — Parent `resource-map.md` is stale relative to the 18-child phase parent

- Severity: P2
- Dimension: correctness
- File:line: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/resource-map.md:21`, `:24`, `:63`, `:64`, `:117`, `:120`
- Evidence excerpt: `resource-map.md:21` reports "Total references: 35"; `resource-map.md:24` scopes the map only through the 010 v1.0.2 scaffold; `resource-map.md:63-64` lists 010 and 011 only after children 001-009, with 011 still "Scaffold-stage"; `resource-map.md:117-120` says the map covers all 9 children and future post-cycle work should append rows. The parent manifest now lists children 010-018 at `spec.md:111-119`.
- Impact: The discovery metadata exists, but the parent path ledger no longer reflects the live 18-child tree. Reviewers can miss children 012-018 or treat 011 as pending.
- Fix recommendation: Refresh `resource-map.md` totals, scope text, 011 status, and child rows for 012-018. Document a refresh policy or explicit planned-extension placeholder for future child additions.
- Disposition: active

### F-002 — Post-stress research convergence wording overclaims monotonic decay

- Severity: P2
- Dimension: correctness
- File:line: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md:47`
- Evidence excerpt: line 47 records `0.74 -> 0.58 -> 0.46 -> 0.41 -> 0.46 -> 0.38 -> 0.34 -> 0.46 -> 0.27 -> 0.22`, then calls it "Clean monotonic decay = converged. No oscillation, no rebound." The sequence rebounds at iterations 5 and 8.
- Impact: The convergence endpoint is supported, but the wording overstates the shape of the evidence.
- Fix recommendation: Replace the monotonic/no-rebound claim with "overall downward trajectory with rebounds at iterations 5 and 8."
- Disposition: active

### F-003 — `HANDOVER-deferred.md` still describes downstream remediation as deferred

- Severity: P2
- Dimension: traceability
- File:line: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/HANDOVER-deferred.md:77`, `:79`, `:80`, `:81`, `:82`
- Evidence excerpt: line 77 says per-follow-up remediation packets are downstream work after reviewing the synthesis; lines 79-82 still point the P0/P1/P2/opportunity follow-ups only at 011 research. The live parent manifest now has child packets 012-018 at `spec.md:113-119`.
- Impact: Resume flows can route already-owned remediation back into research instead of the live child packets.
- Fix recommendation: Collapse the relevant HANDOVER items to "tracked downstream" status and point each item at its owning child packet.
- Disposition: active

### F-004 — Root catalog/playbook impact audits contradict live state

- Severity: P2
- Dimension: traceability
- File:line: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/feature-catalog-impact-audit.md:15`, `:189`, `:190`; `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/testing-playbook-impact-audit.md:23`, `:348`, `:358`, `:364`
- Evidence excerpt: the catalog audit says the catalog has not been updated for any phase-011 behavior changes and reports zero token hits. The playbook audit says 0 of 14 behavior surfaces are fully covered and no outright contradictions were found. Iteration 3 verified that live catalog and playbook entries now include several of those fields and scenarios, so these root audits are stale as current-state guidance.
- Impact: The audits remain useful as historical gap reports, but now overstate missing work and can cause duplicate remediation.
- Fix recommendation: Reconcile both audit documents with the live feature catalog and playbook state, or relabel them as historical snapshots with replacement pointers.
- Disposition: active

### F-005 — Phase-parent navigation is flat after the tree expanded to 18 children

- Severity: P2
- Dimension: maintainability
- File:line: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/spec.md:111`, `:119`, `:129`, `:137`; `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/context-index.md:19`, `:33`, `:60`, `:68`
- Evidence excerpt: `spec.md:111-119` lists 010-018 in one flat parent table, while `spec.md:129-137` handoff criteria still stop at 009/post-cycle close-the-loop. `context-index.md:19-33` only maps the original nine renumbered children, and `context-index.md:60-68` points to broad documents rather than a cycle-phase navigator.
- Impact: A maintainer can reconstruct the topology, but the under-one-minute navigation path is gone.
- Fix recommendation: Add a compact cycle navigator grouping baseline, research, remediation, rerun, post-stress research, and planned/follow-up fixes. Extend handoff criteria for 010 -> 011 -> 012-018.
- Disposition: active

### F-006 — Verdict and diagnosis inputs are not fully replayable from machine-readable artifacts

- Severity: P2
- Dimension: maintainability
- File:line: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md:24`, `:33`, `:37`, `:40`, `:55`, `:77`; `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/plan.md:115`, `:116`; `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/research/research.md:57`, `:81`, `:149`, `:155`
- Evidence excerpt: packet 010 defines rubric, delta, and verdict math in markdown prose and tables, and the plan says the findings synthesizer is authored at synthesis time. Packet 002 explicitly labels Q8 as lower-evidence because visible iteration markdown was overwritten, while its source table rates delta JSONL high and the findings registry low for final status.
- Impact: The result is manually auditable, but not easily recomputable for v1.0.3 calibration, second-reviewer scoring, or disagreement analysis.
- Fix recommendation: Extract packet 010 rubric inputs into `verdict-inputs.json` or `scores.jsonl`; add a packet 002 `diagnoses.jsonl` with question, source iteration, evidence status, root cause, recommendation, confidence, and caveat fields.
- Disposition: active

## 4. Remediation Workstreams

- Documentation drift: F-001, F-003, F-004. Refresh stale parent docs, handover state, and current-state audit surfaces.
- Wording precision: F-002. Correct convergence language without changing the supported endpoint claim.
- Navigation / structure: F-005. Add lifecycle grouping for the 18-child phase parent.
- Replayability / auditability: F-006. Add machine-readable verdict and diagnosis sidecars.

## 5. Spec Seed

Annotate the parent `spec.md` with an explicit pointer to the four patch-proposal packets:

- 012: P0 cli-copilot target-authority helper
- 013: P1 graph degraded stress cell
- 014: P2 graph status readiness snapshot
- 015: opportunity/P2 CocoIndex seed telemetry passthrough

Document the resource-map refresh policy: when child packets are added, the parent `resource-map.md` must update or carry an explicit planned-extension placeholder.

Add a "machine-readable verdict inputs" requirement to future stress-test packets so rubric application is reproducible from JSON/JSONL artifacts, not only markdown synthesis.

## 6. Plan Seed

- T1: Refresh parent `resource-map.md` to reflect 18 children (F-001).
- T2: Soften "monotonic decay" wording in post-stress research synthesis to match actual data (F-002).
- T3: Update `HANDOVER-deferred.md` to reflect that 012-018 now own the deferred work; collapse to "tracked downstream" status (F-003).
- T4: Reconcile `feature-catalog-impact-audit.md` and `testing-playbook-impact-audit.md` with live catalog/playbook state (F-004).
- T5: Group children in `context-index.md` by cycle phase: baseline, research, remediation, rerun, follow-up, planned fixes (F-005).
- T6: Extract verdict rubric inputs from `findings.md` into a JSON sidecar with per-cell scores, weights, baseline, deltas, and source paths (F-006).

## 7. Traceability Status

Core protocols:

- `spec_code`: pass. The 011 parent spec mostly maps claims to children; drift is advisory and captured in F-001/F-003/F-005.
- `checklist_evidence`: pass. Children carry concrete file:line citations; iteration 3 confirmed v1.0.2 remediation evidence and child metadata.

Overlay protocols:

- `feature_catalog_code`: partial. F-004 captures catalog audit drift against live catalog state.
- `playbook_capability`: partial. F-004 captures playbook audit drift against live playbook entries.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: notApplicable.

## Resource Map Coverage Gate

Resource-map coverage gate is active because `resource-map.md` is present.

Entries touched:

- Iteration 3 found 0 `applied/T-*.md` reports under the 011 tree, so 0 children classify as touched by applied-report evidence.
- The parent map currently lists 11/18 children: 001-010 as present/current and 011 as present but stale.

Entries not touched / absent from the parent map:

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity/`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment/`

Implementation paths absent from `resource-map.md`: the seven child paths above. The map also lists `011-post-stress-followup-research/` as scaffold-stage/pending even though the parent manifest marks it complete.

## 8. Deferred Items

The four patch-proposal packets are planned downstream work, not deferred ambiguity:

- `012-copilot-target-authority-helper`
- `013-graph-degraded-stress-cell`
- `014-graph-status-readiness-snapshot`
- `015-cocoindex-seed-telemetry-passthrough`

Packets 016-018 are documentation-alignment and parity packets, also planned.

The pre-flight daemon attestation gate is documented and passed for v1.0.2. The next sweep has not been triggered; that is operator-controlled and is not a review finding.

## 9. Audit Appendix

Convergence summary:

- Iterations: 4 of 7; stopped early by convergence.
- Dimensions covered: correctness, security, traceability, maintainability.
- Ratio decay: 1.0 -> 0.0 -> ~0.05 -> ~0.05 as summarized by the loop manager. The raw state log records iteration 3 at `0.5`; the synthesis verdict treats that as stable low advisory churn after no P0/P1 findings and full dimension coverage.
- Stop reason: converged; composite weighted-stop score >= 0.60; all four dimensions covered; no P0/P1 findings.

Coverage summary:

- D1 correctness: 31 files reviewed.
- D2 security: 26 files reviewed.
- D3 traceability: 61 files reviewed.
- D4 maintainability: 29 files reviewed.
- Aggregate: about 147 file reads.

Ruled-out claims:

- 6/7 PROVEN packets in `010-stress-test-rerun-v1-0-2/findings.md` are sound. Evidence: `findings.md:67-77`.
- 0 REGRESSION classification holds against per-cell scoring. Evidence: `findings.md:55-63`.
- 83.8% overall verdict aggregate is computable. Evidence: `findings.md:63`.
- Pre-flight daemon attestation gate exists and is documented. Evidence: `findings.md:31`.
- P0 cli-copilot Gate 3 bypass fix in `executor-config.ts` + `buildCopilotPromptArg` is correctly implemented. Iteration 2 confirmed all five sub-checks.
- Daemon rebuild + restart contract holds as a documented operator contract.
- CocoIndex fork dedup semantics hold, with reindex caveat for richer metadata.
- Truncation and intent classifier paths are sound in the reviewed source/test surface.

Sources reviewed:

- Parent packet plus children 001-018 sampled selectively.
- Four cycle-key docs: `HANDOVER-deferred.md`, `context-index.md`, `feature-catalog-impact-audit.md`, and `testing-playbook-impact-audit.md`.
- v1.0.2 `findings.md`.
- Post-stress research synthesis.
- cli-codex/cli-copilot dispatch path and `executor-config.ts`.
- Review state files: `deep-review-state.jsonl`, `deep-review-config.json`, `deep-review-findings-registry.json`, and iteration markdown 001-004.

Cross-reference appendix:

- Core protocols: `spec_code` pass, `checklist_evidence` pass.
- Overlay protocols: `feature_catalog_code` partial, `playbook_capability` partial, `skill_agent` notApplicable, `agent_cross_runtime` notApplicable.
