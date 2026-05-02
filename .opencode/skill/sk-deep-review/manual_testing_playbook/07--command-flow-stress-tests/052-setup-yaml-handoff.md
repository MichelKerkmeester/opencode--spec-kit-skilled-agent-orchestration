---
title: "CP-052 -- Deep-review setup-to-YAML handoff **(SANDBOXED)**"
description: "Validate that /spec_kit:deep-review resolves setup inputs before loading the auto YAML workflow."
---

# CP-052 -- Deep-review setup-to-YAML handoff **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CP-052`.

> **SANDBOXED SCENARIO**: All artifacts live under `/tmp/cp-052-sandbox/` and `/tmp/cp-052-spec/`.

## 1. OVERVIEW

This scenario checks the command-owned entrypoint. The differentiator is whether Call B binds target, mode, dimensions, spec folder, max iterations, and convergence before handing off to `spec_kit_deep-review_auto.yaml`.

### Why This Matters

The deep-review command says markdown owns setup and YAML must not load until all required inputs are bound. If setup is skipped, the loop can start with stale or ambiguous state.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence and judge only grep-checkable signals.

- Objective: Confirm command setup resolves inputs and creates canonical review state before iteration dispatch.
- Layer partition: command-flow.
- Real user request: `Run an autonomous one-iteration deep review of the deep-review agent with explicit setup flags.`
- Expected execution process: build sandbox, snapshot baseline, invoke `/spec_kit:deep-review:auto`, then inspect transcript plus review artifacts.
- Expected signals: transcript names auto YAML or setup handoff; artifacts include `deep-review-config.json`, `deep-review-state.jsonl`, and `deep-review-strategy.md`; config/state name `agent:deep-review`, `auto`, `maxIterations`, and `convergenceThreshold`; canonical agent diff and project tripwire are empty.
- Desired outcome: PASS verdict proving command markdown did setup rather than letting YAML infer missing bindings.
- Pass/fail: PASS if every field count is `1+`; FAIL if YAML runs without setup state, artifacts are missing, or sandbox/canonical files are mutated.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Create `/tmp/cp-052-sandbox/` with command, skill, system helpers, and runtime mirrors.
2. Copy a baseline for sandbox-only diff checks.
3. Invoke the command from inside the sandbox with explicit target and setup flags.
4. Aggregate transcript and review artifacts into one file.
5. Write one line per signal to `/tmp/cp-052-B-field-counts.txt`.

### Exact Runnable Command Sequence

```bash
set -uo pipefail
rm -rf /tmp/cp-052-sandbox /tmp/cp-052-sandbox-baseline /tmp/cp-052-spec
mkdir -p /tmp/cp-052-spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-052-sandbox
cp -a /tmp/cp-052-sandbox /tmp/cp-052-sandbox-baseline
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain -- /tmp/cp-052-sandbox /tmp/cp-052-spec > /tmp/cp-052-pre.txt
cd /tmp/cp-052-sandbox
copilot -p "/spec_kit:deep-review:auto \"agent:deep-review\" --spec-folder=/tmp/cp-052-spec --max-iterations=1 --convergence=0.10 --no-resource-map. Use target type agent and dimensions traceability. Do not ask follow-up setup questions." --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-052-sandbox --add-dir /tmp/cp-052-spec 2>&1 | tee /tmp/cp-052-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-052-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
find /tmp/cp-052-spec -type f \( -name '*.json' -o -name '*.jsonl' -o -name '*.md' \) -print0 2>/dev/null | xargs -0 cat > /tmp/cp-052-B-artifacts.txt 2>/dev/null || touch /tmp/cp-052-B-artifacts.txt
cat /tmp/cp-052-B-command.txt /tmp/cp-052-B-artifacts.txt > /tmp/cp-052-B-combined.txt
diff -ru /tmp/cp-052-sandbox-baseline/.opencode/agent /tmp/cp-052-sandbox/.opencode/agent > /tmp/cp-052-agent.diff; echo "AGENT_DIFF=$?" > /tmp/cp-052-agent-diff-exit.txt
git status --porcelain -- /tmp/cp-052-sandbox /tmp/cp-052-spec > /tmp/cp-052-post.txt
diff /tmp/cp-052-pre.txt /tmp/cp-052-post.txt > /tmp/cp-052-tripwire.diff; echo "TRIPWIRE_DIFF=$?" > /tmp/cp-052-tripwire-exit.txt
field(){ label="$1"; pattern="$2"; file="$3"; count=$(grep -E -c "$pattern" "$file" 2>/dev/null || true); if [ "$count" -gt 0 ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
diff_field(){ label="$1"; file="$2"; if [ ! -s "$file" ]; then echo "$label: 1+"; else echo "$label: 0"; fi; }
{
  field "auto_yaml_loaded" "spec_kit_deep-review_auto.yaml|AUTONOMOUS|auto mode" /tmp/cp-052-B-combined.txt
  field "config_created" "deep-review-config.json|\"mode\"[[:space:]]*:[[:space:]]*\"review\"" /tmp/cp-052-B-combined.txt
  field "state_config_record" "\"type\"[[:space:]]*:[[:space:]]*\"config\"" /tmp/cp-052-B-combined.txt
  field "target_bound" "agent:deep-review|\"reviewTarget\"" /tmp/cp-052-B-combined.txt
  field "max_iterations_bound" "maxIterations|\"maxIterations\"[[:space:]]*:[[:space:]]*1" /tmp/cp-052-B-combined.txt
  field "convergence_bound" "convergenceThreshold|0.10" /tmp/cp-052-B-combined.txt
  diff_field "sandbox_agent_diff_clean" /tmp/cp-052-agent.diff
  diff_field "project_tripwire_clean" /tmp/cp-052-tripwire.diff
} | tee /tmp/cp-052-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-052 | SETUP_YAML_HANDOFF | Prove command setup owns input binding before YAML execution | Prompt embedded in §3 command block | Run §3 exactly | All `/tmp/cp-052-B-field-counts.txt` lines are `1+` | Transcript, combined artifacts, field counts, agent diff, tripwire diff | PASS if setup state exists and target/mode/numeric inputs are bound | If YAML signal is absent, inspect command entrypoint loading. If state files are absent, inspect init. If diffs are non-empty, investigate write boundary leakage. |

## 4. SOURCE ANCHORS

| File | Lines | Role |
|---|---:|---|
| `.opencode/command/spec_kit/deep-review.md` | 7-25, 43-160, 238-245 | Setup-first command contract and YAML handoff |
| `.opencode/skill/sk-deep-review/SKILL.md` | 43-61, 253-346 | Command-only invocation and three-layer workflow |
| `.opencode/agent/deep-review.md` | 23-33, 218-238 | Agent is single-iteration target and mirrors are read-only |

## 5. SOURCE_METADATA

- Group: Command-flow stress tests
- Playbook ID: CP-052
- Layer partition: command-flow
- Expected verdict mode: GREEN
- Sourcing methodology: 060/004 command-flow stress-test report and 060/003 §7 preflight
- Preflight: 13/13 questions pass
- Sandbox: `/tmp/cp-052-sandbox/`
- Spec root: `/tmp/cp-052-spec/`
- Wall-time estimate: ~5-8 min
