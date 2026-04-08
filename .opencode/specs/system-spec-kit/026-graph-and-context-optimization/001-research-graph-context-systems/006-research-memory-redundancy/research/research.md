# Research: Memory Save Redundancy vs Static Spec Docs

## 1. Executive Summary

- Generated memory saves are currently over-owning packet narrative. In the chartered sample set, `002` and `003/001` are high-overlap cases and the `003` root packet is a medium-overlap case. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:114-150] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:194-217] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:262-390] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:204-233] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:242-426] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:175-249] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:275-518]
- The redundancy comes from the collector plus workflow plus template contract, not from thin CLI wrapping and not from missing static-doc sections. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:913-963] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1022-1104] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1416-1509] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:44-57] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/decision-record.md:20-110] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md:20-104]
- The recall system needs a compact retrieval wrapper: specific title, meaningful trigger phrases, anchor-rich semantic evidence, continuation state, and metadata. It does not need a second ADR or implementation summary. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:267-339] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:311-412] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156-170] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:444-520] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:243-294]
- The recommended fix is to make `decision-record.md` and `implementation-summary.md` the canonical narrative owners, while the memory file points to them and keeps only compact distinguishing evidence plus recovery metadata. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1457-1473] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:243-345] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:461-619]
- No required expansion of the static spec-doc templates is necessary. The main work is in extractor output selection, workflow bindings, template contract rules, and the memory body template. [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/decision-record.md:20-110] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md:20-104]

## 2. Research Question

Eliminate redundancy between memory saves and the static spec docs `decision-record.md` and `implementation-summary.md` in spec packets. The user has noticed that memory saves frequently re-state content that is already captured in those two files, making the saves feel "extra." Investigate:

1. What specific content patterns the generated memory file duplicates from the same packet's `decision-record.md` and `implementation-summary.md`, quantified by section.
2. What unique value a memory save provides that a static spec doc cannot.
3. Whether the redundancy is produced by the generator extractors, the memory template, the static templates, or AI-authored JSON payload composition.
4. What the memory system actually needs to find a packet later.
5. What concrete generator/template changes would eliminate duplication while preserving recall semantics.

## 3. Methodology

- Iterations completed: 4.
- Packet samples audited directly: `002-implement-cache-warning-hooks`, `003-memory-quality-issues` root, `003-memory-quality-issues/001-foundation-templates-truncation`, plus empty-memory inventories for `003/002-007` and `005-013`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-research-memory-redundancy/research/iterations/iteration-003.md:3-9]
- Generator/runtime sources audited: collector, implementation-guide extractor, workflow bindings, memory metadata builder, template contract, body template, parser, trigger matching, search handler, and save-time sufficiency checks. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-research-memory-redundancy/research/iterations/iteration-002.md:3-10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-research-memory-redundancy/research/iterations/iteration-004.md:3-9]
- Citation convention: every substantive claim is grounded with `[SOURCE: path:line]` references to audited files or durable iteration artifacts.

## 4. Findings

### Q1. Content overlap audit

- `002-implement-cache-warning-hooks` duplicates overview or outcome narrative, decision prose, and file/doc inventory across both `decision-record.md` and `implementation-summary.md`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:114-150] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:194-217] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:262-390] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/decision-record.md:21-118] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:33-95]
- `003-memory-quality-issues` root duplicates packet status, workstream ordering, and decision headlines against `implementation-summary.md`. No same-folder `decision-record.md` exists, so the overlap is narrower but still real. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:105-130] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:204-233] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:242-426] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/implementation-summary.md:32-89]
- `003/001-foundation-templates-truncation` duplicates implementation guide, overview, follow-up story, and decision rationale against `implementation-summary.md`; it behaves like a second expanded implementation summary. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:175-216] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:223-249] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:261-265] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:275-518] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/implementation-summary.md:33-117]
- `003/002-007` and `005-013` currently have no generated memory `.md`, so present overlap is zero there. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-research-memory-redundancy/research/iterations/iteration-003.md:17-20]

