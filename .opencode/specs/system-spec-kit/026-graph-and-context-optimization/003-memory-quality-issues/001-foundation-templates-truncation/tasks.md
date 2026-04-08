---
title: "Tasks: Phase 1: Foundation (Templates & Truncation)"
description: "Ordered Phase 1 execution tasks for PR-1 and PR-2, including helper extraction, call-site migration, contract validator + memory parser alignment, fixture authoring, validation, and parent packet status handoff."
---
# Tasks: Phase 1: Foundation (Templates & Truncation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `T1.x` | Phase 1 task identifier |
| `Acceptance` | Concrete AC fixture, CLI check, or file check |
| `Dependencies` | Blocking predecessor tasks |

Execution is intentionally linear because helper extraction, validator coupling, fixture coverage, and parent handoff are tightly coupled. The only safe parallelism is inside individual test authoring once the helper surface is defined. [SOURCE: research.md §10] [SOURCE: research/iterations/iteration-017.md:60-75]
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T1.0: Read research, plan, and pin conventions

**Description**
Read `../research/research.md`, `../research/iterations/iteration-016.md`, and `../research/iterations/iteration-017.md` once before touching code. Confirm the canonical ellipsis is `…` (U+2026) per parent handoff criteria, the helper extraction order is `input-normalizer.ts` first then `collect-session-data.ts`, and the scope is locked to PR-1 + PR-2 files only.

**File(s)**
- `../research/research.md`
- `../research/iterations/iteration-016.md`
- `../research/iterations/iteration-017.md`
- `../spec.md` (phase map + handoff criteria)

**Acceptance**
Ellipsis choice pinned, extraction order understood, scope lock acknowledged.

**Dependencies**
None.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T1.1: Create `truncateOnWordBoundary()` and its unit tests

**Description**
Create `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` exporting `truncateOnWordBoundary(text, limit, opts?: { ellipsis?: string; minBoundary?: number })`. Default ellipsis is `…` (U+2026). Add focused unit coverage for whitespace-boundary trimming, exact-length passthrough, custom ellipsis option, and empty/negative-limit edge cases.

**File(s)**
- `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts`

**Acceptance**
Helper unit tests pass (7 cases) and explicitly assert the `…` suffix is a single codepoint, never three ASCII dots. [SOURCE: research.md §D.3]

**Dependencies**
T1.0.

---

### T1.2: Migrate the observation-summary callsites in `input-normalizer.ts`

**Description**
Refactor `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:275-280` so both `summaryTitle` (limit 100) and `narrativeText` (limit 500) call the shared helper instead of inlining their own boundary-aware rules. This intentionally swaps the suffix from `'...'` (three ASCII dots) to `'…'` (single Unicode char), pinning the canonical form for Phase 1 and beyond. This step intentionally lands before T1.3 so the helper is first lifted from the already-proven boundary-aware path.

**File(s)**
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts`

**Acceptance**
`tests/input-normalizer-unit.vitest.ts` still passes. Both callsites route through the helper.

**Dependencies**
T1.1.

---

### T1.3: Migrate the OVERVIEW owner in `collect-session-data.ts`

**Description**
Replace `data.sessionSummary.substring(0, 500)` at the `SUMMARY` assignment in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:877-881` with `truncateOnWordBoundary(data.sessionSummary, 500)`. Add the import at the top of the file preserving the relative import style used by sibling files.

**File(s)**
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts`

**Acceptance**
`tests/collect-session-data.vitest.ts` still passes. The file no longer contains the raw D1 clamp.

**Dependencies**
T1.2.

---

### T1.4: Fix the OVERVIEW anchor IDs in the context template

**Description**
Rename the OVERVIEW block comment markers in the context template file at `.opencode/skill/system-spec-kit/templates/context_template.md` from the legacy `summary` opener and closer to the new `overview` opener and closer at the `<a id="overview">` section (line 330 and line 352 of the template).

**File(s)**
- `.opencode/skill/system-spec-kit/templates/context_template.md`

**Acceptance**
F-AC7 assertions pass and no legacy `summary` opener remains in the OVERVIEW block. Other unrelated legacy `summary` markers elsewhere in the repo (plan and checklist templates, anchor-metadata test fixtures) are untouched.

**Dependencies**
T1.0.

---

### T1.4b: Align the contract validator SECTION_RULES (discovered coupling)

**Description**
Update `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts` line 51 so the OVERVIEW rule reads `{ sectionId: 'overview', commentId: 'overview', ... }` instead of `commentId: 'summary'`. The template rename in T1.4 breaks the quality gate without this update. Every rendered OVERVIEW memory aborts with `QUALITY_GATE_ABORT: missing_anchor_comment:overview` otherwise.

**File(s)**
- `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts`

**Acceptance**
Post-build quality gate accepts the renamed marker in the rendered memory output.

**Dependencies**
T1.4.

---

### T1.4c: Update the memory parser regex for backward compatibility

**Description**
Update the memory parser at `mcp_server/lib/parsing/memory-parser` line 526 so the OVERVIEW section regex accepts both the legacy `summary` and the new `overview` closing markers as end-of-section terminators. This preserves parser compatibility with historical memory files written under the old marker.

**File(s)**
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`

**Acceptance**
Historical memories still parse correctly; new memories parse correctly via the `overview` branch.

**Dependencies**
T1.4.

---

### T1.5: Author fixture `F-AC1` and the Phase 1 vitest suite

**Description**
Create the F-AC1 fixture JSON file that reproduces the mid-word OVERVIEW truncation with a `sessionSummary` over 600 characters. Author the Phase 1 vitest suite covering F-AC1 (helper output + grep proof the owner file calls the helper).

