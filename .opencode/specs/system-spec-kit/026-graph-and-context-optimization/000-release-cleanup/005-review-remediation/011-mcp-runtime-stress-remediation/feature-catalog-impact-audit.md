---
title: "Feature catalog impact audit — Phase 011 (packets 001–015)"
description: "Read-only audit of which feature_catalog entries are stale, missing, or up-to-date with respect to the behavior/tool/contract changes ratified in phase 011 and its 15 child packets."
audit_date: "2026-04-27"
auditor: "claude-opus-4-7 [1m]"
scope: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/{001..015}"
catalog_root: ".opencode/skill/system-spec-kit/feature_catalog"
mirror_status: "All four runtime mirrors (.opencode, .gemini, .claude, .codex) are hardlinked to the same inode (26087506) for feature_catalog.md and per-feature .md files; auditing the .opencode source-of-truth covers all four."
---

# Feature catalog impact audit — Phase 011 (packets 001–015)

## 1. EXECUTIVE SUMMARY

This audit began as a 2026-04-27 snapshot and is preserved below as historical evidence. Current-state reconciliation on 2026-04-28 shows the live feature catalog has since absorbed the high-impact phase-011 fields and helpers: `fallbackDecision`, `getGraphReadinessSnapshot`, `readiness.action`, `rawScore`, `pathClass`, `rankingSignals`, `buildCopilotPromptArg`, `CopilotTargetAuthority`, `responsePolicy`, `citationPolicy`, `preEnforcementTokens`, `returnedTokens`, `deltaByRelation`, `balanceStatus`, `classificationKind`, `paraphraseGroup`, and `backendRouting` now appear in the relevant live catalog/playbook surfaces. The old "catalog has not been updated for any of them" statement is therefore historical only, not current guidance.

The source-of-truth roots are `.opencode/skill/system-spec-kit/feature_catalog/` and `.opencode/skill/system-spec-kit/manual_testing_playbook/`. The originally cited `.opencode/skill/sk-doc/...` root does not exist in this checkout.

## 1A. CURRENT-STATE RECONCILIATION (2026-04-28)

| Area | Live-state result | Evidence |
|------|-------------------|----------|
| Code graph readiness / fast-fail | Confirmed current | 22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md documents `fallbackDecision`, `getGraphReadinessSnapshot()`, `readiness.action`, `SELECTIVE_REINDEX_THRESHOLD`, and the packet-013 disambiguation. |
| Readiness contract | Confirmed current | 22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md documents handler-local degraded payload shapes and the non-mutating status snapshot. |
| CocoIndex bridge | Confirmed current | 22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md documents `rawScore`, `pathClass`, `rankingSignals`, fork telemetry, and the passthrough test. |
| Catalog/playbook downstream alignment | Still tracked | Packet `018-catalog-playbook-degraded-alignment/` remains in progress and owns remaining degraded-envelope / rankingSignals wording alignment. |

Historical sections below are retained for provenance; use this reconciliation block for current-state guidance.

---

## 2. PER-PHASE IMPACT TABLE

