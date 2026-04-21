# ITERATION 10 — Re-attempt 2 UNKNOWN + 8 PARTIAL gaps

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 10 of 18 max**. Rigor lane iter 2 of 10.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Prior outputs (READ before starting)

- `research/iterations/gap-closure-phases-1-2.json` — iter-2 closures (1 UNKNOWN + 5 PARTIAL)
- `research/iterations/gap-closure-phases-3-4-5.json` — iter-3 closures (1 UNKNOWN + 3 PARTIAL)
- `research/iterations/iteration-9-skeptical-review.md` — iter-9 critique. **Heed especially:** the warning about `G1.Q8` semantics ("do not treat as a measurement gap unless new per-chain examples actually appear").
- `research/research.md` (v1, do NOT modify)
- `research/recommendations.md` (v1, do NOT modify)

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set here. **Permission:** read all 5 phase folders + `external/` subfolders. Go DEEPER than iter-2/3 — open files iter-2/3 didn't open, follow citation chains.

---

## Iteration 10 mission: Make a second serious attempt at every UNKNOWN + PARTIAL gap

### Step 1 — Identify the gaps
Open the two gap-closure JSON files and list every entry where `status` is `UNKNOWN` or `partial`. Expected count: **2 UNKNOWN + 8 PARTIAL = 10 gaps**.

### Step 2 — For each gap, attempt a deeper closure
For each, follow this protocol:
1. Read what iter-2/3 already established (don't re-discover).
2. Read iter-9's critique on this gap if any.
3. Identify what specific evidence would close the gap (e.g. "a benchmark fixture", "a function impl", "a test for X").
4. **Open NEW external/ files** that iter-2/3 didn't open. Trace the data structures.
5. If you find new evidence, document it with `[SOURCE: ...]` citations.
6. Reclassify status: `closed | partial | UNKNOWN-confirmed`. Be honest — if it's still UNKNOWN, mark `UNKNOWN-confirmed` (meaning iter-10 also failed to close it) with the precise reason.

### Step 3 — Don't reclassify prior closed gaps
Do NOT re-attempt the 16 gaps already marked `closed` in iter-2/3. Only the 2 UNKNOWN + 8 PARTIAL.

### Confidence rubric (same as iter-2/3)
- `low`: phase-1 doc inference only
- `medium`: phase-1 + 1 external corroboration
- `high`: phase-1 + 2+ external corroborations

---

## Output 1 — `research/iterations/gap-reattempt-iter-10.json`

```json
{
  "iteration": 10,
  "generated_at": "<ISO-8601-UTC>",
  "scope": "reattempt_unknown_and_partial_gaps",
  "input_unknown_count": 2,
  "input_partial_count": 8,
  "reattempts": [
    {
      "id": "<gap id from iter-2/3>",
      "title": "<gap title>",
      "phase": <1-5>,
      "iter_2_3_status": "UNKNOWN | partial",
      "iter_10_status": "closed | partial | UNKNOWN-confirmed",
      "delta": "improved | same | reclassified",
      "new_attempts": [
        {"n": 1, "kind": "external-deep-read", "files": ["..."], "result": "≤300 chars"}
      ],
      "new_evidence": [
        {"file": "00N-folder/external/...", "lines": "...", "quote": "≤200 chars"}
      ],
      "iter_10_answer": "≤500 chars",
      "iter_10_confidence": "low | medium | high",
      "iter_10_residual": "≤300 chars",
      "tag": "phase-1-confirmed | phase-1-extended | phase-1-corrected | new-cross-phase",
      "improvement_summary": "What changed vs iter-2/3"
    }
  ],
  "summary": {
    "now_closed": <int>,
    "now_partial": <int>,
    "now_unknown_confirmed": <int>,
    "improved_count": <int>,
    "still_same_count": <int>
  }
}
```

---

## Output 2 — `research/iterations/iteration-10.md` (≤500 lines)

```markdown
# Iteration 10 — Gap re-attempt (2 UNKNOWN + 8 PARTIAL)

## Method
- Gaps targeted: <list>
- New external files opened: <count>

## Closure delta
| ID | Iter-2/3 | Iter-10 | Delta |
| ... | ... | ... | improved/same/reclassified |

## Per-gap detail (improvements only)
### <gap id> — improved from PARTIAL to closed
**New evidence:**
- [SOURCE: ...]
**Iter-10 answer:** ...

(only show gaps that improved or were reclassified)

## Gaps that did NOT improve
- <id>: still <status>; reason: ...

## Surprises
- ≤4 bullets

## Handoff to iter-11
- iter-11 will verify the top 30 findings' citations point to what they claim
- This iter's new closures should be cited in v2 (iter-17)
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":10,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"reattempt_unknown_partial","gaps_attempted":10,"now_closed":<int>,"now_partial":<int>,"now_unknown_confirmed":<int>,"improved":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_10_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_10_COMPLETE attempted=10 closed=<n> partial=<n> unknown_confirmed=<n> improved=<n>
```

---

## Constraints

- **LEAF-only**
- DO NOT modify v1 deliverables (research.md, findings-registry.json, recommendations.md, cross-phase-matrix.md)
- DO NOT modify iter-2/3 gap-closure JSONs (write a NEW file `gap-reattempt-iter-10.json`)
- DO NOT re-attempt the 16 already-`closed` gaps
- Heed iter-9's caution on `G1.Q8` semantics
- Every new claim must trace to a `[SOURCE: ...]` citation
- If a gap genuinely has no closeable evidence in the codebase, mark `UNKNOWN-confirmed` and explain why

## When done

Exit. Do NOT start iter-11.
