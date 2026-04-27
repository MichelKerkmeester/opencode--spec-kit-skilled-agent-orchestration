# Deep-Research Iteration 007 — 010/006 umbrella docs vs code reality

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations. Defensive code/doc-review of internal documentation. Read-only.

## Iters 1-6 — known closure-integrity gaps (do not duplicate, only extend)

⚠️ **3 confirmed gaps against 010/007 closure claims**:
- **F12 (P2)** R-007-P2-4 limit+1 not as documented.
- **F14-iter5 (P2)** R-007-8 conflicts_with reject only in Python, TS still accepts.
- **F17-iter6 (P2)** R-007-13 SQL-pipeline test count claim is wrong (2 SQL + 1 formatter, not 3 SQL).

Plus 1 P1 (mixed-header path bypass) and 18 other P2s. Iters 1-6 covered 010/001-005.

## This iteration drills 010/006 (docs and catalogs rollup)

The 010/006 deliverable was umbrella-doc updates + 5 baseline manual_testing_playbook scenarios. The 010/007/T-A wiring + T-F doc cleanup updated several umbrella docs. This iteration is purely a **doc-vs-code drift audit**.

## Audit checklist — for each claim, mark CONFIRMED-MATCHES-CODE or DRIFT-FROM-CODE with citation

### Section A — Root `README.md` claims

A1. **Tool count claims**: search root README for "tool" mentions referring to total count. Current claim is "60 MCP tools" (51 + 7 + 1 + 1 + ...). Cite the lines and verify 51 matches `TOOL_DEFINITIONS.length` in `mcp_server/tool-schemas.ts`.
A2. **detect_changes mentions**: cite lines that describe detect_changes. Are they consistent with the actual tool wiring (it IS now wired post-T-A)?
A3. **blast_radius mentions**: cite lines that describe blast_radius. Do they accurately reflect the depthGroups / riskLevel / minConfidence / failureFallback.code shipped surface?
A4. **trust_badges mentions**: cite. Do they match the merge-per-field + age-allowlist + DI seam reality?
A5. **affordance evidence mentions**: cite. Do they match the lanes + denylist + counters reality?

### Section B — `system-spec-kit/SKILL.md` and `system-spec-kit/README.md`

B1. SKILL.md: tool count claims, detect_changes deferral status, blast_radius enrichment claims. CONFIRMED or DRIFT?
B2. README.md: same audits, plus the 51 canonical-source note added in T-F.

### Section C — `mcp_server/README.md`

C1. Tool listing — does the README enumerate all 51 tools? Cite.
C2. Layer breakdown (L8 / L9 references per T-F) — accurate?
C3. detect_changes section — confirmed wired-as-MCP-tool now?
C4. Per-handler descriptions accurate to what code does?

### Section D — `mcp_server/INSTALL_GUIDE.md`

D1. Section §4c Python smoke-test path — was the T-F R-007-16 fix landed (`python3 skill_advisor/tests/python/test_skill_advisor.py` from cwd `mcp_server/`)? Cite.
D2. Smoke-test invocation examples for detect_changes, blast_radius, memory_search — do they match current handler signatures?

### Section E — `feature_catalog/` umbrella consistency

E1. `feature_catalog/feature_catalog.md` index: does it list all entries authored under 010/006?
E2. The simple-terms FAQ: was the broken `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` link removed (T-F R-007-18)?
E3. The 5 010-shipped feature_catalog entries (`03--discovery/04`, `06--analysis/08`, `11--scoring-and-calibration/24`, `13--memory-quality-and-indexing/28`, `14--pipeline-architecture/N`) — confirm they exist and reference correct mcp_server source files.

### Section F — `manual_testing_playbook/` umbrella consistency

F1. `manual_testing_playbook/manual_testing_playbook.md` index: lists 014, 026, 199, 203, 271 (the 010/006 + 011-extended scenarios)?
F2. The 5 entries' `## 5. SOURCE METADATA` sections — do their phase/sub-phase paths reference correct 010 sub-phases?
F3. The 011-added Block B/C/D/E entries — are they preserved in the scenario files (no regression from later edits)?

## Read first

1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/strategy.md`
2. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md`
3. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md`
4. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md`
5. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md`
6. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
7. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (count check)
8. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
9. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
10. (Spot-check 1-2 feature_catalog and 1-2 playbook entries)

## Output contract

Write to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-007.md`:

```markdown
---
_memory:
  continuity:
    next_safe_action: "[1 sentence on iter 008 focus]"
---
# Iteration 007 — 010/006 umbrella docs vs code reality

**Focus:** Audit doc claims against code on main; flag drift.
**Iteration:** 7 of 10
**Convergence score:** [0.00–1.00]

## Section A verdicts (root README)
- A1..A5

## Section B verdicts (SKILL.md + system-spec-kit/README.md)
- B1..B2

## Section C verdicts (mcp_server README)
- C1..C4

## Section D verdicts (INSTALL_GUIDE)
- D1..D2

## Section E verdicts (feature_catalog)
- E1..E3

## Section F verdicts (manual_testing_playbook)
- F1..F3

## New findings (use IDs F19+ to avoid collision)
[Each: severity, remediation, RQ, file:line evidence]

## Negative findings (CONFIRMED-matches-code items)
- [doc claims that do match code on main]

## RQ coverage cumulative through iter 7
- RQ1..RQ5

## Next iteration recommendation
[Iter 008 should drill 010/007 T-A..T-F closure integrity vs code (33 findings against shipped code)]
```

JSONL delta:
```jsonl
{"iter":7,"convergence_score":<0.0-1.0>,"findings":[...],"checklist_handled":<int>,"checklist_drift":<int>,"rq_coverage":{...},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

Last line:
`EXIT_STATUS=DONE | findings=N | convergence=X.XX | matches=M/drift=D | next=iter-008`

## Hard rules

- Doc-vs-code drift audit. CONFIRMED-MATCHES or DRIFT-FROM-CODE verdicts only.
- Use IDs F19+ to avoid collision.
- Tool budget: target 8 tool calls, max 12.
