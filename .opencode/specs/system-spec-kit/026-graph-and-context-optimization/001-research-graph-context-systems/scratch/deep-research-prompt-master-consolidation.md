# DEEP-RESEARCH CHARTER — Master Consolidation of External Systems Research (Phase 2)

> **How to use:** Paste the charter below (everything from `## 1. ROLE` onward) into `/spec_kit:deep-research` (or hand to `@deep-research`). It drives the second-pass consolidation loop using `cli-codex --model gpt-5.4 --reasoning-effort high` in **Fast mode**, with externalized state under `<PARENT>/research/`. This is **not** a first-pass research request — it builds upon five completed first-pass phases.

---

## Prompt metadata

| Field | Value |
|---|---|
| Framework | RCAF (Role · Context · Action · Format) |
| Mode | `$improve` (10 DEPTH rounds) |
| CLEAR score | 44/50 |
| Runtime | `cli-codex --model gpt-5.4 --reasoning-effort high` |
| Operating mode | Fast mode (parallel/background dispatch where possible) |
| Loop | `/spec_kit:deep-research` standard externalized state |
| Constraint | LEAF-only (reducer logic permitted between iterations) |
| Iteration target | 8–12 (12 hard ceiling) |
| Output folder | `<PARENT>/research/` (the parent, NOT per-phase) |

---

## 1. ROLE

Act as a **second-pass deep-research synthesizer**. Five sibling sub-folders already contain line-cited research, decision records, and implementation summaries for five external systems. The mission is to **build upon that work in a smart way** — ingest first-pass outputs, close the gaps first-pass explicitly flagged, perform cross-phase synthesis no individual phase could perform alone, and ship **one consolidated master research package**.

**Operating identity:** synthesizer + auditor + cross-system comparator. **Not** a first-pass researcher.

---

## 2. CONTEXT

### 2.1 Parent spec folder (anchor for all paths)

```
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/
```
Hereafter: `<PARENT>`.

### 2.2 The five first-pass phases (read-only inputs)

| # | Folder under `<PARENT>` | System | One-line description |
|---|---|---|---|
| 1 | `001-claude-optimization-settings/` | Claude Optimization Settings | Reddit field-report audit of 858–926 Claude Code sessions; 24 findings (F1–F24) across 4 tiers; landed `ENABLE_TOOL_SEARCH=true` |
| 2 | `002-codesight/` | CodeSight | Zero-runtime-deps Node CLI; single-pass scan → unified `ScanResult` → static markdown / per-AI-tool profiles / 8 MCP tools; claims 11.2× token reduction |
| 3 | `003-contextador/` | Contextador | Bun MCP server; model-first query routing with keyword fallback; pointer-based context delivery + optional Matrix-backed Mainframe shared cache |
| 4 | `004-graphify/` | Graphify | Python Claude Code skill; AST + LLM two-pass extraction; evidence-tagged edges (EXTRACTED/INFERRED/AMBIGUOUS); Leiden clustering; 12-language support |
| 5 | `005-claudest/` | Claudest | Plugin marketplace centered on `claude-memory`: SQLite + FTS5 (FTS4/LIKE cascade); Stop-time pre-computed `context_summary`; auditor/discoverer split |

For each phase folder, the canonical first-pass artifacts are:
```
<PARENT>/<phase>/research/research.md          # synthesis (read first)
<PARENT>/<phase>/decision-record.md            # ADRs
<PARENT>/<phase>/implementation-summary.md     # what landed
<PARENT>/<phase>/external/                     # cloned source repo (read only when phase-1 evidence is insufficient or contradicted)
```

### 2.3 First-pass exit gaps that this run MUST close

**Phase 001 — Claude Optimization Settings**
- **Q2:** First-tool latency / discoverability impact of `ENABLE_TOOL_SEARCH=true` — token claim verified, ergonomics never measured.
- **Q8:** Edit-retry root-cause attribution (31 chains in source) across `prompt | workflow | guardrail` buckets — never partitioned.
- **Q9:** Net-cost audit of `/clear` + plugin-memory remedy bundle vs stale-resume baseline — gross savings claimed, overhead never subtracted.
- **Reddit-post arithmetic** does not internally reconcile (264M tokens; 858 vs 926 sessions; 18,903 vs 11,357 turns) — mark resolved or permanently UNKNOWN.
- **Cross-phase:** validate that phase 005's shipped auditor/parser actually matches F14–F17 expectations from phase 001.

