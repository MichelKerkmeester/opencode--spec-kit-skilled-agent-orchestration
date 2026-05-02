---
title: "Plan: Drift Finding Fixes"
description: "Surgical fix for sa-011 derived sync idempotence, plus 3 doc/test alignments for sa-004, sa-036, sa-037."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "045-drift-finding-fixes plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/045-drift-finding-fixes"
    last_updated_at: "2026-05-01T05:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Validate strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "045-plan-init"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---

# Plan: Drift Finding Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (product code), Markdown (catalogs) |
| **Framework** | Vitest |
| **Storage** | Filesystem |
| **Testing** | Existing vitest suites |

### Overview
Packet 042's audit and 043/044's tests left 4 FIXME markers. This packet resolves all four: one real product-code bug fix (sa-011), one test cleanup (sa-004 — not a bug, just test wording), and two catalog corrections (sa-036, sa-037).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Drift findings inventoried by packets 043/044 FIXME markers
- [x] Explore agent mapped each finding to file:line locations
- [x] Targeted vitest debug confirmed sa-011 root cause

### Definition of Done
- [ ] sa-011 stress test asserts `changed=false` on second call (passes)
- [ ] sa-004, sa-037 FIXME markers removed
- [ ] sa-036 catalog count = 51 (matches fixture)
- [ ] sa-037 catalog distinguishes "design envelope" from CI gate
- [ ] Full `npm run stress` exit 0
- [ ] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical drift remediation — minimal patches, no new abstractions.

### Key Components
- **`extract.ts`** — three changes: stop merging prior derived's `source_docs`/`key_files` into trigger/keyword buckets; exclude graph-metadata.json from provenance hash; deduplicate dependency list
- **`sync.ts`** — exclude `generated_at` from idempotency comparison; preserve existing derived block when content unchanged
- **2 catalog files** — count update (sa-036) and wording clarification (sa-037)
- **3 test files** — remove FIXMEs, tighten assertions

### Data Flow

```
syncDerivedMetadata(skillDir)
  → extractDerivedMetadata
       → buckets ← only fresh source content (no prior derived merge)
       → dependencies ← deduped, graph-metadata.json excluded
       → provenance fingerprint (stable across resyncs)
  → derived = SkillDerivedV2Schema.parse(...)
  → if stableDerivedJson(prior) === stableDerivedJson(new):
        return existing derived, changed=false, no write
     else:
        write to graph-metadata.json, changed=true
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (DONE)
- [x] Scaffold packet 045
- [x] Explore agent mapping

### Phase 2: Code & Doc Fixes (DONE)
- [x] sa-011 fix: `extract.ts` (3 surgical edits) + `sync.ts` (idempotency comparison)
- [x] sa-004 test cleanup
- [x] sa-036 catalog count (52 → 51)
- [x] sa-037 catalog wording + test FIXME removal
- [x] Update `lifecycle-derived-metadata.vitest.ts` for new bucket semantics

### Phase 3: Verification (DONE)
- [x] Targeted vitest run confirms idempotence
- [x] lifecycle-derived 16/16 pass
- [x] Full stress run after fixes — exit 0, 56/56 files

### Phase 4: Finalize
- [ ] Author spec/plan/tasks/checklist (this is `plan.md`)
- [ ] Fill implementation-summary.md
- [ ] generate-context.js
- [ ] validate.sh --strict
- [ ] commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `lifecycle-derived-metadata.vitest.ts` (16 tests) | Vitest |
| Stress | `auto-indexing-derived-sync-stress.vitest.ts` (4 tests) | Vitest |
| Full suite | `npm run stress` (56 files, 159 tests) | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp_server/skill_advisor/lib/derived/extract.ts` | Internal | Edited | Sync idempotence depends on this |
| `mcp_server/skill_advisor/lib/derived/sync.ts` | Internal | Edited | Same |
| Pre-existing unit test failures | External | Tracked | Documented as not introduced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stress regression after merge
- **Procedure**: `git revert <045-commit-hash>` — restores extract.ts/sync.ts to pre-fix state. The pre-fix code passed full stress (per packets 042-044), so revert is safe.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) → Phase 2 (Fixes) → Phase 3 (Verify) → Phase 4 (Finalize)
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| 1 Setup | 5 min |
| 2 Fixes | 20 min |
| 3 Verify | 10 min |
| 4 Finalize | 15 min |
| **Total** | **~50 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Targeted tests pass
- [x] Full stress suite green
- [x] Pre-existing failures documented as not-introduced

### Rollback Procedure
1. `git revert` of the 045 commit
2. `npm run stress` to confirm return to baseline
3. No data reversal needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
