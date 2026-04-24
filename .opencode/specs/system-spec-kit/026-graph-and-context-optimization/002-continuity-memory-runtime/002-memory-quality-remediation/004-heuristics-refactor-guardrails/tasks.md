---
title: "...t-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/004-heuristics-refactor-guardrails/tasks]"
description: "Task Format: T### [P?] Description (file path or fixture surface)"
trigger_phrases:
  - "phase 4 tasks"
  - "d5 lineage tasks"
  - "savemode refactor tasks"
  - "reviewer contract tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/004-heuristics-refactor-guardrails"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->"
---
# Tasks: Phase 4 — Heuristics, Refactor & Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after the stated dependency |
| `[B]` | Blocked by an upstream phase or prior PR |

**Task Format**: `T### [P?] Description (file path or fixture surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm Phase 1 merge state before Phase 4 implementation begins (`../spec.md`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:179-180]
- [ ] T002 Confirm Phase 2 merge state before reviewer D4 / D7 checks are treated as release-ready (`../spec.md`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:180-180]
- [ ] T003 Confirm Phase 3 merge state before SaveMode migration starts (`../spec.md`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:181-182]
- [ ] T004 Re-read PR-7 / PR-8 / PR-9 rows in `../research/research.md` before editing code or fixtures (`../research/research.md`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1164]
- [ ] T005 Verify the phase remains scoped to PR-7 / PR-8 / PR-9 and not PR-10 / PR-11 (`../research/research.md`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:227-228] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1522-1525]
- [ ] T006 Verify fixture harness availability for `F-AC5`, `F-AC8`, and reused `F-AC1` / `F-AC2` / `F-AC6` (fixture surface) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1162]

### Setup Notes

- The implementation owner should freeze the exact PR order before code work begins so fixture and reviewer evidence lines up with the PR train described in the research packet. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1164]
- Phase 4 must assume Phase 1, Phase 2, and Phase 3 behavior is already merged, not partially cherry-picked, because PR-8 and PR-9 both depend on earlier helper and defect fixes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:197-200]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### PR-7 — D5 Auto-supersedes with Continuation Gate

- [ ] T101 Create `core/find-predecessor-memory.ts` (`.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160]
- [ ] T102 Add a bounded partial-header read primitive for sibling frontmatter / title inspection (`core/find-predecessor-memory.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1481-1481] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:23-24]
- [ ] T103 Implement the continuation gate using the iteration-14 high-precision title families (`core/find-predecessor-memory.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:22-39]
- [ ] T104 Exclude noisy `phase N` and `vN` continuation shapes (`core/find-predecessor-memory.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:31-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:38-39]
- [ ] T105 Preserve numeral-led / hyphenated iteration carry-forward support where the narrowed regex allows it (`core/find-predecessor-memory.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:36-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-014.md:51-51]
- [ ] T106 Use a one-pass candidate accumulator plus ambiguity counter to keep predecessor discovery linear (`core/find-predecessor-memory.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:34-43]
- [ ] T107 Skip discovery when the current save already supplies `causal_links.supersedes` (`core/find-predecessor-memory.ts` or `workflow.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:52-53]
- [ ] T108 Integrate predecessor discovery at `workflow.ts:1305-1372` immediately before `buildCausalLinksContext()` (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:59-60]
- [ ] T109 Update `memory-metadata.ts:227-236` so discovered supersedes lineage is emitted into the render contract (`.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1477-1481]
- [ ] T110 Author `F-AC5` 3+ sibling lineage fixture with hit, miss, and ambiguity branches (fixture surface) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1516-1516]
- [ ] T111 Measure PR-7 save-time overhead at 50 / 100 / 500 sibling sizes (benchmark or fixture harness) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:28-32]
- [ ] T112 Record whether PR-7 needed the partial-header reader to stay inside the acceptable envelope (evidence note) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:52-57]

### PR-7 Sequencing Notes

- T101 through T107 should land together because the helper contract is only meaningful once the continuation gate, ambiguity skip, and caller-supplied supersedes preservation are all in place. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:52-66]
- T108 and T109 should not merge until the fixture author has at least one 3+ lineage folder prepared, otherwise the workflow insertion could ship without proof that the render contract actually carries the discovered relation through to disk. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1516-1518]
- T111 and T112 are exit tasks, not stretch tasks. PR-7 is incomplete without measured evidence that the bounded read strategy kept the heuristic within the acceptable envelope. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:28-32]

### PR-8 — SaveMode Enum + Helper Migration

- [ ] T201 Introduce `SaveMode` with at least `JSON`, `CAPTURE`, and `MANUAL` values (shared type surface)
- [ ] T202 Backfill `SaveMode` from current inputs without behavior change on first introduction (workflow / normalization surface) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:60-61]
- [ ] T203 Migrate `workflow.ts:453-460` from `_source === 'file'` to `SaveMode` (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:46-47]
- [ ] T204 Migrate `workflow.ts:654-659` from `_source !== 'file'` to `SaveMode` (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:47-47]
- [ ] T205 Migrate `collect-session-data.ts:361-388` to `SaveMode` (`.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:48-48]
- [ ] T206 Migrate `collect-session-data.ts:475-482` to `SaveMode` (`.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:49-49]
- [ ] T207 Separate metadata passthrough in `collect-session-data.ts:836-847` from behavior selection (`.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:50-50]
- [ ] T208 Migrate reviewer mode gate in `post-save-review.ts:220-226` to `SaveMode` (`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:51-51]
- [ ] T209 Preserve `_sourceTranscriptPath` / `_sourceSessionId` as metadata only in `input-normalizer.ts:1434-1443` (`.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:52-52]
- [ ] T210 Remove remaining raw `_source`-based mode control across the mapped live surface (repo-local sweep limited to Phase 4 scope) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-58]
- [ ] T211 Keep reviewer migration last in the PR-8 sequence after workflow and extractor mode branches are stable (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:72-72]
- [ ] T212 Re-run `F-AC1` after SaveMode migration (fixture replay) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]
- [ ] T213 Re-run `F-AC2` after SaveMode migration (fixture replay) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]
- [ ] T214 Re-run `F-AC6` after SaveMode migration (fixture replay) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]
- [ ] T215 Capture a before/after branch sweep showing that raw `_source` control-flow predicates are gone from the mapped surfaces (evidence artifact) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-58]

