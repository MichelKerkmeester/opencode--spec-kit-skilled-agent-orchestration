# Iteration 1: Parser Contract Probe And Irreducible Core Inventory

## Focus

PARSER CONTRACT PROBE (Q4) plus IRREDUCIBLE CORE INVENTORY (Q1). This pass reads the named parser and validator files, then walks a hypothetical greenfield packet containing only `spec.md`, `description.json`, and `graph-metadata.json`.

## Actions Taken

- Read `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` end-to-end.
- Read `.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts` end-to-end.
- Read `.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts` end-to-end.
- Read `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` end-to-end.
- Read `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` end-to-end.
- Read `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh` end-to-end.
- Read `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh` end-to-end.
- Read `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh` end-to-end.
- Probed adjacent contracts needed for Q1: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`.

## Findings

### Parser Contract Map

| Parser File | Frontmatter Fields Read | Anchor Patterns Matched | On Absence (Hard/Warn/Skip) | Section Heading Expectations |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` | None. This file reads template content, not YAML frontmatter. | Opens: `<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->`; closes: `<!--\s*/ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->`. Custom allowed anchors include `decision-record.md: decision`, Design-level 3+ spec anchors such as `executive-summary`, `nfr`, `edge-cases`, `complexity`, `risk-matrix`, `user-stories`, `compliance`, `stakeholders`, `changelog`, and dynamic patterns `tasks.md: /^phase-\d+$/`, `decision-record.md: /^adr-\d+$/` plus ADR subsection variants. | Missing template path returns `{ supported:false, reason:"template_not_found" }`. Unclosed anchored sections are silently skipped by `parseAnchoredSections`. Unsupported basename returns no contract. | Extracts all `## ...` headings with `^##\s+(.+)$`, strips fenced code, removes `[placeholder]` text and numeric prefixes, uppercases normalized names. Optional headers have prefix `/^L(?:2|3\+?)\s*:/i`. `decision-record.md` has dynamic heading pattern `/^(?:ADR|DR)-\d+\s*:/i`. |
| `.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts` | Does not parse field values. Requires only that `spec.md` has YAML frontmatter via `^---\r?\n[\s\S]*?\r?\n---`. Reads level marker `<!-- SPECKIT_LEVEL: (\d\+?) -->`. | Opens: `<!--\s*ANCHOR:(\S+)\s*-->`; closes: `<!--\s*/ANCHOR:(\S+)\s*-->`. Only pair matching is checked. | Missing folder is an error. Missing required files are errors. Missing `SPECKIT_LEVEL` is a warning. Missing `spec.md` frontmatter is an error. Missing `SPECKIT_TEMPLATE_SOURCE` is a warning. Unclosed/orphan anchors are errors. Bad folder name is an error. Low substance and large files are warnings. | No exact section names required. It strips frontmatter/comments/headings for substance, but does not require named headings. Required file set remains level-based: Level 1 `spec.md`, `plan.md`, `tasks.md`; Level 2 adds `checklist.md`; Level 3 adds `decision-record.md`. |
| `.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts` | Evaluates a `MemoryEvidenceSnapshot`, not spec-folder frontmatter. Reads snapshot fields `title`, `content`, `triggerPhrases`, `sourceClassification`, `files[].path`, `files[].description`, `files[].synthetic`, `files[].provenance`, `files[].specRelevant`, `observations[].title`, `observations[].narrative`, `observations[].facts`, `decisions`, `nextActions`, `blockers`, `outcomes`, `recentContext[].request`, `recentContext[].learning`, and `anchors`. | Extracts anchor opens only with `<!--\s*(?:ANCHOR|anchor):\s*([a-zA-Z0-9][a-zA-Z0-9-/]*)\s*-->`. No close-anchor validation and no required anchor IDs. | Missing or generic title adds rejection reason. No primary evidence rejects unless manual fallback is eligible. Fewer than two evidence items rejects. Low semantic substance rejects. Manual fallback without at least three support items and one anchor rejects. Returns structured insufficiency, not an exception. | Extracts any Markdown heading with `^#{1,6}\s+(.+)$`. Generic headings such as `Overview`, `Summary`, `Context`, `Notes`, `Details`, `Implementation Summary`, `Technical Context`, `Progress`, and `Metadata` do not help unless body has concrete file/decision/tool signals. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | JSON config fields: `resource_map.emit` or `resourceMap.emit`, `topic`, `createdAt`, `status`, `maxIterations`, `lineage.sessionId`, `lineage.parentSessionId`, `lineage.lineageMode`, `lineage.generation`, `lineage.continuedFromRun`. State JSONL fields: `type`, `iteration`/`run`, `newInfoRatio`, `status`, `focus`, `focusTrack`, `findingsCount`, `timestamp`, `answeredQuestions`, `sourcesQueried`, `convergenceSignals.compositeStop`, and event fields such as `event`, `signals`, `decision`, `blockers`. It reads no YAML frontmatter. | Strategy anchors replaced exactly as `<!-- ANCHOR:${anchorId} -->...<!-- /ANCHOR:${anchorId} -->` for `key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, and `next-focus`. | Missing config/state/strategy files hard fail via `readFileSync`. Corrupt JSONL hard fails unless `--lenient`. Missing iteration directory is allowed as empty. Missing strategy anchor hard throws. Missing delta files only skips resource-map emission. | Iteration markdown parser expects exact second-level headings: `## Focus`, `## Findings`, `## Ruled Out`, `## Dead Ends`, `## Sources Consulted`, `## Reflection`, and `## Recommended Next Focus`. Strategy question parser expects `## 3. KEY QUESTIONS (remaining)` with `- [ ]` or `- [x]` items. Reflection labels are exact bullets: `What worked and why`, `What did not work and why`, `What I would do differently`. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` | None. | None. | Ordinary folder: missing `spec.md`, `plan.md`, or `tasks.md` is hard fail. If checklist has completed items, missing `implementation-summary.md` is hard fail. Level 1 with completed tasks and no implementation summary is hard fail. Level 2 missing `checklist.md` is hard fail. Level 3 missing `decision-record.md` is hard fail. Phase parent branch requires only `spec.md`. | No heading checks. It depends only on detected level and phase-parent detection. Phase parent means at least one direct child matching `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` and that child has `spec.md` or `description.json`. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh` | For existing spec docs that start with `---`, it requires non-empty scalar fields `title`, `description`, `importance_tier`, `contextType`, plus a non-empty `trigger_phrases` value, inline or list. It also checks every existing spec doc for `SPECKIT_TEMPLATE_SOURCE` unless skipped. | None. | If first line is `---` and no closing `---`, hard fail. If frontmatter exists but required semantic fields are empty, hard fail unless grandfathered. If no frontmatter exists, semantic checks are skipped by this script. Missing `SPECKIT_TEMPLATE_SOURCE` is hard fail. | No heading checks. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh` | None. | None. | If no spec documentation files exist, pass/skipped. For each existing `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`, missing `SPECKIT_TEMPLATE_SOURCE:` in the first 20 lines is hard fail. | No heading checks. |
| `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh` | No YAML frontmatter. Reads `implementation-summary*.md` table row `| **Spec Folder** | ... |`. Reads `handover*.md` body lines `**Spec**: ...` and `/spec_kit:resume ...`. | No Spec Kit anchors. Extracts local Markdown links: inline `[label](path.md)`, angle-bracket inline `[label](<path.md>)`, and reference definitions `[label]: ./path.md`; strips anchors/query fragments and ignores URL/mailto targets. | Missing local markdown link target is hard fail. `implementation-summary*.md` stale Spec Folder metadata is hard fail. `handover*.md` missing `**Spec**` path or resume target is hard fail. With no issues, pass. | No required section headings. |

