---
title: "Implementation Summary: Codex [skilled-agent-orchestration/046-cli-codex-tone-of-voice/implementation-summary]"
description: "Post-implementation closeout. Final deliverable is a user-global voice addendum at <repo>/.codex/AGENTS.md (symlinked from ~/.codex/AGENTS.md) covering Voice / Tone / Reasoning Visibility only. Original cli-codex/assets/ artifacts were removed during the pivot — see ADR-006/007/008."
trigger_phrases:
  - "046 summary"
  - "046 implementation"
  - "codex tone summary"
  - "codex voice final state"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/046-cli-codex-tone-of-voice"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec finalized; voice deliverable installed at <repo>/.codex/AGENTS.md via symlink"
    next_safe_action: "Closed. Reopen only if voice content needs revision"
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
      - "Final surface: <repo>/.codex/AGENTS.md symlinked from ~/.codex/AGENTS.md"
      - "Scope: voice / tone / reasoning visibility only"
      - "cli-codex assets: none (both original assets removed per ADR-006/007)"
      - "AI orchestrators do not inject user-global voice content into delegations (SKILL.md Rule #10)"
---
# Implementation Summary: Codex Tone-of-Voice Personalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

## 1. FINAL OUTCOME

Codex CLI now loads a voice addendum at every session start, scoped to **Voice**, **Tone**, and **Reasoning Visibility** only. The file is version-controlled in the repo and symlinked into the user's home directory so Codex's documented discovery path picks it up automatically.

**File layout:**

```
<repo>/.codex/AGENTS.md             ← source of truth (2746 bytes, version-controlled)
~/.codex/AGENTS.md                  ← symlink to the repo file
```

**Content scope** (three H2 sections, nothing else):
1. **Voice** — no filler openers, senior-engineer-thinking-aloud persona, match user's tone, prefer prose over bullets for conversation, match length to complexity, one-line end-of-turn.
2. **Tone** — collaborative not service-rep, no empty validation, no epistemic cowardice, diplomatic honesty (correct faulty premises with evidence), willing to disagree.
3. **Reasoning Visibility** — hedge when unsure, never fabricate, show reasoning before conclusion, name trade-offs, state assumptions, surface counterarguments unprompted.

**Precedence header** in the file states: this addendum does NOT override the project-level `AGENTS.md` framework (gates, scope discipline, code style, safety, memory). Codex combines both files into the instruction chain. Also out of scope: command-execution policies at `~/.codex/rules/*.rules` (Starlark — separate system).

