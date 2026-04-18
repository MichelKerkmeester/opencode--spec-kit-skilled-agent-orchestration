# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-research` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated): Session dr-20260418T120854Z-9c57f9 | Iteration: 1 of 30 | Questions: 0/10 answered | Last focus: none (first iteration) | Last 2 ratios: n/a -> n/a | Stuck count: 0 | Next focus: H-56-1 cascade consistency across the 16-folder sweep.

Research Topic: Post-Phase-017 refinement, improvement, bug, and follow-up surface under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/`. Investigate: metadata-freshness regen stability (H-56-1 aftermath + description.json auto-regen preserve-field gaps), code-graph readiness vocabulary completeness across the 7 sibling handlers, NFKC + evidence-marker + lint false-positive surfaces, retry-budget policy calibration (N=3 empirical basis), AsyncLocalStorage caller-context propagation edge cases, Copilot autonomous-execution hardening preconditions, Wave-D deferred P2 coupling risk (R55-P2-002/003/004), + 16-folder canonical-save sweep ordering invariants. Deliverable: Phase-019+ scoping document with prioritized findings (P0/P1/P2), reproduction paths, + risk-ranked remediation candidates.

Iteration: 1 of 30
Focus Area: H-56-1 cascade consistency. Inspect `description.json.lastUpdated` and `graph-metadata.json.derived.last_save_at` timestamps across all spec folders affected by Phase 017's 16-folder canonical-save sweep. Identify ordering anomalies, clock-skew risks, or staleness beyond the 10-minute continuity threshold.
Remaining Key Questions:
- Q1. H-56-1 cascade ordering consistency
- Q2. description.json auto-regen preserve-field gaps
- Q3. 7-handler readiness vocabulary completeness
- Q4. NFKC homoglyph coverage beyond 5 tested scripts
- Q5. N=3 retry budget empirical basis
- Q6. AsyncLocalStorage caller-context async-boundary propagation
- Q7. Copilot observability gaps post-Cluster E
- Q8. Wave-D deferred P2 coupling risk
- Q9. Evidence-marker lint false-positive surfaces
- Q10. Continuity-freshness 10-minute threshold calibration

Last 3 Iterations Summary: None (first iteration).

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/findings-registry.json
- Write findings to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/iterations/iteration-001.md

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of objects describing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.
- Working directory for all reads/writes: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## OUTPUT CONTRACT

You MUST produce TWO artifacts per iteration. The YAML-owned post_dispatch_validate step will emit a `schema_mismatch` conflict event if either is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/iterations/iteration-001.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **JSONL delta record** appended to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/017-cli-runtime-executors-001-executor-feature/deep-research-state.jsonl` with the required schema:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
```

Both artifacts are REQUIRED. The reducer consumes the JSONL delta to update the registry, dashboard, and machine-owned strategy sections. The markdown narrative is the human-readable record.
</content>
</invoke>
