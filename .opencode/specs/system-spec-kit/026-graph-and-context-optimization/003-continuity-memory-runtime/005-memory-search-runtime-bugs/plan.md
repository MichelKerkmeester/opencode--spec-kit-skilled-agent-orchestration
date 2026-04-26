---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: /memory:search Runtime Remediation [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs/plan]"
description: "Root-cause clusters and remediation strategy for /memory:search runtime bugs catalogued in spec.md. Findings-only packet; this plan briefs the follow-up remediation packet."
trigger_phrases:
  - "memory search remediation plan"
  - "intent classifier root cause"
  - "truncation wrapper repair"
  - "rendering vocabulary enforcement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs"
    last_updated_at: "2026-04-26T14:33:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored remediation plan with 7 root-cause clusters"
    next_safe_action: "Hand off to remediation packet via tasks.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 50
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: /memory:search Runtime Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server), Bash (validators), Markdown (command spec) |
| **Framework** | Spec Kit Memory MCP server, OpenCode runtime |
| **Storage** | SQLite (memory_index, causal_edges) |
| **Testing** | Vitest, custom probe scripts under `scripts/tests/` |

### Overview

`spec.md` catalogs 17 distinct defects across 4 P0, 7 P1, and 6 P2 buckets observed in `/memory:search`. Many share underlying root causes; this plan groups them into 7 clusters so a follow-up remediation packet can address each cluster independently and re-verify against the same probes captured in spec §8. This packet itself is findings-only — implementation is deferred.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 17 defects mapped to REQ-001..017 in spec.md
- [x] Live MCP probe evidence captured verbatim
- [x] Each REQ has a falsifiable acceptance criterion
- [x] Defects grouped into root-cause clusters (Cluster 1-7 in §3 below)

### Definition of Done (this packet)
- [x] spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json present
- [x] All placeholders filled (no `[NAME]` or `[YYYY-MM-DD]` left)
- [ ] `validate.sh --strict` passes against this folder
- [ ] Memory indexer surfaces this packet via `memory_search`

### Definition of Done (follow-up remediation packet)
- [ ] Each Cluster 1-7 addressed by a discrete code change
- [ ] Re-running spec §8 probes shows acceptance criteria pass
- [ ] Regression tests added for P0 fixes (REQ-001, REQ-002, REQ-003, REQ-004)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Findings-first remediation: catalog → cluster → sequence → execute. This packet performs the first three steps; the follow-up packet executes step four.

### Root-Cause Clusters

- **Cluster 1 — Truncation Wrapper (P0)** — REQ-002. `memory_context` budget enforcement drops `data.content` to `count:0,results:[]` while reporting `returnedResultCount > 0`. Token usage measured at 2% of budget when truncation fires. Suspect: per-result token estimation grossly inflated, OR wrapper unconditionally stub-replaces content when `truncated=true`. Change surface: `mcp_server/.../memory_context.ts` budget enforcement layer.

- **Cluster 2 — Intent Classifier Drift (P0/P1)** — REQ-001, REQ-004, REQ-016. `meta.intent.type = "fix_bug"` (confidence 0.098) returned for "Semantic Search" instead of documented `understand` fallback. Same response also carries `data.queryIntentRouting.queryIntent = "semantic"` (confidence 0.8) — two classifiers, no resolution policy. Change surface: intent detection logic + threshold gate.

- **Cluster 3 — Output Rendering Vocabulary (P0)** — REQ-003. Spec §4A Step 4b mandates "Trigger-matched spec-doc records" / "Constitutional rules" wording; assistant emitted forbidden "Auto-triggered memories" phrase. Change surface: server-side renderer OR stronger spec enforcement with literal forbidden-phrase list.

- **Cluster 4 — Causal-Stats Output Hygiene (P1)** — REQ-005, REQ-006, REQ-013. `causal-stats` emits 3 of 6 documented relation types (zero-omission), labels `health: "healthy"` while `meetsTarget: false`, no remediation hint when target missed. Change surface: `memory_causal_stats` serializer.

