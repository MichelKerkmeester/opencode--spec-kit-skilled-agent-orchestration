---
title: "Implementation Plan: Phase 1 — Foundation (Templates & Truncation)"
description: "Execution plan for PR-1 and PR-2: align OVERVIEW anchors, extract the shared truncation helper, migrate the OVERVIEW and observation-summary callsites, and verify both fixture-driven acceptance checks before Phase 2 begins."
---
# Implementation Plan: Phase 1 — Foundation (Templates & Truncation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## EXECUTIVE SUMMARY

Phase 1 is intentionally narrow: it closes D8 with a one-file template alignment and closes D1 by extracting a shared truncation helper, migrating the existing boundary-aware observation-summary path, and replacing the raw OVERVIEW clamp. The parent PR train defines these as PR-1 and PR-2, both in P0, both independently revertable, and both required before the packet can hand off to `002-single-owner-metadata`. [SOURCE: research.md §10] [SOURCE: research.md §B.4] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197]

The key planning discipline is to treat helper extraction as a controlled reuse exercise, not as a broad text-shaping refactor. Iteration 17 already mapped the safe order: first lift the behavior already present in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`, then migrate the same file’s `normalizeInputData()` path at `:668-674`, then replace the D1 owner in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:18-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68]

The only policy decision this phase must pin explicitly is ellipsis behavior. Research warns that fixtures cannot remain ambiguous between ASCII `...` and Unicode `…`; this plan adopts a single canonical suffix in the implementation and makes the tests assert that exact choice. [SOURCE: research.md §D.3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:276-276]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready

- The phase documents cite the published D1 and D8 owners rather than reopening diagnosis. [SOURCE: research.md §5]
- The implementation sequence respects the iteration-17 helper ordering. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68]
- F-AC1 and F-AC7 are defined before code closeout. [SOURCE: research.md §D.3]

### Definition of Done

- PR-1 and PR-2 are both complete. [SOURCE: research.md §B.4]
- Fixture tests and JSON-mode replays pass. [SOURCE: research.md §11]
- The parent packet marks Phase 1 complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-197]
<!-- /ANCHOR:quality-gates -->

---

## TECHNICAL APPROACH

Keep PR-1 template-only and behaviorally isolated. D8 is authored directly in the template, so the cheapest safe repair is to standardize the lingering comment anchor on `overview` without pulling other sections into scope. [SOURCE: research.md §5] [SOURCE: research.md §D.1]

Reuse an existing behavior instead of inventing a second summarization rule. The repo already contains a boundary-aware narrative clamp in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283`; Phase 1 should extract that into `truncateOnWordBoundary()` and reuse it. [SOURCE: research.md §13] [SOURCE: research.md §D.2]

Stop at user-visible narrative truncation. Iteration 17 explicitly rules out structural `slice(0, N)` sites and broader truncation sweeps, so this phase must not widen into unrelated text-shaping or SaveMode work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:73-77]

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Pattern

Two-step foundation patch:

- PR-1 repairs a template-authored defect at the rendering boundary. [SOURCE: research.md §D.1]
- PR-2 repairs a data-preparation defect and extracts a shared helper at the truncation boundary. [SOURCE: research.md §D.2]

### Key Components

- **`.opencode/skill/system-spec-kit/templates/context_template.md`**: owns the TOC fragment, HTML id, and comment marker for OVERVIEW. [SOURCE: research.md §5]
- **`truncate-on-word-boundary.ts`**: new shared helper for user-visible narrative truncation. [SOURCE: research.md §D.2]
- **`input-normalizer.ts`**: existing boundary-aware narrative path that becomes the seed for the helper. [SOURCE: research.md §13]
- **`collect-session-data.ts`**: exact D1 owner for OVERVIEW summary collection. [SOURCE: research.md §5]

### Data Flow

`sessionSummary` enters `normalizeInputData()` unchanged, feeds the observation-summary path and the session-data extractor, then reaches `.opencode/skill/system-spec-kit/templates/context_template.md` through `{{SUMMARY}}`; Phase 1 standardizes the truncation seam before render and standardizes the OVERVIEW anchor naming at render time. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-002.md:35-35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-007.md:21-21]
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION STRATEGY

### Phase 1A / PR-1 — Anchor-template fix

