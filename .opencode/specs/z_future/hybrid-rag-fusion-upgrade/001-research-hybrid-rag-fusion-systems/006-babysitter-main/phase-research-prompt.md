# $refine TIDD-EC Prompt: 006-babysitter-main

## 2. Role

You are a research specialist in event-sourcing, replay-safe operational continuity, checksummed append-only journals, journal-head cache trust, and the architectural boundary between transient execution state and durable semantic memory. Work like a systems analyst who can trace TypeScript event-sourcing implementations, separate operational-memory patterns from durable-memory patterns, and turn Babysitter's replay-integrity contract into concrete improvements for `Code_Environment/Public`'s memory and deep-loop state infrastructure. Keep the analysis grounded in actual repository evidence, especially around event journal structure, journal-head validation, `nextActions` continuity, and the split between continuity-only compression and durable-memory promotion.

## 3. Task

Research Babysitter's checksummed append-only event journal, journal-head-validated replay cache, pending-action continuity, and operational-vs-durable memory split to identify practical improvements for `Code_Environment/Public`'s deep-loop state layer and save-authority boundary. Focus on how Babysitter achieves replay integrity with checksums, how it validates cached summaries before trusting them, where `nextActions` state lives so resume is deterministic, and how it keeps operational continuity separate from durable memory promotion. Compare Babysitter's choices against current Public capabilities and classify each recommendation as `adopt now`, `prototype later`, or `reject`. Prioritize improvements that strengthen deterministic replay, fault-tolerant resume, and the authority boundary between `sk-deep-research` JSONL state and `generate-context.js` durable memory.

## 4. Context

### System Description

Babysitter is a TypeScript/Node.js event-sourced orchestration runtime. Its core claim is that **operational memory** (mid-loop state, pending actions, replay caches) is a distinct architectural layer from **durable memory** (promoted facts, archived outcomes). The packages in `packages/sdk/src/storage/journal.ts` implement a checksummed append-only event journal where every append is content-hashed so later readers can validate they are reading a consistent head. `runtime/replay/stateCache.ts` caches summarized state but never trusts the cache until it has re-validated against the journal head — this is the "journal-head contract." `session/write.ts` handles how sessions append events and emit `nextActions` continuity state.

The architectural consequence is significant: Babysitter can crash mid-iteration, restart, and deterministically resume exactly where it left off without depending on any in-memory structure. Replay is safe because the journal is the source of truth and the cache is always re-validated. `nextActions` is stored as first-class continuity state — not as a prompt instruction, not as a chat residue, but as a structured queue that the next iteration reads before doing anything else. The system also has an explicit harness/plugin extensibility layer and context-compression patterns for long-running flows.

### Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 006 session continuity | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | — | Focus drift detection, no-DB approach |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | — | Focus FSRS decay, cross-referencing |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) + compaction hook | 006 compaction timing | Focus RRF fusion, plugin architecture |
| 005 | MemPalace | Palace taxonomy + wake-up layers + hooks | 006 compaction hook timing | Focus raw verbatim storage, wake-up L0-L3 |
| **006** | **Babysitter** | **Replay-safe event journal + journal-head contract + nextActions** | **001 session lifecycle, 005 compaction timing** | **Focus checksummed journal, replay integrity, operational-vs-durable split** |
| 007 | Ralph | Git-as-memory + progress bridge + fresh-agent loop | 006 continuity bridge concept | Focus git lineage embedding, bridge-vs-archive |
| 008 | Xethryon | Deferred reconsolidation + bootstrap orientation | 006 post-iteration hooks | Focus AutoDream cadence, continuity synopsis |

### What This Repo Already Has

`Code_Environment/Public` already has externalized deep-research state via `sk-deep-research` (JSONL state log + strategy.md + per-iteration markdown files), a reducer that generates dashboard and findings registry (`reduce-state.cjs`), memory save authority via `generate-context.js`, causal links between memories, health/status tooling, and a YAML workflow engine for loop lifecycle management. JSONL fault tolerance includes per-line try/catch, malformed-line skipping, default-field fallback, and state reconstruction from iteration files when the JSONL is missing.

