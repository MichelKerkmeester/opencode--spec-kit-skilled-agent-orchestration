---
title: "Implementation [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-auto-detection-fixes/plan]"
description: "title: \"Implementation Plan: Auto-Detection Fixes\""
trigger_phrases:
  - "implementation"
  - "plan"
  - "012"
  - "auto"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Auto-Detection Fixes

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline (spec-folder detection, extractors, workflow) |
| **Storage** | None (in-memory detection and extraction) |
| **Testing** | Vitest |

### Overview

This plan implements a multi-fix phase organized by sub-problem: (1) detection cascade expansion adding git-status Priority 2.7 signal, session activity Priority 3.5 signal, and parent-affinity boost to `folder-detector.ts`; (2) extraction pipeline fixes for decision deduplication in `decision-extractor.ts`, `key_files` tree-thinning root cause in `workflow.ts`, and blocker validation in `session-extractor.ts`; (3) template contract wiring for `memory_classification`, `session_dedup`, and `causal_links` fields through `workflow.ts`. The fixes address four distinct bugs discovered during R-13 research that compound to produce incorrect auto-detection, duplicate decisions, empty key file lists, and garbage blocker content.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (exact counts: 4 decisions not 8, key_files non-empty, parent detected over children)
- [x] Dependencies identified (R-11 recommended first but not blocking)

### Definition of Done

- [x] In-scope acceptance criteria met: Fix 1 (Priority 2.7/3.5 low-confidence guards), Fix 2a (validateFilePath), Fix 2b (isSymbolicLink skip) [Evidence: 7/7 auto-detection-fixes, 5/5 template-structure, 79/0 phase-command-workflows all pass]
- [x] Tests passing [Evidence: 91 total tests green across three suites]
- [x] Docs updated [Evidence: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md all updated]
- [x] All acceptance criteria met: REQ-002 (decision dedup), REQ-003 (tree-thinning), REQ-005 (parent-affinity), REQ-006 (blocker validation), REQ-007 (template wiring) all confirmed implemented [Evidence: see checklist.md for per-item evidence]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Multi-fix phase -- three independent sub-problems addressed in sequence with shared verification at the end.

### Key Components

- **`folder-detector.ts`**: Detection cascade with new Priority 2.7 (git-status) and Priority 3.5 (session activity) signals, plus parent-affinity depth boost
- **`decision-extractor.ts`**: Deduplication guard at the observation/manual-decision concatenation boundary (lines 260-261)
- **`workflow.ts`**: Tree-thinning input fix (file content instead of descriptions), `key_files` filesystem fallback, and template field wiring for `memory_classification`, `session_dedup`, `causal_links`
- **`session-extractor.ts`**: Blocker content validation regex in `extractBlockers()`
- **`session-activity-signal.ts`** (new): `SessionActivitySignal` interface and `buildSessionActivitySignal()` builder

### Data Flow

**Sub-problem 1 -- Detection cascade:**
1. `folder-detector.ts` runs existing Priority 1-2.5 signals (folder name match, spec content match, etc.)
2. NEW: Priority 2.7 runs `git status --porcelain`, filters to spec paths, counts files per candidate folder
3. NEW: Priority 3.5 aggregates session activity (tool calls, git changes, transcript mentions) into confidence boosts
4. NEW: Parent-affinity check -- if parent has >3 children with recent mtime, parent's effective depth is boosted to match children
5. `assessAutoDetectConfidence` uses the enriched signal set to rank candidates

**Sub-problem 2 -- Extraction fixes:**
1. `decision-extractor.ts:260-261` -- when `processedManualDecisions.length > 0`, set `decisionObservations = []` before concatenation
2. `workflow.ts` -- tree-thinning receives actual file content (not `f.DESCRIPTION`), preventing over-merging; if still empty, filesystem fallback lists `*.md/*.json`
3. `session-extractor.ts` -- `extractBlockers()` rejects strings matching structural artifact patterns before adding to blockers array

**Sub-problem 3 -- Template wiring:**
1. `workflow.ts` reads `memory_classification`, `session_dedup`, `causal_links` from extractor outputs
2. Values are passed to the template rendering context so they appear in the final memory output
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Low-Confidence Fall-Through Guards, Priority 2.7 and 3.5 (COMPLETED)

