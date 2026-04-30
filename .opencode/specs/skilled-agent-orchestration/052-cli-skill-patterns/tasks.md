---
title: "Tasks: cli-* skill consistency patterns"
description: "Per-skill T### task breakdown for harmonizing 5 cli-* skills."
trigger_phrases:
  - "cli skill tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: cli-* skill consistency patterns

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending, `[x]` complete
- `[P]` parallel-eligible (independent file edit)
- `T###` task id, sequential

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Pre-Edit Baseline (do-not-collapse inventory)

- [x] T001 Snapshot per-skill grep inventory: for each unique term in spec.md §3 do-not-collapse list, run `grep -c '<term>' .opencode/skill/<skill>/SKILL.md` and capture in `specs/052-cli-skill-patterns/scratch/baseline-grep.txt`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: cli-copilot (largest gap)

- [x] T002 Read `.opencode/skill/cli-copilot/SKILL.md` end-to-end; identify §3 location to insert Error Handling table.
- [x] T003 Add Error Handling table to `.opencode/skill/cli-copilot/SKILL.md` §3 (mirror cli-opencode's table shape: `| Issue | Solution |` columns with copilot-specific rows: command not found, autopilot misuse, max-3-concurrent breach, GH token expiry, model switch failure).
- [x] T004 Audit cli-copilot ALWAYS / NEVER / ESCALATE triple parity; rename or add subsection headers if drifted from canonical names.
- [x] T005 Audit INTENT_SIGNALS count; align to 7-intent target if drifted.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: cli-opencode (template donor)

- [x] T006 Read `.opencode/skill/cli-opencode/SKILL.md`; locate the 3 UNKNOWN_FALLBACK_CHECKLIST occurrences.
- [x] T007 Dedupe UNKNOWN_FALLBACK_CHECKLIST 3→1 (keep the canonical occurrence in §2 SMART ROUTING; remove duplicates from §3 / §5 wherever they live).
- [x] T008 Extract §3 Provider Auth Pre-Flight subsection verbatim into `specs/052-cli-skill-patterns/scratch/provider-auth-preflight-template.md` for use by Phase 4-6.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: cli-claude-code

- [x] T009 Read `.opencode/skill/cli-claude-code/SKILL.md`; identify §3 location to insert Default Invocation block.
- [x] T010 Add Default Invocation block to §3 (mirror cli-opencode's shape: pinned `--model`, `--effort`, `--output-format`, `--agent`).
- [x] T011 [P] Port Provider Auth Pre-Flight subsection from `scratch/provider-auth-preflight-template.md` into §3; substitute pre-flight detection: `claude auth list` (or `claude --version` + check `ANTHROPIC_API_KEY` env var); substitute provider names in 3-state table (`anthropic-api` primary; OAuth fallback).
- [x] T012 [P] Audit INTENT_SIGNALS keys for parity with siblings.

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: cli-codex

- [x] T013 Read `.opencode/skill/cli-codex/SKILL.md`; identify INTENT_SIGNALS dict (currently 8 intents).
- [x] T014 Drop or merge 1 intent to align to 7-intent target; preserve `--search` / sandbox / `/review` / `--image` keyword coverage in remaining intents.
- [x] T015 [P] Port Provider Auth Pre-Flight subsection; substitute pre-flight detection: `codex auth status` (or check `OPENAI_API_KEY` env var + `~/.codex/auth.json` existence); substitute provider names in 3-state table (`openai-api` primary; ChatGPT-OAuth fallback).
- [x] T016 [P] Verify `references/hook_contract.md` reference still appears in §5; preserve hooks coverage.

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: cli-gemini

- [x] T017 Read `.opencode/skill/cli-gemini/SKILL.md`; section-order audit only — confirm 8-section header order matches canonical.
- [x] T018 Port Provider Auth Pre-Flight subsection; substitute pre-flight detection: `gemini auth status` (or check `GEMINI_API_KEY` env var); substitute provider names in 3-state table (`google-oauth` free-tier primary; `GEMINI_API_KEY` API-plan fallback; Vertex AI as enterprise tertiary).
- [x] T019 [P] Verify `.geminiignore` and free-tier mentions preserved.

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Cross-skill metadata + verification

- [x] T020 [P] Refresh `graph-metadata.json` `causal_summary` for each of 5 skills: surface "Provider Auth Pre-Flight" + "Error Handling" + "Default Invocation" subsection terms.
- [x] T021 Run per-skill grep gate: re-run baseline greps from T001; assert every do-not-collapse term still ≥1 occurrence.
- [x] T022 Run section-header diff: extract `^## [0-9]\+\. ` lines per SKILL.md; assert identical order/titles across all 5.
- [x] T023 Run subsection presence check: `grep -lE '^### (Default Invocation|Error Handling|Provider Auth Pre-Flight)' .opencode/skill/cli-*/SKILL.md` returns all 5 paths for each pattern.
- [x] T024 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/052-cli-skill-patterns --strict`; exit 0 required.
- [x] T025 Run `doctor:skill-advisor :auto` to re-index; diff each skill's `graph-metadata.json` for regression.
- [x] T026 Run anchor cross-link audit: `grep -rn '<!-- ANCHOR:' .opencode/skill/cli-*/SKILL.md` and verify all anchor IDs resolve in the same file.

<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All 26 tasks marked `[x]`
- All P0 REQs (REQ-001 through REQ-006) verified via checklist.md grep gate
- `implementation-summary.md` written with file diff inventory + grep verification table
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §3 do-not-collapse inventory; REQ-001..REQ-010, SC-001..SC-005
- plan.md Phase 1..7 mapping (1:1 with task phases above)
- checklist.md (Level 2 verification grid)
- decision-record.md (intentional divergence ADRs)
<!-- /ANCHOR:cross-refs -->

---
