---
title: "...ch-routing-advisor/003-advisor-phrase-booster-tailoring/research/013-advisor-phrase-booster-tailoring-pt-01/research]"
description: "Canonical synthesis of 5-iteration deep-research loop (cli-copilot gpt-5.4) on migrating 24 tokenizer-broken multi-word INTENT_BOOSTERS entries to PHRASE_INTENT_BOOSTERS. Converged newInfoRatio 0.90 → 0.08; migration is regression-safe and implementation-ready."
trigger_phrases:
  - "routing"
  - "advisor"
  - "003"
  - "phrase"
  - "research"
  - "013"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/003-advisor-phrase-booster-tailoring/research/013-advisor-phrase-booster-tailoring-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Research: Advisor Phrase-Booster Tailoring

Canonical synthesis of the 5-iteration deep-research loop. Driver: cli-copilot `gpt-5.4` (user-selected override of default `@deep-research` agent). Topic: migrate tokenizer-broken multi-word `INTENT_BOOSTERS` entries in `skill_advisor.py` to `PHRASE_INTENT_BOOSTERS`, add phrase routes for under-covered identifiers, preserve regression top-1 ≥ 0.92 with zero P0 regressions.

---

## 1. Convergence

| Iteration | Focus | Duration | newInfoRatio |
|-----------|-------|----------|--------------|
| 1 | INTENT_BOOSTERS inventory + disposition | 264s | 0.90 |
| 2 | Regression fixture dependency map + baseline | 635s | 0.75 |
| 3 | Under-covered multi-word identifiers + candidates | 409s | 0.60 |
| 4 | Migration design + edge cases + schema resolution | 405s | 0.40 |
| 5 | Regression coverage + risk + acceptance evidence | 743s | 0.15 (self-reported 0.08) |

Total: ~41 min wall-time, 5 premium gpt-5.4 requests, ~9.6M tokens up / ~127K down / ~8.9M cached. Convergence declared at iteration 5 — open questions zero, readyForSynthesis: yes.

---

## 2. Core Findings

### 2.1 Inventory (iteration 1)

**24** whitespace-containing keys in `INTENT_BOOSTERS` (lines 537-561 + 742-744); **zero** multi-word keys in `MULTI_SKILL_BOOSTERS`. Every multi-word INTENT key is dead code — the tokenizer (`re.findall(r'\b\w+\b', prompt_lower)` at `skill_advisor.py:1634`) splits on whitespace before dict lookup, so no multi-word key can ever match.

Dispositions:

| Disposition | Count | Meaning |
|-------------|-------|---------|
| `migrate-with-phrase-weight-kept` | 17 | Same key already in PHRASE with higher weight → delete INTENT entry, keep PHRASE as-is |
| `migrate-with-same-weight` | 6 | Not in PHRASE → move to PHRASE with identical weight, wrap as `[(skill, weight)]` |
| `duplicate-remove` | 0 | — |
| `schema-violation` | 1 | `code audit` — different target skills in each dict |

### 2.2 Schema-violation resolution (iteration 4)

`code audit` points to `sk-deep-review` in INTENT_BOOSTERS (weight 1.0) but `sk-code-review` in PHRASE_INTENT_BOOSTERS (weight 2.2). Resolution: **keep `sk-code-review`** (Option A) because:

- `sk-code-review` is the findings-first review baseline; its description + graph-metadata explicitly list `audit` as an activation trigger.
- `sk-deep-review` is the autonomous iterative-loop review skill; it explicitly says NOT to use for single-pass reviews.
- The runtime already routes `code audit` to `sk-code-review` — the PHRASE path fires first; the INTENT entry is pure dead conflict.

**Phase 2 action**: delete the dead `INTENT_BOOSTERS["code audit"] = ("sk-deep-review", 1.0)` line; PHRASE entry unchanged. Zero user-visible routing change.

### 2.3 Regression safety (iteration 2)

Pre-migration baseline (measured via `skill_advisor_regression.py --threshold 0.8 --uncertainty 0.35 --min-top1-accuracy 0.92`):

- **44/44 fixtures pass** (100% top-1 accuracy)
- **p0_pass_rate = 1.0**
- Only **1/44 case** (`P1-REVIEW-003`) references any migrating key; it already hits matching same-skill PHRASE entries at equal-or-higher weight → **low risk**

