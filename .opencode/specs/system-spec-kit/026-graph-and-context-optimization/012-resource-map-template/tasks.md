---
title: "Tasks: Resource Map Template"
description: "Ordered task list for authoring templates/resource-map.md and wiring it into every discovery surface."
trigger_phrases:
  - "026/012 tasks"
  - "resource-map tasks"
importance_tier: "normal"
contextType: "tasks"
---
# Tasks: Resource Map Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## US-001: Reviewer Blast-Radius Scan (P0)

- **T-001**: Author `.opencode/skill/system-spec-kit/templates/resource-map.md` with frontmatter, SPECKIT_TEMPLATE_SOURCE marker, summary block, and 10 category sections. [Dep: none] [Est: S]
- **T-002**: Append `'resource-map.md'` to `SPEC_DOCUMENT_FILENAMES` in `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`. [Dep: T-001] [Est: XS]
- **T-003**: Run `npm run typecheck` inside `mcp_server/` to verify the constant edit. [Dep: T-002] [Est: XS]

---

## US-002: Successor-Phase Handoff (P1)

- **T-010**: Update `.opencode/skill/system-spec-kit/templates/README.md` — add `resource-map.md` row to Structure table; mention in Workflow Notes and Related. [Dep: T-001] [Est: S]
- **T-011**: Update `.opencode/skill/system-spec-kit/templates/level_1/README.md` — add Optional Files subsection naming `resource-map.md`. [Dep: T-001] [Est: XS]
- **T-012**: Update `.opencode/skill/system-spec-kit/templates/level_2/README.md` — same pattern. [Dep: T-001] [Est: XS]
- **T-013**: Update `.opencode/skill/system-spec-kit/templates/level_3/README.md` — same pattern. [Dep: T-001] [Est: XS]
- **T-014**: Update `.opencode/skill/system-spec-kit/templates/level_3+/README.md` — same pattern. [Dep: T-001] [Est: XS]
- **T-015**: Update `.opencode/skill/system-spec-kit/SKILL.md` — reference in §3 Canonical Spec Docs / §9 Cross-cutting templates and the distributed-governance note as optional. [Dep: T-001] [Est: S]
- **T-016**: Update `.opencode/skill/system-spec-kit/README.md` — list `resource-map.md` in the template architecture section. [Dep: T-001] [Est: XS]
- **T-017**: Update `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` — add row in §9 and per-level Optional Files mentions. [Dep: T-001] [Est: S]
- **T-018**: Create `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md`. [Dep: T-001] [Est: S]
- **T-019**: Create `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md`. [Dep: T-018] [Est: S]
- **T-020**: Update `CLAUDE.md` — note `resource-map.md` in the Documentation Levels section. [Dep: T-001] [Est: XS]

---

## US-003: Verification & Packaging (P1/P2)

- **T-030**: Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-resource-map-template --strict` and capture output. [Dep: T-001..T-020] [Est: XS]
- **T-031**: `grep -rn "resource-map.md"` across the 15 target files — confirm every discovery surface cites the template. [Dep: T-010..T-020] [Est: XS]
- **T-032**: Backfill `description.json` + `graph-metadata.json` for the parent `026-graph-and-context-optimization` to include the new phase child. [Dep: T-001..T-020] [Est: XS]
- **T-033**: Author `implementation-summary.md` with Files Changed + Verification tables. [Dep: T-030..T-032] [Est: S]
- **T-034** (P2): Drop `../changelog/012-resource-map-template.md` using the packet-local changelog template. [Dep: T-033] [Est: XS]

---

## DEPENDENCIES

```
T-001 ──► T-002 ──► T-003
  │
  ├──► T-010..T-017 (README + SKILL + references + CLAUDE.md)
  ├──► T-018 ──► T-019
  └──► T-020
            │
            ▼
         T-030 ─┬─ T-031
                └─ T-032 ──► T-033 ──► T-034
```

## ESTIMATES

- XS: <30 min edit
- S: 30 min – 2 hr
- M: 2 – 4 hr (none in this packet)
- L: > 4 hr (none in this packet)

Total: roughly 1 day of focused work (most time in the coordinated surface-wiring pass).
