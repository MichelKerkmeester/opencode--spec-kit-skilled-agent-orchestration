---
title: "Feature Specification: Codex Tone-of-Voice [skilled-agent-orchestration/046-cli-codex-tone-of-voice/spec]"
description: "Codex (APP + CLI) responses default to eager, sycophantic, command-executor style that skips trade-off reasoning, over-engineers silently, and pads with filler. Final outcome: a user-global voice addendum at <repo>/.codex/AGENTS.md (symlinked to ~/.codex/AGENTS.md) that shifts Codex toward Claude Opus's voice, covering Voice / Tone / Reasoning Visibility only."
trigger_phrases:
  - "codex tone"
  - "codex voice"
  - "codex personalization"
  - "codex custom instructions"
  - "claude-like codex"
  - "gpt-5.4 voice"
  - "codex agents.md"
  - "codex global voice"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/046-cli-codex-tone-of-voice"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scope pivoted; final deliverable is <repo>/.codex/AGENTS.md (symlinked to ~/.codex/AGENTS.md)"
    next_safe_action: "Spec folder closed; reopen only if voice content changes"
    blockers: []
    key_files:
      - ".codex/AGENTS.md"
      - ".opencode/skill/cli-codex/SKILL.md"
      - ".opencode/skill/cli-codex/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "046-closeout-2026-04-19"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Spec folder path: .opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice"
      - "Final surface: <repo>/.codex/AGENTS.md + ~/.codex/AGENTS.md symlink"
      - "Scope: voice, tone, reasoning visibility only — scope/code/framework stay with project AGENTS.md"
      - "cli-codex assets removed: neither voice module nor APP personalization survived final design"
---
# Feature Specification: Codex Tone-of-Voice Personalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

> **⚠ FINAL OUTCOME DIFFERS FROM ORIGINAL SCOPE.** The original plan authored two assets under `cli-codex/assets/` (Codex APP personalization snippet + CLI voice module). Both were removed during implementation. The final deliverable is a user-global voice addendum at `<repo>/.codex/AGENTS.md`, symlinked from `~/.codex/AGENTS.md`, covering voice / tone / reasoning visibility only. See `decision-record.md` ADR-006 through ADR-008 for the pivots, and `implementation-summary.md` for the final state. The sections below preserve the original framing as historical record.

---

## EXECUTIVE SUMMARY

**Final state (2026-04-19)**: Codex CLI now loads a voice-only addendum at every session start via `~/.codex/AGENTS.md → <repo>/.codex/AGENTS.md` (symlink). Content is scoped to three dimensions (Voice / Tone / Reasoning Visibility) and explicitly defers to the project-level `AGENTS.md` framework for everything else. No `cli-codex/assets/` artifacts survived the final design — the Codex APP personalization snippet and CLI voice module were both removed once we realized user-global AGENTS.md serves both use cases more cleanly.

**Original framing (historical)**: Codex defaults to an eager, declarative, sycophancy-prone style that contrasts sharply with Claude Opus's hedged, trade-off-aware, scope-disciplined voice. The initial spec proposed surface-specific `cli-codex/assets/` artifacts (APP personalization + CLI voice module) to close that gap.

**Key Decisions (final)**: One source-of-truth file at `<repo>/.codex/AGENTS.md` (version-controlled, shareable); symlinked from `~/.codex/AGENTS.md` to satisfy Codex CLI's documented global discovery path; content scoped narrowly to voice/tone/reasoning-visibility (scope discipline, code style, and framework rules live in the project-level `AGENTS.md`, which Codex combines additively via its instruction chain).

