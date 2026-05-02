---
title: "Resource Map: Missing Code READMEs Resource Map [template:resource-map.md]"
description: "Exact Task #36 manifest and implementation evidence for 65 target README files."
trigger_phrases:
  - "65 target readme manifest"
  - "missing code readmes"
  - "task 36 readme batches"
  - "readme folders b01 b17"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map"
    last_updated_at: "2026-05-02T16:15:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created all 65 target README files from the exact manifest"
    next_safe_action: "Review git diff and summarize completed README implementation"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/052-missing-code-readmes-resource-map/resource-map.md"
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total original targets**: 68
- **Unique existing folders**: 65
- **Existing READMEs among target folders at audit time**: 0
- **Target README files created**: 65
- **Folders missing README.md after implementation**: 0
- **Missing target paths**: 0
- **File-path mappings**: 3 original file targets normalize to `.opencode/skill/system-spec-kit/mcp_server/lib/description`
- **Batches**: B01-B17 from Task #36
- **Scope**: phase-local manifest plus README implementation evidence
- **Generated**: 2026-05-02T14:05:00Z

> **Action vocabulary**: `Analyzed` · `Mapped` · `Validated` · `Cited`.
> **Status vocabulary**: `CREATED` (target README now exists) · `MAPPED_FILE` (file target normalized to containing folder).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:normalization -->
## Normalization Rules

- Each listed folder existed on disk and lacked `README.md` at the time of Task #36 manifest verification.
- The three file targets below are not separate README targets; they map to their containing folder.
- SMALL folders get concise READMEs without detailed diagram/topology sections.
- This phase created only the target README files listed in this manifest.

