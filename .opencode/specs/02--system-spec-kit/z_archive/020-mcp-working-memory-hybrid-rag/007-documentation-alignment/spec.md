---
title: "Phase Package Spec: Documentation Alignment [007-documentation-alignment/spec]"
description: "Waves 1–3 shipped 5 new modules, 2 feature flags, and telemetry integration across the MCP server. The user-facing documentation was not updated. This phase aligns all READMEs, ..."
trigger_phrases:
  - "phase"
  - "package"
  - "spec"
  - "documentation"
  - "alignment"
  - "007"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->
# Phase Package Spec: Documentation Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-spec | v1.1 -->

---

<!-- ANCHOR:executive-summary -->
## Executive Summary

Waves 1–3 shipped 5 new modules, 2 feature flags, and telemetry integration across the MCP server. The user-facing documentation was not updated. This phase aligns all READMEs, SKILL.md, INSTALL_GUIDE, memory commands, and scripts documentation with the actual codebase.

Primary outcome: every document that references the MCP server's architecture, module inventory, feature flags, or search pipeline accurately reflects the post-wave implementation state.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:problem-statement -->
## Problem Statement

After completing post-research Waves 1–3 (C136-01 through C136-12), the documentation layer is stale:

- **Module counts are wrong**: README says 50 lib modules; reality is 63
- **5 new modules are invisible**: contracts, artifact-routing, adaptive-fusion, mutation-ledger, retrieval-telemetry are not mentioned in any user-facing doc
- **2 feature flags are undocumented**: `SPECKIT_ADAPTIVE_FUSION` and `SPECKIT_EXTENDED_TELEMETRY` exist in code but not in any documentation
- **3 new code folders have no READMEs**: `lib/contracts/`, `lib/telemetry/`, `lib/extraction/`
- **Architecture diagrams are outdated**: search pipeline diagram doesn't show artifact routing or adaptive fusion stages
- **Memory commands reference stale tool signatures**: parameter lists are incomplete
- **Scripts READMEs are behind**: 2 new extractors, 1 new memory validator, new evals/ and kpi/ directories are unlisted

This creates a documentation-reality gap that undermines the framework's core value proposition: documentation that stays synchronized with the codebase.
<!-- /ANCHOR:problem-statement -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| Package | `007-documentation-alignment` |
| Parent Spec | `../spec.md` |
| Parent Plan | `../plan.md` |
| Status | Complete |
| Implementation Status | Complete |
| Last Updated | 2026-02-20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:scope -->
## 2. Scope Boundaries

### In Scope

**Top-Level Documentation (4 files)**
- `.opencode/skill/system-spec-kit/README.md` — Skill README: module counts, feature flags, architecture diagram, capabilities, directory structure
- `.opencode/skill/system-spec-kit/SKILL.md` — AI workflow instructions: capabilities, feature flags, MCP tool descriptions
- `.opencode/skill/system-spec-kit/mcp_server/README.md` — MCP server README: module counts, directories, feature flags, architecture diagram, search pipeline
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — Install guide: features, configuration, feature flags

**Library Subfolder READMEs (8 updates + 3 new)**
- Update: `lib/README.md`, `lib/search/README.md`, `lib/storage/README.md`, `lib/cognitive/README.md`, `lib/config/README.md`, `handlers/README.md`, `tests/README.md`, `hooks/README.md`
- Create: `lib/contracts/README.md`, `lib/telemetry/README.md`, `lib/extraction/README.md`

**Memory Commands (5 files)**
- `.opencode/command/memory/context.md` — Adaptive fusion params, telemetry
- `.opencode/command/memory/save.md` — Mutation-ledger context, artifact metadata
- `.opencode/command/memory/manage.md` — Feature flag documentation
- `.opencode/command/memory/learn.md` — Consolidation pipeline updates
- `.opencode/command/memory/continue.md` — Recovery accuracy context

**Scripts READMEs (4 files)**
- `scripts/README.md` — New evals/, kpi/ dirs, +2 extractors
- `scripts/extractors/README.md` — +2 scripts (contamination-filter, quality-scorer)
- `scripts/memory/README.md` — +1 script (validate-memory-quality)
- `scripts/tests/README.md` — +1 test (test-memory-quality-lane)

