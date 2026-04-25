# Phase 017 Rerun Seed — Findings the phase 018 research can reference

This file captures the 10 key findings from the 10-iteration rerun of phase 017 (`../z_archive/017-memory-refactor-or-deprecation/research/iterations/iteration-001.md` through `iteration-010.md`). Phase 018 iterations should read this seed first and build on it, not re-derive it.

**Provenance**: written 2026-04-11T13:30:00Z by claude-opus-4-6 after the phase 017 generation-2 10-iteration rerun produced 0 contradictions, 9/9 cited, composite score 0.92.

---

## F1 — Two jobs in one pipeline

`memory_save` does two jobs simultaneously:
- **Job A — narrative session journal** (where all the redundancy lives; 85% of memory bytes)
- **Job B — retrieval substrate** (machine metadata, triggers, causal graph — the useful part)

**Implication for phase 018**: Option C splits them. Keep Job B, retarget Job A onto spec docs.

## F2 — Only 2 of 16 pipeline stages need full rewrite

Save pipeline classification (from phase 017 iteration 2):
- **8 stages as-is** (50%): governance, spec-doc health, embedding, PE arbitration, chunking, post-insert metadata, reconsolidation, response build
- **6 stages need adaptation** (~37%): preflight parser, sufficiency gating, dedup, record creation, quality gate, post-insert enrichment
- **2 stages need rewrite** (~12%): template contract (stage 3) and atomic save (stage 10)

**Implication for phase 018 iteration 2**: narrow the focus to the 2 rewrite stages. Don't redesign what already works.

## F3 — Corpus value distribution is 35/40/25

Of 155 memory files:
- **35% clearly valuable** — deep research + gap-filling root-packet narratives
- **40% medium value** — useful but redundant with packet docs
- **25% clearly wasteful** — all in z_archive with placeholder text

**Implication for phase 018**: don't bulk-convert. The 35% valuable files need targeted preservation; the 25% waste can be deprecated wholesale.

## F4 — 45% HIGH overlap with spec doc anchors

| Memory section | Spec doc anchor | Overlap |
|---|---|---:|
| CONTINUE SESSION | `handover.md` + `tasks.md::phase-N` | 75% |
| PROJECT STATE SNAPSHOT | `tasks.md` + `checklist.md::summary` | 85% |
| IMPLEMENTATION GUIDE / OVERVIEW | `implementation-summary.md::what-built` | 90% |
| DETAILED CHANGES | `implementation-summary.md::how-delivered` | 70% |
| DECISIONS | `decision-record.md::adr-NNN` or `implementation-summary.md::decisions` | 95% |
| CANONICAL SOURCES | (tautologically points at spec docs) | 100% |
| CONVERSATION | (none — drop) | 0% |
| RECOVERY HINTS | (none — template boilerplate, drop) | 0% |
| MEMORY METADATA | (none — unique, keep in thin continuity layer) | 0% |
| PREFLIGHT BASELINE | (none — unique, optional continuity field) | 0% |
| POSTFLIGHT LEARNING DELTA | (none — unique, optional continuity field) | 0% |

**Implication for phase 018**: routing rules are mostly automatic. Phase 018 research iteration 2 (content-to-anchor routing) can start from this table and refine it.

## F5 — Retrieval wins 2/10 queries; memory value is narrow

From phase 017 iteration 5, 10 realistic resume-style queries:
- **Memory wins clearly**: archived features (1) + deep research sessions (1) = 2/10
- **Memory contributes partially**: resume scenarios (1) + gap-filling (1) = 2/10
- **Spec docs win clearly**: code/doc authority queries + current-packet state queries = 6/10

**Implication for phase 018 iteration 13 (resume journey)**: the resume path should check `handover.md` first, spec docs second, thin continuity third, archived memory fourth. The 2/10 memory wins are the justification for keeping any retrieval layer at all.

## F6 — Option C scores 24/30; B is the fallback

From phase 017 iteration 6:
- **C (wiki-style + thin continuity)**: 24/30 — RECOMMENDED
- **B (minimal memory)**: 21/30 — fallback if C feels too ambitious
- **D/E (handover-only / findings-only)**: 18/30 each — partial answers
- **A (status quo + fix generator)**: 15/30 — sunk cost
- **F (full deprecation)**: 13/30 — violates preserve-13-features constraint

**Implication for phase 018**: Option C is fixed. No re-litigation. The research iterates on HOW to implement C.

