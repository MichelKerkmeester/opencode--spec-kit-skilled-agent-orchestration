---
title: "...xt-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/004-heuristics-refactor-guardrails/plan]"
description: "Execution plan for PR-7, PR-8, and PR-9 across the memory save pipeline, covering D5 lineage heuristics, SaveMode refactor, and post-save reviewer guardrails."
trigger_phrases:
  - "phase 4 plan"
  - "pr-7 pr-8 pr-9 plan"
  - "savemode migration"
  - "find predecessor memory"
  - "check d1 d8 reviewer"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/004-heuristics-refactor-guardrails"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
---
# Implementation Plan: Phase 4 — Heuristics, Refactor & Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language / Stack** | TypeScript + Node save pipeline |
| **Primary Runtime** | JSON-mode `generate-context.js` workflow |
| **Storage** | Markdown memory files plus post-save MCP indexing |
| **Testing** | Fixture replay, workflow-slice integration, reviewer assertions |
| **Core Files** | `workflow.ts`, `memory-metadata.ts`, new `core/find-predecessor-memory.ts`, `post-save-review.ts` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1162] |
| **Key Inputs** | `../research/research.md`, `../research/iterations/iteration-006.md`, `../research/iterations/iteration-014.md`, `../research/iterations/iteration-017.md`, `../research/iterations/iteration-019.md`, `../research/iterations/iteration-022.md`, `../research/iterations/iteration-024.md` |

### Overview

Phase 4 executes three deliberately ordered PRs. PR-7 adds D5 auto-supersedes with strong continuation gating, ambiguity skip, and a bounded reader strategy. PR-8 removes `_source === 'file'` as a control-flow predicate by introducing `SaveMode` and migrating the known mode branches. PR-9 upgrades `post-save-review.ts` to CHECK-D1..D8 and proves the reviewer against broken D1 / D4 / D7 / D8 fixtures plus a clean `F-AC8` baseline. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1162]

This phase is intentionally downstream of Phase 1, 2, and 3. PR-8 depends on helper and behavior surfaces stabilized earlier in the train, and PR-9 must read the post-fix, post-refactor save pipeline rather than a speculative interim state. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:182-183] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:197-200]

### Technical Approach

The plan treats Phase 4 as three parallel design workstreams with one merge order:

- Workstream A implements conservative D5 lineage discovery at the only valid pre-render insertion point. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:59-60]
- Workstream B migrates the mode contract away from `_source` overloading using the frozen iteration-17 dependency map. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-65]
- Workstream C turns the reviewer into a structural drift detector with deterministic CHECK-D1..D8 coverage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:25-154]

The merge order remains PR-7 first, PR-8 second, PR-9 last so the phase does not mix behavior change, branch-contract rewrite, and enforcement in one review blast radius. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1164]

### Workstream Breakdown

| Workstream | Goal | Primary Inputs | Exit Condition |
|------------|------|----------------|----------------|
| A | Add safe automatic D5 supersedes linking | Iteration 6 root cause, iteration 14 continuation corpus, iteration 22 performance model | `F-AC5` green with hit, miss, and ambiguity cases plus acceptable measured overhead [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-006.md:20-42] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:19-57] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:28-32] |
| B | Remove `_source` string comparisons from mode decisions | Iteration 17 dependency map and D5 / D6 architectural recommendations | `SaveMode` owns branch semantics across workflow, extractor, reviewer, and normalization surfaces [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-83] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1505-1510] |
| C | Turn the reviewer into a deterministic defect contract | Iteration 19 reviewer design plus clean and broken fixture rows | CHECK-D1..D8 fire on broken fixtures and stay silent on clean `F-AC8` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:25-176] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162] |

### Order of Operations

1. Land PR-7 first so lineage behavior stabilizes before the mode refactor starts.
2. Land PR-8 second so the reviewer migration can adopt the final `SaveMode` contract rather than an intermediate compatibility layer.
3. Land PR-9 last so enforcement observes the final data path, final mode path, and final D5 rendering behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1164]

This order is mandatory because PR-8 explicitly reuses helper surfaces introduced earlier in the train, and PR-9 is only trustworthy after the Phase 1 and Phase 2 defect classes are already fixed in code. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:197-200]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 1, 2, and 3 are merged and stable enough for Phase 4 follow-on work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:179-183]
- [ ] PR-7 / PR-8 / PR-9 still map 1:1 to the frozen PR-train rows. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1164]
- [ ] Fixture harnesses exist for `F-AC5`, `F-AC8`, and reused `F-AC1` / `F-AC2` / `F-AC6`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1162]
- [ ] The phase remains scoped to PR-7, PR-8, and PR-9 only; PR-10 migration and PR-11 save-lock work stay out of scope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:227-228] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1525]

