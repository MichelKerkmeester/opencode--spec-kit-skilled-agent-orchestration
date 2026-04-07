---
title: "Implementation Summary: Contextador Research Phase (003-contextador)"
description: "Summary of the 003-contextador deep research phase. 13 cli-codex (gpt-5.4 high) iterations produced 18 evidence-backed findings covering Contextador's MCP query surface, routing, self-healing loop, Mainframe shared cache + budget subsystem, token-efficiency claims, provider abstraction, GitHub automation pipeline, core helper modules, and AGPL+commercial licensing. ~84.8% of external/src/ source files were read by some iteration; ~100% of non-test production source. Headline conclusion: Public already wins on retrieval substrate; Contextador's surviving value is runtime retrieval ergonomics."
trigger_phrases:
  - "contextador summary"
  - "phase 003 summary"
  - "contextador research findings"
importance_tier: "normal"
contextType: "general"
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
| **Spec Folder** | 003-contextador |
| **Completed** | 2026-04-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase produced a deep, source-grounded research packet on Contextador, the Bun-based MCP query server. The headline takeaway is that Public already wins on retrieval substrate (CocoIndex semantic, Code Graph structural, Spec Kit Memory continuity), so Contextador's surviving value is runtime retrieval ergonomics, not a replacement retrieval engine. The 93% token-reduction claim is estimated from fixed constants in `external/src/lib/core/stats.ts:26-28`, not benchmarked, and the served `context` payload is narrower than the README suggests. After 13 iterations, source coverage is approximately 84.8% of files in `external/src/` and approximately 100% of non-test production source files.

### Source-grounded research output

