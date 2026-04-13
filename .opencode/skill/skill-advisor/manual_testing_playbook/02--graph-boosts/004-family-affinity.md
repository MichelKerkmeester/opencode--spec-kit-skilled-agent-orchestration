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

- Objective: Verify cli-codex stays top-1 while generic CLI vocabulary can legitimately surface sibling CLIs with lexical evidence
- Real user request: `"use codex cli for generation"`
- Prompt: `As a graph boost validation operator, validate family affinity behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "use codex cli for generation" --threshold 0. Verify cli-codex is top-1, note that other CLI siblings may appear when shared CLI vocabulary gives them legitimate lexical evidence, and confirm the ghost guard only blocks skills with zero pre-graph evidence. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: cli-codex is top-1, other CLI siblings may appear when the prompt's shared `cli` vocabulary gives them legitimate lexical evidence, and the ghost guard only blocks skills with zero pre-graph evidence
- Pass/fail: PASS if cli-codex is top-1; other CLIs are acceptable when the prompt contains generic CLI vocabulary. FAIL only if a non-CLI skill appears from graph propagation alone, or if cli-codex is not top-1

---

## 3. TEST EXECUTION

### Prompt

`As a graph boost validation operator, validate family affinity behavior against .opencode/skill/skill-advisor/scripts/skill_advisor.py "use codex cli for generation" --threshold 0. Verify cli-codex is top-1 and sibling CLI skills do not appear from !graph:family evidence alone. Return a concise pass/fail verdict with the main reason and cited evidence.`

### Commands

1. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "use codex cli for generation" --threshold 0`

### Expected

cli-codex is top-1. Other CLI siblings MAY appear if the prompt contains shared CLI vocabulary like the word cli, because they have legitimate lexical evidence from that shared term. The ghost guard only blocks skills with zero pre-graph evidence.

### Evidence

Capture the full JSON output and inspect every sibling CLI entry, if any, so the evidence shows whether it has non-graph reasons in addition to any family boost.

### Pass/Fail

- **Pass**: cli-codex is top-1. Other CLIs appearing is acceptable when the prompt contains generic CLI vocabulary.
- **Fail**: A non-CLI skill appears from graph propagation alone, or cli-codex is not top-1

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
