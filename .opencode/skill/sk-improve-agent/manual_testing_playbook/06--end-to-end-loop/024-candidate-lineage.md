---
title: "Candidate Lineage Graph Tracking"
feature_id: "E2E-024"
category: "End-to-End Loop"
---

# Candidate Lineage Graph Tracking

Validates that the improvement loop maintains a candidate lineage graph that tracks the parent-child relationships between candidate proposals, including session ID, wave index, spawning mutation type, and parent node references.

## Prompt / Command

```text
/improve:agent ".opencode/agent/debug.md" :confirm --spec-folder=specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment --iterations=3
```

## Expected Signals

- Candidate lineage graph created with per-session node entries
- Each candidate node stores: session-id, wave-index (default 0 for single-wave), spawning mutation type, parent node reference
- Root candidates have null parent; subsequent candidates reference their predecessor
- Lineage is traversable from root to leaf (full candidate history)
- Session-id isolation: lineage from different sessions does not cross-contaminate
- When parallel waves are enabled: multiple candidates per iteration with distinct wave indices

## Pass Criteria

After a 3-iteration improvement run, the candidate lineage graph contains 3 nodes (one per iteration), each with the correct session-id and wave-index (0 for single-wave mode), and the lineage is traversable from the first candidate to the last via parent references.

## Failure Triage

- If no lineage graph is created: verify that `candidate-lineage.cjs` is invoked by the orchestrator after each candidate evaluation
- If parent references are null for all candidates: check that the orchestrator passes the previous candidate's node ID as the parent parameter
- If session-id is missing: verify the session-id is passed through from the config/resume mechanism
- If wave-index is wrong: for single-wave mode, all candidates should have wave-index 0; check that the default is applied correctly
- If parallel wave candidates appear in single-wave mode: verify the `parallelWaves.enabled: false` gate is respected

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output showing lineage nodes with parent references and session IDs]
```
