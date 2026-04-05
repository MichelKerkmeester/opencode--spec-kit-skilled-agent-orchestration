# Audit A25: README.md and ARCHITECTURE.md Cross-Reference Alignment

**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6
**Scope:** system-spec-kit root README.md + ARCHITECTURE.md

---

## Files Audited

| File | Path | Status |
|------|------|--------|
| `README.md` | `.opencode/skill/system-spec-kit/README.md` | PASS (minor drift noted) |
| `ARCHITECTURE.md` | `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | PASS (1 structural gap) |

---

## Check Results

### 1. Three Code Zones (mcp_server, scripts, shared)

**Status: PASS**

Both files accurately describe the 3-zone ownership model:
- `scripts/` — build-time CLI
- `mcp_server/` — runtime MCP server
- `shared/` — neutral reusable modules

ARCHITECTURE.md Section 3 (STRUCTURE) and Section 4 (FEATURES, Ownership Zones) correctly enumerate zones. README Section 3 (COMPONENTS) correctly lists MCP Server, Scripts, and references `shared/` in the directory tree (Section 12).

### 2. ARCHITECTURE.md Boundary Documentation vs Directory Structure

**Status: PASS**

The 3-zone boundary model is accurate. All key enforcement directories exist:
- `mcp_server/api/` — EXISTS (public boundary surface)
- `mcp_server/lib/` — EXISTS (internal runtime, 24 subdirectories)
- `mcp_server/core/` — EXISTS
- `mcp_server/handlers/` — EXISTS
- `mcp_server/scripts/` — EXISTS (compatibility wrappers)
- `scripts/evals/` — EXISTS (boundary enforcement scripts)
- `shared/` — EXISTS (neutral modules)

### 3. Cross-References Between Files

**Status: FAIL — No cross-linking exists**

- README.md never references ARCHITECTURE.md (not in Section 12 "Related Resources" or anywhere else).
- ARCHITECTURE.md never references README.md.

These are sibling root-level docs that should cross-reference each other. The README's "Related Resources" table (Section 12) lists SKILL.md, mcp_server/README.md, and various references/ files, but omits ARCHITECTURE.md entirely.

**Recommendation:** Add ARCHITECTURE.md to README Section 12 "Internal Documentation" table. Add a note in ARCHITECTURE.md Section 9 referencing README.md as the skill overview.

### 4. YAML Frontmatter

**Status: PARTIAL PASS**

- README.md: HAS frontmatter (lines 1-10, with title, description, trigger_phrases). PASS.
- ARCHITECTURE.md: NO frontmatter. Starts directly with `# Architecture Boundaries: system-spec-kit`. FAIL.

**Recommendation:** Add YAML frontmatter to ARCHITECTURE.md with title, description, and trigger_phrases.

### 5. Numbered ALL CAPS H2 Sections

**Status: PASS**

README.md: 12 numbered sections (1. OVERVIEW through 12. RELATED RESOURCES), plus TABLE OF CONTENTS.
ARCHITECTURE.md: 9 numbered sections (1. OVERVIEW through 9. RELATED DOCUMENTS), plus TABLE OF CONTENTS.
Both consistently use the `## N. TITLE` pattern with ALL CAPS.

### 6. HVR-Banned Words

**Status: PASS**

No instances of any HVR-banned words found in either file. Scanned for: leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable.

### 7. MCP Tool Count Inconsistency (README-internal)

**Status: INFO — Minor drift**

- README Section 1 "By The Numbers" table: "MCP Tools: 25"
- README Section 3 Component Map prose: "28 MCP tools over stdio"
- README Section 12 directory tree comment: "(28 tools)"

The 25 vs 28 discrepancy is internal to README, not a cross-reference issue. Noted for completeness.

### 8. Directory Tree Completeness (README Section 12)

**Status: INFO — Selective representation, not inaccurate**

The directory tree in Section 12 is a curated subset, not a full listing. Directories on disk not shown in the tree:

**Root level:** `config/`, `feature_catalog/`, `manual_testing_playbook/`, `nodes/`, `index.md`
**mcp_server/:** `tools/`, `formatters/`, `hooks/`, `configs/`, `schemas/`, `specs/`, `cli.ts`, `tool-schemas.ts`, `startup-checks.ts`
**scripts/:** `core/`, `lib/`, `loaders/`, `extractors/`, `ops/`, `renderers/`, `setup/`, `kpi/`, `test-fixtures/`, `tests/`

This is acceptable for a README overview tree. The ARCHITECTURE.md tree is intentionally minimal (zone-level only), which is appropriate for a boundary contract document.

---

## Summary

| Check | Result |
|-------|--------|
| 3 code zones accuracy | PASS |
| ARCHITECTURE.md boundaries vs disk | PASS |
| Cross-references between files | FAIL (no links) |
| YAML frontmatter | PARTIAL (ARCHITECTURE.md missing) |
| Numbered ALL CAPS H2 sections | PASS |
| HVR-banned words | PASS |
| MCP tool count consistency | INFO (25 vs 28 internal drift) |
| Directory tree completeness | INFO (curated subset, acceptable) |

**Overall: PASS with 2 actionable gaps**

### Actions Needed

1. **Add ARCHITECTURE.md to README Section 12** — Add row to the "Internal Documentation" table referencing ARCHITECTURE.md as the architecture boundary contract.
2. **Add YAML frontmatter to ARCHITECTURE.md** — Add title, description, and trigger_phrases block to match the frontmatter convention used across all other skill root docs.

Neither gap is a structural misalignment. The 3-zone model, boundary rules, and enforcement tooling are accurately documented in both files and match the on-disk structure.
