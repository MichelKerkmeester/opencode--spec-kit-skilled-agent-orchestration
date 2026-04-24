---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
title: "Feature Specification: Resource Map Template"
description: "Introduce a lean, level-agnostic resource-map.md template that catalogs every file path touched by a packet (created, updated, analyzed, removed) grouped by category, and wire it into the system-spec-kit template architecture across all documentation levels."
trigger_phrases:
  - "026/012 resource map template"
  - "resource-map.md"
  - "path catalog template"
  - "files touched summary"
  - "lean path ledger"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-resource-map-template"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase 012 with core resource-map.md template and Level 2 spec docs"
    next_safe_action: "Dispatch cli-codex gpt-5.4 high fast to wire the template into level READMEs, templates/README.md, SKILL.md, references, feature_catalog, manual_testing_playbook, and spec-doc-paths.ts"
    blockers: []
    completion_pct: 25
    open_questions: []
    answered_questions:
      - "resource-map.md lives at templates/ root (peer of handover.md, research.md, debug-delegation.md) because it is cross-cutting and any-level."
      - "Template is optional-but-recommended — not a hard-blocker on validate.sh — to stay additive across all levels."
      - "Categories mirror the 005/009 path-references-audit shape so existing audit muscle memory carries over."
---
# Feature Specification: Resource Map Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

Every packet already has an `implementation-summary.md` that narrates what was done and why, but nothing in the current template architecture gives reviewers, auditors, or successor phases a **quick, scannable ledger of every file path touched**. The `005-release-cleanup-playbooks/path-references-audit.md` produced exactly that shape for one packet — a categorized table of paths with action and status — and proved the value of having a flat, paths-only surface. This phase promotes that shape into a reusable template that any level (1 → 3+) can opt into.

---

## EXECUTIVE SUMMARY

This packet adds `resource-map.md` to `.opencode/skill/system-spec-kit/templates/` as a cross-cutting, any-level template. It is **optional but recommended**, lives next to `handover.md` / `research.md` / `debug-delegation.md`, and is supported (but not mandated) by `validate.sh`. The template is wired into every level README, the main templates README, SKILL.md, the references guide, the feature catalog, and the manual testing playbook so that operators discover it at the same time they discover the other cross-cutting templates.

**Key Decisions**: keep `resource-map.md` optional (no hard block in `validate.sh`); store it at `templates/` root (not under `level_N/`); categorize by resource type (READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta) to match the `005/009` audit baseline.

**Critical Dependencies**: no runtime code changes beyond adding `resource-map.md` to `SPEC_DOCUMENT_FILENAMES` in `mcp_server/lib/config/spec-doc-paths.ts` so memory discovery and save-path classification recognize it as a canonical spec doc.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 012 of 012 |
| **Predecessor** | 011-index-scope-and-constitutional-tier-invariants |
| **Successor** | None |
| **Handoff Criteria** | `templates/resource-map.md` exists; every level README + main templates README lists it; SKILL.md §3 and §9 reference it; `references/templates/level_specifications.md` §9 adds a row; `spec-doc-paths.ts` includes `resource-map.md` in `SPEC_DOCUMENT_FILENAMES`; feature_catalog + manual_testing_playbook have matching entries; `validate.sh --strict` on this packet passes. |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-24 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

### Phase Context

This is **Phase 012** of the `026-graph-and-context-optimization` specification.

**Scope Boundary**: template file + documentation surface updates + one TypeScript constant update (`SPEC_DOCUMENT_FILENAMES`). No validation-blocker changes, no runtime behavior changes.

**Dependencies**:
- `005-release-cleanup-playbooks/path-references-audit.md` — reference shape for categories and table format.
- `templates/handover.md`, `templates/research.md`, `templates/debug-delegation.md` — existing peer cross-cutting templates that establish the file location precedent.

