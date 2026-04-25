---
title: "Decision Record: Code-Graph Resilience Thresholds and Asset Set [system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/decision-record]"
description: "Decisions from final synthesis of the code-graph resilience deep-research loop."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
trigger_phrases:
  - "code graph resilience decision record"
  - "code graph staleness thresholds"
  - "exclude rule confidence tiers"
  - "007-code-graph-resilience-research decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research"
    last_updated_at: "2026-04-25T21:08:09+02:00"
    last_updated_by: "copilot-gpt-5.5"
    recent_action: "Created final synthesis decision record for code-graph resilience thresholds and tiers"
    next_safe_action: "Use the materialized assets to unblock sibling 006 doctor Phase B"
    blockers: []
    key_files:
      - "assets/code-graph-gold-queries.json"
      - "assets/staleness-model.md"
      - "assets/recovery-playbook.md"
      - "assets/exclude-rule-confidence.json"
      - "research/research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0260000000007007000000000000000000000000000000000000000000000007"
      session_id: "007-code-graph-resilience-research"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q9"
      - "Q10"
---

# Decision Record: Code-Graph Resilience Thresholds and Asset Set

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:status -->
## Status

Accepted for the 007 code-graph resilience research packet.
<!-- /ANCHOR:status -->

---

<!-- ANCHOR:context -->
## Context

The research loop investigated code-graph staleness, scan failure recovery, verification canaries, exclude confidence, drift detection, resolver limitations, confidence-floor signaling, and partial self-healing. Iteration 7 synthesized the four asset deliverables required by the packet strategy.
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:decisions -->
## Decisions

### D1: Use a three-state staleness model

Adopt `fresh`, `soft-stale`, and `hard-stale`.

- `fresh`: readiness `fresh`, canonical readiness `ready`, trust state `live`, non-empty graph, no stale/deleted tracked files, current Git HEAD, and passing gold verification.
- `soft-stale`: 1-50 stale files, bounded deleted-file cleanup, or scan age >8 hours with no hard signal.
- `hard-stale`: `empty`/`error`, trust state `absent`/`unavailable`, Git HEAD drift, >50 stale files, stale ratio >3-5%, scan age >24 hours, schema mismatch, missing persisted scan, or failed gold verification.

Rationale: the 50-file threshold and Git HEAD full-reindex behavior already exist; readiness maps fresh/stale/empty/error to canonical readiness/trust state; external timing anchors support 8-hour soft warning and 24-hour hard stale. [SOURCE: `research/iterations/iteration-002.md:27-40`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/readiness-contract.ts:73-124`]

Asset: `assets/staleness-model.md`

### D2: Full-rescan warning is a confidence-floor failure, not just a freshness label

The doctor command should tell users the graph is unreliable when readiness is missing/unavailable, action requires full scan, persisted scan evidence is missing, scan errors repeat, gold-query floors fail, or edge drift crosses thresholds.

Rationale: `detect_changes` already refuses non-fresh graphs to avoid false-safe empty results, and iteration 6 shows edge/resolver drift can make a graph semantically unreliable even after rows exist. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`; `research/iterations/iteration-006.md:29-73`]

Assets: `assets/staleness-model.md`, `assets/code-graph-gold-queries.json`

### D3: Permit partial self-healing only for bounded soft-stale states

Auto-trigger selective re-scan only when stale existing tracked files are <= 50, paths are workspace-contained, Git HEAD is unchanged, schema/DB status is healthy, and the caller explicitly allows inline indexing. Do not silently self-heal on read-only impact tools.

Rationale: `ensureCodeGraphReady` already implements selective reindex with caller-controlled `allowInlineIndex` and `allowInlineFullScan`; `detect_changes` deliberately disables both for safety. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:290-367`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264`]

Asset: `assets/staleness-model.md`

### D4: Treat SQLite recovery as quarantine + rebuild, with `.recover` as forensic only

SQLite `.recover` may salvage evidence but must not be promoted as trusted graph state. The trusted recovery path is copy/quarantine, optional forensic salvage on copies, full scan from source, and verification.

Rationale: code-graph storage is a rebuildable cache with ordinary tables/indexes; iteration 3 confirmed `.recover` SQL shape and SQLite's limitations. [SOURCE: `research/iterations/iteration-003.md:3-10`; `research/iterations/iteration-003.md:107-152`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:50-115`]

Asset: `assets/recovery-playbook.md`

### D5: Use tiered exclude confidence, not blanket global exclusions

High-confidence excludes may remain default excludes; medium-confidence excludes need warnings/overrides; low-confidence excludes require repo-level operator decision.

Rationale: existing defaults exclude `node_modules`, `dist`, `.git`, `vendor`, `external`, `z_future`, `z_archive`, and `mcp-coco-index/mcp_server`, but iteration 5 found verified false-positive examples for `vendor`, `build`, fixtures, testdata, and repo lifecycle paths. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:112-120`; `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31-48`; `research/iterations/iteration-005.md:19-43`]

Asset: `assets/exclude-rule-confidence.json`

### D6: Gate trust promotion on the gold query battery

Use the 28-query battery as a post-full-scan confidence floor. Overall pass rate below 90%, edge-focus pass rate below 80%, or loss of a critical expected symbol prevents trust promotion.

Rationale: iteration 4's queries protect canonical MCP handlers, cross-module internals, exported contracts, and regression canaries; iteration 6 ties top-K pass rates to drift detection. [SOURCE: `research/iterations/iteration-004.md:11-57`; `research/iterations/iteration-006.md:40-43`]

Asset: `assets/code-graph-gold-queries.json`
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:consequences -->
## Consequences

- Doctor UX should distinguish soft-stale repair suggestions from hard "graph unreliable" failures.
- Read-only impact tools should continue blocking on non-fresh graph state.
- Full scans should be followed by gold-query verification before declaring the graph trustworthy.
- Exclude-rule changes should cite confidence tier and false-positive risk.
<!-- /ANCHOR:consequences -->
