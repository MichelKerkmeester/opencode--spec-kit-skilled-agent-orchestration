---
title: "Templates"
description: "Spec Kit template system: where packet documents come from when create.sh scaffolds a new spec folder."
trigger_phrases:
  - "templates"
  - "template system"
  - "spec kit templates"
---

# Templates

Spec Kit packet documents come from this directory. When `create.sh` scaffolds a new spec folder at any Level, it resolves which documents apply, renders only the sections that belong to that Level, and writes the result into the new packet.

## 1. Subdirectories

| Path | Purpose | Audience |
|------|---------|----------|
| `manifest/` | Source of truth for every Level's required documents, lazy add-ons, section gates, and template versions. Holds 12 `*.md.tmpl` author templates plus `spec-kit-docs.json`. Maintainer-only. | Maintainers |
| `examples/` | Reference packets that show the rendered output for each Level. Read these when you want to see how a finished spec folder reads. | Anyone |
| `changelog/` | Historical record of template changes, version bumps, and architecture decisions. | Maintainers |
| `stress_test/` | Findings rubric and templates for spec-kit stress testing. Used by deep-research and deep-review loops to grade outputs. | Maintainers |
| `scratch/` | Temporary workspace for local debugging. Empty in checked-in state. | Anyone |

## 2. Render Flow

```
create.sh --level N --path PATH --name NAME
  └─> resolveLevelContract(N)
        └─> reads templates/manifest/spec-kit-docs.json
        └─> returns { requiredCoreDocs, requiredAddonDocs, lazyAddonDocs, sectionGates, templateVersions }
  └─> for each document in the contract:
        └─> reads templates/manifest/<doc>.md.tmpl
        └─> pipes through inline-gate-renderer (strips sections not gated for level N)
        └─> writes to PATH/<doc>.md
  └─> writes description.json + graph-metadata.json
```

The renderer keeps `<!-- IF level:N -->...<!-- /IF -->` blocks that match the requested Level and removes everything else. Section anchors (`<!-- ANCHOR:foo -->`) survive intact so memory-frontmatter parsers continue to work.

## 3. Where To Look

| Question | File |
|----------|------|
| Which docs does Level 3 need? | `manifest/spec-kit-docs.json` `levels.3.requiredCoreDocs` |
| What does a Level 3 `decision-record.md` look like? | `manifest/decision-record.md.tmpl` rendered at Level 3 |
| How do I add a new document type? | `manifest/EXTENSION_GUIDE.md` |
| How are legacy v2.1 markers handled? | `manifest/MIGRATION.md` |
| What sections does the validator expect for `spec.md` at Level 2? | `manifest/spec-kit-docs.json` `levels.2.sectionGates["spec.md"]` |
| What's the current template version for `plan.md`? | `manifest/spec-kit-docs.json` `versions["plan.md.tmpl"]` |

## 4. Vocabulary Discipline

Public surfaces talk about Level 1, Level 2, Level 3, Level 3+, and phase-parent packets. The internal taxonomy in `spec-kit-docs.json` (kinds, presets, capabilities, gates) is private and stays inside this directory, the resolver source, and maintainer docs. The workflow-invariance test enforces this on every commit.

## 5. Related

- Scaffolder: `../scripts/spec/create.sh`
- Resolver: `../mcp_server/lib/templates/level-contract-resolver.ts`
- Renderer: `../scripts/templates/inline-gate-renderer.ts` and the shell wrapper
- Validator: `../scripts/spec/validate.sh` plus rules under `../scripts/rules/`