### Q2. Unique value of memory saves

- Memory saves uniquely carry retrieval-oriented metadata and recovery state: continuation summary, tool-call and exchange summaries, memory classification, decay settings, dedup fingerprinting, causal links, and postflight learning deltas. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1073-1104] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1469-1509] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:17-252] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:272-279] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:676-760]
- Save-time sufficiency proves that a much smaller body is enough: title specificity, evidence counts, semantic substance, anchors, and trigger phrases are the actual hard gates. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:267-339] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:311-412] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:285-323]

### Q3. Source of redundancy

- The collector synthesizes `OUTCOMES`, `SUMMARY`, `OBSERVATIONS_DETAILED`, `SPEC_FILES`, `implementationGuide`, project-state snapshots, and continuation data before render. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:913-963] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1022-1104]
- The workflow then binds full decisions, implementation-summary fragments, `IMPL_*` arrays, key files, and memory metadata into the template context. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1433-1509]
- The contract and template turn that payload into packet-shaped markdown, making duplication the default rendered form. [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:44-57] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:173-184] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:243-345] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:461-619]

### Q4. Recall semantics preservation

- Trigger surfacing is driven mainly by trigger phrases and tiered content truncation; WARM memories only contribute the first 150 characters. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156-170] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:444-520]
- Parsing and search care about title, trigger phrases, context type, importance tier, content hash, and body content, but `includeContent` is optional for retrieval output. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:243-294] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:396-443] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:684-723]
- The practical minimum is: specific title, meaningful trigger phrases, at least one anchor-rich overview/evidence section, 2-3 compact evidence bullets, continuation state, and metadata. That is enough to preserve sufficiency and retrieval semantics while dropping duplicated long-form packet narrative. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:267-339] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:311-412]

### Q5. Concrete change proposal

- Change the collector to keep compact evidence inputs and canonical-doc discovery, not full packet-summary render inputs by default. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:913-963] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:344-369]
- Change workflow binding to stop passing full `DECISIONS`, `IMPLEMENTATION_SUMMARY`, `IMPL_*`, and `KEY_FILES` into the default memory body. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1457-1473]
- Change the template contract and body template so the default memory shape becomes canonical-doc pointers plus compact evidence, recovery state, and metadata. [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:44-57] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:243-345] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:461-760]
- Keep canonical ownership in static docs: `decision-record.md` owns ADR prose, `implementation-summary.md` owns build story and verification, and review/research docs may be optional third pointers when context type requires them. [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/decision-record.md:20-110] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md:20-104]

## 5. Content Overlap Matrix

| Packet | Same-packet static docs present | Duplicated memory sections | Quantified overlap | Evidence |
|---|---|---|---|---|
| `002-implement-cache-warning-hooks` | `decision-record.md`, `implementation-summary.md` | Overview or outcomes, decisions, file/doc inventory | `3/4` major content groups duplicated; high | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:114-150] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:194-217] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:262-390] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/decision-record.md:21-118] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:33-95] |
| `003-memory-quality-issues` root | `implementation-summary.md` only | Packet status, next action, workstream ordering, decision headlines | `2/3` major groups duplicated; medium | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:105-130] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:204-233] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:242-426] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/implementation-summary.md:32-89] |
| `003/001-foundation-templates-truncation` | `implementation-summary.md` only | Implementation guide, overview/outcomes, follow-up narrative, decisions | `4/4` major groups duplicated; high | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:175-216] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:223-249] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:261-265] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:275-518] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/implementation-summary.md:33-117] |
| `003/002-007` and `005-013` remainder | Static docs exist, but generated memory `.md` does not | None now | `0` current duplicated sections | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-research-memory-redundancy/research/iterations/iteration-003.md:17-20] |

## 6. Source-of-Redundancy Analysis