**Deliverables**:
- `.opencode/skill/system-spec-kit/templates/resource-map.md` — the template itself.
- Surface updates across `templates/` READMEs, `SKILL.md`, main `README.md`, `references/templates/level_specifications.md`, `feature_catalog/22--context-preservation-and-code-graph/`, `manual_testing_playbook/22--context-preservation-and-code-graph/`, `mcp_server/lib/config/spec-doc-paths.ts`, and `CLAUDE.md` doc-level table.

**Changelog**: refresh `../changelog/012-resource-map-template.md` on close.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Reviewers, auditors, and successor phases have no quick way to answer "what files did this packet touch?" without reading `implementation-summary.md` end-to-end or diffing git. The `005/path-references-audit.md` artifact demonstrated the value of a flat, categorized path ledger — but it was a one-off audit, not a reusable template, so other packets can't easily produce the same shape.

### Purpose

Promote the path-references-audit shape to a first-class template. Make it discoverable alongside `handover.md` and `debug-delegation.md`, wire it into every level README so the option surfaces at intake time, and teach the memory system to recognize it as a canonical spec doc so it indexes and retrieves correctly.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New template file: `.opencode/skill/system-spec-kit/templates/resource-map.md`.
- Documentation surface updates across `templates/` (main README, every `level_N/README.md`), `SKILL.md`, main `README.md`, `references/templates/level_specifications.md`, `feature_catalog/`, `manual_testing_playbook/`, and `CLAUDE.md`.
- One runtime constant update: add `'resource-map.md'` to `SPEC_DOCUMENT_FILENAMES` in `mcp_server/lib/config/spec-doc-paths.ts` so memory classification recognizes it.
- Level 2 packet docs for this phase plus `description.json` + `graph-metadata.json`.

### Out of Scope

