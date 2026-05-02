---
title: "Deep Review Report: 020 Pre-Release Remediation"
description: "Canonical 60-iteration release review for 020-post-release-fixes, written to review/ and treating the top-level review-report.md as historical input only."
---

# Deep Review Report: 020 Pre-Release Remediation

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | FAIL |
| **hasAdvisories** | true |
| **P0 (Blockers)** | 0 |
| **P1 (Required)** | 14 |
| **P2 (Advisories)** | 16 |
| **Iterations** | 60 |
| **Stop Reason** | segment_extension_budget_reached |
| **Review Scope** | 012 packet, parent epic, root 022 packet, public README/install surfaces, runtime hotspots, and the full live feature catalog plus backing code |
| **Fresh Baselines (2026-03-27)** | `012` local validate = FAIL, `022 --recursive` = PASS WITH WARNINGS, `mcp_server npm test` = PASS |
| **Segment-2 Delta** | `7` new runtime `P1`, `10` new runtime `P2` |
| **Segment-3 Delta** | `1` new tooling `P1`, `3` new feature-catalog `P2` |
| **Feature-State Summary** | `191 sound_and_supported / 48 sound_but_under-tested / 7 catalog_mismatch / 9 code_unsound` |

Segment 3 did not overturn the earlier runtime story; it made it more concrete. The audit now shows that the release is blocked by three stacked layers: stale packet/public documentation from segment 1, live runtime defects from segment 2, and a newly confirmed tooling contract regression plus a large under-tested feature block from segment 3.

Late wave-1 evidence also sharpened the feature-state ledger without increasing the finding count. The evaluation category carries a duplicate-ordinal traceability defect across its two `15-*` entries, and the discovery slice confirmed that `memory_list` is directionally sound but still not stably verified on its empty-string folder-filter edge case.

The new blocker from segment 3 is not theoretical. A fresh targeted scripts run fails `scripts/tests/memory-learn-command-docs.vitest.ts` because both the feature entry and the regression still depend on `.opencode/command/memory/README.txt`, while the live workspace only has `.opencode/command/memory/README.md`.

This `review/` packet remains the canonical audit surface. The top-level `/020-post-release-fixes/review-report.md` is historical evidence only.

## 2. Planning Trigger

