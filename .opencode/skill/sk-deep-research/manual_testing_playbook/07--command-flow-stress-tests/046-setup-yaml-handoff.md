---
title: "CP-046 -- SETUP_YAML_HANDOFF command binding fidelity **(SANDBOXED)**"
description: "Validate that /spec_kit:deep-research resolves setup inputs before loading the auto YAML workflow and leaves grep-checkable state evidence."
---

# CP-046 -- SETUP_YAML_HANDOFF command binding fidelity **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-046`.

> **SANDBOXED SCENARIO**: All command files live under `/tmp/cp-046-sandbox/`. Research artifacts live under `/tmp/cp-046-spec/`.

## 1. OVERVIEW

This scenario sends a bounded one-iteration research request through `/spec_kit:deep-research:auto`. The differential is whether the command resolves topic, spec folder, mode, max iterations, convergence and artifact root before the YAML workflow starts.

### Why This Matters

The command says Markdown owns setup and YAML must not load until all required inputs are bound. A command-flow CP should therefore grade state files, setup labels and artifacts, not whether the agent body can improvise missing setup.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `CP-046` and confirm the expected signals without LLM judgment.

- Objective: Confirm Call B creates config, state, strategy, prompts and iteration artifacts from workflow-resolved setup values while leaving the sandbox target unchanged.
- Layer partition: command-flow.
- Real user request: `Run a one-iteration deep research loop and prove setup values were handed to YAML before dispatch.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-046-TASK-001.
  In /tmp/cp-046-sandbox/, run /spec_kit:deep-research:auto for setup-binding evidence.
  Stay strictly inside /tmp/cp-046-sandbox/ and /tmp/cp-046-spec/.
  Acceptance: create deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, a rendered iteration prompt, and one packet-local iteration artifact.
  Return status, artifact_dir, setup_values, evidence_files, and notes.
  ```