Additional parser contracts that matter for Q1:

- `/spec_kit:resume` uses `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`. It resolves an explicit or cached spec folder under `.opencode/specs/` or `specs/`, reads `handover.md`, then `_memory.continuity` inside `implementation-summary.md`, then spec docs. Spec-doc fallback only needs at least one discovered spec doc. Priority order is `implementation-summary.md`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `research.md`, `handover.md`, `resource-map.md`.
- Thin continuity requires `_memory.continuity.packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, and `next_safe_action`. Optional fields are `blockers`, `key_files`, `session_dedup`, `completion_pct`, `open_questions`, and `answered_questions`. The record must serialize under 2048 bytes.
- `description.json` schema requires `specFolder`, `description`, `keywords`, and `lastUpdated`. Optional fields include `specId`, `folderSlug`, `parentChain`, `memorySequence`, `memoryNameHistory`, `title`, `type`, `trigger_phrases`, and `path`.
- `graph-metadata.json` schema requires `schema_version: 1`, `packet_id`, `spec_folder`, `parent_id`, `children_ids`, `manual.depends_on`, `manual.supersedes`, `manual.related_to`, and `derived` fields `trigger_phrases`, `key_topics`, `importance_tier`, `status`, `key_files`, `entities`, `causal_summary`, `created_at`, `last_save_at`, `last_accessed_at`, and `source_docs`.
- The memory parser indexes `description.json` as `description_metadata` and derives trigger phrases from its description metadata. It indexes `graph-metadata.json` as `graph_metadata`, validates the graph schema, and uses `metadata.derived.trigger_phrases`, `metadata.derived.importance_tier`, and `metadata.spec_folder`.

### Irreducible Core Verdict

The tested hypothesis is false for ordinary, non-phase-parent spec folders under the current validator.

Hypothesis: irreducible core equals `{spec.md with minimum frontmatter, description.json, graph-metadata.json}`.

Observed outcome by subsystem:

| Functionality | Does `{spec.md, description.json, graph-metadata.json}` work? | Verdict |
|---|---:|---|
| `validate.sh --strict` exits 0 or 1 | No for ordinary folders. `check-files.sh` hard-fails missing `plan.md` and `tasks.md`. `check-template-source.sh` also fails any existing spec doc lacking a `SPECKIT_TEMPLATE_SOURCE:` marker in the first 20 lines. Strict mode can additionally fail warning-severity rules. | Minimum ordinary authored-template core remains at least `spec.md`, `plan.md`, `tasks.md`, plus valid template-source markers and required frontmatter on any file that has YAML frontmatter. |
| `validate.sh --strict` exits 0 or 1 for phase parent | Potentially yes for file presence if the folder is a phase parent. `check-files.sh` switches to lean policy and requires only `spec.md`, but other rules still apply to the existing `spec.md`, including template source, anchors, folder naming, and strict-only checks. | Lean trio policy is real, but only behind phase-parent shape. |
| `memory_context()` and `memory_match_triggers()` find the packet | Yes if `description.json` and `graph-metadata.json` are schema-valid and indexed. The memory parser has explicit `description_metadata` and `graph_metadata` branches. `trigger-matcher` matches indexed `trigger_phrases`, so graph metadata `derived.trigger_phrases` is a direct trigger source. | Metadata files are sufficient for discovery after indexing, but not a substitute for validator-required authored docs. |
| `/spec_kit:resume` rebuilds context | Yes at fallback level with `spec.md` alone, assuming the explicit `specFolder` resolves. It will emit a hint that `implementation-summary.md` is missing, skip continuity, and fall back to spec docs. A stronger resume requires `handover.md` or valid `_memory.continuity` in `implementation-summary.md`. | Minimum resume fallback is one spec doc, but minimum high-quality resume is `handover.md` or `implementation-summary.md::_memory.continuity`. |
| `code_graph_query` traverses the packet | Likely yes if `graph-metadata.json` is schema-valid and the graph scan indexes spec metadata. The graph metadata schema requires packet identity, manual relationships, and derived source docs. Skill-graph parsing is separate and stricter for skill-local graph files, so the spec packet should rely on spec graph metadata, not skill metadata shape. | Graph traversal anchor is `graph-metadata.json`, but this was inferred from parser/schema reads, not a live graph query. |
| Deep-research reducer can read its own state files | No dependency on spec core docs. It requires `research/deep-research-config.json`, `research/deep-research-state.jsonl`, `research/deep-research-strategy.md`, optional `research/iterations/iteration-NNN.md`, and optional `research/deltas/iter-NNN.jsonl` for resource-map emission. | Workflow-owned packet files are a separate irreducible core for the research loop. |

Minimum frontmatter shape for authored Markdown under the current validators:

```yaml
---
title: "Specific packet title"
description: "Specific packet description with enough retrieval meaning"
trigger_phrases:
  - "specific phrase"
