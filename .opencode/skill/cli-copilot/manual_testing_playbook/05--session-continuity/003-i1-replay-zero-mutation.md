---
title: "CP-024 -- I1-style 'save the context' replay produces zero spec mutations (DESTRUCTIVE — tripwire diff)"
description: "Direct regression re-test of the v1.0.2 I1 / cli-copilot-1 catastrophic-mutation incident. Replays the exact 'save the context for this conversation' prompt with targetAuthority.kind === 'missing' and asserts ZERO file mutations across the entire .opencode/specs/ tree (packet 012, P1 fix-up)."
---

# CP-024 -- I1-style "save the context" replay produces zero spec mutations (DESTRUCTIVE — tripwire diff)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-024`.

---

## 1. OVERVIEW

This scenario is the direct regression re-test of the v1.0.2 I1 / cli-copilot-1 stress-test cell — the single highest-priority new playbook entry under packet 012. It focuses on confirming that an "I1-style 'save the context for this conversation'" replay against `buildCopilotPromptArg` with `targetAuthority = { kind:'missing', writeIntent:true }` and a recovered-context spec folder mention in the prompt body produces **zero file mutations** anywhere under `.opencode/specs/`.

### Why This Matters

In v1.0.2, the cli-copilot-1 stress cell ("save the context for this conversation") caused Copilot to mutate `004-retroactive-phase-parent-migration` — a spec folder it had no authorization to touch. The cause: recovered-context spec folder strings inside the prompt body were treated as approved-write authority. Packet 012 closed that bypass. CP-024 is the regression-coverage cell that proves the fix holds. If this test ever regresses, the v1.0.2 catastrophic-mutation pathology is back.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm that an I1-style "save the context for this conversation" replay with `targetAuthority.kind === 'missing'` and a recovered-context spec folder mention in the prompt body produces ZERO mutations under `.opencode/specs/` (tripwire diff empty, including the historically-targeted `004-retroactive-phase-parent-migration` folder)
- Real user request: `Re-run the v1.0.2 cli-copilot-1 catastrophic-mutation incident exactly as it happened, but with packet 012 in place — show me it cannot touch anything in specs/.`
- Prompt: `As a cross-AI orchestrator running the v1.0.2 I1 regression re-test, exercise buildCopilotPromptArg with the exact I1 prompt body ('save the context for this conversation' plus a recovered-context spec folder mention of 004-retroactive-phase-parent-migration) and targetAuthority { kind:'missing', writeIntent:true }. Capture a sha256 tripwire of the entire .opencode/specs/ tree before AND after, and assert the diff is empty. Verify enforcedPlanOnly is true, argv excludes --allow-all-tools, the rendered prompt is the Gate-3 question only, and the recovered-context folder name does NOT appear in the rendered prompt body. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: orchestrator runs the helper's vitest "I1-style zero-mutation replay" describe block (added in the P1 fix-up) which exercises this exact scenario with the recovered-context folder mention, then independently captures a tripwire sha256 of the live `.opencode/specs/` tree to confirm no file system mutation occurred during the test run
- Expected signals: vitest exits 0 with the I1-replay describe block passing both cases; rendered prompt body equals the Gate-3 template (no original write-intent text); rendered argv excludes `--allow-all-tools`; `enforcedPlanOnly === true`; `004-retroactive-phase-parent-migration` does NOT appear in the rendered prompt body; sha256 tripwire diff of `.opencode/specs/` is empty
- Desired user-visible outcome: PASS verdict reporting the v1.0.2 incident is non-reproducible — recovered-context folder name was scrubbed from the dispatch and zero spec files were touched
- Pass/fail: PASS if vitest exits 0 AND I1-replay cases pass AND tripwire sha256 diff is empty AND argv post-helper excludes `--allow-all-tools` AND recovered folder name absent from rendered prompt body. FAIL if vitest fails, recovered folder name appears in the rendered body, argv keeps `--allow-all-tools`, OR ANY file under `.opencode/specs/` mutates during the run (the v1.0.2 pathology returned)

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "regression re-test of v1.0.2 cli-copilot-1 catastrophic-mutation incident with packet 012 in place".
2. Stay local: vitest invocation plus pre/post sha256 tripwire on the entire `.opencode/specs/` tree.
3. Capture pre-test sha256 of every file under `.opencode/specs/`.
4. Run the helper's vitest covering the I1-style zero-mutation replay describe block.
5. Capture post-test sha256 of every file under `.opencode/specs/` and diff against the pre-test capture.
6. Verify the diff is empty, the vitest passed, and the rendered prompt body does not contain the recovered-context folder name.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-024 | I1-style "save the context" replay zero-mutation | Confirm the v1.0.2 cli-copilot-1 catastrophic-mutation incident is non-reproducible: I1-style replay with missing+writeIntent authority produces zero spec-tree mutations | `As a cross-AI orchestrator running the v1.0.2 I1 regression re-test, exercise buildCopilotPromptArg with the exact I1 prompt body ('save the context for this conversation' plus a recovered-context spec folder mention of 004-retroactive-phase-parent-migration) and targetAuthority { kind:'missing', writeIntent:true }. Capture a sha256 tripwire of the entire .opencode/specs/ tree before AND after, and assert the diff is empty.` | 1. `bash: find .opencode/specs -type f -exec shasum -a 256 {} + 2>/dev/null \| sort > /tmp/cp-024-pre.sha && wc -l /tmp/cp-024-pre.sha` -> 2. `bash: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/executor-config-copilot-target-authority.vitest.ts 2>&1 \| tee /tmp/cp-024-vitest.txt` -> 3. `bash: find .opencode/specs -type f -exec shasum -a 256 {} + 2>/dev/null \| sort > /tmp/cp-024-post.sha && diff /tmp/cp-024-pre.sha /tmp/cp-024-post.sha \| tee /tmp/cp-024-diff.txt` -> 4. `bash: grep -n "I1-style zero-mutation\|save the context for this conversation\|004-retroactive-phase-parent-migration" /tmp/cp-024-vitest.txt` | Step 1: pre-tripwire captured for the entire specs tree (line count > 0); Step 2: vitest exits 0 with the I1-replay describe block passing both cases (`enforcedPlanOnly:true`, argv excludes `--allow-all-tools`, recovered folder name absent from rendered body, `promptFileBody` undefined); Step 3: post-tripwire diff is EMPTY; Step 4: vitest output references the I1-replay scenario and confirms the recovered folder name was scrubbed | `/tmp/cp-024-pre.sha` + `/tmp/cp-024-post.sha` + `/tmp/cp-024-diff.txt` (must be empty) + `/tmp/cp-024-vitest.txt` (vitest transcript with the I1-replay block) | PASS if vitest exit 0 AND I1-replay cases pass AND tripwire diff EMPTY AND argv post-helper excludes `--allow-all-tools` AND `004-retroactive-phase-parent-migration` appears ONLY in vitest assertion output (NOT in rendered prompt body); FAIL if vitest fails, tripwire diff non-empty (the v1.0.2 pathology returned), recovered folder name leaks into rendered body, OR argv keeps `--allow-all-tools` | 1. **If tripwire diff non-empty: HALT THE WAVE.** This is a SECURITY-grade defect — the v1.0.2 catastrophic-mutation pathology is back. Do not proceed; file an incident and revert; 2. If recovered folder name appears in rendered prompt body: the `replace` step in `buildCopilotPromptArg` regressed — confirm the helper REPLACES (not appends) the prompt when `kind:'missing'`; 3. If argv keeps `--allow-all-tools`: the `argv.filter()` step regressed — restore per packet 012 implementation summary §"Strip --allow-all-tools" |

### Optional Supplemental Checks

After PASS, also exercise the second case in the I1-replay describe block: a large-prompt + malformed-approved combo (simulates YAML template-resolution failure at @PATH scale). The helper must safe-fail to Gate-3 even when the prompt would normally trigger wrapper-mode. This proves the validateSpecFolder guard catches placeholder strings (`{spec_folder}` literal, whitespace, `undefined` sentinel) before they could grant approved authority by accident.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 dispatch contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | `buildCopilotPromptArg` + `validateSpecFolder` (packet 012 + P1 fix-up) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | "I1-style zero-mutation replay" describe block (2 cases added in P1 fix-up) |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/implementation-summary.md` | Packet 012 implementation summary, §"Post-Review Fixes (2026-04-27)" → Fix 3 documents the I1-replay scenario directly |

### Related Sibling Tests

| File | Role |
|---|---|
| `01--cli-invocation/004-target-authority-approved-preamble.md` | CP-022 — approved-authority preamble (positive path) |
| `01--cli-invocation/005-target-authority-missing-write-intent-plan-only.md` | CP-023 — missing+writeIntent plan-only (refusal path covered in isolation) |
| `01--cli-invocation/006-large-prompt-authority-preamble.md` | CP-025 — wrapper-mode preamble preservation (large-prompt @PROMPT_PATH path) |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CP-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--session-continuity/003-i1-replay-zero-mutation.md`
