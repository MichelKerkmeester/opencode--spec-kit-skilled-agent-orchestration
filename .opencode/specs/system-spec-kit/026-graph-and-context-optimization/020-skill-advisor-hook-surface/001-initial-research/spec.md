---
title: "Feature Specification: 020 Initial Research Wave (hook architecture investigation)"
description: "Level 2 research packet dispatched via /spec_kit:deep-research :auto with cli-codex gpt-5.4 high fast. Investigates cross-runtime hook trigger points, empirical cache/TTL curve, context-budget tradeoffs, freshness semantics, and failure-mode contract. 10-iteration budget."
trigger_phrases:
  - "020 initial research"
  - "skill advisor hook architecture research"
  - "hook trigger point research"
importance_tier: "critical"
contextType: "research"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/001-initial-research"
    last_updated_at: "2026-04-19T06:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Research packet scaffolded; about to dispatch"
    next_safe_action: "Dispatch iteration 1 via codex exec gpt-5.4 high fast"
    blockers: []

---
# Feature Specification: 020 Initial Research Wave

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Dispatch** | `/spec_kit:deep-research :auto` |
| **Iteration Budget** | 10 |
| **Executor** | cli-codex gpt-5.4 high fast (timeout 1800s) |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (research-first gate for 020 implementation) |
| **Status** | Spec Ready, Dispatch Pending |
| **Effort Estimate** | 10 iterations × ~5-8 min = 50-80 min wall clock |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 020 charter (ADR-001) committed to research-first. This packet runs the investigation: Codex hook surface availability, empirical cache/TTL measurement, context-budget tradeoffs, freshness semantics, failure-mode contract. Without these answers, implementation cluster decomposition is guesswork.

### Purpose

Converge on a ranked set of implementation proposals with concrete child-spec-folder mappings. Each finding cluster becomes a sibling 020/002-* child.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- Per-runtime hook-trigger-point audit (Claude UserPromptSubmit, Codex equivalent if any, Copilot equivalent, Gemini equivalent)
- Empirical latency + cache-TTL measurement using the 019/004 200-prompt corpus
- Freshness signal semantics parallel to code-graph `getGraphFreshness()`
- Context-budget curve (40/60/80/120 tokens vs routing-quality retention)
- Failure-mode contract (subprocess timeout, Python missing, JSON parse error)
- Cross-runtime snapshot-test harness design

### 3.2 Out of Scope

- Implementation — this packet produces proposals only
- New advisor algorithm changes — pattern packages existing 019/004 accuracy
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

- **REQ-001**: Ranked proposal set with child-cluster mapping
- **REQ-002**: Codex hook surface answer (Q1 from parent 020 spec)
- **REQ-003**: Empirical cache-TTL recommendation backed by measurement
- **REQ-004**: Freshness-signal semantic design that matches code-graph vocabulary
- **REQ-005**: research.md synthesis written on convergence
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] 10 iterations complete OR convergence (newInfoRatio < 0.05 for 3 consecutive)
- [ ] research.md written with executive summary + per-cluster recommendations
- [ ] All 7 open questions from parent 020 §12 answered or documented as remaining-open

### Acceptance Scenario 1: Codex Hook Surface Answer
**Given** the research loop reaches Q1, when the Codex hook audit completes, then the iteration artifact records whether Codex has `SessionStart`, `UserPromptSubmit`, and `PreToolUse` parity with concrete source evidence.

### Acceptance Scenario 2: Cache Recommendation
**Given** the 019/004 routing corpus is available, when cache/TTL research completes, then the synthesis records a measured TTL recommendation and rejects unsafe stale-cache reuse.

### Acceptance Scenario 3: Freshness Semantics
**Given** the advisor brief producer needs trust vocabulary, when freshness research completes, then the synthesis maps advisor source state to `live`, `stale`, `absent`, or `unavailable`.

### Acceptance Scenario 4: Cluster Mapping
**Given** all required questions are answered or explicitly deferred, when final synthesis is written, then each implementation cluster maps to a proposed child spec folder.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Codex CLI hook gap could block cross-runtime parity | Research identifies wrapper strategy or alternative |
| Cache TTL measurement needs real prompts | Reuse 019/004 200-prompt corpus as fixture |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Inherits §12 from parent 020/spec.md. Convergence resolves or documents remaining-open.
<!-- /ANCHOR:questions -->