What it does **not** currently have is checksummed append integrity (the JSONL is append-only but has no per-record or rolling hash), a formal journal-head contract for trusting cached summaries, or a first-class `nextActions` / pending-action continuity queue separate from `keyQuestions`. It also does not have an explicit architectural boundary labeled "operational memory vs durable memory" — those layers exist (JSONL state vs saved memory files) but are not named or governed as distinct contracts.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Read the governing files first: `external/AGENTS.md`, `external/CLAUDE.md`, `external/README.md`, `external/CONTRIBUTING.md`. Note positioning claims without accepting them uncritically.
3. Follow this reading order for domain evidence: `external/packages/sdk/src/storage/journal.ts` (the event journal implementation) first; then `external/packages/` for the runtime/replay/stateCache.ts equivalent; then `external/packages/` for session/write.ts; then `external/docs/` for architectural documentation; then `external/packages/` for plugin/harness infrastructure. Use Grep to locate files by name if the exact path differs from this plan.
4. Trace journal behavior end-to-end: how are events appended, what is the checksum scheme, what counts as the "journal head," how is replay validated against the head, and what happens on partial writes or corruption.
5. Trace replay cache trust: when is a cached summary allowed to be read, what validation must pass first, and what invalidates the cache.
6. Trace `nextActions` state: where is it persisted, who reads it first at the start of an iteration, how is it different from a key-question queue or a strategy document.
7. Compare Babysitter's journal and replay contract against Public's `sk-deep-research` state.jsonl + iteration file + strategy.md model. Where does Public already have equivalent guarantees, where does it lack them, and what would it cost to add them.
8. Look for the harness/plugin extensibility layer: what is the plugin contract, how do plugins integrate with the event journal and replay system, and is there anything Public's hook system does not already own.
9. Use CocoIndex plus grep to trace implementations. TypeScript projects may index well; if CocoIndex times out or returns weak results, fall back to targeted grep plus direct file reads and state that fallback explicitly in the research notes.

### 5.1 Deep Research Contract (aligned with sk-deep-research v1.5.0.0 / post-042)

This is a **20-iteration deep research run** via `codex-cli gpt-5.4 high` (fast service tier). Every iteration MUST produce a markdown file at `research/iterations/iteration-NNN.md` with EXACTLY these sections in order:

```markdown
# Iteration NNN: [Focus Area]

## Focus
[What this iteration investigated]

## Findings
### Finding N: [Title]
- **Source**: exact file path [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to Public's memory/state stack
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
- Novelty justification: [1-sentence explanation of what newInfoRatio represents]

## Ruled Out
- [approaches eliminated and why, with evidence]

## Dead Ends
- [exhausted approaches that should not be retried]

## Reflection
- What worked: [approach + causal explanation]
- What did not work: [approach + root cause]
- What I would do differently: [specific adjustment for next iteration]

## Recommended Next Focus
[What to investigate next, based on gaps discovered]
```

Every iteration MUST append a JSONL record to `research/deep-research-state.jsonl` with these fields (per state_format.md):
- `type: "iteration"`, `run: N`, `status: "complete"|"timeout"|"error"|"stuck"|"insight"|"thought"`
- `focus`, `findingsCount`, `newInfoRatio` (0.0-1.0)
- `keyQuestions`, `answeredQuestions` (arrays)
- `noveltyJustification` (human-readable breakdown)
- `ruledOut` array of `{approach, reason, evidence}` objects
- `sourceStrength` classification
- `timestamp`, `durationMs`

Respect the quality guards before claiming convergence: **source_diversity** (≥2 sources per question), **focus_alignment** (new findings align with original key questions), **single_weak_source_dominance** (block STOP if any question depends on a single tentative source).

Do NOT write to `deep-research-dashboard.md` or `findings-registry.json` — those are reducer-owned and generated post-run by `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs`.

### 5.2 Research topic

Use this exact deep-research topic:

```text
Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external and identify concrete improvements for Code_Environment/Public's memory and deep-loop state layer, especially around checksummed event journaling, journal-head cache validation, pending-action continuity state, replay-safe resume contracts, and the boundary between operational memory and durable memory.
```