- Layer 1, collector: builds reusable evidence plus narrative restatement structures (`SUMMARY`, `OUTCOMES`, `implementationGuide`, `SPEC_FILES`, project state, continuation state). [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:913-963] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1022-1104]
- Layer 2, workflow binding: maps those structures directly into render variables for long-form packet sections. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1433-1509]
- Layer 3, template contract: currently requires a packet-shaped body, including `DECISIONS`, `CONVERSATION`, and `RECOVERY HINTS` as mandatory sections. [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:44-57]
- Layer 4, template body: expands the packet-shape into large implementation guide, overview, detailed changes, decisions, and conversation blocks. [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:243-345] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:369-619]
- Ruled out: static-doc templates being too narrow. They already own the narrative sections that memory saves are replaying. [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/decision-record.md:20-110] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md:20-104]

## 7. Generator + Template Code Review

- `collect-session-data.ts` should keep evidence extraction, continuation state, and spec-file discovery, but stop treating `implementationGuide` and large outcome/file collections as default render surfaces when canonical static docs exist. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:913-963] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1069-1104]
- `buildImplementationGuideData()` is currently a narrative expander. Its output should become opt-in or fallback-only, not default for packets that already have `implementation-summary.md`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:344-369]
- `workflow.ts` should stop passing these default render variables into the template: `DECISIONS`, `IMPLEMENTATION_SUMMARY`, `IMPL_TASK`, `IMPL_FILES_CREATED`, `IMPL_FILES_MODIFIED`, `IMPL_DECISIONS`, `IMPL_OUTCOMES`, and `KEY_FILES`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1433-1473]
- `memory-template-contract.ts` should shrink its mandatory body set and add a canonical-docs section instead of requiring `DECISIONS` and `CONVERSATION` for all saves. [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:44-57]
- `context_template.md` should render a small retrieval wrapper rather than a packet clone. [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:243-345] [SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:461-760]

## 8. Memory Recall Semantics

- Mandatory for robust recall:
  - Specific title. [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:377-384]
  - Meaningful trigger phrases. [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:359-370]
  - Semantic evidence: at least one primary and two total evidence items, with sufficient substance. [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:315-355] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:388-405]
  - At least one anchor in the rendered content. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:338-346] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:359-370]
  - Metadata for decay, dedup, and retrieval tuning. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:121-252]
- Helpful but compact:
  - Continuation state, next action, blockers, and a short distinguishing summary. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1073-1104]
  - Tool-call and exchange summaries. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1488-1509]
- Not required in default saves:
  - Full ADR expansion.
  - Full implementation guide.
  - Full detailed changes.
  - Full conversation transcript. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156-170] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:400-423]

## 9. Recommendations

1. Reframe the default memory as a retrieval wrapper, not a packet narrative.
   Effort: Medium.
   Dependency: update contract and template together.
2. Make canonical static docs the owners of long-form meaning.
   Effort: Low.
   Dependency: collector discovers companion docs and workflow passes canonical pointers.
3. Keep compact evidence and metadata in memory saves.
   Effort: Medium.
   Dependency: build a `DISTINGUISHING_EVIDENCE` payload from existing evidence sources.
4. Make long-form sections fallback-only or opt-in.
   Effort: Medium.
   Dependency: gating logic in collector/workflow for packets without companion docs.
5. Do not expand static templates unless later authoring friction proves it necessary.
   Effort: Low.
   Dependency: none.

## 10. Per-File Change Proposals

### `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`

```diff
- const implementationGuide = buildImplementationGuideData(observations, FILES, folderName);
- const OUTCOMES = ...
- const SPEC_FILES = await detectRelatedDocs(specFolderPath);
+ const SPEC_FILES = await detectRelatedDocs(specFolderPath);
+ const CANONICAL_DOCS = deriveCanonicalDocPointers(SPEC_FILES, {
+   contextType,
+   preferDecisionRecord: true,
+   preferImplementationSummary: true,
+   preferReviewReport: contextType === 'review',
+   preferResearchReport: contextType === 'research',
+ });
+ const DISTINGUISHING_EVIDENCE = buildDistinctiveEvidence({
+   observations,
+   files: FILES,
+   outcomes: OUTCOMES,
+   nextAction,
+   blockers,
+   limit: 4,
+ });
+ const implementationGuide = CANONICAL_DOCS.hasImplementationSummary
+   ? EMPTY_IMPLEMENTATION_GUIDE
+   : buildImplementationGuideData(observations, FILES, folderName);
```

