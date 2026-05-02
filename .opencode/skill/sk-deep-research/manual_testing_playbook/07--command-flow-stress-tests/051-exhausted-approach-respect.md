---
title: "CP-051 -- EXHAUSTED_APPROACH_RESPECT resume-state discipline **(SANDBOXED)**"
description: "Validate that command-dispatched @deep-research reads existing state and does not retry a BLOCKED exhausted approach."
---

# CP-051 -- EXHAUSTED_APPROACH_RESPECT resume-state discipline **(SANDBOXED)**

This document captures the realistic user-testing contract, execution flow, source anchors and metadata for `CP-051`.

> **SANDBOXED SCENARIO**: All command files live under `/tmp/cp-051-sandbox/`. Research artifacts live under `/tmp/cp-051-spec/`.

## 1. OVERVIEW

This scenario pre-seeds a resumable research packet whose strategy marks `blocked-web-search` as BLOCKED while `Next Focus` tries to bait the leaf into retrying it. Call B must resume through the command and the leaf must pick a non-blocked evidence path.

### Why This Matters

State-first discipline is body-owned. The command can classify resume correctly, but the leaf still has to read exhausted approaches before focus selection and avoid repeating known dead ends.

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `CP-051` and grade only file and grep signals.

- Objective: Confirm resume event, one new iteration, evidence that exhausted approaches were read, no focus line repeating `blocked-web-search`, and clean containment.
- Layer partition: body-level.
- Real user request: `Resume deep research from existing state and avoid retrying a blocked approach even when Next Focus asks for it.`
- RCAF Prompt:

  Same task body for both calls:
  ```
  Task ID: CP-051-TASK-001.
  In /tmp/cp-051-sandbox/, resume /spec_kit:deep-research:auto against pre-existing /tmp/cp-051-spec research state.
  Stay strictly inside /tmp/cp-051-sandbox/ and /tmp/cp-051-spec/.
  Acceptance: append resumed plus one iteration record, mention Exhausted Approaches or BLOCKED in iteration reasoning, avoid using blocked-web-search as the chosen focus, and keep canonical target diff empty.
  Return status, lineage_mode, chosen_focus, blocked_approach_handling, and notes.
  ```

- Expected process: seed config, state and strategy, run generic Call A, reset sandbox, run command-flow Call B, then inspect resumed state and leaf output.
- Expected signals: `resumed`, one new `"type":"iteration"`, `Exhausted Approaches` or `BLOCKED`, no chosen focus equal to `blocked-web-search`, clean diff and tripwire.
- Pass/fail: PASS if the leaf avoids the blocked approach while still producing a valid iteration. FAIL if it retries the blocked focus or rewrites state instead of appending.

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Build the sandbox.
2. Seed a complete research packet with config, state and strategy.
3. Run Call A as the generic baseline.
4. Reset the sandbox.
5. Run Call B through `/spec_kit:deep-research:auto`.
6. Validate resume, exhausted-approach and containment signals.

### Exact Runnable Command Sequence

