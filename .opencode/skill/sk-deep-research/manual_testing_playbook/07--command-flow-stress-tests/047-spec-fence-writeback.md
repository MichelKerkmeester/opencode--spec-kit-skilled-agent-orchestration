---
title: "CP-047 -- SPEC_FENCE_WRITEBACK bounded spec mutation **(SANDBOXED)**"
description: "Validate that /spec_kit:deep-research uses the lock, spec_check_protocol and generated findings fence rather than freeform spec.md mutation."
---

# CP-047 -- SPEC_FENCE_WRITEBACK bounded spec mutation **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-047`.

> **SANDBOXED SCENARIO**: All command files live under `/tmp/cp-047-sandbox/`. Research artifacts live under `/tmp/cp-047-spec/`.

## 1. OVERVIEW

This scenario starts with a valid spec containing the host anchors expected by the deep-research command. Call B must append bounded pre-init context, synthesize findings, and replace exactly one generated findings fence.

### Why This Matters

The command and skill recently promoted bounded `spec.md` anchoring. A stress scenario must prove the workflow writes through lock-scoped, generated-fence semantics instead of editing arbitrary spec text or duplicating generated blocks.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `CP-047` and confirm only grep-checkable signals.

- Objective: Confirm spec mutation events, generated fence, strict validation labels, packet-local research artifacts and clean sandbox target diff.
- Layer partition: command-flow.
- Real user request: `Run deep research and sync bounded findings back to an existing spec without overwriting manual content.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-047-TASK-001.
  In /tmp/cp-047-sandbox/, run /spec_kit:deep-research:auto against /tmp/cp-047-spec.
  Preserve manual spec content and write only the deep-research generated fence.
  Acceptance: emit spec_check_result, one spec_mutation or dedupe event, one generated findings fence, research/research.md, and no canonical agent diff.
  Return status, spec_path, generated_fence_count, validation_signal, and notes.
  ```