- Keep raw evidence arrays for sufficiency scoring and embeddings.
- Add canonical-doc detection and compact evidence selection.
- Only build implementation-guide narrative when no canonical `implementation-summary.md` exists or an explicit override requests it.

### `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`

```diff
- DECISIONS: decisions.DECISIONS.map(...)
- IMPLEMENTATION_SUMMARY: IMPL_SUMMARY_MD,
- IMPL_TASK: implSummary.task,
- IMPL_FILES_CREATED: implSummary.filesCreated,
- IMPL_FILES_MODIFIED: implSummary.filesModified,
- IMPL_DECISIONS: implSummary.decisions,
- IMPL_OUTCOMES: implSummary.outcomes,
- KEY_FILES: keyFiles,
+ CANONICAL_DOCS: sessionData.CANONICAL_DOCS,
+ DISTINGUISHING_EVIDENCE: sessionData.DISTINGUISHING_EVIDENCE,
+ DECISION_HEADLINES: decisions.DECISIONS.slice(0, 2).map(d => d.TITLE),
+ HAS_EXPANDED_DECISIONS: false,
+ HAS_IMPLEMENTATION_GUIDE: implementationGuide.HAS_IMPLEMENTATION_GUIDE,
+ KEY_FILES: [],
```

- Stop binding long-form packet-summary inputs into the default memory body.
- Keep only compact evidence, doc pointers, counts, and metadata.
- If there is no canonical static doc, allow a fallback render mode that re-enables compact decision headlines or implementation guide bullets.

### `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts`

```diff
 const SECTION_RULES = [
   { sectionId: 'preflight', required: 'conditional' },
-  { sectionId: 'continue-session', required: 'mandatory' },
-  { sectionId: 'project-state-snapshot', required: 'mandatory' },
-  { sectionId: 'implementation-guide', required: 'conditional' },
-  { sectionId: 'overview', required: 'conditional' },
-  { sectionId: 'detailed-changes', required: 'conditional' },
-  { sectionId: 'workflow-visualization', required: 'conditional' },
-  { sectionId: 'decisions', required: 'mandatory' },
-  { sectionId: 'conversation', required: 'mandatory' },
-  { sectionId: 'recovery-hints', required: 'mandatory' },
+  { sectionId: 'continue-session', required: 'mandatory' },
+  { sectionId: 'canonical-docs', required: 'mandatory' },
+  { sectionId: 'overview', required: 'mandatory' },
+  { sectionId: 'evidence', required: 'mandatory' },
+  { sectionId: 'recovery-hints', required: 'mandatory' },
   { sectionId: 'postflight-learning-delta', required: 'conditional' },
   { sectionId: 'memory-metadata', required: 'mandatory' },
 ];
```

- Merge project-state snapshot into continuation state.
- Add canonical-doc and compact evidence sections.
- Remove full decisions and conversation as mandatory contract requirements.

### `.opencode/skill/system-spec-kit/templates/context_template.md`

```diff
- TOC: CONTINUE SESSION / PROJECT STATE SNAPSHOT / IMPLEMENTATION GUIDE / OVERVIEW / DETAILED CHANGES / WORKFLOW VISUALIZATION / DECISIONS / CONVERSATION / RECOVERY HINTS / MEMORY METADATA
+ TOC: CONTINUE SESSION / CANONICAL SOURCES / OVERVIEW / DISTINGUISHING EVIDENCE / RECOVERY HINTS / POSTFLIGHT LEARNING DELTA / MEMORY METADATA

- ## PROJECT STATE SNAPSHOT
- ## IMPLEMENTATION GUIDE
- ## DETAILED CHANGES
- ## DECISIONS
- ## CONVERSATION
+ ## CANONICAL SOURCES
+ - decision-record.md
+ - implementation-summary.md
+ - review/review-report.md or research/research.md when present
+ ## OVERVIEW
+ {{SUMMARY}}
+ ## DISTINGUISHING EVIDENCE
+ - {{EVIDENCE_ITEM}}
```

