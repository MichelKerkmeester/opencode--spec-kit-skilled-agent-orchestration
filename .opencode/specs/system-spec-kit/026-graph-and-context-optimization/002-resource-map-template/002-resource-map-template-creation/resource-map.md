---
title: "Resource Map: Resource Map Template [002-resource-map-template-creation]"
description: "Every file path analyzed, created, updated, or removed while delivering the new cross-cutting resource-map template for system-spec-kit."
trigger_phrases:
  - "026/012 resource map"
  - "resource map ledger"
  - "files touched 012"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase resource map"
    next_safe_action: "Finalize packet"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.0 -->

---

## Summary

- **Total references**: 32
- **By category**: READMEs=6, Documents=3, Commands=0, Agents=0, Skills=16, Specs=13, Scripts=1, Tests=0, Config=3, Meta=1
- **Missing on disk**: 0
- **Scope**: all files created, updated, or analyzed while delivering phase 012 (the new cross-cutting `resource-map.md` template plus its discovery-surface wiring).
- **Generated**: 2026-04-24T00:00:00+02:00

> Action vocabulary: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated`.
> Status: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).

---

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/templates/README.md` | Updated | OK | Structure table row + Workflow Notes + Related. |
| `.opencode/skill/system-spec-kit/templates/level_1/README.md` | Updated | OK | Optional Files subsection. |
| `.opencode/skill/system-spec-kit/templates/level_2/README.md` | Updated | OK | Optional Files subsection. |
| `.opencode/skill/system-spec-kit/templates/level_3/README.md` | Updated | OK | Optional Files subsection. |
| `.opencode/skill/system-spec-kit/templates/level_3+/README.md` | Updated | OK | Optional Files subsection. |
| `.opencode/skill/system-spec-kit/README.md` | Updated | OK | Template architecture section. |

---

## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Updated | OK | Cross-cutting row + per-level Optional Files mentions. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/path-references-audit` (md) | Analyzed | OK | Reference shape (categories + table columns) inspiration. |
| `.opencode/skill/system-spec-kit/templates/addendum/phase/phase-child-header.md` | Analyzed | OK | Consulted for the phase-child metadata rows. |

---

## 3. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Created | OK | The new template itself (~130 lines, 10 categories, author instructions). |
| `.opencode/skill/system-spec-kit/SKILL.md` | Updated | OK | Distributed-governance block + cross-cutting mention in §3/§9 + Rule 9 list. |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` | Created | OK | New feature catalog entry (neighbor of `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/23-tool-routing-enforcement.md`). |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` | Created | OK | New playbook scenario (neighbor of `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/267-tool-routing-enforcement.md`). |
| `.opencode/skill/system-spec-kit/templates/core/` | Analyzed | OK | Template architecture source-of-truth for CORE/ADDENDUM composition. |
| `.opencode/skill/system-spec-kit/templates/addendum/` | Analyzed | OK | Confirmed L2/L3/L3+ addendum structure before writing level READMEs. |
| `.opencode/skill/system-spec-kit/templates/handover.md` | Analyzed | OK | File-location precedent (cross-cutting peer at templates root). |
| `.opencode/skill/system-spec-kit/templates/research.md` | Analyzed | OK | File-location precedent. |
| `.opencode/skill/system-spec-kit/templates/debug-delegation.md` | Analyzed | OK | File-location precedent. |
| `.opencode/skill/system-spec-kit/templates/level_1/spec.md` | Analyzed | OK | L1 template shape reference. |
| `.opencode/skill/system-spec-kit/templates/level_2/spec.md` | Analyzed | OK | L2 template shape used to conform this packet's spec.md. |
| `.opencode/skill/system-spec-kit/templates/level_2/plan.md` | Analyzed | OK | L2 plan shape used to conform this packet's plan.md. |
| `.opencode/skill/system-spec-kit/templates/level_2/tasks.md` | Analyzed | OK | L2 tasks shape used to conform this packet's tasks.md. |
| `.opencode/skill/system-spec-kit/templates/level_2/checklist.md` | Analyzed | OK | L2 checklist shape used to conform this packet's checklist.md. |
| `.opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md` | Analyzed | OK | Impl summary shape reference. |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Analyzed | OK | Level-detection + section-count logic consulted to diagnose validator output. |

---

## 4. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/spec.md` | Created | OK | Level 2 spec (metadata + problem + scope + requirements + L2 NFR/edge-cases/complexity). |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/plan.md` | Created | OK | Level 2 plan with SUMMARY, QUALITY GATES, ARCHITECTURE, PHASES, TESTING, DEPENDENCIES, ROLLBACK, L2 addenda. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/tasks.md` | Created | OK | Level 2 tasks (Phase 1/2/3 + Completion + Cross-References). |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/checklist.md` | Created | OK | Level 2 checklist (Protocol, Pre-Impl, Code Quality, Testing, Security, Docs, File Org, Summary). |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/implementation-summary.md` | Created | OK | Impl summary with Files Changed + Verification + Key Decisions + Limitations. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/resource-map.md` | Created | OK | This file. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/description.json` | Created | OK | Packet description metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/graph-metadata.json` | Created | OK | Packet graph metadata (schema_version 1, derived trigger_phrases + key_files + entities). |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/spec.md` | Analyzed | OK | Prior-phase format reference (Level 3 packet). |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/graph-metadata.json` | Analyzed | OK | Schema template for graph-metadata shape. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/plan.md` | Analyzed | OK | `_memory` frontmatter pattern. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/` | Analyzed | OK | Source of the path-references-audit artifact used as reference shape. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (parent spec folder) | Analyzed | OK | Confirmed existing phase inventory (001–011) and claimed number 012. |

---

## 5. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` | Updated | OK | Append `'resource-map.md'` to `SPEC_DOCUMENT_FILENAMES` so memory classification treats it as a canonical spec doc. |

---

## 6. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/description.json` | Created | OK | Listed above under Specs; appears here for completeness of config-like JSON. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/002-resource-map-template-creation/graph-metadata.json` | Created | OK | Listed above under Specs; appears here for completeness of config-like JSON. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/description.json` | Analyzed | OK | Parent packet metadata inspected; not yet updated with child 012 (parent-topology backfill deferred to P2). |

---

## 7. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `CLAUDE.md` | Updated | OK | Documentation Levels block mentions the new optional cross-cutting doc. |