### 5.3 Validation + memory save

Save memory for this phase folder when research is complete with:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main"
```

## 6. Research Questions

1. How should a checksummed append-only event journal coexist with Public's current `sk-deep-research` JSONL research artifacts without duplicating authority or creating two competing state logs?
2. What journal-head contract should gate trust in cached summaries, and where would Public expose such a contract (reducer layer, hook layer, or skill layer)?
3. Where should `nextActions` state live so resume is deterministic — packet-local in research/, inside strategy.md, as a new file, or inside session_bootstrap?
4. Which compression outputs are continuity-only and should NEVER be promoted into durable memory? How does Babysitter decide which events get compressed into cache and which get persisted into the journal head?
5. How does Babysitter's replay-safe cache compare to Public's `sk-deep-research` externalized JSONL + strategy state — what guarantees does it provide that Public's current model lacks?
6. What event types should Public consider adding to `deep-research-state.jsonl` beyond the existing set (`iteration`, `event`, `wave_start`, `synthesis_complete`)? Are there event categories Babysitter captures that Public does not?
7. How does Babysitter handle journal corruption, partial writes, and concurrent-writer safety, and what does that imply for Public's existing JSONL fault tolerance (per-line try/catch, malformed-line skipping)?
8. What is the boundary between a "pending action queue" and a "key question" in Public's existing strategy.md model, and should Babysitter's `nextActions` map to one or both?
9. How does Babysitter separate operational state from durable memory, and where does that split exist (or fail to exist) today in Public between `sk-deep-research` state and `generate-context.js` saves?
10. Which Babysitter patterns are genuinely net-new for Public vs overlap with Engram session lifecycle, MemPalace compaction hooks, Ralph's bridge-vs-archive split, or existing hook infrastructure?

## 7. Do's

- Do trace the journal implementation end-to-end in `packages/sdk/src/storage/journal.ts` — the checksum logic is the core contribution.
- Do examine the replay cache validation path from cache-read to journal-head check.
- Do study `nextActions` as a durable queue, not a chat prompt artifact.
- Do map every strong finding to a concrete target file in Public (`.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, etc.).
- Do identify where Babysitter overlaps with existing Public guarantees (append-only JSONL, fault-tolerant parsing, reducer ownership) and where it extends them.
- Do keep the operational-vs-durable memory split as the primary architectural lens.

## 8. Don'ts

- Do not recommend adopting Babysitter's plugin/harness layer wholesale; Public already has a hook system and the plugin abstraction is not the memory contribution here.
- Do not conflate Babysitter's event sourcing with Public's existing hook system — they address different problems.
- Do not over-focus on the TypeScript type definitions; the architecture claims matter more than type-level ergonomics.
- Do not recommend replacing `sk-deep-research` JSONL with Babysitter's journal; propose additive integrity guarantees instead.
- Do not propose a new durable memory authority; Babysitter's contribution is operational memory, and `generate-context.js` remains Public's durable authority.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Journal integrity finding

```text
**Finding: Checksum-validated journal head for JSONL trust**
- Source: external/packages/sdk/src/storage/journal.ts:L[line]
- What it does: Every append to the event journal is content-hashed, and the journal head includes a rolling checksum that later readers validate before trusting any cached summary derived from the journal.
- Why it matters: Public's `deep-research-state.jsonl` is append-only and fault-tolerant but has no integrity guarantee — a truncated or corrupted JSONL would silently produce a partial state reconstruction. Adding a rolling checksum would let the reducer and recovery paths detect corruption deterministically.
- Recommendation: prototype later
- Affected area: `.opencode/skill/sk-deep-research/references/state_format.md` (schema), `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` (reader)
- Impact: medium (additive integrity field, backward-compatible if optional)
- Source strength: primary
```

### Example B: nextActions continuity finding

