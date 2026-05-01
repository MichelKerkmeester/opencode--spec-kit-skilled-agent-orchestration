# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast). GREENFIELD investigation, no backward-compat constraint.

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 2 of 6
Last 1 ratio: 0.78 | Stuck count: 0
Q1 ANSWERED (irreducible core = spec.md + description.json + graph-metadata.json)
Q4 ANSWERED for 8 probed parsers (flagged: more level-encoding validators may exist beyond the 8 probed)

Research Topic: Greenfield template-system redesign. Eliminate Level 1/2/3/3+. Replace with capability flags. Classify addon docs by ownership lifecycle. Single manifest drives both scaffolder + validator. Identify MINIMUM parser contract. Score 5 candidate designs (F / C+F hybrid / B / D / G). Backward-compat with 868 existing folders is OUT OF SCOPE.

Iteration: 2 of 6

Focus Area: **ADDON-DOC LIFECYCLE CLASSIFICATION (Q3 + Q7).** For each cross-cutting addon, identify the writer owner, classify as `author-scaffolded` / `command-owned-lazy` / `workflow-owned-packet`, and document validator/parser expectations on absence. Also: cover the gap iter 1 flagged — find the "level-encoding" validators outside the 8 probed (`check-sections.sh`, `check-level-match.sh`, `check-section-counts.sh`, `check-template-headers.sh`, strict TS `spec-doc-structure`, canonical-save checks).

Three sub-tasks:

1. **Addon lifecycle classification (Q3 + Q7):** for each of the 5 addon docs, fill the table:

   | Addon | Writer (author/command/agent/workflow) | Trigger to create | Author-edited after creation? | Validator behavior on absence |
   |---|---|---|---|---|
   | handover.md | ? | ? | ? | ? |
   | debug-delegation.md | ? | ? | ? | ? |
   | research.md | ? | ? | ? | ? |
   | resource-map.md | ? | ? | ? | ? |
   | context-index.md | ? | ? | ? | ? |

   Read writer code: search `.opencode/skill/`, `.opencode/command/`, `.opencode/agent/` for writes to each filename. Document the path and trigger.

2. **Level-encoding validator survey (Q4 deepening):** read these files and classify how each encodes level taxonomy:
   - `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh`
   - `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh`
   - `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh`
   - `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh`
   - Any TS in `.opencode/skill/system-spec-kit/mcp_server/` matching `spec-doc-structure`
   - Canonical-save checks: `check-canonical-save-*.sh` if present
   
   For each: which level constants are hardcoded? Which level→file mappings? Are these EASY or HARD to refactor to a manifest-driven approach?

3. **Q2 readiness (capability-flag matrix verification):** based on findings 1+2, sketch the trait→required-files matrix for current Level 1/2/3/3+ behavior. Verify the mapping is total (every current required-file is captured) and minimal (no spurious entries).

## STATE FILES

All paths repo-relative.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/findings-registry.json
- Prior iteration: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-001.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-002.jsonl

## CARRY-OVER FACTS (from iter 1)

- **Irreducible runtime core**: spec.md + description.json + graph-metadata.json
- **Resume ladder priority**: implementation-summary.md → spec.md → plan.md → tasks.md → checklist.md → decision-record.md → research.md → handover.md → resource-map.md (any one is sufficient for spec-doc fallback)
- **description.json schema** required: {specFolder, description, keywords, lastUpdated}; optional {specId, folderSlug, parentChain, memorySequence, memoryNameHistory, title, type, trigger_phrases, path}
- **graph-metadata.json schema** required: schema_version=1, packet_id, spec_folder, parent_id, children_ids, manual.{depends_on, supersedes, related_to}, derived.{trigger_phrases, key_topics, importance_tier, status, key_files, entities, causal_summary, created_at, last_save_at, last_accessed_at, source_docs}
- **Thin continuity (in implementation-summary.md `_memory.continuity` block)**: required {packet_pointer, last_updated_at, last_updated_by, recent_action, next_safe_action}; optional {blockers, key_files, session_dedup, completion_pct, open_questions, answered_questions}; serialize <2048 bytes
- **Memory parser**: indexes description.json as `description_metadata`, graph-metadata.json as `graph_metadata`, derives trigger phrases from description metadata
- **Authored validation scaffold (TODAY)**: spec.md + plan.md + tasks.md for ordinary packets, plus template provenance markers and optional capability-gated docs
- **Reduce-state.cjs** (deep-research reducer): expects strict ANCHOR sections in strategy.md (`key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`); parses iteration + event records from state.jsonl

## CANDIDATE DESIGNS (to score in iter 4-5)

- **F**: Minimal scaffold + command-owned addons
- **C+F hybrid**: Capability flags drive scaffold for human-authored docs; command/agent-owned addons stay lazy
- **B**: Single manifest + full-document templates per doc-type
- **D**: Section-fragment library with renderer
- **G**: Schema-first (data → markdown)

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-001.md FIRST for the parser contract map.
- Use full repo-relative paths everywhere. NO `.../` ellipsis.
- Stay within `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/` for writes.
- Read-only investigation; no state mutation outside the research/ packet.

## OUTPUT CONTRACT

THREE artifacts:

1. **Iteration narrative** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-002.md`. Structure: Focus / Actions Taken / Findings (sub-sections: "Addon Lifecycle Table", "Level-Encoding Validator Survey", "Trait→Required-Files Matrix Sketch") / Questions Answered / Questions Remaining / Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-state.jsonl`:

```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}
```

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-002.jsonl`. One iteration record + per-event records.

## RESEARCH GUIDANCE FOR ITERATION 2

1. **Addon writer search**: `grep -rln "handover.md\|debug-delegation.md\|research.md\|resource-map.md\|context-index.md" .opencode/{skill,command,agent}/` — find every place that writes/edits these. Distinguish `handover.md` (author-edited starter? OR /memory:save written?) from `research.md` (workflow-owned by /spec_kit:deep-research).

2. **Validator survey**: read each validator file, document level constants. The crucial question: is "Level N requires file X" hardcoded as a switch/case, OR does it consult a manifest? If switch/case, refactor cost = N × validator-file-count. If already manifest-driven for some, identify which.

3. **Trait→file matrix**: for each current Level (1/2/3/3+/phase-parent), list the required file set. Then propose the trait set that produces it: e.g., Level 3 = (kind=implementation) × (traits={qa, arch}). Verify matrix coverage.

4. **Next focus suggestion**: based on findings, recommend iter 3's focus. Likely candidate: design 5 candidates head-to-head against the parser-contract reality + addon lifecycle table — eliminate any design that violates these.

Emit findings as `{"type":"finding","id":"f-iter002-NNN",...}`. Use graphEvents for writer→addon-doc edges.
