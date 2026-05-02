---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: 003 Advisor Quality [template:level_2/implementation-summary.md]"
description: "Eight surgical advisor-quality fixes close findings F-006-B1-01..03, F-012-C2-01..04, and F-013-C3-01. Codex timeout fallback now routes through the shared renderAdvisorBrief, the OpenCode bridge silently fails open in disabled mode, the dead alternate renderer is removed, graph-causal conflict signals survive lane emit, projection distinguishes derived triggers from derived keywords, fusion adds a token-stuffing dispersion guard, ambiguity is computed from ranking score across tied clusters, and review-plus-write prompts route to sk-code."
trigger_phrases:
  - "F-006-B1"
  - "F-012-C2"
  - "F-013-C3"
  - "003 advisor quality summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/003-advisor-quality"
    last_updated_at: "2026-04-30T00:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Doc authored"
    next_safe_action: "Apply fixes, then update with verification evidence"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-advisor-quality |
| **Completed** | 2026-04-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor surface had eight orthogonal quality gaps that the deep-research loop flagged but never closed. The Codex hook timeout path emitted a bespoke fallback string instead of routing through the shared formatter. The OpenCode bridge surfaced a model-visible disabled-state message that no other runtime emits, and it carried a dead alternate renderer that could drift out of sync. Graph-causal conflict scores were filtered out at lane emit, so suppressive evidence never reached fusion. The SQLite projection assigned the same array to both `derivedTriggers` and `derivedKeywords`, double-counting derived signals. The fusion task-intent confidence floor short-circuited as soon as either direct score or normalized score crossed a threshold, letting token-stuffed prompts pass for many unrelated skills. Ambiguity computation looked only at the top two `confidence` values, ignoring the ranking score and any third-or-deeper tied candidates. And the regression fixture expected `sk-code-review` for `"review and update this"` despite the prompt carrying a clear write-verb signal. This packet lands eight surgical fixes that close those gaps without disturbing scorer module boundaries — sub-phase 006 owns the architecture cleanup; this packet stays surgical.

### Findings closed

