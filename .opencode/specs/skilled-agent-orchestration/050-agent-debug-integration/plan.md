---
title: "Implementation Plan: Debug Agent Integration — Truth-Up & Discoverability"
description: "Two-phase implementation: (A) rewrite aspirational auto-dispatch claims across 4 runtime debug definitions + orchestrator + 2 YAML configs, and (B) replace the buried A/B/C/D failure-threshold menu with a direct y/n/skip prompt that pre-fills a debug-delegation.md scaffold on opt-in."
trigger_phrases:
  - "debug integration plan"
  - "edit a edit b"
  - "failure prompt rewrite"
  - "scaffold generator"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/050-agent-debug-integration"
    last_updated_at: "2026-04-27T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted plan.md edit-by-edit walkthrough"
    next_safe_action: "Draft tasks.md with concrete T### items"
    blockers: []
    key_files:
      - ".opencode/agent/debug.md"
      - ".opencode/agent/orchestrate.md"
      - ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml"
      - ".opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-04-27-debug-integration"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Debug Agent Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML + TOML (no runtime code change). Bash/Node only for the optional scaffold-generator helper. |
| **Framework** | None — direct file edits using Edit tool. |
| **Storage** | None — file system only. |
| **Testing** | Manual rehearsal via synthetic 3-failure throwaway spec; static greps for forbidden phrases; `validate.sh --strict` for spec folder docs. |

### Overview
This is a documentation-truthing pass plus a small UX upgrade to an existing prompt. **Edit A** rewrites every "auto-dispatch" / "Task tool dispatches" claim across four runtime agent definitions (`.opencode/agent/debug.md`, `.claude/agents/debug.md`, `.codex/agents/debug.toml`, `.gemini/agents/debug.md`), the orchestrator (`.opencode/agent/orchestrate.md`), and the two implementation YAML configs (`spec_kit_implement_auto.yaml`, `spec_kit_complete_auto.yaml`) so the descriptions match the real (user-invoked, prompted-offer) behavior. **Edit B** replaces the buried A/B/C/D failure-threshold menu with a single `y / continue manually / skip` prompt, and on `y` writes a pre-filled `debug-delegation.md` scaffold using the Debug Context Handoff schema. No autonomous routing is introduced.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see spec.md §2-§3)
- [x] Success criteria measurable (see spec.md §5)
- [x] Dependencies identified — only `.opencode/agent/debug.md:60-89` schema and `validate.sh --strict`; both exist today
- [x] User constraint resolved — no auto-dispatch, period

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001 through REQ-005)
- [ ] All P1 acceptance criteria met or user-approved deferral (REQ-006 through REQ-008)
- [ ] Synthetic 3-failure rehearsal exercises y / continue / skip branches successfully
- [ ] `validate.sh --strict` passes on the spec folder
- [ ] Manual-testing playbook entry written
- [ ] `implementation-summary.md` filled in post-impl with file-level evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Documentation-rewrite + thin scaffold generator.** No new modules, no new dispatch surfaces. The scaffold generator is a small helper (likely Bash or a Node CLI) that reads recent-failure metadata from the workflow's running state and emits a Markdown file populated with the Debug Context Handoff schema.

### Key Components
- **Runtime agent definitions (×4)**: `.opencode/agent/debug.md`, `.claude/agents/debug.md`, `.codex/agents/debug.toml`, `.gemini/agents/debug.md` — same content, three formats. Edits mirrored across all four.
- **Orchestrator**: `.opencode/agent/orchestrate.md` — single source of truth for routing prose. Affected lines: 99 (priority routing table), 492 (REASSIGN step), 537-539 (Debug Delegation Trigger), 595 (debug delegation row in routing lookup), 461 (debug.md Related Resources table — actually inside debug.md, not orchestrate.md).
- **Workflow YAML configs (×2)**: `spec_kit_implement_auto.yaml`, `spec_kit_complete_auto.yaml` — the prompt and `failure_tracking` metadata that operators see at the threshold.
- **Scaffold generator**: New small helper. Inputs: spec folder path, last 3 failure entries (error message, file, attempt summary). Output: `<spec-folder>/debug-delegation.md` populated with handoff fields. Versioned filename if a prior scaffold exists.

### Data Flow
1. Implementation workflow tracks `task_failure_count` (already declared in YAML metadata, just needs to actually be incremented or recognized as a prompt-threshold marker).
2. On `task_failure_count >= 3`, the workflow surfaces a single prompt: `"Hit 3 task failures on <packet>. Dispatch @debug for fresh-perspective root-cause? (y / continue manually / skip)"` plus a one-line summary of what `@debug` would do and the cost (one Task-tool call, isolated context, no nested delegation).
3. **`y` path**: Run the scaffold generator → write `debug-delegation.md` → tell user "Scaffold ready at <path>; opt-in to dispatch `@debug` via Task tool with this handoff." User then makes the Task tool call themselves.
4. **`continue manually` path**: Workflow proceeds without scaffold or dispatch; failure counter is NOT reset (still tracks toward future prompts).
5. **`skip` path**: Failing task is skipped per existing semantics; failure counter resets per existing `reset_on: "new_task"` rule.

