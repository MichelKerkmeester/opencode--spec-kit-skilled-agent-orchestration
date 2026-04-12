---
title: Deep Research Strategy — Memory Refactor vs Deprecation
_lineage: generation_2_ten_iteration_rerun (parent: generation_1_single_shot_retrofit)
_last_updated: 2026-04-11T13:25:00Z
_note: "Updated after generation 2 rerun completed 10 real iterations. Machine-owned sections below now reflect actual per-iteration work, not the generation-1 single-shot synthesis. See iterations/iteration-001.md through iteration-010.md for real ground truth. Generation-1 retrofit wrapper archived at research/archive/retrofit-2026-04-11/."
---

# Deep Research Strategy — Memory Refactor vs Deprecation

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Strategy file for phase 017 research. Records the topic, key questions, answered questions, and a retrospective summary from the 10-iteration generation-2 rerun. The machine-owned sections (what worked, what failed, exhausted approaches, next focus) now reflect actual per-iteration work.

### Usage
- **Location**: `017-memory-refactor-or-deprecation/research/deep-research-strategy.md`
- **Status**: generation 2 complete — 10 real iterations executed
- **Ground truth**: `research/iterations/iteration-001.md` through `iteration-010.md` + `research/research.md` (generation-1 synthesis, still authoritative for the final recommendation)

### Lineage
- **Generation 1** (2026-04-10): single-shot `codex exec` delegation; retrofitted with skeletal state files on 2026-04-11T12:15:00Z; retrofit wrapper archived at `research/archive/retrofit-2026-04-11/iteration-001-retrofit-wrapper.md`
- **Generation 2** (2026-04-11T12:35:00Z — 13:25:00Z): real 10-iteration rerun by claude-opus-4-6 acting as both orchestrator and worker; every iteration has distinct focus, file citations, and findings; stopped on `all_questions_answered_plus_audit_complete` with composite convergence score 0.92

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:topic -->
## 2. TOPIC

Should the current Spec Kit Memory system be deprecated, refactored, or replaced — and what is the right replacement architecture given that we already maintain rich, structured spec kit documentation?

Working hypothesis: current memory files are barebones, low-value, and largely redundant with existing spec kit documentation (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `research/research.md`). If the hypothesis holds, propose a concrete replacement architecture — not just "deprecate."

<!-- /ANCHOR:topic -->

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

All 8 questions were answered by the single-shot run. See Section 6 for the answered versions.

- [x] Q1. Current memory system — what does it actually do right now?
- [x] Q2. Value assessment — are the memories themselves useful?
- [x] Q3. Redundancy with spec kit documentation — how much overlap?
- [x] Q4. Retrieval value — does MCP search on memories actually work?
- [x] Q5. Alternative architectures — what are the options?
- [x] Q6. Migration path — what happens to the 153 existing memories?
- [x] Q7. Integration impact — what breaks if memory is deprecated?
- [x] Q8. Recommendation — what should we actually do?

<!-- /ANCHOR:key-questions -->

---

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Do NOT redesign the generator (phase 005 track).
- Do NOT modify any of the 153 existing memory files during research.
- Do NOT touch MCP server code.
- Do NOT make the decision unilaterally — present ranked options with trade-offs.

<!-- /ANCHOR:non-goals -->

---

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 8 key questions answered with cited evidence.
- Convergence below 0.05 for 2 consecutive iterations (sk-deep-research default).
- 12 iterations reached.
- Architectural deadlock halt if data missing.
- Recommendation drafted and defensible.

**Actual stop**: `single_shot_synthesis_complete` after one Codex reasoning pass (all 8 questions answered in one atomic operation).

<!-- /ANCHOR:stop-conditions -->

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

All answers cite `research/research.md` and the `findings/` subfolder as the evidence source. Line ranges reference the `research.md` sections.