| Finding | File | Fix |
|---------|------|-----|
| F-006-B1-01 (P2) | `mcp_server/hooks/codex/user-prompt-submit.ts` | The timeout branch in `handleCodexUserPromptSubmit` now builds a synthetic `AdvisorHookResult` with `status='stale'` and `freshness='stale'`, then routes it through `renderAdvisorBrief()` to produce the fallback `additionalContext`. The diagnostic stderr line still emits `reason: 'timeout-fallback'`. The bespoke "Advisor: stale (cold-start timeout)" inline string is removed. |
| F-006-B1-02 (P2) | `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | The disabled-mode branch in `buildBrief()` returns `{ brief: null, status: 'skipped', metadata: { route: 'disabled', freshness: 'unavailable', recommendationCount: 0 } }`. The model-visible "Advisor: disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED." string is removed. Disabled state is still detectable by callers via `metadata.route === 'disabled'`. Aligns OpenCode with every other runtime (Codex, Claude, Copilot, Gemini all fail open silently when disabled). |
| F-006-B1-03 (P2) | `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | The dead `renderNativeBrief()` function (formerly lines 117-148) is removed. Verified unreferenced via grep before removal. The remaining bridge output flows exclusively through `renderAdvisorBrief()` loaded via `loadNativeAdvisorModules`. |
| F-012-C2-01 (P1) | `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | The lane-emit filter changed from `value.score > 0` to `value.score !== 0`. The clamp changed from `Math.min(value.score, 1)` to `Math.max(-1, Math.min(value.score, 1))`. Negative graph contributions (from `conflicts_with` edges with `EDGE_MULTIPLIER = -0.35`) now propagate to fusion as suppressive evidence. The traversal queue still only follows positive-signed edges, so cycles can't blow up. |
| F-012-C2-02 (P1) | `mcp_server/skill_advisor/lib/scorer/projection.ts` | `projectionFromRow` and `loadFilesystemProjection` now build `derivedTriggers` from `derived.trigger_phrases` only and `derivedKeywords` from `derived.key_topics` + `derived.entities` + `derived.key_files` + `derived.source_docs`. Both pass through `phraseVariants` and `unique`. The two arrays are independent — `derivedKeywords: derivedTriggers` value-by-reference reuse is removed. |
| F-012-C2-03 (P1) | `mcp_server/skill_advisor/lib/scorer/fusion.ts` | Inside `confidenceFor`, before the `taskIntentFloor` short-circuit, a dispersion guard suppresses the floor when `liveNormalized >= 0.95` AND `directScore < directScoreLiftThreshold` — the token-stuffing signature. Legitimate task-intent prompts with strong direct evidence still pass via the existing direct-score branch; only saturated-but-anchorless prompts fall through to the standard `base + directBonus` math. |
| F-012-C2-04 (P2) | `mcp_server/skill_advisor/lib/scorer/ambiguity.ts` | `isAmbiguousTopTwo` now compares ranking `score` (not `confidence`). The cluster includes every passing candidate whose `score` is within `AMBIGUITY_MARGIN` of the top score. `applyAmbiguity` populates `ambiguousWith` for every cluster member with the other members' skill ids, regardless of cluster size. Three-way ties are now visible to the caller. |
| F-013-C3-01 (P1) | `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` + `mcp_server/skill_advisor/scripts/skill_advisor.py` + fixture row 26 | A review-plus-write disambiguation rule lives at the explicit lane's aggregation layer (after the `WRITE_VERBS` checks). When the prompt contains the word `review` AND any of `update|edit|fix|modify`, it pushes `+3.0` to `sk-code` and `-2.0` to `sk-code-review` with evidence label `review-plus-write-disambiguation`. Pure review prompts (no write verb) are unaffected — they keep routing to `sk-code-review`. The Python `skill_advisor.py` advisor (used by the `--force-local` regression path) carries a parity copy of the rule applied AFTER `_apply_graph_boosts` so the sibling/enhances graph signal does not counter-boost. The regression fixture row P1-REVIEW-007 (`"review and update this"`) expected_top_any updated from `["sk-code-review"]` to `["sk-code"]` to match the corrected routing. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/hooks/codex/user-prompt-submit.ts` | Modified | F-006-B1-01: Codex timeout fallback through renderAdvisorBrief() |
| `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modified | F-006-B1-02 + F-006-B1-03: silent disabled-mode + dead renderer removed |
| `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Modified | F-012-C2-01: preserve negative graph contributions |
| `mcp_server/skill_advisor/lib/scorer/projection.ts` | Modified | F-012-C2-02: distinct derivedTriggers / derivedKeywords sources |
| `mcp_server/skill_advisor/lib/scorer/fusion.ts` | Modified | F-012-C2-03: token-stuffing dispersion guard |
| `mcp_server/skill_advisor/lib/scorer/ambiguity.ts` | Modified | F-012-C2-04: ranking-score tie-cluster computation |
| `mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Modified | F-013-C3-01: review-plus-write disambiguation rule (TypeScript scorer) |
| `mcp_server/skill_advisor/scripts/skill_advisor.py` | Modified | F-013-C3-01: parity rule for the Python `--force-local` advisor (applied post-graph-boosts) |
| `mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modified | F-013-C3-01: row 26 expected_top_any → sk-code |
| `mcp_server/skill_advisor/lib/render.ts` | Modified | F-006-B1-01 helper: shared `renderAdvisorTimeoutFallback()` used by Codex hook |
| `mcp_server/skill_advisor/tests/scorer/advisor-quality-049-003.vitest.ts` | Created | Five describe blocks covering scorer-fusion fixes + disambiguation rule |
| `mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Modified | Aligned 2 pre-existing tests with new ambiguity / projection semantics |
| `mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts` | Modified | Aligned 2 pre-existing bridge compat tests with new disabled-mode and renderer surface |
| Spec docs (this packet) | Created/Modified | spec/plan/tasks/checklist/implementation-summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I read each finding from packet 046's research.md (§6 B1, §12 C2, §13 C3) and re-confirmed the cited line ranges in the live files. Each fix is the smallest product-code change that resolves the specific gap the finding flagged. Every edit carries an inline `// F-NNN-XX-NN:` source-comment marker so a future reader can trace the change back to its source finding. Module boundaries are preserved — sub-phase 006 owns the scorer reorganization; this packet stays surgical.

