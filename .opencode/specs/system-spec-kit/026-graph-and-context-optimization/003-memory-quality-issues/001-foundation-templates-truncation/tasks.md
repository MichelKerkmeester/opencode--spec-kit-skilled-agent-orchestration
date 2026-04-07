---
title: "Tasks: Phase 1 — Foundation (Templates & Truncation)"
description: "Ordered Phase 1 execution tasks for PR-1 and PR-2, including helper extraction, call-site migration, fixture authoring, validation, and parent packet status handoff."
---
# Tasks: Phase 1 — Foundation (Templates & Truncation)

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
<!-- /ANCHOR:notation -->

---

## Execution Order

These tasks are intentionally linear because the helper extraction, fixture coverage, and parent handoff criteria are tightly coupled. The only safe parallelism is inside individual test authoring once the helper surface is defined. [SOURCE: research.md §10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Foundation Code

### T1.1 — Create `truncateOnWordBoundary()` and its unit tests

**Description**  
Create `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts` with the helper signature proposed in iteration 17 and add focused unit coverage for whitespace-boundary trimming, exact-length passthrough, and the pinned ellipsis behavior. [SOURCE: research.md §D.2] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:29-31]

**File(s)**  
- `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts`

**Acceptance**  
Helper unit tests pass and explicitly prove the F-AC1 truncation contract at representative lengths. [SOURCE: research.md §11] [SOURCE: research.md §D.3]

**Dependencies**  
None.

---

### T1.2 — Migrate the OVERVIEW owner in `collect-session-data.ts`

**Description**  
Replace the raw `data.sessionSummary.substring(0, 500)` in `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:875-881` with the new helper so the OVERVIEW block no longer cuts mid-token. [SOURCE: research.md §5] [SOURCE: research.md §7]

**File(s)**  
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts`

**Acceptance**  
F-AC1-style rendered OVERVIEW assertions pass and the file no longer contains the raw D1 clamp. [SOURCE: research.md §D.1]

**Dependencies**  
T1.1

---

### T1.3 — Migrate the existing observation-summary callsites in `input-normalizer.ts`

**Description**  
Refactor `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:274-283` and the `normalizeInputData()` usage seam at `:668-674` to call the shared helper instead of inlining a second boundary-aware truncation rule. [SOURCE: research.md §B.4] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:18-19]

**File(s)**  
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts`

**Acceptance**  
The observation-summary path and OVERVIEW path share one helper contract, and the existing narrative behavior stays intact apart from the phase-pinned suffix decision. [SOURCE: research.md §13] [SOURCE: research.md §D.2]

**Dependencies**  
T1.1

---

### T1.4 — Fix the OVERVIEW anchor IDs in `.opencode/skill/system-spec-kit/templates/context_template.md`

**Description**  
Standardize the TOC fragment, HTML id, and comment marker on `overview` in `.opencode/skill/system-spec-kit/templates/context_template.md:172-183` and `:330-352`. [SOURCE: research.md §5] [SOURCE: research.md §D.1]

**File(s)**  
- `.opencode/skill/system-spec-kit/templates/context_template.md`

**Acceptance**  
F-AC7 assertions pass and no `ANCHOR:summary` marker remains in the OVERVIEW block. [SOURCE: research.md §D.3]

**Dependencies**  
None.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fixtures and Replay

### T1.5 — Author fixture `F-AC1`

**Description**  
Create the Phase 1 JSON fixture that reproduces the mid-word OVERVIEW truncation by pushing `sessionSummary` just beyond the 500-character boundary and asserting the post-fix word-boundary result. [SOURCE: research.md §D.3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:37-54]

**File(s)**  
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json`
- `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts`

**Acceptance**  
The fixture matches the Phase 1 contract: no mid-token ending, capped rendered length envelope, and the exact pinned suffix. [SOURCE: research.md §11] [SOURCE: research.md §D.3]

**Dependencies**  
T1.1, T1.2, T1.3

---

### T1.6 — Author fixture `F-AC7`

**Description**  
Create the minimal OVERVIEW-render fixture that proves anchor consistency in the rendered markdown for the D8 template patch. [SOURCE: research.md §D.3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:187-203]

**File(s)**  
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json`
- `.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts`

**Acceptance**  
The rendered markdown contains the `overview` TOC fragment, HTML id, and comment marker, and excludes the `ANCHOR:summary` marker from the OVERVIEW block. [SOURCE: research.md §11] [SOURCE: research.md §D.3]

**Dependencies**  
T1.4

---

### T1.7 — Replay both fixtures through `generate-context.js`

**Description**  
Run the compiled JSON-mode entrypoint against F-AC1 and F-AC7, asserting exit `0` for both fixture replays and confirming that helper-level fixes hold under the real CLI boundary. [SOURCE: research.md §11]

**File(s)**  
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json`
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json`

**Acceptance**  
Both commands exit `0` and any follow-up markdown assertions pass. [SOURCE: research.md §D.3]

**Dependencies**  
T1.2, T1.3, T1.4, T1.5, T1.6
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Validation and Handoff

### T1.8 — Validate the Phase 1 spec folder

**Description**  
Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` against `001-foundation-templates-truncation/` after code and fixture work land so the child packet is structurally complete before handoff. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:185-193]

**File(s)**  
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/checklist.md`

**Acceptance**  
`validate.sh` exits `0` for the phase folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197]

**Dependencies**  
T1.5, T1.6, T1.7

---

### T1.9 — Update the parent PHASE DOCUMENTATION MAP status

**Description**  
After all Phase 1 checks pass, update the parent `spec.md` row for `001-foundation-templates-truncation/` from `Pending` to `Complete` and preserve the published handoff criteria for Phase 2. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-197]

**File(s)**  
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md`

**Acceptance**  
The parent map row shows `Complete`, and the existing handoff line still references PR-1, PR-2, F-AC1, F-AC7, and the shared helper requirement. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197]

**Dependencies**  
T1.8
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Phase 1 code work is complete only when T1.1 through T1.9 are all done in order.
- No task may claim done without either an AC fixture, a concrete CLI check, or a file-level verification artifact.
- Parent handoff to Phase 2 is blocked until T1.9 is complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:197-197]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Implementation plan: `plan.md`
- Verification checklist: `checklist.md`
<!-- /ANCHOR:cross-refs -->
