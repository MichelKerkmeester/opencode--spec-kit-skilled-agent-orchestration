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

- [1. OVERVIEW](#1--overview)
- [2. INVENTORY SNAPSHOT](#2--inventory-snapshot)
- [3. POST-SPEC124/128/129 WORKFLOW](#3--post-spec124128129-workflow)
- [4. BUILD AND RUNTIME](#4--build-and-runtime)
- [5. RELATED READMES](#5--related-readmes)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This directory contains the shell and TypeScript tooling that powers spec creation, upgrades, validation, memory save, context indexing, and targeted Vitest regressions around hardened script behavior.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:inventory-snapshot -->
## 2. INVENTORY SNAPSHOT


Top-level files:
- `common.sh`
- `check-links.sh`
- `registry-loader.sh`
- `scripts-registry.json`
- `package.json`
- `tsconfig.json`

Primary script directories:
- `spec/` - 8 lifecycle scripts (`create.sh`, `upgrade-level.sh`, `check-placeholders.sh`, `validate.sh`, `check-completion.sh`, `calculate-completeness.sh`, `recommend-level.sh`, `archive.sh`)
- `rules/` - 16 modular validation rules used by `spec/validate.sh` (`LINKS_VALID` runs only when `SPECKIT_VALIDATE_LINKS=true`)
- `memory/` - 7 TypeScript CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`)
- `core/` - 8 TypeScript workflow modules
- `extractors/` - 11 TypeScript extraction modules plus barrel export
- `loaders/` - 2 TypeScript loading modules plus barrel export
- `renderers/` - 2 TypeScript rendering modules plus barrel export
- `lib/` - 11 TypeScript libraries plus 3 shell helper libraries
- `evals/` - 8 evaluation scripts (redaction calibration, phase1-5 shadow eval, quality backfill, performance benchmarks, closure metrics, telemetry dashboard, quality legacy remediation)
- `kpi/` - shell KPI scripts (`quality-kpi.sh`)
- `tests/` - JS, shell, Python, and Vitest regression suites for scripts and modules
- `templates/` - wrapper/composition helpers for template packaging workflows


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


TypeScript sources compile to `dist/`:

```bash
cd .opencode/skill/system-spec-kit/scripts
npm run build
```

Memory save entrypoint (required by Memory Save Rule):

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/<###-spec-name>
```

Direct saves must target a root spec folder. If an explicit CLI path resolves to a phase folder, the command fails with an error that points to the owning root spec folder.

JSON mode is also supported:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
```


<!-- /ANCHOR:build-and-runtime -->
<!-- ANCHOR:related-readmes -->
## 5. RELATED READMES


- `spec/README.md`
- `core/README.md`
- `memory/README.md`
- `tests/README.md`
- `extractors/README.md`
- `loaders/README.md`
- `renderers/README.md`
- `lib/README.md`
- `templates/README.md`
<!-- /ANCHOR:related-readmes -->