**Phase 002 — CodeSight**
- **11.2× token claim** is hand-tuned formula (route=400, schema=300, etc.); zero coverage in `eval.ts` — empirical validation needed against real Claude/GPT counts.
- **tRPC / Fastify** receive zero contract enrichment despite AST routing — deliberate or gap?
- **Go** uses regex+brace-tracking yet labels `confidence: "ast"` — mislabel or pending work?
- **Monorepo support:** only pnpm + npm workspaces; turbo/nx/lerna untested → silent data loss?
- **Blast-radius BFS** off-by-one depth-cap leak; model-impact heuristic ("file owns db route → all schemas affected") — false-positive rate?

**Phase 003 — Contextador**
- **93% token reduction** is `AVG_MANUAL_EXPLORATION_TOKENS = 25000` synthetic constant — pointer-quality benchmark needed vs Public's typed CocoIndex+CodeGraph+Memory stack.
- **Mainframe room privacy weakness** (`preset: "public_chat"` despite `visibility: "private"`; plaintext creds in `.contextador/mainframe-agent.json`).
- **Multi-agent contention** on Matrix room-state writes — race / lock semantics unverified.
- **GitHub automation** (`external/src/lib/github/`) — webhook idempotency, secret rotation, error notification all source-only.
- **Repair queue completion guarantees** post-regeneration — open.

**Phase 004 — Graphify**
- **71.5× token reduction** relies on naive baseline + 4-chars/token heuristic — needs Anthropic `count_tokens` grounding.
- **Cache:** monotonic growth, no orphan GC, mtime-only invalidation, no tombstones.
- **Cross-language extraction parity** — Python has 3× structure (calls, uses, rationale); other 11 languages capped; Swift detected but never extracted.
- **AST INFERRED edges** flat 0.5; **semantic INFERRED** 0.4–0.9 — does inconsistency hurt ranking quality?
- **Mixed-corpus README** claims multimodal output but checked-in `GRAPH_REPORT.md` shows code-only / zero token spend — needs re-execution or honest re-labeling.
- **PreToolUse `Glob|Grep` nudge effectiveness** — never measured.

**Phase 005 — Claudest**
- Phase 1 never opened `mcp_server/lib/search/sqlite-fts.ts` — must verify FTS4 creation + PRAGMA probe support before "smallest safe v1" lane is trustable.
- Stop hook does not currently persist `transcript_path`, drops cache-token fields, no turn-level offsets — Brief B (normalized analytics) blocked until producer patch lands.
- Per-plugin `CLAUDE.md` reconstructed indirectly from README/skill — needs direct file inspection.
- Docstring/implementation drift in `_build_fallback_context()` ("last 3 exchanges" vs actual "first-2 + last-6").
- Whether Public's `008-signal-extraction` packet already embodies the auditor/discoverer split or treats consolidation as a monolithic pass.

### 2.4 The six cross-phase questions (highest value — only this run can answer them)

