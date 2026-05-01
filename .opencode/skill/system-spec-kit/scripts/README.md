---
title: "System-Spec-Kit Scripts"
description: "Current script inventory and execution flow for system-spec-kit scripts."
trigger_phrases:
  - "spec kit scripts"
  - "validation scripts"
  - "memory save script"
  - "upgrade level workflow"
---


# System-Spec-Kit Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. INVENTORY SNAPSHOT](#2-inventory-snapshot)
- [3. POST-SPEC124/128/129 WORKFLOW](#3-post-spec124128129-workflow)
- [4. BUILD AND RUNTIME](#4-build-and-runtime)
- [5. RELATED READMES](#5-related-readmes)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This directory contains the shell and TypeScript tooling that powers spec creation, upgrades, validation, memory save, packet graph metadata refresh/backfill, context indexing, and targeted Vitest regressions around hardened script behavior.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:inventory-snapshot -->
## 2. INVENTORY SNAPSHOT


Top-level files with extensions (8 including this README):
- `README.md`
- `check-api-boundary.sh`
- `check-links.sh`
- `common.sh`
- `package.json`
- `registry-loader.sh`
- `scripts-registry.json`
- `tsconfig.json`

Primary script directories:
- `spec/` - 12 lifecycle scripts (`create.sh`, `upgrade-level.sh`, `check-placeholders.sh`, `validate.sh`, `progressive-validate.sh`, `test-validation.sh`, `check-completion.sh`, `calculate-completeness.sh`, `recommend-level.sh`, `archive.sh`, `check-template-staleness.sh`, `quality-audit.sh`)
- `spec-folder/` - 5 TypeScript modules (`generate-description.ts`, `folder-detector.ts`, `alignment-validator.ts`, `directory-setup.ts`, `index.ts`)
- `rules/` - 21 files total: 20 shell validation rules plus directory README (`0` TypeScript rule files; `LINKS_VALID` runs only when `SPECKIT_VALIDATE_LINKS=true`)
- `graph/` - 1 TypeScript backfill CLI (`backfill-graph-metadata.ts`) for repo-wide `graph-metadata.json` dry-runs and writes
- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
- `core/` - 17 TypeScript workflow modules plus barrel export
- `config/` - 1 TypeScript configuration module (`index.ts`)
- `extractors/` - 14 files total (12 TypeScript extraction modules, barrel export, and directory README)
- `loaders/` - 1 TypeScript loading module (`data-loader.ts`) plus barrel export
- `renderers/` - 1 TypeScript rendering module (`template-renderer.ts`) plus barrel export
- `utils/` - 19 TypeScript utility modules plus barrel export
- `types/` - TypeScript type definitions (`session-types.ts`)
- `lib/` - 17 TypeScript libraries plus 3 shell helper libraries
- `evals/` - 16 evaluation assets including 14 scripts, policy allowlist, and directory README
- `ops/` - 5 shell healing/runbook scripts plus shared helper (`ops-common.sh`)
- `setup/` - 6 setup files including prerequisite checks, native-module rebuild helpers, installer, Node version recorder, and directory README
- `scratch/` - empty-by-default workspace for temporary script artifacts and local debugging notes
- `kpi/` - shell KPI scripts (`quality-kpi.sh`)
- `tests/` - JS, shell, Python, and Vitest regression suites for scripts and modules
- `test-fixtures/` - 62 numbered fixture directories for validation rule testing
- `templates/` - inline renderer shell and TypeScript sources for manifest template rendering


<!-- /ANCHOR:inventory-snapshot -->
<!-- ANCHOR:post-spec124128129-workflow -->
## 3. POST-SPEC124/128/129/136-139 WORKFLOW


For spec-level upgrades and memory-safe docs flow:
1. Run `spec/upgrade-level.sh` to inject level-specific template sections.
2. Auto-populate injected placeholders from existing spec context (no placeholder text left behind).
3. Run `spec/check-placeholders.sh` to confirm placeholder cleanup.
4. Run `spec/validate.sh` to enforce rule checks, including anchor checks.
5. Run `spec/check-completion.sh` before claiming completion.

Anchor requirements introduced in this workflow are validated by `rules/check-anchors.sh` and enforced through `spec/validate.sh`.

Phase workflow additions (specs 138-139):
- `spec/create.sh --phase` supports phase-based spec folder decomposition.
- `spec/validate.sh --recursive` validates parent and child phase folders.


<!-- /ANCHOR:post-spec124128129-workflow -->
<!-- ANCHOR:build-and-runtime -->
## 4. BUILD AND RUNTIME


`scripts/` is pure ESM at runtime (`package.json` sets `"type": "module"`). TypeScript sources compile to ESM (`"module": "es2022"`) and local runtime imports use `.js` specifiers so the generated `dist/` entrypoints run under both Node 25 and the legacy Node 20.19.x target.

TypeScript sources compile to `dist/` (generated build output; do not edit or commit by hand):

```bash
cd .opencode/skill/system-spec-kit/scripts
npm run build
```

> **Note:** `dist/` directories contain build output generated from TypeScript sources via `tsc --build`. They are not source of truth and should not be checked into version control. Edit the `.ts` source files and rebuild instead. See [ARCHITECTURE.md](../ARCHITECTURE.md) for the full dist/ policy.

Memory save entrypoint (required by Memory Save Rule):

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<###-spec-name>
```

Canonical saves now refresh the root `graph-metadata.json` packet contract as part of the same workflow run. For repo-wide coverage and rollout backfill, use:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run
node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js
```

Use `/spec_kit:resume` for active recovery; canonical continuity lives in `handover.md -> _memory.continuity -> spec docs`, while generated `memory/` output remains supporting/indexed material.

Direct positional saves are not supported; use structured JSON. Explicit CLI targets remain authoritative in structured-input modes, and phase-folder saves write into that selected phase folder's `memory/` directory.

JSON mode is also supported:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<###-spec-name>
```

Direct positional mode now exits non-zero with migration guidance to `--json`, `--stdin`, or a JSON temp file.

Generated memories are now blocked before write/index when they violate the rendered-memory contract:
- missing required frontmatter keys
- missing mandatory anchors or HTML ids
- raw Mustache/template leakage
- duplicate top-of-body separators
- aligned but under-evidenced saves that now fail `INSUFFICIENT_CONTEXT_ABORT`


<!-- /ANCHOR:build-and-runtime -->
<!-- ANCHOR:related-readmes -->
## 5. RELATED READMES


- `spec/README.md`
- `spec-folder/README.md`
- `core/README.md`
- `memory/README.md`
- `tests/README.md`
- `extractors/README.md`
- `loaders/README.md`
- `renderers/README.md`
- `utils/README.md`
- `types/README.md`
- `lib/README.md`
- `evals/README.md`
- `ops/README.md`
- `setup/README.md`
- `kpi/README.md`
- `test-fixtures/README.md`
- `templates/README.md`
<!-- /ANCHOR:related-readmes -->
