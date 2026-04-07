# ITERATION 8 — FINAL ASSEMBLY (research.md + findings-registry.json + recommendations.md + citation validation)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 8 of 12 max**. This is the **final assembly** iteration.

**Convergence already satisfied** via charter §3.2 path 2 (all 6 cross-phase questions answered, all 26 gaps closed/partial/UNKNOWN). Composite score 0.94. This iteration ASSEMBLES the master deliverables from existing inputs — it should NOT introduce new analysis or new external reads.

## Charter (read fully first)

`scratch/deep-research-prompt-master-consolidation.md`

## Folder layout (READ all of these — this iteration is synthesis-only)

```
research/
├── deep-research-{config.json, state.jsonl, strategy.md, dashboard.md}  # state (root)
├── phase-1-inventory.json                                                # foundation (root)
├── cross-phase-matrix.md                                                 # ✅ iter-4 deliverable (Q-B)
├── iterations/
│   ├── iteration-{1,2,3,4,5,6,7}.md                                      # per-iter reports
│   ├── gap-closure-phases-1-2.json                                       # iter-2
│   ├── gap-closure-phases-3-4-5.json                                     # iter-3
│   ├── q-a-token-honesty.md                                              # iter-5 (Q-A)
│   ├── q-c-composition-risk.md                                           # iter-6 (Q-C)
│   ├── q-e-license-runtime.md                                            # iter-6 (Q-E)
│   ├── q-d-adoption-sequencing.md                                        # iter-7 (Q-D)
│   └── q-f-killer-combos.md                                              # iter-7 (Q-F)
└── (FINAL DELIVERABLES — iter-8 produces these in research/ ROOT)
    ├── research.md                                                        # ← this iter
    ├── findings-registry.json                                             # ← this iter
    └── recommendations.md                                                  # ← this iter
```

**READ ORDER (mandatory):**
1. `research/cross-phase-matrix.md`
2. `research/iterations/q-a-token-honesty.md`
3. `research/iterations/q-c-composition-risk.md`
4. `research/iterations/q-e-license-runtime.md`
5. `research/iterations/q-d-adoption-sequencing.md`
6. `research/iterations/q-f-killer-combos.md`
7. `research/iterations/gap-closure-phases-1-2.json` (skim for closed-gap evidence)
8. `research/iterations/gap-closure-phases-3-4-5.json` (skim for closed-gap evidence)
9. `research/phase-1-inventory.json` (use as inventory for findings-registry.json IDs)

You should NOT need to open any phase folder or external/ for this iteration. All evidence is in the iter-2 through iter-7 outputs.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set here.

---

## Output 1 — `research/research.md` — THE MASTER SYNTHESIS

Per charter §4.1, this file MUST contain these **11 sections in this exact order with these exact headers** (markdown `##` level):

