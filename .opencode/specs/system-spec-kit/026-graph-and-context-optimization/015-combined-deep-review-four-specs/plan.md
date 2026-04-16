---
title: "Implementation Plan: Combined Deep Review — 009 + 010 + 012 + 014"
description: "Loop-manager plan for a 50-iteration combined deep review using cli-copilot (gpt-5.4, high) as the dispatch substitute for @deep-review."
trigger_phrases:
  - "combined deep review plan"
  - "loop manager plan"
  - "cli-copilot dispatch plan"
importance_tier: "normal"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "015-combined-deep-review-four-specs"
    last_updated_at: "2026-04-15T18:56:00Z"
    last_updated_by: "claude-opus-4.6-1m"
    recent_action: "Author combined-review plan"
    next_safe_action: "Initialize review state files"
    blockers: []
    key_files: ["review/deep-review-config.json", "review/deep-review-strategy.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-04-15T18:56:00Z"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Combined Deep Review — 009 + 010 + 012 + 014

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runtime** | Claude Opus 4.6 (1M) as loop manager; cli-copilot gpt-5.4 (effort high) as iteration dispatcher |
| **Storage** | Filesystem only — JSONL append-only state log + markdown iteration files |
| **Validation** | `sk-deep-review/scripts/reduce-state.cjs` reducer; inline 3-signal convergence vote with legal-stop gates |

### Overview
Loop-manager (this Claude session) owns state-file mutation, reducer invocation, convergence evaluation, and synthesis. Each of up to 50 iterations is delegated to a fresh `copilot` CLI subprocess with a compact context packet pointing at the current iteration's dimension + target + state files. Copilot writes `iteration-NNN.md`, appends one JSONL record, and updates strategy.md dimension coverage — then exits. The loop manager reads outputs, refreshes the reducer, evaluates convergence, and either dispatches the next iteration or enters synthesis.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec folder created under `026-graph-and-context-optimization/015-combined-deep-review-four-specs/`
- [x] Review packet directories exist (`review/`, `review/iterations/`)
- [x] copilot CLI available (`copilot --version` returns 1.0.27)
- [ ] State files initialized (config, state.jsonl, findings registry, strategy)
- [ ] Scope file manifest resolved into config.reviewScopeFiles

### Definition of Done
- [ ] `review/review-report.md` present with a verdict and Planning Packet
- [ ] `deep-review-state.jsonl` contains `synthesis_complete` event
- [ ] Continuity update routed into a canonical spec doc via `generate-context.js`
- [ ] All 50 iterations completed OR convergence declared earlier with quality gates passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Loop-manager / LEAF-dispatcher with externalized state. This session acts as manager; each iteration's LEAF agent is substituted by a `copilot -p` subprocess.

### Key Components
- **Loop manager (this session)**: Phase orchestration, state-file writes, reducer invocation, convergence decision, synthesis
- **Copilot LEAF (per iteration)**: Read state + strategy, review the assigned dimension/files, write iteration artifact + JSONL record + strategy updates
- **Reducer (`reduce-state.cjs`)**: Refresh `findings-registry.json`, `dashboard.md`, and machine-owned strategy sections
- **Convergence evaluator (inline in this manager)**: 3-signal weighted vote + legal-stop gates

### Data Flow
1. Manager reads current state → emits state summary
2. Manager dispatches `copilot -p ...` with context packet
3. Copilot reads state files, reviews, writes iteration-NNN.md + appends JSONL + updates strategy
4. Manager runs reducer → refreshed findings registry + dashboard
5. Manager evaluates convergence → STOP | BLOCKED | STUCK | CONTINUE
6. If STOP (legal + graph-allowed): phase_synthesis; else repeat
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder + review/ packet directories
- [ ] Review state files (config, state.jsonl, findings registry, strategy)
- [ ] Scope manifest embedded in config.reviewScopeFiles
- [ ] Preflight: `copilot --version`, `gh auth status` (best effort)

### Phase 2: Iteration Loop (max 50)
- [ ] Iteration 1: inventory pass — map artifacts, file types, estimate complexity
- [ ] Iterations 2-N: risk-ordered dimension passes (correctness → security → traceability → maintainability), rotating across the four targets
- [ ] Reducer runs after each iteration; findings registry refreshed
- [ ] Convergence vote evaluated; stuck recovery if 2+ no-progress iterations

### Phase 3: Synthesis
- [ ] Build deduplicated finding registry
- [ ] Adversarial self-check on P0/P1
- [ ] Compile `review/review-report.md` (9 sections + Planning Packet)
- [ ] Append `synthesis_complete` event to JSONL
- [ ] Set config.status = "complete"

### Phase 4: Save
- [ ] Build structured JSON payload
- [ ] `generate-context.js /tmp/save-context-data.json <spec_folder>`
- [ ] Verify canonical spec doc updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Preflight | copilot available + authenticated | `copilot --version`, `gh auth status` |
| Per iteration | Output artifacts written (`iteration-NNN.md`, JSONL delta, strategy edit) | `test -f`, `grep`, reducer |
| Convergence | Legal-stop + graph gates produce expected decision | inline evaluator |
| Synthesis | review-report.md passes section presence check | grep anchors |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `copilot` CLI 1.0.27+ | External | Green | Cannot dispatch iterations |
| `node` (for reducer) | External | Green | Cannot refresh findings registry |
| `sk-deep-review/scripts/reduce-state.cjs` | Internal | Green | Cannot refresh findings registry |
| `generate-context.js` | Internal | Green | Cannot save continuity update |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Copilot auth failure, 3+ consecutive dispatch errors, contradictory state
- **Procedure**: Halt loop → append `blocked_stop` event → archive the `review/` tree under `review_archive/{timestamp}` → surface STATUS=FAIL with clear recovery strategy
<!-- /ANCHOR:rollback -->
