# Workflow Correctness Release-Readiness Review

## 1. Executive Summary

**Verdict: FAIL.** The canonical command surface is not release-ready because `/memory:manage delete` documents a confirmation hard stop, but the backing `memory_delete` single-record path can delete by `id` without a tool-level confirmation. That is a live data-loss bypass, so it is P0.

Active findings: **P0: 1**, **P1: 3**, **P2: 1**. The main P1 risks are mode drift in auto workflows, absent memory YAML assets for the requested contract surface, and a contradictory `/memory:save` default contract.

Scope audited:

- `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:complete`, `/spec_kit:resume`
- `/memory:save`, `/memory:search`, `/memory:manage`
- Backing destructive MCP tool schemas and handlers where command gates depend on them

## 2. Verdict

| Field | Value |
|-------|-------|
| Verdict | **FAIL** |
| hasAdvisories | true |
| Release readiness | release-blocking |
| Primary blocker | P0-001 single-record `memory_delete` lacks enforced confirmation |
| Required pre-release work | P0-001, P1-001, P1-002, P1-003 |

Rationale: P0 remains active. Even if an operator follows `/memory:manage` correctly, the release surface includes the underlying MCP tool path, and that path accepts a destructive single-record delete without the same safety token required by bulk delete and checkpoint delete.

## 3. Findings Registry

### P0-001: Single-record `memory_delete` can bypass the documented `/memory:manage delete` confirmation gate

**Impact:** A spec-doc record can be deleted by ID through the backing tool without the documented `/memory:manage delete` user confirmation. This is a direct data-loss path and blocks release.

**Evidence:**

