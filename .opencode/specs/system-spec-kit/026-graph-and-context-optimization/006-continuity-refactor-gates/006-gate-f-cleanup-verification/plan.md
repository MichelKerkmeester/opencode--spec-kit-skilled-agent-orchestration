---
title: "Gate F — Cleanup Verification Plan"
description: "Execute a narrow verification pass for Gate B cleanup, confirm archived-tier deprecation work is already complete, and close the packet with evidence."
trigger_phrases: ["gate f plan", "cleanup verification plan", "gate b cleanup verification", "archived-tier deprecation audit"]
importance_tier: "important"
contextType: "verification"
status: complete
closed_by_commit: TBD
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/006-gate-f-cleanup-verification"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Replaced observation plan with cleanup verification phases"
    next_safe_action: "Reuse the recorded evidence if follow-up packet opens"
    key_files: ["plan.md", "implementation-summary.md"]
---
# Implementation Plan: Gate F — Cleanup Verification
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | Markdown, SQLite, shell verification, TypeScript code verification |
| Framework | system-spec-kit phase packet closeout |
| Storage | `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` |
| Testing | SQL queries, filesystem sweeps, `rg` verification, `validate.sh --strict` |

### Overview

Gate F is a cleanup-verification phase. The execution model is simple: verify the live DB and filesystem state first, run a minimal cleanup transaction only if stale Gate B residue remains, confirm the archived-tier runtime code has already been removed or deprecated as intended, then rewrite the packet docs so the phase tells the truth about what happened.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gates A-E are recorded as closed in the parent handover.
- [x] Gate B cleanup is recorded as committed work in the parent handover.
- [x] The live DB path and packet ownership boundaries are known before edits start.

### Definition of Done

- [x] `memory_index` has `0` `file_path LIKE '%/memory/%.md'` rows after cleanup.
- [x] `causal_edges` has `0` orphan rows.
- [x] `.opencode/specs` has `0` `**/memory/*.md` files.
- [x] Archived-tier runtime cleanup is verified or explicitly flagged as out-of-scope follow-up.
- [x] All five packet docs match the cleanup-only Gate F scope and pass `validate.sh --strict`.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-first verification with minimal corrective cleanup.

### Key Components

- DB verification using direct SQL checks against `memory_index` and `causal_edges`
- filesystem verification using `find` sweeps for `**/memory/*.md` artifacts and empty `memory/` directories
- deprecated-code audit using exact-match checks in `stage2-fusion.ts`, `memory-crud-stats.ts`, and `vector-index-schema.ts`
- packet alignment using doc rewrites that preserve validator anchors and continuity frontmatter

### Data Flow

Entry-gate facts from the parent handover establish that Gate B cleanup should already be complete. Live SQL and filesystem checks confirm or disprove that expectation. If stale rows remain, a minimal SQLite transaction deletes dependent edges first and stale `*/memory/*.md` rows second. The post-cleanup state becomes the evidence source for packet closeout.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: DB and File Verification

- [x] Query `memory_index` for stale `*/memory/*.md` rows.
- [x] Query `memory_index` for `is_archived = 1` to confirm the preserved baseline row count.
- [x] Query `causal_edges` for orphan references.
- [x] Sweep `.opencode/specs` for `**/memory/*.md` files and empty `memory/` directories.
- [x] Run the minimal cleanup transaction because stale rows were still present.

### Phase 2: Deprecated-Code Verification

- [x] Confirm `stage2-fusion.ts` no longer applies an archived-tier penalty.
- [x] Confirm `memory-crud-stats.ts` no longer exposes `archived_hit_rate`.
- [x] Confirm `vector-index-schema.ts` keeps `is_archived` only as a deprecated column comment.
- [x] Collect broader out-of-scope wording drift as TODOs instead of editing unrelated files.

### Phase 3: Packet Alignment and Evidence

- [x] Rewrite `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the cleanup-only model.
- [x] Add validator-friendly `_memory.continuity` blocks plus `status: complete` and `closed_by_commit: TBD` frontmatter to all five files.
- [x] Record the exact SQL, cleanup transaction, post-cleanup counts, preserved baseline row, and code audit evidence.

### Phase 4: Exit Gate

- [x] Run `validate.sh --strict` for this packet.
- [x] Confirm packet docs, evidence, and truthfulness are aligned.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Database verification | stale memory rows, archived row count, orphan edges | `sqlite3` |
| Filesystem verification | `**/memory/*.md` files and empty dirs | `find`, `wc -l` |
| Code verification | archived-tier runtime remnants | `rg`, targeted file reads |
| Packet validation | markdown structure and continuity frontmatter | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent handover | Internal | Green | Establishes that Gates A-E and Gate B cleanup are already closed |
| Parent implementation design | Internal | Green | Confirms the packet sits inside phase 018 but still contains stale Gate F design assumptions |
| `context-index.sqlite` | Runtime data | Green | Live cleanup verification depends on the actual DB state |
| Existing runtime files | Code evidence | Green | Needed to prove archived-tier cleanup is already complete |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: The cleanup transaction removes anything beyond stale `*/memory/*.md` rows or leaves orphan edges behind.
- Procedure: Stop immediately, inspect the DB diff, and restore from the local backup before re-running a narrower cleanup.
- Irreversibility boundary: This packet does not authorize any deletion outside stale `*/memory/*.md` rows and dependent `causal_edges`.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (verify live state) -> Phase 2 (verify code cleanup) -> Phase 3 (rewrite packet) -> Phase 4 (validate exit)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Parent gate closure facts | All later phases |
| Phase 2 | Phase 1 post-cleanup truth | Packet closeout evidence |
| Phase 3 | Phase 1 and 2 evidence | Exit validation |
| Phase 4 | Final packet rewrite | Phase completion |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 | Low | <1 hour |
| Phase 2 | Low | <1 hour |
| Phase 3 | Medium | 1-2 hours |
| Phase 4 | Low | <30 minutes |
| Total | | Same-turn closeout |
<!-- /ANCHOR:effort -->
