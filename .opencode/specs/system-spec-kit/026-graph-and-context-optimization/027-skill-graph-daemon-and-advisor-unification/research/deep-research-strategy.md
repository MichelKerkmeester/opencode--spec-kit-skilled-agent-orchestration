# Deep Research Battle Plan — Phase 027 r01

## Target

Converged research output answering **31 sub-questions across 4 tracks** on how to evolve the skill-advisor stack into a unified subsystem:
- Track A: Skill-Graph Auto-Update Daemon (A1-A8, 8 questions)
- Track B: Advisor Trigger + Keyword Auto-Derivation (B1-B7, 7 questions)
- Track C: Advanced Advisor Matching (Hybrid + Causal) (C1-C8, 8 questions)
- Track D: System-Spec-Kit MCP Server Consolidation (D1-D8, 8 questions)

## Executor

cli-codex gpt-5.4, reasoning-effort=high, service-tier=fast, per-iter fresh invocation (no shared session). maxConcurrent=1.

## Iteration Plan (40 iters + synthesis)

Iterations are NOT open-ended exploration. Each iteration targets a SPECIFIC question or a SPECIFIC cross-track synthesis step. Driver pre-assigns iteration → task mapping below. Per-iter prompt is pre-templated with target question, prior iteration continuity, evidence pointers, and verdict requirement.

### Iteration → Task Map (40 iterations)