- `.opencode/command/memory/manage.md:567` through `.opencode/command/memory/manage.md:577` documents a confirmation gate and hard stop before deletion.
- `.opencode/command/memory/manage.md:613` through `.opencode/command/memory/manage.md:615` then calls `spec_kit_memory_memory_delete({ id: <id> })`, with no confirmation field in the call.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:281` through `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:290` defines `memory_delete` so `id` alone satisfies single-delete mode, while `confirm` is only described as a safety gate when provided.
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:258` through `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:266` states branch 1 requires only `id`; branch 2 requires `specFolder + confirm:true`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:71` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:74` enforces `confirm` only for spec-folder bulk delete.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:99` deletes the single record when `numericId` is present.
- Control comparison: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:76` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:78` rejects bulk delete without `confirm:true`, and `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:580` through `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:584` requires `confirmName` for checkpoint deletion.

**Fix:** Require `confirm:true` for all `memory_delete` mutations, including single-record `id` deletion. For protected tiers, add a stronger `confirmTitle` or equivalent typed confirmation field. Update `/memory:manage delete` to call the tool with the same field and add tests for `id` without confirmation being rejected.

---

### P1-001: Auto SpecKit modes still contain user waits and confirmation pauses

**Impact:** Auto mode is not reliably autonomous. A release operator can invoke an auto workflow and still hit user waits, which violates the mode contract and creates copy-paste drift between auto and confirm variants.

**Evidence:**

- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:24` through `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:27` declares autonomous execution with no approvals.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:616` through `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:623` adds a final user-response handover prompt whose default is to wait for user response.
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:12` through `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:16` declares autonomous execution with no approvals.
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:547` contains closeout activities that display a prompt and wait for response.
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:592` says `do_not_prompt_for_user_approval`, contradicting the wait above.
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:23` through `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:29` declares autonomous execution with no approvals.
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:30` through `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:34` says checkpoints still pause for confirmation after optional workflows.
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1080` through `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1082` explicitly sets `pause_for_confirmation: true` in autonomous behavior.

**Fix:** Move all approval waits to confirm variants. In auto variants, convert closeout prompts to non-blocking status output or deterministic defaults. Keep only true safety stops, such as low-confidence or failed-validation stops, and label those as failure/escalation gates rather than approval checkpoints.

---

### P1-002: `/memory:*` commands have no YAML asset contracts, so parity and INIT binding checks cannot be validated consistently

**Impact:** The release-readiness surface names markdown plus YAML contracts for `/memory:save`, `/memory:search`, and `/memory:manage`, but the repository has markdown-only memory commands. That means auto/confirm parity, INIT `preflight_contract`, and orphan-branch validation cannot be enforced using the same machinery as `/spec_kit:*`.

**Evidence:**

- `.opencode/command/memory/save.md:120` through `.opencode/command/memory/save.md:128` defines the `/memory:save` contract inline in markdown, including its script and trigger.
- `.opencode/command/memory/search.md:65` through `.opencode/command/memory/search.md:75` defines an inline YAML-like operating mode block, not an external `assets/memory_search_*.yaml` workflow.
- `.opencode/command/memory/manage.md:37` through `.opencode/command/memory/manage.md:44` defines an inline YAML-like operating mode block, not an external `assets/memory_manage_*.yaml` workflow.
- `.opencode/command/spec_kit/plan.md:13` through `.opencode/command/spec_kit/plan.md:19` shows the contrasting SpecKit command pattern: first action is to load an external YAML asset and execute it step by step.
- Prior matrix context: `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md:25` through `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md:38` shows memory and workflow executor coverage is already conditional or blocked across non-native surfaces.

**Fix:** Either create `memory_save_{auto,confirm}.yaml`, `memory_search_{auto,confirm}.yaml`, and `memory_manage_{auto,confirm}.yaml` with explicit INIT/preflight contracts, or update the canonical command contract to declare memory commands markdown-only and add a validator that checks inline markdown workflows for required bindings and destructive gates.

---

### P1-003: `/memory:save` simultaneously claims plan-only default behavior and mandatory `generate-context.js` execution

**Impact:** Operators and agents can follow different interpretations of the same command. One path can stop at planner output and defer freshness, while another requires `generate-context.js`, graph refresh, and indexing. That is significant contract drift for the canonical save path.

**Evidence:**

- `.opencode/command/memory/save.md:130` through `.opencode/command/memory/save.md:133` says default canonical save behavior is `plan-only` with explicit follow-up actions, and graph refresh/reindex are deferred freshness actions.
- `.opencode/command/memory/save.md:341` through `.opencode/command/memory/save.md:371` says Step 5 executes `generate-context.js` as the standard save path.
- `.opencode/command/memory/save.md:349` through `.opencode/command/memory/save.md:355` says after `generate-context.js`, graph metadata refresh and Step 11.5 auto-indexing occur.
- `.opencode/command/memory/save.md:548` through `.opencode/command/memory/save.md:553` lists `Bash (node generate-context.js)` as the required context-save call.
- `.opencode/skill/system-spec-kit/SKILL.md:507` through `.opencode/skill/system-spec-kit/SKILL.md:509` says memory saves must use `generate-context.js` and that canonical saves refresh `description.json` and `graph-metadata.json`.

**Fix:** Pick one default. For release readiness, use mutation-first only when explicitly approved, or make `plan-only` return a structured plan and never claim the save completed. If `generate-context.js` is mandatory, remove the plan-only default wording and keep dry-run/planner behavior behind an explicit flag.

---

### P2-001: `/memory:manage` operation matrix drops the checkpoint-delete confirmation gate

**Impact:** The detailed checkpoint-delete section is safe, and the backing tool requires `confirmName`, so this is not release-blocking. The summary matrix is still misleading and can drive bad operator or agent behavior.

**Evidence:**

- `.opencode/command/memory/manage.md:797` through `.opencode/command/memory/manage.md:805` requires explicit confirmation and `confirmName` before checkpoint deletion.
- `.opencode/command/memory/manage.md:970` through `.opencode/command/memory/manage.md:972` lists checkpoint delete as a single direct operation without `[confirm]`.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:387` through `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:405` requires `confirmName` for `checkpoint_delete`.

**Fix:** Update the operation matrix to `checkpoint_list() -> [confirmName] -> checkpoint_delete()` and list abort behavior on missing confirmation.

## 4. Per-Dimension Coverage

| Dimension | Coverage | Result |
|-----------|----------|--------|
| Correctness | Checked YAML/markdown artifact production claims, save execution, resume ladder, memory command contracts, and deprecated-path references. | FAIL due P1-002 and P1-003. |
| Security | Checked Gate 3/spec-folder handling and destructive memory confirmation gates against backing tool schemas. | FAIL due P0-001. |
| Traceability | Checked input/output contracts, step outputs, prior matrix context, and summary/detail consistency. | CONDITIONAL due P1-002 and P2-001. |
| Maintainability | Checked auto/confirm drift and command-copy drift. | CONDITIONAL due P1-001, P1-002, and P2-001. |

Packet-specific answers:

