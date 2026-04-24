---
title: "Implementation Plan: Resource Map Template"
description: "Step-by-step plan for authoring templates/resource-map.md and wiring it through level READMEs, SKILL.md, references, feature_catalog, manual_testing_playbook, spec-doc-paths.ts, and CLAUDE.md."
trigger_phrases:
  - "026/012 resource-map plan"
  - "resource-map.md plan"
  - "template wiring plan"
importance_tier: "normal"
contextType: "plan"
---
# Implementation Plan: Resource Map Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

## 1. APPROACH

Work in two passes:

1. **Core authoring pass** (already complete when this plan is read): scaffold `templates/resource-map.md`, Level-2 packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`), and `description.json` / `graph-metadata.json`.
2. **Surface-wiring pass**: dispatch a single `cli-codex gpt-5.4 high fast` agent (with `cli-copilot` fallback) to apply coordinated edits across every discovery surface so the new template is consistently referenced. Surfaces are editorially dependent on each other — a single coordinated pass keeps wording aligned.

Keep the template **optional at every level**. No `validate.sh` hard blocks. No backfill into existing packets.

---

## 2. WORK BREAKDOWN

### Pass 1 — Core authoring (this packet, inline)

| Step | File | Action |
|------|------|--------|
| 1 | `templates/resource-map.md` | Write template with frontmatter + 10 categories + author notes. |
| 2 | `specs/.../012-resource-map-template/spec.md` | Author Level 2 spec (done above). |
| 3 | `specs/.../012-resource-map-template/plan.md` | This document. |
| 4 | `specs/.../012-resource-map-template/tasks.md` | Ordered task list. |
| 5 | `specs/.../012-resource-map-template/checklist.md` | P0/P1/P2 verification. |
| 6 | `specs/.../012-resource-map-template/description.json` | Spec-folder description metadata. |
| 7 | `specs/.../012-resource-map-template/graph-metadata.json` | Graph metadata for packet discovery. |

### Pass 2 — Surface wiring (dispatched to cli-codex)

| Step | File | Edit |
|------|------|------|
| 8 | `templates/README.md` | Add `resource-map.md` row in Structure table; mention in Workflow Notes and Related. |
| 9 | `templates/level_1/README.md` | Add `## OPTIONAL FILES` subsection listing `resource-map.md` (alongside any future optional files). |
| 10 | `templates/level_2/README.md` | Same pattern. |
| 11 | `templates/level_3/README.md` | Same pattern. |
| 12 | `templates/level_3+/README.md` | Same pattern. |
| 13 | `.opencode/skill/system-spec-kit/SKILL.md` | §3 Canonical Spec Docs: add optional row; §9 / distributed governance: list among cross-cutting templates as optional. |
| 14 | `.opencode/skill/system-spec-kit/README.md` | Add `resource-map.md` to the template architecture section where `handover.md` and `research.md` are listed. |
| 15 | `references/templates/level_specifications.md` | §9 Cross-cutting Templates: add row with Template/Purpose/When-to-use/Created-by columns; each LEVEL N section: add `resource-map.md (optional)` under Optional Files. |
| 16 | `mcp_server/lib/config/spec-doc-paths.ts` | Append `'resource-map.md'` to `SPEC_DOCUMENT_FILENAMES` set. |
| 17 | `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` | Create — mirror format of neighbor `23-tool-routing-enforcement.md`. |
| 18 | `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` | Create — mirror format of neighbor `267-tool-routing-enforcement.md`. |
| 19 | `CLAUDE.md` | Documentation Levels section: mention `resource-map.md` as optional cross-cutting doc. |

### Pass 3 — Verification

| Step | Action |
|------|--------|
| 20 | Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-resource-map-template --strict`. |
| 21 | Run `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` to confirm the spec-doc-paths edit type-checks. |
| 22 | Grep discovery surfaces for `resource-map.md` — expect matches in all 15 target files. |
| 23 | Finalize `implementation-summary.md` with Files Changed table + Verification table. |
| 24 | Refresh `description.json` / `graph-metadata.json` for parent 026 topology and this packet via the usual backfill path. |

---

## 3. TEST STRATEGY

- **Validator pass**: `validate.sh --strict` exit code 0 on this packet.
- **Typecheck pass**: `mcp_server` `npm run typecheck` passes with the new `SPEC_DOCUMENT_FILENAMES` entry.
- **Grep audit**: every discovery surface listed in Files to Change contains at least one `resource-map.md` reference.
- **Smoke read**: open the template in isolation — frontmatter parses, 10 categories present, no broken anchors.

---

## 4. ROLLBACK

Edits are content-only plus one TypeScript constant append. Rollback path:

1. `git restore .opencode/skill/system-spec-kit/templates/` — undoes the template and README edits.
2. `git restore .opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` — undoes the constant change.
3. `git restore CLAUDE.md` and the references/feature_catalog/manual_testing_playbook edits.
4. `rm -rf .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-resource-map-template` — removes the phase folder.

No data migration, no schema change, no runtime state affected.

---

## 5. DEPENDENCIES

- `cli-codex` skill for the surface-wiring pass (primary).
- `cli-copilot` skill as fallback if codex dispatch fails or returns partial edits.
- Existing `validate.sh` — unchanged.
- Existing `generate-context.js` — unchanged.

---

## 6. SEQUENCING NOTES

- Pass 2 surfaces can be edited in any order, but the agent dispatched should apply them atomically (one PR-style commit) to avoid intermediate docs referencing `resource-map.md` without the file existing. The template itself was written first so any discovery reference has a real target from the first edit.
- `spec-doc-paths.ts` can be edited at any point after the template file exists; classification only matters at save/index time, so the order relative to README edits is not load-bearing.
