---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: cli-copilot Dispatch Test Parity — close F-004 P2 from 011 deep-review"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Update mcp_server/tests/deep-loop/cli-matrix.vitest.ts so its cli-copilot branch models the buildCopilotPromptArg + promptFileBody flow that packet 026/011/012 actually ships. The test currently asserts the legacy resolveCopilotPromptArg / -p \"$(cat ...)\" command-string shape; F-004 from the 011 deep-review flagged this as a silent-regression risk. This packet rewrites the cli-copilot section to cover all 3 targetAuthority branches plus a static-grep ordering check on both _auto.yaml dispatch sites. Test-only — no production code touched."
trigger_phrases:
  - "017-cli-copilot-dispatch-test-parity"
  - "cli-copilot dispatch test parity"
  - "F-004 cli-matrix test fix"
  - "cli-matrix.vitest.ts buildCopilotPromptArg parity"
  - "Packet B cli-copilot test hardening"
  - "promptFileBody dispatch test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity"
    last_updated_at: "2026-04-27T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Rewrote cli-matrix cli-copilot branch + authored packet docs"
    next_safe_action: "Operator review; commit packet alongside the test changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: null
      session_id: "017-cli-copilot-dispatch-test-parity-impl-2026-04-27"
      parent_session_id: "011-mcp-runtime-stress-remediation-deep-review-2026-04-27"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Test-only scope confirmed: production buildCopilotPromptArg + YAML wire-ins unchanged"
      - "Branches covered: kind:'approved' small + large; kind:'missing'+writeIntent:false; kind:'missing'+writeIntent:true; YAML write-then-dispatch ordering"
      - "Smoke test now models the approved-large-prompt happy path (with promptFileBody written to disk before dispatch) instead of the legacy resolveCopilotPromptArg flow"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 016-degraded-readiness-envelope-parity; SUCCESSOR: 018-catalog-playbook-degraded-alignment -->

# Feature Specification: cli-copilot Dispatch Test Parity — close F-004 P2 from 011 deep-review

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Implementation Complete (pending operator review) |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `015-mcp-runtime-stress-remediation` |
| **Predecessor** | `../011-post-stress-followup-research` (deep-review report §4 F-004 + §7 Packet B identifies this fix) |
| **Successor** | None (sibling to 016 + 018) |
| **Handoff Criteria** | `cli-matrix.vitest.ts` cli-copilot section models `buildCopilotPromptArg`'s `built.argv` + `promptFileBody` shape; all 3 `targetAuthority` branches asserted; YAML write-then-dispatch ordering pinned via static grep; sibling deep-loop tests + executor-config-copilot-target-authority tests stay green; `validate.sh --strict` returns 0 structural errors. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 011 deep-review report (`../011-post-stress-followup-research/review/review-report.md`) §4 surfaced F-004 [P2]:

> `mcp_server/tests/deep-loop/cli-matrix.vitest.ts:17-20` claims to mirror YAML, but its cli-copilot branch (lines 40-56) still builds `-p "$(cat ...)"` / `resolveCopilotPromptArg()` strings instead of the `built.argv` + `promptFileBody` flow that 012 introduced.

The test passes today because `resolveCopilotPromptArg` is still exported (sibling helper kept for backward compat). But the YAML auto-loop dispatch path no longer goes through it — both `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml` route cli-copilot dispatches through `buildCopilotPromptArg`, write `built.promptFileBody` to disk when set, then invoke copilot with `built.argv`. A future refactor that breaks the helper's `argv`/`promptFileBody` contract would not fail this test, leaving the dispatch contract unguarded.

The deep-review's §7 Packet B PASS gate is explicit: "cli-matrix test models `built.argv`, `promptFileBody`, and `@PROMPT_PATH` behavior, not the legacy command string."

### Purpose

Update the cli-copilot section of `mcp_server/tests/deep-loop/cli-matrix.vitest.ts` to model the actual shipped contract:

- Construct test inputs that exercise `buildCopilotPromptArg({ promptPath, prompt, targetAuthority })`.
- Assert `built.argv` shape (small inline prompt vs bare `@PROMPT_PATH` reference).
- Assert `built.promptFileBody` is set when authority is approved + prompt is large enough for the wrapper file.
- Assert YAML semantically writes `built.promptFileBody` to disk before invoking copilot (static-grep against the YAML file).
- Cover all 3 branches of `targetAuthority`: `kind:"approved"`, `kind:"missing"+writeIntent:false`, `kind:"missing"+writeIntent:true`.

