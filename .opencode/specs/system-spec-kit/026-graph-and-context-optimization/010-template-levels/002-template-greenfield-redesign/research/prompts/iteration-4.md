# Deep-Research Iteration Prompt Pack

cli-codex / gpt-5.5 / reasoning=high / service-tier=fast. GREENFIELD investigation, no backward-compat constraint.

## STATE

Segment: 1 | Iteration: 4 of 6
Last 3 ratios: 0.78 -> 0.82 -> 0.74 | Stuck count: 0
Q1 + Q3 + Q4 + Q7 ANSWERED. Design winner picked iter 3: **C+F hybrid (15 source files)**.
Eliminated: F (16/35), B (24/35), D (26/35), G (31/35).

Iteration: 4 of 6

Focus Area: **MANIFEST SCHEMA + SAMPLE PACKET SCAFFOLDS + GOLDEN TESTS** for C+F hybrid winner.

Three sub-tasks:

1. **Manifest schema (Q5)**: write the COMPLETE JSON Schema for `spec-kit-docs.json` (the single manifest that drives both scaffolder + validator + presets). Cover:
   - Top-level: `kinds[]` (implementation, investigation, documentation, phase-parent), `capabilities[]` (qa-verification, architecture-decisions, governance-expansion), `presets[]` (named UX shorthands)
   - Per-kind: `requiredCoreDocs: string[]` (from current scaffold rules)
   - Per-capability: `addsAuthoredDocs: string[]` + `addsSectionProfiles: string[]` (gated sections inside core docs) + `addsValidationRules: string[]`
   - Per-doc-template: `owner: 'author' | 'command' | 'agent' | 'workflow'`, `creationTrigger: string` (e.g., `scaffold`, `/memory:save`, `@debug`), `absenceBehavior: 'hard-error' | 'warn' | 'silent-skip'`, `templateFile: string`
   - Per-preset: `kind: string` + `capabilities: string[]`
   - Schema MUST be lean enough to read on one screen, but complete enough to express ALL of today's level matrix + the 3 ownership lifecycles.

2. **5 sample packet scaffolds (Q2 + Q6 + Q8)**: produce the full file list each preset would scaffold, written as a markdown table:

   | Preset | Kind | Capabilities | Files Scaffolded (with paths) | Files NOT Scaffolded (would-be-stale) |
   |---|---|---|---|---|
   | `simple-change` | implementation | [] | spec.md, plan.md, tasks.md, impl-summary.md, description.json, graph-metadata.json | checklist.md (no qa), decision-record.md (no arch), all command-owned addons |
   | `validated-change` | implementation | [qa-verification] | + checklist.md | decision-record.md, command-owned |
   | `arch-change` | implementation | [qa-verification, architecture-decisions] | + decision-record.md | command-owned addons (handover, debug-delegation, research) — created lazily by their owners |
   | `governed-change` | implementation | [qa-verification, architecture-decisions, governance-expansion] | + governance sections inside spec.md and decision-record.md (NOT new files — section-only trait) | same lazy addons |
   | `phase-parent` | phase-parent | [] | spec.md (lean), description.json, graph-metadata.json | EVERYTHING ELSE (children carry the heavy docs) |
   | `investigation` | investigation | [] | spec.md, plan.md, tasks.md, impl-summary.md, description.json, graph-metadata.json | research.md is workflow-owned → created by /spec_kit:deep-research |

   Verify the matrix coverage: every current Level 1/2/3/3+/phase-parent behavior is reproducible.

3. **Golden tests (Q9)**: define the test harness that catches template regressions. Specify:
   - Test file location (e.g., `scripts/tests/template-scaffold.vitest.ts`)
   - Assertion shape (e.g., `expect(scaffold('arch-change')).toMatchSnapshot()`)
   - CI hook (e.g., `.github/workflows/template-tests.yml` or existing CI integration point)
   - 5 test cases (one per preset) + 1 "minimum-viable spec.md" case (validates parser-contract probe from iter 1)

## CARRY-OVER FACTS

From iter 1: irreducible runtime core = spec.md + description.json + graph-metadata.json
From iter 2: addon lifecycle table — handover (command-owned-lazy), debug-delegation (agent-exclusive), research (workflow-owned-packet), resource-map (mixed), context-index (author-scaffolded)
From iter 3: C+F hybrid winner; 15 source files; concrete file inventory:
- 1 manifest: `templates/manifest/spec-kit-docs.json`
- 4 authored core: spec/plan/tasks/impl-summary `.md.tmpl`
- 3 capability-gated authored: checklist/decision-record/phase-parent.spec `.md.tmpl`
- 2 author-scaffolded optional: resource-map/context-index `.md.tmpl`
- 3 command/agent/workflow-owned lazy templates: handover/debug-delegation/research `.md.tmpl`
- 2 unaccounted (assume: scaffolder script + validator script)

## STATE FILES

- Config / State Log / Strategy / Registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json}`
- Prior iterations: iteration-001.md, iteration-002.md, iteration-003.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/deltas/iter-004.jsonl

## CONSTRAINTS

- LEAF agent. No sub-agents. Max 12 tool calls.
- Read iteration-003.md FIRST for the design choice + file inventory.
- Use full repo-relative paths. NO `.../`.
- Stay within `011-template-greenfield-redesign/research/` for writes.

## OUTPUT CONTRACT

THREE artifacts:
1. `iteration-004.md` narrative with: Focus / Actions Taken / Findings (sub-sections: "Manifest Schema", "Sample Scaffold Matrix", "Golden Test Design") / Questions Answered / Questions Remaining / Next Focus
2. State log JSONL append: `{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[/*optional*/]}`
3. `iter-004.jsonl` delta file

## RESEARCH GUIDANCE FOR ITERATION 4

1. **Write the manifest schema as a complete fenced JSON code block** — not pseudo-code. Should be ~50-100 lines of actual JSON Schema or example JSON instance. Include comments via `// $comment` if helpful.
2. **Sample scaffolds**: produce the 6-row table above with concrete file lists. Verify `simple-change` produces ≤6 files, `arch-change` produces ≤7, `phase-parent` produces ≤3.
3. **Golden tests**: 5 preset snapshots + 1 minimum-viable case = 6 test cases. Define the scaffold function signature and snapshot format.
4. **Edge case validation**: explicitly confirm the manifest can express:
   - Section-only traits (governance-expansion adds NO files but adds sections inside existing files)
   - Lazy addon owners (handover.md absence is `silent-skip` for validator, but `/memory:save` triggers creation)
   - Phase-parent lean trio
5. **Next focus suggestion**: based on remaining questions, recommend iter 5 focus. Likely: refactor plan (Q10 inline-gating choice + concrete file changes in `create.sh`, `check-files.sh`, etc.) and risk register synthesis.

Emit findings as `{"type":"finding","id":"f-iter004-NNN",...}`. Use graphEvents for manifest→capability→template edges.
