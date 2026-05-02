# Consolidated Audit Findings — 024-compact-code-graph

**Date:** 2026-04-24
**Scope:** Root 024-compact-code-graph + 34 top-level sub-phases (001–034) + 6 nested 030 sub-packets (001–005 + 031) = 41 packet contexts.
**Sources:**
1. `validate.sh --strict` (canonical): **96 errors, 40 warnings** across 34 phases.
2. `cli-copilot` content audit (gpt-5.4, autopilot): **P0=66, P1=145 (many false positives), P2=5** — preliminary; markdown file still writing.
3. Python schema-conformance check: **0 issues** — all JSON conforms to the real `graphMetadataSchema` and `description.json` contract.

---

## NOTE ON AUDIT #1 (metadata) — SUPERSEDED
`findings-metadata.md` was generated against a schema I invented (`title`, `status`, `level`, `tags` at top-level). The actual contract has `status` under `derived.status` in `graph-metadata.json` and a completely different field set in `description.json`. **All 41 "drift" findings in that file are false positives.** Schema validation against the real zod schemas passes cleanly — discard that report.

---

## A. STRUCTURE / FOLDER — CLEAN

- All 41 packets have the 7 canonical files: `description.json`, `graph-metadata.json`, `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md` (+ root has `decision-record.md`).
- JSON schema conformance: 100% across `description.json` and `graph-metadata.json`.
- Folder naming convention: all phases match `NNN-slug`.
- No orphaned or unlisted phases on disk.

## B. PATH ERRORS — REAL

### B1. Phase slug drift (real, unambiguous) — 7 occurrences
| File | Stale ref | Correct slug |
|---|---|---|
| 025-tool-routing-enforcement/implementation-summary.md:83 | `020-mcp-working-memory-hybrid-rag` | `020-query-routing-integration` |
| 029-review-remediation/spec.md:62, tasks.md:33, checklist.md:71 | `030-opencode-plugin` (3×) | `030-opencode-graph-plugin` |
| 030-opencode-graph-plugin/**/various | `002-implement-cache-warning-hooks` (3×) | needs verification — phase not on disk |

### B2. Stale hook paths (real, unambiguous) — 2 occurrences
| File | Stale ref | Correct path |
|---|---|---|
| 002-session-start-hook/spec.md:137 | `.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-prime.js` | `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js` |
| 003-stop-hook-tracking/spec.md:174 | `.opencode/skill/system-spec-kit/scripts/dist/hooks/claude/session-stop.js` | `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js` |

### B3. Missing reference file `hvr_rules.md` — 21 occurrences
- All refs point to `.opencode/skill/sk-doc/references/hvr_rules.md` (missing).
- Correct path on disk: `.opencode/skill/sk-doc/references/global/hvr_rules.md`
- Unambiguous fix: add `global/` segment to all 21 refs.

### B4. `.claude/CLAUDE.md` refs (22 occurrences) — AMBIGUOUS
- File was created in Phase 004, then **intentionally removed** in commit `25f26bc7ac` ("chore(026): remove .agents/ symlinks, prune shared-memory, update MCP server + spec docs").
- Spec docs still reference it as if it exists.
- Decision needed:
  - (a) Recreate `.claude/CLAUDE.md` (as pointer to `CLAUDE.md`/`AGENTS.md`)
  - (b) Leave historical refs unchanged (reflects accurate implementation history at the time of writing)
  - (c) Update each ref to current state / delete ref

### B5. `CODEX.md` / `GEMINI.md` refs (8 occurrences) — AMBIGUOUS
- Refs to top-level `CODEX.md` and `GEMINI.md` — **neither exists**.
- Only `AGENTS.md` exists at repo root, with `CLAUDE.md` as symlink.
- Current runtime pattern (per feedback memory and CLAUDE.md): `AGENTS.md` is primary, siblings `AGENTS_Barter.md`/`AGENTS_example_fs_enterprises.md` exist — no per-runtime `CODEX.md`/`GEMINI.md`.
- Decision needed:
  - (a) Update refs to point to `AGENTS.md`
  - (b) Remove mentions entirely
  - (c) Leave as historical

### B6. `feature_catalog_in_simple_terms.md` refs (4 occurrences) — AMBIGUOUS
- File does not exist anywhere under `.opencode/`.
- Either the file was planned but never created, or was removed.
- Decision needed: remove refs, or create the file.

## C. DOCUMENT ERRORS — REAL (per canonical validator)

