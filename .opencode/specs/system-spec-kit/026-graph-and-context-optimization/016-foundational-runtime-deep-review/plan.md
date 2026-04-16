---
title: "Implementation Plan: Foundational Runtime Deep Review"
description: "Three-phase deep-review plan targeting 19 foundational runtime candidates: 7 HIGH-priority adversarial reviews, 8 MEDIUM-priority hardening reviews, and findings synthesis with remediation backlog."
trigger_phrases:
  - "016 plan"
  - "foundational review plan"
  - "deep review plan"
  - "runtime seams plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review"
    last_updated_at: "2026-04-16T00:00:00Z"
    last_updated_by: "claude-opus-4.6"
    recent_action: "Deep-dive analysis complete, spec docs updated, deep-research prompt created"
    next_safe_action: "Run 50-iteration deep-research, then begin Phase 1 deep-review dispatch"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:016-plan-v1-2026-04-16"
      session_id: "016-planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Foundational Runtime Deep Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript (CJS), Python, YAML |
| **Framework** | MCP server (runtime), Vitest (testing) |
| **Storage** | SQLite (vector-index), temp-file state |
| **Testing** | `/spec_kit:deep-review` iterations |

### Overview

This plan executes targeted deep-review iterations on 19 foundational runtime candidates identified by a gpt-5.4 analysis of the 026 train. Phase 015 concentrated on 009/010/012/014 but left earlier foundational phases (002, 003, 005, 008) with less scrutiny. The review focuses on contract drift, hidden semantics, and soft governance patterns rather than obvious broken logic.

### Execution Strategy

- **Phase 1 first**: HIGH-priority files reviewed before MEDIUM targets
- **Parallel within phase**: Multiple deep-review dispatches can run concurrently (max 3 per copilot concurrency limit)
- **Per-file iterations**: Each candidate gets its own `/spec_kit:deep-review` invocation with file-specific adversarial prompts
- **Convergence threshold**: 0.10, matching 015's approach
- **Iteration cap**: 50 per dispatch to stay within budget
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Analysis output reviewed and candidates verified (`scratch/026-analysis-output.md`)
- [x] 015 coverage gaps confirmed -- foundational phases received less scrutiny
- [x] Deep-dive analysis complete -- 5 scratch reports with line-level findings, test coverage gaps, cross-cutting patterns
- [ ] Candidate files verified to still exist at expected paths
- [ ] 015 remediation changes to H6/H7 checked for overlap

### Definition of Done

- [ ] All 7 HIGH-priority files reviewed with findings documented
- [ ] All 8 MEDIUM-priority files reviewed with findings documented
- [ ] Findings synthesized into remediation backlog
- [ ] Implementation summary written
- [ ] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deep-review iteration loop with externalized JSONL state and convergence detection.

### Key Components

- **`/spec_kit:deep-review`**: Autonomous review loop dispatcher
- **JSONL state**: Per-iteration findings persisted in `review/` subfolder
- **Convergence detector**: Stops iterations when new findings drop below threshold
- **Synthesis pass**: Cross-file finding aggregation after all iterations complete

### Data Flow

1. Candidate file selected from priority list
2. `/spec_kit:deep-review` dispatched with file-specific adversarial prompt
3. Iterations produce JSONL findings, convergence detected
4. Findings aggregated across candidates into synthesis report
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0.5: Deep Research (50 iterations)

Focus: Investigate the 4 cross-cutting themes identified in the deep-dive before starting per-file reviews. This builds the investigative foundation that makes per-file reviews more targeted.

**Research domains:**
1. Silent fail-open patterns — catalog all fail-open/degrade paths across the 19 candidates, classify by blast radius
2. State contract honesty — map which files conflate success/skip/defer/fail, trace downstream consumers that assume truthful returns
3. Concurrency and write coordination — enumerate all read-modify-write paths without locks, shared temp paths, and write-then-read assumptions
4. Stringly typed governance — identify which prose/string contracts lack mechanical validation and assess which ones carry the most runtime risk
5. Test coverage gaps — systematically verify which adversarial scenarios have direct vs indirect vs no coverage

**Execution:** 50-iteration `/spec_kit:deep-research` with convergence threshold 0.08.

### Phase 1: HIGH-Priority Deep Review (7 files)

Focus: Adversarial review of the 7 highest-leverage foundational runtime seams.

**Deep-review targets:**

| Dispatch | File | Focus Prompt |
|----------|------|-------------|
| DR-H1 | `mcp_server/hooks/claude/session-stop.ts` | Stress regex spec-folder detection edge cases, 4s autosave timeout races, transcript fingerprint collisions |
| DR-H2 | `mcp_server/hooks/claude/hook-state.ts` | Stress stale-state selection under concurrent sessions, atomic save semantics, temp-file authority boundaries |
| DR-H3 | `mcp_server/lib/context/shared-payload.ts` | Stress forward-compatibility of trust/provenance enums, missing enum consumers, enum exhaustiveness |
| DR-H4 | `mcp_server/lib/graph/graph-metadata-parser.ts` | Stress manual-vs-derived merge conflicts, legacy normalization silent failures, implicit status derivation accuracy |
| DR-H5 | `shared/algorithms/adaptive-fusion.ts` | Stress hidden continuity profile leaking into public search, weight drift, resume-only activation guarantee |
| DR-H6 | `mcp_server/handlers/save/reconsolidation-bridge.ts` | Stress cross-boundary combinations (tenant/user/agent/session), scope filter bypass, governance metadata preservation |
| DR-H7 | `mcp_server/handlers/save/post-insert.ts` | Stress planner-mode contract honesty, env-flag interaction matrix, accidental mutation in plan-only path |

