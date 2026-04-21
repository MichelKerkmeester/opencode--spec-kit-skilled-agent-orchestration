# ITERATION 5 — Q-A Token-savings honesty audit (cross-phase synthesis #2)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 5 of 12 max**.

This iteration audits the **token-reduction claims** made by all 5 systems and recommends a **single honest measurement methodology** Public should adopt. Per charter §3.1, this iteration follows Q-B (capability matrix, done in iter-4) and feeds Q-E/Q-C (license + composition).

## Charter (read fully first)

`scratch/deep-research-prompt-master-consolidation.md`

## Folder layout

```
research/
├── deep-research-{config.json, state.jsonl, strategy.md, dashboard.md}  # state (root)
├── phase-1-inventory.json                                                # foundation (root)
├── cross-phase-matrix.md                                                 # ← iter-4 deliverable (root, READ THIS)
├── iterations/                                                           # per-iter outputs
│   ├── iteration-{1,2,3,4}.md
│   ├── gap-closure-phases-{1-2, 3-4-5}.json
│   └── (iter-5 outputs land here)
└── (final deliverables — root in iter 8+)
    ├── research.md
    ├── findings-registry.json
    └── recommendations.md
```

## Prior iteration outputs (READ before starting)

- `research/cross-phase-matrix.md` — **the foundational input**. The matrix's "semantic query", "structural query", and "observability" rows tell you which systems actually reduce search cost vs reframe it.
- `research/iterations/iteration-4.md` — iter-4 surprises + handoff (reads "Iteration 5 should reuse the matrix rows for semantic, structural, observability first").
- `research/iterations/gap-closure-phases-1-2.json` — already has G2.T11 (the 11.2× empirical-validation gap).
- `research/iterations/gap-closure-phases-3-4-5.json` — already has G3.T93 (93% benchmark) and G4.T715 (71.5× grounding) closures.
- `research/phase-1-inventory.json` — full ID grammar.

You may quote those iter-2/3 closures DIRECTLY since they already contain source-grounded evidence about the token math.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set here. **Permission:** read all 5 phase folders + `external/` subfolders + Public's `.opencode/` for Public-side measurement infrastructure (e.g., token counting in CocoIndex, code-graph result sizes, memory observability dashboards).

---

## Iteration 5 mission: The 5-system Token-Savings Honesty Audit (Q-A)

Per charter §2.4 Q-A and §4.1 §3: build **ONE** comparison table over all 5 systems' token-reduction claims, plus a **recommended measurement methodology** Public should adopt.

### The 5 claims to audit

| System | Headline claim | Already-known evidence quality (from iters 2-3) |
|---|---|---|
| 001 Settings | "Reddit reports 264M tokens / 858 sessions / 18,903 turns" + `ENABLE_TOOL_SEARCH` removes ~5,400 tokens/turn | Reddit-source primary; `ENABLE_TOOL_SEARCH` token claim verified, ergonomics never measured (G1.Q2 partial, G1.RM closed) |
| 002 CodeSight | **11.2× token reduction** | Hand-tuned formula with constants (route=400, schema=300, etc.); no `eval.ts` coverage (G2.T11 partial) |
| 003 Contextador | **93% token reduction** | Synthetic constant `AVG_MANUAL_EXPLORATION_TOKENS = 25000`; no benchmark vs Public's typed stack (G3.T93 partial) |
| 004 Graphify | **71.5× token reduction** | 4-chars/token heuristic + naive baseline; no Anthropic `count_tokens` grounding (G4.T715 partial) |
| 005 Claudest | (no headline ratio; Stop-time `context_summary` is the savings vector) | Producer drops cache-token fields; turn-level offsets missing (G5.SH closed) |

### What "honesty" means here

For each claim, evaluate on 5 dimensions:

1. **Measurement method** — formula constant / heuristic / fixed denominator / model-counted / other?
2. **Evidence quality** — `none / low / med / high` (high = real model token counts on real corpus; low = synthetic constant)
3. **What would falsify it?** — what experiment would prove the claim wrong if executed today?
4. **Comparability across systems** — are the 5 figures even on the same scale (per-task / per-turn / per-session / per-corpus)?
5. **Recommended Public methodology** — what should Public actually adopt to measure token savings honestly across CocoIndex + Code Graph + Spec Kit Memory?

---