### Definition of Done

- [ ] PR-7 lands with green `F-AC5` and 3+ sibling lineage proof.
- [ ] PR-8 lands with `SaveMode` in place and earlier fixtures still green.
- [ ] PR-9 lands with broken-fixture detection and clean-fixture silence.
- [ ] Full PR-train replay is green.
- [ ] This child folder validates cleanly or only reports pre-existing out-of-scope folder issues.

### Phase-specific Gates

| Gate | Condition | Why It Exists |
|------|-----------|---------------|
| G1 | PR-7 ships before any SaveMode migration | D5 insertion point must stabilize first [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:59-66] |
| G2 | PR-8 finishes before PR-9 reviewer migration | Reviewer is one of the last-mode callsites in iteration 17 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:60-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:72-72] |
| G3 | PR-9 must prove both failure and cleanliness | The reviewer contract is not complete without clean `F-AC8` silence [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162] |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Phased PR train inside one save pipeline. Each PR changes a different layer:

- PR-7 changes lineage behavior.
- PR-8 changes branch semantics.
- PR-9 changes enforcement and drift visibility.

### Key Components

- **Predecessor discovery helper**: new `core/find-predecessor-memory.ts` containing continuation gating, header read, candidate selection, and ambiguity skip. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160]
- **Workflow insertion point**: `workflow.ts:1305-1372`, immediately before `buildCausalLinksContext()`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:59-60]
- **Render contract**: `memory-metadata.ts:227-236`, where `supersedes` must survive into the markdown context. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1477-1481]
- **Save mode contract**: explicit `SaveMode` replacing `_source`-driven branching across workflow, extractor, reviewer, and normalization surfaces. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1505-1510] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-58]
- **Reviewer contract**: CHECK-D1..D8 plus the composite blocker. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:153-159]

### Data Flow

The planned flow is: current save enters the workflow, PR-7 decides whether predecessor discovery should even run, the helper may inject `causal_links.supersedes`, `memory-metadata.ts` emits the lineage into the render context, SaveMode-based branches govern enrichment and heuristics, the file is written, and `post-save-review.ts` evaluates CHECK-D1..D8 from the saved artifact plus payload contract. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-006.md:22-24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:46-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:119-154]

### File:Line Change List

| PR | File / Surface | Planned Change |
|----|----------------|----------------|
| PR-7 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1305-1372` | Insert predecessor discovery before `buildCausalLinksContext()` and gate the walk on continuation evidence [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160] |
| PR-7 | `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:227-236` | Preserve discovered `causal_links.supersedes` in the render contract [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160] |
| PR-7 | `NEW .opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts` | Add continuation gate, bounded header read, candidate selection, and ambiguity skip [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160] |
| PR-8 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-460` | Replace `_source === 'file'` early-return behavior with `SaveMode` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:46-47] |
| PR-8 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:654-659` | Replace captured-session gate with `SaveMode` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:47-47] |
| PR-8 | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:361-388` | Migrate session-status heuristic to `SaveMode` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:48-48] |
| PR-8 | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:475-482` | Migrate completion-percent heuristic to `SaveMode` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:49-49] |
| PR-8 | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:836-847` | Keep metadata passthrough while removing behavior dependence on `_source` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:50-50] |
| PR-8 | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:220-226` | Migrate reviewer mode gate to `SaveMode` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:51-51] |
| PR-8 | `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1434-1443` | Preserve `_sourceTranscriptPath` / `_sourceSessionId` as metadata only [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:52-52] |
| PR-9 | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` | Add CHECK-D1..D8, composite blocker, and clean / broken fixture support [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:25-154] |
| PR-7 / PR-9 | New fixture surfaces | Add `F-AC5` lineage fixture, broken D1 / D4 / D7 / D8 fixtures, and clean `F-AC8` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1162] |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm parent phase dependencies are satisfied. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:197-200]
- Re-read the frozen PR-train rows and the iteration-17 / 19 / 22 contracts before touching code or fixtures. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1164]
- Ensure the fixture harness can express `F-AC5`, `F-AC8`, and broken D1 / D4 / D7 / D8 cases before landing behavior changes.

### Phase 1 Exit Criteria

- The current branch is confirmed to contain merged Phase 1, Phase 2, and Phase 3 foundations. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:179-183]
- The implementation owner has a frozen list of live `_source` mode callsites from iteration 17 and will not expand the migration surface ad hoc. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-58]
- Fixture authoring order is set before code work begins so PR-7 and PR-9 can close with direct proof instead of retrospective coverage.

### Phase 2: Core Implementation

#### PR-7 — D5 Auto-supersedes with Continuation Gate

