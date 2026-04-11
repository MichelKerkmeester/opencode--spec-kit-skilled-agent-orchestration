---
title: "Journal Wiring Boundary Coverage"
feature_id: "RT-032"
category: "Runtime Truth"
---

# Journal Wiring Boundary Coverage

Validates that the `/improve:agent` autonomous workflow wires `improvement-journal.cjs` at every required boundary: `session_start`, per-iteration lifecycle checkpoints, and `session_end`.

Given: a fresh `/improve:agent` `:auto` session.
When: the operator runs the session end-to-end or inspects `.opencode/command/improve/assets/improve_agent-improver_auto.yaml`.
Then: journal events appear in `improvement-journal.jsonl` for every boundary, the CLI example in `.opencode/command/improve/agent.md` executes as written against a temp target, and the frozen `STOP_REASONS` / `SESSION_OUTCOMES` enums match the helper validator.

## Prompt / Command

```text
/improve:agent ".opencode/agent/handover.md" :auto --spec-folder={spec} --iterations=2
```

### Verification (copy-paste)

```bash
AUTO_YAML=.opencode/command/improve/assets/improve_agent-improver_auto.yaml
TMP_SPEC="$(mktemp -d /tmp/improve-agent-journal-XXXXXX)"
TMP_JOURNAL="$TMP_SPEC/improvement/improvement-journal.jsonl"

grep -n "improvement-journal.cjs\|--emit" "$AUTO_YAML"

python3 - <<'PY'
from pathlib import Path
yaml_text = Path(".opencode/command/improve/assets/improve_agent-improver_auto.yaml").read_text()
required = [
    "session_start",
    "candidate_generated",
    "candidate_scored",
    "gate_evaluation",
    "session_end",
]
missing = [token for token in required if token not in yaml_text]
assert not missing, f"Missing journal boundaries in auto YAML: {missing}"
print("PASS — auto YAML covers start, iteration, and end boundaries")
PY

node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit session_start --journal "$TMP_JOURNAL" --details '{"sessionId":"imp-2026-04-11T12-00-00Z","target":"deep-research","charter":"...","startedAt":"2026-04-11T12:00:00Z"}'

node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read "$TMP_JOURNAL" | python3 -c "
import sys, json
events = json.load(sys.stdin)
assert len(events) == 1 and events[0]['eventType'] == 'session_start', 'CLI example did not emit session_start'
print('PASS — command doc CLI example executed successfully')
"

grep -A 5 "STOP_REASONS\|SESSION_OUTCOMES" .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs

python3 - <<'PY'
from pathlib import Path
doc = Path(".opencode/command/improve/agent.md").read_text()
script = Path(".opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs").read_text()
required_stop = [
    "converged",
    "maxIterationsReached",
    "blockedStop",
    "manualStop",
    "error",
    "stuckRecovery",
]
required_outcomes = [
    "keptBaseline",
    "promoted",
    "rolledBack",
    "advisoryOnly",
]
for token in required_stop + required_outcomes:
    assert token in doc, f"Missing enum token in command doc: {token}"
    assert token in script, f"Missing enum token in helper: {token}"
print("PASS — command doc taxonomy matches improvement-journal.cjs enums")
PY

rm -rf "$TMP_SPEC"
```

## Expected Signals

- `.opencode/command/improve/assets/improve_agent-improver_auto.yaml` contains `improvement-journal.cjs` emission steps for:
  - `session_start` before the first loop iteration
  - `candidate_generated`, `candidate_scored`, and `gate_evaluation` inside each iteration
  - `session_end` after synthesis completes
- The CLI example from `.opencode/command/improve/agent.md` executes successfully against a temp journal target with exit code `0`
- `improvement-journal.cjs` exports frozen `STOP_REASONS` and `SESSION_OUTCOMES` enums
- `validateEvent()` accepts only those enum members for `session_end` / `session_ended`
- The command doc taxonomy in `agent.md` matches the helper's internal validator and does not drift

## Pass Criteria

The autonomous YAML contains journal emission coverage for all three boundary groups (session start, per-iteration lifecycle checkpoints, session end), the CLI example from `.opencode/command/improve/agent.md` runs successfully as written against a temp journal path, and the stop-reason / session-outcome enums in the command doc match the frozen values enforced by `improvement-journal.cjs`.

## Failure Triage

- If any boundary is missing from the YAML: add or restore the missing `step_emit_journal_event*` command in `improve_agent-improver_auto.yaml`
- If the CLI example exits non-zero: copy the exact example from `.opencode/command/improve/agent.md` and reconcile the helper CLI contract (`--emit`, `--journal`, `--details`)
- If `session_end` is emitted but validation fails: compare the emitted `details.stopReason` / `details.sessionOutcome` values against the frozen enums in `improvement-journal.cjs`
- If the doc taxonomy drifts from the helper: update the command doc and helper together so the runtime contract stays frozen

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste YAML boundary matches, CLI example output, and enum grep results]
```