## Output 1 — `research/iterations/q-a-token-honesty.md` (the main deliverable for this iter)

This file IS the source-of-truth for `research.md` §3 (which iter-8 will assemble). Make it self-contained.

```markdown
# Q-A — Token-Savings Honesty Audit

> Iteration 5 of master consolidation. Cross-phase synthesis #2 of 6.
> Cites the iter-4 capability matrix and the iter-2/3 gap closures.

## TL;DR (≤8 bullets)
- (one-line per system + one-line on "what Public should adopt instead")

## The audit table

| System | Claimed reduction | Measurement method | Evidence quality | Falsification test | Comparability |
|---|---|---|---|---|---|
| 001 Claude Optimization Settings | … | … | low/med/high | … | per-turn |
| 002 CodeSight | 11.2× | formula constant | low | … | per-task |
| 003 Contextador | 93% | synthetic denominator | low | … | per-session |
| 004 Graphify | 71.5× | char-heuristic | low | … | per-corpus |
| 005 Claudest | n/a | producer-side savings | n/a | … | per-stop |

(Add a "Public (baseline today)" row showing what Public currently reports — if anything.)

## Per-system deep dive

### 001 Claude Optimization Settings — `ENABLE_TOOL_SEARCH` token claim
**Claim:** …
**Method:** …
**Evidence:** [SOURCE: ...] [SOURCE: ...]
**Honesty score (low/med/high):** …
**What would falsify:** …
**Public-relevant takeaway:** …

(repeat for 002, 003, 004, 005)

## The comparability problem

Why these 5 figures are NOT comparable as-is. Be specific:
- "11.2×" measures … but "93%" measures …
- Per-task vs per-turn vs per-session denominator drift
- What honest cross-system comparison requires

## Recommended Public measurement methodology

The single honest methodology Public should adopt (≤500 words):

1. **What to measure** — token in/out per query/task/session, plus answer quality
2. **How to measure** — instrumentation hooks (cite Public's existing observability — see iter-4 matrix row 6)
3. **Baseline corpus** — fixed task set + fixed query set
4. **Reporting format** — what dashboards / metrics to publish
5. **Falsifiability** — what observed result would invalidate the methodology itself

## Public's measurement gaps today

What Public currently lacks for honest token-savings reporting (cite `.opencode/` source files where applicable). Be specific and actionable.

## Confidence + caveats
- Overall confidence in this audit: high/med/low
- Items left UNKNOWN
```

---

## Output 2 — `research/iterations/iteration-5.md` (≤300 lines)

```markdown
# Iteration 5 — Q-A Token honesty audit

## Method
- Reused: cross-phase-matrix.md, gap-closure-phases-{1-2,3-4-5}.json
- New external reads: …

## Audit summary
| System | Honesty score | Falsifiability ready |

## Surprises
- ≤6 bullet observations (e.g. "002 and 004's per-corpus formulas are not comparable to 003's per-session formula")

## Handoff to iteration 6 (Q-E + Q-C)
- Which audit rows feed which downstream question
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":5,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"q_a_token_honesty","systems_audited":5,"low_honesty":<int>,"med_honesty":<int>,"high_honesty":<int>,"recommended_method_specified":true,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_5_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_5_COMPLETE audited=5 low=<n> med=<n> high=<n> public_method=specified
```

---

## Constraints

- **LEAF-only** — no sub-agent dispatch
- Do NOT create or modify `research.md` — that's iter-8's job. Iter-5's table will become research.md §3 later.
- Do NOT re-attempt earlier gap closures — quote them by ID (e.g. `[G2.T11]`)
- Do NOT modify `cross-phase-matrix.md`
- Per-iter outputs in `research/iterations/`; state line in `research/` root
- Every claim must trace to at least one `[SOURCE: …]` citation
- For Public's measurement methodology recommendation: cite Public's existing observability infrastructure if it exists (CocoIndex stats, code-graph metrics, Spec Kit Memory dashboards). Do NOT invent capabilities Public doesn't have.
- Honesty score rubric:
  - `high`: real model token counts on a fixed real corpus
  - `med`: real model token counts but synthetic baseline / corpus
  - `low`: heuristic denominators or formula constants throughout
  - `none`: no measurement attempted

## When done

Exit. Do NOT start iteration 6. Claude orchestrator will validate and dispatch iteration 6 (Q-E License/runtime + Q-C Composition risk, combined).
