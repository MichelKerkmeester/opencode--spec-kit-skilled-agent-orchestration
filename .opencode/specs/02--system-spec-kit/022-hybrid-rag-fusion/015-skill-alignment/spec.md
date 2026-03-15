---
title: "Feature Specification: Skill Alignment — system-spec-kit"
description: "Research-backed Level 2 specification for aligning system-spec-kit documentation with the delivered 022-hybrid-rag-fusion program without changing MCP runtime behavior."
trigger_phrases: ["skill alignment", "015 alignment", "speckit skill update", "system skill guide update"]
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
| **Updated** | 2026-03-15 |
| **Branch** | `017-markovian-architectures` |
| **Parent** | `022-hybrid-rag-fusion` |
| **Complexity** | 48/70 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `system-spec-kit` documentation surface no longer cleanly matches the delivered state of the 022-hybrid-rag-fusion program. Scratch research for this phase identified stale metadata in the system skill guide, missing governance and campaign guidance across multiple reference files, and outdated assets that still describe a smaller pre-epic execution model.

This phase is currently a **research-complete, pre-implementation** documentation phase. Some related improvements have already landed elsewhere in the repo, so the main risk is now duplicating work or re-adding stale backlog items instead of targeting the gaps that remain open.

### Purpose

Produce an implementation-ready documentation spec that accurately tracks the **still-open** alignment work for `system-spec-kit`, preserves already-landed changes, and defines verification rules that use live repo truth instead of hand-maintained assumptions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Upgrade this phase to a Level 2 spec folder with anchors, checklist coverage, and valid local cross-references.
- Rewrite the backlog so it tracks only documentation gaps that remain open in the system skill guide, selected references, and selected assets.
- Record canonical-source rules for counts, flags, and verification commands so future implementation work does not rely on brittle grep shortcuts or stale prose.