**Critical Dependencies**: none. Codex CLI's own instruction-chain discovery (`~/.codex/AGENTS.md` + repo-root `AGENTS.md` + subdirs) delivers the behavior. `cli-codex` SKILL.md has been updated to state that AI-orchestrated delegations must NOT inject user-global voice content into delegated prompts (Rule #10).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field        | Value                                  |
| ------------ | -------------------------------------- |
| **Level**    | 3                                      |
| **Priority** | P1                                     |
| **Status**   | Complete                               |
| **Created**  | 2026-04-19                             |
| **Branch**   | `main` (046-cli-codex-tone-of-voice)   |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Codex-family models (GPT-5.4, GPT-5.3-codex) and the Codex APP product default to a response style that differs from Claude Opus in observable, friction-producing ways: (1) opens with pleasantries ("Certainly!", "Absolutely!", "Great question!"); (2) declares conclusions without showing reasoning or trade-offs; (3) agrees with faulty user premises for conversational flow; (4) silently over-engineers and gold-plates beyond the stated scope; (5) reports partial work as a "good stopping point"; (6) hedges less when uncertain; (7) rarely surfaces assumptions explicitly. AGENTS.md enforces behavior at the framework level (gates, scope, memory), but not at the **conversational style** level — and Codex APP has no AGENTS.md injection path at all.

### Purpose
Produce Codex-specific personalization artifacts that shift its default voice toward Claude Opus's: hedged confidence, evidence-first corrections, explicit trade-offs, scope discipline, and terse rhythm — without duplicating AGENTS.md logic or fragmenting framework rules.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `codex_app_personalization.md` — asset in `.opencode/skill/cli-codex/assets/` containing three paste-ready tiers (tiny ~500 chars, compact ~1500 chars, extended ~3000 chars split across context + response fields) for the Codex APP custom instructions UI.
- `codex_voice_module.md` — asset in `.opencode/skill/cli-codex/assets/` containing an appendable voice-shift block designed to be suffixed onto `codex exec` prompts when dispatched from `cli-codex`.
- Surgical update to `.opencode/skill/cli-codex/SKILL.md` adding both assets to the resource map, ALWAYS-load list, and RULES section.
- `description.json` and `graph-metadata.json` for this spec folder (auto-generated via `generate-context.js` at memory save).

### Out of Scope
- Modifying AGENTS.md — voice tuning is runtime-specific; AGENTS.md is universal.
- Modifying Claude agent definitions — Claude already exhibits the target behaviors.
- Changing `cli-gemini` or other CLI skills — Gemini/Copilot tone is outside scope.
- Automated testing of Codex's adherence — qualitative verification only (observed A/B comparison on representative tasks).
- Touching `config.toml` profile definitions — those shape Codex CLI execution parameters, not voice.

### Files to Change

| File Path                                                                              | Change Type | Description                                                             |
| -------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------- |
| `.opencode/skill/cli-codex/assets/codex_app_personalization.md`                        | Create      | Three-tier personalization snippet for Codex APP custom instructions    |
| `.opencode/skill/cli-codex/assets/codex_voice_module.md`                               | Create      | Appendable voice-shift block for CLI dispatches                         |
| `.opencode/skill/cli-codex/SKILL.md`                                                   | Modify      | Add both assets to resource map, ALWAYS-load list, and RULES §9         |
| `.opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice/*.md`         | Create      | Spec folder docs (spec, plan, tasks, checklist, decision-record, impl)  |
| `.opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice/*.json`       | Create      | description.json + graph-metadata.json (via generate-context.js)        |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID      | Requirement                                                                                                                                  | Acceptance Criteria                                                                                                |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| REQ-001 | `codex_app_personalization.md` exists with three distinct tiers (tiny/compact/extended) labelled and paste-ready                             | File present; each tier inside a fenced code block with character count noted; extended tier split context/response |
| REQ-002 | `codex_voice_module.md` exists with a clearly-delimited appendable block and usage instructions                                              | File present; appendable block in a fenced code block; usage example shows `codex exec "<prompt>\n\n<VOICE>"`      |
| REQ-003 | Content covers the seven observable Codex→Claude shifts: filler, hedging, reasoning visibility, faulty-premise correction, scope discipline, code comments, end-of-turn rhythm | Each shift is addressable via a dedicated rule or rule-cluster in both assets                                      |
| REQ-004 | `cli-codex/SKILL.md` references both assets without contradiction                                                                            | Resource map lists both files; ALWAYS-load list includes personalization context when dispatching; no dead links   |