### PR-8 Callsite Inventory

| Task | File:Line | Mode Responsibility |
|------|-----------|---------------------|
| T203 | `workflow.ts:453-460` | Early workflow branch for file-driven save handling [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:46-47] |
| T204 | `workflow.ts:654-659` | Captured-session gate inside workflow [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:47-47] |
| T205 | `collect-session-data.ts:361-388` | Session-status heuristic branch [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:48-48] |
| T206 | `collect-session-data.ts:475-482` | Completion-percent heuristic branch [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:49-49] |
| T207 | `collect-session-data.ts:836-847` | Metadata passthrough separation from mode control [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:50-50] |
| T208 | `post-save-review.ts:220-226` | Reviewer mode gate migration [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:51-51] |
| T209 | `input-normalizer.ts:1434-1443` | Metadata-only `_source` field retention [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:52-52] |

### PR-8 Sequencing Notes

- T201 and T202 should establish the enum and compatibility shim first, before any callsite migration begins. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:60-61]
- T203 through T209 should follow the iteration-17 dependency order rather than being parallelized arbitrarily, because upstream workflow gates influence downstream extractor and reviewer behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:60-72]
- T212 through T215 close the refactor. The enum migration does not count as complete until the old fixtures are replayed and the raw `_source` control-flow comparisons are proven absent from the mapped surfaces. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]

### PR-9 — Reviewer Guardrail Upgrade