- **Q1. Current memory system — what it does today** (answered in `research/research.md` §Q1)
  - Save path: `generate-context.ts` → authoritative spec folder resolution → `runWorkflow()` → memory file under `<spec-folder>/memory/`
  - `memory_save` runs a 16-stage pipeline (governance, preflight, template contract, spec-doc health, dedup, embedding, quality gate, PE arbitration, atomic save, embedding index, chunking, post-insert, reconsolidation, enrichment, causal edges, commit)
  - Retrieval: `memory_context` is the L1 orchestration surface and routes into `handleMemorySearch` + `handleMemoryMatchTriggers`
  - Session continuity: `session_resume` and `session_bootstrap` wrap `memory_context(...resume...)`
  - **Assessment**: the system does two jobs at once — narrative session journal AND retrieval/indexing substrate. The first job is where most redundancy and quality drift lives.

- **Q2. Value assessment** (answered in `research/research.md` §Q2)
  - Three sampled patterns: (a) useful but bloated, (b) redundant and noisier than canonical summary, (c) sometimes the only narrative left.
  - Phase 005 documents 562 findings across 16 defect classes.
  - **Assessment**: some memories are useful for exact resume recovery; the average narrative memory is not strong enough to justify the current default-save architecture. Saved content is more useful as a retrieval hint than as a canonical document.

- **Q3. Redundancy with spec kit docs** (answered in `research/research.md` §Q3 + `findings/redundancy-matrix.md`)
  - High-overlap sections: CONTINUE SESSION, PROJECT STATE SNAPSHOT, IMPLEMENTATION GUIDE, OVERVIEW, DETAILED CHANGES, DECISIONS, CANONICAL SOURCES, RECOVERY HINTS.
  - Low-overlap (unique) sections: MEMORY METADATA, PREFLIGHT BASELINE, POSTFLIGHT LEARNING DELTA — but these are telemetry, not canonical docs.
  - **Assessment**: narrative overlap is high; unique content is mostly metadata.

- **Q4. Retrieval value** (answered in `research/research.md` §Q4 + `findings/retrieval-comparison.md`)
  - Local handler execution failed on 30-second embedding warmup guard — the operational path is fragile.
  - 10-query SQLite FTS comparison: memory wins on session-shaped or historical phrasing (3/10), spec docs win when packet docs exist and are current (3/10), tie or mixed (4/10).
  - **Assessment**: retrieval value is real but narrow; the operational path is too brittle for a system whose main promise is reliable continuity.

- **Q5. Alternative architectures** (answered in `research/research.md` §Q5 + `findings/alternatives-comparison.md`)
  - Six options evaluated: A (status quo), B (minimal memory), C (wiki-style), D (handover-only), E (findings-only), F (full deprecation).
  - **Ranking**: 1st C, 2nd B, 3rd F, 4th D, 5th E, 6th A.

- **Q6. Existing corpus fate** (answered in `research/research.md` §Q6)
  - Three corpus numbers in play: 149 (phase 004 remediation), 123 (current .md files), 180 (indexed rows).
  - **Recommendation**: do not bulk-convert; freeze old memories as read-only history; promote only high-value unique material; keep the rest archived and searchable during transition.

- **Q7. Integration impact** (answered in `research/research.md` §Q7 + `findings/integration-impact.md`)
  - Primary impact surfaces: `/spec_kit:resume`, `/memory:search`, `/memory:save`, workflow commands, agent instructions, MCP contracts/docs/tests.
  - **Assessment**: the migration is doable but not a one-file change. Largest cost is command/agent contract cleanup, not archive handling.

- **Q8. Recommendation** (answered in `research/research.md` §Q8 + `recommendation.md`)
  - Adopt **Option C** as the target architecture with **Option B** as the retention policy.
  - Canonical narrative → spec docs. Memory saves → thin continuity layer only.
  - Phased rollout: phase 018 redefines canonical authority, phase 019 replaces default save behavior, phase 020 decides on final permanence.

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

**Generation 2 rerun updates** (2026-04-11 — replaces generation-1 retrofit content):

