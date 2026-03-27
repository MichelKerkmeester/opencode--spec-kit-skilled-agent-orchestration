---
title: "Deep Review Report: 012 Pre-Release Remediation"
description: "Canonical 20-iteration release review for 012-pre-release-remediation, written to review/ and treating the top-level review-report.md as historical input only."
---

# Deep Review Report: 012 Pre-Release Remediation

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | FAIL |
| **hasAdvisories** | true |
| **P0 (Blockers)** | 0 |
| **P1 (Required)** | 6 |
| **P2 (Advisories)** | 3 |
| **Iterations** | 20 |
| **Stop Reason** | max_iterations_reached |
| **Review Scope** | 012 packet, parent epic, root 022 packet, public README/install surfaces, 006 and 015 wrappers, and targeted memory/retrieval runtime hotspots |
| **Runtime Hotspot Audit** | No fresh P0/P1 code blocker confirmed in the sampled `memory-context`, `memory-save`, `memory-search`, `hybrid-search`, and `pipeline/orchestrator` surfaces |
| **Fresh Baselines (2026-03-27)** | `012` local validate = FAIL, `022 --recursive` = PASS WITH WARNINGS, `npm test` = PASS |

This review found that the remaining release blockers are documentation, lineage, and traceability drift, not a newly discovered runtime regression. The memory/retrieval runtime hotspots stayed green in the targeted recheck, and the full `npm test` baseline is still passing, but the live `012` release-control packet is not yet authoritative because it is not locally validator-clean and it tells conflicting release-state stories.

This `review/` packet is the canonical output of the audit. The top-level `/012-pre-release-remediation/review-report.md` remains historical release-control evidence and should not be treated as the current review surface.

## 2. Planning Trigger

