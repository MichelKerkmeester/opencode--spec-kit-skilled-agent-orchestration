---
title: "Implementation Plan: Codex Tone-of-Voice Personalization [skilled-agent-orchestration/046-cli-codex-tone-of-voice/plan]"
description: "Three-phase plan to deliver Codex APP personalization asset, CLI voice module, and surgical SKILL.md integration — with each phase validated independently before proceeding."
trigger_phrases:
  - "codex tone plan"
  - "codex voice plan"
  - "046 plan"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/046-cli-codex-tone-of-voice"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Author assets per Phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "046-plan-2026-04-19"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Codex Tone-of-Voice Personalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

## 1. APPROACH

Three sequential phases, each producing a verifiable artifact. Prose-only deliverables (no code), so validation is structural (files exist, char counts within budget, markdown renders) and qualitative (content covers the seven target shifts; no AGENTS.md contradictions).

**Rationale for sequencing:**
1. **Spec folder first** — lock the contract before authoring content so reviewers can trace each rule back to a requirement.
2. **Assets second** — author the two deliverables in parallel (they are independent files) and compare for consistency.
3. **SKILL.md integration last** — only after assets are finalized do we wire them into routing; otherwise a SKILL.md reference to a missing file would break the ALWAYS-load contract.

---

## 2. PHASES

### Phase 1 — Spec folder scaffolding (THIS phase, already in progress)

**Goal**: Produce spec.md, plan.md, tasks.md, checklist.md, decision-record.md covering the full contract.

**Steps:**
1. Create directory `.opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice/`.
2. Author spec.md covering REQ-001 through REQ-008.
3. Author plan.md (this file).
4. Author tasks.md as an ordered, checkable step list.
5. Author checklist.md with P0/P1/P2 verification items mapped to REQs.
6. Author decision-record.md with 5 ADRs.

**Exit criteria**: All five Level 3 spec files present and self-consistent (REQs ↔ tasks ↔ checklist ↔ ADRs cross-reference without orphans).

---

### Phase 2 — Author deliverable assets

**Goal**: Produce `codex_app_personalization.md` and `codex_voice_module.md` in `.opencode/skill/cli-codex/assets/`.

**Steps:**
1. Enumerate the seven target behavior shifts (derived from Claude-vs-Codex delta analysis in spec §2):
   - Filler elimination
   - Hedged confidence on uncertainty
   - Reasoning visibility (show work before conclusion)
   - Faulty-premise correction (truth > agreement)
   - Scope discipline (no bonus features, no gold-plating)
   - Code-comment minimalism
   - Terse end-of-turn rhythm
2. Author `codex_app_personalization.md`:
   - Header block explaining scope, target surface, and char-count methodology.
   - **Tiny tier** (~500 chars) — highest-leverage rules only.
   - **Compact tier** (~1500 chars) — fits ChatGPT-style single-field custom instructions.
   - **Extended tier** (~3000 chars split) — two blocks sized for 1500-char context + 1500-char response fields.
   - Footer with usage instructions and example before/after.
3. Author `codex_voice_module.md`:
   - Header explaining appendage semantics and precedence note ("TONE ONLY — AGENTS.md remains authoritative for gates, scope, memory").
   - Single appendable block in a fenced code block (<=800 chars text-only).
   - Usage example: `codex exec "$(cat prompt.md)\n\n$(cat codex_voice_module.md | awk '/<!-- VOICE_MODULE_START -->/,/<!-- VOICE_MODULE_END -->/')"`.
   - Integration note for SKILL.md RULES reference.
4. Cross-check both assets for consistency (same rule semantics; compatible phrasing).

**Exit criteria**: Both assets render cleanly; char counts within budget (REQ-005, REQ-006); all seven shifts addressed (REQ-003); no AGENTS.md contradiction (REQ-007).

---

### Phase 3 — Surgical SKILL.md integration

**Goal**: Wire the new assets into `cli-codex` SKILL.md without disturbing existing routing.

**Steps:**
1. Read `.opencode/skill/cli-codex/SKILL.md` in full (already done during context loading).
2. Identify three insertion points:
   - **Resource Domains table** (§2 Smart Routing) — add two rows for the new assets.
   - **ALWAYS load list** (LOADING_LEVELS["ALWAYS"] pseudocode block) — add `assets/codex_voice_module.md` so every CLI dispatch appends it.
   - **RULES §4 ALWAYS section** — add rule #10: "ALWAYS append the voice module block to Codex delegation prompts; ALWAYS surface `codex_app_personalization.md` when user asks about Codex APP configuration."
3. Apply edits via `Edit` tool, each as a surgical patch (no replace_all).
4. Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice --strict`.

**Exit criteria**: SKILL.md references both new assets; no broken anchors; validation passes.

---

### Phase 4 — Completion & memory save

**Goal**: Close the loop: checklist verification, implementation-summary.md, metadata generation.

**Steps:**
1. Author `implementation-summary.md` with post-implementation evidence (files created, byte counts, SKILL.md diff summary).
2. Walk `checklist.md` — mark each item `[x]` with an evidence citation (file path + line or observed artifact).
3. Compose save-context JSON payload with `specFolder`, `sessionSummary`, `user_prompts`, `recent_context`, `FILES`, `keyDecisions`, `nextSteps`.
4. Invoke `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' .opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice` — this generates `description.json`, refreshes `graph-metadata.json`, and indexes the spec folder in Spec Kit Memory.
5. Address any POST-SAVE QUALITY REVIEW HIGH issues via manual Edit.

**Exit criteria**: Checklist fully verified; validate.sh exits 0; memory save succeeds with no HIGH issues.

---

## 3. DEPENDENCIES

| Dependency                                                      | Required For         | Status    |
| --------------------------------------------------------------- | -------------------- | --------- |
| `.opencode/skill/cli-codex/SKILL.md` exists at stable version   | Phase 3              | Confirmed |
| `.opencode/skill/cli-codex/assets/` directory exists            | Phase 2              | Confirmed |
| `generate-context.js` available at dist path                    | Phase 4              | Assumed present (standard Spec Kit Memory path) |
| `validate.sh` script available                                  | Phase 3, Phase 4     | Assumed present                                 |

---

## 4. ROLLBACK STRATEGY

Prose-only deliverables with no runtime coupling. Rollback is trivial:
1. `rm` both new asset files in `.opencode/skill/cli-codex/assets/`.
2. Revert SKILL.md via `git checkout .opencode/skill/cli-codex/SKILL.md`.
3. `rm -rf` the spec folder if the feature is being discarded entirely.

No data migration, no cache invalidation, no downstream consumers beyond Codex sessions that chose to adopt the personalization.

---

## 5. VALIDATION STRATEGY

**Structural (automated):**
- `validate.sh --strict` on spec folder.
- `wc -c` on each tier block to confirm char budgets.
- Grep for absence of forbidden tokens ("Certainly!", "Absolutely!") inside the assets themselves (self-demonstrating).

**Qualitative (manual, recommended post-implementation):**
- Paste compact tier into Codex APP; ask three questions of varying ambiguity; observe response style.
- Dispatch one `codex exec` call with and without voice module appendage; compare responses.

Qualitative verification is **SC-002 evidence** but is not gated by this spec — it is a recommended next step the user can run.

---

## 6. RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