| ID | Question | Why it requires cross-phase view |
|---|---|---|
| **Q-A** | **Token-savings honesty audit.** All 5 systems claim a token-reduction figure (11.2× / 71.5× / 93% / etc.), each computed differently (formula constant / heuristic / fixed denominator / model arithmetic). Build ONE comparison table (claimed reduction × measurement method × evidence quality × what would falsify it) and recommend a single honest measurement methodology Public should adopt. | No single phase compared all 5 claims under one rubric. |
| **Q-B** | **Capability matrix.** Score each system against a unified rubric — code AST coverage, multimodal support, structural query, semantic query, memory/continuity, observability, hook integration, license compatibility, runtime portability. Identify the dominant system per capability and the gaps **no system** fills. | Requires uniform rubric across all 5. |
| **Q-C** | **Architecture composition study.** Public has CocoIndex (semantic) + Code Graph MCP (structural) + Spec Kit Memory (continuity) — three split-but-typed surfaces. Of the patterns the 5 phases proposed for adoption, which **compose cleanly** with Public's split, and which assume a monolithic surface that would force a redesign? Mark each Adopt/Adapt/Reject candidate with composition risk (low/med/high). | First-pass evaluated each system in isolation against Public; never against Public's *split topology*. |
| **Q-D** | **Adoption sequencing.** Across all 5 phases, dependencies exist (e.g., 001's hook recommendations need 005's auditor/parser; 003's pointer benchmark needs 002's static structure; 004's evidence tagging needs schema work in Code Graph). Produce a topologically-sorted adoption roadmap with explicit dependency edges. | Dependency edges live across phase boundaries. |
| **Q-E** | **License + runtime feasibility.** AGPL (Contextador), Python (Graphify), Bun runtime boundary (Contextador), Node CLI (CodeSight) — categorize each candidate as **concept-transfer-only** vs **source-portable** with a one-line legal/runtime rationale. | First-pass treated license per-system, never built a unified gating table. |
| **Q-F** | **Killer-combo analysis.** Are there pairwise or triple combinations across the 5 systems that yield more value than any single adoption? (e.g., Graphify's confidence vocabulary + Claudest's FTS cascade + CodeSight's per-tool projections.) Surface the top 3 combos with rationale and effort estimate. | Requires reasoning across all 5 simultaneously. |

---

## 3. ACTION

### 3.1 Iteration plan (target 8–12 iterations; convergence may short-circuit)

Each iteration runs as a fresh `cli-codex --model gpt-5.4 --reasoning-effort high` process under **Fast mode** with parallel/background dispatch where the iteration shape allows. State is externalized between iterations.

**Iteration 1 — First-pass ingestion.**
Read these 15 files (NOT the `external/` repos):
- `<PARENT>/001-claude-optimization-settings/{research/research.md, decision-record.md, implementation-summary.md}`
- `<PARENT>/002-codesight/{research/research.md, decision-record.md, implementation-summary.md}`
- `<PARENT>/003-contextador/{research/research.md, decision-record.md, implementation-summary.md}`
- `<PARENT>/004-graphify/{research/research.md, decision-record.md, implementation-summary.md}`
- `<PARENT>/005-claudest/{research/research.md, decision-record.md, implementation-summary.md}`

Emit a `phase-1-inventory.json` listing: every named finding (F-id / K-id / etc.), its source phase, its confidence, and its recommendation tag if present. This is the deduplication baseline for iterations 2+.

**Iterations 2–3 — Gap closure (per phase).**
Each gap from §2.3 becomes a tracked question in `deep-research-state.jsonl`. For each gap, attempt closure in this order:
1. Re-read the phase's `research.md` and supporting docs for previously-overlooked evidence.
2. Open the relevant `<PARENT>/<phase>/external/` source files cited in first-pass evidence.
3. If still unresolved after 2 attempts, mark **`UNKNOWN`** with a precise reason (don't fabricate).

**Iterations 4–6 — Cross-phase synthesis.**
Tackle Q-A through Q-F in this order: Q-B (capability matrix; foundational) → Q-A (token honesty; cites the matrix) → Q-E (license/runtime gating) → Q-C (composition risk) → Q-D (sequencing) → Q-F (combos). Each question must be answered with citations and produce a section in `research.md`.

**Iterations 7–8 — Deliverable assembly.**
Render `research.md`, `findings-registry.json`, `recommendations.md`, `cross-phase-matrix.md` per the format spec in §4. Re-run citation validation: every claim must have `[SOURCE: <file>:<line>]` evidence.

**Iterations 9–12 (optional, conditional on convergence).**
Reserved for skeptical-amendment passes, additional gap closure, or user-extension lane. Each iteration must measurably reduce the open-question set or be terminated.

### 3.2 Convergence criteria (terminate when any holds)

1. **Composite-converged short-circuit:** composite_score ≥ 0.85 AND newInfoRatio < 0.15 over a 2-iteration sliding window.
2. **Question coverage:** all 6 cross-phase questions (Q-A … Q-F) answered with cited evidence AND every gap from §2.3 marked `closed | partially-closed | UNKNOWN-with-reason`.
3. **Hard ceiling:** 12 iterations.

### 3.3 Anti-patterns — DO NOT

- **Do not** redo first-pass research. Verbatim duplication of phase-1 findings is forbidden.
- **Do not** open `<phase>/external/` repos in iteration 1. Phase-1 docs first; external second; only when phase-1 evidence is insufficient or contradicted.
- **Do not** introduce findings without `[SOURCE: <file>:<line>]` evidence.
- **Do not** expand scope to topics outside the 5 phases (no general MCP research, no unrelated tools).
- **Do not** emit vague themes ("better observability would help"); every finding must be concrete and falsifiable.
- **Do not** fall back to `claude-opus-direct` without logging a degradation event in `deep-research-state.jsonl` with a reason. `cli-codex gpt-5.4 high` is the mandated runtime.
- **Do not** dispatch sub-agents (LEAF-only constraint). Reducer logic between iterations is permitted.

### 3.4 Finding-tag taxonomy (every finding MUST carry exactly one tag)

| Tag | Meaning |
|---|---|
| `phase-1-confirmed` | Phase-1 finding re-verified against new source/evidence with no change |
| `phase-1-extended` | Phase-1 finding extended with new evidence or a new dimension |
| `phase-1-corrected` | Phase-1 finding contradicted or amended; cite both old and new evidence |
| `new-cross-phase` | Finding that emerged only from comparing 2+ phases |

### 3.5 Citation grammar (mandatory format)

```
[SOURCE: <absolute-or-PARENT-relative-path>:<start-line>-<end-line>]            # external/source files
[SOURCE: phase-<N>/<file>:<start-line>-<end-line>]                              # first-pass docs (phase number REQUIRED)
```

Examples:
```
[SOURCE: phase-2/research/research.md:412-418]
[SOURCE: 002-codesight/external/src/detectors/tokens.ts:88-104]
[SOURCE: phase-4/decision-record.md:201-209]
```

---

## 4. FORMAT — Required deliverables (all under `<PARENT>/research/`)

### 4.1 `research.md` — master synthesis (the primary artifact)

Must contain these 11 sections, in this order, with these exact headers:

1. **Executive summary** — 5–8 bullets; the headline answer to "what should Public do next?"
2. **The 5 systems in one paragraph each** — 4–6 sentences each; current state, key strength, key weakness.
3. **Token-honesty audit table (Q-A)** — columns: System | Claimed reduction | Measurement method | Evidence quality (high/med/low/none) | Falsification test | Recommended Public methodology.
4. **Capability matrix (Q-B)** — see §4.4.
5. **Cross-phase findings** — one subsection per question Q-A through Q-F with answer + evidence + confidence.
6. **Per-phase gap closure log** — for each gap in §2.3: status (`closed | partial | UNKNOWN`), evidence, reasoning if UNKNOWN.
7. **Composition risk analysis (Q-C)** — every adopt/adapt candidate tagged low/med/high composition risk against Public's split topology.
8. **Adoption roadmap with dependency graph (Q-D)** — topologically-sorted ordered list with explicit `depends-on:` edges. Optionally render an ASCII Mermaid-style graph.
9. **License + runtime feasibility (Q-E)** — table: Candidate | License | Runtime | concept-transfer / source-portable | Rationale.
10. **Killer-combo analysis (Q-F)** — top 3 combos; for each: components, value-add hypothesis, evidence, est. effort (S/M/L), prerequisites.
11. **Confidence statement + open questions** — overall confidence score; remaining UNKNOWNs and what would close each.

### 4.2 `findings-registry.json` — consolidated registry

Schema (one finding per object in a top-level `findings` array):

```json
{
  "findings": [
    {
      "id": "F-CROSS-001",
      "title": "string, ≤100 chars",
      "tag": "phase-1-confirmed | phase-1-extended | phase-1-corrected | new-cross-phase",
      "source_phase": 1,
      "evidence": [
        {"file": "phase-2/research/research.md", "lines": "412-418", "quote": "optional ≤200 chars"}
      ],
      "confidence": 0.0,
      "composition_risk": "low | med | high",
      "license_compatibility": "concept-transfer-only | source-portable",
      "recommendation": "adopt | adapt | reject | defer",
      "depends_on": ["F-CROSS-007"],
      "rationale": "1-2 sentences"
    }
  ]
}
```

`source_phase` is `1`–`5` for single-phase findings or the string `"cross"` for cross-phase findings.

### 4.3 `recommendations.md` — top 10 ranked recommendations

For each recommendation:
- **Title** (imperative voice, ≤80 chars)
- **Rank + score** (1–10 with justification)
- **Rationale** (1–2 sentences)
- **Evidence pointers** (finding IDs from `findings-registry.json`)
- **Dependency edges** (other recommendation IDs)
- **Estimated effort** (S / M / L)
- **Measurable acceptance criterion** (one line, testable)

### 4.4 `cross-phase-matrix.md` — capability rubric × 6 columns

Markdown table:

```
| Capability                  | 001 Settings | 002 CodeSight | 003 Contextador | 004 Graphify | 005 Claudest | Public (baseline) | Dominant |
|-----------------------------|--------------|---------------|-----------------|--------------|--------------|-------------------|----------|
| Code AST coverage           | …            | …             | …               | …            | …            | …                 | …        |
| Multimodal support          | …            | …             | …               | …            | …            | …                 | …        |
| Structural query            | …            | …             | …               | …            | …            | …                 | …        |
| Semantic query              | …            | …             | …               | …            | …            | …                 | …        |
| Memory / continuity         | …            | …             | …               | …            | …            | …                 | …        |
| Observability               | …            | …             | …               | …            | …            | …                 | …        |
| Hook integration            | …            | …             | …               | …            | …            | …                 | …        |
| License compatibility       | …            | …             | …               | …            | …            | …                 | …        |
| Runtime portability         | …            | …             | …               | …            | …            | …                 | …        |
```

Score scale: `0 = absent`, `1 = partial`, `2 = full`, `–` = N/A. Add a footer listing capabilities **no system fills** (Public's true gaps).

### 4.5 Standard externalized state files

Per `/spec_kit:deep-research` conventions:
- `<PARENT>/research/deep-research-state.jsonl`
- `<PARENT>/research/deep-research-strategy.md`
- `<PARENT>/research/deep-research-dashboard.md`
- `<PARENT>/research/deep-research-config.json`

### 4.6 Memory save (final step, post-convergence)

Compose structured JSON and save via:
```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '<JSON-payload>' \
  system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems
```
The memory must summarize: which gaps closed, which cross-phase questions answered, top 3 recommendations, residual UNKNOWNs.

---

## 5. PRE-CONVERGENCE CHECKLIST (verify ALL before declaring done)

- [ ] All 5 phase docs ingested in iteration 1; `phase-1-inventory.json` written
- [ ] Every gap in §2.3 has status `closed | partial | UNKNOWN-with-reason`
- [ ] Q-A token-honesty audit table populated for all 5 systems with falsification tests
- [ ] Q-B capability matrix populated for all 9 capability rows + Public baseline column + dominant column
- [ ] Q-C composition risk tagged for every adopt/adapt candidate
- [ ] Q-D adoption roadmap rendered as topologically-sorted list with dependency edges
- [ ] Q-E license/runtime table populated for all candidates
- [ ] Q-F top 3 killer combos identified with effort estimates
- [ ] Every finding in `findings-registry.json` carries exactly one tag from §3.4
- [ ] Every claim in `research.md` traces to at least one `[SOURCE: …]` citation
- [ ] No verbatim phase-1 finding duplicated (deduplication verified against `phase-1-inventory.json`)
- [ ] All 4 markdown deliverables + state files exist under `<PARENT>/research/`
- [ ] Memory saved via `generate-context.js` referencing the parent spec folder
- [ ] `deep-research-dashboard.md` shows composite_score ≥ 0.85 OR convergence-by-question-coverage flag is set

---

## 6. EXECUTION KICKOFF

Begin **iteration 1** now. Dispatch `cli-codex --model gpt-5.4 --reasoning-effort high` in **Fast mode**. First action: read the 15 phase-1 docs listed in §3.1 and write `phase-1-inventory.json` to `<PARENT>/research/`. Then write the initial `deep-research-strategy.md` with the iteration plan from §3.1 and the 6 cross-phase questions as tracked items in `deep-research-state.jsonl`. Hand off to the next iteration.

**Build upon the existing work in a smart way. Do not redo it.**