```text
**Finding: First-class nextActions continuity queue**
- Source: external/packages/sdk/src/session/write.ts:L[line]; external/packages/sdk/src/storage/journal.ts:L[line]
- What it does: Babysitter persists `nextActions` as a structured queue in the journal — each entry is an object with trigger, context, and expected handler. Resume always reads `nextActions` before any new work and clears entries as they are completed.
- Why it matters: Public's `sk-deep-research` uses `keyQuestions` and `answeredQuestions` as the closest analog, but these represent research questions, not pending actions. A separate `nextActions` queue would let Public capture "resume must check this specific file first" style resumption hints without overloading the question model.
- Recommendation: NEW FEATURE
- Affected area: `.opencode/skill/sk-deep-research/references/state_format.md` (new field in iteration JSONL), `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` (new section)
- Impact: medium-high (enables deterministic resume for interrupted loops)
- Source strength: primary
```

## 10. Constraints

### Error Handling

- If CocoIndex cannot index the TypeScript sources, fall back to targeted grep + direct file reads and state the fallback explicitly.
- If the README makes an architectural claim not confirmed in `packages/sdk/`, mark it unverified.
- If file paths differ from the plan (e.g., `runtime/replay/stateCache.ts` lives elsewhere), document the actual path and continue.
- If a design looks like event-sourcing textbook material without Babysitter-specific refinement, note it as generic rather than a Babysitter contribution.

### Scope

**IN SCOPE**

- Checksummed append-only event journal
- Journal-head cache validation contract
- `nextActions` continuity state
- Operational-memory vs durable-memory boundary
- Replay integrity and deterministic resume
- Context compression for long-running flows (where it interacts with memory)
- Session write path and event categorization

**OUT OF SCOPE**

- Plugin/harness architecture as a general extensibility pattern (out of scope unless it directly touches memory contracts)
- Generic TypeScript style commentary
- Docker deployment or DevOps packaging (`DOCKER.md`, `docker-compose.yml`)
- Benchmarks and performance micro-optimization
- UI or operator-facing dashboards (unless they reveal memory semantics)

### Prioritization Framework

Rank findings in this order: replay-integrity guarantees (journal head, checksums), `nextActions` continuity state value, operational-vs-durable boundary clarity, cache trust contracts, overlap triage with Engram/Ralph/Xethryon/MemPalace, scope triage between state-layer and memory-layer concerns, event schema extensions.

## 11. Deliverables

- `research/iterations/iteration-001.md` through `iteration-020.md` each matching the canonical sk-deep-research section structure
- `research/deep-research-state.jsonl` with one config record + 20 iteration records + synthesis_complete event, all with required 042 fields
- `research/research.md` as the canonical synthesis report with at least 5 evidence-backed findings
- Every nontrivial finding cites an exact Babysitter file path (and ideally line number)
- Explicit comparison against Public's `sk-deep-research` state contract, `generate-context.js` save authority, and existing hook infrastructure
- Explicit operational-vs-durable scope triage per finding
- Memory saved from this exact phase folder using `generate-context.js`

## 12. Evaluation Criteria

- At least 5 findings are evidence-backed with exact file path citations, not speculative
- Findings clearly distinguish Babysitter's genuinely new contributions (journal-head contract, nextActions, replay integrity) from ideas already owned by other phases or existing Public infrastructure
- Recommendations explicitly say `adopt now`, `prototype later`, `reject`, or `NEW FEATURE`
- Cross-phase overlap with 001 (Engram), 005 (MemPalace), 007 (Ralph), and 008 (Xethryon) is acknowledged
- Every iteration file matches the canonical sk-deep-research section structure and appends a valid JSONL record with 042 fields
- The research output clearly separates operational-memory recommendations from durable-memory recommendations

## 13. Completion Bar

- `phase-research-prompt.md` exists in this phase folder and is specific to Babysitter rather than generic event-sourcing research
- All 20 iteration files exist at `research/iterations/iteration-001.md` through `iteration-020.md`
- `research/deep-research-state.jsonl` contains config + 20 iteration records + final event with full 042 field coverage
- `research/research.md` synthesis exists and names at least 5 evidence-backed findings
- Quality guards (source_diversity, focus_alignment, no_single_weak_source) pass before STOP
- Ruled-out directions are captured explicitly in iteration files and flow into `research/research.md`
- No edits are made outside this phase folder
