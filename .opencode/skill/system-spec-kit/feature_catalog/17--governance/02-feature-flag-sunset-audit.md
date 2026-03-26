---
title: "Feature flag sunset audit"
description: "Narrow governance note documenting sunset outcomes that are still visible in live code through retired paths, compatibility shims and graduated defaults."
---

# Feature flag sunset audit

## 1. OVERVIEW

This entry is a narrow governance note about sunset outcomes that are still observable in the codebase.

It does not preserve sprint-era inventories or flag counts. Instead, it records the specific places where completed sunset work is still visible through retired runtime paths, compatibility aliases and graduated default behavior.

---

## 2. CURRENT REALITY

Completed sunset work is still visible in live code as compatibility shims and retired execution paths:

- `mcp_server/lib/eval/shadow-scoring.ts` keeps the comparison types and pure analysis helpers, but the runtime path is retired: `runShadowScoring()` always returns `null` and `logShadowComparison()` always returns `false`. The legacy `SPECKIT_SHADOW_SCORING` flag is retained only for compatibility and documentation.
- `shared/embeddings.ts` shows a graduated outcome: lazy loading is the permanent default, `SPECKIT_EAGER_WARMUP` and `SPECKIT_LAZY_LOADING` are inert, and `MODEL_NAME` remains as a legacy alias for backwards compatibility.
- `mcp_server/context-server.ts` still surfaces sunset aftermath operationally. Startup logs explicitly call the warmup flags deprecated compatibility flags, and the remaining shadow-oriented jobs are constrained to evaluation-only behavior such as the shadow feedback scheduler and shadow-only batch learning with no live ranking mutations.
- `mcp_server/lib/scoring/composite-scoring.ts` preserves additional graduated or inert behavior: novelty boost is permanently disabled, while graduated controls such as interference scoring and score normalization use default-on semantics with explicit opt-out.

The governance takeaway is that the old audit is no longer the source of truth. What remains valuable is the code-level evidence that some toggles were removed entirely, some became permanent defaults and some survive only as compatibility surfaces.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts` - Retired shadow-scoring runtime with compatibility-only flag references and surviving comparison/stat helpers.
- `.opencode/skill/system-spec-kit/shared/embeddings.ts` - Graduated lazy-loading behavior and inert warmup compatibility flags.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` - Startup/runtime evidence for deprecated warmup flags and evaluation-only shadow jobs.
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts` - Inert novelty boost path plus graduated default-on scoring controls with explicit opt-out semantics.

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Feature flag sunset audit
- Current reality source: `mcp_server/lib/eval/shadow-scoring.ts`, `shared/embeddings.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/scoring/composite-scoring.ts`
