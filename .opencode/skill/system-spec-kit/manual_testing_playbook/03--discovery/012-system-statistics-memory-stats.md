---
title: "EX-012 -- System statistics (memory_stats)"
description: "This scenario validates System statistics (memory_stats) for `EX-012`. It focuses on System baseline snapshot."
---

# EX-012 -- System statistics (memory_stats)

## 1. OVERVIEW

This scenario validates System statistics (memory_stats) for `EX-012`. It focuses on System baseline snapshot.

---

## 2. SCENARIO CONTRACT


- Objective: System baseline snapshot.
- Real user request: `Please validate System statistics (memory_stats) against memory_stats(folderRanking:composite,includeScores:true) and tell me whether the expected signals are present: Counts, tiers, folder ranking present.`
- RCAF Prompt: `As a discovery validation operator, validate System statistics (memory_stats) against memory_stats(folderRanking:composite,includeScores:true). Verify counts, tiers, folder ranking present. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Counts, tiers, folder ranking present
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if dashboard fields populated; Additional audit scenario: `Return memory_stats from a fixture set that includes at least one partial embedding_status row. Capture the evidence needed to prove the response exposes a partial bucket and that total equals pending + success + failed + retry + partial. Return a concise user-facing pass/fail verdict with the main reason.`; Partial bucket present and included in totals

---

## 3. TEST EXECUTION

### Prompt

```
As a discovery validation operator, validate System baseline snapshot against memory_stats(folderRanking:composite,includeScores:true). Verify counts, tiers, folder ranking present. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_stats(folderRanking:composite,includeScores:true)

### Expected

Counts, tiers, folder ranking present

### Evidence

Stats output

### Pass / Fail

- **Pass**: dashboard fields populated
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Retry with default ranking on scoring error

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [03--discovery/02-system-statistics-memorystats.md](../../feature_catalog/03--discovery/02-system-statistics-memorystats.md)

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: EX-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--discovery/012-system-statistics-memory-stats.md`
- audited_post_018: true
- phase_018_change: Mirror the root playbook's partial-bucket audit scenario for `memory_stats`.
