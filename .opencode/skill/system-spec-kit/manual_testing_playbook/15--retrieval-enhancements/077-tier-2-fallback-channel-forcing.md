---
title: "077 -- Tier-2 fallback channel forcing"
description: "This scenario validates Tier-2 fallback channel forcing for `077`. It focuses on Confirm force-all-channels in tier-2."
---

# 077 -- Tier-2 fallback channel forcing

## 1. OVERVIEW

This scenario validates Tier-2 fallback channel forcing for `077`. It focuses on Confirm force-all-channels in tier-2.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `077` and confirm the expected signals without contradicting evidence.

- Objective: Confirm force-all-channels in tier-2
- Prompt: `Validate tier-2 fallback channel forcing. Capture the evidence needed to prove Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels
- Pass/fail: PASS if tier-2 fallback forces all channels active and results show multi-channel contribution

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 077 | Tier-2 fallback channel forcing | Confirm force-all-channels in tier-2 | `Validate tier-2 fallback channel forcing. Capture the evidence needed to prove Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise user-facing pass/fail verdict with the main reason.` | 1) trigger tier-2 fallback 2) inspect options 3) confirm all channels forced | Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels | Tier-2 trigger evidence + channel options snapshot + per-channel contribution in results | PASS if tier-2 fallback forces all channels active and results show multi-channel contribution | Inspect tier-2 trigger conditions; verify forceAllChannels flag propagation; check channel activation logic |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md](../../feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 077
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `15--retrieval-enhancements/077-tier-2-fallback-channel-forcing.md`
