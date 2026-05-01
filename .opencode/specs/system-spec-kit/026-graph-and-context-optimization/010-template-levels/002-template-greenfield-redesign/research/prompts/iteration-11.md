# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast.

## STATE

Segment: 1 | Iteration: 11 of 14
Last 10 ratios: 0.78 -> 0.82 -> 0.74 -> 0.67 -> 0.58 -> 0.47 -> 0.41 -> 0.38 -> 0.06 -> 0.64
Status from iter 10: `reopened-invariant-mitigation-required`. Design survives but needs explicit mitigations.

Iteration: 11 of 14

Focus Area: **LOCK IN WORKFLOW INVARIANCE.** Write ADR-005 + concrete invariant-locking diffs + the `resolve_level_contract(level)` API.

Four sub-tasks:

1. **ADR-005 draft**: write the full ADR-005 ready to drop into `decision-record.md`. Cover:
   - Status (Accepted), Date, Deciders
   - Context (workflow invariant constraint from user 2026-05-01)
   - Decision (level vocabulary remains the SOLE public/AI-facing surface; preset/capability/kind names are STRICTLY internal to the manifest + scaffolder)
   - Specific bans:
     - NO `--preset X` flag in public CLI (drop from `create.sh --help`)
     - NO mention of "preset", "capability", "kind" in any: `CLAUDE.md`, `AGENTS.md`, `SKILL.md`, `.opencode/command/*.md`, `.opencode/agent/*.md`, `.opencode/skill/system-spec-kit/SKILL.md`, validator error messages, scaffolder log lines, frontmatter exposed to the AI
     - YES keep `--level N` flag, `<!-- SPECKIT_LEVEL: N -->` markers, `level: N` frontmatter, `Level 1/2/3/3+` taxonomy in user-facing docs
   - Consequences (what improves / what costs / risks)
   - Five Checks evaluation (PASS/FAIL each)
   - Implementation (point to iter 11 diffs)

2. **Define `resolve_level_contract(level)` API exactly**:
   - Signature: `resolveLevelContract(level: '1' | '2' | '3' | '3+' | 'phase'): LevelContract`
   - Return type fields: `requiredCoreDocs[]`, `requiredAddonDocs[]`, `lazyAddonDocs[]`, `sectionGates: Map<sectionId, level[]>`, `frontmatterMarkerLevel: number`
   - Where it lives: `mcp_server/lib/templates/level-contract-resolver.ts` (NEW). NOT named with manifest/preset/capability words even though internally it queries `spec-kit-docs.json`.
   - Shell wrapper: `scripts/lib/template-utils.sh::resolve_level_contract <level>` returning JSON via stdout.
   - Internal implementation: reads `spec-kit-docs.json`, traverses preset-for-level → capabilities → required docs. ALL internal. Caller never sees those words.

3. **Revise the iter-7 concrete diffs to honor invariance**:
   - `create.sh` diff: drop `--preset X` from `--help` text; rename internal variables from `preset_name` / `capabilities[]` to `level` / `level_contract`; log lines say "scaffolding Level 3 spec folder" not "scaffolding arch-change preset"
   - `check-files.sh` diff: error messages say "Level 3 packet missing required file: decision-record.md" NOT "capability=architecture-decisions missing required file"
   - `check-sections.sh` / `check-template-headers.sh` / `check-section-counts.sh` diffs: same pattern
   - List 5-10 specific log/error message strings that must be enforced

4. **Revise the `research.md` synthesis language**:
   - Today's iter-9 research.md says "levels disappear". This is WRONG under the new constraint.
   - Correct framing: **"the on-disk `templates/level_N/` folders disappear; the `--level N` user-facing API stays."** Levels remain the PUBLIC contract. The internal implementation moves from level-as-folder-tree to level-as-manifest-row.
   - Identify every line in `research/research.md` that needs the language fix.
   - Write a 1-paragraph "Workflow Invariance Addendum" to be inserted at top of research.md as §0 or §1.5.

## CARRY-OVER FACTS

From iter 10:
- Today's classifier emits a level number; new design accepts that as input via `--level N` flag
- ALL spec-folder-related slash commands and AI-facing skill text use "Level" vocabulary today
- Validator error messages today mention "Level N" — must continue to
- `<!-- SPECKIT_LEVEL: N -->` marker is in 868 existing folders + every Level-N template
- 4 open questions surfaced iter 10 — answer all 4 in iter 11 (graph-metadata.json contract scope; field shape; --preset ban scope; ADR-004 amendment)

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md through iteration-010.md
- Synthesis (current): `research.md` (40.9 KB) — will be addended in iter 14
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-011.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-011.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-010.md FIRST.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.
- ADR-005 is ADDITIVE to ADR-001/002/003/004; doesn't supersede ADR-004 (just narrows it).

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-011.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "ADR-005 Draft (full)", "resolve_level_contract API spec", "Revised Iter-7 Diffs", "Synthesis Language Revisions", "4 Open Questions Resolved") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":11,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-011.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 11

1. ADR-005 should fit on 1.5 screens — concise + complete.
2. The API spec should be a TypeScript code block + a shell wrapper sketch.
3. Diff revisions should be specific — quote the iter-7 lines that change.
4. Synthesis language: list the 5-10 sentences in research.md that need the "levels disappear → level folders disappear" fix.
5. **Next focus**: iter 12 should re-run the validator/scaffolder integration probe with the workflow-invariant lens (verify EVERY user-visible output stays level-only), checking against the actual current source code, not just the proposed diffs.

Emit findings as `{"type":"finding","id":"f-iter011-NNN",...}`.
