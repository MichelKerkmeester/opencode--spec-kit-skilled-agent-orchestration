# Discovery Summary: Spec & Memory Compliance Audit

**Date**: 2026-03-31
**Phase**: 1 — Discovery & Baseline

---

## Folder Scan Results

### Active Folders (121 scanned = 66 top-level + 55 phase children)

| Category | Scanned | With Errors | Pass Rate |
|----------|---------|-------------|-----------|
| 00--ai-systems-non-dev | 16 | 15 | 6% |
| 01--anobel.com | 7 | 7 | 0% |
| 02--system-spec-kit | 51 | 33 | 35% |
| 03--commands-and-skills | 38 | 32 | 16% |
| 04--agent-orchestration | 10 | 10 | 0% |
| **Total** | **122** | **97** | **20%** |

### Archived Folders (65 scanned)

| Category | Scanned | With Errors | Pass Rate |
|----------|---------|-------------|-----------|
| 01--anobel.com/z_archive | 28 | 28 | 0% |
| 02--system-spec-kit/z_archive | 20 | 20 | 0% |
| 04--agent-orchestration/z_archive | 17 | 17 | 0% |
| **Total** | **65** | **65** | **0%** |

### Combined

- **Total folders scanned**: 187 (122 active + 65 archived)
- **Folders with errors**: 162 (97 active + 65 archived)
- **Overall pass rate**: 13%

---

## Error Rule Distribution (Active Folders)

| Rule | Cat 00 | Cat 02 | Cat 03 | Total (partial) |
|------|--------|--------|--------|-----------------|
| TEMPLATE_HEADERS | 8 | 25 | 21 | 54+ |
| SPEC_DOC_INTEGRITY | 5 | 18 | 25 | 48+ |
| ANCHORS_VALID | 8 | 18 | 15 | 41+ |
| FILE_EXISTS | 9 | 17 | 9 | 35+ |
| LEVEL_MATCH | 9 | 16 | 6 | 31+ |
| TEMPLATE_SOURCE | 0 | 15 | 3 | 18+ |
| AI_PROTOCOL | 0 | 1 | 0 | 1+ |

**Top 3 issues**: TEMPLATE_HEADERS (structural deviations), SPEC_DOC_INTEGRITY (broken refs/metadata), ANCHORS_VALID (missing anchors)

---

## Frontmatter Status

- **Total files scanned**: 2193
- **Need frontmatter changes**: 2081 (95%)
- **Already compliant**: 69 (3%)
- **Malformed frontmatter**: 43 (2%)
- **By type**: memory (135), checklist (322), decision_record (119), handover (32), impl-summary (288), plan (390), research (41), spec (398), tasks (345)

---

## Memory System Status

- **Status**: healthy
- **Memory count**: 1004
- **Vector count**: 1001
- **Orphaned vectors**: 2 (dry-run)
- **Embedding provider**: Voyage AI (voyage-4, 1024-dim)
- **Vector search**: available
- **Failed embeddings**: 1
- **Alias conflicts**: 0

---

## Database Status

- **Path**: `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite`
- **Connected**: yes
- **Healthy**: yes
- **Version**: 1.8.0

---

## Skip List

Per user instruction, these 2 top-level folders are SKIPPED (actively being worked on):
1. `02--system-spec-kit/023-esm-module-compliance` (top-level only)
2. `02--system-spec-kit/024-compact-code-graph` (top-level only)

Their phase children ARE in scope.

---

## Memory Quality Validation (V-rules)

| Metric | Count |
|--------|-------|
| Total memory files | 135 |
| Pass | 84 (62%) |
| Fail | 51 (38%) |
| Hard-block violations | 46 |
| Soft violations | 5 |

### Hard-block Violations by Rule

| Rule | Count | Description |
|------|-------|-------------|
| V8 | 23 | Foreign-spec contamination |
| V12 | 20 | Zero topical overlap |
| V2+V8 | 1 | Multiple violations |
| V6+V8 | 1 | Template remnants + contamination |
| V8+V12 | 1 | Contamination + zero overlap |

### Hard-block Files (46 total — to be deleted in Phase 3)

See `research/hard-block-memories.txt` for full list.

---

## Remediation Strategy

### Automated (run first)
1. `backfill-frontmatter.js --apply --include-archive` — fixes 2081 frontmatter issues
2. `cleanup-orphaned-vectors.js` — removes 2 orphaned vectors

### Manual (agent-assisted)
3. Fix TEMPLATE_HEADERS deviations per folder (54+ instances)
4. Fix ANCHORS_VALID missing anchors (41+ instances)
5. Fix SPEC_DOC_INTEGRITY broken references (48+ instances)
6. Fix FILE_EXISTS missing required files (35+ instances)
7. Fix LEVEL_MATCH consistency issues (31+ instances)
8. Fix TEMPLATE_SOURCE missing headers (18+ instances)

### Estimated scope
- ~162 folders need at least one fix
- ~2081 files need frontmatter normalization (automated)
- ~43 files have malformed frontmatter (manual investigation)
