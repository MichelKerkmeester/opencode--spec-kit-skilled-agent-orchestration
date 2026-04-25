---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2"
title: "Feature Specification: Graph Impact and Affordance Uplift (012)"
description: "Implement the converged pt-01 + pt-02 GitNexus research recommendations across Code Graph, Memory causal graph, and Skill Advisor — selective adaptation only, clean-room, with strict ownership boundaries."
trigger_phrases:
  - "graph impact and affordance uplift"
  - "010-graph-impact-and-affordance-uplift"
  - "gitnexus adoption"
  - "phase-dag runner"
  - "detect_changes preflight"
  - "blast radius uplift"
  - "skill advisor affordance"
  - "memory trust display"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift"
    last_updated_at: "2026-04-25T11:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialized Level 3 phase with 6 sub-phases derived from converged pt-01 + pt-02 research"
    next_safe_action: "Begin sub-phase 001 (clean-room license audit) — P0 governance gate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:012-gitnexus-adoption-2026-04-25"
      session_id: "scaffold-session-012"
      parent_session_id: "dr-2026-04-25T08-56-40Z-44122292"
    completion_pct: 5
    open_questions:
      - "Diff-hunk parser library choice for sub-phase 002 detect_changes implementation"
      - "Display placement for Memory trust badges (search results vs context envelope vs status)"
    answered_questions: []
---
# Feature Specification: Graph Impact and Affordance Uplift (012)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Implement the converged pt-01 + pt-02 GitNexus research recommendations as a 6-sub-phase Level 3 implementation packet. pt-02 cross-checked pt-01 with an independent executor (cli-codex gpt-5.5 high fast) and reached the same core conclusions: GitNexus is **architectural evidence**, not a source transplant; Code Graph / Memory / Skill Advisor stay **separately owned**; route/tool/shape work is **deferred** until Public has the substrate.

**Key Decisions**: Clean-room adaptation is mandatory (P0 license gate); sub-phase 002 (Code Graph foundation) sequences first; sub-phases 003-005 run in parallel; pt-02 Packet 5 (route/tool/shape contract safety) is explicitly out of scope.

**Critical Dependencies**: Sub-phase 001 (license audit) blocks all code work. Sub-phase 002 (phase runner + detect_changes) blocks any feature that builds on changed-impact preflight semantics.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft — scaffold complete, sub-phases pending |
| **Created** | 2026-04-25 |
| **Branch** | `010-graph-impact-and-affordance-uplift` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Public's Code Graph, Memory causal graph, and Skill Advisor systems each carry known gaps that the 007-git-nexus deep-research effort surfaced concretely (pt-01 + pt-02 syntheses). Without an implementation phase, those gaps stay open: scan flow has no phase-DAG discipline, edge metadata lacks `reason`/`step` explanation fields, blast_radius is file-only, Memory trust signals aren't surfaced, and skill-advisor scoring lanes don't ingest tool/resource affordance evidence.

### Purpose
Land the converged research recommendations as four code sub-phases (002-005) plus a license-audit gate (001) and a docs rollup (006). Strict ownership boundaries preserved. No source transplant from GitNexus.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 001 — Clean-room license audit (P0 governance gate)
- 002 — Code Graph phase-DAG runner + read-only `detect_changes` preflight
- 003 — Code Graph edge `reason`/`step` display + blast_radius uplift (risk levels, min-confidence filter, ambiguity candidates, structured failure-fallback)
- 004 — Skill Advisor affordance evidence (tool/resource → existing `derived` + `graph-causal` lanes via sanitizer)
- 005 — Memory causal trust display (badges only; no schema change)
- 006 — Docs + catalog rollup (root README, skill SKILL.md/README, mcp_server README/INSTALL_GUIDE; per-packet feature_catalog + manual_testing_playbook entries written by 002-005 inline)

### Out of Scope
- pt-02 Packet 5 (route/tool/shape contract safety) — deferred; Public lacks route/tool/consumer extraction substrate
- Mutating `rename` tool — explicitly rejected by pt-02 due to preview/apply semantic divergence
- Unified graph collapse — explicitly rejected; each owner retains separate truth units
- Memory↔CodeGraph evidence bridge — pt-01 proposed it; pt-02 narrows to "later, separate design"
- Storage migrations (SQLite schema unchanged across all sub-phases)

### Files to Change
See per-sub-phase `spec.md` for detailed change lists. Summary:

| Sub-phase | Files Touched (Summary) |
|-----------|-------------------------|
| 001 | `decision-record.md` (license ADR); no code changes |
| 002 | NEW: `code_graph/lib/phase-runner.ts`, `code_graph/lib/diff-parser.ts`, `code_graph/handlers/detect-changes.ts`. MODIFY: `structural-indexer.ts`, `handlers/index.ts` |
| 003 | MODIFY: `structural-indexer.ts`, `handlers/query.ts`, `code-graph-context.ts` |
| 004 | NEW: `skill_advisor/lib/affordance-normalizer.ts`. MODIFY: `skill_graph_compiler.py`, `scorer/lanes/derived.ts`, `scorer/lanes/graph-causal.ts` |
| 005 | MODIFY: `formatters/search-results.ts`, `lib/response/profile-formatters.ts` (display only; no schema change) |
| 006 | MODIFY: root `/README.md`, `system-spec-kit/SKILL.md`, `system-spec-kit/README.md`, `mcp_server/README.md`, `mcp_server/INSTALL_GUIDE.md`, feature_catalog/manual_testing_playbook indexes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### User Stories

