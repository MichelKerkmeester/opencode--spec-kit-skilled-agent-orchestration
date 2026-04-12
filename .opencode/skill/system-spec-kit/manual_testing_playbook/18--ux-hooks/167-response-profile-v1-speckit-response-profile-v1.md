---
title: "167 -- Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1)"
description: "This scenario validates response profile v1 (SPECKIT_RESPONSE_PROFILE_V1) for `167`. It focuses on enabling the flag, requesting the `quick` profile, and verifying reduced response shape while keeping the live context-side profile routing in view."
---

# 167 -- Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1)

## 1. OVERVIEW

This scenario validates response profile v1 (SPECKIT_RESPONSE_PROFILE_V1) for `167`. It focuses on enabling the flag, requesting the `quick` profile, and verifying reduced response shape while the context-side routing path remains live.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `167` and confirm the expected signals without contradicting evidence.

- Objective: Verify mode-aware response shape routing for the quick profile
- Prompt: `As a runtime-hook validation operator, validate Response profile v1 (SPECKIT_RESPONSE_PROFILE_V1) against SPECKIT_RESPONSE_PROFILE_V1=true. Verify mode-aware response shape routing for the quick profile. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: quick profile returns QuickProfile with topResult, oneLineWhy, omittedCount, and tokenReduction.savingsPercent; research profile returns results[], evidenceDigest, followUps[]; resume profile returns state, nextSteps[], blockers[]; original full response when flag OFF or profile omitted
- Pass/fail: PASS if quick profile contains topResult + tokenReduction, research has evidenceDigest, resume has nextSteps, and full response when flag OFF; FAIL if profile shape missing expected fields or token savings not calculated
- memory_context now auto-routes an inferred profile when no explicit profile is supplied, so the profile surface is live on both search and context handlers even though this scenario stays search-first.

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify quick profile reduced response shape against SPECKIT_RESPONSE_PROFILE_V1=true. Verify quick: topResult + oneLineWhy + omittedCount + tokenReduction; research: results + evidenceDigest + followUps; resume: state + nextSteps + blockers; full response when flag OFF. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `SPECKIT_RESPONSE_PROFILE_V1=true`
2. `memory_search({ query: "test profiles", profile: "quick" })`
3. Verify QuickProfile shape
4. Re-run with profile=research, verify ResearchProfile
5. Re-run with profile=resume, verify ResumeProfile

### Expected

quick: topResult + oneLineWhy + omittedCount + tokenReduction; research: results + evidenceDigest + followUps; resume: state + nextSteps + blockers; full response when flag OFF

### Evidence

Response JSON per profile + token savings calculation

### Pass / Fail

- **Pass**: each profile shape correct and full response when flag OFF
- **Fail**: shape fields missing or token savings absent

### Failure Triage

Verify SPECKIT_RESPONSE_PROFILE_V1 env → Inspect profile-formatters.ts profile routing → Check estimateTokens() → Verify QuickProfile.tokenReduction.savingsPercent → Check fallback for unknown profile names

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
- phase_018_change: memory_context now auto-routes inferred profiles when no explicit profile is supplied
- audited_post_018: true
