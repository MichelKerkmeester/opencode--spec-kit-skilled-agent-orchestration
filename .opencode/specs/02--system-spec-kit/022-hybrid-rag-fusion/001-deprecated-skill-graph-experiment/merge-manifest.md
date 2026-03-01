# Merge Manifest: Skill-Graph Legacy Consolidation into 013

<!-- SPECKIT_LEVEL: 3 -->
<!-- ANCHOR:merge-manifest -->

## Purpose

This manifest defines `001-deprecated-skill-graph-experiment` as the **single active skill-graph-related subfolder** in `138-hybrid-rag-fusion` and records the non-destructive consolidation of legacy child folders.

- Active canonical folder: `001-deprecated-skill-graph-experiment/`
- Archive root: `z_archive/skill-graph-legacy/`
- Preservation rule: source folders moved intact (no content deletion)

## Source-to-Archive Mapping

| Source Folder | Consolidated Into 013 | Archive Destination |
|---|---|---|
| `002-skill-graph-integration/` | Historical SGQS migration scope, completion evidence, and workstream references summarized in `013/spec.md`, `013/implementation-summary.md`, and this manifest | `z_archive/skill-graph-legacy/002-skill-graph-integration/` |
| `003-unified-graph-intelligence/` | Historical unified graph adapter/integration outcomes and status captured in `013/implementation-summary.md` and this manifest | `z_archive/skill-graph-legacy/003-unified-graph-intelligence/` |
| `006-skill-graph-utilization/` | Legacy utilization testing outcomes captured in this manifest and `013/implementation-summary.md` | `z_archive/skill-graph-legacy/006-skill-graph-utilization/` |
| `007-skill-graph-improvement/` | Gap-fix and benchmark recovery context captured in this manifest and `013/implementation-summary.md` | `z_archive/skill-graph-legacy/007-skill-graph-improvement/` |
| `009-skill-graph-score-recovery/` | Milestone 3.5 score-recovery context and additive strict re-score references captured in this manifest and `013/implementation-summary.md` | `z_archive/skill-graph-legacy/009-skill-graph-score-recovery/` |
| `012-deprecate-skill-graph-and-readme-indexing/` | Prior deprecation pass lineage consolidated into `013` as completion pass 2 baseline | `z_archive/skill-graph-legacy/012-deprecate-skill-graph-and-readme-indexing/` |

## Consolidated Content Index

### 002-skill-graph-integration
- Level 3+ lifecycle docs preserved (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
- Auxiliary artifacts preserved (`README.md`, `research.md`, `handover.md`, `memory/`)
- Consolidated as legacy foundation for skill-graph workstream history

### 003-unified-graph-intelligence
- Level 3+ lifecycle docs preserved (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
- Handover and memory context preserved
- Consolidated as legacy graph-intelligence integration history

### 006-skill-graph-utilization
- Level 1 docs preserved (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `memory/`)
- Consolidated as legacy utilization validation history

### 007-skill-graph-improvement
- Level 2 docs preserved (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- Performance report preserved (`final-test-results.md`)
- Consolidated as legacy gap-fix history

### 009-skill-graph-score-recovery
- Level 2 docs preserved (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- Recovery handbook preserved (`README.md`)
- Consolidated as legacy score-recovery history

### 012-deprecate-skill-graph-and-readme-indexing
- Level 3 docs preserved (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`)
- Consolidated as predecessor baseline for 013 completion pass

## Active-State Rule

After this consolidation:
- `001-deprecated-skill-graph-experiment/` is the only active skill-graph-related child folder.
- All listed legacy skill-graph folders are archived under `z_archive/skill-graph-legacy/`.
- Historical detail remains intact via archived folder contents.

<!-- /ANCHOR:merge-manifest -->
