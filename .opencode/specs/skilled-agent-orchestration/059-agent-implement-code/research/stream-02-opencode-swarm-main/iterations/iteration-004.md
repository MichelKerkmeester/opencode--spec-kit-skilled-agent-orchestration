# Iteration 004 - Q1 Skill Auto-Loading Patterns

## Focus

Q1: identify how opencode-swarm-main agents pick up skills or contextual expertise from architect dispatch. Treat "skill" broadly: knowledge, capability, role expertise, scope, or any dispatch-time context beyond the static worker prompt and task envelope.

## Actions Taken

1. Listed `src/knowledge/`, `src/context/`, `src/hooks/`, and `src/commands/` for skill/knowledge/context loader surfaces.
2. Searched `src/agents/architect.ts` and `src/agents/coder.ts` for skill, knowledge, context, load, and dispatch references.
3. Read the knowledge storage, reader, injector, config, command, and recall tool paths.
4. Read the system enhancer and role filter paths to distinguish automatic worker context injection from architect-mediated task context.
5. Rechecked `DelegationEnvelope.technicalContext` to see whether skills land in the dispatch envelope.

## Findings

### F1 - There is no first-class "skill" loader; the analogue is the knowledge system

The only top-level `src/knowledge/` exports are project identity helpers, while the actual runtime knowledge subsystem lives under `src/hooks/knowledge-*` and `src/tools/knowledge-*`. The plugin config exposes `knowledge.enabled`, swarm/hive entry limits, injection count and character budget, scope filtering, and hive enablement. Citations: `src/knowledge/index.ts:1`, `src/knowledge/index.ts:3`, `src/config/schema.ts:822`, `src/config/schema.ts:823`, `src/config/schema.ts:825`, `src/config/schema.ts:827`, `src/config/schema.ts:829`, `src/config/schema.ts:833`, `src/config/schema.ts:835`, `src/config/schema.ts:841`, `src/config/schema.ts:842`, `src/config/schema.ts:844`.

The durable stores are project-local `.swarm/knowledge.jsonl`, project-local `.swarm/knowledge-rejected.jsonl`, and a platform-level hive file `shared-learnings.jsonl`. That means the reusable pattern is not "load agent skills from a catalog"; it is "retrieve compact lessons from scoped persistent knowledge stores." Citations: `src/hooks/knowledge-store.ts:36`, `src/hooks/knowledge-store.ts:38`, `src/hooks/knowledge-store.ts:41`, `src/hooks/knowledge-store.ts:43`, `src/hooks/knowledge-store.ts:47`, `src/hooks/knowledge-store.ts:72`.

### F2 - Automatic phase-start knowledge injection targets the architect, not workers

The knowledge injector says it injects relevant swarm+hive knowledge into the architect context at phase start and skips non-architect agents. The implementation enforces that with `isOrchestratorAgent`, which strips the swarm prefix and only allows base role `architect`. Citations: `src/hooks/knowledge-injector.ts:1`, `src/hooks/knowledge-injector.ts:3`, `src/hooks/knowledge-injector.ts:4`, `src/hooks/knowledge-injector.ts:5`, `src/hooks/knowledge-injector.ts:102`, `src/hooks/knowledge-injector.ts:103`, `src/hooks/knowledge-injector.ts:107`, `src/hooks/knowledge-injector.ts:208`, `src/hooks/knowledge-injector.ts:209`, `src/hooks/knowledge-injector.ts:211`.

This hook is registered as an `experimental.chat.messages.transform` handler, not as part of the Task payload. It inserts a system message before the last user message, caches same-phase injection for compaction recovery, and builds the read context from plan title plus current phase. Citations: `src/index.ts:472`, `src/index.ts:473`, `src/index.ts:1001`, `src/index.ts:1007`, `src/hooks/knowledge-injector.ts:110`, `src/hooks/knowledge-injector.ts:128`, `src/hooks/knowledge-injector.ts:138`, `src/hooks/knowledge-injector.ts:143`, `src/hooks/knowledge-injector.ts:213`, `src/hooks/knowledge-injector.ts:214`, `src/hooks/knowledge-injector.ts:216`, `src/hooks/knowledge-injector.ts:224`, `src/hooks/knowledge-injector.ts:228`, `src/hooks/knowledge-injector.ts:229`, `src/hooks/knowledge-injector.ts:230`.

