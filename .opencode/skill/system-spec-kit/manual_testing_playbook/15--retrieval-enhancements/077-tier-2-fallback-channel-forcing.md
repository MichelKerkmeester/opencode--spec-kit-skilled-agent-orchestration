---
title: "077 -- Tier-2 fallback channel forcing"
description: "This scenario validates Tier-2 fallback channel forcing for `077`. It focuses on Confirm force-all-channels in tier-2."
audited_post_018: true
---

# 077 -- Tier-2 fallback channel forcing

## 1. OVERVIEW

This scenario validates Tier-2 fallback channel forcing for `077`. It focuses on Confirm force-all-channels in tier-2.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm force-all-channels in tier-2.
- Real user request: `Please validate Tier-2 fallback channel forcing against the documented validation surface and tell me whether the expected signals are present: Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Tier-2 fallback channel forcing against the documented validation surface. Verify tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if tier-2 fallback forces all channels active and results show multi-channel contribution

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, confirm force-all-channels in tier-2 against the documented validation surface. Verify tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. trigger tier-2 fallback
2. inspect options
3. confirm all channels forced

### Expected

Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels

### Evidence

Tier-2 trigger evidence + channel options snapshot + per-channel contribution in results

### Pass / Fail

- **Pass**: tier-2 fallback forces all channels active and results show multi-channel contribution
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect tier-2 trigger conditions; verify forceAllChannels flag propagation; check channel activation logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md](../../feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 077
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/077-tier-2-fallback-channel-forcing.md`
