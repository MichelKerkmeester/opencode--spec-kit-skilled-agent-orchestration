---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 003 Advisor Quality [template:level_2/plan.md]"
description: "Eight surgical advisor-quality fixes plus one additive scorer vitest close findings F-006-B1-01..03, F-012-C2-01..04, and F-013-C3-01 from packet 046. Aligns Codex fallback brief, removes OpenCode bridge model-visible disabled string, deletes dead alternate renderer, preserves graph-causal conflict signal, splits derived trigger/keyword fields, adds task-intent dispersion guard, computes ambiguity from ranking score across tied clusters, and routes review-plus-write prompts to sk-code."
trigger_phrases:
  - "F-006-B1 plan"
  - "F-012-C2 plan"
  - "F-013-C3 plan"
  - "003 advisor quality plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/003-advisor-quality"
    last_updated_at: "2026-04-30T00:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored"
    next_safe_action: "Apply fixes per phase order"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-003-advisor-quality"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 003 Advisor Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Eight surgical product-code fixes close F-006-B1-01..03, F-012-C2-01..04, and F-013-C3-01. Each fix is bounded inside its existing module — no extract, no rename. Sub-phase 006 owns the eventual scorer reorganization; this packet preserves boundaries and lands surgical correctness fixes plus one additive vitest.

### Technical Context

The advisor surface has three orthogonal quality gaps:
1. **Hook + bridge formatting drift (B1)** — Codex timeout fallback emits a bespoke string; OpenCode bridge surfaces a disabled-state message that no other runtime emits; a dead alternate renderer can drift.
2. **Scorer math correctness (C2)** — graph-causal conflict scores are filtered out at lane emit; projection assigns the same array to both `derivedTriggers` and `derivedKeywords`; fusion's task-intent floor lacks a dispersion guard against token-stuffing; ambiguity computation is too narrow (top-two only, confidence-only).
3. **Regression fixture vs disambiguation logic (C3)** — fixture row 26 expects `sk-code-review` for a write-verb prompt; the explicit lane lacks a rule to route review-plus-write prompts to `sk-code`.

