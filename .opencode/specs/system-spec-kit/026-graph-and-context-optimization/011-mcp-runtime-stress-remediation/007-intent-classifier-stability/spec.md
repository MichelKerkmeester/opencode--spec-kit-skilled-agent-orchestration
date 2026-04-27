---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: intent classifier stability + paraphrase corpus + normalized telemetry [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/007-intent-classifier-stability/spec]"
description: "Remediation packet for 005/REQ-001 + REQ-004 + REQ-016 + 007/Q8. Adds normalized IntentTelemetry schema (taskIntent + backendRouting separation), paraphrase regression corpus across CLI styles, and stability metrics. Beyond Cluster 2's threshold floor — adds drift-tracking and cross-CLI parity."
trigger_phrases:
  - "007-intent-classifier-stability"
  - "intent classifier paraphrase corpus"
  - "task-intent backend-routing schema"
  - "cross-CLI intent stability"
  - "REQ-001 REQ-004 REQ-016 intent stability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/007-intent-classifier-stability"
    last_updated_at: "2026-04-27T09:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet from 007 §5 Q8 + §11 Rec #5"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: intent classifier stability + paraphrase corpus + normalized telemetry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Sources** | 005/REQ-001, REQ-004, REQ-016, 007/Q8 (lower-evidence per research §1 caveat) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
005/REQ-016 captured paraphrase instability: `"Semantic Search"` → `fix_bug` (0.098) but `"Find stuff related to semantic search"` → `understand`. 005 Cluster 2 landed a 0.30 confidence floor for centroid-only paths, but 007/Q8 noted (with lower evidence than Q1-Q7) that the gap remains broader — the dual-classifier dissonance (`meta.intent` vs `data.queryIntentRouting`) was annotated as `task-intent` vs `backend-routing` but lacks a normalized response schema and a paired-paraphrase regression corpus across CLI styles. 005 T204 was DEFERRED on stability corpus. 007 §10 Q8 explicitly recommends the corpus.

### Purpose
Implement the normalized `IntentTelemetry` schema per 007 §5 Q8 (`taskIntent` + `backendRouting` as parallel objects with explicit `classificationKind`, optional `paraphraseGroup`). Add a paired paraphrase stability corpus covering 20+ query pairs across CLI styles. Add cross-CLI drift metric. Treat as P2 because Q8 has lower evidence; document residual evidence gap in implementation-summary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Implement `IntentTelemetry` normalized schema in `mcp_server/handlers/memory-context.ts` and `mcp_server/lib/search/intent-classifier.ts`.
- Add `paraphraseGroup` field to telemetry when classifier detects equivalent prompts.
- Author paired paraphrase stability corpus (`mcp_server/tests/intent-paraphrase-stability.vitest.ts`) covering 20+ pairs.
- Add drift metric: stability percentage across paraphrase groups.

### Out of Scope
- Replacing the centroid+keyword classifier with embedding-based.
- Re-tuning confidence floors (already done in 005 Cluster 2).
- Rebuilding intent vocabulary.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/intent-classifier.ts` | Modify | Emit normalized IntentTelemetry shape |
| `mcp_server/handlers/memory-context.ts` | Modify | Pass through new telemetry; add paraphraseGroup |
| `mcp_server/tests/intent-paraphrase-stability.vitest.ts` | Create | Paired paraphrase corpus |
| `mcp_server/tests/intent-classifier.vitest.ts` | Modify | Add normalized schema assertions |
| `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `meta.intent` MUST emit normalized `IntentTelemetry` per 007 §5 Q8 schema. | After fix, `meta.intent` includes `taskIntent: { intent, confidence, classificationKind:"task-intent", evidence }` and `backendRouting: { route, confidence, classificationKind:"backend-routing", seeAlso:"meta.intent" }`. Optional `paraphraseGroup` field present when classifier detects equivalence. |
| REQ-002 | Paired paraphrase corpus MUST cover 20+ pairs across the 6 documented intents. | After fix, `mcp_server/tests/intent-paraphrase-stability.vitest.ts` exists with at least 20 paraphrase pairs. Each pair: original + 1-3 paraphrases. |
| REQ-003 | Stability test MUST assert task intent is stable across paraphrases. | After fix, for each pair, all paraphrases classify to same intent label (with confidence drift bounded — e.g., `|conf_a - conf_b| < 0.30`). |
| REQ-004 | Cross-CLI parity MUST be tested for at least 5 query variants. | After fix, the same query phrased in cli-codex / cli-copilot / cli-opencode style classifies to the same task intent. |

### Acceptance Scenarios

**Given** the original 005 probe `"Semantic Search"`, **when** classification runs, **then** `taskIntent.intent === "understand"` (post-005 fix) AND `backendRouting.route` is whatever channel routing chose (e.g., `"semantic"`) — kept as separate concerns.

**Given** paraphrase pair `["Semantic Search", "Find stuff related to semantic search"]`, **when** both run, **then** both classify to same task intent.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 REQs covered.
- **SC-002**: Paraphrase stability corpus committed and green.
- **SC-003**: `validate.sh --strict` PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New schema breaks downstream parsers expecting old `meta.intent.{type, confidence}`. | Medium | Keep `type` and `confidence` as backward-compat aliases of `taskIntent.intent` and `taskIntent.confidence`. |
| Risk | Q8 evidence is weaker per 007 caveat. | Low | This is P2 work; document residual evidence gap. |
| Dependency | 005 Cluster 2 floor work must remain in place. | Low | Read-only reference. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `paraphraseGroup` be auto-derived (e.g., embedding cluster) or user-tagged? Default: auto-derive via simple keyword overlap heuristic for v1.
- Is cross-CLI drift bounded by a fixed threshold or ratio? Default: same task intent label, confidence drift < 0.30.
<!-- /ANCHOR:questions -->
