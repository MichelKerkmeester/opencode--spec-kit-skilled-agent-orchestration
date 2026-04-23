---
title: "Implementation Summary: Copilot CLI Hook Parity Remediation"
description: "Final outcome B: Copilot CLI parity ships through a managed custom-instructions block because Copilot hook output cannot mutate prompts."
trigger_phrases:
  - "copilot hook parity implementation"
  - "copilot custom instructions writer"
  - "026/009/004 implementation summary"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/004-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Copilot file workaround and updated operator docs"
    next_safe_action: "Monitor Copilot ACP"
    blockers:
      - "Full package lint has unused-variable findings outside this packet's write scope."
    key_files:
      - ".github/hooks/scripts/user-prompt-submitted.sh"
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts"
      - ".opencode/skill/cli-copilot/SKILL.md"
      - ".opencode/skill/cli-copilot/README.md"
      - ".opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md"
      - ".opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-009-004-copilot-remediation-2026-04-22"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should a separate cleanup packet address repo-wide unused-variable lint findings?"
    answered_questions:
      - "Outcome B is implemented: Copilot receives startup context and advisor brief through `$HOME/.copilot/copilot-instructions.md`."
      - "Copilot hook stdout remains `{}` because GitHub's customer hooks ignore prompt mutation output."
      - "A real `copilot -p` smoke confirmed the managed advisor line was visible on 2026-04-22."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `009-hook-daemon-parity/004-copilot-hook-parity-remediation` |
| **Completed** | 2026-04-22 |
| **Level** | 3 |
| **Outcome** | B, file-based workaround |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Copilot now has a working Spec Kit context path without pretending its customer hooks can mutate prompts. The implementation writes a managed block into `$HOME/.copilot/copilot-instructions.md`; Copilot reads that block on the next prompt, while hook stdout stays `{}` as GitHub's hook contract requires.

### Managed Custom Instructions

`hooks/copilot/custom-instructions.ts` renders and merges a `SPEC-KIT-COPILOT-CONTEXT` block. The merge preserves human Copilot instructions outside the markers, replaces stale managed content in place, and supports `SPECKIT_COPILOT_INSTRUCTIONS_PATH` plus `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED` for tests and opt-out.

### Prompt and Startup Hooks

`hooks/copilot/user-prompt-submit.ts` now builds the advisor brief, refreshes the custom-instructions file, emits privacy-safe diagnostics, and returns `{}`. `hooks/copilot/session-prime.ts` refreshes startup context into the same managed block. `.github/hooks/scripts/user-prompt-submitted.sh` wires the repository `userPromptSubmitted` event through the compiled writer before sending the existing Superset notification.

### Documentation and Programmatic Wrapper

`cli-copilot/SKILL.md`, `cli-copilot/README.md`, and `hooks/copilot/README.md` now state the actual parity model: file-based, next-prompt fresh, not in-turn `additionalContext`. `cli-copilot/assets/shell_wrapper.md` ships an optional `cpx()` pattern for non-interactive `copilot -p` calls that need to prepend the freshly generated managed block in the same command.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The code moved from the earlier SDK/wrapper assumption to the documented Copilot CLI behavior verified on 2026-04-22: `sessionStart` and `userPromptSubmitted` hook outputs are ignored for model-visible prompt injection, while custom instructions are available on the next submitted prompt after file changes.

Implementation steps:

