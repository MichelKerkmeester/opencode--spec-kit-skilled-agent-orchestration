---
title: "Implementation Specification: Architecture Diagrams & Topology for All Code Folders"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Add ASCII box-art architecture diagrams and directory topology trees to every code-folder README and ARCHITECTURE.md. Only shared/README.md currently has both."
trigger_phrases:
  - "architecture diagram"
  - "topology tree"
  - "box-art diagram"
  - "code folder readme"
  - "architecture readme"
importance_tier: "normal"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Specification: Architecture Diagrams & Topology

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-02 |
| **Parent Spec** | `../spec.md` (000-release-cleanup) |
| **Parent Packet** | `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Only `shared/README.md` has both an ASCII box-art architecture diagram and a directory topology tree. The 18 other code-folders and `ARCHITECTURE.md` are missing one or both. This makes it hard for developers to orient themselves when entering a code directory.

### Purpose
Add a box-art architecture diagram (Unicode box-drawing characters `┌┐└┘──│◄►▲`) and a directory topology tree to every principal code-folder README in `system-spec-kit/` plus `ARCHITECTURE.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 18 files across `mcp_server/`, `scripts/`, `templates/`, plus `ARCHITECTURE.md`
- Each README gets an architecture diagram showing how its modules relate
- Each README gets a topology tree showing the directory structure
- Diagrams use the same box-drawing style as `shared/README.md:46-78`

### Out of Scope
- Non-code documentation folders (constitutional, changelog, manual_testing_playbook)
- Deep subdirectories with single-purpose READMEs (e.g., providers internals)
- SKILL.md, feature catalog, or other non-README documentation

### Target Files

**Missing BOTH diagram and tree (11):**
- `mcp_server/handlers/README.md`
- `mcp_server/hooks/README.md`
- `mcp_server/code_graph/lib/README.md`
- `mcp_server/code_graph/handlers/README.md`
- `mcp_server/matrix_runners/README.md`
- `mcp_server/stress_test/README.md`
- `mcp_server/tools/README.md`
- `scripts/README.md`
- `scripts/lib/README.md`
- `scripts/spec/README.md`
- `scripts/memory/README.md`

**Missing diagram but has tree (6):**
- `mcp_server/README.md`
- `mcp_server/lib/README.md`
- `mcp_server/skill_advisor/README.md`
- `mcp_server/code_graph/README.md`
- `templates/README.md`
- `ARCHITECTURE.md`

**Already has both (1, reference only):**
- `shared/README.md`
<!-- /ANCHOR:scope -->