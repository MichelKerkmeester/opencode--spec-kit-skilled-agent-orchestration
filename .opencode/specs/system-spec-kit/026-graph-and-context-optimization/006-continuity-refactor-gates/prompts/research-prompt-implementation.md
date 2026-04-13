# Research Prompt — Implementation Design (20 iterations)

> **Subject**: HOW to implement Option C (Wiki-Style Spec Kit Updates + thin continuity layer) for the Spec Kit memory refactor, with UX and usefulness at the forefront.
>
> **Target runtime**: `cli-codex gpt-5.4 high fast` — either as a single-shot delegation piped via stdin, or as input to `/spec_kit:deep-research:auto`. This prompt follows the `sk-deep-research v1.5.0` strategy template format.
>
> **⚠ Critical constraint (unmissable, stated throughout)**: The new architecture MUST preserve every advanced memory database search feature listed in Section 6. Features are retargeted onto the new substrate (spec doc anchors + thin continuity layer), never deleted. Any iteration proposal that removes or degrades a feature without a retarget plan is invalid and must be revised.
>
> **Spec folder** (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/`

---

## How to run this prompt

> **⚠ MANDATORY**: This prompt **MUST** be driven by `/spec_kit:deep-research:auto` (or `:confirm`). It is **not** designed to run as a single-shot Codex brief, and a single-shot run would bypass the entire sk-deep-research loop driver — producing an incomplete, unauditable research packet.
>
> The sk-deep-research loop is what creates the required state files:
> - `research/deep-research-config.json` (loop config)
> - `research/deep-research-state.jsonl` (append-only event stream, per-iteration records, convergence events)
> - `research/deep-research-strategy.md` (key questions, answered questions, what worked/failed — reducer-owned)
> - `research/findings-registry.json` (open vs resolved questions, key findings)
> - `research/deep-research-dashboard.md` (lifecycle + convergence dashboard)
> - `research/iterations/iteration-NNN.md` (per-iteration findings, write-once)
>
> A single-shot Codex delegation CANNOT produce these files. It also skips the quality guard checks, the reducer's machine-owned state updates, the convergence tracking, and the proper synthesis phase. **Do not try to shortcut this with `codex exec` stdin piping.** Phase 017 was produced that way and is missing every state file except `research.md`; do not repeat that pattern here.

**Invocation — autonomous mode (recommended):**
```bash
/spec_kit:deep-research:auto "Wiki-Style Spec Kit Updates memory refactor — HOW to implement with UX and usefulness at the forefront. Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-implementation.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates --max-iterations 20 --convergence 0.05
```

**Invocation — confirm mode (pause at each iteration for approval):**
```bash
/spec_kit:deep-research:confirm "Wiki-Style Spec Kit Updates memory refactor — HOW to implement with UX and usefulness at the forefront. Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-implementation.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates --max-iterations 20 --convergence 0.05
```

The loop driver reads this prompt file as the seed for the strategy template, then dispatches `@deep-research` once per iteration with fresh context. Each iteration writes `iterations/iteration-NNN.md`, the reducer updates `deep-research-strategy.md` and `findings-registry.json`, and the workflow accumulates findings into `research/research.md` via progressive synthesis.

---

## 0. PRIOR SEED — READ FIRST

Before iterating, read `../scratch/phase-017-rerun-seed.md` at the spec folder root. It carries 10 key findings from the phase 017 10-iteration rerun that phase 018 should build on, not re-derive. Specifically:

- Option C is fixed (iteration 6 scored 24/30)
- M4 migration strategy is fixed (iteration 7)
- Only 2 of 16 save pipeline stages need rewrite (iteration 2)
- 45% of memory content has HIGH overlap with spec doc anchors (iteration 4)
- 2/10 queries are memory-wins on retrieval (iteration 5)
- ~5 root packets without canonical docs are a prerequisite blocker (iteration 5 + 7)
- Integration impact is ~147 files, ~52 engineer-days (iteration 8)
- Schema → handlers → commands → docs dependency order (iteration 9)

**Iteration 1 of phase 018 MUST read this seed first.** Cite phase 017 iterations directly instead of re-deriving their findings.

---

## 1. TOPIC

Investigate HOW to refactor the Spec Kit memory system into a wiki-style model where canonical narrative lives in spec-kit docs (`implementation-summary.md`, `decision-record.md`, `handover.md`, `research/research.md`, `tasks.md`, `checklist.md`) written via anchor-targeted append/merge, backed by a thin continuity layer, while **preserving and retargeting every advanced memory feature** (trigger matching, intent routing, quality gates, causal graph, FSRS decay, constitutional memory, shared memory, embedding search, 4-stage RRF pipeline). The investigation must prioritize user experience, resume speed, and developer ergonomics over raw engineering minimalism, and must produce an implementation-ready design space — **not an implementation**.

Phase 017 already decided Option C is the target architecture. This research is about HOW to make it great, not WHETHER to do it.

---

## 2. KEY QUESTIONS

These are the 9 strategic questions the 20 iterations collectively answer. Every iteration must map back to at least one question. Synthesis checks coverage.

- [ ] **Q1. Routing authority** — How does arbitrary session content get deterministically routed to the right anchor in the right spec doc without human curation, and what is the fallback when no anchor fits?
- [ ] **Q2. Anchor-scoped write semantics** — What are the exact merge, append, and conflict-resolution rules for writing into an existing anchored section without corrupting prior content, frontmatter, or anchor integrity?
- [ ] **Q3. Thin continuity layer shape** — What is the minimum viable schema for the continuity record (metadata, pointers, triggers, causal hints) that preserves resume quality without duplicating spec-doc text?
- [ ] **Q4. Feature retargeting per advanced capability** — For each of the 13 advanced memory features, what is the specific retarget mechanism, the code surface that changes, and the behavioral delta vs today?
- [ ] **Q5. Resume journey end-to-end** — What does `/spec_kit:resume` look like under the new model, how many hops does it take, and is it measurably faster and more accurate than the current path?
- [ ] **Q6. `/memory:save` user flow** — What does invoking save feel like: what does the user see, what gets written where, what gets confirmed, and what failure modes are surfaced?
- [ ] **Q7. Validation contract** — What new validator rules (beyond `ANCHORS_VALID`) must exist so a spec doc can serve as a memory unit, and how do they degrade gracefully for pre-existing docs?
- [ ] **Q8. Migration of the existing corpus** — What happens to the ~150 existing memory files during rollout (read-only shadow, lazy backfill, bounded archive), and how does search stay coherent across both worlds?
- [ ] **Q9. Trust and safety** — How does the system prevent destructive writes, cross-packet bleed, shared-memory leakage, and generator regressions when every save now edits human-authored documents?

---

## 3. 20 ITERATION TOPICS

Each iteration is a focused sub-investigation. All iterations are read-only. Group them in 4 bands. The research loop does not have to execute iterations in strict numerical order if evidence demands reordering, but every topic must be covered before synthesis.

### Band A — Foundations (iterations 1–5)

**Iteration 1: Mental model calibration and architecture baseline.** Read `memory-save.ts`, `memory-search.ts`, `memory-context.ts`, `generate-context.ts`, and `nested-changelog.ts` end-to-end. Read three filled spec-doc samples that have all 6 `implementation-summary.md` anchors populated. Produce a single annotated diagram showing current write path, current read path, and the 6 anchor surfaces per doc. Establish vocabulary used by all later iterations. **No design proposals yet** — this iteration only builds the shared mental model.

**Iteration 2: Content-to-anchor routing rules.** Enumerate every content type the memory system saves today (decisions, implementation notes, research findings, handover breadcrumbs, blockers, trigger phrases, causal links, metadata, session summaries, verification evidence, known limitations). For each, specify: canonical anchor, secondary fallback anchor, "refuse to route" signal. Deliver a routing matrix with confidence tiers. Specify the auto-classifier contract: heuristic rules vs embedding similarity vs LLM prompt. Maps to Q1.

**Iteration 3: Anchor-scoped merge semantics.** Define the append, insert, update, and dedupe operations against an anchored section. Cover: whitespace preservation, list-vs-table-vs-narrative section shapes, idempotency (saving the same content twice must be a no-op), ordering guarantees, and how `<!-- ANCHOR:x -->` / `<!-- /ANCHOR:x -->` integrity is preserved under concurrent writes. Specify the transactional envelope (file lock, atomic rename, rollback on validator failure). Maps to Q2.

**Iteration 4: Frontmatter and metadata merge policy.** The current memory model owns frontmatter. Spec docs already have their own frontmatter (title, description, `trigger_phrases`, `importance_tier`, `contextType`). Design how memory metadata (tier, FSRS state, causal edges, provenance, fingerprint) attaches to a spec doc without breaking doc identity. Compare 3 options: sidecar JSON file, embedded YAML under a reserved key inside the spec-doc frontmatter, separate continuity record with back-pointer. Pick one, justify. Maps to Q2, Q3.

**Iteration 5: Thin continuity layer — schema and storage.** Design the minimum record that must exist for fast resume and features spec docs cannot express: packet pointer, recent action, next safe action, blockers, fingerprint, trigger phrases, causal edges, FSRS state, embedding vector reference. Decide whether it lives as a SQLite row in the existing `memory_index` table, a tiny JSON file per packet, or a virtual row derived from anchors. Justify based on query patterns in `memory_context` and `session_resume`. Maps to Q3.

### Band B — Retargeting Advanced Features (iterations 6–12)

Each iteration in Band B takes one advanced feature and designs its retarget plan. **Preserving the feature is mandatory.** If you cannot design a retarget, mark it as BLOCKED in `findings/feature-retargeting-map.md` with precise reasons.

**Iteration 6: Trigger phrase fast matching retarget.** Today trigger phrases live in memory frontmatter and are indexed via `idx_trigger_cache_source` in SQLite. Design how a spec doc's frontmatter `trigger_phrases` field (already present) becomes the primary source, with a fallback for continuity records. Specify cache invalidation on doc edits, collision handling when two docs claim the same phrase, and how `memory_match_triggers` changes its source table. Maps to Q4.

**Iteration 7: Intent routing and `memory_context` modes.** `memory_context` supports `auto`/`quick`/`deep`/`focused`/`resume` modes and 7 intent types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision). Map each mode to the new substrate: which docs it queries, which anchors it privileges, what shape of result it returns. Pay special attention to `resume` mode — it should hit `handover.md` + continuity record first and never materialize a full memory doc. Maps to Q4, Q5.

**Iteration 8: Session dedup and working memory retarget.** Fingerprint-based session dedup saves ~50% tokens today. Design how working memory fingerprints compute over anchor-scoped writes (per-anchor hashes, per-doc hash, or per-session rollup). Define when the "already saved" signal fires and what user feedback looks like when it does. Maps to Q4, Q6.

**Iteration 9: Quality gates and contamination gate retarget.** Four gates currently validate memory doc body: structure, sufficiency, quality loop, contamination. Redesign them for spec-doc writes: structure gate becomes anchor-presence + merge-legality, sufficiency gate operates per-anchor, quality loop iterates on the section being written (not the whole doc), contamination gate runs against the authored doc plus adjacent anchors. Define per-gate pass/fail criteria and blocking behavior. Maps to Q4, Q7, Q9.

**Iteration 10: Causal graph retarget with 6 relation types and 2-hop BFS.** Causal edges currently point between `memory_id` endpoints (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`). Redesign edges to point to `(spec_folder, doc, anchor)` tuples. Verify all 6 relation semantics still hold when endpoints are sections of shared documents. Specify BFS traversal performance at 2 hops and decide whether edges live in the continuity layer, a separate graph table, or inline comments in docs. Maps to Q4.

