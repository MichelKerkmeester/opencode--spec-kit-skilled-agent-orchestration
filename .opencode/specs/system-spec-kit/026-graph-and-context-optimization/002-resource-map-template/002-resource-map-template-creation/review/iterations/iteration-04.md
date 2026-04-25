# Iteration 04 — Command + YAML wiring consistency

**Dimension:** Command MD + YAML workflow-asset consistency for `resource-map.md`
**Scope:** 8 YAMLs + `command/memory/save.md` + `command/spec_kit/resume.md`
**Executor:** Direct Read/Grep + `python3 yaml.safe_load` (copilot not dispatched — scope verifiable inline).

## Findings

### 1. YAML syntax — all 8 files valid
`yaml.safe_load` clean across plan/complete/implement × auto/confirm + resume × auto/confirm. No tab/indent breakage, no duplicate keys.

### 2. `shared:` block — consistent placement in all 6 YAMLs
Programmatic AST walk confirms `resource_map` sits immediately **after** `debug_delegation`:
- plan/complete × auto/confirm: `[research, handover, debug_delegation, resource_map]`
- implement × auto/confirm: `[handover, debug_delegation, resource_map]` (implement omits `research` — pre-existing, not a regression)

### 3. `save.md:157` vs `memory-save.ts:2722` — intentional divergence
L157 is a subset for ANCHOR-tag validation (`decision-record, impl-summary, handover, resource-map`); L2722 is the runtime allow-list of all 11 canonical docs. Different purposes.

**P2 — W-001:** `resource-map.md` template has **zero `<!-- ANCHOR: -->` markers** today, so including it in L157 is a trivial no-op. Either add anchors to the template or drop it from L157.

### 4. `save.md:353` vs `SPEC_DOCUMENT_FILENAMES` — minor drift
L353 narrative lists 8 md bases + `research/research.md` + `resource-map.md` + `graph-metadata.json`. The source Set also includes `description.json` (omitted from L353) and uses bare `research.md`.
- **P2 — W-002:** L353 omits `description.json` though auto-index re-scans it.
- **INFO — W-003:** `research/research.md` (path-form) vs Set's `research.md` (basename). Legacy `research.md` is also accepted, so not incorrect.

### 5. Resume YAMLs — internally consistent
Both auto.yaml:70 and confirm.yaml:72 share identical `order:` string: `"supporting spec docs (tasks/checklist/plan/decision-record/resource-map)"`. `context_priority` strings match.

**INFO — W-004 (pre-existing):** `resume_auto.yaml:138` has an explicit activity line reading supporting docs; `resume_confirm.yaml` has no parallel line (confirm has a different Q&A flow). The `resource-map` update was applied correctly where the line exists. Not a 012 regression.

### 6. `resume_*.yaml:57` glob — NOT a miss
`{handover.md,implementation-summary.md,tasks.md}` is `tier_4_recent_artifacts` — a session-detection heuristic ranking candidate folders by recent mtime, NOT a recovery list. Adding `resource-map.md` would add noise (a one-time catalog edit would dominate tier-4 signal). **AUDIT-B's possible-miss is correctly rejected — leave as-is.**

### 7. Other command MD — no missed updates
`deep-research.md` / `deep-review.md` use generic "canonical spec docs" phrasing with no hardcoded filename lists. `create/agent.md:128` and `create/testing-playbook.md:113` enumerate context-load docs for a load operation where `resource-map.md` is optional; not required. No drift.

### 8. `save.md` and `resume.md` — internally consistent
Both files updated once each; no internal contradictions.

## Severity Summary

| ID    | Sev  | Finding                                                                           |
|-------|------|-----------------------------------------------------------------------------------|
| W-001 | P2   | `resource-map.md` template lacks ANCHORs → L157 enumeration is a trivial no-op    |
| W-002 | P2   | `save.md:353` narrative omits `description.json`                                  |
| W-003 | INFO | `save.md:353` uses `research/research.md` path vs Set's basename `research.md`    |
| W-004 | INFO | Pre-existing `resume_auto` vs `resume_confirm` verbosity asymmetry — not 012      |

**No P0/P1 findings.** YAML wiring clean; command MD aligns with sources.

## Strengths
- `resource_map:` placed immediately after `debug_delegation:` in all 6 `shared:` blocks — deterministic, greppable.
- Resume YAMLs share identical `(tasks/checklist/plan/decision-record/resource-map)` enumeration phrasing.
- No unneeded activity line added to `resume_confirm.yaml` — correct restraint.

## Recommendation
Ship packet 012 as-is. Optional follow-up (<5 LOC): either add ANCHOR tags to `resource-map.md` template (makes W-001 real coverage) OR drop `resource-map.md` from `save.md:157`. W-002 is cosmetic narrative. No blockers.