**US-1 (Code Graph reviewer):** As a reviewer evaluating a PR, I want `detect_changes` to take the PR diff and tell me which symbols are affected — and to refuse to answer when the graph is stale — so I never act on false-safe "no impact" results.

**US-2 (Code Graph reviewer):** As a reviewer running `code_graph_query` or `blast_radius`, I want each edge's `confidence`, `reason`, and `step` displayed so I can audit why the graph believes a relation exists.

**US-3 (Code Graph reviewer):** As a reviewer running `blast_radius`, I want depth-grouped affected symbols with risk levels, min-confidence filtering, and ambiguity candidates so I can scope changes safely.

**US-4 (Skill Advisor user):** As a user with custom MCP tools/resources, I want their descriptions to inform skill routing — sanitized through an allowlist so prompt-stuffing can't bypass routing — without leaking my raw phrases in the recommendation payload.

**US-5 (Memory consumer):** As a consumer of `memory_search`, I want each result tagged with trust badges (confidence, age, orphan status, weight history) so I can judge whether a causal claim is fresh.

**US-6 (Phase orchestrator):** As an orchestrator running scans, I want each scan stage declared as a phase with explicit inputs/outputs and a topological runner so failures are localized and dependencies are auditable.

### Technical Requirements

| Owner | Requirement |
|-------|-------------|
| 001 governance | License audit decision recorded in `decision-record.md` ADR; clean-room rule articulated; explicit allow-list of pattern-only adaptations vs forbidden source forms. |
| 002 Code Graph | Phase runner accepts typed phases with `inputs[]`, `outputs[]`; rejects duplicate names, missing deps, cycles. `detect_changes` MUST return `status: blocked` when readiness requires full scan. |
| 003 Code Graph | Edge metadata gains `reason` + `step` JSON fields (no SQLite migration). `blast_radius` output includes `riskLevel`, `minConfidence` parameter, `ambiguityCandidates`, structured `failureFallback`. |
| 004 Skill Advisor | Affordance-normalizer sanitizes tool/resource text via allowlist before evidence reaches scorer. No new entity_kinds. No new scoring lane. Recommendation payload preserves existing privacy guarantees. |
| 005 Memory | Trust badges read from existing `causal-edges.ts:82-94` columns. NO schema change. NO new relation types. NO storage of code/process/tool facts. |
| 006 docs | Each owner-touching sub-phase writes its own per-packet entries; this sub-phase rolls up umbrella docs. sk-doc DQI scoring required. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:architecture -->
## 5. ARCHITECTURE

### Ownership Boundary Contract (from pt-02 §13)

| Owner | Exclusive | Shared (translated only) |
|-------|-----------|--------------------------|
| Code Graph | Structural code facts; file/node/edge persistence; readiness blocking; route/tool extraction (future) | Confidence, reason, freshness, next-action summaries |
| Memory | Causal lineage (six relation types); strength, evidence, anchors, age | May DISPLAY Code Graph-derived trust/freshness; MUST NOT store code relation types |
| Skill Advisor | Routing evidence in 5 scoring lanes | May CONSUME normalized tool/resource affordances as derived/graph-causal evidence |
| Cross-owner governance | License posture; clean-room rule; unified-graph-collapse prevention | Shared evidence summaries only after owner-local translation |

### Sequencing

```
012/001 license-audit (P0) blocks ALL
        ↓
012/002 phase-runner + detect_changes (gates safety semantics)
        ↓
   ┌────────┬────────┬────────┐
   ↓        ↓        ↓
012/003   012/004   012/005
  edge      skill     memory
(parallel)
        ↓
012/006 docs-and-catalogs-rollup (after 002-005)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:risks -->
## 6. RISKS

| Risk | Severity | Mitigation |
|------|----------|------------|
| License contamination from direct GitNexus reuse | **P0** | 001 audit; clean-room rule; rollback any copied source/schema/logic |
| Unified graph collapse | **P0** | Architectural separation enforced; share evidence as translated summaries only |
| False-safe `detect_changes` on stale graph | P1 | Hard rule: status=blocked when full scan required; never `"no affected symbols"` |
| Route/tool overreach (false precision) | P1 | Packet 5 stays deferred; sub-phase 003 doesn't ship route/shape fields |
| Prompt-stuffing via tool descriptions | P1 | Affordance-normalizer allowlist; sanitization mandatory before scorer |
| Memory becoming duplicate code index | P1 | Hard rule: trust display reads existing causal columns only; no new entity types |
| Hidden default group selection | P2 | Surface ambiguity candidates instead of silent default-picking |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:references -->
## 7. REFERENCES

- pt-01 synthesis: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-01/research.md`
- pt-02 synthesis: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/research.md`
- pt-02 cross-check section: `research/007-git-nexus-pt-02/research.md` §15
- pt-02 implementation roadmap: `research/007-git-nexus-pt-02/research.md` §11 (5 packets, packet 5 deferred → out of scope here)
- pt-02 ownership contracts: `research/007-git-nexus-pt-02/research.md` §13
- pt-02 risk plan: `research/007-git-nexus-pt-02/research.md` §12
- Plan file: `/Users/michelkerkmeester/.claude/plans/create-new-phase-with-zazzy-lighthouse.md`
- Phase consolidation map: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/merged-phase-map.md`
<!-- /ANCHOR:references -->
