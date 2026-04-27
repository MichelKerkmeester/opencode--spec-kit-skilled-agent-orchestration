# Deep-Review Iteration 1 — Inventory + Correctness + Cross-Runtime Parity

## STATE

STATE SUMMARY:
Iteration: 1 of 5
Dimension: correctness (inventory pass + cognitive carve-out validation + cross-runtime parity audit)
Review Target: PR1-PR5 phrasing-audit verification on 001-memory-terminology + corrective wave (PR3-extra)
Review Scope: 41 files spanning spec packet (2), top-level skill prose (8), feature_catalog mirrors (5), manual_testing_playbook (1), slash commands (12: 4 .opencode + 4 .claude + 4 .gemini), agent definitions (4: 3 .md + 1 .toml across .opencode/.claude/.gemini/.codex), runtime code (4), cognitive carve-out (4)
Prior Findings: P0=0 P1=0 P2=0 (fresh session, but corrective edits already landed pre-dispatch — see deep-review-state.jsonl `pre_iteration_correction` event)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Provisional Verdict: PENDING hasAdvisories=false

## REVIEW CONTRACT (from spec.md REQ-001)

Verify the ~164 PR1-PR5 + ~16 PR3-extra runtime-mirror edits hold the **scope-freeze contract**:

1. **Zero identifier renames** (P0 if any rename detected):
   - 21 `memory_*` MCP tools: memory_context, memory_search, memory_quick_search, memory_match_triggers, memory_save, memory_update, memory_delete, memory_list, memory_index_scan, memory_validate, memory_health, memory_stats, memory_bulk_delete, memory_get_learning_history, memory_drift_why, memory_causal_link, memory_causal_unlink, memory_causal_stats, memory_ingest_start, memory_ingest_status, memory_ingest_cancel
   - 4 slash commands: /memory:save, /memory:search, /memory:learn, /memory:manage
   - Frontmatter key `_memory:` (must remain unchanged in all spec docs)
   - All `memory_*` SQL tables incl. `working_memory`
   - 17 `memory-*.ts` handler filenames in `mcp_server/handlers/`
   - Folder names: `references/memory/`, `scripts/dist/memory/`
   - All `MEMORY_*` constants

2. **Cognitive-science loanwords preserved** (P0 if substituted):
   - `FSRS_*`, `Free Spaced Repetition Scheduler`, `Miller`, `working_memory`, `spreading activation`, `Collins-Loftus`

3. **Vocabulary substitutions accurate** per phrasing-audit.md:
   - `memory` → `spec-doc record` (when referring to indexed records)
   - `memory` → `indexed continuity` (when referring to retrieval system)
   - `memory` → `constitutional rule` (when in constitutional/ tier)
   - `memory` → `packet` (when referring to spec folder bundles)
   - `memory` → `causal-graph node` (when referring to graph entities)

4. **No semantic drift** introduced
5. **No broken anchors or cross-doc links**
6. **Runtime output strings** in handlers don't break vitest snapshot tests (e.g. `causal-graph.ts:586-587` `'Memory ID that is the cause/source'` — known retained verbatim in operator docs via `(runtime string preserved verbatim)` parenthetical)
7. **`spec.md` + `phrasing-audit.md`** internally consistent
8. **Cross-runtime mirror parity** (NEW from this session): `.opencode/agent/context.md` ≡ `.claude/agents/context.md` ≡ `.gemini/agents/context.md` ≡ `.codex/agents/context.toml` for vocabulary substitutions, modulo runtime path differences. Same for slash commands across `.opencode/command/memory/`, `.claude/commands/memory/`, `.gemini/commands/memory/`.

## ITERATION 1 FOCUS

**Five-step inventory**:

A. **Identifier-rename audit (highest priority — any hit = P0)** — grep across the entire repo for evidence that any of the no-touch identifiers were accidentally renamed:
   ```
   grep -rn 'memory_search\|memory_save\|memory_context\|memory_match_triggers' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | wc -l
   grep -rn 'memory_quick_search\|memory_list\|memory_update\|memory_delete' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | wc -l
   grep -rn '/memory:save\|/memory:search\|/memory:learn\|/memory:manage' .opencode/command/memory/
   grep -rn '^_memory:' .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/spec.md
   ls .opencode/skill/system-spec-kit/mcp_server/handlers/memory-*.ts | wc -l    # expect 17
   ```
   All 21 tools should appear; `memory-*.ts` count == 17; `_memory:` frontmatter intact.

