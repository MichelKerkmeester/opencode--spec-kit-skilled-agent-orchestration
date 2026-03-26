---
title: "165 -- Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)"
description: "This scenario validates assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) for `165`. It focuses on enabling the flag, saving a near-duplicate, and verifying merge/recommend behavior."
---

# 165 -- Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)

## 1. OVERVIEW

This scenario validates assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) for `165`. It focuses on enabling the flag, saving a near-duplicate, and verifying merge/recommend behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `165` and confirm the expected signals without contradicting evidence.

- Objective: Verify near-duplicate auto-merge and borderline recommendation behavior
- Prompt: `Test SPECKIT_ASSISTIVE_RECONSOLIDATION=true. Save two near-duplicate memories (similarity >= 0.96) and verify auto-merge triggers. Then save a borderline pair (0.88 <= similarity < 0.96) and verify a recommendation is logged with supersede/complement classification. Capture the evidence needed to prove classifyAssistiveSimilarity() returns the correct tier and no destructive action occurs for review-tier pairs. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: similarity >= 0.96 returns 'auto_merge'; 0.88 <= similarity < 0.96 returns 'review' with AssistiveRecommendation logged; similarity < 0.88 returns 'keep_separate'; review tier produces classification (supersede/complement/keep_separate) without destructive action
- Pass/fail: PASS if auto-merge triggers at >= 0.96, recommendation logged for review tier, and no destructive action for borderline pairs; FAIL if wrong tier classification or destructive action taken for review-tier pairs

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 165 | Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) | Verify merge/recommend behavior | `Test SPECKIT_ASSISTIVE_RECONSOLIDATION=true. Save near-duplicates and borderline pairs, verify auto-merge at >= 0.96 similarity and review recommendation at >= 0.88. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_ASSISTIVE_RECONSOLIDATION=true` 2) Save memory A, then save near-duplicate B (sim >= 0.96) 3) Verify auto-merge 4) Save memory C (0.88 <= sim < 0.96 vs A) 5) Verify AssistiveRecommendation logged 6) `npx vitest run tests/assistive-reconsolidation.vitest.ts` | auto_merge at >= 0.96; review with recommendation at >= 0.88; keep_separate below 0.88; no destructive action for review tier | classifyAssistiveSimilarity() output + AssistiveRecommendation log + test transcript | PASS if correct tier at each threshold and no destructive action for review; FAIL if wrong tier or destructive action for borderline | Verify isAssistiveReconsolidationEnabled() → Check ASSISTIVE_AUTO_MERGE_THRESHOLD (0.96) → Check ASSISTIVE_REVIEW_THRESHOLD (0.88) → Inspect classifyBorderlinePair() logic → Verify recommendation persistence |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/21-assistive-reconsolidation.md](../../feature_catalog/13--memory-quality-and-indexing/21-assistive-reconsolidation.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../19--feature-flag-reference/028-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/handlers/save/reconsolidation-bridge.ts`

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 165
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/165-assistive-reconsolidation-speckit-assistive-reconsolidation.md`