- Keep the frontmatter and metadata block.
- Keep compact continuation and recovery sections.
- Replace packet-shaped prose blocks with canonical-doc pointers and 3-4 evidence bullets.
- Keep postflight delta conditional.

### Static templates

- Required additions: N/A.
- Optional addition: if authors later want more visibility, add a small “Canonical companion docs” note to `implementation-summary.md` and `decision-record.md`, but the contract change does not depend on it. [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/decision-record.md:20-110] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md:20-104]

## 11. Risks and Tradeoffs

- Shorter memories may reduce human readability for someone opening the raw file directly, even while improving non-redundant retrieval quality.
- Fallback handling is important: packets without canonical static docs still need enough evidence to stand alone.
- Contract/template changes must ship together; otherwise `memory-save` may reject valid reduced memories or historical memories may parse incorrectly. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:285-323] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:44-57]
- Historical memories will remain packet-shaped. The proposal changes future saves first; optional backfill can come later.

## 12. Open Questions

- Optional third canonical pointer policy could use a final naming rule: always show a generic “canonical docs” list, or vary labels by context type (`review-report`, `research`, `implementation-summary`). This does not block the main contract change.

## 13. Ruled-Out Directions

- Reworking the database or search backend. Non-goal, and the code review showed the current retrieval path can support smaller memories. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-research-memory-redundancy/research/deep-research-strategy.md:49-54]
- Expanding static templates to absorb missing sections. The existing Level 3 templates already own those sections. [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/decision-record.md:20-110] [SOURCE: .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md:20-104]
- Keeping full decisions and conversation sections in every default memory save. Retrieval semantics do not justify that cost. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156-170] [SOURCE: .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:311-412]

## 14. Cited Evidence Index

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:114-150`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:194-217`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:262-390`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/decision-record.md:21-118`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/implementation-summary.md:33-95`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:204-233`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/memory/08-04-26_14-26__ran-7-iteration-deep-review-on-this-packet.md:242-426`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/implementation-summary.md:32-89`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:175-249`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:275-518`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/implementation-summary.md:33-117`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:913-963`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1022-1104`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1416-1509`
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:267-339`
- `.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts:311-412`
- `.opencode/skill/system-spec-kit/shared/parsing/memory-template-contract.ts:44-57`
- `.opencode/skill/system-spec-kit/templates/context_template.md:243-345`
- `.opencode/skill/system-spec-kit/templates/context_template.md:461-760`
- `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md:20-110`
- `.opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md:20-104`

## 15. Convergence Report

- Stop reason: `all_questions_answered`.
- Iterations completed: `4 / 10`.
- New-info ratios: `0.90`, `0.72`, `0.58`, `0.41`.
- Rolling average of the last three ratios: `0.57`.
- Question coverage: `5 / 5 = 1.00`.
- Quality guard status: satisfied; more than 3 questions are answered with citations.

## 16. Methodology Limitations

- The chartered folder family only had three live generated memory samples. Many later packets already had static docs but no generated memory `.md`, so those were audited as present-zero overlap rather than direct duplicate bodies.
- I did not run a live reduced-memory generation experiment. The minimum payload recommendation is grounded in sufficiency, trigger-tiering, parser, and search code rather than a fresh generated fixture.
- This research intentionally excluded backend/indexing redesign and did not attempt to score retrieval quality numerically.

## 17. Next Steps

1. Patch the four main files named in Section 10.
2. Generate 2-3 reduced sample memories in a scratch packet and verify:
   `memory-save` passes sufficiency and contract validation,
   `memory_match_triggers` still surfaces the packet from trigger phrases,
   `memory_search` still returns the packet with `includeContent=false` and `includeContent=true`.
3. If the reduced saves behave well, migrate the default generator/template path and leave historical packet-shaped memories untouched.
