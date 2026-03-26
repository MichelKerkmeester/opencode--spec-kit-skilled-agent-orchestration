---
title: "Filter Config Contract"
description: "JSONC contract for the content-filter pipeline, covering stage order, filtering thresholds, and the loader behavior that deep-merges `filters.jsonc` with code defaults."
---

# Filter Config Contract

This document captures the implemented behavior, source references, and remediation metadata for the content-filter configuration contract centered on `config/filters.jsonc`.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

`config/filters.jsonc` is the file-backed contract for the content-filter pipeline used by `scripts/lib/content-filter.ts`. It controls whether the pipeline runs, the ordered stage list, and the threshold values for noise rejection, deduplication, and quality scoring.

Unlike `config.jsonc`, this file is loaded directly by the filter implementation rather than the core runtime loader, and its values are actively consumed at runtime.

## 2. CURRENT REALITY

The shipped filter contract is:

| Contract Area | Current Reality |
|---|---|
| Loader path | `scripts/lib/content-filter.ts` reads `config/filters.jsonc`, strips JSONC comments, parses the file, and deep-merges user values onto a built-in `FilterConfig` default object. |
| Pipeline gate | `pipeline.enabled: true` keeps the filter active by default. If this flag is turned off, `filter()` returns the original prompt list without applying noise, dedupe, or quality stages. |
| Stage order | `pipeline.stages` is consumed in declared order and currently ships as `["noise", "dedupe", "quality"]`. The pipeline checks `includes(...)` for each named stage, so the array controls both which stages run and the intended sequencing. |
| Noise contract | `noise.enabled: true`, `minContentLength: 15`, and `minUniqueWords: 3` tighten the quality floor beyond code defaults (`5` and `2`). The config supports optional custom regex `patterns`, but the current file does not define any, so runtime filtering relies on the built-in `NOISE_PATTERNS` set plus wrapper stripping via `STRIP_PATTERNS`. |
| Deduplication contract | `dedupe.enabled: true`, `hashLength: 300`, and `similarityThreshold: 0.70` override the loader defaults (`200` and `0.85`). Exact duplicates are removed through hash-plus-normalized-content checks; near-duplicates are removed when `calculateSimilarity()` meets or exceeds the configured threshold. |
| Quality contract | `quality.enabled: true` and `warnThreshold: 20` keep the scorer active. Weighted factors remain `uniqueness: 0.30`, `density: 0.30`, `fileRefs: 0.20`, and `decisions: 0.20`, which together produce the score used by `isLowQuality()`. |
| Merge behavior | The loader preserves omitted nested defaults. `createFilterPipeline()` performs another deep merge for any caller-supplied overrides, so ad hoc runtime options can override file-backed values without losing unspecified nested fields like `pipeline.stages` or `quality.factors`. |
| Failure mode | Invalid or unreadable JSONC logs a warning and falls back to the built-in defaults. The filter pipeline remains available even when the file cannot be parsed. |

The live contract is therefore both file-driven and code-guarded: `filters.jsonc` sets the thresholds operators are expected to tune, while hardcoded patterns and defaults keep the filter operational if the file is absent or malformed.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/config/filters.jsonc` | Config Contract | Editable JSONC source for pipeline ordering, stage enablement, and threshold values |
| `.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts` | Runtime | Loads and merges filter config, applies noise filtering, deduplication, quality scoring, and fallback defaults |
| `.opencode/skill/system-spec-kit/config/README.md` | Documentation | Describes the three-stage filter pipeline and notes that `filters.jsonc` is loaded directly by the content-filter module |

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: Filter Config Contract
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit

<!-- Wave 2 verification note: this file already documents every boolean toggle exposed in config/filters.jsonc: pipeline.enabled, noise.enabled, dedupe.enabled, and quality.enabled. No extra toggle matrix was needed. -->
