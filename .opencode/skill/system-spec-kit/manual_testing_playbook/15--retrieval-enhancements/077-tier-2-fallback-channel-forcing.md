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

Operators run the exact prompt and command sequence for `077` and confirm the expected signals without contradicting evidence.

- Objective: Confirm force-all-channels in tier-2
- Prompt: `As a retrieval-enhancement validation operator, validate Tier-2 fallback channel forcing against the documented validation surface. Verify tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels
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

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md](../../feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 077
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/077-tier-2-fallback-channel-forcing.md`
