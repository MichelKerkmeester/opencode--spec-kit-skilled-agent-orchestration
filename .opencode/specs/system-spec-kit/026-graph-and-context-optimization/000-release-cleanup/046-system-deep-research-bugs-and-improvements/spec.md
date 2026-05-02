---
title: "Research Charter: System Deep Research — Bugs and Improvements (20 iterations)"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "20-iteration deep research across system-spec-kit, mcp_server, code_graph, skill_advisor; surfaces production bugs, wiring/automation bugs, refinement/improvement opportunities, and architecture/file-organization opportunities. Each finding cites file:line evidence."
trigger_phrases:
  - "046-system-deep-research-bugs-and-improvements"
  - "system deep research bugs"
  - "20 iteration deep research"
  - "production bug hunting research"
  - "architecture refinement research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements"
    last_updated_at: "2026-05-01T05:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored with 20 research angles"
    next_safe_action: "Invoke /spec_kit:deep-research:auto"
    blockers: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Charter: System Deep Research — Bugs and Improvements

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-01 |
| **Branch** | `main` (skip-branch) |
| **Parent** | `005-review-remediation` |
| **Mode** | Deep research (`/spec_kit:deep-research:auto`) |
| **Iterations** | 20 |
| **Executor** | `cli-codex` `gpt-5.5` reasoning=`high` service-tier=null (normal speed) |
| **Convergence** | 0.85 (allow earlier) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After packets 042-045 closed the documented stress-coverage backlog and known drift findings, the next layer of risk is unknowns: latent production-code bugs, miswired automation paths, and architectural shortcuts that have accumulated across `system-spec-kit` (the umbrella skill), `mcp_server` (the runtime), `code_graph` (subsystem), and `skill_advisor` (subsystem). These four surfaces have grown organically over many packets; this charter sets up a systematic deep research pass to surface findings before they ship.

### Purpose

Run a 20-iteration autonomous deep-research loop using the canonical `/spec_kit:deep-research:auto` workflow with `cli-codex` `gpt-5.5` at `high` reasoning. Each iteration investigates one of 20 pre-defined angles (5 per category × 4 categories). Findings must cite `file:line` evidence and classify each item as P0/P1/P2/none. The output is a triage report that feeds remediation packets (047+).

Categories:
- **A. Production code bugs** (5 angles) — race conditions, leaks, silent errors, validation gaps
- **B. Wiring / automation bugs** (5 angles) — hooks, CLI orchestrators, memory wiring, validators, workflow routing
- **C. Refinement / improvement opportunities** (5 angles) — search quality, scorer accuracy, advisor hit rate, staleness detection, test reliability
- **D. Architecture / file organization opportunities** (5 angles) — module boundaries, dependency graph, type duplication, folder topology, build separation

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (the 20 research angles)

#### A. Production Code Bugs

- **A1 — Daemon concurrency edge cases.** Audit `mcp_server/skill_advisor/lib/daemon/` (lease.ts, lifecycle.ts, watcher.ts) and `lib/freshness/` (generation.ts, trust-state.ts, cache-invalidation.ts) for race conditions, ordering bugs, missing happens-before edges. Cite specific function names + line numbers where two paths can run concurrently without a lock or a happens-before guarantee.
- **A2 — Code-graph SQLite contention.** Audit `mcp_server/code_graph/` (handlers and lib) for concurrent-scan + concurrent-read patterns. Are transactions the right size? Are write-write conflicts handled? Are stale snapshots ever served? Cite the SQL or query construction sites.
- **A3 — Resource leaks.** Audit long-running paths for FD leaks (open file handles not closed on error), unbounded memory growth (prompt-cache without TTL enforcement, watcher arrays that grow), subprocess zombies (spawn without await/close). Cite specific allocators and their cleanup sites.
- **A4 — Silent error recovery patterns.** sa-004 was a misread, but the *pattern* of catch-and-recover that masks real corruption likely exists elsewhere. Audit `try/catch` blocks across `mcp_server/skill_advisor/lib/` and `mcp_server/code_graph/lib/` for any place that swallows an error without logging, without surfacing, or with too-broad recovery. Classify each as legitimate vs concerning.
- **A5 — Schema validation gaps.** Audit `JSON.parse` and `zod.parse` usage. Where are schema validations missing? Where are unsafe `as` casts used? Where can adversarial input bypass validation? Audit path traversal: are user-provided paths always normalized + bounded to workspace root?

#### B. Wiring / Automation Bugs

