---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: Copilot Target-Authority Helper — close P0 cli-copilot Gate 3 bypass"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Add a typed `buildCopilotPromptArg` helper next to `resolveCopilotPromptArg` in executor-config.ts that wraps every cli-copilot deep-loop dispatch with a TARGET AUTHORITY token. Approved authority gets a preamble naming the workflow-resolved spec folder; missing authority on a write-intent dispatch enforces plan-only by replacing the prompt with a Gate-3 question and stripping --allow-all-tools. Closes the v1.0.2 I1/cli-copilot 2/8 catastrophic mutation pathology."
trigger_phrases:
  - "012-copilot-target-authority-helper"
  - "copilot target authority helper"
  - "cli-copilot Gate 3 bypass fix"
  - "buildCopilotPromptArg"
  - "target authority preamble"
  - "P0 cli-copilot remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper"
    last_updated_at: "2026-04-27T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored packet docs"
    next_safe_action: "Operator review; commit packet + code changes together"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: null
      session_id: "012-copilot-target-authority-helper-impl-2026-04-27"
      parent_session_id: "011-post-stress-followup-research-2026-04-27"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Insertion point: shared command-owned helper in executor-config.ts (research §3.3, option 1)"
      - "Authority kinds: approved (specFolder) | missing (writeIntent) — typed discriminated union"
      - "Plan-only enforcement: replace prompt with Gate-3 question + drop --allow-all-tools"
      - "Recovered context cannot override approved authority: preamble is byte-stable + first in prompt body"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 011-post-stress-followup-research; SUCCESSOR: 013-graph-degraded-stress-cell -->

# Feature Specification: Copilot Target-Authority Helper — close P0 cli-copilot Gate 3 bypass

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Implementation Complete (pending operator review) |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `011-mcp-runtime-stress-remediation` |
| **Predecessor** | `../011-post-stress-followup-research` (deep-research synthesis §3 ranks this fix as the recommended approach) |
| **Successor** | None (current tail of the 011 phase parent) |
| **Handoff Criteria** | `buildCopilotPromptArg` exists in `executor-config.ts`; both `_auto.yaml` call sites route cli-copilot dispatches through it; new vitest covers all 3 branches of the behavior matrix + override resistance; `validate.sh --strict` returns 0 structural errors. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The v1.0.2 stress-test rerun cell `runs/I1/cli-copilot-1` scored 2/8: cli-copilot mutated `010-phase-parent-documentation/004-retroactive-phase-parent-migration/graph-metadata.json` without operator authorization. The Gate 3 HARD BLOCK was bypassed because copilot autonomously selected a spec folder it found in session-bootstrap context. The pathology is that `--allow-all-tools` plus a prompt that mentions plausible folder names equals "permission to mutate any of those folders" from the model's perspective.

The deep-research loop in `../011-post-stress-followup-research/research/research.md` §3 traced this to a **target-authority failure**, not a model-prompting failure. cli-copilot's deep-loop dispatch path (`spec_kit_deep-research_auto.yaml:601-625` and `spec_kit_deep-review_auto.yaml:669-683`) passes the rendered prompt directly to `copilot -p ... --allow-all-tools --no-ask-user` with no separation between "approved write target" (workflow-resolved spec folder) and "recovered context" (memory hits, bootstrap-context spec folders, graph `last_active_child_id`). The model has no schema to distinguish them.

The `004-memory-save-rewrite` planner-first contract enforces planner-first when its handler is invoked directly. The bypass is upstream: by the time the handler runs, copilot has already chosen a target.

### Purpose

