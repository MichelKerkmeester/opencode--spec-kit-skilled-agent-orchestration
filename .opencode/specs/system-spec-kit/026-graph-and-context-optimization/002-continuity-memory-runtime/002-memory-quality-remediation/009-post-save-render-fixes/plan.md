---
title: "Implementation Plan: Post-Save Render Fixes"
description: "Plan for the nine render-layer fixes in the memory-save pipeline plus round-trip verification."
trigger_phrases:
  - "009 render fixes plan"
  - "post-save render plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: Post-Save Render Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript render helpers plus Markdown packet docs |
| **Framework** | system-spec-kit memory-save pipeline |
| **Storage** | Structured JSON payloads, packet canonical docs, and generated `memory/*.md` saves |
| **Testing** | Focused vitest lanes, round-trip `generate-context.js` save, `validate.sh --strict`, typecheck |

### Overview

Implement the nine requested render-layer fixes in priority order, starting with the P0 surfaces that make the saved wrapper visibly wrong: title output, canonical sources, and file capture. Keep the work bounded to existing helper files and additive template rendering only, then prove the result with a real memory-save round-trip against a throwaway test packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The 014 audit saves and the positive reference save were read and mapped to concrete defects.
- [x] The `001/.../006-research-memory-redundancy` contract and `003/006-memory-duplication-reduction` implementation boundary were re-read.
- [x] The edit scope is limited to the approved helper files, additive template rendering, and new test files.

### Definition of Done
- [x] All nine lanes A-I have focused tests. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:12-28; .opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts:19-50; .opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:13-46; .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:49-99; .opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:5-27; .opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:5-28; .opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:37-90; .opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts:9-36; .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-disambiguation.vitest.ts:12-33]
- [x] The round-trip save passes all wrapper-contract checks. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:60-140]
- [x] Existing Phase 6 regression suites stay green. [EVIDENCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:74-88]
- [x] `validate.sh --strict` passes on the `009-post-save-render-fixes` packet. [EVIDENCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/009-post-save-render-fixes/implementation-summary.md:84-88]
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Re-read the 014 evidence saves before modifying a lane tied to them.
- Re-check the soft-predecessor boundary from `003/006` before touching shared helpers.
- Keep the template change additive-only if Lane B requires it.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Only modify the approved render helpers, additive template block, and new tests | Prevents drift into 003/006-owned runtime surfaces |
| AI-ORDER-001 | Fix lanes A through I in priority order | Preserves value if time or verification budget gets tight |
| AI-VERIFY-001 | Add or update one focused test per lane before claiming the lane complete | Keeps each bug bounded and auditable |
| AI-E2E-001 | Finish with a real `generate-context.js` round-trip save | Proves the wrapper contract in live pipeline behavior |

### Status Reporting Format

- Start state: which lane is active and what file owns the fix
- Work state: what changed and which test proves it
- End state: focused test result plus any new interaction with the wrapper contract

### Blocked Task Protocol

1. Stop if a supposed render bug actually lives in an out-of-scope owner surface.
2. Record the real location in the packet docs and keep the fix bounded to the nearest permitted helper if possible.
3. If a lane cannot be fixed without breaking scope, leave it explicit and continue with remaining lanes.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Bounded helper remediation on top of an existing compact-wrapper runtime

### Key Components

- Title rendering helper in `core/title-builder.ts`
- Session collection and canonical-source assembly in `extractors/collect-session-data.ts`
- Render bindings and score injection in `core/workflow.ts`
- Lineage and parent-spec metadata helpers in `core/memory-metadata.ts`
- Two separate scoring helpers that currently share confusing names
- Additive canonical-source rendering in the memory context template

### Data Flow

Structured JSON payload and detected spec docs flow into session collection, render bindings, template population, post-save review, and metadata persistence. Packet `009` keeps that flow intact but corrects the render surfaces so the saved wrapper tells the truth about sources, counts, triggers, evidence, phase and lineage, and quality-score meaning.