**Iteration 11: FSRS cognitive decay retarget and memory tiers.** FSRS decay animates the 5-state lifecycle (HOT → WARM → COLD → DORMANT → ARCHIVED) per memory. Decide the unit of decay in the new model: per spec doc, per anchor section, per continuity record, or per causal edge. Do the same for tiers (constitutional, critical, important, normal, temporary, deprecated). Answer explicitly: can a single `implementation-summary.md` have mixed-tier sections, and how is that surfaced in search? Maps to Q4.

**Iteration 12: Constitutional memory and shared memory governance retarget.** Constitutional rules always surface at the top of search results. Shared memory governance uses deny-by-default with provenance tracking (tenant_id, user_id, agent_id, session_id, shared_space_id). Redesign both over the new substrate. Specifically: does constitutional content live in a dedicated file (`.opencode/constitutional/*.md`) with anchors, or as a flag on a continuity record? How does shared memory propagate to spec docs that may already be in a shared repo? Define the provenance field shape and where it persists. Maps to Q4, Q9.

### Band C — UX and Developer Ergonomics (iterations 13–17)

**Iteration 13: Resume user journey — end-to-end walkthrough.** Write the complete UX narrative for `/spec_kit:resume` in the new world. Measure in: steps the user performs, tokens read from disk, tokens returned to the user, latency, cognitive load. Compare side-by-side with the current resume path. Identify the "first screen" the user sees after invoking resume and defend why it is the right default. Cover failure modes: stale pointer, missing handover, corrupted anchor. Maps to Q5.