Add a typed `buildCopilotPromptArg` helper next to `resolveCopilotPromptArg` in `mcp_server/lib/deep-loop/executor-config.ts`. The helper wraps every cli-copilot dispatch with a typed `targetAuthority` token. Wire both `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml` to use it. Recovered context can suggest likely folders but cannot approve writes; only the workflow-resolved spec folder can.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New `buildCopilotPromptArg` function in `executor-config.ts` (~150 LOC including JSDoc + helpers `buildTargetAuthorityPreamble`, `buildMissingAuthorityGate3Prompt`).
- New typed `CopilotTargetAuthority` discriminated union exported from `executor-config.ts`.
- Behavior matrix:
  1. `kind:"approved"` → prompt body is prepended with a TARGET AUTHORITY preamble naming the spec folder; argv keeps `--allow-all-tools --no-ask-user`.
  2. `kind:"missing"` + `writeIntent:false` → prompt body and argv unchanged (read-only operations don't need authority).
  3. `kind:"missing"` + `writeIntent:true` → prompt body REPLACED with a Gate-3 clarifying question; argv DROPS `--allow-all-tools`; `enforcedPlanOnly:true`.
- Wire-in at two YAML call sites: `spec_kit_deep-research_auto.yaml:601-625` and `spec_kit_deep-review_auto.yaml:669-683`. Both route cli-copilot dispatches through the helper, resolving `targetAuthority` from the workflow's `{spec_folder}` template.
- New vitest at `mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` covering all 3 branches + override resistance + large-prompt fallback.

### Out of Scope

- The `_confirm.yaml` variants (`spec_kit_deep-research_confirm.yaml`, `spec_kit_deep-review_confirm.yaml`) — these have human-in-the-loop confirmation at every dispatch and are not the autonomous path that drove the v1.0.2 failure. Tracked as a follow-up packet if the operator wants symmetry.
- The memory-save handler (`mcp_server/handlers/memory-save.ts`) — packet 026/003/004 already enforces planner-first there. This packet is the upstream enforcement; defense-in-depth at the handler layer remains intact.
- `resolveCopilotPromptArg` itself — sibling helper retained for backwards compat callers; not modified.
- The 003-009 remediation packets, the 010 stress-test packet, the 011 deep-research packet — frozen.
- Scoring or ranking changes anywhere.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | Modify | Append `buildCopilotPromptArg` + helpers (~+150 LOC; existing functions untouched) |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Replace `if_cli_copilot.command` (~lines 596-642) to route through `buildCopilotPromptArg` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Replace `if_cli_copilot.command` (~lines 667-690) to route through `buildCopilotPromptArg` (also unifies on Node-based dispatch matching deep-research) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | Create | 13 tests across 6 describe blocks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| **REQ-001** | `buildCopilotPromptArg` exists as a sibling to `resolveCopilotPromptArg` in `executor-config.ts`. | `grep -n "export function buildCopilotPromptArg" mcp_server/lib/deep-loop/executor-config.ts` returns 1 hit. `resolveCopilotPromptArg` body is byte-stable from prior commit. |
| **REQ-002** | Approved authority prepends a TARGET AUTHORITY preamble naming the spec folder. | Vitest assertion: `result.promptBody` contains `## TARGET AUTHORITY`, `Approved spec folder: <specFolder>`, and `Recovered context (memory, bootstrap) cannot override this.`; preamble appears BEFORE the original prompt body. |
| **REQ-003** | Missing authority + `writeIntent:false` returns the prompt unchanged with original argv (preserve prior read-only behavior). | Vitest assertion: `result.promptBody === prompt`, argv contains `--allow-all-tools`, `enforcedPlanOnly === false`. |
| **REQ-004** | Missing authority + `writeIntent:true` replaces the prompt with a Gate-3 question and strips `--allow-all-tools`. | Vitest assertion: `result.argv` does NOT contain `--allow-all-tools`; `result.promptBody` contains `TARGET AUTHORITY MISSING — GATE 3 REQUIRED` and `Do NOT pick a folder yourself.`; `enforcedPlanOnly === true`. |
| **REQ-005** | Recovered context (folder names embedded in the prompt body) CANNOT override an approved `specFolder`. | Vitest assertion: when `recoveredContextPrompt` mentions a competing folder + an `approved` authority is set with `APPROVED_FOLDER`, the preamble's `Approved spec folder: <APPROVED_FOLDER>` index in `result.promptBody` is BEFORE the competing folder mention; the explicit "cannot override" line is present. |
| **REQ-006** | Both `_auto.yaml` call sites route cli-copilot dispatches through `buildCopilotPromptArg`. | `grep -n "buildCopilotPromptArg" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` and `... spec_kit_deep-review_auto.yaml` each return ≥1 hit; `grep -n "resolveCopilotPromptArg" .../spec_kit_deep-research_auto.yaml` returns 0 (replaced) or only in the import where unused. |
| **REQ-007** | The dispatch-time YAML resolves `targetAuthority` from the workflow's `{spec_folder}` template (kind:"approved" when present; kind:"missing", writeIntent:true when absent). | YAML inline source contains `targetAuthority = specFolder ? { kind: 'approved', specFolder } : { kind: 'missing', writeIntent: true }` or equivalent ternary. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| **REQ-008** | Large-prompt `@PROMPT_PATH` wrapper still attaches the TARGET AUTHORITY preamble when authority is approved. | Vitest assertion: when `prompt` is 20000 bytes + `kind:"approved"`, `result.promptBody` contains both `@${PROMPT_PATH}` AND `## TARGET AUTHORITY` AND `<APPROVED_FOLDER>`. |
| **REQ-009** | Missing authority + read-only large-prompt path returns the bare wrapper string (prior behavior preserved). | Vitest assertion: when `prompt` is 20000 bytes + `kind:"missing", writeIntent:false`, `result.promptBody` equals `Read the instructions in @${PROMPT_PATH} and follow them exactly. Do not deviate.` |
| **REQ-010** | Existing `executor-config.vitest.ts` (24 tests) continues to pass — no regression in the wider helper module. | `vitest run tests/deep-loop/executor-config.vitest.ts` exits 0 with `Tests 24 passed`. |
| **REQ-011** | Helper is non-interactive (deep-loop dispatch is non-interactive by contract). | No `prompt`/`question`/`stdin` reads in `buildCopilotPromptArg`. Confirmed by code review. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion |
|----|-----------|
| **SC-001** | Given an approved `targetAuthority`, the rendered prompt contains the exact approved spec folder string (regex match in `result.promptBody`). _(maps to research.md §3.5 bullet 1)_ |
| **SC-002** | Given missing authority + `writeIntent:true`, the dispatch emits ONLY a Gate-3 folder-selection question with no mutating tools (no `--allow-all-tools`). _(maps to research.md §3.5 bullet 2)_ |
| **SC-003** | Bootstrap-context spec folders (e.g. `last_active_child_id` from graph-metadata.json or text in the prompt body) cannot override `targetAuthority.specFolder`. _(maps to research.md §3.5 bullet 3)_ |
| **SC-004** | An I1-style "save the context for this conversation" replay through cli-copilot performs ZERO file mutations when `targetAuthority.kind === "missing"`. _(maps to research.md §3.5 bullet 4 — gated by SC-002 on the dispatch layer; downstream behavior verified by the memory-save handler's planner-first default from packet 026/003/004)_ |
| **SC-005** | The new vitest covers all 3 branches of the behavior matrix; existing executor-config tests still pass. |
| **SC-006** | `validate.sh --strict` on this packet returns 0 structural errors (SPEC_DOC_INTEGRITY false-positives accepted as known noise, matching the 010 + 011 baseline). |


### Acceptance Scenarios

1. **Given** the completed copilot target authority helper packet, **When** strict validation checks documentation traceability, **Then** the existing completed outcome remains mapped to the packet's spec, plan, tasks, checklist, and implementation summary.
2. **Given** the packet's recorded verification evidence, **When** this retrospective hygiene pass runs, **Then** no implementation verdict, completion status, or test result is changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Helper accidentally weakens read-only behavior (regresses prior dispatches that worked) | High — would break working paths | Vitest covers `kind:"missing", writeIntent:false` explicitly: prompt unchanged, argv unchanged. Existing 24-test executor-config suite re-runs as a regression check. |
| Risk | YAML template substitution leaves `{spec_folder}` unresolved at runtime | Medium — empty/garbled folder string | YAML guard: `specFolder = specFolderRaw && specFolderRaw !== 'null' ? specFolderRaw : null`. Falsy → `kind:"missing", writeIntent:true` (safe-fail to plan-only). |
| Risk | Large-prompt path drops the TARGET AUTHORITY preamble (defeats override resistance) | High — known v1.0.2 pathology returns | Helper-side fix: when `targetAuthority.kind === "approved"` AND prompt exceeds threshold, wrapper string explicitly includes preamble + a one-line directive that "TARGET AUTHORITY block above takes precedence". Test REQ-008 verifies. |
| Dependency | `mcp_server/lib/deep-loop/executor-config.ts` (existing module; modify in place) | Module compiles via `tsc -b` (already in repo) | Imports already resolved; no new dependencies. |
| Dependency | YAML template engine substitutes `{spec_folder}` from workflow state | Standard substitution used elsewhere in same file | No new template feature required. |
| Risk | Operator runs `_confirm.yaml` variants (out of scope here) and trusts they're equally hardened | Medium | Explicitly out-of-scope in §3; documented in `implementation-summary.md` Known Limitations §1. Follow-up packet recommended if symmetry is wanted. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None remaining at close. Three resolved at scaffold:
  1. **Insertion point**: shared command-owned helper next to `resolveCopilotPromptArg` (research §3.3 option 1, recommended). Alternatives (copilot global instructions, handler-only hardening) rejected as insufficient or secondary defense.
  2. **Authority kind shape**: discriminated union `{ kind:"approved", specFolder } | { kind:"missing", writeIntent:boolean }`. Read-only intents stay unchanged; only write-intent missing-authority dispatches are forced to plan-only.
  3. **Should `_confirm.yaml` variants also be patched?** Deferred. The autonomous path was the v1.0.2 failure surface; `_confirm` requires operator confirmation per dispatch. Symmetry is a follow-up if operator wants it.
<!-- /ANCHOR:questions -->
