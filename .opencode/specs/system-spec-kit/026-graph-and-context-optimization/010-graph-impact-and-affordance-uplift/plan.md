---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: Graph Impact and Affordance Uplift (012)"
description: "6-sub-phase plan implementing converged pt-01 + pt-02 research. License-audit gate, Code Graph foundation, three parallel uplift packets, docs rollup."
trigger_phrases:
  - "012 plan"
  - "graph impact uplift plan"
  - "external-project adoption plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Graph Impact and Affordance Uplift (012)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. STRATEGY

Implement converged pt-01 + pt-02 research as 6 owner-scoped sub-phases. Sequencing: P0 license gate → Code Graph foundation → 3 parallel uplift packets → docs rollup. Each code sub-phase ships its own per-packet feature_catalog + manual_testing_playbook entries inline; trailing 006 sub-phase rolls up umbrella docs.

### Why this shape
- pt-02 §11 prescribes 5 packets; pt-02 deferred Packet 5 (route/tool/shape). 012 adopts packets 1-4 and adds 001 (license audit, P0) + 006 (docs rollup) per user request.
- pt-02 §13 enforces strict owner separation. Each code sub-phase belongs to exactly one owner.
- pt-02 §12 ranks risks P0/P1/P2 with mitigations; this plan inherits them.

---

## 2. SUB-PHASE PLAN

### 012/001 — clean-room-license-audit
- **Goal:** Decision-record ADR confirming `external/LICENSE` posture; clean-room rule articulated; allow-list of pattern-only adaptations vs forbidden source forms.
- **Output:** `decision-record.md` ADR; halt criterion if license forbids reuse and clean-room cannot satisfy adaptation needs.
- **Effort:** S (1-2h)
- **Dependencies:** None.
- **Blocks:** All downstream sub-phases.

### 012/002 — code-graph-phase-runner-and-detect-changes
- **Goal:** Adopt phase-DAG runner around scan; build read-only `detect_changes` handler that maps git diff hunks to symbols and refuses to answer when graph is stale.
- **Files:**
  - NEW `code_graph/lib/phase-runner.ts` — typed phase contract (inputs[], outputs[], topo-sort, cycle detection).
  - NEW `code_graph/lib/diff-parser.ts` — git diff hunk parser (open: which library; tracked as P1-03 blocker).
  - NEW `code_graph/handlers/detect-changes.ts` — preflight handler.
  - MODIFY `code_graph/lib/structural-indexer.ts:1369` — wrap `indexFiles` in phase runner.
  - MODIFY `code_graph/handlers/index.ts` — register new handler.
- **Hard rule:** `detect_changes` returns `status: blocked` on stale; never `"no affected symbols"`.
- **Effort:** L (8-12h)
- **Dependencies:** 001 license audit.
- **Blocks:** None directly (003-005 don't depend on it structurally), but pt-02 §11 sequences it first because it gates safety semantics.

### 012/003 — code-graph-edge-explanation-and-impact-uplift
- **Goal:** Add `reason`/`step` to edge metadata + display; enrich `blast_radius` with depth groups, risk levels, min-confidence filter, ambiguity candidates, structured failure-fallback.
- **Files:**
  - MODIFY `code_graph/lib/structural-indexer.ts:85-94` — extend metadata writer.
  - MODIFY `code_graph/handlers/query.ts:978-981, 862-909` — surface `reason`/`step`; extend `computeBlastRadius`.
  - MODIFY `code_graph/lib/code-graph-context.ts` — propagate enriched fields.
- **No schema change** (purely JSON metadata + query-output enrichment).
- **Effort:** M (4-6h)
- **Dependencies:** 001 license audit; 002 (for edge metadata propagation through phase runner if applicable).

### 012/004 — skill-advisor-affordance-evidence
- **Goal:** Wire tool/resource/MCP-resource affordances into existing `derived` + `graph-causal` lanes via a new affordance-normalizer (sanitizer + privacy preservation).
- **Files:**
  - NEW `skill_advisor/lib/affordance-normalizer.ts` — allowlist filter + privacy-preserving phrase stripping.
  - MODIFY `skill_advisor/scripts/skill_graph_compiler.py:43` — extend compile to accept affordances as derived inputs (NOT new entity_kinds).
  - MODIFY `skill_advisor/lib/scorer/lanes/derived.ts:9-43` — accept affordance evidence.
  - MODIFY `skill_advisor/lib/scorer/lanes/graph-causal.ts:20-81` — weight affordance edges into existing relation set.
- **Hard rules:** No new scoring lane. No new compiler entity_kinds. Sanitization mandatory.
- **Effort:** M (4-6h)
- **Dependencies:** 001 license audit; runs in parallel with 003 + 005.

### 012/005 — memory-causal-trust-display
- **Goal:** Display-only trust badges (confidence / extraction_age / last_access_age / orphan / weight_history) on `MemoryResultEnvelope`. No schema change.
- **Files:**
  - MODIFY `formatters/search-results.ts` — add `trustBadges` to envelope.
  - MODIFY `lib/response/profile-formatters.ts` — propagate badges.
- **Reuse existing fields** in `lib/storage/causal-edges.ts:82-94` and `lib/search/causal-boost.ts:327-338` (`computeTraversalFreshnessFactor`).
- **Effort:** S-M (2-4h)
- **Dependencies:** 001 license audit; runs in parallel with 003 + 004.

### 012/006 — docs-and-catalogs-rollup
- **Goal:** Update umbrella docs after code sub-phases ship; consolidate per-packet feature_catalog + manual_testing_playbook entries (written inline by 002-005).
- **Per-packet entries (written by sub-phases 002-005 inline):**
  - `feature_catalog/03--discovery/` — detect_changes preflight
  - `feature_catalog/06--analysis/` — blast_radius uplift
  - `feature_catalog/11--scoring-and-calibration/` — affordance evidence
  - `feature_catalog/13--memory-quality-and-indexing/` — trust display
  - `feature_catalog/14--pipeline-architecture/` — phase-DAG runner
  - Same categories under `manual_testing_playbook/`
- **Umbrella rollup (this sub-phase):**
  - `/README.md` (root) — features section update
  - `.opencode/skill/system-spec-kit/SKILL.md` — capability matrix update
  - `.opencode/skill/system-spec-kit/README.md` — feature index
  - `.opencode/skill/system-spec-kit/mcp_server/README.md` — handler list (new `detect_changes`)
  - `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — verification steps
  - `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` — top-level index
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — top-level index
- **Effort:** M (3-4h, mostly DQI compliance via sk-doc skill)
- **Dependencies:** 002, 003, 004, 005 must ship first.

---

## 3. CRITICAL PATH

```
001 (S, 1-2h)
  ↓
002 (L, 8-12h)
  ↓
003 ∥ 004 ∥ 005 (max ~6h with parallelism)
  ↓
006 (M, 3-4h)

Total estimated: ~18-26h with parallelism, ~25-35h fully sequential.
```

---

## 4. ROLLBACK

Per pt-02 §12 risk plan. If any P0 risk fires, halt the phase and review:
- License contamination → revert any code touched by that sub-phase + redo via clean-room
- Unified graph collapse → revert storage/relation-vocabulary sharing, restore separate ownership

P1/P2 mitigations are sub-phase-local and documented in each sub-phase's `checklist.md`.

---

## 5. REFERENCES

- spec.md (this folder)
- pt-02 §11 (implementation roadmap), §12 (risk plan), §13 (ownership contracts)
- pt-01 synthesis (sibling cross-check input)
- merged-phase-map.md (parent 026 phase consolidation history)
