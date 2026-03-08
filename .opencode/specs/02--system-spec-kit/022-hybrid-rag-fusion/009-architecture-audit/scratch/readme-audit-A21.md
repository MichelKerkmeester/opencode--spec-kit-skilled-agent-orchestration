# README Audit A21 -- scripts/{ops,setup,templates,types,utils}

**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6
**Base path:** `.opencode/skill/system-spec-kit/scripts/`

---

## 1. scripts/ops/

**Status:** PASS

| Check | Result |
|-------|--------|
| All files listed in README | Yes -- 6 scripts in Script Map table match 6 actual files |
| File descriptions accurate | Yes -- ops-common.sh (shared helpers), heal-*.sh (remediation), runbook.sh (orchestrator) |
| Module structure reflects code | Yes -- 4 failure classes, drill/scenario interface confirmed in source |
| YAML frontmatter present | Yes -- title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes -- 8 sections (1. OVERVIEW through 8. RELATED RESOURCES) |
| HVR-banned words | None found |

**Files on disk:** `heal-index-drift.sh`, `heal-ledger-mismatch.sh`, `heal-session-ambiguity.sh`, `heal-telemetry-drift.sh`, `ops-common.sh`, `runbook.sh`, `README.md`

---

## 2. scripts/setup/

**Status:** PASS

| Check | Result |
|-------|--------|
| All files listed in README | Yes -- 4 scripts in Key Files table match 4 actual files |
| File descriptions accurate | Yes -- check-prerequisites.sh (spec folder validation), check-native-modules.sh (native module check), rebuild-native-modules.sh (rebuild), record-node-version.js (version recording) |
| Module structure reflects code | Yes -- Structure tree matches disk layout |
| YAML frontmatter present | Yes -- title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes -- 7 sections (1. OVERVIEW through 7. RELATED DOCUMENTS) |
| HVR-banned words | None found |

**Files on disk:** `check-native-modules.sh`, `check-prerequisites.sh`, `rebuild-native-modules.sh`, `record-node-version.js`, `README.md`

---

## 3. scripts/templates/

**Status:** PASS

| Check | Result |
|-------|--------|
| All files listed in README | Yes -- 1 script (`compose.sh`) listed, matches disk |
| File descriptions accurate | Yes -- compose.sh is a template composition script with dry-run/verify/selective modes |
| Module structure reflects code | Yes -- Structure tree shows `compose.sh` + README.md, accurate |
| YAML frontmatter present | Yes -- title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes -- 7 sections (1. OVERVIEW through 7. RELATED DOCUMENTS) |
| HVR-banned words | None found |

**Files on disk:** `compose.sh`, `README.md`

---

## 4. scripts/types/

**Status:** PASS

| Check | Result |
|-------|--------|
| All files listed in README | Yes -- 1 file (`session-types.ts`) listed, matches disk |
| File descriptions accurate | Yes -- canonical session interfaces across 4 sections (Decision, Phase/Conversation, Diagram, Session) |
| Module structure reflects code | Yes -- type architecture tree matches actual interface hierarchy in source |
| YAML frontmatter present | Yes -- title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes -- 7 sections (1. OVERVIEW through 7. RELATED) |
| HVR-banned words | None found |

**Files on disk:** `session-types.ts`, `README.md`

---

## 5. scripts/utils/

**Status:** UPDATED

| Check | Result |
|-------|--------|
| All files listed in README | Yes -- all 12 .ts files listed in Structure tree and Key Files table |
| File descriptions accurate | Yes -- each file description matches source module headers and exports |
| Module structure reflects code | Yes -- index.ts barrel exports confirmed against actual module contents |
| YAML frontmatter present | Yes -- title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes -- 5 sections (1. OVERVIEW through 5. RELATED DOCUMENTS) |
| HVR-banned words | None found |

**Files on disk:** `data-validator.ts`, `file-helpers.ts`, `index.ts`, `input-normalizer.ts`, `logger.ts`, `message-utils.ts`, `path-utils.ts`, `prompt-utils.ts`, `slug-utils.ts`, `task-enrichment.ts`, `tool-detection.ts`, `validation-utils.ts`, `README.md`

### Issue Found

| Issue | Location | Severity |
|-------|----------|----------|
| Stale file count in Verify Utilities code block | Section 2. QUICK START, line 89 | Low |

**Detail:** The README stated "Expected: 10 TypeScript files" but the folder contains 12 `.ts` files. The `slug-utils.ts` and `task-enrichment.ts` modules were added after the README was last updated but the count in the verification code block was not bumped. (The Key Statistics table and Structure tree were already correct at 12.)

**Action taken:** Updated line 89 from `# Expected: 10 TypeScript files` to `# Expected: 12 TypeScript files`.

**File modified:** `.opencode/skill/system-spec-kit/scripts/utils/README.md`

---

## Summary

| Folder | Status | Issues | Actions |
|--------|--------|--------|---------|
| `scripts/ops/` | PASS | 0 | None |
| `scripts/setup/` | PASS | 0 | None |
| `scripts/templates/` | PASS | 0 | None |
| `scripts/types/` | PASS | 0 | None |
| `scripts/utils/` | UPDATED | 1 (stale file count) | Fixed "10" to "12" in Verify Utilities block |

**Overall:** 4/5 folders fully aligned. 1 folder had a minor stale count that has been corrected.
