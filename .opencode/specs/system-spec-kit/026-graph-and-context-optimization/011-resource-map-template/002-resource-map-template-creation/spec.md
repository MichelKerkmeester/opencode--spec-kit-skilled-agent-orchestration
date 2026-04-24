---
title: "F [system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/002-resource-map-template-creation/spec]"
description: "Introduce a lean, level-agnostic resource-map template that catalogs every file path touched by a packet (created, updated, analyzed, removed) grouped by category, and wire it into the system-spec-kit template architecture across all documentation levels."
trigger_phrases:
  - "026/012 resource map template"
  - "resource map template"
  - "path catalog template"
  - "files touched summary"
  - "lean path ledger"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/002-resource-map-template-creation"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase 012 and wired the new cross-cutting template into every discovery surface"
    next_safe_action: "Rerun validate.sh --strict"
    blockers: []
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "The template file lives at the templates/ root (peer of handover, research, debug-delegation) because it is cross-cutting and any-level."
      - "The template stays optional at every level (no validate.sh hard block) so it remains additive."
      - "Categories mirror the 005/009 path-references-audit shape so existing audit muscle memory carries over."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Resource Map Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 012 of 012 |
| **Predecessor** | 011-index-scope-and-constitutional-tier-invariants |
| **Successor** | None |
| **Handoff Criteria** | Template file exists; every level README + main templates README lists it; SKILL.md references it; references/templates/level_specifications.md adds a cross-cutting row; spec-doc-paths.ts includes the new filename; feature_catalog and manual_testing_playbook have matching entries; validate.sh --strict passes. |
<!-- /ANCHOR:metadata -->

### Phase Context

This is Phase 012 of the 026-graph-and-context-optimization specification. It introduces a reusable, level-agnostic template that catalogs every file path a packet touched, grouped by resource category, and wires it into the discovery surfaces so operators find it next to the other cross-cutting templates.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Reviewers, auditors, and successor phases have no quick way to answer "what files did this packet touch" without reading implementation-summary end-to-end or diffing git. A prior one-off artifact (005/path-references-audit) proved the value of a flat, categorized path ledger but was not promoted into a reusable template.

### Purpose
Promote the path-references-audit shape to a first-class optional template discoverable alongside handover and debug-delegation. Make memory classification and every level README aware of it so operators can copy it into any packet and fill the path rows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New template file at `.opencode/skill/system-spec-kit/templates/resource-map.md`.
- Documentation surface updates across the templates README, every level README, SKILL.md, the main skill README, references/templates/level_specifications.md, feature_catalog, manual_testing_playbook, and CLAUDE.md.
- One runtime constant update: `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` appends the new filename to SPEC_DOCUMENT_FILENAMES.
- Level 2 packet docs for this phase (including description.json and graph-metadata.json).

### Out of Scope
- Making the new template mandatory at any level (stays optional everywhere).
- Hard-blocking enforcement in validate.sh (awareness only).
- Backfilling existing spec folders with the new template.
- Tooling to auto-generate the catalog from git diff or file scans (future work).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Create | The template itself. |
| `.opencode/skill/system-spec-kit/templates/README.md` | Modify | Structure table row + Workflow Notes + Related. |
| `.opencode/skill/system-spec-kit/templates/level_1/README.md` | Modify | Optional Files subsection. |
| `.opencode/skill/system-spec-kit/templates/level_2/README.md` | Modify | Optional Files subsection. |
| `.opencode/skill/system-spec-kit/templates/level_3/README.md` | Modify | Optional Files subsection. |
| `.opencode/skill/system-spec-kit/templates/level_3+/README.md` | Modify | Optional Files subsection. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Canonical spec docs + cross-cutting templates + distributed governance mentions. |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Template architecture section. |
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Modify | Cross-cutting Templates row + per-level Optional Files. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` | Modify | Append to SPEC_DOCUMENT_FILENAMES. |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` | Create | Feature catalog entry. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` | Create | Playbook scenario. |
| `CLAUDE.md` | Modify | Documentation Levels cross-cutting note. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/002-resource-map-template-creation/*` | Create | Packet docs. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template file exists at the templates root with proper frontmatter, SPECKIT_TEMPLATE_SOURCE marker, and ten category sections. | File present; frontmatter includes title, description, trigger_phrases, importance_tier, contextType; body contains READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta. |
| REQ-002 | Every level README (1, 2, 3, 3+) and the main templates README list the template as an optional cross-cutting file. | All five README files mention the template with a one-line description. |
| REQ-003 | The MCP spec-doc classifier recognizes the new filename as a canonical spec document. | SPEC_DOCUMENT_FILENAMES Set in spec-doc-paths.ts includes the new filename. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | SKILL.md and the skill README reference the template so it is discoverable via skill reads. | SKILL.md and the root skill README cite the file path and purpose. |
| REQ-005 | references/templates/level_specifications.md documents the template under Cross-cutting Templates and under each Level N Optional Files block. | New row appears in the cross-cutting section; each Level N section names the template under Optional Files. |
| REQ-006 | Feature catalog and manual testing playbook each gain an entry so discovery surfaces stay aligned. | Files 25-resource-map-template.md and 270-resource-map-template.md exist and follow neighbor format. |
| REQ-007 | CLAUDE.md notes the template as an optional cross-cutting doc. | Documentation Levels block mentions the template. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can copy the template into any packet (Level 1 through 3+) and fill path rows grouped by category.
- **SC-002**: validate.sh --strict on this packet exits 0.
- **SC-003**: Memory save on a spec folder that contains the new file classifies it as a spec doc and indexes it accordingly.
- **SC-004**: Every discovery surface (level READMEs, SKILL.md, references, feature catalog, manual testing playbook, CLAUDE.md) mentions the template consistently.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Docs drift between level READMEs and the main templates README after this lands. | Medium | Use consistent wording across the five READMEs in the surface-update pass; re-grep each surface for the new filename. |
| Risk | SPEC_DOCUMENT_FILENAMES change unintentionally expands indexed content. | Low | Scope the change to one literal string append; run typecheck. |
| Dependency | MCP server typecheck must still pass after the constant edit. | Low | Run npm run typecheck inside mcp_server after the edit. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Adding one string to a Set lookup is O(1); no runtime impact.

### Security
- **NFR-S01**: No new input surfaces; no authentication or data-handling changes.

### Reliability
- **NFR-R01**: The template is content-only; adding it does not change validate.sh block behavior at any level.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Phase children inside a packet may each carry their own copy; memory indexing must treat each as an independent spec doc.
- A packet may generate one aggregated parent-level copy instead of per-child; both shapes are allowed and should be stated in the Scope line.

### Error Scenarios
- Operator copies the template but leaves placeholder rows: validate.sh does not fail (template is optional); check-placeholders.sh flags placeholder tokens.
- Typecheck fails after the constant edit: revert the spec-doc-paths.ts change and re-evaluate; no other file depends on the new entry.

### State Transitions
- Packet in-progress with partial path table: valid; the template is optional and can be expanded incrementally.
- Packet completed without filling the template: valid; absence is not a completion blocker.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 1 new template + ~12 surface updates + 1 constant edit. |
| Risk | 6/25 | Content-only plus one additive constant; rollback is trivial. |
| Research | 4/20 | Prior 005/009 path-references-audit artifact provides the shape baseline. |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None blocking. A P2 decision on whether scripts/ should ship an optional resource-map-emit.sh auto-generator is deferred.
<!-- /ANCHOR:questions -->