The migration is regression-safe. The real exposure is **coverage**, not correctness: 0/44 fixtures currently cover the `code audit` phrase route despite it being a live PHRASE entry.

### 2.4 New PHRASE candidates (iteration 3)

Current PHRASE_INTENT_BOOSTERS: **167** entries. Post-migration: **173**. Proposed additions: **15** phrases across six skills (system-spec-kit, sk-code-opencode, sk-code-full-stack, sk-code-web, mcp-code-mode, sk-code-review). Post full-adoption target: **188** entries.

Selection criteria: ≥3-word phrases (short phrases risk false-positives), distinct enough to uniquely route, sourced from each skill's `graph-metadata.json` trigger_phrases + SKILL.md Keywords.

### 2.5 Hyphenated-token blind spot (iteration 5)

Late finding: the same tokenizer behavior that breaks whitespace-separated keys ALSO splits on hyphens for words like `5-dimension`. INTENT entries such as `"5-dimension"` and `"5d scoring"` have the same issue as whitespace keys and need PHRASE coverage. Iteration 5 adds these to the Phase 2 script.

### 2.6 Hidden callsites (iteration 4)

Single scoring loop consumes both dicts (`skill_advisor.py:1628-1690`). **No other code path** performs direct `INTENT_BOOSTERS[key]` lookups that would break after deletion. Safe to mutate.

---

## 3. Migration Plan (iteration 4 — 11-step edit script)

Phase 2 executes these edits in `skill_advisor.py`:

1. Delete the 23 migrating entries from `INTENT_BOOSTERS` (lines ~537-561 + ~742-744)
2. Delete the `code audit` schema-violation line (no migration, pure dead-code removal)
3. For the 6 `migrate-with-same-weight` keys: add PHRASE entries as `"phrase": [(skill, original_weight)]`
4. For the 17 `migrate-with-phrase-weight-kept` keys: no PHRASE change (higher weight already present)
5. Add the 15 new PHRASE candidates from iteration 3
6. Add PHRASE coverage for `5-dimension` and `5-dimension agent scoring` (hyphenated-token fix from iteration 5)
7. Add the inline comment block near PHRASE_INTENT_BOOSTERS:
   - INTENT_BOOSTERS = single-word tokens only (post-tokenization)
   - PHRASE_INTENT_BOOSTERS = multi-word phrases (pre-tokenization substring match)
   - NEVER add multi-word or hyphenated keys to INTENT_BOOSTERS — they are no-op dead code
8-11. Verification steps: grep for residual multi-word INTENT keys (must be 0), AST parse, run regression harness, spot-check REQ-010 queries

**Weight preservation rule**: single-skill `(skill, weight)` in INTENT becomes `[(skill, weight)]` in PHRASE (single-element list — the existing PHRASE schema). No weight math; verbatim preservation.

---

## 4. Regression Coverage Gain (iteration 5)

### 8 new P1 fixture cases (schema-compliant)

Fixture count: **44 → 52**. All cases use `priority: "P1"`, `id: "P1-PHRASE-NNN"`, `expect_kind: "skill"`, `allow_command_bridge: false`. Targets:

- Close the `code audit` coverage gap (currently 0/44 fixtures contain this literal)
- Cover each newly-routed phrase from iterations 3 and 5
- Add a case specifically for hyphenated `5-dimension agent scoring` → `sk-improve-agent`

### REQ-010 confidence targets (5 representative queries)

| Query | Pre-migration | Post-migration target |
|-------|---------------|-----------------------|
| "save this conversation context to memory" | boosted via existing `save this conversation context` PHRASE (1.0) | `system-spec-kit ≥ 0.90` |
| "deep research loop convergence" | boosted via `deep research` + `research loop` PHRASE (2.5 + 2.5) | `sk-deep-research = 0.95` |
| "code review merge readiness" | boosted via `merge readiness` + `ready to merge` PHRASE | `sk-code-review = 0.95` |
| "5-dimension agent scoring" | **not currently matched** (hyphenated INTENT key, tokenizer-broken) | `sk-improve-agent ≥ 0.90` after new PHRASE add |
| "responsive css layout fix" | boosted via `responsive css layout fix` PHRASE (2.2) | `sk-code-web = 0.95` |

Formula check: `confidence = min(0.50 + score * 0.15, 0.95)` with intent boost. To reach 0.95 the score must be ≥ 3.0; migrating an existing PHRASE weight of 2.5 alongside a strong token match satisfies this.

