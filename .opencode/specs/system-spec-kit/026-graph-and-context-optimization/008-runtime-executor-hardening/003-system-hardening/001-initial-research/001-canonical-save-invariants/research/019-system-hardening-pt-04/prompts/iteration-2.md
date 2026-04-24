# Deep-Research Iteration Prompt Pack

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast`. Write findings to files, not context.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 15
Questions: 0/5 formally answered (Q1 draft catalogue present in iteration-001.md) | Last focus: Q1 field catalogue across 4 state layers
Last 2 ratios: N/A -> 0.68 | Stuck count: 0
Last iteration summary: run 1: Q1 write-target catalogue drafted across frontmatter (_memory.continuity), description.json, graph-metadata.json.derived.*, and vector index; 4 findings registered. newInfoRatio=0.68.

Research Topic: Canonical-save pipeline invariant research for system-spec-kit. Enumerate every state write performed by /memory:save across four layers (frontmatter _memory.continuity, description.json, graph-metadata.json.derived.*, memory vector index). Derive cross-layer invariants. Observe actual invariant holding across the 26 active 026-tree packets. Classify divergences (expected/benign/latent/real). Verify H-56-1 fix scope (workflow.ts:1259 dead-code guard + :1333 plan-only gate). Propose validator assertions with migration notes.

Iteration: 2 of 15
Focus Area: Extend iteration 1's Q1 field catalogue with any missed fields, then pivot to Q2 (derive cross-layer invariants) and Q3 (verify H-56-1 fix scope across full-auto AND plan-only dispatch paths). Read iteration-001.md first to anchor. For Q2, aim for 5+ invariants with source-code citations (e.g., description.json.lastUpdated >= max(frontmatter last_updated_at); graph-metadata.json.derived.last_save_at == description.json.lastUpdated; memorySequence monotonic-increasing; save_lineage == 'same_pass' when workflow writes both description.json and graph-metadata.json in one pass). For Q3, read workflow.ts around :1259 and :1333 (which iteration 1 already traced but should be verified explicitly: is the plan-only path now fully symmetric with full-auto, or are there remaining gates?).

Remaining Key Questions:
- Q1 (draft exists, verify exhaustive): What state fields does each /memory:save invocation write across the four state layers? See iteration-001.md for the current draft catalogue. Check for any missed fields in post-insert metadata, session_dedup, or quality-flags.
- Q2 (active focus): What cross-layer invariants should hold between the four state layers? Derive at least 5 invariants with source-code citations.
- Q3 (active focus): Does the H-56-1 fix at workflow.ts:1259 + :1333 fully close the metadata no-op? Verify both full-auto and plan-only dispatch paths.
- Q4 (blocked on Q2): Across 26 active 026-tree packets, which observed divergences are expected/benign/latent/real?
- Q5 (blocked on Q2+Q4): What validator assertions should be added, and what migration path?

Last 3 Iterations Summary: run 1: Q1 field catalogue draft (ratio 0.68)

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/findings-registry.json
- Prior iteration: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/iterations/iteration-001.md
- Write findings to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/iterations/iteration-002.md

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- Read iteration-001.md first to anchor on prior findings.
- For Q2 invariants: cite exact file:line for each. No speculation without source.
- For Q3: distinguish "restored by H-56-1" vs "still gated" vs "was never gated".
- When emitting the iteration JSONL record, include a `graphEvents` array of `{type, id, label, relation?, source?, target?}` for new nodes (QUESTION/FINDING/INVARIANT) and edges (ANSWERS/SUPPORTS/DERIVES).

## OUTPUT CONTRACT

You MUST produce TWO artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-001-canonical-save-invariants/iterations/iteration-002.md`. Structure: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Next Focus.

2. **JSONL delta record** appended to the state log:

```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}
```

Both REQUIRED.