**Important**: At no point does the workflow itself call `Task tool → @debug`. The user retains explicit control over agent dispatch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & Drift Audit
- [ ] Diff-check the four runtime debug definitions against each other to establish a parity baseline (so the rewrite preserves semantic parity).
- [ ] Verify the actual line numbers in each target file (deep dive supplied approximate line numbers; the rewrite must use the real ones).
- [ ] Confirm `validate.sh --strict` passes on the empty-but-now-populated spec folder before edits begin.

### Phase 2: Edit A — Truth-Up Aspirational Claims

**A.1 — `.opencode/agent/debug.md`** (lines 3, 24, 461)
- L3 description: `"User-invoked fresh-perspective debugging specialist. Surfaced as a prompted offer when an implementation workflow detects ≥3 task failures, or invoked explicitly by the user via the Task tool."`
- L24 lead: same semantic rewrite, expanded to a sentence that emphasizes user-opt-in and the structured handoff requirement.
- L461 Related Resources table row: `"orchestrate"` relationship changes from `"Dispatches debug after 3 failures"` to `"Prompts user to dispatch debug after 3 failures (user opts in)"`.

**A.2 — `.opencode/agent/orchestrate.md`** (lines 99, 492, 537-539, 595)
- L99 priority routing row: rewrite the cell to `"Debugging when failure_count >= 3, prompted via the workflow and dispatched by the user via Task tool"`.
- L492 REASSIGN step: rewrite the second clause from `"or dispatch @debug via Task tool when failure_count >= 3"` to `"or surface a prompted offer to dispatch @debug via Task tool when failure_count >= 3 (user opts in; orchestrator does not auto-dispatch)"`.
- L537-539 Debug Delegation Trigger: insert "and prompt the user" after "prepare a diagnostic summary." Drop the `"and dispatch"` language.
- L595 routing-lookup row: same wording change as L99.

**A.3 — `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`** (lines 210-217, 411-413)
- L212 condition: from `"ONLY dispatch when failure_count >= 3..."` to `"ONLY surface a prompted offer when failure_count >= 3..."`.
- L215 metadata: rename `failure_tracking` → `prompt_threshold` (or annotate inline as `"prompt threshold; never auto-routes"`).
- L216 on_threshold: rewrite from the buried A/B/C/D suggestion to `"Surface a single y/n/skip prompt; on y, generate debug-delegation.md scaffold and instruct user to dispatch @debug via Task tool."`
- L411-413 `debug_delegation.action`: replace with the new prompt block (see Edit B below).

**A.4 — `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`** (lines 321-328, 898-910)
- Mirror A.3 changes at L321-328.
- L898-910 `debug_escalation` block (the actual A/B/C/D menu in this file): replace with the same y/n/skip prompt format from Edit B.

**A.5 — Sibling runtime mirrors**
- `.claude/agents/debug.md` line 3: mirror the OpenCode description rewrite verbatim (same Markdown format).
- `.codex/agents/debug.toml` line 11 (inside `developer_instructions = '''...'''`): mirror the description rewrite, keeping the TOML triple-quote escaping intact.
- `.gemini/agents/debug.md` line 3: mirror the OpenCode description rewrite verbatim.

### Phase 3: Edit B — Prompt Visibility & Scaffold Generation

**B.1 — Prompt rewrite** (`spec_kit_implement_auto.yaml:411-413` and `spec_kit_complete_auto.yaml:898-910`)
- New prompt body:
  ```
  ⚠️  3 task failures on <packet>. The @debug agent runs a 5-phase fresh-perspective root-cause pass with no prior context — it costs one Task-tool dispatch and writes findings to a structured report.
  Dispatch @debug? (y / continue manually / skip)
  ```
- On `y`: run scaffold generator (B.2), then surface a one-line confirmation with the scaffold path and a Task-tool invocation example for the user to copy.
- On `continue manually`: log "user declined debug at threshold N", proceed with existing manual flow, do not reset counter.
- On `skip`: per existing skip semantics, reset failure counter.

**B.2 — Scaffold generator**
- Add a Bash or small Node helper (likely under `.opencode/skill/system-spec-kit/scripts/spec/` since other one-shot helpers live there). Suggested path: `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` (Bash for parity with `create.sh`, `validate.sh`).
- Inputs (CLI args): `--spec-folder <path>` `--errors <json-array>` (or `--errors-file <path>`).
- Output: `<spec-folder>/debug-delegation.md` populated from the `debug-delegation.md` template under `.opencode/skill/system-spec-kit/templates/`, filling the Error Description, Files Involved, Reproduction Steps, Prior Attempts, and Environment sections.
- Versioning: if `debug-delegation.md` already exists, write `debug-delegation-002.md`, then `-003.md`, etc.
- Schema parity: scaffold must populate the exact section headers from `.opencode/agent/debug.md:60-89` so the agent's "If handoff is incomplete" check passes on dispatch.