| Phase | Behavior change | Catalog file(s) affected | Status | Recommended action |
|---|---|---|---|---|
| **001** stress test v1.0.1 | None — evidence package + rubric documentation | (n/a) | UP-TO-DATE | None. Optional: catalog the rubric under `09--evaluation-and-measurement/` if it becomes reusable across phases. |
| **002** Q1–Q8 deep research | None — research package only | (n/a) | UP-TO-DATE | None. |
| **003** memory_context truncation contract: `preEnforcementTokens`, `returnedTokens`, `actualTokens` alias, `droppedAllResultsReason` | 01--retrieval/01-unified-context-retrieval-memorycontext.md | NEEDS-UPDATE | Add §2 paragraph documenting the four new envelope fields and the under-budget invariant `preEnforcementTokens === returnedTokens === actualTokens`. |
| **004** vendored cocoindex_code fork v0.2.3+spec-kit-fork.0.2.0 emits `dedupedAliases`, `uniqueResultCount`, `path_class`, `rankingSignals`, `source_realpath`, `content_hash`, `raw_score` | 22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md; possibly a new `04--maintenance/` or `16--tooling-and-scripts/` entry for the vendored fork | NEEDS-UPDATE + MISSING | (a) Update 09-cocoindex-bridge-context.md §2 to mention the 7 fork telemetry fields the bridge now sees from the seed side. (b) Consider a new entry under `16--tooling-and-scripts/` titled "Vendored cocoindex_code fork (spec-kit-fork)" pointing at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code` and listing the fork-emitted fields. |
| **005** code_graph_query `fallbackDecision.{nextTool, reason, retryAfter}` on blocked/degraded reads | 22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md; 22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md; 22--context-preservation-and-code-graph/08-code-graph-storage-query.md | NEEDS-UPDATE | Add bullet to §1/§2 in all three files describing `fallbackDecision` field with its 3 sub-fields and the empty/stale/unavailable -> nextTool routing matrix (`code_graph_scan`, `code_graph_scan`, `rg`). |
| **006** memory_causal_stats `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, `remediationHint`, `windowStartedAt` + per-relation per-window auto-edge cap | 06--analysis/02-causal-graph-statistics-memorycausalstats.md; 02--mutation/01-memory-indexing-memorysave.md (auto-edge cap on supersedes path); `10--graph-signal-activation/*` (per-relation cap as an across-the-board behavior) | NEEDS-UPDATE | (a) Rewrite §2 of 02-causal-graph-statistics-memorycausalstats.md to describe the 6 new fields, the rolling window, balanceStatus values (`balanced` / `relation_skewed` / `insufficient_data`), and reconciliation between `health` and `meetsTarget`. (b) Add one paragraph to memory_save §2 documenting the new auto-edge cap that PE/reconsolidation supersession now respects. |
| **007** IntentTelemetry contract: `taskIntent.classificationKind`, `paraphraseGroup`, `backendRouting.classificationKind` | 22--context-preservation-and-code-graph/14-query-intent-classifier.md; 01--retrieval/01-unified-context-retrieval-memorycontext.md (consumer) | NEEDS-UPDATE | (a) Expand 14-query-intent-classifier.md §2 (currently a one-line stub) to describe the IntentTelemetry envelope, the three classificationKind sites, and `paraphraseGroup` stability. (b) Add a sentence in memory_context §2 noting that intent telemetry now carries `classificationKind` for `taskIntent` and `backendRouting` and a stable `paraphraseGroup` token for paraphrase deduplication. |
| **008** canonical MCP rebuild + restart + live-probe protocol | 16--tooling-and-scripts/20-ops-self-healing-runbooks.md; 16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md | NEEDS-UPDATE | Cross-reference the 4 new reference docs (mcp-rebuild-restart-protocol.md, live-probe-template.md, dist-marker-grep-cheatsheet.md, implementation-verification-checklist.md) under `references/` of phase 008, and surface them in the OPERATIONAL surface entries. Optional: a single new catalog entry under `16--tooling-and-scripts/` titled "MCP daemon rebuild + live-probe verification protocol". |
| **009** memory_search `responsePolicy.{requiredAction, noCanonicalPathClaims, citationRequiredForPaths, safeResponse}` + `citationPolicy: cite_results \| do_not_cite_results` + extended `RecoveryAction` vocabulary | 01--retrieval/02-semantic-and-lexical-search-memorysearch.md; possibly 15--retrieval-enhancements/08-provenance-rich-response-envelopes.md; possibly 18--ux-hooks/15-mode-aware-response-profiles.md | NEEDS-UPDATE | (a) Add §2 paragraph in 02-semantic-and-lexical-search-memorysearch.md explicitly documenting the binding refusal contract: when `requestQuality.label != "good"` AND `recovery.status` is degraded, response carries `responsePolicy.noCanonicalPathClaims:true` and a fixed `safeResponse`. List the three `requiredAction` values and the `citationPolicy` axis. (b) Optional cross-link from envelope/UX entries. |
| **010** stress test v1.0.2 sweep | None — evidence package | (n/a) | UP-TO-DATE | None. |
| **011** post-stress follow-up research | None — research synthesis | (n/a) | UP-TO-DATE | None. |
| **012** `buildCopilotPromptArg` helper, `CopilotTargetAuthority` discriminated union, `validateSpecFolder`, deep-loop YAML wire-up | (no current entry) | MISSING | Add new entry, e.g. 16--tooling-and-scripts/36-copilot-target-authority-helper.md (or under a new `17--governance/` slot). Document the three-branch behavior matrix (approved -> preamble; missing+writeIntent -> Gate-3 prompt + strip `--allow-all-tools`; missing+!writeIntent -> pass-through), the two YAML call sites, and override-resistance semantics. |
| **013** integration test `code-graph-degraded-sweep.vitest.ts` + exported `SELECTIVE_REINDEX_THRESHOLD` | 22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md | NEEDS-UPDATE (low-priority) | Add `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` to the §3 Tests table; mention the threshold export in §2. Consider correcting "Packet 013 made this visible" wording to disambiguate (it points at 024-compact-code-graph/013, not 011/013). |
| **014** `getGraphReadinessSnapshot()` helper, `code_graph_status.readiness.action: full_scan \| selective_reindex \| none` | 22--context-preservation-and-code-graph/08-code-graph-storage-query.md; 22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md; 22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md | NEEDS-UPDATE (high-priority) | (a) Update §1 sentence on `code_graph_status` in 08-code-graph-storage-query.md to add "with `readiness.action: full_scan \| selective_reindex \| none`". (b) Add `getGraphReadinessSnapshot()` to the auto-trigger §3 Implementation table as the read-only sibling of `ensureCodeGraphReady`. (c) Mention that the readiness contract now has a dedicated non-mutating read path. |
| **015** code_graph_context anchors carry `rawScore`, `pathClass`, `rankingSignals` passthrough | 22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md | NEEDS-UPDATE (high-priority) | Update §1 / §2 in 09-cocoindex-bridge-context.md to document the seed-to-anchor passthrough: when a cocoindex seed carries `raw_score` / `path_class` / `rankingSignals` (or their camelCase variants), the resolved anchors echo them back next to existing `score`, `snippet`, `range` fields. Pure additive; no scoring change. Add `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` to §3 Tests. |