The fix surface is small per file. No cross-cutting refactor.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict | exit 0 (errors=0) |
| Git diff scope | seven product files + one new test file + one fixture row + this packet's spec docs only |
| Stress regression | none expected — guards preserve existing routing for legitimate prompts |
| `npm run stress` | exit 0, >= 58 files, >= 195 tests |
| Inline traceability markers | one `// F-NNN-XX-NN:` comment per finding (multiple per file when fix spans sites) |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Per-file surgical changes within existing module boundaries:
- **user-prompt-submit.ts (B1-01)**: Inside `handleCodexUserPromptSubmit`, the timeout branch builds a synthetic `AdvisorHookResult`-shaped record (status `stale`, freshness `stale`, single recommendation absent) and routes it through `renderAdvisorBrief()` to produce the fallback context. The bespoke "Advisor: stale (cold-start timeout)" inline string is removed; diagnostic stderr line stays.
- **spec-kit-skill-advisor-bridge.mjs (B1-02)**: `buildBrief()`'s disabled-mode branch returns `{ brief: null, status: 'skipped', metadata: { route: 'disabled', freshness: 'unavailable', recommendationCount: 0 } }` — `brief` field is null. Caller-side rendering skips when brief is null (matches every other runtime).
- **spec-kit-skill-advisor-bridge.mjs (B1-03)**: `renderNativeBrief()` (lines 117-148) is removed. Verified unreferenced via grep before removal.
- **graph-causal.ts (C2-01)**: Replace `.filter(([, value]) => value.score > 0)` with `.filter(([, value]) => value.score !== 0)`. Replace `Math.min(value.score, 1)` with `Math.max(-1, Math.min(value.score, 1))` to clamp the signed range. Negative scores propagate as suppressive evidence with `edge:...:conflicts_with` evidence labels intact.
- **projection.ts (C2-02)**: In `projectionFromRow`, build `derivedTriggers` from `derived.trigger_phrases` only; build `derivedKeywords` from `derived.key_topics` + `derived.entities` + `derived.key_files` + `derived.source_docs`. Both passed through `phraseVariants` and `unique`. The two arrays are independent — no `derivedKeywords: derivedTriggers` reuse. Same split applied to `loadFilesystemProjection`.
- **fusion.ts (C2-03)**: Inside `confidenceFor`, before the `taskIntentFloor` short-circuit (line 121-123), add a guard: when `liveNormalized >= 0.95` AND `directScore < directScoreLiftThreshold`, do NOT return the floor — fall through to the standard `base + directBonus` computation. This catches token-stuffed prompts where many weak signals saturate normalization without any single direct anchor.
- **ambiguity.ts (C2-04)**: Replace `confidence`-based comparison with `score`-based. Compute the cluster: starting from the top passing candidate, include every passing candidate whose `score` is within `AMBIGUITY_MARGIN` of the top. Cluster size >= 2 means ambiguous. `applyAmbiguity` populates `ambiguousWith` for every cluster member with the other members' skill ids.
- **explicit.ts (C3-01)**: Add a new aggregation rule after the existing `WRITE_VERBS` checks. When the prompt contains the word `review` AND any of `update|edit|fix|modify`, push `+0.6` to `sk-code` and `-0.4` to `sk-code-review` with evidence label `review-plus-write-disambiguation`.
- **regression fixture (C3-01)**: Update row P1-REVIEW-007's `expected_top_any` from `["sk-code-review"]` to `["sk-code"]`. The prompt remains `"review and update this"`.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Edit | Codex fallback brief through renderAdvisorBrief() | user-prompt-submit.ts | F-006-B1-01 | Pending |
| 2 | Edit | OpenCode bridge silent fail-open in disabled mode | spec-kit-skill-advisor-bridge.mjs | F-006-B1-02 | Pending |
| 3 | Edit | Remove dead renderNativeBrief() | spec-kit-skill-advisor-bridge.mjs | F-006-B1-03 | Pending |
| 4 | Edit | Preserve graph-causal conflict signal | graph-causal.ts | F-012-C2-01 | Pending |
| 5 | Edit | Distinct derived trigger/keyword fields | projection.ts | F-012-C2-02 | Pending |
| 6 | Edit | Task-intent dispersion guard | fusion.ts | F-012-C2-03 | Pending |
| 7 | Edit | Ambiguity tie-cluster from ranking score | ambiguity.ts | F-012-C2-04 | Pending |
| 8 | Edit | Review-plus-write disambiguation rule | explicit.ts | F-013-C3-01 | Pending |
| 9 | Edit | Update regression fixture row 26 | skill_advisor_regression_cases.jsonl | F-013-C3-01 | Pending |
| 10 | Test | Add advisor-quality-049-003.vitest.ts | skill_advisor/tests/scorer/ | C2-01..04, C3-01 | Pending |
| 11 | Verify | Run targeted vitest: `skill_advisor/lib/scorer/` | mcp_server/ | — | Pending |
| 12 | Verify | Run full `npm run stress` | mcp_server/ | — | Pending |
| 13 | Validate | `validate.sh --strict` for this packet | this packet | — | Pending |
| 14 | Refresh | `generate-context.js` to refresh metadata | this packet | — | Pending |
| 15 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Graph-causal lane: negative score preserved through emit | vitest, additive `advisor-quality-049-003.vitest.ts` |
| Unit | Projection: distinct `derivedTriggers` and `derivedKeywords` from filesystem fixtures | vitest, same file |
| Unit | Fusion: token-stuffing dispersion guard suppresses task-intent floor | vitest, same file |
| Unit | Ambiguity: tie-cluster across three candidates within margin | vitest, same file |
| Unit | Explicit lane: `"review and update this"` routes top-1 to `sk-code` | vitest, same file (uses `scoreAdvisorPrompt` end-to-end) |
| Smoke | `advisor_validate` regression sweep stays green with updated fixture | implicit — `npm run stress` covers it via `python-compat-stress.vitest.ts` |
| Full | All MCP server stress | `npm run stress` from `mcp_server/` |

The new test file lives at `mcp_server/skill_advisor/tests/scorer/advisor-quality-049-003.vitest.ts` so vitest picks it up via the existing `mcp_server/skill_advisor/tests/**/*.{vitest,test}.ts` include pattern.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §6 (B1), §12 (C2), §13 (C3)
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Existing scorer modules: `lanes/`, `fusion.ts`, `ambiguity.ts`, `projection.ts` — boundaries preserved
- Sub-phase 006 (NOT YET RUN) will refactor scorer module structure; this packet must NOT pre-empt that work
- No other packet dependencies; sub-phase 003 is independent
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a downstream regression appears:
1. `git revert <commit-sha>` reverts all eight fixes plus the test and fixture atomically.
2. Re-run `npm run stress` to confirm pre-fix baseline restored.
3. For partial revert, the per-finding `// F-NNN-XX-NN:` markers locate the exact hunk for targeted cherry-pick reverse.

Per-finding fallback strategy:
- B1-01 (Codex fallback): revert restores bespoke "Advisor: stale (cold-start timeout)" string.
- B1-02 (bridge disabled): revert restores `Advisor: disabled by ...` string.
- B1-03 (dead renderer): revert re-adds `renderNativeBrief()` (still unreferenced).
- C2-01 (graph-causal conflict): revert restores `value.score > 0` filter.
- C2-02 (projection split): revert restores `derivedKeywords: derivedTriggers` reuse.
- C2-03 (dispersion guard): revert removes the guard branch in `confidenceFor`.
- C2-04 (ambiguity cluster): revert restores top-two confidence comparison.
- C3-01 (disambiguation): revert removes the `review-plus-write-disambiguation` rule and restores fixture row 26 to `sk-code-review`.
<!-- /ANCHOR:rollback -->