1. Added the custom-instructions writer and rewired Copilot prompt/session hooks around it.
2. Routed `.github/hooks/superset-notify.json` `userPromptSubmitted` through a repo-local wrapper so the writer actually runs.
3. Updated tests to assert file writes and privacy-safe diagnostics instead of JSON `additionalContext`.
4. Documented the final state in cli-copilot docs, Copilot hook docs, hook references, feature catalog entries, manual testing playbooks, tasks, checklist, and parent summary.
5. Ran a real Copilot smoke after refreshing the managed block; Copilot returned the advisor line from custom instructions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `$HOME/.copilot/copilot-instructions.md` | GitHub documents it as Copilot CLI's local custom-instructions surface, and updates apply on the next prompt. |
| Return `{}` from Copilot hooks | GitHub's hook reference says `sessionStart` output is ignored and `userPromptSubmitted` cannot modify prompts. |
| Preserve human instructions outside markers | Users may already have personal Copilot instructions; the writer should own only its generated block. |
| Keep ACP deferred | ACP could support deeper dynamic injection later, but it is higher cost and not needed for this low-risk workaround. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck -- --pretty false` | PASS |
| `npm run build` | PASS |
| Focused Vitest: `tests/copilot-user-prompt-submit-hook.vitest.ts`, `tests/copilot-hook-wiring.vitest.ts`, `skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts`, `tests/claude-user-prompt-submit-hook.vitest.ts` | PASS, 4 files / 28 tests |
| Focused ESLint on touched TypeScript files | PASS |
| `bash -n .github/hooks/scripts/session-start.sh .github/hooks/scripts/superset-notify.sh .github/hooks/scripts/user-prompt-submitted.sh` | PASS |
| Real Copilot smoke | PASS, `copilot -p` returned `Advisor: stale; use sk-code-opencode 0.92/0.00 pass.` from custom instructions |
| `npm run check` | FAIL, package-wide lint currently reports 15 unused-variable errors in files outside this packet's write scope. No touched file is included in that failure list. |
| Parent validation | FAIL under strict due existing PHASE_LINKS warning among sibling child specs; all other parent checks passed with `--no-recursive`. |
| Target spec validation | FAIL, 5 errors / 5 warnings. Main blockers: existing packet template/anchor drift, spec-doc integrity warnings, and missing Level 3 structural sections. |
| `generate-context.js` | EXIT 0 and refreshed `graph-metadata.json`; indexing reported 8/8 touched canonical spec docs failed and post-save review returned `REVIEWER_ERROR` (`EISDIR`). |
| Operator doc sweep | PASS, hook reference/validation docs, runtime hook matrix, feature catalog, manual testing playbook, README, and architecture docs now describe Copilot's custom-instructions transport. |
| Copilot temp-file doc smoke | PASS, temp `SPECKIT_COPILOT_INSTRUCTIONS_PATH` run returned `{}` and wrote `SPEC-KIT-COPILOT-CONTEXT` with `Advisor: stale; use sk-code-opencode 0.92/0.00 pass.` |
| Doc diff whitespace | PASS, `git diff --check` on touched docs returned no issues. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Next-prompt freshness.** Copilot sees the managed block on the next submitted prompt after the file changes, not as true in-turn prompt mutation.
2. **Spec validation remains red.** The implementation is verified, but this packet's strict spec validation has pre-existing template/anchor/spec-doc drift that needs a documentation cleanup pass.
3. **Memory indexing was not clean.** `generate-context.js` refreshed graph metadata but canonical spec-doc indexing failed and the post-save reviewer errored.
4. **Full lint remains red.** `npm run check` is blocked by package-wide unused-variable findings outside this packet's write scope. Touched-file lint, typecheck, build, focused tests, shell syntax, and real Copilot smoke passed.
5. **ACP remains deferred.** Full dynamic injection through `copilot --acp` is still a future phase once the public-preview API stabilizes.
6. **`userPromptSubmitted` hook was crashing in every Copilot session (resolved 2026-04-22 by packet 010).** Post-ship empirical testing (see packet `../../009-hook-daemon-parity/010-copilot-wrapper-schema-fix/` and research `../../research/007-deep-review-remediation-pt-03/research.md`) revealed that Copilot CLI 1.0.34 merges hooks from BOTH `.github/hooks/*.json` AND `.claude/settings.local.json`. Claude's nested matcher wrapper has no top-level `bash`/`powershell`, so Copilot's executor `g2()` at `~/.copilot/pkg/universal/1.0.34/app.js:1201` threw `Neither 'bash' nor 'powershell' specified in hook command configuration` on every prompt. The flat `.github/hooks/superset-notify.json` entries were executing successfully; the crash came from the additional Claude wrapper. Packet 010 applies the empirically-verified cross-runtime-safe fix (top-level `type`/`bash:"true"`/`timeoutSec` on each Claude wrapper). The schema asymmetry — `sessionStart` surviving, `userPromptSubmitted` crashing — is because `sessionStart` filters entries by `type === "command"` before `g2()` while `userPromptSubmitted` does not. The error had existed across Copilot 1.0.14 → 1.0.32 → 1.0.34 — it was never a 1.0.34 regression.
7. **Writer-wiring secondary gap (not addressed by packet 010).** The Superset wrapper at `~/.superset/bin/copilot:30-69` rewrites `.github/hooks/superset-notify.json` on every launch to point `userPromptSubmitted` at `~/.superset/hooks/copilot-hook.sh` — which only posts Superset notifications and does NOT invoke `dist/hooks/copilot/user-prompt-submit.js`. So after packet 010, the schema crash is fixed, but the `Refreshed:` timestamp in `$HOME/.copilot/copilot-instructions.md` still won't advance per-prompt. A follow-on packet must either (a) replace `"bash": "true"` in the Claude wrapper with the Copilot writer command, or (b) patch the Superset wrapper generator.
<!-- /ANCHOR:limitations -->
