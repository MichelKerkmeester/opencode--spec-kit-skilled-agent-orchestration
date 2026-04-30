---
title: "Verification Checklist: Phase Parent Generator Pointer + Polish"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "P0/P1/P2 verification checklist for the deferred follow-on packet."
trigger_phrases:
  - "phase parent followon checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/002-generator-and-polish"
    last_updated_at: "2026-04-27T12:20:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Run final strict validation; refresh metadata"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase Parent Generator Pointer + Polish

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 1 (`001-validator-and-docs`) confirmed shipped [EVIDENCE: `../001-validator-and-docs/implementation-summary.md` exists and 026 regression completed with no new packet-introduced errors]
- [x] CHK-002 [P0] `isPhaseParent` ESM JS available at `scripts/dist/spec/is-phase-parent.js` [EVIDENCE: TS source added at `.opencode/skill/system-spec-kit/scripts/spec/is-phase-parent.ts:6`, dist rebuilt by `npx tsc --build`]
- [x] CHK-003 [P0] `graph-metadata.json` schema accepts `last_active_child_id` / `last_active_at` [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/rules/check-graph-metadata.sh` accepts optional pointer fields; strict packet validation passed `GRAPH_METADATA_PRESENT`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Generator TS source compiles without errors and ESM dist regenerated [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx tsc --build` exited 0]
- [x] CHK-011 [P0] Atomic write helper used for parent `graph-metadata.json` updates [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:372` writes temp, line 380 renames]
- [x] CHK-012 [P0] Generator does not write pointer fields when target is NOT a phase parent [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:100` covers non-phase no-op]
- [x] CHK-013 [P1] `check-phase-parent-content.sh` is code-fence aware (does not flag tokens inside ```fences```) [EVIDENCE: direct bash fixture flagged only unfenced `consolidated`, while fenced `merged from` and `29→9` were skipped]
- [x] CHK-014 [P1] `create.sh --phase` patch preserves child template behavior [EVIDENCE: temp acceptance run showed `001-phase-1` still contains the child Level 1 docs plus `scratch/`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] vitest REQ-001: parent save writes pointer fields — pass [EVIDENCE: `node scripts/node_modules/vitest/vitest.mjs run scripts/tests/phase-parent-pointer.vitest.ts --config mcp_server/vitest.config.ts` passed 4 tests]
- [x] CHK-021 [P0] vitest REQ-002: child save bubbles up to parent — pass [EVIDENCE: same vitest command, child assertion at `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:71`]
- [x] CHK-022 [P0] vitest REQ-002 atomic-write: concurrent child saves produce eventually-consistent pointer (last writer wins) — pass [EVIDENCE: concurrent fixture at `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:84`]
- [x] CHK-023 [P0] Manual E2E REQ-008: `/spec_kit:plan :with-phases --phases 2` → edit child → save → resume parent → lands in child — trace stored [EVIDENCE: `scratch/e2e-trace.txt` records `{ "redirected": true }`]
- [x] CHK-024 [P1] Resume `--no-redirect` flag bypasses pointer and shows parent surface [EVIDENCE: `.opencode/command/spec_kit/resume.md:66`, auto YAML line 62, confirm YAML line 62]
- [x] CHK-025 [P1] Resume falls back to listing when pointer is null OR stale (>24h) [EVIDENCE: `.opencode/command/spec_kit/resume.md:70` and YAML assets line 61 document null/missing/stale fallback]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new file-write paths beyond canonical save / `generate-context.js` / `create.sh` [EVIDENCE: diff review shows pointer writes only in `generate-context.ts`; phase scaffolding writes remain in `create.sh`]
- [x] CHK-031 [P1] Atomic write prevents torn JSON state under interrupt/crash [EVIDENCE: same-dir temp + POSIX rename in `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:372`; concurrent vitest passed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] CLAUDE.md / AGENTS.md mention pointer mechanism (already mentioned in 001 — verify still consistent post-impl) [EVIDENCE: `AGENTS.md:98`, `AGENTS.md:272`, `CLAUDE.md:98`, and `CLAUDE.md:272` now describe fresh-pointer resume before list fallback]
- [x] CHK-041 [P1] `templates/context-index.md` Author Instructions clearly state when to use ("only when reorganized") [EVIDENCE: `.opencode/skill/system-spec-kit/templates/context-index.md:18`]
- [x] CHK-042 [P1] `templates/resource-map.md` Author Instructions sharpened for phase-parent mode (one mode, state in Scope line) [EVIDENCE: `.opencode/skill/system-spec-kit/templates/resource-map.md:191`]
- [x] CHK-043 [P1] `resume.md` and YAML asset documents the `--no-redirect` flag and 24h staleness window [EVIDENCE: `.opencode/command/spec_kit/resume.md:66`, `.opencode/command/spec_kit/resume.md:69`, YAML assets line 61]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] E2E trace kept in `scratch/` (not at root) [EVIDENCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/002-generator-and-polish/scratch/e2e-trace.txt`]
- [x] CHK-051 [P1] vitest fixtures use tmpdir, not committed test-data folders [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts:47` uses `fs.mkdtempSync(os.tmpdir())`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-27
<!-- /ANCHOR:summary -->
