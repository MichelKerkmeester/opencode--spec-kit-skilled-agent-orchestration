---
title: "Implementation Summary: Drift Finding Fixes"
description: "Fixed 1 real product bug (sa-011 non-idempotent derived sync) plus 3 catalog/test alignments (sa-004, sa-036, sa-037); 56/56 files and 159/159 tests still passing."
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
trigger_phrases:
  - "045-drift-finding-fixes summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/045-drift-finding-fixes"
    last_updated_at: "2026-05-01T05:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored final docs"
    next_safe_action: "Validate and commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "logs/stress-run-20260501-053944Z.log"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "045-summary-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Was sa-011 a real bug? Yes — the fix makes syncDerivedMetadata idempotent."
      - "Were sa-004, sa-036, sa-037 product bugs? No — they were a misread (sa-004), catalog drift (sa-036), and wording ambiguity (sa-037)."
---

# Implementation Summary: Drift Finding Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-drift-finding-fixes |
| **Completed** | 2026-05-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet resolves the 4 `FIXME(sa-*)` markers left in stress tests by packets 042-044. **One was a real product bug** (sa-011 — derived metadata sync was non-idempotent); the other three were a test misread (sa-004), a catalog count drift (sa-036), and a wording ambiguity (sa-037). All four are now closed; the full stress suite still passes 56/56 files and 159/159 tests.

### sa-011: Real Bug Fix — Idempotent Derived Sync

`syncDerivedMetadata(skillDir)` now returns `changed=false` on a second call against an unchanged SKILL.md. Before this fix, the second call always reported `changed=true` for two compounding reasons: (1) prior derived metadata's `source_docs` and `key_files` were merged into the trigger/keyword candidate buckets, generating new path-derived ngrams on every resync; (2) `graph-metadata.json`'s hash was included as a provenance dependency, so writing the derived block back into the file changed the hash, making the next sync see "different dependencies." Both root causes are now fixed:

- `extract.ts` no longer merges prior derived state into the bucket pipeline (the prior values still propagate into the final `sourceDocs` / `keyFiles` arrays, preserving stickiness)
- `extract.ts` excludes `graph-metadata.json` from provenance dependencies and deduplicates the dependency list via a Map
- `sync.ts` excludes `generated_at` from the idempotency comparison and preserves the existing derived block when content is stable, so on-disk bytes remain stable across resyncs

### sa-004: Test Cleanup (No Product Change)

The FIXME on `generation-snapshot-stress.vitest.ts` line 63 claimed the catalog expected `unavailable` trust state for corrupted counters. Re-reading catalog `01--daemon-and-freshness/04-generation.md` §2 shows it actually says: *"Corrupted counters are recovered when recoverable and reported as `unavailable` freshness when not."* — both behaviors are valid. The test is now anchored to the catalog quote, asserts the `recovered` path explicitly (since the test environment is writable), and the FIXME is gone.

### sa-036: Catalog Count Correction

Catalog `08--python-compat/02-regression-suite.md` claimed "52/52" cases passing. The fixture JSONL at `scripts/fixtures/skill_advisor_regression_cases.jsonl` actually has 51 lines. Catalog updated to 51/51 (title, description, trigger phrase, current-reality prose).

### sa-037: Catalog Wording

Catalog `08--python-compat/03-bench-runner.md` documented `cache-hit p95 ≤ 50 ms` and `uncached p95 ≤ 60 ms` ambiguously — they read like CI gates but are actually design ceilings on a stable workstation. Updated to clarify they are "design ceilings rather than enforceable CI gates" and added a sentence about the test wrapper's actual contract. Test FIXME removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/skill_advisor/lib/derived/extract.ts` | Modified | sa-011 fix: 3 surgical edits to bucket merge, dependency dedup, graph-metadata exclusion |
| `mcp_server/skill_advisor/lib/derived/sync.ts` | Modified | sa-011 fix: stableDerivedJson + preserve-existing-on-stable branch |
| `mcp_server/skill_advisor/feature_catalog/08--python-compat/02-regression-suite.md` | Modified | sa-036: 52 → 51 |
| `mcp_server/skill_advisor/feature_catalog/08--python-compat/03-bench-runner.md` | Modified | sa-037: design envelope wording |
| `mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` | Modified | Updated unit test for new bucket semantics; 16/16 still pass |
| `mcp_server/stress_test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts` | Modified | sa-011 FIXME removed; tightened to assert `changed=false` on second pass |
| `mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts` | Modified | sa-004 FIXME removed; assertion anchored to catalog quote |
| `mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` | Modified | sa-037 FIXME replaced with catalog-pointer comment |
| `045-drift-finding-fixes/{spec,plan,tasks,checklist,implementation-summary}.md` | Created | Packet docs |
| `045-drift-finding-fixes/{description,graph-metadata}.json` | Generated | Lean-trio metadata |
| `045-drift-finding-fixes/logs/stress-run-*.log` | Created | Full `npm run stress` capture |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The Explore agent first mapped each finding to file:line locations and proposed a minimal fix direction. For sa-011 the agent's hypothesis (graph-metadata.json self-hashing) was partly right but missed the bucket-merge cycle; a targeted vitest debug script identified the full root cause. The product code fix landed in two source files (`extract.ts`, `sync.ts`) with 3 + 1 surgical edits; the rest were doc/test edits.

