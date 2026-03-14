# Audit D-08: Code Subdirectory README Audit

## Summary
| README | Exists | Accurate | Complete | Links Valid |
|--------|--------|----------|----------|------------|
| mcp_server/ | YES | NO | NO | YES |
| scripts/ | YES | NO | NO | YES |
| shared/ | YES | YES | NO | NO |
| root | YES | NO | NO | YES |

## Detailed Findings

### `.opencode/skill/system-spec-kit/mcp_server/README.md`
- **Existence:** Present.
- **Accuracy:** Broadly describes the MCP server correctly, but the documented tool totals are inconsistent with the codebase. The README overview says **25 MCP tools**, `mcp_server/package.json` says **23 tools**, and `tool-schemas.ts` currently defines **28 distinct tool names**.
- **Completeness:** The architecture and usage coverage is strong, but the top-level structure omits major directories that exist in the folder, notably `api/` and `schemas/`.
- **Links:** Relative markdown links resolve successfully.
- **Setup instructions:** Current enough to use. `npx tsc --noEmit` succeeds from `mcp_server/`, so the documented TypeScript-based setup path is still viable.
- **API documentation:** Good overall coverage for the MCP surface, but the counts need to be synchronized with the actual registered tools.

### `.opencode/skill/system-spec-kit/scripts/README.md`
- **Existence:** Present.
- **Accuracy:** The directory purpose is described correctly, but the inventory counts are stale. Examples:
  - `spec/` is documented as **8 lifecycle scripts**, but the directory currently contains **10 shell scripts** (`archive.sh`, `calculate-completeness.sh`, `check-completion.sh`, `check-placeholders.sh`, `create.sh`, `progressive-validate.sh`, `recommend-level.sh`, `test-validation.sh`, `upgrade-level.sh`, `validate.sh`).
  - `rules/` is documented as **16 modular validation rules**, but the directory currently contains **18 rule scripts** plus `README.md`.
- **Completeness:** Incomplete. The README omits major top-level areas and files that now exist, including `ops/`, `setup/`, `types/`, `utils/`, `test-fixtures/`, `check-api-boundary.sh`, `wrap-all-templates.sh`, and `wrap-all-templates.ts`.
- **Links:** Relative markdown links resolve successfully. The “Related READMEs” section lists files as code literals rather than clickable links, which hurts usability but does not create broken links.
- **Setup instructions:** Current and working. `npm run -s build` succeeds from `scripts/`.
- **API documentation:** Not really applicable; this README is functioning as an inventory/workflow doc for CLI and support scripts.

### `.opencode/skill/system-spec-kit/shared/README.md`
- **Existence:** Present.
- **Accuracy:** The README accurately describes `shared/` as the common library consumed by both `scripts/` and `mcp_server/`, and the major architectural explanation still matches the directory.
- **Completeness:** Incomplete. The structure section does not mention the `mcp_server/` shim directory that exists in `shared/`, and the README only documents part of the exported API surface in depth (mainly embeddings and trigger extraction).
- **Links:** Contains a broken internal relative link: `../ARCHITECTURE_BOUNDARIES.md` does not exist.
- **Setup instructions:** Technically current. `npx tsc --noEmit` succeeds from `shared/`, but the “30-Second Setup” section is really usage examples rather than true setup steps.
- **API documentation:** Partial. Library-facing APIs are documented for embeddings and trigger extraction, but other shared exports such as normalization, paths, config, chunking, and scoring helpers are only lightly covered.

### `.opencode/skill/system-spec-kit/README.md`
- **Existence:** Present.
- **Accuracy:** The top-level overview is useful, but some inventory claims are stale or incorrect:
  - The component map says `references/` contains **19 files**, but there are currently **25 markdown files** under `references/`.
  - The component map says `assets/` contains “workflow assets, YAML configs, checklists”, but the directory currently contains four markdown documents (`complexity_decision_matrix.md`, `level_decision_matrix.md`, `parallel_dispatch_config.md`, `template_mapping.md`) and no YAML files.
- **Completeness:** Incomplete. The high-level component map omits major current directories such as `shared/`, `config/`, `feature_catalog/`, and `manual_testing_playbook/`, even though they are part of the root folder.
- **Links:** Relative markdown links resolve successfully.
- **Setup instructions:** Current enough to use. `npm run -s typecheck` succeeds from `.opencode/skill/system-spec-kit/`.
- **API documentation:** Acceptable for an overview README because it delegates deeper details to subdirectory docs, but it should stop repeating stale counts copied from those lower-level docs.

## Issues

### ISS-D08-001 - `mcp_server/README.md` tool counts are inconsistent with the codebase
- **Impact:** Readers cannot trust the documented API size.
- **Evidence:** README says 25 tools, `mcp_server/package.json` says 23, and `tool-schemas.ts` currently exposes 28 distinct tool names.
- **Recommended fix:** Derive the published tool count from `tool-schemas.ts` and update all repeated totals in the README/package metadata together.

### ISS-D08-002 - `scripts/README.md` inventory is stale and omits major current directories/files
- **Impact:** The README no longer reflects the actual contents of `scripts/`.
- **Evidence:** `spec/` and `rules/` counts are outdated, and top-level items such as `setup/`, `ops/`, `types/`, `utils/`, `test-fixtures/`, and wrapper scripts are missing from the inventory snapshot.
- **Recommended fix:** Refresh the inventory snapshot from the current directory tree and convert “Related READMEs” into real markdown links.

### ISS-D08-003 - `shared/README.md` contains a broken internal link and only partial API coverage
- **Impact:** Navigation is broken and consumers do not get a full picture of the shared library surface.
- **Evidence:** `../ARCHITECTURE_BOUNDARIES.md` does not exist; the README deeply documents embeddings/trigger extraction but only lightly covers other shared exports.
- **Recommended fix:** Remove or replace the broken boundary doc link, add the missing `mcp_server/` shim to the structure section, and expand API coverage for the other shared modules.

### ISS-D08-004 - Root `README.md` has stale inventory counts and misses major subdirectories
- **Impact:** The top-level README understates the current scope of the skill workspace.
- **Evidence:** `references/` is documented as 19 files but currently contains 25 markdown files; the component map also omits `shared/`, `config/`, `feature_catalog/`, and `manual_testing_playbook/`.
- **Recommended fix:** Refresh the component map and directory structure section from the current root tree, and remove stale asset/reference counts unless they are generated automatically.
