# README Audit A08 — cognitive/, eval/, session/

**Date**: 2026-03-08
**Auditor**: Claude Opus 4.6
**Base path**: `.opencode/skill/system-spec-kit/mcp_server/lib/`

---

## 1. cognitive/ — PASS

**Folder path**: `mcp_server/lib/cognitive/`
**Status**: PASS

| Check | Result |
|-------|--------|
| All files listed in README | Yes — 10 .ts files match exactly |
| File descriptions accurate | Yes — module names, purposes, and key exports verified |
| Module structure reflects code | Yes — structure tree matches glob results |
| YAML frontmatter present | Yes — title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes — 8 sections (1. OVERVIEW through 8. RELATED RESOURCES) |
| HVR-banned words | None found |

**Actual files**: `fsrs-scheduler.ts`, `prediction-error-gate.ts`, `tier-classifier.ts`, `attention-decay.ts`, `co-activation.ts`, `working-memory.ts`, `archival-manager.ts`, `temporal-contiguity.ts`, `pressure-monitor.ts`, `rollout-policy.ts`, `README.md`

**Evidence**: All 10 modules listed in the Structure section (line 246-257) match the 10 .ts files discovered by glob. No missing or extra files.

---

## 2. eval/ — UPDATED

**Folder path**: `mcp_server/lib/eval/`
**Status**: UPDATED (3 issues fixed)

| Check | Result |
|-------|--------|
| All files listed in README | **FAIL** — `data/ground-truth.json` subfolder was missing from structure tree |
| File descriptions accurate | Yes — all 15 .ts module descriptions verified |
| Module structure reflects code | **FAIL** (pre-fix) — `data/` subdirectory omitted |
| YAML frontmatter present | Yes — title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes — 4 sections (1. OVERVIEW through 4. RELATED RESOURCES) |
| HVR-banned words | **FAIL** — "Curated" on lines 77 and 106 |

**Actual files**: 15 .ts files + `data/ground-truth.json` + `README.md`

### Issues Found and Actions Taken

| # | Issue | Line(s) | Action |
|---|-------|---------|--------|
| 1 | `data/ground-truth.json` missing from structure tree | 49-67 | Added `data/` entry with `ground-truth.json` to structure block |
| 2 | Key Statistics count did not reflect data file | 38 | Updated from "15" to "15 + 1 data file" and appended `data/ground-truth.json` to list |
| 3 | HVR-banned word "Curated" (2 occurrences) | 77, 106 | Replaced with "Hand-verified" |

---

## 3. session/ — PASS

**Folder path**: `mcp_server/lib/session/`
**Status**: PASS

| Check | Result |
|-------|--------|
| All files listed in README | Yes — 1 .ts file (`session-manager.ts`) matches exactly |
| File descriptions accurate | Yes — session deduplication, crash recovery, state management |
| Module structure reflects code | Yes — structure tree matches glob results |
| YAML frontmatter present | Yes — title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes — 6 sections (1. OVERVIEW through 6. RELATED RESOURCES) |
| HVR-banned words | None found |

**Actual files**: `session-manager.ts`, `README.md`

**Evidence**: Single module listed in Structure section (line 62-64) matches the 1 .ts file discovered by glob. No missing or extra files.

---

## Summary

| Folder | Status | Issues | Actions |
|--------|--------|--------|---------|
| `cognitive/` | PASS | 0 | None |
| `eval/` | UPDATED | 3 | Added missing `data/` subfolder to structure; updated module count; replaced 2x HVR-banned "Curated" |
| `session/` | PASS | 0 | None |

**Files modified**: 1
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md` (3 edits)
