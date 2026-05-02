---
title: "Plan: Phase [skilled-agent-orchestration/041-sk-recursive-agent-loop/008-sk-recursive-agent-holistic-evaluation/plan]"
description: "Build bottom-up: foundation scripts first, then refactor existing scripts to use them, then update documentation to reflect new architecture."
trigger_phrases:
  - "plan"
  - "phase"
  - "008"
  - "recursive"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/008-sk-recursive-agent-holistic-evaluation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Plan: Phase 008 — Holistic Agent Evaluation

## Approach

Build bottom-up: foundation scripts first, then refactor existing scripts to use them, then update documentation to reflect new architecture.

## Deliverables (Execution Order)

### D1: Integration Scanner (NEW)
**File**: `scripts/scan-integration.cjs`
- Discover all surfaces an agent touches across the repo
- Output JSON manifest with existence, sync status, reference counts
- Reuse walk/discovery logic from check-mirror-drift.cjs

### D2: Dynamic Profile Generator (NEW)
**File**: `scripts/generate-profile.cjs`
- Parse any agent .md → derive scoring profile from its own structure and rules
- Output compatible with existing target-profiles/*.json format
- Extracts: frontmatter, workflow steps, ALWAYS/NEVER rules, output checks, capabilities, anti-patterns

### D3: Refactored Scorer (REFACTOR)
**File**: `scripts/score-candidate.cjs` (434 → ~600 lines)
- Add 5-dimension scoring framework
- Add `--dynamic` flag for profile-derived scoring
- Keep existing handover/context-prime hardcoded checks
- Integration dimension calls scan-integration
- Rule coherence cross-checks ALWAYS/NEVER vs workflow

### D4: Refactored Benchmark (REFACTOR)
**File**: `scripts/run-benchmark.cjs` (213 → ~300 lines)
- Add integration consistency checks as benchmark dimension
- Add cross-reference validation (paths exist?)
- Add permission-capability alignment check

### D5: Refactored Reducer (REFACTOR)
**File**: `scripts/reduce-state.cjs` (383 → ~450 lines)
- Per-dimension score tracking in registry
- Dimensional progress in dashboard
- Stop rules for per-dimension plateaus

### D6-D8: Updated SKILL.md, Agent, Command
- SKILL.md: 5-dimension framework in HOW IT WORKS, updated RULES, new REFERENCES
- Agent: Integration-aware workflow steps, expanded capability scan
- Command: Accept any agent path, add --dynamic flag

### D9: Updated YAML Workflows
- Add integration scanning step
- Add dimensional scoring step

### D10-D11: Updated References and Assets
- evaluator_contract.md: 5-dimension rubric
- loop_protocol.md: Research/Test/Refine phases
- NEW: integration_scanning.md
- Config/manifest/charter/strategy updates

### D12: Runtime Mirror Sync
- Claude, Codex, .agents mirrors updated after canonical changes

## Dependencies

```
D1 (scanner) ←── D3 (scorer uses scanner)
D2 (profiler) ←── D3 (scorer uses profiles)
D3 (scorer) ←── D4 (benchmark extends scoring)
D3 (scorer) ←── D5 (reducer tracks dimensions)
D1-D5 ←── D6-D11 (docs reflect implementation)
D6-D8 ←── D12 (mirrors sync from canonical)
```

## Verification

1. `node scripts/scan-integration.cjs --agent=handover` → finds all surfaces
2. `node scripts/generate-profile.cjs --agent=.opencode/agent/debug.md` → valid profile
3. `node scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --dynamic` → 5-dimension scores
4. `node scripts/score-candidate.cjs --candidate=.opencode/agent/handover.md --profile=handover` → backward-compatible
5. `node scripts/run-benchmark.cjs --profile=handover` → existing fixtures pass
6. `python3 .opencode/skill/sk-doc/scripts/package_skill.py .opencode/skill/sk-improve-agent/ --check` → PASS