B. **Cognitive carve-out validation** — read these 4 files and confirm:
   - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts`
   `FSRS`, `Free Spaced Repetition Scheduler`, `Miller`, `Collins-Loftus`, `spreading activation`, and `working_memory` MUST appear unchanged where the algorithm depends on them.

C. **Cross-runtime mirror parity check** — verify all 4 context agents have parity on the 6 PR3 vocabulary edits:
   ```
   for f in .opencode/agent/context.md .claude/agents/context.md .gemini/agents/context.md .codex/agents/context.toml; do
     grep -c 'spec-doc record' "$f"        # all must equal 5
     grep -c 'Record #\[ID\]' "$f"        # all must equal 2
     grep -cE 'relevant memories|all memories|Memory #\[ID\]' "$f"   # all must equal 0
   done
   ```
   Same parity for `.opencode/command/memory/{save,search,learn,manage}.md` ≡ `.claude/commands/memory/*.md` (md5 match expected).
   For `.gemini/commands/memory/*.toml`: regenerated from modernized .md, decoded `spec-doc record` count should be ≥ corresponding .md count.

D. **Headline-pattern verification** — confirm these zero-out in operator-facing markdown:
   ```
   grep -rE '\b(your|the)\s+memor(y|ies)\b' .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/README.md .opencode/skill/system-spec-kit/references/ .opencode/skill/system-spec-kit/constitutional/ | grep -v 'cognitive/'
   grep -nE 'Loaded [0-9]+ memor' .opencode/skill/system-spec-kit/references/validation/decision_format.md
   ```
   Both should return zero hits in operator-facing docs (cognitive subsystem files are exempt per REQ-007).

E. **spec.md vs phrasing-audit.md consistency** — open both and confirm REQ-001..REQ-008 in spec.md align with vocabulary key + grid in phrasing-audit.md. Particularly:
   - REQ-001 hard no-touch list matches phrasing-audit.md "Hard No-Touch List"
   - Vocabulary substitutions in REQ-002..REQ-005 align with vocabulary key
   - Cognitive carve-out (REQ-007) matches the literature loanword list

## SHARED DOCTRINE

If accessible, load `.opencode/skill/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS (this iteration: correctness focus)

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime (heightened priority this iteration), feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION (mandatory for new P0/P1)

Every new P0/P1 finding MUST include: `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, `downgradeTrigger`.

## STATE FILES (paths relative to repo root)

- Config: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-config.json`
- State Log: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deltas/iter-001.jsonl`

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files. Only write to the state files listed above.
- Append a single JSONL record (single line, no pretty-print) to the state log with: type=iteration, iteration=1, dimensions, filesReviewed (count), findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio.

## OUTPUT CONTRACT (REQUIRED)

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/iterations/iteration-001.md`. Sections: Dimension, Files Reviewed (with counts), Findings by Severity (P0/P1/P2 with file:line evidence), Traceability Checks, Verdict, Next Dimension recommendation.

2. **Canonical JSONL iteration record** APPENDED to the state log. EXACT type=iteration:

```json
{"type":"iteration","iteration":1,"dimensions":["correctness"],"filesReviewed":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"graphEvents":[]}
```

Single-line JSON. Newline-terminated. Use `printf '%s\n' '<single-line-json>' >> <state_log_path>`.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/review/deltas/iter-001.jsonl`. One iteration record + one record per finding/classification/ruled_out/graphEvent.

All three artifacts are REQUIRED.

## NEW-FINDINGS-RATIO COMPUTATION

For iteration 1: `newFindingsRatio = (P0_new × 10 + P1_new × 5 + P2_new × 1) / 100`. Cap at 1.0. If any new P0 → ratio = max(calculated, 0.50). Clean pass (zero findings) → 0.0.

## PROCEED

Execute the 5-step inventory now. Be evidence-driven, file:line precision required for any P0/P1.