### Dependency Matrix

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003/006-memory-duplication-reduction` | Soft predecessor | Required context | Defines what the compact-wrapper contract means |
| `001/.../006-research-memory-redundancy` | Research authority | Required context | Defines canonical-doc ownership and the wrapper goal |
| 014 audit memory saves | Evidence | Required | Provide concrete regression examples for all nine bugs |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold the 009 Level 3 packet docs and update the parent phase map. [EVIDENCE: spec.md:29-41; tasks.md:35-60]
- [x] Validate the new packet with `validate.sh --strict` before code changes begin. [EVIDENCE: implementation-summary.md:84-88]
- [x] Confirm each lane maps to a real helper owner. [EVIDENCE: implementation-summary.md:39-46; implementation-summary.md:58-66]

### Phase 2: Lanes A-I
- [x] Lane A: title generation fix. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/title-builder.ts:61-65; .opencode/skill/system-spec-kit/scripts/tests/title-builder-no-filename-suffix.vitest.ts:12-28]
- [x] Lane B: canonical sources auto-discovery and render population. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:463-500; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:757-840; .opencode/skill/system-spec-kit/templates/context_template.md:240-250; .opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts:19-50]
- [x] Lane C: file-capture plumbing in structured JSON mode. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:243-272; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1094-1271; .opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:13-46]
- [x] Lane D: trigger-phrase bigram-noise removal. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1270-1367; .opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:56-96]
- [x] Lane E: distinguishing-evidence deduplication and preference rules. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:847-909; .opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:5-27]
- [x] Lane F: phase and session-status truthfulness. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:360-563; .opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:5-28]
- [x] Lane G: causal-links auto-population. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:292-335; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1411-1424; .opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:37-90]
- [x] Lane H: parent-spec resolver. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:337-350; .opencode/skill/system-spec-kit/scripts/tests/parent-spec-resolver.vitest.ts:9-36]
- [x] Lane I: render-vs-input score naming reconciliation. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:27-75; .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:65-100; .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:358-365; .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:225-242; .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-disambiguation.vitest.ts:12-33]

### Phase 3: Verification and Closeout
- [x] Add the round-trip render test. [EVIDENCE: .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:60-140]
- [x] Run targeted vitest, existing Phase 6 regressions, typecheck, and strict packet validation. [EVIDENCE: implementation-summary.md:74-88]
- [x] Replace the placeholder implementation summary and mark packet docs complete with evidence. [EVIDENCE: implementation-summary.md:1-96; checklist.md:32-156]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Focused lane tests | One test file per lane A-I | Vitest under `.opencode/skill/system-spec-kit/scripts/tests/` |
| Round-trip integration | Real `generate-context.js` save against a fixture packet | Vitest plus fixture packet under `tests/fixtures/post-save-render/` |
| Regression protection | Existing Phase 6 and pipeline guard suites | Existing vitest files named in the task request |
| Packet validation | Spec-doc compliance and packet closeout | `validate.sh --strict` |

### Verification Plan

- Run the new per-lane tests after implementing each lane.
- Re-run the existing Phase 6 regression suites after the full patch set lands.
- Verify typecheck from `mcp_server/` even though source edits stay in `scripts/`.
- Use the round-trip test as the final wrapper-contract truth source.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing compact-wrapper runtime | Internal | Required | Without it, the render fixes have no stable contract to target |
| Structured JSON save path | Internal | Required | Lanes B, C, F, and the round-trip test depend on JSON mode |
| Test fixture packet | Internal | Planned | Required for the round-trip proof |
| Existing memory-quality regression suites | Internal | Required | Must stay green to prove the fix is additive |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A lane fix breaks the compact-wrapper surface, existing regression suites, or packet validation.
- **Procedure**:
  1. Revert the affected helper change only.
  2. Re-run the focused lane test plus the existing regression guard that failed.
  3. Leave the blocked lane explicit in the docs and continue with remaining in-scope lanes if safe.

### Rollback Boundaries

- Keep helper edits grouped by lane where possible.
- Do not roll back `003/006`-owned runtime behavior that this packet never touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Scaffold and strict validation
        ->
P0 lanes A-C
        ->
P1 lanes D-F
        ->
P2 lanes G-I
        ->
Round-trip verification and closeout
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scaffold | Mandatory reads | Code changes |
| P0 lanes | Scaffold | P1/P2 lanes and round-trip |
| P1/P2 lanes | P0 lanes | Final verification |
| Final verification | All shipped lanes | Closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scaffold and validation | Medium | 0.5 day |
| Lanes A-C | Medium | 0.5-1 day |
| Lanes D-F | Medium | 0.5-1 day |
| Lanes G-I | Low-Medium | 0.5 day |
| Round-trip and closeout | Medium | 0.5 day |
| **Total** | | **2-3 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] 009 packet validates strictly before code edits
- [x] Each lane has a focused test
- [x] Existing Phase 6 regression guards are ready to re-run

### Rollback Procedure
1. Revert the failing lane change.
2. Restore the last green helper behavior.
3. Re-run the lane test, the regression guards, and strict packet validation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove the failing helper change and delete any fixture memory emitted during tests.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
001/.../006-research-memory-redundancy
            ->
003/006-memory-duplication-reduction
            ->
009-post-save-render-fixes
            ->
fresh-save verification on a test packet
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet docs | Mandatory reads | Validator-clean execution packet | Code changes |
| Helper fixes | Packet docs plus wrapper contract | Truthful rendered wrapper | Round-trip |
| Round-trip test | Helper fixes plus fixture packet | End-to-end wrapper proof | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Scaffold and strictly validate the new packet.
2. Fix P0 render defects: title, canonical sources, and file counts.
3. Fix the remaining helper defects and add focused tests.
4. Prove the final output with a real round-trip save and packet closeout.

**Total Critical Path**: 4 sequential steps

**Parallel Opportunities**:
- Lane-local tests can be authored as each lane lands.
- P2 metadata fixes can follow after the higher-value P0/P1 lanes are stable.
<!-- /ANCHOR:critical-path -->
