# Deep-Research Iteration Prompt Pack

Per-iteration context for the deep-research LEAF agent (cli-codex executor: `gpt-5.5` / reasoning=high / service-tier=fast). This is a GREENFIELD investigation — no backward-compat constraint with 868 existing folders.

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 6
Questions: 0/10 answered | Last focus: (none — first iteration)
Last 2 ratios: n/a -> n/a | Stuck count: 0
resource-map.md emit on synthesis enabled.

Research Topic: Greenfield template-system redesign for spec-kit. Eliminate Level 1/2/3/3+ taxonomy, replace with capability flags. Classify each addon doc (handover, debug-delegation, research, resource-map, context-index) as `author-scaffolded` / `command-owned-lazy` / `workflow-owned-packet`. Design a single manifest that drives both scaffolder AND validator. Identify the MINIMUM anchor + frontmatter contract memory parsers actually require (probe-based, not assumed). Score 5 candidate designs (Design F minimal-scaffold-lazy-addons / Design C+F hybrid / Design B single-manifest-full-doc-templates / Design D section-fragment-library / Design G schema-first); produce final chosen design with refactor plan. Backward-compat with 868 existing folders is OUT OF SCOPE.

Iteration: 1 of 6

Focus Area: **PARSER CONTRACT PROBE (Q4) + IRREDUCIBLE CORE INVENTORY (Q1).** Build a foundation of facts before scoring any design.

Two sub-tasks for this iteration:

1. **Parser contract probe (Q4):** Read these files end-to-end and extract the EXACT parser expectations:
   - `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
   - `.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts`
   - `.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts`
   - `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
   - `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`
   - `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh`
   - `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh`
   - `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh`

   For EACH parser, document:
   - The EXACT frontmatter fields it reads (e.g., `title`, `description`, `_memory.continuity.last_updated_at`)
   - The EXACT anchor patterns it matches (e.g., `<!-- ANCHOR:metadata -->...<!-- /ANCHOR:metadata -->`)
   - Behavior on absence: hard error / warning / silent skip / use-default
   - Whether the parser expects specific section headings (e.g., "## 1. METADATA")

2. **Irreducible core inventory (Q1):** Determine the smallest file set that allows ALL of the following to function:
   - `validate.sh --strict` exits 0 (or 1 with warnings)
   - `memory_context()` and `memory_match_triggers()` find the packet
   - `/spec_kit:resume` rebuilds context
   - `code_graph_query` traverses the packet
   - The deep-research reducer can read its own state files
   
   Hypothesis to test: irreducible = {spec.md (with minimum frontmatter), description.json, graph-metadata.json}. If TRUE, every other file is optional/conditional.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-001.jsonl

## PRIOR-WORK CONTEXT (carryover from sibling packet 010)

The sibling packet `010-template-levels` ran a 10-iter loop with a backward-compat-focused framing. The user rejected its PARTIAL recommendation. However, many factual findings remain useful:

- Templates folder today: 86 files / 13,115 markdown LOC
- Per-level rendered dirs (`templates/{level_1,level_2,level_3,level_3+}/`): exactly 25 markdown files / 4,087 LOC
- 868 spec folders contain `<!-- SPECKIT_TEMPLATE_SOURCE: ... -->` markers (these are descriptive comments — not a constraint on the new system)
- `compose.sh` full recompose: 433 ms; deterministic-against-self YES; byte-equivalent to checked-in goldens NO
- `isPhaseParent()` lives in `mcp_server/lib/spec/is-phase-parent.ts` (TS) and `scripts/lib/shell-common.sh::is_phase_parent` (shell)

DO NOT re-investigate these. Build on them.

DO NOT propose a backward-compat plan or migration script. Out of scope.

## CANDIDATE DESIGNS (to score over the next 5 iterations, NOT this one)

- **Design F**: Minimal scaffold + command-owned addons. Most radical, smallest source surface.
- **Design C+F hybrid**: Capability flags drive scaffold for human-authored docs; command/agent-owned addons stay lazy.
- **Design B**: Single manifest + full-document templates per doc-type. Simplest mental model.
- **Design D**: Section-fragment library with renderer. Maximum reuse.
- **Design G**: Schema-first (data → markdown). Most powerful, likely over-engineered.

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Write ALL findings to files. Do not hold in context.
- Repo root is the cwd. Use full repo-relative paths everywhere; do NOT use `.../` ellipsis paths (the LEAF agent treats them as Gate-3 placeholders).
- Stay within `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/` for writes.
- For the parser-contract probe, USE `Read` and `Grep` only; do not run probes that would mutate state.

## OUTPUT CONTRACT

You MUST produce THREE artifacts:

1. **Iteration narrative markdown** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-001.md`. Structure: headings for Focus, Actions Taken, Findings (with sub-sections for "Parser Contract Map" and "Irreducible Core Verdict"), Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deep-research-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}
```

Append via single-line JSON with newline terminator.

3. **Per-iteration delta file** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-001.jsonl`. One `{"type":"iteration",...}` record + per-event structured records (one per finding/observation/edge/ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED.

## RESEARCH GUIDANCE FOR ITERATION 1

Specifically:

1. **Parser contract map (highest priority):** for each parser file listed above, produce a markdown table in `iteration-001.md` with columns: `Parser File | Frontmatter Fields Read | Anchor Patterns Matched | On Absence (Hard/Warn/Skip) | Section Heading Expectations`.

2. **Irreducible core probe:** start from a hypothetical packet containing ONLY {spec.md with empty body + minimum frontmatter, description.json, graph-metadata.json}. Walk through what each parser would do with this packet. Document which parsers SUCCEED and which FAIL. Identify the minimum frontmatter shape spec.md needs.

3. **Q1 + Q4 closure (or substantial progress):** after the probe, you should be able to answer Q1 (irreducible core) and Q4 (minimum parser contract) with cited evidence.

4. **Next focus suggestion:** based on findings, recommend iteration 2's focus. Likely candidate: addon-doc lifecycle classification (Q3 + Q7) — for each of the 5 cross-cutting templates, identify the agent/command that writes it and whether it's ever author-edited.

Emit findings as `{"type":"finding","id":"f-iter001-NNN",...}` records in iter-001.jsonl. Use graphEvents to capture parser→file edges.
