---
title: "GB-004 -- Family Affinity Guard"
description: "This scenario validates Family Affinity Guard for `GB-004`. It focuses on keeping family boosts from surfacing CLI siblings that have no independent evidence."
---

# GB-004 -- Family Affinity Guard

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GB-004`.

---

## 1. OVERVIEW

This scenario validates Family Affinity Guard for `GB-004`. It focuses on keeping family boosts from surfacing CLI siblings that have no independent evidence.

### Why This Matters

If family affinity is too loose, explicit Codex requests will drag in unrelated CLI siblings and make the routing output noisy or misleading.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `GB-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify family affinity does not boost zero-evidence CLI siblings
- Real user request: `"use codex cli for generation"`
- Prompt: `As a graph boost validation operator, validate family affinity behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "use codex cli for generation" --threshold 0. Verify cli-codex is top-1 and sibling CLI skills do not appear from !graph:family evidence alone. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: cli-codex is top-1, sibling CLI skills are absent or carry non-graph evidence, and no sibling appears with only `!graph:family(cli)`
- Pass/fail: PASS if cli-codex is top-1 and siblings are absent or independently supported; FAIL if siblings appear with graph-family evidence only

---

## 3. TEST EXECUTION

### Prompt

`As a graph boost validation operator, validate family affinity behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "use codex cli for generation" --threshold 0. Verify cli-codex is top-1 and sibling CLI skills do not appear from !graph:family evidence alone. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "use codex cli for generation" --threshold 0`

### Expected

cli-codex ranks first. The sibling CLI skills do not appear from family affinity alone, although a sibling may still appear if the prompt also gives it direct lexical evidence.

### Evidence

Capture the full JSON output and inspect every sibling CLI entry, if any, so the evidence shows whether it has non-graph reasons in addition to any family boost.

### Pass/Fail

- **Pass**: cli-codex is top-1 and any sibling CLI result has direct evidence beyond `!graph:family(cli)`
- **Fail**: A sibling CLI appears with only family-boost evidence, or cli-codex is not top-1

### Failure Triage

Review family affinity handling in `.opencode/skill/skill-advisor/scripts/skill_advisor.py`. Check `.opencode/skill/cli-codex/graph-metadata.json` and the compiled `.opencode/skill/skill-advisor/scripts/skill-graph.json` family map for unintended sibling expansion. Confirm the ghost guard still filters graph-only siblings.

---

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Skill routing engine that applies family affinity and ghost-guard filtering |
| `.opencode/skill/cli-codex/graph-metadata.json` | CLI family metadata for the direct-match skill under test |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Compiled family map used to derive sibling affinity boosts |

---

## 5. SOURCE METADATA

- Group: Graph Boosts
- Playbook ID: GB-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--graph-boosts/004-family-affinity.md`
