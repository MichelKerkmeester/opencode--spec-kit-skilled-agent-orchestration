# README Audit A22 -- shared/ Subtree (4 Folders)

**Auditor:** Claude Opus 4.6
**Date:** 2026-03-08
**Base path:** `.opencode/skill/system-spec-kit/shared/`

---

## 1. `shared/` (root README)

**Status:** UPDATED

**Issues found:**

| # | Issue | Severity |
|---|-------|----------|
| 1 | `## Boundary & Import Policy` section header was unnumbered and not ALL CAPS; violates H2 convention | Medium |
| 2 | `package.json` and `tsconfig.json` missing from the structure tree | Low |
| 3 | `mcp_server/` subdirectory missing from the structure tree (counted in Key Statistics table but not shown) | Low |
| 4 | `providers/README.md` missing from the `embeddings/` subtree in the structure diagram | Low |

**Actions taken:**

- Renamed `## Boundary & Import Policy` to `## 1B. BOUNDARY AND IMPORT POLICY` (numbered ALL CAPS)
- Added `package.json` and `tsconfig.json` to the structure tree
- Added `mcp_server/database/.db-updated` to the structure tree
- Added `providers/README.md` to the `embeddings/providers/` subtree in the tree

**Checks passed:**

- YAML frontmatter: PASS (title, description, trigger_phrases present)
- Numbered ALL CAPS H2 sections: PASS (after fix)
- HVR-banned words: PASS (none found)
- File descriptions accurate: PASS (verified against source code)

---

## 2. `shared/embeddings/`

**Status:** UPDATED

**Issues found:**

| # | Issue | Severity |
|---|-------|----------|
| 1 | Structure tree omitted `README.md` (self-reference) and `providers/README.md` | Low |

**Actions taken:**

- Added `README.md` (self) and `providers/README.md` to the structure tree

**Checks passed:**

- YAML frontmatter: PASS (title, description, trigger_phrases present)
- Numbered ALL CAPS H2 sections: PASS (1. OVERVIEW through 8. RELATED DOCUMENTS)
- HVR-banned words: PASS (none found)
- File descriptions accurate: PASS (factory.ts, profile.ts, providers/* all verified)
- Key files table accurate: PASS

---

## 3. `shared/scoring/`

**Status:** PASS

**Evidence:**

- YAML frontmatter: PASS (title, description, trigger_phrases present)
- Numbered ALL CAPS H2 sections: PASS (1. OVERVIEW through 6. RELATED)
- HVR-banned words: PASS (none found)
- Structure tree matches: PASS (`README.md` + `folder-scoring.ts` -- matches actual contents)
- Exports table verified against source: PASS (all 8 functions and 5 constants confirmed in `folder-scoring.ts`)
- Scoring formula matches code: PASS (weights 0.40/0.30/0.20/0.10 confirmed at lines 55-59 of source)
- Design decisions accurate: PASS

---

## 4. `shared/utils/`

**Status:** UPDATED

**Issues found:**

| # | Issue | Severity |
|---|-------|----------|
| 1 | `token-estimate.ts` completely absent from README -- not in structure table, no documentation section, not mentioned in description | Medium |
| 2 | YAML frontmatter description omitted JSONC and token estimation capabilities | Low |
| 3 | RELATED section origin note did not mention `token-estimate.ts` | Low |

**Actions taken:**

- Added `token-estimate.ts` row to the structure table in section 2
- Added new `## 5. TOKEN ESTIMATE` section documenting exports and usage
- Renumbered `## 5. RELATED` to `## 6. RELATED`
- Updated TOC to include new section
- Updated YAML frontmatter description to mention all four capabilities
- Updated overview paragraph to include token estimation
- Updated RELATED origin note to mention `token-estimate.ts`

**Checks passed:**

- YAML frontmatter: PASS (after update)
- Numbered ALL CAPS H2 sections: PASS (1 through 6, after renumbering)
- HVR-banned words: PASS (none found)
- File descriptions accurate: PASS (all 4 files verified against source code)
- Export tables verified: PASS (`path-security.ts`: 2 exports, `retry.ts`: 8+ exports, `jsonc-strip.ts`: 1 export, `token-estimate.ts`: 1 export)

---

## Summary

| Folder | Status | Issues | Fixes Applied |
|--------|--------|--------|---------------|
| `shared/` | UPDATED | 4 | H2 header fixed; tree updated with 4 missing entries |
| `shared/embeddings/` | UPDATED | 1 | 2 README files added to structure tree |
| `shared/scoring/` | PASS | 0 | None needed |
| `shared/utils/` | UPDATED | 3 | `token-estimate.ts` fully documented; section added and renumbered |

**Files modified:**

- `.opencode/skill/system-spec-kit/shared/README.md`
- `.opencode/skill/system-spec-kit/shared/embeddings/README.md`
- `.opencode/skill/system-spec-kit/shared/utils/README.md`
