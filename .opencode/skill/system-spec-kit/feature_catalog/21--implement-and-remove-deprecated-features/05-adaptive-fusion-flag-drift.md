---
title: "Adaptive-fusion flag drift"
description: "Live hybrid search always applies adaptive fusion, while installation guidance still describes `SPECKIT_ADAPTIVE_FUSION` as a runtime disable switch."
---

# Adaptive-fusion flag drift

## 1. OVERVIEW

This entry records a documentation-to-runtime drift around the adaptive-fusion flag surface.

The requested sources show that adaptive fusion is still central to live hybrid ranking behavior, but the installation guide continues to describe `SPECKIT_ADAPTIVE_FUSION` as if it were an operator-controlled runtime toggle. That creates a compatibility/documentation surface that no longer matches the implementation.

---

## 2. CURRENT REALITY

`mcp_server/lib/search/hybrid-search.ts` uses adaptive fusion unconditionally in the live fusion path. After channel collection, it determines intent, calls `hybridAdaptiveFuse(semanticResults, keywordResults, intent)`, applies the returned semantic, keyword, and optional graph weights back onto the channel lists, and then either short-circuits directly to adaptive results or falls back to `fuseResultsMulti(lists)` when extra channels still need the general fusion path. In the requested runtime source, there is no read of `SPECKIT_ADAPTIVE_FUSION` before this logic runs.

`mcp_server/INSTALL_GUIDE.md` still documents the old mental model. It lists `SPECKIT_ADAPTIVE_FUSION` in the feature-flag table as a default-on control that can be set to `false` to disable intent-based fusion, repeats that guidance in example configuration blocks, and echoes the same claim in the feature summary and quick-reference sections.

The current shipped reality is therefore drift, not a live operator choice. Adaptive fusion remains part of the runtime search pipeline, but the install guide still advertises a disable switch that the requested implementation source does not honor. Based on these sources, setting `SPECKIT_ADAPTIVE_FUSION` should be treated as a compatibility/documentation residue rather than an active retrieval control.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/lib/search/hybrid-search.ts` | Search | Applies adaptive fusion directly in the live hybrid-search path without consulting a runtime flag in the requested implementation |
| `mcp_server/INSTALL_GUIDE.md` | Documentation | Still presents `SPECKIT_ADAPTIVE_FUSION` as an operator-facing environment toggle and includes configuration examples that imply it is live |

---

## 4. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Source feature title: Adaptive-fusion flag drift
- Source spec: Deep research remediation 2026-03-26