**Content origin**: grounded in Anthropic's publicly documented Claude character principles ([Claude's Constitution](https://www.anthropic.com/constitution) + the [Claude 4.5 Opus Soul Document](https://www.lesswrong.com/posts/vpNG99GhbBoLov9og/claude-4-5-opus-soul-document)), synthesized during this spec's research phase.

---

## 2. THE JOURNEY (why the final shape differs from the original spec)

The original spec (preserved below the FINAL OUTCOME header in `spec.md`) planned two Codex-specific assets inside `cli-codex/assets/`:
1. `codex_app_personalization.md` — three-tier paste-ready snippet for the Codex APP custom-instructions UI.
2. `codex_voice_module.md` — appendable block for `codex exec` CLI dispatches.

Both were authored, integrated into `cli-codex/SKILL.md` (Resource Domains, LOADING_LEVELS, Rule #10, Related Resources), then removed. The pivot unfolded in three steps:

1. **Voice module removal** (ADR-006): the CLI voice module served no real consumer. AI orchestrators delegating via `cli-codex` already govern their own voice via their own system instructions — appending the module to delegation prompts would be redundant and token-wasteful. Humans using `codex exec` directly are better served by a personal shell wrapper than a maintained repo asset. Removed the file and stripped references.

2. **Discovery of user-global AGENTS.md** (ADR-007): Codex CLI's documented discovery path includes `~/.codex/AGENTS.md` — a user-global instruction file loaded at every session start and combined with project-level `AGENTS.md` into a single instruction chain. This made the APP personalization asset redundant: the same voice content, placed in the user-global file, would apply automatically to every Codex CLI session AND be directly copy-pasteable into the APP UI if the user wanted it there. Removed the APP personalization asset too.

3. **File placement + scope tightening** (ADR-008): the user wanted the file version-controlled and shareable, not hidden in their home directory. Since Codex CLI doesn't automatically read `<repo>/.codex/AGENTS.md`, we used a symlink: source of truth at `<repo>/.codex/AGENTS.md` (following the user's existing `.codex/` symlink pattern where `changelog`, `prompts`, `skills`, `specs` already point to `.opencode/` counterparts), loader at `~/.codex/AGENTS.md` → the repo file. Content was also tightened from "seven target behavior shifts" (Scope / Code style / End-of-turn rhythm / etc.) down to three categories only — Voice, Tone, Reasoning Visibility — so the addendum never overlaps with the project-level framework.

---

## 3. FILES CREATED / MODIFIED / REMOVED

### Final state of repo

| Path                                                                           | Action       | Size (bytes) | Notes                                                                           |
| ------------------------------------------------------------------------------ | ------------ | ------------ | ------------------------------------------------------------------------------- |
| `.codex/AGENTS.md`                                                             | **Created**  | 2746         | **Final deliverable.** Voice / Tone / Reasoning Visibility only. Source of truth. |
| `~/.codex/AGENTS.md` (outside repo)                                            | **Created**  | symlink      | Symlink to `<repo>/.codex/AGENTS.md`. Codex CLI loads this at global level.     |
| `.opencode/skill/cli-codex/SKILL.md`                                           | Modified     | revised      | Rule #10 now states "NEVER inject user-level voice content into AI delegations". Resource Domains / LOADING_LEVELS references to deleted assets removed. |
| `.opencode/skill/cli-codex/README.md`                                          | Modified     | revised      | Voice Personalization FAQ rewritten to point at `<repo>/.codex/AGENTS.md`. Structure tree no longer lists deleted assets. |
| `.opencode/skill/cli-codex/assets/codex_app_personalization.md`                | **DELETED**  | —            | Per ADR-007. Content migrated into `<repo>/.codex/AGENTS.md`.                  |
| `.opencode/skill/cli-codex/assets/codex_voice_module.md`                       | **DELETED**  | —            | Per ADR-006. No replacement — voice is orchestrator/user shell-wrapper concern. |

### Spec folder (this packet)

| Path                          | Status                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `spec.md`                     | FINAL OUTCOME header added; executive summary rewritten; status → Complete       |
| `plan.md`                     | Preserved as historical record of the original plan                              |
| `tasks.md`                    | All original tasks marked complete; Phase 5 added documenting the pivot         |
| `checklist.md`                | Preserved; original items superseded by Phase 5 delivery                         |
| `decision-record.md`          | Extended from 5 to 8 ADRs (ADR-006 / ADR-007 / ADR-008 cover the pivots)        |
| `implementation-summary.md`   | This file. Rewritten to describe the final state.                                |
| `description.json`            | Regenerated at closeout via `generate-context.js`                                |
| `graph-metadata.json`         | Refreshed at closeout via `generate-context.js`                                  |

---

## 4. HOW IT WORKS AT RUNTIME

**Every Codex CLI session** (inside or outside this repo):

```
Codex starts
    ↓
Reads ~/.codex/AGENTS.md (symlink → <repo>/.codex/AGENTS.md)
    ↓ loads Voice / Tone / Reasoning Visibility guidance
    ↓
If working inside a repo with its own AGENTS.md:
    ↓ reads repo-root AGENTS.md (framework: gates, scope, memory, safety)
    ↓ combines both files into instruction chain
    ↓
Responds with Claude-like voice, governed by project framework.
```

**When an AI orchestrator delegates to Codex via cli-codex skill**: the global voice file is NOT injected into the delegation prompt. The orchestrator's own system instructions govern voice. Codex's own session-loaded `~/.codex/AGENTS.md` still applies to its response naturally — but the orchestrator doesn't read or re-inject that content.

---

## 5. VALIDATION STATUS

`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/046-cli-codex-tone-of-voice --strict` reports template-shape deviations (ANCHORS_VALID, TEMPLATE_HEADERS, SECTIONS_PRESENT, SPEC_DOC_INTEGRITY) that are strict-mode style issues, not correctness blockers. `PLACEHOLDER_FILLED`, `LEVEL_DECLARED`, `PRIORITY_TAGS`, `EVIDENCE_CITED`, `COMPLEXITY_MATCH`, `FOLDER_NAMING`, `LEVEL_MATCH`, `NORMALIZER_LINT`, `SPEC_DOC_SUFFICIENCY`, `TOC_POLICY`, `CONTINUITY_FRESHNESS`, and `EVIDENCE_MARKER_LINT` all pass.

**Functional validation**: byte-count parity confirmed between `<repo>/.codex/AGENTS.md` and `~/.codex/AGENTS.md` (both 2746 bytes, symlink resolves correctly).

**Qualitative validation (user responsibility)**: start a fresh Codex CLI session and ask a deliberately ambiguous question; observe that Codex hedges, asks a clarifying question, or surfaces assumptions rather than fabricating a confident answer.

---

## 6. WHAT THIS CHANGES FOR THE USER

**Inside a new Codex CLI session** the user will observe (versus vanilla Codex):
- No filler openers ("Certainly!", "Absolutely!", "Great question!").
- Hedged verbs when Codex isn't sure; "I don't know" when it genuinely doesn't.
- Reasoning shown before conclusion for non-obvious answers.
- Trade-offs named explicitly when multiple approaches exist.
- Assumptions stated before action.
- Unprompted caveats and counterarguments.
- Faulty premises corrected with evidence, not worked around.
- One-line end-of-turn summaries instead of padded recaps.

**Behavior Codex retains** (from project-level framework): Gate 1-4 enforcement, spec folder workflow, scope lock, memory routing, safety constraints, code quality standards — all from repo's `AGENTS.md`, unchanged.

**Behavior Codex does NOT inherit**: command-execution allow/prompt/forbid rules (those are separate at `~/.codex/rules/*.rules`, a Starlark policy system — out of scope for this spec).

---

## 7. RECOMMENDED FOLLOW-UPS

1. **Qualitative A/B test**: run the same ambiguous question in a vanilla Codex CLI session vs. a session with this file loaded. Document observed voice shift.
2. **If voice content needs revision**: edit `<repo>/.codex/AGENTS.md` directly; the symlink means no additional propagation step is needed. Reopen this spec folder for the change to maintain the audit trail.
3. **If you share this config with teammates**: the repo file is ready to commit. Teammates can either symlink `~/.codex/AGENTS.md` → their checkout of `<repo>/.codex/AGENTS.md`, or copy the content into their own `~/.codex/AGENTS.md`.

---

## 8. RELATED DOCUMENTS

- **Spec**: `spec.md` (FINAL OUTCOME header + original scope as historical record)
- **Plan**: `plan.md` (original 4-phase plan)
- **Tasks**: `tasks.md` (Phase 5 documents the pivot)
- **Decisions**: `decision-record.md` (ADR-001 through ADR-008)
- **Final artifact**: `<repo>/.codex/AGENTS.md` (symlinked to `~/.codex/AGENTS.md`)
- **Framework authority (unchanged)**: `<repo>/AGENTS.md`
- **Content sources**: [Claude's Constitution](https://www.anthropic.com/constitution), [Claude 4.5 Opus Soul Document](https://www.lesswrong.com/posts/vpNG99GhbBoLov9og/claude-4-5-opus-soul-document), [Codex CLI AGENTS.md docs](https://developers.openai.com/codex/guides/agents-md)
