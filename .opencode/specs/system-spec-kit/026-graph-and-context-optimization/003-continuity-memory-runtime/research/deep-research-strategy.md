---
title: Deep Research Strategy — 002-continuity-memory-runtime audit
description: Correctness, concurrency, and doc-code drift audit over the 002-continuity-memory-runtime parent packet and its four direct children (001-cache-warning-hooks, 002-memory-quality-remediation, 003-continuity-refactor-gates, 004-memory-save-rewrite).
---

# Deep Research Strategy — 002-continuity-memory-runtime audit

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Forensic audit of the 002-continuity-memory-runtime packet — the parent and its four completed child phases — to surface correctness gaps, concurrency / race conditions, and doc-code drift before 026 progresses further. Research is canonical in `research.md`; the spec findings fence captures only the abridged sync.

### Usage
- **Init:** populated once; Topic, Key Questions, Non-Goals, and Stop Conditions are analyst-owned.
- **Per iteration:** the dispatched executor writes an iteration narrative plus JSONL + delta records; the reducer refreshes machine-owned sections.
- **Mutability:** mutable with clear ownership boundaries.
- **Protection:** Sections 3, 6, 7–11 are machine-owned and rewritten by the reducer.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, and doc-code drift across the parent packet and its four direct children (`001-cache-warning-hooks/`, `002-memory-quality-remediation/`, `003-continuity-refactor-gates/`, `004-memory-save-rewrite/`), with specific emphasis on the MCP/runtime code that those packets landed.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1 — Advisory-lock, sentinel-file, and generation-bumping paths in the continuity runtime (deep-research lock, cache-warning hooks, /memory:save): where can two concurrent writers or an interrupted writer + resumer corrupt or silently drop state? (race conditions, atomicity, fail-closed guarantees)
- [ ] Q2 — /memory:save planner-first rewrite: does the routing table in code match the documented behavior for every intent (decision, narrative_progress, narrative_delivery, handover_state, research_finding, task_update, metadata_only, drop)? Where is the specified-but-unimplemented gap or implemented-but-undocumented behavior?
- [ ] Q3 — Continuity-refactor Gates A–F (003-continuity-refactor-gates): which gate checks are actually enforced by runtime code vs. documented as enforced? Where does the gate runner's reporter contract differ from the gate spec?
- [ ] Q4 — Memory-quality remediation D1–D8 (002-memory-quality-remediation): for each of the 8 remediation slices, which land in code and which are only in documentation / tests? What silent-drop, enum-mismatch, or schema-mismatch paths remain?
- [ ] Q5 — Cache-warning hook system (001-cache-warning-hooks): is the documented transcript-identity + cache-token carry-forward contract fully honored by the hook runtime code, and does the replay harness cover the actual concurrency paths (two parallel Stop-handlers, hook failure, partial write)?
- [ ] Q6 — Reducer / state rehydration: does `reduce-state.cjs` + the deep-research state machine agree on the canonical JSONL schema (type enum, required fields, lineage fields) across all four children, or are there drift points between code, prompt pack, and protocol doc?
- [ ] Q7 — JSONL audit surface: are there first-class events emitted by live code that are undocumented, or documented events never emitted (e.g. `spec_synthesis_deferred`, `lock_released`, `blocked_stop`), creating doc-code drift on the audit contract?

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Refactoring, new features, or prescriptive design beyond flagging defects and drift points.
- Evaluating code review artifacts under `review/` (that belongs to `/spec_kit:deep-review`).
- Rewriting spec-kit memory DB schemas or changing retrieval ranking.
- Opinions on whether the flattened parent layout is correct; that decision is locked by REQ-001/REQ-002.
- Modifying runtime behavior during the audit. Read-only investigation; any proposed fix is a finding, not a landed change.
- Auditing unrelated 026 sub-packets (001-research-and-baseline, 003+) except as cross-references required to verify claims.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- All 7 key questions have concrete evidence-based answers (code cites + exact line numbers) in `research.md`.
- Three consecutive iterations with `newInfoRatio < 0.05` AND graph decision = `STOP_ALLOWED` (composite convergence passes).
- 10 iterations reached (hard cap from config).
- A P0 finding requires operator decision before further work (halt to surface).
- Pause sentinel `research/.deep-research-pause` appears.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet — populated as iterations answer questions]

---

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[First iteration — populated after iteration 1 completes]

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration — populated after iteration 1 completes]

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet — populated as directions are definitively eliminated]

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 1 — Map the runtime surface area. Enumerate every executable script, MCP tool, and shared runtime module that the four child phases (001–004) added or modified under `.opencode/skill/system-spec-kit/`, `.opencode/skill/sk-deep-research/`, and `.opencode/skill/sk-deep-review/`. Produce a files × packets matrix so subsequent iterations can walk targeted slices. Keep scope tight: include only modules whose commit-lineage or packet-owned trigger phrases point into 002-continuity-memory-runtime.

---

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

**Memory search (focused mode) returned an evidence gap** — no prior deep-research report directly targets this parent packet. Related surfaces:

- `system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement` — deep research for memory-DB refinement (related but different slice).
- `system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/003-continuity-refactor-gates/003-gate-c-writer-ready` — Gate C writer-ready memory in the same tree (use as starting point for Q3).
- `system-spec-kit/024-compact-code-graph/026-session-start-injection-debug` — session-start startup context injection debug (loosely related).

Child packet implementation-summary excerpts (from spec.md PHASE DOCUMENTATION MAP and implementation-summary.md):

- **001-cache-warning-hooks**: bounded Stop-path metadata handoff persisting transcript identity + cache-token carry-forward state, plus an isolated replay harness.
- **002-memory-quality-remediation**: D1–D8 repair train across five child phases, PRs landed per slice, outcomes verifiable from phase-local checklists.
- **003-continuity-refactor-gates**: gates-only coordination packet (Gates A–F), promoted follow-on work to sibling top-level phases `007`+.
- **004-memory-save-rewrite**: `/memory:save` is planner-first by default; returns structured planner response with routes/blockers/advisories and mutates nothing unless the operator opts in (`SPECKIT_MEMORY_SAVE_EXECUTE`).

Structural graph (stale, scanned today): 1426 files, 52157 nodes, 30235 edges. Most called symbols in scope include `memory_context`, `reduce-state`, `generate-context.js`.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis output in this packet's research directory.
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred).
- Machine-owned sections: reducer controls Sections 3, 6, 7–11.
- Canonical pause sentinel: `research/002-continuity-memory-runtime-pt-01/.deep-research-pause`.
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`.
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`.
- Current generation: 1.
- Executor: `cli-copilot` / `gpt-5.4` / reasoning-effort `high` / max 3 concurrent copilot dispatches (account-level throttle).
- Started: 2026-04-23T20:04:56Z.
<!-- /ANCHOR:research-boundaries -->