Goal: remove the literal mismatch between the TOC fragment `#overview`, the HTML id `overview`, and the comment anchor `summary` in the same OVERVIEW section block. [SOURCE: research.md §5] [SOURCE: research.md §7]

Plan:

1. Patch `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` so the TOC and local comments are aligned on `overview`. [SOURCE: research.md §B.4]
2. Patch `.opencode/skill/system-spec-kit/templates/context_template.md:330-352` so the body comment marker becomes `ANCHOR:overview` and remains paired with `<a id="overview"></a>`. [SOURCE: research.md §B.4]
3. Add a fixture-backed assertion using F-AC7 that checks the rendered markdown contains all three `overview` markers and no longer contains the `ANCHOR:summary` marker in the OVERVIEW block. [SOURCE: research.md §D.3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:187-203]

Why this ships first:

- The phase ordering puts D8 before D1 because it is template-only and essentially zero-risk. [SOURCE: research.md §10]
- It establishes the structural baseline that every later fixture and reviewer check should assume. [SOURCE: research.md §11]

### Phase 1B / PR-2 — Shared truncation helper + OVERVIEW preservation

Goal: replace the raw D1 clamp with shared boundary-aware truncation and export that helper for reuse. [SOURCE: research.md §6] [SOURCE: research.md §D.2]

Plan:

1. Create `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` with the shared helper signature iteration 17 proposes: `truncateOnWordBoundary(text, limit, opts?)`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:29-31]
2. Migrate the existing narrative truncation inside `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283` to call the helper, preserving the `normalizeInputData()` usage path at `:668-674`. [SOURCE: research.md §B.4]
3. Replace the raw `data.sessionSummary.substring(0, 500)` in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` with the shared helper so OVERVIEW and observation-summary truncation share one contract. [SOURCE: research.md §7] [SOURCE: research.md §B.4]
4. Freeze the ellipsis decision in code and tests so F-AC1 asserts the exact suffix rather than an ambiguous character class. [SOURCE: research.md §D.3]

Why this order matters:

- Iteration 17 says the helper should begin as an extraction of the already boundary-aware implementation, not as a new design surface. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:68-68]
- The same iteration warns that many apparent truncation sites are structural and must stay out of scope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:73-77]
- The parent phase map names this helper as the dependency that Phase 2 will consume. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:181-181]
<!-- /ANCHOR:phases -->

---

## FILE:LINE CHANGE LIST

| File | Current Owner / Seam | Planned Change | Why |
|------|-----------------------|----------------|-----|
| `.opencode/skill/system-spec-kit/templates/context_template.md` | `:172-183`, `:330-352` [SOURCE: research.md §B.4] | Rename the lingering comment marker to `overview` and keep the TOC + HTML id aligned. | PR-1 closes D8 with a one-file patch. [SOURCE: research.md §D.1] |
| `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` | New file [SOURCE: research.md §B.4] | Host the shared boundary-aware truncation contract. | PR-2 introduces the reusable helper. [SOURCE: research.md §D.2] |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | `:274-283`, `:668-674` [SOURCE: research.md §B.4] | Migrate `buildSessionSummaryObservation()` to the shared helper without changing its narrative semantics. | This is the existing proven behavior Phase 1 should reuse. [SOURCE: research.md §13] |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | `:875-881` [SOURCE: research.md §B.4] | Replace raw `substring(0, 500)` with helper-based word-boundary truncation. | This is the exact D1 owner. [SOURCE: research.md §5] |
| `tests/fixtures/memory-quality/F-AC1-truncation.json` | New fixture [SOURCE: research.md §D.3] | Reproduce the mid-word OVERVIEW failure and lock the fixed behavior. | This is the phase’s D1 acceptance artifact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:37-54] |
| `tests/fixtures/memory-quality/F-AC7-anchor.json` | New fixture [SOURCE: research.md §D.3] | Render a minimal OVERVIEW payload and assert anchor consistency. | This is the phase’s D8 acceptance artifact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:187-203] |
| `../spec.md` | Parent phase map at `:179-197` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-197] | Mark Phase 1 `Complete` after all checks pass. | Packet coordination and handoff readiness. |

---

## ORDER OF OPERATIONS

1. Author the two phase fixtures so D1 and D8 have deterministic before/after checks. [SOURCE: research.md §D.3]
2. Land PR-1 first by aligning the template anchors in `.opencode/skill/system-spec-kit/templates/context_template.md`. [SOURCE: research.md §10] [SOURCE: research.md §B.4]
3. Create `truncateOnWordBoundary()` and migrate the existing boundary-aware `input-normalizer.ts` sites before touching the D1 owner. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:62-68]
4. Replace the raw clamp in `collect-session-data.ts:875-881` with the helper. [SOURCE: research.md §7]
5. Add or update unit tests so both the helper and rendered OVERVIEW behavior assert the exact pinned suffix and no mid-token ending. [SOURCE: research.md §11] [SOURCE: research.md §D.3]
6. Replay `generate-context.js` in JSON mode against F-AC1 and F-AC7 and assert exit `0`. [SOURCE: research.md §11]
7. Run `validate.sh` on this child phase folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:185-193]
8. Update the parent phase map status from `Pending` to `Complete` only after the preceding checks pass. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-197]

---

## RISKS & MITIGATIONS

| Risk | Why It Exists | Mitigation |
|------|---------------|------------|
| Ellipsis mismatch between `...` and `…` | Research explicitly says AC-1 is underspecified until the suffix is pinned. [SOURCE: research.md §D.3] | Pick one canonical suffix in code and assert exactly that symbol in tests and fixtures. |
| Helper extraction widens into unrelated truncation sites | Iteration 17 found eight live user-visible truncation callsites, but not all belong in Phase 1. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:18-31] | Limit migration to `input-normalizer.ts` and `collect-session-data.ts` in this phase. |
| Template patch updates only one anchor representation | D8 exists because two representations drifted in the same template block. [SOURCE: research.md §5] | Assert all three markers together through F-AC7. |
| OVERVIEW fix diverges from observation-summary behavior | D1 exists because OVERVIEW bypasses the already boundary-aware observation helper. [SOURCE: research.md §13] | Reuse the shared helper for both paths in the same phase. |
| Parent status update happens too early | The handoff rule is published in the parent spec and expects fixtures plus validation first. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197] | Keep the parent map update as the final task in the sequence. |

---

<!-- ANCHOR:testing -->
## VERIFICATION PLAN

### Unit and Fixture Checks

- Create a helper-focused test file, for example `tests/truncate-on-word-boundary.vitest.ts`, that asserts the phase-pinned suffix, prior-whitespace trimming, and no mid-token endings at 450, 520, and 900 character inputs. [SOURCE: research.md §11] [SOURCE: research.md §D.3]
- Create a template or fixture-render test, for example `tests/memory-quality-phase1.vitest.ts`, that covers F-AC7 and the F-AC1 rendered OVERVIEW assertions. [SOURCE: research.md §11]

### CLI Replay

Run both fixture payloads through the compiled entrypoint so the phase proves JSON-mode behavior, not just helper internals:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  tests/fixtures/memory-quality/F-AC1-truncation.json \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues
```

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  tests/fixtures/memory-quality/F-AC7-anchor.json \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues
```

### Structural Validation

Run:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation
```