### Out of Scope
- Root project README.md (separate spec if needed)
- AGENTS.md or CLAUDE.md updates
- New feature implementation or code changes
- Template system changes
- Changelog entries (tracked separately)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 3. Requirements

| ID | Requirement | Acceptance Criteria |
|----|------------|---------------------|
| DOC-001 | All module counts match reality | Every README that states a module count matches the actual file count (verified by Glob) |
| DOC-002 | All new modules are documented | Each of the 5 new Wave 1 modules appears in at least the parent-folder README and the top-level skill README |
| DOC-003 | Feature flags are documented | `SPECKIT_ADAPTIVE_FUSION` and `SPECKIT_EXTENDED_TELEMETRY` appear in feature flag tables with defaults and descriptions |
| DOC-004 | New folders have READMEs | `lib/contracts/`, `lib/telemetry/`, `lib/extraction/` each have a README.md following the existing subfolder README pattern |
| DOC-005 | Architecture diagrams are current | Search pipeline diagram includes artifact routing and adaptive fusion stages |
| DOC-006 | Memory commands reflect current tool signatures | Parameter lists in command files match actual MCP tool schemas |
| DOC-007 | Scripts READMEs match actual inventory | Every script file listed in a README exists, and every existing script file appears in the README |
| DOC-008 | No stale references | No README references a module that doesn't exist or uses an outdated count |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:canonical-requirement-linkage -->
## 3.1 Canonical Requirement Linkage

This package keeps root requirements authoritative and links documentation alignment work to canonical requirement IDs:

- `REQ-001` - inherited from `../spec.md` section 4 and applied to accurate retrieval documentation context.
- `REQ-002` - inherited from `../spec.md` section 4 and applied to deterministic tool and command documentation.
- `REQ-003` - inherited from `../spec.md` section 4 and applied to traceability of module-count statements.
- `REQ-004` - inherited from `../spec.md` section 4 and applied to fallback and routing behavior documentation accuracy.
- `REQ-005` - inherited from `../spec.md` section 4 and applied to quality-safe rollout documentation semantics.
- `REQ-006` - inherited from `../spec.md` section 4 and applied to policy and governance documentation consistency.
- `REQ-007` - inherited from `../spec.md` section 4 and applied to telemetry documentation completeness.
- `REQ-008` - inherited from `../spec.md` section 4 and applied to auditability of doc-to-code alignment decisions.

All normative requirement wording remains in `../spec.md` section 4.
<!-- /ANCHOR:canonical-requirement-linkage -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 3.2 Acceptance Scenarios

1. **Given** module counts are updated in top-level docs, **when** counts are cross-checked with repository inventory, **then** each documented count matches actual files.
2. **Given** Wave 1 modules are documented, **when** readers inspect top-level and folder READMEs, **then** contracts, artifact routing, adaptive fusion, mutation ledger, and telemetry modules are all visible.
3. **Given** feature flag documentation is reviewed, **when** `SPECKIT_ADAPTIVE_FUSION` and `SPECKIT_EXTENDED_TELEMETRY` are inspected, **then** default values and behavior summaries are present.
4. **Given** architecture diagrams are updated, **when** search pipeline flow is reviewed, **then** artifact routing and adaptive fusion stages are represented.
5. **Given** memory command docs are checked, **when** tool signatures are compared to runtime schemas, **then** parameters and behavior notes align with current implementation.
6. **Given** final verification runs, **when** stale references are scanned, **then** referenced files and folders resolve to existing paths.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:dependencies -->
## 4. Dependencies and Handoffs

- Depends on completed Waves 1–3 (packages 004, 005, 006) for the actual code that documentation must reflect
- No code changes required — this is purely documentation
- Consumes: existing README patterns, ANCHOR tag conventions, HVR format standards
- Produces: synchronized documentation ready for indexing by the memory system
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:governance -->
## 5. Governance

- Level 3 package documentation
- `decision-record.md` present in this package for documentation approach decisions
- Root documents remain source-of-truth for completion claims
<!-- /ANCHOR:governance -->

---

<!-- ANCHOR:status -->
## 6. Status Statement

Complete. All 26 tasks implemented, 6/6 P0 pass, 18/18 P1 pass, 7/7 P2 pass (CHK-336 closed with README table evidence updates).
<!-- /ANCHOR:status -->