| Iter | Track | Question(s) | Mode |
|---|---|---|---|
| 1 | A | A1 Watcher choice | Investigate + verdict |
| 2 | A | A2 Scope of change detection | Investigate + verdict |
| 3 | A | A3 Incremental vs full re-index | Investigate + verdict |
| 4 | A | A4 Update transaction model | Investigate + verdict |
| 5 | A | A5 Daemon lifecycle | Investigate + verdict |
| 6 | A | A6 Resource budget | Investigate + verdict |
| 7 | A | A7 Sanitization at re-index | Investigate + verdict |
| 8 | A | A8 Failure modes | Investigate + verdict |
| 9 | B | B1 Extraction sources | Investigate + verdict |
| 10 | B | B2 Extraction pipeline | Investigate + verdict |
| 11 | B | B3 Sync model | Investigate + verdict |
| 12 | B | B4 Precision safeguards | Investigate + verdict |
| 13 | B | B5 Freshness trigger | Investigate + verdict |
| 14 | B | B6 Corpus stats | Investigate + verdict |
| 15 | B | B7 Adversarial resilience | Investigate + verdict |
| 16 | C | C1 Available primitives | Inventory existing memory MCP code |
| 17 | C | C2 Mapping memory→advisor concepts | Investigate + verdict |
| 18 | C | C3 Causal graph for skills | Investigate + verdict |
| 19 | C | C4 Scoring fusion | Investigate + verdict |
| 20 | C | C5 Ambiguity handling | Investigate + verdict |
| 21 | C | C6 Performance (embedding lookup cost) | Investigate + benchmark plan |
| 22 | C | C7 Training/tuning data (019/004 corpus use) | Investigate + verdict |
| 23 | C | C8 Target accuracy | Investigate + concrete target |
| 24 | D | D1 Current split inventory | Inventory + table |
| 25 | D | D2 Migration target layout | Investigate + verdict |
| 26 | D | D3 MCP-tool surface | Design + signatures |
| 27 | D | D4 Subprocess elimination | Investigate + verdict |
| 28 | D | D5 Cache + freshness sharing | Investigate + verdict |
| 29 | D | D6 Install/bootstrap changes | Investigate + verdict |
| 30 | D | D7 Backward compat matrix | Design + compat table |
| 31 | D | D8 Plugin relationship | Investigate + verdict |
| 32 | — | Cross-track coherence pass (A×B: does B's freshness trigger match A's scope?) | Integration check |
| 33 | — | Cross-track coherence (A×C: does A's transaction model work with C's causal graph rebuild?) | Integration check |
| 34 | — | Cross-track coherence (B×C: does auto-derived keyword set feed into C's fusion scorer?) | Integration check |
| 35 | — | Cross-track coherence (C×D: do C's MCP primitives live in the right mcp_server module?) | Integration check |
| 36 | — | Architectural sketch (R2 — unified data flow diagram-as-text) | Synthesis intermediate |
| 37 | — | Implementation roadmap (R3 — sub-packet list with deps + effort) | Synthesis intermediate |
| 38 | — | Risk register (R4 — ≥5 risks + mitigations) | Synthesis intermediate |
| 39 | — | Measurement plan (R5 — metrics, targets, harness) | Synthesis intermediate |
| 40 | — | Convergence check + final verdict summary | Pre-synthesis consolidation |

### Post-40 Synthesis

Single cli-codex invocation reads all 40 iteration files + produces:
1. `research/research.md` — sk-doc quality, DQI ≥ 85. Sections: Executive Summary, Track A-D findings, Architectural Sketch, Roadmap, Risks, Measurement Plan, Appendix of evidence citations.
2. `research/research-registry.json` — machine-readable per-question verdicts.
3. `research/deep-research-state.jsonl` — append `completed` event.

---

## Evidence Map (per question — the "delegation logic")

For each of the 31 sub-questions, codex should probe these concrete locations during that iteration:

### Track A
- **A1**: Node docs `fs.watch`, `chokidar` npm docs, `fsevents` behavior on macOS (search via web tool), atomic-rename editor behaviors (Vim docs, VS Code workspace settings). Existing repo: any `fs.watch` or `chokidar` usage in `mcp_server/lib/**` (grep).
- **A2**: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` (what it currently reads); grep `generate-context.js` invocations across repo; inventory of frontmatter fields in SKILL.md templates.
- **A3**: `skill_graph_compiler.py` — does it support per-skill selective recompile? `skill-graph.sqlite` schema inspection.
- **A4**: `mcp_server/lib/code-graph/freshness.ts` (Phase 020 generation-tag model — reference pattern); SQLite transaction documentation; atomic write strategies used elsewhere in repo.
- **A5**: macOS `launchctl` + user agent patterns; `mcp_server/` current startup model; how memory MCP currently boots.
- **A6**: Profile `skill_graph_compiler.py` runtime on current repo; count watched file descriptors.
- **A7**: `render.ts::sanitizeSkillLabel` (post-025); `shared-payload.ts::coerceSharedPayloadEnvelope` sanitizer path.
- **A8**: SQLite WAL mode docs; editor atomic-write patterns and how they interact with fs watchers; memory MCP's failure-recovery path (if any).

### Track B
- **B1**: `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py` — current keyword match function. SKILL.md frontmatter schema. `sk-doc` extraction patterns for headings.
- **B2**: Python `sklearn.feature_extraction.text.TfidfVectorizer` docs; embedding model options available in-repo (check `mcp_server/lib/memory/embeddings*`); cost comparison.
- **B3**: Current write locations for trigger_phrases (frontmatter-only); alternative: sidecar `advisor-index.json` per skill; hybrid explicit + derived.
- **B4**: Precision/recall framework; confidence calibration literature. 019/004 corpus as validation.
- **B5**: A3 dependency graph reuse; file-level timestamp vs content-hash invalidation.
- **B6**: TF-IDF corpus normalization practices; repo-level baseline re-computation frequency.
- **B7**: LLM prompt-injection literature; keyword-stuffing defenses in search systems (elastic, google historical notes).

### Track C
- **C1**: Inventory (grep + read) `mcp_server/lib/memory/**`, list exported public APIs:
  - `memory_context`, `memory_search`, `memory_quick_search`, `memory_match_triggers`
  - `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`
  - `memory_index_scan`, `memory_stats`, `memory_health`
  - Hybrid search internals (embedding + keyword fusion function)
- **C2**: Type-level comparison of memory-entry schema vs skill schema. Identify delta.
- **C3**: `memory_causal_link` semantics — can it link skills? Graph traversal cost.
- **C4**: Existing memory MCP fusion function (grep for "weight" / "score" / "confidence" in `mcp_server/lib/memory/`). Analytical vs learned discussion.
- **C5**: Post-025 ambiguity-rendering code: `render.ts:~123`. How does it currently detect ambiguity? Would causal edges improve?
- **C6**: Phase 020 advisor cache p95 benchmark (from `advisor-prompt-cache.vitest.ts`). Memory MCP embedding search latency (find existing benchmarks or estimate from code).
- **C7**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl` — 200 labeled prompts. Train/holdout split strategy.
- **C8**: Current baseline 56% (from 024 `scripts/observability/smart-router-measurement.ts` output). Realistic improvement targets: hybrid search literature typical gains.

### Track D
- **D1**: `ls -R .opencode/skill/skill-advisor/` vs `ls -R .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/`. Inventory what's where. SQLite DB location. Test files.
- **D2**: Memory MCP layout as architectural analog: `mcp_server/lib/memory/` structure. Proposed target.
- **D3**: `mcp_server/tools/*.ts` (existing MCP tool definitions). Tool schema conventions. Proposed `advisor_*` tool signatures with Zod schemas.
- **D4**: Pure-TS implementation feasibility — can `skill_advisor_runtime.py` scoring logic be ported? PyOdide bridge vs rewrite. Lines of code.
- **D5**: `mcp_server/lib/memory/cache.ts` or equivalent; `mcp_server/lib/skill-advisor/prompt-cache.ts` (post-025). Merge feasibility.
- **D6**: Install guide at `.opencode/skill/system-spec-kit/install_guide/`; current MCP declarations in `opencode.json`; advisor install/uninstall flow.
- **D7**: All call sites of `skill_advisor.py` — grep across repo. CLAUDE.md Gate 2 fallback. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`. Manual-testing playbook scenarios.
- **D8**: Plugin/bridge current proxy logic. Post-consolidation options: pass-through to MCP tool, deprecation notice, or removal.

### Cross-track (iters 32-35)
Integration coherence — verify designs across tracks don't conflict.

### Synthesis intermediates (iters 36-40)
Each iteration produces ONE complete synthesis artifact in its iteration file, so the final synthesis step can concatenate + deduplicate without additional research.

---

## Per-Iteration Prompt Template (codex)

Each of iter 1-40 receives a prompt customized from this template:

```
You are executing iteration {N} of a 40-iteration deep-research on Phase 027 (Skill-Graph Daemon + Advisor Unification).

Repo root: {REPO}
Research packet: {SPEC_FOLDER}/research/

# Your target this iteration
{TRACK}: {QUESTION_ID} — {QUESTION_TITLE}

{QUESTION_DESCRIPTION}

# Evidence to probe
{EVIDENCE_MAP_ENTRY}

# Protocol
1. Read research/deep-research-strategy.md (this battle plan) for full context.
2. Read research/deep-research-state.jsonl for prior iteration summaries.
3. If N>1, read research/iterations/iteration-{N-1}.md for continuity.
4. For your assigned question, READ the evidence sources listed above. Use Grep/Read/Glob aggressively. For web-searched terms (e.g. chokidar docs), use the WebFetch or WebSearch tool if available; otherwise note "needs-web-lookup" and proceed with in-repo evidence.
5. Write iterations/iteration-{NNN}.md with exact structure:

# Iteration {NNN} — Track {TRACK}: {QUESTION_ID} — {QUESTION_TITLE}

## Question
{QUESTION_DESCRIPTION}

## Evidence Collected
- <source>:<locator> → <quote or summary>
- ...

## Analysis
<2-4 paragraphs of reasoning connecting evidence to the verdict>

## Verdict
- **Call:** adopt now | prototype later | reject
- **Confidence:** high | medium | low
- **Rationale:** <1-2 sentences>

## Dependencies
<other question IDs this answer depends on or interacts with>

## Open follow-ups
<any residual uncertainty for later iters or implementation phases>

## Metrics
- newInfoRatio: {X.XX}
- dimensions_advanced: [{TRACK}]

6. Append one JSON line to research/deep-research-state.jsonl:
   {"type":"iteration","iteration":{N},"timestamp":"{ISO8601}","track":"{TRACK}","question":"{QUESTION_ID}","verdict":"adopt_now|prototype_later|reject","confidence":"high|medium|low","newInfoRatio":{X.XX}}

7. Print: ITER_{N}_DONE

# Constraints
- READ-ONLY. No code changes. Only writes to iteration-{NNN}.md and state.jsonl.
- Do not skip the evidence probe. Cite file:line for every claim.
- Verdict MUST be one of adopt_now | prototype_later | reject.
- Confidence MUST be one of high | medium | low.
- Don't reopen Phase 020-026 shipped architecture.
- Do not advance to other questions than yours.
```

Synthesis iteration (step after iter 40) prompt template is in driver script.

---

## Synthesis Contract

Final `research.md` must include:

1. **Executive Summary** (1 paragraph, verdict distribution, top 3 adopt-now decisions, top 3 reject decisions)
2. **Scope** (what's in, what's out; ref to spec.md)
3. **Methodology** (40-iter protocol, cli-codex per-iter, evidence-first, verdict-required)
4. **Track A Findings** — per-question verdict + 1-2 sentence rationale + evidence pointers (to iteration files)
5. **Track B Findings** — same structure
6. **Track C Findings** — same structure
7. **Track D Findings** — same structure
8. **Architectural Sketch** — text-as-diagram of unified A+B+C+D data flow
9. **Implementation Roadmap** — ≥3 follow-on sub-packets with deps + effort estimates
10. **Risk Register** — ≥5 risks + mitigations
11. **Measurement Plan** — concrete metrics + targets + harness
12. **Appendix** — cross-reference table mapping each sub-question ID to its iteration file

`research-registry.json` must have shape:

```json
{
  "generatedAt": "<ISO>",
  "target": "skill-graph-daemon-and-advisor-unification",
  "iterations": 40,
  "tracks": {
    "A": {"questions": 8, "adopt_now": N, "prototype_later": N, "reject": N},
    "B": {...}, "C": {...}, "D": {...}
  },
  "questions": [
    {"id":"A1","track":"A","title":"...","verdict":"adopt_now","confidence":"high","iteration":1,"rationale":"...","evidence":["path:line","..."]},
    ...  // 31 entries total
  ],
  "roadmap": [
    {"subPacket":"027/001","scope":"...","depends_on":[],"effort_days":"M"},
    ...
  ],
  "risks": [...],
  "measurement_plan": {...}
}
```

---

## Verdict Rules

Research convergence = verdict produced for all 31 sub-questions + 4 cross-track checks + 5 synthesis intermediates = 40 iterations completed.

No early-stop: user directive. Even if iter 30 achieves low newInfoRatio, continue to iter 40 per plan (iters 32-40 are planned integration + synthesis steps, not exploration of new evidence).

---

## Executor Contract

- **Executor:** `cli-codex` via `codex exec`
- **Model:** `gpt-5.4`
- **Reasoning effort:** `high`
- **Service tier:** `fast`
- **Sandbox:** `workspace-write`
- **Approval:** `never`
- **Max iterations:** 40 (hard)
- **Per-iter invocation:** fresh (no session carry-over)
- **maxConcurrent:** 1

---

## Out of Scope for This Research

- Writing code
- Reopening Phase 020-026 architectural decisions
- Assuming live-AI telemetry (still deferred)
- Cross-repo skill discovery (explicitly rejected in prior research)
- LLM-as-matcher (explicitly rejected in prior research)
- Any work on unrelated skills or agents
