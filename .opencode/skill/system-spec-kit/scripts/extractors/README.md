---
title: "Data Extractors"
description: "Extractor inventory for session, conversation, decision, file, and implementation data capture."
trigger_phrases:
  - "data extractors"
  - "collect session data"
  - "decision extraction"
---

# Data Extractors

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. SCRIPT IO](#2-script-io)
- [3. ENTRYPOINTS](#3-entrypoints)
- [4. VALIDATION FROM REPO ROOT](#4-validation-from-repo-root)
- [5. KEY FILES](#5-key-files)
- [6. BOUNDARIES](#6-boundaries)
- [7. RELATED](#7-related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/extractors/` converts normalized session input into structured conversation, decision, file, implementation, git, and spec-folder data used by template rendering and indexing workflows.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:script-io -->
## 2. SCRIPT IO

| Flow | Input | Output |
| --- | --- | --- |
| Session collection | Normalized loader data plus optional runtime context | Aggregated session data for rendering |
| Content extraction | Conversation, file, decision, diagram, and implementation inputs | Typed facts and summaries |
| Enrichment | Git and spec-folder context | Additional context for generated artifacts |
| Quality scoring | Extracted data | Quality score and validation signals |

<!-- /ANCHOR:script-io -->
<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

- `collectSessionData()` coordinates loader output, extraction modules, enrichment, and scoring.
- `extractConversationData()`, `extractDecisionData()`, `extractFileData()`, and `extractSessionData()` provide focused extraction surfaces.
- `extractGitContext()` and `extractSpecFolderContext()` enrich captured-session data.
- `scoreExtractionQuality()` evaluates extracted data before downstream rendering.
- `index.ts` re-exports the extractor surface used by compiled scripts.

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation-from-repo-root -->
## 4. VALIDATION FROM REPO ROOT

Run extractor validation from the repository root:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
node -e "const extractors=require('./.opencode/skill/system-spec-kit/scripts/dist/extractors'); console.log(Object.keys(extractors).sort())"
python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts/extractors
```

<!-- /ANCHOR:validation-from-repo-root -->
<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `collect-session-data.ts` | Coordinates extraction across observations, files, decisions, and context |
| `contamination-filter.ts` | Removes contamination from extraction outputs before use |
| `conversation-extractor.ts` | Extracts conversation-level facts and summaries |
| `decision-extractor.ts` | Extracts decisions and decision metadata |
| `diagram-extractor.ts` | Extracts diagram-ready content |
| `file-extractor.ts` | Extracts changed-file context |
| `git-context-extractor.ts` | Enriches captured sessions with git context |
| `implementation-guide-extractor.ts` | Extracts implementation guidance from source data |
| `quality-scorer.ts` | Scores extraction quality and validation signals |
| `session-activity-signal.ts` | Detects session activity signals for capture gating |
| `session-extractor.ts` | Extracts session-level facts and metadata |
| `spec-folder-extractor.ts` | Reads spec-folder context for capture enrichment |
| `index.ts` | Barrel export for extractor modules |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 6. BOUNDARIES

- Extractors consume normalized data; source selection and path validation belong to loaders.
- Extractors do not render markdown, write files, or persist index rows.
- Runtime imports should use compiled modules under `scripts/dist/extractors/`.

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:related -->
## 7. RELATED

- `../loaders/README.md`
- `../renderers/README.md`
- `../utils/README.md`

<!-- /ANCHOR:related -->