`/spec_kit:plan` is required. The active blockers now span runtime behavior, tooling contract integrity, packet truth-sync, and feature-verification confidence.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 14,
    "P2": 16
  },
  "featureStateSummary": {
    "sound_and_supported": 194,
    "sound_but_under-tested": 47,
    "catalog_mismatch": 5,
    "code_unsound": 9
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Runtime/code integrity",
      "focus": [
        "scope-aware save dedup and PE arbitration",
        "constitutional-cache coherence and custom-path DB integrity",
        "session trust boundaries",
        "bulk-delete outage signaling",
        "tool-cache invalidation and shutdown safety"
      ]
    },
    {
      "id": "WS-2",
      "priority": "P1",
      "title": "Packet/spec docs truth-sync",
      "focus": [
        "012 validator cleanup",
        "012 release-story reconciliation",
        "001 epic child-name alignment",
        "canonical review boundary"
      ]
    },
    {
      "id": "WS-3",
      "priority": "P1",
      "title": "Public docs and wrapper alignment",
      "focus": [
        "README/install counts and versions",
        "broken CocoIndex installer path",
        "006 and 015 denominator refresh",
        "root phase-link and plan-hygiene drift"
      ]
    },
    {
      "id": "WS-4",
      "priority": "P1",
      "title": "Feature verification and tooling contract repair",
      "focus": [
        "/memory:learn docs-alignment regression",
        "seven catalog mismatch entries",
        "forty-eight under-tested feature entries",
        "retirement of stale 007 correctness assumptions"
      ]
    }
  ]
}
```

## 3. Active Finding Registry

### P1 Findings (required)

| ID | Title | Dimension | Evidence |
|----|-------|-----------|----------|
| `HRF-DR-001` | 012 packet is not locally validator-clean | traceability | `012/implementation-summary.md:47,97,109` plus fresh `validate.sh` failure |
| `HRF-DR-002` | 012 packet tells conflicting release-state stories | correctness, traceability | `012/spec.md:28,30,48`; `012/implementation-summary.md:25,35,97`; historical top-level report |
| `HRF-DR-003` | Parent epic still points at the retired 012 child slug | traceability | `001-hybrid-rag-fusion-epic/spec.md:41,104,116` |
| `HRF-DR-004` | Public docs and install surfaces drift from live repo truth | maintainability, traceability | `.opencode/README.md`; `.opencode/install_guides/README.md`; `004-ux-hooks-automation/README.md` |
| `HRF-DR-005` | 006 feature-catalog wrapper publishes stale denominators | traceability | `006-feature-catalog/spec.md:45-56` |
| `HRF-DR-006` | 015 manual-testing wrapper is materially stale and self-contradictory | traceability | `015/spec.md`; `015/checklist.md`; `015/plan.md` |
| `HRF-DR-010` | TM-04 semantic dedup drops scope | correctness, security | `mcp_server/handlers/memory-save.ts:405-421,805-811`; `mcp_server/handlers/save/dedup.ts:79-119,151-192` |
| `HRF-DR-011` | PE arbitration drops scope | correctness, security | `mcp_server/handlers/memory-save.ts:463-466`; `mcp_server/handlers/save/pe-orchestration.ts:27-50` |
| `HRF-DR-013` | Constitutional-cache warmup can return empty results | correctness | `mcp_server/lib/search/vector-index-store.ts:436-452`; `mcp_server/lib/search/vector-index-queries.ts:214-280` |
| `HRF-DR-014` | Custom-path DB initialization bypasses embedding-dimension integrity validation | correctness | `mcp_server/lib/search/vector-index-store.ts:552-616,717-720` |
| `HRF-DR-016` | Caller-controlled session trust boundary hole | correctness, security | `mcp_server/lib/session/session-manager.ts:307-419`; `mcp_server/handlers/memory-context.ts:667-699` |
| `HRF-DR-018` | Bulk-delete DB outage is misreported as a generic search-style failure | correctness | `mcp_server/handlers/memory-bulk-delete.ts:78-80`; `mcp_server/context-server.ts:410`; `mcp_server/lib/errors/core.ts:261` |
| `HRF-DR-024` | Tool-cache stale in-flight reuse crosses invalidation and shutdown boundaries | correctness, security | `mcp_server/lib/cache/tool-cache.ts:237-257,335-351,398-402` |
| `HRF-DR-027` | Constitutional memory manager command docs-alignment contract is broken by a stale `README.txt` dependency | correctness, traceability, maintainability | `feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:37-45`; `scripts/tests/memory-learn-command-docs.vitest.ts:24-38`; `.opencode/command/memory/README.md:1-16` |

### P2 Findings (advisories)

| ID | Title | Dimension | Evidence |
|----|-------|-----------|----------|
| `HRF-DR-007` | Root 019/020 phase-link drift remains open as a warning | traceability, maintainability | `019/spec.md:31`; `020/spec.md:24-29` |
| `HRF-DR-008` | Root 022 plan duplicates the effort-estimation section | maintainability | `022/plan.md:147-169` |
| `HRF-DR-009` | Historical top-level 012 report is easy to confuse with the canonical review surface | maintainability, traceability | historical `012/review-report.md:1`; `012/spec.md:48` |
| `HRF-DR-012` | Scoped save behavior lacks direct regression coverage | maintainability | `mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts`; `handler-memory-save.vitest.ts` |
| `HRF-DR-015` | Folder-scoped constitutional cache invalidation misses suffixed keys | maintainability | `mcp_server/lib/search/vector-index-store.ts:442,503-505` |
| `HRF-DR-017` | Shared-memory admin corroboration is asymmetric | security, maintainability | `mcp_server/handlers/shared-memory.ts:103-128`; `shared-memory-handlers.vitest.ts:270-307` |
| `HRF-DR-019` | Mixed ingest partial acceptance is not surfaced to callers | correctness, maintainability | `mcp_server/handlers/memory-ingest.ts:147-156,235-245` |
| `HRF-DR-020` | Mutation-ledger append failures are swallowed | correctness, maintainability | `mcp_server/handlers/memory-crud-utils.ts:43-68` and call sites |
| `HRF-DR-021` | Tail confidence inflation from synthetic full-margin scoring | correctness | `mcp_server/lib/search/confidence-scoring.ts:177-181,224-254` |
| `HRF-DR-022` | Query-router distinct-channel invariant is not enforced | correctness | `mcp_server/lib/search/query-router.ts:72-101` |
| `HRF-DR-023` | Stage-2b enrichment fail-open contract lacks direct regression coverage | maintainability | `mcp_server/lib/search/pipeline/stage2b-enrichment.ts:25-48` |
| `HRF-DR-025` | Context-server lifecycle failure branches are under-tested | maintainability | `mcp_server/context-server.ts:648-697,794-875`; `context-server.vitest.ts` |
| `HRF-DR-026` | Retry-manager operator logging still exposes raw provider error text | security, maintainability | `mcp_server/lib/providers/retry-manager.ts:267-285,604-675` |
| `HRF-DR-028` | Seven live feature entries weaken deterministic traceability with non-concrete evidence paths or duplicate ordinals | traceability, maintainability | `feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md:46-63`; `16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md:45-59`; `16--tooling-and-scripts/30-template-composition-system.md:47-49`; `21--implement-and-remove-deprecated-features/01-category-stub.md:49-53`; `21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md:44-48`; `09--evaluation-and-measurement/15-evaluation-api-surface.md:1-4`; `09--evaluation-and-measurement/15-memory-roadmap-baseline-snapshot.md:1-4` |
| `HRF-DR-029` | Forty-eight live feature entries remain sound but under-tested | maintainability, traceability | examples: `feature_catalog/03--discovery/01-memory-browser-memorylist.md:16`; `mcp_server/tests/handler-memory-list-edge.vitest.ts:78`; `feature_catalog/09--evaluation-and-measurement/16-int8-quantization-evaluation.md:16-28`; `feature_catalog/01--retrieval/11-session-recovery-memory-continue.md:46`; `01--retrieval/12-search-api-surface.md:24-33`; `02--mutation/11-shared-memory-end-to-end-architecture.md:68-84`; `14--pipeline-architecture/22-mcp-server-public-api-barrel.md:38-62`; `19--feature-flag-reference/09-runtime-config-contract.md:68-78` |
| `HRF-DR-030` | Historical 007 “100% MATCH” posture is not usable as current correctness evidence | traceability, maintainability | `007-code-audit-per-feature-catalog/implementation-summary.md:3,34-44,57-79,87-94,118-120` versus live `255`-entry state |

## 4. Claim-Adjudication JSON For New P1 Findings

```json
[
  {
    "id": "HRF-DR-010",
    "claim": "TM-04 semantic dedup drops scope and can block valid scoped saves",
    "evidenceRefs": ["handlers/memory-save.ts:405-421,805-811", "handlers/save/dedup.ts:79-119,151-192"],
    "counterevidenceSought": "Focused save and pipeline subsets plus scoped-save coverage review",
    "alternativeExplanation": "SpecFolder-only dedup was intentionally sufficient across all scopes",
    "finalSeverity": "P1",
    "confidence": 0.88,
    "downgradeTrigger": "A scoped-save regression proves dedup cannot compare across tenant/shared/governed boundaries"
  },
  {
    "id": "HRF-DR-011",
    "claim": "PE arbitration omits scope and can cross boundaries",
    "evidenceRefs": ["handlers/memory-save.ts:463-466", "handlers/save/pe-orchestration.ts:27-50", "handlers/pe-gating.ts:64-89"],
    "counterevidenceSought": "Focused save replay and cross-file call-chain review",
    "alternativeExplanation": "Downstream helpers infer scope safely from other state",
    "finalSeverity": "P1",
    "confidence": 0.87,
    "downgradeTrigger": "A call-chain audit or executable test proves arbitration always receives an equivalent scope constraint"
  },
  {
    "id": "HRF-DR-013",
    "claim": "Constitutional-cache warmup can transiently return empty results",
    "evidenceRefs": ["lib/search/vector-index-store.ts:436-452", "lib/search/vector-index-queries.ts:214-280"],
    "counterevidenceSought": "Vector-store replay and stale-index adversarial checks",
    "alternativeExplanation": "Concurrent callers always await a populated promise before reading the cache",
    "finalSeverity": "P1",
    "confidence": 0.85,
    "downgradeTrigger": "A concurrency-safe warmup contract or test proves empty reads cannot escape while warmup is in flight"
  },
  {
    "id": "HRF-DR-014",
    "claim": "Custom-path DB initialization bypasses embedding-dimension integrity validation",
    "evidenceRefs": ["lib/search/vector-index-store.ts:552-616,717-720"],
    "counterevidenceSought": "Custom-path initialization replay and schema-compatibility review",
    "alternativeExplanation": "Dimension validation is performed elsewhere before any custom-path DB is used",
    "finalSeverity": "P1",
    "confidence": 0.86,
    "downgradeTrigger": "A guaranteed higher-level integrity gate or direct test closes the bypass for all custom-path callers"
  },
  {
    "id": "HRF-DR-016",
    "claim": "Caller-controlled session IDs can be trusted without actor corroboration",
    "evidenceRefs": ["lib/session/session-manager.ts:307-419", "lib/cognitive/working-memory.ts:314-316", "handlers/memory-context.ts:667-699"],
    "counterevidenceSought": "Negative-case session/shared replays and adversarial tenant/session checks",
    "alternativeExplanation": "All reachable callers already guarantee actor-bound session ownership",
    "finalSeverity": "P1",
    "confidence": 0.89,
    "downgradeTrigger": "A proven upstream ownership guarantee or direct test closes the trust hole for all caller-controlled session IDs"
  },
  {
    "id": "HRF-DR-018",
    "claim": "Bulk-delete DB outages are surfaced with the wrong contract",
    "evidenceRefs": ["handlers/memory-bulk-delete.ts:78-80", "context-server.ts:410", "lib/errors/core.ts:261"],
    "counterevidenceSought": "Mutation-path replays and sibling delete handler comparison",
    "alternativeExplanation": "All destructive mutation outages are intentionally normalized to the generic fallback contract",
    "finalSeverity": "P1",
    "confidence": 0.84,
    "downgradeTrigger": "A documented contract or executable test shows bulk-delete should intentionally reuse the generic search-style error family"
  },
  {
    "id": "HRF-DR-024",
    "claim": "Tool-cache leaves stale in-flight reads alive across invalidation and shutdown",
    "evidenceRefs": ["lib/cache/tool-cache.ts:237-257,335-351,398-402"],
    "counterevidenceSought": "Focused tool-cache and lifecycle replays plus direct reasoning about inFlight cleanup",
    "alternativeExplanation": "In-flight reuse after invalidation or shutdown is unreachable in practice",
    "finalSeverity": "P1",
    "confidence": 0.90,
    "downgradeTrigger": "An executable invalidation or shutdown regression proves inFlight promises are cleared or isolated before later callers can attach"
  },
  {
    "id": "HRF-DR-027",
    "claim": "The constitutional-memory-manager command contract is broken because the live workspace no longer provides the README.txt surface the feature and regression still require",
    "evidenceRefs": ["feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:37-45", "scripts/tests/memory-learn-command-docs.vitest.ts:24-38", ".opencode/command/memory/README.md:1-16"],
    "counterevidenceSought": "Direct rerun of the docs-alignment regression plus a filesystem check for the expected command-group surface",
    "alternativeExplanation": "README.txt still exists or the regression is intentionally stale and not part of the live contract",
    "finalSeverity": "P1",
    "confidence": 0.93,
    "downgradeTrigger": "The test is updated to the live README.md contract or README.txt is restored and the regression passes"
  }
]
```

## 5. Remediation Workstreams

### WS-1 [P1] Runtime/code integrity
- **Findings:** `HRF-DR-010`, `011`, `013`, `014`, `016`, `018`, `024`
- **Actions:** make save dedup and PE arbitration scope-aware, close constitutional-cache and custom-path integrity holes, bind session trust to corroborated ownership, fix bulk-delete outage signaling, and clear in-flight cache state on invalidation and shutdown
- **Exit condition:** the runtime/code P1 registry drops to zero and the affected feature entries leave the `code_unsound` bucket

### WS-2 [P1] Packet/spec docs truth-sync
- **Findings:** `HRF-DR-001`, `002`, `003`, `009`
- **Actions:** make `review/` canonical inside the 012 packet, fix packet-local validator failures, reconcile FAIL-vs-PASS prose, and update the parent epic to the live 012 child slug
- **Exit condition:** `012` local validation matches its own prose and the parent epic names the live child folder everywhere

### WS-3 [P1] Public docs and wrapper alignment
- **Findings:** `HRF-DR-004`, `005`, `006`, `007`, `008`
- **Actions:** refresh README/install counts and versions, repair the broken CocoIndex installer target, correct wrapper denominators, and clear the warning-level root hygiene drift
- **Exit condition:** public and wrapper docs match the live filesystem they summarize

### WS-4 [P1] Feature verification and tooling contract repair
- **Findings:** `HRF-DR-027`, `028`, `029`, `030`
- **Actions:** repair `/memory:learn` docs alignment, replace non-concrete feature evidence tables with reproducible references, fix duplicate ordinals, add or explicitly defer direct verification for the under-tested block, and retire 007 as a live correctness proxy
- **Exit condition:** the tooling regression passes, the mismatch block drops to zero, and the under-tested block is materially reduced or explicitly accepted with rationale

## 6. Verification Snapshot

- Fresh commands executed on 2026-03-27:
  - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <012 packet>` -> `FAIL`
  - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <022 root> --recursive` -> `PASSED WITH WARNINGS`
  - `cd .opencode/skill/system-spec-kit/mcp_server && npm test` -> `PASS`
- Targeted segment-3 subsets:
  - Retrieval/mutation/lifecycle subset -> `8` files, `256` passed
  - Search/pipeline/indexing/scoring subset -> `11` files, `397` passed, `10` skipped
  - Discovery subset -> `1` failed, `32` passed; the lone failure stayed classified as verification interference rather than a confirmed product bug
  - Maintenance subset -> `7` files, `271` passed, `54` skipped
  - Analysis subset -> `7` files, `245` passed
  - Evaluation subset -> `13` files, `457` passed
  - Scripts/tooling subset:
    - `memory-learn-command-docs.vitest.ts` -> `1 failed`, `1 passed`
    - `session-enrichment.vitest.ts` -> `16 passed`
    - `task-enrichment.vitest.ts` -> `53 passed`
- Live feature denominator re-verified:
  - Feature catalog: `255` files across `21` categories
  - Feature states: `191 supported / 48 under-tested / 7 mismatched / 9 unsound`

## 7. Protocol Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved Drift |
|----------|--------|----------|-----------------|
| `spec_code` | FAIL | Runtime defects plus a new tooling contract regression remain active. | `HRF-DR-010`, `011`, `013`, `014`, `016`, `018`, `024`, `027` |
| `checklist_evidence` | FAIL | Fresh local validation still fails the 012 packet while its prose understates that failure. | `HRF-DR-001` |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved Drift |
|----------|--------|----------|-----------------|
| `skill_agent` | NOT APPLICABLE | Review target is a spec folder, not a skill contract review. | None |
| `agent_cross_runtime` | NOT APPLICABLE | No agent-family parity change was in scope for this audit. | None |
| `feature_catalog_code` | FAIL | Segment 3 confirmed live mismatches, a large under-tested block, and a stale historical confidence proxy. | `HRF-DR-028`, `029`, `030` |
| `playbook_capability` | PARTIAL | Segment 3 stayed strict to feature catalog and backing code; playbook drift remains a segment-1 artifact. | `HRF-DR-006` |

## 8. Deferred And Ruled-Out Items

| Item | Outcome | Reason |
|------|---------|--------|
| Fresh segment-3 `P0` exploit or critical data-loss bug | RULED OUT | The new tooling regression is serious but did not escalate to critical severity |
| Broad contradiction across discovery, maintenance, analysis, or evaluation categories | RULED OUT | Those categories stayed aligned or merely under-tested |
| Need for a second non-canonical feature-catalog audit packet | RULED OUT | The canonical `012/review/` packet remains the right home |
| Whole-catalog re-sweep without executable follow-up | DEFERRED | Diminishing returns after explicit feature-state closure |

## 9. Audit Appendix

### Convergence Summary

| Wave | Result |
|------|--------|
| Segment 1 (`001-020`) | Established six `P1` doc/lineage blockers and three `P2` advisories |
| Segment 2 (`021-040`) | Added seven runtime `P1` findings and ten runtime `P2` findings |
| Segment 3 wave 1 (`041-044`) | Retrieval, mutation, lifecycle, and evaluation breadth mostly stayed aligned; late normalization folded duplicate evaluation ordinals into `HRF-DR-028` and discovery-edge instability into `HRF-DR-029` without increasing the finding count |
| Segment 3 wave 2 (`045-048`) | Tooling/deprecated-feature breadth added `HRF-DR-028` |
| Segment 3 wave 3 (`049-052`) | Feature-state confidence sweep added `HRF-DR-029` and `HRF-DR-030` |
| Segment 3 wave 4 (`053-056`) | Targeted tests confirmed the new tooling blocker `HRF-DR-027` and closed the feature-state model |
| Segment 3 wave 5 (`057-060`) | New tooling `P1` survived adjudication; final verdict remained `FAIL` |

### Sources Reviewed

- `020-post-release-fixes/spec.md`
- `020-post-release-fixes/implementation-summary.md`
- `001-hybrid-rag-fusion-epic/spec.md`
- `.opencode/README.md`
- `.opencode/install_guides/README.md`
- `006-feature-catalog/spec.md`
- `015-manual-testing-per-playbook/spec.md`
- `007-code-audit-per-feature-catalog/implementation-summary.md`
- `.opencode/skill/system-spec-kit/feature_catalog/**/*.md`
- `.opencode/skill/system-spec-kit/mcp_server/**/*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/**/*.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/**/*.vitest.ts`