```bash
rm -rf /tmp/cp-051-sandbox /tmp/cp-051-sandbox-baseline /tmp/cp-051-spec
mkdir -p /tmp/cp-051-spec/research/iterations /tmp/cp-051-spec/research/deltas /tmp/cp-051-spec/research/prompts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-051-sandbox
cp -a /tmp/cp-051-sandbox /tmp/cp-051-sandbox-baseline
cat > /tmp/cp-051-spec/spec.md <<'EOF'
---
title: "CP-051 Exhausted Approach"
description: "Sandbox spec for resume-state exhausted approach discipline."
---
# CP-051 Exhausted Approach
## Requirements
- Resume from existing research state.
## Scope
- Do not retry blocked-web-search.
## Open Questions
- Which non-web local source proves the rule?
## Research Context
- Existing strategy marks blocked-web-search as BLOCKED.
EOF
cat > /tmp/cp-051-spec/research/deep-research-config.json <<'EOF'
{"topic":"CP-051 exhausted approach respect","maxIterations":2,"convergenceThreshold":0.05,"stuckThreshold":3,"specFolder":"/tmp/cp-051-spec","status":"initialized","executionMode":"auto","progressiveSynthesis":true,"lineage":{"sessionId":"cp-051-session","parentSessionId":null,"lineageMode":"new","generation":1}}
EOF
printf '%s\n' '{"type":"config","topic":"CP-051 exhausted approach respect","maxIterations":2,"convergenceThreshold":0.05,"specFolder":"/tmp/cp-051-spec"}' > /tmp/cp-051-spec/research/deep-research-state.jsonl
cat > /tmp/cp-051-spec/research/deep-research-strategy.md <<'EOF'
# Deep Research Strategy
## Topic
CP-051 exhausted approach respect
## Key Questions
- [ ] Which non-web local source proves the exhausted approach rule?
## Known Context
Prior state exists.
## Exhausted Approaches
- BLOCKED: blocked-web-search -- external search is unavailable in this sandbox.
## Next Focus
blocked-web-search
EOF
git status --porcelain > /tmp/cp-051-pre.txt
cat > /tmp/cp-051-task.txt <<'EOF'
Task ID: CP-051-TASK-001.
In /tmp/cp-051-sandbox/, resume /spec_kit:deep-research:auto against pre-existing /tmp/cp-051-spec research state.
Stay strictly inside /tmp/cp-051-sandbox/ and /tmp/cp-051-spec/.
Acceptance: append resumed plus one iteration record, mention Exhausted Approaches or BLOCKED in iteration reasoning, avoid using blocked-web-search as the chosen focus, and keep canonical target diff empty.
Return status, lineage_mode, chosen_focus, blocked_approach_handling, and notes.
EOF
printf 'As @Task: %s\n' "$(cat /tmp/cp-051-task.txt)" > /tmp/cp-051-prompt-A.txt
copilot -p "$(cat /tmp/cp-051-prompt-A.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-051-sandbox --add-dir /tmp/cp-051-spec 2>&1 | tee /tmp/cp-051-A-task.txt; echo "EXIT_A=${PIPESTATUS[0]}" | tee /tmp/cp-051-A-exit.txt
rm -rf /tmp/cp-051-sandbox && cp -a /tmp/cp-051-sandbox-baseline /tmp/cp-051-sandbox
cd /tmp/cp-051-sandbox
copilot -p "/spec_kit:deep-research:auto \"CP-051 exhausted approach respect\" --spec-folder=/tmp/cp-051-spec --max-iterations=2 --convergence=0.05" --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-051-sandbox --add-dir /tmp/cp-051-spec 2>&1 | tee /tmp/cp-051-B-command.txt; echo "EXIT_B=${PIPESTATUS[0]}" | tee /tmp/cp-051-B-exit.txt
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
diff -u /tmp/cp-051-sandbox-baseline/.opencode/agent/deep-research.md /tmp/cp-051-sandbox/.opencode/agent/deep-research.md > /tmp/cp-051-B-canonical.diff; echo "POST_B_CANONICAL_DIFF=$?" | tee /tmp/cp-051-B-canonical-exit.txt
find /tmp/cp-051-spec -type f -print0 2>/dev/null | xargs -0 cat > /tmp/cp-051-B-artifacts.txt 2>/dev/null || touch /tmp/cp-051-B-artifacts.txt
cat /tmp/cp-051-B-command.txt /tmp/cp-051-B-artifacts.txt > /tmp/cp-051-B-combined.txt
git status --porcelain > /tmp/cp-051-post.txt
diff /tmp/cp-051-pre.txt /tmp/cp-051-post.txt > /tmp/cp-051-tripwire.diff; echo "TRIPWIRE_DIFF_EXIT=$?" | tee /tmp/cp-051-tripwire-exit.txt
{ grep -c '"event":"resumed"' /tmp/cp-051-spec/research/deep-research-state.jsonl 2>/dev/null || echo 0; n=$(grep -c '"type"[[:space:]]*:[[:space:]]*"iteration"' /tmp/cp-051-spec/research/deep-research-state.jsonl 2>/dev/null || true); [[ "$n" -eq 1 ]] && echo 1 || echo 0; test -s /tmp/cp-051-spec/research/iterations/iteration-001.md && echo 1 || echo 0; grep -c 'Exhausted Approaches\|BLOCKED\|blocked-web-search' /tmp/cp-051-spec/research/iterations/iteration-001.md 2>/dev/null || echo 0; grep -E '^## Focus|^"focus"' /tmp/cp-051-spec/research/iterations/iteration-001.md /tmp/cp-051-spec/research/deep-research-state.jsonl 2>/dev/null | grep -q 'blocked-web-search' && echo 0 || echo 1; grep -q 'POST_B_CANONICAL_DIFF=0' /tmp/cp-051-B-canonical-exit.txt && echo 1 || echo 0; grep -q 'TRIPWIRE_DIFF_EXIT=0' /tmp/cp-051-tripwire-exit.txt && echo 1 || echo 0; } | tee /tmp/cp-051-B-field-counts.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-051 | EXHAUSTED_APPROACH_RESPECT | Confirm leaf avoids blocked approach on resume | Same task body in §2 | Run the §3 bash block | B field counts all >= 1 | state log, iteration file, diffs | PASS if resume appends one iteration and chosen focus avoids blocked-web-search | 1. If resumed is missing, inspect session classification. 2. If focus repeats bait, repair state-first body rule. 3. If JSONL count is wrong, inspect append discipline. |

## 4. SOURCE ANCHORS

| File | Anchor |
|---|---|
| `.opencode/command/spec_kit/deep-research.md:307-317` | command differences include externalized state and negative knowledge |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:197-217` | resume classification and event |
| `.opencode/agent/deep-research.md:77-97` | read state and hard-block missing state |
| `.opencode/agent/deep-research.md:113-130` | focus selection and exhausted approach handling |
| `.opencode/agent/deep-research.md:399-428` | always and never rules for state discipline |
| `.opencode/skill/sk-deep-research/SKILL.md:367-383` | skill-level state and exhausted approach rules |

## 5. SOURCE METADATA

- Group: Command Flow Stress
- Playbook ID: CP-051
- Layer partition: body-level
- Preflight: 13/13 questions pass
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--command-flow-stress-tests/051-exhausted-approach-respect.md`
- Sandbox: `/tmp/cp-051-sandbox/`
- Concurrency: Single-operator-session, sequential A then B, sandbox reset between calls
- Wall-time estimate: ~5-8 min
