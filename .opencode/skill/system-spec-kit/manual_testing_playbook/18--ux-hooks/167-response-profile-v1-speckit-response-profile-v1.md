---
title: "167 -- Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1)"
description: "This scenario validates response profile v1 (SPECKIT_RESPONSE_PROFILE_V1) for `167`. It focuses on enabling the flag, requesting the `quick` profile, and verifying reduced response shape."
---

# 167 -- Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1)

## 1. OVERVIEW

This scenario validates response profile v1 (SPECKIT_RESPONSE_PROFILE_V1) for `167`. It focuses on enabling the flag, requesting the `quick` profile, and verifying reduced response shape.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `167` and confirm the expected signals without contradicting evidence.

- Objective: Verify mode-aware response shape routing for the quick profile
- Prompt: `Test SPECKIT_RESPONSE_PROFILE_V1=true with profile=quick. Run a search and verify the response contains only topResult, oneLineWhy, omittedCount, and tokenReduction (with savingsPercent). Then test profile=research for results + evidenceDigest + followUps, and profile=resume for state + nextSteps + blockers. Capture the evidence needed to prove each profile produces its expected shape and token savings are calculated. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: quick profile returns QuickProfile with topResult, oneLineWhy, omittedCount, and tokenReduction.savingsPercent; research profile returns results[], evidenceDigest, followUps[]; resume profile returns state, nextSteps[], blockers[]; original full response when flag OFF or profile omitted
- Pass/fail: PASS if quick profile contains topResult + tokenReduction, research has evidenceDigest, resume has nextSteps, and full response when flag OFF; FAIL if profile shape missing expected fields or token savings not calculated

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 167 | Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1) | Verify quick profile reduced response shape | `Test SPECKIT_RESPONSE_PROFILE_V1=true with profile=quick. Verify topResult, oneLineWhy, omittedCount, and tokenReduction shape. Test other profiles for expected shapes. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_RESPONSE_PROFILE_V1=true` 2) `memory_search({ query: "test profiles", profile: "quick" })` 3) Verify QuickProfile shape 4) Re-run with profile=research, verify ResearchProfile 5) Re-run with profile=resume, verify ResumeProfile | quick: topResult + oneLineWhy + omittedCount + tokenReduction; research: results + evidenceDigest + followUps; resume: state + nextSteps + blockers; full response when flag OFF | Response JSON per profile + token savings calculation | PASS if each profile shape correct and full response when flag OFF; FAIL if shape fields missing or token savings absent | Verify SPECKIT_RESPONSE_PROFILE_V1 env → Inspect profile-formatters.ts profile routing → Check estimateTokens() → Verify QuickProfile.tokenReduction.savingsPercent → Check fallback for unknown profile names |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [18--ux-hooks/15-mode-aware-response-profiles.md](../../feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md)
- Feature flag reference: [19--feature-flag-reference/028-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/response/profile-formatters.ts`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 167
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `18--ux-hooks/167-response-profile-v1-speckit-response-profile-v1.md`
