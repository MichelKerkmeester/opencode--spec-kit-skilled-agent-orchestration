---
title: "Runtime Config Contract"
description: "JSONC contract for the script runtime loader, including the active legacy keys in `config.jsonc` and the documentation-only sections retained for reference."
---

# Runtime Config Contract

This document captures the implemented behavior, source references, and remediation metadata for the runtime configuration contract centered on `config/config.jsonc`.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. SOURCE METADATA](#4-source-metadata)

## 1. OVERVIEW

`config/config.jsonc` is the editable JSONC surface for the script-side runtime configuration loader in `scripts/core/config.ts`. The file documents a much broader system shape than the current loader actually consumes, so the live contract is split into two layers: active top-level workflow keys that are merged into `WorkflowConfig`, and documentation-only sections that remain in the file as reference material for hardcoded MCP/runtime behavior elsewhere.

In practice, this means `config.jsonc` is authoritative for a small legacy subset of script settings, while the rest of the file is descriptive rather than binding.

## 2. CURRENT REALITY

The shipped runtime contract is:

| Contract Area | Current Reality |
|---|---|
| Loader path | `scripts/core/config.ts` reads `config/config.jsonc`, strips JSONC comments with `stripJsoncComments()`, parses the file, shallow-merges user values onto defaults, then validates the resulting `WorkflowConfig`. |
| Active file-backed keys | The keys currently present in Section 1 and consumed directly from `config.jsonc` are `maxResultPreview`, `maxConversationMessages`, `maxToolOutputLines`, `messageTimeWindow`, `contextPreviewHeadLines`, `contextPreviewTailLines`, and `timezoneOffsetHours`. |
| Runtime-only defaults | Additional `WorkflowConfig` fields are live in the loader but are not currently declared in `config.jsonc`: `maxFilesInMemory`, `maxObservations`, `minPromptLength`, `maxContentPreview`, `toolPreviewLines`, `toolOutputMaxLength`, `timestampMatchToleranceMs`, `qualityAbortThreshold`, and `learningWeights`. These come from hardcoded defaults unless a matching top-level key is added to the file. |
| Validation behavior | Positive-number fields are range-checked, `timezoneOffsetHours` must stay within `-12` to `14`, `learningWeights.*` must stay within `0..1`, and legacy `qualityAbortThreshold` values above `1` are auto-normalized from a `1..100` scale to `0.0..1.0`. Invalid values log warnings and fall back to defaults instead of throwing. |
| Exported runtime surface | After loading, the module freezes `STATIC_CONFIG` and exposes a mixed static/mutable `CONFIG` object where the file-backed values become uppercase runtime constants such as `MAX_RESULT_PREVIEW`, `MESSAGE_TIME_WINDOW`, and `TIMEZONE_OFFSET_HOURS`. |
| Documentation-only sections | The `semanticSearch`, `memoryIndex`, `triggerSurfacing`, `memoryDecay`, `importanceTiers`, `hybridSearch`, `contextTypeDetection`, `accessTracking`, `checkpoints`, `constitutionalTier`, `confidenceTracking`, and `templates` sections remain in `config.jsonc`, but the file itself says only Section 1 is active. These sections are currently explanatory metadata for hardcoded runtime behavior in other modules, not values bound by `scripts/core/config.ts`. |
| Failure mode | Empty, missing, or invalid JSONC falls back to the loader defaults with warning logs. The loader never throws on config parse or validation failures. |

This makes the present-day contract intentionally conservative: top-level workflow knobs are safe to override through `config.jsonc`, while deeper subsystem sections are reference documentation rather than a guaranteed control plane.

### Boolean toggle surfaces

Outside Section 1, `config/config.jsonc` currently declares the following boolean-valued toggle surfaces. These booleans are present in the editable JSONC file, but under the current loader contract they remain documentation-only reference metadata unless a consuming module reads them directly.

| JSON path | Default | Current role |
|---|---|---|
| `semanticSearch.enabled` | `true` | Documents semantic retrieval as enabled by default. |
| `memoryIndex.autoRebuildOnSave` | `true` | Documents automatic index rebuild behavior after saves. |
| `memoryIndex.verifyOnStartup` | `false` | Documents that startup verification is off by default. |
| `triggerSurfacing.enabled` | `true` | Documents trigger-based memory surfacing as enabled. |
| `memoryDecay.enabled` | `true` | Documents decay scoring as enabled for eligible memories. |
| `importanceTiers.constitutional.decay` | `false` | Documents that constitutional memories should not decay. |
| `importanceTiers.constitutional.alwaysSurface` | `true` | Documents unconditional surfacing intent for constitutional memories. |
| `importanceTiers.critical.decay` | `false` | Documents that critical memories should not decay. |
| `importanceTiers.important.decay` | `false` | Documents that important memories should not decay. |
| `importanceTiers.normal.decay` | `true` | Documents that normal memories are decay-eligible. |
| `importanceTiers.temporary.decay` | `true` | Documents that temporary memories are decay-eligible. |
| `importanceTiers.deprecated.decay` | `false` | Documents that deprecated memories should not decay further. |
| `importanceTiers.deprecated.excludeFromSearch` | `true` | Documents search exclusion for deprecated memories. |
| `hybridSearch.enabled` | `true` | Documents hybrid retrieval as enabled. |
| `hybridSearch.fallbackEnabled` | `true` | Documents fallback behavior when one search leg is unavailable. |
| `contextTypeDetection.enabled` | `true` | Documents automatic context-type detection as enabled. |
| `contextTypeDetection.rules.decision.requiresAskUser` | `true` | Documents that decision contexts are expected to require user confirmation. |
| `accessTracking.enabled` | `true` | Documents access-based score boosting as enabled. |
| `checkpoints.enabled` | `true` | Documents checkpoint retention as enabled. |
| `constitutionalTier.enabled` | `true` | Documents constitutional-tier injection as enabled. |
| `constitutionalTier.alwaysSurface` | `true` | Documents always-surface behavior for the constitutional tier. |
| `confidenceTracking.enabled` | `true` | Documents confidence tracking and promotion logic as enabled. |

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/config/config.jsonc` | Config Contract | Editable JSONC source containing the active legacy keys plus documentation-only sections 2-11 |
| `.opencode/skill/system-spec-kit/scripts/core/config.ts` | Loader | Parses JSONC, merges defaults, validates `WorkflowConfig`, and exports frozen runtime constants |
| `.opencode/skill/system-spec-kit/config/README.md` | Documentation | States that only Section 1 keys are used at runtime and distinguishes `filters.jsonc` from the core config loader |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/runtime-memory-inputs.vitest.ts` | Legacy `qualityAbortThreshold` normalization and explicit config-input failure handling in the script runtime |
| `manual_testing_playbook/19--feature-flag-reference/223-runtime-config-contract.md` | End-to-end sandbox verification of Section 1 overrides, invalid values, and documentation-only sections |

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: Runtime Config Contract
- Current reality source: direct loader audit of `scripts/core/config.ts`, `config/config.jsonc`, and the listed normalization/manual contract checks