- Making `resource-map.md` mandatory at any level (stays optional).
- Hard-blocking enforcement in `validate.sh` (awareness only).
- Backfilling `resource-map.md` into existing spec folders.
- Tooling to auto-generate `resource-map.md` from git diff or file scans (future work).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Create | The template itself. |
| `.opencode/skill/system-spec-kit/templates/README.md` | Modify | Add to Structure table; mention in Workflow Notes and Related. |
| `.opencode/skill/system-spec-kit/templates/level_1/README.md` | Modify | Add optional `resource-map.md` under a new "Optional Files" subsection. |
| `.opencode/skill/system-spec-kit/templates/level_2/README.md` | Modify | Same pattern. |
| `.opencode/skill/system-spec-kit/templates/level_3/README.md` | Modify | Same pattern. |
| `.opencode/skill/system-spec-kit/templates/level_3+/README.md` | Modify | Same pattern. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Reference resource-map.md in §3 Canonical Spec Docs / §9 Cross-cutting templates; include in distributed governance note as optional. |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Reference in the template architecture section. |
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Modify | Add a row under §9 Cross-cutting templates; add per-level "Optional Files" mentions. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` | Modify | Append `'resource-map.md'` to `SPEC_DOCUMENT_FILENAMES`. |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` | Create | New feature catalog entry. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` | Create | New playbook scenario. |
| `CLAUDE.md` | Modify | Mention resource-map.md as an optional cross-cutting doc in the Documentation Levels section. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-resource-map-template/*` | Create | Packet docs: spec.md, plan.md, tasks.md, checklist.md, description.json, graph-metadata.json. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `resource-map.md` template exists at `templates/` root with proper frontmatter, SPECKIT_TEMPLATE_SOURCE marker, and category structure matching the `005/path-references-audit` shape. | File present; frontmatter includes `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`; contains 10 category sections (READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta). |
| REQ-002 | Every level README (1, 2, 3, 3+) and the main templates README list `resource-map.md` as an optional cross-cutting template. | All 5 README files mention the template with a one-line description. |
| REQ-003 | `mcp_server/lib/config/spec-doc-paths.ts` recognizes `resource-map.md` as a canonical spec document. | `SPEC_DOCUMENT_FILENAMES` set includes `'resource-map.md'`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `SKILL.md` and the main `README.md` reference the template so it is discoverable via skill reads. | `SKILL.md` §3 / §9 and README reference the file path and purpose. |
| REQ-005 | `references/templates/level_specifications.md` documents the template in §9 Cross-cutting Templates and adds per-level "Optional Files" mentions. | A new row appears in §9; each `LEVEL N` section mentions `resource-map.md` under Optional Files. |
| REQ-006 | Feature catalog and manual testing playbook each gain an entry so discovery surfaces stay in sync. | `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` and `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` exist and follow the neighbor-entry format. |
| REQ-007 | `CLAUDE.md` notes `resource-map.md` as an optional cross-cutting doc. | The Documentation Levels block mentions the template. |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Phase-010 changelog folder carries a packet-local changelog for `012-resource-map-template`. | `../changelog/012-resource-map-template.md` exists or is deferred with a note in `implementation-summary.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator can copy `templates/resource-map.md` into any packet (levels 1–3+) and fill it in with path rows grouped by category.
- **SC-002**: `validate.sh --strict` on this packet passes without warnings or errors.
- **SC-003**: A memory save on a spec folder containing `resource-map.md` classifies it as a spec doc (not a generic markdown file) and indexes it accordingly.
- **SC-004**: Every discovery surface (level READMEs, SKILL.md, references, feature catalog, manual testing playbook, CLAUDE.md) mentions the template consistently.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Docs drift between level READMEs and the main templates README after this land. | Medium | Use consistent wording across the 5 READMEs in the surface-update pass; include a P1 checklist item that re-grep's each surface for `resource-map.md`. |
| Risk | `SPEC_DOCUMENT_FILENAMES` change unintentionally expands what gets indexed. | Low | Scope the change to a single literal string append; cover with the existing spec-doc classification tests if present. |
| Dependency | `mcp_server` typecheck must still pass after the constant edit. | Low | Run `npm run typecheck` inside `mcp_server/` after the edit. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable impact expected — adding one string to a Set lookup is O(1).

### Security
- **NFR-S01**: No new input surfaces; no security impact.

### Reliability
- **NFR-R01**: Template is content-only; adding it does not change validate.sh block behavior at any level.

---

## 8. EDGE CASES

### Data Boundaries
- Phase children inside a packet may each carry their own `resource-map.md`; memory indexing must treat each as an independent spec doc just like `implementation-summary.md`.
- A packet may choose to generate one aggregated parent-level `resource-map.md` instead of per-child; both shapes are allowed.

### Error Scenarios
- If an operator copies the template but leaves placeholder rows, `validate.sh` does not fail (it is optional) — `check-placeholders.sh` should flag the `[path]` / `[note]` tokens when run.

---

## 9. USER STORIES

### US-001: Reviewer Blast-Radius Scan (Priority: P0)

**As a** reviewer, **I want** a flat, categorized list of every file path a packet touched, **so that** I can size the change quickly without reading the full implementation summary.

**Acceptance Criteria**:
1. Given a packet that filled `resource-map.md`, when I open the file, then I see category sections with per-path rows stating Action and Status.
2. Given a packet that omitted `resource-map.md`, when I open `implementation-summary.md`, then nothing blocks me — the file remains optional.

---

### US-002: Successor-Phase Handoff (Priority: P1)

**As a** successor-phase operator, **I want** to inherit the predecessor's resource map, **so that** I know which paths are already claimed and which are clean.

**Acceptance Criteria**:
1. Given a parent packet with phase children, when each child drops a `resource-map.md`, then I can walk `../NNN-phase/resource-map.md` for each predecessor.
2. Given a shared path appearing in two phase resource maps, when I read both, then I can tell from the Action column which phase created vs modified it.

---

## 10. OPEN QUESTIONS

- None blocking. `P2` decision on whether `scripts/` should ship an optional `resource-map-emit.sh` (auto-populate from `git diff`) is deferred — the template itself is the minimum viable delivery.
<!-- /ANCHOR:questions -->