- Expected process: seed a spec with `Open Questions` and `Research Context`, run generic Call A, reset sandbox, run command-flow Call B, then count spec and state signals.
- Expected signals: `spec_check_result`, `spec_preinit_context_added` or dedupe, `BEGIN GENERATED: deep-research/spec-findings`, `spec_mutation`, `research.md`, clean canonical diff, clean tripwire.
- Pass/fail: PASS if exactly one generated fence exists and all field counts pass. FAIL if the workflow duplicates fences, edits the canonical agent, or skips spec mutation events.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the setup helper.
2. Seed an existing spec with host anchors and manual text.
3. Run Call A as a loose baseline.
4. Reset the sandbox.
5. Run Call B through `/spec_kit:deep-research:auto`.
6. Validate generated-fence count, JSONL mutation labels, research artifact, sandbox diff and tripwire.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-047-sandbox /tmp/cp-047-sandbox-baseline /tmp/cp-047-spec
mkdir -p /tmp/cp-047-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-047-sandbox
cp -a /tmp/cp-047-sandbox /tmp/cp-047-sandbox-baseline
cat > /tmp/cp-047-spec/spec.md <<'EOF'
---
title: "CP-047 Existing Spec"
description: "Sandbox spec for bounded generated-fence writeback."
---
# CP-047 Existing Spec
## Requirements
- Keep manual requirement text.
## Scope
- Write research context only inside approved anchors.
## Open Questions
- What evidence proves generated-fence writeback is bounded?
## Research Context
- Manual context that must survive the run.
EOF
git status --porcelain > /tmp/cp-047-pre.txt
cat > /tmp/cp-047-task.txt <<'EOF'
Task ID: CP-047-TASK-001.
In /tmp/cp-047-sandbox/, run /spec_kit:deep-research:auto against /tmp/cp-047-spec.
Preserve manual spec content and write only the deep-research generated fence.
Acceptance: emit spec_check_result, one spec_mutation or dedupe event, one generated findings fence, research/research.md, and no canonical agent diff.
Return status, spec_path, generated_fence_count, validation_signal, and notes.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-047-task.txt)" > /tmp/cp-047-prompt-A.txt
copilot -p "$(cat /tmp/cp-047-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-047-sandbox --add-dir /tmp/cp-047-spec 2>&1 | tee /tmp/cp-047-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-047-A-exit.txt
rm -rf /tmp/cp-047-sandbox && cp -a /tmp/cp-047-sandbox-baseline /tmp/cp-047-sandbox
cd /tmp/cp-047-sandbox
copilot -p "/spec_kit:deep-research:auto \"CP-047 bounded spec findings fence\" --spec-folder=/tmp/cp-047-spec --max-iterations=1 --convergence=0.05" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-047-sandbox --add-dir /tmp/cp-047-spec 2>&1 | tee /tmp/cp-047-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-047-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
diff -u /tmp/cp-047-sandbox-baseline/.opencode/agent/deep-research.md /tmp/cp-047-sandbox/.opencode/agent/deep-research.md > /tmp/cp-047-B-canonical.diff; echo "POST_B_CANONICAL_DIFF=$?" | tee /tmp/cp-047-B-canonical-exit.txt
find /tmp/cp-047-spec -type f -print0 2>/dev/null | xargs -0 cat > /tmp/cp-047-B-artifacts.txt 2>/dev/null || touch /tmp/cp-047-B-artifacts.txt
cat /tmp/cp-047-B-command.txt /tmp/cp-047-B-artifacts.txt > /tmp/cp-047-B-combined.txt
git status --porcelain > /tmp/cp-047-post.txt
diff /tmp/cp-047-pre.txt /tmp/cp-047-post.txt > /tmp/cp-047-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-047-tripwire-exit.txt
{ grep -c 'spec_check_result' /tmp/cp-047-B-combined.txt; grep -c 'spec_preinit_context_added\|spec_preinit_context_deduped' /tmp/cp-047-B-combined.txt; grep -c 'spec_mutation' /tmp/cp-047-B-combined.txt; grep -c 'research.md' /tmp/cp-047-B-combined.txt; n=$(grep -c 'BEGIN GENERATED: deep-research/spec-findings' /tmp/cp-047-spec/spec.md 2>/dev/null || true); [[ "$n" -eq 1 ]] && echo 1 || echo 0; grep -q 'Manual context that must survive' /tmp/cp-047-spec/spec.md && echo 1 || echo 0; grep -q 'POST_B_CANONICAL_DIFF=0' /tmp/cp-047-B-canonical-exit.txt && echo 1 || echo 0; grep -q 'TRIPWIRE_DIFF_EXIT=0' /tmp/cp-047-tripwire-exit.txt && echo 1 || echo 0; } | tee /tmp/cp-047-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-047 | SPEC_FENCE_WRITEBACK | Confirm bounded generated-fence writeback | Same task body in §2 | Run the §3 bash block | B field counts all >= 1 | `/tmp/cp-047-spec/spec.md`, combined transcript, diffs | PASS if one fence exists and manual text survives | 1. If fence count is not one, inspect spec_check_protocol branch. 2. If manual text is lost, repair writeback. 3. If mutation labels are absent, inspect JSONL append. |

## 4. SOURCE ANCHORS

| File | Anchor |
|---|---|
| `.opencode/command/spec_kit/deep-research.md:35-38` | lock and spec_check_protocol note |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:298-360` | pre-init spec classification and validation |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:973-996` | generated findings fence writeback |
| `.opencode/skill/sk-deep-research/SKILL.md:343-350` | exact generated-fence contract |
| `.opencode/agent/deep-research.md:51-55` | agent may not repair reducer or control files |

## 5. SOURCE METADATA

- Group: Command Flow Stress
- Playbook ID: CP-047
- Layer partition: command-flow
- Preflight: 13/13 questions pass
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--command-flow-stress-tests/047-spec-fence-writeback.md`
- Sandbox: `/tmp/cp-047-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~5-8 min
