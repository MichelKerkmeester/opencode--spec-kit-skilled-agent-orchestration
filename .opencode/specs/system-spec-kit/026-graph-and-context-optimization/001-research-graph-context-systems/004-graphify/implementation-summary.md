---
title: "Implementation Summary: 004-graphify Research Phase"
description: "20 total deep-research iterations across two waves produced 42 consolidated findings (K1 to K42) and a phased rollout translation for Public's Code Graph, CocoIndex, hooks, validation, and scoring surfaces."
trigger_phrases:
  - "graphify implementation summary"
  - "004-graphify outcome"
  - "graphify research complete"
importance_tier: critical
contextType: summary
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["implementation-summary.md"]

---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-graphify |
| **Completed** | 2026-04-08 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now point any Public maintainer at `research/research.md` and get a line-grounded translation layer that says exactly which graphify patterns to adopt, adapt, or reject for Code Graph MCP, CocoIndex, Spec Kit Memory, hooks, validation, and scoring surfaces. The audit now covers 20 total iterations across two waves, produced 42 consolidated K-findings (K1 through K42), and answered all 22 research questions. Reading section 12 plus sections 13.A and 13.B gives the full recommendation and rollout set without backfilling assumptions.

### Two-pass extraction audit

You can trace the deterministic AST pass through `extract.py` and the LLM semantic pass through `external/skills/graphify/skill.md`, then watch them merge in inline shell-invoked Python at external/skills/graphify/skill.md:259-317 rather than in `build.py`. Findings K2, K6, K7, K23 give you the architectural shape; K28 to K31 give you the per-language extractor matrix that ranks Python as uniquely powerful and ranks every other language at "file node + declarations + file-level imports + inferred calls" with relation-name drift across languages.

### Evidence labeling as a transport contract

You can read K8, K9, K30 to see why graphify treats EXTRACTED, INFERRED, AMBIGUOUS as a transport-level guarantee rather than a UI convention. Every edge in `graph.json` carries both a categorical confidence and a numeric `confidence_score` backfilled from `_CONFIDENCE_SCORE_DEFAULTS`. The validator at `validate.py:5` enforces the vocabulary as a hard schema constraint, and the semantic subagent prompt at `skill.md:191-194` says "do not omit AMBIGUOUS - flag for review", making negative knowledge a first-class output.

### PreToolUse hook + CLAUDE.md companion

K12 quotes the verbatim hook payload and explains the matcher `Glob|Grep`. The hook is conditional, never blocking, and surgical against the exact tools Public uses for raw search. K12 plus the CLAUDE.md companion section at `__main__.py:70-79` give Public a two-pronged Claude steering pattern that hooks alone or instructions alone could not achieve.

### Multimodal pipeline + 71.5x verdict

K1 reproduces the headline math (`123,488 / 1,726 = 71.55x`) but pins the three load-bearing assumptions: naive baseline = full-corpus stuffing, 4-chars-per-token heuristic, BFS-subgraph-cost approximation. The 8.8x code-only number is the relevant comparable for Public, and the constant-vs-linear scaling property is the genuinely valuable insight. K26 documents that the `mixed-corpus` worked example does NOT show its README's claimed multimodal evidence, exposing a release-discipline gap that Public should not repeat.

### Export, wiki, MCP serve surface

K13 to K21 cover the full `export.py` (954 lines), `wiki.py` (214 lines), and `serve.py` (322 lines). The big lessons: `to_json()` is the canonical serving boundary that preserves community plus confidence numerics; HTML export hard-fails above 5,000 nodes (Public has 442.9K, confirming reject); the wiki export bakes EXTRACTED/INFERRED/AMBIGUOUS audit summaries into prose articles (proposed adopt as A6); the MCP serve interface is 7 read-only tools all wrapped as `TextContent` with no freshness controls (proposed reject as primary MCP, adopt as optional brief-text mode).

### Build orchestration cross-corpus check

K22 to K27 cover `manifest.py` (a 4-line re-export shim, NOT a real manifest layer), `build.py` (a 42-line assembler with NO orchestration), the modality-aware `code_only` rebuild branch in `skill.md:236-400`, and the `mixed-corpus` versus `karpathy-repos` packaging mismatch. The new D6 row proposes adopting graphify's modality-aware policy layer over Public's existing indexers so code-only changes stay cheap while non-code asset changes trigger semantic passes.

### Per-language extractor inventory

