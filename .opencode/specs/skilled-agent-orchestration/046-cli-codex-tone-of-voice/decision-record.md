---
title: "Decision Record: Codex Tone-of-Voice Personalization"
description: "Five ADRs covering artifact split rationale, voice framing, tier design, packaging location, and the deliberate separation from AGENTS.md."
trigger_phrases:
  - "046 adr"
  - "codex tone decisions"
  - "codex personalization rationale"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/046-cli-codex-tone-of-voice"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "ADRs authored"
    next_safe_action: "Proceed to Phase 2 asset authoring"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "046-adr-2026-04-19"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Decision Record: Codex Tone-of-Voice Personalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->

---

## ADR-001: Split personalization into APP asset + CLI voice module (rather than one unified doc)

**Status**: Accepted

**Context**: Codex has two consumption surfaces with different constraints:
- **Codex APP** uses a persistent custom-instructions UI (set once, applied to every chat). Text lives inside the app's settings, not in this repo.
- **Codex CLI** (`codex exec`) has no persistent session-wide instruction surface accessible to delegating AIs. Instructions must be appended to each prompt.

A single unified document would either (a) be too long for the APP's character-limited UI, or (b) force CLI dispatches to append everything including APP-specific guidance.

**Decision**: Produce two separate assets:
1. `codex_app_personalization.md` — self-contained, paste-ready, tiered for APP char limits.
2. `codex_voice_module.md` — short, appendable block meant for prompt-level injection during CLI dispatches.

**Consequences**:
- **Positive**: Each asset is optimized for its surface; no dead text.
- **Positive**: CLI voice module stays <=800 chars, keeping per-call token overhead negligible.
- **Negative**: Two files to maintain in lockstep; we mitigate by cross-checking the same seven shifts cover both.

---

## ADR-002: Use imperative second-person voice ("Do X", not "The assistant should X")

**Status**: Accepted

**Context**: Custom instructions are read by the model as constraints on its own behavior. Three framing styles were considered:
1. Meta-descriptive: "The assistant should hedge when uncertain."
2. First-person: "I hedge when uncertain."
3. Imperative second-person: "Hedge when uncertain."

Empirically, imperative second-person produces the most reliable compliance in custom-instruction settings (GPT-family and Claude-family both). Meta-descriptive is weakest because it reads as a description of someone else.

**Decision**: Both assets use imperative second-person throughout.

**Consequences**:
- **Positive**: Stronger behavioral compliance.
- **Positive**: Terser (each rule is one sentence, not a paragraph).
- **Negative**: Reads as slightly commanding — acceptable since the reader is the model, not a human.

---

## ADR-003: Three-tier personalization (tiny / compact / extended) rather than a single version

**Status**: Accepted

**Context**: Codex APP custom instructions UI character limits are uncertain and may vary by product version. ChatGPT historically uses 1500 chars per field × 2 fields = 3000 chars total. Some lighter UIs (embedded chat widgets, alternate clients) may have smaller fields.

A single "compact" version would either (a) be too long for restrictive UIs, or (b) be too short to capture all seven shifts.

**Decision**: Provide three tiers:
- **Tiny (~500 chars)**: Highest-leverage rules — the 30% of content that drives 70% of behavior shift.
- **Compact (~1500 chars)**: Covers all seven shifts concisely; fits standard 1500-char field.
- **Extended (~3000 chars split)**: Two blocks, each <=1500 chars, for split context/response field UIs.

