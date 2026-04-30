---
title: "DBG-SCAF-001 -- Debug-delegation scaffold generator + failure-threshold prompt rehearsal"
description: "Validates that scaffold-debug-delegation.sh generates a well-formed debug-delegation.md from a synthetic failure trail, that versioned filenames work when prior scaffolds exist, and that the y/n/skip prompt in spec_kit_implement_auto.yaml/spec_kit_complete_auto.yaml never autonomously dispatches @debug."
---

# DBG-SCAF-001 -- Debug-delegation scaffold generator + failure-threshold prompt rehearsal

## 1. OVERVIEW

This scenario validates the failure-threshold offer flow added by spec-folder `050-agent-debug-integration`. The flow has two pieces: (a) the y/n/skip prompt the workflow surfaces after 3+ task failures during `spec_kit:implement` / `spec_kit:complete`, and (b) the new `scaffold-debug-delegation.sh` helper that pre-fills `debug-delegation.md` on opt-in. The hard constraint enforced here is: the workflow must NEVER auto-invoke Task tool → @debug. The user opts in by running the Task-tool dispatch themselves with the scaffold as the structured handoff.

---

## 2. SCENARIO CONTRACT


- Objective: Verify scaffold generation, versioned filenames on collision, schema parity with `.opencode/agent/debug.md` lines 60-89, and absence of autonomous @debug dispatch.
- Real user request: `` Please validate Debug-delegation scaffold generator + failure-threshold prompt rehearsal against the documented validation surface and tell me whether the expected signals are present: Generated file exists at `<spec-folder>/debug-delegation.md` (or `debug-delegation-002.md` if a prior file exists).; File contains 5 numbered sections: PROBLEM SUMMARY, ATTEMPTED FIXES, CONTEXT FOR SPECIALIST, RECOMMENDED NEXT STEPS, HANDOFF CHECKLIST.; Attempt 1/2/3 approach + result fields populated from the input JSON.; YAML frontmatter present with `_memory.continuity` block, `packet_pointer` set to the spec folder relative path, and `last_updated_by: "scaffold-debug-delegation.sh"`.; Script exits 0 and prints the absolute output path on stdout.; Script makes ZERO Task-tool invocations (verifiable: it's a Bash script, not an agent runner). ``
- RCAF Prompt: `` As a tooling validation operator, validate Debug-delegation scaffold generator + failure-threshold prompt rehearsal against the documented validation surface. Verify Generated file exists at `<spec-folder>/debug-delegation.md` (or `debug-delegation-002.md` if a prior file exists).; File contains 5 numbered sections: PROBLEM SUMMARY, ATTEMPTED FIXES, CONTEXT FOR SPECIALIST, RECOMMENDED NEXT STEPS, HANDOFF CHECKLIST.; Attempt 1/2/3 approach + result fields populated from the input JSON.; YAML frontmatter present with `_memory.continuity` block, `packet_pointer` set to the spec folder relative path, and `last_updated_by: "scaffold-debug-delegation.sh"`.; Script exits 0 and prints the absolute output path on stdout.; Script makes ZERO Task-tool invocations (verifiable: it's a Bash script, not an agent runner). Return a concise pass/fail verdict with the main reason and cited evidence. ``
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Generated file exists at `<spec-folder>/debug-delegation.md` (or `debug-delegation-002.md` if a prior file exists).; File contains 5 numbered sections: PROBLEM SUMMARY, ATTEMPTED FIXES, CONTEXT FOR SPECIALIST, RECOMMENDED NEXT STEPS, HANDOFF CHECKLIST.; Attempt 1/2/3 approach + result fields populated from the input JSON.; YAML frontmatter present with `_memory.continuity` block, `packet_pointer` set to the spec folder relative path, and `last_updated_by: "scaffold-debug-delegation.sh"`.; Script exits 0 and prints the absolute output path on stdout.; Script makes ZERO Task-tool invocations (verifiable: it's a Bash script, not an agent runner)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all five signals hold AND the second invocation (with prior scaffold present) produces `debug-delegation-002.md` rather than overwriting the original.

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, validate scaffold-debug-delegation.sh against bash .opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh --spec-folder <throwaway-folder> --task-id T999 --error-category test_failure --error-message "Expected 'foo' to equal 'bar' at line 42" --affected-files "src/foo.ts,test/foo.test.ts" --hypothesis "Stale cache returning old value" --errors-json '[{"approach":"Clear cache and retry","result":"same error"},{"approach":"Hardcode value","result":"breaks other tests"},{"approach":"Add wait","result":"flaky"}]'. Verify the produced debug-delegation.md contains all 5 schema sections (PROBLEM SUMMARY, ATTEMPTED FIXES, CONTEXT FOR SPECIALIST, RECOMMENDED NEXT STEPS, HANDOFF CHECKLIST), Attempts 1/2/3 are populated from input JSON, no Task tool → @debug invocation was triggered. Return a concise pass/fail verdict with cited evidence.
```

### Commands

1. Create a throwaway spec folder under `/tmp` matching the approved-root pattern:
   ```bash
   mkdir -p /tmp/scaf-test/.opencode/specs/test-packet/099-rehearsal/scratch
   touch /tmp/scaf-test/.opencode/specs/test-packet/099-rehearsal/spec.md
   ```
2. Run the scaffold generator with synthetic data:
   ```bash
   bash .opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh \
     --spec-folder /tmp/scaf-test/.opencode/specs/test-packet/099-rehearsal \
     --task-id "T999" \
     --error-category "test_failure" \
     --error-message "Expected 'foo' to equal 'bar' at line 42" \
     --affected-files "src/foo.ts,test/foo.test.ts" \
     --hypothesis "Stale cache returning old value" \
     --errors-json '[{"approach":"Clear cache and retry","result":"same error"},{"approach":"Hardcode value","result":"breaks other tests"},{"approach":"Add wait","result":"flaky"}]'
   ```
3. Verify the produced file:
   ```bash
   test -f /tmp/scaf-test/.opencode/specs/test-packet/099-rehearsal/debug-delegation.md
   grep -c "^## [0-9]\." /tmp/scaf-test/.opencode/specs/test-packet/099-rehearsal/debug-delegation.md  # expect 5
   grep -E "Clear cache and retry|Hardcode value|Add wait" /tmp/scaf-test/.opencode/specs/test-packet/099-rehearsal/debug-delegation.md  # expect 3 hits
   ```
4. Run the generator a second time with the same args and confirm versioned output:
   ```bash
   bash .opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh --spec-folder /tmp/scaf-test/.opencode/specs/test-packet/099-rehearsal --task-id "T999" --errors-json '[{"approach":"x","result":"x"},{},{}]'
   test -f /tmp/scaf-test/.opencode/specs/test-packet/099-rehearsal/debug-delegation-002.md
   ```
5. Confirm no @debug autonomous dispatch (the script is plain Bash; verify by reading the script):
   ```bash
   grep -n "Task tool\|subagent_type" .opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh  # expect zero matches
   ```
6. Confirm the YAML configs surface a y/n/skip prompt rather than auto-dispatch:
   ```bash
   grep -A 5 "debug_delegation:\|debug_escalation:" .opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml .opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml | grep -E "y / continue manually / skip|no_autonomous_routing|prompt_user_with_y_n_skip"  # expect at least 3 hits
   ```
7. Cleanup:
   ```bash
   rm -rf /tmp/scaf-test
   ```

---

## 4. EVIDENCE TO CAPTURE

- Output of step 2 (scaffold path printed on stdout).
- Output of step 3 grep counts (5 sections, 3 attempt-approach hits).
- Output of step 4 (versioned `debug-delegation-002.md` exists).
- Output of step 5 grep (zero `Task tool` / `subagent_type` matches in the Bash script).
- Output of step 6 grep (at least 3 hits on the y/n/skip / no_autonomous_routing / prompt_user_with_y_n_skip markers).

---

## 5. PASS / FAIL

- **PASS**: All 5 evidence items match the expected signals. The script produced a well-formed scaffold, versioned correctly on collision, and no autonomous routing occurred.
- **FAIL**: Any of:
  - Scaffold missing one of the 5 schema sections.
  - Versioned filename did not increment on second run (overwrote prior scaffold).
  - Script contains a `Task tool` or `subagent_type` reference (would indicate autonomous routing crept in).
  - YAML configs lack the y/n/skip prompt language or contain `subagent_type: "debug"` in an action block.

---

## 6. RELATED ARTIFACTS

- Helper script: `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`
- Schema source: `.opencode/agent/debug.md` (Debug Context Handoff format, lines 60-89)
- Workflow YAML: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` (debug_delegation block) and `.../spec_kit_complete_auto.yaml` (debug_escalation block)
- Spec folder: `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/` (REQ-004, REQ-005)
- User constraint memory: `feedback_debug_agent_user_invoked_only.md`
