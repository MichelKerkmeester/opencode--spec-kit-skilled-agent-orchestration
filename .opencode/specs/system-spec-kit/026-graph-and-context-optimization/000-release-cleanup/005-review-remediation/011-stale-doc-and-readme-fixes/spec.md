---
title: "Spec: Stale Doc + README Fixes (Tier 1+2)"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Tier 1+2 remediation from 011 deep-review + README staleness audit: 12 stale doc/README updates surfaced by today's 022-028 + cross-track work. Pure documentation; no runtime change."
trigger_phrases:
  - "011-stale-doc-and-readme-fixes"
  - "tier 1 stale doc fixes"
  - "readme staleness remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes"
    last_updated_at: "2026-04-29T11:12:30Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Closed 12 stale doc/README findings (F-001/002/004/006 + README audit HIGH+MED)"
    next_safe_action: "Re-run README staleness audit to confirm 0 STALE-HIGH"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Stale Doc + README Fixes (Tier 1+2)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `005-review-remediation` |
| **Source** | 011 deep-review F-001/002/004/006 + README staleness audit (5 HIGH + 3 MEDIUM) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Today's 022-028 batch shipped runtime + skill-contract changes faster than packet continuity and adjacent READMEs caught up. Stale narrative in three flavors:

1. **Packet continuity drift**: the 023 implementation summary still describes TC-3 as `expected_fail`; the 025 tasks file still marks typecheck-blocked; the 028 spec continuity still says "Authored Level 1 spec" despite implementation complete.
2. **Code-adjacent README staleness from 026**: `.opencode/skill/system-spec-kit/mcp_server/core/README.md:40` and `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:79` still reference deleted readiness functions.
3. **Skill README staleness from 028**: `.opencode/skill/sk-deep-review/README.md` and `.opencode/skill/sk-deep-research/README.md` still document `review/{packet}/` first-run shape; `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:196` example shows pt-01 child layout before flat-first rule.
4. **Older drift surfaced by audit**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` rerank min count, `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` fallbackDecision, `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md` parser default, `.opencode/skill/sk-doc/README.md` doctype list.

### Purpose

Update 12 documents to match committed code. Pure documentation; no runtime change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

12 file edits across packet docs + READMEs. See Files to Change below.

### Out of Scope

- Runtime/test code changes
- Older spec-folder template debt (covered by 013-skdoc-legacy-template-debt-cleanup)
- Broad-suite vitest investigation (covered by 012-broad-suite-vitest-honesty)
- Touching today's 9 packet's plan.md/tasks.md/checklist.md beyond the 3 stale-continuity edits listed below

### Files to Change

#### Packet continuity (4 files)

| File | Line(s) | Action |
|------|---------|--------|
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam/implementation-summary.md` | 64, 113 | Update TC-3 narrative - passing not expected_fail; cite that 025 closed the wiring |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/tasks.md` | 83 | Remove typecheck-blocked annotation; final batch state typechecks cleanly |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes/spec.md` | 17 (continuity) | Update `recent_action` to "Implementation complete + shipped"; bump completion_pct to 100; refresh last_updated_at |
| `.opencode/skill/system-spec-kit/references/structure/folder_structure.md` | ~196 | Update child-phase layout example to flat-first; pt-NN explicitly shown as second-run conditional |

#### Code-adjacent READMEs (5 files)

| File | Line(s) | Action |
|------|---------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/core/README.md` | 40 | Drop the embedding-readiness ownership line; describe current DB rebind/cache responsibilities only |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md` | 79 | Replace `setEmbeddingModelReady` mention with current lazy embedding/provider startup path |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` | 117-118 | Stage 3 = conditional default-on rerank; min 4 candidates; mention `rerankGateDecision` metadata |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` | 141-148 | Add `fallbackDecision` to blocked-path + status-degraded field tables |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md` | 12 | `structural-indexer.ts` = Tree-sitter WASM default + regex fallback (not "regex-only, tree-sitter planned"); also list newer modules `ensure-ready.ts`, `query-result-adapter.ts`, `utils/workspace-path.ts` |

#### Skill READMEs (3 files)

| File | Line(s) | Action |
|------|---------|--------|
| `.opencode/skill/sk-deep-review/README.md` | 216-220 | Rewrite runtime-state layout around `{artifact_dir}` flat-first; pt-NN explicitly conditional |
| `.opencode/skill/sk-deep-research/README.md` | 73, 134-136 | Same flat-first treatment |
| `.opencode/skill/sk-doc/README.md` | 80, 149 | Add `playbook_feature` doctype to Document Quality mode list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 packet-continuity edits land. | Stated lines no longer carry stale narrative; current state reflected. |
| REQ-002 | All 5 code-adjacent README edits land. | Removed identifiers (e.g., `setEmbeddingModelReady`) no longer appear in READMEs; new contracts (Tree-sitter default, fallbackDecision, MIN_RESULTS_FOR_RERANK=4) documented. |
| REQ-003 | All 3 skill README edits land. | Flat-first language present; pt-NN conditional; playbook_feature doctype listed. |
| REQ-004 | Strict validator green on this packet. | `validate.sh <packet> --strict` exits 0. |
| REQ-005 | Re-run README staleness audit (or equivalent grep) returns 0 STALE-HIGH on the listed files. | Verification step. |

### Acceptance Scenarios

1. **Given** a reader opens `.opencode/skill/system-spec-kit/mcp_server/core/README.md`, **when** they read the state-ownership section, **then** they see no mention of `embeddingModelReady` / `isEmbeddingModelReady` / `setEmbeddingModelReady` / `waitForEmbeddingModel`.
2. **Given** a reader opens `.opencode/skill/sk-deep-review/README.md`, **when** they read the runtime-state layout, **then** the first-run case is flat at `{spec_folder}/review/` and pt-NN is explicitly conditional on prior content.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 12 files updated with cited replacements.
- **SC-002**: Strict validator green on packet.
- **SC-003**: Manual grep on 5 critical identifiers (`setEmbeddingModelReady`, `isEmbeddingModelReady`, `embeddingModelReady` (in README context), `pt-01` (in flat-first contexts), `regex-only`) returns 0 in the targeted files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | A README has additional staleness beyond the cited lines | Read the surrounding section; update adjacent paragraphs if they reference removed entities |
| Risk | folder_structure.md example fix conflicts with 013 (legacy template debt) | 013 explicitly skips files in this packet's scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should the 5 STALE-MEDIUM README findings be deferred or included? **Default**: include all 8 findings (5 HIGH + 3 MED) to retire all README audit findings in one pass.
<!-- /ANCHOR:questions -->
