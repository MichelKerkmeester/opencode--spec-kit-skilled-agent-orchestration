---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: Copilot Target-Authority Helper"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Closes the v1.0.2 cli-copilot Gate 3 bypass at the executor-config layer with a typed authority token. Recovered context can no longer override workflow-resolved authority, and missing authority on a write-intent dispatch enforces plan-only by replacing the prompt and stripping --allow-all-tools."
trigger_phrases:
  - "012 implementation summary"
  - "copilot authority helper summary"
  - "buildCopilotPromptArg verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/012-copilot-target-authority-helper"
    last_updated_at: "2026-04-27T21:01:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "P1 fixes applied"
    next_safe_action: "Operator review; commit packet alongside code"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: null
      session_id: "012-copilot-target-authority-helper-impl-2026-04-27"
      parent_session_id: "011-post-stress-followup-research-2026-04-27"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Insertion point: shared command-owned helper (research §3.3 option 1) — landed"
      - "Authority kinds: { kind:'approved', specFolder } | { kind:'missing', writeIntent } — landed"
      - "Override resistance: preamble byte-stable + appears first in prompt body — verified by vitest"
      - "Plan-only enforcement: prompt replaced + --allow-all-tools stripped — verified by vitest"
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

# Implementation Summary: Copilot Target-Authority Helper

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-copilot-target-authority-helper |
| **Completed** | 2026-04-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The v1.0.2 stress-test rerun caught cli-copilot mutating a spec folder it had no authorization to touch. This packet closes that bypass at the source: at the executor-config layer, every cli-copilot deep-loop dispatch now ships with a typed authority token. Recovered context (memory hits, bootstrap-context spec folders, graph `last_active_child_id`) can no longer pose as approved-write authority; the workflow-resolved spec folder is the only legal mutation target.

### `buildCopilotPromptArg` helper

Added next to `resolveCopilotPromptArg` in `mcp_server/lib/deep-loop/executor-config.ts`. The helper takes a `CopilotTargetAuthority` discriminated union (`{ kind:"approved", specFolder }` or `{ kind:"missing", writeIntent }`) plus the prompt body and base argv, and returns `{ argv, promptBody, enforcedPlanOnly }`.

You can now call it once at every cli-copilot dispatch site and trust that the prompt the model sees is bound to a single approved spec folder. When authority is approved, the prompt body opens with a `## TARGET AUTHORITY` preamble that names the spec folder and explicitly tells the model that recovered context cannot override it. When authority is missing on a write-intent dispatch, the helper replaces the prompt entirely with a Gate-3 clarifying question and strips `--allow-all-tools` from argv, turning the dispatch into a plan-only ask. Read-only dispatches without authority pass through unchanged so existing workflows aren't disrupted.

### YAML wire-ins for both auto-loop dispatch sites

Both `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` now route their `if_cli_copilot.command` block through `buildCopilotPromptArg`. Each inline Node script reads the workflow's `{spec_folder}` template, derives a `CopilotTargetAuthority` from it (approved when present, missing+writeIntent:true when absent), and feeds the helper's argv to either `runAuditedExecutorCommand` (deep-research) or `spawnSync('copilot', ...)` (deep-review). The deep-review path was unified onto Node-based dispatch in the process, replacing the prior bash + `wc -c` + heredoc shape.

### Vitest coverage