Test-only change. Production code in `executor-config.ts` and the two YAML files is untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite the cli-copilot portion of `mcp_server/tests/deep-loop/cli-matrix.vitest.ts`:
  - Drop the 3 cli-copilot tests in the `cli-matrix dispatch command shape` describe block (legacy `-p "$(cat ...)"` and `Read the instructions in @path` assertions).
  - Add a new `cli-matrix cli-copilot dispatch shape (buildCopilotPromptArg)` describe block with 5 cases covering the full behavior matrix + the YAML write-then-dispatch ordering check.
  - Update `buildDispatchCommand` so its `cli-copilot` branch throws (fail-loud anti-regression) and remove its `promptSizeBytes` parameter (no longer needed for the remaining kinds).
  - Update the smoke test to model the approved + large-prompt flow through `buildCopilotPromptArg` + `writeFileSync(promptPath, built.promptFileBody)` instead of going through `resolveCopilotPromptArg` directly.
- Add `buildCopilotPromptArg` to the imports; drop the now-unused `resolveCopilotPromptArg` import.
- Add repo-root anchored YAML path constants and a shared `COPILOT_BASE_ARGV` + `APPROVED_FOLDER` constant for reuse.
- Author standard Level 1 packet docs (spec, plan, tasks, checklist, implementation-summary, description.json, graph-metadata.json).

### Out of Scope