- **Cluster 5 — State Hygiene (P1)** — REQ-009, REQ-011, REQ-015. Default ephemeral session lifecycle defeats `enableDedup`; "Context quality is degraded" hint emitted unconditionally; trigger/constitutional channels not deduped. Change surface: command harness session-id threading + server hint emitter guard.

- **Cluster 6 — Folder Discovery + Channel Health (P1/P2)** — REQ-008, REQ-012, REQ-017. Folder-discovery binds on weak signal ("Semantic Search" → `skilled-agent-orchestration/023-sk-deep-research-creation`); CocoIndex daemon failure is silent; "code graph" vs "causal graph" naming collides. Change surface: similarity threshold + startup health check + naming disambiguation.

- **Cluster 7 — Quality Fallback + Edge Growth (P1/P2)** — REQ-007, REQ-010, REQ-014. `QUALITY=gap` flag is informational only; spec §1 promises 3-tier FTS fallback that never activates. Causal-graph edge growth dominated by autonomous `supersedes`-only backfill (+344 in 15 min, `caused`/`supports` unchanged). AskUserQuestion custom-answer routing undocumented. Change surface: retrieval pipeline + backfill job + command spec.

### Data Flow

`/memory:search "<query>"` → command harness parses args → routes to `memory_context` (retrieval mode) or analysis subcommand → wrapper assembles response with `meta` + `data` + `hints` → renderer formats output block → assistant emits to user. Defects span every stage of this pipeline; clusters above map to specific stages.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (this packet — DONE)
- [x] Reproduce defects via live MCP probes; capture evidence
- [x] Author `spec.md` with all 17 defects mapped to REQ-001..017
- [x] Author `plan.md` (this file) with 7 root-cause clusters
- [x] Author `tasks.md` decomposing remediation into work units
- [x] Author placeholder `implementation-summary.md`
- [x] Generate `description.json` and `graph-metadata.json`
- [ ] Pass `validate.sh --strict`

### Phase 2: Core Implementation (deferred to follow-up packet)
- [ ] **Phase 2A — P0 fixes:** Cluster 1 (truncation), Cluster 2 (intent classifier), Cluster 3 (rendering vocabulary)
- [ ] **Phase 2B — P1 hygiene:** Cluster 4 (causal-stats), Cluster 5 (state hygiene), Cluster 6 (folder discovery + channel health)
- [ ] **Phase 2C — P2 refinement:** Cluster 7 (quality fallback + edge growth + custom-answer routing)

### Phase 3: Verification (deferred to follow-up packet)
- [ ] Re-run spec §8 probes; confirm each acceptance criterion passes
- [ ] Add regression tests for P0 fixes
- [ ] Update spec §8 evidence with new probe outputs
- [ ] Mark spec.md REQ-001..017 acceptance criteria with evidence in checklist
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Probe-based regression | Each REQ has a probe in spec §8 — re-run after fix lands | Direct MCP tool calls (memory_context, memory_causal_stats) |
| Unit | Per-component behavior (intent classifier, budget enforcer, serializer) | Vitest |
| Integration | End-to-end `/memory:search` invocations against fixture queries | Vitest + MCP server harness |
| Stability corpus | 20 paraphrased queries that should classify to the same intent (REQ-016) | Vitest + golden-output fixtures |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sibling packet `004-memory-save-rewrite` (planner-first contract) | Internal | Green (complete) | None — already landed |
| Sibling packet `002-memory-quality-remediation` (backend repair history) | Internal | Green (complete) | None — informs root-cause analysis |
| `005-memory-indexer-invariants` parent-of-026 sibling | Internal | Yellow (active) | Coordinate to avoid double-touch on indexer code |
| CocoIndex daemon | External | Red (down — observed in conversation) | REQ-012 verification blocked until daemon runnable |
| Spec Kit Memory MCP server source | Internal | Green | All clusters touch this; ensure single PR-batching strategy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: This packet is documentation-only. No runtime changes land here, so no rollback is possible or needed. Rollback for the follow-up remediation packet should be defined in that packet's plan.md.
- **Procedure**: If findings prove incorrect after deeper investigation, update spec §4/§8 with corrected evidence and re-cluster in §3 above. The packet remains a versioned record even when individual findings are revised.
<!-- /ANCHOR:rollback -->