Thirteen cli-codex (gpt-5.4, model_reasoning_effort=high) iterations executed the full reading order from the phase prompt and then extended it with five additional iterations covering tests, the budget subsystem, the setup wizard, the github automation example, and the closing core helper modules. The original loop ran iterations 1-8 (`mcp.ts` first, then routing through `headmaster.ts`/`pointers.ts`/`hierarchy.ts`, then the self-healing loop in `feedback.ts`/`janitor.ts`/`generator.ts`/`freshness.ts`, then Mainframe through `bridge.ts`/`client.ts`/`rooms.ts`/`dedup.ts`/`summarizer.ts`, then README/stats/providers/setup/licensing, then a cross-comparison against Public's existing surfaces, then cross-phase boundary resolution against 002-codesight and 004-graphify, then a final pointer-lossiness pass). The user then extended the loop and iterations 9-13 added test coverage audits, the previously untraced `budget.ts` subsystem, the setup wizard plus framework presets, the github webhook + triage automation pipeline, and the closing core helper sweep over `agents.ts`, `validation.ts`, `writer.ts`, `sizecheck.ts`, `docsync.ts`, `depscan.ts`, and `demolish.ts`.

### 18 evidence-backed findings

`research/research.md` v2 consolidates the iteration outputs into 18 findings, each with the phase prompt's required schema (source evidence, evidence type, what Contextador does, why it matters for Public, affected subsystem, recommendation, cross-phase ownership note, risk/ambiguity). Recommendations are: 3 adopt now, 9 prototype later, 6 reject. Every finding cites concrete file paths and line ranges in `external/src/`. Iterations 9 and 10 upgraded several findings from source-proven to test-confirmed at the branch level. Iterations 9, 10, 11, 12, and 13 added new findings for the budget subsystem, the github automation pipeline, and the closing core helper sweep.

### Cross-comparison and cross-phase boundary tables

`research/research.md` Section 4 contains the cross-comparison table against CocoIndex, Code Graph MCP, and Spec Kit Memory, with NEW/DUPLICATE/HYBRID/NEGATIVE verdicts per capability. Section 5 contains the cross-phase ownership table for 002-codesight, 003-contextador, and 004-graphify, establishing that 003 owns runtime retrieval ergonomics, 002 owns scan-time analysis and artifact generation, and 004 owns graph and provenance intelligence.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase ran the autonomous sk-deep-research loop with cli-codex (gpt-5.4 high) preferred for every iteration. Codex was invoked via `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --sandbox workspace-write --skip-git-repo-check -` with prompts piped via stdin from temporary prompt files under /tmp. After each iteration, the reducer script `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs` synchronized findings-registry.json, the strategy file, and the dashboard file. The final synthesis pass also ran via cli-codex and replaced the placeholder research output with the canonical 17-section synthesis. Zero internal `@deep-research` fallback was required; cli-codex completed all 8 iterations and the synthesis pass cleanly.

Validation guardrails ran before any research started: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` was executed and iterated until 0 errors and 0 warnings, after which the deep-research loop began. After synthesis, the same `validate.sh --strict` was re-run for final compliance.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Research-only scope, all writes confined to phase folder | Keeps the 003-contextador research packet clean and prevents scope leak into 002-codesight or 004-graphify; user explicitly pre-approved Gate 3 for this folder only |
| cli-codex (gpt-5.4, high) for every iteration | User explicitly requested cli-codex gpt-5.4 high agents wherever possible; gpt-5.4 high provides the strongest reasoning depth for source-grounded code analysis |
| Internal `@deep-research` retained as documented fallback | Resilience if Codex CLI failed mid-loop; in practice fallback was not needed |
| Run validate.sh --strict before AND after research | Phase prompt §5 step 12 explicitly requires the strict validation; running it twice catches scaffolding regressions and synthesis-time integrity drift |
| Synthesize via cli-codex rather than inline | Codex has direct access to all 8 iteration files plus the external sources for spot-citation verification, and can produce a 17-section markdown deliverable in a single pass |
| Treat the 93% token-reduction headline as estimated, not benchmarked | `external/src/lib/core/stats.ts:26-28` uses fixed-constant averages rather than per-query measurement, so the README number is best understood as an aggregate estimate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| validate.sh --strict on phase folder before research | PASSED, 0 errors and 0 warnings (17 of 17 checks) |
| 13 cli-codex iterations executed under tool-call budget | PASSED, all 13 iterations stayed within or near target 8 / max 12 (iterations 9, 10, 13 used the upper end at 12, 12, 14) |
| Reducer ran after every iteration | PASSED, 13 reducer runs recorded |
| Convergence detected | Original 8-iteration loop converged at ratio 0.24; user extended maxIterations to 13 and ran 5 more covering untraced areas |
| research/research.md contains ≥5 evidence-backed findings | PASSED, v2 contains 18 findings |
| Each finding labeled adopt now / prototype later / reject | PASSED, all 18 findings labeled |
| Each finding states evidence type | PASSED, all findings carry source-proven, README-documented, both, or inferred labels |
| 93% token-reduction claim verified against stats.ts | PASSED, finding 10 documents the estimate-vs-benchmark gap |
| Cross-phase boundaries with 002-codesight and 004-graphify resolved | PASSED, research.md Section 5 contains the canonical ownership table |
| AGPL-3.0-or-later + commercial licensing addressed | PASSED, Section 7 + finding 14 cite package.json:6 and LICENSE-COMMERCIAL.md:1-20 |
| No edits made under external/ | PASSED, sandbox restrictions plus prompt enforcement held |
| No edits made outside the phase folder | PASSED, all writes confined to 003-contextador/ |
| checklist.md updated with evidence | PASSED, all P0 items marked with evidence |
| Memory saved via generate-context.js | PENDING (final step) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pointer-lossiness benchmarking is qualitative.** Iteration 8 closed Q3 at the source level (the pointer payload is `purpose`/`keyFiles`/`dependencies`/`apiSurface`/`tests` only, and the briefing file is generated separately) but did not run an end-to-end task-quality benchmark against richer Public outputs. Any future "prototype later" experiment around pointer compression should add a measured task-quality benchmark before promotion.
2. **AGPL plus commercial licensing constrains adoption.** Every "adopt now" or "prototype later" recommendation defaults to study plus reimplementation, NOT direct copying of Contextador source. Reuse is study + clean-room reimplementation, not source import. See Section 7 of `research/research.md`.
3. **Bun runtime assumption.** Contextador's CLI and setup wizard are Bun-native (`external/src/cli.ts:1`, `external/package.json:27-33`). Recommendations that depend on Bun-specific behavior are flagged as runtime-incompatible with Public's stack and require runtime-stack normalization before any prototype.
4. **Mainframe conflict resolution gap.** Iteration 4 confirmed that Mainframe uses best-effort Matrix room state writes for janitor locks and budget without explicit reconciliation between shared state and local repair flows. Any Public answer-cache prototype must add explicit conflict resolution and timestamps before broader rollout.
5. **README overstatement risk.** Several README phrases (93% savings, "Any AI provider") are stronger than the implementation supports. Future Public messaging that borrows ergonomics ideas from Contextador should default to benchmark-honest framing.
6. **Sibling phase folders not yet completed.** This packet resolves cross-phase ownership boundaries but does not synthesize findings across 002-codesight, 003-contextador, and 004-graphify. A track-level synthesis under `026-graph-and-context-optimization/` is the natural next step once the sibling phases finish their own research packets.
<!-- /ANCHOR:limitations -->

---

<!--
Final implementation summary for the 003-contextador research phase.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