- **Auto vs confirm parity:** No. `/spec_kit:*` auto modes still contain waits and pauses; `/memory:*` has no external auto/confirm YAML assets to compare.
- **Required-binding `preflight_contract` at INIT:** Not consistently. SpecKit YAML has local setup/prerequisite gates, but no uniform `preflight_contract` object across all seven commands. Memory commands are markdown-only.
- **`/spec_kit:resume` phase-parent ladder:** Mostly yes. The command markdown checks phase-parent state, uses `graph-metadata.json` `derived.last_active_child_id` and `derived.last_active_at`, redirects to a fresh child when valid, and otherwise lists child phases. The YAML mirrors that policy.
- **`/memory:save` calls `generate-context.js`:** Yes, the command includes a concrete `node .../generate-context.js` Step 5 and enforcement matrix. The release risk is the contradictory plan-only default.
- **Deprecated `stress_test/` paths:** No active deprecated `stress_test/` command-path reference found in the seven target commands. Existing stress-test history is under packet 011/037/038 and not wired into these command workflows.
- **Auto-fires claims:** `context_loading` in `/spec_kit:*` is documented as workflow-start behavior, but it is YAML instruction rather than a runtime hook. `memory:save` Step 11.5 auto-index is documented as part of the save workflow, with kill switches and cooldown, not a universal runtime auto-fire.

## 5. Cross-System Insights

- The release surface still mixes two command architectures: `/spec_kit:*` uses external YAML assets, while `/memory:*` embeds workflow contracts in markdown. That makes validation uneven.
- Prior packet 035 already showed full-matrix execution was conditional: F1-F9 command/memory surfaces were blocked or runner-missing across CLI executors, with native/inline passes only (`specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md:25` through `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md:38`).
- Packet 035 also recorded missing full matrix runner infrastructure (`specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md:71` through `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md:75`), so release-readiness claims should avoid implying all command surfaces are exercised across executors.
- Packet 044 corrected hook methodology by separating sandboxed direct smokes from live CLI verdicts (`specs/system-spec-kit/026-graph-and-context-optimization/044-hook-test-sandbox-fix/methodology-correction.md:17` through `specs/system-spec-kit/026-graph-and-context-optimization/044-hook-test-sandbox-fix/methodology-correction.md:19`, and `specs/system-spec-kit/026-graph-and-context-optimization/044-hook-test-sandbox-fix/methodology-correction.md:41` through `specs/system-spec-kit/026-graph-and-context-optimization/044-hook-test-sandbox-fix/methodology-correction.md:47`). This audit follows that caution: sandbox limitations are not treated as runtime failures.

## 6. Top Workstreams

| Workstream | Findings | Exit Criteria |
|------------|----------|---------------|
| Destructive gate hardening | P0-001 | `memory_delete({ id })` without confirmation is rejected; `/memory:manage delete` passes the required confirmation field; tests cover all delete branches. |
| Mode parity cleanup | P1-001 | Auto YAML variants contain no approval waits; confirm variants own approval checkpoints; exceptions are labeled safety stops. |
| Memory command workflow normalization | P1-002 | Memory commands either gain YAML assets and INIT contracts or markdown-only validation is formally documented and tested. |
| Save contract consolidation | P1-003 | `/memory:save` has one default behavior, and plan-only/dry-run cannot be confused with completed save. |
| Summary matrix cleanup | P2-001 | `/memory:manage` matrix matches detailed gate sections and tool schemas. |

## 7. Convergence Audit

Coverage reached all four requested dimensions across all seven commands. The review found one P0, three P1s, and one P2. A stabilization pass over the specific packet questions did not add new P0/P1 classes beyond destructive-gate enforcement, mode parity, memory YAML contract absence, and save-contract drift.

Evidence quality: every active finding has file:line evidence. Scope stayed read-only across command/runtime source; only packet-local files were authored. CocoIndex semantic search was attempted but blocked by sandbox permissions on the daemon log, so the audit used exact search and direct file reads.

## 8. Sources

- `.opencode/command/spec_kit/plan.md`
- `.opencode/command/spec_kit/implement.md`
- `.opencode/command/spec_kit/complete.md`
- `.opencode/command/spec_kit/resume.md`
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`
- `.opencode/command/memory/save.md`
- `.opencode/command/memory/search.md`
- `.opencode/command/memory/manage.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/sk-deep-review/SKILL.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/findings.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/044-hook-test-sandbox-fix/methodology-correction.md`

## 9. Open Questions

- Should `/memory:*` commands intentionally remain markdown-only, or should they be brought under the same external YAML asset model as `/spec_kit:*`?
- Should single-record `memory_delete` require `confirm:true` only, or a stronger typed confirmation such as `confirmTitle` for protected tiers?
- Should `/memory:save` default to plan-only or mutation-first for release, and what explicit flag names should separate those modes?