13 new test cases at `mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` cover all three branches of the behavior matrix, override resistance against recovered-context strings embedded in the prompt body, large-prompt `@PROMPT_PATH` fallback (with the preamble preserved on the wrapper path), and the exported helpers `buildTargetAuthorityPreamble` and `buildMissingAuthorityGate3Prompt`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | Modified | Append `CopilotTargetAuthority` type + `buildCopilotPromptArg` + 2 helper builders (~+150 LOC); existing `resolveCopilotPromptArg` body byte-stable |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modified | Replace `if_cli_copilot.command` block with helper-routed Node script; +2 explanatory `notes` lines |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modified | Replace `if_cli_copilot.command` block with helper-routed Node script (also unifies on Node-based dispatch); +2 explanatory `notes` lines |
| `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | Created | 13 vitest cases across 6 describe blocks |
| `.opencode/specs/.../012-copilot-target-authority-helper/{spec,plan,tasks,checklist,implementation-summary}.md` | Created | Standard Level 1 packet docs |
| `.opencode/specs/.../012-copilot-target-authority-helper/{description,graph-metadata}.json` | Created | Required spec metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Tested and shipped under the helper's own vitest suite. The 13 new cases cover the falsifiable success criteria from research.md §3.5 directly: an approved-authority prompt contains the exact spec folder string; a missing+write-intent dispatch emits ONLY a Gate-3 question with no mutating tools; bootstrap-context spec folders embedded in the prompt body cannot override `targetAuthority.specFolder`. The existing 24-case `executor-config.vitest.ts` suite re-ran clean to confirm no regression in the sibling helper.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add `buildCopilotPromptArg` as a sibling helper rather than mutate `resolveCopilotPromptArg` | Existing callers of `resolveCopilotPromptArg` may not need authority enforcement (e.g. read-only paths). A sibling preserves backwards compat and keeps the diff scoped. |
| Use a discriminated union for `CopilotTargetAuthority` instead of optional fields | Forces the caller to be explicit about whether write intent applies when authority is missing. The compiler catches misuse; runtime can't drift into "authority is approved but I forgot the folder" states. |
| Strip `--allow-all-tools` from argv (rather than swap to `--plan-only` or similar) | The cli-copilot binary has no plan-only flag; the only no-mutation guarantee is to not pass `--allow-all-tools`. Combined with the Gate-3 clarifying question prompt, the dispatch becomes a non-mutating ask. |
| Unify deep-review on Node-based dispatch (instead of patching bash) | Symmetry with deep-research makes the helper invocation byte-identical and removes a duplicate code path. The bash variant was already being phased out implicitly. |
| Keep `resolveCopilotPromptArg` exported but stop using it from `_auto.yaml` | Other consumers may still import it; deleting would be out of scope and risks a wider blast radius than this packet's scope allows. |
| Defer `_confirm.yaml` symmetry to a follow-up | The autonomous path was the v1.0.2 failure surface. `_confirm` requires operator confirmation per dispatch and does not exhibit the same pathology. Symmetry is operator preference, not a P0. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New vitest (`tests/executor-config-copilot-target-authority.vitest.ts`) | PASS — Tests 13 passed (13); exit 0; 126ms |
| Existing executor-config vitest (`tests/deep-loop/executor-config.vitest.ts`) | PASS — Tests 24 passed (24); exit 0 |
| Combined executor-config test surface | PASS — Tests 37 passed (37); exit 0; 213ms |
| `buildCopilotPromptArg` exported from `executor-config.ts` | PASS — `grep -n "export function buildCopilotPromptArg"` returns 1 hit |
| `_auto.yaml` files import `buildCopilotPromptArg` | PASS — both `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml` contain the import + call |
| `resolveCopilotPromptArg` body byte-stable | PASS — old function untouched; sibling helper added below it |
| `validate.sh --strict` on packet | PASS (structural) — 0 structural errors; SPEC_DOC_INTEGRITY false-positives accepted as known noise (matches 010 + 011 baseline pattern) |
| Recovered-context override resistance | PASS — vitest case "keeps the approved specFolder even when the prompt body mentions a different folder" verifies preamble appears first and contains the explicit "cannot override" line |
| Read-only behavior unchanged | PASS — vitest `kind:"missing", writeIntent:false` describe block (2 cases) verifies prompt + argv match prior contract |
| Non-interactive | PASS — code review confirms no stdin/prompt reads inside the helper; pure function over deterministic inputs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`_confirm.yaml` variants not patched in this packet.** `spec_kit_deep-research_confirm.yaml:591-614` and `spec_kit_deep-review_confirm.yaml:688-711` still use the prior bash + `wc -c` shape with `--allow-all-tools` and no authority preamble. These paths require operator confirmation per dispatch (which is itself a Gate-3-equivalent guard), so the v1.0.2 pathology does not surface there. Symmetry follow-up: a future packet can port the helper to those two files for uniformity.
2. **Workflow-state resolution is the helper's hard dependency.** `buildCopilotPromptArg` cannot infer authority from anywhere except its `targetAuthority` argument. If a future workflow forgets to pass `{spec_folder}` through to the cli-copilot dispatch step, the helper safely falls back to `kind:"missing", writeIntent:true` (Gate-3 enforcement). That is the correct safe-fail, but it means the helper does NOT and CANNOT recover from upstream workflow bugs by itself.
3. **Live-dispatch verification deferred to next deep-research / deep-review run.** The vitest suite exercises the helper directly; the YAML wire-in is tested by code review and grep. End-to-end live-dispatch evidence is collected on the next run that exercises cli-copilot. Tracked as a P2 item in `checklist.md` and as T303 in `tasks.md`.
4. **`dist/` rebuild not strictly required.** The YAML uses `--experimental-strip-types` to load TS directly from `lib/`. If any consumer ships from `mcp_server/dist/`, run `tsc -b` to refresh the compiled artifact for parity. None of this packet's changes require the rebuild.
<!-- /ANCHOR:limitations -->

---

### Next Steps

1. **Operator review** of helper signature, behavior matrix, YAML wiring, vitest coverage, and packet docs. Tracked as T301 in `tasks.md`.
2. **Commit packet + code changes** as a single atomic change. Parent session handles git per the user's directive.
3. **Live cli-copilot dispatch verification** on the next deep-research or deep-review run that exercises cli-copilot. Confirm the `## TARGET AUTHORITY` preamble appears in state_paths.prompt_dir/iteration-NNN.md (or in the rendered argv if the YAML logs it) and that ZERO unauthorized folder mutations occur. Tracked as T303 in `tasks.md` and as a P2 item in `checklist.md`.
4. **Optional follow-up packet** to port `buildCopilotPromptArg` into `spec_kit_deep-research_confirm.yaml` and `spec_kit_deep-review_confirm.yaml` for symmetry. Out of scope here; flagged in Known Limitations §1 above.