**Iteration 14: `/memory:save` flow under the new model.** The user invokes save mid-session or at handover. What happens visibly: which docs get opened, which anchors get diffed, what the confirmation screen looks like, what the "saved" summary says, what gets echoed back. Define interactive vs auto modes. Define the "routing transparency" UI: does the user see where things went? Can they override the router's choice? Maps to Q6.

**Iteration 15: Conflict handling and arbitration.** Real scenarios to design for: two saves target the same anchor in the same packet; a user hand-edits a spec doc while a save is mid-flight; an agent and a human both want the `decisions` anchor simultaneously. Design the file lock, the merge rules, the arbitration hierarchy (**human edits win by default**), and the user-visible diff on conflict. Also cover cross-packet conflicts (same decision promoted from a child phase to a parent packet). Maps to Q2, Q9.

**Iteration 16: Migration of the 150 existing memories.** Evaluate four options:
1. Read-only shadow corpus (keep old memories searchable but write no new ones to that path)
2. Lazy backfill on read (convert old memories to spec-doc sections only when search hits them)
3. One-shot bulk rewrite (batch convert all 150 upfront)
4. Bounded archive with time-bound fallback (freeze old memories, preserve search for 90 days, then retire)

For each option: cost, risk, search coherence impact, rollback. Recommend one explicitly with evidence. Describe how search results blend old memories and new spec-doc results without ranking collapse. Maps to Q8.