### P1 - Required (complete OR user-approved deferral)

| ID      | Requirement                                                                                             | Acceptance Criteria                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| REQ-005 | Extended tier (3000-char split) fits within ChatGPT-style 1500+1500 custom instructions UI constraints  | Each field block is <=1500 chars (counted excluding fenced-block markers)                         |
| REQ-006 | Voice module is <=800 chars when stripped of markdown scaffolding                                       | Text-only byte count of the appendable block alone is <=800 chars                                 |
| REQ-007 | Neither asset contradicts AGENTS.md gates, scope, or memory rules                                       | Manual review: no clauses override HARD gates, spec folder rules, or memory save routing          |
| REQ-008 | Decision-record.md captures 5 ADRs: split rationale, voice framing, tier rationale, packaging, AGENTS.md separation | 5 ADR entries present with Status/Context/Decision/Consequences sections                          |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A user with zero prior context can copy the compact tier into Codex APP custom instructions in under 30 seconds.
- **SC-002**: When the voice module is appended to a `codex exec` prompt, Codex's first response drops filler ("Certainly!" etc.), hedges when uncertain, and surfaces assumptions — verified by qualitative A/B comparison on at least one representative prompt.
- **SC-003**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice --strict` exits 0.
- **SC-004**: `generate-context.js` produces `description.json` and refreshes `graph-metadata.json` with no POST-SAVE QUALITY REVIEW HIGH issues.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type       | Item                                              | Impact                                            | Mitigation                                                                                           |
| ---------- | ------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Dependency | `cli-codex/SKILL.md` already at stable version    | Edit must be surgical to avoid breaking routing   | Read file in full, Edit only resource-map rows, ALWAYS-load bullet, and a single RULES addition      |
| Risk       | Personalization text bloats custom instructions   | User hits char limit in Codex APP                 | Provide tiered versions (tiny/compact/extended) with char counts printed inline                      |
| Risk       | Voice module conflicts with AGENTS.md rules       | Codex receives contradictory instructions         | Voice module scoped to TONE only; defers all gate/scope/memory logic to AGENTS.md via explicit note  |
| Risk       | Codex product UI changes custom-instructions schema | Snippet becomes stale                           | Label snippet with ChatGPT-style 1500-char assumption in header; extended tier is flexible           |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Voice module must add <=800 chars to a delegation prompt (minimal token overhead per `codex exec` call).

### Maintainability
- **NFR-M01**: Each tier in `codex_app_personalization.md` must be independently copyable — no cross-references between tiers.
- **NFR-M02**: Voice module rules must be single-sentence, imperative, second-person.

### Compatibility
- **NFR-C01**: No rule in either asset shall override or contradict AGENTS.md §1 (Safety Constraints), §2 (Mandatory Gates), or §3 (Conversation Documentation).

---

## 8. EDGE CASES

### Content Boundaries
- Codex APP custom instructions field limit <1500 chars → compact tier suffices; tiny tier is fallback for more restrictive UIs.
- Codex APP has no custom instructions UI → user can prepend the voice module to every new chat manually (extended tier).

### Integration Scenarios
- External AI (Claude Code, Gemini CLI) dispatches via `cli-codex`: voice module appended automatically per SKILL.md RULES update.
- Codex CLI invoked directly by user (no wrapper): user can pipe the voice module manually or set it in `~/.codex/config.toml` as a prefix (documented in asset header).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension       | Score  | Triggers                                                                             |
| --------------- | ------ | ------------------------------------------------------------------------------------ |
| Scope           | 10/25  | Files: 3 create + 1 modify; LOC: ~500; Systems: 1 (cli-codex skill)                  |
| Risk            | 8/25   | No auth/API/breaking concerns; only prose content; surgical SKILL.md edit            |
| Research        | 12/20  | Required careful enumeration of Claude vs. Codex behavioral deltas                   |
| Multi-Agent     | 2/15   | Single author; no parallel execution                                                 |
| Coordination    | 5/15   | Cross-surface (APP + CLI); one existing skill must absorb changes                    |
| **Total**       | **37/100** | **Level 3 (comfortably within range)**                                           |

---

## 10. RISK MATRIX

| Risk ID | Description                                                               | Impact | Likelihood | Mitigation                                                                   |
| ------- | ------------------------------------------------------------------------- | ------ | ---------- | ---------------------------------------------------------------------------- |
| R-001   | Voice module contradicts AGENTS.md gate rules, confusing Codex            | M      | L          | Explicit "TONE ONLY — defers to AGENTS.md for gates" header in voice module  |
| R-002   | Personalization tier exceeds actual Codex APP char limit                  | L      | M          | Three tiers with printed char counts; extended tier is optional              |
| R-003   | SKILL.md edit breaks smart-routing pseudocode (INTENT_SIGNALS)            | M      | L          | Only add resource-map rows + ALWAYS-load entries; no INTENT_SIGNALS changes  |
| R-004   | Rules perceived as over-prescriptive and stifle Codex's genuine strengths | L      | M          | Focus on shifts only where Codex's default causes friction; keep it surgical |

---

## 11. USER STORIES

### US-001: Adopt Claude-like voice in Codex APP (Priority: P0)

**As a** developer using the Codex APP for day-to-day coding questions, **I want** paste-ready custom instructions, **so that** Codex responds with the terse, hedged, trade-off-aware voice I get from Claude Opus.

**Acceptance Criteria**:
1. Given I open `codex_app_personalization.md`, When I copy the compact tier, Then it fits within a standard 1500-char custom-instructions field.
2. Given the compact tier is installed, When I ask Codex an ambiguous question, Then it asks a clarifying question or explicitly hedges rather than fabricating.
3. Given the compact tier is installed, When Codex would normally open with "Certainly!", Then it leads with substance instead.

---

### US-002: Layer voice-shift on CLI dispatches without duplicating AGENTS.md (Priority: P0)

**As a** calling AI (Claude Code, Gemini CLI) using `cli-codex` to delegate to Codex, **I want** an appendable voice module, **so that** Codex's delegated output matches the orchestrator's voice without forcing me to duplicate framework rules inline.

**Acceptance Criteria**:
1. Given I dispatch a task via `codex exec`, When I append the voice module, Then the response style shifts toward Claude-like voice without any AGENTS.md rule being violated.
2. Given the voice module is appended, When Codex detects ambiguity, Then it surfaces assumptions before acting.
3. Given the voice module is <=800 chars, When it is appended to every `codex exec` call, Then token overhead per call remains negligible.

---

### US-003: Extend when the 1500-char limit is insufficient (Priority: P1)

**As a** user with access to a Codex interface that allows longer custom instructions (e.g., system prompts, `codex_instructions.md`), **I want** an extended tier, **so that** I can capture the full voice profile without compression trade-offs.

**Acceptance Criteria**:
1. Given the extended tier exists, When I paste it into a split context/response field, Then each field is under 1500 chars.
2. Given the extended tier is used, When Codex encounters all seven target behavior shifts, Then it has guidance for each.

---

## 12. OPEN QUESTIONS

- None at spec time. If Codex product team introduces a native "voice profile" configuration surface, a follow-up spec can migrate these artifacts into that surface.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Asset (primary deliverable)**: `.opencode/skill/cli-codex/assets/codex_app_personalization.md`
- **Asset (secondary deliverable)**: `.opencode/skill/cli-codex/assets/codex_voice_module.md`