- Insert predecessor discovery immediately before `buildCausalLinksContext()`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:59-60]
- Gate on precise continuation evidence and exclude noisy `phase N` / `vN` families. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:22-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:46-56]
- Keep discovery linear and bounded; avoid rescans and heavy per-sibling parsing. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:34-43]
- Prefer a small partial-header read primitive if needed. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:23-24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:62-70]

##### PR-7 Detailed Execution Strategy

The D5 fix starts by separating detection from rendering. The helper should decide whether predecessor discovery is even legal before any sibling walk occurs. The trigger corpus narrowed in iteration 14 showed that only `extended` and `continuation` families were clean enough for automatic linking, while generic sequence markers such as `phase 2` and `v3` produced unacceptable ambiguity. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:19-57]

Once the gate opens, the implementation should walk sibling memory folders once, read only enough frontmatter and title content to rank candidates, skip if multiple predecessor candidates remain plausible, and preserve any caller-supplied `supersedes` relation as authoritative. That approach matches the iteration-22 recommendation to avoid full-file reads and keeps the change inside an acceptable performance envelope even at 500 sibling folders. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:34-70]

The final PR-7 proof is not just a happy-path fixture. It must include a 3+ memory lineage folder that proves three distinct outcomes: a clean predecessor hit, a no-link continuation save when no valid predecessor exists, and an ambiguity skip when two predecessor candidates compete. That fixture structure is the only way to prove the heuristic is conservative rather than eager. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1516-1518]

#### PR-8 — SaveMode Enum + Helper Migration

- Start from the iteration-17 dependency map rather than a fresh grep. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-58]
- Introduce `SaveMode`, backfill it without behavior change, then migrate workflow, extractor, and reviewer in order. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:60-65]
- Leave `_sourceTranscriptPath` and `_sourceSessionId` as metadata-only fields. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:50-52]

##### PR-8 Detailed Execution Strategy

Iteration 17 described the current problem as semantic overload: `_source` was acting both as provenance metadata and as a hidden mode switch. Phase 4 replaces that ambiguity with an explicit enum so the pipeline can distinguish JSON-generated saves, capture-mode saves, and manual file-driven saves without relying on a string comparison that carries unrelated meaning. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1505-1510] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-58]

The migration should follow the dependency map from highest-leverage branch points to the more observational surfaces. Workflow gates move first because they govern whether downstream capture logic runs. Extractor heuristics move next because they derive session status and completion estimates differently per mode. The reviewer mode check moves after those consumers because otherwise the reviewer could adopt `SaveMode` while the pipeline still emits mixed semantics upstream. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:60-72]

This PR also has a non-negotiable regression obligation: after the migration lands, `F-AC1`, `F-AC2`, and `F-AC6` must all remain green. That makes the refactor evidence-based rather than “cleanup by assertion,” and it constrains the team from quietly redefining legacy manual or capture behavior while introducing the enum. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]

#### PR-9 — Reviewer Guardrail Upgrade

- Implement CHECK-D1 through CHECK-D8 and the composite blocker. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:153-159]
- Preserve the frozen severity map: D1 / D2 / D4 / D7 HIGH; D3 / D5 / D6 / D8 MEDIUM. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:27-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:137-139]
- Keep review deterministic: no sibling scans and no reviewer-time git probes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:119-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:169-171]

##### PR-9 Detailed Execution Strategy

The reviewer work should be treated as a contract upgrade, not a best-effort linter pass. Each defect class gets one named check, a defined severity, and a testable fixture story. The plan deliberately uses broken fixtures for D1, D4, D7, and D8 because those defects are representative of truncation drift, tier divergence, provenance mismatch, and anchor mismatch. Clean `F-AC8` is equally important because reviewer credibility depends on zero false positives against a healthy save artifact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:25-176] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]

PR-9 must not expand into broad validation or sibling re-analysis. Iteration 19 specifically recommended deterministic checks that inspect the payload, saved content, and known expectations without adding new repository scans or environment-sensitive probes. That keeps the reviewer cheap enough to run after each save and prevents it from becoming another source of race conditions or flaky diagnostics. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:119-171]

### Phase 3: Verification

- Re-run `F-AC1`, `F-AC2`, and `F-AC6` after PR-8. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]
- Prove `F-AC5` and clean `F-AC8` after the full PR train lands. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1162]
- Validate the child folder and prepare parent phase-map status update only after the full replay is green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:177-200]

### Verification Order

1. Localize PR-7 verification around lineage hit, miss, ambiguity, and performance evidence.
2. Re-run the pre-existing regression fixtures immediately after PR-8 to catch any mode-contract regressions early.
3. Run broken D1 / D4 / D7 / D8 reviewer fixtures plus clean `F-AC8` after PR-9.
4. Replay the full PR train once all three PRs are stacked.
5. Run `validate.sh` on the phase folder and update parent status only after all fixture evidence is recorded.