`/spec_kit:plan` is required. Six active P1 findings span the live 012 packet, the parent epic, public docs/install surfaces, and the feature-catalog/manual-testing wrappers, so remediation needs a new coordinated planning pass rather than an ad hoc edit sweep.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 6,
    "P2": 3
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Packet/spec docs truth-sync",
      "focus": [
        "012 validator clean-up",
        "012 release-story reconciliation",
        "001 epic child-name alignment",
        "canonical review/ boundary"
      ]
    },
    {
      "id": "WS-2",
      "priority": "P1",
      "title": "Public docs, feature catalog, and playbook alignment",
      "focus": [
        "README/install counts and versions",
        "broken CocoIndex installer path",
        "004 README packet/tool drift",
        "006 and 015 denominator refresh"
      ]
    },
    {
      "id": "WS-3",
      "priority": "P2",
      "title": "Runtime hold-line and advisory cleanup",
      "focus": [
        "preserve green npm test baseline",
        "clear 019/020 phase-link warning",
        "dedupe root plan effort section"
      ]
    }
  ],
  "specSeed": [
    "Point 012 Source Review at review/review-report.md and frame the top-level review-report.md as historical input",
    "Reconcile 012 implementation-summary claims with current validator output",
    "Update the 001 epic child map from 012-pre-release-fixes-alignment-preparation to 012-pre-release-remediation",
    "Refresh 006 and 015 wrappers against live 255/290/21 denominators"
  ],
  "planSeed": [
    "T-001 Fix 012 packet-local validator failures and AI protocol/template drift",
    "T-002 Rewrite 012 release-state truth so historical FAIL and current baselines are clearly separated",
    "T-003 Patch parent epic and public docs/install surfaces to live names, counts, versions, and installer targets",
    "T-004 Refresh 006 and 015 wrappers from live feature catalog and playbook indexes",
    "T-005 Re-run validate.sh locally on 012 and recursively on 022 after documentation fixes",
    "T-006 Reconfirm npm test and targeted retrieval/session hotspots remain green after the doc cleanup"
  ]
}
```

## 3. Active Finding Registry

### P1 Findings (required)

#### HRF-DR-001 [P1] 012 packet is not locally validator-clean
- **Dimension:** traceability
- **File:line:** `012-pre-release-remediation/implementation-summary.md:47,97,109`
- **Evidence:** The implementation summary says epic `research.md` was restored and that `012-pre-release-remediation --strict` has only one intentional error. A fresh `validate.sh` run on 2026-03-27 still fails on incomplete AI protocol state, a missing `research.md` reference, and template-header drift.
- **Impact:** The live release-control packet cannot yet serve as authoritative pre-release truth because its own validation narrative is false.
- **Fix recommendation:** Repair the packet-local validation failures or restate the implementation summary so it matches the current validator result exactly.
- **Disposition:** OPEN

#### HRF-DR-002 [P1] 012 packet tells conflicting release-state stories
- **Dimension:** correctness, traceability
- **File:line:** `012-pre-release-remediation/spec.md:28,30,48`; `012-pre-release-remediation/implementation-summary.md:25,35,97`; `012-pre-release-remediation/review-report.md:14,114`
- **Evidence:** The spec and historical top-level report preserve a March 26 FAIL-oriented narrative, while the implementation summary claims recursive PASS, and the spec still points `Source Review` at the historical top-level report instead of the canonical `review/` output.
- **Impact:** Reviewers cannot tell whether the live packet is asserting FAIL, PASS, or a historical merge-only posture.
- **Fix recommendation:** Split historical evidence from current-state evidence explicitly and repoint the active packet at `review/review-report.md`.
- **Disposition:** OPEN

#### HRF-DR-003 [P1] Parent epic still points at the retired 012 child slug
- **Dimension:** traceability
- **File:line:** `001-hybrid-rag-fusion-epic/spec.md:41,104,116`
- **Evidence:** The parent epic still names `012-pre-release-fixes-alignment-preparation` as the live child in metadata, the phase map, and REQ-002.
- **Impact:** Parent-to-child navigation and phase truth are stale at the coordination layer above the review target.
- **Fix recommendation:** Replace the retired child slug with `012-pre-release-remediation` across the parent epic's authoritative references.
- **Disposition:** OPEN

#### HRF-DR-004 [P1] Public docs/install surfaces drift from live repo truth
- **Dimension:** maintainability, traceability
- **File:line:** `.opencode/README.md:52-58`; `.opencode/install_guides/README.md:17,820,1179,1236,1433`; `.opencode/skill/system-spec-kit/SKILL.md:5`; `004-ux-hooks-automation/README.md:2,14`
- **Evidence:** Public docs still publish stale counts (`9 agents`, `22 commands`) and `system-spec-kit v2.2.26.0` while the live skill is `v2.2.27.0`, the base agent directory contains 10 files, the CocoIndex installer symlink points at a missing target, and the `004` packet-local README still labels itself `007` and says `28 tools`.
- **Impact:** Operator-facing setup, package inventory, and packet-local guidance are no longer trustworthy.
- **Fix recommendation:** Refresh counts/versions from the live filesystem, repair the CocoIndex installer target, and correct the `004` README identity/tool-count drift.
- **Disposition:** OPEN

#### HRF-DR-005 [P1] 006 feature-catalog wrapper publishes stale denominators
- **Dimension:** traceability
- **File:line:** `006-feature-catalog/spec.md:45-56`
- **Evidence:** The wrapper first calls the live tree `224 / 275`, then later `255 / 275`, but the fresh filesystem truth is `255` feature files and `290` playbook scenario files across `21` numbered categories.
- **Impact:** Any release or coverage reasoning derived from the wrapper is using the wrong denominators.
- **Fix recommendation:** Rewrite the current-state note and deep-research addendum so historical milestones remain historical and live denominators match current repo truth.
- **Disposition:** OPEN

#### HRF-DR-006 [P1] 015 manual-testing wrapper is materially stale and self-contradictory
- **Dimension:** traceability
- **File:line:** `015-manual-testing-per-playbook/spec.md:3,40,79-100,170-171`; `015-manual-testing-per-playbook/checklist.md:47,132`; `015-manual-testing-per-playbook/plan.md:162`; `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:151,179`
- **Evidence:** The wrapper still advertises `231` scenario files, `272` IDs, `19` categories, and `222` features while the root playbook now states `290` scenarios, `255` features, and zero orphan scenario files. The wrapper also claims zero orphans while still tracking orphan-remediation workstreams.
- **Impact:** The umbrella manual-testing packet no longer reflects the live playbook it claims to summarize.
- **Fix recommendation:** Rebuild the wrapper's denominators, orphan status, and workstream claims from the current root playbook and filesystem.
- **Disposition:** OPEN

### P2 Findings (advisories)

#### HRF-DR-007 [P2] Root 019/020 phase-link drift remains open as a warning
- **Dimension:** traceability, maintainability
- **File:line:** `019-rewrite-repo-readme/spec.md:31`; `020-hybrid-raf-fusion-related-changelogs/spec.md:24-29`
- **Evidence:** Fresh recursive validation of root `022` passes with one warning because `019` lacks the successor reference and `020` lacks expected parent/predecessor metadata.
- **Impact:** Navigation metadata is still imperfect, but this does not currently fail recursive validation.
- **Fix recommendation:** Patch the root phase metadata in the next documentation cleanup wave.
- **Disposition:** OPEN

#### HRF-DR-008 [P2] Root 022 plan duplicates the effort-estimation section
- **Dimension:** maintainability
- **File:line:** `022-hybrid-rag-fusion/plan.md:147-169`
- **Evidence:** The root plan carries two `L2: EFFORT ESTIMATION` blocks with the same anchor.
- **Impact:** The plan remains readable, but the authoritative planning surface is weaker than it should be.
- **Fix recommendation:** Collapse the duplicate effort section into one canonical block.
- **Disposition:** OPEN

#### HRF-DR-009 [P2] Historical top-level 012 report is easy to confuse with the canonical review surface
- **Dimension:** maintainability, traceability
- **File:line:** `012-pre-release-remediation/review-report.md:1`; `012-pre-release-remediation/spec.md:48`
- **Evidence:** The historical top-level report still sits beside active packet docs while `spec.md` still points the packet to that file instead of `review/review-report.md`.
- **Impact:** Review consumers can follow the wrong artifact even after this canonical `review/` packet exists.
- **Fix recommendation:** Keep the top-level report for provenance, but explicitly mark it historical and redirect readers to the canonical `review/` packet.
- **Disposition:** OPEN

## 4. Remediation Workstreams

### WS-1 [P1] Packet/spec docs truth-sync
- **Findings:** `HRF-DR-001`, `HRF-DR-002`, `HRF-DR-003`
- **Actions:** make `review/` canonical inside the 012 packet, fix the packet-local validator failures, reconcile the FAIL-vs-PASS story, and update the parent epic to the live 012 child slug
- **Exit condition:** `012` local validation matches its own prose and the parent epic names the live child folder everywhere

### WS-2 [P1] Public docs, feature catalog, and playbook alignment
- **Findings:** `HRF-DR-004`, `HRF-DR-005`, `HRF-DR-006`
- **Actions:** refresh README/install counts and versions, repair the broken CocoIndex installer target, correct the `004` README identity/tool count, and rewrite the `006` and `015` wrappers to live `255 / 290 / 21` denominators and zero-orphan root truth
- **Exit condition:** public and wrapper docs match the live filesystem and the root playbook/indexes they summarize

### WS-3 [P2] Runtime hold-line and advisory cleanup
- **Findings:** `HRF-DR-007`, `HRF-DR-008`, `HRF-DR-009`
- **Actions:** preserve the green runtime baseline while clearing warning-level root phase-link drift, deduping the root plan, and making the historical top-level 012 report explicitly non-canonical
- **Exit condition:** no warning-level root hygiene drift remains, and operators are routed to the canonical `review/` packet by default

## 5. Spec Seed

- Update the 012 packet contract so `Source Review` points to `review/review-report.md` and the top-level `review-report.md` is framed as historical evidence only.
- Rewrite the 012 implementation summary and any packet-local validation claims to match the fresh 2026-03-27 validator output.
- Replace the retired child slug in the 001 parent epic with `012-pre-release-remediation`.
- Refresh the `006` and `015` wrappers from live `255` feature files, `290` playbook scenarios, and `21` numbered categories.
- Repair public install/docs drift: base agent counts, command counts, `system-spec-kit` version, the broken CocoIndex installer path, and the `004` packet-local README label/tool count.

## 6. Plan Seed

- T-001 Run a packet-truth pass over `012/spec.md`, `012/implementation-summary.md`, and `012/review-report.md` so historical FAIL evidence and fresh local validation are separated cleanly.
- T-002 Fix the packet-local validator blockers in `012` and rerun `validate.sh` on the packet.
- T-003 Patch `001-hybrid-rag-fusion-epic/spec.md` to the live 012 child slug.
- T-004 Repair `.opencode/README.md`, `.opencode/install_guides/README.md`, and the CocoIndex installer symlink/README surfaces against live filesystem truth.
- T-005 Rebuild `006-feature-catalog/spec.md` and `015-manual-testing-per-playbook/spec.md` from the current root feature-catalog/playbook denominators and orphan state.
- T-006 Re-run `022 --recursive` and `npm test` after the documentation sweep to prove the green runtime baseline and root recursive pass still hold.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved Drift |
|----------|--------|----------|-----------------|
| `spec_code` | PARTIAL | Targeted runtime hotspot review and fresh `npm test` baseline found no new P1 code blocker, but packet-local release truth is split between FAIL-oriented spec/history and PASS-oriented implementation prose. | `HRF-DR-002` |
| `checklist_evidence` | FAIL | Fresh local validation still fails the 012 packet while its implementation summary understates that failure. | `HRF-DR-001` |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved Drift |
|----------|--------|----------|-----------------|
| `skill_agent` | NOT APPLICABLE | Review target is a spec folder, not a skill contract review. | None |
| `agent_cross_runtime` | NOT APPLICABLE | No agent-family parity change was in scope for this audit. | None |
| `feature_catalog_code` | FAIL | `006-feature-catalog/spec.md` still carries stale live denominators against the current feature/playbook tree. | `HRF-DR-005` |
| `playbook_capability` | FAIL | `015-manual-testing-per-playbook` still contradicts the root playbook's live denominator and orphan state. | `HRF-DR-006` |

## 8. Deferred Items

| Item | Source | Reason for Deferral |
|------|--------|-------------------|
| Root 019/020 phase-link warning cleanup | `HRF-DR-007` | Warning-level drift; does not currently fail recursive validation |
| Root 022 plan duplicate effort block cleanup | `HRF-DR-008` | Planning-surface hygiene only |
| Historical top-level 012 report archival framing | `HRF-DR-009` | Important for operator clarity, but does not create the FAIL verdict by itself |
| Exhaustive whole-codebase runtime audit beyond hotspots | Runtime sidecar note | No failing runtime signal justified a broader audit during this review |

## 9. Audit Appendix

### Convergence Summary

| Iteration | Focus | New Ratio | New P0/P1/P2 | Result |
|-----------|-------|-----------|---------------|--------|
| 1 | Inventory + baseline | 1.00 | 0/2/0 | seeded active blockers |
| 2 | memory-search + pipeline | 0.00 | 0/0/0 | no runtime correctness blocker |
| 3 | context/save/hybrid | 0.00 | 0/0/0 | no quick-path or governed-save blocker |
| 4 | fallback + tests | 0.00 | 0/0/0 | runtime baseline held |
| 5 | session/shared-memory | 0.00 | 0/0/0 | no fresh security blocker |
| 6 | path/retry/cleanup | 0.00 | 0/0/0 | no fresh security blocker |
| 7 | validator drift detail | 0.00 | 0/0/0 | strengthened HRF-DR-001 |
| 8 | release-story conflict | 0.00 | 0/0/0 | strengthened HRF-DR-002 |
| 9 | parent epic child slug | 0.24 | 0/1/0 | new P1 |
| 10 | root 019/020 warning | 0.12 | 0/0/1 | new P2 |
| 11 | 006 denominators | 0.17 | 0/1/0 | new P1 |
| 12 | 015 denominators/orphans | 0.16 | 0/1/0 | new P1 |
| 13 | root docs/install counts | 0.21 | 0/1/0 | new P1 |
| 14 | symlink + 004 README | 0.00 | 0/0/0 | strengthened HRF-DR-004 |
| 15 | root plan hygiene | 0.07 | 0/0/1 | new P2 |
| 16 | canonical review boundary | 0.05 | 0/0/1 | new P2 |
| 17 | protocol matrix | 0.00 | 0/0/0 | protocol statuses closed |
| 18 | adversarial self-check | 0.00 | 0/0/0 | severities confirmed |
| 19 | workstream triage | 0.00 | 0/0/0 | workstreams grouped |
| 20 | synthesis closure | 0.00 | 0/0/0 | final verdict locked |

### Coverage Summary

- Fresh commands executed on 2026-03-27:
  - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <012 packet>` -> FAIL
  - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <022 root> --recursive` -> PASS WITH WARNINGS
  - `cd .opencode/skill/system-spec-kit/mcp_server && npm test` -> PASS
- Live denominators re-verified:
  - Feature catalog: `255` files across `21` categories
  - Manual testing playbook: `290` scenario files across `21` categories
- Runtime hotspot scope sampled:
  - `handlers/memory-search.ts`
  - `handlers/memory-context.ts`
  - `handlers/memory-save.ts`
  - `lib/search/hybrid-search.ts`
  - `lib/search/pipeline/orchestrator.ts`

### Ruled-Out Claims

| Claim | Outcome | Reason |
|------|---------|--------|
| A fresh runtime hotspot P1 regression is blocking release | RULED OUT | Targeted hotspot review plus green `npm test` baseline did not support a new code blocker |
| Root `022 --recursive` is still failing | RULED OUT | Fresh recursive validation passed with one warning |
| Agent parity/runtime-family drift is a live blocker for this review target | RULED OUT | Outside the active review scope and unsupported by the sampled evidence |

### Sources Reviewed

- `012-pre-release-remediation/spec.md`
- `012-pre-release-remediation/plan.md`
- `012-pre-release-remediation/tasks.md`
- `012-pre-release-remediation/checklist.md`
- `012-pre-release-remediation/implementation-summary.md`
- `012-pre-release-remediation/review-report.md`
- `001-hybrid-rag-fusion-epic/spec.md`
- `022-hybrid-rag-fusion/plan.md`
- `019-rewrite-repo-readme/spec.md`
- `020-hybrid-raf-fusion-related-changelogs/spec.md`
- `.opencode/README.md`
- `.opencode/install_guides/README.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `004-ux-hooks-automation/README.md`
- `006-feature-catalog/spec.md`
- `015-manual-testing-per-playbook/spec.md`
- `015-manual-testing-per-playbook/checklist.md`
- `015-manual-testing-per-playbook/plan.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts`