---

## 5. Rollback Triggers

Halt Phase 2 and revert if any of the following occur:

- Any P0 fixture case regresses (REQ-004 hard gate)
- `top1_accuracy < 0.92` post-change (REQ-003 hard gate)
- Any of the 8 new P1 cases (introduced by this spec) fail their `expected_top_any`
- `skill_graph_compiler` `hub_skills` output changes unexpectedly (indicator of family-affinity drift)

Rollback: `git checkout HEAD -- skill_advisor.py scripts/fixtures/skill_advisor_regression_cases.jsonl`, re-run regression, confirm baseline restored.

---

## 6. Risks Beyond spec.md §6

Iterations 1-5 did not uncover unmitigated risks beyond those in spec.md. Confirmed safe:

- **Graph-boost interaction**: `_apply_graph_boosts` consumes `skill_boosts` dict (not directly `INTENT_BOOSTERS`); migration is transparent to graph layer
- **Explicit-name boost stacking**: variant-match boost (2.5-2.8) runs after both INTENT and PHRASE passes; unaffected by migration
- **Family affinity**: `sk-code` family unchanged; `code audit` resolution keeps the routing target inside the `sk-code` family

No new open questions. No new risks.

---

## 7. Acceptance Evidence Map (REQ-001 — REQ-021)

Phase 3 verification must produce this evidence per spec.md requirement:

| Requirement | Evidence |
|-------------|----------|
| **REQ-001** | `sed -n '496,788p' skill_advisor.py \| grep -cE '^\s*"[^"]+\s+[^"]+":'` returns **0** |
| **REQ-002** | `scratch/phrase-boost-delta.md` has one row per removed key with disposition + rationale; `code audit` row says `keep sk-code-review PHRASE, delete dead INTENT conflict` |
| **REQ-003** | `skill_advisor_regression.py --min-top1-accuracy 0.92` exits **0**; save to `scratch/post-regression.json` |
| **REQ-004** | Pre/post `p0_pass_rate` ≥ baseline (iteration 2: 1.0) |
| **REQ-005** | `python3 -c "import ast; ast.parse(open('skill_advisor.py').read())"` exits **0** |
| **REQ-010** | Before/after confidence table for 5 REQ-010 queries; all post-values meet § 4 targets |
| **REQ-011** | `rg` on 5+ new PHRASE entries in the advisor file; substitution table in delta report if shipping phrases differ from spec wording |
| **REQ-012** | `wc -l` of fixture file changes **44 → 52**; `tail -n 8` confirms new IDs |
| **REQ-013** | `scratch/phrase-boost-delta.md` exists with disposition + baseline + post + new-fixtures sections |
| **REQ-020** | Bench p95 latency post ≤ baseline × 1.05 |
| **REQ-021** | `rg` on the new inline comment block near PHRASE_INTENT_BOOSTERS (anti-pattern warning) |

REQ-006 through REQ-009 and REQ-014 through REQ-019 are reserved / not present in current spec.md.

---

## 8. Delivery Package Summary

Phase 2 executes iteration 4's 11-step migration script (tuple → list rewrap of 6 moves, deletion of 17 dead duplicates, 1 schema-violation cleanup) plus iteration 5's amendment for hyphenated `5-dimension` / `5-dimension agent scoring`. Fifteen new PHRASE entries from iteration 3 fill under-covered multi-word identifier gaps. Phase 3 verifies three things: (a) zero multi-word residues in INTENT_BOOSTERS, (b) the 8-case P1 fixture bundle passes, (c) the four already-strong REQ-010 routes hold and the improve-agent route flips from non-match to ≥0.90.

The research converged cleanly because inventory, regression dependency map, phrase-candidate set, migration mechanics, and verification package line up without unresolved routing ambiguity. The only late correction was the hyphenated-token blind spot, now a directive rather than an open question.

---

## 9. Iteration Traceability

- Full per-iteration findings: `research/iterations/iteration-001.md` through `iteration-005.md`
- Loop state: `research/deep-research-state.jsonl` (init + 5 iteration events + converged event)
- Strategy evolution: `research/deep-research-strategy.md` (appended after each iteration)
- Config: `research/deep-research-config.json` (driver: `cli-copilot:gpt-5.4`)
