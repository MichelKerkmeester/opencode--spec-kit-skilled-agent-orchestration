---
title: "Verification Checklist: Codex Tone-of-Voice Personalization"
description: "P0/P1/P2 verification items for the Codex personalization assets and SKILL.md integration. Each item maps back to a spec REQ and carries evidence after implementation."
trigger_phrases:
  - "046 checklist"
  - "codex tone checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/046-cli-codex-tone-of-voice"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Checklist authored"
    next_safe_action: "Mark items complete after implementation with evidence citations"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "046-checklist-2026-04-19"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Codex Tone-of-Voice Personalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->

**Legend:**
- **P0** = Blocker — must pass before claiming completion. Exit 2 if missed.
- **P1** = Required — must pass OR be explicitly deferred by user. Exit 1 if missed.
- **P2** = Recommended — nice to have; document gaps in implementation-summary.md.

---

## P0 — Blockers

- [ ] **P0-01** — `.opencode/skill/cli-codex/assets/codex_app_personalization.md` exists. (REQ-001) — Evidence: file path + `ls -la` output.
- [ ] **P0-02** — Three distinct tiers (tiny/compact/extended) appear in `codex_app_personalization.md`, each in fenced code blocks with clear headers. (REQ-001) — Evidence: line numbers for each tier header.
- [ ] **P0-03** — `.opencode/skill/cli-codex/assets/codex_voice_module.md` exists. (REQ-002) — Evidence: file path + `ls -la` output.
- [ ] **P0-04** — Voice module has a single clearly-delimited appendable block with `<!-- VOICE_MODULE_START -->` / `<!-- VOICE_MODULE_END -->` markers. (REQ-002) — Evidence: grep for delimiter comments returns exactly two matches.
- [ ] **P0-05** — Both assets cover all seven target shifts (filler, hedging, reasoning visibility, faulty-premise correction, scope discipline, code comments, end-of-turn rhythm). (REQ-003) — Evidence: coverage table in implementation-summary.md mapping each shift to the file+line where it appears.
- [ ] **P0-06** — `cli-codex/SKILL.md` references both new assets without contradiction. (REQ-004) — Evidence: grep for `codex_app_personalization` and `codex_voice_module` in SKILL.md returns at least one hit each.
- [ ] **P0-07** — `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice --strict` exits 0. (SC-003) — Evidence: recorded exit code.
- [ ] **P0-08** — No clause in either asset overrides AGENTS.md §1/§2/§3 rules. (REQ-007, NFR-C01) — Evidence: manual review notes in implementation-summary.md.

## P1 — Required

- [ ] **P1-01** — Extended tier fits within 1500+1500 char UI constraints (each of the two blocks <=1500 chars text-only). (REQ-005) — Evidence: `awk`/`wc -c` count for each block.
- [ ] **P1-02** — Voice module appendable block is <=800 chars text-only (excluding markdown scaffolding). (REQ-006) — Evidence: `wc -c` count between delimiter markers.
- [ ] **P1-03** — Compact tier fits within 1500 chars. (REQ-005, US-001 AC1) — Evidence: `wc -c` count.
- [ ] **P1-04** — Tiny tier fits within 500 chars. (REQ-001) — Evidence: `wc -c` count.
- [ ] **P1-05** — `decision-record.md` contains 5 ADRs matching the Status/Context/Decision/Consequences structure. (REQ-008) — Evidence: grep for `## ADR-00[1-5]:` returns 5 matches.
- [ ] **P1-06** — `generate-context.js` succeeds with no POST-SAVE QUALITY REVIEW HIGH issues. (SC-004) — Evidence: script stdout.

## P2 — Recommended

- [ ] **P2-01** — Qualitative A/B test documented: one `codex exec` call with and without voice module, comparing response styles. (SC-002) — Evidence: before/after snippet in implementation-summary.md.
- [ ] **P2-02** — Compact tier pasted into Codex APP and tested on three representative prompts (ambiguous, scope-creep-tempting, faulty-premise). (US-001 AC2-3) — Evidence: observational notes in implementation-summary.md.
- [ ] **P2-03** — Both assets self-demonstrate: they do NOT themselves contain filler words ("Certainly", "Absolutely", "Great"). (Self-consistency) — Evidence: grep output showing zero matches for those tokens inside asset bodies.
- [ ] **P2-04** — README or top-of-skill reference updated so new users discover the personalization option. (Discoverability) — Evidence: SKILL.md Related Resources section updated.

---

## VERIFICATION LOG

Evidence entries go here as each item is completed. Format: `YYYY-MM-DD HH:MM | ITEM-ID | Evidence summary | [Citation: file:line or command output]`.

- _(entries to be appended during Phase 4)_

---

## COMPLETION STATEMENT

When all P0 items are `[x]` AND all P1 items are `[x]` (or explicitly deferred with user approval), this feature is considered complete.