---

### Post-Review Fixes (2026-04-27)

The packet's review-report.md (Copilot CLI gpt-5.5 high) flagged 4 P1 items. The out-of-scope working-tree finding is a known false-positive — the user runs multiple parallel tracks as baseline state. The other three were addressed in this fix-up pass.

### Fix 1 — Tighten YAML guards against literal-template / whitespace / undefined "approved" authority

**Problem:** The `_auto.yaml` guards only rejected empty/`null`. Literal `{spec_folder}` placeholders, whitespace-only strings, and `"undefined"`/`"None"`/`"{}"` sentinels were treated as `kind:"approved"` and preserved `--allow-all-tools`.

**Resolution:** Added `validateSpecFolder(value: unknown): string | null` in `executor-config.ts` as the single source of truth. It rejects: non-string, empty, whitespace-only, literal-template (`/^\{[^}]+\}$/`), `undefined`/`null`/`none`/`{}`/`nan`/`[object Object]` (case-insensitive), and any string with control characters. `buildCopilotPromptArg` now revalidates `targetAuthority.specFolder` at the top of the function; on rejection, it coerces to `{ kind: 'missing', writeIntent: true }` (preserves write-intent semantics on the safe-fail). The two YAML call sites were simplified — they now hand `'{spec_folder}'` directly to the helper without their own pre-checks, eliminating the duplicate (and incomplete) validation.

### Fix 2 — Authority preamble in `@PROMPT_PATH` wrapper file body

**Problem:** For prompts over 16KB, `buildCopilotPromptArg` previously used an inline preamble + `@path` reference in argv but did NOT modify the prompt file at `promptPath`. Recovered/bootstrap folder mentions inside the file could still anchor Copilot.

**Resolution:** Added `promptFileBody?: string` to `BuildCopilotPromptArgResult`. When approved authority + over-threshold: `promptFileBody = <preamble>\n\n---\n\n<original prompt>` and `argv[promptArgIndex] = '@${promptPath}'` (no inline preamble — the file itself opens with the authority block). The two YAML call sites now `writeFileSync(promptPath, built.promptFileBody, 'utf8')` whenever `built.promptFileBody !== undefined`, ensuring the file Copilot reads via `@path` carries the authority preamble. Read-only `@path` fallback and the small-prompt path are unchanged.

### Fix 3 — I1-replay zero-mutation test

**Problem:** Research §3.5 bullet 4 required a test for "An I1-style 'save the context for this conversation' replay performs no mutation when target authority is missing." The original suite covered argv/preamble transformations only.

**Resolution:** Added a new describe block ("I1-style zero-mutation replay") with two test cases. The first builds an I1-pattern prompt with a recovered-context spec folder mention (`004-retroactive-phase-parent-migration`) plus the literal "save the context for this conversation" line, dispatches with `targetAuthority: { kind: 'missing', writeIntent: true }`, and asserts: `enforcedPlanOnly === true`, `argv` excludes `--allow-all-tools`, the original write-intent prompt is dropped, the recovered-context folder name does NOT appear in the rendered prompt body, and `promptFileBody` is undefined. The second covers the large-prompt + malformed-approved combo (simulates YAML template-resolution failure at @PATH scale) — confirms the helper safe-fails to Gate-3 even when the prompt would normally trigger wrapper-mode.

### Files Modified (Post-Review)

| File | LOC delta | Purpose |
|------|-----------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | +60 / -10 | Add `validateSpecFolder` + reject sets + placeholder pattern; revalidate authority at top of `buildCopilotPromptArg`; emit `promptFileBody` on approved+over-threshold; argv becomes bare `@${promptPath}` in that branch |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | +14 / -6 | Drop YAML pre-validation; pass `specFolderRaw` directly to helper; write `promptFileBody` to disk when set; +1 explanatory note |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | +14 / -6 | Same as deep-research |
| `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | +175 / -10 | 16 new test cases (29 total, up from 13): wrapper-mode `promptFileBody` (3 cases), specFolder validation (12 cases for the malformed/whitespace/control-char matrix + regression + trim guards), I1-replay zero-mutation (2 cases) |

### Verification

- `mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` — Tests 29 passed (29); exit 0
- `mcp_server/tests/deep-loop/executor-config.vitest.ts` — Tests 24 passed (24); exit 0
- Combined surface — Tests 53 passed (53); exit 0; 218ms
- No deviations from the directive.

### Out-of-scope finding (false positive)

The reviewer's #4 P1 (working-tree carries packet 013–015 + code-graph edits) is a known false-positive per project memory feedback_worktree_cleanliness_not_a_blocker.md. The user runs multiple parallel tracks as baseline state; worktree cleanliness is never a blocker. Not addressed in this fix-up.