**Consequences**:
- **Positive**: User selects the tier matching their UI's limits.
- **Positive**: Tiny tier is a "try it first" experience with near-zero friction.
- **Negative**: More content to author and keep consistent; mitigated by treating tiny ⊂ compact ⊂ extended (each tier is a strict superset of its predecessor's semantic content).

---

## ADR-004: Package as assets of the existing `cli-codex` skill (rather than a new standalone skill)

**Status**: Accepted

**Context**: Options considered:
1. New standalone skill `sk-codex-voice` with its own SKILL.md.
2. Assets inside existing `cli-codex/assets/` directory.
3. Addition inside `assets/prompt_templates.md` as a new template section.

Option 1 is over-engineered: two markdown files do not warrant a full SKILL.md, references/, and intent routing. Option 3 conflates voice tuning with prompt templates — different conceptual categories. Option 2 matches existing asset patterns (`prompt_quality_card.md`, `prompt_templates.md` are already first-class assets of cli-codex).

**Decision**: Place both files inside `.opencode/skill/cli-codex/assets/`. Update SKILL.md to reference them in the resource map and ALWAYS-load list.

**Consequences**:
- **Positive**: No new skill lifecycle to manage; zero routing overhead.
- **Positive**: Discoverable via existing cli-codex skill advisor routing.
- **Negative**: Tightly coupled to cli-codex; if we later add `cli-chatgpt` or similar, we'd need to extract. Acceptable given no such surface exists today.

---

## ADR-005: Deliberately do NOT embed voice rules in AGENTS.md

**Status**: Accepted

**Context**: AGENTS.md is the universal behavior framework, loaded by every runtime (Claude Code, Codex CLI, Gemini CLI, Copilot CLI). Voice-shift content is Codex-specific because:
- Claude Opus already exhibits the target behaviors (hedged confidence, scope discipline, etc.).
- Gemini and Copilot have their own tone profiles that are outside this spec's scope.
- Embedding Codex-tuning in AGENTS.md would be noise for Claude sessions and potentially miscalibrated for Gemini/Copilot.

**Decision**: Keep runtime-specific voice tuning in runtime-specific skill assets. AGENTS.md remains the authority for universal rules (gates, scope, memory, safety). Voice module header explicitly states: "TONE ONLY — AGENTS.md remains authoritative for gates, scope, and memory."

**Consequences**:
- **Positive**: No cross-runtime contamination; Claude sessions see no Codex-specific noise.
- **Positive**: Future runtime additions can ship their own voice modules without touching AGENTS.md.
- **Positive**: Clear separation of concerns: framework rules vs. runtime voice tuning.
- **Negative**: One more file for users to discover; mitigated by SKILL.md integration and explicit documentation in the asset headers.

---

---

## ADR-006: Remove the CLI voice module asset

**Status**: Accepted (supersedes ADR-001's dual-artifact split for the CLI surface)

**Context**: ADR-001 split voice deliverables into an APP personalization snippet and a CLI voice module. The CLI module was designed to be appended to `codex exec` prompts. During implementation we realized:
1. AI orchestrators (Claude Code, Gemini CLI, Copilot CLI) delegating to Codex already govern voice through their own system instructions. Appending the module would create redundant or conflicting guidance and inflate token cost per call.
2. For humans using `codex exec` directly, a shell wrapper function (`cxv()`) is simpler than a maintained repo asset; it's a personal dotfile concern, not a skill concern.
3. The module had no legitimate consumer that wasn't better served by a different mechanism.

**Decision**: Delete `.opencode/skill/cli-codex/assets/codex_voice_module.md`. Strip all SKILL.md / README.md references. No replacement asset — humans who want CLI voice tuning use the user-global `~/.codex/AGENTS.md` (see ADR-007) which Codex loads automatically, or write their own shell wrapper.

**Consequences**:
- **Positive**: Removes dead code; AI delegations stay lean.
- **Positive**: User-global AGENTS.md serves both CLI and (indirectly) APP use cases without needing per-surface artifacts.
- **Negative**: Users who expected a ready-to-alias wrapper have to write their own — acceptable since the content is trivial (~10 lines of bash).

---

## ADR-007: Remove the Codex APP personalization asset

**Status**: Accepted (supersedes ADR-001 + ADR-003 for the APP surface)

**Context**: The three-tier personalization asset (Tiny / Compact / Extended) was designed for humans to paste into the Codex APP's custom-instructions UI. During implementation we realized that Codex CLI also loads user-level instructions from `~/.codex/AGENTS.md` at every session start — the same content that belongs in the APP UI can live there as a single user-global file, with benefits:
1. One source of truth instead of a per-surface artifact.
2. Codex CLI auto-loads it; no manual paste required.
3. For the APP UI use case, the user can copy-paste directly from the global file — no need for a separate tiered asset.
4. Per-char-tier compression (TINY/COMPACT/EXTENDED) was solving a problem — char limits in the APP UI — that doesn't apply at the CLI level, where one unconstrained file suffices.

**Decision**: Delete `.opencode/skill/cli-codex/assets/codex_app_personalization.md`. Replace with a user-global voice addendum at `<repo>/.codex/AGENTS.md`, symlinked from `~/.codex/AGENTS.md`. Strip all SKILL.md / README.md references to the deleted asset.

**Consequences**:
- **Positive**: One file, loaded automatically by Codex CLI.
- **Positive**: Version-controlled in the repo (shareable with users); symlinked from home dir (keeps home clean and follows the user's existing `.codex/` symlink pattern).
- **Positive**: Content no longer needs char-limit compression; can be clearer and more explicit.
- **Negative**: Users of the Codex APP UI have to manually copy-paste from the file instead of grabbing a pre-sized tier — minor friction, one-time.

---

## ADR-008: Final deliverable — user-global `<repo>/.codex/AGENTS.md`, symlinked, voice/tone/reasoning-visibility only

**Status**: Accepted (establishes the final architecture)

**Context**: After ADR-006 and ADR-007 removed the original assets, we needed a clear statement of where voice guidance actually lives and what it covers. Three architectural questions drove the design:

1. **Where to put the file?** Codex CLI's documented discovery only reads `~/.codex/AGENTS.md` (global) and walks repo root → cwd looking for AGENTS.md (project). It does NOT automatically read `<repo>/.codex/AGENTS.md`. But we wanted the file in the repo for version control and sharing. **Solution**: place the file at `<repo>/.codex/AGENTS.md` (following the user's existing `.codex/` symlink pattern where `changelog`, `prompts`, `skills`, `specs` are already symlinked to `.opencode/` counterparts), and symlink `~/.codex/AGENTS.md` → the repo file. Codex reads the symlink as if it were the file; editing either path updates both.

2. **What scope should the file cover?** The universal project `AGENTS.md` at the repo root already covers gates, scope discipline, code style, memory routing, safety — via the cli-codex instruction chain. Duplicating any of that in the global file would violate ADR-005 (voice is runtime-specific; framework is universal). **Solution**: scope the global file to three dimensions only — **Voice**, **Tone**, **Reasoning Visibility**. Nothing else. Scope discipline, code-comment rules, and end-of-turn rhythm either moved into these three categories or dropped entirely (deferred to project-level AGENTS.md).

3. **How does it interact with AI orchestrators?** Per ADR-005, orchestrators have their own voice. **Solution**: Rule #10 in `cli-codex/SKILL.md` explicitly forbids injecting user-global voice content into AI-orchestrated Codex delegations. The file is for the user's own Codex CLI/APP sessions, never for dispatched work.

**Decision**: Final architecture:
- Source of truth: `<repo>/.codex/AGENTS.md` (version-controlled, shareable, 2.7 KB).
- Loader: `~/.codex/AGENTS.md` → symlink to the repo file.
- Content: three sections (Voice / Tone / Reasoning Visibility) plus a precedence header that explicitly defers to the project-level `AGENTS.md` for framework matters and to `~/.codex/rules/` for command-execution policies.
- Rule #10 of `cli-codex/SKILL.md`: AI orchestrators must not inject this content into delegated prompts.

**Consequences**:
- **Positive**: Codex CLI loads the voice guidance automatically at every session start. Works globally (anywhere on the machine), and inside the repo it combines additively with the project-level framework.
- **Positive**: File is version-controlled and shareable with other users who want the same tone configuration.
- **Positive**: Zero conflict with the repo's universal `AGENTS.md` framework — scopes never overlap.
- **Positive**: Follows the user's established `.codex/` symlink pattern.
- **Negative**: Discovery requires the symlink; if the user moves or renames the repo file, the symlink breaks. Mitigated by a clear note in the file's header.

---

## CROSS-REFERENCES

- **Spec**: `spec.md` §2 (problem), §4 (requirements), §11 (user stories), FINAL OUTCOME header
- **Plan**: `plan.md` §2 Phases 2 & 3 (original); ADR-008 establishes the final Phase 5
- **Tasks**: `tasks.md` T-07, T-08 (removed); T-15 through T-20 (Phase 5 — final delivery)
- **Implementation**: `implementation-summary.md` — current state and evidence
- **Final artifact**: `<repo>/.codex/AGENTS.md` (symlinked to `~/.codex/AGENTS.md`)