**Tally:** UP-TO-DATE 5 (packets 001, 002, 010, 011, plus the parts of 013 already covered) — NEEDS-UPDATE 9 (packets 003, 004, 005, 006, 007, 008, 009, 014, 015) — MISSING 2 (012 entirely; vendored fork section of 004) — note: 013 falls under NEEDS-UPDATE alongside 014 because both modify the auto-trigger entry.

---

## 3. DETAILED FINDINGS

### 3.1 Packet 003 — memory_context truncation contract

- **File:** `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md`
- **Stale lines:** §2 paragraph at lines 22–23 currently says "After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts."
- **Missing fields:** `preEnforcementTokens`, `returnedTokens`, `actualTokens` (now an alias of `returnedTokens`), `droppedAllResultsReason: "impossible_budget"`.
- **Recommended diff:** After the existing `enforceTokenBudget()` sentence, append:
  > The token-budget envelope now exposes four explicit fields: `preEnforcementTokens` (captured before any truncation or fallback), `returnedTokens` (the final emitted budgeted size), `actualTokens` (kept as a backward-compatible alias of `returnedTokens` so downstream parsers don't break), and on empty fallback payloads only, `droppedAllResultsReason: "impossible_budget"`. The under-budget invariant is `preEnforcementTokens === returnedTokens === actualTokens` with no `droppedAllResultsReason`.
- **Source:** `003-memory-context-truncation-contract/implementation-summary.md` lines 50–54.

### 3.2 Packet 004 — vendored cocoindex_code fork telemetry

- **File:** `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
- **Stale wording:** §1 line 13 lists provider metadata as "`source`, `score`, `snippet`, and `range`" only. The fork now also emits 7 additional fields: `dedupedAliases`, `uniqueResultCount`, `path_class`, `rankingSignals`, `source_realpath`, `content_hash`, `raw_score`.
- **Missing entry candidate:** The vendored soft-fork `cocoindex_code v0.2.3+spec-kit-fork.0.2.0` lives under `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code` (per 004's answered question). No catalog entry currently advertises that the project ships a forked cocoindex.
- **Recommended action:**
  1. Patch 09-cocoindex-bridge-context.md §1 to enumerate the 7 fork fields with a short note on which are seed-side (path_class, raw_score, rankingSignals — see 015) versus result-set-side (dedupedAliases, uniqueResultCount).
  2. Open a new file at 16--tooling-and-scripts/36-vendored-cocoindex-fork.md documenting the fork's location, version pin, and the 7 emitted telemetry fields. Cross-link from 09-cocoindex-bridge-context.md and from 015's anchor passthrough.

### 3.3 Packet 005 — code_graph_query fallbackDecision

- **Files:**
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md` (primary — it owns the blocked-payload contract)
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` (downstream reference)
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/08-code-graph-storage-query.md` (overview row for `code_graph_query`)
- **Missing fields:** `fallbackDecision` envelope sub-field with three sub-fields: `nextTool: "code_graph_scan" | "rg"`, `reason: "full_scan_required" | "selective_reindex" | "scan_failed" | "scan_declined"`, `retryAfter?: "scan_complete"`.
- **Recommended diff (15-code-graph-auto-trigger.md, after line 21):** Insert bullet:
  > - `fallbackDecision: { nextTool, reason, retryAfter? }` for caller routing. Empty/stale full-scan states return `nextTool:"code_graph_scan"`, `reason:"full_scan_required"`, `retryAfter:"scan_complete"`. Selective-reindex and fresh paths emit no `fallbackDecision`. Readiness-crash states return `nextTool:"rg"`, `reason:"scan_failed"`.
- **Source:** `005-code-graph-fast-fail/implementation-summary.md` lines 55–57, 100–104; tasks.md line 54.

### 3.4 Packet 006 — causal stats relation-window metrics

- **File:** `.opencode/skill/system-spec-kit/feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md`
- **Stale wording:** §2 (lines 19–25) describes only edge counts, breakdown by relationship type, average strength, source/target counts, link coverage, and orphan detection.
- **Missing fields:** `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus` (`balanced` / `relation_skewed` / `insufficient_data`), `remediationHint`, `windowStartedAt`, plus zero-fill for all 6 relation types in `by_relation`.
- **Recommended diff:** Append a new paragraph to §2:
  > The response now also reports rolling-window deltas and balance metrics: `deltaByRelation` (per-relation count of new edges in the active window), `dominantRelation` and `dominantRelationShare` (largest relation type and its share of the window total), `balanceStatus` (one of `balanced`, `relation_skewed`, `insufficient_data`), `remediationHint` (a string naming the producer when skew is detected, e.g. prediction-error supersede burst), and `windowStartedAt`. `by_relation` is zero-filled across all 6 relation types so a missing type appears as 0 rather than disappearing. When `dominantRelationShare > 0.80` AND total new edges in window >= 50, `balanceStatus` is `relation_skewed` and `remediationHint` is set. Auto-edge insertion on PE / reconsolidation paths now respects a per-relation per-window cap routed through shared cap logic so supersedes bursts cannot dominate the graph.
- **Cross-impact:** 02--mutation/01-memory-indexing-memorysave.md should add one sentence in its PE/supersedes paragraph noting that auto-edge insertion is now capped per relation per window.
- **Source:** `006-causal-graph-window-metrics/spec.md` lines 56–110.

### 3.5 Packet 007 — IntentTelemetry contract

- **Files:**
  - `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md` (primary — currently a 12-line stub with §2 reading only "mcp_server/code_graph/lib/query-intent-classifier.ts")
  - `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md` (consumer surface)
- **Missing fields:** `taskIntent.classificationKind`, `paraphraseGroup`, `backendRouting.classificationKind` (a normalized envelope across the two classification sites).
- **Recommended diff (14-query-intent-classifier.md):** Replace the §2 one-liner with a real description that mentions the IntentTelemetry envelope, the three `classificationKind` markers, and `paraphraseGroup` as the stability token used so paraphrased queries map to the same group.
- **Source:** `007-intent-classifier-stability/implementation-summary.md` (recent_action: "Implemented source/test/dist IntentTelemetry contract").

### 3.6 Packet 008 — canonical MCP rebuild + restart + live-probe protocol

- **Files:**
  - `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md`
  - `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md`
- **Missing references:** The 4 new reference docs at `008-mcp-daemon-rebuild-protocol/references/`:
  - mcp-rebuild-restart-protocol.md
  - live-probe-template.md
  - dist-marker-grep-cheatsheet.md
  - implementation-verification-checklist.md
- **Recommended action:** Add a one-paragraph cross-reference in each tooling/setup entry pointing at these 4 docs as the canonical post-implementation verification surface. Optionally introduce a new 16--tooling-and-scripts/37-mcp-daemon-rebuild-and-live-probe-protocol.md entry at category level so the protocol is first-class catalog content.
- **Source:** `008-mcp-daemon-rebuild-protocol/implementation-summary.md` continuity block (key_files lists all 4 references).

### 3.7 Packet 009 — memory_search response policy

- **File:** `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md`
- **Stale wording:** Existing §2 (lines 22–30) is silent on response policy and citation policy. Recovery vocabulary discussion is buried in 15--retrieval-enhancements/08-provenance-rich-response-envelopes.md which also predates this packet.
- **Missing fields:** `responsePolicy.requiredAction` (`ask_disambiguation` / `broaden_or_ask` / `refuse_without_evidence`), `responsePolicy.noCanonicalPathClaims`, `responsePolicy.citationRequiredForPaths`, `responsePolicy.safeResponse`, top-level `citationPolicy` (`cite_results` / `do_not_cite_results`).
- **Recommended diff:** Add a new paragraph to §2:
  > When `requestQuality.label != "good"` AND `recovery.status` indicates degraded retrieval (`low_confidence`, `partial`, `no_results`), the response now carries a binding `responsePolicy` block with `requiredAction` (one of `ask_disambiguation`, `broaden_or_ask`, `refuse_without_evidence`), `noCanonicalPathClaims: true`, `citationRequiredForPaths: true`, and a fixed canonical `safeResponse` string the caller MUST emit instead of inventing details. All `memory_search` responses additionally carry a top-level `citationPolicy` set to `cite_results` (good quality) or `do_not_cite_results` (weak/partial/no_results). The `RecoveryAction` vocabulary was extended to include `ask_disambiguation`, `refuse_without_evidence`, and `broaden_or_ask`. Empty `suggestedQueries` together with `recommendedAction:"ask_user"` is now a contract violation: the runtime synthesizes at least 2 broadening suggestions OR sets `responsePolicy.requiredAction:"ask_disambiguation"`.
- **Source:** `009-memory-search-response-policy/spec.md` lines 61–129.

### 3.8 Packet 012 — Copilot target authority helper

- **Status:** MISSING entry. No catalog file currently references the deep-loop dispatch helper, `executor-config.ts`, or the cli-copilot dispatch pathway in detail. The closest existing entry is 18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md, which covers a different (hook-side) Copilot integration.
- **Recommended new file:** `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/36-copilot-target-authority-helper.md` (or a similar slot under `17--governance/` since this is essentially a write-authority gate). Sections:
  - §1 Overview — wraps every cli-copilot deep-loop dispatch with a typed `targetAuthority` token; closes the v1.0.2 I1 catastrophic-mutation pathology.
  - §2 Current reality — the three-branch behavior matrix (`approved` -> preamble; `missing` + writeIntent -> Gate-3 prompt and strip `--allow-all-tools`; `missing` + !writeIntent -> pass-through), large-prompt override resistance, the new `CopilotTargetAuthority` discriminated union, and `validateSpecFolder`.
  - §3 Source files — `mcp_server/lib/deep-loop/executor-config.ts`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, plus the new vitest.
- **Source:** `012-copilot-target-authority-helper/spec.md` lines 79–167.

### 3.9 Packet 013 — graph degraded stress cell + SELECTIVE_REINDEX_THRESHOLD export

- **File:** `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`
- **Recommended diff:**
  1. In §3 Tests, add row: `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts | Five-cell sweep: empty, broad-stale, bounded-stale, fresh, readiness-crash. Asserts fallbackDecision routing alongside readiness state.`
  2. Disambiguate the existing wording at line 15 — "Packet 013 made this visible" — to read "Spec 024-compact-code-graph packet 013 made this visible" so it is not confused with phase 011's own packet 013 (graph-degraded-stress-cell).
- **Source:** `013-graph-degraded-stress-cell/implementation-summary.md` continuity (key_files: `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts`).

### 3.10 Packet 014 — getGraphReadinessSnapshot + readiness.action

- **Files (all in `22--context-preservation-and-code-graph/`):**
  - 08-code-graph-storage-query.md — overview of the four code_graph_* tools
  - 15-code-graph-auto-trigger.md — auto-trigger + ensure-ready
  - 24-code-graph-readiness-contract.md — shared readiness contract
- **Stale wording (08-code-graph-storage-query.md line 13):** "`code_graph_status` (freshness plus readiness, trust, parse-health, and `graphQualitySummary` reporting)" — does not mention `readiness.action`.
- **Recommended diff (08-code-graph-storage-query.md line 13):** Replace "freshness plus readiness, trust, parse-health, and `graphQualitySummary` reporting" with "freshness plus readiness with `readiness.action: full_scan | selective_reindex | none`, trust, parse-health, and `graphQualitySummary` reporting".
- **Recommended diff (15-code-graph-auto-trigger.md §3 Implementation table):** Add row: `mcp_server/code_graph/lib/ensure-ready.ts | Lib | Read-only sibling getGraphReadinessSnapshot() returns the same {action, freshness, reason} triplet without mutating cache, deleted-file cleanup, or inline indexer.` Also expand §1 to note that the readiness contract now has a dedicated non-mutating diagnostic helper.
- **Recommended diff (24-code-graph-readiness-contract.md §2):** Append a sentence noting the readiness module now exposes a non-mutating `getGraphReadinessSnapshot()` for status reporting.
- **Source:** `014-graph-status-readiness-snapshot/spec.md` lines 60–129.

### 3.11 Packet 015 — cocoindex seed telemetry passthrough

- **File:** `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/09-cocoindex-bridge-context.md`
- **Stale wording (line 13):** "preserves CocoIndex seed fidelity across both `file` and `filePath` inputs so provider metadata such as `source`, `score`, `snippet`, and `range` survive into resolved anchors".
- **Missing fields:** `rawScore`, `pathClass`, `rankingSignals` on returned anchors (purely additive when seeds carry them; absent when seeds don't).
- **Recommended diff:** Replace the cited sentence with:
  > preserves CocoIndex seed fidelity across both `file` and `filePath` inputs so provider metadata such as `source`, `score`, `snippet`, and `range` survive into resolved anchors. Anchors now also passthrough `rawScore`, `pathClass`, and `rankingSignals` from the cocoindex_code fork (snake_case wire names `raw_score`, `path_class`, `rankingSignals` are normalized to camelCase). The fields are pure additive metadata: anchor scoring, ordering, and confidence are unchanged, and anchors are byte-equal to the pre-patch baseline when the seed does not carry the fields.
- **Recommended §3 Tests addition:** `mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts | Snake-case wire, camelCase internal, missing-field byte-equal baseline, no double rerank.`
- **Source:** `015-cocoindex-seed-telemetry-passthrough/spec.md` lines 63–126.

---

## 4. CONTRADICTION CHECK

A focused grep for old contract names that should now be wrong (`actualTokens`-only, `cite_results`, etc.) plus an inspection of the four most-affected catalog files turned up **zero direct contradictions**: no entry asserts that `code_graph_status.readiness.action` is fixed at `"none"`, that `memory_search` lacks a refusal contract, that cocoindex anchors are limited to `score/snippet/range`, etc. The catalog is stale by omission (the new fields and helpers are simply absent), with one borderline case worth correcting:

- **22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md line 15** — phrase "Packet 013 made this visible to callers" refers to spec `024-compact-code-graph` packet 013, NOT phase 011's own packet 013 (`013-graph-degraded-stress-cell`). With phase 011 landed, "Packet 013" is now ambiguous and could mislead a future reader. Recommended fix: prefix with the spec id.

No entries make claims that the new behavior breaks.

---

## 5. SUMMARY COUNTS

| Status | Count | Packets |
|---|---|---|
| **CONFIRMED-CURRENT** | 10+ | Live catalog now contains the high-impact post-011 fields/helpers named in §1A. |
| **TRACKED-DOWNSTREAM** | 1 | Packet 018 owns remaining catalog/playbook degraded-alignment cleanup. |
| **HISTORICAL-ONLY** | 11 | The older NEEDS-UPDATE/MISSING rows below remain useful as a provenance snapshot, but no longer describe the live catalog state. |

**Top 5 highest-impact NEEDS-UPDATE items** (by reader risk if left stale):

1. Packet 009 — `memory_search` response policy. The binding refusal contract is the most consequential semantic change and the existing entry is silent on it.
2. Packet 014 — `code_graph_status.readiness.action`. Catalog still implies "freshness + graphQualitySummary"; misses the new operator-actionable triplet.
3. Packet 005 — `fallbackDecision` routing on blocked code_graph_query reads. Without this, callers reading the catalog will not learn there is a typed routing field telling them what tool to invoke next.
4. Packet 015 — anchor passthrough of cocoindex fork telemetry. The 09-cocoindex-bridge-context.md entry is the natural home and pairs with 014 for full code-graph observability.
5. Packet 012 — `buildCopilotPromptArg` helper and `targetAuthority` token. Closes the v1.0.2 I1 catastrophic-mutation pathology and currently has no catalog presence at all.

**Mirror status:** All 4 runtime mirrors are hardlinked to inode `26087506`. Editing the .opencode source-of-truth propagates instantly. No per-runtime divergence.

---

## 6. AUDIT METADATA

- **Audit timestamp:** 2026-04-27
- **Catalog version audited:** feature_catalog.md last-modified 2026-04-26 16:12 (size 404606 bytes, inode 26087506)
- **Original search strategy:** ripgrep against catalog for the 9 ratified field/helper token families. That 2026-04-27 result is superseded by the 2026-04-28 reconciliation in §1A, which found the live catalog/playbook surfaces now contain the high-impact tokens.
- **Out of scope:** Per-CLI feature_catalog folders do not exist (`.opencode/skill/cli-{copilot,codex,claude-code,gemini,opencode}/feature_catalog/`); these CLI skills carry only `references/` and `manual_testing_playbook/` — so no per-CLI catalog edits are needed. Runtime-mirror equivalents (`.gemini/`, `.claude/`, `.codex/`) are hardlinks to the .opencode source.
