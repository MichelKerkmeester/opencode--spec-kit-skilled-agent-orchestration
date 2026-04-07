# ITERATION 3 — Gap closure for Phases 3 + 4 + 5

You are **codex** (`gpt-5.4`, reasoning effort `high`), running **iteration 3 of 12 max** in a deep-research consolidation orchestrated by Claude.

## Charter (read fully first)

`scratch/deep-research-prompt-master-consolidation.md`

## Folder layout (READ CAREFULLY — paths matter)

```
research/
├── deep-research-config.json     # state (orchestrator)
├── deep-research-state.jsonl     # state (orchestrator) — append iter events here
├── deep-research-strategy.md     # state (orchestrator)
├── deep-research-dashboard.md    # state (orchestrator)
├── phase-1-inventory.json        # FOUNDATION baseline (do not modify)
├── iterations/                   # all per-iteration outputs LIVE HERE
│   ├── iteration-1.md
│   ├── iteration-2.md
│   ├── gap-closure-phases-1-2.json
│   ├── (iter-3 outputs land here)
│   └── ...
└── (final deliverables added in iter 8: research.md, findings-registry.json, recommendations.md, cross-phase-matrix.md)
```

**Per-iteration outputs ALWAYS go in `research/iterations/`. State files stay in `research/` root.**

## Prior iteration outputs (read these before starting)

- `research/phase-1-inventory.json` — 274-item dedup baseline (iter 1).
- `research/iterations/iteration-1.md` — anomalies + per-phase counts.
- `research/iterations/gap-closure-phases-1-2.json` — iter-2 closures (4 closed / 5 partial / 1 UNKNOWN, 7 new findings).
- `research/iterations/iteration-2.md` — iter-2 detail with [SOURCE:] citations.
- `research/deep-research-strategy.md` — full charter recap.

You may quote iter-2 findings as cross-phase context but **do not** re-attempt phase 1 or 2 gaps.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

`--cd` is set here. **Permission:** read `003-contextador/external/`, `004-graphify/external/`, `005-claudest/external/` source files for evidence (per charter §3.1 attempt 2).

---

## Iteration 3 mission: Close 16 gaps for Phases 3, 4, 5

For each gap, follow the closure protocol (charter §3.1):
1. Re-read the phase's `research.md` + `decision-record.md` + `implementation-summary.md`.
2. If insufficient, open the relevant `<phase>/external/` source files cited in first-pass evidence.
3. After 2 attempts, mark `UNKNOWN` with a precise reason.

---

## Phase 3 gaps (Contextador) — 5 gaps

| ID | Gap |
|---|---|
| **G3.T93** | The **93% token reduction** is `AVG_MANUAL_EXPLORATION_TOKENS = 25000` synthetic constant — needs pointer-quality benchmark vs Public's typed CocoIndex+CodeGraph+Memory stack |
| **G3.MF** | Mainframe room privacy weakness: `preset: "public_chat"` despite `visibility: "private"`; plaintext credentials in `.contextador/mainframe-agent.json` |
| **G3.MX** | Multi-agent contention on Matrix room-state writes — race / lock semantics unverified |
| **G3.GH** | GitHub automation (`external/src/lib/github/`) — webhook idempotency, secret rotation, error notification all source-only |
| **G3.RQ** | Repair-queue completion guarantees post-regeneration — open |

## Phase 4 gaps (Graphify) — 6 gaps

| ID | Gap |
|---|---|
| **G4.T715** | The **71.5× token reduction** relies on naive baseline + 4-chars/token heuristic — needs Anthropic `count_tokens` grounding |
| **G4.CG** | Cache: monotonic growth, no orphan GC, mtime-only invalidation, no tombstones |
| **G4.LP** | Cross-language extraction parity — Python has 3× structure (calls, uses, rationale); other 11 languages capped; **Swift detected but never extracted** |
| **G4.IE** | AST INFERRED edges flat 0.5; semantic INFERRED 0.4–0.9 — does inconsistency hurt ranking quality? |
| **G4.MM** | Mixed-corpus README claims multimodal output but checked-in `GRAPH_REPORT.md` shows code-only / zero token spend — re-execution needed or honest re-labeling |
| **G4.PT** | PreToolUse `Glob \| Grep` nudge effectiveness — never measured |

## Phase 5 gaps (Claudest) — 5 gaps

| ID | Gap |
|---|---|
| **G5.FT** | Phase 1 never opened `mcp_server/lib/search/sqlite-fts.ts` — must verify FTS4 creation + PRAGMA probe support before "smallest safe v1" lane is trustable |
| **G5.SH** | Stop hook does not currently persist `transcript_path`, drops cache-token fields, no turn-level offsets — Brief B (normalized analytics) blocked until producer patch lands |
| **G5.CMD** | Per-plugin `CLAUDE.md` reconstructed indirectly from README/skill — needs direct file inspection (note: iter-1 anomalies log says `external/plugins/claude-memory/CLAUDE.md` is missing in this checkout — confirm or refute) |
| **G5.FB** | Docstring/implementation drift in `_build_fallback_context()` ("last 3 exchanges" vs actual "first-2 + last-6") |
| **G5.SE** | Whether Public's `008-signal-extraction` packet already embodies the auditor/discoverer split or treats consolidation as a monolithic pass (cross-repo: Public spec) |

