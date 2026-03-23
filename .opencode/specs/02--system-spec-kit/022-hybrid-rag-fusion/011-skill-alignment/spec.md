---
title: "Feature Specification: Skill Alignment — system-spec-kit"
description: "Truth-reconciled Level 2 specification for closing the last system-spec-kit documentation gaps after current memory, command, and agent alignment landed."
trigger_phrases: ["skill alignment", "011 alignment", "system-spec-kit backlog", "system skill guide update"]
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Skill Alignment — system-spec-kit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-14 |
| **Updated** | 2026-03-21 |
| **Branch** | `main` |
| **Parent** | `022-hybrid-rag-fusion` |
| **Complexity** | 36/70 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../010-template-compliance-enforcement/spec.md |
| **Successor** | ../012-command-alignment/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `011-skill-alignment` pack preserved an older story that no longer matched the repository. It mixed a finished-state label with draft or pre-implementation language, cited superseded command-surface counts, and had to reconcile the final `system-spec-kit` skill/reference/asset drift after the live memory surface settled at **33 tools**, **6 commands**, with retrieval documented under `/memory:analyze`.

At the same time, most of the broad alignment backlog that 011 originally tracked had already landed elsewhere in the repo. The final work in scope for this phase was narrower and documentation-only:
- align the `system-spec-kit` skill guide with the live 33-tool, 6-command memory surface and its save-workflow/shared-memory governance framing
- align the memory references with shared-memory and shared-space governance expectations
- align the assets with campaign, shared-space, and cross-phase guidance

### Purpose

Record 011 as the completed documentation-only reconciliation for the remaining `system-spec-kit` drift, instead of re-stating already-landed command or agent alignment changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite this spec pack so all five canonical docs tell one documentation-only story grounded in current repo truth.
- Replace stale command-surface references with the live memory model: 33 tools, 6 commands, retrieval in `/memory:analyze`.
- Record the now-closed `system-spec-kit` documentation gaps that were still observable on disk at the start of this pass.
- Record the canonical verification method for future memory-surface count checks.

### Out of Scope
- Runtime TypeScript or MCP behavior changes.
- Re-opening `012-command-alignment`, agent-runtime alignment, or README/install-guide cleanup.
- Re-implementing documentation work that is already present in the repo.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/spec.md` | Modify | Truth-reconcile requirements, scope, and success criteria |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/plan.md` | Modify | Rebase the plan around the remaining documentation backlog |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/tasks.md` | Modify | Remove stale 32/7/context framing and preserve only the factual closeout scope |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/checklist.md` | Modify | Verify pack-level truth reconciliation and docs-only boundaries |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/implementation-summary.md` | Modify | Record what this reconciliation pass changed and how it was verified |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Memory-surface wording plus save-workflow/shared-memory governance framing |
| `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | Modify | Save-workflow routing plus shared-memory governance framing |
| `.opencode/skill/system-spec-kit/references/memory/embedding_resilience.md` | Modify | Embedding resilience wording plus shared-space governance framing |
| `.opencode/skill/system-spec-kit/references/config/environment_variables.md` | Modify | Graduated spec-011 flag documentation alignment |
| `.opencode/skill/system-spec-kit/references/memory/memory_system.md` | Modify | Tool reference table alignment for the live memory surface |
| `.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md` | Modify | Parallel dispatch campaign, shared-space, and cross-phase guidance |
| `.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md` | Modify | Complexity scoring guidance for campaign and shared-space scenarios |
| `.opencode/skill/system-spec-kit/assets/level_decision_matrix.md` | Modify | Level-selection guidance for campaign and shared-space scenarios |
| `.opencode/skill/system-spec-kit/assets/template_mapping.md` | Modify | Template-routing guidance for campaign, shared-space, and cross-phase use |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The 011 pack must tell one consistent story | No canonical file mixes completion language with draft or pre-implementation framing |
| REQ-002 | The 011 pack must use live memory-surface truth | The pack uses 33 tools, 6 commands, and `/memory:analyze` as retrieval home |
| REQ-003 | The 011 pack must remove stale command-alignment residue | No canonical file still presents obsolete command counts or the retired standalone retrieval command as current state |
| REQ-004 | The 011 pack must preserve the docs-only boundary | Scope and tasks stay limited to documentation work in `system-spec-kit` surfaces |
| REQ-005 | The closeout scope must be genuinely current | Only the real `system-spec-kit` documentation gaps that existed at the start of the pass are listed, and the packet records when they were resolved |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep the skill-guide closeout grounded in current repo truth | `SKILL.md` describes the live 33-tool, 6-command memory surface and adds save-workflow/shared-memory governance framing |
| REQ-007 | Keep the memory-reference closeout narrow and factual | `save_workflow.md` and `embedding_resilience.md` carry the required governance/shared-memory/shared-space framing |
| REQ-008 | Keep the asset closeout narrow and factual | The asset docs contain the required campaign/shared-space/cross-phase guidance |
| REQ-009 | Document a canonical verification method | The pack points future reviewers to `mcp_server/tool-schemas.ts` and `.opencode/command/memory/*.md` for live counts and ownership |