### Out of Scope
- MCP server runtime code changes - this phase remains documentation-only.
- Command alignment work completed by `016-command-alignment` (32/32 tools, 7 commands).
- Agent alignment, README rewrites, and finalization work owned by `999-finalization`.
- Re-implementing documentation changes that are already present elsewhere in the repo.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-skill-alignment/spec.md` | Modify | Upgrade to Level 2 and rewrite scope/requirements around confirmed open gaps |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-skill-alignment/plan.md` | Modify | Replace the old implementation plan with a doc-refresh execution plan |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-skill-alignment/tasks.md` | Modify | Replace duplicate/stale tasks with an actionable open backlog |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-skill-alignment/checklist.md` | Create | Add Level 2 verification for this pre-implementation documentation phase |
| `../../../../skill/system-spec-kit/` | Future modify | Primary documentation alignment target for the system skill guide, metadata, routing, rules, and resource guidance |
| `.opencode/skill/system-spec-kit/references/**` | Future modify | Reference targets that still lag epic-scale behavior, rollout guidance, and verification patterns |
| `.opencode/skill/system-spec-kit/assets/**` | Future modify | Asset targets that still describe pre-epic complexity and dispatch patterns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Normalize this spec folder as a Level 2 pre-implementation phase | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` declare Level 2, include valid anchors, and use working local references from the `015-skill-alignment` folder |
| REQ-002 | Track only confirmed open documentation gaps | The rewritten backlog maps to scratch research and live repo inspection; already-landed items are removed or explicitly marked "do not re-implement" |
| REQ-003 | Preserve the documentation-only boundary | The spec states that runtime TypeScript, handler behavior, and command alignment are out of scope for this phase |
| REQ-004 | Define canonical source-of-truth rules for future implementation | Tool inventory points to `mcp_server/tool-schemas.ts`; runtime/documentation counts are verified from live files; verification commands avoid brittle `grep -c "name:"` shortcuts |
| REQ-005 | Make open skill-guide alignment work explicit | The spec retains open work for stale metadata, routing gaps, governance gaps, and shared-space/shared-memory layer treatment where the repo still lacks alignment |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Separate open work from already-landed work | The spec explicitly calls out repo changes that already landed, including recursive validation shortcuts, phase-aware template guidance, and nested child-path support |
| REQ-007 | Reframe the execution plan around future doc refresh work | `plan.md` uses five documentation phases: normalization, skill-guide refresh, references refresh, assets refresh, and verification/drift-proofing |
| REQ-008 | Rewrite the task backlog into a non-duplicative implementation list | `tasks.md` starts with spec-folder remediation, keeps only open alignment targets, and includes a guard task that forbids runtime behavior changes |
| REQ-009 | Add Level 2 verification tailored to this phase | `checklist.md` verifies structure, links, canonical-source usage, open-gap accuracy, and the docs-only boundary |

### Already-Landed Items (Do Not Re-Implement)

- Recursive validation shortcuts are already documented in `../../../../skill/system-spec-kit/references/workflows/quick_reference.md` and related template guidance.
- Phase-aware template guidance is already present in `../../../../skill/system-spec-kit/references/templates/level_specifications.md`.
- Nested child-path support is already present in `../../../../skill/system-spec-kit/references/structure/sub_folder_versioning.md`.
- Environment variable coverage is broadly current except for the missing runtime `SPECKIT_GRAPH_UNIFIED` entry and stale wording for `SPEC_KIT_ENABLE_CAUSAL`.
- Full 32-tool command documentation suite delivered by `016-command-alignment` (7 commands: context, save, manage, learn, continue, analyze, shared).

### Out-of-Scope Backlog Boundaries

- Do not queue runtime MCP handler or library edits in this spec.
- Do not fold `016-command-alignment` tasks into this phase.
- Do not invent new feature behavior to satisfy documentation drift; document existing behavior or mark gaps for later documentation work.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `015-skill-alignment` spec folder is clearly documented as a Level 2, draft, pre-implementation documentation phase.
- **SC-002**: The rewritten backlog reflects only still-open alignment work supported by scratch research and live repo inspection.
- **SC-003**: At least one canonical verification method is documented for tool counts, runtime flags, and stale-doc detection without relying on brittle grep counts.
- **SC-004**: Local cross-references in the spec folder resolve from the `015-skill-alignment` directory and do not reference sibling or child files with broken relative paths.
- **SC-005**: The spec explicitly protects already-landed documentation work from being re-added as future implementation scope.

### Acceptance Scenarios

- **AS-001**: A future implementer can distinguish open alignment work from already-landed documentation work without rereading the scratch research.
- **AS-002**: A reviewer can trace tool-count guidance back to `tool-schemas.ts` instead of a brittle grep heuristic.
- **AS-003**: A reviewer can verify the docs-only boundary without inspecting runtime TypeScript diffs.
- **AS-004**: A validator can resolve all local references in the spec folder except for policy-required artifacts that are intentionally deferred.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Scratch research files in `./scratch/agent-01...agent-10` | Missing or stale findings would weaken the backlog rewrite | Keep the research files as the primary decision source and cross-check against live repo files before writing requirements |
| Dependency | Parent epic docs in `../spec.md` and `../implementation-summary.md` | Without parent context, open-vs-landed decisions drift | Use the parent epic as the authoritative delivery summary for 022 |
| Risk | Validation policy requires artifacts that are unusual for a draft docs-only phase | The spec folder can fail validation even when the backlog rewrite is correct | Resolve all validator issues that can be fixed in the spec folder now and document any policy tension honestly |
| Risk | Future implementer re-adds already-landed tasks | Wasted work and renewed drift | Keep explicit "already landed" notes in spec, plan, tasks, and checklist |
| Risk | Numeric claims drift again before implementation begins | Future backlog becomes stale quickly | Require canonical-source verification during future implementation and final review |
| Dependency | `016-command-alignment` | Completed | Command documentation coverage is fully delivered (32/32 tools, 7 commands); only SKILL.md metadata/routing/rules remain as 015 scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. IMPLEMENTATION NOTES

- This phase is **ready for implementation planning**, not implementation completion.
- Future implementation should prefer live-file verification over transcribing counts from prior notes.
- Shared-space and shared-memory tools must be documented either within the 7-layer architecture or as explicitly out-of-band utilities; the spec should not leave them ambiguous.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Documentation Quality
- **NFR-D01**: Cross-references in the spec folder must resolve from the local folder without relying on repository-root assumptions.
- **NFR-D02**: The backlog must be traceable to research files or live repo evidence for every retained open item.

### Verification Safety
- **NFR-V01**: Verification commands must use canonical-source methods that do not overcount JSON schema properties or unrelated matches.
- **NFR-V02**: The spec must not require future implementers to infer whether a task is already landed or still open.

### Change Control
- **NFR-C01**: This phase must not authorize runtime TypeScript behavior changes.
- **NFR-C02**: This phase must remain compatible with the current `system-spec-kit` validation and drift-check workflows.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Documentation Boundaries
- Already-landed repo change: keep it out of the open backlog and label it as preserved behavior.
- Research/live repo conflict: prefer live repo truth and record the research note as stale context rather than turning it into a task.
- Validator policy conflict: fix what is fixable in-folder, then document the remaining policy issue instead of fabricating implementation progress.

### Verification Edge Cases
- Tool-count verification: count actual tool definition entries, not every `name:` token in schema files.
- Runtime flag coverage: distinguish runtime flags from Hydra roadmap metadata flags when documenting env vars.
- Shared-space tool routing: do not assume the current 7-layer writeup already covers shared-memory utilities unless the live docs explicitly do so.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Touches four spec files now and prepares a later 30+ file documentation refresh |
| Risk | 12/25 | Incorrect backlog curation could duplicate already-landed work or hide genuine gaps |
| Research | 18/20 | Ten scratch research files plus live repo inspection must be reconciled accurately |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