importance_tier: "normal"
contextType: "planning"
---
```

That frontmatter alone is not enough. Any spec doc checked by `check-template-source.sh` also needs a `SPECKIT_TEMPLATE_SOURCE:` marker in the first 20 lines. The source marker is not semantically required by memory parsers, but it is currently hard-required by the shell validator.

Minimum packet identity metadata shape:

```json
{
  "specFolder": "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign",
  "description": "Specific packet description",
  "keywords": ["template-system", "capability-flags"],
  "lastUpdated": "2026-05-01T11:00:00Z"
}
```

Minimum graph metadata shape:

```json
{
  "schema_version": 1,
  "packet_id": "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign",
  "spec_folder": "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign",
  "parent_id": null,
  "children_ids": [],
  "manual": {
    "depends_on": [],
    "supersedes": [],
    "related_to": []
  },
  "derived": {
    "trigger_phrases": ["template-system redesign"],
    "key_topics": ["capability flags"],
    "importance_tier": "normal",
    "status": "active",
    "key_files": ["spec.md"],
    "entities": [],
    "causal_summary": "Packet metadata derived from canonical spec documents.",
    "created_at": "2026-05-01T11:00:00Z",
    "last_save_at": "2026-05-01T11:00:00Z",
    "last_accessed_at": null,
    "source_docs": ["spec.md"]
  }
}
```

Main design implication:

The greenfield redesign should separate two contracts that are currently entangled:

1. Runtime discovery core: `spec.md`, `description.json`, `graph-metadata.json`.
2. Authored validation scaffold: currently `spec.md`, `plan.md`, `tasks.md` for ordinary packets, plus template provenance markers and optional capability-gated docs.

A single manifest can drive both, but it must model capability intent explicitly. If `plan` and `tasks` remain validator-mandatory by default, Design F cannot honestly claim a minimal scaffold. If the manifest marks them as addon capabilities, validator rules must move from level-derived required files to manifest-derived required files.

## Questions Answered

- Q1 is substantially answered. The irreducible runtime discovery core is plausibly `{spec.md, description.json, graph-metadata.json}`, but the irreducible validator core for ordinary folders is not. Current `validate.sh` still requires at least `spec.md`, `plan.md`, and `tasks.md`.
- Q4 is answered for the requested parser files. The exact required parser contract is much smaller than the template taxonomy: required YAML semantic fields for validator frontmatter, optional/freeform anchors for memory sufficiency, exact strategy anchors for deep-research reducer state, and schema-valid metadata JSON for indexed discovery.

## Questions Remaining

- Whether `code_graph_query` indexes spec packet `graph-metadata.json` through the same path as memory parser graph metadata should be verified by a live code-graph query in a later iteration.
- Which existing validators outside the eight probed files encode level taxonomy indirectly: `check-sections.sh`, `check-level-match.sh`, `check-section-counts.sh`, `check-template-headers.sh`, strict TS `spec-doc-structure`, and canonical-save checks remain likely.
- Addon lifecycle classification is still open for `handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`, and `context-index.md`.

## Next Focus

Iteration 2 should focus on addon-doc lifecycle classification (Q3 + Q7). For each cross-cutting addon, identify the writer owner, whether it is author-scaffolded, command-owned-lazy, or workflow-owned-packet, and whether any validator or parser expects it before it exists.

Recommended source set:

- `.opencode/skill/system-spec-kit/templates/handover.md`
- `.opencode/skill/system-spec-kit/templates/debug-delegation.md`
- `.opencode/skill/system-spec-kit/templates/research.md`
- `.opencode/skill/system-spec-kit/templates/resource-map.md`
- `.opencode/skill/system-spec-kit/templates/context-index.md`
- writer scripts or command docs that create/update those files
