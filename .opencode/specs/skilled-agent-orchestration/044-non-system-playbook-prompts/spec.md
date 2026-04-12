<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Non-System Playbook Prompt Modernization [skilled-agent-orchestration/044-non-system-playbook-prompts/spec]"
description: "Modernize prompt wording and scenario-contract prose across five non-system-spec-kit manual testing playbook targets without changing runtime code, scenario inventories, or folder topology."
trigger_phrases:
  - "non-system playbook prompts"
  - "manual testing playbook prompt modernization"
  - "playbook prompt rewrite"
  - "rewrite manual testing prompts"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/044-non-system-playbook-prompts"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Created Level 2 planning packet for non-system manual testing playbook prompt modernization"
    next_safe_action: "Implement the prompt rewrite only inside the five scoped documentation targets"
    blockers: []
    key_files:
      - ".opencode/skill/mcp-coco-index/manual_testing_playbook/"
      - ".opencode/skill/sk-improve-agent/manual_testing_playbook/"
      - ".opencode/skill/sk-deep-research/manual_testing_playbook/"
      - ".opencode/skill/sk-deep-review/manual_testing_playbook/"
      - ".opencode/skill/sk-doc/assets/documentation/testing_playbook/"
    session_dedup:
      fingerprint: "sha256:044-non-system-playbook-prompts"
      session_id: "044-non-system-playbook-prompts"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Use the existing skilled-agent-orchestration track because the work spans multiple skills and documentation surfaces."
      - "Use Level 2 because the rewrite touches 126 markdown files but does not introduce architecture, security, or runtime behavior changes."
---
# Feature Specification: Non-System Playbook Prompt Modernization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-12 |
| **Branch** | `044-non-system-playbook-prompts` |
| **Spec Folder** | `.opencode/specs/skilled-agent-orchestration/044-non-system-playbook-prompts/` |
| **Scope Size** | 126 markdown scenario/template files across 5 targets |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repository now contains several non-system-spec-kit manual testing playbook packages that were authored at different maturity levels. Newer playbooks, especially the sk-deep-review and sk-deep-research packets, use richer orchestrator-led prompt framing, clearer expected process language, and stronger user-facing outcome statements, while older packages such as mcp-coco-index and sk-improve-agent still contain shorter prompt blocks, uneven terminology, or older scenario-contract phrasing.

Because the rewrite touches 126 documentation files across five targets, repository rules require a scoped spec packet before any content edits begin. The work is broad enough to need verification planning, but it remains low-risk because it changes documentation prompts and scenario wording only, not runtime code or feature behavior.

### Purpose

Define the exact Level 2 rewrite scope for modernizing prompt and scenario-contract prose across the five non-system playbook targets while preserving existing file inventories, scenario IDs, folder structures, and runtime truth.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite prompt wording and related scenario-contract prose inside the five named playbook targets only.
- Modernize older playbook files toward the newer orchestrator-led contract already visible in current non-system playbooks and the `sk-doc` testing playbook templates.
- Align root playbooks, per-scenario files, and the `sk-doc` template assets so they describe prompts, expected execution process, evidence, and user-visible outcomes in a consistent style.
- Preserve current scenario counts, IDs, category folders, filenames, and command sequences unless a wording-only clarification is required for consistency.
- Keep the rewrite strictly documentation-only and strictly outside `system-spec-kit` playbook surfaces.

### Out of Scope

- Any edits under `.opencode/skill/system-spec-kit/manual_testing_playbook/`.
- Creating, deleting, or renumbering scenarios or category folders.
- Changing runtime code, command YAML, agent definitions, or skill behavior.
- Expanding the work into feature-catalog creation, validator changes, or playbook architecture redesign.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/` | Modify | Modernize root and per-scenario prompt wording across 24 playbook files |
| `.opencode/skill/sk-improve-agent/manual_testing_playbook/` | Modify | Modernize root and per-scenario prompt wording across 32 playbook files |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/` | Modify | Harmonize existing rich prompt language across 35 files without changing scenario inventory |
| `.opencode/skill/sk-deep-review/manual_testing_playbook/` | Modify | Harmonize existing rich prompt language across 33 files without changing scenario inventory |
| `.opencode/skill/sk-doc/assets/documentation/testing_playbook/` | Modify | Update `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md` and `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md` to define the modernization target contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep the rewrite strictly inside the five requested documentation targets | No non-spec files outside the five listed playbook/template paths are modified |
| REQ-002 | Modernize all scoped prompt surfaces, not just the templates | All 126 markdown files in the five scoped targets are reviewed and updated where needed to match the approved modernization contract |
| REQ-003 | Preserve published playbook topology | Existing root filenames, scenario IDs, category folders, and file counts remain stable after the rewrite |
| REQ-004 | Use one shared modernization contract across targets | Root playbooks, scenario files, and `sk-doc` template assets consistently describe realistic user request, exact prompt, expected execution process, expected signals, evidence, and user-facing outcome |
| REQ-005 | Keep the rewrite documentation-truthful | Prompt updates may clarify wording, but they must not invent unshipped behavior or contradict live source docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Bring older playbooks up to the newer orchestrator-led wording standard | Older compact prompt formats in `mcp-coco-index` and `sk-improve-agent` are upgraded to the richer style already used in newer playbooks where appropriate |
| REQ-007 | Keep `sk-doc` templates in sync with the final rewrite style | `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md` and `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md` reflect the same prompt contract used in the rewritten target files |
| REQ-008 | Preserve destructive and sensitive scenario safeguards | Any scenario involving reset, rebuild, or mutation keeps its current isolation or recovery warnings after wording updates |
| REQ-009 | Make verification practical for a 126-file documentation batch | The implementation plan defines file-count parity checks, prompt-contract sweeps, and spot-check rules instead of relying on ad hoc review |