### Already-Landed Items (Do Not Re-Implement)

- `012-command-alignment` already aligned the memory command docs to the live 33-tool, 6-command surface.
- Retrieval ownership already lives in `/memory:analyze`; there is no standalone `context` command anymore.
- `SKILL.md` already contains expanded routing scaffolding such as `INTENT_SIGNALS`, `RESOURCE_MAP`, `/memory:analyze`, and `/memory:shared` command boosts.
- `environment_variables.md` already includes `SPECKIT_GRAPH_UNIFIED`.
- `trigger_config.md`, `epistemic_vectors.md`, and troubleshooting guidance already received the earlier reconciliation pass and should not be re-added as open backlog by this spec.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five canonical docs describe 011 as a completed documentation-only reconciliation record, not as a draft or pre-implementation phase.
- **SC-002**: No canonical file repeats the obsolete command-surface framing or retired standalone retrieval ownership model.
- **SC-003**: The pack records the live memory truth as 33 tools, 6 commands, and retrieval in `/memory:analyze`.
- **SC-004**: The packet records the last observable `system-spec-kit` gaps and their closeout: skill-guide memory-surface/save-governance wording, save-workflow/shared-memory framing, embedding/shared-space governance framing, and campaign/shared-space/cross-phase asset guidance.
- **SC-005**: Strict Spec Kit validation passes for the `011-skill-alignment` folder.

### Acceptance Scenarios

- **AS-001**: A reviewer can read any one of the five canonical docs and get the same story about current state and closeout scope.
- **AS-002**: A future implementer can identify the live memory-surface source of truth without relying on stale command counts.
- **AS-003**: A future implementer can distinguish already-landed documentation work from the still-open backlog without re-reading the earlier audit scratch files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Tool-count truth could drift again if reviewers rely on prose instead of the schema file | Treat `TOOL_DEFINITIONS` as the canonical tool inventory |
| Dependency | `.opencode/command/memory/analyze.md` and `.opencode/command/memory/README.txt` | Retrieval ownership can be misdocumented if future reviewers rely on older pack language | Point the pack to `/memory:analyze` and the live memory command directory |
| Risk | Closeout over-pruning | Genuine start-of-pass documentation gaps could disappear if already-landed items and recorded fixes are not separated cleanly | Keep the recorded start-of-pass gaps explicitly scoped to the skill, reference, and asset surfaces reconciled here |
| Risk | Numeric drift | The memory tool count may change again later | Document the canonical verification method and avoid hard-coding derived counts outside the pack narrative |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. CLOSEOUT NOTES

- This pack records completed documentation reconciliation work, not runtime implementation work.
- Future reviews should prefer live-file verification over restating counts from older specs.
- If the memory surface changes again, create a fresh reconciliation pass using the schema file and live command docs rather than reopening this packet with stale counts.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Documentation Quality
- **NFR-D01**: The five canonical docs must stay internally consistent about current state and closeout scope.
- **NFR-D02**: Future backlog items must be phrased as documentation updates, not runtime behavior changes.

### Verification Safety
- **NFR-V01**: Count verification must use `mcp_server/tool-schemas.ts`, not brittle string-count heuristics.
- **NFR-V02**: Command ownership verification must use `.opencode/command/memory/` and `/memory:analyze`, not superseded spec prose.

### Change Control
- **NFR-C01**: This phase does not authorize runtime TypeScript changes.
- **NFR-C02**: This phase must remain valid under strict Spec Kit validation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Documentation Boundaries
- Already-landed `system-spec-kit` doc improvements must stay out of the future backlog even if older 011 text still mentions them.
- If a live doc mixes current and stale memory-surface wording, the future backlog should target the wording drift rather than invent new runtime work.

### Verification Edge Cases
- Tool-count verification must ignore schema type definitions and count actual tool entries only.
- The old `context` command may still appear in historical notes; the pack must not treat those historical mentions as the live command model.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five spec-pack docs updated, no runtime docs changed in this phase |
| Risk | 9/25 | Main risk is reintroducing stale backlog items or obsolete command-surface claims |
| Research | 15/20 | Requires reconciliation against live tool schemas, command docs, and current `system-spec-kit` docs |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../010-template-compliance-enforcement/spec.md |
| **Next Phase** | ../012-command-alignment/spec.md |
