# Audit D-02: Cross-Spec Consistency

## Cross-Reference Validation
| Source | Target | Valid? |
|--------|--------|--------|
| `001-hybrid-rag-fusion-epic` | `006-measurement-foundation/` | No - referenced in the parent phase map, but the folder no longer exists; core sprint content is now consolidated under `005-core-rag-sprints-0-to-8`. |
| `001-hybrid-rag-fusion-epic` | `011-graph-signal-activation/` | No - referenced as Phase 2 in the parent map, but the folder is absent. |
| `001-hybrid-rag-fusion-epic` | `012-scoring-calibration/` | No - referenced as Phase 3 in the parent map, but the folder is absent. |
| `001-hybrid-rag-fusion-epic` | `013-query-intelligence/` | No - referenced as Phase 4 in the parent map, but the folder is absent. |
| `001-hybrid-rag-fusion-epic` | `014-feedback-and-quality/` | No - referenced as Phase 5 in the parent map, but the folder is absent. |
| `001-hybrid-rag-fusion-epic` | `015-pipeline-refactor/` | No - referenced as Phase 6 in the parent map, but the folder is absent. |
| `001-hybrid-rag-fusion-epic` | `016-indexing-and-graph/` | No - referenced as Phases 7a/7b in the parent map, but the folder is absent. |
| `001-hybrid-rag-fusion-epic` | `017-long-horizon/` | No - referenced as Phase 8 in the parent map, but the folder is absent. |
| `005-core-rag-sprints-0-to-8` | `000-feature-overview/spec.md` | No - every embedded sprint header points to this parent path, but the file does not exist. |
| `005-core-rag-sprints-0-to-8` | `011-graph-signal-activation/` | No - listed as successor/source folder inside the consolidated doc, but the folder does not exist. |
| `005-core-rag-sprints-0-to-8` | `012-scoring-calibration/`, `013-query-intelligence/`, `014-feedback-and-quality/`, `015-pipeline-refactor/`, `016-indexing-and-graph/`, `017-long-horizon/`, `018-deferred-features/` | No - all are referenced as live sprint folders or source folders inside the consolidation, but none exist as current spec folders. |
| `006-extra-features` | `008-combined-bug-fixes` | Yes - predecessor exists. |
| `006-extra-features` | `009-architecture-audit` | Yes - successor exists. |
| `009-architecture-audit` | `006-extra-features` | Yes - predecessor exists. |

## Contradictions Found
- No direct feature-behavior contradiction was found between `002-indexing-normalization`, `006-extra-features`, and `009-architecture-audit`; their scopes are mostly distinct.
- The main contradiction is **canonical-location drift**: `001-hybrid-rag-fusion-epic` still treats Sprint 0-8 work as a set of child folders (`006-measurement-foundation/` through `017-long-horizon/`), while `005-core-rag-sprints-0-to-8` says those sprint specs were consolidated into one document. Both cannot be the current canonical navigation model at the same time.
- `006-extra-features` says its predecessor includes "folded historical continuity from retired `009-architecture-audit`", but `009-architecture-audit` is present as an active `Complete` spec and names `006-extra-features` as its predecessor. That creates a contradictory lifecycle state for spec 009.
- `009-architecture-audit` also states that work previously tracked in `009-architecture-audit` was merged into the current `009-architecture-audit` spec, which is self-referential and likely meant to refer to another retired spec ID.

## Dependency Chain
- The logical dependency model is mostly sound:
  - `001` makes Sprint 0 the blocking foundation gate.
  - `005` preserves that gate and explicitly documents Sprint 1 / Sprint 2 parallelism after Sprint 0.
  - `006` then extends into extra operational/productization work, followed by `009` architecture-boundary audit work.
- The broken part is **dependency discoverability**: the parent and consolidated docs still point to retired or missing folders, so a reader cannot follow the dependency chain by links alone.
- Status alignment is not reliable from the documents:
  - `001` reports overall status as `In Progress (85%+ complete)`.
  - `005` mixes embedded statuses such as `Complete`, `Complete (Conditional Proceed)`, `Draft`, `Implemented`, and `Completed` inside one consolidated file.
  - `006` is `Draft`, while `009` is `Complete`.
  - Because `001` still points at obsolete child folders instead of the consolidated artifact, its roll-up cannot be verified mechanically against current child specs.

## Terminology Inconsistencies
- **Status vocabulary** is inconsistent: `Complete`, `Completed`, `Implemented`, `Draft`, and `Complete (Conditional Proceed)` are all used without a shared legend, making roll-up ambiguous.
- **Parent reference terminology** is inconsistent: specs use `Parent`, `Parent Spec`, bare root name ``022-hybrid-rag-fusion``, `../spec.md`, and `../000-feature-overview/spec.md` for parent linkage.
- `006-extra-features` refers to the "023 refinement program" even though the spec folder is under `022-hybrid-rag-fusion`; this is a numbering/identity inconsistency.
- `001` uses "phase" and "sprint" almost interchangeably, while `005` is a consolidation artifact containing many former sprint specs; that is understandable historically, but currently it obscures which document is authoritative.

## Issues [ISS-D02-NNN]
- **ISS-D02-001** - Parent phase map in `001-hybrid-rag-fusion-epic` points to non-existent child folders (`006-measurement-foundation` through `017-long-horizon`) instead of the current consolidated artifact `005-core-rag-sprints-0-to-8`.
- **ISS-D02-002** - `005-core-rag-sprints-0-to-8` retains stale references to non-existent parent path `000-feature-overview/spec.md` and to removed sprint folders (`011`-`018`), so internal navigation is broken.
- **ISS-D02-003** - Spec 009 lifecycle state is contradictory: `006-extra-features` treats `009-architecture-audit` as retired historical continuity, while `009-architecture-audit` is present and marked `Complete`.
- **ISS-D02-004** - `009-architecture-audit` contains self-referential merge language ("former spec `009-architecture-audit` is consolidated into this spec folder"), which makes lineage unclear.
- **ISS-D02-005** - Status terms are not normalized across the reviewed specs, so parent/child completion roll-up is not trustworthy.
- **ISS-D02-006** - `006-extra-features` uses `023` terminology inside the `022-hybrid-rag-fusion` track, creating naming drift across the same program.