**B.3 — YAML wiring**
- Insert the scaffold-generator invocation into both YAML files at the y-branch of the prompt.
- Ensure no Task-tool invocation is added to the YAML — the user dispatches `@debug` themselves after the scaffold lands.

### Phase 4: Verification
- [ ] Manual rehearsal: throwaway spec folder, 3 deliberately-failing tasks, run `spec_kit:implement`, observe that the new prompt fires, opt in with `y`, verify scaffold lands, verify NO `@debug` was auto-invoked.
- [ ] Repeat rehearsal with `continue manually` — verify clean continuation, no scaffold.
- [ ] Repeat with `skip` — verify clean skip, no scaffold.
- [ ] Static checks: grep for forbidden phrases (`auto-dispatch`, `Task tool dispatches a focused`) across all modified files; expect zero matches.
- [ ] `validate.sh --strict` on the spec folder.
- [ ] Drift check: side-by-side diff of the four runtime descriptions for semantic parity.
- [ ] Manual-testing playbook entry written.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static grep | Forbidden phrases removed across all 9 modified files | `grep -rn` |
| Static schema parity | Scaffold output sections match Debug Context Handoff schema lines 60-89 | `diff -u <(awk on schema) <(awk on scaffold output)` |
| Manual rehearsal — y branch | Synthetic 3-failure flow → prompt fires → `y` → scaffold lands → no auto-dispatch | Throwaway `specs/099-debug-rehearsal/` |
| Manual rehearsal — manually branch | Same setup → `continue manually` → no scaffold, no dispatch, counter not reset | Same |
| Manual rehearsal — skip branch | Same setup → `skip` → no scaffold, counter resets per existing reset_on rule | Same |
| `validate.sh --strict` | Spec folder template compliance | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Diff parity check | Four runtime debug descriptions semantically aligned | Side-by-side diff after edits |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Debug Context Handoff schema (`.opencode/agent/debug.md:60-89`) | Internal | Green | Scaffold generator depends on this schema; if it changes mid-impl, regenerate scaffold to match. |
| `validate.sh --strict` script | Internal | Green | Required for REQ-007. |
| `.opencode/skill/system-spec-kit/templates/debug-delegation.md` template | Internal | Green | Scaffold generator copies from here; verify-only step in Phase 1 confirms parity. |
| `task_failure_count` counter in workflow runtime | Internal | **Yellow — verify** | The YAML metadata declares this counter, but the deep dive confirmed no executable code maintains it. Phase 1 must verify whether the existing failure-detection branch in `implement_auto.yaml:411-413` actually fires today; if not, this packet may need to add a small counter increment in the YAML interpreter. **This is a known UNKNOWN** and may expand scope by ~30 LOC. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Operators report that the new prompt is more disruptive than the old menu, OR the scaffold generator produces malformed output that confuses `@debug` on dispatch.
- **Procedure**: `git revert` the implementation commit. The four runtime descriptions revert to their (aspirational but harmless) prior text. The buried A/B/C/D menu returns. No persistent state to clean up.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Edit A) ──► Phase 3 (Edit B) ──► Phase 4 (Verify)
                       │                       │
                       └─ both phases write to YAML; sequence within Phase 2 (A.3, A.4) before Phase 3 (B.1)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | All other phases |
| Edit A | Setup | Edit B (B.1 modifies the same lines as A.3/A.4) |
| Edit B | Edit A | Verify |
| Verify | Edit A + Edit B | Done |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup & drift audit | Low | 30-45 min |
| Edit A (truth-up across 9 files) | Medium | 1.5-2 hours |
| Edit B (prompt rewrite + scaffold generator + YAML wiring) | Medium | 2-3 hours |
| Verification (static + manual rehearsal × 3 branches) | Low-Medium | 1-1.5 hours |
| **Total** | | **5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup current debug.md / orchestrate.md / both YAMLs before edits (git is enough; no file copies needed)
- [ ] Throwaway rehearsal spec folder ready under `specs/099-debug-rehearsal/`
- [ ] `validate.sh` baseline run captured

### Rollback Procedure
1. `git revert <impl-commit-sha>` — restores all 9 files at once.
2. Delete the new scaffold-generator script if it landed (`.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`).
3. Delete the manual-testing playbook entry for this packet.
4. Run `validate.sh --strict` on the spec folder to confirm no spec-doc damage.
5. Document the revert in this packet's `decision-record.md` if a Level 3 escalation becomes necessary.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
Plan v2.2 / Level 2.
Scope: 9 files modified, 1 new helper script, ~280 LOC delta.
Hard constraint: NO autonomous routing to @debug under any condition.
-->