### F3 - The injected architect block is budgeted, ranked, and includes more than lessons

The injector reads merged swarm+hive knowledge, adds optional drift and curator briefing preambles, fetches run memory, then assembles in priority order: lessons, run memory, drift preamble, and rejected-pattern warnings. Citations: `src/hooks/knowledge-injector.ts:233`, `src/hooks/knowledge-injector.ts:234`, `src/hooks/knowledge-injector.ts:242`, `src/hooks/knowledge-injector.ts:243`, `src/hooks/knowledge-injector.ts:256`, `src/hooks/knowledge-injector.ts:258`, `src/hooks/knowledge-injector.ts:282`, `src/hooks/knowledge-injector.ts:283`, `src/hooks/knowledge-injector.ts:285`, `src/hooks/knowledge-injector.ts:286`, `src/hooks/knowledge-injector.ts:290`, `src/hooks/knowledge-injector.ts:302`, `src/hooks/knowledge-injector.ts:308`, `src/hooks/knowledge-injector.ts:314`, `src/hooks/knowledge-injector.ts:333`, `src/hooks/knowledge-injector.ts:349`, `src/hooks/knowledge-injector.ts:350`.

`readMergedKnowledge` merges swarm and hive entries, gives hive precedence on duplicates, filters by `scope_filter`, excludes archived entries, and ranks by category, confidence, and keyword scores. Citations: `src/hooks/knowledge-reader.ts:293`, `src/hooks/knowledge-reader.ts:299`, `src/hooks/knowledge-reader.ts:303`, `src/hooks/knowledge-reader.ts:309`, `src/hooks/knowledge-reader.ts:313`, `src/hooks/knowledge-reader.ts:324`, `src/hooks/knowledge-reader.ts:333`, `src/hooks/knowledge-reader.ts:361`, `src/hooks/knowledge-reader.ts:362`, `src/hooks/knowledge-reader.ts:364`, `src/hooks/knowledge-reader.ts:370`, `src/hooks/knowledge-reader.ts:371`.

### F4 - Coder workers get a separate automatic "context pack" after scope declaration

`system-enhancer.ts` has a coder-only context pack. When the active base role is `coder`, it reads the session's declared coder scope, uses the first file as a knowledge query, calls `knowledge_recall`, and injects a `## CONTEXT FROM KNOWLEDGE BASE` block when results exist. Citations: `src/hooks/system-enhancer.ts:850`, `src/hooks/system-enhancer.ts:851`, `src/hooks/system-enhancer.ts:852`, `src/hooks/system-enhancer.ts:853`, `src/hooks/system-enhancer.ts:855`, `src/hooks/system-enhancer.ts:857`, `src/hooks/system-enhancer.ts:858`, `src/hooks/system-enhancer.ts:860`, `src/hooks/system-enhancer.ts:863`, `src/hooks/system-enhancer.ts:864`, `src/hooks/system-enhancer.ts:880`, `src/hooks/system-enhancer.ts:888`, `src/hooks/system-enhancer.ts:889`.

The same coder pack can also inject prior reviewer rejections from task evidence and repo-graph localization for the declared primary file. This is the closest swarm analogue to worker auto-loading: it is role-specific, scope-keyed, and hook-injected rather than carried in the static coder prompt. Citations: `src/hooks/system-enhancer.ts:898`, `src/hooks/system-enhancer.ts:900`, `src/hooks/system-enhancer.ts:908`, `src/hooks/system-enhancer.ts:929`, `src/hooks/system-enhancer.ts:931`, `src/hooks/system-enhancer.ts:937`, `src/hooks/system-enhancer.ts:941`, `src/hooks/system-enhancer.ts:949`, `src/hooks/system-enhancer.ts:953`, `src/hooks/system-enhancer.ts:955`, `src/hooks/system-enhancer.ts:960`.

