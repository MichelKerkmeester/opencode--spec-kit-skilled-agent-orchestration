# $refine TIDD-EC Prompt: 006-ralph-main

You are executing a phase-local research mission inside `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-feature-roadmap/001-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main`.

Your job is to research `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-feature-roadmap/001-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/ralph-main` and identify concrete, evidence-backed improvements for `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, with emphasis on agent orchestration, Spec Kit workflows, memory and context preservation, MCP tooling, validation gates, and operational safety.

Follow this workflow exactly:

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-feature-roadmap/001-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main` as the already-approved spec folder. Do not ask the spec-folder question again and do not create a different packet.
2. Read the governing `AGENTS.md` files before making any changes. The `external/` tree is read-only for this task.
3. Before any deep-research run, create proper Level 3 Spec Kit documentation in this phase folder:
   - `spec.md`
   - `plan.md`
   - `tasks.md`
   - `checklist.md`
   - `decision-record.md`
4. Use `@speckit` for spec-folder markdown authoring when the runtime supports agent routing. Keep all writable artifacts inside this phase folder only.
5. Validate the documentation before moving on:
   - `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-feature-roadmap/001-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main" --strict`
6. After the Level 3 docs exist and validate, run `spec_kit:deep-research` against this same phase folder, not a new one. Use the external repo above as the primary research target.
7. Use CocoIndex plus targeted file reads and grep sweeps to understand the external system. Prefer exact file-path evidence, not vague summaries.
8. Save research outputs into this phase folder, especially under `research/`.
9. When the research pass is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
   - `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-feature-roadmap/001-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main"`

Use this exact deep-research topic:

`Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-feature-roadmap/001-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/ralph-main and identify concrete improvements for Code_Environment/Public, especially around agentic workflows, spec documentation, memory and context systems, MCP/tool integration, validation, and operational safety.`

Research questions to answer:

- What patterns from this external system could materially improve this repo?
- Which findings are ready to adopt now with low integration risk?
- Which findings require an experiment or follow-on packet first?
- Which ideas should be rejected or avoided, and why?

Required format for every meaningful finding:

- Source evidence with exact file paths
- What the external system does
- Why it matters for this repo
- Recommended action: `adopt now`, `prototype later`, or `reject`
- Affected area in this repo
- Risk, migration cost, or validation requirement

Completion bar:

- Level 3 docs exist before deep research starts
- `research/research.md` contains evidence-backed findings
- `checklist.md` is updated with evidence
- `implementation-summary.md` exists at the end
- Memory save completed successfully
- No edits outside this phase folder