- Modifying `executor-config.ts` (production code — `buildCopilotPromptArg` is byte-stable).
- Modifying `spec_kit_deep-research_auto.yaml` or `spec_kit_deep-review_auto.yaml` (production wire-ins — byte-stable).
- The other deep-review findings: F-001/F-003 (P1, owned by Packet A → 016), F-005/F-007 (P2 docs, owned by Packet C → 018).
- Sibling packets 016 and 018 — they have their own packet folders and PASS gates.
- Frozen packets 003-015 under 011 phase parent.
- The `_confirm.yaml` variants — they were intentionally deferred in packet 012 and are not in F-004's scope.
- Adding new behavior to `buildCopilotPromptArg` — only its existing contract is being pinned by the test.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts` | Modify | Replace cli-copilot dispatch tests + smoke test with `buildCopilotPromptArg`-shaped assertions; ~+150 / -55 LOC |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| **REQ-001** | The cli-copilot section of `cli-matrix.vitest.ts` no longer references `resolveCopilotPromptArg` or the legacy `-p "$(cat ...)"` / `Read the instructions in @path` strings as expected dispatch shape. | `grep -n "resolveCopilotPromptArg\|\\-p \"\\$(cat" mcp_server/tests/deep-loop/cli-matrix.vitest.ts` returns 0 hits in describe-block bodies (matches in comments are allowed for context). |
| **REQ-002** | A new describe block exercises `buildCopilotPromptArg` directly. | `grep -n "buildCopilotPromptArg" mcp_server/tests/deep-loop/cli-matrix.vitest.ts` returns ≥4 hits (1 import + ≥3 calls). |
| **REQ-003** | `kind:"approved"` + small prompt is asserted: `argv` carries the preamble inline, `promptFileBody` is undefined, `enforcedPlanOnly` is false. | Vitest case "kind:\"approved\" + small prompt" passes. |
| **REQ-004** | `kind:"approved"` + large prompt is asserted: `argv[1]` is the bare `@PROMPT_PATH` reference (not the legacy `Read the instructions in @path` wrapper string), `promptFileBody` is defined and contains preamble + divider + body. | Vitest case "kind:\"approved\" + large prompt" passes. |
| **REQ-005** | `kind:"missing"` + `writeIntent:false` is asserted: prompt unchanged, argv length unchanged, `--allow-all-tools` retained. | Vitest case "kind:\"missing\" + writeIntent:false" passes. |
| **REQ-006** | `kind:"missing"` + `writeIntent:true` is asserted: prompt replaced with Gate-3 question, `--allow-all-tools` stripped, `enforcedPlanOnly` true, original write-intent prompt absent from rendered body. | Vitest case "kind:\"missing\" + writeIntent:true" passes. |
| **REQ-007** | YAML write-then-dispatch ordering is pinned for both `_auto.yaml` files. | Vitest case "YAML auto-loop sites write built.promptFileBody to disk before invoking copilot" passes; static grep finds `if (built.promptFileBody !== undefined)`, `writeFileSync(promptPath, built.promptFileBody`, AND a copilot dispatch (`spawnSync('copilot'` for deep-review or `command: 'copilot'` for deep-research) that comes AFTER the write in file-byte order. |
| **REQ-008** | All 13 cli-matrix tests pass. | `vitest run tests/deep-loop/cli-matrix.vitest.ts` exits 0 with `Tests 13 passed (13)`. |
| **REQ-009** | The full deep-loop test surface stays green. | `vitest run tests/deep-loop/` exits 0; same total count or higher than baseline (73/73). |
| **REQ-010** | The 012 helper test suite stays green (no regression in `buildCopilotPromptArg` contract assertions). | `vitest run tests/executor-config-copilot-target-authority.vitest.ts` exits 0 with `Tests 29 passed (29)`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| **REQ-011** | The smoke test (`exercises the large-prompt ... with a real subprocess`) models the approved-authority dispatch path (the actual happy path the YAML drives), with `promptFileBody` written to disk before the subprocess invocation. | The subprocess reads `promptPath` and confirms it opens with `## TARGET AUTHORITY` followed by `Approved spec folder: <APPROVED_FOLDER>` followed by the original prompt body. |
| **REQ-012** | `buildDispatchCommand`'s `cli-copilot` branch fails loud rather than silently producing the legacy command string (anti-regression). | Calling `buildDispatchCommand(parseExecutorConfig({ kind: 'cli-copilot', ... }), promptPath)` throws an `Error` whose message points at `buildCopilotPromptArg`. _Tests don't directly cover this — it is dead code that throws if any future test forgets to use the new helper._ |
| **REQ-013** | Production code at `executor-config.ts`, `spec_kit_deep-research_auto.yaml`, `spec_kit_deep-review_auto.yaml` is byte-stable. | `git diff --stat` shows the test file and packet docs only; production paths untouched. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion |
|----|-----------|
| **SC-001** | The cli-copilot section of `cli-matrix.vitest.ts` exercises `buildCopilotPromptArg` directly across all 3 `targetAuthority` branches. _(maps to deep-review §7 Packet B PASS gate)_ |
| **SC-002** | The test asserts `built.argv` and `built.promptFileBody` shape, not the legacy command string. A regression in `buildCopilotPromptArg`'s argv layout, preamble emission, or `promptFileBody` discriminator would fail this test. _(maps to F-004 risk: "future refactor of buildCopilotPromptArg could silently break the dispatch contract; this test wouldn't catch it.")_ |
| **SC-003** | The YAML write-then-dispatch ordering on both `_auto.yaml` files is pinned by static grep. A future refactor that drops or moves the `writeFileSync(promptPath, built.promptFileBody)` call would fail this test. |
| **SC-004** | Sibling tests stay green: full `tests/deep-loop/` suite (73/73) + `tests/executor-config-copilot-target-authority.vitest.ts` (29/29) — no regression introduced by the rewrite. |
| **SC-005** | `validate.sh --strict` on this packet returns 0 structural errors (SPEC_DOC_INTEGRITY false-positives accepted as known noise, matching the 010-012 baseline pattern). |


### Acceptance Scenarios

1. **Given** the completed cli copilot dispatch test parity packet, **When** strict validation checks documentation traceability, **Then** the existing completed outcome remains mapped to the packet's spec, plan, tasks, checklist, and implementation summary.
2. **Given** the packet's recorded verification evidence, **When** this retrospective hygiene pass runs, **Then** no implementation verdict, completion status, or test result is changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Static-grep regex drift: a future YAML refactor changes whitespace or quoting around `built.promptFileBody !== undefined` | Medium — test silently fails on an otherwise-correct refactor | Use loose-whitespace regexes (`\s*`) and match the discriminator + writeFileSync separately. Failure is loud and fixable in 5 minutes. |
| Risk | The static-grep dispatch-index lookup picks up an EARLIER `runAuditedExecutorCommand({...})` call frame in deep-research (which has multiple) | High — false-fail | Anchor on the literal `command: 'copilot'` line, which only appears inside the cli-copilot dispatch block. Verified by inspection (line 652 in current deep-research yaml). |
| Risk | `import.meta.url` resolution differs across vitest runner versions | Low — common pattern | Use the same `fileURLToPath(import.meta.url)` + `dirname` + `resolve('..', ...)` chain that already exists elsewhere in the test suite if needed; otherwise verify on the local vitest 4.1.x setup the project ships. |
| Risk | Smoke test now writes `promptFileBody` to disk; if the helper ever stops emitting it on approved-large-prompt, the smoke test asserts upfront and fails loud | Low — desired behavior | Test asserts `built.promptFileBody` is defined BEFORE writeFileSync. A regression where the helper drops the file body would fail the assertion before the subprocess runs. |
| Dependency | `buildCopilotPromptArg` exported from `executor-config.ts` (packet 012) | Internal; landed | If 012 is reverted, this test will not compile. Documented as a hard dependency. |
| Dependency | Both `_auto.yaml` files contain the helper-routed Node script | Internal; landed | Same — if 012 is reverted, REQ-007's static-grep fails. Documented. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None remaining at close. Three resolved at scaffold:
  1. **Should `buildDispatchCommand` keep modeling cli-copilot for backward-compat?** No. Throwing in the cli-copilot branch is a fail-loud signal that the new shape (helper + argv + promptFileBody) is the only legal model. Keeping the legacy string would create a second source of truth.
  2. **Should the smoke test exercise read-only or approved authority?** Approved authority. That is the YAML's primary happy path — every workflow-resolved spec folder dispatch goes through it. Read-only behavior is covered by the missing+writeIntent:false case in the dispatch-shape describe block.
  3. **Should the YAML ordering check be a static-grep test or a YAML-parse test?** Static grep with byte-index ordering is sufficient for the contract: "writeFileSync MUST come before the copilot dispatch." Parsing the YAML and walking the AST would be over-engineered for a single ordering invariant.
<!-- /ANCHOR:questions -->
