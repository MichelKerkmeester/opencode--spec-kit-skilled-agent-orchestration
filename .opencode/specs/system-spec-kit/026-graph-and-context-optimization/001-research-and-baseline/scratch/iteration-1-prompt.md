# ITERATION 1 — Deep-Research Master Consolidation

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 1 of 12 max** in a deep-research consolidation orchestrated by Claude. Your job is iteration 1 **only** — do **not** start iteration 2.

## Charter (READ FULLY before doing anything)

`scratch/deep-research-prompt-master-consolidation.md`

This is a SECOND-PASS consolidation of 5 already-completed external-systems research phases. You **build upon** their work, you do **not** redo it.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

Your `--cd` working root is set to this directory. All paths below are relative to it unless absolute.

---

## Iteration 1 mission: First-pass ingestion + inventory

Read the **15 phase-1 docs** listed below (and **only** those — do NOT open any phase's `external/` folder), and emit a structured deduplication baseline (`phase-1-inventory.json`) for iterations 2+.

### Files to read (EXACTLY 15)

1. `001-claude-optimization-settings/research/research.md`
2. `001-claude-optimization-settings/decision-record.md`
3. `001-claude-optimization-settings/implementation-summary.md`
4. `002-codesight/research/research.md`
5. `002-codesight/decision-record.md`
6. `002-codesight/implementation-summary.md`
7. `003-contextador/research/research.md`
8. `003-contextador/decision-record.md`
9. `003-contextador/implementation-summary.md`
10. `004-graphify/research/research.md`
11. `004-graphify/decision-record.md`
12. `004-graphify/implementation-summary.md`
13. `005-claudest/research/research.md`
14. `005-claudest/decision-record.md`
15. `005-claudest/implementation-summary.md`

If any file is missing, log it as `MISSING` in the inventory but **do not** substitute alternatives.

---

## Output 1 — `research/phase-1-inventory.json`

Top-level schema:

```json
{
  "iteration": 1,
  "generated_at": "<ISO-8601-UTC>",
  "files_inventoried": 15,
  "phases": {
    "1": {"folder": "001-claude-optimization-settings", "system": "Claude Optimization Settings", "items": []},
    "2": {"folder": "002-codesight",                    "system": "CodeSight",                    "items": []},
    "3": {"folder": "003-contextador",                  "system": "Contextador",                  "items": []},
    "4": {"folder": "004-graphify",                     "system": "Graphify",                     "items": []},
    "5": {"folder": "005-claudest",                     "system": "Claudest",                     "items": []}
  },
  "summary": {
    "total_items": 0,
    "by_category": {"finding": 0, "gap": 0, "recommendation": 0, "adr": 0, "other": 0}
  }
}
```

Each `items[]` entry:

```json
{
  "id": "F-1 | K-3 | gap-Q2 | ADR-2 | rec-001 | (raw id from source)",
  "title": "≤120 chars",
  "category": "finding | gap | recommendation | adr | other",
  "source_file": "001-claude-optimization-settings/research/research.md",
  "source_lines": "412-418",
  "confidence": "high | medium | low | unknown",
  "tag_hint": "optional — e.g. F-tier-1, P0, blocker, etc.",
  "recommendation_status": "adopt | adapt | reject | defer | n/a",
  "summary": "≤220 chars",
  "phase_1_keywords": ["short", "dedup", "keywords"]
}
```

**Pretty-print with 2-space indent.** Inventory EVERY named finding, gap, ADR, and recommendation. Use the source's own ID grammar (F-N, K-N, gap-Qn, ADR-n, etc.).

---

## Output 2 — append to `research/deep-research-state.jsonl`

Append **exactly one** JSONL line:

```json
{"event":"iteration_complete","iteration":1,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","files_read":15,"items_inventoried":<int>,"by_category":{"finding":<int>,"gap":<int>,"recommendation":<int>,"adr":<int>,"other":<int>},"by_phase":{"1":<int>,"2":<int>,"3":<int>,"4":<int>,"5":<int>},"composite_score_estimate":<float 0..1>,"new_info_ratio":1.0,"stop_reason":"iteration_1_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Output 3 — `research/iteration-1.md` (short report, ≤500 lines)

```
# Iteration 1 — First-pass ingestion

## Files read
| # | Path | Bytes | Status |
|---|------|-------|--------|
| 1 | … | … | ok|MISSING |
…

## Per-phase inventory counts
| Phase | System | findings | gaps | recommendations | adrs | other | total |

## Anomalies or surprises encountered
- Bullet observations only. NO analysis. NO new findings.
- E.g. "Phase 003 decision-record references ADR-5 but body is missing"

## Handoff to iteration 2
- Spec for iteration 2 (gap closure phases 1+2): see strategy.md.
- Inventory baseline established for dedup.
```

---

## Final stdout line (mandatory)

```
ITERATION_1_COMPLETE items=<N> by_phase=1:<n>,2:<n>,3:<n>,4:<n>,5:<n>
```

---

## Constraints (anti-patterns from charter §3.3)

- **LEAF-only**: do NOT dispatch sub-agents
- Do NOT redo first-pass research; just inventory
- Do NOT open `<phase>/external/` repos
- Do NOT modify any phase folder or phase doc
- Only write to `research/`
- If uncertain about a finding's category, set `confidence: "unknown"` and proceed
- Do NOT add new findings or analysis — that's iterations 2+
- Use citation grammar `phase-N/<file>:<lines>` consistent with the charter

## When done

Exit. Do NOT start iteration 2. Claude orchestrator will read your outputs, validate them, and dispatch iteration 2 in a fresh codex session.