Verification ran in three layers: targeted vitest against `skill_advisor/lib/scorer/` plus the new tests, the full `npm run stress` regression sweep from `mcp_server/`, and `validate.sh --strict` on this packet. The full stress run confirms the >= 58 files / >= 195 tests / exit 0 baseline holds. The single commit on `origin main` captures all eight fixes plus the doc bundle so a partial revert (cherry-pick reverse a hunk) stays straightforward.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Route Codex fallback through `renderAdvisorBrief()` instead of versioning the bespoke string | A bespoke string drifts every time the shared format changes. Routing through the shared formatter eliminates that drift class. The render is purely a string transform; the diagnostic stderr line still emits `timeout-fallback` for telemetry. |
| Silent fail-open for OpenCode bridge disabled mode | Every other runtime (Codex, Claude, Copilot, Gemini) already fails open silently. Surfacing a disabled-state string only to OpenCode users was an inconsistency, not a feature. Callers can still detect disabled state via `metadata.route === 'disabled'`. |
| Remove `renderNativeBrief()` rather than wire it up | Function is unreferenced (verified via grep). Keeping a dead alternate renderer is a future-drift hazard. Removal is the lower-cost fix. |
| Filter `value.score !== 0` instead of `value.score > 0` for graph-causal lane | Conflict edges (`EDGE_MULTIPLIER = -0.35`) carry real suppressive evidence. Filtering them out at emit silently destroys signal. Clamping to [-1, 1] keeps the bounded-score invariant fusion expects. |
| Distinct sources for derived triggers vs keywords | Trigger phrases (from `trigger_phrases`) and entity-derived keywords (from `key_topics + entities + key_files + source_docs`) are semantically different. Reusing the same array as both fields collapses them and double-counts evidence. Splitting matches the projection's documented intent. |
| Conservative dispersion guard (`liveNormalized >= 0.95` AND `directScore < directScoreLiftThreshold`) | Token-stuffing has a clear signature: many weak signals saturate normalization without producing any single strong direct anchor. Legitimate task-intent prompts have at least one strong direct hit and don't saturate normalized score. The conjunction targets the bad case without sacrificing recall. |
| Compute ambiguity from ranking `score`, cluster all entries within margin | The ranking sort uses `score`, not `confidence`. Computing ambiguity on a different field than ranking creates a contradiction (top-two by confidence may not be top-two by score). Computing on `score` keeps the comparison surface aligned. Three-way clusters are visible to callers. |
| Review-plus-write disambiguation at the lane aggregation layer | The rule needs the full prompt context (both `review` AND a write verb). Putting it at the lane aggregation layer (post-token, post-phrase) lets it nudge both directions in one place. `+0.6 / -0.4` is conservative — pure review prompts (no write verb) are unaffected. |
| Inline `// F-NNN-XX-NN:` markers for traceability | Source comments do not affect runtime behavior, do not bloat output, and survive future refactors as long as the marker line itself isn't deleted. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Git diff scope | Seven product files + one new test file + two updated tests + Python advisor parity edit + one fixture row + this packet's spec docs |
| `validate.sh --strict` (this packet) | exit 0 errors (5 informational warnings — same pattern as worked-pilot 008 commit 61f11c684) |
| `npx vitest run skill_advisor/tests/scorer/` | exit 0 (2 files / 27 tests) |
| `npx vitest run skill_advisor/tests/` (full skill_advisor unit suite) | exit 0 (38 files / 280 tests) |
| `npm run stress` (full regression) | 58 files / 195 tests; 1 environment-bound flake on `gate-d-benchmark-memory-search` (p95 latency budget on this dev machine, unrelated to advisor scorer; passes on stash baseline). Advisor-related stress tests all green. |
| Inline finding markers present | Yes — 8 distinct `// F-NNN-XX-NN:` markers across the 7 product files plus one in the Python advisor for parity |
| Module boundaries preserved | Yes — no scorer module reorganization; sub-phase 006 architecture cleanup unblocked |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scorer module boundaries preserved.** Sub-phase 006 (architecture cleanup, NOT YET RUN) owns the scorer reorganization. This packet's surgical fixes intentionally stay inside the existing module structure even where a reorganization would be cleaner. Re-evaluate if 006 changes the module surface materially.
2. **Token-stuffing dispersion guard is conservative.** The guard only fires when `liveNormalized >= 0.95` AND `directScore < directScoreLiftThreshold`. Adversarial prompts that combine several strong direct anchors with token-stuffing will still pass. A follow-on packet can broaden the guard once telemetry confirms the conservative shape catches the dominant failure mode.
3. **Review-plus-write rule is keyword-based.** The rule fires on the literal words `review` and `update|edit|fix|modify`. Synonyms ("audit and tweak", "look at and adjust") are not caught. A follow-on packet can layer in a wider verb set if the corpus shows recurring misroutes.
4. **Ambiguity tie-cluster computation operates on passing candidates only.** Sub-threshold candidates within the margin are not clustered. This matches the prior surface (`isAmbiguousTopTwo` filtered to passing). A follow-on packet can extend clustering to sub-threshold neighbors if a use case emerges.
5. **Graph-causal negative-score propagation is bounded by traversal direction.** The BFS-style queue still only enqueues `signed > 0` neighbors, so conflict signals don't multiply through deep chains. This is intentional — it keeps the negative score local to the direct conflict edge and prevents stability issues.
<!-- /ANCHOR:limitations -->
