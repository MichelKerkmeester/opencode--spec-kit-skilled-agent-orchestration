---
title: "Core Workflow Infrastructure"
description: "Shared workflow modules that load configuration, gate indexing, score memory quality, build titles and topics, edit frontmatter, review post-save output, and persist indexed memories."
---

# Core Workflow Infrastructure

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Core Workflow Infrastructure is the shared execution layer that turns captured session data into governed memory files and searchable index rows.

Instead of being one runtime entry point, this group is a set of internal building blocks. Together they load and validate workflow configuration, derive titles and topics, score quality, decide whether indexing is allowed, patch frontmatter metadata, review saved output for silent regressions, and persist embeddings plus indexing metadata into the memory database.

---

## 2. CURRENT REALITY

`config.ts` is the central configuration loader. It discovers the scripts root by walking upward until it finds `package.json`, loads `config.jsonc`, strips JSONC comments before parsing, validates every merged field against safe defaults, auto-converts legacy `qualityAbortThreshold` values on a `1-100` scale into canonical `0.0-1.0`, freezes the static config surface, and exports helpers for locating active `specs/` and `.opencode/specs/` directories without duplicating real-path aliases.

`memory-indexer.ts` is the write-side persistence bridge from rendered markdown into the vector index. It builds weighted embedding text, generates embeddings with guarded error handling, extracts trigger phrases from either pre-extracted values or raw content, merges manual trigger phrases when present, derives an `importanceWeight` from content length, anchor density, recency, and base weight, reads quality metadata from content, writes the row through `vectorIndex.indexMemory()`, drops a database-updated marker file, and updates `metadata.json` with embedding status, model name, dimensions, timestamps, and failure reasons when available.

`post-save-review.ts` is the JSON-mode safety net that runs after a memory file is written. It rereads the saved file, parses frontmatter plus the fenced `## MEMORY METADATA` YAML block, and compares the on-disk result against the original payload to catch silent overrides or losses. The review currently checks for generic titles, path-fragment trigger phrases, missing manual trigger phrases, tier mismatches, zero `decision_count` despite supplied decisions, context-type mismatches, and boilerplate descriptions. Findings are graded as `HIGH`, `MEDIUM`, or `LOW`, can be converted into a capped score penalty, and are printed in a machine-readable review block.

`quality-scorer.ts` computes the pre-index quality score for a generated memory. It scores trigger phrases, key topics, file descriptions with provenance-sensitive trust weighting, content length combined with primary-title specificity, leaked HTML detection, and observation-title deduplication. It then applies contamination penalties, caps low-quality outputs when semantic sufficiency fails, and returns both normalized and percentage-style scores together with warnings, quality flags, dimension breakdowns, and insufficiency metadata.

`topic-extractor.ts`, `title-builder.ts`, and `frontmatter-editor.ts` supply the main content-shaping helpers. Topic extraction prefers summary text plus decision titles and rationales, intentionally excludes spec-folder path fragments, and uses aggressive stopword filtering with bigram extraction. Title building normalizes and truncates memory titles, converts slugs into readable titles without breaking date-like hyphens, appends dashboard suffixes like `[spec/file]`, and can extract a normalized spec title from `spec.md`. Frontmatter editing injects `quality_score`, `quality_flags`, and `spec_folder_health`, renders YAML trigger-phrase blocks safely, and guarantees minimum trigger phrases and semantic topics using filtered folder and file tokens with conservative fallback values.

`quality-gates.ts` is the narrow decision point for whether a rendered memory should be indexed at all. It blocks indexing when the file was deduplicated instead of written, when the template contract fails, when semantic sufficiency fails, when the quality score falls below the configured threshold, or when validation disposition requires either write-without-index or full abort. It also formats the semantic-sufficiency rejection string using the shared evidence-count payload so callers can report a consistent failure reason.

Taken together, these files are the reusable infrastructure beneath the higher-level workflow and CLI commands. They do not define the whole user-facing workflow by themselves, but they hold the policy, scoring, metadata, and persistence mechanics that the rest of the memory system depends on.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/core/config.ts` | Configuration core | Loads JSONC workflow settings, validates merged values, exports immutable config, and discovers active specs directories |
| `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` | Indexing core | Generates embeddings, extracts triggers, computes indexing metadata, writes memory rows, and updates embedding status metadata |
| `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Review core | Compares saved memory files against the original payload and produces severity-graded post-save quality findings |
| `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts` | Scoring core | Produces canonical quality scores, flags, warnings, and breakdowns for generated memory files |
| `.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts` | Extraction helper | Derives semantic topics from summaries and decision text while filtering simulated and path-fragment noise |
| `.opencode/skill/system-spec-kit/scripts/core/quality-gates.ts` | Policy helper | Decides whether indexing may proceed and formats semantic-sufficiency abort reasons |
| `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts` | Naming helper | Normalizes memory titles, builds dashboard-safe titles, and extracts normalized spec titles from `spec.md` |
| `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts` | Metadata helper | Injects quality and health fields into frontmatter and guarantees minimum trigger/topic metadata |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Core Workflow Infrastructure
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of the shared configuration, indexing, scoring, review, and metadata helper modules
