# $refine TIDD-EC Prompt: 008-xethryon

## 2. Role

You are a research specialist in deferred memory reconsolidation, continuity synopsis generation, bootstrap-time project orientation, git-aware startup context, and post-turn background memory hooks. Work like a systems analyst who can distinguish memory-operations concerns (when and how consolidation happens) from memory-architecture concerns (where memory lives and how it is retrieved), and turn Xethryon's AutoDream-style deferred reconsolidation patterns into concrete improvements for `Code_Environment/Public`'s memory save cadence, session bootstrap surface, and causal-link flow. Keep the analysis grounded in actual repository evidence, especially around the system prompts, session lifecycle hooks, reconsolidation triggers, and pending-state invalidation logic.

## 3. Task

Research Xethryon's deferred reconsolidation cadence, continuity synopsis generation, git-aware project orientation, and background/post-turn memory hooks to identify practical improvements for `Code_Environment/Public`'s memory consolidation timing, session bootstrap payload, and causal-link flow. Focus on when Xethryon decides to reconsolidate (save, idle, compaction, explicit close, or background cadence), how it stores pending reconsolidation state safely, what its continuity synopsis contains that `session_bootstrap` does not already provide, and how much git/project orientation is useful before startup payloads become noisy. Compare Xethryon's choices against current Public capabilities and classify each recommendation as `adopt now`, `prototype later`, or `reject`. Prioritize improvements that strengthen memory freshness, bootstrap continuity, and causal-link maintenance without duplicating patterns already owned by Engram session summaries, MemPalace wake-up layers, or existing session_bootstrap hints.

## 4. Context

### System Description

Xethryon is a TypeScript/Bun OpenCode-layer system that adds persistent memory, self-reflection, and swarm orchestration on top of the underlying agent runtime. The pieces most relevant to memory architecture live in `packages/opencode/src/session/system.ts` and `packages/opencode/src/session/prompt.ts`, where session startup, post-turn hooks, and background reconsolidation are wired into the runtime. `XETHRYON_CONTEXT.md` and `XETHRYON_MODS.md` document the high-level claims: AutoDream consolidates durable memories in the background after save, self-review happens before delivery, and bootstrap includes git-aware project orientation as a first-class continuity surface (not an afterthought).

The architectural contribution is a **memory-operations layer** distinct from the memory substrate itself. Xethryon doesn't invent a new storage backend — it invents a cadence model for when consolidation, continuity synopsis, and orientation should happen. Deferred reconsolidation is triggered asynchronously after certain events (save, compaction, idle, explicit close) and writes its output into a pending-state file that the next session's bootstrap can safely invalidate or adopt. The continuity synopsis is a runtime-agnostic short summary designed to survive compaction and re-enter context cleanly at the top of the next turn. Git state is embedded into the bootstrap payload as first-class orientation metadata (commit hash, branch, dirty-flag, recent commits) so the agent starts every turn oriented in the repo's current position.

### Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 008 session summaries, continuity | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | — | Focus drift detection, no-DB approach |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | 008 cadence analogies | Focus FSRS decay math, cross-referencing |
| 004 | OpenCode Mnemosyne | Hybrid search + compaction hook | 008 compaction hook timing | Focus RRF fusion, plugin architecture |
| 005 | MemPalace | Palace taxonomy + wake-up layers + hooks | 008 bootstrap orientation, post-compaction hook | Focus raw verbatim storage, wake-up L0-L3, palace graph |
| 006 | Babysitter | Replay-safe event journal + nextActions | 008 post-turn hook cadence | Focus checksummed journal, replay integrity |
| 007 | Ralph | Git-as-memory + progress bridge | 008 git-aware bootstrap | Focus git lineage embedding, bridge-vs-archive |
| **008** | **Xethryon** | **Deferred reconsolidation + continuity synopsis + bootstrap orientation** | **001 session summaries, 005 wake-up layers, 007 git bootstrap** | **Focus trigger cadence, pending-state invalidation, runtime-agnostic synopsis** |

### What This Repo Already Has

`Code_Environment/Public` already has `session_bootstrap` for startup context priming, `memory_context` for resume payloads, `generate-context.js` for synchronous memory save authority, causal links between memories (memory_causal_link MCP tools), memory health/validation, and extensive hook infrastructure. It has `@handover` for explicit session handover documents and `sk-deep-research` for externalized loop state. The compaction boundary is handled via the existing compaction plugin at `.opencode/plugins/spec-kit-compact-code-graph.js`.

