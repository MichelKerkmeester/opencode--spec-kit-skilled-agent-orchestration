---
title: "...t-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/001-foundation-templates-truncation/plan]"
description: "Execution plan for PR-1 and PR-2: align OVERVIEW anchors, extract the shared truncation helper, migrate the OVERVIEW and observation-summary callsites, update the contract validator + memory parser couplings, and verify both fixture-driven acceptance checks before Phase 2 begins."
trigger_phrases:
  - "optimization"
  - "002"
  - "continuity"
  - "memory"
  - "runtime"
  - "plan"
  - "001"
  - "foundation"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/001-foundation-templates-truncation"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
---
# Implementation Plan: Phase 1: Foundation (Templates & Truncation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase 1 stays narrow. It closes D8 with a template alignment and two tightly coupled validator/parser updates. It closes D1 by extracting a shared truncation helper, migrating the existing boundary-aware observation-summary path, and replacing the raw OVERVIEW clamp. The parent PR train defines these as PR-1 and PR-2. Both are P0, both are independently revertable, and both are required before the packet can hand off to `002-single-owner-metadata`. [SOURCE: research.md §10] [SOURCE: research.md §B.4] [SOURCE: ../spec.md#phase-handoff-criteria]

Keep helper extraction controlled. Do not turn it into a broad text-shaping refactor. Iteration 17 already mapped the safe order: first lift the behavior already present in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:275-280`, then migrate the same file's `normalizeInputData()` path at `:665-670`, then replace the D1 owner at the `SUMMARY` assignment in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:877-881`. [SOURCE: research/iterations/iteration-017.md:18-20] [SOURCE: research/iterations/iteration-017.md:62-68]

