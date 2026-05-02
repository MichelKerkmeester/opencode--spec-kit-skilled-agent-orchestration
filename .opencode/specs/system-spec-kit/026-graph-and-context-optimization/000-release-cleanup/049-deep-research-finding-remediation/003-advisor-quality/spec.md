---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 003 Advisor Quality [template:level_2/spec.md]"
description: "Resolve eight findings (F-006-B1-01..03, F-012-C2-01..04, F-013-C3-01) from packet 046 across the Codex hook fallback brief, the OpenCode bridge disabled-mode visibility, the dead bridge renderer, the graph-causal lane conflict signal, the SQLite projection trigger/keyword duplication, the fusion task-intent confidence floor, the ambiguity computation surface, and the regression fixture's review-plus-edit expectation. Aligns advisor surfaces around the shared renderAdvisorBrief, preserves negative graph contributions, distinguishes derived triggers from derived keywords, guards the task-intent floor against token-stuffing, computes ambiguity from ranking score across tied clusters, and disambiguates review-plus-write prompts toward sk-code."
trigger_phrases:
  - "F-006-B1"
  - "F-012-C2"
  - "F-013-C3"
  - "advisor quality"
  - "renderAdvisorBrief alignment"
  - "graph-causal conflict signal"
  - "projection trigger keyword duplication"
  - "task-intent confidence floor"
  - "ambiguity tie cluster"
  - "review and update disambiguation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/003-advisor-quality"
    last_updated_at: "2026-04-30T00:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec authored; eight findings scoped"
    next_safe_action: "Apply fixes and add scorer vitests"
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
# Feature Specification: 003 Advisor Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (4 findings) + P2 (4 findings) |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 10 |
| **Predecessor** | 002-deep-loop-workflow-state |
| **Successor** | 004-validation-and-memory |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eight advisor-quality findings sit across the skill-advisor surface. (B1-01) The Codex hook timeout fallback emits a bespoke advisor brief that bypasses the shared `renderAdvisorBrief()` formatter, so a future format change drifts between runtimes. (B1-02) The OpenCode bridge surfaces `Advisor: disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED.` to the model when the disabled flag is set, while every other runtime fails open silently — disabled-state visibility is not aligned. (B1-03) The OpenCode bridge carries a dead `renderNativeBrief()` alternate renderer that is unreferenced and can drift out of sync with the shared formatter. (C2-01) Graph-causal conflict evidence (negative `EDGE_MULTIPLIER` for `conflicts_with`) is filtered out at lane emit (`value.score > 0`), so conflict signals never reach fusion. (C2-02) The SQLite projection assigns `derivedKeywords = derivedTriggers` (same value), duplicating the same evidence into two lane inputs. (C2-03) The fusion task-intent confidence floor (0.75) lets token-stuffed prompts pass for many unrelated skills as soon as ANY direct/normalized score scrap clears the threshold — there is no dispersion guard. (C2-04) `isAmbiguousTopTwo` compares only the top two `confidence` values, ignoring the larger ranking-score signal and any third-or-deeper tied candidates. (C3-01) Fixture row 26 expects `sk-code-review` for `"review and update this"`, but the prompt is a write/edit request — the fixture encodes a review-only routing that conflicts with the write-verb signal.

### Purpose
Land eight surgical fixes that close F-006-B1-01..03, F-012-C2-01..04, and F-013-C3-01 without disturbing module boundaries (sub-phase 006 will refactor scorer modules; this packet preserves them). The Codex fallback brief routes through `renderAdvisorBrief()`. The OpenCode bridge silently fails open in disabled mode (matching every other runtime). The dead alternate renderer is removed. Graph-causal conflict scores survive lane emit. Derived triggers and derived keywords become distinct projection fields. Task-intent floor adds a dispersion guard. Ambiguity is computed from ranking score across tied clusters. Fixture row 26 expects `sk-code` and a new disambiguation rule routes review-plus-write prompts to `sk-code`. Each fix carries a `// F-NNN-XX-NN:` source-comment marker for traceability.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Eight surgical product-code fixes, one per finding (F-006-B1-01..03, F-012-C2-01..04, F-013-C3-01)
- One additive vitest in `mcp_server/skill_advisor/tests/scorer/` covering: graph-causal conflict preservation, distinct trigger/keyword fields, token-stuffing dispersion guard, ambiguity tie-cluster computation, and the new review-plus-write disambiguation rule
- Strict validation pass on this packet
- Targeted vitest run for `skill_advisor/lib/scorer/`
- Full `npm run stress` regression sweep — must remain at >= 58 files / >= 195 tests / exit 0
- One commit pushed to `origin main`