K28 gives you the full 12-extractor matrix (16 file extensions, Swift detected but not extracted, Lua absent, only Python has cross-file inference and rationale). K29 documents the relation-name drift between `imports_from` (JS/Go/Rust) and `imports` (Java/C/C++/C#/Kotlin/Scala/PHP). K32 calls out `validate.py` as the single most directly portable artifact in the entire repo (71 lines, NetworkX-only, orthogonal to Code Graph MCP) and is the basis for the new A5 row.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit began as a `/spec_kit:deep-research:auto` run against `external/graphify/` and then reopened in `completed-continue` mode to reach 20 total iterations. Wave 1 covered the external repository in 10 runs. Wave 2 added 10 Public-internal translation runs that mapped the external findings onto existing payload contracts, runtime hints, incremental indexing, multimodal scope, clustering fit, verification, metrics, and rollout sequencing.

The reducer (`reduce-state.cjs`) ran after every iteration or wave close to refresh the registry, dashboard, and machine-owned strategy sections without the leaf agents needing to write those files directly. composite_converged fired at iter 7 with coverage 91.7%, and the user explicitly overrode the stop with three forced cli-codex iterations (8 to 10). After wave 1 completed, the user then requested 10 more iterations, so the packet was reopened in generation 2 and section 13.B was added for Public-internal translation findings. This kept lineage auditable: section 13 holds the original baseline, section 13.A holds the wave-1 extension, and section 13.B holds the completed-continue rollout mapping.

After iter 20, synthesis updated `research/research.md` with section 13.B, extended the source-read ledger through iteration 20, and updated the convergence report to 22 of 22 answered questions. `synthesis_complete` fired again for the completed-continue wave, config.status returned to `complete`, and the spec docs were synchronized to the 20-iteration state before the refreshed memory save.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use cli-codex `gpt-5.4` high reasoning effort as the primary engine | Per user directive, cli-codex with high reasoning gives the strongest evidence-grounded reads on dense Python source files. ADR-001. |
| Switch engine to `claude-opus-direct` mid-loop after iter 2 codex starvation | Iter 2 codex starved on parallel-job API contention with ~20 minutes wall clock and 0 CPU time. Claude-opus-direct finished each remaining iteration in 1 to 3 minutes. Logged as `engine_switch` event in JSONL. ADR-002. |
| Override the iter 7 composite_converged stop with 3 forced cli-codex iterations (8 to 10) | composite_converged fired at coverage 91.7% but Q12 (Adopt/Adapt/Reject grounding) was not yet line-cited, and three high-value modules (`export.py`, `wiki.py`, `serve.py`, plus `manifest.py`/`build.py` orchestration and per-language extractor matrix) were still under-read. User directive made the override explicit. ADR-003. |
| Append iter 8 to 10 findings as a new section 13.A appendix instead of rewriting K1 to K12 | Preserves audit lineage: anyone reading research.md can see exactly which findings came from which iteration generation. Avoids invalidating prior cross-references. ADR-004. |
| Treat `external/` as read-only throughout | graphify is the subject of study, not the target of edits. Codex sandbox mode `workspace-write` only outside `external/`. |
| Rewrite all four spec docs to Level 3 template after research synthesis | Initial drafts used custom headers; strict validation flagged 31 template deviations. Rewriting brings the folder into compliance and produces a long-lived, audit-ready artifact set. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` | PASS - RESULT: PASSED with zero errors and zero warnings |
| 22 of 22 research questions answered | PASS - final coverage 1.0 at iter 20 |
| At least 5 cited findings (REQ minimum) | PASS - 42 consolidated findings (K1 to K42), every one with file:line citation |
| Adopt/Adapt/Reject table line-grounded | PASS - section 12 now has 6+7+4 rows, and each A5/A6/D6/D7 row is fully inlined with explicit source citations |
| Cross-phase overlap with 002 codesight and 003 contextador | PASS - section 11 documents explicit deduplication; R1 and R2 redirect to the appropriate phases |
| Memory artifact with critical importance tier | PASS - the canonical closeout in `research/research.md` and `implementation-summary.md` preserves the 20-iteration wave and cleaned trigger phrases |
| Reducer ran after every iteration | PASS - 10 reducer invocations, registry and dashboard refreshed each time |
| `synthesis_complete` event in JSONL | PASS - logged at 2026-04-06T18:48:00Z |
| `config.status == "complete"` | PASS - flipped after synthesis |
| All spec docs use Level 3 template headers | PASS - spec.md, plan.md, tasks.md, implementation-summary.md, decision-record.md, checklist.md all template-aligned |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **codex parallel-job API contention is unmitigated.** The iter 2 starvation incident proved that codex-cli sequential dispatch is the safe pattern for this loop. Parallel codex dispatches across iterations are NOT supported by this workflow. Workaround: dispatch iterations sequentially, log `engine_switch` events when fallback is needed.
2. **`mixed-corpus` worked example was not regenerated.** K26 documents that the checked-in `external/worked/mixed-corpus/GRAPH_REPORT.md` does NOT show the multimodal evidence its README claims. We did not run graphify against `mixed-corpus` ourselves to confirm. Workaround: cite K26 as evidence of release-discipline drift, not as proof that graphify cannot do multimodal at small corpus sizes.
3. **Real Claude tokenization counts were not measured for K1.** The 71.5x verdict relies on graphify's own `_estimate_tokens` heuristic (4 chars per token). A future spike could call Anthropic's `count_tokens` API on the same corpus to tighten the credibility verdict. Workaround: cite K1 with the three load-bearing assumptions explicit; do not present 71.5x as a verified number.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
