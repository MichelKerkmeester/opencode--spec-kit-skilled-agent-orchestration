---
title: "Session Extraction and Enrichment"
description: "Extractor-layer session enrichment for files, diagrams, and activity signals, plus the barrel exports that expose those capabilities to the rest of the session-capturing pipeline."
---

# Session Extraction and Enrichment

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Session Extraction and Enrichment is the extractor-surface slice that turns raw session telemetry into higher-value structures the save pipeline can render and rank.

Within the audited source set, that work spans three concrete behaviors: file extraction and semantic cleanup, diagram and phase extraction from conversation content, and session-activity signaling that helps downstream spec-folder selection prefer the folder that the session is actually touching. The local extractor barrel then re-exports those surfaces so callers can consume them as a single module boundary.

## 2. CURRENT REALITY

The shipped extractor behavior in this slice currently works as follows:

1. `file-extractor.ts` collects file references from three input shapes: canonical `FILES`, legacy `filesModified`, and file references embedded in observations/facts. Paths are normalized relative to the project root, keyed by canonical relative path, and collision cases are disambiguated with suffixed map keys instead of truncating or merging unrelated files.
2. File descriptions are ranked and merged instead of blindly overwritten. Cleaner, higher-tier descriptions replace weaker ones, while existing non-generic actions are preserved. The extractor also carries forward `_provenance`, `_synthetic`, and `MODIFICATION_MAGNITUDE` metadata and enforces the configured maximum file count.
3. Semantic enrichment in `enhanceFilesWithSemanticDescriptions()` prefers exact path matches first, then falls back to unique basename matches only when the basename is unambiguous. Specific actions like `Created`, `Deleted`, `Renamed`, and `Read` are intentionally preserved rather than downgraded back to generic `Modified`.
4. Observation anchoring in `buildObservationsWithAnchors()` classifies each observation into a semantic type such as bugfix, feature, refactor, decision, research, test, documentation, performance, or discovery; generates unique anchor IDs from the spec number and section category; and marks decision observations explicitly for downstream rendering.
5. Repeated tool-call observations are compacted by `deduplicateObservations()`. Consecutive repeats with the same normalized title and file set are merged, duplicate fact strings are removed, and the surviving narrative gains a `(repeated N times)` suffix so noisy telemetry does not explode the rendered memory.
6. `diagram-extractor.ts` scans observation narratives and coerced fact text for box-drawing and arrow characters, classifies detected diagrams with the flowchart generator, and returns a bounded ASCII payload plus pattern, complexity, timestamps, and related-file metadata for each detected diagram.
7. The same module derives conversation phases from observations by extracting tool usage from facts, ignoring prose-only tool mentions, classifying the phase for each observation, and summarizing up to three representative activities per phase. Those phases feed an auto-generated conversation flowchart even when no explicit user-authored diagram exists.
8. The extractor intentionally returns an empty `AUTO_DECISION_TREES` list to avoid duplicating decision-tree content that is already rendered through the per-decision template path. Null collected data also returns an empty diagram payload rather than a simulation fallback.
9. `session-activity-signal.ts` is an extractor-surface re-export for the shared activity scorer. The underlying builder matches candidate spec-folder tokens against observation paths, git-changed files, and transcript mentions, then computes a capped confidence boost with stronger weights for write tools (`0.3`), lower weights for read-like and inspect-like tools (`0.2` and `0.1`), `0.25` for matching git-changed files, and `0.1` for transcript mentions.
10. `extractors/index.ts` acts as the barrel boundary for this subsystem. It re-exports the file and diagram extractors, the session-activity signal, and adjacent extractor/helper modules so higher layers can import one stable extractor surface instead of wiring individual modules directly.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts` | Extractor | Normalizes file references, preserves richer description/action metadata, anchors observations, and deduplicates repeated observation noise |
| `.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts` | Extractor | Detects ASCII diagrams, summarizes conversation phases, and generates auto conversation-flow data |
| `.opencode/skill/system-spec-kit/scripts/extractors/session-activity-signal.ts` | Extractor boundary | Re-exports the shared session-activity signal builder into the extractor surface |
| `.opencode/skill/system-spec-kit/scripts/extractors/index.ts` | Barrel export | Exposes the extractor-layer API surface, including file, diagram, session, implementation-guide, contamination, quality, and activity-signal modules |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Session Extraction and Enrichment
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit of the extractor-layer files and their exported behavior