**Iteration 17: Failure modes, validation UX, and error surface.** Enumerate every failure class and specify user-visible message, recovery path, whether state persists, and how the system self-heals:
- Anchor is missing in the target spec doc
- Doc is unparseable (malformed markdown or broken frontmatter)
- Validator fails after write
- Save partially completes (some anchors updated, others not)
- Continuity record desyncs from the doc
- Fingerprint cache is stale
- Template changes mid-cycle
- Save silently lost (the hardest class to detect)

Explicitly design for the "save silently lost" class — what monitoring/telemetry catches it? Maps to Q7, Q9.

### Band D — Synthesis and Integration (iterations 18–20)

**Iteration 18: End-to-end user journey composition.** Compose a single narrative that walks through the full lifecycle: start a new packet → work in a session → save a decision → save implementation notes → crash → resume → search for historical context from a prior packet → promote a causal chain → close out with a handover. Measure reads and writes at each step. Identify weak links in the journey and propose concrete refinements. This iteration is the first end-to-end sanity check that all prior iterations compose into a coherent system. Maps to all Qs.

**Iteration 19: Testing strategy and evidence plan.** Enumerate the test classes needed:
- Unit tests — routing classifier, merge operations, validator rules
- Integration tests — end-to-end save + search + resume
- Regression tests — all 13 feature retargets against current behavior
- Performance tests — resume latency target, trigger match latency target
- UX tests — manual playbook for `/memory:save` and `/spec_kit:resume`

Specify which tests are blocking vs informational, and which must be automated before phase 018 can merge. Cite existing test patterns in `mcp_server/test/` and `/scripts/tests/` where reusable. Maps to Q7, Q9.

**Iteration 20: Rollout plan, risk register, and go/no-go criteria.** Design a phased rollout with validation checkpoints:
1. Feature-flagged dual-write (write to both old memory files and new spec doc anchors for N days)
2. Shadow-read comparison (query both substrates, compare results, log divergence)
3. Incremental feature retarget (move features one at a time off the old path)
4. Full cutover (disable old memory writes)
5. Legacy archive (retire old memory corpus)

Produce: top 10 risks with mitigations, decision gates between phases, explicit go/no-go criteria for each gate. Close with a one-page executive summary that becomes `implementation-design.md`. Maps to Q8, Q9, and all prior.

---

## 4. NON-GOALS

