# ITERATION 2 — Gap closure for Phases 1 + 2

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 2 of 12 max** in a deep-research consolidation orchestrated by Claude.

## Charter (read fully first)

`scratch/deep-research-prompt-master-consolidation.md`

## Context already established (iteration 1 outputs)

- `research/phase-1-inventory.json` — 274 items inventoried (148 findings / 11 gaps / 98 recommendations / 17 ADRs) across all 5 phases. **Read this first** so you don't re-discover phase-1 facts.
- `research/iteration-1.md` — anomalies & per-phase counts.
- `research/deep-research-strategy.md` — full charter recap, gap list, cross-phase questions.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

Your `--cd` working root is set here. **NEW PERMISSION**: you may now open `001-claude-optimization-settings/external/` and `002-codesight/external/` source files for evidence (iteration 1 forbade external; iteration 2 allows it for gap closure).

---

## Iteration 2 mission: Close gaps for Phase 1 (Claude Optimization Settings) and Phase 2 (CodeSight)

For **each** of the 10 gaps listed below, follow this **closure protocol** (charter §3.1):

1. **Re-read** the phase's `research.md` + `decision-record.md` + `implementation-summary.md` for previously-overlooked evidence (use the inventory IDs from `phase-1-inventory.json` as anchors).
2. If insufficient, **open** the relevant `<phase>/external/` source files cited in first-pass evidence (charter says: "the relevant external/ files cited in first-pass evidence" — follow citations from phase-1 docs into the actual source).
3. If still unresolved after 2 attempts, mark the gap **`UNKNOWN`** with a precise reason.

---

## Phase 1 gaps (charter §2.3)

| ID | Gap | Charter language |
|---|---|---|
| **G1.Q2** | First-tool latency / discoverability impact of `ENABLE_TOOL_SEARCH=true` | "token claim verified, ergonomics never measured" |
| **G1.Q8** | Edit-retry root-cause attribution across `prompt | workflow | guardrail` buckets for the **31 chains** in source | "never partitioned" |
| **G1.Q9** | Net-cost audit of `/clear` + plugin-memory remedy bundle vs stale-resume baseline | "gross savings claimed, overhead never subtracted" |
| **G1.RM** | Reddit-post arithmetic does not internally reconcile (264M tokens; **858 vs 926** sessions; **18,903 vs 11,357** turns) | "mark resolved or permanently UNKNOWN" |
| **G1.X1** | Cross-phase: does phase 005's shipped auditor/parser actually match F14–F17 expectations from phase 001? | "validate" |

## Phase 2 gaps (charter §2.3)

| ID | Gap | Charter language |
|---|---|---|
| **G2.T11** | The **11.2× token claim** is a hand-tuned formula (route=400, schema=300, etc.) with zero coverage in `eval.ts` | "empirical validation against real Claude/GPT counts" |
| **G2.TR** | tRPC / Fastify receive zero contract enrichment despite AST routing | "deliberate or gap?" |
| **G2.GO** | **Go** uses regex+brace-tracking yet labels `confidence: "ast"` | "mislabel or pending work?" |
| **G2.MR** | Monorepo support: only **pnpm + npm workspaces**; turbo/nx/lerna untested | "silent data loss?" |
| **G2.BR** | **Blast-radius BFS** off-by-one depth-cap leak; model-impact heuristic ("file owns db route → all schemas affected") | "false-positive rate?" |

---

## Output 1 — `research/gap-closure-phases-1-2.json`

```json
{
  "iteration": 2,
  "generated_at": "<ISO-8601-UTC>",
  "scope": ["phase-1", "phase-2"],
  "gaps": [
    {
      "id": "G1.Q2",
      "title": "First-tool latency / discoverability impact of ENABLE_TOOL_SEARCH=true",
      "phase": 1,
      "status": "closed | partial | UNKNOWN",
      "closure_method": "phase-1-doc-reread | external-source | combined",
      "attempts": [
        {
          "n": 1,
          "kind": "phase-1-doc-reread",
          "files": ["001-claude-optimization-settings/research/research.md"],
          "result": "≤300 chars summary"
        }
      ],
      "evidence": [
        {"file": "phase-1/research/research.md", "lines": "412-418", "quote": "≤200 chars"}
      ],
      "answer": "≤500 chars synthesis of what we now know",
      "confidence": "high | medium | low",
      "residual_unknowns": "≤300 chars; what's still open after closure",
      "tag": "phase-1-confirmed | phase-1-extended | phase-1-corrected | new-cross-phase",
      "depends_on_other_gaps": []
    }
  ],
  "summary": {
    "total_gaps": 10,
    "closed": 0,
    "partial": 0,
    "unknown": 0,
    "by_phase": {"1": {"closed": 0, "partial": 0, "unknown": 0}, "2": {"closed": 0, "partial": 0, "unknown": 0}}
  }
}
```

**Pretty-print, 2-space indent.** Use citation grammar `phase-N/<file>:<lines>` or `00N-<folder>/external/<path>:<lines>` per charter §3.5.

---

## Output 2 — `research/iteration-2.md` (≤800 lines)

Structure:
```
# Iteration 2 — Gap closure (Phases 1 + 2)

## Closure summary
| ID | Gap | Status | Tag | Confidence |

## Per-gap detail
### G1.Q2 — First-tool latency / discoverability impact
**Status:** closed | partial | UNKNOWN
**Closure method:** ...
**Evidence:**
- [SOURCE: phase-1/research/research.md:412-418] ...
**Answer:** ...
**Residual:** ...

(repeat for all 10 gaps)

## Cross-cutting observations
- (only if a finding spans multiple gaps in this iteration; ≤5 bullets)

## Handoff to iteration 3
- Iteration 3 will close gaps for phases 3, 4, 5.
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

Append exactly **one** JSONL line:

```json
{"event":"iteration_complete","iteration":2,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"gap_closure_phases_1_2","gaps_attempted":10,"gaps_closed":<int>,"gaps_partial":<int>,"gaps_unknown":<int>,"new_findings_emerged":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_2_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_2_COMPLETE closed=<int> partial=<int> unknown=<int>
```

---

## Constraints

- **LEAF-only** — no sub-agent dispatch
- Do NOT touch phases 3, 4, 5 (gaps 3+4+5 are iteration 3's job)
- Do NOT modify any phase folder or phase-1 doc
- Only write to `research/`
- Every claim in output 2 must trace to at least one `[SOURCE: ...]` citation
- For external/ reads: only files cited in first-pass evidence; do not crawl the whole external repo
- If you cannot find ANY new evidence after 2 attempts, mark `UNKNOWN` with the reason — do NOT fabricate
- Confidence: `low` if relying mostly on phase-1 doc inference; `medium` if phase-1 + 1 external corroboration; `high` if phase-1 + 2+ external corroborations

## When done

Exit. Do NOT start iteration 3. Claude orchestrator will validate and dispatch iteration 3 in a fresh codex session.