The ellipsis decision is pinned: `…` (Unicode U+2026), per parent handoff criteria. Helper, callsites, fixtures, and assertions all use the single-codepoint form. [SOURCE: research.md §D.3] [SOURCE: ../spec.md#phase-handoff-criteria]

### Technical Context

- **Runtime**: Node.js (TypeScript via `tsc --build`) for `scripts/` and `mcp_server/` packages.
- **Test framework**: Vitest via `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts` running with `--root .opencode/skill/system-spec-kit/scripts`.
- **CLI entry point**: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (compiled from `scripts/memory/generate-context.ts`).
- **Validator**: `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts`, compiled into both `scripts/dist/` and `mcp_server/dist/` trees.
- **Quality gate**: The rendered memory is checked against the contract validator's SECTION_RULES list before write.
- **Ellipsis codepoint**: Unicode horizontal ellipsis `…` (U+2026). All tests assert the single-character form.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Phase documents cite the published D1 and D8 owners rather than reopening diagnosis. [SOURCE: research.md §5]
- Implementation sequence respects the iteration-17 helper ordering. [SOURCE: research/iterations/iteration-017.md:62-68]
- F-AC1 and F-AC7 fixture shapes are defined before code closeout. [SOURCE: research.md §D.3]

### Definition of Done

- PR-1 (template + validator + parser) and PR-2 (helper + callsite migration + fixtures + tests) are both complete. [SOURCE: research.md §B.4]
- `npm run build` succeeds in both `scripts/` and `mcp_server/` packages.
- `tests/truncate-on-word-boundary.vitest.ts`, `tests/memory-quality-phase1.vitest.ts`, `tests/input-normalizer-unit.vitest.ts`, and `tests/collect-session-data.vitest.ts` all pass.
- JSON-mode replays of F-AC1 and F-AC7 via `generate-context.js` exit `0` using absolute spec-folder paths.
- Fixture-write memory artifacts are cleaned up before declaring done (verification-only runs must not pollute the real packet memory store).
- `validate.sh` on this phase folder exits `0`.
- Parent packet phase map marks Phase 1 complete and retains the published handoff line.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-step foundation patch with a discovered third coupling:

- PR-1 repairs a template-authored defect at the rendering boundary AND updates the two downstream parsers/validators that were pinned to the legacy marker name. [SOURCE: research.md §D.1]
- PR-2 repairs a data-preparation defect and extracts a shared helper at the truncation boundary. [SOURCE: research.md §D.2]

### Key Components

- **`.opencode/skill/system-spec-kit/templates/context_template.md`**: owns the TOC fragment, HTML id, and comment marker for OVERVIEW. [SOURCE: research.md §5]
- **`.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts`**: SECTION_RULES validator. It must agree with the template on the OVERVIEW comment marker or every rendered memory aborts with `QUALITY_GATE_ABORT: missing_anchor_comment:overview`.
- **`.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`**: OVERVIEW section extraction regex at `:526`. It must accept both the legacy `summary` and the new `overview` closing markers for backward compatibility with historical memories.
- **`truncate-on-word-boundary.ts`**: new shared helper for user-visible narrative truncation. [SOURCE: research.md §D.2]
- **`input-normalizer.ts`**: existing boundary-aware narrative path that becomes the seed for the helper. [SOURCE: research.md §13]
- **`collect-session-data.ts`**: exact D1 owner for OVERVIEW summary collection. [SOURCE: research.md §5]

### Data Flow

`sessionSummary` enters `normalizeInputData()` unchanged, feeds the observation-summary path and the session-data extractor (both of which now call `truncateOnWordBoundary`), then reaches the memory context template through `{{SUMMARY}}`. The rendered markdown emits an `ANCHOR:overview` HTML comment, an `<a id="overview"></a>` tag, and the `## OVERVIEW` heading in lockstep; the contract validator at `memory-template-contract.ts:51` verifies the `overview` commentId is present before write. The memory parser's OVERVIEW extraction regex accepts both the legacy `summary` and the new `overview` closing markers as section terminators.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1A / PR-1: Template anchor + validator + parser alignment

Goal: remove the literal mismatch between the TOC fragment `#overview`, the HTML id `overview`, and the comment anchor `summary` in the OVERVIEW section block, and keep the downstream contract validator + memory parser in sync.

Steps:

1. Patch `.opencode/skill/system-spec-kit/templates/context_template.md` at lines 330 and 352 so the opening and closing OVERVIEW comment markers both read `ANCHOR:overview`. [SOURCE: research.md §B.4]
2. Patch `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:51` so the SECTION_RULES row for the overview section reads `{ sectionId: 'overview', commentId: 'overview', ... }`. This is REQUIRED. The template rename breaks the validator unless both sides agree.
3. Patch `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:526` so the OVERVIEW section regex accepts `\/ANCHOR:(?:summary|overview)` for backward compatibility with historical memories.
4. Add a fixture-backed assertion using F-AC7 that checks the rendered template contains all three `overview` markers and no longer contains the legacy `summary` comment marker in the OVERVIEW block. [SOURCE: research.md §D.3]

Why this ships first:

- Phase ordering puts D8 before D1 because the template repair is essentially zero-risk per file, and establishes the anchor baseline every later fixture and reviewer check assumes. [SOURCE: research.md §10] [SOURCE: research.md §11]

### Phase 1B / PR-2: Shared truncation helper + OVERVIEW preservation

Goal: replace the raw D1 clamp with shared boundary-aware truncation and export that helper for reuse.

Steps:

1. Create `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` with the signature `truncateOnWordBoundary(text, limit, opts?: { ellipsis?: string; minBoundary?: number })`. Default ellipsis is `…` (U+2026).
2. Migrate `input-normalizer.ts:275-280` to call the helper for both `summaryTitle` (limit 100) and `narrativeText` (limit 500), intentionally swapping the suffix from `'...'` to `'…'` to pin the canonical form.
3. Replace the raw `data.sessionSummary.substring(0, 500)` at the current `SUMMARY` assignment in `collect-session-data.ts:877-881` with `truncateOnWordBoundary(data.sessionSummary, 500)`.
4. Author `tests/truncate-on-word-boundary.vitest.ts` covering short passthrough, exact-length passthrough, 450/520/900 at limit 500, custom ellipsis, and empty/negative-limit edge cases.
5. Author the F-AC1 and F-AC7 fixture JSON files plus `tests/memory-quality-phase1.vitest.ts`.

Why this order matters:

- Iteration 17 says the helper should begin as an extraction of the already boundary-aware implementation, not a new design surface. [SOURCE: research/iterations/iteration-017.md:68]
- Many apparent truncation sites are structural and must stay out of scope. [SOURCE: research/iterations/iteration-017.md:73-77]

### Phase 1C: Build + replay + cleanup

1. `cd .opencode/skill/system-spec-kit/scripts && npm run build` (exit 0).
2. `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` (exit 0).
3. Run the four vitest suites via `npx vitest run ... --config ../mcp_server/vitest.config.ts --root .`.
4. Replay both fixtures through the compiled CLI with ABSOLUTE spec-folder paths.
5. Remove the fixture-written memory files from the Phase 1 memory folder so they do not pollute the real packet store.
6. Run `validate.sh` on this phase folder (exit 0).
7. Flip the parent phase map row for `001-foundation-templates-truncation/` from Pending to Complete.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Unit and Fixture Checks

- `tests/truncate-on-word-boundary.vitest.ts` asserts the phase-pinned `…` suffix, prior-whitespace trimming, and no mid-token endings at 450, 520, and 900 character inputs with limit 500. [SOURCE: research.md §11] [SOURCE: research.md §D.3]
- `tests/memory-quality-phase1.vitest.ts` asserts F-AC1 (helper boundary behaviour + grep-style proof that `collect-session-data.ts` calls the helper) and F-AC7 (template fs contains the `ANCHOR:overview` opener, the `<a id="overview">` tag, the `[OVERVIEW](#overview)` TOC link, and excludes any `ANCHOR:summary` opener inside the OVERVIEW block).

### Regression Coverage

- `tests/input-normalizer-unit.vitest.ts` and `tests/collect-session-data.vitest.ts` must continue to pass after the ellipsis swap.

### CLI Replay

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && \
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
    "$PWD/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json" \
    "$PWD/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/001-foundation-templates-truncation"
```

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && \
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
    "$PWD/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json" \
    "$PWD/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/001-foundation-templates-truncation"
```

### Structural Validation

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/001-foundation-templates-truncation
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| `../research/research.md` | Packet evidence | The phase loses its owner map and fixture contract. [SOURCE: research.md §4] [SOURCE: research.md §11] |
| Iteration 16 fixture shapes | Test design | F-AC1/F-AC7 become ad hoc instead of deterministic. |
| Iteration 17 extraction order | Refactor guardrail | Helper work risks widening into unrelated truncation sites. |
| Parent handoff row | Packet coordination | Phase 2 cannot consume an unverified helper baseline. |
| `npm run build` (both packages) | Build pipeline | `dist/` drifts from source and the CLI replays test the wrong code. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Phase 1 should land as two small PR-sized changes bundled into one child-phase execution sequence: template + validator + parser alignment first, helper extraction plus OVERVIEW migration second. The closeout gate is not "tests look good in isolation"; it is "F-AC1 and F-AC7 pass, JSON-mode replays exit `0`, phase validation passes, and the parent packet can mark this phase complete." [SOURCE: research.md §10] [SOURCE: research.md §11] [SOURCE: ../spec.md#phase-handoff-criteria]

Rollback strategy:

- If PR-2 causes unexpected narrative drift, revert PR-2 while keeping PR-1 (template + validator + parser rename). PR-1 on its own is a coherent rename that the quality gate accepts.
- If PR-1's validator update unexpectedly breaks other memory writes, temporarily widen the validator to accept BOTH `summary` and `overview` as valid commentIds for the overview section (same defensive pattern already used by the memory parser regex) rather than reverting the template.
- Both PRs are file-local and independently revertable via `git checkout -- <path>`.
<!-- /ANCHOR:rollback -->
