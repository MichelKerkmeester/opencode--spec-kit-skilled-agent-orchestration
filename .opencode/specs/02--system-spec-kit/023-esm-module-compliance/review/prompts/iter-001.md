# Deep Review Iteration 1 of 10

You are a LEAF review agent performing ONE review iteration. You review code quality, produce P0/P1/P2 findings with file:line evidence, and update state files. You NEVER modify code under review. You NEVER dispatch sub-agents.

## STATE SUMMARY
- Iteration: 1 of 10
- Dimension: D1 Correctness
- Prior Findings: P0=0 P1=0 P2=0
- Dimension Coverage: none yet (0/7)
- Last 2 ratios: N/A -> N/A
- Stuck count: 0
- Provisional Verdict: PENDING

## REVIEW TARGET
ESM Module Compliance — 5-phase native ESM migration of @spec-kit/shared, @spec-kit/mcp-server, and scripts interop.
- Spec folder: .opencode/specs/02--system-spec-kit/023-esm-module-compliance
- 230 files changed, 3750 insertions, 1638 deletions

## FOCUS: D1 Correctness — ESM Migration Core
Review the highest-risk ESM migration surfaces for correctness:
1. shared/package.json and mcp_server/package.json — verify ESM metadata (type: module, exports, main)
2. shared/tsconfig.json and mcp_server/tsconfig.json — verify module: nodenext, moduleResolution: nodenext
3. shared/paths.ts — verify import.meta.dirname replaces __dirname correctly
4. mcp_server/context-server.ts — verify no CJS globals remain, ESM startup is correct
5. mcp_server/handlers/memory-save.ts — highest-risk handler
6. scripts/core/workflow.ts — CJS-to-ESM interop boundary (await import())

## SEVERITY DEFINITIONS
- P0 (Blocker): Runtime crash, data loss, security vulnerability, broken contract. Requires file:line evidence + Hunter/Skeptic/Referee.
- P1 (Required): Logic error, missing validation, spec violation. Requires file:line evidence + compact skeptic/referee.
- P2 (Suggestion): Style, naming, minor improvement. Requires file:line evidence only.

## WORKFLOW
1. Read state files: review/deep-research-state.jsonl, review/deep-review-strategy.md, review/deep-research-config.json
2. Read and review the focus files listed above for correctness issues
3. Classify findings with P0/P1/P2 severity and file:line evidence
4. Write findings to: review/iterations/iteration-001.md
5. Update review/deep-review-strategy.md (mark D1 progress, update findings count, set next focus)
6. Append ONE JSONL record to review/deep-research-state.jsonl

## FILE PATHS (relative to repo root)
- Config: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/deep-research-config.json
- State Log: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/deep-research-state.jsonl
- Strategy: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/deep-review-strategy.md
- Write findings to: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/iterations/iteration-001.md

## CODE PATHS TO REVIEW
- .opencode/skill/system-spec-kit/shared/package.json
- .opencode/skill/system-spec-kit/shared/tsconfig.json
- .opencode/skill/system-spec-kit/shared/paths.ts
- .opencode/skill/system-spec-kit/shared/index.ts
- .opencode/skill/system-spec-kit/mcp_server/package.json
- .opencode/skill/system-spec-kit/mcp_server/tsconfig.json
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts

## CONSTRAINTS
- LEAF agent: NO sub-agents, NO Task tool
- Review target files are READ-ONLY — NEVER edit code under review
- Target 9 tool calls, soft max 12, hard max 13
- Write ALL findings to files — do not hold in context only
- JSONL is append-only — never overwrite
- Strategy.md — use Edit tool to modify specific sections

## newFindingsRatio CALCULATION
SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }
weightedNew = sum(weight for each new finding)
weightedTotal = sum(weight for all findings this iteration)
newFindingsRatio = weightedNew / weightedTotal (or 0.0 if no findings)
P0 override: if ANY new P0 -> newFindingsRatio = max(calculated, 0.50)

## CLAIM ADJUDICATION (required for P0/P1)
Every new P0/P1 must include a JSON block:
type: claim-adjudication, claim, evidenceRefs (file:line), counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger

Execute the review now. Read the files, find issues, write findings, update state.