| Original File Target | Normalized Folder | Status |
|----------------------|-------------------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/description/description-merge.ts` | `.opencode/skill/system-spec-kit/mcp_server/lib/description` | MAPPED_FILE |
| `.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts` | `.opencode/skill/system-spec-kit/mcp_server/lib/description` | MAPPED_FILE |
| `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts` | `.opencode/skill/system-spec-kit/mcp_server/lib/description` | MAPPED_FILE |
<!-- /ANCHOR:normalization -->

---

<!-- ANCHOR:batches -->
## Batches B01-B17

| Batch | Folder Targets | Notes |
|-------|----------------|-------|
| B01 | 4 | Shared ranking and scripts validation/templates/optimizer. |
| B02 | 4 | Scripts observability/graph/config plus code_graph tests. |
| B03 | 4 | Code graph tools, mcp_server data, skill-graph handler, test helpers. |
| B04 | 4 | MCP server lib templates, skill-graph, rag, query. |
| B05 | 4 | Deep-loop, description, discovery, plugin_bridges. |
| B06 | 4 | Shared algorithms/contracts/embeddings/lib. |
| B07 | 4 | Shared parsing/predicates/ranking/scoring. |
| B08 | 4 | Shared utils/root plus skill_advisor tools/tests cache. |
| B09 | 4 | Skill advisor tests compat/fixtures/handlers/hooks. |
| B10 | 4 | Skill advisor tests legacy/parity/python/schemas. |
| B11 | 4 | Skill advisor tests scorer/root plus scripts/schemas. |
| B12 | 4 | Skill advisor lib root/auth/compat/corpus. |
| B13 | 4 | Skill advisor lib daemon/derived/freshness/lifecycle. |
| B14 | 4 | Skill advisor lib scorer/shadow/utils plus handlers. |
| B15 | 4 | Skill advisor bench/compat/data plus stress_test code-graph. |
| B16 | 4 | Stress test matrix/memory/search-quality/session. |
| B17 | 1 | Stress test skill-advisor. |
<!-- /ANCHOR:batches -->

---

<!-- ANCHOR:manifest -->
## 65-Folder README Manifest

| # | Batch | Folder | README Status | Detail Rule |
|---|-------|--------|---------------|-------------|
| 1 | B01 | `.opencode/skill/system-spec-kit/shared/ranking` | CREATED | SMALL |
| 2 | B01 | `.opencode/skill/system-spec-kit/scripts/validation` | CREATED | SMALL |
| 3 | B01 | `.opencode/skill/system-spec-kit/scripts/templates` | CREATED | SMALL |
| 4 | B01 | `.opencode/skill/system-spec-kit/scripts/optimizer` | CREATED | SMALL |
| 5 | B02 | `.opencode/skill/system-spec-kit/scripts/observability` | CREATED | SMALL |
| 6 | B02 | `.opencode/skill/system-spec-kit/scripts/graph` | CREATED | SMALL |
| 7 | B02 | `.opencode/skill/system-spec-kit/scripts/config` | CREATED | SMALL |
| 8 | B02 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests` | CREATED | MEDIUM |
| 9 | B03 | `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools` | CREATED | SMALL |
| 10 | B03 | `.opencode/skill/system-spec-kit/mcp_server/data` | CREATED | SMALL |
| 11 | B03 | `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph` | CREATED | SMALL |
| 12 | B03 | `.opencode/skill/system-spec-kit/mcp_server/lib/test-helpers` | CREATED | SMALL |
| 13 | B04 | `.opencode/skill/system-spec-kit/mcp_server/lib/templates` | CREATED | SMALL |
| 14 | B04 | `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph` | CREATED | SMALL |
| 15 | B04 | `.opencode/skill/system-spec-kit/mcp_server/lib/rag` | CREATED | SMALL |
| 16 | B04 | `.opencode/skill/system-spec-kit/mcp_server/lib/query` | CREATED | SMALL |
| 17 | B05 | `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop` | CREATED | SMALL |
| 18 | B05 | `.opencode/skill/system-spec-kit/mcp_server/lib/description` | CREATED | MEDIUM |
| 19 | B05 | `.opencode/skill/system-spec-kit/mcp_server/lib/discovery` | CREATED | SMALL |
| 20 | B05 | `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges` | CREATED | SMALL |
| 21 | B06 | `.opencode/skill/system-spec-kit/mcp_server/shared/algorithms` | CREATED | SMALL |
| 22 | B06 | `.opencode/skill/system-spec-kit/mcp_server/shared/contracts` | CREATED | SMALL |
| 23 | B06 | `.opencode/skill/system-spec-kit/mcp_server/shared/embeddings` | CREATED | SMALL |
| 24 | B06 | `.opencode/skill/system-spec-kit/mcp_server/shared/lib` | CREATED | SMALL |
| 25 | B07 | `.opencode/skill/system-spec-kit/mcp_server/shared/parsing` | CREATED | SMALL |
| 26 | B07 | `.opencode/skill/system-spec-kit/mcp_server/shared/predicates` | CREATED | SMALL |
| 27 | B07 | `.opencode/skill/system-spec-kit/mcp_server/shared/ranking` | CREATED | SMALL |
| 28 | B07 | `.opencode/skill/system-spec-kit/mcp_server/shared/scoring` | CREATED | SMALL |
| 29 | B08 | `.opencode/skill/system-spec-kit/mcp_server/shared/utils` | CREATED | SMALL |
| 30 | B08 | `.opencode/skill/system-spec-kit/mcp_server/shared` | CREATED | LARGE |
| 31 | B08 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools` | CREATED | SMALL |
| 32 | B08 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/cache` | CREATED | SMALL |
| 33 | B09 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat` | CREATED | SMALL |
| 34 | B09 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/fixtures` | CREATED | SMALL |
| 35 | B09 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers` | CREATED | SMALL |
| 36 | B09 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/hooks` | CREATED | SMALL |
| 37 | B10 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy` | CREATED | SMALL |
| 38 | B10 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/parity` | CREATED | SMALL |
| 39 | B10 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python` | CREATED | SMALL |
| 40 | B10 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/schemas` | CREATED | SMALL |
| 41 | B11 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer` | CREATED | SMALL |
| 42 | B11 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests` | CREATED | LARGE |
| 43 | B11 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts` | CREATED | MEDIUM |
| 44 | B11 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas` | CREATED | SMALL |
| 45 | B12 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib` | CREATED | LARGE |
| 46 | B12 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/auth` | CREATED | SMALL |
| 47 | B12 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat` | CREATED | SMALL |
| 48 | B12 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus` | CREATED | SMALL |
| 49 | B13 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon` | CREATED | SMALL |
| 50 | B13 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived` | CREATED | SMALL |
| 51 | B13 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness` | CREATED | SMALL |
| 52 | B13 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle` | CREATED | SMALL |
| 53 | B14 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer` | CREATED | MEDIUM |
| 54 | B14 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/shadow` | CREATED | SMALL |
| 55 | B14 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/utils` | CREATED | SMALL |
| 56 | B14 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers` | CREATED | SMALL |
| 57 | B15 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/bench` | CREATED | SMALL |
| 58 | B15 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/compat` | CREATED | SMALL |
| 59 | B15 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/data` | CREATED | SMALL |
| 60 | B15 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph` | CREATED | SMALL |
| 61 | B16 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/matrix` | CREATED | SMALL |
| 62 | B16 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory` | CREATED | SMALL |
| 63 | B16 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality` | CREATED | SMALL |
| 64 | B16 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/session` | CREATED | SMALL |
| 65 | B17 | `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor` | CREATED | SMALL |
<!-- /ANCHOR:manifest -->

---

<!-- ANCHOR:author-instructions -->
## Implementation Evidence

- 65 target README files were created from B01-B17.
- Each target README was validated with `python3 .opencode/skill/sk-doc/scripts/validate_document.py <README.md>`.
- Final manifest verification found 65 total targets, 0 missing files, 0 empty files, and 0 placeholder matches.
- Strict phase validation passed with 0 errors and 0 warnings.
- SMALL folders received concise README coverage only: purpose, key files, usage notes, validation, and related resources.
- MEDIUM/LARGE folders use compact architecture or topology only where helpful.
<!-- /ANCHOR:author-instructions -->
