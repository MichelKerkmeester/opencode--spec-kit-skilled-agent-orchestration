# ITERATION 11 — Citation accuracy verification (top 30 findings)

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 11 of 18 max**. Rigor lane iter 3 of 10.

## Charter

`scratch/deep-research-prompt-master-consolidation.md`

## Prior outputs (READ before starting)

- `research/findings-registry.json` — v1 (do NOT modify; just verify)
- `research/iterations/iteration-9-skeptical-review.md` — flags suspicious citations to prioritize
- `research/iterations/gap-reattempt-iter-10.json` — iter-10 closures (new evidence; verify too if any drift)

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` set here. **Permission:** read all 5 phase folders + their `external/` + iteration files. You'll be opening cited line ranges to verify content matches claims.

---

## Iteration 11 mission: Verify citation accuracy for top 30 findings

For the top 30 findings in `research/findings-registry.json` (by composite of confidence × tag importance × cross-phase relevance), open EVERY cited line range and verify the content matches the finding's title + rationale.

### Selection of "top 30"

Pick the 30 most load-bearing findings (those that show up in research.md sections, recommendations, or killer combos). Don't pick alphabetically — pick by impact. If iter-9 flagged specific findings as suspicious, prioritize those.

### Verification protocol per finding

For each of the 30:
1. Read the finding's `title`, `rationale`, and `evidence[]` array
2. For each evidence pointer (`{file, lines}`), open the file at the specified lines
3. Compare the actual content against the finding's claim
4. Classify the citation as:
   - `accurate` — content matches claim
   - `weak` — content tangentially supports claim but isn't the strongest evidence
   - `drifted` — content doesn't actually support the claim (line range wrong, file wrong, or claim has shifted)
   - `missing` — file or lines don't exist
5. If drifted, propose a corrected citation (better line range OR better file OR a removal)

### Severity rubric for the finding overall (across all its evidence)

- `solid`: all citations accurate
- `mostly-solid`: ≥80% accurate, no drifts, maybe 1 weak
- `needs-fix`: at least 1 drifted citation
- `broken`: ≥half citations are drifted/missing

---

## Output 1 — `research/iterations/citation-audit-iter-11.json`

```json
{
  "iteration": 11,
  "generated_at": "<ISO-8601-UTC>",
  "findings_audited": 30,
  "selection_method": "top by impact (research.md / recommendations / combos / iter-9 flags)",
  "audits": [
    {
      "finding_id": "F-CROSS-NNN",
      "title": "...",
      "evidence_count": <int>,
      "citation_results": [
        {
          "evidence_index": 0,
          "file": "phase-N/...",
          "lines": "M-N",
          "verdict": "accurate | weak | drifted | missing",
          "actual_content_summary": "≤120 chars of what's actually there",
          "suggested_fix": "(only if drifted/missing/weak)"
        }
      ],
      "overall_severity": "solid | mostly-solid | needs-fix | broken"
    }
  ],
  "summary": {
    "solid": <int>,
    "mostly_solid": <int>,
    "needs_fix": <int>,
    "broken": <int>,
    "total_drifted_citations": <int>,
    "total_missing_citations": <int>,
    "audit_pass_rate": "<float 0..1>"
  }
}
```

---

## Output 2 — `research/iterations/iteration-11.md` (≤400 lines)

```markdown
# Iteration 11 — Citation accuracy audit (top 30)

## Method
- Selection: top 30 by impact (cite which heuristic)
- Pattern: open cited ranges, compare content vs claim

## Audit summary
| Severity | Count |
| solid | <n> |
| mostly-solid | <n> |
| needs-fix | <n> |
| broken | <n> |

## Worst citations (top 5)
- F-CROSS-NNN: <quote of finding claim> vs actual content: <quote>
  Verdict: drifted | missing
  Fix: <suggested>

## Patterns observed
- ≤4 bullets (e.g. "5 of 8 broken citations are in research.md §5 cross-phase findings")

## Handoff to iter-12
- iter-12 will stress-test killer combos
- Findings with broken citations should NOT be used as combo evidence in v2
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

```json
{"event":"iteration_complete","iteration":11,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"citation_accuracy_audit","findings_audited":30,"solid":<int>,"mostly_solid":<int>,"needs_fix":<int>,"broken":<int>,"audit_pass_rate":<0..1>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_11_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_11_COMPLETE audited=30 solid=<n> mostly=<n> needs_fix=<n> broken=<n> pass_rate=<float>
```

---

## Constraints

- **LEAF-only**
- DO NOT modify v1 deliverables
- DO NOT modify the registry — write a NEW audit file
- Open the cited file:lines literally; if the file or lines don't exist, mark `missing`
- Be honest about `drifted` vs `weak` — drifted means "doesn't actually support", weak means "supports but not strongly"
- For each `drifted` or `missing`, propose a concrete fix (better line range / removal / replacement)
- 30 is the target; if a finding has zero evidence, count it as `broken` and continue

## When done

Exit. Do NOT start iter-12.
