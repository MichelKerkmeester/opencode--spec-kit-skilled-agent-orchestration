# ITERATION 6 — Q-E License/Runtime + Q-C Composition Risk (combined)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 6 of 12 max**.

This iteration combines **Q-E** (license + runtime feasibility — gating filter) with **Q-C** (architecture composition risk vs Public's split topology). They pair naturally because Q-E filters which candidates are even *legally/technically* portable, and Q-C asks whether the survivors *compose cleanly*. Per charter §3.1, both must be answered before Q-D (sequencing) and Q-F (combos).

## Charter (read fully first)

`scratch/deep-research-prompt-master-consolidation.md`

## Folder layout

```
research/
├── deep-research-{config.json, state.jsonl, strategy.md, dashboard.md}  # state (root)
├── phase-1-inventory.json                                                # foundation (root)
├── cross-phase-matrix.md                                                 # iter-4 deliverable (READ)
├── iterations/
│   ├── iteration-{1,2,3,4,5}.md
│   ├── gap-closure-phases-{1-2, 3-4-5}.json
│   ├── q-a-token-honesty.md                                              # iter-5 deliverable (READ)
│   └── (iter-6 outputs land here)
└── (final deliverables — root in iter 8+)
```

## Prior iteration outputs to READ before starting

- `research/cross-phase-matrix.md` — capability matrix; row 8 ("License compatibility") and row 9 ("Runtime portability") are direct inputs to Q-E.
- `research/iterations/q-a-token-honesty.md` — Q-A audit. You'll cite its conclusions when scoring Q-C composition risk (e.g., a system whose savings are unmeasurable composes badly).
- `research/iterations/iteration-{2,3}.md` + `gap-closure-phases-{1-2,3-4-5}.json` — every gap closure has tag-hint info that names adopt/adapt candidates.
- `research/phase-1-inventory.json` — finds the 98 recommendations (the candidate pool for Q-C).

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set here. **Permission:** read all 5 phase folders + `external/` subfolders + Public's `.opencode/` for Public's split topology evidence.

---

## Iteration 6 mission, part A — Q-E License + Runtime Feasibility

Per charter §2.4 Q-E and §4.1 §9: build a unified license/runtime gating table that categorizes each system as **`concept-transfer-only`** vs **`source-portable`**.

### What to determine for each system

For each of the 5 systems + every individual candidate worth adopting (adopt/adapt-tagged items from phase-1-inventory + iter-2/3 closures):

| Field | What it means |
|---|---|
| License | MIT / Apache-2 / AGPL / BSD / proprietary / unclear (cite the LICENSE file) |
| Runtime | Node ≥X / Bun / Python ≥X / Rust / OpenCode hook / etc. (cite the package manifest or main entry) |
| Public's existing runtime | Does Public already have this runtime in `.opencode/`? |
| Verdict | `source-portable` (license + runtime allow direct copy/fork) vs `concept-transfer-only` (only ideas, not code) vs `mixed` (some pieces source-portable, others not) |
| Rationale | one sentence explaining the verdict |

Pay attention to **AGPL** specifically (Contextador) — that's a copyleft trap for Public. Note all AGPL implications.

---

## Iteration 6 mission, part B — Q-C Composition Risk vs Public's split topology

Per charter §2.4 Q-C and §4.1 §7: every adopt/adapt candidate from phases 2/3/4/5 (skip phase 1 since it's a research audit, not adoptable code) must be tagged with **composition risk** against Public's split-but-typed topology:

- **CocoIndex** (semantic query)
- **Code Graph MCP** (structural query)
- **Spec Kit Memory** (continuity)

### Composition risk rubric

| Risk | Definition |
|---|---|
| **low** | Candidate slots cleanly into ONE of Public's existing surfaces with no surface-overlap and no schema conflict. Example: a measurement utility that reads existing telemetry. |
| **med** | Candidate requires modifying ONE surface or adding a small adapter, but doesn't conflict with the other two. Example: a new index type added to CocoIndex. |
| **high** | Candidate assumes a monolithic context surface and would force restructuring 2+ Public surfaces, OR conflicts with Public's split-by-type design philosophy. Example: a single MCP that owns semantic+structural+memory in one DB. |

### Candidate pool

Restrict to candidates that survive Q-E gating (i.e. candidates that are at least `concept-transfer-only` or `source-portable`). For each surviving candidate:

- **Candidate name** + originating phase
- **What it does** (one sentence)
- **Composition risk** (low/med/high)
- **Which Public surface(s) it touches** (CocoIndex / Code Graph / Spec Kit Memory / new surface)
- **Conflict detection** (does it overlap an existing surface? does it require a schema change?)
- **Rationale** for the risk score

Aim for **15-30 candidates** total. Don't enumerate every recommendation in the inventory — prioritize the ones that materially shift Public's stack.

---

## Output 1 — `research/iterations/q-e-license-runtime.md`

```markdown
# Q-E — License + Runtime Feasibility

> Iteration 6 of master consolidation. Cross-phase synthesis #3 of 6.

## TL;DR
- (one bullet per system + a "concept-transfer-only count vs source-portable count" line)

## System-level gating table

| System | License | Runtime | Public has runtime? | Verdict | Rationale |
|---|---|---|---|---|---|
| 001 Claude Optimization Settings | n/a (Reddit field report) | n/a | n/a | concept-transfer-only | … |
| 002 CodeSight | … | Node CLI | yes | … | … |
| 003 Contextador | AGPL | Bun MCP | partial | concept-transfer-only | AGPL viral copyleft … |
| 004 Graphify | … | Python skill | … | … | … |
| 005 Claudest | … | Node MCP | yes | … | … |

## Per-system rationale (deeper)

### 001 Settings
… [SOURCE: …] [SOURCE: …]

(repeat for 002, 003, 004, 005)

## AGPL implications for Contextador

A dedicated subsection. AGPL is a copyleft trap: even *concept-transfer* must be careful not to import test fixtures, type signatures, or API shapes from the source. Be specific.

## Candidate-level gating addendum

If any individual candidate (e.g. "Graphify's Leiden clustering") has a different verdict than its parent system (e.g. it's actually permissively licensed via a third-party lib), list the exceptions here.
```

---

## Output 2 — `research/iterations/q-c-composition-risk.md`

```markdown
# Q-C — Composition Risk vs Public's Split Topology

> Iteration 6 of master consolidation. Cross-phase synthesis #4 of 6.

## Public's split topology (recap)
- **CocoIndex** = semantic query (vector embeddings)
- **Code Graph MCP** = structural query (typed AST handlers)
- **Spec Kit Memory** = continuity (memory + observability)
- (anything else?)

## TL;DR
- (low/med/high counts; biggest risk; safest fast wins)

## Candidate composition table

| # | Candidate | Phase | Q-E verdict | Surface(s) touched | Composition risk | Conflict notes |
|---|-----------|-------|-------------|---------------------|------------------|----------------|
| 1 | … | 002 | source-portable | CocoIndex | low | … |
| 2 | … | 003 | concept-transfer | Code Graph | med | schema add for confidence vocabulary |
| … | (15-30 candidates) |

## Per-candidate rationale (top 10)

### Candidate 1 — …
**Phase:** …
**Q-E verdict:** …
**Risk:** low/med/high
**Touches:** …
**Conflict:** …
**Why this risk score:** [SOURCE: …]

(top 10 only — the rest are in the table)

## High-risk candidates (full list, even if not in top 10)

The candidates that would force restructuring 2+ Public surfaces. Each gets a one-paragraph "what would it cost" estimate.

## Risk distribution

| Phase | Low risk | Med risk | High risk | Excluded by Q-E |
|---|---|---|---|---|
| 002 CodeSight | … | … | … | … |
| 003 Contextador | … | … | … | … |
| 004 Graphify | … | … | … | … |
| 005 Claudest | … | … | … | … |
```

---

## Output 3 — `research/iterations/iteration-6.md` (≤500 lines)

```markdown
# Iteration 6 — Q-E + Q-C combined

## Method
- Inputs: cross-phase-matrix.md, q-a-token-honesty.md, gap-closure-phases-*.json
- New external reads: license files at … + manifest files at …
- Public surface evidence read from: …

## Q-E summary
| System | Verdict |

## Q-C summary
| Risk | Count |

## Surprises
- ≤6 bullets. Top candidates for "looks adoptable but actually concept-only" or "looks dangerous but is actually low-risk"

## Handoff to iteration 7 (Q-D + Q-F)
- Which low-risk + source-portable candidates feed Q-D's sequencing
- Which combinations look like Q-F killer combo material
```

---

## Output 4 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":6,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"q_e_license_runtime_plus_q_c_composition","systems_gated":5,"source_portable":<int>,"concept_only":<int>,"mixed":<int>,"candidates_scored":<int>,"low_risk":<int>,"med_risk":<int>,"high_risk":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_6_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_6_COMPLETE qe=portable:<n>/concept:<n>/mixed:<n> qc=low:<n>/med:<n>/high:<n>/candidates:<n>
```

---

## Constraints

- **LEAF-only** — no sub-agent dispatch
- Do NOT modify earlier deliverables (cross-phase-matrix.md, q-a-token-honesty.md)
- Do NOT modify any phase folder
- Output files in `research/iterations/`; state line in `research/` root
- Every license claim must cite the actual LICENSE file (or note its absence)
- Every runtime claim must cite the package manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.)
- Every composition risk score must cite either:
  - The candidate's source description (in phase-1 inventory or gap-closure JSON), AND
  - Public's surface evidence (in `.opencode/skill/...` files)
- For Public surfaces: cite specific handler/schema files when claiming a surface owns a capability
- Do NOT score candidates that don't survive Q-E gating (skip them in Q-C; note "excluded by Q-E")
- 15-30 candidates is the target; don't enumerate all 98 recommendations from the inventory
- If you find a license file is genuinely missing, mark `unclear` with the absent-file path and proceed

## When done

Exit. Do NOT start iteration 7. Claude orchestrator will validate and dispatch iteration 7 (Q-D Adoption sequencing + Q-F Killer combos, combined).