What it does **not** currently have is a first-class cadence model for deferred reconsolidation (all saves are synchronous via `generate-context.js`), a runtime-agnostic continuity synopsis format (session_bootstrap is per-runtime), pending-reconsolidation state that next-session bootstrap can invalidate or adopt, or structured git-derived project orientation in the bootstrap payload. Causal links are maintained explicitly but not reconsolidated asynchronously in the background.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Read the governing files first: `external/AGENTS.md`, `external/CONTRIBUTING.md`, `external/README.md`, `external/STATS.md`, and the Xethryon-specific context docs `external/XETHRYON_CONTEXT.md` and `external/XETHRYON_MODS.md` (these are the authoritative positioning docs for Xethryon's memory-operations claims).
3. Follow this reading order for domain evidence: `external/packages/opencode/src/session/system.ts` first (session runtime and lifecycle), then `external/packages/opencode/src/session/prompt.ts` (system prompt assembly and bootstrap payload), then any `external/packages/opencode/src/memory/` or `external/packages/opencode/src/session/*` files touching consolidation, then `external/install/` and `external/infra/` for operational surface only as supporting context.
4. Trace the reconsolidation trigger path end-to-end: where is it scheduled, what triggers it (save hook, idle timer, compaction boundary, explicit close, background cadence), where does the pending state persist, and how is the pending state invalidated by the next session.
5. Trace continuity synopsis generation: what content does it include, how is it compacted, where is it stored, and how does it interact with the system prompt at the start of the next session.
6. Trace bootstrap orientation: what git state is captured, what project state is captured, how much is always-on vs on-demand, and how does the payload stay below a useful-not-noisy threshold.
7. Compare against Public's current stack: `session_bootstrap` behavior, `memory_context` resume format, `generate-context.js` save authority, causal-link flow, compaction plugin, and handover doc contract. Identify specifically where Xethryon's cadence model could be added without breaking existing authority.
8. Use CocoIndex plus grep to trace implementations. TypeScript projects generally index well; if a file location differs from the plan, document the actual path and proceed.

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
- **Why it matters**: relevance to Public's memory stack
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
Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon/external and identify concrete improvements for Code_Environment/Public's memory consolidation cadence, session bootstrap payload, continuity synopsis generation, and background post-turn memory hook patterns, especially around deferred reconsolidation triggers, pending-state safety, runtime-agnostic synopsis format, and git-aware project orientation at startup.
```

### 5.3 Validation + memory save

Save memory for this phase folder when research is complete with:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/008-xethryon"
```

## 6. Research Questions

1. What should deferred reconsolidation trigger on: save, idle, compaction, explicit close, background cadence, or a combination? What are the pros and cons of each trigger?
2. How should pending reconsolidation state be stored and invalidated safely so partial writes don't corrupt durable memory, and so the next session can cleanly adopt or discard it?
3. What belongs in a runtime-agnostic continuity synopsis that `session_bootstrap` does not already provide, and what is the right size / shape for that synopsis?
4. How much project-orientation and git state is helpful at bootstrap before the payload becomes noisy or stale — and when should it be on-demand rather than automatic?
5. What is the right cadence for background/post-turn memory hooks vs synchronous save-on-explicit-event, and how does Xethryon avoid race conditions?
6. How does Xethryon's AutoDream reconsolidation compare to Public's current causal-links + `memory_context` flow — what does it add, what does it duplicate?
7. Which reconsolidation patterns are genuinely net-new vs overlap with MemPalace wake-up layering, Engram session summaries, or Ralph's git-aware bootstrap?
8. Is Xethryon's self-reflection-before-delivery pattern applicable to Public's `@deep-review` or `@review` flow, or is it strictly a session-UX concern?
9. What is the interaction between Xethryon's autonomy-switching and Public's gate system (Gate 1/2/3) — can the cadence model respect Public's gates, or does it bypass them?
10. Which Xethryon patterns are memory-architecture concerns (save cadence, consolidation, synopsis) vs session-UX concerns (operator ergonomics, prompt polish) — scope triage the findings.

## 7. Do's

- Do read `XETHRYON_CONTEXT.md` and `XETHRYON_MODS.md` first — they are the authoritative positioning docs for Xethryon's memory claims.
- Do trace `packages/opencode/src/session/system.ts` and `packages/opencode/src/session/prompt.ts` end-to-end; these files carry the architectural contribution.
- Do look for where hooks, idle timers, or post-save callbacks are registered — the cadence model lives in the registration, not the save function.
- Do map every finding to a concrete target file in Public (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `.opencode/plugins/spec-kit-compact-code-graph.js`, etc.).
- Do identify specifically where Xethryon overlaps with Engram session summaries, MemPalace wake-up layers, and Ralph's git bootstrap, and triage accordingly.
- Do preserve the memory-operations vs memory-architecture lens throughout the analysis.

## 8. Don'ts

- Do not recommend adopting Xethryon's install scripts, nix flakes, or deployment surface as memory contributions.
- Do not conflate AutoDream with a new retrieval backend — Xethryon's claim is cadence, not storage.
- Do not treat self-reflection-before-delivery as a memory feature by default; triage it as either a memory concern (if it rewrites saved state) or a delivery concern (if it only shapes the output).
- Do not propose replacing Public's synchronous `generate-context.js` save authority; Xethryon's contribution is an asynchronous consolidation layer on top, not a replacement.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Deferred reconsolidation finding

```text
**Finding: Post-save deferred reconsolidation cadence**
- Source: external/packages/opencode/src/session/system.ts:L[line]; external/XETHRYON_CONTEXT.md:L[line]
- What it does: Xethryon registers a post-save async hook that schedules AutoDream reconsolidation. The hook runs off the critical path, writes output to a pending-state file, and commits on next bootstrap if validation passes.
- Why it matters: Public's `generate-context.js` saves are fully synchronous; any cross-memory consolidation (causal-link rebalancing, topic-key normalization) happens inline and blocks the save path. An async post-save hook could move non-critical consolidation off the hot path without changing the save authority.
- Recommendation: prototype later
- Affected area: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` (post-save hook registration), new pending-state file format
- Impact: medium (latency improvement for heavy saves, enables safer cross-memory work)
- Source strength: primary
```

### Example B: Bootstrap orientation finding

```text
**Finding: Git-aware bootstrap orientation payload**
- Source: external/packages/opencode/src/session/prompt.ts:L[line]; external/XETHRYON_MODS.md:L[line]
- What it does: At session bootstrap, Xethryon captures git HEAD commit, branch, dirty-file count, and last-5 commit titles, then embeds them in the system prompt as structured project orientation (not as a freeform note).
- Why it matters: Public's `session_bootstrap` currently surfaces structural hints, routing nudges, and recent memory context, but not git orientation. Adding a structured git-state block would let the agent start every turn oriented to the repo's actual position without manual status calls.
- Recommendation: adopt now
- Affected area: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` (add gitState to payload), no schema break
- Impact: medium (additive field, improves first-turn efficiency)
- Source strength: primary
```

## 10. Constraints

### Error Handling

- If CocoIndex cannot index the TypeScript sources, fall back to targeted grep + direct file reads and state the fallback explicitly.
- If `XETHRYON_CONTEXT.md` or `XETHRYON_MODS.md` make an architectural claim not confirmed in `packages/opencode/src/session/`, mark it unverified rather than proven.
- If file paths differ from the plan, document the actual path and continue with source-backed analysis.
- Xethryon ships install scripts and infra configs — these are NOT architectural evidence. Ignore them for memory claims.

### Scope

**IN SCOPE**

- Deferred reconsolidation triggers and cadence
- Pending reconsolidation state storage and invalidation
- Continuity synopsis generation and format
- Git-aware bootstrap orientation payload
- Post-turn / background memory hooks
- Interaction with compaction boundary and explicit close events
- Self-reflection-before-delivery only where it touches saved memory state

**OUT OF SCOPE**

- Install scripts, nix flakes, bun config, packaging surface
- Swarm orchestration and file-based IPC (that is a separate investigation track, already covered in `999-agentic-system-upgrade/002-agentic-adoption/017-swarm-mailbox-artifacts-study`)
- Autonomy switching as a pure UX feature (unless it touches memory state)
- Generic TypeScript style commentary
- Performance benchmarks

### Prioritization Framework

Rank findings in this order: reconsolidation trigger design value, pending-state invalidation safety, continuity synopsis format leverage, bootstrap orientation payload fit, overlap triage with Engram/MemPalace/Ralph, memory-operations vs memory-architecture scope triage, async-hook vs sync-save boundary.

## 11. Deliverables

- `research/iterations/iteration-001.md` through `iteration-020.md` each matching the canonical sk-deep-research section structure
- `research/deep-research-state.jsonl` with one config record + 20 iteration records + synthesis_complete event, all with required 042 fields
- `research/research.md` as the canonical synthesis report with at least 5 evidence-backed findings
- Every nontrivial finding cites an exact Xethryon file path (and ideally line number)
- Explicit comparison against Public's `session_bootstrap`, `memory_context`, `generate-context.js`, causal-link flow, and compaction plugin
- Explicit memory-operations vs memory-architecture scope triage per finding
- Memory saved from this exact phase folder using `generate-context.js`

## 12. Evaluation Criteria

- At least 5 findings are evidence-backed with exact file path citations, not speculative
- Findings clearly distinguish Xethryon's genuinely new contributions (cadence model, pending-state safety, runtime-agnostic synopsis) from ideas already owned by other phases
- Recommendations explicitly say `adopt now`, `prototype later`, `reject`, or `NEW FEATURE`
- Cross-phase overlap with 001 (Engram session summaries), 005 (MemPalace wake-up layers), 006 (Babysitter post-turn hooks), and 007 (Ralph git bootstrap) is acknowledged
- Every iteration file matches the canonical sk-deep-research section structure and appends a valid JSONL record with 042 fields
- The research output clearly separates memory-operations (cadence, triggers, hooks) from memory-architecture (storage, retrieval, schema)

## 13. Completion Bar

- `phase-research-prompt.md` exists in this phase folder and is specific to Xethryon rather than generic reconsolidation research
- All 20 iteration files exist at `research/iterations/iteration-001.md` through `iteration-020.md`
- `research/deep-research-state.jsonl` contains config + 20 iteration records + final event with full 042 field coverage
- `research/research.md` synthesis exists and names at least 5 evidence-backed findings
- Quality guards (source_diversity, focus_alignment, no_single_weak_source) pass before STOP
- Ruled-out directions are captured explicitly in iteration files and flow into `research/research.md`
- No edits are made outside this phase folder
