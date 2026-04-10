# Iteration 013 — Split Session Capture From Durable Memory

Date: 2026-04-10

## Research question
Is `system-spec-kit`'s memory architecture the right shape, or does Babysitter suggest a simpler split between transient state and durable knowledge?

## Hypothesis
Babysitter will reveal that `system-spec-kit` is asking one pipeline to do too many jobs: session handoff, durable memory curation, metadata enrichment, and semantic indexing.

## Method
I compared Babysitter's session-state files and replay-oriented state handling with `system-spec-kit`'s `generate-context` pipeline, metadata enrichment, and 14-rule memory quality gate.

## Evidence
- Babysitter's session state is intentionally small: a markdown file with YAML frontmatter tracking `active`, `iteration`, `maxIterations`, `runId`, timestamps, and iteration timings, plus atomic writes and a lightweight runaway-loop detector. [SOURCE: external/packages/sdk/src/session/parse.ts:13-21] [SOURCE: external/packages/sdk/src/session/parse.ts:77-105] [SOURCE: external/packages/sdk/src/session/write.ts:14-33] [SOURCE: external/packages/sdk/src/session/write.ts:40-58] [SOURCE: external/packages/sdk/src/session/write.ts:153-189]
- `generate-context` in `system-spec-kit` is JSON-primary, supports multiple structured enrichment channels, validates spec-folder binding, and treats the saved memory as an authoritative reconstructed session artifact. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:164-220] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:439-545]
- `memory-metadata.ts` enriches the saved artifact with classification, decay factors, dedup data, causal links, auto-derived ancestry, and evidence snapshots. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:76-176] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:179-232] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:316-358] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:389-460]
- The memory quality gate applies fourteen rules, including contamination checks, topical coherence, malformed frontmatter detection, API-error leakage, and index/write blocking semantics. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-174] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:856-985]

## Analysis
Babysitter's split is architecturally cleaner: run/session state is operational state, while reusable assets live elsewhere. `system-spec-kit` currently routes both "save what happened in this session" and "produce a durable indexed memory artifact" through the same path. That creates a powerful system, but it also creates a lot of machinery around every save. [SOURCE: external/packages/sdk/src/session/parse.ts:13-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-174]

The strongest simplification signal is to split the concern. Session capture should be allowed to stay operational and lossless with minimal structural validation. Promotion into the indexed memory corpus should be a separate, stricter act that adds trigger phrases, importance metadata, causal links, and contamination checks only when durable retrieval value is worth the overhead. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:76-176] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:109-168]

## Conclusion
confidence: high

finding: Babysitter suggests `system-spec-kit` should pivot to a two-lane memory architecture: lightweight session/run state for continuity, and curated durable memories for semantic indexing. The current single-lane pipeline is feature-rich but overbuilt for simple context capture.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** `generate-context` creates a structured memory artifact that immediately enters metadata enrichment, quality gating, and indexing-oriented validation. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:76-176] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-174]
- **External repo's approach:** Babysitter keeps session state small, operational, and separate from the richer process/plugin/profile assets that the system may also persist. [SOURCE: external/packages/sdk/src/session/parse.ts:13-21] [SOURCE: external/packages/sdk/src/session/write.ts:14-58]
- **Why the external approach might be better:** It lowers save-path complexity, clarifies which files are operational versus retrievable, and reduces accidental coupling between continuity and semantic indexing.
- **Why system-spec-kit's approach might still be correct:** Rich saved memories enable powerful retrieval, deduplication, and causal analysis without requiring a second promotion step.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce `session-capture` artifacts that store operational continuity with minimal validation, then add an explicit `promote-to-memory` path for durable indexed memories that need metadata enrichment and V1-V14 quality rules.
- **Blast radius of the change:** architectural
- **Migration path:** Keep `generate-context` as a compatibility wrapper that writes the old format by default, but allow a new operational mode for non-indexed captures and gradually move commands like handover/resume to prefer that lighter lane.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts`
- **Change type:** architectural shift
- **Blast radius:** architectural
- **Prerequisites:** define the contract boundary between operational continuity artifacts and indexed durable memories
- **Priority:** must-have

## Counter-evidence sought
I looked for an already-separate operational session-capture lane inside `system-spec-kit` and found only a single save path that treats the generated artifact as both continuity source and indexed memory candidate. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-174]

## Follow-up questions for next iteration
- Would a generic iterative workflow engine reduce how much state deep research and deep review need to duplicate?
- Which validation rules should remain universal if session capture and durable memory are split?
- How much runtime duplication exists today because both research and review own their own loop engine?
