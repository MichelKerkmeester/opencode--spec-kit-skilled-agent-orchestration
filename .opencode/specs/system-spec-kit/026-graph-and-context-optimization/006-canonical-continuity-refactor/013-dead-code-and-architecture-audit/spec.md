---
title: "Phase 013 — Dead Code & Architecture Audit"
description: "Scan system-spec-kit and mcp_server for dead code, ARCHITECTURE.md misalignments, code placement/routing/import violations, sk-code-opencode standard drift, and stale code READMEs."
trigger_phrases:
  - "dead code audit"
  - "architecture alignment"
  - "code cleanup"
  - "readme alignment"
  - "sk-code-opencode"
importance_tier: "critical"
contextType: "implementation"
level: 3
status: "planned"
parent: "006-canonical-continuity-refactor"
_memory:
  continuity:
    packet_pointer: "026/006-canonical-continuity-refactor/013-dead-code-and-architecture-audit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "claude-opus-4.6"
    recent_action: "Created Level 3 spec for dead code and architecture audit"
    next_safe_action: "Implement the audit — scan, fix, verify"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 013 — Dead Code & Architecture Audit

---

## EXECUTIVE SUMMARY

After Phase 018's (now 006) sweeping refactor — deleting legacy memory files, removing shared memory, adding graph-metadata, updating 178+ docs — the codebase has accumulated dead code paths, stale imports, misaligned READMEs, and architecture doc drift. This phase does a comprehensive audit + fix pass.

**Key Deliverables**: clean codebase with zero dead imports, ARCHITECTURE.md aligned to reality, all code READMEs current, sk-code-opencode standards verified.

---

## SCOPE

### In scope

1. **Dead code scan** — find and remove:
   - Unused imports across all `mcp_server/` and `scripts/` TypeScript files
   - Unused exports (functions/types exported but never imported)
   - Dead branches (code paths gated on deleted concepts: `is_archived`, `shadow_only`, `shared_space_id` active paths)
   - Orphaned files (`.ts` files not imported by anything, not registered as tools, not in test suites)

2. **ARCHITECTURE.md alignment** — verify and fix:
   - Module organization matches what ARCHITECTURE.md describes
   - Handler → lib → storage layering is correct (no circular deps, no wrong-layer imports)
   - Tool registration matches the actual tool catalog
   - Pipeline stages (stage1-candidate-gen → stage2-fusion → stage3 etc.) described accurately
   - New modules from Phase 006 (graph-metadata, resume-ladder, anchor-merge, content-router, atomic-index-memory) are documented

3. **sk-code-opencode standards** — verify:
   - TypeScript strict mode compliance
   - Import ordering conventions
   - Error handling patterns (structured errors, not bare throws)
   - Naming conventions (files, functions, types)
   - No `console.log` in production code (use structured logger)

4. **Code READMEs** — verify and update:
   - Every directory under `mcp_server/` with >3 files has a README.md
   - README content matches actual directory contents
   - New directories from Phase 006 (lib/graph/, lib/resume/, lib/merge/, lib/routing/, lib/continuity/) have READMEs
   - Stale README references to deleted modules are removed

5. **Resource map update** — refresh `006-canonical-continuity-refactor/resource-map.md`:
   - Add new files created during Phase 006 (graph-metadata, resume-ladder, etc.)
   - Remove files deleted during Phase 006 (shared-memory, legacy memory paths)
   - Update effort/verb columns for modified files

### Out of scope
- Feature implementation (this is audit + cleanup only)
- Template changes (Gate A scope)
- Feature catalog / playbook updates (Gates H/I scope)
- External doc fanout (Gate E scope)

---

## REQUIREMENTS

| ID | Priority | Requirement |
|---|---|---|
| REQ-001 | P0 | Zero unused imports across `mcp_server/**/*.ts` and `scripts/**/*.ts` |
| REQ-002 | P0 | Zero dead export functions (exported but never imported) in the active module set |
| REQ-003 | P0 | Zero active code branches on deleted concepts (`shadow_only`, `shared_space_id` active paths, `archived_hit_rate`) |
| REQ-004 | P0 | ARCHITECTURE.md accurately describes the current module layout, handler→lib→storage layering, and pipeline stages |
| REQ-005 | P1 | All new Phase 006 modules documented in ARCHITECTURE.md |
| REQ-006 | P1 | Every `mcp_server/` directory with >3 files has a current README.md |
| REQ-007 | P1 | No `console.log`/`console.error` in production code (use structured logger) |
| REQ-008 | P1 | Import ordering follows sk-code-opencode convention |
| REQ-009 | P1 | Resource map updated to reflect post-006 file state |
| REQ-010 | P2 | No circular dependencies between modules |
| REQ-011 | P2 | Orphaned files identified and either deleted or documented |
| REQ-012 | P2 | TypeScript strict mode compliance verified |

---

## APPROACH

### Phase 1 — Automated scanning (parallel)
- Use `tsc --noUnusedLocals --noUnusedParameters` for unused variable detection
- Use custom grep scripts for dead concept branches
- Use `madge` or import graph analysis for circular deps + orphans
- Use `eslint --rule no-console` for console.log detection

### Phase 2 — Fix pass (parallel per module)
- Remove dead imports and exports
- Remove dead concept branches
- Fix console.log → structured logger
- Fix import ordering

### Phase 3 — ARCHITECTURE.md + READMEs (serial)
- Read current ARCHITECTURE.md, diff against actual module layout
- Update with new modules, remove deleted modules
- Walk directories, check README existence + accuracy

### Phase 4 — Resource map refresh
- Read existing resource-map.md
- Cross-reference against `git log --stat` for Phase 006
- Add new rows, mark deleted rows, update verbs

### Phase 5 — Verification
- Typecheck both workspaces
- Full test suite run
- validate.sh --strict on phase 013 packet