```markdown
# Master Consolidation — External Systems Research (Phase 2)

> Second-pass deep-research synthesis of 5 first-pass packets. 8 iterations, composite 0.94, all 6 cross-phase questions answered. Built upon iter-2 to iter-7 outputs in `research/iterations/`.
> Charter: `scratch/deep-research-prompt-master-consolidation.md`

## 1. Executive summary
5–8 bullets. The headline answer to "what should Public do next?" Make every bullet actionable and measurable.

## 2. The 5 systems in one paragraph each
For each of 001 / 002 / 003 / 004 / 005:
- 4–6 sentences
- Current state, key strength, key weakness
- Cite phase-N research/research.md or implementation-summary.md

## 3. Token-honesty audit table (Q-A)
Embed the audit table from `research/iterations/q-a-token-honesty.md`. Columns: System | Claimed reduction | Measurement method | Evidence quality (high/med/low/none) | Falsification test | Recommended Public methodology.
Then a 2-paragraph synthesis citing `[SOURCE: research/iterations/q-a-token-honesty.md:LL-LL]`.

## 4. Capability matrix (Q-B)
Embed the 9×6 matrix from `research/cross-phase-matrix.md` (just the table; don't duplicate per-row rationale — link to it instead). Add a 3-bullet "what dominates" summary.

## 5. Cross-phase findings
One subsection per question Q-A through Q-F:
### 5.1 Q-A — Token-savings honesty
3-paragraph synthesis. Cite `research/iterations/q-a-token-honesty.md`.
### 5.2 Q-B — Capability matrix
2-paragraph synthesis. Cite `research/cross-phase-matrix.md`.
### 5.3 Q-C — Composition risk
3-paragraph synthesis. Cite `research/iterations/q-c-composition-risk.md`. Mention low/med/high counts.
### 5.4 Q-D — Adoption sequencing
2-paragraph synthesis + ASCII summary of P0/P1/P2/P3 phases. Cite `research/iterations/q-d-adoption-sequencing.md`.
### 5.5 Q-E — License + runtime
2-paragraph synthesis. AGPL trap callout. Cite `research/iterations/q-e-license-runtime.md`.
### 5.6 Q-F — Killer combos
3 combos summarized in a table (Title | Components | Score | Effort). Cite `research/iterations/q-f-killer-combos.md`.

## 6. Per-phase gap closure log
For each of the 26 gaps in charter §2.3:
| Gap ID | Status | Tag | Confidence | Evidence pointer (citation) |
Status = closed / partial / UNKNOWN. Sourced from iter-2 and iter-3 gap-closure JSON.

## 7. Composition risk analysis (Q-C)
Embed the candidate composition table from `research/iterations/q-c-composition-risk.md` (or its top 15). Add a 2-bullet "biggest risks vs safest fast wins" callout.

## 8. Adoption roadmap with dependency graph (Q-D)
Embed the P0/P1/P2/P3 sequenced list (without rerunning the analysis) and the dependency graph (ASCII or Mermaid) from `research/iterations/q-d-adoption-sequencing.md`. Add a 1-paragraph "first 5 things Public should do" summary.

## 9. License + runtime feasibility (Q-E)
Embed the system-level gating table from `research/iterations/q-e-license-runtime.md`. AGPL implications subsection. Per-candidate exceptions if any.

## 10. Killer-combo analysis (Q-F)
Embed all 3 combos with full schema (components / synergy / evidence / measurement / effort / prerequisites / risk / score). Cite `research/iterations/q-f-killer-combos.md`.

## 11. Confidence statement + open questions
- Overall confidence score (0.0–1.0) with justification
- Remaining UNKNOWNs (the 2 still-open gaps from §6 + any UNKNOWN cells in the matrix)
- For each UNKNOWN: what would close it (1 sentence)

## Appendix A — Iteration log
| Iter | Mission | Status | Composite | NewInfoRatio | Tokens |
|---|---|---|---|---|---|
(1 row per iter from deep-research-state.jsonl)

## Appendix B — Source map
A flat list of every iteration file + final deliverable + state file with a one-line description.
```

