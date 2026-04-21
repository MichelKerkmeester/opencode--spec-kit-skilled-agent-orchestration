---
type: deep-research
topic: Memory quality root cause analysis - generate-context.js JSON mode
spec_folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation
status: complete
iterations: 10
generated: 2026-04-06T17:20:00Z
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/research.md"]

---

# Memory Quality Backend Improvements — Deep Research Report

<!-- ANCHOR:summary -->
This report synthesizes the iteration corpus into a single evidence-backed remediation record. [SOURCE: research/iterations/iteration-010.md:20-34] [SOURCE: research/iterations/iteration-025.md:20-34]
<!-- /ANCHOR:summary -->

## 1. Executive Summary
This research investigated eight defect classes observed in seven JSON-mode memory artifacts generated through `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`. Across iterations 1-9, every live defect except D6 was traced to a concrete owner in the JSON-mode pipeline, and the remaining D6 reproducer was narrowed to a historical or stale-sample issue rather than an active defect at the currently inspected merge site. [REFERENCE: iteration-001 through iteration-009] [SOURCE: research/iterations/iteration-010.md:20-34]

The highest-confidence root causes are localized and concrete: D1 is caused by a hard `substring(0, 500)` clamp in `collect-session-data.ts`, D2 is caused by `extractDecisions()` skipping raw JSON decision arrays and falling through to lexical placeholder generation, D3 is split between unconditional folder-token append in `workflow.ts` and stopword-collapsed bigram generation in `semantic-signal-extractor.ts`, and D4 is a multi-writer drift introduced when `frontmatter-migration.ts` rewrites only the top tier. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1271-1295`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-284`, `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1112-1183`]

Later iterations converged the higher-risk recommendations into a narrower final matrix. D2 should be fixed with precedence hardening, not blanket lexical suppression; D5 should discover only an immediate, unambiguous predecessor with continuation gating; D7 should inject provenance only, not reuse the full captured-session enrichment path; and D3 should remove unconditional folder-token append while keeping `ensureMinTriggerPhrases()` as the guarded low-count fallback. [CITATION: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1298`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:108-131`] [REFERENCE: iteration-009]

The resulting remediation plan is intentionally incremental. P0 fixes are the low-risk, high-certainty changes: D8 template cleanup and D1 boundary-safe trimming. P1 addresses structural consistency and provenance gaps. P2 covers the more behaviorally sensitive search-quality fixes in D2 and D3. P3 reserves D5 and D6 for the cases where ambiguity and historical drift make a cautious, fixture-first rollout more appropriate. [REFERENCE: iteration-008 and iteration-009] [SOURCE: research/iterations/iteration-008.md:20-42] [SOURCE: research/iterations/iteration-009.md:20-48]

Convergence was effectively reached by iteration 9, where new information fell to `0.29`, all seven research questions had been answered, and the remaining work shifted from discovery to synthesis. Iteration 10 therefore serves as the final synthesis pass and establishes this report as the canonical source of truth superseding the individual iteration notes. [REFERENCE: iteration-008 and iteration-009] [SOURCE: research/iterations/iteration-009.md:49-71] [SOURCE: research/iterations/iteration-010.md:20-34]

This expanded synthesis now covers the full three-generation research program: Gen-1 root-cause localization (iterations 1-10), Gen-2 implementation narrowing and rollout design (iterations 11-20), and Gen-3 safety/performance/operability validation (iterations 21-25). The prior canonical report compressed that corpus down to a small registry and digest appendix; this rewrite restores the per-iteration evidence trail so that readers can answer iteration-specific questions without reopening the raw notes. [REFERENCE: iteration-001 through iteration-025] [SOURCE: research/iterations/iteration-025.md:20-34]

Across those 25 iterations, the corpus produced 176 total findings/recommendations, of which 166 were captured as numbered finding entries and are now listed directly in the generation-scoped registry below. The remaining synthesis-level determinations are represented in the convergence declarations, PR-train planning, migration guidance, observability addenda, and the new master recommendations catalog. [REFERENCE: iteration-010, iteration-020, iteration-023, iteration-024, iteration-025]

The expanded view materially changes prioritization confidence. Gen-2 established that D4 and D8 are population-scale JSON-mode defects, D2 and D6 remain narrow enough to justify fixture-first fixes, and D3 warrants a focused sanitizer rather than generic cleanup. Gen-3 then added the missing rollout safety layer: no hidden second D2/D7 owner surfaced, PR-7 latency stayed acceptable under the narrowed design, historical migration is only partially safe, and the only net-new defect candidate is a concurrent-save race around cross-process locking. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:130-147] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-021.md:20-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:23-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md:20-41] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-025.md:22-34]

## 2. Research Charter
Topic: root cause analysis and backend remediation for memory quality issues in JSON-mode `generate-context.js` saves for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues`. Scope included the structured JSON save path (`--json`, `/tmp/save-context-data.json`, and `--stdin`), the render pipeline, extractor behavior, template behavior, and any supporting migration or enrichment layers that shaped the broken sample outputs. Non-goals included manual repair of the seven broken memory files, redesign of the broader memory system, capture-mode investigations outside the JSON path, V8 contamination work, embedding-model changes, and `/memory:save` UX work. Stop conditions were: answer Q1-Q7, map D1-D8 to concrete owners, and converge by max-iteration or diminishing new information. [REFERENCE: deep-research-strategy.md]

## 3. Methodology
The investigation used a 10-iteration LEAF research loop with `cli-codex`, `gpt-5.4`, and `high` reasoning. Each iteration focused on one defect family or one synthesis step, wrote a standalone markdown note, and externalized state through `deep-research-state.jsonl`, `deep-research-strategy.md`, and `findings-registry.json`. This let each pass start with fresh context while preserving continuity through artifacts rather than model memory. [REFERENCE: deep-research-strategy.md, iteration-001 through iteration-009]

Iterations 1-7 localized the defect owners. Iteration 8 converted those findings into a remediation matrix. Iteration 9 then pressure-tested the open loose ends, narrowed the riskier recommendations, and ruled out the original F7 reproducer for D6. Iteration 10 synthesizes those artifacts into the canonical report. [REFERENCE: iteration-008 and iteration-009]