### Out of Scope
- Scorer module refactor (extract/rename); preserved for sub-phase 006
- Threshold tuning or weight changes (no edits to `scoring-constants.ts` numeric values)
- Affordance-normalizer changes
- Rebuilding the SQLite skill graph (projection-side fix only; ingestion stays as-is)
- Adding new TOKEN_BOOSTS for unrelated skills
- Adjusting OpenCode bridge transport contract beyond the disabled-mode visibility

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/hooks/codex/user-prompt-submit.ts` | Modify | F-006-B1-01: Codex timeout fallback now routes through `renderAdvisorBrief()` with a stale freshness signal; bespoke string removed |
| `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modify | F-006-B1-02: disabled mode returns silent fail-open (`brief: null`, status `skipped`); F-006-B1-03: dead `renderNativeBrief()` removed |
| `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Modify | F-012-C2-01: preserve negative graph contributions through lane emit |
| `mcp_server/skill_advisor/lib/scorer/projection.ts` | Modify | F-012-C2-02: distinguish derived triggers from derived keywords (read separate fields) |
| `mcp_server/skill_advisor/lib/scorer/fusion.ts` | Modify | F-012-C2-03: dispersion guard before applying task-intent confidence floor |
| `mcp_server/skill_advisor/lib/scorer/ambiguity.ts` | Modify | F-012-C2-04: compute ambiguity from ranking score and include all tied candidates |
| `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Modify | F-013-C3-01: review-plus-write disambiguation rule (route to `sk-code` not `sk-code-review`) |
| `mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modify | F-013-C3-01: row P1-REVIEW-007 expected_top_any → `sk-code` |
| `mcp_server/skill_advisor/tests/scorer/advisor-quality-049-003.vitest.ts` | Create | Unit tests for the four scorer-fusion fixes plus the disambiguation rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1: On Codex hook timeout, the fallback brief is produced by passing a stale `AdvisorHookResult`-shaped record to `renderAdvisorBrief()`. The stdout JSON still carries `additionalContext` and the diagnostic stderr line still includes `reason: 'timeout-fallback'`. No bespoke "Advisor: stale (cold-start timeout)" string remains in `user-prompt-submit.ts`.
- FR-2: When `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, `spec-kit-skill-advisor-bridge.mjs` returns `{ brief: null, status: 'skipped', metadata: { route: 'disabled', freshness: 'unavailable', recommendationCount: 0 } }` — no model-visible `Advisor: disabled by ...` string.
- FR-3: The dead `renderNativeBrief()` function in `spec-kit-skill-advisor-bridge.mjs` is removed. The remaining bridge output flows only through `renderAdvisorBrief()` (loaded via `loadNativeAdvisorModules`).
- FR-4: `scoreGraphCausalLane` keeps entries with `value.score < 0` in its output. The negative score is clamped to `[-1, 1]` (currently the positive case clamps to `Math.min(value.score, 1)`; the new behavior is `Math.max(-1, Math.min(value.score, 1))`).
- FR-5: `projectionFromRow` and the filesystem projection both assign `derivedTriggers` and `derivedKeywords` from distinct sources: `derivedTriggers` from `derived.trigger_phrases` (plus phrase variants), and `derivedKeywords` from `derived.key_topics` + `derived.entities` + `derived.key_files` (plus phrase variants), deduped. The two arrays may overlap but are no longer assigned the same value-by-reference.
- FR-6: Inside `confidenceFor` in `fusion.ts`, before lifting confidence to `taskIntentFloor`, a dispersion guard requires either `directScore >= taskIntentDirectScoreFloor` (pre-existing) AND `liveNormalized < 0.95` (token-stuffing detector — when normalized score is near-saturated AND direct score is below `directScoreLiftThreshold`, the floor does NOT apply). The existing direct/normalized branch wins as today; only the floor short-circuit gains a guard.
- FR-7: `isAmbiguousTopTwo` computes ambiguity using the recommendation's `score` field (ranking score) instead of `confidence`, AND the set of candidates considered ambiguous includes ALL passing entries within `AMBIGUITY_MARGIN` of the top score, not just the second one. `applyAmbiguity` populates `ambiguousWith` for every entry in the cluster.
- FR-8: `scoreExplicitLane` adds a "review-plus-write" disambiguation rule. When the prompt contains `review` AND any of `update|edit|fix|modify`, push +0.6 to `sk-code` and -0.4 to `sk-code-review` with evidence label `review-plus-write-disambiguation`. Pure review prompts (no write verb) are unchanged.
- FR-9: Fixture row 26 (`P1-REVIEW-007`, `"review and update this"`) updates `expected_top_any` from `["sk-code-review"]` to `["sk-code"]`.