After all 4 findings were resolved, the full stress suite was re-run (56 files / 159 tests / 47s / exit 0) and the lifecycle unit test was confirmed at 16/16. Five other unit tests fail on clean main (manual-testing-playbook content drift, advisor-corpus-parity file-content drift, advisor-graph-health workspace-state-dependent counts, plugin-bridge degraded health) — these were reproduced via `git stash` of this packet's changes and confirmed pre-existing, unrelated to drift findings.

### Verification Trajectory

| Check | Before fix | After fix |
|-------|------------|-----------|
| sa-011 idempotence on second sync | `changed=true` (bug) | `changed=false` |
| Lifecycle-derived unit tests | 14/16 pass | 16/16 pass |
| Full stress suite | 56/56 / 159/159 | 56/56 / 159/159 |
| FIXME markers in stress tests | 3 | 0 |
| Catalog/fixture count match (sa-036) | mismatch | match |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat sa-004 as a test correction, not a product bug | Catalog text explicitly accommodates current behavior; the FIXME was a misread |
| Apply two surgical edits to fix sa-011 (bucket merge + dependency dedup) instead of refactoring | Smaller blast radius; preserves all existing behavior except the cycle |
| Preserve existing derived block on stable content rather than always rewrite | Keeps on-disk bytes stable across resyncs; avoids unnecessary fsync churn |
| Update catalog wording for sa-037 instead of tightening the test | Test threshold values vary with sandbox load; design ceilings belong in docs, not assertions |
| Document pre-existing unit failures as not-introduced | Avoid attribution confusion in PR review; reproduced on `git stash` |
| Did NOT modify generation.ts (sa-004) | Code matches catalog; only the test description was wrong |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| sa-011 stress test asserts second-call `changed=false` | PASS — `auto-indexing-derived-sync-stress` 4/4 |
| `lifecycle-derived-metadata.vitest.ts` post-fix | PASS — 16/16 |
| Full `npm run stress` | PASS — 56 files, 159 tests, exit 0, 47s |
| sa-036 catalog count = fixture lines | PASS — 51/51 in both |
| FIXME(sa-*) markers in stress tests | 0 remaining (sa-004, sa-011, sa-037 all cleaned) |
| `validate.sh --strict` for packet 045 | PENDING — final pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-existing unit test failures are NOT addressed by this packet.** 5 tests fail on clean main: manual-testing-playbook scenarios drift, advisor-corpus-parity file-content drift, advisor-graph-health workspace-state-dependent counts (2 failures), plugin-bridge degraded health. They are tracked separately and unrelated to drift findings. Reproduced via `git stash` of this packet's changes.

2. **The sa-011 fix changes derived metadata extraction semantics for callers seeded with prior derived state.** Specifically, prior `source_docs` and `key_files` no longer flow into trigger/keyword buckets — they're still preserved in the OUTPUT `sourceDocs`/`keyFiles` arrays, but no longer contribute path-ngrams to the trigger/keyword pool. This is the correct behavior; the prior path-ngrams were noise, not signal.

3. **No new tests added.** Existing tests were tightened or recoded; this packet does not expand the regression surface beyond what 042/043/044 already established.

4. **The bench script's actual p95 measurements (6.989ms, 11.45ms) are no longer treated as enforceable.** The catalog now describes the 50/60ms numbers as design ceilings; tightened CI gating belongs in a stable benchmark environment, not the stress suite.
<!-- /ANCHOR:limitations -->

---