- **Sequential in-session iteration**: claude-opus-4-6 acting as both orchestrator and worker in one session produced consistent voice and cross-iteration references. Each iteration cited the one before it. No context-window degradation because each iteration is small (100-200 lines) and reuses prior findings via explicit back-reference.
- **Grounded file:line citations**: iterations 1 and 2 anchored all claims to specific memory-save.ts line ranges (L1-200 header, L1480-1640 atomic save, L1521 atomicSaveMemory entry, L1569 withSpecFolderLock). Iteration 2's 16-stage classification (8 as-is + 6 adapt + 2 rewrite) was directly citable from the module structure.
- **Fresh 20-file sample in iteration 3**: corpus inventory (155 files, distribution by tree, size distribution) plus a diverse sample across ages/trees/tiers produced the 35/40/25 value split. This gave iterations 6 and 7 the data they needed to rule out M3 (bulk rewrite) and Option A (status quo + generator fixes).
- **Audit iteration (10)**: caught zero contradictions across iterations 1-9 and verified 9/9 citations. Found one minor inference gap (iteration 7 FSRS field claim) that was acknowledged and accepted because the inference came from iteration 1's direct reading.
- **Alternative stop path**: iteration 10 determined the `newInfoRatio` plateau (0.30 vs 0.05 threshold) was a design feature of having an audit iteration, not a signal of research incompleteness. Stop decision went through the `all_questions_answered` alternative path per sk-deep-research §5.
- **Validation of generation 1**: generation 2's independent 10-iteration analysis reached the same Option C recommendation as generation 1's single-shot. This cross-validates the content while correcting the process gap.

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- **Live `memory_search` runtime (iterations 5)**: same embedding warmup timeout as generation 1. Pivoted to prediction based on indexed content shape. Results marked `[PREDICTED]`. This is a phase 018 prerequisite — the embedding runtime must be healthy before any live retrieval measurements are trustworthy.
- **The `newInfoRatio` metric plateaus at 0.30** (iteration 10) because iterations 9-10 are synthesis/audit by design. The standard 0.05 convergence threshold doesn't fit audit iterations. The protocol's alternative stop path (`all_questions_answered`) was used instead, which is explicitly permitted.
- **Generation 1 single-shot delegation** (historical failure, preserved here): bypassed the entire sk-deep-research loop driver. No state files, no iteration records, no reducer updates. Triggered the retrofit and the generation-2 rerun. **Lesson**: phase 018's two research prompts now explicitly mandate `/spec_kit:deep-research:auto` and reject single-shot `codex exec` — the retrofit discipline is enforced at the prompt level to prevent recurrence.

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Single-shot `codex exec` delegation for deep-research work — AVOID (retrofit lesson)
- **What was tried**: `cat research-prompt.md | codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" --full-auto -`
- **Why avoid**: Bypasses the entire sk-deep-research loop driver. Produces a usable `research.md` but no state files, no iteration history, no convergence tracking, no resumability, no auditability. Folder cannot be forked, restarted, or reopened via `completed-continue`.
- **Do NOT retry**: Use `/spec_kit:deep-research:auto` or `:confirm` for all future deep-research work. Phase 018 prompts at `../006-canonical-continuity-refactor/prompts/` now mandate this.

### Live `memory_search` against degraded embedding runtime — BLOCKED
- **What was tried**: direct MCP handler calls for 10 resume-style queries.
- **Why blocked**: 30-second embedding warmup timeout kept firing.
- **Workaround that worked**: direct SQLite FTS corpus queries as a fallback.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- **Option A (status quo + fix generator)**: ruled out — highest complexity for weakest long-term architecture.
- **Option E (findings-only)**: ruled out as primary — too narrow; works for research but weak for implementation continuity.
- **Option D (handover-only)**: ruled out as primary — too narrow; good for session end, weak for research/discovery and machine metadata.
- **Option F (full deprecation)**: ruled out as FIRST step — viable LATER after resume and handover replacements are hardened. Unsafe while some root packets rely on memory as the only surviving summary.
- **Bulk rewrite of all 150 memories into spec doc anchors**: ruled out — migration cost exceeds phase budget.

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

**Retrofit status**: research is complete. No next focus within this research session.

**Downstream work**:
1. Phase 018 — Canonical Continuity Refactor. See `../006-canonical-continuity-refactor/prompts/` for the two follow-up research prompts (20-iter implementation design + 5-iter impact analysis). Those prompts MUST be run via `/spec_kit:deep-research:auto` (the lesson from this retrofit is enforced in their README).
2. Phase 019 — Runtime migration of `memory_save` default behavior.
3. Phase 020 — Decide on thin-layer permanence vs full deprecation.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
