# Agent Brief — 012/004 Skill Advisor Affordance Evidence

You are an autonomous implementation agent. **No conversation context.** This brief is everything you need.

## Your role

You wire tool/resource/MCP-resource affordances into the existing `derived` and `graph-causal` scoring lanes via a new affordance-normalizer (allowlist sanitizer + privacy preservation). **No new scoring lane. No new compiler entity_kinds. No new relation types.**

## Read first (in this exact order)

1. **Sub-phase spec (your scope, READ FULLY):**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence/spec.md`
2. **Sub-phase plan + tasks + checklist:**
   `.../004-skill-advisor-affordance-evidence/{plan.md,tasks.md,checklist.md}`
3. **Phase-root (read-only):**
   `.../012-graph-impact-and-affordance-uplift/{spec.md,decision-record.md}` (note ADR-012-006: affordance via existing lanes only)
4. **License clearance:**
   `.../012/001-clean-room-license-audit/implementation-summary.md` — must show APPROVED. If HALT, **STOP**.
5. **Research basis:**
   `.../research/007-git-nexus-pt-02/research.md` §6 (Skill Advisor findings), §11 Packet 3, §12 RISK-05 (prompt-stuffing risk)
6. **Existing Public code (READ before EDIT):**
   - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` (line 43: `ALLOWED_ENTITY_KINDS = {"skill", "agent", "script", "config", "reference"}` — must stay unchanged)
   - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` (lines 9-43)
   - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` (lines 12-18 `EDGE_MULTIPLIER`; lines 20-81 lane logic)
   - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/` (existing fixture patterns)

## Worktree + branch

- Worktree: `../012-004` (`git worktree add ../012-004 -b feat/012/004-affordance`)
- Branch: `feat/012/004-affordance`
- ✅ **Fully isolated** — no file overlap with 002, 003, 005, 006. No rebase needed.

## Files you may touch

| File | Action |
|------|--------|
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | **CREATE** — `normalize(toolDescriptions: AffordanceInput[]): NormalizedAffordance[]` with allowlist + privacy stripping |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | **MODIFY** — extend compile to accept normalized affordances as derived inputs. **DO NOT** add to `ALLOWED_ENTITY_KINDS` |
| `mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | **MODIFY** lines 9-43 — accept `affordances?: NormalizedAffordance[]` parameter |
| `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | **MODIFY** lines 20-81 — wire affordance-derived edges using existing `EDGE_MULTIPLIER` constants. **DO NOT** add new keys to `EDGE_MULTIPLIER` |
| `mcp_server/skill_advisor/tests/affordance-normalizer.test.ts` | **CREATE** — allowlist + privacy + sanitization tests |
| `mcp_server/skill_advisor/tests/lane-attribution.test.ts` (or extend existing) | **MODIFY** — verify affordance evidence routes to derived/graph-causal (not a new lane) |
| `mcp_server/skill_advisor/tests/routing-fixtures.*` | **EXTEND** — fixtures showing affordance evidence improves recall without precision regression |
| `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/<new-entry>.md` | **CREATE** via `/create:feature-catalog` |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/<new-entry>.md` | **CREATE** via `/create:testing-playbook` |
| `012/004/implementation-summary.md` | **MODIFY** — populate Affordance Allowlist Decided, What Was Built, Static Check Results |

## Files you may NOT touch

- 012 phase-root files
- Other sub-phase folders (001, 002, 003, 005, 006)
- `code_graph/`, `lib/storage/`, `lib/search/`, `formatters/` (other sub-phases)
- `skill_graph_compiler.py:43` `ALLOWED_ENTITY_KINDS` set value (must stay `{skill, agent, script, config, reference}`)
- `graph-causal.ts:12-18` `EDGE_MULTIPLIER` keys (no new relation types)
- `external/` (read-only)

## Hard rules (pt-02 §12 RISK-05)

1. **Clean-room only** (ADR-012-001).
2. **NO new scoring lane.** Affordances flow through existing `derived` + `graph-causal` lanes. Routing decision must be traceable to one of those.
3. **NO new compiler entity_kinds.** `ALLOWED_ENTITY_KINDS` stays exactly `{"skill", "agent", "script", "config", "reference"}`. Affordances are pre-pass derived inputs, not entities.
4. **NO new relation types.** No new keys in `EDGE_MULTIPLIER`. Reuse `depends_on` / `enhances` / `siblings` / `prerequisite_for` / `conflicts_with`.
5. **Sanitization is MANDATORY** — every affordance MUST pass through `affordance-normalizer.ts` before reaching the scorer. NO bypass paths. Define an explicit allowlist of fields permitted to become triggers (e.g., `name`, `triggers[]`, `category`, `dependsOn[]` — NOT free-form `description`).
6. **Privacy preserved** — recommendation payload must NOT contain raw matched phrases from tool descriptions. Test this assertion explicitly.
7. **Backward compat** — existing routing fixtures must still pass. Affordance evidence improves recall WITHOUT overpowering explicit triggers.
8. **Read whole file before edit.**

## Success criteria

- [ ] All 17 tasks in `012/004/tasks.md` complete (T-004-A1 through T-004-E5)
- [ ] All checklist items in `012/004/checklist.md` ticked with evidence
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../012/004 --strict` passes
- [ ] `vitest run skill_advisor/tests/` green
- [ ] `pytest skill_advisor/scripts/` green if compiler tests exist
- [ ] Existing skill_advisor test suite still green (no regression)
- [ ] `tsc --noEmit` clean
- [ ] Static check: `ALLOWED_ENTITY_KINDS = {"skill", "agent", "script", "config", "reference"}` literal unchanged
- [ ] Static check: `EDGE_MULTIPLIER` keys unchanged
- [ ] Privacy assertion test passes (no raw phrases in payload)
- [ ] sk-doc DQI ≥85 on the 2 new feature_catalog/playbook entries

## Output contract

- Commit to `feat/012/004-affordance` with conventional-commit messages
- Final commit suffix: `(012/004)`
- Do NOT merge — orchestrator handles merges
- On completion, print: `EXIT_STATUS=DONE` + allowlist decision + test summary + LOC delta + privacy assertion result

## References

- pt-02 §11 Packet 3 (Skill Advisor affordance evidence)
- pt-02 §12 RISK-05 (prompt-stuffing through affordances)
- ADR-012-006 (affordance via existing lanes; no new lane)
- Verified anchors: `skill_graph_compiler.py:43` (ALLOWED_ENTITY_KINDS), `scorer/lanes/derived.ts:9-43`, `scorer/lanes/graph-causal.ts:12-18` (EDGE_MULTIPLIER), `:20-81` (lane logic)
