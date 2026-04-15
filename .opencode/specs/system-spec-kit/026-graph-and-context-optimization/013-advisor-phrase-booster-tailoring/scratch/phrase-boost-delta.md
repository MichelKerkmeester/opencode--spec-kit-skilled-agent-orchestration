# Phrase-Boost Delta Report

Completion date: 2026-04-15

Driver: cli-copilot `gpt-5.4` dispatched from Claude Code orchestrator

Target file: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` + fixture JSONL

---

## Summary

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Multi-word keys in INTENT_BOOSTERS (whitespace, REQ-001 strict) | 24 | **0** | −24 |
| PHRASE_INTENT_BOOSTERS entry count | 167 | **190** | +23 |
| Fixture cases | 44 | **52** | +8 |
| Regression top1_accuracy | 1.0 | **1.0** | 0 (gate held) |
| Regression p0_pass_rate | 1.0 | **1.0** | 0 (gate held) |
| Overall regression pass | true | **true** | held |

---

## Per-Key Disposition (24 keys)

### migrate-with-phrase-weight-kept (17 — delete INTENT, keep existing PHRASE)

| Key | INTENT weight (deleted) | PHRASE weight (kept) | Target skill |
|-----|------------------------|----------------------|--------------|
| `deep research` | 1.5 | 2.5 | sk-deep-research |
| `research loop` | 1.5 | 2.5 | sk-deep-research |
| `iterative research` | 1.2 | 2.5 | sk-deep-research |
| `autonomous research` | 1.5 | 2.5 | sk-deep-research |
| `agent improvement` | 1.8 | 2.8 | sk-improve-agent |
| `recursive agent` | 1.8 | 2.8 | sk-improve-agent |
| `improvement loop` | 1.8 | 2.8 | sk-improve-agent |
| `candidate scoring` | 1.6 | 2.3 | sk-improve-agent |
| `promotion gate` | 1.4 | 2.0 | sk-improve-agent |
| `evaluate agent` | 1.6 | 2.6 | sk-improve-agent |
| `score agent` | 1.6 | 2.6 | sk-improve-agent |
| `agent evaluation` | 1.6 | 2.6 | sk-improve-agent |
| `deep review` | 1.5 | 2.5 | sk-deep-review |
| `review mode` | 1.2 | 2.0 | sk-deep-review |
| `iterative review` | 1.2 | 2.5 | sk-deep-review |
| `review loop` | 1.2 | 2.5 | sk-deep-review |
| `similar code` | 1.8 | 2.0 | mcp-coco-index |

### migrate-with-same-weight (6 — delete INTENT, add new PHRASE with same weight)

| Key | INTENT weight | PHRASE weight (new) | Target skill |
|-----|---------------|---------------------|--------------|
| `proposal only` | 1.4 | 1.4 | sk-improve-agent |
| `5d scoring` | 1.8 | 1.8 | sk-improve-agent |
| `integration scan` | 1.6 | 1.6 | sk-improve-agent |
| `dynamic profile` | 1.6 | 1.6 | sk-improve-agent |
| `vector search` | 2.0 | 2.0 | mcp-coco-index |
| `concept search` | 2.0 | 2.0 | mcp-coco-index |

### schema-violation-resolved (1 — delete INTENT, keep PHRASE at different skill)

| Key | INTENT (deleted) | PHRASE (kept) | Resolution |
|-----|------------------|---------------|------------|
| `code audit` | sk-deep-review @ 1.0 | sk-code-review @ 2.2 | Kept sk-code-review (PHRASE path fires first; INTENT entry was dead conflict; no user-visible routing change) |

---

## New PHRASE Additions from Iteration 3 (15 entries)

Distributed across 6 skills: system-spec-kit, sk-code-opencode, sk-code-full-stack, sk-code-web, mcp-code-mode, sk-code-review. See the Phase 2 diff in `skill_advisor.py` lines ~830-900 for the exact additions.

---

## Hyphenated-Token Additions from Iteration 5 (2 entries)

| Phrase | Weight | Target | Reason |
|--------|--------|--------|--------|
| `5-dimension` | 1.8 | sk-improve-agent | Hyphenated token was tokenizer-broken in INTENT; now has proper PHRASE route |
| `5-dimension agent scoring` | 2.8 | sk-improve-agent | Specific long-form phrase ensures high-confidence routing |

---

## REQ-010 Confidence Measurements

### Pre-migration baseline vs post-migration

| Query | Before | After | Delta | Target met? |
|-------|--------|-------|-------|-------------|
| `save this conversation context to memory` | system-spec-kit 0.95 | **system-spec-kit 0.95** | +0.00 (held) | ✅ ≥0.90 |
| `deep research loop convergence` | sk-deep-research 0.95 | **sk-deep-research 0.95** | +0.00 (held) | ✅ =0.95 |
| `code review merge readiness` | sk-code-review 0.95 | **sk-code-review 0.95** | +0.00 (held) | ✅ =0.95 |
| `5-dimension agent scoring` | sk-improve-prompt **0.77 (WRONG SKILL)** | **sk-improve-agent 0.95** | **+0.18 + skill correction** | ✅ ≥0.90 |
| `responsive css layout fix` | sk-code-web 0.95 | **sk-code-web 0.95** | +0.00 (held) | ✅ =0.95 |

**Headline**: `5-dimension agent scoring` was silently misrouting to `sk-improve-prompt` (hit on the single token "scoring"). After the hyphenated-token PHRASE addition, it routes correctly to `sk-improve-agent` at 0.95. This is the main functional uplift of the spec.

---

## Acceptance Evidence (REQ-001 — REQ-021)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| REQ-001 | ✅ | `sed -n '496,726p' skill_advisor.py \| grep -cE '^\s*"[^"]+\s+[^"]+":'` returns **0** |
| REQ-002 | ✅ | This file documents per-key disposition with rationale |
| REQ-003 | ✅ | `scratch/post-regression.json` shows `overall_pass: true`, exit 0 |
| REQ-004 | ✅ | p0_pass_rate: 1.0 (baseline) → 1.0 (post) — no regression |
| REQ-005 | ✅ | `python3 -c "import ast; ast.parse(...)"` exits 0 |
| REQ-010 | ✅ | Table above — all 5 queries meet or exceed targets |
| REQ-011 | ✅ | 15 new PHRASE entries across 6 skills (iteration-003.md list) |
| REQ-012 | ✅ | Fixture: 44 → 52 lines (`wc -l`), all P1-PHRASE-NNN IDs |
| REQ-013 | ✅ | This delta report exists and covers disposition + baseline + post-change + new fixtures |
| REQ-020 (P2) | DEFERRED | Bench harness latency not re-measured this pass; change is data-only and unlikely to affect p95 |
| REQ-021 (P2) | ✅ | Inline comment block added near PHRASE_INTENT_BOOSTERS (Step E) |

---

## Follow-Up: Hyphenated INTENT Keys Migration (completed in same spec)

After the initial 24-key whitespace migration, a follow-up pass cleaned up the 12 remaining hyphenated INTENT keys that exhibited the same tokenizer-split bug. Executed directly by Claude Code (no gpt-5.4 call — the pattern was established).

### Audit results

| Key | INTENT target | Weight | PHRASE status | Disposition |
|-----|---------------|--------|---------------|-------------|
| `proposal-only` | sk-improve-agent | 1.4 | not in PHRASE | migrate-with-same-weight |
| `evaluator-first` | sk-improve-agent | 1.5 | in PHRASE→sk-improve-agent | duplicate-remove |
| `5-dimension` | sk-improve-agent | 1.8 | in PHRASE→sk-improve-agent (added Phase 2) | duplicate-remove |
| `openai-cli` | cli-codex | 1.5 | not in PHRASE | migrate-with-same-weight |
| `claude-code` | cli-claude-code | 2.0 | not in PHRASE | migrate-with-same-weight |
| `claude-cli` | cli-claude-code | 1.5 | not in PHRASE | migrate-with-same-weight |
| `extended-thinking` | cli-claude-code | 1.0 | not in PHRASE | migrate-with-same-weight |
| `copilot-cli` | cli-copilot | 1.5 | not in PHRASE | migrate-with-same-weight |
| `cloud-delegation` | cli-copilot | 1.0 | not in PHRASE | migrate-with-same-weight |
| `clickup-cli` | mcp-clickup | 1.5 | not in PHRASE | migrate-with-same-weight |
| `task-management` | mcp-clickup | 1.0 | not in PHRASE | migrate-with-same-weight |
| `tidd-ec` | sk-improve-prompt | 2.0 | not in PHRASE | migrate-with-same-weight |

**Totals**: 12 INTENT deleted / 2 duplicate-remove (no PHRASE changes needed) / 10 migrate-with-same-weight (added to PHRASE with preserved weights).

### Verification — hyphenated query confidences (pre/post follow-up)

| Query | Pre follow-up | Post follow-up | Delta |
|-------|---------------|----------------|-------|
| `proposal-only candidate evaluation` | **NONE** (no token match) | **sk-improve-agent 0.78** | NONE → match |
| `claude-code extended-thinking deep reasoning` | cli-claude-code 0.95 | cli-claude-code 0.95 | held |
| `copilot-cli autopilot delegation` | cli-copilot 0.95 | cli-copilot 0.95 | held |
| `tidd-ec framework prompt` | sk-improve-prompt 0.95 | sk-improve-prompt 0.95 | held |
| `clickup-cli task-management` | mcp-clickup 0.95 | mcp-clickup 0.95 | held |
| `evaluator-first 5-dimension agent` | sk-improve-agent 0.95 | sk-improve-agent 0.95 | held |
| `openai-cli code generation` | cli-codex 0.93 | cli-codex 0.95 | +0.02 |

### Regression (post follow-up)

- top1_accuracy: **1.0**
- p0_pass_rate: **1.0**
- pass_rate: **1.0** (52/52)
- overall_pass: **true**

### Final invariant

After initial migration + follow-up:
- **Zero** whitespace-separated keys in `INTENT_BOOSTERS`
- **Zero** hyphenated keys in `INTENT_BOOSTERS`
- `INTENT_BOOSTERS` now contains ONLY single-token keys (correctly matched by the `\b\w+\b` tokenizer)
- All broken-token intents moved to `PHRASE_INTENT_BOOSTERS` where they actually fire

### Files changed (cumulative for spec 013)

| File | Cumulative change |
|------|-------------------|
| `skill_advisor.py` | 36 INTENT entries deleted (24 whitespace + 12 hyphenated) + 33 PHRASE entries added (6 Phase 2 + 15 new + 2 hyphenated fix + 10 follow-up) + inline comment block |
| `fixtures/skill_advisor_regression_cases.jsonl` | +8 P1 cases (44 → 52) |

### Remaining residual issues

None. All multi-char keys in INTENT_BOOSTERS are now eliminated.

1. **REQ-006 through REQ-009 and REQ-014 through REQ-019 are reserved** — not present in current spec.md, marked as such per iteration-005.md evidence map.

---

## Diff Stat

```
.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl     |  8 ++++++
.opencode/skill/skill-advisor/scripts/skill_advisor.py                                  | 55 +++++++++++++++++++++----------------
2 files changed, 39 insertions(+), 24 deletions(-)
```

Net: 15 lines added to skill_advisor.py (23 PHRASE adds + inline comment block − 24 INTENT removals).

---

## Rollback

If any regression emerges: `git checkout HEAD -- skill_advisor.py scripts/fixtures/skill_advisor_regression_cases.jsonl` in the Public repo and re-run `skill_advisor_regression.py` to confirm baseline restored.