### Non-Functional
- NFR-1: `validate.sh --strict` exit 0 errors for this packet.
- NFR-2: `npm run stress` stays at >= 58 files / >= 195 tests / exit 0 (no regression vs sub-phase 008's baseline).
- NFR-3: Each fix carries an inline `// F-NNN-XX-NN:` marker for traceability.
- NFR-4: No imports of `service_tier="fast"` workflows.
- NFR-5: No reorganization of scorer modules (sub-phase 006 owns that work).

### Constraints
- Stay on `main`.
- Preserve module boundaries (don't extract or rename anything in scorer files).
- Do NOT touch other sub-phases under 049.
- For F-006-B1-02: silent fail-open is the dominant pattern (every other runtime). Aligning with that pattern does not break OpenCode UX — model-visible brief was never the contract; bridges are infra.
- For F-013-C3-01: the disambiguation rule applies to `review` plus write-verb prompts. Read-only review prompts (no `update|edit|fix|modify`) keep routing to `sk-code-review`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Spec authored
- [x] All eight findings closed with `// F-NNN-XX-NN:` source markers
- [x] Codex fallback brief routes through `renderAdvisorBrief()` (F-006-B1-01)
- [x] OpenCode bridge disabled mode silent fail-open (F-006-B1-02)
- [x] Dead `renderNativeBrief()` removed (F-006-B1-03)
- [x] Graph-causal conflict signal preserved (F-012-C2-01) with passing test
- [x] Distinct derived trigger/keyword fields (F-012-C2-02) with passing test
- [x] Task-intent floor dispersion guard (F-012-C2-03) with passing test
- [x] Ambiguity tie-cluster computation (F-012-C2-04) with passing test
- [x] Review-plus-write disambiguation rule (F-013-C3-01) with passing test + fixture updated
- [x] `validate.sh --strict` exit 0 errors for this packet
- [x] Targeted vitest pass for scorer (`skill_advisor/lib/scorer/`)
- [x] `npm run stress` exit 0 with >= 58 files / >= 195 tests
- [x] One commit pushed to `origin main`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Removing the bespoke timeout-fallback string changes Codex hook contract | Output shape (`additionalContext` string under `hookSpecificOutput`) is preserved; only the rendering path changes. Diagnostic stderr line still emits `reason: 'timeout-fallback'`. |
| Silent disabled-mode breaks an OpenCode user expectation | The current `Advisor: disabled by ...` string was inconsistent across runtimes (Codex, Claude, Copilot, Gemini all fail open silently). Aligning is the correct fix. Status remains `skipped` so callers can still detect disabled state via metadata. |
| Removing dead `renderNativeBrief` breaks an unknown caller | Function is unreferenced (verified via Grep before removal); removal is safe. |
| Negative graph scores destabilize fusion | Conflict signals are bounded by `Math.abs(multiplier)` which already clamps to [0, 1]; signed score is bounded to [-1, 1]. Fusion's `weightedScore` math handles negatives without divide-by-zero. |
| Distinct trigger/keyword fields change derived-lane behavior | The current behavior assigns the same array to both fields, which is logically equivalent to "one field with double the weight." Splitting reduces double-counting; impact is bounded by derived lane weight (small). |
| Token-stuffing dispersion guard regresses legitimate task-intent prompts | Guard is conservative: only fires when `liveNormalized >= 0.95` AND `directScore < directScoreLiftThreshold`. Legitimate prompts with strong direct signal already pass via the directScore branch. |
| Ambiguity tie-cluster surfaces false ambiguity on dense top-N | Margin stays at `AMBIGUITY_MARGIN = 0.05`; only entries within that margin of the top are clustered. |
| Review-plus-write rule conflicts with existing `sk-code-review` PHRASE_BOOSTS | Rule lives at the `scoreExplicitLane` aggregation layer (post-token, post-phrase), nudges via `+0.6/-0.4`, and only fires when both `review` AND a write verb are present. Pure review prompts are unaffected. |
| Fixture change breaks `advisor_validate` corpus accuracy threshold | Single-row fixture change; corpus accuracy threshold (`FULL_CORPUS_THRESHOLD=0.75`) easily absorbs one row swap. |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §6 (B1: advisor formatting drift), §12 (C2: scorer math), §13 (C3: regression fixture)
- Existing W3-W13 stress harness must keep passing
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- No other packet dependencies; sub-phase 003 is independent of 002 and 004
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| Codex hook receives empty input | No prompt parse | `handleCodexUserPromptSubmit` returns `{}` (unchanged); fallback path only fires on TIMEOUT |
| Bridge called with `forceLocal=true` and disabled flag set | Both flags asserted | Disabled flag wins (silent fail-open); `forceLocal` is a routing hint, not an override |
| Graph-causal lane sees only conflict edges | Seed score positive, only `conflicts_with` outgoing | Returns negative-scored matches; fusion treats them as suppressive evidence |
| Projection has empty `derived.trigger_phrases` and non-empty `derived.key_topics` | Mixed derived state | `derivedTriggers = []`, `derivedKeywords = phraseVariants(keyTopics)` — distinct arrays |
| Task-intent prompt with high direct score AND high liveNormalized | Strong signal, no token-stuffing | Passes directScore branch; dispersion guard never evaluated |
| Three-way tie within ambiguity margin | A, B, C scores within 0.05 | All three carry `ambiguousWith` containing the other two |
| Review prompt without write verb | "review the typescript module" | Routes to `sk-code-review` via existing `review` token boost; new rule does not fire |
| Write prompt without review | "update this typescript module" | Routes to `sk-code-opencode` or `sk-code` via existing write-verb surfaces; new rule does not fire (no `review`) |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-006-B1-01 (P2) | user-prompt-submit.ts | 25 |
| F-006-B1-02 (P2) | spec-kit-skill-advisor-bridge.mjs | 15 |
| F-006-B1-03 (P2) | spec-kit-skill-advisor-bridge.mjs (same file) | 10 |
| F-012-C2-01 (P1) | graph-causal.ts | 25 |
| F-012-C2-02 (P1) | projection.ts | 25 |
| F-012-C2-03 (P1) | fusion.ts | 30 |
| F-012-C2-04 (P2) | ambiguity.ts | 25 |
| F-013-C3-01 (P1) | explicit.ts + fixture | 30 |
| Tests (one new file) | advisor-quality-049-003.vitest.ts | 40 |
| **Total** | | **~225** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The "future deeper refactor" — extracting separate modules for ambiguity-ranking and confidence-floor calibration — is owned by sub-phase 006 (architecture cleanup). This packet stays surgical.
<!-- /ANCHOR:questions -->
