---
title: "070 -- Dead code removal"
description: "This scenario validates Dead code removal for `070`. It focuses on Confirm dead path elimination."
---

# 070 -- Dead code removal

## 1. OVERVIEW

This scenario validates Dead code removal for `070`. It focuses on Confirm documented removals remain absent.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm documented removals remain absent.
- Real user request: `Please validate Dead code removal against isShadowScoringEnabled and tell me whether the expected signals are present: Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors.`
- RCAF Prompt: `As a tooling validation operator, validate Dead code removal against isShadowScoringEnabled. Verify removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the documented removals have zero live references and representative flows execute cleanly

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm documented removals remain absent against isShadowScoringEnabled. Verify removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Search for removed branch helpers and symbols: `isShadowScoringEnabled`, `isRsfEnabled`, `stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, `computeCausalDepth`, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`
2. Search for removed working-memory config fields: `decayInterval`, `attentionDecayRate`, `minAttentionScore`
3. Run representative flows
4. Confirm no missing-reference errors

### Expected

Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors

### Evidence

Empty symbol-search output + representative flow transcripts

### Pass / Fail

- **Pass**: the documented removals have zero live references and representative flows execute cleanly
- **Fail**: any removed symbol is still wired or a representative flow trips a missing reference

### Failure Triage

Re-check the dead-code audit list against the codebase; inspect string-based references; run targeted regression suites for the affected subsystems

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/04-dead-code-removal.md](../../feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 070
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/070-dead-code-removal.md`