- [ ] T301 Add CHECK-D1 to detect OVERVIEW truncation regressions (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:27-44]
- [ ] T302 Add CHECK-D2 to detect lexical decision placeholders (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:46-56]
- [ ] T303 Add CHECK-D3 with the tuned iteration-15 junk-trigger blocklist (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:58-78]
- [ ] T304 Add CHECK-D4 for frontmatter-vs-metadata tier divergence (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:80-91]
- [ ] T305 Add CHECK-D5 for continuation-title saves lacking `supersedes`, while keeping the check deterministic (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:93-105]
- [ ] T306 Add CHECK-D6 for duplicate trigger phrases (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:107-117]
- [ ] T307 Add CHECK-D7 using payload-side provenance expectation flags (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:119-135]
- [ ] T308 Add CHECK-D8 for anchor mismatch (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:137-151]
- [ ] T309 Add CHECK-GEN-2 composite blocking logic (`post-save-review.ts`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:153-159]
- [ ] T310 Preserve the HIGH vs MEDIUM severity contract from iteration 19 (reviewer contract verification) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:27-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:137-139]
- [ ] T311 Author broken D1 fixture and prove CHECK-D1 fires once (fixture surface) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]
- [ ] T312 Author broken D4 fixture and prove CHECK-D4 fires once (fixture surface) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]
- [ ] T313 Author broken D7 fixture and prove CHECK-D7 fires once (fixture surface) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]
- [ ] T314 Author broken D8 fixture and prove CHECK-D8 fires once (fixture surface) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]
- [ ] T315 Author clean `F-AC8` fixture and prove zero false positives (fixture surface) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:94-94] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]

### PR-9 Sequencing Notes

- T301 through T309 should land as a single reviewer-contract PR because splitting the checks across multiple patches weakens the CHECK-D1..D8 guarantee described in iteration 19. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:153-159]
- T311 through T315 should be authored with fixture names and expectations that map 1:1 to the check IDs so future reviewers can immediately tell whether the contract is complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:25-176]
- Clean `F-AC8` is a release gate, not a documentation nicety. Phase 4 cannot close if the reviewer flags the clean fixture after the guardrail upgrade. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T401 Replay the full PR train end-to-end after PR-7 / PR-8 / PR-9 all land (fixture harness) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237]
- [ ] T402 Confirm `F-AC5` remains green after PR-9, not just after PR-7 (fixture replay) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160]
- [ ] T403 Confirm clean `F-AC8` remains free of reviewer noise after the full train lands (fixture replay) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]
- [ ] T404 Verify measured save duration stays below the M9 p95 warning threshold (benchmark or telemetry harness) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-024.md:88-93] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-024.md:135-140]
- [ ] T405 Verify PR-7 still uses a one-pass / linear discovery pattern and avoids rescan or pairwise ambiguity anti-patterns (code review / evidence note) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:34-43] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:65-66]
- [ ] T406 Run `validate.sh` on this child folder (`004-heuristics-refactor-guardrails/`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]
- [ ] T407 Update the parent phase map status once this child is actually implementation-complete (`../spec.md`) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:177-183]
- [ ] T408 Capture release-note-relevant outcomes for later packet closeout, especially the D5 fix and SaveMode refactor (handoff note) [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1530-1531]

### Verification Notes

- T401 should run only after all three PRs are stacked; otherwise the replay cannot prove the end-to-end interaction between D5 lineage insertion, SaveMode branch cleanup, and reviewer enforcement. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237]
- T404 should compare measured p95 duration against the M9 alert threshold so the team can distinguish an acceptable Phase 4 cost from an operational regression that should move into Phase 5 follow-on work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-024.md:88-93] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-024.md:135-140]
- T407 and T408 are closeout tasks. They should remain pending until all fixture, performance, and validator evidence is captured.

### Verification Coverage Matrix

| Verification Task | Confirms |
|-------------------|----------|
| T401-T403 | Cross-PR functional behavior after the full train lands |
| T404-T405 | Performance and algorithm-shape guardrails stay inside the research envelope |
| T406 | Spec packet documentation integrity for this child phase |
| T407-T408 | Parent phase map and release-note readiness closeout |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `F-AC5`, `F-AC8`, `F-AC1`, `F-AC2`, and `F-AC6` all green in the required parts of the train
- [ ] Broken D1 / D4 / D7 / D8 reviewer fixtures prove the intended checks fire
- [ ] Child-folder validation evidence recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