**Parallelization:** DR-H1 + DR-H2 + DR-H3 can run concurrently (same concurrency cap). Then DR-H4 + DR-H5 + DR-H6. Then DR-H7.

### Phase 2: MEDIUM-Priority Deep Review (8 files)

Focus: Hardening review of surfaces with behavioral density or advisory-only governance.

**Deep-review targets:**

| Dispatch | File | Focus Prompt |
|----------|------|-------------|
| DR-M1 | `scripts/core/post-save-review.ts` | Stress lineage heuristics with real packet histories, over-linking and under-linking scenarios |
| DR-M2 | `scripts/lib/trigger-phrase-sanitizer.ts` | Fuzz with unicode, HTML entities, control characters, prompt-shaped contamination |
| DR-M3 | `mcp_server/handlers/code-graph/query.ts` | Stress cyclic graphs, multi-source blast-radius, maxDepth + unionMode + breadcrumb threshold interactions |
| DR-M4 | `scripts/graph/backfill-graph-metadata.ts` | Stress derived-metadata entrenchment, bad assumption propagation across packet corpus |
| DR-M5 | `skill-advisor/scripts/skill_advisor.py` | Stress dual-source divergence, transitive boost damping, graph boosts subordination to direct intent |
| DR-M6 | `skill-advisor/scripts/skill_graph_compiler.py` | Stress whether advisory integrity warnings should be release-gating blockers |
| DR-M7 | `command/spec_kit/assets/spec_kit_plan_auto.yaml` | Stress concurrency, idempotence, folder-state edge cases in absorbed intake behavior |
| DR-M8 | `015-implementation-deep-review/implementation-summary.md` | Research pass on what 026 still knows is fragile but has not followed up on |

**Parallelization:** DR-M1 + DR-M2 + DR-M3 concurrently. Then DR-M4 + DR-M5 + DR-M6. Then DR-M7 + DR-M8.

### Phase 3: Synthesis and Remediation Backlog

Focus: Aggregate findings, deduplicate against 015, classify by severity, produce remediation recommendations.

- [ ] Aggregate all findings from Phase 1 and Phase 2
- [ ] Deduplicate against 015 findings (cross-reference `015-implementation-deep-review/review/review-report.md`)
- [ ] Classify findings by severity (P0/P1/P2)
- [ ] Identify cross-cutting patterns across candidates
- [ ] Produce remediation backlog with effort estimates
- [ ] Write implementation summary
- [ ] Update parent 026 spec with 016 completion status
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deep review | Per-file adversarial review iterations | `/spec_kit:deep-review` |
| Convergence | Iteration convergence below 0.10 threshold | Built-in convergence detector |
| Deduplication | Cross-reference against 015 findings | Manual comparison |
| Validation | Packet strict validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `scratch/026-analysis-output.md` | Internal | Green | Cannot identify candidates without analysis |
| 015 remediation state | Internal | Yellow | H6/H7 may be modified by concurrent 015 work |
| `/spec_kit:deep-review` command | Internal | Green | Primary execution tool |
| Copilot concurrency (max 3) | External | Green | Limits parallel dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Deep-review iterations produce no actionable findings after Phase 1
- **Procedure**: Document null result, close packet as "review complete, no remediation needed"
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (HIGH review) ──► Phase 3 (Synthesis)
                              ▲
Phase 2 (MEDIUM review) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (HIGH) | Analysis output | Phase 3 |
| Phase 2 (MEDIUM) | Analysis output | Phase 3 |
| Phase 3 (Synthesis) | Phase 1, Phase 2 | None |

Note: Phase 1 and Phase 2 can run in parallel if resources allow, but Phase 1 should start first given higher priority.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: HIGH review (7 files) | High | 7 deep-review dispatches, ~50 iterations each |
| Phase 2: MEDIUM review (8 files) | Medium | 8 deep-review dispatches, ~30 iterations each |
| Phase 3: Synthesis | Medium | 2-4 hours manual synthesis |
| **Total** | | **15 dispatches + synthesis** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] All candidate files verified to exist
- [ ] 015 overlap checked for H6/H7
- [ ] Deep-review command tested on one file

### Rollback Procedure

1. Stop all running deep-review dispatches
2. Preserve partial findings in `review/` subfolder
3. Document stopping point for future resumption
4. No code changes to roll back (review-only packet)

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A -- review findings are additive, no production changes
<!-- /ANCHOR:enhanced-rollback -->