> For G5.SE: this references a Public spec folder, **not** an external repo. Search `.opencode/specs/` for `008-signal-extraction` if needed. If not found, mark UNKNOWN with reason.

---

## Output 1 — `research/iterations/gap-closure-phases-3-4-5.json`

Same schema as iter-2's `gap-closure-phases-1-2.json` (mirror exactly):

```json
{
  "iteration": 3,
  "generated_at": "<ISO-8601-UTC>",
  "scope": ["phase-3", "phase-4", "phase-5"],
  "gaps": [ /* one entry per gap, schema below */ ],
  "summary": {
    "total_gaps": 16,
    "closed": 0,
    "partial": 0,
    "unknown": 0,
    "by_phase": {
      "3": {"closed": 0, "partial": 0, "unknown": 0},
      "4": {"closed": 0, "partial": 0, "unknown": 0},
      "5": {"closed": 0, "partial": 0, "unknown": 0}
    }
  }
}
```

Per-gap entry schema (identical to iter-2):
```json
{
  "id": "G3.T93",
  "title": "...",
  "phase": 3,
  "status": "closed | partial | UNKNOWN",
  "closure_method": "phase-1-doc-reread | external-source | combined | cross-repo",
  "attempts": [{"n": 1, "kind": "...", "files": [...], "result": "≤300 chars"}],
  "evidence": [{"file": "...", "lines": "...", "quote": "≤200 chars"}],
  "answer": "≤500 chars synthesis",
  "confidence": "high | medium | low",
  "residual_unknowns": "≤300 chars",
  "tag": "phase-1-confirmed | phase-1-extended | phase-1-corrected | new-cross-phase",
  "depends_on_other_gaps": []
}
```

**Pretty-print, 2-space indent.** Use citation grammar `phase-N/<file>:<lines>` or `00N-<folder>/external/<path>:<lines>` per charter §3.5.

---

## Output 2 — `research/iterations/iteration-3.md` (≤900 lines)

Mirror iteration-2.md structure:
```
# Iteration 3 — Gap closure (Phases 3 + 4 + 5)

## Closure summary
| ID | Gap | Status | Tag | Confidence |

## Per-gap detail
### G3.T93 — ...
**Status:** ...
**Closure method:** ...
**Evidence:** [SOURCE: ...]
**Answer:** ...
**Residual:** ...

(repeat for all 16 gaps)

## Cross-cutting observations
- ≤8 bullets of patterns spanning 2+ gaps in this iteration

## Handoff to iteration 4
- Iteration 4 (Q-B Capability matrix) will use the closed/partial gaps as input.
```

---

## Output 3 — append to `research/deep-research-state.jsonl`

Append exactly **one** JSONL line:

```json
{"event":"iteration_complete","iteration":3,"timestamp":"<ISO-8601-UTC>","worker":"codex/gpt-5.4/high","scope":"gap_closure_phases_3_4_5","gaps_attempted":16,"gaps_closed":<int>,"gaps_partial":<int>,"gaps_unknown":<int>,"new_findings_emerged":<int>,"composite_score_estimate":<0..1>,"new_info_ratio":<0..1>,"stop_reason":"iteration_3_done","next_iteration_ready":true,"notes":"<≤200 chars>"}
```

---

## Final stdout line (mandatory)

```
ITERATION_3_COMPLETE closed=<int> partial=<int> unknown=<int>
```

---

## Constraints

- **LEAF-only** — no sub-agent dispatch
- Do NOT re-attempt phase 1 or 2 gaps (iter 2's closures stand)
- Do NOT modify any phase folder or phase doc
- Per-iteration outputs ONLY in `research/iterations/`. State updates (deep-research-state.jsonl) in `research/` root. Do NOT write iteration outputs in `research/` root.
- Every claim in output 2 must trace to at least one `[SOURCE: ...]` citation
- For external/ reads: only files cited in first-pass evidence; do not crawl
- For G5.SE specifically: this is a cross-repo lookup against Public's `.opencode/specs/`. The spec folder may be at `008-signal-extraction` directly under `specs/`, or under a parent track. If you cannot find it, mark UNKNOWN.
- If 2 attempts fail, mark `UNKNOWN` with the reason — do NOT fabricate
- Confidence rubric (same as iter-2):
  - `low`: phase-1 doc inference only
  - `medium`: phase-1 + 1 external corroboration
  - `high`: phase-1 + 2+ external corroborations

## When done

Exit. Do NOT start iteration 4. Claude orchestrator will validate and dispatch iteration 4 (Q-B Capability matrix).
