# Deep-Research Iteration Prompt Pack

This prompt pack renders the per-iteration context for a CLI executor (`codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`). You are dispatched once per iteration; write findings to files, not context.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 15
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Next focus: Iteration 1 focus: Enumerate the write targets of /memory:save by reading generate-context.ts, workflow.ts (around the H-56-1 fix at :1259 and :1333), generate-description.ts, and post-save-review.ts. Build the field catalogue for Q1 and identify the 2-3 most likely cross-layer invariants for Q2. Do NOT attempt invariant observation across packets until Q1's catalogue is drafted.

Research Topic: Canonical-save pipeline invariant research for system-spec-kit. Enumerate every state write performed by /memory:save across four layers (frontmatter _memory.continuity, description.json, graph-metadata.json.derived.*, memory vector index). Derive cross-layer invariants. Observe actual invariant holding across the 26 active 026-tree packets. Classify divergences (expected/benign/latent/real). Verify H-56-1 fix scope (workflow.ts:1259 dead-code guard + :1333 plan-only gate). Propose validator assertions with migration notes.

Iteration: 1 of 15
Focus Area: Iteration 1 focus: Enumerate the write targets of /memory:save by reading generate-context.ts, workflow.ts (around the H-56-1 fix at :1259 and :1333), generate-description.ts, and post-save-review.ts. Build the field catalogue for Q1 and identify the 2-3 most likely cross-layer invariants for Q2. Do NOT attempt invariant observation across packets until Q1's catalogue is drafted.

Remaining Key Questions:
- Q1: What state fields does each /memory:save invocation write across the four state layers (frontmatter, description.json, graph-metadata.json.derived.*, memory vector index)? Produce an exhaustive field catalogue.
- Q2: What cross-layer invariants should hold between the four state layers? Derive at least 5 invariants with source-code citations.
- Q3: Does the H-56-1 fix at workflow.ts:1259 (dead-code guard) and :1333 (plan-only gate) fully close the metadata no-op? Verify both full-auto and plan-only dispatch paths.
- Q4: Across the 26 active 026-tree packets, which observed divergences are expected, benign, latent, or real?
- Q5: What validator assertions should be added to enforce the derived invariants, and what migration path handles existing packet-local drift?

Last 3 Iterations Summary: (none - this is iteration 1)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/findings-registry.json
- Write findings to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/iterations/iteration-001.md

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce TWO artifacts per iteration.

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/iterations/iteration-001.md`. Structure: headings for Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **JSONL delta record** appended to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-state.jsonl` with the required schema:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/* optional */]}
```

Both artifacts are REQUIRED.
