---
title: "Implementation Summary: Advisor Phrase-Booster Tailoring"
description: "Migrated 24 tokenizer-broken multi-word INTENT_BOOSTERS entries to PHRASE_INTENT_BOOSTERS, added 15 new phrase routes, fixed hyphenated-token bug. Regression held at 1.0 top-1 and p0. Headline uplift: 5-dimension agent scoring now routes to sk-improve-agent at 0.95 instead of misrouting to sk-improve-prompt at 0.77."
trigger_phrases:
  - "advisor phrase booster implementation"
  - "INTENT PHRASE migration complete"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring"
    last_updated_at: "2026-04-15T12:14:00Z"
    last_updated_by: "memory-save-post-followup"
    recent_action: "Same-session follow-up completed — 12 hyphenated INTENT keys migrated (10 to PHRASE, 2 duplicate-removes). Cumulative: 36 INTENT deleted, 33 PHRASE added. Final invariant: zero multi-char keys in INTENT_BOOSTERS. Regression held at 1.0 top1/p0 across all 3 checkpoints (pre-Phase-2, post-Phase-2, post-follow-up)."
    next_safe_action: "Commit the 2-file Public-repo change set (skill_advisor.py + fixture JSONL). Optional follow-ups tracked as separate future specs: (a) Barter repo sync with equivalent migration pattern, (b) REQ-020 bench latency measurement if performance matters downstream."
    blockers: []
    key_files:
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/scratch/phrase-boost-delta.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "memory-save-013-2026-04-15T12-14"
      parent_session_id: "spec-kit-implement-013-2026-04-15"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q-A: per-key audit + preserve weights unless justified → applied"
      - "Q-B: sk-code-web/opencode/full-stack phrase entries added per iteration-003 candidates"
      - "Q-C: Barter-specific phrases NOT added to Public fixtures → out of scope, held"
      - "Q-D: MULTI_SKILL_BOOSTERS audited, zero multi-word keys found, no action needed"
      - "code audit schema violation → resolved by keeping sk-code-review (Option A)"
      - "Hyphenated INTENT keys (12) → migrated in same-session follow-up, no separate spec needed"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring` |
| **Completed** | 2026-04-15 |
| **Level** | 2 |
| **Primary Driver** | cli-copilot `gpt-5.4` (Phase 2 migration) |
| **Orchestrator** | Claude Code (Phase 1 baseline + Phase 3 verification + synthesis) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill advisor's multi-word phrase routing now actually works as designed. 24 tokenizer-broken entries that were silently sitting dead in `INTENT_BOOSTERS` — because the tokenizer `\b\w+\b` splits on whitespace before dict lookup — have been migrated to `PHRASE_INTENT_BOOSTERS` (which matches substrings against the raw prompt). The headline user-facing win: `"5-dimension agent scoring"` was misrouting to `sk-improve-prompt` at 0.77 confidence via a weak single-token match on "scoring" — after the fix it routes to the correct `sk-improve-agent` at 0.95.

### Migration mechanics

17 of the 24 keys were already duplicated in `PHRASE_INTENT_BOOSTERS` at higher weights — deleting the INTENT entries is pure dead-code cleanup. 6 keys had no backup and were migrated with their original weights, wrapped as `[(skill, weight)]` single-element lists. 1 key (`"code audit"`) was a schema violation (different skills in each dict) — the live PHRASE route to `sk-code-review` already handled the phrase correctly, so the INTENT entry was simply deleted as dead conflict.

### Additional coverage

15 new `PHRASE_INTENT_BOOSTERS` entries close under-covered Public identifiers across six skills: `system-spec-kit`, `sk-code-opencode`, `sk-code-full-stack`, `sk-code-web`, `mcp-code-mode`, `sk-code-review`. 2 hyphenated-token entries (`"5-dimension"`, `"5-dimension agent scoring"`) fix the late-iteration blind spot where hyphens split the same way whitespace does. An inline comment block near the PHRASE_INTENT_BOOSTERS definition warns future contributors never to add whitespace- or hyphen-containing keys to INTENT_BOOSTERS.

### Regression coverage

8 new P1 fixture cases (`P1-PHRASE-NNN`) grew the suite from 44 to 52 cases, closing the `code audit` coverage gap and covering newly-routed phrases. The existing harness passes at 1.0 top-1 accuracy and 1.0 P0 pass rate — same as baseline.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Modified | Delete 24 INTENT entries + add 23 PHRASE entries + inline comment block |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modified (append) | +8 P1 fixture cases (44 → 52 total) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three phases, split between orchestrator and delegate. Phase 1 I captured baseline regression + 5 representative query confidences (fast, no copilot call). Phase 2 I dispatched cli-copilot gpt-5.4 with a fully-specified prompt pointing at the 5-iteration research package — it executed the 11-step migration script + 15 additions + hyphenated fix + inline comment + 8 fixture appends in one autonomous invocation (7m 3s, 1 premium request, ~2M tokens). Phase 3 I verified: grep confirmed 0 multi-word keys left in INTENT scope, Python AST parsed clean, regression harness returned `overall_pass: true` with all gates green, and the 5 REQ-010 queries all hit ≥0.90 with the `5-dimension` query showing the expected +0.18 uplift and correct-skill correction.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split Phase 2 to cli-copilot gpt-5.4 instead of Claude executing directly | User explicitly requested gpt-5.4 (high) for the 5-iteration research and Phase 2 implementation. Research was thorough enough that one autonomous copilot call completed the migration without back-and-forth. |
| Keep `code audit` routed to `sk-code-review` (Option A) | PHRASE path fires before INTENT at runtime, so sk-code-review was already the live answer. The INTENT entry pointing to sk-deep-review was silent dead conflict. Zero user-visible routing change. |
| Defer REQ-020 bench latency measurement | Change is pure data (dict additions + deletions), no scoring logic touched. p95 impact unlikely to exceed 5%. Re-measure only on user report of slowdown. |
| Leave 12 hyphenated INTENT_BOOSTERS entries for a follow-up spec | Spec 013's REQ-001 strictly targeted whitespace-separated keys. Hyphenated entries (`"proposal-only"`, `"openai-cli"`, `"claude-code"`, etc.) are the same bug but weren't in the migration set. Low-risk, same pattern — worth a scoped follow-up rather than expanding scope mid-flight. |
| Not sync Barter repo from this spec | Spec 013 is Public-canonical. Barter has its own independently-drifted advisor with Barter-specific boosters added earlier this session. Barter sync needs a separate pass that also considers the ~30 multi-word keys I added there earlier in the session. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 — Zero multi-word INTENT keys (whitespace strict) | PASS — `sed -n '496,726p' \| grep -cE '^\s*"[^"]+\s+[^"]+":'` returns **0** |
| REQ-002 — Per-key disposition documented | PASS — `scratch/phrase-boost-delta.md` has full table |
| REQ-003 — Regression harness exit 0 with `--min-top1-accuracy 0.92` | PASS — `scratch/post-regression.json` → `overall_pass: true`, exit 0 |
| REQ-004 — P0 pass rate ≥ baseline | PASS — 1.0 → 1.0 (no regression) |
| REQ-005 — Python AST parses | PASS — exit 0 |
| REQ-010 — 5 REQ-010 queries meet targets | PASS — all 5 at 0.95; `5-dimension agent scoring` uplift 0.77→0.95 + correct-skill correction |
| REQ-011 — 5+ new PHRASE entries for under-covered identifiers | PASS — 15 new entries from iteration-003 + 2 hyphenated adds |
| REQ-012 — 8 new P1 fixture cases | PASS — fixture went 44 → 52 |
| REQ-013 — Delta report exists with all sections | PASS — `scratch/phrase-boost-delta.md` |
| REQ-020 (P2) — Bench p95 latency | DEFERRED — data-only change, not re-measured |
| REQ-021 (P2) — Inline comment block added | PASS — new comment near PHRASE_INTENT_BOOSTERS warns about whitespace + hyphen keys |
| Regression fixture pass rate | PASS — 52/52 (100%) |
| Overall regression | PASS — `overall_pass: true`, all gates green |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Follow-Up: Hyphenated INTENT Keys (same-session extension)

After the main migration completed, a follow-up pass addressed the 12 hyphenated INTENT keys that were the same tokenizer bug in a different form (regex `\b\w+\b` splits on hyphens as well as whitespace). Executed directly by Claude Code since the pattern was now established.

### Result

- **12 hyphenated INTENT entries deleted** (`proposal-only`, `evaluator-first`, `5-dimension`, `openai-cli`, `claude-code`, `claude-cli`, `extended-thinking`, `copilot-cli`, `cloud-delegation`, `clickup-cli`, `task-management`, `tidd-ec`)
- **10 new PHRASE entries added** (2 of the 12 were already duplicated in PHRASE and needed no new add)
- Regression: **52/52 passing, top1=1.0, p0=1.0, overall_pass: true** (no regression)
- `proposal-only candidate evaluation` recovered from NONE → `sk-improve-agent 0.78`
- All 5 REQ-010 queries held at 0.95
- **Final invariant**: `INTENT_BOOSTERS` now contains ONLY single-token keys. Zero whitespace, zero hyphens. The tokenizer and the dict are finally aligned.

### Cumulative spec 013 totals

| Metric | Value |
|--------|-------|
| INTENT entries deleted | **36** (24 whitespace + 12 hyphenated) |
| PHRASE entries added | **33** (6 migrations + 15 new + 2 hyphenated fix + 10 follow-up) |
| Fixture cases added | **8** (44 → 52) |
| Inline comment block | Added (warns about whitespace AND hyphen keys) |
| Python AST parse | PASS |
| Regression overall_pass | true at all stages |

---

## Known Limitations

1. **Barter repo advisor is out of sync.** This spec is Public-canonical. Barter's advisor has independent drift including ~30 multi-word keys I added earlier in the same session. Barter sync requires its own pass with the same migration pattern applied.
2. **REQ-020 bench latency not re-measured.** Data-only change, low p95 risk, but not proven with hard numbers. If performance matters for a downstream consumer, run `skill_advisor_bench.py` before and after.
3. **Only two Public files changed.** If downstream consumers of `INTENT_BOOSTERS` exist beyond the scoring loop (iteration 4 found none), they may need updates. Confirmed clean: single scoring loop at `skill_advisor.py:1628-1690` consumes both dicts; no other callsites.
<!-- /ANCHOR:limitations -->

---

<!--
Level 2 implementation summary — orchestrator delegated Phase 2 migration to cli-copilot gpt-5.4.
All evidence in scratch/phrase-boost-delta.md + scratch/baseline-*.{json,md} + scratch/post-regression.json.
Research package (5 iterations) at research/iterations/ + research/research.md.
-->
