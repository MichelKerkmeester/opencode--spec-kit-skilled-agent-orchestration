---
title: "Fresh-Session Continuation After Archive"
feature_id: "RT-027"
category: "Runtime Truth"
---

# Fresh-Session Continuation After Archive

Validates that the current release uses standalone `new`-mode sessions, so continuation happens by archiving the previous run and starting a fresh `/improve:improve-agent` session.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate current-release continuation guidance against the sk-improve-agent session model and journal behavior. Verify archived evidence stays intact, each new invocation starts in `new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`improvement/` directory is preserved under `improvement_archive/` before the next run begins. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`new` mode with a fresh session id, and iteration numbering restarts at 1. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

Step 1 -- Run the initial session (2 iterations):
```text
/improve:improve-agent ".opencode/agent/debug.md" :confirm --spec-folder={spec} --iterations=2
```

Step 2 -- Archive the previous session folder:
```bash
ARCHIVE_ROOT="{spec}/improvement_archive/$(date +%Y%m%d-%H%M%S)"
mkdir -p "{spec}/improvement_archive"
mv "{spec}/improvement" "$ARCHIVE_ROOT"
```

Step 3 -- Start a fresh session against the same target:
```text
/improve:improve-agent ".opencode/agent/debug.md" :confirm --spec-folder={spec} --iterations=2
```

### Verification (copy-paste)

```bash
ARCHIVE_ROOT="$(ls -dt {spec}/improvement_archive/* | head -1)"
test -d "$ARCHIVE_ROOT"

ARCHIVE_ROOT="$(ls -dt {spec}/improvement_archive/* | head -1)"
test -d "$ARCHIVE_ROOT"

ARCHIVE_ROOT="$(ls -dt {spec}/improvement_archive/* | head -1)"
test -d "$ARCHIVE_ROOT"

ARCHIVE_ROOT="$(ls -dt {spec}/improvement_archive/* | head -1)"
test -d "$ARCHIVE_ROOT"

node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --read {spec}/improvement/improvement-journal.jsonl | python3 -c "
import sys, json
events = json.load(sys.stdin)
starts = [e for e in events if e['eventType'] == 'session_start']
assert len(starts) >= 1, f'Expected at least 1 session_start event in the fresh session, got {len(starts)}'
details = starts[0].get('details', {})
assert details.get('lineageMode', 'new') == 'new', f"Expected lineageMode new, got {details.get('lineageMode')}"
assert details.get('generation', 1) == 1, f"Expected generation 1, got {details.get('generation')}"
print('PASS — fresh session starts in new mode after archive')
"
```

## Expected

- The archived `improvement/` directory is preserved under `improvement_archive/` before the next run begins
- The fresh run creates a new `improvement/` directory instead of reusing the archived one
- The fresh session starts in `new` mode with a new session id and generation `1`
- Iteration numbering restarts from `1` in the fresh session journal
- No unsupported lineage flags or multi-generation session behaviors are required or documented as shipped

## Pass Criteria

After archiving the prior runtime folder and starting a fresh session, the repository preserves the old evidence separately, the new session journal starts in `new` mode with generation `1`, and the fresh run begins again at iteration `1` without claiming unshipped continuation semantics.

## Failure Triage

- If the archive step fails: verify the spec folder path is correct and `improvement/` exists before moving it
- If the fresh run reuses the archived directory: inspect the init phase to confirm it always creates a new runtime folder
- If lineage metadata is not `new` / generation `1`: compare the emitted `session_start` details against the current-release session model in `SKILL.md`
- If docs still mention unsupported lineage flags or multi-generation continuation modes: remove the stale wording from the playbook and command examples

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste the archive path plus the fresh `session_start` event showing `lineageMode: "new"` and `generation: 1`]
```
