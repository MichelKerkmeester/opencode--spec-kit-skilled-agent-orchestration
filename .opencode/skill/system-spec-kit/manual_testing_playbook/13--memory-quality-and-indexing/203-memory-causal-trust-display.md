---
title: "203 -- Memory causal trust display"
description: "This scenario validates display-only trust badges for `203`. It focuses on additive envelope badges, orphan detection, age rendering, weight-history surfacing, and response-profile preservation."
audited_post_018: true
---

# 203 -- Memory causal trust display

## 1. OVERVIEW

This scenario validates memory causal trust display for `203`. It focuses on additive envelope badges, orphan detection, age rendering, weight-history surfacing, and response-profile preservation.

---

## 2. CURRENT REALITY

Operators validate the display layer, not storage. The scenario confirms `memory_search` results surface `trustBadges` derived from existing causal-edge metadata, and that response profiles preserve the same per-result badge payload instead of dropping it during shaping.

- Objective: Verify additive per-result trust badges for confidence, extraction age, last access age, orphan status, and weight-history change state
- Prompt: `As a memory-quality validation operator, validate Memory causal trust display against the search-result formatter and response-profile layer. Verify trustBadges are additive, derived from existing causal-edge metadata only, preserved through response profiles, and do not require schema or relation-vocabulary changes. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `trustBadges` appear on search results; confidence is sourced from edge strength; ages render from causal-edge timestamps; orphan becomes true when inbound causal edges are absent; weight-history change becomes true when `weight_history` contains a connected edge; quick and research profiles preserve the badge payload
- Pass/fail: PASS if formatter output contains the five badge fields with stable values and response profiles preserve them. FAIL if badges are missing, top-level only, dependent on new schema, or stripped by profile formatting.

---

## 3. TEST EXECUTION

### Prompt

```text
As a memory-quality validation operator, validate Memory causal trust display against the search-result formatter and response-profile layer. Verify trustBadges are additive, derived from existing causal-edge metadata only, preserved through response profiles, and do not require schema or relation-vocabulary changes. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `rg -n "trustBadges|MemoryTrustBadges|weightHistoryChanged|extractionAge|lastAccessAge|orphan" .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts .opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts`
2. `git diff -- .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
3. `cd .opencode/skill/system-spec-kit/mcp_server && npm exec -- vitest run tests/memory/trust-badges.test.ts tests/response-profile-formatters.vitest.ts`

### Expected

Source grep finds the additive badge interface and formatter wiring; static diff shows no schema changes in `causal-edges.ts` and no decay-logic changes in `causal-boost.ts`; targeted Vitest covers badge derivation and profile preservation without introducing new relation types or top-level-only output

### Evidence

Saved `rg` output, static diff output for the protected files, and the final Vitest summary for the targeted trust-badge tests

### Pass / Fail

- **Pass**: the formatter and profile layer contain the expected badge wiring, protected-file diffs show no forbidden changes, and targeted Vitest exits 0
- **Fail**: any badge field is missing, protected files changed in forbidden ways, or the targeted Vitest run fails

### Failure Triage

Inspect `mcp_server/formatters/search-results.ts` for badge derivation and DB lookup behavior, `mcp_server/lib/response/profile-formatters.ts` for profile preservation, and `mcp_server/tests/memory/trust-badges.test.ts` for the expected runtime contract.

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/28-memory-causal-trust-display.md](../../feature_catalog/13--memory-quality-and-indexing/28-memory-causal-trust-display.md)
- Source files: `mcp_server/formatters/search-results.ts`, `mcp_server/lib/response/profile-formatters.ts`
- Regression tests: `mcp_server/tests/memory/trust-badges.test.ts`, `mcp_server/tests/response-profile-formatters.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 203
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/28-memory-causal-trust-display.md`