### Claim Adjudications (P1)

```json
[
  {
    "id": "HRF-DR-001",
    "claim": "The live 012 packet is validator-clean after remediation.",
    "decision": "rejected",
    "finalSeverity": "P1",
    "confidence": 0.99,
    "evidenceRefs": [
      "012-pre-release-remediation/implementation-summary.md:47",
      "012-pre-release-remediation/implementation-summary.md:97",
      "012-pre-release-remediation/implementation-summary.md:109"
    ]
  },
  {
    "id": "HRF-DR-002",
    "claim": "The 012 packet expresses one consistent release-state story.",
    "decision": "rejected",
    "finalSeverity": "P1",
    "confidence": 0.98,
    "evidenceRefs": [
      "012-pre-release-remediation/spec.md:28",
      "012-pre-release-remediation/spec.md:48",
      "012-pre-release-remediation/implementation-summary.md:25",
      "012-pre-release-remediation/review-report.md:114"
    ]
  },
  {
    "id": "HRF-DR-003",
    "claim": "The parent epic already points at the live 012 child folder.",
    "decision": "rejected",
    "finalSeverity": "P1",
    "confidence": 0.97,
    "evidenceRefs": [
      "001-hybrid-rag-fusion-epic/spec.md:41",
      "001-hybrid-rag-fusion-epic/spec.md:104",
      "001-hybrid-rag-fusion-epic/spec.md:116"
    ]
  },
  {
    "id": "HRF-DR-004",
    "claim": "Public README/install surfaces still match live repo truth.",
    "decision": "rejected",
    "finalSeverity": "P1",
    "confidence": 0.96,
    "evidenceRefs": [
      ".opencode/README.md:52",
      ".opencode/install_guides/README.md:17",
      ".opencode/install_guides/README.md:820",
      ".opencode/skill/system-spec-kit/SKILL.md:5",
      "004-ux-hooks-automation/README.md:2"
    ]
  },
  {
    "id": "HRF-DR-005",
    "claim": "The 006 wrapper's current-state denominators are up to date.",
    "decision": "rejected",
    "finalSeverity": "P1",
    "confidence": 0.98,
    "evidenceRefs": [
      "006-feature-catalog/spec.md:47",
      "006-feature-catalog/spec.md:55"
    ]
  },
  {
    "id": "HRF-DR-006",
    "claim": "The 015 wrapper still reflects the live playbook denominator and orphan state.",
    "decision": "rejected",
    "finalSeverity": "P1",
    "confidence": 0.98,
    "evidenceRefs": [
      "015-manual-testing-per-playbook/spec.md:3",
      "015-manual-testing-per-playbook/spec.md:100",
      "015-manual-testing-per-playbook/checklist.md:47",
      "015-manual-testing-per-playbook/plan.md:162",
      ".opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:151",
      ".opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:179"
    ]
  }
]
```

### Cross-Reference Appendix

#### Core Protocols
- `spec_code`: partial because hotspot runtime/code surfaces look stable, but the active 012 packet still conflicts with itself.
- `checklist_evidence`: fail because the packet-local validator failure remains active and the implementation summary understates it.

#### Overlay Protocols
- `skill_agent`: not applicable in this review scope.
- `agent_cross_runtime`: not applicable in this review scope.
- `feature_catalog_code`: fail because `006` still uses stale current-state denominators.
- `playbook_capability`: fail because `015` still contradicts the root playbook's live coverage and orphan truth.
