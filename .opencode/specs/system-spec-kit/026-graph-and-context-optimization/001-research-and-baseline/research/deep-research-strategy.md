# Deep Research Strategy — Master Consolidation (Phase 2)

> **Charter:** `<PARENT>/scratch/deep-research-prompt-master-consolidation.md` (full RCAF prompt, CLEAR 44/50)
> **Orchestrator:** Claude Opus 4.6 (this session)
> **Worker:** `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --full-auto`
> **Mode:** AUTONOMOUS / Fast (parallel/background dispatch where iteration shape allows)
> **Target:** 8–18 iterations (18 hard ceiling — extended from 12 after iter-8 convergence; iters 9-18 are rigor + amendment lane)

---

## Folder layout

```
research/
├── deep-research-config.json     # orchestrator state
├── deep-research-state.jsonl     # orchestrator state (append-only)
├── deep-research-strategy.md     # this file
├── deep-research-dashboard.md    # progress snapshot
├── phase-1-inventory.json        # foundation baseline (iter 1, do not modify)
├── iterations/                   # all per-iteration outputs
│   ├── iteration-N.md
│   └── (per-iter intermediate JSON, e.g. gap-closure-*.json)
└── (final deliverables — added in iter 8+)
    ├── research.md
    ├── findings-registry.json
    ├── recommendations.md
    └── cross-phase-matrix.md
```

**Rule:** state files in `research/` root, per-iteration outputs in `research/iterations/`, final deliverables in `research/` root.

---

## Mission

Build upon five completed first-pass research phases. **Do not redo** first-pass work. Ingest first-pass outputs → close gaps first-pass flagged → perform cross-phase synthesis → ship one consolidated master research package under `<PARENT>/research/`.

---

## Iteration plan