## F7 — M4 bounded archive is the migration strategy (FIRMER)

From phase 017 iteration 7:
- **M4: bounded archive with FSRS decay** — 1 week of work, 180-day observation window
- Mechanism: set `is_archived=1` on all 155 files, deprioritize archived in search (weight × 0.3), let existing FSRS decay retire unused over 180 days
- Operators get archived memories only when no fresh spec-doc result matches

**Implication for phase 018**: migration is not an open question. Phase 018 iteration 16 (migration of 150 memories) should flesh out M4 details, not re-evaluate alternatives.

## F8 — ~147 files, ~52 engineer-days, breakdown clear

From phase 017 iteration 8:
- Commands: ~85 M-equivalent (25 files)
- Agents: ~25 M-eq (11 files)
- Skills: ~40 M-eq (11 files)
- Scripts: ~35 M-eq (11 files)
- MCP Handlers: ~150 M-eq (45 files) — biggest surface
- Templates: ~15 M-eq (20 files)
- Docs: ~15 M-eq (6 files)
- Tests: ~50 M-eq (15 files) — 12% of total, budget explicitly
- Configs: ~3 M-eq (3 files)

**Implication for phase 018 iteration 19 (testing strategy)**: tests are 12% of total work. Don't tack on at the end.

## F9 — Dependency order is schema → handlers → commands → docs

From phase 017 iteration 9:
1. Schema migrations first (blocks everything)
2. `atomicSaveMemory` → `atomicIndexMemory` split (blocks new save path)
3. Template contract + memory parser variants (blocks validation)
4. `memory_context` + `memory_search` retargeting (blocks session_resume)
5. `session_resume` + `session_bootstrap` (blocks `/spec_kit:resume`, `@context`)
6. Commands, agents, workflows (parallelizable after 5)
7. Tests (can start after 2)
8. Docs (last)

**Implication for phase 018 iteration 20 (rollout plan)**: encode this as the critical path. Phase 019 cannot ship anything until schema + save pipeline split are done.

## F10 — One blocker found: ~5 root packets with no canonical docs

From phase 017 iterations 3, 5, 7:
- ~5 root packets (e.g., `026/z_archive/016-release-alignment/`) currently have NO canonical `implementation-summary.md` at the root level
- Their memory files are the ONLY narrative artifact
- If phase 018 archives these memory files without backfilling, the narrative is lost

**Implication for phase 018**: this is a hard prerequisite. Before `is_archived=1` is set on day 0 of phase 018, the root packet audit + backfill must complete.

---

## Six refinements phase 018 should apply

1. **Add root-packet backfill as a prerequisite** — audit memory corpus, identify files whose packet has no root canonical doc, backfill before archiving
2. **Add schema migration + archive flip as a phase 018 sidecar** — ~1 week of code work alongside the research prompts, not a separate phase
3. **Break down effort estimates by surface** — budget tests explicitly (12% of total), don't tack on
4. **Narrow iteration 2 focus** — only 2 of 16 save pipeline stages need rewrite; spend research effort on those, not the as-is 8
5. **Lock in M4 migration strategy** — iteration 16 refines M4 mechanism; does not re-evaluate alternatives
6. **Call out embedding runtime health as a phase 018 prerequisite** — live retrieval tests need a healthy embedding cache (repeatedly failed in phase 017 generation 1 and 2)

---

## Hardened constraints for phase 018 research

- **Must run via `/spec_kit:deep-research:auto`** — single-shot `codex exec` is rejected (retrofit lesson from phase 017)
- **Preserve all 13 advanced memory features** — retarget, never delete
- **Option C is fixed** — don't re-litigate against A/B/D/E/F
- **Migration strategy M4 is fixed** — don't re-evaluate M1/M2/M3
- **Schema migration is the gate** — nothing ships until `UNIQUE` constraint + `document_type` handling land

## How to use this seed

Phase 018 iterations should:
1. Read this seed file in iteration 1 as baseline
2. Reference it in per-iteration findings (e.g., "per F3, 35% of the corpus is..." instead of re-deriving)
3. Focus research effort on the OPEN questions, not the settled ones
4. Cite phase 017 iteration files directly (`../z_archive/017-memory-refactor-or-deprecation/research/iterations/iteration-N.md`)

The 8 key questions in the research prompts are the OPEN questions. This seed answers the "what do we already know" question.