### C1. Duplicate anchor IDs (~96 errors across tree)
Common repeating duplicates in `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`:
- `scope`, `dependencies`, `completion`, `cross-refs`, `notation`, `how-delivered`, `limitations`, `metadata`, `verification`, `what-built`

These arise because the `<!-- ANCHOR:X -->` markers are repeated within the same document. Fix = rename one of each pair (e.g., `scope` → `in-scope`, `dependencies` → `dependencies-detail`).

Scope: 34 phases × ~3-6 duplicates each = substantial but mechanical.

### C2. Missing `_memory` frontmatter blocks (40 warnings, ~142 file occurrences)
| File type | Count |
|---|---|
| tasks.md | 32 |
| plan.md | 32 |
| checklist.md | 31 |
| spec.md | 25 |
| implementation-summary.md | 11 |
| decision-record.md | 9 |
| research/research.md | 2 |

Fix: add `_memory:\n  continuity: {...}` frontmatter block to each. Standard template exists — sibling `026-graph-and-context-optimization/implementation-summary.md` shows the pattern.

### C3. Empty required frontmatter fields (21 files × 3-15 issues)
Most common: `tasks.md` has empty `importance_tier`, `contextType`, `trigger_phrases`. Repeats across most phases.

### C4. Missing citations (SPECDOC_SUFFICIENCY)
- 4 × `implementation-summary.md:what-built` missing concrete file/code/artifact citation
- 2 × `implementation-summary.md:verification` missing concrete command/verification artifact
- 3 × `research/research.md` missing citation

### C5. Missing required anchor `metadata`
- Root `spec.md` missing `metadata` anchor
- `033-fts-forced-degrade-hardening/spec.md` missing `metadata` anchor
- `034-workflow-split-and-token-insight-contracts/spec.md` missing `metadata` anchor

## D. VALIDATOR INFRASTRUCTURE — NOT A CONTENT ISSUE

### D1. EVIDENCE_MARKER_LINT ENOENT (21× in leaf phases)
Validator attempts `scandir '<phase>/[0-9][0-9][0-9]-*'` in leaf phases that have no sub-phase folders, glob matches nothing → ENOENT. This is a validator bug, not a content issue. **No fix at the content layer.**

### D2. FOLDER_NAMING false positive when validator run from `.`
When invoked with `.` arg, validator can't resolve current folder name. Runs fine with absolute path. **No fix needed.**

## E. LIKELY FALSE POSITIVES IN AUDIT #2 P1 DRIFT

132 of the 145 P1 "phase slug drift" findings are for references like `001-context`, `001-decision`, `001-alternatives`, `001-consequences`, `001-five-checks`, `001-impl` — these are **markdown section anchors within decision-record.md files** (standard ADR sections: context / decision / alternatives / consequences), not phase folder refs. Audit heuristic misfired. Ignore.

---

## RECOMMENDED FIX PLAN

### Pass 1 — SAFE, UNAMBIGUOUS (apply now)
1. Fix phase slug drift (B1): 4 replacements in 4 files
2. Fix stale hook paths (B2): 2 replacements in 2 files
3. Fix `hvr_rules.md` path (B3): add `global/` to 21 refs
4. Add missing `metadata` anchor to 3 spec.md files (C5)

**Low risk. Mechanical find-replace.**

### Pass 2 — NEEDS USER DECISION
- B4: `.claude/CLAUDE.md` refs — recreate / leave historical / update refs?
- B5: `CODEX.md` / `GEMINI.md` refs — update to `AGENTS.md` / remove / leave?
- B6: `feature_catalog_in_simple_terms.md` — remove refs / create file?
- B1 last item: `002-implement-cache-warning-hooks` (3×) — verify if this is a planned phase

### Pass 3 — SYSTEMATIC, HIGH SCOPE
- C1: Rename ~96 duplicate anchor IDs
- C2: Add `_memory` frontmatter blocks to ~142 files
- C3: Fill empty required frontmatter fields in ~21 tasks.md files
- C4: Add concrete artifact citations to 9 files

These are mechanical but touch many files. Recommend dispatching a dedicated remediation phase (e.g., `029-review-remediation` style) rather than bundling with this audit.

### Pass 4 — REINDEX
- `memory_index_scan({ specFolder: "system-spec-kit/024-compact-code-graph" })` at root + recurse into each phase
- Refresh `graph-metadata.json` via `bash backfill-graph-metadata.js` if any doc body changed substantively
- Final `validate.sh --strict` sweep to confirm remediation results
