---
title: "Template Composition System"
description: "Level contract and inline rendering pipeline that generates Spec Kit packet documents from the current template source."
---

# Template Composition System

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. SOURCE METADATA](#4-source-metadata)

## 1. OVERVIEW

The Template Composition System is the current Spec Kit document-generation path. It resolves a public Level value, selects the required packet documents, renders inline Level gates, and writes the resulting `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, and any Level-specific verification or decision files directly into a target spec folder.

Its job is to keep scaffolding and validation on one contract. The same Level contract drives fresh packet creation, phase-parent creation, lazy support documents, and validator expectations, so generated packets and strict validation stay aligned.

## 2. CURRENT REALITY

The shipped behavior currently works as follows:

1. `create.sh` accepts Level 1, Level 2, Level 3, Level 3+, and phase-parent requests, then asks the Level contract resolver which documents belong in the target packet.
2. The resolver returns the required document list, lazy support-document list, section gates, and Level marker expected by downstream validation.
3. Whole-document template files carry inline `<!-- IF level:N -->` gates. `inline-gate-renderer.ts` strips blocks that do not apply to the requested Level before the document is written.
4. Level 1 packets receive the baseline four documents. Level 2 adds `checklist.md`. Level 3 and Level 3+ add `decision-record.md`, with Level 3+ retaining the extended governance sections. Phase-parent packets stay lean and write only the parent control documents.
5. Lazy support documents such as `handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, and `context-index.md` are rendered from the same template source when their owning workflow needs them.
6. Validators consume the same Level contract instead of carrying a separate file matrix. Missing-file, section, header, Level-match, and template-source checks therefore evaluate the same document set that scaffolding writes.
7. The workflow-invariance test protects public surfaces from leaking private implementation taxonomy. Public docs and generated packets keep Level vocabulary, while private maintainer files remain isolated.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts` | Resolver | Returns the document contract for each public Level |
| `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts` | Renderer | Applies inline Level gates before a document is written |
| `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh` | Shell wrapper | Lets shell scripts call the renderer without duplicating logic |
| `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh` | Shell helper | Exposes `resolve_level_contract` and shared template helpers |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Scaffolder | Creates Level and phase-parent packets from the resolver output |
| `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` | Validator | Verifies required files from the Level contract |
| `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` | Validator | Verifies Level-gated sections after rendering |

### Validation And Tests

| File | Focus |
|------|-------|
| `scripts/tests/level-contract-resolver.vitest.ts` | Resolver output for Level 1, Level 2, Level 3, Level 3+, and phase-parent packets |
| `scripts/tests/inline-gate-renderer.vitest.ts` | Inline gate grammar and render behavior |
| `scripts/tests/scaffold-golden-snapshots.vitest.ts` | Fresh scaffold snapshots across public Levels |
| `scripts/tests/template-structure.vitest.ts` | Rendered template structure and section expectations |
| `scripts/tests/workflow-invariance.vitest.ts` | Public vocabulary invariance across command, agent, catalog, playbook, and generated-doc surfaces |

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/30-template-composition-system.md`
