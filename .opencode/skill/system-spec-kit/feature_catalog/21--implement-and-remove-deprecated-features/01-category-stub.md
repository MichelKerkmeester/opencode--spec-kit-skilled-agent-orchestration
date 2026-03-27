---
title: "Retired runtime shims and inert compatibility flags"
description: "Current-state reference for compatibility flags and runtime shims that remain visible in code but no longer change live behavior."
---

# Retired runtime shims and inert compatibility flags

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This entry documents a narrow compatibility surface that still exists in the codebase after remediation work retired older runtime toggles.

The current system keeps these names around for operator messaging, documentation continuity, test compatibility, or pure analysis helpers, but they no longer enable alternate live behavior. The result is a cleaner runtime: old flags may still be mentioned, logged, or exported, yet the production path now hard-selects the post-remediation behavior.

---

## 2. CURRENT REALITY

The embedding warmup compatibility flags are inert. In `shared/embeddings.ts`, `shouldEagerWarmup()` always returns `false`, so `SPECKIT_EAGER_WARMUP` and `SPECKIT_LAZY_LOADING` no longer influence provider initialization. `context-server.ts` still carries the startup branch and emits a deprecation warning naming both flags, but the live startup path is the lazy-loading branch because the warmup predicate never flips.

Shadow scoring is retired as a runtime path, not as a type or analysis vocabulary. In `mcp_server/lib/eval/shadow-scoring.ts`, `runShadowScoring()` always returns `null` and `logShadowComparison()` always returns `false`, explicitly treating `SPECKIT_SHADOW_SCORING` as a compatibility-only flag. Pure helpers such as comparison and stats access remain available so historical data or offline analysis can still be described without reopening the write path.

Novelty boost is also permanently disabled. `mcp_server/lib/scoring/composite-scoring.ts` preserves exported novelty constants for compatibility and observability tests, but `calculateNoveltyBoost()` always returns `0`, and downstream telemetry records novelty as not applied. This means `SPECKIT_NOVELTY_BOOST` survives only as inert documentation baggage rather than a live ranking control.

Adaptive fusion has graduated from a toggle to the default implementation path. In `mcp_server/lib/search/hybrid-search.ts`, the search pipeline always calls `hybridAdaptiveFuse()` when constructing vector-plus-keyword fusion, then optionally short-circuits to those results when the active channel set matches the modeled sources. The old `SPECKIT_ADAPTIVE_FUSION` switch is no longer consulted, so adaptive fusion is no longer a rollout flag; it is simply the live fusion logic.

Taken together, these shims show the post-remediation pattern for deprecated runtime controls: preserve names only where compatibility, operator visibility, or test stability still matters, but remove their ability to steer production behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `shared/embeddings.ts` | Shared runtime | Hard-disables eager warmup by making `shouldEagerWarmup()` always return `false` and treating warmup flags as inert. |
| `mcp_server/context-server.ts` | MCP startup orchestration | Logs `SPECKIT_EAGER_WARMUP` and `SPECKIT_LAZY_LOADING` as deprecated compatibility flags while following the lazy-loading path. |
| `mcp_server/lib/eval/shadow-scoring.ts` | Evaluation runtime | Retires `SPECKIT_SHADOW_SCORING` by returning `null`/`false` from the public runtime and persistence entry points. |
| `mcp_server/lib/scoring/composite-scoring.ts` | Scoring pipeline | Keeps novelty exports for compatibility, but makes `SPECKIT_NOVELTY_BOOST` inert by always returning `0`. |
| `mcp_server/lib/search/hybrid-search.ts` | Retrieval pipeline | Always invokes `hybridAdaptiveFuse()` without consulting `SPECKIT_ADAPTIVE_FUSION`, making adaptive fusion part of the default live path. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/lazy-loading.vitest.ts` | MCP runtime test | Verifies `shouldEagerWarmup()` stays false by default and the eager/lazy compatibility flags remain non-restorative. |
| `mcp_server/tests/scoring-observability.vitest.ts` | MCP runtime test | Verifies novelty telemetry stays at `0` / not applied even when `SPECKIT_NOVELTY_BOOST` is set. |
| `mcp_server/tests/graph-flags.vitest.ts` | MCP runtime test | Verifies the legacy graph-flag shim still exposes the unified graph gate surface. |
| `mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Docs/barrel test | Verifies the public API barrel still exports rollout metadata and capability-flag helpers used by shim-era documentation. |

---

## 4. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Source feature title: Retired runtime shims and inert compatibility flags
- Feature file path: `21--implement-and-remove-deprecated-features/01-category-stub.md`
- Current reality source: direct implementation audit of the listed runtime modules plus the listed lazy-loading, scoring, graph-flag, and barrel export tests