| # | Title | Status | Outputs |
|---|---|---|---|
| 1 | First-pass ingestion (15 phase-1 docs) | pending | `phase-1-inventory.json` |
| 2 | Gap closure — phases 1+2 | pending | state updates, evidence-cited gap notes |
| 3 | Gap closure — phases 3+4+5 | pending | state updates, evidence-cited gap notes |
| 4 | Q-B Capability matrix (foundational) | pending | `cross-phase-matrix.md` (draft) |
| 5 | Q-A Token-honesty audit | pending | research.md §3 token-honesty table |
| 6 | Q-E License/runtime + Q-C composition risk | pending | research.md §7 + §9 |
| 7 | Q-D Adoption sequencing + Q-F killer combos | pending | research.md §8 + §10 |
| 8 | Deliverable assembly + citation validation | pending | `research.md`, `findings-registry.json`, `recommendations.md` |
| 9 | Skeptical review pass (critique all 4 final deliverables) | pending | iterations/iteration-9-skeptical-review.md |
| 10 | Re-attempt 2 UNKNOWN + 8 PARTIAL gaps with deeper external dives | pending | iterations/iteration-10-gap-reattempt.md |
| 11 | Citation-accuracy verification (top 30 findings) | pending | iterations/iteration-11-citation-audit.md |
| 12 | Killer-combo stress-test (try to falsify all 3 combos) | pending | iterations/iteration-12-combo-stress.md |
| 13 | Public's existing infrastructure deep-inventory | pending | iterations/iteration-13-public-inventory.md |
| 14 | Adoption-cost reality check (effort estimates against Public's actual code) | pending | iterations/iteration-14-cost-reality.md |
| 15 | New cross-phase patterns hunt (3+ phase spans missed by iters 4-7) | pending | iterations/iteration-15-pattern-hunt.md |
| 16 | Counter-evidence search for top 10 recommendations | pending | iterations/iteration-16-counter-evidence.md |
| 17 | Re-render research-v2.md + findings-registry-v2.json + recommendations-v2.md | pending | research-v2.md, findings-registry-v2.json, recommendations-v2.md (root) |
| 18 | Final validation + handover memory save v2 | pending | iterations/iteration-18-final-validation.md + memory/ |

---

## Cross-phase questions (tracked)

| ID | Question | Status |
|---|---|---|
| Q-A | Token-savings honesty audit across all 5 systems | open |
| Q-B | Capability matrix vs unified rubric (9 capabilities) | open |
| Q-C | Architecture composition study vs Public's split topology | open |
| Q-D | Adoption sequencing + dependency graph | open |
| Q-E | License + runtime feasibility per candidate | open |
| Q-F | Killer-combo analysis (top 3) | open |

---

## First-pass exit gaps (per charter §2.3)

### Phase 001 — Claude Optimization Settings
- [ ] Q2 first-tool-latency / discoverability impact of `ENABLE_TOOL_SEARCH=true`
- [ ] Q8 edit-retry root-cause attribution (31 chains) across prompt/workflow/guardrail
- [ ] Q9 net-cost audit of `/clear` + plugin-memory bundle
- [ ] Reddit-post arithmetic reconciliation (264M tokens; 858 vs 926 sessions; 18,903 vs 11,357 turns)
- [ ] Cross-phase: phase 005 auditor/parser ↔ F14–F17 expectations from phase 001

### Phase 002 — CodeSight
- [ ] 11.2× token claim — empirical validation vs real Claude/GPT counts
- [ ] tRPC / Fastify zero contract enrichment despite AST routing — gap or deliberate?
- [ ] Go regex+brace tracking labeled `confidence: "ast"` — mislabel or pending?
- [ ] Monorepo parity — turbo/nx/lerna untested (silent data loss?)
- [ ] Blast-radius BFS off-by-one + model-impact heuristic false-positive rate

### Phase 003 — Contextador
- [ ] 93% reduction = `AVG_MANUAL_EXPLORATION_TOKENS = 25000` synthetic constant; needs pointer-quality benchmark
- [ ] Mainframe room privacy weakness (`preset: "public_chat"` vs `visibility: "private"`); plaintext creds
- [ ] Multi-agent contention on Matrix room-state writes
- [ ] GitHub automation: webhook idempotency, secret rotation, error notification
- [ ] Repair-queue completion guarantees post-regeneration

### Phase 004 — Graphify
- [ ] 71.5× reduction needs `count_tokens` grounding
- [ ] Cache: orphan GC, mtime-only invalidation, no tombstones
- [ ] Cross-language extraction parity: Python 3× vs other 11 languages capped; Swift detected but never extracted
- [ ] AST INFERRED edges flat 0.5 vs semantic INFERRED 0.4–0.9 — ranking impact?
- [ ] Mixed-corpus README claims multimodal; `GRAPH_REPORT.md` shows code-only / 0 token spend
- [ ] PreToolUse `Glob|Grep` nudge effectiveness — never measured

### Phase 005 — Claudest
- [ ] Phase 1 never opened `mcp_server/lib/search/sqlite-fts.ts` — verify FTS4 + PRAGMA probe
- [ ] Stop hook: `transcript_path` not persisted, drops cache-token fields, no turn-level offsets — Brief B blocked
- [ ] Per-plugin `CLAUDE.md` reconstructed indirectly from README/skill — needs direct file inspection
- [ ] Docstring/implementation drift in `_build_fallback_context()`
- [ ] Whether `008-signal-extraction` packet embodies auditor/discoverer split or treats consolidation as monolithic

---

## Convergence criteria (terminate when any holds)

1. **Composite-converged:** composite_score ≥ 0.85 AND newInfoRatio < 0.15 over 2-iteration sliding window
2. **Question coverage:** Q-A through Q-F answered with cited evidence AND every gap above marked `closed | partial | UNKNOWN-with-reason`
3. **Hard ceiling:** 12 iterations

---

## Anti-patterns (DO NOT)

- Redo first-pass research; verbatim duplication of phase-1 findings is forbidden
- Open `<phase>/external/` in iteration 1; phase-1 docs first, external second
- Introduce findings without `[SOURCE: <file>:<line>]` evidence
- Expand scope beyond the 5 phases
- Emit vague themes; every finding must be concrete + falsifiable
- Fall back to claude-opus-direct without logging a degradation event in `deep-research-state.jsonl` with reason
- Dispatch sub-agents (LEAF-only)

---

## Finding-tag taxonomy (every finding carries exactly one)

- `phase-1-confirmed` — re-verified, no change
- `phase-1-extended` — extended with new evidence
- `phase-1-corrected` — contradicted/amended; cite both old and new
- `new-cross-phase` — emerged only from cross-comparison

---

## Memory + post-convergence

After convergence (or hard ceiling), orchestrator runs:
```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '<payload>' \
  system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems
```
Memory must summarize: gaps closed, cross-phase questions answered, top 3 recommendations, residual UNKNOWNs.