- Expected process: create sandbox, seed `/tmp/cp-046-spec/spec.md`, capture repo tripwire, run Call A as generic task, reset sandbox, run Call B through `/spec_kit:deep-research:auto`, then grep artifacts and diffs.
- Expected signals: config carries `maxIterations` 1, state log records the topic, prompt pack exists, iteration output exists, command transcript or artifacts mention the auto workflow, sandbox target diff is empty, project tripwire is empty.
- Pass/fail: PASS if every B signal is non-zero and both diffs are clean. FAIL if setup is inferred inside the agent body, YAML starts with unresolved values, or canonical agent files change.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the setup helper to seed `/tmp/cp-046-sandbox/`.
2. Write the shared task body once.
3. Run Call A with `As @Task:` as the loose baseline.
4. Reset the sandbox.
5. Run Call B as `/spec_kit:deep-research:auto ... --spec-folder=/tmp/cp-046-spec --max-iterations=1`.
6. Validate transcript labels, state artifacts, sandbox diff and project tripwire only.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-046-sandbox /tmp/cp-046-sandbox-baseline /tmp/cp-046-spec
mkdir -p /tmp/cp-046-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-046-sandbox
cp -a /tmp/cp-046-sandbox /tmp/cp-046-sandbox-baseline
cat > /tmp/cp-046-spec/spec.md <<'EOF'
---
title: "CP-046 Deep Research Setup"
description: "Sandbox spec for setup handoff stress testing."
---
# CP-046 Deep Research Setup
## Requirements
- Preserve setup-binding evidence.
## Scope
- Use /tmp/cp-046-spec only.
## Open Questions
- How are setup values handed to YAML?
## Research Context
- Command-flow stress test.
EOF
git status --porcelain > /tmp/cp-046-pre.txt
cat > /tmp/cp-046-task.txt <<'EOF'
Task ID: CP-046-TASK-001.
In /tmp/cp-046-sandbox/, run /spec_kit:deep-research:auto for setup-binding evidence.
Stay strictly inside /tmp/cp-046-sandbox/ and /tmp/cp-046-spec/.
Acceptance: create deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, a rendered iteration prompt, and one packet-local iteration artifact.
Return status, artifact_dir, setup_values, evidence_files, and notes.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-046-task.txt)" > /tmp/cp-046-prompt-A.txt
copilot -p "$(cat /tmp/cp-046-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-046-sandbox --add-dir /tmp/cp-046-spec 2>&1 | tee /tmp/cp-046-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-046-A-exit.txt
rm -rf /tmp/cp-046-sandbox && cp -a /tmp/cp-046-sandbox-baseline /tmp/cp-046-sandbox
cd /tmp/cp-046-sandbox
copilot -p "/spec_kit:deep-research:auto \"CP-046 setup binding handoff across command and YAML\" --spec-folder=/tmp/cp-046-spec --max-iterations=1 --convergence=0.05" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-046-sandbox --add-dir /tmp/cp-046-spec 2>&1 | tee /tmp/cp-046-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-046-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
diff -u /tmp/cp-046-sandbox-baseline/.opencode/agent/deep-research.md /tmp/cp-046-sandbox/.opencode/agent/deep-research.md > /tmp/cp-046-B-canonical.diff; echo "POST_B_CANONICAL_DIFF=$?" | tee /tmp/cp-046-B-canonical-exit.txt
find /tmp/cp-046-spec -type f -print0 2>/dev/null | xargs -0 cat > /tmp/cp-046-B-artifacts.txt 2>/dev/null || touch /tmp/cp-046-B-artifacts.txt
cat /tmp/cp-046-B-command.txt /tmp/cp-046-B-artifacts.txt > /tmp/cp-046-B-combined.txt
git status --porcelain > /tmp/cp-046-post.txt
diff /tmp/cp-046-pre.txt /tmp/cp-046-post.txt > /tmp/cp-046-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-046-tripwire-exit.txt
{ grep -c 'deep-research-config.json\|"maxIterations"[[:space:]]*:[[:space:]]*1' /tmp/cp-046-B-combined.txt; grep -c 'CP-046 setup binding handoff' /tmp/cp-046-B-combined.txt; grep -c 'deep-research-strategy.md' /tmp/cp-046-B-combined.txt; grep -c 'prompts/iteration-1.md\|prompts/iteration-001.md' /tmp/cp-046-B-combined.txt; grep -c 'iterations/iteration-001.md' /tmp/cp-046-B-combined.txt; grep -c 'spec_kit_deep-research_auto.yaml\|AUTONOMOUS' /tmp/cp-046-B-combined.txt; grep -q 'POST_B_CANONICAL_DIFF=0' /tmp/cp-046-B-canonical-exit.txt && echo 1 || echo 0; grep -q 'TRIPWIRE_DIFF_EXIT=0' /tmp/cp-046-tripwire-exit.txt && echo 1 || echo 0; } | tee /tmp/cp-046-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-046 | SETUP_YAML_HANDOFF | Confirm command setup binds values before YAML dispatch | Same task body in §2 | Run the §3 bash block | B field counts all >= 1 | `/tmp/cp-046-B-combined.txt`, `/tmp/cp-046-B-field-counts.txt`, diffs | PASS if setup artifacts and clean diffs exist | 1. If config is missing, inspect setup phase. 2. If prompt is missing, inspect YAML pre-dispatch. 3. If canonical diff is non-empty, repair command containment. |

## 4. SOURCE ANCHORS

| File | Anchor |
|---|---|
| `.opencode/command/spec_kit/deep-research.md:7-23` | Markdown setup must resolve inputs before YAML load |
| `.opencode/command/spec_kit/deep-research.md:46-149` | single setup prompt and required bindings |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:143-150` | preflight rejects missing bindings |
| `.opencode/skill/sk-deep-research/SKILL.md:46-64` | command-owned workflow is mandatory |
| `.opencode/agent/deep-research.md:34-39` | agent body hard-blocks missing state |

## 5. SOURCE METADATA

- Group: Command Flow Stress
- Playbook ID: CP-046
- Layer partition: command-flow
- Preflight: 13/13 questions pass
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--command-flow-stress-tests/046-setup-yaml-handoff.md`
- Sandbox: `/tmp/cp-046-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~5-8 min
