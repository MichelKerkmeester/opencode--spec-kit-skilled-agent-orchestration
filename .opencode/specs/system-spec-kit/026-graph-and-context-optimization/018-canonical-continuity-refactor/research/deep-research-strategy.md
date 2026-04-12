---
title: Deep Research Strategy — Phase 018 Wiki-Style Spec Kit Updates Implementation Design
generation: 1
started: 2026-04-11T13:30:00Z
orchestrator: claude-opus-4-6 (Claude Code session)
worker: claude-opus-4-6 (same session — in-session orchestrator+worker model, like phase 017 generation 2)
max_iterations: 20
convergence_threshold: 0.05
---

# Deep Research Strategy — Phase 018 Implementation Design

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Design HOW to implement Option C (Wiki-Style Spec Kit Updates with thin continuity layer) with UX, resume speed, and developer ergonomics as the primary optimization targets. Output is a design space, a recommended design, and findings that phase 018 implementation plans can consume — but no code.

### Prior work
- Phase 017 generation 1: single-shot codex delegation, recommendation = Option C, retrofitted with skeletal state files 2026-04-11T12:15:00Z
- Phase 017 generation 2: 10-iteration rerun, composite score 0.92, validated Option C recommendation, produced the seed at `../scratch/phase-017-rerun-seed.md`

### Note on worker substitution
User requested `gpt-5.4 high fast` as the worker. cli-codex demonstrated instability in this session (multiple exit 143/144/2 failures). Substituted to in-session claude-opus-4-6 acting as both orchestrator and worker, following the same pattern as phase 017 generation 2. This preserves the sk-deep-research protocol compliance (init → iterate → synthesize → save with real state files) while avoiding the cli-codex failure mode.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:topic -->
## 2. TOPIC

Investigate HOW to refactor the Spec Kit memory system into a wiki-style model where canonical narrative lives in spec-kit docs (`implementation-summary`, `decision-record`, `handover`, `research`, `tasks`, `checklist`) written via anchor-targeted append/merge, backed by a thin continuity layer, while preserving and retargeting every advanced memory feature. The investigation must prioritize user experience, resume speed, and developer ergonomics. Output is an implementation-ready design space — not an implementation.

<!-- /ANCHOR:topic -->

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (9)

- [ ] Q1. Routing authority — How does arbitrary session content get deterministically routed to the right anchor in the right spec doc?
- [ ] Q2. Anchor-scoped write semantics — What are the exact merge, append, and conflict-resolution rules for writing into an existing anchored section?
- [ ] Q3. Thin continuity layer shape — What is the minimum viable schema for the continuity record?
- [ ] Q4. Feature retargeting per advanced capability — For each of the 13 features, what is the specific retarget mechanism?
- [ ] Q5. Resume journey end-to-end — What does `/spec_kit:resume` look like under the new model?
- [ ] Q6. `/memory:save` user flow — What does invoking save feel like?
- [ ] Q7. Validation contract — What new validator rules must exist?
- [ ] Q8. Migration of the existing corpus — What happens to the 155 existing memory files? (Partially answered in phase 017 — M4 is fixed; this iteration refines M4 mechanics.)
- [ ] Q9. Trust and safety — How does the system prevent destructive writes, cross-packet bleed, shared-memory leakage, and generator regressions?

<!-- /ANCHOR:key-questions -->

---

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Do NOT design phase 005 generator-quality fixes
- Do NOT write or edit any code, templates, memory files, generators, handlers, or MCP surfaces — read-only research
- Do NOT relitigate Option C vs A/B/F — fixed in phase 017
- Do NOT re-evaluate migration options M1/M2/M3 — M4 is fixed
- Do NOT re-derive findings that `../scratch/phase-017-rerun-seed.md` already captured — cite them instead
- Do NOT propose schema changes beyond what's strictly necessary
- Do NOT bulk-convert the 155 existing memory files — M4 archives them in place
- Do NOT design new MCP tools — retarget existing ones

<!-- /ANCHOR:non-goals -->

---

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 9 key questions answered with cited evidence in `research/research.md`
- Convergence below 0.05 for 2 consecutive iterations OR
- 20 iterations reached OR
- All 13 advanced features have retarget entries in `findings/feature-retargeting-map.md` OR
- End-to-end user journey documented and defensible OR
- Alternative stop path: `all_questions_answered_plus_audit_complete`

<!-- /ANCHOR:stop-conditions -->

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

Will be populated as iterations answer them. After 20 iterations, this section should contain all 9 Q→A mappings with evidence citations.

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

(Populated by reducer after each iteration.)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

(Populated by reducer after each iteration.)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

From phase 017 and pre-seed:
- **Single-shot `codex exec` delegation** — produces output but bypasses the loop; retrofit required (phase 017 generation 1 lesson)
- **cli-codex in this session** — repeated exit code 143/144/2 failures; substituted to in-session orchestration for reliability
- **Bulk rewrite of 150 memories** — ruled out in phase 017 iteration 7 (cost/risk imbalance)

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

From phase 017:
- Option A (status quo + fix generator) — scored 15/30, rejected
- Option D (handover-only) — 18/30, too narrow
- Option E (findings-only) — 18/30, too narrow
- Option F (full deprecation) — 13/30, violates preserve-features constraint
- Migration options M1 (shadow), M2 (lazy backfill), M3 (bulk rewrite) — ruled out in favor of M4 bounded archive

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

**Iteration 1**: Read `../scratch/phase-017-rerun-seed.md` + phase 017 iteration files + refresh mental model of `memory-save.ts`, `memory-context.ts`, `generate-context.ts`, `nested-changelog.ts` (the read-transform-write pattern model). Build an updated architecture diagram that reflects the post-Option-C target state, not the current state.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
