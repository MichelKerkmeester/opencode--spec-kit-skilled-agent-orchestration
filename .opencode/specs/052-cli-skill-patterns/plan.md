---
title: "Implementation Plan: cli-* skill consistency patterns"
description: "Per-skill diff plan for harmonizing 5 cli-* skills on shared structural surface; cli-opencode serves as the canonical template for §3 patterns introduced in 051."
trigger_phrases:
  - "cli skill plan"
  - "cli sibling diff plan"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: cli-* skill consistency patterns

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Harmonize structural surface across 5 cli-* skills using cli-opencode (post-051) as the canonical template for §3 subsection set. Edit order: cli-copilot first (largest gap — missing Error Handling table), then cli-opencode (3→1 dedupe + serves as donor for Provider Auth Pre-Flight pattern), then cli-claude-code (add Default Invocation block + adapt Provider Auth Pre-Flight), then cli-codex (INTENT_SIGNALS realignment + adapt Provider Auth Pre-Flight), then cli-gemini (smallest delta — section-order audit + adapt Provider Auth Pre-Flight). Preserve all do-not-collapse items per spec.md §3.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:approach -->
## 2. APPROACH

**Donor-and-recipient pattern.** cli-opencode SKILL.md (post-051) is the donor: its §3 *Provider Auth Pre-Flight (Smart Fallback)* block is the canonical shape that the 4 sibling skills adapt. Each adaptation:
1. Substitute the pre-flight detection command (`opencode providers list` → CLI-native equivalent: `claude auth list` / `codex auth status` / `gh auth status copilot` / `gemini auth status`).
2. Substitute the provider names in the 3-state decision table for that CLI's primary + fallback providers.
3. Keep the ASK-not-substitute user-prompt template language identical.
4. Keep the cache-invalidation-on-auth-error contract identical.

**Verification-first edit cadence.** Before each skill's edit, snapshot the per-skill do-not-collapse term list with `grep -c`. After the edit, re-run identical greps; assert each term still has ≥1 occurrence. This is the primary safety net against accidental collapse.

**Section-header invariant.** All 5 skills already have the canonical 8-section title set; the audit found order is consistent. The harmonization is *additive* (add subsections) plus *deduplicative* (UNKNOWN_FALLBACK_CHECKLIST 3→1 in cli-opencode); no top-level section is renamed or reordered.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:phases -->
## 3. PHASES

| Phase | Skill | Activities | Outputs |
|-------|-------|------------|---------|
| 1 | cli-copilot | Add Error Handling table to §3; align ALWAYS/NEVER/ESCALATE if drifted; audit INTENT_SIGNALS count | SKILL.md updated; per-skill grep gate passes |
| 2 | cli-opencode | Dedupe UNKNOWN_FALLBACK_CHECKLIST 3→1; freeze §3 Provider Auth Pre-Flight as canonical template for Phase 3-5 reference | SKILL.md updated; donor template extracted to scratch for reference |
| 3 | cli-claude-code | Add Default Invocation block; port Provider Auth Pre-Flight (sub `claude auth list`); align INTENT_SIGNALS keys if needed | SKILL.md updated |
| 4 | cli-codex | Align INTENT_SIGNALS to 7-intent target (drop 1); port Provider Auth Pre-Flight (sub `codex auth status`); preserve `hook_contract.md` reference | SKILL.md updated |
| 5 | cli-gemini | Section-order audit; port Provider Auth Pre-Flight (sub `gemini auth status`); preserve free-tier note + `.geminiignore` mention | SKILL.md updated |
| 6 | All 5 | Refresh `graph-metadata.json` `causal_summary` to reflect harmonized vocabulary; refresh `key_topics` if relevant | 5× graph-metadata.json updated |
| 7 | Verification | Per-skill grep gate; section-header diff across all 5; strict validate; advisor re-index; anchor-link audit | checklist.md fully marked `[x]` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. TESTING STRATEGY

- **Pre-write inventory** (per skill): grep each unique term from spec.md §3 do-not-collapse list; capture line counts.
- **Post-edit grep gate** (per skill): re-run identical greps; assert each term still ≥1 occurrence.
- **Section-header diff**: extract `^## [0-9]\+\.` lines from each SKILL.md; assert identical order/titles across all 5.
- **Subsection presence**: `grep -E '^### (Default Invocation|Error Handling|Provider Auth Pre-Flight|Reasoning-Effort)' <skill>/SKILL.md` returns ≥1 per pattern across all 5.
- **Strict validate**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/052-cli-skill-patterns --strict` exits 0.
- **Advisor re-index** (post-edit): `doctor:skill-advisor :auto` to refresh TOKEN_BOOSTS / PHRASE_BOOSTS; diff each skill's `graph-metadata.json` to confirm no regression.
- **Anchor cross-link audit**: `grep -rn '<!-- ANCHOR:' .opencode/skill/cli-*/SKILL.md` and per-skill `manual_testing_playbook/manual_testing_playbook.md`; ensure no rot from any subsection adds.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

- Packet 051 complete (cli-opencode provider realignment + auth pre-flight) — provides the canonical Provider Auth Pre-Flight template
- `system-spec-kit/references/cli/shared_smart_router.md` — already wired into all 5 skills; no edits needed
- `system-spec-kit/references/cli/memory_handback.md` — already wired into all 5 skills; no edits needed
- `system-spec-kit/scripts/spec/validate.sh` — strict-mode validation tool
- `doctor:skill-advisor` — advisor re-index command (post-edit)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK PLAN

Per-skill rollback: `git checkout main -- .opencode/skill/<skill>/SKILL.md .opencode/skill/<skill>/graph-metadata.json` reverts that skill to its pre-052 state. The 052 spec folder can stay as documentation of the attempt or be removed via `git clean -fd specs/052-cli-skill-patterns/`.

Atomic rollback (all 5 skills + spec folder): `git checkout main -- .opencode/skill/cli-*/ specs/052-cli-skill-patterns/` (only safe if no other 051 edits are in working tree — they are; consider per-skill rollback only).
<!-- /ANCHOR:rollback -->

---
