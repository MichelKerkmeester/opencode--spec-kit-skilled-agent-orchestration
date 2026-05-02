---
title: "034 sk-deep-research Review Folder Contract"
description: "Implementation packet for the sk-deep-research review-mode move into a dedicated review/ subfolder."
trigger_phrases:
  - "review folder packet"
  - "sk-deep-research review spec"
contextType: "general"
---
# 034 sk-deep-research Review Folder Contract

This packet now records the implemented review-mode folder migration for `sk-deep-research`. Durable review state no longer lives in `scratch/`. The landed contract moves the review packet into `review/`, adds a compatibility path for existing scratch-based review sessions, and includes a follow-up command-surface sync so both `specs/` and `.opencode/specs/` remain valid alias roots for deep-research entrypoints.

## Packet Contents

- `spec.md`: problem statement, scope, requirements, and success criteria
- `plan.md`: implementation phases, target layout, validation, and rollback
- `tasks.md`: implementation task breakdown and closeout status
- `checklist.md`: verification status, evidence, and remaining gaps
- `decision-record.md`: accepted architectural decisions for folder placement and legacy migration
- `implementation-summary.md`: post-implementation outcome, verification evidence, and known limitations

## Implemented Outcome

- Review auto and confirm workflows now store durable review artifacts under `{spec_folder}/review/`.
- Runtime `deep-review` agents across `.opencode`, `.claude`, `.codex`, and `.gemini` now use `review/` paths and review-only write permissions.
- Review-mode assets, references, command docs, SKILL docs, and playbooks were synchronized to the same packet layout.
- Legacy scratch-based review sessions now have an explicit scratch-to-review migration path for approved review artifacts.
- Shared deep-research command workflows now accept both `specs/` and `.opencode/specs/` alias roots for spec-folder validation without changing research-mode scratch storage.
- The `.agents/commands/spec_kit/deep-research.toml` wrapper now exposes the review-mode suffixes as part of its public metadata.

## Implementation Boundary

- In scope: `:review` mode plus directly related deep-research command-surface compatibility fixes required to keep review entrypoints reachable from either spec-root alias
- Out of scope: research-mode folder redesign and basename renaming

## Verification Snapshot

- YAML parsing passed for the two review workflow YAMLs and `review_mode_contract.yaml`.
- YAML parsing also passed for the shared deep-research auto and confirm workflow YAMLs after the alias-root guard fix.
- `git diff --check` passed across the touched deep-research workflow, wrapper, documentation, and packet files.
- Targeted runtime and docs sweeps confirmed `review/` across the intended behavior surfaces.
- Direct wrapper inspection confirmed the `.agents` deep-research TOML metadata now advertises the review-mode suffixes.
- No live fresh-review or legacy-fixture replay was executed in this session, so runtime migration behavior remains an explicit follow-up verification item.
