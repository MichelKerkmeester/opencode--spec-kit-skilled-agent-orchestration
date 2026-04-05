# Phase 003 Review: Discovery

Reviewer: Claude Opus 4.6 (1M context)
Date: 2026-03-23
Scope: 3 Discovery features audited by GPT-5.4 (Analyst) and GPT-5.3-Codex (Verifier)

---

## Summary

| Metric | Value |
|--------|-------|
| Features reviewed | 3 |
| MATCH | 2 |
| PARTIAL | 1 |
| MISMATCH | 0 |
| Agreement rate (Analyst vs Verifier) | 1 of 3 (33%) |
| Changes from prior audit | 0 |

Both delegates agree on Feature 03 (PARTIAL). They disagree on Features 01 and 02: the Analyst rates both MATCH; the Verifier rates both PARTIAL. After independent verification, I side with the Analyst on both (see Disagreements section below). The final tally is 2 MATCH, 1 PARTIAL -- identical to the prior 2026-03-22 audit.

---

## Per-Feature Verdicts

| # | Feature | Analyst | Verifier | Final | Confidence | Notes |
|---|---------|---------|----------|-------|------------|-------|
| 01 | Memory browser (`memory_list`) | MATCH | PARTIAL | **MATCH** | 90% | Verifier's missing-file concern is valid but does not meet PARTIAL threshold |
| 02 | System statistics (`memory_stats`) | MATCH | PARTIAL | **MATCH** | 90% | Same rationale as Feature 01 |
| 03 | Health diagnostics (`memory_health`) | PARTIAL | PARTIAL | **PARTIAL** | 95% | Both agree; undocumented `embeddingRetry` field and alias-file attribution remain |

---

## Disagreements

### Features 01 and 02: MATCH vs PARTIAL

**Analyst position (MATCH):** The catalog's behavioral descriptions -- defaults, clamp logic, fallback behavior, validation envelopes, response payloads -- all match the source code precisely. The source file lists cover all implementation, library, and test files relevant to the feature.

**Verifier position (PARTIAL):** The catalog's Source Files section omits files that participate in the request lifecycle: `tool-schemas.ts` (MCP-visible JSON schema definitions), `tool-input-schemas.ts` (runtime Zod validation schemas), `memory-tools.ts` (dispatch switch), `memory-crud-types.ts` (TypeScript interface definitions), and for Feature 02, `context-server.ts` (a direct caller of `handleMemoryStats`).

**Referee verdict: MATCH (Analyst is correct)**

The Verifier applied an overly strict standard for source file completeness. Here is why:

1. **The catalog's purpose is behavioral documentation, not a complete dependency graph.** The Source Files section describes the files that implement and test the feature's behavior. Shared infrastructure files (schema definitions, dispatch routing, TypeScript types) are cross-cutting concerns that apply to every tool equally. Listing them in every feature entry would produce redundant boilerplate without adding informational value.

2. **The omitted files do not change the behavioral truth.** The Verifier confirmed that all documented behaviors match the code: function signatures, defaults, flag semantics, clamp logic, validation codes, response payloads. The "unreferenced" files are structural scaffolding (types, schemas, dispatch), not behavioral logic.

3. **Consistency with the prior audit and Feature 03.** The prior audit rated Features 01 and 02 as MATCH despite the same schema/dispatch files existing at that time. Feature 03 earns PARTIAL not because of omitted infrastructure files, but because of a substantive behavioral gap: the `embeddingRetry` payload field is returned in both response modes but not documented in the catalog's Current Reality section. That is a qualitatively different kind of omission.

4. **The Verifier's own evidence supports MATCH.** The Verifier confirmed: "Files OK? Yes. Functions OK? Yes. Flags OK? Yes." All behavioral claims are verified. The sole basis for PARTIAL is "catalog source list omits material schema/dispatch/type files" -- a documentation completeness concern about infrastructure files, not a behavioral accuracy gap.