- [x] Added `lowConfidence` fall-through guard at Priority 2.7 (git-status) in `folder-detector.ts` (~L1387): `const selected` changed to `let selected: AutoDetectCandidate | null`, `lowConfidence` check added, falls through to Priority 4 on low confidence with warning log
- [x] Added `lowConfidence` fall-through guard at Priority 3.5 (session-activity) in `folder-detector.ts` (~L1437): same pattern applied
- [x] Previously these always auto-selected the first candidate even when `lowConfidence: true`; now they fall through to Priority 4 for additional disambiguation

### Phase 2: Decision Dedup Fix (REQ-002) (COMPLETED)

- [x] Guard at `decision-extractor.ts` lines 353-354: `if (processedManualDecisions.length > 0) { decisionObservations = []; }` [Evidence: decision-extractor.ts:353-354; test SC-002 proves 4+4→4]

### Phase 3: Path Security and Symlink Fixes in workflow.ts (COMPLETED)

- [x] Fix 2a: Replaced naive `isWithinDirectory` body in `workflow.ts` with `validateFilePath` from `@spec-kit/shared/utils/path-security`, using `realpathSync` + containment check to properly handle symlinks
- [x] Fix 2b: Added `entry.isSymbolicLink()` skip guard in `listSpecFolderKeyFiles` in `workflow.ts`, matching existing pattern from `subfolder-utils.ts:84`
- [x] Tree-thinning content fix: `resolveTreeThinningContent` at workflow.ts:567 reads actual file content via `fsSync.readFileSync` [Evidence: workflow.ts:567]

### Phase 4: Session Activity Signal (REQ-004) (COMPLETED)

- [x] `session-activity-signal.ts` created with `SessionActivitySignal` interface and `buildSessionActivitySignal()` function
- [x] Priority 3.5 signal wired in `folder-detector.ts` with `lowConfidence` fall-through guard
- [x] Full confidence boost wiring: Read=0.2, Edit/Write=0.3, git-changed=0.25, transcript=0.1; test confirms total of 0.95

### Phase 5: Parent-Affinity Boost (REQ-005) (COMPLETED)

- [x] `applyParentAffinityBoost` at folder-detector.ts:380-396 activates when `childCandidates.length > 3`, sets `effectiveDepth = Math.max(candidate.depth, ...childCandidates.map(...))` [Evidence: folder-detector.ts:390-394; test "promotes the parent folder" confirms]

### Phase 6: Blocker Validation (REQ-006) (COMPLETED)

- [x] `INVALID_BLOCKER_PATTERNS` at session-extractor.ts:222-231 rejects markdown headers (`/^##\s/`), leading quotes/backticks, and quote transition artifacts; `isInvalidBlockerText` at line 233 applies all patterns [Evidence: session-extractor.ts:222-231; test "rejects structural blocker artifacts"]

### Phase 7: Template Contract Wiring (REQ-007) (COMPLETED)

- [x] `buildMemoryClassificationContext` at workflow.ts:758, `buildSessionDedupContext` at workflow.ts:808, `buildCausalLinksContext` at workflow.ts:860+ all wired into template rendering context [Evidence: workflow.ts:758+; test at auto-detection-fixes.vitest.ts:364 verifies all three fields]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Git-status signal: file count ranking, spec path filtering, caching | Vitest |
| Unit | Decision dedup: 4 manual decisions produce exactly 4 records | Vitest |
| Unit | Key files: tree-thinning with real content, filesystem fallback when empty | Vitest |
| Unit | Session activity signal: confidence boost calculation per signal type | Vitest |
| Unit | Blocker validation: markdown headers rejected, valid blockers preserved | Vitest |
| Integration | End-to-end detection with git-status + activity signal on a spec folder with parent/child structure | Vitest |
| Integration | Full pipeline render with `memory_classification`, `session_dedup`, `causal_links` wired | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-11 (session source validation) | Internal | Yellow | Should land first for transcript integrity; detection fixes can proceed independently but benefit from clean transcript input |
| `git` CLI availability | External | Green | Required for git-status signal; standard on all target environments |
| Existing folder-detector cascade | Internal | Green | New signals inserted at specific priority levels without restructuring existing cascade |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Git-status signal or parent-affinity boost causes regressions in existing auto-detection behavior (wrong folder selected for previously-working cases)
- **Procedure**: Disable Priority 2.7 and Priority 3.5 signals by setting their confidence boost to 0; revert parent-affinity boost condition; decision dedup guard and blocker validation are low-risk 2-line changes that can be reverted independently; template wiring additions are additive and do not break existing output if reverted
<!-- /ANCHOR:rollback -->
