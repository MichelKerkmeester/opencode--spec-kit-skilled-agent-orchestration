# Spec 131: Memory Index TXT File Support

> **Level 3** — Add `.txt` file indexing to Spec Kit Memory index scan

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [OVERVIEW](#overview)
- [QUICK REFERENCE](#quick-reference)
- [PROBLEM](#problem)
- [SOLUTION](#solution)
- [KEY DECISIONS](#key-decisions)
- [DOCUMENTATION](#documentation)
- [FILES TO CHANGE](#files-to-change)
- [SUCCESS CRITERIA](#success-criteria)
- [RELATED SPECS](#related-specs)

---
<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This README documents the purpose and usage of this spec folder and links to the primary artifacts in this directory.

---
<!-- /ANCHOR:overview -->

## OVERVIEW

This spec folder adds `.txt` file indexing support to the Spec Kit Memory system, enabling command folder documentation to be discoverable via memory search tools.

---

## QUICK REFERENCE

| Attribute | Value |
|-----------|-------|
| **Level** | 3 (Architecture) |
| **Priority** | P1 |
| **Status** | ✅ Completed |
| **LOC Estimate** | 50-100 |
| **Effort** | 4-6 hours |

---

## PROBLEM

Command folder documentation uses `README.txt` files with frontmatter metadata, but these files are not indexed by `memory_index_scan`, making them invisible to memory search tools.

---

## SOLUTION

Extend the memory indexing subsystem to discover and index `.txt` files alongside `.md` files. Implement regex-based README detection (`/^readme\.(md|txt)$/i`) via `isReadmeFileName()` helper, expand `findProjectReadmes()` to include `.opencode/command/` paths, and update path validation in `memory-save.ts` to accept `.txt` from allowed paths.

---

## KEY DECISIONS

- **ADR-001**: Unified file discovery (single pass for `.md` and `.txt`)
- **ADR-002**: Read-only safeguards prevent command invocation during indexing
- **ADR-003**: Path validation regex extended to accept `.txt` with explicit OR condition
- **ADR-004**: Reduced importance weight (0.3) for `.txt` files (matches README precedent)

---

## DOCUMENTATION

- **Specification**: [spec.md](./spec.md) — Requirements, user stories, risk matrix
- **Implementation Plan**: [plan.md](./plan.md) — Technical approach, phases, ADRs
- **Tasks**: [tasks.md](./tasks.md) — Task breakdown with dependencies
- **Checklist**: [checklist.md](./checklist.md) — Verification gates (P0/P1/P2)
- **Decision Record**: [decision-record.md](./decision-record.md) — Architecture decisions
- **Research**: [research.md](./research/research.md) — Technical investigation findings
- **Implementation Summary**: [implementation-summary.md](./implementation-summary.md) — Post-implementation (TBD)

---

## FILES TO CHANGE

| File | Change Type | Lines Affected |
|------|-------------|----------------|
| `memory-index.ts` | Modify | ~50-55 (isReadmeFileName regex), ~310-344 (findProjectReadmes expansion) |
| `memory-save.ts` | Modify | ~1029 (error message updated) |
| `memory-parser.ts` | Modify | .txt validation added |
| `memory-types.ts` | Modify | .txt classification |
| `vector-index-impl.ts` | Modify | README.txt type inference |
| `tool-schemas.ts` | Modify | Descriptions updated |
| Test files | Add | readme-discovery.vitest.ts, memory-parser-readme.vitest.ts (new) |

---

## SUCCESS CRITERIA

- [SC-001] `memory_index_scan()` indexes `.opencode/command/spec_kit/README.txt`
- [SC-002] `memory_search({ query: "spec kit command" })` returns `.txt` files
- [SC-003] All existing `.md` indexing tests pass (no regressions)
- [SC-004] Command invocation does NOT occur during indexing (verified)

---

## RELATED SPECS

- **Spec 126**: Full spec document indexing (README.md weight precedent)
- **Parent**: [02--system-spec-kit](../) — Spec Kit Memory system

---

**Created**: 2026-02-16
**Last Updated**: 2026-02-16