- **Do NOT design generator-quality fixes from phase 005.** That is a separate track. If you find yourself proposing fixes to n-gram trigger noise, provenance bugs, title corruption, or causal link parsing in the OLD generator, stop and redirect.
- **Do NOT write or edit any code, templates, memory files, generators, handlers, or MCP surfaces.** This is read-only research.
- **Do NOT bulk-convert or touch the existing ~150 memory files.** They are the baseline.
- **Do NOT author phase 018 implementation tasks or the implementation itself.** The output is the design space and a recommended design, not the code.
- **Do NOT relitigate Option C vs A/B/F.** Phase 017 decided. The research starts from "Option C is the target" as a given.
- **Do NOT explore alternative architectures** (minimal memory, full deprecation, pure graph). Ruled out in phase 017.
- **Do NOT design new MCP tools.** Retarget existing ones.
- **Do NOT propose schema changes beyond what is strictly necessary** to retarget features. Every schema change must be justified against the "80% retargetable" finding from phase 017 and cite the specific blocking constraint.

---

## 5. STOP CONDITIONS

Halt the research loop when **any** of these are met:

1. **All 9 key questions answered** with cited evidence in `research/research.md`.
2. **Convergence below 0.05** for 2 consecutive iterations (sk-deep-research default).
3. **20 iterations reached.**
4. **Every one of the 13 advanced memory features has a row** in `findings/feature-retargeting-map.md` with current code path (`file:line`), proposed new path, retarget mechanism, behavior delta, residual risk.
5. **End-to-end user journey documented and defensible** — a reader unfamiliar with the system can walk through save → resume → search without referencing other docs.
6. **Stuck recovery**: if no new findings for 3 consecutive iterations, widen focus to unexplored key questions or halt for user guidance.

---

## 6. KNOWN CONTEXT (seed block)

### 6.1 Decided architecture (from phase 017)