### F5 - Architect dispatch still performs explicit knowledge selection before coder delegation

The architect prompt requires a pre-delegation "dark matter co-change detection" step: after declaring scope but before final task files, call `knowledge_recall` with `hidden-coupling primaryFile`, then add returned files to `AFFECTS` with a blast-radius note if relevant. Citations: `src/agents/architect.ts:1184`, `src/agents/architect.ts:1186`, `src/agents/architect.ts:1190`.

This means context flow is mixed: some worker context is hook-injected, but architect dispatch remains responsible for using knowledge to expand scope and pass relevant implementation context.

### F6 - `technicalContext` is only a string field, not a typed skill/context container

The delegation envelope includes `technicalContext: string` and no structured skill, capability, context-pack, or loader metadata field. Combined with the coder prompt's `INPUT: [requirements/context]` format, this points to untyped human-readable context being passed through dispatch, while automatic retrieval happens elsewhere in hooks. Citations: `src/types/delegation.ts:6`, `src/types/delegation.ts:11`, `src/types/delegation.ts:12`, `src/types/delegation.ts:13`, `src/agents/coder.ts:11`, `src/agents/coder.ts:12`, `src/agents/coder.ts:13`, `src/agents/coder.ts:14`, `src/agents/coder.ts:15`, `src/agents/coder.ts:16`.

### F7 - Role-scoped context filtering exists, but preserves knowledge and delegation envelopes

`role-filter.ts` supports `[FOR: ...]` tags and agent-name matching, but it treats system prompts, user delegation envelopes, plan content, and knowledge content as never-filtered. Citations: `src/context/role-filter.ts:1`, `src/context/role-filter.ts:2`, `src/context/role-filter.ts:22`, `src/context/role-filter.ts:25`, `src/context/role-filter.ts:101`, `src/context/role-filter.ts:103`, `src/context/role-filter.ts:104`, `src/context/role-filter.ts:105`, `src/context/role-filter.ts:106`, `src/context/role-filter.ts:114`, `src/context/role-filter.ts:116`, `src/context/role-filter.ts:122`, `src/context/role-filter.ts:125`, `src/context/role-filter.ts:126`, `src/context/role-filter.ts:184`, `src/context/role-filter.ts:204`, `src/context/role-filter.ts:214`.

This is useful for a future `@code` design as a context-delivery filter, but it is not itself a skill loader.

### F8 - `/swarm knowledge` manages the store; it is not a dispatch-time loader

The knowledge command can migrate `.swarm/context.md` into knowledge, list entries, quarantine entries, and restore entries. That provides operational management for the knowledge base, not automatic worker selection. Citations: `src/commands/knowledge.ts:40`, `src/commands/knowledge.ts:44`, `src/commands/knowledge.ts:81`, `src/commands/knowledge.ts:86`, `src/commands/knowledge.ts:122`, `src/commands/knowledge.ts:126`, `src/commands/knowledge.ts:132`, `src/commands/knowledge.ts:133`, `src/commands/knowledge.ts:161`, `src/commands/knowledge.ts:165`, `src/commands/knowledge.ts:170`, `src/commands/knowledge.ts:171`.

## Implications for a new `@code` LEAF agent

The reusable pattern is a two-stage context model:

1. Keep `@code` static prompt small and role-pure.
2. Let the orchestrator choose task-specific context explicitly in the dispatch payload.
3. Add a hook-level context pack keyed by declared scope, primary file, or task metadata.
4. Keep auto-loaded context compact, budgeted, ranked, and visibly labeled.
5. Treat persistent lessons as knowledge, not executable skills.

For this repo's `@code`, the closest analogue would be: `@orchestrate` declares scope and dispatches concrete files/context; a runtime hook, if available, can inject relevant memory/spec/codegraph snippets into `@code` based on that declared scope. The LEAF agent should not independently choose broad skills or dispatch other agents.

## Remaining Questions

- Q2: stack-agnostic detection.

## Iteration Status

Status: insight.
New information ratio: 0.72.
Questions resolved this iteration: Q1.