### Rollout Strategy

The rollout is intentionally PR-scoped rather than one-shot. PR-7 can be reviewed as a behavior change with measurable overhead and clear fallback semantics. PR-8 then becomes a contract refactor with explicit regression evidence. PR-9 closes the phase by converting prior research into guardrails that will stay with the system after the code merge. This staged rollout keeps each review small enough to reason about and makes rollback straightforward if any PR fails its own proof set. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1164]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Fixture Matrix

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | `F-AC5` lineage discovery with hit / miss / ambiguity paths | Fixture replay [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160] |
| Regression | `F-AC1`, `F-AC2`, `F-AC6` after SaveMode refactor | Existing fixture suite [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161] |
| Reviewer negative | Broken D1 / D4 / D7 / D8 fixtures | Reviewer assertion suite [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162] |
| Reviewer clean | `F-AC8` clean baseline | Reviewer assertion suite [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:94-94] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162] |

### Measurement Strategy

- Measure PR-7 overhead against the iteration-22 50 / 100 / 500 sibling-folder envelope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:28-32]
- Treat `memory_save_duration_seconds` p95 > 0.50 seconds as the warning ceiling for combined PR-7 / PR-9 impact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-024.md:88-93] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-024.md:135-140]
- Keep the full PR-train replay as final confirmation after localized fixture suites pass. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237]

### Verification Matrix

| Proof Area | Primary Evidence | Required Outcome |
|------------|------------------|------------------|
| D5 lineage gating | `F-AC5` plus 3+ lineage fixture | Correct predecessor when eligible, skip on ambiguity, no link on non-continuation runs [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160] |
| SaveMode refactor stability | `F-AC1`, `F-AC2`, `F-AC6` replay | No regression in existing JSON, capture, or related save behavior [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161] |
| Reviewer contract | Broken D1 / D4 / D7 / D8 plus clean `F-AC8` | Targeted warnings only; clean fixture remains silent [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162] |
| Operational cost | Perf sample at 50 / 100 / 500 sibling folders | p95 stays within acceptable warning threshold envelope [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-024.md:135-140] |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 merge state | Internal | Required | PR-8 / PR-9 would validate against unstable D1 / D8 surfaces [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:179-180] |
| Phase 2 merge state | Internal | Required | D4 / D7 reviewer checks would target incomplete behavior [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:180-180] |
| Phase 3 merge state | Internal | Required | SaveMode reuse and fixture replay would start from unstable D2 / D3 behavior [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:181-182] |
| Frozen PR-train contract | Internal | Required | Scope and acceptance drift if PR rows are reinterpreted mid-phase [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1164] |

### Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| PR-7 links the wrong sibling in a crowded folder | High | Continue gate first, one-pass candidate selection, ambiguity skip, 3+ lineage fixture proof [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:84-84] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1516-1518] |
| PR-7 adds avoidable latency | Medium | Early-exit gating, bounded reads, measured envelope, M9 threshold tracking [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:43-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-024.md:135-140] |
| PR-8 leaves mixed mode semantics | High | Follow iteration-17 migration order and re-run earlier fixtures after refactor [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:60-65] |
| PR-9 creates noise instead of protection | Medium | Stay inside iteration-19 contract and require clean `F-AC8` silence [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:25-154] |
| Scope drifts into PR-10 or PR-11 work | Medium | Keep migration, concurrency, and broad observability out of this phase [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:227-228] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1525] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: PR-7 selects wrong predecessors, PR-8 changes JSON / capture semantics, or PR-9 fails clean-fixture silence.
- **Procedure**: Revert the affected PR as a unit, preserve fixture additions and measurement evidence, and restart from the last verified green state.

### PR-specific Rollback

| PR | Rollback Trigger | Containment |
|----|------------------|-------------|
| PR-7 | Wrong predecessor or unacceptable overhead | Remove helper integration, preserve caller-supplied lineage only [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:143-145] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:45-50] |
| PR-8 | Mode behavior changes or mixed branch predicates remain | Revert enum consumers together and re-run `F-AC1`, `F-AC2`, `F-AC6` before retrying [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:60-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161] |
| PR-9 | Reviewer misses broken fixtures or flags clean baseline | Revert new checks to baseline reviewer behavior and narrow back to the iteration-19 contract [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:25-154] |

### Handoff to Phase 5

Phase 5 should start only after Phase 4 proves three things: conservative lineage auto-linking, stable SaveMode branching, and reviewer silence on clean `F-AC8` alongside broken-fixture detection. That is the baseline the operations-tail phase assumes for migration, telemetry, and release-note work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:200-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1527-1531]
<!-- /ANCHOR:rollback -->