### Parent Coordination Check

After implementation passes, confirm the parent phase map status line changed and the handoff row still names the same criteria:

```bash
rg -n "001-foundation-templates-truncation|F-AC1|F-AC7|Complete" \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| `../research/research.md` | Packet evidence | The phase loses its owner map and fixture contract. [SOURCE: research.md §4] [SOURCE: research.md §11] |
| Iteration 16 fixture shapes | Test design | F-AC1/F-AC7 become ad hoc instead of deterministic. [SOURCE: research.md §D.3] |
| Iteration 17 extraction order | Refactor guardrail | Helper work risks widening into unrelated truncation sites. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75] |
| Parent handoff row | Packet coordination | Phase 2 cannot consume an unverified helper baseline. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLOUT

Phase 1 should land as two small PR-sized changes bundled into one child-phase execution sequence: template alignment first, helper extraction plus OVERVIEW migration second. The closeout gate is not “tests look good in isolation”; it is “F-AC1 and F-AC7 pass, JSON-mode replays exit `0`, phase validation passes, and the parent packet can mark this phase complete.” [SOURCE: research.md §10] [SOURCE: research.md §11] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197]

Rollback is straightforward because both PRs are local and independently revertable. If the helper migration causes any unexpected narrative drift, revert PR-2 while keeping PR-1, then rework the suffix or helper boundary without reopening the template fix. [SOURCE: research.md §B.4]
<!-- /ANCHOR:rollback -->