- **Option C selected** — Wiki-Style Spec Kit Updates with thin continuity layer.
- Canonical narrative routes into existing spec docs.
- Advanced features preserved, retargeted at the new substrate.
- **Phase 017 deliverables** (must be read in iteration 1):
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/z_archive/017-memory-refactor-or-deprecation/recommendation.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/phase-018-proposal.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/research/research.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/findings/alternatives-comparison.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/findings/integration-impact.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/findings/redundancy-matrix.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/findings/retrieval-comparison.md`

### 6.2 Anchor inventory (already present in templates)

- **`implementation-summary.md`**: `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` (6 anchors).
- **`decision-record.md`**: nested per-ADR anchors — `adr-NNN`, `adr-NNN-context`, `adr-NNN-decision`, `adr-NNN-alternatives`, `adr-NNN-consequences`, `adr-NNN-impl`, `adr-NNN-five-checks`.
- **`tasks.md`**: `notation`, `phase-1`, `phase-2`, `phase-3`, `completion`, `cross-refs`.
- **`checklist.md`**: `protocol`, `pre-impl`, `code-quality`, `testing`, `security`, `docs`, `file-org`, `summary`.
- **`spec.md`**: `metadata`, `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions`.
- **`plan.md`**: `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback`.
- Validator (`validate.sh`) enforces `ANCHORS_VALID` rule (opened/closed integrity).

### 6.3 13 advanced features to preserve (MUST)

1. **Trigger phrase fast matching** — cached, sub-millisecond, `idx_trigger_cache_source` index.
2. **Intent-aware retrieval** — `memory_context` modes (`auto`/`quick`/`deep`/`focused`/`resume`); 7 intent types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`).
3. **Session deduplication** — fingerprint-based working memory, ~50% token savings on follow-up queries.
4. **Multi-dimension quality scoring** — structure gate, sufficiency gate, quality loop, contamination gate.
5. **Memory reconsolidation** — assistive auto-merge at >0.96 similarity, review recommendations at 0.88-0.96, keep separate <0.88.
6. **Causal graph** — 6 relation types (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`), 2-hop BFS traversal, strength propagation, contradiction detection.
7. **Memory tiers** — `constitutional` (always-surface), `critical`, `important`, `normal`, `temporary`, `deprecated`.
8. **FSRS cognitive decay** — power-law `R(t) = (1 + FSRS_FACTOR * t/S)^-0.5`, 5-state lifecycle (HOT → WARM → COLD → DORMANT → ARCHIVED).
9. **Shared memory governance** — deny-by-default membership, provenance tracking (`tenant_id`, `user_id`, `agent_id`, `session_id`, `shared_space_id`), governance audit log.
10. **Ablation studies, dashboards, drift analysis** — R13-S3 reporting, `memory_drift_why` causal chain BFS, per-channel Recall@20 deltas.
11. **Constitutional memory** — always-surface rules injected at top of search results regardless of score.
12. **Embedding-based semantic search** — Voyage 1024-dim embeddings, sqlite-vec0 virtual table.
13. **4-stage search pipeline** — gather → score → rerank → filter, with RRF fusion across vector, BM25, FTS5, graph, trigger channels.

### 6.4 Retargeting assessment (from phase 017)

- **~80% of advanced features retarget without schema change.** Trigger matching, intent routing, session dedup, quality gates, memory tiers, shared memory, ablation, FSRS decay, causal graph, embedding search — all work against arbitrary indexed content.
- **`memory_search` already supports an `anchors` parameter** for section-level retrieval with ~90% token savings.
- **Spec docs are already indexed** via `findSpecDocuments()` in `memory-index-discovery.ts`.
- **`nested-changelog.ts` is the read-transform-write model** (regex → extract anchor section → render new content → write back).

### 6.5 NOT retargetable without schema change

- **`UNIQUE(spec_folder, file_path, anchor_id)` constraint** blocks multiple memories per file (enforced by `.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:126`).
- **`atomicSaveMemory()` file I/O path** at `memory-save.ts:1521` assumes write to disk; new `atomicIndexMemory()` needed that skips file write and commits directly via SQLite transaction.
- **Template contract validator** needs new rules for spec-doc structure (currently validates memory doc anchors).
- **Memory parser** needs a spec-doc variant (currently parses memory-specific frontmatter shape).
- **Dry-run path** doesn't work the same way for external files.

### 6.6 Key code paths (absolute)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` (~610 LOC)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (~1799 LOC; `atomicSaveMemory` at L1521)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` (~1378 LOC)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` (~1610 LOC)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` (for `findSpecDocuments()`)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts` (~787 LOC — the read-transform-write pattern model)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Templates root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/`
- Filled examples: `.opencode/skill/system-spec-kit/templates/examples/level_3/*.md`

---

## 7. DELIVERABLES

All written inside the phase 018 spec folder (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/`). Nothing outside that folder.

1. **`research/research.md`** — progressive synthesis. Opens with answers to all 9 key questions. Closes with the recommended design. Cites evidence with `file:line` throughout. Owned by the sk-deep-research workflow; refreshed each iteration.
2. **`findings/routing-rules.md`** — content-to-anchor routing specification. Matrix of content types × target anchors × fallback × classifier heuristic × confidence tier. Includes "refuse to route" signal and escalation path.
3. **`findings/feature-retargeting-map.md`** — one row per advanced feature (13+ rows minimum). Columns: feature, current code path (`file:line`), proposed new path, retarget mechanism, behavior delta, residual risk, schema change required (y/n).
4. **`findings/resume-journey.md`** — end-to-end UX walkthrough for `/spec_kit:resume` under the new model. Side-by-side comparison with current path. Measured in steps, tokens, latency. Failure modes section.
5. **`findings/save-journey.md`** — end-to-end UX walkthrough for `/memory:save` under the new model. Interactive and auto modes. Confirmation screen design. Routing transparency UI.
6. **`findings/conflict-handling.md`** — merge, lock, arbitration design. Cross-packet conflicts. Diff visualization. Human-vs-agent precedence rules.
7. **`findings/migration-strategy.md`** — what to do with the 150 existing memories. Options evaluated, one recommended, search coherence plan, rollback plan.
8. **`findings/validation-contract.md`** — new validator rules for spec docs as memory units. Per-anchor presence, merge legality, contamination, section sufficiency. Degradation path for pre-existing docs.
9. **`findings/thin-continuity-schema.md`** — schema for the continuity layer. Storage location, query patterns, back-pointers to spec docs, lifecycle.
10. **`findings/testing-strategy.md`** — test classes, blocking vs informational, automation requirements before phase 018 merges.
11. **`findings/rollout-plan.md`** — phased rollout with validation checkpoints, risk register, go/no-go gates.
12. **`implementation-design.md`** — one-page executive summary of the recommended design. Reader-friendly. Links to every finding.

---

## 8. EVIDENCE STANDARDS

- **Code claims cite `file:line`**. A claim like "memory-save writes to disk via `atomicSaveMemory`" must cite `.../memory-save.ts:1521`. Claims without citations are invalid.
- **Feature retargeting claims cite both current and proposed paths**. Current is a real `file:line`. Proposed is either an existing `file:line` that will be modified or a new module name with rationale.
- **UX claims cite a concrete scenario walkthrough**. "Resume is faster" requires: starting state, actions, observed state, measured cost (steps/tokens/latency). No abstract claims.
- **Routing claims cite at least one concrete example per content type**. "Decisions route to the `decision-record` `adr-NNN-context` anchor" requires an example decision being classified, routed, and merged.
- **Schema change claims cite the blocking constraint** and the specific test that enforces it. "We need to drop `UNIQUE(spec_folder, file_path, anchor_id)`" must cite the constraint and `safety.vitest.ts:126`.
- **Uncertainty is marked explicitly** with `[I'M UNCERTAIN: ...]`. Hidden uncertainty is a research defect.
- **Ruled-out directions require a one-sentence reason**.
- **No speculative features** — if a proposal requires a capability not yet built, flag it as "new capability" with implementation cost estimated.
- **Convergence entries log evidence source diversity** — each iteration's JSONL entry lists at least 2 source categories (code / template / prior research / manual test / user scenario).

---

## 9. ITERATION-1 SEED ACTIONS

Concrete reads/commands the loop must execute in iteration 1 before any design work:

1. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` end-to-end (~610 LOC).
2. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` end-to-end, focusing on `atomicSaveMemory` (L1521) and the write path (~1799 LOC).
3. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts` end-to-end (~787 LOC) to internalize the read-transform-write anchor-append pattern.
4. Read three filled spec-doc samples that have all 6 `implementation-summary.md` anchors populated — at minimum `templates/examples/level_3/implementation-summary.md` and two recent real packets from `.opencode/specs/` (recommend `022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/implementation-summary.md` and `023-hybrid-rag-fusion-refinement/010-search-retrieval-quality-fixes/implementation-summary.md`).
5. Read all seven phase 017 deliverables listed in Section 6.1.
6. Run `memory_search` with the `anchors` parameter against a real spec doc and capture the response shape in the iteration log.
7. Run `memory_context` in `resume` mode against a known packet and capture the response shape in the iteration log.
8. Open `.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts` around line 126 and record the exact `UNIQUE` constraint that blocks multi-memory-per-file.
9. Produce the iteration-1 mental-model diagram described in Iteration 1 and write it to `research/research.md` under a new "Architecture Baseline" section. **No design proposals yet.**

---

## 10. HARD STOPS (absolute prohibitions)

- **No file writes outside the phase 018 spec folder.** Every artifact lives in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/`.
- **No git commits, adds, tags, branches, or pushes.**
- **No edits to templates, generators, handlers, scripts, or MCP server code.**
- **No edits to existing memory files.**
- **No edits to existing spec docs** (including those referenced for reading).
- **No package installs** (`npm`, `pnpm`, `pip`, `brew`, anything).
- **No external API calls** (web search, external LLM, external HTTP). All research is against the local repo.
- **No new MCP tools proposed** — retarget existing ones only.
- **No dependency additions** to `package.json`, `Cargo.toml`, etc.
- **No shell commands that modify state** (`mkdir` outside the spec folder, `rm`, `mv`, `cp`, `chmod`, `touch`). Read-only shell only.
- **No invocation of `/memory:save` against real packets** during the research. Sandbox scenarios only, walkthroughs in-memory.
- **Option C is fixed** — no arguing about alternative architectures.

---

## 11. SESSION METADATA

| Field | Value |
|---|---|
| **Topic** | Wiki-Style Spec Kit Updates — HOW to implement, UX-first |
| **Target runtime** | `/spec_kit:deep-research:auto` or `:confirm` — driven by the sk-deep-research loop engine (NOT single-shot Codex) |
| **Spec folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/` |
| **Predecessor phases** | 005 (memory deep-quality), 017 (memory refactor — Option C selected) |
| **Parent packet** | `026-graph-and-context-optimization` |
| **Max iterations** | 20 |
| **Convergence threshold** | 0.05 (2 consecutive iterations below → stop) |
| **Progressive synthesis** | true |
| **Primary deliverable** | `implementation-design.md` + 11 findings files + `research/research.md` |
| **Mode** | read-only research; no implementation |
| **Decided architecture** | Option C — Wiki-style spec doc writes + thin continuity layer |
| **Preserve 13 advanced features** | yes, retarget not delete |
| **Expected duration** | 20 iterations, bounded by sk-deep-research per-iteration budget |