**Critical:**
- DO NOT duplicate content verbatim from iteration files. Synthesize. Reference iteration files for full detail using `[SOURCE: research/iterations/...]` citations.
- Every claim must trace to at least one `[SOURCE: ...]` citation.
- Tables can be embedded inline (they're already source-grounded in their origin file; just cite the origin).
- research.md should be **5,000–10,000 words** total. Substantial but not bloated.

---

## Output 2 — `research/findings-registry.json` (consolidated registry)

Per charter §4.2 schema. Top-level structure:

```json
{
  "schema_version": "1.0",
  "generated_at": "<ISO-8601-UTC>",
  "iteration": 8,
  "total_findings": <int>,
  "findings": [
    {
      "id": "F-CROSS-001",
      "title": "string, ≤100 chars",
      "tag": "phase-1-confirmed | phase-1-extended | phase-1-corrected | new-cross-phase",
      "source_phase": 1 | 2 | 3 | 4 | 5 | "cross",
      "evidence": [
        {"file": "research/iterations/...", "lines": "12-34", "quote": "≤200 chars (optional)"}
      ],
      "confidence": 0.0,
      "composition_risk": "low | med | high",
      "license_compatibility": "concept-transfer-only | source-portable | mixed | n/a",
      "recommendation": "adopt | adapt | reject | defer",
      "depends_on": ["F-CROSS-007"],
      "rationale": "1-2 sentences"
    }
  ],
  "summary": {
    "by_tag": {"phase-1-confirmed": 0, "phase-1-extended": 0, "phase-1-corrected": 0, "new-cross-phase": 0},
    "by_source_phase": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "cross": 0},
    "by_recommendation": {"adopt": 0, "adapt": 0, "reject": 0, "defer": 0},
    "by_composition_risk": {"low": 0, "med": 0, "high": 0}
  }
}
```

### What goes in the registry

The registry should consolidate ALL findings produced by this 8-iteration run, NOT mirror the entire 274-item phase-1 inventory. Specifically include:

1. **Every gap-closure finding** (26 from iter-2 and iter-3) — these become `phase-1-confirmed`, `phase-1-extended`, `phase-1-corrected`, or are marked as gaps still UNKNOWN
2. **Every cross-phase finding** that emerged in iter-4 through iter-7 — these are tagged `new-cross-phase`
3. **Every Q-C scored candidate** (28 from iter-6) — included even if their tag is `phase-1-extended` because they're now risk-scored
4. **Top 5-10 first-pass findings** that this run REUSES verbatim without modification — tagged `phase-1-confirmed` to acknowledge their continued validity

**Target: 60-90 findings total.** Don't bloat to 274; don't shrink to <50.

**Pretty-print, 2-space indent.** Validate JSON parses before exit.

---

## Output 3 — `research/recommendations.md` — TOP 10 RANKED RECOMMENDATIONS

Per charter §4.3. Format per recommendation:

```markdown
## R1 — [Imperative title, ≤80 chars]

**Rank:** 1
**Score:** 9/10 — (justification)
**Rationale:** 1–2 sentences
**Evidence:** [F-CROSS-NNN] [F-CROSS-MMM] (finding IDs from findings-registry.json)
**Depends on:** R3, R5 (other recommendation IDs)
**Effort:** S | M | L
**Acceptance criterion:** (one line, testable; "Public publishes a [X] dashboard with [Y] metrics under [Z] methodology")

## R2 — [Title]
…
(through R10)
```

**Source the top 10 from:**
- Q-D phase P0 candidates (these are the "first things Public should do")
- The 3 Q-F killer combos (each combo can be 1 recommendation, even if it's a multi-component thing)
- Q-A's "Public methodology" recommendation (token-honesty publication rule)

Each recommendation should cite finding IDs from the registry you just wrote.

---

## Output 4 — Citation validation

After writing all 3 deliverables, run a citation validation pass:

1. Grep for `[SOURCE:` in research.md → count citations → ensure every section 2-11 has at least one
2. Grep for `[SOURCE:` in recommendations.md → ensure every recommendation has at least 2 finding-ID references
3. Validate findings-registry.json parses (json.loads or jq -e .)
4. Validate every finding entry has at least one evidence pointer

Report the validation in iteration-8.md.

---

## Output 5 — `research/iterations/iteration-8.md` (≤300 lines)

```markdown
# Iteration 8 — Final assembly

## Method
- Inputs: <list of files read>
- Approach: synthesis-only; no new external reads

## Validation results
| Check | Result |
|---|---|
| research.md sections present | 11/11 |
| Every claim cited | yes/no (count) |
| findings-registry.json parses | yes/no |
| findings-registry.json count | <int> |
| recommendations.md count | 10 |
| Each recommendation has ≥2 evidence pointers | yes/no |

## Word counts
- research.md: <int> words
- recommendations.md: <int> words
- findings-registry.json: <int> findings

## Surprises
- ≤4 bullets observed during assembly

## Convergence assessment (final)
- Composite score: <float>
- newInfoRatio: <float>
- Path satisfied: composite | question-coverage | hard-ceiling
- Total iterations: 8
- Total tokens (across all 8 iters): ~<int>
- Recommended stop: yes
```

---

## Output 6 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":8,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"final_assembly","files_assembled":3,"research_md_words":<int>,"findings_registry_count":<int>,"recommendations_count":10,"citation_validation_passed":true,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"converged_assembly_complete","next_iteration_ready":false,"notes":"<≤200 chars>"}
```

Also append a separate `convergence` event:

```json
{"event":"convergence","timestamp":"<ISO-8601-UTC>","total_iterations":8,"convergence_path":"question_coverage_complete_plus_composite_above_threshold","final_composite":<float>,"final_new_info_ratio":<float>,"deliverables":["research.md","findings-registry.json","recommendations.md","cross-phase-matrix.md"],"notes":"All 6 cross-phase questions answered; all 26 gaps marked closed/partial/UNKNOWN; final assembly complete."}
```

---

## Final stdout line (mandatory)

```
ITERATION_8_COMPLETE research_md_words=<int> findings_count=<int> recommendations=10 citation_validation=passed CONVERGED=true
```

---

## Constraints

- **LEAF-only** — no sub-agent dispatch
- Do NOT modify earlier deliverables (cross-phase-matrix.md, iter-2 through iter-7 outputs in iterations/)
- Do NOT redo any analysis — synthesize from existing inputs only
- Do NOT open any phase folder or external/ — everything you need is in `research/` and `research/iterations/`
- Output files in correct locations:
  - `research/research.md` ← root
  - `research/findings-registry.json` ← root
  - `research/recommendations.md` ← root
  - `research/iterations/iteration-8.md` ← iterations/
- Every claim must trace to at least one `[SOURCE: …]` citation
- research.md target length: 5,000–10,000 words (substantial but not bloated)
- findings-registry.json target: 60–90 findings (not all 274 from inventory)
- recommendations.md: exactly 10 recommendations
- If JSON validation fails after writing, FIX it before exit
- If citation validation finds gaps, FIX them before exit (add citations OR remove uncited claims)

## When done

Exit. The deep-research loop is complete after this iteration. Claude orchestrator will:
1. Read all 3 deliverables
2. Update strategy + dashboard + state with `convergence_complete`
3. Save memory via `generate-context.js`