- **B1 — Hook contract drift across runtimes.** Audit the 5 hook integrations (Claude `user-prompt-submit`, Copilot `user-prompt-submit`, Gemini `user-prompt-submit`, Codex `SessionStart`+`UserPromptSubmit`, OpenCode plugin bridge) under `mcp_server/skill_advisor/lib/hooks/` and runtime-specific plugins. Do they all produce the same advisor-brief format? Same fallback paths when the daemon is down? Cite the rendering function + format strings per runtime.
- **B2 — CLI orchestrator skill correctness.** Audit `.opencode/skill/cli-codex/`, `cli-copilot/`, `cli-gemini/`, `cli-claude-code/`, `cli-opencode/` for: dispatch-prompt template correctness, mode/flag drift between skills, self-invocation guards, sandbox/approval flag wiring. Where does each skill drift from the others?
- **B3 — Memory MCP round-trip integrity.** Audit `memory_save → memory_index_scan → memory_search → memory_context` flow: does what gets saved actually become searchable? Are continuity blocks parsed correctly? Are causal links preserved? Trace 1-2 example saves end-to-end and report inconsistencies.
- **B4 — Spec-kit validator correctness.** Audit `scripts/spec/validate.sh` and the rule files in `scripts/rules/`. Are there false positives (failing valid spec folders) or false negatives (passing invalid)? Specifically: SPEC_DOC_INTEGRITY checks, EVIDENCE_CITED patterns (does it really catch all evidence formats?), TEMPLATE_HEADERS detection (regex sufficiency).
- **B5 — Workflow command auto-routing.** Audit `.opencode/command/spec_kit/` (complete.md, plan.md, implement.md, deep-research.md, deep-review.md, resume.md) for state-machine correctness: do the YAML workflows handle missing prerequisites, gate failures, partial state correctly? Where can the workflow get stuck or skip a required step?

#### C. Refinement / Improvement Opportunities

- **C1 — Search-quality W3-W13 latency and accuracy.** Audit `mcp_server/stress_test/search-quality/` measurements (corpus, harness, baseline metrics). Are there channel weights, cross-encoder thresholds, or fusion strategies that could measurably improve precision@K or NDCG without regressing recall? Identify 3-5 concrete tuning opportunities with expected impact.
- **C2 — Scorer fusion accuracy on edge cases.** Audit `mcp_server/skill_advisor/lib/scorer/` (fusion.ts, projection.ts, lanes/). What edge cases does the current fusion mishandle? Ambiguity ties, near-duplicate skill projections, adversarial trigger phrases? Propose targeted improvements.
- **C3 — Skill advisor recommendation quality.** Sample real-world prompts (from `scripts/fixtures/skill_advisor_regression_cases.jsonl` and live captures if available) and audit the advisor's recommendation hit rate. Where does it confidently recommend the wrong skill? Where does it correctly recommend low-confidence with no clear winner? What patterns dominate the false-positive and false-negative populations?
- **C4 — Code-graph staleness detection accuracy.** Audit the staleness model in `code_graph/lib/` and `doctor:code-graph` skill. Under what change patterns does it false-stale (forces unnecessary reindex)? Under what patterns does it false-fresh (misses needed reindex)? Identify gaps and proposed corrections with concrete change types.
- **C5 — Test suite reliability and flake patterns.** Catalog the unit and stress tests for environmental dependencies, timing dependencies, fixture-state dependencies. Where do tests rely on `process.env`, `Date.now()`, or external file system state in ways that make CI flaky? Propose fixture/sandbox improvements.

#### D. Architecture / File Organization Opportunities

- **D1 — `mcp_server/lib/` boundary discipline.** Audit module boundaries between `lib/freshness/`, `lib/derived/`, `lib/lifecycle/`, `lib/scorer/`, `lib/daemon/`, `lib/corpus/`, `lib/handlers/`. Are responsibilities clean? Where do modules reach across boundaries (e.g. lifecycle importing scorer internals)? Recommend module re-organization where it'd reduce coupling.
- **D2 — Module dependency graph health.** Map the dependency graph for `mcp_server/` (excluding tests). Are there circular imports? Dead exports (declared but never imported)? Hot-spot modules with 50+ dependents? What's the longest dependency chain depth?
- **D3 — Type / schema duplication.** Audit zod schemas, TypeScript types, and runtime guards across `mcp_server/`. Where is the same shape defined in multiple places? Where do types drift from runtime schemas? Recommend a single-source-of-truth strategy.
- **D4 — Spec-kit folder topology sustainability.** Audit `.opencode/specs/system-spec-kit/` depth (e.g. `026/000/005/045-...`), naming conventions, and packet sprawl (45+ packets under one parent). Is the structure scaling? Recommend folder reorganization or naming refinements.
- **D5 — Build / dist / runtime separation.** Audit `mcp_server/` `tsconfig`, `dist/` outputs, and runtime imports. Which `.js` paths in source files are compiled outputs vs source-of-truth? Are there places where source and dist drift? Recommend clarifications.