### Acceptance Scenarios

1. **Given** the five scoped targets, **when** the rewrite is complete, **then** every root playbook, scenario file, and testing-playbook template uses consistent prompt-contract wording without expanding scope into runtime files.
2. **Given** older playbooks with shorter prompt sections, **when** they are modernized, **then** they describe the realistic request, orchestrator prompt, expected process, and user-visible outcome with the same clarity as the newer playbooks.
3. **Given** newer playbooks that already use richer wording, **when** they are touched, **then** their prompts are harmonized rather than restructured or renumbered.
4. **Given** the `sk-doc` template assets, **when** future playbooks are created from them, **then** they inherit the same modernization contract used in this rewrite batch.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 126 scoped markdown files have been reviewed, and any stale or under-specified prompt wording has been modernized without changing scenario inventory.
- **SC-002**: Operators can read any rewritten scenario file and find the realistic request, orchestrator-facing prompt, expected process, expected signals, evidence expectations, and user-facing outcome in a consistent structure.
- **SC-003**: Root playbooks and `sk-doc` testing playbook templates describe the same prompt modernization standard, so future playbooks do not regress to the older style.
- **SC-004**: No file outside the five requested documentation targets is modified by the implementation workstream.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing playbook files across the five scoped targets | The rewrite can only be accurate if current docs are treated as source material first | Inventory all 126 files, then batch by target before editing |
| Dependency | `.opencode/skill/sk-doc/assets/documentation/testing_playbook/` templates | If templates drift from rewritten files, future packets will reintroduce inconsistency | Update the two template assets as part of the same batch |
| Risk | Volume-based drift across 126 files | Medium | Use target-by-target workstreams plus prompt-contract sweeps after each batch |
| Risk | Scope creep into structure or runtime behavior | Medium | Freeze IDs, folders, counts, and non-doc surfaces as hard boundaries |
| Risk | Prompt wording accidentally changes behavioral meaning | Medium | Anchor edits to live source docs and keep deterministic command sequences intact |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A reviewer should be able to identify the scenario prompt contract in any rewritten file within one section scan.
- **NFR-P02**: Root playbooks should summarize modernization coverage without requiring the reader to diff per-scenario files manually.

### Security
- **NFR-S01**: Prompt rewrites must not weaken destructive-action cautions, recovery notes, or isolation guidance already present in the playbooks.
- **NFR-S02**: Wording updates must not introduce commands, paths, or capabilities that are not already documented in live sources.

### Reliability
- **NFR-R01**: Prompt terminology stays consistent across the five targets and the two `sk-doc` template assets.
- **NFR-R02**: Scenario IDs, filenames, and category directories remain unchanged so external references stay valid.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Older files use more compact prompt sections than newer files; the rewrite must modernize wording without forcing one identical prose length everywhere.
- Template assets in `sk-doc` are generic by design; they must describe the modernization contract without becoming skill-specific.
- Some playbooks already follow the newer style closely; those files may need only surgical wording alignment, not wholesale rewriting.

### Error Scenarios
- A scenario may reference destructive commands such as reset or rebuild flows; modernization must preserve recovery expectations and warnings.
- Root playbooks and scenario files may use slightly different filename casing conventions; the rewrite must preserve the current canonical path used by each target.
- If live source docs disagree with existing prompt wording, the rewrite must favor current source truth rather than older playbook language.

### State Transitions
- Partial modernization in one target can create cross-target inconsistency; each target batch should finish root plus scenario files together.
- Template updates made before scenario rewrites can create temporary drift; verification must re-check templates after all target batches complete.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | 126 markdown files across 5 documentation targets, including reusable templates |
| Risk | 7/25 | Low runtime risk because the work is documentation-only, but wording drift risk is real |
| Research | 14/20 | Requires comparing older and newer playbook styles and preserving live-source truth |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The requested targets, rewrite-only scope, and documentation-only boundary are defined.
<!-- /ANCHOR:questions -->

---
