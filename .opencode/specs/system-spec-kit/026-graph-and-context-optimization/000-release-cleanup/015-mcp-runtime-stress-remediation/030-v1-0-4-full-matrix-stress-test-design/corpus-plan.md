---
title: "Corpus Plan: v1.0.4 Full-Matrix Stress Test"
description: "Detailed corpus design for future full-matrix stress execution across F1-F14 system-spec-kit surfaces and 7 executor surfaces."
trigger_phrases:
  - "full matrix corpus plan"
  - "v1.0.4 full matrix corpus"
  - "feature executor scenario cells"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/030-v1-0-4-full-matrix-stress-test-design"
    last_updated_at: "2026-04-29T11:40:34Z"
    last_updated_by: "codex"
    recent_action: "Corpus plan authored"
    next_safe_action: "Execution phase should freeze matrix-manifest.json from this plan"
    blockers: []
    key_files:
      - "corpus-plan.md"
    session_dedup:
      fingerprint: "sha256:030-full-matrix-corpus-plan"
      session_id: "030-full-matrix-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Corpus Plan: v1.0.4 Full-Matrix Stress Test

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: custom-supporting-doc | v2.2 -->

## 1. Corpus Record Shape

The execution phase should materialize this design as `matrix-manifest.json` before any scoring starts.

```json
{
  "id": "F3.cli-codex.S2.multi-concept-refusal",
  "featureId": "F3",
  "executorId": "cli-codex",
  "scenarioId": "S2",
  "applicability": "applicable",
  "invocationType": "real-cli",
  "requiresWriteSandbox": false,
  "requiresCliAuth": true,
  "requiresMcp": true,
  "requiresCocoIndex": false,
  "expectedEvidence": ["transcript", "normalized-cell-row", "source-citations"],
  "scoreDimensions": ["correctness", "robustness", "telemetry", "regression-safety"]
}
```

Allowed `applicability`: `applicable`, `fixture-only`, `na`, `skip-if-unavailable`, `unautomatable`.

Allowed `invocationType`: `inline-tool`, `inline-shell`, `native-task`, `native-command`, `real-cli`, `fixture`, `adapter-simulation`, `manual`.

## 2. Matrix Size

The theoretical maximum is:

```text
14 feature surfaces x 7 executor surfaces x 3 scenarios = 294 scenario cells
```

The likely first full run is smaller after non-applicable pruning:

| Count Type | Estimate |
|------------|----------|
| Theoretical scenario cells | 294 |
| Expected applicable or fixture-only cells | 220-260 |
| Expected true `NA` cells | 25-45 |
| Expected `SKIP` risk from auth/index/env | 0-30 depending on execution host |

The execution findings must report all four counts. Do not publish only scored-cell totals.

## 3. Feature Scenario Seeds

| Feature | S1 Deterministic | S2 Real/Runtime | S3 Degraded/Adversarial |
|---------|------------------|-----------------|-------------------------|
| F1 spec-folder workflow | Template/level-route dry run against disposable folder | Create Level 1/2/3 sandbox packet and strict validate | Malformed frontmatter or wrong-level packet must fail validation |
| F2 skill advisor + skill graph | Exact skill-route prompts with expected labels | Native `advisor_recommend` or hook bridge smoke where reachable | Ambiguous prompt, stale graph, disabled flag fail-open |
| F3 memory_search | Fixture query checks envelope shape and citation policy | Real MCP/handler semantic, hybrid, multi-concept cells | Weak evidence must refuse or ask, not invent canonical paths |
| F4 memory_context | Mode resolver table: quick/focused/deep/resume | Token budget enforcement and pressure policy smoke | Impossible budget or anonymous resume must degrade honestly |
| F5 code_graph_query | Outline/calls/imports for known symbol | Blocked full-scan and fallbackDecision path | Stale/missing graph must expose readiness, not wrong graph answers |
| F6 code_graph_scan/verify | Incremental scan fixture | Full scan or gold battery verify in sandbox | Corrupt/stale graph status must ask for required action |
| F7 causal graph | Link/unlink/stats round-trip in disposable DB | Relation balance and deltaByRelation sample | Supersedes burst or orphaned edge detection |
| F8 CocoIndex search | Missing-index recovery and no-index `SKIP` proof | Semantic code search plus bridge seed fidelity | Duplicate-heavy or path-class calibration scenario |
| F9 continuity/generate-context | Dry-run continuity metadata validation | Canonical save into sandbox packet with description/graph refresh | Duplicate/oversized/bad anchor save must fail or warn |
| F10 deep-research/deep-review | State schema and prompt-pack render checks | Command-owned single-iteration smoke by executor kind | Missing markdown or JSONL delta triggers schema_mismatch |
| F11 hooks | Adapter simulation for advisor hook and Gate 3 classifier | Runtime-specific hook smoke where supported | Disabled hook or malformed stdin must fail open |
| F12 validators | Strict validator pass on good sandbox | Anchor/frontmatter lint and checklist validation | Cross-anchor contamination or malformed `_memory` block |
| F13 stress cycle pattern | Findings and sidecar schema fixture | Mini-cycle with 2-3 harmless cells | Artificial dropped score must trigger Hunter -> Skeptic -> Referee |
| F14 W3-W13 search features | W3-W13 fixture replay from search-quality corpus | Live handler/envelope/audit/SLA cells where supported | Negative controls for W4 selectivity and degraded readiness |

