---
title: "Implementation Plan: Auto-Detection Fixes"
---
# Implementation Plan: Auto-Detection Fixes

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] All acceptance criteria met (REQ-001 through REQ-007)
- [ ] Tests passing -- detection, decision, key_files, and blocker tests all green
- [ ] Docs updated (spec/plan in this folder)
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

### Phase 1: Git-Status Signal (REQ-001)

- [ ] Add `getGitStatusForSpecs()` function in `folder-detector.ts` that runs `git status --porcelain` and filters to paths under spec folder candidates
- [ ] Count untracked/modified files per candidate folder
- [ ] Insert as Priority 2.7 signal between existing Priority 2.5 and Priority 3
- [ ] Rank candidates: highest file count gets highest git-status confidence boost
- [ ] Cache git-status output per detection run to avoid repeated shell calls

### Phase 2: Decision Dedup Fix (REQ-002)

- [ ] At `decision-extractor.ts` lines 260-261, add guard: `if (processedManualDecisions.length > 0) { decisionObservations = []; }`
- [ ] This suppresses observation-derived decisions when explicit manual decisions exist, preventing 4+4=8 duplication
- [ ] Verify with test: 4 manual decisions in, exactly 4 decision records out

### Phase 3: Key Files Fix (REQ-003)

- [ ] In `workflow.ts`, change tree-thinning input from `f.DESCRIPTION` to actual file content (read first ~500 chars of each file)
- [ ] This prevents 1-3 token descriptions from merging all files into a single cluster
- [ ] Add filesystem fallback: when post-thinning `keyFiles` is empty, list `*.md` and `*.json` files from the spec folder
- [ ] Fallback returns file paths and sizes, not content, to stay lightweight

### Phase 4: Session Activity Signal (REQ-004)

- [ ] Create `scripts/extractors/session-activity-signal.ts` with `SessionActivitySignal` interface
- [ ] Interface fields: `toolCallPaths: string[]`, `gitChangedFiles: string[]`, `transcriptMentions: string[]`, `confidenceBoost: number`
- [ ] Implement `buildSessionActivitySignal()` that aggregates: `0.1/mention`, `0.2/Read`, `0.3/Edit|Write`, `0.25/git-changed-file`
- [ ] Wire into `folder-detector.ts` as Priority 3.5 signal

### Phase 5: Parent-Affinity Boost (REQ-005)

- [ ] In `folder-detector.ts`, after initial ranking, check each parent candidate
- [ ] If parent has >3 children with mtime within last 24 hours, boost parent's effective depth to match its deepest child
- [ ] This prevents depth-4 children from outranking depth-3 parents purely due to cascade depth bias

### Phase 6: Blocker Validation (REQ-006)

- [ ] In `session-extractor.ts`, add validation in `extractBlockers()` before adding to results
- [ ] Reject strings matching: `/^##\s/` (markdown headers), `/^['"` ]/' (leading quotes/backticks), `/'\s+to\s+'/` (quote transition artifacts)
- [ ] Log rejected blockers at debug level for diagnostics

### Phase 7: Template Contract Wiring (REQ-007)

- [ ] In `workflow.ts`, read `memory_classification` from the session extractor output and pass to template context
- [ ] Read `session_dedup` from the dedup extractor output and pass to template context
- [ ] Read `causal_links` from the causal extractor output and pass to template context
- [ ] Verify all three fields appear in rendered memory output when extractors produce values
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
