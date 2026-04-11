---
title: "Replay Consumer Artifact Verification"
feature_id: "RT-034"
category: "Runtime Truth"
---

# Replay Consumer Artifact Verification

Validates ADR-002 Option A replay-consumer behavior: `reduce-state.cjs` reads `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json`, writes their summaries into the registry, and degrades gracefully when any one artifact is missing.

Given: an improvement runtime where `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` are all present.
When: the operator runs `reduce-state.cjs` and then repeats the run with one artifact removed at a time from a disposable runtime copy.
Then: the registry contains `journalSummary`, `candidateLineage`, and `mutationCoverage`; the dashboard renders each as a distinct replay-consumer section; and any missing artifact resolves to `null` without throwing.

## Prompt / Command

```text
node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs {spec}/improvement
```

### Verification (copy-paste)

```bash
RUNTIME_COPY="$(mktemp -d /tmp/improve-agent-replay-XXXXXX)"
cp -R "{spec}/improvement/." "$RUNTIME_COPY/"

node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs "$RUNTIME_COPY"

cat "$RUNTIME_COPY/experiment-registry.json" | jq '.journalSummary, .candidateLineage, .mutationCoverage'
grep -n "Journal Summary\|Candidate Lineage\|Mutation Coverage" "$RUNTIME_COPY/agent-improvement-dashboard.md"

python3 - <<'PY' "$RUNTIME_COPY/experiment-registry.json"
import json, sys
registry = json.load(open(sys.argv[1], 'r', encoding='utf-8'))
js = registry.get('journalSummary')
cl = registry.get('candidateLineage')
mc = registry.get('mutationCoverage')
assert js is not None, 'journalSummary missing'
assert cl is not None, 'candidateLineage missing'
assert mc is not None, 'mutationCoverage missing'
required_js = ['lastSessionStart', 'lastSessionEnd', 'totalEvents', 'eventTypeCounts', 'stopReason', 'sessionOutcome']
required_cl = ['lineageDepth', 'totalCandidates', 'currentLeaf']
required_mc = ['coverageRatio', 'uncoveredMutations']
for key in required_js:
    assert key in js, f'journalSummary missing {key}'
for key in required_cl:
    assert key in cl, f'candidateLineage missing {key}'
for key in required_mc:
    assert key in mc, f'mutationCoverage missing {key}'
print('PASS — reducer populated all three replay consumer summaries')
PY

for artifact in improvement-journal.jsonl candidate-lineage.json mutation-coverage.json; do
  TMP_CASE="$(mktemp -d /tmp/improve-agent-replay-case-XXXXXX)"
  cp -R "$RUNTIME_COPY/." "$TMP_CASE/"
  rm -f "$TMP_CASE/$artifact"
  node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs "$TMP_CASE"
  case "$artifact" in
    improvement-journal.jsonl)
      cat "$TMP_CASE/experiment-registry.json" | jq '.journalSummary'
      test "$(cat "$TMP_CASE/experiment-registry.json" | jq -r '.journalSummary')" = "null"
      ;;
    candidate-lineage.json)
      cat "$TMP_CASE/experiment-registry.json" | jq '.candidateLineage'
      test "$(cat "$TMP_CASE/experiment-registry.json" | jq -r '.candidateLineage')" = "null"
      ;;
    mutation-coverage.json)
      cat "$TMP_CASE/experiment-registry.json" | jq '.mutationCoverage'
      test "$(cat "$TMP_CASE/experiment-registry.json" | jq -r '.mutationCoverage')" = "null"
      ;;
  esac
  rm -rf "$TMP_CASE"
done

rm -rf "$RUNTIME_COPY"
```

## Expected Signals

- `experiment-registry.json` contains:
  - `journalSummary` with `lastSessionStart`, `lastSessionEnd`, `totalEvents`, `eventTypeCounts`, `stopReason`, `sessionOutcome`
  - `candidateLineage` with `lineageDepth`, `totalCandidates`, `currentLeaf`
  - `mutationCoverage` with `coverageRatio`, `uncoveredMutations`
- `agent-improvement-dashboard.md` renders replay-consumer output as distinct sections for journal summary, candidate lineage, and mutation coverage
- Re-running the reducer with any one of the 3 artifacts removed does not throw
- The corresponding registry field resolves to `null` when its source artifact is missing
- The remaining consumer paths still populate normally when only one artifact is absent

## Pass Criteria

With all three replay artifacts present, `reduce-state.cjs` populates `journalSummary`, `candidateLineage`, and `mutationCoverage` in the registry and the dashboard exposes each consumer as a separate section. When any one artifact is missing, the reducer completes successfully and sets only the corresponding field to `null` while preserving the others.

## Failure Triage

- If any registry summary is missing with artifacts present: inspect `buildJournalSummary()`, `buildCandidateLineageSummary()`, or `buildMutationCoverageSummary()` in `reduce-state.cjs`
- If the reducer throws when one artifact is removed: verify `readOptionalUtf8()` / `readOptionalJson()` are still used for graceful degradation
- If a missing artifact silently drops multiple fields: confirm each summary builder is wired independently from its own path
- If the dashboard does not render the replay consumer summaries: add explicit dashboard sections for journal summary, candidate lineage, and mutation coverage instead of leaving them registry-only

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste jq output for journalSummary / candidateLineage / mutationCoverage and one null-on-missing rerun]
```