**Severity of the Verifier's finding:** P2 (suggestion). The catalog could be improved by adding a shared infrastructure note or a cross-reference to common schema/dispatch files. This does not warrant a PARTIAL behavioral verdict.

### Adversarial Self-Check (Hunter/Skeptic/Referee)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|---------------|
| F01/F02: Catalog omits `tool-schemas.ts`, `tool-input-schemas.ts`, `memory-tools.ts`, `memory-crud-types.ts` from Source Files | P1 (incomplete source attribution) | These are shared infrastructure files, not feature-specific logic. All behavioral claims verified. Listing them in every feature catalog entry adds noise. | Downgraded | P2 (suggestion) |
| F02: Catalog omits `context-server.ts` as a caller | P1 (missing integration reference) | `context-server.ts:185` calls `handleMemoryStats` directly but this is a consumer, not an implementing source. The catalog documents the feature, not every caller. | Downgraded | P2 (suggestion) |
| F03: `embeddingRetry` field undocumented in catalog Current Reality | P1 (undocumented response field) | Field appears in both `full` and `divergent_aliases` modes at lines 365 and 590. Not a minor internal detail -- it is a top-level response field visible to all callers. | Confirmed | P1 (required) |
| F03: Alias-conflict function attributed to `memory-index.ts` not `memory-index-alias.ts` | P2 (imprecise attribution) | The catalog lists `memory-index.ts` which does re-export the function (line 626). The import chain is valid. Attribution is defensible, just imprecise. | Confirmed | P2 (suggestion) |

---

## Changes from Prior Audit

**None.** All three verdicts are unchanged from the 2026-03-22 prior audit:

| # | Feature | Prior Verdict | Current Verdict | Changed? |
|---|---------|--------------|-----------------|----------|
| 01 | Memory browser (`memory_list`) | MATCH | MATCH | NO |
| 02 | System statistics (`memory_stats`) | MATCH | MATCH | NO |
| 03 | Health diagnostics (`memory_health`) | PARTIAL | PARTIAL | NO |

The prior audit's known limitation ("Full-mode health response includes undocumented fields: embeddingRetry stats, repair.partialSuccess, orphan cleanup, integrity verification") remains open.

---

## Recommendations

### For Feature 03 (PARTIAL -> MATCH path)

1. **P1: Document `embeddingRetry` in catalog.** Add the `embeddingRetry` top-level field to the Current Reality section of `03-health-diagnostics-memoryhealth.md`. It appears in both `full` and `divergent_aliases` response modes (verified at `memory-crud-health.ts:365` and `memory-crud-health.ts:590`). Describe its purpose (embedding retry state/statistics from the retry manager) and when it is populated.

2. **P2: Sharpen alias-conflict attribution.** Consider adding `memory-index-alias.ts` alongside `memory-index.ts` in the Source Files table, or adding a note that `memory-index.ts` re-exports `summarizeAliasConflicts` from `memory-index-alias.ts:153`.

### General (P2 suggestions)

3. **Consider a shared infrastructure note.** The feature catalog could benefit from a brief note (either per-feature or at the catalog level) acknowledging that all tools share common infrastructure files: `tool-schemas.ts`, `tool-input-schemas.ts`, `memory-tools.ts`, `memory-crud-types.ts`. This would preempt future auditors from flagging these as omissions.

---

## Confidence Assessment

| Check | Status |
|-------|--------|
| All three catalog files read | YES |
| Both delegate reports read in full | YES |
| Prior audit implementation-summary read | YES |
| Key source files independently verified | YES (`memory-crud-health.ts:355-395`, `memory-crud-health.ts:580-595`, `memory-tools.ts:60-77`, `memory-crud-types.ts:25-55`, `tool-input-schemas.ts:245-270`, `tool-schemas.ts:215-230`, `context-server.ts:180-195`) |
| All findings traceable to evidence | YES |
| Adversarial self-check completed | YES |

Overall review confidence: **HIGH**