**File(s)**
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json`
- `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts`

**Acceptance**
`memory-quality-phase1.vitest.ts` F-AC1 describe block passes: result ends with `…`, total length ≤ 501, next char in original is whitespace, and the source of `collect-session-data.ts` contains the helper call literal.

**Dependencies**
T1.1, T1.2, T1.3.

---

### T1.6: Author fixture `F-AC7`

**Description**
Create the minimal OVERVIEW-render fixture that proves anchor consistency in the rendered template for the D8 patch. Extend `memory-quality-phase1.vitest.ts` with the F-AC7 describe block that reads the context template file via fs and asserts the `ANCHOR:overview` opener, the `<a id="overview">` tag, and the `[OVERVIEW](#overview)` TOC link are all present, and that the legacy `summary` opener is absent from the OVERVIEW block.

**File(s)**
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json`
- `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts`

**Acceptance**
F-AC7 describe block passes against the updated template.

**Dependencies**
T1.4.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T1.7: Build both TypeScript packages

**Description**
Run `npm run build` in `.opencode/skill/system-spec-kit/scripts` and `.opencode/skill/system-spec-kit/mcp_server` so `dist/` reflects the T1.1–T1.4c source changes.

**File(s)**
- `.opencode/skill/system-spec-kit/scripts/package.json`
- `.opencode/skill/system-spec-kit/mcp_server/package.json`

**Acceptance**
Both builds exit `0`. No compile errors.

**Dependencies**
T1.1, T1.2, T1.3, T1.4, T1.4b, T1.4c.

---

### T1.8: Run the four vitest suites

**Description**
Run vitest against the new helper tests, the Phase 1 suite, and both pre-existing regression suites.

```bash
cd .opencode/skill/system-spec-kit/scripts && \
  npx vitest run \
    tests/truncate-on-word-boundary.vitest.ts \
    tests/memory-quality-phase1.vitest.ts \
    tests/input-normalizer-unit.vitest.ts \
    tests/collect-session-data.vitest.ts \
    --config ../mcp_server/vitest.config.ts --root .
```

**File(s)**
- See command above.

**Acceptance**
All four suites pass.

**Dependencies**
T1.7.

---

### T1.9: Replay both fixtures through the compiled CLI

**Description**
Replay F-AC1 and F-AC7 through `dist/memory/generate-context.js` using ABSOLUTE spec-folder paths. Confirm both exit `0`.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && \
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
    "$PWD/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json" \
    "$PWD/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation"

cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && \
  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
    "$PWD/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json" \
    "$PWD/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation"
```

**File(s)**
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json`
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json`

**Acceptance**
Both commands exit `0`.

**Dependencies**
T1.8.

---

### T1.10: Clean fixture-written memory artifacts

**Description**
Remove the memory files and metadata.json created by the F-AC1 and F-AC7 replays from the Phase 1 `memory/` folder so the real packet memory store stays clean. Do NOT touch unrelated memory files.

**File(s)**
- `./memory/*.md` (fixture-written entries only)
- `./memory/metadata.json`

**Acceptance**
`git status` on the Phase 1 folder shows no fixture-written memory residue.

**Dependencies**
T1.9.

---

### T1.11: Validate the Phase 1 spec folder

**Description**
Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` against this folder. Must exit `0`.

**File(s)**
- `./spec.md`
- `./plan.md`
- `./tasks.md`
- `./checklist.md`
- `./README.md`
- `./implementation-summary.md`

**Acceptance**
`validate.sh` exits `0` for the phase folder.

**Dependencies**
T1.5, T1.6, T1.9, T1.10.

---

### T1.12: Update the parent PHASE DOCUMENTATION MAP status

**Description**
Flip the parent `../spec.md` row for `001-foundation-templates-truncation/` from `Pending` to `Complete` and preserve the published handoff criteria for Phase 2.

**File(s)**
- `../spec.md`

**Acceptance**
The parent map row shows `Complete` and the handoff line still references PR-1, PR-2, F-AC1, F-AC7, and the shared helper requirement.

**Dependencies**
T1.11.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T1.0 Research + iterations read; ellipsis decision pinned to `…`
- [x] T1.1 `truncateOnWordBoundary` helper and unit tests created
- [x] T1.2 `input-normalizer.ts` observation-summary callsites migrated to helper
- [x] T1.3 `collect-session-data.ts` OVERVIEW owner migrated to helper
- [x] T1.4 Context template OVERVIEW comment markers renamed to `overview`
- [x] T1.4b Contract validator SECTION_RULES aligned with new `overview` commentId
- [x] T1.4c Memory parser regex accepts both `summary` and `overview` terminators
- [x] T1.5 F-AC1 fixture authored and vitest suite asserts helper boundary contract
- [x] T1.6 F-AC7 fixture authored and vitest suite asserts template anchor consistency
- [x] T1.7 Scripts + mcp_server TypeScript builds succeed
- [x] T1.8 Four vitest suites pass (helper, phase1, input-normalizer, collect-session-data)
- [x] T1.9 Both fixture CLI replays exit 0 against absolute spec-folder paths
- [x] T1.10 Fixture-written memory artifacts cleaned up
- [x] T1.11 Spec folder `validate.sh` exits 0
- [x] T1.12 Parent phase map updated to `Complete`

No task may claim done without either an AC fixture, a concrete CLI check, or a file-level verification artifact. Parent handoff to Phase 2 is blocked until T1.12 is complete. [SOURCE: ../spec.md#phase-handoff-criteria]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Implementation plan: `plan.md`
- Verification checklist: `checklist.md`
- Implementation summary: `implementation-summary.md`
- Parent spec: `../spec.md`
- Research: `../research/research.md`
<!-- /ANCHOR:cross-refs -->