### Out of Scope

- Implementation of any findings (deferred to remediation packets 047+)
- Live data / production telemetry analysis (research operates over checked-in code only)
- Performance benchmarking that requires special hardware
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 20 angles produce an iteration markdown file with findings | `research/iterations/iteration-NNN.md` exists for NNN ∈ 001..020 |
| REQ-002 | Each finding cites a `file:line` reference | grep `:[0-9]+` in iteration files; spot-check 5 random findings |
| REQ-003 | Findings classified as P0/P1/P2/none | Each iteration's findings table has a Priority column |
| REQ-004 | Convergence detection produces a summary | `research/research.md` synthesizes findings across iterations |
| REQ-005 | Executor is `cli-codex` `gpt-5.5` reasoning=`high`, normal speed | Workflow config records executor; logs show `model_reasoning_effort=high` and absence of `service_tier=fast` |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | All 20 iterations complete within reasonable wall clock (<3h total) | Logs show duration |
| REQ-007 | At least 30 distinct findings surfaced across the 4 categories | Aggregate count from research.md |
| REQ-008 | Each P0 finding has a recommended remediation action | Triage table in research.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20-iteration deep research workflow completes via `/spec_kit:deep-research:auto`
- **SC-002**: At least 30 findings, with P0/P1 prioritization and remediation paths
- **SC-003**: `research/research.md` synthesizes findings into a remediation seed for follow-on packets
- **SC-004**: `validate.sh --strict` exits 0 for the packet
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-codex hits rate limits over 20 iterations | Workflow stalls | Workflow has retry / pause logic; user can resume from state |
| Risk | Some angles produce zero findings | Iteration is "wasted" | Treat as positive signal; document "no issues found" with method notes |
| Risk | Findings overlap between angles | Duplicate work | Convergence detection deduplicates; research.md synthesizes |
| Dependency | `cli-codex` `gpt-5.5` available | All iterations blocked | Verified working in packets 042-045 |
| Dependency | sk-deep-research workflow YAML | Dispatch correctness | Canonical command surface, no manual workaround |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration target <10 min wall clock; 20 iterations <3h total
- **NFR-P02**: Iteration files capped at ~2000 words each to keep synthesis tractable

### Reliability
- **NFR-R01**: Workflow tolerates a single iteration failure without aborting (resume from checkpoint)
- **NFR-R02**: State is externalized in `research/deep-research-state.jsonl`

### Auditability
- **NFR-A01**: Every finding has a `file:line` citation; aggregate summaries cite iteration numbers
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Iteration content
- Iteration finds no issues for an angle → marker "NO_FINDINGS" with method notes
- Iteration finds an issue already reported in earlier iteration → mark as duplicate, link
- Iteration finds an issue out of charter scope → flag, recommend follow-on but don't pursue

### Workflow
- An iteration fails mid-run (e.g. cli-codex error) → resume from `deep-research-state.jsonl` checkpoint
- Convergence reached early (<20 iterations) → workflow may stop and summarize; user can extend with `--max-iterations=NN`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 20 iterations × 4 categories — large surface |
| Risk | 12/25 | Findings could surface critical bugs but the research itself is read-only |
| Research | 20/20 | This IS deep research; expect deep findings |
| **Total** | **54/70** | **Level 3 — significant research effort** |
<!-- /ANCHOR:complexity -->

---

## L2: ACCEPTANCE SCENARIOS

### AS-001: 20 iterations produced

- **Given** the deep-research workflow runs to completion
- **When** I list `research/iterations/`
- **Then** there are exactly 20 `iteration-NNN.md` files

### AS-002: Findings cite evidence

- **Given** any iteration markdown file
- **When** I grep for `file:line` style citations
- **Then** at least 3 citations appear (spot-checked across 5 random iterations)

### AS-003: Triage produces actionable backlog

- **Given** `research/research.md` synthesis
- **When** I read its remediation section
- **Then** P0 findings have concrete next-action recommendations (file path + suggested change direction)

### AS-004: Workflow used canonical surface

- **Given** the workflow logs
- **When** I inspect dispatch
- **Then** dispatch went through `/spec_kit:deep-research:auto` (not a manual codex loop or Task-tool invocation of @deep-research)

### AS-005: Strict validator passes

- **Given** the finalized packet
- **When** `validate.sh --strict` runs
- **Then** exit 0

---

## 10. OPEN QUESTIONS

- None at scaffold time. Convergence threshold (0.85) may be tuned during the first few iterations; defer to workflow owner.
<!-- /ANCHOR:questions -->

---