## 4. Executor Applicability Guide

| Feature | cli-codex | cli-copilot | cli-gemini | cli-claude-code | cli-opencode | native | inline |
|---------|-----------|-------------|------------|-----------------|--------------|--------|--------|
| F1 | applicable | applicable | fixture-only unless write-approved | plan or applicable if write-approved | applicable | applicable | applicable |
| F2 | applicable | applicable | adapter-simulation | adapter-simulation | applicable | applicable | applicable |
| F3 | applicable | applicable | fixture-only unless MCP available | fixture-only unless MCP available | applicable | native-command | inline-tool |
| F4 | applicable | applicable | fixture-only unless MCP available | fixture-only unless MCP available | applicable | native-command | inline-tool |
| F5 | applicable | applicable | fixture-only unless MCP available | fixture-only unless MCP available | applicable | native-command | inline-tool |
| F6 | applicable | applicable | skip-if-unavailable | skip-if-unavailable | applicable | native-command | inline-shell |
| F7 | applicable | applicable | fixture-only unless MCP available | fixture-only unless MCP available | applicable | native-command | inline-tool |
| F8 | skip-if-unavailable | skip-if-unavailable | skip-if-unavailable | skip-if-unavailable | skip-if-unavailable | skip-if-unavailable | skip-if-unavailable |
| F9 | applicable in sandbox | applicable in sandbox | fixture-only | fixture-only | applicable in sandbox | native-command | inline-shell |
| F10 | applicable via command executor | applicable via command executor | applicable via command executor | applicable via command executor | applicable via command executor | native-command | fixture-only |
| F11 | adapter-simulation | adapter-simulation/custom-instructions | adapter-simulation | adapter-simulation | plugin bridge | native/adapter | inline adapter |
| F12 | applicable | applicable | fixture-only | fixture-only | applicable | native-command | inline-shell |
| F13 | applicable | applicable | applicable | applicable | applicable | native-command | inline-shell |
| F14 | applicable | applicable | fixture-only unless MCP available | fixture-only unless MCP available | applicable | native-command | inline-tool |

## 5. Evidence Requirements

Every scored result row must contain:

- `status`: `PASS`, `FAIL`, `SKIP`, `UNAUTOMATABLE`, or `NA`.
- `scores`: four 0-2 dimension scores when status is `PASS` or `FAIL`.
- `evidence`: file paths, artifact paths, transcript paths, or source citations.
- `executor`: executor kind, model when relevant, reasoning effort when relevant, timeout, and service tier if supported.
- `applicabilityReason`: mandatory for `NA`, `SKIP`, and `UNAUTOMATABLE`.
- `sideEffects`: changed files, created sandbox paths, or `none`.
- `comparison`: prior full-matrix matching cell if any, otherwise `firstBaseline`.

## 6. Sample-Size Guards

| Claim Type | Minimum N | Handling Below Minimum |
|------------|-----------|------------------------|
| Global aggregate percent | 30 scored scenario cells | Allowed, but headline must say directional |
| Per-feature percent | 5 scored scenario cells | Allowed, but no regression severity above P2 without corroborating evidence |
| Per-executor percent | 10 scored scenario cells | Allowed, but no executor-level ranking |
| p95/p99 latency | 30 timed rows | Report as sample p95/p99 with advisory |
| Refusal/rerank/skip rate | 30 eligible rows | Report rate as directional |

Packet 029 used this posture for its 12-case/16-capture run and warned that rates and percentiles were directional (`029-stress-test-v1-0-4/findings-v1-0-4.md:27`, `:152`).

## 7. Manifest Freeze Rules

1. Freeze `matrix-manifest.json` before scoring.
2. No scenario can be added after T001 without incrementing manifest version.
3. Any changed applicability must be recorded as a manifest amendment row.
4. The aggregator must fail closed if result rows reference unknown manifest cell IDs.
5. The final sidecar must include manifest hash and manifest version.
