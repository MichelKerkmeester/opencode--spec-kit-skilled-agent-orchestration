---
title: "Research metadata backfill"
description: "The implementation added a research-tree backfill script that creates missing description.json and graph-metadata.json files under research iteration folders without rewriting complete folders."
---

# Research metadata backfill

## 1. OVERVIEW

The implementation added a research-tree backfill script that creates missing `description.json` and `graph-metadata.json` files under research iteration folders without rewriting complete folders.

This is a tooling surface rather than a runtime MCP tool. It exists to repair packet metadata coverage for research iteration trees so canonical save and retrieval flows can rely on the same packet metadata contract throughout the corpus.

---

## 2. CURRENT REALITY

Commit `88063287b` introduced `scripts/memory/backfill-research-metadata.ts`.

The script walks `research/*/iterations/` subtrees and only writes metadata files when they are missing. That makes it safe for corpus repair runs where some iteration folders predate the canonical metadata contract while later folders are already complete. The the canonical save fix uses this script as a follow-up step when a target packet includes research children, which means new canonical saves now keep research iteration metadata coverage from lagging behind the root packet.

The script is deliberately narrow: it is not a full regenerate-everything pass like the broader graph-metadata backfill tools. Its job is to create the missing packet metadata surfaces for research iteration folders while leaving already-complete folders untouched.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/memory/backfill-research-metadata.ts` | Script | Creates missing metadata files for research iteration folders |
| `scripts/core/workflow.ts` | Orchestrator | Invokes the research backfill step from the canonical save workflow when research children are present |

### Validation And Tests

| File | Focus |
|------|-------|
| `scripts/tests/backfill-research-metadata.vitest.ts` | Backfill behavior for missing-vs-complete research iteration folders |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/34-research-metadata-backfill.md`
